<?php

declare(strict_types=1);

namespace Jankx\Benchmarks;

/**
 * Builds a call tree from parsed cachegrind data and renders it as a
 * standalone SVG flame graph.
 *
 * Frame width is proportional to CPU time, so a wide frame means that function
 * accounts for a large share of the profiled CPU time. Frames are coloured by
 * function name hash, so the same function keeps its colour across the graph.
 *
 * One important difference from a classic stack-based flame graph: cachegrind
 * aggregates edges by function name, which makes the call graph a DAG, not a
 * tree. A function reachable through several parents cannot simply be inlined
 * under each of them, because each edge's inclusive cost already re-includes the
 * callee's own subtree - doing that inflated an 11.6 s profile to over 1.6
 * million ms.
 *
 * So the graph here is built from **self time** instead: every function gets
 * exactly one frame, sized by the time spent in its own body, parented under its
 * heaviest caller. The widths therefore sum to the profiler's total self time,
 * which is what makes them trustworthy.
 */
final class FlameGraph
{
    /**
     * Build the tree, one frame per function, sized by self time.
     *
     * @return array{name:string, incl_ns:float, self_ns:float, calls:int, children:array}
     */
    public static function buildTree(
        CachegrindParser $parser,
        int $nodeBudget = 40000
    ): array {
        $selfOf = $parser->selfTimesNs();

        $callsOf   = [];
        $weightOf  = [];
        $childrenOf = [];

        foreach ($parser->allEdges() as $e) {
            $caller = $e['caller'];
            $callee = $e['callee'];

            if ($callee === '' || $caller === '' || $callee === $caller) {
                continue;
            }

            $callsOf[$callee] = ($callsOf[$callee] ?? 0) + (int) $e['calls'];

            // Merge duplicate caller -> callee edges.
            $key = $caller . "\0" . $callee;
            if (isset($weightOf[$key])) {
                $weightOf[$key] += (int) $e['incl_time'];
                continue;
            }

            $weightOf[$key] = (int) $e['incl_time'];
            $childrenOf[$caller][$callee] = true;
        }

        foreach ($childrenOf as $caller => $list) {
            // Heaviest callee first, so the widest frames land on the left.
            uksort(
                $list,
                static fn($a, $b) => ($weightOf[$caller . "\0" . $b] ?? 0)
                    <=> ($weightOf[$caller . "\0" . $a] ?? 0)
            );
        }

        /*
         * The call graph is a DAG, not a tree, so build a spanning tree with a
         * breadth-first walk from {main}: each function is placed exactly once,
         * under its first (shallowest) caller. That single placement rule is
         * what makes the widths trustworthy - a "heaviest caller wins" forest
         * put 5216 of 5577 functions at the root because mutual recursion
         * formed cycles that then had to be broken by promotion.
         *
         * Every timed function is placed, so the drawn self times sum exactly to
         * the profiler total. Functions still unplaced after the walk have no
         * usable path from {main} (their callers are all outside the profile);
         * they are appended at the root so no self time is lost.
         *
         * No fan-out cap here: truncating during the build dropped whole
         * subtrees and made the widths stop adding up. Narrow frames are pruned
         * at render time by pixel width instead, which costs nothing.
         */
        // Pass 1: breadth-first walk from {main} to pick exactly one parent per
        // function. "First placement wins" makes this a spanning tree of the
        // DAG: a second caller or a cycle cannot move or duplicate a frame.
        $parentOf = [];
        $order    = ['{main}' => true];
        $queue    = ['{main}'];

        while ($queue) {
            $name = array_shift($queue);

            foreach ($childrenOf[$name] ?? [] as $callee => $_) {
                if (isset($order[$callee])) {
                    continue;
                }
                $order[$callee] = true;
                $parentOf[$callee] = $name;
                $queue[] = $callee;
            }
        }

        // Pass 2: everything the walk could not reach has no caller inside the
        // profile (or no edges at all), so hang it directly off the root.
        // Every timed function therefore ends up drawn exactly once, and the
        // drawn self times sum exactly to the profiler total.
        foreach ($selfOf as $name => $selfNs) {
            if (isset($order[$name])) {
                continue;
            }
            $order[$name]    = true;
            $parentOf[$name] = null;
        }

        $names     = array_keys($order);
        $childList = [];

        foreach ($names as $name) {
            $parent = $parentOf[$name] ?? null;
            if ($parent === null || $parent === $name) {
                continue;
            }
            $childList[$parent][] = $name;
        }

        // Expand child name lists into nodes. A spanning tree cannot cycle, so
        // this recursion is bounded by the depth of the tree.
        $resolve = static function (string $name) use (&$resolve, $selfOf, $callsOf, $childList): array {
            $node = [
                'name'      => $name,
                'self_ns'   => (float) ($selfOf[$name] ?? 0.0),
                'incl_ns'   => (float) ($selfOf[$name] ?? 0.0),
                'calls'     => (int) ($callsOf[$name] ?? 0),
                'children'  => [],
                'truncated' => false,
            ];

            foreach ($childList[$name] ?? [] as $childName) {
                $child = $resolve($childName);
                $node['incl_ns'] += $child['incl_ns'];
                $node['children'][] = $child;
            }

            usort($node['children'], static fn($a, $b) => $b['incl_ns'] <=> $a['incl_ns']);

            return $node;
        };

        $children = [];
        foreach ($names as $name) {
            if (($parentOf[$name] ?? null) === null) {
                $children[] = $resolve($name);
            }
        }

        usort($children, static fn($a, $b) => $b['incl_ns'] <=> $a['incl_ns']);

        // {main} holds no self time; the tree's width is the sum of the roots'
        // inclusive self time, which equals the parser's total self time because
        // every timed function is placed exactly once.
        return [
            'name'      => '{main}',
            'self_ns'   => 0.0,
            'incl_ns'   => array_sum(array_column($children, 'incl_ns')),
            'calls'     => 0,
            'children'  => $children,
            'truncated' => false,
        ];
    }

    /**
     * Render the tree as an SVG flame graph.
     *
     * Frame width follows the subtree's total self time, so children fit exactly
     * inside their parent and every level adds up to the profile total. The
     * parent's own self time is the leftover sliver at the right of its frame.
     */
    public static function renderSvg(array $tree, int $width = 1400, float $minWidthPx = 0.4, int $maxDepth = 0): string
    {
        $frameHeight = 17;
        $depth = static function (array $node) use (&$depth): int {
            $max = 0;
            foreach ($node['children'] as $child) {
                $max = max($max, $depth($child));
            }
            return $max + 1;
        };

        $treeDepth = $depth($tree);
        if ($maxDepth > 0) {
            $treeDepth = min($treeDepth, $maxDepth + 1);
        }
        $height = $treeDepth * $frameHeight + 46;
        $total = max(1.0, (float) $tree['incl_ns']);
        $scale = $width / $total;

        $svg = [];
        $svg[] = sprintf(
            '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d" font-family="ui-monospace,Menlo,Consolas,monospace">',
            $width,
            $height,
            $width,
            $height
        );
        $svg[] = sprintf(
            '<rect width="%d" height="%d" fill="#14161a"/>',
            $width,
            $height
        );

        $draw = static function (array $node, float $x, int $level) use (
            &$draw, &$svg, $scale, $frameHeight, $minWidthPx, $height, $maxDepth
        ): void {
            $w = $node['incl_ns'] * $scale;
            $y = $height - ($level + 1) * $frameHeight - 26;

            if ($w >= $minWidthPx) {
                $label = self::shorten($node['name'], (int) max(3, floor($w / 7)));
                $tip = sprintf(
                    '%s | self %.2f ms | calls %s%s',
                    $node['name'],
                    $node['self_ns'] / 1e6,
                    number_format((int) $node['calls']),
                    $node['truncated'] ? ' | (children folded)' : ''
                );

                $svg[] = sprintf(
                    '<g><title>%s</title><rect x="%.2f" y="%d" width="%.2f" height="%d" fill="%s" stroke="#0b0c0e" stroke-width="0.5"/>',
                    htmlspecialchars($tip, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
                    $x,
                    $y,
                    $w,
                    $frameHeight - 1,
                    self::color($node['name'])
                );
                if ($label !== '' && $w > strlen($label) * 6 + 6) {
                    $svg[] = sprintf(
                        '<text x="%.2f" y="%d" font-size="11" fill="#0b0c0e">%s</text>',
                        $x + 3,
                        $y + $frameHeight - 5,
                        htmlspecialchars($label, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
                    );
                }
                $svg[] = '</g>';
            }

            if ($maxDepth > 0 && $level >= $maxDepth) {
                return;
            }

            // Children start after the parent's own self time, so a frame's body
            // cost sits at its right edge and its callees fill the space before it.
            $offset = $node['self_ns'] * $scale;
            foreach ($node['children'] as $child) {
                $draw($child, $x + $offset, $level + 1);
                $offset += $child['incl_ns'] * $scale;
            }
        };

        $draw($tree, 0.0, 0);

        $svg[] = sprintf(
            '<text x="6" y="20" font-size="12" fill="#e6e6e6">total self time %.2f ms - frame width = subtree self time, nested under heaviest caller, hover for detail</text>',
            $total / 1e6
        );
        $svg[] = '</svg>';

        return implode("\n", $svg);
    }

    /** Wrap a tree in a minimal HTML page so the SVG can be opened directly. */
    public static function renderHtml(string $svg, string $title, string $subtitle): string
    {
        $esc = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{$esc($title)}</title>
<style>
  body { margin: 0; background: #14161a; color: #e6e6e6;
         font-family: ui-monospace, Menlo, Consolas, monospace; }
  header { padding: 10px 14px; border-bottom: 1px solid #262a31; }
  h1 { font-size: 15px; margin: 0 0 4px; }
  p { margin: 0; font-size: 12px; color: #9aa3ad; }
  .wrap { overflow-x: auto; }
</style>
</head>
<body>
<header>
  <h1>{$esc($title)}</h1>
  <p>{$esc($subtitle)}</p>
</header>
<div class="wrap">
{$svg}
</div>
</body>
</html>
HTML;
    }

    /** Deterministic warm colour so a function keeps its colour. */
    private static function color(string $name): string
    {
        $hash = crc32($name);
        $hue  = $hash % 360;
        $sat  = 55 + (($hash >> 9) % 20);
        $lig  = 62 + (($hash >> 17) % 8);

        return sprintf('hsl(%d %d%% %d%%)', $hue, $sat, $lig);
    }

    private static function shorten(string $name, int $max): string
    {
        if ($max <= 0) {
            return '';
        }
        if (strlen($name) <= $max) {
            return $name;
        }
        // Keep the tail: the class/method part identifies the function.
        return '...' . substr($name, -($max - 3));
    }
}
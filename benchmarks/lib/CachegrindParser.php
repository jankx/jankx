<?php
/**
 * CachegrindParser
 *
 * Parses Xdebug's `xdebug.mode=profile` cachegrind output into a call graph
 * that carries BOTH call counts and timing costs, so a single profile run
 * answers "what is slow" and "what is called too often".
 *
 * Cachegrind format subset emitted by Xdebug 3.x:
 *
 *   events: Time Memory
 *   fl=(1) /path/file.php
 *   fn=(1) Foo::bar
 *   <line> <self-time> <self-mem>
 *   cfl=(2) /path/file.php
 *   cfm=(2) Baz          <- optional "current file"
 *   cfn=(2) Foo::qux
 *   calls=12 0 0
 *   <line> <inclusive-time> <inclusive-mem>
 *
 * Name IDs are compressed: the first definition carries the name, later
 * references may be only `(N)`.
 */
namespace Jankx\Benchmarks;

final class CachegrindParser
{
    /** @var array<int, array{file:string, name:string}> */
    private array $names = [];

    /** @var array<string, array> fn -> aggregate */
    private array $functions = [];

    /** @var array<string, array> "caller\0callee" -> aggregate */
    private array $edges = [];

    private int $selfCalls = 0;

    /**
     * Nanoseconds represented by one cost unit of the first event column.
     *
     * Xdebug writes "events: Time_(10ns) Memory_(bytes)", so raw cost values
     * are 10-nanosecond ticks -- NOT microseconds. Treating them as us inflates
     * every reported duration by 100x. Parsed from the header; callers must use
     * timeNs() rather than assuming a unit.
     */
    private float $timeUnitNs = 1000.0; // cachegrind default: Time in us

    /**
     * Convert a raw cost value from the time column to nanoseconds.
     */
    public function timeNs(int $cost): float
    {
        return $cost * $this->timeUnitNs;
    }

    public function timeUnitNs(): float
    {
        return $this->timeUnitNs;
    }

    public function parseFile(string $path): self
    {
        $fh = @fopen($path, 'rb');
        if ($fh === false) {
            throw new \RuntimeException("Cannot read cachegrind file: {$path}");
        }

        $positionCount = 1; // "positions: line" => one leading column per cost line
        $eventCount = 2; // Time, Memory (xdebug default)

        // current caller context (callee state lives on $this so the back-fill
        // logic can reach it)
        $callerName = null;
        $callerFile = null;
        $inSubPosition = false;

        while (($line = fgets($fh)) !== false) {
            $line = rtrim($line, "\r\n");
            if ($line === '') {
                continue;
            }

            // --- header / event definitions -------------------------
            if (strncmp($line, 'events:', 7) === 0) {
                $eventNames = preg_split('/\s+/', trim(substr($line, 7)), -1, PREG_SPLIT_NO_EMPTY);
                $eventCount = max(1, count($eventNames ?: []));
                $this->timeUnitNs = self::parseTimeUnit((string) ($eventNames[0] ?? ''));
                continue;
            }
if (strncmp($line, 'positions:', 10) === 0) {
                    $positionCount = max(0, count(preg_split(
                        '/\s+/',
                        trim(substr($line, 10)),
                        -1,
                        PREG_SPLIT_NO_EMPTY
                    )));
                    continue;
                }
                if (strncmp($line, 'summary:', 8) === 0
                    || strncmp($line, 'creator:', 8) === 0
                    || strncmp($line, 'cmd:', 4) === 0
                    || strncmp($line, 'part:', 5) === 0
                    || strncmp($line, 'version:', 8) === 0
                    || strncmp($line, 'pid:', 4) === 0) {
                    continue;
                }

            $c0 = $line[0];

            // --- file name: fl=<file> / cfl=<file> --------------------
            // cachegrind prefixes distinguish "current position" (fl/fn) from
            // "callee of the next cost line" (cfl/cfn).
            if (preg_match('/^(c?fl)=\s*(.*)$/', $line, $m)) {
                $isCallee = ($m[1] === 'cfl');
                [$id, $value] = $this->resolveName($m[2]);
                if ($isCallee) {
                    $this->pendingCalleeFile = $value;
                } elseif ($value !== '') {
                    $callerFile = $value;
                }
                if ($id !== '' && $value !== '') {
                    $this->names[$id]['file'] = $value;
                }
                continue;
            }

            // --- function name: fn=<name> / cfn=<name> ------------------
            if (preg_match('/^(c?fn)=\s*(.*)$/', $line, $m)) {
                $isCallee = ($m[1] === 'cfn');
                [$id, $value] = $this->resolveName($m[2]);

                if ($isCallee) {
                    // Always seed both keys: a bare "cfn=(N)" reference creates
                    // no entry, and a later read of names[$id]['file'] would warn.
                    if (!isset($this->names[$id])) {
                        $this->names[$id] = ['file' => '', 'name' => ''];
                    }
                    if ($value !== '') {
                        $this->names[$id]['name'] = $value;
                    }
                    if ($this->names[$id]['file'] === '' && $this->pendingCalleeFile !== null) {
                        $this->names[$id]['file'] = (string) $this->pendingCalleeFile;
                    }
                    $this->pendingCalleeId = $id;
                    $this->pendingCallee   = $value !== ''
                        ? $value
                        : ($this->names[$id]['name'] ?? null);
                    if ($this->pendingCallee === '') {
                        $this->pendingCallee = null; // id only, name still unknown
                    }

                    // The callee may already have been defined earlier, in which case an
                    // edge parked against it can be attributed now. Guard on the
                    // id so a later, unrelated cfn= cannot claim the edge.
                    if ($this->pendingCallee !== null
                        && $this->pendingEdgeCaller !== null
                        && $this->pendingEdgeCalleeId === $id) {
                        $this->attributePendingEdge(
                            $this->pendingCallee,
                            (string) $this->names[$id]['file']
                        );
                    }
                    continue;
                }

                if ($value !== '') {
                    if (!isset($this->names[$id])) {
                        $this->names[$id] = ['file' => '', 'name' => ''];
                    }
                    $this->names[$id]['name'] = $value;
                    if ($this->names[$id]['file'] === '' && $callerFile !== null) {
                        $this->names[$id]['file'] = $callerFile;
                    }
                }

                // Xdebug emits "cfn=(12)" before ever defining id 12, so an edge
                // parked against that anonymous callee is resolved when the
                // definition arrives here as "fn=(12) name". Matching on the
                // parked id keeps unrelated names from claiming the edge.
                if ($value !== ''
                    && $this->pendingEdgeCaller !== null
                    && $this->pendingEdgeCalleeId === $id) {
                    $file = (string) $this->names[$id]['file'];
                    if ($file === '' && $callerFile !== null) {
                        $file = (string) $callerFile;
                    }
                    $this->attributePendingEdge($value, $file);
                }
                $callerName = $value !== '' ? $value : ($this->names[$id]['name'] ?? null);
                if ($callerName !== null && $callerName !== '') {
                    $this->touchFunction($callerName, (string) ($this->names[$id]['file'] ?? ($callerFile ?? '')));
                }
                continue;
            }

            // --- calls= ----------------------------------------------
            if (strncmp($line, 'calls=', 6) === 0) {
                $parts = preg_split('/\s+/', substr($line, 6), -1, PREG_SPLIT_NO_EMPTY);
                $callCount = (int) ($parts[0] ?? 1);
                $this->selfCalls += $callCount;

                // A callee may still be unknown here: cfn can appear as a bare
                // "(N)" reference whose definition only shows up later in the
                // file. Store the raw id and resolve it when the name arrives.
                $calleeId = $this->pendingCalleeId;
                $resolved = $this->pendingCallee;
                if (($resolved === null || $resolved === '') && $calleeId !== null) {
                    $resolved = $this->names[$calleeId]['name'] ?? null;
                }
                // An empty string means "id seen, name not known yet"; treating it
                // as a name creates phantom edges keyed on ''.
                if ($resolved === '') {
                    $resolved = null;
                }

                if ($resolved !== null && $callerName !== null) {
                    $key = $callerName . "\0" . $resolved;
                    if (!isset($this->edges[$key])) {
                        $this->edges[$key] = [
                            'caller'    => $callerName,
                            'callee'    => $resolved,
                            'calls'     => 0,
                            'incl_time' => 0,
                            'incl_mem'  => 0,
                        ];
                    }
                    $this->edges[$key]['calls'] += $callCount;
                }

                $this->awaitingInclusive    = true;
                $this->pendingInclusiveCaller = $callerName;
                $this->pendingInclusiveCallee = $resolved;
                $this->pendingInclusiveCalleeId = $calleeId;
                $this->pendingInclusiveFile   = $pendingCalleeFile ?? $callerFile;
                // Remember the count even when the callee is still anonymous, so
                // a later definition can attribute the whole edge.
                $this->pendingInclusiveCalls = $callCount;
                continue;
            }

            // --- cost line -------------------------------------------
            if (($c0 >= '0' && $c0 <= '9') || $c0 === '*' || $c0 === '+' || $c0 === '-') {
                $parts = preg_split('/\s+/', trim($line), -1, PREG_SPLIT_NO_EMPTY);
                // Skip the position column(s) ("positions: line" adds the source
                // line ahead of the event costs). Reading it as time made every
                // duration wildly too large.
                $values = array_map('intval', array_slice($parts, $positionCount));
                $t = $values[0] ?? 0;
                $m = $values[1] ?? 0;

                if (!empty($this->awaitingInclusive)) {
                    // The cost line that follows calls= carries the INCLUSIVE
                    // cost of those calls.
                    $this->awaitingInclusive = false;
                    $pc = $this->pendingInclusiveCallee;
                    $pn = $this->pendingInclusiveCaller;

                    if (($pc === null || $pc === '') && $this->pendingInclusiveCalleeId !== null) {
                        $pc = $this->names[$this->pendingInclusiveCalleeId]['name'] ?? null;
                    }
                    if ($pc === '') {
                        $pc = null;
                    }

                    if ($pn !== null) {
                        if ($pc !== null) {
                            $key = $pn . "\0" . $pc;
                            if (!isset($this->edges[$key])) {
                                $this->edges[$key] = [
                                    'caller'    => $pn,
                                    'callee'    => $pc,
                                    'calls'     => 0,
                                    'incl_time' => 0,
                                    'incl_mem'  => 0,
                                ];
                            }
                            $this->edges[$key]['incl_time'] += $t;
                            $this->edges[$key]['incl_mem']  += $m;
                        }

                        // Park whenever the callee name is still unknown. The
                        // cost line has already been consumed, so it must be held
                        // here until "cfn=(N)"/"fn=(N) name" resolves the id.
                        if ($pc === null) {
                            $this->pendingEdgeCaller  = $pn;
                            $this->pendingEdgeCalleeId = $this->pendingInclusiveCalleeId;
                            $this->pendingEdgeCalls   = $this->pendingInclusiveCalls;
                            $this->pendingEdgeIncl    = $t;
                            $this->pendingEdgeMem     = $m;
                            $this->pendingEdgeFile    = (string) $this->pendingInclusiveFile;
                        }
                    }
                    if ($pc !== null) {
                        $this->touchFunction($pc, (string) $this->pendingInclusiveFile);
                    }
                } else {
                    // self cost of the current function
                    if ($callerName !== null) {
                        $this->touchFunction($callerName, (string) ($callerFile ?? ''));
                        $this->functions[$callerName]['self_time'] += $t;
                        $this->functions[$callerName]['self_mem']  += $m;
                    }
                }
                continue;
            }
        }

        fclose($fh);
        return $this;
    }

    private bool $awaitingInclusive = false;
    private ?string $pendingInclusiveCaller = null;
    private ?string $pendingInclusiveCallee = null;
    private ?string $pendingInclusiveCalleeId = null;
    private ?string $pendingInclusiveFile = null;

    /** Call state when the callee name appears after its calls=/cost lines. */
    private ?string $pendingEdgeCaller = null;
    private ?string $pendingEdgeCalleeId = null;
    private int $pendingEdgeCalls = 0;
    private int $pendingEdgeIncl = 0;
    private int $pendingEdgeMem = 0;
    private string $pendingEdgeFile = '';

    private int $pendingInclusiveCalls = 0;

    /** Callee context for cfn= lines. */
    private ?string $pendingCallee = null;
    private ?string $pendingCalleeId = null;
    private ?string $pendingCalleeFile = null;

    /**
     * Nanoseconds per cost unit, derived from the first event name.
     *
     * Xdebug uses "Time_(10ns)" for its 10-nanosecond ticks; plain cachegrind
     * tools use "Time" meaning microseconds. Getting this wrong scales every
     * duration by 100x, so the unit is always taken from the header.
     */
    private static function parseTimeUnit(string $eventName): float
    {
        // Xdebug: "Time_(10ns)". Plain cachegrind: "Time" (microseconds).
        if (preg_match('/\((\d+(?:\.\d+)?)n?s\)/', $eventName, $m) === 1) {
            return (float) $m[1];
        }
        return 1000.0;
    }

    /**
     * Resolve a possibly ID-compressed name token.
     *
     * "fl=(3) /path" -> ['3', '/path']  first definition of id 3
     * "fl=(3)"       -> ['3', '']       reference; caller looks the id up
     * "fl=/path"     -> ['fl', '/path'] uncompressed, no id
     *
     * Distinguishing "definition" from "reference" by comparing the returned id
     * against the literal keywords is unreliable, so the caller checks whether
     * the value is empty instead.
     */
    private function resolveName(string $body): array
    {
        $body = ltrim($body);
        if ($body === '') {
            return ['', ''];
        }
        if ($body[0] !== '(') {
            return [$body, $body]; // uncompressed
        }
        $close = strpos($body, ')');
        if ($close === false) {
            return [$body, $body];
        }
        $id   = substr($body, 1, $close - 1);
        $rest = trim(substr($body, $close + 1));
        if ($rest === '') {
            // Reference only - signal with an empty value so the caller can
            // consult $this->names[$id].
            return [$id, ''];
        }
        return [$id, $rest];
    }

    /**
     * Attribute a calls= edge whose callee name only became known afterwards.
     */
    private function attributePendingEdge(string $callee, string $file): void
    {
        $caller = $this->pendingEdgeCaller;
        if ($caller === null) {
            return;
        }
        $key = $caller . "\0" . $callee;
        if (!isset($this->edges[$key])) {
            // Start at zero and let the adds below apply, otherwise incl_time
            // is counted twice for a newly created edge.
            $this->edges[$key] = [
                'caller'    => $caller,
                'callee'    => $callee,
                'calls'     => 0,
                'incl_time' => 0,
                'incl_mem'  => 0,
            ];
        }
        $this->edges[$key]['calls']     += $this->pendingEdgeCalls;
        $this->edges[$key]['incl_time'] += $this->pendingEdgeIncl;
        $this->edges[$key]['incl_mem']  += $this->pendingEdgeMem;

        // Only register the function here; aggregate() folds edge counts and
        // inclusive costs in, so writing them now would double count.
        $this->touchFunction($callee, $file !== '' ? $file : $this->pendingEdgeFile);

        $this->pendingEdgeCaller   = null;
        $this->pendingEdgeCalleeId = null;
        $this->pendingEdgeCalls    = 0;
        $this->pendingEdgeIncl     = 0;
        $this->pendingEdgeMem      = 0;
        $this->pendingEdgeFile     = '';
    }

    private function touchFunction(string $name, string $file): void
    {
        if (!isset($this->functions[$name])) {
            $this->functions[$name] = [
                'name'       => $name,
                'file'       => $file,
                'self_time'  => 0,
                'self_mem'   => 0,
                'incl_time'  => 0,
                'calls_as_callee' => 0,
            ];
        }
        if ($file !== '' && $this->functions[$name]['file'] === '') {
            $this->functions[$name]['file'] = $file;
        }
    }

    /** Fold call counts + inclusive costs into per-function aggregates. */
    public function aggregate(): self
    {
        foreach ($this->edges as $e) {
            $this->touchFunction($e['callee'], '');
            $this->functions[$e['callee']]['calls_as_callee'] += $e['calls'];
            $this->functions[$e['callee']]['incl_time']      += $e['incl_time'];
        }
        return $this;
    }

    /**
     * @return array<int, array> ranked functions by self time
     *
     * Sorting uses the raw unitless cost (equivalent to ns ordering), but the
     * returned rows carry unit-correct *_ns values for display.
     */
    public function topBySelfTime(int $limit = 30): array
    {
        $f = $this->functions;
        uasort($f, static fn($a, $b) => $b['self_time'] <=> $a['self_time']);
        $out = [];
        foreach (array_slice($f, 0, $limit, true) as $name => $row) {
            $row['self_time_ns'] = $this->timeNs((int) $row['self_time']);
            $row['incl_time_ns'] = $this->timeNs((int) $row['incl_time']);
            $out[$name] = $row;
        }
        return $out;
    }

    /** @return array<int, array> ranked functions by call count */
    public function topByCallCount(int $limit = 30): array
    {
        $f = $this->functions;
        uasort($f, static fn($a, $b) => $b['calls_as_callee'] <=> $a['calls_as_callee']);
        return array_slice($f, 0, $limit, true);
    }

    /**
     * @return array<int, array> ranked call edges (caller -> callee)
     *
     * Edges are ranked by call count; inclusive costs are exposed in ns.
     */
    public function topEdges(int $limit = 40): array
    {
        $e = $this->edges;
        uasort($e, static fn($a, $b) => $b['calls'] <=> $a['calls']);
        $out = [];
        foreach (array_slice($e, 0, $limit, true) as $key => $row) {
            $row['incl_time_ns'] = $this->timeNs((int) $row['incl_time']);
            $out[$key] = $row;
        }
        return $out;
    }

    /** Total self cost, in nanoseconds. */
    public function totalTimeNs(): float
    {
        $s = 0;
        foreach ($this->functions as $f) {
            $s += $f['self_time'];
        }
        return $this->timeNs($s);
    }

    public function totalCalls(): int
    {
        return $this->selfCalls;
    }

    public function functionCount(): int
    {
        return count($this->functions);
    }

    public function allFunctions(): array
    {
        return $this->functions;
    }

    public function allEdges(): array
    {
        return $this->edges;
    }
}
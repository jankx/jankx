<?php

namespace Jankx\CLI\Fixers;

use Jankx\Jankx;

/**
 * Fixer for missing @since tags
 *
 * @package Jankx\CLI\Fixers
 * @since 2.0.0
 */
class MissingSinceTagFixer implements IssueFixerInterface
{
    /**
     * Fix missing @since tags
     *
     * @param string $content
     * @param array $fix
     * @return string
     * @since 2.0.0
     */
    public function fix($content, $fix)
    {
        $docblock = $fix['docblock'];
        $target = $fix['target'];
        $name = $fix['name'];
        $line = $fix['line'];

        // Check if docblock already has @since tag
        if (strpos($docblock, '@since') !== false) {
            return $content;
        }

        // If docblock is empty or doesn't exist, create a new one
        if (empty($docblock) || trim($docblock) === '') {
            $lines = explode("\n", $content);
            $declarationLineContent = $lines[$line - 1]; // The line where class/method is declared

            // Determine indentation of the declaration line
            preg_match('/^(\s*)/', $declarationLineContent, $matches);
            $indentation = $matches[1];

            // Check if there's already a docblock before this line (look back up to 5 lines)
            $hasDocblock = false;
            for ($i = 1; $i <= 5; $i++) {
                if ($line - $i > 0) {
                    $prevLine = $lines[$line - $i - 1];
                    if (strpos($prevLine, '/**') !== false) {
                        $hasDocblock = true;
                        break;
                    }
                }
            }

            if ($hasDocblock) {
                // Already has a docblock, skip this fix
                return $content;
            }

            // Create new docblock
            $newDocblockContent = $indentation . "/**\n";
            $newDocblockContent .= $indentation . " * " . ucfirst($target) . " " . $name . "\n";
            $newDocblockContent .= $indentation . " *\n";
            $newDocblockContent .= $indentation . " * @since " . Jankx::getFrameworkVersion() . "\n";
            $newDocblockContent .= $indentation . " */";

            // Insert the new docblock before the declaration line
            array_splice($lines, $line - 1, 0, $newDocblockContent);

            return implode("\n", $lines);
        } else {
            // Docblock exists but is missing @since tag, insert into existing docblock
            $lines = explode("\n", $docblock);
            $prefix = ' * ';

            for ($i = count($lines) - 2; $i >= 0; $i--) {
                $line_content = $lines[$i];
                if (preg_match('/^(\s*\*)/', $line_content, $m)) {
                    $prefix = $m[1] . ' ';
                    break;
                }
            }

            $newDocblock = '';
            foreach ($lines as $line_content) {
                if (preg_match('/^\s*\*\//', $line_content)) {
                    $newDocblock .= $prefix . '@since ' . Jankx::getFrameworkVersion() . "\n";
                }
                $newDocblock .= $line_content . "\n";
            }
            $newDocblock = rtrim($newDocblock, "\n");

            return str_replace($docblock, $newDocblock, $content);
        }
    }
}
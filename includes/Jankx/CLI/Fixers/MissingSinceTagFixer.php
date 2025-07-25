<?php

namespace Jankx\CLI\Fixers;

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

        // Check if docblock already has @since tag
        if (strpos($docblock, '@since') !== false) {
            return $content;
        }

        // Find the prefix (whitespace + *) from the last docblock line
        $lines = explode("\n", $docblock);
        $prefix = ' * ';

        for ($i = count($lines) - 2; $i >= 0; $i--) {
            $line = $lines[$i];
            if (preg_match('/^(\s*\*)/', $line, $m)) {
                $prefix = $m[1] . ' ';
                break;
            }
        }

        // Insert @since line before */
        $newDocblock = '';
        for ($i = 0; $i < count($lines); $i++) {
            if (preg_match('/^\s*\*\//', $lines[$i])) {
                $newDocblock .= $prefix . '@since 2.0.0' . "\n";
            }
            $newDocblock .= $lines[$i] . "\n";
        }

        // Remove trailing newline if exists
        $newDocblock = rtrim($newDocblock, "\n");

        return str_replace($docblock, $newDocblock, $content);
    }
}
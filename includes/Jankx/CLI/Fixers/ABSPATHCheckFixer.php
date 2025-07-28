<?php

namespace Jankx\CLI\Fixers;

use Jankx\CLI\Fixers\IssueFixerInterface;

/**
 * Fixer for adding ABSPATH security check in PHP header
 *
 * @package Jankx\CLI\Fixers
 * @since 2.0.0
 */
class ABSPATHCheckFixer implements IssueFixerInterface
{
    /**
     * Add ABSPATH security check to PHP file header
     *
     * @param string $content
     * @param array $fix
     * @return string
     * @since 2.0.0
     */
    public function fix($content, $fix)
    {
        $lines = explode("\n", $content);

        // Find the best position to insert ABSPATH check
        $insertLine = $this->findInsertPosition($lines);

        // Create ABSPATH check code
        $abspathCheck = $this->createABSPATHCheck();

        // Insert ABSPATH check
        array_splice($lines, $insertLine, 0, $abspathCheck);

        return implode("\n", $lines);
    }

        /**
     * Find the best position to insert ABSPATH check
     *
     * @param array $lines
     * @return int
     * @since 2.0.0
     */
    private function findInsertPosition($lines)
    {
        $insertLine = 0;

        // Look for namespace declaration
        for ($i = 0; $i < count($lines); $i++) {
            $line = trim($lines[$i]);

            // Find namespace declaration
            if (strpos($line, 'namespace') === 0) {
                $insertLine = $i + 1; // Insert after namespace
                break;
            }
        }

        return $insertLine;
    }

    /**
     * Create ABSPATH security check code
     *
     * @return array
     * @since 2.0.0
     */
    private function createABSPATHCheck()
    {
        return [
            '',
            'if (!defined(\'ABSPATH\')) {',
            '    exit(\'Cheating huh?\');',
            '}',
            ''
        ];
    }
}
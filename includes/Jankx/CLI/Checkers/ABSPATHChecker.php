<?php

namespace Jankx\CLI\Checkers;

use Jankx\CLI\Checkers\IssueCheckerInterface;

/**
 * Checker for ABSPATH security check in PHP header
 *
 * @package Jankx\CLI\Checkers
 * @since 2.0.0
 */
class ABSPATHChecker implements IssueCheckerInterface
{
    /**
     * Check for ABSPATH security check in header scope
     *
     * @param array $parsed
     * @param string $content
     * @return array
     * @since 2.0.0
     */
    public function check($parsed, $content)
    {
        $issues = [];
        $lines = explode("\n", $content);

        // Find the first function or class declaration
        $headerEndLine = $this->findHeaderEndLine($parsed, $lines);

        // Check if ABSPATH check exists in header scope
        $hasABSPATHCheck = $this->hasABSPATHCheckInHeader($lines, $headerEndLine);

        if (!$hasABSPATHCheck) {
            $issues[] = $this->createIssue(
                'missing_abspath_check',
                'error',
                'PHP file header is missing ABSPATH security check',
                'PHP files should include ABSPATH check in header scope for security',
                [
                    'fixable' => true,
                    'fix' => [
                        'type' => 'missing_abspath_check',
                        'line' => 1,
                        'scope' => 'header'
                    ]
                ]
            );
        }

        return $issues;
    }

    /**
     * Find the end line of header scope (before first function/class)
     *
     * @param array $parsed
     * @param array $lines
     * @return int
     * @since 2.0.0
     */
    private function findHeaderEndLine($parsed, $lines)
    {
        $headerEndLine = count($lines); // Default to end of file

        // Check for first function or class declaration
        foreach ($parsed['functions'] as $function) {
            if ($function['line'] < $headerEndLine) {
                $headerEndLine = $function['line'];
            }
        }

        foreach ($parsed['classes'] as $class) {
            if ($class['line'] < $headerEndLine) {
                $headerEndLine = $class['line'];
            }
        }

        return $headerEndLine;
    }

    /**
     * Check if ABSPATH check exists in header scope
     *
     * @param array $lines
     * @param int $headerEndLine
     * @return bool
     * @since 2.0.0
     */
    private function hasABSPATHCheckInHeader($lines, $headerEndLine)
    {
        for ($i = 0; $i < $headerEndLine; $i++) {
            $line = trim($lines[$i]);

            // Skip comments and empty lines
            if (empty($line) || strpos($line, '//') === 0 || strpos($line, '/*') === 0 || strpos($line, '*') === 0) {
                continue;
            }

            // Check for ABSPATH check patterns
            if ($this->isABSPATHCheck($line)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if line contains ABSPATH security check
     *
     * @param string $line
     * @return bool
     * @since 2.0.0
     */
    private function isABSPATHCheck($line)
    {
        $patterns = [
            '/if\s*\(\s*!defined\s*\(\s*[\'"]ABSPATH[\'"]\s*\)\s*\)/',
            '/if\s*\(\s*!defined\s*\(\s*[\'"]ABSPATH[\'"]\s*\)\s*\)\s*{/',
            '/if\s*\(\s*!defined\s*\(\s*[\'"]ABSPATH[\'"]\s*\)\s*\)\s*exit/',
            '/if\s*\(\s*!defined\s*\(\s*[\'"]ABSPATH[\'"]\s*\)\s*\)\s*wp_die/',
            '/defined\s*\(\s*[\'"]ABSPATH[\'"]\s*\)\s*or\s*exit/',
            '/defined\s*\(\s*[\'"]ABSPATH[\'"]\s*\)\s*or\s*die/',
            '/defined\s*\(\s*[\'"]ABSPATH[\'"]\s*\)\s*or\s*wp_die/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $line)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Create issue array
     *
     * @param string $type
     * @param string $severity
     * @param string $message
     * @param string $description
     * @param array $additional
     * @return array
     * @since 2.0.0
     */
    private function createIssue($type, $severity, $message, $description, $additional = [])
    {
        return array_merge([
            'type' => $type,
            'severity' => $severity,
            'message' => $message,
            'description' => $description,
            'line' => 1,
            'column' => 1,
            'scope' => 'header'
        ], $additional);
    }
}
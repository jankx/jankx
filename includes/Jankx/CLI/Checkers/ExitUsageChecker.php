<?php

namespace Jankx\CLI\Checkers;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Checker for improper exit() usage
 *
 * @package Jankx\CLI\Checkers
 * @since 2.0.0
 */
class ExitUsageChecker extends AbstractIssueChecker
{
    /**
     * Check for improper exit() usage
     *
     * @param array $parsed
     * @param string $content
     * @return array
     * @since 2.0.0
     */
    public function check($parsed, $content)
    {
        $issues = [];

        // Check for exit() without ABSPATH check
        if (preg_match_all('/exit\s*\(/', $content, $matches, PREG_OFFSET_CAPTURE)) {
            foreach ($matches[0] as $match) {
                $line = $this->getLineNumber($content, $match[1]);

                // Check if there's an ABSPATH check before this exit
                if (!$this->hasPatternBefore($content, $match[1], '/defined\s*\(\s*[\'"]ABSPATH[\'"]\s*\)/')) {
                    $issues[] = $this->createIssue(
                        'improper_exit',
                        'error',
                        'exit() used without ABSPATH check',
                        $line,
                        false
                    );
                }
            }
        }

        return $issues;
    }
}

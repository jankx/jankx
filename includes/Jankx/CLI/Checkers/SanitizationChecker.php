<?php

namespace Jankx\CLI\Checkers;

/**
 * Checker for unsanitized input
 *
 * @package Jankx\CLI\Checkers
 * @since 2.0.0
 */
class SanitizationChecker extends AbstractIssueChecker
{
    /**
     * Check for unsanitized input
     *
     * @param array $parsed
     * @param string $content
     * @return array
     * @since 2.0.0
     */
    public function check($parsed, $content)
    {
        $issues = [];

        // Check for unsanitized $_POST, $_GET usage
        if (preg_match_all('/\$_POST\[[\'"][^\'"]+[\'"]\]/', $content, $matches, PREG_OFFSET_CAPTURE)) {
            foreach ($matches[0] as $match) {
                $line = $this->getLineNumber($content, $match[1]);

                // Check if this $_POST usage is properly sanitized
                if (!$this->hasPatternAfter($content, $match[1], '/(sanitize_text_field|sanitize_email|sanitize_url|wp_kses_post|intval|floatval)/', 200) &&
                    !$this->hasPatternBefore($content, $match[1], '/(sanitize_text_field|sanitize_email|sanitize_url|wp_kses_post|intval|floatval)\s*\(/')) {
                    $issues[] = $this->createIssue(
                        'unsanitized_input',
                        'error',
                        'Unsanitized $_POST usage',
                        $line,
                        true,
                        ['type' => 'unsanitized_input', 'input_type' => 'POST']
                    );
                }
            }
        }

        // Check for unsanitized $_GET usage
        if (preg_match_all('/\$_GET\[[\'"][^\'"]+[\'"]\]/', $content, $matches, PREG_OFFSET_CAPTURE)) {
            foreach ($matches[0] as $match) {
                $line = $this->getLineNumber($content, $match[1]);

                // Check if this $_GET usage is properly sanitized
                if (!$this->hasPatternAfter($content, $match[1], '/(sanitize_text_field|sanitize_email|sanitize_url|wp_kses_post|intval|floatval)/', 200) &&
                    !$this->hasPatternBefore($content, $match[1], '/(sanitize_text_field|sanitize_email|sanitize_url|wp_kses_post|intval|floatval)\s*\(/')) {
                    $issues[] = $this->createIssue(
                        'unsanitized_input',
                        'error',
                        'Unsanitized $_GET usage',
                        $line,
                        true,
                        ['type' => 'unsanitized_input', 'input_type' => 'GET']
                    );
                }
            }
        }

        return $issues;
    }
}
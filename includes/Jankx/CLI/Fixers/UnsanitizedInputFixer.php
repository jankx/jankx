<?php

namespace Jankx\CLI\Fixers;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\CLI\Fixers\IssueFixerInterface;

/**
 * Fixer for unsanitized input issues
 *
 * @since 2.0.0
 */
class UnsanitizedInputFixer implements IssueFixerInterface
{
    /**
     * Fix unsanitized input issues
     *
     * @param string $content
     * @param array $fix
     * @return string
     * @since 2.0.0
     */
    public function fix($content, $fix)
    {
        // Fix $_POST usage - only if not already sanitized
        $content = preg_replace(
            '/(?<!sanitize_text_field\()\$_POST\[[\'"]([^\'"]+)[\'"]\]/',
            'sanitize_text_field($_POST[\'$1\'])',
            $content
        );

        // Fix $_GET usage - only if not already sanitized
        $content = preg_replace(
            '/(?<!sanitize_text_field\()\$_GET\[[\'"]([^\'"]+)[\'"]\]/',
            'sanitize_text_field($_GET[\'$1\'])',
            $content
        );

        return $content;
    }
}

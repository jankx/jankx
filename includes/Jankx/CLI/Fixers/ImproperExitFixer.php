<?php

namespace Jankx\CLI\Fixers;

use Jankx\CLI\Fixers\IssueFixerInterface;

/**
 * Fixer for improper exit usage issues
 *
 * @since 2.0.0
 */
class ImproperExitFixer implements IssueFixerInterface
{
    /**
     * Fix improper exit usage issues
     *
     * @param string $content
     * @param array $fix
     * @return string
     * @since 2.0.0
     */
    public function fix($content, $fix)
    {
        // Add ABSPATH check before exit() statements
        $content = preg_replace(
            '/(?<!defined\s*\(\s*[\'"]ABSPATH[\'"]\s*\)\s*[^;]*;[\s\n]*)(exit\s*\(\s*[\'"])([^\'"]+)([\'"]\s*\))/',
            "if (!defined('ABSPATH')) {\n    exit('$2');\n}\n$1$2$3",
            $content
        );

        return $content;
    }
}
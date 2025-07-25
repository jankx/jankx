<?php

namespace Jankx\CLI\Checkers;

/**
 * Checker for missing @since tags
 *
 * @package Jankx\CLI\Checkers
 * @since 2.0.0
 */
class MissingSinceTagChecker extends AbstractIssueChecker
{
    /**
     * Check for missing @since tags
     *
     * @param array $parsed
     * @param string $content
     * @return array
     * @since 2.0.0
     */
    public function check($parsed, $content)
    {
        $issues = [];

        // Check classes
        foreach ($parsed['classes'] as $class) {
            if (!$this->parser->hasTag($class['docblock'], 'since')) {
                $issues[] = $this->createIssue(
                    'missing_since_tag',
                    'warning',
                    "Class '{$class['name']}' is missing @since tag",
                    $class['line'],
                    true,
                    [
                        'type' => 'add_since_tag',
                        'target' => 'class',
                        'name' => $class['name'],
                        'docblock' => $class['docblock'],
                        'line' => $class['line']
                    ]
                );
            }
        }

        // Check methods
        foreach ($parsed['methods'] as $method) {
            if (!$this->parser->hasTag($method['docblock'], 'since')) {
                $issues[] = $this->createIssue(
                    'missing_since_tag',
                    'warning',
                    "Method '{$method['name']}' in class '{$method['class']}' is missing @since tag",
                    $method['line'],
                    true,
                    [
                        'type' => 'add_since_tag',
                        'target' => 'method',
                        'name' => $method['name'],
                        'class' => $method['class'],
                        'docblock' => $method['docblock'],
                        'line' => $method['line']
                    ]
                );
            }
        }

        return $issues;
    }
}
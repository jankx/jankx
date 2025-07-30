<?php

namespace Jankx\CLI\Checkers;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


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
        if (isset($parsed['classes'])) {
            foreach ($parsed['classes'] as $class) {
                $className = isset($class['name']) ? $class['name'] : 'Unknown';

                // Check if class has docblock and missing @since tag
                if (isset($class['docblock']) && !$this->parser->hasTag($class['docblock'], 'since')) {
                    $issues[] = $this->createIssue(
                        'missing_since_tag',
                        'warning',
                        "Class '{$className}' is missing @since tag",
                        $class['line'] ?? 0,
                        true,
                        [
                            'type' => 'missing_since_tag',
                            'target' => 'class',
                            'name' => $className,
                            'docblock' => $class['docblock'],
                            'line' => $class['line'] ?? 0
                        ]
                    );
                }
                // Check if class has no docblock at all
                elseif (!isset($class['docblock'])) {
                    $issues[] = $this->createIssue(
                        'missing_since_tag',
                        'warning',
                        "Class '{$className}' is missing @since tag",
                        $class['line'] ?? 0,
                        true,
                        [
                            'type' => 'missing_since_tag',
                            'target' => 'class',
                            'name' => $className,
                            'docblock' => null,
                            'line' => $class['line'] ?? 0
                        ]
                    );
                }
            }
        }

        // Check methods
        if (isset($parsed['methods'])) {
            foreach ($parsed['methods'] as $method) {
                $methodName = isset($method['name']) ? $method['name'] : 'Unknown';
                $className = isset($method['class']) ? $method['class'] : 'Unknown';

                // Check if method has docblock and missing @since tag
                if (isset($method['docblock']) && !$this->parser->hasTag($method['docblock'], 'since')) {
                    $issues[] = $this->createIssue(
                        'missing_since_tag',
                        'warning',
                        "Method '{$methodName}' in class '{$className}' is missing @since tag",
                        $method['line'] ?? 0,
                        true,
                        [
                            'type' => 'missing_since_tag',
                            'target' => 'method',
                            'name' => $methodName,
                            'class' => $className,
                            'docblock' => $method['docblock'],
                            'line' => $method['line'] ?? 0
                        ]
                    );
                }
                // Check if method has no docblock at all
                elseif (!isset($method['docblock'])) {
                    $issues[] = $this->createIssue(
                        'missing_since_tag',
                        'warning',
                        "Method '{$methodName}' in class '{$className}' is missing @since tag",
                        $method['line'] ?? 0,
                        true,
                        [
                            'type' => 'missing_since_tag',
                            'target' => 'method',
                            'name' => $methodName,
                            'class' => $className,
                            'docblock' => null,
                            'line' => $method['line'] ?? 0
                        ]
                    );
                }
            }
        }

        return $issues;
    }
}

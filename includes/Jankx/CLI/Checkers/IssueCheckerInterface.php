<?php

namespace Jankx\CLI\Checkers;

/**
 * Interface for Issue Checker Strategy
 *
 * @package Jankx\CLI\Checkers
 * @since 2.0.0
 */
interface IssueCheckerInterface
{
    /**
     * Check for issues in the given content
     *
     * @param array $parsed Parsed PHP structure
     * @param string $content Raw file content
     * @return array Array of issues found
     * @since 2.0.0
     */
    public function check($parsed, $content);
}
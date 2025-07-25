<?php

namespace Jankx\CLI\Fixers;

/**
 * Interface for Issue Fixer Strategy
 *
 * @package Jankx\CLI\Fixers
 * @since 2.0.0
 */
interface IssueFixerInterface
{
    /**
     * Fix issues in the given content
     *
     * @param string $content Raw file content
     * @param array $fix Fix metadata
     * @return string Updated content
     * @since 2.0.0
     */
    public function fix($content, $fix);
}
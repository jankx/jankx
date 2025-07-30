<?php

namespace Jankx\CLI\Checkers;

use Jankx\Parsers\PHPParser;

/**
 * Abstract base class for Issue Checkers
 *
 * @package Jankx\CLI\Checkers
 * @since 2.0.0
 */
abstract class AbstractIssueChecker implements IssueCheckerInterface
{
    /**
     * @var PHPParser
     * @since 2.0.0
     */
    protected $parser;

    /**
     * Constructor
     *
     * @since 2.0.0
     */
    public function __construct()
    {
        $this->parser = new PHPParser();
    }

    /**
     * Create an issue array
     *
     * @param string $type
     * @param string $severity
     * @param string $message
     * @param int $line
     * @param bool $fixable
     * @param array $fix
     * @return array
     * @since 2.0.0
     */
    protected function createIssue($type, $severity, $message, $line, $fixable = false, $fix = [])
    {
        return [
            'type' => $type,
            'severity' => $severity,
            'message' => $message,
            'line' => $line,
            'fixable' => $fixable,
            'fix' => $fix
        ];
    }

    /**
     * Get line number from offset
     *
     * @param string $content
     * @param int $offset
     * @return int
     * @since 2.0.0
     */
    protected function getLineNumber($content, $offset)
    {
        return substr_count(substr($content, 0, $offset), "\n") + 1;
    }

    /**
     * Check if content before offset contains pattern
     *
     * @param string $content
     * @param int $offset
     * @param string $pattern
     * @return bool
     * @since 2.0.0
     */
    protected function hasPatternBefore($content, $offset, $pattern)
    {
        $beforeContent = substr($content, 0, $offset);
        return preg_match($pattern, $beforeContent);
    }

    /**
     * Check if content after offset contains pattern
     *
     * @param string $content
     * @param int $offset
     * @param string $pattern
     * @param int $length
     * @return bool
     * @since 2.0.0
     */
    protected function hasPatternAfter($content, $offset, $pattern, $length = 200)
    {
        $afterContent = substr($content, $offset, $length);
        return preg_match($pattern, $afterContent);
    }
}

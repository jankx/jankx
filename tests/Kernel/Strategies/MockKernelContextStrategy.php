<?php

namespace Tests\Kernel\Strategies;

use Jankx\Kernel\Strategies\KernelContextStrategy;

/**
 * Mock implementation of KernelContextStrategy for testing
 */
class MockKernelContextStrategy extends KernelContextStrategy
{
    private bool $canHandle;
    private string $context;
    private int $priority;

    public function __construct(bool $canHandle = true, string $context = 'mock', int $priority = 100)
    {
        $this->canHandle = $canHandle;
        $this->context = $context;
        $this->priority = $priority;
    }

    public function canHandle(): bool
    {
        return $this->canHandle;
    }

    public function getContext(): string
    {
        return $this->context;
    }

    public function getPriority(): int
    {
        return $this->priority;
    }
} 
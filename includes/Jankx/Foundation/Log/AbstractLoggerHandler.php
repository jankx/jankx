<?php

namespace Jankx\Foundation\Log;

/**
 * Abstract Logger Handler
 *
 * Base class for all logger handlers in the chain
 */
abstract class AbstractLoggerHandler
{
    /**
     * @var AbstractLoggerHandler|null
     */
    protected $nextHandler;

    /**
     * Set next handler in chain
     *
     * @param AbstractLoggerHandler $handler
     * @return AbstractLoggerHandler
     */
    public function setNext(AbstractLoggerHandler $handler): AbstractLoggerHandler
    {
        $this->nextHandler = $handler;
        return $handler;
    }

    /**
     * Handle log message
     *
     * @param string $level
     * @param string $message
     * @param array $context
     * @return bool
     */
    public function handle(string $level, string $message, array $context = []): bool
    {
        // Process current handler
        if ($this->canHandle($level)) {
            $this->write($level, $message, $context);
        }

        // Pass to next handler in chain
        if ($this->nextHandler) {
            return $this->nextHandler->handle($level, $message, $context);
        }

        return true;
    }

    /**
     * Check if handler can handle this log level
     *
     * @param string $level
     * @return bool
     */
    abstract public function canHandle(string $level): bool;

    /**
     * Write log message
     *
     * @param string $level
     * @param string $message
     * @param array $context
     * @return void
     */
    abstract protected function write(string $level, string $message, array $context = []): void;
}

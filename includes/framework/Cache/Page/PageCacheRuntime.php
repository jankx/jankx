<?php

namespace Jankx\Cache\Page;

use Jankx\Cache\Contracts\PageCacheInterface;

/**
 * Drives the page cache from the WordPress request lifecycle (Observer):
 *
 * - `template_redirect`  → serve a stored page and exit, or start buffering;
 * - buffer callback      → store what was rendered and publish the headers
 *                          while output is still buffered (headers not sent).
 *
 * The runtime owns *when* things happen; PageCache owns *whether* and
 * ServerIntegration owns *how the web server is told*.
 *
 * @package Jankx\Cache\Page
 * @since 2.0.0
 */
class PageCacheRuntime
{
    /**
     * @var PageCacheInterface
     */
    private $pageCache;

    /**
     * @var array<string,mixed>
     */
    private $options;

    /**
     * @var bool
     */
    private $buffering = false;

    /**
     * @var PageRequest|null
     */
    private $request;

    /**
     * @param PageCacheInterface $pageCache Page cache.
     * @param array<string,mixed> $options  cache.page configuration.
     */
    public function __construct(PageCacheInterface $pageCache, array $options = [])
    {
        $this->pageCache = $pageCache;
        $this->options = $options;
    }

    /**
     * Serve a stored page when there is one (never returns in that case).
     *
     * @return void
     */
    public function maybeServe(): void
    {
        if (!$this->pageCache->isEnabled()) {
            return;
        }

        $request = $this->request();
        $entry = $this->pageCache->maybeServe($request);
        if ($entry === null) {
            return;
        }

        $this->sendHeaders($this->pageCache->headers($request, $entry, PageCache::STATE_HIT));

        if (!headers_sent()) {
            http_response_code($entry->status());
            header('Content-Type: ' . $entry->contentType(), true);
        }

        echo $entry->html();
        exit;
    }

    /**
     * Start capturing the rendered page (or publish BYPASS headers when the
     * request must never be cached).
     *
     * @return void
     */
    public function startBuffer(): void
    {
        if ($this->buffering || !$this->pageCache->isEnabled() || !$this->pageCache->usesStorage()) {
            return;
        }

        $request = $this->request();
        if (!$this->pageCache->chain()->allows($request)) {
            $this->sendHeaders($this->pageCache->headers($request, null, PageCache::STATE_BYPASS));

            return;
        }

        $this->buffering = true;
        ob_start([$this, 'capture']);
    }

    /**
     * Output buffer callback: store the page, publish the headers, pass the
     * buffer through untouched.
     *
     * @param string $buffer Rendered HTML.
     * @return string
     */
    public function capture(string $buffer): string
    {
        if ($buffer === '' || !$this->buffering || !$this->pageCache->isEnabled()) {
            return $buffer;
        }

        $request = $this->request();

        if (!$this->pageCache->chain()->allows($request)) {
            $this->sendHeaders($this->pageCache->headers($request, null, PageCache::STATE_BYPASS));

            return $buffer;
        }

        $status = $this->status();
        $contentType = $this->contentType();

        $stored = $status === 200
            ? $this->pageCache->store($request, $buffer, $status, $contentType)
            : false;

        $this->sendHeaders($this->pageCache->headers(
            $request,
            null,
            $stored ? PageCache::STATE_STORE : PageCache::STATE_MISS
        ));

        return $buffer;
    }

    /**
     * @return bool
     */
    public function isBuffering(): bool
    {
        return $this->buffering;
    }

    /**
     * @return PageRequest
     */
    public function request(): PageRequest
    {
        if ($this->request === null) {
            $this->request = PageRequest::fromWordPress();
        }

        return $this->request;
    }

    /**
     * @param array<string,string> $headers Headers to publish.
     * @return void
     */
    private function sendHeaders(array $headers): void
    {
        if (headers_sent()) {
            return;
        }

        foreach ($headers as $name => $value) {
            if ($value === '' || $value === null) {
                continue;
            }
            header($name . ': ' . $value, true);
        }
    }

    /**
     * @return int
     */
    private function status(): int
    {
        $status = function_exists('http_response_code') ? http_response_code() : 200;

        return is_int($status) && $status > 0 ? $status : 200;
    }

    /**
     * @return string
     */
    private function contentType(): string
    {
        if (function_exists('headers_list')) {
            foreach (headers_list() as $header) {
                if (stripos($header, 'Content-Type:') === 0) {
                    return trim((string) substr($header, strlen('Content-Type:')));
                }
            }
        }

        return 'text/html; charset=UTF-8';
    }
}

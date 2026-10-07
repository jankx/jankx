<?php

namespace Jankx\Cache\Page;

/**
 * One cached page: body plus the metadata needed to replay or purge it.
 *
 * @package Jankx\Cache\Page
 * @since 2.0.0
 */
class PageCacheEntry
{
    /**
     * @var string
     */
    private $html;

    /**
     * @var int
     */
    private $status;

    /**
     * @var string
     */
    private $contentType;

    /**
     * @var string[]
     */
    private $tags;

    /**
     * @var int
     */
    private $createdAt;

    /**
     * @var int
     */
    private $ttl;

    /**
     * @param string   $html        Rendered body.
     * @param int      $status      HTTP status code.
     * @param string   $contentType Response content type.
     * @param string[] $tags        Cache tags (post-123, type-post, home...).
     * @param int      $createdAt   Unix timestamp of the storage.
     * @param int      $ttl         Lifetime in seconds, 0 = no expiry.
     */
    public function __construct(
        string $html,
        int $status = 200,
        string $contentType = 'text/html; charset=UTF-8',
        array $tags = [],
        int $createdAt = 0,
        int $ttl = 0
    ) {
        $this->html = $html;
        $this->status = $status;
        $this->contentType = $contentType;
        $this->tags = $tags;
        $this->createdAt = $createdAt > 0 ? $createdAt : time();
        $this->ttl = $ttl;
    }

    /**
     * @return string
     */
    public function html(): string
    {
        return $this->html;
    }

    /**
     * @return int
     */
    public function status(): int
    {
        return $this->status;
    }

    /**
     * @return string
     */
    public function contentType(): string
    {
        return $this->contentType;
    }

    /**
     * @return string[]
     */
    public function tags(): array
    {
        return $this->tags;
    }

    /**
     * @return int
     */
    public function createdAt(): int
    {
        return $this->createdAt;
    }

    /**
     * @return int
     */
    public function ttl(): int
    {
        return $this->ttl;
    }

    /**
     * @param int|null $now Current timestamp (injectable for tests).
     * @return bool
     */
    public function isExpired(?int $now = null): bool
    {
        if ($this->ttl <= 0) {
            return false;
        }

        $now = $now !== null ? $now : time();

        return ($this->createdAt + $this->ttl) < $now;
    }

    /**
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        return [
            'html' => $this->html,
            'status' => $this->status,
            'content_type' => $this->contentType,
            'tags' => $this->tags,
            'created_at' => $this->createdAt,
            'ttl' => $this->ttl,
        ];
    }

    /**
     * @param array<string,mixed> $data Serialized entry.
     * @return self|null
     */
    public static function fromArray(array $data): ?self
    {
        if (!isset($data['html']) || !is_string($data['html'])) {
            return null;
        }

        return new self(
            $data['html'],
            isset($data['status']) ? (int) $data['status'] : 200,
            isset($data['content_type']) ? (string) $data['content_type'] : 'text/html; charset=UTF-8',
            isset($data['tags']) && is_array($data['tags']) ? $data['tags'] : [],
            isset($data['created_at']) ? (int) $data['created_at'] : 0,
            isset($data['ttl']) ? (int) $data['ttl'] : 0
        );
    }
}

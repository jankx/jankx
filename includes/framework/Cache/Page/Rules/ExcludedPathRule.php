<?php

namespace Jankx\Cache\Page\Rules;

use Jankx\Cache\Contracts\CacheabilityRuleInterface;
use Jankx\Cache\Page\PageRequest;

/**
 * Blocks the URL prefixes that must never be cached (wp-admin, login, cart,
 * checkout, account) — the always-invalid areas of an e-commerce site.
 *
 * @package Jankx\Cache\Page\Rules
 * @since 2.0.0
 */
class ExcludedPathRule implements CacheabilityRuleInterface
{
    /**
     * @var string[]
     */
    private $patterns;

    /**
     * @param string[] $patterns Path prefixes, e.g. /wp-admin, /checkout.
     */
    public function __construct(array $patterns)
    {
        $this->patterns = $patterns;
    }

    /**
     * @inheritdoc
     */
    public function passes(PageRequest $request): bool
    {
        $path = strtolower(rtrim($request->path(), '/') . '/');
        if ($path === '//') {
            $path = '/';
        }

        foreach ($this->patterns as $pattern) {
            $pattern = strtolower(trim((string) $pattern));
            if ($pattern === '') {
                continue;
            }

            $needle = rtrim($pattern, '/') . '/';
            if ($needle === '/') {
                continue;
            }

            if (strpos($path, $needle) === 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function getName(): string
    {
        return 'excluded_path';
    }
}

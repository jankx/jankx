<?php

namespace Jankx\Cache\Page\Rules;

use Jankx\Cache\Contracts\CacheabilityRuleInterface;
use Jankx\Cache\Page\PageRequest;

/**
 * A visitor holding a session/cart cookie is in the middle of a transaction:
 * cacheable pages would hide the cart from them (and vice versa).
 *
 * Patterns ending with `*` match a cookie name prefix
 * (e.g. `wordpress_logged_in_*`).
 *
 * @package Jankx\Cache\Page\Rules
 * @since 2.0.0
 */
class ExcludedCookieRule implements CacheabilityRuleInterface
{
    /**
     * @var string[]
     */
    private $patterns;

    /**
     * @param string[] $patterns Cookie names, `*` suffix = prefix match.
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
        foreach ($request->cookies() as $name => $value) {
            foreach ($this->patterns as $pattern) {
                $pattern = (string) $pattern;
                if ($pattern === '') {
                    continue;
                }

                if (substr($pattern, -1) === '*') {
                    $prefix = substr($pattern, 0, -1);
                    if ($prefix !== '' && strpos($name, $prefix) === 0) {
                        return false;
                    }
                } elseif ($name === $pattern) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function getName(): string
    {
        return 'excluded_cookie';
    }
}

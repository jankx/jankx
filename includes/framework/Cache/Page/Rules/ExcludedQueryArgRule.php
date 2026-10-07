<?php

namespace Jankx\Cache\Page\Rules;

use Jankx\Cache\Contracts\CacheabilityRuleInterface;
use Jankx\Cache\Page\PageRequest;

/**
 * Rejects requests carrying an argument that changes the response or the
 * transaction: fast-AJAX `?mode=quick`, WooCommerce add-to-cart, previews,
 * the purge trigger, comment replies...
 *
 * @package Jankx\Cache\Page\Rules
 * @since 2.0.0
 */
class ExcludedQueryArgRule implements CacheabilityRuleInterface
{
    /**
     * @var string[]
     */
    private $patterns;

    /**
     * @param string[] $patterns Argument names, `*` suffix = prefix match.
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
        foreach ($request->query() as $name => $value) {
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
        return 'excluded_query_arg';
    }
}

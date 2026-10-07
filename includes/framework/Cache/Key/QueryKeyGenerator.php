<?php

namespace Jankx\Cache\Key;

use Jankx\Cache\Contracts\QueryKeyGeneratorInterface;

/**
 * Query cache key: hash of the final SQL statement.
 *
 * Keying on SQL (available on WP_Query::$request once every clause filter has
 * run) means ordering plugins, meta queries, pagination and search terms are
 * all accounted for without inspecting query vars one by one.
 *
 * @package Jankx\Cache\Key
 * @since 2.0.0
 */
class QueryKeyGenerator implements QueryKeyGeneratorInterface
{
    /**
     * @var string
     */
    private $prefix;

    /**
     * @param string $prefix Key prefix.
     */
    public function __construct(string $prefix = 'q')
    {
        $this->prefix = $prefix;
    }

    /**
     * @inheritdoc
     */
    public function generate(string $sql, array $context = []): CacheKey
    {
        ksort($context);

        $raw = $this->normalize($sql);
        foreach ($context as $name => $value) {
            $raw .= '|' . $name . '=' . (is_scalar($value) ? (string) $value : md5(serialize($value)));
        }

        return new CacheKey($this->prefix . '_' . md5($raw), 'query');
    }

    /**
     * Make the statement layout-insensitive.
     *
     * WP_Query assembles SQL from clause fragments whose indentation and line
     * breaks depend on which filters ran before them, so two statements that
     * are identical up to whitespace must hash to the same key. Runs of plain
     * spaces are left untouched: they can legitimately live inside a literal
     * (`LIKE '%a  b%'`) and collapsing them would merge two different queries.
     *
     * @param string $sql Final SQL statement.
     * @return string
     */
    private function normalize(string $sql): string
    {
        $normalized = preg_replace('/[ \t]*[\r\n]+[ \t]*/', ' ', $sql);
        if (!is_string($normalized)) {
            return trim($sql);
        }

        $normalized = preg_replace('/\t+/', ' ', $normalized);
        if (!is_string($normalized)) {
            return trim($sql);
        }

        return trim($normalized);
    }
}

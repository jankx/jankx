<?php

namespace Jankx\Cache\Page;

use Jankx\Cache\Contracts\CacheabilityRuleInterface;
use Jankx\Cache\Contracts\RequestKeyGeneratorInterface;
use Jankx\Cache\Page\Rules\ExcludedCookieRule;
use Jankx\Cache\Page\Rules\ExcludedPathRule;
use Jankx\Cache\Page\Rules\ExcludedQueryArgRule;
use Jankx\Cache\Page\Rules\LoggedInRule;
use Jankx\Cache\Page\Rules\NonGetRequestRule;
use Jankx\Cache\Page\Rules\RequestContextRule;

/**
 * Builds the cacheability chain and the key generator from `cache.page`
 * configuration — the single place that translates config into objects, so
 * the provider stays declarative.
 *
 * @package Jankx\Cache\Page
 * @since 2.0.0
 */
class CacheabilityChainFactory
{
    /**
     * @param array $config cache.page configuration.
     * @return CacheabilityChain
     */
    public static function makeChain(array $config): CacheabilityChain
    {
        $rules = [
            new NonGetRequestRule(),
            new LoggedInRule(),
            new RequestContextRule(),
            new ExcludedPathRule(isset($config['exclude_paths']) ? (array) $config['exclude_paths'] : []),
            new ExcludedCookieRule(isset($config['exclude_cookies']) ? (array) $config['exclude_cookies'] : []),
            new ExcludedQueryArgRule(isset($config['exclude_query_args']) ? (array) $config['exclude_query_args'] : []),
        ];

        return new CacheabilityChain($rules);
    }

    /**
     * @param array $config cache.page configuration.
     * @return RequestKeyGeneratorInterface
     */
    public static function makeKeyGenerator(array $config): RequestKeyGeneratorInterface
    {
        return new \Jankx\Cache\Key\UrlKeyGenerator(
            'page',
            isset($config['vary_cookies']) ? (array) $config['vary_cookies'] : [],
            isset($config['strip_query_args']) ? (array) $config['strip_query_args'] : []
        );
    }

    /**
     * @param CacheabilityChain $chain  Chain to report on.
     * @param PageRequest        $request Requested page.
     * @return array<string,mixed> Debug view used by CLI tooling.
     */
    public static function explain(CacheabilityChain $chain, PageRequest $request): array
    {
        $reason = $chain->firstFailure($request);

        return [
            'url' => $request->url(),
            'cacheable' => $reason === null,
            'rejected_by' => $reason,
            'rules' => array_map(
                static function (CacheabilityRuleInterface $rule) {
                    return $rule->getName();
                },
                $chain->rules()
            ),
        ];
    }
}

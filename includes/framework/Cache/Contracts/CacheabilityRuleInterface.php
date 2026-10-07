<?php

namespace Jankx\Cache\Contracts;

use Jankx\Cache\Page\PageRequest;

/**
 * A single "may this response be cached?" decision (Chain of Responsibility).
 *
 * Rules only ever see a PageRequest, so they stay free of WordPress state and
 * are trivially unit testable.
 *
 * @package Jankx\Cache\Contracts
 * @since 2.0.0
 */
interface CacheabilityRuleInterface
{
    /**
     * @param PageRequest $request Requested page.
     * @return bool True when the rule allows caching.
     */
    public function passes(PageRequest $request): bool;

    /**
     * Stable identifier used when reporting why a request was rejected.
     *
     * @return string
     */
    public function getName(): string;
}

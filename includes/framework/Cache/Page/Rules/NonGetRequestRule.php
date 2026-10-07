<?php

namespace Jankx\Cache\Page\Rules;

use Jankx\Cache\Contracts\CacheabilityRuleInterface;
use Jankx\Cache\Page\PageRequest;

/**
 * Only GET/HEAD responses are cacheable: POST mutates state (cart, checkout,
 * comments) and must never be replayed.
 *
 * @package Jankx\Cache\Page\Rules
 * @since 2.0.0
 */
class NonGetRequestRule implements CacheabilityRuleInterface
{
    /**
     * @inheritdoc
     */
    public function passes(PageRequest $request): bool
    {
        return $request->isGet();
    }

    /**
     * @inheritdoc
     */
    public function getName(): string
    {
        return 'non_get_request';
    }
}

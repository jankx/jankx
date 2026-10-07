<?php

namespace Jankx\Cache\Page\Rules;

use Jankx\Cache\Contracts\CacheabilityRuleInterface;
use Jankx\Cache\Page\PageRequest;

/**
 * Logged-in visitors get personalised markup (account menu, prices, quick
 * checkout) and must read straight from the database.
 *
 * @package Jankx\Cache\Page\Rules
 * @since 2.0.0
 */
class LoggedInRule implements CacheabilityRuleInterface
{
    /**
     * @inheritdoc
     */
    public function passes(PageRequest $request): bool
    {
        return !$request->context(PageRequest::CONTEXT_LOGGED_IN, false);
    }

    /**
     * @inheritdoc
     */
    public function getName(): string
    {
        return 'logged_in';
    }
}

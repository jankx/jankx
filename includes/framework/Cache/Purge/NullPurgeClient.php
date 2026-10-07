<?php

namespace Jankx\Cache\Purge;

use Jankx\Cache\Contracts\PurgeClientInterface;

/**
 * Null Object purge client: servers without a purge protocol (Apache mod_cache,
 * generic) only invalidate their local storage, so "there is nothing to send
 * over the wire" is reported as success rather than as a failure.
 *
 * @package Jankx\Cache\Purge
 * @since 2.0.0
 */
class NullPurgeClient implements PurgeClientInterface
{
    /**
     * @inheritdoc
     */
    public function purgeAll(): bool
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    public function purgeUrls(array $urls): bool
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    public function purgeTags(array $tags): bool
    {
        return true;
    }
}

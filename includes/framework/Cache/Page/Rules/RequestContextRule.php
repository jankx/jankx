<?php

namespace Jankx\Cache\Page\Rules;

use Jankx\Cache\Contracts\CacheabilityRuleInterface;
use Jankx\Cache\Page\PageRequest;

/**
 * Rejects everything that is not a public front-end page: wp-admin,
 * wp-login.php, REST, AJAX, preview, 404/500, feeds, and any response
 * explicitly flagged with DONOTCACHEPAGE.
 *
 * @package Jankx\Cache\Page\Rules
 * @since 2.0.0
 */
class RequestContextRule implements CacheabilityRuleInterface
{
    /**
     * Context flags that invalidate the response.
     *
     * @var string[]
     */
    private $flags;

    /**
     * @param string[]|null $flags Flags to check, defaults to the unsafe ones.
     */
    public function __construct(?array $flags = null)
    {
        $this->flags = $flags !== null ? $flags : [
            PageRequest::CONTEXT_ADMIN,
            PageRequest::CONTEXT_AJAX,
            PageRequest::CONTEXT_REST,
            PageRequest::CONTEXT_PREVIEW,
            PageRequest::CONTEXT_404,
            PageRequest::CONTEXT_FEED,
            PageRequest::CONTEXT_DO_NOT_CACHE,
        ];
    }

    /**
     * @inheritdoc
     */
    public function passes(PageRequest $request): bool
    {
        foreach ($this->flags as $flag) {
            if ($request->context($flag, false)) {
                return false;
            }
        }

        $status = (int) $request->context(PageRequest::CONTEXT_STATUS, 200);

        return $status === 200;
    }

    /**
     * @inheritdoc
     */
    public function getName(): string
    {
        return 'request_context';
    }
}

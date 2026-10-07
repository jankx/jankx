<?php

namespace Jankx\Cache\Page;

use Jankx\Cache\Contracts\CacheabilityRuleInterface;

/**
 * Runs the cacheability rules in order and stops at the first rejection
 * (Chain of Responsibility).
 *
 * @package Jankx\Cache\Page
 * @since 2.0.0
 */
class CacheabilityChain
{
    /**
     * @var CacheabilityRuleInterface[]
     */
    private $rules;

    /**
     * @param CacheabilityRuleInterface[] $rules Ordered rules.
     */
    public function __construct(array $rules = [])
    {
        $this->rules = [];
        foreach ($rules as $rule) {
            if ($rule instanceof CacheabilityRuleInterface) {
                $this->rules[] = $rule;
            }
        }
    }

    /**
     * @param PageRequest $request Requested page.
     * @return bool
     */
    public function allows(PageRequest $request): bool
    {
        return $this->firstFailure($request) === null;
    }

    /**
     * Name of the rule that rejected the request, or null when allowed.
     * Handy for debugging ("why is this page not cached?").
     *
     * @param PageRequest $request Requested page.
     * @return string|null
     */
    public function firstFailure(PageRequest $request): ?string
    {
        foreach ($this->rules as $rule) {
            if (!$rule->passes($request)) {
                return $rule->getName();
            }
        }

        return null;
    }

    /**
     * @return CacheabilityRuleInterface[]
     */
    public function rules(): array
    {
        return $this->rules;
    }
}

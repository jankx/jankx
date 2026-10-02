<?php

namespace Tests\Layouts\DynamicDataLayout\Support;

use Jankx\Layouts\DynamicDataLayout\Support\SortRulesResolver;
use Tests\Helpers\TestCase;

/**
 * Unit tests for SortRulesResolver.
 *
 * Covers the sanitization of the jankx/dynamic-data-sort-rules child block
 * attributes and the WP_Query arguments they produce. Each rule mirrors the
 * "Order By" / "Order" settings of the Query Settings panel.
 */
class SortRulesResolverTest extends TestCase
{
    protected function tearDown(): void
    {
        SortRulesResolver::unregisterClauseFilter();

        parent::tearDown();
    }

    public function testNormalizeRejectsNonArrayPayload(): void
    {
        $this->assertSame([false, []], SortRulesResolver::normalize(null));
        $this->assertSame([false, []], SortRulesResolver::normalize('rules'));
    }

    public function testNormalizeKeepsEnabledFlagWithoutRules(): void
    {
        [$enabled, $rules] = SortRulesResolver::normalize([
            'enabled' => true,
            'rules' => [],
        ]);

        $this->assertTrue($enabled);
        $this->assertSame([], $rules);
    }

    public function testNormalizeDropsRulesWhenDisabled(): void
    {
        [$enabled, $rules] = SortRulesResolver::normalize([
            'enabled' => false,
            'rules' => [
                ['orderBy' => 'date', 'order' => 'DESC'],
            ],
        ]);

        $this->assertFalse($enabled);
        $this->assertSame([], $rules, 'Disabled rules must not reach the query.');
    }

    public function testNormalizeClampsDirectionToAscOrDesc(): void
    {
        [, $rules] = SortRulesResolver::normalize([
            'enabled' => true,
            'rules' => [
                ['orderBy' => 'date', 'order' => 'asc'],
                ['orderBy' => 'title', 'order' => 'sideways'],
            ],
        ]);

        $this->assertSame('ASC', $rules[0]['order']);
        $this->assertSame('DESC', $rules[1]['order']);
    }

    public function testNormalizeRejectsUnknownOrderBy(): void
    {
        [, $rules] = SortRulesResolver::normalize([
            'enabled' => true,
            'rules' => [
                ['orderBy' => 'post_password; DROP TABLE wp_posts', 'order' => 'ASC'],
                ['orderBy' => '', 'order' => 'ASC'],
            ],
        ]);

        $this->assertSame([], $rules, 'Only values the editor can produce are accepted.');
    }

    public function testNormalizeRequiresMetaKeyForMetaRules(): void
    {
        [, $rules] = SortRulesResolver::normalize([
            'enabled' => true,
            'rules' => [
                ['orderBy' => 'meta_value_num', 'order' => 'DESC'],
            ],
        ]);

        $this->assertSame([], $rules, 'A meta rule without a meta key cannot be resolved.');
    }

    public function testNormalizeSanitizesMetaKeyAndMetaType(): void
    {
        [, $rules] = SortRulesResolver::normalize([
            'enabled' => true,
            'rules' => [
                [
                    'orderBy' => 'meta_value',
                    'order' => 'DESC',
                    'metaKey' => 'Start Date',
                    'metaType' => 'date',
                ],
            ],
        ]);

        $this->assertSame('startdate', $rules[0]['metaKey']);
        $this->assertSame('DATE', $rules[0]['metaType']);
    }

    public function testNormalizeDropsInvalidMetaType(): void
    {
        [, $rules] = SortRulesResolver::normalize([
            'enabled' => true,
            'rules' => [
                [
                    'orderBy' => 'meta_value',
                    'order' => 'DESC',
                    'metaKey' => 'start_date',
                    'metaType' => 'NOT_A_TYPE',
                ],
            ],
        ]);

        $this->assertArrayNotHasKey('metaType', $rules[0]);
    }

    public function testNormalizeStopsAtNonCombinableRule(): void
    {
        [, $rules] = SortRulesResolver::normalize([
            'enabled' => true,
            'rules' => [
                ['orderBy' => 'date', 'order' => 'DESC'],
                ['orderBy' => 'rand', 'order' => 'ASC'],
                ['orderBy' => 'title', 'order' => 'ASC'],
            ],
        ]);

        $this->assertCount(2, $rules, 'Rules after a non-combinable one can never apply.');
        $this->assertSame('rand', $rules[1]['orderBy']);
    }

    public function testHasRulesRequiresEnabledAndUsableRules(): void
    {
        $this->assertTrue(SortRulesResolver::hasRules([
            'sortRules' => [
                'enabled' => true,
                'rules' => [['orderBy' => 'date', 'order' => 'DESC']],
            ],
        ]));

        $this->assertFalse(SortRulesResolver::hasRules([
            'sortRules' => [
                'enabled' => false,
                'rules' => [['orderBy' => 'date', 'order' => 'DESC']],
            ],
        ]));

        $this->assertFalse(SortRulesResolver::hasRules([]));
    }

    public function testApplyToArgsLeavesArgsUntouchedWithoutRules(): void
    {
        $args = ['orderby' => 'date', 'order' => 'DESC'];

        $this->assertSame($args, SortRulesResolver::applyToArgs($args, null));
        $this->assertSame($args, SortRulesResolver::applyToArgs($args, ['enabled' => true, 'rules' => []]));
    }

    public function testApplyToArgsBuildsMultiLevelOrderbyWithIdTiebreaker(): void
    {
        $args = SortRulesResolver::applyToArgs(['orderby' => 'date', 'order' => 'DESC'], [
            'enabled' => true,
            'rules' => [
                ['orderBy' => 'menu_order', 'order' => 'ASC'],
                ['orderBy' => 'title', 'order' => 'DESC'],
            ],
        ]);

        $this->assertSame([
            'menu_order' => 'ASC',
            'title' => 'DESC',
            'ID' => 'DESC',
        ], $args['orderby']);

        $this->assertArrayNotHasKey('order', $args, 'Array orderby carries its own directions.');
    }

    public function testApplyToArgsUsesFirstMetaRuleNatively(): void
    {
        $args = SortRulesResolver::applyToArgs([], [
            'enabled' => true,
            'rules' => [
                ['orderBy' => 'meta_value_num', 'order' => 'ASC', 'metaKey' => 'price'],
            ],
        ]);

        $this->assertSame('price', $args['meta_key']);
        $this->assertSame(['meta_value_num' => 'ASC', 'ID' => 'DESC'], $args['orderby']);
    }

    public function testApplyToArgsPassesMetaTypeForMetaValue(): void
    {
        $args = SortRulesResolver::applyToArgs([], [
            'enabled' => true,
            'rules' => [
                ['orderBy' => 'meta_value', 'order' => 'DESC', 'metaKey' => 'start_date', 'metaType' => 'DATE'],
            ],
        ]);

        $this->assertSame('start_date', $args['meta_key']);
        $this->assertSame('DATE', $args['meta_type']);
    }

    public function testApplyToArgsDropsOrderWhenStandaloneRuleWins(): void
    {
        $args = SortRulesResolver::applyToArgs(['orderby' => 'date', 'order' => 'DESC'], [
            'enabled' => true,
            'rules' => [
                ['orderBy' => 'title', 'order' => 'ASC'],
                ['orderBy' => 'rand', 'order' => 'DESC'],
            ],
        ]);

        $this->assertSame('rand', $args['orderby']);
        $this->assertSame('DESC', $args['order']);
    }

    public function testApplyToArgsForcesPostInToAscending(): void
    {
        $args = SortRulesResolver::applyToArgs([], [
            'enabled' => true,
            'rules' => [
                ['orderBy' => 'post__in', 'order' => 'DESC'],
            ],
        ]);

        $this->assertSame('post__in', $args['orderby']);
        $this->assertSame('ASC', $args['order']);
    }

    public function testApplyToArgsDropsStaleMetaKeyForStandaloneRule(): void
    {
        $args = SortRulesResolver::applyToArgs([], [
            'enabled' => true,
            'rules' => [
                ['orderBy' => 'meta_value_num', 'order' => 'ASC', 'metaKey' => 'price'],
                ['orderBy' => 'relevance', 'order' => 'DESC'],
            ],
        ]);

        $this->assertSame('relevance', $args['orderby']);
        $this->assertArrayNotHasKey('meta_key', $args);
        $this->assertArrayNotHasKey('meta_type', $args);
    }
}
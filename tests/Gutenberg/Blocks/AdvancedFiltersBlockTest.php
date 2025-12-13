<?php

namespace Tests\Gutenberg\Blocks;

use Tests\Gutenberg\Blocks\BlockTestCase;
use Jankx\Gutenberg\Blocks\AdvancedFiltersBlock;
use Mockery;

/**
 * Unit tests for AdvancedFiltersBlock
 * 
 * Tests the PHP rendering logic of the advanced filters block
 */
class AdvancedFiltersBlockTest extends BlockTestCase
{
    protected AdvancedFiltersBlock $block;

    protected function setUp(): void
    {
        parent::setUp();
        $this->block = new AdvancedFiltersBlock();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    protected function getBlockId(): string
    {
        return 'jankx/advanced-filters';
    }

    protected function createBlockInstance(): AdvancedFiltersBlock
    {
        return new AdvancedFiltersBlock();
    }

    protected function getDefaultAttributes(): array
    {
        return [
            'targetBlockIds' => [],
            'filterType' => 'taxonomy',
            'layout' => 'horizontal',
            'showLabels' => true,
            'showResetButton' => true,
            'resetButtonText' => 'Reset Filters',
            'ajaxEnabled' => true,
            'updateUrl' => true,
            'scrollToResults' => false,
            'taxonomyFilters' => [],
            'metaFilters' => [],
            'priceFilters' => [],
            'dateFilters' => [],
            'authorFilters' => [],
            'keywordFilter' => [
                'enabled' => false,
                'placeholder' => 'Search...',
            ],
            'displayStyle' => 'buttons',
            'showCount' => false,
            'showEmptyTerms' => true,
            'showOnlyTopLevel' => false,
            'showHierarchy' => false,
            'displayAsDropdown' => false,
            'multipleSelection' => true,
            'collapsible' => false,
            'defaultExpanded' => true,
        ];
    }

    /**
     * Test block ID is correct
     */
    public function test_block_id_is_correct(): void
    {
        $this->assertEquals('jankx/advanced-filters', $this->getBlockId());
    }

    /**
     * Test render with default attributes
     */
    public function test_render_with_default_attributes(): void
    {
        $attributes = $this->getDefaultAttributes();
        
        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('wp-block-jankx-advanced-filters', $html);
        $this->assertStringContainsString('advanced-filters-config', $html);
    }

    /**
     * Test render with target block IDs
     */
    public function test_render_with_target_block_ids(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['targetBlockIds'] = ['1702479897'];

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('1702479897', $html);
    }

    /**
     * Test render with taxonomy filters
     */
    public function test_render_with_taxonomy_filters(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['taxonomyFilters'] = [
            [
                'enabled' => true,
                'taxonomy' => 'product_cat',
                'label' => 'Categories',
            ],
        ];

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('advanced-filters-container', $html);
    }

    /**
     * Test render with reset button
     */
    public function test_render_with_reset_button(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['showResetButton'] = true;
        $attributes['resetButtonText'] = 'Clear All';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('filter-reset-button', $html);
        $this->assertStringContainsString('Clear All', $html);
    }

    /**
     * Test render without reset button
     */
    public function test_render_without_reset_button(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['showResetButton'] = false;

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringNotContainsString('filter-reset-button', $html);
    }

    /**
     * Test render with custom layout
     */
    public function test_render_with_custom_layout(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['layout'] = 'vertical';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('layout-vertical', $html);
    }

    /**
     * Test detectPostTypeFromTargetIds with current post context
     */
    public function test_detect_post_type_from_target_ids(): void
    {
        // This is a private method, so we test it indirectly through render
        $attributes = $this->getDefaultAttributes();
        $attributes['targetBlockIds'] = ['1702479897'];

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        // Should render successfully without errors
        $this->assertNotEmpty($html);
        $this->assertValidHtml($html);
    }

    /**
     * Test all filterType enum values
     */
    public function test_all_filter_types(): void
    {
        $filterTypes = ['taxonomy', 'meta', 'price', 'date', 'author', 'keyword', 'mixed'];
        
        foreach ($filterTypes as $filterType) {
            $attributes = $this->getDefaultAttributes();
            $attributes['filterType'] = $filterType;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html, "Filter type '{$filterType}' should render");
            $this->assertStringContainsString('wp-block-jankx-advanced-filters', $html);
        }
    }

    /**
     * Test all layout enum values
     */
    public function test_all_layouts(): void
    {
        $layouts = ['horizontal', 'vertical', 'dropdown', 'accordion'];
        
        foreach ($layouts as $layout) {
            $attributes = $this->getDefaultAttributes();
            $attributes['layout'] = $layout;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html, "Layout '{$layout}' should render");
            $this->assertStringContainsString("layout-{$layout}", $html);
        }
    }

    /**
     * Test all displayStyle enum values
     */
    public function test_all_display_styles(): void
    {
        $displayStyles = ['buttons', 'checkboxes', 'dropdown', 'select'];
        
        foreach ($displayStyles as $displayStyle) {
            $attributes = $this->getDefaultAttributes();
            $attributes['displayStyle'] = $displayStyle;
            $attributes['taxonomyFilters'] = [
                [
                    'enabled' => true,
                    'taxonomy' => 'category',
                    'displayStyle' => $displayStyle,
                ],
            ];
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html, "Display style '{$displayStyle}' should render");
        }
    }

    /**
     * Test showLabels option
     */
    public function test_show_labels_true_and_false(): void
    {
        foreach ([true, false] as $showLabels) {
            $attributes = $this->getDefaultAttributes();
            $attributes['showLabels'] = $showLabels;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
        }
    }

    /**
     * Test showResetButton option
     */
    public function test_show_reset_button_true_and_false(): void
    {
        foreach ([true, false] as $showResetButton) {
            $attributes = $this->getDefaultAttributes();
            $attributes['showResetButton'] = $showResetButton;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
            
            if ($showResetButton) {
                $this->assertStringContainsString('filter-reset-button', $html);
            } else {
                $this->assertStringNotContainsString('filter-reset-button', $html);
            }
        }
    }

    /**
     * Test render with blockId as array to ensure no "Array to string" warnings
     */
    public function test_render_with_block_id_array(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['blockId'] = ['part1', 'part2'];

        $block = $this->createMockBlock($attributes);

        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('data-filter-block-id', $html);
        $this->assertStringNotContainsString('Array', $html);
    }

    /**
     * Test resetButtonText custom text
     */
    public function test_reset_button_text_custom(): void
    {
        $customTexts = ['Clear All', 'Reset Filters', 'Clear Filters', 'Xóa bộ lọc'];
        
        foreach ($customTexts as $text) {
            $attributes = $this->getDefaultAttributes();
            $attributes['resetButtonText'] = $text;
            $attributes['showResetButton'] = true;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
            $this->assertStringContainsString(esc_html($text), $html);
        }
    }

    /**
     * Test ajaxEnabled option
     */
    public function test_ajax_enabled_true_and_false(): void
    {
        foreach ([true, false] as $ajaxEnabled) {
            $attributes = $this->getDefaultAttributes();
            $attributes['ajaxEnabled'] = $ajaxEnabled;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
            $this->assertStringContainsString('advanced-filters-config', $html);
            
            // Check config JSON contains ajaxEnabled
            preg_match('/data-config="([^"]+)"/', $html, $matches);
            if (!empty($matches[1])) {
                $config = json_decode(html_entity_decode($matches[1]), true);
                $this->assertEquals($ajaxEnabled, $config['ajaxEnabled']);
            }
        }
    }

    /**
     * Test updateUrl option
     */
    public function test_update_url_true_and_false(): void
    {
        foreach ([true, false] as $updateUrl) {
            $attributes = $this->getDefaultAttributes();
            $attributes['updateUrl'] = $updateUrl;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
            
            // Check config JSON contains updateUrl
            preg_match('/data-config="([^"]+)"/', $html, $matches);
            if (!empty($matches[1])) {
                $config = json_decode(html_entity_decode($matches[1]), true);
                $this->assertEquals($updateUrl, $config['updateUrl']);
            }
        }
    }

    /**
     * Test scrollToResults option
     */
    public function test_scroll_to_results_true_and_false(): void
    {
        foreach ([true, false] as $scrollToResults) {
            $attributes = $this->getDefaultAttributes();
            $attributes['scrollToResults'] = $scrollToResults;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
            
            // Check config JSON contains scrollToResults
            preg_match('/data-config="([^"]+)"/', $html, $matches);
            if (!empty($matches[1])) {
                $config = json_decode(html_entity_decode($matches[1]), true);
                $this->assertEquals($scrollToResults, $config['scrollToResults']);
            }
        }
    }

    /**
     * Test showCount option
     */
    public function test_show_count_true_and_false(): void
    {
        foreach ([true, false] as $showCount) {
            $attributes = $this->getDefaultAttributes();
            $attributes['showCount'] = $showCount;
            $attributes['taxonomyFilters'] = [
                [
                    'enabled' => true,
                    'taxonomy' => 'category',
                    'showCount' => $showCount,
                ],
            ];
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
        }
    }

    /**
     * Test showEmptyTerms option
     */
    public function test_show_empty_terms_true_and_false(): void
    {
        foreach ([true, false] as $showEmptyTerms) {
            $attributes = $this->getDefaultAttributes();
            $attributes['showEmptyTerms'] = $showEmptyTerms;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
        }
    }

    /**
     * Test showOnlyTopLevel option
     */
    public function test_show_only_top_level_true_and_false(): void
    {
        foreach ([true, false] as $showOnlyTopLevel) {
            $attributes = $this->getDefaultAttributes();
            $attributes['showOnlyTopLevel'] = $showOnlyTopLevel;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
        }
    }

    /**
     * Test showHierarchy option
     */
    public function test_show_hierarchy_true_and_false(): void
    {
        foreach ([true, false] as $showHierarchy) {
            $attributes = $this->getDefaultAttributes();
            $attributes['showHierarchy'] = $showHierarchy;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
        }
    }

    /**
     * Test displayAsDropdown option
     */
    public function test_display_as_dropdown_true_and_false(): void
    {
        foreach ([true, false] as $displayAsDropdown) {
            $attributes = $this->getDefaultAttributes();
            $attributes['displayAsDropdown'] = $displayAsDropdown;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
        }
    }

    /**
     * Test multipleSelection option
     */
    public function test_multiple_selection_true_and_false(): void
    {
        foreach ([true, false] as $multipleSelection) {
            $attributes = $this->getDefaultAttributes();
            $attributes['multipleSelection'] = $multipleSelection;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
        }
    }

    /**
     * Test collapsible option
     */
    public function test_collapsible_true_and_false(): void
    {
        foreach ([true, false] as $collapsible) {
            $attributes = $this->getDefaultAttributes();
            $attributes['collapsible'] = $collapsible;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
        }
    }

    /**
     * Test defaultExpanded option
     */
    public function test_default_expanded_true_and_false(): void
    {
        foreach ([true, false] as $defaultExpanded) {
            $attributes = $this->getDefaultAttributes();
            $attributes['defaultExpanded'] = $defaultExpanded;
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
        }
    }

    /**
     * Test taxonomy filters output
     */
    public function test_taxonomy_filters_enabled_and_disabled(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['taxonomyFilters'] = [
            [
                'enabled' => true,
                'taxonomy' => 'category',
                'label' => 'Categories',
            ],
            [
                'enabled' => false,
                'taxonomy' => 'post_tag',
                'label' => 'Tags',
            ],
        ];
        
        $block = $this->createMockBlock($attributes);
        $html = $this->block->render($attributes, '', $block);
        
        $this->assertNotEmpty($html);
        
        // Check config JSON - only enabled filters should be included
        preg_match('/data-config="([^"]+)"/', $html, $matches);
        if (!empty($matches[1])) {
            $config = json_decode(html_entity_decode($matches[1]), true);
            $this->assertIsArray($config['taxonomyFilters']);
            // Only enabled filter should be in config
            $this->assertCount(1, $config['taxonomyFilters']);
        }
    }

    /**
     * Test meta filters output
     */
    public function test_meta_filters_enabled_and_disabled(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['metaFilters'] = [
            [
                'enabled' => true,
                'metaKey' => 'custom_field',
                'label' => 'Custom Field',
            ],
            [
                'enabled' => false,
                'metaKey' => 'another_field',
                'label' => 'Another Field',
            ],
        ];
        
        $block = $this->createMockBlock($attributes);
        $html = $this->block->render($attributes, '', $block);
        
        $this->assertNotEmpty($html);
        
        // Check config JSON - only enabled filters should be included
        preg_match('/data-config="([^"]+)"/', $html, $matches);
        if (!empty($matches[1])) {
            $config = json_decode(html_entity_decode($matches[1]), true);
            $this->assertIsArray($config['metaFilters']);
            // Only enabled filter should be in config
            $this->assertCount(1, $config['metaFilters']);
        }
    }

    /**
     * Test keyword filter output
     */
    public function test_keyword_filter_enabled_and_disabled(): void
    {
        foreach ([true, false] as $enabled) {
            $attributes = $this->getDefaultAttributes();
            $attributes['keywordFilter'] = [
                'enabled' => $enabled,
                'placeholder' => $enabled ? 'Search...' : 'Disabled',
            ];
            
            $block = $this->createMockBlock($attributes);
            $html = $this->block->render($attributes, '', $block);
            
            $this->assertNotEmpty($html);
            
            // Check config JSON contains keywordFilter
            preg_match('/data-config="([^"]+)"/', $html, $matches);
            if (!empty($matches[1])) {
                $config = json_decode(html_entity_decode($matches[1]), true);
                $this->assertIsArray($config['keywordFilter']);
                $this->assertEquals($enabled, $config['keywordFilter']['enabled'] ?? false);
            }
        }
    }

    /**
     * Test multiple target block IDs
     */
    public function test_multiple_target_block_ids(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['targetBlockIds'] = ['block-1', 'block-2', 'block-3'];
        
        $block = $this->createMockBlock($attributes);
        $html = $this->block->render($attributes, '', $block);
        
        $this->assertNotEmpty($html);
        
        // Check config JSON contains all target block IDs
        preg_match('/data-config="([^"]+)"/', $html, $matches);
        if (!empty($matches[1])) {
            $config = json_decode(html_entity_decode($matches[1]), true);
            $this->assertIsArray($config['targetBlockIds']);
            $this->assertCount(3, $config['targetBlockIds']);
            $this->assertContains('block-1', $config['targetBlockIds']);
            $this->assertContains('block-2', $config['targetBlockIds']);
            $this->assertContains('block-3', $config['targetBlockIds']);
        }
    }

    /**
     * Test HTML escaping in attributes
     */
    public function test_html_escaping_in_attributes(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['resetButtonText'] = '<script>alert("xss")</script>Reset';
        $attributes['showResetButton'] = true;
        
        $block = $this->createMockBlock($attributes);
        $html = $this->block->render($attributes, '', $block);
        
        $this->assertNotEmpty($html);
        // Script tag should be escaped
        $this->assertStringNotContainsString('<script>', $html);
        $this->assertStringContainsString('&lt;script&gt;', $html);
    }

    /**
     * Test nonce generation for AJAX
     */
    public function test_ajax_nonce_in_output(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['ajaxEnabled'] = true;
        
        $block = $this->createMockBlock($attributes);
        $html = $this->block->render($attributes, '', $block);
        
        $this->assertNotEmpty($html);
        $this->assertStringContainsString('data-nonce="', $html);
        $this->assertStringContainsString('data-ajax-url="', $html);
    }

    /**
     * Test instance ID uniqueness
     */
    public function test_instance_id_uniqueness(): void
    {
        $attributes = $this->getDefaultAttributes();
        
        $block = $this->createMockBlock($attributes);
        $html1 = $this->block->render($attributes, '', $block);
        $html2 = $this->block->render($attributes, '', $block);
        
        // Extract instance IDs
        preg_match('/id="([^"]+)"/', $html1, $matches1);
        preg_match('/id="([^"]+)"/', $html2, $matches2);
        
        // Instance IDs should be different
        if (!empty($matches1[1]) && !empty($matches2[1])) {
            $this->assertNotEquals($matches1[1], $matches2[1], 'Instance IDs should be unique');
        }
    }

    /**
     * Test wrapper attributes
     */
    public function test_wrapper_attributes(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['layout'] = 'vertical';
        
        $block = $this->createMockBlock($attributes);
        $html = $this->block->render($attributes, '', $block);
        
        $this->assertNotEmpty($html);
        $this->assertStringContainsString('wp-block-jankx-advanced-filters', $html);
        $this->assertStringContainsString('layout-vertical', $html);
    }
}

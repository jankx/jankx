<?php

namespace Tests\Gutenberg\Blocks;

use Tests\Helpers\TestCase;
use Jankx\Gutenberg\Block;
use Mockery;
use WP_Block;

/**
 * Base test case for Gutenberg blocks
 * 
 * Provides common utilities and setup for testing blocks
 */
abstract class BlockTestCase extends TestCase
{
    /**
     * Create a mock WP_Block instance
     * 
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @param array $innerBlocks Inner blocks array
     * @return WP_Block
     */
    protected function createMockBlock(array $attributes = [], string $content = '', array $innerBlocks = []): WP_Block
    {
        $block = Mockery::mock(WP_Block::class);
        
        $block->shouldReceive('__get')
            ->with('parsed_block')
            ->andReturn([
                'blockName' => $this->getBlockId(),
                'attrs' => $attributes,
                'innerHTML' => $content,
                'innerContent' => [$content],
                'innerBlocks' => $innerBlocks,
            ]);
        
        $block->attributes = $attributes;
        $block->inner_blocks = $innerBlocks;
        $block->inner_html = $content;
        $block->inner_content = [$content];
        
        return $block;
    }

    /**
     * Get block ID (must be implemented by child classes)
     * 
     * @return string Block ID (e.g., 'jankx/language-switcher')
     */
    abstract protected function getBlockId(): string;

    /**
     * Create block instance
     * 
     * @return Block
     */
    abstract protected function createBlockInstance();

    /**
     * Get default attributes for the block
     * 
     * @return array Default attributes
     */
    abstract protected function getDefaultAttributes(): array;

    /**
     * Assert that HTML output contains expected elements
     * 
     * @param string $html Rendered HTML
     * @param array $expectedElements Array of expected CSS selectors or strings
     * @param string $message Optional assertion message
     */
    protected function assertHtmlContains(string $html, array $expectedElements, string $message = ''): void
    {
        foreach ($expectedElements as $element) {
            if (strpos($html, $element) === false) {
                $this->fail(
                    ($message ? $message . ': ' : '') . 
                    "Expected HTML to contain '{$element}', but it didn't.\nHTML:\n{$html}"
                );
            }
        }
        
        $this->assertTrue(true);
    }

    /**
     * Assert that HTML output does not contain specified elements
     * 
     * @param string $html Rendered HTML
     * @param array $unexpectedElements Array of unexpected CSS selectors or strings
     * @param string $message Optional assertion message
     */
    protected function assertHtmlNotContains(string $html, array $unexpectedElements, string $message = ''): void
    {
        foreach ($unexpectedElements as $element) {
            if (strpos($html, $element) !== false) {
                $this->fail(
                    ($message ? $message . ': ' : '') . 
                    "Expected HTML not to contain '{$element}', but it did.\nHTML:\n{$html}"
                );
            }
        }
        
        $this->assertTrue(true);
    }

    /**
     * Assert that HTML is valid (basic structure check)
     * 
     * @param string $html Rendered HTML
     * @param string $message Optional assertion message
     */
    protected function assertValidHtml(string $html, string $message = ''): void
    {
        // Basic HTML structure validation
        $this->assertNotEmpty($html, $message ?: 'HTML should not be empty');
        
        // Check for unclosed tags (basic check)
        $openTags = substr_count($html, '<');
        $closeTags = substr_count($html, '>');
        $this->assertEquals($openTags, $closeTags, $message ?: 'HTML tags should be properly closed');
    }

    /**
     * Assert that attributes are properly escaped in HTML
     * 
     * @param string $html Rendered HTML
     * @param array $attributes Attributes to check
     * @param string $message Optional assertion message
     */
    protected function assertAttributesEscaped(string $html, array $attributes, string $message = ''): void
    {
        foreach ($attributes as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }
            
            // Check that attribute values are escaped (no <, >, ", ')
            $escapedValue = esc_attr($value);
            
            // If value contains special characters, they should be escaped
            if (preg_match('/[<>"\']/', $value)) {
                $this->assertStringNotContainsString(
                    $value,
                    $html,
                    ($message ? $message . ': ' : '') . "Attribute '{$key}' value should be escaped"
                );
                $this->assertStringContainsString(
                    $escapedValue,
                    $html,
                    ($message ? $message . ': ' : '') . "Attribute '{$key}' escaped value should be present"
                );
            }
        }
    }
}

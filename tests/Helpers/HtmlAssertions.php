<?php

/**
 * HTML Assertion Helpers for Testing
 */

namespace Tests\Helpers;

trait HtmlAssertions
{
    /**
     * Assert that HTML contains a specific CSS class
     */
    protected function assertHtmlHasClass(string $html, string $className, string $message = ''): void
    {
        $pattern = '/class=["\']([^"\']*\s+)?' . preg_quote($className, '/') . '(\s+[^"\']*)?["\']/';
        $this->assertMatchesRegularExpression(
            $pattern,
            $html,
            $message ?: "HTML should contain CSS class '{$className}'"
        );
    }

    /**
     * Assert that HTML contains a specific tag
     */
    protected function assertHtmlHasTag(string $html, string $tagName, string $message = ''): void
    {
        $pattern = '/<' . preg_quote($tagName, '/') . '[\s>]/i';
        $this->assertMatchesRegularExpression(
            $pattern,
            $html,
            $message ?: "HTML should contain tag '{$tagName}'"
        );
    }

    /**
     * Assert that HTML contains a specific attribute
     */
    protected function assertHtmlHasAttribute(string $html, string $attribute, ?string $value = null, string $message = ''): void
    {
        if ($value !== null) {
            $pattern = '/' . preg_quote($attribute, '/') . '=["\']' . preg_quote($value, '/') . '["\']/';
            $this->assertMatchesRegularExpression(
                $pattern,
                $html,
                $message ?: "HTML should contain attribute '{$attribute}' with value '{$value}'"
            );
        } else {
            $pattern = '/' . preg_quote($attribute, '/') . '=/';
            $this->assertMatchesRegularExpression(
                $pattern,
                $html,
                $message ?: "HTML should contain attribute '{$attribute}'"
            );
        }
    }

    /**
     * Assert that HTML structure matches expected structure
     */
    protected function assertHtmlStructure(string $html, array $expectedStructure, string $message = ''): void
    {
        // Check tag
        if (isset($expectedStructure['tag'])) {
            $this->assertHtmlHasTag($html, $expectedStructure['tag'], $message);
        }

        // Check classes
        if (isset($expectedStructure['classes']) && is_array($expectedStructure['classes'])) {
            foreach ($expectedStructure['classes'] as $class) {
                $this->assertHtmlHasClass($html, $class, $message);
            }
        }

        // Check attributes
        if (isset($expectedStructure['attributes']) && is_array($expectedStructure['attributes'])) {
            foreach ($expectedStructure['attributes'] as $attr => $value) {
                if ($value !== null && $value !== '') {
                    $this->assertHtmlHasAttribute($html, $attr, (string)$value, $message);
                } else {
                    $this->assertHtmlHasAttribute($html, $attr, null, $message);
                }
            }
        }
    }

    /**
     * Normalize HTML for comparison (remove whitespace, normalize quotes)
     */
    protected function normalizeHtml(string $html): string
    {
        // Remove extra whitespace
        $html = preg_replace('/\s+/', ' ', $html);
        $html = preg_replace('/>\s+</', '><', $html);
        
        // Normalize quotes
        $html = str_replace('"', "'", $html);
        
        // Trim
        $html = trim($html);
        
        return $html;
    }

    /**
     * Assert that two HTML strings are equivalent (ignoring whitespace and quote differences)
     */
    protected function assertHtmlEquivalent(string $expected, string $actual, string $message = ''): void
    {
        $normalizedExpected = $this->normalizeHtml($expected);
        $normalizedActual = $this->normalizeHtml($actual);
        
        $this->assertEquals(
            $normalizedExpected,
            $normalizedActual,
            $message ?: 'HTML should be equivalent'
        );
    }

    /**
     * Extract element from HTML by tag and class
     */
    protected function extractElementByClass(string $html, string $tag, string $className): ?string
    {
        $pattern = '/<' . preg_quote($tag, '/') . '[^>]*class=["\'][^"\']*' . preg_quote($className, '/') . '[^"\']*["\'][^>]*>.*?<\/' . preg_quote($tag, '/') . '>/is';
        
        if (preg_match($pattern, $html, $matches)) {
            return $matches[0];
        }
        
        return null;
    }

    /**
     * Count occurrences of a tag in HTML
     */
    protected function countTags(string $html, string $tag): int
    {
        $pattern = '/<' . preg_quote($tag, '/') . '[\s>]/i';
        preg_match_all($pattern, $html, $matches);
        return count($matches[0]);
    }
}

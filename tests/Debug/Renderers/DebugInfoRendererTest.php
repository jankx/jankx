<?php

namespace Tests\Debug\Renderers;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\Renderers\DebugInfoRenderer;

/**
 * Debug Info Renderer Test
 *
 * @package Tests\Debug\Renderers
 * @since 2.0.1
 */
class DebugInfoRendererTest extends TestCase
{
    private DebugInfoRenderer $renderer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->renderer = new DebugInfoRenderer();
    }

    public function testRender()
    {
        $debugData = [
            'response_time' => 0.123,
            'memory_usage' => 1024 * 1024,
            'memory_limit' => 256 * 1024 * 1024,
            'query_count' => 15,
            'cache_info' => [
                'object_cache' => ['enabled' => true],
                'transients' => ['count' => 5],
                'plugins' => ['W3 Total Cache' => ['status' => 'Active']]
            ],
            'gutenberg_blocks' => [
                'total_blocks' => 10,
                'block_types' => ['core/paragraph' => 5]
            ],
            'plugin_debug' => [
                'Test Plugin' => 'Active'
            ]
        ];

        $html = $this->renderer->render($debugData);

        $this->assertIsString($html);
        $this->assertNotEmpty($html);
        $this->assertStringContainsString('<div', $html);
        $this->assertStringContainsString('</div>', $html);
    }

    public function testRenderWithEmptyData()
    {
        $debugData = [];
        $html = $this->renderer->render($debugData);

        $this->assertIsString($html);
        $this->assertNotEmpty($html);
        $this->assertStringContainsString('<div', $html);
    }

    public function testRenderWithMinimalData()
    {
        $debugData = [
            'response_time' => 0.1,
            'query_count' => 5
        ];

        $html = $this->renderer->render($debugData);

        $this->assertIsString($html);
        $this->assertNotEmpty($html);
        $this->assertStringContainsString('0.1', $html);
        $this->assertStringContainsString('5', $html);
    }

    public function testRenderWithCompleteData()
    {
        $debugData = [
            'response_time' => 0.456,
            'memory_usage' => 2048 * 1024,
            'memory_limit' => 512 * 1024 * 1024,
            'query_count' => 25,
            'cache_info' => [
                'object_cache' => [
                    'enabled' => true,
                    'type' => 'Redis',
                    'stats' => [
                        'hits' => 1000,
                        'misses' => 100,
                        'hit_rate' => 90.9
                    ]
                ],
                'transients' => [
                    'count' => 10,
                    'size' => 1024 * 1024,
                    'items' => [
                        ['name' => '_transient_test1', 'size' => 512],
                        ['name' => '_transient_test2', 'size' => 512]
                    ]
                ],
                'plugins' => [
                    'W3 Total Cache' => ['status' => 'Active', 'details' => 'Configured'],
                    'WP Rocket' => ['status' => 'Active', 'details' => 'Optimized']
                ],
                'summary' => [
                    'object_cache_enabled' => true,
                    'transient_count' => 10,
                    'transient_size' => 1024 * 1024,
                    'plugin_count' => 2
                ]
            ],
            'gutenberg_blocks' => [
                'total_blocks' => 15,
                'block_types' => [
                    'core/paragraph' => 8,
                    'core/heading' => 3,
                    'core/image' => 2,
                    'core/list' => 2
                ],
                'is_gutenberg_editor' => false,
                'is_gutenberg_frontend' => true,
                'template_parts' => 3
            ],
            'plugin_debug' => [
                'Jankx Theme' => 'Version 2.0.1',
                'WordPress' => 'Version 6.0',
                'PHP' => 'Version 8.1'
            ]
        ];

        $html = $this->renderer->render($debugData);

        $this->assertIsString($html);
        $this->assertNotEmpty($html);

        // Check for key data in HTML
        $this->assertStringContainsString('0.456', $html);
        $this->assertStringContainsString('25', $html);
        $this->assertStringContainsString('Redis', $html);
        $this->assertStringContainsString('W3 Total Cache', $html);
        $this->assertStringContainsString('core/paragraph', $html);
        $this->assertStringContainsString('Jankx Theme', $html);
    }

    public function testRenderHtmlStructure()
    {
        $debugData = [
            'response_time' => 0.1,
            'memory_usage' => 1024 * 1024,
            'query_count' => 5
        ];

        $html = $this->renderer->render($debugData);

        // Check for required HTML elements
        $this->assertStringContainsString('<div id="jankx-debug-panel"', $html);
        $this->assertStringContainsString('<div class="debug-header"', $html);
        $this->assertStringContainsString('<div class="debug-content"', $html);
        $this->assertStringContainsString('<div class="debug-section"', $html);
        $this->assertStringContainsString('<style>', $html);
        $this->assertStringContainsString('<script>', $html);
    }

    public function testRenderCssIncluded()
    {
        $debugData = ['response_time' => 0.1];
        $html = $this->renderer->render($debugData);

        // Check for CSS styles
        $this->assertStringContainsString('background-color: #1a1a1a', $html);
        $this->assertStringContainsString('color: #ffffff', $html);
        $this->assertStringContainsString('font-family: monospace', $html);
        $this->assertStringContainsString('border-radius: 8px', $html);
        $this->assertStringContainsString('box-shadow: 0 4px 12px rgba(0,0,0,0.3)', $html);
    }

    public function testRenderJavaScriptIncluded()
    {
        $debugData = ['response_time' => 0.1];
        $html = $this->renderer->render($debugData);

        // Check for JavaScript
        $this->assertStringContainsString('document.addEventListener', $html);
        $this->assertStringContainsString('addEventListener(\'click\'', $html);
        $this->assertStringContainsString('setTimeout', $html);
        $this->assertStringContainsString('style.display', $html);
    }

    public function testRenderWithSpecialCharacters()
    {
        $debugData = [
            'plugin_debug' => [
                'Test Plugin <v1.0>' => 'Info with <>&"\' characters'
            ]
        ];

        $html = $this->renderer->render($debugData);

        $this->assertIsString($html);
        $this->assertNotEmpty($html);
        // Should properly escape HTML characters
        $this->assertStringContainsString('Test Plugin &lt;v1.0&gt;', $html);
        $this->assertStringContainsString('Info with &lt;&gt;&amp;&quot;&#039; characters', $html);
    }

    public function testRenderWithLargeNumbers()
    {
        $debugData = [
            'memory_usage' => 1024 * 1024 * 1024, // 1GB
            'memory_limit' => 2048 * 1024 * 1024, // 2GB
            'query_count' => 999999
        ];

        $html = $this->renderer->render($debugData);

        $this->assertIsString($html);
        $this->assertNotEmpty($html);
        $this->assertStringContainsString('1.00 GB', $html);
        $this->assertStringContainsString('2.00 GB', $html);
        $this->assertStringContainsString('999999', $html);
    }

    public function testRenderPerformance()
    {
        $debugData = [
            'response_time' => 0.1,
            'memory_usage' => 1024 * 1024,
            'query_count' => 5,
            'cache_info' => [
                'object_cache' => ['enabled' => true],
                'transients' => ['count' => 5],
                'plugins' => ['Test Plugin' => ['status' => 'Active']]
            ],
            'gutenberg_blocks' => [
                'total_blocks' => 10,
                'block_types' => ['core/paragraph' => 5]
            ],
            'plugin_debug' => [
                'Test Plugin' => 'Active'
            ]
        ];

        $startTime = microtime(true);
        $html = $this->renderer->render($debugData);
        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete quickly (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
        $this->assertIsString($html);
        $this->assertNotEmpty($html);
    }

    public function testRenderMemoryUsage()
    {
        $debugData = [
            'response_time' => 0.1,
            'memory_usage' => 1024 * 1024,
            'query_count' => 5
        ];

        $memoryBefore = memory_get_usage(true);
        $html = $this->renderer->render($debugData);
        $memoryAfter = memory_get_usage(true);
        $memoryUsed = $memoryAfter - $memoryBefore;

        // Should not use excessive memory
        $this->assertLessThan(5 * 1024 * 1024, $memoryUsed); // Less than 5MB
        $this->assertIsString($html);
        $this->assertNotEmpty($html);
    }

    public function testRenderWithNullValues()
    {
        $debugData = [
            'response_time' => null,
            'memory_usage' => null,
            'query_count' => null,
            'cache_info' => null,
            'gutenberg_blocks' => null,
            'plugin_debug' => null
        ];

        $html = $this->renderer->render($debugData);

        $this->assertIsString($html);
        $this->assertNotEmpty($html);
        $this->assertStringContainsString('<div', $html);
    }

    public function testRenderWithMixedDataTypes()
    {
        $debugData = [
            'response_time' => 0.123,
            'memory_usage' => '1024 KB',
            'query_count' => '15',
            'cache_info' => 'Some cache info',
            'gutenberg_blocks' => 42,
            'plugin_debug' => ['test' => 123]
        ];

        $html = $this->renderer->render($debugData);

        $this->assertIsString($html);
        $this->assertNotEmpty($html);
        $this->assertStringContainsString('<div', $html);
    }

    public function testRenderConsistency()
    {
        $debugData = [
            'response_time' => 0.1,
            'query_count' => 5
        ];

        $html1 = $this->renderer->render($debugData);
        $html2 = $this->renderer->render($debugData);

        // Multiple renders with same data should be consistent
        $this->assertEquals($html1, $html2);
    }

    public function testRenderHtmlValidation()
    {
        $debugData = [
            'response_time' => 0.1,
            'query_count' => 5
        ];

        $html = $this->renderer->render($debugData);

        // Basic HTML structure validation
        $this->assertStringContainsString('<!DOCTYPE html>', $html);
        $this->assertStringContainsString('<html', $html);
        $this->assertStringContainsString('</html>', $html);
        $this->assertStringContainsString('<head>', $html);
        $this->assertStringContainsString('</head>', $html);
        $this->assertStringContainsString('<body>', $html);
        $this->assertStringContainsString('</body>', $html);
    }
}
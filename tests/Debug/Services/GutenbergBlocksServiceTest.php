<?php

namespace Tests\Debug\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\Services\GutenbergBlocksService;

/**
 * Gutenberg Blocks Service Test
 *
 * @package Tests\Debug\Services
 * @since 2.0.1
 */
class GutenbergBlocksServiceTest extends TestCase
{
    private GutenbergBlocksService $gutenbergBlocksService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->gutenbergBlocksService = new GutenbergBlocksService();
    }

    public function testCaptureInfo()
    {
        $this->gutenbergBlocksService->captureInfo();

        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();
        $this->assertIsArray($blocksInfo);
        $this->assertNotEmpty($blocksInfo);
    }

    public function testGetBlocksInfo()
    {
        $this->gutenbergBlocksService->captureInfo();

        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $this->assertIsArray($blocksInfo);
        $this->assertArrayHasKey('total_blocks', $blocksInfo);
        $this->assertArrayHasKey('block_types', $blocksInfo);
        $this->assertArrayHasKey('is_gutenberg_editor', $blocksInfo);
        $this->assertArrayHasKey('is_gutenberg_frontend', $blocksInfo);
    }

    public function testBlocksInfoStructure()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $this->assertIsInt($blocksInfo['total_blocks']);
        $this->assertIsArray($blocksInfo['block_types']);
        $this->assertIsBool($blocksInfo['is_gutenberg_editor']);
        $this->assertIsBool($blocksInfo['is_gutenberg_frontend']);
    }

    public function testTotalBlocksCount()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $totalBlocks = $blocksInfo['total_blocks'];
        $this->assertIsInt($totalBlocks);
        $this->assertGreaterThanOrEqual(0, $totalBlocks);
    }

    public function testBlockTypesStructure()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $blockTypes = $blocksInfo['block_types'];
        $this->assertIsArray($blockTypes);

        // Each block type should have a count
        foreach ($blockTypes as $blockName => $count) {
            $this->assertIsString($blockName);
            $this->assertIsInt($count);
            $this->assertGreaterThan(0, $count);
        }
    }

    public function testGutenbergEditorDetection()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $isGutenbergEditor = $blocksInfo['is_gutenberg_editor'];
        $this->assertIsBool($isGutenbergEditor);
    }

    public function testGutenbergFrontendDetection()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $isGutenbergFrontend = $blocksInfo['is_gutenberg_frontend'];
        $this->assertIsBool($isGutenbergFrontend);
    }

    public function testTemplatePartsCount()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        if (isset($blocksInfo['template_parts'])) {
            $templateParts = $blocksInfo['template_parts'];
            $this->assertIsInt($templateParts);
            $this->assertGreaterThanOrEqual(0, $templateParts);
        }
    }

    public function testMultipleCaptureInfoCalls()
    {
        // First capture
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo1 = $this->gutenbergBlocksService->getBlocksInfo();

        // Second capture
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo2 = $this->gutenbergBlocksService->getBlocksInfo();

        // Both should have the same structure
        $this->assertEquals(array_keys($blocksInfo1), array_keys($blocksInfo2));
    }

    public function testBlocksInfoPerformance()
    {
        $startTime = microtime(true);

        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete quickly (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
        $this->assertIsArray($blocksInfo);
    }

    public function testBlockTypesConsistency()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $totalBlocks = $blocksInfo['total_blocks'];
        $blockTypes = $blocksInfo['block_types'];

        // Sum of all block type counts should equal total blocks
        $calculatedTotal = array_sum($blockTypes);
        $this->assertEquals($totalBlocks, $calculatedTotal);
    }

    public function testEmptyBlocksInfo()
    {
        // Test with no blocks
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $this->assertIsArray($blocksInfo);
        $this->assertArrayHasKey('total_blocks', $blocksInfo);
        $this->assertArrayHasKey('block_types', $blocksInfo);

        // Should handle empty state gracefully
        $this->assertIsInt($blocksInfo['total_blocks']);
        $this->assertIsArray($blocksInfo['block_types']);
    }

    public function testBlockTypesAccuracy()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $blockTypes = $blocksInfo['block_types'];

        // Each block type should be a valid block name
        foreach ($blockTypes as $blockName => $count) {
            // Block names should not be empty
            $this->assertNotEmpty($blockName);

            // Count should be positive
            $this->assertGreaterThan(0, $count);

            // Block name should be a string
            $this->assertIsString($blockName);
        }
    }

    public function testEditorModeConsistency()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $isGutenbergEditor = $blocksInfo['is_gutenberg_editor'];
        $isGutenbergFrontend = $blocksInfo['is_gutenberg_frontend'];

        // Both should be boolean values
        $this->assertIsBool($isGutenbergEditor);
        $this->assertIsBool($isGutenbergFrontend);
    }

    public function testBlocksInfoDefaultValues()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        // Test default values
        $this->assertEquals(0, $blocksInfo['total_blocks']);
        $this->assertIsArray($blocksInfo['block_types']);
        $this->assertIsBool($blocksInfo['is_gutenberg_editor']);
        $this->assertIsBool($blocksInfo['is_gutenberg_frontend']);
    }

    public function testBlocksInfoMemoryUsage()
    {
        $memoryBefore = memory_get_usage(true);

        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        $memoryAfter = memory_get_usage(true);
        $memoryUsed = $memoryAfter - $memoryBefore;

        // Should not use excessive memory
        $this->assertLessThan(1024 * 1024, $memoryUsed); // Less than 1MB

        $this->assertIsArray($blocksInfo);
    }

    public function testBlocksInfoConsistency()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo1 = $this->gutenbergBlocksService->getBlocksInfo();

        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo2 = $this->gutenbergBlocksService->getBlocksInfo();

        $this->assertEquals($blocksInfo1, $blocksInfo2);
    }

    public function testThemeTemplateBlocksDetection()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        // Should detect if we're using block theme
        if (function_exists('wp_is_block_theme') && wp_is_block_theme()) {
            $this->assertGreaterThanOrEqual(0, $blocksInfo['total_blocks']);
        }
    }

    public function testWidgetBlocksDetection()
    {
        $this->gutenbergBlocksService->captureInfo();
        $blocksInfo = $this->gutenbergBlocksService->getBlocksInfo();

        // Should detect widget areas
        if (function_exists('is_active_sidebar')) {
            $this->assertIsBool($blocksInfo['is_gutenberg_frontend']);
        }
    }
}
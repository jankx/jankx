<?php

/**
 * Block Test Generator
 * 
 * Utility class to generate test files for Gutenberg blocks
 * Based on block structure and block.json attributes
 */

namespace Tests\Gutenberg\Blocks;

class BlockTestGenerator
{
    /**
     * Generate test file content for a block
     * 
     * @param string $blockName Block name (e.g., 'advanced-image-box')
     * @param string $blockId Block ID (e.g., 'jankx/advanced-image-box')
     * @param string $phpClass PHP class name (e.g., 'AdvancedImageBoxBlock')
     * @param array $defaultAttributes Default attributes from block.json
     * @return string Generated test file content
     */
    public static function generateTestFile(
        string $blockName,
        string $blockId,
        string $phpClass,
        array $defaultAttributes = []
    ): string {
        $namespace = 'Tests\Gutenberg\Blocks';
        $testClassName = $phpClass . 'Test';
        
        $defaultAttributesCode = self::formatAttributesArray($defaultAttributes);
        
        return <<<PHP
<?php

namespace {$namespace};

use Tests\Gutenberg\Blocks\BlockTestCase;
use Jankx\Gutenberg\Blocks\\{$phpClass};
use Mockery;

/**
 * Unit tests for {$phpClass}
 * 
 * Tests the PHP rendering logic of the {$blockName} block
 */
class {$testClassName} extends BlockTestCase
{
    protected {$phpClass} \$block;

    protected function setUp(): void
    {
        parent::setUp();
        \$this->block = new {$phpClass}();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    protected function getBlockId(): string
    {
        return '{$blockId}';
    }

    protected function createBlockInstance(): {$phpClass}
    {
        return new {$phpClass}();
    }

    protected function getDefaultAttributes(): array
    {
        return {$defaultAttributesCode};
    }

    /**
     * Test block ID is correct
     */
    public function test_block_id_is_correct(): void
    {
        \$this->assertEquals('{$blockId}', \$this->getBlockId());
    }

    /**
     * Test render with default attributes
     */
    public function test_render_with_default_attributes(): void
    {
        \$attributes = \$this->getDefaultAttributes();
        
        \$block = \$this->createMockBlock(\$attributes);
        
        \$html = \$this->block->render(\$attributes, '', \$block);

        \$this->assertNotEmpty(\$html);
        \$this->assertValidHtml(\$html);
    }

    /**
     * Test HTML output is properly escaped
     */
    public function test_html_output_is_properly_escaped(): void
    {
        \$attributes = \$this->getDefaultAttributes();
        // Add test for escaping if block has text/URL attributes
        
        \$block = \$this->createMockBlock(\$attributes);
        
        \$html = \$this->block->render(\$attributes, '', \$block);

        \$this->assertNotEmpty(\$html);
        // Add specific escaping assertions based on block attributes
    }

    // TODO: Add more specific test cases based on block functionality
}

PHP;
    }

    /**
     * Format attributes array for PHP code
     * 
     * @param array $attributes
     * @return string Formatted PHP array code
     */
    private static function formatAttributesArray(array $attributes): string
    {
        if (empty($attributes)) {
            return '[]';
        }

        $formatted = "[\n";
        foreach ($attributes as $key => $value) {
            $formatted .= "            " . self::formatAttribute($key, $value) . ",\n";
        }
        $formatted .= "        ]";

        return $formatted;
    }

    /**
     * Format single attribute for PHP code
     * 
     * @param string $key
     * @param mixed $value
     * @return string
     */
    private static function formatAttribute(string $key, $value): string
    {
        $keyStr = "'{$key}'";
        
        if (is_string($value)) {
            return "{$keyStr} => " . var_export($value, true);
        } elseif (is_bool($value)) {
            return "{$keyStr} => " . ($value ? 'true' : 'false');
        } elseif (is_int($value) || is_float($value)) {
            return "{$keyStr} => {$value}";
        } elseif (is_null($value)) {
            return "{$keyStr} => null";
        } elseif (is_array($value)) {
            $arrayStr = self::formatAttributesArray($value);
            return "{$keyStr} => {$arrayStr}";
        } else {
            return "{$keyStr} => " . var_export($value, true);
        }
    }
}

<?php

namespace Tests\Gutenberg\Blocks;

use Jankx\Gutenberg\Blocks\DynamicDataLayoutBlock;
use Tests\Helpers\TestCase;

/**
 * Unit tests for the image ratio normaliser shared by both layout blocks.
 *
 * The layout level imageRatio is written into a CSS custom property, and block
 * attributes round-trip through saved post content, so this guard is what keeps
 * a value that is not a plain ratio out of the stylesheet.
 */
class ImageRatioNormalizerTest extends TestCase
{
    /**
     * @param mixed $value
     */
    private function normalize($value): string
    {
        $method = new \ReflectionMethod(DynamicDataLayoutBlock::class, 'normalizeImageRatio');
        $method->setAccessible(true);

        return $method->invoke(null, $value);
    }

    public function testPassesThroughPlainRatios(): void
    {
        $this->assertSame('16/9', $this->normalize('16/9'));
        $this->assertSame('1/1', $this->normalize('1/1'));
        $this->assertSame('21/9', $this->normalize('21/9'));
    }

    public function testTrimsAndNormalisesSurroundingWhitespace(): void
    {
        $this->assertSame('16/9', $this->normalize('  16/9  '));
        $this->assertSame('4/3', $this->normalize('4 / 3'));
    }

    public function testRejectsEmptyAndNonStringValues(): void
    {
        $this->assertSame('', $this->normalize(''));
        $this->assertSame('', $this->normalize('   '));
        $this->assertSame('', $this->normalize(null));
        $this->assertSame('', $this->normalize(169));
        $this->assertSame('', $this->normalize(['16/9']));
        $this->assertSame('', $this->normalize(true));
    }

    public function testRejectsValuesThatAreNotBareRatios(): void
    {
        // Colon form is what the responsive ratio control uses, not this one.
        $this->assertSame('', $this->normalize('16:9'));
        $this->assertSame('', $this->normalize('auto'));
        $this->assertSame('', $this->normalize('16/'));
        $this->assertSame('', $this->normalize('/9'));
    }

    public function testRejectsCssInjectionAttempts(): void
    {
        $this->assertSame('', $this->normalize('16/9; background:url(evil)'));
        $this->assertSame('', $this->normalize('1/1;}body{display:none'));
        $this->assertSame('', $this->normalize("16/9\n--x:1"));
        $this->assertSame('', $this->normalize('1e3/1'));
    }

    public function testRejectsZeroDenominators(): void
    {
        $this->assertSame('', $this->normalize('16/0'));
        $this->assertSame('', $this->normalize('0/9'));
    }
}

<?php

namespace Tests\Gutenberg\Layouts;

use Jankx\Layouts\DynamicDataLayout\CarouselArrowsRenderer;
use Tests\Helpers\TestCase;

/**
 * Unit tests for CarouselArrowsRenderer.
 *
 * Covers the prev/next buttons markup produced from the carousel-arrows child
 * block settings (show/hide, icon types and button styles).
 */
class CarouselArrowsRendererTest extends TestCase
{
    public function testRenderDefaultsToChevronButtons(): void
    {
        $html = CarouselArrowsRenderer::render([]);

        $this->assertStringContainsString(
            'class="embla__button embla__button--prev carousel-nav carousel-prev"',
            $html
        );
        $this->assertStringContainsString(
            'class="embla__button embla__button--next carousel-nav carousel-next"',
            $html
        );
        $this->assertStringContainsString('aria-label="Previous slide"', $html);
        $this->assertStringContainsString('aria-label="Next slide"', $html);
        $this->assertStringContainsString('width:44px', $html);
        $this->assertStringContainsString('height:44px', $html);
        $this->assertStringContainsString('<svg', $html);
        $this->assertStringNotContainsString('background-color:', $html);
    }

    public function testRenderReturnsEmptyWhenHidden(): void
    {
        $this->assertSame('', CarouselArrowsRenderer::render(['showArrows' => false]));
    }

    public function testRenderRespectsParentShowArrowsFallback(): void
    {
        $this->assertSame('', CarouselArrowsRenderer::render([], false));
        $this->assertNotSame('', CarouselArrowsRenderer::render([], true));
    }

    public function testRenderAppliesButtonStyles(): void
    {
        $html = CarouselArrowsRenderer::render([
            'navBtnWidth' => 60,
            'navBtnHeight' => 50,
            'navBtnBorderRadius' => 20,
            'navBtnBgColor' => '#ff0000',
            'navIconColor' => '#0000ff',
        ]);

        $this->assertStringContainsString('width:60px', $html);
        $this->assertStringContainsString('height:50px', $html);
        $this->assertStringContainsString('border-radius:20%', $html);
        $this->assertStringContainsString('background-color:#ff0000', $html);
        $this->assertStringContainsString('color:#0000ff', $html);
    }

    public function testRenderImageIcons(): void
    {
        $html = CarouselArrowsRenderer::render([
            'navIconType' => 'image',
            'prevIconImageUrl' => 'https://example.com/prev.png',
            'nextIconImageUrl' => 'https://example.com/next.png',
        ]);

        $this->assertStringContainsString('<img src="https://example.com/prev.png"', $html);
        $this->assertStringContainsString('<img src="https://example.com/next.png"', $html);
    }

    public function testRenderSvgIcons(): void
    {
        $html = CarouselArrowsRenderer::render([
            'navIconType' => 'svg',
            'prevIconSvg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>',
            'nextIconSvg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>',
        ]);

        $this->assertStringContainsString('M15 18l-6-6 6-6', $html);
        $this->assertStringContainsString('M9 18l6-6-6-6', $html);
    }

    public function testRenderFontIcons(): void
    {
        $html = CarouselArrowsRenderer::render([
            'navIconType' => 'fonticon',
            'prevIconClass' => 'dashicons dashicons-arrow-left-alt2',
            'nextIconClass' => 'dashicons dashicons-arrow-right-alt2',
        ]);

        $this->assertStringContainsString(
            'class="dashicons dashicons-arrow-left-alt2"',
            $html
        );
        $this->assertStringContainsString(
            'class="dashicons dashicons-arrow-right-alt2"',
            $html
        );
    }

    public function testPositionClassMapping(): void
    {
        $this->assertSame('', CarouselArrowsRenderer::positionClass([]));
        $this->assertSame('', CarouselArrowsRenderer::positionClass(['arrowsPosition' => 'inside']));
        $this->assertSame(
            'carousel-arrows-position-outside',
            CarouselArrowsRenderer::positionClass(['arrowsPosition' => 'outside'])
        );
        $this->assertSame(
            'carousel-arrows-position-bottom',
            CarouselArrowsRenderer::positionClass(['arrowsPosition' => 'bottom'])
        );
        $this->assertSame('', CarouselArrowsRenderer::positionClass(['arrowsPosition' => 'unknown']));
    }

    public function testIconSizeIsSanitized(): void
    {
        $html = CarouselArrowsRenderer::render(['navIconSize' => 4]);

        $this->assertStringContainsString('width:12px', $html);
    }
}
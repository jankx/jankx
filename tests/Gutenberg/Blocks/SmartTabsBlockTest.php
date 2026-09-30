<?php

namespace Tests\Gutenberg\Blocks;

use ReflectionMethod;
use Jankx\Gutenberg\Blocks\SmartTabsBlock;

/**
 * Unit tests for SmartTabsBlock tab icon rendering.
 *
 * Covers the icon resolution used in the tabs navigation: icon inner blocks
 * (svg / image / icon picker) take precedence over the legacy attribute icon,
 * position controls, and the helper lookups.
 */
class SmartTabsBlockTest extends BlockTestCase
{
    protected function getBlockId(): string
    {
        return 'jankx/smart-tabs';
    }

    protected function createBlockInstance(): SmartTabsBlock
    {
        return new SmartTabsBlock();
    }

    protected function getDefaultAttributes(): array
    {
        return [
            'tabType' => 'horizontal',
            'styleType' => 'default',
            'activeTab' => 0,
            'tabAlignment' => 'left',
            'hideTabsBorderBottom' => false,
            'centerNavigation' => false,
            'hideTabContent' => false,
        ];
    }

    /**
     * Invoke the protected renderTabNavigation method.
     */
    protected function renderTabNavigation(array $innerBlocks, array $parentAttributes = []): string
    {
        $method = new ReflectionMethod(SmartTabsBlock::class, 'renderTabNavigation');
        return $method->invoke(new SmartTabsBlock(), $innerBlocks, 0, 'left', $parentAttributes);
    }

    /**
     * Invoke the protected findTabIconBlock method.
     */
    protected function findTabIconBlock(array $innerBlocks): array
    {
        $method = new ReflectionMethod(SmartTabsBlock::class, 'findTabIconBlock');
        return $method->invoke(new SmartTabsBlock(), $innerBlocks);
    }

    /**
     * Invoke the protected renderTabIconMarkup method.
     */
    protected function renderTabIconMarkup(array $iconBlock): string
    {
        $method = new ReflectionMethod(SmartTabsBlock::class, 'renderTabIconMarkup');
        return $method->invoke(new SmartTabsBlock(), $iconBlock);
    }

    protected function manualTab(array $attributes, array $innerBlocks = []): array
    {
        return [
            'blockName' => 'jankx/smart-tab',
            'attrs' => $attributes,
            'innerBlocks' => $innerBlocks,
        ];
    }

    public function testRenderTabNavigationFallsBackToLegacySvgIcon(): void
    {
        $html = $this->renderTabNavigation([
            $this->manualTab([
                'title' => 'Legacy',
                'iconType' => 'svg',
                'icon' => '<svg><path d="legacy"/></svg>',
            ]),
        ]);

        $this->assertStringContainsString('class="smart-tabs__nav-icon"', $html);
        $this->assertStringContainsString('<svg><path d="legacy"/></svg>', $html);
        $this->assertStringContainsString('>Legacy</span>', $html);
    }

    public function testRenderTabNavigationPrefersSvgIconInnerBlock(): void
    {
        $html = $this->renderTabNavigation([
            $this->manualTab(
                [
                    'title' => 'Tab',
                    'iconType' => 'svg',
                    'icon' => '<svg><path d="legacy"/></svg>',
                ],
                [
                    [
                        'blockName' => 'jankx/svg-icon',
                        'attrs' => ['icon' => '<svg><path d="inner"/></svg>'],
                    ],
                    [
                        'blockName' => 'core/paragraph',
                        'attrs' => ['content' => 'body'],
                    ],
                ]
            ),
        ]);

        $this->assertStringContainsString('<svg><path d="inner"/></svg>', $html);
        $this->assertStringNotContainsString('legacy', $html);
    }

    public function testRenderTabNavigationRendersImageIconFromUrl(): void
    {
        $html = $this->renderTabNavigation([
            $this->manualTab(
                ['title' => 'Tab', 'iconType' => 'image'],
                [
                    [
                        'blockName' => 'jankx/advanced-image-box',
                        'attrs' => ['url' => 'https://example.com/icon.png', 'alt' => 'Icon'],
                    ],
                ]
            ),
        ]);

        $this->assertStringContainsString(
            '<img src="https://example.com/icon.png" alt="Icon" class="smart-tabs__nav-image" />',
            $html
        );
    }

    public function testRenderTabNavigationResolvesImageIconFromAttachmentId(): void
    {
        $html = $this->renderTabNavigation([
            $this->manualTab(
                ['title' => 'Tab', 'iconType' => 'image'],
                [
                    [
                        'blockName' => 'jankx/advanced-image-box',
                        'attrs' => ['id' => 99],
                    ],
                ]
            ),
        ]);

        $this->assertStringContainsString(
            '<img src="mock-attachment-99.jpg" alt="" class="smart-tabs__nav-image" />',
            $html
        );
    }

    public function testRenderTabNavigationRendersFontAwesomePickerIcon(): void
    {
        $html = $this->renderTabNavigation([
            $this->manualTab(
                ['title' => 'Tab', 'iconType' => 'picker'],
                [
                    [
                        'blockName' => 'jankx/icon-picker',
                        'attrs' => [
                            'iconName' => 'rocketchat',
                            'iconType' => 'fontawesome',
                            'iconCategory' => 'brands',
                        ],
                    ],
                ]
            ),
        ]);

        $this->assertStringContainsString('<i class="fab fa-rocketchat"', $html);
    }

    public function testRenderTabNavigationRendersMaterialPickerIcon(): void
    {
        $html = $this->renderTabNavigation([
            $this->manualTab(
                ['title' => 'Tab', 'iconType' => 'picker'],
                [
                    [
                        'blockName' => 'jankx/icon-picker',
                        'attrs' => [
                            'iconName' => 'home',
                            'iconType' => 'material',
                            'iconSize' => '24px',
                            'iconColor' => '#333333',
                        ],
                    ],
                ]
            ),
        ]);

        $this->assertStringContainsString(
            '<span class="material-icons" style="font-size: 24px; color: #333333">home</span>',
            $html
        );
    }

    public function testRenderTabNavigationPlacesIconAfterLabel(): void
    {
        $html = $this->renderTabNavigation([
            $this->manualTab([
                'title' => 'Tab',
                'iconType' => 'svg',
                'icon' => '<svg><path d="x"/></svg>',
                'iconPosition' => 'after',
            ]),
        ]);

        $this->assertMatchesRegularExpression(
            '/smart-tabs__nav-label[\s\S]*smart-tabs__nav-icon/',
            $html
        );
    }

    public function testRenderTabNavigationSkipsIconWhenTypeNone(): void
    {
        $html = $this->renderTabNavigation([
            $this->manualTab(
                ['title' => 'Tab', 'iconType' => 'none'],
                [
                    [
                        'blockName' => 'jankx/svg-icon',
                        'attrs' => ['icon' => '<svg><path d="x"/></svg>'],
                    ],
                ]
            ),
        ]);

        $this->assertStringNotContainsString('smart-tabs__nav-icon', $html);
    }

    public function testFindTabIconBlockReturnsFirstIconBlock(): void
    {
        $found = $this->findTabIconBlock([
            [
                'blockName' => 'core/paragraph',
                'attrs' => ['content' => 'a'],
            ],
            [
                'blockName' => 'jankx/icon-picker',
                'attrs' => ['iconName' => 'home'],
            ],
            [
                'blockName' => 'jankx/svg-icon',
                'attrs' => ['icon' => '<svg></svg>'],
            ],
        ]);

        $this->assertSame('jankx/icon-picker', $found['blockName']);
    }

    public function testFindTabIconBlockReturnsEmptyArrayWhenNone(): void
    {
        $found = $this->findTabIconBlock([
            ['blockName' => 'core/paragraph', 'attrs' => []],
            ['blockName' => 'jankx/advanced-filter', 'attrs' => []],
        ]);

        $this->assertSame([], $found);
    }

    public function testRenderTabIconMarkupReturnsEmptyForUnknownBlock(): void
    {
        $this->assertSame('', $this->renderTabIconMarkup([
            'blockName' => 'core/paragraph',
            'attrs' => [],
        ]));
    }
}
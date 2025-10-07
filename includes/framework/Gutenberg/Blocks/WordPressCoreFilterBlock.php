<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Facades\Log;
use Jankx\Gutenberg\Block;

/**
 * WordPress Core Filter Block
 *
 * Đăng ký filters để có thể chèn content vào các WordPress core blocks
 * như core/button và core/read-more
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */
class WordPressCoreFilterBlock extends Block
{
    protected $blockId = 'jankxcore-filters';

    /**
     * Danh sách các blocks được hỗ trợ để chèn content
     *
     * @var array
     */
    protected $supportedBlocks = [];

    /**
     * Danh sách các core blocks cần filter
     *
     * @var array
     */
    protected $coreBlocks = [
        'core/button',
        'core/read-more',
    ];

    /**
     * Constructor
     */
    public function __construct()
    {
        // Khởi tạo danh sách supported blocks
        $this->initializeSupportedBlocks();
    }

    /**
     * Khởi tạo danh sách các blocks được hỗ trợ
     *
     * @return void
     */
    protected function initializeSupportedBlocks()
    {
        $blocksBasePath = get_template_directory() . '/resources/blocks';

        $this->supportedBlocks = [
            'jankx/icon-button' => [
                'path' => $blocksBasePath . '/icon-button',
                'priority' => 10,
            ],
            'jankx/image-button' => [
                'path' => $blocksBasePath . '/image-button',
                'priority' => 10,
            ],
            'jankx/svg-icon' => [
                'path' => $blocksBasePath . '/svg-icon',
                'priority' => 10,
            ],
        ];

        // Cho phép filter để thêm/bớt supported blocks
        $this->supportedBlocks = apply_filters(
            'jankx/gutenberg/core-filter/supported-blocks',
            $this->supportedBlocks
        );
    }

    /**
     * Khởi tạo và đăng ký filters
     *
     * @return void
     */
    public function init()
    {
        // Đăng ký render_block filter cho mỗi core block
        foreach ($this->coreBlocks as $blockName) {
            add_filter(
                'render_block_' . str_replace('/', '_', $blockName),
                [$this, 'filterBlockContent'],
                10,
                2
            );
        }

        // Enqueue editor assets
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);

        // Log để debug
        Log::info('WordPressCoreFilterBlock: Đã đăng ký filters cho ' . count($this->coreBlocks) . ' core blocks');
    }

    /**
     * Enqueue editor assets (JavaScript và CSS cho Gutenberg editor)
     *
     * @return void
     */
    public function enqueueEditorAssets()
    {
        $blockPath = get_template_directory() . '/resources/blocks/core-filters';
        $blockUrl = get_template_directory_uri() . '/resources/blocks/core-filters';

        // Đường dẫn đến build files
        $scriptPath = $blockPath . '/build/index.js';
        $stylePath = $blockPath . '/build/editor.css';
        $assetPath = $blockPath . '/build/index.asset.php';

        // Kiểm tra file tồn tại
        if (!file_exists($scriptPath)) {
            Log::warning('WordPressCoreFilterBlock: Script file not found - ' . $scriptPath);
            return;
        }

        // Load asset file để lấy dependencies và version
        $asset = file_exists($assetPath)
            ? include $assetPath
            : ['dependencies' => ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor', 'wp-components', 'wp-compose', 'wp-hooks'], 'version' => filemtime($scriptPath)];

        // Enqueue script
        wp_enqueue_script(
            'jankx-core-filters',
            $blockUrl . '/build/index.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );

        // Enqueue editor styles
        if (file_exists($stylePath)) {
            wp_enqueue_style(
                'jankx-core-filters-editor',
                $blockUrl . '/build/editor.css',
                ['wp-edit-blocks'],
                filemtime($stylePath)
            );
        }

        // Localize script với các settings
        wp_localize_script('jankx-core-filters', 'jankxCoreFilters', [
            'supportedBlocks' => $this->supportedBlocks,
            'coreBlocks' => $this->coreBlocks,
        ]);

        Log::info('WordPressCoreFilterBlock: Đã enqueue editor assets');
    }

    /**
     * Filter block content để chèn thêm content
     *
     * @param string $block_content The block content.
     * @param array  $block         The full block, including name and attributes.
     * @return string Modified block content
     */
    public function filterBlockContent($block_content, $block)
    {
        // Kiểm tra xem có attributes để chèn content không
        if (empty($block['attrs'])) {
            return $block_content;
        }

        $attrs = $block['attrs'];

        // Áp dụng filter dựa trên block name
        $blockName = $block['blockName'] ?? '';

        switch ($blockName) {
            case 'core/button':
                $block_content = $this->filterButtonBlock($block_content, $attrs, $block);
                break;

            case 'core/read-more':
                $block_content = $this->filterReadMoreBlock($block_content, $attrs, $block);
                break;
        }

        // Cho phép custom filter cho từng block
        return apply_filters(
            'jankx/gutenberg/core-filter/block-content',
            $block_content,
            $block,
            $this->supportedBlocks
        );
    }

    /**
     * Filter core/button block
     *
     * @param string $content Block content
     * @param array  $attrs   Block attributes
     * @param array  $block   Full block data
     * @return string Modified content
     */
    protected function filterButtonBlock($content, $attrs, $block)
    {
        // Kiểm tra xem có yêu cầu chèn icon không
        $hasIcon = $attrs['hasIcon'] ?? false;
        $iconType = $attrs['iconType'] ?? ''; // 'jankx/icon-button', 'jankx/image-button', 'jankx/svg-icon'

        if (!$hasIcon || empty($iconType) || !isset($this->supportedBlocks[$iconType])) {
            return $content;
        }

        // Render icon based on type
        $iconHtml = $this->renderIcon($iconType, $attrs);

        if (empty($iconHtml)) {
            return $content;
        }

        // Chèn icon vào button
        $iconPosition = $attrs['iconPosition'] ?? 'before';
        $content = $this->insertIconIntoButton($content, $iconHtml, $iconPosition);

        return $content;
    }

    /**
     * Filter core/read-more block
     *
     * @param string $content Block content
     * @param array  $attrs   Block attributes
     * @param array  $block   Full block data
     * @return string Modified content
     */
    protected function filterReadMoreBlock($content, $attrs, $block)
    {
        // Kiểm tra xem có yêu cầu chèn icon không
        $hasIcon = $attrs['hasIcon'] ?? false;
        $iconType = $attrs['iconType'] ?? '';

        if (!$hasIcon || empty($iconType) || !isset($this->supportedBlocks[$iconType])) {
            return $content;
        }

        // Render icon
        $iconHtml = $this->renderIcon($iconType, $attrs);

        if (empty($iconHtml)) {
            return $content;
        }

        // Chèn icon vào read more link
        $iconPosition = $attrs['iconPosition'] ?? 'after';
        $content = $this->insertIconIntoLink($content, $iconHtml, $iconPosition);

        return $content;
    }

    /**
     * Render icon dựa vào type
     *
     * @param string $iconType Icon type (block name)
     * @param array  $attrs    Attributes
     * @return string Icon HTML
     */
    protected function renderIcon($iconType, $attrs)
    {
        $iconHtml = '';

        switch ($iconType) {
            case 'jankx/icon-button':
                $iconHtml = $this->renderMaterialIcon($attrs);
                break;

            case 'jankx/image-button':
                $iconHtml = $this->renderImageIcon($attrs);
                break;

            case 'jankx/svg-icon':
                $iconHtml = $this->renderSvgIcon($attrs);
                break;
        }

        // Cho phép filter icon HTML
        return apply_filters(
            'jankx/gutenberg/core-filter/icon-html',
            $iconHtml,
            $iconType,
            $attrs
        );
    }

    /**
     * Render Material Icon (từ icon-button block)
     *
     * @param array $attrs Attributes
     * @return string Icon HTML
     */
    protected function renderMaterialIcon($attrs)
    {
        $iconName = $attrs['iconName'] ?? '';
        $iconStyle = $attrs['iconStyle'] ?? 'filled';
        $iconSize = $attrs['iconSize'] ?? '16px';
        $iconColor = $attrs['iconColor'] ?? '';

        if (empty($iconName)) {
            return '';
        }

        $styleClass = $iconStyle !== 'filled' ? "material-icons-{$iconStyle}" : 'material-icons';

        $styles = [
            'font-size' => $iconSize,
        ];

        if (!empty($iconColor)) {
            $styles['color'] = $iconColor;
        }

        $styleAttr = $this->buildStyleAttribute($styles);

        return sprintf(
            '<span class="%s" %s>%s</span>',
            esc_attr($styleClass),
            $styleAttr,
            esc_html($iconName)
        );
    }

    /**
     * Render Image Icon (từ image-button block)
     *
     * @param array $attrs Attributes
     * @return string Icon HTML
     */
    protected function renderImageIcon($attrs)
    {
        $imageUrl = $attrs['imageUrl'] ?? '';
        $imageAlt = $attrs['imageAlt'] ?? '';
        $imageSize = $attrs['imageSize'] ?? '20px';
        $imageMarginRight = $attrs['imageMarginRight'] ?? '5px';

        if (empty($imageUrl)) {
            return '';
        }

        $styles = [
            'height' => $imageSize,
            'width' => 'auto',
            'margin-right' => $imageMarginRight,
            'vertical-align' => 'middle',
        ];

        $styleAttr = $this->buildStyleAttribute($styles);

        return sprintf(
            '<img src="%s" alt="%s" %s />',
            esc_url($imageUrl),
            esc_attr($imageAlt),
            $styleAttr
        );
    }

    /**
     * Render SVG Icon (từ svg-icon block)
     *
     * @param array $attrs Attributes
     * @return string Icon HTML
     */
    protected function renderSvgIcon($attrs)
    {
        $icon = $attrs['icon'] ?? '';
        $iconColor = $attrs['iconColor'] ?? '';
        $width = $attrs['width'] ?? '20px';

        if (empty($icon)) {
            return '';
        }

        // Nếu icon đã là HTML, return luôn
        if (strpos($icon, '<svg') !== false) {
            $iconHtml = $icon;

            // Thêm color nếu có
            if (!empty($iconColor)) {
                $iconHtml = str_replace('<svg', '<svg style="color: ' . esc_attr($iconColor) . '"', $iconHtml);
            }

            return $iconHtml;
        }

        return '';
    }

    /**
     * Build style attribute từ array
     *
     * @param array $styles Styles array
     * @return string Style attribute
     */
    protected function buildStyleAttribute($styles)
    {
        if (empty($styles)) {
            return '';
        }

        $styleString = '';
        foreach ($styles as $property => $value) {
            if (!empty($value)) {
                $styleString .= sprintf('%s: %s; ', esc_attr($property), esc_attr($value));
            }
        }

        return $styleString ? 'style="' . trim($styleString) . '"' : '';
    }

    /**
     * Chèn icon vào button
     *
     * @param string $content      Button HTML
     * @param string $iconHtml     Icon HTML
     * @param string $iconPosition Position (before/after)
     * @return string Modified HTML
     */
    protected function insertIconIntoButton($content, $iconHtml, $iconPosition = 'before')
    {
        // Tìm thẻ đóng </a> hoặc </button>
        if (preg_match('/<(a|button)([^>]*)>(.*?)<\/(a|button)>/s', $content, $matches)) {
            $tag = $matches[1];
            $attributes = $matches[2];
            $innerContent = $matches[3];

            // Thêm class để style
            $attributes = $this->addClassToAttributes($attributes, 'has-icon icon-position-' . $iconPosition);

            if ($iconPosition === 'before') {
                $newInnerContent = $iconHtml . $innerContent;
            } else {
                $newInnerContent = $innerContent . $iconHtml;
            }

            $content = sprintf(
                '<%s%s>%s</%s>',
                $tag,
                $attributes,
                $newInnerContent,
                $tag
            );
        }

        return $content;
    }

    /**
     * Chèn icon vào link
     *
     * @param string $content      Link HTML
     * @param string $iconHtml     Icon HTML
     * @param string $iconPosition Position (before/after)
     * @return string Modified HTML
     */
    protected function insertIconIntoLink($content, $iconHtml, $iconPosition = 'after')
    {
        return $this->insertIconIntoButton($content, $iconHtml, $iconPosition);
    }

    /**
     * Thêm class vào attributes string
     *
     * @param string $attributes HTML attributes string
     * @param string $newClass   Class to add
     * @return string Modified attributes
     */
    protected function addClassToAttributes($attributes, $newClass)
    {
        // Kiểm tra xem đã có class chưa
        if (preg_match('/class=["\']([^"\']*)["\']/', $attributes, $matches)) {
            $existingClasses = $matches[1];
            $newClassValue = $existingClasses . ' ' . $newClass;
            $attributes = preg_replace(
                '/class=["\']([^"\']*)["\']/',
                'class="' . esc_attr($newClassValue) . '"',
                $attributes
            );
        } else {
            // Chưa có class, thêm mới
            $attributes .= ' class="' . esc_attr($newClass) . '"';
        }

        return $attributes;
    }

    /**
     * Get supported blocks
     *
     * @return array
     */
    public function getSupportedBlocks()
    {
        return $this->supportedBlocks;
    }

    /**
     * Get core blocks list
     *
     * @return array
     */
    public function getCoreBlocks()
    {
        return $this->coreBlocks;
    }

    /**
     * Thêm supported block
     *
     * @param string $blockName Block name
     * @param array  $config    Block configuration
     * @return void
     */
    public function addSupportedBlock($blockName, $config)
    {
        $this->supportedBlocks[$blockName] = $config;
    }

    /**
     * Thêm core block cần filter
     *
     * @param string $blockName Block name
     * @return void
     */
    public function addCoreBlock($blockName)
    {
        if (!in_array($blockName, $this->coreBlocks)) {
            $this->coreBlocks[] = $blockName;
        }
    }
}


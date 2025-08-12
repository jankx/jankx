<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;

class LanguageSwitcherService extends AbstractService
{
    /**
     * @var string
     */
    protected $name = 'language-switcher';

    /**
     * @var array
     */
    protected $languages = [];

    /**
     * @var string
     */
    protected $currentLanguage = '';

    public function __construct(Application $app)
    {
        parent::__construct($app);
        $this->name = 'language-switcher';
    }

    /**
     * Boot service
     *
     * @return void
     */
    protected function boot(): void
    {
        // Khởi tạo dữ liệu language
        $this->initLanguages();
    }

    /**
     * Khởi tạo language switcher
     *
     * @return void
     */
    public function init(): void
    {
        // Không cần làm gì thêm, đã được khởi tạo trong boot()
    }

    /**
     * Khởi tạo danh sách languages từ Polylang
     *
     * @return void
     */
    protected function initLanguages(): void
    {
        if (!function_exists('pll_the_languages')) {
            return;
        }

        // Lấy current language
        $this->currentLanguage = pll_current_language() ?: '';

        // Lấy danh sách languages
        $this->languages = pll_the_languages([
            'raw' => 1,
            'hide_if_empty' => 0,
            'show_flags' => 1,
            'show_names' => 1,
            'hide_current' => 0
        ]);

        if (WP_DEBUG) {
            error_log('Language Switcher: Languages initialized - ' . count($this->languages) . ' languages found');
        }
    }

    /**
     * Đăng ký Gutenberg block
     *
     * @return void
     */
    public function registerBlock(): void
    {
        if (!function_exists('register_block_type')) {
            return;
        }

        // Đăng ký block type
        register_block_type(
            get_template_directory() . '/resources/blocks/language-switcher',
            [
                'render_callback' => [$this, 'renderBlock'],
                'attributes' => [
                    'showFlags' => [
                        'type' => 'boolean',
                        'default' => true
                    ],
                    'showNames' => [
                        'type' => 'boolean',
                        'default' => true
                    ],
                    'showCurrent' => [
                        'type' => 'boolean',
                        'default' => true
                    ],
                    'displayType' => [
                        'type' => 'string',
                        'default' => 'dropdown'
                    ],
                    'className' => [
                        'type' => 'string'
                    ]
                ]
            ]
        );

        if (WP_DEBUG) {
            error_log('Language Switcher: Block registered successfully');
        }
    }

    /**
     * Render block
     *
     * @param array $attributes
     * @return string
     */
    public function renderBlock(array $attributes): string
    {
        if (empty($this->languages)) {
            return '<div class="language-switcher-block">Polylang plugin not active or no languages configured.</div>';
        }

        $showFlags = $attributes['showFlags'] ?? true;
        $showNames = $attributes['showNames'] ?? true;
        $showCurrent = $attributes['showCurrent'] ?? true;
        $displayType = $attributes['displayType'] ?? 'dropdown';
        $className = $attributes['className'] ?? '';

        $blockClass = 'language-switcher-block';
        if ($className) {
            $blockClass .= ' ' . $className;
        }

        $output = '<div class="' . esc_attr($blockClass) . '">';

        switch ($displayType) {
            case 'list':
                $output .= $this->renderList($showFlags, $showNames, $showCurrent);
                break;
            case 'dropdown':
            default:
                $output .= $this->renderDropdown($showFlags, $showNames, $showCurrent);
                break;
        }

        $output .= '</div>';

        return $output;
    }

    /**
     * Render dropdown style
     *
     * @param bool $showFlags
     * @param bool $showNames
     * @param bool $showCurrent
     * @return string
     */
    protected function renderDropdown(bool $showFlags, bool $showNames, bool $showCurrent): string
    {
        $output = '<select class="language-switcher-dropdown" onchange="window.location.href=this.value;">';

        foreach ($this->languages as $lang) {
            $selected = ($lang['current_lang'] && $showCurrent) ? ' selected' : '';
            $optionText = '';

            if ($showFlags && !empty($lang['flag'])) {
                $optionText .= '<img src="' . esc_url($lang['flag']) . '" alt="' . esc_attr($lang['name']) . '" class="language-flag" /> ';
            }

            if ($showNames) {
                $optionText .= esc_html($lang['name']);
            }

            $output .= '<option value="' . esc_url($lang['url']) . '"' . $selected . '>' . $optionText . '</option>';
        }

        $output .= '</select>';

        return $output;
    }

    /**
     * Render list style
     *
     * @param bool $showFlags
     * @param bool $showNames
     * @param bool $showCurrent
     * @return string
     */
    protected function renderList(bool $showFlags, bool $showNames, bool $showCurrent): string
    {
        $output = '<ul class="language-switcher-list">';

        foreach ($this->languages as $lang) {
            $itemClass = 'language-item';
            if ($lang['current_lang']) {
                $itemClass .= ' current-language';
                if (!$showCurrent) {
                    continue;
                }
            }

            $output .= '<li class="' . $itemClass . '">';
            $output .= '<a href="' . esc_url($lang['url']) . '" class="language-link">';

            if ($showFlags && !empty($lang['flag'])) {
                $output .= '<img src="' . esc_url($lang['flag']) . '" alt="' . esc_attr($lang['name']) . '" class="language-flag" />';
            }

            if ($showNames) {
                $output .= '<span class="language-name">' . esc_html($lang['name']) . '</span>';
            }

            $output .= '</a>';
            $output .= '</li>';
        }

        $output .= '</ul>';

        return $output;
    }

    /**
     * Đăng ký REST API routes
     *
     * @return void
     */
    public function registerRestRoutes(): void
    {
        add_action('rest_api_init', function () {
            register_rest_route('jankx/v1', '/languages', [
                'methods' => 'GET',
                'callback' => [$this, 'getLanguagesApi'],
                'permission_callback' => '__return_true'
            ]);
        });
    }

    /**
     * REST API endpoint để lấy danh sách languages
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function getLanguagesApi(\WP_REST_Request $request): \WP_REST_Response
    {
        $languages = [];

        if (!empty($this->languages)) {
            foreach ($this->languages as $lang) {
                $languages[] = [
                    'code' => $lang['slug'],
                    'name' => $lang['name'],
                    'url' => $lang['url'],
                    'flag' => $lang['flag'] ?? '',
                    'current' => $lang['current_lang'] ?? false
                ];
            }
        }

        return new \WP_REST_Response($languages, 200);
    }

    /**
     * Lấy danh sách languages
     *
     * @return array
     */
    public function getLanguages(): array
    {
        return $this->languages;
    }

    /**
     * Lấy current language
     *
     * @return string
     */
    public function getCurrentLanguage(): string
    {
        return $this->currentLanguage;
    }

    /**
     * Lấy tên service
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }
}

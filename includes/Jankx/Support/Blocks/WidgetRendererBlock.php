<?php

namespace Jankx\Support\Blocks;

/**
 * Widget Renderer Block
 *
 * This block allows users to render WordPress widgets within Gutenberg blocks.
 * It provides a dynamic interface for selecting and configuring widgets.
 *
 * @package Jankx\Support\Blocks
 * @since 1.0.0
 */
class WidgetRendererBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/widget-renderer', [
            'title' => __('Widget Renderer', 'jankx'),
            'category' => 'widgets',
            'icon' => 'admin-generic',
            'description' => __('Render WordPress widgets in Gutenberg blocks', 'jankx'),
            'keywords' => ['widget', 'sidebar', 'render'],
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full']
            ],
            'attributes' => [
                'widgetId' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'widgetType' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'title' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'showTitle' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'className' => [
                    'type' => 'string'
                ]
            ]
        ]);
    }

    /**
     * Register the block
     *
     * @return void
     */
    public function register()
    {
        $blockPath = get_template_directory() . '/resources/blocks/widget-renderer';
        $metadata = $this->getBlockMetadata($blockPath);

        // Enqueue assets
        $this->enqueueAssets($blockPath, $metadata);

        // Register block
        $this->registerBlock($blockPath, $metadata);

        // Register REST API endpoints
        add_action('rest_api_init', [$this, 'registerRestEndpoints']);
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        $widgetType = $attributes['widgetType'] ?? '';
        $widgetId = $attributes['widgetId'] ?? '';
        $title = $attributes['title'] ?? '';
        $showTitle = $attributes['showTitle'] ?? true;
        $className = $attributes['className'] ?? '';

        if (empty($widgetType)) {
            return $this->renderPlaceholder();
        }

        // Get widget instance
        $widget = $this->getWidgetInstance($widgetType, $widgetId);

        if (!$widget) {
            return $this->renderError(__('Widget not found', 'jankx'));
        }

        // Render widget
        ob_start();
        ?>
        <div class="widget-renderer-block <?php echo esc_attr($className); ?>">
            <?php if ($showTitle && !empty($title)): ?>
                <h3 class="widget-title"><?php echo esc_html($title); ?></h3>
            <?php endif; ?>

            <div class="widget-content">
                <?php $this->renderWidget($widget); ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Get widget instance
     *
     * @param string $widgetType Widget type
     * @param string $widgetId Widget ID
     * @return \WP_Widget|null
     */
    protected function getWidgetInstance($widgetType, $widgetId = '')
    {
        global $wp_widget_factory;

        // Get widget class
        $widgetClass = $wp_widget_factory->widgets[$widgetType] ?? null;

        if (!$widgetClass) {
            return null;
        }

        // If widget ID is provided, try to get specific instance
        if (!empty($widgetId)) {
            $widgetInstances = get_option('widget_' . $widgetType, []);
            if (isset($widgetInstances[$widgetId])) {
                $widget = new $widgetClass();
                $widget->id = $widgetId;
                $widget->number = $widgetId;
                return $widget;
            }
        }

        // Return new instance
        return new $widgetClass();
    }

    /**
     * Render widget content
     *
     * @param \WP_Widget $widget Widget instance
     * @return void
     */
    protected function renderWidget($widget)
    {
        // Start output buffering to capture widget output
        ob_start();

        // Render widget
        $widget->widget([
            'before_widget' => '<div class="widget ' . $widget->id_base . '">',
            'after_widget' => '</div>',
            'before_title' => '<h4 class="widget-title">',
            'after_title' => '</h4>'
        ], [
            'title' => '',
            'show_title' => false
        ]);

        $output = ob_get_clean();

        // Clean up widget output
        $output = $this->cleanWidgetOutput($output);

        echo $output;
    }

    /**
     * Clean widget output
     *
     * @param string $output Widget output
     * @return string Cleaned output
     */
    protected function cleanWidgetOutput($output)
    {
        // Remove empty widget containers
        $output = preg_replace('/<div class="widget [^"]*"><\/div>/', '', $output);

        // Remove empty titles
        $output = preg_replace('/<h4 class="widget-title"><\/h4>/', '', $output);

        return trim($output);
    }

    /**
     * Render placeholder
     *
     * @return string
     */
    protected function renderPlaceholder()
    {
        return '<div class="widget-renderer-placeholder"><p>' .
               __('Select a widget type from the block settings to display here.', 'jankx') .
               '</p></div>';
    }

    /**
     * Render error
     *
     * @param string $message Error message
     * @return string
     */
    protected function renderError($message)
    {
        return '<div class="widget-renderer-error"><p>' . esc_html($message) . '</p></div>';
    }

    /**
     * Register REST API endpoints
     *
     * @return void
     */
    public function registerRestEndpoints()
    {
        // Register available widgets endpoint
        register_rest_route('jankx/v1', '/widgets/available', [
            'methods' => 'GET',
            'callback' => [$this, 'getAvailableWidgets'],
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ]);

        // Register widget preview endpoint
        register_rest_route('jankx/v1', '/widgets/preview', [
            'methods' => 'POST',
            'callback' => [$this, 'getWidgetPreview'],
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ]);
    }

    /**
     * Get available widgets
     *
     * @return \WP_REST_Response
     */
    public function getAvailableWidgets()
    {
        global $wp_widget_factory;

        $widgets = [];

        foreach ($wp_widget_factory->widgets as $widgetId => $widgetClass) {
            $widgets[] = [
                'id' => $widgetId,
                'title' => $widgetClass,
                'description' => 'Widget description'
            ];
        }

        return rest_ensure_response($widgets);
    }

    /**
     * Get widget preview
     *
     * @param \WP_REST_Request $request Request object
     * @return \WP_REST_Response
     */
    public function getWidgetPreview($request)
    {
        $widgetType = $request->get_param('widget_type');
        $widgetId = $request->get_param('widget_id');
        $title = $request->get_param('title');
        $showTitle = $request->get_param('show_title');

        if (empty($widgetType)) {
            return rest_ensure_response([
                'html' => $this->renderPlaceholder()
            ]);
        }

        $widget = $this->getWidgetInstance($widgetType, $widgetId);

        if (!$widget) {
            return rest_ensure_response([
                'html' => $this->renderError(__('Widget not found', 'jankx'))
            ]);
        }

        // Render preview
        ob_start();
        ?>
        <div class="widget-renderer-block">
            <?php if ($showTitle && !empty($title)): ?>
                <h3 class="widget-title"><?php echo esc_html($title); ?></h3>
            <?php endif; ?>

            <div class="widget-content">
                <?php $this->renderWidget($widget); ?>
            </div>
        </div>
        <?php
        $html = ob_get_clean();

        return rest_ensure_response([
            'html' => $html
        ]);
    }
}
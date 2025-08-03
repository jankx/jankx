<?php

namespace Tests\Support\Blocks;

use PHPUnit\Framework\TestCase;
use Jankx\Support\Blocks\WidgetRendererBlock;
use WP_REST_Request;
use WP_REST_Response;

/**
 * WidgetRendererBlock Test
 *
 * @package Tests\Support\Blocks
 */
class WidgetRendererBlockTest extends TestCase
{
    protected $block;

    protected function setUp(): void
    {
        parent::setUp();
        $this->block = new WidgetRendererBlock();
    }

    /**
     * Test block name
     */
    public function testGetName()
    {
        $this->assertEquals('jankx/widget-renderer', $this->block->getName());
    }

    /**
     * Test block configuration
     */
    public function testGetConfig()
    {
        $config = $this->block->getConfig();

        $this->assertIsArray($config);
        $this->assertEquals('Widget Renderer', $config['title']);
        $this->assertEquals('widgets', $config['category']);
        $this->assertEquals('admin-generic', $config['icon']);
    }

    /**
     * Test block attributes
     */
    public function testGetAttributes()
    {
        $attributes = $this->block->getAttributes();

        $this->assertIsArray($attributes);
        $this->assertArrayHasKey('widgetId', $attributes);
        $this->assertArrayHasKey('widgetType', $attributes);
        $this->assertArrayHasKey('title', $attributes);
        $this->assertArrayHasKey('showTitle', $attributes);
        $this->assertArrayHasKey('className', $attributes);
    }

    /**
     * Test render with empty widget type
     */
    public function testRenderWithEmptyWidgetType()
    {
        $attributes = ['widgetType' => ''];
        $content = '';

        $result = $this->block->render($attributes, $content);

        $this->assertStringContainsString('widget-renderer-placeholder', $result);
        $this->assertStringContainsString('Select a widget type', $result);
    }

    /**
     * Test render with invalid widget type
     */
    public function testRenderWithInvalidWidgetType()
    {
        $attributes = ['widgetType' => 'invalid-widget'];
        $content = '';

        $result = $this->block->render($attributes, $content);

        $this->assertStringContainsString('widget-renderer-error', $result);
        $this->assertStringContainsString('Widget not found', $result);
    }

    /**
     * Test render with valid attributes
     */
    public function testRenderWithValidAttributes()
    {
        $attributes = [
            'widgetType' => 'text',
            'title' => 'Test Widget',
            'showTitle' => true,
            'className' => 'custom-class'
        ];
        $content = '';

        $result = $this->block->render($attributes, $content);

        $this->assertStringContainsString('widget-renderer-block', $result);
        $this->assertStringContainsString('custom-class', $result);
    }

    /**
     * Test render without title
     */
    public function testRenderWithoutTitle()
    {
        $attributes = [
            'widgetType' => 'text',
            'title' => '',
            'showTitle' => false
        ];
        $content = '';

        $result = $this->block->render($attributes, $content);

        $this->assertStringNotContainsString('widget-title', $result);
    }

    /**
     * Test get available widgets
     */
    public function testGetAvailableWidgets()
    {
        $response = $this->block->getAvailableWidgets();

        $this->assertInstanceOf(WP_REST_Response::class, $response);

        $data = $response->get_data();
        $this->assertIsArray($data);

        // Should have at least some default widgets
        $this->assertGreaterThan(0, count($data));
    }

    /**
     * Test get widget preview with empty widget type
     */
    public function testGetWidgetPreviewWithEmptyWidgetType()
    {
        $request = $this->createMock(WP_REST_Request::class);
        $request->method('get_param')
            ->willReturnMap([
                ['widget_type', ''],
                ['widget_id', ''],
                ['title', ''],
                ['show_title', true]
            ]);

        $response = $this->block->getWidgetPreview($request);

        $this->assertInstanceOf(WP_REST_Response::class, $response);

        $data = $response->get_data();
        $this->assertIsArray($data);
        $this->assertArrayHasKey('html', $data);
        $this->assertStringContainsString('widget-renderer-placeholder', $data['html']);
    }

    /**
     * Test get widget preview with invalid widget type
     */
    public function testGetWidgetPreviewWithInvalidWidgetType()
    {
        $request = $this->createMock(WP_REST_Request::class);
        $request->method('get_param')
            ->willReturnMap([
                ['widget_type', 'invalid-widget'],
                ['widget_id', ''],
                ['title', 'Test Title'],
                ['show_title', true]
            ]);

        $response = $this->block->getWidgetPreview($request);

        $this->assertInstanceOf(WP_REST_Response::class, $response);

        $data = $response->get_data();
        $this->assertIsArray($data);
        $this->assertArrayHasKey('html', $data);
        $this->assertStringContainsString('widget-renderer-error', $data['html']);
    }

    /**
     * Test get widget preview with valid widget type
     */
    public function testGetWidgetPreviewWithValidWidgetType()
    {
        $request = $this->createMock(WP_REST_Request::class);
        $request->method('get_param')
            ->willReturnMap([
                ['widget_type', 'text'],
                ['widget_id', ''],
                ['title', 'Test Title'],
                ['show_title', true]
            ]);

        $response = $this->block->getWidgetPreview($request);

        $this->assertInstanceOf(WP_REST_Response::class, $response);

        $data = $response->get_data();
        $this->assertIsArray($data);
        $this->assertArrayHasKey('html', $data);
        $this->assertStringContainsString('widget-renderer-block', $data['html']);
    }

        /**
     * Test block registration
     */
    public function testRegister()
    {
        // This test would require WordPress environment
        // For now, just test that the method exists and is callable
        $this->assertTrue(method_exists($this->block, 'register'));
        $this->assertTrue(is_callable([$this->block, 'register']));
    }

    /**
     * Test REST endpoints registration
     */
    public function testRegisterRestEndpoints()
    {
        // This test would require WordPress environment
        // For now, just test that the method exists and is callable
        $this->assertTrue(method_exists($this->block, 'registerRestEndpoints'));
        $this->assertTrue(is_callable([$this->block, 'registerRestEndpoints']));
    }
}

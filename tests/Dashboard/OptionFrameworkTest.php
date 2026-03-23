<?php

namespace Tests\Dashboard;

use PHPUnit\Framework\TestCase;
use Jankx\Dashboard\OptionFramework;
use Brain\Monkey;
use Brain\Monkey\Functions;
use Mockery;

class OptionFrameworkTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    public function testSaveOptionsWithPostData()
    {
        $instance_name = 'test_options';
        $framework = new OptionFramework($instance_name);

        // Mock dependencies
        Functions\expect('wp_create_nonce')->andReturn('mock_nonce');
        Functions\expect('wp_verify_nonce')->with('mock_nonce', 'save_options_nonce')->andReturn(true);
        Functions\expect('wp_unslash')->andReturnFirstArg();
        Functions\expect('sanitize_text_field')->andReturnFirstArg();
        
        // Mock update_option
        $options_data = ['field1' => 'value1'];
        $options_json = json_encode($options_data);
        Functions\expect('get_option')->with($instance_name)->andReturn(null);
        Functions\expect('update_option')->with($instance_name, $options_json)->andReturn(true);
        
        // Mock wp_send_json_success
        Functions\expect('wp_send_json_success')->once()->with('Lưu options thành công');

        // Prepare $_POST and $_REQUEST
        $_POST['data'] = $options_json;
        $_REQUEST['nonce'] = 'mock_nonce';

        $framework->saveOptions();
        $this->assertTrue(true); // Placeholder assertion to stop risky test warning
    }

    public function testSaveOptionsNoChanges()
    {
        $instance_name = 'test_options';
        $framework = new OptionFramework($instance_name);

        $options_data = ['field1' => 'value1'];
        $options_json = json_encode($options_data);

        Functions\expect('wp_verify_nonce')->andReturn(true);
        Functions\expect('wp_unslash')->andReturnFirstArg();
        Functions\expect('sanitize_text_field')->andReturnFirstArg();
        Functions\expect('get_option')->with($instance_name)->andReturn($options_json);
        
        // Mock wp_send_json_success
        Functions\expect('wp_send_json_success')->once()->with('Không có thay đổi nào để lưu');

        $_POST['data'] = $options_json;
        $_REQUEST['nonce'] = 'mock_nonce';

        $framework->saveOptions();
        $this->assertTrue(true); // Placeholder assertion
    }

    public function testSaveOptionsWithJsonInput()
    {
        $instance_name = 'test_options';
        $framework = new OptionFramework($instance_name);
        
        Functions\expect('wp_verify_nonce')->andReturn(true);
        Functions\expect('wp_unslash')->andReturnFirstArg();
        Functions\expect('sanitize_text_field')->andReturnFirstArg();
        
        $_POST = []; 
        $_REQUEST['nonce'] = 'mock_nonce';
        
        Functions\expect('wp_send_json_error')->once()->with('Không có dữ liệu được gửi');
        
        $framework->saveOptions();
        $this->assertTrue(true);
    }

    public function testMergeOptions()
    {
        $framework = new OptionFramework('test');
        
        $built_in = [
            'page1' => [
                'title' => 'Built-in Page',
                'sections' => [
                    'sec1' => [
                        'title' => 'Built-in Section',
                        'fields' => [
                            ['id' => 'field1', 'title' => 'Built-in Field']
                        ]
                    ]
                ]
            ]
        ];
        
        $user = [
            'page1' => [
                'title' => 'User Page',
                'sections' => [
                    'sec1' => [
                        'title' => 'User Section',
                        'fields' => [
                            ['id' => 'field1', 'title' => 'User Field'], // Override
                            ['id' => 'field2', 'title' => 'User Field 2'] // New
                        ]
                    ]
                ]
            ]
        ];

        // Access private method mergeOptions via reflection
        $reflection = new \ReflectionClass(get_class($framework));
        $method = $reflection->getMethod('mergeOptions');
        $method->setAccessible(true);
        
        $merged = $method->invokeArgs($framework, [$built_in, $user]);
        
        $this->assertEquals('User Page', $merged['page1']['title']);
        $this->assertCount(2, $merged['page1']['sections']['sec1']['fields']);
        
        $fields = $merged['page1']['sections']['sec1']['fields'];
        $field1 = array_filter($fields, function($f) { return $f['id'] === 'field1'; });
        $field1 = reset($field1);
        $this->assertEquals('User Field', $field1['title']);
    }

    public function testFetchOptions()
    {
        $instance_name = 'test_options';
        $framework = new OptionFramework($instance_name);
        
        $options_data = ['field1' => 'value1'];
        $options_json = json_encode($options_data);

        // Case 1: Option is a JSON string (as saved by our saveOptions)
        Functions\expect('get_option')->with($instance_name)->andReturn($options_json);
        Functions\expect('wp_send_json_success')->once()->with($options_data);
        
        $framework->fetchOptions();
        $this->assertTrue(true);
    }
}

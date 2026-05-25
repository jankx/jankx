<?php

namespace Tests\Adapter\Options;

use PHPUnit\Framework\TestCase;
use Jankx\Adapter\Options\Frameworks\JankxOptionFramework;
use Jankx\Adapter\Options\OptionsReader;
use Jankx\Dashboard\OptionFramework;
use Brain\Monkey;
use Brain\Monkey\Functions;
use Mockery;

class JankxOptionFrameworkTest extends TestCase
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

    public function testRegisterAdminMenu()
    {
        $adapter = new JankxOptionFramework();
        
        // Mock WordPress functions
        Functions\expect('wp_parse_args')->andReturnFirstArg();
        Functions\expect('add_action')->atLeast()->once();
        Functions\expect('wp_create_nonce')->andReturn('mock_nonce');
        Functions\expect('esc_js')->andReturnFirstArg();
        Functions\expect('admin_url')->andReturn('http://example.com/wp-admin/admin-ajax.php');

        $adapter->register_admin_menu('Theme Options', 'Jankx Theme Options');

        $framework = $adapter->getFramework();
        $this->assertInstanceOf(OptionFramework::class, $framework);
        $this->assertEquals('jankx_options', $framework->getInstanceName());
        $this->assertEquals('Jankx Theme Options', $framework->getPageTitle());
        $this->assertTrue(true);
    }

    public function testCreateSections()
    {
        $adapter = new JankxOptionFramework();
        
        // Mock OptionsReader
        $optionsReader = Mockery::mock(OptionsReader::class);
        
        $mockPage = Mockery::mock();
        $mockPage->shouldReceive('getTitle')->andReturn('General');
        $mockPage->shouldReceive('getIcon')->andReturn('dashicons-admin-generic');
        
        $mockSection = Mockery::mock();
        $mockSection->shouldReceive('getTitle')->andReturn('Header');
        $mockSection->shouldReceive('getId')->andReturn('header');
        
        $mockField = Mockery::mock();
        $mockField->shouldReceive('getId')->andReturn('logo');
        $mockField->shouldReceive('getTitle')->andReturn('Logo');
        $mockField->shouldReceive('getType')->andReturn('media');
        $mockField->shouldReceive('getArgs')->andReturn([]);

        $mockPage->shouldReceive('getSections')->andReturn([$mockSection]);
        $mockSection->shouldReceive('getFields')->andReturn([$mockField]);

        $optionsReader->shouldReceive('getPages')->andReturn([$mockPage]);
        $optionsReader->shouldReceive('getSections')->with('General')->andReturn([$mockSection]);
        $optionsReader->shouldReceive('getFields')->with('Header')->andReturn([$mockField]);

        // Mock more functions
        Functions\expect('wp_parse_args')->andReturnFirstArg();
        Functions\expect('add_action')->atLeast()->once();
        Functions\expect('wp_create_nonce')->andReturn('mock_nonce');
        Functions\expect('sanitize_title')->andReturnFirstArg();

        $adapter->createSections($optionsReader);
        
        $framework = $adapter->getFramework();
        $this->assertNotEmpty($framework->pages);
        $this->assertTrue(true);
    }
}

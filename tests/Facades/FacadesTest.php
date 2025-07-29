<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Config;
use Jankx\Facades\Debug;
use Jankx\Facades\Logger;
use Jankx\Facades\Template;
use Jankx\Facades\Theme;
use Jankx\Facades\Asset;
use Jankx\Facades\Block;
use Jankx\Facades\Layout;

/**
 * Facades Test
 *
 * @package Tests\Facades
 * @since 2.0.0
 */
class FacadesTest extends TestCase
{
    /**
     * Test that all facades exist
     */
    public function testAllFacadesExist(): void
    {
        $facades = [
            Config::class,
            Debug::class,
            Logger::class,
            Template::class,
            Theme::class,
            Asset::class,
            Block::class,
            Layout::class,
        ];

        foreach ($facades as $facade) {
            $this->assertTrue(class_exists($facade), "Facade {$facade} does not exist");
        }
    }

    /**
     * Test that facades extend base facade
     */
    public function testFacadesExtendBaseFacade(): void
    {
        $facades = [
            Config::class,
            Debug::class,
            Logger::class,
            Template::class,
            Theme::class,
            Asset::class,
            Block::class,
            Layout::class,
        ];

        foreach ($facades as $facade) {
            $reflection = new \ReflectionClass($facade);
            $this->assertTrue($reflection->isSubclassOf(\Jankx\Facades\Facade::class), "Facade {$facade} does not extend base Facade");
        }
    }

    /**
     * Test that facades have getFacadeAccessor method
     */
    public function testFacadesHaveAccessorMethod(): void
    {
        $facades = [
            Config::class,
            Debug::class,
            Logger::class,
            Template::class,
            Theme::class,
            Asset::class,
            Block::class,
            Layout::class,
        ];

        foreach ($facades as $facade) {
            $reflection = new \ReflectionClass($facade);
            $this->assertTrue($reflection->hasMethod('getFacadeAccessor'), "Facade {$facade} does not have getFacadeAccessor method");
        }
    }

    /**
     * Test Config facade
     */
    public function testConfigFacade(): void
    {
        $this->assertTrue(class_exists(Config::class));
        $this->assertTrue(method_exists(Config::class, 'get'));
        $this->assertTrue(method_exists(Config::class, 'set'));
        $this->assertTrue(method_exists(Config::class, 'has'));
    }

    /**
     * Test Debug facade
     */
    public function testDebugFacade(): void
    {
        $this->assertTrue(class_exists(Debug::class));
        $this->assertTrue(method_exists(Debug::class, 'info'));
        $this->assertTrue(method_exists(Debug::class, 'warning'));
        $this->assertTrue(method_exists(Debug::class, 'error'));
    }

    /**
     * Test Logger facade
     */
    public function testLoggerFacade(): void
    {
        $this->assertTrue(class_exists(Logger::class));
        $this->assertTrue(method_exists(Logger::class, 'info'));
        $this->assertTrue(method_exists(Logger::class, 'warning'));
        $this->assertTrue(method_exists(Logger::class, 'error'));
    }

    /**
     * Test Template facade
     */
    public function testTemplateFacade(): void
    {
        $this->assertTrue(class_exists(Template::class));
        $this->assertTrue(method_exists(Template::class, 'render'));
        $this->assertTrue(method_exists(Template::class, 'exists'));
    }

    /**
     * Test Theme facade
     */
    public function testThemeFacade(): void
    {
        $this->assertTrue(class_exists(Theme::class));
        $this->assertTrue(method_exists(Theme::class, 'get'));
        $this->assertTrue(method_exists(Theme::class, 'set'));
    }

    /**
     * Test Asset facade
     */
    public function testAssetFacade(): void
    {
        $this->assertTrue(class_exists(Asset::class));
        $this->assertTrue(method_exists(Asset::class, 'enqueue'));
        $this->assertTrue(method_exists(Asset::class, 'dequeue'));
    }

    /**
     * Test Block facade
     */
    public function testBlockFacade(): void
    {
        $this->assertTrue(class_exists(Block::class));
        $this->assertTrue(method_exists(Block::class, 'register'));
        $this->assertTrue(method_exists(Block::class, 'render'));
    }

    /**
     * Test Layout facade
     */
    public function testLayoutFacade(): void
    {
        $this->assertTrue(class_exists(Layout::class));
        $this->assertTrue(method_exists(Layout::class, 'get'));
        $this->assertTrue(method_exists(Layout::class, 'set'));
    }
}
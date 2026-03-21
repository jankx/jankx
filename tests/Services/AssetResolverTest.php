<?php

namespace Tests\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AssetResolver;
use PHPUnit\Framework\TestCase;

class AssetResolverTest extends TestCase
{
    private $app;
    private $resolver;

    protected function setUp(): void
    {
        $this->app = $this->createMock(Application::class);
        $this->app->method('version')->willReturn('2.0.0');
        
        // AssetResolver calls add_action in constructor (via init)
        $this->resolver = new AssetResolver($this->app);
    }

    public function testAddInlineCssDeduplication()
    {
        $css = "body { color: red; }";
        
        $this->resolver->addInlineCss($css, AssetResolver::INSTANCE);
        $this->resolver->addInlineCss($css, AssetResolver::INSTANCE); // Duplicate content
        
        $reflection = new \ReflectionClass($this->resolver);
        $property = $reflection->getProperty('inlineCss');
        $property->setAccessible(true);
        $inlineCss = $property->getValue($this->resolver);
        
        // Check that only 1 entry exists for INSTANCE level despite 2 calls
        $this->assertCount(1, $inlineCss[AssetResolver::INSTANCE], "identical CSS should be deduplicated via hashing");
    }

    public function testAddInlineCssCategorization()
    {
        $coreCss = ".container { width: 100%; }";
        $instanceCss = "#block-123 { background: blue; }";
        
        $this->resolver->addInlineCss($coreCss, AssetResolver::CORE_LAYOUT);
        $this->resolver->addInlineCss($instanceCss, AssetResolver::INSTANCE);
        
        $reflection = new \ReflectionClass($this->resolver);
        $property = $reflection->getProperty('inlineCss');
        $property->setAccessible(true);
        $inlineCss = $property->getValue($this->resolver);
        
        $this->assertCount(1, $inlineCss[AssetResolver::CORE_LAYOUT]);
        $this->assertCount(1, $inlineCss[AssetResolver::INSTANCE]);
        $this->assertContains($coreCss, $inlineCss[AssetResolver::CORE_LAYOUT]);
        $this->assertContains($instanceCss, $inlineCss[AssetResolver::INSTANCE]);
    }

    public function testPrintInlineCssOrdering()
    {
        $coreCss = "/* Core Content */";
        $typeCss = "/* Type Content */";
        $instanceCss = "/* Instance Content */";
        
        // Add in random order
        $this->resolver->addInlineCss($instanceCss, AssetResolver::INSTANCE);
        $this->resolver->addInlineCss($coreCss, AssetResolver::CORE_LAYOUT);
        $this->resolver->addInlineCss($typeCss, AssetResolver::LAYOUT_TYPE);
        
        ob_start();
        $this->resolver->printInlineCss();
        $output = ob_get_clean();
        
        // Check ordering in output string
        $corePos = strpos($output, $coreCss);
        $typePos = strpos($output, $typeCss);
        $instPos = strpos($output, $instanceCss);
        
        $this->assertNotFalse($corePos, "Core CSS should be present");
        $this->assertNotFalse($typePos, "Type CSS should be present");
        $this->assertNotFalse($instPos, "Instance CSS should be present");
        
        $this->assertTrue($corePos < $typePos, "CORE_LAYOUT should be printed before LAYOUT_TYPE");
        $this->assertTrue($typePos < $instPos, "LAYOUT_TYPE should be printed before INSTANCE");
    }

    public function testLegacyIdSupport()
    {
        $css = ".legacy { display: none; }";
        $this->resolver->addInlineCss($css, 'my-custom-id'); // Legacy call
        
        $reflection = new \ReflectionClass($this->resolver);
        $property = $reflection->getProperty('inlineCss');
        $property->setAccessible(true);
        $inlineCss = $property->getValue($this->resolver);
        
        // Should fallback to INSTANCE level
        $this->assertCount(1, $inlineCss[AssetResolver::INSTANCE]);
        $this->assertContains($css, $inlineCss[AssetResolver::INSTANCE]);
    }
}

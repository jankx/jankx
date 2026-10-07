<?php

namespace Tests\Cache;

use Jankx\Cache\Engine\FilesystemEngine;
use Tests\Helpers\TestCase;

class FilesystemEngineTest extends TestCase
{
    /**
     * @var string
     */
    private $directory;

    /**
     * @var FilesystemEngine
     */
    private $engine;

    protected function setUp(): void
    {
        parent::setUp();

        $this->directory = sys_get_temp_dir() . '/jankx-cache-test-' . uniqid('', true);
        $this->engine = new FilesystemEngine('jankx', 'cache', $this->directory);
    }

    protected function tearDown(): void
    {
        $this->removeDirectory($this->directory);
        parent::tearDown();
    }

    public function testReportsItselfAsPersistent()
    {
        $this->assertTrue($this->engine->isPersistent());
        $this->assertSame('file', $this->engine->getName());
    }

    public function testSetAndGetRoundTrip()
    {
        $found = false;
        $this->assertTrue($this->engine->set('key', ['a' => 1], 60, 'group'));
        $value = $this->engine->get('key', 'group', $found);

        $this->assertTrue($found);
        $this->assertSame(['a' => 1], $value);
    }

    public function testMissReportsFoundFalse()
    {
        $found = true;
        $value = $this->engine->get('missing', 'group', $found);

        $this->assertFalse($found);
        $this->assertNull($value);
        $this->assertFalse($this->engine->has('missing', 'group'));
    }

    public function testValuesAreIsolatedPerGroup()
    {
        $this->engine->set('key', 'in-a', 0, 'a');
        $this->engine->set('key', 'in-b', 0, 'b');

        $this->assertSame('in-a', $this->engine->get('key', 'a'));
        $this->assertSame('in-b', $this->engine->get('key', 'b'));
    }

    public function testDeleteRemovesSingleValue()
    {
        $this->engine->set('key', 'value', 0, 'group');
        $this->assertTrue($this->engine->delete('key', 'group'));
        $this->assertFalse($this->engine->has('key', 'group'));
    }

    public function testFlushRemovesWholeGroupOnly()
    {
        $this->engine->set('one', '1', 0, 'group');
        $this->engine->set('two', '2', 0, 'group');
        $this->engine->set('other', '3', 0, 'another-group');

        $this->engine->flush('group');

        $this->assertFalse($this->engine->has('one', 'group'));
        $this->assertFalse($this->engine->has('two', 'group'));
        $this->assertTrue($this->engine->has('other', 'another-group'));
    }

    public function testFlushWithoutGroupRemovesEveryGroup()
    {
        $this->engine->set('one', '1', 0, 'group');
        $this->engine->set('two', '2', 0, 'other-group');

        $this->assertTrue($this->engine->flush());

        $this->assertFalse($this->engine->has('one', 'group'));
        $this->assertFalse($this->engine->has('two', 'other-group'));
    }

    public function testValueExpiresAfterTtl()
    {
        $this->engine->set('short', 'value', 1, 'group');
        $this->assertTrue($this->engine->has('short', 'group'));

        sleep(1);

        $this->assertFalse($this->engine->has('short', 'group'));
    }

    public function testLongKeysAreStoredWithoutColliding()
    {
        $long = str_repeat('k', 300);

        $this->engine->set($long, 'long-value', 0, 'group');
        $this->engine->set($long . 'x', 'other-value', 0, 'group');

        $this->assertSame('long-value', $this->engine->get($long, 'group'));
        $this->assertSame('other-value', $this->engine->get($long . 'x', 'group'));
    }

    /**
     * @param string $directory Directory to remove.
     * @return void
     */
    private function removeDirectory(string $directory): void
    {
        if (!is_dir($directory)) {
            return;
        }

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($iterator as $item) {
            $item->isDir() ? @rmdir($item->getPathname()) : @unlink($item->getPathname());
        }

        @rmdir($directory);
    }
}

<?php

/**
 * Base TestCase for Jankx Framework Tests
 *
 * Provides common functionality and assertions for testing Jankx components.
 */

namespace Tests\Helpers;

use PHPUnit\Framework\TestCase as BaseTestCase;
use Mockery;

abstract class TestCase extends BaseTestCase
{
    /**
     * Set up the test environment
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Ensure ContentLayoutServiceProvider is registered with the global Application
        // This is needed for tests that use BlockTemplateLayoutManager via the container
        $this->ensureContentLayoutProviderRegistered();

        // Set up common mocks
        $this->setUpCommonMocks();
    }

    /**
     * Ensure ContentLayoutServiceProvider is registered with the global Application
     */
    protected function ensureContentLayoutProviderRegistered(): void
    {
        if (class_exists(\Jankx\Foundation\Application::class)
            && class_exists(\Jankx\Support\Providers\ContentLayoutServiceProvider::class)
        ) {
            $app = \Jankx\Foundation\Application::getInstance();
            if ($app && !$app->isRegistered(\Jankx\Support\Providers\ContentLayoutServiceProvider::class)) {
                $app->register(\Jankx\Support\Providers\ContentLayoutServiceProvider::class);
            }
        }
    }

    /**
     * Tear down the test environment
     */
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * Set up common mocks for WordPress functions
     */
    protected function setUpCommonMocks()
    {
    }

    /**
     * Assert that a class has a specific method
     */
    protected function assertHasMethod($classOrObject, $method)
    {
        $className = is_object($classOrObject) ? get_class($classOrObject) : $classOrObject;
        $this->assertTrue(
            method_exists($classOrObject, $method),
            "Class {$className} should have method {$method}"
        );
    }

    /**
     * Assert that a class has a specific property
     */
    protected function assertHasProperty($class, $property)
    {
        $reflection = new \ReflectionClass($class);
        $this->assertTrue(
            $reflection->hasProperty($property),
            "Class {$class} should have property {$property}"
        );
    }

    /**
     * Assert that a method accepts specific parameters
     */
    protected function assertMethodAcceptsParameters($class, $method, $expectedParameters)
    {
        $reflection = new \ReflectionMethod($class, $method);
        $parameters = $reflection->getParameters();

        $this->assertCount(
            count($expectedParameters),
            $parameters,
            "Method {$method} should accept " . count($expectedParameters) . " parameters"
        );

        foreach ($expectedParameters as $index => $expectedParam) {
            if (isset($parameters[$index])) {
                $param = $parameters[$index];
                $this->assertEquals(
                    $expectedParam['name'],
                    $param->getName(),
                    "Parameter " . ($index + 1) . " should be named '{$expectedParam['name']}'"
                );

                if (isset($expectedParam['type'])) {
                    $this->assertEquals(
                        $expectedParam['type'],
                        $param->getType()->getName(),
                        "Parameter '{$expectedParam['name']}' should be of type '{$expectedParam['type']}'"
                    );
                }
            }
        }
    }

    /**
     * Assert that a class extends a specific parent class
     */
    protected function assertExtends($class, $parentClass)
    {
        $reflection = new \ReflectionClass($class);
        $this->assertTrue(
            $reflection->isSubclassOf($parentClass),
            "Class {$class} should extend {$parentClass}"
        );
    }

    /**
     * Assert that a class implements a specific interface
     */
    protected function assertImplements($class, $interface)
    {
        $reflection = new \ReflectionClass($class);
        $this->assertTrue(
            $reflection->implementsInterface($interface),
            "Class {$class} should implement {$interface}"
        );
    }

    /**
     * Assert that a method is public
     */
    protected function assertMethodIsPublic($class, $method)
    {
        $reflection = new \ReflectionMethod($class, $method);
        $this->assertTrue(
            $reflection->isPublic(),
            "Method {$method} should be public"
        );
    }

    /**
     * Assert that a method is protected
     */
    protected function assertMethodIsProtected($class, $method)
    {
        $reflection = new \ReflectionMethod($class, $method);
        $this->assertTrue(
            $reflection->isProtected(),
            "Method {$method} should be protected"
        );
    }

    /**
     * Assert that a method is private
     */
    protected function assertMethodIsPrivate($class, $method)
    {
        $reflection = new \ReflectionMethod($class, $method);
        $this->assertTrue(
            $reflection->isPrivate(),
            "Method {$method} should be private"
        );
    }

    /**
     * Assert that a property is public
     */
    protected function assertPropertyIsPublic($class, $property)
    {
        $reflection = new \ReflectionClass($class);
        $propertyReflection = $reflection->getProperty($property);
        $this->assertTrue(
            $propertyReflection->isPublic(),
            "Property {$property} should be public"
        );
    }

    /**
     * Assert that a property is protected
     */
    protected function assertPropertyIsProtected($class, $property)
    {
        $reflection = new \ReflectionClass($class);
        $propertyReflection = $reflection->getProperty($property);
        $this->assertTrue(
            $propertyReflection->isProtected(),
            "Property {$property} should be protected"
        );
    }

    /**
     * Assert that a property is private
     */
    protected function assertPropertyIsPrivate($class, $property)
    {
        $reflection = new \ReflectionClass($class);
        $propertyReflection = $reflection->getProperty($property);
        $this->assertTrue(
            $propertyReflection->isPrivate(),
            "Property {$property} should be private"
        );
    }

    /**
     * Get a protected property value
     */
    protected function getProtectedProperty($object, $property)
    {
        $reflection = new \ReflectionClass($object);
        $propertyReflection = $reflection->getProperty($property);
        $propertyReflection->setAccessible(true);
        return $propertyReflection->getValue($object);
    }

    /**
     * Set a protected property value
     */
    protected function setProtectedProperty($object, $property, $value)
    {
        $reflection = new \ReflectionClass($object);
        $propertyReflection = $reflection->getProperty($property);
        $propertyReflection->setAccessible(true);
        $propertyReflection->setValue($object, $value);
    }

    /**
     * Call a protected method
     */
    protected function callProtectedMethod($object, $method, ...$args)
    {
        $reflection = new \ReflectionClass($object);
        $methodReflection = $reflection->getMethod($method);
        $methodReflection->setAccessible(true);
        return $methodReflection->invoke($object, ...$args);
    }

    /**
     * Assert that an exception is thrown
     */
    protected function assertThrowsException($callback, $expectedException = \Exception::class, $expectedMessage = null)
    {
        try {
            $callback();
            $this->fail("Expected exception of type {$expectedException} was not thrown");
        } catch (\Exception $e) {
            $this->assertInstanceOf($expectedException, $e);
            if ($expectedMessage !== null) {
                $this->assertStringContainsString($expectedMessage, $e->getMessage());
            }
        }
    }

    /**
     * Assert that a string contains HTML
     */
    protected function assertContainsHtml($needle, $haystack, $message = '')
    {
        $this->assertStringContainsString($needle, $haystack, $message);
    }

    /**
     * Assert that a string contains a specific CSS class
     */
    protected function assertContainsCssClass($class, $html, $message = '')
    {
        $this->assertStringContainsString("class=\"{$class}\"", $html, $message);
    }

    /**
     * Assert that a string contains a specific data attribute
     */
    protected function assertContainsDataAttribute($attribute, $value, $html, $message = '')
    {
        $this->assertStringContainsString("data-{$attribute}=\"{$value}\"", $html, $message);
    }

    /**
     * Create a mock WordPress post
     */
    protected function createMockPost($args = [])
    {
        $defaults = [
            'ID' => 1,
            'post_title' => 'Test Post',
            'post_content' => 'Test content',
            'post_excerpt' => 'Test excerpt',
            'post_status' => 'publish',
            'post_type' => 'post',
            'post_date' => '2024-01-01 00:00:00',
            'post_modified' => '2024-01-01 00:00:00',
            'post_author' => 1,
            'comment_count' => 0,
            'comment_status' => 'open',
            'ping_status' => 'open',
            'post_name' => 'test-post',
            'post_parent' => 0,
            'menu_order' => 0,
            'guid' => 'http://example.com/?p=1',
        ];

        return (object) array_merge($defaults, $args);
    }

    /**
     * Create a mock WordPress user
     */
    protected function createMockUser($args = [])
    {
        $defaults = [
            'ID' => 1,
            'user_login' => 'admin',
            'user_pass' => 'hashed_password',
            'user_nicename' => 'admin',
            'user_email' => 'admin@example.com',
            'user_url' => 'http://example.com',
            'user_registered' => '2024-01-01 00:00:00',
            'user_activation_key' => '',
            'user_status' => 0,
            'display_name' => 'Administrator',
            'roles' => ['administrator'],
            'capabilities' => ['administrator' => true],
        ];

        return (object) array_merge($defaults, $args);
    }

    /**
     * Create a mock WordPress term
     */
    protected function createMockTerm($args = [])
    {
        $defaults = [
            'term_id' => 1,
            'name' => 'Test Term',
            'slug' => 'test-term',
            'term_group' => 0,
            'term_taxonomy_id' => 1,
            'taxonomy' => 'category',
            'description' => 'Test term description',
            'parent' => 0,
            'count' => 0,
        ];

        return (object) array_merge($defaults, $args);
    }

    /**
     * Assert that a file exists
     */
    protected function assertFileExistsCustom(string $filename, string $message = ''): void
    {
        $this->assertTrue(file_exists($filename), $message ?: "File {$filename} should exist");
    }

    /**
     * Assert that a directory exists
     */
    protected function assertDirectoryExistsCustom(string $directory, string $message = ''): void
    {
        $this->assertTrue(is_dir($directory), $message ?: "Directory {$directory} should exist");
    }

    /**
     * Assert that a file is readable
     */
    protected function assertFileIsReadableCustom(string $file, string $message = ''): void
    {
        $this->assertTrue(is_readable($file), $message ?: "File {$file} should be readable");
    }

    /**
     * Assert that a file is writable
     */
    protected function assertFileIsWritableCustom(string $file, string $message = ''): void
    {
        $this->assertTrue(is_writable($file), $message ?: "File {$file} should be writable");
    }

    /**
     * Create a temporary file for testing
     */
    protected function createTempFile($content = '', $extension = 'php')
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'test_') . '.' . $extension;
        if ($content !== '') {
            file_put_contents($tempFile, $content);
        }
        return $tempFile;
    }

    /**
     * Clean up temporary files
     */
    protected function cleanupTempFiles()
    {
        $tempDir = sys_get_temp_dir();
        $files = glob($tempDir . '/test_*');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
    }
}

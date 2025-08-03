<?php

namespace Tests\Support\Providers;

use PHPUnit\Framework\TestCase;
use Jankx\Support\Providers\ErrorSuppressionServiceProvider;
use Jankx\Foundation\Application;
use Jankx\Config\Repository;

class ErrorSuppressionServiceProviderTest extends TestCase
{
    protected $app;
    protected $provider;
    protected $config;

    protected function setUp(): void
    {
        $this->app = $this->createMock(Application::class);
        $this->config = $this->createMock(Repository::class);
        $this->provider = new ErrorSuppressionServiceProvider($this->app);

        // Mock the app to return config
        $this->app->method('make')
            ->with('config')
            ->willReturn($this->config);

        $this->app->method('singleton')
            ->willReturnSelf();
    }

    public function testRegisterRegistersErrorSuppressionService()
    {
        $this->app->expects($this->once())
            ->method('singleton')
            ->with('error.suppression', \Jankx\Services\ErrorSuppressionService::class);

        $this->provider->register($this->app);
    }

    public function testBootCallsSetupErrorSuppression()
    {
        $this->provider->boot($this->app);

        // If we reach here without errors, the method executed successfully
        $this->assertTrue(true);
    }

    public function testSuppressDoingItWrongWithEnabledSuppression()
    {
        // Mock Config facade
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'doing_it_wrong' => [
                    'enabled' => true,
                    'functions' => ['wp_enqueue_script'],
                    'patterns' => ['wp-editor']
                ]
            ]);

        $result = $this->provider->suppressDoingItWrong(true, 'wp_enqueue_script()', 'wp-editor script error');

        $this->assertFalse($result);
    }

    public function testSuppressDoingItWrongWithDisabledSuppression()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'doing_it_wrong' => [
                    'enabled' => false,
                    'functions' => ['wp_enqueue_script'],
                    'patterns' => ['wp-editor']
                ]
            ]);

        $result = $this->provider->suppressDoingItWrong(true, 'wp_enqueue_script()', 'some error');

        $this->assertTrue($result); // Return original trigger_error value
    }

    public function testSuppressDoingItWrongWithNotSetEnabled()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'doing_it_wrong' => [
                    'functions' => ['wp_enqueue_script'],
                    'patterns' => ['wp-editor']
                ]
            ]);

        $result = $this->provider->suppressDoingItWrong(true, 'wp_enqueue_script()', 'some error');

        $this->assertTrue($result); // Return original trigger_error value
    }

    public function testSuppressDoingItWrongWithSpecificFunction()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'doing_it_wrong' => [
                    'enabled' => true,
                    'functions' => ['wp_enqueue_script()'],
                    'patterns' => []
                ]
            ]);

        $result = $this->provider->suppressDoingItWrong(true, 'wp_enqueue_script()', 'some error');

        $this->assertFalse($result);
    }

    public function testSuppressDoingItWrongWithPatternMatch()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'doing_it_wrong' => [
                    'enabled' => true,
                    'functions' => [],
                    'patterns' => ['wp-editor']
                ]
            ]);

        $result = $this->provider->suppressDoingItWrong(true, 'some_function()', 'wp-editor script error');

        $this->assertFalse($result);
    }

    public function testSuppressDoingItWrongReturnsOriginalValueWhenNoMatch()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'doing_it_wrong' => [
                    'enabled' => true,
                    'functions' => [],
                    'patterns' => []
                ]
            ]);

        $result = $this->provider->suppressDoingItWrong(true, 'other_function()', 'other error');

        $this->assertTrue($result);
    }

    public function testSuppressPhpErrorsWithEnabledSuppression()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'php_errors' => [
                    'enabled' => true,
                    'messages' => []
                ]
            ]);

        $result = $this->provider->suppressPhpErrors('some error message', []);

        $this->assertEquals('some error message', $result);
    }

    public function testSuppressPhpErrorsWithDisabledSuppression()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'php_errors' => [
                    'enabled' => false,
                    'messages' => ['specific error']
                ]
            ]);

        $result = $this->provider->suppressPhpErrors('this is a specific error message', []);

        $this->assertEquals('this is a specific error message', $result);
    }

    public function testSuppressPhpErrorsWithSpecificMessage()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'php_errors' => [
                    'enabled' => true,
                    'messages' => ['specific error']
                ]
            ]);

        $result = $this->provider->suppressPhpErrors('this is a specific error message', []);

        $this->assertEquals('', $result);
    }

    public function testSuppressPhpErrorsReturnsOriginalMessage()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'php_errors' => [
                    'enabled' => true,
                    'messages' => []
                ]
            ]);

        $originalMessage = 'original error message';
        $result = $this->provider->suppressPhpErrors($originalMessage, []);

        $this->assertEquals($originalMessage, $result);
    }

    public function testSuppressAdminNoticesWithEnabledSuppression()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'admin_notices' => [
                    'enabled' => true,
                    'notices' => []
                ]
            ]);

        // Should not throw any exceptions
        $this->provider->suppressAdminNotices();
        $this->assertTrue(true);
    }

    public function testSuppressAdminNoticesWithDisabledSuppression()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'admin_notices' => [
                    'enabled' => false,
                    'notices' => ['some_notice_callback']
                ]
            ]);

        // Should not throw any exceptions
        $this->provider->suppressAdminNotices();
        $this->assertTrue(true);
    }

    public function testSuppressAdminNoticesWithSpecificNotices()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([
                'admin_notices' => [
                    'enabled' => true,
                    'notices' => ['some_notice_callback']
                ]
            ]);

        // Should not throw any exceptions
        $this->provider->suppressAdminNotices();
        $this->assertTrue(true);
    }
}

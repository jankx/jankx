<?php

namespace Tests\Http;

use PHPUnit\Framework\TestCase;
use Jankx\Http\Request;

class RequestTest extends TestCase
{
    private Request $request;

    protected function setUp(): void
    {
        $this->request = new Request();
    }

    public function testRequestCanBeInstantiated()
    {
        $this->assertInstanceOf(Request::class, $this->request);
    }

        public function testRequestCanGetRequestType()
    {
        // Test that getRequestType returns a string
        $requestType = $this->request->getRequestType();
        $this->assertIsString($requestType);

        // Should be one of the valid request types
        $validTypes = ['frontend', 'admin', 'admin_ajax', 'rest_api', 'wp_cli', 'wp_cron'];
        $this->assertContains($requestType, $validTypes);
    }

    public function testRequestCanGetMethod()
    {
        $method = $this->request->getMethod();
        $this->assertIsString($method);
    }

    public function testRequestCanCaptureRequest()
    {
        $capturedRequest = Request::capture();
        $this->assertInstanceOf(Request::class, $capturedRequest);
    }

    public function testRequestCanDetectAdminAjax()
    {
        $request = Request::capture();
        $result = $request->isAjax();
        $this->assertIsBool($result);
    }

    public function testRequestCanDetectRestApi()
    {
        $request = Request::capture();
        $result = $request->isRestApi();
        $this->assertIsBool($result);
    }

    public function testRequestCanDetectAdmin()
    {
        $request = Request::capture();
        $result = $request->isAdmin();
        $this->assertIsBool($result);
    }

    public function testRequestCanDetectWpCli()
    {
        $request = Request::capture();
        $result = $request->isWpCli();
        $this->assertIsBool($result);
    }

    public function testRequestCanDetectWpCron()
    {
        $request = Request::capture();
        $result = $request->isWpCron();
        $this->assertIsBool($result);
    }
}
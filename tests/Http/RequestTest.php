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
        $validTypes = ['frontend', 'admin_ajax', 'rest_api', 'dashboard'];
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
        $reflection = new \ReflectionClass($request);
        $method = $reflection->getMethod('isAdminAjax');
        $method->setAccessible(true);

        $result = $method->invoke($request, $request);
        $this->assertIsBool($result);
    }

    public function testRequestCanDetectRestApi()
    {
        $request = Request::capture();
        $reflection = new \ReflectionClass($request);
        $method = $reflection->getMethod('isRestApi');
        $method->setAccessible(true);

        $result = $method->invoke($request, $request);
        $this->assertIsBool($result);
    }

    public function testRequestCanDetectAdminDashboard()
    {
        $request = Request::capture();
        $reflection = new \ReflectionClass($request);
        $method = $reflection->getMethod('isAdminDashboard');
        $method->setAccessible(true);

        $result = $method->invoke($request, $request);
        $this->assertIsBool($result);
    }
}
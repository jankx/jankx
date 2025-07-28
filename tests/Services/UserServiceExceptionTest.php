<?php

namespace Tests\Services;

use Jankx\Services\UserServiceException;
use Tests\TestCase;

/**
 * UserServiceException Test
 *
 * @package Tests\Services
 * @since 2.0.0
 */
class UserServiceExceptionTest extends TestCase
{
    public function testUserServiceExceptionExtendsException()
    {
        $exception = new UserServiceException();
        
        $this->assertInstanceOf(\Exception::class, $exception);
        $this->assertInstanceOf(UserServiceException::class, $exception);
    }

    public function testUserServiceExceptionWithMessage()
    {
        $message = 'User service error occurred';
        $exception = new UserServiceException($message);
        
        $this->assertEquals($message, $exception->getMessage());
    }

    public function testUserServiceExceptionWithCode()
    {
        $message = 'User service error occurred';
        $code = 500;
        $exception = new UserServiceException($message, $code);
        
        $this->assertEquals($message, $exception->getMessage());
        $this->assertEquals($code, $exception->getCode());
    }

    public function testUserServiceExceptionWithPreviousException()
    {
        $previousException = new \Exception('Previous error');
        $message = 'User service error occurred';
        $exception = new UserServiceException($message, 0, $previousException);
        
        $this->assertEquals($message, $exception->getMessage());
        $this->assertSame($previousException, $exception->getPrevious());
    }

    public function testUserServiceExceptionWithAllParameters()
    {
        $previousException = new \Exception('Previous error');
        $message = 'User service error occurred';
        $code = 500;
        $exception = new UserServiceException($message, $code, $previousException);
        
        $this->assertEquals($message, $exception->getMessage());
        $this->assertEquals($code, $exception->getCode());
        $this->assertSame($previousException, $exception->getPrevious());
    }

    public function testUserServiceExceptionDefaultValues()
    {
        $exception = new UserServiceException();
        
        $this->assertEquals('', $exception->getMessage());
        $this->assertEquals(0, $exception->getCode());
        $this->assertNull($exception->getPrevious());
    }

    public function testUserServiceExceptionCanBeThrown()
    {
        $this->expectException(UserServiceException::class);
        $this->expectExceptionMessage('Test exception');
        
        throw new UserServiceException('Test exception');
    }

    public function testUserServiceExceptionCanBeCaught()
    {
        try {
            throw new UserServiceException('Test exception');
        } catch (UserServiceException $e) {
            $this->assertEquals('Test exception', $e->getMessage());
            return;
        }
        
        $this->fail('Exception was not caught');
    }

    public function testUserServiceExceptionInheritance()
    {
        $exception = new UserServiceException();
        
        // Test that it extends Exception
        $this->assertTrue($exception instanceof \Exception);
        
        // Test that it's not a different exception type
        $this->assertFalse($exception instanceof \InvalidArgumentException);
    }

    public function testUserServiceExceptionStackTrace()
    {
        $exception = new UserServiceException('Test exception');
        
        $this->assertIsArray($exception->getTrace());
        $this->assertIsString($exception->getFile());
        $this->assertIsInt($exception->getLine());
    }
} 
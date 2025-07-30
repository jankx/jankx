<?php

/**
 * Unit Testing Example - Jankx 2.0
 *
 * This file demonstrates how to implement comprehensive unit tests
 * following the Jankx 2.0 coding rules.
 * @since 2.0.0
 */

// Example Helper Class

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * Class ExampleHelper
 *
 * @since 2.0.0
 */
class ExampleHelper
{
    /**
     * Method formatData
     *
     * @since 2.0.0
     */
    public static function formatData(array $data): array
    {
        return array_map('sanitize_text_field', $data);
    }

    /**
     * Method validateInput
     *
     * @since 2.0.0
     */
    public static function validateInput(string $input): bool
    {
        return !empty(trim($input));
    }

    /**
     * Method calculatePercentage
     *
     * @since 2.0.0
     */
    public static function calculatePercentage(int $value, int $total): float
    {
        if ($total === 0) {
            return 0.0;
        }
        return round(($value / $total) * 100, 2);
    }
}

// Example Service Class
/**
 * Class ExampleService
 *
 * @since 2.0.0
 */
class ExampleService
{
    private $repository;

    /**
     * Method __construct
     *
     * @since 2.0.0
     */
    public function __construct(ExampleRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Method processData
     *
     * @since 2.0.0
     */
    public function processData(array $data): array
    {
        try {
            $formattedData = ExampleHelper::formatData($data);
            return $this->repository->save($formattedData);
        } catch (\Exception $e) {
            \Jankx\Facades\Logger::error('Failed to process data', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Method getUserStats
     *
     * @since 2.0.0
     */
    public function getUserStats(int $userId): array
    {
        $user = $this->repository->find($userId);
        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        return [
            'id' => $user['id'],
            'name' => $user['name'],
            'percentage' => ExampleHelper::calculatePercentage($user['score'], $user['total'])
        ];
    }
}

// Example Repository (for demonstration)
/**
 * Class ExampleRepository
 *
 * @since 2.0.0
 */
class ExampleRepository
{
    /**
     * Method save
     *
     * @since 2.0.0
     */
    public function save(array $data): array
    {
        // Simulate database save
        return array_merge($data, ['id' => rand(1, 1000)]);
    }

    /**
     * Method find
     *
     * @since 2.0.0
     */
    public function find(int $id): ?array
    {
        // Simulate database find
        if ($id > 0) {
            return [
                'id' => $id,
                'name' => 'Test User',
                'score' => 75,
                'total' => 100
            ];
        }
        return null;
    }
}

// Example Unit Tests (following Jankx 2.0 rules)
/**
 * Class ExampleHelperTest
 *
 * @since 2.0.0
 */
class ExampleHelperTest extends \PHPUnit\Framework\TestCase
{
    /**
     * Test formatData with valid input
     * @since 2.0.0
     */
    public function testFormatDataWithValidInput(): void
    {
        $input = ['test', 'data', '<script>alert("xss")</script>'];
        $result = ExampleHelper::formatData($input);

        $this->assertIsArray($result);
        $this->assertCount(3, $result);
        $this->assertEquals('test', $result[0]);
        $this->assertEquals('data', $result[1]);
        $this->assertEquals('alert("xss")', $result[2]); // XSS should be sanitized
    }

    /**
     * Test formatData with empty input
     * @since 2.0.0
     */
    public function testFormatDataWithEmptyInput(): void
    {
        $input = [];
        $result = ExampleHelper::formatData($input);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    /**
     * Test validateInput with valid string
     * @since 2.0.0
     */
    public function testValidateInputWithValidString(): void
    {
        $input = 'valid input';
        $result = ExampleHelper::validateInput($input);

        $this->assertTrue($result);
    }

    /**
     * Test validateInput with empty string
     * @since 2.0.0
     */
    public function testValidateInputWithEmptyString(): void
    {
        $input = '';
        $result = ExampleHelper::validateInput($input);

        $this->assertFalse($result);
    }

    /**
     * Test validateInput with whitespace only
     * @since 2.0.0
     */
    public function testValidateInputWithWhitespaceOnly(): void
    {
        $input = '   ';
        $result = ExampleHelper::validateInput($input);

        $this->assertFalse($result);
    }

    /**
     * Test calculatePercentage with valid values
     * @since 2.0.0
     */
    public function testCalculatePercentageWithValidValues(): void
    {
        $result = ExampleHelper::calculatePercentage(75, 100);

        $this->assertEquals(75.0, $result);
    }

    /**
     * Test calculatePercentage with zero total
     * @since 2.0.0
     */
    public function testCalculatePercentageWithZeroTotal(): void
    {
        $result = ExampleHelper::calculatePercentage(50, 0);

        $this->assertEquals(0.0, $result);
    }

    /**
     * Test calculatePercentage with decimal result
     * @since 2.0.0
     */
    public function testCalculatePercentageWithDecimalResult(): void
    {
        $result = ExampleHelper::calculatePercentage(1, 3);

        $this->assertEquals(33.33, $result);
    }
}

/**
 * Class ExampleServiceTest
 *
 * @since 2.0.0
 */
class ExampleServiceTest extends \PHPUnit\Framework\TestCase
{
    private $mockRepository;
    private $service;

    /**
     * Method setUp
     *
     * @since 2.0.0
     */
    protected function setUp(): void
    {
        $this->mockRepository = $this->createMock(ExampleRepository::class);
        $this->service = new ExampleService($this->mockRepository);
    }

    /**
     * Test processData successfully
     * @since 2.0.0
     */
    public function testProcessDataSuccessfully(): void
    {
        $inputData = ['test' => 'data'];
        $expectedResult = ['test' => 'data', 'id' => 123];

        $this->mockRepository
            ->expects($this->once())
            ->method('save')
            ->with($this->arrayHasKey('test'))
            ->willReturn($expectedResult);

        $result = $this->service->processData($inputData);

        $this->assertEquals($expectedResult, $result);
    }

    /**
     * Test processData throws exception
     * @since 2.0.0
     */
    public function testProcessDataThrowsException(): void
    {
        $inputData = ['invalid' => 'data'];

        $this->mockRepository
            ->expects($this->once())
            ->method('save')
            ->willThrowException(new \Exception('Database error'));

        $this->expectException(\Exception::class);
        $this->service->processData($inputData);
    }

    /**
     * Test getUserStats with valid user ID
     * @since 2.0.0
     */
    public function testGetUserStatsWithValidUserId(): void
    {
        $userId = 1;
        $userData = [
            'id' => $userId,
            'name' => 'Test User',
            'score' => 75,
            'total' => 100
        ];

        $this->mockRepository
            ->expects($this->once())
            ->method('find')
            ->with($userId)
            ->willReturn($userData);

        $result = $this->service->getUserStats($userId);

        $this->assertIsArray($result);
        $this->assertEquals($userId, $result['id']);
        $this->assertEquals('Test User', $result['name']);
        $this->assertEquals(75.0, $result['percentage']);
    }

    /**
     * Test getUserStats with invalid user ID
     * @since 2.0.0
     */
    public function testGetUserStatsWithInvalidUserId(): void
    {
        $userId = 999;

        $this->mockRepository
            ->expects($this->once())
            ->method('find')
            ->with($userId)
            ->willReturn(null);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('User not found');

        $this->service->getUserStats($userId);
    }

    /**
     * Test getUserStats with zero user ID
     * @since 2.0.0
     */
    public function testGetUserStatsWithZeroUserId(): void
    {
        $userId = 0;

        $this->mockRepository
            ->expects($this->once())
            ->method('find')
            ->with($userId)
            ->willReturn(null);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('User not found');

        $this->service->getUserStats($userId);
    }
}

/**
 * Integration Test Example
 * @since 2.0.0
 */
class ExampleIntegrationTest extends \PHPUnit\Framework\TestCase
{
    private $repository;
    private $service;

    /**
     * Method setUp
     *
     * @since 2.0.0
     */
    protected function setUp(): void
    {
        $this->repository = new ExampleRepository();
        $this->service = new ExampleService($this->repository);
    }

    /**
     * Test complete workflow from data processing to user stats
     * @since 2.0.0
     */
    public function testCompleteWorkflow(): void
    {
        // Test data processing
        $inputData = ['name' => 'John Doe', 'score' => '85'];
        $processedData = $this->service->processData($inputData);

        $this->assertIsArray($processedData);
        $this->assertArrayHasKey('id', $processedData);
        $this->assertEquals('John Doe', $processedData['name']);
        $this->assertEquals('85', $processedData['score']);

        // Test user stats retrieval
        $userId = $processedData['id'];
        $userStats = $this->service->getUserStats($userId);

        $this->assertIsArray($userStats);
        $this->assertEquals($userId, $userStats['id']);
        $this->assertEquals('Test User', $userStats['name']);
        $this->assertEquals(75.0, $userStats['percentage']);
    }
}

/**
 * Test Configuration Example
 * @since 2.0.0
 */
class TestConfiguration
{
    /**
     * PHPUnit configuration example for Jankx 2.0
     * @since 2.0.0
     */
    public static function getPhpUnitConfig(): array
    {
        return [
            'bootstrap' => 'tests/bootstrap.php',
            'testsuites' => [
                'Jankx Tests' => [
                    'directory' => 'tests/',
                    'exclude' => ['tests/bootstrap.php']
                ]
            ],
            'coverage' => [
                'include' => [
                    'includes/Jankx/'
                ],
                'exclude' => [
                    'includes/Jankx/I18n/',
                    'includes/Jankx/Views/'
                ],
                'report' => [
                    'html' => 'coverage-report/',
                    'text' => 'coverage-report/coverage.txt'
                ]
            ],
            'filter' => [
                'whitelist' => [
                    'include' => [
                        'directory' => 'includes/Jankx/',
                        'suffix' => '.php'
                    ]
                ]
            ]
        ];
    }
}

/**
 * Usage Instructions:
 *
 * 1. Create test files following the pattern: tests/{Namespace}/{ClassName}Test.php
 * 2. Test all public methods in both helper and service classes
 * 3. Test both success and failure scenarios
 * 4. Use mocks for external dependencies (WordPress functions, database, etc.)
 * 5. Aim for 90%+ test coverage
 * 6. Run tests with: vendor/bin/phpunit
 * 7. Generate coverage report: vendor/bin/phpunit --coverage-html coverage-report/
 */
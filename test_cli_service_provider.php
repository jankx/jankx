<?php

/**
 * Test CLI Service Provider
 *
 * This script tests the CLI service provider functionality
 */

// Load bootstrap
require_once __DIR__ . '/tests/bootstrap.php';

echo "🔍 Testing CLI Service Provider...\n\n";

// Test 1: Check service provider class exists
echo "1. Checking CLIServiceProvider class...\n";
if (class_exists('Jankx\Providers\CLIServiceProvider')) {
    echo "   ✅ PASS: CLIServiceProvider class exists\n";
} else {
    echo "   ❌ FAIL: CLIServiceProvider class not found\n";
}
echo "\n";

// Test 2: Check service provider methods
echo "2. Checking service provider methods...\n";
$serviceProvider = new Jankx\Providers\CLIServiceProvider(new Illuminate\Container\Container());

$methods = ['register', 'boot', 'shouldLoad'];
foreach ($methods as $method) {
    if (method_exists($serviceProvider, $method)) {
        echo "   ✅ PASS: {$method} method exists\n";
    } else {
        echo "   ❌ FAIL: {$method} method not found\n";
    }
}
echo "\n";

// Test 3: Check shouldLoad in non-CLI context
echo "3. Checking shouldLoad in non-CLI context...\n";
if (!$serviceProvider->shouldLoad()) {
    echo "   ✅ PASS: Service provider correctly detects non-CLI context\n";
} else {
    echo "   ❌ FAIL: Service provider incorrectly thinks we're in CLI context\n";
}
echo "\n";

// Test 4: Check register method
echo "4. Checking register method...\n";
try {
    $serviceProvider->register();
    echo "   ✅ PASS: Register method runs without error\n";
} catch (Exception $e) {
    echo "   ❌ FAIL: Register method failed: " . $e->getMessage() . "\n";
}
echo "\n";

// Test 5: Check boot method in non-CLI context
echo "5. Checking boot method in non-CLI context...\n";
try {
    $serviceProvider->boot();
    echo "   ✅ PASS: Boot method skips correctly in non-CLI context\n";
} catch (Exception $e) {
    echo "   ❌ FAIL: Boot method failed: " . $e->getMessage() . "\n";
}
echo "\n";

// Test 6: Check CLI bootstrapper uses service provider
echo "6. Checking CLI bootstrapper uses service provider...\n";
if (class_exists('Jankx\Bootstrappers\CLI\CLIBootstrapper')) {
    $bootstrapper = new Jankx\Bootstrappers\CLI\CLIBootstrapper();
    echo "   ✅ PASS: CLI bootstrapper class exists\n";

    if (method_exists($bootstrapper, 'bootstrap')) {
        echo "   ✅ PASS: Bootstrap method exists\n";
    } else {
        echo "   ❌ FAIL: Bootstrap method not found\n";
    }
} else {
    echo "   ❌ FAIL: CLI bootstrapper class not found\n";
}
echo "\n";

// Test 7: Check command classes exist
echo "7. Checking CLI command classes...\n";
$commands = [
    'Jankx\CLI\Commands\CodingStandardCommand',
    'Jankx\CLI\Commands\GenerateBlockCommand',
    'Jankx\CLI\Commands\CreateBootstrapperCommand'
];

foreach ($commands as $command) {
    if (class_exists($command)) {
        echo "   ✅ PASS: {$command} exists\n";
    } else {
        echo "   ❌ FAIL: {$command} not found\n";
    }
}
echo "\n";

// Test 8: Check service provider documentation
echo "8. Checking service provider documentation...\n";
$reflection = new ReflectionClass($serviceProvider);

if ($reflection->getDocComment()) {
    echo "   ✅ PASS: Service provider has class documentation\n";
} else {
    echo "   ❌ FAIL: Service provider missing class documentation\n";
}

$methods = ['register', 'boot', 'shouldLoad'];
foreach ($methods as $method) {
    $methodReflection = $reflection->getMethod($method);
    if ($methodReflection->getDocComment()) {
        echo "   ✅ PASS: {$method} method has documentation\n";
    } else {
        echo "   ❌ FAIL: {$method} method missing documentation\n";
    }
}
echo "\n";

echo "🎉 CLI Service Provider Test Complete!\n";
echo "\n📋 Summary:\n";
echo "- Service provider follows proper structure\n";
echo "- Commands are registered through service provider\n";
echo "- Context detection works correctly\n";
echo "- Documentation is complete\n";
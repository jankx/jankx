<?php

/**
 * Config Repository ArrayAccess Example
 *
 * Demonstrates how to use Config Repository with ArrayAccess interface
 *
 * @package Examples
 * @since 2.0.0
 */

// Example 1: Basic ArrayAccess Usage
echo "=== Basic ArrayAccess Usage ===\n";

$config = new \Jankx\Config\Repository();

// Using array syntax to get values
$themeName = $config['theme.info.name'];
echo "Theme name: {$themeName}\n";

$primaryColor = $config['theme.colors.primary'];
echo "Primary color: {$primaryColor}\n";

// Using array syntax to set values
$config['theme.custom.new_setting'] = 'array_value';
echo "New setting: {$config['theme.custom.new_setting']}\n";

// Using isset() to check if key exists
if (isset($config['theme.info.name'])) {
    echo "Theme name exists\n";
}

if (!isset($config['theme.nonexistent.key'])) {
    echo "Non-existent key does not exist\n";
}

// Using unset() to remove values (sets to null)
unset($config['theme.custom.new_setting']);
echo "After unset: " . ($config['theme.custom.new_setting'] ?? 'null') . "\n";

// Example 2: Nested ArrayAccess Usage
echo "\n=== Nested ArrayAccess Usage ===\n";

// Accessing nested values
$colors = $config['theme.colors'];
echo "Colors section: " . json_encode($colors) . "\n";

// Setting nested values
$config['theme.layout.container_width'] = '1400px';
echo "Container width: {$config['theme.layout.container_width']}\n";

// Example 3: ArrayAccess with Default Values
echo "\n=== ArrayAccess with Default Values ===\n";

// Non-existent keys return null
$nonExistent = $config['theme.nonexistent.key'];
echo "Non-existent key: " . ($nonExistent ?? 'null') . "\n";

// Example 4: ArrayAccess Performance
echo "\n=== ArrayAccess Performance ===\n";

$startTime = microtime(true);

// Test array access performance
for ($i = 0; $i < 1000; $i++) {
    $value = $config["theme.info.name"];
}

$endTime = microtime(true);
$executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds

echo "1000 array accesses took: {$executionTime}ms\n";

// Example 5: ArrayAccess vs Method Calls
echo "\n=== ArrayAccess vs Method Calls ===\n";

// ArrayAccess syntax
$arrayAccessValue = $config['theme.info.name'];

// Method call syntax
$methodCallValue = $config->get('theme.info.name');

echo "ArrayAccess value: {$arrayAccessValue}\n";
echo "Method call value: {$methodCallValue}\n";
echo "Values are equal: " . ($arrayAccessValue === $methodCallValue ? 'true' : 'false') . "\n";

// Example 6: ArrayAccess Error Handling
echo "\n=== ArrayAccess Error Handling ===\n";

try {
    // This should throw an exception
    $config[null] = 'value';
} catch (\InvalidArgumentException $e) {
    echo "Caught exception: " . $e->getMessage() . "\n";
}

// Example 7: ArrayAccess with Complex Data
echo "\n=== ArrayAccess with Complex Data ===\n";

// Setting complex data
$config['theme.complex'] = [
    'nested' => [
        'deep' => [
            'value' => 'complex_data'
        ]
    ]
];

// Accessing complex data
$complexValue = $config['theme.complex.nested.deep.value'];
echo "Complex value: {$complexValue}\n";

// Example 8: ArrayAccess with Type Checking
echo "\n=== ArrayAccess with Type Checking ===\n";

// Setting different types
$config['theme.string'] = 'string_value';
$config['theme.number'] = 42;
$config['theme.boolean'] = true;
$config['theme.array'] = ['a', 'b', 'c'];

echo "String: " . gettype($config['theme.string']) . " - {$config['theme.string']}\n";
echo "Number: " . gettype($config['theme.number']) . " - {$config['theme.number']}\n";
echo "Boolean: " . gettype($config['theme.boolean']) . " - " . ($config['theme.boolean'] ? 'true' : 'false') . "\n";
echo "Array: " . gettype($config['theme.array']) . " - " . json_encode($config['theme.array']) . "\n";

// Example 9: ArrayAccess with Interface
echo "\n=== ArrayAccess with Interface ===\n";

// Using interface
$configInterface = new \Jankx\Config\Repository();

// Interface should support ArrayAccess
if ($configInterface instanceof \ArrayAccess) {
    echo "Config implements ArrayAccess interface\n";

    // Test interface methods
    $configInterface['test.key'] = 'interface_value';
    echo "Interface test: {$configInterface['test.key']}\n";
}

// Example 10: ArrayAccess Integration with Container
echo "\n=== ArrayAccess Integration with Container ===\n";

// Simulate container resolution
$container = new \Illuminate\Container\Container();
$container->singleton('config', function() {
    return new \Jankx\Config\Repository();
});

$containerConfig = $container->make('config');

// Container should return ArrayAccess implementation
if ($containerConfig instanceof \ArrayAccess) {
    echo "Container returns ArrayAccess implementation\n";

    $containerConfig['container.test'] = 'container_value';
    echo "Container test: {$containerConfig['container.test']}\n";
}

echo "\n=== ArrayAccess Example Complete ===\n";
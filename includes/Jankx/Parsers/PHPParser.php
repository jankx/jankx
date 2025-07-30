<?php

namespace Jankx\Parsers;

/**
 * PHP Parser for Jankx CLI
 *
 * Parses PHP files to extract namespaces, classes, methods, docblocks, and PHP 8 attributes
 *
 * @package Jankx\Parsers
 * @since 2.0.0
 */
class PHPParser
{
    /**
     * @var array
     * @since 2.0.0
     */
    private $tokens = [];

    /**
     * @var array
     * @since 2.0.0
     */
    private $namespaces = [];

    /**
     * @var array
     * @since 2.0.0
     */
    private $classes = [];

    /**
     * @var array
     * @since 2.0.0
     */
    private $methods = [];

    /**
     * @var array
     * @since 2.0.0
     */
    private $functions = [];

    /**
     * @var array
     * @since 2.0.0
     */
    private $interfaces = [];

    /**
     * @var array
     * @since 2.0.0
     */
    private $traits = [];

    /**
     * Parse a PHP file
     *
     * @param string $filePath
     * @return array
     * @since 2.0.0
     */
    public function parseFile($filePath)
    {
        if (!file_exists($filePath)) {
            throw new \InvalidArgumentException("File not found: $filePath");
        }

        $content = file_get_contents($filePath);
        return $this->parseContent($content, $filePath);
    }

    /**
     * Parse PHP content
     *
     * @param string $content
     * @param string $filePath
     * @return array
     * @since 2.0.0
     */
    public function parseContent($content, $filePath = '')
    {
        // Check if this is a script file (like .asset.php)
        if ($this->isScriptFile($content, $filePath)) {
            return $this->parseScriptFile($content, $filePath);
        }

        $this->tokens = token_get_all($content);
        $this->reset();

        $this->parseNamespaces();
        $this->parseClasses();
        $this->parseMethods();
        $this->parseFunctions();
        $this->parseInterfaces();
        $this->parseTraits();

        return [
            'file' => $filePath,
            'namespaces' => $this->namespaces,
            'classes' => $this->classes,
            'methods' => $this->methods,
            'functions' => $this->functions,
            'interfaces' => $this->interfaces,
            'traits' => $this->traits,
        ];
    }

    /**
     * Check if file is a script file (like .asset.php)
     *
     * @param string $content
     * @param string $filePath
     * @return bool
     * @since 2.0.0
     */
    private function isScriptFile($content, $filePath)
    {
        // Check if filename contains .asset.php
        if (strpos($filePath, '.asset.php') !== false) {
            return true;
        }

        // Check if content only contains return statement and array
        $tokens = token_get_all($content);
        $hasReturn = false;
        $hasArray = false;
        $hasClass = false;
        $hasFunction = false;
        $hasNamespace = false;

        foreach ($tokens as $token) {
            if (is_array($token)) {
                if ($token[0] === T_RETURN) {
                    $hasReturn = true;
                } elseif ($token[0] === T_ARRAY || $token === '[') {
                    $hasArray = true;
                } elseif ($token[0] === T_CLASS) {
                    $hasClass = true;
                } elseif ($token[0] === T_FUNCTION) {
                    $hasFunction = true;
                } elseif ($token[0] === T_NAMESPACE) {
                    $hasNamespace = true;
                }
            }
        }

        // If it has return and array but no class/function/namespace, it's likely a script
        return $hasReturn && $hasArray && !$hasClass && !$hasFunction && !$hasNamespace;
    }

    /**
     * Parse script file (like .asset.php)
     *
     * @param string $content
     * @param string $filePath
     * @return array
     * @since 2.0.0
     */
    private function parseScriptFile($content, $filePath)
    {
        return [
            'file' => $filePath,
            'type' => 'script',
            'namespaces' => [],
            'classes' => [],
            'methods' => [],
            'functions' => [],
            'interfaces' => [],
            'traits' => [],
        ];
    }

    /**
     * Reset parser state
     *
     * @since 2.0.0
     */
    private function reset()
    {
        $this->namespaces = [];
        $this->classes = [];
        $this->methods = [];
        $this->functions = [];
        $this->interfaces = [];
        $this->traits = [];
    }

    /**
     * Parse namespaces
     *
     * @since 2.0.0
     */
    private function parseNamespaces()
    {
        $currentNamespace = '';
        $currentDocblock = '';
        $currentAttributes = [];

        for ($i = 0; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_DOC_COMMENT) {
                    $currentDocblock = $token[1];
                } elseif ($token[0] === T_ATTRIBUTE) {
                    $currentAttributes = $this->parseAttributes($i);
                } elseif ($token[0] === T_NAMESPACE) {
                    $namespaceName = $this->extractNamespaceName($i);
                    $currentNamespace = $namespaceName;

                    $this->namespaces[] = [
                        'name' => $namespaceName,
                        'docblock' => $currentDocblock,
                        'attributes' => $currentAttributes,
                        'line' => $token[2],
                        'start' => $token[2],
                        'end' => $this->findNamespaceEnd($i),
                    ];

                    $currentDocblock = '';
                    $currentAttributes = [];
                }
            }
        }
    }

    /**
     * Parse classes
     *
     * @since 2.0.0
     */
    private function parseClasses()
    {
        $currentNamespace = '';
        $currentDocblock = '';
        $currentAttributes = [];

        for ($i = 0; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_DOC_COMMENT) {
                    $currentDocblock = $token[1];
                } elseif ($token[0] === T_ATTRIBUTE) {
                    $currentAttributes = $this->parseAttributes($i);
                } elseif ($token[0] === T_NAMESPACE) {
                    $currentNamespace = $this->extractNamespaceName($i);
                } elseif ($token[0] === T_CLASS) {
                    $className = $this->extractClassName($i);
                    $classInfo = $this->extractClassInfo($i);

                    $this->classes[] = [
                        'name' => $className,
                        'namespace' => $currentNamespace,
                        'fullName' => $currentNamespace ? $currentNamespace . '\\' . $className : $className,
                        'docblock' => $currentDocblock,
                        'attributes' => $currentAttributes,
                        'line' => $token[2],
                        'start' => $token[2],
                        'end' => $classInfo['end'],
                        'extends' => $classInfo['extends'],
                        'implements' => $classInfo['implements'],
                        'isAbstract' => $classInfo['isAbstract'],
                        'isFinal' => $classInfo['isFinal'],
                        'visibility' => $classInfo['visibility'],
                    ];

                    $currentDocblock = '';
                    $currentAttributes = [];
                }
            }
        }
    }

    /**
     * Parse methods
     *
     * @since 2.0.0
     */
    private function parseMethods()
    {
        $currentClass = '';
        $currentDocblock = '';
        $currentAttributes = [];
        $inClass = false;

        for ($i = 0; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_DOC_COMMENT) {
                    $currentDocblock = $token[1];
                } elseif ($token[0] === T_ATTRIBUTE) {
                    $currentAttributes = $this->parseAttributes($i);
                } elseif ($token[0] === T_CLASS) {
                    $inClass = true;
                    $currentClass = $this->extractClassName($i);
                } elseif ($token[0] === T_FUNCTION && $inClass) {
                    $methodInfo = $this->extractMethodInfo($i);

                    $this->methods[] = [
                        'name' => $methodInfo['name'],
                        'class' => $currentClass,
                        'docblock' => $currentDocblock,
                        'attributes' => $currentAttributes,
                        'line' => $token[2],
                        'start' => $token[2],
                        'end' => $methodInfo['end'],
                        'visibility' => $methodInfo['visibility'],
                        'isStatic' => $methodInfo['isStatic'],
                        'isAbstract' => $methodInfo['isAbstract'],
                        'isFinal' => $methodInfo['isFinal'],
                        'parameters' => $methodInfo['parameters'],
                        'returnType' => $methodInfo['returnType'],
                    ];

                    $currentDocblock = '';
                    $currentAttributes = [];
                }
            }
        }
    }

    /**
     * Parse functions
     *
     * @since 2.0.0
     */
    private function parseFunctions()
    {
        $currentDocblock = '';
        $currentAttributes = [];
        $inClass = false;

        for ($i = 0; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_DOC_COMMENT) {
                    $currentDocblock = $token[1];
                } elseif ($token[0] === T_ATTRIBUTE) {
                    $currentAttributes = $this->parseAttributes($i);
                } elseif ($token[0] === T_CLASS) {
                    $inClass = true;
                } elseif ($token[0] === T_FUNCTION && !$inClass) {
                    $functionInfo = $this->extractFunctionInfo($i);

                    $this->functions[] = [
                        'name' => $functionInfo['name'],
                        'docblock' => $currentDocblock,
                        'attributes' => $currentAttributes,
                        'line' => $token[2],
                        'start' => $token[2],
                        'end' => $functionInfo['end'],
                        'parameters' => $functionInfo['parameters'],
                        'returnType' => $functionInfo['returnType'],
                    ];

                    $currentDocblock = '';
                    $currentAttributes = [];
                }
            }
        }
    }

    /**
     * Parse interfaces
     *
     * @since 2.0.0
     */
    private function parseInterfaces()
    {
        $currentDocblock = '';
        $currentAttributes = [];

        for ($i = 0; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_DOC_COMMENT) {
                    $currentDocblock = $token[1];
                } elseif ($token[0] === T_ATTRIBUTE) {
                    $currentAttributes = $this->parseAttributes($i);
                } elseif ($token[0] === T_INTERFACE) {
                    $interfaceName = $this->extractInterfaceName($i);
                    $interfaceInfo = $this->extractInterfaceInfo($i);

                    $this->interfaces[] = [
                        'name' => $interfaceName,
                        'docblock' => $currentDocblock,
                        'attributes' => $currentAttributes,
                        'line' => $token[2],
                        'start' => $token[2],
                        'end' => $interfaceInfo['end'],
                        'extends' => $interfaceInfo['extends'],
                    ];

                    $currentDocblock = '';
                    $currentAttributes = [];
                }
            }
        }
    }

    /**
     * Parse traits
     *
     * @since 2.0.0
     */
    private function parseTraits()
    {
        $currentDocblock = '';
        $currentAttributes = [];

        for ($i = 0; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_DOC_COMMENT) {
                    $currentDocblock = $token[1];
                } elseif ($token[0] === T_ATTRIBUTE) {
                    $currentAttributes = $this->parseAttributes($i);
                } elseif ($token[0] === T_TRAIT) {
                    $traitName = $this->extractTraitName($i);
                    $traitInfo = $this->extractTraitInfo($i);

                    $this->traits[] = [
                        'name' => $traitName,
                        'docblock' => $currentDocblock,
                        'attributes' => $currentAttributes,
                        'line' => $token[2],
                        'start' => $token[2],
                        'end' => $traitInfo['end'],
                    ];

                    $currentDocblock = '';
                    $currentAttributes = [];
                }
            }
        }
    }

    /**
     * Parse PHP 8 attributes
     *
     * @param int $startIndex
     * @return array
     * @since 2.0.0
     */
    private function parseAttributes($startIndex)
    {
        $attributes = [];
        $currentAttribute = '';
        $inAttribute = false;
        $bracketCount = 0;

        for ($i = $startIndex; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_ATTRIBUTE) {
                    $inAttribute = true;
                    $bracketCount = 0;
                    $currentAttribute = '';
                } elseif ($inAttribute) {
                    if ($token[0] === '(') {
                        $bracketCount++;
                    } elseif ($token[0] === ')') {
                        $bracketCount--;
                        if ($bracketCount === 0) {
                            $inAttribute = false;
                            $attributes[] = $this->parseAttributeString($currentAttribute);
                            $currentAttribute = '';
                        }
                    } else {
                        $currentAttribute .= $token[1];
                    }
                }
            } else {
                if ($inAttribute) {
                    $currentAttribute .= $token;
                }
            }

            if (!$inAttribute && $bracketCount === 0) {
                break;
            }
        }

        return $attributes;
    }

    /**
     * Parse attribute string
     *
     * @param string $attributeString
     * @return array
     * @since 2.0.0
     */
    private function parseAttributeString($attributeString)
    {
        // Simple attribute parsing - can be enhanced for complex attributes
        return [
            'raw' => $attributeString,
            'name' => trim($attributeString),
            'arguments' => [],
        ];
    }

    /**
     * Extract namespace name
     *
     * @param int $startIndex
     * @return string
     * @since 2.0.0
     */
    private function extractNamespaceName($startIndex)
    {
        $namespace = '';

        for ($i = $startIndex + 1; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_STRING || $token[0] === T_NS_SEPARATOR) {
                    $namespace .= $token[1];
                } elseif ($token[0] === T_WHITESPACE) {
                    continue;
                } else {
                    break;
                }
            } else {
                if ($token === ';') {
                    break;
                }
            }
        }

        return trim($namespace);
    }

    /**
     * Find namespace end
     *
     * @param int $startIndex
     * @return int
     * @since 2.0.0
     */
    private function findNamespaceEnd($startIndex)
    {
        for ($i = $startIndex; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_NAMESPACE) {
                    return $token[2];
                }
            }
        }

        return count($this->tokens);
    }

    /**
     * Extract class name
     *
     * @param int $startIndex
     * @return string
     * @since 2.0.0
     */
    private function extractClassName($startIndex)
    {
        for ($i = $startIndex + 1; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token) && $token[0] === T_STRING) {
                return $token[1];
            }
        }

        return '';
    }

    /**
     * Extract class information
     *
     * @param int $startIndex
     * @return array
     * @since 2.0.0
     */
    private function extractClassInfo($startIndex)
    {
        $info = [
            'extends' => '',
            'implements' => [],
            'isAbstract' => false,
            'isFinal' => false,
            'visibility' => 'public',
            'end' => $startIndex,
        ];

        // Check for abstract/final keywords
        for ($i = $startIndex - 1; $i >= 0; $i--) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_ABSTRACT) {
                    $info['isAbstract'] = true;
                } elseif ($token[0] === T_FINAL) {
                    $info['isFinal'] = true;
                } elseif ($token[0] === T_WHITESPACE) {
                    continue;
                } else {
                    break;
                }
            }
        }

        // Find extends and implements
        $bracketCount = 0;
        $inClass = false;

        for ($i = $startIndex; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_CLASS) {
                    $inClass = true;
                } elseif ($token[0] === T_EXTENDS && $inClass) {
                    $info['extends'] = $this->extractExtends($i);
                } elseif ($token[0] === T_IMPLEMENTS && $inClass) {
                    $info['implements'] = $this->extractImplements($i);
                } elseif ($token[0] === T_WHITESPACE) {
                    continue;
                }
            } else {
                if ($token === '{' && $inClass) {
                    $bracketCount++;
                } elseif ($token === '}' && $inClass) {
                    $bracketCount--;
                    if ($bracketCount === 0) {
                        $info['end'] = $i;
                        break;
                    }
                }
            }
        }

        return $info;
    }

    /**
     * Extract extends clause
     *
     * @param int $startIndex
     * @return string
     * @since 2.0.0
     */
    private function extractExtends($startIndex)
    {
        $extends = '';

        for ($i = $startIndex + 1; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_STRING || $token[0] === T_NS_SEPARATOR) {
                    $extends .= $token[1];
                } elseif ($token[0] === T_WHITESPACE) {
                    continue;
                } else {
                    break;
                }
            } else {
                if ($token === '{' || $token === 'implements') {
                    break;
                }
            }
        }

        return trim($extends);
    }

    /**
     * Extract implements clause
     *
     * @param int $startIndex
     * @return array
     * @since 2.0.0
     */
    private function extractImplements($startIndex)
    {
        $implements = [];
        $current = '';

        for ($i = $startIndex + 1; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_STRING || $token[0] === T_NS_SEPARATOR) {
                    $current .= $token[1];
                } elseif ($token[0] === T_WHITESPACE) {
                    continue;
                } else {
                    break;
                }
            } else {
                if ($token === ',') {
                    $implements[] = trim($current);
                    $current = '';
                } elseif ($token === '{') {
                    if (!empty($current)) {
                        $implements[] = trim($current);
                    }
                    break;
                }
            }
        }

        if (!empty($current)) {
            $implements[] = trim($current);
        }

        return $implements;
    }

    /**
     * Extract method information
     *
     * @param int $startIndex
     * @return array
     * @since 2.0.0
     */
    private function extractMethodInfo($startIndex)
    {
        $info = [
            'name' => '',
            'visibility' => 'public',
            'isStatic' => false,
            'isAbstract' => false,
            'isFinal' => false,
            'parameters' => [],
            'returnType' => '',
            'end' => $startIndex,
        ];

        // Get method name
        for ($i = $startIndex + 1; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token) && $token[0] === T_STRING) {
                $info['name'] = $token[1];
                break;
            }
        }

        // Check modifiers
        for ($i = $startIndex - 1; $i >= 0; $i--) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_PUBLIC) {
                    $info['visibility'] = 'public';
                } elseif ($token[0] === T_PROTECTED) {
                    $info['visibility'] = 'protected';
                } elseif ($token[0] === T_PRIVATE) {
                    $info['visibility'] = 'private';
                } elseif ($token[0] === T_STATIC) {
                    $info['isStatic'] = true;
                } elseif ($token[0] === T_ABSTRACT) {
                    $info['isAbstract'] = true;
                } elseif ($token[0] === T_FINAL) {
                    $info['isFinal'] = true;
                } elseif ($token[0] === T_WHITESPACE) {
                    continue;
                } else {
                    break;
                }
            }
        }

        // Find method end
        $bracketCount = 0;
        $inMethod = false;

        for ($i = $startIndex; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_FUNCTION) {
                    $inMethod = true;
                }
            } else {
                if ($token === '{' && $inMethod) {
                    $bracketCount++;
                } elseif ($token === '}' && $inMethod) {
                    $bracketCount--;
                    if ($bracketCount === 0) {
                        $info['end'] = $i;
                        break;
                    }
                }
            }
        }

        return $info;
    }

    /**
     * Extract function information
     *
     * @param int $startIndex
     * @return array
     * @since 2.0.0
     */
    private function extractFunctionInfo($startIndex)
    {
        $info = [
            'name' => '',
            'parameters' => [],
            'returnType' => '',
            'end' => $startIndex,
        ];

        // Get function name
        for ($i = $startIndex + 1; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token) && $token[0] === T_STRING) {
                $info['name'] = $token[1];
                break;
            }
        }

        // Find function end
        $bracketCount = 0;
        $inFunction = false;

        for ($i = $startIndex; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_FUNCTION) {
                    $inFunction = true;
                }
            } else {
                if ($token === '{' && $inFunction) {
                    $bracketCount++;
                } elseif ($token === '}' && $inFunction) {
                    $bracketCount--;
                    if ($bracketCount === 0) {
                        $info['end'] = $i;
                        break;
                    }
                }
            }
        }

        return $info;
    }

    /**
     * Extract interface name
     *
     * @param int $startIndex
     * @return string
     * @since 2.0.0
     */
    private function extractInterfaceName($startIndex)
    {
        for ($i = $startIndex + 1; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token) && $token[0] === T_STRING) {
                return $token[1];
            }
        }

        return '';
    }

    /**
     * Extract interface information
     *
     * @param int $startIndex
     * @return array
     * @since 2.0.0
     */
    private function extractInterfaceInfo($startIndex)
    {
        $info = [
            'extends' => [],
            'end' => $startIndex,
        ];

        // Find extends
        $bracketCount = 0;
        $inInterface = false;

        for ($i = $startIndex; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_INTERFACE) {
                    $inInterface = true;
                } elseif ($token[0] === T_EXTENDS && $inInterface) {
                    $info['extends'] = $this->extractImplements($i);
                }
            } else {
                if ($token === '{' && $inInterface) {
                    $bracketCount++;
                } elseif ($token === '}' && $inInterface) {
                    $bracketCount--;
                    if ($bracketCount === 0) {
                        $info['end'] = $i;
                        break;
                    }
                }
            }
        }

        return $info;
    }

    /**
     * Extract trait name
     *
     * @param int $startIndex
     * @return string
     * @since 2.0.0
     */
    private function extractTraitName($startIndex)
    {
        for ($i = $startIndex + 1; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token) && $token[0] === T_STRING) {
                return $token[1];
            }
        }

        return '';
    }

    /**
     * Extract trait information
     *
     * @param int $startIndex
     * @return array
     * @since 2.0.0
     */
    private function extractTraitInfo($startIndex)
    {
        $info = [
            'end' => $startIndex,
        ];

        // Find trait end
        $bracketCount = 0;
        $inTrait = false;

        for ($i = $startIndex; $i < count($this->tokens); $i++) {
            $token = $this->tokens[$i];

            if (is_array($token)) {
                if ($token[0] === T_TRAIT) {
                    $inTrait = true;
                }
            } else {
                if ($token === '{' && $inTrait) {
                    $bracketCount++;
                } elseif ($token === '}' && $inTrait) {
                    $bracketCount--;
                    if ($bracketCount === 0) {
                        $info['end'] = $i;
                        break;
                    }
                }
            }
        }

        return $info;
    }

    /**
     * Get all classes
     *
     * @return array
     * @since 2.0.0
     */
    public function getClasses()
    {
        return $this->classes;
    }

    /**
     * Get all methods
     *
     * @return array
     * @since 2.0.0
     */
    public function getMethods()
    {
        return $this->methods;
    }

    /**
     * Get all namespaces
     *
     * @return array
     * @since 2.0.0
     */
    public function getNamespaces()
    {
        return $this->namespaces;
    }

    /**
     * Get all functions
     *
     * @return array
     * @since 2.0.0
     */
    public function getFunctions()
    {
        return $this->functions;
    }

    /**
     * Get all interfaces
     *
     * @return array
     * @since 2.0.0
     */
    public function getInterfaces()
    {
        return $this->interfaces;
    }

    /**
     * Get all traits
     *
     * @return array
     * @since 2.0.0
     */
    public function getTraits()
    {
        return $this->traits;
    }

    /**
     * Check if a docblock has a specific tag
     *
     * @param string $docblock
     * @param string $tag
     * @return bool
     * @since 2.0.0
     */
    public function hasTag($docblock, $tag)
    {
        if (empty($docblock)) {
            return false;
        }

        return preg_match("/@$tag\s+/", $docblock);
    }

    /**
     * Extract tag value from docblock
     *
     * @param string $docblock
     * @param string $tag
     * @return string
     * @since 2.0.0
     */
    public function extractTagValue($docblock, $tag)
    {
        if (empty($docblock)) {
            return '';
        }

        if (preg_match("/@$tag\s+([^\s\n\r]+)/", $docblock, $matches)) {
            return trim($matches[1]);
        }

        return '';
    }

    /**
     * Extract all tag values from docblock
     *
     * @param string $docblock
     * @param string $tag
     * @return array
     * @since 2.0.0
     */
    public function extractAllTagValues($docblock, $tag)
    {
        if (empty($docblock)) {
            return [];
        }

        $values = [];
        if (preg_match_all("/@$tag\s+([^\s\n\r]+)/", $docblock, $matches)) {
            foreach ($matches[1] as $match) {
                $values[] = trim($match);
            }
        }

        return $values;
    }
}

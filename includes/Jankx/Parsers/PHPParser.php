<?php

namespace Jankx\Parsers;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use PhpParser\Node;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Function_;
use PhpParser\Node\Stmt\Namespace_;
use PhpParser\Node\Stmt\Interface_;
use PhpParser\Node\Stmt\Trait_;
use PhpParser\Node\Stmt\ClassConst;
use PhpParser\Node\Stmt\Property;
use PhpParser\Comment\Doc;

/**
 * PHP Parser using nikic/php-parser
 *
 * @since 2.0.0
 */
class PHPParser
{
    private $parser;
    private $nodeFinder;
    private $classes = [];
    private $methods = [];
    private $namespaces = [];
    private $functions = [];
    private $interfaces = [];
    private $traits = [];

    public function __construct()
    {
        $this->parser = (new ParserFactory)->createForNewestSupportedVersion();
        $this->nodeFinder = new NodeFinder();
    }

    /**
     * Parse PHP file
     *
     * @param string $filePath
     * @return array
     * @since 2.0.0
     */
    public function parseFile($filePath)
    {
        if (!file_exists($filePath)) {
            return [];
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
        $this->reset();

        // Check if this is a script file
        if ($this->isScriptFile($content, $filePath)) {
            return $this->parseScriptFile($content, $filePath);
        }

        try {
            $ast = $this->parser->parse($content);

            if ($ast === null) {
                return [];
            }

            $this->parseAST($ast);

            return [
                'classes' => $this->classes,
                'methods' => $this->methods,
                'namespaces' => $this->namespaces,
                'functions' => $this->functions,
                'interfaces' => $this->interfaces,
                'traits' => $this->traits,
            ];
        } catch (\Exception $e) {
            // Log error but don't fail
            return [];
        }
    }

    /**
     * Check if file is a script file
     *
     * @param string $content
     * @param string $filePath
     * @return bool
     * @since 2.0.0
     */
    private function isScriptFile($content, $filePath)
    {
        // Check file extension
        if (strpos($filePath, '.asset.php') !== false) {
            return true;
        }

        // Check content patterns
        $scriptPatterns = [
            '/wp_enqueue_script/',
            '/wp_register_script/',
            '/wp_localize_script/',
            '/wp_add_inline_script/',
        ];

        foreach ($scriptPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Parse script file (simplified parsing)
     *
     * @param string $content
     * @param string $filePath
     * @return array
     * @since 2.0.0
     */
    private function parseScriptFile($content, $filePath)
    {
        return [
            'classes' => [],
            'methods' => [],
            'namespaces' => [],
            'functions' => [],
            'interfaces' => [],
            'traits' => [],
        ];
    }

    /**
     * Parse AST nodes
     *
     * @param array $ast
     * @since 2.0.0
     */
    private function parseAST($ast)
    {
        foreach ($ast as $node) {
            if ($node instanceof Namespace_) {
                $this->parseNamespace($node);
            } elseif ($node instanceof Class_) {
                $this->parseClass($node);
            } elseif ($node instanceof Function_) {
                $this->parseFunction($node);
            } elseif ($node instanceof Interface_) {
                $this->parseInterface($node);
            } elseif ($node instanceof Trait_) {
                $this->parseTrait($node);
            }
        }
    }

    /**
     * Parse namespace
     *
     * @param Namespace_ $node
     * @since 2.0.0
     */
    private function parseNamespace($node)
    {
        $namespaceName = $node->name ? $node->name->toString() : '';
        $docblock = $this->extractDocblock($node);

        $this->namespaces[] = [
            'name' => $namespaceName,
            'docblock' => $docblock,
            'line' => $node->getStartLine(),
            'start' => $node->getStartLine(),
            'end' => $node->getEndLine(),
        ];

        // Parse nodes inside namespace
        foreach ($node->stmts as $stmt) {
            if ($stmt instanceof Class_) {
                $this->parseClass($stmt, $namespaceName);
            } elseif ($stmt instanceof Function_) {
                $this->parseFunction($stmt, $namespaceName);
            } elseif ($stmt instanceof Interface_) {
                $this->parseInterface($stmt, $namespaceName);
            } elseif ($stmt instanceof Trait_) {
                $this->parseTrait($stmt, $namespaceName);
            }
        }
    }

    /**
     * Parse class
     *
     * @param Class_ $node
     * @param string $namespace
     * @since 2.0.0
     */
    private function parseClass($node, $namespace = '')
    {
        $className = $node->name ? $node->name->toString() : '';
        $docblock = $this->extractDocblock($node);

        $this->classes[] = [
            'name' => $className,
            'namespace' => $namespace,
            'fullName' => $namespace ? $namespace . '\\' . $className : $className,
            'docblock' => $docblock,
            'line' => $node->getStartLine(),
            'start' => $node->getStartLine(),
            'end' => $node->getEndLine(),
            'extends' => $node->extends ? $node->extends->toString() : null,
            'implements' => array_map(function($interface) {
                return $interface->toString();
            }, $node->implements),
            'isAbstract' => $node->isAbstract(),
            'isFinal' => $node->isFinal(),
            'visibility' => 'public', // Default visibility
        ];

        // Parse class methods
        foreach ($node->stmts as $stmt) {
            if ($stmt instanceof ClassMethod) {
                $this->parseClassMethod($stmt, $className);
            }
        }
    }

    /**
     * Parse class method
     *
     * @param ClassMethod $node
     * @param string $className
     * @since 2.0.0
     */
    private function parseClassMethod($node, $className)
    {
        $methodName = $node->name->toString();
        $docblock = $this->extractDocblock($node);

        $this->methods[] = [
            'name' => $methodName,
            'class' => $className,
            'docblock' => $docblock,
            'line' => $node->getStartLine(),
            'start' => $node->getStartLine(),
            'end' => $node->getEndLine(),
            'visibility' => $this->getVisibility($node),
            'isStatic' => $node->isStatic(),
            'isAbstract' => $node->isAbstract(),
            'isFinal' => $node->isFinal(),
            'parameters' => $this->parseParameters($node->params),
            'returnType' => $this->getTypeString($node->returnType),
        ];
    }

    /**
     * Parse function
     *
     * @param Function_ $node
     * @param string $namespace
     * @since 2.0.0
     */
    private function parseFunction($node, $namespace = '')
    {
        $functionName = $node->name->toString();
        $docblock = $this->extractDocblock($node);

        $this->functions[] = [
            'name' => $functionName,
            'namespace' => $namespace,
            'fullName' => $namespace ? $namespace . '\\' . $functionName : $functionName,
            'docblock' => $docblock,
            'line' => $node->getStartLine(),
            'start' => $node->getStartLine(),
            'end' => $node->getEndLine(),
            'parameters' => $this->parseParameters($node->params),
            'returnType' => $this->getTypeString($node->returnType),
        ];
    }

    /**
     * Parse interface
     *
     * @param Interface_ $node
     * @param string $namespace
     * @since 2.0.0
     */
    private function parseInterface($node, $namespace = '')
    {
        $interfaceName = $node->name->toString();
        $docblock = $this->extractDocblock($node);

        $this->interfaces[] = [
            'name' => $interfaceName,
            'namespace' => $namespace,
            'fullName' => $namespace ? $namespace . '\\' . $interfaceName : $interfaceName,
            'docblock' => $docblock,
            'line' => $node->getStartLine(),
            'start' => $node->getStartLine(),
            'end' => $node->getEndLine(),
            'extends' => array_map(function($interface) {
                return $interface->toString();
            }, $node->extends),
        ];
    }

    /**
     * Parse trait
     *
     * @param Trait_ $node
     * @param string $namespace
     * @since 2.0.0
     */
    private function parseTrait($node, $namespace = '')
    {
        $traitName = $node->name->toString();
        $docblock = $this->extractDocblock($node);

        $this->traits[] = [
            'name' => $traitName,
            'namespace' => $namespace,
            'fullName' => $namespace ? $namespace . '\\' . $traitName : $traitName,
            'docblock' => $docblock,
            'line' => $node->getStartLine(),
            'start' => $node->getStartLine(),
            'end' => $node->getEndLine(),
        ];
    }

    /**
     * Extract docblock from node
     *
     * @param Node $node
     * @return string|null
     * @since 2.0.0
     */
    private function extractDocblock($node)
    {
        $comments = $node->getComments();
        foreach ($comments as $comment) {
            if ($comment instanceof Doc) {
                return $comment->getText();
            }
        }
        return null;
    }

    /**
     * Get method visibility
     *
     * @param ClassMethod $node
     * @return string
     * @since 2.0.0
     */
    private function getVisibility($node)
    {
        if ($node->isPublic()) {
            return 'public';
        } elseif ($node->isProtected()) {
            return 'protected';
        } elseif ($node->isPrivate()) {
            return 'private';
        }
        return 'public';
    }

    /**
     * Parse parameters
     *
     * @param array $params
     * @return array
     * @since 2.0.0
     */
    private function parseParameters($params)
    {
        $result = [];
        foreach ($params as $param) {
            $result[] = [
                'name' => $param->var->name,
                'type' => $this->getTypeString($param->type),
                'default' => $this->getDefaultValue($param->default),
            ];
        }
        return $result;
    }

    /**
     * Get type string from node
     *
     * @param Node|null $type
     * @return string|null
     * @since 2.0.0
     */
    private function getTypeString($type)
    {
        if (!$type) {
            return null;
        }

        if (method_exists($type, 'toString')) {
            return $type->toString();
        }

        if (method_exists($type, 'getType')) {
            return $type->getType();
        }

        return (string) $type;
    }

    /**
     * Get default value from node
     *
     * @param Node|null $default
     * @return string|null
     * @since 2.0.0
     */
    private function getDefaultValue($default)
    {
        if (!$default) {
            return null;
        }

        // Handle different node types
        $nodeType = get_class($default);

        switch ($nodeType) {
            case 'PhpParser\Node\Expr\Array_':
                return '[]';
            case 'PhpParser\Node\Expr\ConstFetch':
                return $default->name->toString();
            case 'PhpParser\Node\Scalar\String_':
                return "'" . $default->value . "'";
            case 'PhpParser\Node\Scalar\LNumber':
            case 'PhpParser\Node\Scalar\DNumber':
                return (string) $default->value;
            case 'PhpParser\Node\Expr\UnaryMinus':
                return '-' . $this->getDefaultValue($default->expr);
            case 'PhpParser\Node\Expr\UnaryPlus':
                return '+' . $this->getDefaultValue($default->expr);
            default:
                if (method_exists($default, 'toString')) {
                    return $default->toString();
                }
                if (method_exists($default, 'getValue')) {
                    return $default->getValue();
                }
                return 'null';
        }
    }

    /**
     * Reset parser state
     *
     * @since 2.0.0
     */
    private function reset()
    {
        $this->classes = [];
        $this->methods = [];
        $this->namespaces = [];
        $this->functions = [];
        $this->interfaces = [];
        $this->traits = [];
    }

    /**
     * Get classes
     *
     * @return array
     * @since 2.0.0
     */
    public function getClasses()
    {
        return $this->classes;
    }

    /**
     * Get methods
     *
     * @return array
     * @since 2.0.0
     */
    public function getMethods()
    {
        return $this->methods;
    }

    /**
     * Get namespaces
     *
     * @return array
     * @since 2.0.0
     */
    public function getNamespaces()
    {
        return $this->namespaces;
    }

    /**
     * Get functions
     *
     * @return array
     * @since 2.0.0
     */
    public function getFunctions()
    {
        return $this->functions;
    }

    /**
     * Get interfaces
     *
     * @return array
     * @since 2.0.0
     */
    public function getInterfaces()
    {
        return $this->interfaces;
    }

    /**
     * Get traits
     *
     * @return array
     * @since 2.0.0
     */
    public function getTraits()
    {
        return $this->traits;
    }

    /**
     * Check if docblock has tag
     *
     * @param string $docblock
     * @param string $tag
     * @return bool
     * @since 2.0.0
     */
    public function hasTag($docblock, $tag)
    {
        if (!$docblock) {
            return false;
        }

        $pattern = '/@' . preg_quote($tag, '/') . '\b/';
        return preg_match($pattern, $docblock) === 1;
    }

    /**
     * Extract tag value
     *
     * @param string $docblock
     * @param string $tag
     * @return string|null
     * @since 2.0.0
     */
    public function extractTagValue($docblock, $tag)
    {
        if (!$docblock) {
            return null;
        }

        $pattern = '/@' . preg_quote($tag, '/') . '\s+([^\s\r\n]+)/';
        if (preg_match($pattern, $docblock, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    /**
     * Extract all tag values
     *
     * @param string $docblock
     * @param string $tag
     * @return array
     * @since 2.0.0
     */
    public function extractAllTagValues($docblock, $tag)
    {
        if (!$docblock) {
            return [];
        }

        $pattern = '/@' . preg_quote($tag, '/') . '\s+([^\s\r\n]+)/';
        $matches = [];
        preg_match_all($pattern, $docblock, $matches);

        return array_map('trim', $matches[1]);
    }
}

<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * SVG Sanitizer for Jankx Framework
 * Provides comprehensive SVG sanitization to prevent XSS and other security issues
 */

class Jankx_SVG_Sanitizer
{
    // Allowed SVG elements
    private static $allowed_elements = [
        'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
        'text', 'tspan', 'title', 'desc', 'defs', 'use', 'symbol', 'mask', 'clipPath',
        'linearGradient', 'radialGradient', 'stop', 'filter', 'feGaussianBlur',
        'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
        'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feImage', 'feMerge',
        'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence',
        'feDistantLight', 'fePointLight', 'feSpotLight', 'feFuncR', 'feFuncG',
        'feFuncB', 'feFuncA', 'animate', 'animateTransform', 'animateMotion',
        'set', 'metadata', 'foreignObject', 'switch', 'a', 'image', 'marker',
        'pattern', 'style', 'script', 'view', 'font', 'font-face', 'font-face-uri',
        'font-face-format', 'font-face-name', 'missing-glyph', 'glyph', 'hkern',
        'vkern', 'font-face-src'
    ];

    // Allowed SVG attributes
    private static $allowed_attributes = [
        // Core attributes
        'id', 'class', 'style', 'title', 'lang', 'xml:lang', 'xml:space',

        // SVG specific attributes
        'width', 'height', 'viewBox', 'preserveAspectRatio', 'x', 'y',
        'cx', 'cy', 'r', 'rx', 'ry', 'd', 'points', 'x1', 'y1', 'x2', 'y2',
        'transform', 'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width',
        'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit',
        'stroke-dasharray', 'stroke-dashoffset', 'opacity', 'visibility', 'display',
        'clip-path', 'mask', 'filter', 'font-family', 'font-size', 'font-weight',
        'font-style', 'text-anchor', 'dominant-baseline', 'letter-spacing',
        'word-spacing', 'text-decoration', 'writing-mode', 'direction',

        // Animation attributes
        'begin', 'dur', 'end', 'repeatCount', 'repeatDur', 'fill', 'calcMode',
        'values', 'keyTimes', 'keySplines', 'from', 'to', 'by', 'attributeName',
        'attributeType', 'additive', 'accumulate', 'restart', 'min', 'max',

        // Filter attributes
        'stdDeviation', 'order', 'kernelMatrix', 'divisor', 'bias', 'targetX',
        'targetY', 'edgeMode', 'preserveAlpha', 'xChannelSelector', 'yChannelSelector',
        'in', 'in2', 'operator', 'k1', 'k2', 'k3', 'k4', 'type', 'tableValues',
        'slope', 'intercept', 'amplitude', 'exponent', 'frequency', 'phase',
        'baseFrequency', 'numOctaves', 'seed', 'stitchTiles', 'scale', 'xlink:href',

        // Gradient attributes
        'gradientUnits', 'gradientTransform', 'spreadMethod', 'offset',
        'stop-color', 'stop-opacity',

        // Pattern attributes
        'patternUnits', 'patternContentUnits', 'patternTransform',

        // Clip path and mask attributes
        'clipPathUnits', 'maskUnits', 'maskContentUnits',

        // Text attributes
        'dx', 'dy', 'rotate', 'lengthAdjust', 'textLength',

        // Image attributes
        'href', 'xlink:href', 'preserveAspectRatio', 'crossorigin',

        // Foreign object attributes
        'requiredExtensions', 'requiredFeatures', 'systemLanguage',

        // Animation motion attributes
        'path', 'keyPoints', 'rotate', 'origin',

        // Font attributes
        'font-family', 'font-style', 'font-variant', 'font-weight', 'font-stretch',
        'font-size', 'font-size-adjust', 'kerning', 'letter-spacing', 'word-spacing',
        'text-decoration', 'unicode-bidi', 'direction', 'text-anchor',
        'dominant-baseline', 'alignment-baseline', 'baseline-shift',
        'writing-mode', 'glyph-orientation-horizontal', 'glyph-orientation-vertical',
        'text-rendering', 'font-variant-ligatures', 'font-variant-position',
        'font-variant-caps', 'font-variant-numeric', 'font-variant-alternates',
        'font-feature-settings', 'font-variation-settings', 'font-language-override',
        'font-kerning', 'font-synthesis', 'font-smooth', 'font-stretch',
        'font-size-adjust', 'font-display', 'font-src', 'font-format',
        'font-named-instance', 'font-variant-east-asian'
    ];

    // Dangerous attributes that should be removed
    private static $dangerous_attributes = [
        'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout', 'onmousedown',
        'onmouseup', 'onmousemove', 'onkeydown', 'onkeyup', 'onkeypress', 'onfocus',
        'onblur', 'onchange', 'onsubmit', 'onreset', 'onselect', 'onunload',
        'onabort', 'onbeforeunload', 'onerror', 'onhashchange', 'onmessage',
        'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpopstate',
        'onresize', 'onstorage', 'oncontextmenu', 'oninput', 'oninvalid',
        'onsearch', 'onbeforeprint', 'onafterprint', 'onbeforeinstallprompt',
        'onappinstalled'
    ];

    /**
     * Sanitize SVG content
     *
     * @param string $svg_content
     * @return string|false Sanitized SVG content or false on failure
     */
    public static function sanitize_svg($svg_content)
    {
        if (empty($svg_content) || !is_string($svg_content)) {
            return false;
        }

        // Remove null bytes and normalize
        $svg_content = str_replace(chr(0), '', $svg_content);
        $svg_content = trim($svg_content);

        // Check if content is valid SVG
        if (!self::is_valid_svg($svg_content)) {
            return false;
        }

        // Parse SVG with DOMDocument
        $dom = self::parse_svg_dom($svg_content);
        if ($dom === false) {
            return false;
        }

        // Sanitize the DOM
        $sanitized_dom = self::sanitize_svg_dom($dom);
        if ($sanitized_dom === false) {
            return false;
        }

        // Convert back to string
        return self::dom_to_svg_string($sanitized_dom);
    }

    /**
     * Check if content is valid SVG
     *
     * @param string $content
     * @return bool
     */
    private static function is_valid_svg($content)
    {
        // Check for SVG root element
        if (strpos($content, '<svg') === false) {
            return false;
        }

        // Check for XML declaration (optional)
        if (strpos($content, '<?xml') !== false) {
            // Validate XML declaration
            if (!preg_match('/^<\?xml[^>]*\?>/', $content)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Parse SVG content to DOMDocument
     *
     * @param string $svg_content
     * @return DOMDocument|false
     */
    private static function parse_svg_dom($svg_content)
    {
        // Create DOMDocument
        $dom = new DOMDocument();

        // Suppress warnings for malformed XML
        libxml_use_internal_errors(true);

        // Load SVG content
        $result = $dom->loadXML($svg_content);

        // Check for parsing errors
        $errors = libxml_get_errors();
        libxml_clear_errors();

        if (!$result || !empty($errors)) {
            return false;
        }

        return $dom;
    }

    /**
     * Sanitize SVG DOM
     *
     * @param DOMDocument $dom
     * @return DOMDocument|false
     */
    private static function sanitize_svg_dom($dom)
    {
        $root = $dom->documentElement;
        if (!$root || $root->nodeName !== 'svg') {
            return false;
        }

        // Sanitize root element
        self::sanitize_element($root);

        // Sanitize all child elements
        self::sanitize_children($root);

        return $dom;
    }

    /**
     * Sanitize SVG element
     *
     * @param DOMElement $element
     */
    private static function sanitize_element($element)
    {
        // Check if element is allowed
        if (!in_array($element->nodeName, self::$allowed_elements, true)) {
            // Remove disallowed elements
            $element->parentNode->removeChild($element);
            return;
        }

        // Sanitize attributes
        self::sanitize_attributes($element);
    }

    /**
     * Sanitize element attributes
     *
     * @param DOMElement $element
     */
    private static function sanitize_attributes($element)
    {
        $attributes_to_remove = [];

        // Check each attribute
        foreach ($element->attributes as $attribute) {
            $attr_name = $attribute->nodeName;
            $attr_value = $attribute->nodeValue;

            // Remove dangerous attributes
            if (in_array($attr_name, self::$dangerous_attributes, true)) {
                $attributes_to_remove[] = $attr_name;
                continue;
            }

            // Check if attribute is allowed
            if (!in_array($attr_name, self::$allowed_attributes, true)) {
                $attributes_to_remove[] = $attr_name;
                continue;
            }

            // Sanitize attribute value
            $sanitized_value = self::sanitize_attribute_value($attr_name, $attr_value);
            if ($sanitized_value === false) {
                $attributes_to_remove[] = $attr_name;
            } else {
                $element->setAttribute($attr_name, $sanitized_value);
            }
        }

        // Remove disallowed attributes
        foreach ($attributes_to_remove as $attr_name) {
            $element->removeAttribute($attr_name);
        }
    }

    /**
     * Sanitize attribute value
     *
     * @param string $attr_name
     * @param string $attr_value
     * @return string|false
     */
    private static function sanitize_attribute_value($attr_name, $attr_value)
    {
        // Remove null bytes and normalize
        $attr_value = str_replace(chr(0), '', $attr_value);
        $attr_value = trim($attr_value);

        // Check for dangerous content in specific attributes
        if (in_array($attr_name, ['href', 'xlink:href'], true)) {
            // Only allow relative URLs or data URIs for images
            if (strpos($attr_value, 'javascript:') === 0) {
                return false;
            }
        }

        // Check for script content in style attributes
        if ($attr_name === 'style') {
            if (strpos($attr_value, 'javascript:') !== false) {
                return false;
            }
        }

        return $attr_value;
    }

    /**
     * Sanitize child elements recursively
     *
     * @param DOMElement $parent
     */
    private static function sanitize_children($parent)
    {
        $children_to_remove = [];

        foreach ($parent->childNodes as $child) {
            if ($child->nodeType === XML_ELEMENT_NODE) {
                // Sanitize element
                self::sanitize_element($child);

                // Recursively sanitize children
                self::sanitize_children($child);
            } elseif ($child->nodeType === XML_CDATA_SECTION_NODE) {
                // Remove CDATA sections (potential XSS)
                $children_to_remove[] = $child;
            }
        }

        // Remove disallowed children
        foreach ($children_to_remove as $child) {
            $parent->removeChild($child);
        }
    }

    /**
     * Convert DOM back to SVG string
     *
     * @param DOMDocument $dom
     * @return string
     */
    private static function dom_to_svg_string($dom)
    {
        return $dom->saveXML($dom->documentElement);
    }

    /**
     * Get allowed SVG elements
     *
     * @return array
     */
    public static function get_allowed_elements()
    {
        return self::$allowed_elements;
    }

    /**
     * Get allowed SVG attributes
     *
     * @return array
     */
    public static function get_allowed_attributes()
    {
        return self::$allowed_attributes;
    }

    /**
     * Get dangerous attributes
     *
     * @return array
     */
    public static function get_dangerous_attributes()
    {
        return self::$dangerous_attributes;
    }

    /**
     * Add allowed element
     *
     * @param string $element
     * @return bool
     */
    public static function add_allowed_element($element)
    {
        if (!in_array($element, self::$allowed_elements, true)) {
            self::$allowed_elements[] = $element;
            return true;
        }
        return false;
    }

    /**
     * Remove allowed element
     *
     * @param string $element
     * @return bool
     */
    public static function remove_allowed_element($element)
    {
        $key = array_search($element, self::$allowed_elements, true);
        if ($key !== false) {
            unset(self::$allowed_elements[$key]);
            return true;
        }
        return false;
    }

    /**
     * Add allowed attribute
     *
     * @param string $attribute
     * @return bool
     */
    public static function add_allowed_attribute($attribute)
    {
        if (!in_array($attribute, self::$allowed_attributes, true)) {
            self::$allowed_attributes[] = $attribute;
            return true;
        }
        return false;
    }

    /**
     * Remove allowed attribute
     *
     * @param string $attribute
     * @return bool
     */
    public static function remove_allowed_attribute($attribute)
    {
        $key = array_search($attribute, self::$allowed_attributes, true);
        if ($key !== false) {
            unset(self::$allowed_attributes[$key]);
            return true;
        }
        return false;
    }

    /**
     * Add dangerous attribute
     *
     * @param string $attribute
     * @return bool
     */
    public static function add_dangerous_attribute($attribute)
    {
        if (!in_array($attribute, self::$dangerous_attributes, true)) {
            self::$dangerous_attributes[] = $attribute;
            return true;
        }
        return false;
    }

    /**
     * Remove dangerous attribute
     *
     * @param string $attribute
     * @return bool
     */
    public static function remove_dangerous_attribute($attribute)
    {
        $key = array_search($attribute, self::$dangerous_attributes, true);
        if ($key !== false) {
            unset(self::$dangerous_attributes[$key]);
            return true;
        }
        return false;
    }
}

// Helper functions for backward compatibility
if (!function_exists('jankx_sanitize_svg')) {
    function jankx_sanitize_svg($svg_content)
    {
        return Jankx_SVG_Sanitizer::sanitize_svg($svg_content);
    }
}

if (!function_exists('jankx_get_svg_allowed_elements')) {
    function jankx_get_svg_allowed_elements()
    {
        return Jankx_SVG_Sanitizer::get_allowed_elements();
    }
}

if (!function_exists('jankx_get_svg_allowed_attributes')) {
    function jankx_get_svg_allowed_attributes()
    {
        return Jankx_SVG_Sanitizer::get_allowed_attributes();
    }
}

if (!function_exists('jankx_get_svg_dangerous_attributes')) {
    function jankx_get_svg_dangerous_attributes()
    {
        return Jankx_SVG_Sanitizer::get_dangerous_attributes();
    }
}
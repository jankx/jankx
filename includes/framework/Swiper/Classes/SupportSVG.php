<?php

namespace Jankx\Swiper\Classes;
use Jankx\Swiper\Traits\SingletonTrait;

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('SupportSVG')) {

    class SupportSVG {

        use SingletonTrait;

        private $wpFilesystem;

        /**
         * Register hooks and init filesystem
         */
        public function register() {
            add_filter('upload_mimes', [$this, 'allowSvgMimeType']);
            add_filter('wp_handle_upload_prefilter', [$this, 'validateSvgUpload']);
            add_filter('wp_prepare_attachment_for_js', [$this, 'fixSvgThumbnail']);
            add_action('admin_init', [$this, 'enableSvgSupport']);

            // WP Filesystem init
            if (!function_exists('WP_Filesystem')) {
                require_once ABSPATH . 'wp-admin/includes/file.php';
            }
            WP_Filesystem();
            global $wp_filesystem;
            $this->wpFilesystem = $wp_filesystem;
        }

        /**
         * Allow SVG MIME type in uploads
         */
        public function allowSvgMimeType(array $mimes): array {
            $mimes['svg'] = 'image/svg+xml';
            $mimes['svgz'] = 'image/svg+xml';
            return $mimes;
        }

        /**
         * Validate the uploaded SVG file
         */
        public function validateSvgUpload(array $file): array {
            if ($file['type'] !== 'image/svg+xml') {
                return $file;
            }

            // Validate file extension
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            if (!in_array($extension, ['svg', 'svgz'], true)) {
                $file['error'] = __('Invalid SVG file extension.', 'jankx'); 
                return $file;
            }

            // Read file content
            if (!$this->wpFilesystem->exists($file['tmp_name'])) {
                $file['error'] = __('Unable to locate uploaded file.', 'jankx'); 
                return $file;
            }

            $content = $this->wpFilesystem->get_contents($file['tmp_name']);
            if (!$content) {
                $file['error'] = __('Unable to read SVG file.', 'jankx');
                return $file;
            }

            // Validate SVG structure
            libxml_use_internal_errors(true);
            $doc = new \DOMDocument();
            if (!$doc->loadXML($content, LIBXML_NOENT | LIBXML_DTDLOAD | LIBXML_NOERROR | LIBXML_NOWARNING)) {
                $file['error'] = __('Invalid SVG XML structure.', 'jankx');
                libxml_clear_errors();
                return $file;
            }

            // Check for prohibited elements and attributes
            $isValid = $this->validateSvgContent($doc);
            if (!$isValid) {
                $file['error'] = __('SVG contains prohibited elements or attributes.', 'jankx');
                return $file;
            }

            // Sanitize SVG content
            $sanitizedContent = $this->sanitizeSvgContent($content);
            if (!$this->wpFilesystem->put_contents($file['tmp_name'], $sanitizedContent)) {
                $file['error'] = __('Unable to save sanitized SVG file.', 'jankx');
                return $file;
            }

            return $file;
        }

        /**
         * Fix SVG thumbnail display in the media library
         */
        public function fixSvgThumbnail(array $response): array {
            if ($response['mime'] === 'image/svg+xml') {
                $response['sizes'] = [
                    'full' => [
                        'url' => $response['url'],
                        'width' => $response['width'],
                        'height' => $response['height'],
                        'orientation' => $response['orientation'],
                    ],
                ];
            }
            return $response;
        }

        /**
         * Enable SVG support by updating file type checks
         */
        public function enableSvgSupport(): void {
            add_filter('wp_check_filetype_and_ext', function ($data, $file, $filename, $mimes) {
                $filetype = wp_check_filetype($filename, $mimes);
                return [
                    'ext' => $filetype['ext'],
                    'type' => $filetype['type'],
                    'proper_filename' => $data['proper_filename'],
                ];
            }, 10, 4);
        }

        /**
         * Validate the SVG content for prohibited elements and attributes
         */
        private function validateSvgContent(\DOMDocument $doc): bool {
            $xpath = new \DOMXPath($doc);

            // Prohibited elements
            $prohibitedElements = ['script', 'iframe'];
            foreach ($prohibitedElements as $tag) {
                if ($xpath->query("//{$tag}")->length > 0) {
                    return false;
                }
            }

            // Prohibited attributes
            $prohibitedAttributes = ['onclick', 'onload', 'onerror', 'xlink:href', 'javascript:', 'data:'];
            foreach ($prohibitedAttributes as $attr) {
                if ($xpath->query("//*[contains(@*, '{$attr}')]")->length > 0) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Sanitize SVG content to remove unwanted elements and attributes
         */
        private function sanitizeSvgContent(string $content): string {
            libxml_use_internal_errors(true);
            $doc = new \DOMDocument();
            $doc->loadXML($content);

            // Remove comments
            $xpath = new \DOMXPath($doc);
            foreach ($xpath->query('//comment()') as $comment) {
                $comment->parentNode->removeChild($comment);
            }

            // Remove unsafe attributes
            $elements = $doc->getElementsByTagName('*');
            foreach ($elements as $element) {
                $attributes = [];
                foreach ($element->attributes as $attribute) {
                    $attributes[] = $attribute->nodeName;
                }
                foreach ($attributes as $attribute) {
                    if (strpos($attribute, 'on') === 0) {
                        $element->removeAttribute($attribute);
                    }
                }
            }

            libxml_clear_errors();
            return $doc->saveXML();
        }
    }
}

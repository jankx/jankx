<?php

namespace Jankx\Layouts\PostLayout\Supports;

use Jankx\Layouts\PostLayout\PostLayout;

/**
 * Carousel Layout
 *
 * Hiển thị posts dạng carousel với navigation và autoplay support
 *
 * @package Jankx\Layouts\PostLayout\Supports
 */
class CarouselLayout extends PostLayout
{
    protected $name = 'carousel';
    protected $title = 'Carousel Layout';

    /**
     * Render layout with support for custom content generators
     * Ensures Embla structure is applied for any generator output
     */
    public function render(): string
    {
        if (!$this->query) {
            return '';
        }

        // For custom generators, wrap their output into Embla structure
        if ($this->hasCustomGenerator()) {
            $generated = $this->contentGenerator->generate($this->query, $this->options);
            if (empty($generated)) {
                return '';
            }

            $columns = $this->getOption('columns', 3);
            $slidesToScroll = $this->getOption('slidesToScroll', 1);
            $loop = $this->getOption('loop', false);
            $autoplay = $this->getOption('autoplay', false);
            $autoplayDelay = $this->getOption('autoplayDelay', 3000);
            $showArrows = $this->getOption('showArrows', true);
            $showDots = $this->getOption('showDots', true);

            $wrapper_class = sprintf('post-type-layout-carousel columns-%d', $columns);

            // Build data attributes for Embla Carousel
            $data_attrs = [
                'data-embla-carousel' => '',
                'data-slides-per-view' => $columns,
                'data-slides-to-scroll' => $slidesToScroll,
            ];
            if ($loop) {
                $data_attrs['data-loop'] = 'true';
            }
            if ($autoplay) {
                $data_attrs['data-autoplay'] = 'true';
                $data_attrs['data-autoplay-delay'] = $autoplayDelay;
            }

            // Attempt to split generator output into slides based on provided classes
            $itemsWrapperClass = (string)$this->getOption('itemsWrapperClass', '');
            $itemClass = (string)$this->getOption('itemClass', '');

            $slidesHtml = '';

            // Try to parse and extract items if selectors provided
            if (!empty($itemClass)) {
                $slidesHtml = $this->extractSlidesFromHtml($generated, $itemsWrapperClass, $itemClass);
            }

            // Fallback: if no items extracted, treat the whole generated as one slide
            if (empty($slidesHtml)) {
                $slidesHtml = '<div class="embla__slide">' . $generated . '</div>';
            }

            // Build carousel HTML structure
            ob_start();
            ?>
            <div class="<?php echo esc_attr($wrapper_class); ?>" <?php
                foreach ($data_attrs as $key => $value) {
                    echo esc_attr($key) . '="' . esc_attr($value) . '" ';
                }
            ?>>
                <div class="embla__viewport">
                    <div class="embla__container">
                        <?php echo $slidesHtml; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                    </div>
                </div>

                <?php if ($showArrows) : ?>
                    <button class="embla__button embla__button--prev" type="button" aria-label="<?php esc_attr_e('Previous slide', 'jankx'); ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                    <button class="embla__button embla__button--next" type="button" aria-label="<?php esc_attr_e('Next slide', 'jankx'); ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                <?php endif; ?>

                <?php if ($showDots) : ?>
                    <div class="embla__dots"></div>
                <?php endif; ?>
            </div>
            <?php
            $carouselHtml = ob_get_clean();

            // Allow generator to wrap carousel HTML with its own container
            // This enables generators like WooCommerceContentGenerator to add necessary wrappers
            if (method_exists($this->contentGenerator, 'wrapCarouselHtml')) {
                return $this->contentGenerator->wrapCarouselHtml($this->query, $this->options, $carouselHtml);
            }

            return $carouselHtml;
        }

        // Non-custom generator: use default renderer
        return $this->renderDefault();
    }

    /**
     * Extract slides HTML from generator output by class hints
     *
     * @param string $html
     * @param string $itemsWrapperClass
     * @param string $itemClass
     * @return string
     */
    protected function extractSlidesFromHtml(string $html, string $itemsWrapperClass, string $itemClass): string
    {
        // Simple DOM parsing using DOMDocument
        $internalErrors = libxml_use_internal_errors(true);
        $dom = new \DOMDocument('1.0', 'UTF-8');
        // Load with UTF-8 handling - wrap in container div for proper parsing
        @$dom->loadHTML('<?xml encoding="utf-8" ?><div>' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        libxml_use_internal_errors($internalErrors);

        $xpath = new \DOMXPath($dom);

        // Build XPath for items - search for elements with the item class
        $itemXPath = sprintf('.//*[contains(concat(" ", normalize-space(@class), " "), " %s ")]', $itemClass);

        $slides = [];

        // If wrapper class provided, search within wrapper first
        if (!empty($itemsWrapperClass)) {
            $wrapperXPath = sprintf('.//*[contains(concat(" ", normalize-space(@class), " "), " %s ")]', $itemsWrapperClass);
            $wrappers = $xpath->query($wrapperXPath);
            
            if ($wrappers && $wrappers->length > 0) {
                // Search items within the first wrapper found
                $wrapper = $wrappers->item(0);
                $items = $xpath->query($itemXPath, $wrapper);
            } else {
                // Wrapper not found, search globally
                $items = $xpath->query($itemXPath);
            }
        } else {
            // No wrapper specified, search globally
            $items = $xpath->query($itemXPath);
        }

        if ($items && $items->length > 0) {
            foreach ($items as $node) {
                // Convert list items (li) and list containers (ul/ol) to divs for HTML standard compliance
                $nodeHtml = $this->convertListToDivs($dom, $node);
                $slides[] = '<div class="embla__slide">' . $nodeHtml . '</div>';
            }
        }

        return implode("\n", $slides);
    }

    /**
     * Convert list elements (ul, ol, li) to divs for HTML standard compliance
     *
     * @param \DOMDocument $dom
     * @param \DOMNode $node
     * @return string
     */
    protected function convertListToDivs(\DOMDocument $dom, \DOMNode $node): string
    {
        // Create a new document to work with cloned node
        $newDom = new \DOMDocument('1.0', 'UTF-8');
        $newDom->preserveWhiteSpace = false;
        $newDom->formatOutput = false;
        
        // Deep clone the node to work independently
        $clonedNode = $newDom->importNode($node, true);
        $newDom->appendChild($clonedNode);
        
        $xpath = new \DOMXPath($newDom);
        
        // Replace li elements first (bottom-up to avoid conflicts)
        $listItems = $xpath->query('.//li', $clonedNode);
        $itemsToReplace = [];
        if ($listItems && $listItems->length > 0) {
            foreach ($listItems as $item) {
                $itemsToReplace[] = $item;
            }
        }
        
        foreach ($itemsToReplace as $item) {
            $div = $newDom->createElement('div');
            // Copy all attributes from li to div
            foreach ($item->attributes as $attr) {
                $div->setAttribute($attr->nodeName, $attr->nodeValue);
            }
            // Copy all child nodes
            while ($item->firstChild) {
                $div->appendChild($item->firstChild);
            }
            $item->parentNode->replaceChild($div, $item);
        }
        
        // Replace ul/ol containers (after li are replaced)
        $listContainers = $xpath->query('.//ul | .//ol', $clonedNode);
        $containersToReplace = [];
        if ($listContainers && $listContainers->length > 0) {
            foreach ($listContainers as $container) {
                $containersToReplace[] = $container;
            }
        }
        
        foreach ($containersToReplace as $container) {
            $div = $newDom->createElement('div');
            // Copy all attributes from ul/ol to div
            foreach ($container->attributes as $attr) {
                $div->setAttribute($attr->nodeName, $attr->nodeValue);
            }
            // Copy all child nodes
            while ($container->firstChild) {
                $div->appendChild($container->firstChild);
            }
            $container->parentNode->replaceChild($div, $container);
        }
        
        // If the root node itself is a li or ul/ol, replace it
        if (in_array(strtolower($clonedNode->nodeName), ['li', 'ul', 'ol'])) {
            $div = $newDom->createElement('div');
            // Copy all attributes
            foreach ($clonedNode->attributes as $attr) {
                $div->setAttribute($attr->nodeName, $attr->nodeValue);
            }
            // Copy all child nodes
            while ($clonedNode->firstChild) {
                $div->appendChild($clonedNode->firstChild);
            }
            $clonedNode->parentNode->replaceChild($div, $clonedNode);
            $clonedNode = $div;
        }
        
        // Return outer HTML of the cloned node (not just inner HTML)
        // This ensures we get the full element with its attributes
        return $newDom->saveHTML($clonedNode);
    }

    /**
     * {@inheritDoc}
     */
    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $columns = $this->getOption('columns', 3);
        $slidesToScroll = $this->getOption('slidesToScroll', 1);
        $loop = $this->getOption('loop', false);
        $autoplay = $this->getOption('autoplay', false);
        $autoplayDelay = $this->getOption('autoplayDelay', 3000);
        $showArrows = $this->getOption('showArrows', true);
        $showDots = $this->getOption('showDots', true);
        
        $wrapper_class = sprintf('post-type-layout-carousel columns-%d', $columns);
        
        // Build data attributes for Embla Carousel
        $data_attrs = [
            'data-embla-carousel' => '',
            'data-slides-per-view' => $columns,
            'data-slides-to-scroll' => $slidesToScroll,
        ];
        
        if ($loop) {
            $data_attrs['data-loop'] = 'true';
        }
        
        if ($autoplay) {
            $data_attrs['data-autoplay'] = 'true';
            $data_attrs['data-autoplay-delay'] = $autoplayDelay;
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr($wrapper_class); ?>" <?php
            foreach ($data_attrs as $key => $value) {
                echo esc_attr($key) . '="' . esc_attr($value) . '" ';
            }
        ?>>
            <div class="embla__viewport">
                <div class="embla__container">
                    <?php
                    while ($this->query->have_posts()) {
                        $this->query->the_post();
                        echo '<div class="embla__slide">';
                        echo $this->renderPostItem();
                        echo '</div>';
                    }
                    wp_reset_postdata();
                    ?>
                </div>
            </div>
            
            <?php if ($showArrows) : ?>
                <button class="embla__button embla__button--prev" type="button" aria-label="<?php esc_attr_e('Previous slide', 'jankx'); ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <button class="embla__button embla__button--next" type="button" aria-label="<?php esc_attr_e('Next slide', 'jankx'); ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            <?php endif; ?>
            
            <?php if ($showDots) : ?>
                <div class="embla__dots"></div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * {@inheritDoc}
     */
    public function renderDefaultPreview(): array
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'type' => 'carousel',
            'columns' => $this->getOption('columns', 3),
            'slidesToScroll' => $this->getOption('slidesToScroll', 1),
            'loop' => $this->getOption('loop', false),
            'autoplay' => $this->getOption('autoplay', false),
            'supportedOptions' => $this->getSupportedOptions(),
            'previewItems' => $this->generatePreviewItems(),
        ];
    }

    /**
     * Generate preview items for editor
     *
     * @return array
     */
    protected function generatePreviewItems(): array
    {
        $count = min($this->getOption('postsPerPage', 6), 6);
        $items = [];

        for ($i = 0; $i < $count; $i++) {
            $items[] = [
                'id' => $i + 1,
                'title' => sprintf(__('Post Title %d', 'jankx'), $i + 1),
                'excerpt' => __('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...', 'jankx'),
                'date' => date('Y-m-d'),
                'author' => 'Admin',
                'thumbnail' => true,
            ];
        }

        return $items;
    }

    /**
     * {@inheritDoc}
     */
    public function getSupportedOptions(): array
    {
        return [
            'columns',
            'postsPerPage',
            'showFeaturedImage',
            'showTitle',
            'showExcerpt',
            'showDate',
            'showAuthor',
            'excerptLength',
            'slidesToScroll',
            'loop',
            'autoplay',
            'autoplayDelay',
            'showArrows',
            'showDots',
            'itemStyle',
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getReadOnlyOptions(): array
    {
        return [
            'showTitle', // Carousel layout cần title để có ý nghĩa
        ];
    }
}


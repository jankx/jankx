<?php

namespace Jankx\Layouts\PostLayout\Supports;

/**
 * Extract individual slide markup from generator output.
 */
class CarouselSlideExtractor
{
    /**
     * Extract slides from HTML by looking for wrapper/item class hints.
     *
     * @param string $html
     * @param string $itemsWrapperClass
     * @param string $itemClass
     * @return string
     */
    public static function extract(string $html, string $itemsWrapperClass, string $itemClass): string
    {
        if ($html === '' || $itemClass === '') {
            return '';
        }

        $dom = self::createDomDocument($html);
        $xpath = new \DOMXPath($dom);

        $itemXPath = sprintf('.//*[contains(concat(" ", normalize-space(@class), " "), " %s ")]', $itemClass);
        $items = self::findItems($xpath, $itemXPath, $itemsWrapperClass);

        if (!$items || $items->length === 0) {
            return '';
        }

        $slides = [];

        foreach ($items as $node) {
            $nodeHtml = self::convertListToDivs($dom, $node);
            $slides[] = '<div class="embla__slide">' . $nodeHtml . '</div>';
        }

        return implode("\n", $slides);
    }

    protected static function createDomDocument(string $html): \DOMDocument
    {
        $internalErrors = libxml_use_internal_errors(true);
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $dom->preserveWhiteSpace = false;

        @$dom->loadHTML(
            sprintf('<?xml encoding="utf-8" ?><div>%s</div>', $html),
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );

        libxml_clear_errors();
        libxml_use_internal_errors($internalErrors);

        return $dom;
    }

    protected static function findItems(\DOMXPath $xpath, string $itemXPath, string $itemsWrapperClass): ?\DOMNodeList
    {
        if ($itemsWrapperClass === '') {
            return $xpath->query($itemXPath);
        }

        $wrapperXPath = sprintf('.//*[contains(concat(" ", normalize-space(@class), " "), " %s ")]', $itemsWrapperClass);
        $wrappers = $xpath->query($wrapperXPath);

        if ($wrappers && $wrappers->length > 0) {
            return $xpath->query($itemXPath, $wrappers->item(0));
        }

        return $xpath->query($itemXPath);
    }

    /**
     * Convert lists to divs to keep markup valid in carousel slides.
     *
     * @param \DOMDocument $dom
     * @param \DOMNode $node
     * @return string
     */
    protected static function convertListToDivs(\DOMDocument $dom, \DOMNode $node): string
    {
        $newDom = new \DOMDocument('1.0', 'UTF-8');
        $newDom->preserveWhiteSpace = false;

        $clonedNode = $newDom->importNode($node, true);
        $newDom->appendChild($clonedNode);

        $xpath = new \DOMXPath($newDom);

        self::replaceNodes($newDom, $xpath->query('.//li', $clonedNode));
        self::replaceNodes($newDom, $xpath->query('.//ul | .//ol', $clonedNode));

        $nodeName = strtolower($clonedNode->nodeName);
        if (in_array($nodeName, ['li', 'ul', 'ol'], true)) {
            $div = $newDom->createElement('div');
            foreach ($clonedNode->attributes ?? [] as $attr) {
                $div->setAttribute($attr->nodeName, $attr->nodeValue);
            }
            while ($clonedNode->firstChild) {
                $div->appendChild($clonedNode->firstChild);
            }
            $clonedNode->parentNode->replaceChild($div, $clonedNode);
            $clonedNode = $div;
        }

        return $newDom->saveHTML($clonedNode);
    }

    /**
     * Replace list based nodes with div equivalents.
     *
     * @param \DOMDocument $dom
     * @param \DOMNodeList|null $nodes
     * @return void
     */
    protected static function replaceNodes(\DOMDocument $dom, ?\DOMNodeList $nodes): void
    {
        if (!$nodes || $nodes->length === 0) {
            return;
        }

        $replacements = [];
        foreach ($nodes as $item) {
            $replacements[] = $item;
        }

        foreach ($replacements as $item) {
            $div = $dom->createElement('div');
            foreach ($item->attributes ?? [] as $attr) {
                $div->setAttribute($attr->nodeName, $attr->nodeValue);
            }
            while ($item->firstChild) {
                $div->appendChild($item->firstChild);
            }
            $item->parentNode->replaceChild($div, $item);
        }
    }
}


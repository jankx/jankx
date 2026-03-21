<?php

namespace Jankx\Layouts\DynamicDataLayout\Parsers;

use Jankx\Layouts\DynamicDataLayout\Contracts\LayoutDataParserInterface;
use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;

/**
 * Abstract Base Layout Data Parser
 * 
 * Provides basic logic for parsing layout data. Specific layouts can extend this 
 * to add custom fields or logic.
 */
abstract class BaseLayoutDataParser implements LayoutDataParserInterface
{
    /**
     * @var BlockTemplateLayoutInterface
     */
    protected $layout;

    /**
     * @var string
     */
    protected $id;

    /**
     * Constructor
     * 
     * @param BlockTemplateLayoutInterface $layout
     */
    public function __construct(BlockTemplateLayoutInterface $layout)
    {
        $this->layout = $layout;
        $this->id = \Jankx\Facades\App::make('asset.resolver')->generateUniqueId('jkx-layout');
    }

    /**
     * Get common data fields across all layouts
     * 
     * @return array
     */
    protected function getCommonData(): array
    {
        $dynamicCss = $this->generateDynamicCss();
        if (!empty($dynamicCss)) {
            \Jankx\Facades\App::make('asset.resolver')->addInlineCss(
                $dynamicCss, 
                \Jankx\Services\AssetResolver::INSTANCE, 
                $this->id
            );
        }

        return [
            'id' => $this->id,
            'name' => $this->layout->getName(),
            'options' => $this->layout->getOptions(),
            'layout' => $this->layout,
        ];
    }

    /**
     * Generate dynamic CSS for this specific layout instance
     * 
     * Child classes should override this to provide custom logic.
     * 
     * @return string
     */
    protected function generateDynamicCss(): string
    {
        $css = [];
        $options = $this->layout->getOptions();

        // Common: Aspect Ratio (Anti-CLS)
        $imageRatio = $options['imageRatio'] ?? null;
        if ($imageRatio && strpos($imageRatio, '/') !== false) {
            [$w, $h] = array_map('floatval', explode('/', $imageRatio));
            if ($w > 0 && $h > 0) {
                $percent = ($h / $w) * 100.0;
                $css[] = "#{$this->id} { --jankx-image-ratio: {$percent}%; }";
            }
        }

        return implode("\n", $css);
    }

    /**
     * Parse and return data as array (suitable for view and JSON)
     * 
     * @return array
     */
    public function parse(): array
    {
        return $this->getCommonData();
    }
}

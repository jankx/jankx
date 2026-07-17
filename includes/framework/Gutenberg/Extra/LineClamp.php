<?php
/**
 * Line Clamp Block Extra
 *
 * PHP version 7.4
 *
 * @category Gutenberg
 * @package  Jankx\Gutenberg\Extra
 * @author   Jankx Team <team@jankx.com>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://jankx.com
 */

namespace Jankx\Gutenberg\Extra;

/**
 * Class LineClamp
 *
 * Minimal version - all filters removed.
 */
class LineClamp extends AbstractBlockExtra
{
    public function getTargetBlockName(): string
    {
        return 'global';
    }

    public function register(): void
    {
        // All filters removed
    }

    public function handle(string $block_content, array $block): string
    {
        return $block_content;
    }
}

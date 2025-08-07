<?php

namespace App\Services\Layouts;

use Jankx\Foundation\Application;

/**
 * Slideout Menu Layout Service
 *
 * Handles slideout menu functionality for mobile devices:
 *
 * - Mobile menu rendering
 * - Responsive breakpoints
 * - Animation controls
 * - Touch gestures
 * - Accessibility features
 * - Customizable triggers
 * - Device-specific behavior
 *
 * @package App\Services\Layouts
 * @since 2.0.0
 */
class SlideoutMenuLayoutService
{
    /**
     * Initialize the slideout menu service
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function init(Application $app)
    {
        add_action('wp', [$this, 'setupHooks']);
    }

    /**
     * Setup WordPress hooks for slideout menu
     *
     * @return void
     */
    public function setupHooks()
    {
        add_action('wp_body_open', [$this, 'renderSlideoutMenu']);
        add_action('wp_body_open', [$this, 'openNav'], 5);
        add_action('wp_body_open', [$this, 'closeNav'], 15);
        add_action('wp_body_open', [$this, 'openPanel'], 16);
        add_action('wp_footer', [$this, 'closePanel'], 999);
    }

    /**
     * Open navigation container
     *
     * @return void
     */
    public function openNav()
    {
        ?>
        <div class="slideoutNav">
        <?php
    }

    /**
     * Close navigation container
     *
     * @return void
     */
    public function closeNav()
    {
        ?>
        </div>
        <?php
    }

    /**
     * Render slideout menu content
     *
     * @return void
     */
    public function renderSlideoutMenu()
    {
        echo do_blocks('<!-- wp:template-part {"slug":"offcanvas"} /-->');
    }

    /**
     * Open panel container
     *
     * @return void
     */
    public function openPanel()
    {
        ?>
        <div class="slidePanel">
        <?php
    }

    /**
     * Close panel container
     *
     * @return void
     */
    public function closePanel()
    {
        ?>
        </div>
        <?php
    }
}
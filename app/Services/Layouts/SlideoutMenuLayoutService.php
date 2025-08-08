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
        add_action('wp_enqueue_scripts', [$this, 'enqueueSlideoutStyles']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueSlideoutScripts']);
        add_action('wp_head', [$this, 'addSlideoutStylesInline']);
    }

    /**
     * Open navigation container
     *
     * @return void
     */
    public function openNav()
    {
        ?>
        <div id="slideoutNav" class="slideoutNav slideout-menu">
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
        <div id="slideoutPanel" class="slideoutPanel slideout-panel">
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

    /**
     * Enqueue slideout menu styles
     *
     * @return void
     */
    public function enqueueSlideoutStyles()
    {
        // Add inline style to any existing style handle
        wp_add_inline_style('jankx-style', $this->getSlideoutCSS());

        // Also add to wp-block-library as fallback
        wp_add_inline_style('wp-block-library', $this->getSlideoutCSS());

        // Add to theme's main style as another fallback
        wp_add_inline_style('bookix-style', $this->getSlideoutCSS());
    }

    /**
     * Get slideout menu CSS
     *
     * @return string
     */
    private function getSlideoutCSS()
    {
        return '
body {
  width: 100%;
  height: 100%;
}

.slideoutNav {
  background: #fff;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 256px;
  min-height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 0;
  display: none;
  z-index: 10;
}

.slideoutNav-left {
  left: 0;
}

.slideoutNav-right {
  right: 0;
}

.slideoutPanel {
  position: relative;
  z-index: 1;
  will-change: transform;
  background-color: #FFF; /* A background-color is required */
  min-height: 100vh;
  overflow-x: hidden;
}

.slideout-open .slideoutNav {
  box-shadow: 4px 5px 5px 0px rgba(0,0,0,0.75);
    -webkit-box-shadow: 4px 5px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 4px 5px 5px 0px rgba(0,0,0,0.75);
}



body.admin-bar .slideoutNav {
    padding-top: 54px;
}

.slideout-open,
.slideout-open body,
.slideout-open .slideoutPanel {
  overflow: hidden;
}

.slideout-open .slideoutNav {
  display: block;
}';
    }

    /**
     * Enqueue slideout menu scripts
     *
     * @return void
     */
    public function enqueueSlideoutScripts()
    {
        $debug = defined('WP_DEBUG') && WP_DEBUG;
        $filename = $debug ? 'slideout.js' : 'slideout.min.js';

        wp_enqueue_script(
            'slideout-menu',
            get_template_directory_uri() . '/resources/assets/libs/slideout-1.0.1/' . $filename,
            [],
            '1.0.1',
            true
        );

        // Add inline script to initialize slideout
        wp_add_inline_script('slideout-menu', $this->getSlideoutInitScript());
    }

    /**
     * Get slideout initialization script
     *
     * @return string
     */
    private function getSlideoutInitScript()
    {
        return '
document.addEventListener("DOMContentLoaded", function() {
    // Check if elements exist
    var panel = document.getElementById("slideoutPanel");
    var menu = document.getElementById("slideoutNav");


    if (!panel || !menu) {
        return;
    }

    var slideout = new Slideout({
        "panel": panel,
        "menu": menu,
        "padding": 256,
        "tolerance": 70
    });

    // Add toggle button functionality
    var toggleButton = document.querySelector(".hamburger-toggle-menu");
    if (toggleButton) {
        toggleButton.addEventListener("click", function() {
            slideout.toggle();
        });
    }


    // Add toggle button functionality
    var toggleButtonOffCanvas = document.querySelector(".hamburger-toggle-menu-offcanvas");
    if (toggleButtonOffCanvas) {
        toggleButtonOffCanvas.addEventListener("click", function() {
            slideout.toggle();
        });
    }

    // Close slideout when clicking on menu items
    var menuItems = document.querySelectorAll(".slideoutNav a");
    menuItems.forEach(function(item) {
        item.addEventListener("click", function() {
            slideout.close();
        });
    });
});';
    }

    /**
     * Add slideout styles directly to wp_head
     *
     * @return void
     */
    public function addSlideoutStylesInline()
    {
        echo '<style type="text/css">' . $this->getSlideoutCSS() . '</style>';
    }

}
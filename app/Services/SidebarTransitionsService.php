<?php

namespace App\Services;

use Jankx\Foundation\Application;

/**
 * Sidebar Transitions Service
 *
 * @package App\Services
 */
class SidebarTransitionsService
{
    /**
     * Initialize service
     */
    public function init(Application $app)
    {
        add_action('wp', [$this, 'setupHooks']);
    }

    /**
     * Setup hooks
     */
    public function setupHooks()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
        add_action('wp_body_open', [$this, 'renderSidebar']);
    }

    /**
     * Enqueue CSS and JS
     */
    public function enqueueAssets()
    {
        // CSS
        wp_add_inline_style('jankx-style', $this->getCSS());
        wp_add_inline_style('wp-block-library', $this->getCSS());

        // JavaScript - Add to multiple handles to ensure it loads
        wp_add_inline_script('jankx-script', $this->getJS());
        wp_add_inline_script('wp-block-library', $this->getJS());
        wp_add_inline_script('jquery', $this->getJS());

        // Also add directly to head as fallback
        add_action('wp_head', [$this, 'addInlineScript']);
    }

    /**
     * Add inline script to head as fallback
     */
    public function addInlineScript()
    {
        echo '<script type="text/javascript">' . $this->getJS() . '</script>';
    }

    /**
     * Render sidebar HTML
     */
    public function renderSidebar()
    {
        ?>
        <div id="sidebar-transitions" class="sidebar-transitions slide-in-top">
            <!-- Sidebar -->
            <div id="sidebar" class="sidebar">
                <?php echo do_blocks('<!-- wp:template-part {"slug":"offcanvas"} /-->'); ?>
            </div>

            <!-- Overlay -->
            <div id="sidebar-overlay" class="sidebar-overlay"></div>
        </div>
        <?php
    }

    /**
     * Get CSS
     */
    private function getCSS()
    {
        return '
        .sidebar-transitions {
            position: relative;
        }

        .admin-bar #sidebar {
            padding-top: 54px;
        }

        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 300px;
            height: 100vh;
            background: #fff;
            z-index: 9999;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.7, 0, 0.3, 1);
            box-shadow: 2px 0 10px rgba(0,0,0,0.3);
        }

        .sidebar-content {
            padding: 2rem;
            color: #fff;
        }

        .sidebar-content h3 {
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
            color: #b8b7ad;
        }

        .sidebar-menu {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .sidebar-menu li {
            margin-bottom: 0.5rem;
        }

        .sidebar-menu a {
            color: #b8b7ad;
            text-decoration: none;
            font-size: 1.1rem;
            transition: color 0.3s ease;
            display: block;
            padding: 0.5rem 0;
        }

        .sidebar-menu a:hover {
            color: #c94e50;
        }

        .hamburger-toggle-menu,
        .hamburger-toggle-menu-offcanvas {
            cursor: pointer;
        }

        .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        /* Open state */
        .sidebar-transitions.sidebar-open .sidebar {
            transform: translateX(0);
        }

        .sidebar-transitions.sidebar-open .sidebar-overlay {
            opacity: 1;
            visibility: visible;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .sidebar {
                width: 280px;
            }
        }';
    }

    /**
     * Get JavaScript
     */
    private function getJS()
    {
        return '
        document.addEventListener("DOMContentLoaded", function() {

            const sidebar = document.getElementById("sidebar-transitions");
            const toggle = document.querySelector(".hamburger-toggle-menu");
            const overlay = document.getElementById("sidebar-overlay");

            if (!sidebar || !toggle || !overlay) {
                return;
            }

            let isOpen = false;

            function toggleSidebar() {
                isOpen = !isOpen;

                if (isOpen) {
                    sidebar.classList.add("sidebar-open");
                } else {
                    sidebar.classList.remove("sidebar-open");
                }
            }

            // Event listeners
            toggle.addEventListener("click", toggleSidebar);
            overlay.addEventListener("click", toggleSidebar);

            // Close sidebar when clicking on offcanvas toggle
            const offcanvasToggle = document.querySelector(".hamburger-toggle-menu-offcanvas");
            if (offcanvasToggle) {
                offcanvasToggle.addEventListener("click", function() {
                    if (isOpen) {
                        toggleSidebar();
                    }
                });
            }

            // Close on escape key
            document.addEventListener("keydown", function(e) {
                if (e.key === "Escape" && isOpen) {
                    toggleSidebar();
                }
            });
        });';
    }
}

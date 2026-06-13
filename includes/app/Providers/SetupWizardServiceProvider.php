<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class SetupWizardServiceProvider extends ServiceProvider
{
    protected $app;

    public function shouldLoadFrontend(): bool
    {
        return false;
    }

    public function register(Application $app)
    {
        $this->app = $app;
    }

    public function boot(Application $app)
    {
        add_action('admin_init', [$this, 'maybeRedirectToWizard']);
        add_action('admin_menu', [$this, 'registerWizardPage'], 5);
        add_action('admin_enqueue_scripts', [$this, 'enqueueWizardAssets']);
        add_action('wp_ajax_jankx_wizard_dismiss', [$this, 'ajaxDismissWizard']);
        add_action('wp_ajax_jankx_wizard_skip', [$this, 'ajaxSkipWizard']);
        add_action('wp_ajax_jankx_wizard_save_branding', [$this, 'ajaxSaveBranding']);
    }

    public function maybeRedirectToWizard()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        if (wp_doing_ajax() || is_network_admin()) {
            return;
        }

        $wizardDone = get_option('jankx_wizard_done', false);
        if ($wizardDone) {
            return;
        }

        if (get_option('jankx_wizard_skipped', false)) {
            return;
        }

        $currentPage = $_GET['page'] ?? '';
        if ($currentPage === 'jankx-setup-wizard') {
            return;
        }

        if (strpos($currentPage, 'jankx') !== false) {
            return;
        }

        $screen = get_current_screen();
        if (!$screen || $screen->id !== 'dashboard') {
            return;
        }

        wp_safe_redirect(admin_url('admin.php?page=jankx-setup-wizard'));
        exit;
    }

    public function registerWizardPage()
    {
        add_dashboard_page(
            __('Jankx Setup Wizard', 'jankx'),
            __('Setup Wizard', 'jankx'),
            'manage_options',
            'jankx-setup-wizard',
            [$this, 'renderWizardPage']
        );
    }

    public function enqueueWizardAssets($hook)
    {
        if (strpos($hook, 'jankx-setup-wizard') === false) {
            return;
        }

        $version = $this->app->make('jankx.version') ?? '2.0.0';

        wp_enqueue_style(
            'jankx-wizard',
            get_template_directory_uri() . '/resources/assets/css/setup-wizard.css',
            [],
            $version
        );

        wp_enqueue_script(
            'jankx-wizard',
            get_template_directory_uri() . '/resources/assets/js/setup-wizard.js',
            ['jquery'],
            $version,
            true
        );

        wp_localize_script('jankx-wizard', 'jankxWizard', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_wizard'),
            'demoImportUrl' => admin_url('admin.php?page=jankx-demo-import'),
            'themeOptionsUrl' => admin_url('admin.php?page=jankx-theme-options'),
            'customizerUrl' => admin_url('customize.php'),
            'strings' => [
                'importing' => __('Importing demo...', 'jankx'),
                'done' => __('Setup complete!', 'jankx'),
            ],
        ]);
    }

    public function renderWizardPage()
    {
        $step = absint($_GET['step'] ?? 1);
        $step = min(max($step, 1), 4);
        ?>
        <div class="jankx-wizard-wrap">
            <div class="jankx-wizard-header">
                <div class="jankx-wizard-brand">
                    <span class="dashicons dashicons-art"></span>
                    <h1><?php esc_html_e('Welcome to Jankx Framework', 'jankx'); ?></h1>
                </div>
                <p><?php esc_html_e('Get your site up and running in minutes.', 'jankx'); ?></p>
            </div>

            <div class="jankx-wizard-steps">
                <div class="jankx-wizard-step <?php echo $step >= 1 ? 'active' : ''; ?>">
                    <span class="step-number">1</span>
                    <span class="step-label"><?php esc_html_e('Welcome', 'jankx'); ?></span>
                </div>
                <div class="jankx-wizard-step <?php echo $step >= 2 ? 'active' : ''; ?>">
                    <span class="step-number">2</span>
                    <span class="step-label"><?php esc_html_e('Choose Demo', 'jankx'); ?></span>
                </div>
                <div class="jankx-wizard-step <?php echo $step >= 3 ? 'active' : ''; ?>">
                    <span class="step-number">3</span>
                    <span class="step-label"><?php esc_html_e('Branding', 'jankx'); ?></span>
                </div>
                <div class="jankx-wizard-step <?php echo $step >= 4 ? 'active' : ''; ?>">
                    <span class="step-number">4</span>
                    <span class="step-label"><?php esc_html_e('Done', 'jankx'); ?></span>
                </div>
            </div>

            <div class="jankx-wizard-content">
                <?php $this->renderStep($step); ?>
            </div>
        </div>
        <?php
    }

    protected function renderStep($step)
    {
        switch ($step) {
            case 1:
                $this->renderWelcomeStep();
                break;
            case 2:
                $this->renderDemoStep();
                break;
            case 3:
                $this->renderBrandingStep();
                break;
            case 4:
                $this->renderDoneStep();
                break;
        }
    }

    protected function renderWelcomeStep()
    {
        ?>
        <div class="jankx-wizard-card">
            <h2><?php esc_html_e('Welcome! Let\'s set up your site.', 'jankx'); ?></h2>
            <p><?php esc_html_e('Jankx Framework gives you everything you need to create a beautiful WordPress site. This quick setup wizard will help you:', 'jankx'); ?></p>
            <ul>
                <li><?php esc_html_e('Choose a pre-built demo to start with', 'jankx'); ?></li>
                <li><?php esc_html_e('Set up your logo and brand colors', 'jankx'); ?></li>
                <li><?php esc_html_e('Configure basic site settings', 'jankx'); ?></li>
            </ul>
            <p><?php esc_html_e('You can skip any step and customize later.', 'jankx'); ?></p>
            <div class="jankx-wizard-actions">
                <a href="<?php echo esc_url(admin_url('admin.php?page=jankx-setup-wizard&step=2')); ?>" class="button button-primary">
                    <?php esc_html_e('Let\'s Start', 'jankx'); ?>
                </a>
                <button class="button jankx-wizard-skip">
                    <?php esc_html_e('Skip Setup', 'jankx'); ?>
                </button>
            </div>
        </div>
        <?php
    }

    protected function renderDemoStep()
    {
        $demos = $this->getDemos();
        $activeDemo = get_option('jankx_active_demo', '');
        ?>
        <div class="jankx-wizard-card">
            <h2><?php esc_html_e('Choose a Demo', 'jankx'); ?></h2>
            <p><?php esc_html_e('Start with a pre-built design. You can customize everything later.', 'jankx'); ?></p>
            <div class="jankx-wizard-demo-grid">
                <?php foreach ($demos as $id => $demo) : ?>
                    <div class="jankx-wizard-demo-card <?php echo $activeDemo === $id ? 'active' : ''; ?>" data-demo="<?php echo esc_attr($id); ?>">
                        <h3><?php echo esc_html($demo['name']); ?></h3>
                        <p><?php echo esc_html($demo['description'] ?? ''); ?></p>
                        <div class="jankx-wizard-demo-tags">
                            <?php foreach (($demo['tags'] ?? []) as $tag) : ?>
                                <span><?php echo esc_html($tag); ?></span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="jankx-wizard-actions">
                <a href="<?php echo esc_url(admin_url('admin.php?page=jankx-setup-wizard&step=3')); ?>" class="button button-primary jankx-wizard-next">
                    <?php esc_html_e('Next Step', 'jankx'); ?>
                </a>
                <a href="<?php echo esc_url(admin_url('admin.php?page=jankx-setup-wizard&step=3')); ?>" class="button">
                    <?php esc_html_e('Skip — I\'ll choose later', 'jankx'); ?>
                </a>
            </div>
            <div class="jankx-wizard-import-status" style="display:none;"></div>
        </div>
        <?php
    }

    protected function renderBrandingStep()
    {
        ?>
        <div class="jankx-wizard-card">
            <h2><?php esc_html_e('Customize Your Brand', 'jankx'); ?></h2>
            <p><?php esc_html_e('Set up your site title, logo, and brand colors.', 'jankx'); ?></p>

            <table class="form-table">
                <tr>
                    <th><label for="jankx-wizard-site-title"><?php esc_html_e('Site Title', 'jankx'); ?></label></th>
                    <td>
                        <input type="text" id="jankx-wizard-site-title" class="regular-text" value="<?php echo esc_attr(get_option('blogname')); ?>">
                    </td>
                </tr>
                <tr>
                    <th><label for="jankx-wizard-tagline"><?php esc_html_e('Tagline', 'jankx'); ?></label></th>
                    <td>
                        <input type="text" id="jankx-wizard-tagline" class="regular-text" value="<?php echo esc_attr(get_option('blogdescription')); ?>">
                    </td>
                </tr>
                <tr>
                    <th><label for="jankx-wizard-primary-color"><?php esc_html_e('Primary Color', 'jankx'); ?></label></th>
                    <td>
                        <input type="color" id="jankx-wizard-primary-color" value="#ff5722">
                    </td>
                </tr>
            </table>

            <div class="jankx-wizard-actions">
                <a href="<?php echo esc_url(admin_url('admin.php?page=jankx-setup-wizard&step=4')); ?>" class="button button-primary jankx-wizard-save-branding">
                    <?php esc_html_e('Save & Continue', 'jankx'); ?>
                </a>
                <a href="<?php echo esc_url(admin_url('admin.php?page=jankx-setup-wizard&step=4')); ?>" class="button">
                    <?php esc_html_e('Skip', 'jankx'); ?>
                </a>
            </div>
        </div>
        <?php
    }

    protected function renderDoneStep()
    {
        update_option('jankx_wizard_done', true);
        ?>
        <div class="jankx-wizard-card">
            <div class="jankx-wizard-done-icon">
                <span class="dashicons dashicons-yes-alt"></span>
            </div>
            <h2><?php esc_html_e('You\'re All Set!', 'jankx'); ?></h2>
            <p><?php esc_html_e('Your Jankx site is ready. Here\'s what to do next:', 'jankx'); ?></p>
            <ul>
                <li>
                    <strong><?php esc_html_e('Edit your homepage', 'jankx'); ?></strong>
                    <a href="<?php echo esc_url(admin_url('post.php?post=' . get_option('page_on_front') . '&action=edit')); ?>">
                        <?php esc_html_e('Open in Block Editor', 'jankx'); ?>
                    </a>
                </li>
                <li>
                    <strong><?php esc_html_e('Customize colors & fonts', 'jankx'); ?></strong>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=jankx-theme-options')); ?>">
                        <?php esc_html_e('Theme Options', 'jankx'); ?>
                    </a>
                </li>
                <li>
                    <strong><?php esc_html_e('Add menus', 'jankx'); ?></strong>
                    <a href="<?php echo esc_url(admin_url('nav-menus.php')); ?>">
                        <?php esc_html_e('Manage Menus', 'jankx'); ?>
                    </a>
                </li>
                <li>
                    <strong><?php esc_html_e('Create pages with Gutenberg blocks', 'jankx'); ?></strong>
                    <a href="<?php echo esc_url(admin_url('post-new.php?post_type=page')); ?>">
                        <?php esc_html_e('New Page', 'jankx'); ?>
                    </a>
                </li>
            </ul>
            <div class="jankx-wizard-actions">
                <a href="<?php echo esc_url(admin_url('')); ?>" class="button button-primary">
                    <?php esc_html_e('Go to Dashboard', 'jankx'); ?>
                </a>
            </div>
        </div>
        <?php
    }

    public function ajaxDismissWizard()
    {
        check_ajax_referer('jankx_wizard', 'nonce');
        update_option('jankx_wizard_done', true);
        wp_send_json_success();
    }

    public function ajaxSkipWizard()
    {
        check_ajax_referer('jankx_wizard', 'nonce');
        update_option('jankx_wizard_skipped', true);
        wp_send_json_success();
    }

    public function ajaxSaveBranding()
    {
        check_ajax_referer('jankx_wizard', 'nonce');

        if (isset($_POST['site_title'])) {
            update_option('blogname', sanitize_text_field($_POST['site_title']));
        }
        if (isset($_POST['site_tagline'])) {
            update_option('blogdescription', sanitize_text_field($_POST['site_tagline']));
        }
        if (isset($_POST['primary_color'])) {
            $color = sanitize_hex_color($_POST['primary_color']);
            if ($color) {
                $options = get_option('jankx_options', []);
                $options['primary_color'] = $color;
                update_option('jankx_options', $options);
            }
        }

        wp_send_json_success(['message' => __('Settings saved!', 'jankx')]);
    }

    protected function getDemos(): array
    {
        $demos = apply_filters('jankx/demo/available', []);

        $manifestPath = get_template_directory() . '/demo/manifest.json';
        if (file_exists($manifestPath)) {
            $data = json_decode(file_get_contents($manifestPath), true);
            if (is_array($data)) {
                $demos = array_merge($demos, $data);
            }
        }

        return $demos;
    }
}

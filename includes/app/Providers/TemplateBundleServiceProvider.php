<?php

namespace App\Providers;

use App\Services\TemplateBundle\TemplateBundleManager;
use App\Services\TemplateBundle\TemplateBundleApplier;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class TemplateBundleServiceProvider extends ServiceProvider
{
    protected $app;

    public function shouldLoadFrontend(): bool
    {
        return false;
    }

    public function register(Application $app): void
    {
        $this->app = $app;

        $app->singleton('template-bundle.manager', function ($app) {
            return TemplateBundleManager::getInstance();
        });

        $app->bind('template-bundle.applier', function ($app) {
            return new TemplateBundleApplier(
                $app->make('template-bundle.manager')
            );
        });

        $app->alias('template-bundle.manager', TemplateBundleManager::class);
        $app->alias('template-bundle.applier', TemplateBundleApplier::class);
    }

    public function boot(Application $app): void
    {
        add_action('init', function () use ($app) {
            $this->bootServices($app);
        }, 20);

        add_action('wp_ajax_jankx_apply_template_bundle', [$this, 'ajaxApplyBundle']);
        add_action('wp_ajax_jankx_get_template_bundles', [$this, 'ajaxGetBundles']);
        add_action('wp_ajax_jankx_reset_template_bundle', [$this, 'ajaxResetBundle']);
    }

    protected function bootServices(Application $app): void
    {
        if (!$app->bound('template-bundle.manager')) {
            return;
        }

        $manager = $app->make('template-bundle.manager');
        $manager->loadBundles();
    }

    public function ajaxGetBundles(): void
    {
        check_ajax_referer('jankx_template_bundle', 'nonce');

        $manager = $this->app->make('template-bundle.manager');
        $bundles = $manager->getBundles();
        $activeBundle = $manager->getActiveBundleId();

        $data = [];
        foreach ($bundles as $id => $bundle) {
            $data[$id] = $bundle->toArray();
            $data[$id]['is_active'] = ($id === $activeBundle);
        }

        wp_send_json_success([
            'bundles' => $data,
            'active_bundle' => $activeBundle,
        ]);
    }

    public function ajaxApplyBundle(): void
    {
        check_ajax_referer('jankx_template_bundle', 'nonce');

        $bundleId = sanitize_text_field($_POST['bundle'] ?? '');

        if (empty($bundleId)) {
            wp_send_json_error(['message' => __('No bundle specified.', 'jankx')]);
            return;
        }

        try {
            $applier = $this->app->make('template-bundle.applier');
            $result = $applier->apply($bundleId);

            if ($result['success']) {
                wp_send_json_success($result);
            } else {
                wp_send_json_error($result);
            }
        } catch (\Throwable $e) {
            wp_send_json_error([
                'message' => sprintf(
                    __('Failed to apply bundle: %s', 'jankx'),
                    $e->getMessage()
                ),
            ]);
        }
    }

    public function ajaxResetBundle(): void
    {
        check_ajax_referer('jankx_template_bundle', 'nonce');

        try {
            $manager = $this->app->make('template-bundle.manager');
            $manager->resetActiveBundle();

            wp_send_json_success([
                'message' => __('Template bundle reset successfully.', 'jankx'),
            ]);
        } catch (\Throwable $e) {
            wp_send_json_error([
                'message' => sprintf(
                    __('Failed to reset bundle: %s', 'jankx'),
                    $e->getMessage()
                ),
            ]);
        }
    }
}

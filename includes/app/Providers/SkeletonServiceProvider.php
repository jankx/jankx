<?php

namespace App\Providers;

use App\Services\SkeletonService;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class SkeletonServiceProvider extends ServiceProvider
{
    protected $service;

    protected $app;


    public function register(Application $app)
    {
        $this->app = &$app;
        $app->singleton(SkeletonService::class, function($container) {
            $config = $container->make('config')->get('app');
            $skeletonUrl = isset($config['skeleton_url']) ? $config['skeleton_url'] : '';
            return new SkeletonService($skeletonUrl);
        });
    }




     public function boot(Application $app) {
        add_filter('body_class', function($classes){
            $classes[] = 'jankx-skeleton-active';
            return $classes;
        });
        add_action('wp_footer', [$this, 'renderSkeletonDiv'], 1);
        add_action('wp_head', [$this, 'injectSkeletonStyles'], 1);
        add_action('wp_footer', [$this, 'injectSkeletonScript'], 100);
     }


    public function renderSkeletonDiv()
    {
        $service = $this->app->make(SkeletonService::class);
        $url = $service->getSkeletonUrl();
        echo '<div id="jankx-skeleton-overlay-wrapper" style="position:fixed;z-index:99998;top:0;left:0;width:100vw;height:100vh;pointer-events:none;">';
        echo '<div id="jankx-skeleton-overlay" style="position:absolute;top:0;left:0;width:100vw;height:100vh;background:whitesmoke;display:flex;justify-content:center;transition:opacity 0.5s;">';
        if ($url) {
            echo '<div class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained">';
            echo '<img src="' . esc_url($url) . '" alt="Loading..." style="position:relative;top: 190px;">';
            echo '</div>';
        } else {
            echo '<div class="skeleton-default"></div>';
        }
        echo '</div>';
        echo '</div>';
    }

    public function injectSkeletonStyles()
    {
        echo '<style>
body{overflow:hidden !important;}
#jankx-skeleton-overlay{background:#f4f4f4;}
#jankx-skeleton-overlay-wrapper{pointer-events:none;}
.jankx-skeleton-active .wp-site-blocks > *:not(header.wp-block-template-part) {display:none !important;}
.jankx-skeleton-active header.wp-block-template-part {position:relative;z-index:100000;}
#jankx-skeleton-overlay-wrapper {top:0;left:0;width:100vw;height:100vh;z-index:99998;position:fixed;}
</style>';
    }

        public function injectSkeletonScript()
        {
                echo '<script>(function(){
    function hideSkeleton(){
        var s=document.getElementById("jankx-skeleton-overlay");
        if(s){
            s.style.opacity="0";
            s.parentNode&&s.parentNode.removeChild(s);
            document.body.style.overflow="";
            document.querySelector("body").classList.remove("jankx-skeleton-active");
        }
    }
    window.addEventListener("load",hideSkeleton);
})();</script>';
        }
}

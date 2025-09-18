<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class SkeletonServiceProvider extends ServiceProvider
{

    protected $app;


    public function register(Application $app)
    {
        $this->app = &$app;
    }


    public function boot(Application $app)
    {
        add_filter('body_class', function ($classes) {
            $classes[] = 'jankx-skeleton-active';
            return $classes;
        });
        add_action('wp_footer', [$this, 'renderSkeletonDiv'], 1);
        add_action('wp_head', [$this, 'injectSkeletonStyles'], 1);
        add_action('wp_footer', [$this, 'injectSkeletonScript'], 100);
    }


    public function renderSkeletonDiv()
    {
        ?>
        <div id="jankx-skeleton-overlay-wrapper"
            style="position:fixed;z-index:99998;top:0;left:0;width:100vw;height:100vh;pointer-events:none;">
            <div id="jankx-skeleton-overlay"
                style="position:absolute;top:0;left:0;width:100vw;height:100vh;background:whitesmoke;display:flex;justify-content:center;transition:opacity 0.5s;">
                <div class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained">
                    <svg width="1170" height="820" viewBox="0 0 1170 820" style="position: relative;top: 190px;" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect width="770" height="380" fill="#E8E8E8" />
                        <rect width="370" height="200" transform="translate(800)" fill="#E8E8E8" />
                        <rect width="70" height="70" transform="translate(0 420)" fill="#E8E8E8" />
                        <rect x="100" y="421" width="670" height="44" fill="#E8E8E8" />
                        <rect x="100" y="480" width="170" height="10" fill="#E8E8E8" />
                        <rect x="300" y="480" width="170" height="10" fill="#E8E8E8" />
                        <rect width="70" height="70" transform="translate(800 230)" fill="#E8E8E8" />
                        <rect x="900" y="231" width="270" height="44" fill="#E8E8E8" />
                        <rect x="900" y="290" width="124" height="10" fill="#E8E8E8" />
                        <rect x="1046" y="290" width="124" height="10" fill="#E8E8E8" />
                        <rect width="70" height="70" transform="translate(800 330)" fill="#E8E8E8" />
                        <rect x="900" y="331" width="270" height="44" fill="#E8E8E8" />
                        <rect x="900" y="390" width="124" height="10" fill="#E8E8E8" />
                        <rect x="1046" y="390" width="124" height="10" fill="#E8E8E8" />
                        <rect width="70" height="70" transform="translate(800 430)" fill="#E8E8E8" />
                        <rect x="900" y="431" width="270" height="44" fill="#E8E8E8" />
                        <rect x="900" y="490" width="124" height="10" fill="#E8E8E8" />
                        <rect x="1046" y="490" width="124" height="10" fill="#E8E8E8" />
                        <rect width="70" height="70" transform="translate(800 530)" fill="#E8E8E8" />
                        <rect x="900" y="531" width="270" height="44" fill="#E8E8E8" />
                        <rect x="900" y="590" width="124" height="10" fill="#E8E8E8" />
                        <rect x="1046" y="590" width="124" height="10" fill="#E8E8E8" />
                        <rect width="70" height="70" transform="translate(800 630)" fill="#E8E8E8" />
                        <rect x="900" y="631" width="270" height="44" fill="#E8E8E8" />
                        <rect x="900" y="690" width="124" height="10" fill="#E8E8E8" />
                        <rect x="1046" y="690" width="124" height="10" fill="#E8E8E8" />
                        <rect width="70" height="70" transform="translate(800 730)" fill="#E8E8E8" />
                        <rect x="900" y="731" width="270" height="44" fill="#E8E8E8" />
                        <rect x="900" y="790" width="124" height="10" fill="#E8E8E8" />
                        <rect x="1046" y="790" width="124" height="10" fill="#E8E8E8" />
                        <rect width="70" height="70" transform="translate(0 530)" fill="#E8E8E8" />
                        <rect x="100" y="531" width="670" height="44" fill="#E8E8E8" />
                        <rect x="100" y="590" width="170" height="10" fill="#E8E8E8" />
                        <rect x="300" y="590" width="170" height="10" fill="#E8E8E8" />
                        <rect width="70" height="70" transform="translate(0 640)" fill="#E8E8E8" />
                        <rect x="100" y="641" width="670" height="44" fill="#E8E8E8" />
                        <rect x="100" y="700" width="170" height="10" fill="#E8E8E8" />
                        <rect x="300" y="700" width="170" height="10" fill="#E8E8E8" />
                        <rect width="70" height="70" transform="translate(0 750)" fill="#E8E8E8" />
                        <rect x="100" y="751" width="670" height="44" fill="#E8E8E8" />
                        <rect x="100" y="810" width="170" height="10" fill="#E8E8E8" />
                        <rect x="300" y="810" width="170" height="10" fill="#E8E8E8" />
                    </svg>
                </div>

            </div>
        </div>
        <?php

    }

    public function injectSkeletonStyles()
    {
        echo '<style>
body.jankx-skeleton-active{overflow:hidden !important;}
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

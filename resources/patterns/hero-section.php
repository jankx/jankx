<!-- wp:group {"style":{"spacing":{"padding":{"top":"120px","bottom":"120px"}},"position":{"type":"sticky","top":"0px"}},"backgroundColor":"gradient-primary","className":"hero-section-modern"} -->
<div class="wp-block-group hero-section-modern has-gradient-primary-background-color has-background" style="padding-top:120px;padding-bottom:120px">

    <!-- wp:group {"className":"hero-container","layout":{"type":"constrained"}} -->
    <div class="wp-block-group hero-container">

        <!-- wp:columns {"className":"hero-content"} -->
        <div class="wp-block-columns hero-content">

            <!-- wp:column {"width":"60%","className":"hero-text"} -->
            <div class="wp-block-column hero-text" style="flex-basis:60%">

                <!-- wp:heading {"level":1,"className":"hero-title animated-fade-in"} -->
                <h1 class="wp-block-heading hero-title animated-fade-in"><?= $title ?></h1>
                <!-- /wp:heading -->

                <!-- wp:paragraph {"className":"hero-subtitle animated-slide-up"} -->
                <p class="hero-subtitle animated-slide-up"><?= $subtitle ?></p>
                <!-- /wp:paragraph -->

                <!-- wp:buttons {"className":"hero-actions animated-bounce-in"} -->
                <div class="wp-block-buttons hero-actions animated-bounce-in">
                    <!-- wp:button {"className":"<?= $primary_button['class'] ?>"} -->
                    <div class="wp-block-button <?= $primary_button['class'] ?>">
                        <a class="wp-block-button__link wp-element-button" href="<?= $primary_button['url'] ?>"><?= $primary_button['text'] ?></a>
                    </div>
                    <!-- /wp:button -->

                    <!-- wp:button {"className":"<?= $secondary_button['class'] ?>"} -->
                    <div class="wp-block-button <?= $secondary_button['class'] ?>">
                        <a class="wp-block-button__link wp-element-button" href="<?= $secondary_button['url'] ?>"><?= $secondary_button['text'] ?></a>
                    </div>
                    <!-- /wp:button -->
                </div>
                <!-- /wp:buttons -->

            </div>
            <!-- /wp:column -->

            <!-- wp:column {"width":"40%","className":"hero-visual"} -->
            <div class="wp-block-column hero-visual" style="flex-basis:40%">

                <!-- wp:group {"className":"floating-elements"} -->
                <div class="wp-block-group floating-elements">

                    <!-- wp:image {"id":123,"sizeSlug":"large","className":"hero-image floating-card"} -->
                    <figure class="wp-block-image size-large hero-image floating-card">
                        <?= $this->image($hero_image, 'Hero Image') ?>
                    </figure>
                    <!-- /wp:image -->

                    <?php if (!empty($stats)) : ?>
                    <!-- wp:group {"className":"floating-stats"} -->
                    <div class="wp-block-group floating-stats">
                        <?php foreach ($stats as $stat) : ?>
                        <!-- wp:group {"className":"stat-item"} -->
                        <div class="wp-block-group stat-item">
                            <!-- wp:heading {"level":3,"className":"stat-number"} -->
                            <h3 class="wp-block-heading stat-number"><?= $stat['number'] ?></h3>
                            <!-- /wp:heading -->
                            <!-- wp:paragraph {"className":"stat-label"} -->
                            <p class="stat-label"><?= $stat['label'] ?></p>
                            <!-- /wp:paragraph -->
                        </div>
                        <!-- /wp:group -->
                        <?php endforeach; ?>
                    </div>
                    <!-- /wp:group -->
                    <?php endif; ?>

                </div>
                <!-- /wp:group -->

            </div>
            <!-- /wp:column -->

        </div>
        <!-- /wp:columns -->

    </div>
    <!-- /wp:group -->

    <?php if ($background_shapes) : ?>
    <!-- wp:group {"className":"hero-background-elements"} -->
    <div class="wp-block-group hero-background-elements">
        <!-- wp:html -->
        <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
        </div>
        <!-- /wp:html -->
    </div>
    <!-- /wp:group -->
    <?php endif; ?>

</div>
<!-- /wp:group -->

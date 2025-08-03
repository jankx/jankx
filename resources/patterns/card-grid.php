<!-- wp:group {"className":"card-grid-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group card-grid-section">

    <!-- wp:group {"className":"section-header","layout":{"type":"constrained"}} -->
    <div class="wp-block-group section-header">

        <!-- wp:heading {"level":2,"className":"section-title text-center"} -->
        <h2 class="wp-block-heading section-title text-center"><?= $title ?></h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"className":"section-subtitle text-center"} -->
        <p class="section-subtitle text-center"><?= $subtitle ?></p>
        <!-- /wp:paragraph -->

    </div>
    <!-- /wp:group -->

    <!-- wp:columns {"className":"card-grid","style":{"spacing":{"blockGap":{"top":"2rem","left":"2rem"}}}} -->
    <div class="wp-block-columns card-grid" style="--wp--style--block-gap-top:2rem;--wp--style--block-gap-left:2rem">

        <?php foreach ($cards as $card) : ?>
        <!-- wp:column {"className":"card-column"} -->
        <div class="wp-block-column card-column">

            <!-- wp:group {"className":"card-item card-<?= $card['color'] ?> <?= $hover_effects ? 'card-hover' : '' ?> <?= $animation ? 'card-animated' : '' ?>"} -->
            <div class="wp-block-group card-item card-<?= $card['color'] ?> <?= $hover_effects ? 'card-hover' : '' ?> <?= $animation ? 'card-animated' : '' ?>">

                <?php if ($show_images && !empty($card['image'])) : ?>
                <!-- wp:image {"id":123,"sizeSlug":"medium","className":"card-image"} -->
                <figure class="wp-block-image size-medium card-image">
                    <?= $this->image($card['image'], $card['title']) ?>
                </figure>
                <!-- /wp:image -->
                <?php endif; ?>

                <!-- wp:group {"className":"card-content"} -->
                <div class="wp-block-group card-content">

                    <!-- wp:group {"className":"card-icon"} -->
                    <div class="wp-block-group card-icon">
                        <?= $this->icon($card['icon'], 'icon-large') ?>
                    </div>
                    <!-- /wp:group -->

                    <!-- wp:heading {"level":3,"className":"card-title"} -->
                    <h3 class="wp-block-heading card-title"><?= $card['title'] ?></h3>
                    <!-- /wp:heading -->

                    <!-- wp:paragraph {"className":"card-description"} -->
                    <p class="card-description"><?= $card['description'] ?></p>
                    <!-- /wp:paragraph -->

                    <!-- wp:buttons {"className":"card-actions"} -->
                    <div class="wp-block-buttons card-actions">
                        <!-- wp:button {"className":"btn-card"} -->
                        <div class="wp-block-button btn-card">
                            <a class="wp-block-button__link wp-element-button" href="<?= $card['link'] ?>">Learn More</a>
                        </div>
                        <!-- /wp:button -->
                    </div>
                    <!-- /wp:buttons -->

                </div>
                <!-- /wp:group -->

            </div>
            <!-- /wp:group -->

        </div>
        <!-- /wp:column -->
        <?php endforeach; ?>

    </div>
    <!-- /wp:columns -->

</div>
<!-- /wp:group -->

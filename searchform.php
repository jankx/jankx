<form action="/" method="get" class="quick-search-form">
    <div class="text-wrap">
        <span class="screen-reader-text"><?php echo _x( 'Search for:', 'label' ) ?></span>
        <input type="text" name="s" id="search" value="<?php the_search_query(); ?>"  placeholder="<?php echo esc_attr(__('Enter your keyword', 'jankx')); ?>" />
    </div>
    <button class="search-button">
        <?php echo esc_html(__('Search')); ?>
    </button>
</form>
<div class="quick-search-content"></div>

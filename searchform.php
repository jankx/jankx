<form action="/" method="get" class="quick-search-form">
    <div class="text-wrap">
        <span class="screen-reader-text"><?php echo _x( 'Search for:', 'label' ) ?></span>
        <input type="text" name="s" id="search" value="<?php the_search_query(); ?>"  placeholder="Bạn tìm gì..." />
    </div>
    <button class="search-button">
        <span class="dmx-icon-search"></span>
    </button>
    <input type="hidden" name="post_type" value="product">
</form>
<div class="quick-search-content"></div>

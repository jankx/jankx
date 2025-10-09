<?php
    $pagination_links = paginate_links($args);
    if (empty($pagination_links)) {
        return;
    }
?>

<nav class="jankx-pagination" aria-label="<?php echo esc_attr__('Posts navigation', 'jankx'); ?>">'
    <?php echo $pagination_links; ?>
</nav>


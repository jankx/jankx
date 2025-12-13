<?php

$meta_key = isset($attributes['metaKey']) ? $attributes['metaKey'] : '_price';
$custom_meta_key = isset($attributes['customMetaKey']) ? $attributes['customMetaKey'] : '';
$currency_symbol = isset($attributes['currencySymbol']) ? $attributes['currencySymbol'] : 'đ';

if ($meta_key === 'custom' && !empty($custom_meta_key)) {
    $meta_key = $custom_meta_key;
}

$post_id = get_the_ID();
$raw_price = '';
if ($post_id && $meta_key) {
    $raw_price = get_post_meta($post_id, $meta_key, true);
}

$price_number = 0;
if (is_numeric($raw_price)) {
    $price_number = floatval($raw_price);
}

$formatted_price = $raw_price;
if ($price_number > 0) {
    $formatted_price = number_format($price_number, 0, '.', '.');
}

?>
<div class="jankx-custom-price">
    <span class="price-amount"><?php echo esc_html($formatted_price); ?></span>
    <span class="currency-symbol"><?php echo esc_html($currency_symbol); ?></span>
    <?php if (empty($formatted_price)) : ?>
        <span class="price-empty" style="display:none"></span>
    <?php endif; ?>
</div>


<?php

$meta_key = isset($attributes['metaKey']) ? $attributes['metaKey'] : '_price';
$custom_meta_key = isset($attributes['customMetaKey']) ? $attributes['customMetaKey'] : '';
$max_meta_key = isset($attributes['maxPriceMetaKey']) ? $attributes['maxPriceMetaKey'] : 'none';
$max_custom_meta_key = isset($attributes['maxPriceCustomMetaKey']) ? $attributes['maxPriceCustomMetaKey'] : '';
$currency_symbol = isset($attributes['currencySymbol']) ? $attributes['currencySymbol'] : 'đ';
$empty_text = isset($attributes['emptyText']) ? $attributes['emptyText'] : 'Liên hệ';
$number_format = isset($attributes['numberFormat']) ? $attributes['numberFormat'] : 'vi-VN';

if ($meta_key === 'custom' && !empty($custom_meta_key)) {
    $meta_key = $custom_meta_key;
}
if ($max_meta_key === 'custom' && !empty($max_custom_meta_key)) {
    $max_meta_key = $max_custom_meta_key;
}

$post_id = get_the_ID();
$raw_price = '';
$raw_price_max = '';
if ($post_id && $meta_key) {
    $raw_price = get_post_meta($post_id, $meta_key, true);
}
if ($post_id && $max_meta_key && $max_meta_key !== 'none') {
    $raw_price_max = get_post_meta($post_id, $max_meta_key, true);
}

$price_number = 0;
$price_max_number = 0;
if (is_numeric($raw_price)) {
    $price_number = floatval($raw_price);
}
if (is_numeric($raw_price_max)) {
    $price_max_number = floatval($raw_price_max);
}

$formatted_price = '';
$formatted_price_max = '';
if ($price_number > 0) {
    if ($number_format === 'en-US') {
        $formatted_price = number_format($price_number, 0, '.', ',');
    } else { // vi-VN default
        $formatted_price = number_format($price_number, 0, ',', '.');
    }
}
if ($price_max_number > 0) {
    if ($number_format === 'en-US') {
        $formatted_price_max = number_format($price_max_number, 0, '.', ',');
    } else { // vi-VN default
        $formatted_price_max = number_format($price_max_number, 0, ',', '.');
    }
}

?>
<?php $wrapper_attrs = get_block_wrapper_attributes([ 'class' => 'jankx-custom-price' ]); ?>
<div <?php echo $wrapper_attrs; ?>>
    <span class="price-amount">
        <?php
        if ($formatted_price === '') {
            echo esc_html($empty_text);
        } else {
            if ($formatted_price_max !== '' && $price_max_number >= $price_number) {
                echo esc_html($formatted_price . ' - ' . $formatted_price_max);
            } else {
                echo esc_html($formatted_price);
            }
        }
        ?>
    </span>
    <?php if ($formatted_price !== '') : ?>
        <span class="currency-symbol"><?php echo esc_html($currency_symbol); ?></span>
    <?php endif; ?>
</div>

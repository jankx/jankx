<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}
/**
 * This is a part of Jankx Framework
 *
 * PLEASE DON'T MODIFY THIS FILE
 *
 * @package Jankx/Framework
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @since 1.0.0
 */

/**
 * Load header template via Jankx Template Engine
 *
 * Site header can be modified via feature override templates of WordPress
 * so please don't modify this file to ensure Jankx Framework working is exactly.
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="<?php echo isset($html_class) ? implode(' ', (array) $html_class) : 'no-js'; ?>">
<head>
	<meta charset="<?php bloginfo('charset'); ?>" />
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php
echo do_blocks('<!-- wp:template-part {"slug":"header"} /-->');
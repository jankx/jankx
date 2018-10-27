<?php
/**
 * Foxy header template
 *
 * @package Foxy/Template
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @license GPL
 * @license https://wpclouds.com
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?php wp_title(); ?></title>
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php
do_action( 'foxy_before_header' );
	do_action( 'foxy_header' );
do_action( 'foxy_after_header' );

do_action( 'foxy_before_main_content' );

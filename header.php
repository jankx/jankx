<?php
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

jankx_template(
	'header',
	apply_filters(
		'jankx_template_header_data',
		[
			'current_user' => wp_get_current_user(),
		]
	)
);

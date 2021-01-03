<?php
/**
 * This is a part of Jankx Framework
 *
 * PLEASE DON'T MODIFY THIS FILE
 *
 * @package Jankx/Template
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @since 1.0.0
 */

if ( post_password_required() || empty( $comments ) ) {
	return;
}

$comments_number    = absint( get_comments_number() );
$list_comments_args = array(
	'walker'      => new \Jankx\Walker\Comment(),
	'avatar_size' => 120,
	'style'       => 'div',
);
$comment_pagination = paginate_comments_links(
	array(
		'echo'      => false,
		'end_size'  => 0,
		'mid_size'  => 0,
		'next_text' => __( 'Newer Comments', 'jankx' ) . ' <span aria-hidden="true">&rarr;</span>',
		'prev_text' => '<span aria-hidden="true">&larr;</span> ' . __( 'Older Comments', 'jankx' ),
	)
);


if ( ! have_comments() ) {
	$comment_reply_title = __( 'Leave a comment', 'jankx' );
} elseif ( 1 === $comments_number ) {
	/* translators: %s: Post title. */
	$comment_reply_title = sprintf( _x( 'One reply on &ldquo;%s&rdquo;', 'comments title', 'jankx' ), get_the_title() );
} else {
	$comment_reply_title = sprintf(
		/* translators: 1: Number of comments, 2: Post title. */
		_nx(
			'%1$s reply on &ldquo;%2$s&rdquo;',
			'%1$s replies on &ldquo;%2$s&rdquo;',
			$comments_number,
			'comments title',
			'jankx'
		),
		number_format_i18n( $comments_number ),
		get_the_title()
	);
}

jankx_template(
	'comments',
	compact(
		'comments',
		'comments_number',
		'list_comments_args',
		'comment_pagination',
		'comment_reply_title'
	)
);

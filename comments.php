<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}
/**
 * This is a part of Jankx Framework
 *
 * PLEASE DON'T MODIFY THIS FILE
 *
 * @package Jankx/Template
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @since 1.0.0
 */

do_action( 'jankx_template_before_list_comments', $comments );
if ( post_password_required() || empty( $comments ) ) {
	do_action( 'jankx_template_after_list_comments', $comments );
	return;
}

$comments_number    = absint( get_comments_number() );
$list_comments_args = array(
	'walker'      => new \Jankx\Walker\CommentWalker(),
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


jankx_template(
	'comment/template',
	array(
		'comments'            => $comments,
		'list_comments_args'  => $list_comments_args,
		'comment_pagination'  => $comment_pagination,
		'comment_reply_title' => jankx_template(
			'comment/reply-title',
			compact( 'comments_number' ),
			null,
			false
		),
	)
);
do_action( 'jankx_template_after_list_comments', $comments );

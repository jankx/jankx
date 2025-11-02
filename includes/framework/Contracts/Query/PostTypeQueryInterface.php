<?php

/**
 * Post Type Query Interface
 *
 * Contract specific cho post type queries
 *
 * @package Jankx\Contracts\Query
 * @since 1.0.0
 */

namespace Jankx\Contracts\Query;

interface PostTypeQueryInterface extends QueryBuilderInterface
{
    /**
     * Set post type
     *
     * @param string|array $post_type
     * @return self
     */
    public function setPostType($post_type): self;

    /**
     * Set posts per page
     *
     * @param int $per_page
     * @return self
     */
    public function setPerPage(int $per_page): self;

    /**
     * Set order by
     *
     * @param string $orderby
     * @return self
     */
    public function setOrderBy(string $orderby): self;

    /**
     * Set order direction
     *
     * @param string $order
     * @return self
     */
    public function setOrder(string $order): self;

    /**
     * Set pagination
     *
     * @param int $paged
     * @return self
     */
    public function setPaged(int $paged): self;

    /**
     * Set offset
     *
     * @param int $offset
     * @return self
     */
    public function setOffset(int $offset): self;

    /**
     * Set post__in
     *
     * @param array $post__in
     * @return self
     */
    public function setPostIn(array $post__in): self;

    /**
     * Set post__not_in
     *
     * @param array $post__not_in
     * @return self
     */
    public function setPostNotIn(array $post__not_in): self;

    /**
     * Set author
     *
     * @param int|array $author
     * @return self
     */
    public function setAuthor($author): self;
}


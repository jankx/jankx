<?php
namespace Jankx\Contracts;

interface BlockInterface {

    /**
     * Register the block
     *
     * This method should be implemented by child classes to handle
     * the specific registration logic for each block type.
     *
     * @return void
     */
    public function register();


    /**
     * Render the block content
     *
     * This method should be implemented by child classes to handle
     * the specific rendering logic for each block type.
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '');

}

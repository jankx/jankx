<?php
namespace Jankx\Contracts;

interface BlockInterface {

    /**
     * Parse the block.json file to extract metadata and assets information
     *
     * This method reads and parses the block.json file to extract:
     * - Block metadata (name, title, description, category, etc.)
     * - Script and style assets URLs
     * - Editor and frontend dependencies
     * - Block attributes and supports configuration
     *
     * The parsed data is typically used to configure the block's
     * registration and asset loading in WordPress.
     *
     * @return self Returns the current instance for method chaining
     */
    public function parseBlockJson(): self;

    /**
     * Set the editor script URL for the block
     *
     * @param string|null $url The URL to the editor script file
     * @return self Returns the current instance for method chaining
     */
    public function setEditorScriptUrl(?string $url) : self;

    /**
     * Get the editor script URL for the block
     *
     * @return string|null The URL to the editor script file or null if not set
     */
    public function getEditorScriptUrl(): ? string;

    /**
     * Set the frontend script URL for the block
     *
     * @param string|null $url The URL to the frontend script file
     * @return self Returns the current instance for method chaining
     */
    public function setScriptUrl(?string $url) : self;

    /**
     * Get the frontend script URL for the block
     *
     * @return string|null The URL to the frontend script file or null if not set
     */
    public function getScriptUrl(): ? string;

    /**
     * Set the view script URL for the block
     *
     * @param string|null $url The URL to the view script file
     * @return self Returns the current instance for method chaining
     */
    public function setViewScriptUrl(?string $url) : self;

    /**
     * Get the view script URL for the block
     *
     * @return string|null The URL to the view script file or null if not set
     */
    public function getViewScriptUrl(): ? string;

    /**
     * Set the editor style URL for the block
     *
     * @param string|null $url The URL to the editor style file
     * @return self Returns the current instance for method chaining
     */
    public function setEditorStyleUrl(?string $url) : self;

    /**
     * Get the editor style URL for the block
     *
     * @return string|null The URL to the editor style file or null if not set
     */
    public function getEditorStyleUrl(): ? string;

    /**
     * Set the frontend style URL for the block
     *
     * @param string|null $url The URL to the frontend style file
     * @return self Returns the current instance for method chaining
     */
    public function setStyleUrl(?string $url) : self;

    /**
     * Get the frontend style URL for the block
     *
     * @return string|null The URL to the frontend style file or null if not set
     */
    public function getStyleUrl(): ? string;

    /**
     * Set the view style URL for the block
     *
     * @param string|null $url The URL to the view style file
     * @return self Returns the current instance for method chaining
     */
    public function setViewStyleUrl(?string $url) : self;

    /**
     * Get the view style URL for the block
     *
     * @return string|null The URL to the view style file or null if not set
     */
    public function getViewStyleUrl(): ? string;

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
     * Register the block to the Gutenberg editor by enqueuing the editor.js script
     *
     * This method handles the registration of the block's editor script
     * to ensure it's properly loaded in the Gutenberg editor environment.
     * It typically enqueues the editor.js file that contains the block's
     * editor-specific functionality and React components.
     *
     * @return self Returns the current instance for method chaining
     */
    public function registerBlockToEditor(): self;


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

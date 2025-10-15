<?php

namespace Jankx\Features\ContentTemplates\Services;

class ContentTemplateService
{
    /**
     * Find template file in child theme first, then parent theme
     *
     * @param string $postType
     * @return string|false
     */
    protected function findTemplateFile($postType)
    {
        $templateName = sanitize_file_name($postType) . '.html';
        $paths = [];

        // Check child theme first (priority)
        if (is_child_theme()) {
            $paths[] = get_stylesheet_directory() . '/resources/content-templates/' . $templateName;
        }

        // Check parent theme
        $paths[] = get_template_directory() . '/resources/content-templates/' . $templateName;

        foreach ($paths as $path) {
            if (file_exists($path)) {
                return $path;
            }
        }

        return false;
    }

    /**
     * Load template content
     *
     * @param string $templatePath
     * @return string
     */
    protected function loadTemplateContent($templatePath)
    {
        if (!file_exists($templatePath)) {
            return '';
        }

        return file_get_contents($templatePath);
    }

    /**
     * Filter default content for new post
     *
     * @param string $content Default post content
     * @param WP_Post $post Post object
     * @return string
     */
    public function filterDefaultContent($content, $post)
    {
        // Only apply if content is empty
        if (!empty($content)) {
            return $content;
        }

        // Find template file
        $templatePath = $this->findTemplateFile($post->post_type);

        if (!$templatePath) {
            return $content;
        }

        // Load template content
        $templateContent = $this->loadTemplateContent($templatePath);

        if (!empty($templateContent)) {
            return $templateContent;
        }

        return $content;
    }

    /**
     * Set default content for auto-draft post when it's first created
     *
     * @param int $postId
     * @param WP_Post $post
     * @param bool $update
     */
    public function setDefaultContent($postId, $post, $update)
    {
        // Only for new posts (not updates)
        if ($update) {
            return;
        }

        // Check if this is an autosave or revision
        if (wp_is_post_autosave($postId) || wp_is_post_revision($postId)) {
            return;
        }

        // Only for auto-draft status
        if ($post->post_status !== 'auto-draft') {
            return;
        }

        // Only set content if post is empty
        if (!empty($post->post_content)) {
            return;
        }

        // Find template file
        $templatePath = $this->findTemplateFile($post->post_type);

        if (!$templatePath) {
            return;
        }

        // Load template content
        $templateContent = $this->loadTemplateContent($templatePath);

        if (empty($templateContent)) {
            return;
        }

        // Update post content directly in database to avoid infinite loop
        global $wpdb;
        $wpdb->update(
            $wpdb->posts,
            ['post_content' => $templateContent],
            ['ID' => $postId],
            ['%s'],
            ['%d']
        );

        // Clear cache
        clean_post_cache($postId);
    }

    /**
     * Initialize hooks
     */
    public function init()
    {
        // Filter default content when creating new post
        add_filter('default_content', [$this, 'filterDefaultContent'], 10, 2);

        // Hook into wp_insert_post to set default content for auto-draft posts
        add_action('wp_insert_post', [$this, 'setDefaultContent'], 10, 3);
    }
}


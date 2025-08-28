<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class WplyrMediaBlock extends Block
{
    public function __construct()
    {
        parent::__construct('jankx/wplyr-media', [
            'title' => __('WPlyr Media Player', 'jankx'),
            'category' => 'media',
            'icon' => 'video-alt3',
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full'],
                'color' => [
                    'background' => true,
                    'text' => true,
                ],
                'spacing' => [
                    'margin' => true,
                    'padding' => true,
                ],
            ],
        ]);
    }

    public function register()
    {
        $block_json = $this->getBlockJson();
        if (!$block_json) {
            return;
        }
        $this->prioritizeBuildAssets($block_json);
        $this->registerBlockWithMetadata($block_json);

        // Enqueue Plyr library only on frontend
        add_action('wp_enqueue_scripts', [$this, 'enqueue_plyr_assets']);

        // Debug: Log block registration
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('WPlyr Media Block registered with metadata: ' . print_r($block_json, true));
        }
    }

    public function enqueue_plyr_assets()
    {
        // Enqueue Plyr CSS
        wp_enqueue_style(
            'plyr-css',
            'https://cdn.plyr.io/3.7.8/plyr.css',
            [],
            '3.7.8'
        );

        // Enqueue Plyr JS
        wp_enqueue_script(
            'plyr-js',
            'https://cdn.plyr.io/3.7.8/plyr.js',
            [],
            '3.7.8',
            true
        );
    }

    public function enqueueBlockAssets()
    {
        parent::enqueueBlockAssets();

        // Re-enqueue view script with Plyr dependency on frontend only
        if (!is_admin()) {
            $blockPath = $this->getBlockPath();
            if ($blockPath) {
                $viewScriptPath = $blockPath . '/build/view.js';
                if (file_exists($viewScriptPath)) {
                    wp_enqueue_script(
                        $this->name . '-view',
                        get_template_directory_uri() . '/resources/blocks/wplyr-media/build/view.js',
                        ['plyr-js'],
                        filemtime($viewScriptPath),
                        true
                    );
                }
            }
        }
    }


    public function render($attributes, $content = '')
    {
        $defaults = [
            'mediaType' => 'video',
            'mediaUrl' => '',
            'mediaOptions' => [],
            'videoPoster' => null,
            'videoCaptions' => [],
            'audioPoster' => null,
            'youtubeUrl' => '',
            'vimeoUrl' => '',
            'playerColor' => '#fca311',
            'controls' => ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
            'settings' => ['captions', 'quality', 'speed'],
            'seekTime' => 10,
        ];
        $attributes = wp_parse_args($attributes, $defaults);

        // Build data attributes for JavaScript
        $data_attributes = [
            'data-media-type' => $attributes['mediaType'],
            'data-controls' => json_encode($attributes['controls']),
            'data-settings' => json_encode($attributes['settings']),
            'data-seek-time' => $attributes['seekTime'],
        ];

        if ($attributes['mediaType'] === 'youtube' && $attributes['youtubeUrl']) {
            $data_attributes['data-youtube-url'] = $attributes['youtubeUrl'];
        }

        if ($attributes['mediaType'] === 'vimeo' && $attributes['vimeoUrl']) {
            $data_attributes['data-vimeo-url'] = $attributes['vimeoUrl'];
        }

        $data_attr_string = '';
        foreach ($data_attributes as $key => $value) {
            $data_attr_string .= ' ' . $key . '="' . esc_attr($value) . '"';
        }

        ob_start();
        ?>
        <div class="jankx-wplyr-player" style="--plyr-color: <?php echo esc_attr($attributes['playerColor']); ?>"<?php echo $data_attr_string; ?>>
            <div class="jankx-wplyr-container">
                <?php if ($attributes['mediaType'] === 'video' && $attributes['mediaUrl']) : ?>
                    <video
                        <?php echo in_array('muted', $attributes['mediaOptions']) ? 'muted' : ''; ?>
                        <?php echo in_array('loop', $attributes['mediaOptions']) ? 'loop' : ''; ?>
                        <?php echo in_array('autoplay', $attributes['mediaOptions']) ? 'autoplay' : ''; ?>
                        <?php echo $attributes['videoPoster'] ? 'poster="' . esc_url($attributes['videoPoster']['url']) . '"' : ''; ?>
                    >
                        <source src="<?php echo esc_url($attributes['mediaUrl']); ?>" type="video/mp4">
                        <?php foreach ($attributes['videoCaptions'] as $caption) : ?>
                            <track
                                kind="captions"
                                src="<?php echo esc_url($caption['url']); ?>"
                                srclang="en"
                                label="English"
                            >
                        <?php endforeach; ?>
                        <?php _e('Your browser does not support the video tag.', 'jankx'); ?>
                    </video>
                <?php elseif ($attributes['mediaType'] === 'audio' && $attributes['mediaUrl']) : ?>
                    <audio
                        <?php echo in_array('muted', $attributes['mediaOptions']) ? 'muted' : ''; ?>
                        <?php echo in_array('loop', $attributes['mediaOptions']) ? 'loop' : ''; ?>
                        <?php echo in_array('autoplay', $attributes['mediaOptions']) ? 'autoplay' : ''; ?>
                    >
                        <source src="<?php echo esc_url($attributes['mediaUrl']); ?>" type="audio/mpeg">
                        <?php _e('Your browser does not support the audio tag.', 'jankx'); ?>
                    </audio>
                <?php elseif ($attributes['mediaType'] === 'youtube' && $attributes['youtubeUrl']) : ?>
                    <div class="jankx-youtube-container">
                        <!-- YouTube iframe will be inserted by JavaScript -->
                    </div>
                <?php elseif ($attributes['mediaType'] === 'vimeo' && $attributes['vimeoUrl']) : ?>
                    <div class="jankx-vimeo-container">
                        <!-- Vimeo iframe will be inserted by JavaScript -->
                    </div>
                <?php else : ?>
                    <div class="jankx-wplyr-placeholder">
                        <p><?php _e('Please configure media settings.', 'jankx'); ?></p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}

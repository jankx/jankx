<?php

namespace Jankx\Gutenberg\SmartTabs;

/**
 * Contract for Smart Tab triggers.
 *
 * Triggers encapsulate custom logic for generating tab titles and content.
 * They can be registered by the core theme or external packages/plugins.
 */
interface SmartTabTriggerInterface
{
    public const TITLE_BEHAVIOR_INHERIT = 'inherit';
    public const TITLE_BEHAVIOR_REPLACE = 'replace';
    public const TITLE_BEHAVIOR_APPEND = 'append';
    public const TITLE_BEHAVIOR_PREPEND = 'prepend';

    /**
     * Unique key for the trigger (snake-case).
     *
     * @return string
     */
    public function getKey(): string;

    /**
     * Human readable label.
     *
     * @return string
     */
    public function getLabel(): string;

    /**
     * Trigger description shown in the editor.
     *
     * @return string
     */
    public function getDescription(): string;

    /**
     * Determine if trigger is available in the current context.
     *
     * @param array $context Render/editor context details.
     * @return bool
     */
    public function isAvailable(array $context = []): bool;

    /**
     * Provide configuration for the editor.
     *
     * The returned array should contain at least:
     * - key: string (trigger key)
     * - label: string
     * - description: string
     * - supports: array (e.g. ['customTitle' => true])
     * - settingsSchema: array (optional) list of setting definitions
     *
     * @param array $context
     * @return array<string, mixed>
     */
    public function getEditorSettings(array $context = []): array;

    /**
     * Allow trigger to normalise/prepare attributes before rendering.
     *
     * @param array $attributes
     * @return array
     */
    public function prepareAttributes(array $attributes): array;

    /**
     * Resolve tab title for navigation.
     *
     * @param string $baseTitle Current tab title before trigger modifies it.
     * @param array $attributes Tab attributes.
     * @param array $context Contextual data (post id, etc.).
     * @return string
     */
    public function resolveTitle(string $baseTitle, array $attributes, array $context = []): string;

    /**
     * Filter tab content before output.
     *
     * @param string $content Rendered inner blocks content.
     * @param array $attributes Tab attributes.
     * @param array $context Contextual data.
     * @return string
     */
    public function filterContent(string $content, array $attributes, array $context = []): string;
}



<?php

namespace Jankx\Gutenberg\SmartTabs;

use InvalidArgumentException;

/**
 * Registry for Smart Tab triggers.
 *
 * Supports registration via actions/filters so that external packages
 * can contribute triggers in a decoupled way.
 */
class SmartTabTriggerRegistry
{
    /**
     * Singleton instance.
     *
     * @var SmartTabTriggerRegistry|null
     */
    protected static $instance;

    /**
     * Registered triggers indexed by key.
     *
     * @var array<string, SmartTabTriggerInterface>
     */
    protected $triggers = [];

    /**
     * Boot flag to avoid duplicate registration.
     *
     * @var bool
     */
    protected $booted = false;

    /**
     * Get singleton instance.
     *
     * @return SmartTabTriggerRegistry
     */
    public static function instance(): SmartTabTriggerRegistry
    {
        if (!static::$instance) {
            static::$instance = new static();
        }

        return static::$instance;
    }

    /**
     * Register built-in and external triggers.
     *
     * @return void
     */
    public function boot(): void
    {
        if ($this->booted) {
            return;
        }

        $this->booted = true;

        // Register default manual trigger.
        $this->registerTrigger(new Triggers\ManualTabTrigger());

        // Register advanced filter trigger
        $this->registerTrigger(new Triggers\AdvancedFilterTabTrigger());

        // Register open-link trigger
        $this->registerTrigger(new Triggers\OpenLinkTabTrigger());

        /**
         * Allow external packages to register triggers.
         *
         * @param SmartTabTriggerRegistry $registry
         */
        do_action('jankx/smart-tabs/register-triggers', $this);
    }

    /**
     * Register a new trigger.
     *
     * @param SmartTabTriggerInterface $trigger
     * @return void
     */
    public function registerTrigger(SmartTabTriggerInterface $trigger): void
    {
        $key = $trigger->getKey();

        if (empty($key)) {
            throw new InvalidArgumentException('Smart tab trigger key cannot be empty.');
        }

        $this->triggers[$key] = $trigger;
    }

    /**
     * Get trigger by key.
     *
     * @param string $key
     * @return SmartTabTriggerInterface|null
     */
    public function getTrigger(string $key): ?SmartTabTriggerInterface
    {
        if (isset($this->triggers[$key])) {
            return $this->triggers[$key];
        }

        return $this->triggers['manual'] ?? null;
    }

    /**
     * Get all registered triggers.
     *
     * @return array<string, SmartTabTriggerInterface>
     */
    public function getTriggers(): array
    {
        return $this->triggers;
    }

    /**
     * Build editor configuration dataset.
     *
     * @param array $context
     * @return array<string, mixed>
     */
    public function toEditorConfig(array $context = []): array
    {
        $config = [];

        foreach ($this->triggers as $key => $trigger) {
            if (!$trigger->isAvailable($context)) {
                continue;
            }

            $settings = $trigger->getEditorSettings($context);
            $settings['key'] = $key;

            // Provide fallback label/description if missing.
            $settings['label'] = $settings['label'] ?? $trigger->getLabel();
            $settings['description'] = $settings['description'] ?? $trigger->getDescription();

            if (empty($settings['previewTitle'])) {
                $settings['previewTitle'] = $trigger->resolveTitle(__('Tab', 'jankx'), [], $context);
            }

            $config[$key] = $settings;
        }

        return $config;
    }
}


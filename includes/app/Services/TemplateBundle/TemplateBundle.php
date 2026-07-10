<?php

namespace App\Services\TemplateBundle;

class TemplateBundle
{
    protected string $id;
    protected string $name;
    protected string $description;
    protected array $preset;
    protected array $templates;
    protected array $templateParts;
    protected array $themeOptions;
    protected array $pageSetup;
    protected array $requiredExtensions;
    protected array $requiredPlugins;
    protected ?string $preview;
    protected ?string $thumbnail;
    protected array $tags;
    protected int $priority;

    public function __construct(string $id, array $config)
    {
        $this->id = $id;
        $this->name = $config['name'] ?? $id;
        $this->description = $config['description'] ?? '';
        $this->preset = $config['preset'] ?? [];
        $this->templates = $config['templates'] ?? [];
        $this->templateParts = $config['template_parts'] ?? [];
        $this->themeOptions = $config['theme_options'] ?? [];
        $this->pageSetup = $config['page_setup'] ?? [];
        $this->requiredExtensions = $config['required_extensions'] ?? [];
        $this->requiredPlugins = $config['required_plugins'] ?? [];
        $this->preview = $config['preview'] ?? null;
        $this->thumbnail = $config['thumbnail'] ?? null;
        $this->tags = $config['tags'] ?? [];
        $this->priority = $config['priority'] ?? 10;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getPreset(): array
    {
        return $this->preset;
    }

    public function getTemplates(): array
    {
        return $this->templates;
    }

    public function getTemplateParts(): array
    {
        return $this->templateParts;
    }

    public function getThemeOptions(): array
    {
        return $this->themeOptions;
    }

    public function getPageSetup(): array
    {
        return $this->pageSetup;
    }

    public function getRequiredExtensions(): array
    {
        return $this->requiredExtensions;
    }

    public function getRequiredPlugins(): array
    {
        return $this->requiredPlugins;
    }

    public function getPreview(): ?string
    {
        return $this->preview;
    }

    public function getThumbnail(): ?string
    {
        return $this->thumbnail;
    }

    public function getTags(): array
    {
        return $this->tags;
    }

    public function getPriority(): int
    {
        return $this->priority;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'preset' => $this->preset,
            'templates' => $this->templates,
            'template_parts' => $this->templateParts,
            'theme_options' => $this->themeOptions,
            'page_setup' => $this->pageSetup,
            'required_extensions' => $this->requiredExtensions,
            'required_plugins' => $this->requiredPlugins,
            'preview' => $this->preview,
            'thumbnail' => $this->thumbnail,
            'tags' => $this->tags,
            'priority' => $this->priority,
        ];
    }

    public function getPresetColor(string $key, string $default = ''): string
    {
        return $this->preset['colors'][$key] ?? $default;
    }

    public function getHeaderPreset(): string
    {
        return $this->preset['header'] ?? 'classic';
    }

    public function getPresetTypography(string $key = 'body'): array
    {
        return $this->preset['typography'][$key] ?? [];
    }
}

<?php

return array (
  'icon_types' =>
  array (
    'fontawesome' =>
    array (
      'enabled' => true,
      'auto_load' => false,
      'version' => '7.0.0',
      'cdn_url' => 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/{version}/css/all.min.css',
      'prefixes' =>
      array (
        0 => 'fa',
        1 => 'fas',
        2 => 'far',
        3 => 'fab',
        4 => 'fal',
        5 => 'fat',
      ),
      'categories' =>
      array (
        0 => 'solid',
        1 => 'regular',
        2 => 'brands',
        3 => 'light',
        4 => 'thin',
      ),
      'render_type' => 'prefix',
    ),
    'material' =>
    array (
      'enabled' => true,
      'auto_load' => false,
      'version' => '1.3.0',
      'cdn_url' => 'https://fonts.googleapis.com/icon?family=Material+Icons',
      'prefixes' =>
      array (
        0 => 'material-icons',
      ),
      'categories' =>
      array (
        0 => 'outlined',
        1 => 'filled',
        2 => 'rounded',
        3 => 'sharp',
        4 => 'two-tone',
      ),
      'render_type' => 'content',
    ),
  ),
  'admin_settings' =>
  array (
    'per_page' => 50,
    'search_enabled' => true,
    'categories_enabled' => true,
    'preview_enabled' => true,
    'import_export_enabled' => true,
  ),
  'cache' =>
  array (
    'enabled' => true,
    'duration' => 3600,
    'auto_clear' => true,
  ),
  'auto_update' =>
  array (
    'enabled' => true,
    'frequency' => 'weekly',
    'types' =>
    array (
      0 => 'material',
      1 => 'custom',
    ),
  ),
  'gutenberg' =>
  array (
    'enabled' => true,
    'icon_picker' => true,
    'block_integration' => true,
  ),
  'frontend' =>
  array (
    'lazy_loading' => true,
    'preload_critical' => true,
    'cache_duration' => 86400,
  ),
  'storage' =>
  array (
    'type' => 'sqlite', // Options: 'json', 'sqlite'
  ),
);

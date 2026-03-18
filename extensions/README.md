# Jankx Extensions

Welcome to the **Jankx Extensions** repository. This directory houses specialized modules designed to extend the core functionality of the Jankx Theme Framework.

## Overview

Jankx is a modular, developer-centric WordPress theme framework. Extensions are the primary way to add sophisticated features—such as custom layouts, advanced filtering, or third-party integrations—without bloating the core codebase.

## Key Features

- **Modular Architecture**: Only load what you need for each specific site.
- **Dependency Management**: Extensions can declare requirements for specific PHP versions or other Jankx modules.
- **Context-Aware Loading**: Intelligent loading mechanisms ensure extensions only run in the appropriate contexts (Admin, Frontend, AJAX, or REST).
- **Modern Lifecycle**: Standardized `install()`, `activate()`, and `deactivate()` methods for predictable behavior.

## Directory Structure

Each extension should be contained within its own subdirectory and follow the mandated structure:

```
extensions/
  my-extension/
    manifest.json      # Metadata and configuration
    vendor/            # Composer dependencies (if any)
    includes/          # Implementation logic
    assets/            # Frontend resources
    README.md          # Extension-specific documentation
```

## Creating an Extension

To create a new extension:
1. Create a folder in this directory.
2. Define a `manifest.json` with your extension's name, version, and caller class.
3. Implement the `Jankx\Extensions\AbstractExtension` class.

For detailed development guides, please refer to the core [Jankx Documentation](../../docs).

# Tooltip Text Component

A custom Gutenberg format type that adds customizable hover tooltips to text in the WordPress block editor.

## Features

- **Custom Tooltip Text**: Define your own tooltip message for each highlighted text element

- **Tooltip Background Color**: Choose any background color for the tooltip bubble

- **Tooltip Text Color**: Set the font color for the tooltip content

- **Flexible Tooltip Positioning**: Choose from 8 positioning options:
Top, Bottom, Left, Right, Top-Left, Top-Right, Bottom-Left, Bottom-Right

- **Responsive Design**: Tooltips automatically adjust on mobile devices to prevent off-screen display

- **Inline Format Button**: Easily toggle tooltips using the native Gutenberg toolbar

- **Live Preview**: View tooltip styles directly in the editor as you apply them

- **Translation Ready**: Fully translatable using `@wordpress/i18n`

## Installation

1. Add the `tooltip` component to your project

2. Import in your main JavaScript file:

    ```js
    import './tooltip';
    ```

3. Ensure translations are loaded via `wp_set_script_translations()`

## Usage

1. Highlight text inside any rich text block

2. Click the "Tooltip" toolbar button (💬 icon)

3. Customize in the popover:
    - Enter tooltip text
    - Choose tooltip background color
    - Choose tooltip text color
    - Select tooltip position (8 options available)

4. Re-click the button to remove the tooltip

## Tooltip Positioning Options

The component offers 8 different positioning options to ensure optimal tooltip placement:


- **Top**: Tooltip appears above the text
- **Bottom**: Tooltip appears below the text
- **Left**: Tooltip appears to the left of the text
- **Right**: Tooltip appears to the right of the text
- **Top-Left**: Tooltip appears diagonally above and to the left
- **Top-Right**: Tooltip appears diagonally above and to the right
- **Bottom-Left**: Tooltip appears diagonally below and to the left
- **Bottom-Right**: Tooltip appears diagonally below and to the right

## Demo

[View Demo Video](https://www.awesomescreenshot.com/video/40571636?key=29e3628e162ef8121e4fec5597cfe10a)
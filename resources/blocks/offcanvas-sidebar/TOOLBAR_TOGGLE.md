# Toolbar Toggle Show/Hide Feature

## Overview
The Offcanvas Sidebar block now includes a toolbar button to toggle the sidebar preview visibility in the Gutenberg editor.

## Features

### Toolbar Button
- Located in the block toolbar (top of the block in editor)
- Shows current state with icon feedback:
  - **Visibility Icon** (👁️): Sidebar is visible
  - **Hidden Icon** (🙈): Sidebar is hidden
- Smooth animation when toggling between states

### Functionality
- **Show Sidebar**: Click the toolbar button to display the sidebar preview
- **Hide Sidebar**: Click again to collapse and hide the sidebar preview
- **State Memory**: State is maintained during the current editing session
- **Non-destructive**: Toggling does not affect any sidebar settings or content

### Use Cases
1. **Large Sidebars**: Hide the sidebar preview to see more editor space and work with other blocks
2. **Focus Editing**: Hide sidebar content while editing other parts of the page
3. **Quick Preview**: Toggle between seeing and hiding the sidebar to check layout
4. **Inspector Space**: More room for inspector controls when sidebar is hidden

### Styling
- Smooth max-height and opacity transitions (0.3s)
- Border and padding removed when hidden
- Sidebar content remains fully intact when toggled back

### Technical Implementation

#### React State
```tsx
const [isOpen, setIsOpen] = useState<boolean>(false);
```

#### Toolbar Button
```tsx
<ToolbarButton
    label={isOpen ? __('Hide Sidebar', 'jankx') : __('Show Sidebar', 'jankx')}
    icon={isOpen ? 'visibility' : 'hidden'}
    isActive={isOpen}
    onClick={() => setIsOpen(!isOpen)}
/>
```

#### CSS Classes
- `sidebar-hidden`: Applied when sidebar is hidden
- Triggers CSS transitions for smooth show/hide effect

### Browser Compatibility
- Works with all modern browsers supporting CSS transitions
- Tested with:
  - Chrome/Chromium
  - Firefox
  - Safari
  - Edge

## Keyboard & Accessibility
- Toolbar button is keyboard accessible
- Proper ARIA labels for screen readers
- Visual feedback with icon changes

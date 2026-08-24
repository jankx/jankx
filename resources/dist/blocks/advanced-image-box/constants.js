/**
 * Constants for Advanced Image Box block
 */
export const ALLOWED_MEDIA_TYPES = ['image'];
export const DEFAULT_MEDIA_SIZE_SLUG = 'full';
export const MIN_SIZE = 20;
export const LINK_DESTINATION_NONE = 'none';
export const LINK_DESTINATION_MEDIA = 'media';
export const LINK_DESTINATION_ATTACHMENT = 'attachment';
export const LINK_DESTINATION_CUSTOM = 'custom';
export const NEW_TAB_REL = ['noreferrer', 'noopener'];
// Allowed inner blocks for overlay content
export const ALLOWED_INNER_BLOCKS = [
    'core/heading',
    'core/paragraph',
    'core/button',
    'core/list',
    'core/group',
    'core/columns',
    'core/column',
    'core/spacer',
    'core/separator',
    'jankx/svg-icon',
    'jankx/icon-button'
];
// Default inner blocks template
export const DEFAULT_INNER_BLOCKS_TEMPLATE = [
    {
        name: 'core/heading',
        attributes: {
            level: 3,
            placeholder: 'Add overlay title',
            textAlign: 'center'
        }
    },
    {
        name: 'core/paragraph',
        attributes: {
            placeholder: 'Add overlay description',
            textAlign: 'center'
        }
    },
    {
        name: 'core/button',
        attributes: {
            text: 'Learn More',
            className: 'is-style-outline',
            textAlign: 'center'
        }
    }
];
// Animation options from Animate.css
export const ANIMATION_OPTIONS = [
    // Fade animations
    {
        value: 'fadeIn',
        label: 'Fade In',
        description: 'Fade in from transparent to opaque',
        category: 'Fade'
    },
    {
        value: 'fadeInUp',
        label: 'Fade In Up',
        description: 'Fade in while sliding up',
        category: 'Fade'
    },
    {
        value: 'fadeInDown',
        label: 'Fade In Down',
        description: 'Fade in while sliding down',
        category: 'Fade'
    },
    {
        value: 'fadeInLeft',
        label: 'Fade In Left',
        description: 'Fade in while sliding from left',
        category: 'Fade'
    },
    {
        value: 'fadeInRight',
        label: 'Fade In Right',
        description: 'Fade in while sliding from right',
        category: 'Fade'
    },
    // Slide animations
    {
        value: 'slideInUp',
        label: 'Slide In Up',
        description: 'Slide in from bottom',
        category: 'Slide'
    },
    {
        value: 'slideInDown',
        label: 'Slide In Down',
        description: 'Slide in from top',
        category: 'Slide'
    },
    {
        value: 'slideInLeft',
        label: 'Slide In Left',
        description: 'Slide in from left',
        category: 'Slide'
    },
    {
        value: 'slideInRight',
        label: 'Slide In Right',
        description: 'Slide in from right',
        category: 'Slide'
    },
    // Zoom animations
    {
        value: 'zoomIn',
        label: 'Zoom In',
        description: 'Scale up from small to normal size',
        category: 'Zoom'
    },
    {
        value: 'zoomInUp',
        label: 'Zoom In Up',
        description: 'Zoom in while sliding up',
        category: 'Zoom'
    },
    {
        value: 'zoomInDown',
        label: 'Zoom In Down',
        description: 'Zoom in while sliding down',
        category: 'Zoom'
    },
    {
        value: 'zoomInLeft',
        label: 'Zoom In Left',
        description: 'Zoom in while sliding from left',
        category: 'Zoom'
    },
    {
        value: 'zoomInRight',
        label: 'Zoom In Right',
        description: 'Zoom in while sliding from right',
        category: 'Zoom'
    },
    // Bounce animations
    {
        value: 'bounceIn',
        label: 'Bounce In',
        description: 'Bounce in with elastic effect',
        category: 'Bounce'
    },
    {
        value: 'bounceInUp',
        label: 'Bounce In Up',
        description: 'Bounce in from bottom',
        category: 'Bounce'
    },
    {
        value: 'bounceInDown',
        label: 'Bounce In Down',
        description: 'Bounce in from top',
        category: 'Bounce'
    },
    {
        value: 'bounceInLeft',
        label: 'Bounce In Left',
        description: 'Bounce in from left',
        category: 'Bounce'
    },
    {
        value: 'bounceInRight',
        label: 'Bounce In Right',
        description: 'Bounce in from right',
        category: 'Bounce'
    },
    // Flip animations
    {
        value: 'flipInX',
        label: 'Flip In X',
        description: 'Flip in around X axis',
        category: 'Flip'
    },
    {
        value: 'flipInY',
        label: 'Flip In Y',
        description: 'Flip in around Y axis',
        category: 'Flip'
    },
    // Rotate animations
    {
        value: 'rotateIn',
        label: 'Rotate In',
        description: 'Rotate in with fade',
        category: 'Rotate'
    },
    {
        value: 'rotateInDownLeft',
        label: 'Rotate In Down Left',
        description: 'Rotate in from down left',
        category: 'Rotate'
    },
    {
        value: 'rotateInDownRight',
        label: 'Rotate In Down Right',
        description: 'Rotate in from down right',
        category: 'Rotate'
    },
    // Special effects
    {
        value: 'pulse',
        label: 'Pulse',
        description: 'Pulsing scale effect',
        category: 'Special'
    },
    {
        value: 'shake',
        label: 'Shake',
        description: 'Shaking effect',
        category: 'Special'
    },
    {
        value: 'swing',
        label: 'Swing',
        description: 'Swinging effect',
        category: 'Special'
    },
    {
        value: 'tada',
        label: 'Tada',
        description: 'Celebration effect',
        category: 'Special'
    },
    {
        value: 'wobble',
        label: 'Wobble',
        description: 'Wobbling effect',
        category: 'Special'
    }
];
export const OVERLAY_POSITIONS = [
    {
        value: 'top',
        label: 'Top',
        description: 'Overlay positioned at top'
    },
    {
        value: 'center',
        label: 'Center',
        description: 'Overlay positioned at center'
    },
    {
        value: 'bottom',
        label: 'Bottom',
        description: 'Overlay positioned at bottom'
    },
    {
        value: 'left',
        label: 'Left',
        description: 'Overlay positioned at left'
    },
    {
        value: 'right',
        label: 'Right',
        description: 'Overlay positioned at right'
    }
];
export const HOVER_EFFECTS = [
    {
        value: 'none',
        label: 'None',
        description: 'No hover effect'
    },
    {
        value: 'zoom',
        label: 'Zoom',
        description: 'Scale image on hover'
    },
    {
        value: 'fade',
        label: 'Fade',
        description: 'Fade image on hover'
    },
    {
        value: 'blur',
        label: 'Blur',
        description: 'Blur image on hover'
    },
    {
        value: 'grayscale',
        label: 'Grayscale',
        description: 'Convert to grayscale on hover'
    },
    {
        value: 'sepia',
        label: 'Sepia',
        description: 'Apply sepia filter on hover'
    },
    {
        value: 'brightness',
        label: 'Brightness',
        description: 'Change brightness on hover'
    }
];
export const SCALE_OPTIONS = [
    {
        value: 'cover',
        label: 'Cover',
        help: 'Image covers the space evenly.'
    },
    {
        value: 'contain',
        label: 'Contain',
        help: 'Image is contained without distortion.'
    },
    {
        value: 'fill',
        label: 'Fill',
        help: 'Image fills the space, may be distorted.'
    },
    {
        value: 'scale-down',
        label: 'Scale Down',
        help: 'Image scales down to fit.'
    }
];
export const DEFAULT_ATTRIBUTES = {
    showOverlayOnHover: true,
    overlayAnimation: 'fadeIn',
    overlayAnimationDuration: 1000,
    overlayAnimationDelay: 0,
    overlayPosition: 'center',
    overlayBackground: 'rgba(0, 0, 0, 0.7)',
    overlayOpacity: 1,
    imageHoverEffect: 'zoom',
    borderRadius: '0px',
    scale: 'cover'
};
// Validation rules
export const VALIDATION_RULES = {
    requiredAttributes: ['url'],
    maxInnerBlocks: 10,
    allowedBlockTypes: ALLOWED_INNER_BLOCKS,
    maxAnimationDuration: 5000,
    minAnimationDuration: 100,
    maxAnimationDelay: 2000,
    minAnimationDelay: 0,
    maxOverlayOpacity: 1,
    minOverlayOpacity: 0
};

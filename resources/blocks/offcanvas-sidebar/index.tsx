import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    InnerBlocks,
    useInnerBlocksProps
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
    ToggleControl
} from '@wordpress/components';
import { useMemo, useEffect } from '@wordpress/element';
// @ts-ignore
import metadata from './block.json';

interface OffcanvasSidebarAttributes {
    sidebarPosition: 'left' | 'right';
    animationEffect: string;
    sidebarWidth: string;
    overlayColor: string;
    showOverlay: boolean;
    closeOnOverlayClick: boolean;
    showCloseButton: boolean;
    closeButtonPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right' | 'center-left';
    closeButtonSize: 'small' | 'medium' | 'large';
    closeButtonStyle: 'circle' | 'square' | 'rounded' | 'minimal';
    closeButtonColor: string;
    className?: string;
    style?: any;
}

interface OffcanvasSidebarEditProps {
    attributes: OffcanvasSidebarAttributes;
    setAttributes: (attributes: Partial<OffcanvasSidebarAttributes>) => void;
}

// Animation effects available
const ANIMATION_EFFECTS = [
    { label: 'Slide In', value: 'slide-in' },
    { label: 'Slide Down', value: 'slide-down' }
];

function OffcanvasSidebarEdit({ attributes, setAttributes }: OffcanvasSidebarEditProps): JSX.Element {
    const {
        sidebarPosition,
        animationEffect,
        sidebarWidth,
        overlayColor,
        showOverlay,
        closeOnOverlayClick,
        showCloseButton,
        closeButtonPosition,
        closeButtonSize,
        closeButtonStyle,
        closeButtonColor,
        className,
        style
    } = attributes;

    // Add 'sidebar-open' class to root container in editor to show sidebar
    useEffect(() => {
        const rootContainer = document.querySelector('.is-root-container');
        const hamburgerContainer = document.querySelector('.hamburger-container');
        if (!hamburgerContainer?.classList.contains('active') && rootContainer) {
            rootContainer.classList.add('sidebar-open');
        }
    }, []); // Run once on mount

    const blockProps = useBlockProps({
        className: `offcanvas-sidebar-block ${className || ''}`
    });

    const innerBlocksProps = useInnerBlocksProps(
        { className: 'sidebar-content' },
        {
            allowedBlocks: [
                'core/paragraph',
                'core/heading',
                'core/image',
                'core/gallery',
                'core/list',
                'core/quote',
                'core/buttons',
                'core/separator',
                'core/spacer',
                'core/social-links',
                'core/navigation',
                'core/search',
                'core/calendar',
                'core/latest-posts',
                'core/latest-comments',
                'core/rss',
                'core/audio',
                'core/video',
                'core/file',
                'core/code',
                'core/html',
                'core/preformatted',
                'core/pullquote',
                'core/table',
                'core/verse',
                'core/media-text',
                'core/columns',
                'core/group',
                'core/cover',
                'core/embed',
                'jankx/language-switcher',
                'jankx/icon-button',
                'jankx/offcanvas-sidebar'
            ],
            template: [
                ['core/heading', { level: 3, content: __('Sidebar Content', 'jankx') }],
                ['core/paragraph', { content: __('Add your content here using any available blocks.', 'jankx') }]
            ],
            templateLock: false
        }
    );

    // Memoize sidebar style to prevent re-creation on every render
    const sidebarStyle: React.CSSProperties = useMemo(() => ({
        width: sidebarWidth,
        ...style,
    }), [sidebarWidth, style]);

    // Render sidebar preview (always visible in editor)
    const renderSidebarPreview = () => {
        return (
            <div className={`offcanvas-sidebar-preview effect-${animationEffect} position-${sidebarPosition}`}>
                {/* Sidebar - Always visible in editor */}
                <div
                    className="offcanvas-sidebar editor-sidebar"
                    style={sidebarStyle}
                >
                    {showCloseButton && (
                        <button
                            className={`close-button editor-close-button position-${closeButtonPosition} size-${closeButtonSize} style-${closeButtonStyle}`}
                            type="button"
                            disabled
                            style={{ color: closeButtonColor }}
                        >
                            ×
                        </button>
                    )}
                    <div {...innerBlocksProps} />
                </div>
            </div>
        );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Sidebar Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Position', 'jankx')}
                        value={sidebarPosition}
                        options={[
                            { label: __('Left', 'jankx'), value: 'left' },
                            { label: __('Right', 'jankx'), value: 'right' }
                        ]}
                        onChange={(value: 'left' | 'right') => setAttributes({ sidebarPosition: value })}
                    />

                    <SelectControl
                        label={__('Animation Effect', 'jankx')}
                        value={animationEffect}
                        options={ANIMATION_EFFECTS}
                        onChange={(value: string) => setAttributes({ animationEffect: value })}
                    />

                    <TextControl
                        label={__('Sidebar Width', 'jankx')}
                        value={sidebarWidth}
                        onChange={(value: string) => setAttributes({ sidebarWidth: value })}
                        help={__('e.g., 300px, 25vw, 20rem', 'jankx')}
                    />
                </PanelBody>

                <PanelBody title={__('Overlay Settings', 'jankx')} initialOpen={false}>
                    <div className="color-picker-group">
                        <label>{__('Overlay Color', 'jankx')}</label>
                        <input
                            type="color"
                            value={overlayColor}
                            onChange={(e) => setAttributes({ overlayColor: e.target.value })}
                        />
                    </div>
                </PanelBody>

                <PanelBody title={__('Behavior', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Overlay', 'jankx')}
                        checked={showOverlay}
                        onChange={(value: boolean) => setAttributes({ showOverlay: value })}
                    />

                    <ToggleControl
                        label={__('Close on Overlay Click', 'jankx')}
                        checked={closeOnOverlayClick}
                        onChange={(value: boolean) => setAttributes({ closeOnOverlayClick: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Close Button', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Close Button', 'jankx')}
                        checked={showCloseButton}
                        onChange={(value: boolean) => setAttributes({ showCloseButton: value })}
                    />

                    {showCloseButton && (
                        <>
                            <SelectControl
                                label={__('Position', 'jankx')}
                                value={closeButtonPosition}
                                options={[
                                    { label: __('Top Right', 'jankx'), value: 'top-right' },
                                    { label: __('Top Left', 'jankx'), value: 'top-left' },
                                    { label: __('Bottom Right', 'jankx'), value: 'bottom-right' },
                                    { label: __('Bottom Left', 'jankx'), value: 'bottom-left' },
                                    { label: __('Center Right', 'jankx'), value: 'center-right' },
                                    { label: __('Center Left', 'jankx'), value: 'center-left' }
                                ]}
                                onChange={(value: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right' | 'center-left') => setAttributes({ closeButtonPosition: value })}
                            />

                            <SelectControl
                                label={__('Size', 'jankx')}
                                value={closeButtonSize}
                                options={[
                                    { label: __('Small', 'jankx'), value: 'small' },
                                    { label: __('Medium', 'jankx'), value: 'medium' },
                                    { label: __('Large', 'jankx'), value: 'large' }
                                ]}
                                onChange={(value: 'small' | 'medium' | 'large') => setAttributes({ closeButtonSize: value })}
                            />

                            <SelectControl
                                label={__('Style', 'jankx')}
                                value={closeButtonStyle}
                                options={[
                                    { label: __('Circle', 'jankx'), value: 'circle' },
                                    { label: __('Square', 'jankx'), value: 'square' },
                                    { label: __('Rounded', 'jankx'), value: 'rounded' },
                                    { label: __('Minimal', 'jankx'), value: 'minimal' }
                                ]}
                                onChange={(value: 'circle' | 'square' | 'rounded' | 'minimal') => setAttributes({ closeButtonStyle: value })}
                            />

                            <div className="color-picker-group">
                                <label>{__('Button Color', 'jankx')}</label>
                                <input
                                    type="color"
                                    value={closeButtonColor === 'inherit' ? '#ffffff' : closeButtonColor}
                                    onChange={(e) => setAttributes({ closeButtonColor: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="button button-small"
                                    onClick={() => setAttributes({ closeButtonColor: 'inherit' })}
                                >
                                    {__('Inherit', 'jankx')}
                                </button>
                            </div>
                        </>
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {renderSidebarPreview()}
            </div>
        </>
    );
}

function OffcanvasSidebarSave(): JSX.Element {
    // For dynamic blocks with InnerBlocks, we need to save the InnerBlocks content
    return <InnerBlocks.Content />;
}

// @ts-ignore
registerBlockType(metadata.name, {
    ...metadata,
    edit: OffcanvasSidebarEdit,
    save: OffcanvasSidebarSave,
});

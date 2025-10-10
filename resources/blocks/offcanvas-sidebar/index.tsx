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
    ToggleControl,
    ColorPicker
} from '@wordpress/components';
import { useMemo, useEffect } from '@wordpress/element';

interface OffcanvasSidebarAttributes {
    sidebarPosition: 'left' | 'right';
    animationEffect: string;
    sidebarWidth: string;
    overlayColor: string;
    sidebarBackground: string;
    textColor: string;
    showOverlay: boolean;
    closeOnOverlayClick: boolean;
    className?: string;
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
        sidebarBackground,
        textColor,
        showOverlay,
        closeOnOverlayClick,
        className
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
        backgroundColor: sidebarBackground,
        color: textColor,
    }), [sidebarWidth, sidebarBackground, textColor]);

    // Render sidebar preview (always visible in editor)
    const renderSidebarPreview = () => {
        return (
            <div className={`offcanvas-sidebar-preview effect-${animationEffect} position-${sidebarPosition}`}>
                {/* Sidebar - Always visible in editor */}
                <div
                    className="offcanvas-sidebar editor-sidebar"
                    style={sidebarStyle}
                >
                    <button className="close-button editor-close-button" type="button" disabled>
                        ×
                    </button>
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

                    <div className="color-controls">
                        <div className="color-picker-group">
                            <label>{__('Sidebar Background', 'jankx')}</label>
                            <ColorPicker
                                color={sidebarBackground}
                                onChange={(color: string) => setAttributes({ sidebarBackground: color })}
                            />
                        </div>

                        <div className="color-picker-group">
                            <label>{__('Text Color', 'jankx')}</label>
                            <ColorPicker
                                color={textColor}
                                onChange={(color: string) => setAttributes({ textColor: color })}
                            />
                        </div>

                        <div className="color-picker-group">
                            <label>{__('Overlay Color', 'jankx')}</label>
                            <ColorPicker
                                color={overlayColor}
                                onChange={(color: string) => setAttributes({ overlayColor: color })}
                            />
                        </div>
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

registerBlockType('jankx/offcanvas-sidebar', {
    title: 'Offcanvas Sidebar',
    category: 'widgets',
    attributes: {
        sidebarPosition: { type: 'string', default: 'left' },
        animationEffect: { type: 'string', default: 'slide-in' },
        sidebarWidth: { type: 'string', default: '300px' },
        overlayColor: { type: 'string', default: 'rgba(0,0,0,0.2)' },
        sidebarBackground: { type: 'string', default: '#48a770' },
        textColor: { type: 'string', default: '#f3efe0' },
        showOverlay: { type: 'boolean', default: true },
        closeOnOverlayClick: { type: 'boolean', default: true },
        className: { type: 'string' }
    },
    edit: OffcanvasSidebarEdit,
    save: OffcanvasSidebarSave,
});

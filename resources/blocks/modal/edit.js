/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
    InspectorControls,
    useBlockProps,
    InnerBlocks,
    BlockControls,
    useInnerBlocksProps
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    SelectControl,
    ToggleControl,
    RangeControl,
    ColorPicker,
    Button,
    ButtonGroup,
    __experimentalBoxControl as BoxControl
} from '@wordpress/components';
import {
    layout as icon,
    settings,
    fullscreen,
    desktop
} from '@wordpress/icons';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

/**
 * Edit component for Modal block
 */
export default function Edit({ attributes, setAttributes, clientId }) {
    const {
        modalId,
        triggerType,
        triggerText,
        triggerUrl,
        triggerTarget,
        customSelector,
        modalSize,
        closeOnOverlayClick,
        closeOnEscape,
        showCloseButton,
        animationType,
        animationDuration,
        backdropColor,
        backdropBlur,
        zIndex
    } = attributes;

    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [generatedId, setGeneratedId] = useState('');

    // Generate unique ID if not set
    useEffect(() => {
        if (!modalId) {
            const newId = `modal-${clientId}`;
            setGeneratedId(newId);
            setAttributes({ modalId: newId });
        } else {
            setGeneratedId(modalId);
        }
    }, [modalId, clientId, setAttributes]);

    const blockProps = useBlockProps({
        className: `wp-block-jankx-modal ${isPreviewMode ? 'modal-preview' : ''}`
    });

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'wp-block-jankx-modal__inner'
        },
        {
            // Accept ALL blocks - no restrictions
            template: [
                ['core/heading', { level: 3, placeholder: __('Modal Title', 'jankx') }],
                ['core/paragraph', { placeholder: __('Add your modal content here...', 'jankx') }]
            ],
            templateLock: false
        }
    );

    const renderTrigger = () => {
        switch (triggerType) {
            case 'button':
                return (
                    <button
                        type="button"
                        className="wp-block-jankx-modal__trigger"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                        {triggerText || __('Open Modal', 'jankx')}
                    </button>
                );
            case 'anchor':
                return (
                    <a
                        href={triggerUrl || '#'}
                        className="wp-block-jankx-modal__trigger"
                        target={triggerTarget}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsPreviewMode(!isPreviewMode);
                        }}
                    >
                        {triggerText || __('Open Modal', 'jankx')}
                    </a>
                );
            case 'custom':
                return (
                    <div className="wp-block-jankx-modal__custom-trigger">
                        {customSelector || __('Custom Selector', 'jankx')}
                    </div>
                );
            default:
                return null;
        }
    };

    // Removed preview modal - just show content directly in editor

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon={isPreviewMode ? fullscreen : desktop}
                        label={isPreviewMode ? __('Hide Preview', 'jankx') : __('Show Preview', 'jankx')}
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                    />
                </ToolbarGroup>
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Trigger Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Trigger Type', 'jankx')}
                        value={triggerType}
                        options={[
                            { label: __('Button', 'jankx'), value: 'button' },
                            { label: __('Link', 'jankx'), value: 'anchor' },
                            { label: __('Custom Selector', 'jankx'), value: 'custom' }
                        ]}
                        onChange={(value) => setAttributes({ triggerType: value })}
                    />

                    {triggerType === 'button' && (
                        <TextControl
                            label={__('Button Text', 'jankx')}
                            value={triggerText}
                            onChange={(value) => setAttributes({ triggerText: value })}
                            placeholder={__('Open Modal', 'jankx')}
                        />
                    )}

                    {triggerType === 'anchor' && (
                        <>
                            <TextControl
                                label={__('Link Text', 'jankx')}
                                value={triggerText}
                                onChange={(value) => setAttributes({ triggerText: value })}
                                placeholder={__('Open Modal', 'jankx')}
                            />
                            <TextControl
                                label={__('Link URL', 'jankx')}
                                value={triggerUrl}
                                onChange={(value) => setAttributes({ triggerUrl: value })}
                                placeholder="#"
                            />
                            <SelectControl
                                label={__('Link Target', 'jankx')}
                                value={triggerTarget}
                                options={[
                                    { label: __('Same Window', 'jankx'), value: '_self' },
                                    { label: __('New Window', 'jankx'), value: '_blank' }
                                ]}
                                onChange={(value) => setAttributes({ triggerTarget: value })}
                            />
                        </>
                    )}

                    {triggerType === 'custom' && (
                        <TextControl
                            label={__('Custom Selector', 'jankx')}
                            value={customSelector}
                            onChange={(value) => setAttributes({ customSelector: value })}
                            placeholder=".my-trigger, #my-button"
                            help={__('CSS selector for elements that should trigger the modal', 'jankx')}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Modal Settings', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Modal ID', 'jankx')}
                        value={modalId}
                        onChange={(value) => setAttributes({ modalId: value })}
                        help={__('Unique identifier for the modal. Leave empty to auto-generate.', 'jankx')}
                    />

                    <SelectControl
                        label={__('Modal Size', 'jankx')}
                        value={modalSize}
                        options={[
                            { label: __('Small', 'jankx'), value: 'small' },
                            { label: __('Medium', 'jankx'), value: 'medium' },
                            { label: __('Large', 'jankx'), value: 'large' },
                            { label: __('Fullscreen', 'jankx'), value: 'fullscreen' }
                        ]}
                        onChange={(value) => setAttributes({ modalSize: value })}
                    />

                    <ToggleControl
                        label={__('Close on Overlay Click', 'jankx')}
                        checked={closeOnOverlayClick}
                        onChange={(value) => setAttributes({ closeOnOverlayClick: value })}
                    />

                    <ToggleControl
                        label={__('Close on Escape Key', 'jankx')}
                        checked={closeOnEscape}
                        onChange={(value) => setAttributes({ closeOnEscape: value })}
                    />

                    <ToggleControl
                        label={__('Show Close Button', 'jankx')}
                        checked={showCloseButton}
                        onChange={(value) => setAttributes({ showCloseButton: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Animation Settings', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Animation Type', 'jankx')}
                        value={animationType}
                        options={[
                            { label: __('Fade', 'jankx'), value: 'fade' },
                            { label: __('Slide', 'jankx'), value: 'slide' },
                            { label: __('Zoom', 'jankx'), value: 'zoom' },
                            { label: __('None', 'jankx'), value: 'none' }
                        ]}
                        onChange={(value) => setAttributes({ animationType: value })}
                    />

                    <RangeControl
                        label={__('Animation Duration (ms)', 'jankx')}
                        value={animationDuration}
                        onChange={(value) => setAttributes({ animationDuration: value })}
                        min={100}
                        max={1000}
                        step={50}
                    />
                </PanelBody>

                <PanelBody title={__('Backdrop Settings', 'jankx')} initialOpen={false}>
                    <div className="components-base-control">
                        <label className="components-base-control__label">
                            {__('Backdrop Color', 'jankx')}
                        </label>
                        <ColorPicker
                            color={backdropColor}
                            onChange={(value) => setAttributes({ backdropColor: value })}
                        />
                    </div>

                    <ToggleControl
                        label={__('Backdrop Blur', 'jankx')}
                        checked={backdropBlur}
                        onChange={(value) => setAttributes({ backdropBlur: value })}
                    />

                    <RangeControl
                        label={__('Z-Index', 'jankx')}
                        value={zIndex}
                        onChange={(value) => setAttributes({ zIndex: value })}
                        min={1000}
                        max={99999}
                        step={100}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="wp-block-jankx-modal__editor-wrapper">
                    {/* Trigger Preview */}
                    <div className="wp-block-jankx-modal__trigger-preview">
                        <div className="wp-block-jankx-modal__label">
                            {__('🔘 Modal Trigger:', 'jankx')}
                        </div>
                        {renderTrigger()}
                    </div>

                    {/* Modal Content - Always visible in editor */}
                    <div className="wp-block-jankx-modal__editor-content">
                        <div className="wp-block-jankx-modal__label">
                            {__('📄 Modal Content (ID: ', 'jankx')}<code>{generatedId}</code>):
                        </div>
                        <div className={`wp-block-jankx-modal__content-editor wp-block-jankx-modal__container--${modalSize}`}>
                            {showCloseButton && (
                                <div className="wp-block-jankx-modal__close-preview" title={__('Close button will appear here', 'jankx')}>
                                    ✕
                                </div>
                            )}
                            <div {...innerBlocksProps} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

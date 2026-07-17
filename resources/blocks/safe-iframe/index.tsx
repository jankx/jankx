import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    ToggleControl,
    SelectControl,
    RangeControl,
    CheckboxControl,
    BaseControl,
    Notice,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

interface SafeIframeAttributes {
    url: string;
    title: string;
    width: string;
    height: string;
    aspectRatio: string;
    useAspectRatio: boolean;
    allowFullscreen: boolean;
    loading: 'lazy' | 'eager';
    sandbox: string[];
    allow: string;
    borderRadius: number;
    showBorder: boolean;
    borderWidth: number;
    borderColor: string;
    showShadow: boolean;
    customCSS: string;
}

const SANDBOX_OPTIONS = [
    { label: __('Allow Scripts', 'jankx'), value: 'allow-scripts' },
    { label: __('Allow Same Origin', 'jankx'), value: 'allow-same-origin' },
    { label: __('Allow Forms', 'jankx'), value: 'allow-forms' },
    { label: __('Allow Popups', 'jankx'), value: 'allow-popups' },
    { label: __('Allow Pointer Lock', 'jankx'), value: 'allow-pointer-lock' },
    { label: __('Allow Top Navigation', 'jankx'), value: 'allow-top-navigation' },
    { label: __('Allow Modals', 'jankx'), value: 'allow-modals' },
];

const ASPECT_RATIO_PRESETS = [
    { label: __('Custom', 'jankx'), value: '' },
    { label: __('16:9 (Video)', 'jankx'), value: '16/9' },
    { label: __('4:3 (Classic)', 'jankx'), value: '4/3' },
    { label: __('21:9 (Ultrawide)', 'jankx'), value: '21/9' },
    { label: __('1:1 (Square)', 'jankx'), value: '1/1' },
    { label: __('9:16 (Vertical)', 'jankx'), value: '9/16' },
];

function Edit({ attributes, setAttributes }: any) {
    const {
        url = '',
        title = 'Embedded Content',
        width = '100%',
        height = '500px',
        aspectRatio = '',
        useAspectRatio = false,
        allowFullscreen = true,
        loading = 'lazy',
        sandbox = ['allow-scripts', 'allow-same-origin'],
        allow = '',
        borderRadius = 0,
        showBorder = false,
        borderWidth = 1,
        borderColor = '#ddd',
        showShadow = false,
        customCSS = '',
    } = attributes as SafeIframeAttributes;

    const [isValidUrl, setIsValidUrl] = useState(true);

    useEffect(() => {
        if (url) {
            try {
                new URL(url);
                setIsValidUrl(true);
            } catch {
                setIsValidUrl(false);
            }
        } else {
            setIsValidUrl(true);
        }
    }, [url]);

    const iframeStyles: React.CSSProperties = {
        width: useAspectRatio ? '100%' : width,
        height: useAspectRatio ? '100%' : height,
        border: showBorder ? `${borderWidth}px solid ${borderColor}` : 'none',
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        boxShadow: showShadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : undefined,
    };

    const containerStyles: React.CSSProperties = useAspectRatio && aspectRatio
        ? {
            position: 'relative',
            width: '100%',
            paddingBottom: `calc(100% / (${aspectRatio}))`,
        }
        : {};

    const iframeContainerStyles: React.CSSProperties = useAspectRatio && aspectRatio
        ? {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
        }
        : {};

    const blockProps = useBlockProps({
        className: 'safe-iframe-block',
    });

    const sandboxValue = Array.isArray(sandbox) ? sandbox.join(' ') : '';
    const allowValue = allow || undefined;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Iframe Settings', 'jankx')} initialOpen={true}>
                    <TextControl
                        label={__('URL', 'jankx')}
                        value={url}
                        onChange={(value: string) => setAttributes({ url: value })}
                        help={__('Enter the URL to embed', 'jankx')}
                        placeholder="https://example.com"
                    />
                    {!isValidUrl && (
                        <Notice status="error" isDismissible={false}>
                            {__('Please enter a valid URL', 'jankx')}
                        </Notice>
                    )}
                    <TextControl
                        label={__('Title', 'jankx')}
                        value={title}
                        onChange={(value: string) => setAttributes({ title: value })}
                        help={__('Accessibility title for screen readers', 'jankx')}
                    />
                </PanelBody>

                <PanelBody title={__('Dimensions', 'jankx')} initialOpen={true}>
                    <ToggleControl
                        label={__('Use Aspect Ratio', 'jankx')}
                        checked={useAspectRatio}
                        onChange={(value: boolean) => setAttributes({ useAspectRatio: value })}
                        help={__('Maintain aspect ratio for responsive design', 'jankx')}
                    />
                    {useAspectRatio ? (
                        <SelectControl
                            label={__('Aspect Ratio', 'jankx')}
                            value={aspectRatio}
                            options={ASPECT_RATIO_PRESETS}
                            onChange={(value: string) => setAttributes({ aspectRatio: value })}
                        />
                    ) : (
                        <>
                            <TextControl
                                label={__('Width', 'jankx')}
                                value={width}
                                onChange={(value: string) => setAttributes({ width: value })}
                                help={__('e.g., 100%, 800px, 50vw', 'jankx')}
                            />
                            <TextControl
                                label={__('Height', 'jankx')}
                                value={height}
                                onChange={(value: string) => setAttributes({ height: value })}
                                help={__('e.g., 500px, 100vh', 'jankx')}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Security Settings', 'jankx')} initialOpen={false}>
                    <BaseControl
                        label={__('Sandbox Permissions', 'jankx')}
                        help={__('Control what the iframe can do', 'jankx')}
                    >
                        <div style={{ marginTop: '8px' }}>
                            {SANDBOX_OPTIONS.map((option) => (
                                <CheckboxControl
                                    key={option.value}
                                    label={option.label}
                                    checked={sandbox.includes(option.value)}
                                    onChange={(checked: boolean) => {
                                        const newSandbox = checked
                                            ? [...sandbox, option.value]
                                            : sandbox.filter((v) => v !== option.value);
                                        setAttributes({ sandbox: newSandbox });
                                    }}
                                />
                            ))}
                        </div>
                    </BaseControl>
                    <TextControl
                        label={__('Allow Permissions', 'jankx')}
                        value={allow}
                        onChange={(value: string) => setAttributes({ allow: value })}
                        help={__('e.g., camera; microphone; geolocation', 'jankx')}
                        placeholder="camera; microphone"
                    />
                </PanelBody>

                <PanelBody title={__('Display Options', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Allow Fullscreen', 'jankx')}
                        checked={allowFullscreen}
                        onChange={(value: boolean) => setAttributes({ allowFullscreen: value })}
                    />
                    <SelectControl
                        label={__('Loading Strategy', 'jankx')}
                        value={loading}
                        options={[
                            { label: __('Lazy (Load when visible)', 'jankx'), value: 'lazy' },
                            { label: __('Eager (Load immediately)', 'jankx'), value: 'eager' },
                        ]}
                        onChange={(value: string) => setAttributes({ loading: value as any })}
                    />
                </PanelBody>

                <PanelBody title={__('Styling', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Border', 'jankx')}
                        checked={showBorder}
                        onChange={(value: boolean) => setAttributes({ showBorder: value })}
                    />
                    {showBorder && (
                        <>
                            <RangeControl
                                label={__('Border Width', 'jankx')}
                                value={borderWidth}
                                onChange={(value?: number) => setAttributes({ borderWidth: value || 1 })}
                                min={1}
                                max={10}
                            />
                            <BaseControl label={__('Border Color', 'jankx')}>
                                <input
                                    type="color"
                                    value={borderColor}
                                    onChange={(e) => setAttributes({ borderColor: e.target.value })}
                                    style={{ width: '100%', height: '40px', cursor: 'pointer' }}
                                />
                            </BaseControl>
                        </>
                    )}
                    <RangeControl
                        label={__('Border Radius', 'jankx')}
                        value={borderRadius}
                        onChange={(value?: number) => setAttributes({ borderRadius: value || 0 })}
                        min={0}
                        max={50}
                    />
                    <ToggleControl
                        label={__('Show Shadow', 'jankx')}
                        checked={showShadow}
                        onChange={(value: boolean) => setAttributes({ showShadow: value })}
                    />
                    <TextControl
                        label={__('Custom CSS', 'jankx')}
                        value={customCSS}
                        onChange={(value: string) => setAttributes({ customCSS: value })}
                        help={__('Additional CSS for the iframe container', 'jankx')}
                        placeholder=".safe-iframe-block { ... }"
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {!url ? (
                    <div className="safe-iframe-placeholder">
                        <div className="safe-iframe-placeholder__icon">🖼️</div>
                        <p className="safe-iframe-placeholder__text">
                            {__('Enter an iframe URL in the block settings', 'jankx')}
                        </p>
                    </div>
                ) : !isValidUrl ? (
                    <div className="safe-iframe-error">
                        <div className="safe-iframe-error__icon">⚠️</div>
                        <p className="safe-iframe-error__text">
                            {__('Invalid URL. Please check the URL and try again.', 'jankx')}
                        </p>
                    </div>
                ) : (
                    <div style={containerStyles}>
                        <div style={iframeContainerStyles}>
                            <iframe
                                src={url}
                                title={title}
                                style={iframeStyles}
                                sandbox={sandboxValue || undefined}
                                allow={allowValue}
                                allowFullScreen={allowFullscreen}
                                loading={loading}
                            />
                        </div>
                    </div>
                )}
                {customCSS && (
                    <style dangerouslySetInnerHTML={{ __html: customCSS }} />
                )}
            </div>
        </>
    );
}

function Save() {
    return null; // Dynamic block, rendered via PHP
}

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit as any,
    save: Save,
} as any);

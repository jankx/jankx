import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    RichText,
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl
} from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Widget Renderer Block Editor Component
 *
 * This component handles the editor interface for the widget renderer block.
 * It provides controls to select widget type, configure settings, and preview
 * the widget output in the editor.
 */
function WidgetRendererEdit({ attributes, setAttributes }) {
    const {
        widgetId,
        widgetType,
        title,
        showTitle,
        className
    } = attributes;

    const [availableWidgets, setAvailableWidgets] = useState([]);
    const [widgetPreview, setWidgetPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const blockProps = useBlockProps({
        className: `widget-renderer-block ${className || ''}`
    });

    // Fetch available widgets on component mount
    useEffect(() => {
        const fetchWidgets = async () => {
            try {
                const response = await apiFetch({
                    path: '/jankx/v1/widgets/available',
                    method: 'GET'
                });
                setAvailableWidgets(response || []);
            } catch (error) {
                console.error('Failed to fetch available widgets:', error);
                setAvailableWidgets([]);
            }
        };

        fetchWidgets();
    }, []);

    // Fetch widget preview when widget type changes
    useEffect(() => {
        if (!widgetType) {
            setWidgetPreview('');
            return;
        }

        const fetchPreview = async () => {
            setIsLoading(true);
            try {
                const response = await apiFetch({
                    path: '/jankx/v1/widgets/preview',
                    method: 'POST',
                    data: {
                        widget_type: widgetType,
                        widget_id: widgetId,
                        title: title,
                        show_title: showTitle
                    }
                });
                setWidgetPreview(response.html || '');
            } catch (error) {
                console.error('Failed to fetch widget preview:', error);
                setWidgetPreview('<p>Error loading widget preview</p>');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreview();
    }, [widgetType, widgetId, title, showTitle]);

    const widgetOptions = [
        { label: __('Select a widget', 'jankx'), value: '' },
        ...availableWidgets.map(widget => ({
            label: widget.title,
            value: widget.id
        }))
    ];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Widget Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Widget Type', 'jankx')}
                        value={widgetType}
                        options={widgetOptions}
                        onChange={(value) => {
                            setAttributes({ widgetType: value });
                            if (value) {
                                setAttributes({ widgetId: value });
                            }
                        }}
                    />

                    <TextControl
                        label={__('Widget ID', 'jankx')}
                        value={widgetId}
                        onChange={(value) => setAttributes({ widgetId: value })}
                        help={__('Optional: Specify a specific widget instance ID', 'jankx')}
                    />

                    <RichText
                        tagName="h3"
                        label={__('Widget Title', 'jankx')}
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Enter widget title...', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Title', 'jankx')}
                        checked={showTitle}
                        onChange={(value) => setAttributes({ showTitle: value })}
                        help={__('Display the widget title', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {!widgetType ? (
                    <div className="widget-renderer-placeholder">
                        <p>{__('Select a widget type from the block settings to display here.', 'jankx')}</p>
                    </div>
                ) : isLoading ? (
                    <div className="widget-renderer-loading">
                        <p>{__('Loading widget preview...', 'jankx')}</p>
                    </div>
                ) : (
                    <div
                        className="widget-renderer-preview"
                        dangerouslySetInnerHTML={{ __html: widgetPreview }}
                    />
                )}
            </div>
        </>
    );
}

/**
 * Register the Widget Renderer Block
 *
 * This block allows users to render WordPress widgets within Gutenberg blocks.
 * It provides a dynamic interface for selecting and configuring widgets.
 */
registerBlockType('jankx/widget-renderer', {
    edit: WidgetRendererEdit,

    // No save function needed as this is a dynamic block
    // The content will be rendered server-side via render_callback
});

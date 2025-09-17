import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import './style.css';

// Define block attributes interface
interface ViewsBlockAttributes {
    showIcon: boolean;
    showLabel: boolean;
    label: string;
    postId: number;
}

// Define block edit props
interface ViewsBlockEditProps {
    attributes: ViewsBlockAttributes;
    setAttributes: (attributes: Partial<ViewsBlockAttributes>) => void;
}

// Format view count utility function
const formatViews = (views: number): string => {
    if (views >= 1000000) {
        return Math.round(views / 1000000 * 10) / 10 + 'M';
    } else if (views >= 1000) {
        return Math.round(views / 1000 * 10) / 10 + 'K';
    }
    return views.toLocaleString();
};

registerBlockType<ViewsBlockAttributes>('jankx/views', {
    title: __('Post Views', 'jankx'),
    category: 'widgets',
    icon: 'visibility',
    description: __('Display post view count', 'jankx'),
    attributes: {
        showIcon: {
            type: 'boolean',
            default: true
        },
        showLabel: {
            type: 'boolean',
            default: true
        },
        label: {
            type: 'string',
            default: 'lượt xem'
        },
        postId: {
            type: 'number',
            default: 0
        }
    },
    edit: function Edit({ attributes, setAttributes }: ViewsBlockEditProps) {
        const { showIcon, showLabel, label, postId } = attributes;
        const [viewCount, setViewCount] = useState<number>(0);

        const blockProps = useBlockProps({
            className: 'jankx-views-block'
        });

        // Simulate view count for editor preview
        useEffect(() => {
            setViewCount(Math.floor(Math.random() * 1000) + 100);
        }, []);

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Settings', 'jankx')}>
                        <ToggleControl
                            label={__('Show Icon', 'jankx')}
                            checked={showIcon}
                            onChange={(value: boolean) => setAttributes({ showIcon: value })}
                        />
                        <ToggleControl
                            label={__('Show Label', 'jankx')}
                            checked={showLabel}
                            onChange={(value: boolean) => setAttributes({ showLabel: value })}
                        />
                        {showLabel && (
                            <TextControl
                                label={__('Label Text', 'jankx')}
                                value={label}
                                onChange={(value: string) => setAttributes({ label: value })}
                            />
                        )}
                        <TextControl
                            label={__('Post ID (0 = current post)', 'jankx')}
                            value={postId.toString()}
                            onChange={(value: string) => setAttributes({ postId: parseInt(value) || 0 })}
                            type="number"
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className="views-content">
                        {showIcon && (
                            <span className="views-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                </svg>
                            </span>
                        )}

                        <span className="views-count">{formatViews(viewCount)}</span>

                        {showLabel && (
                            <span className="views-label">{label}</span>
                        )}
                    </div>
                </div>
            </>
        );
    },

    save: function save(): null {
        return null; // Dynamic block
    }
});

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, TextControl, ColorPalette, ToggleControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

interface Attributes {
    ratingSource: 'manual' | 'woocommerce' | 'meta' | 'crawler';
    manualRating: number;
    metaKey: string;
    crawlerTable: string;
    starSize: number;
    starColor: string;
    starEmptyColor: string;
    showCount: boolean;
    showScoreText: boolean;
    countMetaKey: string;
    align?: string;
    iconType: 'text' | 'svg';
    svgFull: string;
    svgHalf: string;
    svgEmpty: string;
}

interface EditProps {
    attributes: Attributes;
    setAttributes: (attributes: Partial<Attributes>) => void;
}

const DEFAULT_SVG_FULL = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
const DEFAULT_SVG_HALF = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>';
const DEFAULT_SVG_EMPTY = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>';

const Edit = ({ attributes, setAttributes }: EditProps) => {
    const {
        ratingSource,
        manualRating,
        metaKey,
        crawlerTable,
        starSize,
        starColor,
        starEmptyColor,
        showCount,
        showScoreText,
        countMetaKey,
        iconType,
        svgFull,
        svgHalf,
        svgEmpty,
    } = attributes;

    const blockProps = useBlockProps({
        style: {
            '--star-size': `${starSize}px`,
            '--star-color': starColor,
            '--star-empty-color': starEmptyColor,
            textAlign: attributes.align,
        } as React.CSSProperties
    });

    const [rating, setRating] = useState(manualRating);

    // Mock preview update
    useEffect(() => {
        if (ratingSource === 'manual') {
            setRating(manualRating);
        } else {
            // For other sources, just show a placeholder rating in editor
            setRating(4.5);
        }
    }, [ratingSource, manualRating]);

    const renderStars = (ratingValue: number) => {
        const stars = [];
        const fullStars = Math.floor(ratingValue);
        const hasHalfStar = ratingValue % 1 >= 0.5;

        const renderIcon = (type: 'full' | 'half' | 'empty') => {
            if (iconType === 'svg') {
                let svgContent = '';
                if (type === 'full') svgContent = svgFull || DEFAULT_SVG_FULL;
                if (type === 'half') svgContent = svgHalf || DEFAULT_SVG_HALF;
                if (type === 'empty') svgContent = svgEmpty || DEFAULT_SVG_EMPTY;
                
                return <span className={`jankx-star ${type} is-svg`} dangerouslySetInnerHTML={{ __html: svgContent }} />;
            }
            return <span className={`jankx-star ${type}`}>{type === 'full' ? '★' : (type === 'half' ? '★' : '☆')}</span>;
        };

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<span key={i}>{renderIcon('full')}</span>);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<span key={i}>{renderIcon('half')}</span>);
            } else {
                stars.push(<span key={i}>{renderIcon('empty')}</span>);
            }
        }
        return stars;
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Rating Settings', 'jankx')}>
                    <SelectControl
                        label={__('Rating Source', 'jankx')}
                        value={ratingSource}
                        options={[
                            { label: __('Manual', 'jankx'), value: 'manual' },
                            { label: __('WooCommerce Product', 'jankx'), value: 'woocommerce' },
                            { label: __('Post Meta', 'jankx'), value: 'meta' },
                            { label: __('Crawler Data', 'jankx'), value: 'crawler' },
                        ]}
                        onChange={(value) => setAttributes({ ratingSource: value as any })}
                    />

                    {ratingSource === 'manual' && (
                        <RangeControl
                            label={__('Rating Value', 'jankx')}
                            value={manualRating}
                            onChange={(value) => setAttributes({ manualRating: value || 0 })}
                            min={0}
                            max={5}
                            step={0.1}
                        />
                    )}

                    {ratingSource === 'meta' && (
                        <TextControl
                            label={__('Meta Key', 'jankx')}
                            value={metaKey}
                            onChange={(value) => setAttributes({ metaKey: value })}
                            help={__('Enter the custom field name for rating score.', 'jankx')}
                        />
                    )}

                    {ratingSource === 'crawler' && (
                        <TextControl
                            label={__('Crawler Table', 'jankx')}
                            value={crawlerTable}
                            onChange={(value) => setAttributes({ crawlerTable: value })}
                            help={__('Enter the custom table name if needed.', 'jankx')}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Visual Settings', 'jankx')}>
                    <RangeControl
                        label={__('Star Size (px)', 'jankx')}
                        value={starSize}
                        onChange={(value) => setAttributes({ starSize: value || 16 })}
                        min={10}
                        max={50}
                    />
                    
                    <p>{__('Star Filled Color', 'jankx')}</p>
                    <ColorPalette
                        value={starColor}
                        onChange={(value) => setAttributes({ starColor: value })}
                    />

                    <p>{__('Star Empty Color', 'jankx')}</p>
                    <ColorPalette
                        value={starEmptyColor}
                        onChange={(value) => setAttributes({ starEmptyColor: value })}
                    />

                    <SelectControl
                        label={__('Icon Type', 'jankx')}
                        value={iconType}
                        options={[
                            { label: __('Text (★)', 'jankx'), value: 'text' },
                            { label: __('Custom SVG', 'jankx'), value: 'svg' },
                        ]}
                        onChange={(value) => setAttributes({ iconType: value as any })}
                    />

                    {iconType === 'svg' && (
                        <>
                            <TextareaControl
                                label={__('Full Star SVG', 'jankx')}
                                value={svgFull}
                                onChange={(value) => setAttributes({ svgFull: value })}
                                help={__('Paste SVG code for full star.', 'jankx')}
                            />
                            <TextareaControl
                                label={__('Half Star SVG', 'jankx')}
                                value={svgHalf}
                                onChange={(value) => setAttributes({ svgHalf: value })}
                                help={__('Paste SVG code for half star.', 'jankx')}
                            />
                            <TextareaControl
                                label={__('Empty Star SVG', 'jankx')}
                                value={svgEmpty}
                                onChange={(value) => setAttributes({ svgEmpty: value })}
                                help={__('Paste SVG code for empty star.', 'jankx')}
                            />
                        </>
                    )}

                    <ToggleControl
                        label={__('Show Rating Count', 'jankx')}
                        checked={showCount}
                        onChange={(value) => setAttributes({ showCount: value })}
                    />
                    <ToggleControl
                        label={__('Show Score Text (x.x/5.0)', 'jankx')}
                        checked={showScoreText}
                        onChange={(value) => setAttributes({ showScoreText: value })}
                    />

                    {showCount && (ratingSource === 'meta' || ratingSource === 'crawler') && (
                        <TextControl
                            label={__('Count Meta Key', 'jankx')}
                            value={countMetaKey}
                            onChange={(value) => setAttributes({ countMetaKey: value })}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="jankx-star-rating">
                    <div className="jankx-stars">
                        {renderStars(rating)}
                    </div>
                    {showScoreText && (
                        <span className="jankx-rating-text">
                            ({Number.isFinite(rating) ? rating.toFixed(1) : '0.0'}/5.0)
                        </span>
                    )}
                    {showCount && (
                        <span className="jankx-rating-count">
                            (123)
                        </span>
                    )}
                </div>
                {ratingSource !== 'manual' && (
                    <div className="jankx-block-placeholder-info">
                        {__(`Previewing ${ratingSource} rating`, 'jankx')}
                    </div>
                )}
            </div>
        </>
    );
};

export default Edit;

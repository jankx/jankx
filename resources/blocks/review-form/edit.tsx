import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, TextControl, TextareaControl, ColorPalette, ToggleControl, SelectControl, Button, Placeholder, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

interface Attributes {
    postId: number;
    maxRating: number;
    showReview: boolean;
    showProsCons: boolean;
    showLoginForm: boolean;
    formTitle: string;
    submitText: string;
    starSize: number;
    starColor: string;
    starEmptyColor: string;
    customCSS: string;
    align?: string;
    className?: string;
    [key: string]: unknown;
}

interface EditProps {
    attributes: Attributes;
    setAttributes: (attributes: Partial<Attributes>) => void;
    clientId: string;
}

interface PostOption {
    value: number;
    label: string;
}

const Star = ({
    filled,
    size,
    color,
    emptyColor,
    onMouseEnter,
    onMouseLeave,
    onClick,
}: {
    filled: boolean;
    size: number;
    color: string;
    emptyColor: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.15s' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
    >
        <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill={filled ? color : emptyColor}
        />
    </svg>
);

const Edit = ({ attributes, setAttributes }: EditProps) => {
    const {
        postId,
        maxRating,
        showReview,
        showProsCons,
        showLoginForm,
        formTitle,
        submitText,
        starSize,
        starColor,
        starEmptyColor,
    } = attributes;

    const [hoverRating, setHoverRating] = useState(0);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [pros, setPros] = useState('');
    const [cons, setCons] = useState('');
    const [postOptions, setPostOptions] = useState<PostOption[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    // Get current post ID from editor context
    const currentPostId = useSelect(
        (select: any) => select('core/editor')?.getCurrentPostId?.() ?? 0,
        []
    );

    // Set postId to current post if not set
    useEffect(() => {
        if (!postId && currentPostId) {
            setAttributes({ postId: currentPostId });
        }
    }, [postId, currentPostId, setAttributes]);

    // Fetch posts for the post selector
    useEffect(() => {
        apiFetch<{ posts: Array<{ id: number; title: { rendered: string } }> }>({
            path: '/wp/v2/posts?per_page=50&_fields=id,title',
        })
            .then((data) => {
                const options = (data.posts || data || []).map((p: any) => ({
                    value: p.id,
                    label: p.title?.rendered || `Post #${p.id}`,
                }));
                setPostOptions(options);
            })
            .catch(() => {
                setPostOptions([]);
            })
            .finally(() => setLoadingPosts(false));
    }, []);

    const displayRating = hoverRating || rating;

    const blockProps = useBlockProps({
        style: {
            '--review-star-size': `${starSize}px`,
            '--review-star-color': starColor,
            '--review-star-empty-color': starEmptyColor,
        } as React.CSSProperties,
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Form Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Post (auto-detected)', 'jankx')}
                        value={String(postId || currentPostId)}
                        options={[
                            { value: 0, label: __('Auto-detect from editor', 'jankx') },
                            ...postOptions,
                        ]}
                        onChange={(value) => setAttributes({ postId: Number(value) })}
                        help={__('Select which post this form submits ratings for.', 'jankx')}
                    />

                    <RangeControl
                        label={__('Max Stars', 'jankx')}
                        value={maxRating}
                        onChange={(value) => setAttributes({ maxRating: value || 5 })}
                        min={3}
                        max={10}
                    />

                    <TextControl
                        label={__('Form Title', 'jankx')}
                        value={formTitle}
                        onChange={(value) => setAttributes({ formTitle: value })}
                        placeholder={__('Leave a Review', 'jankx')}
                    />

                    <TextControl
                        label={__('Submit Button Text', 'jankx')}
                        value={submitText}
                        onChange={(value) => setAttributes({ submitText: value })}
                        placeholder={__('Submit Review', 'jankx')}
                    />
                </PanelBody>

                <PanelBody title={__('Form Fields', 'jankx')}>
                    <ToggleControl
                        label={__('Show Review Textarea', 'jankx')}
                        checked={showReview}
                        onChange={(value) => setAttributes({ showReview: value })}
                    />

                    <ToggleControl
                        label={__('Show Pros & Cons', 'jankx')}
                        checked={showProsCons}
                        onChange={(value) => setAttributes({ showProsCons: value })}
                        help={__('Display separate fields for pros and cons.', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Login Form', 'jankx')}
                        checked={showLoginForm}
                        onChange={(value) => setAttributes({ showLoginForm: value })}
                        help={__('Show login form for guests.', 'jankx')}
                    />
                </PanelBody>

                <PanelBody title={__('Visual Settings', 'jankx')}>
                    <RangeControl
                        label={__('Star Size (px)', 'jankx')}
                        value={starSize}
                        onChange={(value) => setAttributes({ starSize: value || 32 })}
                        min={20}
                        max={60}
                    />

                    <p>{__('Star Color', 'jankx')}</p>
                    <ColorPalette
                        value={starColor}
                        onChange={(value) => setAttributes({ starColor: value || '#f1c40f' })}
                    />

                    <p>{__('Empty Star Color', 'jankx')}</p>
                    <ColorPalette
                        value={starEmptyColor}
                        onChange={(value) => setAttributes({ starEmptyColor: value || '#dddddd' })}
                    />
                </PanelBody>

                <PanelBody title={__('Custom CSS', 'jankx')} initialOpen={false}>
                    <TextareaControl
                        value={customCSS}
                        onChange={(value) => setAttributes({ customCSS: value })}
                        help={__('Add custom CSS for this form.', 'jankx')}
                        rows={6}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="jankx-review-form-preview">
                    {formTitle && (
                        <h3 className="jankx-review-form-preview__title">{formTitle}</h3>
                    )}

                    {/* Star Rating Picker */}
                    <div className="jankx-review-form-preview__stars">
                        <span className="jankx-review-form-preview__label">
                            {__('Your Rating:', 'jankx')}
                        </span>
                        <div className="jankx-review-form-preview__star-list">
                            {Array.from({ length: maxRating }, (_, i) => i + 1).map((value) => (
                                <Star
                                    key={value}
                                    filled={value <= displayRating}
                                    size={starSize}
                                    color={starColor}
                                    emptyColor={starEmptyColor}
                                    onMouseEnter={() => setHoverRating(value)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(value)}
                                />
                            ))}
                        </div>
                        {displayRating > 0 && (
                            <span className="jankx-review-form-preview__rating-text">
                                {displayRating}/{maxRating}
                            </span>
                        )}
                    </div>

                    {/* Review Textarea */}
                    {showReview && (
                        <div className="jankx-review-form-preview__field">
                            <label className="jankx-review-form-preview__label">
                                {__('Your Review:', 'jankx')}
                            </label>
                            <textarea
                                className="jankx-review-form-preview__textarea"
                                placeholder={__('Write your review here...', 'jankx')}
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}

                    {/* Pros & Cons */}
                    {showProsCons && (
                        <div className="jankx-review-form-preview__pros-cons">
                            <div className="jankx-review-form-preview__field">
                                <label className="jankx-review-form-preview__label jankx-review-form-preview__label--pros">
                                    {__('Pros', 'jankx')}
                                </label>
                                <textarea
                                    className="jankx-review-form-preview__textarea"
                                    placeholder={__('One point per line...', 'jankx')}
                                    value={pros}
                                    onChange={(e) => setPros(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="jankx-review-form-preview__field">
                                <label className="jankx-review-form-preview__label jankx-review-form-preview__label--cons">
                                    {__('Cons', 'jankx')}
                                </label>
                                <textarea
                                    className="jankx-review-form-preview__textarea"
                                    placeholder={__('One point per line...', 'jankx')}
                                    value={cons}
                                    onChange={(e) => setCons(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="jankx-review-form-preview__submit">
                        <button className="jankx-review-form-preview__button" type="button">
                            {submitText || __('Submit Review', 'jankx')}
                        </button>
                    </div>

                    <p className="jankx-review-form-preview__note">
                        {__('This is a preview. The form will be functional on the frontend.', 'jankx')}
                    </p>
                </div>
            </div>
        </>
    );
};

export default Edit;

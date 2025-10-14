import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';

interface AuthorBoxAttributes {
    authorId: number;
    showAvatar: boolean;
    showBio: boolean;
    showSocial: boolean;
    layout: 'horizontal' | 'vertical';
    avatarSize: 'small' | 'medium' | 'large' | 'xlarge';
    textAlign: 'left' | 'center' | 'right';
    authorTitle: string;
}

interface EditProps {
    attributes: AuthorBoxAttributes;
    setAttributes: (attrs: Partial<AuthorBoxAttributes>) => void;
    clientId: string;
}

function Edit({ attributes, setAttributes }: EditProps): JSX.Element {
    const {
        authorId,
        showAvatar,
        showBio,
        showSocial,
        layout,
        avatarSize,
        textAlign,
        authorTitle
    } = attributes;

    const [author, setAuthor] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Get current post author if no authorId is set
    const currentPostAuthor = useSelect((select) => {
        const { getCurrentPost } = select('core/editor');
        const post = getCurrentPost();
        return post?.author || 0;
    }, []);

    // Get authors list
    const authors = useSelect((select) => {
        const { getUsers } = select(coreDataStore);
        return getUsers({ per_page: -1, who: 'authors' }) || [];
    }, []);

    const authorOptions = authors.map((author: any) => ({
        label: author.name,
        value: author.id
    }));

    // Load author data
    useEffect(() => {
        const targetAuthorId = authorId || currentPostAuthor;
        if (targetAuthorId) {
            setLoading(true);
            const targetAuthor = authors.find((a: any) => a.id === targetAuthorId);
            setAuthor(targetAuthor);
            setLoading(false);
        }
    }, [authorId, currentPostAuthor, authors]);

    const blockProps = useBlockProps({
        className: 'jankx-author-box'
    });

    const updateAttribute = (key: keyof AuthorBoxAttributes, value: any): void => {
        setAttributes({ [key]: value });
    };

    const renderPreview = () => {
        if (loading) {
            return (
                <div className="jankx-author-box-preview-loading">
                    <div className="jankx-author-box-preview-loading__spinner"></div>
                    <p>{__('Loading author data...', 'jankx')}</p>
                </div>
            );
        }

        if (!author) {
            return (
                <div className="jankx-author-box-preview-empty">
                    <p>{__('No author selected', 'jankx')}</p>
                </div>
            );
        }

        const authorAvatar = author.avatar_urls?.[avatarSize === 'small' ? '48' : avatarSize === 'medium' ? '96' : avatarSize === 'large' ? '150' : '200'] || '';
        const authorBio = author.description || '';

        return (
            <div
                className={`jankx-author-box-preview jankx-author-box-preview--${layout} jankx-author-box-preview--align-${textAlign}`}
            >
                <div className="jankx-author-box-preview__content">
                    {showAvatar && authorAvatar && (
                        <div className="jankx-author-box-preview__avatar">
                            <img
                                src={authorAvatar}
                                alt={author.name}
                                className="jankx-author-box-preview__avatar-img"
                            />
                        </div>
                    )}

                    <div className="jankx-author-box-preview__info">
                        <h3 className="jankx-author-box-preview__name">
                            {authorTitle && `${authorTitle}: `}{author.name}
                        </h3>

                        {showBio && authorBio && (
                            <div className="jankx-author-box-preview__bio">
                                {authorBio}
                            </div>
                        )}

                        {showSocial && (
                            <div className="jankx-author-box-preview__social">
                                <span className="jankx-author-box-preview__social-placeholder">
                                    {__('Social links will appear here', 'jankx')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div {...blockProps}>
                {renderPreview()}
            </div>

            <InspectorControls>
                <PanelBody title={__('Author Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Select Author', 'jankx')}
                        value={authorId || currentPostAuthor}
                        options={[
                            { label: __('Current Post Author', 'jankx'), value: currentPostAuthor },
                            ...authorOptions
                        ]}
                        onChange={(value) => updateAttribute('authorId', parseInt(value))}
                        help={__('Choose which author to display', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Avatar', 'jankx')}
                        checked={showAvatar}
                        onChange={(value) => updateAttribute('showAvatar', value)}
                    />

                    <ToggleControl
                        label={__('Show Bio', 'jankx')}
                        checked={showBio}
                        onChange={(value) => updateAttribute('showBio', value)}
                    />

                    <ToggleControl
                        label={__('Show Social Links', 'jankx')}
                        checked={showSocial}
                        onChange={(value) => updateAttribute('showSocial', value)}
                    />
                </PanelBody>

                <PanelBody title={__('Layout Settings', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Layout', 'jankx')}
                        value={layout}
                        options={[
                            { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                            { label: __('Vertical', 'jankx'), value: 'vertical' }
                        ]}
                        onChange={(value) => updateAttribute('layout', value)}
                    />

                    <SelectControl
                        label={__('Avatar Size', 'jankx')}
                        value={avatarSize}
                        options={[
                            { label: __('Small (48px)', 'jankx'), value: 'small' },
                            { label: __('Medium (96px)', 'jankx'), value: 'medium' },
                            { label: __('Large (150px)', 'jankx'), value: 'large' },
                            { label: __('Extra Large (200px)', 'jankx'), value: 'xlarge' }
                        ]}
                        onChange={(value) => updateAttribute('avatarSize', value)}
                    />

                    <SelectControl
                        label={__('Text Alignment', 'jankx')}
                        value={textAlign}
                        options={[
                            { label: __('Left', 'jankx'), value: 'left' },
                            { label: __('Center', 'jankx'), value: 'center' },
                            { label: __('Right', 'jankx'), value: 'right' }
                        ]}
                        onChange={(value) => updateAttribute('textAlign', value)}
                    />

                    <TextControl
                        label={__('Author Title/Prefix', 'jankx')}
                        value={authorTitle}
                        onChange={(value) => updateAttribute('authorTitle', value)}
                        help={__('Text to display before author name (e.g., "Tác giả", "Author", "By")', 'jankx')}
                        placeholder={__('Tác giả', 'jankx')}
                    />
                </PanelBody>

            </InspectorControls>
        </>
    );
}

registerBlockType('jankx/author-box', {
    title: __('Author Box', 'jankx'),
    description: __('Display author information with avatar, name, and bio', 'jankx'),
    category: 'jankx',
    icon: 'admin-users',
    keywords: [
        __('author', 'jankx'),
        __('profile', 'jankx'),
        __('bio', 'jankx'),
        __('avatar', 'jankx')
    ],
    supports: {
        html: false,
        align: ['wide', 'full'],
        customClassName: true,
        reusable: true
    },
    attributes: {
        authorId: { type: 'number', default: 0 },
        showAvatar: { type: 'boolean', default: true },
        showBio: { type: 'boolean', default: true },
        showSocial: { type: 'boolean', default: false },
        layout: { type: 'string', default: 'horizontal' },
        avatarSize: { type: 'string', default: 'medium' },
        textAlign: { type: 'string', default: 'left' },
        authorTitle: { type: 'string', default: 'Tác giả' }
    },
    edit: Edit,
    save: () => null
});

import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
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

    const blockProps = useBlockProps.save({
        className: 'jankx-author-box'
    });

    // Validate required attributes
    const validateAttributes = () => {
        const errors = [];

        if (authorId && (typeof authorId !== 'number' || authorId < 0)) {
            errors.push('authorId must be a non-negative number');
        }

        if (typeof showAvatar !== 'boolean') {
            errors.push('showAvatar must be a boolean');
        }

        if (typeof showBio !== 'boolean') {
            errors.push('showBio must be a boolean');
        }

        if (typeof showSocial !== 'boolean') {
            errors.push('showSocial must be a boolean');
        }

        if (!['horizontal', 'vertical'].includes(layout)) {
            errors.push('layout must be either horizontal or vertical');
        }

        if (!['small', 'medium', 'large', 'xlarge'].includes(avatarSize)) {
            errors.push('avatarSize must be one of: small, medium, large, xlarge');
        }

        if (!['left', 'center', 'right'].includes(textAlign)) {
            errors.push('textAlign must be one of: left, center, right');
        }

        if (errors.length > 0) {
            throw new Error(`Author Box Block Configuration Error: ${errors.join(', ')}`);
        }
    };

    try {
        // Validate attributes before rendering
        validateAttributes();
    } catch (error) {
        console.error('Author Box Block Error:', error.message);
        // Return error state instead of crashing
        return (
            <div {...blockProps}>
                <div className="jankx-author-box-error">
                    <p>Lỗi cấu hình block: {error.message}</p>
                </div>
            </div>
        );
    }

    // Embed configuration as JSON for frontend JavaScript
    const config = {
        authorId: authorId || 0,
        showAvatar: showAvatar !== false,
        showBio: showBio !== false,
        showSocial: showSocial === true,
        layout: layout || 'horizontal',
        avatarSize: avatarSize || 'medium',
        textAlign: textAlign || 'left',
        authorTitle: authorTitle || 'Tác giả'
    };

    return (
        <div {...blockProps}>
            <div
                className="jankx-author-box-config"
                data-config={JSON.stringify(config)}
                style={{ display: 'none' }}
            />
            <div className="jankx-author-box-content">
                <div className="jankx-author-box-loading">
                    <div className="jankx-author-box-loading__spinner"></div>
                    <p>Đang tải thông tin tác giả...</p>
                </div>
            </div>
        </div>
    );
}

import { useBlockProps, RichText } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
    const {
        text,
        url,
        linkTarget,
        rel,
        buttonType,
        buttonSize,
        buttonStyle,
        buttonWidth,
        iconPosition,
        iconSpacing,
        showIcon,
        customClassName,
        anchor
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `jankx-button-with-icon jankx-button-with-icon--${buttonType} jankx-button-with-icon--${buttonSize} jankx-button-with-icon--${buttonStyle} ${customClassName || ''}`.trim(),
        id: anchor || undefined
    });

    const buttonClasses = [
        'jankx-button-with-icon__button',
        `jankx-button-with-icon__button--${buttonType}`,
        `jankx-button-with-icon__button--${buttonSize}`,
        `jankx-button-with-icon__button--${buttonStyle}`,
        buttonWidth === 'full' ? 'jankx-button-with-icon__button--full-width' : ''
    ].filter(Boolean).join(' ');

    const buttonStyle = {
        width: buttonWidth === 'custom' ? '200px' : 'auto'
    };

    const renderButtonContent = () => {
        const content = [];
        
        if (showIcon && iconPosition === 'left') {
            content.push(
                <span key="left-icon" className="jankx-button-with-icon__icon jankx-button-with-icon__icon--left">
                    <i className="material-icons">arrow_forward</i>
                </span>
            );
        }

        content.push(
            <RichText.Content
                key="button-text"
                tagName="span"
                value={text}
                className="jankx-button-with-icon__text"
            />
        );

        if (showIcon && iconPosition === 'right') {
            content.push(
                <span key="right-icon" className="jankx-button-with-icon__icon jankx-button-with-icon__icon--right">
                    <i className="material-icons">arrow_forward</i>
                </span>
            );
        }

        return content;
    };

    if (url) {
        return (
            <div {...blockProps}>
                <a
                    href={url}
                    target={linkTarget}
                    rel={rel}
                    className={buttonClasses}
                    style={buttonStyle}
                >
                    {renderButtonContent()}
                </a>
            </div>
        );
    }

    return (
        <div {...blockProps}>
            <button
                type="button"
                className={buttonClasses}
                style={buttonStyle}
            >
                {renderButtonContent()}
            </button>
        </div>
    );
};

export default Save;

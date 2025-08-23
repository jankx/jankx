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
        iconType,
        fontIcon,
        customIcon,
        iconSize,
        customClassName,
        anchor
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `jankx-icon-button jankx-icon-button--${buttonType} jankx-icon-button--${buttonSize} jankx-icon-button--${buttonStyle} ${customClassName || ''}`.trim(),
        id: anchor || undefined
    });

    const buttonClasses = [
        'jankx-icon-button__button',
        `jankx-icon-button__button--${buttonType}`,
        `jankx-icon-button__button--${buttonSize}`,
        `jankx-icon-button__button--${buttonStyle}`,
        buttonWidth === 'full' ? 'jankx-icon-button__button--full-width' : ''
    ].filter(Boolean).join(' ');

    const buttonStyle = {
        width: buttonWidth === 'custom' ? '200px' : 'auto'
    };

    const renderButtonContent = () => {
        const content = [];

        if (showIcon && iconPosition === 'left') {
            content.push(
                <span key="left-icon" className="jankx-icon-button__icon jankx-icon-button__icon--left">
                    {iconType === 'font' ? (
                        <i className="material-icons" style={{ fontSize: iconSize }}>{fontIcon}</i>
                    ) : customIcon ? (
                        <img
                            src={customIcon.url}
                            alt={customIcon.alt}
                            style={{
                                width: iconSize,
                                height: iconSize,
                                objectFit: 'contain'
                            }}
                        />
                    ) : (
                        <i className="material-icons" style={{ fontSize: iconSize }}>arrow_forward</i>
                    )}
                </span>
            );
        }

        content.push(
            <RichText.Content
                key="button-text"
                tagName="span"
                value={text}
                className="jankx-icon-button__text"
            />
        );

        if (showIcon && iconPosition === 'right') {
            content.push(
                <span key="right-icon" className="jankx-icon-button__icon jankx-icon-button__icon--right">
                    {iconType === 'font' ? (
                        <i className="material-icons" style={{ fontSize: iconSize }}>{fontIcon}</i>
                    ) : customIcon ? (
                        <img
                            src={customIcon.url}
                            alt={customIcon.alt}
                            style={{
                                width: iconSize,
                                height: iconSize,
                                objectFit: 'contain'
                            }}
                        />
                    ) : (
                        <i className="material-icons" style={{ fontSize: iconSize }}>arrow_forward</i>
                    )}
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

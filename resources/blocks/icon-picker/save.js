import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
    const {
        iconName,
        iconType,
        iconCategory,
        iconSize,
        iconColor,
        iconAlignment,
        iconStyle,
        linkUrl,
        linkTarget,
        linkRel,
        showLabel,
        iconLabel,
        labelPosition,
        customClassName
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `jankx-icon-picker-block jankx-icon-picker-block--${iconAlignment} ${customClassName || ''}`.trim()
    });

    const renderIcon = () => {
        if (!iconName) {
            return null;
        }

        if (iconType === 'material') {
            const styleClass = iconStyle !== 'filled' ? `material-icons-${iconStyle}` : 'material-icons';
            return (
                <span 
                    className={styleClass}
                    style={{ fontSize: iconSize, color: iconColor }}
                >
                    {iconName}
                </span>
            );
        } else if (iconType === 'fontawesome') {
            const prefix = iconCategory === 'brands' ? 'fab' : 
                          iconCategory === 'regular' ? 'far' : 'fas';
            return (
                <i 
                    className={`${prefix} fa-${iconName}`}
                    style={{ fontSize: iconSize, color: iconColor }}
                ></i>
            );
        } else if (iconType === 'custom') {
            return (
                <span 
                    className={`icon icon-${iconName}`}
                    style={{ fontSize: iconSize, color: iconColor }}
                ></span>
            );
        }

        return null;
    };

    const renderContent = () => {
        const iconElement = renderIcon();
        
        if (linkUrl) {
            return (
                <a 
                    href={linkUrl}
                    target={linkTarget}
                    rel={linkRel}
                    className="jankx-icon-picker-block__link"
                >
                    {iconElement}
                    {showLabel && iconLabel && (
                        <span className={`jankx-icon-picker-block__label jankx-icon-picker-block__label--${labelPosition}`}>
                            {iconLabel}
                        </span>
                    )}
                </a>
            );
        }

        return (
            <>
                {iconElement}
                {showLabel && iconLabel && (
                    <span className={`jankx-icon-picker-block__label jankx-icon-picker-block__label--${labelPosition}`}>
                        {iconLabel}
                    </span>
                )}
            </>
        );
    };

    return (
        <div {...blockProps}>
            <div 
                className="jankx-icon-picker-block__content"
                style={{ textAlign: iconAlignment }}
            >
                {renderContent()}
            </div>
        </div>
    );
};

export default Save;

/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Save component for Modal block
 */
export default function Save({ attributes }) {
    const {
        modalId,
        triggerType,
        triggerText,
        triggerUrl,
        triggerTarget,
        customSelector,
        modalSize,
        customWidth,
        customWidthUnit,
        closeOnOverlayClick,
        closeOnEscape,
        showCloseButton,
        animationType,
        animationDuration,
        backdropColor,
        backdropBlur,
        zIndex,
        disableScroll,
        disableFocus,
        awaitOpenAnimation,
        awaitCloseAnimation
    } = attributes;

    // Generate unique ID if not set
    const finalModalId = modalId || 'modal-' + Math.random().toString(36).substr(2, 9);

    // No wrapper - apply block props directly to modal
    const modalProps = {
        'data-close-on-overlay-click': closeOnOverlayClick,
        'data-close-on-escape': closeOnEscape,
        'data-animation-type': animationType,
        'data-backdrop-blur': backdropBlur,
        'data-modal-id': finalModalId,
        'data-disable-scroll': disableScroll,
        'data-disable-focus': disableFocus,
        'data-await-open-animation': awaitOpenAnimation,
        'data-await-close-animation': awaitCloseAnimation
    };

    const innerBlocksProps = useInnerBlocksProps.save({
        className: 'wp-block-jankx-modal__content-inner'
    });
    const triggerId = finalModalId + '-trigger';
    const modalContentId = finalModalId + '-content';

    // Build trigger HTML
    const renderTrigger = () => {
        switch (triggerType) {
            case 'button':
                return (
                    <button
                        type="button"
                        id={triggerId}
                        className="wp-block-jankx-modal__trigger"
                        data-micromodal-trigger={finalModalId}
                    >
                        {triggerText || 'Open Modal'}
                    </button>
                );
            case 'anchor':
                return (
                    <a
                        href={triggerUrl || '#'}
                        id={triggerId}
                        className="wp-block-jankx-modal__trigger"
                        data-micromodal-trigger={finalModalId}
                        target={triggerTarget}
                    >
                        {triggerText || 'Open Modal'}
                    </a>
                );
            case 'custom':
                return (
                    <div
                        className="wp-block-jankx-modal__custom-trigger"
                        data-custom-selector={customSelector}
                        data-micromodal-trigger={finalModalId}
                    />
                );
            default:
                return null;
        }
    };

    // Build modal HTML - following Micromodal structure
    const renderModal = () => {
        return (
            <div
                {...useBlockProps.save()}
                {...modalProps}
                id={finalModalId}
                className="wp-block-jankx-modal"
                aria-hidden="true"
                style={{
                    '--modal-backdrop-color': backdropColor,
                    '--modal-animation-duration': `${animationDuration}ms`,
                    '--modal-z-index': zIndex,
                    '--modal-backdrop-blur': backdropBlur ? 'blur(5px)' : 'none',
                    ...(modalSize === 'custom' && {
                        '--modal-custom-width': `${customWidth}${customWidthUnit}`
                    })
                }}
            >
                {/* [2] Overlay layer with tabindex and close trigger */}
                <div className="wp-block-jankx-modal__overlay" tabIndex="-1" data-micromodal-close>
                    {/* [3] Dialog container with role and aria attributes */}
                    <div
                        className={`wp-block-jankx-modal__container wp-block-jankx-modal__container--${modalSize}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`${finalModalId}-title`}
                    >
                        {/* Modal content area */}
                        <div className="wp-block-jankx-modal__content" id={modalContentId}>
                            {showCloseButton && (
                                <button
                                    className="wp-block-jankx-modal__close"
                                    aria-label="Close modal"
                                    data-micromodal-close
                                />
                            )}
                            <div {...innerBlocksProps} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {renderTrigger()}
            {renderModal()}
        </>
    );
}


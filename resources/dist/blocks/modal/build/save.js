import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
/**
 * Save component for Modal block
 */
export default function Save({ attributes }) {
    const { modalId, triggerType, triggerText, triggerUrl, triggerTarget, customSelector, modalSize, closeOnOverlayClick, closeOnEscape, showCloseButton, animationType, animationDuration, backdropColor, backdropBlur, zIndex } = attributes;
    const blockProps = useBlockProps.save({
        className: 'wp-block-jankx-modal-wrapper',
        'data-close-on-overlay-click': closeOnOverlayClick,
        'data-close-on-escape': closeOnEscape,
        'data-animation-type': animationType
    });
    const innerBlocksProps = useInnerBlocksProps.save({
        className: 'wp-block-jankx-modal__content'
    });
    // Generate unique ID if not set
    const finalModalId = modalId || 'modal-' + Math.random().toString(36).substr(2, 9);
    const triggerId = finalModalId + '-trigger';
    const modalContentId = finalModalId + '-content';
    // Build trigger HTML
    const renderTrigger = () => {
        switch (triggerType) {
            case 'button':
                return (_jsx("button", { type: "button", id: triggerId, className: "wp-block-jankx-modal__trigger", "data-micromodal-trigger": finalModalId, children: triggerText || 'Open Modal' }));
            case 'anchor':
                return (_jsx("a", { href: triggerUrl || '#', id: triggerId, className: "wp-block-jankx-modal__trigger", "data-micromodal-trigger": finalModalId, target: triggerTarget, children: triggerText || 'Open Modal' }));
            case 'custom':
                return (_jsx("div", { className: "wp-block-jankx-modal__custom-trigger", "data-custom-selector": customSelector, "data-micromodal-trigger": finalModalId }));
            default:
                return null;
        }
    };
    // Build modal HTML
    const renderModal = () => {
        return (_jsx("div", { id: finalModalId, className: "wp-block-jankx-modal", "aria-hidden": "true", "data-micromodal-close": true, style: {
                '--modal-backdrop-color': backdropColor,
                '--modal-animation-duration': `${animationDuration}ms`,
                '--modal-z-index': zIndex,
                '--modal-backdrop-blur': backdropBlur ? 'blur(5px)' : 'none'
            }, children: _jsx("div", { className: "wp-block-jankx-modal__overlay", tabIndex: "-1", "data-micromodal-close": true, children: _jsx("div", { className: `wp-block-jankx-modal__container wp-block-jankx-modal__container--${modalSize}`, role: "dialog", "aria-modal": "true", "aria-labelledby": `${finalModalId}-title`, children: _jsxs("div", { className: "wp-block-jankx-modal__content", id: modalContentId, children: [showCloseButton && (_jsx("button", { className: "wp-block-jankx-modal__close", "aria-label": "Close modal", "data-micromodal-close": true })), _jsx("div", { ...innerBlocksProps })] }) }) }) }));
    };
    return (_jsxs("div", { ...blockProps, children: [renderTrigger(), renderModal()] }));
}

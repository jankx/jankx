import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';
import { link, external } from '@wordpress/icons';
const LinkSettings = ({ linkUrl, linkTarget, linkRel, onLinkChange, onLinkTargetChange, onLinkRelChange }) => {
    const hasLink = !!linkUrl;
    const handleLinkChange = (newUrl) => {
        onLinkChange(newUrl);
    };
    const handleLinkTargetChange = (newTarget) => {
        onLinkTargetChange(newTarget);
    };
    const handleLinkRelChange = (newRel) => {
        onLinkRelChange(newRel);
    };
    const getLinkIcon = () => {
        if (linkTarget === '_blank') {
            return external;
        }
        return link;
    };
    return (_jsxs(PanelBody, { title: __('Link Settings', 'jankx'), icon: getLinkIcon(), initialOpen: false, children: [_jsx(TextControl, { label: __('URL', 'jankx'), value: linkUrl, onChange: handleLinkChange, placeholder: "https://example.com", help: __('Nhập URL để tạo link cho icon', 'jankx') }), _jsx(SelectControl, { label: __('Open in', 'jankx'), value: linkTarget, options: [
                    { label: __('Same window', 'jankx'), value: '_self' },
                    { label: __('New window', 'jankx'), value: '_blank' },
                    { label: __('Parent frame', 'jankx'), value: '_parent' },
                    { label: __('Top frame', 'jankx'), value: '_top' }
                ], onChange: handleLinkTargetChange }), _jsx(TextControl, { label: __('Link Rel', 'jankx'), value: linkRel, onChange: handleLinkRelChange, placeholder: "nofollow noreferrer", help: __('Thêm rel attributes cho link (tùy chọn)', 'jankx') }), hasLink && (_jsxs("div", { className: "jankx-link-settings__preview", children: [_jsx("p", { className: "jankx-link-settings__preview-text", children: __('Preview:', 'jankx') }), _jsx("a", { href: linkUrl, target: linkTarget, rel: linkRel, className: "jankx-link-settings__preview-link", children: linkUrl })] }))] }));
};
export default LinkSettings;

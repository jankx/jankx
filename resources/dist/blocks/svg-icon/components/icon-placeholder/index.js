import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Placeholder } from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import { bolt } from './../../icons/bolt';
import { parseUploadedMediaAndSetIcon } from '../../utils';
import QuickInserterPopover from './../quick-inserter';
export default function IconPlaceholder(props) {
    const { setInserterOpen, isQuickInserterOpen, setQuickInserterOpen, setCustomInserterOpen, attributes, setAttributes, enableCustomIcons, isSVGUploadAllowed, } = props;
    const instructions = () => {
        const messages = {
            default: __('Choose an icon from the library, pick one from your media library, or insert a custom SVG.', 'icon-block'),
            noCustom: __('Choose an icon from the library or pick one from your media library.', 'icon-block'),
            noMediaLibrary: __('Choose an icon from the library or insert a custom SVG.', 'icon-block'),
            noCustomNoMediaLibrary: __('Browse the icon library and choose one to insert.', 'icon-block'),
        };
        if (!enableCustomIcons && !isSVGUploadAllowed) {
            return messages.noCustomNoMediaLibrary;
        }
        else if (!enableCustomIcons) {
            return messages.noCustom;
        }
        else if (!isSVGUploadAllowed) {
            return messages.noMediaLibrary;
        }
        return messages.default;
    };
    return (_jsxs(Placeholder, { className: "has-illustration", icon: bolt, label: __('Icon', 'icon-block'), instructions: instructions(), withIllustration: true, children: [_jsx(Button, { variant: "primary", onClick: () => setQuickInserterOpen(true), children: __('Icon Library', 'icon-block') }), isSVGUploadAllowed && (_jsx(MediaUpload, { onSelect: (media) => parseUploadedMediaAndSetIcon(media, attributes, setAttributes), allowedTypes: ['image/svg+xml'], render: ({ open }) => (_jsx(Button, { variant: "secondary", onClick: open, children: __('Media Library', 'icon-block') })) })), enableCustomIcons && (_jsx(Button, { variant: "secondary", onClick: () => setCustomInserterOpen(true), children: __('Insert custom SVG', 'icon-block') })), _jsx(QuickInserterPopover, { setInserterOpen: setInserterOpen, isQuickInserterOpen: isQuickInserterOpen, setQuickInserterOpen: setQuickInserterOpen, setAttributes: setAttributes })] }));
}

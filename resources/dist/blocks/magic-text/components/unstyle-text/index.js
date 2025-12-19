import { jsx as _jsx } from "react/jsx-runtime";
import { registerFormatType, removeFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import IconUnstyle from './icon-unstyle';
const UnstyleText = ({ isActive, onChange, value }) => {
    const applyUnstyleText = () => {
        const formatTypes = select('core/rich-text').getFormatTypes();
        if (formatTypes && formatTypes.length > 0) {
            let newValue = value;
            formatTypes.forEach(formatType => {
                // console.debug('Checking format type: ', formatType.name);
                newValue = removeFormat(newValue, formatType.name);
            });
            onChange({ ...newValue });
        }
    };
    return (_jsx(RichTextToolbarButton, { icon: IconUnstyle, title: __('Unstyle Text', 'jankx'), onClick: applyUnstyleText, isActive: isActive }));
};
registerFormatType('jankx/unstyle-test', {
    title: __('Unstyle Text', 'jankx'),
    tagName: 'span',
    className: 'jankx-unstyle-text',
    edit: UnstyleText,
});

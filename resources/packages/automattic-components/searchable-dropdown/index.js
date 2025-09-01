import { jsx as _jsx } from "react/jsx-runtime";
import { ComboboxControl, Disabled } from '@wordpress/components';
import clsx from 'clsx';
import './style.scss';
export function SearchableDropdown(props) {
    const { disabled = false } = props;
    return (_jsx("div", { className: clsx('searchable-dropdown', {
            'is-disabled': disabled,
        }), children: _jsx(Disabled, { isDisabled: disabled, children: _jsx(ComboboxControl, { ...props }) }) }));
}
export default SearchableDropdown;
//# sourceMappingURL=index.js.map
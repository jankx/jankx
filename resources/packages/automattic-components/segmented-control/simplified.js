import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState } from 'react';
import SegmentedControl from '.';
function SimplifiedSegmentedControl({ options, initialSelected = options[0].value, onSelect, ...props }) {
    const [selected, setSelected] = useState(initialSelected);
    const renderedOptions = options.map((option, index) => (_jsx(SegmentedControl.Item, { index: index, onClick: () => {
            setSelected(option.value);
            if (typeof onSelect === 'function') {
                onSelect(option);
            }
        }, path: option.path, selected: selected === option.value, value: option.value, children: option.label }, index)));
    return _jsx(SegmentedControl, { ...props, children: renderedOptions });
}
SimplifiedSegmentedControl.propTypes = {
    className: PropTypes.string,
    compact: PropTypes.bool,
    primary: PropTypes.bool,
    style: PropTypes.object,
    initialSelected: PropTypes.string,
    onSelect: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        path: PropTypes.string,
    })).isRequired,
};
export default SimplifiedSegmentedControl;
//# sourceMappingURL=simplified.js.map
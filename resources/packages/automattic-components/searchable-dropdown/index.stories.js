import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import SearchableDropdown from './index';
const meta = {
    title: 'Unaudited/SearchableDropdown',
    component: SearchableDropdown,
};
export default meta;
export const Default = {
    render: function Template(props) {
        const [value, onChange] = useState('home');
        return _jsx(SearchableDropdown, { value: value, onChange: onChange, ...props });
    },
    args: {
        options: [
            {
                label: 'Home',
                value: 'home',
            },
        ],
    },
};
//# sourceMappingURL=index.stories.js.map
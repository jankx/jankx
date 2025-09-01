import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable no-console */
import { useState } from 'react';
import SimplifiedSegmentedControl from './simplified';
import SegmentedControl from './';
export default {
    title: 'Unaudited/SegmentedControl',
    component: SegmentedControl,
    argTypes: {
        compact: { control: 'boolean' },
    },
};
export const Default = ({ compact }) => {
    const [selected, setSelected] = useState('all');
    const options = [
        { value: 'all', label: 'All' },
        { value: 'unread', label: 'Unread' },
        { value: 'comments', label: 'Comments' },
        { value: 'follows', label: 'Follows' },
        { value: 'likes', label: 'Likes' },
    ];
    const controlDemoStyles = { maxWidth: 386 };
    const selectChildSegment = (childSelected, event) => {
        event.preventDefault();
        setSelected(childSelected);
        console.log('Segmented Control (selected):', childSelected);
    };
    const selectSegment = (option) => {
        console.log('Segmented Control (selected):', option);
    };
    return (_jsxs("div", { children: [_jsx("h3", { children: "Items passed as options prop" }), _jsx(SimplifiedSegmentedControl, { options: options, onSelect: selectSegment, style: controlDemoStyles, compact: compact }), _jsx("h3", { style: { marginTop: 20 }, children: "Primary version" }), _jsxs(SegmentedControl, { selectedText: selected, style: controlDemoStyles, primary: true, compact: compact, children: [_jsx(SegmentedControl.Item, { selected: selected === 'all', onClick: selectChildSegment.bind(this, 'all'), children: "All" }), _jsx(SegmentedControl.Item, { selected: selected === 'unread', onClick: selectChildSegment.bind(this, 'unread'), children: "Unread" }), _jsx(SegmentedControl.Item, { selected: selected === 'comments', onClick: selectChildSegment.bind(this, 'comments'), children: "Comments" }), _jsx(SegmentedControl.Item, { selected: selected === 'follows', onClick: selectChildSegment.bind(this, 'follows'), children: "Follows" }), _jsx(SegmentedControl.Item, { selected: selected === 'likes', onClick: selectChildSegment.bind(this, 'likes'), children: "Likes" })] })] }));
};
//# sourceMappingURL=index.stories.js.map
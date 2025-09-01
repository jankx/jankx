import { jsx as _jsx } from "react/jsx-runtime";
import { WordPressLogo } from '..';
const meta = {
    title: 'Unaudited/Logos/WordPressLogo',
    component: WordPressLogo,
    decorators: [
        (Story) => (
        // TODO: Default styles for this component are too opinionated,
        // rendering as a white logo with outer margin. Should fix.
        _jsx("div", { style: { background: '#2c3338', padding: '10px' }, children: _jsx(Story, {}) })),
    ],
};
export default meta;
export const Default = {};
//# sourceMappingURL=index.stories.js.map
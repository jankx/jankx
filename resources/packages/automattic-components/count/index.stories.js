import { jsx as _jsx } from "react/jsx-runtime";
import Count from '.';
export default { component: Count, title: 'Unaudited/Count' };
const Template = (args) => {
    return _jsx(Count, { ...args });
};
export const Default = Template.bind({});
Default.args = {
    compact: false,
    primary: false,
    count: 42000,
};
//# sourceMappingURL=index.stories.js.map
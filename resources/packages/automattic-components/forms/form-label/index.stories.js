import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FormLabel from '.';
export default { component: FormLabel, title: 'Unaudited/Form Label' };
const Template = (args) => {
    return (_jsxs("form", { children: [_jsx(FormLabel, { ...args, children: "Button Label" }), _jsx("input", { type: "button", value: "Test Button" })] }));
};
export const Default = Template.bind({});
Default.args = {
    className: 'button-label',
    optional: false,
    required: false,
};
//# sourceMappingURL=index.stories.js.map
import { jsx as _jsx } from "react/jsx-runtime";
const BASE_CLASS_NAME = 'stats-card-avatar';
const Avatar = ({ url, altName }) => (_jsx("span", { className: BASE_CLASS_NAME, children: _jsx("img", { alt: `${altName} avatar`, src: url, className: `${BASE_CLASS_NAME}-image` }) }));
export default Avatar;
//# sourceMappingURL=avatar.js.map
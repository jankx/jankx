import { jsx as _jsx } from "react/jsx-runtime";
import ProgressBar from '.';
export default { title: 'Unaudited/ProgressBar' };
export const Normal = () => _jsx(ProgressBar, { value: 33 });
export const Colored = () => _jsx(ProgressBar, { color: "red", value: 33 });
export const Compact = () => _jsx(ProgressBar, { compact: true, value: 33 });
export const Pulsing = () => _jsx(ProgressBar, { isPulsing: true, value: 33 });
//# sourceMappingURL=index.stories.js.map
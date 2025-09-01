import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from '@emotion/css';
import { LoadingPlaceholder } from '.';
export default { title: 'Unaudited/LoadingPlaceholder' };
export const Normal = () => _jsx(LoadingPlaceholder, {});
export const Width = () => _jsx(LoadingPlaceholder, { className: css({ maxWidth: 300 }) });
export const Delay = () => (_jsxs("div", { className: css({ display: 'grid', gap: 5 }), children: [_jsx(LoadingPlaceholder, { delayMS: 0 }), _jsx(LoadingPlaceholder, { delayMS: 150 }), _jsx(LoadingPlaceholder, { delayMS: 300 })] }));
export const ComplexLayout = () => (_jsxs("div", { className: css({ display: 'flex', gap: 5 }), children: [_jsx(LoadingPlaceholder, { className: css({ maxWidth: 50, height: 50 }) }), _jsxs("div", { className: css({ display: 'flex', flexDirection: 'column', flex: 1, gap: 5 }), children: [_jsx(LoadingPlaceholder, {}), _jsx(LoadingPlaceholder, { className: css({ maxWidth: '33%' }) })] })] }));
//# sourceMappingURL=loading-placeholder.stories.js.map
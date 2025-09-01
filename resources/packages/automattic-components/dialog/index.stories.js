import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Dialog from '.';
export default { title: 'Unaudited/Dialog' };
export const Default = () => {
    const [isVisible, setVisible] = useState(false);
    const handleShowDialog = () => setVisible(true);
    const handleHideDialog = () => setVisible(false);
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: handleShowDialog, children: "Open Dialog" }), _jsx(Dialog, { isVisible: isVisible, onClose: handleHideDialog, shouldCloseOnEsc: true, children: "Hello World!" })] }));
};
//# sourceMappingURL=index.stories.js.map
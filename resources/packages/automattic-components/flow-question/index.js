import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Flex, FlexBlock, FlexItem, Card, CardBody, Icon } from '@wordpress/components';
import { chevronRight } from '@wordpress/icons';
import clsx from 'clsx';
import Badge from '../badge';
import './style.scss';
const bemElement = (customClassName) => (element) => customClassName ? `${customClassName}__${element}` : undefined;
const FlowQuestion = ({ icon, onClick, text, title, disabled = false, badge, className, }) => {
    const bem = bemElement(className);
    return (_jsx(Card, { className: clsx('flow-question', className), as: "button", size: "small", onClick: onClick, disabled: disabled, children: _jsx(CardBody, { children: _jsxs(Flex, { children: [icon && (_jsx(FlexItem, { className: clsx('flow-question__icon', bem('icon')), children: _jsx(Icon, { icon: icon, size: 24 }) })), _jsxs(FlexBlock, { children: [_jsxs("h3", { className: clsx('flow-question__heading', bem('heading')), children: [title, badge && _jsx(Badge, { type: badge.type, children: badge.text })] }), _jsx("p", { className: clsx('flow-question__description', bem('description')), children: text })] }), _jsx(FlexItem, { children: _jsx(Icon, { icon: chevronRight, size: 24 }) })] }) }) }));
};
export default FlowQuestion;
//# sourceMappingURL=index.js.map
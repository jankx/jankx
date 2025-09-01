import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import './style.scss';
const BASE_CLASS_NAME = 'horizontal-bar-list';
const HorizontalBarList = ({ children, className }) => {
    const baseClass = clsx(className, BASE_CLASS_NAME);
    return _jsx("ul", { className: baseClass, children: children });
};
export default HorizontalBarList;
export { HorizontalBarList };
export { default as HorizontalBarListItem } from './horizontal-bar-grid-item';
export { default as StatsCard } from './stats-card';
export { default as StatsCardAvatar } from './sideElements/avatar';
export { default as StatsCardTitleExtras } from './title-extras';
//# sourceMappingURL=index.js.map
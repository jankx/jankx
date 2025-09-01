import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { action } from '@storybook/addon-actions';
import { Icon, external } from '@wordpress/icons';
import HorizontalBarList from '../.';
import HorizontalBarListItem from '../horizontal-bar-grid-item';
import StatsCard from '../stats-card';
import './stories.scss';
export default { title: 'Unaudited/Horizontal bar list' };
const handleClick = action('click');
const data = [
    {
        label: 'Home page',
        value: 1000,
    },
    {
        label: 'The Lord of the Rings',
        value: 789,
    },
    {
        label: 'The Dark Knoght Trilogy',
        value: 512,
    },
    {
        label: 'The Ultimate Matrix Collection',
        value: 256,
    },
    {
        label: 'Ghost In The Shell',
        value: 110,
    },
    {
        label: 'Akira',
        value: 10,
    },
];
const HorizontalBarListVariations = (props) => {
    const { leftSideItem, renderRightSideItem, footerAction } = props;
    const testData = props.data || data;
    const barMaxValue = testData[0]?.value;
    return (_jsx("div", { style: { width: '500px', margin: '0 auto' }, children: _jsx(StatsCard, { title: "Posts & Pages", footerAction: footerAction, children: _jsx(HorizontalBarList, { data: testData, onClick: handleClick, children: testData.map((item, idx) => {
                    const variationProps = {
                        hasIndicator: props.hasIndicator && idx % 3, // omit every 3rd item from being indicated
                        onClick: props.onClick || null,
                        leftSideItem,
                        renderRightSideItem,
                    };
                    return (_jsx(HorizontalBarListItem, { data: item, maxValue: barMaxValue, ...variationProps }, item?.id || idx));
                }) }) }) }));
};
const ImageSample = () => {
    return _jsx("img", { src: "https://placekitten.com/20/20", alt: "sample" });
};
//TODO: convert to a component for mixing and matching actions.
const RedirectSample = () => {
    return (_jsxs(_Fragment, { children: [_jsx(Icon, { icon: external, size: 18 }), _jsx("span", { children: "View" })] }));
};
export const Default = () => _jsx(HorizontalBarListVariations, {});
export const DefaultWithFooter = () => (_jsx(HorizontalBarListVariations, { footerAction: { url: 'https://wordpress.com/', label: 'Show more' } }));
export const Indicated = () => _jsx(HorizontalBarListVariations, { hasIndicator: true });
export const WithClick = () => (
// eslint-disable-next-line no-console
_jsx(HorizontalBarListVariations, { onClick: () => console.log('I was clicked!') }));
export const WithLeftItem = () => _jsx(HorizontalBarListVariations, { leftSideItem: _jsx(ImageSample, {}) });
export const WithRightItem = () => (_jsx(HorizontalBarListVariations, { renderRightSideItem: () => _jsx(RedirectSample, {}) }));
//# sourceMappingURL=index.stories.js.map
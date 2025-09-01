import { jsx as _jsx } from "react/jsx-runtime";
import AnnualCards from '../annual-highlight-cards';
export default {
    title: 'Unaudited/Highlight Cards/AnnualHighlightCards',
    component: AnnualCards,
    argTypes: {
        year: { control: 'number' },
        'counts.comments': { control: 'number' },
        'counts.likes': { control: 'number' },
        'counts.posts': { control: 'number' },
        'counts.words': { control: 'number' },
        'counts.followers': { control: 'number' },
    },
};
const Template = ({ year, ...counts }) => {
    const countsObject = {
        comments: counts['counts.comments'],
        likes: counts['counts.likes'],
        posts: counts['counts.posts'],
        words: counts['counts.words'],
        followers: counts['counts.followers'],
    };
    return (_jsx("div", { style: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, children: _jsx(AnnualCards, { counts: countsObject, year: year }) }));
};
export const AnnualHighlightCards = Template.bind({});
AnnualHighlightCards.args = {
    year: 2022,
    'counts.comments': 72490,
    'counts.likes': 12298,
    'counts.posts': 79,
    'counts.words': 205035,
    'counts.followers': 1113323,
};
//# sourceMappingURL=annual-highlight-cards.stories.js.map
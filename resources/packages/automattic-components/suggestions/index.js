import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
import { find, groupBy, isEqual, partition, property } from 'lodash';
import { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import Item from './item';
/**
 * Style depenedencies
 */
import './style.scss';
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => { };
class Suggestions extends Component {
    static defaultProps = {
        query: '',
        onSuggestionItemMount: noop,
    };
    state = {
        lastSuggestions: null,
        suggestionPosition: 0,
    };
    refsCollection = {};
    static getDerivedStateFromProps(props, state) {
        if (isEqual(props.suggestions, state.lastSuggestions)) {
            return null;
        }
        return {
            lastSuggestions: props.suggestions,
            suggestionPosition: 0,
        };
    }
    getSuggestionsCount = () => this.props.suggestions.length;
    getOriginalIndexFromPosition = (index) => this.getCategories().reduce((foundIndex, category) => {
        if (foundIndex !== -1) {
            return foundIndex;
        }
        const suggestion = find(category.suggestions, { index });
        return suggestion ? suggestion.originalIndex : -1;
    }, -1);
    suggest = (originalIndex) => this.props.suggest(this.props.suggestions[originalIndex], originalIndex);
    moveSelectionDown = () => {
        const position = (this.state.suggestionPosition + 1) % this.getSuggestionsCount();
        const element = ReactDOM.findDOMNode(this.refsCollection['suggestion_' + position]);
        if (element instanceof Element) {
            element.scrollIntoView({ block: 'nearest' });
        }
        this.changePosition(position);
    };
    moveSelectionUp = () => {
        const position = (this.state.suggestionPosition - 1 + this.getSuggestionsCount()) %
            this.getSuggestionsCount();
        const element = ReactDOM.findDOMNode(this.refsCollection['suggestion_' + position]);
        if (element instanceof Element) {
            element.scrollIntoView({ block: 'nearest' });
        }
        this.changePosition(position);
    };
    changePosition = (position) => this.setState({
        suggestionPosition: position,
    });
    handleKeyEvent = (event) => {
        if (this.getSuggestionsCount() === 0) {
            return;
        }
        switch (event.key) {
            case 'ArrowDown':
                this.moveSelectionDown();
                event.preventDefault();
                break;
            case 'ArrowUp':
                this.moveSelectionUp();
                event.preventDefault();
                break;
            case 'Enter':
                this.state.suggestionPosition >= 0 &&
                    this.suggest(this.getOriginalIndexFromPosition(this.state.suggestionPosition));
                break;
        }
    };
    handleMouseDown = (originalIndex) => {
        this.suggest(originalIndex);
    };
    handleMouseOver = (suggestionPosition) => this.setState({ suggestionPosition });
    getCategories() {
        // We need to remember the original index of the suggestion according to the
        // `suggestions` prop for tracks and firing callbacks.
        const withOriginalIndex = this.props.suggestions.map((suggestion, originalIndex) => ({
            ...suggestion,
            // this will be updated later on in this function
            index: originalIndex,
            originalIndex,
        }));
        const [withCategory, withoutCategory] = partition(withOriginalIndex, (suggestion) => !!suggestion.category);
        // For all intents and purposes `groupBy` keeps the order stable
        // https://github.com/lodash/lodash/issues/2212
        const byCategory = groupBy(withCategory, property('category'));
        const categories = Object.entries(byCategory).map(([category, suggestions]) => ({
            category,
            categoryKey: category,
            suggestions,
        }));
        // Add uncategorised suggestions to the front, they always appear at
        // the top of the list.
        categories.unshift({
            categoryKey: '## Uncategorized ##',
            suggestions: withoutCategory,
        });
        let order = 0;
        for (const category of categories) {
            for (const suggestion of category.suggestions) {
                suggestion.index = order++;
            }
        }
        return categories;
    }
    render() {
        const { query, className, title } = this.props;
        const containerClass = clsx('suggestions', className);
        if (!this.getSuggestionsCount()) {
            return null;
        }
        return (_jsxs("div", { className: containerClass, children: [title ? _jsx("div", { className: "suggestions__title", children: title }) : null, this.getCategories().map(({ category, categoryKey, suggestions }, categoryIndex) => (_jsxs(Fragment, { children: [!categoryIndex ? null : (_jsx("div", { className: "suggestions__category-heading", children: category })), suggestions.map(({ index, label, originalIndex }) => (
                        // The parent component should handle key events and forward them to
                        // this component. See ./README.md for details.
                        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                        _jsx(Item, { hasHighlight: index === this.state.suggestionPosition, query: query, onMount: () => this.props.onSuggestionItemMount?.({
                                suggestionIndex: originalIndex,
                                index,
                            }), onMouseDown: () => this.handleMouseDown(originalIndex), onMouseOver: () => this.handleMouseOver(index), label: label, ref: (suggestion) => {
                                this.refsCollection['suggestion_' + index] = suggestion;
                            } }, originalIndex)))] }, categoryKey)))] }));
    }
}
export default Suggestions;
//# sourceMappingURL=index.js.map
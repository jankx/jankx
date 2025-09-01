import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PureComponent } from 'react';
import { Spinner } from '../';
export class SpinnerExample extends PureComponent {
    static displayName = 'Spinner';
    render() {
        return (_jsxs("div", { children: [_jsxs("p", { children: [_jsx("strong", { children: "Please exercise caution in deciding to use a spinner in your component." }), " A lone spinner is a poor user-experience and conveys little context to what the user should expect from the page. Refer to", ' ', _jsxs("a", { href: "/devdocs/docs/reactivity.md", children: ["the ", _jsx("em", { children: "Reactivity and Loading States" }), " guide"] }), ' ', "for more information on building fast interfaces and making the most of data already available to use."] }), _jsx(Spinner, {})] }));
    }
}
//# sourceMappingURL=example.js.map
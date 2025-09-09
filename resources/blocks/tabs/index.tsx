(() => {
    "use strict";
    var e,
        a = {
            72: (e, a) => {
                var t = "function" == typeof Symbol && Symbol.for,
                    i = t ? Symbol.for("react.element") : 60103,
                    r = t ? Symbol.for("react.portal") : 60106,
                    n = t ? Symbol.for("react.fragment") : 60107,
                    s = t ? Symbol.for("react.strict_mode") : 60108,
                    l = t ? Symbol.for("react.profiler") : 60114,
                    o = t ? Symbol.for("react.provider") : 60109,
                    u = t ? Symbol.for("react.context") : 60110,
                    c = t ? Symbol.for("react.async_mode") : 60111,
                    g = t ? Symbol.for("react.concurrent_mode") : 60111,
                    d = t ? Symbol.for("react.forward_ref") : 60112,
                    y = t ? Symbol.for("react.suspense") : 60113,
                    f = t ? Symbol.for("react.suspense_list") : 60120,
                    m = t ? Symbol.for("react.memo") : 60115,
                    b = t ? Symbol.for("react.lazy") : 60116,
                    v = t ? Symbol.for("react.block") : 60121,
                    p = t ? Symbol.for("react.fundamental") : 60117,
                    h = t ? Symbol.for("react.responder") : 60118,
                    x = t ? Symbol.for("react.scope") : 60119;
                function S(e) {
                    if ("object" == typeof e && null !== e) {
                        var a = e.$$typeof;
                        switch (a) {
                            case i:
                                switch ((e = e.type)) {
                                    case c:
                                    case g:
                                    case n:
                                    case l:
                                    case s:
                                    case y:
                                        return e;
                                    default:
                                        switch ((e = e && e.$$typeof)) {
                                            case u:
                                            case d:
                                            case b:
                                            case m:
                                            case o:
                                                return e;
                                            default:
                                                return a;
                                        }
                                }
                            case r:
                                return a;
                        }
                    }
                }
                function k(e) {
                    return S(e) === g;
                }
                (a.AsyncMode = c),
                    (a.ConcurrentMode = g),
                    (a.ContextConsumer = u),
                    (a.ContextProvider = o),
                    (a.Element = i),
                    (a.ForwardRef = d),
                    (a.Fragment = n),
                    (a.Lazy = b),
                    (a.Memo = m),
                    (a.Portal = r),
                    (a.Profiler = l),
                    (a.StrictMode = s),
                    (a.Suspense = y),
                    (a.isAsyncMode = function (e) {
                        return k(e) || S(e) === c;
                    }),
                    (a.isConcurrentMode = k),
                    (a.isContextConsumer = function (e) {
                        return S(e) === u;
                    }),
                    (a.isContextProvider = function (e) {
                        return S(e) === o;
                    }),
                    (a.isElement = function (e) {
                        return "object" == typeof e && null !== e && e.$$typeof === i;
                    }),
                    (a.isForwardRef = function (e) {
                        return S(e) === d;
                    }),
                    (a.isFragment = function (e) {
                        return S(e) === n;
                    }),
                    (a.isLazy = function (e) {
                        return S(e) === b;
                    }),
                    (a.isMemo = function (e) {
                        return S(e) === m;
                    }),
                    (a.isPortal = function (e) {
                        return S(e) === r;
                    }),
                    (a.isProfiler = function (e) {
                        return S(e) === l;
                    }),
                    (a.isStrictMode = function (e) {
                        return S(e) === s;
                    }),
                    (a.isSuspense = function (e) {
                        return S(e) === y;
                    }),
                    (a.isValidElementType = function (e) {
                        return (
                            "string" == typeof e ||
                            "function" == typeof e ||
                            e === n ||
                            e === g ||
                            e === l ||
                            e === s ||
                            e === y ||
                            e === f ||
                            ("object" == typeof e &&
                                null !== e &&
                                (e.$$typeof === b || e.$$typeof === m || e.$$typeof === o || e.$$typeof === u || e.$$typeof === d || e.$$typeof === p || e.$$typeof === h || e.$$typeof === x || e.$$typeof === v))
                        );
                    }),
                    (a.typeOf = S);
            },
            146: (e, a, t) => {
                var i = t(404),
                    r = { childContextTypes: !0, contextType: !0, contextTypes: !0, defaultProps: !0, displayName: !0, getDefaultProps: !0, getDerivedStateFromError: !0, getDerivedStateFromProps: !0, mixins: !0, propTypes: !0, type: !0 },
                    n = { name: !0, length: !0, prototype: !0, caller: !0, callee: !0, arguments: !0, arity: !0 },
                    s = { $$typeof: !0, compare: !0, defaultProps: !0, displayName: !0, propTypes: !0, type: !0 },
                    l = {};
                function o(e) {
                    return i.isMemo(e) ? s : l[e.$$typeof] || r;
                }
                (l[i.ForwardRef] = { $$typeof: !0, render: !0, defaultProps: !0, displayName: !0, propTypes: !0 }), (l[i.Memo] = s);
                var u = Object.defineProperty,
                    c = Object.getOwnPropertyNames,
                    g = Object.getOwnPropertySymbols,
                    d = Object.getOwnPropertyDescriptor,
                    y = Object.getPrototypeOf,
                    f = Object.prototype;
                e.exports = function e(a, t, i) {
                    if ("string" != typeof t) {
                        if (f) {
                            var r = y(t);
                            r && r !== f && e(a, r, i);
                        }
                        var s = c(t);
                        g && (s = s.concat(g(t)));
                        for (var l = o(a), m = o(t), b = 0; b < s.length; ++b) {
                            var v = s[b];
                            if (!(n[v] || (i && i[v]) || (m && m[v]) || (l && l[v]))) {
                                var p = d(t, v);
                                try {
                                    u(a, v, p);
                                } catch (e) {}
                            }
                        }
                    }
                    return a;
                };
            },
            373: (e, a, t) => {
                var i = {};
                t.r(i), t.d(i, { xj: () => C, ml: () => w, R9: () => k, cM: () => h, mF: () => x, o7: () => S, $_: () => b, G3: () => N, kQ: () => M, OG: () => v, lP: () => j, H3: () => f, N8: () => m, TP: () => p });
                var r = {};
                t.r(r), t.d(r, { O5: () => g, F_: () => P, Tr: () => O, Cl: () => T, NE: () => R, nk: () => c, X2: () => B, qy: () => u, k4: () => $, zb: () => L });
                var n = {};
                t.r(n),
                    t.d(n, {
                        vW: () => Q,
                        iJ: () => ee,
                        kB: () => ie,
                        V7: () => te,
                        O3: () => ae,
                        t$: () => J,
                        ih: () => X,
                        $o: () => Z,
                        it: () => Y,
                        Ev: () => W,
                        xZ: () => q,
                        t: () => U,
                        kD: () => K,
                        LT: () => z,
                        QJ: () => G,
                        xW: () => H,
                        lt: () => D,
                        Au: () => _,
                        tj: () => F,
                        ww: () => E,
                        YB: () => I,
                        bL: () => V,
                        Wc: () => A,
                    });
                var s = {};
                t.r(s), t.d(s, { LE: () => Ze, gl: () => dn, ed: () => Ye, xi: () => qe, of: () => De, fW: () => Qe, $Q: () => Ke, Jn: () => Ue, oy: () => Tl, Uq: () => Ll, lm: () => gn });
                const l = window.wp.blocks,
                    o = JSON.parse(
                        '{"apiVersion":3,"name":"jankx/tabs","title":"Horizontal Tab","category":"jankx-block","description":"Show your content in a horizontal tab.","supports":{"html":false,"anchor":true,"align":["wide","full"]},"example":{"attributes":{"tab1":{"title":"Tab 1","content":"<p>Tab 1 content</p>"},"tab2":{"title":"Tab 2","content":"<p>Tab 2 content</p>"},"tab3":{"title":"Tab 3","content":"<p>Tab 3 content</p>"}}},"textdomain":"advanced-tabs-block","editorScript":"file:./index.js","editorStyle":"file:./index.css","viewScript":"file:./view.js","style":"file:./style-index.css"}'
                    ),
                    u = ({ controlName: e }) => ({
                        [`${e}Ranges`]: { type: "object", default: { desk: { type: "number" }, tab: { type: "number" }, mob: { type: "number" } } },
                        [`${e}Units`]: { type: "object", default: { desk: "px", tab: "px", mob: "px" } },
                    }),
                    c = ({ controlName: e }) => ({
                        [`${e}LinkedStatus`]: { type: "boolean", default: !0 },
                        [`${e}LinkedValue`]: { type: "number" },
                        [`${e}Values`]: { type: "object", default: { top: { type: "number" }, right: { type: "number" }, bottom: { type: "number" }, left: { type: "number" } } },
                        [`${e}TabLinkedStatus`]: { type: "boolean", default: !0 },
                        [`${e}TabLinkedValue`]: { type: "number" },
                        [`${e}TabValues`]: { type: "object", default: { top: { type: "number" }, right: { type: "number" }, bottom: { type: "number" }, left: { type: "number" } } },
                        [`${e}MobLinkedStatus`]: { type: "boolean", default: !0 },
                        [`${e}MobLinkedValue`]: { type: "number" },
                        [`${e}MobValues`]: { type: "object", default: { top: { type: "number" }, right: { type: "number" }, bottom: { type: "number" }, left: { type: "number" } } },
                        [`${e}Units`]: { type: "object", default: { desk: "px", tab: "px", mob: "px" } },
                    }),
                    g = ({ controlName: e }) => ({ [`${e}Aligns`]: { type: "object", default: { desk: "", tab: "", mob: "" } } }),
                    d = window.wp.i18n,
                    y = window.ReactJSXRuntime,
                    f = "jankx_",
                    m = [
                        {
                            label: (0, d.__)("Desktop", "gutsliders"),
                            value: "Desktop",
                            icon: (0, y.jsx)("svg", {
                                width: "8",
                                height: "7",
                                viewBox: "0 0 8 7",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: (0, y.jsx)("path", {
                                    d:
                                        "M7.33333 0H0.666667C0.298611 0 0 0.293945 0 0.65625V5.03125C0 5.39355 0.298611 5.6875 0.666667 5.6875H3.33333L3.11111 6.34375H2.11111C1.92639 6.34375 1.77778 6.49004 1.77778 6.67188C1.77778 6.85371 1.92639 7 2.11111 7H5.88889C6.07361 7 6.22222 6.85371 6.22222 6.67188C6.22222 6.49004 6.07361 6.34375 5.88889 6.34375H4.88889L4.66667 5.6875H7.33333C7.70139 5.6875 8 5.39355 8 5.03125V0.65625C8 0.293945 7.70139 0 7.33333 0ZM7.11111 4.8125H0.888889V0.875H7.11111V4.8125Z",
                                }),
                            }),
                        },
                        {
                            label: (0, d.__)("Tablet", "gutsliders"),
                            value: "Tablet",
                            icon: (0, y.jsx)("svg", {
                                width: "6",
                                height: "7",
                                viewBox: "0 0 6 7",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: (0, y.jsx)("path", {
                                    d:
                                        "M5 0H1C0.446667 0 0 0.390833 0 0.875V6.125C0 6.60917 0.446667 7 1 7H5C5.55333 7 6 6.60917 6 6.125V0.875C6 0.390833 5.55333 0 5 0ZM3.66667 6.41667H2.33333V6.125H3.66667V6.41667ZM5.41667 5.54167H0.583333V0.875H5.41667V5.54167Z",
                                }),
                            }),
                        },
                        {
                            label: (0, d.__)("Mobile", "gutsliders"),
                            value: "Mobile",
                            icon: (0, y.jsx)("svg", {
                                width: "4",
                                height: "7",
                                viewBox: "0 0 4 7",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: (0, y.jsx)("path", {
                                    d:
                                        "M3.33333 0H0.666667C0.297778 0 0 0.390833 0 0.875V6.125C0 6.60917 0.297778 7 0.666667 7H3.33333C3.70222 7 4 6.60917 4 6.125V0.875C4 0.390833 3.70222 0 3.33333 0ZM2.44444 6.41667H1.55556V6.125H2.44444V6.41667ZM3.61111 5.54167H0.388889V0.875H3.61111V5.54167Z",
                                }),
                            }),
                        },
                    ],
                    b = ["px", "em", "rem"],
                    v = ["px", "em"],
                    p = [
                        {
                            label: (0, d.__)("Left", "gutsliders"),
                            value: "left",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [(0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }), (0, y.jsx)("path", { d: "M4 6l16 0" }), (0, y.jsx)("path", { d: "M4 12l10 0" }), (0, y.jsx)("path", { d: "M4 18l14 0" })],
                            }),
                        },
                        {
                            label: (0, d.__)("Center", "gutsliders"),
                            value: "center",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [(0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }), (0, y.jsx)("path", { d: "M4 6l16 0" }), (0, y.jsx)("path", { d: "M8 12l8 0" }), (0, y.jsx)("path", { d: "M6 18l12 0" })],
                            }),
                        },
                        {
                            label: (0, d.__)("Right", "affiliaterg-block"),
                            value: "right",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [(0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }), (0, y.jsx)("path", { d: "M4 6l16 0" }), (0, y.jsx)("path", { d: "M10 12l10 0" }), (0, y.jsx)("path", { d: "M6 18l14 0" })],
                            }),
                        },
                    ],
                    h = [
                        {
                            label: (0, d.__)("Left", "affiliaterg-block"),
                            value: "flex-start",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M4 4l0 16" }),
                                    (0, y.jsx)("path", { d: "M8 9m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                        {
                            label: (0, d.__)("Center", "affiliaterg-block"),
                            value: "center",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M4 12l5 0" }),
                                    (0, y.jsx)("path", { d: "M15 12l5 0" }),
                                    (0, y.jsx)("path", { d: "M9 6m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                        {
                            label: (0, d.__)("Right", "affiliaterg-block"),
                            value: "flex-end",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M20 4l0 16" }),
                                    (0, y.jsx)("path", { d: "M4 9m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                        {
                            label: (0, d.__)("Justify", "affiliaterg-block"),
                            value: "space-between",
                            icon: (0, y.jsx)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 24 24",
                                style: { width: "20px", height: "20px", fill: "#000" },
                                children: (0, y.jsx)("path", { d: "M9 6 3 12 9 18V6ZM15 18 21 12 15 6V18Z" }),
                            }),
                        },
                    ],
                    x = [
                        {
                            label: (0, d.__)("Left", "affiliaterg-block"),
                            value: "flex-start",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M4 4l0 16" }),
                                    (0, y.jsx)("path", { d: "M8 9m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                        {
                            label: (0, d.__)("Center", "affiliaterg-block"),
                            value: "center",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M4 12l5 0" }),
                                    (0, y.jsx)("path", { d: "M15 12l5 0" }),
                                    (0, y.jsx)("path", { d: "M9 6m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                        {
                            label: (0, d.__)("Right", "affiliaterg-block"),
                            value: "flex-end",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M20 4l0 16" }),
                                    (0, y.jsx)("path", { d: "M4 9m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                    ],
                    S = [
                        {
                            label: (0, d.__)("Top", "affiliaterg-block"),
                            value: "flex-start",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M4 4l16 0" }),
                                    (0, y.jsx)("path", { d: "M9 8m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                        {
                            label: (0, d.__)("Middle", "affiliaterg-block"),
                            value: "center",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M12 4l0 5" }),
                                    (0, y.jsx)("path", { d: "M12 15l0 5" }),
                                    (0, y.jsx)("path", { d: "M6 9m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                        {
                            label: (0, d.__)("Bottom", "affiliaterg-block"),
                            value: "flex-end",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M4 20l16 0" }),
                                    (0, y.jsx)("path", { d: "M9 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                    ],
                    k = [
                        { label: (0, d.__)("Outset", "affiliaterg-block"), value: "outset" },
                        { label: (0, d.__)("Inset", "affiliaterg-block"), value: "inset" },
                    ],
                    w = [
                        { label: (0, d.__)("None", "affiliaterg-block"), value: "none" },
                        { label: (0, d.__)("Solid", "affiliaterg-block"), value: "solid" },
                        { label: (0, d.__)("Dashed", "affiliaterg-block"), value: "dashed" },
                        { label: (0, d.__)("Dotted", "affiliaterg-block"), value: "dotted" },
                        { label: (0, d.__)("Double", "affiliaterg-block"), value: "double" },
                        { label: (0, d.__)("Groove", "affiliaterg-block"), value: "groove" },
                        { label: (0, d.__)("Ridge", "affiliaterg-block"), value: "ridge" },
                    ],
                    C =
                        ((0, d.__)("Orange", "gutsliders"),
                        (0, d.__)("Yellow", "gutsliders"),
                        (0, d.__)("Green", "gutsliders"),
                        (0, d.__)("Blue", "gutsliders"),
                        (0, d.__)("Purple", "gutsliders"),
                        (0, d.__)("Black", "gutsliders"),
                        [
                            { label: (0, d.__)("Classic", "gutsliders"), value: "classic" },
                            { label: (0, d.__)("Gradient", "gutsliders"), value: "gradient" },
                        ]),
                    N =
                        ((0, d.__)("Classic", "gutsliders"),
                        (0, d.__)("Gradient", "gutsliders"),
                        [
                            { name: "JShine", gradient: "linear-gradient(135deg,#12c2e9 0%,#c471ed 50%,#f64f59 100%)", slug: "jshine" },
                            { name: "Rastafarie", gradient: "linear-gradient(135deg,#1E9600 0%, #FFF200 0%, #FF0000 100%)", slug: "rastafari" },
                            { name: "Yoda", gradient: "linear-gradient(135deg,#FF0099 0%, #493240 100%)", slug: "yoda" },
                            { name: "Piglet", gradient: "linear-gradient(135deg,#ee9ca7 0%, #ffdde1 100%)", slug: "piglet" },
                            { name: "Cool Blues", gradient: "linear-gradient(135deg,#2193b0 0%, #6dd5ed 100%)", slug: "cool-blues" },
                            { name: "MegaTron", gradient: "linear-gradient(135deg,#C6FFDD 0%, #FBD786 100%)", slug: "megatron" },
                        ]),
                    M =
                        ((0, d.__)("H1", "gutsliders"),
                        (0, d.__)("H2", "gutsliders"),
                        (0, d.__)("H3", "gutsliders"),
                        (0, d.__)("H4", "gutsliders"),
                        (0, d.__)("H5", "gutsliders"),
                        (0, d.__)("H6", "gutsliders"),
                        (0, d.__)("Div", "gutsliders"),
                        (0, d.__)("P", "gutsliders"),
                        (0, d.__)("Span", "gutsliders"),
                        (0, d.__)("None", "gutsliders"),
                        (0, d.__)("Fade Up", "gutsliders"),
                        (0, d.__)("Fade Down", "gutsliders"),
                        (0, d.__)("Fade Left", "gutsliders"),
                        (0, d.__)("Fade Right", "gutsliders"),
                        (0, d.__)("Slide Up", "gutsliders"),
                        (0, d.__)("Slide Down", "gutsliders"),
                        (0, d.__)("Slide Left", "gutsliders"),
                        (0, d.__)("Slide Right", "gutsliders"),
                        [
                            { label: (0, d.__)("Icon Library", "gutsliders"), value: "iconLibrary" },
                            { label: (0, d.__)("Custom SVG", "gutsliders"), value: "uploadSVG" },
                        ]),
                    j = [
                        {
                            label: (0, d.__)("Left", "affiliaterg-block"),
                            value: "icon_left",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M4 4l0 16" }),
                                    (0, y.jsx)("path", { d: "M8 9m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                        {
                            label: (0, d.__)("Top", "affiliaterg-block"),
                            value: "icon_top",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M4 4l16 0" }),
                                    (0, y.jsx)("path", { d: "M9 8m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                        {
                            label: (0, d.__)("Bottom", "affiliaterg-block"),
                            value: "icon_bottom",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M4 20l16 0" }),
                                    (0, y.jsx)("path", { d: "M9 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                        {
                            label: (0, d.__)("Right", "affiliaterg-block"),
                            value: "icon_right",
                            icon: (0, y.jsxs)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 24,
                                height: 24,
                                viewBox: "0 0 24 24",
                                strokeWidth: "1.5",
                                stroke: "#000000",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    (0, y.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                                    (0, y.jsx)("path", { d: "M20 4l0 16" }),
                                    (0, y.jsx)("path", { d: "M4 9m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" }),
                                ],
                            }),
                        },
                    ],
                    $ = ({ controlName: e }) => ({
                        [`${f}${e}FontFamily`]: { type: "string" },
                        [`${e}FontWeight`]: { type: "object" },
                        [`${e}FontStyle`]: { type: "string" },
                        [`${e}TextTransform`]: { type: "string" },
                        [`${e}TextDecoration`]: { type: "object" },
                        [`${e}FontSizes`]: { type: "object", default: { desk: { type: "number" }, tab: { type: "number" }, mob: { type: "number" } } },
                        [`${e}LineHeights`]: { type: "object", default: { desk: { type: "number" }, tab: { type: "number" }, mob: { type: "number" } } },
                        [`${e}LetterSpacings`]: { type: "object", default: { desk: { type: "number" }, tab: { type: "number" }, mob: { type: "number" } } },
                        [`${e}FontSizeUnits`]: { type: "object", default: { desk: "px", tab: "px", mob: "px" } },
                        [`${e}LineHeightUnits`]: { type: "object", default: { desk: "px", tab: "px", mob: "px" } },
                        [`${e}LetterSpacingUnits`]: { type: "object", default: { desk: "px", tab: "px", mob: "px" } },
                    }),
                    O = ({ controlName: e }) => ({
                        [`${e}Style`]: { type: "string", default: "solid" },
                        [`${e}Colors`]: { type: "object", default: { normal: "", hover: "" } },
                        [`${e}LinkStatus`]: { type: "boolean", default: !0 },
                        [`${e}LinkedWidth`]: { type: "number" },
                        [`${e}Widths`]: { type: "object", default: { top: { type: "number" }, right: { type: "number" }, bottom: { type: "number" }, left: { type: "number" } } },
                        [`${e}TabLinkStatus`]: { type: "boolean", default: !0 },
                        [`${e}TabLinkedWidth`]: { type: "number" },
                        [`${e}TabWidths`]: { type: "object", default: { top: { type: "number" }, right: { type: "number" }, bottom: { type: "number" }, left: { type: "number" } } },
                        [`${e}MobLinkStatus`]: { type: "boolean", default: !0 },
                        [`${e}MobLinkedWidth`]: { type: "number" },
                        [`${e}MobWidths`]: { type: "object", default: { top: { type: "number" }, right: { type: "number" }, bottom: { type: "number" }, left: { type: "number" } } },
                        [`${e}Unit`]: { type: "string", default: "px" },
                    }),
                    B = ({ controlName: e, attributes: a, propertyName: t, forRadius: i = !1 }) => {
                        const {
                            [`${e}Values`]: r,
                            [`${e}LinkedStatus`]: n,
                            [`${e}LinkedValue`]: s,
                            [`${e}TabValues`]: l,
                            [`${e}TabLinkedStatus`]: o,
                            [`${e}TabLinkedValue`]: u,
                            [`${e}MobValues`]: c,
                            [`${e}MobLinkedStatus`]: g,
                            [`${e}MobLinkedValue`]: d,
                            [`${e}Units`]: y,
                        } = a;
                        let f = "",
                            m = "",
                            b = "";
                        return (
                            (f = n
                                ? void 0 !== s && "" !== s && !1 === isNaN(s)
                                    ? `\n            ${t}: ${s}${y.desk};\n        `
                                    : ""
                                : `\n            ${r && void 0 !== r.top && "" !== r.top && !1 === isNaN(r.top) ? `${i ? "border-top-left-radius" : t + "-top"}: ${r.top}${y.desk};` : ""}\n            ${
                                      r && void 0 !== r.right && "" !== r.right && !1 === isNaN(r.right) ? `${i ? "border-top-right-radius" : t + "-right"}: ${r.right}${y.desk};` : ""
                                  }\n            ${r && void 0 !== r.bottom && "" !== r.bottom && !1 === isNaN(r.bottom) ? `${i ? "border-bottom-right-radius" : t + "-bottom"}: ${r.bottom}${y.desk};` : ""}\n            ${
                                      r && void 0 !== r.left && "" !== r.left && !1 === isNaN(r.left) ? `${i ? "border-bottom-left-radius" : t + "-left"}: ${r.left}${y.desk};` : ""
                                  }\n        `),
                            (m = o
                                ? void 0 !== u && "" !== u && !1 === isNaN(u)
                                    ? `\n            ${t}: ${u}${y.tab};\n        `
                                    : ""
                                : `\n            ${l && void 0 !== l.top && "" !== l.top && !1 === isNaN(l.top) ? `${i ? "border-top-left-radius" : t + "-top"}: ${l.top}${y.tab};` : ""}\n            ${
                                      l && void 0 !== l.right && "" !== l.right && !1 === isNaN(l.right) ? `${i ? "border-top-right-radius" : t + "-right"}: ${l.right}${y.tab};` : ""
                                  }\n            ${l && void 0 !== l.bottom && "" !== l.bottom && !1 === isNaN(l.bottom) ? `${i ? "border-bottom-right-radius" : t + "-bottom"}: ${l.bottom}${y.tab};` : ""}\n            ${
                                      l && void 0 !== l.left && "" !== l.left && !1 === isNaN(l.left) ? `${i ? "border-bottom-left-radius" : t + "-left"}: ${l.left}${y.tab};` : ""
                                  }\n        `),
                            (b = g
                                ? void 0 !== d && "" !== d && !1 === isNaN(d)
                                    ? `\n            ${t}: ${d}${y.mob}; \n        `
                                    : ""
                                : `\n            ${c && void 0 !== c.top && "" !== c.top && !1 === isNaN(c.top) ? `${i ? "border-top-left-radius" : t + "-top"}: ${c.top}${y.mob};` : ""}\n            ${
                                      c && void 0 !== c.right && "" !== c.right && !1 === isNaN(c.right) ? `${i ? "border-top-right-radius" : t + "-right"}: ${c.right}${y.mob};` : ""
                                  }\n            ${c && void 0 !== c.bottom && "" !== c.bottom && !1 === isNaN(c.bottom) ? `${i ? "border-bottom-right-radius" : t + "-bottom"}: ${c.bottom}${y.mob};` : ""}\n            ${
                                      c && void 0 !== c.left && "" !== c.left && !1 === isNaN(c.left) ? `${i ? "border-bottom-left-radius" : t + "-left"}: ${c.left}${y.mob};` : ""
                                  }\n        `),
                            { boxDeskStyles: f, boxTabStyles: m, boxMobStyles: b }
                        );
                    },
                    T = ({ controlName: e, attributes: a }) => {
                        const {
                            [`${e}Style`]: t,
                            [`${e}Colors`]: i,
                            [`${e}LinkStatus`]: r,
                            [`${e}LinkedWidth`]: n,
                            [`${e}Widths`]: s,
                            [`${e}TabLinkStatus`]: l,
                            [`${e}TabLinkedWidth`]: o,
                            [`${e}TabWidths`]: u,
                            [`${e}MobLinkStatus`]: c,
                            [`${e}MobLinkedWidth`]: g,
                            [`${e}MobWidths`]: d,
                            [`${e}Unit`]: y,
                        } = a;
                        let f = "",
                            m = "",
                            b = "";
                        (f = r
                            ? void 0 !== n && "" !== n && !1 === isNaN(n)
                                ? `\n            border-width: ${n}${y};\n            border-style: ${t};\n\n        `
                                : ""
                            : `\n            ${s && void 0 !== s.top && "" !== s.top && !1 === isNaN(s.top) ? `border-top-width: ${s.top}${y};border-top-style: ${t};` : ""}\n            ${
                                  s && void 0 !== s.right && "" !== s.right && !1 === isNaN(s.right) ? `border-right-width: ${s.right}${y}; border-right-style: ${t};` : ""
                              }\n            ${s && void 0 !== s.bottom && "" !== s.bottom && !1 === isNaN(s.bottom) ? `border-bottom-width: ${s.bottom}${y}; border-bottom-style: ${t};` : ""}\n            ${
                                  s && void 0 !== s.left && "" !== s.left && !1 === isNaN(s.left) ? `border-left-width: ${s.left}${y}; border-left-style: ${t};` : ""
                              }\n        `),
                            (m = l
                                ? void 0 !== o && "" !== o && !1 === isNaN(o)
                                    ? `\n            border-width: ${o}${y};\n            border-style: ${t};\n        `
                                    : ""
                                : `\n            ${u && void 0 !== u.top && "" !== u.top && !1 === isNaN(u.top) ? `border-top-width: ${u.top}${y}; border-top-style: ${t};` : ""}\n            ${
                                      u && void 0 !== u.right && "" !== u.right && !1 === isNaN(u.right) ? `border-right-width: ${u.right}${y}; border-right-style: ${t};` : ""
                                  }\n            ${u && void 0 !== u.bottom && "" !== u.bottom && !1 === isNaN(u.bottom) ? `border-bottom-width: ${u.bottom}${y}; border-bottom-style: ${t};` : ""}\n            ${
                                      u && void 0 !== u.left && "" !== u.left && !1 === isNaN(u.left) ? `border-left-width: ${u.left}${y}; border-left-style: ${t};` : ""
                                  }\n        `),
                            (b = c
                                ? void 0 !== g && "" !== g && !1 === isNaN(g)
                                    ? `\n            border-width: ${g}${y};\n            border-style: ${t};\n        `
                                    : ""
                                : `\n            ${d && void 0 !== d.top && "" !== d.top && !1 === isNaN(d.top) ? `border-top-width: ${d.top}${y}; border-top-style: ${t};` : ""}\n            ${
                                      d && void 0 !== d.right && "" !== d.right && !1 === isNaN(d.right) ? `border-right-width: ${d.right}${y}; border-right-style: ${t};` : ""
                                  }\n            ${d && void 0 !== d.bottom && "" !== d.bottom && !1 === isNaN(d.bottom) ? `border-bottom-width: ${d.bottom}${y}; border-bottom-style: ${t};` : ""}\n            ${
                                      d && void 0 !== d.left && "" !== d.left && !1 === isNaN(d.left) ? `border-left-width: ${d.left}${y}; border-left-style: ${t};` : ""
                                  }\n        `);
                        const v = i ? `border-color: ${i.normal};` : "";
                        let p = "",
                            h = "",
                            x = "",
                            S = "";
                        return (
                            (p = f && "" !== f ? `${v}${f}` : ""),
                            (h = m && "" !== m ? `${v}${m}` : ""),
                            (x = b && "" !== b ? `${v}${b}` : ""),
                            (S = i ? `border-color: ${i.hover};` : ""),
                            { desktopStyles: p, tabletStyles: h, mobileStyles: x, hoverColor: S }
                        );
                    },
                    L = ({ controlName: e, attributes: a }) => {
                        const {
                            [`${f}${e}FontFamily`]: t,
                            [`${e}FontWeight`]: i,
                            [`${e}FontStyle`]: r,
                            [`${e}TextTransform`]: n,
                            [`${e}TextDecoration`]: s,
                            [`${e}FontSizes`]: l,
                            [`${e}LineHeights`]: o,
                            [`${e}LetterSpacings`]: u,
                            [`${e}FontSizeUnits`]: c,
                            [`${e}LineHeightUnits`]: g,
                            [`${e}LetterSpacingUnits`]: d,
                        } = a;
                        let y = "",
                            m = "",
                            b = "";
                        return (
                            t && (y += `font-family: ${t};`),
                            i && (y += `font-weight: ${i.value};`),
                            r && (y += `font-style: ${r};`),
                            n && (y += `text-transform: ${n};`),
                            s && s.value && (y += `text-decoration: ${s.value};`),
                            l && void 0 !== l.desk && "" !== l.desk && !1 === isNaN(l.desk) && (y += `font-size: ${l.desk}${c.desk};`),
                            o && o.desk && void 0 !== o.desk && "" !== o.desk && !1 === isNaN(o.desk) && (y += `line-height: ${o.desk}${g.desk};`),
                            u && u.desk && void 0 !== u.desk && "" !== u.desk && !1 === isNaN(u.desk) && (y += `letter-spacing: ${u.desk}${d.desk};`),
                            l && l.tab && void 0 !== l.tab && "" !== l.tab && !1 === isNaN(l.tab) && (m += `font-size: ${l.tab}${c.tab};`),
                            o && o.tab && void 0 !== o.tab && "" !== o.tab && !1 === isNaN(o.tab) && (m += `line-height: ${o.tab}${g.tab};`),
                            u && u.tab && void 0 !== u.tab && "" !== u.tab && !1 === isNaN(u.tab) && (m += `letter-spacing: ${u.tab}${d.tab};`),
                            l && l.mob && void 0 !== l.mob && "" !== l.mob && !1 === isNaN(l.mob) && (b += `font-size: ${l.mob}${c.mob};`),
                            o && o.mob && void 0 !== o.mob && "" !== o.mob && !1 === isNaN(o.mob) && (b += `line-height: ${o.mob}${g.mob};`),
                            u && u.mob && void 0 !== u.mob && "" !== u.mob && !1 === isNaN(u.mob) && (b += `letter-spacing: ${u.mob}${d.mob};`),
                            { desktopStyles: y, tabletStyles: m, mobileStyles: b }
                        );
                    },
                    R = ({ controlName: e, attributes: a, propertyName: t, noUnits: i = !1, noProperty: r = !1 }) => {
                        const { [`${e}Ranges`]: n, [`${e}Units`]: s } = a,
                            { desk: l, tab: o, mob: u } = n,
                            c = i ? "" : s;
                        return {
                            deskStyle: void 0 !== l && "" !== l && !1 === isNaN(l) ? `${r ? "" : t + ":"}${l}${c.desk};` : "",
                            tabStyle: void 0 !== o && "" !== o && !1 === isNaN(o) ? `${r ? "" : t + ":"}${o}${c.tab};` : "",
                            mobStyle: void 0 !== u && "" !== u && !1 === isNaN(u) ? `${r ? "" : t + ":"}${u}${c.mob};` : "",
                        };
                    },
                    P = ({ controlName: e, attributes: a, propertyName: t }) => {
                        const { [`${e}Aligns`]: i } = a;
                        return {
                            deskAlign: i && void 0 !== i.desk && "" !== i.desk ? `${t}:${i.desk};` : "",
                            tabAlign: i && void 0 !== i.tab && "" !== i.tab ? `${t}:${i.tab};` : "",
                            mobAlign: i && void 0 !== i.mob && "" !== i.mob ? `${t}:${i.mob};` : "",
                        };
                    },
                    I = "titlesAlignment",
                    A = "titleIconGap",
                    D = "tcBorder",
                    _ = "tcBorderRadius",
                    E = "tcPadding",
                    F = "tcMargin",
                    V = "titlesGap",
                    H = "stTypo",
                    G = "stPadding",
                    z = "stMargin",
                    U = "stBorder",
                    K = "stBorderRadius",
                    W = "iconSize",
                    q = "separatorWidth",
                    Y = "cbPadding",
                    Z = "cbMargin",
                    J = "cbBorder",
                    X = "cbBorderRadius",
                    Q = "atBorder",
                    ee = "atBorderRadius",
                    ae = "atPadding",
                    te = "atMargin",
                    ie = "atIconSize",
                    { nk: re, Tr: ne, k4: se, qy: le, O5: oe } = r,
                    { YB: ue, bL: ce, Wc: ge, lt: de, Au: ye, ww: fe, tj: me, xW: be, QJ: ve, LT: pe, t: he, kD: xe, Ev: Se, xZ: ke, it: we, $o: Ce, t$: Ne, ih: Me, vW: je, iJ: $e, O3: Oe, V7: Be, kB: Te } = n,
                    Le = {
                        uniqueID: { type: "string" },
                        blockStyle: { type: "object" },
                        tabTitles: { type: "array", default: [] },
                        tabChildCount: { type: "number", default: 3 },
                        iconPosition: { type: "string", default: "icon_left" },
                        titleColor: { type: "string" },
                        tcBgType: { type: "string", default: "classic" },
                        tcBgColor: { type: "string" },
                        tcBgGradient: { type: "string" },
                        stBgType: { type: "string", default: "classic" },
                        stBgColor: { type: "string" },
                        stBgGradient: { type: "string" },
                        iconColor: { type: "string" },
                        showSeparator: { type: "boolean", default: !1 },
                        separatorColor: { type: "string" },
                        cbBgType: { type: "string", default: "classic" },
                        cbBgColor: { type: "string" },
                        cbBgGradient: { type: "string" },
                        atColor: { type: "string" },
                        atBgType: { type: "string", default: "classic" },
                        atBgColor: { type: "string" },
                        atBgGradient: { type: "string" },
                        atIconColor: { type: "string" },
                        ...ne({ controlName: je }),
                        ...re({ controlName: $e }),
                        ...re({ controlName: Oe }),
                        ...re({ controlName: Be }),
                        ...le({ controlName: Te }),
                        ...oe({ controlName: ue }),
                        ...le({ controlName: ge }),
                        ...re({ controlName: fe }),
                        ...re({ controlName: me }),
                        ...ne({ controlName: de }),
                        ...re({ controlName: ye }),
                        ...le({ controlName: ce }),
                        ...se({ controlName: be }),
                        ...re({ controlName: ve }),
                        ...re({ controlName: pe }),
                        ...ne({ controlName: he }),
                        ...re({ controlName: xe }),
                        ...le({ controlName: Se }),
                        ...le({ controlName: ke }),
                        ...re({ controlName: we }),
                        ...re({ controlName: Ce }),
                        ...ne({ controlName: Ne }),
                        ...re({ controlName: Me }),
                    },
                    Re = window.wp.blockEditor,
                    Pe = window.lodash,
                    Ie = window.wp.components,
                    Ae = window.wp.element,
                    De = ({ settingTabContent: e, designTabContent: a }) =>
                        (0, y.jsxs)(y.Fragment, {
                            children: [
                                (0, y.jsx)(Re.InspectorControls, { group: "settings", children: (0, y.jsx)("div", { className: "gkits-panel", children: e }) }),
                                (0, y.jsx)(Re.InspectorControls, { group: "styles", children: (0, y.jsx)("div", { className: "gkits-panel", children: a }) }),
                            ],
                        }),
                    _e = window.wp.compose,
                    Ee =
                        ((0, _e.withInstanceId)(({ label: e, children: a, instanceId: t }) => {
                            const i = `popover-control-${t}`;
                            return (0, y.jsx)("div", {
                                className: "gkits-control-container popover-control",
                                children: (0, y.jsxs)(Ie.Flex, {
                                    children: [
                                        (0, y.jsx)(Ie.FlexBlock, { children: (0, y.jsx)(Ie.BaseControl, { id: i, label: e }) }),
                                        (0, y.jsx)(Ie.FlexItem, {
                                            children: (0, y.jsx)(Ie.Dropdown, {
                                                popoverProps: { placement: "bottom-start" },
                                                renderToggle: ({ isOpen: e, onToggle: a }) =>
                                                    (0, y.jsx)(Ie.Button, {
                                                        className: "popover-expand " + (e ? "active" : ""),
                                                        onClick: a,
                                                        "aria-expanded": e,
                                                        children: (0, y.jsx)("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            width: 16,
                                                            height: 16,
                                                            fill: "currentColor",
                                                            viewBox: "0 0 16 16",
                                                            children: (0, y.jsx)("path", {
                                                                fillRule: "evenodd",
                                                                d:
                                                                    "M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z",
                                                            }),
                                                        }),
                                                    }),
                                                renderContent: () => (0, y.jsx)("div", { className: "gkits-popover-panel", children: a }),
                                            }),
                                        }),
                                    ],
                                }),
                            });
                        }),
                        [
                            { label: (0, d.__)("Normal", "gutsliders"), value: "normal" },
                            { label: (0, d.__)("Hover", "gutsliders"), value: "hover" },
                        ]),
                    Fe = ({ normal: e, hover: a }) => {
                        const [t, i] = (0, Ae.useState)("normal");
                        return (0, y.jsxs)("div", {
                            className: "gkits-control-container gkits-switcher gkits-mb-24",
                            children: [
                                (0, y.jsx)(Ie.ButtonGroup, {
                                    children: Ee && Ee.map((e, a) => (0, y.jsx)(Ie.Button, { className: "switcher-button " + (t === e.value ? "gkits-active" : ""), onClick: () => i(e.value), children: e.label }, a)),
                                }),
                                (0, y.jsxs)("div", {
                                    className: "gkits-switcher-content",
                                    children: ["normal" === t && (0, y.jsx)("div", { className: "gkits-normal-content", children: e }), "hover" === t && (0, y.jsx)("div", { className: "gkits-hover-content", children: a })],
                                }),
                            ],
                        });
                    },
                    Ve = ({ resMode: e, setAttributes: a }) => {
                        const t = e;
                        return (
                            (0, Ae.useEffect)(() => {
                                a({ resMode: "Desktop" });
                            }, []),
                            (0, y.jsx)("div", {
                                className: "gkits-res-btn",
                                children: (0, y.jsx)(Ie.ButtonGroup, {
                                    children:
                                        m &&
                                        m.map((e, i) =>
                                            (0, y.jsx)(
                                                Ie.Button,
                                                {
                                                    className: "gkits-device-btn " + (t === e.label ? "gkits-active" : ""),
                                                    onClick: () => {
                                                        a({ resMode: e.label });
                                                    },
                                                    title: e.label,
                                                    children: e.icon,
                                                },
                                                i
                                            )
                                        ),
                                }),
                            })
                        );
                    },
                    He = ({ label: e, requiredProps: a = {}, noResBtns: t = !1 }) => {
                        const { id: i, resMode: r, setAttributes: n } = a;
                        return (0, y.jsxs)("div", {
                            className: "gkits-res-label-control",
                            children: [(0, y.jsx)("label", { className: "gkits-label", htmlFor: i || "", children: e }), !t && (0, y.jsx)(Ve, { resMode: r, setAttributes: n })],
                        });
                    },
                    Ge = ({ children: e, onReset: a, value: t }) =>
                        (0, y.jsx)("div", {
                            className: "gkits-reset-control",
                            children: (0, y.jsxs)(Ie.Flex, {
                                justify: { justifyContent: "flex-start" },
                                children: [
                                    (0, y.jsx)(Ie.FlexItem, {
                                        children: (0, y.jsx)(Ie.Button, { icon: "image-rotate", label: (0, d.__)("Reset", "gutsliders"), onClick: () => a(), className: "gkits-reset-button range-btn " + (t ? "active" : "disabled") }),
                                    }),
                                    (0, y.jsx)(Ie.FlexBlock, { children: e }),
                                ],
                            }),
                        }),
                    ze = ({ value: e, onChange: a, units: t }) =>
                        (0, y.jsx)("div", { className: "gkits-units-wrapper", children: t && t.map((t, i) => (0, y.jsx)("button", { className: "unit-btn " + (t === e ? "gkits-active" : ""), onClick: () => a(t), children: t }, i)) }),
                    Ue = (0, _e.withInstanceId)(({ label: e, controlName: a, objAttrs: t, noUnits: i, units: r, min: n, max: s, instanceId: l }) => {
                        const { attributes: o, setAttributes: u } = t,
                            { resMode: c } = o,
                            { [`${a}Ranges`]: g, [`${a}Units`]: d } = o,
                            f = `res-controls-${l}`,
                            m = r || b;
                        return (0, y.jsxs)("div", {
                            className: "gkits-control-container",
                            children: [
                                (0, y.jsxs)(Ie.Flex, {
                                    align: "flex-start",
                                    children: [
                                        (0, y.jsx)(Ie.FlexItem, { children: (0, y.jsx)(He, { label: e, requiredProps: { id: f, resMode: c, setAttributes: u } }) }),
                                        (0, y.jsx)(Ie.FlexItem, {
                                            children:
                                                !i &&
                                                (0, y.jsxs)(Ae.Fragment, {
                                                    children: [
                                                        "Desktop" === c && (0, y.jsx)(ze, { value: d && d.desk, onChange: (e) => u({ [`${a}Units`]: { ...d, desk: e } }), units: m }),
                                                        "Tablet" === c && (0, y.jsx)(ze, { value: d && d.tab, onChange: (e) => u({ [`${a}Units`]: { ...d, tab: e } }), units: m }),
                                                        "Mobile" === c && (0, y.jsx)(ze, { value: d && d.mob, onChange: (e) => u({ [`${a}Units`]: { ...d, mob: e } }), units: m }),
                                                    ],
                                                }),
                                        }),
                                    ],
                                }),
                                (0, y.jsxs)("div", {
                                    className: "gkits-controls-body",
                                    id: f,
                                    children: [
                                        "Desktop" === c &&
                                            (0, y.jsx)(Ge, {
                                                onReset: () => {
                                                    u({ [`${a}Ranges`]: { ...g, desk: "" } }), u({ [`${a}Unit`]: "px" });
                                                },
                                                value: g && g.desk,
                                                children: (0, y.jsx)(Ie.RangeControl, { value: g && g.desk, onChange: (e) => u({ [`${a}Ranges`]: { ...g, desk: e } }), min: n, max: !d || ("vh" !== d.desk && "%" !== d.desk) ? s : 100 }),
                                            }),
                                        "Tablet" === c &&
                                            (0, y.jsx)(Ge, {
                                                onReset: () => {
                                                    u({ [`${a}Ranges`]: { ...g, tab: "" } }), u({ [`${a}Unit`]: "px" });
                                                },
                                                value: g && g.tab,
                                                children: (0, y.jsx)(Ie.RangeControl, { value: g && g.tab, onChange: (e) => u({ [`${a}Ranges`]: { ...g, tab: e } }), min: n, max: !d || ("vh" !== d.tab && "%" !== d.tab) ? s : 100 }),
                                            }),
                                        "Mobile" === c &&
                                            (0, y.jsx)(Ge, {
                                                onReset: () => {
                                                    u({ [`${a}Ranges`]: { ...g, mob: "" } }), u({ [`${a}Unit`]: "px" });
                                                },
                                                value: g && g.mob,
                                                children: (0, y.jsx)(Ie.RangeControl, { value: g && g.mob, onChange: (e) => u({ [`${a}Ranges`]: { ...g, mob: e } }), min: n, max: !d || ("vh" !== d.mob && "%" !== d.mob) ? s : 100 }),
                                            }),
                                    ],
                                }),
                            ],
                        });
                    }),
                    Ke = ({ label: e, controlName: a, objAttrs: t, noUnits: i, units: r, min: n, max: s, instanceId: l }) => {
                        const { attributes: o, setAttributes: u } = t,
                            { resMode: c } = o,
                            {
                                [`${a}Values`]: g,
                                [`${a}LinkedStatus`]: f,
                                [`${a}LinkedValue`]: m,
                                [`${a}TabValues`]: v,
                                [`${a}TabLinkedStatus`]: p,
                                [`${a}TabLinkedValue`]: h,
                                [`${a}MobValues`]: x,
                                [`${a}MobLinkedStatus`]: S,
                                [`${a}MobLinkedValue`]: k,
                                [`${a}Units`]: w,
                            } = o,
                            C = `res-controls-${l}`,
                            N = r || b;
                        return (0, y.jsxs)("div", {
                            className: "gkits-control-container",
                            children: [
                                (0, y.jsxs)(Ie.Flex, {
                                    align: "flex-start",
                                    children: [
                                        (0, y.jsx)(Ie.FlexItem, { children: (0, y.jsx)(He, { label: e, requiredProps: { id: C, resMode: c, setAttributes: u } }) }),
                                        (0, y.jsx)(Ie.FlexItem, {
                                            children:
                                                !i &&
                                                (0, y.jsxs)(Ae.Fragment, {
                                                    children: [
                                                        "Desktop" === c && (0, y.jsx)(ze, { value: w && w.desk, onChange: (e) => u({ [`${a}Units`]: { ...w, desk: e } }), units: N }),
                                                        "Tablet" === c && (0, y.jsx)(ze, { value: w && w.tab, onChange: (e) => u({ [`${a}Units`]: { ...w, tab: e } }), units: N }),
                                                        "Mobile" === c && (0, y.jsx)(ze, { value: w && w.mob, onChange: (e) => u({ [`${a}Units`]: { ...w, mob: e } }), units: N }),
                                                    ],
                                                }),
                                        }),
                                    ],
                                }),
                                (0, y.jsxs)("div", {
                                    className: "gkits-controls-body",
                                    id: C,
                                    children: [
                                        "Desktop" === c &&
                                            (0, y.jsxs)("div", {
                                                className: "gkits-single-inputs-group",
                                                children: [
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Top", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: f ? m : g && g.top,
                                                            onChange: (e) => u(f ? { [`${a}LinkedValue`]: parseInt(e) } : { [`${a}Values`]: { ...g, top: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Right", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: f ? m : g && g.right,
                                                            onChange: (e) => u(f ? { [`${a}LinkedValue`]: parseInt(e) } : { [`${a}Values`]: { ...g, right: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Bottom", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: f ? m : g && g.bottom,
                                                            onChange: (e) => u(f ? { [`${a}LinkedValue`]: parseInt(e) } : { [`${a}Values`]: { ...g, bottom: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Left", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: f ? m : g && g.left,
                                                            onChange: (e) => u(f ? { [`${a}LinkedValue`]: parseInt(e) } : { [`${a}Values`]: { ...g, left: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input desk-linked-btn",
                                                        children: (0, y.jsx)(Ie.Button, { className: f ? "active" : "", onClick: () => u({ [`${a}LinkedStatus`]: !f }), icon: f ? "admin-links" : "editor-unlink" }),
                                                    }),
                                                ],
                                            }),
                                        "Tablet" === c &&
                                            (0, y.jsxs)("div", {
                                                className: "gkits-single-inputs-group",
                                                children: [
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Top", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: p ? h : v && v.top,
                                                            onChange: (e) => u(p ? { [`${a}TabLinkedValue`]: parseInt(e) } : { [`${a}TabValues`]: { ...v, top: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Right", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: p ? h : v && v.right,
                                                            onChange: (e) => u(p ? { [`${a}TabLinkedValue`]: parseInt(e) } : { [`${a}TabValues`]: { ...v, right: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Bottom", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: p ? h : v && v.bottom,
                                                            onChange: (e) => u(p ? { [`${a}TabLinkedValue`]: parseInt(e) } : { [`${a}TabValues`]: { ...v, bottom: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Left", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: p ? h : v && v.left,
                                                            onChange: (e) => u(p ? { [`${a}TabLinkedValue`]: parseInt(e) } : { [`${a}TabValues`]: { ...v, left: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input desk-linked-btn",
                                                        children: (0, y.jsx)(Ie.Button, { className: p ? "active" : "", onClick: () => u({ [`${a}TabLinkedStatus`]: !p }), icon: p ? "admin-links" : "editor-unlink" }),
                                                    }),
                                                ],
                                            }),
                                        "Mobile" === c &&
                                            (0, y.jsxs)("div", {
                                                className: "gkits-single-inputs-group",
                                                children: [
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Top", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: S ? k : x && x.top,
                                                            onChange: (e) => u(S ? { [`${a}MobLinkedValue`]: parseInt(e) } : { [`${a}MobValues`]: { ...x, top: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Right", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: S ? k : x && x.right,
                                                            onChange: (e) => u(S ? { [`${a}MobLinkedValue`]: parseInt(e) } : { [`${a}MobValues`]: { ...x, right: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Bottom", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: S ? k : x && x.bottom,
                                                            onChange: (e) => u(S ? { [`${a}MobLinkedValue`]: parseInt(e) } : { [`${a}MobValues`]: { ...x, bottom: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input",
                                                        children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                            label: (0, d.__)("Left", "gutsliders"),
                                                            labelPosition: "bottom",
                                                            value: S ? k : x && x.left,
                                                            onChange: (e) => u(S ? { [`${a}MobLinkedValue`]: parseInt(e) } : { [`${a}MobValues`]: { ...x, left: parseInt(e) } }),
                                                            min: n,
                                                            max: s,
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "single-input desk-linked-btn",
                                                        children: (0, y.jsx)(Ie.Button, { className: S ? "active" : "", onClick: () => u({ [`${a}MobLinkedStatus`]: !S }), icon: S ? "admin-links" : "editor-unlink" }),
                                                    }),
                                                ],
                                            }),
                                    ],
                                }),
                            ],
                        });
                    },
                    We = window.wp.data,
                    qe = (0, _e.withInstanceId)(({ label: e, color: a, onChange: t, instanceId: i }) => {
                        const [r, n] = (0, Ae.useState)(!1),
                            s = (0, We.select)("core/editor").getEditorSettings()?.colors,
                            l = `color-control-${i}`;
                        return (0, y.jsx)("div", {
                            className: "gkits-control-container gkits-color-control gkits-mb-0",
                            children: (0, y.jsxs)(Ie.Flex, {
                                children: [
                                    (0, y.jsx)(Ie.FlexBlock, { children: (0, y.jsx)(Ie.BaseControl, { id: l, label: e }) }),
                                    (0, y.jsx)(Ie.FlexItem, {
                                        children: (0, y.jsx)(Ie.Button, { icon: "image-rotate", label: (0, d.__)("Reset", "gutsliders"), onClick: () => t(""), className: "gkits-reset-button " + (a ? "active" : "disabled") }),
                                    }),
                                    (0, y.jsxs)(Ie.FlexItem, {
                                        children: [
                                            (0, y.jsx)("button", { className: "color-indicator", onClick: () => n(!0), children: (0, y.jsx)(Ie.ColorIndicator, { colorValue: a }) }),
                                            r &&
                                                (0, y.jsx)(Ie.Popover, {
                                                    position: "bottom right",
                                                    onFocusOutside: () => n(!1),
                                                    offset: 10,
                                                    children: (0, y.jsxs)("div", {
                                                        className: "gkits-color-panel",
                                                        children: [
                                                            (0, y.jsx)(Ie.ColorPicker, { color: a, onChangeComplete: (e) => t(e.hex), disableAlpha: !1 }),
                                                            (0, y.jsxs)("div", {
                                                                className: "gkits-colors-palette",
                                                                children: [
                                                                    (0, y.jsx)("label", { className: "gkits-label gkits-mb-8", htmlFor: "gkits-colors-palette", children: (0, d.__)("Colors Palette", "gutsliders") }),
                                                                    (0, y.jsx)("div", {
                                                                        id: "gkits-colors-palette",
                                                                        children:
                                                                            s &&
                                                                            s.map((e, i) =>
                                                                                (0, y.jsx)(
                                                                                    Ie.ColorIndicator,
                                                                                    { className: "gkits-color-indicator " + (e.color === a ? "active" : ""), title: e.name, colorValue: e.color, onClick: () => t(e.color) },
                                                                                    i
                                                                                )
                                                                            ),
                                                                    }),
                                                                ],
                                                            }),
                                                        ],
                                                    }),
                                                }),
                                        ],
                                    }),
                                ],
                            }),
                        });
                    }),
                    Ye = ({ label: e = "", value: a, onChange: t, options: i, hasIcons: r = !1 }) =>
                        (0, y.jsxs)("div", {
                            className: "gkits-control-container gkits-btns-group",
                            children: [
                                e && (0, y.jsx)("div", { className: "gkits-mb-8", children: (0, y.jsx)(He, { label: e, noResBtns: !0 }) }),
                                (0, y.jsx)(Ie.ButtonGroup, {
                                    children:
                                        i &&
                                        i.map((e, i) =>
                                            (0, y.jsx)(
                                                Ie.Button,
                                                { className: "gkits-btn " + (e.value === a ? "gkits-btn-active" : ""), "aria-pressed": e.value === a, onClick: () => t(e.value), disabled: e.disabled, children: r ? e.icon : e.label },
                                                i
                                            )
                                        ),
                                }),
                            ],
                        }),
                    Ze = (0, _e.withInstanceId)(({ instanceId: e, label: a, controlName: t, objAttrs: i, flexAlign: r = !1, flexVerticle: n = !1, options: s = [] }) => {
                        const { attributes: l, setAttributes: o } = i,
                            { resMode: u } = l,
                            { [`${t}Aligns`]: c } = l,
                            g = `alignment-control-${e}`,
                            d = r ? (n ? S : x) : p,
                            f = s.length ? s : d;
                        return (0, y.jsxs)("div", {
                            className: "gkits-control-container",
                            children: [
                                (0, y.jsx)("div", { className: "gkits-mb-8", children: (0, y.jsx)(He, { id: g, label: a, requiredProps: { id: g, resMode: u, setAttributes: o } }) }),
                                "Desktop" === u && (0, y.jsx)(Ye, { value: c && c.desk, onChange: (e) => o({ [`${t}Aligns`]: { ...c, desk: e } }), options: f, hasIcons: !0 }),
                                "Tablet" === u && (0, y.jsx)(Ye, { value: c && c.tab, onChange: (e) => o({ [`${t}Aligns`]: { ...c, tab: e } }), options: f, hasIcons: !0 }),
                                "Mobile" === u && (0, y.jsx)(Ye, { value: c && c.mob, onChange: (e) => o({ [`${t}Aligns`]: { ...c, mob: e } }), options: f, hasIcons: !0 }),
                            ],
                        });
                    }),
                    Je =
                        ((0, _e.withInstanceId)(({ instanceId: e, label: a, controlName: t, objAttrs: i }) => {
                            const [r, n] = (0, Ae.useState)(!1),
                                [s, l] = (0, Ae.useState)(!1),
                                o = `boxshadow-control-${e}`,
                                { attributes: u, setAttributes: c } = i,
                                { [`${t}BoxShadowPosition`]: g = "outset", [`${t}BoxShadowColor`]: f, [`${t}BoxShadowHorizontal`]: m, [`${t}BoxShadowVertical`]: b, [`${t}BoxShadowBlur`]: v, [`${t}BoxShadowSpread`]: p } = u;
                            return (0, y.jsx)("div", {
                                className: "gkits-control-container box-shadow-control",
                                children: (0, y.jsxs)(Ie.Flex, {
                                    children: [
                                        (0, y.jsx)(Ie.FlexBlock, { children: (0, y.jsx)(He, { label: a, requiredProps: { id: o, setAttributes: c }, noResBtns: !0 }) }),
                                        (0, y.jsxs)(Ie.FlexItem, {
                                            children: [
                                                (0, y.jsx)(Ie.Button, {
                                                    icon: "image-rotate",
                                                    label: (0, d.__)("Reset", "gutsliders"),
                                                    onClick: () => {
                                                        c({
                                                            [`${t}BoxShadowPosition`]: "outset",
                                                            [`${t}BoxShadowColor`]: "",
                                                            [`${t}BoxShadowHorizontal`]: "",
                                                            [`${t}BoxShadowVertical`]: "",
                                                            [`${t}BoxShadowBlur`]: "",
                                                            [`${t}BoxShadowSpread`]: "",
                                                        });
                                                    },
                                                    className: "gkits-reset-button range-btn " + (f || m || b || p || v ? "gkits-reset-button" : "disabled"),
                                                }),
                                                (0, y.jsx)(Ie.Button, { className: "shadow-indicator", onClick: () => n(!0), icon: "admin-appearance" }),
                                                r &&
                                                    (0, y.jsx)(Ie.Popover, {
                                                        position: "bottom right",
                                                        onFocusOutside: () => n(!1),
                                                        offset: 10,
                                                        children: (0, y.jsxs)("div", {
                                                            className: "gkits-shadow-panel",
                                                            children: [
                                                                (0, y.jsxs)("div", {
                                                                    className: "position",
                                                                    children: [
                                                                        (0, y.jsx)("div", {
                                                                            className: "gkits-mb-8",
                                                                            children: (0, y.jsx)(He, { label: (0, d.__)("Position", "gutsliders"), requiredProps: { id: o, setAttributes: c }, noResBtns: !0 }),
                                                                        }),
                                                                        (0, y.jsx)(Ye, { value: g, onChange: (e) => c({ [`${t}BoxShadowPosition`]: e }), options: k, hasIcons: !1 }),
                                                                    ],
                                                                }),
                                                                (0, y.jsxs)("div", {
                                                                    className: "box-shadow-color-picker",
                                                                    children: [
                                                                        (0, y.jsxs)(Ie.Flex, {
                                                                            children: [
                                                                                (0, y.jsx)(Ie.FlexBlock, {
                                                                                    children: (0, y.jsx)("div", {
                                                                                        className: "gkits-mb-8",
                                                                                        children: (0, y.jsx)(He, { label: (0, d.__)("Color", "gutsliders"), requiredProps: { id: o, setAttributes: c }, noResBtns: !0 }),
                                                                                    }),
                                                                                }),
                                                                                (0, y.jsx)(Ie.FlexItem, {
                                                                                    children: (0, y.jsx)(Ie.Button, {
                                                                                        icon: "image-rotate",
                                                                                        label: (0, d.__)("Reset", "gutsliders"),
                                                                                        onClick: () => c({ [`${t}BoxShadowColor`]: "" }),
                                                                                        className: "gkits-reset-button " + (f ? "active" : "disabled"),
                                                                                    }),
                                                                                }),
                                                                                (0, y.jsx)(Ie.FlexItem, {
                                                                                    children: (0, y.jsx)("button", { className: "color-indicator", onClick: () => l(!0), children: (0, y.jsx)(Ie.ColorIndicator, { colorValue: f }) }),
                                                                                }),
                                                                            ],
                                                                        }),
                                                                        s &&
                                                                            (0, y.jsx)(Ie.Popover, {
                                                                                onFocusOutside: () => l(!1),
                                                                                position: "bottom center",
                                                                                offset: 5,
                                                                                children: (0, y.jsx)(Ie.ColorPicker, { color: f, onChangeComplete: (e) => c({ [`${t}BoxShadowColor`]: e.hex }), disableAlpha: !1 }),
                                                                            }),
                                                                    ],
                                                                }),
                                                                (0, y.jsxs)("div", {
                                                                    className: "gkits-mb-16",
                                                                    children: [
                                                                        (0, y.jsx)(He, { label: (0, d.__)("Horizontal", "gutsliders"), requiredProps: { id: o, setAttributes: c }, noResBtns: !0 }),
                                                                        (0, y.jsx)(Ge, {
                                                                            onReset: () => c({ [`${t}BoxShadowHorizontal`]: "" }),
                                                                            value: m,
                                                                            children: (0, y.jsx)(Ie.RangeControl, { value: m, onChange: (e) => c({ [`${t}BoxShadowHorizontal`]: e }), min: -100, max: 100 }),
                                                                        }),
                                                                    ],
                                                                }),
                                                                (0, y.jsxs)("div", {
                                                                    className: "gkits-mb-16",
                                                                    children: [
                                                                        (0, y.jsx)(He, { label: (0, d.__)("Vertical", "gutsliders"), requiredProps: { id: o, setAttributes: c }, noResBtns: !0 }),
                                                                        (0, y.jsx)(Ge, {
                                                                            onReset: () => c({ [`${t}BoxShadowVertical`]: "" }),
                                                                            value: b,
                                                                            children: (0, y.jsx)(Ie.RangeControl, { value: b, onChange: (e) => c({ [`${t}BoxShadowVertical`]: e }), min: -100, max: 100 }),
                                                                        }),
                                                                    ],
                                                                }),
                                                                (0, y.jsxs)("div", {
                                                                    className: "gkits-mb-16",
                                                                    children: [
                                                                        (0, y.jsx)(He, { label: (0, d.__)("Blur", "gutsliders"), requiredProps: { id: o, setAttributes: c }, noResBtns: !0 }),
                                                                        (0, y.jsx)(Ge, {
                                                                            onReset: () => c({ [`${t}BoxShadowBlur`]: "" }),
                                                                            value: v,
                                                                            children: (0, y.jsx)(Ie.RangeControl, { value: v, onChange: (e) => c({ [`${t}BoxShadowBlur`]: e }), min: 0, max: 100 }),
                                                                        }),
                                                                    ],
                                                                }),
                                                                (0, y.jsx)(He, { label: (0, d.__)("Spread", "gutsliders"), requiredProps: { id: o, setAttributes: c }, noResBtns: !0 }),
                                                                (0, y.jsx)(Ge, {
                                                                    onReset: () => c({ [`${t}BoxShadowSpread`]: "" }),
                                                                    value: p,
                                                                    children: (0, y.jsx)(Ie.RangeControl, { value: p, onChange: (e) => c({ [`${t}BoxShadowSpread`]: e }), min: 0, max: 100 }),
                                                                }),
                                                            ],
                                                        }),
                                                    }),
                                            ],
                                        }),
                                    ],
                                }),
                            });
                        }),
                        [
                            { name: "JShine", gradient: "linear-gradient(135deg,#12c2e9 0%,#c471ed 50%,#f64f59 100%)", slug: "jshine" },
                            { name: "Moonlit Asteroid", gradient: "linear-gradient(135deg,#0F2027 0%, #203A43 0%, #2c5364 100%)", slug: "moonlit-asteroid" },
                            { name: "Rastafarie", gradient: "linear-gradient(135deg,#1E9600 0%, #FFF200 0%, #FF0000 100%)", slug: "rastafari" },
                            { name: "Frozen", gradient: "linear-gradient(135deg,#403B4A 0%, #E7E9BB 100%)", slug: "frozen" },
                            { name: "Mango Pulp", gradient: "linear-gradient(135deg,#F09819 0%, #EDDE5D 100%)", slug: "mango-pulp" },
                            { name: "Bloody Mary", gradient: "linear-gradient(135deg,#FF512F 0%, #DD2476 100%)", slug: "bloody-mary" },
                        ]),
                    Xe =
                        ((0, _e.withInstanceId)(({ instanceId: e, label: a, controlName: t, objAttrs: i }) => {
                            const [r, n] = (0, Ae.useState)(!1),
                                s = `color-control-${e}`,
                                { attributes: l, setAttributes: o } = i,
                                { [`${t}bgType`]: u, [`${t}bgColor`]: c, [`${t}bgGradient`]: g } = l;
                            return (0, y.jsxs)("div", {
                                className: "gkits-control-container background-control",
                                children: [
                                    (0, y.jsxs)(Ie.Flex, {
                                        children: [
                                            (0, y.jsx)(Ie.FlexBlock, { children: (0, y.jsx)(Ie.BaseControl, { id: s, label: a }) }),
                                            (0, y.jsx)(Ie.FlexItem, {
                                                children: (0, y.jsx)(Ie.Button, {
                                                    className: "gkits-editor-icon gkits-reset-button " + (c || g ? "active" : "disabled"),
                                                    icon: "image-rotate",
                                                    label: (0, d.__)("Reset", "gutsliders"),
                                                    onClick: () => o({ [`${t}bgType`]: "", [`${t}bgColor`]: "", [`${t}bgGradient`]: "" }),
                                                }),
                                            }),
                                            (0, y.jsx)(Ie.FlexItem, {
                                                children: (0, y.jsx)("div", {
                                                    className: "bg-type",
                                                    children: (0, y.jsxs)(Ie.ButtonGroup, {
                                                        children: [
                                                            (0, y.jsx)(Ie.Button, {
                                                                className: "gkits-editor-icon " + ("color" === u ? "active" : ""),
                                                                onClick: () => o({ [`${t}bgType`]: "color" }),
                                                                children: (0, y.jsx)("svg", {
                                                                    width: "11",
                                                                    height: "10",
                                                                    viewBox: "0 0 11 10",
                                                                    children: (0, y.jsx)("path", {
                                                                        fill: "#1d2327",
                                                                        d:
                                                                            "M10.6927 1.08247C10.6927 1.08247 10.8502 0.615805 10.5119 0.289139C10.2027 -0.0141947 9.80023 0.149139 9.80023 0.149139C9.4444 0.324139 6.44023 2.17331 5.32606 3.39831C4.8244 3.95831 4.12439 5.60914 4.69023 6.20997C5.2269 6.78164 7.00023 6.11081 7.4844 5.62664C8.68606 4.42497 10.5236 1.44414 10.6927 1.08247ZM0.816895 9.29581C2.19939 8.38581 1.66856 7.30664 2.70106 6.58914C3.24356 6.20997 3.99606 6.22747 4.49773 6.75831C4.86523 7.14914 4.9644 8.25747 4.4044 8.77664C3.48856 9.62247 2.07106 9.68081 0.816895 9.29581Z",
                                                                    }),
                                                                }),
                                                            }),
                                                            (0, y.jsx)(Ie.Button, {
                                                                className: "gkits-editor-icon " + ("gradient" === u ? "active" : ""),
                                                                onClick: () => o({ [`${t}bgType`]: "gradient" }),
                                                                children: (0, y.jsxs)("svg", {
                                                                    width: "12",
                                                                    height: "12",
                                                                    viewBox: "0 0 10 10",
                                                                    children: [
                                                                        (0, y.jsx)("path", {
                                                                            fill: "#1d2327",
                                                                            fillRule: "evenodd",
                                                                            clipRule: "evenodd",
                                                                            d:
                                                                                "M1.11111 1.11111V8.88889H8.88889V1.11111H1.11111ZM0.555556 0C0.248731 0 0 0.248731 0 0.555556V9.44444C0 9.75127 0.248731 10 0.555556 10H9.44444C9.75127 10 10 9.75127 10 9.44444V0.555556C10 0.248731 9.75127 0 9.44444 0H0.555556Z",
                                                                        }),
                                                                        (0, y.jsx)("path", { fill: "#1d2327", d: "M1.66667 1.66667H7.77778L1.66667 7.77778V1.66667Z" }),
                                                                    ],
                                                                }),
                                                            }),
                                                        ],
                                                    }),
                                                }),
                                            }),
                                        ],
                                    }),
                                    "color" === u &&
                                        (0, y.jsx)("div", {
                                            className: "gkits-control-container gkits-color-control",
                                            children: (0, y.jsxs)(Ie.Flex, {
                                                children: [
                                                    (0, y.jsx)(Ie.FlexBlock, { children: (0, y.jsx)(Ie.BaseControl, { id: s, label: (0, d.__)("Solid Color", "gutsliders") }) }),
                                                    (0, y.jsx)(Ie.FlexItem, {
                                                        children: (0, y.jsx)(Ie.Button, {
                                                            icon: "image-rotate",
                                                            label: (0, d.__)("Reset", "gutsliders"),
                                                            onClick: () => o({ [`${t}bgColor`]: "" }),
                                                            className: "gkits-reset-button " + (c ? "active" : "disabled"),
                                                        }),
                                                    }),
                                                    (0, y.jsxs)(Ie.FlexItem, {
                                                        children: [
                                                            (0, y.jsx)("button", { className: "color-indicator", onClick: () => n(!0), children: (0, y.jsx)(Ie.ColorIndicator, { colorValue: c }) }),
                                                            r &&
                                                                (0, y.jsx)(Ie.Popover, {
                                                                    position: "bottom right",
                                                                    onFocusOutside: () => n(!1),
                                                                    offset: 10,
                                                                    children: (0, y.jsx)("div", {
                                                                        className: "gkits-color-panel",
                                                                        children: (0, y.jsx)(Ie.ColorPicker, { color: c, onChangeComplete: (e) => o({ [`${t}bgColor`]: e.hex }), disableAlpha: !1 }),
                                                                    }),
                                                                }),
                                                        ],
                                                    }),
                                                ],
                                            }),
                                        }),
                                    "gradient" === u &&
                                        (0, y.jsxs)("div", {
                                            className: "gkits-control-container gkits-gradient-control",
                                            children: [
                                                (0, y.jsx)(Ie.BaseControl, { id: s, label: (0, d.__)("Gradient Color", "gutsliders") }),
                                                (0, y.jsx)(Ie.GradientPicker, { __nextHasNoMargin: !0, value: g, onChange: (e) => o({ [`${t}bgGradient`]: e }), gradients: Je }),
                                            ],
                                        }),
                                ],
                            });
                        }),
                        [
                            "0-circle",
                            "0-circle-fill",
                            "0-square",
                            "0-square-fill",
                            "1-circle",
                            "1-circle-fill",
                            "1-square",
                            "1-square-fill",
                            "2-circle",
                            "2-circle-fill",
                            "2-square",
                            "2-square-fill",
                            "3-circle",
                            "3-circle-fill",
                            "3-square",
                            "3-square-fill",
                            "4-circle",
                            "4-circle-fill",
                            "4-square",
                            "4-square-fill",
                            "5-circle",
                            "5-circle-fill",
                            "5-square",
                            "5-square-fill",
                            "6-circle",
                            "6-circle-fill",
                            "6-square",
                            "6-square-fill",
                            "7-circle",
                            "7-circle-fill",
                            "7-square",
                            "7-square-fill",
                            "8-circle",
                            "8-circle-fill",
                            "8-square",
                            "8-square-fill",
                            "9-circle",
                            "9-circle-fill",
                            "9-square",
                            "9-square-fill",
                            "activity",
                            "airplane",
                            "airplane-engines",
                            "airplane-engines-fill",
                            "airplane-fill",
                            "alarm",
                            "alarm-fill",
                            "alexa",
                            "align-bottom",
                            "align-center",
                            "align-end",
                            "align-middle",
                            "align-start",
                            "align-top",
                            "alipay",
                            "alt",
                            "amd",
                            "android",
                            "android2",
                            "app",
                            "app-indicator",
                            "apple",
                            "archive",
                            "archive-fill",
                            "arrow-90deg-down",
                            "arrow-90deg-left",
                            "arrow-90deg-right",
                            "arrow-90deg-up",
                            "arrow-bar-down",
                            "arrow-bar-left",
                            "arrow-bar-right",
                            "arrow-bar-up",
                            "arrow-clockwise",
                            "arrow-counterclockwise",
                            "arrow-down",
                            "arrow-down-circle",
                            "arrow-down-circle-fill",
                            "arrow-down-left-circle",
                            "arrow-down-left-circle-fill",
                            "arrow-down-left-square",
                            "arrow-down-left-square-fill",
                            "arrow-down-right-circle",
                            "arrow-down-right-circle-fill",
                            "arrow-down-right-square",
                            "arrow-down-right-square-fill",
                            "arrow-down-square",
                            "arrow-down-square-fill",
                            "arrow-down-left",
                            "arrow-down-right",
                            "arrow-down-short",
                            "arrow-down-up",
                            "arrow-left",
                            "arrow-left-circle",
                            "arrow-left-circle-fill",
                            "arrow-left-square",
                            "arrow-left-square-fill",
                            "arrow-left-right",
                            "arrow-left-short",
                            "arrow-repeat",
                            "arrow-return-left",
                            "arrow-return-right",
                            "arrow-right",
                            "arrow-right-circle",
                            "arrow-right-circle-fill",
                            "arrow-right-square",
                            "arrow-right-square-fill",
                            "arrow-right-short",
                            "arrow-through-heart",
                            "arrow-through-heart-fill",
                            "arrow-up",
                            "arrow-up-circle",
                            "arrow-up-circle-fill",
                            "arrow-up-left-circle",
                            "arrow-up-left-circle-fill",
                            "arrow-up-left-square",
                            "arrow-up-left-square-fill",
                            "arrow-up-right-circle",
                            "arrow-up-right-circle-fill",
                            "arrow-up-right-square",
                            "arrow-up-right-square-fill",
                            "arrow-up-square",
                            "arrow-up-square-fill",
                            "arrow-up-left",
                            "arrow-up-right",
                            "arrow-up-short",
                            "arrows-angle-contract",
                            "arrows-angle-expand",
                            "arrows-collapse",
                            "arrows-expand",
                            "arrows-fullscreen",
                            "arrows-move",
                            "aspect-ratio",
                            "aspect-ratio-fill",
                            "asterisk",
                            "at",
                            "award",
                            "award-fill",
                            "back",
                            "backspace",
                            "backspace-fill",
                            "backspace-reverse",
                            "backspace-reverse-fill",
                            "badge-3d",
                            "badge-3d-fill",
                            "badge-4k",
                            "badge-4k-fill",
                            "badge-8k",
                            "badge-8k-fill",
                            "badge-ad",
                            "badge-ad-fill",
                            "badge-ar",
                            "badge-ar-fill",
                            "badge-cc",
                            "badge-cc-fill",
                            "badge-hd",
                            "badge-hd-fill",
                            "badge-sd",
                            "badge-sd-fill",
                            "badge-tm",
                            "badge-tm-fill",
                            "badge-vo",
                            "badge-vo-fill",
                            "badge-vr",
                            "badge-vr-fill",
                            "badge-wc",
                            "badge-wc-fill",
                            "bag",
                            "bag-check",
                            "bag-check-fill",
                            "bag-dash",
                            "bag-dash-fill",
                            "bag-fill",
                            "bag-heart",
                            "bag-heart-fill",
                            "bag-plus",
                            "bag-plus-fill",
                            "bag-x",
                            "bag-x-fill",
                            "balloon",
                            "balloon-fill",
                            "balloon-heart",
                            "balloon-heart-fill",
                            "bandaid",
                            "bandaid-fill",
                            "bank",
                            "bank2",
                            "bar-chart",
                            "bar-chart-fill",
                            "bar-chart-line",
                            "bar-chart-line-fill",
                            "bar-chart-steps",
                            "basket",
                            "basket-fill",
                            "basket2",
                            "basket2-fill",
                            "basket3",
                            "basket3-fill",
                            "battery",
                            "battery-charging",
                            "battery-full",
                            "battery-half",
                            "behance",
                            "bell",
                            "bell-fill",
                            "bell-slash",
                            "bell-slash-fill",
                            "bezier",
                            "bezier2",
                            "bicycle",
                            "binoculars",
                            "binoculars-fill",
                            "blockquote-left",
                            "blockquote-right",
                            "bluetooth",
                            "body-text",
                            "book",
                            "book-fill",
                            "book-half",
                            "bookmark",
                            "bookmark-check",
                            "bookmark-check-fill",
                            "bookmark-dash",
                            "bookmark-dash-fill",
                            "bookmark-fill",
                            "bookmark-heart",
                            "bookmark-heart-fill",
                            "bookmark-plus",
                            "bookmark-plus-fill",
                            "bookmark-star",
                            "bookmark-star-fill",
                            "bookmark-x",
                            "bookmark-x-fill",
                            "bookmarks",
                            "bookmarks-fill",
                            "bookshelf",
                            "boombox",
                            "boombox-fill",
                            "bootstrap",
                            "bootstrap-fill",
                            "bootstrap-reboot",
                            "border",
                            "border-all",
                            "border-bottom",
                            "border-center",
                            "border-inner",
                            "border-left",
                            "border-middle",
                            "border-outer",
                            "border-right",
                            "border-style",
                            "border-top",
                            "border-width",
                            "bounding-box",
                            "bounding-box-circles",
                            "box",
                            "box-arrow-down-left",
                            "box-arrow-down-right",
                            "box-arrow-down",
                            "box-arrow-in-down",
                            "box-arrow-in-down-left",
                            "box-arrow-in-down-right",
                            "box-arrow-in-left",
                            "box-arrow-in-right",
                            "box-arrow-in-up",
                            "box-arrow-in-up-left",
                            "box-arrow-in-up-right",
                            "box-arrow-left",
                            "box-arrow-right",
                            "box-arrow-up",
                            "box-arrow-up-left",
                            "box-arrow-up-right",
                            "box-fill",
                            "box-seam",
                            "box-seam-fill",
                            "box2",
                            "box2-fill",
                            "box2-heart",
                            "box2-heart-fill",
                            "boxes",
                            "braces",
                            "braces-asterisk",
                            "bricks",
                            "briefcase",
                            "briefcase-fill",
                            "brightness-alt-high",
                            "brightness-alt-high-fill",
                            "brightness-alt-low",
                            "brightness-alt-low-fill",
                            "brightness-high",
                            "brightness-high-fill",
                            "brightness-low",
                            "brightness-low-fill",
                            "broadcast",
                            "broadcast-pin",
                            "browser-chrome",
                            "browser-edge",
                            "browser-firefox",
                            "browser-safari",
                            "brush",
                            "brush-fill",
                            "bucket",
                            "bucket-fill",
                            "bug",
                            "bug-fill",
                            "building",
                            "building-add",
                            "building-check",
                            "building-dash",
                            "building-down",
                            "building-exclamation",
                            "building-fill",
                            "building-fill-add",
                            "building-fill-check",
                            "building-fill-dash",
                            "building-fill-down",
                            "building-fill-exclamation",
                            "building-fill-gear",
                            "building-fill-lock",
                            "building-fill-slash",
                            "building-fill-up",
                            "building-fill-x",
                            "building-gear",
                            "building-lock",
                            "building-slash",
                            "building-up",
                            "building-x",
                            "buildings",
                            "buildings-fill",
                            "bullseye",
                            "bus-front",
                            "bus-front-fill",
                        ]),
                    Qe = (0, _e.withInstanceId)(({ label: e, value: a, onChange: t, instanceId: i }) => {
                        const [r, n] = (0, Ae.useState)(!1),
                            [s, l] = (0, Ae.useState)(""),
                            o = `icon-control-${i}`;
                        return (0, y.jsxs)("div", {
                            className: "gkits-control-container icon-picker-control",
                            children: [
                                (0, y.jsx)(Ie.BaseControl, { id: o, label: e }),
                                (0, y.jsxs)("div", {
                                    className: "icon-placeplaceholder",
                                    children: [
                                        a
                                            ? (0, y.jsx)("div", { className: "selected-icon", children: (0, y.jsx)("i", { className: `bi bi-${a}` }) })
                                            : (0, y.jsx)(Ie.Button, { className: "icon-selected", variant: "secondary", onClick: () => n(!0), children: (0, d.__)("Select Icon", "gutsliders") }),
                                        a && (0, y.jsx)(Ie.Button, { className: "replace-btn", onClick: () => n(!0), children: (0, d.__)("Replace", "gutsliders") }),
                                        a && (0, y.jsx)(Ie.Button, { className: "remove-btn", onClick: () => t(""), icon: "trash" }),
                                    ],
                                }),
                                r &&
                                    (0, y.jsx)(Ie.Modal, {
                                        title: (0, d.__)("Select Icon", "gutsliders"),
                                        onRequestClose: () => n(!1),
                                        isFullscreen: !0,
                                        children: (0, y.jsxs)("div", {
                                            className: "gkits-icons-modal",
                                            children: [
                                                (0, y.jsx)("div", {
                                                    className: "icon-search",
                                                    children: (0, y.jsx)("input", { type: "text", placeholder: (0, d.__)("Search Icon", "gutsliders"), value: s, onChange: (e) => l(e.target.value) }),
                                                }),
                                                (0, y.jsx)("div", {
                                                    className: "icon-list",
                                                    children: s
                                                        ? Xe.filter((e) => e.includes(s)).map((e, i) =>
                                                              (0, y.jsx)(
                                                                  Ie.Button,
                                                                  {
                                                                      className: "icon-item " + (a === e ? "active" : ""),
                                                                      title: e,
                                                                      onClick: () => {
                                                                          t(e), n(!1);
                                                                      },
                                                                      children: (0, y.jsx)("i", { className: `bi bi-${e}` }),
                                                                  },
                                                                  i
                                                              )
                                                          )
                                                        : Xe.map((e, i) =>
                                                              (0, y.jsx)(
                                                                  Ie.Button,
                                                                  {
                                                                      className: "icon-item " + (a === e ? "active" : ""),
                                                                      title: e,
                                                                      onClick: () => {
                                                                          t(e), n(!1);
                                                                      },
                                                                      children: (0, y.jsx)("i", { className: `bi bi-${e}` }),
                                                                  },
                                                                  i
                                                              )
                                                          ),
                                                }),
                                            ],
                                        }),
                                    }),
                            ],
                        });
                    });
                function ea(e) {
                    return (
                        (ea =
                            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                                ? function (e) {
                                      return typeof e;
                                  }
                                : function (e) {
                                      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                                  }),
                        ea(e)
                    );
                }
                function aa(e) {
                    var a = (function (e) {
                        if ("object" != ea(e) || !e) return e;
                        var a = e[Symbol.toPrimitive];
                        if (void 0 !== a) {
                            var t = a.call(e, "string");
                            if ("object" != ea(t)) return t;
                            throw new TypeError("@@toPrimitive must return a primitive value.");
                        }
                        return String(e);
                    })(e);
                    return "symbol" == ea(a) ? a : a + "";
                }
                function ta(e, a, t) {
                    return (a = aa(a)) in e ? Object.defineProperty(e, a, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : (e[a] = t), e;
                }
                function ia(e, a) {
                    var t = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                        var i = Object.getOwnPropertySymbols(e);
                        a &&
                            (i = i.filter(function (a) {
                                return Object.getOwnPropertyDescriptor(e, a).enumerable;
                            })),
                            t.push.apply(t, i);
                    }
                    return t;
                }
                function ra(e) {
                    for (var a = 1; a < arguments.length; a++) {
                        var t = null != arguments[a] ? arguments[a] : {};
                        a % 2
                            ? ia(Object(t), !0).forEach(function (a) {
                                  ta(e, a, t[a]);
                              })
                            : Object.getOwnPropertyDescriptors
                            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
                            : ia(Object(t)).forEach(function (a) {
                                  Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(t, a));
                              });
                    }
                    return e;
                }
                function na(e, a) {
                    (null == a || a > e.length) && (a = e.length);
                    for (var t = 0, i = Array(a); t < a; t++) i[t] = e[t];
                    return i;
                }
                function sa(e, a) {
                    if (e) {
                        if ("string" == typeof e) return na(e, a);
                        var t = {}.toString.call(e).slice(8, -1);
                        return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? na(e, a) : void 0;
                    }
                }
                function la(e, a) {
                    return (
                        (function (e) {
                            if (Array.isArray(e)) return e;
                        })(e) ||
                        (function (e, a) {
                            var t = null == e ? null : ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
                            if (null != t) {
                                var i,
                                    r,
                                    n,
                                    s,
                                    l = [],
                                    o = !0,
                                    u = !1;
                                try {
                                    if (((n = (t = t.call(e)).next), 0 === a)) {
                                        if (Object(t) !== t) return;
                                        o = !1;
                                    } else for (; !(o = (i = n.call(t)).done) && (l.push(i.value), l.length !== a); o = !0);
                                } catch (e) {
                                    (u = !0), (r = e);
                                } finally {
                                    try {
                                        if (!o && null != t.return && ((s = t.return()), Object(s) !== s)) return;
                                    } finally {
                                        if (u) throw r;
                                    }
                                }
                                return l;
                            }
                        })(e, a) ||
                        sa(e, a) ||
                        (function () {
                            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                        })()
                    );
                }
                function oa(e, a) {
                    if (null == e) return {};
                    var t,
                        i,
                        r = (function (e, a) {
                            if (null == e) return {};
                            var t = {};
                            for (var i in e)
                                if ({}.hasOwnProperty.call(e, i)) {
                                    if (a.includes(i)) continue;
                                    t[i] = e[i];
                                }
                            return t;
                        })(e, a);
                    if (Object.getOwnPropertySymbols) {
                        var n = Object.getOwnPropertySymbols(e);
                        for (i = 0; i < n.length; i++) (t = n[i]), a.includes(t) || ({}.propertyIsEnumerable.call(e, t) && (r[t] = e[t]));
                    }
                    return r;
                }
                const ua = window.React;
                var ca = t.n(ua),
                    ga = ["defaultInputValue", "defaultMenuIsOpen", "defaultValue", "inputValue", "menuIsOpen", "onChange", "onInputChange", "onMenuClose", "onMenuOpen", "value"];
                function da() {
                    return (
                        (da = Object.assign
                            ? Object.assign.bind()
                            : function (e) {
                                  for (var a = 1; a < arguments.length; a++) {
                                      var t = arguments[a];
                                      for (var i in t) ({}.hasOwnProperty.call(t, i) && (e[i] = t[i]));
                                  }
                                  return e;
                              }),
                        da.apply(null, arguments)
                    );
                }
                function ya(e, a) {
                    for (var t = 0; t < a.length; t++) {
                        var i = a[t];
                        (i.enumerable = i.enumerable || !1), (i.configurable = !0), "value" in i && (i.writable = !0), Object.defineProperty(e, aa(i.key), i);
                    }
                }
                function fa(e, a) {
                    return (
                        (fa = Object.setPrototypeOf
                            ? Object.setPrototypeOf.bind()
                            : function (e, a) {
                                  return (e.__proto__ = a), e;
                              }),
                        fa(e, a)
                    );
                }
                function ma(e) {
                    return (
                        (ma = Object.setPrototypeOf
                            ? Object.getPrototypeOf.bind()
                            : function (e) {
                                  return e.__proto__ || Object.getPrototypeOf(e);
                              }),
                        ma(e)
                    );
                }
                function ba() {
                    try {
                        var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
                    } catch (e) {}
                    return (ba = function () {
                        return !!e;
                    })();
                }
                function va(e) {
                    return (
                        (function (e) {
                            if (Array.isArray(e)) return na(e);
                        })(e) ||
                        (function (e) {
                            if (("undefined" != typeof Symbol && null != e[Symbol.iterator]) || null != e["@@iterator"]) return Array.from(e);
                        })(e) ||
                        sa(e) ||
                        (function () {
                            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                        })()
                    );
                }
                var pa = (function () {
                        function e(e) {
                            var a = this;
                            (this._insertTag = function (e) {
                                var t;
                                (t = 0 === a.tags.length ? (a.insertionPoint ? a.insertionPoint.nextSibling : a.prepend ? a.container.firstChild : a.before) : a.tags[a.tags.length - 1].nextSibling),
                                    a.container.insertBefore(e, t),
                                    a.tags.push(e);
                            }),
                                (this.isSpeedy = void 0 === e.speedy || e.speedy),
                                (this.tags = []),
                                (this.ctr = 0),
                                (this.nonce = e.nonce),
                                (this.key = e.key),
                                (this.container = e.container),
                                (this.prepend = e.prepend),
                                (this.insertionPoint = e.insertionPoint),
                                (this.before = null);
                        }
                        var a = e.prototype;
                        return (
                            (a.hydrate = function (e) {
                                e.forEach(this._insertTag);
                            }),
                            (a.insert = function (e) {
                                this.ctr % (this.isSpeedy ? 65e3 : 1) == 0 &&
                                    this._insertTag(
                                        (function (e) {
                                            var a = document.createElement("style");
                                            return a.setAttribute("data-emotion", e.key), void 0 !== e.nonce && a.setAttribute("nonce", e.nonce), a.appendChild(document.createTextNode("")), a.setAttribute("data-s", ""), a;
                                        })(this)
                                    );
                                var a = this.tags[this.tags.length - 1];
                                if (this.isSpeedy) {
                                    var t = (function (e) {
                                        if (e.sheet) return e.sheet;
                                        for (var a = 0; a < document.styleSheets.length; a++) if (document.styleSheets[a].ownerNode === e) return document.styleSheets[a];
                                    })(a);
                                    try {
                                        t.insertRule(e, t.cssRules.length);
                                    } catch (e) {}
                                } else a.appendChild(document.createTextNode(e));
                                this.ctr++;
                            }),
                            (a.flush = function () {
                                this.tags.forEach(function (e) {
                                    return e.parentNode && e.parentNode.removeChild(e);
                                }),
                                    (this.tags = []),
                                    (this.ctr = 0);
                            }),
                            e
                        );
                    })(),
                    ha = Math.abs,
                    xa = String.fromCharCode,
                    Sa = Object.assign;
                function ka(e) {
                    return e.trim();
                }
                function wa(e, a, t) {
                    return e.replace(a, t);
                }
                function Ca(e, a) {
                    return e.indexOf(a);
                }
                function Na(e, a) {
                    return 0 | e.charCodeAt(a);
                }
                function Ma(e, a, t) {
                    return e.slice(a, t);
                }
                function ja(e) {
                    return e.length;
                }
                function $a(e) {
                    return e.length;
                }
                function Oa(e, a) {
                    return a.push(e), e;
                }
                var Ba = 1,
                    Ta = 1,
                    La = 0,
                    Ra = 0,
                    Pa = 0,
                    Ia = "";
                function Aa(e, a, t, i, r, n, s) {
                    return { value: e, root: a, parent: t, type: i, props: r, children: n, line: Ba, column: Ta, length: s, return: "" };
                }
                function Da(e, a) {
                    return Sa(Aa("", null, null, "", null, null, 0), e, { length: -e.length }, a);
                }
                function _a() {
                    return (Pa = Ra > 0 ? Na(Ia, --Ra) : 0), Ta--, 10 === Pa && ((Ta = 1), Ba--), Pa;
                }
                function Ea() {
                    return (Pa = Ra < La ? Na(Ia, Ra++) : 0), Ta++, 10 === Pa && ((Ta = 1), Ba++), Pa;
                }
                function Fa() {
                    return Na(Ia, Ra);
                }
                function Va() {
                    return Ra;
                }
                function Ha(e, a) {
                    return Ma(Ia, e, a);
                }
                function Ga(e) {
                    switch (e) {
                        case 0:
                        case 9:
                        case 10:
                        case 13:
                        case 32:
                            return 5;
                        case 33:
                        case 43:
                        case 44:
                        case 47:
                        case 62:
                        case 64:
                        case 126:
                        case 59:
                        case 123:
                        case 125:
                            return 4;
                        case 58:
                            return 3;
                        case 34:
                        case 39:
                        case 40:
                        case 91:
                            return 2;
                        case 41:
                        case 93:
                            return 1;
                    }
                    return 0;
                }
                function za(e) {
                    return (Ba = Ta = 1), (La = ja((Ia = e))), (Ra = 0), [];
                }
                function Ua(e) {
                    return (Ia = ""), e;
                }
                function Ka(e) {
                    return ka(Ha(Ra - 1, Ya(91 === e ? e + 2 : 40 === e ? e + 1 : e)));
                }
                function Wa(e) {
                    for (; (Pa = Fa()) && Pa < 33; ) Ea();
                    return Ga(e) > 2 || Ga(Pa) > 3 ? "" : " ";
                }
                function qa(e, a) {
                    for (; --a && Ea() && !(Pa < 48 || Pa > 102 || (Pa > 57 && Pa < 65) || (Pa > 70 && Pa < 97)); );
                    return Ha(e, Va() + (a < 6 && 32 == Fa() && 32 == Ea()));
                }
                function Ya(e) {
                    for (; Ea(); )
                        switch (Pa) {
                            case e:
                                return Ra;
                            case 34:
                            case 39:
                                34 !== e && 39 !== e && Ya(Pa);
                                break;
                            case 40:
                                41 === e && Ya(e);
                                break;
                            case 92:
                                Ea();
                        }
                    return Ra;
                }
                function Za(e, a) {
                    for (; Ea() && e + Pa !== 57 && (e + Pa !== 84 || 47 !== Fa()); );
                    return "/*" + Ha(a, Ra - 1) + "*" + xa(47 === e ? e : Ea());
                }
                function Ja(e) {
                    for (; !Ga(Fa()); ) Ea();
                    return Ha(e, Ra);
                }
                var Xa = "-ms-",
                    Qa = "-moz-",
                    et = "-webkit-",
                    at = "comm",
                    tt = "rule",
                    it = "decl",
                    rt = "@keyframes";
                function nt(e, a) {
                    for (var t = "", i = $a(e), r = 0; r < i; r++) t += a(e[r], r, e, a) || "";
                    return t;
                }
                function st(e, a, t, i) {
                    switch (e.type) {
                        case "@layer":
                            if (e.children.length) break;
                        case "@import":
                        case it:
                            return (e.return = e.return || e.value);
                        case at:
                            return "";
                        case rt:
                            return (e.return = e.value + "{" + nt(e.children, i) + "}");
                        case tt:
                            e.value = e.props.join(",");
                    }
                    return ja((t = nt(e.children, i))) ? (e.return = e.value + "{" + t + "}") : "";
                }
                function lt(e) {
                    return Ua(ot("", null, null, null, [""], (e = za(e)), 0, [0], e));
                }
                function ot(e, a, t, i, r, n, s, l, o) {
                    for (var u = 0, c = 0, g = s, d = 0, y = 0, f = 0, m = 1, b = 1, v = 1, p = 0, h = "", x = r, S = n, k = i, w = h; b; )
                        switch (((f = p), (p = Ea()))) {
                            case 40:
                                if (108 != f && 58 == Na(w, g - 1)) {
                                    -1 != Ca((w += wa(Ka(p), "&", "&\f")), "&\f") && (v = -1);
                                    break;
                                }
                            case 34:
                            case 39:
                            case 91:
                                w += Ka(p);
                                break;
                            case 9:
                            case 10:
                            case 13:
                            case 32:
                                w += Wa(f);
                                break;
                            case 92:
                                w += qa(Va() - 1, 7);
                                continue;
                            case 47:
                                switch (Fa()) {
                                    case 42:
                                    case 47:
                                        Oa(ct(Za(Ea(), Va()), a, t), o);
                                        break;
                                    default:
                                        w += "/";
                                }
                                break;
                            case 123 * m:
                                l[u++] = ja(w) * v;
                            case 125 * m:
                            case 59:
                            case 0:
                                switch (p) {
                                    case 0:
                                    case 125:
                                        b = 0;
                                    case 59 + c:
                                        -1 == v && (w = wa(w, /\f/g, "")), y > 0 && ja(w) - g && Oa(y > 32 ? gt(w + ";", i, t, g - 1) : gt(wa(w, " ", "") + ";", i, t, g - 2), o);
                                        break;
                                    case 59:
                                        w += ";";
                                    default:
                                        if ((Oa((k = ut(w, a, t, u, c, r, l, h, (x = []), (S = []), g)), n), 123 === p))
                                            if (0 === c) ot(w, a, k, k, x, n, g, l, S);
                                            else
                                                switch (99 === d && 110 === Na(w, 3) ? 100 : d) {
                                                    case 100:
                                                    case 108:
                                                    case 109:
                                                    case 115:
                                                        ot(e, k, k, i && Oa(ut(e, k, k, 0, 0, r, l, h, r, (x = []), g), S), r, S, g, l, i ? x : S);
                                                        break;
                                                    default:
                                                        ot(w, k, k, k, [""], S, 0, l, S);
                                                }
                                }
                                (u = c = y = 0), (m = v = 1), (h = w = ""), (g = s);
                                break;
                            case 58:
                                (g = 1 + ja(w)), (y = f);
                            default:
                                if (m < 1)
                                    if (123 == p) --m;
                                    else if (125 == p && 0 == m++ && 125 == _a()) continue;
                                switch (((w += xa(p)), p * m)) {
                                    case 38:
                                        v = c > 0 ? 1 : ((w += "\f"), -1);
                                        break;
                                    case 44:
                                        (l[u++] = (ja(w) - 1) * v), (v = 1);
                                        break;
                                    case 64:
                                        45 === Fa() && (w += Ka(Ea())), (d = Fa()), (c = g = ja((h = w += Ja(Va())))), p++;
                                        break;
                                    case 45:
                                        45 === f && 2 == ja(w) && (m = 0);
                                }
                        }
                    return n;
                }
                function ut(e, a, t, i, r, n, s, l, o, u, c) {
                    for (var g = r - 1, d = 0 === r ? n : [""], y = $a(d), f = 0, m = 0, b = 0; f < i; ++f)
                        for (var v = 0, p = Ma(e, g + 1, (g = ha((m = s[f])))), h = e; v < y; ++v) (h = ka(m > 0 ? d[v] + " " + p : wa(p, /&\f/g, d[v]))) && (o[b++] = h);
                    return Aa(e, a, t, 0 === r ? tt : l, o, u, c);
                }
                function ct(e, a, t) {
                    return Aa(e, a, t, at, xa(Pa), Ma(e, 2, -2), 0);
                }
                function gt(e, a, t, i) {
                    return Aa(e, a, t, it, Ma(e, 0, i), Ma(e, i + 1, -1), i);
                }
                var dt = function (e, a, t) {
                        for (var i = 0, r = 0; (i = r), (r = Fa()), 38 === i && 12 === r && (a[t] = 1), !Ga(r); ) Ea();
                        return Ha(e, Ra);
                    },
                    yt = new WeakMap(),
                    ft = function (e) {
                        if ("rule" === e.type && e.parent && !(e.length < 1)) {
                            for (var a = e.value, t = e.parent, i = e.column === t.column && e.line === t.line; "rule" !== t.type; ) if (!(t = t.parent)) return;
                            if ((1 !== e.props.length || 58 === a.charCodeAt(0) || yt.get(t)) && !i) {
                                yt.set(e, !0);
                                for (
                                    var r = [],
                                        n = (function (e, a) {
                                            return Ua(
                                                (function (e, a) {
                                                    var t = -1,
                                                        i = 44;
                                                    do {
                                                        switch (Ga(i)) {
                                                            case 0:
                                                                38 === i && 12 === Fa() && (a[t] = 1), (e[t] += dt(Ra - 1, a, t));
                                                                break;
                                                            case 2:
                                                                e[t] += Ka(i);
                                                                break;
                                                            case 4:
                                                                if (44 === i) {
                                                                    (e[++t] = 58 === Fa() ? "&\f" : ""), (a[t] = e[t].length);
                                                                    break;
                                                                }
                                                            default:
                                                                e[t] += xa(i);
                                                        }
                                                    } while ((i = Ea()));
                                                    return e;
                                                })(za(e), a)
                                            );
                                        })(a, r),
                                        s = t.props,
                                        l = 0,
                                        o = 0;
                                    l < n.length;
                                    l++
                                )
                                    for (var u = 0; u < s.length; u++, o++) e.props[o] = r[l] ? n[l].replace(/&\f/g, s[u]) : s[u] + " " + n[l];
                            }
                        }
                    },
                    mt = function (e) {
                        if ("decl" === e.type) {
                            var a = e.value;
                            108 === a.charCodeAt(0) && 98 === a.charCodeAt(2) && ((e.return = ""), (e.value = ""));
                        }
                    };
                function bt(e, a) {
                    switch (
                        (function (e, a) {
                            return 45 ^ Na(e, 0) ? (((((((a << 2) ^ Na(e, 0)) << 2) ^ Na(e, 1)) << 2) ^ Na(e, 2)) << 2) ^ Na(e, 3) : 0;
                        })(e, a)
                    ) {
                        case 5103:
                            return et + "print-" + e + e;
                        case 5737:
                        case 4201:
                        case 3177:
                        case 3433:
                        case 1641:
                        case 4457:
                        case 2921:
                        case 5572:
                        case 6356:
                        case 5844:
                        case 3191:
                        case 6645:
                        case 3005:
                        case 6391:
                        case 5879:
                        case 5623:
                        case 6135:
                        case 4599:
                        case 4855:
                        case 4215:
                        case 6389:
                        case 5109:
                        case 5365:
                        case 5621:
                        case 3829:
                            return et + e + e;
                        case 5349:
                        case 4246:
                        case 4810:
                        case 6968:
                        case 2756:
                            return et + e + Qa + e + Xa + e + e;
                        case 6828:
                        case 4268:
                            return et + e + Xa + e + e;
                        case 6165:
                            return et + e + Xa + "flex-" + e + e;
                        case 5187:
                            return et + e + wa(e, /(\w+).+(:[^]+)/, et + "box-$1$2" + Xa + "flex-$1$2") + e;
                        case 5443:
                            return et + e + Xa + "flex-item-" + wa(e, /flex-|-self/, "") + e;
                        case 4675:
                            return et + e + Xa + "flex-line-pack" + wa(e, /align-content|flex-|-self/, "") + e;
                        case 5548:
                            return et + e + Xa + wa(e, "shrink", "negative") + e;
                        case 5292:
                            return et + e + Xa + wa(e, "basis", "preferred-size") + e;
                        case 6060:
                            return et + "box-" + wa(e, "-grow", "") + et + e + Xa + wa(e, "grow", "positive") + e;
                        case 4554:
                            return et + wa(e, /([^-])(transform)/g, "$1" + et + "$2") + e;
                        case 6187:
                            return wa(wa(wa(e, /(zoom-|grab)/, et + "$1"), /(image-set)/, et + "$1"), e, "") + e;
                        case 5495:
                        case 3959:
                            return wa(e, /(image-set\([^]*)/, et + "$1$`$1");
                        case 4968:
                            return wa(wa(e, /(.+:)(flex-)?(.*)/, et + "box-pack:$3" + Xa + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + et + e + e;
                        case 4095:
                        case 3583:
                        case 4068:
                        case 2532:
                            return wa(e, /(.+)-inline(.+)/, et + "$1$2") + e;
                        case 8116:
                        case 7059:
                        case 5753:
                        case 5535:
                        case 5445:
                        case 5701:
                        case 4933:
                        case 4677:
                        case 5533:
                        case 5789:
                        case 5021:
                        case 4765:
                            if (ja(e) - 1 - a > 6)
                                switch (Na(e, a + 1)) {
                                    case 109:
                                        if (45 !== Na(e, a + 4)) break;
                                    case 102:
                                        return wa(e, /(.+:)(.+)-([^]+)/, "$1" + et + "$2-$3$1" + Qa + (108 == Na(e, a + 3) ? "$3" : "$2-$3")) + e;
                                    case 115:
                                        return ~Ca(e, "stretch") ? bt(wa(e, "stretch", "fill-available"), a) + e : e;
                                }
                            break;
                        case 4949:
                            if (115 !== Na(e, a + 1)) break;
                        case 6444:
                            switch (Na(e, ja(e) - 3 - (~Ca(e, "!important") && 10))) {
                                case 107:
                                    return wa(e, ":", ":" + et) + e;
                                case 101:
                                    return wa(e, /(.+:)([^;!]+)(;|!.+)?/, "$1" + et + (45 === Na(e, 14) ? "inline-" : "") + "box$3$1" + et + "$2$3$1" + Xa + "$2box$3") + e;
                            }
                            break;
                        case 5936:
                            switch (Na(e, a + 11)) {
                                case 114:
                                    return et + e + Xa + wa(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
                                case 108:
                                    return et + e + Xa + wa(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
                                case 45:
                                    return et + e + Xa + wa(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
                            }
                            return et + e + Xa + e + e;
                    }
                    return e;
                }
                var vt = [
                        function (e, a, t, i) {
                            if (e.length > -1 && !e.return)
                                switch (e.type) {
                                    case it:
                                        e.return = bt(e.value, e.length);
                                        break;
                                    case rt:
                                        return nt([Da(e, { value: wa(e.value, "@", "@" + et) })], i);
                                    case tt:
                                        if (e.length)
                                            return (function (e, a) {
                                                return e.map(a).join("");
                                            })(e.props, function (a) {
                                                switch (
                                                    (function (e) {
                                                        return (e = /(::plac\w+|:read-\w+)/.exec(e)) ? e[0] : e;
                                                    })(a)
                                                ) {
                                                    case ":read-only":
                                                    case ":read-write":
                                                        return nt([Da(e, { props: [wa(a, /:(read-\w+)/, ":-moz-$1")] })], i);
                                                    case "::placeholder":
                                                        return nt(
                                                            [Da(e, { props: [wa(a, /:(plac\w+)/, ":" + et + "input-$1")] }), Da(e, { props: [wa(a, /:(plac\w+)/, ":-moz-$1")] }), Da(e, { props: [wa(a, /:(plac\w+)/, Xa + "input-$1")] })],
                                                            i
                                                        );
                                                }
                                                return "";
                                            });
                                }
                        },
                    ],
                    pt = function (e) {
                        var a = e.key;
                        if ("css" === a) {
                            var t = document.querySelectorAll("style[data-emotion]:not([data-s])");
                            Array.prototype.forEach.call(t, function (e) {
                                -1 !== e.getAttribute("data-emotion").indexOf(" ") && (document.head.appendChild(e), e.setAttribute("data-s", ""));
                            });
                        }
                        var i,
                            r,
                            n = e.stylisPlugins || vt,
                            s = {},
                            l = [];
                        (i = e.container || document.head),
                            Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="' + a + ' "]'), function (e) {
                                for (var a = e.getAttribute("data-emotion").split(" "), t = 1; t < a.length; t++) s[a[t]] = !0;
                                l.push(e);
                            });
                        var o,
                            u,
                            c,
                            g,
                            d = [
                                st,
                                ((g = function (e) {
                                    o.insert(e);
                                }),
                                function (e) {
                                    e.root || ((e = e.return) && g(e));
                                }),
                            ],
                            y =
                                ((u = [ft, mt].concat(n, d)),
                                (c = $a(u)),
                                function (e, a, t, i) {
                                    for (var r = "", n = 0; n < c; n++) r += u[n](e, a, t, i) || "";
                                    return r;
                                });
                        r = function (e, a, t, i) {
                            (o = t), nt(lt(e ? e + "{" + a.styles + "}" : a.styles), y), i && (f.inserted[a.name] = !0);
                        };
                        var f = { key: a, sheet: new pa({ key: a, container: i, nonce: e.nonce, speedy: e.speedy, prepend: e.prepend, insertionPoint: e.insertionPoint }), nonce: e.nonce, inserted: s, registered: {}, insert: r };
                        return f.sheet.hydrate(l), f;
                    },
                    ht = function (e, a, t) {
                        var i = e.key + "-" + a.name;
                        !1 === t && void 0 === e.registered[i] && (e.registered[i] = a.styles);
                    },
                    xt = {
                        animationIterationCount: 1,
                        aspectRatio: 1,
                        borderImageOutset: 1,
                        borderImageSlice: 1,
                        borderImageWidth: 1,
                        boxFlex: 1,
                        boxFlexGroup: 1,
                        boxOrdinalGroup: 1,
                        columnCount: 1,
                        columns: 1,
                        flex: 1,
                        flexGrow: 1,
                        flexPositive: 1,
                        flexShrink: 1,
                        flexNegative: 1,
                        flexOrder: 1,
                        gridRow: 1,
                        gridRowEnd: 1,
                        gridRowSpan: 1,
                        gridRowStart: 1,
                        gridColumn: 1,
                        gridColumnEnd: 1,
                        gridColumnSpan: 1,
                        gridColumnStart: 1,
                        msGridRow: 1,
                        msGridRowSpan: 1,
                        msGridColumn: 1,
                        msGridColumnSpan: 1,
                        fontWeight: 1,
                        lineHeight: 1,
                        opacity: 1,
                        order: 1,
                        orphans: 1,
                        tabSize: 1,
                        widows: 1,
                        zIndex: 1,
                        zoom: 1,
                        WebkitLineClamp: 1,
                        fillOpacity: 1,
                        floodOpacity: 1,
                        stopOpacity: 1,
                        strokeDasharray: 1,
                        strokeDashoffset: 1,
                        strokeMiterlimit: 1,
                        strokeOpacity: 1,
                        strokeWidth: 1,
                    };
                function St(e) {
                    var a = Object.create(null);
                    return function (t) {
                        return void 0 === a[t] && (a[t] = e(t)), a[t];
                    };
                }
                var kt = /[A-Z]|^ms/g,
                    wt = /_EMO_([^_]+?)_([^]*?)_EMO_/g,
                    Ct = function (e) {
                        return 45 === e.charCodeAt(1);
                    },
                    Nt = function (e) {
                        return null != e && "boolean" != typeof e;
                    },
                    Mt = St(function (e) {
                        return Ct(e) ? e : e.replace(kt, "-$&").toLowerCase();
                    }),
                    jt = function (e, a) {
                        switch (e) {
                            case "animation":
                            case "animationName":
                                if ("string" == typeof a)
                                    return a.replace(wt, function (e, a, t) {
                                        return (Ot = { name: a, styles: t, next: Ot }), a;
                                    });
                        }
                        return 1 === xt[e] || Ct(e) || "number" != typeof a || 0 === a ? a : a + "px";
                    };
                function $t(e, a, t) {
                    if (null == t) return "";
                    if (void 0 !== t.__emotion_styles) return t;
                    switch (typeof t) {
                        case "boolean":
                            return "";
                        case "object":
                            if (1 === t.anim) return (Ot = { name: t.name, styles: t.styles, next: Ot }), t.name;
                            if (void 0 !== t.styles) {
                                var i = t.next;
                                if (void 0 !== i) for (; void 0 !== i; ) (Ot = { name: i.name, styles: i.styles, next: Ot }), (i = i.next);
                                return t.styles + ";";
                            }
                            return (function (e, a, t) {
                                var i = "";
                                if (Array.isArray(t)) for (var r = 0; r < t.length; r++) i += $t(e, a, t[r]) + ";";
                                else
                                    for (var n in t) {
                                        var s = t[n];
                                        if ("object" != typeof s) null != a && void 0 !== a[s] ? (i += n + "{" + a[s] + "}") : Nt(s) && (i += Mt(n) + ":" + jt(n, s) + ";");
                                        else if (!Array.isArray(s) || "string" != typeof s[0] || (null != a && void 0 !== a[s[0]])) {
                                            var l = $t(e, a, s);
                                            switch (n) {
                                                case "animation":
                                                case "animationName":
                                                    i += Mt(n) + ":" + l + ";";
                                                    break;
                                                default:
                                                    i += n + "{" + l + "}";
                                            }
                                        } else for (var o = 0; o < s.length; o++) Nt(s[o]) && (i += Mt(n) + ":" + jt(n, s[o]) + ";");
                                    }
                                return i;
                            })(e, a, t);
                        case "function":
                            if (void 0 !== e) {
                                var r = Ot,
                                    n = t(e);
                                return (Ot = r), $t(e, a, n);
                            }
                    }
                    if (null == a) return t;
                    var s = a[t];
                    return void 0 !== s ? s : t;
                }
                var Ot,
                    Bt = /label:\s*([^\s;\n{]+)\s*(;|$)/g,
                    Tt = function (e, a, t) {
                        if (1 === e.length && "object" == typeof e[0] && null !== e[0] && void 0 !== e[0].styles) return e[0];
                        var i = !0,
                            r = "";
                        Ot = void 0;
                        var n = e[0];
                        null == n || void 0 === n.raw ? ((i = !1), (r += $t(t, a, n))) : (r += n[0]);
                        for (var s = 1; s < e.length; s++) (r += $t(t, a, e[s])), i && (r += n[s]);
                        Bt.lastIndex = 0;
                        for (var l, o = ""; null !== (l = Bt.exec(r)); ) o += "-" + l[1];
                        var u =
                            (function (e) {
                                for (var a, t = 0, i = 0, r = e.length; r >= 4; ++i, r -= 4)
                                    (a = 1540483477 * (65535 & (a = (255 & e.charCodeAt(i)) | ((255 & e.charCodeAt(++i)) << 8) | ((255 & e.charCodeAt(++i)) << 16) | ((255 & e.charCodeAt(++i)) << 24))) + ((59797 * (a >>> 16)) << 16)),
                                        (t = (1540483477 * (65535 & (a ^= a >>> 24)) + ((59797 * (a >>> 16)) << 16)) ^ (1540483477 * (65535 & t) + ((59797 * (t >>> 16)) << 16)));
                                switch (r) {
                                    case 3:
                                        t ^= (255 & e.charCodeAt(i + 2)) << 16;
                                    case 2:
                                        t ^= (255 & e.charCodeAt(i + 1)) << 8;
                                    case 1:
                                        t = 1540483477 * (65535 & (t ^= 255 & e.charCodeAt(i))) + ((59797 * (t >>> 16)) << 16);
                                }
                                return (((t = 1540483477 * (65535 & (t ^= t >>> 13)) + ((59797 * (t >>> 16)) << 16)) ^ (t >>> 15)) >>> 0).toString(36);
                            })(r) + o;
                        return { name: u, styles: r, next: Ot };
                    },
                    Lt = !!ua.useInsertionEffect && ua.useInsertionEffect,
                    Rt =
                        Lt ||
                        function (e) {
                            return e();
                        },
                    Pt = (Lt || ua.useLayoutEffect, {}.hasOwnProperty),
                    It = ua.createContext("undefined" != typeof HTMLElement ? pt({ key: "css" }) : null);
                It.Provider;
                var At = function (e) {
                        return (0, ua.forwardRef)(function (a, t) {
                            var i = (0, ua.useContext)(It);
                            return e(a, i, t);
                        });
                    },
                    Dt = ua.createContext({}),
                    _t = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__",
                    Et = function (e) {
                        var a = e.cache,
                            t = e.serialized,
                            i = e.isStringTag;
                        return (
                            ht(a, t, i),
                            Rt(function () {
                                return (function (e, a, t) {
                                    ht(e, a, t);
                                    var i = e.key + "-" + a.name;
                                    if (void 0 === e.inserted[a.name]) {
                                        var r = a;
                                        do {
                                            e.insert(a === r ? "." + i : "", r, e.sheet, !0), (r = r.next);
                                        } while (void 0 !== r);
                                    }
                                })(a, t, i);
                            }),
                            null
                        );
                    },
                    Ft = At(function (e, a, t) {
                        var i = e.css;
                        "string" == typeof i && void 0 !== a.registered[i] && (i = a.registered[i]);
                        var r = e[_t],
                            n = [i],
                            s = "";
                        "string" == typeof e.className
                            ? (s = (function (e, a, t) {
                                  var i = "";
                                  return (
                                      t.split(" ").forEach(function (t) {
                                          void 0 !== e[t] ? a.push(e[t] + ";") : (i += t + " ");
                                      }),
                                      i
                                  );
                              })(a.registered, n, e.className))
                            : null != e.className && (s = e.className + " ");
                        var l = Tt(n, void 0, ua.useContext(Dt));
                        s += a.key + "-" + l.name;
                        var o = {};
                        for (var u in e) Pt.call(e, u) && "css" !== u && u !== _t && (o[u] = e[u]);
                        return (o.ref = t), (o.className = s), ua.createElement(ua.Fragment, null, ua.createElement(Et, { cache: a, serialized: l, isStringTag: "string" == typeof r }), ua.createElement(r, o));
                    }),
                    Vt = Ft,
                    Ht =
                        (t(146),
                        function (e, a) {
                            var t = arguments;
                            if (null == a || !Pt.call(a, "css")) return ua.createElement.apply(void 0, t);
                            var i = t.length,
                                r = new Array(i);
                            (r[0] = Vt),
                                (r[1] = (function (e, a) {
                                    var t = {};
                                    for (var i in a) Pt.call(a, i) && (t[i] = a[i]);
                                    return (t[_t] = e), t;
                                })(e, a));
                            for (var n = 2; n < i; n++) r[n] = t[n];
                            return ua.createElement.apply(null, r);
                        });
                function Gt() {
                    for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++) a[t] = arguments[t];
                    return Tt(a);
                }
                const zt = window.ReactDOM,
                    Ut = Math.min,
                    Kt = Math.max,
                    Wt = Math.round,
                    qt = Math.floor,
                    Yt = (e) => ({ x: e, y: e });
                function Zt(e) {
                    return Qt(e) ? (e.nodeName || "").toLowerCase() : "#document";
                }
                function Jt(e) {
                    var a;
                    return (null == e || null == (a = e.ownerDocument) ? void 0 : a.defaultView) || window;
                }
                function Xt(e) {
                    var a;
                    return null == (a = (Qt(e) ? e.ownerDocument : e.document) || window.document) ? void 0 : a.documentElement;
                }
                function Qt(e) {
                    return e instanceof Node || e instanceof Jt(e).Node;
                }
                function ei(e) {
                    return e instanceof Element || e instanceof Jt(e).Element;
                }
                function ai(e) {
                    return e instanceof HTMLElement || e instanceof Jt(e).HTMLElement;
                }
                function ti(e) {
                    return "undefined" != typeof ShadowRoot && (e instanceof ShadowRoot || e instanceof Jt(e).ShadowRoot);
                }
                function ii(e) {
                    const { overflow: a, overflowX: t, overflowY: i, display: r } = ri(e);
                    return /auto|scroll|overlay|hidden|clip/.test(a + i + t) && !["inline", "contents"].includes(r);
                }
                function ri(e) {
                    return Jt(e).getComputedStyle(e);
                }
                function ni(e) {
                    const a = (function (e) {
                        if ("html" === Zt(e)) return e;
                        const a = e.assignedSlot || e.parentNode || (ti(e) && e.host) || Xt(e);
                        return ti(a) ? a.host : a;
                    })(e);
                    return (function (e) {
                        return ["html", "body", "#document"].includes(Zt(e));
                    })(a)
                        ? e.ownerDocument
                            ? e.ownerDocument.body
                            : e.body
                        : ai(a) && ii(a)
                        ? a
                        : ni(a);
                }
                function si(e, a) {
                    var t;
                    void 0 === a && (a = []);
                    const i = ni(e),
                        r = i === (null == (t = e.ownerDocument) ? void 0 : t.body),
                        n = Jt(i);
                    return r ? a.concat(n, n.visualViewport || [], ii(i) ? i : []) : a.concat(i, si(i));
                }
                function li(e) {
                    return ei(e) ? e : e.contextElement;
                }
                function oi(e) {
                    const a = li(e);
                    if (!ai(a)) return Yt(1);
                    const t = a.getBoundingClientRect(),
                        { width: i, height: r, $: n } = (function (e) {
                            const a = ri(e);
                            let t = parseFloat(a.width) || 0,
                                i = parseFloat(a.height) || 0;
                            const r = ai(e),
                                n = r ? e.offsetWidth : t,
                                s = r ? e.offsetHeight : i,
                                l = Wt(t) !== n || Wt(i) !== s;
                            return l && ((t = n), (i = s)), { width: t, height: i, $: l };
                        })(a);
                    let s = (n ? Wt(t.width) : t.width) / i,
                        l = (n ? Wt(t.height) : t.height) / r;
                    return (s && Number.isFinite(s)) || (s = 1), (l && Number.isFinite(l)) || (l = 1), { x: s, y: l };
                }
                const ui = Yt(0);
                function ci(e) {
                    const a = Jt(e);
                    return "undefined" != typeof CSS && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none") && a.visualViewport ? { x: a.visualViewport.offsetLeft, y: a.visualViewport.offsetTop } : ui;
                }
                function gi(e, a, t, i) {
                    void 0 === a && (a = !1), void 0 === t && (t = !1);
                    const r = e.getBoundingClientRect(),
                        n = li(e);
                    let s = Yt(1);
                    a && (i ? ei(i) && (s = oi(i)) : (s = oi(e)));
                    const l = (function (e, a, t) {
                        return void 0 === a && (a = !1), !(!t || (a && t !== Jt(e))) && a;
                    })(n, t, i)
                        ? ci(n)
                        : Yt(0);
                    let o = (r.left + l.x) / s.x,
                        u = (r.top + l.y) / s.y,
                        c = r.width / s.x,
                        g = r.height / s.y;
                    if (n) {
                        const e = Jt(n),
                            a = i && ei(i) ? Jt(i) : i;
                        let t = e.frameElement;
                        for (; t && i && a !== e; ) {
                            const e = oi(t),
                                a = t.getBoundingClientRect(),
                                i = ri(t),
                                r = a.left + (t.clientLeft + parseFloat(i.paddingLeft)) * e.x,
                                n = a.top + (t.clientTop + parseFloat(i.paddingTop)) * e.y;
                            (o *= e.x), (u *= e.y), (c *= e.x), (g *= e.y), (o += r), (u += n), (t = Jt(t).frameElement);
                        }
                    }
                    return (d = { width: c, height: g, x: o, y: u }), { ...d, top: d.y, left: d.x, right: d.x + d.width, bottom: d.y + d.height };
                    var d;
                }
                const di = ua.useLayoutEffect;
                var yi = ["className", "clearValue", "cx", "getStyles", "getClassNames", "getValue", "hasValue", "isMulti", "isRtl", "options", "selectOption", "selectProps", "setValue", "theme"],
                    fi = function () {};
                function mi(e, a) {
                    return a ? ("-" === a[0] ? e + a : e + "__" + a) : e;
                }
                function bi(e, a) {
                    for (var t = arguments.length, i = new Array(t > 2 ? t - 2 : 0), r = 2; r < t; r++) i[r - 2] = arguments[r];
                    var n = [].concat(i);
                    if (a && e) for (var s in a) a.hasOwnProperty(s) && a[s] && n.push("".concat(mi(e, s)));
                    return n
                        .filter(function (e) {
                            return e;
                        })
                        .map(function (e) {
                            return String(e).trim();
                        })
                        .join(" ");
                }
                var vi = function (e) {
                        return (a = e), Array.isArray(a) ? e.filter(Boolean) : "object" === ea(e) && null !== e ? [e] : [];
                        var a;
                    },
                    pi = function (e) {
                        return e.className, e.clearValue, e.cx, e.getStyles, e.getClassNames, e.getValue, e.hasValue, e.isMulti, e.isRtl, e.options, e.selectOption, e.selectProps, e.setValue, e.theme, ra({}, oa(e, yi));
                    },
                    hi = function (e, a, t) {
                        var i = e.cx,
                            r = e.getStyles,
                            n = e.getClassNames,
                            s = e.className;
                        return { css: r(a, e), className: i(null != t ? t : {}, n(a, e), s) };
                    };
                function xi(e) {
                    return [document.documentElement, document.body, window].indexOf(e) > -1;
                }
                function Si(e) {
                    return xi(e) ? window.pageYOffset : e.scrollTop;
                }
                function ki(e, a) {
                    xi(e) ? window.scrollTo(0, a) : (e.scrollTop = a);
                }
                function wi(e, a) {
                    var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 200,
                        i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : fi,
                        r = Si(e),
                        n = a - r,
                        s = 0;
                    !(function a() {
                        var l,
                            o = n * ((l = (l = s += 10) / t - 1) * l * l + 1) + r;
                        ki(e, o), s < t ? window.requestAnimationFrame(a) : i(e);
                    })();
                }
                function Ci(e, a) {
                    var t = e.getBoundingClientRect(),
                        i = a.getBoundingClientRect(),
                        r = a.offsetHeight / 3;
                    i.bottom + r > t.bottom ? ki(e, Math.min(a.offsetTop + a.clientHeight - e.offsetHeight + r, e.scrollHeight)) : i.top - r < t.top && ki(e, Math.max(a.offsetTop - r, 0));
                }
                function Ni() {
                    try {
                        return document.createEvent("TouchEvent"), !0;
                    } catch (e) {
                        return !1;
                    }
                }
                var Mi = !1,
                    ji = {
                        get passive() {
                            return (Mi = !0);
                        },
                    },
                    $i = "undefined" != typeof window ? window : {};
                $i.addEventListener && $i.removeEventListener && ($i.addEventListener("p", fi, ji), $i.removeEventListener("p", fi, !1));
                var Oi = Mi;
                function Bi(e) {
                    return null != e;
                }
                function Ti(e, a, t) {
                    return e ? a : t;
                }
                var Li = ["children", "innerProps"],
                    Ri = ["children", "innerProps"];
                var Pi,
                    Ii,
                    Ai,
                    Di = function (e) {
                        return "auto" === e ? "bottom" : e;
                    },
                    _i = (0, ua.createContext)(null),
                    Ei = function (e) {
                        var a = e.children,
                            t = e.minMenuHeight,
                            i = e.maxMenuHeight,
                            r = e.menuPlacement,
                            n = e.menuPosition,
                            s = e.menuShouldScrollIntoView,
                            l = e.theme,
                            o = ((0, ua.useContext)(_i) || {}).setPortalPlacement,
                            u = (0, ua.useRef)(null),
                            c = la((0, ua.useState)(i), 2),
                            g = c[0],
                            d = c[1],
                            y = la((0, ua.useState)(null), 2),
                            f = y[0],
                            m = y[1],
                            b = l.spacing.controlHeight;
                        return (
                            di(
                                function () {
                                    var e = u.current;
                                    if (e) {
                                        var a = "fixed" === n,
                                            l = (function (e) {
                                                var a = e.maxHeight,
                                                    t = e.menuEl,
                                                    i = e.minHeight,
                                                    r = e.placement,
                                                    n = e.shouldScroll,
                                                    s = e.isFixedPosition,
                                                    l = e.controlHeight,
                                                    o = (function (e) {
                                                        var a = getComputedStyle(e),
                                                            t = "absolute" === a.position,
                                                            i = /(auto|scroll)/;
                                                        if ("fixed" === a.position) return document.documentElement;
                                                        for (var r = e; (r = r.parentElement); ) if (((a = getComputedStyle(r)), (!t || "static" !== a.position) && i.test(a.overflow + a.overflowY + a.overflowX))) return r;
                                                        return document.documentElement;
                                                    })(t),
                                                    u = { placement: "bottom", maxHeight: a };
                                                if (!t || !t.offsetParent) return u;
                                                var c,
                                                    g = o.getBoundingClientRect().height,
                                                    d = t.getBoundingClientRect(),
                                                    y = d.bottom,
                                                    f = d.height,
                                                    m = d.top,
                                                    b = t.offsetParent.getBoundingClientRect().top,
                                                    v = s || xi((c = o)) ? window.innerHeight : c.clientHeight,
                                                    p = Si(o),
                                                    h = parseInt(getComputedStyle(t).marginBottom, 10),
                                                    x = parseInt(getComputedStyle(t).marginTop, 10),
                                                    S = b - x,
                                                    k = v - m,
                                                    w = S + p,
                                                    C = g - p - m,
                                                    N = y - v + p + h,
                                                    M = p + m - x,
                                                    j = 160;
                                                switch (r) {
                                                    case "auto":
                                                    case "bottom":
                                                        if (k >= f) return { placement: "bottom", maxHeight: a };
                                                        if (C >= f && !s) return n && wi(o, N, j), { placement: "bottom", maxHeight: a };
                                                        if ((!s && C >= i) || (s && k >= i)) return n && wi(o, N, j), { placement: "bottom", maxHeight: s ? k - h : C - h };
                                                        if ("auto" === r || s) {
                                                            var $ = a,
                                                                O = s ? S : w;
                                                            return O >= i && ($ = Math.min(O - h - l, a)), { placement: "top", maxHeight: $ };
                                                        }
                                                        if ("bottom" === r) return n && ki(o, N), { placement: "bottom", maxHeight: a };
                                                        break;
                                                    case "top":
                                                        if (S >= f) return { placement: "top", maxHeight: a };
                                                        if (w >= f && !s) return n && wi(o, M, j), { placement: "top", maxHeight: a };
                                                        if ((!s && w >= i) || (s && S >= i)) {
                                                            var B = a;
                                                            return ((!s && w >= i) || (s && S >= i)) && (B = s ? S - x : w - x), n && wi(o, M, j), { placement: "top", maxHeight: B };
                                                        }
                                                        return { placement: "bottom", maxHeight: a };
                                                    default:
                                                        throw new Error('Invalid placement provided "'.concat(r, '".'));
                                                }
                                                return u;
                                            })({ maxHeight: i, menuEl: e, minHeight: t, placement: r, shouldScroll: s && !a, isFixedPosition: a, controlHeight: b });
                                        d(l.maxHeight), m(l.placement), null == o || o(l.placement);
                                    }
                                },
                                [i, r, n, s, t, o, b]
                            ),
                            a({ ref: u, placerProps: ra(ra({}, e), {}, { placement: f || Di(r), maxHeight: g }) })
                        );
                    },
                    Fi = function (e, a) {
                        var t = e.theme,
                            i = t.spacing.baseUnit,
                            r = t.colors;
                        return ra({ textAlign: "center" }, a ? {} : { color: r.neutral40, padding: "".concat(2 * i, "px ").concat(3 * i, "px") });
                    },
                    Vi = Fi,
                    Hi = Fi,
                    Gi = ["size"],
                    zi = ["innerProps", "isRtl", "size"],
                    Ui = { name: "8mmkcg", styles: "display:inline-block;fill:currentColor;line-height:1;stroke:currentColor;stroke-width:0" },
                    Ki = function (e) {
                        var a = e.size,
                            t = oa(e, Gi);
                        return Ht("svg", da({ height: a, width: a, viewBox: "0 0 20 20", "aria-hidden": "true", focusable: "false", css: Ui }, t));
                    },
                    Wi = function (e) {
                        return Ht(
                            Ki,
                            da({ size: 20 }, e),
                            Ht("path", {
                                d:
                                    "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z",
                            })
                        );
                    },
                    qi = function (e) {
                        return Ht(
                            Ki,
                            da({ size: 20 }, e),
                            Ht("path", {
                                d:
                                    "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z",
                            })
                        );
                    },
                    Yi = function (e, a) {
                        var t = e.isFocused,
                            i = e.theme,
                            r = i.spacing.baseUnit,
                            n = i.colors;
                        return ra({ label: "indicatorContainer", display: "flex", transition: "color 150ms" }, a ? {} : { color: t ? n.neutral60 : n.neutral20, padding: 2 * r, ":hover": { color: t ? n.neutral80 : n.neutral40 } });
                    },
                    Zi = Yi,
                    Ji = Yi,
                    Xi = (function () {
                        var e = Gt.apply(void 0, arguments),
                            a = "animation-" + e.name;
                        return {
                            name: a,
                            styles: "@keyframes " + a + "{" + e.styles + "}",
                            anim: 1,
                            toString: function () {
                                return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
                            },
                        };
                    })(Pi || ((Ii = ["\n  0%, 80%, 100% { opacity: 0; }\n  40% { opacity: 1; }\n"]), Ai || (Ai = Ii.slice(0)), (Pi = Object.freeze(Object.defineProperties(Ii, { raw: { value: Object.freeze(Ai) } }))))),
                    Qi = function (e) {
                        var a = e.delay,
                            t = e.offset;
                        return Ht("span", {
                            css: Gt(
                                {
                                    animation: "".concat(Xi, " 1s ease-in-out ").concat(a, "ms infinite;"),
                                    backgroundColor: "currentColor",
                                    borderRadius: "1em",
                                    display: "inline-block",
                                    marginLeft: t ? "1em" : void 0,
                                    height: "1em",
                                    verticalAlign: "top",
                                    width: "1em",
                                },
                                "",
                                ""
                            ),
                        });
                    },
                    er = ["data"],
                    ar = ["innerRef", "isDisabled", "isHidden", "inputClassName"],
                    tr = { gridArea: "1 / 2", font: "inherit", minWidth: "2px", border: 0, margin: 0, outline: 0, padding: 0 },
                    ir = { flex: "1 1 auto", display: "inline-grid", gridArea: "1 / 1 / 2 / 3", gridTemplateColumns: "0 min-content", "&:after": ra({ content: 'attr(data-value) " "', visibility: "hidden", whiteSpace: "pre" }, tr) },
                    rr = function (e) {
                        return ra({ label: "input", color: "inherit", background: 0, opacity: e ? 0 : 1, width: "100%" }, tr);
                    },
                    nr = function (e) {
                        var a = e.children,
                            t = e.innerProps;
                        return Ht("div", t, a);
                    },
                    sr = {
                        ClearIndicator: function (e) {
                            var a = e.children,
                                t = e.innerProps;
                            return Ht("div", da({}, hi(e, "clearIndicator", { indicator: !0, "clear-indicator": !0 }), t), a || Ht(Wi, null));
                        },
                        Control: function (e) {
                            var a = e.children,
                                t = e.isDisabled,
                                i = e.isFocused,
                                r = e.innerRef,
                                n = e.innerProps,
                                s = e.menuIsOpen;
                            return Ht("div", da({ ref: r }, hi(e, "control", { control: !0, "control--is-disabled": t, "control--is-focused": i, "control--menu-is-open": s }), n), a);
                        },
                        DropdownIndicator: function (e) {
                            var a = e.children,
                                t = e.innerProps;
                            return Ht("div", da({}, hi(e, "dropdownIndicator", { indicator: !0, "dropdown-indicator": !0 }), t), a || Ht(qi, null));
                        },
                        DownChevron: qi,
                        CrossIcon: Wi,
                        Group: function (e) {
                            var a = e.children,
                                t = e.cx,
                                i = e.getStyles,
                                r = e.getClassNames,
                                n = e.Heading,
                                s = e.headingProps,
                                l = e.innerProps,
                                o = e.label,
                                u = e.theme,
                                c = e.selectProps;
                            return Ht("div", da({}, hi(e, "group", { group: !0 }), l), Ht(n, da({}, s, { selectProps: c, theme: u, getStyles: i, getClassNames: r, cx: t }), o), Ht("div", null, a));
                        },
                        GroupHeading: function (e) {
                            var a = pi(e);
                            a.data;
                            var t = oa(a, er);
                            return Ht("div", da({}, hi(e, "groupHeading", { "group-heading": !0 }), t));
                        },
                        IndicatorsContainer: function (e) {
                            var a = e.children,
                                t = e.innerProps;
                            return Ht("div", da({}, hi(e, "indicatorsContainer", { indicators: !0 }), t), a);
                        },
                        IndicatorSeparator: function (e) {
                            var a = e.innerProps;
                            return Ht("span", da({}, a, hi(e, "indicatorSeparator", { "indicator-separator": !0 })));
                        },
                        Input: function (e) {
                            var a = e.cx,
                                t = e.value,
                                i = pi(e),
                                r = i.innerRef,
                                n = i.isDisabled,
                                s = i.isHidden,
                                l = i.inputClassName,
                                o = oa(i, ar);
                            return Ht("div", da({}, hi(e, "input", { "input-container": !0 }), { "data-value": t || "" }), Ht("input", da({ className: a({ input: !0 }, l), ref: r, style: rr(s), disabled: n }, o)));
                        },
                        LoadingIndicator: function (e) {
                            var a = e.innerProps,
                                t = e.isRtl,
                                i = e.size,
                                r = void 0 === i ? 4 : i,
                                n = oa(e, zi);
                            return Ht(
                                "div",
                                da({}, hi(ra(ra({}, n), {}, { innerProps: a, isRtl: t, size: r }), "loadingIndicator", { indicator: !0, "loading-indicator": !0 }), a),
                                Ht(Qi, { delay: 0, offset: t }),
                                Ht(Qi, { delay: 160, offset: !0 }),
                                Ht(Qi, { delay: 320, offset: !t })
                            );
                        },
                        Menu: function (e) {
                            var a = e.children,
                                t = e.innerRef,
                                i = e.innerProps;
                            return Ht("div", da({}, hi(e, "menu", { menu: !0 }), { ref: t }, i), a);
                        },
                        MenuList: function (e) {
                            var a = e.children,
                                t = e.innerProps,
                                i = e.innerRef,
                                r = e.isMulti;
                            return Ht("div", da({}, hi(e, "menuList", { "menu-list": !0, "menu-list--is-multi": r }), { ref: i }, t), a);
                        },
                        MenuPortal: function (e) {
                            var a = e.appendTo,
                                t = e.children,
                                i = e.controlElement,
                                r = e.innerProps,
                                n = e.menuPlacement,
                                s = e.menuPosition,
                                l = (0, ua.useRef)(null),
                                o = (0, ua.useRef)(null),
                                u = la((0, ua.useState)(Di(n)), 2),
                                c = u[0],
                                g = u[1],
                                d = (0, ua.useMemo)(function () {
                                    return { setPortalPlacement: g };
                                }, []),
                                y = la((0, ua.useState)(null), 2),
                                f = y[0],
                                m = y[1],
                                b = (0, ua.useCallback)(
                                    function () {
                                        if (i) {
                                            var e = (function (e) {
                                                    var a = e.getBoundingClientRect();
                                                    return { bottom: a.bottom, height: a.height, left: a.left, right: a.right, top: a.top, width: a.width };
                                                })(i),
                                                a = "fixed" === s ? 0 : window.pageYOffset,
                                                t = e[c] + a;
                                            (t === (null == f ? void 0 : f.offset) && e.left === (null == f ? void 0 : f.rect.left) && e.width === (null == f ? void 0 : f.rect.width)) || m({ offset: t, rect: e });
                                        }
                                    },
                                    [i, s, c, null == f ? void 0 : f.offset, null == f ? void 0 : f.rect.left, null == f ? void 0 : f.rect.width]
                                );
                            di(
                                function () {
                                    b();
                                },
                                [b]
                            );
                            var v = (0, ua.useCallback)(
                                function () {
                                    "function" == typeof o.current && (o.current(), (o.current = null)),
                                        i &&
                                            l.current &&
                                            (o.current = (function (e, a, t, i) {
                                                void 0 === i && (i = {});
                                                const {
                                                        ancestorScroll: r = !0,
                                                        ancestorResize: n = !0,
                                                        elementResize: s = "function" == typeof ResizeObserver,
                                                        layoutShift: l = "function" == typeof IntersectionObserver,
                                                        animationFrame: o = !1,
                                                    } = i,
                                                    u = li(e),
                                                    c = r || n ? [...(u ? si(u) : []), ...si(a)] : [];
                                                c.forEach((e) => {
                                                    r && e.addEventListener("scroll", t, { passive: !0 }), n && e.addEventListener("resize", t);
                                                });
                                                const g =
                                                    u && l
                                                        ? (function (e, a) {
                                                              let t,
                                                                  i = null;
                                                              const r = Xt(e);
                                                              function n() {
                                                                  clearTimeout(t), i && i.disconnect(), (i = null);
                                                              }
                                                              return (
                                                                  (function s(l, o) {
                                                                      void 0 === l && (l = !1), void 0 === o && (o = 1), n();
                                                                      const { left: u, top: c, width: g, height: d } = e.getBoundingClientRect();
                                                                      if ((l || a(), !g || !d)) return;
                                                                      const y = { rootMargin: -qt(c) + "px " + -qt(r.clientWidth - (u + g)) + "px " + -qt(r.clientHeight - (c + d)) + "px " + -qt(u) + "px", threshold: Kt(0, Ut(1, o)) || 1 };
                                                                      let f = !0;
                                                                      function m(e) {
                                                                          const a = e[0].intersectionRatio;
                                                                          if (a !== o) {
                                                                              if (!f) return s();
                                                                              a
                                                                                  ? s(!1, a)
                                                                                  : (t = setTimeout(() => {
                                                                                        s(!1, 1e-7);
                                                                                    }, 100));
                                                                          }
                                                                          f = !1;
                                                                      }
                                                                      try {
                                                                          i = new IntersectionObserver(m, { ...y, root: r.ownerDocument });
                                                                      } catch (e) {
                                                                          i = new IntersectionObserver(m, y);
                                                                      }
                                                                      i.observe(e);
                                                                  })(!0),
                                                                  n
                                                              );
                                                          })(u, t)
                                                        : null;
                                                let d,
                                                    y = -1,
                                                    f = null;
                                                s &&
                                                    ((f = new ResizeObserver((e) => {
                                                        let [i] = e;
                                                        i &&
                                                            i.target === u &&
                                                            f &&
                                                            (f.unobserve(a),
                                                            cancelAnimationFrame(y),
                                                            (y = requestAnimationFrame(() => {
                                                                f && f.observe(a);
                                                            }))),
                                                            t();
                                                    })),
                                                    u && !o && f.observe(u),
                                                    f.observe(a));
                                                let m = o ? gi(e) : null;
                                                return (
                                                    o &&
                                                        (function a() {
                                                            const i = gi(e);
                                                            !m || (i.x === m.x && i.y === m.y && i.width === m.width && i.height === m.height) || t(), (m = i), (d = requestAnimationFrame(a));
                                                        })(),
                                                    t(),
                                                    () => {
                                                        c.forEach((e) => {
                                                            r && e.removeEventListener("scroll", t), n && e.removeEventListener("resize", t);
                                                        }),
                                                            g && g(),
                                                            f && f.disconnect(),
                                                            (f = null),
                                                            o && cancelAnimationFrame(d);
                                                    }
                                                );
                                            })(i, l.current, b, { elementResize: "ResizeObserver" in window }));
                                },
                                [i, b]
                            );
                            di(
                                function () {
                                    v();
                                },
                                [v]
                            );
                            var p = (0, ua.useCallback)(
                                function (e) {
                                    (l.current = e), v();
                                },
                                [v]
                            );
                            if ((!a && "fixed" !== s) || !f) return null;
                            var h = Ht("div", da({ ref: p }, hi(ra(ra({}, e), {}, { offset: f.offset, position: s, rect: f.rect }), "menuPortal", { "menu-portal": !0 }), r), t);
                            return Ht(_i.Provider, { value: d }, a ? (0, zt.createPortal)(h, a) : h);
                        },
                        LoadingMessage: function (e) {
                            var a = e.children,
                                t = void 0 === a ? "Loading..." : a,
                                i = e.innerProps,
                                r = oa(e, Ri);
                            return Ht("div", da({}, hi(ra(ra({}, r), {}, { children: t, innerProps: i }), "loadingMessage", { "menu-notice": !0, "menu-notice--loading": !0 }), i), t);
                        },
                        NoOptionsMessage: function (e) {
                            var a = e.children,
                                t = void 0 === a ? "No options" : a,
                                i = e.innerProps,
                                r = oa(e, Li);
                            return Ht("div", da({}, hi(ra(ra({}, r), {}, { children: t, innerProps: i }), "noOptionsMessage", { "menu-notice": !0, "menu-notice--no-options": !0 }), i), t);
                        },
                        MultiValue: function (e) {
                            var a = e.children,
                                t = e.components,
                                i = e.data,
                                r = e.innerProps,
                                n = e.isDisabled,
                                s = e.removeProps,
                                l = e.selectProps,
                                o = t.Container,
                                u = t.Label,
                                c = t.Remove;
                            return Ht(
                                o,
                                { data: i, innerProps: ra(ra({}, hi(e, "multiValue", { "multi-value": !0, "multi-value--is-disabled": n })), r), selectProps: l },
                                Ht(u, { data: i, innerProps: ra({}, hi(e, "multiValueLabel", { "multi-value__label": !0 })), selectProps: l }, a),
                                Ht(c, { data: i, innerProps: ra(ra({}, hi(e, "multiValueRemove", { "multi-value__remove": !0 })), {}, { "aria-label": "Remove ".concat(a || "option") }, s), selectProps: l })
                            );
                        },
                        MultiValueContainer: nr,
                        MultiValueLabel: nr,
                        MultiValueRemove: function (e) {
                            var a = e.children,
                                t = e.innerProps;
                            return Ht("div", da({ role: "button" }, t), a || Ht(Wi, { size: 14 }));
                        },
                        Option: function (e) {
                            var a = e.children,
                                t = e.isDisabled,
                                i = e.isFocused,
                                r = e.isSelected,
                                n = e.innerRef,
                                s = e.innerProps;
                            return Ht("div", da({}, hi(e, "option", { option: !0, "option--is-disabled": t, "option--is-focused": i, "option--is-selected": r }), { ref: n, "aria-disabled": t }, s), a);
                        },
                        Placeholder: function (e) {
                            var a = e.children,
                                t = e.innerProps;
                            return Ht("div", da({}, hi(e, "placeholder", { placeholder: !0 }), t), a);
                        },
                        SelectContainer: function (e) {
                            var a = e.children,
                                t = e.innerProps,
                                i = e.isDisabled,
                                r = e.isRtl;
                            return Ht("div", da({}, hi(e, "container", { "--is-disabled": i, "--is-rtl": r }), t), a);
                        },
                        SingleValue: function (e) {
                            var a = e.children,
                                t = e.isDisabled,
                                i = e.innerProps;
                            return Ht("div", da({}, hi(e, "singleValue", { "single-value": !0, "single-value--is-disabled": t }), i), a);
                        },
                        ValueContainer: function (e) {
                            var a = e.children,
                                t = e.innerProps,
                                i = e.isMulti,
                                r = e.hasValue;
                            return Ht("div", da({}, hi(e, "valueContainer", { "value-container": !0, "value-container--is-multi": i, "value-container--has-value": r }), t), a);
                        },
                    },
                    lr =
                        Number.isNaN ||
                        function (e) {
                            return "number" == typeof e && e != e;
                        };
                function or(e, a) {
                    return e === a || !(!lr(e) || !lr(a));
                }
                function ur(e, a) {
                    if (e.length !== a.length) return !1;
                    for (var t = 0; t < e.length; t++) if (!or(e[t], a[t])) return !1;
                    return !0;
                }
                for (
                    var cr = { name: "7pg0cj-a11yText", styles: "label:a11yText;z-index:9999;border:0;clip:rect(1px, 1px, 1px, 1px);height:1px;width:1px;position:absolute;overflow:hidden;padding:0;white-space:nowrap" },
                        gr = function (e) {
                            return Ht("span", da({ css: cr }, e));
                        },
                        dr = {
                            guidance: function (e) {
                                var a = e.isSearchable,
                                    t = e.isMulti,
                                    i = e.isDisabled,
                                    r = e.tabSelectsValue;
                                switch (e.context) {
                                    case "menu":
                                        return "Use Up and Down to choose options"
                                            .concat(i ? "" : ", press Enter to select the currently focused option", ", press Escape to exit the menu")
                                            .concat(r ? ", press Tab to select the option and exit the menu" : "", ".");
                                    case "input":
                                        return ""
                                            .concat(e["aria-label"] || "Select", " is focused ")
                                            .concat(a ? ",type to refine list" : "", ", press Down to open the menu, ")
                                            .concat(t ? " press left to focus selected values" : "");
                                    case "value":
                                        return "Use left and right to toggle between focused values, press Backspace to remove the currently focused value";
                                    default:
                                        return "";
                                }
                            },
                            onChange: function (e) {
                                var a = e.action,
                                    t = e.label,
                                    i = void 0 === t ? "" : t,
                                    r = e.labels,
                                    n = e.isDisabled;
                                switch (a) {
                                    case "deselect-option":
                                    case "pop-value":
                                    case "remove-value":
                                        return "option ".concat(i, ", deselected.");
                                    case "clear":
                                        return "All selected options have been cleared.";
                                    case "initial-input-focus":
                                        return "option".concat(r.length > 1 ? "s" : "", " ").concat(r.join(","), ", selected.");
                                    case "select-option":
                                        return "option ".concat(i, n ? " is disabled. Select another option." : ", selected.");
                                    default:
                                        return "";
                                }
                            },
                            onFocus: function (e) {
                                var a = e.context,
                                    t = e.focused,
                                    i = e.options,
                                    r = e.label,
                                    n = void 0 === r ? "" : r,
                                    s = e.selectValue,
                                    l = e.isDisabled,
                                    o = e.isSelected,
                                    u = function (e, a) {
                                        return e && e.length ? "".concat(e.indexOf(a) + 1, " of ").concat(e.length) : "";
                                    };
                                if ("value" === a && s) return "value ".concat(n, " focused, ").concat(u(s, t), ".");
                                if ("menu" === a) {
                                    var c = l ? " disabled" : "",
                                        g = "".concat(o ? "selected" : "focused").concat(c);
                                    return "option ".concat(n, " ").concat(g, ", ").concat(u(i, t), ".");
                                }
                                return "";
                            },
                            onFilter: function (e) {
                                var a = e.inputValue,
                                    t = e.resultsMessage;
                                return "".concat(t).concat(a ? " for search term " + a : "", ".");
                            },
                        },
                        yr = function (e) {
                            var a = e.ariaSelection,
                                t = e.focusedOption,
                                i = e.focusedValue,
                                r = e.focusableOptions,
                                n = e.isFocused,
                                s = e.selectValue,
                                l = e.selectProps,
                                o = e.id,
                                u = l.ariaLiveMessages,
                                c = l.getOptionLabel,
                                g = l.inputValue,
                                d = l.isMulti,
                                y = l.isOptionDisabled,
                                f = l.isSearchable,
                                m = l.menuIsOpen,
                                b = l.options,
                                v = l.screenReaderStatus,
                                p = l.tabSelectsValue,
                                h = l["aria-label"],
                                x = l["aria-live"],
                                S = (0, ua.useMemo)(
                                    function () {
                                        return ra(ra({}, dr), u || {});
                                    },
                                    [u]
                                ),
                                k = (0, ua.useMemo)(
                                    function () {
                                        var e,
                                            t = "";
                                        if (a && S.onChange) {
                                            var i = a.option,
                                                r = a.options,
                                                n = a.removedValue,
                                                l = a.removedValues,
                                                o = a.value,
                                                u = n || i || ((e = o), Array.isArray(e) ? null : e),
                                                g = u ? c(u) : "",
                                                d = r || l || void 0,
                                                f = d ? d.map(c) : [],
                                                m = ra({ isDisabled: u && y(u, s), label: g, labels: f }, a);
                                            t = S.onChange(m);
                                        }
                                        return t;
                                    },
                                    [a, S, y, s, c]
                                ),
                                w = (0, ua.useMemo)(
                                    function () {
                                        var e = "",
                                            a = t || i,
                                            n = !!(t && s && s.includes(t));
                                        if (a && S.onFocus) {
                                            var l = { focused: a, label: c(a), isDisabled: y(a, s), isSelected: n, options: r, context: a === t ? "menu" : "value", selectValue: s };
                                            e = S.onFocus(l);
                                        }
                                        return e;
                                    },
                                    [t, i, c, y, S, r, s]
                                ),
                                C = (0, ua.useMemo)(
                                    function () {
                                        var e = "";
                                        if (m && b.length && S.onFilter) {
                                            var a = v({ count: r.length });
                                            e = S.onFilter({ inputValue: g, resultsMessage: a });
                                        }
                                        return e;
                                    },
                                    [r, g, m, S, b, v]
                                ),
                                N = (0, ua.useMemo)(
                                    function () {
                                        var e = "";
                                        if (S.guidance) {
                                            var a = i ? "value" : m ? "menu" : "input";
                                            e = S.guidance({ "aria-label": h, context: a, isDisabled: t && y(t, s), isMulti: d, isSearchable: f, tabSelectsValue: p });
                                        }
                                        return e;
                                    },
                                    [h, t, i, d, y, f, m, S, s, p]
                                ),
                                M = "".concat(w, " ").concat(C, " ").concat(N),
                                j = Ht(ua.Fragment, null, Ht("span", { id: "aria-selection" }, k), Ht("span", { id: "aria-context" }, M)),
                                $ = "initial-input-focus" === (null == a ? void 0 : a.action);
                            return Ht(ua.Fragment, null, Ht(gr, { id: o }, $ && j), Ht(gr, { "aria-live": x, "aria-atomic": "false", "aria-relevant": "additions text" }, n && !$ && j));
                        },
                        fr = [
                            { base: "A", letters: "AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ" },
                            { base: "AA", letters: "Ꜳ" },
                            { base: "AE", letters: "ÆǼǢ" },
                            { base: "AO", letters: "Ꜵ" },
                            { base: "AU", letters: "Ꜷ" },
                            { base: "AV", letters: "ꜸꜺ" },
                            { base: "AY", letters: "Ꜽ" },
                            { base: "B", letters: "BⒷＢḂḄḆɃƂƁ" },
                            { base: "C", letters: "CⒸＣĆĈĊČÇḈƇȻꜾ" },
                            { base: "D", letters: "DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ" },
                            { base: "DZ", letters: "ǱǄ" },
                            { base: "Dz", letters: "ǲǅ" },
                            { base: "E", letters: "EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ" },
                            { base: "F", letters: "FⒻＦḞƑꝻ" },
                            { base: "G", letters: "GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ" },
                            { base: "H", letters: "HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ" },
                            { base: "I", letters: "IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ" },
                            { base: "J", letters: "JⒿＪĴɈ" },
                            { base: "K", letters: "KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ" },
                            { base: "L", letters: "LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ" },
                            { base: "LJ", letters: "Ǉ" },
                            { base: "Lj", letters: "ǈ" },
                            { base: "M", letters: "MⓂＭḾṀṂⱮƜ" },
                            { base: "N", letters: "NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ" },
                            { base: "NJ", letters: "Ǌ" },
                            { base: "Nj", letters: "ǋ" },
                            { base: "O", letters: "OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ" },
                            { base: "OI", letters: "Ƣ" },
                            { base: "OO", letters: "Ꝏ" },
                            { base: "OU", letters: "Ȣ" },
                            { base: "P", letters: "PⓅＰṔṖƤⱣꝐꝒꝔ" },
                            { base: "Q", letters: "QⓆＱꝖꝘɊ" },
                            { base: "R", letters: "RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ" },
                            { base: "S", letters: "SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ" },
                            { base: "T", letters: "TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ" },
                            { base: "TZ", letters: "Ꜩ" },
                            { base: "U", letters: "UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ" },
                            { base: "V", letters: "VⓋＶṼṾƲꝞɅ" },
                            { base: "VY", letters: "Ꝡ" },
                            { base: "W", letters: "WⓌＷẀẂŴẆẄẈⱲ" },
                            { base: "X", letters: "XⓍＸẊẌ" },
                            { base: "Y", letters: "YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ" },
                            { base: "Z", letters: "ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ" },
                            { base: "a", letters: "aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ" },
                            { base: "aa", letters: "ꜳ" },
                            { base: "ae", letters: "æǽǣ" },
                            { base: "ao", letters: "ꜵ" },
                            { base: "au", letters: "ꜷ" },
                            { base: "av", letters: "ꜹꜻ" },
                            { base: "ay", letters: "ꜽ" },
                            { base: "b", letters: "bⓑｂḃḅḇƀƃɓ" },
                            { base: "c", letters: "cⓒｃćĉċčçḉƈȼꜿↄ" },
                            { base: "d", letters: "dⓓｄḋďḍḑḓḏđƌɖɗꝺ" },
                            { base: "dz", letters: "ǳǆ" },
                            { base: "e", letters: "eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ" },
                            { base: "f", letters: "fⓕｆḟƒꝼ" },
                            { base: "g", letters: "gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ" },
                            { base: "h", letters: "hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ" },
                            { base: "hv", letters: "ƕ" },
                            { base: "i", letters: "iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı" },
                            { base: "j", letters: "jⓙｊĵǰɉ" },
                            { base: "k", letters: "kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ" },
                            { base: "l", letters: "lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ" },
                            { base: "lj", letters: "ǉ" },
                            { base: "m", letters: "mⓜｍḿṁṃɱɯ" },
                            { base: "n", letters: "nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ" },
                            { base: "nj", letters: "ǌ" },
                            { base: "o", letters: "oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ" },
                            { base: "oi", letters: "ƣ" },
                            { base: "ou", letters: "ȣ" },
                            { base: "oo", letters: "ꝏ" },
                            { base: "p", letters: "pⓟｐṕṗƥᵽꝑꝓꝕ" },
                            { base: "q", letters: "qⓠｑɋꝗꝙ" },
                            { base: "r", letters: "rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ" },
                            { base: "s", letters: "sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ" },
                            { base: "t", letters: "tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ" },
                            { base: "tz", letters: "ꜩ" },
                            { base: "u", letters: "uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ" },
                            { base: "v", letters: "vⓥｖṽṿʋꝟʌ" },
                            { base: "vy", letters: "ꝡ" },
                            { base: "w", letters: "wⓦｗẁẃŵẇẅẘẉⱳ" },
                            { base: "x", letters: "xⓧｘẋẍ" },
                            { base: "y", letters: "yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ" },
                            { base: "z", letters: "zⓩｚźẑżžẓẕƶȥɀⱬꝣ" },
                        ],
                        mr = new RegExp(
                            "[" +
                                fr
                                    .map(function (e) {
                                        return e.letters;
                                    })
                                    .join("") +
                                "]",
                            "g"
                        ),
                        br = {},
                        vr = 0;
                    vr < fr.length;
                    vr++
                )
                    for (var pr = fr[vr], hr = 0; hr < pr.letters.length; hr++) br[pr.letters[hr]] = pr.base;
                var xr = function (e) {
                        return e.replace(mr, function (e) {
                            return br[e];
                        });
                    },
                    Sr = (function (e, a) {
                        void 0 === a && (a = ur);
                        var t = null;
                        function i() {
                            for (var i = [], r = 0; r < arguments.length; r++) i[r] = arguments[r];
                            if (t && t.lastThis === this && a(i, t.lastArgs)) return t.lastResult;
                            var n = e.apply(this, i);
                            return (t = { lastResult: n, lastArgs: i, lastThis: this }), n;
                        }
                        return (
                            (i.clear = function () {
                                t = null;
                            }),
                            i
                        );
                    })(xr),
                    kr = function (e) {
                        return e.replace(/^\s+|\s+$/g, "");
                    },
                    wr = function (e) {
                        return "".concat(e.label, " ").concat(e.value);
                    },
                    Cr = ["innerRef"];
                function Nr(e) {
                    var a = e.innerRef,
                        t = (function (e) {
                            for (var a = arguments.length, t = new Array(a > 1 ? a - 1 : 0), i = 1; i < a; i++) t[i - 1] = arguments[i];
                            var r = Object.entries(e).filter(function (e) {
                                var a = la(e, 1)[0];
                                return !t.includes(a);
                            });
                            return r.reduce(function (e, a) {
                                var t = la(a, 2),
                                    i = t[0],
                                    r = t[1];
                                return (e[i] = r), e;
                            }, {});
                        })(oa(e, Cr), "onExited", "in", "enter", "exit", "appear");
                    return Ht(
                        "input",
                        da({ ref: a }, t, {
                            css: Gt(
                                {
                                    label: "dummyInput",
                                    background: 0,
                                    border: 0,
                                    caretColor: "transparent",
                                    fontSize: "inherit",
                                    gridArea: "1 / 1 / 2 / 3",
                                    outline: 0,
                                    padding: 0,
                                    width: 1,
                                    color: "transparent",
                                    left: -100,
                                    opacity: 0,
                                    position: "relative",
                                    transform: "scale(.01)",
                                },
                                "",
                                ""
                            ),
                        })
                    );
                }
                var Mr = ["boxSizing", "height", "overflow", "paddingRight", "position"],
                    jr = { boxSizing: "border-box", overflow: "hidden", position: "relative", height: "100%" };
                function $r(e) {
                    e.preventDefault();
                }
                function Or(e) {
                    e.stopPropagation();
                }
                function Br() {
                    var e = this.scrollTop,
                        a = this.scrollHeight,
                        t = e + this.offsetHeight;
                    0 === e ? (this.scrollTop = 1) : t === a && (this.scrollTop = e - 1);
                }
                function Tr() {
                    return "ontouchstart" in window || navigator.maxTouchPoints;
                }
                var Lr = !("undefined" == typeof window || !window.document || !window.document.createElement),
                    Rr = 0,
                    Pr = { capture: !1, passive: !1 },
                    Ir = function () {
                        return document.activeElement && document.activeElement.blur();
                    },
                    Ar = { name: "1kfdb0e", styles: "position:fixed;left:0;bottom:0;right:0;top:0" };
                function Dr(e) {
                    var a = e.children,
                        t = e.lockEnabled,
                        i = e.captureEnabled,
                        r = (function (e) {
                            var a = e.isEnabled,
                                t = e.onBottomArrive,
                                i = e.onBottomLeave,
                                r = e.onTopArrive,
                                n = e.onTopLeave,
                                s = (0, ua.useRef)(!1),
                                l = (0, ua.useRef)(!1),
                                o = (0, ua.useRef)(0),
                                u = (0, ua.useRef)(null),
                                c = (0, ua.useCallback)(
                                    function (e, a) {
                                        if (null !== u.current) {
                                            var o = u.current,
                                                c = o.scrollTop,
                                                g = o.scrollHeight,
                                                d = o.clientHeight,
                                                y = u.current,
                                                f = a > 0,
                                                m = g - d - c,
                                                b = !1;
                                            m > a && s.current && (i && i(e), (s.current = !1)),
                                                f && l.current && (n && n(e), (l.current = !1)),
                                                f && a > m ? (t && !s.current && t(e), (y.scrollTop = g), (b = !0), (s.current = !0)) : !f && -a > c && (r && !l.current && r(e), (y.scrollTop = 0), (b = !0), (l.current = !0)),
                                                b &&
                                                    (function (e) {
                                                        e.preventDefault(), e.stopPropagation();
                                                    })(e);
                                        }
                                    },
                                    [t, i, r, n]
                                ),
                                g = (0, ua.useCallback)(
                                    function (e) {
                                        c(e, e.deltaY);
                                    },
                                    [c]
                                ),
                                d = (0, ua.useCallback)(function (e) {
                                    o.current = e.changedTouches[0].clientY;
                                }, []),
                                y = (0, ua.useCallback)(
                                    function (e) {
                                        var a = o.current - e.changedTouches[0].clientY;
                                        c(e, a);
                                    },
                                    [c]
                                ),
                                f = (0, ua.useCallback)(
                                    function (e) {
                                        if (e) {
                                            var a = !!Oi && { passive: !1 };
                                            e.addEventListener("wheel", g, a), e.addEventListener("touchstart", d, a), e.addEventListener("touchmove", y, a);
                                        }
                                    },
                                    [y, d, g]
                                ),
                                m = (0, ua.useCallback)(
                                    function (e) {
                                        e && (e.removeEventListener("wheel", g, !1), e.removeEventListener("touchstart", d, !1), e.removeEventListener("touchmove", y, !1));
                                    },
                                    [y, d, g]
                                );
                            return (
                                (0, ua.useEffect)(
                                    function () {
                                        if (a) {
                                            var e = u.current;
                                            return (
                                                f(e),
                                                function () {
                                                    m(e);
                                                }
                                            );
                                        }
                                    },
                                    [a, f, m]
                                ),
                                function (e) {
                                    u.current = e;
                                }
                            );
                        })({ isEnabled: void 0 === i || i, onBottomArrive: e.onBottomArrive, onBottomLeave: e.onBottomLeave, onTopArrive: e.onTopArrive, onTopLeave: e.onTopLeave }),
                        n = (function (e) {
                            var a = e.isEnabled,
                                t = e.accountForScrollbars,
                                i = void 0 === t || t,
                                r = (0, ua.useRef)({}),
                                n = (0, ua.useRef)(null),
                                s = (0, ua.useCallback)(
                                    function (e) {
                                        if (Lr) {
                                            var a = document.body,
                                                t = a && a.style;
                                            if (
                                                (i &&
                                                    Mr.forEach(function (e) {
                                                        var a = t && t[e];
                                                        r.current[e] = a;
                                                    }),
                                                i && Rr < 1)
                                            ) {
                                                var n = parseInt(r.current.paddingRight, 10) || 0,
                                                    s = document.body ? document.body.clientWidth : 0,
                                                    l = window.innerWidth - s + n || 0;
                                                Object.keys(jr).forEach(function (e) {
                                                    var a = jr[e];
                                                    t && (t[e] = a);
                                                }),
                                                    t && (t.paddingRight = "".concat(l, "px"));
                                            }
                                            a && Tr() && (a.addEventListener("touchmove", $r, Pr), e && (e.addEventListener("touchstart", Br, Pr), e.addEventListener("touchmove", Or, Pr))), (Rr += 1);
                                        }
                                    },
                                    [i]
                                ),
                                l = (0, ua.useCallback)(
                                    function (e) {
                                        if (Lr) {
                                            var a = document.body,
                                                t = a && a.style;
                                            (Rr = Math.max(Rr - 1, 0)),
                                                i &&
                                                    Rr < 1 &&
                                                    Mr.forEach(function (e) {
                                                        var a = r.current[e];
                                                        t && (t[e] = a);
                                                    }),
                                                a && Tr() && (a.removeEventListener("touchmove", $r, Pr), e && (e.removeEventListener("touchstart", Br, Pr), e.removeEventListener("touchmove", Or, Pr)));
                                        }
                                    },
                                    [i]
                                );
                            return (
                                (0, ua.useEffect)(
                                    function () {
                                        if (a) {
                                            var e = n.current;
                                            return (
                                                s(e),
                                                function () {
                                                    l(e);
                                                }
                                            );
                                        }
                                    },
                                    [a, s, l]
                                ),
                                function (e) {
                                    n.current = e;
                                }
                            );
                        })({ isEnabled: t });
                    return Ht(
                        ua.Fragment,
                        null,
                        t && Ht("div", { onClick: Ir, css: Ar }),
                        a(function (e) {
                            r(e), n(e);
                        })
                    );
                }
                var _r = { name: "1a0ro4n-requiredInput", styles: "label:requiredInput;opacity:0;pointer-events:none;position:absolute;bottom:0;left:0;right:0;width:100%" },
                    Er = function (e) {
                        var a = e.name,
                            t = e.onFocus;
                        return Ht("input", { required: !0, name: a, tabIndex: -1, "aria-hidden": "true", onFocus: t, css: _r, value: "", onChange: function () {} });
                    },
                    Fr = {
                        clearIndicator: Ji,
                        container: function (e) {
                            var a = e.isDisabled;
                            return { label: "container", direction: e.isRtl ? "rtl" : void 0, pointerEvents: a ? "none" : void 0, position: "relative" };
                        },
                        control: function (e, a) {
                            var t = e.isDisabled,
                                i = e.isFocused,
                                r = e.theme,
                                n = r.colors,
                                s = r.borderRadius;
                            return ra(
                                {
                                    label: "control",
                                    alignItems: "center",
                                    cursor: "default",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    minHeight: r.spacing.controlHeight,
                                    outline: "0 !important",
                                    position: "relative",
                                    transition: "all 100ms",
                                },
                                a
                                    ? {}
                                    : {
                                          backgroundColor: t ? n.neutral5 : n.neutral0,
                                          borderColor: t ? n.neutral10 : i ? n.primary : n.neutral20,
                                          borderRadius: s,
                                          borderStyle: "solid",
                                          borderWidth: 1,
                                          boxShadow: i ? "0 0 0 1px ".concat(n.primary) : void 0,
                                          "&:hover": { borderColor: i ? n.primary : n.neutral30 },
                                      }
                            );
                        },
                        dropdownIndicator: Zi,
                        group: function (e, a) {
                            var t = e.theme.spacing;
                            return a ? {} : { paddingBottom: 2 * t.baseUnit, paddingTop: 2 * t.baseUnit };
                        },
                        groupHeading: function (e, a) {
                            var t = e.theme,
                                i = t.colors,
                                r = t.spacing;
                            return ra(
                                { label: "group", cursor: "default", display: "block" },
                                a ? {} : { color: i.neutral40, fontSize: "75%", fontWeight: 500, marginBottom: "0.25em", paddingLeft: 3 * r.baseUnit, paddingRight: 3 * r.baseUnit, textTransform: "uppercase" }
                            );
                        },
                        indicatorsContainer: function () {
                            return { alignItems: "center", alignSelf: "stretch", display: "flex", flexShrink: 0 };
                        },
                        indicatorSeparator: function (e, a) {
                            var t = e.isDisabled,
                                i = e.theme,
                                r = i.spacing.baseUnit,
                                n = i.colors;
                            return ra({ label: "indicatorSeparator", alignSelf: "stretch", width: 1 }, a ? {} : { backgroundColor: t ? n.neutral10 : n.neutral20, marginBottom: 2 * r, marginTop: 2 * r });
                        },
                        input: function (e, a) {
                            var t = e.isDisabled,
                                i = e.value,
                                r = e.theme,
                                n = r.spacing,
                                s = r.colors;
                            return ra(
                                ra({ visibility: t ? "hidden" : "visible", transform: i ? "translateZ(0)" : "" }, ir),
                                a ? {} : { margin: n.baseUnit / 2, paddingBottom: n.baseUnit / 2, paddingTop: n.baseUnit / 2, color: s.neutral80 }
                            );
                        },
                        loadingIndicator: function (e, a) {
                            var t = e.isFocused,
                                i = e.size,
                                r = e.theme,
                                n = r.colors,
                                s = r.spacing.baseUnit;
                            return ra(
                                { label: "loadingIndicator", display: "flex", transition: "color 150ms", alignSelf: "center", fontSize: i, lineHeight: 1, marginRight: i, textAlign: "center", verticalAlign: "middle" },
                                a ? {} : { color: t ? n.neutral60 : n.neutral20, padding: 2 * s }
                            );
                        },
                        loadingMessage: Hi,
                        menu: function (e, a) {
                            var t,
                                i = e.placement,
                                r = e.theme,
                                n = r.borderRadius,
                                s = r.spacing,
                                l = r.colors;
                            return ra(
                                (ta(
                                    (t = { label: "menu" }),
                                    (function (e) {
                                        return e ? { bottom: "top", top: "bottom" }[e] : "bottom";
                                    })(i),
                                    "100%"
                                ),
                                ta(t, "position", "absolute"),
                                ta(t, "width", "100%"),
                                ta(t, "zIndex", 1),
                                t),
                                a ? {} : { backgroundColor: l.neutral0, borderRadius: n, boxShadow: "0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)", marginBottom: s.menuGutter, marginTop: s.menuGutter }
                            );
                        },
                        menuList: function (e, a) {
                            var t = e.maxHeight,
                                i = e.theme.spacing.baseUnit;
                            return ra({ maxHeight: t, overflowY: "auto", position: "relative", WebkitOverflowScrolling: "touch" }, a ? {} : { paddingBottom: i, paddingTop: i });
                        },
                        menuPortal: function (e) {
                            var a = e.rect,
                                t = e.offset,
                                i = e.position;
                            return { left: a.left, position: i, top: t, width: a.width, zIndex: 1 };
                        },
                        multiValue: function (e, a) {
                            var t = e.theme,
                                i = t.spacing,
                                r = t.borderRadius,
                                n = t.colors;
                            return ra({ label: "multiValue", display: "flex", minWidth: 0 }, a ? {} : { backgroundColor: n.neutral10, borderRadius: r / 2, margin: i.baseUnit / 2 });
                        },
                        multiValueLabel: function (e, a) {
                            var t = e.theme,
                                i = t.borderRadius,
                                r = t.colors,
                                n = e.cropWithEllipsis;
                            return ra({ overflow: "hidden", textOverflow: n || void 0 === n ? "ellipsis" : void 0, whiteSpace: "nowrap" }, a ? {} : { borderRadius: i / 2, color: r.neutral80, fontSize: "85%", padding: 3, paddingLeft: 6 });
                        },
                        multiValueRemove: function (e, a) {
                            var t = e.theme,
                                i = t.spacing,
                                r = t.borderRadius,
                                n = t.colors,
                                s = e.isFocused;
                            return ra(
                                { alignItems: "center", display: "flex" },
                                a ? {} : { borderRadius: r / 2, backgroundColor: s ? n.dangerLight : void 0, paddingLeft: i.baseUnit, paddingRight: i.baseUnit, ":hover": { backgroundColor: n.dangerLight, color: n.danger } }
                            );
                        },
                        noOptionsMessage: Vi,
                        option: function (e, a) {
                            var t = e.isDisabled,
                                i = e.isFocused,
                                r = e.isSelected,
                                n = e.theme,
                                s = n.spacing,
                                l = n.colors;
                            return ra(
                                { label: "option", cursor: "default", display: "block", fontSize: "inherit", width: "100%", userSelect: "none", WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" },
                                a
                                    ? {}
                                    : {
                                          backgroundColor: r ? l.primary : i ? l.primary25 : "transparent",
                                          color: t ? l.neutral20 : r ? l.neutral0 : "inherit",
                                          padding: "".concat(2 * s.baseUnit, "px ").concat(3 * s.baseUnit, "px"),
                                          ":active": { backgroundColor: t ? void 0 : r ? l.primary : l.primary50 },
                                      }
                            );
                        },
                        placeholder: function (e, a) {
                            var t = e.theme,
                                i = t.spacing,
                                r = t.colors;
                            return ra({ label: "placeholder", gridArea: "1 / 1 / 2 / 3" }, a ? {} : { color: r.neutral50, marginLeft: i.baseUnit / 2, marginRight: i.baseUnit / 2 });
                        },
                        singleValue: function (e, a) {
                            var t = e.isDisabled,
                                i = e.theme,
                                r = i.spacing,
                                n = i.colors;
                            return ra(
                                { label: "singleValue", gridArea: "1 / 1 / 2 / 3", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
                                a ? {} : { color: t ? n.neutral40 : n.neutral80, marginLeft: r.baseUnit / 2, marginRight: r.baseUnit / 2 }
                            );
                        },
                        valueContainer: function (e, a) {
                            var t = e.theme.spacing,
                                i = e.isMulti,
                                r = e.hasValue,
                                n = e.selectProps.controlShouldRenderValue;
                            return ra(
                                { alignItems: "center", display: i && r && n ? "flex" : "grid", flex: 1, flexWrap: "wrap", WebkitOverflowScrolling: "touch", position: "relative", overflow: "hidden" },
                                a ? {} : { padding: "".concat(t.baseUnit / 2, "px ").concat(2 * t.baseUnit, "px") }
                            );
                        },
                    },
                    Vr = {
                        borderRadius: 4,
                        colors: {
                            primary: "#2684FF",
                            primary75: "#4C9AFF",
                            primary50: "#B2D4FF",
                            primary25: "#DEEBFF",
                            danger: "#DE350B",
                            dangerLight: "#FFBDAD",
                            neutral0: "hsl(0, 0%, 100%)",
                            neutral5: "hsl(0, 0%, 95%)",
                            neutral10: "hsl(0, 0%, 90%)",
                            neutral20: "hsl(0, 0%, 80%)",
                            neutral30: "hsl(0, 0%, 70%)",
                            neutral40: "hsl(0, 0%, 60%)",
                            neutral50: "hsl(0, 0%, 50%)",
                            neutral60: "hsl(0, 0%, 40%)",
                            neutral70: "hsl(0, 0%, 30%)",
                            neutral80: "hsl(0, 0%, 20%)",
                            neutral90: "hsl(0, 0%, 10%)",
                        },
                        spacing: { baseUnit: 4, controlHeight: 38, menuGutter: 8 },
                    },
                    Hr = {
                        "aria-live": "polite",
                        backspaceRemovesValue: !0,
                        blurInputOnSelect: Ni(),
                        captureMenuScroll: !Ni(),
                        classNames: {},
                        closeMenuOnSelect: !0,
                        closeMenuOnScroll: !1,
                        components: {},
                        controlShouldRenderValue: !0,
                        escapeClearsValue: !1,
                        filterOption: function (e, a) {
                            if (e.data.__isNew__) return !0;
                            var t = ra({ ignoreCase: !0, ignoreAccents: !0, stringify: wr, trim: !0, matchFrom: "any" }, undefined),
                                i = t.ignoreCase,
                                r = t.ignoreAccents,
                                n = t.stringify,
                                s = t.trim,
                                l = t.matchFrom,
                                o = s ? kr(a) : a,
                                u = s ? kr(n(e)) : n(e);
                            return i && ((o = o.toLowerCase()), (u = u.toLowerCase())), r && ((o = Sr(o)), (u = xr(u))), "start" === l ? u.substr(0, o.length) === o : u.indexOf(o) > -1;
                        },
                        formatGroupLabel: function (e) {
                            return e.label;
                        },
                        getOptionLabel: function (e) {
                            return e.label;
                        },
                        getOptionValue: function (e) {
                            return e.value;
                        },
                        isDisabled: !1,
                        isLoading: !1,
                        isMulti: !1,
                        isRtl: !1,
                        isSearchable: !0,
                        isOptionDisabled: function (e) {
                            return !!e.isDisabled;
                        },
                        loadingMessage: function () {
                            return "Loading...";
                        },
                        maxMenuHeight: 300,
                        minMenuHeight: 140,
                        menuIsOpen: !1,
                        menuPlacement: "bottom",
                        menuPosition: "absolute",
                        menuShouldBlockScroll: !1,
                        menuShouldScrollIntoView: !(function () {
                            try {
                                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                            } catch (e) {
                                return !1;
                            }
                        })(),
                        noOptionsMessage: function () {
                            return "No options";
                        },
                        openMenuOnFocus: !1,
                        openMenuOnClick: !0,
                        options: [],
                        pageSize: 5,
                        placeholder: "Select...",
                        screenReaderStatus: function (e) {
                            var a = e.count;
                            return "".concat(a, " result").concat(1 !== a ? "s" : "", " available");
                        },
                        styles: {},
                        tabIndex: 0,
                        tabSelectsValue: !0,
                        unstyled: !1,
                    };
                function Gr(e, a, t, i) {
                    return { type: "option", data: a, isDisabled: Yr(e, a, t), isSelected: Zr(e, a, t), label: Wr(e, a), value: qr(e, a), index: i };
                }
                function zr(e, a) {
                    return e.options
                        .map(function (t, i) {
                            if ("options" in t) {
                                var r = t.options
                                    .map(function (t, i) {
                                        return Gr(e, t, a, i);
                                    })
                                    .filter(function (a) {
                                        return Kr(e, a);
                                    });
                                return r.length > 0 ? { type: "group", data: t, options: r, index: i } : void 0;
                            }
                            var n = Gr(e, t, a, i);
                            return Kr(e, n) ? n : void 0;
                        })
                        .filter(Bi);
                }
                function Ur(e) {
                    return e.reduce(function (e, a) {
                        return (
                            "group" === a.type
                                ? e.push.apply(
                                      e,
                                      va(
                                          a.options.map(function (e) {
                                              return e.data;
                                          })
                                      )
                                  )
                                : e.push(a.data),
                            e
                        );
                    }, []);
                }
                function Kr(e, a) {
                    var t = e.inputValue,
                        i = void 0 === t ? "" : t,
                        r = a.data,
                        n = a.isSelected,
                        s = a.label,
                        l = a.value;
                    return (!Xr(e) || !n) && Jr(e, { label: s, value: l, data: r }, i);
                }
                var Wr = function (e, a) {
                        return e.getOptionLabel(a);
                    },
                    qr = function (e, a) {
                        return e.getOptionValue(a);
                    };
                function Yr(e, a, t) {
                    return "function" == typeof e.isOptionDisabled && e.isOptionDisabled(a, t);
                }
                function Zr(e, a, t) {
                    if (t.indexOf(a) > -1) return !0;
                    if ("function" == typeof e.isOptionSelected) return e.isOptionSelected(a, t);
                    var i = qr(e, a);
                    return t.some(function (a) {
                        return qr(e, a) === i;
                    });
                }
                function Jr(e, a, t) {
                    return !e.filterOption || e.filterOption(a, t);
                }
                var Xr = function (e) {
                        var a = e.hideSelectedOptions,
                            t = e.isMulti;
                        return void 0 === a ? t : a;
                    },
                    Qr = 1,
                    en = (function (e) {
                        !(function (e, a) {
                            if ("function" != typeof a && null !== a) throw new TypeError("Super expression must either be null or a function");
                            (e.prototype = Object.create(a && a.prototype, { constructor: { value: e, writable: !0, configurable: !0 } })), Object.defineProperty(e, "prototype", { writable: !1 }), a && fa(e, a);
                        })(t, e);
                        var a = (function (e) {
                            var a = ba();
                            return function () {
                                var t,
                                    i = ma(e);
                                if (a) {
                                    var r = ma(this).constructor;
                                    t = Reflect.construct(i, arguments, r);
                                } else t = i.apply(this, arguments);
                                return (function (e, a) {
                                    if (a && ("object" == ea(a) || "function" == typeof a)) return a;
                                    if (void 0 !== a) throw new TypeError("Derived constructors may only return object or undefined");
                                    return (function (e) {
                                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                        return e;
                                    })(e);
                                })(this, t);
                            };
                        })(t);
                        function t(e) {
                            var i;
                            if (
                                ((function (e, a) {
                                    if (!(e instanceof a)) throw new TypeError("Cannot call a class as a function");
                                })(this, t),
                                ((i = a.call(this, e)).state = {
                                    ariaSelection: null,
                                    focusedOption: null,
                                    focusedValue: null,
                                    inputIsHidden: !1,
                                    isFocused: !1,
                                    selectValue: [],
                                    clearFocusValueOnUpdate: !1,
                                    prevWasFocused: !1,
                                    inputIsHiddenAfterUpdate: void 0,
                                    prevProps: void 0,
                                }),
                                (i.blockOptionHover = !1),
                                (i.isComposing = !1),
                                (i.commonProps = void 0),
                                (i.initialTouchX = 0),
                                (i.initialTouchY = 0),
                                (i.instancePrefix = ""),
                                (i.openAfterFocus = !1),
                                (i.scrollToFocusedOptionOnUpdate = !1),
                                (i.userIsDragging = void 0),
                                (i.controlRef = null),
                                (i.getControlRef = function (e) {
                                    i.controlRef = e;
                                }),
                                (i.focusedOptionRef = null),
                                (i.getFocusedOptionRef = function (e) {
                                    i.focusedOptionRef = e;
                                }),
                                (i.menuListRef = null),
                                (i.getMenuListRef = function (e) {
                                    i.menuListRef = e;
                                }),
                                (i.inputRef = null),
                                (i.getInputRef = function (e) {
                                    i.inputRef = e;
                                }),
                                (i.focus = i.focusInput),
                                (i.blur = i.blurInput),
                                (i.onChange = function (e, a) {
                                    var t = i.props,
                                        r = t.onChange,
                                        n = t.name;
                                    (a.name = n), i.ariaOnChange(e, a), r(e, a);
                                }),
                                (i.setValue = function (e, a, t) {
                                    var r = i.props,
                                        n = r.closeMenuOnSelect,
                                        s = r.isMulti,
                                        l = r.inputValue;
                                    i.onInputChange("", { action: "set-value", prevInputValue: l }),
                                        n && (i.setState({ inputIsHiddenAfterUpdate: !s }), i.onMenuClose()),
                                        i.setState({ clearFocusValueOnUpdate: !0 }),
                                        i.onChange(e, { action: a, option: t });
                                }),
                                (i.selectOption = function (e) {
                                    var a = i.props,
                                        t = a.blurInputOnSelect,
                                        r = a.isMulti,
                                        n = a.name,
                                        s = i.state.selectValue,
                                        l = r && i.isOptionSelected(e, s),
                                        o = i.isOptionDisabled(e, s);
                                    if (l) {
                                        var u = i.getOptionValue(e);
                                        i.setValue(
                                            s.filter(function (e) {
                                                return i.getOptionValue(e) !== u;
                                            }),
                                            "deselect-option",
                                            e
                                        );
                                    } else {
                                        if (o) return void i.ariaOnChange(e, { action: "select-option", option: e, name: n });
                                        r ? i.setValue([].concat(va(s), [e]), "select-option", e) : i.setValue(e, "select-option");
                                    }
                                    t && i.blurInput();
                                }),
                                (i.removeValue = function (e) {
                                    var a = i.props.isMulti,
                                        t = i.state.selectValue,
                                        r = i.getOptionValue(e),
                                        n = t.filter(function (e) {
                                            return i.getOptionValue(e) !== r;
                                        }),
                                        s = Ti(a, n, n[0] || null);
                                    i.onChange(s, { action: "remove-value", removedValue: e }), i.focusInput();
                                }),
                                (i.clearValue = function () {
                                    var e = i.state.selectValue;
                                    i.onChange(Ti(i.props.isMulti, [], null), { action: "clear", removedValues: e });
                                }),
                                (i.popValue = function () {
                                    var e = i.props.isMulti,
                                        a = i.state.selectValue,
                                        t = a[a.length - 1],
                                        r = a.slice(0, a.length - 1),
                                        n = Ti(e, r, r[0] || null);
                                    i.onChange(n, { action: "pop-value", removedValue: t });
                                }),
                                (i.getValue = function () {
                                    return i.state.selectValue;
                                }),
                                (i.cx = function () {
                                    for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++) a[t] = arguments[t];
                                    return bi.apply(void 0, [i.props.classNamePrefix].concat(a));
                                }),
                                (i.getOptionLabel = function (e) {
                                    return Wr(i.props, e);
                                }),
                                (i.getOptionValue = function (e) {
                                    return qr(i.props, e);
                                }),
                                (i.getStyles = function (e, a) {
                                    var t = i.props.unstyled,
                                        r = Fr[e](a, t);
                                    r.boxSizing = "border-box";
                                    var n = i.props.styles[e];
                                    return n ? n(r, a) : r;
                                }),
                                (i.getClassNames = function (e, a) {
                                    var t, r;
                                    return null === (t = (r = i.props.classNames)[e]) || void 0 === t ? void 0 : t.call(r, a);
                                }),
                                (i.getElementId = function (e) {
                                    return "".concat(i.instancePrefix, "-").concat(e);
                                }),
                                (i.getComponents = function () {
                                    return (e = i.props), ra(ra({}, sr), e.components);
                                    var e;
                                }),
                                (i.buildCategorizedOptions = function () {
                                    return zr(i.props, i.state.selectValue);
                                }),
                                (i.getCategorizedOptions = function () {
                                    return i.props.menuIsOpen ? i.buildCategorizedOptions() : [];
                                }),
                                (i.buildFocusableOptions = function () {
                                    return Ur(i.buildCategorizedOptions());
                                }),
                                (i.getFocusableOptions = function () {
                                    return i.props.menuIsOpen ? i.buildFocusableOptions() : [];
                                }),
                                (i.ariaOnChange = function (e, a) {
                                    i.setState({ ariaSelection: ra({ value: e }, a) });
                                }),
                                (i.onMenuMouseDown = function (e) {
                                    0 === e.button && (e.stopPropagation(), e.preventDefault(), i.focusInput());
                                }),
                                (i.onMenuMouseMove = function (e) {
                                    i.blockOptionHover = !1;
                                }),
                                (i.onControlMouseDown = function (e) {
                                    if (!e.defaultPrevented) {
                                        var a = i.props.openMenuOnClick;
                                        i.state.isFocused
                                            ? i.props.menuIsOpen
                                                ? "INPUT" !== e.target.tagName && "TEXTAREA" !== e.target.tagName && i.onMenuClose()
                                                : a && i.openMenu("first")
                                            : (a && (i.openAfterFocus = !0), i.focusInput()),
                                            "INPUT" !== e.target.tagName && "TEXTAREA" !== e.target.tagName && e.preventDefault();
                                    }
                                }),
                                (i.onDropdownIndicatorMouseDown = function (e) {
                                    if (!((e && "mousedown" === e.type && 0 !== e.button) || i.props.isDisabled)) {
                                        var a = i.props,
                                            t = a.isMulti,
                                            r = a.menuIsOpen;
                                        i.focusInput(), r ? (i.setState({ inputIsHiddenAfterUpdate: !t }), i.onMenuClose()) : i.openMenu("first"), e.preventDefault();
                                    }
                                }),
                                (i.onClearIndicatorMouseDown = function (e) {
                                    (e && "mousedown" === e.type && 0 !== e.button) ||
                                        (i.clearValue(),
                                        e.preventDefault(),
                                        (i.openAfterFocus = !1),
                                        "touchend" === e.type
                                            ? i.focusInput()
                                            : setTimeout(function () {
                                                  return i.focusInput();
                                              }));
                                }),
                                (i.onScroll = function (e) {
                                    "boolean" == typeof i.props.closeMenuOnScroll
                                        ? e.target instanceof HTMLElement && xi(e.target) && i.props.onMenuClose()
                                        : "function" == typeof i.props.closeMenuOnScroll && i.props.closeMenuOnScroll(e) && i.props.onMenuClose();
                                }),
                                (i.onCompositionStart = function () {
                                    i.isComposing = !0;
                                }),
                                (i.onCompositionEnd = function () {
                                    i.isComposing = !1;
                                }),
                                (i.onTouchStart = function (e) {
                                    var a = e.touches,
                                        t = a && a.item(0);
                                    t && ((i.initialTouchX = t.clientX), (i.initialTouchY = t.clientY), (i.userIsDragging = !1));
                                }),
                                (i.onTouchMove = function (e) {
                                    var a = e.touches,
                                        t = a && a.item(0);
                                    if (t) {
                                        var r = Math.abs(t.clientX - i.initialTouchX),
                                            n = Math.abs(t.clientY - i.initialTouchY);
                                        i.userIsDragging = r > 5 || n > 5;
                                    }
                                }),
                                (i.onTouchEnd = function (e) {
                                    i.userIsDragging || (i.controlRef && !i.controlRef.contains(e.target) && i.menuListRef && !i.menuListRef.contains(e.target) && i.blurInput(), (i.initialTouchX = 0), (i.initialTouchY = 0));
                                }),
                                (i.onControlTouchEnd = function (e) {
                                    i.userIsDragging || i.onControlMouseDown(e);
                                }),
                                (i.onClearIndicatorTouchEnd = function (e) {
                                    i.userIsDragging || i.onClearIndicatorMouseDown(e);
                                }),
                                (i.onDropdownIndicatorTouchEnd = function (e) {
                                    i.userIsDragging || i.onDropdownIndicatorMouseDown(e);
                                }),
                                (i.handleInputChange = function (e) {
                                    var a = i.props.inputValue,
                                        t = e.currentTarget.value;
                                    i.setState({ inputIsHiddenAfterUpdate: !1 }), i.onInputChange(t, { action: "input-change", prevInputValue: a }), i.props.menuIsOpen || i.onMenuOpen();
                                }),
                                (i.onInputFocus = function (e) {
                                    i.props.onFocus && i.props.onFocus(e), i.setState({ inputIsHiddenAfterUpdate: !1, isFocused: !0 }), (i.openAfterFocus || i.props.openMenuOnFocus) && i.openMenu("first"), (i.openAfterFocus = !1);
                                }),
                                (i.onInputBlur = function (e) {
                                    var a = i.props.inputValue;
                                    i.menuListRef && i.menuListRef.contains(document.activeElement)
                                        ? i.inputRef.focus()
                                        : (i.props.onBlur && i.props.onBlur(e), i.onInputChange("", { action: "input-blur", prevInputValue: a }), i.onMenuClose(), i.setState({ focusedValue: null, isFocused: !1 }));
                                }),
                                (i.onOptionHover = function (e) {
                                    i.blockOptionHover || i.state.focusedOption === e || i.setState({ focusedOption: e });
                                }),
                                (i.shouldHideSelectedOptions = function () {
                                    return Xr(i.props);
                                }),
                                (i.onValueInputFocus = function (e) {
                                    e.preventDefault(), e.stopPropagation(), i.focus();
                                }),
                                (i.onKeyDown = function (e) {
                                    var a = i.props,
                                        t = a.isMulti,
                                        r = a.backspaceRemovesValue,
                                        n = a.escapeClearsValue,
                                        s = a.inputValue,
                                        l = a.isClearable,
                                        o = a.isDisabled,
                                        u = a.menuIsOpen,
                                        c = a.onKeyDown,
                                        g = a.tabSelectsValue,
                                        d = a.openMenuOnFocus,
                                        y = i.state,
                                        f = y.focusedOption,
                                        m = y.focusedValue,
                                        b = y.selectValue;
                                    if (!(o || ("function" == typeof c && (c(e), e.defaultPrevented)))) {
                                        switch (((i.blockOptionHover = !0), e.key)) {
                                            case "ArrowLeft":
                                                if (!t || s) return;
                                                i.focusValue("previous");
                                                break;
                                            case "ArrowRight":
                                                if (!t || s) return;
                                                i.focusValue("next");
                                                break;
                                            case "Delete":
                                            case "Backspace":
                                                if (s) return;
                                                if (m) i.removeValue(m);
                                                else {
                                                    if (!r) return;
                                                    t ? i.popValue() : l && i.clearValue();
                                                }
                                                break;
                                            case "Tab":
                                                if (i.isComposing) return;
                                                if (e.shiftKey || !u || !g || !f || (d && i.isOptionSelected(f, b))) return;
                                                i.selectOption(f);
                                                break;
                                            case "Enter":
                                                if (229 === e.keyCode) break;
                                                if (u) {
                                                    if (!f) return;
                                                    if (i.isComposing) return;
                                                    i.selectOption(f);
                                                    break;
                                                }
                                                return;
                                            case "Escape":
                                                u ? (i.setState({ inputIsHiddenAfterUpdate: !1 }), i.onInputChange("", { action: "menu-close", prevInputValue: s }), i.onMenuClose()) : l && n && i.clearValue();
                                                break;
                                            case " ":
                                                if (s) return;
                                                if (!u) {
                                                    i.openMenu("first");
                                                    break;
                                                }
                                                if (!f) return;
                                                i.selectOption(f);
                                                break;
                                            case "ArrowUp":
                                                u ? i.focusOption("up") : i.openMenu("last");
                                                break;
                                            case "ArrowDown":
                                                u ? i.focusOption("down") : i.openMenu("first");
                                                break;
                                            case "PageUp":
                                                if (!u) return;
                                                i.focusOption("pageup");
                                                break;
                                            case "PageDown":
                                                if (!u) return;
                                                i.focusOption("pagedown");
                                                break;
                                            case "Home":
                                                if (!u) return;
                                                i.focusOption("first");
                                                break;
                                            case "End":
                                                if (!u) return;
                                                i.focusOption("last");
                                                break;
                                            default:
                                                return;
                                        }
                                        e.preventDefault();
                                    }
                                }),
                                (i.instancePrefix = "react-select-" + (i.props.instanceId || ++Qr)),
                                (i.state.selectValue = vi(e.value)),
                                e.menuIsOpen && i.state.selectValue.length)
                            ) {
                                var r = i.buildFocusableOptions(),
                                    n = r.indexOf(i.state.selectValue[0]);
                                i.state.focusedOption = r[n];
                            }
                            return i;
                        }
                        return (
                            (function (e, a, t) {
                                a && ya(e.prototype, a), t && ya(e, t), Object.defineProperty(e, "prototype", { writable: !1 });
                            })(
                                t,
                                [
                                    {
                                        key: "componentDidMount",
                                        value: function () {
                                            this.startListeningComposition(),
                                                this.startListeningToTouch(),
                                                this.props.closeMenuOnScroll && document && document.addEventListener && document.addEventListener("scroll", this.onScroll, !0),
                                                this.props.autoFocus && this.focusInput(),
                                                this.props.menuIsOpen && this.state.focusedOption && this.menuListRef && this.focusedOptionRef && Ci(this.menuListRef, this.focusedOptionRef);
                                        },
                                    },
                                    {
                                        key: "componentDidUpdate",
                                        value: function (e) {
                                            var a = this.props,
                                                t = a.isDisabled,
                                                i = a.menuIsOpen,
                                                r = this.state.isFocused;
                                            ((r && !t && e.isDisabled) || (r && i && !e.menuIsOpen)) && this.focusInput(),
                                                r && t && !e.isDisabled ? this.setState({ isFocused: !1 }, this.onMenuClose) : r || t || !e.isDisabled || this.inputRef !== document.activeElement || this.setState({ isFocused: !0 }),
                                                this.menuListRef && this.focusedOptionRef && this.scrollToFocusedOptionOnUpdate && (Ci(this.menuListRef, this.focusedOptionRef), (this.scrollToFocusedOptionOnUpdate = !1));
                                        },
                                    },
                                    {
                                        key: "componentWillUnmount",
                                        value: function () {
                                            this.stopListeningComposition(), this.stopListeningToTouch(), document.removeEventListener("scroll", this.onScroll, !0);
                                        },
                                    },
                                    {
                                        key: "onMenuOpen",
                                        value: function () {
                                            this.props.onMenuOpen();
                                        },
                                    },
                                    {
                                        key: "onMenuClose",
                                        value: function () {
                                            this.onInputChange("", { action: "menu-close", prevInputValue: this.props.inputValue }), this.props.onMenuClose();
                                        },
                                    },
                                    {
                                        key: "onInputChange",
                                        value: function (e, a) {
                                            this.props.onInputChange(e, a);
                                        },
                                    },
                                    {
                                        key: "focusInput",
                                        value: function () {
                                            this.inputRef && this.inputRef.focus();
                                        },
                                    },
                                    {
                                        key: "blurInput",
                                        value: function () {
                                            this.inputRef && this.inputRef.blur();
                                        },
                                    },
                                    {
                                        key: "openMenu",
                                        value: function (e) {
                                            var a = this,
                                                t = this.state,
                                                i = t.selectValue,
                                                r = t.isFocused,
                                                n = this.buildFocusableOptions(),
                                                s = "first" === e ? 0 : n.length - 1;
                                            if (!this.props.isMulti) {
                                                var l = n.indexOf(i[0]);
                                                l > -1 && (s = l);
                                            }
                                            (this.scrollToFocusedOptionOnUpdate = !(r && this.menuListRef)),
                                                this.setState({ inputIsHiddenAfterUpdate: !1, focusedValue: null, focusedOption: n[s] }, function () {
                                                    return a.onMenuOpen();
                                                });
                                        },
                                    },
                                    {
                                        key: "focusValue",
                                        value: function (e) {
                                            var a = this.state,
                                                t = a.selectValue,
                                                i = a.focusedValue;
                                            if (this.props.isMulti) {
                                                this.setState({ focusedOption: null });
                                                var r = t.indexOf(i);
                                                i || (r = -1);
                                                var n = t.length - 1,
                                                    s = -1;
                                                if (t.length) {
                                                    switch (e) {
                                                        case "previous":
                                                            s = 0 === r ? 0 : -1 === r ? n : r - 1;
                                                            break;
                                                        case "next":
                                                            r > -1 && r < n && (s = r + 1);
                                                    }
                                                    this.setState({ inputIsHidden: -1 !== s, focusedValue: t[s] });
                                                }
                                            }
                                        },
                                    },
                                    {
                                        key: "focusOption",
                                        value: function () {
                                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "first",
                                                a = this.props.pageSize,
                                                t = this.state.focusedOption,
                                                i = this.getFocusableOptions();
                                            if (i.length) {
                                                var r = 0,
                                                    n = i.indexOf(t);
                                                t || (n = -1),
                                                    "up" === e
                                                        ? (r = n > 0 ? n - 1 : i.length - 1)
                                                        : "down" === e
                                                        ? (r = (n + 1) % i.length)
                                                        : "pageup" === e
                                                        ? (r = n - a) < 0 && (r = 0)
                                                        : "pagedown" === e
                                                        ? (r = n + a) > i.length - 1 && (r = i.length - 1)
                                                        : "last" === e && (r = i.length - 1),
                                                    (this.scrollToFocusedOptionOnUpdate = !0),
                                                    this.setState({ focusedOption: i[r], focusedValue: null });
                                            }
                                        },
                                    },
                                    {
                                        key: "getTheme",
                                        value: function () {
                                            return this.props.theme ? ("function" == typeof this.props.theme ? this.props.theme(Vr) : ra(ra({}, Vr), this.props.theme)) : Vr;
                                        },
                                    },
                                    {
                                        key: "getCommonProps",
                                        value: function () {
                                            var e = this.clearValue,
                                                a = this.cx,
                                                t = this.getStyles,
                                                i = this.getClassNames,
                                                r = this.getValue,
                                                n = this.selectOption,
                                                s = this.setValue,
                                                l = this.props,
                                                o = l.isMulti,
                                                u = l.isRtl,
                                                c = l.options;
                                            return {
                                                clearValue: e,
                                                cx: a,
                                                getStyles: t,
                                                getClassNames: i,
                                                getValue: r,
                                                hasValue: this.hasValue(),
                                                isMulti: o,
                                                isRtl: u,
                                                options: c,
                                                selectOption: n,
                                                selectProps: l,
                                                setValue: s,
                                                theme: this.getTheme(),
                                            };
                                        },
                                    },
                                    {
                                        key: "hasValue",
                                        value: function () {
                                            return this.state.selectValue.length > 0;
                                        },
                                    },
                                    {
                                        key: "hasOptions",
                                        value: function () {
                                            return !!this.getFocusableOptions().length;
                                        },
                                    },
                                    {
                                        key: "isClearable",
                                        value: function () {
                                            var e = this.props,
                                                a = e.isClearable,
                                                t = e.isMulti;
                                            return void 0 === a ? t : a;
                                        },
                                    },
                                    {
                                        key: "isOptionDisabled",
                                        value: function (e, a) {
                                            return Yr(this.props, e, a);
                                        },
                                    },
                                    {
                                        key: "isOptionSelected",
                                        value: function (e, a) {
                                            return Zr(this.props, e, a);
                                        },
                                    },
                                    {
                                        key: "filterOption",
                                        value: function (e, a) {
                                            return Jr(this.props, e, a);
                                        },
                                    },
                                    {
                                        key: "formatOptionLabel",
                                        value: function (e, a) {
                                            if ("function" == typeof this.props.formatOptionLabel) {
                                                var t = this.props.inputValue,
                                                    i = this.state.selectValue;
                                                return this.props.formatOptionLabel(e, { context: a, inputValue: t, selectValue: i });
                                            }
                                            return this.getOptionLabel(e);
                                        },
                                    },
                                    {
                                        key: "formatGroupLabel",
                                        value: function (e) {
                                            return this.props.formatGroupLabel(e);
                                        },
                                    },
                                    {
                                        key: "startListeningComposition",
                                        value: function () {
                                            document && document.addEventListener && (document.addEventListener("compositionstart", this.onCompositionStart, !1), document.addEventListener("compositionend", this.onCompositionEnd, !1));
                                        },
                                    },
                                    {
                                        key: "stopListeningComposition",
                                        value: function () {
                                            document && document.removeEventListener && (document.removeEventListener("compositionstart", this.onCompositionStart), document.removeEventListener("compositionend", this.onCompositionEnd));
                                        },
                                    },
                                    {
                                        key: "startListeningToTouch",
                                        value: function () {
                                            document &&
                                                document.addEventListener &&
                                                (document.addEventListener("touchstart", this.onTouchStart, !1), document.addEventListener("touchmove", this.onTouchMove, !1), document.addEventListener("touchend", this.onTouchEnd, !1));
                                        },
                                    },
                                    {
                                        key: "stopListeningToTouch",
                                        value: function () {
                                            document &&
                                                document.removeEventListener &&
                                                (document.removeEventListener("touchstart", this.onTouchStart), document.removeEventListener("touchmove", this.onTouchMove), document.removeEventListener("touchend", this.onTouchEnd));
                                        },
                                    },
                                    {
                                        key: "renderInput",
                                        value: function () {
                                            var e = this.props,
                                                a = e.isDisabled,
                                                t = e.isSearchable,
                                                i = e.inputId,
                                                r = e.inputValue,
                                                n = e.tabIndex,
                                                s = e.form,
                                                l = e.menuIsOpen,
                                                o = e.required,
                                                u = this.getComponents().Input,
                                                c = this.state,
                                                g = c.inputIsHidden,
                                                d = c.ariaSelection,
                                                y = this.commonProps,
                                                f = i || this.getElementId("input"),
                                                m = ra(
                                                    ra(
                                                        ra(
                                                            {
                                                                "aria-autocomplete": "list",
                                                                "aria-expanded": l,
                                                                "aria-haspopup": !0,
                                                                "aria-errormessage": this.props["aria-errormessage"],
                                                                "aria-invalid": this.props["aria-invalid"],
                                                                "aria-label": this.props["aria-label"],
                                                                "aria-labelledby": this.props["aria-labelledby"],
                                                                "aria-required": o,
                                                                role: "combobox",
                                                            },
                                                            l && { "aria-controls": this.getElementId("listbox"), "aria-owns": this.getElementId("listbox") }
                                                        ),
                                                        !t && { "aria-readonly": !0 }
                                                    ),
                                                    this.hasValue()
                                                        ? "initial-input-focus" === (null == d ? void 0 : d.action) && { "aria-describedby": this.getElementId("live-region") }
                                                        : { "aria-describedby": this.getElementId("placeholder") }
                                                );
                                            return t
                                                ? ua.createElement(
                                                      u,
                                                      da(
                                                          {},
                                                          y,
                                                          {
                                                              autoCapitalize: "none",
                                                              autoComplete: "off",
                                                              autoCorrect: "off",
                                                              id: f,
                                                              innerRef: this.getInputRef,
                                                              isDisabled: a,
                                                              isHidden: g,
                                                              onBlur: this.onInputBlur,
                                                              onChange: this.handleInputChange,
                                                              onFocus: this.onInputFocus,
                                                              spellCheck: "false",
                                                              tabIndex: n,
                                                              form: s,
                                                              type: "text",
                                                              value: r,
                                                          },
                                                          m
                                                      )
                                                  )
                                                : ua.createElement(
                                                      Nr,
                                                      da({ id: f, innerRef: this.getInputRef, onBlur: this.onInputBlur, onChange: fi, onFocus: this.onInputFocus, disabled: a, tabIndex: n, inputMode: "none", form: s, value: "" }, m)
                                                  );
                                        },
                                    },
                                    {
                                        key: "renderPlaceholderOrValue",
                                        value: function () {
                                            var e = this,
                                                a = this.getComponents(),
                                                t = a.MultiValue,
                                                i = a.MultiValueContainer,
                                                r = a.MultiValueLabel,
                                                n = a.MultiValueRemove,
                                                s = a.SingleValue,
                                                l = a.Placeholder,
                                                o = this.commonProps,
                                                u = this.props,
                                                c = u.controlShouldRenderValue,
                                                g = u.isDisabled,
                                                d = u.isMulti,
                                                y = u.inputValue,
                                                f = u.placeholder,
                                                m = this.state,
                                                b = m.selectValue,
                                                v = m.focusedValue,
                                                p = m.isFocused;
                                            if (!this.hasValue() || !c) return y ? null : ua.createElement(l, da({}, o, { key: "placeholder", isDisabled: g, isFocused: p, innerProps: { id: this.getElementId("placeholder") } }), f);
                                            if (d)
                                                return b.map(function (a, s) {
                                                    var l = a === v,
                                                        u = "".concat(e.getOptionLabel(a), "-").concat(e.getOptionValue(a));
                                                    return ua.createElement(
                                                        t,
                                                        da({}, o, {
                                                            components: { Container: i, Label: r, Remove: n },
                                                            isFocused: l,
                                                            isDisabled: g,
                                                            key: u,
                                                            index: s,
                                                            removeProps: {
                                                                onClick: function () {
                                                                    return e.removeValue(a);
                                                                },
                                                                onTouchEnd: function () {
                                                                    return e.removeValue(a);
                                                                },
                                                                onMouseDown: function (e) {
                                                                    e.preventDefault();
                                                                },
                                                            },
                                                            data: a,
                                                        }),
                                                        e.formatOptionLabel(a, "value")
                                                    );
                                                });
                                            if (y) return null;
                                            var h = b[0];
                                            return ua.createElement(s, da({}, o, { data: h, isDisabled: g }), this.formatOptionLabel(h, "value"));
                                        },
                                    },
                                    {
                                        key: "renderClearIndicator",
                                        value: function () {
                                            var e = this.getComponents().ClearIndicator,
                                                a = this.commonProps,
                                                t = this.props,
                                                i = t.isDisabled,
                                                r = t.isLoading,
                                                n = this.state.isFocused;
                                            if (!this.isClearable() || !e || i || !this.hasValue() || r) return null;
                                            var s = { onMouseDown: this.onClearIndicatorMouseDown, onTouchEnd: this.onClearIndicatorTouchEnd, "aria-hidden": "true" };
                                            return ua.createElement(e, da({}, a, { innerProps: s, isFocused: n }));
                                        },
                                    },
                                    {
                                        key: "renderLoadingIndicator",
                                        value: function () {
                                            var e = this.getComponents().LoadingIndicator,
                                                a = this.commonProps,
                                                t = this.props,
                                                i = t.isDisabled,
                                                r = t.isLoading,
                                                n = this.state.isFocused;
                                            return e && r ? ua.createElement(e, da({}, a, { innerProps: { "aria-hidden": "true" }, isDisabled: i, isFocused: n })) : null;
                                        },
                                    },
                                    {
                                        key: "renderIndicatorSeparator",
                                        value: function () {
                                            var e = this.getComponents(),
                                                a = e.DropdownIndicator,
                                                t = e.IndicatorSeparator;
                                            if (!a || !t) return null;
                                            var i = this.commonProps,
                                                r = this.props.isDisabled,
                                                n = this.state.isFocused;
                                            return ua.createElement(t, da({}, i, { isDisabled: r, isFocused: n }));
                                        },
                                    },
                                    {
                                        key: "renderDropdownIndicator",
                                        value: function () {
                                            var e = this.getComponents().DropdownIndicator;
                                            if (!e) return null;
                                            var a = this.commonProps,
                                                t = this.props.isDisabled,
                                                i = this.state.isFocused,
                                                r = { onMouseDown: this.onDropdownIndicatorMouseDown, onTouchEnd: this.onDropdownIndicatorTouchEnd, "aria-hidden": "true" };
                                            return ua.createElement(e, da({}, a, { innerProps: r, isDisabled: t, isFocused: i }));
                                        },
                                    },
                                    {
                                        key: "renderMenu",
                                        value: function () {
                                            var e = this,
                                                a = this.getComponents(),
                                                t = a.Group,
                                                i = a.GroupHeading,
                                                r = a.Menu,
                                                n = a.MenuList,
                                                s = a.MenuPortal,
                                                l = a.LoadingMessage,
                                                o = a.NoOptionsMessage,
                                                u = a.Option,
                                                c = this.commonProps,
                                                g = this.state.focusedOption,
                                                d = this.props,
                                                y = d.captureMenuScroll,
                                                f = d.inputValue,
                                                m = d.isLoading,
                                                b = d.loadingMessage,
                                                v = d.minMenuHeight,
                                                p = d.maxMenuHeight,
                                                h = d.menuIsOpen,
                                                x = d.menuPlacement,
                                                S = d.menuPosition,
                                                k = d.menuPortalTarget,
                                                w = d.menuShouldBlockScroll,
                                                C = d.menuShouldScrollIntoView,
                                                N = d.noOptionsMessage,
                                                M = d.onMenuScrollToTop,
                                                j = d.onMenuScrollToBottom;
                                            if (!h) return null;
                                            var $,
                                                O = function (a, t) {
                                                    var i = a.type,
                                                        r = a.data,
                                                        n = a.isDisabled,
                                                        s = a.isSelected,
                                                        l = a.label,
                                                        o = a.value,
                                                        d = g === r,
                                                        y = n
                                                            ? void 0
                                                            : function () {
                                                                  return e.onOptionHover(r);
                                                              },
                                                        f = n
                                                            ? void 0
                                                            : function () {
                                                                  return e.selectOption(r);
                                                              },
                                                        m = "".concat(e.getElementId("option"), "-").concat(t),
                                                        b = { id: m, onClick: f, onMouseMove: y, onMouseOver: y, tabIndex: -1 };
                                                    return ua.createElement(
                                                        u,
                                                        da({}, c, { innerProps: b, data: r, isDisabled: n, isSelected: s, key: m, label: l, type: i, value: o, isFocused: d, innerRef: d ? e.getFocusedOptionRef : void 0 }),
                                                        e.formatOptionLabel(a.data, "menu")
                                                    );
                                                };
                                            if (this.hasOptions())
                                                $ = this.getCategorizedOptions().map(function (a) {
                                                    if ("group" === a.type) {
                                                        var r = a.data,
                                                            n = a.options,
                                                            s = a.index,
                                                            l = "".concat(e.getElementId("group"), "-").concat(s),
                                                            o = "".concat(l, "-heading");
                                                        return ua.createElement(
                                                            t,
                                                            da({}, c, { key: l, data: r, options: n, Heading: i, headingProps: { id: o, data: a.data }, label: e.formatGroupLabel(a.data) }),
                                                            a.options.map(function (e) {
                                                                return O(e, "".concat(s, "-").concat(e.index));
                                                            })
                                                        );
                                                    }
                                                    if ("option" === a.type) return O(a, "".concat(a.index));
                                                });
                                            else if (m) {
                                                var B = b({ inputValue: f });
                                                if (null === B) return null;
                                                $ = ua.createElement(l, c, B);
                                            } else {
                                                var T = N({ inputValue: f });
                                                if (null === T) return null;
                                                $ = ua.createElement(o, c, T);
                                            }
                                            var L = { minMenuHeight: v, maxMenuHeight: p, menuPlacement: x, menuPosition: S, menuShouldScrollIntoView: C },
                                                R = ua.createElement(Ei, da({}, c, L), function (a) {
                                                    var t = a.ref,
                                                        i = a.placerProps,
                                                        s = i.placement,
                                                        l = i.maxHeight;
                                                    return ua.createElement(
                                                        r,
                                                        da({}, c, L, { innerRef: t, innerProps: { onMouseDown: e.onMenuMouseDown, onMouseMove: e.onMenuMouseMove, id: e.getElementId("listbox") }, isLoading: m, placement: s }),
                                                        ua.createElement(Dr, { captureEnabled: y, onTopArrive: M, onBottomArrive: j, lockEnabled: w }, function (a) {
                                                            return ua.createElement(
                                                                n,
                                                                da({}, c, {
                                                                    innerRef: function (t) {
                                                                        e.getMenuListRef(t), a(t);
                                                                    },
                                                                    isLoading: m,
                                                                    maxHeight: l,
                                                                    focusedOption: g,
                                                                }),
                                                                $
                                                            );
                                                        })
                                                    );
                                                });
                                            return k || "fixed" === S ? ua.createElement(s, da({}, c, { appendTo: k, controlElement: this.controlRef, menuPlacement: x, menuPosition: S }), R) : R;
                                        },
                                    },
                                    {
                                        key: "renderFormField",
                                        value: function () {
                                            var e = this,
                                                a = this.props,
                                                t = a.delimiter,
                                                i = a.isDisabled,
                                                r = a.isMulti,
                                                n = a.name,
                                                s = a.required,
                                                l = this.state.selectValue;
                                            if (s && !this.hasValue() && !i) return ua.createElement(Er, { name: n, onFocus: this.onValueInputFocus });
                                            if (n && !i) {
                                                if (r) {
                                                    if (t) {
                                                        var o = l
                                                            .map(function (a) {
                                                                return e.getOptionValue(a);
                                                            })
                                                            .join(t);
                                                        return ua.createElement("input", { name: n, type: "hidden", value: o });
                                                    }
                                                    var u =
                                                        l.length > 0
                                                            ? l.map(function (a, t) {
                                                                  return ua.createElement("input", { key: "i-".concat(t), name: n, type: "hidden", value: e.getOptionValue(a) });
                                                              })
                                                            : ua.createElement("input", { name: n, type: "hidden", value: "" });
                                                    return ua.createElement("div", null, u);
                                                }
                                                var c = l[0] ? this.getOptionValue(l[0]) : "";
                                                return ua.createElement("input", { name: n, type: "hidden", value: c });
                                            }
                                        },
                                    },
                                    {
                                        key: "renderLiveRegion",
                                        value: function () {
                                            var e = this.commonProps,
                                                a = this.state,
                                                t = a.ariaSelection,
                                                i = a.focusedOption,
                                                r = a.focusedValue,
                                                n = a.isFocused,
                                                s = a.selectValue,
                                                l = this.getFocusableOptions();
                                            return ua.createElement(yr, da({}, e, { id: this.getElementId("live-region"), ariaSelection: t, focusedOption: i, focusedValue: r, isFocused: n, selectValue: s, focusableOptions: l }));
                                        },
                                    },
                                    {
                                        key: "render",
                                        value: function () {
                                            var e = this.getComponents(),
                                                a = e.Control,
                                                t = e.IndicatorsContainer,
                                                i = e.SelectContainer,
                                                r = e.ValueContainer,
                                                n = this.props,
                                                s = n.className,
                                                l = n.id,
                                                o = n.isDisabled,
                                                u = n.menuIsOpen,
                                                c = this.state.isFocused,
                                                g = (this.commonProps = this.getCommonProps());
                                            return ua.createElement(
                                                i,
                                                da({}, g, { className: s, innerProps: { id: l, onKeyDown: this.onKeyDown }, isDisabled: o, isFocused: c }),
                                                this.renderLiveRegion(),
                                                ua.createElement(
                                                    a,
                                                    da({}, g, { innerRef: this.getControlRef, innerProps: { onMouseDown: this.onControlMouseDown, onTouchEnd: this.onControlTouchEnd }, isDisabled: o, isFocused: c, menuIsOpen: u }),
                                                    ua.createElement(r, da({}, g, { isDisabled: o }), this.renderPlaceholderOrValue(), this.renderInput()),
                                                    ua.createElement(t, da({}, g, { isDisabled: o }), this.renderClearIndicator(), this.renderLoadingIndicator(), this.renderIndicatorSeparator(), this.renderDropdownIndicator())
                                                ),
                                                this.renderMenu(),
                                                this.renderFormField()
                                            );
                                        },
                                    },
                                ],
                                [
                                    {
                                        key: "getDerivedStateFromProps",
                                        value: function (e, a) {
                                            var t = a.prevProps,
                                                i = a.clearFocusValueOnUpdate,
                                                r = a.inputIsHiddenAfterUpdate,
                                                n = a.ariaSelection,
                                                s = a.isFocused,
                                                l = a.prevWasFocused,
                                                o = e.options,
                                                u = e.value,
                                                c = e.menuIsOpen,
                                                g = e.inputValue,
                                                d = e.isMulti,
                                                y = vi(u),
                                                f = {};
                                            if (t && (u !== t.value || o !== t.options || c !== t.menuIsOpen || g !== t.inputValue)) {
                                                var m = c
                                                        ? (function (e, a) {
                                                              return Ur(zr(e, a));
                                                          })(e, y)
                                                        : [],
                                                    b = i
                                                        ? (function (e, a) {
                                                              var t = e.focusedValue,
                                                                  i = e.selectValue.indexOf(t);
                                                              if (i > -1) {
                                                                  if (a.indexOf(t) > -1) return t;
                                                                  if (i < a.length) return a[i];
                                                              }
                                                              return null;
                                                          })(a, y)
                                                        : null,
                                                    v = (function (e, a) {
                                                        var t = e.focusedOption;
                                                        return t && a.indexOf(t) > -1 ? t : a[0];
                                                    })(a, m);
                                                f = { selectValue: y, focusedOption: v, focusedValue: b, clearFocusValueOnUpdate: !1 };
                                            }
                                            var p = null != r && e !== t ? { inputIsHidden: r, inputIsHiddenAfterUpdate: void 0 } : {},
                                                h = n,
                                                x = s && l;
                                            return (
                                                s && !x && ((h = { value: Ti(d, y, y[0] || null), options: y, action: "initial-input-focus" }), (x = !l)),
                                                "initial-input-focus" === (null == n ? void 0 : n.action) && (h = null),
                                                ra(ra(ra({}, f), p), {}, { prevProps: e, ariaSelection: h, prevWasFocused: x })
                                            );
                                        },
                                    },
                                ]
                            ),
                            t
                        );
                    })(ua.Component);
                en.defaultProps = Hr;
                var an = (0, ua.forwardRef)(function (e, a) {
                        var t = (function (e) {
                            var a = e.defaultInputValue,
                                t = void 0 === a ? "" : a,
                                i = e.defaultMenuIsOpen,
                                r = void 0 !== i && i,
                                n = e.defaultValue,
                                s = void 0 === n ? null : n,
                                l = e.inputValue,
                                o = e.menuIsOpen,
                                u = e.onChange,
                                c = e.onInputChange,
                                g = e.onMenuClose,
                                d = e.onMenuOpen,
                                y = e.value,
                                f = oa(e, ga),
                                m = la((0, ua.useState)(void 0 !== l ? l : t), 2),
                                b = m[0],
                                v = m[1],
                                p = la((0, ua.useState)(void 0 !== o ? o : r), 2),
                                h = p[0],
                                x = p[1],
                                S = la((0, ua.useState)(void 0 !== y ? y : s), 2),
                                k = S[0],
                                w = S[1],
                                C = (0, ua.useCallback)(
                                    function (e, a) {
                                        "function" == typeof u && u(e, a), w(e);
                                    },
                                    [u]
                                ),
                                N = (0, ua.useCallback)(
                                    function (e, a) {
                                        var t;
                                        "function" == typeof c && (t = c(e, a)), v(void 0 !== t ? t : e);
                                    },
                                    [c]
                                ),
                                M = (0, ua.useCallback)(
                                    function () {
                                        "function" == typeof d && d(), x(!0);
                                    },
                                    [d]
                                ),
                                j = (0, ua.useCallback)(
                                    function () {
                                        "function" == typeof g && g(), x(!1);
                                    },
                                    [g]
                                ),
                                $ = void 0 !== l ? l : b,
                                O = void 0 !== o ? o : h,
                                B = void 0 !== y ? y : k;
                            return ra(ra({}, f), {}, { inputValue: $, menuIsOpen: O, onChange: C, onInputChange: N, onMenuClose: j, onMenuOpen: M, value: B });
                        })(e);
                        return ua.createElement(en, da({ ref: a }, t));
                    }),
                    tn = an;
                const rn = {
                        ABeeZee: { family: "ABeeZee", category: "sans-serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        Abel: { family: "Abel", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Abhaya-Libre": { family: "Abhaya Libre", category: "serif", variants: ["regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "sinhala"] },
                        "Abril-Fatface": { family: "Abril Fatface", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Aclonica: { family: "Aclonica", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Acme: { family: "Acme", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Actor: { family: "Actor", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Adamina: { family: "Adamina", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Advent-Pro": { family: "Advent Pro", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["greek", "latin", "latin-ext"] },
                        "Aguafina-Script": { family: "Aguafina Script", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Akaya-Kanadaka": { family: "Akaya Kanadaka", category: "display", variants: ["regular"], subsets: ["kannada", "latin", "latin-ext"] },
                        "Akaya-Telivigala": { family: "Akaya Telivigala", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "telugu"] },
                        Akronim: { family: "Akronim", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Aladin: { family: "Aladin", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Alata: { family: "Alata", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Alatsi: { family: "Alatsi", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Aldrich: { family: "Aldrich", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Alef: { family: "Alef", category: "sans-serif", variants: ["regular", "700"], subsets: ["hebrew", "latin"] },
                        Alegreya: { family: "Alegreya", category: "serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"] },
                        "Alegreya-SC": { family: "Alegreya SC", category: "serif", variants: ["regular", "500", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"] },
                        "Alegreya-Sans": {
                            family: "Alegreya Sans",
                            category: "sans-serif",
                            variants: ["100", "300", "regular", "500", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Alegreya-Sans-SC": {
                            family: "Alegreya Sans SC",
                            category: "sans-serif",
                            variants: ["100", "300", "regular", "500", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        Aleo: { family: "Aleo", category: "serif", variants: ["300", "regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Alex-Brush": { family: "Alex Brush", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Alfa-Slab-One": { family: "Alfa Slab One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Alice: { family: "Alice", category: "serif", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin"] },
                        Alike: { family: "Alike", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Alike-Angular": { family: "Alike Angular", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Allan: { family: "Allan", category: "display", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Allerta: { family: "Allerta", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Allerta-Stencil": { family: "Allerta Stencil", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Allison: { family: "Allison", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Allura: { family: "Allura", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Almarai: { family: "Almarai", category: "sans-serif", variants: ["300", "regular", "700", "800"], subsets: ["arabic"] },
                        Almendra: { family: "Almendra", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Almendra-Display": { family: "Almendra Display", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Almendra-SC": { family: "Almendra SC", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Alumni-Sans": {
                            family: "Alumni Sans",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        Amarante: { family: "Amarante", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Amaranth: { family: "Amaranth", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin"] },
                        "Amatic-SC": { family: "Amatic SC", category: "handwriting", variants: ["regular", "700"], subsets: ["cyrillic", "hebrew", "latin", "latin-ext", "vietnamese"] },
                        Amethysta: { family: "Amethysta", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Amiko: { family: "Amiko", category: "sans-serif", variants: ["regular", "600", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Amiri: { family: "Amiri", category: "serif", variants: ["regular", "700"], subsets: ["arabic", "latin", "latin-ext"] },
                        Amita: { family: "Amita", category: "handwriting", variants: ["regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Anaheim: { family: "Anaheim", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Andada-Pro": { family: "Andada Pro", category: "serif", variants: ["regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Andika: { family: "Andika", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Andika-New-Basic": { family: "Andika New Basic", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Angkor: { family: "Angkor", category: "display", variants: ["regular"], subsets: ["khmer", "latin"] },
                        "Annie-Use-Your-Telescope": { family: "Annie Use Your Telescope", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Anonymous-Pro": { family: "Anonymous Pro", category: "monospace", variants: ["regular", "700"], subsets: ["cyrillic", "greek", "latin", "latin-ext"] },
                        Antic: { family: "Antic", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Antic-Didone": { family: "Antic Didone", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Antic-Slab": { family: "Antic Slab", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Anton: { family: "Anton", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Antonio: { family: "Antonio", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext"] },
                        Arapey: { family: "Arapey", category: "serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        Arbutus: { family: "Arbutus", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Arbutus-Slab": { family: "Arbutus Slab", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Architects-Daughter": { family: "Architects Daughter", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Archivo: { family: "Archivo", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Archivo-Black": { family: "Archivo Black", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Archivo-Narrow": { family: "Archivo Narrow", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Are-You-Serious": { family: "Are You Serious", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Aref-Ruqaa": { family: "Aref Ruqaa", category: "serif", variants: ["regular", "700"], subsets: ["arabic", "latin", "latin-ext"] },
                        "Arima-Madurai": { family: "Arima Madurai", category: "display", variants: ["100", "200", "300", "regular", "500", "700", "800", "900"], subsets: ["latin", "latin-ext", "tamil", "vietnamese"] },
                        Arimo: { family: "Arimo", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "hebrew", "latin", "latin-ext", "vietnamese"] },
                        Arizonia: { family: "Arizonia", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Armata: { family: "Armata", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Arsenal: { family: "Arsenal", category: "sans-serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        Artifika: { family: "Artifika", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Arvo: { family: "Arvo", category: "serif", variants: ["regular", "700"], subsets: ["latin"] },
                        Arya: { family: "Arya", category: "sans-serif", variants: ["regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Asap: { family: "Asap", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Asap-Condensed": { family: "Asap Condensed", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Asar: { family: "Asar", category: "serif", variants: ["regular"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Asset: { family: "Asset", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Assistant: { family: "Assistant", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["hebrew", "latin", "latin-ext"] },
                        Astloch: { family: "Astloch", category: "display", variants: ["regular", "700"], subsets: ["latin"] },
                        Asul: { family: "Asul", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin"] },
                        Athiti: { family: "Athiti", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        "Atkinson-Hyperlegible": { family: "Atkinson Hyperlegible", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Atma: { family: "Atma", category: "display", variants: ["300", "regular", "500", "600", "700"], subsets: ["bengali", "latin", "latin-ext"] },
                        "Atomic-Age": { family: "Atomic Age", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Aubrey: { family: "Aubrey", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Audiowide: { family: "Audiowide", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Autour-One": { family: "Autour One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Average: { family: "Average", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Average-Sans": { family: "Average Sans", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Averia-Gruesa-Libre": { family: "Averia Gruesa Libre", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Averia-Libre": { family: "Averia Libre", category: "display", variants: ["300", "regular", "700"], subsets: ["latin"] },
                        "Averia-Sans-Libre": { family: "Averia Sans Libre", category: "display", variants: ["300", "regular", "700"], subsets: ["latin"] },
                        "Averia-Serif-Libre": { family: "Averia Serif Libre", category: "display", variants: ["300", "regular", "700"], subsets: ["latin"] },
                        "Azeret-Mono": { family: "Azeret Mono", category: "monospace", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        B612: { family: "B612", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin"] },
                        "B612-Mono": { family: "B612 Mono", category: "monospace", variants: ["regular", "700"], subsets: ["latin"] },
                        "Bad-Script": { family: "Bad Script", category: "handwriting", variants: ["regular"], subsets: ["cyrillic", "latin"] },
                        Bahiana: { family: "Bahiana", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Bahianita: { family: "Bahianita", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Bai-Jamjuree": { family: "Bai Jamjuree", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Ballet: { family: "Ballet", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Baloo-2": { family: "Baloo 2", category: "display", variants: ["regular", "500", "600", "700", "800"], subsets: ["devanagari", "latin", "latin-ext", "vietnamese"] },
                        "Baloo-Bhai-2": { family: "Baloo Bhai 2", category: "display", variants: ["regular", "500", "600", "700", "800"], subsets: ["gujarati", "latin", "latin-ext", "vietnamese"] },
                        "Baloo-Bhaina-2": { family: "Baloo Bhaina 2", category: "display", variants: ["regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "oriya", "vietnamese"] },
                        "Baloo-Chettan-2": { family: "Baloo Chettan 2", category: "display", variants: ["regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "malayalam", "vietnamese"] },
                        "Baloo-Da-2": { family: "Baloo Da 2", category: "display", variants: ["regular", "500", "600", "700", "800"], subsets: ["bengali", "latin", "latin-ext", "vietnamese"] },
                        "Baloo-Paaji-2": { family: "Baloo Paaji 2", category: "display", variants: ["regular", "500", "600", "700", "800"], subsets: ["gurmukhi", "latin", "latin-ext", "vietnamese"] },
                        "Baloo-Tamma-2": { family: "Baloo Tamma 2", category: "display", variants: ["regular", "500", "600", "700", "800"], subsets: ["kannada", "latin", "latin-ext", "vietnamese"] },
                        "Baloo-Tammudu-2": { family: "Baloo Tammudu 2", category: "display", variants: ["regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "telugu", "vietnamese"] },
                        "Baloo-Thambi-2": { family: "Baloo Thambi 2", category: "display", variants: ["regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "tamil", "vietnamese"] },
                        "Balsamiq-Sans": { family: "Balsamiq Sans", category: "display", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        Balthazar: { family: "Balthazar", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Bangers: { family: "Bangers", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Barlow: { family: "Barlow", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Barlow-Condensed": { family: "Barlow Condensed", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Barlow-Semi-Condensed": { family: "Barlow Semi Condensed", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Barriecito: { family: "Barriecito", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Barrio: { family: "Barrio", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Basic: { family: "Basic", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Baskervville: { family: "Baskervville", category: "serif", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        Battambang: { family: "Battambang", category: "display", variants: ["100", "300", "regular", "700", "900"], subsets: ["khmer", "latin"] },
                        Baumans: { family: "Baumans", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Bayon: { family: "Bayon", category: "sans-serif", variants: ["regular"], subsets: ["khmer", "latin"] },
                        "Be-Vietnam": { family: "Be Vietnam", category: "sans-serif", variants: ["100", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Be-Vietnam-Pro": { family: "Be Vietnam Pro", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Bebas-Neue": { family: "Bebas Neue", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Belgrano: { family: "Belgrano", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Bellefair: { family: "Bellefair", category: "serif", variants: ["regular"], subsets: ["hebrew", "latin", "latin-ext"] },
                        Belleza: { family: "Belleza", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Bellota: { family: "Bellota", category: "display", variants: ["300", "regular", "700"], subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"] },
                        "Bellota-Text": { family: "Bellota Text", category: "display", variants: ["300", "regular", "700"], subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"] },
                        BenchNine: { family: "BenchNine", category: "sans-serif", variants: ["300", "regular", "700"], subsets: ["latin", "latin-ext"] },
                        Benne: { family: "Benne", category: "serif", variants: ["regular"], subsets: ["kannada", "latin", "latin-ext"] },
                        Bentham: { family: "Bentham", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Berkshire-Swash": { family: "Berkshire Swash", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Besley: { family: "Besley", category: "serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        "Beth-Ellen": { family: "Beth Ellen", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Bevan: { family: "Bevan", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Big-Shoulders-Display": { family: "Big Shoulders Display", category: "display", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Big-Shoulders-Inline-Display": {
                            family: "Big Shoulders Inline Display",
                            category: "display",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["latin", "latin-ext", "vietnamese"],
                        },
                        "Big-Shoulders-Inline-Text": { family: "Big Shoulders Inline Text", category: "display", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Big-Shoulders-Stencil-Display": {
                            family: "Big Shoulders Stencil Display",
                            category: "display",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["latin", "latin-ext", "vietnamese"],
                        },
                        "Big-Shoulders-Stencil-Text": {
                            family: "Big Shoulders Stencil Text",
                            category: "display",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["latin", "latin-ext", "vietnamese"],
                        },
                        "Big-Shoulders-Text": { family: "Big Shoulders Text", category: "display", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Bigelow-Rules": { family: "Bigelow Rules", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Bigshot-One": { family: "Bigshot One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Bilbo: { family: "Bilbo", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Bilbo-Swash-Caps": { family: "Bilbo Swash Caps", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        BioRhyme: { family: "BioRhyme", category: "serif", variants: ["200", "300", "regular", "700", "800"], subsets: ["latin", "latin-ext"] },
                        "BioRhyme-Expanded": { family: "BioRhyme Expanded", category: "serif", variants: ["200", "300", "regular", "700", "800"], subsets: ["latin", "latin-ext"] },
                        Birthstone: { family: "Birthstone", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Birthstone-Bounce": { family: "Birthstone Bounce", category: "handwriting", variants: ["regular", "500"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Biryani: { family: "Biryani", category: "sans-serif", variants: ["200", "300", "regular", "600", "700", "800", "900"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Bitter: { family: "Bitter", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Black-And-White-Picture": { family: "Black And White Picture", category: "sans-serif", variants: ["regular"], subsets: ["korean", "latin"] },
                        "Black-Han-Sans": { family: "Black Han Sans", category: "sans-serif", variants: ["regular"], subsets: ["korean", "latin"] },
                        "Black-Ops-One": { family: "Black Ops One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Blinker: { family: "Blinker", category: "sans-serif", variants: ["100", "200", "300", "regular", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        "Bodoni-Moda": { family: "Bodoni Moda", category: "serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        Bokor: { family: "Bokor", category: "display", variants: ["regular"], subsets: ["khmer", "latin"] },
                        "Bona-Nova": { family: "Bona Nova", category: "serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "hebrew", "latin", "latin-ext", "vietnamese"] },
                        Bonbon: { family: "Bonbon", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Bonheur-Royale": { family: "Bonheur Royale", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Boogaloo: { family: "Boogaloo", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Bowlby-One": { family: "Bowlby One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Bowlby-One-SC": { family: "Bowlby One SC", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Brawler: { family: "Brawler", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Bree-Serif": { family: "Bree Serif", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Brygada-1918": { family: "Brygada 1918", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"] },
                        "Bubblegum-Sans": { family: "Bubblegum Sans", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Bubbler-One": { family: "Bubbler One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Buda: { family: "Buda", category: "display", variants: ["300"], subsets: ["latin"] },
                        Buenard: { family: "Buenard", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Bungee: { family: "Bungee", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Bungee-Hairline": { family: "Bungee Hairline", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Bungee-Inline": { family: "Bungee Inline", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Bungee-Outline": { family: "Bungee Outline", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Bungee-Shade": { family: "Bungee Shade", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Butcherman: { family: "Butcherman", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Butterfly-Kids": { family: "Butterfly Kids", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Cabin: { family: "Cabin", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Cabin-Condensed": { family: "Cabin Condensed", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Cabin-Sketch": { family: "Cabin Sketch", category: "display", variants: ["regular", "700"], subsets: ["latin"] },
                        "Caesar-Dressing": { family: "Caesar Dressing", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Cagliostro: { family: "Cagliostro", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Cairo: { family: "Cairo", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["arabic", "latin", "latin-ext"] },
                        Caladea: { family: "Caladea", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Calistoga: { family: "Calistoga", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Calligraffitti: { family: "Calligraffitti", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Cambay: { family: "Cambay", category: "sans-serif", variants: ["regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Cambo: { family: "Cambo", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Candal: { family: "Candal", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Cantarell: { family: "Cantarell", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin"] },
                        "Cantata-One": { family: "Cantata One", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Cantora-One": { family: "Cantora One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Capriola: { family: "Capriola", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Caramel: { family: "Caramel", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Carattere: { family: "Carattere", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Cardo: { family: "Cardo", category: "serif", variants: ["regular", "700"], subsets: ["greek", "greek-ext", "latin", "latin-ext"] },
                        Carme: { family: "Carme", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Carrois-Gothic": { family: "Carrois Gothic", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Carrois-Gothic-SC": { family: "Carrois Gothic SC", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Carter-One": { family: "Carter One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Castoro: { family: "Castoro", category: "serif", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        Catamaran: { family: "Catamaran", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "tamil"] },
                        Caudex: { family: "Caudex", category: "serif", variants: ["regular", "700"], subsets: ["greek", "greek-ext", "latin", "latin-ext"] },
                        Caveat: { family: "Caveat", category: "handwriting", variants: ["regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        "Caveat-Brush": { family: "Caveat Brush", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Cedarville-Cursive": { family: "Cedarville Cursive", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Ceviche-One": { family: "Ceviche One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Chakra-Petch": { family: "Chakra Petch", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Changa: { family: "Changa", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["arabic", "latin", "latin-ext"] },
                        "Changa-One": { family: "Changa One", category: "display", variants: ["regular", "italic"], subsets: ["latin"] },
                        Chango: { family: "Chango", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Charm: { family: "Charm", category: "handwriting", variants: ["regular", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Charmonman: { family: "Charmonman", category: "handwriting", variants: ["regular", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Chathura: { family: "Chathura", category: "sans-serif", variants: ["100", "300", "regular", "700", "800"], subsets: ["latin", "telugu"] },
                        "Chau-Philomene-One": { family: "Chau Philomene One", category: "sans-serif", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        "Chela-One": { family: "Chela One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Chelsea-Market": { family: "Chelsea Market", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Chenla: { family: "Chenla", category: "display", variants: ["regular"], subsets: ["khmer"] },
                        Cherish: { family: "Cherish", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Cherry-Cream-Soda": { family: "Cherry Cream Soda", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Cherry-Swash": { family: "Cherry Swash", category: "display", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Chewy: { family: "Chewy", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Chicle: { family: "Chicle", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Chilanka: { family: "Chilanka", category: "handwriting", variants: ["regular"], subsets: ["latin", "malayalam"] },
                        Chivo: { family: "Chivo", category: "sans-serif", variants: ["300", "regular", "700", "900"], subsets: ["latin", "latin-ext"] },
                        Chonburi: { family: "Chonburi", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Cinzel: { family: "Cinzel", category: "serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        "Cinzel-Decorative": { family: "Cinzel Decorative", category: "display", variants: ["regular", "700", "900"], subsets: ["latin"] },
                        "Clicker-Script": { family: "Clicker Script", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Coda: { family: "Coda", category: "display", variants: ["regular", "800"], subsets: ["latin", "latin-ext"] },
                        "Coda-Caption": { family: "Coda Caption", category: "sans-serif", variants: ["800"], subsets: ["latin", "latin-ext"] },
                        Codystar: { family: "Codystar", category: "display", variants: ["300", "regular"], subsets: ["latin", "latin-ext"] },
                        Coiny: { family: "Coiny", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "tamil", "vietnamese"] },
                        Combo: { family: "Combo", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Comfortaa: { family: "Comfortaa", category: "display", variants: ["300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"] },
                        Comforter: { family: "Comforter", category: "handwriting", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"] },
                        "Comforter-Brush": { family: "Comforter Brush", category: "handwriting", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"] },
                        "Comic-Neue": { family: "Comic Neue", category: "handwriting", variants: ["300", "regular", "700"], subsets: ["latin"] },
                        "Coming-Soon": { family: "Coming Soon", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Commissioner: {
                            family: "Commissioner",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"],
                        },
                        "Concert-One": { family: "Concert One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Condiment: { family: "Condiment", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Content: { family: "Content", category: "display", variants: ["regular", "700"], subsets: ["khmer"] },
                        "Contrail-One": { family: "Contrail One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Convergence: { family: "Convergence", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Cookie: { family: "Cookie", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Copse: { family: "Copse", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Corben: { family: "Corben", category: "display", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Cormorant: { family: "Cormorant", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Cormorant-Garamond": { family: "Cormorant Garamond", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Cormorant-Infant": { family: "Cormorant Infant", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Cormorant-SC": { family: "Cormorant SC", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Cormorant-Unicase": { family: "Cormorant Unicase", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Cormorant-Upright": { family: "Cormorant Upright", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Courgette: { family: "Courgette", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Courier-Prime": { family: "Courier Prime", category: "monospace", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Cousine: { family: "Cousine", category: "monospace", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "hebrew", "latin", "latin-ext", "vietnamese"] },
                        Coustard: { family: "Coustard", category: "serif", variants: ["regular", "900"], subsets: ["latin"] },
                        "Covered-By-Your-Grace": { family: "Covered By Your Grace", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Crafty-Girls": { family: "Crafty Girls", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Creepster: { family: "Creepster", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Crete-Round": { family: "Crete Round", category: "serif", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        "Crimson-Pro": { family: "Crimson Pro", category: "serif", variants: ["200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Crimson-Text": { family: "Crimson Text", category: "serif", variants: ["regular", "600", "700"], subsets: ["latin"] },
                        "Croissant-One": { family: "Croissant One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Crushed: { family: "Crushed", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Cuprum: { family: "Cuprum", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Cute-Font": { family: "Cute Font", category: "display", variants: ["regular"], subsets: ["korean", "latin"] },
                        Cutive: { family: "Cutive", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Cutive-Mono": { family: "Cutive Mono", category: "monospace", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "DM-Mono": { family: "DM Mono", category: "monospace", variants: ["300", "regular", "500"], subsets: ["latin", "latin-ext"] },
                        "DM-Sans": { family: "DM Sans", category: "sans-serif", variants: ["regular", "500", "700"], subsets: ["latin", "latin-ext"] },
                        "DM-Serif-Display": { family: "DM Serif Display", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "DM-Serif-Text": { family: "DM Serif Text", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Damion: { family: "Damion", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Dancing-Script": { family: "Dancing Script", category: "handwriting", variants: ["regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Dangrek: { family: "Dangrek", category: "display", variants: ["regular"], subsets: ["khmer", "latin"] },
                        "Darker-Grotesque": { family: "Darker Grotesque", category: "sans-serif", variants: ["300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "David-Libre": { family: "David Libre", category: "serif", variants: ["regular", "500", "700"], subsets: ["hebrew", "latin", "latin-ext", "vietnamese"] },
                        "Dawning-of-a-New-Day": { family: "Dawning of a New Day", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Days-One": { family: "Days One", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Dekko: { family: "Dekko", category: "handwriting", variants: ["regular"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Dela-Gothic-One": { family: "Dela Gothic One", category: "display", variants: ["regular"], subsets: ["cyrillic", "greek", "japanese", "latin", "latin-ext", "vietnamese"] },
                        Delius: { family: "Delius", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Delius-Swash-Caps": { family: "Delius Swash Caps", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Delius-Unicase": { family: "Delius Unicase", category: "handwriting", variants: ["regular", "700"], subsets: ["latin"] },
                        "Della-Respira": { family: "Della Respira", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Denk-One": { family: "Denk One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Devonshire: { family: "Devonshire", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Dhurjati: { family: "Dhurjati", category: "sans-serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        "Didact-Gothic": { family: "Didact Gothic", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext"] },
                        Diplomata: { family: "Diplomata", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Diplomata-SC": { family: "Diplomata SC", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Do-Hyeon": { family: "Do Hyeon", category: "sans-serif", variants: ["regular"], subsets: ["korean", "latin"] },
                        Dokdo: { family: "Dokdo", category: "handwriting", variants: ["regular"], subsets: ["korean", "latin"] },
                        Domine: { family: "Domine", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["latin", "latin-ext"] },
                        "Donegal-One": { family: "Donegal One", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Dongle: { family: "Dongle", category: "sans-serif", variants: ["300", "regular", "700"], subsets: ["korean", "latin", "latin-ext", "vietnamese"] },
                        "Doppio-One": { family: "Doppio One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Dorsa: { family: "Dorsa", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Dosis: { family: "Dosis", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        DotGothic16: { family: "DotGothic16", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Dr-Sugiyama": { family: "Dr Sugiyama", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Duru-Sans": { family: "Duru Sans", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Dynalight: { family: "Dynalight", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "EB-Garamond": { family: "EB Garamond", category: "serif", variants: ["regular", "500", "600", "700", "800"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"] },
                        "Eagle-Lake": { family: "Eagle Lake", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "East-Sea-Dokdo": { family: "East Sea Dokdo", category: "handwriting", variants: ["regular"], subsets: ["korean", "latin"] },
                        Eater: { family: "Eater", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Economica: { family: "Economica", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Eczar: { family: "Eczar", category: "serif", variants: ["regular", "500", "600", "700", "800"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "El-Messiri": { family: "El Messiri", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["arabic", "cyrillic", "latin", "latin-ext"] },
                        Electrolize: { family: "Electrolize", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Elsie: { family: "Elsie", category: "display", variants: ["regular", "900"], subsets: ["latin", "latin-ext"] },
                        "Elsie-Swash-Caps": { family: "Elsie Swash Caps", category: "display", variants: ["regular", "900"], subsets: ["latin", "latin-ext"] },
                        "Emblema-One": { family: "Emblema One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Emilys-Candy": { family: "Emilys Candy", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Encode-Sans": { family: "Encode Sans", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Encode-Sans-Condensed": { family: "Encode Sans Condensed", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Encode-Sans-Expanded": { family: "Encode Sans Expanded", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Encode-Sans-SC": { family: "Encode Sans SC", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Encode-Sans-Semi-Condensed": {
                            family: "Encode Sans Semi Condensed",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["latin", "latin-ext", "vietnamese"],
                        },
                        "Encode-Sans-Semi-Expanded": {
                            family: "Encode Sans Semi Expanded",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["latin", "latin-ext", "vietnamese"],
                        },
                        Engagement: { family: "Engagement", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Englebert: { family: "Englebert", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Enriqueta: { family: "Enriqueta", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["latin", "latin-ext"] },
                        Ephesis: { family: "Ephesis", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Epilogue: { family: "Epilogue", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Erica-One": { family: "Erica One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Esteban: { family: "Esteban", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Estonia: { family: "Estonia", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Euphoria-Script": { family: "Euphoria Script", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Ewert: { family: "Ewert", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Exo: { family: "Exo", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Exo-2": { family: "Exo 2", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Expletus-Sans": { family: "Expletus Sans", category: "display", variants: ["regular", "500", "600", "700"], subsets: ["latin"] },
                        Explora: { family: "Explora", category: "handwriting", variants: ["regular"], subsets: ["cherokee", "latin", "latin-ext", "vietnamese"] },
                        Fahkwang: { family: "Fahkwang", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        "Fanwood-Text": { family: "Fanwood Text", category: "serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        Farro: { family: "Farro", category: "sans-serif", variants: ["300", "regular", "500", "700"], subsets: ["latin", "latin-ext"] },
                        Farsan: { family: "Farsan", category: "display", variants: ["regular"], subsets: ["gujarati", "latin", "latin-ext", "vietnamese"] },
                        Fascinate: { family: "Fascinate", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Fascinate-Inline": { family: "Fascinate Inline", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Faster-One": { family: "Faster One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Fasthand: { family: "Fasthand", category: "display", variants: ["regular"], subsets: ["khmer", "latin"] },
                        "Fauna-One": { family: "Fauna One", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Faustina: { family: "Faustina", category: "serif", variants: ["300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Federant: { family: "Federant", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Federo: { family: "Federo", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Felipa: { family: "Felipa", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Fenix: { family: "Fenix", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Festive: { family: "Festive", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Finger-Paint": { family: "Finger Paint", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Fira-Code": { family: "Fira Code", category: "monospace", variants: ["300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext"] },
                        "Fira-Mono": { family: "Fira Mono", category: "monospace", variants: ["regular", "500", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext"] },
                        "Fira-Sans": {
                            family: "Fira Sans",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Fira-Sans-Condensed": {
                            family: "Fira Sans Condensed",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Fira-Sans-Extra-Condensed": {
                            family: "Fira Sans Extra Condensed",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Fjalla-One": { family: "Fjalla One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Fjord-One": { family: "Fjord One", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Flamenco: { family: "Flamenco", category: "display", variants: ["300", "regular"], subsets: ["latin"] },
                        Flavors: { family: "Flavors", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Fleur-De-Leah": { family: "Fleur De Leah", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Flow-Block": { family: "Flow Block", category: "display", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Flow-Circular": { family: "Flow Circular", category: "display", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Flow-Rounded": { family: "Flow Rounded", category: "display", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        Fondamento: { family: "Fondamento", category: "handwriting", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        "Fontdiner-Swanky": { family: "Fontdiner Swanky", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Forum: { family: "Forum", category: "display", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        "Francois-One": { family: "Francois One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Frank-Ruhl-Libre": { family: "Frank Ruhl Libre", category: "serif", variants: ["300", "regular", "500", "700", "900"], subsets: ["hebrew", "latin", "latin-ext"] },
                        Fraunces: { family: "Fraunces", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Freckle-Face": { family: "Freckle Face", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Fredericka-the-Great": { family: "Fredericka the Great", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Fredoka-One": { family: "Fredoka One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Freehand: { family: "Freehand", category: "display", variants: ["regular"], subsets: ["khmer", "latin"] },
                        Fresca: { family: "Fresca", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Frijole: { family: "Frijole", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Fruktur: { family: "Fruktur", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Fugaz-One": { family: "Fugaz One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Fuggles: { family: "Fuggles", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "GFS-Didot": { family: "GFS Didot", category: "serif", variants: ["regular"], subsets: ["greek"] },
                        "GFS-Neohellenic": { family: "GFS Neohellenic", category: "sans-serif", variants: ["regular", "700"], subsets: ["greek"] },
                        Gabriela: { family: "Gabriela", category: "serif", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin"] },
                        Gaegu: { family: "Gaegu", category: "handwriting", variants: ["300", "regular", "700"], subsets: ["korean", "latin"] },
                        Gafata: { family: "Gafata", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Galada: { family: "Galada", category: "display", variants: ["regular"], subsets: ["bengali", "latin"] },
                        Galdeano: { family: "Galdeano", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Galindo: { family: "Galindo", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Gamja-Flower": { family: "Gamja Flower", category: "handwriting", variants: ["regular"], subsets: ["korean", "latin"] },
                        Gayathri: { family: "Gayathri", category: "sans-serif", variants: ["100", "regular", "700"], subsets: ["latin", "malayalam"] },
                        Gelasio: { family: "Gelasio", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Gemunu-Libre": { family: "Gemunu Libre", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "sinhala"] },
                        Genos: { family: "Genos", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["cherokee", "latin", "latin-ext", "vietnamese"] },
                        "Gentium-Basic": { family: "Gentium Basic", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Gentium-Book-Basic": { family: "Gentium Book Basic", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Geo: { family: "Geo", category: "sans-serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        Georama: { family: "Georama", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Geostar: { family: "Geostar", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Geostar-Fill": { family: "Geostar Fill", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Germania-One": { family: "Germania One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Gideon-Roman": { family: "Gideon Roman", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Gidugu: { family: "Gidugu", category: "sans-serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        "Gilda-Display": { family: "Gilda Display", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Girassol: { family: "Girassol", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Give-You-Glory": { family: "Give You Glory", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Glass-Antiqua": { family: "Glass Antiqua", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Glegoo: { family: "Glegoo", category: "serif", variants: ["regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Gloria-Hallelujah": { family: "Gloria Hallelujah", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Glory: { family: "Glory", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Gluten: { family: "Gluten", category: "display", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Goblin-One": { family: "Goblin One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Gochi-Hand": { family: "Gochi Hand", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Goldman: { family: "Goldman", category: "display", variants: ["regular", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Gorditas: { family: "Gorditas", category: "display", variants: ["regular", "700"], subsets: ["latin"] },
                        "Gothic-A1": { family: "Gothic A1", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["korean", "latin"] },
                        Gotu: { family: "Gotu", category: "sans-serif", variants: ["regular"], subsets: ["devanagari", "latin", "latin-ext", "vietnamese"] },
                        "Goudy-Bookletter-1911": { family: "Goudy Bookletter 1911", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Gowun-Batang": { family: "Gowun Batang", category: "serif", variants: ["regular", "700"], subsets: ["korean", "latin", "latin-ext", "vietnamese"] },
                        "Gowun-Dodum": { family: "Gowun Dodum", category: "sans-serif", variants: ["regular"], subsets: ["korean", "latin", "latin-ext", "vietnamese"] },
                        Graduate: { family: "Graduate", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Grand-Hotel": { family: "Grand Hotel", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Grandstander: { family: "Grandstander", category: "display", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Gravitas-One": { family: "Gravitas One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Great-Vibes": { family: "Great Vibes", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Grechen-Fuemen": { family: "Grechen Fuemen", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Grenze: { family: "Grenze", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Grenze-Gotisch": { family: "Grenze Gotisch", category: "display", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Grey-Qo": { family: "Grey Qo", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Griffy: { family: "Griffy", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Gruppo: { family: "Gruppo", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Gudea: { family: "Gudea", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Gugi: { family: "Gugi", category: "display", variants: ["regular"], subsets: ["korean", "latin"] },
                        Gupter: { family: "Gupter", category: "serif", variants: ["regular", "500", "700"], subsets: ["latin"] },
                        Gurajada: { family: "Gurajada", category: "serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Habibi: { family: "Habibi", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Hachi-Maru-Pop": { family: "Hachi Maru Pop", category: "handwriting", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        Hahmlet: { family: "Hahmlet", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["korean", "latin", "latin-ext", "vietnamese"] },
                        Halant: { family: "Halant", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Hammersmith-One": { family: "Hammersmith One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Hanalei: { family: "Hanalei", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Hanalei-Fill": { family: "Hanalei Fill", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Handlee: { family: "Handlee", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Hanuman: { family: "Hanuman", category: "serif", variants: ["100", "300", "regular", "700", "900"], subsets: ["khmer", "latin"] },
                        "Happy-Monkey": { family: "Happy Monkey", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Harmattan: { family: "Harmattan", category: "sans-serif", variants: ["regular", "700"], subsets: ["arabic", "latin", "latin-ext"] },
                        "Headland-One": { family: "Headland One", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Heebo: { family: "Heebo", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["hebrew", "latin"] },
                        "Henny-Penny": { family: "Henny Penny", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Hepta-Slab": { family: "Hepta Slab", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Herr-Von-Muellerhoff": { family: "Herr Von Muellerhoff", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Hi-Melody": { family: "Hi Melody", category: "handwriting", variants: ["regular"], subsets: ["korean", "latin"] },
                        "Hina-Mincho": { family: "Hina Mincho", category: "serif", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext", "vietnamese"] },
                        Hind: { family: "Hind", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Hind-Guntur": { family: "Hind Guntur", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "telugu"] },
                        "Hind-Madurai": { family: "Hind Madurai", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "tamil"] },
                        "Hind-Siliguri": { family: "Hind Siliguri", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["bengali", "latin", "latin-ext"] },
                        "Hind-Vadodara": { family: "Hind Vadodara", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["gujarati", "latin", "latin-ext"] },
                        "Holtwood-One-SC": { family: "Holtwood One SC", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Homemade-Apple": { family: "Homemade Apple", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Homenaje: { family: "Homenaje", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Hurricane: { family: "Hurricane", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "IBM-Plex-Mono": { family: "IBM Plex Mono", category: "monospace", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "IBM-Plex-Sans": {
                            family: "IBM Plex Sans",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"],
                        },
                        "IBM-Plex-Sans-Arabic": { family: "IBM Plex Sans Arabic", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["arabic", "cyrillic-ext", "latin", "latin-ext"] },
                        "IBM-Plex-Sans-Condensed": {
                            family: "IBM Plex Sans Condensed",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700"],
                            subsets: ["cyrillic-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "IBM-Plex-Sans-Devanagari": {
                            family: "IBM Plex Sans Devanagari",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700"],
                            subsets: ["cyrillic-ext", "devanagari", "latin", "latin-ext"],
                        },
                        "IBM-Plex-Sans-Hebrew": { family: "IBM Plex Sans Hebrew", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["cyrillic-ext", "hebrew", "latin", "latin-ext"] },
                        "IBM-Plex-Sans-KR": { family: "IBM Plex Sans KR", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["korean", "latin", "latin-ext"] },
                        "IBM-Plex-Sans-Thai": { family: "IBM Plex Sans Thai", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["cyrillic-ext", "latin", "latin-ext", "thai"] },
                        "IBM-Plex-Sans-Thai-Looped": { family: "IBM Plex Sans Thai Looped", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["cyrillic-ext", "latin", "latin-ext", "thai"] },
                        "IBM-Plex-Serif": { family: "IBM Plex Serif", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "IM-Fell-DW-Pica": { family: "IM Fell DW Pica", category: "serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        "IM-Fell-DW-Pica-SC": { family: "IM Fell DW Pica SC", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "IM-Fell-Double-Pica": { family: "IM Fell Double Pica", category: "serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        "IM-Fell-Double-Pica-SC": { family: "IM Fell Double Pica SC", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "IM-Fell-English": { family: "IM Fell English", category: "serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        "IM-Fell-English-SC": { family: "IM Fell English SC", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "IM-Fell-French-Canon": { family: "IM Fell French Canon", category: "serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        "IM-Fell-French-Canon-SC": { family: "IM Fell French Canon SC", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "IM-Fell-Great-Primer": { family: "IM Fell Great Primer", category: "serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        "IM-Fell-Great-Primer-SC": { family: "IM Fell Great Primer SC", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Ibarra-Real-Nova": { family: "Ibarra Real Nova", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["latin", "latin-ext"] },
                        Iceberg: { family: "Iceberg", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Iceland: { family: "Iceland", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Imbue: { family: "Imbue", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Imprima: { family: "Imprima", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Inconsolata: { family: "Inconsolata", category: "monospace", variants: ["200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Inder: { family: "Inder", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Indie-Flower": { family: "Indie Flower", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Inika: { family: "Inika", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Inknut-Antiqua": { family: "Inknut Antiqua", category: "serif", variants: ["300", "regular", "500", "600", "700", "800", "900"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Inria-Sans": { family: "Inria Sans", category: "sans-serif", variants: ["300", "regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Inria-Serif": { family: "Inria Serif", category: "serif", variants: ["300", "regular", "700"], subsets: ["latin", "latin-ext"] },
                        Inter: {
                            family: "Inter",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Irish-Grover": { family: "Irish Grover", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Istok-Web": { family: "Istok Web", category: "sans-serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        Italiana: { family: "Italiana", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Italianno: { family: "Italianno", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Itim: { family: "Itim", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        "Jacques-Francois": { family: "Jacques Francois", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Jacques-Francois-Shadow": { family: "Jacques Francois Shadow", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Jaldi: { family: "Jaldi", category: "sans-serif", variants: ["regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "JetBrains-Mono": {
                            family: "JetBrains Mono",
                            category: "monospace",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"],
                        },
                        "Jim-Nightshade": { family: "Jim Nightshade", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Jockey-One": { family: "Jockey One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Jolly-Lodger": { family: "Jolly Lodger", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Jomhuria: { family: "Jomhuria", category: "display", variants: ["regular"], subsets: ["arabic", "latin", "latin-ext"] },
                        Jomolhari: { family: "Jomolhari", category: "serif", variants: ["regular"], subsets: ["latin", "tibetan"] },
                        "Josefin-Sans": { family: "Josefin Sans", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Josefin-Slab": { family: "Josefin Slab", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["latin"] },
                        Jost: { family: "Jost", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        "Joti-One": { family: "Joti One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Jua: { family: "Jua", category: "sans-serif", variants: ["regular"], subsets: ["korean", "latin"] },
                        Judson: { family: "Judson", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Julee: { family: "Julee", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Julius-Sans-One": { family: "Julius Sans One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Junge: { family: "Junge", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Jura: { family: "Jura", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "kayah-li", "latin", "latin-ext", "vietnamese"] },
                        "Just-Another-Hand": { family: "Just Another Hand", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Just-Me-Again-Down-Here": { family: "Just Me Again Down Here", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        K2D: { family: "K2D", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Kadwa: { family: "Kadwa", category: "serif", variants: ["regular", "700"], subsets: ["devanagari", "latin"] },
                        "Kaisei-Decol": { family: "Kaisei Decol", category: "serif", variants: ["regular", "500", "700"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Kaisei-HarunoUmi": { family: "Kaisei HarunoUmi", category: "serif", variants: ["regular", "500", "700"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Kaisei-Opti": { family: "Kaisei Opti", category: "serif", variants: ["regular", "500", "700"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Kaisei-Tokumin": { family: "Kaisei Tokumin", category: "serif", variants: ["regular", "500", "700", "800"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        Kalam: { family: "Kalam", category: "handwriting", variants: ["300", "regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Kameron: { family: "Kameron", category: "serif", variants: ["regular", "700"], subsets: ["latin"] },
                        Kanit: { family: "Kanit", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Kantumruy: { family: "Kantumruy", category: "sans-serif", variants: ["300", "regular", "700"], subsets: ["khmer"] },
                        Karantina: { family: "Karantina", category: "display", variants: ["300", "regular", "700"], subsets: ["hebrew", "latin", "latin-ext"] },
                        Karla: { family: "Karla", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext"] },
                        Karma: { family: "Karma", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Katibeh: { family: "Katibeh", category: "display", variants: ["regular"], subsets: ["arabic", "latin", "latin-ext"] },
                        "Kaushan-Script": { family: "Kaushan Script", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Kavivanar: { family: "Kavivanar", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "tamil"] },
                        Kavoon: { family: "Kavoon", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Kdam-Thmor": { family: "Kdam Thmor", category: "display", variants: ["regular"], subsets: ["khmer"] },
                        "Keania-One": { family: "Keania One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Kelly-Slab": { family: "Kelly Slab", category: "display", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        Kenia: { family: "Kenia", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Khand: { family: "Khand", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Khmer: { family: "Khmer", category: "display", variants: ["regular"], subsets: ["khmer"] },
                        Khula: { family: "Khula", category: "sans-serif", variants: ["300", "regular", "600", "700", "800"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Kings: { family: "Kings", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Kirang-Haerang": { family: "Kirang Haerang", category: "display", variants: ["regular"], subsets: ["korean", "latin"] },
                        "Kite-One": { family: "Kite One", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Kiwi-Maru": { family: "Kiwi Maru", category: "serif", variants: ["300", "regular", "500"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Klee-One": { family: "Klee One", category: "handwriting", variants: ["regular", "600"], subsets: ["cyrillic", "greek-ext", "japanese", "latin", "latin-ext"] },
                        Knewave: { family: "Knewave", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        KoHo: { family: "KoHo", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Kodchasan: { family: "Kodchasan", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        "Koh-Santepheap": { family: "Koh Santepheap", category: "display", variants: ["100", "300", "regular", "700", "900"], subsets: ["khmer", "latin"] },
                        Kosugi: { family: "Kosugi", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Kosugi-Maru": { family: "Kosugi Maru", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Kotta-One": { family: "Kotta One", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Koulen: { family: "Koulen", category: "display", variants: ["regular"], subsets: ["khmer", "latin"] },
                        Kranky: { family: "Kranky", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Kreon: { family: "Kreon", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext"] },
                        Kristi: { family: "Kristi", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Krona-One": { family: "Krona One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Krub: { family: "Krub", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Kufam: { family: "Kufam", category: "sans-serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["arabic", "latin", "latin-ext", "vietnamese"] },
                        "Kulim-Park": { family: "Kulim Park", category: "sans-serif", variants: ["200", "300", "regular", "600", "700"], subsets: ["latin", "latin-ext"] },
                        "Kumar-One": { family: "Kumar One", category: "display", variants: ["regular"], subsets: ["gujarati", "latin", "latin-ext"] },
                        "Kumar-One-Outline": { family: "Kumar One Outline", category: "display", variants: ["regular"], subsets: ["gujarati", "latin", "latin-ext"] },
                        "Kumbh-Sans": { family: "Kumbh Sans", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        Kurale: { family: "Kurale", category: "serif", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "devanagari", "latin", "latin-ext"] },
                        "La-Belle-Aurore": { family: "La Belle Aurore", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Lacquer: { family: "Lacquer", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Laila: { family: "Laila", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Lakki-Reddy": { family: "Lakki Reddy", category: "handwriting", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Lalezar: { family: "Lalezar", category: "display", variants: ["regular"], subsets: ["arabic", "latin", "latin-ext", "vietnamese"] },
                        Lancelot: { family: "Lancelot", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Langar: { family: "Langar", category: "display", variants: ["regular"], subsets: ["gurmukhi", "latin", "latin-ext"] },
                        Lateef: { family: "Lateef", category: "handwriting", variants: ["regular"], subsets: ["arabic", "latin"] },
                        Lato: { family: "Lato", category: "sans-serif", variants: ["100", "300", "regular", "700", "900"], subsets: ["latin", "latin-ext"] },
                        "League-Script": { family: "League Script", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Leckerli-One": { family: "Leckerli One", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Ledger: { family: "Ledger", category: "serif", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        Lekton: { family: "Lekton", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Lemon: { family: "Lemon", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Lemonada: { family: "Lemonada", category: "display", variants: ["300", "regular", "500", "600", "700"], subsets: ["arabic", "latin", "latin-ext", "vietnamese"] },
                        Lexend: { family: "Lexend", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Lexend-Deca": { family: "Lexend Deca", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Lexend-Exa": { family: "Lexend Exa", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Lexend-Giga": { family: "Lexend Giga", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Lexend-Mega": { family: "Lexend Mega", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Lexend-Peta": { family: "Lexend Peta", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Lexend-Tera": { family: "Lexend Tera", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Lexend-Zetta": { family: "Lexend Zetta", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Libre-Barcode-128": { family: "Libre Barcode 128", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Libre-Barcode-128-Text": { family: "Libre Barcode 128 Text", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Libre-Barcode-39": { family: "Libre Barcode 39", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Libre-Barcode-39-Extended": { family: "Libre Barcode 39 Extended", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Libre-Barcode-39-Extended-Text": { family: "Libre Barcode 39 Extended Text", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Libre-Barcode-39-Text": { family: "Libre Barcode 39 Text", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Libre-Barcode-EAN13-Text": { family: "Libre Barcode EAN13 Text", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Libre-Baskerville": { family: "Libre Baskerville", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Libre-Caslon-Display": { family: "Libre Caslon Display", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Libre-Caslon-Text": { family: "Libre Caslon Text", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Libre-Franklin": { family: "Libre Franklin", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Life-Savers": { family: "Life Savers", category: "display", variants: ["regular", "700", "800"], subsets: ["latin", "latin-ext"] },
                        "Lilita-One": { family: "Lilita One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Lily-Script-One": { family: "Lily Script One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Limelight: { family: "Limelight", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Linden-Hill": { family: "Linden Hill", category: "serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        Literata: {
                            family: "Literata",
                            category: "serif",
                            variants: ["200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Liu-Jian-Mao-Cao": { family: "Liu Jian Mao Cao", category: "handwriting", variants: ["regular"], subsets: ["chinese-simplified", "latin"] },
                        Livvic: { family: "Livvic", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Lobster: { family: "Lobster", category: "display", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Lobster-Two": { family: "Lobster Two", category: "display", variants: ["regular", "700"], subsets: ["latin"] },
                        "Londrina-Outline": { family: "Londrina Outline", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Londrina-Shadow": { family: "Londrina Shadow", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Londrina-Sketch": { family: "Londrina Sketch", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Londrina-Solid": { family: "Londrina Solid", category: "display", variants: ["100", "300", "regular", "900"], subsets: ["latin"] },
                        "Long-Cang": { family: "Long Cang", category: "handwriting", variants: ["regular"], subsets: ["chinese-simplified", "latin"] },
                        Lora: { family: "Lora", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Love-Ya-Like-A-Sister": { family: "Love Ya Like A Sister", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Loved-by-the-King": { family: "Loved by the King", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Lovers-Quarrel": { family: "Lovers Quarrel", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Luckiest-Guy": { family: "Luckiest Guy", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Lusitana: { family: "Lusitana", category: "serif", variants: ["regular", "700"], subsets: ["latin"] },
                        Lustria: { family: "Lustria", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "M-PLUS-1": { family: "M PLUS 1", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["japanese", "latin", "latin-ext", "vietnamese"] },
                        "M-PLUS-1-Code": { family: "M PLUS 1 Code", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["japanese", "latin", "latin-ext", "vietnamese"] },
                        "M-PLUS-1p": {
                            family: "M PLUS 1p",
                            category: "sans-serif",
                            variants: ["100", "300", "regular", "500", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "hebrew", "japanese", "latin", "latin-ext", "vietnamese"],
                        },
                        "M-PLUS-2": { family: "M PLUS 2", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["japanese", "latin", "latin-ext", "vietnamese"] },
                        "M-PLUS-Code-Latin": { family: "M PLUS Code Latin", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "M-PLUS-Rounded-1c": {
                            family: "M PLUS Rounded 1c",
                            category: "sans-serif",
                            variants: ["100", "300", "regular", "500", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "hebrew", "japanese", "latin", "latin-ext", "vietnamese"],
                        },
                        "Ma-Shan-Zheng": { family: "Ma Shan Zheng", category: "handwriting", variants: ["regular"], subsets: ["chinese-simplified", "latin"] },
                        Macondo: { family: "Macondo", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Macondo-Swash-Caps": { family: "Macondo Swash Caps", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Mada: { family: "Mada", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "900"], subsets: ["arabic", "latin"] },
                        Magra: { family: "Magra", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Maiden-Orange": { family: "Maiden Orange", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Maitree: { family: "Maitree", category: "serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        "Major-Mono-Display": { family: "Major Mono Display", category: "monospace", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Mako: { family: "Mako", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Mali: { family: "Mali", category: "handwriting", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Mallanna: { family: "Mallanna", category: "sans-serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Mandali: { family: "Mandali", category: "sans-serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Manjari: { family: "Manjari", category: "sans-serif", variants: ["100", "regular", "700"], subsets: ["latin", "latin-ext", "malayalam"] },
                        Manrope: { family: "Manrope", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"] },
                        Mansalva: { family: "Mansalva", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Manuale: { family: "Manuale", category: "serif", variants: ["300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Marcellus: { family: "Marcellus", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Marcellus-SC": { family: "Marcellus SC", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Marck-Script": { family: "Marck Script", category: "handwriting", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        Margarine: { family: "Margarine", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Markazi-Text": { family: "Markazi Text", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["arabic", "latin", "latin-ext", "vietnamese"] },
                        "Marko-One": { family: "Marko One", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Marmelad: { family: "Marmelad", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        Martel: { family: "Martel", category: "serif", variants: ["200", "300", "regular", "600", "700", "800", "900"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Martel-Sans": { family: "Martel Sans", category: "sans-serif", variants: ["200", "300", "regular", "600", "700", "800", "900"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Marvel: { family: "Marvel", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin"] },
                        Mate: { family: "Mate", category: "serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        "Mate-SC": { family: "Mate SC", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Maven-Pro": { family: "Maven Pro", category: "sans-serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        McLaren: { family: "McLaren", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Meddon: { family: "Meddon", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        MedievalSharp: { family: "MedievalSharp", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Medula-One": { family: "Medula One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Meera-Inimai": { family: "Meera Inimai", category: "sans-serif", variants: ["regular"], subsets: ["latin", "tamil"] },
                        Megrim: { family: "Megrim", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Meie-Script": { family: "Meie Script", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Merienda: { family: "Merienda", category: "handwriting", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Merienda-One": { family: "Merienda One", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Merriweather: { family: "Merriweather", category: "serif", variants: ["300", "regular", "700", "900"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Merriweather-Sans": { family: "Merriweather Sans", category: "sans-serif", variants: ["300", "regular", "500", "600", "700", "800"], subsets: ["cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        Metal: { family: "Metal", category: "display", variants: ["regular"], subsets: ["khmer", "latin"] },
                        "Metal-Mania": { family: "Metal Mania", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Metamorphous: { family: "Metamorphous", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Metrophobic: { family: "Metrophobic", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Michroma: { family: "Michroma", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Milonga: { family: "Milonga", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Miltonian: { family: "Miltonian", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Miltonian-Tattoo": { family: "Miltonian Tattoo", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Mina: { family: "Mina", category: "sans-serif", variants: ["regular", "700"], subsets: ["bengali", "latin", "latin-ext"] },
                        Miniver: { family: "Miniver", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Miriam-Libre": { family: "Miriam Libre", category: "sans-serif", variants: ["regular", "700"], subsets: ["hebrew", "latin", "latin-ext"] },
                        Mirza: { family: "Mirza", category: "display", variants: ["regular", "500", "600", "700"], subsets: ["arabic", "latin", "latin-ext"] },
                        "Miss-Fajardose": { family: "Miss Fajardose", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Mitr: { family: "Mitr", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        "Mochiy-Pop-One": { family: "Mochiy Pop One", category: "sans-serif", variants: ["regular"], subsets: ["japanese", "latin"] },
                        "Mochiy-Pop-P-One": { family: "Mochiy Pop P One", category: "sans-serif", variants: ["regular"], subsets: ["japanese", "latin"] },
                        Modak: { family: "Modak", category: "display", variants: ["regular"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Modern-Antiqua": { family: "Modern Antiqua", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Mogra: { family: "Mogra", category: "display", variants: ["regular"], subsets: ["gujarati", "latin", "latin-ext"] },
                        Mohave: { family: "Mohave", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext"] },
                        Molengo: { family: "Molengo", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Molle: { family: "Molle", category: "handwriting", variants: ["italic"], subsets: ["latin", "latin-ext"] },
                        Monda: { family: "Monda", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Monofett: { family: "Monofett", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Monoton: { family: "Monoton", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Monsieur-La-Doulaise": { family: "Monsieur La Doulaise", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Montaga: { family: "Montaga", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Montagu-Slab": { family: "Montagu Slab", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        MonteCarlo: { family: "MonteCarlo", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Montez: { family: "Montez", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Montserrat: { family: "Montserrat", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Montserrat-Alternates": {
                            family: "Montserrat Alternates",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Montserrat-Subrayada": { family: "Montserrat Subrayada", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin"] },
                        Moul: { family: "Moul", category: "display", variants: ["regular"], subsets: ["khmer", "latin"] },
                        Moulpali: { family: "Moulpali", category: "display", variants: ["regular"], subsets: ["khmer", "latin"] },
                        "Mountains-of-Christmas": { family: "Mountains of Christmas", category: "display", variants: ["regular", "700"], subsets: ["latin"] },
                        "Mouse-Memoirs": { family: "Mouse Memoirs", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Mr-Bedfort": { family: "Mr Bedfort", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Mr-Dafoe": { family: "Mr Dafoe", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Mr-De-Haviland": { family: "Mr De Haviland", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Mrs-Saint-Delafield": { family: "Mrs Saint Delafield", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Mrs-Sheppards": { family: "Mrs Sheppards", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Mukta: { family: "Mukta", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Mukta-Mahee": { family: "Mukta Mahee", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["gurmukhi", "latin", "latin-ext"] },
                        "Mukta-Malar": { family: "Mukta Malar", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "tamil"] },
                        "Mukta-Vaani": { family: "Mukta Vaani", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["gujarati", "latin", "latin-ext"] },
                        Mulish: { family: "Mulish", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        MuseoModerno: { family: "MuseoModerno", category: "display", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Mystery-Quest": { family: "Mystery Quest", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        NTR: { family: "NTR", category: "sans-serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        "Nanum-Brush-Script": { family: "Nanum Brush Script", category: "handwriting", variants: ["regular"], subsets: ["korean", "latin"] },
                        "Nanum-Gothic": { family: "Nanum Gothic", category: "sans-serif", variants: ["regular", "700", "800"], subsets: ["korean", "latin"] },
                        "Nanum-Gothic-Coding": { family: "Nanum Gothic Coding", category: "monospace", variants: ["regular", "700"], subsets: ["korean", "latin"] },
                        "Nanum-Myeongjo": { family: "Nanum Myeongjo", category: "serif", variants: ["regular", "700", "800"], subsets: ["korean", "latin"] },
                        "Nanum-Pen-Script": { family: "Nanum Pen Script", category: "handwriting", variants: ["regular"], subsets: ["korean", "latin"] },
                        "Nerko-One": { family: "Nerko One", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Neucha: { family: "Neucha", category: "handwriting", variants: ["regular"], subsets: ["cyrillic", "latin"] },
                        Neuton: { family: "Neuton", category: "serif", variants: ["200", "300", "regular", "700", "800"], subsets: ["latin", "latin-ext"] },
                        "New-Rocker": { family: "New Rocker", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "New-Tegomin": { family: "New Tegomin", category: "serif", variants: ["regular"], subsets: ["japanese", "latin", "latin-ext"] },
                        "News-Cycle": { family: "News Cycle", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Newsreader: { family: "Newsreader", category: "serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Niconne: { family: "Niconne", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Niramit: { family: "Niramit", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        "Nixie-One": { family: "Nixie One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Nobile: { family: "Nobile", category: "sans-serif", variants: ["regular", "500", "700"], subsets: ["latin", "latin-ext"] },
                        Nokora: { family: "Nokora", category: "serif", variants: ["regular", "700"], subsets: ["khmer"] },
                        Norican: { family: "Norican", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Nosifer: { family: "Nosifer", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Notable: { family: "Notable", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Nothing-You-Could-Do": { family: "Nothing You Could Do", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Noticia-Text": { family: "Noticia Text", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Noto-Kufi-Arabic": { family: "Noto Kufi Arabic", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["arabic"] },
                        "Noto-Music": { family: "Noto Music", category: "sans-serif", variants: ["regular"], subsets: ["music"] },
                        "Noto-Naskh-Arabic": { family: "Noto Naskh Arabic", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["arabic"] },
                        "Noto-Nastaliq-Urdu": { family: "Noto Nastaliq Urdu", category: "serif", variants: ["regular", "700"], subsets: ["arabic"] },
                        "Noto-Rashi-Hebrew": { family: "Noto Rashi Hebrew", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["hebrew"] },
                        "Noto-Sans": { family: "Noto Sans", category: "sans-serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "devanagari", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"] },
                        "Noto-Sans-Adlam": { family: "Noto Sans Adlam", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["adlam"] },
                        "Noto-Sans-Adlam-Unjoined": { family: "Noto Sans Adlam Unjoined", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["adlam"] },
                        "Noto-Sans-Anatolian-Hieroglyphs": { family: "Noto Sans Anatolian Hieroglyphs", category: "sans-serif", variants: ["regular"], subsets: ["anatolian-hieroglyphs"] },
                        "Noto-Sans-Arabic": { family: "Noto Sans Arabic", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["arabic"] },
                        "Noto-Sans-Armenian": { family: "Noto Sans Armenian", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["armenian"] },
                        "Noto-Sans-Avestan": { family: "Noto Sans Avestan", category: "sans-serif", variants: ["regular"], subsets: ["avestan"] },
                        "Noto-Sans-Balinese": { family: "Noto Sans Balinese", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["balinese"] },
                        "Noto-Sans-Bamum": { family: "Noto Sans Bamum", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["bamum"] },
                        "Noto-Sans-Bassa-Vah": { family: "Noto Sans Bassa Vah", category: "sans-serif", variants: ["regular"], subsets: ["bassa-vah"] },
                        "Noto-Sans-Batak": { family: "Noto Sans Batak", category: "sans-serif", variants: ["regular"], subsets: ["batak"] },
                        "Noto-Sans-Bengali": { family: "Noto Sans Bengali", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["bengali"] },
                        "Noto-Sans-Bhaiksuki": { family: "Noto Sans Bhaiksuki", category: "sans-serif", variants: ["regular"], subsets: ["bhaiksuki"] },
                        "Noto-Sans-Brahmi": { family: "Noto Sans Brahmi", category: "sans-serif", variants: ["regular"], subsets: ["brahmi"] },
                        "Noto-Sans-Buginese": { family: "Noto Sans Buginese", category: "sans-serif", variants: ["regular"], subsets: ["buginese"] },
                        "Noto-Sans-Buhid": { family: "Noto Sans Buhid", category: "sans-serif", variants: ["regular"], subsets: ["buhid"] },
                        "Noto-Sans-Canadian-Aboriginal": { family: "Noto Sans Canadian Aboriginal", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["canadian-aboriginal"] },
                        "Noto-Sans-Carian": { family: "Noto Sans Carian", category: "sans-serif", variants: ["regular"], subsets: ["carian"] },
                        "Noto-Sans-Caucasian-Albanian": { family: "Noto Sans Caucasian Albanian", category: "sans-serif", variants: ["regular"], subsets: ["caucasian-albanian"] },
                        "Noto-Sans-Chakma": { family: "Noto Sans Chakma", category: "sans-serif", variants: ["regular"], subsets: ["chakma"] },
                        "Noto-Sans-Cham": { family: "Noto Sans Cham", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["cham"] },
                        "Noto-Sans-Cherokee": { family: "Noto Sans Cherokee", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["cherokee"] },
                        "Noto-Sans-Coptic": { family: "Noto Sans Coptic", category: "sans-serif", variants: ["regular"], subsets: ["coptic"] },
                        "Noto-Sans-Cuneiform": { family: "Noto Sans Cuneiform", category: "sans-serif", variants: ["regular"], subsets: ["cuneiform"] },
                        "Noto-Sans-Cypriot": { family: "Noto Sans Cypriot", category: "sans-serif", variants: ["regular"], subsets: ["cypriot"] },
                        "Noto-Sans-Deseret": { family: "Noto Sans Deseret", category: "sans-serif", variants: ["regular"], subsets: ["deseret"] },
                        "Noto-Sans-Devanagari": { family: "Noto Sans Devanagari", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["devanagari"] },
                        "Noto-Sans-Display": {
                            family: "Noto Sans Display",
                            category: "sans-serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Noto-Sans-Duployan": { family: "Noto Sans Duployan", category: "sans-serif", variants: ["regular"], subsets: ["duployan"] },
                        "Noto-Sans-Egyptian-Hieroglyphs": { family: "Noto Sans Egyptian Hieroglyphs", category: "sans-serif", variants: ["regular"], subsets: ["egyptian-hieroglyphs"] },
                        "Noto-Sans-Elbasan": { family: "Noto Sans Elbasan", category: "sans-serif", variants: ["regular"], subsets: ["elbasan"] },
                        "Noto-Sans-Elymaic": { family: "Noto Sans Elymaic", category: "sans-serif", variants: ["regular"], subsets: ["elymaic"] },
                        "Noto-Sans-Georgian": { family: "Noto Sans Georgian", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["georgian"] },
                        "Noto-Sans-Glagolitic": { family: "Noto Sans Glagolitic", category: "sans-serif", variants: ["regular"], subsets: ["glagolitic"] },
                        "Noto-Sans-Gothic": { family: "Noto Sans Gothic", category: "sans-serif", variants: ["regular"], subsets: ["gothic"] },
                        "Noto-Sans-Grantha": { family: "Noto Sans Grantha", category: "sans-serif", variants: ["regular"], subsets: ["grantha"] },
                        "Noto-Sans-Gujarati": { family: "Noto Sans Gujarati", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["gujarati"] },
                        "Noto-Sans-Gunjala-Gondi": { family: "Noto Sans Gunjala Gondi", category: "sans-serif", variants: ["regular"], subsets: ["gunjala-gondi"] },
                        "Noto-Sans-Gurmukhi": { family: "Noto Sans Gurmukhi", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["gurmukhi"] },
                        "Noto-Sans-HK": { family: "Noto Sans HK", category: "sans-serif", variants: ["100", "300", "regular", "500", "700", "900"], subsets: ["chinese-hongkong", "latin"] },
                        "Noto-Sans-Hanifi-Rohingya": { family: "Noto Sans Hanifi Rohingya", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["hanifi-rohingya"] },
                        "Noto-Sans-Hanunoo": { family: "Noto Sans Hanunoo", category: "sans-serif", variants: ["regular"], subsets: ["hanunoo"] },
                        "Noto-Sans-Hatran": { family: "Noto Sans Hatran", category: "sans-serif", variants: ["regular"], subsets: ["hatran"] },
                        "Noto-Sans-Hebrew": { family: "Noto Sans Hebrew", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["hebrew"] },
                        "Noto-Sans-Imperial-Aramaic": { family: "Noto Sans Imperial Aramaic", category: "sans-serif", variants: ["regular"], subsets: ["imperial-aramaic"] },
                        "Noto-Sans-Indic-Siyaq-Numbers": { family: "Noto Sans Indic Siyaq Numbers", category: "sans-serif", variants: ["regular"], subsets: ["indic-siyaq-numbers"] },
                        "Noto-Sans-Inscriptional-Pahlavi": { family: "Noto Sans Inscriptional Pahlavi", category: "sans-serif", variants: ["regular"], subsets: ["inscriptional-pahlavi"] },
                        "Noto-Sans-Inscriptional-Parthian": { family: "Noto Sans Inscriptional Parthian", category: "sans-serif", variants: ["regular"], subsets: ["inscriptional-parthian"] },
                        "Noto-Sans-JP": { family: "Noto Sans JP", category: "sans-serif", variants: ["100", "300", "regular", "500", "700", "900"], subsets: ["japanese", "latin"] },
                        "Noto-Sans-Javanese": { family: "Noto Sans Javanese", category: "sans-serif", variants: ["regular", "700"], subsets: ["javanese"] },
                        "Noto-Sans-KR": { family: "Noto Sans KR", category: "sans-serif", variants: ["100", "300", "regular", "500", "700", "900"], subsets: ["korean", "latin"] },
                        "Noto-Sans-Kaithi": { family: "Noto Sans Kaithi", category: "sans-serif", variants: ["regular"], subsets: ["kaithi"] },
                        "Noto-Sans-Kannada": { family: "Noto Sans Kannada", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["kannada"] },
                        "Noto-Sans-Kayah-Li": { family: "Noto Sans Kayah Li", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["kayah-li"] },
                        "Noto-Sans-Kharoshthi": { family: "Noto Sans Kharoshthi", category: "sans-serif", variants: ["regular"], subsets: ["kharoshthi"] },
                        "Noto-Sans-Khmer": { family: "Noto Sans Khmer", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["khmer"] },
                        "Noto-Sans-Khojki": { family: "Noto Sans Khojki", category: "sans-serif", variants: ["regular"], subsets: ["khojki"] },
                        "Noto-Sans-Khudawadi": { family: "Noto Sans Khudawadi", category: "sans-serif", variants: ["regular"], subsets: ["khudawadi"] },
                        "Noto-Sans-Lao": { family: "Noto Sans Lao", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["lao"] },
                        "Noto-Sans-Lepcha": { family: "Noto Sans Lepcha", category: "sans-serif", variants: ["regular"], subsets: ["lepcha"] },
                        "Noto-Sans-Limbu": { family: "Noto Sans Limbu", category: "sans-serif", variants: ["regular"], subsets: ["limbu"] },
                        "Noto-Sans-Linear-A": { family: "Noto Sans Linear A", category: "sans-serif", variants: ["regular"], subsets: ["linear-a"] },
                        "Noto-Sans-Linear-B": { family: "Noto Sans Linear B", category: "sans-serif", variants: ["regular"], subsets: ["linear-b"] },
                        "Noto-Sans-Lisu": { family: "Noto Sans Lisu", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["lisu"] },
                        "Noto-Sans-Lycian": { family: "Noto Sans Lycian", category: "sans-serif", variants: ["regular"], subsets: ["lycian"] },
                        "Noto-Sans-Lydian": { family: "Noto Sans Lydian", category: "sans-serif", variants: ["regular"], subsets: ["lydian"] },
                        "Noto-Sans-Mahajani": { family: "Noto Sans Mahajani", category: "sans-serif", variants: ["regular"], subsets: ["mahajani"] },
                        "Noto-Sans-Malayalam": { family: "Noto Sans Malayalam", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["malayalam"] },
                        "Noto-Sans-Mandaic": { family: "Noto Sans Mandaic", category: "sans-serif", variants: ["regular"], subsets: ["mandaic"] },
                        "Noto-Sans-Manichaean": { family: "Noto Sans Manichaean", category: "sans-serif", variants: ["regular"], subsets: ["manichaean"] },
                        "Noto-Sans-Marchen": { family: "Noto Sans Marchen", category: "sans-serif", variants: ["regular"], subsets: ["marchen"] },
                        "Noto-Sans-Masaram-Gondi": { family: "Noto Sans Masaram Gondi", category: "sans-serif", variants: ["regular"], subsets: ["masaram-gondi"] },
                        "Noto-Sans-Math": { family: "Noto Sans Math", category: "sans-serif", variants: ["regular"], subsets: ["math"] },
                        "Noto-Sans-Mayan-Numerals": { family: "Noto Sans Mayan Numerals", category: "sans-serif", variants: ["regular"], subsets: ["mayan-numerals"] },
                        "Noto-Sans-Medefaidrin": { family: "Noto Sans Medefaidrin", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["medefaidrin"] },
                        "Noto-Sans-Meetei-Mayek": { family: "Noto Sans Meetei Mayek", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["meetei-mayek"] },
                        "Noto-Sans-Meroitic": { family: "Noto Sans Meroitic", category: "sans-serif", variants: ["regular"], subsets: ["meroitic"] },
                        "Noto-Sans-Miao": { family: "Noto Sans Miao", category: "sans-serif", variants: ["regular"], subsets: ["miao"] },
                        "Noto-Sans-Modi": { family: "Noto Sans Modi", category: "sans-serif", variants: ["regular"], subsets: ["modi"] },
                        "Noto-Sans-Mongolian": { family: "Noto Sans Mongolian", category: "sans-serif", variants: ["regular"], subsets: ["mongolian"] },
                        "Noto-Sans-Mono": {
                            family: "Noto Sans Mono",
                            category: "monospace",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Noto-Sans-Mro": { family: "Noto Sans Mro", category: "sans-serif", variants: ["regular"], subsets: ["mro"] },
                        "Noto-Sans-Multani": { family: "Noto Sans Multani", category: "sans-serif", variants: ["regular"], subsets: ["multani"] },
                        "Noto-Sans-Myanmar": { family: "Noto Sans Myanmar", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["myanmar"] },
                        "Noto-Sans-N-Ko": { family: "Noto Sans N Ko", category: "sans-serif", variants: ["regular"], subsets: ["nko"] },
                        "Noto-Sans-Nabataean": { family: "Noto Sans Nabataean", category: "sans-serif", variants: ["regular"], subsets: ["nabataean"] },
                        "Noto-Sans-New-Tai-Lue": { family: "Noto Sans New Tai Lue", category: "sans-serif", variants: ["regular"], subsets: ["new-tai-lue"] },
                        "Noto-Sans-Newa": { family: "Noto Sans Newa", category: "sans-serif", variants: ["regular"], subsets: ["newa"] },
                        "Noto-Sans-Nushu": { family: "Noto Sans Nushu", category: "sans-serif", variants: ["regular"], subsets: ["nushu"] },
                        "Noto-Sans-Ogham": { family: "Noto Sans Ogham", category: "sans-serif", variants: ["regular"], subsets: ["ogham"] },
                        "Noto-Sans-Ol-Chiki": { family: "Noto Sans Ol Chiki", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["ol-chiki"] },
                        "Noto-Sans-Old-Hungarian": { family: "Noto Sans Old Hungarian", category: "sans-serif", variants: ["regular"], subsets: ["old-hungarian"] },
                        "Noto-Sans-Old-Italic": { family: "Noto Sans Old Italic", category: "sans-serif", variants: ["regular"], subsets: ["old-italic"] },
                        "Noto-Sans-Old-North-Arabian": { family: "Noto Sans Old North Arabian", category: "sans-serif", variants: ["regular"], subsets: ["old-north-arabian"] },
                        "Noto-Sans-Old-Permic": { family: "Noto Sans Old Permic", category: "sans-serif", variants: ["regular"], subsets: ["old-permic"] },
                        "Noto-Sans-Old-Persian": { family: "Noto Sans Old Persian", category: "sans-serif", variants: ["regular"], subsets: ["old-persian"] },
                        "Noto-Sans-Old-Sogdian": { family: "Noto Sans Old Sogdian", category: "sans-serif", variants: ["regular"], subsets: ["old-sogdian"] },
                        "Noto-Sans-Old-South-Arabian": { family: "Noto Sans Old South Arabian", category: "sans-serif", variants: ["regular"], subsets: ["old-south-arabian"] },
                        "Noto-Sans-Old-Turkic": { family: "Noto Sans Old Turkic", category: "sans-serif", variants: ["regular"], subsets: ["old-turkic"] },
                        "Noto-Sans-Oriya": { family: "Noto Sans Oriya", category: "sans-serif", variants: ["100", "regular", "700", "900"], subsets: ["oriya"] },
                        "Noto-Sans-Osage": { family: "Noto Sans Osage", category: "sans-serif", variants: ["regular"], subsets: ["osage"] },
                        "Noto-Sans-Osmanya": { family: "Noto Sans Osmanya", category: "sans-serif", variants: ["regular"], subsets: ["osmanya"] },
                        "Noto-Sans-Pahawh-Hmong": { family: "Noto Sans Pahawh Hmong", category: "sans-serif", variants: ["regular"], subsets: ["pahawh-hmong"] },
                        "Noto-Sans-Palmyrene": { family: "Noto Sans Palmyrene", category: "sans-serif", variants: ["regular"], subsets: ["palmyrene"] },
                        "Noto-Sans-Pau-Cin-Hau": { family: "Noto Sans Pau Cin Hau", category: "sans-serif", variants: ["regular"], subsets: ["pau-cin-hau"] },
                        "Noto-Sans-Phags-Pa": { family: "Noto Sans Phags Pa", category: "sans-serif", variants: ["regular"], subsets: ["phags-pa"] },
                        "Noto-Sans-Phoenician": { family: "Noto Sans Phoenician", category: "sans-serif", variants: ["regular"], subsets: ["phoenician"] },
                        "Noto-Sans-Psalter-Pahlavi": { family: "Noto Sans Psalter Pahlavi", category: "sans-serif", variants: ["regular"], subsets: ["psalter-pahlavi"] },
                        "Noto-Sans-Rejang": { family: "Noto Sans Rejang", category: "sans-serif", variants: ["regular"], subsets: ["rejang"] },
                        "Noto-Sans-Runic": { family: "Noto Sans Runic", category: "sans-serif", variants: ["regular"], subsets: ["runic"] },
                        "Noto-Sans-SC": { family: "Noto Sans SC", category: "sans-serif", variants: ["100", "300", "regular", "500", "700", "900"], subsets: ["chinese-simplified", "latin"] },
                        "Noto-Sans-Samaritan": { family: "Noto Sans Samaritan", category: "sans-serif", variants: ["regular"], subsets: ["samaritan"] },
                        "Noto-Sans-Saurashtra": { family: "Noto Sans Saurashtra", category: "sans-serif", variants: ["regular"], subsets: ["saurashtra"] },
                        "Noto-Sans-Sharada": { family: "Noto Sans Sharada", category: "sans-serif", variants: ["regular"], subsets: ["sharada"] },
                        "Noto-Sans-Shavian": { family: "Noto Sans Shavian", category: "sans-serif", variants: ["regular"], subsets: ["shavian"] },
                        "Noto-Sans-Siddham": { family: "Noto Sans Siddham", category: "sans-serif", variants: ["regular"], subsets: ["siddham"] },
                        "Noto-Sans-Sinhala": { family: "Noto Sans Sinhala", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["sinhala"] },
                        "Noto-Sans-Sogdian": { family: "Noto Sans Sogdian", category: "sans-serif", variants: ["regular"], subsets: ["sogdian"] },
                        "Noto-Sans-Sora-Sompeng": { family: "Noto Sans Sora Sompeng", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["sora-sompeng"] },
                        "Noto-Sans-Soyombo": { family: "Noto Sans Soyombo", category: "sans-serif", variants: ["regular"], subsets: ["soyombo"] },
                        "Noto-Sans-Sundanese": { family: "Noto Sans Sundanese", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["sundanese"] },
                        "Noto-Sans-Syloti-Nagri": { family: "Noto Sans Syloti Nagri", category: "sans-serif", variants: ["regular"], subsets: ["syloti-nagri"] },
                        "Noto-Sans-Symbols": { family: "Noto Sans Symbols", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["symbols"] },
                        "Noto-Sans-Symbols-2": { family: "Noto Sans Symbols 2", category: "sans-serif", variants: ["regular"], subsets: ["symbols"] },
                        "Noto-Sans-Syriac": { family: "Noto Sans Syriac", category: "sans-serif", variants: ["100", "regular", "900"], subsets: ["syriac"] },
                        "Noto-Sans-TC": { family: "Noto Sans TC", category: "sans-serif", variants: ["100", "300", "regular", "500", "700", "900"], subsets: ["chinese-traditional", "latin"] },
                        "Noto-Sans-Tagalog": { family: "Noto Sans Tagalog", category: "sans-serif", variants: ["regular"], subsets: ["tagalog"] },
                        "Noto-Sans-Tagbanwa": { family: "Noto Sans Tagbanwa", category: "sans-serif", variants: ["regular"], subsets: ["tagbanwa"] },
                        "Noto-Sans-Tai-Le": { family: "Noto Sans Tai Le", category: "sans-serif", variants: ["regular"], subsets: ["tai-le"] },
                        "Noto-Sans-Tai-Tham": { family: "Noto Sans Tai Tham", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["tai-tham"] },
                        "Noto-Sans-Tai-Viet": { family: "Noto Sans Tai Viet", category: "sans-serif", variants: ["regular"], subsets: ["tai-viet"] },
                        "Noto-Sans-Takri": { family: "Noto Sans Takri", category: "sans-serif", variants: ["regular"], subsets: ["takri"] },
                        "Noto-Sans-Tamil": { family: "Noto Sans Tamil", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["tamil"] },
                        "Noto-Sans-Tamil-Supplement": { family: "Noto Sans Tamil Supplement", category: "sans-serif", variants: ["regular"], subsets: ["tamil-supplement"] },
                        "Noto-Sans-Telugu": { family: "Noto Sans Telugu", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["telugu"] },
                        "Noto-Sans-Thaana": { family: "Noto Sans Thaana", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["thaana"] },
                        "Noto-Sans-Thai": { family: "Noto Sans Thai", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["thai"] },
                        "Noto-Sans-Thai-Looped": { family: "Noto Sans Thai Looped", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["thai"] },
                        "Noto-Sans-Tifinagh": { family: "Noto Sans Tifinagh", category: "sans-serif", variants: ["regular"], subsets: ["tifinagh"] },
                        "Noto-Sans-Tirhuta": { family: "Noto Sans Tirhuta", category: "sans-serif", variants: ["regular"], subsets: ["tirhuta"] },
                        "Noto-Sans-Ugaritic": { family: "Noto Sans Ugaritic", category: "sans-serif", variants: ["regular"], subsets: ["ugaritic"] },
                        "Noto-Sans-Vai": { family: "Noto Sans Vai", category: "sans-serif", variants: ["regular"], subsets: ["vai"] },
                        "Noto-Sans-Wancho": { family: "Noto Sans Wancho", category: "sans-serif", variants: ["regular"], subsets: ["wancho"] },
                        "Noto-Sans-Warang-Citi": { family: "Noto Sans Warang Citi", category: "sans-serif", variants: ["regular"], subsets: ["warang-citi"] },
                        "Noto-Sans-Yi": { family: "Noto Sans Yi", category: "sans-serif", variants: ["regular"], subsets: ["yi"] },
                        "Noto-Sans-Zanabazar-Square": { family: "Noto Sans Zanabazar Square", category: "sans-serif", variants: ["regular"], subsets: ["zanabazar-square"] },
                        "Noto-Serif": { family: "Noto Serif", category: "serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"] },
                        "Noto-Serif-Ahom": { family: "Noto Serif Ahom", category: "serif", variants: ["regular"], subsets: ["ahom"] },
                        "Noto-Serif-Armenian": { family: "Noto Serif Armenian", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["armenian"] },
                        "Noto-Serif-Balinese": { family: "Noto Serif Balinese", category: "serif", variants: ["regular"], subsets: ["balinese"] },
                        "Noto-Serif-Bengali": { family: "Noto Serif Bengali", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["bengali"] },
                        "Noto-Serif-Devanagari": { family: "Noto Serif Devanagari", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["devanagari"] },
                        "Noto-Serif-Display": {
                            family: "Noto Serif Display",
                            category: "serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Noto-Serif-Dogra": { family: "Noto Serif Dogra", category: "serif", variants: ["regular"], subsets: ["dogra"] },
                        "Noto-Serif-Ethiopic": { family: "Noto Serif Ethiopic", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["ethiopic"] },
                        "Noto-Serif-Georgian": { family: "Noto Serif Georgian", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["georgian"] },
                        "Noto-Serif-Grantha": { family: "Noto Serif Grantha", category: "serif", variants: ["regular"], subsets: ["grantha"] },
                        "Noto-Serif-Gujarati": { family: "Noto Serif Gujarati", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["gujarati"] },
                        "Noto-Serif-Gurmukhi": { family: "Noto Serif Gurmukhi", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["gurmukhi"] },
                        "Noto-Serif-Hebrew": { family: "Noto Serif Hebrew", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["hebrew"] },
                        "Noto-Serif-JP": { family: "Noto Serif JP", category: "serif", variants: ["200", "300", "regular", "500", "600", "700", "900"], subsets: ["japanese", "latin"] },
                        "Noto-Serif-KR": { family: "Noto Serif KR", category: "serif", variants: ["200", "300", "regular", "500", "600", "700", "900"], subsets: ["korean", "latin"] },
                        "Noto-Serif-Kannada": { family: "Noto Serif Kannada", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["kannada"] },
                        "Noto-Serif-Khmer": { family: "Noto Serif Khmer", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["khmer"] },
                        "Noto-Serif-Lao": { family: "Noto Serif Lao", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["lao"] },
                        "Noto-Serif-Malayalam": { family: "Noto Serif Malayalam", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["malayalam"] },
                        "Noto-Serif-Myanmar": { family: "Noto Serif Myanmar", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["myanmar"] },
                        "Noto-Serif-Nyiakeng-Puachue-Hmong": { family: "Noto Serif Nyiakeng Puachue Hmong", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["nyiakeng-puachue-hmong"] },
                        "Noto-Serif-SC": { family: "Noto Serif SC", category: "serif", variants: ["200", "300", "regular", "500", "600", "700", "900"], subsets: ["chinese-simplified", "latin"] },
                        "Noto-Serif-Sinhala": { family: "Noto Serif Sinhala", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["sinhala"] },
                        "Noto-Serif-TC": { family: "Noto Serif TC", category: "serif", variants: ["200", "300", "regular", "500", "600", "700", "900"], subsets: ["chinese-traditional", "latin"] },
                        "Noto-Serif-Tamil": { family: "Noto Serif Tamil", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["tamil"] },
                        "Noto-Serif-Tangut": { family: "Noto Serif Tangut", category: "serif", variants: ["regular"], subsets: ["tangut"] },
                        "Noto-Serif-Telugu": { family: "Noto Serif Telugu", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["telugu"] },
                        "Noto-Serif-Thai": { family: "Noto Serif Thai", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["thai"] },
                        "Noto-Serif-Tibetan": { family: "Noto Serif Tibetan", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["tibetan"] },
                        "Noto-Serif-Yezidi": { family: "Noto Serif Yezidi", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["yezidi"] },
                        "Noto-Traditional-Nushu": { family: "Noto Traditional Nushu", category: "sans-serif", variants: ["regular"], subsets: ["nushu"] },
                        "Nova-Cut": { family: "Nova Cut", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Nova-Flat": { family: "Nova Flat", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Nova-Mono": { family: "Nova Mono", category: "monospace", variants: ["regular"], subsets: ["greek", "latin"] },
                        "Nova-Oval": { family: "Nova Oval", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Nova-Round": { family: "Nova Round", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Nova-Script": { family: "Nova Script", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Nova-Slim": { family: "Nova Slim", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Nova-Square": { family: "Nova Square", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Numans: { family: "Numans", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Nunito: { family: "Nunito", category: "sans-serif", variants: ["200", "300", "regular", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Nunito-Sans": { family: "Nunito Sans", category: "sans-serif", variants: ["200", "300", "regular", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Odibee-Sans": { family: "Odibee Sans", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Odor-Mean-Chey": { family: "Odor Mean Chey", category: "serif", variants: ["regular"], subsets: ["khmer", "latin"] },
                        Offside: { family: "Offside", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Oi: { family: "Oi", category: "display", variants: ["regular"], subsets: ["greek", "latin", "latin-ext", "vietnamese"] },
                        "Old-Standard-TT": { family: "Old Standard TT", category: "serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        Oldenburg: { family: "Oldenburg", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Oleo-Script": { family: "Oleo Script", category: "display", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Oleo-Script-Swash-Caps": { family: "Oleo Script Swash Caps", category: "display", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Open-Sans": {
                            family: "Open Sans",
                            category: "sans-serif",
                            variants: ["300", "regular", "500", "600", "700", "800"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "hebrew", "latin", "latin-ext", "vietnamese"],
                        },
                        "Open-Sans-Condensed": { family: "Open Sans Condensed", category: "sans-serif", variants: ["300", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"] },
                        Oranienbaum: { family: "Oranienbaum", category: "serif", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        Orbitron: { family: "Orbitron", category: "sans-serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["latin"] },
                        Oregano: { family: "Oregano", category: "display", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        "Orelega-One": { family: "Orelega One", category: "display", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        Orienta: { family: "Orienta", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Original-Surfer": { family: "Original Surfer", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Oswald: { family: "Oswald", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Otomanopee-One": { family: "Otomanopee One", category: "sans-serif", variants: ["regular"], subsets: ["japanese", "latin", "latin-ext"] },
                        Outfit: { family: "Outfit", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin"] },
                        "Over-the-Rainbow": { family: "Over the Rainbow", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Overlock: { family: "Overlock", category: "display", variants: ["regular", "700", "900", "900italic"], subsets: ["latin", "latin-ext"] },
                        "Overlock-SC": { family: "Overlock SC", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Overpass: { family: "Overpass", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Overpass-Mono": { family: "Overpass Mono", category: "monospace", variants: ["300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        Ovo: { family: "Ovo", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Oxanium: { family: "Oxanium", category: "display", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext"] },
                        Oxygen: { family: "Oxygen", category: "sans-serif", variants: ["300", "regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Oxygen-Mono": { family: "Oxygen Mono", category: "monospace", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "PT-Mono": { family: "PT Mono", category: "monospace", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        "PT-Sans": { family: "PT Sans", category: "sans-serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        "PT-Sans-Caption": { family: "PT Sans Caption", category: "sans-serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        "PT-Sans-Narrow": { family: "PT Sans Narrow", category: "sans-serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        "PT-Serif": { family: "PT Serif", category: "serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        "PT-Serif-Caption": { family: "PT Serif Caption", category: "serif", variants: ["regular", "italic"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        Pacifico: { family: "Pacifico", category: "handwriting", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        Padauk: { family: "Padauk", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "myanmar"] },
                        Palanquin: { family: "Palanquin", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Palanquin-Dark": { family: "Palanquin Dark", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Palette-Mosaic": { family: "Palette Mosaic", category: "display", variants: ["regular"], subsets: ["japanese", "latin"] },
                        Pangolin: { family: "Pangolin", category: "handwriting", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        Paprika: { family: "Paprika", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Parisienne: { family: "Parisienne", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Passero-One": { family: "Passero One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Passion-One": { family: "Passion One", category: "display", variants: ["regular", "700", "900"], subsets: ["latin", "latin-ext"] },
                        "Passions-Conflict": { family: "Passions Conflict", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Pathway-Gothic-One": { family: "Pathway Gothic One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Patrick-Hand": { family: "Patrick Hand", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Patrick-Hand-SC": { family: "Patrick Hand SC", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Pattaya: { family: "Pattaya", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext", "thai", "vietnamese"] },
                        "Patua-One": { family: "Patua One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Pavanam: { family: "Pavanam", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext", "tamil"] },
                        "Paytone-One": { family: "Paytone One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Peddana: { family: "Peddana", category: "serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Peralta: { family: "Peralta", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Permanent-Marker": { family: "Permanent Marker", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Petemoss: { family: "Petemoss", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Petit-Formal-Script": { family: "Petit Formal Script", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Petrona: { family: "Petrona", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Philosopher: { family: "Philosopher", category: "sans-serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "vietnamese"] },
                        Piazzolla: {
                            family: "Piazzolla",
                            category: "serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        Piedra: { family: "Piedra", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Pinyon-Script": { family: "Pinyon Script", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Pirata-One": { family: "Pirata One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Plaster: { family: "Plaster", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Play: { family: "Play", category: "sans-serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"] },
                        Playball: { family: "Playball", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Playfair-Display": { family: "Playfair Display", category: "serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"] },
                        "Playfair-Display-SC": { family: "Playfair Display SC", category: "serif", variants: ["regular", "700", "900", "900italic"], subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"] },
                        Podkova: { family: "Podkova", category: "serif", variants: ["regular", "500", "600", "700", "800"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Poiret-One": { family: "Poiret One", category: "display", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        "Poller-One": { family: "Poller One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Poly: { family: "Poly", category: "serif", variants: ["regular", "italic"], subsets: ["latin"] },
                        Pompiere: { family: "Pompiere", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Pontano-Sans": { family: "Pontano Sans", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Poor-Story": { family: "Poor Story", category: "display", variants: ["regular"], subsets: ["korean", "latin"] },
                        Poppins: { family: "Poppins", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Port-Lligat-Sans": { family: "Port Lligat Sans", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Port-Lligat-Slab": { family: "Port Lligat Slab", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Potta-One": { family: "Potta One", category: "display", variants: ["regular"], subsets: ["japanese", "latin", "latin-ext", "vietnamese"] },
                        "Pragati-Narrow": { family: "Pragati Narrow", category: "sans-serif", variants: ["regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Praise: { family: "Praise", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Prata: { family: "Prata", category: "serif", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "vietnamese"] },
                        Preahvihear: { family: "Preahvihear", category: "sans-serif", variants: ["regular"], subsets: ["khmer", "latin"] },
                        "Press-Start-2P": { family: "Press Start 2P", category: "display", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext"] },
                        Pridi: { family: "Pridi", category: "serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        "Princess-Sofia": { family: "Princess Sofia", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Prociono: { family: "Prociono", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Prompt: { family: "Prompt", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        "Prosto-One": { family: "Prosto One", category: "display", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        "Proza-Libre": { family: "Proza Libre", category: "sans-serif", variants: ["regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext"] },
                        "Public-Sans": { family: "Public Sans", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        "Puppies-Play": { family: "Puppies Play", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Puritan: { family: "Puritan", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin"] },
                        "Purple-Purse": { family: "Purple Purse", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Qahiri: { family: "Qahiri", category: "sans-serif", variants: ["regular"], subsets: ["arabic", "latin"] },
                        Quando: { family: "Quando", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Quantico: { family: "Quantico", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin"] },
                        Quattrocento: { family: "Quattrocento", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Quattrocento-Sans": { family: "Quattrocento Sans", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Questrial: { family: "Questrial", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Quicksand: { family: "Quicksand", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Quintessential: { family: "Quintessential", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Qwigley: { family: "Qwigley", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Racing-Sans-One": { family: "Racing Sans One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Radley: { family: "Radley", category: "serif", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        Rajdhani: { family: "Rajdhani", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Rakkas: { family: "Rakkas", category: "display", variants: ["regular"], subsets: ["arabic", "latin", "latin-ext"] },
                        Raleway: { family: "Raleway", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Raleway-Dots": { family: "Raleway Dots", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Ramabhadra: { family: "Ramabhadra", category: "sans-serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Ramaraja: { family: "Ramaraja", category: "serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Rambla: { family: "Rambla", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Rammetto-One": { family: "Rammetto One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Rampart-One": { family: "Rampart One", category: "display", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        Ranchers: { family: "Ranchers", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Rancho: { family: "Rancho", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Ranga: { family: "Ranga", category: "display", variants: ["regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Rasa: { family: "Rasa", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["gujarati", "latin", "latin-ext", "vietnamese"] },
                        Rationale: { family: "Rationale", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Ravi-Prakash": { family: "Ravi Prakash", category: "display", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Recursive: { family: "Recursive", category: "sans-serif", variants: ["300", "regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        "Red-Hat-Display": { family: "Red Hat Display", category: "sans-serif", variants: ["300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        "Red-Hat-Mono": { family: "Red Hat Mono", category: "monospace", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext"] },
                        "Red-Hat-Text": { family: "Red Hat Text", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext"] },
                        "Red-Rose": { family: "Red Rose", category: "display", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Redressed: { family: "Redressed", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Reem-Kufi": { family: "Reem Kufi", category: "sans-serif", variants: ["regular", "500", "600", "700"], subsets: ["arabic", "latin"] },
                        "Reenie-Beanie": { family: "Reenie Beanie", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Reggae-One": { family: "Reggae One", category: "display", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        Revalia: { family: "Revalia", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Rhodium-Libre": { family: "Rhodium Libre", category: "serif", variants: ["regular"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Ribeye: { family: "Ribeye", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Ribeye-Marrow": { family: "Ribeye Marrow", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Righteous: { family: "Righteous", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Risque: { family: "Risque", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Road-Rage": { family: "Road Rage", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Roboto: { family: "Roboto", category: "sans-serif", variants: ["100", "300", "regular", "500", "700", "900"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"] },
                        "Roboto-Condensed": { family: "Roboto Condensed", category: "sans-serif", variants: ["300", "regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"] },
                        "Roboto-Mono": { family: "Roboto Mono", category: "monospace", variants: ["100", "200", "300", "regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"] },
                        "Roboto-Slab": {
                            family: "Roboto Slab",
                            category: "serif",
                            variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        Rochester: { family: "Rochester", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Rock-Salt": { family: "Rock Salt", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "RocknRoll-One": { family: "RocknRoll One", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        Rokkitt: { family: "Rokkitt", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Romanesco: { family: "Romanesco", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Ropa-Sans": { family: "Ropa Sans", category: "sans-serif", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        Rosario: { family: "Rosario", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Rosarivo: { family: "Rosarivo", category: "serif", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        "Rouge-Script": { family: "Rouge Script", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Rowdies: { family: "Rowdies", category: "display", variants: ["300", "regular", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Rozha-One": { family: "Rozha One", category: "serif", variants: ["regular"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Rubik: { family: "Rubik", category: "sans-serif", variants: ["300", "regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "hebrew", "latin", "latin-ext"] },
                        "Rubik-Beastly": { family: "Rubik Beastly", category: "display", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "hebrew", "latin", "latin-ext"] },
                        "Rubik-Mono-One": { family: "Rubik Mono One", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        Ruda: { family: "Ruda", category: "sans-serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"] },
                        Rufina: { family: "Rufina", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Ruge-Boogie": { family: "Ruge Boogie", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Ruluko: { family: "Ruluko", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Rum-Raisin": { family: "Rum Raisin", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Ruslan-Display": { family: "Ruslan Display", category: "display", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        "Russo-One": { family: "Russo One", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        Ruthie: { family: "Ruthie", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Rye: { family: "Rye", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "STIX-Two-Text": { family: "STIX Two Text", category: "serif", variants: ["regular", "500", "600", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"] },
                        Sacramento: { family: "Sacramento", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Sahitya: { family: "Sahitya", category: "serif", variants: ["regular", "700"], subsets: ["devanagari", "latin"] },
                        Sail: { family: "Sail", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Saira: { family: "Saira", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Saira-Condensed": { family: "Saira Condensed", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Saira-Extra-Condensed": { family: "Saira Extra Condensed", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Saira-Semi-Condensed": { family: "Saira Semi Condensed", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Saira-Stencil-One": { family: "Saira Stencil One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Salsa: { family: "Salsa", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Sanchez: { family: "Sanchez", category: "serif", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        Sancreek: { family: "Sancreek", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Sansita: { family: "Sansita", category: "sans-serif", variants: ["regular", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        "Sansita-Swashed": { family: "Sansita Swashed", category: "display", variants: ["300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Sarabun: { family: "Sarabun", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Sarala: { family: "Sarala", category: "sans-serif", variants: ["regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Sarina: { family: "Sarina", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Sarpanch: { family: "Sarpanch", category: "sans-serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Sassy-Frass": { family: "Sassy Frass", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Satisfy: { family: "Satisfy", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Sawarabi-Gothic": { family: "Sawarabi Gothic", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext", "vietnamese"] },
                        "Sawarabi-Mincho": { family: "Sawarabi Mincho", category: "sans-serif", variants: ["regular"], subsets: ["japanese", "latin", "latin-ext"] },
                        Scada: { family: "Scada", category: "sans-serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"] },
                        Scheherazade: { family: "Scheherazade", category: "serif", variants: ["regular", "700"], subsets: ["arabic", "latin"] },
                        "Scheherazade-New": { family: "Scheherazade New", category: "serif", variants: ["regular", "700"], subsets: ["arabic", "latin", "latin-ext"] },
                        Schoolbell: { family: "Schoolbell", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Scope-One": { family: "Scope One", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Seaweed-Script": { family: "Seaweed Script", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Secular-One": { family: "Secular One", category: "sans-serif", variants: ["regular"], subsets: ["hebrew", "latin", "latin-ext"] },
                        "Sedgwick-Ave": { family: "Sedgwick Ave", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Sedgwick-Ave-Display": { family: "Sedgwick Ave Display", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Sen: { family: "Sen", category: "sans-serif", variants: ["regular", "700", "800"], subsets: ["latin", "latin-ext"] },
                        Sevillana: { family: "Sevillana", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Seymour-One": { family: "Seymour One", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        "Shadows-Into-Light": { family: "Shadows Into Light", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Shadows-Into-Light-Two": { family: "Shadows Into Light Two", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Shalimar: { family: "Shalimar", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Shanti: { family: "Shanti", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Share: { family: "Share", category: "display", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Share-Tech": { family: "Share Tech", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Share-Tech-Mono": { family: "Share Tech Mono", category: "monospace", variants: ["regular"], subsets: ["latin"] },
                        "Shippori-Antique": { family: "Shippori Antique", category: "sans-serif", variants: ["regular"], subsets: ["japanese", "latin", "latin-ext"] },
                        "Shippori-Antique-B1": { family: "Shippori Antique B1", category: "sans-serif", variants: ["regular"], subsets: ["japanese", "latin", "latin-ext"] },
                        "Shippori-Mincho": { family: "Shippori Mincho", category: "serif", variants: ["regular", "500", "600", "700", "800"], subsets: ["japanese", "latin", "latin-ext"] },
                        "Shippori-Mincho-B1": { family: "Shippori Mincho B1", category: "serif", variants: ["regular", "500", "600", "700", "800"], subsets: ["japanese", "latin", "latin-ext"] },
                        Shojumaru: { family: "Shojumaru", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Short-Stack": { family: "Short Stack", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Shrikhand: { family: "Shrikhand", category: "display", variants: ["regular"], subsets: ["gujarati", "latin", "latin-ext"] },
                        Siemreap: { family: "Siemreap", category: "display", variants: ["regular"], subsets: ["khmer"] },
                        "Sigmar-One": { family: "Sigmar One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Signika: { family: "Signika", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Signika-Negative": { family: "Signika Negative", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Simonetta: { family: "Simonetta", category: "display", variants: ["regular", "900", "900italic"], subsets: ["latin", "latin-ext"] },
                        "Single-Day": { family: "Single Day", category: "display", variants: ["regular"], subsets: ["korean"] },
                        Sintony: { family: "Sintony", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Sirin-Stencil": { family: "Sirin Stencil", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Six-Caps": { family: "Six Caps", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        Skranji: { family: "Skranji", category: "display", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        "Slabo-13px": { family: "Slabo 13px", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Slabo-27px": { family: "Slabo 27px", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Slackey: { family: "Slackey", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Smokum: { family: "Smokum", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Smythe: { family: "Smythe", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Sniglet: { family: "Sniglet", category: "display", variants: ["regular", "800"], subsets: ["latin", "latin-ext"] },
                        Snippet: { family: "Snippet", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Snowburst-One": { family: "Snowburst One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Sofadi-One": { family: "Sofadi One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Sofia: { family: "Sofia", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Solway: { family: "Solway", category: "serif", variants: ["300", "regular", "500", "700", "800"], subsets: ["latin"] },
                        "Song-Myung": { family: "Song Myung", category: "serif", variants: ["regular"], subsets: ["korean", "latin"] },
                        "Sonsie-One": { family: "Sonsie One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Sora: { family: "Sora", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext"] },
                        "Sorts-Mill-Goudy": { family: "Sorts Mill Goudy", category: "serif", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        "Source-Code-Pro": {
                            family: "Source Code Pro",
                            category: "monospace",
                            variants: ["200", "300", "regular", "500", "600", "700", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"],
                        },
                        "Source-Sans-Pro": {
                            family: "Source Sans Pro",
                            category: "sans-serif",
                            variants: ["200", "300", "regular", "600", "700", "900"],
                            subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
                        },
                        "Source-Serif-Pro": { family: "Source Serif Pro", category: "serif", variants: ["200", "300", "regular", "600", "700", "900"], subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"] },
                        "Space-Grotesk": { family: "Space Grotesk", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Space-Mono": { family: "Space Mono", category: "monospace", variants: ["regular", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Spartan: { family: "Spartan", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        "Special-Elite": { family: "Special Elite", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Spectral: { family: "Spectral", category: "serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"] },
                        "Spectral-SC": { family: "Spectral SC", category: "serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"] },
                        "Spicy-Rice": { family: "Spicy Rice", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Spinnaker: { family: "Spinnaker", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Spirax: { family: "Spirax", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Squada-One": { family: "Squada One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Sree-Krushnadevaraya": { family: "Sree Krushnadevaraya", category: "serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Sriracha: { family: "Sriracha", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Srisakdi: { family: "Srisakdi", category: "display", variants: ["regular", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Staatliches: { family: "Staatliches", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Stalemate: { family: "Stalemate", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Stalinist-One": { family: "Stalinist One", category: "display", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        "Stardos-Stencil": { family: "Stardos Stencil", category: "display", variants: ["regular", "700"], subsets: ["latin"] },
                        Stick: { family: "Stick", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Stick-No-Bills": { family: "Stick No Bills", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "sinhala"] },
                        "Stint-Ultra-Condensed": { family: "Stint Ultra Condensed", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Stint-Ultra-Expanded": { family: "Stint Ultra Expanded", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Stoke: { family: "Stoke", category: "serif", variants: ["300", "regular"], subsets: ["latin", "latin-ext"] },
                        Strait: { family: "Strait", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Style-Script": { family: "Style Script", category: "handwriting", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Stylish: { family: "Stylish", category: "sans-serif", variants: ["regular"], subsets: ["korean", "latin"] },
                        "Sue-Ellen-Francisco": { family: "Sue Ellen Francisco", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Suez-One": { family: "Suez One", category: "serif", variants: ["regular"], subsets: ["hebrew", "latin", "latin-ext"] },
                        "Sulphur-Point": { family: "Sulphur Point", category: "sans-serif", variants: ["300", "regular", "700"], subsets: ["latin", "latin-ext"] },
                        Sumana: { family: "Sumana", category: "serif", variants: ["regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Sunflower: { family: "Sunflower", category: "sans-serif", variants: ["300", "500", "700"], subsets: ["korean", "latin"] },
                        Sunshiney: { family: "Sunshiney", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Supermercado-One": { family: "Supermercado One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Sura: { family: "Sura", category: "serif", variants: ["regular", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Suranna: { family: "Suranna", category: "serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Suravaram: { family: "Suravaram", category: "serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Suwannaphum: { family: "Suwannaphum", category: "serif", variants: ["100", "300", "regular", "700", "900"], subsets: ["khmer", "latin"] },
                        "Swanky-and-Moo-Moo": { family: "Swanky and Moo Moo", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Syncopate: { family: "Syncopate", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin"] },
                        Syne: { family: "Syne", category: "sans-serif", variants: ["regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext"] },
                        "Syne-Mono": { family: "Syne Mono", category: "monospace", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Syne-Tactile": { family: "Syne Tactile", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Tajawal: { family: "Tajawal", category: "sans-serif", variants: ["200", "300", "regular", "500", "700", "800", "900"], subsets: ["arabic", "latin"] },
                        Tangerine: { family: "Tangerine", category: "handwriting", variants: ["regular", "700"], subsets: ["latin"] },
                        Taprom: { family: "Taprom", category: "display", variants: ["regular"], subsets: ["khmer", "latin"] },
                        Tauri: { family: "Tauri", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Taviraj: { family: "Taviraj", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Teko: { family: "Teko", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Telex: { family: "Telex", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Tenali-Ramakrishna": { family: "Tenali Ramakrishna", category: "sans-serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        "Tenor-Sans": { family: "Tenor Sans", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        "Text-Me-One": { family: "Text Me One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Texturina: { family: "Texturina", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Thasadith: { family: "Thasadith", category: "sans-serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        "The-Girl-Next-Door": { family: "The Girl Next Door", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Tienne: { family: "Tienne", category: "serif", variants: ["regular", "700", "900"], subsets: ["latin"] },
                        Tillana: { family: "Tillana", category: "handwriting", variants: ["regular", "500", "600", "700", "800"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Timmana: { family: "Timmana", category: "sans-serif", variants: ["regular"], subsets: ["latin", "telugu"] },
                        Tinos: { family: "Tinos", category: "serif", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "hebrew", "latin", "latin-ext", "vietnamese"] },
                        "Titan-One": { family: "Titan One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Titillium-Web": { family: "Titillium Web", category: "sans-serif", variants: ["200", "300", "regular", "600", "700", "900"], subsets: ["latin", "latin-ext"] },
                        Tomorrow: { family: "Tomorrow", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        Tourney: { family: "Tourney", category: "display", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Trade-Winds": { family: "Trade Winds", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Train-One": { family: "Train One", category: "display", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        Trirong: { family: "Trirong", category: "serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "thai", "vietnamese"] },
                        Trispace: { family: "Trispace", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Trocchi: { family: "Trocchi", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Trochut: { family: "Trochut", category: "display", variants: ["regular", "700"], subsets: ["latin"] },
                        Truculenta: { family: "Truculenta", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Trykker: { family: "Trykker", category: "serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Tulpen-One": { family: "Tulpen One", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Turret-Road": { family: "Turret Road", category: "display", variants: ["200", "300", "regular", "500", "700", "800"], subsets: ["latin", "latin-ext"] },
                        Ubuntu: { family: "Ubuntu", category: "sans-serif", variants: ["300", "regular", "500", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext"] },
                        "Ubuntu-Condensed": { family: "Ubuntu Condensed", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext"] },
                        "Ubuntu-Mono": { family: "Ubuntu Mono", category: "monospace", variants: ["regular", "700"], subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext"] },
                        Uchen: { family: "Uchen", category: "serif", variants: ["regular"], subsets: ["latin", "tibetan"] },
                        Ultra: { family: "Ultra", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        "Uncial-Antiqua": { family: "Uncial Antiqua", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Underdog: { family: "Underdog", category: "display", variants: ["regular"], subsets: ["cyrillic", "latin", "latin-ext"] },
                        "Unica-One": { family: "Unica One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        UnifrakturCook: { family: "UnifrakturCook", category: "display", variants: ["700"], subsets: ["latin"] },
                        UnifrakturMaguntia: { family: "UnifrakturMaguntia", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Unkempt: { family: "Unkempt", category: "display", variants: ["regular", "700"], subsets: ["latin"] },
                        Unlock: { family: "Unlock", category: "display", variants: ["regular"], subsets: ["latin"] },
                        Unna: { family: "Unna", category: "serif", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                        Urbanist: { family: "Urbanist", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] },
                        VT323: { family: "VT323", category: "monospace", variants: ["regular"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Vampiro-One": { family: "Vampiro One", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Varela: { family: "Varela", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Varela-Round": { family: "Varela Round", category: "sans-serif", variants: ["regular"], subsets: ["hebrew", "latin", "latin-ext", "vietnamese"] },
                        Varta: { family: "Varta", category: "sans-serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Vast-Shadow": { family: "Vast Shadow", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Vesper-Libre": { family: "Vesper Libre", category: "serif", variants: ["regular", "500", "700", "900"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Viaoda-Libre": { family: "Viaoda Libre", category: "display", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        Vibes: { family: "Vibes", category: "display", variants: ["regular"], subsets: ["arabic", "latin"] },
                        Vibur: { family: "Vibur", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Vidaloka: { family: "Vidaloka", category: "serif", variants: ["regular"], subsets: ["latin"] },
                        Viga: { family: "Viga", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Voces: { family: "Voces", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Volkhov: { family: "Volkhov", category: "serif", variants: ["regular", "700"], subsets: ["latin"] },
                        Vollkorn: { family: "Vollkorn", category: "serif", variants: ["regular", "500", "600", "700", "800", "900"], subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"] },
                        "Vollkorn-SC": { family: "Vollkorn SC", category: "serif", variants: ["regular", "600", "700", "900"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        Voltaire: { family: "Voltaire", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Waiting-for-the-Sunrise": { family: "Waiting for the Sunrise", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Wallpoet: { family: "Wallpoet", category: "display", variants: ["regular"], subsets: ["latin"] },
                        "Walter-Turncoat": { family: "Walter Turncoat", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Warnes: { family: "Warnes", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Wellfleet: { family: "Wellfleet", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Wendy-One": { family: "Wendy One", category: "sans-serif", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        WindSong: { family: "WindSong", category: "handwriting", variants: ["regular", "500"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Wire-One": { family: "Wire One", category: "sans-serif", variants: ["regular"], subsets: ["latin"] },
                        "Work-Sans": { family: "Work Sans", category: "sans-serif", variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Xanh-Mono": { family: "Xanh Mono", category: "monospace", variants: ["regular", "italic"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        Yaldevi: { family: "Yaldevi", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "sinhala"] },
                        "Yanone-Kaffeesatz": { family: "Yanone Kaffeesatz", category: "sans-serif", variants: ["200", "300", "regular", "500", "600", "700"], subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"] },
                        Yantramanav: { family: "Yantramanav", category: "sans-serif", variants: ["100", "300", "regular", "500", "700", "900"], subsets: ["devanagari", "latin", "latin-ext"] },
                        "Yatra-One": { family: "Yatra One", category: "display", variants: ["regular"], subsets: ["devanagari", "latin", "latin-ext"] },
                        Yellowtail: { family: "Yellowtail", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Yeon-Sung": { family: "Yeon Sung", category: "display", variants: ["regular"], subsets: ["korean", "latin"] },
                        "Yeseva-One": { family: "Yeseva One", category: "display", variants: ["regular"], subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"] },
                        Yesteryear: { family: "Yesteryear", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        Yomogi: { family: "Yomogi", category: "handwriting", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext", "vietnamese"] },
                        Yrsa: { family: "Yrsa", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] },
                        "Yuji-Boku": { family: "Yuji Boku", category: "serif", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Yuji-Mai": { family: "Yuji Mai", category: "serif", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Yuji-Syuku": { family: "Yuji Syuku", category: "serif", variants: ["regular"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Yusei-Magic": { family: "Yusei Magic", category: "sans-serif", variants: ["regular"], subsets: ["japanese", "latin", "latin-ext"] },
                        "ZCOOL-KuaiLe": { family: "ZCOOL KuaiLe", category: "display", variants: ["regular"], subsets: ["chinese-simplified", "latin"] },
                        "ZCOOL-QingKe-HuangYou": { family: "ZCOOL QingKe HuangYou", category: "display", variants: ["regular"], subsets: ["chinese-simplified", "latin"] },
                        "ZCOOL-XiaoWei": { family: "ZCOOL XiaoWei", category: "serif", variants: ["regular"], subsets: ["chinese-simplified", "latin"] },
                        "Zen-Antique": { family: "Zen Antique", category: "serif", variants: ["regular"], subsets: ["cyrillic", "greek", "japanese", "latin", "latin-ext"] },
                        "Zen-Antique-Soft": { family: "Zen Antique Soft", category: "serif", variants: ["regular"], subsets: ["cyrillic", "greek", "japanese", "latin", "latin-ext"] },
                        "Zen-Dots": { family: "Zen Dots", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        "Zen-Kaku-Gothic-Antique": { family: "Zen Kaku Gothic Antique", category: "sans-serif", variants: ["300", "regular", "500", "700", "900"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Zen-Kaku-Gothic-New": { family: "Zen Kaku Gothic New", category: "sans-serif", variants: ["300", "regular", "500", "700", "900"], subsets: ["cyrillic", "japanese", "latin", "latin-ext"] },
                        "Zen-Kurenaido": { family: "Zen Kurenaido", category: "sans-serif", variants: ["regular"], subsets: ["cyrillic", "greek", "japanese", "latin", "latin-ext"] },
                        "Zen-Loop": { family: "Zen Loop", category: "display", variants: ["regular", "italic"], subsets: ["latin", "latin-ext"] },
                        "Zen-Maru-Gothic": { family: "Zen Maru Gothic", category: "sans-serif", variants: ["300", "regular", "500", "700", "900"], subsets: ["cyrillic", "greek", "japanese", "latin", "latin-ext"] },
                        "Zen-Old-Mincho": { family: "Zen Old Mincho", category: "serif", variants: ["regular", "700", "900"], subsets: ["cyrillic", "greek", "japanese", "latin", "latin-ext"] },
                        "Zen-Tokyo-Zoo": { family: "Zen Tokyo Zoo", category: "display", variants: ["regular"], subsets: ["latin", "latin-ext"] },
                        Zeyada: { family: "Zeyada", category: "handwriting", variants: ["regular"], subsets: ["latin"] },
                        "Zhi-Mang-Xing": { family: "Zhi Mang Xing", category: "handwriting", variants: ["regular"], subsets: ["chinese-simplified", "latin"] },
                        "Zilla-Slab": { family: "Zilla Slab", category: "serif", variants: ["300", "regular", "500", "600", "700"], subsets: ["latin", "latin-ext"] },
                        "Zilla-Slab-Highlight": { family: "Zilla Slab Highlight", category: "display", variants: ["regular", "700"], subsets: ["latin", "latin-ext"] },
                    },
                    nn = (0, _e.withInstanceId)(({ value: e, onChange: a, instanceId: t }) => {
                        const i = [
                            { value: "", label: (0, d.__)("Default", "gutsliders") },
                            { value: "Arial", label: "Arial" },
                            { value: "Helvetica", label: "Helvetica" },
                            { value: "Times-New-Roman", label: "Times New Roman" },
                            { value: "Georgia", label: "Georgia" },
                        ];
                        return (
                            Object.keys(rn).map((e) => i.push({ value: e, label: rn[e].family })),
                            (0, y.jsx)("div", {
                                className: "gkits-font-picker",
                                children: (0, y.jsx)(Ie.BaseControl, {
                                    id: `gkits-font-picker-${t}`,
                                    label: (0, d.__)("Font Family", "gutsliders"),
                                    children: (0, y.jsx)(tn, {
                                        classNamePrefix: "gkits",
                                        value: { value: (e || "").replace(/\s+/g, "-"), label: e },
                                        onChange: (e) => {
                                            const t = e.label,
                                                i = document.createElement("link");
                                            (i.rel = "stylesheet"), t && ((i.href = "https://fonts.googleapis.com/css?family=" + t.replace(/ /g, "+") + ":100,200,300,400,500,600,700,800,900"), document.head.appendChild(i)), a(t);
                                        },
                                        options: i,
                                        unstyled: !0,
                                        isSearchable: !0,
                                        isClearable: !1,
                                    }),
                                }),
                            })
                        );
                    }),
                    sn = (0, _e.withInstanceId)(({ label: e, value: a, options: t, onChange: i, searchable: r, clearable: n, instanceId: s }) => {
                        const l = `select-control-${s}`;
                        return (0, y.jsx)(Ie.BaseControl, { id: l, label: e, children: (0, y.jsx)(tn, { id: l, classNamePrefix: "gkits", value: a, onChange: (e) => i(e), options: t, unstyled: !0, isSearchable: r, isClearable: n }) });
                    }),
                    ln = [
                        { label: (0, d.__)("Default", "gutsliders"), value: "" },
                        { label: (0, d.__)("100", "gutsliders"), value: "100" },
                        { label: (0, d.__)("200", "gutsliders"), value: "200" },
                        { label: (0, d.__)("300", "gutsliders"), value: "300" },
                        { label: (0, d.__)("400", "gutsliders"), value: "400" },
                        { label: (0, d.__)("500", "gutsliders"), value: "500" },
                        { label: (0, d.__)("600", "gutsliders"), value: "600" },
                        { label: (0, d.__)("700", "gutsliders"), value: "700" },
                        { label: (0, d.__)("800", "gutsliders"), value: "800" },
                        { label: (0, d.__)("900", "gutsliders"), value: "900" },
                    ],
                    on = [
                        { label: (0, d.__)("None", "gutsliders"), value: "none" },
                        { label: (0, d.__)("aa", "gutsliders"), value: "lowercase" },
                        { label: (0, d.__)("Aa", "gutsliders"), value: "capitalize" },
                        { label: (0, d.__)("AA", "gutsliders"), value: "uppercase" },
                    ],
                    un = [
                        { label: (0, d.__)("Default", "gutsliders"), value: "" },
                        { label: (0, d.__)("None", "gutsliders"), value: "none" },
                        { label: (0, d.__)("Overline", "gutsliders"), value: "overline" },
                        { label: (0, d.__)("Line Through", "gutsliders"), value: "line-through" },
                        { label: (0, d.__)("Underline", "gutsliders"), value: "underline" },
                        { label: (0, d.__)("Underline Oveline", "gutsliders"), value: "underline overline" },
                    ],
                    cn = [
                        { label: (0, d.__)("Normal", "gutsliders"), value: "normal" },
                        { label: (0, d.__)("Italic", "gutsliders"), value: "italic" },
                    ],
                    gn = ({ label: e, controlName: a, objAttrs: t, instanceId: i }) => {
                        const { attributes: r, setAttributes: n } = t,
                            { resMode: s } = r,
                            {
                                [`${f}${a}FontFamily`]: l,
                                [`${a}FontWeight`]: o,
                                [`${a}FontStyle`]: u,
                                [`${a}TextTransform`]: c,
                                [`${a}TextDecoration`]: g,
                                [`${a}FontSizes`]: m,
                                [`${a}LineHeights`]: p,
                                [`${a}LetterSpacings`]: h,
                                [`${a}FontSizeUnits`]: x,
                                [`${a}LineHeightUnits`]: S,
                                [`${a}LetterSpacingUnits`]: k,
                            } = r,
                            [w, C] = (0, Ae.useState)(!1),
                            [N, M] = (0, Ae.useState)(ln);
                        return (
                            (0, Ae.useEffect)(() => {
                                const e = (l || "").replace(/\s+/g, "-"),
                                    a = [{ label: "Default", value: "" }, ...(rn[e] ? rn[e].variants : []).map((e) => ({ label: e, value: e }))];
                                M(a);
                            }, [l]),
                            (0, y.jsxs)("div", {
                                className: "gkits-control-container typography-control",
                                children: [
                                    (0, y.jsxs)(Ie.Flex, {
                                        children: [
                                            (0, y.jsx)(Ie.FlexBlock, { children: (0, y.jsx)(Ie.BaseControl, { id: `typography-control-${i}`, label: e }) }),
                                            (0, y.jsx)(Ie.FlexItem, {
                                                children: (0, y.jsx)(Ie.Button, {
                                                    className: "afterg-btn",
                                                    icon: () =>
                                                        (0, y.jsx)("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            width: 16,
                                                            height: 16,
                                                            viewBox: "0 0 16 16",
                                                            children: (0, y.jsx)("path", {
                                                                d:
                                                                    "M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479L12.258 3z",
                                                            }),
                                                        }),
                                                    label: "Edit",
                                                    onClick: () => C(!0),
                                                }),
                                            }),
                                        ],
                                    }),
                                    w &&
                                        (0, y.jsx)(Ie.Popover, {
                                            position: "bottom left",
                                            className: "gkits-typography-popover",
                                            onClose: () => C(!1),
                                            onFocusOutside: () => C(!1),
                                            offset: 5,
                                            children: (0, y.jsxs)("div", {
                                                className: "gkits-typography-panel gkits-popover",
                                                children: [
                                                    (0, y.jsxs)("div", {
                                                        className: "gkits-mb-8",
                                                        children: [
                                                            (0, y.jsxs)(Ie.Flex, {
                                                                align: "center",
                                                                children: [
                                                                    (0, y.jsx)(Ie.FlexBlock, {
                                                                        children: (0, y.jsx)(He, { id: "font-size-control", label: (0, d.__)("Font Size", "gutsliders"), requiredProps: { resMode: s, setAttributes: n } }),
                                                                    }),
                                                                    (0, y.jsxs)(Ie.FlexItem, {
                                                                        children: [
                                                                            "Desktop" === s && (0, y.jsx)(ze, { value: x && x.desk, onChange: (e) => n({ [`${a}FontSizeUnits`]: { ...x, desk: e } }), units: b }),
                                                                            "Tablet" === s && (0, y.jsx)(ze, { value: x && x.tab, onChange: (e) => n({ [`${a}FontSizeUnits`]: { ...x, tab: e } }), units: b }),
                                                                            "Mobile" === s && (0, y.jsx)(ze, { value: x && x.mob, onChange: (e) => n({ [`${a}FontSizeUnits`]: { ...x, mob: e } }), units: b }),
                                                                        ],
                                                                    }),
                                                                ],
                                                            }),
                                                            (0, y.jsxs)("div", {
                                                                className: "gkits-controls-body",
                                                                id: "font-size-control",
                                                                children: [
                                                                    "Desktop" === s &&
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-rangle",
                                                                            children: (0, y.jsx)(Ge, {
                                                                                onReset: () => n({ [`${a}FontSizes`]: { ...m, desk: "" }, [`${a}FontSizeUnits`]: { ...x, desk: "px" } }),
                                                                                value: m && m.desk,
                                                                                children: (0, y.jsx)(Ie.RangeControl, { value: m && m.desk, onChange: (e) => n({ [`${a}FontSizes`]: { ...m, desk: e } }), min: 1, max: 200 }),
                                                                            }),
                                                                        }),
                                                                    "Tablet" === s &&
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-rangle",
                                                                            children: (0, y.jsx)(Ge, {
                                                                                onReset: () => n({ [`${a}FontSizes`]: { ...m, tab: "" }, [`${a}FontSizeUnits`]: { ...x, tab: "px" } }),
                                                                                value: m && m.tab,
                                                                                children: (0, y.jsx)(Ie.RangeControl, { value: m && m.tab, onChange: (e) => n({ [`${a}FontSizes`]: { ...m, tab: e } }), min: 1, max: 200 }),
                                                                            }),
                                                                        }),
                                                                    "Mobile" === s &&
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-rangle",
                                                                            children: (0, y.jsx)(Ge, {
                                                                                onReset: () => n({ [`${a}FontSizes`]: { ...m, mob: "" }, [`${a}FontSizeUnits`]: { ...x, mob: "px" } }),
                                                                                value: m && m.mob,
                                                                                children: (0, y.jsx)(Ie.RangeControl, { value: m && m.mob, onChange: (e) => n({ [`${a}FontSizes`]: { ...m, mob: e } }), min: 1, max: 200 }),
                                                                            }),
                                                                        }),
                                                                ],
                                                            }),
                                                        ],
                                                    }),
                                                    (0, y.jsx)("div", { className: "gkits-mb-16", children: (0, y.jsx)(nn, { value: l, onChange: (e) => n({ [`${f}${a}FontFamily`]: e }) }) }),
                                                    (0, y.jsx)("div", {
                                                        className: "gkits-mb-16",
                                                        children: (0, y.jsx)(sn, {
                                                            label: (0, d.__)("Font Weight", "gutsliders"),
                                                            value: o,
                                                            options: N,
                                                            onChange: (e) => {
                                                                n({ [`${a}FontWeight`]: e });
                                                            },
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "gkits-mb-16",
                                                        children: (0, y.jsxs)(Ie.Flex, {
                                                            children: [
                                                                (0, y.jsx)(Ie.FlexBlock, { children: (0, y.jsx)("label", { htmlFor: "font-style-control", className: "gkits-label", children: (0, d.__)("Font Style", "gutsliders") }) }),
                                                                (0, y.jsx)(Ie.FlexItem, {
                                                                    children: (0, y.jsx)(Ie.ButtonGroup, {
                                                                        id: "font-style-control",
                                                                        className: "gkits-btn-group",
                                                                        children:
                                                                            cn &&
                                                                            cn.map((e, t) =>
                                                                                (0, y.jsx)(
                                                                                    Ie.Button,
                                                                                    { className: "font-style-btn " + (e.value === u ? "active" : ""), onClick: () => n({ [`${a}FontStyle`]: e.value }), children: e.label },
                                                                                    t
                                                                                )
                                                                            ),
                                                                    }),
                                                                }),
                                                            ],
                                                        }),
                                                    }),
                                                    (0, y.jsx)("div", {
                                                        className: "gkits-mb-16",
                                                        children: (0, y.jsx)(sn, { label: (0, d.__)("Text Decoration", "gutsliders"), value: g, onChange: (e) => n({ [`${a}TextDecoration`]: e }), options: un }),
                                                    }),
                                                    (0, y.jsxs)("div", {
                                                        className: "gkits-mb-24",
                                                        children: [
                                                            (0, y.jsx)("label", { htmlFor: "text-transform-control", className: "gkits-label gkits-mb-8 gkits-inline-block", children: (0, d.__)("Text Transform", "gutsliders") }),
                                                            (0, y.jsx)(Ie.ButtonGroup, {
                                                                id: "text-transform-control",
                                                                className: "gkits-btn-group gkits-full-group text-transform-btn-group",
                                                                children:
                                                                    on &&
                                                                    on.map((e, t) =>
                                                                        (0, y.jsx)(
                                                                            Ie.Button,
                                                                            { className: "text-transform-btn " + (e.value === c ? "active" : ""), onClick: () => n({ [`${a}TextTransform`]: e.value }), children: e.label },
                                                                            t
                                                                        )
                                                                    ),
                                                            }),
                                                        ],
                                                    }),
                                                    (0, y.jsxs)("div", {
                                                        className: "gkits-mb-12",
                                                        children: [
                                                            (0, y.jsxs)(Ie.Flex, {
                                                                align: "flex-start",
                                                                children: [
                                                                    (0, y.jsx)(Ie.FlexBlock, {
                                                                        children: (0, y.jsx)(He, { id: "line-height-control", label: (0, d.__)("Line Height", "gutsliders"), requiredProps: { resMode: s, setAttributes: n } }),
                                                                    }),
                                                                    (0, y.jsxs)(Ie.FlexItem, {
                                                                        children: [
                                                                            "Desktop" === s && (0, y.jsx)(ze, { value: S && S.desk, onChange: (e) => n({ [`${a}LineHeightUnits`]: { ...S, desk: e } }), units: v }),
                                                                            "Tablet" === s && (0, y.jsx)(ze, { value: S && S.tab, onChange: (e) => n({ [`${a}LineHeightUnits`]: { ...S, tab: e } }), units: v }),
                                                                            "Mobile" === s && (0, y.jsx)(ze, { value: S && S.mob, onChange: (e) => n({ [`${a}LineHeightUnits`]: { ...S, mob: e } }), units: v }),
                                                                        ],
                                                                    }),
                                                                ],
                                                            }),
                                                            (0, y.jsxs)("div", {
                                                                className: "gkits-controls-body",
                                                                id: "line-height-control",
                                                                children: [
                                                                    "Desktop" === s &&
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-rangle",
                                                                            children: (0, y.jsx)(Ge, {
                                                                                onReset: () => n({ [`${a}LineHeights`]: { ...p, desk: "" }, [`${a}LineHeightUnits`]: { ...S, desk: "px" } }),
                                                                                value: p && p.desk,
                                                                                children: (0, y.jsx)(Ie.RangeControl, {
                                                                                    value: p && p.desk,
                                                                                    onChange: (e) => n({ [`${a}LineHeights`]: { ...p, desk: e } }),
                                                                                    min: 0,
                                                                                    max: 100,
                                                                                    step: S && "em" === S.desk ? 0.1 : 1,
                                                                                }),
                                                                            }),
                                                                        }),
                                                                    "Tablet" === s &&
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-rangle",
                                                                            children: (0, y.jsx)(Ge, {
                                                                                onReset: () => n({ [`${a}LineHeights`]: { ...p, tab: "" }, [`${a}LineHeightUnits`]: { ...S, tab: "px" } }),
                                                                                value: p && p.tab,
                                                                                children: (0, y.jsx)(Ie.RangeControl, {
                                                                                    value: p && p.tab,
                                                                                    onChange: (e) => n({ [`${a}LineHeights`]: { ...p, tab: e } }),
                                                                                    min: 0,
                                                                                    max: 100,
                                                                                    step: S && "em" === S.tab ? 0.1 : 1,
                                                                                }),
                                                                            }),
                                                                        }),
                                                                    "Mobile" === s &&
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-rangle",
                                                                            children: (0, y.jsx)(Ge, {
                                                                                onReset: () => n({ [`${a}LineHeights`]: { ...p, mob: "" }, [`${a}LineHeightUnits`]: { ...S, mob: "px" } }),
                                                                                value: p && p.mob,
                                                                                children: (0, y.jsx)(Ie.RangeControl, {
                                                                                    value: p && p.mob,
                                                                                    onChange: (e) => n({ [`${a}LineHeights`]: { ...p, mob: e } }),
                                                                                    min: 0,
                                                                                    max: 100,
                                                                                    step: S && "em" === S.mob ? 0.1 : 1,
                                                                                }),
                                                                            }),
                                                                        }),
                                                                ],
                                                            }),
                                                        ],
                                                    }),
                                                    (0, y.jsxs)("div", {
                                                        className: "gkits-mb-0",
                                                        children: [
                                                            (0, y.jsxs)(Ie.Flex, {
                                                                align: "flex-start",
                                                                children: [
                                                                    (0, y.jsx)(Ie.FlexBlock, {
                                                                        children: (0, y.jsx)(He, { id: "letter-spacing-control", label: (0, d.__)("Letter Spacing", "gutsliders"), requiredProps: { resMode: s, setAttributes: n } }),
                                                                    }),
                                                                    (0, y.jsxs)(Ie.FlexItem, {
                                                                        children: [
                                                                            "Desktop" === s && (0, y.jsx)(ze, { value: k && k.desk, onChange: (e) => n({ [`${a}LetterSpacingUnits`]: { ...k, desk: e } }), units: v }),
                                                                            "Tablet" === s && (0, y.jsx)(ze, { value: k && k.tab, onChange: (e) => n({ [`${a}LetterSpacingUnits`]: { ...k, tab: e } }), units: v }),
                                                                            "Mobile" === s && (0, y.jsx)(ze, { value: k && k.mob, onChange: (e) => n({ [`${a}LetterSpacingUnits`]: { ...k, mob: e } }), units: v }),
                                                                        ],
                                                                    }),
                                                                ],
                                                            }),
                                                            (0, y.jsxs)("div", {
                                                                className: "gkits-controls-body",
                                                                id: "letter-spacing-control",
                                                                children: [
                                                                    "Desktop" === s &&
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-rangle",
                                                                            children: (0, y.jsx)(Ge, {
                                                                                onReset: () => n({ [`${a}LetterSpacings`]: { ...h, desk: "" }, [`${a}LetterSpacingUnits`]: { ...k, desk: "px" } }),
                                                                                value: h && h.desk,
                                                                                children: (0, y.jsx)(Ie.RangeControl, {
                                                                                    value: h && h.desk,
                                                                                    onChange: (e) => n({ [`${a}LetterSpacings`]: { ...h, desk: e } }),
                                                                                    min: 0,
                                                                                    max: 100,
                                                                                    step: k && "em" === k.desk ? 0.1 : 1,
                                                                                }),
                                                                            }),
                                                                        }),
                                                                    "Tablet" === s &&
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-rangle",
                                                                            children: (0, y.jsx)(Ge, {
                                                                                onReset: () => n({ [`${a}LetterSpacings`]: { ...h, tab: "" }, [`${a}LetterSpacingUnits`]: { ...k, tab: "px" } }),
                                                                                value: h && h.tab,
                                                                                children: (0, y.jsx)(Ie.RangeControl, {
                                                                                    value: h && h.tab,
                                                                                    onChange: (e) => n({ [`${a}LetterSpacings`]: { ...h, tab: e } }),
                                                                                    min: 0,
                                                                                    max: 100,
                                                                                    step: k && "em" === k.tab ? 0.1 : 1,
                                                                                }),
                                                                            }),
                                                                        }),
                                                                    "Mobile" === s &&
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-rangle",
                                                                            children: (0, y.jsx)(Ge, {
                                                                                onReset: () => n({ [`${a}LetterSpacings`]: { ...h, mob: "" }, [`${a}LetterSpacingUnits`]: { ...k, mob: "px" } }),
                                                                                value: h && h.mob,
                                                                                children: (0, y.jsx)(Ie.RangeControl, {
                                                                                    value: h && h.mob,
                                                                                    onChange: (e) => n({ [`${a}LetterSpacings`]: { ...h, mob: e } }),
                                                                                    min: 0,
                                                                                    max: 100,
                                                                                    step: k && "em" === k.mob ? 0.1 : 1,
                                                                                }),
                                                                            }),
                                                                        }),
                                                                ],
                                                            }),
                                                        ],
                                                    }),
                                                ],
                                            }),
                                        }),
                                ],
                            })
                        );
                    },
                    dn = (0, _e.withInstanceId)(({ label: e, controlName: a, instanceId: t, objAttrs: i, units: r, noHover: n = !1 }) => {
                        const s = `border-control-${t}`,
                            { attributes: l, setAttributes: o } = i,
                            { resMode: u } = l,
                            c = r || b,
                            {
                                [`${a}Style`]: g,
                                [`${a}Colors`]: f,
                                [`${a}LinkStatus`]: m,
                                [`${a}LinkedWidth`]: v,
                                [`${a}Widths`]: p,
                                [`${a}TabLinkStatus`]: h,
                                [`${a}TabLinkedWidth`]: x,
                                [`${a}TabWidths`]: S,
                                [`${a}MobLinkStatus`]: k,
                                [`${a}MobLinkedWidth`]: C,
                                [`${a}MobWidths`]: N,
                                [`${a}Unit`]: M,
                            } = l;
                        return (0, y.jsxs)("div", {
                            className: "gkits-control-container",
                            children: [
                                e && (0, y.jsx)("div", { className: "gkits-mb-8", children: (0, y.jsx)(He, { requiredProps: o, label: e, noResBtns: !0 }) }),
                                (0, y.jsx)("div", {
                                    className: "gkits-border-style gkits-mb-16",
                                    children: (0, y.jsx)(Ie.SelectControl, {
                                        label: (0, d.__)("Border Style", "affiliates-blocks"),
                                        value: g,
                                        options: w,
                                        onChange: (e) => {
                                            o({ [`${a}Style`]: e });
                                        },
                                    }),
                                }),
                                "none" !== g &&
                                    (0, y.jsxs)(Ae.Fragment, {
                                        children: [
                                            (0, y.jsxs)("div", {
                                                className: "gkits-mb-8",
                                                children: [
                                                    (0, y.jsxs)(Ie.Flex, {
                                                        align: "flex-start",
                                                        children: [
                                                            (0, y.jsx)(Ie.FlexItem, { children: (0, y.jsx)(He, { label: (0, d.__)("Border Width", "affiliates-blocks"), requiredProps: { id: s, resMode: u, setAttributes: o } }) }),
                                                            (0, y.jsx)(Ie.FlexItem, { children: (0, y.jsx)(ze, { value: M, onChange: (e) => o({ [`${a}Unit`]: e }), units: c }) }),
                                                        ],
                                                    }),
                                                    (0, y.jsxs)("div", {
                                                        className: "gkits-controls-body",
                                                        id: s,
                                                        children: [
                                                            "Desktop" === u &&
                                                                (0, y.jsxs)("div", {
                                                                    className: "gkits-single-inputs-group",
                                                                    children: [
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Top", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: m ? v : p && p.top,
                                                                                onChange: (e) => o(m ? { [`${a}LinkedWidth`]: parseInt(e) } : { [`${a}Widths`]: { ...p, top: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Right", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: m ? v : p && p.right,
                                                                                onChange: (e) => o(m ? { [`${a}LinkedWidth`]: parseInt(e) } : { [`${a}Widths`]: { ...p, right: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Bottom", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: m ? v : p && p.bottom,
                                                                                onChange: (e) => o(m ? { [`${a}LinkedWidth`]: parseInt(e) } : { [`${a}Widths`]: { ...p, bottom: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Left", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: m ? v : p && p.left,
                                                                                onChange: (e) => o(m ? { [`${a}LinkedWidth`]: parseInt(e) } : { [`${a}Widths`]: { ...p, left: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input desk-linked-btn",
                                                                            children: (0, y.jsx)(Ie.Button, { className: m ? "active" : "", onClick: () => o({ [`${a}LinkStatus`]: !m }), icon: m ? "admin-links" : "editor-unlink" }),
                                                                        }),
                                                                    ],
                                                                }),
                                                            "Tablet" === u &&
                                                                (0, y.jsxs)("div", {
                                                                    className: "gkits-single-inputs-group",
                                                                    children: [
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Top", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: h ? x : S && S.top,
                                                                                onChange: (e) => o(h ? { [`${a}TabLinkedWidth`]: parseInt(e) } : { [`${a}TabWidths`]: { ...S, top: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Right", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: h ? x : S && S.right,
                                                                                onChange: (e) => o(h ? { [`${a}TabLinkedWidth`]: parseInt(e) } : { [`${a}TabWidths`]: { ...S, right: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Bottom", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: h ? x : S && S.bottom,
                                                                                onChange: (e) => o(h ? { [`${a}TabLinkedWidth`]: parseInt(e) } : { [`${a}TabWidths`]: { ...S, bottom: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Left", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: h ? x : S && S.left,
                                                                                onChange: (e) => o(h ? { [`${a}TabLinkedWidth`]: parseInt(e) } : { [`${a}TabWidths`]: { ...S, left: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input desk-linked-btn",
                                                                            children: (0, y.jsx)(Ie.Button, { className: h ? "active" : "", onClick: () => o({ [`${a}TabLinkedStatus`]: !h }), icon: h ? "admin-links" : "editor-unlink" }),
                                                                        }),
                                                                    ],
                                                                }),
                                                            "Mobile" === u &&
                                                                (0, y.jsxs)("div", {
                                                                    className: "gkits-single-inputs-group",
                                                                    children: [
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Top", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: k ? C : N && N.top,
                                                                                onChange: (e) => o(k ? { [`${a}MobLinkedWidth`]: parseInt(e) } : { [`${a}MobWidths`]: { ...N, top: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Right", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: k ? C : N && N.right,
                                                                                onChange: (e) => o(k ? { [`${a}MobLinkedWidth`]: parseInt(e) } : { [`${a}MobWidths`]: { ...N, right: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Bottom", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: k ? C : N && N.bottom,
                                                                                onChange: (e) => o(k ? { [`${a}MobLinkedWidth`]: parseInt(e) } : { [`${a}MobWidths`]: { ...N, bottom: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input",
                                                                            children: (0, y.jsx)(Ie.__experimentalNumberControl, {
                                                                                label: (0, d.__)("Left", "gutsliders"),
                                                                                labelPosition: "bottom",
                                                                                value: k ? C : N && N.left,
                                                                                onChange: (e) => o(k ? { [`${a}MobLinkedWidth`]: parseInt(e) } : { [`${a}MobWidths`]: { ...N, left: parseInt(e) } }),
                                                                                min: 0,
                                                                                max: 100,
                                                                            }),
                                                                        }),
                                                                        (0, y.jsx)("div", {
                                                                            className: "single-input desk-linked-btn",
                                                                            children: (0, y.jsx)(Ie.Button, { className: k ? "active" : "", onClick: () => o({ [`${a}MobLinkedStatus`]: !k }), icon: k ? "admin-links" : "editor-unlink" }),
                                                                        }),
                                                                    ],
                                                                }),
                                                        ],
                                                    }),
                                                ],
                                            }),
                                            n &&
                                                (0, y.jsx)(qe, {
                                                    label: (0, d.__)("Border Color", "affiliates-blocks"),
                                                    color: f && f.normal,
                                                    onChange: (e) => {
                                                        o({ [`${a}Colors`]: { ...f, normal: e } });
                                                    },
                                                }),
                                            !n &&
                                                (0, y.jsx)(Fe, {
                                                    normal: (0, y.jsx)(qe, {
                                                        label: (0, d.__)("Border Color", "affiliates-blocks"),
                                                        color: f && f.normal,
                                                        onChange: (e) => {
                                                            o({ [`${a}Colors`]: { ...f, normal: e } });
                                                        },
                                                    }),
                                                    hover: (0, y.jsx)(qe, {
                                                        label: (0, d.__)("Hover Color", "affiliates-blocks"),
                                                        color: f && f.hover,
                                                        onChange: (e) => {
                                                            o({ [`${a}Colors`]: { ...f, hover: e } });
                                                        },
                                                    }),
                                                }),
                                        ],
                                    }),
                            ],
                        });
                    });
                (0, _e.withInstanceId)(({ instanceId: e, label: a, value: t, onChange: i }) => {
                    const r = `link-control-${e}`,
                        [n, s] = (0, Ae.useState)(!1);
                    return (0, y.jsxs)("div", {
                        className: "gkits-control-container",
                        children: [
                            (0, y.jsx)("div", { className: "gkits-mb-8", children: (0, y.jsx)(He, { requiredProps: r, label: a, noResBtns: !0 }) }),
                            (0, y.jsx)("div", {
                                className: "gkits-linked-control",
                                children: (0, y.jsxs)(Ie.Flex, {
                                    children: [
                                        (0, y.jsx)(Ie.FlexBlock, {
                                            children: (0, y.jsx)(Ie.TextControl, {
                                                value: t && t.url,
                                                onChange: (e) => {
                                                    i({ ...t, url: e });
                                                },
                                            }),
                                        }),
                                        (0, y.jsx)(Ie.FlexItem, {
                                            children: (0, y.jsx)(Ie.Button, {
                                                icon: "admin-generic",
                                                onClick: () => {
                                                    s(!0);
                                                },
                                                className: `gkits-link-extra-btn ${n && "gkits-le-active"}`,
                                            }),
                                        }),
                                    ],
                                }),
                            }),
                            n &&
                                (0, y.jsx)(Ie.Popover, {
                                    position: "bottom left",
                                    className: "gkits-link-extra-popover-container",
                                    onClose: () => {
                                        s(!1);
                                    },
                                    onFocusOutside: () => s(!1),
                                    offset: 8,
                                    children: (0, y.jsxs)("div", {
                                        className: "gkits-link-extra-popover",
                                        children: [
                                            (0, y.jsx)(Ie.ToggleControl, {
                                                label: (0, d.__)("Open in new tab", "affiliates-blocks"),
                                                checked: t && t.openInNewTab,
                                                onChange: () => {
                                                    i({ ...t, openInNewTab: !t.openInNewTab });
                                                },
                                            }),
                                            (0, y.jsx)(Ie.ToggleControl, {
                                                label: (0, d.__)("Add nofollow rel", "affiliates-blocks"),
                                                checked: t && t.addNoFollow,
                                                onChange: () => {
                                                    i({ ...t, addNoFollow: !t.addNoFollow });
                                                },
                                            }),
                                            (0, y.jsx)(Ie.ToggleControl, {
                                                label: (0, d.__)("Add sponsored rel", "affiliates-blocks"),
                                                checked: t && t.addSponsored,
                                                onChange: () => {
                                                    i({ ...t, addSponsored: !t.addSponsored });
                                                },
                                            }),
                                        ],
                                    }),
                                }),
                        ],
                    });
                });
                const yn = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement;
                function fn(e) {
                    const a = Object.prototype.toString.call(e);
                    return "[object Window]" === a || "[object global]" === a;
                }
                function mn(e) {
                    return "nodeType" in e;
                }
                function bn(e) {
                    var a, t;
                    return e ? (fn(e) ? e : mn(e) && null != (a = null == (t = e.ownerDocument) ? void 0 : t.defaultView) ? a : window) : window;
                }
                function vn(e) {
                    const { Document: a } = bn(e);
                    return e instanceof a;
                }
                function pn(e) {
                    return !fn(e) && e instanceof bn(e).HTMLElement;
                }
                function hn(e) {
                    return e ? (fn(e) ? e.document : mn(e) ? (vn(e) ? e : pn(e) ? e.ownerDocument : document) : document) : document;
                }
                const xn = yn ? ua.useLayoutEffect : ua.useEffect;
                function Sn(e) {
                    const a = (0, ua.useRef)(e);
                    return (
                        xn(() => {
                            a.current = e;
                        }),
                        (0, ua.useCallback)(function () {
                            for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
                            return null == a.current ? void 0 : a.current(...t);
                        }, [])
                    );
                }
                function kn(e, a) {
                    void 0 === a && (a = [e]);
                    const t = (0, ua.useRef)(e);
                    return (
                        xn(() => {
                            t.current !== e && (t.current = e);
                        }, a),
                        t
                    );
                }
                function wn(e, a) {
                    const t = (0, ua.useRef)();
                    return (0, ua.useMemo)(() => {
                        const a = e(t.current);
                        return (t.current = a), a;
                    }, [...a]);
                }
                function Cn(e) {
                    const a = Sn(e),
                        t = (0, ua.useRef)(null),
                        i = (0, ua.useCallback)((e) => {
                            e !== t.current && (null == a || a(e, t.current)), (t.current = e);
                        }, []);
                    return [t, i];
                }
                function Nn(e) {
                    const a = (0, ua.useRef)();
                    return (
                        (0, ua.useEffect)(() => {
                            a.current = e;
                        }, [e]),
                        a.current
                    );
                }
                let Mn = {};
                function jn(e, a) {
                    return (0, ua.useMemo)(() => {
                        if (a) return a;
                        const t = null == Mn[e] ? 0 : Mn[e] + 1;
                        return (Mn[e] = t), e + "-" + t;
                    }, [e, a]);
                }
                function $n(e) {
                    return function (a) {
                        for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) i[r - 1] = arguments[r];
                        return i.reduce(
                            (a, t) => {
                                const i = Object.entries(t);
                                for (const [t, r] of i) {
                                    const i = a[t];
                                    null != i && (a[t] = i + e * r);
                                }
                                return a;
                            },
                            { ...a }
                        );
                    };
                }
                const On = $n(1),
                    Bn = $n(-1);
                function Tn(e) {
                    if (!e) return !1;
                    const { KeyboardEvent: a } = bn(e.target);
                    return a && e instanceof a;
                }
                function Ln(e) {
                    if (
                        (function (e) {
                            if (!e) return !1;
                            const { TouchEvent: a } = bn(e.target);
                            return a && e instanceof a;
                        })(e)
                    ) {
                        if (e.touches && e.touches.length) {
                            const { clientX: a, clientY: t } = e.touches[0];
                            return { x: a, y: t };
                        }
                        if (e.changedTouches && e.changedTouches.length) {
                            const { clientX: a, clientY: t } = e.changedTouches[0];
                            return { x: a, y: t };
                        }
                    }
                    return (function (e) {
                        return "clientX" in e && "clientY" in e;
                    })(e)
                        ? { x: e.clientX, y: e.clientY }
                        : null;
                }
                const Rn = Object.freeze({
                        Translate: {
                            toString(e) {
                                if (!e) return;
                                const { x: a, y: t } = e;
                                return "translate3d(" + (a ? Math.round(a) : 0) + "px, " + (t ? Math.round(t) : 0) + "px, 0)";
                            },
                        },
                        Scale: {
                            toString(e) {
                                if (!e) return;
                                const { scaleX: a, scaleY: t } = e;
                                return "scaleX(" + a + ") scaleY(" + t + ")";
                            },
                        },
                        Transform: {
                            toString(e) {
                                if (e) return [Rn.Translate.toString(e), Rn.Scale.toString(e)].join(" ");
                            },
                        },
                        Transition: {
                            toString(e) {
                                let { property: a, duration: t, easing: i } = e;
                                return a + " " + t + "ms " + i;
                            },
                        },
                    }),
                    Pn = "a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]";
                function In(e) {
                    return e.matches(Pn) ? e : e.querySelector(Pn);
                }
                const An = { display: "none" };
                function Dn(e) {
                    let { id: a, value: t } = e;
                    return ca().createElement("div", { id: a, style: An }, t);
                }
                const En = { position: "fixed", width: 1, height: 1, margin: -1, border: 0, padding: 0, overflow: "hidden", clip: "rect(0 0 0 0)", clipPath: "inset(100%)", whiteSpace: "nowrap" };
                function Fn(e) {
                    let { id: a, announcement: t } = e;
                    return ca().createElement("div", { id: a, style: En, role: "status", "aria-live": "assertive", "aria-atomic": !0 }, t);
                }
                const Vn = (0, ua.createContext)(null),
                    Hn = {
                        draggable:
                            "\n    To pick up a draggable item, press the space bar.\n    While dragging, use the arrow keys to move the item.\n    Press space again to drop the item in its new position, or press escape to cancel.\n  ",
                    },
                    Gn = {
                        onDragStart(e) {
                            let { active: a } = e;
                            return "Picked up draggable item " + a.id + ".";
                        },
                        onDragOver(e) {
                            let { active: a, over: t } = e;
                            return t ? "Draggable item " + a.id + " was moved over droppable area " + t.id + "." : "Draggable item " + a.id + " is no longer over a droppable area.";
                        },
                        onDragEnd(e) {
                            let { active: a, over: t } = e;
                            return t ? "Draggable item " + a.id + " was dropped over droppable area " + t.id : "Draggable item " + a.id + " was dropped.";
                        },
                        onDragCancel(e) {
                            let { active: a } = e;
                            return "Dragging was cancelled. Draggable item " + a.id + " was dropped.";
                        },
                    };
                function zn(e) {
                    let { announcements: a = Gn, container: t, hiddenTextDescribedById: i, screenReaderInstructions: r = Hn } = e;
                    const { announce: n, announcement: s } = (function () {
                            const [e, a] = (0, ua.useState)("");
                            return {
                                announce: (0, ua.useCallback)((e) => {
                                    null != e && a(e);
                                }, []),
                                announcement: e,
                            };
                        })(),
                        l = jn("DndLiveRegion"),
                        [o, u] = (0, ua.useState)(!1);
                    if (
                        ((0, ua.useEffect)(() => {
                            u(!0);
                        }, []),
                        (function (e) {
                            const a = (0, ua.useContext)(Vn);
                            (0, ua.useEffect)(() => {
                                if (!a) throw new Error("useDndMonitor must be used within a children of <DndContext>");
                                return a(e);
                            }, [e, a]);
                        })(
                            (0, ua.useMemo)(
                                () => ({
                                    onDragStart(e) {
                                        let { active: t } = e;
                                        n(a.onDragStart({ active: t }));
                                    },
                                    onDragMove(e) {
                                        let { active: t, over: i } = e;
                                        a.onDragMove && n(a.onDragMove({ active: t, over: i }));
                                    },
                                    onDragOver(e) {
                                        let { active: t, over: i } = e;
                                        n(a.onDragOver({ active: t, over: i }));
                                    },
                                    onDragEnd(e) {
                                        let { active: t, over: i } = e;
                                        n(a.onDragEnd({ active: t, over: i }));
                                    },
                                    onDragCancel(e) {
                                        let { active: t, over: i } = e;
                                        n(a.onDragCancel({ active: t, over: i }));
                                    },
                                }),
                                [n, a]
                            )
                        ),
                        !o)
                    )
                        return null;
                    const c = ca().createElement(ca().Fragment, null, ca().createElement(Dn, { id: i, value: r.draggable }), ca().createElement(Fn, { id: l, announcement: s }));
                    return t ? (0, zt.createPortal)(c, t) : c;
                }
                var Un;
                function Kn() {}
                !(function (e) {
                    (e.DragStart = "dragStart"),
                        (e.DragMove = "dragMove"),
                        (e.DragEnd = "dragEnd"),
                        (e.DragCancel = "dragCancel"),
                        (e.DragOver = "dragOver"),
                        (e.RegisterDroppable = "registerDroppable"),
                        (e.SetDroppableDisabled = "setDroppableDisabled"),
                        (e.UnregisterDroppable = "unregisterDroppable");
                })(Un || (Un = {}));
                const Wn = Object.freeze({ x: 0, y: 0 });
                function qn(e, a) {
                    let {
                            data: { value: t },
                        } = e,
                        {
                            data: { value: i },
                        } = a;
                    return i - t;
                }
                function Yn(e, a) {
                    const t = Math.max(a.top, e.top),
                        i = Math.max(a.left, e.left),
                        r = Math.min(a.left + a.width, e.left + e.width),
                        n = Math.min(a.top + a.height, e.top + e.height),
                        s = r - i,
                        l = n - t;
                    if (i < r && t < n) {
                        const t = a.width * a.height,
                            i = e.width * e.height,
                            r = s * l;
                        return Number((r / (t + i - r)).toFixed(4));
                    }
                    return 0;
                }
                const Zn = (e) => {
                    let { collisionRect: a, droppableRects: t, droppableContainers: i } = e;
                    const r = [];
                    for (const e of i) {
                        const { id: i } = e,
                            n = t.get(i);
                        if (n) {
                            const t = Yn(n, a);
                            t > 0 && r.push({ id: i, data: { droppableContainer: e, value: t } });
                        }
                    }
                    return r.sort(qn);
                };
                function Jn(e, a) {
                    return e && a ? { x: e.left - a.left, y: e.top - a.top } : Wn;
                }
                function Xn(e) {
                    return function (a) {
                        for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) i[r - 1] = arguments[r];
                        return i.reduce((a, t) => ({ ...a, top: a.top + e * t.y, bottom: a.bottom + e * t.y, left: a.left + e * t.x, right: a.right + e * t.x }), { ...a });
                    };
                }
                const Qn = Xn(1);
                const es = { ignoreTransform: !1 };
                function as(e, a) {
                    void 0 === a && (a = es);
                    let t = e.getBoundingClientRect();
                    if (a.ignoreTransform) {
                        const { transform: a, transformOrigin: i } = bn(e).getComputedStyle(e);
                        a &&
                            (t = (function (e, a, t) {
                                const i = (function (e) {
                                    if (e.startsWith("matrix3d(")) {
                                        const a = e.slice(9, -1).split(/, /);
                                        return { x: +a[12], y: +a[13], scaleX: +a[0], scaleY: +a[5] };
                                    }
                                    if (e.startsWith("matrix(")) {
                                        const a = e.slice(7, -1).split(/, /);
                                        return { x: +a[4], y: +a[5], scaleX: +a[0], scaleY: +a[3] };
                                    }
                                    return null;
                                })(a);
                                if (!i) return e;
                                const { scaleX: r, scaleY: n, x: s, y: l } = i,
                                    o = e.left - s - (1 - r) * parseFloat(t),
                                    u = e.top - l - (1 - n) * parseFloat(t.slice(t.indexOf(" ") + 1)),
                                    c = r ? e.width / r : e.width,
                                    g = n ? e.height / n : e.height;
                                return { width: c, height: g, top: u, right: o + c, bottom: u + g, left: o };
                            })(t, a, i));
                    }
                    const { top: i, left: r, width: n, height: s, bottom: l, right: o } = t;
                    return { top: i, left: r, width: n, height: s, bottom: l, right: o };
                }
                function ts(e) {
                    return as(e, { ignoreTransform: !0 });
                }
                function is(e, a) {
                    const t = [];
                    return e
                        ? (function i(r) {
                              if (null != a && t.length >= a) return t;
                              if (!r) return t;
                              if (vn(r) && null != r.scrollingElement && !t.includes(r.scrollingElement)) return t.push(r.scrollingElement), t;
                              if (
                                  !pn(r) ||
                                  (function (e) {
                                      return e instanceof bn(e).SVGElement;
                                  })(r)
                              )
                                  return t;
                              if (t.includes(r)) return t;
                              const n = bn(e).getComputedStyle(r);
                              return (
                                  r !== e &&
                                      (function (e, a) {
                                          void 0 === a && (a = bn(e).getComputedStyle(e));
                                          const t = /(auto|scroll|overlay)/;
                                          return ["overflow", "overflowX", "overflowY"].some((e) => {
                                              const i = a[e];
                                              return "string" == typeof i && t.test(i);
                                          });
                                      })(r, n) &&
                                      t.push(r),
                                  (function (e, a) {
                                      return void 0 === a && (a = bn(e).getComputedStyle(e)), "fixed" === a.position;
                                  })(r, n)
                                      ? t
                                      : i(r.parentNode)
                              );
                          })(e)
                        : t;
                }
                function rs(e) {
                    const [a] = is(e, 1);
                    return null != a ? a : null;
                }
                function ns(e) {
                    return yn && e ? (fn(e) ? e : mn(e) ? (vn(e) || e === hn(e).scrollingElement ? window : pn(e) ? e : null) : null) : null;
                }
                function ss(e) {
                    return fn(e) ? e.scrollX : e.scrollLeft;
                }
                function ls(e) {
                    return fn(e) ? e.scrollY : e.scrollTop;
                }
                function os(e) {
                    return { x: ss(e), y: ls(e) };
                }
                var us;
                function cs(e) {
                    return !(!yn || !e) && e === document.scrollingElement;
                }
                function gs(e) {
                    const a = { x: 0, y: 0 },
                        t = cs(e) ? { height: window.innerHeight, width: window.innerWidth } : { height: e.clientHeight, width: e.clientWidth },
                        i = { x: e.scrollWidth - t.width, y: e.scrollHeight - t.height };
                    return { isTop: e.scrollTop <= a.y, isLeft: e.scrollLeft <= a.x, isBottom: e.scrollTop >= i.y, isRight: e.scrollLeft >= i.x, maxScroll: i, minScroll: a };
                }
                !(function (e) {
                    (e[(e.Forward = 1)] = "Forward"), (e[(e.Backward = -1)] = "Backward");
                })(us || (us = {}));
                const ds = { x: 0.2, y: 0.2 };
                function ys(e, a, t, i, r) {
                    let { top: n, left: s, right: l, bottom: o } = t;
                    void 0 === i && (i = 10), void 0 === r && (r = ds);
                    const { isTop: u, isBottom: c, isLeft: g, isRight: d } = gs(e),
                        y = { x: 0, y: 0 },
                        f = { x: 0, y: 0 },
                        m = a.height * r.y,
                        b = a.width * r.x;
                    return (
                        !u && n <= a.top + m ? ((y.y = us.Backward), (f.y = i * Math.abs((a.top + m - n) / m))) : !c && o >= a.bottom - m && ((y.y = us.Forward), (f.y = i * Math.abs((a.bottom - m - o) / m))),
                        !d && l >= a.right - b ? ((y.x = us.Forward), (f.x = i * Math.abs((a.right - b - l) / b))) : !g && s <= a.left + b && ((y.x = us.Backward), (f.x = i * Math.abs((a.left + b - s) / b))),
                        { direction: y, speed: f }
                    );
                }
                function fs(e) {
                    if (e === document.scrollingElement) {
                        const { innerWidth: e, innerHeight: a } = window;
                        return { top: 0, left: 0, right: e, bottom: a, width: e, height: a };
                    }
                    const { top: a, left: t, right: i, bottom: r } = e.getBoundingClientRect();
                    return { top: a, left: t, right: i, bottom: r, width: e.clientWidth, height: e.clientHeight };
                }
                function ms(e) {
                    return e.reduce((e, a) => On(e, os(a)), Wn);
                }
                const bs = [
                    [
                        "x",
                        ["left", "right"],
                        function (e) {
                            return e.reduce((e, a) => e + ss(a), 0);
                        },
                    ],
                    [
                        "y",
                        ["top", "bottom"],
                        function (e) {
                            return e.reduce((e, a) => e + ls(a), 0);
                        },
                    ],
                ];
                class vs {
                    constructor(e, a) {
                        (this.rect = void 0), (this.width = void 0), (this.height = void 0), (this.top = void 0), (this.bottom = void 0), (this.right = void 0), (this.left = void 0);
                        const t = is(a),
                            i = ms(t);
                        (this.rect = { ...e }), (this.width = e.width), (this.height = e.height);
                        for (const [e, a, r] of bs)
                            for (const n of a)
                                Object.defineProperty(this, n, {
                                    get: () => {
                                        const a = r(t),
                                            s = i[e] - a;
                                        return this.rect[n] + s;
                                    },
                                    enumerable: !0,
                                });
                        Object.defineProperty(this, "rect", { enumerable: !1 });
                    }
                }
                class ps {
                    constructor(e) {
                        (this.target = void 0),
                            (this.listeners = []),
                            (this.removeAll = () => {
                                this.listeners.forEach((e) => {
                                    var a;
                                    return null == (a = this.target) ? void 0 : a.removeEventListener(...e);
                                });
                            }),
                            (this.target = e);
                    }
                    add(e, a, t) {
                        var i;
                        null == (i = this.target) || i.addEventListener(e, a, t), this.listeners.push([e, a, t]);
                    }
                }
                function hs(e, a) {
                    const t = Math.abs(e.x),
                        i = Math.abs(e.y);
                    return "number" == typeof a ? Math.sqrt(t ** 2 + i ** 2) > a : "x" in a && "y" in a ? t > a.x && i > a.y : "x" in a ? t > a.x : "y" in a && i > a.y;
                }
                var xs, Ss, ks;
                function ws(e) {
                    e.preventDefault();
                }
                function Cs(e) {
                    e.stopPropagation();
                }
                !(function (e) {
                    (e.Click = "click"), (e.DragStart = "dragstart"), (e.Keydown = "keydown"), (e.ContextMenu = "contextmenu"), (e.Resize = "resize"), (e.SelectionChange = "selectionchange"), (e.VisibilityChange = "visibilitychange");
                })(xs || (xs = {})),
                    ((ks = Ss || (Ss = {})).Space = "Space"),
                    (ks.Down = "ArrowDown"),
                    (ks.Right = "ArrowRight"),
                    (ks.Left = "ArrowLeft"),
                    (ks.Up = "ArrowUp"),
                    (ks.Esc = "Escape"),
                    (ks.Enter = "Enter");
                const Ns = { start: [Ss.Space, Ss.Enter], cancel: [Ss.Esc], end: [Ss.Space, Ss.Enter] },
                    Ms = (e, a) => {
                        let { currentCoordinates: t } = a;
                        switch (e.code) {
                            case Ss.Right:
                                return { ...t, x: t.x + 25 };
                            case Ss.Left:
                                return { ...t, x: t.x - 25 };
                            case Ss.Down:
                                return { ...t, y: t.y + 25 };
                            case Ss.Up:
                                return { ...t, y: t.y - 25 };
                        }
                    };
                class js {
                    constructor(e) {
                        (this.props = void 0), (this.autoScrollEnabled = !1), (this.referenceCoordinates = void 0), (this.listeners = void 0), (this.windowListeners = void 0), (this.props = e);
                        const {
                            event: { target: a },
                        } = e;
                        (this.props = e), (this.listeners = new ps(hn(a))), (this.windowListeners = new ps(bn(a))), (this.handleKeyDown = this.handleKeyDown.bind(this)), (this.handleCancel = this.handleCancel.bind(this)), this.attach();
                    }
                    attach() {
                        this.handleStart(), this.windowListeners.add(xs.Resize, this.handleCancel), this.windowListeners.add(xs.VisibilityChange, this.handleCancel), setTimeout(() => this.listeners.add(xs.Keydown, this.handleKeyDown));
                    }
                    handleStart() {
                        const { activeNode: e, onStart: a } = this.props,
                            t = e.node.current;
                        t &&
                            (function (e, a) {
                                if ((void 0 === a && (a = as), !e)) return;
                                const { top: t, left: i, bottom: r, right: n } = a(e);
                                rs(e) && (r <= 0 || n <= 0 || t >= window.innerHeight || i >= window.innerWidth) && e.scrollIntoView({ block: "center", inline: "center" });
                            })(t),
                            a(Wn);
                    }
                    handleKeyDown(e) {
                        if (Tn(e)) {
                            const { active: a, context: t, options: i } = this.props,
                                { keyboardCodes: r = Ns, coordinateGetter: n = Ms, scrollBehavior: s = "smooth" } = i,
                                { code: l } = e;
                            if (r.end.includes(l)) return void this.handleEnd(e);
                            if (r.cancel.includes(l)) return void this.handleCancel(e);
                            const { collisionRect: o } = t.current,
                                u = o ? { x: o.left, y: o.top } : Wn;
                            this.referenceCoordinates || (this.referenceCoordinates = u);
                            const c = n(e, { active: a, context: t.current, currentCoordinates: u });
                            if (c) {
                                const a = Bn(c, u),
                                    i = { x: 0, y: 0 },
                                    { scrollableAncestors: r } = t.current;
                                for (const t of r) {
                                    const r = e.code,
                                        { isTop: n, isRight: l, isLeft: o, isBottom: u, maxScroll: g, minScroll: d } = gs(t),
                                        y = fs(t),
                                        f = {
                                            x: Math.min(r === Ss.Right ? y.right - y.width / 2 : y.right, Math.max(r === Ss.Right ? y.left : y.left + y.width / 2, c.x)),
                                            y: Math.min(r === Ss.Down ? y.bottom - y.height / 2 : y.bottom, Math.max(r === Ss.Down ? y.top : y.top + y.height / 2, c.y)),
                                        },
                                        m = (r === Ss.Right && !l) || (r === Ss.Left && !o),
                                        b = (r === Ss.Down && !u) || (r === Ss.Up && !n);
                                    if (m && f.x !== c.x) {
                                        const e = t.scrollLeft + a.x,
                                            n = (r === Ss.Right && e <= g.x) || (r === Ss.Left && e >= d.x);
                                        if (n && !a.y) return void t.scrollTo({ left: e, behavior: s });
                                        (i.x = n ? t.scrollLeft - e : r === Ss.Right ? t.scrollLeft - g.x : t.scrollLeft - d.x), i.x && t.scrollBy({ left: -i.x, behavior: s });
                                        break;
                                    }
                                    if (b && f.y !== c.y) {
                                        const e = t.scrollTop + a.y,
                                            n = (r === Ss.Down && e <= g.y) || (r === Ss.Up && e >= d.y);
                                        if (n && !a.x) return void t.scrollTo({ top: e, behavior: s });
                                        (i.y = n ? t.scrollTop - e : r === Ss.Down ? t.scrollTop - g.y : t.scrollTop - d.y), i.y && t.scrollBy({ top: -i.y, behavior: s });
                                        break;
                                    }
                                }
                                this.handleMove(e, On(Bn(c, this.referenceCoordinates), i));
                            }
                        }
                    }
                    handleMove(e, a) {
                        const { onMove: t } = this.props;
                        e.preventDefault(), t(a);
                    }
                    handleEnd(e) {
                        const { onEnd: a } = this.props;
                        e.preventDefault(), this.detach(), a();
                    }
                    handleCancel(e) {
                        const { onCancel: a } = this.props;
                        e.preventDefault(), this.detach(), a();
                    }
                    detach() {
                        this.listeners.removeAll(), this.windowListeners.removeAll();
                    }
                }
                function $s(e) {
                    return Boolean(e && "distance" in e);
                }
                function Os(e) {
                    return Boolean(e && "delay" in e);
                }
                js.activators = [
                    {
                        eventName: "onKeyDown",
                        handler: (e, a, t) => {
                            let { keyboardCodes: i = Ns, onActivation: r } = a,
                                { active: n } = t;
                            const { code: s } = e.nativeEvent;
                            if (i.start.includes(s)) {
                                const a = n.activatorNode.current;
                                return !((a && e.target !== a) || (e.preventDefault(), null == r || r({ event: e.nativeEvent }), 0));
                            }
                            return !1;
                        },
                    },
                ];
                class Bs {
                    constructor(e, a, t) {
                        var i;
                        void 0 === t &&
                            (t = (function (e) {
                                const { EventTarget: a } = bn(e);
                                return e instanceof a ? e : hn(e);
                            })(e.event.target)),
                            (this.props = void 0),
                            (this.events = void 0),
                            (this.autoScrollEnabled = !0),
                            (this.document = void 0),
                            (this.activated = !1),
                            (this.initialCoordinates = void 0),
                            (this.timeoutId = null),
                            (this.listeners = void 0),
                            (this.documentListeners = void 0),
                            (this.windowListeners = void 0),
                            (this.props = e),
                            (this.events = a);
                        const { event: r } = e,
                            { target: n } = r;
                        (this.props = e),
                            (this.events = a),
                            (this.document = hn(n)),
                            (this.documentListeners = new ps(this.document)),
                            (this.listeners = new ps(t)),
                            (this.windowListeners = new ps(bn(n))),
                            (this.initialCoordinates = null != (i = Ln(r)) ? i : Wn),
                            (this.handleStart = this.handleStart.bind(this)),
                            (this.handleMove = this.handleMove.bind(this)),
                            (this.handleEnd = this.handleEnd.bind(this)),
                            (this.handleCancel = this.handleCancel.bind(this)),
                            (this.handleKeydown = this.handleKeydown.bind(this)),
                            (this.removeTextSelection = this.removeTextSelection.bind(this)),
                            this.attach();
                    }
                    attach() {
                        const {
                            events: e,
                            props: {
                                options: { activationConstraint: a },
                            },
                        } = this;
                        if (
                            (this.listeners.add(e.move.name, this.handleMove, { passive: !1 }),
                            this.listeners.add(e.end.name, this.handleEnd),
                            this.windowListeners.add(xs.Resize, this.handleCancel),
                            this.windowListeners.add(xs.DragStart, ws),
                            this.windowListeners.add(xs.VisibilityChange, this.handleCancel),
                            this.windowListeners.add(xs.ContextMenu, ws),
                            this.documentListeners.add(xs.Keydown, this.handleKeydown),
                            a)
                        ) {
                            if ($s(a)) return;
                            if (Os(a)) return void (this.timeoutId = setTimeout(this.handleStart, a.delay));
                        }
                        this.handleStart();
                    }
                    detach() {
                        this.listeners.removeAll(), this.windowListeners.removeAll(), setTimeout(this.documentListeners.removeAll, 50), null !== this.timeoutId && (clearTimeout(this.timeoutId), (this.timeoutId = null));
                    }
                    handleStart() {
                        const { initialCoordinates: e } = this,
                            { onStart: a } = this.props;
                        e && ((this.activated = !0), this.documentListeners.add(xs.Click, Cs, { capture: !0 }), this.removeTextSelection(), this.documentListeners.add(xs.SelectionChange, this.removeTextSelection), a(e));
                    }
                    handleMove(e) {
                        var a;
                        const { activated: t, initialCoordinates: i, props: r } = this,
                            {
                                onMove: n,
                                options: { activationConstraint: s },
                            } = r;
                        if (!i) return;
                        const l = null != (a = Ln(e)) ? a : Wn,
                            o = Bn(i, l);
                        if (!t && s) {
                            if (Os(s)) return hs(o, s.tolerance) ? this.handleCancel() : void 0;
                            if ($s(s)) return null != s.tolerance && hs(o, s.tolerance) ? this.handleCancel() : hs(o, s.distance) ? this.handleStart() : void 0;
                        }
                        e.cancelable && e.preventDefault(), n(l);
                    }
                    handleEnd() {
                        const { onEnd: e } = this.props;
                        this.detach(), e();
                    }
                    handleCancel() {
                        const { onCancel: e } = this.props;
                        this.detach(), e();
                    }
                    handleKeydown(e) {
                        e.code === Ss.Esc && this.handleCancel();
                    }
                    removeTextSelection() {
                        var e;
                        null == (e = this.document.getSelection()) || e.removeAllRanges();
                    }
                }
                const Ts = { move: { name: "pointermove" }, end: { name: "pointerup" } };
                class Ls extends Bs {
                    constructor(e) {
                        const { event: a } = e,
                            t = hn(a.target);
                        super(e, Ts, t);
                    }
                }
                Ls.activators = [
                    {
                        eventName: "onPointerDown",
                        handler: (e, a) => {
                            let { nativeEvent: t } = e,
                                { onActivation: i } = a;
                            return !(!t.isPrimary || 0 !== t.button || (null == i || i({ event: t }), 0));
                        },
                    },
                ];
                const Rs = { move: { name: "mousemove" }, end: { name: "mouseup" } };
                var Ps;
                !(function (e) {
                    e[(e.RightClick = 2)] = "RightClick";
                })(Ps || (Ps = {})),
                    (class extends Bs {
                        constructor(e) {
                            super(e, Rs, hn(e.event.target));
                        }
                    }.activators = [
                        {
                            eventName: "onMouseDown",
                            handler: (e, a) => {
                                let { nativeEvent: t } = e,
                                    { onActivation: i } = a;
                                return t.button !== Ps.RightClick && (null == i || i({ event: t }), !0);
                            },
                        },
                    ]);
                const Is = { move: { name: "touchmove" }, end: { name: "touchend" } };
                var As, Ds;
                ((class extends Bs {
                    constructor(e) {
                        super(e, Is);
                    }
                    static setup() {
                        return (
                            window.addEventListener(Is.move.name, e, { capture: !1, passive: !1 }),
                            function () {
                                window.removeEventListener(Is.move.name, e);
                            }
                        );
                        function e() {}
                    }
                }.activators = [
                    {
                        eventName: "onTouchStart",
                        handler: (e, a) => {
                            let { nativeEvent: t } = e,
                                { onActivation: i } = a;
                            const { touches: r } = t;
                            return !(r.length > 1 || (null == i || i({ event: t }), 0));
                        },
                    },
                ]),
                    (function (e) {
                        (e[(e.Pointer = 0)] = "Pointer"), (e[(e.DraggableRect = 1)] = "DraggableRect");
                    })(As || (As = {})),
                    (function (e) {
                        (e[(e.TreeOrder = 0)] = "TreeOrder"), (e[(e.ReversedTreeOrder = 1)] = "ReversedTreeOrder");
                    })(Ds || (Ds = {})));
                const _s = { x: { [us.Backward]: !1, [us.Forward]: !1 }, y: { [us.Backward]: !1, [us.Forward]: !1 } };
                var Es, Fs;
                !(function (e) {
                    (e[(e.Always = 0)] = "Always"), (e[(e.BeforeDragging = 1)] = "BeforeDragging"), (e[(e.WhileDragging = 2)] = "WhileDragging");
                })(Es || (Es = {})),
                    (function (e) {
                        e.Optimized = "optimized";
                    })(Fs || (Fs = {}));
                const Vs = new Map();
                function Hs(e, a) {
                    return wn((t) => (e ? t || ("function" == typeof a ? a(e) : e) : null), [a, e]);
                }
                function Gs(e) {
                    let { callback: a, disabled: t } = e;
                    const i = Sn(a),
                        r = (0, ua.useMemo)(() => {
                            if (t || "undefined" == typeof window || void 0 === window.ResizeObserver) return;
                            const { ResizeObserver: e } = window;
                            return new e(i);
                        }, [t]);
                    return (0, ua.useEffect)(() => () => (null == r ? void 0 : r.disconnect()), [r]), r;
                }
                function zs(e) {
                    return new vs(as(e), e);
                }
                function Us(e, a, t) {
                    void 0 === a && (a = zs);
                    const [i, r] = (0, ua.useReducer)(function (i) {
                            if (!e) return null;
                            var r;
                            if (!1 === e.isConnected) return null != (r = null != i ? i : t) ? r : null;
                            const n = a(e);
                            return JSON.stringify(i) === JSON.stringify(n) ? i : n;
                        }, null),
                        n = (function (e) {
                            let { callback: a, disabled: t } = e;
                            const i = Sn(a),
                                r = (0, ua.useMemo)(() => {
                                    if (t || "undefined" == typeof window || void 0 === window.MutationObserver) return;
                                    const { MutationObserver: e } = window;
                                    return new e(i);
                                }, [i, t]);
                            return (0, ua.useEffect)(() => () => (null == r ? void 0 : r.disconnect()), [r]), r;
                        })({
                            callback(a) {
                                if (e)
                                    for (const t of a) {
                                        const { type: a, target: i } = t;
                                        if ("childList" === a && i instanceof HTMLElement && i.contains(e)) {
                                            r();
                                            break;
                                        }
                                    }
                            },
                        }),
                        s = Gs({ callback: r });
                    return (
                        xn(() => {
                            r(), e ? (null == s || s.observe(e), null == n || n.observe(document.body, { childList: !0, subtree: !0 })) : (null == s || s.disconnect(), null == n || n.disconnect());
                        }, [e]),
                        i
                    );
                }
                const Ks = [];
                function Ws(e, a) {
                    void 0 === a && (a = []);
                    const t = (0, ua.useRef)(null);
                    return (
                        (0, ua.useEffect)(() => {
                            t.current = null;
                        }, a),
                        (0, ua.useEffect)(() => {
                            const a = e !== Wn;
                            a && !t.current && (t.current = e), !a && t.current && (t.current = null);
                        }, [e]),
                        t.current ? Bn(e, t.current) : Wn
                    );
                }
                function qs(e) {
                    return (0, ua.useMemo)(
                        () =>
                            e
                                ? (function (e) {
                                      const a = e.innerWidth,
                                          t = e.innerHeight;
                                      return { top: 0, left: 0, right: a, bottom: t, width: a, height: t };
                                  })(e)
                                : null,
                        [e]
                    );
                }
                const Ys = [];
                const Zs = [
                        { sensor: Ls, options: {} },
                        { sensor: js, options: {} },
                    ],
                    Js = { current: {} },
                    Xs = { draggable: { measure: ts }, droppable: { measure: ts, strategy: Es.WhileDragging, frequency: Fs.Optimized }, dragOverlay: { measure: as } };
                class Qs extends Map {
                    get(e) {
                        var a;
                        return null != e && null != (a = super.get(e)) ? a : void 0;
                    }
                    toArray() {
                        return Array.from(this.values());
                    }
                    getEnabled() {
                        return this.toArray().filter((e) => {
                            let { disabled: a } = e;
                            return !a;
                        });
                    }
                    getNodeFor(e) {
                        var a, t;
                        return null != (a = null == (t = this.get(e)) ? void 0 : t.node.current) ? a : void 0;
                    }
                }
                const el = {
                        activatorEvent: null,
                        active: null,
                        activeNode: null,
                        activeNodeRect: null,
                        collisions: null,
                        containerNodeRect: null,
                        draggableNodes: new Map(),
                        droppableRects: new Map(),
                        droppableContainers: new Qs(),
                        over: null,
                        dragOverlay: { nodeRef: { current: null }, rect: null, setRef: Kn },
                        scrollableAncestors: [],
                        scrollableAncestorRects: [],
                        measuringConfiguration: Xs,
                        measureDroppableContainers: Kn,
                        windowRect: null,
                        measuringScheduled: !1,
                    },
                    al = { activatorEvent: null, activators: [], active: null, activeNodeRect: null, ariaDescribedById: { draggable: "" }, dispatch: Kn, draggableNodes: new Map(), over: null, measureDroppableContainers: Kn },
                    tl = (0, ua.createContext)(al),
                    il = (0, ua.createContext)(el);
                function rl() {
                    return { draggable: { active: null, initialCoordinates: { x: 0, y: 0 }, nodes: new Map(), translate: { x: 0, y: 0 } }, droppable: { containers: new Qs() } };
                }
                function nl(e, a) {
                    switch (a.type) {
                        case Un.DragStart:
                            return { ...e, draggable: { ...e.draggable, initialCoordinates: a.initialCoordinates, active: a.active } };
                        case Un.DragMove:
                            return e.draggable.active ? { ...e, draggable: { ...e.draggable, translate: { x: a.coordinates.x - e.draggable.initialCoordinates.x, y: a.coordinates.y - e.draggable.initialCoordinates.y } } } : e;
                        case Un.DragEnd:
                        case Un.DragCancel:
                            return { ...e, draggable: { ...e.draggable, active: null, initialCoordinates: { x: 0, y: 0 }, translate: { x: 0, y: 0 } } };
                        case Un.RegisterDroppable: {
                            const { element: t } = a,
                                { id: i } = t,
                                r = new Qs(e.droppable.containers);
                            return r.set(i, t), { ...e, droppable: { ...e.droppable, containers: r } };
                        }
                        case Un.SetDroppableDisabled: {
                            const { id: t, key: i, disabled: r } = a,
                                n = e.droppable.containers.get(t);
                            if (!n || i !== n.key) return e;
                            const s = new Qs(e.droppable.containers);
                            return s.set(t, { ...n, disabled: r }), { ...e, droppable: { ...e.droppable, containers: s } };
                        }
                        case Un.UnregisterDroppable: {
                            const { id: t, key: i } = a,
                                r = e.droppable.containers.get(t);
                            if (!r || i !== r.key) return e;
                            const n = new Qs(e.droppable.containers);
                            return n.delete(t), { ...e, droppable: { ...e.droppable, containers: n } };
                        }
                        default:
                            return e;
                    }
                }
                function sl(e) {
                    let { disabled: a } = e;
                    const { active: t, activatorEvent: i, draggableNodes: r } = (0, ua.useContext)(tl),
                        n = Nn(i),
                        s = Nn(null == t ? void 0 : t.id);
                    return (
                        (0, ua.useEffect)(() => {
                            if (!a && !i && n && null != s) {
                                if (!Tn(n)) return;
                                if (document.activeElement === n.target) return;
                                const e = r.get(s);
                                if (!e) return;
                                const { activatorNode: a, node: t } = e;
                                if (!a.current && !t.current) return;
                                requestAnimationFrame(() => {
                                    for (const e of [a.current, t.current]) {
                                        if (!e) continue;
                                        const a = In(e);
                                        if (a) {
                                            a.focus();
                                            break;
                                        }
                                    }
                                });
                            }
                        }, [i, a, r, s, n]),
                        null
                    );
                }
                const ll = (0, ua.createContext)({ ...Wn, scaleX: 1, scaleY: 1 });
                var ol;
                !(function (e) {
                    (e[(e.Uninitialized = 0)] = "Uninitialized"), (e[(e.Initializing = 1)] = "Initializing"), (e[(e.Initialized = 2)] = "Initialized");
                })(ol || (ol = {}));
                const ul = (0, ua.memo)(function (e) {
                        var a, t, i, r;
                        let { id: n, accessibility: s, autoScroll: l = !0, children: o, sensors: u = Zs, collisionDetection: c = Zn, measuring: g, modifiers: d, ...y } = e;
                        const f = (0, ua.useReducer)(nl, void 0, rl),
                            [m, b] = f,
                            [v, p] = (function () {
                                const [e] = (0, ua.useState)(() => new Set()),
                                    a = (0, ua.useCallback)((a) => (e.add(a), () => e.delete(a)), [e]),
                                    t = (0, ua.useCallback)(
                                        (a) => {
                                            let { type: t, event: i } = a;
                                            e.forEach((e) => {
                                                var a;
                                                return null == (a = e[t]) ? void 0 : a.call(e, i);
                                            });
                                        },
                                        [e]
                                    );
                                return [t, a];
                            })(),
                            [h, x] = (0, ua.useState)(ol.Uninitialized),
                            S = h === ol.Initialized,
                            {
                                draggable: { active: k, nodes: w, translate: C },
                                droppable: { containers: N },
                            } = m,
                            M = k ? w.get(k) : null,
                            j = (0, ua.useRef)({ initial: null, translated: null }),
                            $ = (0, ua.useMemo)(() => {
                                var e;
                                return null != k ? { id: k, data: null != (e = null == M ? void 0 : M.data) ? e : Js, rect: j } : null;
                            }, [k, M]),
                            O = (0, ua.useRef)(null),
                            [B, T] = (0, ua.useState)(null),
                            [L, R] = (0, ua.useState)(null),
                            P = kn(y, Object.values(y)),
                            I = jn("DndDescribedBy", n),
                            A = (0, ua.useMemo)(() => N.getEnabled(), [N]),
                            D = (function (e) {
                                return (0, ua.useMemo)(
                                    () => ({
                                        draggable: { ...Xs.draggable, ...(null == e ? void 0 : e.draggable) },
                                        droppable: { ...Xs.droppable, ...(null == e ? void 0 : e.droppable) },
                                        dragOverlay: { ...Xs.dragOverlay, ...(null == e ? void 0 : e.dragOverlay) },
                                    }),
                                    [null == e ? void 0 : e.draggable, null == e ? void 0 : e.droppable, null == e ? void 0 : e.dragOverlay]
                                );
                            })(g),
                            { droppableRects: _, measureDroppableContainers: E, measuringScheduled: F } = (function (e, a) {
                                let { dragging: t, dependencies: i, config: r } = a;
                                const [n, s] = (0, ua.useState)(null),
                                    { frequency: l, measure: o, strategy: u } = r,
                                    c = (0, ua.useRef)(e),
                                    g = (function () {
                                        switch (u) {
                                            case Es.Always:
                                                return !1;
                                            case Es.BeforeDragging:
                                                return t;
                                            default:
                                                return !t;
                                        }
                                    })(),
                                    d = kn(g),
                                    y = (0, ua.useCallback)(
                                        function (e) {
                                            void 0 === e && (e = []), d.current || s((a) => (null === a ? e : a.concat(e.filter((e) => !a.includes(e)))));
                                        },
                                        [d]
                                    ),
                                    f = (0, ua.useRef)(null),
                                    m = wn(
                                        (a) => {
                                            if (g && !t) return Vs;
                                            if (!a || a === Vs || c.current !== e || null != n) {
                                                const a = new Map();
                                                for (let t of e) {
                                                    if (!t) continue;
                                                    if (n && n.length > 0 && !n.includes(t.id) && t.rect.current) {
                                                        a.set(t.id, t.rect.current);
                                                        continue;
                                                    }
                                                    const e = t.node.current,
                                                        i = e ? new vs(o(e), e) : null;
                                                    (t.rect.current = i), i && a.set(t.id, i);
                                                }
                                                return a;
                                            }
                                            return a;
                                        },
                                        [e, n, t, g, o]
                                    );
                                return (
                                    (0, ua.useEffect)(() => {
                                        c.current = e;
                                    }, [e]),
                                    (0, ua.useEffect)(() => {
                                        g || y();
                                    }, [t, g]),
                                    (0, ua.useEffect)(() => {
                                        n && n.length > 0 && s(null);
                                    }, [JSON.stringify(n)]),
                                    (0, ua.useEffect)(() => {
                                        g ||
                                            "number" != typeof l ||
                                            null !== f.current ||
                                            (f.current = setTimeout(() => {
                                                y(), (f.current = null);
                                            }, l));
                                    }, [l, g, y, ...i]),
                                    { droppableRects: m, measureDroppableContainers: y, measuringScheduled: null != n }
                                );
                            })(A, { dragging: S, dependencies: [C.x, C.y], config: D.droppable }),
                            V = (function (e, a) {
                                const t = null !== a ? e.get(a) : void 0,
                                    i = t ? t.node.current : null;
                                return wn(
                                    (e) => {
                                        var t;
                                        return null === a ? null : null != (t = null != i ? i : e) ? t : null;
                                    },
                                    [i, a]
                                );
                            })(w, k),
                            H = (0, ua.useMemo)(() => (L ? Ln(L) : null), [L]),
                            G = (function () {
                                const e = !1 === (null == B ? void 0 : B.autoScrollEnabled),
                                    a = "object" == typeof l ? !1 === l.enabled : !1 === l,
                                    t = S && !e && !a;
                                return "object" == typeof l ? { ...l, enabled: t } : { enabled: t };
                            })(),
                            z = (function (e, a) {
                                return Hs(e, a);
                            })(V, D.draggable.measure);
                        !(function (e) {
                            let { activeNode: a, measure: t, initialRect: i, config: r = !0 } = e;
                            const n = (0, ua.useRef)(!1),
                                { x: s, y: l } = "boolean" == typeof r ? { x: r, y: r } : r;
                            xn(() => {
                                if ((!s && !l) || !a) return void (n.current = !1);
                                if (n.current || !i) return;
                                const e = null == a ? void 0 : a.node.current;
                                if (!e || !1 === e.isConnected) return;
                                const r = Jn(t(e), i);
                                if ((s || (r.x = 0), l || (r.y = 0), (n.current = !0), Math.abs(r.x) > 0 || Math.abs(r.y) > 0)) {
                                    const a = rs(e);
                                    a && a.scrollBy({ top: r.y, left: r.x });
                                }
                            }, [a, s, l, i, t]);
                        })({ activeNode: k ? w.get(k) : null, config: G.layoutShiftCompensation, initialRect: z, measure: D.draggable.measure });
                        const U = Us(V, D.draggable.measure, z),
                            K = Us(V ? V.parentElement : null),
                            W = (0, ua.useRef)({
                                activatorEvent: null,
                                active: null,
                                activeNode: V,
                                collisionRect: null,
                                collisions: null,
                                droppableRects: _,
                                draggableNodes: w,
                                draggingNode: null,
                                draggingNodeRect: null,
                                droppableContainers: N,
                                over: null,
                                scrollableAncestors: [],
                                scrollAdjustedTranslate: null,
                            }),
                            q = N.getNodeFor(null == (a = W.current.over) ? void 0 : a.id),
                            Y = (function (e) {
                                let { measure: a } = e;
                                const [t, i] = (0, ua.useState)(null),
                                    r = Gs({
                                        callback: (0, ua.useCallback)(
                                            (e) => {
                                                for (const { target: t } of e)
                                                    if (pn(t)) {
                                                        i((e) => {
                                                            const i = a(t);
                                                            return e ? { ...e, width: i.width, height: i.height } : i;
                                                        });
                                                        break;
                                                    }
                                            },
                                            [a]
                                        ),
                                    }),
                                    n = (0, ua.useCallback)(
                                        (e) => {
                                            const t = (function (e) {
                                                if (!e) return null;
                                                if (e.children.length > 1) return e;
                                                const a = e.children[0];
                                                return pn(a) ? a : e;
                                            })(e);
                                            null == r || r.disconnect(), t && (null == r || r.observe(t)), i(t ? a(t) : null);
                                        },
                                        [a, r]
                                    ),
                                    [s, l] = Cn(n);
                                return (0, ua.useMemo)(() => ({ nodeRef: s, rect: t, setRef: l }), [t, s, l]);
                            })({ measure: D.dragOverlay.measure }),
                            Z = null != (t = Y.nodeRef.current) ? t : V,
                            J = S ? (null != (i = Y.rect) ? i : U) : null,
                            X = Boolean(Y.nodeRef.current && Y.rect),
                            Q = Jn((ee = X ? null : U), Hs(ee));
                        var ee;
                        const ae = qs(Z ? bn(Z) : null),
                            te = (function (e) {
                                const a = (0, ua.useRef)(e),
                                    t = wn((t) => (e ? (t && t !== Ks && e && a.current && e.parentNode === a.current.parentNode ? t : is(e)) : Ks), [e]);
                                return (
                                    (0, ua.useEffect)(() => {
                                        a.current = e;
                                    }, [e]),
                                    t
                                );
                            })(S ? (null != q ? q : V) : null),
                            ie = (function (e, a) {
                                void 0 === a && (a = as);
                                const [t] = e,
                                    i = qs(t ? bn(t) : null),
                                    [r, n] = (0, ua.useReducer)(function () {
                                        return e.length ? e.map((e) => (cs(e) ? i : new vs(a(e), e))) : Ys;
                                    }, Ys),
                                    s = Gs({ callback: n });
                                return (
                                    e.length > 0 && r === Ys && n(),
                                    xn(() => {
                                        e.length ? e.forEach((e) => (null == s ? void 0 : s.observe(e))) : (null == s || s.disconnect(), n());
                                    }, [e]),
                                    r
                                );
                            })(te),
                            re = (function (e, a) {
                                let { transform: t, ...i } = a;
                                return null != e && e.length ? e.reduce((e, a) => a({ transform: e, ...i }), t) : t;
                            })(d, {
                                transform: { x: C.x - Q.x, y: C.y - Q.y, scaleX: 1, scaleY: 1 },
                                activatorEvent: L,
                                active: $,
                                activeNodeRect: U,
                                containerNodeRect: K,
                                draggingNodeRect: J,
                                over: W.current.over,
                                overlayNodeRect: Y.rect,
                                scrollableAncestors: te,
                                scrollableAncestorRects: ie,
                                windowRect: ae,
                            }),
                            ne = H ? On(H, C) : null,
                            se = (function (e) {
                                const [a, t] = (0, ua.useState)(null),
                                    i = (0, ua.useRef)(e),
                                    r = (0, ua.useCallback)((e) => {
                                        const a = ns(e.target);
                                        a && t((e) => (e ? (e.set(a, os(a)), new Map(e)) : null));
                                    }, []);
                                return (
                                    (0, ua.useEffect)(() => {
                                        const a = i.current;
                                        if (e !== a) {
                                            n(a);
                                            const s = e
                                                .map((e) => {
                                                    const a = ns(e);
                                                    return a ? (a.addEventListener("scroll", r, { passive: !0 }), [a, os(a)]) : null;
                                                })
                                                .filter((e) => null != e);
                                            t(s.length ? new Map(s) : null), (i.current = e);
                                        }
                                        return () => {
                                            n(e), n(a);
                                        };
                                        function n(e) {
                                            e.forEach((e) => {
                                                const a = ns(e);
                                                null == a || a.removeEventListener("scroll", r);
                                            });
                                        }
                                    }, [r, e]),
                                    (0, ua.useMemo)(() => (e.length ? (a ? Array.from(a.values()).reduce((e, a) => On(e, a), Wn) : ms(e)) : Wn), [e, a])
                                );
                            })(te),
                            le = Ws(se),
                            oe = Ws(se, [U]),
                            ue = On(re, le),
                            ce = J ? Qn(J, re) : null,
                            ge = $ && ce ? c({ active: $, collisionRect: ce, droppableRects: _, droppableContainers: A, pointerCoordinates: ne }) : null,
                            de = (function (e) {
                                if (!e || 0 === e.length) return null;
                                const [a] = e;
                                return a.id;
                            })(ge),
                            [ye, fe] = (0, ua.useState)(null),
                            me = (function (e, a, t) {
                                return { ...e, scaleX: a && t ? a.width / t.width : 1, scaleY: a && t ? a.height / t.height : 1 };
                            })(X ? re : On(re, oe), null != (r = null == ye ? void 0 : ye.rect) ? r : null, U),
                            be = (0, ua.useCallback)(
                                (e, a) => {
                                    let { sensor: t, options: i } = a;
                                    if (null == O.current) return;
                                    const r = w.get(O.current);
                                    if (!r) return;
                                    const n = e.nativeEvent,
                                        s = new t({
                                            active: O.current,
                                            activeNode: r,
                                            event: n,
                                            options: i,
                                            context: W,
                                            onStart(e) {
                                                const a = O.current;
                                                if (null == a) return;
                                                const t = w.get(a);
                                                if (!t) return;
                                                const { onDragStart: i } = P.current,
                                                    r = { active: { id: a, data: t.data, rect: j } };
                                                (0, zt.unstable_batchedUpdates)(() => {
                                                    null == i || i(r), x(ol.Initializing), b({ type: Un.DragStart, initialCoordinates: e, active: a }), v({ type: "onDragStart", event: r });
                                                });
                                            },
                                            onMove(e) {
                                                b({ type: Un.DragMove, coordinates: e });
                                            },
                                            onEnd: l(Un.DragEnd),
                                            onCancel: l(Un.DragCancel),
                                        });
                                    function l(e) {
                                        return async function () {
                                            const { active: a, collisions: t, over: i, scrollAdjustedTranslate: r } = W.current;
                                            let s = null;
                                            if (a && r) {
                                                const { cancelDrop: l } = P.current;
                                                (s = { activatorEvent: n, active: a, collisions: t, delta: r, over: i }), e === Un.DragEnd && "function" == typeof l && (await Promise.resolve(l(s))) && (e = Un.DragCancel);
                                            }
                                            (O.current = null),
                                                (0, zt.unstable_batchedUpdates)(() => {
                                                    b({ type: e }), x(ol.Uninitialized), fe(null), T(null), R(null);
                                                    const a = e === Un.DragEnd ? "onDragEnd" : "onDragCancel";
                                                    if (s) {
                                                        const e = P.current[a];
                                                        null == e || e(s), v({ type: a, event: s });
                                                    }
                                                });
                                        };
                                    }
                                    (0, zt.unstable_batchedUpdates)(() => {
                                        T(s), R(e.nativeEvent);
                                    });
                                },
                                [w]
                            ),
                            ve = (0, ua.useCallback)(
                                (e, a) => (t, i) => {
                                    const r = t.nativeEvent,
                                        n = w.get(i);
                                    if (null !== O.current || !n || r.dndKit || r.defaultPrevented) return;
                                    const s = { active: n };
                                    !0 === e(t, a.options, s) && ((r.dndKit = { capturedBy: a.sensor }), (O.current = i), be(t, a));
                                },
                                [w, be]
                            ),
                            pe = (function (e, a) {
                                return (0, ua.useMemo)(
                                    () =>
                                        e.reduce((e, t) => {
                                            const { sensor: i } = t;
                                            return [...e, ...i.activators.map((e) => ({ eventName: e.eventName, handler: a(e.handler, t) }))];
                                        }, []),
                                    [e, a]
                                );
                            })(u, ve);
                        !(function (e) {
                            (0, ua.useEffect)(
                                () => {
                                    if (!yn) return;
                                    const a = e.map((e) => {
                                        let { sensor: a } = e;
                                        return null == a.setup ? void 0 : a.setup();
                                    });
                                    return () => {
                                        for (const e of a) null == e || e();
                                    };
                                },
                                e.map((e) => {
                                    let { sensor: a } = e;
                                    return a;
                                })
                            );
                        })(u),
                            xn(() => {
                                U && h === ol.Initializing && x(ol.Initialized);
                            }, [U, h]),
                            (0, ua.useEffect)(() => {
                                const { onDragMove: e } = P.current,
                                    { active: a, activatorEvent: t, collisions: i, over: r } = W.current;
                                if (!a || !t) return;
                                const n = { active: a, activatorEvent: t, collisions: i, delta: { x: ue.x, y: ue.y }, over: r };
                                (0, zt.unstable_batchedUpdates)(() => {
                                    null == e || e(n), v({ type: "onDragMove", event: n });
                                });
                            }, [ue.x, ue.y]),
                            (0, ua.useEffect)(() => {
                                const { active: e, activatorEvent: a, collisions: t, droppableContainers: i, scrollAdjustedTranslate: r } = W.current;
                                if (!e || null == O.current || !a || !r) return;
                                const { onDragOver: n } = P.current,
                                    s = i.get(de),
                                    l = s && s.rect.current ? { id: s.id, rect: s.rect.current, data: s.data, disabled: s.disabled } : null,
                                    o = { active: e, activatorEvent: a, collisions: t, delta: { x: r.x, y: r.y }, over: l };
                                (0, zt.unstable_batchedUpdates)(() => {
                                    fe(l), null == n || n(o), v({ type: "onDragOver", event: o });
                                });
                            }, [de]),
                            xn(() => {
                                (W.current = {
                                    activatorEvent: L,
                                    active: $,
                                    activeNode: V,
                                    collisionRect: ce,
                                    collisions: ge,
                                    droppableRects: _,
                                    draggableNodes: w,
                                    draggingNode: Z,
                                    draggingNodeRect: J,
                                    droppableContainers: N,
                                    over: ye,
                                    scrollableAncestors: te,
                                    scrollAdjustedTranslate: ue,
                                }),
                                    (j.current = { initial: J, translated: ce });
                            }, [$, V, ge, ce, w, Z, J, _, N, ye, te, ue]),
                            (function (e) {
                                let {
                                    acceleration: a,
                                    activator: t = As.Pointer,
                                    canScroll: i,
                                    draggingRect: r,
                                    enabled: n,
                                    interval: s = 5,
                                    order: l = Ds.TreeOrder,
                                    pointerCoordinates: o,
                                    scrollableAncestors: u,
                                    scrollableAncestorRects: c,
                                    delta: g,
                                    threshold: d,
                                } = e;
                                const y = (function (e) {
                                        let { delta: a, disabled: t } = e;
                                        const i = Nn(a);
                                        return wn(
                                            (e) => {
                                                if (t || !i || !e) return _s;
                                                const r = Math.sign(a.x - i.x),
                                                    n = Math.sign(a.y - i.y);
                                                return {
                                                    x: { [us.Backward]: e.x[us.Backward] || -1 === r, [us.Forward]: e.x[us.Forward] || 1 === r },
                                                    y: { [us.Backward]: e.y[us.Backward] || -1 === n, [us.Forward]: e.y[us.Forward] || 1 === n },
                                                };
                                            },
                                            [t, a, i]
                                        );
                                    })({ delta: g, disabled: !n }),
                                    [f, m] = (function () {
                                        const e = (0, ua.useRef)(null);
                                        return [
                                            (0, ua.useCallback)((a, t) => {
                                                e.current = setInterval(a, t);
                                            }, []),
                                            (0, ua.useCallback)(() => {
                                                null !== e.current && (clearInterval(e.current), (e.current = null));
                                            }, []),
                                        ];
                                    })(),
                                    b = (0, ua.useRef)({ x: 0, y: 0 }),
                                    v = (0, ua.useRef)({ x: 0, y: 0 }),
                                    p = (0, ua.useMemo)(() => {
                                        switch (t) {
                                            case As.Pointer:
                                                return o ? { top: o.y, bottom: o.y, left: o.x, right: o.x } : null;
                                            case As.DraggableRect:
                                                return r;
                                        }
                                    }, [t, r, o]),
                                    h = (0, ua.useRef)(null),
                                    x = (0, ua.useCallback)(() => {
                                        const e = h.current;
                                        if (!e) return;
                                        const a = b.current.x * v.current.x,
                                            t = b.current.y * v.current.y;
                                        e.scrollBy(a, t);
                                    }, []),
                                    S = (0, ua.useMemo)(() => (l === Ds.TreeOrder ? [...u].reverse() : u), [l, u]);
                                (0, ua.useEffect)(() => {
                                    if (n && u.length && p) {
                                        for (const e of S) {
                                            if (!1 === (null == i ? void 0 : i(e))) continue;
                                            const t = u.indexOf(e),
                                                r = c[t];
                                            if (!r) continue;
                                            const { direction: n, speed: l } = ys(e, r, p, a, d);
                                            for (const e of ["x", "y"]) y[e][n[e]] || ((l[e] = 0), (n[e] = 0));
                                            if (l.x > 0 || l.y > 0) return m(), (h.current = e), f(x, s), (b.current = l), void (v.current = n);
                                        }
                                        (b.current = { x: 0, y: 0 }), (v.current = { x: 0, y: 0 }), m();
                                    } else m();
                                }, [a, x, i, m, n, s, JSON.stringify(p), JSON.stringify(y), f, u, S, c, JSON.stringify(d)]);
                            })({ ...G, delta: C, draggingRect: ce, pointerCoordinates: ne, scrollableAncestors: te, scrollableAncestorRects: ie });
                        const he = (0, ua.useMemo)(
                                () => ({
                                    active: $,
                                    activeNode: V,
                                    activeNodeRect: U,
                                    activatorEvent: L,
                                    collisions: ge,
                                    containerNodeRect: K,
                                    dragOverlay: Y,
                                    draggableNodes: w,
                                    droppableContainers: N,
                                    droppableRects: _,
                                    over: ye,
                                    measureDroppableContainers: E,
                                    scrollableAncestors: te,
                                    scrollableAncestorRects: ie,
                                    measuringConfiguration: D,
                                    measuringScheduled: F,
                                    windowRect: ae,
                                }),
                                [$, V, U, L, ge, K, Y, w, N, _, ye, E, te, ie, D, F, ae]
                            ),
                            xe = (0, ua.useMemo)(() => ({ activatorEvent: L, activators: pe, active: $, activeNodeRect: U, ariaDescribedById: { draggable: I }, dispatch: b, draggableNodes: w, over: ye, measureDroppableContainers: E }), [
                                L,
                                pe,
                                $,
                                U,
                                b,
                                I,
                                w,
                                ye,
                                E,
                            ]);
                        return ca().createElement(
                            Vn.Provider,
                            { value: p },
                            ca().createElement(
                                tl.Provider,
                                { value: xe },
                                ca().createElement(il.Provider, { value: he }, ca().createElement(ll.Provider, { value: me }, o)),
                                ca().createElement(sl, { disabled: !1 === (null == s ? void 0 : s.restoreFocus) })
                            ),
                            ca().createElement(zn, { ...s, hiddenTextDescribedById: I })
                        );
                    }),
                    cl = (0, ua.createContext)(null),
                    gl = "button";
                const dl = { timeout: 25 };
                function yl(e) {
                    let { data: a, disabled: t = !1, id: i, resizeObserverConfig: r } = e;
                    const n = jn("Droppable"),
                        { active: s, dispatch: l, over: o, measureDroppableContainers: u } = (0, ua.useContext)(tl),
                        c = (0, ua.useRef)({ disabled: t }),
                        g = (0, ua.useRef)(!1),
                        d = (0, ua.useRef)(null),
                        y = (0, ua.useRef)(null),
                        { disabled: f, updateMeasurementsFor: m, timeout: b } = { ...dl, ...r },
                        v = kn(null != m ? m : i),
                        p = Gs({
                            callback: (0, ua.useCallback)(() => {
                                g.current
                                    ? (null != y.current && clearTimeout(y.current),
                                      (y.current = setTimeout(() => {
                                          u(Array.isArray(v.current) ? v.current : [v.current]), (y.current = null);
                                      }, b)))
                                    : (g.current = !0);
                            }, [b]),
                            disabled: f || !s,
                        }),
                        h = (0, ua.useCallback)(
                            (e, a) => {
                                p && (a && (p.unobserve(a), (g.current = !1)), e && p.observe(e));
                            },
                            [p]
                        ),
                        [x, S] = Cn(h),
                        k = kn(a);
                    return (
                        (0, ua.useEffect)(() => {
                            p && x.current && (p.disconnect(), (g.current = !1), p.observe(x.current));
                        }, [x, p]),
                        xn(() => (l({ type: Un.RegisterDroppable, element: { id: i, key: n, disabled: t, node: x, rect: d, data: k } }), () => l({ type: Un.UnregisterDroppable, key: n, id: i })), [i]),
                        (0, ua.useEffect)(() => {
                            t !== c.current.disabled && (l({ type: Un.SetDroppableDisabled, id: i, key: n, disabled: t }), (c.current.disabled = t));
                        }, [i, n, t, l]),
                        { active: s, rect: d, isOver: (null == o ? void 0 : o.id) === i, node: x, over: o, setNodeRef: S }
                    );
                }
                function fl(e, a, t) {
                    const i = e.slice();
                    return i.splice(t < 0 ? i.length + t : t, 0, i.splice(a, 1)[0]), i;
                }
                function ml(e, a) {
                    return e.reduce((e, t, i) => {
                        const r = a.get(t);
                        return r && (e[i] = r), e;
                    }, Array(e.length));
                }
                function bl(e) {
                    return null !== e && e >= 0;
                }
                const vl = (e) => {
                        let { rects: a, activeIndex: t, overIndex: i, index: r } = e;
                        const n = fl(a, i, t),
                            s = a[r],
                            l = n[r];
                        return l && s ? { x: l.left - s.left, y: l.top - s.top, scaleX: l.width / s.width, scaleY: l.height / s.height } : null;
                    },
                    pl = { scaleX: 1, scaleY: 1 },
                    hl = (e) => {
                        var a;
                        let { activeIndex: t, activeNodeRect: i, index: r, rects: n, overIndex: s } = e;
                        const l = null != (a = n[t]) ? a : i;
                        if (!l) return null;
                        if (r === t) {
                            const e = n[s];
                            return e ? { x: 0, y: t < s ? e.top + e.height - (l.top + l.height) : e.top - l.top, ...pl } : null;
                        }
                        const o = (function (e, a, t) {
                            const i = e[a],
                                r = e[a - 1],
                                n = e[a + 1];
                            return i ? (t < a ? (r ? i.top - (r.top + r.height) : n ? n.top - (i.top + i.height) : 0) : n ? n.top - (i.top + i.height) : r ? i.top - (r.top + r.height) : 0) : 0;
                        })(n, r, t);
                        return r > t && r <= s ? { x: 0, y: -l.height - o, ...pl } : r < t && r >= s ? { x: 0, y: l.height + o, ...pl } : { x: 0, y: 0, ...pl };
                    },
                    xl = "Sortable",
                    Sl = ca().createContext({ activeIndex: -1, containerId: xl, disableTransforms: !1, items: [], overIndex: -1, useDragOverlay: !1, sortedRects: [], strategy: vl, disabled: { draggable: !1, droppable: !1 } });
                function kl(e) {
                    let { children: a, id: t, items: i, strategy: r = vl, disabled: n = !1 } = e;
                    const { active: s, dragOverlay: l, droppableRects: o, over: u, measureDroppableContainers: c } = (0, ua.useContext)(il),
                        g = jn(xl, t),
                        d = Boolean(null !== l.rect),
                        y = (0, ua.useMemo)(() => i.map((e) => ("object" == typeof e && "id" in e ? e.id : e)), [i]),
                        f = null != s,
                        m = s ? y.indexOf(s.id) : -1,
                        b = u ? y.indexOf(u.id) : -1,
                        v = (0, ua.useRef)(y),
                        p = !(function (e, a) {
                            if (e === a) return !0;
                            if (e.length !== a.length) return !1;
                            for (let t = 0; t < e.length; t++) if (e[t] !== a[t]) return !1;
                            return !0;
                        })(y, v.current),
                        h = (-1 !== b && -1 === m) || p,
                        x = (function (e) {
                            return "boolean" == typeof e ? { draggable: e, droppable: e } : e;
                        })(n);
                    xn(() => {
                        p && f && c(y);
                    }, [p, y, f, c]),
                        (0, ua.useEffect)(() => {
                            v.current = y;
                        }, [y]);
                    const S = (0, ua.useMemo)(() => ({ activeIndex: m, containerId: g, disabled: x, disableTransforms: h, items: y, overIndex: b, useDragOverlay: d, sortedRects: ml(y, o), strategy: r }), [
                        m,
                        g,
                        x.draggable,
                        x.droppable,
                        h,
                        y,
                        b,
                        o,
                        d,
                        r,
                    ]);
                    return ca().createElement(Sl.Provider, { value: S }, a);
                }
                const wl = (e) => {
                        let { id: a, items: t, activeIndex: i, overIndex: r } = e;
                        return fl(t, i, r).indexOf(a);
                    },
                    Cl = (e) => {
                        let { containerId: a, isSorting: t, wasDragging: i, index: r, items: n, newIndex: s, previousItems: l, previousContainerId: o, transition: u } = e;
                        return !(!u || !i || (l !== n && r === s) || (!t && (s === r || a !== o)));
                    },
                    Nl = { duration: 200, easing: "ease" },
                    Ml = "transform",
                    jl = Rn.Transition.toString({ property: Ml, duration: 0, easing: "linear" }),
                    $l = { roleDescription: "sortable" };
                function Ol(e) {
                    let { animateLayoutChanges: a = Cl, attributes: t, disabled: i, data: r, getNewIndex: n = wl, id: s, strategy: l, resizeObserverConfig: o, transition: u = Nl } = e;
                    const { items: c, containerId: g, activeIndex: d, disabled: y, disableTransforms: f, sortedRects: m, overIndex: b, useDragOverlay: v, strategy: p } = (0, ua.useContext)(Sl),
                        h = (function (e, a) {
                            var t, i;
                            return "boolean" == typeof e
                                ? { draggable: e, droppable: !1 }
                                : { draggable: null != (t = null == e ? void 0 : e.draggable) ? t : a.draggable, droppable: null != (i = null == e ? void 0 : e.droppable) ? i : a.droppable };
                        })(i, y),
                        x = c.indexOf(s),
                        S = (0, ua.useMemo)(() => ({ sortable: { containerId: g, index: x, items: c }, ...r }), [g, r, x, c]),
                        k = (0, ua.useMemo)(() => c.slice(c.indexOf(s)), [c, s]),
                        { rect: w, node: C, isOver: N, setNodeRef: M } = yl({ id: s, data: S, disabled: h.droppable, resizeObserverConfig: { updateMeasurementsFor: k, ...o } }),
                        { active: j, activatorEvent: $, activeNodeRect: O, attributes: B, setNodeRef: T, listeners: L, isDragging: R, over: P, setActivatorNodeRef: I, transform: A } = (function (e) {
                            let { id: a, data: t, disabled: i = !1, attributes: r } = e;
                            const n = jn("Droppable"),
                                { activators: s, activatorEvent: l, active: o, activeNodeRect: u, ariaDescribedById: c, draggableNodes: g, over: d } = (0, ua.useContext)(tl),
                                { role: y = gl, roleDescription: f = "draggable", tabIndex: m = 0 } = null != r ? r : {},
                                b = (null == o ? void 0 : o.id) === a,
                                v = (0, ua.useContext)(b ? ll : cl),
                                [p, h] = Cn(),
                                [x, S] = Cn(),
                                k = (function (e, a) {
                                    return (0, ua.useMemo)(
                                        () =>
                                            e.reduce((e, t) => {
                                                let { eventName: i, handler: r } = t;
                                                return (
                                                    (e[i] = (e) => {
                                                        r(e, a);
                                                    }),
                                                    e
                                                );
                                            }, {}),
                                        [e, a]
                                    );
                                })(s, a),
                                w = kn(t);
                            return (
                                xn(
                                    () => (
                                        g.set(a, { id: a, key: n, node: p, activatorNode: x, data: w }),
                                        () => {
                                            const e = g.get(a);
                                            e && e.key === n && g.delete(a);
                                        }
                                    ),
                                    [g, a]
                                ),
                                {
                                    active: o,
                                    activatorEvent: l,
                                    activeNodeRect: u,
                                    attributes: (0, ua.useMemo)(() => ({ role: y, tabIndex: m, "aria-disabled": i, "aria-pressed": !(!b || y !== gl) || void 0, "aria-roledescription": f, "aria-describedby": c.draggable }), [
                                        i,
                                        y,
                                        m,
                                        b,
                                        f,
                                        c.draggable,
                                    ]),
                                    isDragging: b,
                                    listeners: i ? void 0 : k,
                                    node: p,
                                    over: d,
                                    setNodeRef: h,
                                    setActivatorNodeRef: S,
                                    transform: v,
                                }
                            );
                        })({ id: s, data: S, attributes: { ...$l, ...t }, disabled: h.draggable }),
                        D = (function () {
                            for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++) a[t] = arguments[t];
                            return (0, ua.useMemo)(
                                () => (e) => {
                                    a.forEach((a) => a(e));
                                },
                                a
                            );
                        })(M, T),
                        _ = Boolean(j),
                        E = _ && !f && bl(d) && bl(b),
                        F = !v && R,
                        V = F && E ? A : null,
                        H = E ? (null != V ? V : (null != l ? l : p)({ rects: m, activeNodeRect: O, activeIndex: d, overIndex: b, index: x })) : null,
                        G = bl(d) && bl(b) ? n({ id: s, items: c, activeIndex: d, overIndex: b }) : x,
                        z = null == j ? void 0 : j.id,
                        U = (0, ua.useRef)({ activeId: z, items: c, newIndex: G, containerId: g }),
                        K = c !== U.current.items,
                        W = a({
                            active: j,
                            containerId: g,
                            isDragging: R,
                            isSorting: _,
                            id: s,
                            index: x,
                            items: c,
                            newIndex: U.current.newIndex,
                            previousItems: U.current.items,
                            previousContainerId: U.current.containerId,
                            transition: u,
                            wasDragging: null != U.current.activeId,
                        }),
                        q = (function (e) {
                            let { disabled: a, index: t, node: i, rect: r } = e;
                            const [n, s] = (0, ua.useState)(null),
                                l = (0, ua.useRef)(t);
                            return (
                                xn(() => {
                                    if (!a && t !== l.current && i.current) {
                                        const e = r.current;
                                        if (e) {
                                            const a = as(i.current, { ignoreTransform: !0 }),
                                                t = { x: e.left - a.left, y: e.top - a.top, scaleX: e.width / a.width, scaleY: e.height / a.height };
                                            (t.x || t.y) && s(t);
                                        }
                                    }
                                    t !== l.current && (l.current = t);
                                }, [a, t, i, r]),
                                (0, ua.useEffect)(() => {
                                    n && s(null);
                                }, [n]),
                                n
                            );
                        })({ disabled: !W, index: x, node: C, rect: w });
                    return (
                        (0, ua.useEffect)(() => {
                            _ && U.current.newIndex !== G && (U.current.newIndex = G), g !== U.current.containerId && (U.current.containerId = g), c !== U.current.items && (U.current.items = c);
                        }, [_, G, g, c]),
                        (0, ua.useEffect)(() => {
                            if (z === U.current.activeId) return;
                            if (z && !U.current.activeId) return void (U.current.activeId = z);
                            const e = setTimeout(() => {
                                U.current.activeId = z;
                            }, 50);
                            return () => clearTimeout(e);
                        }, [z]),
                        {
                            active: j,
                            activeIndex: d,
                            attributes: B,
                            data: S,
                            rect: w,
                            index: x,
                            newIndex: G,
                            items: c,
                            isOver: N,
                            isSorting: _,
                            isDragging: R,
                            listeners: L,
                            node: C,
                            overIndex: b,
                            over: P,
                            setNodeRef: D,
                            setActivatorNodeRef: I,
                            setDroppableNodeRef: M,
                            setDraggableNodeRef: T,
                            transform: null != q ? q : H,
                            transition: q || (K && U.current.newIndex === x) ? jl : (F && !Tn($)) || !u ? void 0 : _ || W ? Rn.Transition.toString({ ...u, property: Ml }) : void 0,
                        }
                    );
                }
                Ss.Down, Ss.Right, Ss.Up, Ss.Left;
                const Bl = ({ id: e, items: a, children: t }) => {
                        const { setNodeRef: i } = yl({ id: e });
                        return (0, y.jsx)(kl, { id: e, items: a, strategy: vl, children: (0, y.jsx)("div", { ref: i, className: "dnd-items-wrapper", children: t }) });
                    },
                    Tl = ({ defaultItems: e, attributeName: a, setAttributes: t, children: i }) =>
                        (0, y.jsx)(ul, {
                            onDragEnd: ({ active: i, over: r }) => {
                                if (r && i.id !== r.id) {
                                    const n = i.data.current.sortable.index,
                                        s = r.data.current?.sortable.index || 0,
                                        l = fl(e, n, s);
                                    t({ [a]: l });
                                }
                            },
                            children: (0, y.jsx)(Bl, { strategy: hl, id: "group", items: e, children: i }, "group"),
                        }),
                    Ll = (e) => {
                        const { attributes: a, listeners: t, setNodeRef: i, transform: r, transition: n } = Ol({ id: e.id }),
                            s = { transform: Rn.Transform.toString(r), transition: n };
                        return (0, y.jsxs)("div", {
                            style: s,
                            ref: i,
                            className: "dnd-fields-wrapper",
                            children: [
                                e.children,
                                (0, y.jsx)("button", {
                                    ...a,
                                    ...t,
                                    className: "float-btn",
                                    children: (0, y.jsxs)("svg", {
                                        width: "24",
                                        height: "24",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        xmlns: "http://www.w3.org/2000/svg",
                                        children: [
                                            (0, y.jsx)("path", { d: "M9 12.5C9.55228 12.5 10 12.0523 10 11.5C10 10.9477 9.55228 10.5 9 10.5C8.44772 10.5 8 10.9477 8 11.5C8 12.0523 8.44772 12.5 9 12.5Z", fill: "#4D4D4D" }),
                                            (0, y.jsx)("path", { d: "M9 12.5C9.55228 12.5 10 12.0523 10 11.5C10 10.9477 9.55228 10.5 9 10.5C8.44772 10.5 8 10.9477 8 11.5C8 12.0523 8.44772 12.5 9 12.5Z", fill: "#39394D" }),
                                            (0, y.jsx)("path", { d: "M9 7C9.55228 7 10 6.55228 10 6C10 5.44772 9.55228 5 9 5C8.44772 5 8 5.44772 8 6C8 6.55228 8.44772 7 9 7Z", fill: "#4D4D4D" }),
                                            (0, y.jsx)("path", { d: "M9 7C9.55228 7 10 6.55228 10 6C10 5.44772 9.55228 5 9 5C8.44772 5 8 5.44772 8 6C8 6.55228 8.44772 7 9 7Z", fill: "#39394D" }),
                                            (0, y.jsx)("path", { d: "M9 18C9.55228 18 10 17.5523 10 17C10 16.4477 9.55228 16 9 16C8.44772 16 8 16.4477 8 17C8 17.5523 8.44772 18 9 18Z", fill: "#4D4D4D" }),
                                            (0, y.jsx)("path", { d: "M9 18C9.55228 18 10 17.5523 10 17C10 16.4477 9.55228 16 9 16C8.44772 16 8 16.4477 8 17C8 17.5523 8.44772 18 9 18Z", fill: "#39394D" }),
                                            (0, y.jsx)("path", { d: "M15 12.5C15.5523 12.5 16 12.0523 16 11.5C16 10.9477 15.5523 10.5 15 10.5C14.4477 10.5 14 10.9477 14 11.5C14 12.0523 14.4477 12.5 15 12.5Z", fill: "#4D4D4D" }),
                                            (0, y.jsx)("path", { d: "M15 12.5C15.5523 12.5 16 12.0523 16 11.5C16 10.9477 15.5523 10.5 15 10.5C14.4477 10.5 14 10.9477 14 11.5C14 12.0523 14.4477 12.5 15 12.5Z", fill: "#39394D" }),
                                            (0, y.jsx)("path", { d: "M15 7C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5C14.4477 5 14 5.44772 14 6C14 6.55228 14.4477 7 15 7Z", fill: "#4D4D4D" }),
                                            (0, y.jsx)("path", { d: "M15 7C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5C14.4477 5 14 5.44772 14 6C14 6.55228 14.4477 7 15 7Z", fill: "#39394D" }),
                                            (0, y.jsx)("path", { d: "M15 18C15.5523 18 16 17.5523 16 17C16 16.4477 15.5523 16 15 16C14.4477 16 14 16.4477 14 17C14 17.5523 14.4477 18 15 18Z", fill: "#4D4D4D" }),
                                            (0, y.jsx)("path", { d: "M15 18C15.5523 18 16 17.5523 16 17C16 16.4477 15.5523 16 15 16C14.4477 16 14 16.4477 14 17C14 17.5523 14.4477 18 15 18Z", fill: "#39394D" }),
                                        ],
                                    }),
                                }),
                            ],
                        });
                    },
                    { __: Rl } = wp.i18n,
                    { PanelBody: Pl, TextControl: Il, Button: Al, ToggleControl: Dl, TextareaControl: _l } = wp.components,
                    { Fragment: El } = wp.element,
                    { createBlock: Fl } = wp.blocks,
                    { select: Vl, dispatch: Hl } = wp.data,
                    { kQ: Gl } = i,
                    { Uq: zl, oy: Ul, ed: Kl, fW: Wl } = s,
                    ql = ({ tabTitles: e, setAttributes: a, clientId: t, uniqueId: i, tabChildCount: r, handleTabClick: n }) =>
                        (0, y.jsxs)("div", {
                            className: "jankx-sortable",
                            children: [
                                (0, y.jsx)(Ul, {
                                    defaultItems: e,
                                    attributeName: "tabTitles",
                                    setAttributes: a,
                                    children:
                                        e &&
                                        e.map((i, n) =>
                                            (0, y.jsxs)(
                                                "div",
                                                {
                                                    className: "dnd-container",
                                                    children: [
                                                        (0, y.jsx)(Al, {
                                                            className: "dnd-trash",
                                                            icon: "trash",
                                                            onClick: () =>
                                                                ((i) => {
                                                                    const n = Vl("core/block-editor").getBlocks(t);
                                                                    if (n.length > 1) {
                                                                        n.splice(i, 1);
                                                                        const s = [...e];
                                                                        s.splice(i, 1),
                                                                            Hl("core/block-editor")
                                                                                .replaceInnerBlocks(t, n)
                                                                                .then(() => {
                                                                                    a({ tabTitles: s, tabChildCount: r - 1 });
                                                                                });
                                                                    }
                                                                })(n),
                                                        }),
                                                        (0, y.jsx)(
                                                            zl,
                                                            {
                                                                id: i.id,
                                                                children: (0, y.jsxs)(Pl, {
                                                                    title: i.title ? i.title : Rl("Tab Title", "advanced-tabs-block"),
                                                                    initialOpen: !1,
                                                                    children: [
                                                                        (0, y.jsx)(Il, {
                                                                            label: Rl("Tab Title", "advanced-tabs-block"),
                                                                            value: i.title,
                                                                            onChange: (t) => {
                                                                                const i = [...e];
                                                                                (i[n].title = t), a({ tabTitles: i });
                                                                            },
                                                                        }),
                                                                        (0, y.jsx)(Dl, {
                                                                            label: Rl("Show Icon", "advanced-tabs-block"),
                                                                            checked: i.hasMedia,
                                                                            onChange: () => {
                                                                                const t = [...e];
                                                                                (t[n].hasMedia = !i.hasMedia), a({ tabTitles: t });
                                                                            },
                                                                        }),
                                                                        i.hasMedia &&
                                                                            (0, y.jsxs)(El, {
                                                                                children: [
                                                                                    (0, y.jsx)(Kl, {
                                                                                        label: Rl("Icon Type", "advanced-tabs-block"),
                                                                                        value: i.mediaType && i.mediaType,
                                                                                        options: Gl,
                                                                                        onChange: (t) => {
                                                                                            const i = [...e];
                                                                                            (i[n].mediaType = t), a({ tabTitles: i });
                                                                                        },
                                                                                    }),
                                                                                    "iconLibrary" === i.mediaType &&
                                                                                        (0, y.jsx)(Wl, {
                                                                                            label: Rl("Pick an Icon", "advanced-tabs-block"),
                                                                                            value: i.icon && i.icon,
                                                                                            onChange: (t) => {
                                                                                                const i = [...e];
                                                                                                (i[n].icon = t), a({ tabTitles: i });
                                                                                            },
                                                                                        }),
                                                                                    "uploadSVG" === i.mediaType &&
                                                                                        (0, y.jsx)(_l, {
                                                                                            label: Rl("Paste SVG Code", "advanced-tabs-block"),
                                                                                            help: Rl("Paste your custom SVG codes here", "advanced-tabs-block"),
                                                                                            value: i.customSVG && i.customSVG,
                                                                                            onChange: (t) => {
                                                                                                const i = [...e];
                                                                                                (i[n].customSVG = t), a({ tabTitles: i });
                                                                                            },
                                                                                        }),
                                                                                ],
                                                                            }),
                                                                    ],
                                                                }),
                                                            },
                                                            i.id
                                                        ),
                                                    ],
                                                },
                                                n
                                            )
                                        ),
                                }),
                                (0, y.jsx)(Al, {
                                    className: "add-tab-btn",
                                    onClick: () =>
                                        (() => {
                                            const s = [...Vl("core/block-editor").getBlocks(t)],
                                                l = `${e.reduce((e, a) => Math.max(parseInt(e), parseInt(a.id)), 0) + 1}`,
                                                o = Fl("jankx/tab", { tabId: l, tabParentId: `${i}` });
                                            s.splice(s.length, 0, o),
                                                Hl("core/block-editor")
                                                    .replaceInnerBlocks(t, s)
                                                    .then(() => {
                                                        a({
                                                            tabTitles: [...e, { title: `Tab Title ${parseInt(s.length)}`, id: l, hasMedia: !0, isDefault: !1, mediaType: "iconLibrary", icon: "0-circle", customSVG: "" }],
                                                            tabChildCount: r + 1,
                                                        }),
                                                            n(l);
                                                    });
                                        })(),
                                    variant: "primary",
                                    children: Rl("Add New Tab", "advanced-tabs-block"),
                                }),
                            ],
                        }),
                    { YB: Yl, bL: Zl, Wc: Jl, lt: Xl, Au: Ql, ww: eo, tj: ao, xW: to, t: io, kD: ro, LT: no, QJ: so, Ev: lo, xZ: oo, it: uo, $o: co, t$: go, ih: yo, vW: fo, iJ: mo, O3: bo, V7: vo, kB: po } = n,
                    { cM: ho, lP: xo, xj: So, G3: ko } = i,
                    { of: wo, Jn: Co, $Q: No, xi: Mo, LE: jo, lm: $o, gl: Oo, ed: Bo } = s,
                    To = ({ attributes: e, setAttributes: a, handleTabClick: t, clientId: i }) => {
                        const {
                                uniqueId: r,
                                tabTitles: n,
                                tabChildCount: s,
                                titleColor: l,
                                tcBgType: o,
                                tcBgColor: u,
                                tcBgGradient: c,
                                stBgType: g,
                                stBgColor: f,
                                stBgGradient: m,
                                iconColor: b,
                                showSeparator: v,
                                separatorColor: p,
                                cbBgType: h,
                                cbBgColor: x,
                                cbBgGradient: S,
                                iconPosition: k,
                                atColor: w,
                                atBgType: C,
                                atBgColor: N,
                                atBgGradient: M,
                                atIconColor: j,
                            } = e,
                            $ = { attributes: e, setAttributes: a, objAttributes: Le };
                        return (0, y.jsx)(wo, {
                            settingTabContent: (0, y.jsxs)(Ae.Fragment, {
                                children: [
                                    (0, y.jsx)(Ie.PanelBody, {
                                        title: (0, d.__)("Tab Items", "advanced-tabs-block"),
                                        initialOpen: !1,
                                        children: (0, y.jsx)(ql, { tabTitles: n, setAttributes: a, clientId: i, uniqueId: r, tabChildCount: s, handleTabClick: t }),
                                    }),
                                    (0, y.jsxs)(Ie.PanelBody, {
                                        title: (0, d.__)("Tab Tiltes", "advanced-tabs-block"),
                                        initialOpen: !1,
                                        children: [
                                            (0, y.jsx)(jo, { label: (0, d.__)("Alignment", "advanced-tabs-block"), controlName: Yl, objAttrs: $, flexAlign: !0, options: ho }),
                                            (0, y.jsx)(Bo, { label: (0, d.__)("Icon Position", "advanced-tabs-block"), value: k, onChange: (e) => a({ iconPosition: e }), options: xo, hasIcons: !0 }),
                                            (0, y.jsx)(Co, { label: (0, d.__)("Titles Gap", "advanced-tabs-block"), controlName: Zl, objAttrs: $, min: 0, max: 100, units: ["px", "em"] }),
                                            (0, y.jsx)(Co, { label: (0, d.__)("Icon Gap", "advanced-tabs-block"), controlName: Jl, objAttrs: $, min: 0, max: 100, units: ["px", "em"] }),
                                        ],
                                    }),
                                    (0, y.jsx)(Ie.PanelBody, {
                                        title: (0, d.__)("Title Separator", "advanced-tabs-block"),
                                        initialOpen: !1,
                                        children: (0, y.jsx)(Ie.ToggleControl, { label: (0, d.__)("Show Separator", "advanced-tabs-block"), checked: v, onChange: () => a({ showSeparator: !v }) }),
                                    }),
                                ],
                            }),
                            designTabContent: (0, y.jsxs)(Ae.Fragment, {
                                children: [
                                    (0, y.jsxs)(Ie.PanelBody, {
                                        title: (0, d.__)("Titles Container", "advanced-tabs-block"),
                                        initialOpen: !1,
                                        children: [
                                            (0, y.jsx)(Oo, { controlName: Xl, objAttrs: $, noHover: !0 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Border Radius", "advanced-tabs-block"), controlName: Ql, objAttrs: $, min: 0, max: 100 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Padding", "advanced-tabs-block"), controlName: eo, objAttrs: $, min: 0, max: 200 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Margin", "advanced-tabs-block"), controlName: ao, objAttrs: $, min: -200, max: 200 }),
                                            (0, y.jsx)(Bo, {
                                                label: (0, d.__)("Background Type", "gutsliders"),
                                                value: o,
                                                options: So,
                                                onChange: (e) => {
                                                    a({ tcBgType: e });
                                                },
                                            }),
                                            "classic" === o &&
                                                (0, y.jsx)(Mo, {
                                                    label: (0, d.__)("Background Color", "gutsliders"),
                                                    color: u,
                                                    onChange: (e) => {
                                                        a({ tcBgColor: e });
                                                    },
                                                }),
                                            "gradient" === o &&
                                                (0, y.jsx)(Ie.GradientPicker, {
                                                    __nextHasNoMargin: !0,
                                                    value: c,
                                                    onChange: (e) => {
                                                        a({ tcBgGradient: e });
                                                    },
                                                    gradients: ko,
                                                }),
                                        ],
                                    }),
                                    (0, y.jsxs)(Ie.PanelBody, {
                                        title: (0, d.__)("Individual Title", "advanced-tabs-block"),
                                        initialOpen: !1,
                                        children: [
                                            (0, y.jsx)($o, { label: (0, d.__)("Typography", "advanced-tabs-block"), controlName: to, objAttrs: $ }),
                                            (0, y.jsx)(Mo, {
                                                label: (0, d.__)("Color", "gutsliders"),
                                                color: l,
                                                onChange: (e) => {
                                                    a({ titleColor: e });
                                                },
                                            }),
                                            (0, y.jsx)(Oo, { controlName: io, objAttrs: $, noHover: !0 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Border Radius", "advanced-tabs-block"), controlName: ro, objAttrs: $, min: 0, max: 100 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Padding", "advanced-tabs-block"), controlName: so, objAttrs: $, min: 0, max: 200 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Margin", "advanced-tabs-block"), controlName: no, objAttrs: $, min: -200, max: 200 }),
                                            (0, y.jsx)(Bo, {
                                                label: (0, d.__)("Background Type", "gutsliders"),
                                                value: g,
                                                options: So,
                                                onChange: (e) => {
                                                    a({ stBgType: e });
                                                },
                                            }),
                                            "classic" === g &&
                                                (0, y.jsx)(Mo, {
                                                    label: (0, d.__)("Background Color", "gutsliders"),
                                                    color: f,
                                                    onChange: (e) => {
                                                        a({ stBgColor: e });
                                                    },
                                                }),
                                            "gradient" === g &&
                                                (0, y.jsx)(Ie.GradientPicker, {
                                                    __nextHasNoMargin: !0,
                                                    value: m,
                                                    onChange: (e) => {
                                                        a({ stBgGradient: e });
                                                    },
                                                    gradients: ko,
                                                }),
                                        ],
                                    }),
                                    v &&
                                        (0, y.jsxs)(Ie.PanelBody, {
                                            title: (0, d.__)("Title Separator", "advanced-tabs-block"),
                                            initialOpen: !1,
                                            children: [
                                                (0, y.jsx)(Co, { label: (0, d.__)("Separator Width", "advanced-tabs-block"), controlName: oo, objAttrs: $, min: 0, max: 100, units: ["px", "em"] }),
                                                (0, y.jsx)(Mo, {
                                                    label: (0, d.__)("Separator Color", "gutsliders"),
                                                    color: p,
                                                    onChange: (e) => {
                                                        a({ separatorColor: e });
                                                    },
                                                }),
                                            ],
                                        }),
                                    (0, y.jsxs)(Ie.PanelBody, {
                                        title: (0, d.__)("Icon", "advanced-tabs-block"),
                                        initialOpen: !1,
                                        children: [
                                            (0, y.jsx)(Co, { label: (0, d.__)("Size", "advanced-tabs-block"), controlName: lo, objAttrs: $, min: 0, max: 100, units: ["px", "em"] }),
                                            (0, y.jsx)(Mo, {
                                                label: (0, d.__)("Color", "gutsliders"),
                                                color: b,
                                                onChange: (e) => {
                                                    a({ iconColor: e });
                                                },
                                            }),
                                        ],
                                    }),
                                    (0, y.jsxs)(Ie.PanelBody, {
                                        title: (0, d.__)("Tab Content", "advanced-tabs-block"),
                                        initialOpen: !1,
                                        children: [
                                            (0, y.jsx)(Oo, { controlName: go, objAttrs: $, noHover: !0 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Border Radius", "advanced-tabs-block"), controlName: yo, objAttrs: $, min: 0, max: 100 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Padding", "advanced-tabs-block"), controlName: uo, objAttrs: $, min: 0, max: 200 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Margin", "advanced-tabs-block"), controlName: co, objAttrs: $, min: -200, max: 200 }),
                                            (0, y.jsx)(Bo, {
                                                label: (0, d.__)("Background Type", "gutsliders"),
                                                value: h,
                                                options: So,
                                                onChange: (e) => {
                                                    a({ cbBgType: e });
                                                },
                                            }),
                                            "classic" === h &&
                                                (0, y.jsx)(Mo, {
                                                    label: (0, d.__)("Background Color", "gutsliders"),
                                                    color: x,
                                                    onChange: (e) => {
                                                        a({ cbBgColor: e });
                                                    },
                                                }),
                                            "gradient" === h &&
                                                (0, y.jsx)(Ie.GradientPicker, {
                                                    __nextHasNoMargin: !0,
                                                    value: S,
                                                    onChange: (e) => {
                                                        a({ cbBgGradient: e });
                                                    },
                                                    gradients: ko,
                                                }),
                                        ],
                                    }),
                                    (0, y.jsxs)(Ie.PanelBody, {
                                        title: (0, d.__)("Active Tab", "advanced-tabs-block"),
                                        initialOpen: !1,
                                        children: [
                                            (0, y.jsx)(Mo, {
                                                label: (0, d.__)("Color", "gutsliders"),
                                                color: w,
                                                onChange: (e) => {
                                                    a({ atColor: e });
                                                },
                                            }),
                                            (0, y.jsx)(Oo, { controlName: fo, objAttrs: $, noHover: !0 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Border Radius", "advanced-tabs-block"), controlName: mo, objAttrs: $, min: 0, max: 100 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Padding", "advanced-tabs-block"), controlName: bo, objAttrs: $, min: 0, max: 200 }),
                                            (0, y.jsx)(No, { label: (0, d.__)("Margin", "advanced-tabs-block"), controlName: vo, objAttrs: $, min: -200, max: 200 }),
                                            (0, y.jsx)(Bo, {
                                                label: (0, d.__)("Background Type", "gutsliders"),
                                                value: C,
                                                options: So,
                                                onChange: (e) => {
                                                    a({ atBgType: e });
                                                },
                                            }),
                                            "classic" === C &&
                                                (0, y.jsx)(Mo, {
                                                    label: (0, d.__)("Background Color", "gutsliders"),
                                                    color: N,
                                                    onChange: (e) => {
                                                        a({ atBgColor: e });
                                                    },
                                                }),
                                            "gradient" === C &&
                                                (0, y.jsx)(Ie.GradientPicker, {
                                                    __nextHasNoMargin: !0,
                                                    value: M,
                                                    onChange: (e) => {
                                                        a({ atBgGradient: e });
                                                    },
                                                    gradients: ko,
                                                }),
                                            (0, y.jsx)(Ie.CardDivider, {}),
                                            (0, y.jsx)(Co, { label: (0, d.__)("Icon Size", "advanced-tabs-block"), controlName: po, objAttrs: $, min: 0, max: 100, units: ["px", "em"] }),
                                            (0, y.jsx)(Mo, {
                                                label: (0, d.__)("Icon Color", "gutsliders"),
                                                color: j,
                                                onChange: (e) => {
                                                    a({ atIconColor: e });
                                                },
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        });
                    },
                    Lo = (e = " ") => e.replace(/\s+/g, " ").replace(/\.zb\-[\w\-\s\.\,\:\>\(\)\d\+\[\]\#\>]+\{[\s]+\}/g, ""),
                    { RawHTML: Ro, Fragment: Po, useEffect: Io, useState: Ao, useRef: Do } = wp.element,
                    { __: _o } = wp.i18n,
                    { useSelect: Eo, dispatch: Fo } = wp.data,
                    { NE: Vo, Cl: Ho, X2: Go, zb: zo, F_: Uo } = r,
                    { YB: Ko, bL: Wo, Wc: qo, lt: Yo, Au: Zo, ww: Jo, tj: Xo, xW: Qo, t: eu, kD: au, LT: tu, QJ: iu, Ev: ru, xZ: nu, it: su, $o: lu, t$: ou, ih: uu, vW: cu, iJ: gu, O3: du, V7: yu, kB: fu } = n,
                    { RawHTML: mu } = wp.element;
                (0, l.registerBlockType)(o, {
                    icon: {
                        src: (0, y.jsxs)("svg", {
                            width: 112,
                            height: 78,
                            viewBox: "0 0 112 78",
                            fill: "none",
                            xmlns: "http://www.w3.org/2000/svg",
                            children: [
                                (0, y.jsx)("rect", { x: 3, y: 19, width: 106, height: 56, fill: "white", stroke: "#007CBA", strokeWidth: 6 }),
                                (0, y.jsx)("rect", { x: 3, y: 3, width: 21, height: 16, fill: "white", stroke: "#007CBA", strokeWidth: 6 }),
                                (0, y.jsx)("rect", { x: 53, y: 3, width: 21, height: 16, fill: "white", stroke: "#007CBA", strokeWidth: 6 }),
                                (0, y.jsx)("rect", { x: 28, y: 3, width: 21, height: 16, fill: "white", stroke: "#007CBA", strokeWidth: 6 }),
                            ],
                        }),
                    },
                    attributes: Le,
                    edit: function ({ attributes: e, setAttributes: a, clientId: t }) {
                        const {
                                uniqueId: i,
                                blockStyle: r,
                                tabTitles: n,
                                titleColor: s,
                                tabChildCount: l,
                                iconPosition: o,
                                tcBgType: u,
                                tcBgColor: c,
                                tcBgGradient: g,
                                stBgType: d,
                                stBgColor: f,
                                stBgGradient: m,
                                iconColor: b,
                                showSeparator: v,
                                separatorColor: p,
                                cbBgType: h,
                                cbBgColor: x,
                                cbBgGradient: S,
                                atColor: k,
                                atBgType: w,
                                atBgColor: C,
                                atBgGradient: N,
                                atIconColor: M,
                            } = e,
                            j = Do(null),
                            [$, O] = Ao(!1),
                            B = (n.find((e) => e.isDefault) || { id: "1" }).id;
                        Io(() => {
                            i || a({ uniqueId: "jankx-tabs-" + t.slice(0, 8) }),
                                0 === n.length &&
                                    a({
                                        tabTitles: [
                                            { id: "1", title: "Tab 1", hasMedia: !1, isDefault: !0, mediaType: "iconLibrary", icon: "0-circle", customSVG: "" },
                                            { id: "2", title: "Tab 2", hasMedia: !1, isDefault: !1, mediaType: "iconLibrary", icon: "0-circle", customSVG: "" },
                                            { id: "3", title: "Tab 3", hasMedia: !1, isDefault: !1, mediaType: "iconLibrary", icon: "0-circle", customSVG: "" },
                                        ],
                                    });
                        }, []);
                        const { innerBlocks: T } = Eo((e) => e("core/block-editor").getBlocksByClientId(t)[0]);
                        Io(() => {
                            const { updateBlockAttributes: e } = Fo("core/block-editor");
                            (0, Pe.times)(T.length, (a) => {
                                e(T[a].clientId, { tabParentId: `${i}` });
                            });
                        }, [i, T]);
                        const L = (e) => {
                                const a = (j || { current: !1 }).current;
                                if (!a) return !1;
                                const t = a.querySelectorAll(".single-tab");
                                if (0 === t.length) return !1;
                                for (const a of t) a.dataset.tabId === e ? ((a.style.display = "block"), (a.style.animation = "fadeIn 0.3s")) : (a.style.display = "none");
                                O(`${e}`);
                            },
                            R = (0, Re.useBlockProps)({ className: i }),
                            { deskAlign: P, tabAlign: I, mobAlign: A } = Uo({ controlName: Ko, attributes: e, propertyName: "justify-content" }),
                            { deskStyle: D, tabStyle: _, mobStyle: E } = Vo({ controlName: Wo, attributes: e, propertyName: "gap" }),
                            { deskStyle: F, tabStyle: V, mobStyle: H } = Vo({ controlName: qo, attributes: e, propertyName: "gap" }),
                            { boxDeskStyles: G, boxTabStyles: z, boxMobStyles: U } = Go({ controlName: Jo, attributes: e, propertyName: "padding" }),
                            { boxDeskStyles: K, boxTabStyles: W, boxMobStyles: q } = Go({ controlName: Xo, attributes: e, propertyName: "margin" }),
                            { desktopStyles: Y, tabletStyles: Z, mobileStyles: J } = Ho({ controlName: Yo, attributes: e }),
                            { boxDeskStyles: X, boxTabStyles: Q, boxMobStyles: ee } = Go({ controlName: Zo, attributes: e, propertyName: "border-radius", forRadius: !0 }),
                            { desktopStyles: ae, tabletStyles: te, mobileStyles: ie } = zo({ controlName: Qo, attributes: e }),
                            { boxDeskStyles: re, boxTabStyles: ne, boxMobStyles: se } = Go({ controlName: iu, attributes: e, propertyName: "padding" }),
                            { boxDeskStyles: le, boxTabStyles: oe, boxMobStyles: ue } = Go({ controlName: tu, attributes: e, propertyName: "margin" }),
                            { desktopStyles: ce, tabletStyles: ge, mobileStyles: de } = Ho({ controlName: eu, attributes: e }),
                            { boxDeskStyles: ye, boxTabStyles: fe, boxMobStyles: me } = Go({ controlName: au, attributes: e, propertyName: "border-radius", forRadius: !0 }),
                            { deskStyle: be, tabStyle: ve, mobStyle: pe } = Vo({ controlName: nu, attributes: e, noProperty: !0 }),
                            { deskStyle: he, tabStyle: xe, mobStyle: Se } = Vo({ controlName: ru, attributes: e, propertyName: "font-size" }),
                            { deskStyle: ke, tabStyle: we, mobStyle: Ce } = Vo({ controlName: ru, attributes: e, propertyName: "height" }),
                            { boxDeskStyles: Ne, boxTabStyles: Me, boxMobStyles: je } = Go({ controlName: su, attributes: e, propertyName: "padding" }),
                            { boxDeskStyles: $e, boxTabStyles: Oe, boxMobStyles: Be } = Go({ controlName: lu, attributes: e, propertyName: "margin" }),
                            { desktopStyles: Te, tabletStyles: Le, mobileStyles: Ie } = Ho({ controlName: ou, attributes: e }),
                            { boxDeskStyles: Ae, boxTabStyles: De, boxMobStyles: _e } = Go({ controlName: uu, attributes: e, propertyName: "border-radius", forRadius: !0 }),
                            { boxDeskStyles: Ee, boxTabStyles: Fe, boxMobStyles: Ve } = Go({ controlName: du, attributes: e, propertyName: "padding" }),
                            { boxDeskStyles: He, boxTabStyles: Ge, boxMobStyles: ze } = Go({ controlName: yu, attributes: e, propertyName: "margin" }),
                            { desktopStyles: Ue, tabletStyles: Ke, mobileStyles: We } = Ho({ controlName: cu, attributes: e }),
                            { boxDeskStyles: qe, boxTabStyles: Ye, boxMobStyles: Ze } = Go({ controlName: gu, attributes: e, propertyName: "border-radius", forRadius: !0 }),
                            { deskStyle: Je, tabStyle: Xe, mobStyle: Qe } = Vo({ controlName: fu, attributes: e, propertyName: "font-size" }),
                            { deskStyle: ea, tabStyle: aa, mobStyle: ta } = Vo({ controlName: fu, attributes: e, propertyName: "height" }),
                            ia = `\n\t\t\n        ${
                                G || K || Y || X || c || g
                                    ? `\n            .${i} .tabs-nav {\n                ${G || ""}\n                ${K || ""}\n                ${Y || ""}\n                ${X || ""}\n                ${
                                          "classic" === u && c ? `background-color: ${c};` : ""
                                      }\n                ${"gradient" === u && g ? `background-image: ${g};` : ""}\n            }\n            `
                                    : ""
                            }\n        ${P || D ? `.${i} .tabs-titles {\n            ${P || ""}\n            ${D || ""}\n        }` : ""}\n        ${
                                P && "justify-content:space-between;" !== P ? `.${i} .tabs-titles .tab-title {\n            width: auto;\n        }` : ""
                            }\n        ${
                                re || le || ce || ye || f || m || F
                                    ? `\n            .${i} .tabs-nav .tab-title {\n                ${F || ""}\n                ${re || ""}\n                ${le || ""}\n                ${ce || ""}\n                ${
                                          ye || ""
                                      }\n                ${"classic" === d && f ? `background-color: ${f};` : ""}\n                ${"gradient" === d && m ? `background-image: ${m};` : ""}\n            } \n            `
                                    : ""
                            }\n        ${
                                Ee || He || Ue || qe || C || N || k
                                    ? `\n            .${i} .tabs-nav .tab-title.active {\n                ${k ? `color: ${k};` : ""}\n                ${Ee || ""}\n                ${He || ""}\n                ${Ue || ""}\n                ${
                                          qe || ""
                                      }\n                ${"classic" === w && C ? `background-color: ${C};` : ""}\n                ${"gradient" === w && N ? `background-image: ${N};` : ""}\n            } \n            `
                                    : ""
                            }\n        ${k ? `\n            .${i} .tabs-nav .tab-title.active .tab-title-text{\n                ${k ? `color: ${k};` : ""}\n            } \n            ` : ""}\n        ${
                                v && be
                                    ? `.${i} .tab-title + .tab-title {\n                    ${be ? `border-left-width: ${be}` : ""}\n                    ${
                                          p ? `border-left-color: ${p};` : ""
                                      }\n                    border-left-style: solid;\n            }`
                                    : ""
                            }\n        ${ae || s ? `.${i} .tabs-nav .tab-title .tab-title-text {\n                    ${ae || ""}\n                    ${s ? `color: ${s};` : ""}\n            }` : ""}\n        ${
                                he || b ? `.${i} .tabs-nav .tab-title .tab-title-media i {\n                    ${he || ""}\n                    ${b ? `color: ${b};` : ""}\n            }` : ""
                            }\n        ${ke || b ? `.${i} .tabs-nav .tab-title .tab-title-media svg {\n                    ${ke || ""}\n                    ${b ? `fill: ${b};` : ""}\n            }` : ""}\n        ${
                                Je || M ? `.${i} .tabs-nav .tab-title.active .tab-title-media i {\n                    ${Je || ""}\n                    ${M ? `color: ${M};` : ""}\n            }` : ""
                            }\n        ${ea || M ? `.${i} .tabs-nav .tab-title.active .tab-title-media svg {\n                    ${ea || ""}\n                    ${M ? `fill: ${M};` : ""}\n            }` : ""}\n        ${
                                Ne || $e || Te || Ae || x || S
                                    ? `\n            .${i} .tabs-content {\n                ${Ne || ""}\n                ${$e || ""}\n                ${Te || ""}\n                ${Ae || ""}\n                ${
                                          "classic" === h && x ? `background-color: ${x};` : ""
                                      }\n                ${"gradient" === h && S ? `background-image: ${S};` : ""}\n            } \n            `
                                    : ""
                            }\n    \n\t\t@media (max-width: 1024px) and (min-width: 768px) {\n\t\t\t\n        ${I || _ ? `.${i} .tabs-titles {\n            ${I || ""}\n            ${_ || ""}\n        }` : ""}\n        ${
                                "justify-content:space-between;" !== I ? `.${i} .tabs-titles .tab-title {\n            width: auto;\n        }` : ""
                            }\n        ${
                                z || W || Z || Q ? `\n            .${i} .tabs-nav {\n                ${z || ""}\n                ${W || ""}\n                ${Z || ""}\n                ${Q || ""}\n            }\n            ` : ""
                            }\n        ${
                                ne || oe || ge || fe || V || te
                                    ? `\n            .${i} .tabs-nav .tab-title {\n                ${V || ""}\n                ${te || ""}\n                ${ne || ""}\n                ${oe || ""}\n                ${
                                          ge || ""
                                      }\n                ${fe || ""}\n            }\n            `
                                    : ""
                            }\n        ${
                                Fe || Ge || Ke || Ye
                                    ? `\n            .${i} .tabs-nav .tab-title.active {\n                ${Fe || ""}\n                ${Ge || ""}\n                ${Ke || ""}\n                ${Ye || ""}\n            }\n            `
                                    : ""
                            }\n        ${
                                v && ve
                                    ? `.${i} .tab-title + .tab-title {\n                    ${ve ? `border-left-width: ${ve}` : ""}\n                    ${
                                          p ? `border-left-color: ${p};` : ""
                                      }\n                    border-left-style: solid;\n            }`
                                    : ""
                            }\n        ${xe ? `.${i} .tabs-nav .tab-title .tab-title-media i {\n                    ${xe || ""}\n            }` : ""}\n        ${
                                we ? `.${i} .tabs-nav .tab-title .tab-title-media svg {\n                    ${we || ""}\n            }` : ""
                            }\n        ${Xe ? `.${i} .tabs-nav .tab-title.active .tab-title-media i {\n                    ${Xe || ""}\n            }` : ""}\n        ${
                                aa ? `.${i} .tabs-nav .tab-title.active .tab-title-media svg {\n                    ${aa || ""}\n            }` : ""
                            }\n        ${
                                Me || Oe || Le || De
                                    ? `\n            .${i} .tabs-content {\n                ${Me || ""}\n                ${Oe || ""}\n                ${Le || ""}\n                ${fe || ""}\n            }\n            `
                                    : ""
                            }\n    \n\t\t}\n\t\t@media (max-width: 767px) {\n\t\t\t\n        ${A || E ? `.${i} .tabs-titles {\n            ${A || ""}\n            ${E || ""}\n        }` : ""}\n        ${
                                "justify-content:space-between;" !== A ? `.${i} .tabs-titles .tab-title {\n            width: auto;\n        }` : ""
                            }\n        ${
                                U || q || J || ee ? `\n            .${i} .tabs-nav {\n                ${U || ""}\n                ${q || ""}\n                ${J || ""}\n                ${ee || ""}\n            }\n            ` : ""
                            }\n        ${
                                se || ue || de || me || H || ie
                                    ? `\n            .${i} .tabs-nav .tab-title {\n                ${ie || ""}\n                ${H || ""}\n                ${se || ""}\n                ${ue || ""}\n                ${
                                          de || ""
                                      }\n                ${me || ""}\n            }\n            `
                                    : ""
                            }\n        ${
                                Ve || ze || We || Ze
                                    ? `\n            .${i} .tabs-nav .tab-title.active {\n                ${Ve || ""}\n                ${ze || ""}\n                ${We || ""}\n                ${Ze || ""}\n            }\n            `
                                    : ""
                            }\n        ${
                                v && pe
                                    ? `.${i} .tab-title + .tab-title {\n                    ${pe ? `border-left-width: ${pe}` : ""}\n                    ${
                                          p ? `border-left-color: ${p};` : ""
                                      }\n                    border-left-style: solid;\n            }`
                                    : ""
                            }\n        ${Se ? `.${i} .tabs-nav .tab-title .tab-title-media i {\n                    ${Se || ""}\n            }` : ""}\n        ${
                                Ce ? `.${i} .tabs-nav .tab-title .tab-title-media svg {\n                    ${Ce || ""}\n            }` : ""
                            }\n        ${Qe ? `.${i} .tabs-nav .tab-title.active .tab-title-media i {\n                    ${Qe || ""}\n            }` : ""}\n        ${
                                ta ? `.${i} .tabs-nav .tab-title.active .tab-title-media svg {\n                    ${ta || ""}\n            }` : ""
                            }\n        ${
                                je || Be || Ie || _e
                                    ? `\n            .${i} .tabs-content {\n                ${je || ""}\n                ${Be || ""}\n                ${Ie || ""}\n                ${_e || ""}\n            }\n            `
                                    : ""
                            }\n    \n\t\t}\n\t`;
                        return (
                            Io(() => {
                                JSON.stringify(r) !== JSON.stringify(ia) && a({ blockStyle: ia });
                            }, [e, ia]),
                            (0, y.jsxs)(Po, {
                                children: [
                                    (0, y.jsx)("style", { children: `${Lo(ia)}` }),
                                    (0, y.jsx)(To, { attributes: e, setAttributes: a, handleTabClick: L, clientId: t }),
                                    (0, y.jsx)("div", {
                                        ...R,
                                        children: (0, y.jsxs)("div", {
                                            className: "tabs-container",
                                            ref: j,
                                            children: [
                                                (0, y.jsx)("div", {
                                                    className: "tabs-nav",
                                                    children: (0, y.jsx)("ul", {
                                                        className: "tabs-titles",
                                                        children:
                                                            n &&
                                                            n.map((e, t) =>
                                                                (0, y.jsxs)(
                                                                    "li",
                                                                    {
                                                                        className: `tab-title ${o} ${($ || B) === e.id ? "active" : ""}`,
                                                                        "data-title-tab-id": e.id,
                                                                        role: "button",
                                                                        onClick: () => {
                                                                            L(e.id);
                                                                        },
                                                                        children: [
                                                                            e.hasMedia &&
                                                                                (0, y.jsx)("div", {
                                                                                    className: "tab-title-media",
                                                                                    children:
                                                                                        "iconLibrary" === e.mediaType
                                                                                            ? (0, y.jsx)("i", { className: `bi bi-${e.icon}` })
                                                                                            : e.customSVG && "" !== e.customSVG && (0, y.jsx)(Ro, { children: e.customSVG }),
                                                                                }),
                                                                            (0, y.jsx)(Re.RichText, {
                                                                                tagName: "span",
                                                                                className: "tab-title-text",
                                                                                value: e.title,
                                                                                onChange: (e) => {
                                                                                    const i = [...n];
                                                                                    (i[t].title = e), a({ tabTitles: i });
                                                                                },
                                                                                placeholder: _o("Tab Title..", "arkhe-blocks"),
                                                                            }),
                                                                        ],
                                                                    },
                                                                    t
                                                                )
                                                            ),
                                                    }),
                                                }),
                                                (0, y.jsx)("div", {
                                                    className: "tabs-content",
                                                    children: (0, y.jsx)(Re.InnerBlocks, { templateLock: "all", template: (0, Pe.times)(l, (e) => ["jankx/tab", { tabId: `${e + 1}`, tabParentId: i }]), allowedBlocks: ["jankx/tab"] }),
                                                }),
                                            ],
                                        }),
                                    }),
                                ],
                            })
                        );
                    },
                    save: function ({ attributes: e }) {
                        const { uniqueId: a, tabTitles: t, iconPosition: i } = e,
                            r = Re.useBlockProps.save({ className: a });
                        return (0, y.jsx)("div", {
                            ...r,
                            children: (0, y.jsxs)("div", {
                                className: "tabs-container",
                                children: [
                                    (0, y.jsx)("div", {
                                        className: "tabs-nav",
                                        children: (0, y.jsx)("ul", {
                                            className: "tabs-titles",
                                            children:
                                                t &&
                                                t.map((e, a) =>
                                                    (0, y.jsxs)(
                                                        "li",
                                                        {
                                                            className: `tab-title ${i}`,
                                                            "data-title-tab-id": e.id,
                                                            role: "button",
                                                            children: [
                                                                e.hasMedia &&
                                                                    (0, y.jsx)("div", {
                                                                        className: "tab-title-media",
                                                                        children:
                                                                            "iconLibrary" === e.mediaType ? (0, y.jsx)("i", { className: `bi bi-${e.icon}` }) : e.customSVG && "" !== e.customSVG && (0, y.jsx)(mu, { children: e.customSVG }),
                                                                    }),
                                                                (0, y.jsx)(Re.RichText.Content, { tagName: "span", className: "tab-title-text", value: e.title }),
                                                            ],
                                                        },
                                                        a
                                                    )
                                                ),
                                        }),
                                    }),
                                    (0, y.jsx)("div", { className: "tabs-content", children: (0, y.jsx)(Re.InnerBlocks.Content, {}) }),
                                ],
                            }),
                        });
                    },
                    deprecated: [],
                });
            },
            404: (e, a, t) => {
                e.exports = t(72);
            },
        },
        t = {};
    function i(e) {
        var r = t[e];
        if (void 0 !== r) return r.exports;
        var n = (t[e] = { exports: {} });
        return a[e](n, n.exports, i), n.exports;
    }
    (i.m = a),
        (e = []),
        (i.O = (a, t, r, n) => {
            if (!t) {
                var s = 1 / 0;
                for (c = 0; c < e.length; c++) {
                    for (var [t, r, n] = e[c], l = !0, o = 0; o < t.length; o++) (!1 & n || s >= n) && Object.keys(i.O).every((e) => i.O[e](t[o])) ? t.splice(o--, 1) : ((l = !1), n < s && (s = n));
                    if (l) {
                        e.splice(c--, 1);
                        var u = r();
                        void 0 !== u && (a = u);
                    }
                }
                return a;
            }
            n = n || 0;
            for (var c = e.length; c > 0 && e[c - 1][2] > n; c--) e[c] = e[c - 1];
            e[c] = [t, r, n];
        }),
        (i.n = (e) => {
            var a = e && e.__esModule ? () => e.default : () => e;
            return i.d(a, { a }), a;
        }),
        (i.d = (e, a) => {
            for (var t in a) i.o(a, t) && !i.o(e, t) && Object.defineProperty(e, t, { enumerable: !0, get: a[t] });
        }),
        (i.o = (e, a) => Object.prototype.hasOwnProperty.call(e, a)),
        (i.r = (e) => {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
        }),
        (() => {
            var e = { 881: 0, 293: 0 };
            i.O.j = (a) => 0 === e[a];
            var a = (a, t) => {
                    var r,
                        n,
                        [s, l, o] = t,
                        u = 0;
                    if (s.some((a) => 0 !== e[a])) {
                        for (r in l) i.o(l, r) && (i.m[r] = l[r]);
                        if (o) var c = o(i);
                    }
                    for (a && a(t); u < s.length; u++) (n = s[u]), i.o(e, n) && e[n] && e[n][0](), (e[n] = 0);
                    return i.O(c);
                },
                t = (globalThis.webpackChunkgutenberg_boilerplate = globalThis.webpackChunkgutenberg_boilerplate || []);
            t.forEach(a.bind(null, 0)), (t.push = a.bind(null, t.push.bind(t)));
        })();
    var r = i.O(void 0, [293], () => i(373));
    r = i.O(r);
})();

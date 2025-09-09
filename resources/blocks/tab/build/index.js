/******/ (() => { // webpackBootstrap
/*!******************************!*\
  !*** ./blocks/tab/index.tsx ***!
  \******************************/
(() => {
  "use strict";

  var e,
    t = {
      743: () => {
        const e = window.wp.blocks,
          t = JSON.parse('{"apiVersion":3,"name":"jankx/tab","title":"Tab","category":"jankx-block","description":"Show your content in a horizontal tab.","parent":["jankx/tabs"],"supports":{"html":false,"anchor":false,"customClassName":false},"textdomain":"advanced-tabs-block","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}'),
          r = window.wp.blockEditor,
          a = window.wp.data,
          n = window.ReactJSXRuntime;
        (0, e.registerBlockType)(t, {
          icon: {
            src: (0, n.jsx)("svg", {
              width: 112,
              height: 62,
              viewBox: "0 0 112 62",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              children: (0, n.jsx)("rect", {
                x: 3,
                y: 3,
                width: 106,
                height: 56,
                fill: "white",
                stroke: "#007CBA",
                strokeWidth: 6
              })
            })
          },
          attributes: {
            tabId: {
              type: "string"
            },
            tabParentId: {
              type: "string"
            }
          },
          edit: function ({
            attributes: e,
            clientId: t
          }) {
            const {
              tabId: i,
              tabParentId: o
            } = e;
            return (0, n.jsx)("div", {
              ...(0, r.useBlockProps)(),
              children: (0, n.jsx)("div", {
                className: "single-tab",
                "data-tab-id": i,
                "data-tab-parent-id": o,
                style: {
                  display: "1" === i ? "block" : "none"
                },
                children: (0, n.jsx)(r.InnerBlocks, {
                  orientation: "vertical",
                  templateLock: !1,
                  renderAppender: (0, a.select)("core/block-editor").getBlockOrder(t).length > 0 ? void 0 : r.InnerBlocks.ButtonBlockAppender
                })
              })
            });
          },
          save: function ({
            attributes: e
          }) {
            const {
                tabId: t,
                tabParentId: a
              } = e,
              i = r.useBlockProps.save();
            return (0, n.jsx)("div", {
              ...i,
              children: (0, n.jsx)("div", {
                className: "single-tab",
                "data-tab-id": t,
                "data-tab-parent-id": a,
                children: (0, n.jsx)(r.InnerBlocks.Content, {})
              })
            });
          },
          deprecated: []
        });
      }
    },
    r = {};
  function a(e) {
    var n = r[e];
    if (void 0 !== n) return n.exports;
    var i = r[e] = {
      exports: {}
    };
    return t[e](i, i.exports, a), i.exports;
  }
  a.m = t, e = [], a.O = (t, r, n, i) => {
    if (!r) {
      var o = 1 / 0;
      for (c = 0; c < e.length; c++) {
        for (var [r, n, i] = e[c], s = !0, l = 0; l < r.length; l++) (!1 & i || o >= i) && Object.keys(a.O).every(e => a.O[e](r[l])) ? r.splice(l--, 1) : (s = !1, i < o && (o = i));
        if (s) {
          e.splice(c--, 1);
          var d = n();
          void 0 !== d && (t = d);
        }
      }
      return t;
    }
    i = i || 0;
    for (var c = e.length; c > 0 && e[c - 1][2] > i; c--) e[c] = e[c - 1];
    e[c] = [r, n, i];
  }, a.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => {
    var e = {
      392: 0,
      888: 0
    };
    a.O.j = t => 0 === e[t];
    var t = (t, r) => {
        var n,
          i,
          [o, s, l] = r,
          d = 0;
        if (o.some(t => 0 !== e[t])) {
          for (n in s) a.o(s, n) && (a.m[n] = s[n]);
          if (l) var c = l(a);
        }
        for (t && t(r); d < o.length; d++) i = o[d], a.o(e, i) && e[i] && e[i][0](), e[i] = 0;
        return a.O(c);
      },
      r = globalThis.webpackChunkgutenberg_boilerplate = globalThis.webpackChunkgutenberg_boilerplate || [];
    r.forEach(t.bind(null, 0)), r.push = t.bind(null, r.push.bind(r));
  })();
  var n = a.O(void 0, [888], () => a(743));
  n = a.O(n);
})();
/******/ })()
;
//# sourceMappingURL=index.js.map
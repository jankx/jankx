(() => {
    "use strict";
    var e,
        r = {
            998: () => {
                const e = window.wp.blocks,
                    r = window.wp.blockEditor,
                    a = window.wp.i18n,
                    l = window.wp.element,
                    t = window.wp.components,
                    o = window.ReactJSXRuntime,
                    i = ({ generalControls: e = null, styleControls: l = null, advancedControls: i = null }) => {
                        const n = [];
                        return (
                            e && n.push({ name: "general", title: (0, a.__)("General", "jankx-swiper"), className: "jankx-swiper-tab-panel general" }),
                            l && n.push({ name: "styles", title: (0, a.__)("Style", "jankx-swiper"), className: "jankx-swiper-tab-panel styles" }),
                            i && n.push({ name: "advanced", title: (0, a.__)("Advanced", "jankx-swiper"), className: "jankx-swiper-tab-panel advanced" }),
                            (0, o.jsx)(
                                r.InspectorControls,
                                {
                                    children: (0, o.jsx)("div", {
                                        className: "jankx-swiper-inspector-control",
                                        children: (0, o.jsx)(t.TabPanel, {
                                            className: "jankx-swiper-parent-tab-panel",
                                            activeClass: "active-tab",
                                            tabs: n,
                                            children: (r) => (0, o.jsxs)("div", { className: `jankx-swiper-tab-panel-controls ${r.name}`, children: ["general" === r.name && e, "styles" === r.name && l, "advanced" === r.name && i] }),
                                        }),
                                    }),
                                },
                                "controls"
                            )
                        );
                    },
                    n = window.wp.data,
                    s =
                        ((0, a.__)("px", "jankx-swiper"),
                        (0, a.__)("%", "jankx-swiper"),
                        (0, a.__)("em", "jankx-swiper"),
                        (0, a.__)("rem", "jankx-swiper"),
                        (0, a.__)("vh", "jankx-swiper"),
                        (0, a.__)("vw", "jankx-swiper"),
                        (0, a.__)("Normal", "jankx-swiper"),
                        (0, a.__)("Hover", "jankx-swiper"),
                        (0, a.__)((0, o.jsx)(t.Dashicon, { icon: "admin-generic" })),
                        (0, a.__)((0, o.jsx)(t.Dashicon, { icon: "format-image" })),
                        (0, a.__)((0, o.jsx)(t.Dashicon, { icon: "remove" })),
                        (0, a.__)((0, o.jsx)(t.Dashicon, { icon: "admin-generic" })),
                        (0, a.__)((0, o.jsx)(t.Dashicon, { icon: "editor-alignleft" })),
                        (0, a.__)((0, o.jsx)(t.Dashicon, { icon: "editor-aligncenter" })),
                        (0, a.__)((0, o.jsx)(t.Dashicon, { icon: "editor-alignright" })),
                        {
                            top: (0, o.jsx)("svg", {
                                width: "24",
                                height: "24",
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 24 24",
                                "aria-hidden": "true",
                                focusable: "false",
                                children: (0, o.jsx)("path", { d: "M9 9v6h11V9H9zM4 20h1.5V4H4v16z" }),
                            }),
                            middle: (0, o.jsx)("svg", {
                                width: "24",
                                height: "24",
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 24 24",
                                "aria-hidden": "true",
                                focusable: "false",
                                children: (0, o.jsx)("path", { d: "M12.5 15v5H11v-5H4V9h7V4h1.5v5h7v6h-7Z" }),
                            }),
                            bottom: (0, o.jsx)("svg", {
                                width: "24",
                                height: "24",
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 24 24",
                                "aria-hidden": "true",
                                focusable: "false",
                                children: (0, o.jsx)("path", { d: "M4 15h11V9H4v6zM18.5 4v16H20V4h-1.5z" }),
                            }),
                        }),
                    d = {
                        left: (0, o.jsx)("svg", {
                            width: "24",
                            height: "24",
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 24 24",
                            "aria-hidden": "true",
                            focusable: "false",
                            children: (0, o.jsx)("path", { d: "M9 9v6h11V9H9zM4 20h1.5V4H4v16z" }),
                        }),
                        center: (0, o.jsx)("svg", {
                            width: "24",
                            height: "24",
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 24 24",
                            "aria-hidden": "true",
                            focusable: "false",
                            children: (0, o.jsx)("path", { d: "M12.5 15v5H11v-5H4V9h7V4h1.5v5h7v6h-7Z" }),
                        }),
                        right: (0, o.jsx)("svg", {
                            width: "24",
                            height: "24",
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 24 24",
                            "aria-hidden": "true",
                            focusable: "false",
                            children: (0, o.jsx)("path", { d: "M4 15h11V9H4v6zM18.5 4v16H20V4h-1.5z" }),
                        }),
                    },
                    g =
                        ((0, a.__)(s.top),
                        (0, a.__)(s.middle),
                        (0, a.__)(s.bottom),
                        (0, a.__)(d.left),
                        (0, a.__)(d.center),
                        (0, a.__)(d.right),
                        (0, a.__)("H1", "jankx-swiper"),
                        (0, a.__)("H2", "jankx-swiper"),
                        (0, a.__)("H3", "jankx-swiper"),
                        (0, a.__)("H4", "jankx-swiper"),
                        (0, a.__)("H5", "jankx-swiper"),
                        (0, a.__)("H6", "jankx-swiper"),
                        (0, a.__)("P", "jankx-swiper"),
                        (0, a.__)("Span", "jankx-swiper"),
                        (0, a.__)("None", "jankx-swiper"),
                        (0, a.__)("Solid", "jankx-swiper"),
                        (0, a.__)("Dashed", "jankx-swiper"),
                        (0, a.__)("Dotted", "jankx-swiper"),
                        (0, a.__)("Double", "jankx-swiper"),
                        (0, a.__)("Groove", "jankx-swiper"),
                        (0, a.__)("Outset", "jankx-swiper"),
                        (0, a.__)("Ridge", "jankx-swiper"),
                        (0, a.__)("Slide", "jankx-swiper"),
                        (0, a.__)("Fade", "jankx-swiper"),
                        (0, a.__)("Coverflow", "jankx-swiper"),
                        (0, a.__)("Flip", "jankx-swiper"),
                        (0, a.__)("Creative", "jankx-swiper"),
                        (0, a.__)("Slide", "jankx-swiper"),
                        (0, a.__)("Coverflow", "jankx-swiper"),
                        (0, a.__)("Slider", "jankx-swiper"),
                        (0, a.__)("Carousel", "jankx-swiper"),
                        (0, a.__)("Bullets", "jankx-swiper"),
                        (0, a.__)("Fraction", "jankx-swiper"),
                        (0, a.__)("Progress Bar", "jankx-swiper"),
                        (0, a.__)("Inside", "jankx-swiper"),
                        (0, a.__)("Outside", "jankx-swiper"),
                        (0, a.__)("Center Center", "jankx-swiper"),
                        (0, a.__)("Top Left", "jankx-swiper"),
                        (0, a.__)("Top Center", "jankx-swiper"),
                        (0, a.__)("Top Right", "jankx-swiper"),
                        (0, a.__)("Bottom Left", "jankx-swiper"),
                        (0, a.__)("Bottom Center", "jankx-swiper"),
                        (0, a.__)("Bottom Right", "jankx-swiper"),
                        (0, a.__)("Row", "jankx-swiper"),
                        (0, a.__)("Column", "jankx-swiper"),
                        (0, a.__)("Row Reverse", "jankx-swiper"),
                        (0, a.__)("Column Reverse", "jankx-swiper"),
                        (0, a.__)("Normal", "jankx-swiper"),
                        (0, a.__)("Active", "jankx-swiper"),
                        (0, a.__)("Default", "jankx-swiper"),
                        (0, a.__)("100", "jankx-swiper"),
                        (0, a.__)("200", "jankx-swiper"),
                        (0, a.__)("300", "jankx-swiper"),
                        (0, a.__)("400", "jankx-swiper"),
                        (0, a.__)("500", "jankx-swiper"),
                        (0, a.__)("600", "jankx-swiper"),
                        (0, a.__)("700", "jankx-swiper"),
                        (0, a.__)("800", "jankx-swiper"),
                        (0, a.__)("900", "jankx-swiper"),
                        (0, a.__)("Default", "jankx-swiper"),
                        (0, a.__)("Normal", "jankx-swiper"),
                        (0, a.__)("Italic", "jankx-swiper"),
                        (0, a.__)("Oblique", "jankx-swiper"),
                        (0, a.__)("Default", "jankx-swiper"),
                        (0, a.__)("None", "jankx-swiper"),
                        (0, a.__)("Capitalize", "jankx-swiper"),
                        (0, a.__)("Uppercase", "jankx-swiper"),
                        (0, a.__)("Lowercase", "jankx-swiper"),
                        (0, a.__)("Default", "jankx-swiper"),
                        (0, a.__)("None", "jankx-swiper"),
                        (0, a.__)("Underline", "jankx-swiper"),
                        (0, a.__)("Overline", "jankx-swiper"),
                        (0, a.__)("Line Through", "jankx-swiper"),
                        (e, r = !0) => {
                            const a = (0, n.dispatch)("core/edit-site")?.__experimentalSetPreviewDeviceType || (0, n.dispatch)("core/edit-post")?.__experimentalSetPreviewDeviceType || (0, n.dispatch)(frontisStore)?.setDeviceType;
                            a && "function" == typeof a && (a(e), r && c(e));
                        }),
                    c = (e) => {
                        if (!window.location.href.includes("/customize.php") || !window?.wp?.customize) return;
                        if ("string" != typeof e) return;
                        const r = e.toLowerCase();
                        ["desktop", "tablet", "mobile"].includes(r) && wp.customize.previewedDevice.set(r);
                    },
                    m = ({ label: e, device: r }) => {
                        const l = (e) => {
                            if (e)
                                try {
                                    g(e, !1);
                                } catch (e) {
                                    console.error("Error setting device type:", e);
                                }
                            else console.error("Invalid device type:", e);
                        };
                        return (0, o.jsx)(o.Fragment, {
                            children: (0, o.jsxs)("div", {
                                className: "jankx-swiper-setting-device-label-wrapper",
                                children: [
                                    (0, o.jsx)("span", { className: "jankx-swiper-setting-label-text", children: (0, a.__)(e, "jankx-swiper") }),
                                    (0, o.jsx)("div", {
                                        className: "jankx-swiper-responsive-device-wrapper",
                                        onClick: (e) => {
                                            e.currentTarget.classList.toggle("jankx-swiper-device-switchers-open");
                                        },
                                        children: (0, o.jsxs)("div", {
                                            className: "jankx-swiper-responsive-device-inner-wrapper",
                                            children: [
                                                (0, o.jsx)("button", {
                                                    className: "jankx-swiper-device-switcher jankx-swiper-responsive-desktop-device " + ("Desktop" === r ? "active" : ""),
                                                    onClick: () => l("Desktop"),
                                                    children: (0, o.jsxs)("svg", {
                                                        width: "10",
                                                        height: "10",
                                                        viewBox: "0 0 10 10",
                                                        fill: "none",
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        children: [
                                                            (0, o.jsx)("path", {
                                                                d:
                                                                    "M4.64645 7.35355C4.84171 7.15829 5.15829 7.15829 5.35355 7.35355L7.14645 9.14645C7.46143 9.46143 7.23835 10 6.79289 10H3.20711C2.76165 10 2.53857 9.46143 2.85355 9.14645L4.64645 7.35355Z",
                                                                fill: "#1E1E1E",
                                                            }),
                                                            (0, o.jsx)("rect", { x: "0.5", y: "1.5", width: "9", height: "6", rx: "1", stroke: "#1E1E1E" }),
                                                        ],
                                                    }),
                                                }),
                                                (0, o.jsx)("button", {
                                                    className: "jankx-swiper-device-switcher jankx-swiper-responsive-tablet-device " + ("Tablet" === r ? "active" : ""),
                                                    onClick: () => l("Tablet"),
                                                    children: (0, o.jsxs)("svg", {
                                                        width: "10",
                                                        height: "10",
                                                        viewBox: "0 0 10 10",
                                                        fill: "none",
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        children: [(0, o.jsx)("rect", { x: "1.5", y: "0.5", width: "7", height: "9", rx: "1", stroke: "#1E1E1E" }), (0, o.jsx)("circle", { cx: "5", cy: "8", r: "1", fill: "#1E1E1E" })],
                                                    }),
                                                }),
                                                (0, o.jsx)("button", {
                                                    className: "jankx-swiper-device-switcher jankx-swiper-responsive-mobile-device " + ("Mobile" === r ? "active" : ""),
                                                    onClick: () => l("Mobile"),
                                                    children: (0, o.jsxs)("svg", {
                                                        width: "10",
                                                        height: "10",
                                                        viewBox: "0 0 10 10",
                                                        fill: "none",
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        children: [
                                                            (0, o.jsx)("rect", { x: "2.5", y: "0.5", width: "5", height: "9", rx: "1", stroke: "#1E1E1E" }),
                                                            (0, o.jsx)("path", {
                                                                d: "M7 1.08412C6.9572 1.59704 6.52662 2 6.00175 2H3.99825C3.47338 2 3.0428 1.59704 3 1.08412C3.15567 1.02963 3.32306 1 3.49738 1H6.50262C6.67694 1 6.84433 1.02963 7 1.08412Z",
                                                                fill: "#1E1E1E",
                                                            }),
                                                        ],
                                                    }),
                                                }),
                                            ],
                                        }),
                                    }),
                                ],
                            }),
                        });
                    },
                    b = ({
                        label: e = (0, a.__)("Background Image", "jankx-swiper"),
                        deviceType: r,
                        globalBackgroundImageUrl: l = "",
                        setGlobalBackgroundImageUrl: i,
                        globalBackgroundImageAlt: n = "",
                        setGlobalBackgroundImageAlt: s,
                        globalBackgroundImageID: d = "",
                        setGlobalBackgroundImageID: g,
                        globalBackgroundImagePosition: c = "",
                        setGlobalBackgroundImagePosition: b,
                        globalBackgroundImageAttachment: u = "",
                        setGlobalBackgroundImageAttachment: k,
                        globalBackgroundImageRepeat: p = "",
                        setGlobalBackgroundImageRepeat: h,
                        globalBackgroundImageSize: v = "",
                        setGlobalBackgroundImageSize: C,
                        setAttributes: _,
                    }) => {
                        const B = (e) => {
                                i({ ...l, [r]: e }), _({ globalBackgroundImageUrl: { ...l, ...e } });
                            },
                            F = () => {
                                const e = wp.media({ title: (0, a.__)("Select or Upload background Image", "jankx-swiper"), button: { text: (0, a.__)("Use this image", "jankx-swiper") }, multiple: !1 });
                                e.on("select", function () {
                                    const r = e.state().get("selection").first().toJSON();
                                    B(r.url), s(r.alt), g(r.id);
                                }),
                                    e.open();
                            };
                        return (0, o.jsxs)(t.BaseControl, {
                            className: "jankx-swiper-image-control-wrapper",
                            children: [
                                (0, o.jsx)(m, { label: e, device: r }),
                                l[r]
                                    ? (0, o.jsxs)("div", {
                                          className: "jankx-swiper-image-control-integrated",
                                          children: [
                                              (0, o.jsxs)("div", {
                                                  className: "jankx-swiper-image-focal-point-wrapper",
                                                  children: [
                                                      (0, o.jsx)(t.FocalPointPicker, {
                                                          url: l[r],
                                                          value: c[r],
                                                          onChange: (e) => {
                                                              b({ ...c, [r]: e }), _({ globalBackgroundImagePosition: { ...c, ...e } });
                                                          },
                                                      }),
                                                      (0, o.jsxs)("div", {
                                                          className: "jankx-swiper-image-overlay-buttons",
                                                          children: [
                                                              (0, o.jsx)("button", {
                                                                  className: "jankx-swiper-image-delete",
                                                                  onClick: () => {
                                                                      B(null), s(null), g(null);
                                                                  },
                                                                  title: (0, a.__)("Delete Image", "jankx-swiper"),
                                                                  children: (0, o.jsxs)("svg", {
                                                                      width: "24",
                                                                      height: "24",
                                                                      viewBox: "0 0 24 24",
                                                                      fill: "none",
                                                                      xmlns: "http://www.w3.org/2000/svg",
                                                                      children: [
                                                                          (0, o.jsx)("path", {
                                                                              d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z",
                                                                              stroke: "#4D4D4D",
                                                                              strokeWidth: "1.5",
                                                                          }),
                                                                          (0, o.jsx)("path", { d: "M15 9L9 15", stroke: "#4D4D4D", strokeWidth: "1.5" }),
                                                                          (0, o.jsx)("path", { d: "M9 9L15 15", stroke: "#4D4D4D", strokeWidth: "1.5" }),
                                                                      ],
                                                                  }),
                                                              }),
                                                              (0, o.jsx)("button", {
                                                                  className: "jankx-swiper-image-replace-btn",
                                                                  onClick: F,
                                                                  title: (0, a.__)("Replace Image", "jankx-swiper"),
                                                                  children: (0, o.jsxs)("svg", {
                                                                      width: "25",
                                                                      height: "24",
                                                                      viewBox: "0 0 25 24",
                                                                      fill: "none",
                                                                      xmlns: "http://www.w3.org/2000/svg",
                                                                      children: [
                                                                          (0, o.jsx)("path", {
                                                                              d:
                                                                                  "M10.4431 19.75C10.8573 19.75 11.1931 19.4142 11.1931 19C11.1931 18.5858 10.8573 18.25 10.4431 18.25V19.75ZM11.9431 5V5.75C12.2464 5.75 12.5199 5.56727 12.636 5.28701C12.7521 5.00676 12.6879 4.68417 12.4734 4.46967L11.9431 5ZM10.4734 2.46967C10.1806 2.17678 9.70568 2.17678 9.41279 2.46967C9.1199 2.76256 9.1199 3.23744 9.41279 3.53033L10.4734 2.46967ZM10.4431 18.25H9.9434V19.75H10.4431V18.25ZM9.94312 5.75H11.9431V4.25H9.94312V5.75ZM12.4734 4.46967L10.4734 2.46967L9.41279 3.53033L11.4128 5.53033L12.4734 4.46967ZM2.19312 12C2.19312 16.2802 5.66323 19.75 9.9434 19.75V18.25C6.49158 18.25 3.69312 15.4517 3.69312 12H2.19312ZM3.69312 12C3.69312 8.54822 6.49134 5.75 9.94312 5.75V4.25C5.66291 4.25 2.19312 7.71979 2.19312 12H3.69312Z",
                                                                              fill: "#1C274C",
                                                                          }),
                                                                          (0, o.jsx)("path", {
                                                                              d:
                                                                                  "M13.9431 19V18.25C13.6398 18.25 13.3663 18.4327 13.2502 18.713C13.1341 18.9932 13.1983 19.3158 13.4128 19.5303L13.9431 19ZM15.4128 21.5303C15.7057 21.8232 16.1805 21.8232 16.4734 21.5303C16.7663 21.2374 16.7663 20.7626 16.4734 20.4697L15.4128 21.5303ZM15.4431 4.25C15.0289 4.25 14.6931 4.58579 14.6931 5C14.6931 5.41421 15.0289 5.75 15.4431 5.75V4.25ZM15.9431 18.25H13.9431V19.75H15.9431V18.25ZM13.4128 19.5303L15.4128 21.5303L16.4734 20.4697L14.4734 18.4697L13.4128 19.5303ZM15.4431 5.75H15.9431V4.25H15.4431V5.75ZM22.1931 12C22.1931 15.4518 19.3949 18.25 15.9431 18.25V19.75C20.2233 19.75 23.6931 16.2802 23.6931 12H22.1931ZM23.6931 12C23.6931 7.71979 20.2233 4.25 15.9431 4.25V5.75C19.3949 5.75 22.1931 8.54822 22.1931 12H23.6931Z",
                                                                              fill: "#1C274C",
                                                                          }),
                                                                      ],
                                                                  }),
                                                              }),
                                                          ],
                                                      }),
                                                  ],
                                              }),
                                              (0, o.jsx)("div", {
                                                  className: "jankx-swiper-image-control-setting-wrapper",
                                                  children: (0, o.jsxs)(t.BaseControl, {
                                                      children: [
                                                          (0, o.jsxs)("div", {
                                                              className: "jankx-swiper-image-control-setting-item",
                                                              children: [
                                                                  (0, o.jsx)(m, { label: (0, a.__)("Attachment", "jankx-swiper"), device: r }),
                                                                  (0, o.jsx)(t.SelectControl, {
                                                                      className: "jankx-swiper-image-label",
                                                                      value: u[r],
                                                                      options: [
                                                                          { label: (0, a.__)("Default", "jankx-swiper"), value: "" },
                                                                          { label: (0, a.__)("Scroll", "jankx-swiper"), value: "scroll" },
                                                                          { label: (0, a.__)("Fixed", "jankx-swiper"), value: "fixed" },
                                                                      ],
                                                                      onChange: (e) => {
                                                                          k({ ...u, [r]: e }), _({ globalBackgroundImageAttachment: { ...u, ...e } });
                                                                      },
                                                                  }),
                                                              ],
                                                          }),
                                                          (0, o.jsxs)("div", {
                                                              className: "jankx-swiper-image-control-setting-item",
                                                              children: [
                                                                  (0, o.jsx)(m, { label: (0, a.__)("Repeat", "jankx-swiper"), device: r }),
                                                                  (0, o.jsx)(t.SelectControl, {
                                                                      className: "jankx-swiper-image-label",
                                                                      value: p[r],
                                                                      options: [
                                                                          { label: (0, a.__)("Default", "jankx-swiper"), value: "" },
                                                                          { label: (0, a.__)("Repeat", "jankx-swiper"), value: "repeat" },
                                                                          { label: (0, a.__)("Repeat X", "jankx-swiper"), value: "repeat-x" },
                                                                          { label: (0, a.__)("Repeat Y", "jankx-swiper"), value: "repeat-y" },
                                                                          { label: (0, a.__)("No Repeat", "jankx-swiper"), value: "no-repeat" },
                                                                      ],
                                                                      onChange: (e) => {
                                                                          h({ ...p, [r]: e }), _({ globalBackgroundImageRepeat: { ...p, ...e } });
                                                                      },
                                                                  }),
                                                              ],
                                                          }),
                                                          (0, o.jsxs)("div", {
                                                              className: "jankx-swiper-image-control-setting-item",
                                                              children: [
                                                                  (0, o.jsx)(m, { label: (0, a.__)("Size", "jankx-swiper"), device: r }),
                                                                  (0, o.jsx)(t.SelectControl, {
                                                                      className: "jankx-swiper-image-label",
                                                                      value: v[r],
                                                                      options: [
                                                                          { label: (0, a.__)("Default", "jankx-swiper"), value: "" },
                                                                          { label: (0, a.__)("Auto", "jankx-swiper"), value: "auto" },
                                                                          { label: (0, a.__)("Cover", "jankx-swiper"), value: "cover" },
                                                                          { label: (0, a.__)("Contain", "jankx-swiper"), value: "contain" },
                                                                      ],
                                                                      onChange: (e) => {
                                                                          C({ ...v, [r]: e }), _({ globalBackgroundImageSize: { ...v, ...e } });
                                                                      },
                                                                  }),
                                                              ],
                                                          }),
                                                      ],
                                                  }),
                                              }),
                                          ],
                                      })
                                    : (0, o.jsxs)("button", {
                                          className: "jankx-swiper-image-upload-btn",
                                          onClick: F,
                                          children: [
                                              (0, o.jsx)("svg", {
                                                  width: "24",
                                                  height: "24",
                                                  xmlns: "http://www.w3.org/2000/svg",
                                                  fillRule: "evenodd",
                                                  clipRule: "evenodd",
                                                  children: (0, o.jsx)("path", {
                                                      d:
                                                          "M11.492 10.172l-2.5 3.064-.737-.677 3.737-4.559 3.753 4.585-.753.665-2.5-3.076v7.826h-1v-7.828zm7.008 9.828h-13c-2.481 0-4.5-2.018-4.5-4.5 0-2.178 1.555-4.038 3.698-4.424l.779-.14.043-.789c.185-3.448 3.031-6.147 6.48-6.147 3.449 0 6.295 2.699 6.478 6.147l.044.789.78.14c2.142.386 3.698 2.246 3.698 4.424 0 2.482-2.019 4.5-4.5 4.5m.978-9.908c-.212-3.951-3.472-7.092-7.478-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.522-5.408",
                                                  }),
                                              }),
                                              (0, a.__)("Image or SVG Upload", "jankx-swiper"),
                                          ],
                                      }),
                            ],
                        });
                    },
                    u = ({
                        label: e = "",
                        globalCustomGradientSwitcher: r,
                        setGlobalCustomGradientSwitcher: l,
                        globalCustomGradientInputValue: i,
                        setGlobalCustomGradientInputValue: n,
                        globalGradientColor: s = null,
                        setGlobalGradientColor: d,
                    }) =>
                        (0, o.jsxs)(t.BaseControl, {
                            label: e,
                            className: "global-gradient-color-setting-wrapper",
                            children: [
                                (0, o.jsx)("div", {
                                    className: "global-gradient-custom-gradient-wrapper",
                                    children: (0, o.jsx)(t.ToggleControl, { label: (0, a.__)("Add Custom Gradient", "jankx-swiper"), checked: r, onChange: l, className: "global-gradient-label" }),
                                }),
                                r
                                    ? (0, o.jsx)("div", {
                                          className: "global-gradient-custom-gradient-textarea-wrapper",
                                          children: (0, o.jsx)(t.TextareaControl, { value: i, onChange: n, help: (0, a.__)("Add your gradient color here.", "jankx-swiper"), className: "global-gradient-custom-gradient-textarea" }),
                                      })
                                    : (0, o.jsx)(t.BaseControl, {
                                          className: "global-gradient-picker-wrapper",
                                          children: (0, o.jsx)(t.GradientPicker, {
                                              value: s,
                                              onChange: d,
                                              className: "global-gradient-picker",
                                              gradients: [
                                                  { gradient: "linear-gradient(135deg, rgba(6,147,227,1) 0%, rgb(155,81,224) 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgb(122,220,180) 0%, rgb(0,208,130) 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgba(252,185,0,1) 0%, rgba(255,105,0,1) 100%)" },
                                                  { gradient: "linear-gradient(135deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgba(255,105,0,1) 0%, rgb(207,46,46) 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgb(238,238,238) 0%, rgb(169,184,195) 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgb(74,234,220) 0%, rgb(151,120,209) 20%, rgb(207,42,186) 40%, rgb(238,44,130) 60%, rgb(251,105,98) 80%, rgb(254,248,76) 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgb(255,238,88) 0%, rgb(255,140,0) 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgb(0,176,255) 0%, rgb(75,0,130) 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgb(255,173,173) 0%, rgb(255,61,61) 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgb(135,131,120) 0%, rgb(41,44,47) 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgb(240,86,199) 0%, rgb(255,72,0) 100%)" },
                                                  { gradient: "linear-gradient(135deg, rgb(120,191,255) 0%, rgb(0,102,204) 100%)" },
                                                  { gradient: "linear-gradient(180deg,#582DF9, #04E0FA)" },
                                                  { gradient: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)" },
                                                  { gradient: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)" },
                                                  { gradient: "linear-gradient(0deg, #08AEEA 0%, #2AF598 100%)" },
                                                  { gradient: "linear-gradient(to right, rgb(110, 231, 183), rgb(59, 130, 246), rgb(147, 51, 234))" },
                                                  { gradient: "linear-gradient(to right, rgb(236, 72, 153), rgb(239, 68, 68), rgb(245, 158, 11))" },
                                                  { gradient: "linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)" },
                                                  { gradient: "linear-gradient(rgb(41, 255, 191), rgb(135, 48, 223))" },
                                                  { gradient: "linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)" },
                                                  { gradient: "linear-gradient(rgb(185, 70, 108), rgb(227, 181, 196))" },
                                                  { gradient: "linear-gradient(rgb(255, 128, 0), rgb(255, 179, 102))" },
                                                  { gradient: "linear-gradient(rgb(200, 223, 83), rgb(227, 239, 169))" },
                                                  { gradient: "linear-gradient(rgb(67, 172, 32), rgb(118, 223, 83))" },
                                                  { gradient: "linear-gradient(rgb(32, 172, 172), rgb(83, 223, 223))" },
                                                  { gradient: "linear-gradient(rgb(83, 165, 223), rgb(169, 210, 239))" },
                                                  { gradient: "linear-gradient(rgb(57, 81, 198), rgb(136, 150, 221))" },
                                                  { gradient: "linear-gradient(rgb(69, 34, 119), rgb(144, 97, 209))" },
                                                  { gradient: "linear-gradient(rgb(226, 29, 209), rgb(243, 165, 237))" },
                                                  { gradient: "linear-gradient(rgb(232, 74, 140), rgb(243, 165, 197))" },
                                                  { gradient: "linear-gradient(rgb(29, 184, 195), rgb(245, 112, 174))" },
                                                  { gradient: "linear-gradient(rgb(255, 91, 87), rgb(170, 228, 215))" },
                                                  { gradient: "linear-gradient(rgb(254, 190, 88), rgb(222, 43, 174))" },
                                                  { gradient: "linear-gradient(rgb(79, 191, 201), rgb(224, 56, 56))" },
                                                  { gradient: "linear-gradient(rgb(31, 137, 219), rgb(244, 42, 139))" },
                                                  { gradient: "linear-gradient(220.55deg, #FFD439 0%, #FF7A00 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #7CF7FF 0%, #4B73FF 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #FFED46 0%, #FF7EC7 100%)" },
                                                  { gradient: "radial-gradient(65% 100% at 50% 0%, #00FF94 0%, rgba(0, 255, 148, 0.25) 100%)" },
                                                  { gradient: "linear-gradient(230deg, #000000 25%, #170059 100%)" },
                                                  { gradient: "linear-gradient(215deg, #FFEBB9 10%, #19004E 80%)" },
                                                  { gradient: "radial-gradient(100% 245% at 100% 100%, #FFFFFF 0%, #000353 100%)" },
                                                  { gradient: "linear-gradient(125deg, #1400FF 0%, #3A0000 100%)" },
                                                  { gradient: "linear-gradient(225deg, #00F0FF 30%, #000B6F 45%, #00EBFC 45%, #001676 65%, #00E1F6 65%, #001676 85%, #00ECFD 85%, #001676 100%)" },
                                                  { gradient: "linear-gradient(135deg, #00F0FF 0%, #000B6F 15%, #00EBFC 15%, #001676 35%, #00E1F6 35%, #001676 55%, #00ECFD 55%, #001676 100%)" },
                                                  { gradient: "linear-gradient(115deg, #000000 0%, #00C508 55%, #000000 100%)" },
                                                  { gradient: "linear-gradient(115deg, #0057FF 0%, #020077 100%)" },
                                                  { gradient: "linear-gradient(120deg, #FF0000 0%, #2400FF 100%)" },
                                                  { gradient: "linear-gradient(120deg, #FA00FF 0%, #208200 100%)" },
                                                  { gradient: "linear-gradient(130deg, #00F0FF 0%, #000000 100%)" },
                                                  { gradient: "radial-gradient(110% 140% at 15% 90%, #ffffff 0%, #1700A4 100%)" },
                                                  { gradient: "radial-gradient(100% 100% at 50% 0%, #AD00FF 0%, #00FFE0 100%)" },
                                                  { gradient: "radial-gradient(100% 100% at 50% 0%, #00FFE0 0%, #7300A9 80%)" },
                                                  { gradient: "linear-gradient(30deg, #7ca304 0%, #2200AA 100%)" },
                                                  { gradient: "linear-gradient(123deg, #FFFFFF 0%, #00B2FF 100%)" },
                                                  { gradient: "linear-gradient(236deg, #BAFF99 0%, #005E64 100%)" },
                                                  { gradient: "linear-gradient(225deg, #0094FF 1%, #BFF4ED 45.5%, #FF004E 60.6%, #280F34 70.3%, #B30753 81.6%, #E41655 85.1%, #B30753 100%)" },
                                                  { gradient: "linear-gradient(320.54deg, #00069F 0%, #120010 72.37%)" },
                                                  { gradient: "linear-gradient(58.72deg, #69D200 0%, #970091 100%)" },
                                                  { gradient: "linear-gradient(121.28deg, #8CFF18 0%, #6C0075 100%)" },
                                                  { gradient: "linear-gradient(121.28deg, #8000FF 0%, #000000 100%)" },
                                                  { gradient: "linear-gradient(180deg, #00FF19 0%, #24FF00 0.01%, #2400FF 100%)" },
                                                  { gradient: "linear-gradient(52.23deg, #0500FF 0%, #FF0000 100%)" },
                                                  { gradient: "linear-gradient(121.28deg, #32003A 0%, #FF4040 100%)" },
                                                  { gradient: "radial-gradient(50% 72.12% at 50% 50%, #EB00FF 0%, #110055 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #FF3F3F 0%, #063CFF 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #FF5EEF 0%, #456EFF 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #DEB5FF 0%, #6F00B3 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #4063BC 0%, #6B0013 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #FFF500 0%, #FF00B8 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #FFC328 0%, #E20000 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #FFE70B 0%, #27B643 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #FFADF7 0%, #B1FF96 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #B7DCFF 0%, #FFA4F6 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #5EE2FF 0%, #00576A 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #D7003A 0%, #19087E 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #FADD76 0%, #9F3311 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #00E0EE 0%, #AD00FE 100%)" },
                                                  { gradient: "linear-gradient(220.55deg, #D0004B 0%, #88069D 100%)" },
                                                  { gradient: "radial-gradient(circle at center bottom, #FFDB8B 0%, #EE653D 25%, #D42E81 50%, #A237B6 75%, #3E5FBC 100%)" },
                                                  { gradient: "linear-gradient(180deg, #04E2F7, #1448D8)" },
                                                  { gradient: "linear-gradient(180deg, #11AEEB, #C13AF1)" },
                                                  { gradient: "linear-gradient(180deg, #11AEEB, #35F39D)" },
                                                  { gradient: "linear-gradient(180deg, #12C0DB, #EF04F6)" },
                                                  { gradient: "linear-gradient(180deg, #C542E3, #FD0300)" },
                                                  { gradient: "linear-gradient(180deg, #32C7E5, #F078D5)" },
                                                  { gradient: "linear-gradient(180deg, #CB5EEE, #4BE1EC)" },
                                                  { gradient: "linear-gradient(180deg, #FB1834, #FB2B90)" },
                                                  { gradient: "linear-gradient(180deg, #2DCDB0, #F2FD6C)" },
                                                  { gradient: "linear-gradient(180deg, #E3EE4C, #18595C)" },
                                                  { gradient: "linear-gradient(180deg, #DD051B, #1D00DC)" },
                                                  { gradient: "radial-gradient(circle at center bottom, #FDE68A, #7C3AED, #0C4A6E)" },
                                                  { gradient: "linear-gradient(151.84deg, #3BC5CE 45.85%, #FFBB0D 72.21%)" },
                                                  { gradient: "linear-gradient(135deg, #0E0220 0%, #000000 6px, #E40475 24.8%, #0E0220 35%, #48E0E4 56.3%, #48E0E4 62.4%, #FF00C8 72.9%, #000000DB 78.5%, #48E0E4 100%)" },
                                                  { gradient: "linear-gradient(180deg, #E02020 0%, #FA6400 17%, #F7B500 33%, #6DD400 50%, #0091FF 67%, #6236FF 83%, #B620E0 100%)" },
                                                  { gradient: "linear-gradient(225deg, #32C5FF 0%, #B620E0 51%, #F7B500 100%)" },
                                                  {
                                                      gradient:
                                                          "linear-gradient(180deg, #1C2735 0%, #04A4DE 18.52%, #3081BB 28.47%, #1681A0 39.58%, #00F5BE 51.56%, #E5FFFF 55.44%, #06EEDC 59.63%, #00A3AD 76.56%, #08C9E9 88.54%, #03B0E8 100%)",
                                                  },
                                                  {
                                                      gradient:
                                                          "linear-gradient(180deg, #CE375F 0%, #F88032 5.21%, #EEC629 15.62%, #D8BC1D 25.52%, #DB843C 36.98%, #D76258 46.35%, #D24664 55.73%, #AF15B1 66.67%, #873AC6 78.12%, #446AF1 84.9%, #373DBA 100%)",
                                                  },
                                                  {
                                                      gradient:
                                                          "radial-gradient(50% 100% at left -10% top 80%, #DB0072, transparent), radial-gradient(50% 100% at left 25% top 60%, #FFE53E, transparent), radial-gradient(50% 100% at left 55% top 40%, #00FFE4, transparent), radial-gradient(50% 100% at left 90% top 20%, #D150FF, transparent)",
                                                  },
                                              ],
                                          }),
                                      }),
                            ],
                        }),
                    k = ({ label: e, color: r, onChangeColor: l, defaultColor: i = "" }) => {
                        const s = (0, n.useSelect)((e) => e("core/editor").getEditorSettings().colors, []),
                            d = () => {
                                l(i);
                            };
                        return (0, o.jsx)(t.BaseControl, {
                            label: (0, a.__)(e, "jankx-swiper"),
                            className: "jankx-swiper-setting-color-switcher-wrapper",
                            children: (0, o.jsx)(t.Dropdown, {
                                className: "jankx-swiper-setting-icon-dropdown jankx-swiper-setting-color-dropdown",
                                contentClassName: "jankx-swiper-setting-icon-dropdown-content",
                                popoverProps: { placement: "bottom-start" },
                                renderToggle: ({ isOpen: e, onToggle: a }) =>
                                    (0, o.jsxs)(o.Fragment, {
                                        children: [
                                            (0, o.jsx)("div", {
                                                className: "jankx-swiper-reset-control-container",
                                                onClick: d,
                                                children: (0, o.jsx)("button", {
                                                    className: "jankx-swiper-reset-button jankx-swiper-reset-has-value",
                                                    children: (0, o.jsx)("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 16 16",
                                                        fill: "none",
                                                        children: (0, o.jsx)("path", {
                                                            d:
                                                                "M10.6817 6.23162H14.0101V6.23044M1.98926 13.0956V9.76718M1.98926 9.76718L5.31768 9.76718M1.98926 9.76718L4.10985 11.8892C4.7702 12.5507 5.60824 13.0527 6.57607 13.312C9.51014 14.0982 12.526 12.357 13.3122 9.42292M2.68699 6.57591C3.47317 3.64184 6.48902 1.90064 9.42308 2.68682C10.3909 2.94615 11.229 3.4481 11.8893 4.10969L14.0101 6.23044M14.0101 2.90322V6.23044",
                                                            stroke: "#555E72",
                                                        }),
                                                    }),
                                                }),
                                            }),
                                            (0, o.jsx)(t.Button, { onClick: a, "aria-expanded": e, className: "color-ball", style: { background: r || "" } }),
                                        ],
                                    }),
                                renderContent: () =>
                                    (0, o.jsx)("div", {
                                        className: "jankx-swiper-setting-panel-icon-popup",
                                        children: (0, o.jsx)(t.BaseControl, {
                                            className: "jankx-swiper-setting-panel-icon-popup-inner",
                                            children: (0, o.jsxs)("div", {
                                                className: "jankx-swiper-setting-color",
                                                children: [
                                                    (0, o.jsx)(t.ColorPicker, { color: r, onChange: l, enableAlpha: !0 }),
                                                    (0, o.jsx)("div", { className: "jankx-swiper-setting-color-label", children: (0, a.__)("Default Colors", "jankx-swiper") }),
                                                    (0, o.jsx)(t.ColorPalette, {
                                                        colors: [
                                                            { color: "#2563eb" },
                                                            { color: "#FFFFFF" },
                                                            { color: "#000000" },
                                                            { color: "#4285F4" },
                                                            { color: "#FBBC05" },
                                                            { color: "#34A853" },
                                                            { color: "#EA4335" },
                                                            { color: "#55ACEE" },
                                                            { color: "#66757F" },
                                                            { color: "#3B5998" },
                                                            { color: "#8B9DC3" },
                                                            { color: "#F65314" },
                                                            { color: "#7CBB00" },
                                                            { color: "#00A1F1" },
                                                            { color: "#0F7DC2" },
                                                            { color: "#3F729B" },
                                                            { color: "#006699" },
                                                            { color: "#7B0099" },
                                                            { color: "#FF9900" },
                                                            { color: "#A4C639" },
                                                            { color: "#F72585" },
                                                            { color: "#3A0CA3" },
                                                            { color: "#4CC9F0" },
                                                            { color: "#2FF3E0" },
                                                            { color: "#F8D210" },
                                                            { color: "#B7AC44" },
                                                            { color: "#FF8300" },
                                                            { color: "#B6E2D3" },
                                                            { color: "#FF4500" },
                                                            { color: "#4040a1" },
                                                            { color: "#EEB5EB" },
                                                            { color: "#C26DBC" },
                                                            { color: "#C8F4F9" },
                                                            { color: "#3CACAE" },
                                                            { color: "#4C5270" },
                                                            { color: "#C8DF52" },
                                                            { color: "#000C66" },
                                                            { color: "#0000FF" },
                                                            { color: "#D8A7B1" },
                                                            { color: "#7EC8E3" },
                                                            { color: "#FDB750" },
                                                            { color: "#116530" },
                                                            { color: "#21B6A8" },
                                                            { color: "#A3EBB1" },
                                                            { color: "#76B947" },
                                                            { color: "#B1D8B7" },
                                                            { color: "#00FF22" },
                                                            { color: "#94C973" },
                                                            { color: "#EF7C8E" },
                                                            { color: "#FAE8E0" },
                                                        ],
                                                        disableCustomColors: !0,
                                                        value: r,
                                                        onChange: l,
                                                    }),
                                                    s.length > 0 &&
                                                        (0, o.jsxs)(o.Fragment, {
                                                            children: [
                                                                (0, o.jsx)("div", { className: "jankx-swiper-setting-color-label", children: (0, a.__)("Theme Colors", "jankx-swiper") }),
                                                                (0, o.jsx)(t.ColorPalette, { colors: s, disableCustomColors: !0, value: r, onChange: l }),
                                                            ],
                                                        }),
                                                ],
                                            }),
                                        }),
                                    }),
                            }),
                        });
                    },
                    p = ({
                        label: e,
                        deviceType: r,
                        normalBackgroundType: l,
                        setNormalBackgroundType: i,
                        normalClassicColor: n,
                        setNormalClassicColor: s,
                        normalGradientColor: d = null,
                        setNormalGradientColor: g,
                        normalCustomGradientSwitcher: c,
                        setNormalCustomGradientSwitcher: m,
                        normalCustomGradientInputValue: p,
                        setNormalCustomGradientInputValue: h,
                        normalBackgroundImageUrl: v,
                        setNormalBackgroundImageUrl: C,
                        normalBackgroundImageAlt: _,
                        setNormalBackgroundImageAlt: B,
                        normalBackgroundImageID: F,
                        setNormalBackgroundImageID: I,
                        normalBackgroundImagePosition: x = { x: 0.5, y: 0.5 },
                        setNormalBackgroundImagePosition: w,
                        normalBackgroundImageAttachment: j = "scroll",
                        setNormalBackgroundImageAttachment: f,
                        normalBackgroundImageRepeat: D = "no-repeat",
                        setNormalBackgroundImageRepeat: E,
                        normalBackgroundImageSize: N = "cover",
                        setNormalBackgroundImageSize: y,
                        normalClassicDefaultColor: G = "",
                        hoverBackgroundType: A,
                        setHoverBackgroundType: H,
                        hoverClassicColor: S,
                        setHoverClassicColor: T,
                        hoverGradientColor: M = null,
                        setHoverGradientColor: V,
                        hoverCustomGradientSwitcher: P,
                        setHoverCustomGradientSwitcher: L,
                        hoverCustomGradientInputValue: z,
                        setHoverCustomGradientInputValue: R,
                        hoverBackgroundImageUrl: U,
                        setHoverBackgroundImageUrl: $,
                        hoverBackgroundImageAlt: Z,
                        setHoverBackgroundImageAlt: O,
                        hoverBackgroundImageID: W,
                        setHoverBackgroundImageID: J,
                        hoverBackgroundImagePosition: X = { x: 0.5, y: 0.5 },
                        setHoverBackgroundImagePosition: q,
                        hoverBackgroundImageAttachment: Y = "scroll",
                        setHoverBackgroundImageAttachment: K,
                        hoverBackgroundImageRepeat: Q = "no-repeat",
                        setHoverBackgroundImageRepeat: ee,
                        hoverBackgroundImageSize: re = "cover",
                        setHoverBackgroundImageSize: ae,
                        hoverClassicDefaultColor: le = "",
                        setAttributes: te,
                        isBackgroundImage: oe = !0,
                        isHover: ie = !0,
                    }) => {
                        const ne = [
                                { label: (0, a.__)("Classic", "jankx-swiper"), value: "classic" },
                                { label: (0, a.__)("Gradient", "jankx-swiper"), value: "gradient" },
                            ],
                            se = () =>
                                (0, o.jsxs)(o.Fragment, {
                                    children: [
                                        (0, o.jsx)(t.BaseControl, {
                                            label: (0, a.__)("Background Type", "jankx-swiper"),
                                            children: (0, o.jsx)(t.ButtonGroup, {
                                                className: "jankx-swiper-setting-switcher-panel-btn",
                                                children: ne.map((e) =>
                                                    (0, o.jsx)(t.Button, { onClick: () => i(e.value), className: "jankx-swiper-setting-switcher-panel-btn-switcher " + (l === e.value ? "active" : ""), children: e.label }, e.value)
                                                ),
                                            }),
                                        }),
                                        "classic" === l &&
                                            (0, o.jsxs)(o.Fragment, {
                                                children: [
                                                    (0, o.jsx)(k, { label: (0, a.__)("Color", "jankx-swiper"), color: n, onChangeColor: (e) => s(e), defaultColor: G }),
                                                    oe &&
                                                        (0, o.jsx)(b, {
                                                            label: (0, a.__)("Image", "jankx-swiper"),
                                                            deviceType: r,
                                                            globalBackgroundImageUrl: v,
                                                            setGlobalBackgroundImageUrl: (e) => C(e),
                                                            globalBackgroundImageAlt: _,
                                                            setGlobalBackgroundImageAlt: (e) => B(e),
                                                            globalBackgroundImageID: F,
                                                            setGlobalBackgroundImageID: (e) => I(e),
                                                            globalBackgroundImagePosition: x,
                                                            setGlobalBackgroundImagePosition: (e) => w(e),
                                                            globalBackgroundImageAttachment: j,
                                                            setGlobalBackgroundImageAttachment: (e) => f(e),
                                                            globalBackgroundImageRepeat: D,
                                                            setGlobalBackgroundImageRepeat: (e) => E(e),
                                                            globalBackgroundImageSize: N,
                                                            setGlobalBackgroundImageSize: (e) => y(e),
                                                            setAttributes: te,
                                                        }),
                                                ],
                                            }),
                                        "gradient" === l &&
                                            (0, o.jsx)(u, {
                                                globalCustomGradientSwitcher: c,
                                                setGlobalCustomGradientSwitcher: (e) => m(e),
                                                globalCustomGradientInputValue: p,
                                                setGlobalCustomGradientInputValue: (e) => h(e),
                                                globalGradientColor: d,
                                                setGlobalGradientColor: (e) => g(e),
                                            }),
                                    ],
                                });
                        return (0, o.jsx)(o.Fragment, {
                            children: (0, o.jsx)(t.BaseControl, {
                                label: e,
                                children: ie
                                    ? (0, o.jsx)(t.TabPanel, {
                                          className: "jankx-swiper-bg-tab-panel",
                                          activeClass: "active-tab",
                                          tabs: [
                                              { name: "normal", title: (0, a.__)("Normal", "jankx-swiper"), className: "jankx-swiper-bg-tab" },
                                              { name: "hover", title: (0, a.__)("Hover", "jankx-swiper"), className: "jankx-swiper-bg-tab" },
                                          ],
                                          children: (e) =>
                                              (0, o.jsxs)("div", {
                                                  className: `jankx-swiper-tab-panel-wrapper ${e.name}`,
                                                  children: [
                                                      "normal" === e.name && se(),
                                                      "hover" === e.name &&
                                                          (0, o.jsxs)(o.Fragment, {
                                                              children: [
                                                                  (0, o.jsx)(t.BaseControl, {
                                                                      label: (0, a.__)("Background Type", "jankx-swiper"),
                                                                      children: (0, o.jsx)(t.ButtonGroup, {
                                                                          className: "jankx-swiper-setting-switcher-panel-btn",
                                                                          children: ne.map((e) =>
                                                                              (0, o.jsx)(
                                                                                  t.Button,
                                                                                  { onClick: () => H(e.value), className: "jankx-swiper-setting-switcher-panel-btn-switcher " + (A === e.value ? "active" : ""), children: e.label },
                                                                                  e.value
                                                                              )
                                                                          ),
                                                                      }),
                                                                  }),
                                                                  "classic" === A &&
                                                                      (0, o.jsxs)(o.Fragment, {
                                                                          children: [
                                                                              (0, o.jsx)(k, { label: (0, a.__)("Background Color", "jankx-swiper"), color: S, onChangeColor: (e) => T(e), defaultColor: le }),
                                                                              oe &&
                                                                                  (0, o.jsx)(b, {
                                                                                      label: (0, a.__)("Background Image", "jankx-swiper"),
                                                                                      deviceType: r,
                                                                                      globalBackgroundImageUrl: U,
                                                                                      setGlobalBackgroundImageUrl: (e) => $(e),
                                                                                      globalBackgroundImageAlt: Z,
                                                                                      setGlobalBackgroundImageAlt: (e) => O(e),
                                                                                      globalBackgroundImageID: W,
                                                                                      setGlobalBackgroundImageID: (e) => J(e),
                                                                                      globalBackgroundImagePosition: X,
                                                                                      setGlobalBackgroundImagePosition: (e) => q(e),
                                                                                      globalBackgroundImageAttachment: Y,
                                                                                      setGlobalBackgroundImageAttachment: (e) => K(e),
                                                                                      globalBackgroundImageRepeat: Q,
                                                                                      setGlobalBackgroundImageRepeat: (e) => ee(e),
                                                                                      globalBackgroundImageSize: re,
                                                                                      setGlobalBackgroundImageSize: (e) => ae(e),
                                                                                      setAttributes: te,
                                                                                  }),
                                                                          ],
                                                                      }),
                                                                  "gradient" === A &&
                                                                      (0, o.jsx)(u, {
                                                                          globalCustomGradientSwitcher: P,
                                                                          setGlobalCustomGradientSwitcher: (e) => L(e),
                                                                          globalCustomGradientInputValue: z,
                                                                          setGlobalCustomGradientInputValue: (e) => R(e),
                                                                          globalGradientColor: M,
                                                                          setGlobalGradientColor: (e) => V(e),
                                                                      }),
                                                              ],
                                                          }),
                                                  ],
                                              }),
                                      })
                                    : (0, o.jsx)("div", { className: "jankx-swiper-tab-panel-wrapper normal", children: se() }),
                            }),
                        });
                    };
                function h({ attributes: e, setAttributes: r, clientId: s }) {
                    const {
                            blockId: d,
                            deviceType: g,
                            blockStyle: c,
                            sliderItemNormalBackgroundType: m,
                            sliderItemNormalClassicColor: b,
                            sliderItemNormalGradientColor: u,
                            sliderItemNormalCustomGradientSwitcher: k,
                            sliderItemNormalCustomGradientInputValue: h,
                            sliderItemNormalBackgroundImageUrl: v,
                            sliderItemNormalBackgroundImagePosition: C,
                            sliderItemNormalBackgroundImageAttachment: _,
                            sliderItemNormalBackgroundImageRepeat: B,
                            sliderItemNormalBackgroundImageSize: F,
                            sliderItemHoverBackgroundType: I,
                            sliderItemHoverClassicColor: x,
                            sliderItemHoverGradientColor: w,
                            sliderItemHoverCustomGradientSwitcher: j,
                            sliderItemHoverCustomGradientInputValue: f,
                            sliderItemHoverBackgroundImageUrl: D,
                            sliderItemHoverBackgroundImagePosition: E,
                            sliderItemHoverBackgroundImageAttachment: N,
                            sliderItemHoverBackgroundImageRepeat: y,
                            sliderItemHoverBackgroundImageSize: G,
                        } = e,
                        A = (0, n.useSelect)((e) => e("core/edit-site")?.__experimentalGetPreviewDeviceType() || e("core/edit-post")?.__experimentalGetPreviewDeviceType() || e("jankx-swiper")?.getDeviceType() || "Desktop", []) || "";
                    (0, l.useEffect)(() => {
                        r({ deviceType: A });
                    }, [A]),
                        (0, l.useEffect)(() => {
                            s && "string" == typeof s && r({ blockId: `jankx-swiper-flexi-content-item-${s.slice(0, 8)}` });
                        }, [s]),
                        o.Fragment,
                        t.PanelBody,
                        (0, a.__)("General", "jankx-swiper"),
                        (0, a.__)("No settings available. Move to Style Tab", "jankx-swiper");
                    const H = (0, o.jsx)(o.Fragment, {
                            children: (0, o.jsx)(t.PanelBody, {
                                title: (0, a.__)("Background", "jankx-swiper"),
                                children: (0, o.jsx)(p, {
                                    label: (0, a.__)("Background", "jankx-swiper"),
                                    deviceType: g,
                                    normalBackgroundType: m,
                                    setNormalBackgroundType: (e) => r({ sliderItemNormalBackgroundType: e }),
                                    normalClassicColor: b,
                                    setNormalClassicColor: (e) => r({ sliderItemNormalClassicColor: e }),
                                    normalGradientColor: u,
                                    setNormalGradientColor: (e) => r({ sliderItemNormalGradientColor: e }),
                                    normalCustomGradientSwitcher: k,
                                    setNormalCustomGradientSwitcher: (e) => r({ sliderItemNormalCustomGradientSwitcher: e }),
                                    normalCustomGradientInputValue: h,
                                    setNormalCustomGradientInputValue: (e) => r({ sliderItemNormalCustomGradientInputValue: e }),
                                    normalBackgroundImageUrl: v,
                                    setNormalBackgroundImageUrl: (e) => r({ sliderItemNormalBackgroundImageUrl: e }),
                                    normalBackgroundImagePosition: C,
                                    setNormalBackgroundImagePosition: (e) => r({ sliderItemNormalBackgroundImagePosition: e }),
                                    normalBackgroundImageAttachment: _,
                                    setNormalBackgroundImageAttachment: (e) => r({ sliderItemNormalBackgroundImageAttachment: e }),
                                    normalBackgroundImageRepeat: B,
                                    setNormalBackgroundImageRepeat: (e) => r({ sliderItemNormalBackgroundImageRepeat: e }),
                                    normalBackgroundImageSize: F,
                                    setNormalBackgroundImageSize: (e) => r({ sliderItemNormalBackgroundImageSize: e }),
                                    hoverBackgroundType: I,
                                    setHoverBackgroundType: (e) => r({ sliderItemHoverBackgroundType: e }),
                                    hoverClassicColor: x,
                                    setHoverClassicColor: (e) => r({ sliderItemHoverClassicColor: e }),
                                    hoverGradientColor: w,
                                    setHoverGradientColor: (e) => r({ sliderItemHoverGradientColor: e }),
                                    hoverCustomGradientSwitcher: j,
                                    setHoverCustomGradientSwitcher: (e) => r({ sliderItemHoverCustomGradientSwitcher: e }),
                                    hoverCustomGradientInputValue: f,
                                    setHoverCustomGradientInputValue: (e) => r({ sliderItemHoverCustomGradientInputValue: e }),
                                    hoverBackgroundImageUrl: D,
                                    setHoverBackgroundImageUrl: (e) => r({ sliderItemHoverBackgroundImageUrl: e }),
                                    hoverBackgroundImagePosition: E,
                                    setHoverBackgroundImagePosition: (e) => r({ sliderItemHoverBackgroundImagePosition: e }),
                                    hoverBackgroundImageAttachment: N,
                                    setHoverBackgroundImageAttachment: (e) => r({ sliderItemHoverBackgroundImageAttachment: e }),
                                    hoverBackgroundImageRepeat: y,
                                    setHoverBackgroundImageRepeat: (e) => r({ globalHoverBackgroundImageRepeat: e }),
                                    hoverBackgroundImageSize: G,
                                    setHoverBackgroundImageSize: (e) => r({ sliderItemHoverBackgroundImageSize: e }),
                                    setAttributes: r,
                                }),
                            }),
                        }),
                        S =
                            (o.Fragment,
                            t.PanelBody,
                            (0, a.__)("Layout", "jankx-swiper"),
                            (e) => {
                                const r = m,
                                    a = b,
                                    l = u,
                                    t = h,
                                    o = k,
                                    i = v?.[e],
                                    n = C?.[e],
                                    s = _?.[e],
                                    d = B?.[e],
                                    g = F?.[e];
                                if ("gradient" === r) return o && t ? { background: t } : l ? { background: l } : a ? { background: a } : {};
                                let c = a ? { background: a } : {};
                                return (
                                    "gradient" !== r &&
                                        i &&
                                        (c = {
                                            ...c,
                                            "background-image": `url(${i})`,
                                            "background-position": n ? `${100 * n.x}% ${100 * n.y}%` : "50% 50%",
                                            "background-attachment": s || void 0,
                                            "background-repeat": d || void 0,
                                            "background-size": g || void 0,
                                        }),
                                    c
                                );
                            }),
                        T = (e) => {
                            const r = I,
                                a = x,
                                l = w,
                                t = f,
                                o = j,
                                i = D?.[e],
                                n = E?.[e],
                                s = N?.[e],
                                d = y?.[e],
                                g = G?.[e];
                            if ("gradient" === r) return o && t ? { background: t } : l ? { background: l } : a ? { background: a } : {};
                            let c = a ? { background: a } : {};
                            return (
                                "gradient" !== r &&
                                    i &&
                                    (c = {
                                        ...c,
                                        "background-image": `url(${i})`,
                                        "background-position": n ? `${100 * n.x}% ${100 * n.y}%` : "50% 50%",
                                        "background-attachment": s || void 0,
                                        "background-repeat": d || void 0,
                                        "background-size": g || void 0,
                                    }),
                                c
                            );
                        },
                        M = (e) =>
                            Object.entries(e)
                                .map(([e, r]) => `${e}: ${r};`)
                                .join(" "),
                        V = M(S("Desktop")),
                        P = M(S("Tablet")),
                        L = M(S("Mobile")),
                        z = M(T("Desktop")),
                        R = M(T("Tablet")),
                        U = M(T("Mobile")),
                        $ = (0, l.useMemo)(
                            () =>
                                `\n\n        .${d}.flexi-content-item {\n            ${V}\n            box-sizing: border-box;\n            position: relative;\n            transition: all 0.3s ease;\n        }\n        .${d}.flexi-content-item:hover {\n            ${z}\n            box-sizing: border-box;\n            position: relative;\n        }\n\n        @media only screen and (max-width: 1024px) {\n\n            .${d}.flexi-content-item {\n                ${P}\n            }\n            .${d}.flexi-content-item:hover {\n                ${R}\n            }\n        }\n        \n        @media only screen and (max-width: 767px) {\n\n            .${d}.flexi-content-item {\n                ${L}\n            }\n            .${d}.flexi-content-item:hover {\n                ${U}\n            }\n        }\n\n    `,
                            [d, g, c, m, b, u, k, h, v, C, _, B, F, I, x, w, j, f, D, E, N, y, G]
                        );
                    (0, l.useEffect)(() => {
                        r({ blockStyle: `${$}`.replace(/\s+/g, " ").trim() });
                    }, [$]);
                    const Z = `${$}`.replace(/\s+/g, " ").trim();
                    return (0, o.jsxs)(o.Fragment, { children: [(0, o.jsx)("style", { children: Z }), (0, o.jsx)(i, { generalControls: null, styleControls: H, advancedControls: null })] });
                }
                const v = JSON.parse('{"UU":"jankx/swiper-flexible-item"}'),
                    C =
                        (window.React,
                        () =>
                            (0, o.jsxs)("svg", {
                                width: "24",
                                height: "24",
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 26 24",
                                fill: "none",
                                className: "jankx-swiper-editor-icons",
                                "aria-hidden": "true",
                                focusable: "false",
                                children: [
                                    (0, o.jsx)("rect", { x: "5.5", y: "5.5", width: "15", height: "11", rx: "2", fill: "none", stroke: "#007cba", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }),
                                    (0, o.jsx)("path", { d: "M9.5 9H16.5", stroke: "#007cba", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }),
                                    (0, o.jsx)("path", { d: "M9.5 11H16.5", stroke: "#007cba", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }),
                                    (0, o.jsx)("circle", { cx: "10", cy: "18.5", r: "0.6", fill: "#007cba" }),
                                    (0, o.jsx)("circle", { cx: "13", cy: "18.5", r: "0.6", fill: "#007cba" }),
                                    (0, o.jsx)("circle", { cx: "16", cy: "18.5", r: "0.6", fill: "#007cba" }),
                                    (0, o.jsx)("path", { d: "M2.5 10.2L1.8 11L2.5 11.8", stroke: "#007cba", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }),
                                    (0, o.jsx)("path", { d: "M23.5 11.8L24.2 11L23.5 10.2", stroke: "#007cba", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }),
                                ],
                            }));
                (0, e.registerBlockType)(v.UU, {
                    attributes: {
                        blockId: { type: "string", default: "" },
                        deviceType: { type: "string", default: "Desktop" },
                        blockStyle: { type: "string", default: "" },
                        sliderItemNormalBackgroundType: { type: "string", default: "classic" },
                        sliderItemNormalClassicColor: { type: "string", default: "" },
                        sliderItemNormalGradientColor: { type: "string", default: null },
                        sliderItemNormalCustomGradientSwitcher: { type: "boolean", default: !1 },
                        sliderItemNormalCustomGradientInputValue: { type: "string", default: "" },
                        sliderItemNormalBackgroundImageUrl: { type: "object", default: { Desktop: "", Tablet: "", Mobile: "" } },
                        sliderItemNormalBackgroundImagePosition: { type: "object", default: { Desktop: { x: 0.5, y: 0.5 }, Tablet: { x: 0.5, y: 0.5 }, Mobile: { x: 0.5, y: 0.5 } } },
                        sliderItemNormalBackgroundImageAttachment: { type: "object", default: { Desktop: "scroll", Tablet: "scroll", Mobile: "scroll" } },
                        sliderItemNormalBackgroundImageRepeat: { type: "object", default: { Desktop: "no-repeat", Tablet: "no-repeat", Mobile: "no-repeat" } },
                        sliderItemNormalBackgroundImageSize: { type: "object", default: { Desktop: "cover", Tablet: "cover", Mobile: "cover" } },
                        sliderItemHoverBackgroundType: { type: "string", default: "classic" },
                        sliderItemHoverClassicColor: { type: "string", default: "" },
                        sliderItemHoverGradientColor: { type: "string", default: null },
                        sliderItemHoverCustomGradientSwitcher: { type: "boolean", default: !1 },
                        sliderItemHoverCustomGradientInputValue: { type: "string", default: "" },
                        sliderItemHoverBackgroundImageUrl: { type: "object", default: { Desktop: "", Tablet: "", Mobile: "" } },
                        sliderItemHoverBackgroundImagePosition: { type: "object", default: { Desktop: { x: 0.5, y: 0.5 }, Tablet: { x: 0.5, y: 0.5 }, Mobile: { x: 0.5, y: 0.5 } } },
                        sliderItemHoverBackgroundImageAttachment: { type: "object", default: { Desktop: "scroll", Tablet: "scroll", Mobile: "scroll" } },
                        sliderItemHoverBackgroundImageRepeat: { type: "object", default: { Desktop: "no-repeat", Tablet: "no-repeat", Mobile: "no-repeat" } },
                        sliderItemHoverBackgroundImageSize: { type: "object", default: { Desktop: "cover", Tablet: "cover", Mobile: "cover" } },
                    },
                    icon: C,
                    edit: function ({ attributes: e, setAttributes: a, clientId: l }) {
                        const { blockId: t } = e,
                            i = (0, r.useBlockProps)({ className: `flexi-content-item swiper-slide ${t}` });
                        return (0, o.jsxs)(o.Fragment, {
                            children: [
                                (0, o.jsx)(h, { attributes: e, setAttributes: a, clientId: l }),
                                (0, o.jsx)("div", {
                                    ...i,
                                    children: (0, o.jsx)("div", {
                                        className: "jankx-swiper-content-wrapper",
                                        children: (0, o.jsx)("div", {
                                            className: "jankx-swiper-content-inner-wrapper",
                                            children: (0, o.jsx)(r.InnerBlocks, { template: [["core/paragraph"]], renderAppender: r.InnerBlocks.DefaultBlockAppender }),
                                        }),
                                    }),
                                }),
                            ],
                        });
                    },
                    parent: ["jankx/swiper-flexible"],
                    save: function ({ attributes: e }) {
                        const { blockId: a } = e,
                            l = r.useBlockProps.save({ className: `flexi-content-item swiper-slide ${a}` });
                        return (0, o.jsx)("div", {
                            ...l,
                            children: (0, o.jsx)("div", { className: "jankx-swiper-content-wrapper", children: (0, o.jsx)("div", { className: "jankx-swiper-content-inner-wrapper", children: (0, o.jsx)(r.InnerBlocks.Content, {}) }) }),
                        });
                    },
                });
            },
        },
        a = {};
    function l(e) {
        var t = a[e];
        if (void 0 !== t) return t.exports;
        var o = (a[e] = { exports: {} });
        return r[e](o, o.exports, l), o.exports;
    }
    (l.m = r),
        (e = []),
        (l.O = (r, a, t, o) => {
            if (!a) {
                var i = 1 / 0;
                for (g = 0; g < e.length; g++) {
                    for (var [a, t, o] = e[g], n = !0, s = 0; s < a.length; s++) (!1 & o || i >= o) && Object.keys(l.O).every((e) => l.O[e](a[s])) ? a.splice(s--, 1) : ((n = !1), o < i && (i = o));
                    if (n) {
                        e.splice(g--, 1);
                        var d = t();
                        void 0 !== d && (r = d);
                    }
                }
                return r;
            }
            o = o || 0;
            for (var g = e.length; g > 0 && e[g - 1][2] > o; g--) e[g] = e[g - 1];
            e[g] = [a, t, o];
        }),
        (l.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)),
        (() => {
            var e = { 31: 0, 247: 0 };
            l.O.j = (r) => 0 === e[r];
            var r = (r, a) => {
                    var t,
                        o,
                        [i, n, s] = a,
                        d = 0;
                    if (i.some((r) => 0 !== e[r])) {
                        for (t in n) l.o(n, t) && (l.m[t] = n[t]);
                        if (s) var g = s(l);
                    }
                    for (r && r(a); d < i.length; d++) (o = i[d]), l.o(e, o) && e[o] && e[o][0](), (e[o] = 0);
                    return l.O(g);
                },
                a = (globalThis.webpackChunkjankxSwiper_blocks = globalThis.webpackChunkjankxSwiper_blocks || []);
            a.forEach(r.bind(null, 0)), (a.push = r.bind(null, a.push.bind(a)));
        })();
    var t = l.O(void 0, [247], () => l(998));
    t = l.O(t);
})();

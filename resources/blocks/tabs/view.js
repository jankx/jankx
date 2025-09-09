window.addEventListener("DOMContentLoaded", () => {
    const t = document.querySelectorAll(".wp-block-jankx-tabs > .tabs-container > .tabs-nav > .tabs-titles");
    if (0 === t.length) return !1;
    for (const s of t) {
        const t = s.children;
        for (const a of t) {
            a.setAttribute("role", "tab"), a.setAttribute("tabindex", a.classList.contains("active") ? "0" : "-1");
            const i = a.dataset.titleTabId,
                l = a.closest(".wp-block-jankx-tabs").querySelector(`.single-tab[data-tab-id="${i}"]`);
            l && (l.setAttribute("role", "tabpanel"), l.setAttribute("aria-hidden", l.classList.contains("active") ? "false" : "true")),
                a.addEventListener("click", (t) => {
                    t.preventDefault(), e(a, s);
                }),
                a.addEventListener("keydown", (i) => {
                    const l = Array.prototype.indexOf.call(t, a);
                    let n = null;
                    if (("ArrowRight" === i.key ? (n = (l + 1) % t.length) : "ArrowLeft" === i.key ? (n = (l - 1 + t.length) % t.length) : "Home" === i.key ? (n = 0) : "End" === i.key && (n = t.length - 1), null !== n)) {
                        i.preventDefault();
                        const a = t[n];
                        a.focus(), e(a, s);
                    }
                }),
                "1" === a.dataset.titleTabId && e(a, s);
        }
    }
    function e(t, e) {
        const s = e.querySelectorAll(".tab-title");
        for (const t of s) t.classList.remove("active"), t.setAttribute("tabindex", "-1"), t.setAttribute("aria-selected", "false");
        t.classList.add("active"), t.setAttribute("tabindex", "0"), t.setAttribute("aria-selected", "true");
        const a = t.dataset.titleTabId,
            i = t.closest(".wp-block-jankx-tabs").querySelectorAll(".single-tab");
        if (0 === i.length) return !1;
        for (const t of i) {
            const e = t.dataset.tabId,
                s = t.closest(".wp-block-jankx-tab");
            t.classList.remove("active"),
                (t.style.display = "none"),
                t.setAttribute("aria-hidden", "true"),
                s && s.classList.remove("active"),
                e === a && (t.classList.add("active"), (t.style.display = "block"), (t.style.animation = "fadeIn 0.3s"), t.setAttribute("aria-hidden", "false"), s && s.classList.add("active"));
        }
    }
});

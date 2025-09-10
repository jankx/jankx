/******/ (() => { // webpackBootstrap
/*!*****************************!*\
  !*** ./blocks/base/view.js ***!
  \*****************************/
document.addEventListener("DOMContentLoaded", () => {
  const e = () => {
    document.querySelectorAll(".jankx-swiper-base-wrapper").forEach(e => {
      try {
        const o = e.dataset.swiperSettings;
        if (o) {
          const r = JSON.parse(o);
          new Swiper(e.querySelector(".swiper"), r);
        }
      } catch (e) {
        console.error("Error initializing slider:", e);
      }
    });
  };
  e(), window.wp && window.wp.hooks && window.wp.hooks.addAction("blocks.blockRendered", "jankx-swiper", () => {
    e();
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map
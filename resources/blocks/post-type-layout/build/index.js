/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/post-type-layout/block.json":
/*!********************************************!*\
  !*** ./blocks/post-type-layout/block.json ***!
  \********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/post-type-layout","version":"1.0.0","title":"Post Type Layout","category":"jankx","icon":"layout","description":"Hiển thị danh sách posts theo layout tùy chỉnh","textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","providesContext":{"queryId":"queryId","query":{"postType":"postType","perPage":"postsPerPage","pages":0,"offset":"offset","order":"order","orderBy":"orderBy","inherit":false}},"usesContext":["queryId","query"],"supports":{"html":false,"align":["wide","full"],"anchor":true,"spacing":{"margin":true,"padding":true,"blockGap":true},"color":{"background":true,"text":true,"link":true,"gradients":true},"background":{"backgroundImage":true,"backgroundSize":true},"typography":{"fontSize":true,"lineHeight":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true},"__experimentalLayout":{"allowSwitching":true,"allowInheriting":true,"default":{"type":"constrained"}}},"attributes":{"queryPreset":{"type":"string","default":"custom","enum":["default","related","custom","on-sale","featured","related-products","best-sellers","top-rated","upsells","new-arrivals","recently-viewed"]},"postType":{"type":"string","default":"post"},"postsPerPage":{"type":"number","default":10},"includeStickyPosts":{"type":"boolean","default":false},"layout":{"type":"string","default":"grid"},"columns":{"type":"number","default":3},"columnsTablet":{"type":"number","default":2},"columnsMobile":{"type":"number","default":1},"showTitle":{"type":"boolean","default":true},"showExcerpt":{"type":"boolean","default":true},"showFeaturedImage":{"type":"boolean","default":true},"thumbnailPosition":{"type":"string","default":"top","enum":["top","bottom","left","right"]},"imageRatio":{"type":"string","default":""},"showDate":{"type":"boolean","default":true},"showAuthor":{"type":"boolean","default":false},"excerptLength":{"type":"number","default":55},"orderBy":{"type":"string","default":"date"},"order":{"type":"string","default":"DESC"},"queryId":{"type":"number"},"enablePagination":{"type":"boolean","default":false},"offset":{"type":"number","default":0},"taxQuery":{"type":"array","default":[]},"metaQuery":{"type":"array","default":[]},"keyword":{"type":"string","default":""},"authorIn":{"type":"array","default":[]},"authorNotIn":{"type":"array","default":[]},"postIn":{"type":"array","default":[]},"postNotIn":{"type":"array","default":[]},"metaKey":{"type":"string","default":""},"metaType":{"type":"string","default":""},"postStatus":{"type":"array","default":["publish"]},"postParent":{"type":"number","default":0},"postParentIn":{"type":"array","default":[]},"postParentNotIn":{"type":"array","default":[]},"customQueryId":{"type":"string","default":""},"paginationStyle":{"type":"string","default":"numbers","enum":["numbers","simple","arrows","load-more"]},"paginationAlignment":{"type":"string","default":"center","enum":["left","center","right"]},"showPaginationNumbers":{"type":"boolean","default":true},"paginationPrevText":{"type":"string","default":""},"paginationNextText":{"type":"string","default":""},"slidesToScroll":{"type":"number","default":1},"loop":{"type":"boolean","default":false},"autoplay":{"type":"boolean","default":false},"autoplayDelay":{"type":"number","default":3000},"showArrows":{"type":"boolean","default":true},"showDots":{"type":"boolean","default":true}}}');

/***/ }),

/***/ "./blocks/post-type-layout/editor.scss":
/*!*********************************************!*\
  !*** ./blocks/post-type-layout/editor.scss ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/post-type-layout/style.scss":
/*!********************************************!*\
  !*** ./blocks/post-type-layout/style.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/embla-carousel-react/esm/embla-carousel-react.esm.js":
/*!***************************************************************************!*\
  !*** ./node_modules/embla-carousel-react/esm/embla-carousel-react.esm.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useEmblaCarousel)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var embla_carousel_reactive_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! embla-carousel-reactive-utils */ "./node_modules/embla-carousel-reactive-utils/esm/embla-carousel-reactive-utils.esm.js");
/* harmony import */ var embla_carousel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! embla-carousel */ "./node_modules/embla-carousel/esm/embla-carousel.esm.js");



function useEmblaCarousel(options = {}, plugins = []) {
  const storedOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(options);
  const storedPlugins = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(plugins);
  const [emblaApi, setEmblaApi] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [viewport, setViewport] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const reInit = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (emblaApi) emblaApi.reInit(storedOptions.current, storedPlugins.current);
  }, [emblaApi]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if ((0,embla_carousel_reactive_utils__WEBPACK_IMPORTED_MODULE_1__.areOptionsEqual)(storedOptions.current, options)) return;
    storedOptions.current = options;
    reInit();
  }, [options, reInit]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if ((0,embla_carousel_reactive_utils__WEBPACK_IMPORTED_MODULE_1__.arePluginsEqual)(storedPlugins.current, plugins)) return;
    storedPlugins.current = plugins;
    reInit();
  }, [plugins, reInit]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if ((0,embla_carousel_reactive_utils__WEBPACK_IMPORTED_MODULE_1__.canUseDOM)() && viewport) {
      embla_carousel__WEBPACK_IMPORTED_MODULE_2__["default"].globalOptions = useEmblaCarousel.globalOptions;
      const newEmblaApi = (0,embla_carousel__WEBPACK_IMPORTED_MODULE_2__["default"])(viewport, storedOptions.current, storedPlugins.current);
      setEmblaApi(newEmblaApi);
      return () => newEmblaApi.destroy();
    } else {
      setEmblaApi(undefined);
    }
  }, [viewport, setEmblaApi]);
  return [setViewport, emblaApi];
}
useEmblaCarousel.globalOptions = undefined;


/***/ }),

/***/ "./node_modules/embla-carousel-reactive-utils/esm/embla-carousel-reactive-utils.esm.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/embla-carousel-reactive-utils/esm/embla-carousel-reactive-utils.esm.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   areOptionsEqual: () => (/* binding */ areOptionsEqual),
/* harmony export */   arePluginsEqual: () => (/* binding */ arePluginsEqual),
/* harmony export */   canUseDOM: () => (/* binding */ canUseDOM),
/* harmony export */   sortAndMapPluginToOptions: () => (/* binding */ sortAndMapPluginToOptions)
/* harmony export */ });
function isObject(subject) {
  return Object.prototype.toString.call(subject) === '[object Object]';
}
function isRecord(subject) {
  return isObject(subject) || Array.isArray(subject);
}
function canUseDOM() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}
function areOptionsEqual(optionsA, optionsB) {
  const optionsAKeys = Object.keys(optionsA);
  const optionsBKeys = Object.keys(optionsB);
  if (optionsAKeys.length !== optionsBKeys.length) return false;
  const breakpointsA = JSON.stringify(Object.keys(optionsA.breakpoints || {}));
  const breakpointsB = JSON.stringify(Object.keys(optionsB.breakpoints || {}));
  if (breakpointsA !== breakpointsB) return false;
  return optionsAKeys.every(key => {
    const valueA = optionsA[key];
    const valueB = optionsB[key];
    if (typeof valueA === 'function') return `${valueA}` === `${valueB}`;
    if (!isRecord(valueA) || !isRecord(valueB)) return valueA === valueB;
    return areOptionsEqual(valueA, valueB);
  });
}
function sortAndMapPluginToOptions(plugins) {
  return plugins.concat().sort((a, b) => a.name > b.name ? 1 : -1).map(plugin => plugin.options);
}
function arePluginsEqual(pluginsA, pluginsB) {
  if (pluginsA.length !== pluginsB.length) return false;
  const optionsA = sortAndMapPluginToOptions(pluginsA);
  const optionsB = sortAndMapPluginToOptions(pluginsB);
  return optionsA.every((optionA, index) => {
    const optionB = optionsB[index];
    return areOptionsEqual(optionA, optionB);
  });
}


/***/ }),

/***/ "./node_modules/embla-carousel/esm/embla-carousel.esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/embla-carousel/esm/embla-carousel.esm.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmblaCarousel)
/* harmony export */ });
function isNumber(subject) {
  return typeof subject === 'number';
}
function isString(subject) {
  return typeof subject === 'string';
}
function isBoolean(subject) {
  return typeof subject === 'boolean';
}
function isObject(subject) {
  return Object.prototype.toString.call(subject) === '[object Object]';
}
function mathAbs(n) {
  return Math.abs(n);
}
function mathSign(n) {
  return Math.sign(n);
}
function deltaAbs(valueB, valueA) {
  return mathAbs(valueB - valueA);
}
function factorAbs(valueB, valueA) {
  if (valueB === 0 || valueA === 0) return 0;
  if (mathAbs(valueB) <= mathAbs(valueA)) return 0;
  const diff = deltaAbs(mathAbs(valueB), mathAbs(valueA));
  return mathAbs(diff / valueB);
}
function roundToTwoDecimals(num) {
  return Math.round(num * 100) / 100;
}
function arrayKeys(array) {
  return objectKeys(array).map(Number);
}
function arrayLast(array) {
  return array[arrayLastIndex(array)];
}
function arrayLastIndex(array) {
  return Math.max(0, array.length - 1);
}
function arrayIsLastIndex(array, index) {
  return index === arrayLastIndex(array);
}
function arrayFromNumber(n, startAt = 0) {
  return Array.from(Array(n), (_, i) => startAt + i);
}
function objectKeys(object) {
  return Object.keys(object);
}
function objectsMergeDeep(objectA, objectB) {
  return [objectA, objectB].reduce((mergedObjects, currentObject) => {
    objectKeys(currentObject).forEach(key => {
      const valueA = mergedObjects[key];
      const valueB = currentObject[key];
      const areObjects = isObject(valueA) && isObject(valueB);
      mergedObjects[key] = areObjects ? objectsMergeDeep(valueA, valueB) : valueB;
    });
    return mergedObjects;
  }, {});
}
function isMouseEvent(evt, ownerWindow) {
  return typeof ownerWindow.MouseEvent !== 'undefined' && evt instanceof ownerWindow.MouseEvent;
}
function Alignment(align, viewSize) {
  const predefined = {
    start,
    center,
    end
  };
  function start() {
    return 0;
  }
  function center(n) {
    return end(n) / 2;
  }
  function end(n) {
    return viewSize - n;
  }
  function measure(n, index) {
    if (isString(align)) return predefined[align](n);
    return align(viewSize, n, index);
  }
  const self = {
    measure
  };
  return self;
}
function EventStore() {
  let listeners = [];
  function add(node, type, handler, options = {
    passive: true
  }) {
    let removeListener;
    if ('addEventListener' in node) {
      node.addEventListener(type, handler, options);
      removeListener = () => node.removeEventListener(type, handler, options);
    } else {
      const legacyMediaQueryList = node;
      legacyMediaQueryList.addListener(handler);
      removeListener = () => legacyMediaQueryList.removeListener(handler);
    }
    listeners.push(removeListener);
    return self;
  }
  function clear() {
    listeners = listeners.filter(remove => remove());
  }
  const self = {
    add,
    clear
  };
  return self;
}
function Animations(ownerDocument, ownerWindow, update, render) {
  const documentVisibleHandler = EventStore();
  const fixedTimeStep = 1000 / 60;
  let lastTimeStamp = null;
  let accumulatedTime = 0;
  let animationId = 0;
  function init() {
    documentVisibleHandler.add(ownerDocument, 'visibilitychange', () => {
      if (ownerDocument.hidden) reset();
    });
  }
  function destroy() {
    stop();
    documentVisibleHandler.clear();
  }
  function animate(timeStamp) {
    if (!animationId) return;
    if (!lastTimeStamp) {
      lastTimeStamp = timeStamp;
      update();
      update();
    }
    const timeElapsed = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;
    accumulatedTime += timeElapsed;
    while (accumulatedTime >= fixedTimeStep) {
      update();
      accumulatedTime -= fixedTimeStep;
    }
    const alpha = accumulatedTime / fixedTimeStep;
    render(alpha);
    if (animationId) {
      animationId = ownerWindow.requestAnimationFrame(animate);
    }
  }
  function start() {
    if (animationId) return;
    animationId = ownerWindow.requestAnimationFrame(animate);
  }
  function stop() {
    ownerWindow.cancelAnimationFrame(animationId);
    lastTimeStamp = null;
    accumulatedTime = 0;
    animationId = 0;
  }
  function reset() {
    lastTimeStamp = null;
    accumulatedTime = 0;
  }
  const self = {
    init,
    destroy,
    start,
    stop,
    update,
    render
  };
  return self;
}
function Axis(axis, contentDirection) {
  const isRightToLeft = contentDirection === 'rtl';
  const isVertical = axis === 'y';
  const scroll = isVertical ? 'y' : 'x';
  const cross = isVertical ? 'x' : 'y';
  const sign = !isVertical && isRightToLeft ? -1 : 1;
  const startEdge = getStartEdge();
  const endEdge = getEndEdge();
  function measureSize(nodeRect) {
    const {
      height,
      width
    } = nodeRect;
    return isVertical ? height : width;
  }
  function getStartEdge() {
    if (isVertical) return 'top';
    return isRightToLeft ? 'right' : 'left';
  }
  function getEndEdge() {
    if (isVertical) return 'bottom';
    return isRightToLeft ? 'left' : 'right';
  }
  function direction(n) {
    return n * sign;
  }
  const self = {
    scroll,
    cross,
    startEdge,
    endEdge,
    measureSize,
    direction
  };
  return self;
}
function Limit(min = 0, max = 0) {
  const length = mathAbs(min - max);
  function reachedMin(n) {
    return n < min;
  }
  function reachedMax(n) {
    return n > max;
  }
  function reachedAny(n) {
    return reachedMin(n) || reachedMax(n);
  }
  function constrain(n) {
    if (!reachedAny(n)) return n;
    return reachedMin(n) ? min : max;
  }
  function removeOffset(n) {
    if (!length) return n;
    return n - length * Math.ceil((n - max) / length);
  }
  const self = {
    length,
    max,
    min,
    constrain,
    reachedAny,
    reachedMax,
    reachedMin,
    removeOffset
  };
  return self;
}
function Counter(max, start, loop) {
  const {
    constrain
  } = Limit(0, max);
  const loopEnd = max + 1;
  let counter = withinLimit(start);
  function withinLimit(n) {
    return !loop ? constrain(n) : mathAbs((loopEnd + n) % loopEnd);
  }
  function get() {
    return counter;
  }
  function set(n) {
    counter = withinLimit(n);
    return self;
  }
  function add(n) {
    return clone().set(get() + n);
  }
  function clone() {
    return Counter(max, get(), loop);
  }
  const self = {
    get,
    set,
    add,
    clone
  };
  return self;
}
function DragHandler(axis, rootNode, ownerDocument, ownerWindow, target, dragTracker, location, animation, scrollTo, scrollBody, scrollTarget, index, eventHandler, percentOfView, dragFree, dragThreshold, skipSnaps, baseFriction, watchDrag) {
  const {
    cross: crossAxis,
    direction
  } = axis;
  const focusNodes = ['INPUT', 'SELECT', 'TEXTAREA'];
  const nonPassiveEvent = {
    passive: false
  };
  const initEvents = EventStore();
  const dragEvents = EventStore();
  const goToNextThreshold = Limit(50, 225).constrain(percentOfView.measure(20));
  const snapForceBoost = {
    mouse: 300,
    touch: 400
  };
  const freeForceBoost = {
    mouse: 500,
    touch: 600
  };
  const baseSpeed = dragFree ? 43 : 25;
  let isMoving = false;
  let startScroll = 0;
  let startCross = 0;
  let pointerIsDown = false;
  let preventScroll = false;
  let preventClick = false;
  let isMouse = false;
  function init(emblaApi) {
    if (!watchDrag) return;
    function downIfAllowed(evt) {
      if (isBoolean(watchDrag) || watchDrag(emblaApi, evt)) down(evt);
    }
    const node = rootNode;
    initEvents.add(node, 'dragstart', evt => evt.preventDefault(), nonPassiveEvent).add(node, 'touchmove', () => undefined, nonPassiveEvent).add(node, 'touchend', () => undefined).add(node, 'touchstart', downIfAllowed).add(node, 'mousedown', downIfAllowed).add(node, 'touchcancel', up).add(node, 'contextmenu', up).add(node, 'click', click, true);
  }
  function destroy() {
    initEvents.clear();
    dragEvents.clear();
  }
  function addDragEvents() {
    const node = isMouse ? ownerDocument : rootNode;
    dragEvents.add(node, 'touchmove', move, nonPassiveEvent).add(node, 'touchend', up).add(node, 'mousemove', move, nonPassiveEvent).add(node, 'mouseup', up);
  }
  function isFocusNode(node) {
    const nodeName = node.nodeName || '';
    return focusNodes.includes(nodeName);
  }
  function forceBoost() {
    const boost = dragFree ? freeForceBoost : snapForceBoost;
    const type = isMouse ? 'mouse' : 'touch';
    return boost[type];
  }
  function allowedForce(force, targetChanged) {
    const next = index.add(mathSign(force) * -1);
    const baseForce = scrollTarget.byDistance(force, !dragFree).distance;
    if (dragFree || mathAbs(force) < goToNextThreshold) return baseForce;
    if (skipSnaps && targetChanged) return baseForce * 0.5;
    return scrollTarget.byIndex(next.get(), 0).distance;
  }
  function down(evt) {
    const isMouseEvt = isMouseEvent(evt, ownerWindow);
    isMouse = isMouseEvt;
    preventClick = dragFree && isMouseEvt && !evt.buttons && isMoving;
    isMoving = deltaAbs(target.get(), location.get()) >= 2;
    if (isMouseEvt && evt.button !== 0) return;
    if (isFocusNode(evt.target)) return;
    pointerIsDown = true;
    dragTracker.pointerDown(evt);
    scrollBody.useFriction(0).useDuration(0);
    target.set(location);
    addDragEvents();
    startScroll = dragTracker.readPoint(evt);
    startCross = dragTracker.readPoint(evt, crossAxis);
    eventHandler.emit('pointerDown');
  }
  function move(evt) {
    const isTouchEvt = !isMouseEvent(evt, ownerWindow);
    if (isTouchEvt && evt.touches.length >= 2) return up(evt);
    const lastScroll = dragTracker.readPoint(evt);
    const lastCross = dragTracker.readPoint(evt, crossAxis);
    const diffScroll = deltaAbs(lastScroll, startScroll);
    const diffCross = deltaAbs(lastCross, startCross);
    if (!preventScroll && !isMouse) {
      if (!evt.cancelable) return up(evt);
      preventScroll = diffScroll > diffCross;
      if (!preventScroll) return up(evt);
    }
    const diff = dragTracker.pointerMove(evt);
    if (diffScroll > dragThreshold) preventClick = true;
    scrollBody.useFriction(0.3).useDuration(0.75);
    animation.start();
    target.add(direction(diff));
    evt.preventDefault();
  }
  function up(evt) {
    const currentLocation = scrollTarget.byDistance(0, false);
    const targetChanged = currentLocation.index !== index.get();
    const rawForce = dragTracker.pointerUp(evt) * forceBoost();
    const force = allowedForce(direction(rawForce), targetChanged);
    const forceFactor = factorAbs(rawForce, force);
    const speed = baseSpeed - 10 * forceFactor;
    const friction = baseFriction + forceFactor / 50;
    preventScroll = false;
    pointerIsDown = false;
    dragEvents.clear();
    scrollBody.useDuration(speed).useFriction(friction);
    scrollTo.distance(force, !dragFree);
    isMouse = false;
    eventHandler.emit('pointerUp');
  }
  function click(evt) {
    if (preventClick) {
      evt.stopPropagation();
      evt.preventDefault();
      preventClick = false;
    }
  }
  function pointerDown() {
    return pointerIsDown;
  }
  const self = {
    init,
    destroy,
    pointerDown
  };
  return self;
}
function DragTracker(axis, ownerWindow) {
  const logInterval = 170;
  let startEvent;
  let lastEvent;
  function readTime(evt) {
    return evt.timeStamp;
  }
  function readPoint(evt, evtAxis) {
    const property = evtAxis || axis.scroll;
    const coord = `client${property === 'x' ? 'X' : 'Y'}`;
    return (isMouseEvent(evt, ownerWindow) ? evt : evt.touches[0])[coord];
  }
  function pointerDown(evt) {
    startEvent = evt;
    lastEvent = evt;
    return readPoint(evt);
  }
  function pointerMove(evt) {
    const diff = readPoint(evt) - readPoint(lastEvent);
    const expired = readTime(evt) - readTime(startEvent) > logInterval;
    lastEvent = evt;
    if (expired) startEvent = evt;
    return diff;
  }
  function pointerUp(evt) {
    if (!startEvent || !lastEvent) return 0;
    const diffDrag = readPoint(lastEvent) - readPoint(startEvent);
    const diffTime = readTime(evt) - readTime(startEvent);
    const expired = readTime(evt) - readTime(lastEvent) > logInterval;
    const force = diffDrag / diffTime;
    const isFlick = diffTime && !expired && mathAbs(force) > 0.1;
    return isFlick ? force : 0;
  }
  const self = {
    pointerDown,
    pointerMove,
    pointerUp,
    readPoint
  };
  return self;
}
function NodeRects() {
  function measure(node) {
    const {
      offsetTop,
      offsetLeft,
      offsetWidth,
      offsetHeight
    } = node;
    const offset = {
      top: offsetTop,
      right: offsetLeft + offsetWidth,
      bottom: offsetTop + offsetHeight,
      left: offsetLeft,
      width: offsetWidth,
      height: offsetHeight
    };
    return offset;
  }
  const self = {
    measure
  };
  return self;
}
function PercentOfView(viewSize) {
  function measure(n) {
    return viewSize * (n / 100);
  }
  const self = {
    measure
  };
  return self;
}
function ResizeHandler(container, eventHandler, ownerWindow, slides, axis, watchResize, nodeRects) {
  const observeNodes = [container].concat(slides);
  let resizeObserver;
  let containerSize;
  let slideSizes = [];
  let destroyed = false;
  function readSize(node) {
    return axis.measureSize(nodeRects.measure(node));
  }
  function init(emblaApi) {
    if (!watchResize) return;
    containerSize = readSize(container);
    slideSizes = slides.map(readSize);
    function defaultCallback(entries) {
      for (const entry of entries) {
        if (destroyed) return;
        const isContainer = entry.target === container;
        const slideIndex = slides.indexOf(entry.target);
        const lastSize = isContainer ? containerSize : slideSizes[slideIndex];
        const newSize = readSize(isContainer ? container : slides[slideIndex]);
        const diffSize = mathAbs(newSize - lastSize);
        if (diffSize >= 0.5) {
          emblaApi.reInit();
          eventHandler.emit('resize');
          break;
        }
      }
    }
    resizeObserver = new ResizeObserver(entries => {
      if (isBoolean(watchResize) || watchResize(emblaApi, entries)) {
        defaultCallback(entries);
      }
    });
    ownerWindow.requestAnimationFrame(() => {
      observeNodes.forEach(node => resizeObserver.observe(node));
    });
  }
  function destroy() {
    destroyed = true;
    if (resizeObserver) resizeObserver.disconnect();
  }
  const self = {
    init,
    destroy
  };
  return self;
}
function ScrollBody(location, offsetLocation, previousLocation, target, baseDuration, baseFriction) {
  let scrollVelocity = 0;
  let scrollDirection = 0;
  let scrollDuration = baseDuration;
  let scrollFriction = baseFriction;
  let rawLocation = location.get();
  let rawLocationPrevious = 0;
  function seek() {
    const displacement = target.get() - location.get();
    const isInstant = !scrollDuration;
    let scrollDistance = 0;
    if (isInstant) {
      scrollVelocity = 0;
      previousLocation.set(target);
      location.set(target);
      scrollDistance = displacement;
    } else {
      previousLocation.set(location);
      scrollVelocity += displacement / scrollDuration;
      scrollVelocity *= scrollFriction;
      rawLocation += scrollVelocity;
      location.add(scrollVelocity);
      scrollDistance = rawLocation - rawLocationPrevious;
    }
    scrollDirection = mathSign(scrollDistance);
    rawLocationPrevious = rawLocation;
    return self;
  }
  function settled() {
    const diff = target.get() - offsetLocation.get();
    return mathAbs(diff) < 0.001;
  }
  function duration() {
    return scrollDuration;
  }
  function direction() {
    return scrollDirection;
  }
  function velocity() {
    return scrollVelocity;
  }
  function useBaseDuration() {
    return useDuration(baseDuration);
  }
  function useBaseFriction() {
    return useFriction(baseFriction);
  }
  function useDuration(n) {
    scrollDuration = n;
    return self;
  }
  function useFriction(n) {
    scrollFriction = n;
    return self;
  }
  const self = {
    direction,
    duration,
    velocity,
    seek,
    settled,
    useBaseFriction,
    useBaseDuration,
    useFriction,
    useDuration
  };
  return self;
}
function ScrollBounds(limit, location, target, scrollBody, percentOfView) {
  const pullBackThreshold = percentOfView.measure(10);
  const edgeOffsetTolerance = percentOfView.measure(50);
  const frictionLimit = Limit(0.1, 0.99);
  let disabled = false;
  function shouldConstrain() {
    if (disabled) return false;
    if (!limit.reachedAny(target.get())) return false;
    if (!limit.reachedAny(location.get())) return false;
    return true;
  }
  function constrain(pointerDown) {
    if (!shouldConstrain()) return;
    const edge = limit.reachedMin(location.get()) ? 'min' : 'max';
    const diffToEdge = mathAbs(limit[edge] - location.get());
    const diffToTarget = target.get() - location.get();
    const friction = frictionLimit.constrain(diffToEdge / edgeOffsetTolerance);
    target.subtract(diffToTarget * friction);
    if (!pointerDown && mathAbs(diffToTarget) < pullBackThreshold) {
      target.set(limit.constrain(target.get()));
      scrollBody.useDuration(25).useBaseFriction();
    }
  }
  function toggleActive(active) {
    disabled = !active;
  }
  const self = {
    shouldConstrain,
    constrain,
    toggleActive
  };
  return self;
}
function ScrollContain(viewSize, contentSize, snapsAligned, containScroll, pixelTolerance) {
  const scrollBounds = Limit(-contentSize + viewSize, 0);
  const snapsBounded = measureBounded();
  const scrollContainLimit = findScrollContainLimit();
  const snapsContained = measureContained();
  function usePixelTolerance(bound, snap) {
    return deltaAbs(bound, snap) <= 1;
  }
  function findScrollContainLimit() {
    const startSnap = snapsBounded[0];
    const endSnap = arrayLast(snapsBounded);
    const min = snapsBounded.lastIndexOf(startSnap);
    const max = snapsBounded.indexOf(endSnap) + 1;
    return Limit(min, max);
  }
  function measureBounded() {
    return snapsAligned.map((snapAligned, index) => {
      const {
        min,
        max
      } = scrollBounds;
      const snap = scrollBounds.constrain(snapAligned);
      const isFirst = !index;
      const isLast = arrayIsLastIndex(snapsAligned, index);
      if (isFirst) return max;
      if (isLast) return min;
      if (usePixelTolerance(min, snap)) return min;
      if (usePixelTolerance(max, snap)) return max;
      return snap;
    }).map(scrollBound => parseFloat(scrollBound.toFixed(3)));
  }
  function measureContained() {
    if (contentSize <= viewSize + pixelTolerance) return [scrollBounds.max];
    if (containScroll === 'keepSnaps') return snapsBounded;
    const {
      min,
      max
    } = scrollContainLimit;
    return snapsBounded.slice(min, max);
  }
  const self = {
    snapsContained,
    scrollContainLimit
  };
  return self;
}
function ScrollLimit(contentSize, scrollSnaps, loop) {
  const max = scrollSnaps[0];
  const min = loop ? max - contentSize : arrayLast(scrollSnaps);
  const limit = Limit(min, max);
  const self = {
    limit
  };
  return self;
}
function ScrollLooper(contentSize, limit, location, vectors) {
  const jointSafety = 0.1;
  const min = limit.min + jointSafety;
  const max = limit.max + jointSafety;
  const {
    reachedMin,
    reachedMax
  } = Limit(min, max);
  function shouldLoop(direction) {
    if (direction === 1) return reachedMax(location.get());
    if (direction === -1) return reachedMin(location.get());
    return false;
  }
  function loop(direction) {
    if (!shouldLoop(direction)) return;
    const loopDistance = contentSize * (direction * -1);
    vectors.forEach(v => v.add(loopDistance));
  }
  const self = {
    loop
  };
  return self;
}
function ScrollProgress(limit) {
  const {
    max,
    length
  } = limit;
  function get(n) {
    const currentLocation = n - max;
    return length ? currentLocation / -length : 0;
  }
  const self = {
    get
  };
  return self;
}
function ScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll) {
  const {
    startEdge,
    endEdge
  } = axis;
  const {
    groupSlides
  } = slidesToScroll;
  const alignments = measureSizes().map(alignment.measure);
  const snaps = measureUnaligned();
  const snapsAligned = measureAligned();
  function measureSizes() {
    return groupSlides(slideRects).map(rects => arrayLast(rects)[endEdge] - rects[0][startEdge]).map(mathAbs);
  }
  function measureUnaligned() {
    return slideRects.map(rect => containerRect[startEdge] - rect[startEdge]).map(snap => -mathAbs(snap));
  }
  function measureAligned() {
    return groupSlides(snaps).map(g => g[0]).map((snap, index) => snap + alignments[index]);
  }
  const self = {
    snaps,
    snapsAligned
  };
  return self;
}
function SlideRegistry(containSnaps, containScroll, scrollSnaps, scrollContainLimit, slidesToScroll, slideIndexes) {
  const {
    groupSlides
  } = slidesToScroll;
  const {
    min,
    max
  } = scrollContainLimit;
  const slideRegistry = createSlideRegistry();
  function createSlideRegistry() {
    const groupedSlideIndexes = groupSlides(slideIndexes);
    const doNotContain = !containSnaps || containScroll === 'keepSnaps';
    if (scrollSnaps.length === 1) return [slideIndexes];
    if (doNotContain) return groupedSlideIndexes;
    return groupedSlideIndexes.slice(min, max).map((group, index, groups) => {
      const isFirst = !index;
      const isLast = arrayIsLastIndex(groups, index);
      if (isFirst) {
        const range = arrayLast(groups[0]) + 1;
        return arrayFromNumber(range);
      }
      if (isLast) {
        const range = arrayLastIndex(slideIndexes) - arrayLast(groups)[0] + 1;
        return arrayFromNumber(range, arrayLast(groups)[0]);
      }
      return group;
    });
  }
  const self = {
    slideRegistry
  };
  return self;
}
function ScrollTarget(loop, scrollSnaps, contentSize, limit, targetVector) {
  const {
    reachedAny,
    removeOffset,
    constrain
  } = limit;
  function minDistance(distances) {
    return distances.concat().sort((a, b) => mathAbs(a) - mathAbs(b))[0];
  }
  function findTargetSnap(target) {
    const distance = loop ? removeOffset(target) : constrain(target);
    const ascDiffsToSnaps = scrollSnaps.map((snap, index) => ({
      diff: shortcut(snap - distance, 0),
      index
    })).sort((d1, d2) => mathAbs(d1.diff) - mathAbs(d2.diff));
    const {
      index
    } = ascDiffsToSnaps[0];
    return {
      index,
      distance
    };
  }
  function shortcut(target, direction) {
    const targets = [target, target + contentSize, target - contentSize];
    if (!loop) return target;
    if (!direction) return minDistance(targets);
    const matchingTargets = targets.filter(t => mathSign(t) === direction);
    if (matchingTargets.length) return minDistance(matchingTargets);
    return arrayLast(targets) - contentSize;
  }
  function byIndex(index, direction) {
    const diffToSnap = scrollSnaps[index] - targetVector.get();
    const distance = shortcut(diffToSnap, direction);
    return {
      index,
      distance
    };
  }
  function byDistance(distance, snap) {
    const target = targetVector.get() + distance;
    const {
      index,
      distance: targetSnapDistance
    } = findTargetSnap(target);
    const reachedBound = !loop && reachedAny(target);
    if (!snap || reachedBound) return {
      index,
      distance
    };
    const diffToSnap = scrollSnaps[index] - targetSnapDistance;
    const snapDistance = distance + shortcut(diffToSnap, 0);
    return {
      index,
      distance: snapDistance
    };
  }
  const self = {
    byDistance,
    byIndex,
    shortcut
  };
  return self;
}
function ScrollTo(animation, indexCurrent, indexPrevious, scrollBody, scrollTarget, targetVector, eventHandler) {
  function scrollTo(target) {
    const distanceDiff = target.distance;
    const indexDiff = target.index !== indexCurrent.get();
    targetVector.add(distanceDiff);
    if (distanceDiff) {
      if (scrollBody.duration()) {
        animation.start();
      } else {
        animation.update();
        animation.render(1);
        animation.update();
      }
    }
    if (indexDiff) {
      indexPrevious.set(indexCurrent.get());
      indexCurrent.set(target.index);
      eventHandler.emit('select');
    }
  }
  function distance(n, snap) {
    const target = scrollTarget.byDistance(n, snap);
    scrollTo(target);
  }
  function index(n, direction) {
    const targetIndex = indexCurrent.clone().set(n);
    const target = scrollTarget.byIndex(targetIndex.get(), direction);
    scrollTo(target);
  }
  const self = {
    distance,
    index
  };
  return self;
}
function SlideFocus(root, slides, slideRegistry, scrollTo, scrollBody, eventStore, eventHandler, watchFocus) {
  const focusListenerOptions = {
    passive: true,
    capture: true
  };
  let lastTabPressTime = 0;
  function init(emblaApi) {
    if (!watchFocus) return;
    function defaultCallback(index) {
      const nowTime = new Date().getTime();
      const diffTime = nowTime - lastTabPressTime;
      if (diffTime > 10) return;
      eventHandler.emit('slideFocusStart');
      root.scrollLeft = 0;
      const group = slideRegistry.findIndex(group => group.includes(index));
      if (!isNumber(group)) return;
      scrollBody.useDuration(0);
      scrollTo.index(group, 0);
      eventHandler.emit('slideFocus');
    }
    eventStore.add(document, 'keydown', registerTabPress, false);
    slides.forEach((slide, slideIndex) => {
      eventStore.add(slide, 'focus', evt => {
        if (isBoolean(watchFocus) || watchFocus(emblaApi, evt)) {
          defaultCallback(slideIndex);
        }
      }, focusListenerOptions);
    });
  }
  function registerTabPress(event) {
    if (event.code === 'Tab') lastTabPressTime = new Date().getTime();
  }
  const self = {
    init
  };
  return self;
}
function Vector1D(initialValue) {
  let value = initialValue;
  function get() {
    return value;
  }
  function set(n) {
    value = normalizeInput(n);
  }
  function add(n) {
    value += normalizeInput(n);
  }
  function subtract(n) {
    value -= normalizeInput(n);
  }
  function normalizeInput(n) {
    return isNumber(n) ? n : n.get();
  }
  const self = {
    get,
    set,
    add,
    subtract
  };
  return self;
}
function Translate(axis, container) {
  const translate = axis.scroll === 'x' ? x : y;
  const containerStyle = container.style;
  let previousTarget = null;
  let disabled = false;
  function x(n) {
    return `translate3d(${n}px,0px,0px)`;
  }
  function y(n) {
    return `translate3d(0px,${n}px,0px)`;
  }
  function to(target) {
    if (disabled) return;
    const newTarget = roundToTwoDecimals(axis.direction(target));
    if (newTarget === previousTarget) return;
    containerStyle.transform = translate(newTarget);
    previousTarget = newTarget;
  }
  function toggleActive(active) {
    disabled = !active;
  }
  function clear() {
    if (disabled) return;
    containerStyle.transform = '';
    if (!container.getAttribute('style')) container.removeAttribute('style');
  }
  const self = {
    clear,
    to,
    toggleActive
  };
  return self;
}
function SlideLooper(axis, viewSize, contentSize, slideSizes, slideSizesWithGaps, snaps, scrollSnaps, location, slides) {
  const roundingSafety = 0.5;
  const ascItems = arrayKeys(slideSizesWithGaps);
  const descItems = arrayKeys(slideSizesWithGaps).reverse();
  const loopPoints = startPoints().concat(endPoints());
  function removeSlideSizes(indexes, from) {
    return indexes.reduce((a, i) => {
      return a - slideSizesWithGaps[i];
    }, from);
  }
  function slidesInGap(indexes, gap) {
    return indexes.reduce((a, i) => {
      const remainingGap = removeSlideSizes(a, gap);
      return remainingGap > 0 ? a.concat([i]) : a;
    }, []);
  }
  function findSlideBounds(offset) {
    return snaps.map((snap, index) => ({
      start: snap - slideSizes[index] + roundingSafety + offset,
      end: snap + viewSize - roundingSafety + offset
    }));
  }
  function findLoopPoints(indexes, offset, isEndEdge) {
    const slideBounds = findSlideBounds(offset);
    return indexes.map(index => {
      const initial = isEndEdge ? 0 : -contentSize;
      const altered = isEndEdge ? contentSize : 0;
      const boundEdge = isEndEdge ? 'end' : 'start';
      const loopPoint = slideBounds[index][boundEdge];
      return {
        index,
        loopPoint,
        slideLocation: Vector1D(-1),
        translate: Translate(axis, slides[index]),
        target: () => location.get() > loopPoint ? initial : altered
      };
    });
  }
  function startPoints() {
    const gap = scrollSnaps[0];
    const indexes = slidesInGap(descItems, gap);
    return findLoopPoints(indexes, contentSize, false);
  }
  function endPoints() {
    const gap = viewSize - scrollSnaps[0] - 1;
    const indexes = slidesInGap(ascItems, gap);
    return findLoopPoints(indexes, -contentSize, true);
  }
  function canLoop() {
    return loopPoints.every(({
      index
    }) => {
      const otherIndexes = ascItems.filter(i => i !== index);
      return removeSlideSizes(otherIndexes, viewSize) <= 0.1;
    });
  }
  function loop() {
    loopPoints.forEach(loopPoint => {
      const {
        target,
        translate,
        slideLocation
      } = loopPoint;
      const shiftLocation = target();
      if (shiftLocation === slideLocation.get()) return;
      translate.to(shiftLocation);
      slideLocation.set(shiftLocation);
    });
  }
  function clear() {
    loopPoints.forEach(loopPoint => loopPoint.translate.clear());
  }
  const self = {
    canLoop,
    clear,
    loop,
    loopPoints
  };
  return self;
}
function SlidesHandler(container, eventHandler, watchSlides) {
  let mutationObserver;
  let destroyed = false;
  function init(emblaApi) {
    if (!watchSlides) return;
    function defaultCallback(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          emblaApi.reInit();
          eventHandler.emit('slidesChanged');
          break;
        }
      }
    }
    mutationObserver = new MutationObserver(mutations => {
      if (destroyed) return;
      if (isBoolean(watchSlides) || watchSlides(emblaApi, mutations)) {
        defaultCallback(mutations);
      }
    });
    mutationObserver.observe(container, {
      childList: true
    });
  }
  function destroy() {
    if (mutationObserver) mutationObserver.disconnect();
    destroyed = true;
  }
  const self = {
    init,
    destroy
  };
  return self;
}
function SlidesInView(container, slides, eventHandler, threshold) {
  const intersectionEntryMap = {};
  let inViewCache = null;
  let notInViewCache = null;
  let intersectionObserver;
  let destroyed = false;
  function init() {
    intersectionObserver = new IntersectionObserver(entries => {
      if (destroyed) return;
      entries.forEach(entry => {
        const index = slides.indexOf(entry.target);
        intersectionEntryMap[index] = entry;
      });
      inViewCache = null;
      notInViewCache = null;
      eventHandler.emit('slidesInView');
    }, {
      root: container.parentElement,
      threshold
    });
    slides.forEach(slide => intersectionObserver.observe(slide));
  }
  function destroy() {
    if (intersectionObserver) intersectionObserver.disconnect();
    destroyed = true;
  }
  function createInViewList(inView) {
    return objectKeys(intersectionEntryMap).reduce((list, slideIndex) => {
      const index = parseInt(slideIndex);
      const {
        isIntersecting
      } = intersectionEntryMap[index];
      const inViewMatch = inView && isIntersecting;
      const notInViewMatch = !inView && !isIntersecting;
      if (inViewMatch || notInViewMatch) list.push(index);
      return list;
    }, []);
  }
  function get(inView = true) {
    if (inView && inViewCache) return inViewCache;
    if (!inView && notInViewCache) return notInViewCache;
    const slideIndexes = createInViewList(inView);
    if (inView) inViewCache = slideIndexes;
    if (!inView) notInViewCache = slideIndexes;
    return slideIndexes;
  }
  const self = {
    init,
    destroy,
    get
  };
  return self;
}
function SlideSizes(axis, containerRect, slideRects, slides, readEdgeGap, ownerWindow) {
  const {
    measureSize,
    startEdge,
    endEdge
  } = axis;
  const withEdgeGap = slideRects[0] && readEdgeGap;
  const startGap = measureStartGap();
  const endGap = measureEndGap();
  const slideSizes = slideRects.map(measureSize);
  const slideSizesWithGaps = measureWithGaps();
  function measureStartGap() {
    if (!withEdgeGap) return 0;
    const slideRect = slideRects[0];
    return mathAbs(containerRect[startEdge] - slideRect[startEdge]);
  }
  function measureEndGap() {
    if (!withEdgeGap) return 0;
    const style = ownerWindow.getComputedStyle(arrayLast(slides));
    return parseFloat(style.getPropertyValue(`margin-${endEdge}`));
  }
  function measureWithGaps() {
    return slideRects.map((rect, index, rects) => {
      const isFirst = !index;
      const isLast = arrayIsLastIndex(rects, index);
      if (isFirst) return slideSizes[index] + startGap;
      if (isLast) return slideSizes[index] + endGap;
      return rects[index + 1][startEdge] - rect[startEdge];
    }).map(mathAbs);
  }
  const self = {
    slideSizes,
    slideSizesWithGaps,
    startGap,
    endGap
  };
  return self;
}
function SlidesToScroll(axis, viewSize, slidesToScroll, loop, containerRect, slideRects, startGap, endGap, pixelTolerance) {
  const {
    startEdge,
    endEdge,
    direction
  } = axis;
  const groupByNumber = isNumber(slidesToScroll);
  function byNumber(array, groupSize) {
    return arrayKeys(array).filter(i => i % groupSize === 0).map(i => array.slice(i, i + groupSize));
  }
  function bySize(array) {
    if (!array.length) return [];
    return arrayKeys(array).reduce((groups, rectB, index) => {
      const rectA = arrayLast(groups) || 0;
      const isFirst = rectA === 0;
      const isLast = rectB === arrayLastIndex(array);
      const edgeA = containerRect[startEdge] - slideRects[rectA][startEdge];
      const edgeB = containerRect[startEdge] - slideRects[rectB][endEdge];
      const gapA = !loop && isFirst ? direction(startGap) : 0;
      const gapB = !loop && isLast ? direction(endGap) : 0;
      const chunkSize = mathAbs(edgeB - gapB - (edgeA + gapA));
      if (index && chunkSize > viewSize + pixelTolerance) groups.push(rectB);
      if (isLast) groups.push(array.length);
      return groups;
    }, []).map((currentSize, index, groups) => {
      const previousSize = Math.max(groups[index - 1] || 0);
      return array.slice(previousSize, currentSize);
    });
  }
  function groupSlides(array) {
    return groupByNumber ? byNumber(array, slidesToScroll) : bySize(array);
  }
  const self = {
    groupSlides
  };
  return self;
}
function Engine(root, container, slides, ownerDocument, ownerWindow, options, eventHandler) {
  // Options
  const {
    align,
    axis: scrollAxis,
    direction,
    startIndex,
    loop,
    duration,
    dragFree,
    dragThreshold,
    inViewThreshold,
    slidesToScroll: groupSlides,
    skipSnaps,
    containScroll,
    watchResize,
    watchSlides,
    watchDrag,
    watchFocus
  } = options;
  // Measurements
  const pixelTolerance = 2;
  const nodeRects = NodeRects();
  const containerRect = nodeRects.measure(container);
  const slideRects = slides.map(nodeRects.measure);
  const axis = Axis(scrollAxis, direction);
  const viewSize = axis.measureSize(containerRect);
  const percentOfView = PercentOfView(viewSize);
  const alignment = Alignment(align, viewSize);
  const containSnaps = !loop && !!containScroll;
  const readEdgeGap = loop || !!containScroll;
  const {
    slideSizes,
    slideSizesWithGaps,
    startGap,
    endGap
  } = SlideSizes(axis, containerRect, slideRects, slides, readEdgeGap, ownerWindow);
  const slidesToScroll = SlidesToScroll(axis, viewSize, groupSlides, loop, containerRect, slideRects, startGap, endGap, pixelTolerance);
  const {
    snaps,
    snapsAligned
  } = ScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll);
  const contentSize = -arrayLast(snaps) + arrayLast(slideSizesWithGaps);
  const {
    snapsContained,
    scrollContainLimit
  } = ScrollContain(viewSize, contentSize, snapsAligned, containScroll, pixelTolerance);
  const scrollSnaps = containSnaps ? snapsContained : snapsAligned;
  const {
    limit
  } = ScrollLimit(contentSize, scrollSnaps, loop);
  // Indexes
  const index = Counter(arrayLastIndex(scrollSnaps), startIndex, loop);
  const indexPrevious = index.clone();
  const slideIndexes = arrayKeys(slides);
  // Animation
  const update = ({
    dragHandler,
    scrollBody,
    scrollBounds,
    options: {
      loop
    }
  }) => {
    if (!loop) scrollBounds.constrain(dragHandler.pointerDown());
    scrollBody.seek();
  };
  const render = ({
    scrollBody,
    translate,
    location,
    offsetLocation,
    previousLocation,
    scrollLooper,
    slideLooper,
    dragHandler,
    animation,
    eventHandler,
    scrollBounds,
    options: {
      loop
    }
  }, alpha) => {
    const shouldSettle = scrollBody.settled();
    const withinBounds = !scrollBounds.shouldConstrain();
    const hasSettled = loop ? shouldSettle : shouldSettle && withinBounds;
    const hasSettledAndIdle = hasSettled && !dragHandler.pointerDown();
    if (hasSettledAndIdle) animation.stop();
    const interpolatedLocation = location.get() * alpha + previousLocation.get() * (1 - alpha);
    offsetLocation.set(interpolatedLocation);
    if (loop) {
      scrollLooper.loop(scrollBody.direction());
      slideLooper.loop();
    }
    translate.to(offsetLocation.get());
    if (hasSettledAndIdle) eventHandler.emit('settle');
    if (!hasSettled) eventHandler.emit('scroll');
  };
  const animation = Animations(ownerDocument, ownerWindow, () => update(engine), alpha => render(engine, alpha));
  // Shared
  const friction = 0.68;
  const startLocation = scrollSnaps[index.get()];
  const location = Vector1D(startLocation);
  const previousLocation = Vector1D(startLocation);
  const offsetLocation = Vector1D(startLocation);
  const target = Vector1D(startLocation);
  const scrollBody = ScrollBody(location, offsetLocation, previousLocation, target, duration, friction);
  const scrollTarget = ScrollTarget(loop, scrollSnaps, contentSize, limit, target);
  const scrollTo = ScrollTo(animation, index, indexPrevious, scrollBody, scrollTarget, target, eventHandler);
  const scrollProgress = ScrollProgress(limit);
  const eventStore = EventStore();
  const slidesInView = SlidesInView(container, slides, eventHandler, inViewThreshold);
  const {
    slideRegistry
  } = SlideRegistry(containSnaps, containScroll, scrollSnaps, scrollContainLimit, slidesToScroll, slideIndexes);
  const slideFocus = SlideFocus(root, slides, slideRegistry, scrollTo, scrollBody, eventStore, eventHandler, watchFocus);
  // Engine
  const engine = {
    ownerDocument,
    ownerWindow,
    eventHandler,
    containerRect,
    slideRects,
    animation,
    axis,
    dragHandler: DragHandler(axis, root, ownerDocument, ownerWindow, target, DragTracker(axis, ownerWindow), location, animation, scrollTo, scrollBody, scrollTarget, index, eventHandler, percentOfView, dragFree, dragThreshold, skipSnaps, friction, watchDrag),
    eventStore,
    percentOfView,
    index,
    indexPrevious,
    limit,
    location,
    offsetLocation,
    previousLocation,
    options,
    resizeHandler: ResizeHandler(container, eventHandler, ownerWindow, slides, axis, watchResize, nodeRects),
    scrollBody,
    scrollBounds: ScrollBounds(limit, offsetLocation, target, scrollBody, percentOfView),
    scrollLooper: ScrollLooper(contentSize, limit, offsetLocation, [location, offsetLocation, previousLocation, target]),
    scrollProgress,
    scrollSnapList: scrollSnaps.map(scrollProgress.get),
    scrollSnaps,
    scrollTarget,
    scrollTo,
    slideLooper: SlideLooper(axis, viewSize, contentSize, slideSizes, slideSizesWithGaps, snaps, scrollSnaps, offsetLocation, slides),
    slideFocus,
    slidesHandler: SlidesHandler(container, eventHandler, watchSlides),
    slidesInView,
    slideIndexes,
    slideRegistry,
    slidesToScroll,
    target,
    translate: Translate(axis, container)
  };
  return engine;
}
function EventHandler() {
  let listeners = {};
  let api;
  function init(emblaApi) {
    api = emblaApi;
  }
  function getListeners(evt) {
    return listeners[evt] || [];
  }
  function emit(evt) {
    getListeners(evt).forEach(e => e(api, evt));
    return self;
  }
  function on(evt, cb) {
    listeners[evt] = getListeners(evt).concat([cb]);
    return self;
  }
  function off(evt, cb) {
    listeners[evt] = getListeners(evt).filter(e => e !== cb);
    return self;
  }
  function clear() {
    listeners = {};
  }
  const self = {
    init,
    emit,
    off,
    on,
    clear
  };
  return self;
}
const defaultOptions = {
  align: 'center',
  axis: 'x',
  container: null,
  slides: null,
  containScroll: 'trimSnaps',
  direction: 'ltr',
  slidesToScroll: 1,
  inViewThreshold: 0,
  breakpoints: {},
  dragFree: false,
  dragThreshold: 10,
  loop: false,
  skipSnaps: false,
  duration: 25,
  startIndex: 0,
  active: true,
  watchDrag: true,
  watchResize: true,
  watchSlides: true,
  watchFocus: true
};
function OptionsHandler(ownerWindow) {
  function mergeOptions(optionsA, optionsB) {
    return objectsMergeDeep(optionsA, optionsB || {});
  }
  function optionsAtMedia(options) {
    const optionsAtMedia = options.breakpoints || {};
    const matchedMediaOptions = objectKeys(optionsAtMedia).filter(media => ownerWindow.matchMedia(media).matches).map(media => optionsAtMedia[media]).reduce((a, mediaOption) => mergeOptions(a, mediaOption), {});
    return mergeOptions(options, matchedMediaOptions);
  }
  function optionsMediaQueries(optionsList) {
    return optionsList.map(options => objectKeys(options.breakpoints || {})).reduce((acc, mediaQueries) => acc.concat(mediaQueries), []).map(ownerWindow.matchMedia);
  }
  const self = {
    mergeOptions,
    optionsAtMedia,
    optionsMediaQueries
  };
  return self;
}
function PluginsHandler(optionsHandler) {
  let activePlugins = [];
  function init(emblaApi, plugins) {
    activePlugins = plugins.filter(({
      options
    }) => optionsHandler.optionsAtMedia(options).active !== false);
    activePlugins.forEach(plugin => plugin.init(emblaApi, optionsHandler));
    return plugins.reduce((map, plugin) => Object.assign(map, {
      [plugin.name]: plugin
    }), {});
  }
  function destroy() {
    activePlugins = activePlugins.filter(plugin => plugin.destroy());
  }
  const self = {
    init,
    destroy
  };
  return self;
}
function EmblaCarousel(root, userOptions, userPlugins) {
  const ownerDocument = root.ownerDocument;
  const ownerWindow = ownerDocument.defaultView;
  const optionsHandler = OptionsHandler(ownerWindow);
  const pluginsHandler = PluginsHandler(optionsHandler);
  const mediaHandlers = EventStore();
  const eventHandler = EventHandler();
  const {
    mergeOptions,
    optionsAtMedia,
    optionsMediaQueries
  } = optionsHandler;
  const {
    on,
    off,
    emit
  } = eventHandler;
  const reInit = reActivate;
  let destroyed = false;
  let engine;
  let optionsBase = mergeOptions(defaultOptions, EmblaCarousel.globalOptions);
  let options = mergeOptions(optionsBase);
  let pluginList = [];
  let pluginApis;
  let container;
  let slides;
  function storeElements() {
    const {
      container: userContainer,
      slides: userSlides
    } = options;
    const customContainer = isString(userContainer) ? root.querySelector(userContainer) : userContainer;
    container = customContainer || root.children[0];
    const customSlides = isString(userSlides) ? container.querySelectorAll(userSlides) : userSlides;
    slides = [].slice.call(customSlides || container.children);
  }
  function createEngine(options) {
    const engine = Engine(root, container, slides, ownerDocument, ownerWindow, options, eventHandler);
    if (options.loop && !engine.slideLooper.canLoop()) {
      const optionsWithoutLoop = Object.assign({}, options, {
        loop: false
      });
      return createEngine(optionsWithoutLoop);
    }
    return engine;
  }
  function activate(withOptions, withPlugins) {
    if (destroyed) return;
    optionsBase = mergeOptions(optionsBase, withOptions);
    options = optionsAtMedia(optionsBase);
    pluginList = withPlugins || pluginList;
    storeElements();
    engine = createEngine(options);
    optionsMediaQueries([optionsBase, ...pluginList.map(({
      options
    }) => options)]).forEach(query => mediaHandlers.add(query, 'change', reActivate));
    if (!options.active) return;
    engine.translate.to(engine.location.get());
    engine.animation.init();
    engine.slidesInView.init();
    engine.slideFocus.init(self);
    engine.eventHandler.init(self);
    engine.resizeHandler.init(self);
    engine.slidesHandler.init(self);
    if (engine.options.loop) engine.slideLooper.loop();
    if (container.offsetParent && slides.length) engine.dragHandler.init(self);
    pluginApis = pluginsHandler.init(self, pluginList);
  }
  function reActivate(withOptions, withPlugins) {
    const startIndex = selectedScrollSnap();
    deActivate();
    activate(mergeOptions({
      startIndex
    }, withOptions), withPlugins);
    eventHandler.emit('reInit');
  }
  function deActivate() {
    engine.dragHandler.destroy();
    engine.eventStore.clear();
    engine.translate.clear();
    engine.slideLooper.clear();
    engine.resizeHandler.destroy();
    engine.slidesHandler.destroy();
    engine.slidesInView.destroy();
    engine.animation.destroy();
    pluginsHandler.destroy();
    mediaHandlers.clear();
  }
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    mediaHandlers.clear();
    deActivate();
    eventHandler.emit('destroy');
    eventHandler.clear();
  }
  function scrollTo(index, jump, direction) {
    if (!options.active || destroyed) return;
    engine.scrollBody.useBaseFriction().useDuration(jump === true ? 0 : options.duration);
    engine.scrollTo.index(index, direction || 0);
  }
  function scrollNext(jump) {
    const next = engine.index.add(1).get();
    scrollTo(next, jump, -1);
  }
  function scrollPrev(jump) {
    const prev = engine.index.add(-1).get();
    scrollTo(prev, jump, 1);
  }
  function canScrollNext() {
    const next = engine.index.add(1).get();
    return next !== selectedScrollSnap();
  }
  function canScrollPrev() {
    const prev = engine.index.add(-1).get();
    return prev !== selectedScrollSnap();
  }
  function scrollSnapList() {
    return engine.scrollSnapList;
  }
  function scrollProgress() {
    return engine.scrollProgress.get(engine.offsetLocation.get());
  }
  function selectedScrollSnap() {
    return engine.index.get();
  }
  function previousScrollSnap() {
    return engine.indexPrevious.get();
  }
  function slidesInView() {
    return engine.slidesInView.get();
  }
  function slidesNotInView() {
    return engine.slidesInView.get(false);
  }
  function plugins() {
    return pluginApis;
  }
  function internalEngine() {
    return engine;
  }
  function rootNode() {
    return root;
  }
  function containerNode() {
    return container;
  }
  function slideNodes() {
    return slides;
  }
  const self = {
    canScrollNext,
    canScrollPrev,
    containerNode,
    internalEngine,
    destroy,
    off,
    on,
    emit,
    plugins,
    previousScrollSnap,
    reInit,
    rootNode,
    scrollNext,
    scrollPrev,
    scrollProgress,
    scrollSnapList,
    scrollTo,
    selectedScrollSnap,
    slideNodes,
    slidesInView,
    slidesNotInView
  };
  activate(userOptions, userPlugins);
  setTimeout(() => eventHandler.emit('init'), 0);
  return self;
}
EmblaCarousel.globalOptions = undefined;


/***/ }),

/***/ "./shared/components/ResponsiveControl.tsx":
/*!*************************************************!*\
  !*** ./shared/components/ResponsiveControl.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResponsiveControl)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function ResponsiveControl({
  label,
  values,
  onChange,
  min = 1,
  max = 6,
  step = 1,
  help = {},
  className = ''
}) {
  const [selectedDevice, setSelectedDevice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('desktop');
  const handleValueChange = value => {
    if (value === undefined) return;
    onChange({
      ...values,
      [selectedDevice]: value
    });
  };
  const getCurrentValue = () => values[selectedDevice];
  const getCurrentHelp = () => help[selectedDevice];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: `responsive-control ${className}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      style: {
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
        style: {
          fontSize: '13px',
          fontWeight: '500',
          color: '#1e1e1e',
          margin: 0
        },
        children: label
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ButtonGroup, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPressed: selectedDevice === 'desktop',
          onClick: () => setSelectedDevice('desktop'),
          variant: selectedDevice === 'desktop' ? 'primary' : 'secondary',
          size: "small",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Desktop', 'jankx'),
          children: "\uD83D\uDDA5\uFE0F"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPressed: selectedDevice === 'tablet',
          onClick: () => setSelectedDevice('tablet'),
          variant: selectedDevice === 'tablet' ? 'primary' : 'secondary',
          size: "small",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tablet', 'jankx'),
          children: "\uD83D\uDCF1"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPressed: selectedDevice === 'mobile',
          onClick: () => setSelectedDevice('mobile'),
          variant: selectedDevice === 'mobile' ? 'primary' : 'secondary',
          size: "small",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Mobile', 'jankx'),
          children: "\uD83D\uDCF1"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`${selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)} ${label}`, 'jankx'),
      value: getCurrentValue(),
      onChange: handleValueChange,
      min: min,
      max: max,
      step: step,
      help: getCurrentHelp()
    })]
  });
}

/***/ }),

/***/ "./shared/components/index.ts":
/*!************************************!*\
  !*** ./shared/components/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResponsiveControl: () => (/* reexport safe */ _ResponsiveControl__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   useResponsiveValue: () => (/* reexport safe */ _useResponsiveValue__WEBPACK_IMPORTED_MODULE_1__.useResponsiveValue)
/* harmony export */ });
/* harmony import */ var _ResponsiveControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ResponsiveControl */ "./shared/components/ResponsiveControl.tsx");
/* harmony import */ var _useResponsiveValue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useResponsiveValue */ "./shared/components/useResponsiveValue.ts");



/***/ }),

/***/ "./shared/components/useResponsiveValue.ts":
/*!*************************************************!*\
  !*** ./shared/components/useResponsiveValue.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useResponsiveValue: () => (/* binding */ useResponsiveValue)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function useResponsiveValue(initialValues = {}) {
  const [values, setValues] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    desktop: initialValues.desktop || 3,
    tablet: initialValues.tablet || 2,
    mobile: initialValues.mobile || 1
  });
  const updateValue = (device, value) => {
    setValues(prev => ({
      ...prev,
      [device]: value
    }));
  };
  const updateValues = newValues => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };
  const resetToDefaults = defaults => {
    setValues(defaults);
  };
  return {
    values,
    updateValue,
    updateValues,
    resetToDefaults
  };
}

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/server-side-render":
/*!******************************************!*\
  !*** external ["wp","serverSideRender"] ***!
  \******************************************/
/***/ ((module) => {

module.exports = window["wp"]["serverSideRender"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************************!*\
  !*** ./blocks/post-type-layout/index.tsx ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/server-side-render */ "@wordpress/server-side-render");
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _shared_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/components */ "./shared/components/index.ts");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./block.json */ "./blocks/post-type-layout/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./style.scss */ "./blocks/post-type-layout/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./editor.scss */ "./blocks/post-type-layout/editor.scss");
/* harmony import */ var embla_carousel_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! embla-carousel-react */ "./node_modules/embla-carousel-react/esm/embla-carousel-react.esm.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__);














function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    queryPreset,
    postType,
    postsPerPage,
    layout,
    columns,
    columnsTablet,
    columnsMobile,
    showTitle,
    showExcerpt,
    showFeaturedImage,
    includeStickyPosts = false,
    thumbnailPosition = 'top',
    imageRatio,
    showDate,
    showAuthor,
    excerptLength,
    orderBy,
    order,
    queryId,
    enablePagination,
    paginationStyle,
    paginationAlignment,
    showPaginationNumbers,
    paginationPrevText,
    paginationNextText,
    offset,
    taxQuery,
    metaQuery,
    keyword,
    authorIn,
    authorNotIn,
    postIn,
    postNotIn,
    metaKey,
    metaType,
    postStatus,
    postParent,
    postParentIn,
    postParentNotIn,
    customQueryId,
    slidesToScroll,
    loop,
    autoplay,
    autoplayDelay,
    showArrows,
    showDots
  } = attributes;

  // Use ServerSideRender for initial render (better UX, SSR)
  // Only use AJAX fetch when needed for complex interactions
  const useAjaxRender = true;

  // Debounced attributes for AJAX render (only when useAjaxRender is true)
  const [debouncedAttributes, setDebouncedAttributes] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(attributes);
  const [cachedHtml, setCachedHtml] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)('');
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);

  // Embla Carousel refs for carousel layout preview in editor
  // Always initialize hook, but only use it when layout is carousel
  const [emblaRef, emblaApi] = (0,embla_carousel_react__WEBPACK_IMPORTED_MODULE_12__["default"])({
    slidesToScroll: slidesToScroll !== null && slidesToScroll !== void 0 ? slidesToScroll : 1,
    loop: loop !== null && loop !== void 0 ? loop : false,
    skipSnaps: false,
    dragFree: false
  });

  // Re-initialize carousel when settings change (for carousel layout only)
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    if (layout === 'carousel' && emblaApi && cachedHtml) {
      // Embla will auto-update when options change via props
      emblaApi.reInit();
    }
  }, [layout, slidesToScroll, loop, cachedHtml, emblaApi]);

  // States for taxonomies and authors
  const [taxonomies, setTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)([]);
  const [authors, setAuthors] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)([]);
  const [loadingTaxonomies, setLoadingTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const [taxonomyTerms, setTaxonomyTerms] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)({});

  // Debounce attributes update để giảm số lần re-render (only when using AJAX)
  const updateDebouncedAttributes = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useCallback)((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_7__.debounce)(newAttributes => {
    setDebouncedAttributes(newAttributes);
    if (useAjaxRender) {
      setIsLoading(true);
    }
  }, 800), [useAjaxRender]);
  const attributesHash = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => JSON.stringify(attributes), [attributes]);
  const previousAttributesHashRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    if (!useAjaxRender) {
      return;
    }
    if (previousAttributesHashRef.current === attributesHash) {
      return;
    }
    previousAttributesHashRef.current = attributesHash;
    setIsLoading(true);
    updateDebouncedAttributes(attributes);
  }, [attributes, attributesHash, updateDebouncedAttributes, useAjaxRender]);

  // Generate unique queryId if not set
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    if (!queryId) {
      // Generate numeric ID from clientId hash
      const hash = clientId.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      setAttributes({
        queryId: Math.abs(hash)
      });
    }
  }, [queryId, clientId, setAttributes]);

  // Reset queryPreset if current preset is not valid for the current postType
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const allPresets = window.jankxQueryOptions?.queryPresets || [];
    const validPresets = allPresets.filter(preset => !preset.postType || preset.postType === postType);
    const currentPresetValid = validPresets.some(preset => preset.value === queryPreset);
    if (!currentPresetValid && validPresets.length > 0) {
      // Reset to first valid preset
      setAttributes({
        queryPreset: validPresets[0].value
      });
    }
  }, [postType, queryPreset, setAttributes]);

  // Fetch taxonomies and authors when postType changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const fetchTaxonomiesAndAuthors = async () => {
      setLoadingTaxonomies(true);
      try {
        // Fetch taxonomies for this post type
        const taxonomiesData = await window.wp.apiFetch({
          path: `/wp/v2/taxonomies?type=${postType}`
        });

        // Convert object to array
        const taxArray = Object.values(taxonomiesData || {});
        setTaxonomies(taxArray);

        // Fetch authors
        const authorsData = await window.wp.apiFetch({
          path: '/wp/v2/users?who=authors&per_page=100'
        });
        setAuthors(authorsData || []);
      } catch (error) {
        console.error('Error fetching taxonomies/authors:', error);
        setTaxonomies([]);
        setAuthors([]);
      } finally {
        setLoadingTaxonomies(false);
      }
    };
    fetchTaxonomiesAndAuthors();
  }, [postType]);

  // Function to fetch terms for a specific taxonomy
  const fetchTermsForTaxonomy = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useCallback)(async taxonomy => {
    if (taxonomyTerms[taxonomy]) {
      return; // Already loaded
    }
    try {
      const terms = await window.wp.apiFetch({
        path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`
      });
      setTaxonomyTerms(prev => ({
        ...prev,
        [taxonomy]: terms || []
      }));
    } catch (error) {
      console.error(`Error fetching terms for ${taxonomy}:`, error);
      setTaxonomyTerms(prev => ({
        ...prev,
        [taxonomy]: []
      }));
    }
  }, [taxonomyTerms]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: `post-type-layout layout-${layout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`,
    style: {
      '--columns-desktop': columns,
      '--columns-tablet': columnsTablet,
      '--columns-mobile': columnsMobile
    }
  });

  // Get available post types
  const postTypes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    const {
      getPostTypes
    } = select('core');
    return getPostTypes({
      per_page: -1
    }) || [];
  }, []);
  const postTypeOptions = postTypes.filter(type => type.viewable && type.slug !== 'attachment').map(type => ({
    label: type.name,
    value: type.slug
  }));

  // Get current layout's supported options
  const supportedLayouts = window.jankxSupportedPostTypeLayouts || [];
  const currentLayout = supportedLayouts.find(l => l.name === layout);
  const supportedOptions = currentLayout?.supportedOptions || [];
  const readOnlyOptions = currentLayout?.readOnlyOptions || [];

  // Create stable key based on actual query attributes only (for AJAX render)
  // Chỉ re-render khi các attributes này thay đổi
  const renderKey = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    if (!useAjaxRender) {
      return '';
    }
    const keyAttributes = {
      postType: debouncedAttributes.postType,
      postsPerPage: debouncedAttributes.postsPerPage,
      layout: debouncedAttributes.layout,
      columns: debouncedAttributes.columns,
      showTitle: debouncedAttributes.showTitle,
      showExcerpt: debouncedAttributes.showExcerpt,
      showFeaturedImage: debouncedAttributes.showFeaturedImage,
      includeStickyPosts: debouncedAttributes.includeStickyPosts,
      thumbnailPosition: debouncedAttributes.thumbnailPosition,
      imageRatio: debouncedAttributes.imageRatio,
      showDate: debouncedAttributes.showDate,
      showAuthor: debouncedAttributes.showAuthor,
      excerptLength: debouncedAttributes.excerptLength,
      orderBy: debouncedAttributes.orderBy,
      order: debouncedAttributes.order,
      enablePagination: debouncedAttributes.enablePagination,
      paginationStyle: debouncedAttributes.paginationStyle,
      paginationAlignment: debouncedAttributes.paginationAlignment,
      showPaginationNumbers: debouncedAttributes.showPaginationNumbers,
      paginationPrevText: debouncedAttributes.paginationPrevText,
      paginationNextText: debouncedAttributes.paginationNextText,
      offset: debouncedAttributes.offset,
      taxQuery: debouncedAttributes.taxQuery,
      metaQuery: debouncedAttributes.metaQuery,
      keyword: debouncedAttributes.keyword,
      authorIn: debouncedAttributes.authorIn,
      authorNotIn: debouncedAttributes.authorNotIn,
      postIn: debouncedAttributes.postIn,
      postNotIn: debouncedAttributes.postNotIn,
      metaKey: debouncedAttributes.metaKey,
      metaType: debouncedAttributes.metaType,
      postStatus: debouncedAttributes.postStatus,
      postParent: debouncedAttributes.postParent,
      postParentIn: debouncedAttributes.postParentIn,
      postParentNotIn: debouncedAttributes.postParentNotIn,
      customQueryId: debouncedAttributes.customQueryId,
      slidesToScroll: debouncedAttributes.slidesToScroll,
      loop: debouncedAttributes.loop,
      autoplay: debouncedAttributes.autoplay,
      autoplayDelay: debouncedAttributes.autoplayDelay,
      showArrows: debouncedAttributes.showArrows,
      showDots: debouncedAttributes.showDots
    };
    return JSON.stringify(keyAttributes);
  }, [debouncedAttributes, useAjaxRender]);

  // Fetch posts từ REST API (only when useAjaxRender is true)
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    if (!useAjaxRender) {
      return;
    }
    const fetchPosts = async () => {
      try {
        setIsLoading(true);

        // Use wp.apiFetch để tự động handle authentication
        const data = await window.wp.apiFetch({
          path: `/wp/v2/block-renderer/jankx/post-type-layout?context=edit`,
          method: 'POST',
          data: {
            attributes: debouncedAttributes
          }
        });
        if (data.rendered) {
          setCachedHtml(data.rendered);
        } else {
          setCachedHtml('<div class="placeholder">No content</div>');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setCachedHtml(`<div class="error">${error?.message || 'Error rendering block'}</div>`);
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [renderKey, useAjaxRender]); // Only fetch when useAjaxRender is true

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      group: "settings",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Query Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Query Preset', 'jankx'),
          value: queryPreset,
          options: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
            const allPresets = window.jankxQueryOptions?.queryPresets || [];
            // Filter presets based on postType:
            // - Common presets: postType is null (available for all post types)
            // - Specific presets: postType matches current postType
            return allPresets.filter(preset => !preset.postType || preset.postType === postType).map(preset => ({
              label: preset.label,
              value: preset.value
            }));
          }, [postType]),
          onChange: value => setAttributes({
            queryPreset: value
          }),
          help: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
            const allPresets = window.jankxQueryOptions?.queryPresets || [];
            const currentPreset = allPresets.find(p => p.value === queryPreset);
            return currentPreset?.help || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select a query preset', 'jankx');
          }, [queryPreset])
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Type', 'jankx'),
          value: postType,
          options: postTypeOptions,
          onChange: value => setAttributes({
            postType: value
          }),
          help: queryPreset === 'default' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select post type for the main query', 'jankx') : undefined
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Posts Per Page', 'jankx'),
          value: postsPerPage,
          onChange: value => setAttributes({
            postsPerPage: value || 10
          }),
          min: 1,
          max: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number of posts to display', 'jankx')
        }), postType === 'post' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Include Sticky Posts', 'jankx'),
          checked: includeStickyPosts,
          onChange: value => setAttributes({
            includeStickyPosts: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Include sticky posts in the query (disabled by default).', 'jankx')
        }), queryPreset !== 'default' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Order By', 'jankx'),
            value: orderBy,
            options: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
              const allOrderByOptions = window.jankxQueryOptions?.orderBy || [];
              // Filter order by options based on postType:
              // - Common options: postType is null (available for all post types)
              // - Specific options: postType matches current postType
              return allOrderByOptions.filter(option => !option.postType || option.postType === postType).map(option => ({
                label: option.label,
                value: option.value
              }));
            }, [postType]),
            onChange: value => {
              const allOrderByOptions = window.jankxQueryOptions?.orderBy || [];
              const selectedOption = allOrderByOptions.find(opt => opt.value === value);

              // Auto-set metaKey if option has metaKey property
              const updates = {
                orderBy: value
              };
              if (selectedOption?.metaKey) {
                updates.metaKey = selectedOption.metaKey;
                // Set orderBy to meta_value_num if value is numeric (like total_sales, _price)
                if (['total_sales', '_price'].includes(value)) {
                  updates.orderBy = 'meta_value_num';
                }
              }
              setAttributes(updates);
            },
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sort posts by which criteria', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Order', 'jankx'),
            value: order,
            options: window.jankxQueryOptions?.order || [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Descending', 'jankx'),
              value: 'DESC'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ascending', 'jankx'),
              value: 'ASC'
            }],
            onChange: value => setAttributes({
              order: value
            })
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Layout', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Layout Type', 'jankx'),
          value: layout,
          options: window.jankxSupportedPostTypeLayouts?.map(layout => ({
            label: layout.title,
            value: layout.name
          })) || [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Grid', 'jankx'),
            value: 'grid'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('List', 'jankx'),
            value: 'list'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Masonry', 'jankx'),
            value: 'masonry'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Card', 'jankx'),
            value: 'card'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Carousel', 'jankx'),
            value: 'carousel'
          }],
          onChange: value => setAttributes({
            layout: value
          })
        }), supportedOptions.includes('columns') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.ResponsiveControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Columns', 'jankx'),
          values: {
            desktop: columns,
            tablet: columnsTablet,
            mobile: columnsMobile
          },
          onChange: values => setAttributes({
            columns: values.desktop,
            columnsTablet: values.tablet,
            columnsMobile: values.mobile
          }),
          min: 1,
          max: 6,
          help: {
            desktop: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number of columns on large screens (>1024px)', 'jankx'),
            tablet: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number of columns on tablet (768px - 1024px)', 'jankx'),
            mobile: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number of columns on mobile (<768px)', 'jankx')
          }
        }), layout === 'carousel' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Slides To Scroll', 'jankx'),
            value: slidesToScroll !== null && slidesToScroll !== void 0 ? slidesToScroll : 1,
            onChange: value => setAttributes({
              slidesToScroll: value || 1
            }),
            min: 1,
            max: columns || 3,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number of slides to scroll at a time', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loop', 'jankx'),
            checked: loop !== null && loop !== void 0 ? loop : false,
            onChange: value => setAttributes({
              loop: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable infinite loop', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Autoplay', 'jankx'),
            checked: autoplay !== null && autoplay !== void 0 ? autoplay : false,
            onChange: value => setAttributes({
              autoplay: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Automatically advance slides', 'jankx')
          }), autoplay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Autoplay Delay (ms)', 'jankx'),
            value: autoplayDelay !== null && autoplayDelay !== void 0 ? autoplayDelay : 3000,
            onChange: value => setAttributes({
              autoplayDelay: value || 3000
            }),
            min: 1000,
            max: 10000,
            step: 500,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Time between autoplay transitions', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Arrows', 'jankx'),
            checked: showArrows !== null && showArrows !== void 0 ? showArrows : true,
            onChange: value => setAttributes({
              showArrows: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display navigation arrows', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Dots', 'jankx'),
            checked: showDots !== null && showDots !== void 0 ? showDots : true,
            onChange: value => setAttributes({
              showDots: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display pagination dots', 'jankx')
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display Options', 'jankx'),
        initialOpen: false,
        children: [supportedOptions.includes('showFeaturedImage') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Featured Image', 'jankx'),
            checked: showFeaturedImage,
            onChange: value => setAttributes({
              showFeaturedImage: value
            }),
            disabled: readOnlyOptions.includes('showFeaturedImage')
          }), showFeaturedImage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
            children: [supportedOptions.includes('thumbnailPosition') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Thumbnail Position', 'jankx'),
              value: thumbnailPosition || 'top',
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Top (Default)', 'jankx'),
                value: 'top'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bottom', 'jankx'),
                value: 'bottom'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Left', 'jankx'),
                value: 'left'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Right', 'jankx'),
                value: 'right'
              }],
              onChange: value => setAttributes({
                thumbnailPosition: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose where the featured image appears relative to the content.', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Image Aspect Ratio', 'jankx'),
              value: (() => {
                const presetRatios = ['16/9', '4/3', '21/9', '1/1', '3/4', '2/3', '9/16'];
                if (!imageRatio || imageRatio === '') {
                  return '';
                }
                if (presetRatios.includes(imageRatio)) {
                  return imageRatio;
                }
                return 'custom';
              })(),
              onChange: value => {
                if (value === 'custom') {
                  // Set to empty string to show TextControl, user will enter custom value
                  setAttributes({
                    imageRatio: ''
                  });
                } else {
                  setAttributes({
                    imageRatio: value || ''
                  });
                }
              },
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Set the aspect ratio for featured images', 'jankx'),
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Default (3:2)', 'jankx'),
                value: ''
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('16:9 (Landscape)', 'jankx'),
                value: '16/9'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('4:3 (Landscape)', 'jankx'),
                value: '4/3'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('21:9 (Ultra Wide)', 'jankx'),
                value: '21/9'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('1:1 (Square)', 'jankx'),
                value: '1/1'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('3:4 (Portrait)', 'jankx'),
                value: '3/4'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('2:3 (Portrait)', 'jankx'),
                value: '2/3'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('9:16 (Vertical)', 'jankx'),
                value: '9/16'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom', 'jankx'),
                value: 'custom'
              }]
            }), (() => {
              const presetRatios = ['16/9', '4/3', '21/9', '1/1', '3/4', '2/3', '9/16'];
              const selectValue = (() => {
                if (!imageRatio || imageRatio === '') {
                  return '';
                }
                if (presetRatios.includes(imageRatio)) {
                  return imageRatio;
                }
                return 'custom';
              })();

              // Show TextControl when "Custom" is selected or when ratio is not in preset list
              const isCustom = selectValue === 'custom' || imageRatio && imageRatio !== '' && !presetRatios.includes(imageRatio);
              return isCustom;
            })() && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom Ratio', 'jankx'),
              value: (() => {
                const presetRatios = ['16/9', '4/3', '21/9', '1/1', '3/4', '2/3', '9/16'];
                // If current value is a preset, show empty (user just selected Custom)
                if (!imageRatio || presetRatios.includes(imageRatio)) {
                  return '';
                }
                return imageRatio;
              })(),
              onChange: value => {
                // Validate format: should be "number/number" or empty
                const ratioPattern = /^\d+\/\d+$/;
                if (!value || ratioPattern.test(value)) {
                  setAttributes({
                    imageRatio: value || ''
                  });
                }
              },
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter aspect ratio in format: width/height (e.g., 16/9, 3/4)', 'jankx'),
              placeholder: "16/9"
            })]
          })]
        }), supportedOptions.includes('showTitle') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Title', 'jankx'),
          checked: showTitle,
          onChange: value => setAttributes({
            showTitle: value
          }),
          disabled: readOnlyOptions.includes('showTitle')
        }), supportedOptions.includes('showExcerpt') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Excerpt', 'jankx'),
            checked: showExcerpt,
            onChange: value => setAttributes({
              showExcerpt: value
            }),
            disabled: readOnlyOptions.includes('showExcerpt')
          }), showExcerpt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Excerpt Length', 'jankx'),
            value: excerptLength,
            onChange: value => setAttributes({
              excerptLength: value || 55
            }),
            min: 10,
            max: 200,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number of characters to display in excerpt', 'jankx')
          })]
        }), supportedOptions.includes('showDate') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Date', 'jankx'),
          checked: showDate,
          onChange: value => setAttributes({
            showDate: value
          }),
          disabled: readOnlyOptions.includes('showDate')
        }), supportedOptions.includes('showAuthor') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Author', 'jankx'),
          checked: showAuthor,
          onChange: value => setAttributes({
            showAuthor: value
          }),
          disabled: readOnlyOptions.includes('showAuthor')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable Pagination', 'jankx'),
          checked: enablePagination,
          onChange: value => setAttributes({
            enablePagination: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display pagination to paginate posts', 'jankx')
        }), enablePagination && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pagination Style', 'jankx'),
            value: paginationStyle,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Numbers', 'jankx'),
              value: 'numbers'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Simple (Prev/Next)', 'jankx'),
              value: 'simple'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Arrows', 'jankx'),
              value: 'arrows'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Load More', 'jankx'),
              value: 'load-more'
            }],
            onChange: value => setAttributes({
              paginationStyle: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose pagination display style', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pagination Alignment', 'jankx'),
            value: paginationAlignment,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Left', 'jankx'),
              value: 'left'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Center', 'jankx'),
              value: 'center'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Right', 'jankx'),
              value: 'right'
            }],
            onChange: value => setAttributes({
              paginationAlignment: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Align pagination position', 'jankx')
          }), paginationStyle === 'numbers' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show All Page Numbers', 'jankx'),
            checked: showPaginationNumbers,
            onChange: value => setAttributes({
              showPaginationNumbers: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show all page numbers instead of abbreviated', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Previous Button Text', 'jankx'),
            value: paginationPrevText,
            onChange: value => setAttributes({
              paginationPrevText: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Leave empty to use default text. Can use HTML/SVG.', 'jankx'),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Example: « Previous or <svg>...</svg>', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next Button Text', 'jankx'),
            value: paginationNextText,
            onChange: value => setAttributes({
              paginationNextText: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Leave empty to use default text. Can use HTML/SVG.', 'jankx'),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Example: Next » or <svg>...</svg>', 'jankx')
          })]
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Query Parameters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Offset', 'jankx'),
          value: offset,
          onChange: value => setAttributes({
            offset: value || 0
          }),
          min: 0,
          max: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Skip the first N posts', 'jankx')
        }), (orderBy === 'meta_value' || orderBy === 'meta_value_num') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Key', 'jankx'),
            value: metaKey,
            onChange: value => setAttributes({
              metaKey: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta key for sorting (required when using meta_value)', 'jankx'),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Example: price, views, rating', 'jankx')
          }), orderBy === 'meta_value' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Type', 'jankx'),
            value: metaType,
            options: window.jankxQueryOptions?.metaTypes || [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('-- Auto --', 'jankx'),
              value: ''
            }, {
              label: 'NUMERIC',
              value: 'NUMERIC'
            }],
            onChange: value => setAttributes({
              metaType: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Specify data type for accurate sorting', 'jankx')
          })]
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('🔧 Advanced Query Parameters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Query ID', 'jankx'),
          value: customQueryId,
          onChange: value => setAttributes({
            customQueryId: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Set a name for this query to apply final filters: jankx/post-layout/query-args/{query_id}', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Example: featured-posts, sidebar-posts', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormTokenField, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Status', 'jankx'),
          value: postStatus,
          suggestions: ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash', 'any'],
          onChange: tokens => setAttributes({
            postStatus: tokens
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post status to fetch (default: publish)', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Parent ID', 'jankx'),
          type: "number",
          value: postParent,
          onChange: value => setAttributes({
            postParent: parseInt(value) || 0
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter posts by parent ID (0 = all)', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Parent IDs (Include)', 'jankx'),
          value: postParentIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postParentIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Only fetch posts with parents in this list', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Example: 1, 2, 3', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Parent IDs (Exclude)', 'jankx'),
          value: postParentNotIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postParentNotIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Exclude posts with parents in this list', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Example: 4, 5, 6', 'jankx')
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('🔍 Keyword Search', 'jankx'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Search Keyword', 'jankx'),
          value: keyword,
          onChange: value => setAttributes({
            keyword: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Search by title, content, excerpt', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter keyword...', 'jankx')
        })
      }), queryPreset === 'custom' && authors.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('👤 Author Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormTokenField, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Authors (Include)', 'jankx'),
          value: authors.filter(a => authorIn.includes(a.id)).map(a => a.name),
          suggestions: authors.map(a => a.name),
          onChange: tokens => {
            const selectedIds = tokens.map(token => {
              const author = authors.find(a => a.name === token);
              return author?.id || 0;
            }).filter(id => id > 0);
            setAttributes({
              authorIn: selectedIds
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Only display posts from these authors', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormTokenField, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Authors (Exclude)', 'jankx'),
          value: authors.filter(a => authorNotIn.includes(a.id)).map(a => a.name),
          suggestions: authors.map(a => a.name),
          onChange: tokens => {
            const selectedIds = tokens.map(token => {
              const author = authors.find(a => a.name === token);
              return author?.id || 0;
            }).filter(id => id > 0);
            setAttributes({
              authorNotIn: selectedIds
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Exclude posts from these authors', 'jankx')
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('🔢 Post ID Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post IDs (Include)', 'jankx'),
          value: postIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Only display posts with these IDs (comma separated)', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Example: 1, 2, 3', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post IDs (Exclude)', 'jankx'),
          value: postNotIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postNotIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Exclude posts with these IDs (comma separated)', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Example: 4, 5, 6', 'jankx')
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('⚙️ Meta Query Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
          variant: "primary",
          onClick: () => {
            const newMetaQuery = [...metaQuery];
            newMetaQuery.push({
              key: '',
              value: '',
              compare: '='
            });
            setAttributes({
              metaQuery: newMetaQuery
            });
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('+ Add Meta Query', 'jankx')
        }), metaQuery.map((mq, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
          style: {
            marginTop: '15px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("strong", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Query', 'jankx'), " #", index + 1]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
              isDestructive: true,
              isSmall: true,
              onClick: () => {
                const newMetaQuery = metaQuery.filter((_, i) => i !== index);
                setAttributes({
                  metaQuery: newMetaQuery
                });
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Remove', 'jankx')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Key', 'jankx'),
            value: mq.key,
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              newMetaQuery[index].key = value;
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Example: price, rating, views', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Compare', 'jankx'),
            value: mq.compare,
            options: [{
              label: '= (Equal)',
              value: '='
            }, {
              label: '!= (Not Equal)',
              value: '!='
            }, {
              label: '> (Greater Than)',
              value: '>'
            }, {
              label: '>= (Greater or Equal)',
              value: '>='
            }, {
              label: '< (Less Than)',
              value: '<'
            }, {
              label: '<= (Less or Equal)',
              value: '<='
            }, {
              label: 'LIKE (Contains)',
              value: 'LIKE'
            }, {
              label: 'NOT LIKE (Not Contains)',
              value: 'NOT LIKE'
            }, {
              label: 'IN (In List)',
              value: 'IN'
            }, {
              label: 'NOT IN (Not In List)',
              value: 'NOT IN'
            }, {
              label: 'EXISTS (Exists)',
              value: 'EXISTS'
            }, {
              label: 'NOT EXISTS (Not Exists)',
              value: 'NOT EXISTS'
            }],
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              newMetaQuery[index].compare = value;
              setAttributes({
                metaQuery: newMetaQuery
              });
            }
          }), !['EXISTS', 'NOT EXISTS'].includes(mq.compare) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Value', 'jankx'),
            value: mq.value,
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              newMetaQuery[index].value = value;
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter value...', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Type (Optional)', 'jankx'),
            value: mq.type || '',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('-- Auto --', 'jankx'),
              value: ''
            }, {
              label: 'NUMERIC',
              value: 'NUMERIC'
            }, {
              label: 'CHAR',
              value: 'CHAR'
            }, {
              label: 'DATE',
              value: 'DATE'
            }, {
              label: 'DATETIME',
              value: 'DATETIME'
            }, {
              label: 'DECIMAL',
              value: 'DECIMAL'
            }, {
              label: 'SIGNED',
              value: 'SIGNED'
            }, {
              label: 'UNSIGNED',
              value: 'UNSIGNED'
            }],
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              newMetaQuery[index].type = value;
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Specify data type for accurate comparison', 'jankx')
          })]
        }, index))]
      }), queryPreset === 'custom' && taxonomies.length > 0 && taxonomies.map(taxonomy => {
        // Find existing query for this taxonomy
        const existingQueryIndex = taxQuery.findIndex(tq => tq.taxonomy === taxonomy.slug);
        const hasQuery = existingQueryIndex >= 0;
        const currentQuery = hasQuery ? taxQuery[existingQueryIndex] : null;
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
          title: `🏷️ ${taxonomy.name}`,
          initialOpen: hasQuery,
          onToggle: isOpen => {
            if (isOpen) {
              // Fetch terms when panel opens
              fetchTermsForTaxonomy(taxonomy.slug);
            }
          },
          children: !hasQuery ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
            variant: "secondary",
            onClick: () => {
              const newTaxQuery = [...taxQuery];
              newTaxQuery.push({
                taxonomy: taxonomy.slug,
                terms: [],
                operator: 'IN'
              });
              setAttributes({
                taxQuery: newTaxQuery
              });
              fetchTermsForTaxonomy(taxonomy.slug);
            },
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add Filter', 'jankx'), " ", taxonomy.name]
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Operator', 'jankx'),
              value: currentQuery.operator,
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('IN (Include)', 'jankx'),
                value: 'IN'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('NOT IN (Exclude)', 'jankx'),
                value: 'NOT IN'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('AND (Must Have All)', 'jankx'),
                value: 'AND'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('EXISTS (Has Terms)', 'jankx'),
                value: 'EXISTS'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('NOT EXISTS (No Terms)', 'jankx'),
                value: 'NOT EXISTS'
              }],
              onChange: value => {
                const newTaxQuery = [...taxQuery];
                newTaxQuery[existingQueryIndex].operator = value;
                setAttributes({
                  taxQuery: newTaxQuery
                });
              },
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('EXISTS/NOT EXISTS checks if taxonomy has any terms', 'jankx')
            }), !['EXISTS', 'NOT EXISTS'].includes(currentQuery.operator) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
              children: taxonomyTerms[taxonomy.slug] ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormTokenField, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select Terms', 'jankx'),
                value: taxonomyTerms[taxonomy.slug].filter(term => currentQuery.terms.includes(term.id)).map(term => term.name),
                suggestions: taxonomyTerms[taxonomy.slug].map(term => term.name),
                onChange: tokens => {
                  const selectedIds = tokens.map(token => {
                    const term = taxonomyTerms[taxonomy.slug].find(t => t.name === token);
                    return term?.id || 0;
                  }).filter(id => id > 0);
                  const newTaxQuery = [...taxQuery];
                  newTaxQuery[existingQueryIndex].terms = selectedIds;
                  setAttributes({
                    taxQuery: newTaxQuery
                  });
                },
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select terms from dropdown', 'jankx')
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, {})
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
              isDestructive: true,
              variant: "secondary",
              onClick: () => {
                const newTaxQuery = taxQuery.filter((_, i) => i !== existingQueryIndex);
                setAttributes({
                  taxQuery: newTaxQuery
                });
              },
              style: {
                marginTop: '10px'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Remove Filter', 'jankx')
            })]
          })
        }, taxonomy.slug);
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
      ...blockProps,
      children: useAjaxRender && isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Placeholder, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading posts...', 'jankx')
        })]
      }) : useAjaxRender && layout === 'carousel' && cachedHtml ?
      /*#__PURE__*/
      // Render carousel preview in editor using Embla Carousel React (AJAX mode)
      (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
        className: "post-type-layout-carousel-editor",
        ref: layout === 'carousel' ? emblaRef : undefined,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
          className: "embla__viewport",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
            className: "embla__container",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
              dangerouslySetInnerHTML: {
                __html: cachedHtml
              }
            })
          })
        }), showArrows !== false && emblaApi && layout === 'carousel' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("button", {
            className: "embla__button embla__button--prev",
            type: "button",
            onClick: () => emblaApi.scrollPrev(),
            "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Previous slide', 'jankx'),
            disabled: loop === false && !emblaApi.canScrollPrev(),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("path", {
                d: "M15 18l-6-6 6-6"
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("button", {
            className: "embla__button embla__button--next",
            type: "button",
            onClick: () => emblaApi.scrollNext(),
            "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next slide', 'jankx'),
            disabled: loop === false && !emblaApi.canScrollNext(),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("path", {
                d: "M9 18l6-6-6-6"
              })
            })
          })]
        })]
      }) : useAjaxRender && cachedHtml ?
      /*#__PURE__*/
      // AJAX mode - render cached HTML
      (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
        dangerouslySetInnerHTML: {
          __html: cachedHtml
        }
      }) :
      /*#__PURE__*/
      // Default: Use ServerSideRender (SSR) - better UX, no loading state
      (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
        className: layout === 'carousel' ? 'post-type-layout-carousel-editor' : '',
        children: [layout === 'carousel' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
          ref: emblaRef,
          className: "embla__viewport",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)((_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6___default()), {
            block: "jankx/post-type-layout",
            attributes: attributes,
            EmptyResponsePlaceholder: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Placeholder, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("p", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No posts found.', 'jankx')
              })
            })
          })
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)((_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6___default()), {
          block: "jankx/post-type-layout",
          attributes: attributes,
          EmptyResponsePlaceholder: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Placeholder, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No posts found.', 'jankx')
            })
          })
        }), layout === 'carousel' && showArrows !== false && emblaApi && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("button", {
            className: "embla__button embla__button--prev",
            type: "button",
            onClick: () => emblaApi.scrollPrev(),
            "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Previous slide', 'jankx'),
            disabled: loop === false && !emblaApi.canScrollPrev(),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("path", {
                d: "M15 18l-6-6 6-6"
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("button", {
            className: "embla__button embla__button--next",
            type: "button",
            onClick: () => emblaApi.scrollNext(),
            "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next slide', 'jankx'),
            disabled: loop === false && !emblaApi.canScrollNext(),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("path", {
                d: "M9 18l6-6-6-6"
              })
            })
          })]
        })]
      })
    })]
  });
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_9__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_9__,
  edit: Edit,
  save: () => null // Server-side rendering
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map
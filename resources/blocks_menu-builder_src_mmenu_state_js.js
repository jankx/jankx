"use strict";
(self["webpackChunkjankx"] = self["webpackChunkjankx"] || []).push([["blocks_menu-builder_src_mmenu_state_js"],{

/***/ "./blocks/menu-builder/src/_modules/helpers.ts":
/*!*****************************************************!*\
  !*** ./blocks/menu-builder/src/_modules/helpers.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cloneId: () => (/* binding */ cloneId),
/* harmony export */   extend: () => (/* binding */ extend),
/* harmony export */   originalId: () => (/* binding */ originalId),
/* harmony export */   touchDirection: () => (/* binding */ touchDirection),
/* harmony export */   type: () => (/* binding */ type),
/* harmony export */   uniqueId: () => (/* binding */ uniqueId)
/* harmony export */ });
/**
 * Deep extend an object with the given defaults.
 * Note that the extended object is not a clone, meaning the original object will also be updated.
 *
 * @param 	{object}	orignl	The object to extend to.
 * @param 	{object}	dfault	The object to extend from.
 * @return	{object}			The extended "orignl" object.
 */
const extend = (orignl, dfault) => {
  if (type(orignl) != 'object') {
    orignl = {};
  }
  if (type(dfault) != 'object') {
    dfault = {};
  }
  for (let k in dfault) {
    if (!dfault.hasOwnProperty(k)) {
      continue;
    }
    if (typeof orignl[k] == 'undefined') {
      orignl[k] = dfault[k];
    } else if (type(orignl[k]) == 'object') {
      extend(orignl[k], dfault[k]);
    }
  }
  return orignl;
};

/**
 * Detect the touch / dragging direction on a touch device.
 *
 * @param   {HTMLElement} surface   The element to monitor for touch events.
 * @return  {object}                Object with "get" function.
 */
const touchDirection = surface => {
  let direction = '';
  let prevPosition = null;
  surface.addEventListener('touchstart', evnt => {
    if (evnt.touches.length === 1) {
      direction = '';
      prevPosition = evnt.touches[0].pageY;
    }
  });
  surface.addEventListener('touchend', evnt => {
    if (evnt.touches.length === 0) {
      direction = '';
      prevPosition = null;
    }
  });
  surface.addEventListener('touchmove', evnt => {
    direction = '';
    if (prevPosition && evnt.touches.length === 1) {
      const currentPosition = evnt.changedTouches[0].pageY;
      if (currentPosition > prevPosition) {
        direction = 'down';
      } else if (currentPosition < prevPosition) {
        direction = 'up';
      }
      prevPosition = currentPosition;
    }
  });
  return {
    get: () => direction
  };
};

/**
 * Get the type of any given variable. Improvement of "typeof".
 *
 * @param 	{any}		variable	The variable.
 * @return	{string}				The type of the variable in lowercase.
 */
const type = variable => {
  return {}.toString.call(variable).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

/**
 * Get a (page wide) unique ID.
 */
const uniqueId = () => {
  return `mm-${__id++}`;
};
let __id = 0;

/**
 * Get a prefixed ID from a possibly orifinal ID.
 * @param id The possibly original ID.
 */
const cloneId = id => {
  if (id.slice(0, 9) == 'mm-clone-') {
    return id;
  }
  return `mm-clone-${id}`;
};

/**
 * Get the original ID from a possibly prefixed ID.
 * @param id The possibly prefixed ID.
 */
const originalId = id => {
  if (id.slice(0, 9) == 'mm-clone-') {
    return id.slice(9);
  }
  return id;
};

/***/ }),

/***/ "./blocks/menu-builder/src/_modules/i18n.ts":
/*!**************************************************!*\
  !*** ./blocks/menu-builder/src/_modules/i18n.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   show: () => (/* binding */ show)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./blocks/menu-builder/src/_modules/helpers.ts");

const translations = {};

/**
 * Show all translations.
 * @return {object}	The translations.
 */
const show = () => {
  return translations;
};

/**
 * Add translations to a language.
 * @param {object}  text        Object of key/value translations.
 * @param {string}  language    The translated language.
 */
const add = (text, language) => {
  if (typeof translations[language] === 'undefined') {
    translations[language] = {};
  }
  (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.extend)(translations[language], text);
};

/**
 * Find a translated text in a language.
 * @param   {string} text       The text to find the translation for.
 * @param   {string} language   The language to search in.
 * @return  {string}            The translated text.
 */
const get = (text, language) => {
  if (typeof language === 'string' && typeof translations[language] !== 'undefined') {
    return translations[language][text] || text;
  }
  return text;
};

/***/ }),

/***/ "./blocks/menu-builder/src/_modules/matchmedia.ts":
/*!********************************************************!*\
  !*** ./blocks/menu-builder/src/_modules/matchmedia.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   fire: () => (/* binding */ fire),
/* harmony export */   watch: () => (/* binding */ watch)
/* harmony export */ });
/** Collection of callback functions for media querys. */
let listeners = {};

/**
 * Bind functions to a matchMedia listener (subscriber).
 *
 * @param {string|number} 	query 	Media query to match or number for min-width.
 * @param {function} 		yes 	Function to invoke when the media query matches.
 * @param {function} 		no 		Function to invoke when the media query doesn't match.
 */
const add = (query, yes, no) => {
  if (typeof query == 'number') {
    query = '(min-width: ' + query + 'px)';
  }
  listeners[query] = listeners[query] || [];
  listeners[query].push({
    yes,
    no
  });
};

/**
 * Initialize the matchMedia listener.
 */
const watch = () => {
  for (let query in listeners) {
    let mqlist = window.matchMedia(query);
    fire(query, mqlist);
    mqlist.onchange = evnt => {
      fire(query, mqlist);
    };
  }
};

/**
 * Invoke the "yes" or "no" function for a matchMedia listener (publisher).
 *
 * @param {string} 			query 	Media query to check for.
 * @param {MediaQueryList} 	mqlist 	Media query list to check with.
 */
const fire = (query, mqlist) => {
  var fn = mqlist.matches ? 'yes' : 'no';
  for (let m = 0; m < listeners[query].length; m++) {
    listeners[query][m][fn]();
  }
};

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/configs.ts":
/*!**********************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/configs.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const configs = {
  classNames: {
    divider: 'Divider',
    nolistview: 'NoListview',
    nopanel: 'NoPanel',
    panel: 'Panel',
    selected: 'Selected',
    vertical: 'Vertical'
  },
  language: null,
  panelNodetype: ['ul', 'ol', 'div'],
  screenReader: {
    closeSubmenu: 'Close submenu',
    openSubmenu: 'Open submenu',
    toggleSubmenu: 'Toggle submenu'
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (configs);

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/mmenu.oncanvas.state.ts":
/*!***********************************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/mmenu.oncanvas.state.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MmenuState)
/* harmony export */ });
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./options */ "./blocks/menu-builder/src/core/oncanvas/options.ts");
/* harmony import */ var _configs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./configs */ "./blocks/menu-builder/src/core/oncanvas/configs.ts");
/* harmony import */ var _translations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./translations */ "./blocks/menu-builder/src/core/oncanvas/translations/index.ts");
/* harmony import */ var _modules_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../_modules/dom */ "./blocks/menu-builder/src/_modules/dom.ts");
/* harmony import */ var _modules_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../_modules/i18n */ "./blocks/menu-builder/src/_modules/i18n.ts");
/* harmony import */ var _modules_matchmedia__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../_modules/matchmedia */ "./blocks/menu-builder/src/_modules/matchmedia.ts");
/* harmony import */ var _modules_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../_modules/helpers */ "./blocks/menu-builder/src/_modules/helpers.ts");
/* harmony import */ var _state_state_manager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../state/state-manager */ "./blocks/menu-builder/src/core/state/state-manager.ts");
/* harmony import */ var _state_dom_controller__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../state/dom-controller */ "./blocks/menu-builder/src/core/state/dom-controller.ts");
/* harmony import */ var _state_observer_controller_fixed__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../state/observer-controller-fixed */ "./blocks/menu-builder/src/core/state/observer-controller-fixed.ts");











//  Add the translations.
(0,_translations__WEBPACK_IMPORTED_MODULE_2__["default"])();

/**
 * Class for a mobile menu with state management.
 */
class MmenuState {
  /**	Available add-ons for the plugin. */
  static addons = {};

  /**	Globally used HTML elements. */
  static node = {};

  /** Globally used variables. */
  static vars = {};

  /** State manager instance */

  /** DOM controller instance */

  /** Observer controller instance */

  /**	Options for the menu. */

  /** Configuration for the menu. */

  /**	Array of method names to expose in the API. */

  /** The API. */

  /** HTML elements used for the menu. */

  /** Callback hooks used for the menu. */

  /** Set the menu theme. */

  /** Log deprecated warnings when using the debugger. */

  //	offCanvas add-on
  /** Open the menu. */

  /** Close the menu. */

  /** Set the page HTML element. */

  /**
   * Create a mobile menu with state management.
   * @param {HTMLElement|string} 	menu		The menu node.
   * @param {object} 				[option]	Options for the menu.
   * @param {object} 				[configs]	Configuration options for the menu.
   */
  constructor(menu, options, configs) {
    //	Extend options and configuration from defaults.
    this.opts = (0,_modules_helpers__WEBPACK_IMPORTED_MODULE_6__.extend)(options, _options__WEBPACK_IMPORTED_MODULE_0__["default"]);
    this.conf = (0,_modules_helpers__WEBPACK_IMPORTED_MODULE_6__.extend)(configs, _configs__WEBPACK_IMPORTED_MODULE_1__["default"]);

    //	Initialize state management
    this.stateManager = new _state_state_manager__WEBPACK_IMPORTED_MODULE_7__.MmenuStateManager(this.opts, this.conf);
    this.domController = new _state_dom_controller__WEBPACK_IMPORTED_MODULE_8__.DOMController(this.stateManager);
    this.observerController = new _state_observer_controller_fixed__WEBPACK_IMPORTED_MODULE_9__.ObserverController(this.stateManager);

    //	Methods to expose in the API.
    this._api = ['i18n', 'bind', 'openPanel', 'closePanel', 'setSelected', 'getState', 'setState', 'reset', 'destroy'];

    //	Storage objects for nodes and hooks.
    this.node = {};
    this.hook = {};

    //	Get menu node from string or element.
    this.node.menu = typeof menu == 'string' ? document.querySelector(menu) : menu;
    if (typeof this._deprecatedWarnings == 'function') {
      this._deprecatedWarnings();
    }
    this.trigger('init:before');
    this._initMenu();
    this._initAddons();
    this._initHooks();
    this._initAPI();
    this._initPanels();
    this._initOpened();
    _modules_matchmedia__WEBPACK_IMPORTED_MODULE_5__.watch();
    this.trigger('init:after');
    return this;
  }

  /**
   * Open a panel.
   * @param {HTMLElement} panel               Panel to open.
   * @param {boolean}     [animation=true]    Whether or not to use an animation.
   * @param {boolean}     [setfocus=true]     Whether or not to set focus to the panel.
   */
  openPanel(panel, animation = true, setfocus = true) {
    //	Find panel.
    if (!panel) {
      return;
    }
    panel = panel.closest('.mm-panel');
    if (!panel) {
      return;
    }

    //	Invoke "before" hook.
    this.trigger('openPanel:before', [panel, {
      animation,
      setfocus
    }]);

    // Handle vertical panels
    const listitem = panel.closest('.mm-listitem--vertical');
    if (listitem) {
      // Toggle vertical panel
      this.stateManager.openPanel(panel.id, animation);
      const parent = listitem.closest('.mm-panel');
      if (parent) {
        this.openPanel(parent, animation, setfocus);
      }
    } else {
      // Handle horizontal panels
      this.stateManager.openPanel(panel.id, animation);
    }

    // Set focus if requested
    if (setfocus) {
      const currentPanelElement = this.node.menu.querySelector(`#${panel.id}`);
      if (currentPanelElement) {
        currentPanelElement.focus();
      }
    }

    //	Invoke "after" hook.
    this.trigger('openPanel:after', [panel, {
      animation,
      setfocus
    }]);
  }

  /**
   * Close a panel.
   * @param {HTMLElement} panel               Panel to close.
   * @param {boolean}     [animation=true]    Whether or not to use an animation.
   * @param {boolean}     [setfocus=true]     Whether or not to set focus to the panel.
   */
  closePanel(panel, animation = true, setfocus = true) {
    if (!panel) {
      return;
    }
    const state = this.stateManager.getState();
    const isPanelOpened = state.openedPanels.includes(panel.id);
    const isVerticalOpened = panel.parentElement?.matches('.mm-listitem--opened');
    if (!isPanelOpened && !isVerticalOpened) {
      return;
    }

    //	Invoke "before" hook.
    this.trigger('closePanel:before', [panel]);

    // Handle vertical panels
    if (panel.parentElement?.matches('.mm-listitem--vertical')) {
      this.stateManager.closePanel(panel.id, animation);
    } else {
      // Handle horizontal panels
      this.stateManager.closePanel(panel.id, animation);
    }

    // Set focus if requested
    if (setfocus) {
      const currentState = this.stateManager.getState();
      if (currentState.currentPanel) {
        const currentPanelElement = this.node.menu.querySelector(`#${currentState.currentPanel}`);
        if (currentPanelElement) {
          currentPanelElement.focus();
        }
      }
    }

    //	Invoke "after" hook.
    this.trigger('closePanel:after', [panel]);
  }

  /**
   * Toggle a panel opened/closed.
   * @param {HTMLElement} panel Panel to open or close.
   */
  togglePanel(panel) {
    const state = this.stateManager.getState();
    const isPanelOpened = state.openedPanels.includes(panel.id);
    const isVerticalOpened = panel.parentElement?.matches('.mm-listitem--opened');
    if (isPanelOpened || isVerticalOpened) {
      this.closePanel(panel);
    } else {
      this.openPanel(panel);
    }
  }

  /**
   * Display a listitem as being "selected".
   * @param {HTMLElement} listitem Listitem to mark.
   */
  setSelected(listitem) {
    if (!listitem.id) {
      listitem.id = (0,_modules_helpers__WEBPACK_IMPORTED_MODULE_6__.uniqueId)();
    }

    //	Invoke "before" hook.
    this.trigger('setSelected:before', [listitem]);

    // Use state manager to update selection
    this.stateManager.setSelected(listitem.id);

    //	Invoke "after" hook.
    this.trigger('setSelected:after', [listitem]);
  }

  /**
   * Bind functions to a hook (subscriber).
   * @param {string} 		hook The hook.
   * @param {function} 	func The function.
   */
  bind(hook, func) {
    this.stateManager.addHook(hook, func);
  }

  /**
   * Invoke the functions bound to a hook (publisher).
   * @param {string} 	hook  	The hook.
   * @param {array}	[args] 	Arguments for the function.
   */
  trigger(hook, args) {
    this.stateManager.triggerHooks(hook, args);
  }

  /**
   * Get current state
   */
  getState() {
    return this.stateManager.getState();
  }

  /**
   * Set state with updates
   */
  setState(updates) {
    this.stateManager.setState(updates);
  }

  /**
   * Reset menu to initial state
   */
  reset() {
    this.stateManager.reset();
    this._initOpened();
  }

  /**
   * Destroy menu and clean up resources
   */
  destroy() {
    // Trigger destroy hook
    this.trigger('destroy:before');

    // Clean up controllers
    this.domController.destroy();
    this.observerController.destroy();
    this.stateManager.destroy();

    // Clean up DOM
    if (this.node.menu) {
      // Remove event listeners
      this.node.menu.removeEventListener('click', this._handlePanelClick);

      // Remove mm classes
      this.node.menu.classList.remove('mm-menu');
      this.node.wrpr?.classList.remove('mm-wrapper');
      this.node.wrpr?.classList.remove('mm-wrapper--open');
    }

    // Clear API
    this.API = {};
    delete this.node.menu['mmApi'];

    // Trigger destroy hook
    this.trigger('destroy:after');
  }

  /**
   * Initialize the menu.
   */
  _initMenu() {
    //	Invoke "before" hook.
    this.trigger('initMenu:before');

    //	Add class to the wrapper.
    this.node.wrpr = this.node.wrpr || this.node.menu.parentElement;
    this.node.wrpr.classList.add('mm-wrapper');

    //	Add class to the menu.
    this.node.menu.classList.add('mm-menu');

    //	Add an ID to the menu if it does not yet have one.
    this.node.menu.id = this.node.menu.id || (0,_modules_helpers__WEBPACK_IMPORTED_MODULE_6__.uniqueId)();
    this.node.menu.setAttribute('aria-label', this.i18n(this.opts.navbar.title || 'Menu'));
    this.node.menu.setAttribute('aria-modal', 'true');
    this.node.menu.setAttribute('role', 'dialog');

    /** All panel nodes in the menu. */
    const panels = _modules_dom__WEBPACK_IMPORTED_MODULE_3__.children(this.node.menu).filter(panel => panel.matches(this.conf.panelNodetype.join(', ')));

    //	Wrap the panels in a node.
    this.node.pnls = _modules_dom__WEBPACK_IMPORTED_MODULE_3__.create('div.mm-panels');
    this.node.menu.append(this.node.pnls);

    //  Initiate all panel like nodes
    panels.forEach(panel => {
      this._initPanel(panel);
    });

    // Initialize controllers with elements
    this.domController.initializeElements(this.node.menu, this.node.pnls);
    this.observerController.initialize();

    //	Invoke "after" hook.
    this.trigger('initMenu:after');
  }

  /**
   * Initialize panels.
   */
  _initPanels() {
    //	Invoke "before" hook.
    this.trigger('initPanels:before');

    //	Open / close panels.
    this.node.menu.addEventListener('click', this._handlePanelClick.bind(this), {
      capture: true
    });

    //	Invoke "after" hook.
    this.trigger('initPanels:after');
  }

  /**
   * Handle panel click events
   */
  _handlePanelClick(event) {
    const target = event.target;
    const anchor = target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    if (href.slice(0, 1) === '#') {
      try {
        const panel = _modules_dom__WEBPACK_IMPORTED_MODULE_3__.find(this.node.menu, href)[0];
        if (panel) {
          event.preventDefault();
          this.togglePanel(panel);
        }
      } catch (err) {
        // Ignore invalid selectors
      }
    }
  }

  /**
   * Initialize a single panel.
   * @param  {HTMLElement} 		panel 	Panel to initialize.
   * @return {HTMLElement|null} 			Initialized panel.
   */
  _initPanel(panel) {
    // Delegate to observer controller
    this.observerController['initializePanel'](panel);
    return panel;
  }

  /**
   * Initialize all available add-ons.
   */
  _initAddons() {
    //	Invoke "before" hook.
    this.trigger('initAddons:before');
    for (let addon in MmenuState.addons) {
      MmenuState.addons[addon].call(this);
    }

    //	Invoke "after" hook.
    this.trigger('initAddons:after');
  }

  /**
   * Bind the hooks specified in the options (publisher).
   */
  _initHooks() {
    for (let hook in this.opts.hooks) {
      this.bind(hook, this.opts.hooks[hook]);
    }
  }

  /**
   * Create the API.
   */
  _initAPI() {
    const that = this;
    this.API = {};
    this._api.forEach(fn => {
      this.API[fn] = function () {
        return that[fn].apply(that, arguments);
      };
    });

    //	Store the API in the HTML node for external usage.
    this.node.menu['mmApi'] = this.API;
  }

  /**
   * Find and open the correct panel after creating the menu.
   */
  _initOpened() {
    //	Invoke "before" hook.
    this.trigger('initOpened:before');

    // Let DOM controller handle initial state
    // This is now handled in DOMController.initializeElements()

    //	Invoke "after" hook.
    this.trigger('initOpened:after');
  }

  /**
   * Get the translation for a text.
   * @param  {string}     text 	Text to translate.
   * @return {string}		        The translated text.
   */
  i18n(text) {
    return _modules_i18n__WEBPACK_IMPORTED_MODULE_4__.get(text, this.conf.language);
  }

  /**
   * Get all translations for the given language.
   * @return {object}	The translations.
   */
  static i18n(text = {}, language = '') {
    if (text && language) {
      _modules_i18n__WEBPACK_IMPORTED_MODULE_4__.add(text, language);
    } else {
      return _modules_i18n__WEBPACK_IMPORTED_MODULE_4__.show();
    }
  }
}

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/options.ts":
/*!**********************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/options.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const options = {
  hooks: {},
  navbar: {
    add: true,
    title: 'Menu',
    titleLink: 'parent'
  },
  slidingSubmenus: true
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (options);

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/translations/de.ts":
/*!******************************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/translations/de.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  'Close submenu': 'Untermenü schließen',
  'Menu': 'Menü',
  'Open submenu': 'Untermenü öffnen',
  'Toggle submenu': 'Untermenü wechseln'
});

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/translations/fa.ts":
/*!******************************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/translations/fa.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  'Close submenu': 'بستن زیرمنو',
  'Menu': 'منو',
  'Open submenu': 'بازکردن زیرمنو',
  'Toggle submenu': 'سوییچ زیرمنو'
});

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/translations/index.ts":
/*!*********************************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/translations/index.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../_modules/i18n */ "./blocks/menu-builder/src/_modules/i18n.ts");
/* harmony import */ var _de__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./de */ "./blocks/menu-builder/src/core/oncanvas/translations/de.ts");
/* harmony import */ var _fa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fa */ "./blocks/menu-builder/src/core/oncanvas/translations/fa.ts");
/* harmony import */ var _nl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nl */ "./blocks/menu-builder/src/core/oncanvas/translations/nl.ts");
/* harmony import */ var _pt_br__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pt_br */ "./blocks/menu-builder/src/core/oncanvas/translations/pt_br.ts");
/* harmony import */ var _ru__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ru */ "./blocks/menu-builder/src/core/oncanvas/translations/ru.ts");
/* harmony import */ var _sk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sk */ "./blocks/menu-builder/src/core/oncanvas/translations/sk.ts");
/* harmony import */ var _uk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./uk */ "./blocks/menu-builder/src/core/oncanvas/translations/uk.ts");








/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  (0,_modules_i18n__WEBPACK_IMPORTED_MODULE_0__.add)(_de__WEBPACK_IMPORTED_MODULE_1__["default"], 'de');
  (0,_modules_i18n__WEBPACK_IMPORTED_MODULE_0__.add)(_fa__WEBPACK_IMPORTED_MODULE_2__["default"], 'fa');
  (0,_modules_i18n__WEBPACK_IMPORTED_MODULE_0__.add)(_nl__WEBPACK_IMPORTED_MODULE_3__["default"], 'nl');
  (0,_modules_i18n__WEBPACK_IMPORTED_MODULE_0__.add)(_pt_br__WEBPACK_IMPORTED_MODULE_4__["default"], 'pt_br');
  (0,_modules_i18n__WEBPACK_IMPORTED_MODULE_0__.add)(_ru__WEBPACK_IMPORTED_MODULE_5__["default"], 'ru');
  (0,_modules_i18n__WEBPACK_IMPORTED_MODULE_0__.add)(_sk__WEBPACK_IMPORTED_MODULE_6__["default"], 'sk');
  (0,_modules_i18n__WEBPACK_IMPORTED_MODULE_0__.add)(_uk__WEBPACK_IMPORTED_MODULE_7__["default"], 'uk');
}

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/translations/nl.ts":
/*!******************************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/translations/nl.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  'Close submenu': 'Submenu sluiten',
  'Menu': 'Menu',
  'Open submenu': 'Submenu openen',
  'Toggle submenu': 'Submenu wisselen'
});

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/translations/pt_br.ts":
/*!*********************************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/translations/pt_br.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  'Close submenu': 'Fechar submenu',
  'Menu': 'Menu',
  'Open submenu': 'Abrir submenu',
  'Toggle submenu': 'Alternar submenu'
});

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/translations/ru.ts":
/*!******************************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/translations/ru.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  'Close submenu': 'Закрыть подменю',
  'Menu': 'Меню',
  'Open submenu': 'Открыть подменю',
  'Toggle submenu': 'Переключить подменю'
});

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/translations/sk.ts":
/*!******************************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/translations/sk.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  'Close submenu': 'Zatvoriť submenu',
  'Menu': 'Menu',
  'Open submenu': 'Otvoriť submenu',
  'Toggle submenu': 'Prepnúť submenu'
});

/***/ }),

/***/ "./blocks/menu-builder/src/core/oncanvas/translations/uk.ts":
/*!******************************************************************!*\
  !*** ./blocks/menu-builder/src/core/oncanvas/translations/uk.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  'Close submenu': 'Закрити підменю',
  'Menu': 'Меню',
  'Open submenu': 'Відкрити підменю',
  'Toggle submenu': 'Перемкнути підменю'
});

/***/ }),

/***/ "./blocks/menu-builder/src/mmenu.state.js":
/*!************************************************!*\
  !*** ./blocks/menu-builder/src/mmenu.state.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_oncanvas_mmenu_oncanvas_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/oncanvas/mmenu.oncanvas.state */ "./blocks/menu-builder/src/core/oncanvas/mmenu.oncanvas.state.ts");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/core/offcanvas/mmenu.offcanvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/core/scrollbugfix/mmenu.scrollbugfix'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/core/theme/mmenu.theme'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/backbutton/mmenu.backbutton'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/counters/mmenu.counters'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/iconbar/mmenu.iconbar'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/iconpanels/mmenu.iconpanels'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/navbars/mmenu.navbars'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/pagescroll/mmenu.pagescroll'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/searchfield/mmenu.searchfield'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/sectionindexer/mmenu.sectionindexer'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/setselected/mmenu.setselected'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/sidebar/mmenu.sidebar'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/*!
 * mmenu.js - State Management Version
 * mmenujs.com
 *
 * Copyright (c) Fred Heusschen
 * frebsite.nl
 */

//	Core - State Management Version


//	Core add-ons




//	Add-ons










_core_oncanvas_mmenu_oncanvas_state__WEBPACK_IMPORTED_MODULE_0__["default"].addons = {
  //	Core add-ons
  offcanvas: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/core/offcanvas/mmenu.offcanvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  scrollBugFix: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/core/scrollbugfix/mmenu.scrollbugfix'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  theme: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/core/theme/mmenu.theme'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  //	Add-ons
  backButton: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/backbutton/mmenu.backbutton'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  counters: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/counters/mmenu.counters'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  iconbar: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/iconbar/mmenu.iconbar'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  iconPanels: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/iconpanels/mmenu.iconpanels'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  navbars: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/navbars/mmenu.navbars'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  pageScroll: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/pagescroll/mmenu.pagescroll'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  searchfield: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/searchfield/mmenu.searchfield'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  sectionIndexer: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/sectionindexer/mmenu.sectionindexer'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  setSelected: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/setselected/mmenu.setselected'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
  sidebar: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../dist/addons/sidebar/mmenu.sidebar'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())
};

//  Export module
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core_oncanvas_mmenu_oncanvas_state__WEBPACK_IMPORTED_MODULE_0__["default"]);

//	Global namespace
if (window) {
  window.MmenuState = _core_oncanvas_mmenu_oncanvas_state__WEBPACK_IMPORTED_MODULE_0__["default"];
}

/***/ })

}]);
//# sourceMappingURL=blocks_menu-builder_src_mmenu_state_js.js.map
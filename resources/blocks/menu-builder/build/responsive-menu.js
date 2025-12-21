/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/menu-builder/src/_modules/dom.ts":
/*!*************************************************!*\
  !*** ./blocks/menu-builder/src/_modules/dom.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   childText: () => (/* binding */ childText),
/* harmony export */   children: () => (/* binding */ children),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   filterLI: () => (/* binding */ filterLI),
/* harmony export */   filterLIA: () => (/* binding */ filterLIA),
/* harmony export */   find: () => (/* binding */ find),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   parents: () => (/* binding */ parents),
/* harmony export */   prevAll: () => (/* binding */ prevAll),
/* harmony export */   reClass: () => (/* binding */ reClass),
/* harmony export */   text: () => (/* binding */ text)
/* harmony export */ });
/**
 * Create an element with classname.
 *
 * @param 	{string}		selector	The nodeName and classnames for the element to create.
 * @return	{HTMLElement}				The created element.
 */
const create = selector => {
  const args = selector.split('.'),
    elem = document.createElement(args.shift());
  elem.classList.add(...args);
  return elem;
};

/**
 * Find all elements matching the selector.
 * Basically the same as element.querySelectorAll() but it returns an actuall array.
 *
 * @param 	{HTMLElement} 	element Element to search in.
 * @param 	{string}		filter	The filter to match.
 * @return	{array}					Array of elements that match the filter.
 */
const find = (element, filter) => {
  return filter.length ? [].slice.call(element.querySelectorAll(filter)) : [];
};

/**
 * Find all child elements matching the (optional) selector.
 *
 * @param 	{HTMLElement} 	element Element to search in.
 * @param 	{string}		filter	The filter to match.
 * @return	{array}					Array of child elements that match the filter.
 */
const children = (element, filter) => {
  const children = Array.prototype.slice.call(element.children);
  return filter ? children.filter(child => child.matches(filter)) : children;
};

/**
 * Find all text from direct child element.
 *
 * @param 	{HTMLElement} 	element Element to search in.
 * @return	{string}				The text.
 */
const childText = element => {
  return element ? [].slice.call(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.nodeValue.trim()).join(' ') : '';
};

/**
 * Find text excluding text from within child elements.
 * @param   {HTMLElement}   element Element to search in.
 * @return  {string}                The text.
 */
const text = element => {
  return [].slice.call(element.childNodes).filter(child => !child.ariaHidden).map(child => child.textContent).join(' ');
};

/**
 * Find all preceding elements matching the selector.
 *
 * @param 	{HTMLElement} 	element Element to start searching from.
 * @param 	{string}		filter	The filter to match.
 * @return	{array}					Array of preceding elements that match the selector.
 */
const parents = (element, filter) => {
  /** Array of preceding elements that match the selector. */
  let parents = [];

  /** Array of preceding elements that match the selector. */
  let parent = element.parentElement;
  while (parent) {
    parents.push(parent);
    parent = parent.parentElement;
  }
  return filter ? parents.filter(parent => parent.matches(filter)) : parents;
};

/**
 * Find all previous siblings matching the selecotr.
 *
 * @param 	{HTMLElement} 	element Element to start searching from.
 * @param 	{string}		filter	The filter to match.
 * @return	{array}					Array of previous siblings that match the selector.
 */
const prevAll = (element, filter) => {
  /** Array of previous siblings that match the selector. */
  let previous = [];

  /** Current element in the loop */
  let current = element.previousElementSibling;
  while (current) {
    if (!filter || current.matches(filter)) {
      previous.push(current);
    }
    current = current.previousElementSibling;
  }
  return previous;
};

/**
 * Get an element offset relative to the document.
 *
 * @param 	{HTMLElement}	 element 			Element to start measuring from.
 * @param 	{string}		 [direction=top] 	Offset top or left.
 * @return	{number}							The element offset relative to the document.
 */
const offset = (element, direction) => {
  return element.getBoundingClientRect()[direction] + document.body[direction === 'left' ? 'scrollLeft' : 'scrollTop'];
};

/**
 * Filter out non-listitem listitems.
 * @param  {array} listitems 	Elements to filter.
 * @return {array}				The filtered set of listitems.
 */
const filterLI = listitems => {
  return listitems.filter(listitem => !listitem.matches('.mm-hidden'));
};

/**
 * Find anchors in listitems (excluding anchor that open a sub-panel).
 * @param  {array} 	listitems 	Elements to filter.
 * @return {array}				The found set of anchors.
 */
const filterLIA = listitems => {
  let anchors = [];
  filterLI(listitems).forEach(listitem => {
    anchors.push(...children(listitem, 'a.mm-listitem__text'));
  });
  return anchors.filter(anchor => !anchor.matches('.mm-btn--next'));
};

/**
 * Refactor a classname on multiple elements.
 * @param {HTMLElement} element 	Element to refactor.
 * @param {string}		oldClass 	Classname to remove.
 * @param {string}		newClass 	Classname to add.
 */
const reClass = (element, oldClass, newClass) => {
  if (element.matches('.' + oldClass)) {
    element.classList.add(newClass);
  }
};

/***/ }),

/***/ "./blocks/menu-builder/src/core/state/dom-controller.ts":
/*!**************************************************************!*\
  !*** ./blocks/menu-builder/src/core/state/dom-controller.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOMController: () => (/* binding */ DOMController)
/* harmony export */ });
/* harmony import */ var _modules_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_modules/dom */ "./blocks/menu-builder/src/_modules/dom.ts");
/**
 * DOM Controller for mmenu.js
 * Handles DOM manipulation based on state changes
 */


class DOMController {
  unsubscribeFunctions = [];
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.setupStateListeners();
  }

  /**
   * Setup listeners for state changes
   */
  setupStateListeners() {
    // Listen to panel state changes
    this.unsubscribeFunctions.push(this.stateManager.subscribe('stateChange', event => {
      this.handleStateChange(event);
    }));
  }

  /**
   * Handle state changes and update DOM accordingly
   */
  handleStateChange(event) {
    const {
      payload,
      previousState,
      currentState
    } = event;

    // Handle panel changes
    if (payload.currentPanel !== undefined || payload.openedPanels !== undefined) {
      this.updatePanels(previousState, currentState);
    }

    // Handle selection changes
    if (payload.selectedItems !== undefined) {
      this.updateSelection(previousState.selectedItems || [], currentState.selectedItems || []);
    }

    // Handle menu open/close
    if (payload.isOpen !== undefined) {
      this.updateMenuState(payload.isOpen);
    }
  }

  /**
   * Update panels based on state
   */
  updatePanels(previousState, currentState) {
    const menuElement = currentState.menuElement;
    const panelsElement = currentState.panelsElement;
    if (!menuElement || !panelsElement) return;

    // Get all panels
    const allPanels = _modules_dom__WEBPACK_IMPORTED_MODULE_0__.children(panelsElement, '.mm-panel');

    // Update panel states
    allPanels.forEach(panel => {
      const panelId = panel.id;
      const isCurrentPanel = panelId === currentState.currentPanel;
      const isOpened = currentState.openedPanels.includes(panelId);
      const isParent = currentState.openedPanels.includes(panelId) && !isCurrentPanel;

      // Remove all state classes first
      panel.classList.remove('mm-panel--opened', 'mm-panel--parent', 'mm-panel--highest');
      panel.setAttribute('inert', 'true');

      // Add appropriate classes
      if (isCurrentPanel) {
        panel.classList.add('mm-panel--opened');
        panel.removeAttribute('inert');
      } else if (isParent) {
        panel.classList.add('mm-panel--parent');
        panel.removeAttribute('inert');
      }

      // Handle vertical panels
      const parentListitem = panel.closest('.mm-listitem--vertical');
      if (parentListitem) {
        if (isOpened) {
          parentListitem.classList.add('mm-listitem--opened');
        } else {
          parentListitem.classList.remove('mm-listitem--opened');
        }
      }
    });

    // Handle highest panel for animations
    if (previousState.currentPanel && previousState.currentPanel !== currentState.currentPanel) {
      const previousPanel = menuElement.querySelector(`#${previousState.currentPanel}`);
      if (previousPanel) {
        previousPanel.classList.add('mm-panel--highest');
      }
    }
  }

  /**
   * Update selected items
   */
  updateSelection(previousSelected, currentSelected) {
    const menuElement = this.stateManager.getState().menuElement;
    if (!menuElement) return;

    // Remove previous selection
    previousSelected.forEach(itemId => {
      const item = menuElement.querySelector(`#${itemId}`);
      if (item) {
        item.classList.remove('mm-listitem--selected');
      }
    });

    // Add current selection
    currentSelected.forEach(itemId => {
      const item = menuElement.querySelector(`#${itemId}`);
      if (item) {
        item.classList.add('mm-listitem--selected');
      }
    });
  }

  /**
   * Update menu open/close state
   */
  updateMenuState(isOpen) {
    const menuElement = this.stateManager.getState().menuElement;
    const wrapperElement = menuElement?.parentElement;
    if (wrapperElement) {
      if (isOpen) {
        wrapperElement.classList.add('mm-wrapper--open');
      } else {
        wrapperElement.classList.remove('mm-wrapper--open');
      }
    }
  }

  /**
   * Initialize DOM elements
   */
  initializeElements(menuElement, panelsElement) {
    this.stateManager.setState({
      menuElement,
      panelsElement
    });

    // Setup initial DOM state
    this.setupInitialDOMState(menuElement, panelsElement);
  }

  /**
   * Setup initial DOM state based on current elements
   */
  setupInitialDOMState(menuElement, panelsElement) {
    // Find currently opened panel
    const openedPanel = _modules_dom__WEBPACK_IMPORTED_MODULE_0__.children(panelsElement, '.mm-panel--opened')[0];
    const currentPanelId = openedPanel?.id || null;

    // Find all opened panels
    const openedPanels = _modules_dom__WEBPACK_IMPORTED_MODULE_0__.children(panelsElement, '.mm-panel--opened, .mm-panel--parent').map(panel => panel.id);

    // Find selected items
    const selectedItems = _modules_dom__WEBPACK_IMPORTED_MODULE_0__.children(menuElement, '.mm-listitem--selected').map(item => item.id);

    // Update state with initial DOM state
    this.stateManager.setState({
      currentPanel: currentPanelId,
      openedPanels,
      selectedItems
    });
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    this.unsubscribeFunctions = [];
  }
}

/***/ }),

/***/ "./blocks/menu-builder/src/core/state/observer-controller-fixed.ts":
/*!*************************************************************************!*\
  !*** ./blocks/menu-builder/src/core/state/observer-controller-fixed.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ObserverController: () => (/* binding */ ObserverController)
/* harmony export */ });
/* harmony import */ var _modules_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_modules/dom */ "./blocks/menu-builder/src/_modules/dom.ts");
/**
 * Observer Controller for mmenu.js
 * Manages MutationObservers based on state
 */


class ObserverController {
  observers = {
    panel: null,
    listview: null,
    listitem: null
  };
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  /**
   * Initialize all observers
   */
  initialize() {
    this.setupPanelObserver();
    this.setupListviewObserver();
    this.setupListitemObserver();

    // Store observers in state
    this.stateManager.setState({
      observers: {
        ...this.observers
      }
    });
  }

  /**
   * Setup panel observer
   */
  setupPanelObserver() {
    this.observers.panel = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement && this.isPanelNode(node)) {
            this.handleNewPanel(node);
          }
        });
      });
    });
  }

  /**
   * Setup listview observer
   */
  setupListviewObserver() {
    this.observers.listview = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement && this.isListviewNode(node)) {
            this.handleNewListview(node);
          }
        });
      });
    });
  }

  /**
   * Setup listitem observer
   */
  setupListitemObserver() {
    this.observers.listitem = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement && this.isPanelNode(node)) {
            this.handleNewSubpanel(node);
          }
        });
      });
    });
  }

  /**
   * Check if node is a panel
   */
  isPanelNode(node) {
    const state = this.stateManager.getState();
    const panelNodetypes = state.configs.panelNodetype || ['div', 'section', 'article'];
    return panelNodetypes.some(type => node.tagName.toLowerCase() === type);
  }

  /**
   * Check if node is a listview
   */
  isListviewNode(node) {
    return ['ul', 'ol'].includes(node.tagName.toLowerCase());
  }

  /**
   * Handle new panel
   */
  handleNewPanel(panel) {
    this.stateManager.triggerHooks('initPanel:before', [panel]);

    // Initialize panel logic
    this.initializePanel(panel);
    this.stateManager.triggerHooks('initPanel:after', [panel]);
  }

  /**
   * Handle new listview
   */
  handleNewListview(listview) {
    this.stateManager.triggerHooks('initListview:before', [listview]);

    // Initialize listview logic
    this.initializeListview(listview);
    this.stateManager.triggerHooks('initListview:after', [listview]);
  }

  /**
   * Handle new subpanel
   */
  handleNewSubpanel(subpanel) {
    if (subpanel.classList.contains('mm-panel')) {
      return; // Already initialized
    }
    this.stateManager.triggerHooks('initSubPanel:before', [subpanel]);

    // Initialize subpanel logic
    this.initializeSubpanel(subpanel);
    this.stateManager.triggerHooks('initSubPanel:after', [subpanel]);
  }

  /**
   * Initialize panel
   */
  initializePanel(panel) {
    const state = this.stateManager.getState();

    // Add panel class if not already present
    if (!panel.classList.contains('mm-panel')) {
      _modules_dom__WEBPACK_IMPORTED_MODULE_0__.reClass(panel, state.configs.classNames?.panel, 'mm-panel');
      _modules_dom__WEBPACK_IMPORTED_MODULE_0__.reClass(panel, state.configs.classNames?.nopanel, 'mm-nopanel');
      if (panel.classList.contains('mm-nopanel')) {
        return;
      }
    }

    // Ensure panel has ID
    panel.id = panel.id || this.generateUniqueId();

    // Wrap UL/OL in DIV if needed
    if (panel.matches('ul, ol')) {
      this.wrapListviewInPanel(panel);
    }

    // Add to panels container
    const panelsElement = state.panelsElement;
    if (panelsElement && !panel.parentElement?.matches('.mm-listitem--vertical')) {
      panelsElement.append(panel);
    }

    // Start observing panel for new listviews
    if (this.observers.panel) {
      this.observers.panel.observe(panel, {
        childList: true
      });
    }
  }

  /**
   * Initialize listview
   */
  initializeListview(listview) {
    const state = this.stateManager.getState();

    // Check if it's actually a list
    if (!this.isListviewNode(listview) || listview.classList.contains('mm-listview')) {
      return;
    }
    _modules_dom__WEBPACK_IMPORTED_MODULE_0__.reClass(listview, state.configs.classNames?.nolistview, 'mm-nolistview');
    if (listview.classList.contains('mm-nolistview')) {
      return;
    }
    listview.classList.add('mm-listview');

    // Initialize listitems
    _modules_dom__WEBPACK_IMPORTED_MODULE_0__.children(listview).forEach(listitem => {
      this.initializeListitem(listitem);
    });

    // Start observing listview for new listitems
    if (this.observers.listview) {
      this.observers.listview.observe(listview, {
        childList: true
      });
    }
  }

  /**
   * Initialize listitem
   */
  initializeListitem(listitem) {
    const state = this.stateManager.getState();

    // Check if it's actually a listitem
    if (listitem.tagName.toLowerCase() !== 'li' || listitem.classList.contains('mm-listitem')) {
      return;
    }
    _modules_dom__WEBPACK_IMPORTED_MODULE_0__.reClass(listitem, state.configs.classNames?.divider, 'mm-divider');
    if (listitem.classList.contains('mm-divider')) {
      return;
    }
    listitem.classList.add('mm-listitem');
    _modules_dom__WEBPACK_IMPORTED_MODULE_0__.reClass(listitem, state.configs.classNames?.selected, 'mm-listitem--selected');

    // Add text class to links and spans
    _modules_dom__WEBPACK_IMPORTED_MODULE_0__.children(listitem, 'a, span').forEach(text => {
      text.classList.add('mm-listitem__text');
    });

    // Initialize subpanels
    const panelNodetypes = state.configs.panelNodetype || ['div', 'section', 'article'];
    _modules_dom__WEBPACK_IMPORTED_MODULE_0__.children(listitem, panelNodetypes.join(', ')).forEach(subpanel => {
      this.initializeSubpanel(subpanel);
    });

    // Start observing listitem for new listviews
    if (this.observers.listitem) {
      this.observers.listitem.observe(listitem, {
        childList: true
      });
    }
  }

  /**
   * Initialize subpanel
   */
  initializeSubpanel(subpanel) {
    const state = this.stateManager.getState();
    if (subpanel.classList.contains('mm-panel')) {
      return;
    }
    const listitem = subpanel.parentElement;
    if (!listitem) return;
    const vertical = subpanel.matches('.' + (state.configs.classNames?.vertical || '')) || !state.options.slidingSubmenus;

    // Make it expand vertically if needed
    if (vertical) {
      listitem.classList.add('mm-listitem--vertical');
    }

    // Force IDs
    listitem.id = listitem.id || this.generateUniqueId();
    subpanel.id = subpanel.id || this.generateUniqueId();

    // Store parent/child relationship
    listitem.dataset.mmChild = subpanel.id;
    subpanel.dataset.mmParent = listitem.id;

    // Create or update button
    this.createOrUpdateButton(listitem, subpanel, vertical);

    // Initialize the panel
    this.initializePanel(subpanel);
  }

  /**
   * Wrap listview in panel div
   */
  wrapListviewInPanel(listview) {
    const wrapper = _modules_dom__WEBPACK_IMPORTED_MODULE_0__.create('div');

    // Transport ID
    wrapper.id = listview.id;
    listview.removeAttribute('id');

    // Transport mm- prefixed classes
    Array.from(listview.classList).filter(className => className.startsWith('mm-')).forEach(className => {
      wrapper.classList.add(className);
      listview.classList.remove(className);
    });

    // Transport mm- prefixed data attributes
    Object.keys(listview.dataset).filter(attr => attr.startsWith('mm')).forEach(attr => {
      wrapper.dataset[attr] = listview.dataset[attr];
      delete listview.dataset[attr];
    });

    // Wrap the listview
    listview.before(wrapper);
    wrapper.append(listview);
  }

  /**
   * Create or update button for subpanel
   */
  createOrUpdateButton(listitem, subpanel, vertical) {
    let button = _modules_dom__WEBPACK_IMPORTED_MODULE_0__.children(listitem, '.mm-btn')[0];
    if (!button) {
      button = _modules_dom__WEBPACK_IMPORTED_MODULE_0__.create('a.mm-btn.mm-btn--next.mm-listitem__btn');
      _modules_dom__WEBPACK_IMPORTED_MODULE_0__.children(listitem, 'a, span').forEach(text => {
        if (text.matches('span')) {
          button.classList.add('mm-listitem__text');
          button.innerHTML = text.innerHTML;
          listitem.insertBefore(button, text.nextElementSibling);
          text.remove();
        } else {
          listitem.insertBefore(button, text.nextElementSibling);
        }
      });
      const screenReaderKey = vertical ? 'toggleSubmenu' : 'openSubmenu';
      const ariaLabel = this.stateManager.triggerHooks('i18n', this.stateManager.getState().configs.screenReader?.[screenReaderKey] || 'Open submenu');
      button.setAttribute('aria-label', typeof ariaLabel === 'string' ? ariaLabel : 'Open submenu');
    }
    button.href = `#${subpanel.id}`;
  }

  /**
   * Generate unique ID
   */
  generateUniqueId() {
    return 'mm-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Start observing specific element
   */
  observePanel(panel) {
    if (this.observers.panel) {
      this.observers.panel.observe(panel, {
        childList: true
      });
    }
  }
  observeListview(listview) {
    if (this.observers.listview) {
      this.observers.listview.observe(listview, {
        childList: true
      });
    }
  }
  observeListitem(listitem) {
    if (this.observers.listitem) {
      this.observers.listitem.observe(listitem, {
        childList: true
      });
    }
  }

  /**
   * Disconnect all observers
   */
  disconnect() {
    // Use Object.keys with forEach instead of Object.values for compatibility
    Object.keys(this.observers).forEach(key => {
      const observer = this.observers[key];
      if (observer) {
        observer.disconnect();
      }
    });
  }

  /**
   * Destroy observer controller
   */
  destroy() {
    this.disconnect();
    this.observers = {
      panel: null,
      listview: null,
      listitem: null
    };
  }
}

/***/ }),

/***/ "./blocks/menu-builder/src/core/state/state-manager.ts":
/*!*************************************************************!*\
  !*** ./blocks/menu-builder/src/core/state/state-manager.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MmenuStateManager: () => (/* binding */ MmenuStateManager)
/* harmony export */ });
/**
 * State Manager for mmenu.js
 * Manages menu state instead of destroy-based approach
 */

class MmenuStateManager {
  listeners = new Map();
  constructor(initialOptions = {}, initialConfigs = {}) {
    this.state = {
      isOpen: false,
      currentPanel: null,
      openedPanels: [],
      selectedItems: [],
      menuElement: null,
      panelsElement: null,
      observers: {
        panel: null,
        listview: null,
        listitem: null
      },
      hooks: {},
      options: initialOptions,
      configs: initialConfigs
    };
  }

  /**
   * Get current state
   */
  getState() {
    return {
      ...this.state
    };
  }

  /**
   * Update state with changes
   */
  setState(updates) {
    const previousState = {
      ...this.state
    };
    this.state = {
      ...this.state,
      ...updates
    };

    // Trigger state change event
    const event = {
      type: 'stateChange',
      payload: updates,
      previousState,
      currentState: this.state
    };
    this.emit('stateChange', event);
    this.triggerHooks('stateChange', event);
  }

  /**
   * Subscribe to state changes
   */
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  /**
   * Add hook function
   */
  addHook(hookName, callback) {
    if (!this.state.hooks[hookName]) {
      this.state.hooks[hookName] = [];
    }
    this.state.hooks[hookName].push(callback);
  }

  /**
   * Trigger hook functions
   */
  triggerHooks(hookName, data) {
    const hooks = this.state.hooks[hookName];
    if (hooks) {
      hooks.forEach(hook => hook.call(this, data));
    }
  }

  /**
   * Reset state to initial values
   */
  reset() {
    const observers = this.state.observers;

    // Disconnect observers
    Object.keys(this.state.observers).forEach(key => {
      const observer = this.state.observers[key];
      if (observer) observer.disconnect();
    });

    // Reset state
    this.state = {
      isOpen: false,
      currentPanel: null,
      openedPanels: [],
      selectedItems: [],
      menuElement: null,
      panelsElement: null,
      observers: {
        panel: null,
        listview: null,
        listitem: null
      },
      hooks: {},
      options: this.state.options,
      configs: this.state.configs
    };
    this.emit('reset', this.state);
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.reset();
    this.listeners.clear();
  }

  /**
   * Panel management methods
   */
  openPanel(panelId, animation = true) {
    const previousState = {
      ...this.state
    };
    this.setState({
      currentPanel: panelId,
      openedPanels: [...this.state.openedPanels.filter(id => id !== panelId), panelId]
    });
    this.triggerHooks('openPanel:after', {
      panel: this.state.menuElement?.querySelector(`#${panelId}`),
      animation,
      previousState
    });
  }
  closePanel(panelId, animation = true) {
    const previousState = {
      ...this.state
    };
    this.setState({
      openedPanels: this.state.openedPanels.filter(id => id !== panelId)
    });
    if (this.state.currentPanel === panelId) {
      const remainingPanels = this.state.openedPanels;
      this.setState({
        currentPanel: remainingPanels.length > 0 ? remainingPanels[remainingPanels.length - 1] : null
      });
    }
    this.triggerHooks('closePanel:after', {
      panel: this.state.menuElement?.querySelector(`#${panelId}`),
      animation,
      previousState
    });
  }

  /**
   * Selection management
   */
  setSelected(itemId) {
    this.setState({
      selectedItems: [itemId] // Only one selected at a time
    });
    this.triggerHooks('setSelected:after', {
      item: this.state.menuElement?.querySelector(`#${itemId}`)
    });
  }

  /**
   * Menu open/close state
   */
  openMenu() {
    this.setState({
      isOpen: true
    });
    this.triggerHooks('open:after');
  }
  closeMenu() {
    this.setState({
      isOpen: false,
      currentPanel: null,
      openedPanels: []
    });
    this.triggerHooks('close:after');
  }
}

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "jankx:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../../../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"blocks/menu-builder/build/responsive-menu": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkjankx"] = self["webpackChunkjankx"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************************************************************!*\
  !*** ./blocks/menu-builder/src/responsive/responsive-menu-controller.ts ***!
  \**************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResponsiveMenuController: () => (/* binding */ ResponsiveMenuController)
/* harmony export */ });
/* harmony import */ var _core_state_state_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/state/state-manager */ "./blocks/menu-builder/src/core/state/state-manager.ts");
/* harmony import */ var _core_state_dom_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/state/dom-controller */ "./blocks/menu-builder/src/core/state/dom-controller.ts");
/* harmony import */ var _core_state_observer_controller_fixed__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/state/observer-controller-fixed */ "./blocks/menu-builder/src/core/state/observer-controller-fixed.ts");
/**
 * Responsive Menu Controller for mmenu.js
 * Handles switching between mmenu (mobile) and normal menu (desktop)
 */





// Extend MenuState interface to include responsive properties

class ResponsiveMenuController {
  constructor(menuElement, config = {}) {
    this.menuElement = menuElement;

    // Default configuration
    this.config = {
      mobileBreakpoint: 768,
      desktopBreakpoint: 1024,
      enableMobileMenu: true,
      enableDesktopMenu: true,
      mobileMenuOptions: {},
      desktopMenuOptions: {},
      ...config
    };
    this.initializeResponsiveController();
  }

  /**
   * Initialize responsive controller
   */
  initializeResponsiveController() {
    // Store original menu HTML
    const originalState = {
      originalMenuHTML: this.menuElement.outerHTML,
      isMobile: this.isMobileViewport(),
      isDesktop: this.isDesktopViewport(),
      currentMode: 'destroyed',
      mobileMenuInstance: null,
      desktopMenuElement: null
    };

    // Initialize state manager with responsive state
    this.stateManager = new _core_state_state_manager__WEBPACK_IMPORTED_MODULE_0__.MmenuStateManager(this.config.mobileMenuOptions, {});

    // Extend state with responsive properties
    this.stateManager.setState(originalState);
    this.domController = new _core_state_dom_controller__WEBPACK_IMPORTED_MODULE_1__.DOMController(this.stateManager);
    this.observerController = new _core_state_observer_controller_fixed__WEBPACK_IMPORTED_MODULE_2__.ObserverController(this.stateManager);

    // Setup responsive behavior
    this.setupResponsiveListeners();
    this.setupMediaQueryListener();

    // Initialize appropriate menu mode
    this.initializeCurrentMode();
  }

  /**
   * Setup responsive event listeners
   */
  setupResponsiveListeners() {
    // Listen to viewport changes
    window.addEventListener('resize', this.handleViewportChange.bind(this));

    // Listen to orientation changes
    window.addEventListener('orientationchange', this.handleViewportChange.bind(this));

    // Subscribe to state changes
    this.stateManager.subscribe('modeChange', this.handleModeChange.bind(this));
  }

  /**
   * Setup media query listener for better performance
   */
  setupMediaQueryListener() {
    const mediaQuery = `(max-width: ${this.config.desktopBreakpoint - 1}px)`;
    this.mediaQueryList = window.matchMedia(mediaQuery);

    // Use modern addEventListener if available, fallback to addListener
    if (this.mediaQueryList.addEventListener) {
      this.mediaQueryList.addEventListener('change', this.handleMediaQueryChange.bind(this));
    } else {
      // Fallback for older browsers
      this.mediaQueryList.addListener(this.handleMediaQueryChange.bind(this));
    }
  }

  /**
   * Handle media query changes
   */
  handleMediaQueryChange(event) {
    const isMobile = event.matches;
    const currentState = this.stateManager.getState();
    if (isMobile && currentState.currentMode !== 'mobile') {
      this.switchToMobileMode();
    } else if (!isMobile && currentState.currentMode !== 'desktop') {
      this.switchToDesktopMode();
    }
  }

  /**
   * Handle viewport changes (fallback)
   */
  handleViewportChange() {
    const isMobile = this.isMobileViewport();
    const currentState = this.stateManager.getState();
    if (isMobile && currentState.currentMode !== 'mobile') {
      this.switchToMobileMode();
    } else if (!isMobile && currentState.currentMode !== 'desktop') {
      this.switchToDesktopMode();
    }
  }

  /**
   * Handle mode changes
   */
  handleModeChange(event) {
    const {
      previousMode,
      currentMode
    } = event;

    // Trigger custom events for external listeners
    const customEvent = new CustomEvent('responsiveMenuModeChange', {
      detail: {
        previousMode,
        currentMode,
        controller: this
      }
    });
    this.menuElement.dispatchEvent(customEvent);
  }

  /**
   * Initialize current mode based on viewport
   */
  initializeCurrentMode() {
    if (this.isMobileViewport() && this.config.enableMobileMenu) {
      this.switchToMobileMode();
    } else if (!this.isMobileViewport() && this.config.enableDesktopMenu) {
      this.switchToDesktopMode();
    }
  }

  /**
   * Switch to mobile mode (mmenu)
   */
  switchToMobileMode() {
    const currentState = this.stateManager.getState();

    // Destroy desktop menu if exists
    if (currentState.currentMode === 'desktop') {
      this.destroyDesktopMenu();
    }

    // Restore original menu HTML
    this.menuElement.innerHTML = currentState.originalMenuHTML;

    // Initialize mmenu
    this.initializeMobileMenu();

    // Update state
    this.stateManager.setState({
      isMobile: true,
      isDesktop: false,
      currentMode: 'mobile'
    });
  }

  /**
   * Switch to desktop mode (normal menu)
   */
  switchToDesktopMode() {
    const currentState = this.stateManager.getState();

    // Destroy mmenu if exists
    if (currentState.currentMode === 'mobile') {
      this.destroyMobileMenu();
    }

    // Restore original menu HTML
    this.menuElement.innerHTML = currentState.originalMenuHTML;

    // Initialize desktop menu
    this.initializeDesktopMenu();

    // Update state
    this.stateManager.setState({
      isMobile: false,
      isDesktop: true,
      currentMode: 'desktop'
    });
  }

  /**
   * Initialize mobile menu with mmenu
   */
  initializeMobileMenu() {
    if (!this.config.enableMobileMenu) return;
    try {
      // Import mmenu state version
      __webpack_require__.e(/*! import() */ "blocks_menu-builder_src_mmenu_state_js").then(__webpack_require__.bind(__webpack_require__, /*! ../mmenu.state */ "./blocks/menu-builder/src/mmenu.state.js")).then(({
        default: MmenuState
      }) => {
        const mobileMenu = new MmenuState(this.menuElement, this.config.mobileMenuOptions);
        this.stateManager.setState({
          mobileMenuInstance: mobileMenu
        });

        // Setup mobile menu specific behaviors
        this.setupMobileMenuBehaviors(mobileMenu);
      });
    } catch (error) {
      console.error('Failed to initialize mobile menu:', error);
    }
  }

  /**
   * Initialize desktop menu (normal menu)
   */
  initializeDesktopMenu() {
    if (!this.config.enableDesktopMenu) return;

    // Add desktop menu classes
    this.menuElement.classList.add('desktop-menu');
    this.menuElement.classList.remove('mm-menu');

    // Setup desktop menu behaviors
    this.setupDesktopMenuBehaviors();
  }

  /**
   * Destroy mobile menu
   */
  destroyMobileMenu() {
    const currentState = this.stateManager.getState();
    const mobileMenu = currentState.mobileMenuInstance;
    if (mobileMenu && typeof mobileMenu.destroy === 'function') {
      mobileMenu.destroy();
    }

    // Remove mmenu classes
    this.menuElement.classList.remove('mm-menu');

    // Remove mmenu wrapper
    const wrapper = this.menuElement.parentElement;
    if (wrapper && wrapper.classList.contains('mm-wrapper')) {
      wrapper.classList.remove('mm-wrapper');
    }
    this.stateManager.setState({
      mobileMenuInstance: null
    });
  }

  /**
   * Destroy desktop menu
   */
  destroyDesktopMenu() {
    // Remove desktop menu classes
    this.menuElement.classList.remove('desktop-menu');

    // Remove desktop menu event listeners
    this.removeDesktopMenuBehaviors();
    this.stateManager.setState({
      desktopMenuElement: null
    });
  }

  /**
   * Setup mobile menu specific behaviors
   */
  setupMobileMenuBehaviors(mobileMenu) {
    // Add mobile menu specific classes
    this.menuElement.classList.add('mobile-menu');

    // Setup mobile menu event listeners
    this.menuElement.addEventListener('click', this.handleMobileMenuClick.bind(this));
  }

  /**
   * Setup desktop menu specific behaviors
   */
  setupDesktopMenuBehaviors() {
    // Add desktop menu specific classes
    this.menuElement.classList.add('desktop-menu');

    // Setup dropdown menus for desktop
    this.setupDesktopDropdowns();

    // Setup desktop menu event listeners
    this.menuElement.addEventListener('click', this.handleDesktopMenuClick.bind(this));
    this.menuElement.addEventListener('mouseover', this.handleDesktopMenuHover.bind(this));
    this.menuElement.addEventListener('mouseout', this.handleDesktopMenuLeave.bind(this));
  }

  /**
   * Remove desktop menu behaviors
   */
  removeDesktopMenuBehaviors() {
    // Remove event listeners
    this.menuElement.removeEventListener('click', this.handleDesktopMenuClick.bind(this));
    this.menuElement.removeEventListener('mouseover', this.handleDesktopMenuHover.bind(this));
    this.menuElement.removeEventListener('mouseout', this.handleDesktopMenuLeave.bind(this));

    // Remove dropdown classes
    this.removeDesktopDropdowns();
  }

  /**
   * Setup desktop dropdown menus
   */
  setupDesktopDropdowns() {
    const menuItems = this.menuElement.querySelectorAll('li');
    menuItems.forEach(item => {
      const submenu = item.querySelector('ul, .submenu');
      if (submenu) {
        item.classList.add('has-dropdown');
        submenu.classList.add('dropdown-menu');
      }
    });
  }

  /**
   * Remove desktop dropdown menus
   */
  removeDesktopDropdowns() {
    const dropdowns = this.menuElement.querySelectorAll('.has-dropdown, .dropdown-menu');
    dropdowns.forEach(element => {
      element.classList.remove('has-dropdown', 'dropdown-menu');
    });
  }

  /**
   * Handle mobile menu clicks
   */
  handleMobileMenuClick(event) {
    // Mobile menu specific click handling
    const target = event.target;
    const menuItem = target.closest('li');
    if (menuItem && menuItem.classList.contains('has-submenu')) {
      // Handle submenu toggle for mobile
      event.preventDefault();
      // mmenu will handle this automatically
    }
  }

  /**
   * Handle desktop menu clicks
   */
  handleDesktopMenuClick(event) {
    const target = event.target;
    const menuItem = target.closest('li');
    if (menuItem && menuItem.classList.contains('has-dropdown')) {
      // Handle dropdown toggle for desktop
      event.preventDefault();
      this.toggleMenuItem(menuItem);
    }
  }

  /**
   * Handle desktop menu hover
   */
  handleDesktopMenuHover(event) {
    const target = event.target;
    const menuItem = target.closest('li');
    if (menuItem && menuItem.classList.contains('has-dropdown')) {
      // Show dropdown on hover
      this.showDropdown(menuItem);
    }
  }

  /**
  ied menu leave
   */
  handleDesktopMenuLeave(event) {
    const target = event.target;
    const menuItem = target.closest('li');
    if (menuItem && menuItem.classList.contains('has-dropdown')) {
      // Hide dropdown on leave
      this.hideDropdown(menuItem);
    }
  }

  /**
   * Toggle menu item (for desktop dropdown)
   */
  toggleMenuItem(menuItem) {
    if (menuItem.classList.contains('dropdown-open')) {
      this.hideDropdown(menuItem);
    } else {
      this.showDropdown(menuItem);
    }
  }

  /**
   * Toggle dropdown menu
   */
  toggleDropdown(menuItem) {
    if (menuItem.classList.contains('dropdown-open')) {
      this.hideDropdown(menuItem);
    } else {
      this.showDropdown(menuItem);
    }
  }

  /**
   * Show dropdown menu
   */
  showDropdown(menuItem) {
    // Close other dropdowns
    const openDropdowns = this.menuElement.querySelectorAll('.dropdown-open');
    openDropdowns.forEach(openItem => {
      if (openItem !== menuItem) {
        this.hideDropdown(openItem);
      }
    });

    // Show current dropdown
    menuItem.classList.add('dropdown-open');
    const submenu = menuItem.querySelector('.dropdown-menu');
    if (submenu) {
      submenu.style.display = 'block';
      submenu.style.opacity = '1';
    }
  }

  /**
   * Hide dropdown menu
   */
  hideDropdown(menuItem) {
    menuItem.classList.remove('dropdown-open');
    const submenu = menuItem.querySelector('.dropdown-menu');
    if (submenu) {
      submenu.style.display = 'none';
      submenu.style.opacity = '0';
    }
  }

  /**
   * Check if current viewport is mobile
   */
  isMobileViewport() {
    return window.innerWidth < this.config.desktopBreakpoint;
  }

  /**
   * Check if current viewport is desktop
   */
  isDesktopViewport() {
    return window.innerWidth >= this.config.desktopBreakpoint;
  }

  /**
   * Get current state
   */
  getState() {
    return this.stateManager.getState();
  }

  /**
   * Force switch to specific mode
   */
  switchToMode(mode) {
    if (mode === 'mobile') {
      this.switchToMobileMode();
    } else {
      this.switchToDesktopMode();
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig
    };

    // Re-initialize if needed
    this.initializeCurrentMode();
  }

  /**
   * Destroy responsive controller
   */
  destroy() {
    // Clean up event listeners
    window.removeEventListener('resize', this.handleViewportChange.bind(this));
    window.removeEventListener('orientationchange', this.handleViewportChange.bind(this));
    if (this.mediaQueryList.removeEventListener) {
      this.mediaQueryList.removeEventListener('change', this.handleMediaQueryChange.bind(this));
    } else {
      this.mediaQueryList.removeListener(this.handleMediaQueryChange.bind(this));
    }

    // Destroy current menu
    const currentState = this.stateManager.getState();
    if (currentState.currentMode === 'mobile') {
      this.destroyMobileMenu();
    } else if (currentState.currentMode === 'desktop') {
      this.destroyDesktopMenu();
    }

    // Destroy controllers
    this.domController.destroy();
    this.observerController.destroy();
    this.stateManager.destroy();
  }
}
})();

/******/ })()
;
//# sourceMappingURL=responsive-menu.js.map
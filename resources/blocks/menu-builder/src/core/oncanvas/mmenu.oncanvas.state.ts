import OPTIONS from './options';
import CONFIGS from './configs';
import translate from './translations';
import * as DOM from '../../_modules/dom';
import * as i18n from '../../_modules/i18n';
import * as media from '../../_modules/matchmedia';
import { extend, type, uniqueId } from '../../_modules/helpers';
import { MmenuStateManager, MenuState } from '../state/state-manager';
import { DOMController } from '../state/dom-controller';
import { ObserverController } from '../state/observer-controller-fixed';

//  Add the translations.
translate();

/**
 * Class for a mobile menu with state management.
 */
export default class MmenuState {
    /**	Available add-ons for the plugin. */
    static addons: mmLooseObject = {};

    /**	Globally used HTML elements. */
    static node: mmHtmlObject = {};

    /** Globally used variables. */
    static vars: mmLooseObject = {};

    /** State manager instance */
    private stateManager: MmenuStateManager;

    /** DOM controller instance */
    private domController: DOMController;

    /** Observer controller instance */
    private observerController: ObserverController;

    /**	Options for the menu. */
    opts: mmOptions;

    /** Configuration for the menu. */
    conf: mmConfigs;

    /**	Array of method names to expose in the API. */
    _api: string[];

    /** The API. */
    API: mmApi;

    /** HTML elements used for the menu. */
    node: mmHtmlObject;

    /** Callback hooks used for the menu. */
    hook: mmLooseObject;

    /** Set the menu theme. */
    theme: Function;

    /** Log deprecated warnings when using the debugger. */
    _deprecatedWarnings: Function;

    //	offCanvas add-on
    /** Open the menu. */
    open: Function;

    /** Close the menu. */
    close: Function;

    /** Set the page HTML element. */
    setPage: Function;

    /**
     * Create a mobile menu with state management.
     * @param {HTMLElement|string} 	menu		The menu node.
     * @param {object} 				[option]	Options for the menu.
     * @param {object} 				[configs]	Configuration options for the menu.
     */
    constructor(
        menu: HTMLElement | string,
        options?: mmOptions,
        configs?: mmConfigs
    ) {
        //	Extend options and configuration from defaults.
        this.opts = extend(options, OPTIONS);
        this.conf = extend(configs, CONFIGS);

        //	Initialize state management
        this.stateManager = new MmenuStateManager(this.opts, this.conf);
        this.domController = new DOMController(this.stateManager);
        this.observerController = new ObserverController(this.stateManager);

        //	Methods to expose in the API.
        this._api = [
            'i18n',
            'bind',
            'openPanel',
            'closePanel',
            'setSelected',
            'getState',
            'setState',
            'reset',
            'destroy'
        ];

        //	Storage objects for nodes and hooks.
        this.node = {};
        this.hook = {};

        //	Get menu node from string or element.
        this.node.menu =
            typeof menu == 'string' ? document.querySelector(menu) : menu;

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
        media.watch();
        this.trigger('init:after');

        return this;
    }

    /**
     * Open a panel.
     * @param {HTMLElement} panel               Panel to open.
     * @param {boolean}     [animation=true]    Whether or not to use an animation.
     * @param {boolean}     [setfocus=true]     Whether or not to set focus to the panel.
     */
    openPanel(panel: HTMLElement, animation = true, setfocus = true) {
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
            const currentPanelElement = this.node.menu.querySelector(`#${panel.id}`) as HTMLElement;
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
    closePanel(panel: HTMLElement, animation = true, setfocus = true) {
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
                const currentPanelElement = this.node.menu.querySelector(`#${currentState.currentPanel}`) as HTMLElement;
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
    togglePanel(panel: HTMLElement) {
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
    setSelected(listitem: HTMLElement) {
        if (!listitem.id) {
            listitem.id = uniqueId();
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
    bind(hook: string, func: Function) {
        this.stateManager.addHook(hook, func);
    }

    /**
     * Invoke the functions bound to a hook (publisher).
     * @param {string} 	hook  	The hook.
     * @param {array}	[args] 	Arguments for the function.
     */
    trigger(hook: string, args?: any[]) {
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
    setState(updates: Partial<MenuState>) {
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
        this.node.menu.id = this.node.menu.id || uniqueId();
        this.node.menu.setAttribute('aria-label', this.i18n(this.opts.navbar.title || 'Menu'));
        this.node.menu.setAttribute('aria-modal', 'true');
        this.node.menu.setAttribute('role', 'dialog');

        /** All panel nodes in the menu. */
        const panels = DOM.children(this.node.menu).filter((panel) => 
            panel.matches(this.conf.panelNodetype.join(', '))
        );

        //	Wrap the panels in a node.
        this.node.pnls = DOM.create('div.mm-panels');
        this.node.menu.append(this.node.pnls);

        //  Initiate all panel like nodes
        panels.forEach((panel) => {
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
    private _handlePanelClick(event: Event) {
        const target = event.target as HTMLElement;
        const anchor = target.closest('a[href]');
        
        if (!anchor) return;

        const href = anchor.getAttribute('href') || '';
        if (href.slice(0, 1) === '#') {
            try {
                const panel = DOM.find(this.node.menu, href)[0];
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
    _initPanel(panel: HTMLElement): HTMLElement | null {
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
        this._api.forEach((fn) => {
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
    i18n(text: string): string {
        return i18n.get(text, this.conf.language);
    }

    /**
     * Get all translations for the given language.
     * @return {object}	The translations.
     */
    static i18n(text = {}, language = '') {
        if (text && language) {
            i18n.add(text, language);
        } else {
            return i18n.show();
        }
    }
}

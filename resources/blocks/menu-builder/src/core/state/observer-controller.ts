/**
 * Observer Controller for mmenu.js
 * Manages MutationObservers based on state
 */

import { MmenuStateManager, MenuState } from './state-manager';
import * as DOM from '../../_modules/dom';

export class ObserverController {
    private stateManager: MmenuStateManager;
    private observers: {
        panel: MutationObserver | null;
        listview: MutationObserver | null;
        listitem: MutationObserver | null;
    } = {
        panel: null,
        listview: null,
        listitem: null
    };

    constructor(stateManager: MmenuStateManager) {
        this.stateManager = stateManager;
    }

    /**
     * Initialize all observers
     */
    initialize(): void {
        this.setupPanelObserver();
        this.setupListviewObserver();
        this.setupListitemObserver();

        // Store observers in state
        this.stateManager.setState({
            observers: { ...this.observers }
        });
    }

    /**
     * Setup panel observer
     */
    private setupPanelObserver(): void {
        this.observers.panel = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
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
    private setupListviewObserver(): void {
        this.observers.listview = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
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
    private setupListitemObserver(): void {
        this.observers.listitem = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
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
    private isPanelNode(node: HTMLElement): boolean {
        const state = this.stateManager.getState();
        const panelNodetypes = state.configs.panelNodetype || ['div', 'section', 'article'];
        return panelNodetypes.some(type => node.tagName.toLowerCase() === type);
    }

    /**
     * Check if node is a listview
     */
    private isListviewNode(node: HTMLElement): boolean {
        return ['ul', 'ol'].includes(node.tagName.toLowerCase());
    }

    /**
     * Handle new panel
     */
    private handleNewPanel(panel: HTMLElement): void {
        this.stateManager.triggerHooks('initPanel:before', [panel]);
        
        // Initialize panel logic
        this.initializePanel(panel);
        
        this.stateManager.triggerHooks('initPanel:after', [panel]);
    }

    /**
     * Handle new listview
     */
    private handleNewListview(listview: HTMLElement): void {
        this.stateManager.triggerHooks('initListview:before', [listview]);
        
        // Initialize listview logic
        this.initializeListview(listview);
        
        this.stateManager.triggerHooks('initListview:after', [listview]);
    }

    /**
     * Handle new subpanel
     */
    private handleNewSubpanel(subpanel: HTMLElement): void {
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
    private initializePanel(panel: HTMLElement): void {
        const state = this.stateManager.getState();
        
        // Add panel class if not already present
        if (!panel.classList.contains('mm-panel')) {
            DOM.reClass(panel, state.configs.classNames?.panel, 'mm-panel');
            DOM.reClass(panel, state.configs.classNames?.nopanel, 'mm-nopanel');
            
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
            this.observers.panel.observe(panel, { childList: true });
        }
    }

    /**
     * Initialize listview
     */
    private initializeListview(listview: HTMLElement): void {
        const state = this.stateManager.getState();
        
        // Check if it's actually a list
        if (!this.isListviewNode(listview) || listview.classList.contains('mm-listview')) {
            return;
        }

        DOM.reClass(listview, state.configs.classNames?.nolistview, 'mm-nolistview');
        
        if (listview.classList.contains('mm-nolistview')) {
            return;
        }

        listview.classList.add('mm-listview');

        // Initialize listitems
        DOM.children(listview).forEach((listitem) => {
            this.initializeListitem(listitem);
        });

        // Start observing listview for new listitems
        if (this.observers.listview) {
            this.observers.listview.observe(listview, { childList: true });
        }
    }

    /**
     * Initialize listitem
     */
    private initializeListitem(listitem: HTMLElement): void {
        const state = this.stateManager.getState();
        
        // Check if it's actually a listitem
        if (listitem.tagName.toLowerCase() !== 'li' || listitem.classList.contains('mm-listitem')) {
            return;
        }

        DOM.reClass(listitem, state.configs.classNames?.divider, 'mm-divider');
        
        if (listitem.classList.contains('mm-divider')) {
            return;
        }

        listitem.classList.add('mm-listitem');

        DOM.reClass(listitem, state.configs.classNames?.selected, 'mm-listitem--selected');

        // Add text class to links and spans
        DOM.children(listitem, 'a, span').forEach((text) => {
            text.classList.add('mm-listitem__text');
        });

        // Initialize subpanels
        const panelNodetypes = state.configs.panelNodetype || ['div', 'section', 'article'];
        DOM.children(listitem, panelNodetypes.join(', ')).forEach((subpanel) => {
            this.initializeSubpanel(subpanel);
        });

        // Start observing listitem for new listviews
        if (this.observers.listitem) {
            this.observers.listitem.observe(listitem, { childList: true });
        }
    }

    /**
     * Initialize subpanel
     */
    private initializeSubpanel(subpanel: HTMLElement): void {
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
    private wrapListviewInPanel(listview: HTMLElement): void {
        const wrapper = DOM.create('div');
        
        // Transport ID
        wrapper.id = listview.id;
        listview.removeAttribute('id');

        // Transport mm- prefixed classes
        Array.from(listview.classList)
            .filter(className => className.startsWith('mm-'))
            .forEach(className => {
                wrapper.classList.add(className);
                listview.classList.remove(className);
            });

        // Transport mm- prefixed data attributes
            Object.keys(listview.dataset)
                .filter(attr => attr.startsWith('mm'))
                .forEach(attr => {
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
    private createOrUpdateButton(listitem: HTMLElement, subpanel: HTMLElement, vertical: boolean): void {
        let button = DOM.children(listitem, '.mm-btn')[0] as HTMLAnchorElement;

        if (!button) {
            button = DOM.create('a.mm-btn.mm-btn--next.mm-listitem__btn') as HTMLAnchorElement;
            
            DOM.children(listitem, 'a, span').forEach((text) => {
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
            const ariaLabel = this.stateManager.triggerHooks('i18n', 
                this.stateManager.getState().configs.screenReader?.[screenReaderKey] || 'Open submenu'
            );
            button.setAttribute('aria-label', typeof ariaLabel === 'string' ? ariaLabel : 'Open submenu');
        }

        button.href = `#${subpanel.id}`;
    }

    /**
     * Generate unique ID
     */
    private generateUniqueId(): string {
        return 'mm-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Start observing specific element
     */
    observePanel(panel: HTMLElement): void {
        if (this.observers.panel) {
            this.observers.panel.observe(panel, { childList: true });
        }
    }

    observeListview(listview: HTMLElement): void {
        if (this.observers.listview) {
            this.observers.listview.observe(listview, { childList: true });
        }
    }

    observeListitem(listitem: HTMLElement): void {
        if (this.observers.listitem) {
            this.observers.listitem.observe(listitem, { childList: true });
            }
        });

        const screenReaderKey = vertical ? 'toggleSubmenu' : 'openSubmenu';
        const ariaLabel = this.stateManager.triggerHooks('i18n', 
            this.stateManager.getState().configs.screenReader?.[screenReaderKey] || 'Open submenu'
        );
        button.setAttribute('aria-label', typeof ariaLabel === 'string' ? ariaLabel : 'Open submenu');
    /**
     * Destroy observer controller
     */
    destroy(): void {
        this.disconnect();
        this.observers = {
            panel: null,
            listview: null,
            listitem: null
        };
    }
}

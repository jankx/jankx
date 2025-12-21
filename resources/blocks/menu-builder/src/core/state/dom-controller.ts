/**
 * DOM Controller for mmenu.js
 * Handles DOM manipulation based on state changes
 */

import { MmenuStateManager, MenuState, StateChangeEvent } from './state-manager';
import * as DOM from '../../_modules/dom';

export class DOMController {
    private stateManager: MmenuStateManager;
    private unsubscribeFunctions: (() => void)[] = [];

    constructor(stateManager: MmenuStateManager) {
        this.stateManager = stateManager;
        this.setupStateListeners();
    }

    /**
     * Setup listeners for state changes
     */
    private setupStateListeners(): void {
        // Listen to panel state changes
        this.unsubscribeFunctions.push(
            this.stateManager.subscribe('stateChange', (event: StateChangeEvent) => {
                this.handleStateChange(event);
            })
        );
    }

    /**
     * Handle state changes and update DOM accordingly
     */
    private handleStateChange(event: StateChangeEvent): void {
        const { payload, previousState, currentState } = event;

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
    private updatePanels(previousState: MenuState, currentState: MenuState): void {
        const menuElement = currentState.menuElement;
        const panelsElement = currentState.panelsElement;
        
        if (!menuElement || !panelsElement) return;

        // Get all panels
        const allPanels = DOM.children(panelsElement, '.mm-panel');

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
    private updateSelection(previousSelected: string[], currentSelected: string[]): void {
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
    private updateMenuState(isOpen: boolean): void {
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
    initializeElements(menuElement: HTMLElement, panelsElement: HTMLElement): void {
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
    private setupInitialDOMState(menuElement: HTMLElement, panelsElement: HTMLElement): void {
        // Find currently opened panel
        const openedPanel = DOM.children(panelsElement, '.mm-panel--opened')[0];
        const currentPanelId = openedPanel?.id || null;

        // Find all opened panels
        const openedPanels = DOM.children(panelsElement, '.mm-panel--opened, .mm-panel--parent')
            .map(panel => panel.id);

        // Find selected items
        const selectedItems = DOM.children(menuElement, '.mm-listitem--selected')
            .map(item => item.id);

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
    destroy(): void {
        this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
        this.unsubscribeFunctions = [];
    }
}

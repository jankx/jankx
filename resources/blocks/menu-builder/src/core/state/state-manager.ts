/**
 * State Manager for mmenu.js
 * Manages menu state instead of destroy-based approach
 */

export interface MenuState {
    isOpen: boolean;
    currentPanel: string | null;
    openedPanels: string[];
    selectedItems: string[];
    menuElement: HTMLElement | null;
    panelsElement: HTMLElement | null;
    observers: {
        panel: MutationObserver | null;
        listview: MutationObserver | null;
        listitem: MutationObserver | null;
    };
    hooks: Record<string, Function[]>;
    options: any;
    configs: any;
}

export interface StateChangeEvent {
    type: string;
    payload: any;
    previousState: Partial<MenuState>;
    currentState: MenuState;
}

export class MmenuStateManager {
    private state: MenuState;
    private listeners: Map<string, Function[]> = new Map();

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
    getState(): MenuState {
        return { ...this.state };
    }

    /**
     * Update state with changes
     */
    setState(updates: Partial<MenuState>): void {
        const previousState = { ...this.state };
        this.state = { ...this.state, ...updates };

        // Trigger state change event
        const event: StateChangeEvent = {
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
    subscribe(event: string, callback: Function): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);

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
    private emit(event: string, data: any): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    /**
     * Add hook function
     */
    addHook(hookName: string, callback: Function): void {
        if (!this.state.hooks[hookName]) {
            this.state.hooks[hookName] = [];
        }
        this.state.hooks[hookName].push(callback);
    }

    /**
     * Trigger hook functions
     */
    triggerHooks(hookName: string, data?: any): void {
        const hooks = this.state.hooks[hookName];
        if (hooks) {
            hooks.forEach(hook => hook.call(this, data));
        }
    }

    /**
     * Reset state to initial values
     */
    reset(): void {
        const observers = this.state.observers;
        
        // Disconnect observers
        Object.keys(this.state.observers).forEach(key => {
            const observer = this.state.observers[key as keyof typeof this.state.observers];
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
    destroy(): void {
        this.reset();
        this.listeners.clear();
    }

    /**
     * Panel management methods
     */
    openPanel(panelId: string, animation = true): void {
        const previousState = { ...this.state };
        
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

    closePanel(panelId: string, animation = true): void {
        const previousState = { ...this.state };
        
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
    setSelected(itemId: string): void {
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
    openMenu(): void {
        this.setState({ isOpen: true });
        this.triggerHooks('open:after');
    }

    closeMenu(): void {
        this.setState({ 
            isOpen: false,
            currentPanel: null,
            openedPanels: []
        });
        this.triggerHooks('close:after');
    }
}

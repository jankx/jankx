/**
 * Tabs Block Frontend JavaScript
 * Handles tab switching and interactions
 */

interface TabsBlock {
    element: HTMLElement;
    labels: HTMLElement[];
    panels: HTMLElement[];
    activeIndex: number;
    options: TabsOptions;
}

interface TabsOptions {
    autoSwitch?: boolean;
    autoSwitchInterval?: number;
    keyboardNavigation?: boolean;
    smoothTransition?: boolean;
    onTabChange?: (index: number, label: HTMLElement, panel: HTMLElement) => void;
}

class JankxTabs {
    private blocks: Map<string, TabsBlock> = new Map();
    private autoSwitchTimers: Map<string, number> = new Map();

    constructor() {
        this.init();
    }

    private init(): void {
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeTabs());
        } else {
            this.initializeTabs();
        }

        // Handle dynamic content
        this.observeDynamicContent();
    }

    private initializeTabs(): void {
        const tabBlocks = document.querySelectorAll('.jankx-tabs-block');

        tabBlocks.forEach((block) => {
            this.createTabsBlock(block as HTMLElement);
        });
    }

    private createTabsBlock(element: HTMLElement): void {
        const blockId = element.id || `tabs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        element.id = blockId;

        const labelsContainer = element.querySelector('.jankx-tabs-labels');
        const contentContainer = element.querySelector('.jankx-tabs-content');

        if (!labelsContainer || !contentContainer) {
            console.warn('Tabs block missing required containers:', element);
            return;
        }

        // Get tab panels
        const panels = Array.from(contentContainer.querySelectorAll('.jankx-tab-panel'));

        if (panels.length === 0) {
            console.warn('No tab panels found:', element);
            return;
        }

        // Create tab labels from panel data
        const labels = this.createTabLabels(panels, labelsContainer);

        // Set up tabs block
        const tabsBlock: TabsBlock = {
            element,
            labels,
            panels,
            activeIndex: 0,
            options: this.getTabsOptions(element),
        };

        this.blocks.set(blockId, tabsBlock);

        // Initialize the first tab
        this.showTab(blockId, 0);

        // Set up event listeners
        this.setupEventListeners(blockId);

        // Start auto-switch if enabled
        if (tabsBlock.options.autoSwitch) {
            this.startAutoSwitch(blockId);
        }
    }

    private createTabLabels(panels: HTMLElement[], container: HTMLElement): HTMLElement[] {
        const labels: HTMLElement[] = [];

        panels.forEach((panel, index) => {
            const tabLabel = panel.getAttribute('data-tab-label') || `Tab ${index + 1}`;

            const label = document.createElement('button');
            label.className = 'jankx-tab-label';
            label.textContent = tabLabel;
            label.setAttribute('role', 'tab');
            label.setAttribute('aria-selected', 'false');
            label.setAttribute('aria-controls', `tab-panel-${index}`);
            label.setAttribute('data-tab-index', index.toString());

            container.appendChild(label);
            labels.push(label);
        });

        return labels;
    }

    private getTabsOptions(element: HTMLElement): TabsOptions {
        return {
            autoSwitch: element.dataset.autoSwitch === 'true',
            autoSwitchInterval: parseInt(element.dataset.autoSwitchInterval || '5000'),
            keyboardNavigation: element.dataset.keyboardNavigation !== 'false',
            smoothTransition: element.dataset.smoothTransition !== 'false',
        };
    }

    private setupEventListeners(blockId: string): void {
        const block = this.blocks.get(blockId);
        if (!block) return;

        // Tab label click events
        block.labels.forEach((label, index) => {
            label.addEventListener('click', () => {
                this.showTab(blockId, index);
            });

            // Keyboard navigation
            if (block.options.keyboardNavigation) {
                label.addEventListener('keydown', (e) => {
                    this.handleKeyboardNavigation(blockId, e, index);
                });
            }
        });

        // Global keyboard navigation
        if (block.options.keyboardNavigation) {
            block.element.addEventListener('keydown', (e) => {
                this.handleGlobalKeyboardNavigation(blockId, e);
            });
        }

        // Focus management
        block.element.addEventListener('focusin', (e) => {
            this.handleFocusManagement(blockId, e);
        });
    }

    private handleKeyboardNavigation(blockId: string, event: KeyboardEvent, currentIndex: number): void {
        const block = this.blocks.get(blockId);
        if (!block) return;

        let newIndex = currentIndex;

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : block.labels.length - 1;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                newIndex = currentIndex < block.labels.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                newIndex = block.labels.length - 1;
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.showTab(blockId, currentIndex);
                return;
        }

        if (newIndex !== currentIndex) {
            this.showTab(blockId, newIndex);
            block.labels[newIndex].focus();
        }
    }

    private handleGlobalKeyboardNavigation(blockId: string, event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            // Focus the active tab label
            const block = this.blocks.get(blockId);
            if (block) {
                block.labels[block.activeIndex].focus();
            }
        }
    }

    private handleFocusManagement(blockId: string, event: FocusEvent): void {
        const block = this.blocks.get(blockId);
        if (!block) return;

        const target = event.target as HTMLElement;

        // If focus is within a tab panel, ensure the corresponding tab is active
        const panel = target.closest('.jankx-tab-panel');
        if (panel) {
            const panelIndex = block.panels.indexOf(panel as HTMLElement);
            if (panelIndex !== -1 && panelIndex !== block.activeIndex) {
                this.showTab(blockId, panelIndex);
            }
        }
    }

    public showTab(blockId: string, index: number): void {
        const block = this.blocks.get(blockId);
        if (!block || index < 0 || index >= block.labels.length) return;

        // Update active index
        block.activeIndex = index;

        // Update labels
        block.labels.forEach((label, i) => {
            const isActive = i === index;
            label.classList.toggle('active', isActive);
            label.setAttribute('aria-selected', isActive.toString());

            if (isActive) {
                label.focus();
            }
        });

        // Update panels
        block.panels.forEach((panel, i) => {
            const isActive = i === index;
            panel.classList.toggle('active', isActive);
            panel.setAttribute('aria-hidden', (!isActive).toString());

            if (isActive) {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        });

        // Call custom callback
        if (block.options.onTabChange) {
            block.options.onTabChange(index, block.labels[index], block.panels[index]);
        }

        // Dispatch custom event
        const event = new CustomEvent('jankx-tab-changed', {
            detail: {
                blockId,
                index,
                label: block.labels[index],
                panel: block.panels[index],
            },
            bubbles: true,
        });
        block.element.dispatchEvent(event);
    }

    private startAutoSwitch(blockId: string): void {
        const block = this.blocks.get(blockId);
        if (!block || !block.options.autoSwitch) return;

        const switchTab = () => {
            const nextIndex = (block.activeIndex + 1) % block.labels.length;
            this.showTab(blockId, nextIndex);
        };

        const timer = window.setInterval(switchTab, block.options.autoSwitchInterval);
        this.autoSwitchTimers.set(blockId, timer);

        // Pause auto-switch on hover
        block.element.addEventListener('mouseenter', () => {
            this.pauseAutoSwitch(blockId);
        });

        block.element.addEventListener('mouseleave', () => {
            this.resumeAutoSwitch(blockId);
        });
    }

    private pauseAutoSwitch(blockId: string): void {
        const timer = this.autoSwitchTimers.get(blockId);
        if (timer) {
            clearInterval(timer);
            this.autoSwitchTimers.delete(blockId);
        }
    }

    private resumeAutoSwitch(blockId: string): void {
        const block = this.blocks.get(blockId);
        if (block && block.options.autoSwitch) {
            this.startAutoSwitch(blockId);
        }
    }

    private observeDynamicContent(): void {
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                const element = node as Element;

                                // Check if the added node is a tabs block
                                if (element.classList && element.classList.contains('jankx-tabs-block')) {
                                    this.createTabsBlock(element as HTMLElement);
                                }

                                // Check if the added node contains tabs blocks
                                const tabBlocks = element.querySelectorAll && element.querySelectorAll('.jankx-tabs-block');
                                if (tabBlocks) {
                                    tabBlocks.forEach((block) => {
                                        this.createTabsBlock(block as HTMLElement);
                                    });
                                }
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    }

    // Public API methods
    public getBlock(blockId: string): TabsBlock | undefined {
        return this.blocks.get(blockId);
    }

    public getAllBlocks(): Map<string, TabsBlock> {
        return this.blocks;
    }

    public destroy(blockId: string): void {
        const block = this.blocks.get(blockId);
        if (!block) return;

        // Clear auto-switch timer
        this.pauseAutoSwitch(blockId);

        // Remove event listeners
        block.labels.forEach((label) => {
            label.replaceWith(label.cloneNode(true));
        });

        // Remove from blocks map
        this.blocks.delete(blockId);
    }

    public destroyAll(): void {
        this.blocks.forEach((_, blockId) => {
            this.destroy(blockId);
        });
    }
}

// Initialize tabs when DOM is ready
const jankxTabs = new JankxTabs();

// Export for global access
declare global {
    interface Window {
        JankxTabs: typeof JankxTabs;
        jankxTabs: JankxTabs;
    }
}

window.JankxTabs = JankxTabs;
window.jankxTabs = jankxTabs;

export default jankxTabs;

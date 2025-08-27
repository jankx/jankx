/**
 * Offcanvas Sidebar Frontend TypeScript
 * Handles sidebar interactions and animations
 */

interface OffcanvasSidebarState {
    isOpen: boolean;
    element: HTMLElement;
    sidebar: HTMLElement;
}

interface OffcanvasSidebarEventDetail {
    element: HTMLElement;
    sidebar: HTMLElement;
}

interface OffcanvasSidebarElement extends HTMLElement {
    offcanvasInstance?: OffcanvasSidebar;
}

declare global {
    interface Window {
        OffcanvasSidebar: typeof OffcanvasSidebar;
        offcanvasSidebarInstances: OffcanvasSidebar[];
        openOffcanvasSidebar: (blockId: string) => void;
        closeOffcanvasSidebar: (blockId: string) => void;
        toggleOffcanvasSidebar: (blockId: string) => void;
        wp?: {
            domReady: (callback: () => void) => void;
        };
    }
}

(function($: JQueryStatic) {
    'use strict';

    // Offcanvas Sidebar Class
    class OffcanvasSidebar {
        private element: OffcanvasSidebarElement;
        private trigger: HTMLElement | null;
        private sidebar: HTMLElement | null;
        private overlay: HTMLElement | null;
        private closeButton: HTMLElement | null;
        private isOpen: boolean;
        private autoCloseTimer: number | null;
        private previousFocus: Element | null;

        constructor(element: OffcanvasSidebarElement) {
            this.element = element;
            this.trigger = element.querySelector('.offcanvas-trigger');
            this.sidebar = element.querySelector('.offcanvas-sidebar');
            this.overlay = element.querySelector('.offcanvas-overlay');
            this.closeButton = element.querySelector('.close-button');
            this.isOpen = false;
            this.autoCloseTimer = null;
            this.previousFocus = null;

            this.init();
        }

        private init(): void {
            this.bindEvents();
            this.setupAccessibility();
        }

        private bindEvents(): void {
            // Trigger button click
            if (this.trigger) {
                this.trigger.addEventListener('click', (e: Event) => {
                    e.preventDefault();
                    this.toggle();
                });
            }

            // Close button click
            if (this.closeButton) {
                this.closeButton.addEventListener('click', (e: Event) => {
                    e.preventDefault();
                    this.close();
                });
            }

            // Overlay click
            if (this.overlay) {
                this.overlay.addEventListener('click', (e: Event) => {
                    e.preventDefault();
                    const closeOnOverlayClick = this.element.dataset.closeOnOverlayClick === 'true';
                    if (closeOnOverlayClick) {
                        this.close();
                    }
                });
            }

            // Escape key
            document.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'Escape' && this.isOpen) {
                    const closeOnEscape = this.element.dataset.closeOnEscape === 'true';
                    if (closeOnEscape) {
                        this.close();
                    }
                }
            });

            // Prevent body scroll when sidebar is open
            this.element.addEventListener('transitionend', () => {
                if (this.isOpen) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
        }

        private setupAccessibility(): void {
            // Add ARIA attributes
            if (this.trigger) {
                this.trigger.setAttribute('aria-expanded', 'false');
                this.trigger.setAttribute('aria-controls', this.sidebar?.id || 'offcanvas-sidebar');
                this.trigger.setAttribute('aria-label', 'Toggle sidebar menu');
            }

            if (this.sidebar) {
                this.sidebar.setAttribute('role', 'dialog');
                this.sidebar.setAttribute('aria-modal', 'true');
                this.sidebar.setAttribute('aria-label', 'Sidebar navigation');
            }

            if (this.closeButton) {
                this.closeButton.setAttribute('aria-label', 'Close sidebar');
            }
        }

        public open(): void {
            if (this.isOpen) return;

            this.isOpen = true;
            this.element.classList.add('sidebar-open');

            // Update ARIA attributes
            if (this.trigger) {
                this.trigger.setAttribute('aria-expanded', 'true');
            }

            // Focus management
            this.focusTrap();

            // Auto close functionality
            this.setupAutoClose();

            // Dispatch custom event
            this.dispatchEvent('offcanvasSidebarOpened', {
                element: this.element,
                sidebar: this.sidebar!
            });
        }

        public close(): void {
            if (!this.isOpen) return;

            this.isOpen = false;
            this.element.classList.remove('sidebar-open');

            // Update ARIA attributes
            if (this.trigger) {
                this.trigger.setAttribute('aria-expanded', 'false');
            }

            // Clear auto close timer
            this.clearAutoClose();

            // Restore focus
            this.restoreFocus();

            // Dispatch custom event
            this.dispatchEvent('offcanvasSidebarClosed', {
                element: this.element,
                sidebar: this.sidebar!
            });
        }

        public toggle(): void {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        private focusTrap(): void {
            if (!this.sidebar) return;

            // Focus the first focusable element in the sidebar
            const focusableElements = this.sidebar.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as NodeListOf<HTMLElement>;

            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }

            // Store the element that had focus before opening
            this.previousFocus = document.activeElement;
        }

        private restoreFocus(): void {
            // Restore focus to the previous element
            if (this.previousFocus && typeof (this.previousFocus as HTMLElement).focus === 'function') {
                (this.previousFocus as HTMLElement).focus();
            }
        }

        private setupAutoClose(): void {
            const autoClose = this.element.dataset.autoClose === 'true';
            const autoCloseDelay = parseInt(this.element.dataset.autoCloseDelay || '5000');

            if (autoClose && autoCloseDelay > 0) {
                this.autoCloseTimer = window.setTimeout(() => {
                    this.close();
                }, autoCloseDelay);
            }
        }

        private clearAutoClose(): void {
            if (this.autoCloseTimer) {
                clearTimeout(this.autoCloseTimer);
                this.autoCloseTimer = null;
            }
        }

        private dispatchEvent(eventName: string, detail: OffcanvasSidebarEventDetail): void {
            const event = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                cancelable: true
            });
            this.element.dispatchEvent(event);
        }

        // Public methods for external control
        public getState(): OffcanvasSidebarState {
            return {
                isOpen: this.isOpen,
                element: this.element,
                sidebar: this.sidebar!
            };
        }

        public destroy(): void {
            this.clearAutoClose();
            this.close();
            // Remove event listeners if needed
        }
    }

    // Global functions for external access
    window.OffcanvasSidebar = OffcanvasSidebar;

    // Initialize all offcanvas sidebars
    function initOffcanvasSidebars(): OffcanvasSidebar[] {
        const sidebars = document.querySelectorAll('.offcanvas-sidebar-block') as NodeListOf<OffcanvasSidebarElement>;
        const sidebarInstances: OffcanvasSidebar[] = [];

        sidebars.forEach((sidebar) => {
            const instance = new OffcanvasSidebar(sidebar);
            sidebarInstances.push(instance);

            // Store instance on element for external access
            sidebar.offcanvasInstance = instance;
        });

        // Store all instances globally
        window.offcanvasSidebarInstances = sidebarInstances;

        return sidebarInstances;
    }

    // Global control functions
    window.openOffcanvasSidebar = function(blockId: string): void {
        const sidebar = document.getElementById(blockId) as OffcanvasSidebarElement;
        if (sidebar && sidebar.offcanvasInstance) {
            sidebar.offcanvasInstance.open();
        }
    };

    window.closeOffcanvasSidebar = function(blockId: string): void {
        const sidebar = document.getElementById(blockId) as OffcanvasSidebarElement;
        if (sidebar && sidebar.offcanvasInstance) {
            sidebar.offcanvasInstance.close();
        }
    };

    window.toggleOffcanvasSidebar = function(blockId: string): void {
        const sidebar = document.getElementById(blockId) as OffcanvasSidebarElement;
        if (sidebar && sidebar.offcanvasInstance) {
            sidebar.offcanvasInstance.toggle();
        }
    };

    // Initialize on DOM ready
    $(document).ready(function() {
        initOffcanvasSidebars();
    });

    // Re-initialize on AJAX content load
    $(document).on('content-loaded', function() {
        initOffcanvasSidebars();
    });

    // Handle dynamic content (for themes that support it)
    if (typeof wp !== 'undefined' && wp.domReady) {
        wp.domReady(function() {
            initOffcanvasSidebars();
        });
    }

    // MutationObserver for dynamic content
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations: MutationRecord[]) {
            mutations.forEach(function(mutation: MutationRecord) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node: Node) {
                        if (node.nodeType === 1 && (node as Element).classList && (node as Element).classList.contains('offcanvas-sidebar-block')) {
                            const element = node as OffcanvasSidebarElement;
                            if (!element.offcanvasInstance) {
                                new OffcanvasSidebar(element);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

})(jQuery);

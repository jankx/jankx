/**
 * Language Switcher Frontend TypeScript
 * Position engine for dropdown menu
 */

interface DropdownPosition {
    alignRight: boolean;
    alignTop: boolean;
}

class LanguageSwitcherPositionEngine {
    private dropdowns: NodeListOf<Element>;

    constructor() {
        this.dropdowns = document.querySelectorAll('.language-switcher-dropdown-wrapper');
        this.init();
    }

    private init(): void {
        this.dropdowns.forEach((dropdown) => {
            this.setupDropdown(dropdown as HTMLElement);
        });

        // Re-calculate on window resize
        window.addEventListener('resize', () => {
            this.dropdowns.forEach((dropdown) => {
                this.adjustDropdownPosition(dropdown as HTMLElement);
            });
        });
    }

    private setupDropdown(wrapper: HTMLElement): void {
        const dropdown = wrapper.querySelector('.language-switcher-dropdown') as HTMLElement;
        const menu = wrapper.querySelector('.language-switcher-dropdown-menu') as HTMLElement;

        if (!dropdown || !menu) return;

        // Adjust position on hover
        wrapper.addEventListener('mouseenter', () => {
            this.adjustDropdownPosition(wrapper);
        });

        // Adjust position on focus
        dropdown.addEventListener('focus', () => {
            this.adjustDropdownPosition(wrapper);
        });
    }

    private adjustDropdownPosition(wrapper: HTMLElement): void {
        const menu = wrapper.querySelector('.language-switcher-dropdown-menu') as HTMLElement;
        if (!menu) return;

        const position = this.calculateOptimalPosition(wrapper, menu);

        // Reset classes
        menu.classList.remove('align-right', 'align-left', 'align-top', 'align-bottom');

        // Apply position classes
        if (position.alignRight) {
            menu.classList.add('align-right');
        } else {
            menu.classList.add('align-left');
        }

        if (position.alignTop) {
            menu.classList.add('align-top');
        } else {
            menu.classList.add('align-bottom');
        }
    }

    private calculateOptimalPosition(wrapper: HTMLElement, menu: HTMLElement): DropdownPosition {
        const wrapperRect = wrapper.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Check horizontal overflow
        const rightSpace = viewportWidth - wrapperRect.right;
        const leftSpace = wrapperRect.left;
        const menuWidth = menuRect.width || 120; // Fallback width

        // Check vertical overflow
        const bottomSpace = viewportHeight - wrapperRect.bottom;
        const topSpace = wrapperRect.top;
        const menuHeight = menuRect.height || 200; // Fallback height

        return {
            // Align right if not enough space on the left and more space on right
            alignRight: rightSpace < menuWidth && leftSpace > rightSpace,
            // Align top (show above) if not enough space below
            alignTop: bottomSpace < menuHeight && topSpace > bottomSpace
        };
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        new LanguageSwitcherPositionEngine();
    });
} else {
    new LanguageSwitcherPositionEngine();
}

// Re-initialize on AJAX content load
document.addEventListener('content-loaded', function() {
    new LanguageSwitcherPositionEngine();
});

// Handle dynamic content (for themes that support it)
if (typeof wp !== 'undefined' && wp.domReady) {
    wp.domReady(function() {
        new LanguageSwitcherPositionEngine();
    });
}

// Export for external use
(window as any).LanguageSwitcherPositionEngine = LanguageSwitcherPositionEngine;


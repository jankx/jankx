/**
 * Responsive Menu Controller for mmenu.js
 * Handles switching between mmenu (mobile) and normal menu (desktop)
 */

import { MmenuStateManager, MenuState } from '../core/state/state-manager';
import { DOMController } from '../core/state/dom-controller';
import { ObserverController } from '../core/state/observer-controller-fixed';

export interface ResponsiveMenuConfig {
    mobileBreakpoint: number;
    desktopBreakpoint: number;
    enableMobileMenu: boolean;
    enableDesktopMenu: boolean;
    mobileMenuOptions: any;
    desktopMenuOptions: any;
}

// Extend MenuState interface to include responsive properties
declare module '../core/state/state-manager' {
    interface MenuState {
        isMobile?: boolean;
        isDesktop?: boolean;
        currentMode?: 'mobile' | 'desktop' | 'destroyed';
        mobileMenuInstance?: any;
        desktopMenuElement?: HTMLElement | null;
        originalMenuHTML?: string;
    }
}

export class ResponsiveMenuController {
    private stateManager: MmenuStateManager;
    private domController: DOMController;
    private observerController: ObserverController;
    private config: ResponsiveMenuConfig;
    private menuElement: HTMLElement;
    private resizeObserver: ResizeObserver;
    private mediaQueryList: MediaQueryList;

    constructor(menuElement: HTMLElement, config: Partial<ResponsiveMenuConfig> = {}) {
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
    private initializeResponsiveController(): void {
        // Store original menu HTML
        const originalState: Partial<MenuState> = {
            originalMenuHTML: this.menuElement.outerHTML,
            isMobile: this.isMobileViewport(),
            isDesktop: this.isDesktopViewport(),
            currentMode: 'destroyed',
            mobileMenuInstance: null,
            desktopMenuElement: null
        };

        // Initialize state manager with responsive state
        this.stateManager = new MmenuStateManager(this.config.mobileMenuOptions, {});
        
        // Extend state with responsive properties
        this.stateManager.setState(originalState);

        this.domController = new DOMController(this.stateManager);
        this.observerController = new ObserverController(this.stateManager);

        // Setup responsive behavior
        this.setupResponsiveListeners();
        this.setupMediaQueryListener();
        
        // Initialize appropriate menu mode
        this.initializeCurrentMode();
    }

    /**
     * Setup responsive event listeners
     */
    private setupResponsiveListeners(): void {
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
    private setupMediaQueryListener(): void {
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
    private handleMediaQueryChange(event: MediaQueryListEvent): void {
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
    private handleViewportChange(): void {
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
    private handleModeChange(event: any): void {
        const { previousMode, currentMode } = event;
        
        // Trigger custom events for external listeners
        const customEvent = new CustomEvent('responsiveMenuModeChange', {
            detail: { previousMode, currentMode, controller: this }
        });
        this.menuElement.dispatchEvent(customEvent);
    }

    /**
     * Initialize current mode based on viewport
     */
    private initializeCurrentMode(): void {
        if (this.isMobileViewport() && this.config.enableMobileMenu) {
            this.switchToMobileMode();
        } else if (!this.isMobileViewport() && this.config.enableDesktopMenu) {
            this.switchToDesktopMode();
        }
    }

    /**
     * Switch to mobile mode (mmenu)
     */
    switchToMobileMode(): void {
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
    switchToDesktopMode(): void {
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
    private initializeMobileMenu(): void {
        if (!this.config.enableMobileMenu) return;

        try {
            // Import mmenu state version
            import('../mmenu.state').then(({ default: MmenuState }) => {
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
    private initializeDesktopMenu(): void {
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
    private destroyMobileMenu(): void {
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
    private destroyDesktopMenu(): void {
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
    private setupMobileMenuBehaviors(mobileMenu: any): void {
        // Add mobile menu specific classes
        this.menuElement.classList.add('mobile-menu');
        
        // Setup mobile menu event listeners
        this.menuElement.addEventListener('click', this.handleMobileMenuClick.bind(this));
    }

    /**
     * Setup desktop menu specific behaviors
     */
    private setupDesktopMenuBehaviors(): void {
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
    private removeDesktopMenuBehaviors(): void {
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
    private setupDesktopDropdowns(): void {
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
    private removeDesktopDropdowns(): void {
        const dropdowns = this.menuElement.querySelectorAll('.has-dropdown, .dropdown-menu');
        
        dropdowns.forEach(element => {
            element.classList.remove('has-dropdown', 'dropdown-menu');
        });
    }

    /**
     * Handle mobile menu clicks
     */
    private handleMobileMenuClick(event: Event): void {
        // Mobile menu specific click handling
        const target = event.target as HTMLElement;
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
    private handleDesktopMenuClick(event: Event): void {
        const target = event.target as HTMLElement;
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
    private handleDesktopMenuHover(event: Event): void {
        const target = event.target as HTMLElement;
        const menuItem = target.closest('li');
        
        if (menuItem && menuItem.classList.contains('has-dropdown')) {
            // Show dropdown on hover
            this.showDropdown(menuItem);
        }
    }

    /**
    ied menu leave
     */
    private handleDesktopMenuLeave(event: Event): void {
        const target = event.target as HTMLElement;
        const menuItem = target.closest('li');
        
        if (menuItem && menuItem.classList.contains('has-dropdown')) {
            // Hide dropdown on leave
            this.hideDropdown(menuItem);
        }
    }

    /**
     * Toggle menu item (for desktop dropdown)
     */
    private toggleMenuItem(menuItem: HTMLElement): void {
        if (menuItem.classList.contains('dropdown-open')) {
            this.hideDropdown(menuItem);
        } else {
            this.showDropdown(menuItem);
        }
    }

    /**
     * Toggle dropdown menu
     */
    private toggleDropdown(menuItem: HTMLElement): void {
        if (menuItem.classList.contains('dropdown-open')) {
            this.hideDropdown(menuItem);
        } else {
            this.showDropdown(menuItem);
        }
    }

    /**
     * Show dropdown menu
     */
    private showDropdown(menuItem: HTMLElement): void {
        // Close other dropdowns
        const openDropdowns = this.menuElement.querySelectorAll('.dropdown-open');
        openDropdowns.forEach(openItem => {
            if (openItem !== menuItem) {
                this.hideDropdown(openItem as HTMLElement);
            }
        });

        // Show current dropdown
        menuItem.classList.add('dropdown-open');
        const submenu = menuItem.querySelector('.dropdown-menu') as HTMLElement;
        if (submenu) {
            submenu.style.display = 'block';
            submenu.style.opacity = '1';
        }
    }

    /**
     * Hide dropdown menu
     */
    private hideDropdown(menuItem: HTMLElement): void {
        menuItem.classList.remove('dropdown-open');
        const submenu = menuItem.querySelector('.dropdown-menu') as HTMLElement;
        if (submenu) {
            submenu.style.display = 'none';
            submenu.style.opacity = '0';
        }
    }

    /**
     * Check if current viewport is mobile
     */
    private isMobileViewport(): boolean {
        return window.innerWidth < this.config.desktopBreakpoint;
    }

    /**
     * Check if current viewport is desktop
     */
    private isDesktopViewport(): boolean {
        return window.innerWidth >= this.config.desktopBreakpoint;
    }

    /**
     * Get current state
     */
    getState(): MenuState {
        return this.stateManager.getState();
    }

    /**
     * Force switch to specific mode
     */
    switchToMode(mode: 'mobile' | 'desktop'): void {
        if (mode === 'mobile') {
            this.switchToMobileMode();
        } else {
            this.switchToDesktopMode();
        }
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<ResponsiveMenuConfig>): void {
        this.config = { ...this.config, ...newConfig };
        
        // Re-initialize if needed
        this.initializeCurrentMode();
    }

    /**
     * Destroy responsive controller
     */
    destroy(): void {
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

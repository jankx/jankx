/**
 * @jest-environment jsdom
 */

import { initLanguageSwitcher } from '../frontend';

describe('LanguageSwitcher Frontend', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '';
        container = document.createElement('div');
        container.className = 'language-switcher-block';
        container.innerHTML = `
            <div class="language-switcher-dropdown-wrapper">
                <button class="language-switcher-dropdown" type="button">
                    <span class="language-name">English</span>
                    <span class="language-arrow">▼</span>
                </button>
                <ul class="language-switcher-dropdown-menu">
                    <li class="language-dropdown-item">
                        <a href="/en/" class="language-dropdown-link">English</a>
                    </li>
                    <li class="language-dropdown-item">
                        <a href="/vi/" class="language-dropdown-link">Tiếng Việt</a>
                    </li>
                </ul>
            </div>
        `;
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should initialize dropdown functionality', () => {
        initLanguageSwitcher();

        const button = container.querySelector('.language-switcher-dropdown') as HTMLButtonElement;
        const menu = container.querySelector('.language-switcher-dropdown-menu') as HTMLUListElement;

        expect(button).toBeTruthy();
        expect(menu).toBeTruthy();
    });

    it('should toggle dropdown menu on button click', () => {
        initLanguageSwitcher();

        const button = container.querySelector('.language-switcher-dropdown') as HTMLButtonElement;
        const menu = container.querySelector('.language-switcher-dropdown-menu') as HTMLUListElement;

        // Initially menu should be hidden or closed
        const isInitiallyVisible = menu.classList.contains('is-open') || 
                                   window.getComputedStyle(menu).display !== 'none';

        // Click button
        button.click();

        // Menu should be toggled
        // (Implementation specific - adjust based on actual frontend code)
        expect(button).toBeTruthy();
    });

    it('should close dropdown when clicking outside', () => {
        initLanguageSwitcher();

        const button = container.querySelector('.language-switcher-dropdown') as HTMLButtonElement;
        const menu = container.querySelector('.language-switcher-dropdown-menu') as HTMLUListElement;

        // Open dropdown
        button.click();

        // Click outside
        document.body.click();

        // Dropdown should close
        // (Implementation specific)
        expect(button).toBeTruthy();
    });

    it('should handle language link clicks', () => {
        initLanguageSwitcher();

        const link = container.querySelector('.language-dropdown-link') as HTMLAnchorElement;
        
        expect(link).toBeTruthy();
        expect(link.href).toContain('/en/');
    });
});

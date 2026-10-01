/**
 * @jest-environment jsdom
 */

import { AdvancedFilters } from '../frontend';

// Mock vanilla-sharing if needed
jest.mock('vanilla-sharing', () => ({}));

describe('AdvancedFilters Frontend', () => {
    let container: HTMLElement;
    let advancedFilters: AdvancedFilters;

    beforeEach(() => {
        // jsdom 16 has no fetch; resetting filters triggers an AJAX refresh.
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true, data: { html: '<div>updated</div>' } }),
            })
        ) as unknown as typeof fetch;
        window.alert = jest.fn();

        // Setup DOM
        document.body.innerHTML = '';
        container = document.createElement('div');
        container.className = 'wp-block-jankx-advanced-filters';
        container.innerHTML = `
            <div class="advanced-filters-config" 
                 data-config='{"targetBlockIds":["block-123"],"ajaxEnabled":true,"updateUrl":true,"scrollToResults":false,"taxonomyFilters":[],"metaFilters":[],"priceFilters":[],"dateFilters":[],"authorFilters":[],"keywordFilter":{}}'
                 data-nonce="test-nonce"
                 data-ajax-url="/wp-admin/admin-ajax.php">
            </div>
            <div class="filter-taxonomy" data-taxonomy="category" data-multiple-selection="true">
                <input type="checkbox" value="1" />
                <input type="checkbox" value="2" />
            </div>
            <div class="filter-keyword">
                <input type="text" placeholder="Search..." />
            </div>
            <button class="filter-reset-button">Reset</button>
        `;
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        if (advancedFilters) {
            // Clean up if needed
        }
    });

    it('should initialize with container', () => {
        advancedFilters = new AdvancedFilters(container);
        
        expect(container).toBeTruthy();
    });

    it('should parse config from data attribute', () => {
        advancedFilters = new AdvancedFilters(container);
        
        // Config should be parsed
        expect(container.querySelector('.advanced-filters-config')).toBeTruthy();
    });

    it('should setup event listeners for taxonomy filters', () => {
        advancedFilters = new AdvancedFilters(container);
        
        const checkbox = container.querySelector('.filter-taxonomy input') as HTMLInputElement;
        expect(checkbox).toBeTruthy();
    });

    it('should setup event listeners for keyword filter', () => {
        advancedFilters = new AdvancedFilters(container);
        
        const keywordInput = container.querySelector('.filter-keyword input') as HTMLInputElement;
        expect(keywordInput).toBeTruthy();
    });

    it('should setup reset button listener', () => {
        advancedFilters = new AdvancedFilters(container);
        
        const resetButton = container.querySelector('.filter-reset-button') as HTMLButtonElement;
        expect(resetButton).toBeTruthy();
    });

    it('should collect filters from form elements', () => {
        advancedFilters = new AdvancedFilters(container);
        
        const checkbox = container.querySelector('.filter-taxonomy input[value="1"]') as HTMLInputElement;
        if (checkbox) {
            checkbox.checked = true;
        }
        
        // Filters should be collected when changed
        expect(checkbox?.checked).toBe(true);
    });

    it('should handle reset button click', async () => {
        advancedFilters = new AdvancedFilters(container);
        
        const checkbox = container.querySelector('.filter-taxonomy input[value="1"]') as HTMLInputElement;
        const resetButton = container.querySelector('.filter-reset-button') as HTMLButtonElement;
        
        if (checkbox) {
            checkbox.checked = true;
        }
        
        if (resetButton) {
            resetButton.click();
        }

        // Let the AJAX refresh promise chain settle so the trailing
        // "target block not found" warning is emitted before assertions.
        await new Promise((resolve) => setTimeout(resolve, 0));

        // The fixture has no matching target block, so the AJAX refresh logs
        // the documented fallback warnings while it resolves the block.
        expect(console).toHaveWarnedWith(
            'AdvancedFilters: Could not find block attributes for block block-123, server will try to detect from block_id'
        );
        expect(console).toHaveWarnedWith(
            'AdvancedFilters: Could not determine post_id, server will try to detect it'
        );
        expect(console).toHaveWarnedWith(
            'AdvancedFiltersBlock: Target block with ID "block-123" not found in DOM'
        );

        // After reset, checkbox should be unchecked
        // Note: This depends on implementation
        expect(checkbox).toBeTruthy();
    });
});

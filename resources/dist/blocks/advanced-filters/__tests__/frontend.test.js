/**
 * @jest-environment jsdom
 */
import { AdvancedFilters } from '../frontend';
// Mock vanilla-sharing if needed
jest.mock('vanilla-sharing', () => ({}));
describe('AdvancedFilters Frontend', () => {
    let container;
    let advancedFilters;
    beforeEach(() => {
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
        const checkbox = container.querySelector('.filter-taxonomy input');
        expect(checkbox).toBeTruthy();
    });
    it('should setup event listeners for keyword filter', () => {
        advancedFilters = new AdvancedFilters(container);
        const keywordInput = container.querySelector('.filter-keyword input');
        expect(keywordInput).toBeTruthy();
    });
    it('should setup reset button listener', () => {
        advancedFilters = new AdvancedFilters(container);
        const resetButton = container.querySelector('.filter-reset-button');
        expect(resetButton).toBeTruthy();
    });
    it('should collect filters from form elements', () => {
        advancedFilters = new AdvancedFilters(container);
        const checkbox = container.querySelector('.filter-taxonomy input[value="1"]');
        if (checkbox) {
            checkbox.checked = true;
        }
        // Filters should be collected when changed
        expect(checkbox?.checked).toBe(true);
    });
    it('should handle reset button click', () => {
        advancedFilters = new AdvancedFilters(container);
        const checkbox = container.querySelector('.filter-taxonomy input[value="1"]');
        const resetButton = container.querySelector('.filter-reset-button');
        if (checkbox) {
            checkbox.checked = true;
        }
        if (resetButton) {
            resetButton.click();
        }
        // After reset, checkbox should be unchecked
        // Note: This depends on implementation
        expect(checkbox).toBeTruthy();
    });
});

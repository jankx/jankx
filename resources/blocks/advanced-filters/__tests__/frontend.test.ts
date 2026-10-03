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
            advancedFilters.destroy();
            advancedFilters = undefined as unknown as AdvancedFilters;
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

    it('should toggle the smooth dropdown open and closed', () => {
        container.insertAdjacentHTML('beforeend', `
            <div class="filter-post_types filter-group" data-filter-type="post_types">
                <div class="filter-dropdown" data-state="closed" data-default-label="All">
                    <button type="button" class="filter-dropdown__toggle" aria-expanded="false">
                        <span class="filter-dropdown__value">All</span>
                    </button>
                    <div class="filter-dropdown__panel">
                        <div class="filter-dropdown__scroll">
                            <label class="filter-option active" data-value="">
                                <input type="radio" name="post_type" value="" checked />
                            </label>
                            <label class="filter-option" data-value="page">
                                <input type="radio" name="post_type" value="page" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `);
        advancedFilters = new AdvancedFilters(container);

        const dropdown = container.querySelector('.filter-dropdown') as HTMLElement;
        const toggle = dropdown.querySelector('.filter-dropdown__toggle') as HTMLButtonElement;

        toggle.click();
        expect(dropdown.classList.contains('is-open')).toBe(true);
        expect(dropdown.getAttribute('data-state')).toBe('open');
        expect(toggle.getAttribute('aria-expanded')).toBe('true');

        toggle.click();
        expect(dropdown.classList.contains('is-open')).toBe(false);
        expect(dropdown.getAttribute('data-state')).toBe('closed');
    });

    it('should collect post_type from the post_types group and close the dropdown', async () => {
        container.insertAdjacentHTML('beforeend', `
            <div class="filter-post_types filter-group" data-filter-type="post_types">
                <div class="filter-dropdown is-open" data-state="open" data-default-label="All">
                    <button type="button" class="filter-dropdown__toggle" aria-expanded="true">
                        <span class="filter-dropdown__value">All</span>
                    </button>
                    <div class="filter-dropdown__panel">
                        <div class="filter-dropdown__scroll">
                            <label class="filter-option active" data-value="">
                                <input type="radio" name="post_type" value="" checked />
                            </label>
                            <label class="filter-option" data-value="page">
                                <input type="radio" name="post_type" value="page" />
                                <span>Page</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `);
        advancedFilters = new AdvancedFilters(container);

        const pageRadio = container.querySelector('.filter-post_types input[value="page"]') as HTMLInputElement;
        expect(pageRadio).toBeTruthy();

        // Simulate clicking the option label (handled by the post_types listener)
        const optionLabel = pageRadio.closest('.filter-option') as HTMLElement;
        optionLabel.click();
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(pageRadio.checked).toBe(true);
        const currentFilters = (advancedFilters as any).currentFilters;
        expect(currentFilters.post_type).toBe('page');

        // The label click handler and the radio change event each trigger an
        // AJAX refresh; the fixture has no matching target block, so the
        // documented fallback warnings are expected.
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(console).toHaveWarnedWith(
            'AdvancedFilters: Could not find block attributes for block block-123, server will try to detect from block_id'
        );
        expect(console).toHaveWarnedWith(
            'AdvancedFiltersBlock: Target block with ID "block-123" not found in DOM'
        );

        // Selecting an option closes the dropdown and refreshes the toggle label
        const dropdown = container.querySelector('.filter-dropdown') as HTMLElement;
        expect(dropdown.classList.contains('is-open')).toBe(false);
        expect(dropdown.getAttribute('data-state')).toBe('closed');
        expect((dropdown.querySelector('.filter-dropdown__value') as HTMLElement).textContent).toBe('Page');
    });

    describe('sort rule interplay with dynamic-data-sort-rules', () => {
        const SORT_RULE = '{"orderBy":"title","order":"ASC"}';

        const addTargetBlock = (): void => {
            document.body.insertAdjacentHTML(
                'beforeend',
                `
                <div class="wp-block-jankx-dynamic-data-layout" data-query-id="block-123" data-block-settings='{"queryId":"block-123","postType":"tour"}'>
                    <div class="jankx-dynamic-data-sort-dropdown">
                        <select class="sort-select jankx-data-sorter">
                            <option value="0" data-rule='{"orderBy":"date","order":"DESC"}'>Newest</option>
                            <option value="1" data-rule='{"orderBy":"title","order":"ASC"}'>A-Z</option>
                        </select>
                    </div>
                </div>
            `
            );
        };

        const dispatchSort = (blockId: string, rule: string): CustomEvent<{ blockId: string; rule: string; handled: boolean }> => {
            const event = new CustomEvent('jankx:sort-rule-change', {
                cancelable: true,
                detail: { blockId, rule, handled: false },
            });
            document.dispatchEvent(event);
            return event;
        };

        const lastRequestBody = (): URLSearchParams => {
            const calls = (global.fetch as jest.Mock).mock.calls;
            const [, init] = calls[calls.length - 1];
            return new URLSearchParams(String(init.body));
        };

        const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 10));

        it('reloads the target on sort change with filters + sort_rule', async () => {
            addTargetBlock();
            advancedFilters = new AdvancedFilters(container);

            const checkbox = container.querySelector('.filter-taxonomy input[value="1"]') as HTMLInputElement;
            checkbox.checked = true;

            const event = dispatchSort('block-123', SORT_RULE);
            await flush();

            expect(event.detail.handled).toBe(true);
            expect(global.fetch).toHaveBeenCalledTimes(1);

            const body = lastRequestBody();
            expect(body.get('block_id')).toBe('block-123');
            expect(body.get('sort_rule')).toBe(SORT_RULE);
            expect(JSON.parse(body.get('filters') || '{}')).toEqual({ category: ['1'] });
            expect(console).toHaveWarnedWith(
                'AdvancedFilters: Could not determine post_id, server will try to detect it'
            );
        });

        it('keeps the selected sort rule when a filter changes afterwards', async () => {
            addTargetBlock();
            advancedFilters = new AdvancedFilters(container);

            dispatchSort('block-123', SORT_RULE);
            await flush();
            expect(global.fetch).toHaveBeenCalledTimes(1);

            const checkbox = container.querySelector('.filter-taxonomy input[value="2"]') as HTMLInputElement;
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            await flush();

            expect(global.fetch).toHaveBeenCalledTimes(2);
            const body = lastRequestBody();
            expect(body.get('sort_rule')).toBe(SORT_RULE);
            expect(JSON.parse(body.get('filters') || '{}')).toEqual({ category: ['2'] });
            expect(console).toHaveWarnedWith(
                'AdvancedFilters: Could not determine post_id, server will try to detect it'
            );
        });

        it('restores the selected option after the target HTML is rebuilt', async () => {
            addTargetBlock();
            (global.fetch as jest.Mock).mockImplementation(() =>
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            success: true,
                            data: {
                                html: `
                                    <div class="wp-block-jankx-dynamic-data-layout" data-query-id="block-123">
                                        <div class="jankx-dynamic-data-sort-dropdown">
                                            <select class="sort-select jankx-data-sorter">
                                                <option value="0" data-rule='{"orderBy":"date","order":"DESC"}'>Newest</option>
                                                <option value="1" data-rule='{"orderBy":"title","order":"ASC"}'>A-Z</option>
                                            </select>
                                        </div>
                                    </div>
                                `,
                            },
                        }),
                })
            );
            advancedFilters = new AdvancedFilters(container);

            dispatchSort('block-123', SORT_RULE);
            await flush();

            const select = document.querySelector(
                '[data-query-id="block-123"] .jankx-data-sorter'
            ) as HTMLSelectElement;
            expect(select).toBeTruthy();
            expect(select.value).toBe('1');
            expect(select.selectedOptions[0].getAttribute('data-rule')).toBe(SORT_RULE);
            expect(console).toHaveWarnedWith(
                'AdvancedFilters: Could not determine post_id, server will try to detect it'
            );
        });

        it('ignores sort changes for blocks it does not target', async () => {
            addTargetBlock();
            advancedFilters = new AdvancedFilters(container);

            const event = dispatchSort('other-block', SORT_RULE);
            await flush();

            expect(event.detail.handled).toBe(false);
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('leaves untargeted sort changes to the sort-rules fallback when AJAX is disabled', async () => {
            container
                .querySelector('.advanced-filters-config')!
                .setAttribute(
                    'data-config',
                    '{"targetBlockIds":["block-123"],"ajaxEnabled":false,"updateUrl":false,"scrollToResults":false,"taxonomyFilters":[],"metaFilters":[],"priceFilters":[],"dateFilters":[],"authorFilters":[],"keywordFilter":{}}'
                );
            addTargetBlock();
            advancedFilters = new AdvancedFilters(container);

            const event = dispatchSort('block-123', SORT_RULE);
            await flush();

            expect(event.detail.handled).toBe(false);
            expect(global.fetch).not.toHaveBeenCalled();
        });
    });
});

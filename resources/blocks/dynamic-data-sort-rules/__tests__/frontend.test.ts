/**
 * @jest-environment jsdom
 */

const RULE = '{"orderBy":"title","order":"ASC"}';

const SORTER_HTML = `
    <div class="wp-block-jankx-dynamic-data-layout" data-query-id="q-1" data-block-settings='{"queryId":"q-1","postType":"tour"}'>
        <div class="jankx-dynamic-data-sort-dropdown">
            <select class="sort-select jankx-data-sorter">
                <option value="0" data-rule='{"orderBy":"date","order":"DESC"}'>Newest</option>
                <option value="1" data-rule='{"orderBy":"title","order":"ASC"}'>A-Z</option>
            </select>
        </div>
    </div>
`;

describe('Dynamic Data Sort Rules Frontend', () => {
    let fetchMock: jest.Mock;

    beforeEach(() => {
        fetchMock = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        success: true,
                        data: { html: SORTER_HTML },
                    }),
            })
        ) as unknown as jest.Mock;
        global.fetch = fetchMock as unknown as typeof fetch;
        (window as any).jankxDynamicDataLayoutView = {
            ajaxUrl: '/wp-admin/admin-ajax.php',
            nonce: 'test-nonce',
        };

        document.body.innerHTML = SORTER_HTML;
    });

    afterAll(() => {
        delete (window as any).jankxDynamicDataLayoutView;
    });

    const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 10));

    const changeSorter = (value: string): void => {
        const select = document.querySelector('.jankx-data-sorter') as HTMLSelectElement;
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
    };

    it('is registered after import', () => {
        // Importing the module must attach the delegated document listener.
        require('../frontend');
        expect(typeof document).toBe('object');
    });

    it('reloads the target layout with the selected rule when nobody handles the event', async () => {
        require('../frontend');

        changeSorter('1');
        await flush();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const body = new URLSearchParams(String(fetchMock.mock.calls[0][1].body));
        expect(body.get('action')).toBe('jankx_dynamic_data_layout_filter');
        expect(body.get('block_id')).toBe('q-1');
        expect(body.get('sort_rule')).toBe(RULE);
        expect(body.get('filters')).toBe('{}');
        expect(body.get('nonce')).toBe('test-nonce');

        // The rebuilt dropdown gets the visitor's selection back.
        const select = document.querySelector(
            '[data-query-id="q-1"] .jankx-data-sorter'
        ) as HTMLSelectElement;
        expect(select.value).toBe('1');
        expect(select.selectedOptions[0].getAttribute('data-rule')).toBe(RULE);
    });

    it('announces the change so an advanced-filters instance can take over', async () => {
        require('../frontend');

        const details: Array<{ blockId: string; rule: string; handled: boolean }> = [];
        const listener = (event: Event): void => {
            const detail = (event as CustomEvent).detail;
            detail.handled = true;
            details.push(detail);
        };
        document.addEventListener('jankx:sort-rule-change', listener);

        try {
            changeSorter('1');
            await flush();

            expect(details).toHaveLength(1);
            expect(details[0].blockId).toBe('q-1');
            expect(details[0].rule).toBe(RULE);
            expect(details[0].handled).toBe(true);
            // The owner of the reload performs it — no fallback request.
            expect(fetchMock).not.toHaveBeenCalled();
        } finally {
            document.removeEventListener('jankx:sort-rule-change', listener);
        }
    });

    it('ignores changes on selects that are not sorters', async () => {
        require('../frontend');

        document.body.insertAdjacentHTML(
            'beforeend',
            '<select class="other-select"><option value="1">x</option></select>'
        );
        const other = document.querySelector('.other-select') as HTMLSelectElement;
        other.value = '1';
        other.dispatchEvent(new Event('change', { bubbles: true }));
        await flush();

        expect(fetchMock).not.toHaveBeenCalled();
    });
});

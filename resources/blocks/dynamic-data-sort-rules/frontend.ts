/**
 * Dynamic Data Sort Rules - Frontend JavaScript
 *
 * The sorter <select> lives inside a dynamic-data-layout block and is rebuilt
 * on every AJAX update, so all listeners are delegated on `document`.
 *
 * On change a `jankx:sort-rule-change` CustomEvent is dispatched. The
 * advanced-filters block listens for it and performs the reload itself when it
 * targets this layout (keeping the current filter values applied). When nobody
 * handles the event, this module reloads the layout on its own so a plain
 * dynamic-data-layout + sort-rules page still refreshes when the value changes.
 */

interface SortRuleChangeDetail {
    blockId: string;
    rule: string;
    handled: boolean;
}

const SORTER_SELECTOR = 'select.jankx-data-sorter';

function findTarget(blockId: string): HTMLElement | null {
    return document.querySelector(
        `[data-query-id="${blockId}"], [data-block-id="${blockId}"]`
    ) as HTMLElement | null;
}

function restoreSelection(target: HTMLElement, rule: string): void {
    if (!rule) return;

    const select = target.querySelector(SORTER_SELECTOR) as HTMLSelectElement | null;
    if (!select) return;

    const match = Array.from(select.options).find(
        (option) => option.getAttribute('data-rule') === rule
    );
    if (match) {
        select.value = match.value;
    }
}

function reinitializeBlockScripts(element: HTMLElement): void {
    if (element.querySelector('.dynamic-data-layout-carousel')) {
        document.dispatchEvent(
            new CustomEvent('jankx:reinitialize-carousel', { detail: { element } })
        );
    }

    if (element.querySelector('.jankx-load-more-button')) {
        document.dispatchEvent(
            new CustomEvent('jankx:reinitialize-load-more', { detail: { element } })
        );
    }
}

function resolvePostId(): number {
    const bodyPostId = document.body.getAttribute('data-post-id');
    if (bodyPostId) return parseInt(bodyPostId, 10) || 0;

    const match = document.body.className.match(/postid-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

async function reloadLayout(blockId: string, rule: string): Promise<void> {
    const target = findTarget(blockId);
    if (!target) {
        console.warn(`SortRules: Target block with ID "${blockId}" not found in DOM`);
        return;
    }

    const localized = (window as any).jankxDynamicDataLayoutView || {};
    const ajaxUrl = localized.ajaxUrl || '/wp-admin/admin-ajax.php';
    const nonce = localized.nonce || '';
    if (!nonce) {
        console.error('SortRules: Nonce is missing, cannot reload the layout.');
        return;
    }

    // Reuse the full settings payload so the server renders an identical
    // response to a filter-triggered update (templates, ratios, sorter rules).
    let attributesJson = target.getAttribute('data-block-settings') || '';
    if (!attributesJson) {
        attributesJson = JSON.stringify({ queryId: blockId });
    }

    const params = new URLSearchParams({
        action: 'jankx_dynamic_data_layout_filter',
        nonce: nonce,
        block_id: blockId,
        attributes: attributesJson,
        filters: '{}',
    });
    if (rule) {
        params.set('sort_rule', rule);
    }

    const postId = resolvePostId();
    if (postId > 0) {
        params.append('post_id', String(postId));
    }

    try {
        const response = await fetch(ajaxUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
            credentials: 'same-origin',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.success || !data.data || !data.data.html) {
            throw new Error(data?.data?.message || data?.data || 'Unknown error');
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = String(data.data.html).trim();
        const source = tempDiv.firstElementChild;

        if (source) {
            target.className = source.className;
            Array.from(source.attributes).forEach((attr) => {
                if (attr.name === 'id') return;
                target.setAttribute(attr.name, attr.value);
            });
            target.innerHTML = source.innerHTML;
        } else {
            target.innerHTML = data.data.html;
        }

        restoreSelection(target, rule);
        reinitializeBlockScripts(target);
    } catch (error) {
        console.error('SortRules: Layout reload failed:', error);
    }
}

function handleSorterChange(event: Event): void {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement) || !select.classList.contains('jankx-data-sorter')) {
        return;
    }

    const wrapper = select.closest('[data-query-id], [data-block-id]') as HTMLElement | null;
    const blockId =
        wrapper?.getAttribute('data-query-id') || wrapper?.getAttribute('data-block-id') || '';
    if (!blockId) return;

    const rule = select.selectedOptions[0]?.getAttribute('data-rule') || '';

    const changeEvent = new CustomEvent<SortRuleChangeDetail>('jankx:sort-rule-change', {
        bubbles: false,
        cancelable: true,
        detail: { blockId, rule, handled: false },
    });
    document.dispatchEvent(changeEvent);

    // An advanced-filters instance took ownership of the reload (it will also
    // keep the current filter values applied). Otherwise reload directly.
    if (changeEvent.detail.handled) return;

    void reloadLayout(blockId, rule);
}

// Delegated so the listener survives the innerHTML swap after each reload.
document.addEventListener('change', handleSorterChange, false);

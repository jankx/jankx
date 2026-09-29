export const COUNTER_SELECTOR = '.wp-block-jankx-loop-index-counter';

export type IndexOptions = {
    start?: number | string;
    padStart?: number | string;
    prefix?: string;
    suffix?: string;
};

export type IndexResult = {
    index: number;
    total: number;
    inLoop: boolean;
};

type DocumentWatcher = {
    frame: number | null;
    listeners: Set<() => void>;
    observer: MutationObserver;
};

function toInt(value: unknown, fallback: number): number {
    const parsed = parseInt(String(value ?? ''), 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

export function formatIndex(index: number, options: IndexOptions = {}): string {
    const start = toInt(options.start, 1);
    const pad = Math.max(0, toInt(options.padStart, 0));

    let value = String(Math.max(0, start + index));
    if (pad > value.length) {
        value = '0'.repeat(pad - value.length) + value;
    }

    return `${options.prefix ?? ''}${value}${options.suffix ?? ''}`;
}

export function findCounterGroup(element: HTMLElement | null): HTMLElement | null {
    if (!element) {
        return null;
    }

    const doc = element.ownerDocument;
    let node: HTMLElement | null = element;

    while (node?.parentElement) {
        const parent = node.parentElement as HTMLElement;
        if (parent.querySelectorAll(COUNTER_SELECTOR).length > 1) {
            return parent;
        }
        if (parent === doc.body || parent === doc.documentElement) {
            break;
        }
        node = parent;
    }

    return null;
}

export function getCounterGroupItems(group: HTMLElement): HTMLElement[] {
    return Array.from(group.querySelectorAll(COUNTER_SELECTOR)) as HTMLElement[];
}

export function resolveIndex(element: HTMLElement | null): IndexResult {
    const group = findCounterGroup(element);

    if (!group || !element) {
        return { index: 0, total: 1, inLoop: false };
    }

    const items = getCounterGroupItems(group);
    const index = items.indexOf(element);

    if (index < 0) {
        return { index: 0, total: 1, inLoop: false };
    }

    return { index, total: items.length, inLoop: items.length > 1 };
}

export function renderCounter(element: HTMLElement): void {
    const { index, total } = resolveIndex(element);
    const text = formatIndex(index, {
        start: element.dataset.start,
        padStart: element.dataset.pad,
        prefix: element.dataset.prefix,
        suffix: element.dataset.suffix,
    });

    if (element.textContent !== text) {
        element.textContent = text;
    }
    element.dataset.jankxLoopIndex = String(index + 1);
    element.dataset.jankxLoopTotal = String(total);
}

export function getCounters(root: ParentNode): HTMLElement[] {
    const elements = Array.from(root.querySelectorAll(COUNTER_SELECTOR)) as HTMLElement[];

    if (root instanceof Element && root.matches(COUNTER_SELECTOR)) {
        elements.unshift(root as HTMLElement);
    }

    return elements;
}

const watchers = new WeakMap<Document, DocumentWatcher>();

function notify(watcher: DocumentWatcher): void {
    if (watcher.frame !== null) {
        return;
    }

    watcher.frame = window.requestAnimationFrame(() => {
        watcher.frame = null;
        watcher.listeners.forEach((listener) => listener());
    });
}

export function watchDocument(doc: Document, listener: () => void): () => void {
    let watcher = watchers.get(doc);

    if (!watcher) {
        watcher = {
            frame: null,
            listeners: new Set(),
            observer: new MutationObserver(() => notify(watcher as DocumentWatcher)),
        };
        watcher.observer.observe(doc.body, { childList: true, subtree: true });
        watchers.set(doc, watcher);
    }

    const current = watcher;
    current.listeners.add(listener);

    return () => {
        current.listeners.delete(listener);

        if (current.listeners.size === 0) {
            current.observer.disconnect();
            if (current.frame !== null) {
                window.cancelAnimationFrame(current.frame);
                current.frame = null;
            }
            watchers.delete(doc);
        }
    };
}

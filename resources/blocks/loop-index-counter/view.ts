import { getCounters, renderCounter, watchDocument } from './utils';

function boot(): void {
    const doc = document;
    const sync = () => {
        getCounters(doc).forEach(renderCounter);
    };

    sync();
    watchDocument(doc, sync);

    window.addEventListener('load', sync);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

/**
 * Advanced Button Frontend Script
 */

// Define global interfaces
interface JankxModal {
    show: (modalId: string, triggerElement?: HTMLElement) => void;
    hide: (modalId: string) => void;
}

interface MicroModal {
    show: (modalId: string) => void;
    close: (modalId: string) => void;
}

declare global {
    interface Window {
        JankxModal?: JankxModal;
        MicroModal?: MicroModal;
    }
}

(function () {
    'use strict';

    const resolveValue = (source: string, trigger: HTMLElement): string => {
        switch (source) {
            case 'button_title':
                return trigger.getAttribute('title') || (trigger.querySelector('.button-text')?.textContent || '');
            case 'current_post_title':
                return trigger.getAttribute('data-current-post-title') || '';
            case 'current_post_id':
                return trigger.getAttribute('data-current-object-id') || '';
            case 'current_url':
                return trigger.getAttribute('data-current-url') || window.location.href;
            case 'current_featured_image_url':
                return trigger.getAttribute('data-current-featured-image-url') || '';
            case 'current_featured_image_id':
                return trigger.getAttribute('data-current-featured-image-id') || '';
            default:
                return '';
        }
    };

    function initAdvancedButtons() {
        const links = Array.from(document.querySelectorAll('.jankx-advanced-button__link')) as HTMLElement[];
        const bodyClass = document.body.className || '';
        const match = bodyClass.match(/post-type-([^\s]+)/);
        links.forEach(link => {
            const layout = link.closest('.wp-block-jankx-dynamic-data-layout') as HTMLElement | null;
            const contextPostType = (layout && layout.getAttribute('data-post-type')) || (match ? match[1] : '');
            const conditionType = link.getAttribute('data-condition-type') || 'always';
            const targetPostType = link.getAttribute('data-show-for-post-type') || '';
            if (conditionType === 'post-type') {
                const wrapper = link.closest('.wp-block-jankx-advanced-button') as HTMLElement | null;
                if (targetPostType && contextPostType && targetPostType !== contextPostType) {
                    if (wrapper) {
                        wrapper.style.display = 'none';
                    } else {
                        link.style.display = 'none';
                    }
                }
            }
        });
        const buttons = document.querySelectorAll('.jankx-button-modal-trigger');
        buttons.forEach(button => {
            // Check if event listener is already attached (to avoid duplicates if called multiple times)
            if (button.getAttribute('data-jankx-click-attached') === 'true') {
                return;
            }

            button.addEventListener('click', function (e) {
                e.preventDefault();

                const trigger = e.currentTarget as HTMLElement;
                // Try the new `data-modal-id` attribute first, then fallback to Micromodal style
                const modalIdAttr = trigger.getAttribute('data-modal-id');
                const micromodalAttr = trigger.getAttribute('data-micromodal-trigger');
                const modalId = modalIdAttr || micromodalAttr;

                // Extract dynamic form data and dispatch event
                const formData: Record<string, any> = {};
                Array.from(trigger.attributes).forEach(attr => {
                    if (attr.name.startsWith('data-form-')) {
                        const key = attr.name.replace('data-form-', '');
                        formData[key] = attr.value;
                    }
                });

                if (Object.keys(formData).length > 0) {
                    document.dispatchEvent(new CustomEvent('formello:update', {
                        detail: {
                            data: formData,
                            triggerId: trigger.id
                        }
                    }));

                    // Support update HTML data attributes
                    if (formData.mappings !== undefined && formData.mappings.length > 0) {
                        const mappings = JSON.parse(formData.mappings || '[]');
                        if (Array.isArray(mappings) && mappings.length > 0) {
                            mappings.forEach(function (item, index) {
                                const val = resolveValue(item.source, trigger);
                                const elms = document.querySelectorAll(item.selector);
                                if (elms) {
                                    elms.forEach(function (elm: Element) {
                                        if ((item.mode || 'value') === 'attribute' && item.attributeName) {
                                            elm.setAttribute(item.attributeName, val);
                                            const tagAttr = elm.tagName.toLowerCase();
                                            if (tagAttr === 'img' && item.attributeName === 'src') {
                                                if ((elm as HTMLImageElement).getAttribute('loading') === 'lazy') {
                                                    (elm as HTMLImageElement).removeAttribute('loading');
                                                }
                                            }

                                        } else if ((item.mode || 'value') === 'text') {
                                            elm.textContent = val;
                                        } else {
                                            const tag = elm.tagName.toLowerCase();
                                            if (tag === 'input' || tag === 'textarea' || tag === 'select') {
                                                (elm as HTMLInputElement).value = val;
                                                elm.dispatchEvent(new Event('input', { bubbles: true }));
                                                elm.dispatchEvent(new Event('change', { bubbles: true }));
                                            } else if (tag === 'img') {
                                                (elm as HTMLImageElement).src = val;
                                                if ((elm as HTMLImageElement).getAttribute('loading') === 'lazy') {
                                                    (elm as HTMLImageElement).removeAttribute('loading');
                                                }
                                            } else {
                                                elm.textContent = val;
                                            }
                                        }

                                    });
                                }
                            });
                        }
                    }
                }

                if (!modalId || modalId.trim() === '') {
                    return;
                }



                // Try JankxModal first (wrapper around MicroModal with extras)
                if (window.JankxModal) {
                    window.JankxModal.show(modalId, trigger);
                }
                // Fallback to raw MicroModal
                else if (window.MicroModal) {
                    window.MicroModal.show(modalId);
                }
                // Fallback: Check if modal exists and show it manually (simple toggle)
                else {
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.classList.add('is-open');
                        modal.setAttribute('aria-hidden', 'false');
                    }
                }
            });

            // Mark as attached
            button.setAttribute('data-jankx-click-attached', 'true');
        });
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdvancedButtons);
    } else {
        initAdvancedButtons();
    }
})();

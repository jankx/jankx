/**
 * Smart Tab Block - Frontend JavaScript
 * 
 * Handles trigger-specific logic when tab is activated
 */

document.addEventListener('DOMContentLoaded', () => {
    // Find all smart-tab blocks
    const smartTabBlocks = document.querySelectorAll('.smart-tab[data-trigger]');

    smartTabBlocks.forEach((tabBlock) => {
        const trigger = tabBlock.getAttribute('data-trigger');
        
        // Handle advanced-filter trigger
        if (trigger === 'advanced-filter') {
            // Find the corresponding navigation button
            const tabIndex = Array.from(tabBlock.parentElement?.children || []).indexOf(tabBlock);
            const tabsContainer = tabBlock.closest('.smart-tabs');
            if (!tabsContainer) return;
            
            const navButton = tabsContainer.querySelector(`.smart-tabs__nav-item[data-tab-index="${tabIndex}"]`);
            if (!navButton) return;

            // Add click handler to navigation button
            navButton.addEventListener('click', (event) => {
                // Let smart-tabs handle tab activation first
                // Then trigger advanced-filter logic
                setTimeout(() => {
                    handleAdvancedFilterTrigger(tabBlock);
                }, 0);
            });
        }
    });
});

/**
 * Handle advanced-filter trigger when tab is clicked
 * 
 * @param {HTMLElement} tabBlock The smart-tab block element
 */
function handleAdvancedFilterTrigger(tabBlock) {
    // Get targetBlockId from triggerSettings
    const triggerSettingsData = tabBlock?.getAttribute('data-trigger-settings');
    let targetBlockId = null;
    if (triggerSettingsData) {
        try {
            const triggerSettings = JSON.parse(triggerSettingsData);
            targetBlockId = triggerSettings.targetBlockId;
        } catch (error) {
            console.error('SmartTab AdvancedFilter: Error parsing trigger settings:', error);
            return;
        }
    }
    
    if (!targetBlockId) {
        console.warn('SmartTab AdvancedFilter: Missing targetBlockId in triggerSettings', {
            hasTriggerSettings: !!triggerSettingsData,
            triggerSettingsData,
        });
        return;
    }
    
    // Find advanced-filter inner block in the tab panel
    // Try multiple selectors to find the block
    let advancedFilterBlock = null;
    
    // First, try to find in the tab content wrapper
    const tabContent = tabBlock?.querySelector('.smart-tab__content');
    if (tabContent) {
        advancedFilterBlock = tabContent.querySelector('.wp-block-jankx-advanced-filter');
        if (!advancedFilterBlock) {
            advancedFilterBlock = tabContent.querySelector('.jankx-advanced-filter');
        }
        if (!advancedFilterBlock) {
            advancedFilterBlock = tabContent.querySelector('[data-filter-type]');
        }
    }
    
    // If not found, search in the entire tab block
    if (!advancedFilterBlock) {
        advancedFilterBlock = tabBlock?.querySelector('.wp-block-jankx-advanced-filter');
    }
    if (!advancedFilterBlock) {
        advancedFilterBlock = tabBlock?.querySelector('.jankx-advanced-filter');
    }
    if (!advancedFilterBlock) {
        advancedFilterBlock = tabBlock?.querySelector('[data-filter-type]');
    }
    
    if (advancedFilterBlock) {
        // Get filter type from data attribute
        const filterType = advancedFilterBlock.getAttribute('data-filter-type') || 'taxonomy';
        
        // Get filter values based on filter type
        const filterData = extractFilterDataFromBlock(advancedFilterBlock, filterType);
        
        if (filterData) {
            console.log('SmartTab AdvancedFilter: Triggering filter', {
                targetBlockId,
                filterType,
                filterData,
            });
            triggerAdvancedFilterFromBlock(targetBlockId, filterType, filterData);
        } else {
            console.warn('SmartTab AdvancedFilter: Could not extract filter data from block', {
                filterType,
                block: advancedFilterBlock,
                attributes: Array.from(advancedFilterBlock.attributes).map(attr => ({
                    name: attr.name,
                    value: attr.value,
                })),
            });
        }
    } else {
        console.warn('SmartTab AdvancedFilter: Missing advanced-filter block in tab', {
            hasTabBlock: !!tabBlock,
            tabBlockId: tabBlock?.id,
            tabBlockClasses: tabBlock?.className,
            tabBlockHTML: tabBlock?.innerHTML?.substring(0, 500),
        });
    }
}

/**
 * Extract filter data from advanced-filter block element
 * 
 * @param {HTMLElement} filterBlock The advanced-filter block element
 * @param {string} filterType The filter type (taxonomy, meta, price, date, author, keyword)
 * @return {Object|null} Filter data object or null
 */
function extractFilterDataFromBlock(filterBlock, filterType) {
    if (!filterBlock) return null;
    
    const data = {};
    
    switch (filterType) {
        case 'taxonomy':
            const taxonomy = filterBlock.getAttribute('data-taxonomy') || '';
            const filterValue = filterBlock.getAttribute('data-filter-value') || '';
            if (taxonomy) {
                data.taxonomy = taxonomy;
                // Always include filterValue, even if empty (for "Tất cả" option)
                data.filterValue = filterValue;
            }
            break;
            
        case 'meta':
            const metaKey = filterBlock.getAttribute('data-meta-key') || '';
            const metaValue = filterBlock.getAttribute('data-filter-value') || '';
            if (metaKey) {
                data.metaKey = metaKey;
                data.filterValue = metaValue;
            }
            break;
            
        case 'price':
            const minPrice = filterBlock.getAttribute('data-filter-value-min') || '';
            const maxPrice = filterBlock.getAttribute('data-filter-value-max') || '';
            if (minPrice || maxPrice) {
                data.filterValueMin = minPrice;
                data.filterValueMax = maxPrice;
            }
            break;
            
        case 'date':
            const startDate = filterBlock.getAttribute('data-filter-value-start') || '';
            const endDate = filterBlock.getAttribute('data-filter-value-end') || '';
            if (startDate || endDate) {
                data.filterValueStart = startDate;
                data.filterValueEnd = endDate;
            }
            break;
            
        case 'author':
            const authorId = filterBlock.getAttribute('data-filter-value') || '';
            if (authorId) {
                data.filterValue = authorId;
            }
            break;
            
        case 'keyword':
            const keyword = filterBlock.getAttribute('data-filter-value') || '';
            if (keyword) {
                data.filterValue = keyword;
            }
            break;
    }
    
    // Return data if we have at least the required fields for each type
    // For taxonomy, return data even if filterValue is empty (for "Tất cả" option)
    const hasRequiredData = 
        (filterType === 'taxonomy' && data.taxonomy) ||
        (filterType === 'meta' && data.metaKey) ||
        (filterType === 'price' && (data.filterValueMin || data.filterValueMax)) ||
        (filterType === 'date' && (data.filterValueStart || data.filterValueEnd)) ||
        (filterType === 'author' && data.filterValue) ||
        (filterType === 'keyword' && data.filterValue);
    
    return hasRequiredData ? data : null;
}

/**
 * Trigger advanced filter from block data
 * 
 * @param {string} targetBlockId The target dynamic-data-layout block ID
 * @param {string} filterType The filter type
 * @param {Object} filterData Filter data object
 */
function triggerAdvancedFilterFromBlock(targetBlockId, filterType, filterData) {
    if (!targetBlockId) {
        console.warn('SmartTab AdvancedFilter: Missing targetBlockId');
        return;
    }
    
    // Build filters payload based on filter type
    let filtersPayload = {};
    
    switch (filterType) {
        case 'taxonomy':
            if (filterData.taxonomy) {
                // If filterValue is empty or 'all', send empty array to show all data
                if (filterData.filterValue && filterData.filterValue !== 'all') {
                    filtersPayload[filterData.taxonomy] = [filterData.filterValue];
                } else {
                    // Empty array means no filter (show all)
                    filtersPayload[filterData.taxonomy] = [];
                }
            }
            break;
            
        case 'meta':
            if (filterData.metaKey) {
                filtersPayload.meta = {
                    [filterData.metaKey]: filterData.filterValue || '',
                };
            }
            break;
            
        case 'price':
            filtersPayload.price = {
                min: filterData.filterValueMin || '',
                max: filterData.filterValueMax || '',
            };
            break;
            
        case 'date':
            filtersPayload.date = {
                start: filterData.filterValueStart || '',
                end: filterData.filterValueEnd || '',
            };
            break;
            
        case 'author':
            if (filterData.filterValue) {
                filtersPayload.author = [filterData.filterValue];
            }
            break;
            
        case 'keyword':
            if (filterData.filterValue) {
                filtersPayload.keyword = filterData.filterValue;
            }
            break;
    }
    
    // For taxonomy filter, even if filterValue is empty (show all), we still need to send the request
    // with empty array to clear any existing filters
    if (Object.keys(filtersPayload).length === 0 && filterType !== 'taxonomy') {
        console.warn('SmartTab AdvancedFilter: Empty filters payload', { filterType, filterData });
        return;
    }
    
    // Call direct AJAX to update dynamic-data-layout
    fetchDynamicDataLayout(targetBlockId, filtersPayload);
}

/**
 * Directly fetch and update dynamic-data-layout block via AJAX
 * Uses the same logic as advanced-filters block
 */
function fetchDynamicDataLayout(targetBlockId, filtersPayload) {
    const targetBlock = document.querySelector(`.wp-block-jankx-dynamic-data-layout[data-block-id="${targetBlockId}"], .wp-block-jankx-dynamic-data-layout[data-query-id="${targetBlockId}"]`) || document.getElementById(targetBlockId);
    if (!targetBlock) {
        console.warn(`SmartTab AdvancedFilter: Dynamic Data Layout block ${targetBlockId} not found for direct AJAX`);
        return;
    }

    // Get attributes from data-block-settings or build from data attributes
    let attributesJson = targetBlock.getAttribute('data-block-settings') || '';
    
    if (!attributesJson) {
        // Build attributes from data attributes (fallback)
        const attributes = {
            queryId: targetBlockId,
        };
        
        const postType = targetBlock.getAttribute('data-post-type');
        if (postType) attributes.postType = postType;
        
        const layout = targetBlock.getAttribute('data-layout');
        if (layout) attributes.layout = layout;
        
        // Add more attributes as needed...
        if (Object.keys(attributes).length > 1) {
            attributesJson = JSON.stringify(attributes);
        }
    }

    // Get nonce and AJAX URL from advanced-filters config or global
    let nonce = '';
    let ajaxUrl = '/wp-admin/admin-ajax.php';
    
    const afConfigEl = document.querySelector('.advanced-filters-config');
    if (afConfigEl) {
        nonce = afConfigEl.getAttribute('data-nonce') || '';
        ajaxUrl = afConfigEl.getAttribute('data-ajax-url') || ajaxUrl;
    } else if (window.jankxAdvancedFilters) {
        nonce = window.jankxAdvancedFilters.nonce || '';
        ajaxUrl = window.jankxAdvancedFilters.ajaxUrl || ajaxUrl;
    }
    
    // Ensure AJAX URL is absolute
    if (ajaxUrl.startsWith('/')) {
        ajaxUrl = window.location.origin + ajaxUrl;
    } else if (!ajaxUrl.startsWith('http://') && !ajaxUrl.startsWith('https://')) {
        ajaxUrl = window.location.origin + '/' + ajaxUrl.replace(/^\//, '');
    }

    if (!nonce) {
        console.error('SmartTab AdvancedFilter: Nonce is missing! Cannot proceed with AJAX request.');
        return;
    }

    // Get post ID
    let postId = 0;
    try {
        postId = window.wp?.data?.select('core/editor')?.getCurrentPostId?.() || 0;
    } catch (e) {
        // Not in editor
    }
    
    if (!postId) {
        const bodyPostId = document.body.getAttribute('data-post-id');
        if (bodyPostId) {
            postId = parseInt(bodyPostId) || 0;
        }
    }
    
    if (!postId) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPostId = urlParams.get('p') || urlParams.get('post') || urlParams.get('post_id');
        if (urlPostId) {
            postId = parseInt(urlPostId) || 0;
        }
    }
    
    if (!postId) {
        const bodyClasses = document.body.className;
        const postIdMatch = bodyClasses.match(/postid-(\d+)/);
        if (postIdMatch) {
            postId = parseInt(postIdMatch[1]) || 0;
        }
    }

    const params = new URLSearchParams();
    params.append('action', 'jankx_dynamic_data_layout_filter');
    params.append('nonce', nonce);
    params.append('block_id', targetBlockId);
    params.append('attributes', attributesJson || '');
    params.append('filters', JSON.stringify(filtersPayload));
    
    if (postId > 0) {
        params.append('post_id', String(postId));
    }

    fetch(ajaxUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
        credentials: 'same-origin',
    })
        .then((res) => res.json())
        .then((data) => {
            if (!data || !data.success || !data.data || !data.data.html) {
                console.error('SmartTab AdvancedFilter: Invalid AJAX response', data);
                return;
            }
            const temp = document.createElement('div');
            temp.innerHTML = data.data.html.trim();
            const newEl = temp.firstElementChild;
            if (!newEl) {
                console.error('SmartTab AdvancedFilter: Cannot parse HTML from response');
                return;
            }
            // Update URL params if allowed
            const updateUrlAttr = afConfigEl ? afConfigEl.getAttribute('data-update-url') : null;
            const allowUpdateUrl = updateUrlAttr === null ? (window.jankxAdvancedFilters ? window.jankxAdvancedFilters.updateUrl !== false : true) : updateUrlAttr !== '0' && updateUrlAttr !== 'false';
            updateUrlWithFilters(filtersPayload, allowUpdateUrl);

            targetBlock.replaceWith(newEl);
        })
        .catch((err) => {
            console.error('SmartTab AdvancedFilter: AJAX update failed', err);
        });
}

/**
 * Update browser URL with current filters (query params) without reloading
 */
function updateUrlWithFilters(filtersPayload, enableUpdateUrl = true) {
    if (!enableUpdateUrl || !filtersPayload || typeof window === 'undefined' || !window.location) {
        return;
    }
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const setParam = (key, value) => {
        if (value === undefined || value === null || value === '') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
    };

    Object.keys(filtersPayload).forEach((key) => {
        const value = filtersPayload[key];
        if (key === 'price' && value) {
            setParam('price_min', value.min || '');
            setParam('price_max', value.max || '');
            return;
        }
        if (key === 'date' && value) {
            setParam('date_start', value.start || '');
            setParam('date_end', value.end || '');
            return;
        }
        if (key === 'author') {
            const authorVal = Array.isArray(value) ? value[0] || '' : value;
            setParam('author', authorVal);
            return;
        }
        if (key === 'keyword') {
            setParam('s', value || '');
            return;
        }
        if (key === 'meta' && value && typeof value === 'object') {
            Object.keys(value).forEach((metaKey) => {
                setParam(`meta_${metaKey}`, value[metaKey] || '');
            });
            return;
        }
        // default: taxonomy
        if (Array.isArray(value)) {
            setParam(key, value.join(','));
        } else if (value) {
            setParam(key, value);
        } else {
            params.delete(key);
        }
    });

    const newUrl = `${url.origin}${url.pathname}${params.toString() ? `?${params.toString()}` : ''}${url.hash}`;
    window.history.replaceState({}, '', newUrl);
}


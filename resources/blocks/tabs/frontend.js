/**
 * Jankx Tabs Block Frontend JavaScript
 */

// Tab switching functionality
function jankxSwitchTab(blockId, tabIndex) {
    const block = document.getElementById(blockId);
    if (!block) return;

    // Remove active class from all tabs and panels
    const tabs = block.querySelectorAll('.jankx-tab-button');
    const panels = block.querySelectorAll('.jankx-tab-panel');

    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.style.display = 'none');

    // Add active class to selected tab and show panel
    const activeTab = block.querySelector(`[data-index="${tabIndex}"]`);
    const activePanel = block.querySelector(`.jankx-tab-panel[data-index="${tabIndex}"]`);

    if (activeTab) activeTab.classList.add('active');
    if (activePanel) activePanel.style.display = 'block';
}

// Modal functionality
function jankxOpenModal(title, content) {
    const overlay = document.getElementById('jankx-modal-overlay');
    const modalTitle = document.getElementById('jankx-modal-title');
    const modalBody = document.getElementById('jankx-modal-body');

    if (overlay && modalTitle && modalBody) {
        modalTitle.textContent = title || 'Modal';
        modalBody.innerHTML = content || '';
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function jankxCloseModal() {
    const overlay = document.getElementById('jankx-modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('jankx-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                jankxCloseModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            jankxCloseModal();
        }
    });
});

// Tab click event delegation
document.addEventListener('click', function(e) {
    if (e.target.closest('.jankx-tab-button')) {
        const button = e.target.closest('.jankx-tab-button');
        const blockId = button.closest('.jankx-tab-block').id;
        const tabIndex = button.dataset.index;

        if (blockId && tabIndex !== undefined) {
            jankxSwitchTab(blockId, parseInt(tabIndex));
        }
    }
});

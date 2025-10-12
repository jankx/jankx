/**
 * Smart Tabs Block - Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    const smartTabsBlocks = document.querySelectorAll('.smart-tabs');

    smartTabsBlocks.forEach((tabsBlock) => {
        const navItems = tabsBlock.querySelectorAll('.smart-tabs__nav-item');
        // Query tabs trong smart-tabs__content scope
        const tabsContent = tabsBlock.querySelector('.smart-tabs__content');
        const tabPanels = tabsContent ? tabsContent.querySelectorAll('.smart-tab') : [];

        console.log('Smart Tabs Debug:', {
            navItems: navItems.length,
            tabPanels: tabPanels.length,
            tabsContent: !!tabsContent
        });

        if (navItems.length === 0 || tabPanels.length === 0) {
            console.warn('Smart Tabs: Missing navigation or panels');
            return;
        }

        // Initialize first tab as active
        let activeIndex = 0;
        navItems[0]?.classList.add('is-active');
        tabPanels.forEach((panel, index) => {
            if (index === 0) {
                panel.classList.add('is-active');
                panel.style.display = 'block';
            } else {
                panel.classList.remove('is-active');
                panel.style.display = 'none';
            }
        });

        // Handle tab clicks
        navItems.forEach((navItem, index) => {
            navItem.addEventListener('click', function (e) {
                e.preventDefault();

                // Update active nav item
                navItems.forEach((item) => item.classList.remove('is-active'));
                navItem.classList.add('is-active');

                // Update active tab panel
                tabPanels.forEach((panel, panelIndex) => {
                    if (panelIndex === index) {
                        panel.classList.add('is-active');
                        panel.style.display = 'block';
                    } else {
                        panel.classList.remove('is-active');
                        panel.style.display = 'none';
                    }
                });

                activeIndex = index;
            });
        });

        // Handle keyboard navigation
        tabsBlock.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();

                let newIndex = activeIndex;
                if (e.key === 'ArrowLeft') {
                    newIndex = activeIndex > 0 ? activeIndex - 1 : navItems.length - 1;
                } else {
                    newIndex = activeIndex < navItems.length - 1 ? activeIndex + 1 : 0;
                }

                navItems[newIndex]?.click();
                navItems[newIndex]?.focus();
            }
        });

        // Make nav items focusable
        navItems.forEach((item) => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'tab');
        });

        // Set ARIA attributes
        tabPanels.forEach((panel) => {
            panel.setAttribute('role', 'tabpanel');
        });
    });
});


/******/ (() => { // webpackBootstrap
/*!***********************************!*\
  !*** ./blocks/smart-tabs/view.js ***!
  \***********************************/
/**
 * Smart Tabs Block - Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  const smartTabsBlocks = document.querySelectorAll('.smart-tabs');
  const generateUid = (prefix = 'smart-tabs') => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  smartTabsBlocks.forEach(tabsBlock => {
    var _tabsBlock$getAttribu;
    const navItems = Array.from(tabsBlock.querySelectorAll('.smart-tabs__nav-item'));
    const tabsContent = tabsBlock.querySelector('.smart-tabs__content');
    const tabPanels = tabsContent ? Array.from(tabsContent.querySelectorAll('.smart-tab')) : [];
    if (navItems.length === 0 || tabPanels.length === 0) {
      return;
    }
    const uid = tabsBlock.dataset.smartTabsUid && tabsBlock.dataset.smartTabsUid.length > 0 ? tabsBlock.dataset.smartTabsUid : generateUid();
    tabsBlock.dataset.smartTabsUid = uid;
    const panelHashMap = {};
    navItems.forEach((navItem, index) => {
      if (!navItem.id) {
        navItem.id = `${uid}-tab-${index}`;
      }
      navItem.setAttribute('role', 'tab');
      navItem.setAttribute('aria-selected', 'false');
      navItem.setAttribute('tabindex', '-1');
    });
    tabPanels.forEach((panel, index) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-hidden', 'true');
      let panelId = panel.getAttribute('id');
      if (!panelId) {
        panelId = `${uid}-panel-${index}`;
        panel.setAttribute('id', panelId);
      }
      panelHashMap[`#${panelId}`] = index;
      const controller = navItems[index];
      if (controller) {
        controller.setAttribute('aria-controls', panelId);
        panel.setAttribute('aria-labelledby', controller.id);
      }
    });
    let activeIndex = -1;
    const clampIndex = index => Math.max(0, Math.min(index, navItems.length - 1));
    const scrollToPanel = index => {
      const panel = tabPanels[index];
      if (!panel) {
        return;
      }
      window.requestAnimationFrame(() => {
        panel.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    };
    const activateTab = (index, options = {}) => {
      if (!navItems.length) {
        return;
      }
      const targetIndex = clampIndex(index);
      if (activeIndex === targetIndex && !options.force) {
        if (options.scroll) {
          scrollToPanel(targetIndex);
        }
        return;
      }
      activeIndex = targetIndex;
      navItems.forEach((navItem, navIndex) => {
        const isActive = navIndex === targetIndex;
        navItem.classList.toggle('is-active', isActive);
        navItem.setAttribute('aria-selected', isActive ? 'true' : 'false');
        navItem.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      tabPanels.forEach((panel, panelIndex) => {
        const isActive = panelIndex === targetIndex;
        panel.classList.toggle('is-active', isActive);
        panel.style.display = isActive ? 'block' : 'none';
        panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
      if (options.focusNav) {
        navItems[targetIndex]?.focus({
          preventScroll: true
        });
      }
      if (options.scroll) {
        scrollToPanel(targetIndex);
      }
    };
    navItems.forEach((navItem, index) => {
      navItem.addEventListener('click', event => {
        event.preventDefault();
        activateTab(index, {
          focusNav: true,
          force: true
        });
        const panel = tabPanels[index];
        if (panel && panel.id) {
          const newHash = `#${panel.id}`;
          if (window.location.hash !== newHash) {
            history.replaceState(null, '', `${window.location.pathname}${window.location.search}${newHash}`);
          }
          scrollToPanel(index);
        }
      });
    });
    tabsBlock.addEventListener('keydown', event => {
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (!keys.includes(event.key)) {
        return;
      }
      event.preventDefault();
      const lastIndex = navItems.length - 1;
      let nextIndex = activeIndex;
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = activeIndex > 0 ? activeIndex - 1 : lastIndex;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = activeIndex < lastIndex ? activeIndex + 1 : 0;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = lastIndex;
          break;
        default:
          break;
      }
      activateTab(nextIndex, {
        focusNav: true,
        force: true
      });
    });
    const handleHashNavigation = (hash, options = {}) => {
      if (!hash) {
        return false;
      }
      const targetIndex = panelHashMap[hash];
      if (typeof targetIndex === 'number') {
        activateTab(targetIndex, {
          scroll: options.scroll !== false,
          force: true,
          focusNav: false
        });
        return true;
      }
      return false;
    };
    const datasetActive = parseInt((_tabsBlock$getAttribu = tabsBlock.getAttribute('data-active-tab')) !== null && _tabsBlock$getAttribu !== void 0 ? _tabsBlock$getAttribu : '0', 10);
    const defaultIndex = Number.isNaN(datasetActive) ? 0 : datasetActive;
    if (!handleHashNavigation(window.location.hash)) {
      activateTab(defaultIndex, {
        force: true
      });
    }
    window.addEventListener('hashchange', () => {
      handleHashNavigation(window.location.hash);
    });
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map
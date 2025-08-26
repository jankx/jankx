/******/ (() => { // webpackBootstrap
/*!**********************************!*\
  !*** ./blocks/mega-menu/view.js ***!
  \**********************************/
(function () {
  'use strict';

  function qs(root, sel) {
    return (root || document).querySelector(sel);
  }
  function qsa(root, sel) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function isMobile(bp) {
    return window.innerWidth <= bp;
  }
  function closeAllSubmenus(menu) {
    qsa(menu, '.mega-item--active').forEach(function (li) {
      li.classList.remove('mega-item--active');
      var btn = qs(li, '> .mega-link');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
  function openSubmenu(li) {
    if (!li.classList.contains('mega-item--active')) {
      li.classList.add('mega-item--active');
      var btn = qs(li, '> .mega-link');
      if (btn) {
        btn.setAttribute('aria-expanded', 'true');
      }
    }
  }
  function initMegaMenu(nav) {
    if (!nav) return;
    var toggle = qs(nav, '.mega-menu__toggle');
    var listRoot = qs(nav, '.mega-menu__nav');
    var breakpointAttr = nav.getAttribute('data-breakpoint');
    var breakpoint = parseInt(breakpointAttr || '959', 10);

    // Responsive toggle
    if (toggle) {
      var updateToggleAria = function () {
        toggle.setAttribute('aria-expanded', (!nav.classList.contains('is-collapsed')).toString());
      };
      var setCollapsed = function (collapsed) {
        if (collapsed) {
          nav.classList.add('is-collapsed');
        } else {
          nav.classList.remove('is-collapsed');
        }
        updateToggleAria();
      };
      setCollapsed(isMobile(breakpoint));
      window.addEventListener('resize', function () {
        setCollapsed(isMobile(breakpoint));
      });
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        nav.classList.toggle('is-collapsed');
        updateToggleAria();
      });
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nav.classList.toggle('is-collapsed');
          updateToggleAria();
        }
      });
    }

    // Submenu interactions (hover on desktop, click on mobile)
    qsa(listRoot || nav, '.mega-item').forEach(function (li) {
      var link = qs(li, '> .mega-link');
      var submenu = qs(li, '> .mega-submenu');
      if (!link || !submenu) return;

      // Keyboard support
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');

      // Desktop hover
      li.addEventListener('mouseenter', function () {
        if (!isMobile(breakpoint)) {
          closeAllSubmenus(nav);
          openSubmenu(li);
        }
      });
      li.addEventListener('mouseleave', function () {
        if (!isMobile(breakpoint)) {
          li.classList.remove('mega-item--active');
          link.setAttribute('aria-expanded', 'false');
        }
      });

      // Mobile click
      link.addEventListener('click', function (e) {
        if (isMobile(breakpoint)) {
          e.preventDefault();
          var active = li.classList.contains('mega-item--active');
          closeAllSubmenus(nav);
          if (!active) openSubmenu(li);
        }
      });

      // Focus management
      link.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var active = li.classList.contains('mega-item--active');
          closeAllSubmenus(nav);
          if (!active) openSubmenu(li);
        }
        if (e.key === 'Escape') {
          li.classList.remove('mega-item--active');
          link.setAttribute('aria-expanded', 'false');
          link.focus();
        }
      });
    });

    // Click/touch outside to close
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) closeAllSubmenus(nav);
    });
  }
  function boot() {
    qsa(document, '.jankx-mega-menu').forEach(initMegaMenu);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
/******/ })()
;
//# sourceMappingURL=view.js.map
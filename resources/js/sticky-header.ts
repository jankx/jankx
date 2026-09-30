document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (!header) {
        console.warn('Jankx: Header element not found for sticky header.');
        return;
    }
    // Get sticky settings from jankxThemeOptions
    const themeOptions = (window as any).jankxThemeOptions || {};
    const headerOptions = themeOptions.header || {};
    const isStickyEnabled = headerOptions.enable_sticky_header === '1' || headerOptions.enable_sticky_header === 1 || headerOptions.enable_sticky_header === true;
    const triggerType = headerOptions.sticky_header_trigger || 'top';

    /** URL of the alternative logo to show in sticky mode (may be empty string) */
    const stickyLogoUrl: string = (headerOptions.sticky_header_logo_url || '').trim();

    if (!isStickyEnabled) {
        return;
    }

    console.log('Jankx: Sticky header enabled. Trigger:', triggerType, '| Sticky logo:', stickyLogoUrl || 'none');

    // ── Logo swap helpers ─────────────────────────────────────────────────────
    /**
     * Find the site-logo <img> inside the header.
     * Supports wp-block-site-logo, custom logo link, and generic .site-logo.
     */
    const findLogoImg = (): HTMLImageElement | null => {
        return (
            header.querySelector<HTMLImageElement>(
                '.wp-block-site-logo img, .site-logo img, .custom-logo, img.custom-logo, header .site-branding img, header .navbar-brand img'
            ) || null
        );
    };

    /**
     * Swap to the sticky logo.
     * Saves the original src in a data attribute so it can be restored later.
     */
    const applyLogo = (img: HTMLImageElement, url: string): void => {
        if (!img.dataset.originalSrc) {
            img.dataset.originalSrc = img.src;
        }
        if (img.src !== url) {
            img.src = url;
        }
    };

    /**
     * Restore the original logo src.
     */
    const restoreLogo = (img: HTMLImageElement): void => {
        const original = img.dataset.originalSrc;
        if (original && img.src !== original) {
            img.src = original;
        }
    };
    // ─────────────────────────────────────────────────────────────────────────

    let triggerPosition = 0;
    const headerHeight = header.offsetHeight;

    let lastScrollY = window.scrollY || window.pageYOffset;

    /**
     * The header height changes once it becomes fixed (it switches to a
     * condensed padding), so the measured value is refreshed at that point and
     * published to the scroll engine for anchor offsets.
     */
    let appliedHeaderHeight = headerHeight;

    const calculateTriggerPosition = () => {
        if (triggerType === 'hero') {
            const hero = document.querySelector('.wp-block-jankx-carousel, .wp-block-jankx-slideshow, .wp-block-jankx-carousel-banner, .wp-block-jankx-carousel-slide, .jankx-carousel, .jankx-slider');
            if (hero) {
                const rect = hero.getBoundingClientRect();
                triggerPosition = rect.bottom + window.scrollY;
            } else {
                triggerPosition = headerHeight;
            }
        } else if (triggerType === 'first_group') {
            const main = document.querySelector('main, .wp-site-blocks > *:not(header), #content');
            if (main) {
                // Find deep into first child to get actual content bottom
                const firstChild = main.firstElementChild;
                if (firstChild) {
                    triggerPosition = (firstChild.getBoundingClientRect().bottom + window.scrollY) || headerHeight;
                } else {
                    triggerPosition = headerHeight;
                }
            } else {
                triggerPosition = headerHeight;
            }
        } else {
            triggerPosition = 50; // Trigger after small scroll for better effect
        }
        console.log('Jankx: Sticky trigger position calculated:', triggerPosition);
    };

    const handleScroll = (scrollY: number) => {
        // Basic sticky behavior
        if (scrollY >= triggerPosition) {
            if (!header.classList.contains('is-sticky')) {
                header.classList.add('is-sticky');
                // The header is `position: fixed` while stuck, so it no longer
                // occupies flow. Reserve its space to avoid a content jump.
                document.body.style.paddingTop = `${appliedHeaderHeight}px`;
                document.body.classList.add('has-sticky-header');

                // Re-measure now that the fixed/condensed styles apply, then let
                // the scroll engine recompute anchor offsets from the new value.
                appliedHeaderHeight = header.offsetHeight;
                window.jankxScroll?.resize();

                // ── Swap to sticky logo ──────────────────────────────────────
                if (stickyLogoUrl) {
                    const logoImg = findLogoImg();
                    if (logoImg) {
                        applyLogo(logoImg, stickyLogoUrl);
                    }
                }
                // ────────────────────────────────────────────────────────────
            }

            // Scroll direction detection for "Slide" effect
            if (scrollY > lastScrollY && scrollY > triggerPosition + 100) {
                // Scrolling down - hide header
                header.classList.add('header-hidden');
            } else if (scrollY < lastScrollY) {
                // Scrolling up - show header
                header.classList.remove('header-hidden');
            }
        } else {
            if (header.classList.contains('is-sticky')) {
                header.classList.remove('is-sticky');
                header.classList.remove('header-hidden');
                document.body.style.paddingTop = '0';
                document.body.classList.remove('has-sticky-header');

                // The header is back in normal flow, so the condensed height no
                // longer applies to anchor offsets.
                window.jankxScroll?.resize();

                // ── Restore original logo ────────────────────────────────────
                if (stickyLogoUrl) {
                    const logoImg = findLogoImg();
                    if (logoImg) {
                        restoreLogo(logoImg);
                    }
                }
                // ────────────────────────────────────────────────────────────
            }
        }
        lastScrollY = scrollY;
    };

    // Calculate on load and resize
    const initSticky = () => {
        calculateTriggerPosition();
        handleScroll(window.scrollY || window.pageYOffset);
    };

    /**
     * Drive the header from the shared scroll engine.
     *
     * The engine callback already receives the smoothed scroll position, which
     * keeps the header in sync during inertial scrolling. Falling back to a
     * native listener means the header still works if the engine bundle is not
     * loaded (e.g. a child theme that de-registered it).
     */
    const scroll = window.jankxScroll;
    if (scroll) {
        scroll.ready((api) => {
            api.on((state) => handleScroll(state.scroll));
            initSticky();
        });
    } else {
        window.addEventListener('scroll', () => handleScroll(window.scrollY || window.pageYOffset), { passive: true });
        initSticky();
    }

    window.addEventListener('load', initSticky);
    window.addEventListener('resize', initSticky);

    // Initial call
    setTimeout(initSticky, 100);
});

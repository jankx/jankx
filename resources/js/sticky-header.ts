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

    const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset;

        // Basic sticky behavior
        if (scrollY >= triggerPosition) {
            if (!header.classList.contains('is-sticky')) {
                header.classList.add('is-sticky');
                document.body.style.paddingTop = `${headerHeight}px`;
                document.body.classList.add('has-sticky-header');

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
        handleScroll();
    };

    window.addEventListener('load', initSticky);
    window.addEventListener('resize', initSticky);
    window.addEventListener('scroll', handleScroll);

    // Initial call
    setTimeout(initSticky, 100);
});

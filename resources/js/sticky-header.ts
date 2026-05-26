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

    if (!isStickyEnabled) {
        return;
    }

    console.log('Jankx: Sticky header enabled. Trigger:', triggerType);

    let triggerPosition = 0;
    const headerHeight = header.offsetHeight;

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

    let lastScrollY = window.scrollY || window.pageYOffset;
    const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset;

        // Basic sticky behavior
        if (scrollY >= triggerPosition) {
            if (!header.classList.contains('is-sticky')) {
                header.classList.add('is-sticky');
                document.body.style.paddingTop = `${headerHeight}px`;
                document.body.classList.add('has-sticky-header');
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

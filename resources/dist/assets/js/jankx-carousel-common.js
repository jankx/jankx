import JankxCarousel from './../../shared/components/JankxCarousel';
export default JankxCarousel;
const carouselInstances = new Map();
export function initJankxCarousel(selector, root = document) {
    const carousels = root ? root.querySelectorAll(selector) : document.querySelectorAll(selector);
    carousels.forEach((carousel) => {
        if (carousel._carouselInitialized)
            return;
        const instance = new JankxCarousel(carousel);
        if (instance.embla) {
            carouselInstances.set(carousel, instance);
        }
    });
}
if (typeof window !== 'undefined') {
    window.JankxCarousel = {
        init: initJankxCarousel,
        instances: carouselInstances,
        Carousel: JankxCarousel
    };
}

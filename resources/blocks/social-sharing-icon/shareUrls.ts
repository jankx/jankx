/**
 * Share URL builders used to give each social icon a real href.
 *
 * Rendering an <a> instead of a <button> means the markup works without JS
 * (plain links), stays crawlable/semantic, and no longer inherits UA button
 * chrome (background, border, padding, font).
 *
 * The frontend script still intercepts the click to use the vanilla-sharing
 * popups, so these hrefs act as a graceful no-JS fallback.
 */

const enc = encodeURIComponent;

type Builder = (url: string, title: string) => string;

export const SHARE_URLS: Record<string, Builder> = {
    facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    twitter: (url, title) =>
        `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
    linkedin: (url) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    whatsapp: (url, title) =>
        `https://api.whatsapp.com/send?text=${enc(`${title} ${url}`)}`,
    telegram: (url, title) =>
        `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
    pinterest: (url, title) =>
        `https://pinterest.com/pin/create/button/?url=${enc(url)}&description=${enc(title)}`,
    reddit: (url, title) =>
        `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(title)}`,
    email: (url, title) => `mailto:?subject=${enc(title)}&body=${enc(url)}`,
    // Messenger and Viber cannot be pre-linked to a web share intent without
    // a Facebook App ID / deep-link scheme, so they stay JS-only.
    line: (url, title) =>
        `https://social-plugins.line.me/lineit/share?url=${enc(url)}&text=${enc(title)}`,
};

/**
 * Build the href for a network.
 *
 * The permalink is usually not known at save time, so an empty `url` yields '#'
 * and the frontend script rebuilds the real href from `window.location.href`.
 * Networks with no static web share intent (copy, messenger, viber) are always
 * JS-only and also fall back to '#'.
 */
export const getShareUrl = (network: string, url: string, title: string): string => {
    const builder = SHARE_URLS[network];

    if (!builder || !url) {
        return '#';
    }

    return builder(url, title || '');
};

export default SHARE_URLS;

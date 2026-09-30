import * as VanillaSharing from 'vanilla-sharing';

import { getShareUrl } from './shareUrls';

/**
 * Resolve the URL/title to share.
 *
 * The saved href is '#' whenever the permalink was unknown at save time, so the
 * real value has to be filled in here from the current page.
 */
const resolveShareTarget = (button: HTMLElement) => ({
    url: button.getAttribute('data-url') || window.location.href,
    title: button.getAttribute('data-title') || document.title,
});

document.addEventListener('DOMContentLoaded', () => {
    const sharingIcons = document.querySelectorAll('.wp-block-jankx-social-sharing-icon .sharing-icon-button');

    sharingIcons.forEach((link) => {
        const button = link as HTMLElement;
        const network = button.getAttribute('data-network') || '';
        const { url, title } = resolveShareTarget(button);

        // Give every anchor a real destination so the markup still works as a
        // plain link when JavaScript is unavailable. JS-only networks keep '#'.
        if (!button.getAttribute('href') || button.getAttribute('href') === '#') {
            button.setAttribute('href', getShareUrl(network, url, title));
        }

        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Map network names to vanilla-sharing functions
            const sharingMap: { [key: string]: Function } = {
                'facebook': VanillaSharing.fbButton,
                'twitter': VanillaSharing.tw,
                'linkedin': VanillaSharing.linkedin,
                'whatsapp': VanillaSharing.whatsapp,
                'telegram': VanillaSharing.telegram,
                'reddit': VanillaSharing.reddit,
                'email': VanillaSharing.email,
                'messenger': VanillaSharing.messenger,
                'viber': VanillaSharing.viber,
                'line': VanillaSharing.line,
            };

            const shareFunction = sharingMap[network];
            if (shareFunction) {
                shareFunction({
                    url: url,
                    title: title,
                });
            } else if (network === 'copy') {
                // Copy to clipboard
                navigator.clipboard.writeText(url).then(() => {
                    const originalText = button.querySelector('.sharing-label')?.textContent || 'Copy Link';
                    const label = button.querySelector('.sharing-label');
                    if (label) {
                        label.textContent = 'Đã sao chép!';
                        setTimeout(() => {
                            label.textContent = originalText;
                        }, 2000);
                    } else {
                        // Show tooltip for icon-only buttons
                        const tooltip = document.createElement('span');
                        tooltip.className = 'copy-tooltip';
                        tooltip.textContent = 'Đã sao chép!';
                        tooltip.style.cssText = `
                            position: absolute;
                            top: -30px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: #333;
                            color: white;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            white-space: nowrap;
                            z-index: 1000;
                        `;
                        button.style.position = 'relative';
                        button.appendChild(tooltip);
                        setTimeout(() => {
                            tooltip.remove();
                        }, 2000);
                    }
                });
            } else if (network === 'pinterest') {
                // Pinterest sharing
                const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
});

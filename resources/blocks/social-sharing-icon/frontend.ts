import * as VanillaSharing from 'vanilla-sharing';

document.addEventListener('DOMContentLoaded', () => {
    const sharingIcons = document.querySelectorAll('.wp-block-jankx-social-sharing-icon .sharing-icon-button');

    sharingIcons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const network = button.getAttribute('data-network') || '';
            const url = button.getAttribute('data-url') || window.location.href;
            const title = button.getAttribute('data-title') || document.title;

            // Map network names to vanilla-sharing functions
            const sharingMap: { [key: string]: Function } = {
                'facebook': VanillaSharing.fbShare,
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


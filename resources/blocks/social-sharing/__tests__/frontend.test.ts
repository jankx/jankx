/**
 * @jest-environment jsdom
 */

// Mock vanilla-sharing
const mockVanillaSharing = {
    fbButton: jest.fn(),
    tw: jest.fn(),
    linkedin: jest.fn(),
    whatsapp: jest.fn(),
    telegram: jest.fn(),
    reddit: jest.fn(),
    email: jest.fn(),
    messenger: jest.fn(),
    viber: jest.fn(),
    line: jest.fn(),
};

jest.mock('vanilla-sharing', () => mockVanillaSharing);

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
    },
});

// Mock window.open
global.open = jest.fn();

/**
 * The anchors are rendered by the social-sharing-icon block, so this suite
 * exercises social-sharing-icon/frontend.ts against the real markup: an <a>
 * with a `.sharing-icon-button` class inside a `.wp-block-jankx-social-sharing-icon`
 * wrapper.
 */
describe('SocialSharingIcon Frontend', () => {
    let container: HTMLElement;

    const anchor = (network: string, label: string) =>
        `<div class="wp-block-jankx-social-sharing-icon social-sharing-icon-block">
            <a class="sharing-icon-button ${network} size-medium"
               data-network="${network}"
               href="#"
               data-url="https://example.com/post"
               data-title="Test Post">
                <span class="sharing-label">${label}</span>
            </a>
        </div>`;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        container.className = 'wp-block-jankx-social-sharing social-sharing-block alignment-center';
        container.innerHTML = `
            <div class="sharing-buttons">
                ${anchor('facebook', 'Facebook')}
                ${anchor('twitter', 'Twitter/X')}
                ${anchor('copy', 'Copy Link')}
                ${anchor('pinterest', 'Pinterest')}
            </div>
        `;
        document.body.appendChild(container);

        jest.clearAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    const dispatchDomReady = () => document.dispatchEvent(new Event('DOMContentLoaded'));

    it('should initialize sharing links on DOMContentLoaded', (done) => {
        dispatchDomReady();

        setTimeout(() => {
            const links = container.querySelectorAll('.sharing-icon-button');
            expect(links.length).toBeGreaterThan(0);
            done();
        }, 100);
    });

    it('should replace the placeholder href with a real share URL', (done) => {
        dispatchDomReady();

        setTimeout(() => {
            const facebookLink = container.querySelector(
                '[data-network="facebook"]'
            ) as HTMLAnchorElement;

            expect(facebookLink.getAttribute('href')).toBe(
                'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fexample.com%2Fpost'
            );
            done();
        }, 100);
    });

    it('should handle Facebook share link click', (done) => {
        dispatchDomReady();

        setTimeout(() => {
            const facebookLink = container.querySelector('[data-network="facebook"]') as HTMLAnchorElement;
            facebookLink.click();

            expect(mockVanillaSharing.fbButton).toHaveBeenCalledWith({
                url: 'https://example.com/post',
                title: 'Test Post',
            });
            done();
        }, 100);
    });

    it('should handle Twitter share link click', (done) => {
        dispatchDomReady();

        setTimeout(() => {
            const twitterLink = container.querySelector('[data-network="twitter"]') as HTMLAnchorElement;
            twitterLink.click();

            expect(mockVanillaSharing.tw).toHaveBeenCalledWith({
                url: 'https://example.com/post',
                title: 'Test Post',
            });
            done();
        }, 100);
    });

    it('should handle copy link click', async () => {
        dispatchDomReady();

        await new Promise((resolve) => setTimeout(resolve, 100));

        const copyLink = container.querySelector('[data-network="copy"]') as HTMLAnchorElement;
        copyLink.click();

        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/post');
    });

    it('should handle Pinterest share link click', (done) => {
        dispatchDomReady();

        setTimeout(() => {
            const pinterestLink = container.querySelector('[data-network="pinterest"]') as HTMLAnchorElement;
            pinterestLink.click();

            expect(global.open).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('should use the current URL when data-url is not provided', (done) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'wp-block-jankx-social-sharing-icon social-sharing-icon-block';
        wrapper.innerHTML = `
            <a class="sharing-icon-button facebook size-medium"
               data-network="facebook"
               href="#">
                <span class="sharing-label">Facebook</span>
            </a>
        `;
        container.querySelector('.sharing-buttons')?.appendChild(wrapper);

        dispatchDomReady();

        setTimeout(() => {
            const link = wrapper.querySelector('.sharing-icon-button') as HTMLAnchorElement;
            link.click();

            expect(mockVanillaSharing.fbButton).toHaveBeenCalledWith({
                url: window.location.href,
                title: document.title,
            });
            done();
        }, 100);
    });
});

// Import frontend code to trigger initialization
import '../social-sharing-icon/frontend';

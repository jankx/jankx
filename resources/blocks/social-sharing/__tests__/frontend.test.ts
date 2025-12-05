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

describe('SocialSharing Frontend', () => {
    let container: HTMLElement;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '';
        container = document.createElement('div');
        container.className = 'wp-block-jankx-social-sharing';
        container.innerHTML = `
            <div class="sharing-buttons">
                <button class="sharing-button" 
                        data-network="facebook" 
                        data-url="https://example.com/post" 
                        data-title="Test Post">
                    <span class="sharing-label">Facebook</span>
                </button>
                <button class="sharing-button" 
                        data-network="twitter" 
                        data-url="https://example.com/post" 
                        data-title="Test Post">
                    <span class="sharing-label">Twitter</span>
                </button>
                <button class="sharing-button" 
                        data-network="copy" 
                        data-url="https://example.com/post" 
                        data-title="Test Post">
                    <span class="sharing-label">Copy Link</span>
                </button>
                <button class="sharing-button" 
                        data-network="pinterest" 
                        data-url="https://example.com/post" 
                        data-title="Test Post">
                    <span class="sharing-label">Pinterest</span>
                </button>
            </div>
        `;
        document.body.appendChild(container);

        // Clear all mocks
        jest.clearAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should initialize sharing buttons on DOMContentLoaded', (done) => {
        // Simulate DOMContentLoaded
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        // Wait a bit for event listeners to attach
        setTimeout(() => {
            const buttons = container.querySelectorAll('.sharing-button');
            expect(buttons.length).toBeGreaterThan(0);
            done();
        }, 100);
    });

    it('should handle Facebook share button click', (done) => {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        setTimeout(() => {
            const facebookButton = container.querySelector('[data-network="facebook"]') as HTMLButtonElement;
            
            if (facebookButton) {
                facebookButton.click();
                
                expect(mockVanillaSharing.fbButton).toHaveBeenCalledWith({
                    url: 'https://example.com/post',
                    title: 'Test Post',
                });
            }
            done();
        }, 100);
    });

    it('should handle Twitter share button click', (done) => {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        setTimeout(() => {
            const twitterButton = container.querySelector('[data-network="twitter"]') as HTMLButtonElement;
            
            if (twitterButton) {
                twitterButton.click();
                
                expect(mockVanillaSharing.tw).toHaveBeenCalledWith({
                    url: 'https://example.com/post',
                    title: 'Test Post',
                });
            }
            done();
        }, 100);
    });

    it('should handle copy link button click', async () => {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        await new Promise(resolve => setTimeout(resolve, 100));

        const copyButton = container.querySelector('[data-network="copy"]') as HTMLButtonElement;
        
        if (copyButton) {
            copyButton.click();
            
            await new Promise(resolve => setTimeout(resolve, 50));
            
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/post');
        }
    });

    it('should handle Pinterest share button click', (done) => {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        setTimeout(() => {
            const pinterestButton = container.querySelector('[data-network="pinterest"]') as HTMLButtonElement;
            
            if (pinterestButton) {
                pinterestButton.click();
                
                expect(global.open).toHaveBeenCalled();
            }
            done();
        }, 100);
    });

    it('should use current URL if data-url is not provided', (done) => {
        const buttonWithoutUrl = document.createElement('button');
        buttonWithoutUrl.className = 'sharing-button';
        buttonWithoutUrl.setAttribute('data-network', 'facebook');
        container.querySelector('.sharing-buttons')?.appendChild(buttonWithoutUrl);

        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        setTimeout(() => {
            buttonWithoutUrl.click();
            
            expect(mockVanillaSharing.fbButton).toHaveBeenCalled();
            done();
        }, 100);
    });
});

// Import frontend code to trigger initialization
import '../frontend';

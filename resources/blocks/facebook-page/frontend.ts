function ensureFacebookRoot() {
  let root = document.getElementById('fb-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'fb-root';
    document.body.prepend(root);
  }
}

function loadFacebookSDK(locale: string) {
  if ((window as any).FB) {
    return;
  }
  ensureFacebookRoot();
  const id = 'facebook-jssdk';
  if (document.getElementById(id)) {
    return;
  }
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.defer = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://connect.facebook.net/${locale}/sdk.js#xfbml=1&version=v19.0`;
  document.body.appendChild(script);
}

function initXFBML(container: HTMLElement) {
  const fbDiv = container.querySelector<HTMLElement>('.fb-page');
  if (!fbDiv) return;
  const locale = fbDiv.dataset.locale || 'vi_VN';
  loadFacebookSDK(locale);
  const FB = (window as any).FB;
  if (FB && typeof FB.XFBML?.parse === 'function') {
    FB.XFBML.parse(container);
  }
}

function setup() {
  const blocks = document.querySelectorAll<HTMLElement>('.jankx-facebook-page');
  blocks.forEach((el) => initXFBML(el));
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setup();
} else {
  document.addEventListener('DOMContentLoaded', setup);
}

export {};


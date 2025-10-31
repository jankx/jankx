/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/vanilla-sharing/dist/vanilla-sharing.esm.js":
/*!******************************************************************!*\
  !*** ./node_modules/vanilla-sharing/dist/vanilla-sharing.esm.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   email: () => (/* binding */ email),
/* harmony export */   fbButton: () => (/* binding */ fbButton),
/* harmony export */   fbFeed: () => (/* binding */ fbFeed),
/* harmony export */   fbShare: () => (/* binding */ fbShare),
/* harmony export */   getEmailUrl: () => (/* binding */ getEmailUrl),
/* harmony export */   getFbButtonUrl: () => (/* binding */ getFbButtonUrl),
/* harmony export */   getFbFeedUrl: () => (/* binding */ getFbFeedUrl),
/* harmony export */   getFbShareUrl: () => (/* binding */ getFbShareUrl),
/* harmony export */   getOkUrl: () => (/* binding */ getOkUrl),
/* harmony export */   getTelegramUrl: () => (/* binding */ getTelegramUrl),
/* harmony export */   getTwUrl: () => (/* binding */ getTwUrl),
/* harmony export */   getViberUrl: () => (/* binding */ getViberUrl),
/* harmony export */   getVkUrl: () => (/* binding */ getVkUrl),
/* harmony export */   getWhatsappUrl: () => (/* binding */ getWhatsappUrl),
/* harmony export */   gp: () => (/* binding */ gp),
/* harmony export */   line: () => (/* binding */ line),
/* harmony export */   linkedin: () => (/* binding */ linkedin),
/* harmony export */   mail: () => (/* binding */ mail),
/* harmony export */   messenger: () => (/* binding */ messenger),
/* harmony export */   ok: () => (/* binding */ ok),
/* harmony export */   pinterest: () => (/* binding */ pinterest),
/* harmony export */   reddit: () => (/* binding */ reddit),
/* harmony export */   telegram: () => (/* binding */ telegram),
/* harmony export */   tumblr: () => (/* binding */ tumblr),
/* harmony export */   tw: () => (/* binding */ tw),
/* harmony export */   viber: () => (/* binding */ viber),
/* harmony export */   vk: () => (/* binding */ vk),
/* harmony export */   whatsapp: () => (/* binding */ whatsapp)
/* harmony export */ });
var WIN_PARAMS = 'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0'; // eslint-disable-line import/prefer-default-export

function encodeParams(obj) {
  return Object.keys(obj).filter(function (k) {
    return typeof obj[k] !== 'undefined' && obj[k] !== '';
  }).map(function (k) {
    return "".concat(encodeURIComponent(k), "=").concat(encodeURIComponent(obj[k]));
  }).join('&');
}
function getFbFeedUrl() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fbAppId = options.fbAppId,
    url = options.url,
    redirectUri = options.redirectUri;
  if (!fbAppId) {
    throw new Error('fbAppId is not defined');
  }
  var params = encodeParams({
    app_id: fbAppId,
    display: 'popup',
    redirect_uri: redirectUri,
    link: url
  });
  return "https://www.facebook.com/dialog/feed?".concat(params);
}
function fbFeed() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return window.open(getFbFeedUrl(options), '_blank', WIN_PARAMS);
}
function getFbShareUrl() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fbAppId = options.fbAppId,
    url = options.url,
    hashtag = options.hashtag,
    redirectUri = options.redirectUri;
  if (!fbAppId) {
    throw new Error('fbAppId is not defined');
  }
  var params = encodeParams({
    app_id: fbAppId,
    display: 'popup',
    redirect_uri: redirectUri,
    href: url,
    hashtag: hashtag
  });
  return "https://www.facebook.com/dialog/share?".concat(params);
}
function fbShare() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return window.open(getFbShareUrl(options), '_blank', WIN_PARAMS);
}
function getFbButtonUrl() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = options.url;
  if (!url) {
    throw new Error('url is not defined');
  }
  var params = encodeParams({
    kid_directed_site: '0',
    sdk: 'joey',
    u: url,
    display: 'popup',
    ref: 'plugin',
    src: 'share_button'
  });
  return "https://www.facebook.com/sharer/sharer.php?".concat(params);
}
function fbButton() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return window.open(getFbButtonUrl(options), '_blank', WIN_PARAMS);
}
function gp() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = options.url;
  var params = encodeParams({
    url: url
  });
  return window.open("https://plus.google.com/share?".concat(params), '_blank', WIN_PARAMS);
}
function mail() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = options.url,
    title = options.title,
    description = options.description,
    image = options.image;
  var params = encodeParams({
    share_url: url,
    title: title,
    description: description,
    imageurl: image
  });
  return window.open("http://connect.mail.ru/share?".concat(params), '_blank', WIN_PARAMS);
}
function getEmailUrl() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var to = options.to,
    url = options.url,
    title = options.title,
    description = options.description,
    subject = options.subject;
  var params = encodeParams({
    subject: subject,
    body: "".concat(title || '', "\r\n").concat(description || '', "\r\n").concat(url || '')
  });
  return "mailto:".concat(to || '', "?").concat(params);
}
function email() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return window.location.assign(getEmailUrl(options));
}
function getOkUrl() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = options.url,
    title = options.title,
    image = options.image;
  var params = encodeParams({
    url: url,
    title: title,
    imageUrl: image
  });
  return "https://connect.ok.ru/offer?".concat(params);
}
function ok() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return window.open(getOkUrl(options), '_blank', WIN_PARAMS);
}
function getTelegramUrl() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = options.url,
    title = options.title;
  var params = encodeParams({
    url: url,
    text: title
  });
  return "https://t.me/share/url?".concat(params);
}
function telegram() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return window.open(getTelegramUrl(options), '_blank', WIN_PARAMS);
}
function getTwUrl() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var title = options.title,
    url = options.url,
    _options$hashtags = options.hashtags,
    hashtags = _options$hashtags === void 0 ? [] : _options$hashtags;
  var params = encodeParams({
    text: title,
    url: url,
    hashtags: hashtags.join(',')
  });
  return "https://twitter.com/intent/tweet?".concat(params);
}
function tw() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return window.open(getTwUrl(options), '_blank', WIN_PARAMS);
}
function reddit() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = options.url,
    title = options.title;
  var params = encodeParams({
    url: url,
    title: title
  });
  return window.open("https://www.reddit.com/submit?".concat(params), '_blank', WIN_PARAMS);
}
function pinterest() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var description = options.description,
    url = options.url,
    media = options.media;
  var params = encodeParams({
    url: url,
    description: description,
    media: media
  });
  return window.open("https://pinterest.com/pin/create/button/?".concat(params), '_blank', WIN_PARAMS);
}
function tumblr() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = options.url,
    title = options.title,
    caption = options.caption,
    _options$tags = options.tags,
    tags = _options$tags === void 0 ? [] : _options$tags,
    _options$posttype = options.posttype,
    posttype = _options$posttype === void 0 ? 'link' : _options$posttype;
  var params = encodeParams({
    canonicalUrl: url,
    title: title,
    caption: caption,
    tags: tags.join(','),
    posttype: posttype
  });
  return window.open("https://www.tumblr.com/widgets/share/tool?".concat(params), '_blank', WIN_PARAMS);
}
function isMobileSafari() {
  return !!window.navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
}
function mobileShare(link) {
  return isMobileSafari() ? window.open(link) : window.location.assign(link);
}
function getViberUrl() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = options.url,
    title = options.title;
  if (!url && !title) {
    throw new Error('url and title not specified');
  }
  var params = encodeParams({
    text: [title, url].filter(function (item) {
      return item;
    }).join(' ')
  });
  return "viber://forward?".concat(params);
}
function viber() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return mobileShare(getViberUrl(options));
}
var VK_MAX_LENGTH = 80;
function getVkUrl() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = options.url,
    image = options.image,
    isVkParse = options.isVkParse;
  var description = options.description,
    title = options.title;
  if (description && description.length > VK_MAX_LENGTH) {
    description = "".concat(description.substr(0, VK_MAX_LENGTH), "...");
  }
  if (title && title.length > VK_MAX_LENGTH) {
    title = "".concat(title.substr(0, VK_MAX_LENGTH), "...");
  }
  var params;
  if (isVkParse) {
    params = encodeParams({
      url: url
    });
  } else {
    params = encodeParams({
      url: url,
      title: title,
      description: description,
      image: image,
      noparse: true
    });
  }
  return "https://vk.com/share.php?".concat(params);
}
function vk() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return window.open(getVkUrl(options), '_blank', WIN_PARAMS);
}
function getWhatsappUrl() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var phone = options.phone,
    title = options.title,
    url = options.url;
  var params = encodeParams({
    text: [title, url].filter(function (item) {
      return item;
    }).join(' '),
    phone: phone
  });
  return "https://api.whatsapp.com/send?".concat(params);
}
function whatsapp() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return window.open(getWhatsappUrl(options), '_blank', WIN_PARAMS);
}
function linkedin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var title = options.title,
    url = options.url,
    description = options.description;
  var params = encodeParams({
    title: title,
    summary: description,
    url: url
  });
  return window.open("https://www.linkedin.com/shareArticle?mini=true&".concat(params), '_blank', WIN_PARAMS);
}
function messenger() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fbAppId = options.fbAppId,
    url = options.url;
  if (!fbAppId) {
    throw new Error('fbAppId is not defined');
  }
  var params = encodeParams({
    app_id: fbAppId,
    link: url
  });
  return window.location.assign("fb-messenger://share?".concat(params));
}
function line() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var title = options.title,
    url = options.url;
  if (!url) {
    throw new Error('url is not defined');
  }
  var params = encodeURIComponent("".concat(url));
  if (title) {
    params = "".concat(encodeURIComponent("".concat(title, " "))).concat(params);
  }
  return window.open("https://line.me/R/msg/text/?".concat(params), '_blank', WIN_PARAMS);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************************!*\
  !*** ./blocks/social-sharing-icon/frontend.ts ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vanilla-sharing */ "./node_modules/vanilla-sharing/dist/vanilla-sharing.esm.js");

document.addEventListener('DOMContentLoaded', () => {
  const sharingIcons = document.querySelectorAll('.wp-block-jankx-social-sharing-icon .sharing-icon-button');
  sharingIcons.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const network = button.getAttribute('data-network') || '';
      const url = button.getAttribute('data-url') || window.location.href;
      const title = button.getAttribute('data-title') || document.title;

      // Map network names to vanilla-sharing functions
      const sharingMap = {
        'facebook': vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__.fbButton,
        'twitter': vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__.tw,
        'linkedin': vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__.linkedin,
        'whatsapp': vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__.whatsapp,
        'telegram': vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__.telegram,
        'reddit': vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__.reddit,
        'email': vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__.email,
        'messenger': vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__.messenger,
        'viber': vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__.viber,
        'line': vanilla_sharing__WEBPACK_IMPORTED_MODULE_0__.line
      };
      const shareFunction = sharingMap[network];
      if (shareFunction) {
        shareFunction({
          url: url,
          title: title
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
})();

/******/ })()
;
//# sourceMappingURL=frontend.js.map
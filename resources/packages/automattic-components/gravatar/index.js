import { jsx as _jsx } from "react/jsx-runtime";
import { getUrlParts, getUrlFromParts, determineUrlType, URL_TYPE, format as formatUrl, safeImageUrl, } from '@automattic/calypso-url';
import clsx from 'clsx';
import { Component } from 'react';
import './style.scss';
export class Gravatar extends Component {
    static defaultProps = {
        // The REST-API returns s=96 by default, so that is most likely to be cached
        imgSize: 96,
        size: 32,
    };
    state = { failedToLoad: false };
    getResizedImageURL(imageURL) {
        const { imgSize } = this.props;
        const defaultUrl = 'https://www.gravatar.com/avatar/0';
        imageURL = imageURL || defaultUrl;
        const urlType = determineUrlType(imageURL);
        if (urlType === URL_TYPE.INVALID || urlType === URL_TYPE.PATH_RELATIVE) {
            return defaultUrl;
        }
        const { search, origin, host, ...parsedURL } = getUrlParts(imageURL);
        if (/^([-a-zA-Z0-9_]+\.)*(gravatar.com)$/.test(parsedURL.hostname)) {
            parsedURL.searchParams.set('s', imgSize?.toString() ?? '32');
            parsedURL.searchParams.set('d', 'mm');
        }
        else {
            // assume photon
            parsedURL.searchParams.set('resize', `${imgSize},${imgSize}`);
        }
        // getUrlFromParts can only handle absolute URLs, so add dummy data if needed.
        // formatUrl will remove it away, to match the previous url type.
        parsedURL.protocol = parsedURL.protocol || 'https:';
        parsedURL.hostname = parsedURL.hostname || '__domain__.invalid';
        return formatUrl(getUrlFromParts(parsedURL), urlType);
    }
    onError = () => this.setState({ failedToLoad: true });
    render() {
        const { alt, title, size, tempImage, user } = this.props;
        if (!user) {
            return _jsx("span", { className: "gravatar is-placeholder", style: { width: size, height: size } });
        }
        if (this.state.failedToLoad && !tempImage) {
            return _jsx("span", { className: "gravatar is-missing" });
        }
        const altText = alt || user.display_name || user.name;
        const avatarURL = tempImage || this.getResizedImageURL(safeImageUrl(user.avatar_URL));
        const classes = clsx('gravatar', this.props.className);
        return (_jsx("img", { alt: altText, title: title, className: classes, src: avatarURL, width: size, height: size, onError: this.onError }));
    }
}
//# sourceMappingURL=index.js.map
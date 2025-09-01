import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from '@emotion/css';
import clsx from 'clsx';
import './style.scss';
import { useMshotsImg } from './use-mshots-img';
import { getTextColorFromBackground } from './utils';
export const DEFAULT_THUMBNAIL_SIZE = { width: 106, height: 76.55 };
const DEFAULT_CLASSNAME = css(DEFAULT_THUMBNAIL_SIZE);
const VIEWPORT_BASE = 1200;
export const SiteThumbnail = ({ backgroundColor, children, className, alt, mShotsUrl = '', bgColorImgUrl, width = DEFAULT_THUMBNAIL_SIZE.width, height = DEFAULT_THUMBNAIL_SIZE.height, dimensionsSrcset = [], sizesAttr = '', viewport = VIEWPORT_BASE, mshotsOption, }) => {
    const options = {
        vpw: viewport,
        vph: viewport,
        w: width,
        h: height,
        ...mshotsOption,
    };
    const { imgProps, isLoading, isError } = useMshotsImg(mShotsUrl, options, [
        ...dimensionsSrcset,
        { width, height },
    ]);
    const color = backgroundColor && getTextColorFromBackground(backgroundColor);
    const classes = clsx('site-thumbnail', isLoading ? 'site-thumbnail-loading' : 'site-thumbnail-visible', DEFAULT_CLASSNAME, className);
    const showLoader = mShotsUrl && !isError;
    const mshotIsFullyLoaded = imgProps.src && !isError && !isLoading;
    const blurSize = width > DEFAULT_THUMBNAIL_SIZE.width ? 'medium' : 'small';
    return (_jsxs("div", { className: classes, style: { backgroundColor, color }, children: [!!bgColorImgUrl && !mshotIsFullyLoaded && (_jsx("div", { className: `site-thumbnail__image-bg site-thumbnail__image-blur-${blurSize}`, style: { backgroundImage: `url(${bgColorImgUrl})` } })), (isLoading || isError) && (_jsx("div", { className: clsx({ 'site-thumbnail-loader': showLoader }, 'site-thumbnail-icon'), children: children })), imgProps.src && !isLoading && !isError && (_jsx("img", { className: "site-thumbnail__image", alt: alt, sizes: sizesAttr || `${width}px`, ...imgProps }))] }));
};
//# sourceMappingURL=index.js.map
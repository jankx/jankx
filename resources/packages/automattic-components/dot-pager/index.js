import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@wordpress/components';
import { Icon, arrowRight } from '@wordpress/icons';
import clsx from 'clsx';
import { useTranslate, useRtl } from 'i18n-calypso';
import { times } from 'lodash';
import { Children, useState, useEffect } from 'react';
import { Swipeable } from '../swipeable';
import './style.scss';
const Controls = ({ showControlLabels = false, currentPage, numberOfPages, setCurrentPage, navArrowSize, tracksPrefix, tracksFn, }) => {
    const translate = useTranslate();
    const isRtl = useRtl();
    if (numberOfPages < 2) {
        return null;
    }
    const canGoBack = currentPage > 0;
    const canGoForward = currentPage < numberOfPages - 1;
    return (_jsxs("ul", { className: "dot-pager__controls", "aria-label": translate('Pager controls'), children: [times(numberOfPages, (page) => (_jsx("li", { "aria-current": page === currentPage ? 'page' : undefined, children: _jsx("button", { className: clsx('dot-pager__control-choose-page', {
                        'dot-pager__control-current': page === currentPage,
                    }), disabled: page === currentPage, "aria-label": translate('Page %(page)d of %(numberOfPages)d', {
                        args: { page: page + 1, numberOfPages },
                    }), onClick: () => {
                        tracksFn(tracksPrefix + '_dot_click', {
                            current_page: currentPage,
                            destination_page: page,
                        });
                        setCurrentPage(page);
                    } }, page.toString()) }, `page-${page}`))), _jsx("li", { className: "dot-pager__control-gap", children: _jsxs("button", { className: "dot-pager__control-prev", disabled: !canGoBack, "aria-label": translate('Previous'), onClick: () => {
                        const destinationPage = currentPage - 1;
                        tracksFn(tracksPrefix + '_prev_arrow_click', {
                            current_page: currentPage,
                            destination_page: destinationPage,
                        });
                        setCurrentPage(destinationPage);
                    }, children: [_jsx(Icon, { icon: arrowRight, size: navArrowSize, fill: "currentColor", style: 
                            /* Flip the icon for languages with LTR direction. */
                            !isRtl ? { transform: 'scaleX(-1)' } : undefined }), showControlLabels && translate('Previous')] }) }, "dot-pager-prev"), _jsx("li", { children: _jsxs("button", { className: "dot-pager__control-next", disabled: !canGoForward, "aria-label": translate('Next'), onClick: () => {
                        const destinationPage = currentPage + 1;
                        tracksFn(tracksPrefix + '_next_arrow_click', {
                            current_page: currentPage,
                            destination_page: destinationPage,
                        });
                        setCurrentPage(destinationPage);
                    }, children: [showControlLabels && translate('Next'), _jsx(Icon, { icon: arrowRight, size: navArrowSize, fill: "currentColor", style: 
                            /* Flip the icon for languages with RTL direction. */
                            isRtl ? { transform: 'scaleX(-1)' } : undefined })] }) }, "dot-pager-next")] }));
};
const DotPager = ({ showControlLabels = false, hasDynamicHeight = false, children, className = '', onPageSelected, isClickEnabled = false, rotateTime = 0, navArrowSize = 18, tracksPrefix = '', tracksFn = () => { }, includePreviousButton = false, includeNextButton = false, includeFinishButton = false, onFinish = () => { }, ...props }) => {
    const translate = useTranslate();
    // Filter out the empty children
    const normalizedChildren = Children.toArray(children).filter(Boolean);
    const [currentPage, setCurrentPage] = useState(0);
    const numPages = Children.count(normalizedChildren);
    useEffect(() => {
        if (currentPage >= numPages) {
            setCurrentPage(numPages - 1);
        }
    }, [numPages, currentPage]);
    useEffect(() => {
        if (rotateTime > 0 && numPages > 1) {
            const timerId = setTimeout(() => {
                setCurrentPage((currentPage + 1) % numPages);
            }, rotateTime);
            return () => clearTimeout(timerId);
        }
    }, [currentPage, numPages, rotateTime]);
    const handleSelectPage = (index) => {
        setCurrentPage(index);
        onPageSelected?.(index);
    };
    return (_jsxs("div", { className: clsx('dot-pager', className), ...props, children: [_jsx(Controls, { showControlLabels: showControlLabels, currentPage: currentPage, numberOfPages: numPages, setCurrentPage: handleSelectPage, navArrowSize: navArrowSize, tracksPrefix: tracksPrefix, tracksFn: tracksFn }), _jsx(Swipeable, { hasDynamicHeight: hasDynamicHeight, onPageSelect: handleSelectPage, currentPage: currentPage, pageClassName: "dot-pager__page", containerClassName: "dot-pager__pages", isClickEnabled: isClickEnabled, children: normalizedChildren }), includePreviousButton && currentPage !== 0 && (_jsx(Button, { className: "dot-pager__button dot-pager__button_previous", onClick: () => {
                    const destinationPage = currentPage - 1;
                    tracksFn(tracksPrefix + '_prev_button_click', {
                        current_page: currentPage,
                        destination_page: destinationPage,
                    });
                    setCurrentPage(destinationPage);
                }, children: translate('Previous') })), includeNextButton && currentPage < numPages - 1 && (_jsx(Button, { className: "dot-pager__button dot-pager__button_next is-primary", onClick: () => {
                    const destinationPage = currentPage + 1;
                    tracksFn(tracksPrefix + '_next_button_click', {
                        current_page: currentPage,
                        destination_page: destinationPage,
                    });
                    setCurrentPage(destinationPage);
                }, children: translate('Next') })), includeFinishButton && currentPage === numPages - 1 && (_jsx(Button, { className: "dot-pager__button dot-pager__button_finish is-primary", onClick: () => {
                    tracksFn(tracksPrefix + '_finish_button_click');
                    onFinish();
                }, children: translate('Done') }))] }));
};
export default DotPager;
//# sourceMappingURL=index.js.map
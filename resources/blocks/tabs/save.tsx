import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

interface TabsSaveProps {
    attributes: any;
}

export default function Save({ attributes }: TabsSaveProps) {
    const {
        uniqueId,
        tabLayout,
        labelsPosition,
        containerBorderStyle,
        containerTopBorderWidth,
        containerRightBorderWidth,
        containerBottomBorderWidth,
        containerLeftBorderWidth,
        enableContainerLinkedBorder,
        containerLinkedBorderWidth,
        containerTopBorderRadius,
        containerRightBorderRadius,
        containerBottomBorderRadius,
        containerLeftBorderRadius,
        enableContainerLinkedBorderRadius,
        containerLinkedBorderRadius,
        containerDeskTopMargin,
        containerDeskBottomMargin,
        enableContainerBoxShadow,
        containerBorderColor,
        showSeparator,
        separatorStyle,
        separatorColor,
        separatorHeight,
        labelsDeskPaddingTop,
        labelsDeskPaddingRight,
        labelsDeskPaddingBottom,
        labelsDeskPaddingLeft,
        enableLinkedDeskPadding,
        labelsLinkedDeskPadding,
        labelsColor,
        labelsBg,
        addLabelsSeparator,
        labelsSeparatorStyle,
        labelsSeparatorColor,
        labelsSeparatorWidth,
        tabsContentDeskPaddingTop,
        tabsContentDeskPaddingRight,
        tabsContentDeskPaddingBottom,
        tabsContentDeskPaddingLeft,
        enableLinkedContentDeskPadding,
        tabsContentLinkedDeskPadding,
        tabsContentColor,
        tabsContentBg,
        useCustomColors,
        activeTabColor,
        activeTabBg,
        makeActiveTabSeparateLess,
        zIndex,
        anchorId,
        customClass,
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `jankx-tabs-block ${customClass || ''}`,
        id: anchorId || uniqueId,
    });

    // Build inline styles
    const containerStyles: React.CSSProperties = {
        borderStyle: containerBorderStyle,
        borderTopWidth: containerTopBorderWidth ? `${containerTopBorderWidth}px` : undefined,
        borderRightWidth: containerRightBorderWidth ? `${containerRightBorderWidth}px` : undefined,
        borderBottomWidth: containerBottomBorderWidth ? `${containerBottomBorderWidth}px` : undefined,
        borderLeftWidth: containerLeftBorderWidth ? `${containerLeftBorderWidth}px` : undefined,
        borderColor: containerBorderColor,
        borderRadius: enableContainerLinkedBorderRadius && containerLinkedBorderRadius
            ? `${containerLinkedBorderRadius}px`
            : `${containerTopBorderRadius || 0}px ${containerRightBorderRadius || 0}px ${containerBottomBorderRadius || 0}px ${containerLeftBorderRadius || 0}px`,
        marginTop: containerDeskTopMargin,
        marginBottom: containerDeskBottomMargin,
        zIndex: zIndex,
    };

    const labelsStyles: React.CSSProperties = {
        backgroundColor: labelsBg,
        color: labelsColor,
        paddingTop: enableLinkedDeskPadding && labelsLinkedDeskPadding
            ? `${labelsLinkedDeskPadding}px`
            : labelsDeskPaddingTop ? `${labelsDeskPaddingTop}px` : undefined,
        paddingRight: enableLinkedDeskPadding && labelsLinkedDeskPadding
            ? `${labelsLinkedDeskPadding}px`
            : labelsDeskPaddingRight ? `${labelsDeskPaddingRight}px` : undefined,
        paddingBottom: enableLinkedDeskPadding && labelsLinkedDeskPadding
            ? `${labelsLinkedDeskPadding}px`
            : labelsDeskPaddingBottom ? `${labelsDeskPaddingBottom}px` : undefined,
        paddingLeft: enableLinkedDeskPadding && labelsLinkedDeskPadding
            ? `${labelsLinkedDeskPadding}px`
            : labelsDeskPaddingLeft ? `${labelsDeskPaddingLeft}px` : undefined,
    };

    const contentStyles: React.CSSProperties = {
        backgroundColor: tabsContentBg,
        color: tabsContentColor,
        paddingTop: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding
            ? `${tabsContentLinkedDeskPadding}px`
            : tabsContentDeskPaddingTop ? `${tabsContentDeskPaddingTop}px` : undefined,
        paddingRight: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding
            ? `${tabsContentLinkedDeskPadding}px`
            : tabsContentDeskPaddingRight ? `${tabsContentDeskPaddingRight}px` : undefined,
        paddingBottom: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding
            ? `${tabsContentLinkedDeskPadding}px`
            : tabsContentDeskPaddingBottom ? `${tabsContentDeskPaddingBottom}px` : undefined,
        paddingLeft: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding
            ? `${tabsContentLinkedDeskPadding}px`
            : tabsContentDeskPaddingLeft ? `${tabsContentDeskPaddingLeft}px` : undefined,
    };

    // Build CSS custom properties for frontend JavaScript
    const cssVars = {
        '--jankx-tabs-layout': tabLayout,
        '--jankx-tabs-labels-position': labelsPosition,
        '--jankx-tabs-separator-style': showSeparator ? separatorStyle : 'none',
        '--jankx-tabs-separator-color': separatorColor,
        '--jankx-tabs-separator-height': `${separatorHeight}px`,
        '--jankx-tabs-labels-separator-style': addLabelsSeparator ? labelsSeparatorStyle : 'none',
        '--jankx-tabs-labels-separator-color': labelsSeparatorColor,
        '--jankx-tabs-labels-separator-width': `${labelsSeparatorWidth}px`,
        '--jankx-tabs-active-color': useCustomColors ? activeTabColor : undefined,
        '--jankx-tabs-active-bg': useCustomColors ? activeTabBg : undefined,
        '--jankx-tabs-active-separate-less': makeActiveTabSeparateLess ? '1' : '0',
    };

    return (
        <div {...blockProps} style={{ ...containerStyles, ...cssVars }}>
            <div className={`jankx-tabs-container layout-${tabLayout} position-${labelsPosition}`}>
                {/* Tab Labels */}
                <div className="jankx-tabs-labels" style={labelsStyles}>
                    {/* Tab labels will be generated by frontend JavaScript */}
                </div>

                {/* Separator */}
                {showSeparator && (
                    <div
                        className="jankx-tabs-separator"
                        style={{
                            borderStyle: separatorStyle,
                            borderColor: separatorColor,
                            borderTopWidth: separatorHeight ? `${separatorHeight}px` : '1px',
                        }}
                    />
                )}

                {/* Tab Content */}
                <div className="jankx-tabs-content" style={contentStyles}>
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
}

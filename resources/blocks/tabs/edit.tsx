import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    InnerBlocks,
} from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    TabPanel,
    SelectControl,
    CardDivider,
    RangeControl,
    TextControl,
    Tip,
    ColorPicker,
    Button,
    ButtonGroup,
} from '@wordpress/components';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

import './editor.scss';

// Import tab block
import './tab';

const ALLOWED_BLOCKS = ['jankx/tab'];

// Options
const borderStyles = [
    { label: 'None', value: 'none' },
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
    { label: 'Dotted', value: 'dotted' },
    { label: 'Double', value: 'double' },
    { label: 'Groove', value: 'groove' },
    { label: 'Ridge', value: 'ridge' },
    { label: 'Inset', value: 'inset' },
    { label: 'Outset', value: 'outset' },
];

const separatorStyles = [
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
    { label: 'Dotted', value: 'dotted' },
    { label: 'Double', value: 'double' },
];

const layoutOptions = [
    { label: 'Horizontal', value: 'horizontal' },
    { label: 'Vertical', value: 'vertical' },
];

const positionOptions = [
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
];

interface TabsEditProps {
    attributes: any;
    setAttributes: (attributes: any) => void;
    clientId: string;
}

export default function Edit({ attributes, setAttributes, clientId }: TabsEditProps) {
    const {
        tabLabelsArray,
        updateChild,
        tabLayout,
        activeTabColor,
        activeTabBg,
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
        containerTabTopMargin,
        containerTabBottomMargin,
        containerMobTopMargin,
        containerMobBottomMargin,
        enableContainerBoxShadow,
        containerBorderColor,
        showSeparator,
        separatorStyle,
        separatorColor,
        separatorHeight,
        labelsPosition,
        labelsDeskPaddingTop,
        labelsDeskPaddingRight,
        labelsDeskPaddingBottom,
        labelsDeskPaddingLeft,
        enableLinkedDeskPadding,
        labelsLinkedDeskPadding,
        labelsTabPaddingTop,
        labelsTabPaddingRight,
        labelsTabPaddingBottom,
        labelsTabPaddingLeft,
        enableLinkedTabPadding,
        labelsLinkedTabPadding,
        labelsMobPaddingTop,
        labelsMobPaddingRight,
        labelsMobPaddingBottom,
        labelsMobPaddingLeft,
        enableLinkedMobPadding,
        labelsLinkedMobPadding,
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
        tabsContentTabPaddingTop,
        tabsContentTabPaddingRight,
        tabsContentTabPaddingBottom,
        tabsContentTabPaddingLeft,
        enableLinkedContentTabPadding,
        tabsContentLinkedTabPadding,
        tabsContentMobPaddingTop,
        tabsContentMobPaddingRight,
        tabsContentMobPaddingBottom,
        tabsContentMobPaddingLeft,
        enableLinkedContentMobPadding,
        tabsContentLinkedMobPadding,
        tabsContentColor,
        tabsContentBg,
        useCustomColors,
        makeActiveTabSeparateLess,
        zIndex,
        anchorId,
        customClass,
    } = attributes;

    const { updateBlockAttributes } = useDispatch('core/block-editor');
    const [activeTab, setActiveTab] = useState(0);

    // Get child blocks
    const childBlocks = useSelect((select) => {
        return select('core/block-editor').getBlocks(clientId);
    }, [clientId]);

    // Update tab labels when child blocks change
    useEffect(() => {
        if (updateChild) {
            const newTabLabels = childBlocks.map((block: any) => {
                return block.attributes.tabLabel || `Tab ${block.attributes.blockIndex + 1}`;
            });
            setAttributes({ tabLabelsArray: newTabLabels, updateChild: false });
        }
    }, [updateChild, childBlocks, setAttributes]);

    // Generate unique ID if not exists
    useEffect(() => {
        if (!attributes.uniqueId) {
            setAttributes({ uniqueId: `tabs-${Date.now()}` });
        }
    }, [attributes.uniqueId, setAttributes]);

    const blockProps = useBlockProps({
        className: `jankx-tabs-block ${customClass || ''}`,
        id: anchorId || attributes.uniqueId,
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

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const addNewTab = () => {
        const newTabBlock = wp.blocks.createBlock('jankx/tab', {
            tabLabel: `Tab ${childBlocks.length + 1}`,
            blockIndex: childBlocks.length,
        });

        const newBlocks = [...childBlocks, newTabBlock];
        updateBlockAttributes(clientId, {
            innerContent: newBlocks,
            updateChild: true
        });
    };

    return (
        <Fragment>
            <InspectorControls>
                <TabPanel
                    className="jankx-tabs-inspector"
                    activeClass="active-tab"
                    tabs={[
                        {
                            name: 'general',
                            title: __('General', 'jankx'),
                            className: 'general-tab',
                        },
                        {
                            name: 'style',
                            title: __('Style', 'jankx'),
                            className: 'style-tab',
                        },
                        {
                            name: 'advanced',
                            title: __('Advanced', 'jankx'),
                            className: 'advanced-tab',
                        },
                    ]}
                >
                    {(tab) => (
                        <div>
                            {tab.name === 'general' && (
                                <Fragment>
                                    <PanelBody title={__('General Settings', 'jankx')} initialOpen={true}>
                                        <SelectControl
                                            label={__('Tab Layout', 'jankx')}
                                            value={tabLayout}
                                            options={layoutOptions}
                                            onChange={(value) => setAttributes({ tabLayout: value })}
                                        />

                                        <SelectControl
                                            label={__('Labels Position', 'jankx')}
                                            value={labelsPosition}
                                            options={positionOptions}
                                            onChange={(value) => setAttributes({ labelsPosition: value })}
                                        />

                                        <ToggleControl
                                            label={__('Show Separator', 'jankx')}
                                            checked={showSeparator}
                                            onChange={(value) => setAttributes({ showSeparator: value })}
                                        />

                                        {showSeparator && (
                                            <Fragment>
                                                <SelectControl
                                                    label={__('Separator Style', 'jankx')}
                                                    value={separatorStyle}
                                                    options={separatorStyles}
                                                    onChange={(value) => setAttributes({ separatorStyle: value })}
                                                />

                                                <RangeControl
                                                    label={__('Separator Height', 'jankx')}
                                                    value={separatorHeight}
                                                    onChange={(value) => setAttributes({ separatorHeight: value })}
                                                    min={1}
                                                    max={10}
                                                />

                                                <div className="components-base-control">
                                                    <label className="components-base-control__label">
                                                        {__('Separator Color', 'jankx')}
                                                    </label>
                                                    <ColorPicker
                                                        color={separatorColor}
                                                        onChangeComplete={(color) => setAttributes({ separatorColor: color.hex })}
                                                    />
                                                </div>
                                            </Fragment>
                                        )}

                                        <ToggleControl
                                            label={__('Add Labels Separator', 'jankx')}
                                            checked={addLabelsSeparator}
                                            onChange={(value) => setAttributes({ addLabelsSeparator: value })}
                                        />

                                        {addLabelsSeparator && (
                                            <Fragment>
                                                <SelectControl
                                                    label={__('Labels Separator Style', 'jankx')}
                                                    value={labelsSeparatorStyle}
                                                    options={separatorStyles}
                                                    onChange={(value) => setAttributes({ labelsSeparatorStyle: value })}
                                                />

                                                <RangeControl
                                                    label={__('Labels Separator Width', 'jankx')}
                                                    value={labelsSeparatorWidth}
                                                    onChange={(value) => setAttributes({ labelsSeparatorWidth: value })}
                                                    min={1}
                                                    max={10}
                                                />

                                                <div className="components-base-control">
                                                    <label className="components-base-control__label">
                                                        {__('Labels Separator Color', 'jankx')}
                                                    </label>
                                                    <ColorPicker
                                                        color={labelsSeparatorColor}
                                                        onChangeComplete={(color) => setAttributes({ labelsSeparatorColor: color.hex })}
                                                    />
                                                </div>
                                            </Fragment>
                                        )}
                                    </PanelBody>

                                    <PanelBody title={__('Colors', 'jankx')} initialOpen={false}>
                                        <ToggleControl
                                            label={__('Use Custom Colors', 'jankx')}
                                            checked={useCustomColors}
                                            onChange={(value) => setAttributes({ useCustomColors: value })}
                                        />

                                        {useCustomColors && (
                                            <Fragment>
                                                <div className="components-base-control">
                                                    <label className="components-base-control__label">
                                                        {__('Active Tab Color', 'jankx')}
                                                    </label>
                                                    <ColorPicker
                                                        color={activeTabColor}
                                                        onChangeComplete={(color) => setAttributes({ activeTabColor: color.hex })}
                                                    />
                                                </div>

                                                <div className="components-base-control">
                                                    <label className="components-base-control__label">
                                                        {__('Active Tab Background', 'jankx')}
                                                    </label>
                                                    <ColorPicker
                                                        color={activeTabBg}
                                                        onChangeComplete={(color) => setAttributes({ activeTabBg: color.hex })}
                                                    />
                                                </div>

                                                <ToggleControl
                                                    label={__('Make Active Tab Separate Less', 'jankx')}
                                                    checked={makeActiveTabSeparateLess}
                                                    onChange={(value) => setAttributes({ makeActiveTabSeparateLess: value })}
                                                />
                                            </Fragment>
                                        )}
                                    </PanelBody>
                                </Fragment>
                            )}

                            {tab.name === 'style' && (
                                <Fragment>
                                    <PanelBody title={__('Container Style', 'jankx')} initialOpen={true}>
                                        <SelectControl
                                            label={__('Border Style', 'jankx')}
                                            value={containerBorderStyle}
                                            options={borderStyles}
                                            onChange={(value) => setAttributes({ containerBorderStyle: value })}
                                        />

                                        {containerBorderStyle !== 'none' && (
                                            <Fragment>
                                                <ToggleControl
                                                    label={__('Linked Border Width', 'jankx')}
                                                    checked={enableContainerLinkedBorder}
                                                    onChange={(value) => setAttributes({ enableContainerLinkedBorder: value })}
                                                />

                                                {enableContainerLinkedBorder ? (
                                                    <RangeControl
                                                        label={__('Border Width', 'jankx')}
                                                        value={parseInt(containerLinkedBorderWidth)}
                                                        onChange={(value) => setAttributes({ containerLinkedBorderWidth: value.toString() })}
                                                        min={0}
                                                        max={20}
                                                    />
                                                ) : (
                                                    <Fragment>
                                                        <RangeControl
                                                            label={__('Top Border Width', 'jankx')}
                                                            value={parseInt(containerTopBorderWidth)}
                                                            onChange={(value) => setAttributes({ containerTopBorderWidth: value.toString() })}
                                                            min={0}
                                                            max={20}
                                                        />
                                                        <RangeControl
                                                            label={__('Right Border Width', 'jankx')}
                                                            value={parseInt(containerRightBorderWidth)}
                                                            onChange={(value) => setAttributes({ containerRightBorderWidth: value.toString() })}
                                                            min={0}
                                                            max={20}
                                                        />
                                                        <RangeControl
                                                            label={__('Bottom Border Width', 'jankx')}
                                                            value={parseInt(containerBottomBorderWidth)}
                                                            onChange={(value) => setAttributes({ containerBottomBorderWidth: value.toString() })}
                                                            min={0}
                                                            max={20}
                                                        />
                                                        <RangeControl
                                                            label={__('Left Border Width', 'jankx')}
                                                            value={parseInt(containerLeftBorderWidth)}
                                                            onChange={(value) => setAttributes({ containerLeftBorderWidth: value.toString() })}
                                                            min={0}
                                                            max={20}
                                                        />
                                                    </Fragment>
                                                )}

                                                <div className="components-base-control">
                                                    <label className="components-base-control__label">
                                                        {__('Border Color', 'jankx')}
                                                    </label>
                                                    <ColorPicker
                                                        color={containerBorderColor}
                                                        onChangeComplete={(color) => setAttributes({ containerBorderColor: color.hex })}
                                                    />
                                                </div>
                                            </Fragment>
                                        )}

                                        <ToggleControl
                                            label={__('Linked Border Radius', 'jankx')}
                                            checked={enableContainerLinkedBorderRadius}
                                            onChange={(value) => setAttributes({ enableContainerLinkedBorderRadius: value })}
                                        />

                                        {enableContainerLinkedBorderRadius ? (
                                            <RangeControl
                                                label={__('Border Radius', 'jankx')}
                                                value={parseInt(containerLinkedBorderRadius)}
                                                onChange={(value) => setAttributes({ containerLinkedBorderRadius: value.toString() })}
                                                min={0}
                                                max={50}
                                            />
                                        ) : (
                                            <Fragment>
                                                <RangeControl
                                                    label={__('Top Left Radius', 'jankx')}
                                                    value={parseInt(containerTopBorderRadius)}
                                                    onChange={(value) => setAttributes({ containerTopBorderRadius: value.toString() })}
                                                    min={0}
                                                    max={50}
                                                />
                                                <RangeControl
                                                    label={__('Top Right Radius', 'jankx')}
                                                    value={parseInt(containerRightBorderRadius)}
                                                    onChange={(value) => setAttributes({ containerRightBorderRadius: value.toString() })}
                                                    min={0}
                                                    max={50}
                                                />
                                                <RangeControl
                                                    label={__('Bottom Right Radius', 'jankx')}
                                                    value={parseInt(containerBottomBorderRadius)}
                                                    onChange={(value) => setAttributes({ containerBottomBorderRadius: value.toString() })}
                                                    min={0}
                                                    max={50}
                                                />
                                                <RangeControl
                                                    label={__('Bottom Left Radius', 'jankx')}
                                                    value={parseInt(containerLeftBorderRadius)}
                                                    onChange={(value) => setAttributes({ containerLeftBorderRadius: value.toString() })}
                                                    min={0}
                                                    max={50}
                                                />
                                            </Fragment>
                                        )}

                                        <ToggleControl
                                            label={__('Enable Box Shadow', 'jankx')}
                                            checked={enableContainerBoxShadow}
                                            onChange={(value) => setAttributes({ enableContainerBoxShadow: value })}
                                        />
                                    </PanelBody>

                                    <PanelBody title={__('Labels Style', 'jankx')} initialOpen={false}>
                                        <div className="components-base-control">
                                            <label className="components-base-control__label">
                                                {__('Labels Background', 'jankx')}
                                            </label>
                                            <ColorPicker
                                                color={labelsBg}
                                                onChangeComplete={(color) => setAttributes({ labelsBg: color.hex })}
                                            />
                                        </div>

                                        <div className="components-base-control">
                                            <label className="components-base-control__label">
                                                {__('Labels Color', 'jankx')}
                                            </label>
                                            <ColorPicker
                                                color={labelsColor}
                                                onChangeComplete={(color) => setAttributes({ labelsColor: color.hex })}
                                            />
                                        </div>

                                        <CardDivider />

                                        <h4>{__('Desktop Padding', 'jankx')}</h4>
                                        <ToggleControl
                                            label={__('Linked Padding', 'jankx')}
                                            checked={enableLinkedDeskPadding}
                                            onChange={(value) => setAttributes({ enableLinkedDeskPadding: value })}
                                        />

                                        {enableLinkedDeskPadding ? (
                                            <RangeControl
                                                label={__('Padding', 'jankx')}
                                                value={parseInt(labelsLinkedDeskPadding)}
                                                onChange={(value) => setAttributes({ labelsLinkedDeskPadding: value.toString() })}
                                                min={0}
                                                max={100}
                                            />
                                        ) : (
                                            <Fragment>
                                                <RangeControl
                                                    label={__('Top Padding', 'jankx')}
                                                    value={parseInt(labelsDeskPaddingTop)}
                                                    onChange={(value) => setAttributes({ labelsDeskPaddingTop: value.toString() })}
                                                    min={0}
                                                    max={100}
                                                />
                                                <RangeControl
                                                    label={__('Right Padding', 'jankx')}
                                                    value={parseInt(labelsDeskPaddingRight)}
                                                    onChange={(value) => setAttributes({ labelsDeskPaddingRight: value.toString() })}
                                                    min={0}
                                                    max={100}
                                                />
                                                <RangeControl
                                                    label={__('Bottom Padding', 'jankx')}
                                                    value={parseInt(labelsDeskPaddingBottom)}
                                                    onChange={(value) => setAttributes({ labelsDeskPaddingBottom: value.toString() })}
                                                    min={0}
                                                    max={100}
                                                />
                                                <RangeControl
                                                    label={__('Left Padding', 'jankx')}
                                                    value={parseInt(labelsDeskPaddingLeft)}
                                                    onChange={(value) => setAttributes({ labelsDeskPaddingLeft: value.toString() })}
                                                    min={0}
                                                    max={100}
                                                />
                                            </Fragment>
                                        )}
                                    </PanelBody>

                                    <PanelBody title={__('Content Style', 'jankx')} initialOpen={false}>
                                        <div className="components-base-control">
                                            <label className="components-base-control__label">
                                                {__('Content Background', 'jankx')}
                                            </label>
                                            <ColorPicker
                                                color={tabsContentBg}
                                                onChangeComplete={(color) => setAttributes({ tabsContentBg: color.hex })}
                                            />
                                        </div>

                                        <div className="components-base-control">
                                            <label className="components-base-control__label">
                                                {__('Content Color', 'jankx')}
                                            </label>
                                            <ColorPicker
                                                color={tabsContentColor}
                                                onChangeComplete={(color) => setAttributes({ tabsContentColor: color.hex })}
                                            />
                                        </div>

                                        <CardDivider />

                                        <h4>{__('Desktop Padding', 'jankx')}</h4>
                                        <ToggleControl
                                            label={__('Linked Padding', 'jankx')}
                                            checked={enableLinkedContentDeskPadding}
                                            onChange={(value) => setAttributes({ enableLinkedContentDeskPadding: value })}
                                        />

                                        {enableLinkedContentDeskPadding ? (
                                            <RangeControl
                                                label={__('Padding', 'jankx')}
                                                value={parseInt(tabsContentLinkedDeskPadding)}
                                                onChange={(value) => setAttributes({ tabsContentLinkedDeskPadding: value.toString() })}
                                                min={0}
                                                max={100}
                                            />
                                        ) : (
                                            <Fragment>
                                                <RangeControl
                                                    label={__('Top Padding', 'jankx')}
                                                    value={parseInt(tabsContentDeskPaddingTop)}
                                                    onChange={(value) => setAttributes({ tabsContentDeskPaddingTop: value.toString() })}
                                                    min={0}
                                                    max={100}
                                                />
                                                <RangeControl
                                                    label={__('Right Padding', 'jankx')}
                                                    value={parseInt(tabsContentDeskPaddingRight)}
                                                    onChange={(value) => setAttributes({ tabsContentDeskPaddingRight: value.toString() })}
                                                    min={0}
                                                    max={100}
                                                />
                                                <RangeControl
                                                    label={__('Bottom Padding', 'jankx')}
                                                    value={parseInt(tabsContentDeskPaddingBottom)}
                                                    onChange={(value) => setAttributes({ tabsContentDeskPaddingBottom: value.toString() })}
                                                    min={0}
                                                    max={100}
                                                />
                                                <RangeControl
                                                    label={__('Left Padding', 'jankx')}
                                                    value={parseInt(tabsContentDeskPaddingLeft)}
                                                    onChange={(value) => setAttributes({ tabsContentDeskPaddingLeft: value.toString() })}
                                                    min={0}
                                                    max={100}
                                                />
                                            </Fragment>
                                        )}
                                    </PanelBody>
                                </Fragment>
                            )}

                            {tab.name === 'advanced' && (
                                <Fragment>
                                    <PanelBody title={__('Advanced Settings', 'jankx')} initialOpen={true}>
                                        <TextControl
                                            label={__('Anchor ID', 'jankx')}
                                            value={anchorId || ''}
                                            onChange={(value) => setAttributes({ anchorId: value })}
                                            help={__('Add an anchor ID for deep linking', 'jankx')}
                                        />

                                        <TextControl
                                            label={__('Custom CSS Class', 'jankx')}
                                            value={customClass || ''}
                                            onChange={(value) => setAttributes({ customClass: value })}
                                            help={__('Add custom CSS classes', 'jankx')}
                                        />

                                        <RangeControl
                                            label={__('Z-Index', 'jankx')}
                                            value={zIndex || 1}
                                            onChange={(value) => setAttributes({ zIndex: value })}
                                            min={0}
                                            max={9999}
                                            help={__('Control the stacking order', 'jankx')}
                                        />
                                    </PanelBody>
                                </Fragment>
                            )}
                        </div>
                    )}
                </TabPanel>
            </InspectorControls>

            <div {...blockProps} style={containerStyles}>
                <div className={`jankx-tabs-container layout-${tabLayout} position-${labelsPosition}`}>
                    {/* Tab Labels */}
                    <div className="jankx-tabs-labels" style={labelsStyles}>
                        {tabLabelsArray.map((label: string, index: number) => (
                            <button
                                key={index}
                                className={`jankx-tab-label ${index === activeTab ? 'active' : ''}`}
                                onClick={() => handleTabClick(index)}
                                style={{
                                    backgroundColor: index === activeTab && useCustomColors ? activeTabBg : undefined,
                                    color: index === activeTab && useCustomColors ? activeTabColor : undefined,
                                }}
                            >
                                {label || `Tab ${index + 1}`}
                            </button>
                        ))}
                        <Button
                            className="jankx-add-tab-button"
                            onClick={addNewTab}
                            variant="secondary"
                            size="small"
                        >
                            {__('+ Add Tab', 'jankx')}
                        </Button>
                    </div>

                    {/* Tab Content */}
                    <div className="jankx-tabs-content" style={contentStyles}>
                        <InnerBlocks
                            allowedBlocks={ALLOWED_BLOCKS}
                            template={[['jankx/tab']]}
                            templateLock={false}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

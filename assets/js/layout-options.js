/**
 * Jankx Layout Options Component
 *
 * React component for managing layout options in Gutenberg editor.
 */

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    ColorPicker,
    Button,
    Notice,
    Spinner,
    BaseControl,
    TextControl
} = wp.components;
const { MediaUpload } = wp.media;
const { InspectorControls } = wp.blockEditor;

/**
 * Layout Options Component
 */
class LayoutOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {},
            loading: false,
            error: null
        };
    }

    componentDidMount() {
        this.loadOptions();
    }

    /**
     * Load options for current layout
     */
    loadOptions() {
        const { attributes } = this.props;
        const layoutName = this.getLayoutName();

        if (!layoutName) {
            return;
        }

        this.setState({ loading: true });

        // Get options from PHP via localized data
        const options = window.jankxLayoutOptions?.layouts?.[layoutName] || {};

        this.setState({
            options,
            loading: false
        });
    }

    /**
     * Get current layout name from block name
     */
    getLayoutName() {
        const { name } = this.props;
        const match = name.match(/jankx\/layout-(.+)/);
        return match ? match[1] : null;
    }

    /**
     * Update option value
     */
    updateOption(optionName, value) {
        const { setAttributes, attributes } = this.props;
        const newAttributes = { ...attributes };
        newAttributes[optionName] = value;
        setAttributes(newAttributes);
    }

    /**
     * Render option control based on type
     */
    renderOptionControl(optionName, option) {
        const { attributes } = this.props;
        const value = attributes[optionName] !== undefined ? attributes[optionName] : option.default;

        switch (option.type) {
            case 'select':
                return (
                    <SelectControl
                        label={option.label}
                        help={option.description}
                        value={value}
                        options={Object.entries(option.options).map(([key, label]) => ({
                            value: key,
                            label: label
                        }))}
                        onChange={(newValue) => this.updateOption(optionName, newValue)}
                    />
                );

            case 'range':
                return (
                    <RangeControl
                        label={option.label}
                        help={option.description}
                        value={value}
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        onChange={(newValue) => this.updateOption(optionName, newValue)}
                    />
                );

            case 'toggle':
                return (
                    <ToggleControl
                        label={option.label}
                        help={option.description}
                        checked={value}
                        onChange={(newValue) => this.updateOption(optionName, newValue)}
                    />
                );

            case 'color':
                return (
                    <BaseControl
                        label={option.label}
                        help={option.description}
                    >
                        <ColorPicker
                            color={value}
                            onChangeComplete={(color) => this.updateOption(optionName, color.hex)}
                        />
                    </BaseControl>
                );

            case 'image':
                return (
                    <BaseControl
                        label={option.label}
                        help={option.description}
                    >
                        <MediaUpload
                            onSelect={(media) => this.updateOption(optionName, media.url)}
                            allowedTypes={['image']}
                            value={value}
                            render={({ open }) => (
                                <div>
                                    {value && (
                                        <img
                                            src={value}
                                            alt=""
                                            style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                                        />
                                    )}
                                    <Button
                                        isPrimary={!value}
                                        isSecondary={!!value}
                                        onClick={open}
                                    >
                                        {value ? __('Change Image', 'jankx') : __('Select Image', 'jankx')}
                                    </Button>
                                    {value && (
                                        <Button
                                            isDestructive
                                            onClick={() => this.updateOption(optionName, '')}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            {__('Remove', 'jankx')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </BaseControl>
                );

            default:
                return (
                    <TextControl
                        label={option.label}
                        help={option.description}
                        value={value}
                        onChange={(newValue) => this.updateOption(optionName, newValue)}
                    />
                );
        }
    }

    /**
     * Render option group
     */
    renderOptionGroup(groupName, groupOptions) {
        const { attributes } = this.props;
        const layoutName = this.getLayoutName();

        // Filter options for this layout
        const filteredOptions = Object.entries(groupOptions).filter(([optionName, option]) => {
            return !option.supports || option.supports.includes(layoutName);
        });

        if (filteredOptions.length === 0) {
            return null;
        }

        return (
            <PanelBody
                key={groupName}
                title={groupName}
                initialOpen={groupName === 'layout'}
            >
                {filteredOptions.map(([optionName, option]) => (
                    <div key={optionName}>
                        {this.renderOptionControl(optionName, option)}
                        {option.note && (
                            <Notice status="info" isDismissible={false}>
                                {option.note}
                            </Notice>
                        )}
                    </div>
                ))}
            </PanelBody>
        );
    }

    /**
     * Render performance notice
     */
    renderPerformanceNotice() {
        const { attributes } = this.props;
        const isFirstLayout = this.isFirstLayout();
        const partialHydration = attributes.partialHydration;

        if (isFirstLayout && partialHydration) {
            return (
                <Notice status="warning" isDismissible={false}>
                    {__('First layout is always server-rendered for better performance.', 'jankx')}
                </Notice>
            );
        }

        return null;
    }

    /**
     * Check if this is the first layout
     */
    isFirstLayout() {
        // This would need to be determined by PHP and passed via attributes
        return this.props.attributes.isFirstLayout || false;
    }

    render() {
        const { loading, error, options } = this.state;
        const layoutName = this.getLayoutName();

        if (!layoutName) {
            return null;
        }

        if (loading) {
            return (
                <InspectorControls>
                    <PanelBody>
                        <Spinner />
                        {__('Loading options...', 'jankx')}
                    </PanelBody>
                </InspectorControls>
            );
        }

        if (error) {
            return (
                <InspectorControls>
                    <PanelBody>
                        <Notice status="error" isDismissible={false}>
                            {error}
                        </Notice>
                    </PanelBody>
                </InspectorControls>
            );
        }

        // Group options by their group
        const groupedOptions = {};
        Object.entries(options).forEach(([optionName, option]) => {
            const group = option.group || 'layout';
            if (!groupedOptions[group]) {
                groupedOptions[group] = {};
            }
            groupedOptions[group][optionName] = option;
        });

        return (
            <InspectorControls>
                {this.renderPerformanceNotice()}

                {Object.entries(groupedOptions).map(([groupName, groupOptions]) =>
                    this.renderOptionGroup(groupName, groupOptions)
                )}
            </InspectorControls>
        );
    }
}

/**
 * Higher-order component to add layout options to blocks
 */
const withLayoutOptions = (BlockEdit) => {
    return (props) => {
        // Only add options to Jankx layout blocks
        if (props.name.startsWith('jankx/layout-')) {
            return (
                <>
                    <BlockEdit {...props} />
                    <LayoutOptions {...props} />
                </>
            );
        }

        return <BlockEdit {...props} />;
    };
};

// Add layout options to all blocks
wp.hooks.addFilter(
    'editor.BlockEdit',
    'jankx/layout-options',
    withLayoutOptions
);

// Add partial hydration options to all blocks
const addPartialHydrationOptions = (BlockEdit) => {
    return (props) => {
        const { attributes, setAttributes, name } = props;

        // Skip Jankx layout blocks (they have their own options)
        if (name.startsWith('jankx/layout-')) {
            return <BlockEdit {...props} />;
        }

        const partialHydration = attributes.partialHydration || false;
        const isFirstBlock = attributes.isFirstBlock || false;

        return (
            <>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody
                        title={__('Jankx Performance', 'jankx')}
                        initialOpen={false}
                    >
                        <ToggleControl
                            label={__('Partial Hydration', 'jankx')}
                            help={__('Load this block via AJAX when visible', 'jankx')}
                            checked={partialHydration}
                            onChange={(value) => setAttributes({ partialHydration: value })}
                            disabled={isFirstBlock}
                        />
                        {isFirstBlock && (
                            <Notice status="info" isDismissible={false}>
                                {__('First block is always server-rendered', 'jankx')}
                            </Notice>
                        )}
                    </PanelBody>
                </InspectorControls>
            </>
        );
    };
};

wp.hooks.addFilter(
    'editor.BlockEdit',
    'jankx/partial-hydration-options',
    addPartialHydrationOptions
);

// Export for use in other files
window.JankxLayoutOptions = {
    LayoutOptions,
    withLayoutOptions,
    addPartialHydrationOptions
};
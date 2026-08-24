"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Edit;
var i18n_1 = require("@wordpress/i18n");
var block_editor_1 = require("@wordpress/block-editor");
var components_1 = require("@wordpress/components");
var icons_1 = require("@wordpress/icons");
var blocks_1 = require("@wordpress/blocks");
var data_1 = require("@wordpress/data");
// Utility function to convert hex to RGB
var hexToRgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};
// Render nav icon based on type
var renderNavIcon = function (type, imageUrl, svgCode, iconClass, size, color, direction) {
    var iconStyle = {
        width: "".concat(size, "px"),
        height: "".concat(size, "px"),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color || undefined
    };
    if (type === 'image' && imageUrl) {
        return (<img src={imageUrl} alt={direction === 'prev' ? 'Previous' : 'Next'} style={{ width: "".concat(size, "px"), height: "".concat(size, "px"), objectFit: 'contain' }}/>);
    }
    if (type === 'svg' && svgCode) {
        return (<span style={iconStyle} dangerouslySetInnerHTML={{ __html: svgCode }}/>);
    }
    if (type === 'fonticon' && iconClass) {
        return (<span className={iconClass} style={{ fontSize: "".concat(size, "px"), lineHeight: 1, color: color || undefined }} aria-hidden="true"/>);
    }
    // Default: arrow (rendered by CSS ::after, no element needed)
    return null;
};
function Edit(_a) {
    var attributes = _a.attributes, setAttributes = _a.setAttributes, clientId = _a.clientId;
    var slidesPerView = attributes.slidesPerView, slidesPerViewTablet = attributes.slidesPerViewTablet, slidesPerViewMobile = attributes.slidesPerViewMobile, spaceBetween = attributes.spaceBetween, loop = attributes.loop, autoplay = attributes.autoplay, autoplayDelay = attributes.autoplayDelay, speed = attributes.speed, navigation = attributes.navigation, pagination = attributes.pagination, effect = attributes.effect, height = attributes.height, minHeight = attributes.minHeight, contentMode = attributes.contentMode, galleryImages = attributes.galleryImages, bannerStyle = attributes.bannerStyle, bannerTextColor = attributes.bannerTextColor, bannerBackgroundColor = attributes.bannerBackgroundColor, bannerPadding = attributes.bannerPadding, bannerBorderRadius = attributes.bannerBorderRadius, gradientOverlay = attributes.gradientOverlay, gradientColor = attributes.gradientColor, gradientOpacity = attributes.gradientOpacity, gradientHeight = attributes.gradientHeight, className = attributes.className, _b = attributes.fitViewportMinusHeader, fitViewportMinusHeader = _b === void 0 ? false : _b, _c = attributes.fullHeight, fullHeight = _c === void 0 ? false : _c, 
    // Navigation icon settings
    _d = attributes.navIconType, 
    // Navigation icon settings
    navIconType = _d === void 0 ? 'arrow' : _d, _e = attributes.prevIconImageId, prevIconImageId = _e === void 0 ? 0 : _e, _f = attributes.prevIconImageUrl, prevIconImageUrl = _f === void 0 ? '' : _f, _g = attributes.nextIconImageId, nextIconImageId = _g === void 0 ? 0 : _g, _h = attributes.nextIconImageUrl, nextIconImageUrl = _h === void 0 ? '' : _h, _j = attributes.prevIconSvg, prevIconSvg = _j === void 0 ? '' : _j, _k = attributes.nextIconSvg, nextIconSvg = _k === void 0 ? '' : _k, _l = attributes.prevIconClass, prevIconClass = _l === void 0 ? '' : _l, _m = attributes.nextIconClass, nextIconClass = _m === void 0 ? '' : _m, _o = attributes.navIconSize, navIconSize = _o === void 0 ? 24 : _o, _p = attributes.navIconColor, navIconColor = _p === void 0 ? '' : _p, 
    // Navigation button settings
    _q = attributes.navBtnWidth, 
    // Navigation button settings
    navBtnWidth = _q === void 0 ? 44 : _q, _r = attributes.navBtnHeight, navBtnHeight = _r === void 0 ? 44 : _r, _s = attributes.navBtnBorderRadius, navBtnBorderRadius = _s === void 0 ? 50 : _s, _t = attributes.navBtnBgColor, navBtnBgColor = _t === void 0 ? 'rgba(0,0,0,0.7)' : _t;
    // Get block's style variation
    var styleVariation = (0, data_1.useSelect)(function (select) {
        var block = select('core/block-editor').getBlock(clientId);
        if (!block)
            return 'default';
        // Extract style variation from className
        var match = className === null || className === void 0 ? void 0 : className.match(/is-style-(\w+)/);
        return match ? match[1] : 'default';
    }, [clientId, className]);
    // Function to update style variation
    var updateStyleVariation = function (variation) {
        // Remove existing variation classes
        var currentClassName = className || '';
        var cleanedClassName = currentClassName
            .replace(/\bis-style-\w+\b/g, '')
            .trim();
        // Add new variation class
        var newVariationClass = variation === 'default' ? '' : "is-style-".concat(variation);
        var newClassName = [cleanedClassName, newVariationClass].filter(Boolean).join(' ');
        setAttributes({ className: newClassName });
    };
    var gradientRgb = hexToRgb(gradientColor || '#000000');
    var blockProps = (0, block_editor_1.useBlockProps)({
        className: "carousel-block banner-style-".concat(bannerStyle, " ").concat(gradientOverlay ? 'has-gradient-overlay' : '', " ").concat(className || '', " ").concat(fitViewportMinusHeader ? 'fit-vh-minus-header' : '', " ").concat(fullHeight ? 'is-full-height' : '').trim(),
        style: {
            '--carousel-height': fullHeight ? '100vh' : "".concat(height, "px"),
            '--carousel-min-height': "".concat(minHeight, "px"),
            '--banner-style': bannerStyle,
            '--banner-text-color': bannerTextColor,
            '--banner-background-color': bannerBackgroundColor,
            '--banner-padding': "".concat(bannerPadding, "px"),
            '--banner-border-radius': "".concat(bannerBorderRadius, "px"),
            '--gradient-overlay-enabled': gradientOverlay ? '1' : '0',
            '--gradient-color-r': gradientRgb.r,
            '--gradient-color-g': gradientRgb.g,
            '--gradient-color-b': gradientRgb.b,
            '--gradient-opacity': gradientOpacity,
            '--gradient-height': "".concat(gradientHeight, "%"),
            '--slides-per-view-desktop': slidesPerView,
            '--slides-per-view-tablet': slidesPerViewTablet,
            '--slides-per-view-mobile': slidesPerViewMobile,
            '--space-between': "".concat(spaceBetween, "px")
        }
    });
    var innerBlocksProps = (0, block_editor_1.useInnerBlocksProps)({ className: 'carousel-wrapper' }, {
        allowedBlocks: contentMode === 'slides'
            ? ['jankx/carousel-slide', 'jankx/carousel-inner-blocks-overlay']
            : ['jankx/carousel-banner', 'jankx/carousel-inner-blocks-overlay'],
        templateLock: false,
        orientation: 'horizontal',
        renderAppender: block_editor_1.InnerBlocks.ButtonBlockAppender
    });
    var _u = (0, data_1.useSelect)(function (select) {
        var getBlock = select('core/block-editor').getBlock;
        var block = getBlock(clientId);
        if (!block)
            return { hasInnerBlocks: false, slideCount: 0, hasOverlay: false };
        var count = block.innerBlocks.filter(function (b) { return b.name !== 'jankx/carousel-inner-blocks-overlay'; }).length;
        var overlay = block.innerBlocks.some(function (b) { return b.name === 'jankx/carousel-inner-blocks-overlay'; });
        return {
            hasInnerBlocks: !!block.innerBlocks.length,
            slideCount: count,
            hasOverlay: overlay
        };
    }, [clientId]), hasInnerBlocks = _u.hasInnerBlocks, slideCount = _u.slideCount, hasOverlay = _u.hasOverlay;
    // Handle gallery image selection
    var onSelectGalleryImages = function (images) {
        var galleryData = images.map(function (img) { return ({
            id: img.id,
            url: img.url,
            alt: img.alt || '',
            caption: img.caption || ''
        }); });
        setAttributes({ galleryImages: galleryData });
        // Create carousel-banner blocks for each image
        var bannerBlocks = images.map(function (img) {
            return (0, blocks_1.createBlock)('jankx/carousel-banner', {
                imageId: img.id,
                imageUrl: img.url,
                imageAlt: img.alt || '',
                imageCaption: img.caption || ''
            });
        });
        // Replace inner blocks with banner blocks
        wp.data.dispatch('core/block-editor').replaceInnerBlocks(clientId, bannerBlocks);
    };
    return (<>
      <block_editor_1.BlockControls>
        <components_1.ToolbarGroup>
          <components_1.ToolbarButton icon={icons_1.gallery} title={(0, i18n_1.__)('Default', 'jankx')} onClick={function () { return updateStyleVariation('default'); }} isActive={styleVariation === 'default'}/>
          <components_1.ToolbarButton icon={icons_1.cover} title={(0, i18n_1.__)('Banner', 'jankx')} onClick={function () { return updateStyleVariation('banner'); }} isActive={styleVariation === 'banner'}/>
          <components_1.ToolbarButton icon={icons_1.layout} title={(0, i18n_1.__)('Carousel', 'jankx')} onClick={function () { return updateStyleVariation('carousel'); }} isActive={styleVariation === 'carousel'}/>
          <components_1.ToolbarButton icon={icons_1.quote} title={(0, i18n_1.__)('Testimonial', 'jankx')} onClick={function () { return updateStyleVariation('testimonial'); }} isActive={styleVariation === 'testimonial'}/>
        </components_1.ToolbarGroup>
      </block_editor_1.BlockControls>

      <div {...blockProps}>
        <block_editor_1.InspectorControls>
          <components_1.TabPanel className="carousel-tabs" activeClass="is-active" onSelect={function (tabName) {
            if (tabName === 'gallery') {
                setAttributes({ contentMode: 'gallery' });
            }
            else {
                setAttributes({ contentMode: 'slides' });
            }
        }} tabs={[
            {
                name: 'slides',
                title: (0, i18n_1.__)('Slides', 'jankx'),
                className: 'tab-slides'
            },
            {
                name: 'gallery',
                title: (0, i18n_1.__)('Gallery', 'jankx'),
                className: 'tab-gallery'
            }
        ]}>
            {function (tab) { return (<>
                {tab.name === 'slides' && (<components_1.PanelBody title={(0, i18n_1.__)('Add Slides', 'jankx')} initialOpen={true}>
                    <p>{(0, i18n_1.__)('Use the + button to add individual slides', 'jankx')}</p>
                  </components_1.PanelBody>)}

                {tab.name === 'gallery' && (<components_1.PanelBody title={(0, i18n_1.__)('Select Images', 'jankx')} initialOpen={true}>
                    <block_editor_1.MediaUploadCheck>
                      <block_editor_1.MediaUpload onSelect={onSelectGalleryImages} allowedTypes={['image']} multiple={true} value={galleryImages.map(function (img) { return img.id; })} render={function (_a) {
                    var open = _a.open;
                    return (<components_1.Button variant="primary" onClick={open} style={{ width: '100%', marginBottom: '10px' }}>
                            {galleryImages.length > 0
                            ? (0, i18n_1.__)('Change Images', 'jankx')
                            : (0, i18n_1.__)('Select Images', 'jankx')}
                          </components_1.Button>);
                }}/>
                    </block_editor_1.MediaUploadCheck>

                    {galleryImages.length > 0 && (<p>
                        {(0, i18n_1.__)('Selected', 'jankx')}: {galleryImages.length} {(0, i18n_1.__)('images', 'jankx')}
                      </p>)}
                  </components_1.PanelBody>)}
              </>); }}
          </components_1.TabPanel>

          <components_1.PanelBody title={(0, i18n_1.__)('Slider Settings', 'jankx')} initialOpen={true}>
            {(styleVariation === 'carousel' || styleVariation === 'testimonial') ? (<>
                <components_1.RangeControl label={(0, i18n_1.__)('Slides Per View (Desktop)', 'jankx')} value={slidesPerView} onChange={function (val) { return setAttributes({ slidesPerView: val }); }} min={1} max={6} step={1} help={(0, i18n_1.__)('Number of slides visible on desktop screens (≥1024px)', 'jankx')}/>

                <components_1.RangeControl label={(0, i18n_1.__)('Slides Per View (Tablet)', 'jankx')} value={slidesPerViewTablet} onChange={function (val) { return setAttributes({ slidesPerViewTablet: val }); }} min={1} max={4} step={1} help={(0, i18n_1.__)('Number of slides visible on tablet screens (768px - 1023px)', 'jankx')}/>

                <components_1.RangeControl label={(0, i18n_1.__)('Slides Per View (Mobile)', 'jankx')} value={slidesPerViewMobile} onChange={function (val) { return setAttributes({ slidesPerViewMobile: val }); }} min={1} max={2} step={1} help={(0, i18n_1.__)('Number of slides visible on mobile screens (<768px)', 'jankx')}/>
              </>) : (<components_1.RangeControl label={(0, i18n_1.__)('Slides Per View', 'jankx')} value={slidesPerView} onChange={function (val) { return setAttributes({ slidesPerView: val }); }} min={1} max={4} step={1}/>)}

            <components_1.RangeControl label={(0, i18n_1.__)('Space Between (px)', 'jankx')} value={spaceBetween} onChange={function (val) { return setAttributes({ spaceBetween: val }); }} min={0} max={100} step={10}/>

            <components_1.RangeControl label={(0, i18n_1.__)('Speed (ms)', 'jankx')} value={speed} onChange={function (val) { return setAttributes({ speed: val }); }} min={100} max={2000} step={100}/>

            <components_1.RangeControl label={(0, i18n_1.__)('Height (px)', 'jankx')} value={height} onChange={function (val) { return setAttributes({ height: val || 400 }); }} min={50} max={1000} step={50} help={(0, i18n_1.__)('Height for desktop (max-height on mobile)', 'jankx')}/>

            <components_1.RangeControl label={(0, i18n_1.__)('Min Height (px)', 'jankx')} value={minHeight} onChange={function (val) { return setAttributes({ minHeight: val || 50 }); }} min={50} max={600} step={50} help={(0, i18n_1.__)('Minimum height on mobile devices', 'jankx')}/>
            <components_1.ToggleControl label={(0, i18n_1.__)('Fit Viewport (Minus Header)', 'jankx')} checked={!!fitViewportMinusHeader} onChange={function (val) { return setAttributes({ fitViewportMinusHeader: val }); }} help={(0, i18n_1.__)('Khi bật, Carousel sẽ lấp đầy phần còn lại của viewport sau header.', 'jankx')}/>

            <components_1.ToggleControl label={(0, i18n_1.__)('Full Viewport Height (100vh)', 'jankx')} checked={!!fullHeight} onChange={function (val) { return setAttributes({ fullHeight: val }); }} help={(0, i18n_1.__)('Bật để Carousel cao bằng toàn bộ màn hình (thường dùng cho Hero).', 'jankx')}/>

            <components_1.ToggleControl label={(0, i18n_1.__)('Loop', 'jankx')} checked={loop} onChange={function (val) { return setAttributes({ loop: val }); }}/>

            <components_1.ToggleControl label={(0, i18n_1.__)('Navigation', 'jankx')} checked={navigation} onChange={function (val) { return setAttributes({ navigation: val }); }}/>

            <components_1.ToggleControl label={(0, i18n_1.__)('Pagination', 'jankx')} checked={pagination} onChange={function (val) { return setAttributes({ pagination: val }); }}/>

            <components_1.ToggleControl label={(0, i18n_1.__)('Autoplay', 'jankx')} checked={autoplay} onChange={function (val) { return setAttributes({ autoplay: val }); }}/>

            {autoplay && (<components_1.RangeControl label={(0, i18n_1.__)('Autoplay Delay (ms)', 'jankx')} value={autoplayDelay} onChange={function (val) { return setAttributes({ autoplayDelay: val }); }} min={1000} max={10000} step={500}/>)}
          </components_1.PanelBody>

          <components_1.PanelBody title={(0, i18n_1.__)('Banner Style Settings', 'jankx')} initialOpen={false}>
            <components_1.SelectControl label={(0, i18n_1.__)('Banner Style', 'jankx')} value={bannerStyle} options={[
            { label: (0, i18n_1.__)('Default', 'jankx'), value: 'default' },
            { label: (0, i18n_1.__)('Circles', 'jankx'), value: 'circles' },
            { label: (0, i18n_1.__)('Square', 'jankx'), value: 'square' },
            { label: (0, i18n_1.__)('Banner', 'jankx'), value: 'banner' }
        ]} onChange={function (val) { return setAttributes({ bannerStyle: val }); }}/>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                {(0, i18n_1.__)('Text Color', 'jankx')}
              </label>
              <components_1.ColorPicker color={bannerTextColor || '#ffffff'} onChange={function (color) { return setAttributes({ bannerTextColor: color }); }} enableAlpha={false}/>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                {(0, i18n_1.__)('Background Color', 'jankx')}
              </label>
              <components_1.ColorPicker color={bannerBackgroundColor || '#000000'} onChange={function (color) { return setAttributes({ bannerBackgroundColor: color }); }} enableAlpha={false}/>
            </div>

            <components_1.RangeControl label={(0, i18n_1.__)('Padding (px)', 'jankx')} value={bannerPadding} onChange={function (val) { return setAttributes({ bannerPadding: val }); }} min={0} max={50} step={5}/>

            <components_1.RangeControl label={(0, i18n_1.__)('Border Radius (px)', 'jankx')} value={bannerBorderRadius} onChange={function (val) { return setAttributes({ bannerBorderRadius: val }); }} min={0} max={20} step={1}/>
          </components_1.PanelBody>

          <components_1.PanelBody title={(0, i18n_1.__)('Gradient Overlay', 'jankx')} initialOpen={false}>
            <components_1.ToggleControl label={(0, i18n_1.__)('Enable Gradient Overlay', 'jankx')} checked={!!gradientOverlay} onChange={function (val) { return setAttributes({ gradientOverlay: val }); }} help={(0, i18n_1.__)('Add a gradient overlay from bottom to top with decreasing transparency', 'jankx')}/>

            {gradientOverlay && (<>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    {(0, i18n_1.__)('Gradient Color', 'jankx')}
                  </label>
                  <components_1.ColorPicker color={gradientColor || '#000000'} onChange={function (color) { return setAttributes({ gradientColor: color }); }} enableAlpha={false}/>
                </div>

                <components_1.RangeControl label={(0, i18n_1.__)('Gradient Opacity', 'jankx')} value={gradientOpacity} onChange={function (val) { return setAttributes({ gradientOpacity: val }); }} min={0} max={1} step={0.1} help={(0, i18n_1.__)('Transparency of the gradient (0 = fully transparent, 1 = fully opaque)', 'jankx')}/>

                <components_1.RangeControl label={(0, i18n_1.__)('Gradient Height (%)', 'jankx')} value={gradientHeight} onChange={function (val) { return setAttributes({ gradientHeight: val }); }} min={10} max={100} step={5} help={(0, i18n_1.__)('Height of the gradient overlay as percentage of slide height', 'jankx')}/>
              </>)}
          </components_1.PanelBody>

          <components_1.PanelBody title={(0, i18n_1.__)('Navigation Settings', 'jankx')} initialOpen={false}>
            <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e0e0e0' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>{(0, i18n_1.__)('Button Container Style', 'jankx')}</h4>

              <components_1.RangeControl label={(0, i18n_1.__)('Button Width (px)', 'jankx')} value={navBtnWidth} onChange={function (val) { return setAttributes({ navBtnWidth: val || 44 }); }} min={20} max={100} step={2}/>
              <components_1.RangeControl label={(0, i18n_1.__)('Button Height (px)', 'jankx')} value={navBtnHeight} onChange={function (val) { return setAttributes({ navBtnHeight: val || 44 }); }} min={20} max={100} step={2}/>
              <components_1.RangeControl label={(0, i18n_1.__)('Border Radius (%)', 'jankx')} value={navBtnBorderRadius} onChange={function (val) { return setAttributes({ navBtnBorderRadius: typeof val !== 'undefined' ? val : 50 }); }} min={0} max={50} step={1} help={(0, i18n_1.__)('0 for square, 50 for circle', 'jankx')}/>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  {(0, i18n_1.__)('Button Background Color', 'jankx')}
                </label>
                <components_1.ColorPicker color={navBtnBgColor || 'rgba(0,0,0,0.7)'} onChange={function (color) { return setAttributes({ navBtnBgColor: color }); }} enableAlpha={true}/>
              </div>
            </div>

            <h4 style={{ margin: '0 0 12px 0' }}>{(0, i18n_1.__)('Icon Display', 'jankx')}</h4>
            <components_1.SelectControl label={(0, i18n_1.__)('Icon Type', 'jankx')} value={navIconType} options={[
            { label: (0, i18n_1.__)('Arrow (CSS default)', 'jankx'), value: 'arrow' },
            { label: (0, i18n_1.__)('Image (PNG/JPG/SVG file)', 'jankx'), value: 'image' },
            { label: (0, i18n_1.__)('SVG Code', 'jankx'), value: 'svg' },
            { label: (0, i18n_1.__)('Font Icon (class)', 'jankx'), value: 'fonticon' }
        ]} onChange={function (val) { return setAttributes({ navIconType: val }); }} help={(0, i18n_1.__)('Choose how to display the prev/next navigation icons', 'jankx')}/>

            <components_1.RangeControl label={(0, i18n_1.__)('Icon Size (px)', 'jankx')} value={navIconSize} onChange={function (val) { return setAttributes({ navIconSize: val || 24 }); }} min={12} max={80} step={2}/>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                {(0, i18n_1.__)('Icon Color', 'jankx')}
              </label>
              <components_1.ColorPicker color={navIconColor || '#ffffff'} onChange={function (color) { return setAttributes({ navIconColor: color }); }} enableAlpha={true}/>
            </div>

            {navIconType === 'image' && (<>
                <components_1.BaseControl label={(0, i18n_1.__)('Previous Button Icon', 'jankx')} id="carousel-prev-icon">
                  <block_editor_1.MediaUploadCheck>
                    <block_editor_1.MediaUpload onSelect={function (media) { return setAttributes({ prevIconImageId: media.id, prevIconImageUrl: media.url }); }} allowedTypes={['image']} value={prevIconImageId} render={function (_a) {
                var open = _a.open;
                return (<div>
                          {prevIconImageUrl && (<img src={prevIconImageUrl} alt="Prev icon" style={{ width: "".concat(navIconSize, "px"), height: "".concat(navIconSize, "px"), objectFit: 'contain', display: 'block', marginBottom: '8px' }}/>)}
                          <components_1.Button variant={prevIconImageUrl ? 'secondary' : 'primary'} onClick={open} style={{ width: '100%' }}>
                            {prevIconImageUrl ? (0, i18n_1.__)('Change Prev Icon', 'jankx') : (0, i18n_1.__)('Select Prev Icon', 'jankx')}
                          </components_1.Button>
                          {prevIconImageUrl && (<components_1.Button variant="link" isDestructive onClick={function () { return setAttributes({ prevIconImageId: 0, prevIconImageUrl: '' }); }} style={{ display: 'block', marginTop: '4px' }}>
                              {(0, i18n_1.__)('Remove', 'jankx')}
                            </components_1.Button>)}
                        </div>);
            }}/>
                  </block_editor_1.MediaUploadCheck>
                </components_1.BaseControl>

                <components_1.BaseControl label={(0, i18n_1.__)('Next Button Icon', 'jankx')} id="carousel-next-icon">
                  <block_editor_1.MediaUploadCheck>
                    <block_editor_1.MediaUpload onSelect={function (media) { return setAttributes({ nextIconImageId: media.id, nextIconImageUrl: media.url }); }} allowedTypes={['image']} value={nextIconImageId} render={function (_a) {
                var open = _a.open;
                return (<div>
                          {nextIconImageUrl && (<img src={nextIconImageUrl} alt="Next icon" style={{ width: "".concat(navIconSize, "px"), height: "".concat(navIconSize, "px"), objectFit: 'contain', display: 'block', marginBottom: '8px' }}/>)}
                          <components_1.Button variant={nextIconImageUrl ? 'secondary' : 'primary'} onClick={open} style={{ width: '100%' }}>
                            {nextIconImageUrl ? (0, i18n_1.__)('Change Next Icon', 'jankx') : (0, i18n_1.__)('Select Next Icon', 'jankx')}
                          </components_1.Button>
                          {nextIconImageUrl && (<components_1.Button variant="link" isDestructive onClick={function () { return setAttributes({ nextIconImageId: 0, nextIconImageUrl: '' }); }} style={{ display: 'block', marginTop: '4px' }}>
                              {(0, i18n_1.__)('Remove', 'jankx')}
                            </components_1.Button>)}
                        </div>);
            }}/>
                  </block_editor_1.MediaUploadCheck>
                </components_1.BaseControl>
              </>)}

            {navIconType === 'svg' && (<>
                <components_1.TextareaControl label={(0, i18n_1.__)('Previous Button SVG', 'jankx')} value={prevIconSvg} onChange={function (val) { return setAttributes({ prevIconSvg: val }); }} placeholder="<svg viewBox='0 0 24 24'>...</svg>" help={(0, i18n_1.__)('Paste the full SVG code for the previous button icon', 'jankx')} rows={4}/>
                <components_1.TextareaControl label={(0, i18n_1.__)('Next Button SVG', 'jankx')} value={nextIconSvg} onChange={function (val) { return setAttributes({ nextIconSvg: val }); }} placeholder="<svg viewBox='0 0 24 24'>...</svg>" help={(0, i18n_1.__)('Paste the full SVG code for the next button icon', 'jankx')} rows={4}/>
              </>)}

            {navIconType === 'fonticon' && (<>
                <components_1.TextControl label={(0, i18n_1.__)('Previous Button Icon Class', 'jankx')} value={prevIconClass} onChange={function (val) { return setAttributes({ prevIconClass: val }); }} placeholder="fas fa-chevron-left" help={(0, i18n_1.__)('CSS class(es) for the font icon (FontAwesome, Dashicons, etc.)', 'jankx')}/>
                <components_1.TextControl label={(0, i18n_1.__)('Next Button Icon Class', 'jankx')} value={nextIconClass} onChange={function (val) { return setAttributes({ nextIconClass: val }); }} placeholder="fas fa-chevron-right" help={(0, i18n_1.__)('CSS class(es) for the font icon (FontAwesome, Dashicons, etc.)', 'jankx')}/>
              </>)}
          </components_1.PanelBody>
        </block_editor_1.InspectorControls>

        <div className="embla">
          {!hasInnerBlocks && (<div className="carousel-empty-hint">
              {(0, i18n_1.__)('Carousel trống — nhấn nút + để thêm slide hoặc banner.', 'jankx')}
            </div>)}

          <div {...innerBlocksProps} className={"".concat(innerBlocksProps.className, " embla__container")}/>

          {navigation && slideCount > 1 && (<>
              <div className={"embla__button embla__button--prev".concat(navIconType !== 'arrow' ? ' has-custom-icon' : '')} style={{
                width: "".concat(navBtnWidth, "px"),
                height: "".concat(navBtnHeight, "px"),
                borderRadius: "".concat(navBtnBorderRadius, "%"),
                backgroundColor: navBtnBgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)'
            }}>
                {renderNavIcon(navIconType, prevIconImageUrl, prevIconSvg, prevIconClass, navIconSize, navIconColor, 'prev')}
              </div>
              <div className={"embla__button embla__button--next".concat(navIconType !== 'arrow' ? ' has-custom-icon' : '')} style={{
                width: "".concat(navBtnWidth, "px"),
                height: "".concat(navBtnHeight, "px"),
                borderRadius: "".concat(navBtnBorderRadius, "%"),
                backgroundColor: navBtnBgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)'
            }}>
                {renderNavIcon(navIconType, nextIconImageUrl, nextIconSvg, nextIconClass, navIconSize, navIconColor, 'next')}
              </div>
            </>)}

          {pagination && <div className="embla__dots"></div>}
        </div>
      </div>
    </>);
}

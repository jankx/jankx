; (function (wp) {
  if (!wp || !wp.blocks) {
    return;
  }
  var registerBlockType = wp.blocks.registerBlockType;
  var __ = wp.i18n.__;
  var useBlockProps = wp.blockEditor && wp.blockEditor.useBlockProps ? wp.blockEditor.useBlockProps : function () { return {}; };
  var InspectorControls = wp.blockEditor && wp.blockEditor.InspectorControls ? wp.blockEditor.InspectorControls : null;
  var ServerSideRender = wp.serverSideRender || (wp.components && wp.components.ServerSideRender) || null;
  var el = wp.element.createElement;
  var useState = wp.element && wp.element.useState ? wp.element.useState : null;
  var useEffect = wp.element && wp.element.useEffect ? wp.element.useEffect : null;
  var PanelBody = wp.components && wp.components.PanelBody ? wp.components.PanelBody : null;
  var ToggleControl = wp.components && wp.components.ToggleControl ? wp.components.ToggleControl : null;
  var TextControl = wp.components && wp.components.TextControl ? wp.components.TextControl : null;
  var SelectControl = wp.components && wp.components.SelectControl ? wp.components.SelectControl : null;
  var RangeControl = wp.components && wp.components.RangeControl ? wp.components.RangeControl : null;
  var apiFetch = wp.apiFetch;

  function Edit(props) {
    var blockProps = useBlockProps({ className: 'jankx-gallery-detail-editor' });
    var a = props.attributes;
    function setAttr(key) {
      return function (value) { props.setAttributes(((t = {}), t[key] = value, t)); var t; };
    }
    var inspector = InspectorControls ? el(InspectorControls, {},
      el(PanelBody, { title: __('Source', 'jankx'), initialOpen: true },
        el(ToggleControl, {
          label: __('Use current post', 'jankx'),
          checked: !!a.useCurrentPost,
          onChange: setAttr('useCurrentPost')
        }),
        el(ToggleControl, {
          label: __('Show featured image', 'jankx'),
          checked: a.showFeaturedImage !== false, // default true
          onChange: setAttr('showFeaturedImage')
        }),
        el(TextControl, {
          label: __('Image size', 'jankx'),
          value: a.imageSize || 'large',
          onChange: setAttr('imageSize')
        }),
        el(TextControl, {
          label: __('Thumb size', 'jankx'),
          value: a.thumbSize || 'thumbnail',
          onChange: setAttr('thumbSize')
        })
      ),
      el(PanelBody, { title: __('Layout', 'jankx'), initialOpen: true },
        el(RangeControl, {
          label: __('Thumb width (px)', 'jankx'),
          value: a.thumbWidth || 140,
          min: 60, max: 260, step: 10,
          onChange: setAttr('thumbWidth')
        }),
        el(RangeControl, {
          label: __('Main ratio width', 'jankx'),
          value: a.aspectWidth || 16,
          min: 1, max: 64,
          onChange: setAttr('aspectWidth')
        }),
        el(RangeControl, {
          label: __('Main ratio height', 'jankx'),
          value: a.aspectHeight || 9,
          min: 1, max: 64,
          onChange: setAttr('aspectHeight')
        }),
        el(RangeControl, {
          label: __('Thumb ratio width', 'jankx'),
          value: a.thumbAspectWidth || 4,
          min: 1, max: 64,
          onChange: setAttr('thumbAspectWidth')
        }),
        el(RangeControl, {
          label: __('Thumb ratio height', 'jankx'),
          value: a.thumbAspectHeight || 3,
          min: 1, max: 64,
          onChange: setAttr('thumbAspectHeight')
        }),
        el(SelectControl, {
          label: __('Preset', 'jankx'),
          value: a.preset || 'classic',
          options: [
            { label: __('Classic', 'jankx'), value: 'classic' },
            { label: __('Zigzag', 'jankx'), value: 'zigzag' },
            { label: __('Grid', 'jankx'), value: 'grid' },
          ],
          onChange: setAttr('preset')
        }),
        a.preset === 'grid' && el(SelectControl, {
          label: __('Grid Aspect Ratio', 'jankx'),
          value: a.gridAspectRatio || 'landscape',
          options: [
            { label: __('Landscape (16:9)', 'jankx'), value: 'landscape' },
            { label: __('Portrait (3:4)', 'jankx'), value: 'portrait' },
            { label: __('Square (1:1)', 'jankx'), value: 'square' },
          ],
          onChange: setAttr('gridAspectRatio')
        }),
        a.preset === 'grid' && el(RangeControl, {
          label: __('Grid Columns', 'jankx'),
          value: a.gridColumns || 4,
          min: 2, max: 6, step: 1,
          onChange: setAttr('gridColumns')
        })
      ),
      el(PanelBody, { title: __('Controls', 'jankx'), initialOpen: true },
        el(ToggleControl, {
          label: __('Show wishlist', 'jankx'),
          checked: !!a.showWishlist,
          onChange: setAttr('showWishlist')
        }),
        el(ToggleControl, {
          label: __('Show fullscreen', 'jankx'),
          checked: !!a.showFullscreen,
          onChange: setAttr('showFullscreen')
        }),
        el(ToggleControl, {
          label: __('Show navigation', 'jankx'),
          checked: !!a.showNavigation,
          onChange: setAttr('showNavigation')
        }),
        el(ToggleControl, {
          label: __('Autoplay', 'jankx'),
          checked: !!a.autoplay,
          onChange: setAttr('autoplay')
        }),
        el(RangeControl, {
          label: __('Autoplay speed (ms)', 'jankx'),
          value: a.autoplaySpeed || 3000,
          min: 1000, max: 10000, step: 500,
          onChange: setAttr('autoplaySpeed')
        })
      )
    ) : null;
    var preview;
    if (ServerSideRender) {
      preview = el(ServerSideRender, { block: 'jankx/gallery-detail', attributes: props.attributes });
    } else if (apiFetch && useState && useEffect) {
      var state = useState('');
      var html = state[0];
      var setHtml = state[1];
      useEffect(function () {
        var path = '/wp/v2/block-renderer/jankx/gallery-detail?context=edit';
        var body = { attributes: props.attributes };
        apiFetch({ path: path, method: 'POST', data: body }).then(function (res) {
          var out = res && res.rendered ? res.rendered : '';
          setHtml(out || '');
          setTimeout(function () {
            var evt = new CustomEvent('jankx:gallery:refresh', { detail: {} });
            document.dispatchEvent(evt);
          }, 0);
        }).catch(function () {
          setHtml('');
        });
      }, [JSON.stringify(props.attributes)]);
      preview = el('div', Object.assign({}, blockProps, { className: (blockProps.className || '') + ' jankx-gallery-detail-editor' }), el('div', { dangerouslySetInnerHTML: { __html: html } }));
    } else {
      preview = el('div', blockProps, __('Gallery Detail', 'jankx'));
    }
    return el('div', blockProps, inspector, preview);
  }

  registerBlockType('jankx/gallery-detail', {
    title: __('Gallery Detail', 'jankx'),
    category: 'jankx',
    description: __('Gallery with main image and thumbnails', 'jankx'),
    edit: Edit,
    save: function () { return null; }
  });
})(window.wp);


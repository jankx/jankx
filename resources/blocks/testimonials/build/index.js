(function (wp) {
  var registerBlockType = wp.blocks.registerBlockType;
  var el = wp.element.createElement;
  var InspectorControls = (wp.blockEditor || wp.editor).InspectorControls;
  var InnerBlocks = (wp.blockEditor || wp.editor).InnerBlocks;
  var PanelBody = wp.components.PanelBody;
  var RangeControl = wp.components.RangeControl;
  var ToggleControl = wp.components.ToggleControl;
  var SelectControl = wp.components.SelectControl;

  registerBlockType('jankx/testimonials', {
    edit: function (props) {
      var attrs = props.attributes;
      var setAttrs = props.setAttributes;
      function onChange(name) {
        return function (value) {
          var v = value && value.target ? value.target.value : value;
          var o = {}; o[name] = v; setAttrs(o);
        };
      }
      var inspector = el(
        InspectorControls,
        {},
        el(
          PanelBody,
          { title: 'Testimonials Container', initialOpen: true },
          el(SelectControl, {
            label: 'Layout',
            value: attrs.layout || 'default',
            options: [
              { label: 'Default', value: 'default' },
              { label: 'Grid', value: 'grid' },
              { label: 'List', value: 'list' },
              { label: 'Carousel', value: 'carousel' },
              { label: 'Banner', value: 'banner' }
            ],
            onChange: onChange('layout')
          }),
          el(RangeControl, {
            label: 'Slides per view',
            value: attrs.slidesPerView || 1,
            min: 1,
            max: 6,
            onChange: onChange('slidesPerView')
          }),
          el(RangeControl, {
            label: 'Space between',
            value: attrs.spaceBetween || 30,
            min: 0,
            max: 100,
            onChange: onChange('spaceBetween')
          }),
          el(ToggleControl, {
            label: 'Loop',
            checked: !!attrs.loop,
            onChange: function (v) { setAttrs({ loop: v }); }
          }),
          el(ToggleControl, {
            label: 'Autoplay',
            checked: !!attrs.autoplay,
            onChange: function (v) { setAttrs({ autoplay: v }); }
          }),
          el(RangeControl, {
            label: 'Autoplay delay',
            value: attrs.autoplayDelay || 3000,
            min: 1000,
            max: 10000,
            onChange: onChange('autoplayDelay')
          }),
          el(ToggleControl, {
            label: 'Navigation',
            checked: attrs.navigation !== false,
            onChange: function (v) { setAttrs({ navigation: v }); }
          }),
          el(ToggleControl, {
            label: 'Pagination',
            checked: attrs.pagination !== false,
            onChange: function (v) { setAttrs({ pagination: v }); }
          })
        )
      );
      return el(
        'div',
        { className: 'jankx-testimonials-editor' },
        inspector,
        el(InnerBlocks, { allowedBlocks: ['jankx/testimonial'] })
      );
    }
  });
})(window.wp);


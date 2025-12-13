(function (wp) {
  var registerBlockType = wp.blocks.registerBlockType;
  var el = wp.element.createElement;
  var InspectorControls = (wp.blockEditor || wp.editor).InspectorControls;
  var RichText = (wp.blockEditor || wp.editor).RichText;
  var MediaUpload = wp.blockEditor ? wp.blockEditor.MediaUpload : wp.editor.MediaUpload;
  var PanelBody = wp.components.PanelBody;
  var RangeControl = wp.components.RangeControl;
  var TextControl = wp.components.TextControl;
  var Button = wp.components.Button;

  registerBlockType('jankx/testimonial', {
    edit: function (props) {
      var attrs = props.attributes;
      var setAttrs = props.setAttributes;
      function set(name, value) {
        var o = {}; o[name] = value; setAttrs(o);
      }
      var inspector = el(
        InspectorControls,
        {},
        el(
          PanelBody,
          { title: 'Testimonial', initialOpen: true },
          el(TextControl, {
            label: 'Author',
            value: attrs.author || '',
            onChange: function (v) { set('author', v); }
          }),
          el(TextControl, {
            label: 'Role',
            value: attrs.role || '',
            onChange: function (v) { set('role', v); }
          }),
          el(TextControl, {
            label: 'Company',
            value: attrs.company || '',
            onChange: function (v) { set('company', v); }
          }),
          el(TextControl, {
            label: 'Date',
            value: attrs.date || '',
            onChange: function (v) { set('date', v); }
          }),
          el(RangeControl, {
            label: 'Rating',
            value: attrs.rating || 0,
            min: 0,
            max: 5,
            onChange: function (v) { set('rating', v); }
          }),
          el(TextControl, {
            label: 'Link',
            value: attrs.link || '',
            onChange: function (v) { set('link', v); }
          }),
          el(MediaUpload, {
            onSelect: function (media) { set('avatarId', media.id); },
            value: attrs.avatarId || 0,
            render: function (obj) {
              return el(Button, { onClick: obj.open, variant: 'primary' }, 'Chọn avatar');
            }
          })
        )
      );
      return el(
        'div',
        { className: 'jankx-testimonial-editor' },
        inspector,
        el(RichText, {
          tagName: 'div',
          className: 'testimonial-content',
          value: attrs.excerpt || '',
          placeholder: 'Nội dung testimonial...',
          onChange: function (v) { set('excerpt', v); }
        })
      );
    }
  });
})(window.wp);


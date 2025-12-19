;(function (wp) {
  if (!wp || !wp.blocks) {
    return;
  }
  var registerBlockType = wp.blocks.registerBlockType;
  var __ = wp.i18n.__;
  var useBlockProps = wp.blockEditor && wp.blockEditor.useBlockProps ? wp.blockEditor.useBlockProps : function() { return {}; };
  var el = wp.element.createElement;

  function Edit() {
    var props = useBlockProps({ className: 'jankx-gallery-detail-editor' });
    return el('div', props, __('Gallery Detail (SSR)', 'jankx'));
  }

  registerBlockType('jankx/gallery-detail', {
    title: __('Gallery Detail', 'jankx'),
    category: 'jankx',
    description: __('Gallery with main image and thumbnails', 'jankx'),
    edit: Edit,
    save: function () { return null; }
  });
})(window.wp);


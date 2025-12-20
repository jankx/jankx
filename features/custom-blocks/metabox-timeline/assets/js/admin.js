;(function($){
  function renumberItems($container) {
    $container.find('.jankx-timeline-item').each(function(index){
      $(this).attr('data-index', index);
      $(this).find('input[name^="jankx_timeline["], textarea[name^="jankx_timeline["]').each(function(){
        var name = $(this).attr('name');
        var newName = name.replace(/jankx_timeline\[\d+\]/, 'jankx_timeline[' + index + ']');
        $(this).attr('name', newName);
      });
    });
  }

  function createItemTemplate(index, imageEnabled) {
    var html = ''
      + '<div class="jankx-timeline-item" data-index="' + index + '">'
      +   '<div class="field"><label>Time</label><input type="text" name="jankx_timeline[' + index + '][time]" value=""></div>'
      +   '<div class="field"><label>Title</label><input type="text" name="jankx_timeline[' + index + '][title]" value=""></div>'
      +   '<div class="field"><label>Description</label><textarea name="jankx_timeline[' + index + '][description]"></textarea></div>';
    if (imageEnabled) {
      html += '<div class="field image-field"><label>Image</label>'
        + '<div class="image-preview"></div>'
        + '<input type="hidden" class="image-id" name="jankx_timeline[' + index + '][image]" value="">'
        + '<button type="button" class="button select-image">Select Image</button>'
        + '<button type="button" class="button remove-image">Remove</button>'
        + '</div>';
    }
    html +=   '<button type="button" class="button link-delete delete-item">Remove item</button>'
      + '</div>';
    return $(html);
  }

  function initTimelineMetabox($root) {
    if (!$root || !$root.length) return;
    var imageEnabled = $root.data('image-enabled') === 1 || $root.data('image-enabled') === '1';
    var $items = $root.find('.jankx-timeline-items');

    $root.on('click', '.add-item', function(e){
      e.preventDefault();
      var index = $items.find('.jankx-timeline-item').length;
      var $item = createItemTemplate(index, imageEnabled);
      $items.append($item);
    });

    $root.on('click', '.delete-item', function(e){
      e.preventDefault();
      $(this).closest('.jankx-timeline-item').remove();
      renumberItems($items);
    });

    if (imageEnabled && typeof wp !== 'undefined' && wp.media) {
      var frame = null;
      $root.on('click', '.select-image', function(e){
        e.preventDefault();
        var $btn = $(this);
        var $item = $btn.closest('.jankx-timeline-item');
        var $preview = $item.find('.image-preview');
        var $hidden = $item.find('.image-id');
        if (!frame) {
          frame = wp.media({
            title: 'Select Timeline Image',
            multiple: false,
            library: { type: 'image' }
          });
        }
        frame.off('select');
        frame.on('select', function(){
          var attachment = frame.state().get('selection').first().toJSON();
          $hidden.val(attachment.id);
          var url = attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;
          $preview.html('<img src="' + url + '" alt="">');
        });
        frame.open();
      });

      $root.on('click', '.remove-image', function(e){
        e.preventDefault();
        var $item = $(this).closest('.jankx-timeline-item');
        $item.find('.image-id').val('');
        $item.find('.image-preview').empty();
      });
    }
  }

  $(document).ready(function(){
    initTimelineMetabox($('#jankx-timeline-metabox'));
    $(document).on('ajaxComplete', function(){
      initTimelineMetabox($('#jankx-timeline-metabox'));
    });
  });
})(jQuery);


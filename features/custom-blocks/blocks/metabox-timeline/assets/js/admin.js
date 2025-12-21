(function($){
    function buildItem(index, imageEnabled){
        var $item = $('<div class="jankx-timeline-item" data-index="'+index+'"></div>');
        $item.append('<div class="field"><label>Time</label><input type="text" name="jankx_timeline['+index+'][time]"></div>');
        $item.append('<div class="field"><label>Title</label><input type="text" name="jankx_timeline['+index+'][title]"></div>');
        $item.append('<div class="field"><label>Description</label><textarea name="jankx_timeline['+index+'][description]"></textarea></div>');
        if(imageEnabled){
            var imgField = $('<div class="field image-field"><label>Image</label><div class="image-preview"></div><input type="hidden" class="image-id" name="jankx_timeline['+index+'][image]"><button type="button" class="button select-image">Select Image</button><button type="button" class="button remove-image">Remove</button></div>');
            $item.append(imgField);
        }
        $item.append('<button type="button" class="button link-delete delete-item">Remove item</button>');
        return $item;
    }
    function reindex(){
        $('#jankx-timeline-metabox .jankx-timeline-item').each(function(i){
            var $item = $(this);
            $item.attr('data-index', i);
            $item.find('input, textarea').each(function(){
                var name = $(this).attr('name');
                name = name.replace(/jankx_timeline\\[\\d+\\]/, 'jankx_timeline['+i+']');
                $(this).attr('name', name);
            });
        });
    }
    $(document).on('click', '#jankx-timeline-metabox .add-item', function(){
        var enabled = $('#jankx-timeline-metabox').data('image-enabled') == '1';
        var count = $('#jankx-timeline-metabox .jankx-timeline-item').length;
        var $item = buildItem(count, enabled);
        $('#jankx-timeline-metabox .jankx-timeline-items').append($item);
        reindex();
    });
    $(document).on('click', '#jankx-timeline-metabox .delete-item', function(){
        $(this).closest('.jankx-timeline-item').remove();
        reindex();
    });
    $(document).on('click', '#jankx-timeline-metabox .select-image', function(e){
        e.preventDefault();
        var $field = $(this).closest('.image-field');
        var frame = wp.media({ multiple: false });
        frame.on('select', function(){
            var attachment = frame.state().get('selection').first().toJSON();
            $field.find('.image-id').val(attachment.id);
            $field.find('.image-preview').html('<img src="'+attachment.url+'" />');
        });
        frame.open();
    });
    $(document).on('click', '#jankx-timeline-metabox .remove-image', function(){
        var $field = $(this).closest('.image-field');
        $field.find('.image-id').val('');
        $field.find('.image-preview').empty();
    });
})(jQuery);

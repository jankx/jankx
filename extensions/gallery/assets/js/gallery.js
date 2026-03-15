jQuery(document).ready(function($) {
    var frame;
    var galleryContainer = $('.jankx-gallery-images');
    var inputField = $('#jankx_gallery_ids');

    // Make sortable
    if (galleryContainer.length > 0 && typeof $.fn.sortable !== 'undefined') {
        galleryContainer.sortable({
            placeholder: "ui-state-highlight",
            forcePlaceholderSize: true,
            update: function() {
                updateGalleryIds();
            }
        });
    }

    $('.jankx-add-gallery-images').on('click', function(e) {
        e.preventDefault();

        if (frame) {
            frame.open();
            return;
        }

        frame = wp.media({
            title: 'Select or Upload Images',
            button: {
                text: 'Add to gallery'
            },
            multiple: true,
            library: {
                type: 'image'
            }
        });

        frame.on('select', function() {
            var selection = frame.state().get('selection');
            selection.map(function(attachment) {
                attachment = attachment.toJSON();
                
                // Avoid duplicates if needed, or allow them. 
                // Let's check if ID already exists in DOM to be safe, though galleries might allow duplicates.
                // Generally galleries don't have duplicates.
                if (galleryContainer.find('.jankx-gallery-image[data-id="' + attachment.id + '"]').length > 0) {
                    return;
                }

                var thumbUrl = attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;

                galleryContainer.append(
                    '<div class="jankx-gallery-image" data-id="' + attachment.id + '">' +
                        '<img src="' + thumbUrl + '" />' +
                        '<span class="remove-image">&times;</span>' +
                    '</div>'
                );
            });
            updateGalleryIds();
        });

        frame.open();
    });

    $(document).on('click', '.remove-image', function() {
        $(this).parent().remove();
        updateGalleryIds();
    });

    function updateGalleryIds() {
        var ids = [];
        $('.jankx-gallery-image').each(function() {
            ids.push($(this).data('id'));
        });
        inputField.val(ids.join(','));
        
        // Toggle instruction
        if (ids.length === 0) {
            galleryContainer.find('.jankx-drop-instruction').show();
        } else {
            galleryContainer.find('.jankx-drop-instruction').hide();
        }
    }
    
    // Initial check
    updateGalleryIds();
});

/**
 * Testimonial Block
 */

(function() {
    'use strict';

    // Check if we're in the editor
    if (typeof wp === 'undefined' || !wp.blocks) {
        return;
    }

    const { registerBlockType } = wp.blocks;
    const { __ } = wp.i18n;
    const { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck, PanelColorSettings } = wp.blockEditor;
    const { PanelBody, TextControl, RangeControl, ToggleControl, SelectControl, Button, BaseControl } = wp.components;

    // Register the block
    registerBlockType('jankx/testimonial', {
        apiVersion: 2,
        title: __('Testimonial', 'jankx'),
        description: __('Display customer testimonials with author information and ratings.', 'jankx'),
        category: 'widgets', // Try widgets category instead of common
        icon: 'format-quote',
        keywords: ['testimonial', 'quote', 'review', 'customer', 'feedback'],
        supports: {
            align: ['wide', 'full'],
            html: false,
            anchor: true,
            customClassName: true,
            spacing: {
                margin: true,
                padding: true,
            },
            color: {
                background: true,
                text: true,
            },
        },
        attributes: {
            content: {
                type: 'string',
                default: '',
            },
            author: {
                type: 'string',
                default: '',
            },
            position: {
                type: 'string',
                default: '',
            },
            company: {
                type: 'string',
                default: '',
            },
            avatar: {
                type: 'object',
                default: null,
            },
            rating: {
                type: 'number',
                default: 5,
            },
            style: {
                type: 'string',
                default: 'default',
            },
            alignment: {
                type: 'string',
                default: 'center',
            },
            showAvatar: {
                type: 'boolean',
                default: true,
            },
            showRating: {
                type: 'boolean',
                default: true,
            },
            backgroundColor: {
                type: 'string',
            },
            textColor: {
                type: 'string',
            },
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const {
                content,
                author,
                position,
                company,
                avatar,
                rating,
                style,
                alignment,
                showAvatar,
                showRating,
            } = attributes;

            const blockProps = useBlockProps({
                className: `jankx-testimonial jankx-testimonial-style-${style} jankx-testimonial-align-${alignment}`,
            });

            const onSelectImage = (media) => {
                setAttributes({
                    avatar: {
                        id: media.id,
                        url: media.url,
                        alt: media.alt,
                    },
                });
            };

            const onRemoveImage = () => {
                setAttributes({
                    avatar: null,
                });
            };

            const styleOptions = [
                { label: 'Default', value: 'default' },
                { label: 'Card', value: 'card' },
                { label: 'Minimal', value: 'minimal' },
                { label: 'Modern', value: 'modern' },
            ];

            const alignmentOptions = [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
            ];

            return wp.element.createElement(wp.element.Fragment, null,
                wp.element.createElement(InspectorControls, null,
                    wp.element.createElement(PanelBody, {
                        title: __('Testimonial Settings', 'jankx'),
                        initialOpen: true
                    },
                        wp.element.createElement(SelectControl, {
                            label: __('Style', 'jankx'),
                            value: style,
                            options: styleOptions,
                            onChange: (value) => setAttributes({ style: value })
                        }),
                        wp.element.createElement(SelectControl, {
                            label: __('Alignment', 'jankx'),
                            value: alignment,
                            options: alignmentOptions,
                            onChange: (value) => setAttributes({ alignment: value })
                        }),
                        wp.element.createElement(RangeControl, {
                            label: __('Rating', 'jankx'),
                            value: rating,
                            onChange: (value) => setAttributes({ rating: value }),
                            min: 0,
                            max: 5,
                            step: 1
                        }),
                        wp.element.createElement(ToggleControl, {
                            label: __('Show Rating', 'jankx'),
                            checked: showRating,
                            onChange: (value) => setAttributes({ showRating: value })
                        }),
                        wp.element.createElement(ToggleControl, {
                            label: __('Show Avatar', 'jankx'),
                            checked: showAvatar,
                            onChange: (value) => setAttributes({ showAvatar: value })
                        })
                    ),
                    wp.element.createElement(PanelBody, {
                        title: __('Author Information', 'jankx'),
                        initialOpen: false
                    },
                        wp.element.createElement(TextControl, {
                            label: __('Author Name', 'jankx'),
                            value: author,
                            onChange: (value) => setAttributes({ author: value })
                        }),
                        wp.element.createElement(TextControl, {
                            label: __('Position', 'jankx'),
                            value: position,
                            onChange: (value) => setAttributes({ position: value })
                        }),
                        wp.element.createElement(TextControl, {
                            label: __('Company', 'jankx'),
                            value: company,
                            onChange: (value) => setAttributes({ company: value })
                        }),
                        wp.element.createElement(BaseControl, {
                            label: __('Avatar', 'jankx')
                        },
                            wp.element.createElement(MediaUploadCheck, null,
                                wp.element.createElement(MediaUpload, {
                                    onSelect: onSelectImage,
                                    allowedTypes: ['image'],
                                    value: avatar ? avatar.id : null,
                                    render: ({ open }) => wp.element.createElement('div', {
                                        className: 'jankx-media-upload'
                                    },
                                        avatar && avatar.url ? wp.element.createElement('div', {
                                            className: 'jankx-media-preview'
                                        },
                                            wp.element.createElement('img', {
                                                src: avatar.url,
                                                alt: avatar.alt || author,
                                                className: 'jankx-avatar-preview'
                                            }),
                                            wp.element.createElement(Button, {
                                                isDestructive: true,
                                                onClick: onRemoveImage,
                                                className: 'jankx-remove-media'
                                            }, __('Remove', 'jankx'))
                                        ) : wp.element.createElement(Button, {
                                            isPrimary: true,
                                            onClick: open,
                                            className: 'jankx-select-media'
                                        }, __('Select Image', 'jankx'))
                                    )
                                })
                            )
                        )
                    )
                ),
                wp.element.createElement('div', blockProps,
                    wp.element.createElement('div', {
                        className: 'jankx-testimonial-content'
                    },
                        showRating && rating > 0 && wp.element.createElement('div', {
                            className: 'jankx-testimonial-rating'
                        },
                            Array.from({ length: 5 }, (_, i) => wp.element.createElement('span', {
                                key: i,
                                className: `jankx-star ${i < rating ? 'filled' : 'empty'}`
                            }, '★'))
                        ),
                        wp.element.createElement('blockquote', {
                            className: 'jankx-testimonial-quote'
                        },
                            wp.element.createElement(RichText, {
                                tagName: 'p',
                                value: content,
                                onChange: (value) => setAttributes({ content: value }),
                                placeholder: __('Enter testimonial content...', 'jankx')
                            })
                        ),
                        (author || position || company) && wp.element.createElement('div', {
                            className: 'jankx-testimonial-author'
                        },
                            showAvatar && avatar && avatar.url && wp.element.createElement('div', {
                                className: 'jankx-testimonial-avatar'
                            },
                                wp.element.createElement('img', {
                                    src: avatar.url,
                                    alt: avatar.alt || author
                                })
                            ),
                            wp.element.createElement('div', {
                                className: 'jankx-testimonial-author-info'
                            },
                                author && wp.element.createElement('div', {
                                    className: 'jankx-testimonial-author-name'
                                },
                                    wp.element.createElement(RichText, {
                                        tagName: 'div',
                                        value: author,
                                        onChange: (value) => setAttributes({ author: value }),
                                        placeholder: __('Author name', 'jankx')
                                    })
                                ),
                                (position || company) && wp.element.createElement('div', {
                                    className: 'jankx-testimonial-author-meta'
                                },
                                    position && wp.element.createElement('span', {
                                        className: 'jankx-testimonial-position'
                                    },
                                        wp.element.createElement(RichText, {
                                            tagName: 'span',
                                            value: position,
                                            onChange: (value) => setAttributes({ position: value }),
                                            placeholder: __('Position', 'jankx')
                                        })
                                    ),
                                    position && company && wp.element.createElement('span', {
                                        className: 'jankx-testimonial-separator'
                                    }, ', '),
                                    company && wp.element.createElement('span', {
                                        className: 'jankx-testimonial-company'
                                    },
                                        wp.element.createElement(RichText, {
                                            tagName: 'span',
                                            value: company,
                                            onChange: (value) => setAttributes({ company: value }),
                                            placeholder: __('Company', 'jankx')
                                        })
                                    )
                                )
                            )
                        )
                    )
                )
            );
        },
        save: function(props) {
            const { attributes } = props;
            const {
                content,
                author,
                position,
                company,
                avatar,
                rating,
                style,
                alignment,
                showAvatar,
                showRating,
            } = attributes;

            return wp.element.createElement('div', {
                className: `jankx-testimonial jankx-testimonial-style-${style} jankx-testimonial-align-${alignment}`
            },
                wp.element.createElement('div', {
                    className: 'jankx-testimonial-content'
                },
                    showRating && rating > 0 && wp.element.createElement('div', {
                        className: 'jankx-testimonial-rating'
                    },
                        Array.from({ length: 5 }, (_, i) => wp.element.createElement('span', {
                            key: i,
                            className: `jankx-star ${i < rating ? 'filled' : 'empty'}`
                        }, '★'))
                    ),
                    wp.element.createElement('blockquote', {
                        className: 'jankx-testimonial-quote'
                    },
                        wp.element.createElement(RichText.Content, {
                            value: content
                        })
                    ),
                    (author || position || company) && wp.element.createElement('div', {
                        className: 'jankx-testimonial-author'
                    },
                        showAvatar && avatar && avatar.url && wp.element.createElement('div', {
                            className: 'jankx-testimonial-avatar'
                        },
                            wp.element.createElement('img', {
                                src: avatar.url,
                                alt: avatar.alt || author
                            })
                        ),
                        wp.element.createElement('div', {
                            className: 'jankx-testimonial-author-info'
                        },
                            author && wp.element.createElement('div', {
                                className: 'jankx-testimonial-author-name'
                            },
                                wp.element.createElement(RichText.Content, {
                                    value: author
                                })
                            ),
                            (position || company) && wp.element.createElement('div', {
                                className: 'jankx-testimonial-author-meta'
                            },
                                position && wp.element.createElement('span', {
                                    className: 'jankx-testimonial-position'
                                },
                                    wp.element.createElement(RichText.Content, {
                                        value: position
                                    })
                                ),
                                position && company && wp.element.createElement('span', {
                                    className: 'jankx-testimonial-separator'
                                }, ', '),
                                company && wp.element.createElement('span', {
                                    className: 'jankx-testimonial-company'
                                },
                                    wp.element.createElement(RichText.Content, {
                                        value: company
                                    })
                                )
                            )
                        )
                    )
                )
            );
        }
    });

})();
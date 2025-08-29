/**
 * WordPress dependencies
 */
import {
        RichText,
        useBlockProps,
        __experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
        __experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
        __experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
        __experimentalGetElementClassName,
} from '@wordpress/block-editor';

/**
 * External dependencies
 */
import clsx from 'clsx';
import React from 'react';

const deprecated = [
        {
                supports: {
                        anchor: true,
                        align: true,
                        alignWide: false,
                        color: {
                                __experimentalSkipSerialization: true,
                                gradients: true,
                        },
                        typography: {
                                fontSize: true,
                                __experimentalFontFamily: true,
                        },
                        reusable: false,
                        __experimentalSelector: '.wp-block-jankx-image-button__link',
                },
                attributes: {
                        url: {
                                type: 'string',
                                source: 'attribute',
                                selector: 'a',
                                attribute: 'href',
                        },
                        title: {
                                type: 'string',
                                source: 'attribute',
                                selector: 'a',
                                attribute: 'title',
                        },
                        text: {
                                type: 'string',
                                source: 'html',
                                selector: 'a',
                        },
                        linkTarget: {
                                type: 'string',
                                source: 'attribute',
                                selector: 'a',
                                attribute: 'target',
                        },
                        rel: {
                                type: 'string',
                                source: 'attribute',
                                selector: 'a',
                                attribute: 'rel',
                        },
                        placeholder: {
                                type: 'string',
                        },
                        backgroundColor: {
                                type: 'string',
                        },
                        textColor: {
                                type: 'string',
                        },
                        gradient: {
                                type: 'string',
                        },
                        width: {
                                type: 'number',
                        },
                },
                save( { attributes, className }: any ) {
                        const { fontSize, linkTarget, rel, style, text, title, url, width } =
                                attributes;

                        if ( ! text ) {
                                return null;
                        }

                        const borderProps = getBorderClassesAndStyles( attributes );
                        const colorProps = getColorClassesAndStyles( attributes );
                        const spacingProps = getSpacingClassesAndStyles( attributes );
                        const buttonClasses = clsx(
                                'wp-block-jankx-image-button__link',
                                colorProps.className,
                                borderProps.className,
                                {
                                        // For backwards compatibility add style that isn't provided via
                                        // block support.
                                        'no-border-radius': style?.border?.radius === 0,
                                }
                        );
                        const buttonStyle = {
                                ...borderProps.style,
                                ...colorProps.style,
                                ...spacingProps.style,
                        };

                        // The use of a `title` attribute here is soft-deprecated, but still applied
                        // if it had already been assigned, for the sake of backward-compatibility.
                        // A title will no longer be assigned for new or updated button block links.

                        const wrapperClasses = clsx( className, {
                                [ `has-custom-width wp-block-jankx-image-button__width-${ width }` ]: width,
                                [ `has-custom-font-size` ]: fontSize || style?.typography?.fontSize,
                        } );

                        return React.createElement(
                                'div',
                                { className: wrapperClasses },
                                React.createElement(RichText.Content, {
                                        tagName: 'a',
                                        className: buttonClasses,
                                        href: url,
                                        title: title,
                                        style: buttonStyle,
                                        value: text,
                                        target: linkTarget,
                                        rel: rel,
                                })
                        );
                },
        },
];

export default deprecated;

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import React from 'react';

/**
 * Deprecated version of the image button block.
 * This is used for backward compatibility with older versions.
 */
const deprecated = [
        {
                attributes: {
                        tagName: {
                                type: 'string',
                                default: 'a',
                        },
                        text: {
                                type: 'string',
                                source: 'html',
                                selector: 'a,button',
                        },
                        url: {
                                type: 'string',
                                source: 'attribute',
                                selector: 'a',
                                attribute: 'href',
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
                        textAlign: {
                                type: 'string',
                        },
                        width: {
                                type: 'number',
                        },
                        imageId: {
                                type: 'number',
                        },
                        imageUrl: {
                                type: 'string',
                        },
                        imageAlt: {
                                type: 'string',
                        },
                        imageHeight: {
                                type: 'number',
                                default: 20,
                        },
                        imageMarginRight: {
                                type: 'string',
                                default: '5px',
                        },
                },
                save: ( { attributes }: any ) => {
                        const {
                                tagName,
                                text,
                                url,
                                linkTarget,
                                rel,
                                textAlign,
                                width,
                                imageUrl,
                                imageAlt,
                                imageHeight,
                                imageMarginRight,
                        } = attributes;

                        const TagName = tagName || 'a';
                        const isButtonTag = 'button' === TagName;

                        const wrapperClasses = [ 'wp-block-jankx-image-button' ];
                        if ( width ) {
                                wrapperClasses.push( `has-custom-width wp-block-jankx-image-button__width-${ width }` );
                        }

                        const buttonClasses = [ 'wp-block-jankx-image-button__link' ];
                        if ( textAlign ) {
                                buttonClasses.push( `has-text-align-${ textAlign }` );
                        }

                        return (
                                <div { ...useBlockProps.save( { className: wrapperClasses.join( ' ' ) } ) }>
                                        <TagName
                                                type={ isButtonTag ? 'button' : null }
                                                className={ buttonClasses.join( ' ' ) }
                                                href={ isButtonTag ? null : url }
                                                target={ isButtonTag ? null : linkTarget }
                                                rel={ isButtonTag ? null : rel }
                                        >
                                                { imageUrl && (
                                                        <img
                                                                src={ imageUrl }
                                                                alt={ imageAlt || '' }
                                                                style={ {
                                                                        height: imageHeight,
                                                                        width: 'auto',
                                                                        marginRight: imageMarginRight || '5px',
                                                                } }
                                                                className="wp-block-jankx-image-button__image"
                                                        />
                                                ) }
                                                { text && <RichText.Content value={ text } /> }
                                        </TagName>
                                </div>
                        );
                },
        },
];

export default deprecated;

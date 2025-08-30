/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
        RichText,
        useBlockProps,
        __experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
        __experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
        __experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
        __experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
        __experimentalGetElementClassName,
        getTypographyClassesAndStyles,
} from '@wordpress/block-editor';

export default function save( { attributes, className }: any ) {
        const {
                tagName,
                type,
                textAlign,
                fontSize,
                linkTarget,
                rel,
                style,
                text,
                title,
                url,
                width,
                imageId,
                imageUrl,
                imageAlt,
                imageHeight,
                imageMarginRight,
        } = attributes;

        const TagName = tagName || 'a';
        const isButtonTag = 'button' === TagName;
        const buttonType = type || 'button';
        const borderProps = getBorderClassesAndStyles( attributes );
        const colorProps = getColorClassesAndStyles( attributes );
        const spacingProps = getSpacingClassesAndStyles( attributes );
        const shadowProps = getShadowClassesAndStyles( attributes );
        const typographyProps = getTypographyClassesAndStyles( attributes );
        const buttonClasses = clsx(
                'wp-block-jankx-image-button__link',
                colorProps.className,
                borderProps.className,
                typographyProps.className,
                {
                        [ `has-text-align-${ textAlign }` ]: textAlign,
                        // For backwards compatibility add style that isn't provided via
                        // block support.
                        'no-border-radius': style?.border?.radius === 0,
                        [ `has-custom-font-size` ]: fontSize || style?.typography?.fontSize,
                },
                __experimentalGetElementClassName( 'button' )
        );
        const buttonStyle = {
                ...borderProps.style,
                ...colorProps.style,
                ...spacingProps.style,
                ...shadowProps.style,
                ...typographyProps.style,
                writingMode: undefined,
        };

        // The use of a `title` attribute here is soft-deprecated, but still applied
        // if it had already been assigned, for the sake of backward-compatibility.
        // A title will no longer be assigned for new or updated button block links.

        const wrapperClasses = clsx( className, {
                [ `has-custom-width wp-block-jankx-image-button__width-${ width }` ]: width,
        } );

        // Check if text contains img tags
        const textContainsImg = text && text.includes('<img');
        const richText = ( text && <RichText.Content value={ text } /> );

        const saveData = (
                <div { ...useBlockProps.save( { className: wrapperClasses } ) }>
                        <TagName
                                type={ isButtonTag ? buttonType : null }
                                className={ buttonClasses }
                                href={ isButtonTag ? null : url }
                                title={ title }
                                style={ buttonStyle }
                                target={ isButtonTag ? null : linkTarget }
                                rel={ isButtonTag ? null : rel }
                        >
                                { !textContainsImg && imageUrl && (
                                        <img
                                                src={ imageUrl }
                                                alt={ imageAlt || '' }
                                                style={ {
                                                        height: imageHeight ? `${ imageHeight }px` : '20px',
                                                        width: 'auto',
                                                        marginRight: imageMarginRight || '5px'
                                                } }
                                                className="wp-block-jankx-image-button__image"
                                        />
                                ) }
                                { richText }
                        </TagName>
                </div>
        );

        return saveData;
}

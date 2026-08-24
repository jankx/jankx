
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const v1 = {
    attributes: metadata.attributes,
    supports: {
        anchor: true,
        layout: {
            allowSwitching: true,
            allowInheriting: true,
            default: { type: 'constrained' },
        },
        spacing: {
            margin: true,
            padding: true,
            blockGap: true,
            __experimentalDefaultControls: {
                margin: true,
                padding: true,
                blockGap: true,
            },
        },
        dimensions: { minHeight: true },
        color: {
            gradients: true,
            link: true,
            __experimentalSkipSerialization: true,
            __experimentalDefaultControls: {
                background: true,
                text: true,
                link: true,
            },
        },
        typography: {
            fontSize: true,
            lineHeight: true,
            __experimentalFontFamily: true,
            __experimentalFontWeight: true,
            __experimentalFontStyle: true,
            __experimentalTextTransform: true,
            __experimentalTextDecoration: true,
            __experimentalLetterSpacing: true,
            __experimentalSkipSerialization: true,
            __experimentalDefaultControls: { fontSize: true },
        },
        __experimentalBorder: {
            color: true,
            radius: true,
            style: true,
            width: true,
            __experimentalSkipSerialization: true,
            __experimentalDefaultControls: {
                color: true,
                radius: true,
                style: true,
                width: true,
            },
        },
        html: false,
    },
    save({ attributes }: any) {
        const Tag = attributes.tagName || 'div';
        const blockProps = useBlockProps.save({
            className: 'has-jankx-responsive-wrapper',
        });
        return (
            <Tag {...blockProps}>
                <InnerBlocks.Content />
            </Tag>
        );
    },
    migrate(attributes: any) {
        return attributes;
    },
    isEligible(attributes: any, innerBlocks: any) {
        return true;
    },
};

registerBlockType(metadata.name, {
    ...metadata,
    edit,
    save,
    deprecated: [v1],
});

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl } from '@wordpress/components';

type MegaMenuAttributes = {
    toggleLabel: string;
    collapseBreakpoint: number;
    className?: string;
};

type EditProps = {
    attributes: MegaMenuAttributes;
    setAttributes: (attrs: Partial<MegaMenuAttributes>) => void;
};

export const Edit = ({ attributes, setAttributes }: EditProps): JSX.Element => {
    const { toggleLabel, collapseBreakpoint, className } = attributes;

    const blockProps = useBlockProps({
        className: `jankx-mega-menu ${className || ''}`.trim(),
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Mega Menu Settings', 'jankx')} initialOpen={true}>
                    <TextControl
                        label={__('Toggle Label', 'jankx')}
                        value={toggleLabel}
                        onChange={(value: string) => setAttributes({ toggleLabel: value })}
                    />
                    <RangeControl
                        label={__('Collapse Breakpoint (px)', 'jankx')}
                        value={collapseBreakpoint}
                        onChange={(value?: number) => setAttributes({ collapseBreakpoint: value ?? 959 })}
                        min={480}
                        max={1440}
                        step={1}
                    />
                </PanelBody>
            </InspectorControls>

            <nav {...blockProps} data-breakpoint={collapseBreakpoint}>
                <button className="mega-menu__toggle" type="button" aria-expanded="false">
                    {toggleLabel}
                </button>
                <div className="mega-menu__nav">
                    <InnerBlocks
                        templateLock={false}
                        allowedBlocks={[
                            'core/navigation',
                            'core/group',
                            'core/columns',
                            'core/column',
                            'core/list',
                            'core/paragraph',
                            'core/image',
                        ]}
                    />
                </div>
            </nav>
        </>
    );
};

export const Save = (): JSX.Element => {
    const blockProps = useBlockProps.save({ className: 'jankx-mega-menu' });
    return (
        <nav {...blockProps}>
            <button className="mega-menu__toggle" type="button" aria-expanded="false"></button>
            <div className="mega-menu__nav">
                <InnerBlocks.Content />
            </div>
        </nav>
    );
};

registerBlockType<MegaMenuAttributes>('jankx/mega-menu', {
    title: __('Mega Menu', 'jankx'),
    category: 'widgets',
    attributes: {
        toggleLabel: { type: 'string', default: 'Menu' },
        collapseBreakpoint: { type: 'number', default: 959 },
        className: { type: 'string' },
    },
    edit: Edit,
    save: Save,
});

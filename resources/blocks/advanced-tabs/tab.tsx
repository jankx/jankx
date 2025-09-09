import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InnerBlocks
} from '@wordpress/block-editor';

interface TabAttributes {
    tabId: string;
    tabParentId: string;
}

interface TabEditProps {
    attributes: TabAttributes;
    clientId: string;
}

function TabEdit({ attributes, clientId }: TabEditProps): JSX.Element {
    const { tabId, tabParentId } = attributes;

    const blockProps = useBlockProps({
        className: 'single-tab',
        'data-tab-id': tabId,
        'data-tab-parent-id': tabParentId,
        style: { display: tabId === '1' ? 'block' : 'none' }
    });

    return (
        <div {...blockProps}>
            <div className="tab-content-inner">
                <InnerBlocks
                    orientation="vertical"
                    templateLock={false}
                    renderAppender={InnerBlocks.ButtonBlockAppender}
                />
            </div>
        </div>
    );
}

function TabSave({ attributes }: { attributes: TabAttributes }): JSX.Element {
    const { tabId, tabParentId } = attributes;
    const blockProps = useBlockProps.save({
        className: 'single-tab',
        'data-tab-id': tabId,
        'data-tab-parent-id': tabParentId
    });

    return (
        <div {...blockProps}>
            <div className="tab-content-inner">
                <InnerBlocks.Content />
            </div>
        </div>
    );
}

registerBlockType('jankx/advanced-tab', {
    title: 'Tab',
    category: 'jankx',
    parent: ['jankx/advanced-tabs'],
    supports: {
        html: false,
        anchor: false,
        customClassName: false
    },
    attributes: {
        tabId: { type: 'string' },
        tabParentId: { type: 'string' }
    },
    edit: TabEdit,
    save: TabSave,
});

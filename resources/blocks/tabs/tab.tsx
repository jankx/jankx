import { __ } from '@wordpress/i18n';
import { InnerBlocks, RichText } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';

interface TabEditProps {
    attributes: any;
    setAttributes: (attributes: any) => void;
    clientId: string;
}

interface TabSaveProps {
    attributes: any;
}

// Tab Edit Component
function TabEdit({ attributes, setAttributes, clientId }: TabEditProps) {
    const { tabLabel, blockIndex } = attributes;
    const { updateBlockAttributes } = useDispatch('core/block-editor');

    // Get parent block ID
    const parentBlockID = useSelect((select) => {
        return select('core/block-editor').getBlockParentsByBlockName(clientId, ['jankx/tabs'])[0];
    }, [clientId]);

    // Get current block index
    const currentBlockIndex = useSelect((select) => {
        if (!parentBlockID) return 0;
        return select('core/block-editor').getBlockOrder(parentBlockID).indexOf(clientId);
    }, [parentBlockID, clientId]);

    // Update block index when it changes
    useEffect(() => {
        if (currentBlockIndex !== blockIndex) {
            setAttributes({ blockIndex: currentBlockIndex });
            if (parentBlockID) {
                updateBlockAttributes(parentBlockID, { updateChild: true });
            }
        }
    }, [currentBlockIndex, blockIndex, setAttributes, parentBlockID, updateBlockAttributes]);

    const onChangeTabLabel = (newTabLabel: string) => {
        setAttributes({ tabLabel: newTabLabel });
        if (parentBlockID) {
            updateBlockAttributes(parentBlockID, { updateChild: true });
        }
    };

    return (
        <div className="jankx-tab-edit">
            <RichText
                tagName="p"
                className="jankx-tab-label"
                value={tabLabel}
                onChange={onChangeTabLabel}
                placeholder={__('Tab label...', 'jankx')}
            />
            <div className="jankx-tab-content">
                <InnerBlocks
                    allowedBlocks={true}
                    template={[['core/paragraph']]}
                    templateLock={false}
                />
            </div>
        </div>
    );
}

// Tab Save Component
function TabSave({ attributes }: TabSaveProps) {
    const { tabLabel } = attributes;

    return (
        <div
            className="jankx-tab-panel"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={tabLabel}
            data-tab-label={tabLabel}
        >
            <InnerBlocks.Content />
        </div>
    );
}

// Register Tab Block
registerBlockType('jankx/tab', {
    title: __('Tab', 'jankx'),
    description: __('Acts as child block for Tabs', 'jankx'),
    supports: {
        html: false,
        customClassName: false,
        anchor: false,
    },
    icon: {
        foreground: '#38687c',
        src: 'minus',
    },
    parent: ['jankx/tabs'],
    category: 'jankx-blocks',
    keywords: [
        __('tab', 'jankx'),
        __('tabs', 'jankx'),
    ],
    attributes: {
        tabLabel: {
            type: 'string',
            default: '',
        },
        blockIndex: {
            type: 'number',
            default: 0,
        },
    },
    edit: TabEdit,
    save: TabSave,
});

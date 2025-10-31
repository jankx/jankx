import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
    PanelBody,
    TextControl,
    SelectControl,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    FlexItem,
    Notice,
    Spinner
} from '@wordpress/components';

const TargetBlocks = ({ attributes, setAttributes }) => {
    const { targetBlocks } = attributes;
    const [availableBlocks, setAvailableBlocks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Lấy danh sách các block có thể làm target
    useEffect(() => {
        const fetchAvailableBlocks = async () => {
            setIsLoading(true);
            try {
                // Use REST API to avoid ajaxurl issues in Site Editor iframe
                const data = await (window).wp.apiFetch({
                    path: '/jankx/v1/advanced-filter/filterable-blocks',
                    method: 'GET'
                });
                if (Array.isArray(data)) {
                    setAvailableBlocks(data);
                } else if (data && data.success) {
                    setAvailableBlocks(data.data || []);
                } else {
                    setAvailableBlocks([]);
                }
            } catch (error) {
                console.error('Error fetching available blocks:', error);
                setAvailableBlocks([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailableBlocks();
    }, []);

    const addTargetBlock = () => {
        const newTarget = {
            id: `target_${Date.now()}`,
            blockId: '',
            blockName: '',
            selector: '.jankx-post-layout-content',
            enabled: true
        };
        setAttributes({
            targetBlocks: [...targetBlocks, newTarget]
        });
    };

    const updateTargetBlock = (index, key, value) => {
        const updated = [...targetBlocks];
        updated[index] = { ...updated[index], [key]: value };
        setAttributes({ targetBlocks: updated });
    };

    const removeTargetBlock = (index) => {
        const updated = targetBlocks.filter((_, i) => i !== index);
        setAttributes({ targetBlocks: updated });
    };

    const getBlockName = (blockId) => {
        const block = availableBlocks.find(b => b.id === blockId);
        return block ? block.name : blockId;
    };

    return (
        <PanelBody title={__('Block đích', 'jankx')} initialOpen={true}>
            <Notice status="info" isDismissible={false}>
                {__('Chọn các block sẽ được cập nhật khi filter thay đổi. Thường là Post Layout blocks.', 'jankx')}
            </Notice>

            {isLoading && <Spinner />}

            {targetBlocks.map((target, index) => (
                <Card key={target.id} size="small">
                    <CardHeader>
                        <Flex justify="space-between" align="center">
                            <FlexItem>
                                <strong>{getBlockName(target.blockId) || __('Block mới', 'jankx')}</strong>
                            </FlexItem>
                            <FlexItem>
                                <Button
                                    isDestructive
                                    isSmall
                                    onClick={() => removeTargetBlock(index)}
                                >
                                    {__('Xóa', 'jankx')}
                                </Button>
                            </FlexItem>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <SelectControl
                            label={__('Chọn block', 'jankx')}
                            value={target.blockId}
                            options={[
                                { label: __('Chọn block...', 'jankx'), value: '' },
                                ...availableBlocks.map(block => ({
                                    label: block.name,
                                    value: block.id
                                }))
                            ]}
                            onChange={(value) => {
                                updateTargetBlock(index, 'blockId', value);
                                updateTargetBlock(index, 'blockName', getBlockName(value));
                            }}
                        />

                        <TextControl
                            label={__('CSS Selector', 'jankx')}
                            value={target.selector}
                            onChange={(value) => updateTargetBlock(index, 'selector', value)}
                            placeholder={__('.jankx-post-layout-content', 'jankx')}
                            help={__('CSS selector để tìm phần tử cần cập nhật', 'jankx')}
                        />

                        <div style={{ marginTop: '10px' }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={target.enabled}
                                    onChange={(e) => updateTargetBlock(index, 'enabled', e.target.checked)}
                                />
                                {' '}{__('Kích hoạt', 'jankx')}
                            </label>
                        </div>
                    </CardBody>
                </Card>
            ))}

            <Button
                isPrimary
                onClick={addTargetBlock}
                style={{ marginTop: '10px' }}
            >
                {__('Thêm block đích', 'jankx')}
            </Button>

            {targetBlocks.length === 0 && (
                <Notice status="warning" isDismissible={false}>
                    {__('Chưa có block đích nào. Hãy thêm ít nhất một block để filter hoạt động.', 'jankx')}
                </Notice>
            )}
        </PanelBody>
    );
};

export default TargetBlocks;

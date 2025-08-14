import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    RichText,
    PanelBody,
    Button,
    TextControl,
    SelectControl,
    ToggleControl
} from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import {
    plus,
    trash,
    chevronDown,
    chevronUp
} from '@wordpress/icons';

/**
 * Jankx Tabs Block Editor Component
 */
function ComposeTabEdit({ attributes, setAttributes }) {
    const {
        tabs,
        activeTab,
        tabStyle,
        tabPosition,
        showIcons,
        tabWidth,
        animation,
        className
    } = attributes;

    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const blockProps = useBlockProps({
        className: `jankx-tab-block ${className || ''}`
    });

    // Cập nhật activeTab khi thay đổi activeTabIndex
    useEffect(() => {
        if (tabs[activeTabIndex]) {
            setAttributes({ activeTab: tabs[activeTabIndex].id });
        }
    }, [activeTabIndex]);

    // Thêm tab mới
    const addTab = () => {
        const newTab = {
            id: `tab-${Date.now()}`,
            title: `Tab ${tabs.length + 1}`,
            icon: 'admin-generic',
            action: 'content',
            content: `Nội dung tab ${tabs.length + 1}`,
            link: '',
            modalTitle: '',
            modalContent: ''
        };
        setAttributes({ tabs: [...tabs, newTab] });
    };

    // Xóa tab
    const removeTab = (index) => {
        const newTabs = tabs.filter((_, i) => i !== index);
        setAttributes({ tabs: newTabs });

        if (activeTabIndex >= newTabs.length) {
            setActiveTabIndex(Math.max(0, newTabs.length - 1));
        }
    };

    // Cập nhật tab
    const updateTab = (index, field, value) => {
        const newTabs = [...tabs];
        newTabs[index] = { ...newTabs[index], [field]: value };
        setAttributes({ tabs: newTabs });
    };

    // Di chuyển tab
    const moveTab = (index, direction) => {
        if ((direction === 'up' && index === 0) ||
            (direction === 'down' && index === tabs.length - 1)) {
            return;
        }

        const newTabs = [...tabs];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        [newTabs[index], newTabs[newIndex]] = [newTabs[newIndex], newTabs[index]];
        setAttributes({ tabs: newTabs });

        if (activeTabIndex === index) {
            setActiveTabIndex(newIndex);
        } else if (activeTabIndex === newIndex) {
            setActiveTabIndex(index);
        }
    };

    // Icon options
    const iconOptions = [
        { label: 'Generic', value: 'admin-generic' },
        { label: 'Home', value: 'admin-home' },
        { label: 'Users', value: 'admin-users' },
        { label: 'Settings', value: 'admin-settings' },
        { label: 'Tools', value: 'admin-tools' },
        { label: 'Plugins', value: 'admin-plugins' },
        { label: 'Appearance', value: 'admin-appearance' },
        { label: 'Comments', value: 'admin-comments' },
        { label: 'Media', value: 'admin-media' },
        { label: 'Pages', value: 'admin-page' },
        { label: 'Posts', value: 'admin-post' }
    ];

    // Action options
    const actionOptions = [
        { label: 'Hiển thị nội dung', value: 'content' },
        { label: 'Link đến trang', value: 'link' },
        { label: 'Modal dialog', value: 'modal' }
    ];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Cài đặt Tab', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Kiểu hiển thị', 'jankx')}
                        value={tabStyle}
                        options={[
                            { label: 'Ngang', value: 'horizontal' },
                            { label: 'Dọc', value: 'vertical' },
                            { label: 'Accordion', value: 'accordion' }
                        ]}
                        onChange={(value) => setAttributes({ tabStyle: value })}
                    />

                    <SelectControl
                        label={__('Vị trí tab', 'jankx')}
                        value={tabPosition}
                        options={[
                            { label: 'Trên', value: 'top' },
                            { label: 'Dưới', value: 'bottom' },
                            { label: 'Trái', value: 'left' },
                            { label: 'Phải', value: 'right' }
                        ]}
                        onChange={(value) => setAttributes({ tabPosition: value })}
                    />

                    <ToggleControl
                        label={__('Hiển thị icons', 'jankx')}
                        checked={showIcons}
                        onChange={(value) => setAttributes({ showIcons: value })}
                    />

                    <SelectControl
                        label={__('Chiều rộng tab', 'jankx')}
                        value={tabWidth}
                        options={[
                            { label: 'Tự động', value: 'auto' },
                            { label: 'Cố định', value: 'fixed' },
                            { label: 'Đều nhau', value: 'equal' }
                        ]}
                        onChange={(value) => setAttributes({ tabWidth: value })}
                    />

                    <SelectControl
                        label={__('Hiệu ứng chuyển đổi', 'jankx')}
                        value={animation}
                        options={[
                            { label: 'Fade', value: 'fade' },
                            { label: 'Slide', value: 'slide' },
                            { label: 'Zoom', value: 'zoom' },
                            { label: 'None', value: 'none' }
                        ]}
                        onChange={(value) => setAttributes({ animation: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Quản lý Tabs', 'jankx')} initialOpen={false}>
                    <Button
                        isPrimary
                        icon={plus}
                        onClick={addTab}
                        style={{ width: '100%', marginBottom: '10px' }}
                    >
                        {__('Thêm Tab mới', 'jankx')}
                    </Button>

                    {tabs.map((tab, index) => (
                        <div key={tab.id} className="tab-editor-item" style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            marginBottom: '10px',
                            borderRadius: '4px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <TextControl
                                    label={__('Tiêu đề Tab', 'jankx')}
                                    value={tab.title}
                                    onChange={(value) => updateTab(index, 'title', value)}
                                />

                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <Button
                                        isSmall
                                        icon={chevronUp}
                                        onClick={() => moveTab(index, 'up')}
                                        disabled={index === 0}
                                    />
                                    <Button
                                        isSmall
                                        icon={chevronDown}
                                        onClick={() => moveTab(index, 'down')}
                                        disabled={index === tabs.length - 1}
                                    />
                                    <Button
                                        isSmall
                                        icon={trash}
                                        onClick={() => removeTab(index)}
                                        isDestructive
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <SelectControl
                                    label={__('Icon', 'jankx')}
                                    value={tab.icon}
                                    options={iconOptions}
                                    onChange={(value) => updateTab(index, 'icon', value)}
                                />

                                <SelectControl
                                    label={__('Action', 'jankx')}
                                    value={tab.action}
                                    options={actionOptions}
                                    onChange={(value) => updateTab(index, 'action', value)}
                                />
                            </div>

                            {tab.action === 'content' && (
                                <RichText
                                    tagName="div"
                                    label={__('Nội dung Tab', 'jankx')}
                                    value={tab.content}
                                    onChange={(value) => updateTab(index, 'content', value)}
                                    placeholder={__('Nhập nội dung tab...', 'jankx')}
                                />
                            )}

                            {tab.action === 'link' && (
                                <TextControl
                                    label={__('URL Link', 'jankx')}
                                    value={tab.link}
                                    onChange={(value) => updateTab(index, 'link', value)}
                                    placeholder="https://example.com"
                                />
                            )}

                            {tab.action === 'modal' && (
                                <>
                                    <TextControl
                                        label={__('Tiêu đề Modal', 'jankx')}
                                        value={tab.modalTitle}
                                        onChange={(value) => updateTab(index, 'modalTitle', value)}
                                        placeholder={__('Tiêu đề modal...', 'jankx')}
                                    />
                                    <RichText
                                        tagName="div"
                                        label={__('Nội dung Modal', 'jankx')}
                                        value={tab.modalContent}
                                        onChange={(value) => updateTab(index, 'modalContent', value)}
                                        placeholder={__('Nội dung modal...', 'jankx')}
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {/* Tab Navigation */}
                <div className={`jankx-tab-nav jankx-tab-${tabStyle} jankx-tab-${tabPosition}`}>
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            className={`jankx-tab-button ${activeTabIndex === index ? 'active' : ''}`}
                            onClick={() => setActiveTabIndex(index)}
                            style={{
                                width: tabWidth === 'equal' ? `${100 / tabs.length}%` : 'auto'
                            }}
                        >
                            {showIcons && <span className={`dashicons dashicons-${tab.icon}`}></span>}
                            <span>{tab.title}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className={`jankx-tab-content jankx-tab-${animation}`}>
                    {tabs[activeTabIndex] && (
                        <div className="jankx-tab-panel">
                            {tabs[activeTabIndex].action === 'content' && (
                                <div
                                    className="jankx-tab-text-content"
                                    dangerouslySetInnerHTML={{
                                        __html: tabs[activeTabIndex].content
                                    }}
                                />
                            )}

                            {tabs[activeTabIndex].action === 'link' && (
                                <div className="jankx-tab-link-content">
                                    <p>{__('Tab này sẽ link đến:', 'jankx')}</p>
                                    <a href={tabs[activeTabIndex].link} target="_blank" rel="noopener noreferrer">
                                        {tabs[activeTabIndex].link}
                                    </a>
                                </div>
                            )}

                            {tabs[activeTabIndex].action === 'modal' && (
                                <div className="jankx-tab-modal-content">
                                    <p>{__('Tab này sẽ mở modal với:', 'jankx')}</p>
                                    <strong>{tabs[activeTabIndex].modalTitle}</strong>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: tabs[activeTabIndex].modalContent
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

/**
 * Register the Jankx Tabs Block
 */
registerBlockType('jankx/tabs', {
    edit: ComposeTabEdit,
    // Không có save function vì dùng PHP render
});

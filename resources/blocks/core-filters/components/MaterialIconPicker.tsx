/**
 * Material Icon Picker Component
 *
 * Component đơn giản để chọn Material Icons
 */

import { __ } from '@wordpress/i18n';
import { TextControl, Button, Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';

interface MaterialIconPickerProps {
    value: string;
    onChange: (value: string) => void;
}

// Một số Material Icons phổ biến
const POPULAR_ICONS = [
    'home', 'menu', 'close', 'search', 'favorite', 'star',
    'shopping_cart', 'account_circle', 'settings', 'arrow_forward',
    'arrow_back', 'arrow_upward', 'arrow_downward', 'check',
    'delete', 'edit', 'add', 'remove', 'done', 'info',
    'warning', 'error', 'help', 'visibility', 'visibility_off',
    'thumb_up', 'thumb_down', 'bookmark', 'shopping_bag', 'local_shipping',
];

const MaterialIconPicker = ({ value, onChange }: MaterialIconPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ marginBottom: '15px' }}>
            <TextControl
                label={__('Icon Name', 'jankx')}
                value={value}
                onChange={onChange}
                help={
                    <>
                        {__('Enter Material Icon name or ', 'jankx')}
                        <Button
                            variant="link"
                            onClick={() => setIsOpen(!isOpen)}
                            style={{ padding: 0, height: 'auto' }}
                        >
                            {__('choose from popular icons', 'jankx')}
                        </Button>
                    </>
                }
            />

            {value && (
                <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <span className="material-icons" style={{ fontSize: '24px' }}>
                        {value}
                    </span>
                    <span>{value}</span>
                </div>
            )}

            {isOpen && (
                <Popover
                    position="bottom center"
                    onClose={() => setIsOpen(false)}
                >
                    <div style={{
                        padding: '15px',
                        width: '320px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                    }}>
                        <h4 style={{ marginTop: 0 }}>
                            {__('Popular Material Icons', 'jankx')}
                        </h4>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '10px',
                        }}>
                            {POPULAR_ICONS.map((iconName) => (
                                <Button
                                    key={iconName}
                                    onClick={() => {
                                        onChange(iconName);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        padding: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '4px',
                                        border: value === iconName ? '2px solid #007cba' : '1px solid #ddd',
                                        backgroundColor: value === iconName ? '#f0f6fc' : 'white',
                                    }}
                                    title={iconName}
                                >
                                    <span className="material-icons" style={{ fontSize: '24px' }}>
                                        {iconName}
                                    </span>
                                    <span style={{ fontSize: '10px', textAlign: 'center' }}>
                                        {iconName.substring(0, 8)}
                                    </span>
                                </Button>
                            ))}
                        </div>
                        <p style={{
                            marginTop: '15px',
                            fontSize: '12px',
                            color: '#666',
                        }}>
                            {__('Browse more icons at ', 'jankx')}
                            <a
                                href="https://fonts.google.com/icons"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Google Fonts Icons
                            </a>
                        </p>
                    </div>
                </Popover>
            )}
        </div>
    );
};

export default MaterialIconPicker;


/**
 * SVG Icon Input Component
 *
 * Component để nhập SVG code
 */

import { __ } from '@wordpress/i18n';
import { TextareaControl } from '@wordpress/components';

interface SvgIconInputProps {
    value: string;
    onChange: (value: string) => void;
}

const SvgIconInput = ({ value, onChange }: SvgIconInputProps) => {
    return (
        <div style={{ marginBottom: '15px' }}>
            <TextareaControl
                label={__('SVG Code', 'jankx')}
                value={value}
                onChange={onChange}
                rows={6}
                help={__('Paste your SVG code here', 'jankx')}
            />

            {value && value.includes('<svg') && (
                <div style={{
                    marginTop: '10px',
                    padding: '15px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                        {__('Preview:', 'jankx')}
                    </p>
                    <div
                        dangerouslySetInnerHTML={{ __html: value }}
                        style={{
                            display: 'inline-block',
                            maxWidth: '100px',
                            maxHeight: '100px',
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default SvgIconInput;


import React from 'react';
import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    InspectorControls 
} from '@wordpress/block-editor';
import { 
    PanelBody, 
    ToggleControl, 
    TextControl, 
    RangeControl 
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { UserMenuAttributes } from './types';
import './editor.scss';

const Edit: React.FC<{
    attributes: UserMenuAttributes;
    setAttributes: (attrs: Partial<UserMenuAttributes>) => void;
}> = ({ attributes, setAttributes }) => {
    const { 
        showRegister, 
        showLogin, 
        showUserName, 
        greetingText, 
        avatarSize 
    } = attributes;

    const { currentUser } = useSelect((select: any) => {
        return {
            currentUser: select('core').getCurrentUser()
        };
    }, []);

    const blockProps = useBlockProps({
        className: 'user-menu-wrapper is-editor-preview'
    });

    const displayUserName = currentUser?.name || __('User', 'jankx');
    const displayAvatar = currentUser?.avatar_urls?.['96'] || currentUser?.avatar_urls?.['48'] || null;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Cài đặt Menu', 'jankx')}>
                    <ToggleControl
                        label={__('Hiển thị Đăng ký', 'jankx')}
                        checked={showRegister}
                        onChange={(value: boolean) => setAttributes({ showRegister: value })}
                    />
                    <ToggleControl
                        label={__('Hiển thị Đăng nhập', 'jankx')}
                        checked={showLogin}
                        onChange={(value: boolean) => setAttributes({ showLogin: value })}
                    />
                    <ToggleControl
                        label={__('Hiển thị tên người dùng', 'jankx')}
                        checked={showUserName}
                        onChange={(value: boolean) => setAttributes({ showUserName: value })}
                    />
                    <TextControl
                        label={__('Lời chào', 'jankx')}
                        value={greetingText}
                        onChange={(value: string) => setAttributes({ greetingText: value })}
                    />
                    <RangeControl
                        label={__('Kích thước Avatar', 'jankx')}
                        value={avatarSize}
                        onChange={(value: number) => setAttributes({ avatarSize: value })}
                        min={20}
                        max={100}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="user-menu-logged-in">
                    <div 
                        className="user-avatar" 
                        style={{ 
                            width: avatarSize, 
                            height: avatarSize, 
                            background: displayAvatar ? 'transparent' : '#eee',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}
                    >
                        {displayAvatar ? (
                            <img src={displayAvatar} alt={displayUserName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: avatarSize * 0.5 }}>👤</span>
                        )}
                    </div>
                    {(showUserName || greetingText) && (
                        <div className="user-greeting">
                            {greetingText && <span className="greeting-text">{greetingText}</span>}
                            {showUserName && <span className="user-name">{displayUserName}</span>}
                        </div>
                    )}
                </div>

                {(showLogin || showRegister) && (
                    <div className="user-menu-guest" style={{ opacity: 0.5, marginLeft: 'auto' }}>
                        {showLogin && <span className="login-link">{__('Đăng nhập', 'jankx')}</span>}
                        {showRegister && <span className="btn-register">{__('Đăng ký', 'jankx')}</span>}
                    </div>
                )}
            </div>
        </>
    );
};

export default Edit;

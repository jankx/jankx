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

    const isLoggedIn = !!currentUser?.id;
    const blockProps = useBlockProps({
        className: `jankx-user-menu ${isLoggedIn ? 'logged-in' : 'logged-out'}`
    });

    const displayName = currentUser?.name || __('User', 'jankx');
    const avatarUrl = currentUser?.avatar_urls?.['96'] || currentUser?.avatar_urls?.['48'] || null;

    // Logged-in preview
    if (isLoggedIn) {
        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Cài đặt Menu', 'jankx')}>
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
                    <div className="user-menu-trigger">
                        {showUserName && (
                            <span className="user-greeting">
                                {greetingText && <span className="greeting-text">{greetingText}</span>}
                                <span className="user-name">{displayName}</span>
                            </span>
                        )}
                        <div 
                            className="user-avatar" 
                            style={{ width: avatarSize, height: avatarSize }}
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={displayName} />
                            ) : (
                                <span style={{ fontSize: avatarSize * 0.5 }}>👤</span>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Logged-out preview
    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Cài đặt Menu', 'jankx')}>
                    <ToggleControl
                        label={__('Hiển thị Đăng nhập', 'jankx')}
                        checked={showLogin}
                        onChange={(value: boolean) => setAttributes({ showLogin: value })}
                    />
                    <ToggleControl
                        label={__('Hiển thị Đăng ký', 'jankx')}
                        checked={showRegister}
                        onChange={(value: boolean) => setAttributes({ showRegister: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {showLogin && (
                    <a href="#" className="login-link" onClick={(e) => e.preventDefault()}>
                        {__('Đăng nhập', 'jankx')}
                    </a>
                )}
                {showRegister && (
                    <a href="#" className="register-button" onClick={(e) => e.preventDefault()}>
                        {__('Đăng ký', 'jankx')}
                    </a>
                )}
            </div>
        </>
    );
};

export default Edit;

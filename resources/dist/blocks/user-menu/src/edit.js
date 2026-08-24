import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl, RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';
const Edit = ({ attributes, setAttributes }) => {
    const { showRegister, showLogin, showUserName, greetingText, avatarSize } = attributes;
    const { currentUser } = useSelect((select) => {
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
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Cài đặt Menu', 'jankx'), children: [_jsx(ToggleControl, { label: __('Hiển thị tên người dùng', 'jankx'), checked: showUserName, onChange: (value) => setAttributes({ showUserName: value }) }), _jsx(TextControl, { label: __('Lời chào', 'jankx'), value: greetingText, onChange: (value) => setAttributes({ greetingText: value }) }), _jsx(RangeControl, { label: __('Kích thước Avatar', 'jankx'), value: avatarSize, onChange: (value) => setAttributes({ avatarSize: value }), min: 20, max: 100 })] }) }), _jsx("div", { ...blockProps, children: _jsxs("div", { className: "user-menu-trigger", children: [showUserName && (_jsxs("span", { className: "user-greeting", children: [greetingText && _jsx("span", { className: "greeting-text", children: greetingText }), _jsx("span", { className: "user-name", children: displayName })] })), _jsx("div", { className: "user-avatar", style: { width: avatarSize, height: avatarSize }, children: avatarUrl ? (_jsx("img", { src: avatarUrl, alt: displayName })) : (_jsx("span", { style: { fontSize: avatarSize * 0.5 }, children: "\uD83D\uDC64" })) })] }) })] }));
    }
    // Logged-out preview
    return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Cài đặt Menu', 'jankx'), children: [_jsx(ToggleControl, { label: __('Hiển thị Đăng nhập', 'jankx'), checked: showLogin, onChange: (value) => setAttributes({ showLogin: value }) }), _jsx(ToggleControl, { label: __('Hiển thị Đăng ký', 'jankx'), checked: showRegister, onChange: (value) => setAttributes({ showRegister: value }) })] }) }), _jsxs("div", { ...blockProps, children: [showLogin && (_jsx("a", { href: "#", className: "login-link", onClick: (e) => e.preventDefault(), children: __('Đăng nhập', 'jankx') })), showRegister && (_jsx("a", { href: "#", className: "register-button", onClick: (e) => e.preventDefault(), children: __('Đăng ký', 'jankx') }))] })] }));
};
export default Edit;

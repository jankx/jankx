import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    TextControl,
    SelectControl,
    ToggleControl,
    Button
} from '@wordpress/components';
import {
    link,
    external
} from '@wordpress/icons';

interface LinkSettingsProps {
    linkUrl: string;
    linkTarget: '_self' | '_blank' | '_parent' | '_top';
    linkRel: string;
    onLinkChange: (url: string) => void;
    onLinkTargetChange: (target: '_self' | '_blank' | '_parent' | '_top') => void;
    onLinkRelChange: (rel: string) => void;
}

const LinkSettings = ({
    linkUrl,
    linkTarget,
    linkRel,
    onLinkChange,
    onLinkTargetChange,
    onLinkRelChange
}: LinkSettingsProps) => {
    const hasLink = !!linkUrl;

    const handleLinkChange = (newUrl: string) => {
        onLinkChange(newUrl);
    };

    const handleLinkTargetChange = (newTarget: '_self' | '_blank' | '_parent' | '_top') => {
        onLinkTargetChange(newTarget);
    };

    const handleLinkRelChange = (newRel: string) => {
        onLinkRelChange(newRel);
    };

    const getLinkIcon = () => {
        if (linkTarget === '_blank') {
            return external;
        }
        return link;
    };

    return (
        <PanelBody
            title={__('Link Settings', 'jankx')}
            icon={getLinkIcon()}
            initialOpen={false}
        >
            <TextControl
                label={__('URL', 'jankx')}
                value={linkUrl}
                onChange={handleLinkChange}
                placeholder="https://example.com"
                help={__('Nhập URL để tạo link cho icon', 'jankx')}
            />

            <SelectControl
                label={__('Open in', 'jankx')}
                value={linkTarget}
                options={[
                    { label: __('Same window', 'jankx'), value: '_self' },
                    { label: __('New window', 'jankx'), value: '_blank' },
                    { label: __('Parent frame', 'jankx'), value: '_parent' },
                    { label: __('Top frame', 'jankx'), value: '_top' }
                ]}
                onChange={handleLinkTargetChange}
            />

            <TextControl
                label={__('Link Rel', 'jankx')}
                value={linkRel}
                onChange={handleLinkRelChange}
                placeholder="nofollow noreferrer"
                help={__('Thêm rel attributes cho link (tùy chọn)', 'jankx')}
            />

            {hasLink && (
                <div className="jankx-link-settings__preview">
                    <p className="jankx-link-settings__preview-text">
                        {__('Preview:', 'jankx')}
                    </p>
                    <a
                        href={linkUrl}
                        target={linkTarget}
                        rel={linkRel}
                        className="jankx-link-settings__preview-link"
                    >
                        {linkUrl}
                    </a>
                </div>
            )}
        </PanelBody>
    );
};

export default LinkSettings;

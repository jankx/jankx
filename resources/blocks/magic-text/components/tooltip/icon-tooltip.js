import { Icon } from "@wordpress/icons";

const IconTooltip = () => (
    <Icon
        icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="14" height="10" rx="3" ry="3" fill="currentColor" opacity="0.9" />
                <path d="M8 13 L10 16 L12 13 Z" fill="currentColor" opacity="0.9" />
                <rect x="5" y="5.5" width="8" height="1.5" rx="0.75" fill="white" opacity="0.8" />
                <rect x="5" y="8" width="6" height="1.5" rx="0.75" fill="white" opacity="0.6" />
                <circle cx="19" cy="19" r="3" fill="currentColor" opacity="0.7" />
                <text x="19" y="22" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="3" fontWeight="bold" fill="white">i</text>
            </svg>
        }
    />
);

export default IconTooltip;
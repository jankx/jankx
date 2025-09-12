import { Icon } from "@wordpress/icons";

const IconBgImage = () => (
    <Icon
        icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="imageTexture" patternUnits="userSpaceOnUse" width="6" height="6">
                        <rect width="6" height="6" fill="url(#skyGradient)" />
                        <path d="M0 4 L2 2 L4 3 L6 1 L6 6 L0 6 Z" fill="#2d3748" />
                        <circle cx="1.5" cy="1.5" r="0.8" fill="#fbbf24" />
                        <ellipse cx="4.5" cy="2" rx="0.8" ry="0.4" fill="white" opacity="0.8" />
                    </pattern>
                    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#87ceeb" />
                        <stop offset="100%" stopColor="#e0f6ff" />
                    </linearGradient>
                    <mask id="textMask">
                        <rect width="24" height="24" fill="black" />
                        <text x="12" y="16" textAnchor="middle" fontFamily="Arial, sans-serif"
                            fontSize="10" fontWeight="bold" fill="white">Aa</text>
                    </mask>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="3" y="3" width="18" height="18" fill="url(#imageTexture)" mask="url(#textMask)" />
                <text x="12" y="16" textAnchor="middle" fontFamily="Arial, sans-serif"
                    fontSize="10" fontWeight="bold" fill="none"
                    stroke="rgba(0,0,0,0.3)" strokeWidth="0.3">Aa</text>
                <g transform="translate(16, 4)">
                    <rect width="5" height="4" rx="0.5" fill="#374151" />
                    <rect x="0.5" y="0.5" width="4" height="3" rx="0.3" fill="white" />
                    <path d="M1 3 L2 2 L3 2.5 L4 1.5 L4.5 3.5 L1 3.5 Z" fill="#6b7280" />
                    <circle cx="2" cy="1.8" r="0.3" fill="#fbbf24" />
                </g>
                <g transform="translate(3, 17)">
                    <rect width="4" height="2" rx="0.3" fill="#4f46e5" opacity="0.8" />
                    <text x="2" y="1.3" textAnchor="middle" fontFamily="Arial, sans-serif"
                        fontSize="1.5" fill="white" fontWeight="bold">T</text>
                </g>
            </svg>
        }
    />
);

export default IconBgImage;
import { Icon } from "@wordpress/icons";
const IconMarker = () => (
    <Icon
        icon={
            <svg width="20" height="20" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id="markerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" /> {/* Yellow */}
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" /> {/* Orange */}
                    </linearGradient>
                </defs>
                {/* Marker pen */}
                <rect x="16" y="4" width="3" height="16" rx="1.5"
                    fill="url(#markerGrad)"
                    transform="rotate(20 17.5 12)" />

                {/* Marker tip */}
                <rect x="16.5" y="3" width="2" height="2" rx="1"
                    fill="#d97706"
                    transform="rotate(20 17.5 4)" />

                {/* Highlighted text effect */}
                <rect x="4" y="11" width="14" height="3" rx="1.5"
                    fill="#fbbf24"
                    opacity="0.5" />

                {/* Text "A" */}
                <text x="6" y="17" fontSize="14" fontFamily="Arial" fill="currentColor">A</text>
            </svg>
        }
    />
);

export default IconMarker;

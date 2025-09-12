
import { Icon } from '@wordpress/icons';
const IconGradientStroke = () => (
    <Icon
        icon={
            <svg width="20" height="20" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#800080' }} />
                        <stop offset="100%" style={{ stopColor: '#ff69b4' }} />
                    </linearGradient>
                </defs>
                <text
                    x="4"
                    y="17"
                    fontSize="16"
                    fontFamily="Arial"
                    stroke="url(#strokeGradient)"
                    fill="none"
                    strokeWidth="1"
                >
                    A
                </text>
            </svg>
        }
    />
);
export default IconGradientStroke;

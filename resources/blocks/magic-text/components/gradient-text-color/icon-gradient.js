import { Icon } from '@wordpress/icons';
const IconGradient = () => (
  <Icon
    icon={
      <svg width="20" height="20" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#800080', stopOpacity: 1 }} /> {/* Purple */}
            <stop offset="100%" style={{ stopColor: '#ff69b4', stopOpacity: 1 }} /> {/* Pink */}
          </linearGradient>
        </defs>
        <text x="4" y="17" fontSize="16" fontFamily="Arial" fill="url(#grad1)">A</text>
      </svg>
    }
  />
);
export default IconGradient;

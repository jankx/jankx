import { Icon } from "@wordpress/icons";

const IconUnderlineCurve = () => (
    <Icon
        icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="underlineClip">
                        <polygon points="2,12 12,18 22,12 22,6 2,6" />
                    </clipPath>
                </defs>
                <path d="M6 4 L6 12 Q6 16 10 16 L14 16 Q18 16 18 12 L18 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round" />

                <path d="M3 21 Q12 15 21 21"
                    fill="none"
                    stroke="hsl(130, 80%, 50%)"
                    strokeWidth="2" />
                <path d="M3 21 Q12 15 21 21"
                    fill="none"
                    stroke="hsl(130, 80%, 50%)"
                    strokeWidth="4"
                    opacity="0.6"
                    clipPath="url(#underlineClip)" />
                <path d="M5 20.5 Q12 16 19 20.5"
                    stroke="hsl(130, 80%, 50%)"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.8" />

                <circle cx="8" cy="18" r="0.8" fill="hsl(130, 80%, 50%)" opacity="0.4" />
                <circle cx="16" cy="18" r="0.8" fill="hsl(130, 80%, 50%)" opacity="0.4" />
            </svg>
        }
    />
);

export default IconUnderlineCurve;
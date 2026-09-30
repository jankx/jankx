/**
 * Shared network list for the social sharing blocks.
 */

export type Network = {
    value: string;
    label: string;
    icon: string;
};

export const AVAILABLE_NETWORKS: Network[] = [
    { value: 'facebook', label: 'Facebook', icon: 'f' },
    { value: 'twitter', label: 'Twitter/X', icon: '𝕏' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'in' },
    { value: 'whatsapp', label: 'WhatsApp', icon: 'W' },
    { value: 'telegram', label: 'Telegram', icon: 'T' },
    { value: 'pinterest', label: 'Pinterest', icon: 'P' },
    { value: 'reddit', label: 'Reddit', icon: 'R' },
    { value: 'email', label: 'Email', icon: '@' },
    { value: 'copy', label: 'Copy Link', icon: '🔗' },
    { value: 'messenger', label: 'Messenger', icon: 'M' },
    { value: 'viber', label: 'Viber', icon: 'V' },
    { value: 'line', label: 'Line', icon: 'L' },
];

export const getNetworkData = (network: string): Network =>
    AVAILABLE_NETWORKS.find((n) => n.value === network) || AVAILABLE_NETWORKS[0];

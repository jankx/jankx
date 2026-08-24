import { useBlockProps } from '@wordpress/block-editor';
export default function save() {
    // This block uses server-side rendering, so we don't need to save any content
    // The content will be generated dynamically on the frontend
    return null;
}

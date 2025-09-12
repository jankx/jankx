/**
 * TypeScript interfaces for Advanced Image Box block
 */

export interface AdvancedImageBoxAttributes {
	// Core image attributes
	url?: string;
	alt?: string;
	title?: string;
	id?: number;
	width?: string;
	height?: string;
	aspectRatio?: string;
	scale?: string;
	sizeSlug?: string;
	href?: string;
	linkTarget?: string;
	rel?: string;
	caption?: string;

	// Overlay settings
	showOverlayOnHover?: boolean;
	overlayAnimation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' |
					   'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' |
					   'zoomIn' | 'zoomInUp' | 'zoomInDown' | 'zoomInLeft' | 'zoomInRight' |
					   'bounceIn' | 'bounceInUp' | 'bounceInDown' | 'bounceInLeft' | 'bounceInRight' |
					   'flipInX' | 'flipInY' | 'rotateIn' | 'rotateInDownLeft' | 'rotateInDownRight' |
					   'pulse' | 'shake' | 'swing' | 'tada' | 'wobble';
	overlayAnimationDuration?: number;
	overlayAnimationDelay?: number;
	overlayPosition?: 'top' | 'center' | 'bottom' | 'left' | 'right';
	overlayBackground?: string;
	overlayOpacity?: number;

	// Image hover effects
	imageHoverEffect?: 'none' | 'zoom' | 'fade' | 'blur' | 'grayscale' | 'sepia' | 'brightness';

	// Styling
	borderRadius?: string;
	align?: 'left' | 'center' | 'right' | 'wide' | 'full';
	className?: string;
	style?: Record<string, any>;
}

export interface AdvancedImageBoxEditProps {
	attributes: AdvancedImageBoxAttributes;
	setAttributes: (attributes: Partial<AdvancedImageBoxAttributes>) => void;
	isSelected: boolean;
	className?: string;
	clientId: string;
	context?: Record<string, any>;
	onReplace?: (blocks: any[]) => void;
	insertBlocksAfter?: () => void;
}

export interface AdvancedImageBoxSaveProps {
	attributes: AdvancedImageBoxAttributes;
	className?: string;
}

export interface BlockInstance {
	name: string;
	attributes: Record<string, any>;
	innerBlocks: BlockInstance[];
	clientId: string;
}

export interface ValidationResult {
	isValid: boolean;
	issues?: ValidationIssue[];
}

export interface ValidationIssue {
	type: 'error' | 'warning';
	message: string;
	block?: string;
}

export interface MediaFile {
	id: number;
	url: string;
	alt?: string;
	title?: string;
	caption?: string;
	description?: string;
	media_details?: {
		sizes?: Record<string, {
			file: string;
			width: number;
			height: number;
			mime_type: string;
			source_url: string;
		}>;
	};
}

export interface ImageSize {
	name: string;
	slug: string;
	width?: number;
	height?: number;
}

export interface AnimationOption {
	value: string;
	label: string;
	description?: string;
	category?: string;
}

export interface OverlayPosition {
	value: string;
	label: string;
	description?: string;
}

export interface HoverEffect {
	value: string;
	label: string;
	description?: string;
}

export interface OverlayInfoBoxProps {
	animation: string;
	duration: number;
	delay: number;
	position: string;
	background: string;
	opacity: number;
	children: React.ReactNode;
	className?: string;
}

export interface InnerBlocksTemplate {
	name: string;
	attributes?: Record<string, any>;
	innerBlocks?: InnerBlocksTemplate[];
}

export interface OverlaySettings {
	showOverlayOnHover: boolean;
	overlayAnimation: string;
	overlayPosition: string;
	overlayBackground: string;
	overlayOpacity: number;
}

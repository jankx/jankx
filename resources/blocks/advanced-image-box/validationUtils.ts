/**
 * Validation utilities for Advanced Image Box block
 */

import {
	AdvancedImageBoxAttributes,
	BlockInstance,
	ValidationResult,
	ValidationIssue
} from './types';
import {
	ALLOWED_INNER_BLOCKS,
	VALIDATION_RULES
} from './constants';

/**
 * Validate block content including attributes and inner blocks
 */
export const validateBlockContent = (
	attributes: AdvancedImageBoxAttributes,
	innerBlocks: BlockInstance[] = []
): ValidationResult => {
	const issues: ValidationIssue[] = [];

	// Validate required attributes
	if (!attributes.url && !attributes.id) {
		issues.push({
			type: 'error',
			message: 'Image URL or ID is required'
		});
	}

	// Validate inner blocks structure
	if (innerBlocks.length > 0) {
		const validInnerBlocks = validateInnerBlocks(innerBlocks);
		if (!validInnerBlocks.isValid) {
			issues.push(...(validInnerBlocks.issues || []));
		}
	}

	// Validate overlay settings
	if (attributes.showOverlayOnHover) {
		if (!attributes.overlayAnimation) {
			issues.push({
				type: 'warning',
				message: 'Overlay animation is recommended when hover is enabled'
			});
		}

		// Validate animation duration
		if (attributes.overlayAnimationDuration) {
			if (attributes.overlayAnimationDuration < VALIDATION_RULES.minAnimationDuration ||
				attributes.overlayAnimationDuration > VALIDATION_RULES.maxAnimationDuration) {
				issues.push({
					type: 'warning',
					message: `Animation duration should be between ${VALIDATION_RULES.minAnimationDuration}ms and ${VALIDATION_RULES.maxAnimationDuration}ms`
				});
			}
		}

		// Validate animation delay
		if (attributes.overlayAnimationDelay) {
			if (attributes.overlayAnimationDelay < VALIDATION_RULES.minAnimationDelay ||
				attributes.overlayAnimationDelay > VALIDATION_RULES.maxAnimationDelay) {
				issues.push({
					type: 'warning',
					message: `Animation delay should be between ${VALIDATION_RULES.minAnimationDelay}ms and ${VALIDATION_RULES.maxAnimationDelay}ms`
				});
			}
		}

		// Validate overlay opacity
		if (attributes.overlayOpacity !== undefined) {
			if (attributes.overlayOpacity < VALIDATION_RULES.minOverlayOpacity ||
				attributes.overlayOpacity > VALIDATION_RULES.maxOverlayOpacity) {
				issues.push({
					type: 'warning',
					message: `Overlay opacity should be between ${VALIDATION_RULES.minOverlayOpacity} and ${VALIDATION_RULES.maxOverlayOpacity}`
				});
			}
		}
	}

	// Validate image dimensions
	if (attributes.width && attributes.height) {
		const width = parseInt(attributes.width);
		const height = parseInt(attributes.height);

		if (isNaN(width) || isNaN(height)) {
			issues.push({
				type: 'warning',
				message: 'Width and height should be valid numbers'
			});
		}

		if (width < 1 || height < 1) {
			issues.push({
				type: 'warning',
				message: 'Width and height should be greater than 0'
			});
		}
	}

	return {
		isValid: issues.length === 0,
		issues: issues.length > 0 ? issues : undefined
	};
};

/**
 * Validate inner blocks structure and content
 */
export const validateInnerBlocks = (
	innerBlocks: BlockInstance[]
): ValidationResult => {
	const issues: ValidationIssue[] = [];

	// Check maximum number of inner blocks
	if (innerBlocks.length > VALIDATION_RULES.maxInnerBlocks) {
		issues.push({
			type: 'warning',
			message: `Maximum ${VALIDATION_RULES.maxInnerBlocks} inner blocks allowed`
		});
	}

	innerBlocks.forEach((block, index) => {
		// Validate block type
		if (!isAllowedInnerBlock(block.name)) {
			issues.push({
				type: 'error',
				message: `Block type "${block.name}" is not allowed in overlay`,
				block: block.name
			});
		}

		// Validate block attributes
		if (block.attributes && Object.keys(block.attributes).length > 0) {
			const blockValidation = validateBlockAttributes(block.name, block.attributes);
			if (!blockValidation.isValid) {
				issues.push(...(blockValidation.issues || []));
			}
		}

		// Recursively validate nested inner blocks
		if (block.innerBlocks && block.innerBlocks.length > 0) {
			const nestedValidation = validateInnerBlocks(block.innerBlocks);
			if (!nestedValidation.isValid) {
				issues.push(...(nestedValidation.issues || []));
			}
		}
	});

	return {
		isValid: issues.length === 0,
		issues: issues.length > 0 ? issues : undefined
	};
};

/**
 * Check if block type is allowed in inner blocks
 */
export const isAllowedInnerBlock = (blockName: string): boolean => {
	return ALLOWED_INNER_BLOCKS.includes(blockName);
};

/**
 * Validate specific block attributes
 */
export const validateBlockAttributes = (
	blockName: string,
	attributes: Record<string, any>
): ValidationResult => {
	const issues: ValidationIssue[] = [];

	// Block-specific validation
	switch (blockName) {
		case 'core/heading':
			if (!attributes.content && !attributes.level) {
				issues.push({
					type: 'warning',
					message: 'Heading should have content and level'
				});
			}
			break;

		case 'core/button':
			if (!attributes.text && !attributes.url) {
				issues.push({
					type: 'warning',
					message: 'Button should have text and URL'
				});
			}
			break;

		case 'core/paragraph':
			if (!attributes.content) {
				issues.push({
					type: 'warning',
					message: 'Paragraph should have content'
				});
			}
			break;

		case 'core/list':
			if (!attributes.values && !attributes.ordered) {
				issues.push({
					type: 'warning',
					message: 'List should have content'
				});
			}
			break;

		case 'core/group':
			if (!attributes.layout) {
				issues.push({
					type: 'info',
					message: 'Group layout is recommended'
				});
			}
			break;

		case 'core/columns':
			if (!attributes.columns) {
				issues.push({
					type: 'warning',
					message: 'Columns should specify number of columns'
				});
			}
			break;
	}

	return {
		isValid: issues.length === 0,
		issues: issues.length > 0 ? issues : undefined
	};
};

/**
 * Validate animation settings
 */
export const validateAnimationSettings = (
	animation: string,
	duration: number,
	delay: number
): ValidationResult => {
	const issues: ValidationIssue[] = [];

	// Validate animation name
	const validAnimations = [
		'fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight',
		'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight',
		'zoomIn', 'zoomInUp', 'zoomInDown', 'zoomInLeft', 'zoomInRight',
		'bounceIn', 'bounceInUp', 'bounceInDown', 'bounceInLeft', 'bounceInRight',
		'flipInX', 'flipInY', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight',
		'pulse', 'shake', 'swing', 'tada', 'wobble'
	];

	if (animation && !validAnimations.includes(animation)) {
		issues.push({
			type: 'error',
			message: `Invalid animation: ${animation}`
		});
	}

	// Validate duration
	if (duration < VALIDATION_RULES.minAnimationDuration ||
		duration > VALIDATION_RULES.maxAnimationDuration) {
		issues.push({
			type: 'warning',
			message: `Animation duration should be between ${VALIDATION_RULES.minAnimationDuration}ms and ${VALIDATION_RULES.maxAnimationDuration}ms`
		});
	}

	// Validate delay
	if (delay < VALIDATION_RULES.minAnimationDelay ||
		delay > VALIDATION_RULES.maxAnimationDelay) {
		issues.push({
			type: 'warning',
			message: `Animation delay should be between ${VALIDATION_RULES.minAnimationDelay}ms and ${VALIDATION_RULES.maxAnimationDelay}ms`
		});
	}

	return {
		isValid: issues.length === 0,
		issues: issues.length > 0 ? issues : undefined
	};
};

/**
 * Validate overlay settings
 */
export const validateOverlaySettings = (
	overlaySettings: {
		position: string;
		background: string;
		opacity: number;
	}
): ValidationResult => {
	const issues: ValidationIssue[] = [];

	// Validate position
	const validPositions = ['top', 'center', 'bottom', 'left', 'right'];
	if (!validPositions.includes(overlaySettings.position)) {
		issues.push({
			type: 'error',
			message: `Invalid overlay position: ${overlaySettings.position}`
		});
	}

	// Validate background color
	if (overlaySettings.background) {
		// Basic color validation (hex, rgb, rgba, named colors)
		const colorRegex = /^(#([0-9A-Fa-f]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;
		if (!colorRegex.test(overlaySettings.background)) {
			issues.push({
				type: 'warning',
				message: 'Invalid background color format'
			});
		}
	}

	// Validate opacity
	if (overlaySettings.opacity < VALIDATION_RULES.minOverlayOpacity ||
		overlaySettings.opacity > VALIDATION_RULES.maxOverlayOpacity) {
		issues.push({
			type: 'warning',
			message: `Overlay opacity should be between ${VALIDATION_RULES.minOverlayOpacity} and ${VALIDATION_RULES.maxOverlayOpacity}`
		});
	}

	return {
		isValid: issues.length === 0,
		issues: issues.length > 0 ? issues : undefined
	};
};

/**
 * Get validation summary for display
 */
export const getValidationSummary = (validation: ValidationResult): string => {
	if (validation.isValid) {
		return 'Block validation passed';
	}

	const errorCount = validation.issues?.filter(issue => issue.type === 'error').length || 0;
	const warningCount = validation.issues?.filter(issue => issue.type === 'warning').length || 0;

	if (errorCount > 0) {
		return `${errorCount} error(s), ${warningCount} warning(s)`;
	}

	return `${warningCount} warning(s)`;
};

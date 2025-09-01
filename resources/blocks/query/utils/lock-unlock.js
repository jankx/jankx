/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Wrapper functions to access block editor functionality
 * Instead of using private APIs, we use public APIs
 */

// Get block editor settings
export function getBlockEditorSettings() {
	return select(blockEditorStore).getSettings();
}

// Update block editor settings
export function updateBlockEditorSettings(settings) {
	dispatch(blockEditorStore).updateSettings(settings);
}

// Get block types
export function getBlockTypes() {
	return select(blockEditorStore).getBlockTypes();
}

// Get block by client ID
export function getBlock(clientId) {
	return select(blockEditorStore).getBlock(clientId);
}

// Get blocks
export function getBlocks() {
	return select(blockEditorStore).getBlocks();
}

// Insert block
export function insertBlock(block, index) {
	return dispatch(blockEditorStore).insertBlock(block, index);
}

// Replace block
export function replaceBlock(clientId, block) {
	return dispatch(blockEditorStore).replaceBlock(clientId, block);
}

// Remove block
export function removeBlock(clientId) {
	return dispatch(blockEditorStore).removeBlock(clientId);
}

// Select block
export function selectBlock(clientId) {
	return dispatch(blockEditorStore).selectBlock(clientId);
}

// Multi select blocks
export function multiSelect(start, end) {
	return dispatch(blockEditorStore).multiSelect(start, end);
}

// Clear block selection
export function clearBlockSelection() {
	return dispatch(blockEditorStore).clearBlockSelection();
}

// Toggle block selection
export function toggleBlockSelection(clientId, isSelected) {
	return dispatch(blockEditorStore).toggleBlockSelection(clientId, isSelected);
}

// Replace inner blocks
export function replaceInnerBlocks(clientId, blocks, updateSelection) {
	return dispatch(blockEditorStore).replaceInnerBlocks(clientId, blocks, updateSelection);
}

// Update block attributes
export function updateBlockAttributes(clientId, attributes) {
	return dispatch(blockEditorStore).updateBlockAttributes(clientId, attributes);
}

// For backward compatibility, export empty lock/unlock functions
export const lock = () => {};
export const unlock = () => {};

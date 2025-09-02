/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useLayoutEffect, useEffect, useRef } from '@wordpress/element';
import { getBlobByURL, isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { useViewportMatch } from '@wordpress/compose';

interface UploadMediaArgs {
	url: string;
	allowedTypes?: string[];
	onChange: (media: any) => void;
	onError: (message: string) => void;
}

/**
 * Returns whether the current user can edit the given entity.
 *
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {string} recordId Record's id.
 */
export function useCanEditEntity(kind: string, name: string, recordId: string): boolean {
	return useSelect(
		(select) =>
			select(coreStore).canUser('update', {
				kind,
				name,
				id: recordId,
			}),
		[kind, name, recordId]
	);
}

/**
 * Handles uploading a media file from a blob URL on mount.
 *
 * @param {UploadMediaArgs} args Upload media arguments.
 */
export function useUploadMediaFromBlobURL(args: UploadMediaArgs = {} as UploadMediaArgs) {
	const latestArgsRef = useRef(args);
	const hasUploadStartedRef = useRef(false);
	const { getSettings } = useSelect(blockEditorStore);

	useLayoutEffect(() => {
		latestArgsRef.current = args;
	});

	useEffect(() => {
		// Uploading is a special effect that can't be canceled via the cleanup method.
		// The extra check avoids duplicate uploads in development mode (React.StrictMode).
		if (hasUploadStartedRef.current) {
			return;
		}
		if (
			!latestArgsRef.current.url ||
			!isBlobURL(latestArgsRef.current.url)
		) {
			return;
		}

		const file = getBlobByURL(latestArgsRef.current.url);
		if (!file) {
			return;
		}

		const { url, allowedTypes, onChange, onError } = latestArgsRef.current;
		const { mediaUpload } = getSettings();

		hasUploadStartedRef.current = true;

		mediaUpload({
			filesList: [file],
			allowedTypes,
			onFileChange: ([media]: any[]) => {
				if (isBlobURL(media?.url)) {
					return;
				}

				revokeBlobURL(url);
				onChange(media);
				hasUploadStartedRef.current = false;
			},
			onError: (message: string) => {
				revokeBlobURL(url);
				onError(message);
				hasUploadStartedRef.current = false;
			},
		});
	}, [getSettings]);
}

export function useToolsPanelDropdownMenuProps() {
	const isMobile = useViewportMatch('medium', '<');
	return !isMobile
		? {
				popoverProps: {
					placement: 'left-start',
					// For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
					offset: 259,
				},
		  }
		: {};
}

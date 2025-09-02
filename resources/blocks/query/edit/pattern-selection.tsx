/**
 * WordPress dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { Modal, SearchControl } from '@wordpress/components';
import {
	BlockContextProvider,
	store as blockEditorStore,
	__experimentalBlockPatternsList as BlockPatternsList,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	useBlockNameForPatterns,
	getTransformedBlocksFromPattern,
	usePatterns,
} from '../utils';
import { searchPatterns } from '../../utils/search-patterns';

interface PatternSelectionModalProps {
	clientId: string;
	attributes: any;
	setIsPatternSelectionModalOpen: ( isOpen: boolean ) => void;
}

interface PatternSelectionProps {
	clientId: string;
	attributes: any;
	showTitlesAsTooltip?: boolean;
	showSearch?: boolean;
}

export function PatternSelectionModal( {
	clientId,
	attributes,
	setIsPatternSelectionModalOpen,
}: PatternSelectionModalProps ) {
	return (
		<Modal
			overlayClassName="block-library-query-pattern__selection-modal"
			title={ __( 'Choose a pattern' ) }
			onRequestClose={ () => setIsPatternSelectionModalOpen( false ) }
			isFullScreen
		>
			<PatternSelection clientId={ clientId } attributes={ attributes } />
		</Modal>
	);
}

export function useBlockPatterns( clientId: string, attributes: any ) {
	const blockNameForPatterns = useBlockNameForPatterns(
		clientId,
		attributes
	);
	return usePatterns( clientId, blockNameForPatterns );
}

export default function PatternSelection( {
	clientId,
	attributes,
	showTitlesAsTooltip = false,
	showSearch = true,
}: PatternSelectionProps ) {
	const [ searchValue, setSearchValue ] = useState( '' );
	const { replaceBlock, selectBlock } = useDispatch( blockEditorStore );
	const blockPatterns = useBlockPatterns( clientId, attributes );
	/*
	 * When we preview Query Loop blocks we should prefer the current
	 * block's postType, which is passed through block context.
	 */
	const blockPreviewContext = useMemo(
		() => ( {
			previewPostType: attributes.query.postType,
		} ),
		[ attributes.query.postType ]
	);
	const filteredBlockPatterns = useMemo( () => {
		return searchPatterns( blockPatterns, searchValue );
	}, [ blockPatterns, searchValue ] );

	const onBlockPatternSelect = ( pattern: any, blocks: any ) => {
		const { newBlocks, queryClientIds } = getTransformedBlocksFromPattern(
			blocks,
			attributes
		);
		replaceBlock( clientId, newBlocks );
		if ( queryClientIds[ 0 ] ) {
			selectBlock( queryClientIds[ 0 ] );
		}
	};
	return (
		<div className="block-library-query-pattern__selection-content">
			{ showSearch && (
				<div className="block-library-query-pattern__selection-search">
					<SearchControl
						__nextHasNoMarginBottom
						onChange={ setSearchValue }
						value={ searchValue }
						label={ __( 'Search' ) }
						placeholder={ __( 'Search' ) }
					/>
				</div>
			) }
			<BlockContextProvider value={ blockPreviewContext }>
				<BlockPatternsList
					blockPatterns={ filteredBlockPatterns }
					onClickPattern={ onBlockPatternSelect }
					showTitlesAsTooltip={ showTitlesAsTooltip }
				/>
			</BlockContextProvider>
		</div>
	);
}

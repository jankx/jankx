/**
 * WordPress dependencies
 */
import {
	useBlockProps,
} from '@wordpress/block-editor';

interface SaveProps {
	attributes: {
		placeholder: string;
		showPostTypeFilter: boolean;
		postTypes: string[];
		showTaxonomyFilter: boolean;
		taxonomies: string[];
		enableAutoSuggestion: boolean;
		showPosts: boolean;
		showPostTypes: boolean;
		showUsers: boolean;
		showTaxonomy: boolean;
		showTags: boolean;
		suggestionLimit: number;
		iconPosition: string;
		showIcon: boolean;
		showLabel: boolean;
		labelText: string;
		buttonPosition: string;
		searchUrl: string;
	};
}

/**
 * The save function for the Smart Search Block.
 * Since this block is rendered entirely by JavaScript on the frontend,
 * we only save a wrapper div with data attributes.
 */
export default function Save(props: SaveProps) {
	const {
		placeholder,
		showPostTypeFilter,
		postTypes,
		showTaxonomyFilter,
		taxonomies,
		enableAutoSuggestion,
		showPosts,
		showPostTypes,
		showUsers,
		showTaxonomy,
		showTags,
		suggestionLimit,
		iconPosition,
		showIcon,
		showLabel,
		labelText,
		buttonPosition,
		searchUrl,
	} = props.attributes;

	const blockProps = useBlockProps.save({
		className: 'wp-block-jankx-smart-search',
	});

	return (
		<div
			{...blockProps}
			data-placeholder={placeholder}
			data-show-post-type-filter={showPostTypeFilter ? 'true' : 'false'}
			data-post-types={JSON.stringify(postTypes)}
			data-show-taxonomy-filter={showTaxonomyFilter ? 'true' : 'false'}
			data-taxonomies={JSON.stringify(taxonomies)}
			data-enable-auto-suggestion={enableAutoSuggestion ? 'true' : 'false'}
			data-show-posts={showPosts ? 'true' : 'false'}
			data-show-post-types={showPostTypes ? 'true' : 'false'}
			data-show-users={showUsers ? 'true' : 'false'}
			data-show-taxonomy={showTaxonomy ? 'true' : 'false'}
			data-show-tags={showTags ? 'true' : 'false'}
			data-suggestion-limit={suggestionLimit}
			data-icon-position={iconPosition}
			data-show-icon={showIcon ? 'true' : 'false'}
			data-show-label={showLabel ? 'true' : 'false'}
			data-label-text={labelText}
			data-button-position={buttonPosition}
			data-search-url={searchUrl || ''}
		/>
	);
}


/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	TextControl,
	CheckboxControl,
	RangeControl,
} from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
import metadata from './block.json';

interface SmartSearchAttributes {
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
	iconPosition: 'inside' | 'outside';
	showIcon: boolean;
	showLabel: boolean;
	labelText: string;
	buttonPosition: 'inside' | 'outside';
	searchUrl: string;
}

interface EditProps {
	attributes: SmartSearchAttributes;
	setAttributes: (attrs: Partial<SmartSearchAttributes>) => void;
	clientId: string;
}

function Edit({ attributes, setAttributes }: EditProps) {
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
	} = attributes;

	const [availablePostTypes, setAvailablePostTypes] = useState<Array<{ 
		label: string; 
		value: string; 
		taxonomies: Array<{ name: string; label: string }>;
	}>>([]);
	const [availableTaxonomies, setAvailableTaxonomies] = useState<Array<{ 
		label: string; 
		value: string;
		postTypes: Array<{ name: string; label: string }>;
	}>>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Get REST API base URL
				const restUrl = (window as any).wp?.apiSettings?.root || '/wp-json/';
				const namespace = 'jankx/v1';
				
				// Fetch post types with their taxonomies
				const postTypesResponse = await fetch(`${restUrl}${namespace}/smart-search/post-types`);
				if (postTypesResponse.ok) {
					const postTypesData = await postTypesResponse.json();
					const postTypesList = postTypesData.map((pt: any) => ({
						label: pt.label || pt.name,
						value: pt.name,
						taxonomies: pt.taxonomies || [],
					}));
					setAvailablePostTypes(postTypesList);
				}

				// Fetch taxonomies with their post types
				const taxonomiesResponse = await fetch(`${restUrl}${namespace}/smart-search/taxonomies`);
				if (taxonomiesResponse.ok) {
					const taxonomiesData = await taxonomiesResponse.json();
					const taxonomiesList = taxonomiesData.map((tax: any) => ({
						label: tax.label || tax.name,
						value: tax.name,
						postTypes: tax.post_types || [],
					}));
					setAvailableTaxonomies(taxonomiesList);
				}
			} catch (error) {
				console.error('Error fetching post types and taxonomies:', error);
				// Fallback to defaults
				setAvailablePostTypes([
					{ label: __('Posts', 'jankx'), value: 'post', taxonomies: [] },
					{ label: __('Pages', 'jankx'), value: 'page', taxonomies: [] },
				]);
				setAvailableTaxonomies([
					{ label: __('Categories', 'jankx'), value: 'category', postTypes: [] },
					{ label: __('Tags', 'jankx'), value: 'post_tag', postTypes: [] },
				]);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const blockProps = useBlockProps({
		className: 'wp-block-jankx-smart-search-editor',
	});

	const handlePostTypeChange = (value: string, checked: boolean) => {
		if (checked) {
			setAttributes({
				postTypes: [...postTypes, value],
			});
		} else {
			setAttributes({
				postTypes: postTypes.filter((pt) => pt !== value),
			});
		}
	};

	const handleTaxonomyChange = (value: string, checked: boolean) => {
		if (checked) {
			setAttributes({
				taxonomies: [...taxonomies, value],
			});
		} else {
			setAttributes({
				taxonomies: taxonomies.filter((tax) => tax !== value),
			});
		}
	};

	// Filter taxonomies based on selected post types
	const filteredTaxonomies = useMemo(() => {
		if (postTypes.length === 0) {
			return availableTaxonomies;
		}
		return availableTaxonomies.filter((tax) => {
			// Check if taxonomy is associated with any selected post type
			return tax.postTypes.some((pt) => postTypes.includes(pt.name));
		});
	}, [availableTaxonomies, postTypes]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Search Settings', 'jankx')} initialOpen={true}>
					<TextControl
						label={__('Placeholder', 'jankx')}
						value={placeholder}
						onChange={(value) => setAttributes({ placeholder: value || 'Search...' })}
					/>
					<TextControl
						label={__('Search URL', 'jankx')}
						value={searchUrl}
						onChange={(value) => setAttributes({ searchUrl: value })}
						help={__('Leave empty to use default WordPress search URL', 'jankx')}
					/>
				</PanelBody>

				<PanelBody title={__('Filter Options', 'jankx')} initialOpen={false}>
					<ToggleControl
						label={__('Show Post Type Filter', 'jankx')}
						checked={showPostTypeFilter}
						onChange={(value) => setAttributes({ showPostTypeFilter: value })}
					/>
					{showPostTypeFilter && (loading ? (
						<div style={{ marginTop: '10px', color: '#666' }}>{__('Loading post types...', 'jankx')}</div>
					) : availablePostTypes.length > 0 ? (
						<div style={{ marginTop: '10px' }}>
							<strong>{__('Post Types:', 'jankx')}</strong>
							{availablePostTypes.map((pt) => (
								<CheckboxControl
									key={pt.value}
									label={pt.label}
									checked={postTypes.includes(pt.value)}
									onChange={(checked) => handlePostTypeChange(pt.value, checked)}
								/>
							))}
						</div>
					) : (
						<div style={{ marginTop: '10px', color: '#666' }}>{__('No post types available', 'jankx')}</div>
					))}

					<ToggleControl
						label={__('Show Taxonomy Filter', 'jankx')}
						checked={showTaxonomyFilter}
						onChange={(value) => setAttributes({ showTaxonomyFilter: value })}
					/>
					{showTaxonomyFilter && (loading ? (
						<div style={{ marginTop: '10px', color: '#666' }}>{__('Loading taxonomies...', 'jankx')}</div>
					) : filteredTaxonomies.length > 0 ? (
						<div style={{ marginTop: '10px' }}>
							<strong>{__('Taxonomies:', 'jankx')}</strong>
							{postTypes.length > 0 && (
								<div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
									{__('Showing taxonomies for selected post types', 'jankx')}
								</div>
							)}
							{filteredTaxonomies.map((tax) => (
								<CheckboxControl
									key={tax.value}
									label={tax.label}
									checked={taxonomies.includes(tax.value)}
									onChange={(checked) => handleTaxonomyChange(tax.value, checked)}
								/>
							))}
						</div>
					) : (
						<div style={{ marginTop: '10px', color: '#666' }}>
							{postTypes.length > 0 
								? __('No taxonomies available for selected post types', 'jankx')
								: __('No taxonomies available', 'jankx')
							}
						</div>
					))}
				</PanelBody>

				<PanelBody title={__('Auto Suggestion', 'jankx')} initialOpen={false}>
					<ToggleControl
						label={__('Enable Auto Suggestion', 'jankx')}
						checked={enableAutoSuggestion}
						onChange={(value) => setAttributes({ enableAutoSuggestion: value })}
					/>
					{enableAutoSuggestion && (
						<>
							<RangeControl
								label={__('Suggestion Limit', 'jankx')}
								value={suggestionLimit}
								onChange={(value) => setAttributes({ suggestionLimit: value || 10 })}
								min={1}
								max={50}
							/>
							<div style={{ marginTop: '16px' }}>
								<strong>{__('Show in Suggestions:', 'jankx')}</strong>
								{availablePostTypes.length > 0 && (
									<>
										<CheckboxControl
											label={__('Posts', 'jankx')}
											checked={showPosts}
											onChange={(value) => setAttributes({ showPosts: value })}
										/>
										<div style={{ fontSize: '12px', color: '#666', marginLeft: '24px', marginTop: '-8px' }}>
											{__('From post types:', 'jankx')} {availablePostTypes.map(pt => pt.label).join(', ')}
										</div>
									</>
								)}
								{availablePostTypes.length > 0 && (
									<CheckboxControl
										label={__('Post Types', 'jankx')}
										checked={showPostTypes}
										onChange={(value) => setAttributes({ showPostTypes: value })}
									/>
								)}
								<CheckboxControl
									label={__('Users', 'jankx')}
									checked={showUsers}
									onChange={(value) => setAttributes({ showUsers: value })}
								/>
								{filteredTaxonomies.length > 0 && (
									<>
										<CheckboxControl
											label={__('Taxonomy Terms', 'jankx')}
											checked={showTaxonomy}
											onChange={(value) => setAttributes({ showTaxonomy: value })}
										/>
										<div style={{ fontSize: '12px', color: '#666', marginLeft: '24px', marginTop: '-8px' }}>
											{__('From taxonomies:', 'jankx')} {filteredTaxonomies.map(tax => tax.label).join(', ')}
										</div>
									</>
								)}
								{filteredTaxonomies.some(tax => tax.value === 'post_tag') && (
									<CheckboxControl
										label={__('Tags', 'jankx')}
										checked={showTags}
										onChange={(value) => setAttributes({ showTags: value })}
									/>
								)}
							</div>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Display Options', 'jankx')} initialOpen={false}>
					<ToggleControl
						label={__('Show Label', 'jankx')}
						checked={showLabel}
						onChange={(value) => setAttributes({ showLabel: value })}
					/>
					{showLabel && (
						<TextControl
							label={__('Label Text', 'jankx')}
							value={labelText}
							onChange={(value) => setAttributes({ labelText: value || 'Search' })}
						/>
					)}
					<ToggleControl
						label={__('Show Icon', 'jankx')}
						checked={showIcon}
						onChange={(value) => setAttributes({ showIcon: value })}
					/>
					{showIcon && (
						<SelectControl
							label={__('Icon Position', 'jankx')}
							value={iconPosition}
							options={[
								{ label: __('Inside Input', 'jankx'), value: 'inside' },
								{ label: __('Outside Input', 'jankx'), value: 'outside' },
							]}
							onChange={(value) => setAttributes({ iconPosition: value as 'inside' | 'outside' })}
						/>
					)}
					<SelectControl
						label={__('Button Position', 'jankx')}
						value={buttonPosition}
						options={[
							{ label: __('Inside Input', 'jankx'), value: 'inside' },
							{ label: __('Outside Input', 'jankx'), value: 'outside' },
						]}
						onChange={(value) => setAttributes({ buttonPosition: value as 'inside' | 'outside' })}
						help={__('Search button will always appear at the end of the layout', 'jankx')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="smart-search-form-preview">
					{showLabel && (
						<label className="search-label">{labelText}</label>
					)}
					<div className={`search-input-wrapper ${iconPosition === 'inside' ? 'icon-inside' : 'icon-outside'} ${buttonPosition === 'inside' ? 'button-inside' : 'button-outside'}`}>
						{showIcon && iconPosition === 'outside' && (
							<span className="search-icon-outside">🔍</span>
						)}
						<div className="search-filters-wrapper">
							{showPostTypeFilter && (
								<select className="post-type-filter" disabled>
									<option>{__('All Post Types', 'jankx')}</option>
								</select>
							)}
							{showTaxonomyFilter && (
								<select className="taxonomy-filter" disabled>
									<option>{__('All Taxonomies', 'jankx')}</option>
								</select>
							)}
						</div>
						<div className="search-input-inner">
							{showIcon && iconPosition === 'inside' && (
								<span className="search-icon-inside">🔍</span>
							)}
							<input
								type="text"
								className="search-input"
								placeholder={placeholder}
								disabled
							/>
							{buttonPosition === 'inside' && (
								<button type="submit" className="search-button">
									{__('Search', 'jankx')}
								</button>
							)}
						</div>
						{buttonPosition === 'outside' && (
							<button type="submit" className="search-button">
								{__('Search', 'jankx')}
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default Edit;


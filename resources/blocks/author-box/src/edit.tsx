import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
	Spinner
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import type { AuthorBoxEditProps } from './types';
import './editor.scss';

export default function Edit({ attributes, setAttributes }: AuthorBoxEditProps): JSX.Element {
	const {
		authorId,
		showAvatar,
		avatarSize,
		showBio,
		showSocial,
		showPosts,
		postsCount,
		layout
	} = attributes;

	const blockProps = useBlockProps({
		className: `wp-block-jankx-author-box layout-${layout}`
	});

	// Get current post author or current user
	const { author, posts } = useSelect((select) => {
		let currentAuthorId = authorId;
		
		if (currentAuthorId === 0) {
			// Try to get post author first
			const post = select('core/editor')?.getCurrentPost();
			if (post?.author) {
				currentAuthorId = post.author;
			} else {
				// Fallback to current user
				currentAuthorId = select('core')?.getCurrentUser()?.id || 0;
			}
		}

		const authorData = currentAuthorId ? select('core')?.getUser(currentAuthorId) : null;
		
		// Get author posts if needed
		const authorPosts = showPosts && currentAuthorId ? 
			select('core')?.getEntityRecords('postType', 'post', {
				author: currentAuthorId,
				per_page: postsCount,
				status: 'publish'
			}) : [];

		return {
			author: authorData,
			posts: authorPosts || []
		};
	}, [authorId, showPosts, postsCount]);

	const layoutOptions = [
		{ label: __('Horizontal', 'jankx'), value: 'horizontal' },
		{ label: __('Vertical', 'jankx'), value: 'vertical' }
	];

	if (!author) {
		return (
			<div {...blockProps}>
				<InspectorControls>
					<PanelBody title={__('Author Box Settings', 'jankx')} initialOpen={true}>
						<SelectControl
							label={__('Layout', 'jankx')}
							value={layout}
							options={layoutOptions}
							onChange={(value: string) => setAttributes({ layout: value as AuthorBoxEditProps['attributes']['layout'] })}
						/>
					</PanelBody>
				</InspectorControls>
				<p>{__('Loading author data...', 'jankx')}</p>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Author Box Settings', 'jankx')} initialOpen={true}>
					<SelectControl
						label={__('Layout', 'jankx')}
						value={layout}
						options={layoutOptions}
						onChange={(value: string) => setAttributes({ layout: value as AuthorBoxEditProps['attributes']['layout'] })}
					/>

					<ToggleControl
						label={__('Show Avatar', 'jankx')}
						checked={showAvatar}
						onChange={(value: boolean) => setAttributes({ showAvatar: value })}
					/>

					{showAvatar && (
						<RangeControl
							label={__('Avatar Size (px)', 'jankx')}
							value={avatarSize}
							onChange={(value: number) => setAttributes({ avatarSize: value })}
							min={40}
							max={200}
							step={10}
						/>
					)}

					<ToggleControl
						label={__('Show Bio', 'jankx')}
						checked={showBio}
						onChange={(value: boolean) => setAttributes({ showBio: value })}
					/>

					<ToggleControl
						label={__('Show Social Links', 'jankx')}
						checked={showSocial}
						onChange={(value: boolean) => setAttributes({ showSocial: value })}
					/>

					<ToggleControl
						label={__('Show Recent Posts', 'jankx')}
						checked={showPosts}
						onChange={(value: boolean) => setAttributes({ showPosts: value })}
					/>

					{showPosts && (
						<RangeControl
							label={__('Number of Posts', 'jankx')}
							value={postsCount}
							onChange={(value: number) => setAttributes({ postsCount: value })}
							min={1}
							max={10}
							step={1}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			{showAvatar && (
				<div className="author-avatar">
					<img 
						src={author.avatar_urls?.['96'] || author.avatar_urls?.['48'] || ''} 
						alt={author.name}
						style={{ width: avatarSize, height: avatarSize }}
					/>
				</div>
			)}

			<div className="author-info">
				<h3 className="author-name">
					<a href={author.link || '#'}>{author.name}</a>
				</h3>

				{showBio && author.description && (
					<div className="author-bio" dangerouslySetInnerHTML={{ __html: author.description }} />
				)}

				{showSocial && (
					<div className="author-social">
						{/* Social links placeholder - will be rendered by PHP on frontend */}
						<span style={{ fontSize: '0.875rem', color: '#666' }}>
							{__('Social links will appear here', 'jankx')}
						</span>
					</div>
				)}

				{showPosts && posts.length > 0 && (
					<div className="author-posts">
						<h4 className="posts-title">{__('Recent Posts', 'jankx')}</h4>
						<ul className="posts-list">
							{posts.map((post: any) => (
								<li key={post.id}>
									<a href={post.link}>{post.title.rendered}</a>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

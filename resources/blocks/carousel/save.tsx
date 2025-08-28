import { useBlockProps, useInnerBlocksProps, RichText } from '@wordpress/block-editor';

import { BLOCK_CLASS_NAME } from './constants';
import {
	TITLE_TAG,
	HAS_TITLE_DEFAULT,
	HAS_DESCRIPTION_DEFAULT,
	SLIDES_PER_VIEW_DEFAULT,
	SPACE_BETWEEN_DEFAULT,
	ALLOW_PAGINATION,
	HAS_PAGINATION_DEFAULT,
	ALLOW_NAVIGATION,
	HAS_NAVIGATION_DEFAULT,
	ALLOW_AUTOPLAY,
	AUTOPLAY_DEFAULT,
	ALLOW_LOOP,
	LOOP_DEFAULT,
} from './constants/editor';

export default function save({ attributes }: any) {
	const {
		hasTitle = HAS_TITLE_DEFAULT,
		title,
		hasDescription = HAS_DESCRIPTION_DEFAULT,
		description,
		slidesPerView = SLIDES_PER_VIEW_DEFAULT,
		spaceBetween = SPACE_BETWEEN_DEFAULT,
		hasPagination = HAS_PAGINATION_DEFAULT,
		hasNavigation = HAS_NAVIGATION_DEFAULT,
		shouldAutoplay = AUTOPLAY_DEFAULT,
		shouldLoop = LOOP_DEFAULT,
	} = attributes;

	return (
		<div
			{...useBlockProps.save({
				className: BLOCK_CLASS_NAME,
			})}
		>
			<div className={`${BLOCK_CLASS_NAME}__header`}>
				{hasTitle && <RichText.Content tagName={TITLE_TAG} className={`${BLOCK_CLASS_NAME}__title`} value={title} />}
				{hasDescription && (
					<RichText.Content
						tagName="div"
						multiline="p"
						value={description}
						className={`${BLOCK_CLASS_NAME}__description`}
					/>
				)}
			</div>
			<div
				className="swiper"
				data-slides-per-view={slidesPerView}
				data-space-between={spaceBetween}
				{...(ALLOW_PAGINATION && { 'data-has-pagination': hasPagination })}
				{...(ALLOW_NAVIGATION && { 'data-has-navigation': hasNavigation })}
				{...(ALLOW_AUTOPLAY && { 'data-should-autoplay': shouldAutoplay })}
				{...(ALLOW_LOOP && { 'data-should-loop': shouldLoop })}
			>
				<div
					{...useInnerBlocksProps.save({
						className: 'swiper-wrapper',
					})}
				/>
				{ALLOW_PAGINATION && hasPagination === 'true' && <div className="swiper-pagination" />}
				{ALLOW_NAVIGATION && hasNavigation === 'true' && (
					<>
						<div className="swiper-button-prev" />
						<div className="swiper-button-next" />
					</>
				)}
			</div>
		</div>
	);
}

import { BlockEditProps } from '@wordpress/blocks';

export interface AuthorBoxAttributes {
	authorId: number;
	showAvatar: boolean;
	avatarSize: number;
	showBio: boolean;
	showSocial: boolean;
	showPosts: boolean;
	postsCount: number;
	layout: 'horizontal' | 'vertical';
}

export interface AuthorBoxEditProps extends BlockEditProps<AuthorBoxAttributes> {
	// Additional props if needed
}

export interface AuthorData {
	id: number;
	name: string;
	email: string;
	url: string;
	description: string;
	avatar: string;
	posts_url: string;
	posts_count: number;
}

export interface SocialLink {
	platform: string;
	url: string;
	icon: string;
}

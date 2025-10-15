import { BlockEditProps } from '@wordpress/blocks';

export interface TableOfContentAttributes {
	title: string;
	showTitle: boolean;
	titleLevel: number;
	minLevel: number;
	maxLevel: number;
	markerStyle: 'list' | 'numbers' | 'circles' | 'roman' | 'plus-minus';
	useNumbers: boolean;
	removeIndent: boolean;
	smoothScroll: boolean;
	absoluteUrls: boolean;
}

export interface TableOfContentEditProps extends BlockEditProps<TableOfContentAttributes> {
	// Additional props if needed
}

export interface HeadingData {
	level: number;
	text: string;
	id: string;
}

export interface MarkerStyleOption {
	label: string;
	value: TableOfContentAttributes['markerStyle'];
}

/**
 * Pure helpers shared by the checkbox/radio style blocks inside
 * `jankx/advanced-filter`. Kept free of WordPress component imports so the
 * mapping can be unit tested on its own.
 */

export const FILTER_STYLE_BLOCKS = [
	'jankx/filter-checkbox',
	'jankx/filter-radio',
];

export const FILTER_STYLE_CLASS = 'jankx-filter-box-styled';

/**
 * Filter types whose "Checkboxes" display style renders real checkbox/radio
 * inputs (the other renderers draw buttons, selects or a keyword field).
 */
export const CHECKBOX_STYLE_FILTER_TYPES = [ 'taxonomy', 'post_types' ];

export type FilterBoxAttributes = {
	size?: number;
	radius?: number;
	borderWidth?: number;
	borderColor?: string;
	checkedColor?: string;
	gap?: number;
};

export type FilterStyleType = 'checkbox' | 'radio';

const PX_ATTRIBUTES = [ 'size', 'borderWidth', 'radius', 'gap' ];

function toKebabCase( value: string ): string {
	return value.replace( /[A-Z]/g, ( letter ) => '-' + letter.toLowerCase() );
}

/**
 * Map block attributes onto the custom properties the stylesheet consumes.
 * `radius` is skipped for radios, which are always drawn as circles.
 *
 * @param  attributes
 * @param  type
 */
export function buildFilterBoxVars(
	attributes: FilterBoxAttributes,
	type: FilterStyleType
): Record< string, string > {
	const keys: ( keyof FilterBoxAttributes )[] =
		type === 'radio'
			? [ 'size', 'borderWidth', 'borderColor', 'checkedColor', 'gap' ]
			: [
					'size',
					'radius',
					'borderWidth',
					'borderColor',
					'checkedColor',
					'gap',
			  ];

	const vars: Record< string, string > = {};
	keys.forEach( ( key ) => {
		const value = attributes[ key ];
		if ( value === undefined || value === null || value === '' ) {
			return;
		}
		vars[ `--jankx-filter-box-${ toKebabCase( key as string ) }` ] =
			PX_ATTRIBUTES.indexOf( key as string ) !== -1
				? `${ value }px`
				: String( value );
	} );
	return vars;
}

/**
 * Which style block belongs in the filter, or null when the display style
 * renders something other than a checkbox/radio list.
 *
 * @param  filterType
 * @param  displayStyle
 * @param  multipleSelection
 */
export function desiredFilterStyleBlock(
	filterType: string,
	displayStyle: string,
	multipleSelection: boolean
): string | null {
	if ( CHECKBOX_STYLE_FILTER_TYPES.indexOf( filterType ) === -1 ) {
		return null;
	}
	if ( displayStyle !== 'checkboxes' ) {
		return null;
	}
	// Post types are single-select by design: the server pipeline takes one
	// string, so that renderer always draws radios.
	if ( filterType === 'post_types' ) {
		return 'jankx/filter-radio';
	}
	return multipleSelection ? 'jankx/filter-checkbox' : 'jankx/filter-radio';
}

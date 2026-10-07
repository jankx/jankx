import {
	FILTER_STYLE_BLOCKS,
	buildFilterBoxVars,
	desiredFilterStyleBlock,
} from '../vars';

describe( 'FILTER_STYLE_BLOCKS', () => {
	it( 'contains the checkbox and radio style blocks', () => {
		expect( FILTER_STYLE_BLOCKS ).toEqual( [
			'jankx/filter-checkbox',
			'jankx/filter-radio',
		] );
	} );
} );

describe( 'desiredFilterStyleBlock', () => {
	it( 'uses the checkbox block for a multi taxonomy filter', () => {
		expect(
			desiredFilterStyleBlock( 'taxonomy', 'checkboxes', true )
		).toBe( 'jankx/filter-checkbox' );
	} );

	it( 'uses the radio block for a single taxonomy filter', () => {
		expect(
			desiredFilterStyleBlock( 'taxonomy', 'checkboxes', false )
		).toBe( 'jankx/filter-radio' );
	} );

	it( 'always uses the radio block for post types', () => {
		expect(
			desiredFilterStyleBlock( 'post_types', 'checkboxes', true )
		).toBe( 'jankx/filter-radio' );
		expect(
			desiredFilterStyleBlock( 'post_types', 'checkboxes', false )
		).toBe( 'jankx/filter-radio' );
	} );

	it.each( [ 'buttons', 'dropdown', 'select', 'tabs' ] )(
		'returns null for the %s display style',
		( displayStyle ) => {
			expect(
				desiredFilterStyleBlock( 'taxonomy', displayStyle, true )
			).toBeNull();
		}
	);

	it( 'returns null for filter types without a checkbox list', () => {
		expect(
			desiredFilterStyleBlock( 'keyword', 'checkboxes', true )
		).toBeNull();
	} );
} );

describe( 'buildFilterBoxVars', () => {
	const attributes = {
		size: 20,
		radius: 6,
		borderWidth: 1.5,
		borderColor: '#333333',
		checkedColor: '#ff0000',
		gap: 10,
	};

	it( 'maps every checkbox attribute onto a custom property', () => {
		expect( buildFilterBoxVars( attributes, 'checkbox' ) ).toEqual( {
			'--jankx-filter-box-size': '20px',
			'--jankx-filter-box-radius': '6px',
			'--jankx-filter-box-border-width': '1.5px',
			'--jankx-filter-box-border-color': '#333333',
			'--jankx-filter-box-checked-color': '#ff0000',
			'--jankx-filter-box-gap': '10px',
		} );
	} );

	it( 'leaves the radius out for radios', () => {
		expect( buildFilterBoxVars( attributes, 'radio' ) ).not.toHaveProperty(
			'--jankx-filter-box-radius'
		);
	} );

	it( 'skips attributes that were not set', () => {
		expect( buildFilterBoxVars( { size: 18 }, 'checkbox' ) ).toEqual( {
			'--jankx-filter-box-size': '18px',
		} );
	} );
} );

/**
 * Shared editor code for the checkbox / radio style blocks that live inside
 * `jankx/advanced-filter`.
 *
 * The blocks render nothing on the frontend: `AdvancedFilterBlock` reads their
 * attributes and turns them into CSS custom properties on the filter wrapper,
 * so every real `<input type="checkbox|radio">` the renderer outputs inherits
 * them. The editor mirrors the same custom properties onto the parent filter
 * wrapper so the server rendered preview updates live.
 *
 * The pure attribute/selection helpers live in `./vars` so they can be unit
 * tested without loading WordPress components.
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { ColorPalette, PanelBody, RangeControl } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { FILTER_STYLE_CLASS, buildFilterBoxVars } from './vars';
import type { FilterBoxAttributes, FilterStyleType } from './vars';

export * from './vars';

interface FilterStyleEditProps {
	attributes: FilterBoxAttributes;
	setAttributes: ( attributes: Partial< FilterBoxAttributes > ) => void;
	clientId: string;
	type: FilterStyleType;
}

export function FilterStyleEdit( {
	attributes,
	setAttributes,
	type,
}: FilterStyleEditProps ) {
	const isRadio = type === 'radio';
	const blockProps = useBlockProps( {
		className: `jankx-filter-style-block jankx-filter-style-block--${ type }`,
	} );
	const previewRef = useRef< HTMLDivElement | null >( null );
	const vars = buildFilterBoxVars( attributes, type );
	const varsKey = JSON.stringify( vars );
	const varsRef = useRef( vars );
	varsRef.current = vars;

	// Mirror the style onto the parent filter wrapper. The server side render
	// preview is produced without inner blocks, so this is what keeps it in
	// sync while the author drags the controls.
	useEffect( () => {
		const preview = previewRef.current;
		if ( ! preview ) {
			return;
		}
		const ownWrapper = preview.closest( '[data-block]' );
		const filterWrapper =
			ownWrapper?.parentElement?.closest( '[data-block]' ) ?? null;
		if ( ! filterWrapper ) {
			return;
		}

		const current = varsRef.current;
		filterWrapper.classList.add( FILTER_STYLE_CLASS );
		Object.keys( current ).forEach( ( name ) => {
			filterWrapper.style.setProperty( name, current[ name ] );
		} );

		return () => {
			filterWrapper.classList.remove( FILTER_STYLE_CLASS );
			Object.keys( current ).forEach( ( name ) => {
				filterWrapper.style.removeProperty( name );
			} );
		};
	}, [ varsKey ] );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Box Style', 'jankx' ) }
					initialOpen={ true }
				>
					<RangeControl
						label={ __( 'Size', 'jankx' ) }
						value={ attributes.size ?? 18 }
						min={ 10 }
						max={ 32 }
						step={ 1 }
						onChange={ ( size ) =>
							setAttributes( { size: size ?? 18 } )
						}
						__nextHasNoMarginBottom={ true }
					/>
					{ ! isRadio && (
						<RangeControl
							label={ __( 'Corner radius', 'jankx' ) }
							value={ attributes.radius ?? 4 }
							min={ 0 }
							max={ 16 }
							step={ 1 }
							onChange={ ( radius ) =>
								setAttributes( { radius: radius ?? 0 } )
							}
							__nextHasNoMarginBottom={ true }
						/>
					) }
					<RangeControl
						label={ __( 'Border width', 'jankx' ) }
						value={ attributes.borderWidth ?? 1.5 }
						min={ 0 }
						max={ 4 }
						step={ 0.5 }
						onChange={ ( borderWidth ) =>
							setAttributes( { borderWidth: borderWidth ?? 0 } )
						}
						__nextHasNoMarginBottom={ true }
					/>
					<ColorPalette
						label={ __( 'Border color', 'jankx' ) }
						value={ attributes.borderColor || '' }
						onChange={ ( borderColor ) =>
							setAttributes( {
								borderColor: borderColor || '#8c8f94',
							} )
						}
						disableCustomColors={ false }
					/>
					<ColorPalette
						label={ __( 'Checked color', 'jankx' ) }
						value={ attributes.checkedColor || '' }
						onChange={ ( checkedColor ) =>
							setAttributes( {
								checkedColor: checkedColor || '#503AA8',
							} )
						}
						disableCustomColors={ false }
					/>
					<RangeControl
						label={ __( 'Gap to label', 'jankx' ) }
						value={ attributes.gap ?? 8 }
						min={ 0 }
						max={ 24 }
						step={ 1 }
						onChange={ ( gap ) =>
							setAttributes( { gap: gap ?? 8 } )
						}
						__nextHasNoMarginBottom={ true }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="jankx-filter-style-preview" ref={ previewRef }>
					<input type={ type } defaultChecked readOnly={ true } />
					<span>
						{ isRadio
							? __( 'Radio', 'jankx' )
							: __( 'Checkbox', 'jankx' ) }
					</span>
				</div>
			</div>
		</>
	);
}

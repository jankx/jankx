/**
 * Normalize a colour attribute into the `#rrggbb` form a native
 * `<input type="color">` requires.
 *
 * The attributes themselves may legitimately hold values a native colour input
 * cannot represent: `#rgba`/`#rrggbbaa` with alpha, and `rgb()`/`rgba()`
 * functions. Browsers silently reset such a value to `#000000`, which loses the
 * colour the author actually picked, so the swatch is fed the equivalent opaque
 * hex instead. The stored attribute is left untouched, so alpha still works
 * wherever it is applied.
 *
 * Anything unrecognised falls back rather than passing an invalid value to the
 * input.
 */
export function normalizeHexColor( value: unknown, fallback: string ): string {
    const raw = String( value ?? '' ).trim().toLowerCase();

    if ( /^#[0-9a-f]{6}$/.test( raw ) ) {
        return raw;
    }

    if ( /^#[0-9a-f]{3}$/.test( raw ) ) {
        return `#${raw[ 1 ]}${raw[ 1 ]}${raw[ 2 ]}${raw[ 2 ]}${raw[ 3 ]}${raw[ 3 ]}`;
    }

    // #rgba and #rrggbbaa: drop the alpha pair, since the input has no alpha
    // channel to represent it with.
    if ( /^#[0-9a-f]{4}$/.test( raw ) ) {
        return `#${raw[ 1 ]}${raw[ 1 ]}${raw[ 2 ]}${raw[ 2 ]}${raw[ 3 ]}${raw[ 3 ]}`;
    }

    if ( /^#[0-9a-f]{8}$/.test( raw ) ) {
        return raw.slice( 0, 7 );
    }

    const rgbMatch = raw.match(
        /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/
    );
    if ( rgbMatch ) {
        const toHex = ( part: string | undefined ) => {
            const num = Math.max(
                0,
                Math.min( 255, Math.round( parseFloat( part as string ) ) )
            );
            return num.toString( 16 ).padStart( 2, '0' );
        };

        return `#${toHex( rgbMatch[ 1 ] )}${toHex( rgbMatch[ 2 ] )}${toHex(
            rgbMatch[ 3 ]
        )}`;
    }

    return fallback;
}

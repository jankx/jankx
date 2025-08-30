/**
 * Updates the link attributes based on the provided values.
 *
 * @param {Object} attributes - The current attributes.
 * @param {string} attributes.rel - The current rel attribute.
 * @param {string} attributes.url - The new URL.
 * @param {boolean} attributes.opensInNewTab - Whether the link opens in a new tab.
 * @param {boolean} attributes.nofollow - Whether the link should be marked as nofollow.
 * @return {Object} The updated attributes.
 */
export function getUpdatedLinkAttributes( {
        rel,
        url,
        opensInNewTab,
        nofollow,
}: {
        rel?: string;
        url?: string;
        opensInNewTab?: boolean;
        nofollow?: boolean;
} ) {
        const newRel = [];

        if ( rel ) {
                newRel.push( rel );
        }

        if ( nofollow ) {
                newRel.push( 'nofollow' );
        }

        return {
                url,
                linkTarget: opensInNewTab ? '_blank' : undefined,
                rel: newRel.length > 0 ? newRel.join( ' ' ) : undefined,
        };
}

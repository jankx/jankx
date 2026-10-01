/**
 * Jest unit-test config.
 *
 * Extends the @wordpress/scripts default config. Jest does not transform
 * anything under node_modules, but a few packages that @wordpress/* pulls in
 * transitively (e.g. `memize`, which backs `@wordpress/i18n`) publish
 * ESM-only builds, so they have to be handed to babel like our own sources.
 */

/**
 * Dependencies that ship untranspiled ESM and are resolved through node_modules.
 *
 * @type {string[]}
 */
const esmOnlyPackages = [ 'memize' ];

const wpScriptsConfig = require( '@wordpress/scripts/config/jest-unit.config.js' );

module.exports = {
    ...wpScriptsConfig,
    transformIgnorePatterns: [
        // The leading `.*` is required: a pnpm store path contains several
        // `/node_modules/` segments, and the lookahead has to look past all of
        // them to find the package name.
        `/node_modules/(?!.*(${ esmOnlyPackages.join( '|' ) }))`,
    ],
};

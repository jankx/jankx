/**
 * Jest unit-test config.
 *
 * Extends the @wordpress/scripts default config so the unit tests can resolve
 * everything the webpack build already handles.
 */

const path = require( 'path' );

/**
 * Dependencies that publish both ESM and CommonJS builds and are reached
 * through the pnpm virtual store. Jest 26's resolver predates the `exports`
 * field and picks the ESM entry, which it then refuses to run because
 * node_modules is not transformed. Mapping them to their CommonJS build keeps
 * them loadable without transforming the whole dependency tree.
 *
 * @type {string[]}
 */
const dualPackageDependencies = [ '@tannin/sprintf', 'memize' ];

/**
 * @return {Record<string, string>} module specifier -> absolute CommonJS path
 */
function mapToCommonJsBuild() {
    return Object.fromEntries(
        dualPackageDependencies.map( ( name ) => {
            try {
                return [ `^${ name }$`, require.resolve( name ) ];
            } catch ( error ) {
                // A package that cannot be resolved should not break the config.
                return [];
            }
        } )
    );
}

const wpScriptsConfig = require( '@wordpress/scripts/config/jest-unit.config.js' );

module.exports = {
    ...wpScriptsConfig,
    moduleNameMapper: {
        ...( wpScriptsConfig.moduleNameMapper || {} ),
        ...mapToCommonJsBuild(),
    },
    modulePaths: [
        // The @jankx controls live in ../vendor, outside this directory tree, so
        // their `@wordpress/*` imports would never resolve by walking up from
        // there. This mirrors the `modules` entry in webpack.config.js.
        path.resolve( __dirname, 'node_modules' ),
        '<rootDir>',
    ],
};

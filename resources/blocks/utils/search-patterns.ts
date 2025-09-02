/**
 * External dependencies
 */
import removeAccents from 'remove-accents';

interface Pattern {
	title: string;
	[name: string]: any;
}

/**
 * Sanitizes the search input string.
 *
 * @param {string} input The search input to normalize.
 *
 * @return {string} The normalized search input.
 */
export function normalizeSearchInput( input: string = '' ): string {
	// Disregard diacritics.
	input = removeAccents( input );

	// Trim & Lowercase.
	input = input.trim().toLowerCase();

	return input;
}

/**
 * Get the search rank for a given pattern and a specific search term.
 *
 * @param {Pattern} pattern     Pattern to rank
 * @param {string} searchValue Search term
 * @return {number} A pattern search rank
 */
export function getPatternSearchRank( pattern: Pattern, searchValue: string ): number {
	const normalizedSearchValue = normalizeSearchInput( searchValue );
	const normalizedTitle = normalizeSearchInput( pattern.title );

	let rank = 0;

	if ( normalizedSearchValue === normalizedTitle ) {
		rank += 30;
	} else if ( normalizedTitle.startsWith( normalizedSearchValue ) ) {
		rank += 20;
	} else {
		const searchTerms = normalizedSearchValue.split( ' ' );
		const hasMatchedTerms = searchTerms.every( ( searchTerm ) =>
			normalizedTitle.includes( searchTerm )
		);

		// Prefer pattern with every search word in the title.
		if ( hasMatchedTerms ) {
			rank += 10;
		}
	}

	return rank;
}

/**
 * Filters an pattern list given a search term.
 *
 * @param {Pattern[]} patterns    Item list
 * @param {string}   searchValue Search input.
 *
 * @return {Pattern[]} Filtered pattern list.
 */
export function searchPatterns( patterns: Pattern[] = [], searchValue: string = '' ): Pattern[] {
	if ( ! searchValue ) {
		return patterns;
	}

	const rankedPatterns = patterns
		.map( ( pattern ) => {
			return [ pattern, getPatternSearchRank( pattern, searchValue ) ] as [Pattern, number];
		} )
		.filter( ( [ , rank ] ) => rank > 0 );

	rankedPatterns.sort( ( [ , rank1 ], [ , rank2 ] ) => rank2 - rank1 );
	return rankedPatterns.map( ( [ pattern ] ) => pattern );
}

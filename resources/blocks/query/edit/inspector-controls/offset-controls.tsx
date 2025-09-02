/**
 * WordPress dependencies
 */
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

interface OffsetControlProps {
	offset?: number;
	onChange: (query: { offset: number }) => void;
}

const MIN_OFFSET = 0;
const MAX_OFFSET = 100;

export const OffsetControl = ({ offset = 0, onChange }: OffsetControlProps) => {
	return (
		<NumberControl
			__next40pxDefaultSize
			label={__('Offset')}
			value={offset}
			min={MIN_OFFSET}
			onChange={(newOffset) => {
				if (
					isNaN(newOffset) ||
					newOffset < MIN_OFFSET ||
					newOffset > MAX_OFFSET
				) {
					return;
				}
				onChange({ offset: newOffset });
			}}
		/>
	);
};

export default OffsetControl;

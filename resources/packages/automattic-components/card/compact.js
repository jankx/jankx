import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import Card from '.';
const CompactCard = forwardRef((props, ref) => (_jsx(Card, { ...props, compact: true, ref: ref })));
CompactCard.displayName = 'CompactCard';
export default CompactCard;
//# sourceMappingURL=compact.js.map
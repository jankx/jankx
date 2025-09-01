import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslate } from 'i18n-calypso';
import { Badge } from '../../../.';
import './style.scss';
const BadgeNew = () => {
    const translate = useTranslate();
    return (_jsx(Badge, { type: "success", className: "stats-card__badge--success", children: translate('New') }));
};
export default BadgeNew;
//# sourceMappingURL=index.js.map
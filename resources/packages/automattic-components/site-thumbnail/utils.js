import { colord } from 'colord';
export function getTextColorFromBackground(backgroundColor) {
    return colord(backgroundColor).isLight() ? '#000' : '#fff';
}
//# sourceMappingURL=utils.js.map
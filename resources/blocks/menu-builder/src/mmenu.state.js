/*!
 * mmenu.js - State Management Version
 * mmenujs.com
 *
 * Copyright (c) Fred Heusschen
 * frebsite.nl
 */

//	Core - State Management Version
import MmenuState from './core/oncanvas/mmenu.oncanvas.state';

//	Core add-ons
import offcanvas from './core/offcanvas/mmenu.offcanvas';
import scrollBugFix from './core/scrollbugfix/mmenu.scrollbugfix';
import theme from './core/theme/mmenu.theme';

//	Add-ons
import backButton from './addons/backbutton/mmenu.backbutton';
import counters from './addons/counters/mmenu.counters';
import iconbar from './addons/iconbar/mmenu.iconbar';
import iconPanels from './addons/iconpanels/mmenu.iconpanels';
import navbars from './addons/navbars/mmenu.navbars';
import pageScroll from './addons/pagescroll/mmenu.pagescroll';
import searchfield from './addons/searchfield/mmenu.searchfield';
import sectionIndexer from './addons/sectionindexer/mmenu.sectionindexer';
import setSelected from './addons/setselected/mmenu.setselected';
import sidebar from './addons/sidebar/mmenu.sidebar';

MmenuState.addons = {
    //	Core add-ons
    offcanvas,
    scrollBugFix,
    theme,

    //	Add-ons
    backButton,
    counters,
    iconbar,
    iconPanels,
    navbars,
    pageScroll,
    searchfield,
    sectionIndexer,
    setSelected,
    sidebar
};

//  Export module
export default MmenuState;

//	Global namespace
if (window) {
    window.MmenuState = MmenuState;
}

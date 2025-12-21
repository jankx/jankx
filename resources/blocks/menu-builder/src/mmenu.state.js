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
import offcanvas from '../dist/core/offcanvas/mmenu.offcanvas';
import scrollBugFix from '../dist/core/scrollbugfix/mmenu.scrollbugfix';
import theme from '../dist/core/theme/mmenu.theme';

//	Add-ons
import backButton from '../dist/addons/backbutton/mmenu.backbutton';
import counters from '../dist/addons/counters/mmenu.counters';
import iconbar from '../dist/addons/iconbar/mmenu.iconbar';
import iconPanels from '../dist/addons/iconpanels/mmenu.iconpanels';
import navbars from '../dist/addons/navbars/mmenu.navbars';
import pageScroll from '../dist/addons/pagescroll/mmenu.pagescroll';
import searchfield from '../dist/addons/searchfield/mmenu.searchfield';
import sectionIndexer from '../dist/addons/sectionindexer/mmenu.sectionindexer';
import setSelected from '../dist/addons/setselected/mmenu.setselected';
import sidebar from '../dist/addons/sidebar/mmenu.sidebar';

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

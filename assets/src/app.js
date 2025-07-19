var smoothScroll = new scrollToSmooth( 'a.jankx-scrollto', {
  targetAttribute: 'href',
  topOnEmptyHash: false,
  duration: 400,
  durationRelative: false,
  durationMin: false,
  durationMax: false,
  easing: 'easeOutCubic',
  onScrollStart: (data) => { /* Scroll started */ },
  onScrollUpdate: (data) => { /* Scroll updated */ },
  onScrollEnd: (data) => { /* Scroll ended */ },
  fixedHeader: null
})
smoothScroll.init();

// Get the header
var header = document.getElementById("jankx-site-header");
if (header) {
var breakpoints = 768;
// When the user scrolls the page, execute jankx_sticky_header_detector
// @link: https://www.w3schools.com/howto/howto_js_sticky_header.asp
window.onscroll = function() {jankx_sticky_header_detector()};

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function jankx_sticky_header_detector() {
  if (window.innerWidth >= breakpoints) {
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  } else {
    header.classList.remove("sticky");
  }
}
}

var primaryMenuHasSubItems = document.querySelectorAll('.navigation-primary .show-child');
if (primaryMenuHasSubItems.length > 0) {
for (i=0; i<primaryMenuHasSubItems.length; i++) {
    primaryMenuHasSubItem = primaryMenuHasSubItems[i];
    primaryMenuHasSubItem.addEventListener('click', function (e) {
        currentMenuItem = e.target.findParent('.menu-item');
        if (currentMenuItem) {
            currentMenuItem.toggleClass('show-sub');
        }
    });
}
}

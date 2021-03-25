var smoothScroll = new scrollToSmooth( 'a', {
    targetAttribute: 'href',
    duration: 400,
    durationRelative: false,
    durationMin: false,
    durationMax: false,
    easing: 'easeOutCubic',
    onScrollStart: (data) => { console.log(data); },
    onScrollUpdate: (data) => { console.log(data); },
    onScrollEnd: (data) => { console.log(data); },
    fixedHeader: null
  })
smoothScroll.init();



var breakpoints = 768;
// When the user scrolls the page, execute jankx_sticky_header_detector
// @link: https://www.w3schools.com/howto/howto_js_sticky_header.asp
window.onscroll = function() {jankx_sticky_header_detector()};
// Get the header
var header = document.getElementById("jankx-site-header");
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

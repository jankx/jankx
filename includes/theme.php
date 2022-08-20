# Please do not store any SECURE INFORMATIONS in this file
# This file should be use for public info
theme:
  name: 'Jankx'
  short_name: 'Jankx'

plugins:
  woocommerce:
    required: true

layout:
  container_width: 1200
  footer_sidebars: 4
  breakpoints:
    tablet: 768
    landscape_tablet: 992
    desktop: 1200
    large_desktop: 1600
  
 woocommerce:
  archive_product:
    page_as_template: false

images:
  thumbnail:
    width: 180
    height: 120
  medium:
    width: 480
    height: 350
  large:
    width: 1024
    height: 1024
mobile_images:
  medium:
    width: 520
    height: 380

colors:
  primary_color: "#A8201A"
  secondary: "#EC9A29"
  neutral: "#0F8B8D"
  secondary_contrast: "#143642",
  primary_contrast: "#DAD2D8"

version: "1.0.0"

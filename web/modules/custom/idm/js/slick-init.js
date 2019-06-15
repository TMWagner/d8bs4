/**
 * @file
 * Coding Standards: https://www.drupal.org/node/172169
 */

// JavaScript Document

(function ($, Drupal) {

  'use strict';
  /* CODE GOES HERE  - Code Wrap*/

  // @todo this does not get fired - at least as if....

  $(document).ready(function() {

    console.log(">>>> initialize SLICK....");


    $('.research-team-member-group-test').slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });


    /**
     * Initialize slick(idm) carousel for mobile
     * Used in Tools
     */
    $('.carousel-mobile-filter').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: true,

    });

  });







  /* END Code Wrap */
})(jQuery, Drupal);
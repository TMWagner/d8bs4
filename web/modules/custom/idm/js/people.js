/**
 * @file
 * Coding Standards: https://www.drupal.org/node/172169
 */

// JavaScript Document

(function ($, Drupal) {
  'use strict';
  /* CODE GOES HERE  - Code Wrap*/

  $(function() {
    // do work here on document ready.
    //@todo Remove for production
    console.log(">>> starting research.js...");

    $( "#profile-accordion" ).accordion({
      animate: 200,
      active: true,
      collapsible: true
    });



  });












  /* END Code Wrap */
})(jQuery, Drupal);
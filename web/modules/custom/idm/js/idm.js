/**
 * @file
 * Coding Standards: https://www.drupal.org/node/172169
 */

// JavaScript Document

(function ($, Drupal) {

  'use strict';
  /* CODE GOES HERE  - Code Wrap*/

  // Add Class for bootstrap 4 image processing
  // Remove height and width (screws up the bootstrap functionality)
  $(".people-photo > img").addClass("card-img-top").removeAttr("width height");



  /* END Code Wrap */
})(jQuery, Drupal);
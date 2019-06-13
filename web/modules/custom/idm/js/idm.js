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

  // Add "Row to individual profile listing page"
  $(".profile-bio-link-wrap > .col-auto").addClass("row");



  //Begin modal trigger
  $('.modal-link').click(function() {
    //  URL passed from the click universal object
    var url = $(this).attr('href');

    // @todo See http://api.jquery.com/load/: We can specify what part of the doc we want...
    console.log("URL is: " + url);
    /*
    * .modal-container: location on parent page where model will load
    * .#myModal: stuff we are going to load (not sure what is the difference
    *   Between that and what we can put in the parameter.
    *   @todo See http://api.jquery.com/load/: We can specify what part of the doc we want...
     */
    $('.modal-container').load(url,function(result){
      $('#myModal').modal({show:true});

    });
  });
  // End Modal Trigger



  $( ".idm-footer-mobile" ).accordion({
    animate: 400,
    collapsible: true,
    active: false
  });


  // $('#profilemodal').modal();
  // $('#profileMobile').addClass("bogus-class");





  /* END Code Wrap */
})(jQuery, Drupal);
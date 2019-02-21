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



  // //@todo Testing
  // $('.buttonopen').on('click', '[data-toggle="modal"]', function(){
  //   $($(this).data("target")+' .modal-body').load($(this).data("remote"));
  // });


  $('#modellink').click(function() {

    //  URL passed from the click universal object
    var url = $(this).attr('href');

    // @todo See http://api.jquery.com/load/: We can specify what part of the doc we want...
    $('.modal-container').load(url,function(result){
      $('#myModal').modal({show:true});
    });
  });

  /* END Code Wrap */
})(jQuery, Drupal);
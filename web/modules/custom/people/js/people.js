/**
 * @file
 * JavaScript for people.
 */

(function ($) {

  // Re-enable form elements that are disabled for non-ajax situations.
  // jQuery(".people_bio_dynamic").click(function() {
  //   alert("clicked it From PEOPLE");
  // });

  $( document ).ajaxComplete(function(e) {
    $('.people_bio_dynamic').children().addClass('profile-swap');
  });




})(jQuery);

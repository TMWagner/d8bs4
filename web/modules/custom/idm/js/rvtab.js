// JavaScript Document

(function ($, Drupal) {

  'use strict';
  /* CODE GOES HERE  - Code Wrap*/

  /*global $ */
  $(document).ready(function () {

    "use strict";
    $(".tab_content").hide();
    $(".tab_content:first").show();

    /* if in tab mode */
    $("ul.tabs li").click(function(e) {


      $(".tab_content").hide();
      var activeTab = $(this).attr("rel");
      console.log("Active Tab...." + activeTab);

      showHeading(activeTab);


      $("#" + activeTab).fadeIn( "slow" );

      $("ul.tabs li").removeClass("active");
      $(this).addClass("active");

      $(".tab_drawer_heading").removeClass("d_active");
      $(".tab_drawer_heading[rel^='" + activeTab + "']").addClass("d_active");

      /*$(".tabs").css("margin-top", function(){
         return ($(".tab_container").outerHeight() - $(".tabs").outerHeight() ) / 2;
      });*/
    });
    $(".tab_container").css("min-height", function() {
      return $(".tabs").outerHeight() + 50;
    });
    /* if in drawer mode */
    $(".tab_drawer_heading").click(function() {

      $(".tab_content").hide();
      var d_activeTab = $(this).attr("rel");
      $("#" + d_activeTab).fadeIn( "slow");

      $(".tab_drawer_heading").removeClass("d_active");
      $(this).addClass("d_active");

      $("ul.tabs li").removeClass("active");
      $("ul.tabs li[rel^='" + d_activeTab + "']").addClass("active");
    });

    function showHeading(buttonClicked) {
      console.log (" >> parameter is: " + buttonClicked);
      switch(buttonClicked) {
        case "tab1":
          console.log('tab1 clicked');
          $("#heading1").removeClass("d-none");
          $("#heading2").addClass("d-none");
          $("#heading3").addClass("d-none");
          $("#heading4").addClass("d-none");
          $("#heading5").addClass("d-none");
          break;
        case "tab2":
          $("#heading1").addClass("d-none");
          $("#heading2").removeClass("d-none");
          $("#heading3").addClass("d-none");
          $("#heading4").addClass("d-none");
          $("#heading5").addClass("d-none");

          break;
        case "tab3":
          $("#heading1").addClass("d-none");
          $("#heading2").addClass("d-none");
          $("#heading3").removeClass("d-none");
          $("#heading4").addClass("d-none");
          $("#heading5").addClass("d-none");
          break;
        case "tab4":
          $("#heading1").addClass("d-none");
          $("#heading2").addClass("d-none");
          $("#heading3").addClass("d-none");
          $("#heading4").removeClass("d-none");
          $("#heading5").addClass("d-none");
          break;
        case "tab5":
          $("#heading1").addClass("d-none");
          $("#heading2").addClass("d-none");
          $("#heading3").addClass("d-none");
          $("#heading4").addClass("d-none");
          $("#heading5").removeClass("d-none");
          break;
        default:
          console.log( ">>> Debug Invalid data <<<");
          // End Switch Block
      }
    };


    /* Extra class "tab_last"
       to add border to bottom side
       of last tab
    $('ul.tabs li').last().addClass("tab_last");*/


  });



  /* END Code Wrap */
})(jQuery, Drupal);
/**
 * @file
 * Coding Standards: https://www.drupal.org/node/172169
 */

// JavaScript Document

(function ($, Drupal) {

  'use strict';
  /* CODE GOES HERE  - Code Wrap*/

  //Begin paste/functions

  var windowType = checkMod();
  console.log("window type set at: " + windowType);

  $(window).resize(function() {
    var oldWindowType = windowType;
    var cardClicked = $( ".tools-card" );
    windowType = checkMod();


    console.log(">>>> resetting window size..." + oldWindowType + ' ' + windowType);

    if (windowType !== oldWindowType) {
      console.log("resetting window type - now is: " + windowType);
      // location.reload(true);

      //@todo Reload not working
      // window.location.reload(true);

      //small to medium
      if ((oldWindowType === "small") && (windowType === "medium")) {
        cardClicked.off("click");
        cardClicked.click(fnClickCard);

        // Remove any left over modals
        $("#toolsModal").modal("hide");
      }
      //medium to small
      if ((oldWindowType === 'medium') && (windowType === "small")) {
        cardClicked.off("click");
        cardClicked.click(fnClickCardMobile);
        //@todo Reload not working


        // Turn off Card selected
        cardClicked.removeClass('card-selected');

        // Turn off the "content"
        $('.insert').remove();
      }

      //medium to large - nothing to do
      if ((oldWindowType === 'medium') && (windowType === "large")) {
        // cardClicked.off("click");
        // cardClicked.click(fnClickCard);

        // Turn off Card selected
        cardClicked.removeClass('card-selected');

        // Turn off the "content"
        $('.insert').remove();
      }
      //large to medium - nothing to do
      if ((oldWindowType === 'large') && (windowType === "medium")) {
        // cardClicked.off("click");
        // cardClicked.click(fnClickCard);

        // Turn off Card selected
        cardClicked.removeClass('card-selected');

        // Turn off the "content"
        $('.insert').remove();
      }
    }
  });



  // Attach the handler for filter
  $('.btn-filter-selector').click(fnClickFilter);
  var cardClicked = $('.tools-card');

  // Attach handler for mobile or Desktop
  if (windowType === 'small') {
    cardClicked.click(fnClickCardMobile);

  } else {
    cardClicked.click(fnClickCard);
  }


  /**
   * fnClickCardMobile
   */
  function fnClickCardMobile() {

    var cardClicked = $(this);
    var data = cardClicked.find('h4').data("node-url");

    console.log("title is: " + cardClicked.find('h4').html());

    //build out the template.

    //title
    // var nodeContent = $.get(data + " .research-content");
    $("#ModalTitle").text(cardClicked.find('h4').html());

    // Grab just the body text
    $( ".insert" ).load(data + " .tools-card-text");

    $("#toolsModal").modal();

  }
  // End Function


  /**
   * fnClickCard
   */
  function fnClickCard() {

    var positionCurrant;
    var positionNext;
    var data;



    // var curCard = $(this);
    // var data = $(this).find('h4').data();
    // console.log("card is: " + curCard.text);

    // One of the cards was clicked - we need to turn off inserted content regardless
    $('.insert').remove();

    if ($(this).hasClass('card-selected')) {

      // Turn off Card selected
      $(this).toggleClass('card-selected');

    } else {

      // First find the end of the row
      var cardClicked = $(this);
      var currentCard = cardClicked;
      var nextCard = $(this).next();

      // Check for last element
      if ( nextCard.length === 0 ) {
        // We hit the end - currentCard is the last element
        // data = currentCard.find('h4').data("node-url");
        // console.log( 'We clicked the last one: ' + data);
      }
      else {
        positionCurrant = currentCard.position().top;
        positionNext = nextCard.position().top;

        // console.log( "position - currant: " + positionCurrant);
        // console.log( "position - next: " + positionNext);

        while ( positionCurrant === positionNext) {
          // Loop till we hit the end of the row
          // data = data + ".research-content';
          currentCard = nextCard;
          nextCard = currentCard.next();
          positionCurrant = currentCard.position().top;
          positionNext = nextCard.position().top;
          console.log( "position(loop) - currant: " + positionCurrant);
          console.log( "position(loop) - next: " + positionNext);
        }
        // @todo Lets see which card we landed on
        var cardText = currentCard.find("h4").text();
        data = cardClicked.find('h4').data("node-url");
        console.log( "is this it? " + cardText);
        // @todo add class d-none... then swap display property AFTER load
        currentCard.after("<div class='insert d-none tools-content-wrapper mx-sm-1'> </div>");
        // $( ".insert" ).load( "/malaria .research-content");
        console.log("data is: " + data);
        $( ".insert" ).load(data + " .tools-content").toggleClass("d-none");

      }



      // Turn off all other active cards
      $(".tools-card.card-selected").toggleClass("card-selected");
      $("#tool-display").remove();


      // Turn off any "display content"
      // Toggle selected on this card.
      $(this).toggleClass('card-selected');


    }
    // End of Desktop/tablet
  }


  // Is mobile test code
  //@todo Verify this code - What screen size should it be
  //@todo We could use modernizr here... but why?
  //	XS < 576
  //	SM >= 576
  //	MD >= 768
  //	LG >= 992
  function checkMod(initial) {


    var windowWidth = $( window ).width();

    if (windowWidth <= 768)
      windowType = 'small';

    else if (windowWidth <= 992)
      windowType = 'medium';

    else {
      windowType = "large";
    }

    return windowType;
  }


  // Filter handler
  function fnClickFilter() {
    //turn on active on currant button - turn off on all others.
    // @todo Do we leave ALL selected if clicked?


    var selectorBtn = $(this).attr('id');
    //@todo: Replace for production
    var selectorBtnFooter = $('<p>Any little thing can be your friend if you let it be</p>');


    //first, remove all filters
    $('.tool-card').removeClass('tool-card-filtered');

  }

  // End paste


  /* END Code Wrap */
})(jQuery, Drupal);
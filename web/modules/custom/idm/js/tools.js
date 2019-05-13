/**
 * @file
 * Coding Standards: https://www.drupal.org/node/172169
 */

// JavaScript Document

(function ($, Drupal) {

  'use strict';
  /* CODE GOES HERE  - Code Wrap*/

  //Begin paste/functions


  //Determine Window size and set global var.
  var windowType = checkMod();
  console.log("window type set at: " + windowType);


  // Shorthand for $( document ).ready()
  $(function() {
    console.log( "ready!" );


    /**
     * Initialize tablet/Desktop windows
     */

    //@todo Clean this up... should only check window size once...
    if ( windowType !== "small" ) {
      $( "<div id='status-bar'><div id='status-bar-indicator'></div></div>")
          .insertAfter( ".tools-wrapper > .view-content");

      $("<div class='text-center'  id='filter-intro'><p>placeholder</p></div>")
          .insertAfter("#status-bar");

      $("#filter-intro").html($(".filter-description:first").html());
    }

    /**
     * Attach click handlers
     * And call display card (if needed)
     */
    var cardClicked = $('.tools-card');

    // Figure out what the calling URL is
    var toolParameter = null;
    var urlString = $(location).attr('pathname').split("/");
    if (urlString.length == 3) {
      toolParameter = urlString[2];
      console.log(">>> Incoming parameter is: " + toolParameter);
    }


    // Add div(s) for tool highlight (both Desktop and Mobile
    $( "<div class='tool-highlight-topbar'></div>")
        .prependTo( ".views-field.views-field-nothing");


    // Attach handler for mobile or Desktop
    if (windowType === 'small') {
      console.log('attach Handler for small');
      cardClicked.click(fnClickCardMobile);
      if (toolParameter) fnShowCardMobile(toolParameter);


    } else {
      console.log("attach handler for standard window...");

      //we are loading both the desktop filter and the card handler
      $('.tools-filter-title').click(fnClickFilter);
      cardClicked.click(fnClickCard);
      if (toolParameter) fnShowCard(toolParameter);

      // // Add div(s) for tool highlight
      // $( "<div class='tool-highlight-topbar'></div>")
      //     .prependTo( ".views-field.views-field-nothing");

    }


    /**
     * Setup Tools Mobile display (if present)
     */
    // Set first card active
    $('.carousel').carousel();
    $(".carousel-item.text-center.tools-filter-title.tools-filter-mobile:first").addClass("active");


    // Turn off autoscroll
    $('#toolsUIindicators').on('slid.bs.carousel', highlightMobileCard);


  });
  // End Document ready


  /**
   * highlightMobileCard
   */
  function highlightMobileCard() {
    console.log('>>> process mobile filter');
    $(".carousel").carousel('pause');

    // Get card
    var activeSlide = $(".carousel-item.active");
    var targetClass = activeSlide.find('.tool-filter-content').data("tool-class");
    console.log(">>> target is: " + targetClass);

    // Remove highlight from all cards first
    $('.tool-highlight-topbar').removeClass("show-tool");

    //Find card(s) with class = filterData and add class
    $('.' + targetClass).find('.tool-highlight-topbar').addClass("show-tool");

    //@todo animate topbar
    $('.tool-highlight-topbar.show-tool').animate({
      left: '40%',
      width: '3em'
    });
  }


  /**
   * fnShowCard
   * This function is called directly from a url. For example:
   * Expected parameter is a text string with the title of the research node
   * (2019/04/17: tmw)
   */
  function fnShowCard(toolParameter) {
    console.log(">>> Begin fnShowCard: ");
    console.log("Did we get the parm?? Should be: " + toolParameter);

    var positionCurrant;
    var positionNext;
    var data;

    // @todo carried cardClicked over from last function - should refactor it.
    var cardClicked = $('h4[data-tool=' + toolParameter +']').closest('.tools-card');

    // First find the end of the row
    // @todo the match has to be againt the KEY not the title.

    cardText = cardClicked.find('h4').html();
    console.log("cardClicked is: " + cardText);
    //@todo verify that we received a valid parameter (how?)

    var currentCard = cardClicked;
    var nextCard = $(this).next();
    var nextCard = currentCard.next();

    var cardTextNext = nextCard.find('h4').html();
    console.log("cardTextNext  is: " + cardTextNext);

    // Check for last element
    if ( nextCard.length === 0 ) {

      console.log("**** We hit the end of the row (apparently)...");

      // We hit the end - currentCard is the last element
      // data = currentCard.find('h4').data("node-url");
      // console.log( 'We clicked the last one: ' + data);
    }
    else {
      positionCurrant = currentCard.position().top;
      positionNext = nextCard.position().top;

      console.log( "position - currant: " + positionCurrant);
      console.log( "position - next: " + positionNext);

      while ( positionCurrant === positionNext) {
        // Loop till we hit the end of the row
        // data = data + ".research-content';
        currentCard = nextCard;
        nextCard = currentCard.next();
        //
        positionCurrant = currentCard.position().top;
        positionNext = nextCard.position().top;
        console.log( "position(loop) - currant: " + positionCurrant);
        console.log( "position(loop) - next: " + positionNext);
      }
      // @todo Lets see which card we landed on
      var cardText = currentCard.find("h4").text();
      data = cardClicked.find('h4').data("node-url");
      // console.log( "is this it? " + cardText);
      // @todo add class d-none... then swap display property AFTER load
      currentCard.after("<div class='insert d-none tools-content-wrapper mx-sm-1'> </div>");
      // $( ".insert" ).load( "/malaria .research-content");
      console.log("data is: " + data);
      $( ".insert" ).load(data + " .tools-content").toggleClass("d-none");
    }

    // Turn off all other active cards (shouldn't matter but... )
    $(".tools-card.card-selected").toggleClass("card-selected");
    $("#tool-display").remove();


    // Turn off any "display content"
    // Toggle selected on this card.
    cardClicked.toggleClass('card-selected');

  }
  // End of fnShowCard



  /**
   * fnShowCardMobile
   */
  function fnShowCardMobile(toolParameter) {

    console.log(">>> Begin fnShowCardMobile: ");
    console.log("Did we get the parm?? Should be: " + toolParameter);

    if (toolParameter !== 'all') {

      // $('h4[data-tool=' + toolParameter +']').closest('.tools-card').addClass('bogus2');
      // @todo carried cardClicked over from last function - should refactor it.
      var cardClicked = $('h4[data-tool=' + toolParameter + ']').closest('.tools-card');
      var data = cardClicked.find('h4').data("node-url");

      console.log("title is: " + cardClicked.find('h4').html());

      //build out the template.

      //title
      $("#ModalTitle").text(cardClicked.find('h4').html());

      // Grab just the body text
      $(".insert").load(data + " .tools-card-text");

      $("#toolsModal").modal()
    }
  }


  /**
   * Resize function
   */
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




  /**
   * fnClickFilter
   * Handler for the Desktop Filter UI
   */
  function fnClickFilter () {
    var filterClicked = $(this);
    var positionStart = $('.tools-filter-title:first').offset().left;
    var position = filterClicked.offset().left;


    var functionTitle = filterClicked.find('p:first').html();
    var filterDescription = filterClicked.find('.filter-description').html();

    //Reset highlight bar on cards @todo animate this?
    //Reset CSS for show tool

    $('.tool-highlight-topbar.show-tool').animate({
      left: '50%',
      width: '.1em'
    });
    // @todo chain this with the previous statement...
    $('.tool-highlight-topbar').removeClass("show-tool");


    //Calculate position (to be able to move indicator
    console.log("Filter clicked: " + functionTitle + ' ' + position + ' ' + positionStart);
    $("#status-bar-indicator").animate({left: position-positionStart});

    //Replace text with correct intro
    $("#filter-intro").html(filterDescription);


    // Light up the correct cards based on taxonomy
    // @todo We need a key other than title (it is mixed case and can contain spaces

    // returns the class we want to search on
    var filterData = $(this).find(".tool-filter-content").data("tool-class");

    //@todo debug
    console.log(">>>>filter data is: " + filterData + "<<<<<");

    //Find card(s) with class = filterData and add class
    $('.' + filterData).find('.tool-highlight-topbar').addClass("show-tool");

    //@todo animate topbar


    $('.tool-highlight-topbar.show-tool').animate({
      left: '40%',
      width: '3em'
    });



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
    $("#ModalTitle").text(cardClicked.find('h4').html());

    // Grab just the body text
    $( ".insert" ).load(data + " .tools-card-text");

    $("#toolsModal").modal();

  }


  /**
   * fnClickCard
   * Handler for the Desktop card handler
   */
  function fnClickCard() {

    var positionCurrant;
    var positionNext;
    var data;


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


      //@todo DEBUG next 4 lines
      // var textCurrant = currentCard.find("h4").text();
      // var textNext = nextCard.find("h4").text();
      // console.log( "Before nextcard check. Currant card is: " + textCurrant);
      // console.log( "Before nextcard check. Next Card is: " + textNext);
      // // END DEbug

      // Check for last element
      if ( nextCard.length === 0 ) {
        // We hit the end - currentCard is the last element
        // data = currentCard.find('h4').data("node-url");
        console.log( 'We clicked the last one: ' + data);
      }
      else {
        positionCurrant = currentCard.position().top;
        positionNext = nextCard.position().top;

        //@todo remove before flight
        console.log( "Before Loop...position - currant: " + positionCurrant);
        console.log( "Before Loop... position - next: " + positionNext);

        while ( positionCurrant === positionNext) {

          var textCurrant = currentCard.find("h4").text();
          var textNext = nextCard.find("h4").text();

          //@todo Remove before flight
          console.log( "In loop- Currant card is: " + textCurrant);
          console.log( "In loop- Next Card is: " + textNext);


          // Break out of the loop if we run past the end. If we don't
          // then trying to access the empty array will force an error.
          if (nextCard.length === 0) {
            console.log("Next card length 0: Break out of loop");
            break;
          }

          //@todo moved the next two lines below the if Statement
          currentCard = nextCard;
          nextCard = currentCard.next();

          positionCurrant = currentCard.position().top;
          positionNext = nextCard.position().top;

          //@todo remove before flight
          console.log( "position(loop) - currant: " + positionCurrant);
          console.log( "position(loop) - next: " + positionNext);
        }

      }


      var cardText = currentCard.find("h4").text();

      data = cardClicked.find('h4').data("node-url");
      console.log( "is this it? " + cardText);
      // @todo add class d-none... then swap display property AFTER load
      currentCard.after("<div class='insert d-none tools-content-wrapper mx-sm-1'> </div>");
      // $( ".insert" ).load( "/malaria .research-content");
      // console.log("data is: " + data);
      $( ".insert" ).load(data + " .tools-content").toggleClass("d-none");



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



  /* END Code Wrap */
})(jQuery, Drupal);
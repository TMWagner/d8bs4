/**
 * @file
 * Coding Standards: https://www.drupal.org/node/172169
 */

// JavaScript Document

(function ($, Drupal) {

  'use strict';
  /* CODE GOES HERE  - Code Wrap*/


  //Determine Window size and set global var.
  var windowType = checkMod();

  $(function() {

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
    var contentClicked = $('.tools-content-wrapper');

    // Figure out what the calling URL is
    var toolParameter = null;
    var urlString = $(location).attr('pathname').split("/");
    if (urlString.length == 3) {
      toolParameter = urlString[2];
    }


    // Add div(s) for tool highlight (both Desktop and Mobile
    $( "<div class='tool-highlight-topbar'></div>")
        .prependTo( ".views-field.views-field-nothing");


    // Attach handler for mobile or Desktop
    if (windowType === 'small') {
      cardClicked.click(fnClickCardMobile);
      if (toolParameter) fnShowCardMobile(toolParameter);
    } else {

      //we are loading both the desktop filter and the card handler
      $('.tools-filter-title').click(fnClickFilter);

      //Initalize filter
      $('.tools-filter-title:first').addClass('highlight-filter');

      cardClicked.click(fnClickCard);
      if (toolParameter) fnShowCard(toolParameter);

    }

    /**
     * Setup Tools Mobile display (if present)
     * @todo refactor for new carousel
     */
    // Set first card active
    //@todo this does nothing with new code?
    $(".carousel-item.text-center.tools-filter-title.tools-filter-mobile:first").addClass("active");

    // Turn on the highlight functionality
    //Event that fires AFTER event.

    //@todo event for slick post slide
    $('.carousel-mobile-filter').on('afterChange', highlightMobileCard)


  });
  // End Document ready


  /**
   * highlightMobileCard
   */
  function highlightMobileCard() {
    // Get card
    var activeSlide = $(".slick-active");
    var targetClass = activeSlide.find('.tool-filter-content').data("tool-class");

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
   * @todo position window to called card
   */
  function fnShowCard(toolParameter) {
    var positionCurrant;
    var positionNext;
    var data;

    // @todo carried cardClicked over from last function - should refactor it.
    var cardClicked = $('h4[data-tool=' + toolParameter +']').closest('.tools-card');

    // First find the end of the row
    cardText = cardClicked.find('h4').html();
    //@todo verify that we received a valid parameter

    var currentCard = cardClicked;
    var nextCard = currentCard.next();
    var moreCards = true;

    var cardTextNext = nextCard.find('h4').html();

    // Check for last element
    if (nextCard.length !== 0) {
      positionCurrant = currentCard.position().top;
      positionNext = nextCard.position().top;

      while (positionCurrant === positionNext && moreCards) {

        //@todo next 2 lines are for dev.. remove
        var textCurrant = currentCard.find("h4").text();
        var textNext = nextCard.find("h4").text();

        currentCard = nextCard;
        nextCard = currentCard.next();

        if (nextCard.length === 0) {
          moreCards = false;
        }
        else {
          positionCurrant = currentCard.position().top;
          positionNext = nextCard.position().top;
        }
      } // end While
    } // End if
    else {
      // We hit the end - currentCard is the last element
      // data = currentCard.find('h4').data("node-url");
      // @todo More processing?


    }

    var cardText = currentCard.find("h4").text();
    data = cardClicked.find('h4').data("node-url");
    console.log("#### (fnShowCard) is this it? " + cardText);
    // @todo add class d-none... then swap display property AFTER load
    currentCard.after("<div class='insert d-none tools-content-wrapper mx-sm-1'> </div>");
    // $( ".insert" ).load( "/malaria .research-content");
    // console.log("data is: " + data);
    $(".insert").load(data + " .tools-content", loadComplete).toggleClass("d-none");




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
   * Logic:
   *  1. Determine which card / URL to fetch content for
   *  2. Build out the template
   *  3. Display with Bootstrap Modal
   */
  function fnShowCardMobile(toolParameter) {

    // console.log(">>> Begin fnShowCardMobile: ");
    // console.log("Did we get the parm?? Should be: " + toolParameter);

    if (toolParameter !== 'all') {

      // @todo carried cardClicked over from last function - should refactor it.
      var cardClicked = $('h4[data-tool=' + toolParameter + ']').closest('.tools-card');
      var data = cardClicked.find('h4').data("node-url");

      // console.log("title is: " + cardClicked.find('h4').html());

      //build out the template.
      //title
      $("#ModalTitle").text(cardClicked.find('h4').html());

      // Grab just the body text
      $( ".insertbody" ).load(data + " .tools-card-text");

      // Add buttons
      $(".insertbuttons").load(data + " #tool-sublink-buttons");

      $("#toolsModal").modal()
    }
  }


  /**
  /**
   * Resize function
   */
  $(window).resize(function() {
    var oldWindowType = windowType;
    var cardClicked = $( ".tools-card" );
    windowType = checkMod();

    if (windowType !== oldWindowType) {

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

        // Turn off Card selected
        cardClicked.removeClass('card-selected');
        // Turn off the "content"
        $('.insert').remove();
        // Turn off 'X'
        $('.xclosebox').remove();
      }

      //medium to large - nothing to do
      if ((oldWindowType === 'medium') && (windowType === "large")) {

        // Turn off Card selected
        cardClicked.removeClass('card-selected');
        // Turn off the "content"
        $('.insert').remove();
        // Turn off 'X'
        $('.xclosebox').remove();
      }
      //large to medium - nothing to do
      if ((oldWindowType === 'large') && (windowType === "medium")) {

        // Turn off Card selected
        cardClicked.removeClass('card-selected');
        // Turn off the "content"
        $('.insert').remove();
        // Turn off 'X'
        $('.xclosebox').remove();
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

    //Clear highlighting
    $('.tools-filter-title').removeClass('highlight-filter');

    //Set highlight class
    $(this).addClass('highlight-filter');

    //Reset highlight bar on cards @todo animate this?
    //Reset CSS for show tool

    $('.tool-highlight-topbar.show-tool').animate({
      left: '50%',
      width: '.1em'
    });
    // @todo chain this with the previous statement...
    $('.tool-highlight-topbar').removeClass("show-tool");


    //Calculate position (to be able to move indicator
    $("#status-bar-indicator").animate({left: position-positionStart});

    //Replace text with correct intro
    $("#filter-intro").html(filterDescription);


    // Light up the correct cards based on taxonomy
    // @todo We need a key other than title (it is mixed case and can contain spaces

    // returns the class we want to search on
    var filterData = $(this).find(".tool-filter-content").data("tool-class");

    //@todo debug

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
   * @todo first .load doesn't work if window is resized. 2nd one does- hmm
   * @todo Can we do just one load and pick apart the object?
   *
   */
  function fnClickCardMobile() {

    var cardClicked = $(this);
    var data = cardClicked.find('h4').data("node-url");

    //build out the template.
    //title
    $("#ModalTitle").text(cardClicked.find('h4').html());

    // Grab just the body text
    $( ".insertbody" ).load(data + " .tools-card-text");

    // Add buttons
    $(".insertbuttons").load(data + " #tool-sublink-buttons");

    $("#toolsModal").modal();

  }


  function fnCloseContent() {
    var toolParameter = $('.insert').attr("data-tool-content");

    //Get the target card using the tool parameter
    var targetCard = $('h4[data-tool=' + toolParameter +']').closest('.tools-card');

    // Turn off the "content"
    $('.insert').remove();


    //@todo Might as well just hit all the cards and clean up
    $(".tools-card").removeClass("card-selected");

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
    $('.xclosebox').remove();

    if ($(this).hasClass('card-selected')) {

      // Turn off Card selected
      $(this).toggleClass('card-selected');

    } else {

      // First find the end of the row
      var cardClicked = $(this);
      var currentCard = cardClicked;
      var nextCard = $(this).next();
      var moreCards = true;


      // Check for last element
      if (nextCard.length !== 0) {
        positionCurrant = currentCard.position().top;
        positionNext = nextCard.position().top;


        while (positionCurrant === positionNext && moreCards) {

          var textCurrant = currentCard.find("h4").text();
          var textNext = nextCard.find("h4").text();

          currentCard = nextCard;
          nextCard = currentCard.next();

          if (nextCard.length === 0) {
            moreCards = false;
          }
          else {
            positionCurrant = currentCard.position().top;
            positionNext = nextCard.position().top;
          }
        } //End While
      } // End If
      else {
        moreCards = false;
      }


      var cardText = currentCard.find("h4").text();

      data = cardClicked.find('h4').data("node-url");
      //Grab data-tool attribute
      var dataTool = cardClicked.find('h4').data("tool");

      // We've created the wrapper with Class="d-none"
      // Make sure its loaded before turning
      // on. Otherwise, we'll get a "jump".
      currentCard.after("<div class='insert d-none tools-content-wrapper mx-sm-1'> </div>");

      //Toggle class and add data-tool-content attribute
      // (so we can link to card)
      $( ".insert" ).load(data + " .tools-content", loadComplete).attr("data-tool-content", dataTool);



      $(".tools-card.card-selected").removeClass("card-selected");


      $("#tool-display").remove();

      // Turn off any "display content"
      // Toggle selected on this card.
      $(this).toggleClass('card-selected');

    }
    // End of Desktop/tablet
  }

  /**
   * Post load function
   * Handle post load from fnClickCard
   */
  function loadComplete() {


    // Turn on inserted content.
    $('.tools-content-wrapper').removeClass("d-none");
    // Attach modal close function
    $('button[data-dismiss=modal]').click(fnCloseContent);

    //Turn on X
    $('.tools-card.card-selected')
        .prepend('<div class="xclosebox top right"><span class="xclose fas fa-times"></span></div>');

    //@todo Add animation to class swap
    $('.card-selected').hover(cardOver, cardOut);

  }




  /**
   * Add Call for X highlight
   */
  function cardOver() {
    // User jQuery UI addClass
    // http://api.jqueryui.com/addClass/
    $( this ).addClass( "xclose-over", 800, "linear");
  }

  /**
   * Remove Class
   */
  function cardOut() {
    //Remove Class
    //http://api.jqueryui.com/removeClass/
    $( this ).removeClass( "xclose-over", 400 );
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

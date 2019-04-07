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
    var cardClicked = $( ".research-card" );
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
        location.reload(true);

        // Turn off Card selected
        cardClicked.removeClass('card-selected');

        // Turn off the "content"
        $('.insert').remove();
      }

      //medium to large - nothing to do
      if ((oldWindowType === 'medium') && (windowType === "large")) {
        cardClicked.off("click");

        // Turn off Card selected
        cardClicked.removeClass('card-selected');

        // Turn off the "content"
        $('.insert').remove();
      }
      //large to medium - nothing to do
      if ((oldWindowType === 'large') && (windowType === "medium")) {
        cardClicked.off("click");

        // Turn off Card selected
        cardClicked.removeClass('card-selected');

        // Turn off the "content"
        $('.insert').remove();
      }
    }
  });



  // Attach the handler for filter
  $('.btn-filter-selector').click(fnClickFilter);


  // Attach handler for mobile or Desktop
  if (windowType === 'small') {
    // $(".card").click(fnClickCardMobile);

  } else {
    // @todo test code for code import
    // $('.view-footer').click(fnClickCard);


    $('.research-card').click(fnClickCard);


  }



  function fnClickCardMobile() {
    // Which card was clicked
    var cardType = $(this).data("card-type");

    // todo cleanup. Remove multiple IDs;  (e.g., ID the source content just once.
    switch (cardType) {
      case 'emod':

        var footer = $('#tool-card-footer-emod').html();

        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-emod").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".research-card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');
        break;
      case 'cms':
        var footer = $('#tool-card-footer-cms').html();
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-cms").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".research-card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');

        break;
      case 'dtk':
        var footer = $('#tool-card-footer-dtk').html();
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-dtk").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".research-card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');
        break;
      case 'comps':
        var footer = $('#tool-card-footer-comps').html();
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-comps").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".research-card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');
        break;
      case 'risk':
        var footer = $('#tool-card-footer-risk').html();
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-risk").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".research-card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');
        break;
      case 'vis':
        var footer = $('#tool-card-footer-vis').html();
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-vis").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".research-card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');
        break;
      default:
        console.log('>>> not a valid card type <<<<');
    }



    // $("#toolsModalTitle").text('bla');
    // $("#modal-body-template").text('exciting text');
    $("#toolsModal").modal();

  }
  // End Function


  //Card click handler
  function fnClickCard() {

    var positionCurrant;
    var positionNext;
    var data;

    // //@todo test code to load external data...
    // $( "#test-swap").load( "/malaria ");
    //

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
        currentCard.after("<div class='insert col-12'> </div>");
        // $( ".insert" ).load( "/malaria .research-content");
        console.log(data);
        $( ".insert" ).load(data + " .research-content");

      }


      // var data = $(this).find('h4').data("node-url");
      //
      // console.log( "card is: " + data);
      //@todo grab this next div.
      // $(this).next().css( "background-color", "red" );





      //Calculate position for detail content
      var positionClick = $(this).position().top;
      // var objHeight = $(this).height();
      // var rePosition = positionClick + objHeight;



      // Turn off all other active cards
      $(".research-card.card-selected").toggleClass("card-selected");
      $("#tool-display").remove();


      // Turn off any "display content"
      // Toggle selected on this card.
      $(this).toggleClass('card-selected');




    }
    // End of Desktop/tablet
  }

  function setWrapper(toolPosition) {
    //@todo Should pass height too... we have it(I think)

    var toolHeight = $("#tool-display").height();
    var wrapperHeight = toolPosition + toolHeight + 10;
    console.log("...inside function. position of tool: " + toolPosition)
    console.log("... inside function. Height: " + toolHeight);
    $("#main-wrapper").css({height: wrapperHeight});
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






    //Turn on highlight class on appropriate cards / turn off others.

  }

  // End paste


  /* END Code Wrap */
})(jQuery, Drupal);
/**
 * @file
 * Coding Standards: https://www.drupal.org/node/172169
 */

// JavaScript Document

(function ($, Drupal) {


  'use strict';
  /* CODE GOES HERE  - Code Wrap*/


  console.log(">>> starting research.js...");
  var windowType = checkMod();

  // Shorthand for $( document ).ready()
  $(function() {



    // Attach the handler for filter
    $('.btn-filter-selector').click(fnClickFilter);

    var cardClicked = $('.research-card');

    // Attach handler for mobile or Desktop
    if (windowType === 'small') {
      cardClicked.click(fnClickCardMobile);

    }
    else {
      cardClicked.click(fnClickCard);
    }


  });
  // End Document ready




  //@todo no idea how this is working...
  //Wrap thumbnails
  $(".research-team").wrapAll("<div class='container team-card-thumbnail-wrap d-flex jquery'></div>");
  $(".research-team-member").wrapAll("<div class='research-team-member-group d-flex jquery'></div>");
  //End thumbnail wrap



  /**
   * This add a class to the team lead image on the footer of the Research card
   * @todo This will add a line on multiple images (I think) Not good
   *
   * @todo This may not even be in the DOM yet!
   */
  $(".field--name-field-team-lead").find(".field--name-user-picture").addClass('team-lead-img');


  /**
   * Resize Function
   */
  $(window).resize(function() {
    var oldWindowType = windowType;
    var cardClicked = $( ".research-card" );
    windowType = checkMod();


    console.log(">>>> resetting window size..." + oldWindowType + ' ' + windowType);

    if (windowType !== oldWindowType) {
      // console.log("resetting window type - now is: " + windowType);


      //small to medium
      if ((oldWindowType === "small") && (windowType === "medium")) {
        cardClicked.off("click");
        cardClicked.click(fnClickCard);

        // Remove any left over modals
        $("#research-modal").modal("hide");
      }
      //medium to small
      if ((oldWindowType === 'medium') && (windowType === "small")) {
        cardClicked.off("click");
        cardClicked.click(fnClickCardMobile);

        // Turn off Card selected
        cardClicked.removeClass('card-selected');

        // Turn off the "content"
        $('.insert').remove();
      }

      //medium to large - nothing to do
      if ((oldWindowType === 'medium') && (windowType === "large")) {

        // Turn off Card selected
        cardClicked.removeClass('card-selected');
        // Turn off the "content"
        $('.insert').remove();
        // @todo turn off
        // Turn off 'X'

      }
      //large to medium - nothing to do
      if ((oldWindowType === 'large') && (windowType === "medium")) {

        // Turn off Card selected
        cardClicked.removeClass('card-selected');
        // Turn off the "content"
        $('.insert').remove();
      }
    }
  });




  /**
   * fnClickCardMobile
   */
  function fnClickCardMobile() {

    var cardClicked = $(this);
    var data = cardClicked.find('h4').data("node-url");

    console.log("title is: " + cardClicked.find('h4').html());
    //@todo make sure event is not already bound
    $("#rlpModal").off();

    //build out the template.
    // Check to make sure we have a target (class='insert')
    if(!$(".insert").length){
      //Element is not present... add back in.(Original content source view)
      $('#modal-body-template').append( "<p class='insert'>Dynamic content</p>" );
    }


    //title
    $("#ModalTitle").text(cardClicked.find('h4').html());

    // Load the node and insert...
    $( ".insert" ).load(data + " .rlp-detail-more");

    $("#rlpModal").modal();

    $('#rlpModal').on('shown.bs.modal', function (e) {
      console.log("**** (fnClickCardMobile) Modal has fired and should be visible");

      //Clean up the Dom
      //@todo removed d-flex from parent wrapper for mobile (to stack two sections)
      $(".research-team").wrapAll("<div class='container-flex team-card-thumbnail-wrap  research-js'></div>");
      $(".research-team-member").wrapAll("<div class='research-team-member-group  research-js'></div>");
      $(".research-team-member-group").removeClass(".d-flex");


      var uid = null;
      //Loop through thumbnails
      $(".team-profile-thumbnail").each(function( index ) {
        //do some work
        uid = $( this ).data("uid");
        //@todo figuring out this string is much easier pasting from an html file.
        $(this).wrapAll("<a  href=\"\\profile/" + uid + "/mobile\"></a>");
        console.log( index + ": " + uid );
      });


      //init the carousel for team members display
      $('.research-team-member-group').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 700,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 650,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          }
        ]
      });
    })

  }
  // End Function
  

  /**
   * fnClickCard
   */
  function fnClickCard() {

    var positionCurrant;
    var positionNext;
    var data;

    // One of the cards was clicked - we need to turn off inserted content regardless
    $('.insert').remove();
    //@todo handle "X" cleanup (see tools)

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

        console.log("position - currant: " + positionCurrant);
        console.log("position - next: " + positionNext);

        while (positionCurrant === positionNext && moreCards) {

          //@todo Remove before flight
          console.log("In loop- Currant card is: ");
          console.log("In loop- Next Card is: ");

          currentCard = nextCard;
          nextCard = currentCard.next();

          if (nextCard.length === 0) {
            console.log("End of LOOP " + nextCard.length);
            moreCards = false;
          }
          else {
            positionCurrant = currentCard.position().top;
            positionNext = nextCard.position().top;
            console.log("position(loop) - currant: " + positionCurrant);
            console.log("position(loop) - next: " + positionNext);
          }

        } //End While
      } //End IF

      //@todo There is no Else - Nothing to do...
      else {

        // We hit the end - currentCard is the last element
        // data = currentCard.find('h4').data("node-url");
        // console.log( 'We clicked the last one: ' + data);
        console.log('^*^*^*^*We clicked the last one: &*&*&*&*& ');

      }


      var cardText = currentCard.find("h4").text();
      data = cardClicked.find('h4').data("node-url");

      console.log( "is this it? " + cardText);



      //@todo I could have just used the text instead of data attribute.
      var dataResearch = cardClicked.find('h4').data("research");
      console.log(">>> Research tool is: " + dataResearch);
      // We've created the wrapper with Class="d-none"
      // Make sure its loaded before turning
      // on. Otherwise, we'll get a "jump".
      currentCard.after("<div class='insert d-none research-content research-content-wrapper mx-sm-1 jquery'> </div>");
      console.log(data);
      console.log(">>> attempt to insert..." + data);


      $( ".insert" ).load(data + " .rlp-detail-more", loadComplete).attr("data-research-content", dataResearch);


      //@todo grab this next div.
      // $(this).next().css( "background-color", "red" );



      //Calculate position for detail content
      var positionClick = $(this).position().top;




      // Turn off all other active cards
      $(".research-card.card-selected").toggleClass("card-selected");
      $("#tool-display").remove();


      // Turn off any "display content"
      // Toggle selected on this card.
      $(this).toggleClass('card-selected');


    }
    // End of Desktop/tablet
  }



  /**
   * Post load function
   */
  function loadComplete() {
    // Content loaded:
    // Wrap the entire group in div for flex
    // Turn on inserted content.
    console.log('%%%%% in loadComplete');
    $('.research-content-wrapper').removeClass("d-none");
    // @todo Team lead as well?
    $(".research-team").wrapAll("<div class='container team-card-thumbnail-wrap d-flex jqsource'></div>");
    $(".research-team-member").wrapAll("<div class='research-team-member-group  jqsource'></div>");

    // windowType = checkMod();
    if (windowType === 'small') {
      console.log(">>> Remove d-flex from research-team-member-group");
      $(".research-team-member-group").removeClass(".d-flex");
    }

    //Attach handler for desktop Modal close function
    console.log('%%%%% in loadComplete');
    $('button[data-dismiss=modal]').click(fnCloseContent);

    //@todo Why did I hardcode this????
    if (true) {
      console.log(">>> Load slick from research...");
      //attach handler for carousel
      $('.research-team-member-group').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 700,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 650,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }

  }

  /**
   * FnCloseContent
   * Close the via the "X" close button
   */
  function fnCloseContent() {
    console.log("#### inside fnCloseContent....");
    var researchParameter = $('.insert').attr("data-research-content");
    console.log("@@@@ Resarch  is: " + researchParameter);

    //Get the target card using the tool parameter
    var targetCard = $('h4[data-research=' + researchParameter +']').closest('.research-card');

    // Turn off the "content"
    $('.insert').remove();

    if (targetCard.hasClass('card-selected')) {
      console.log("@@@@@ Card is selected");
      // Turn off highlight
      targetCard.toggleClass('card-selected');
    }

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
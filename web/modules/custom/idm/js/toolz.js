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
    windowType = checkMod();

    console.log(">>>> resetting window size..." + oldWindowType + ' ' + windowType);

    if (windowType !== oldWindowType) {
      console.log("resetting window type - now is: " + windowType);
      // location.reload(true);

      //@todo Reload not working
      window.location.reload(true);

      //small to medium
      if ((oldWindowType === "small") && (windowType === "medium")) {
        $(".card").off("click");
        $('.card').click(fnClickCard);

        // Remove any left over modals
        $("#toolsModal").modal("hide");
      }
      //medium to small
      if ((oldWindowType === 'medium') && (windowType === "small")) {
        $(".card").off("click");
        $(".card").click(fnClickCardMobile);
        //@todo Reload not working
        location.reload(true);

        // Turn off Card selected
        $(".tool-card").removeClass('tool-card-selected');

        // Turn off the "content"
        $('#tool-display').remove();
      }

      //medium to large - nothing to do
      //large to medium - nothing to do
    }
  });



  // Attach the handler for filter
  $('.btn-filter-selector').click(fnClickFilter);

  // Attach handler contingent on mobile v.s., desktop
  if (windowType === 'small') {
    $(".card").click(fnClickCardMobile);

  } else {
    $('.card').click(fnClickCard);
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
        $(".card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');
        break;
      case 'cms':
        var footer = $('#tool-card-footer-cms').html();
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-cms").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');

        break;
      case 'dtk':
        var footer = $('#tool-card-footer-dtk').html();
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-dtk").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');
        break;
      case 'comps':
        var footer = $('#tool-card-footer-comps').html();
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-comps").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');
        break;
      case 'risk':
        var footer = $('#tool-card-footer-risk').html();
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-risk").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".card-sublink-buttons-dynamic.row.temp").remove();
        $("#modal-footer-template button").before(footer);
        $("#modal-footer-template ").children('div').first().addClass('temp');
        break;
      case 'vis':
        var footer = $('#tool-card-footer-vis').html();
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-vis").html());

        //@todo wrap this mess before attaching... then make sure to remove it before adding
        $(".card-sublink-buttons-dynamic.row.temp").remove();
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

    // Restore main-wrapper natural height
    $( "#main-wrapper").css({height: 'auto'});



    if ($(this).hasClass('tool-card-selected')) {

      // Turn off Card selected
      $(this).toggleClass('tool-card-selected');

      // Turn off the "content"
      $('#tool-display').remove();
    } else {


      //Calculate position for detail content
      var positionClick = $(this).position().top;
      var objHeight = $(this).height();
      var rePosition = positionClick + objHeight;



      // Turn off all other active cards
      $(".card.tool-card-selected").toggleClass("tool-card-selected");
      $("#tool-display").remove();


      // Turn off any "display content"
      // Toggle selected on this card.
      $(this).toggleClass('tool-card-selected');


      var cardType = $(this).data("card-type");
      switch (cardType) {
        case 'emod':
          $("#emod-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        case 'cms':
          $("#cms-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        case 'dtk':
          $("#dtk-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        case 'comps':
          $("#comps-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        case 'risk':
          $("#risk-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        case 'vis':
          $("#vis-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent())
          break;
        default:
          console.log('>>> not a valid card type <<<<');
      }

      // Position the tool content / set wrapper height to accommodate.
      $("#tool-display").css({top: rePosition, position: 'absolute'});
      setWrapper(rePosition);

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


    switch (selectorBtn) {
      case 'all':
        selectorBtnFooter = $('<p>Any little thing can be your friend if you let it be.</p>');
        break;
      case 'input':
        $('div[data-card-type="dtk"]').addClass('tool-card-filtered');
        $('div[data-card-type="comps"]').addClass('tool-card-filtered');
        selectorBtnFooter = $('<p>Create the input files used in disease simulations</p>');
        break;
      case 'model':
        //@todo remove cl
        console.log('do model');
        $('div[data-card-type="emod"]').addClass('tool-card-filtered');
        $('div[data-card-type="cms"]').addClass('tool-card-filtered');
        $('div[data-card-type="risk"]').addClass('tool-card-filtered');
        selectorBtnFooter = $('<p>Simulate disease transmission using a variety of models</p>');
        break;
      case 'manage':
        //@todo remove cl
        console.log('Do manage...');
        $('div[data-card-type="dtk"]').addClass('tool-card-filtered');
        $('div[data-card-type="comps"]').addClass('tool-card-filtered');
        selectorBtnFooter = $('<p>Control how simulations run on computing resources</p>');

        break;
      case 'analyze':
        //@todo remove cl
        console.log('Do Analyze');
        $('div[data-card-type="dtk"]').addClass('tool-card-filtered');
        $('div[data-card-type="comps"]').addClass('tool-card-filtered');
        selectorBtnFooter = $('<p>Run data analysis on the output of simulations</p>');
        break;
      case 'visualize':
        //@todo remove cl
        console.log('Do Visualize');
        $('div[data-card-type="dtk"]').addClass('tool-card-filtered');
        $('div[data-card-type="comps"]').addClass('tool-card-filtered');
        $('div[data-card-type="vis"]').addClass('tool-card-filtered');
        selectorBtnFooter = $('<p>Create visualizations of model output</p>');
        break;
      default:
        console.log('>>> Not a valid filter <<<');
    }
    $(selectorBtnFooter).replaceAll('#tool-filter-footer p');



    //Turn on highlight class on appropriate cards / turn off others.

  }

  // End paste


  /* END Code Wrap */
})(jQuery, Drupal);
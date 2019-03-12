/**
 * @file
 * Coding Standards: https://www.drupal.org/node/172169
 */

// JavaScript Document

(function ($, Drupal) {

  'use strict';
  /* CODE GOES HERE  - Code Wrap*/
  //Begin paste/functions

  //Begin paste/functions

  // Attach the handlers
  // $('.card').click(fnClickCard);



  $('.btn-filter-selector').click(fnClickFilter);

  var doMobile = false;

  if (isMobile()) {
    $(".card").click(fnClickCardMobile);

  } else {
    $('.card').click(fnClickCard);
  }



  function fnClickCardMobile() {
    // Which card was clicked
    var cardType = $(this).data("card-type");
    switch (cardType) {
      case 'emod':
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-emod").html());
        break;
      case 'cms':
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-cms").html());
        break;
      case 'dtk':
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-dtk").html());
        break;
      case 'comps':
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-comps").html());
        break;
      case 'risk':
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-risk").html());
        break;
      case 'vis':
        $("#toolsModalTitle").text(cardType);
        $("#modal-body-template").html($("#tool-card-text-vis").html());
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

      console.log("Click OFFSET: " + positionClick);
      console.log("height of object: " + objHeight);


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
          $("#tool-display").css({top: rePosition, position: 'absolute'});
          break;
        case 'cms':
          $("#cms-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          $("#tool-display").css({top: rePosition, position: 'absolute'});
          break;
        case 'dtk':
          $("#dtk-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          $("#tool-display").css({top: rePosition, position: 'absolute'});
          break;
        case 'comps':
          $("#comps-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          $("#tool-display").css({top: rePosition, position: 'absolute'});
          break;
        case 'risk':
          $("#risk-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          $("#tool-display").css({top: rePosition, position: 'absolute'});
          break;
        case 'vis':
          $("#vis-content").clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          $("#tool-display").css({top: rePosition, position: 'absolute'});
          break;
        default:
          console.log('>>> not a valid card type <<<<');
      }
    }
    // End of Desktop/tablet


  }


  // Is mobile test code
  //@todo Verify this code - What screen size should it be
  function isMobile() {
    var isMobile = window.matchMedia("only screen and (max-width: 760px)");
    return isMobile.matches ? true : false;

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
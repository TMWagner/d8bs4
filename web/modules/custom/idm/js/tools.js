/**
 * @file
 * Coding Standards: https://www.drupal.org/node/172169
 */

// JavaScript Document

(function ($, Drupal) {

  'use strict';
  /* CODE GOES HERE  - Code Wrap*/
  //Begin paste/functions

  // Attach the handlers
  $('.card').click(fnClickCard);

  $('.btn-filter-selector').click(fnClickFilter);



  //Click handler
  function fnClickCard() {
    // Set button Active


    if ($(this).hasClass('tool-card-selected')) {

      // Turn off Card selected
      $(this).toggleClass('tool-card-selected');

      // Turn off the "content"
      $('#tool-display').remove();
    }
    else {
      // Turn off all other active cards
      $(".card.tool-card-selected").toggleClass("tool-card-selected");
      $("#tool-display").remove();

      // Turn off any "display content"

      // Toggle selected on this card.
      $(this).toggleClass('tool-card-selected');

      // Load appropriate content
      $( "#hiv-content" ).clone().toggleClass("invisible")
          .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());


      var cardType = $(this).data("card-type");
      switch (cardType) {
        case 'emod':
          $( "#emod-content" ).clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        case 'cms':
          $( "#cms-content" ).clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        case 'dtk':
          $( "#dtk-content" ).clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        case 'comps':
          $( "#comps-content" ).clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        case 'risk':
          $( "#risk-content" ).clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        case 'vis':
          $( "#vis-content" ).clone().toggleClass("invisible")
              .removeAttr("id").attr("id", "tool-display").insertAfter($(this).parent());
          break;
        default:
          console.log('>>> not a valid card type <<<<');
      }
    }
  }

  function fnClickFilter() {
    //turn on active on currant button - turn off on all others.
    // @todo Do we leave ALL selected if clicked?

    var selectorBtn = $(this).attr('id');
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
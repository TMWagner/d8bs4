// JavaScript Document

(function ($, Drupal) {

  'use strict';
  /* CODE GOES HERE  - Code Wrap*/



	// $(document).ready(function() {
	//   $('.nav-tabs-dropdown').each(function(i, elm) {
	//   	$(elm).text($(elm).next('ul').find('li.active a').text());
	//   });
	//
	//   $('.nav-tabs-dropdown').on('click', function(e) {
	//   	e.preventDefault();
	//   	$(e.target).toggleClass('open').next('ul').slideToggle();
	//   });
	//
	//   $('#nav-tabs-wrapper a[data-toggle="tab"]').on('click', function(e) {
	//   	e.preventDefault();
	//   	showHeading(buttonClicked);
	//   	$(e.target).closest('ul').hide().prev('a').removeClass('open').text($(this).text());
	//   });
	//
	// });

// Begin New Code

	$(document).ready(function() {

		$('.nav-tabs-dropdown').each(function (i, elm) {
			$(elm).text($(elm).next('ul').find('li.active a').text());
		});


	// All this does is run the accordion for mobile
		$('.nav-tabs-dropdown').on('click', function (e) {
			console.log("we were clicked...");
			e.preventDefault();
			$(e.target).toggleClass('open').next('ul').slideToggle();
		});

		$('#nav-tabs-wrapper a[data-toggle="tab"]').on('click', function (e) {

			showHeading(e.target.id);
			e.preventDefault();
			$(e.target).closest('ul').hide().prev('a').removeClass('open').text($(this).text());
		});

		function showHeading(buttonClicked) {
			console.log (" >> parameter is: " + buttonClicked);
			switch(buttonClicked) {
				case "tab1":
					$("#heading1").removeClass("hidden");
					$("#heading2").addClass("hidden");
					$("#heading3").addClass("hidden");
					$("#heading4").addClass("hidden");
					$("#heading5").addClass("hidden");
					break;
				case "tab2":
					$("#heading1").addClass("hidden");
					$("#heading2").removeClass("hidden");
					$("#heading3").addClass("hidden");
					$("#heading4").addClass("hidden");
					$("#heading5").addClass("hidden");
					break;
				case "tab3":
					$("#heading1").addClass("hidden");
					$("#heading2").addClass("hidden");
					$("#heading3").removeClass("hidden");
					$("#heading4").addClass("hidden");
					$("#heading5").addClass("hidden");
					break;
				case "tab4":
					$("#heading1").addClass("hidden");
					$("#heading2").addClass("hidden");
					$("#heading3").addClass("hidden");
					$("#heading4").removeClass("hidden");
					$("#heading5").addClass("hidden");
					break;
				case "tab5":
					$("#heading1").addClass("hidden");
					$("#heading2").addClass("hidden");
					$("#heading3").addClass("hidden");
					$("#heading4").addClass("hidden");
					$("#heading5").removeClass("hidden");
					break;
				default:
					console.log( ">>> Debug Invalid data <<<");
				// End Switch Block
			}
		}
	});

	// End New Code









	/* END Code Wrap */
})(jQuery, Drupal);
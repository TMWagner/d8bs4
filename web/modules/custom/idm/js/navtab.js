// JavaScript Document

(function ($, Drupal) {

  'use strict';
  /* CODE GOES HERE  - Code Wrap*/
	$(document).ready(function() {
	  $('.nav-tabs-dropdown').each(function(i, elm) {
				$(elm).text($(elm).next('ul').find('li.active a').text());
			});
			$('.nav-tabs-dropdown').on('click', function(e) {
				e.preventDefault();
				$(e.target).toggleClass('open').next('ul').slideToggle();
			});

			$('#nav-tabs-wrapper a[data-toggle="tab"]').on('click', function(e) {
				e.preventDefault();
				$(e.target).closest('ul').hide().prev('a').removeClass('open').text($(this).text());

			});
		});
 
  /* END Code Wrap */
})(jQuery, Drupal);
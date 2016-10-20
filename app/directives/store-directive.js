(function() {
	'use strict';

	angular
		.module('app')
		.directive('storeCarousel', storeCarousel);

	storeCarousel.$inject = [];
	function storeCarousel() {
		// Usage:
		//
		// Creates:
		//
		var directive = {
				link: link,
				restrict: 'A',
				scope: {
				}
		};
		return directive;
		
		function link(scope, element, attrs) {
			$(document).ready(function(){
				setTimeout(function() {
					$(element).flickity({
						pageDots: false,
						cellAlign: 'left'
					});
				}, 1);
			})
		}
	}
})();
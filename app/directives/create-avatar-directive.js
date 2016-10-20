(function() {
	'use strict';

	angular
		.module('app')
		
		.directive('toggleZoom', function(){
			return {
				restrict: "A",
				link: function(scope, elem, attr){
					elem.on('click', function(e){
						e.preventDefault();
						if(elem.children().hasClass('ci-zoom-out')){
							elem.parent().addClass('zoom-out');
							elem.children().removeClass('ci-zoom-out');
							elem.children().addClass('ci-zoom-in');
						} else{
							elem.parent().removeClass('zoom-out');
							elem.children().removeClass('ci-zoom-in');
							elem.children().addClass('ci-zoom-out');
						}
					});
				}
			}
		})
})();
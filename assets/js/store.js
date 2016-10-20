angular.module('app', ['ngMaterial'])
	.config(function($mdThemingProvider){
		$mdThemingProvider
		.theme('default')
		.primaryPalette('ciayo-dark-blue')
		.accentPalette('ciayo-blue');
	})
	
	.directive("storeCarousel", function(){
		return {
			restrict: "A",
			link: function(scope, elem, attr){
				$(document).on("ready", function(){
					$(elem).flickity({
						pageDots: false,
						cellAlign: 'left',
						contain: true,
						imagesLoaded: true
					})
				})
			}
		}
	})
	
	.controller('appCtrl', function($scope){});
	
$("[data-toggle='modal']").click(function(e){
	e.preventDefault();
	$(document.body).addClass('modal-is-open');
});

$("[data-toggle='modal-close']").click(function(e){
	e.preventDefault();
	$(document.body).removeClass('modal-is-open');
});

$( "#sortable1, #sortable2" ).sortable({
	connectWith: ".connectedSortable"
}).disableSelection();

$( "#startDate, #endDate" ).datepicker();
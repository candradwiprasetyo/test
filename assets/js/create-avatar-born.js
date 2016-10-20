+function(){ 'use strict';
	angular
		.module("app", ["ngMaterial"])
		.config(function($mdThemingProvider){
			$mdThemingProvider
			.theme('default')
			.primaryPalette('ciayo-dark-blue')
			.accentPalette('ciayo-blue');
		})
		.directive('datePicker', function(){
			return {
				restrict : "A",
				link: function(scope, elem, attr){
					$(elem).datepicker();
				}
			}
		})
		.controller('appCtrl', function(){
			
		})
}();
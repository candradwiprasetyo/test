(function() {
	'use strict';

	angular
		.module('app')
		.directive('pagination', pagination);

pagination.$inject = ['CiayoService'];
	function pagination(CiayoService) {
		// Usage:
		//
		// Creates:
		//
		var directive = {
				bindToController: true,
				controller: ControllerController,
				controllerAs: 'vm',
				link: link,
				restrict: 'AE',
				scope: {
					changePage: '=',
					total: '=',
					rePagination: '=',
					page: '='
				},
				template: '<div compile="vm.rePagination()"></div>'
		};
		return directive;
		
		function link(scope, element, attrs) {
		}
	}
	/* @ngInject */
	function ControllerController ($scope) {
		var vm = this;
		
		vm.rePagination = rePagination;

		function rePagination() {
			var total = vm.total;
			var page = vm.page;
			var adjacents = 2;
			var limit = 15;
			

			var prev = parseInt(page) - 1;
			var next = parseInt(page) + 1;
			var lastPage = Math.ceil(total/limit);
			var lpm1 = lastPage - 1;	

			var html = "";

			if(lastPage > 1){
				html += '<div class="c-achv-pagination">';
				//prev button
				if(page > 1){
					html += '<a href="javascript:void(0)" ng-click="vm.changePage('+prev+')"><i class=\"ci-skip s-12 -balik\"></i></a>';
				}

				// pages
				if(lastPage < 7 + (adjacents * 2)){
					for (var c = 1; c <= lastPage; c++){
						if (c == page){
							html += "<span class=\"current\">"+c+"</span>";
						} else {
							html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage("+c+")\">"+c+"</a>";	
						}
					}
				} else if (lastPage > 5 + (adjacents * 2)){
					//close to beginning; only hide later pages
					if(page < 1 + (adjacents * 2))		
					{
						for (var c = 1; c < 4 + adjacents; c++)
						{
							if (c == page) {
								html += "<span class=\"current\">"+c+"</span>";
							} else {
								html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage("+c+")\">"+c+"</a>";
							}
						}
						// html += "...";
						// html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage("+lpm1+")\">"+lpm1+"</a>";
						// html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage("+lastPage+")\">"+lastPage+"</a>";
					}
					//in middle; hide some front and some back
					else if(lastPage - (adjacents * 2) > page && page > (adjacents * 2))
					{
						// html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage(1)\">1</a>";
						// html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage(2)\">2</a>";
						// html += "...";
						for (var c = page - adjacents; c <= page + adjacents; c++)
						{
							if (c == page){
								html += "<span class=\"current\">"+c+"</span>";
							} else {
								html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage("+c+")\">"+c+"</a>";
							}
						}
						// html += "...";
						// html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage("+lpm1+")\">"+lpm1+"</a>";
						// html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage("+lastPage+")\">"+lastPage+"</a>";		
					}
					//close to end; only hide early pages
					else
					{
						// html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage(1)\">1</a>";
						// // html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage(2)\">2</a>";
						// html += "...";
						for (var c = lastPage - (2 + adjacents ); c <= lastPage; c++)
						{
							if (c == page)
								html += "<span class=\"current\">"+c+"</span>";
							else
								html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage("+c+")\">"+c+"</a>";					
						}
					}
				}

				//next button
				if (page < c - 1){
					html += "<a href=\"javascript:void(0)\" ng-click=\"vm.changePage("+next+")\"><i class=\"ci-skip s-12\"></i></a>";
				}

				html += "</div>";	
			}

			return html;
		}
	}
})();
+function(){ "use strict";
	angular
		.module("CiayoCard", [])
		.directive("card", function(){
			return {
				restrict: "E",
				scope: {
					type : "@"
				},
				template: "<div ng-include='getTemplateUrl()'></div>",
				controller: function($scope){
					$scope.getTemplateUrl = function(){
						
						if ($scope.type == "activity"){
							return "../../source/app/directives/card-activity.html";
						}
						
						if ($scope.type == "update"){
							return "../../source/app/directives/card-update.html";
						}
						
						if ($scope.type == "detail"){
							return "../../source/app/directives/card-detail.html";
						}
					}
				}
			}
		})
}();
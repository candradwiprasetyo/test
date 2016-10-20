(function() {
//	'use strict';
	angular
		.module('CiayoParallaxFix',[])
		.directive('cParallax', cParallax)
		.directive('cActivityCard',cActivityCard)
	;
	function cActivityCard($injector){
		return {
			'restrict' : 'E',
			'replace' : true,
			'scope' : {'post':'='},
			'template': '<div id="card"></div>',
			'link':function(scope, element, attrs, controller, transcludeFn){
				var srv={
					amount:0,
					tes1:function(){this.amount++;
						alert('asd');
					},
					tes2:function(){
						console.log('qwe');
					}
				}
				ReactDOM.render(
				  React.createElement(cardComponent, {'post':scope.post,'srv':srv}),
				  element[0]
				);
			}
		}
	}
	function cParallax(){
		return {
			'restrict' : 'E',
			'replace' : true,
			'scope' : {'plx':'=','recompile':'='},
			'templateUrl': 'app/directives/views/parallax.html',
			'controller' : cParallaxCtrl,
			'controllerAs' : 'me'
		}
	}
	function cParallaxCtrl($scope){
		angular.extend(
		$scope,
		{
			init:init,
			state:0,//0->prepare, 1 ready
		});
		init();
		function init(){
			console.log('init');
			$scope.recompile=false;
			$scope.state = 0;
			angular.extend(
			$scope,{
				width : 436,
				height : 312
			});
			$scope.state = 1;
		}
		$scope.toggle = function(){
			$scope.state = $scope.state ==1?0:1;
//			setTimeout($scope.toggle,1);
		}
		$scope.one=function(){
			$scope.state=1;console.log($scope.state);
		}
		$scope.zero=function(){
			$scope.state=0;console.log($scope.state);
		}
		$scope.cek=function(){
			$scope.zero();
			setTimeout($scope.one,1);
		}
		function updateState(){
			
		}
		$scope.$watch(
			function(scope) {
				return scope.recompile;
			},
			function(newValue, oldValue) {
				if(newValue===true && oldValue===false){
					init();
				}
			}
		);
	}
	
})();
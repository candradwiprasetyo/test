+function(){ "use strict";
	angular
		.module("app", ["ngMaterial", "CiayoParallax"])
		.config(function($mdThemingProvider){
			$mdThemingProvider
			.theme('default')
			.primaryPalette('ciayo-dark-blue')
			.accentPalette('ciayo-blue');
		})
		
		.directive("cardActivityToggle", function(){
			return {
				restrict: "E",
				scope: {},
				link: function(scope, elem, attrs){
					elem.on("click", function(){
						$(this).parent().siblings().removeClass('-active');
						$(this).parent().addClass('-active');
					})
				}
			}
		})
		
		.directive("toggleActivityClose", function(){
			return {
				restrict: "A",
				scope: {},
				link: function(scope, elem, attrs){
					elem.on("click", function(){
						$(this).parent().siblings().removeClass('-active');
					});
				}
			}
		})
		
		.directive("toggleCardOption", function(){
			return {
				restrict: "A",
				scope: {},
				link: function(scope, elem, attrs){
					elem.on("click", function(){
						if(attrs.toggleCardOption === "close"){
							$(this).closest("card-option-pane").removeClass("-active");
							$(this).closest("card-option-pane").siblings("card-option-button").removeClass("-shift");
						} else{
							$(this).closest("card-option-button").addClass("-shift");
							$(this).closest("card-option").children("." + attrs.toggleCardOption).addClass("-active")
						}
					});
				}
			}
		})
		
		.directive("cardTabToggle", function(){
			return {
				restrict: "E",
				scope: {},
				link: function(scope, elem, attrs){
					elem.on("click", function(){
						var activating = $(this).parent();
						var previously = $(this).parent().siblings('.-active');
						
						if($(previously).index() >= 0){
							$(previously).removeClass('-active');
							$(activating).addClass('-active');
							$(this).parent().siblings('card-tab-active').css({"top":$(this).position().top, "height": $(this).height()});
						}
					});
				}
			}
		})
		
		.directive("toggleCardComment", function(){
			return {
				restrict: "A",
				link: function(scope, elem, attrs){
					elem.on("click", function(e){
						e.preventDefault();
						$(this).siblings('._nested').addClass('-open');
						$(this).hide();
					})
				}
			}
		})
		.controller('appCtrl', function($scope){
			$scope.activity_detail = [
				{
					"activity_id": 1,
					"name" : "Lari Pagi",
					"preview": "lari_pagi.png",
					"image": [
						{"layer": 4,"type":"background","url":'../assets/img/timeline/sample1/BG_A14_015_LAYER_01.png'},
						{"layer": 3,"type":"background","url":'../assets/img/timeline/sample1/BG_A14_015_LAYER_02.png'},
						{"layer": 2,"type":"foreground","url":'../assets/img/timeline/sample1/BG_A14_015_LAYER_03.png'},
						{"layer": 2,"type":"activity","url":'../assets/img/timeline/sample1/BG_A14_015_LAYER_05.png'},
						{"layer": 2,"type":"activity","url":'../assets/img/timeline/sample1/BG_A14_015_LAYER_06.png'}
					],
					"avatar_url" : [
						{'flat':'avatars_user_524X375.png'},
						{'happy':'../assets/img/timeline/sample1/BG_A14_015_LAYER_07.png'},
						{'sad':'avatars_user_524X375.png'}
					],
					"back_hair" : '../assets/img/timeline/sample1/BG_A14_015_LAYER_04.png',
					"avatar_size" : "100%",
					"avatar_rotation" : "0",
					"avatar_angle_id" : "1",
					"avatar_position" : "0%,0%",
					"buble_text_position" : "20%,38%",
					"buble_text":"",
					"buble_text_width":"10%",
					"buble_text_height":"10%"
				},
				{
					"activity_id": 2,
					"name" : "tes",
					"preview": "lari_pagi.png",
					"image": [
						{"layer": 4,"type":"background","url":'../assets/img/timeline/sample2/BG_A03_010_LAYER_01.png'},
						{"layer": 3,"type":"background","url":'../assets/img/timeline/sample2/BG_A03_010_LAYER_02.png'},
						{"layer": 2,"type":"foreground","url":'../assets/img/timeline/sample2/BG_A03_010_LAYER_03.png'},
						{"layer": 2,"type":"activity","url":'../assets/img/timeline/sample2/BG_A03_010_LAYER_04.png'}
					],
					"avatar_url" : [
						{'flat':'avatars_user_524X375.png'},
						{'happy':'../assets/img/timeline/sample2/BG_A03_010_LAYER_05.png'},
						{'sad':'avatars_user_524X375.png'}
					],
					"back_hair" : '',
					"avatar_size" : "100%",
					"avatar_rotation" : "0",
					"avatar_angle_id" : "1",
					"avatar_position" : "0%,0%",
					"buble_text_position" : "40%,38%",
					"buble_text":"",
					"buble_text_width":"10%",
					"buble_text_height":"10%"
				}
			];
		})
}();
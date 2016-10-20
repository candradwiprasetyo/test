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
//					elem.on("click", function(){
//						$(this).parent().siblings().removeClass('-active');
//						$(this).parent().addClass('-active');
//					})
				}
			}
		})
		
		.directive("toggleActivityClose", function(){
			return {
				restrict: "A",
				scope: {},
				link: function(scope, elem, attrs){
//					elem.on("click", function(){
//						$(this).parent().siblings().removeClass('-active');
//					});
				}
			}
		})
		
		.directive("toggleCardOption", function(){
			return {
				restrict: "A",
				scope: {},
				link: function(scope, elem, attrs){
//					elem.on("click", function(){
//						if(attrs.toggleCardOption === "close"){
//							$(this).closest("card-option-pane").removeClass("-active");
//							$(this).closest("card-option-pane").siblings("card-option-button").removeClass("-shift");
//						} else{
//							$(this).closest("card-option-button").addClass("-shift");
//							$(this).closest("card-option").children("." + attrs.toggleCardOption).addClass("-active")
//						}
//					});
				}
			}
		})
		
		.directive("cardTabToggle", function(){
			return {
				restrict: "E",
				scope: {},
				link: function(scope, elem, attrs){
//					elem.on("click", function(){
//						var activating = $(this).parent();
//						var previously = $(this).parent().siblings('.-active');
//						
//						if($(previously).index() >= 0){
//							$(previously).removeClass('-active');
//							$(activating).addClass('-active');
//							$(this).parent().siblings('card-tab-active').css({"top":$(this).position().top, "height": $(this).height()});
//						}
//					});
				}
			}
		})
		
		.directive("toggleCardComment", function(){
			return {
				restrict: "A",
				link: function(scope, elem, attrs){
//					elem.on("click", function(e){
//						e.preventDefault();
//						$(this).siblings('._nested').addClass('-open');
//						$(this).hide();
//					})
				}
			}
		})
		.controller('appCtrl', function($scope){
		$scope.number = [];
		for(var i=0;i<50;i++){
			$scope.number.push({i});
		}
		$scope.getNumber = function(num) {
				return new Array(num);   
		}
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
		
		.controller('activityController', ['$scope','$http', function ($scope, $http) {
			// Privacy Setting
			$scope.ptsbs = [
				'Public',
				'Friends',
				'Best Friends',
				'Family',
				'Only Me'
			];
			$scope.ptsbSelected = 0;
			$scope.selectPTSB = function(opt){
				$scope.ptsbSelected = opt;
			};
			
			// Privacy Setting Button
			$scope.isActivePTSB = false;
			$scope.togglePTSB = function(){
				$scope.isActivePTSB = !$scope.isActivePTSB;
			};
			
			// Activity (SA)
			$scope.listAct = [];
			$scope.selectedAct = null;
			$scope.selectedActIndex = -1;
			$scope.searchAct = function(){
				$scope.selectedAct = null;
				$scope.selectedActIndex = -1;
				$http.get('../json/activity.json').success(function(data){
					$scope.listAct = data;
				});
			};
			$scope.selectAct = function(index){
				$scope.actKey = $scope.listAct[index].name;
				$scope.selectedAct = $scope.listAct[index];
				$scope.listAct = [];
			};
			$scope.checkKeyDownAct = function(event){
				if(event.keyCode === 40){
					event.preventDefault();
					if($scope.selectedActIndex+1 !== $scope.listAct.length){
						$scope.selectedActIndex++;
					}
				}
				else if(event.keyCode === 38){
					event.preventDefault();
					if($scope.selectedActIndex-1 !== -1){
						$scope.selectedActIndex--;
					}
				}
				else if(event.keyCode === 13){
					$scope.selectAct($scope.selectedActIndex);
				}
			};
			
			// Mood
			$scope.moods = [
				{"name":"Happy","img":"img"},
				{"name":"Normal","img":"img"},
				{"name":"Sad","img":"img"}
			];
			$scope.moodSelected = 1;
			$scope.selectMood = function(index){
				$scope.moodSelected = index;	
			};
			
			// Item
			$scope.listItem = [];
			$scope.listItemSelected = [
				{
					"name": "item 1",
					"img": "",
					"img_thumb": ""
				},
				{
					"name": "item 2",
					"img": "",
					"img_thumb": ""
				},
				{
					"name": "item 3",
					"img": "",
					"img_thumb": ""
				},
				{
					"name": "item 4",
					"img": "",
					"img_thumb": ""
				}
			];
			$scope.selectedItemIndex = -1;
			$scope.searchItem = function(){
				$scope.selectedItemIndex = -1;
				$http.get('../json/item.json').success(function(data){
					$scope.listItem = data;
				});
			};
			$scope.checkKeyDownItem = function(event){
				if(event.keyCode === 40){
					event.preventDefault();
					if($scope.selectedItemIndex+1 !== $scope.listItem.length){
						$scope.selectedItemIndex++;
					}
				}
				else if(event.keyCode === 38){
					event.preventDefault();
					if($scope.selectedItemIndex-1 !== -1){
						$scope.selectedItemIndex--;
					}
				}
				else if(event.keyCode === 13){
					$scope.selectItem($scope.listItem[$scope.selectedItemIndex]);
				}
			};
			$scope.selectItem = function(item){
				$scope.itemKey=null;
				var lastItem = $scope.lastItemIndex();
				var inList = $scope.inListItemSelected(item);
				if(!inList){
					if(lastItem != 4){
						$scope.listItemSelected[lastItem] = item;
						$scope.itemKey = '';
					} else {
						alert('sudah penuh om');
					}
				} else {
					var ind = 0;
					for(var i = 0; i < $scope.listItemSelected.length; i++){
						if($scope.listItemSelected[i].name === item.name){
							ind = i;
						}
					}
					$scope.listItemSelected[ind] = {
						"name": "item "+(ind+1),
						"img": "",
						"img_thumb": ""
					};
				}
			};
			$scope.lastItemIndex = function(){
				for(var i = 0; i < $scope.listItemSelected.length; i++){
					if($scope.listItemSelected[i].img === ''){
						return i;
					}
				}
				return 4;
			};
			$scope.inListItemSelected = function(item){
				for(var i = 0; i < $scope.listItemSelected.length; i++){
					if($scope.listItemSelected[i].name === item.name){
						return true;
					}
				}
				return false;
			};
			$scope.resetListItem = function(){
				$scope.listItemSelected = [
					{
						"name": "item 1",
						"img": "",
						"img_thumb": ""
					},
					{
						"name": "item 2",
						"img": "",
						"img_thumb": ""
					},
					{
						"name": "item 3",
						"img": "",
						"img_thumb": ""
					},
					{
						"name": "item 4",
						"img": "",
						"img_thumb": ""
					}
				];  
			};
			
			// Friend
			$scope.listFriend = [];
			$scope.listFriendSelected = [];
			$scope.selectedFriendIndex = -1;
			$scope.searchFriend = function(){
				$scope.selectedFriendIndex = -1;
				$http.get('../json/friend.json').success(function(data){
					$scope.listFriend = data;
				});
			};
			$scope.checkKeyDownFriend = function(event){
				if(event.keyCode === 40){
					event.preventDefault();
					if($scope.selectedFriendIndex+1 !== $scope.listFriend.length){
						$scope.selectedFriendIndex++;
					}
				}
				else if(event.keyCode === 38){
					event.preventDefault();
					if($scope.selectedFriendIndex-1 !== -1){
						$scope.selectedFriendIndex--;
					}
				}
				else if(event.keyCode === 13){
					$scope.selectFriend($scope.listFriend[$scope.selectedFriendIndex]);
				}
			};
			$scope.selectFriend = function(friend){
				if(!$scope.inListFriendSelected(friend)){
					$scope.listFriendSelected.push(friend);
					$scope.friendKey = '';
				} else {
					var ind = $scope.listFriendSelected.indexOf(friend);
					$scope.listFriendSelected.splice(ind, 1);
				}
			};
			$scope.inListFriendSelected = function(friend){
				for(var i = 0; i < $scope.listFriendSelected.length; i++){
					if($scope.listFriendSelected[i].name === friend.name){
						return true;
					}
				}
				return false;
			};
			$scope.resetFriend = function(){
				$scope.listFriendSelected = [];
			};
			
			// Place
			$scope.listPlace = [];
			$scope.placeSelected = {
				"name": "place",
				"type": "",
				"img": "",
				"img_thumb": ""
			};
			$scope.selectedPlaceIndex = -1;
			$scope.searchPlace = function(){
				$scope.selectedPlaceIndex = -1;
				$http.get('../json/place.json').success(function(data){
					$scope.listPlace = data;
				});
			};
			$scope.checkKeyDownPlace = function(event){
				if(event.keyCode === 40){
					event.preventDefault();
					if($scope.selectedPlaceIndex+1 !== $scope.listPlace.length){
						$scope.selectedPlaceIndex++;
					}
				}
				else if(event.keyCode === 38){
					event.preventDefault();
					if($scope.selectedPlaceIndex-1 !== -1){
						$scope.selectedPlaceIndex--;
					}
				}
				else if(event.keyCode === 13){
					$scope.selectPlace($scope.listPlace[$scope.selectedPlaceIndex]);
				}
			};
			$scope.selectPlace = function(place){
				$scope.placeSelected = place;  
				$scope.placeKey = '';
			};
			
			// Tab Posting Activity
			$scope.editActivity = 'captions';
			$scope.selectEdit = function(e){
				$scope.editActivity = e;
			}
			
			// Reset Post
			$scope.resetPost = function(){
				// Reset Activity
				$scope.actKey = '';	
				$scope.selectedIndex = -1;
				$scope.listAct = [];
				$scope.selectedAct = null;
				
				// Reset Mood
				$scope.moodSelected = 1;
				
				// Reset List Item
				$scope.resetListItem();

				// Reset List Friend
				$scope.resetFriend();
				
				// Reset Place
				$scope.placeSelected = {
					"name": "place",
					"type": "",
					"img": "",
					"img_thumb": ""
				};
				
				// Reset Caption
				$scope.previewCaption = '';
				
				// Reset Edit Activity
				$scope.editActivity = 'captions';
			};
		}])
		
		.filter('firstName', function () {
			return function (str) {
				var name = str.split(" ");
				return name[0];
			}
		})
		
		.filter('matchedBold', ['$sce', function ($sce) {
			return function (str, model) {
				var result = '';
				var name = str.split(' ');
				for(var i = 0; i < name.length; i++){
					if(angular.lowercase(name[i]) === angular.lowercase(model)){
						result += '<strong>'+name[i]+'</strong> ';
					} else {
						result += name[i]+' ';
					}
				}
				return $sce.trustAsHtml(result);
			}
		}]);
}();
+function(){ "use strict";
	angular
		.module("CiayoProfile", [])
		.directive('cProfile',function() {
			return {
				restrict: "E",
				scope:{},
				replace:true,
				templateUrl:'app/directives/views/post.html',
				controller: function($scope,$element){
					var me=this;
					angular.extend(me,{
						
					});
				},
				controllerAs:'me'
			};
		})
		.directive('cMutualFriend',function() {
			return {
				restrict: "E",
				scope:{'userId':'=',mutualFriendCount:'='},
				replace:true,
				templateUrl:'app/directives/views/profile-mutual-friend.html',
				controller: function($scope,$element,ConnectionService){
					var me=this;
					angular.extend(me,{
						isActive:false,
						mutual_friend_count:$scope.mutualFriendCount,
						class:'up',
						data:[],
						more:false,
						showTooltip:showTooltip,
						hideTooltip:hideTooltip
					});
					function showTooltip($event){
						if(me.data && me.data.length==0)
						ConnectionService.getMutualFriend(
							$scope.userId,
							function(response){
								var data=response.data.c.data;
								if(data.error==false){
									me.data=data.content.list_user;
									me.more=(me.data && me.mutual_friend_count-me.data.length>10);//console.log(me.more);
								}
							},
							function(){
								alert('ERROR API')
							}
						);
						
						var tooltip=$element.find('.mf-tooltip');
						var offset=$element.offset();
//						tooltip.addClass('up');
						tooltip.css('position','fixed');//console.log(offset);
						if(me.class=='down'){
							tooltip.css('top',offset.top+$element.height()-angular.element(document).scrollTop());
						}
						else
						if(me.class=='up'){console.log()
							tooltip.css('bottom',angular.element(window).height()-(offset.top-angular.element(document).scrollTop()));
						}
						tooltip.css('left',offset.left);
						me.isActive=true;
					}
					function hideTooltip(){
						me.isActive=false;
					}
				},
				link:function($scope,$element){
					
				},
				controllerAs:'me'
			};
		})
	/*
	
	*/
}();
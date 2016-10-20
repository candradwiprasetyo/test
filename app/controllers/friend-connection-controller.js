(function () {
	'use strict';
	angular
		.module('app')
		.controller('FriendConnectionController', FriendConnectionController)
	;
	
	FriendConnectionController.$inject = ['$rootScope','AuthService','CiayoService','ConnectionService','$cookieStore', '$stateParams', '$state'];
	function FriendConnectionController($rootScope,AuthService, CiayoService,ConnectionService,$cookieStore, $stateParams, $state){
		var me = this;
		angular.extend(me,{
			action_check_me:action_check_me,
			show_frame:show_frame,
			close_frame:close_frame,
			cancel_friend_request:cancel_friend_request,
			action_addfriend:action_addfriend,
			action_response:action_response,
			closeActionResponse:closeActionResponse,
			action_response_accept:action_response_accept,
			action_response_delete:action_response_delete,
			action_deletefriend:action_deletefriend,
			action_follow:action_follow,
			action_unfollow:action_unfollow
		});

		function action_check_me(username){
			//alert(username);
			$state.go('profile', {user: username});
		}

		function show_frame(user){



				$rootScope.$broadcast( "friend.search_result",'data');
				$rootScope.$broadcast( "friend.profile",'data');
				$rootScope.$broadcast( "mutual_friend.profile",'data');
				$rootScope.$broadcast( "friend.trending_people",'data');
				user.open_action = true;

			
		}
		function close_frame(user){
			user.open_action = false;
		}

		// add friend
		function action_addfriend(user){
			//alert(user_id+'_'+id);
			user.addfriend_disabled = true;

			if(user.type_page=='trending'){
				$rootScope.$broadcast( "add_friend.trending", user.user_id);
			}

			var user_id = user.user_id;

			ConnectionService.requestAddFriend(user_id, function(response){
				console.log(response);
				user.icon_addfriend = false;
				user.name_addfriend = false;
				user.ci_check = true;

				user.icon_follow = false;
				user.name_follow = false;
				user.addfriend_disabled = false;

			},function(response){
				//console.log(response);
			});
		}

		// cancel friend request
		function cancel_friend_request(user){

			user.cancel_disabled = true;

			if(user.type_page=='trending'){
				$rootScope.$broadcast( "cancel_friend.trending", user.user_id);
			}

			var user_id = user.user_id;
			ConnectionService.requestCancelFriendRequest(user_id, function(response){
				user.icon_addfriend = true;
				user.name_addfriend = true;
				user.icon_self = 0;
				user.name_self = 0;
				user.ci_star = false;
				user.icon_action_response = false;
				user.cancel_disabled = false;

			},function(response){
				console.log(response);
			});
		}

		// Action response (accept or reject)
		function action_response(user){
			
			user.icon_action_response = true;
			
		}

		// click outside action-response
		function closeActionResponse(user){
			//alert("test");
			user.icon_action_response = false;
		}

		// action accept
		function action_response_accept(user){

			if(user.type_page=='trending'){
				$rootScope.$broadcast( "accept_friend.trending", user.user_id);
			}

			var user_id = user.user_id;
						
			ConnectionService.requestConfirmFriendRequest(user_id, function(response){
				user.icon_addfriend = false;
				user.name_addfriend = false;
				user.checklist_addfriend = false;
				user.icon_follow = false;
				user.name_follow = false;
				user.icon_action_response = false;
				user.status.friend.approve=true;
				user.hide_approve = true;
				user.success_add = true;

				$rootScope.$broadcast( "user.added_friend",'data' );

			},function(response){
				//console.log(response);
			});
		}

		function action_response_delete(user){

			if(user.type_page=='trending'){
				$rootScope.$broadcast( "decline_friend.trending", user.user_id);
			}
			
			var user_id = user.user_id;
						
			ConnectionService.requestRejectFriendRequest(user_id, function(response){
				user.icon_addfriend = true;
				user.name_addfriend = true;
				user.icon_self = 0;
				user.name_self = 0;
				user.ci_star = false;
				user.icon_action_response = false;
				user.success_add = true;

				$rootScope.$broadcast( "user.added_friend",'data' );

			},function(response){
				//console.log(response);
			});
		}
		me.test=test;

		function test(){
			$rootScope.$broadcast( "user.added_friend", 'data');
		}

		// action delete friend
		function action_deletefriend(user){
			
			var user_id = user.user_id;

			ConnectionService.requestDeleteFriend(user_id, function(response){
				console.log(response);
				user.icon_addfriend = true;
				user.name_addfriend = true;
				user.icon_self = 0;
				user.name_self = 0;

			},function(response){
				//console.log(response);
			});
		}

		// action follow
		function action_follow(user){
			
			//console.log(user);
			user.follow_disabled = true;

			if(user.type_page=='timeline'){
				$rootScope.$broadcast( "status_follow.timeline", user.user_id);
			}else if(user.type_page=='trending'){
				$rootScope.$broadcast( "status_follow.trending", user.user_id);
			}

			var user_id = user.user_id;
			
			ConnectionService.requestFollow(user_id, true, function(response){
				//console.log(response);
				user.icon_follow = false;
				user.name_follow = false;
				user.follow_disabled = false;

			},function(response){
				//console.log(response);
			});
		}

		// action unfollow
		function action_unfollow(user){
			user.follow_disabled = true;

			if(user.type_page=='timeline'){
				//console.log('timeline');
				$rootScope.$broadcast( "status_unfollow.timeline", user.user_id);
			}else if(user.type_page=='trending'){
				//console.log('trending');
				$rootScope.$broadcast( "status_unfollow.trending", user.user_id);
			}
			//alert(user_id+'_'+id);
			var user_id = user.user_id;
			
			ConnectionService.requestFollow(user_id, false, function(response){
				//console.log(response);
				user.icon_follow = true;
				user.name_follow = true;
				user.follow_disabled = false;

			},function(response){
				//console.log(response);
			});
		}


		
	}
})();
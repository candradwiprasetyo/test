(function() {
'use strict';

	angular
		.module('app')
		.factory('ConnectionService', ConnectionService);

	ConnectionService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService'];
	function ConnectionService($http, $cookieStore, $rootScope, CiayoService) {
		var service = {
			requestFollow:requestFollow,
			requestCreate:requestCreate,
			requestLoad:requestLoad,
			requestConfirm:requestConfirm,
			requestDelete:requestDelete,
			userBlock:userBlock,
			userUnblock:userUnblock,
			blocklist:blocklist,
			listSearchResult:listSearchResult,
			listNotification:listNotification,
			requestDeleteNotification:requestDeleteNotification,
			requestMarkAllNotification:requestMarkAllNotification,
			requestViewNotification:requestViewNotification,
			listFriendRequest:listFriendRequest,
			requestConfirmFriendRequest:requestConfirmFriendRequest,
			requestRejectFriendRequest:requestRejectFriendRequest,
			requestBlockFriendRequest:requestBlockFriendRequest,
			getMutualFriend:getMutualFriend,
			requestAddFriend:requestAddFriend,
			listFriends:listFriends,
			requestDeleteFriend:requestDeleteFriend,
			listMutualFriends:listMutualFriends,
			requestCancelFriendRequest:requestCancelFriendRequest,
			shareFacebook:shareFacebook
		};
		
		return service;
		
		function shareFacebook(access_token, uid, callback,errCallback){
			var c={
				data:{
					access_token:access_token,
					uid:uid
				}
			};
			CiayoService.Api('facebook/share/invite', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function requestFollow(user_id,follow,callback,errCallback){
			var c={
				data:{
					user_id:user_id,
					follow:follow
				}
			};
			CiayoService.Api('users/follow', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function requestCreate(friend_id,category_id,callback,errCallback){
			var c={
				data:{
					friend_id:friend_id,
					category_id:category_id
				}
			};
			CiayoService.Api('users/relation/create', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function requestLoad(limit,offset,callback,errCallback){
			var c={
				data:{
					limit:limit,
					offset:offset
				}
			};
			CiayoService.Api('users/relation', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function requestConfirm(user_relation_id,callback,errCallback){
			var c={
				data:{
					"user_relation_id": user_relation_id,
				}
			};
			CiayoService.Api('users/relation/confirm', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function requestDelete(friend_id,callback,errCallback){
			var c={
				data:{
					"friend_id": friend_id,
				}
			};
			CiayoService.Api('users/relation/reject', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function userBlock(user_id,callback,errCallback){
			var c={
				data:{
					"user_id": user_id,
				}
			};
			CiayoService.Api('users/block', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function userUnblock(user_id,callback,errCallback){
			var c={
				data:{
					"user_id": user_id,
				}
			};
			CiayoService.Api('users/unblock', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function blocklist(callback,errCallback){
			var c={
				data:{ }
			};
			CiayoService.Api('users/block/list', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function listSearchResult(keyword, limit, offset, callback,errCallback){
			var c = {
				data: {
					"keyword": keyword,
					"limit": limit,
					"offset": offset
				}
			}
			CiayoService.Api('search/user/name', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function listNotification(type, limit, offset, callback,errCallback){
			var c = {
				data: {
					"type": type,
					"limit": limit,
					"offset": offset,
					"order_by": 'created_at'
				}
			}
			CiayoService.Api('notification', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function requestDeleteNotification(notification_id, type, callback,errCallback){
			var c={
				data:{
					"notification_id": notification_id,
					"type" : type
				}
			};
			CiayoService.Api('notification/delete', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function requestMarkAllNotification(callback,errCallback){
			var c={
				data:{	}
			};
			CiayoService.Api('notification/read/all', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function requestViewNotification(notification_id, type, read_at, callback,errCallback){
			var c={
				data:{
					"notification_id": notification_id,
					"type" : type,
					"read_at" : read_at
				}
			};
			CiayoService.Api('notification/read', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function listFriendRequest(limit, offset, callback,errCallback){
			var c = {
				data: {
					"limit": limit,
					"offset": offset
				}
			}
			CiayoService.Api('users/relation', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function requestConfirmFriendRequest(user_relation_id, callback,errCallback){
			var c={
				data:{
					"user_relation_id": user_relation_id
				}
			};
			CiayoService.Api('users/relation/confirm', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function requestRejectFriendRequest(friend_id, callback,errCallback){
			var c={
				data:{
					"friend_id": friend_id
				}
			};
			CiayoService.Api('users/relation/reject', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function requestCancelFriendRequest(friend_id, callback,errCallback){
			var c={
				data:{
					"friend_id": friend_id
				}
			};
			CiayoService.Api('users/relation/cancel', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}


		function requestBlockFriendRequest(user_id, callback,errCallback){
			var c={
				data:{
					"user_id": user_id
				}
			};
			CiayoService.Api('users/block', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function getMutualFriend(user_id, callback,errCallback){
			var c={
				data:{
					"user_id": user_id
				}
			};
			CiayoService.Api('users/friend/mutual', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function requestAddFriend(friend_id, callback,errCallback){
			var c={
				data:{
					"friend_id": friend_id
				}
			};
			CiayoService.Api('users/relation/create', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function listFriends(user_id, keyword, offset, limit, callback,errCallback){
			var c = {
				data: {
					"user_id": user_id,
					"keyword": keyword,
					"offset": offset,
					"limit": limit
				}
			}
			
			CiayoService.Api('search/friend/name', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function requestDeleteFriend(friend_id, callback,errCallback){
			var c={
				data:{
					"friend_id": friend_id
				}
			};
			CiayoService.Api('users/relation/delete', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function listMutualFriends(keyword, limit, offset, user_id, callback,errCallback){
			var c = {
				data: {
					"limit": limit,
					"offset": offset,
					"user_id": user_id,
					"keyword": keyword 

				}
			}
			CiayoService.Api('users/friend/mutual', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}


					var user_added_friend = $rootScope.$on(
                        "user.added_friend",
                        function() {
                            alert('added_friend');
                        }
                    );
	}
})();
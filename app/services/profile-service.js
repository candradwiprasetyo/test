(function() {
'use strict';

	angular
		.module('app')
		.factory('ProfileService', ProfileService);

	ProfileService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService'];
	function ProfileService($http, $cookieStore, $rootScope, CiayoService) {
		var service = {
			userData:null,
			userInfo:userInfo,
			userInfoPublic:userInfoPublic,
			getStatusInfo:getStatusInfo,
			requestFollow:requestFollow,
			searchUser:searchUser,
			searchFriend:searchFriend,
			listBadge:listBadge,
			listCities:listCities,
			listAchievement:listAchievement,
			choiceAchievement:choiceAchievement,
			choiceAchievementPublic:choiceAchievementPublic,
			choiceBadgePublic:choiceBadgePublic,
			confirmRequestFriend:confirmRequestFriend,
			saveChoiceAchievement:saveChoiceAchievement,
			rejectRequestFriend:rejectRequestFriend,
			deleteFriend:deleteFriend,
			listTitle:listTitle,
			choiceBadge:choiceBadge,
			saveChoiceBadge:saveChoiceBadge
		};
		
		
		
		function userInfo(username, callback, errCallback) {
			if(service.userData!=null && (username=='' || username==null)){
				callback(service.userData);
				return;
			}
			var c={
				data:{
						username:username
				}
			};
			CiayoService.Api('users/info', c, function(response) {
				var isOK=false;
				//console.log(response);
				if(response.status==200) {
					var data= response.data.c.data;
					if(data.error==false){
						isOK=true;
					}
				}
				if(isOK){
					var _return = { };
					_return.profile=[];
					angular.forEach(data.content.users_info,function(value,key){
						_return.profile[value.filter_id]=value;
					});
					_return.user_id = data.content.user_id || null;
					_return.user_avatar = data.content.users_avatar;
					if(username=='' || username==null){
						service.userData=_return;
					}
					callback(_return);
				}else{
					errCallback(response);
				}
			});
		}

		function userInfoPublic(username, callback, errCallback) {
			if(service.userData!=null && (username=='' || username==null)){
				callback(service.userData);
				return;
			}
			var c={
				data:{
						username:username
				}
			};
			CiayoService.Api('public/users/info', c, function(response) {
				var isOK=false;
				if(response.status==200) {
					var data= response.data.c.data;
					if(data.error==false){
						isOK=true;
					}
				}
				if(isOK){
					var _return = { };
					_return.profile=[];
					angular.forEach(data.content.users_info,function(value,key){
						_return.profile[value.filter_id]=value;
					});
					_return.user_id = data.content.user_id;
					_return.user_avatar = data.content.users_avatar;
					_return.email = data.content.email;
					_return.phone = (data.content.phone!=null) ? data.content.phone : '';
					if(username=='' || username==null){
						service.userData=_return;
					}
					callback(_return);
				}else{
					errCallback(response);
				}
			});
		}

		function getStatusInfo(username, callback, errCallback) {
			if(service.userData!=null && (username=='' || username==null)){
				callback(service.userData);
				return;
			}
			var c={
				data:{
						username:username
				}
			};
			CiayoService.Api('users/info', c, function(response) {
				var isOK=false;
				if(response.status==200) {
					var data= response.data.c.data;
					if(data.error==false){
						isOK=true;
					}
				}
				if(isOK){
					var _return = { };
					_return = data.content;
					
					
					callback(_return);
				}else{
					errCallback(response);
				}
			});
		}
		//http://192.168.35.56:8000/login
		//{"data":{"email":"miftarockavanka@gmail.com","password":"superadmi","latitude":"32","longitude":"32"}}
		// {"data":{"user_id":"1"}}
		function requestFollow(user_id,callback,errCallback){
			var c={
				data:{
					user_id:user_id
				}
			};
			CiayoService.Api('user/info', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function searchUser(keyword,limit,offset,callback,errCallback){
			var c={
				data:{
					keyword:keyword,
					limit:limit,
					offset:offset
				}
			};
			CiayoService.Api('search/user/name', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function searchFriend(keyword,limit,offset,callback,errCallback){
			var c={
				data:{
					keyword:keyword,
					limit:limit,
					offset:offset
				}
			};
			CiayoService.Api('search/friend/name', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function listTitle(orderType,orderBy,limit,offset,tittle,callback,errCallback){
			var c={
				data:{
					
					tittle:tittle
				}
			};
			CiayoService.Api('users/achievement/all', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function confirmRequestFriend(user_relation_id,callback,errCallback){
			var c={
				data:{
					user_relation_id:user_relation_id
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

		function rejectRequestFriend(friend_id,callback,errCallback){
			var c={
				data:{
					friend_id:friend_id
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

		function deleteFriend(friend_id,callback,errCallback){
			var c={
				data:{
					friend_id:friend_id
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
		
		function listBadge(orderType,orderBy,limit,offset,callback,errCallback){
			var c={
				data:{
					orderType:orderType,
					orderBy:orderBy,
					limit:limit,
					offset:offset
				}
			};
			CiayoService.Api('badge', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function getPlace(place_id,callback,errCallback) {
			var c={
				data:{
					place_id:place_id
				}
			};
			CiayoService.Api('place/detail', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function listCities(keyword, country_id, callback,errCallback) {
			var c={
				data:{
					keyword:keyword,
					country_id:country_id
				}
			};
			CiayoService.Api('place/cities', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function listAchievement(orderType,orderBy,limit,offset,search,callback,errCallback){
			var c={
				data:{
					orderType:orderType,
					orderBy:orderBy,
					limit:limit,
					offset:offset,
					search:search
				}
			};
			CiayoService.Api('achievement/completed', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function choiceAchievementPublic(username, type, callback,errCallback){
			var c={
				data:{
					username:username,
					type:type

				}
			};
			CiayoService.Api('public/users/achievement/choice', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		};

		function choiceBadgePublic(username, type, callback,errCallback){
			var c={
				data:{
					username:username,
					type:type

				}
			};
			CiayoService.Api('public/users/achievement/choice', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		};

		function choiceAchievement(user_id, callback,errCallback){
			var c={
				data:{
					user_id:user_id
				}
			};
			CiayoService.Api('users/achievement/choice', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		};

		function choiceBadge(user_id, callback,errCallback){
			var c={
				data:{
					type:"badge",
					user_id:user_id
				}
			};
			CiayoService.Api('users/achievement/choice', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		};

		function saveChoiceAchievement(user_threshold,callback,errCallback){
			var c={
				data:{
					user_threshold:user_threshold
				}
			};
			CiayoService.Api('users/achievement/save', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function saveChoiceBadge(user_threshold,callback,errCallback){
			var c={
				data:{
					type: "badge",
					user_threshold:user_threshold
				}
			};
			CiayoService.Api('users/achievement/save', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		return service;
	}
})();
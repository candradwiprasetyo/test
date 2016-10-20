(function () {
	'use strict';

	angular
		.module('app')
		.factory('PostService', PostService);

	PostService.$inject = ['$http', '$cookieStore', '$rootScope','$q', 'CiayoService'];

	function PostService($http, $cookieStore, $rootScope,$q, CiayoService) {
		var service = {
			permission_list: permission_list,
			mood_list: mood_list,
			deletePost: deletePost,
			subscribePost:subscribePost,
			unsubscribePost: unsubscribePost,
			postAttributes: postAttributes,
			updatePermission: updatePermission,
			searchActivity: searchActivity,
			activityDetail: activityDetail,
			searchPlace: searchPlace,
			timelineUser: timelineUser,
			timelineUserPublic: timelineUserPublic,
			timeline: timeline,
			public_detail:public_detail,
			detail: detail,
			create: create,
			createEmotion: createEmotion,
			share: share,
			disableComment: disableComment,
			updateWith: updateWith,
			updateCaption: updateCaption,
			createComment: createComment,
			loadComment: loadComment,
			editComment: editComment,
			deleteComment: deleteComment,
			reportComment: reportComment,
			likeComment: likeComment,
			postReaction: postReaction,
			reactionDetail: reactionDetail,
			loadWith: loadWith,
			loadShare:loadShare,
			ask:ask,
			response:response,
			shareFB:shareFB,
			shareTo:shareTo,
			createShareFB:createShareFB,
			getDownloadImage:getDownloadImage,
			getKepoboxImage:getKepoboxImage,
			loadSuggest:loadSuggest,
			updatePlace:updatePlace
		};

		return service;
		var permission_list = null;
		var mood_list = null;
		function isPublic(){
			return $cookieStore.get('token')==undefined;
		}
		function deletePost(post_id, callback, errCallback) {
			var c = {
				data: {
					post_id: post_id
				}
			}
			CiayoService.Api('post/delete', c, function (response) {
				console.log(response);
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function unsubscribePost(post_id, callback, errCallback) {
			var c = {
				data: {
					post_id: post_id
				}
			}
			CiayoService.Api('post/unsubscribe', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function subscribePost(post_id, callback, errCallback) {
			var c = {
				data: {
					post_id: post_id
				}
			}
			CiayoService.Api('post/subscribe', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function postAttributes(callback, errCallback) {
			if (service.permission_list != undefined && service.mood_list != undefined) {
				callback();
				return;
			}
			var c = {
				data: {}
			}
			CiayoService.Api('post/attributes', c, function (response) {
				var ok = false;
				var data = null;
				if (response.status == 200) {
					data = response.data.c.data;
					if (data.error == false) {
						ok = true;
					}
				}
				if (ok) {
					service.permission_list = {};
					service.permission_list = data.content.post_category;
					service.mood_list = data.content.post_moods;
					angular.forEach(service.permission_list, function (value, key) {
						value.icon = value.name.replace(' ', '-');
					})
					callback();
				} else {
					errCallback(response);
				}
			});
		}

		function updatePermission(post_id, post_category, callback, errCallback) {
			var c = {
				data: {
					post_category: post_category,
					post_id: post_id
				}
			}
			CiayoService.Api('post/permission', c, function (response) {
				var ok = false;
				var data = null;
				if (response.status == 200) {
					data = response.data.c.data;
					if (data.error == false) {
						ok = true;
					}
				}
				if (ok) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function searchActivity(keyword, limit, offset, callback, errCallback) {
			var c = {
				data: {
					keyword: keyword,
					limit: limit,
					offset: offset
				}
			}
			CiayoService.Api('activity', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function activityDetail(activity_id, callback, errCallback) {
			var c = {
				data: {
					activity_id: activity_id
				}
			};
			CiayoService.Api('activity/detail', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function searchPlace(term, callback, errCallback) {
			var c = {
				data: {
					keyword: term
				}
			};
			CiayoService.Api('place', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function timelineUser(user_id, offset, limit,last_id, callback, errCallback,isrefresh) {
			var c = {
				data: {
					"username": user_id,
					"offset": offset,
					"limit": limit,
					"pointer_id":last_id
				}
			}
			if(isrefresh==true){
				c.data.isrefresh=isrefresh;
			}
			CiayoService.Api('timeline/user', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function timelineUserPublic(user_id, offset, limit,last_id, callback, errCallback) {
			var c = {
				data: {
					"username": user_id,
					"offset": offset,
					"limit": limit,
					"pointer_id":last_id
				}
			}
			CiayoService.Api('public/timeline/user', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function timeline(offset, limit,last_id, callback, errCallback,isrefresh) {
			var c = {
				data: {
					"offset": offset,
					"limit": limit,
					"pointer_id":last_id
				}
			}
			c.data.isrefresh=isrefresh;
			CiayoService.Api(TIMELINE_API_SERVER+'timeline', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			},true);
		}
		function detail(post_code, callback, errCallback) {
			var c = {
				data: {
					"post_code": post_code,
				}
			}
			CiayoService.Api('post/detail', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function public_detail(post_code, callback, errCallback) {
			var c = {
				data: {
					"post_code": post_code,
				}
			}
			CiayoService.Api('public/timeline/detail', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function create(post, callback,errCallback) {
			var c = {
				data: {
					"activity_id": post.activity_id,
					"mood_id": post.mood_id,
					"place_id": post.place_id,
					"post_category": post.post_category,
					"caption": post.caption,
					"bubble": post.bubble,
					"items": post.items,
					"with_users": post.with_users
				}
			}
			CiayoService.Api('post/create', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function createEmotion(post_id, emotion, callback) {
			var c = {
				data: {
					"post_id": post_id,
					"emotion": emotion
				}
			};
			CiayoService.Api('post/emotion', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {

				}
			});
		}

		function share(post_id, callback) {
			var c = {
				data: {
					"post_id": post_id,
				}
			};
			CiayoService.Api('post/share', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {

				}
			});
		}
		function shareTo(post_id,to,callback,errCallback){
				var target=0;
				if(to=='facebook'){
					target=0;
				}else
					if(to=='pinterest'){
					target=2;
				}else
				if(to=='twitter'){
					target=1;
				}else{
					return;
				}
				var c = {
						data: {
							'post_id': post_id,
							'message':to,
							'target':target
						}
					};
					CiayoService.Api('sosmed/share/save', c, function (response) {
						if (response.status == 200) {
							var data = response.data.c.data;
							if (data.error == false) {
								callback(data);
							}
						} else {
							errCallback(response);
						}
					});
			}

		function disableComment(post_id, disable, callback) {
			var c = {
				data: {
					'post_id': post_id,
					'disable': disable
				}
			};
			CiayoService.Api('post/comment/disable', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {

				}
			});
		}

		function updateWith(post_id, with_user, callback, errCallback) {
			var c = {
				data: {
					'post_id': post_id,
					'with_users': with_user
				}
			};
			CiayoService.Api('post/with', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function updateCaption(post_id, post_caption, bubble, callback, errCallback) {
			var c = {
				data: {
					'post_id': post_id,
					'post_caption': post_caption,
					'bubble': bubble
				}
			};
			CiayoService.Api('post/caption', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function createComment(post, callback) {
			var c = {
				data: {
					"post_id": post.post_id,
					"content": post.content,
					"parent_id": post.parent_id,
				}
			};
			CiayoService.Api('post/comment', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {

				}
			});
		}
		function loadComment(post_id,parent_id,offset,limit, callback,errCallback) {
			var c = {
				data: {
					'post_id': post_id,
					'limit': limit,
					'offset': offset,
					'parent_id': parent_id
				}
			};
			var url = 'post/comment/list';
			CiayoService.Api(url, c, function (response) {
				var ok=false;
				if (response.status == 200) {
					var data = response.data.c.data;
					if(data.error==false){
						ok=true;
					}
				}
				if(ok){
					callback(data);
				}else{
					errCallback(response);
				}
			});
		}
		function deleteComment(comment_id, callback) {
			var c = {
				data: {
					'comment_id': comment_id,
				}
			};
			CiayoService.Api('post/comment/delete', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {

				}
			});
		}
		function reportComment(post_id, comment_id, content, callback, errCallback) {
			var c = {
				data: {
					'post_id': post_id,
					'comment_id': comment_id,
					'content': content
				}
			};
			CiayoService.Api(
				'post/report', c,
				function (response) {
					if (response.status == 200) {
						callback(response);
					} else {
						errCallback(response);
					}
				}
			);
		}
		function editComment(comment_id, content, callback) {
			var c = {
				data: {
					'comment_id': comment_id,
					'content': content
				}
			};
			CiayoService.Api('post/comment/edit', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {

				}
			});
		}
		function likeComment(comment_id, value, callback) {
			var c = {
				data: {
					'comment_id': comment_id,
					'value': value
				}
			};
			CiayoService.Api('post/comment/like', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {

				}
			});
		}

		function postReaction(post_id, emotion, callback, errCallback) {
			var c = {
				data: {
					'post_id': post_id,
					'emotion': emotion
				}
			};
			CiayoService.Api('post/emotion', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function reactionDetail(post_id, callback, errCallback) {
			var c = {
				data: {
					'post_id': post_id
				}
			};
			CiayoService.Api('post/emotion/detail', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function loadWith(post_id, callback, errCallback) {
			var c = {
				data: {
					'post_id': post_id
				}
			};
			CiayoService.Api('post/with/detail', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function ask(post_id,type,callback,errCallback){
			var c = {
				data: {
					'post_id': post_id,
					'type':type
				}
			};
			getDownloadImage(post_id,function(){},function(){})
			CiayoService.Api('post/ask', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function response(post_id,type,value,callback,errCallback){
			var c = {
				data: {
					'post_id': post_id,
					'type':type,
					'value':value
				}
			};
			CiayoService.Api('post/response', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function shareFB(access_token,uid,post_id,callback,errCallback){
			var c = {
				data: {
					'access_token': access_token,
					'uid':uid,
					'post_id':post_id,
				}
			};
			CiayoService.Api('facebook/share/post', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function loadShare(post_id,callback,errCallback){
			var c = {
				data: {
					'post_id': post_id
				}
			};
			CiayoService.Api('sosmed/share/list', c, function (response) {
				var ok=false;
				if (response.status == 200) {
					var data = response.data.c.data;
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function createShareFB(post_id){
			var deferred = $q.defer();
			var c = {
				data : {
					'post_id':post_id
				}
			}
			CiayoService.Api('post/create/sharefb',c,function(response){
				if(response.status==200){
					deferred.resolve(response.data.c.data);
				}else{
					deferred.reject(response);
				}
			});
			return deferred.promise;
		}
		function getDownloadImage(post_id,callback,errCallback){
			var c = {
				data : {
					'post_id' : post_id
				}
			}
			CiayoService.Api('post/create/images',c,function(response){
				var ok = false;
				if(response.status==200){
					var data = response.data.c.data;
					if(data.error==false){
						ok = true;
					}
				}
				if(ok){
					callback(response);
				}else{
					errCallback(response);
				}
			});
		}
		function getKepoboxImage(daytime,callback){
			var c = {
				data:{
					'daytime':daytime
				}
			}
			CiayoService.Api('kepobox',c,function(response){
				if(response.status==200){
					var data = response.data.c.data;
					callback(data);
				}else{
					errCallback(response);
				}
			});
		}
		function loadSuggest(latitude,longitude,callback,errCallback){
			var ok = false;
			var c = {
				data: {
					latitude: latitude,
					longitude: longitude
				}
			};
			CiayoService.Api('place/nearby', c, function(response) {
				if(response.status==200){
					var data = response.data.c.data;
					if (data.error == false) {
						ok = true;
					}
				}
				if(ok){
					callback(response);
				}else{
					errCallback(response);
				}
			});
		}
		function updatePlace(post_id,place_id,callback,errCallback){
			var ok = false;
			var c = {
				data: {
					post_id: post_id,
					place_id: place_id
				}
			};
			CiayoService.Api('post/place', c, function(response) {
				if(response.status==200){
					var data = response.data.c.data;
					if (data.error == false) {
						ok = true;
					}
				}
				if(ok){
					callback(response);
				}else{
					errCallback(response);
				}
			});
		}
	}
})();
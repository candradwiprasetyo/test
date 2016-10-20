(function () {
	'use strict';

	angular
		.module('app')
		.factory('TrendingService', TrendingService);

	TrendingService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService'];

	function TrendingService($http, $cookieStore, $rootScope, CiayoService) {
		var service = {
			permission_list: permission_list,
			mood_list: mood_list,
			deletePost: deletePost,
			unsubscribePost: unsubscribePost,
			postAttributes: postAttributes,
			updatePermission: updatePermission,
			searchActivity: searchActivity,
			activityDetail: activityDetail,
			searchPlace: searchPlace,
			timelineUser: timelineUser,
			timeline: timeline,
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
			ask:ask,
			response:response,
			shareFB:shareFB,
			postTrending: postTrending,
			peopleTrending: peopleTrending,
			activityTrending: activityTrending,
			placeTrending: placeTrending
		};

		return service;
		var permission_list = null;
		var mood_list = null;

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

		function timelineUser(user_id, offset, limit, callback, errCallback) {
			var c = {
				data: {
					"username": user_id,
					"offset": offset,
					"limit": limit
				}
			}
			CiayoService.Api('timeline/user', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function timeline(offset, limit, callback, errCallback) {
			var c = {
				data: {
					"offset": offset,
					"limit": limit
				}
			}
			CiayoService.Api('timeline', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
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

		function create(post, callback) {
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
			CiayoService.Api('post/comment/list', c, function (response) {
				var ok=false;
				if (response.status == 200) {
					var data = response.data.c.data;
					if(data.error==false){
						ok=true;
					}
				}
				if(ok){
					callback(data.content.list_comment);
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

		function postTrending(offset, callback, errCallback) { 
			// if(offset >= 9){
			// 	var new_limit = 1;
			// }else{
				var new_limit = 3;
			// }
			
			var c = {
				data: {
					"offset": offset,
					"limit": new_limit
				}
			}
			CiayoService.Api('post/trending', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function peopleTrending(callback, errCallback) {
			var c = {
				data: {
					"offset": 0,
					"limit": 10
				}
			};
			CiayoService.Api('users/trending', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function activityTrending(limit, offset, callback, errCallback) {
			var c = {
				data: {
					"offset": offset,
					"limit": limit
				}
			};
			CiayoService.Api('activity/trending', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function placeTrending(callback, errCallback) {
			var c = {
				data: {
					"offset": 0,
					"limit": 20
				}
			};
			CiayoService.Api('place/trending', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
	}
})();
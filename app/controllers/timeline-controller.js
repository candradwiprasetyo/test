(function () {
	'use strict';
	angular.module('app').controller('TimelineController', TimelineController).controller('PostController', PostController);

	TimelineController.$inject = ['PostService','CiayoService', 'ItemService', '$cookieStore', '$rootScope', 'SettingService', '$scope', 'modalFactory','ProfileService','$filter','TourService'];
	PostController.$inject = ['$rootScope','$scope','$cookieStore','$sce', 'PostService', 'ProfileService', 'modalFactory','facebookFactory','$filter','TourService'];


	function TimelineController(PostService,CiayoService, ItemService, $cookieStore, $rootScope, SettingService, $scope, modalFactory,ProfileService, $filter,TourService) {
		var me = this;
		angular.extend(me, {
			comment: {},
			js_timeline: [],
			activity_detail: [],
			is_searching: false,
			load_more: false,
			myPagingfunction: myPagingFunction,
			loadData: loadData,
			createEmotion: createEmotion,
			share: share,
			removePost: removePost,
			lastId:null,
			new_post_count:0,
			new_post_paused :false,
			new_post_timer:null,
			loadNewPost:loadNewPost
		});
		
		
		ProfileService.userInfo('',function($filter){
			me.token_user_id = ProfileService.userData.user_id;
			init();
		},function(){

		});

		

		function init() {
//			kepoboxSlide();
			ProfileService.userInfo('',function(){
				me.lastId = null;
				myPagingFunction();
				runSocket();
			},function(){
				
			});

			TourService.tourSearchActivity();
			
		}
		$scope.$on('card.delete', function (event, post) {
			PostService.deletePost(post.post_id, function (response) {
				var data = response.data.c.data;
				if (data.error == false) {
					removePost(me.js_timeline.indexOf(post));
				} else {
					modalFactory.message(data.message);
				}
			}, function (response) {});
		});

		function myPagingFunction() {
			SettingService.getSettings().then(function (data) {
				var general_setting = data.content.list_setting.general_setting;
				me.animate = general_setting.card_setting.parallax_view;
				loadData();
			});
		}

		function loadDataNext(idx) {
			if (idx == undefined) {
				idx = 0;
			}
			idx = idx+3;
			PostService.timeline(idx, 3, function (response) {
				//me.js_timeline=[];
				var tmp_next = response.data.c.data.content.posts;
				var jml = tmp_next.length;
					console.log(jml);
				if (jml == 0) {
					me.load_more = false;
				} else {
					me.load_more = true;
				}
			}, function (response) {
				console.log(response);
				me.is_searching = false;
				me.js_timeline = [];
			});
		}

		function loadData(idx,offset) {
			
			if (!me.is_searching) {
				me.is_searching = true;
				if (idx == undefined) {
					idx = 0;me.load_more=true;
					newPostPause();
				}
				var last_array = me.js_timeline[me.js_timeline.length-1];
				PostService.timeline(idx, 3,me.lastId, function (response) {
					var tmp = response.data.c.data.content.posts;
					angular.forEach(tmp, function (value, key) {
						if (value.activity_detail != undefined) {
							value.activity_detail.animate = me.animate;
							if(value.user_avatar &&value.user_avatar.face)
							value.activity_detail.avatar_url = value.user_avatar.face;
							value.activity_detail.back_hair = value.user_avatar.back_hair;
						}
						
						value.view = 'normal';
						value.type_page = 'timeline';
						value.login_id = ProfileService.userData.user_id;
						me.js_timeline.push(value);
						last_array = value;
					});
					me.lastId = (last_array) ? last_array.post_id : '';
					
					me.is_searching = false;
					if (response.data.c.data.meta.current_page<response.data.c.data.meta.last_page) {
						me.load_more = true;
					} else {
						me.load_more = false;
					}
					if(tmp.length==0){
						me.load_more=false;
					}
				}, function (response) {
					console.log(response);
					me.is_searching = false;
					me.js_timeline = [];
				});
				//loadDataNext(idx);
			}
		}

		function setData(post_id, name, value) {
			angular.forEach(me.js_timeline, function (val, key) {
				if (val.post_id == post_id) {
					val[name] = value;
				}
			});
		}

		function removePost($index) {
			me.js_timeline.splice($index, 1);
		}
		
		function runSocket(){
			var socket = CiayoService.Socket();
			socket.emit('set_userid',ProfileService.userData.user_id);
			socket.on('np001',socketTimeline);
		}
		function socketTimeline(data){
			me.new_post_count++;
		}
		function loadNewPost(){
			me.new_post_loading=true;
			$('div#c-wrp-timeline').animate({'scrollTop':220});
			PostService.timeline(0,me.new_post_count,null,function(response){
				var tmp = response.data.c.data.content.posts.reverse();
					angular.forEach(tmp, function (value, key) {
						if (value.activity_detail != undefined) {
							value.activity_detail.animate = me.animate;
							if(value.user_avatar &&value.user_avatar.face)
							value.activity_detail.avatar_url = value.user_avatar.face;
							value.activity_detail.back_hair = value.user_avatar.back_hair;
						}
						
						value.view = 'normal';
						value.type_page = 'timeline';
						value.login_id = ProfileService.userData.user_id;
						me.new_post_loading=false;
						me.js_timeline.unshift(value);
					});
				newPostPause();
			},true);
			me.new_post_count=0;
		}
		function newPostPause(){
			me.new_post_paused=true;
			clearTimeout(me.new_post_timer);
			me.new_post_timer = setTimeout(newPostResume, 30000);
		}
		function newPostResume(){
			me.new_post_paused = false;
		}
		function createEmotion(post_id, emotion) {
			post_id = 5;
			emotion = 1;
			if(post_id==1){return;}
			PostService.createEmotion(post_id, emotion, function (response) {
				console.log(response);
			});
		}
		
		function share(post_id) {
			post_id = 5;
			PostService.share(post_id, function (response) {
				console.log(response);
			});
		}

		
		
		// follow user yg sama
		var status_follow = $rootScope.$on(
            "status_follow.timeline",
            function(event, data) {
            	//console.log(me.js_timeline);
             	angular.forEach(me.js_timeline,function(value,key){
             		if(me.js_timeline[key].user_id == data){
             			me.js_timeline[key].cbutton_status.icon_follow = false;
             			me.js_timeline[key].cbutton_status.name_follow = false;
             		}		 	
				});
                
            }
        );

		// unfollow user yang sama
        var status_unfollow = $rootScope.$on(
            "status_unfollow.timeline",
            function(event, data) {
            	//console.log(me.js_timeline);
             	angular.forEach(me.js_timeline,function(value,key){
             		if(me.js_timeline[key].user_id == data){
             			me.js_timeline[key].cbutton_status.icon_follow = true;
             			me.js_timeline[key].cbutton_status.name_follow = true;
             		}		 	
				});      
            }
        );

				
	}


	function PostController($rootScope, $scope,$cookieStore,$sce, PostService, ProfileService, modalFactory,facebookFactory,$filter,TourService) {

		$scope.getTemplateUrl = function () {
			if ($scope.post.view == "normal") {
				return "app/directives/views/card-holder.html";
			}
			if ($scope.post.view == "detail") {
				return "app/directives/views/card-detail.html?v=1.4.3";
			}
			if ($scope.post.view == "loading") {
				return "app/directives/views/card-loading.html";
			}
		}
		angular.extend($scope, {
			reactionDetail:reactionDetail,
			commentLoad: commentLoad,
			commentCreate: commentCreate,
			commentEdit:commentEdit,
			likeComment: likeComment,
			deleteComment: deleteComment,
			commentReply: null,
			commentReplyOpen: commentReplyOpen,
			commentReplyClose: commentReplyClose,
			withDetail: withDetail,
			askWith: askWith,
			askPlace: askPlace,
			shareFBAPI:shareFBAPI,
			shareFB:shareFB,
			shareTo:shareTo,
			loadDetail: loadDetail,
			getDownloadImage:getDownloadImage,
			show_with_ask:show_with_ask,
			cancel_show_with_ask:cancel_show_with_ask,
			askWith_detail:askWith_detail,
			show_place_ask:show_place_ask,
			cancel_show_place_ask:cancel_show_place_ask,
			askPlace_detail:askPlace_detail,
			show_place_ask_normal:show_place_ask_normal,
			show_with_ask_normal:show_with_ask_normal,
			open_item_hidden:open_item_hidden,
			close_item_hidden:close_item_hidden
		});
		init();
		
		function init() {
			$scope.post.comment_stop=false;
			$scope.post.loadingImage=false;
			
			var token = $cookieStore.get('token');
			$scope.post.download_link = $sce.trustAsResourceUrl(API_SERVER+'post/download/card');

			$scope.post.userdata='{"data":{"token":"'+token+'","post_id":"'+$scope.post.post_id+'"},"timestamp":1468376374025,"app":"Web","screen_type":"Web","image_type":"","latitude":"-6.225652","longitude":"106.74576","language":1}';
			if($scope.post.activity_detail){
				$scope.post.activity_detail.old_caption = $scope.post.activity_detail.caption;
			$scope.post.activity_detail.activity_title = ($scope.post.activity_detail.activity_title==undefined?'':$scope.post.activity_detail.activity_title)
				.replace(
				'[USERNAME]',
				'<span class="name">'+
					$scope.post.user_display_name+
				'</span>'
				)
				.replace(
					'[MOOD_TEXT]',
					$scope.post.activity_detail.mood==undefined?'':
						'<span class="mood">'+
							$scope.post.activity_detail.mood.text+' '+
							($scope.post.activity_detail.mood.id==2?'<i class="ci-mood-happy"></i>':
							$scope.post.activity_detail.mood.id==3?'<i class="ci-mood-sad"></i>':'')+
						'</span>'
				)
			;
				$scope.post.activity_detail.search_title = ($scope.post.activity_detail.activity_title==undefined?'':$scope.post.activity_detail.activity_title)
				.replace(
				'[USERNAME]',
				+$scope.post.user_display_name
				)
				.replace(
					'[MOOD_TEXT]',
					$scope.post.activity_detail.mood==undefined?'':$scope.post.activity_detail.mood.text+' '
				)
			;
			}
			$scope.post.loadingRightCount=3;
			$scope.post.list_post_share=[];
			if($scope.post.view!='loading'){
				$scope.post.loadingRightCount=0;
				$scope.post.comment_detail=[];
				$scope.post.comment_count=0;
				$scope.post.shared_count=0;
				$scope.post.reaction={
					'post_id':$scope.post.post_id,
					'user_react':null,
					'detail':{
						'most':null,
						'count':0,
						'text':null
					}
				};
				commentLoad($scope.post, null, 0, 5);
				reactionDetail($scope.post.post_id);
				loadShare();
				getStatusInfo($scope.post.username, $scope.post.type_page);
			}
			
			if ($scope.post.with_status != undefined) {
				$scope.post.with_status.class = parseStatusClass($scope.post.with_status.value);
			}
			if ($scope.post.place_status != undefined) {
				$scope.post.place_status.class = parseStatusClass($scope.post.place_status.value);
			}
			if($scope.post.generated_image_url!=undefined){
				$scope.post.activity_detail.share.pinterest.replace('[IMAGE_PINTEREST]',$scope.post.generated_image_url);
				preloadImage();
			}else{
				getDownloadImage();
			}
		}

		function open_item_hidden(index){
			$scope.post.item_hidden_selected = index;
			$scope.post.item_hidden_frame = true;
			$scope.post.item_hidden_close = true;
		}

		function close_item_hidden(){
			$scope.post.item_hidden_selected = -1;
			$scope.post.item_hidden_frame = false;
			$scope.post.item_hidden_close = false;
		}

		function getStatusInfo(username, type_page){
			if($scope.post.isPublic){
				$scope.post.profile = {user_id:-1,user_avatar:''};
			}else
			{
				ProfileService.userInfo('',function(response){
					$scope.post.profile = response;
				},function(){

				});
				ProfileService.getStatusInfo(username, function (response) {
					$scope.post.cbutton_status = [];
					
					$scope.post.cbutton_status = response;
					$scope.post.cbutton_status.type_page = type_page;

					$scope.post.cbutton_status.username = username;

					$scope.post.cbutton_status.icon_action_response = false;
					$scope.post.cbutton_status.open_action = false;
					$scope.post.cbutton_status.ci_star = false;
					$scope.post.cbutton_status.ci_check = false;
					
					if($scope.post.cbutton_status.status.friend.add==false){
						$scope.post.cbutton_status.icon_addfriend = true;
						$scope.post.cbutton_status.name_addfriend = true;
						$scope.post.cbutton_status.icon_self = 0;
						$scope.post.cbutton_status.name_self = 0;
					}else{
						if($scope.post.cbutton_status.status.friend.addstatus==false){
							if($scope.post.cbutton_status.status.friend.approve==true){
								$scope.post.cbutton_status.icon_addfriend = false;
								$scope.post.cbutton_status.name_addfriend = false;
								$scope.post.cbutton_status.icon_self = 0;
								$scope.post.cbutton_status.name_self = 0;
							}else{
								$scope.post.cbutton_status.icon_addfriend = true;
								$scope.post.cbutton_status.name_addfriend = true;
								$scope.post.cbutton_status.icon_self = 1;
								$scope.post.cbutton_status.name_self = 1;
								$scope.post.cbutton_status.ci_star = true;
							}
						}else{
							$scope.post.cbutton_status.icon_addfriend = false;
							$scope.post.cbutton_status.name_addfriend = false;
							$scope.post.cbutton_status.icon_self = 0;
							$scope.post.cbutton_status.name_self = 0;
							$scope.post.cbutton_status.ci_check = true;
						}
					}
					if($scope.post.cbutton_status.status.friend.approve==false){
						$scope.post.cbutton_status.checklist_addfriend = true;
					}else{
						$scope.post.cbutton_status.checklist_addfriend = false;
					}

					if($scope.post.cbutton_status.status.follow==false){
						$scope.post.cbutton_status.icon_follow = true;
						$scope.post.cbutton_status.name_follow = true;
						$scope.post.cbutton_status.checklist_follow = true;
					}else{
						$scope.post.cbutton_status.icon_follow = false;
						$scope.post.cbutton_status.name_follow = false;
					}

					if($scope.post.user_status){
						$scope.post.cbutton_status.self = 'false';

					}else{
						$scope.post.cbutton_status.self = 'true';
						$scope.post.cbutton_status.username = '';
					}

					$scope.post.user_list_button = $scope.post.cbutton_status;

					//console.log($scope.post.user_list_button);
				}, function (response) {
					console.log(response);
				});
			}
		}

		function parseStatusClass(value) {
			var _class = '';
			switch (value) {
			case '-1':
				_class = '-blank';
				break;
			case '1':
				_class = '-secret';
				break;
			case '2':
				_class = '-alone';
				break;
			}
			return _class;
		}
		//REACTION
		function reactionDetail(post_id) {
			if($scope.post.isPublic){$scope.post.loadingRightCount++;return;}
			PostService.reactionDetail(post_id, function (response) {
				var data = response.data.c.data;
				if (data.error == false) {
					var data = data.content;
					$scope.post.reaction=data.rate_detail;
					$scope.post.reaction.user = [];
					angular.forEach(data.rate_count,function(rates,rate_key){
						angular.forEach(rates.users,function(rate,key){
							rate.rate = rate_key.split('_').pop();
							$scope.post.reaction.user.push(rate);
						})

					});
				}
			}, function (response) {

			});
		}
		//COMMENT
		function commentCreate(post, content, comment) {
			var parent_id = comment == undefined ? 0 : comment.id_comment;
			var data = {
				"post_id": post.post_id,
				"content": content,
				"parent_id": parent_id
			};
			if(post.enable_comment==false || post.post_id==1){modalFactory.message('Comment disabled.');return;}
			PostService.createComment(data, function (response) {
				var data = (response.data.c.data.content.data);
				angular.forEach(data, function (value, key) {
					if (parent_id == 0) {
						post.comment_detail.push(value);
						post.comment_count = value.total_post_comment;
					} else {
						if (comment.detail == undefined) comment.detail = [];
						comment.reply_count++;
						comment.detail.push(value);
					}
				});
			});
		}
		function commentEdit(comment) {
			if(comment.content==comment.old_content){
				comment.on_edit=false;
				comment.content = comment.old_content;
				$scope.onEditComment = false;
				return;
			}
			PostService.editComment(comment.id_comment, comment.content, function (response) {
				comment.on_edit=false;
				comment.old_content=null;
				$scope.onEditComment = false;
				if(response.status==200){
					var data = response.data.c.data;
					if(data.error==false){
						comment.updated_at = data.content.updated_at;
					}
				}
			});
		}
		
		function likeComment(comment, value) {
			PostService.likeComment(comment.id_comment, value, function (response) {
				var data = (response.data.c.data.content);
				comment.like_count = data.like_count;
				comment.dislike_count = data.dislike_count;
				comment.like = value;
			});
		}

		function deleteComment(comment_id, $index) {
			modalFactory.confirm('Yakin ingin menghapus?', function (response) {
				if (response) {
					PostService.deleteComment(comment_id, function (response) {
						var data = response.data.c.data;
						if (data.error == false && data.content.status == 'success') {
							$scope.post.comment_detail.splice($index, 1);
							$scope.post.comment_count -= 1;
						}
					});
				}
			});
		}

		function commentLoad(post, comment, offset, limit) {
			if($scope.post.isPublic){$scope.post.loadingRightCount++;return;}
			var id_comment = 0;
			if (comment != undefined) {
				comment.detail = [];
				id_comment = comment.id_comment
			}
			PostService.loadComment(post.post_id, id_comment, offset, limit, function (response) {
				var data = response.content.list_comment;

				if (comment == undefined) {
					if(offset==0){post.comment_detail=[];post.loadingRightCount++;}
					if(data.length>0){
						$scope.post.comment_count=response.meta.total;
						angular.forEach(data, function (value, key) {
							post.comment_detail.unshift(value);
							
						});
						$scope.post.comment_stop=false;
					}else{
						$scope.post.comment_stop=true;
					}
				} else {
					if (offset == 0) {
						comment.detail = [];
						angular.forEach(data, function (value, key) {
							comment.detail.unshift(value);
						});
					} else {
						angular.forEach(data, function (value, key) {
							comment.detail.unshift(value);
						});
					}
				}
			}, function () {
				if(comment == undefined && offset==0){
					$scope.post.loadingRightCount++;
				}
			})
		}

		function commentReplyOpen(post, comment) {
			$scope.commentReply = comment;
			commentLoad(post, comment, 0, 20);
		}

		function commentReplyClose() {
			$scope.commentReply = null;
			console.debug($scope.commentReply);
		}
		//WITH
		function withDetail(post_id) {
			PostService.loadWith(post_id, function (response) {
				var data = response.data.c.data;
				if (data.error == false) {
					$scope.post.with = data.content.data;
				}
			}, function (response) {});
		}
		
		function askWith(post) {
			if(post.post_id==1){modalFactory.message('Asking disabled');return;}
			if (post.user_status && post.with_detail.with_status.value==-1){
				modalFactory.confirm($filter('translate')('$ask.with') + post.user_display_name + $filter('translate')('$ask.with.when'), function (response) {
				if (response) {
					PostService.ask(post.post_id, 'ask_with', function (response) {
						modalFactory.message(response.data.c.data.message);
						//console.log(response.data.c.data.message);
					}, function (response) {
						modalFactory.message(response.data.c.data.message);
					});
				}
			});
			}
		}
		//PLACE
		function askPlace(post) {
			if(post.post_id==1){modalFactory.message('Asking disabled');return;}
			if (post.user_status && post.place_detail.place_status.value==-1){
				modalFactory.confirm($filter('translate')('$ask.place') + post.user_display_name + $filter('translate')('$ask.place.when'), function (response) {
					if (response) {
						PostService.ask(post.post_id, 'ask_place', function (response) {
							modalFactory.message(response.data.c.data.message);
						}, function (response) {
							modalFactory.message(response.data.c.data.message);
						});
					}
				});
			}
		}
		//SHARE
		function shareFBAPI(post){
			$scope.post.facebook_disabled = true;
			var access_token = '';
			var uid = '';
			facebookFactory.getToken(function (data) {
				//console.log(data);
				access_token = data.accessToken;
				uid = data.uid;
				if(data==undefined || data.accessToken==undefined){
					modalFactory.message($filter('translate')('$fb.error'))
					return;
				}
				PostService.shareFB(access_token, uid, post.post_id, function (response) {
					var data = response.data.c.data;
					//console.log(data);
					if(data.error==false){
						modalFactory.message(data.message);
						loadShare();

					}
					$scope.post.facebook_disabled=false;
				}, function () {
					$scope.post.facebook_disabled = false;
				});
			});
		}
		function shareFB(post) {
			$scope.post.facebook_disabled = true;
			var title=post.activity_detail.search_title || '';
			PostService.createShareFB(post.post_id).then(function(data){
				console.log(data);
				FB.ui({
					method: 'share',
					display: 'iframe',
					type: 'photo',
					caption: data.content.caption,
					redirect_uri: data.content.redirect_uri,
					description: data.content.description,
					name: data.content.name,
					href: data.content.href,
					picture: data.content.picture
				}, function(response){
					$scope.post.facebook_disabled = true;
						shareTo('facebook');
				});
			},function(response){
				console.log(response);
				$scope.post.facebook_disabled=false;
			})
			
		}
		function shareTo(to){
			PostService.shareTo($scope.post.post_id,to,function(data){
				loadShare();
				$scope.post.facebook_disabled=false;
			},function(){
				$scope.post.facebook_disabled=false;
			})
		}
		function loadShare(){
			PostService.loadShare($scope.post.post_id,function(response){
				var data = response.data.c.data;
				if(data.error==false){
					$scope.post.list_post_share=data.content.list_post_share;
					$scope.post.shared_count = $scope.post.list_post_share.length;
					$scope.post.facebook_disabled = false;
				}
			},function(){
				
			})
		}
		//DETAIL
		//DETAIL
		function loadDetail(post_code) {
			modalFactory.card(post_code);
		}
		function preloadImage(){
			$scope.post.loading_preload = true;
			var img = new Image();
			img.src = $scope.post.activity_detail.preview;
			img.onload = function(){
				$scope.post.loading_preload = false;
				$rootScope.$apply();
			}
		}
		function getDownloadImage(){
			if($scope.post.generated_image_url==undefined){
				$scope.post.loadingImage=true;
				PostService.getDownloadImage($scope.post.post_id,function(response){
					var data = response.data.c.data;
					if(data.error==false){
						$scope.post.generated_image_url = data.content.card_media_id;
						$scope.post.activity_detail.share.pinterest = $scope.post.activity_detail.share.pinterest.replace('[IMAGE_PINTEREST]',$scope.post.generated_image_url);
						$scope.post.activity_detail.preview = data.content.preview_media_id;
					}
					$scope.post.loadingImage=false;
					preloadImage();
				},function(){
				});
			}
		}


		function show_with_ask(post){

			//console.log($scope.post.user_status);

			if($scope.post.user_status){
				if(post.open_with){
					post.open_with = false;
				}else{
					post.open_with = true;

				}
			}
		}

		function show_with_ask_normal(post){

			if(post.open_with){
				post.open_with = false;
			}else{
				post.open_with = true;
				withDetail(post.post_id);
			}
				
		}

		function cancel_show_with_ask(post){
			post.open_with = false;
		}

		function askWith_detail(post) {		
				//alert('test');
				PostService.ask(post.post_id, 'ask_with', function (response) {
					modalFactory.message(response.data.c.data.message);	
				}, function (response) {
					modalFactory.message(response.data.c.data.message);	
				});
				//post.open_with = false;
				//modalFactory.message("Ask with success");	
		}

		function show_place_ask(post){

			//console.log('ok');
			post.open_with = false;

			if($scope.post.user_status){
				if(post.open_place){
					post.open_place = false;
				}else{
					post.open_place = true;
				}
			}
		}

		function show_place_ask_normal(post){

			//console.log('ok');
			post.open_with = false;
			if(post.open_place){
				post.open_place = false;
			}else{
				post.open_place = true;
			}
		
		}

		function cancel_show_place_ask(post){
			post.open_place = false;
		}

		function askPlace_detail(post) {		
				//alert('test');
				PostService.ask(post.post_id, 'ask_place', function (response) {
					//console.log(response);
					modalFactory.message(response.data.c.data.message);	
				}, function (response) {
					modalFactory.message(response.data.c.data.message);	
				});
				
				
		}
		
	}
})();
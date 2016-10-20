(function () {
	'use strict';
	angular
		.module('app')
		.controller('TrendingController', TrendingController);
		
	TrendingController.$inject = ['$state', 'AuthService','CiayoService','TrendingService','ItemService','$cookieStore','$rootScope', 'ConnectionService', 'SettingService','CiayoBanner', 'ProfileService'];
	function TrendingController($state, AuthService, CiayoService,TrendingService,ItemService,$cookieStore, $rootScope, ConnectionService, SettingService, CiayoBanner, ProfileService) {
		
		var me=this;
		angular.extend(me,{
			state:0,
			is_searching: false,
			js_timeline: [],
			load_more: false
		});
		me.comment={};
		
		me.activity_detail=[];
		me.action_check_me = action_check_me;
		me.action_addfriend = action_addfriend;
		me.action_follow = action_follow;
		me.action_response = action_response;
		me.closeActionResponse = closeActionResponse;
		me.action_response_accept = action_response_accept;
		me.action_response_delete = action_response_delete;
		me.myPagingFunction = myPagingFunction;
		me.isloading = false;
		me.loading_show_more = false;
		me.button_show_more = false;
		me.loadMoreActivity=loadMoreActivity;

		ProfileService.userInfo('',function(){
			me.token_user_id = ProfileService.userData.user_id;
			myPagingFunction();
		},function(){

		});

		CiayoBanner.getData("trending", function(response){
			me.banner = response.data.c.data.content.image;
			setTimeout(function(){
				$('.c-banner').children("ul").parallax({
					clipRelativeInput: false,
					originY: 0.0
				});
			}, 1)
		}, function(){

		})

		

		function myPagingFunction(){
			SettingService.getSettings().then(function(data) {
				console.log(data);
				var general_setting = data.content.list_setting.general_setting;
				me.animate = general_setting.card_setting.parallax_view;
				loadData();
			});
		}

		me.loadData = loadData;

		function loadData(idx){
			//alert('ok');
			if (!me.is_searching) {
				me.is_searching = true;
				if (idx == undefined) {
					idx = 0;
					me.load_more = true;
				}

				if(idx<=9){
					TrendingService.postTrending (idx, function(response){
						//console.log(response.data.c.data.content);
						var tmp=response.data.c.data.content.trending;
						
						angular.forEach(tmp,function(value,key){
							if(value.activity_detail!=undefined){
								value.activity_detail.animate = me.animate;
								value.activity_detail.avatar_url=value.user_avatar.face;
								value.activity_detail.back_hair=value.user_avatar.back_hair;

							}

							//value.place.url='https://www.google.com/maps/preview/@' + value.place.place_lat+',' + value.place.place_long + ',8z';
							value.view='normal';
							value.login_id=me.token_user_id;
							value.type_page = 'trending';
							me.js_timeline.push(value);
						});
						//console.log(me.js_timeline);
						me.is_searching=false;
						if (response.data.c.data.meta.current_page<response.data.c.data.meta.last_page) {
							me.load_more = true;
						} else {
							me.load_more = false;
						}
						if(tmp.length==0){
							me.load_more=false;
						} 
					},function(response){
						console.log(response);
						me.is_searching=false;
						me.js_timeline=[];
					});
				}else{
					me.is_searching = false;
				}
			}else{
				me.is_searching = true;
			}
		}

		function setData(post_id,name,value){
			angular.forEach(me.js_timeline,function(val,key){
				if(val.post_id==post_id){
					val[name]=value;
				}
			});
		}
		function removePost($index){
			me.js_timeline.splice($index,1);
		}
		function createEmotion(post_id,emotion){
			post_id=5;emotion=1;
			TrendingService.createEmotion (post_id,emotion,function(response){
				console.log(response);
			});
		}
		function share(post_id){
			post_id=5;
			TrendingService.share (post_id,function(response){
				console.log(response);
			});
		}
		function disableComment(post_id,disable){
			post_id=5;disable=1;
			TrendingService.disableComment(post_id,disable,function(response){
				console.log(response);
			});
		}
		function updateWith(post_id,with_user,without_user){
			post_id=9;with_user=[{"id": "11","username": "andi"},{"id": "12","username": "budi"}];
			without_user=null;
			TrendingService.likeComment(post_id,with_user,null,function(response){
				console.log(response);
			});
		}
		
		function editComment(comment_id,content){
			//comment_id=9;content="test";
			TrendingService.editComment(comment_id,content,function(response){
				console.log(response);
			});
		}
		
		me.createEmotion=createEmotion;
		me.share=share;
		me.disableComment=disableComment;
		me.updateWith=updateWith;
		me.editComment=editComment;
		
		me.removePost=removePost;
		
		var data=
				{
					"app": "Android",
					"token": 123,
					"timestamp": "1458117439067",
					"latitude": -6.13732894,
					"longitude": 106.83117118,
					"data": {
						"userid": 1
					}
				};
		/*CiayoService.Socket().emit('ck001',data, function(data){console.log(data);
			if (data) {
				// mySocket.emit('send_message', 'from codess');
			} else {
				console.log('user has used');
			}
		});*/

		//trending people 
		me.list_people_trending=[];
		me.start_people_trending = false;

		
		function getListPeopleTrending(){

						

						TrendingService.peopleTrending (
							function(response){//callback sucess
								//console.log(response.data.c.data.content);
								//vm.list_user = response.data.c.data.content.list_user;
								me.start_people_trending = true;

								var tmp=(response.data.c.data.content.trending);
								//console.log(tmp);
								me.count = 1;
								angular.forEach(tmp,function(value,key){

									if(me.token_user_id==tmp[key].user_id){
										value.button_self = true;
									}else{
										value.button_self = false;
									}

									value.icon_action_response = false;
									value.open_action = false;
									value.ci_star = false;
									value.ci_check = false;
									
									if(tmp[key].status.friend.add==false){
										value.icon_addfriend = true;
										value.name_addfriend = true;
										value.icon_self = 0;
										value.name_self = 0;
										
										
									}else{
										
										if(tmp[key].status.friend.addstatus==false){
											if(tmp[key].status.friend.approve==true){
												value.icon_addfriend = false;
												value.name_addfriend = false;
												value.icon_self = 0;
												value.name_self = 0;
												
											}else{
												value.icon_addfriend = true;
												value.name_addfriend = true;
												value.icon_self = 1;
												value.name_self = 1;
												
												value.ci_star = true;
											}
										}else{
											value.icon_addfriend = false;
											value.name_addfriend = false;
											value.icon_self = 0;
											value.name_self = 0;
											value.ci_check = true;
										}
									}

									/*if(tmp[key].status.self.add==true){
										value.icon_self = 1;
										value.name_self = 1;
									}else{
										value.icon_self = 0;
										value.name_self = 0;
									}*/

									if(tmp[key].status.friend.approve==false){
										value.checklist_addfriend = true;
									}else{
										value.checklist_addfriend = false;
									}

									if(tmp[key].status.follow==false){
										value.icon_follow = true;
										value.name_follow = true;
										value.checklist_follow = true;
									}else{
										value.icon_follow = false;
										value.name_follow = false;
									}
								
									me.list_people_trending.push(value);
									value.people_trending_number= me.count;
									if((value.people_trending_number+'').length==1){
										value.people_trending_number = "0"+value.people_trending_number;
									}
									me.count++;
								});
							
							},
							function(response){//err callback
								console.log(response);
							}
						);
		}
		//getListPeopleTrending();

		//trending activity 
		me.list_activity_trending=[];
		me.start_activity_trending = false;

		function loadMoreActivity(){	
			getListActivityTrending();
		}

		function getListActivityTrending_next(){
			
				var limit = 2;
				var offset = me.list_activity_trending.length;

				TrendingService.activityTrending (limit, offset,
					function(response){//callback sucess

						var tmp_next=(response.data.c.data.content.trending);
						//console.log(tmp);

						if(tmp_next.length==0){
							me.button_show_more = false;
						}else{
							me.button_show_more = true;
						}		
						
					},
					function(response){//err callback
						console.log(response);
					}
				);
			
		}

		function getListActivityTrending(start){
			if(!me.isloading){
				//console.log('test');
				me.isloading = true;
				
				var offset = me.list_activity_trending.length;

				if(offset<=19){

					if(offset >= 19){
					 	var limit = 1;
					}else{
						var limit = 3;
					}

					TrendingService.activityTrending (limit, offset,
						function(response){//callback sucess
							//console.log(response.data.c.data.content);
							//vm.list_user = response.data.c.data.content.list_user;
							me.start_activity_trending = true;
							var tmp=(response.data.c.data.content.trending);
							//console.log(tmp);

							if(start){
								me.count_activity = 1;
							}else{
								me.count_activity = (me.count_activity) ? me.count_activity : 1;
							}

							angular.forEach(tmp,function(value,key){

								if(value.activity_detail!=undefined){
									value.activity_detail.animate = me.animate;
									value.activity_detail.avatar_url=(value.user_avatar)?value.user_avatar.face:'';
									value.activity_detail.back_hair=(value.user_avatar)?value.user_avatar.back_hair:'';
								}
							
								me.list_activity_trending.push(value);
								value.activity_trending_number = me.count_activity;
								//console.log((value.activity_trending_number+'').length);
								if((value.activity_trending_number+'').length==1){
									value.activity_trending_number = "0"+value.activity_trending_number;
								}
								me.count_activity++;
								me.isloading = false;
							});
							
							if(offset < 19){
								getListActivityTrending_next();
							}else{
								me.button_show_more = false;
							}
						},
						function(response){//err callback
							console.log(response);
						}
					);
				}
			}
		}

		
		//getListActivityTrending();

		//trending place 
		me.list_place_trending=[];
		me.start_place_trending = false;

		function getListPlaceTrending(){
						TrendingService.placeTrending (
							function(response){//callback sucess
								//console.log(response.data.c.data.content);
								//vm.list_user = response.data.c.data.content.list_user;
								me.start_place_trending = true;
								var tmp=(response.data.c.data.content.trending);
								//console.log(tmp);
								me.count = 1;
								angular.forEach(tmp,function(value,key){
								
									me.list_place_trending.push(value);
									value.place_trending_number = me.count;
									//console.log((value.place_trending_number+'').length);
									if((value.place_trending_number+'').length==1){
										value.place_trending_number = "0"+value.place_trending_number;
									}
									me.count++;
								});
							},
							function(response){//err callback
								console.log(response);
							}
						);
		}
		//getListPlaceTrending();

		function action_check_me(username){
			//alert(username);
			$state.go('profile', {user: username});
		}

		function action_addfriend(user, index){
			//alert(user_id+'_'+id);
			var user_id = me.list_people_trending[index].user_id;

			ConnectionService.requestAddFriend(user_id, function(response){
				console.log(response);
				user.icon_addfriend = false;
				user.name_addfriend = false;
				

				user.icon_follow = false;
				user.name_follow = false;

			},function(response){
				//console.log(response);
			});
		}

		function action_follow(user, index){
			//alert(user_id+'_'+id);
			var user_id = me.list_people_trending[index].user_id;
			
			ConnectionService.requestFollow(user_id, true, function(response){
				console.log(response);
				user.icon_follow = false;
				user.name_follow = false;

			},function(response){
				//console.log(response);
			});
		}

		function action_response(user, index){
			
			me.list_people_trending[index].icon_action_response = true;
			
			
		}

		function closeActionResponse(index){
			//alert("test");
			me.list_people_trending[index].icon_action_response = false;
		}

		function action_response_accept(user, index){


			var user_id = me.list_people_trending[index].user_id;
						
			ConnectionService.requestConfirmFriendRequest(user_id, function(response){
				user.icon_addfriend = false;
				user.name_addfriend = false;
				user.checklist_addfriend = false;
				user.icon_follow = false;
				user.name_follow = false;
				me.list_people_trending[index].icon_action_response = false;

				$rootScope.$broadcast( "user.added_friend",'data' );

			},function(response){
				//console.log(response);
			});
		}

		function action_response_delete(user, index){

			
			var user_id = me.list_people_trending[index].user_id;
						
			ConnectionService.requestRejectFriendRequest(user_id, function(response){
				user.icon_addfriend = true;
				user.name_addfriend = true;
				user.icon_self = 0;
				user.name_self = 0;
				me.list_people_trending[index].icon_action_response = false;

				$rootScope.$broadcast( "user.added_friend",'data' );

			},function(response){
				//console.log(response);
			});
		}
		me.test=test;

		function test(){
			$rootScope.$broadcast( "user.added_friend", 'data');
		}

		function show_frame(user){
			if(me.token_user_id!=me.list_people_trending[index].user_id){
				user.open_action = true;
			}
			//alert("ok");
			
		}

		function close_frame(user){
			user.open_action = false;
		}

		me.show_frame = show_frame;
		me.close_frame = close_frame;
		me.load_state_people = false;
		me.load_state_activity = false;
		me.load_state_place = false;

		function action_state(id){
			
			me.state = id;
			
			switch(me.state){
				case 1:
					if(!me.load_state_people){
						me.start_people_trending = false;
						me.list_people_trending = [];
						me.load_state_people = true;
						getListPeopleTrending(true);
					}
				break;

				case 2:
					if(!me.load_state_activity){
						me.start_activity_trending = false;
						me.list_activity_trending = [];
						me.load_state_activity = true;
						getListActivityTrending(true);
					}
				break;

				case 3:
					if(!me.load_state_place){
						me.start_place_trending = false;
						me.list_place_trending = [];
						me.load_state_place = true;
						getListPlaceTrending(true);
					}
				break;
			}
			

		}

		me.action_state = action_state;

		var friend = $rootScope.$on(
            "friend.trending_people",
            function(event, data) {
            	angular.forEach(me.list_people_trending,function(value,key){
					me.list_people_trending[key].open_action = false;
				});
            }
        );

        // follow user yg sama
		var status_follow = $rootScope.$on(
            "status_follow.trending",
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
            "status_unfollow.trending",
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

        // add friend yang sama
        var add_friend = $rootScope.$on(
            "add_friend.trending",
            function(event, data) {
            	//console.log(me.js_timeline);
             	angular.forEach(me.js_timeline,function(value,key){
             		if(me.js_timeline[key].user_id == data){
             			me.js_timeline[key].cbutton_status.icon_addfriend = false;
             			me.js_timeline[key].cbutton_status.name_addfriend = false;
             			me.js_timeline[key].cbutton_status.ci_check = true;
             			me.js_timeline[key].cbutton_status.icon_follow = false;
             			me.js_timeline[key].cbutton_status.name_follow = false;
             		}		 	
				});      
            }
        );

        // cancel friend yang sama
        var cancel_friend = $rootScope.$on(
            "cancel_friend.trending",
            function(event, data) {
            	//console.log(me.js_timeline);
             	angular.forEach(me.js_timeline,function(value,key){
             		if(me.js_timeline[key].user_id == data){

             			me.js_timeline[key].cbutton_status.icon_addfriend = true;
             			me.js_timeline[key].cbutton_status.name_addfriend = true;
             			me.js_timeline[key].cbutton_status.icon_self = 0;
             			me.js_timeline[key].cbutton_status.name_self = 0;
             			me.js_timeline[key].cbutton_status.ci_star = false;
             			me.js_timeline[key].cbutton_status.icon_action_response = false;
             		}		 	
				});      
            }
        );

         // accept yang sama
        var accept_friend = $rootScope.$on(
            "accept_friend.trending",
            function(event, data) {
            	//console.log(me.js_timeline);
             	angular.forEach(me.js_timeline,function(value,key){
             		if(me.js_timeline[key].user_id == data){
	        			me.js_timeline[key].cbutton_status.icon_addfriend = false;
             			me.js_timeline[key].cbutton_status.name_addfriend = false;
             			me.js_timeline[key].cbutton_status.checklist_addfriend = false;
             			me.js_timeline[key].cbutton_status.icon_follow = false;
             			me.js_timeline[key].cbutton_status.name_follow = false;
             			me.js_timeline[key].cbutton_status.icon_action_response = false;
             			me.js_timeline[key].cbutton_status.status.friend.approve = true;
             			me.js_timeline[key].cbutton_status.hide_approve = true;
             		}		 	
				});      
            }
        );

        // decline yang sama
        var decline_friend = $rootScope.$on(
            "decline_friend.trending",
            function(event, data) {
            	//console.log(me.js_timeline);
             	angular.forEach(me.js_timeline,function(value,key){
             		if(me.js_timeline[key].user_id == data){
             			me.js_timeline[key].cbutton_status.icon_addfriend = true;
             			me.js_timeline[key].cbutton_status.name_addfriend = true;
             			me.js_timeline[key].cbutton_status.icon_self = 0;
             			me.js_timeline[key].cbutton_status.name_self = 0;
             			me.js_timeline[key].cbutton_status.ci_star = false;
             			me.js_timeline[key].cbutton_status.icon_action_response = false;
             		}		 	
				});      
            }
        );
	}
})();
+function(){ "use strict";
	angular
		.module("CiayoHeader",['ngMaterial'] )
		.directive('cHeader',function() {
			return {
				restrict: "E",
				scope:{data:'=','type':'@'},
				replace:true,
				templateUrl:'app/directives/views/header.html',
				controller:function ($cookieStore, $state,$stateParams, $scope, $mdDialog, $mdMedia, $rootScope, $http, $location, listService, ProfileService, ConnectionService, CiayoService, modalFactory, facebookFactory ) {
					$scope.with={
						text:"",
						isActive:false,
						search_list:Object.create(listService)
					}


					//WITH
					$scope.start_notification_popup = false;
					$scope.notification_popup_all=[];

					$scope.invitationFacebook = function(){
						var access_token = '';
						var uid = '';
						//alert('test');
						facebookFactory.getToken(function (data) {
							//console.log(data);
							access_token = data.accessToken;
							uid = data.uid;

							ConnectionService.shareFacebook(access_token, uid, function(response){
								//console.log(response);
								modalFactory.message('Your message has been sent');
							
							},function(response){
								//console.log(response);
							});
							
						});
					}

					$scope.modalInviteEmail = function(){
						modalFactory.inviteEmail();
					}

					$scope.modalInviteGmail = function(){
						modalFactory.inviteGmail('');

						var config = {
					      	'client_id': '788891428909-o4a2s2hht5jud5at66crv1je57f9198i.apps.googleusercontent.com',
					      	'scope': 'https://www.google.com/m8/feeds'
					    };
					    gapi.auth.authorize(config, function() {
					       	fetch(gapi.auth.getToken());
					    });
					}

					function fetch(token) {
					    $.ajax({
						    url: "https://www.google.com/m8/feeds/contacts/default/full?access_token=" + token.access_token + "&alt=json",
						    dataType: "jsonp",
						    success:function(data) {
						    	//factory.modal_item2 = true;   
						        //console.log(JSON.stringify(data));
						  		var data_json = data;
						        //console.log(data_json);
								var entry_data = data_json.feed.entry;

								var email_list = [];

								//factory.email_name = data_json.feed.author.name;
								
								for(var i=0; i<entry_data.length; i++){
								 	if(entry_data[i].gd$email){
								 		var email = entry_data[i].gd$email[0].address;

								 		email_list.push({address: email});
								 		
								 	}
								}	  

								modalFactory.inviteGmail(email_list);   
			 

						    }
						});
					}

					$scope.searchWith=function(){
							$scope.gg = true;
						if($scope.with.text.length>0){
							ProfileService.searchUser ($scope.with.text, 10, 0,function(response){
								
								$scope.gg = false;
								$scope.with.search_list.list=response.data.c.data.content.list_user;
							},function(response){
								console.log(response);
							});
						}else{
							 	 	$scope.suggestions=[];
							$scope.gg = false;
						}
					}

					$scope.close_search_user=function(){
						$scope.with.search_list.list = [];
						$scope.with.text = [];
					}

					$scope.getNotificationNumber=function(){
						
					}
					
					$scope.keydownWith=function($event,$index){
						if($event.keyCode === 40){
								$event.preventDefault();
								$scope.with.search_list.next();
							}
							else if($event.keyCode === 38){
									$event.preventDefault();
									$scope.with.search_list.prev();
							}
							
					}
					$scope.notification_setting=function(){
						
						$state.go('setting', { 'menu': 'notification' },{reload:true});
					}

					$scope.friend_request_find_friend=function(){
						
						$state.go('profile',{},{reload:true});
					}
										
										$scope.setting=function(){
						
						$state.go('setting', { 'menu': '' },{reload:true});
					}

					$scope.trending=function(){
						
//						$state.go('trending', {'menu': 'trending' });
					}

					

					$scope.notification_mark_all=function(){
						
						if($scope.notification_popup_all.length>0){

									ConnectionService.requestMarkAllNotification (function(response){
										//console.log(response);

										angular.forEach($scope.notification_popup_all,function(value,key){
											$scope.notification_popup_all[key].read_at = 1;
										});

										/*$mdDialog.show(
												$mdDialog.alert()
													.clickOutsideToClose(true)
													.title('Mark all notification')
													.textContent('Successfully')
													.ok('Done')
											);*/
											
										$scope.notification_count=0;


									},function(response){
										//console.log(response);
									});
						}else{
							$mdDialog.show(
												$mdDialog.alert()
													.clickOutsideToClose(true)
													.title('Sorry you dont have any notification')
													.ok('Ok')
											);
						}
					}

					$scope.notification_delete=function(index){

						// modalFactory.confirm(
						// 	'Are you sure want to delete this notification ?',
						// 	function(response){
						// 		if(response){
									var id = $scope.notification_popup_all[index].notification_id;
									var type = $scope.notification_popup_all[index].type;

									ConnectionService.requestDeleteNotification (id, type, function(response){
										$scope.notification_popup_all.splice(index, 1);
										//get_notification_count("null", '1', 0);
									},function(response){
										console.log(response);
									});
						//		}
						//	}
						//);
						/*
									var id = $scope.notification_popup_all[index].notification_id;
									var type = $scope.notification_popup_all[index].type;

									ConnectionService.requestDeleteNotification (id, type, function(response){
										$scope.notification_popup_all.splice(index, 1);
										get_notification_count("null", '1', 0);
									},function(response){
										console.log(response);
									});
						*/
							
							
					}

					$scope.search_click = function(username){
						$state.go('profile', {user: username});
					}

					$scope.search_enter = function(){
						var search = $scope.with.text;
						if(search!='')
						$state.go('search-result', {search_text: search});
					}

					$scope.isNotificationOpen=false;
					$scope.toggle_notification = function(){
										
						$scope.isNotificationOpen=!$scope.isNotificationOpen;

						if($scope.notification_count>0){
								ConnectionService.requestMarkAllNotification (function(response){

									angular.forEach($scope.notification_popup_all,function(value,key){
										$scope.notification_popup_all[key].read_at = 1;
									});

								
									$scope.notification_count=0;

								},function(response){
									//console.log(response);
								});
						}
					}
							$scope.closeNotification = function(){
								$scope.isNotificationOpen=false;
								//$scope.notification_popup_all=[];
							}

							$scope.isFriendRequestOpen=false;
					$scope.toggle_friend_request = function(){
										
									 $scope.isFriendRequestOpen=!$scope.isFriendRequestOpen;
									
							}
							$scope.closeFriendRequest = function(){
								$scope.isFriendRequestOpen=false;
								//$scope.notification_popup_all=[];
							}
					
					/*
						$('html').click(function(e) {
									//check up the tree of the click target to check whether user has clicked outside of menu
									if(!$('#show_notification').is(e.target)){
										if(!$('.c-notification-popup').is(e.target)){
											if ($(".c-notification-popup").css('display')=='block' && !$('.c-notification-popup').is(e.target)){ 
												 $(".c-notification-popup").fadeOut(300);
											}
									}
								}
							})
							*/

					$scope.show_all_notification = function(){
						$state.go('notification');
					}

					$scope.show_all_friend_request = function(){
						$state.go('friend-request');
					}

					$scope.start_notification_popup = false;

					function get_notification_popup_all(type, limit, offset){
			
						ConnectionService.listNotification ( 
							type, limit, offset,
							function(response){//callback sucess
								//console.log(response.data.c.data.content);
								$scope.notification_popup_all = response.data.c.data.content.list_notification;
								$scope.start_notification_popup = true;
								$scope.notification_count = response.data.c.data.content.count_notif;

							},
							function(response){//err callback
								console.log(response);
							}
						);
					}
					get_notification_popup_all("null", '10', 0);

					$scope.view_notification = function(notification_all, index){
						
						//$(.).children(id).removeClass("active");
						//$state.go('profile', {user_id: id});
						var post_id = $scope.notification_popup_all[index].post_id;
						var read_at_real = $scope.notification_popup_all[index].read_at;
						var id = $scope.notification_popup_all[index].notification_id;
						var type = $scope.notification_popup_all[index].type;
						var username = $scope.notification_popup_all[index].username;
						var post_code = $scope.notification_popup_all[index].post_code;
						var from_name = $scope.notification_popup_all[index].from_user_display_name;


						
						if(read_at_real==null){

							var read_at = Number(new Date());

							ConnectionService.requestViewNotification (id, type, read_at, function(response){
								console.log(response);
								//alert("Halaman detail post id : " + post_id);
								$scope.notification_popup_all[index].read_at = 1;

								if(type=="friend_request" || type == "follow_request" || type == "added_friend"){
									$state.go('profile', {user: username});
								}else if(type=="ask_with"){
									modalFactory.withCard(post_id, post_code,from_name);
								}else if(type=="ask_place"){
									modalFactory.placeCard(post_id, post_code,from_name);
									
								}else{
									if($stateParams.post_id==post_code){
										$state.reload()
									}else
									$state.go('detail-page', {post_id: post_code});
								}

							},function(response){
								//console.log(response);
							});
						}else{
								if(type=="friend_request" || type == "follow_request" || type == "added_friend"){
									$state.go('profile', {user: username});
								}else if(type=="ask_with"){
									modalFactory.withCard(post_id, post_code,from_name);
								}else if(type=="ask_place"){
									modalFactory.placeCard(post_id, post_code,from_name);
								}else{
									if($stateParams.post_id==post_code){
										$state.reload()
									}else
									$state.go('detail-page', {post_id: post_code});
								}
						}
					}

					
					$scope.view_friend_request=function(username){
						$state.go('profile', {user: username});
					}

					$scope.init=function(){
//						ProfileService.userData = null;
						ProfileService.userInfo ('',function(response){
							angular.extend($scope,response);
							$scope.token_user_id = ProfileService.userData.user_id;
							run_socket();
						},function(response){
							console.log(response);
						});
					}
					$scope.init();

					$scope.format_date=function(date){

						date = date * 1000;
						if (typeof date !== 'object') {
									date = new Date(date);
							}

							var seconds = Math.floor((new Date() - date) / 1000);
							seconds = seconds + 230;
							var intervalType;

							var interval = Math.floor(seconds / 31536000);
							if (interval >= 1) {
									intervalType = 'year';
							} else {
									interval = Math.floor(seconds / 2592000);
									if (interval >= 1) {
											intervalType = 'month';
									} else {
											interval = Math.floor(seconds / 86400);
											if (interval >= 1) {
													intervalType = 'day';
											} else {
													interval = Math.floor(seconds / 3600);
													if (interval >= 1) {
															intervalType = "hour";
													} else {
															interval = Math.floor(seconds / 60);
															if (interval >= 1) {
																	intervalType = "minute";
															} else {
																	interval = seconds;
																	intervalType = "second";
															}
													}
											}
									}
							}

							if (interval > 1 || interval === 0) {
									intervalType += 's';
							}

							return interval + ' ' + intervalType + " ago";		
							
					
					} 

					// API friend-request popup 
					$scope.friend_request_popup=[];
					$scope.start_friend_request_popup = false;
					

					function getList_friend_request_popup(limit, offset){
			
						ConnectionService.listFriendRequest ( 
							limit, offset,
							function(response){//callback sucess
								//console.log(response.data.c.data.content);
								$scope.friend_request_popup = response.data.c.data.content.data;
								$scope.start_friend_request_popup = true;

								angular.forEach($scope.friend_request_popup,function(value,key){
									value.fr_accept_status = false;
									value.fr_reject_status = false;
									value.fr_default_status = true;
									value.fr_action_loading = false;
								});
							},
							function(response){//err callback
								console.log(response);
							}
						);
					}

					getList_friend_request_popup('10', 0);

					$scope.fr_action_accept = function(friend_popup, index){
						friend_popup.fr_action_loading = true;					

						var user_id = $scope.friend_request_popup[index].list_user.user_id;
						//alert(user_id);
						
						ConnectionService.requestConfirmFriendRequest(user_id, function(response){
							//console.log(response);
							friend_popup.fr_accept_status = true;
							friend_popup.fr_reject_status = false;
							friend_popup.fr_default_status = false;
							friend_popup.fr_action_loading = false;

							get_friend_request_count('1', 0);
							
						},function(response){
							//console.log(response);
						});
					
					}

					$scope.fr_action_reject = function(friend_popup, index){
						friend_popup.fr_action_loading = true;			

						var user_id = $scope.friend_request_popup[index].list_user.user_id;
						
						ConnectionService.requestRejectFriendRequest(user_id, function(response){
							//console.log(response);
							
							friend_popup.fr_accept_status = false;
							friend_popup.fr_reject_status = true;
							friend_popup.fr_default_status = false;
							friend_popup.fr_action_loading = false;

							get_friend_request_count('1', 0);
						},function(response){
							//console.log(response);
						});
						
					}

					$scope.fr_action_block = function(friend_popup, index){
						
						var user_id = $scope.friend_request_popup[index].list_user.user_id;
						
						ConnectionService.requestRejectFriendRequest(user_id, function(response){
							//console.log(response);
							
							$mdDialog.show(
								$mdDialog.alert()
								.clickOutsideToClose(true)
								.title('This account is successfully blocked')
								.ok('Done')
							);
							$scope.friend_request_popup.splice(index, 1);

						},function(response){
							//console.log(response);
						});
					}

					$scope.fr_view_profile = function(username){
						$state.go('profile', {user: username});
					}

					// get data count notification
					$scope.list_notification_count=[];
					$scope.notification_count=0;

					function get_notification_count(type, limit, offset){
			
						ConnectionService.listNotification ( 
							type, limit, offset,
							function(response){//callback sucess
								//console.log(response.data.c.data.content);
								$scope.notification_count = response.data.c.data.content.count_notif;
								if($scope.notification_count>99){
									$scope.notification_count = '99+';
								}
								//console.log($scope.notification_count);

							},
							function(response){//err callback
								console.log(response);
							}
						);
					}
					//get_notification_count("null", '1', 0);

					// get data count friend request
					$scope.list_friend_request_count=[];
					$scope.friend_request_count=0;

					function get_friend_request_count(limit, offset){
						$scope.friend_request_count=0;
						ConnectionService.listFriendRequest ( 
							limit, offset,
							function(response){//callback sucess
								
								$scope.friend_request_count = response.data.c.data.meta.total;
								if($scope.friend_request_count>99){
									$scope.friend_request_count == '99+';
								}
								//console.log($scope.friend_request_count);
								
							},
							function(response){//err callback
								console.log(response);
							}
						);
					}
					get_friend_request_count('1', 0);


					function show_popup_achievement(data){
						// if(data){
						// 	modalFactory.popup_achivement(data);
						// }
						//var data = ['66'];
						for(var i=0; i<data.length; i++){
							modalFactory.popup_achivement(data[i]);
						}

						//console.log(data);
					}

					//show_popup_achievement('');

					function run_socket(data){
						// socket commend				
						var socket = CiayoService.Socket();
						//console.log($scope.token_user_id);
						socket.emit('set_userid', $scope.token_user_id);
						socket.on('nf004', function(data){	
							//alert("ada");
						 	//console.log(data);
						 	//get_notification_count("null", '1', 0);
						 	$scope.notification_popup_all=[];
						 	get_notification_popup_all("null", '10', 0);
						});

						//socket popup achievement
						socket.on('ach001', function(data){	
							
							//console.log(data)
							show_popup_achievement(data);
							
						});

						//socket like
						socket.on('nf005', function(data){	
						//alert("ada");
						 	//console.log(data);
						 	//get_notification_count("null", '1', 0);
						 	$scope.notification_popup_all=[];
						 	get_notification_popup_all("null", '10', 0);
						});
						//socket ask response
						socket.on('ant001', function(data){
						 	$scope.notification_popup_all=[];
						 	get_notification_popup_all("null", '10', 0);
						});
						//socket confirm request friend
						socket.on('nf003', function(data){	
							//alert("ada");
						 	//console.log("berhasil conf");
						 	get_friend_request_count('1', 0);
						 	$scope.friend_request_popup=[];
						 	getList_friend_request_popup('10', 0);
						 	//get_notification_count("null", '1', 0);
						 	$scope.notification_popup_all=[];
						 	get_notification_popup_all("null", '10', 0);
						});
							
						//socket add friend
						socket.on('nf002', function(data){	
						//alert("ada");
						 	//console.log(data);
						 	get_friend_request_count('1', 0);
						 	$scope.friend_request_popup=[];
						 	getList_friend_request_popup('10', 0);
						 	//get_notification_count("null", '1', 0);
						 	$scope.notification_popup_all=[];
						 	get_notification_popup_all("null", '10', 0);
						});
					}
					
							
					var user_added_friend = $rootScope.$on(
						"user.added_friend",
						function(event, data) {
							get_friend_request_count('1', 0);
						 	$scope.friend_request_popup=[];
						 	getList_friend_request_popup('10', 0);	
							//console.log(event,data);
								
						}
					);

					var user_notification = $rootScope.$on(
							"user.notification",
							function(event, data) {
									//get_notification_count("null", '1', 0);
									get_notification_popup_all("null", '10', 0);
									
							}
					);
					var user_info_header = $rootScope.$on(
							"user.user_info_header",
							function(event, data) {
									//alert(data);
								 		$scope.profile[5].value = data;
								 		//$scope.init();
							}
					);

				}
			};
		});
}();

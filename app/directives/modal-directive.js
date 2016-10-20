(function () {
	"use strict";
	angular
		.module("CiayoModal", [])
		.directive('toggleModal', function () {
		return {
			restrict : "A",
			link: function(scope, elem, attr){
				$(elem).on("click", function(e){
					e.preventDefault();
					function close(){
						$(document.body).removeAttr("style");
						$('.c-modal').removeClass('-open');
					}
					if(attr.toggleModal === "close"){
						close();
					} else{
						close();
						$(document.body).css("overflow", "hidden");
						$('#' + attr.toggleModal).addClass('-open');
					}
				})
			}
		}
	})
		.directive('cModal',cModal)
		.factory('modalFactory', modalFactory)
	;

	modalFactory.$inject = ['$rootScope','$window','$filter','PostService','ProfileService', 'AchievementService', 'facebookFactory','SettingService', 'CiayoService'];
	function cModal() {
		return {
			'restrict' : 'E',
			'replace' : true,
			'templateUrl' : 'app/directives/views/modal-template.html',
			controller:cModalCtrl,
			controllerAs:'me'
		}
		function cModalCtrl($scope,$compile){
			var me=this;
			angular.extend(me,{
				isOpen:'',
				template:'',
				close:close
			});
			$scope.$on('modal.open', function(event, args) {
				parse(args);
				open();
			});
			function parse(args){
				if(args['template']!=undefined){
					me.template=args.template;
					if(args.class==undefined){
						me.class='layout-align-center-center layout-column';
					}else{
						me.class=args.class;
					}
					me.data=args.data;
				}else{
					console.error('Modal must have template');
				}

			}
			function open(){
				me.isOpen='-open';
				angular.element('body').css("overflow", "hidden");
			}
			function close(){
				me.isOpen='';
				me.template=null;
				angular.element('body').removeAttr("style");
			}

		
		}
	}
	function modalFactory($rootScope,$window,$filter,PostService,ProfileService, AchievementService, facebookFactory, SettingService, CiayoService) {
		var factory = {
			message:message,
			confirm:confirm,
			inviteEmail: inviteEmail,
			inviteGmail: inviteGmail,
			withCard:withCard,
			placeCard:placeCard,
			card:card,
			tagFriend:tagFriend,
			tagPlace:tagPlace,
			popup_achivement:popup_achivement
		};
		return factory;

		function message(message){
			$rootScope.$broadcast(
				'modal.open',
				{
					'template':'app/directives/views/modal-message.html',
					'data':{'message':message}
				}
			);
		}
		function inviteEmail(message){
			$rootScope.$broadcast(
				'modal.open',
				{
					'template':'app/directives/views/modal-invite-email.html',
					'data':{'message':message,
							i_email:'',
							i_message:'',
							hideEmail:'',
							actionSendInvitation:function(){
								var i_email = this.i_email;


								if(i_email){
									

									var email_all = i_email;

									var email = email_all.split(',');

									var error = 0;
									for(var i=0; i<email.length; i++){

										//console.log(email[i]);
										var ok = false;
											var c = {
												data: {
													"email": email[i]
												}
											}
										CiayoService.Api('users/invite', c, function(response) {
											if(response.status==200){
												var data = response.data.c.data;

												
												//modalFactory.message(data.message.email[0]);
												
												if (data.error == false) {
													
												}else{
													error++;
												}
											}
											if(ok){
												console.log(data.message);
											}else{
												//...
											}
										});
									}

									if(error==0){
										this.hideEmail = true;
									}else{
										factory.message("Sent invitation error");
									}
									factory.modal_item1 = false;

								}else{
									factory.message('Please fill email');
								}
							}
				}
				}
			);
		}
		function inviteGmail(email_list){
			$rootScope.$broadcast(
				'modal.open',
				{
					'template':'app/directives/views/modal-invite-gmail.html',
					'data':{'message':message,
							'email_list':email_list,
							'hideGmailSearch':false,
							'load_email':false,
							'hideGmail':false,
							'fill_email':false,
							'email_list_next':[],
							open_modal: function(){
								this.load_email = true;
							},
							next_load: function(){
								var email_list = this.email_list;
								
								var jml = 0;
								for(var i=0; i<email_list.length; i++){
									if(email_list[i].value==true){
										jml++;
										this.email_list_next.push({address: email_list[i].address});
										
									}
								}

								if(jml>0){
									this.hideGmailSearch = true;
								}else{
									this.fill_email = true;
								}

							},
							sentInvitationGmail: function(){
								var email_list_next = this.email_list_next;
								
								for(var i=0; i<email_list_next.length; i++){
									
										
									var ok = false;
									var c = {
										data: {
											"email": email_list_next[i].address
										}
									}
									CiayoService.Api('users/invite', c, function(response) {
										if(response.status==200){
											var data = response.data.c.data;

											//modalFactory.message(data.message.email[0]);
											
											if (data.error == false) {
												
											}else{
												//error++;
											}
										}
										if(ok){
											console.log(data.message);
										}else{
											//...
										}
									});
										
									
								}
								this.hideGmail = true;

							}
					}
				}
			);
		}
		function confirm(message,callback){
			$rootScope.$broadcast(
				'modal.open',
				{
					'template':'app/directives/views/modal-confirm.html',
					'data':{
						'message':message,
						tFnc:function(){callback(true)},
						fFnc:function(){callback(false);},
					}
				}
			);
		}
		function withCard(post_id, post_code,from_name,callback){
			PostService.detail (post_code, function(response){
				var js_timeline=response.data.c.data.content;
				if(js_timeline.with_detail.with_status.value!=-1){
					factory.message('Kamu sudah pernah merespon');
					return;
				}
				js_timeline.activity_detail.avatar_url=js_timeline.user_avatar.face;
//				js_timeline.place.url='https://www.google.com/maps/preview/@'+js_timeline.place.place_lat+','+js_timeline.place.place_long+',8z';
			
				js_timeline.view='detail';
				$rootScope.$broadcast(
					'modal.open',
					{
						'template':'app/directives/views/modal-ask-with.html',
						'data':{
							title:$filter('translate')('$asking.with'),
							from_name:from_name,
							created_at:js_timeline.created_at,
							image:js_timeline.activity_detail.preview,
							caption:js_timeline.activity_detail.caption,
							response:function(value){
								PostService.response(post_id,'response_with',value,function(data){
									if(data){
										factory.message(data.data.c.data.message);
									}
								},function(){
									
								})
							},
							tag:function(){
								tagFriend(post_id);
							}
						}
					}
				);
			},function(response){
				console.log(response);
			});
		}
		function placeCard(post_id, post_code,from_name,callback){
			PostService.detail (post_code, function(response){
				var js_timeline=response.data.c.data.content;
				if(js_timeline.place_detail.place_status.value!=-1){
					factory.message('Kamu sudah pernah merespon');
					return;
				}
				console.log(response);
				js_timeline.activity_detail.avatar_url=js_timeline.user_avatar.face;
				js_timeline.view='detail';
				$rootScope.$broadcast(
					'modal.open',
					{
						'template':'app/directives/views/modal-ask-place.html',
						'data':{
							title:$filter('translate')('$asking.place'),
							from_name:from_name,
							created_at:js_timeline.created_at,
							image:js_timeline.activity_detail.preview,
							caption:js_timeline.activity_detail.caption,
							response:function(value){
								PostService.response(post_id,'response_place',value,function(data){
									if(data){
										factory.message(data.data.c.data.message);
									}
								},function(){
									
								})
							},
							tag:function(){
								tagPlace(post_id)
							}
						}
					}
				);
			},function(response){
				console.log(response);
			});
		}
		function card(post_code){
			PostService.detail (post_code, function(response){
				var js_timeline=response.data.c.data.content;
				js_timeline.activity_detail.avatar_url=js_timeline.user_avatar.face;
				js_timeline.view='detail';
				$rootScope.$broadcast(
					'modal.open',
					{
						'template':'app/directives/views/modal-card.html',
						'class':'-card-detail',
						'data':{
							js_timeline:js_timeline,
						}
					}
				);
			},function(response){
				console.log(response);
			});
		}
		function popup_achivement(id){
			AchievementService.popupDetail (id, function(response){
				console.log(response);
				var itemDetail=response.data.c.data.content;
				//var itemDetail.date_get = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
				
				$rootScope.$broadcast(
					'modal.open',
					{
						'template':'app/directives/views/popup-achievement.html',
						'data':{
							itemDetail:itemDetail,
							shareFB:function(id_achievement,id){
								facebookFactory.getToken(function (data) {
									//alert(data.accessToken);
									access_token = data.accessToken;
									uid = data.uid;


									AchievementService.shareFB(access_token, uid, id_achievement,id, function (response) {
										var data = response.data.c.data;
										if(data.error==false){
											//closeDetail();
											message(data.message);
											//vm.isFB = false;
										}
									}, function () {

									});
								});
								//console.log(id_achievement+'_'+id);
							},
							useAsTitle: function(id){
								var updated_filter = [{"filter_id":520,"filter_value" : id}];
								SettingService.updateUserFilter(updated_filter, '2').then(function(data) {
									
									message(data.message);
								});

							}
						}
					}
				);
			 },function(response){
			 	console.log(response);
			 });
		}
		function tagFriend(post_id){
			$rootScope.$broadcast(
					'modal.open',
					{
						'template':'app/directives/views/modal-response-with.html',
						'data':{
							search:'',
							list:[],
							selected:[],
							searchUser:function(){
								var me = this;
								ProfileService.searchFriend(this.search, 20, 0, function (response) {
									var data = response.data.c.data;
									if(data.error==false){
										var list_user = data.content.list_user;
										if(list_user.length>0){
											me.list = list_user;
										}
									}else{
										
									}
									
								}, function (response) {
									console.log(response);
								});
							},
							selectUser:function(user){
								var index = this.selected.indexOf(user);
								if(index==-1){
									this.selected.push(user);
								}
							},
							removeUser:function(user){
								var index = this.selected.indexOf(user);
								if(index!=-1){
									this.selected.splice(index,1);
								}
							},
							save:function(){
								var _with = [];
								angular.forEach(this.selected,function(value,key){
									_with.push({id:value.user_id,username:value.username});
								});
								PostService.updateWith(post_id, _with, function (response) {
									var data = response.data.c.data;
									message(data.message);
								}, function (response) {

								});
							}
						}
					}
				);
		}
		function tagPlace(post_id){
			var nearby_place = [];
			function getPosition(){
				nearby_place=[];
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(loadSuggest);
				} else {

				}
			}
			function loadSuggest(position){
				PostService.loadSuggest(
					position.coords.latitude,position.coords.longitude,
					function(response){
						nearby_place = response.data.c.data.content.list_nearby_place;
						data.nearby_list = nearby_place;
						$rootScope.$broadcast(
					'modal.open',
					{
						'template':'app/directives/views/modal-response-place.html',
						'data':data
					}
				);
					},function(response){

				});
			}
			function init(){
				getPosition();
			}
			init();
			
			var data = {
							search:'',
							place_list:[],
							nearby_list:nearby_place,
							selected:null,
							searchPlace:function(){
								var me = this;
								PostService.searchPlace(this.search, function (response) {
								var data = response.data.c.data;
								if(data.error==false){
									if(data.content.data.length>0){
										me.place_list = data.content.data;
									}else{
//										modalFactory.message($filter('translate')('$not.found'));
									}
								}else{
//									modalFactory.message(data.message);
								}
							}, function (response) {
								console.log(response);
							});
							},
							selectPlace:function(place){
								this.selected = place;
								this.search='';
							},
							removePlace:function(){
								this.selected = null;
								this.place_list= [];
								this.search='';
							},
							save:function(callback){
								var me = this;
								if(me.selected==null){
									return;
								}
								PostService.updatePlace(post_id, me.selected.id, function (response) {
									var data = response.data.c.data;
									message(data.message);
									callback();
								}, function (response) {
									callback();
								});
							}
						}
			
		}


	}
})();
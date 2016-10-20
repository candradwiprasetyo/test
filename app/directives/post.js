+ function () {
	"use strict";
	angular
		.module("CiayoPost", [])
		.directive('cPost', function () {
			return {
				restrict: "E",
				scope: {
					post: '=',
					time: '='
				},
				replace: true,
				templateUrl: 'app/directives/views/post.html',
				controller: function ($scope, $element, $state, PostService, ItemService, ProfileService, listService, $location, $rootScope, modalFactory,TourService,$filter) {
					var me = this;
					if ($scope.time == undefined) $scope.time = true;
					//proses migrasi
					angular.extend(me, {
						cur_time: '',
						init: function () {
							this.reset();
							this.cur_time = new Date().getTime();
						},
						reset: function () {
							this.setFocus('item', 0);
						},
						setFocus: function (focus, arrayIndex) {
							angular.forEach(this.prop, function (value, key) {
								if (value.isArray) {
									value.isFocus = angular.equals(key, focus) ? arrayIndex : -1;
								} else {
									value.isFocus = angular.equals(key, focus);
								}
							});
						},
						setActive: function (active, arrayIndex) {
							angular.forEach(this.prop, function (value, key) {
								if (value.isArray) {
									value.isActive = angular.equals(key, active) ? arrayIndex : -1;
								} else {
									value.isActive = angular.equals(key, active);
								}
							});
						},
						prop: {
							activity: {
								text: '',
								search_list: Object.create(listService)
							},
							caption: {
								text: ''
							},
							item: {
								isArray: true,
							},
							with: {
								text: ''
							},
							place: {
								text: '',
								selected: {}
							}
						},
						default: {

						},
						activity: {
							isActive: false,
							waiting: false,
							list: [],
							text: '',
							selectedIndex: -1,
							prev: function () {
								if (parseInt(this.selectedIndex) > 0) {
									this.selectedIndex--;
								}
								var li = $('#listActivity ul li:nth-child(' + this.selectedIndex + ')').offset();
								var off = li.top;
								if (off <= 125) {
									var pos = $("#listActivity").scrollTop() - 60;
									$("#listActivity").scrollTop(pos);
								}
							},
							next: function () {
								console.log(this.list.length);
								if (parseInt(this.selectedIndex) + 1 < this.list.length) {
									this.selectedIndex++;
								}

								var li = $('#listActivity ul li:nth-child(' + this.selectedIndex + ')').offset();
								var off = li.top;
								if (off >= 325) {
									var pos = $("#listActivity").scrollTop() + 60;
									$("#listActivity").scrollTop(pos);
								}

							}
						},
						loading_activity:false,
						loading_detail:false,
						kepoboxSlide:kepoboxSlide
					});
					this.init();
					function kepoboxSlide(){
					var myDate = new Date(); 
					var current_time = 'day';
					if (myDate.getHours() >= 5 && myDate.getHours() < 10)  
						current_time = 'morning';
					else if (myDate.getHours() >= 15 && myDate.getHours() < 19) 
						current_time = 'afternoon';
					else if ( myDate.getHours() >= 19 || myDate.getHours() < 5) 
						current_time = 'night';
					PostService.getKepoboxImage(current_time,function(data){
						me.kepobox_image = data.content.list_kepobox[0].kepobox_images[0].image;
					})
		//			$('.kepobox img.'+current_time).show();
				}
					//CLASS
					me.category = {
						isActive: false,
						list: [],
						selectedIndex: 0,
						toggle: function () {
							this.isActive = !this.isActive;
						},
						getSelectedId: function () {
							return this.list[this.selectedIndex].id;
						}
					};
					me.mood = {
						list: [],
						selectedIndex: 0
					};

					me.activity_detail = [];
					me.item = {
						text: null,
						position: -1,
						edit: -1,
						dummy: function () {
							this.item_id = null;
							this.item_name = null;
							this.item_image_thumbnail = null;
							this.item_image_detail = null;
							this.item_type = null;
						},
						size: 4,
						selectedItem: [],
						init: function () {
							this.selectedItem = [];
							for (var i = 0; i < this.size; i++) {
								this.selectedItem.push(new(this.dummy));
							}
						},
						open: function (pos) {
							me.prop.item.text = null;
							me.item.search_list.reset();
							me.setActive('none');
							me.setFocus('none');
							
							this.edit = -1;
							this.position = pos;
							me.place.isActive = false;
							me.with.isActive = false;
							
							setTimeout(function () {
								angular.element('#txt-post-item-' + pos).focus();
							}, 100);
						},
						openEdit: function (pos) {
							this.edit = pos;
							this.position = -1;
							me.place.isActive = false;
							me.with.isActive = false;
						},
						remove:function(item){
							this.selectedItem[this.selectedItem.indexOf(item)]=new(this.dummy);
							this.edit=-1;
						},
						search_list: Object.create(listService),
						search_view: 5,
						search_pos: 0,
					}
					me.with = {
						text: "",
						isActive: false,
						open: function (pos) {
							this.isActive = true;
							me.item.position = -1;
							me.item.edit = -1;
							me.place.isActive = false;
						},
						search_list: Object.create(listService)
					}
					me.place = {
						text: '',
						isActive: false,
						open: function (pos) {
							this.isActive = true;
							me.item.position = -1;
							me.item.edit = -1;
							me.with.isActive = false;
						},
						search_list: Object.create(listService)
					}
					me.post = {
						"activity_id": null,
						"mood_id": 1,
						"place_id": null,
						"post_category": "0",
						"caption": "",
						"bubble": false,
						"items": [],
						"with_users": [
							//{"id": "11","username": "andi"},post
						]
					};

					me.initPost = function () {
						kepoboxSlide();
							PostService.postAttributes(function () {
								me.category.list = PostService.permission_list;
								me.mood.list = PostService.mood_list;
								me.mood.selectedIndex = 0;
								me.resetActivity();
								me.post.post_category = me.category.getSelectedId();
								me.selectCategory(1);
								me.item.search_list.reset();
								me.with.search_list.reset();
								me.place.search_list.reset();
								me.place.text = '';
								me.post = {
									"activity_id": null,
									"mood_id": 1,
									"place_id": null,
									"post_category": "0",
									"caption": "",
									"bubble": false,
									"items": [],
									"with_users": []
								};
								me.prop.place.selected={};
								//ci-box-caption, ci-bubble-caption
								getPosition();
							}, function (response) {
								console.log(response);
							});
						}
						//MOOD
					me.selectMood = function (index) {
						var const_mood =['normal','happy','sad'];
						me.mood.selectedIndex = index;
						me.post.mood_id = me.mood.list[index].mood_id;
						me.updateMood(const_mood[me.mood.list[index].mood_id-1]);
					}
					me.updateMood = function (mood) {
							if (mood == null) {
								mood = 'normal';
							}
							if (me.activity_detail[0].avatar_url_list != null) {
								me.activity_detail[0].avatar_url = me.activity_detail[0].avatar_url_list[mood.toLowerCase()];
								if(me.activity_detail[0].init!=undefined){
									me.activity_detail[0].init();
								}
							}
						}
						//ACTIVITY
					me.resetActivity = function () {
						//						var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
						//						angular.element($element).find('#posting-activity').addClass('animated fadeOutUp').one(animationEnd,function(){
						//							angular.element(this).removeClass('animated fadeOutUp');
						//						});
						me.loading_activity=false;
						me.loading_detail=false;
						me.activity_detail=[];
						me.item.init();
						me.prop.activity.text = "";
						me.post.activity_id = null;
						me.activity.list = [];
						me.setActive('none');
						me.setFocus('none');

					}
					me.searchActivity = function (from) {
						var text = me.prop.activity.text;
						if (text.length > 1) {
							me.loading_activity=true;
							me.post.activity_id = null;
							PostService.searchActivity(text, 20, 0, function (response) {
								me.loading_activity=false;
								var data = response.data.c.data;
								if (data.error == false) {
									me.activity.list = data.content.list_activity;
									me.setActive('activity');
									if(me.activity.list.length==0 && from==undefined){
										modalFactory.message($filter('translate')('$not.found'));
									}else{
										TourService.tourSelectActivity();
										me.activity.selectedIndex=0;
									}
								} else {
									modalFactory.message(data.message);
								}
								
							}, function (response) {
								modalFactory.message('error API');
								me.loading_activity=false;
							});
						}
					}
					me.selectActivity = function (index) {
						var activity_id = me.activity.list[index].activity_id;
						me.setActive('none');
						me.loading_detail=true;
						me.post.activity_id = -1;
						me.activity.waiting = true;
						PostService.activityDetail(
							activity_id,
							function (response) {
								me.loading_detail=false;
								var data = response.data.c.data;
								if (data.error == false) {
									TourService.tourCreatePost();
									me.prop.activity.text = me.activity.list[index].activity_name;
									me.post.activity_id = me.activity.list[index].activity_id;
									me.activity.list = [];
									me.activity_detail = [data.content];
									me.setFocus('caption');
									me.item.init();
									me.activity_detail[0].avatar_url_list = me.activity_detail[0].avatar_url;
									me.updateMood();
									me.post.bubble = me.activity_detail[0].bubble == true;
								} else {
									modalFactory.message(data.message);
									me.post.activity_id = null;
								}
								me.waiting = false;
							},
							function (response) {
								me.loading_detail=false;
								modalFactory.message('error API');
								me.waiting = false;
								me.post.activity_id = null;
							}
						);
					}
					me.keypressActivity = function ($event) {
							if ($event.keyCode === 40) {
								$event.preventDefault();
								me.activity.next();
							} else if ($event.keyCode === 38) {
								$event.preventDefault();
								me.activity.prev();
							} else if ($event.keyCode === 13) {console.log(me.activity.selectedIndex);
								me.selectActivity(me.activity.selectedIndex);
							}
						}
						//ITEM
					me.searchItem = function ($index) {
						if (me.prop.item.text.length > 1) {
							//me.post.items[$index].item_id=null;
							ItemService.list(me.prop.item.text, null, 20, 0, function (response) {
								var data = response.data.c.data;
								if(data.error==false){
									var list = data.content.list_item;
									var selected = [];
									angular.forEach(me.item.selectedItem, function (value, key) {
										if (value.item_id) {
											selected.push(value.item_id);
										}
									});
									for (var key = list.length - 1; key >= 0; key--) {
										var value = list[key];
										var index = selected.indexOf(value.item_id);
										if (index != -1) {
											list.splice(key, 1);
										}
									}
									if(list.length>0){
										me.item.search_list.list = list;
									}else{
										modalFactory.message($filter('translate')('$not.found'));
									}
								}else{
									modalFactory.message(data.message);
								}
							}, function (response) {
								console.log(response);
							});
						}
					}
					me.selectItem = function ($index) {
						me.item.selectedItem[$index] = me.item.search_list.getSelectedItem();
						me.item.open(-1);
//						if (me.item.position < me.item.size) {
//							me.item.open(me.item.position + 1);
//						}
					}
					me.keypressItem = function ($event, $index) {
							if ($event.keyCode === 40) {
								$event.preventDefault();
								me.item.search_list.next('.c-tml-ilc', 60, 5);
								//								if(me.item.search_list.selectedIndex >= me.item.search_pos+me.item.search_view){
								//									var diff = me.item.search_list.selectedIndex+1 - (me.item.search_view);if(diff<0){diff=0;}
								//									var last_pos = me.item.search_pos;
								//									me.item.search_pos = diff;
								//									var el = angular.element('.c-tml-ilc');
								//									el.scrollTop(me.item.search_pos*60);
								//								}

							} else if ($event.keyCode === 38) {
								$event.preventDefault();
								me.item.search_list.prev('.c-tml-ilc', 60, 5);
								//									if( me.item.search_pos >= me.item.search_list.selectedIndex )
								//									{
								//										me.item.search_pos = me.item.search_list.selectedIndex;
								//										var el = angular.element('.c-tml-ilc');
								//										el.scrollTop(me.item.search_pos*60);
								//									}
							} else if ($event.keyCode === 13) {
								me.selectItem($index);
							}
						}
						//WITH
					me.searchWith = function () {
						if (me.with.text.length > 1) {
							ProfileService.searchFriend(me.with.text, 20, 0, function (response) {
								var data = response.data.c.data;
								if(data.error==false){
									var list = data.content.list_user;
									var selected = [];
									angular.forEach(me.post.with_users, function (value, key) {
										if (value.id) {
											selected.push(value.id);
										}
									});
									for (var key = list.length - 1; key >= 0; key--) {
										var value = list[key];
										var index = selected.indexOf(value.user_id);
										if (index != -1) {
											console.log(index);
											list.splice(key, 1);
										}
									}
									if(list.length>0){
										me.with.search_list.list = list;
									}else{
										modalFactory.message($filter('translate')('$not.found'));
									}
								}else{
									modalFactory.message(data.message);
								}
							}, function (response) {
								console.log(response);
							});
						}
					}
					me.selectWith = function ($index) {
						me.with.text = null;
						var selected = me.with.search_list.getSelectedItem();
						me.post.with_users.push({
							id: selected.user_id,
							username: selected.user_display_name
						})
						me.with.search_list.reset();
					}
					me.removeWith = function (user) {
						var index = me.post.with_users.indexOf(user);
						me.post.with_users.splice(index, 1);
					}
					me.keypressWith = function ($event, $index) {
							if ($event.keyCode === 40) {
								$event.preventDefault();
								me.with.search_list.next();
							} else if ($event.keyCode === 38) {
								$event.preventDefault();
								me.with.search_list.prev();
							} else if ($event.keyCode === 13) {
								me.selectWith($index);
							}
						}
						//PLACE
					me.searchPlace = function () {
						if (me.place.text.length > 1) {
							PostService.searchPlace(me.place.text, function (response) {
								var data = response.data.c.data;
								if(data.error==false){
									if(data.content.data.length>0){
										me.place.search_list.list = data.content.data;
									}else{
										modalFactory.message($filter('translate')('$not.found'));
									}
								}else{
									modalFactory.message(data.message);
								}
							}, function (response) {
								console.log(response);
							});
						}
					}
					me.selectPlace = function (selected) {
//						var selected = me.place.search_list.getSelectedItem();
						me.place.text = selected.name;
						me.post.place_id = selected.id;
						me.with.search_list.reset();
						me.prop.place.selected = selected;
						me.place.isActive = false;
					}
					me.keypressPlace = function ($event, $index) {
							if ($event.keyCode === 40) {
								$event.preventDefault();
								me.place.search_list.next();
							} else if ($event.keyCode === 38) {
								$event.preventDefault();
								me.place.search_list.prev();
							} else if ($event.keyCode === 13) {
								me.selectPlace($index);
							}
						}
					function getPosition(){
						me.nearby_place=[];
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition(loadSuggest);
						} else {

						}
					}
					function loadSuggest(position){PostService.loadSuggest(
						position.coords.latitude,position.coords.longitude,
						function(response){
							me.nearby_place = response.data.c.data.content.list_nearby_place;
						},function(response){
							
						});
					}
						//CATEGORY
					me.selectCategory = function (index, id) {
							me.category.selectedIndex = index;
							me.post.post_category = me.category.getSelectedId();
							me.category.isActive = false;
						}
						//POST
					me.createPost = function () {
						if(me.post.activity_id==undefined){
							modalFactory.message('Silahkan pilih activity');return;
						}if(me.post.activity_id==-1){
							modalFactory.message('Loading Activity, please wait');return;
						}
						
						{
							me.post.items = [];
							angular.forEach(me.item.selectedItem, function (value, key) {
								if (value && value.item_id) {
									me.post.items.push({
										id: value.item_id,
										type: value.item_type
									})
								}
							});
							me.post.caption = me.post.caption.substring(0,50);
							var loading = {
								"view": "loading"
							};
							$scope.post.unshift(loading);
							PostService.create(me.post, function (response) {
								$scope.post.splice(0, 1);
								var data = response.data.c.data;
								if (data.error == false) {
									data.content.view = 'normal';
									if (data.content.activity_detail != undefined) {
										// data.content.activity_detail.animate = me.animate;
										data.content.activity_detail.avatar_url = data.content.user_avatar.face;
										data.content.activity_detail.back_hair = data.content.user_avatar.back_hair;
										// data.type_page = 'timeline';
										data.content.login_id = ProfileService.userData.user_id;
									}
									$scope.post.unshift(data.content);
								} else {
									modalFactory.message(data.message);
								}
								
							},function(){
								modalFactory.message('Please try again');
							});
							me.initPost();
							me.resetActivity();
						}
					}
					me.initPost();
				},
				controllerAs: 'me'
			};
		});
}();
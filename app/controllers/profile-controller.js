(function() {
'use strict';

angular
	.module('app')
	.directive('toggleModal', function(){
		return {
			restrict: "A",
			link: function(scope, elem, attr){
				$(elem).on("click", function(e){
					e.preventDefault();

					if(attr.toggleModal === "close"){
							$(document.body).removeAttr("style");
							$('.c-modal').removeClass('-open');
							$('.ui-datepicker').css('display', 'none');
					} else{
							$(document.body).css("overflow", "hidden");
							$('#' + attr.toggleModal).addClass('-open');
					}
				})
			}
		}
	})
	.filter('spaceless',function() {
		return function(input) {
			if (input) {
				input=input.trim();
				return input.replace(/\s+/g, '-');		
			}
		}
	})
	.controller('ProfileController', ProfileController);

	ProfileController.$inject = ['$rootScope', '$cookieStore','CiayoService','ProfileService', 'SettingService', 'ConnectionService', '$state', '$stateParams', '$filter', '$scope', '$mdDialog','PostService','CiayoBanner','listService','ItemService','$element','modalFactory'];
	function ProfileController($rootScope, $cookieStore,CiayoService, ProfileService, SettingService, ConnectionService, $state, $stateParams, $filter, $mdDialog, $scope, PostService, CiayoBanner, listService, ItemService, $element,modalFactory) {
		var vm = this;
		angular.extend(vm,{
			profile_url:"views/profile.html",
			param_user:$stateParams.user,
			state:0,
			cur_time:'',
			lastId:null,
			reset:reset,
			js_timeline:[],
			setFocus:function(focus,arrayIndex){
				angular.forEach(this.prop,function(value,key){
					if(value.isArray){
						value.isFocus=angular.equals(key,focus)?arrayIndex:-1;
					}else{
						value.isFocus=angular.equals(key,focus);
					}
				});
			},
			setActive:function(active,arrayIndex){
				angular.forEach(this.prop,function(value,key){
					if(value.isArray){
						value.isActive=angular.equals(key,active)?arrayIndex:-1;
					}else{
						value.isActive=angular.equals(key,active);
					}
				});
			},
			prop:{
				list_place:{
					text:'',
					search_list:Object.create(listService)
				},
				caption:{
					text:''
				},
				item:{
					isArray:true,
				},
				with:{
					text:''
				},
				place:{
					text:'',
					selected:{}
				}
			},
			default:{
								
			},
			list_place:{
				isActive:false,
				waiting:false,
				list:[],
				text:'',
				selectedIndex:0,
				prev:function(){
					if(parseInt(this.selectedIndex)>0){
						this.selectedIndex--;
					}
					var wrp = $('._place').offset();
					var off = $('#div_list_place ul li:nth-child('+this.selectedIndex+')').offset();
					try {
						var scale = off.top - wrp.top;
					}catch(err){
						var pos = $("#div_list_place").scrollTop(0);
						$("#div_list_place").scrollTop(pos);
					}
					if(scale<30) {
						var pos = $("#div_list_place").scrollTop() - 32;
						$("#div_list_place").scrollTop(pos);
					}
				},
				next:function(){
					if(parseInt(this.selectedIndex)+1<this.list.length){
						this.selectedIndex++;
					}
					var wrp = $('._place').offset();
					var li = $('#div_list_place ul li:nth-child('+this.selectedIndex+')').offset();
					var off = li.top;
					var scale = off - wrp.top;
					if(scale > 200){
						var pos = $("#div_list_place").scrollTop() + 32;
						$("#div_list_place").scrollTop(pos);
					}
					
				}
			}
		});

		vm.language_id = $cookieStore.get('language');

		function reset(){
			this.setFocus('item',0);
		}

		SettingService.getInfo('').then(function(data) {
			var info=[];
			angular.forEach(data.content.users_info,function(value,key){
                info[value.filter_id] = value;
            });
			try {vm.my_name = info[5].value}catch(err){}
			vm.my_id = data.content.user_id;
		});	
		
		ProfileService.listTitle('score', 'desc', 10, 0, true, function(response){
			vm.listTitle = response.data.c.data.content.data;
		},function(response){

		});

		vm.listCompleted = [];
		vm.listCompletedEmpty = false;
		vm.orderBy = 'asc';
					
		vm.addFriend = function(target) {
			vm.status_add = true;
			vm.add_status_text = "Request Sent";
			vm.status_addstatus = true;
			vm.status_follow = true;

			 ConnectionService.requestAddFriend(vm.user_id, function(response) {
			 	// console.log('request add friend');
	     		// console.log(response);
	    	});
		}

		vm.followFriend = function(status) {
			if(status) {
				vm.status_follow = true;
			} else {
				vm.status_follow = false;
			}
			ConnectionService.requestFollow(vm.user_id, status, function(response){

				console.debug('request follow friend');
	    		// console.log(response);

			},function(response){
				// console.log(response);
			});
		}

		vm.confirmRequestFriend = function(status) {
			vm.showdropconnect = false;
			ProfileService.confirmRequestFriend(vm.user_id, function(response){

				console.debug('confirm request friend');
	    		// console.log(response);
	    		vm.status_approve = true;
	    		vm.status_add = true;
	    		vm.status_follow = true;
	    		$rootScope.$broadcast( "user.added_friend",'data' );

			},function(response){
				// console.log(response);
			});
		}

		vm.rejectRequestFriend = function(status) {
			vm.showdropconnect = false;
			ProfileService.rejectRequestFriend(vm.user_id, function(response){

				console.debug('reject request friend');
	    		// console.log(response);
	    		vm.status_add = false;
	    		$rootScope.$broadcast( "user.added_friend",'data' );

			},function(response){
				//// console.log(response);
			});
		}

		vm.deleteFriend = function(status) {
			vm.showdropadd = false;
			ProfileService.deleteFriend(vm.user_id, function(response){

				console.debug('deletefriend');
	    		// console.log(response);
	    		vm.status_add = false;
	    		vm.status_approve = false;

			},function(response){
				// console.log(response);
			});
		}

		vm.social_media_null = false;

		vm.getSettings = function() {
			SettingService.getSettings().then(function(data) {
				var setting = data.content.list_setting;
				var general = setting.general_setting;
				var email_setting = general.email_setting;
				var edit_account = setting.edit_account;
				var edit_basic_info = setting.edit_basic_info;

				vm.show_email = edit_account.show_email.value;
				vm.show_phone = edit_account.show_phone.value;

				if(!$stateParams.user) {

					try{vm.email = edit_account.email_address.value}catch(err){}
					try{vm.phone = edit_account.phone_number.value}catch(err){}
					vm.edit_email = vm.email;
					vm.edit_phone = vm.phone;

					try{vm.place_of_birth = edit_basic_info.place_of_birth.value}catch(err){}

					try{var timestamp = edit_basic_info.date_of_birth.value}catch(err){}
					var date = new Date(timestamp * 1000);
					var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					vm.date_of_birth = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
					if(vm.place_of_birth && vm.date_of_birth) {
						vm.qoma = ", ";
					} else {
						vm.qoma = "";
					}
					//vm.edit_date_of_birth = date.getDate() + "/" + (parseInt(date.getMonth())+1) + "/" + date.getFullYear();
					var _date = parseInt(date.getDate());
					if(_date<10) {
						_date = "0" + date.getDate();
					}
					var _mounth = parseInt(date.getMonth())+1;
					if(_mounth<10) {
						_mounth = "0" + (parseInt(date.getMonth())+1);
					}
					var newdate = _date + "/" + _mounth + "/" + date.getFullYear();

					try {vm.place_of_birth = info[7].value}catch(err){}

					vm.edit_date_of_birth = newdate;
					var $datepicker = $('#datepicker');
					$datepicker.datepicker();
					$datepicker.datepicker('setDate', new Date(newdate));
				}
				//vm.show_birthday = edit_account.show_birthday.value;
				//vm.show_nationality = edit_account.show_nationality.value;
			});
		}

		vm.getSettings();

		vm.showEmail = function() {
			if (vm.show_email) {
				SettingService.userPreference(1, 'show_email').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'show_email').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		vm.showPhone = function() {
			if (vm.show_phone) {
				SettingService.userPreference(1, 'show_phone').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'show_phone').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		vm.showBirthday = function() {
			if (vm.show_birthday) {
				SettingService.userPreference(1, 'show_birthday').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'show_birthday').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		vm.prefixPhoneNumber = function() {
			var limit = 500;
			var offset = 0;
			SettingService.prefixPhoneNumber(limit, offset).then(function(data) {
				vm.list_prefix_phone_number = data.content.list_prefix_phone_number;
				vm.list_nationality = data.content.list_prefix_phone_number;
			},function(response){
            	//error
        	})
		}

		vm.prefixPhoneNumber();

		vm.showNationality = function() {
			if (vm.show_nationality) {
				SettingService.userPreference(1, 'show_nationality').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'show_nationality').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		vm.sendRequest = function(type) {
			if(type=='birthday') {
				vm.ask_birthday = false;
			}
			if(type=='email') {
				vm.ask_email = false;
			}
			if(type=='phone') {
				vm.ask_phone = false;
			}
		}

		vm.getBasicInfo = function() {

			vm.lastId = null;
			vm.reset();
			vm.cur_time=new Date().getTime();

			$rootScope.$on('$stateChangeStart', 
			function(event, toState, toParams, fromState, fromParams){ 
				$('.ui-datepicker').css('display', 'none');
			});

			if(!vm.aboutme) {

				SettingService.getInfo($stateParams.user).then(function(data) {
					if(data.error){
						
					}else{
						vm.user_id = data.content.user_id;
						vm.old_user_id = data.content.user_id;

						loadTimeline();
						vm.token_user_id = vm.user_id;
						//console.log(ProfileService.userData);
						
						angular.extend(vm,data);

						loadAchievement();

						if($stateParams.user) {
							// status info
							vm.cbutton_status = [];

							vm.cbutton_status = data.content;
							//console.log(vm.cbutton_status);

							vm.cbutton_status.username = $stateParams.user;

							vm.cbutton_status.icon_action_response = false;
							vm.cbutton_status.open_action = false;
							vm.cbutton_status.ci_star = false;
							vm.cbutton_status.ci_check = false;

							//console.log(vm.cbutton_status.status.friend.add);

							if(vm.cbutton_status.status.friend.add==false){
								vm.cbutton_status.icon_addfriend = true;
								vm.cbutton_status.name_addfriend = true;
								vm.cbutton_status.icon_self = 0;
								vm.cbutton_status.name_self = 0;
							}else{
								if(vm.cbutton_status.status.friend.addstatus==false){
									if(vm.cbutton_status.status.friend.approve==true){
										vm.cbutton_status.icon_addfriend = false;
										vm.cbutton_status.name_addfriend = false;
										vm.cbutton_status.icon_self = 0;
										vm.cbutton_status.name_self = 0;
									}else{
										vm.cbutton_status.icon_addfriend = true;
										vm.cbutton_status.name_addfriend = true;
										vm.cbutton_status.icon_self = 1;
										vm.cbutton_status.name_self = 1;
										vm.cbutton_status.ci_star = true;
									}
								}else{
									vm.cbutton_status.icon_addfriend = false;
									vm.cbutton_status.name_addfriend = false;
									vm.cbutton_status.icon_self = 0;
									vm.cbutton_status.name_self = 0;
									vm.cbutton_status.ci_check = true;
								}
							}
						
							if(vm.cbutton_status.status.friend.approve==false){
								vm.cbutton_status.checklist_addfriend = true;
							}else{
								vm.cbutton_status.checklist_addfriend = false;
							}

							if(vm.cbutton_status.status.follow==false){
								vm.cbutton_status.icon_follow = true;
								vm.cbutton_status.name_follow = true;
								vm.cbutton_status.checklist_follow = true;
							}else{
								vm.cbutton_status.icon_follow = false;
								vm.cbutton_status.name_follow = false;
							}

							if($stateParams.user){
								vm.cbutton_status.self = 'false';
							}else{
								vm.cbutton_status.self = 'true';
							}
						}

						vm.listAchievement();

						getList_self(vm.searchtext, 10, 0);

						getList(vm.searchtext, 10, 0, vm.user_id);

						// console.log(vm.user_id);

						vm.getMutualFriend = function() {
							ConnectionService.getMutualFriend(vm.user_id, function(response) {
								// console.log('get mutual friend');
		                		// console.log(response);
		                	});
						}

						vm.getMutualFriend();
						
						vm.aboutme = data;
	            		var info=[];
	            		vm.user_avatar = data.content.users_avatar;

	            		vm.status_add = data.content.status.friend.add;
	                	// console.log(vm.status_add);
	                	vm.status_approve = data.content.status.friend.approve;
	                	vm.status_addstatus = data.content.status.friend.addstatus;
	                	if(vm.status_add == true && vm.status_approve == false) {
	                		vm.add_status_text = "Request Sent";
	                	}
	                	if(vm.status_add == true && vm.status_approve == true) {
	                		vm.add_status_text = "Friend";
	                	}
	                	if(vm.status_add == false && vm.status_approve == false) {
	                		vm.add_status_text = "Add Friend";
	                	}
	                	vm.status_follow = data.content.status.follow;
	                	if(vm.status_follow == true) {
	                		vm.follow_status_text = "Following";
	                	} else {
	                		vm.follow_status_text = "Follow";
	                	}
	                	vm.showdropadd = false;
	                	vm.showdropfollow = false;

	                	if($stateParams.user) {

		            		try {
		            			vm.email = data.content.email;
		            			vm.edit_email = vm.email;
		            		}catch(err){}

		            		try {
		            			vm.phone = data.content.phone;
		            			var phone = vm.phone.split('-');
								vm.prefix_verify = phone[0];
								vm.phone_number = phone[1];

		            		}catch(err){}

	            			var info = [];
							angular.forEach(data.content.users_info,function(value,key){
			                    info[value.filter_id] = value;
			                });

							try {vm.profile_name = info[5].value}catch(err){}
							try {vm.title = info[520].value}catch(err){}

							try {var timestamp = info[6].value}catch(err){}
							var date = new Date(timestamp * 1000);
							var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
							vm.date_of_birth = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
							//vm.edit_date_of_birth = date.getDate() + "/" + (parseInt(date.getMonth())+1) + "/" + date.getFullYear();
							var _date = parseInt(date.getDate());
							if(_date<10) {
								_date = "0" + date.getDate();
							}
							var _mounth = parseInt(date.getMonth())+1;
							if(_mounth<10) {
								_mounth = "0" + (parseInt(date.getMonth())+1);
							}
							var newdate = _date + "/" + _mounth + "/" + date.getFullYear();

							try {
								if(vm.date_of_birth) {
									vm.place_of_birth = info[7].value+', ';
								} else {
									vm.place_of_birth = info[7].value;
								}
							}catch(err){}

							vm.edit_date_of_birth = newdate;
							var $datepicker = $('#datepicker');
							$datepicker.datepicker();
							$datepicker.datepicker('setDate', new Date(newdate));
		            	}

						angular.forEach(data.content.users_info,function(value,key){
		                    info[value.filter_id] = value;
		                });

						try {vm.first_name = info[2].value}catch(err){}
						try {vm.middle_name = info[3].value}catch(err){}
						try {vm.last_name = info[4].value}catch(err){}
						try {vm.profile_name = info[5].value}catch(err){}
						try {vm.edit_profile_name = info[5].value}catch(err){}

						try {vm.pinterest = info[501].value}catch(err){vm.pinterest = false}
						try {vm.facebook = info[480].value}catch(err){ vm.facebook = false}
						try {vm.twitter = info[481].value}catch(err){ vm.twitter = false}
						try {vm.instagram = info[482].value}catch(err){vm.instagram = false}
						try {vm.path = info[500].value}catch(err){vm.path = false}
						if(vm.pinterest==false&&vm.facebook==false&&vm.twitter==false&&vm.instagram==false){
							vm.social_media_nodata=true;
						}
	
						if($stateParams.user) {
							vm.list_social_media = [];
							if(vm.pinterest) vm.list_social_media.push({"name":"Pinterest","value":vm.pinterest});
							if(vm.facebook) vm.list_social_media.push({"name":"Facebook","value":vm.facebook});
							if(vm.twitter) vm.list_social_media.push({"name":"Twitter","value":vm.twitter});
							if(vm.instagram) vm.list_social_media.push({"name":"Instagram","value":vm.instagram});
							if(vm.path) vm.list_social_media.push({"name":"Path-01","value":vm.path});
							if(!vm.list_social_media.length) vm.social_media_null=true;
						} else {
							listSocialMedia();
						}

						try {vm.edit_title = info[520].value}catch(err){}
						try {vm.title = info[520].value}catch(err){vm.title = "no title"}
						
						// // console.log('date' + info[6].value);
						try {vm.nationality = info[8].value}catch(err){}
						try {vm.edit_nationality = info[8].value}catch(err){}
						if(vm.first_name == "-") {vm.first_name = "";}
						if(vm.middle_name == "-") {vm.middle_name = "";}
						if(vm.last_name == "-") {vm.last_name = "";}

						vm.website = null;
						vm.websiteLoading = true;
			            try {
			            	vm.website = null;
			            	vm.edit_list_website = [];
			            	vm.temp_website = [];
			            	vm.website = info[37].value.split(',');
			            	if(vm.website!=' ') {
				            	vm.list_website = [];
				            	for(var i=0 ; i<vm.website.length; i++) {
					            	var val=vm.website[i].split('//');
									if(val[1] != undefined) {
										var value = val[1];
									} else {
										var value = val[0];
									}
									vm.list_website.push({"name":value});
									vm.temp_website[i] = value;
								}
								angular.forEach(vm.list_website,function(value,key){
									vm.edit_list_website.push({"name":value.name});
								});
							} else {
								vm.website = '';
							}
						}catch(err){}

						var keyword = vm.profile_name;
		        		ProfileService.searchUser(keyword, 100, 0, function(response) {
			        		var data = response.data.c.data.content;
			        		var user = [];
			        		angular.forEach(data.list_user,function(value,key){
			                    user[value.user_id] = value;
			                    // console.log(user[value.user_id]);
			                    // console.log(vm.user_id);
			                });
			        		// console.log(response);
				        });
		        	}
				},function(response){
					if(response.status==200){
						var data = response.data.c.data;
						if(data.error==true){
							$state.go('404');
						}
					}
				});
			}
		}

		vm.showdropfollow = false;

		vm.getBasicInfo();

		CiayoBanner.getData("profile", function(response){
			vm.banner = response.data.c.data.content.image;
			setTimeout(function(){
				$('.c-banner').children("ul").parallax({
					clipRelativeInput: false,
					originY: 0.0
				});
			}, 1)
		}, function(){

		})

		vm.addWebsite = function() {
			vm.edit_list_website.push({"name":vm.edit_website});
			var id = 0;
			vm.temp_website = [];
			angular.forEach(vm.edit_list_website,function(value,key){
				vm.temp_website[id]=value.name;
				id++;
			});
			vm.edit_website = '';
		}

		vm.removeWebsite = function(id) {
			for(var i = 0; i < vm.edit_list_website.length; i++) {
				if(vm.edit_list_website[i]['name']==id) {
			    	delete vm.edit_list_website[i];
			    }
			}
			vm.temp_list_website = vm.edit_list_website;
			vm.edit_list_website = [];
			vm.temp_website = [];
			var id = 0;
			angular.forEach(vm.temp_list_website,function(value,key){
				vm.edit_list_website.push({"name":value.name});
				vm.temp_website[id] = value.name;
				id++;
			});
			if(!vm.edit_list_website.length) {
				vm.website_value = ' ';
			}
		}

		vm.saveWebsite = function() {
			if(vm.edit_website) vm.addWebsite();
			if(vm.edit_list_website.length) {
				var id = 0;
				vm.temp_list_website = vm.edit_list_website;
				vm.edit_list_website = [];
				angular.forEach(vm.temp_list_website,function(value,key){
					if(id==0) {
						vm.website_value = vm.temp_website[id];
					} else {
						vm.website_value += ","+vm.temp_website[id];
					}
					vm.edit_list_website.push({"name":vm.temp_website[id]});
					id++;
				});
				vm.website_value = vm.website_value.replace('undefined','');
			}
			if(vm.website_value==undefined) {
				vm.website_value = ' ';
			}
			var type = 2;
			var updated_filter = [{"filter_id":37,"filter_value" : vm.website_value}];
			SettingService.updateUserFilter(updated_filter, type).then(function(data) {
				if(vm.edit_list_website.length) {
					vm.list_website = [];
					angular.forEach(vm.edit_list_website,function(value,key){
						vm.list_website.push({"name":value.name});
					});
				} else {
					vm.list_website = null;
					vm.website = null;
				}
			});
		}

		vm.orderType = 'name';
		vm.orderBy = 'asc';

		vm.offset = 0;
		vm.listCompleted = [];

		function loadAchievement() {
			var c = {
				data: {
					"orderType": vm.orderType,
					"orderBy": vm.orderBy,
					"limit": 20,
					"offset": vm.offset,
					"search": vm.keyword,
					"user_id": vm.user_id
				}
			}
			// get list achievement completed
			CiayoService.Api('achievement/completed', c, function(response){
				if(response.status == 200) {
					scroll();
					var data = response.data.c.data.content.data;
					if(data.length) {
						vm.listCompletedEmpty = false;
						vm.listCompleted = vm.listCompleted.concat(data);
					} else {
						vm.listCompletedEmpty = true;
					}
				} else {
					alert('error ya :(');
				}
			});
		}

		vm.changeOrder = changeOrder;
		function changeOrder(type, by){
			console.log(type);
			vm.orderType = type;
			vm.orderBy = by;
			vm.offset = 0;
			vm.scrollOffset = 200;
			vm.listCompleted = [];
			loadAchievement();
		}

		vm.srchAchievement = srchAchievement;
		function srchAchievement() {
			vm.offset = 0;
			vm.scrollOffset = 200;
			vm.listCompleted = [];
			loadAchievement();
		}

		vm.viewDetail = viewDetail;
		function viewDetail(id) {
			vm.itemDetail = null;
			var elem = angular.element('.c-modal.achievement');
			elem.addClass('-open');

			var c = {
				data: {
					"id_achievement": id,
					"user_id": vm.user_id
				}
			};

			CiayoService.Api('achievement/detail', c, function(response) {
				vm.itemDetail = response.data.c.data.content;
				var date = new Date(vm.itemDetail.date_get*1000);
				vm.itemDetail.date_get = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
				console.log(vm.itemDetail.date_get)
				vm.threshold = vm.itemDetail.treshold.data;
				console.log(vm.threshold);
			});
		}

		vm.closeDetail = closeDetail;
		function closeDetail() {
			var elem = angular.element('.c-modal.achievement');
			elem.removeClass('-open');
			vm.itemDetail = null;
			vm.threshold = null;
		}

		vm.id_list_cities = 1;

		vm.selectCities = function($event) {
		    if($event.keyCode === 40) {
				$event.preventDefault();
				vm.list_place.next();
			} else if($event.keyCode === 38) {
				$event.preventDefault();
				vm.list_place.prev();
			} else if($event.keyCode === 13) { 
				vm.selectPlace(vm.list_place.list[vm.list_place.selectedIndex]);
			}
		}

		vm.selectPlace = function(value) {
			vm.edit_place_of_birth = value.name;
			vm.place_birth = value.name;
			angular.element('._listplace').removeClass('active');
		}

		vm.listBadge = function() {
			var orderType = 'name';
			var orderBy = 'asc';
			var limit = 5;
			var offset = 0;
			ProfileService.listBadge(orderType, orderBy, limit, offset, function(response) {
				vm.list_badge = response.data.c.data.content.data;
				vm.badge_collect = [];
				angular.forEach(vm.list_badge,function(value,key){
					vm.badge_collect[value.id] = false;
				});

				ProfileService.choiceBadge(vm.user_id, function(response) {
					var list = response.data.c.data.content.data;
					vm.user_threshold_badge = [];
					vm.order_badge = 0;
					angular.forEach(list,function(value,key){
						if(value.order&&value.order<100) {
							vm.user_threshold_badge.push({"threshod_id":value.id,"order":value.order});
							vm.badge_collect[value.id] = true;
							vm.order_badge++;
						}
					});
				});
			});
		}

		vm.listBadge();

		vm.pickBadge = function(item) {
			if(!vm.badge_collect[item]) {
				vm.edit_choice_badge = true;
				vm.order_badge++;
				vm.user_threshold_badge.push({"threshod_id":item,"order":vm.order_badge});
				console.log(vm.user_threshold_badge);
				vm.badge_collect[item] = true;
				$('#choiceaddbadge'+item).fadeIn('fast', function() {
					$('#choiceaddbadge'+item).show();
				});
			} else {
				vm.removeChoiceBadge(item);
			}
		}

		vm.listAchievement = function() {
			var orderType = 'name';
			var orderBy = 'asc';
			var limit = 50;
			var offset = 0;
			var search = vm.keyword_achievement;
			ProfileService.listAchievement(orderType, orderBy, limit, offset, search, function(response) {
				vm.list_achievement = response.data.c.data.content.data;

				vm.achievement_collect = [];
				angular.forEach(vm.list_achievement,function(value,key){
					vm.achievement_collect[value.id] = false;
				});
					
				ProfileService.choiceAchievement(vm.user_id, function(response) {
					vm.user_threshold_achievement = response.data.c.data.content.data;
					vm.threshold_achievement = [];
					vm.edit_threshold_achievement = [];
					vm.order_achievement = 0;
					vm.count = 1;
					vm.column = 1;
					vm.column_data = [];
					vm.achievement_pick = [];
					var length = (vm.user_threshold_achievement.length/6)+1;
					vm.achievement_collect = new Array();
					for(var i=1;i<=length;i++) {
						vm.achievement_collect[i]=[];
					}
					vm.column_data.push({"column":0});
					angular.forEach(vm.user_threshold_achievement,function(value,key){
						if(value.order&&value.order<100) {
							vm.threshold_achievement.push({"threshod_id":value.id,"order":value.order,"name":value.name,"image":value.image});
							vm.edit_threshold_achievement.push({"threshod_id":value.id,"order":value.order,"name":value.name,"image":value.image});
							vm.achievement_collect[vm.column].push({"threshod_id":value.id,"order":value.order,"name":value.name,"image":value.image});
							vm.achievement_pick[value.id] = true;
							if(vm.count%6==0) {
								vm.column_data.push({"column":vm.column});
								vm.column++;
							}
							vm.order_achievement++;
							vm.count++;
						}
					});
					vm.data_row_width = 450*(vm.column_data.length);
					if(!vm.achievement_collect[vm.column_data.length].length) vm.data_row_width -= 450;
				});
			});
		}

		vm.order_achievement = 1;
		vm.pick ="";
		vm.user_threshold = [];
		vm.order = 1;
		
		vm.pickAchievement = function(item,name,image) {
			if(!vm.achievement_pick[item]) {
				vm.edit_choice_achievement = true;
				vm.order_achievement++;
				vm.achievement_collect[vm.column].push({"threshod_id":item,"order":vm.order_achievement,"name":name,"image":image});
				vm.edit_threshold_achievement.push({"threshod_id":item,"order":vm.order_achievement,"name":name,"image":image});
				var length = vm.achievement_collect[vm.column_data.length].length;
				if(length>5) {
					vm.column_data.push({"column":vm.column_data.length+1});
					vm.column = vm.column_data.length;
					vm.achievement_collect[vm.column_data.length] = [];
					vm.data_row_width+=450;
					$('#achievement_wrp').animate({scrollLeft: '+='+vm.data_row_width});
				}
				vm.achievement_pick[item] = true;
				$('#choiceaddachievement'+item).fadeIn('fast', function() {
					$('#choiceaddachievement'+item).show();
				});
			} else {
				vm.removeChoiceAchievement(item);
			}
		}

		vm.removeChoiceAchievement = function(id) {
			vm.edit_choice_achievement = true;
			console.log(vm.column_data.length);
			for(var i = 0; i < vm.edit_threshold_achievement.length; i++) {
				if(vm.edit_threshold_achievement[i]['threshod_id']==id) {
			    	delete vm.edit_threshold_achievement[i];
			    }
			}
			
			vm.count = 1;
			vm.column = 1;
			vm.column_data = [];
			vm.temp_threshold_achievement =[];
			vm.column_data.push({"column":0});
			var length = (vm.edit_threshold_achievement.length/6)+1;
			for(var i=1;i<=length;i++) {
				vm.achievement_collect[i]=[];
			}
			angular.forEach(vm.edit_threshold_achievement,function(value,key){
				vm.temp_threshold_achievement.push({"threshod_id":value.threshod_id,"order":vm.count,"name":value.name,"image":value.image});
				vm.achievement_collect[vm.column].push({"threshod_id":value.threshod_id,"order":vm.count,"name":value.name,"image":value.image});
				if(vm.count%6==0) {
					vm.column_data.push({"column":vm.column});
					vm.column++;
				}
				vm.count++;
			});
			vm.edit_threshold_achievement = vm.temp_threshold_achievement;

			vm.achievement_pick[id] = false;

			vm.edit_threshold_achievement = JSON.stringify(vm.edit_threshold_achievement);
			vm.edit_threshold_achievement = vm.edit_threshold_achievement.replace('[]','[{"threshod_id":"1","order":"100"}]');
			vm.edit_threshold_achievement = JSON.parse(vm.edit_threshold_achievement);
			
			$('#choiceaddachievement'+id).fadeOut('fast', function() {
				$('#choiceaddachievement'+id).hide();
			});
		}

		vm.removeChoiceBadge = function(id) {
			console.log('hapus badge id : '+id);
			vm.edit_choice_badge = true;
			var id = id;

			for(var i = 0; i < vm.user_threshold_badge.length; i++) {
				if(vm.user_threshold_badge[i]['threshod_id']==id) {
			    	delete vm.user_threshold_badge[i];
			    }
			}

			vm.badge_collect[id] = false;

			vm.user_threshold_badge = JSON.stringify(vm.user_threshold_badge).replace(',null','');
			vm.user_threshold_badge = vm.user_threshold_badge.replace('null,','');
			vm.user_threshold_badge = vm.user_threshold_badge.replace('[null]','[{"threshod_id":"1","order":"100"}]');
			vm.user_threshold_badge = JSON.parse(vm.user_threshold_badge);
			
			$('#choiceaddbadge'+id).fadeOut('fast', function() {
				$('#choiceaddbadge'+id).hide();
			});
		}

		vm.choiceAchievementLeft = function() {
			$('#achievement_wrp').animate({scrollLeft: '-=450'},200);
		}

		vm.choiceAchievementRight = function() {
			$('#achievement_wrp').animate({scrollLeft: '+=450'},200);
		}



		function clearName() {
			vm.edit_profile_name = "";
		}

		vm.clearName = clearName;

		function editUsername() {
			var screen_name = vm.edit_profile_name;
			SettingService.updateScreenName(screen_name).then(function(data) {
				vm.my_name = vm.edit_profile_name;
				vm.profile_name = vm.edit_profile_name;
				$rootScope.$broadcast( "user.user_info_header",vm.edit_profile_name);
			});
			SettingService.saveTitle(vm.edit_title).then(function(data) {
				if(vm.edit_title!=undefined) {
					vm.title = vm.edit_title;
				}
				//$rootScope.$broadcast( "user.user_info_header", vm.edit_profile_name);
			});
		}

		vm.editUsername = editUsername;

		vm.searchAchievement = function() {
			vm.key_achievement = vm.keyword_achievement;
		}

			vm.user = $stateParams.user;

			vm.start_mutual_friends = false;
			if($stateParams.user){
				vm.start_mutual_friends = true;
			}

			vm.list_user_self=[];
			vm.list_user_self_next=[];
			vm.start_user_self = false;
			vm.action_check_me_self = action_check_me_self;
			vm.button_show_more_self = false;
			vm.isloading_self = false;
			
			vm.searchtext = '';//$stateParams.search_text;


			function loadMoreRecords_self(){
				//vm.button_show_more_self = true;
				getList_self(vm.searchtext, 10, vm.list_user_self.length);
				
			}

			vm.loadMoreRecords_self = loadMoreRecords_self;

			function getList_self_next(keyword, limit, offset){
				
					var user_friend_id = ($stateParams.user) ? vm.user_id : vm.token_user_id;
					//// console.log(vm.user_id);
					ConnectionService.listFriends (
						user_friend_id, keyword, offset, limit,
						function(response){//callback sucess
								
							//vm.list_user = response.data.c.data.content.list_user;
							var tmp_next=(response.data.c.data.content.list_user);
							//// console.log(tmp_next);
							
							angular.forEach(tmp_next,function(value,key){
									
							
								vm.list_user_self_next.push(value);
								
							});

							//// console.log(tmp.length);
							vm.loading_show_more_self = false;
							if(tmp_next.length==0){
								vm.button_show_more_self = false;
							}else{
								vm.button_show_more_self = true;
							}
						},
						function(response){//err callback
							// console.log(response);
						}
					);
				
			}

			function getList_self(keyword, limit, offset){
				if(!vm.isloading_self){
					vm.isloading_self = true;
					var user_friend_id = ($stateParams.user) ? vm.user_id : vm.token_user_id;
					
					ConnectionService.listFriends (
						user_friend_id, keyword, offset, limit,
						function(response){//callback sucess
								
							//vm.list_user = response.data.c.data.content.list_user;
							var tmp=(response.data.c.data.content.list_user);
							vm.tmp_count_self=(response.data.c.data.meta.total);
							//// console.log(tmp);
							vm.start_user_self = true;
							angular.forEach(tmp,function(value,key){

								if(vm.token_user_id==tmp[key].user_id){
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

								vm.list_user_self.push(value);
								
							});
							vm.isloading_self = false;
							var offset_next = offset + 10;
							getList_self_next(keyword, limit, offset_next);
						},
						function(response){//err callback
							// console.log(response);
						}
					);
				}
			}

			vm.tab_selected = 1;

			function action_tab_selected(id){
				vm.tab_selected = id;
			}

			vm.action_tab_selected = action_tab_selected;
			vm.search_friend = false;

			function action_search_friend(){
				vm.search_friend = true;
				if(vm.tab_selected==1){
					vm.button_show_more_self = false;
					vm.start_user_self = false;
					vm.list_user_self = [];
					var searchfield = (vm.searchfield) ? vm.searchfield : "";
					getList_self(searchfield, 10, 0);
				}else{
					vm.button_show_more = false;
					vm.start_user = false;
					vm.list_user = [];
					var searchfield = (vm.searchfield) ? vm.searchfield : "";
					getList(searchfield, 10, 0, vm.user_id);
				}
			}

			vm.action_search_friend = action_search_friend;

			function action_check_me_self(username){
				//alert(username);
				$state.go('profile', {user: username});
			}

			function showModalEditTitle() {
				angular.element('#ModalEditTitle').addClass('-open');
				angular.element('body').css('overflow', 'hidden');
			}

			vm.showModalEditTitle = showModalEditTitle;

			function showModalEditUsername() {
				angular.element('#ModalEditUsername').addClass('-open');
				angular.element('body').css('overflow', 'hidden');
			}

			vm.showModalEditUsername = showModalEditUsername;

			function showModalEditAboutMe() {
				angular.element('#ModalEditMe').addClass('-open');
				angular.element('body').css('overflow', 'hidden');
				vm.edit_first_name = vm.first_name;
				vm.edit_middle_name = vm.middle_name;
				vm.edit_last_name = vm.last_name;
				vm.edit_place_of_birth = vm.place_of_birth;
				//window.scrollTo(0, 0);
				setTimeout(function() {
					$("html, body").animate({ scrollTop: 0 }, 100);
				}, 0);
			}

			vm.showModalEditAboutMe = showModalEditAboutMe;

			function showModalEditWebsite() {
				angular.element('#ModalEditWebsite').addClass('-open');
				angular.element('body').css('overflow', 'hidden');
			}

			vm.showModalEditWebsite = showModalEditWebsite;

			function showModalEditUsername() {
				angular.element('#ModalEditUsername').addClass('-open');
				angular.element('body').css('overflow', 'hidden');
			}

			vm.showModalEditUsername = showModalEditUsername;

			function openEditBadge() {
				angular.element('.badge-edit').addClass('active');
			}

			vm.openEditBadge = openEditBadge;

			function closeEditBadge() {
				angular.element('.badge-edit').removeClass('active');
				if(vm.edit_choice_badge) {
					vm.listBadge();
					vm.edit_choice_badge=false;
				}
			}

			vm.closeEditBadge = closeEditBadge;

			function showModalAddBadge() {
				angular.element('#ModalAddBadge').addClass('-open');
				angular.element('body').css('overflow', 'hidden');
			}

			vm.showModalAddBadge = showModalAddBadge;
			
			function openEditAchievement() {
				vm.open_edit_achievement = true;
				$('#achievement_wrp').animate({scrollLeft: '+='+vm.data_row_width});
				$('.achievement-edit').addClass('active');
				if(!vm.achievement_collect[vm.column_data.length].length) vm.data_row_width += 450;
			}

			vm.openEditAchievement = openEditAchievement;

			function closeEditAchievement() {
				vm.open_edit_achievement = false;
				angular.element('.achievement-edit').removeClass('active');
				$('#achievement_wrp').animate({scrollLeft: '0'},200, function() {
					if(!vm.achievement_collect[vm.column_data.length].length) vm.data_row_width -= 450;
				});
				if(vm.edit_choice_achievement) {
					//vm.listAchievement();
					vm.edit_threshold_achievement = [];
					vm.edit_choice_achievement=false;
					vm.count = 1;
					vm.column = 1;
					vm.column_data = [];
					vm.achievement_pick = [];
					var length = (vm.threshold_achievement.length/6)+1;
					for(var i=1;i<=length;i++) {
						vm.achievement_collect[i]=[];
					}
					vm.column_data.push({"column":0});
					angular.forEach(vm.threshold_achievement,function(value,key){
						vm.edit_threshold_achievement.push({"threshod_id":value.threshod_id,"order":value.order,"name":value.name,"image":value.image});
						vm.achievement_collect[vm.column].push({"threshod_id":value.threshod_id,"order":value.order,"name":value.name,"image":value.image});
						vm.achievement_pick[value.threshod_id] = true;
						if(vm.count%6==0) {
							vm.column_data.push({"column":vm.column});
							vm.column++;
						}
						vm.order_achievement++;
						vm.count++;
					});
					vm.data_row_width = 0;
					vm.data_row_width = 450*(vm.column_data.length);
					if(!vm.achievement_collect[vm.column_data.length].length) vm.data_row_width -= 450;
					console.log(vm.column_data.length);
				}
			}

			vm.closeEditAchievement = closeEditAchievement;

			function showModalAddAchievement() {
				angular.element('#ModalAddAchievement').addClass('-open');
				angular.element('body').css('overflow', 'hidden');
			}

			vm.showModalAddAchievement = showModalAddAchievement;

			vm.saveChoiceAchievement = function() {
				vm.list_choice_achievement="";
				var user_threshold = [];
				var order = 1;
				angular.forEach(vm.edit_threshold_achievement,function(value,key){
					user_threshold.push({"threshod_id":value.threshod_id,"order":order});
					order++;
				});
				ProfileService.saveChoiceAchievement(user_threshold, function(response) {
					vm.edit_choice_achievement=false;
				});
				angular.element('.achievement-edit').removeClass('active');

				vm.data_row_width = 0;
				vm.data_row_width = 450*(vm.column_data.length);
				if(!vm.achievement_collect[vm.column_data.length].length) vm.data_row_width -= 450;
				$('#achievement_wrp').animate({scrollLeft: '0'});
			}

			vm.saveChoiceBadge = function() {
				ProfileService.saveChoiceBadge(vm.user_threshold_badge, function(response) {
					vm.edit_choice_badge=false;
				});
				angular.element('.badge-edit').removeClass('active');
			}

			function showModalEditSocialMedia() {
				angular.element('#ModalEditSocialmedia').addClass('-open');
				angular.element('body').css('overflow', 'hidden');
			}

			vm.loading_aboutme = false;

			vm.updateUserFilter = function() {
				if(!vm.edit_first_name) {vm.edit_first_name = "-";}
				if(!vm.edit_middle_name) {vm.edit_middle_name = "-";}
				if(!vm.edit_last_name) {vm.edit_last_name = "-";}
				var updated_filter = [{"filter_id":2,"filter_value" : vm.edit_first_name},{"filter_id":3,"filter_value" : vm.edit_middle_name},{"filter_id":4,"filter_value" : vm.edit_last_name}];
				var type = 2;
				SettingService.updateUserFilter(updated_filter, type).then(function(data) {
					vm.first_name = vm.edit_first_name.replace('-','');
					vm.middle_name = vm.edit_middle_name.replace('-','');
					vm.last_name = vm.edit_last_name.replace('-','');
				});
				if(vm.edit_date_of_birth) {
					var date = vm.edit_date_of_birth.split('/');
					date = date[1]+'/'+date[0]+'/'+date[2];
					var newdate = new Date(date);
					var ms = newdate.valueOf();
					var s = ms / 1000;
					vm.timestamp = s;
					var updated_filter = [{"filter_id":6,"filter_value" : vm.timestamp}];
					SettingService.updateUserFilter(updated_filter, type).then(function(data) {
						var date = new Date(vm.timestamp * 1000);
                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        vm.date_of_birth = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
					});
				}
				if(vm.edit_nationality) {
					var updated_filter = [{"filter_id":8,"filter_value" : vm.edit_nationality}];
					SettingService.updateUserFilter(updated_filter, type).then(function(data) {
						vm.nationality = vm.edit_nationality;
					});
				}
				if(vm.place_birth) {
					var updated_filter = [{"filter_id":7,"filter_value" : vm.place_birth}];
					SettingService.updateUserFilter(updated_filter, type).then(function(data) {
						vm.place_of_birth = vm.edit_place_of_birth;
					});
				}
				
			}

			vm.saveTitle = function() {
				var type = 2;
				var updated_filter = [{"filter_id":520,"filter_value" : vm.edit_title}];
				// console.log(updated_filter);
				SettingService.updateUserFilter(updated_filter, type).then(function(data) {
					vm.title = vm.edit_title;
					// console.log('update title');
					// console.log(response);
				});
			}

			//vm.saveWebsite();

			vm.prefixPhoneNumber = function() {
				var limit=500;
	            var offset=0;
	            SettingService.prefixPhoneNumber(limit, offset).then(function(data) {
	                //// console.log(response.data.c.data.content.list_prefix_phone_number);
	                vm.list_prefix_phone_number = data.content.list_prefix_phone_number;
	                vm.list_nationality = data.content.list_prefix_phone_number;
	            });
			}

			vm.prefixPhoneNumber();

			vm.selectNationality = function($event) {
			    if($event.keyCode === 40) {
					$event.preventDefault();
					vm.list_nationality.next();
				} else if($event.keyCode === 38) {
					$event.preventDefault();
					vm.list_nationality.prev();
				} else if($event.keyCode === 13) { 
					vm.selectNationality(vm.list_nationality.list[vm.list_nationality.selectedIndex]);
				}
			}

			vm.setNationality = function(value, image, index) {
	            vm.nationality_name = value;
	            vm.nationality_image = image;
	            vm.edit_nationality = index;
	        }

	        vm.searchCities= function() {
	        	var keyword = vm.edit_place_of_birth;
	        	if(keyword) {
	        		angular.element('._listplace').addClass('active');
	        	} else {
	        		angular.element('._listplace').removeClass('active');
	        	}
	        	// vm.list_place = [{list:null}];
	        	// vm.list_place.list = [];
	        	ProfileService.listCities(keyword, 0, function(response) {
	        		vm.list_place.list = response.data.c.data.content.list_cities;
	        		// console.log('search cities');
	        		// console.log(response);
	        	});
	        }

	        vm.getCities= function(country_id) {
	        	ProfileService.listCities(null, country_id, function(response) {
	        		vm.list_place = response.data.c.data.content.list_cities;
	        		// console.log('get cities');
	        		// console.log(response);
	        	});
	        }

	        vm.hideListPlace = function() {
	        	angular.element('._listplace').removeClass('active');
	        }

			vm.showModalEditSocialMedia = showModalEditSocialMedia;

			vm.iconbox = false;

			function showIconSocialMedia() {
				if(vm.iconbox == false) {
					angular.element('._addpopup').addClass('active');
					vm.iconbox = true;
				} else {
					angular.element('._addpopup').removeClass('active');
					vm.iconbox = false;
				}
			}

				vm.showIconSocialMedia = showIconSocialMedia;

				function chooseSocialMedia(value) {
								vm.choose_social_media = value;
						}

						vm.chooseSocialMedia = chooseSocialMedia;

						function listSocialMedia(){
							vm.edit_social_media = [];
							SettingService.listSocialMedia().then(function(data) {
								vm.list_social_media = data.content.data[0];
								angular.forEach(vm.list_social_media,function(value,key){
									vm.edit_social_media.push({"id":value.id,"name":value.name.replace('Path','path-01'),"value":value.value});
								});
								if(!vm.list_social_media.length) vm.social_media_null=true;
							});
						}

						vm.listSocialMedia = listSocialMedia;

						vm.choose_social_media='clear';

						function addSocialMedia() {
							var name;
							if(vm.choose_social_media==0) {
								name = 'facebook';
								vm.facebook = vm.account_social_media;
							}
							if(vm.choose_social_media==1) {
								name = 'twitter';
								vm.twitter = vm.account_social_media;
							}
							if(vm.choose_social_media==2) {
								name = 'instagram';
								vm.instagram = vm.account_social_media;
							}
							if(vm.choose_social_media==7) {
								name = 'path-01';
								vm.path = vm.account_social_media;
							}
							if(vm.choose_social_media==8) {
								name = 'pinterest';
								vm.pinterest = vm.account_social_media;
							}
							vm.edit_social_media.push({"id":null,"name":name,"value":vm.account_social_media});
							vm.choose_social_media = 'clear';
							vm.account_social_media = '';
						}

						vm.addSocialMedia = addSocialMedia;

						vm.saveSocialMedia = function() {
							if(vm.account_social_media) vm.addSocialMedia();
							for(var i=0;i<vm.delete_account_sosialmedia.length;i++) {
								vm.removeSocialMedia(vm.delete_account_sosialmedia[i].id);
							}
							angular.forEach(vm.edit_social_media,function(value,key){
								if(!value.id) {
									var type;
									if(value.name == 'facebook') type = 0;
									if(value.name == 'twitter') type = 1;
									if(value.name == 'instagram') type = 2;
									if(value.name == 'path-01') type = 7;
									if(value.name == 'pinterest') type = 8;
									console.log('type : '+type);
									console.log(value.name);
									var val=value.value.split('.com/');
									if(val[1] != undefined) {
										var value = val[1];
									} else {
										var value = val[0];
									}
									SettingService.addSocialMedia(type, value).then(function(data) {
										vm.account_social_media = "";
										vm.list_social_media = [];
										angular.forEach(vm.edit_social_media,function(value,key){
											vm.list_social_media.push({"id":value.id,"name":value.name,"value":value.value});
										});
									});
								}
							});
							vm.social_media = null;
							console.log(vm.list_social_media);
						}

						vm.delete_account_sosialmedia = [];

						function deleteSocialMedia(name,id) {
							if(name == 'facebook') vm.facebook = null;
							if(name == 'twitter') vm.twitter = null;
							if(name == 'instagram') vm.instagram = null;
							if(name == 'path-01') vm.path = null;
							if(name == 'pinterest') vm.pinterest = null;
							for(var i = 0; i < vm.edit_social_media.length; i++) {
								if(vm.edit_social_media[i]['name']==name) {
							    	delete vm.edit_social_media[i];
							    }
							}
							if(id) {
								vm.delete_account_sosialmedia.push({"id":id});
							}
							vm.temp_social_media = vm.edit_social_media;
							vm.edit_social_media = [];
							angular.forEach(vm.temp_social_media,function(value,key){
								vm.edit_social_media.push({"id":value.id,"name":value.name,"value":value.value});
							});
							vm.account_social_media = "";
						}

						vm.deleteSocialMedia = deleteSocialMedia;

						vm.removeSocialMedia = function(id) {
							SettingService.deleteSocialMedia(id).then(function(data) {
								vm.list_social_media = [];
								angular.forEach(vm.edit_social_media,function(value,key){
									vm.list_social_media.push({"id":value.id,"name":value.name,"value":value.value});
								});
								vm.social_media = null;
							});
						}

						function showAlert(title, content, event) {
							$mdDialog.show(
							$mdDialog.alert()
								.clickOutsideToClose(true)
								.title(title)
								.textContent(content)
								.ariaLabel('Alert Dialog')
								.ok('Got it!')
								.targetEvent(event)
							);
						}
						vm.showAlert = showAlert;

				angular.extend(vm,{
					loadTimeline:loadTimeline,
					js_timeline:[],
					load_more:false
				});
				

				function loadTimeline(idx){
					if(!vm.isSearching){
						vm.isSearching=true;
						if(idx==undefined){
							idx = 0;vm.load_more = true;
						}
						var last_array = vm.js_timeline[vm.js_timeline.length-1];
					PostService.timelineUser ($stateParams.user,idx,3,vm.lastId,function(response){
				//				// console.log(response.data.c.data.content.posts);
						var tmp=response.data.c.data.content.posts;
						var last_array = vm.js_timeline[vm.js_timeline.length-1];
						angular.forEach(tmp,function(value,key){
							value.activity_detail.avatar_url=value.user_avatar.face;
							value.activity_detail.back_hair=value.user_avatar.back_hair;
			//				value.place.url='https://www.google.com/maps/preview/@'+value.place.place_lat+','+value.place.place_long+',8z';
							value.view='normal';
							value.login_id=vm.token_user_id;
							vm.js_timeline.push(value);
						last_array = value;
					});
					if(last_array){
						vm.lastId = last_array.post_id;
					}
					
						
						vm.isSearching=false;
						vm.load_more=false;
						if (response.data.c.data.meta.current_page<response.data.c.data.meta.last_page) {
						vm.load_more = true;
					} else {
						vm.load_more = false;
					}
//					if(tmp.length==0){
//						vm.load_more=false;
//					}
					},function(response){
						// console.log(response);
						vm.isSearching=false;
					});
				}
				}
		$rootScope.$on('card.delete', function (event, post) {
			PostService.deletePost(post.post_id, function (response) {
				var data = response.data.c.data;
				if (data.error == false) {
					vm.js_timeline.splice(vm.js_timeline.indexOf(post), 1);
					modalFactory.message(data.message);
				} else {
					modalFactory.message(data.message);
				}
			}, function (response) {});
		});

		vm.list_user=[];
		vm.list_user_next=[];
		vm.start_user = false;
		vm.searchtext = '';//$stateParams.search_text;

		vm.pagelist = 1;
	
		vm.isloading = false;
		vm.loading_show_more = false;

		function loadMoreRecords(){

				vm.loading_show_more = true;
				//vm.pagelist++;
				//vm.offset = (vm.pagelist - 1) * 6;
				getList(vm.searchtext, 10, vm.list_user.length, vm.user_id);
		
		}

		vm.loadMoreRecords = loadMoreRecords;

		function getList_next(keyword, limit, offset, user_id){
			
			ConnectionService.listMutualFriends (
				keyword, limit, offset, user_id,
				function(response){//callback sucess
					// // console.log(response.data.c.data.content);
					//vm.list_user = response.data.c.data.content.list_user;
			
					var tmp_next=(response.data.c.data.content.list_user);

					vm.start_user = true;
					angular.forEach(tmp_next,function(value,key){
						vm.list_user_next.push(value);
					});

					//// console.log(tmp_next.length);
					vm.loading_show_more = false;
					if(tmp_next==undefined || tmp_next.length==0){
						vm.button_show_more = false;
					}else{
						vm.button_show_more = true;
					}


					
				},
				function(response){//err callback
					// console.log(response);
				}
			);
		
		}

		function getList(keyword, limit, offset, user_id){
			if(!vm.isloading){
				//// console.log('test');
				vm.isloading = true;
				ConnectionService.listMutualFriends (
					keyword, limit, offset, user_id,
					function(response){//callback sucess
						// console.log(response.data.c.data.content);
						//vm.list_user = response.data.c.data.content.list_user;
						var tmp=(response.data.c.data.content.list_user);
						try {vm.tmp_count=(response.data.c.data.meta.total)}catch(err){}
						vm.start_user = true;
						angular.forEach(tmp,function(value,key){

							value.icon_action_response = false;
							value.open_action = false;


									if(vm.token_user_id==tmp[key].user_id){
										value.button_self = true;
									}else{
										value.button_self = false;
									}
							
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
									}
								}else{
									value.icon_addfriend = false;
									value.name_addfriend = false;
									value.icon_self = 0;
									value.name_self = 0;
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
							vm.list_user.push(value);
							
						});
						vm.isloading = false;
						vm.isSearching_hidden++;
						var offset_next = offset + 10;
						getList_next(keyword, 10, offset_next, vm.user_id);
					},
					function(response){//err callback
						// console.log(response);
					}
				);
			}
		}

		var friend = $rootScope.$on(
            "friend.profile",
            function(event, data) {
            	angular.forEach(vm.list_user_self,function(value,key){
					vm.list_user_self[key].open_action = false;
				});
            }
        );

        var mutual_friend = $rootScope.$on(
            "mutual_friend.profile",
            function(event, data) {
            	angular.forEach(vm.list_user,function(value,key){
					vm.list_user[key].open_action = false;
				});
            }
        );		

		vm.scrollOffset = 200;
		function scroll(){
			$('#loadingMoreIcon').hide();
			vm.isLoadMore = false;
			$('.achievement').scroll(function(){
				var scrollTop = $(this).scrollTop();
				if(scrollTop >= vm.scrollOffset && !vm.isLoadMore){
					vm.isLoadMore = true;
					$('#loadingMoreIcon').show();
					loadMore();
				}
			});
		}

		function loadMore() {
			vm.offset += 20;
			vm.scrollOffset += 200;
			loadAchievement();
		}
	}
})();

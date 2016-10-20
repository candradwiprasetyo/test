(function() {
'use strict';

	angular
		.module('app')
		.controller('ProfilePublicController', ProfilePublicController);

	ProfilePublicController.$inject = ['$rootScope', '$cookieStore', '$state', 'CiayoService','$stateParams','ProfileService', 'CiayoBanner', 'SettingService', 'PostService'];
	function ProfilePublicController($rootScope, $cookieStore, $state, CiayoService,$stateParams,ProfileService, CiayoBanner, SettingService, PostService) {
		var vm = this;
		vm.profile_url="views/profile-public.html";
		vm.aboutme = false;
		vm.social_media_loading = false;

		var user = $stateParams.user;
		vm.profile = [];

		vm.init=function(){

			// if($cookieStore.get('token')){
			// 	$state.go('profile', {user: $stateParams.user});
			// }

			vm.state=0;

			// get data profile
			ProfileService.userInfoPublic ($stateParams.user,function(response){
				
				vm.aboutme = true;
				vm.social_media_loading = true;
				vm.social_media = true;
			
				var data = response;
				//console.log(data);

				var tmp={};
				angular.forEach(data.profile,function(value_new,key){
				 	tmp[value_new.filter_id]=value_new;
				});	

				vm.user_id = data.user_id;

				vm.profile.full_name = 
				(tmp[2]==undefined?'':tmp[2].value)+ ' ' +
				(tmp[3]==undefined?'':tmp[3].value)+ ' ' +
				(tmp[4]==undefined?'':tmp[4].value);

				vm.profile.user_display_name = tmp[5].value;
				vm.profile.title = (tmp[520]==undefined?'No title':tmp[520].value);
				vm.profile.user_avatar = data.user_avatar.avatar;
				vm.profile.user_first_name = (tmp[2]==undefined?'':tmp[2].value);
				vm.profile.user_middle_name = (tmp[3]==undefined?'':tmp[3].value);
				vm.profile.user_last_name = (tmp[4]==undefined?'':tmp[4].value);
				vm.profile.place_of_birth = (tmp[7]==undefined?'':tmp[7].value);
				vm.profile.nationality = (tmp[8]==undefined?'':tmp[8].value);
				vm.profile.email = data.email;
				vm.profile.phone = data.phone;

				getPlaceDateBirth((tmp[7]==undefined?null:tmp[6].value));
				vm.profile.website = (tmp[37]==undefined?'':tmp[37].value);
				vm.profile.facebook = (tmp[480]==undefined?'':tmp[480].value);
				vm.profile.twitter = (tmp[481]==undefined?'':tmp[481].value);
				vm.profile.instagram = (tmp[482]==undefined?'':tmp[482].value);
				vm.profile.instagram = (tmp[500]==undefined?'':tmp[500].value);

				//vm.listAchievement(vm.user_id);
				vm.choiceAchievement();
				vm.choiceBadge();

				//console.log(vm.profile.user_avatar);

			},function(response){
					if(response.status==200){
						var data = response.data.c.data;
						if(data.error==true){
							//if(data.message=='user_not_found' || data.message=='Akun tidak ditemukan'){
								$state.go('404');
							//}else{
							//	modalFactory.message(data.message);
							//	return;
							//}
						}
					}
			});

			// get data banner
			CiayoBanner.getDataPublic($stateParams.user, "profile", function(response){
				vm.profile.banner = response.data.c.data.content.image;
				//console.log(vm.profile.banner);
				setTimeout(function(){
					$('.c-banner').children("ul").parallax({
						clipRelativeInput: false,
						originY: 0.0
					});
				}, 1)
			}, function(){

			})
		}

		function getPlaceDateBirth(dateBirth){
			if(dateBirth){
				var timestamp = dateBirth;
				var date = new Date(timestamp * 1000);
				var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				vm.profile.date_of_birth = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
				if(vm.profile.place_of_birth && vm.profile.date_of_birth) {
					vm.qoma = ", ";
				} else {
					vm.qoma = "";
				}
			}
		} 

		vm.init();

		vm.prefixPhoneNumber = function() {
			var limit=500;
            var offset=0;
            SettingService.prefixPhoneNumber(limit, offset, function(response) {
                //// console.log(response.data.c.data.content.list_prefix_phone_number);
                vm.list_prefix_phone_number = response.data.c.data.content.list_prefix_phone_number;
                vm.list_nationality = response.data.c.data.content.list_prefix_phone_number;
            });
		}

		
		//vm.prefixPhoneNumber();

		// vm.listAchievement = function(user_id) {
		// 	vm.search_complete = false;
		// 	var orderType = 'name';
		// 	var orderBy = 'asc';
		// 	var limit = 10;
		// 	var offset = 0;
		// 	var search = vm.keyword_achievement;
			
				
		// 	ProfileService.choiceAchievementPublic(username, orderType, orderBy, limit, offset, search, function(response) {
		// 		var list = response.data.c.data.content.data;
		// 		angular.forEach(list,function(value,key){
		// 			if(value.order!=null){
		// 				$('.pickdisabled'+value.id).show();
		// 				$('.pick'+value.id).hide();
		// 				$('.picktext'+value.id).animate({opacity:0.2});
		// 			}
		// 		});
		// 	});
		// 	vm.search_complete = true;
			
		// }

		vm.choiceAchievement = function() {
			vm.list_choice_achievement = "";
			$('.choiceadd').hide();
			
			
			ProfileService.choiceAchievementPublic($stateParams.user, "achievement", function(response) {
				// console.log('List Achievement Choice User');
				// console.log(response);
				vm.list_choice_achievement = response.data.c.data.content.data;
				vm.length_achievement = vm.list_choice_achievement.length;
				vm.user_threshold = [];
				angular.forEach(vm.list_choice_achievement,function(value,key){
					$('.pick'+value['id']).show();
					$('.pickdisabled'+value['id']).hide();
					$('.pick'+value['id']).animate({opacity:1});
					$('.picktext'+value['id']).animate({opacity:1});
					if(value.order!=null){
						vm.user_threshold.push({"threshod_id":value.id,"order":value.order});
					}
				});
				vm.index_data_row=1;
				vm.data_row = [];
				angular.forEach(vm.list_choice_achievement,function(value,key){
					if(value.order!=null){
						vm.data_row.push({"id":value.id,"image":value.image,"name":value.name,"order":value.order});
						$('.pickdisabled'+value.id).show();
						$('.pick'+value.id).hide();
						$('.picktext'+value.id).animate({opacity:0.2});
						var a = Math.round(vm.index_data_row/2) - (vm.index_data_row/2);
						var b = Math.round(vm.index_data_row/2);
						if(a==0) {
							b++;
						}
						vm.data_row_width = b * 150;
						vm.index_data_row++;
					}
				});
				// console.log('choiceAchievement data');
				// console.log(vm.user_threshold);
				vm.carouselActive();
			});
			
		}

		vm.choiceBadge = function() {
			vm.list_choice_badge= "";
			$('.choiceadd').hide();
			
			
			ProfileService.choiceBadgePublic($stateParams.user, "badge", function(response) {
				vm.list_choice_badge = response.data.c.data.content.data;
			});
			
		}

		vm.carouselActive=function(){
			setTimeout(function() {
				$('.c-profile-achievement-carousel').flickity({
					pageDots: false,
					cellAlign: 'left'
				});
			}, 0);

			setTimeout(function() {
				$('.c-profile-badge-carousel').flickity({
					pageDots: false,
					cellAlign: 'left'
				});
			}, 0);
		}

		vm.choiceAchievementLeft = function() {
			$('#achievement_wrp').animate({scrollLeft: '-=150'},200);
		}

		vm.choiceAchievementRight = function() {
			$('#achievement_wrp').animate({scrollLeft: '+=150'},200);
		}		

		vm.login_first = function(){
			$rootScope.$broadcast( "login.header_public", '1');
			//console.log('ok');
		}
	}
})();
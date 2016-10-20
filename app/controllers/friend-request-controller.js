(function () {
	'use strict';
	angular
		.module('app')
		.controller('ConnectionFriendRequest', ConnectionFriendRequest);
	
	ConnectionFriendRequest.$inject = ['$rootScope', 'AuthService','CiayoService','ConnectionService','$cookieStore', '$state', '$mdDialog', '$stateParams','CiayoBanner','modalFactory', 'facebookFactory'];
	function ConnectionFriendRequest($rootScope, AuthService, CiayoService,ConnectionService,$cookieStore, $state, $mdDialog, $stateParams, CiayoBanner,modalFactory, facebookFactory) {
		var me=this;
		angular.extend(me,{
			modalInviteEmail:modalInviteEmail,
			modalInviteGmail:modalInviteGmail,
			shareFacebook:shareFacebook
		})
		CiayoBanner.getData("friend_request", function(response){
			me.banner = response.data.c.data.content.image;
			setTimeout(function(){
				$('.c-banner').children("ul").parallax({
					clipRelativeInput: false,
					originY: 0.0
				}); 
			}, 1)
		}, function(){

		})

		function shareFacebook(){

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
		function modalInviteEmail(){
			modalFactory.inviteEmail();
		}
		function modalInviteGmail(){
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

		angular.element(document).ready(function () {
			$('.c-fr-body > ul > li').find('a > .m').each(function(){
				console.log('test');
				var a = $(this).parent();
				var t = $(this);
				a.on('mouseover', function(){
					console.log('test');
					var pos = a.parent().parent().parent().position();
					if(pos.top > 200){
						// tootltip ke attas
						t.addClass('keatas').fadeIn(250);
					} else {
						// tooltip ke bawah
						t.fadeIn(250);
					}
				}).on('mouseleave', function(){
					t.removeClass('keatas').fadeOut(0);
				});
			});
		});
		
		function init() {
			$('a > .mt-tooltip').each(function(){
				var a = $(this).parent();
				var t = $(this);
				a.on('mouseover', function(){
					console.log('test');
					var pos = a.parent().parent().parent().position();
					if(pos.top > 200){
						// tootltip ke attas
						t.addClass('keatas').fadeIn(250);
					} else {
						// tooltip ke bawah
						t.fadeIn(250);
					}
				}).on('mouseleave', function(){
					t.removeClass('keatas').fadeOut(0);
				});
			});
			
			$('.c-fr-mutual > .c-fr-popup-body > ul > li').each(function(){
				var li = $(this).find('.c-fr-list-action.mutual > button');
				li.on('click', function(){
					li.parent().find('.c-fr-mutal-action').addClass('is-active');
				});
				
				var close = li.parent().find('.c-fr-mutal-action > button');
				close.on('click', function(){
					li.parent().find('.c-fr-mutal-action').removeClass('is-active');
				});
			});
			
			$('.mt-tooltip > ul > li > span, .close-fr').on('click', function(){
				$('.c-fr-backdrop').toggleClass('is-active');
			});
		}
		
		// //setTimeout(function(){
		// 	init();
		// }, 3000);

		me.list_friend_request=[];
		me.start_friend = false;
		me.action_accept = action_accept;
		me.action_reject = action_reject;
		me.action_delete = action_delete;
		me.action_block = action_block;
		me.view_profile = view_profile;

		me.page = $stateParams.page;

		function getList_friend_request(limit, offset){
			
			ConnectionService.listFriendRequest ( 
				limit, offset,
				function(response){//callback sucess
					//console.log(response.data.c.data.content);
					me.list_friend_request = response.data.c.data.content.data;
					me.start_friend = true;

					angular.forEach(me.list_friend_request,function(value,key){
						value.accept_status = false;
						value.reject_status = false;
						value.default_status = true;
						value.action_loading = false;

							// var new_un = me.list_friend_request[key].user_list.user_full_name;
							// var new_un = new_un.split(" ");

							// var new_full_name = '';
							// for(var i=0; i<=3; i++){
							// 	new_full_name += new_un[i]+" ";
							// }

							// new_full_name += '...';
							// value.new_full_name = new_full_name;
					});

				},
				function(response){//err callback
					console.log(response);
				}
			);
		}

		var paging = me.page * 10;
		var pagination = paging - 10;

		getList_friend_request(10, pagination);

		function action_accept(friend, index){

			friend.action_loading = true;
			var user_id = me.list_friend_request[index].list_user.user_id;
			
			ConnectionService.requestConfirmFriendRequest(user_id, function(response){
				//console.log(response);
				friend.accept_status = true;
				friend.reject_status = false;
				friend.default_status = false;
				friend.action_loading = false;

				$rootScope.$broadcast( "user.added_friend",'data' );
				
			},function(response){
				//console.log(response);
			});

		}

		function action_reject(friend, index){
			
			friend.action_loading = true;
			var user_id = me.list_friend_request[index].list_user.user_id;

			ConnectionService.requestRejectFriendRequest(user_id, function(response){
				friend.accept_status = false;
				friend.reject_status = true;
				friend.default_status = false;
				friend.action_loading = false;

				$rootScope.$broadcast( "user.added_friend",'data' );

			},function(response){
				//console.log(response);
			});

		}

		function action_block(friend, index){
			
			var user_id = me.list_friend_request[index].list_user.user_id;

			ConnectionService.requestBlockFriendRequest(user_id, function(response){
				console.log(response);
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('This account is successfully blocked')
					.ok('Done')
				);
				me.list_friend_request.splice(index, 1);
				$rootScope.$broadcast( "user.added_friend",'data' );
				
			},function(response){
				//console.log(response);
			});

		}

		function view_profile(username){
			$state.go('profile', {user: username});
		}

		function action_delete(index){
			me.list_friend_request.splice(index, 1);
		}
		
		
	}

})();
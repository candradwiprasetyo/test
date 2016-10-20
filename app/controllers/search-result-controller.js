(function () {
	'use strict';
	angular
		.module('app')
		.controller('ConnectionSearchResult', ConnectionSearchResult)
	;
	
	ConnectionSearchResult.$inject = ['$rootScope','AuthService','CiayoService','ConnectionService','$cookieStore', '$stateParams', '$state', 'ProfileService'];
	function ConnectionSearchResult($rootScope,AuthService, CiayoService,ConnectionService,$cookieStore, $stateParams, $state, ProfileService) {
		var me=this;

		me.list_user=[];
		me.list_user_next=[];
		me.start_user = false;
		me.searchtext = $stateParams.search_text;
		me.pagelist = 1;
		me.isloading = false;
		me.loading_show_more = false;

		ProfileService.userInfo('',function(){
			me.token_user_id = ProfileService.userData.user_id;
			getList(me.searchtext, 10, 0);
			me.loading_show_more = false;
		},function(){

		});

		function loadMoreRecords(){
			me.loading_show_more = true;
			getList(me.searchtext, 10, me.list_user.length);
		}

		me.loadMoreRecords = loadMoreRecords;

		function getList_next(keyword, limit, offset){
			
			ConnectionService.listSearchResult (
				keyword, limit, offset,
				function(response){//callback sucess
					// console.log(response.data.c.data.content);
					//me.list_user = response.data.c.data.content.list_user;
			
					var tmp_next=(response.data.c.data.content.list_user);

					me.start_user = true;
					angular.forEach(tmp_next,function(value,key){
						me.list_user_next.push(value);
					});

					//console.log(tmp_next.length);
					me.loading_show_more = false;
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

		function getList(keyword, limit, offset){
			if(!me.isloading){
				//console.log('test');
				me.isloading = true;
				ConnectionService.listSearchResult (
					keyword, limit, offset,
					function(response){//callback sucess
						//console.log(response.data.c.data.content);
						//me.list_user = response.data.c.data.content.list_user;
						var tmp=(response.data.c.data.content.list_user);

						me.start_user = true;
						angular.forEach(tmp,function(value,key){

							// var new_un = tmp[key].user_full_name;
							// var new_un = new_un.split(" ");

							// var new_full_name = '';
							// for(var i=0; i<=3; i++){
							// 	new_full_name += new_un[i]+" ";
							// }

							// new_full_name += '...';
							// //value.user_full_name = new_full_name;

							
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

							
							me.list_user.push(value);
							me.isloading = false;
						});

						me.isSearching_hidden++;
						var offset_next = offset + 10;
						getList_next(keyword, 10, offset_next);
					},
					function(response){//err callback
						console.log(response);
					}
				);
			}
		}

		var friend = $rootScope.$on(
            "friend.search_result",
            function(event, data) {

            	angular.forEach(me.list_user,function(value,key){
					me.list_user[key].open_action = false;
				});
                
            }
        );


	}
	
})();
(function () {
	'use strict';
	angular
		.module('app')
		.controller('ConnectionNotification', ConnectionNotification);
	
	ConnectionNotification.$inject = ['$state','$stateParams', 'AuthService','CiayoService','ConnectionService','$cookieStore', 'modalFactory','CiayoBanner'];
	function ConnectionNotification($state,$stateParams, AuthService, CiayoService,ConnectionService,$cookieStore, modalFactory, CiayoBanner) {
		var me=this;
		me.list_user_all=[];
		me.list_user_fro=[];
		me.list_user_foo=[];
		me.list_user_cio=[];

		me.start_notification = false;
		me.isloading_all = false;
		me.isloading_fro = false;
		me.isloading_foo = false;
		me.isloading_cio = false;

		CiayoBanner.getData("notification", function(response){
			me.banner = response.data.c.data.content.image;
			setTimeout(function(){
				$('.c-banner').children("ul").parallax({
					clipRelativeInput: false,
					originY: 0.0
				});
			}, 1)
		}, function(){

		})

		function getList_next(type, limit, offset){
			
				ConnectionService.listNotification ( 
					type, limit, offset,
					function(response){//callback sucess
						//console.log(response.data.c.data.content.list_notification);

						var tmp_next=(response.data.c.data.content.list_notification);
						//console.log(tmp_next.length);
						if(type=="null"){
							if(tmp_next.length==0){
								me.button_show_more_all = false;
							}else{
								me.button_show_more_all = true;
							}
						}else if(type=="friend_only"){
							if(tmp_next.length==0){
								me.button_show_more_fro = false;
							}else{
								me.button_show_more_fro = true;
							}
						}else if(type=="following_only"){
							if(tmp_next.length==0){
								me.button_show_more_foo = false;
							}else{
								me.button_show_more_foo = true;
							}
						}else if(type=="ciayo_only"){
							if(tmp_next.length==0){
								me.button_show_more_cio = false;
							}else{
								me.button_show_more_cio = true;
							}
						}
					},
					function(response){//err callback
						console.log(response);
					}
				);
		}

		function getList_all(type, limit, offset){

			if(!me.isloading_all){
				//console.log('test');
				me.isloading_all = true;
			
				ConnectionService.listNotification ( 
					type, limit, offset,
					function(response){//callback sucess
						//console.log(response.data.c.data.content.list_notification);
						me.start_notification = true;
						me.isloading_all = false;

						var tmp=(response.data.c.data.content.list_notification);

						angular.forEach(tmp,function(value,key){
							me.list_user_all.push(value);
						});

						

						var offset_next = offset + 10;
						getList_next(type, 10, me.list_user_all.length);
					},
					function(response){//err callback
						console.log(response);
					}
				);
			}
		}

		function getList_fro(type, limit, offset){
			
			if(!me.isloading_fro){
				//console.log('test');
				me.isloading_fro = true;
			
				ConnectionService.listNotification ( 
					type, limit, offset,
					function(response){//callback sucess
						//console.log(response.data.c.data.content.list_notification);

						var tmp=(response.data.c.data.content.list_notification);

						angular.forEach(tmp,function(value,key){
							me.list_user_fro.push(value);
						});

						//me.start_notification = true;
						me.isloading_fro = false;

						var offset_next = offset + 10;
						getList_next(type, 10, me.list_user_fro.length);
					},
					function(response){//err callback
						console.log(response);
					}
				);
			}
		}


		function getList_foo(type, limit, offset){
			
			if(!me.isloading_foo){
				//console.log('test');
				me.isloading_foo = true;
			
				ConnectionService.listNotification ( 
					type, limit, offset,
					function(response){//callback sucess
						//console.log(response.data.c.data.content.list_notification);

						var tmp=(response.data.c.data.content.list_notification);

						angular.forEach(tmp,function(value,key){
							me.list_user_foo.push(value);
						});

						//me.start_notification = true;
						me.isloading_foo = false;

						var offset_next = offset + 10;
						getList_next(type, 10, me.list_user_foo.length);
					},
					function(response){//err callback
						console.log(response);
					}
				);
			}
		}

		function getList_cio(type, limit, offset){
			
			if(!me.isloading_cio){
				//console.log('test');
				me.isloading_cio = true;
			
				ConnectionService.listNotification ( 
					type, limit, offset,
					function(response){//callback sucess
						//console.log(response.data.c.data.content.list_notification);

						var tmp=(response.data.c.data.content.list_notification);

						angular.forEach(tmp,function(value,key){
							me.list_user_cio.push(value);
						});

						//me.start_notification = true;
						me.isloading_cio = false;

						var offset_next = offset + 10;
						getList_next(type, 10, me.list_user_cio.length);
					},
					function(response){//err callback
						console.log(response);
					}
				);
			}
		}

		
		//me.getList=getList;

		getList_all("null", 10, 0);
		getList_fro("friend_only", 10, 0);
		getList_foo("following_only", 10, 0);
		getList_foo("ciayo_only", 10, 0);

		function loadMoreRecords(type){
			if(type=='all'){
				//me.button_show_more_all = true;
				getList_all("null", 10, me.list_user_all.length);
			}else if(type=='fro'){
				//me.button_show_more_fro = true;
				getList_fro("friend_only", 10, me.list_user_fro.length);
			}else if(type=='foo'){
				//me.button_show_more_foo = true;
				getList_foo("following_only", 10, me.list_user_foo.length);
			}else if(type=='cio'){
				//me.button_show_more_cio = true;
				getList_cio("ciayo_only", 10, me.list_user_cio.length);
			}
		}

		me.loadMoreRecords = loadMoreRecords;

		function view_notification(kind, index){
						
					if(kind=='all'){
						var post_id = me.list_user_all[index].post_id;
						var read_at_real = me.list_user_all[index].read_at;
						var id = me.list_user_all[index].notification_id;
						var type = me.list_user_all[index].type;
						var username = me.list_user_all[index].username;
						var post_code = me.list_user_all[index].post_code;
					}else if(kind=='fro'){
						var post_id = me.list_user_fro[index].post_id;
						var read_at_real = me.list_user_fro[index].read_at;
						var id = me.list_user_fro[index].notification_id;
						var type = me.list_user_fro[index].type;
						var username = me.list_user_fro[index].username;
						var post_code = me.list_user_fro[index].post_code;
					}else if(kind=='foo'){
						var post_id = me.list_user_foo[index].post_id;
						var read_at_real = me.list_user_foo[index].read_at;
						var id = me.list_user_foo[index].notification_id;
						var type = me.list_user_foo[index].type;
						var username = me.list_user_foo[index].username;
						var post_code = me.list_user_foo[index].post_code;
					}else if(kind=='cio'){
						var post_id = me.list_user_cio[index].post_id;
						var read_at_real = me.list_user_cio[index].read_at;
						var id = me.list_user_cio[index].notification_id;
						var type = me.list_user_cio[index].type;
						var username = me.list_user_cio[index].username;
						var post_code = me.list_user_cio[index].post_code;
					}

						if(read_at_real==null){

							var read_at = Number(new Date());

							ConnectionService.requestViewNotification (id, type, read_at, function(response){
								console.log(response);
								//alert("Halaman detail post id : " + post_id);
								//me.notification_popup_all[index].read_at = 1;

								if(type=="friend_request" || type == "follow_request" || type == "added_friend"){
									$state.go('profile', {user: username});
								}else if(type=="ask_with"){
									modalFactory.withCard(post_code);
								}else if(type=="ask_place"){
									modalFactory.placeCard(post_code);
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
									modalFactory.withCard(post_code);
								}else if(type=="ask_place"){
									modalFactory.placeCard(post_code);
								}else{
									if($stateParams.post_id==post_code){
										$state.reload()
									}else
									$state.go('detail-page', {post_id: post_code});
								}	
						}
		}

		me.view_notification = view_notification;
		me.notification_delete = notification_delete;

		function notification_delete(index, kind){

						// modalFactory.confirm(
						// 	'Are you sure want to delete this notification ?',
						// 	function(response){
						// 		if(response){

									if(kind=='all'){
										var id = me.list_user_all[index].notification_id;
										var type = me.list_user_all[index].type;
									}else if(kind=='fro'){
										var id = me.list_user_fro[index].notification_id;
										var type = me.list_user_fro[index].type;
									}else if(kind=='foo'){
										var id = me.list_user_foo[index].notification_id;
										var type = me.list_user_foo[index].type;
									}else if(kind=='cio'){
										var id = me.list_user_cio[index].notification_id;
										var type = me.list_user_cio[index].type;
									}
									
									ConnectionService.requestDeleteNotification (id, type, function(response){
										if(kind=='all'){
											me.list_user_all.splice(index, 1);
										}else if(kind=='fro'){
											me.list_user_fro.splice(index, 1);
										}else if(kind=='foo'){
											me.list_user_foo.splice(index, 1);
										}else if(kind=='cio'){
											me.list_user_cio.splice(index, 1);
										}
										$rootScope.$broadcast( "user.notification",'data' );	
									},function(response){
										console.log(response);
									});
									
						// 		}
						// 	}
						// );
		}

	}

})();
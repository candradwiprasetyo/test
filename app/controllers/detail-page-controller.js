(function () {
	'use strict';
	angular
		.module('app')
		.controller('DetailPageController', DetailPageController);

	DetailPageController.$inject = ['AuthService', 'CiayoService', 'PostService', 'ItemService', '$cookieStore', '$rootScope', '$stateParams','modalFactory','ProfileService'];

	function DetailPageController(AuthService, CiayoService, PostService, ItemService, $cookieStore, $rootScope, $stateParams,modalFactory,ProfileService) {
		var me = this;
		me.comment = {};
		me.js_timeline = null;
		me.activity_detail = [];
		me.token = $cookieStore.get('token');
		function loadData() {
			if (me.token) {
			ProfileService.userInfo('',function($filter){
				me.login_id = ProfileService.userData.user_id;
				PostService.detail($stateParams.post_id, parseDetail, function (response) {});
			},function(){

			});
				
			
			}else{
				PostService.public_detail($stateParams.post_id, parseDetail, function (response) {
					
				});
			}
			
		}

		function parseDetail(response) {
			var data = response.data.c.data;
			if(data.error==false){
				
				me.js_timeline = response.data.c.data.content;
				me.js_timeline.isPublic = me.token==undefined?true:undefined;
				me.js_timeline.login_id = me.login_id;
				me.js_timeline.activity_detail.avatar_url = (me.js_timeline.user_avatar) ? me.js_timeline.user_avatar.face : '';
				me.js_timeline.activity_detail.activity_title = (me.js_timeline.activity_detail.activity_title == undefined ? '' : me.js_timeline.activity_detail.activity_title)
					.replace(
						'[USERNAME]',
						'<span class="name">' +
						me.js_timeline.user_display_name +
						'</span>'
					)
					.replace(
						'[MOOD_TEXT]',
						me.js_timeline.activity_detail.mood == undefined ? '' :
						'<span class="mood">' +
						me.js_timeline.activity_detail.mood.text + ' ' +
						(me.js_timeline.activity_detail.mood.id == 2 ? '<i class="ci-mood-happy"></i>' :
							me.js_timeline.activity_detail.mood.id == 3 ? '<i class="ci-mood-sad"></i>' : '') +
						'</span>'
					);
				me.js_timeline.view = 'detail';
			}else{
				modalFactory.message(data.message);
			}
		}

		loadData();


	}
})();
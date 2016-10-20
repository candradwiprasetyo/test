(function() {
'use strict';

	angular
		.module('app')
		.factory('AchievementService', AchievementService);

	AchievementService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService'];
	function AchievementService($http, $cookieStore, $rootScope, CiayoService) {
		var service = {
			getData:getData,
			getCompleted:getCompleted,
			getProgress:getProgress,
			getDetail:getDetail,
			shareFB:shareFB,
			popupDetail:popupDetail
		};
		
		return service;
		
		function getData(orderType, orderBy,callback, errCallback) {
			var c={
				data:{
					orderType:orderType,
					orderBy:orderBy
				}
			};
			CiayoService.Api('achievement', c, function(response) {
				if(response.status==200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function getCompleted(orderType, orderBy,callback, errCallback) {
			var c={
				data:{
					orderType:orderType,
					orderBy:orderBy
				}
			};
			CiayoService.Api('achievement/completed', c, function(response) {
				if(response.status==200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function getProgress(orderType, orderBy,callback, errCallback) {
			var c={
				data:{
					orderType:orderType,
					orderBy:orderBy
				}
			};
			CiayoService.Api('achievement/progress', c, function(response) {
				if(response.status==200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function getDetail(callback, errCallback) {
			var c={
				data:{
				}
			};
			CiayoService.Api('achievement/detail', c, function(response) {
				if(response.status==200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function popupDetail(id, callback, errCallback){
			var c = {
				data: {
					"id_achievement": id
				}
			};

			CiayoService.Api('achievement/detail', c, function(response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function shareFB(access_token,uid,id_achievement,id,callback,errCallback){
			var c = {
				data: {
					'access_token': access_token,
					'uid':uid,
					'id_achievement':id_achievement,
					'id':id
				}
			};
			CiayoService.Api('facebook/share/achievement', c, function (response) {
				if (response.status == 200) {
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
	}
})();
(function() {
'use strict';

	angular
		.module('app')
		.factory('AvatarService', AvatarService);

	AvatarService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService'];
	function AvatarService($http, $cookieStore, $rootScope, CiayoService) {
		var service = {
			getDownloadAvatar:getDownloadAvatar
		};
		function getDownloadAvatar(callback){
			var c ={
				
			}
			CiayoService.Api('users/download/avatar', c, function(response) {
				if(response.status==200){
					callback(response.data);
				} else {
					errCallback(response);
				}
			},false,'image');
		}
		return service;
	}
})()
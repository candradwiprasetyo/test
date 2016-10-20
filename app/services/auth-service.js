(function() {
'use strict';

	angular
		.module('app')
		.factory('AuthService', AuthService);

	AuthService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService'];
	function AuthService($http, $cookieStore, $rootScope, CiayoService) {
		var service = {
			Register:Register,
			Login:Login,
			Logout:Logout,
			IsAuth:IsAuth,
			finishProfile:finishProfile
		};
		
		return service;

		////////////////
		
		// Fungsi untuk register
		function Register(c, callback) {
			CiayoService.Api('register', c, function(response) {
				var response = response.data.c;
				// cek error yah
				if(!response.data.error){
					setAuth(response.token, '', '');
					callback(response.data);
				} else {
					callback(response.data);
				}
			});
		}
		
		// Fungsi untuk login
		function Login(c, callback) {
			// Send Req
			CiayoService.Api('login', c, function(response) {
				var response = response.data.c;
				// cek error dulu disini
				if(!response.data.error){
					//console.log(response);
					setAuth(response.token, response.data.content.gender, response.data.content.profile_completed);
					callback(response.data);
				} else {
					callback(response.data);
				}
			});
		}
		
		// Fungsi untuk logout dan hapus cookie user
		function Logout() {
			var c = {
				data: ''
			};
			CiayoService.Api('logout', c, function(response) {
				var response = response.data.c;
				console.log(response);
			});
		}
		
		function finishProfile(){
			$cookieStore.put('profile', true);
		}
		// Fungsi untuk mengecek apakah user tsb sudah login apa belum
		function IsAuth() {
			if($cookieStore.get('token')){
				return true;
			} else {
				
			}
			return false;
		}
		
		// set auth
		function setAuth(token, gender, profile) {
			$cookieStore.put('token', token);
			$cookieStore.put('gender', gender);
			$cookieStore.put('profile', profile);
		}
	}
	
})();
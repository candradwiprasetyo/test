(function() {
'use strict';

	angular
		.module('app')
		.factory('facebookFactory', facebookFactory);

	facebookFactory.$inject = ['$window','$q'];
	function facebookFactory($window,$q) {
		var factory = {
			init:init,
			getToken:getToken
		};
		init();
		return factory;
		
		function getToken(callback){
			var defer = $q.defer();
			var _return = {
				accessToken:null,
				uid:null,
				status:-1
			};
			if(window['FB']){
				loginStatus()
				.then(function(data){//sudah login
					_return.status = data.status;
					_return.accessToken = data.access_token;
					_return.uid = data.uid;
					defer.resolve(_return);
					callback(_return);
				},function(){
					login()
					.then(function(){
						loginStatus()
						.then(function(data){
							_return.status = data.status;
							_return.accessToken = data.access_token;
							_return.uid = data.uid;
							defer.resolve(_return);
							callback(_return);
						},function(){
							callback(_return);
						})
					},function(){
						callback(_return);
					});
				});
			}else{
				callback(_return);
			}
		}
		
		function init() {
			$window.fbAsyncInit = function() {
				if(window['FB']==undefined)return;
				FB.init({ 
					appId: 1757098051179810,
					status: true, 
					cookie: true, 
					xfbml: true,
					version: 'v2.4'
				});
			};
			$window.fbAsyncInit();
		}
		//FB API
		function login(){
			var deferred = $q.defer();
			FB.login(
				function(response) {
					if (response.authResponse) {//fetch information
						FB.api('/me', function(response) {//get user info
							deferred.resolve();
						});
					} else {//cancel login
						deferred.reject();
					}
				},{
					scope: 'publish_actions, public_profile, user_friends, email'
				}
			);
			return deferred.promise;
		}
		function loginStatus(){
			var deferred = $q.defer();
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					// the user is logged in and has authenticated your
					// app, and response.authResponse supplies
					// the user's ID, a valid access token, a signed
					// request, and the time the access token 
					// and signed request each expire
					var uid = response.authResponse.userID;
					var access_token = response.authResponse.accessToken;
					deferred.resolve({uid:uid,access_token:access_token,status:1});
				} else if (response.status === 'not_authorized') {
					// the user is logged in to Facebook, 
					// but has not authenticated your app
					deferred.reject({uid:null,access_token:null,status:-1});
				} else {
					// the user isn't logged in to Facebook.
					deferred.reject({uid:null,access_token:null,status:-2})
				}
			});
			return deferred.promise;
		}
	}
})();
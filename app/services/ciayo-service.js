(function () {
	'use strict';

	angular
		.module('app')
		.factory('CiayoService', CiayoService);

	CiayoService.$inject = ['$http', '$cookieStore', 'socketFactory', '$state', '$rootScope'];

	function CiayoService($http, $cookieStore, socketFactory, $state, $rootScope) {
		var service = {
			Api: Api,
			Socket: Socket
		};

		return service;

		// Fungsi untuk req ke API
		function Api(_url, c, callback, force_url, type) {
			// URL API
			var url = API_SERVER + _url;
			//			var url = 'https://api-astronot.ciayo.com/' + _url;
			if (force_url) {
				url = _url;
			}
			// C JSON Object
			if ($cookieStore.get('language')) {
				var lang = $cookieStore.get('language');
			} else {
				var lang = 2; // default language bahasa
			}
			var c = c;
			angular.extend(c, {
				timestamp: Date.now(),
				app: 'Web',
				screen_type: 'Web',
				image_type: '',
				latitude: '-6.225652',
				longitude: '106.74576',
				language: parseInt(lang)
			});

			if (!Date.now) {
				Date.now = function () {
					return new Date().getTime();
				}
			}

			// Set Data
			var json = angular.toJson(c);
			json = encodeURIComponent(json);
			var data = 'c=' + json;

			// get token
			var token = $cookieStore.get('token') || '';
			var header = {};
			if (token) {
				header = {
					"Content-Type": "application/x-www-form-urlencoded",
					"Authorization": 'Bearer ' + token
				};
			} else {
				header = {
					"Content-Type": "application/x-www-form-urlencoded"
				};
			}
			var log_data = {
				url: url,
				request: data,
				response: {}
			}

			// Req with $http
			$http({
					method: 'POST',
					url: url,
					data: data,
					headers: header
				})
				.then(function (response) {
					if (type == 'image') {
						callback(response);
						return;
					}
					//console.log(response);
					var data = response.data.c.data;
					if (data.message == 'token_invalid' || data.message == 'token_not_provided') {
						$state.transitionTo('welcome');
						$cookieStore.remove('token');
					}
					var ok = 0;
					log_data.response = response.status;
					if (response.status == 200) {
						var data = response.data.c.data;
						if (data.token != null) {
							$cookieStore.put('token', data.token);
						}

						if (data.error != undefined) {
							ok = 1;
						} else {
							if (data.message == 'token_invalid') {
								$cookieStore.remove('token');
								$cookieStore.remove('user_id');
								$cookieStore.remove('gender');
								$state.transitionTo('welcome');
								ok = -1;
							}
						}
					} else {
						var data = response.data.c.data;

					}
					if (ok == 1) {
						callback(response);
					} else
					if (ok == 0) {
						callback(response);
						log(log_data);
					}
				}, function (response) {
					if (_url == 'users/info') {
						var data = response.data;
						if (data['c'] != undefined)
							if (c.data.username == '' && data.c.data.message == 'user_not_found') {
								$cookieStore.remove('token', token);
								$cookieStore.remove('gender', gender);
								$cookieStore.remove('profile', profile);
								return;
							}
					}
					console.log(response);
					log_data.response = response.status;


					var url_block = ['notification', 'notification/read/all', 'users/relation'];
					if (url_block.indexOf(_url) == -1) {

						$rootScope.$broadcast(
							'modal.open', {
								'template': '',
								'data': {
									'message': url,
									'type': response.status
								}
							}
						);
					} else {
						console.log('ok');
					}
					if (response.data) {
						var data = response.data.c.data;
						if (data.message == 'token_invalid' || data.message == 'token_not_provided') {
							$cookieStore.remove('token');
//							$state.reload();
						}
						log(log_data);
					}

				});

			function log(log_data) {
				$.post('https://fr-logs.ciayo.com/errorlog.php', log_data);

			}
		}

		function Socket() {
			if (SOCKET_API_SERVER) {
				var ioSocket = io.connect(SOCKET_API_SERVER);
			} else {
				var ioSocket = io.connect('https://apidev.ciayo.com/');
			}
			var socket = socketFactory({
				ioSocket: ioSocket
			});
			return socket;
		}
	}
})();
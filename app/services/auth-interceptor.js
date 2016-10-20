(function() {
'use strict';

	angular
		.module('app')
		.factory('AuthInterceptor', AuthInterceptor);

	AuthInterceptor.$inject = ['$q', '$location'];
	function AuthInterceptor($q, $location) {
		return {
			request: function(config) {
				//console.log(config);
				var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MjMiLCJpc3MiOiJodHRwOlwvXC9hcGkuY2lheW8uZGNjXC9sb2dpbiIsImlhdCI6MTQ2MTU1OTYxOSwiZXhwIjoxNDYyMTY0NDE5LCJuYmYiOjE0NjE1NTk2MTksImp0aSI6ImE3NDliYzQyMGJiZjA2M2I5ZTZlMjE3OWNkZmYxYjQ2In0.cRfXTTipBl76kJPAu0UQ1uO5TKQo8WSVpXTLoWOez08';
				config.headers = config.headers || {};
				config.headers.Authorization = 'Bearer '+token;
				//config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				return config;
			},
			responseError: function(response) {
				if(response.status === 401) {
					// redirect to some page
					// remove any stale tokens
					return $q.reject(response);
				} else {
					return $q.reject(response);
				}
			}
		};
	}
})();
+function(){ "use strict";
	angular
		.module("CiayoFriendConnection",['ngMaterial'] )
		.directive('cFriendConnection',function() {
			return {
				restrict: "E",
				scope:{user:'=',type:'@'},
				replace:true,
				templateUrl:'app/directives/views/friend-connection.html',
				controller:'FriendConnectionController',
				controllerAs:'vm'
			};
		});
}();

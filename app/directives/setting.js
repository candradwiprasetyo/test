+function(){ "use strict";
	angular
		.module("CiayoSetting", [])
		.directive('cSetting',function() {
			return {
				restrict: "E",
                controller: function($scope, $location, $state, $stateParams)
                {   
                    if($stateParams.menu == 'setting' || $stateParams.menu == '') {
                        $state.go('setting', { 'menu': 'edit-profile' });
                    } else {
                        $scope.active = $stateParams.menu;
                        $scope.url = 'app/directives/views/setting-'+$stateParams.menu+'.html';
                    }
                    if($stateParams.menu == 'delete') {
                        $scope.url = 'app/directives/views/setting-edit-profile.html';
                    }
                    if($stateParams.menu == 'notification') {
                        $scope.active = 'general';
                        $scope.url = 'app/directives/views/setting-general.html';
                    }
                    if($stateParams.menu == 'account') {
                        $scope.active = 'edit-profile';
                        $scope.url = 'app/directives/views/setting-edit-profile.html';
                    }
                    $scope.menu = function (name) {
                        $scope.active = name;
                        $scope.url = 'app/directives/views/setting-' + name + '.html';
                        $state.go('setting', { 'menu': name });
                    }
                },
                template: '<ng-include src="url"></ng-include>'
			};
		})
}();
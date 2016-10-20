(function () {
	'use strict';

	angular
		.module('app', ['ngMaterial', 'ngCookies', 'ui.router', 'ngAnimate', 'door3.css', 'ngMaterial', "CiayoUtil", "CiayoParallax", "CiayoParallaxFix", "CiayoPost", "CiayoCard", "CiayoSetting", "CiayoHeader", "CiayoHeaderPublic", "CiayoFriendConnection", "CiayoProfile", 'CiayoModal', "pascalprecht.translate", 'btford.socket-io', 'angular-click-outside', 'ngSanitize', 'bc.Flickity', 'angulartics', 'angulartics.google.analytics'])
		.config(config)
		.run(run);

	config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$mdThemingProvider', '$translateProvider', '$locationProvider', '$cookiesProvider'];

	function config($stateProvider, $urlRouterProvider, $httpProvider, $mdThemingProvider, $translateProvider, $locationProvider, $cookiesProvider) {
		if (!$cookiesProvider.defaults.expires) {
			var date = new Date();
			date.setDate(date.getDate() + 7);
			$cookiesProvider.defaults.expires = date;
		}

		$locationProvider.html5Mode(!DEVELOPMENT);

		$translateProvider.translations('en', EN)
		$translateProvider.translations('id', ID)
		$translateProvider.translations('no', NO)
		$translateProvider.useSanitizeValueStrategy('escapeParameters')
		var language_key = ['en', 'id']
		$translateProvider.preferredLanguage('id');


		// setting material theme
		$mdThemingProvider.theme('default').primaryPalette('ciayo-dark-blue').accentPalette('ciayo-blue');

		// setting auth interceptor for headers authorization
		//$httpProvider.interceptors.push('AuthInterceptor');
		// route yang terdaftar
		$urlRouterProvider.when('', '/', ['$state', function ($state) {
			$state.go('/');
		}]);
		// default router
		$urlRouterProvider.otherwise("404");
		// Set Routing
		$stateProvider
			.state('/', {
				url: '/',
				templateUrl: 'views/timeline.html',
				// css: 'assets/css/timeline.css',
				controller: 'TimelineController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('/deactivate', {
				url: '/deactivate',
				templateUrl: 'views/deactivate.html',
				// css: 'assets/css/deactivate.min.css',
				//controller: 'TimelineController',
				//controllerAs: 'vm',
				authenticate: false
			})
			.state('404', {
				url: '/404',
				templateUrl: 'views/404.html',
				// css: 'assets/css/error.min.css',
				// controller: 'TimelineController',
				// controllerAs: 'vm',
				authenticate: false
			})
			.state('403', {
				url: '/403',
				templateUrl: 'views/403.html',
				// css: 'assets/css/error.min.css',
				// controller: 'TimelineController',
				// controllerAs: 'vm',
				authenticate: false
			})
			.state('401', {
				url: '/401',
				templateUrl: 'views/401.html',
				// css: 'assets/css/error.min.css',
				// controller: 'TimelineController',
				// controllerAs: 'vm',
				authenticate: false
			})
			.state('500', {
				url: '/500',
				templateUrl: 'views/500.html',
				// css: 'assets/css/error.min.css',
				// controller: 'TimelineController',
				// controllerAs: 'vm',
				authenticate: false
			})
			.state('timeline', {
				url: '/timeline',
				templateUrl: 'views/timeline.html',
				// css: 'assets/css/timeline.css',
				controller: 'TimelineController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('profile', {
				url: '/profile/:user',
				templateUrl: 'views/profile.html',
				// css: ['assets/css/profile.min.css','assets/css/timeline.css'],
				controller: 'ProfileController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('welcome', {
				url: '/welcome?ref',
				templateUrl: 'views/welcome.html',
				css: 'assets/css/welcome.min.css',
				controller: 'WelcomeController',
				controllerAs: 'vm',
				authenticate: false
			})
			.state('popcon', {
				url: '/popcon',
				templateUrl: 'views/welcome.html',
				css: 'assets/css/welcome.min.css',
				controller: 'WelcomeController',
				controllerAs: 'vm',
				authenticate: false
			})
			.state('reset-password', {
				url: '/reset-password/:token',
				templateUrl: 'views/reset-password.html',
				css: 'assets/css/welcome.min.css',
				controller: 'WelcomeController',
				controllerAs: 'vm',
				authenticate: false
			})
			.state('create-avatar', {
				url: '/create-avatar',
				templateUrl: 'views/create-avatar.html',
				// css: 'assets/css/create-avatar.min.css',
				controller: 'CreateAvatarController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('edit-avatar', {
				url: '/edit-avatar',
				templateUrl: 'views/edit-avatar.html',
				// css: 'assets/css/create-avatar.min.css',
				controller: 'EditAvatarController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('download-avatar', {
				url: '/download-avatar',
				templateUrl: 'views/download-avatar.html',
				// css: 'assets/css/download-avatar.css',
				controller: 'DownloadAvatar',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('select-mascot', {
				url: '/select-mascot',
				templateUrl: 'views/select-mascot.html',
				// css: 'assets/css/select-mascot.css',
				controller: 'SelectMascotController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('search-result', {
				url: '/search-result/:search_text',
				templateUrl: 'views/search-result.html',
				// css: 'assets/css/search-result.min.css',
				controller: 'ConnectionSearchResult',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('notification', {
				url: '/notification',
				templateUrl: 'views/notification.html',
				// css: 'assets/css/notification.min.css',
				controller: 'ConnectionNotification',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('friend-request', {
				url: '/friend-request/:page',
				defaultParams: {
					page: 1
				},
				templateUrl: 'views/friend-request.html',
				// css: 'assets/css/friend-request.min.css',
				controller: 'ConnectionFriendRequest',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('achievement', {
				url: '/achievement',
				templateUrl: 'views/achievement.html',
				// css: 'assets/css/achievement.min.css',
				controller: 'AchievementController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('store', {
				abstract: true,
				url: '/store',
				templateUrl: 'views/store.html',
				// css: 'assets/css/store.min.css',
				controller: 'StoreController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('store.home', {
				url: '',
				templateUrl: 'views/store.home.html',
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('store.premium', {
				url: '/premium/:category',
				templateUrl: function ($stateParams) {
					if ($stateParams.category) {
						return 'views/store.category.html';
					} else {
						return 'views/store.premium.html';
					}
				},
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('store.contributor', {
				url: '/contributor/:category',
				templateUrl: function ($stateParams) {
					if ($stateParams.category) {
						return 'views/store.category.html';
					} else {
						return 'views/store.contributor.html';
					}
				},
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('store.free', {
				url: '/free',
				templateUrl: 'views/store.free.html',
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('store.emoji', {
				url: '/emoji',
				templateUrl: 'views/store.emoji.html',
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('store.all', {
				url: '/all',
				templateUrl: 'views/store.all.html',
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('store.search', {
				url: '/search/:keyword',
				templateUrl: 'views/store.search.html',
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('inventory', {
				abstract: true,
				url: '/inventory',
				templateUrl: 'views/inventory.html',
				// css: 'assets/css/store.min.css',
				controller: 'InventoryController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('inventory.home', {
				url: '',
				templateUrl: 'views/inventory.home.html',
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('inventory.priority', {
				url: '/priority',
				templateUrl: 'views/inventory.priority.html',
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('inventory.transaction', {
				url: '/transaction',
				templateUrl: 'views/inventory.transaction.html',
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('inventory.search', {
				url: '/search/:keyword',
				templateUrl: 'views/inventory.search.html',
				// css: 'assets/css/store.min.css',
				authenticate: true
			})
			.state('setting', {
				url: '/setting/:menu',
				templateUrl: 'views/setting.html',
				// css: 'assets/css/ciayo-setting.min.css',
				controller: 'SettingController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('delete-account', {
				url: '/account/:menu/:token',
				templateUrl: 'views/setting.html',
				// css: 'assets/css/ciayo-setting.min.css',
				controller: 'SettingController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('verify', {
				url: '/verify/:menu?email&phone&code',
				templateUrl: 'views/setting.html',
				// css: 'assets/css/ciayo-setting.min.css',
				controller: 'SettingController',
				controllerAs: 'vm',
				authenticate: false
			})
			.state('detail-page', {
				url: '/detail-page/:post_id',
				templateUrl: 'views/detail-page.html',
				// css: 'assets/css/timeline.css',
				controller: 'DetailPageController',
				controllerAs: 'vm',
				authenticate: false
			}).state('about-us', {
				url: '/about-us',
				templateUrl: 'views/static.html',
				controller: 'StaticController',
				params: {
					type: 1
				},
				controllerAs: 'vm',
				authenticate: false
			})
			.state('privacy-and-policy', {
				url: '/privacy-and-policy',
				templateUrl: 'views/static.html',
				controller: 'StaticController',
				params: {
					type: 3
				},
				controllerAs: 'vm',
				authenticate: false
			})
			.state('terms-and-conditions', {
				url: '/terms-and-conditions',
				templateUrl: 'views/static.html',
				controller: 'StaticController',
				params: {
					type: 2
				},
				controllerAs: 'vm',
				authenticate: false
			})
			.state('faq', {
				url: '/faq',
				templateUrl: 'views/static.html',
				controller: 'StaticController',
				params: {
					type: 6
				},
				controllerAs: 'vm',
				authenticate: false
			})
			.state('trending', {
				url: '/trending',
				templateUrl: 'views/trending.html',
				// css: 'assets/css/trending.min.css',
				controller: 'TrendingController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('reactivate-account', {
				url: '/reactivate-account',
				templateUrl: 'views/reactivate-account.html',
				controller: 'SettingController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('update', {
				url: '/update',
				templateUrl: 'views/update.html',
				controller: 'UpdateLogController',
				controllerAs: 'vm',
				authenticate: true
			})
			// .state('profile-public', {
			// 	url: '/:user',
			// 	templateUrl: 'views/profile.html',
			// 	// css: ['assets/css/profile.min.css','assets/css/timeline.css'],
			// 	controller: 'ProfileController',
			// 	controllerAs: 'vm',
			// 	authenticate: true
			// })
			// .state('profile-publics', {
			// 	url: '/:user',
			// 	templateUrl: 'views/profile-public.html',
			// 	// css: ['assets/css/profile.min.css','assets/css/timeline.css'],
			// 	//css: 'assets/css/welcome.min.css',
			// 	controller: 'ProfilePublicController',
			// 	controllerAs: 'vm',
			// 	authenticate: false
			// })
			.state('profile-publics', {
				url: '/:user',
				templateUrl: 'views/profile-template.html',
				controllerProvider: function (AuthService) {

					var ctrl = '';
					if (AuthService.IsAuth()) {
						ctrl = "ProfileController";
					} else {
						ctrl = "ProfilePublicController";
					}
					return ctrl;

				},
				controllerAs: 'vm',
				authenticate: false
			});
	}

	run.$inject = ['$rootScope', '$state', '$cookieStore', 'AuthService', 'SettingService', '$translate', 'modalFactory'];

	function run($rootScope, $state, $cookieStore, AuthService, SettingService, $translate, modalFactory) {
		if ($cookieStore.get('language')) {
			SettingService.getLanguage().then(function(data) {
				var lang_code = ['', 'en', 'id'];
				$translate.use(lang_code[data.content.language]);
			});
		}

		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$rootScope.last = {
				fromState: fromState,
				fromParams: fromParams,
				toState: toState,
				toParams: toParams
			};
			if (toState.authenticate) {

				if (!AuthService.IsAuth()) {
					$state.transitionTo('welcome');
					event.preventDefault();
				} else {
					if (!$cookieStore.get('profile') && !(toState.name == 'create-avatar' || toState.name == 'download-avatar' || toState.name == 'welcome' || toState.name == 'select-mascot')) {
						$state.transitionTo('create-avatar');
						event.preventDefault();
					}
					if ($cookieStore.get('profile') && (toState.name == 'create-avatar' || toState.name == 'welcome' || toState.name == 'select-mascot')) {
						$state.transitionTo('timeline');
						event.preventDefault();
					}
					// if(!$cookieStore.get('active')  && toState.name!='reactivate-account' && toState.name!='welcome'){
					// 	$state.transitionTo('reactivate-account');
					// 	event.preventDefault();
					// }
				}


			}

		});
	}

})();
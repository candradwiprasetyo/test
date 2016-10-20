+function(){ "use strict";
	angular
		.module("CiayoHeaderPublic",['ngMaterial'] )
		.directive('cHeaderPublic',function() {
			return {
				restrict: "E",
				scope:{data:'=','type':'@'},
				replace:true,
				controllerAs:'vm',
				templateUrl:'app/directives/views/header-public.html',
				controller:function ($stateParams, $translate, SettingService, $timeout, AuthService, $cookieStore, $state, $scope, $mdDialog, $mdMedia, $rootScope, $http, $location, listService, ProfileService, ConnectionService, CiayoService, modalFactory ) {
					$scope.with={
						text:""
					}

					var vm = this;	
					vm.validateEmail = validateEmail;
					vm.isEmailValidated = false;
					vm.validatePassword = validatePassword;
					vm.isPassValidated = false;
					vm.checkPassword = checkPassword;
					vm.checkRePass = checkRePass;
					vm.isRePassValidated = false;
					vm.validatePhone = validatePhone;
					vm.isPhoneValidated = false;
					// error messsage
					vm.errMsg = '';


					$scope.action_button_state = function(id){
						$scope.button_state = id;
					}

					$scope.close_panel = function(){
						$scope.button_state = '';
					}

					function inputFocus(el) {
						$('input[name='+el+']').removeClass('error');
						$timeout(function(){
							$('input[name='+el+']').focus();
						},250);
					}
					vm.inputFocus = inputFocus;

					function validateEmail(name, val) {
						var email = val;
						var elem = selectElement('input[name='+name+']');
						
						if(email && email.match(/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g)) {
							elem.removeClass('error');
							elem.addClass('success');
							
							vm.isEmailValidated = true;
						} else if(email){
							elem.removeClass('success');
							elem.removeClass('error');
							setTimeout(function(){
								elem.addClass('error');
							}, 1);
							
							vm.isEmailValidated = false;
						} else {
							elem.removeClass('success');
							elem.removeClass('error');
						}
					}
					
					function validatePassword(id){
						if(vm.registerType == 'email') {
							var pass = vm.regEPass;
						} else if(vm.registerType == 'phone') {
							var pass = vm.regPPass;
						} else {
							var pass = vm.newPass;
						}
						var len = selectElement('#'+id+' ul li:first-child .unchecked-circle');
						var char = selectElement('#'+id+' ul li:last-child .unchecked-circle');
						
						if ( pass.length > 7 ) {
								len.addClass('active');
								var re = /^[A-Za-z\d\!\@\#\$\%\^\*\{\[\}\}\:\;\,\.\?\+\-\_\=\~\']{8,}$/; 
								if ( re.exec(pass) ) {
									char.addClass('active');
									
									vm.isPassValidated = true;
								} else {
									char.removeClass('active');
									
									vm.isPassValidated = false;
								}
						} else {
								len.removeClass('active');
								char.removeClass('active');
								
								vm.isPassValidated = false;
						}
					}
					
					function checkPassword(name){
						var elem = selectElement('input[name='+name+']');
						if(vm.registerType == 'email') {
							var pass = vm.regEPass;
						} else if(vm.registerType == 'phone') {
							var pass = vm.regPPass;
						} else {
							var pass = vm.newPass;
						}
						
						if(pass && pass.match(/^[A-Za-z\d\!\@\#\$\%\^\*\{\[\}\}\:\;\,\.\?\+\-\_\=\~\']{8,}$/)) {
							elem.removeClass('error');
							elem.addClass('success');
						} else {
							elem.removeClass('success');
							elem.removeClass('error');
							setTimeout(function(){
								elem.addClass('error');
							}, 1);
						}
					}
					
					function checkRePass() {
						var elem = selectElement('input[name=rePass]');
						if((vm.newPass == vm.rePass) && vm.rePass) {
							elem.removeClass('error');
							elem.addClass('success');
							vm.isRePassValidated = true;
						} else {
							elem.removeClass('success');
							elem.removeClass('error');
							setTimeout(function(){
								elem.addClass('error');
							}, 1);
							vm.isRePassValidated = false;
						}
					}
					
					function validatePhone(name, val) {
						var phone = val;
						var elem = selectElement('input[name='+name+']');
						
						if(!isNaN(phone)) {
							elem.removeClass('error');
							elem.addClass('success');
							
							vm.isPhoneValidated = true;
						} else if(phone){
							elem.removeClass('success');
							elem.removeClass('error');
							setTimeout(function(){
								elem.addClass('error');
							}, 1);
							
							vm.isPhoneValidated = false;
						} else {
							elem.removeClass('success');
							elem.removeClass('error');
						}
					}

					vm.login = login;
					function login() {
						var username_url = $stateParams.user;
						//console.log(username_url);
						$cookieStore.remove('token');
						if(vm.loginType == 'email') {
							var c = {
								data: {
									email: vm.logEmail,
									password: vm.logEPass
								}
							};
						} else {
							var phone = '';
							if(vm.logPhone){
								var pclen = vm.logPC.length;
								phone = vm.logPhone;
								if(phone.charAt(0) == '0'){
									phone = phone.substr(1);
								} else if(phone.substring(0,pclen) == vm.logPC){
									phone = phone.substr(pclen);
								} else {
									phone = phone;
								}
							}
							var c = {
								data: {
									phone: vm.logPC+'-'+phone,
									password: vm.logPPass
								}
							};
						}
						vm.showLoading = true;
						AuthService.Login(c, function(response) {
							

							//console.log(response.content.tutorial.desktop);
							
							vm.showLoading = false;
							if(response.error) {
								vm.errMsg = response.message;
								$timeout(function(){
									vm.errMsg = null;
								}, 3000);
								vm.inputFocus(vm.loginType=='email'?'logEPass':'logPPass');
							} else {

								if(response.content.active){
									vm.reactivate_account = false;
								 	$cookieStore.put('active', true);
								}else{
									vm.reactivate_account = true;
								}

								if(response.content.tutorial.desktop=='1'){
									$cookieStore.put('end_tour_search_activity',true);
									$cookieStore.put('end_tour_create_post',true);
								}

								SettingService.getLanguage(function(response) {
									var lang_code = ['', 'en', 'id'];
									$translate.use(lang_code[response.data.c.data.content.language]);
									$cookieStore.put('language', response.data.c.data.content.language);
								});

								vm.showLoading = true;
								vm.profile_completed = response.content.profile_completed;
								SettingService.getSettings(function(response) {
												vm.active_account = response.data.c.data.content.list_setting.edit_account.active;
												if(vm.reactivate_account) {
													$state.transitionTo('reactivate-account');
												}else{ 
													if(vm.profile_completed){
														var last = $rootScope.last;
			//											if($rootScope.last.state.name=='detail-page' && $rootScope.last.params['post_id']!=undefined)
			//												{
			//												$state.transitionTo('detail-page',{'post_id':$rootScope.last.params.post_id});
			//											}
			//											else
														{
															//$state.transitionTo('profile-publics', {user: username_url});
															$state.reload();
														}
										} else {
											$state.transitionTo('create-avatar');
										}
									}
								});
							}
						});
					}	

					function forgotPassword() {
						if(vm.forPassType == 'email') {
							var c = {
								data: {
									email: ''+vm.forPassEmail+''
								}
							};
						} else {
							var phone = '';
							if(vm.fpPhone){
								var pclen = vm.fpPC.length;
								phone = vm.fpPhone;
								if(phone.charAt(0) == '0'){
									phone = vm.fpPC+'-'+phone.substr(1);
								} else if(phone.substring(0,pclen) == vm.fpPC){
									phone = vm.fpPC+'-'+phone.substr(pclen);
								} else {
									phone = vm.fpPC+'-'+phone;
								}
							}
							var c = {
								data: {
									phone: ''+phone+''
								}
							};
						}
							
						vm.showLoading = true;
						CiayoService.Api('password', c, function(response){
							vm.showLoading = false;
							if(response.data.c.data.error){
								vm.errMsg = response.data.c.data.message;
								//console.log(vm.errMsg);
								if(typeof vm.errMsg=='object'){

								
									if(vm.forPassType == 'email'){
										vm.errMsg = vm.errMsg.email[0] || 'unknown error';
									} else {
										vm.errMsg = vm.errMsg.phone[0] || 'unknown error';
									}
								}
								$timeout(function(){
									vm.errMsg = null;
								}, 3000);
								vm.inputFocus(vm.forPassType=='email'?'fpEmail':'fpPhone');
							} else {
								vm.fpNotif = true;
								var bd = angular.element('body');
								bd.addClass('modal-is-open');
							}
						});
					}

					vm.forgotPassword = forgotPassword;

					function register() {

						var ref = $stateParams.ref;
						var popcon = $state.current.name=='popcon'?1:0;
						if(vm.registerType == 'email') {
							var c = {
								data: {
									email: vm.regEmail,
									password: vm.regEPass,
									info: popcon,
									referral_id: ref
								}
							};
						} else {
							var phone = '';
							if(vm.regPhone){
								var pclen = vm.regPC.length;
								phone = vm.regPhone;
								if(phone.charAt(0) == '0'){
									phone = phone.substr(1);
								} else if(phone.substring(0,pclen) == vm.regPC){
									phone = phone.substr(pclen);
								} else {
									phone = phone;
								}
							}
							var c = {
								data: {
									phone: vm.regPC+'-'+phone,
									password: vm.regPPass,
									info: popcon
								}
							};
						}
						if(vm.registerType == 'email' && !vm.isEmailValidated) {
							vm.errMsg = 'Email tidak valid';
						} else if(vm.registerType == 'phone' && !vm.isPhoneValidated) {
							vm.errMsg = 'Phone tidak valid';
						} else if(!vm.isPassValidated) {
							vm.errMsg = 'Password tidak valid';
						} else {
							vm.showLoading = true;
							AuthService.Register(c, function(response) {
								$cookieStore.put('active', true);
								vm.showLoading = false;
								if(response.error) {
									if(vm.registerType == 'email') {
										vm.errMsg = response.message;
									} else {
										vm.errMsg = response.message;
									}
									$timeout(function(){
										vm.errMsg = null;
									}, 3000);
									vm.inputFocus(vm.registerType=='email'?'regEmail':'regPhone');
								} else {
									$state.transitionTo('create-avatar');
									
								}
							});
						}
						$timeout(function(){
							vm.errMsg = null;
						}, 3000);
						vm.inputFocus(vm.registerType=='email'?'regEmail':'regPhone');
					}

					vm.register = register;

					function selectElement(el) {
						return angular.element(document.querySelectorAll(el));
					}

					var login_first = $rootScope.$on(
						"login.header_public",
						function(event, data) {
							//console.log('ok');
							$scope.button_state = 2;
							//console.log($scope.button_state);
						}
					);




				}
			};
		});
}();

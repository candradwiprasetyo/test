(function () {
	'use strict';
	angular
		.module('app')
		.directive("toggleSetting", function () {
		return {
			restrict: "A",
			scope: {},
			link: function (scope, elem, attrs) {
				var open = false;
				$(elem).on("click", function () {
					if (!open) {
						$(this).parent().addClass('-open')
						$(this).parent().css("height", $(this).outerHeight() + $(this).siblings('._pane').outerHeight())
						open = true;
					} else {
						$(this).parent().removeClass('-open')
						$(this).parent().removeAttr("style")
						open = false;
					}
				})
			}
		}
		})
		.directive("toggleBlockFriend", function () {
		return {
			restrict: "A",
			link: function (scope, elem, attr) {
				elem.on('click', function (e) {
					e.preventDefault();
					elem.parent().toggleClass('open');
				})
			}
		}
		})
		.directive("showPane", function () {
		return {
			restrict: "A",
			scope: {},
			link: function (scope, elem, attr) {
				elem.on("click", function () {
					elem.parent().css({
						"bottom": 58,
						"overflow": "visible"
					})
				})
			}
		}
		})
		.directive("uiDatepicker", function () {
			return {
				restrict: "A",
				scope: {},
				link: function (scope, elem, attrs) {
					$(elem).datepicker({
						changeMonth: true,
						changeYear: true,
						dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
						dateFormat: 'dd/mm/yy'
					});
				}
			}
		})
		.filter('spaceless', function () {
			return function (input) {
				if (input) {
					input = input.trim();
					return input.replace(/\s+/g, '-');
				}
			}
		})
		.controller('SettingController', SettingController);

	SettingController.$inject = ['AuthService', 'CiayoService', 'SettingService', '$cookieStore', '$translate', '$mdDialog', '$location', '$state', '$stateParams', '$scope', '$controller', '$filter', 'modalFactory','ProfileService'];
	function SettingController(AuthService, CiayoService, SettingService, $cookieStore, $translate, $mdDialog, $location, $state, $stateParams, $scope, $controller, $filter, modalFactory,ProfileService) {
		var me = this;

		angular.element('body').removeAttr('style');

		function getSettings() {
			SettingService.getSettings().then(function(data) {
				var setting = data.content.list_setting;
				var general = setting.general_setting;
				var email_setting = general.email_setting;
				var edit_account = setting.edit_account;

				me.parallax_view_timeline = general.card_setting.parallax_view;
				me.comment = general.notification_setting.comment;
				me.connection_request = general.notification_setting.connection_request;
				me.reset_password = email_setting.reset_password;
				me.login_failed = email_setting.login_failed;
				me.deactive_account  = email_setting.deactive_account;
				me.delete_account = email_setting.delete_account;
				me.new_features = email_setting.new_features;
				me.login_notification = edit_account.login_notification.value;
				me.email_address = edit_account.email_address.value;
				me.edit_email_address = me.email_address;
				me.verify_status = edit_account.verified;
				me.show_email = edit_account.show_email.value;
				me.show_phone = edit_account.show_phone.value;

				if (me.verify_status == true) {
					me.codeverif = true;
				}
				
				try {
					me.phone = edit_account.phone_number.value.split('-');
					me.prefix_verify = me.phone[0];
					me.phone_number = me.phone[1];
					me.edit_phone_number = me.phone_number;
					me.phone_number_value = edit_account.phone_number.value
				} catch (err) { }
				
				me.language_setting = $cookieStore.get('language').toString();
				me.language = [{ "value": 1, "name": "English (US)" }, { "value": 2, "name": "Indonesia" }];
			},function(response){
                //error
        	});
		}

		if ($stateParams.menu == 'notification') {
			me.style = { 'height': '209px' };
			me.class = 'c-set-gen-list -open';
		}
		if ($stateParams.menu == 'account') {
			if (!me.codeverif) {
				var type = null;
				if ($stateParams.email) {
					type = 'email';
					me.email_address = $stateParams.email;
				}
				if ($stateParams.phone) {
					type = 'phone';
					var number = $stateParams.phone;
					if (number) {
						var phone = number.substr(number.length - 4);
						me.x = "";
						for (var i = 1; i <= number.length - 4; i++) {
								me.x += "X";
						}
						me.phone_number = me.x + phone;
					}
				}
				verifyModal('open', type);
				var code = $stateParams.code;
				if (code) {
					me.code_1 = code.charAt(0);
					me.code_2 = code.charAt(1);
					me.code_3 = code.charAt(2);
					me.code_4 = code.charAt(3);
					sendverifcode();
				}
			} else {
				status = $filter('translate')('$success.verified');
				verifyModal('close', me.verify);
				successModal('open');
				me.code_1 = "";
				me.code_2 = "";
				me.code_3 = "";
				me.code_4 = "";
				me.verify_status = true;
				me.codeverif = true;
				me.codeconfirmmessage = "";
			}
		}

		SettingService.getLanguage().then(function(data) {
			me.language_setting = data.content.language;
			$cookieStore.put('language', data.content.language);
			var lang_code = ['en', 'id'];
			$translate.use(lang_code[data.content.language+1]);
		},function(response){
            //error
    	});

		me.resendEmailCount = 0;
		me.resendPhoneCount = 0;
		me.new_features = true;
		me._phone_number = me.phone_number;
		me.prefix = "62";
		me.prefix_verify = "62";
		me.choose_social_media = 0;
		me.timeline_access_privacy = 'anyone';
		me.message_previlage_privacy = 'anyone';
		me.post_default_privacy = 'anyone';
		me.find_me_privacy = 'anyone';
		me.add_me_privacy = 'anyone';
		me.isPassValidated = false;

		function getFilterUser() {
			SettingService.getFilterUser(null, null).then(function(data) {
				//success
			},function(response){
                //error
        	});
		}

		function setNationality(value, image) {
			me.nationality = value;
			me.nationality_image = image;
		}

		function changePassword(event) {
			if (!me.isPassValidated) {
				var status = $filter('translate')('$password.not.valid');
				modalFactory.message(status);
			} else {
				var old_password = me.old_password;
				var new_password = me.new_password;
				var confirm_new_password = me.confirm_new_password;
				SettingService.changePassword(old_password, new_password, confirm_new_password).then(function(data) {
					var status = data.message;
					modalFactory.message(status);
					me.old_password = "";
					me.new_password = "";
					me.confirm_new_password = "";
				},function(response){
                	//error
        		})
			}
		}

		function setTimelineAccessPrivacy(value) {
			me.timeline_access_privacy = value;
		}

		function setMessagePrevilagePrivacy(value) {
			me.message_previlage_privacy = value;
		}

		function setPostDefaultPrivacy(value) {
			me.post_default_privacy = value;
		}

		function setFindMePrivacy(value) {
			me.find_me_privacy = value;
		}

		function setAddMePrivacy(value) {
			me.add_me_privacy = value;
		}

		function confirmDeactive(event) {
			var status = $filter('translate')('$deactive.account?');
			modalFactory.confirm(
				status,
				function (response) {
					if (response) {
						var deactive = true;
						SettingService.userDeactive(deactive).then(function(data) {
							modalFactory.message(data.message);
							setTimeout(function () {
								$cookieStore.remove('token');
								$cookieStore.remove('active');
								ProfileService.userData = null;
								angular.element('#ui-datepicker-div').remove();
								$state.go('welcome');
							}, 2000);
						},function(response){
                          //error
        				})
					}
				}
			);
		}

		function userDeactive(event) {
			var deactive = true;
			SettingService.userDeactive(deactive).then(function(data) {
				showAlert('User Deactive', data.message, event);
			},function(response){
                //error
        	})
		}

		function confirmDelete(event) {
			var status = $filter('translate')('$delete.account?');
			modalFactory.confirm(
				status,
				function (response) {
					if (response) {
						SettingService.confirmDelete().then(function(data) {
							modalFactory.message(data.message);
						},function(response){
			                //error
			            })
					}
				}
			);
		}

		function userDelete(event) {
			SettingService.deleteAccount($stateParams.token).then(function(data) {			
				if (data.error) {
					modalFactory.message(data.message);
				} else {
					modalFactory.message(data.message);
					setTimeout(function () {
						$cookieStore.remove('token');
						angular.element('#ui-datepicker-div').remove();
						$state.go('welcome');
					}, 2500);
				}
			},function(response){
            	//error
       		})
		}

		if ($stateParams.menu == 'delete' && $stateParams.token) {
			userDelete();
		}

		function updateEmail() {
			var email = me.edit_email_address;
			SettingService.updateEmail(email).then(function(data) {
				modalFactory.message(data.message);
				if (data.error == false) {
					var email = me.edit_email_address;
					SettingService.updateResendEmail(email).then(function(data) {
						me.verify_status = false;
						me.codeverif = false;
					},function(response){
            			//error
        			})
				}
			},function(response){
            	//error
        	})
		}

		function updatePhone() {
			var phone_number = me.prefix + "-" + me.edit_phone_number;
			SettingService.updatePhone(phone_number).then(function(data) {
				modalFactory.message(data.message);
				if (data.error == false) {
					me.prefix = me.prefix.replace('+', '');
					me.phone_number = me.phone_number;
					var phone_number = me.prefix_verify + "-" + me.phone_number;
					SettingService.updateResendPhone(phone_number).then(function(data) {
						me.prefix = me.prefix.replace('+', '');
						me.verify_status = false;
						me.codeverif = false;
					},function(response){
		                //error
		            })
				}
			},function(response){
            	//error
        	})
		}

		function saveAccountSetting() {
			if (me.edit_email_address && me.email_change) {
				updateEmail();
			}
			if (me.edit_phone_number && me.phone_change) {
				updatePhone();
			}
			modalFactory.message($filter('translate')('$success.change.profile'));
		}

		function prefixPhoneNumber(limit, offset) {
			var limit = 500;
			var offset = 0;
			SettingService.prefixPhoneNumber(limit, offset).then(function(data) {
				me.list_prefix_phone_number = data.content.list_prefix_phone_number;
				me.list_nationality = data.content.list_prefix_phone_number;
			},function(response){
            	//error
        	})
		}

		function setPrefixPhoneNumber(img, prefix) {
			me.image_prefix = img;
			me.prefix = prefix.replace('+', '');;
			phone_number.focus();
		}

		function setPrefixPhoneVerify(img, prefix) {
			me.image_prefix_verify = img;
			me.prefix_verify = "+" + prefix;
			phone_verify.focus();
		}

		function updateResendEmail() {
			var email = me.update_resend_email;
			SettingService.updateEmail(email).then(function(data) {
				modalFactory.message(data.message);
				angular.element("._foot").css('overflow', 'visible');
				angular.element("._foot").css('overflow', '');
				angular.element("._foot").css('bottom', '8px');
				me.verifyModal('close', me.verify);
				if (data.error == false) {
					me.email_address = me.update_resend_email;
					var email = me.update_resend_email;
					SettingService.updateResendEmail(email).then(function(data) {
						me.verify_status = false;
					},function(response){
            			//error
        			})
				}
			},function(response){
            	//error
        	})
		}

		function updateResendPhone() {
			var phone_number = me.prefix_verify + "-" + me.update_resend_phone;
			SettingService.updatePhone(phone_number).then(function(data) {
				modalFactory.message(data.message);
				angular.element("._foot").css('overflow', '');
				angular.element("._foot").css('bottom', '8px');
				me.verifyModal('close', me.verify);
				if (data.error == false) {
					me.prefix = me.prefix_verify.replace('+', '');
					me.phone_number = me.update_resend_phone;
					var phone_number = me.prefix_verify + "-" + me.update_resend_phone;
					SettingService.updateResendPhone(phone_number).then(function(data) {
						me.prefix = me.prefix_verify.replace('+', '');
						me.phone_number = me.update_resend_phone;
						me.verify_status = false;
					},function(response){
            			//error
        			})
				}
			},function(response){
            	//error
        	})
		}

		function updateLoginNotification(value) {
			value = 1;
			SettingService.updateLoginNotification(value).then(function(response) {
				 //success
            },function(response){
                //error
            })
		}

		function changeLanguage(language_id) {
			$cookieStore.put('language', language_id);
			SettingService.changeLanguage(language_id).then(function(data) {
				//success
            },function(response){
                //error
            })
		}

		var logout_confirm = $filter('translate')('$are.you.sure.logout?');
		function logout(event) {
			modalFactory.confirm(
				logout_confirm,
				function (response) {
					if (response) {
						SettingService.logout().then(function(data) {
							//success
						},function(response){
			                //error
			            })
						$cookieStore.remove('token');
						$cookieStore.remove('gender');
						$cookieStore.remove('language');
						$cookieStore.remove('profile');
						$cookieStore.remove('active');
						$cookieStore.remove('end_tour_create_avatar');
						$cookieStore.remove('end_tour_create_post');
						$cookieStore.remove('end_tour_search_activity');
						angular.element('#ui-datepicker-div').remove();
						$state.go('welcome');
					}
				}
			);
		}

		function restoreDefaultSetting() {
			//restore default setting
		}

		function loginNotification() {
			if (me.login_notification) {
				SettingService.userPreference(1, 'login_notification').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'login_notification').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function showEmail() {
			if (me.show_email) {
				SettingService.userPreference(1, 'show_email').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'show_email').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function showPhone() {
			if (me.show_phone) {
				SettingService.userPreference(1, 'show_phone').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'show_phone').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		/* setting social media */
		function listSocialMedia() {
			SettingService.listSocialMedia().then(function(data) {
				me.list_social_media = data.content.data[0];
			},function(response){
                //error
            })
		}

		function chooseSocialMedia(event, value) {
			event.stopPropagation();
			me.choose_social_media = value;
		}

		function clearAccountSocialMedia() {
			event.stopPropagation();
			me.account_social_media = "";
		}

		function clearValueSocialMedia(id) {
			event.stopPropagation();
			me.value_social_media[id] = "";
		}

		function addSocialMedia(event) {
			var type = me.choose_social_media;
			var value = me.account_social_media;
			SettingService.addSocialMedia(type, value).then(function(data) {
				if (data.error == false) {
					var status = $filter('translate')('$success.add.socmed');
				} else {
					var status = data.message;
				}
				showAlert('Ciayo', status, event);
				listSocialMedia();
			},function(response){
                //error
            })
		}

		function updateSocialMedia(id, value, event) {
			SettingService.updateSocialMedia(id, value).then(function(data) {
				if (data.error == false) {
					var status = $filter('translate')('$success.update.socmed');
				} else {
					var status = response.data.c.data.message;
				}
				showAlert('Ciayo', status, event);
				listSocialMedia();
			},function(response){
                //error
            })
		}

		function deleteSocialMedia(id, event) {
			SettingService.deleteSocialMedia(id).then(function(data) {
				if (data.error == false) {
					var status = $filter('translate')('$success.delete.socmed');
				} else {
					var status = data.message;
				}
				showAlert('Ciayo', status, event);
				listSocialMedia();
			},function(response){
                //error
            })
		}

		/* setting general */

		function parallaxViewTimeline() {
			if (me.parallax_view_timeline) {
				SettingService.userPreference(1, 'parallax_view_timeline').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'parallax_view_timeline').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function notificationTone() {
			if (me.notification_tone) {
				SettingService.userPreference(1, 'notification_tone').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'notification_tone').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function connectionRequest() {
			if (me.connection_request) {
				SettingService.userPreference(1, 'connection_request').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'connection_request').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function _comment() {
			if (me.comment) {
				SettingService.userPreference(1, 'comment').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'comment').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function languageSetting() {
			var language = ['', 'English (US)', 'Indonesia'];
			var lang_code = ['', 'en', 'id'];
			$translate.use(lang_code[me.language_setting]);
			changeLanguage(me.language_setting);
		}

		function resetPassword() {
			if (me.reset_password) {
				SettingService.userPreference(1, 'reset_password').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'reset_password').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function loginFailed() {
			if (me.login_failed) {
				SettingService.userPreference(1, 'login_failed').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'login_failed').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function deactiveAccount() {
			if (me.deactive_account) {
				SettingService.userPreference(1, 'deactive_account').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'deactive_account').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function deleteAccount() {
			if (me.delete_account) {
				SettingService.userPreference(1, 'delete_account').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'delete_account').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function newFeatures() {
			if (me.new_features) {
				SettingService.userPreference(1, 'new_features').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			} else {
				SettingService.userPreference(0, 'new_features').then(function(data) {
					//success
	            },function(response){
	                //error
	            })
			}
		}

		function showAlert(title, content, event) {
			$mdDialog.show(
			$mdDialog.alert()
				.clickOutsideToClose(true)
				.title(title)
				.textContent(content)
				.ariaLabel('Alert Dialog')
				.ok('Got it!')
				.targetEvent(event)
			);
		}

		function showConfirm(title, content, funct, event) {
			var confirm = $mdDialog.confirm()
				.clickOutsideToClose(true)
				.title(title)
				.textContent(content)
				.ariaLabel('Confirm Dialog')
				.ok($filter('translate')('$yes'))
				.cancel($filter('translate')('$no'))
				.targetEvent(event);
				$mdDialog.show(confirm).then(function () {
				if (funct == 'deactive') {
					userDeactive(event);
				}
				if (funct == 'delete') {
					userDelete(event);
				}
			}, function () {
				// console.log('cancel');
			});
		}

		function verifyModal(event, target) {
			me.codeconfirmmessage = "";
			me.verify = target;
			if (event == 'open') {
			$('#c-modal-custom').hide();
				angular.element('body').addClass('modal-is-open');
			} else {
				$('#c-modal-custom').show();
				angular.element('body').removeAttr('class');
			}
			if (target == 'email') {
				var email_address = me.email_address;
				if(me.verify_status==false && !me.codeverif_email) {
					 SettingService.sendConfirmEmail(email_address).then(function(data) {
						me.codeverif=true;
						me.codeverif_email=true;
					 },function(response){
			            //error
			        })
				}
			}
			if (target == 'phone') {
				var number = me.phone_number;
				if (number) {
					var phone = number.substr(number.length - 4);
					me.x = "";
					for (var i = 1; i <= number.length - 4; i++) {
							me.x += "X";
					}
					me._phone_number = me.x + phone;
				}
				me.prefix = me.prefix.replace('+', '');
				me.phone_number = me.phone_number;
				var phone_number = me.prefix_verify + "-" + me.phone_number;
				console.log(me.verify_status, me.verifmodal);
				if (me.verify_status == false && !me.verifmodal) {
					 SettingService.updateResendPhone(phone_number).then(function(data) {
						 me.prefix = me.prefix.replace('+', '');
						 me.codeverif = true;
						 me.codeverif_phone = true;
					 },function(response){
		                //error
		            })
				}
			}
			me.verifmodal = true;
		}

		function successModal(event) {
			if (event == 'open') {
				angular.element('body').addClass('success-is-open');
			} else {
				angular.element('body').removeClass('success-is-open');
			}
		}

		function sendCodeVerify(type) {
			if (type == "email") {
				me.resendEmailCount++;
				var email = me.email_address;
				SettingService.updateResendEmail(email).then(function(data) {
					me.verify_status = false;
					me.codeverif = false;
					me.codeconfirmmessage = data.message;
				},function(response){
	                //error
	            })
			}
			if (type == "phone") {
				me.resendPhoneCount++;
				var phone_number = me.prefix + "-" + me.phone_number;
				SettingService.updateResendPhone(phone_number).then(function(data) {
					me.prefix = me.prefix.replace('+', '');
					me.verify_status = false;
					me.codeverif = false;
					me.codeconfirmmessage = data.message;
				},function(response){
	                //error
	            })
			}
		}

		function sPr(event) {
			event.stopPropagation();
		}
		me.sPr = sPr;

		function inputCodeKey(id, key) {
			console.log(key);
			if (id == 1 && key != 8 && key != 16 && key != 17 && key != 20 && key != 91 && code_1.value != "") {
				code_2.focus();
			}
			if (id == 2 && key != 8 && key != 16 && key != 17 && key != 20 && key != 91 && code_2.value != "") {
				code_3.focus();
			}
			if (id == 3 && key != 8 && key != 16 && key != 17 && key != 20 && key != 91 && code_3.value != "") {
				code_4.focus();
			}

			if (id == 2 && key == 8 && key != 16 && key != 17 && key != 20 && key != 91 && code_2.value == "") {
				code_1.focus();
			}
			if (id == 3 && key == 8 && key != 16 && key != 17 && key != 20 && key != 91 && code_3.value == "") {
				code_2.focus();
			}
			if (id == 4 && key == 8 && key != 16 && key != 17 && key != 20 && key != 91 && me.code_4 == "") {
				me.code_4 == "";
				code_4.value = "";
				code_3.focus();
			}
		}

		me.inputCodeKey = inputCodeKey;

		function sendcode() {
			if (code_1.value && code_2.value && code_3.value && code_4.value) {
				sendverifcode();
			}
		}

		me.sendcode = sendcode;

		function sendverifcode() {
			me.codeconfirmmessage = "verify account...";
			var confirmation_code = me.code_1 + "" + me.code_2 + "" + me.code_3 + "" + me.code_4;
			SettingService.sendCodeVerify(confirmation_code).then(function(data) {
				me.response_api = true;
				var status = data.error;
				if (status == false) {
					status = $filter('translate')('$success.verified');
					me.codeconfirmmessage = 'Your account has been verified.';
					setTimeout(function () {
						verifyModal('close', me.verify);
						successModal('open');
					}, 2000);
					me.code_1 = "";
					me.code_2 = "";
					me.code_3 = "";
					me.code_4 = "";
					me.verify_status = true;
					me.codeverif = true;
					me.codeconfirmmessage = "";
					me.verify_status = true;
				} else {
					status = $filter('translate')('$code.invalid');
					me.codeconfirmmessage = "<span class='verif-code-error'>" + data.message + "</span>";
				}
					//angular.element('body').removeClass('modal-is-open');
			},function(response){
                //error
            })
		}

		me.sendverifcode = sendverifcode;

		function inputCode(id, event) {
			if (id == 0) {
				var item = event.clipboardData.items[0];
				item.getAsString(function (data) {
					var code = data;
					code_1.value = code.charAt(0);
					code_2.value = code.charAt(1);
					code_3.value = code.charAt(2);
					code_4.value = code.charAt(3);
					me.code_1 = code.charAt(0);
					me.code_2 = code.charAt(1);
					me.code_3 = code.charAt(2);
					me.code_4 = code.charAt(3);
					sendcode();
				});
			}
		}

		function datePickerOff() {
			angular.element('#ui-datepicker-div').remove();
		}

		function validatePassword(id) {
			if (id == 'regOldPassword') {
				var pass = me.old_password;
			}
			if (id == 'regNewPassword') {
				var pass = me.new_password;
			}
			if (id == 'regConfirmPassword') {
				var pass = me.confirm_new_password;
			}
			var len = angular.element('#' + id + ' ul li:first-child .unchecked-circle');
			var char = angular.element('#' + id + ' ul li:last-child .unchecked-circle');

			if (pass.length > 7) {
				len.addClass('active');

				if (pass && pass.match(/^[A-Za-z\d\!\@\#\$\%\^\*\{\[\}\}\:\;\,\.\?\+\-\_\=\~\']{8,}$/)) {
					char.addClass('active');
					me.isPassValidated = true;
				} else {
					char.removeClass('active');
					me.isPassValidated = false;
				}
			} else {
				len.removeClass('active');
				char.removeClass('active');
				me.isPassValidated = false;
			}
		}

		function reactive(){
			SettingService.userActive().then(function(data) {
				$cookieStore.put('active', true);
				$state.go('timeline');
			});
		}

		function logout_reactive(event) {
			$cookieStore.remove('token');
			$cookieStore.remove('gender');
			$cookieStore.remove('language');
			$cookieStore.remove('profile');
			$cookieStore.remove('active');
			$cookieStore.remove('end_tour_create_avatar');
			$cookieStore.remove('end_tour_create_post');
			$cookieStore.remove('end_tour_search_activity');
			angular.element('#ui-datepicker-div').remove();
			$state.go('welcome');		
		}

		var lang_code = ['', 'en', 'id'];
		function changeLang(id) {
				$translate.use(lang_code[id]);
				$cookieStore.put('language', id);
				SettingService.changeLanguage(id, function(response) {
						getLanguage();
				});
		}
		function getLanguage() {
				SettingService.getLanguage(function(response) {
						me.language=lang_code[response.data.c.data.content.language];
						if(response.data.c.data.content.language==1) {
								me.lang_select = "English";
						} else {
								me.lang_select = "Bahasa Indonesia";
						}
				});
		}
		me.getLanguge=getLanguage;
		me.changeLang=changeLang;

		me.validatePassword = validatePassword;

		me.datePickerOff = datePickerOff;
		me.inputCode = inputCode;

		me.verifyModal = verifyModal;
		me.sendCodeVerify = sendCodeVerify;

		me.userDeactive = userDeactive;
		me.confirmDeactive = confirmDeactive;
		me.userDelete = userDelete;
		me.confirmDelete = confirmDelete;
		me.deleteAccount = deleteAccount;
		me.updateEmail = updateEmail;
		me.updatePhone = updatePhone;
		me.saveAccountSetting = saveAccountSetting;
		me.prefixPhoneNumber = prefixPhoneNumber;
		me.setPrefixPhoneNumber = setPrefixPhoneNumber;
		me.setPrefixPhoneVerify = setPrefixPhoneVerify;
		me.updateResendEmail = updateResendEmail;
		me.updateResendPhone = updateResendPhone;
		me.restoreDefaultSetting;

		/* setting social media */
		me.addSocialMedia = addSocialMedia;

		/* setting general */
		me.getSettings = getSettings;
		me.loginNotification = loginNotification;
		me.showEmail = showEmail;
		me.showPhone = showPhone;
		me.parallaxViewTimeline = parallaxViewTimeline;
		me.notificationTone = notificationTone;
		me.connectionRequest = connectionRequest;
		me._comment = _comment;
		me.languageSetting = languageSetting;
		me.changeLanguage = changeLanguage;
		me.resetPassword = resetPassword;
		me.loginFailed = loginFailed;
		me.deactiveAccount = deactiveAccount;
		me.deleteAccount = deleteAccount;
		me.newFeatures = newFeatures;
		me.getFilterUser = getFilterUser;
		me.setNationality = setNationality;
		me.changePassword = changePassword;
		me.setTimelineAccessPrivacy = setTimelineAccessPrivacy;
		me.setMessagePrevilagePrivacy = setMessagePrevilagePrivacy;
		me.setPostDefaultPrivacy = setPostDefaultPrivacy;
		me.setFindMePrivacy = setFindMePrivacy;
		me.setAddMePrivacy = setAddMePrivacy;
		me.listSocialMedia = listSocialMedia;
		me.chooseSocialMedia = chooseSocialMedia;
		me.updateSocialMedia = updateSocialMedia;
		me.deleteSocialMedia = deleteSocialMedia;
		me.clearAccountSocialMedia = clearAccountSocialMedia;
		me.clearValueSocialMedia = clearValueSocialMedia;
		me.successModal = successModal;
		me.reactive = reactive;
		me.logout_reactive = logout_reactive;

		me.logout = logout;
		me.showAlert = showAlert;
		me.showConfirm = showConfirm;
		getFilterUser();
		prefixPhoneNumber();
		getSettings();
		listSocialMedia();	
	}
})();
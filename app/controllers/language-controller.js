(function() {
		'use strict';
		angular
				.module('app')
				.controller('languageController', ['$translate', '$scope', 'SettingService', '$cookieStore', function($translate, $scope, SettingService, $cookieStore) {
						var me=this;
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
						getLanguage();
				}])
})();
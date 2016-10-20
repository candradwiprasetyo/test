(function() {
    'use strict';
    angular
        .module('app')
        .controller('StaticController', SettingController);
    
    SettingController.$inject = ['AuthService', 'CiayoService', 'SettingService', '$cookieStore', '$translate', '$mdDialog', '$location', '$state',  '$stateParams', '$scope', '$controller', '$filter', 'modalFactory'];
    function SettingController(AuthService, CiayoService, SettingService, $cookieStore, $translate, $mdDialog, $location, $state, $stateParams, $scope, $controller, $filter, modalFactory) {
        var me=this;

        me.menu = $stateParams.type;

        function listStaticPages(id) {
            $cookieStore.put('static', id);
            var lang=$cookieStore.get('language');
            SettingService.listStaticPages(id,lang,function(response) {
                me.title = response.data.c.data.content.title;
                me.content = response.data.c.data.content.content;
            });
        }
        listStaticPages($stateParams.type);

        me.listStaticPages=listStaticPages;

        var lang_code = ['', 'en', 'id'];

        function changeLang(id) {
            $translate.use(lang_code[id]);
            $cookieStore.put('language', id);
            var static_id = $cookieStore.get('static');
            SettingService.listStaticPages(static_id,id,function(response) {
                me.title = response.data.c.data.content.title;
                me.content = response.data.c.data.content.content;
            });
            SettingService.changeLanguage(id, function(response) {
                getLanguage();
                var lang=$cookieStore.get('language');
            });
        }

        me.changeLang=changeLang;

        function getLanguage() {
            SettingService.getLanguage(function(response) {
                me.language=lang_code[response.data.c.data.content.language];
                if(response.data.c.data.content.language==1) {
                    me.lang_text = "English";
                } else {
                    me.lang_text = "Bahasa Indonesia";
                }
            });
        }

        me.getLanguage=getLanguage;
        getLanguage();
    }

})();
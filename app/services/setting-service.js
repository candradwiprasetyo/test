(function() {
'use strict';
    
    angular
        .module('app')
        .factory('SettingService', SettingService);

    SettingService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService','ProfileService', 'StoreService', '$q'];
    function SettingService($http, $cookieStore, $rootScope, CiayoService, ProfileService, StoreService, $q) {
        var service = {
            getInfo:getInfo,
            getFilterUser:getFilterUser,
            updateUserFilter:updateUserFilter,
            getFilter:getFilter,
            saveTitle:saveTitle,
            getSettings:getSettings,
            updateUsername:updateUsername,
            updateScreenName:updateScreenName,
            userDeactive:userDeactive,
            userActive:userActive,
            confirmDelete:confirmDelete,
            deleteAccount:deleteAccount,
            updateEmail:updateEmail,
            updatePhone:updatePhone,
            prefixPhoneNumber:prefixPhoneNumber,
            updateResendEmail:updateResendEmail,
            updateResendPhone:updateResendPhone,
            updateLoginNotification:updateLoginNotification,
            listSetting:listSetting,
            userPreference:userPreference,
            sendConfirmEmail:sendConfirmEmail,
            sendCodeVerify:sendCodeVerify,
            changePassword:changePassword,
            blockList:blockList,
            blockUser:blockUser,
            unblockUser:unblockUser,
            searchUser:searchUser,
            addSocialMedia:addSocialMedia,
            listSocialMedia:listSocialMedia,
            updateSocialMedia:updateSocialMedia,
            deleteSocialMedia:deleteSocialMedia,
            getLanguage:getLanguage,
            changeLanguage:changeLanguage,
            listStaticPages:listStaticPages,
            logout:logout
        };
        
        return service;
        
        function getInfo(username) {
            var deferred = $q.defer();
            var c={
                data:{
                    username:username
                }
            };
            CiayoService.Api('users/info', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function getFilterUser(filter_category_id, user_id) {
            var deferred = $q.defer();
            var c={
                data:{
                    filter_category_id:filter_category_id,
                    user_id:user_id
                }
            };
            CiayoService.Api('filter/user', c, function(response) {
                 if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }

        function updateUserFilter(updated_filter, type) {
            var deferred = $q.defer();
            var c={
                data:{
                    updated_filter:updated_filter,
                    type:type
                }
            };
            CiayoService.Api('users/filter/update', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }

        function saveTitle(value) {
            var deferred = $q.defer();
            var c={
                data:{
                    value:value
                }
            };
            CiayoService.Api('users/filter/update/achievement', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }

        function getFilter(keyword, filter_category_id, callback, errCallback) {
            var c={
                data:{
                    keyword:keyword,
                    filter_category_id:filter_category_id
                }
            };
            CiayoService.Api('filter', c, function(response) {
                if(response.status==200) {
                    callback(response);
                } else {
                    callback(response);
                }
            });
        }
        
        function getSettings() {
            var deferred = $q.defer();
            var c={
                data:{
                }
            };
            CiayoService.Api('settings', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function updateUsername(username, callback, errCallback) {
            var c={
                data:{
                    username:username
                }
            };
            CiayoService.Api('settings/username', c, function(response) {
                if(response.status==200) {
                    callback(response);
                } else {
                    callback(response);
                }
            });
        }
        
        function updateScreenName(screen_name) {
            var deferred = $q.defer();
            var c={
                data:{
                    screen_name:screen_name
                }
            };
            CiayoService.Api('users/screen/name', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function getLanguage() {
            var deferred = $q.defer();
            var c={data:{}};
            CiayoService.Api('language', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function sendConfirmEmail(email) {
            var deferred = $q.defer();
            var c={
                data:{
                    email:email
                }
            };
            CiayoService.Api('settings/sendingverify/email', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function sendCodeVerify(confirmation_code) {
            var deferred = $q.defer();
            var c={
                data:{
                    confirmation_code:confirmation_code
                }
            };
            CiayoService.Api('settings/verify', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function updateResendEmail(email) {
            var deferred = $q.defer();
            var c={
                data:{
                    email:email
                }
            };
            CiayoService.Api('settings/sendingverify/email', c, function(response) {
                 if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            })
            return deferred.promise;
        }
        
        function updateResendPhone(phone_number) {
            var deferred = $q.defer();
            var c={
                data:{
                    phone_number:phone_number
                }
            };
            CiayoService.Api('settings/sendingverify/phone', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function changePassword(old_password, new_password, confirm_new_password) {
            var deferred = $q.defer();
            var c={
                data:{
                    old_password:old_password,
                    new_password:new_password,
                    confirm_new_password:confirm_new_password
                }
            };
            CiayoService.Api('settings/password', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function userDeactive(deactive) {
            var deferred = $q.defer();
            var c={
                data:{
                    deactive:deactive,
                }
            };
            CiayoService.Api('settings/deactive', c, function(response) {
               if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
             return deferred.promise;
        }

        function userActive() {
            var deferred = $q.defer();
            var c={
                data:{
                    active:true,
                }
            };
            CiayoService.Api('settings/active', c, function(response) {
               if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }

        function confirmDelete() {
            var deferred = $q.defer();
            var c={
                data:{
                }
            };
            CiayoService.Api('settings/deleteconfirm', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function deleteAccount(delete_token) {
            var deferred = $q.defer();
            var c={
                data:{
                    delete_token:delete_token
                }
            };
            CiayoService.Api('settings/delete', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function updateEmail(email) {
            var deferred = $q.defer();
            var c={
                data:{
                    email:email
                }
            };
            CiayoService.Api('settings/email', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function updatePhone(phone_number) {
            var deferred = $q.defer();
            var c={
                data:{
                    phone_number:phone_number
                }
            };
            CiayoService.Api('settings/phone', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function prefixPhoneNumber(limit, offset) {
            var deferred = $q.defer();
            var c={
                data:{
                    limit:limit,
                    offset:offset
                }
            };
            CiayoService.Api('users/setting/prefix_phone_number', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function updateLoginNotification(value) {
            var deferred = $q.defer();
            var c={
                data:{
                    value:value
                }
            };
            CiayoService.Api('users/setting/login_notification', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function changeLanguage(language_id) {
            var deferred = $q.defer();
            var c={
                data:{
                    language_id:language_id
                }
            };
            CiayoService.Api('language', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function listSetting(callback, errCallback) {
            var c={data:{}}
            CiayoService.Api('settings', c, function(response) {
                if(response==200) {
                    callback(response);
                } else {
                    callback(response);
                }
            });
        }
        
        function userPreference(value, type) {
            var deferred = $q.defer();
            var c={
                data:{
                    value:value,
                    type:type
                }
            };
            CiayoService.Api('settings/preference', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function blockList(callback, errCallback) {
            var c={data:{}};
            CiayoService.Api('users/block/list', c, function(response) {
                if(response==200) {
                    callback(response);
                } else {
                    callback(response);
                }
            });
        }
        
        function blockUser(user_id, callback, errCallback) {
            var c={
                data:{
                    user_id:user_id
                }
            };
            CiayoService.Api('users/block', c, function(response) {
                if(response==200) {
                    callback(response);
                } else {
                    callback(response);
                }
            });
        }
        
        function unblockUser(user_id, callback, errCallback) {
            var c={
                data:{
                    user_id:user_id
                }
            };
            CiayoService.Api('users/unblock', c, function(response) {
                if(response==200) {
                    callback(response);
                } else {
                    callback(response);
                }
            });
        }
        
        function searchUser(keyword, limit, offset, callback, errCallback) {
            var c={
                data:{
                    keyword:keyword,
                    limit:limit,
                    offset:offset
                }
            };
            CiayoService.Api('search/user/name', c, function(response) {
                if(response==200) {
                    callback(response);
                } else {
                    callback(response);
                }
            });
        }
        
        function addSocialMedia(type, value) {
            var deferred = $q.defer();
            var c={
                data:{
                    type:type,
                    value:value
                }
            };
            CiayoService.Api('users/sosmed/save', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function listSocialMedia() {
            var deferred = $q.defer();
            var c={data:{}};
            CiayoService.Api('users/sosmed', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function updateSocialMedia(id, value) {
            var deferred = $q.defer();
            var c={
                data:{
                    id:id,
                    value:value
                }
            };
            CiayoService.Api('users/sosmed/update', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
        
        function deleteSocialMedia(id) {
            var deferred = $q.defer();
            var c={
                data:{
                    id:id
                }
            };
            CiayoService.Api('users/sosmed/delete', c, function(response) {
                if(response.status==200){
                    deferred.resolve(response.data.c.data);
                }else{
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }

        function listStaticPages(id,lang,callback, errCallback) {
            var lang = $cookieStore.get('language');
            var c={
                data:{
                    page_id:id,
                    language_id:lang
                }
            }
            CiayoService.Api('page/detail', c, function(response) {
                if(response.status == 200) {
                    callback(response);
                } else {
                    callback(response);
                }
            });
        }
        
        function logout() {
            var deferred = $q.defer();
            var c={data:{}}
            CiayoService.Api('logout', c, function(response) {
                if(response.status == 200) {
                    deferred.resolve(response.data.c.data);
                    console.log(ProfileService);
                    ProfileService.userData=null;
                    StoreService.reset();
                } else {
                    deferred.reject(response);
                }
            });
            return deferred.promise;
        }
    }
})();
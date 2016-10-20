(function() {
'use strict';

	angular
		.module('app')
		.factory('StoreService', StoreService);

	StoreService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService'];
	function StoreService($http, $cookieStore, $rootScope, CiayoService) {
		var service = {
			emojiCollection:null,
			stickerCollection:null,
			reset:reset,
			getUserEmojiCollection:getUserEmojiCollection,
			getUserStickerCollection:getUserStickerCollection,
			getUserEmojiDetail:getUserEmojiDetail,
			getUserStickerDetail:getUserStickerDetail,
			getList: getList,
			getEmoji: getEmoji
		};
		
		return service;
		function reset(){
			service.emojiCollection=null;
			service.stickerCollection=null;
		}

		function getUserEmojiCollection(offset, limit,callback, errCallback) {
			if(service.emojiCollection!=null){
				callback();
				return;
			}
			var c={
				data:{
					offset:offset,
					limit:limit
				}
			};
			CiayoService.Api('user/emoji/collection', c, function(response) {
				var ok=false;
				if(response.status==200) {
					var data=response.data.c.data;
					if(data.error==false){
						ok=true;
					}
				}
				if(ok){
					service.emojiCollection=data.content.emoji_collection;
					callback();
				} else {
					errCallback(response);
				}
			});
		}
		function getUserStickerCollection(offset, limit,callback, errCallback) {
			if(service.stickerCollection!=null){
				callback();
				return;
			}
			var c={
				data:{
					offset:offset,
					limit:limit
				}
			};
			CiayoService.Api('user/sticker/collection', c, function(response) {
				var ok=false;
				if(response.status==200) {
					var data=response.data.c.data;
					if(data.error==false){
						ok=true;
					}
				}
				if(ok){
					service.stickerCollection=data.content.sticker_collection;
					callback();
				} else {
					errCallback(response);
				}
			});
		}
		function getUserEmojiDetail(collection,callback, errCallback) {
			var index = service.emojiCollection.indexOf(collection);
			var c={
				data:{
					collection_id:collection.id,
				}
			};
			CiayoService.Api('user/emoji/collection/detail', c, function(response) {
				var ok=false;
				if(response.status==200) {
					var data=response.data.c.data;
					if(data.error==false){
						ok=true;
					}
				}
				if(ok){
					service.emojiCollection[index].detail=data.content.emoji_collection;
					callback();
				}else{
					errCallback();
				}
			});
		}
		function getUserStickerDetail(collection,callback, errCallback) {
			var index = service.stickerCollection.indexOf(collection);
			var c={
				data:{
					collection_id:collection.id,
				}
			};
			CiayoService.Api('user/sticker/collection/detail', c, function(response) {
				var ok=false;
				if(response.status==200) {
					var data=response.data.c.data;
					if(data.error==false){
						ok=true;
					}
				}
				if(ok){
					service.stickerCollection[index].detail=data.content.sticker_collection;
					callback();
				}else{
					errCallback();
				}
			});
		}

		function getList(order, status, offset, limit, cat, keyword, callback){
			var c = {
				"category_id": cat,
				"keyword": keyword,
				"user": "",
				"order": order,
				"status": status,
				"offset": offset,
				"limit": limit
			};

			CiayoService.Api('ciayoproducts/sticker', c, function(response){
				callback(response);
			});
		}
		
		function getEmoji(offset, limit,callback){
			var c = {
				"offset": offset,
				"limit": limit
			};

			CiayoService.Api('ciayoproducts/emoji', c, function(response){
				callback(response);
			});
		}
		
	}
})();
(function() {
'use strict';

	angular
		.module('app')
		.factory('ItemService', ItemService);

	ItemService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService'];
	function ItemService($http, $cookieStore, $rootScope, CiayoService) {
		var service = {
			list:list,
		};
		
		return service;
		
		function list(keyword,item_category_id,limit,offset,callback,errCallback){
			item_category_id=null;limit=20;offset=0;
			var c = {
				data: {
					"keyword": keyword,
					"item_category_id": item_category_id,
					"limit": limit,
					"offset": offset
				}
			};
			CiayoService.Api('item', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
	}
})();
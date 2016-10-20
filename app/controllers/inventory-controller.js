(function() {
'use strict';

	angular
		.module('app')
		.controller('InventoryController', InventoryController);

	InventoryController.$inject = ['CiayoService','$state','$rootScope','$cookieStore'];
	function InventoryController(CiayoService,$state,$rootScope,$cookieStore) {
		var lang = $cookieStore.get('language');
		var vm = this;
		vm.init = init;
		vm.listStickerCollection = [];
		vm.listTrxHistory = [];
		vm.isSortabled = false;

		$rootScope.$on('$stateChangeStart', function(event, toState){ 
				if(toState.name == 'inventory.priority'){
					$(document).ready(function(){
						setTimeout(function(){
							$( "#sortable1, #sortable2" ).sortable({
								connectWith: ".connectedSortable"
							}).disableSelection();
								
							$('#sortable1').on('sortupdate', function(e,u){
								// update priority
								$('#sortable1 li').each(function(e){
									if(u.item.data().id == $(this).attr('data-id')){
										console.log('ahi');
										var order = parseInt($(this).prev().attr('data-order')) + 1;
										if(!order) {
											order = parseInt($(this).next().attr('data-order')) - 1;
										}
										if(!$('#sortable1 li[data-id='+u.item.data().id+']').attr('data-order')){
											$('#sortable1 li[data-id='+u.item.data().id+']').last().attr('data-order', order);
										}
										vm.setPriority(u.item.data().id, order);
									}
								});
							});
							
							$('#sortable2').on('sortreceive', function(e,u){
								// hapus priority
								setTimeout(function(){
									vm.removePriority(u.item.data().id, u.item.index());
								},500);
							});
						},500);
					});
				} else {
					loadStickerCollection();
				}
		})

		function init(){
			$(document).ready(function(){
				setTimeout(function(){
					$("[data-toggle='modal-close']").click(function(e){
						e.preventDefault();
						$('.-inventory').removeClass('-open');
					});
					$( "#sortable1, #sortable2" ).sortable({
						connectWith: ".connectedSortable"
					}).disableSelection();
					$('#sortable1').on('sortupdate', function(e,u){
					// update priority
						$('#sortable1 li').each(function(e){
							if(u.item.data().id == $(this).attr('data-id')){
								console.log('ahi');
								var order = parseInt($(this).prev().attr('data-order')) + 1;
								if(!order) {
									order = parseInt($(this).next().attr('data-order')) - 1;
								}
								if(!$('#sortable1 li[data-id='+u.item.data().id+']').attr('data-order')){
									$('#sortable1 li[data-id='+u.item.data().id+']').last().attr('data-order', order);
								}
								vm.setPriority(u.item.data().id, order);
							}
						});
					});
					
					$('#sortable2').on('sortreceive', function(e,u){
						// hapus priority
						setTimeout(function(){
							vm.removePriority(u.item.data().id, u.item.index());
						},500);
					});
				},500);
			});

			

			loadStickerCollection();
			loadBalance();
			loadTrxHistory();
		}

		function loadBalance(){
			var c = {
				data: ''
			};

			CiayoService.Api('user/coin/balance', c, function(response){
				var data = response.data.c.data.content;
				vm.cash = data.cash;
				vm.coin = data.coin;
			});
		}

		function loadStickerCollection() {
			var c = {
				data: {
					offset: '0',
					limit: '18'
				}
			};

			CiayoService.Api('user/sticker', c, function(response){
				var data = response.data.c.data.content;
				vm.listStickerCollection = data.sticker_collection;
			});
		}

		function loadTrxHistory() {
			var today = new Date();
			var date_to = vm.endDate?vm.endDate:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
 			today.setDate(today.getDate()-7);
 			var date_from = vm.startDate?vm.startDate:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

			var c = {
				data: {
					date_from: date_from,
					date_to: date_to,
					offset: '0',
					limit: '18'
				}
			};

			CiayoService.Api('user/order/history', c, function(response){
				var data = response.data.c.data.content;
				vm.listTrxHistory = data.list_order_history;
				formatDate();
			});
		}

		var bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
		var month = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		function formatDate() {
			var today = new Date();
			today = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			today = new Date(today);
			for(var i=0; i < vm.listTrxHistory.length; i++){
				var date = new Date(vm.listTrxHistory[i].date);
				if(lang == 1){
					var dateList = month[date.getMonth()]+" "+date.getDate()+" "+date.getFullYear();
				} else {
					var dateList = date.getDate()+" "+bulan[date.getMonth()]+" "+date.getFullYear();
				}
				var difference = today - date;
				if(difference <= 0) {
					vm.isToday = true;
				}
				vm.listTrxHistory[i].date = dateList;
			}
		}

		vm.filterHistory = filterHistory;
		function filterHistory() {
			vm.startDate = angular.element('#startDateHidden').val();

			vm.endDate = angular.element('#endDateHidden').val();
			loadTrxHistory();
		}

		vm.clearFilter = clearFilter;
		function clearFilter() {
			vm.startDate = null;
			angular.element('#startDateHidden').val('');
			angular.element('#startDate').val('');
			vm.endDate = null;
			angular.element('#endDateHidden').val('');
			angular.element('#endDate').val('');
			loadTrxHistory();
		}

		vm.viewDetail = viewDetail;
		vm.itemDetail = {};

		function viewDetail(id) {
			console.log(id);
			vm.preview = false;
			$('.-inventory').addClass('-open');
			var c = {
				data: {
					collection_id: id
				}
			};
			console.log(c);
			vm.itemDetail = {};
			CiayoService.Api('user/sticker/collection/detail', c, function(response){
				if(response.status==200){
					vm.itemDetail = response.data.c.data.content;
				} else {
					console.log('error jow');
				}
			});
		}

		vm.keyword = $state.params.keyword;
		vm.listSearchItem = [];
		vm.searchItem = searchItem;
		function searchItem(){
			$state.transitionTo('inventory.search', {'keyword':vm.keyword});
			var c = {
				data: {
					keyword: vm.keyword,
					offset: '0',
					limit: '18'
				}
			};

			CiayoService.Api('user/sticker', c, function(response){
				var data = response.data.c.data.content;
				vm.listSearchItem = data.sticker_collection;
			});
		}

		vm.deleteSticker = deleteSticker;
		function deleteSticker(id){
			var c = {
				data: {
					sticker_collection_id: id
				}
			};

			CiayoService.Api('user/sticker/delete', c, function(response){
				alert(response.data.c.data.message);
			});
		}

		vm.init();

		// priority function	
		vm.setPriority = setPriority;
		function setPriority(id, pos) {
			var pos = pos + 1;
			var c = {
				data: {
					sticker_collection_id: id,
					order: pos
				}
			}
			CiayoService.Api('ciayoproducts/priority', c, function(response){
				//loadStickerCollection();
			});
		}

		vm.removePriority = removePriority;
		function removePriority(id, pos) {
			var pos = pos + 1;
			var c = {
				data: {
					sticker_collection_id: id
				}
			}
			CiayoService.Api('ciayoproducts/priority/remove', c, function(response){
				//loadStickerCollection();
			});
		}

		function updateOrder(id, pos){
			console.log(pos);
			if(pos){
				pos = pos + 1;
			} else {
				pos = null;
			}
			for(var i = 0; i < vm.listStickerCollection.length; i++){
				if(vm.listStickerCollection[i].id == id){
					vm.listStickerCollection[i].order = pos;
				}
			}
		}
	}
})();
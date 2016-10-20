(function() {
'use strict';

	angular
		.module('app')
		.controller('StoreController', StoreController);

	StoreController.$inject = ['CiayoService','StoreService','$state','modalFactory','$rootScope'];
	function StoreController(CiayoService, StoreService, $state, modalFactory, $rootScope) {
		var vm = this;
		vm.listPopular = [];
		vm.listContributor = [];
		vm.listFreeNew = [];
		vm.listPremiumNew = [];
		vm.listCategoryItem = [];
		vm.listEmoji = [];
		vm.listLoading = [false,false,false,false,false];
		vm.listLoadMore = [false,false,false,false,false];
		vm.listCategory = [];
		vm.cash = '-';
		vm.coin = '-';
		vm.category = $state.params.category;
		vm.init = init;
		vm.setflickity = setflickity;
		vm.loadList = loadList;
		angular.extend(vm,{
			isLoading:[false,false,false,false,false]
		})
		$rootScope.$on('$stateChangeStart', function(){
			setTimeout(function(){
				initBanner();
			},500);
		});

		function init() {
			$(document).ready(function(){
				setTimeout(function(){
					$("[data-toggle='modal-close']").click(function(e){
						e.preventDefault();
						$('.c-modal.store').removeClass('-open');
					});
					initBanner();
				},1000);
			});
			
			loadBalance();
			bannerHome();
			loadList('popular');
			bannerPremium();
			loadList('premium');
			bannerContributor();
			loadList('contributor');
			bannerFree();
			loadList('free');
			loadList('emoji');
			//loadCategory();
		}

		function initBanner() {
			var banner = $('.store-banner ._container');
			var scroll = 0;
			$('.store-banner ._prev').on('click', function(e){
				e.preventDefault();
				if(scroll > 0){
					scroll -= banner.width();
				}
				banner.animate({
					scrollLeft: scroll
				});
			});

			$('.store-banner ._next').on('click', function(e){
				e.preventDefault();
				if(scroll >= 0 && scroll < (banner.width()*2)){
					scroll += banner.width();
				} else {
					scroll = 0;
				}
				banner.animate({
					scrollLeft: scroll
				});
			});

			setInterval(function(){
				if(scroll >= 0 && scroll < (banner.width()*2)){
					scroll += banner.width();
				} else {
					scroll = 0;
				}
				banner.animate({
					scrollLeft: scroll
				});
			},3000);
		}

		vm.init();

		vm.viewDetail = viewDetail;

		function viewDetail(id, type) {
			vm.itemDetail = null;
			if(id){
				vm.preview = false;
				$('.c-modal.store').addClass('-open');
				var c = {
					data: {
						product_id: id
					}
				};
				if(type==='emoji') {
					CiayoService.Api('ciayoproducts/emoji/detail', c, function(response){
						if(response.status==200){
							//console.log(response.data.c.data.content);
							vm.itemDetail = response.data.c.data.content;
							vm.itemDetail.sticker_item = vm.itemDetail.emoji_item;
						} else {
							console.log('error jow');
						}
					});
				} else {
					CiayoService.Api('ciayoproducts/sticker/detail', c, function(response){
						if(response.status==200){
							//console.log(response.data.c.data.content);
							vm.itemDetail = response.data.c.data.content;
						} else {
							console.log('error jow');
						}
					});
				}
			}
		}

		function loadList(type) {
			if(type == 'popular'){
				if(vm.isLoading[0]==true)return;
				vm.isLoading[0]=true;
				StoreService.getList('1','0','0','9','0','', function(response){
					if(response.status == 200){
						vm.listLoading[0] = true;
						vm.listPopular = response.data.c.data.content.data;
						vm.isLoading[0]=false;
					} else {
						console.log('error popular jaw');
						vm.isLoading[0]=false;
					}
				});
			} else if (type == 'premium') {
				if(vm.isLoading[1]==true)return;
				vm.isLoading[1]=true;
				var offset = vm.listPremiumNew.length;
				StoreService.getList('0','1',offset,'12','0','', function(response){
					if(response.status == 200){
						vm.listLoading[1] = true;
						vm.listPremiumNew = vm.listPremiumNew.concat(response.data.c.data.content.data);
						if(response.data.c.data.content.data.length === 0){
							vm.listLoadMore[1] = true;
						}
						vm.isLoading[1]=false;
					} else {
						console.log('error premium jaw');
						vm.isLoading[1]=false;
					}
				});
			} else if (type == 'contributor') {
				if(vm.isLoading[2]==true)return;
				vm.isLoading[2]=true;
				var offset = vm.listContributor.length;
				StoreService.getList('2','0',offset,'12','0','', function(response){
					if(response.status == 200){
						vm.listLoading[2] = true;
						vm.listContributor = vm.listContributor.concat(response.data.c.data.content.data);
						if(response.data.c.data.content.data.length === 0){
							vm.listLoadMore[2] = true;
						}
						vm.isLoading[2]=false;
					} else {
						console.log('error contributor jaw');
						vm.isLoading[2]=false;
					}
				});
			} else if (type == 'free'){
				if(vm.isLoading[3]==true)return;
				vm.isLoading[3]=true;
				var offset = vm.listFreeNew.length;
				StoreService.getList('0','2',offset,'12','0','', function(response){
					if(response.status == 200){
						vm.listLoading[3] = true;
						vm.listFreeNew = vm.listFreeNew.concat(response.data.c.data.content.data);
						if(response.data.c.data.content.data.length === 0){
							vm.listLoadMore[3] = true;
						}
						vm.isLoading[3]=false;
						setflickity();
					} else {
						console.log('error free jaw');
						vm.isLoading[3]=false;
					}
				});
			} else {
				if(vm.isLoading[4]==true)return;
				vm.isLoading[4]=true;
				var offset = vm.listEmoji.length;
				StoreService.getEmoji(offset,'12', function(response){
					if(response.status == 200){
						vm.listLoading[4] = true;
						vm.listEmoji = vm.listEmoji.concat(response.data.c.data.content.list_emoji);
						if(response.data.c.data.content.list_emoji.length === 0){
							vm.listLoadMore[4] = true;
						}
						setflickity();
						vm.isLoading[4]=false;
					} else {
						console.log('error free jaw');
						vm.isLoading[4]=false;
					}
				});
			}
		}

		function setflickity() {
			setTimeout(function() {
				$('.c-store-carousel').flickity({
					pageDots: false,
					cellAlign: 'left'
				});
			}, 250);
		}

		function bannerHome() {
			var c = {
				data: {
					page: 1,
					offset: 0,
					limit: 3
				}
			}
			CiayoService.Api('ciayoproducts/banner', c, function(response){
				if(response.status == 200){
					vm.listBannerHome = response.data.c.data.content.list_store_banner;
				} else {
					console.log('error banner');
				}
			});
		}

		function bannerPremium() {
			var c = {
				data: {
					page: 2,
					offset: 0,
					limit: 3
				}
			}
			CiayoService.Api('ciayoproducts/banner', c, function(response){
				if(response.status == 200){
					vm.listBannerPremium = response.data.c.data.content.list_store_banner;
				} else {
					console.log('error banner');
				}
			});
		}

		function bannerContributor() {
			var c = {
				data: {
					page: 3,
					offset: 0,
					limit: 3
				}
			}
			CiayoService.Api('ciayoproducts/banner', c, function(response){
				if(response.status == 200){
					vm.listBannerContributor = response.data.c.data.content.list_store_banner;
				} else {
					console.log('error banner');
				}
			});
		}

		function bannerFree() {
			var c = {
				data: {
					page: 4,
					offset: 0,
					limit: 3
				}
			}
			CiayoService.Api('ciayoproducts/banner', c, function(response){
				if(response.status == 200){
					vm.listBannerFree = response.data.c.data.content.list_store_banner;
				} else {
					console.log('error banner');
				}
			});
		}

		function loadCategory(){
			var c = {
				data: {
					offset: "0",
					limit: "3"
				}
			}
			CiayoService.Api('ciayoproducts/category', c, function(response){
				if(response.status == 200){
					vm.listCategory = response.data.c.data.content.list_category_ciayo_product;
					if(vm.category){
						loadListCategory();
					}
				} else {
					console.log('error jow');
				}
			});
		}

		function loadBalance(){
			var c = {
				data: ''
			};

			CiayoService.Api('user/coin/balance', c, function(response){
				var data = response.data.c.data.content;
				vm.cash = data.cash;
				vm.coin = data.coin;
				StoreService.emojiCollection = null;
				StoreService.stickerCollection = null;
			});
		}

		function loadListCategory() {
			var type = $state.current.name;
			type = type.split('.');
			type = type[1];
			vm.typeCat = capitalize(type);
			var id = vm.curCatId;
			var cat = capitalize(vm.category);
			vm.catCat = cat;
			for(var i = 0; i < vm.listCategory.length; i++){
				if(cat == vm.listCategory[i].name){
					id = vm.listCategory[i].category_id;
				}
			}

			if(type == 'premium'){
				var order1 = 0;
				var order2 = 1;
			} else {
				var order1 = 2;
				var order2 = 0;
			}

			StoreService.getList(order1,order2,'0','12',id,'', function(response){
				if(response.status == 200){
					vm.listCategoryItem = response.data.c.data.content.data;
					//console.log(vm.listCategoryItem);
				} else {
					console.log('error premium jaw');
				}
			});
		}

		vm.selectCategory = selectCategory;
		vm.curCatId = -1;
		function selectCategory(id, cat) {
			vm.curCatId = id;
			vm.category = cat;
			loadListCategory();
		}

		function capitalize(str) {	
			str = str.toLowerCase().split(' ');

			for(var i = 0; i < str.length; i++){
				str[i] = str[i].split('');
				str[i][0] = str[i][0].toUpperCase(); 
				str[i] = str[i].join('');
			}
			return str.join(' ');
		}

		vm.keyword = $state.params.keyword;
		vm.listSearchItem = [];
		vm.searchItem = searchItem;
		function searchItem(){
			$state.transitionTo('store.search', {'keyword':vm.keyword});
			StoreService.getList('0','0','0','12','0',vm.keyword, function(response){
				if(response.status == 200){
					vm.listSearchItem = response.data.c.data.content.data;
					//console.log(vm.listSearchItem);
				} else {
					console.log('error free jaw');
				}
			});
		}

		if(vm.keyword){
			vm.searchItem();
		}

		vm.buySticker = buySticker;
		function buySticker(){
			if(!vm.itemDetail.bought){
				var c = {
					data: {
						product_id: vm.itemDetail.product_id,
						price: vm.itemDetail.price_1,
						price_type: 'price_1'
					}
				};

				CiayoService.Api('ciayoproducts/buy', c, function(response){
					$('.c-modal.store').removeClass('-open');
					modalFactory.message(response.data.c.data.message);
					loadBalance();
				});
			}
		}
	}
})();
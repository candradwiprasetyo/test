(function() {
'use strict';

	angular
		.module('app')
		.controller('AchievementController', AchievementController);

	AchievementController.$inject = ['CiayoService','CiayoBanner','facebookFactory','AchievementService','modalFactory'];
	function AchievementController(CiayoService, CiayoBanner,facebookFactory,AchievementService,modalFactory) {
		var vm = this;

		vm.init = init;
		vm.listBadge = [];
		vm.listBadgeEmpty = false;
		vm.listAchievement = [];
		vm.listAchievementEmpty = false;
		vm.tabSelected = 'all';
		vm.allItem = 0;
		vm.noData = '';
		vm.orderType = 'name';
		vm.orderBy = 'asc';

		CiayoBanner.getData("achievement", function(response){
			vm.banner = response.data.c.data.content.image;
			setTimeout(function(){
				$('.c-banner').children("ul").parallax({
					clipRelativeInput: false,
					originY: 0.0
				});
			}, 1)
		}, function(){

		})

		function init() {
			var c = {
				data: {
					"orderType": "score",
					"orderBy": "asc"
				}
			}

			CiayoService.Api('badge', c, function(response){
				if(response.status == 200){
					var data = response.data.c.data.content.data;
					if(data.length){
						vm.listBadge = data;
					} else {
						vm.listBadgeEmpty = true;
					}
					//console.log(vm.listAchievement);
				} else {
					alert('error jow !');
				}
			});
		}

		vm.init();

		vm.itemDetail = null;
		vm.viewDetail = viewDetail;
		vm.closeDetail = closeDetail;
		angular.extend(vm,{
			shareFB:shareFB
		});
		function shareFB(id_achievement,id) {
			var access_token = '';
			var uid = '';
			if(!vm.isFB) {
				vm.isFB = true;
				facebookFactory.getToken(function (data) {
					access_token = data.accessToken;
					uid = data.uid;
					AchievementService.shareFB(access_token, uid, id_achievement,id, function (response) {
						var data = response.data.c.data;
						if(data.error==false){
							closeDetail();
							modalFactory.message(data.message);
							vm.isFB = false;
						}
					}, function () {

					});
				});
			}
		}
		function viewDetail(id) {
			vm.itemDetail = null;
			var elem = angular.element('.c-modal.achievement');
			elem.addClass('-open');

			var c = {
				data: {
					"id_achievement": id
				}
			};

			CiayoService.Api('achievement/detail', c, function(response) {
				vm.itemDetail = response.data.c.data.content;
				var date = new Date(vm.itemDetail.date_get*1000);
				vm.itemDetail.date_get = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
				console.log(vm.itemDetail.date_get)
				vm.threshold = vm.itemDetail.treshold.data;
				console.log(vm.threshold);
			});
		}

		function closeDetail() {
			var elem = angular.element('.c-modal.achievement');
			elem.removeClass('-open');
			vm.itemDetail = null;
			vm.threshold = null;
		}

		vm.listProgress = [];
		vm.listProgressEmpty = false;
		vm.listCompleted = [];
		vm.listCompletedEmpty = false;
		vm.changeAchievement = changeAchievement;

		function changeAchievement(url, pg) {
			vm.tabSelected = url;
			var pg = pg || 0;
			var offset = (15 * parseInt(pg - 1)) || 0;
			vm.thisOffset = parseInt(offset) + 1;
			vm.thisEnd = parseInt(pg) * 15;
			
			var c = {
				data: {
					"orderType": vm.orderType,
					"orderBy": vm.orderBy,
					"limit": 15,
					"offset": offset,
					"search": vm.keyword
				}
			}

			if(url == '/progress'){
				vm.listProgress = [];
			} else if(url == '/completed'){
				vm.listCompleted = [];
			} else {
				vm.listAchievement = [];
			}

			if(!isLoaded()) {
				vm.allItem = 0;
				CiayoService.Api('achievement'+url, c, function(response){
					var data = response.data.c.data.content.data;
					vm.allItem = response.data.c.data.meta.total;
					if(vm.allItem < 15 || vm.thisEnd > vm.allItem) vm.thisEnd = vm.allItem;
					//vm.rePagination(vm.allItem, vm.curPage);
					if(response.status == 200){
						if(data.length) {
							if(url == '/progress'){
								vm.listProgressEmpty = false;
								vm.listProgress = data;
							} else if(url == '/completed'){
								vm.listCompletedEmpty = false;
								vm.listCompleted = data;
								console.log(vm.listCompleted);
							} else {
								vm.listAchievementEmpty = false;
								vm.listAchievement = data;
							}
						} else {
							if(url == '/progress'){
								vm.listProgressEmpty = true;
							} else if(url == '/completed'){
								vm.listCompletedEmpty = true;
							} else {
								vm.listAchievementEmpty = true;
							}
						}
					} else {
						alert('error aklejow !');
					}
				});
			}
		}

		function isLoaded() {
			if(vm.tabSelected == '/progress'){
				return vm.listProgress.length?1:0;
			} else if(vm.tabSelected == '/completed'){
				return vm.listCompleted.length?1:0;
			} else {
				return vm.listAchievement.length?1:0;
			}
		}

		vm.curPage = 1;
		vm.pageGoTo = pageGoTo;

		function pageGoTo(pg) {
			vm.curPage = pg;
			vm.changeAchievement(vm.tabSelected, pg);
		}

		vm.changeOrder = changeOrder;
		function changeOrder(type, by){
			vm.orderType = type;
			vm.orderBy = by;
			vm.changeAchievement(vm.tabSelected, vm.curPage);
		}

		vm.setTitle = setTitle;
		function setTitle(title) {
			var c = {
				data: {
					updated_filter: [
						{
							filter_id: 520,
							filter_value: title
						}
					],
					type: 2
				}
			}
			CiayoService.Api('users/filter/update',c,function(response){
				vm.closeDetail();
				modalFactory.message(response.data.c.data.message);
			});
		}
	}
})();
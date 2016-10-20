(function() {
'use strict';

	angular
		.module('app')
		.controller('SelectMascotController', SelectMascotController);

	SelectMascotController.$inject = ['CiayoService','modalFactory'];
	function SelectMascotController(CiayoService,modalFactory) {
		var vm = this;
		vm.getMascot = getMascot;
		vm.saveMascot = saveMascot;
		vm.dataMascot = [];
		
		function getMascot() {
			var c = {
				data: ''
			};
			CiayoService.Api('mascot', c, function(response){
				if(response.status == 200){
					var data = response.data.c.data.content.data;
					vm.dataMascot = data;
				} else {
					modalFactory.message('error bro');
				}
			});
		}
		
		vm.getMascot();
		
		function saveMascot() {
			if(vm.mascot != undefined){
				var c = {
					data: {
						media_id_mascot: vm.mascot
					}
				};
				CiayoService.Api('users/mascot', c, function(response){
					if(response.status == 200){
						modalFactory.message(response.data.c.data.message);
					} else {
						modalFactory.message('error bro');
					}
				});
			} else {
				modalFactory.message('pilih dulu mascot nya');
			}
		}
	}
})();
(function() {
'use strict';

	angular
		.module('app')
		.controller('CreateAvatarController', CreateAvatarController);

	CreateAvatarController.$inject = ['CiayoService','$state','$cookieStore','modalFactory','TourService'];
	function CreateAvatarController(CiayoService,$state,$cookieStore,modalFactory,TourService) {
		var vm = this;
		
		vm.step = '';
		vm.saveName = saveName;
		vm.checkName = checkName;
		vm.saveDOB = saveDOB;
		vm.saveGender = saveGender;
		vm.saveAvatar = saveAvatar;
		vm.skipAvatar = skipAvatar;
		vm.init = [];
		vm.elementSelected = [];
		vm.defaultAvatar = [];
		vm.imgBack = '';
		vm.dobTimestamp = '';
		vm.dataMascot = [];

		vm.idItemSelected = 9;
		vm.itemSelected = [];
		vm.elementIdSelected = 0;
		
		vm.changePart = changePart;
		vm.selectElementVariation=selectElementVariation;

		vm.arrow_next = arrow_next;
		vm.arrow_prev = arrow_prev;

		vm.variantSelected = '';
		vm.colorSelected = '';

		vm.bgAvaColor = "#fff"
		vm.bgElement = {
			required: true,
			element_id: '0',
			element_name: 'Background',
			element_type: [
				{
					element_type_id: '00',
					element_type_name: 'Background Color',
					element_variation: [
						"#FCB64E",
						"#FFE081",
						"#BCDFBF",
						"#AEDCF6",
						"#A5CBEC",
						"#C5C9E6",
						"#F8C2D3",
						"#D8DFE2"
					]
				}
			]
		};
		
		vm.defaultElementColor = {};

		function changePart(item, id) {
			$(".display_loading").show();
			if(vm.idItemSelected == 10){
				vm.imgBack = item.assets[vm.defaultElementColor['element_'+id]].asset_image_back;
			}
			var img = item.assets[vm.defaultElementColor['element_'+id]].asset_image_url;
			vm.itemSelected = item.assets;
			var temp_img = new Image();
			var elem = angular.element('#part_'+id);
			vm.variantSelected = item.variant_id;

			elem.attr('element-id', vm.elementIdSelected);
			elem.attr('variant-id', item.variant_id);
			elem.attr('filter-value', item.assets[vm.defaultElementColor['element_'+id]].asset_id);
			temp_img.onload = function(){
				elem.css('background-image', 'url('+img+')');
				$(".display_loading").delay(500).fadeOut(0);
			}
			temp_img.src=img;

			if(vm.idItemSelected == 9){
				changeFacialHair();
			}

			var skin_color = vm.elementSelected.skin_color;
			if(skin_color){
				changeAllSkin(item.assets[vm.defaultElementColor['element_'+id]].asset_color_id);
			}
			
			
		}

	
		
		vm.changePartColor = changePartColor;
		function changePartColor(id, ind) {
			vm.defaultElementColor['element_'+vm.idItemSelected] = ind;
			$(".display_loading").show();
			var elem = angular.element('#part_'+vm.idItemSelected);
			var url = '';
			var filter_value = '';
			var element_id = elem.attr('element-id');
			var variant_id = elem.attr('variant-id');
			var element_type = vm.elementSelected.element_type;
			var skin_color = vm.elementSelected.skin_color;
			vm.colorSelected = id;
			for(var i = 0; i < element_type.length; i++){
				if(element_id == element_type[i].element_type_id){
					for(var j = 0; j < element_type[i].element_variation.length; j++){
						if(variant_id == element_type[i].element_variation[j].variant_id){
							for(var k = 0; k < element_type[i].element_variation[j].assets.length; k++){
								if(id == element_type[i].element_variation[j].assets[k].asset_color_id){
									if(vm.idItemSelected == 10){
										vm.imgBack = element_type[i].element_variation[j].assets[k].asset_image_back;
									}
									url = element_type[i].element_variation[j].assets[k].asset_image_url;
									filter_value = element_type[i].element_variation[j].assets[k].asset_id;
								}
							}
						}
					}
				}
			}

			if(skin_color){
				changeAllSkin(id);
			}

			var temp_img = new Image();
			//vm.image_loading='show';

			elem.attr('filter-value', filter_value);
			temp_img.onload = function(){
			
				elem.css('background-image', 'url('+url+')');
				$(".display_loading").delay(500).fadeOut(0);

				//vm.image_loading='hide';

			}
			//temp_img.onerror=function(){
			//	vm.image_loading='hide';
			//	modalFactory.message('Load Gambar error');
			//}
			temp_img.src=url;
		}

		function changeAllSkin(id) {
			// change body
			var elem = angular.element('#part_16');
			var assets = vm.init[0].element_type[0].element_variation[0].assets;
			var url = '';
			var filter_value = '';
			for(var i = 0; i < assets.length; i++){
				if(assets[i].asset_color_id == id){
					url = assets[i].asset_image_url;
					filter_value = assets[i].asset_id;
				}
			}
			elem.css('background-image', 'url('+url+')');
			elem.attr('filter-value', filter_value);

			// change face
			var elem = angular.element('#part_9');
			for(var i = 0; i < vm.init.length; i++){
				if(elem.attr('filter-id') == vm.init[i].element_id){
					var element_type = vm.init[i].element_type;
				}
			}
			var url = '';
			var filter_value = elem.attr('filter-value');
			var element_id = elem.attr('element-id');
			var variant_id = elem.attr('variant-id');
			if(filter_value != id) {
				for(var i = 0; i < element_type.length; i++){
					if(element_id == element_type[i].element_type_id){
						var variant = element_type[i].element_variation;
						for(var j = 0; j < variant.length; j++){
							if(variant_id == variant[j].variant_id){
								var assets = variant[j].assets;
								for(var k = 0; k < assets.length; k++){
									if(id == assets[k].asset_color_id){
										url = assets[k].asset_image_url;
										filter_value = assets[k].asset_id;
									}
								}
							}
						}
					}
				}
				elem.css('background-image', 'url('+url+')');
				elem.attr('filter-value', filter_value);
			}
			
			// change nose
			var elem = angular.element('#part_13');
			for(var i = 0; i < vm.init.length; i++){
				if(elem.attr('filter-id') == vm.init[i].element_id){
					var element_type = vm.init[i].element_type;
				}
			}
			var url = '';
			var filter_value = elem.attr('filter-value');
			var element_id = elem.attr('element-id');
			var variant_id = elem.attr('variant-id');
			if(filter_value != id) {
				for(var i = 0; i < element_type.length; i++){
					if(element_id == element_type[i].element_type_id){
						var variant = element_type[i].element_variation;
						for(var j = 0; j < variant.length; j++){
							if(variant_id == variant[j].variant_id){
								var assets = variant[j].assets;
								for(var k = 0; k < assets.length; k++){
									if(id == assets[k].asset_color_id){
										url = assets[k].asset_image_url;
										filter_value = assets[k].asset_id;
									}
								}
							}
						}
					}
				}
				elem.css('background-image', 'url('+url+')');
				elem.attr('filter-value', filter_value);
			}
		}

		vm.backgroundSelected = '#AEDCF6';
		vm.changeBackground = changeBackground;
		function changeBackground(color){
			vm.variantSelected = color;
			vm.backgroundSelected = color;
			$('._viewport').css('background',color);
		}
		
		vm.removePart = removePart;
		function removePart(id) {
			var elem = angular.element('#part_'+id);
			elem.css('background-image', 'url()');
			elem.attr('filter-value', '');
			elem.attr('variant-id', '');
			if(id == 10){
				vm.imgBack = '';
			}
			
			vm.variantSelected = id;
		}

		function checkName(){console.log(vm.nickname);
			if(vm.nickname==undefined || vm.nickname==''){
				modalFactory.message('Isi nama terlebih dahulu');
			}
		}
		function saveName() {
			if(!vm.nickname){
				vm.errMsg = 'Please fill your nickname';
				vm.isModal = true;
				
			} else {
				var c = {
					data: {
						screen_name: vm.nickname
					}
				};
				$(".display_loading_avatar").show();
				CiayoService.Api('users/screen/name', c, function(response) {
					$(".display_loading_avatar").fadeOut(250);
					var response = response.data.c;
					var data = response.data;
					if(!data.error){
						//vm.elementSelected = data.content.data[0];
						vm.step = 'dob-wizard';
					} else {
						vm.errMsg = 'error gan !';
						vm.isModal = true;
					}
				});
			}
		}

		function saveDOB(){
			var dd = vm.dob.split('/');
			dd = dd[1]+'/'+dd[0]+'/'+dd[2];
			var dateyDate = new Date(dd);
			var ms = dateyDate.valueOf();
			var s = ms / 1000;
			vm.dobTimestamp = s;
			var c = {
				data: {
					user_gender: vm.gender
				}
			};
			$(".display_loading_avatar").show();
			console.log(vm.init.length);
			if(vm.init.length == 0){
				CiayoService.Api(AVATAR_API_SERVER+'avatar/init', c, function(response){
					$(".display_loading_avatar").delay(2000).fadeOut();
					var response = response.data.c;
					var data = response.data;
					if(!data.error){
						vm.step = 'avatar-wizard';
						vm.init = data.content.data;
						vm.constraints = response.data.content.constraints;
						loadDefaultAvatar();
					} else {
						vm.errMsg = 'gangguan bro';
						vm.isModal = true;
					}
				},true);
			} else {
				vm.step = 'avatar-wizard';
					$(".display_loading_avatar").hide();
			}
		}
		
		function saveGender() {
			if(!vm.gender){
				vm.errMsg = 'Please select gender';
				vm.isModal = true;
			} else {
				vm.errMsg = 'Please Wait';
				vm.isModal = false;
				var c = {
					data: {
						filter_value: vm.gender
					}
				};
				$(".display_loading_avatar").show();
				$cookieStore.put('gender', vm.gender);CiayoService.Api('users/filter/saveGender', c, function(response) {
					$(".display_loading_avatar").fadeOut(250);
					var response = response.data.c;
					var data = response.data;
					if(!data.error){
						//vm.elementSelected = data.content.data[0];
						vm.step = 'name-wizard';
					} else {
						vm.errMsg = 'error gan !';
						vm.isModal = true;
					}
				});
			}
		}
		
		function loadDefaultAvatar() {
			var c = {
				data: {
					user_gender: vm.gender
				}
			};
			
			CiayoService.Api(AVATAR_API_SERVER+'avatar/defaultAvatars', c, function(response){
				var response = response.data.c;
				var data = response.data;
				if(!data.error){
					vm.isModal = false;
					vm.defaultAvatar = data.content.data;
					vm.imgBack = '';
					for(var i = 0; i < vm.defaultAvatar.length; i++){
						if(vm.defaultAvatar[i].image_back != ''){
							vm.imgBack = vm.defaultAvatar[i].image_back;
						}

						vm.defaultElementColor["element_"+vm.defaultAvatar[i].filter_id] = getIndexColor(vm.defaultAvatar[i].filter_id, vm.defaultAvatar[i].color_id);
						if(vm.defaultAvatar[i].filter_id == "10"){
							vm.defaultElementColor["element_15"] = 0;
						}
					}

					vm.switchTab(vm.init[1]);
					TourService.tourCreateAvatar();
				} else {
					modalFactory.message('Error');
				}
			},true);
		}

		function getIndexColor(element, color) {
			var idn = 0;
			for(var i = 0; i < vm.init.length; i++){
				if(vm.init[i].element_id == element){
					for(var j = 0; j < vm.init[i].color_variant.length; j++){
						if(vm.init[i].color_variant[j].color_id == color){
							idn = j;
						}
					}
				}
			}

			return idn;
		}
		
		function saveAvatar() {
			var c = {
				data: {
					color_code: vm.backgroundSelected
				}
			};
			CiayoService.Api(AVATAR_API_SERVER+'users/background', c, function(response){
				//console.log(response);
			},true);
			var c = {
				data: {
					updated_filter: [
						{
							filter_id: 6,
							filter_value: vm.dobTimestamp
						},
						{
							filter_id: 16,
							filter_value: getFilterValue('16')
						},
						{
							filter_id: 9,
							filter_value: getFilterValue('9')
						},
						{
							filter_id: 14,
							filter_value: getFilterValue('14')
						},
						{
							filter_id: 15,
							filter_value: getFilterValue('15')
						},
						{
							filter_id: 11,
							filter_value: getFilterValue('11')
						},
						{
							filter_id: 12,
							filter_value: getFilterValue('12')
						},
						{
							filter_id: 13,
							filter_value: getFilterValue('13')
						},
						{
							filter_id: 10,
							filter_value: getFilterValue('10')
						},
						{
							filter_id: 23,
							filter_value: getFilterValue('23')
						}
					],
					type: 3
				}
			}
			$(".display_loading_avatar").show();
			CiayoService.Api(AVATAR_API_SERVER+'users/filter/update', c, function(response){
				var response = response.data.c;
				console.log(response);
				if(!response.data.error){
					$cookieStore.put('profile',true);
					$(".display_loading_avatar").fadeIn(250);
					$state.transitionTo('timeline');
				} else {
					modalFactory.message('something error bro, sorry :(');
				}
			},true);
		}
		
		vm.getFilterValue = getFilterValue;
		function getFilterValue(id) {
			var elem = angular.element('#part_'+id);
			var val = elem.attr('filter-value');
			return val;
		}
		
		function skipAvatar() {
			vm.step = 'mascot-wizard';
			var c = {
				data: ''
			};
			if(!vm.dataMascot.length){
				CiayoService.Api('mascot', c, function(response){
					if(response.status == 200){
						var data = response.data.c.data.content.data;
						vm.dataMascot = data;
					} else {
						modalFactory.message('error bro');
					}
				});
			}
		}
		
		vm.switchTab = switchTab;
		
		function switchTab(tab) {
			vm.elementSelected = tab;
			vm.idItemSelected = tab.element_id;
			if(vm.idItemSelected == 0){
				selectElementVariation(tab.element_type[0]);
			} else if(vm.idItemSelected == 15) {
				selectElementVariation(tab.element_type[0]);
			} else if(vm.idItemSelected == 23) {
				selectElementVariation(tab.element_type[2]);
			} else {
				for(var i = 0; i < vm.defaultAvatar.length; i++){
					if(vm.defaultAvatar[i].filter_id == tab.element_id){
						for(var j = 0; j < tab.element_type.length; j++){
							var element_id = vm.getElementId()?vm.getElementId():vm.defaultAvatar[i].element_type_id;
							if(element_id == tab.element_type[j].element_type_id){
								selectElementVariation(tab.element_type[j]);
							}
						}
					}
				}
			}
		}

		vm.getElementId = getElementId;
		function getElementId() {
			var elem = angular.element('#part_'+vm.idItemSelected);
			var val = elem.attr('element-id');
			return val;
		}

		vm.getVariantId = getVariantId;
		function getVariantId() {
			var elem = angular.element('#part_'+vm.idItemSelected);
			var val = elem.attr('variant-id');
			return val;
		}


		function selectElementVariation(tab, change){
			vm.elementIdSelected = tab.element_type_id;
			vm.element_variation = tab.element_variation;
			if(change){
				vm.changePart(vm.element_variation[0], vm.idItemSelected);
			}
		}

		vm.inConstraints = inConstraints;
		function inConstraints(id) {
			if(vm.idItemSelected == 15){
				var elem = angular.element('#part_9');
				var variant_id = elem.attr('variant-id');
				var cur_constraint = vm.constraints[parseInt(variant_id)];
				return cur_constraint.hasOwnProperty(id);
			}
		}

		function changeFacialHair() {
			var elem = angular.element('#part_9');
			var face = elem.attr('variant-id');
			var elem = angular.element('#part_15');
			var fh = elem.attr('variant-id');
			var efh = elem.attr('element-id');
			var cur_constraint = vm.constraints[parseInt(face)];
			if(cur_constraint.hasOwnProperty(parseInt(fh))){
				var val = cur_constraint[fh];
				if(val){
					for(var i = 0; i < vm.init.length; i++){
						if(vm.init[i].element_id == "15"){
							var element = vm.init[i].element_type;
							for(var j = 0; j < element.length; j++){
								if(efh == element[j].element_type_id){
									var variant = element[j].element_variation;
									for(var k = 0; k < variant.length; k++){
										if(variant[k].variant_id == val){
											changePart(variant[k], '15');
										}
									}
								}
							}
						}
					}
				} else {
					vm.removePart(15);
				}
			}
		}

		function arrow_next(){
			$(".frame").animate({scrollLeft: "+="+100});
		}

		function arrow_prev(){
			$(".frame").animate({scrollLeft: "-="+100});
		}

		// select mascot
		vm.saveMascot = saveMascot;
		function saveMascot() {
			if(vm.mascot != undefined){
				var c = {
					data: {
						updated_filter: [{
							filter_id: 6,
							filter_value: vm.dobTimestamp
						}]
					}
				};
				CiayoService.Api(AVATAR_API_SERVER+'users/filter/update', c, function(response){
					if(response.status == 200){
						var c = {
							data: {
								media_id_mascot: vm.mascot
							}
						};
						CiayoService.Api('users/mascot', c, function(response){
							if(response.status == 200){
								modalFactory.message(response.data.c.data.message);
								$cookieStore.put('profile',true);
								$state.transitionTo('timeline');
							} else {
								modalFactory.message('error bro');
							}
						});
					} else {
						alert('error');
					}
				}, true);
			} else {
				modalFactory.message('pilih dulu mascot nya');
			}
		}

		
	}
})();
(function() {
'use strict';

	angular
		.module('app')
		.controller('DownloadAvatar', DownloadAvatar);

	DownloadAvatar.$inject = ['CiayoService','$state','$http','AuthService','AvatarService','$cookieStore'];
	function DownloadAvatar(CiayoService, $state, $http,AuthService,AvatarService,$cookieStore) {
		var vm = this;
		vm.getAvatar = getAvatar;
		vm.imgAva = '';
		vm.imgColor = '';
		
		function getAvatar(){
			var c = {
				data: {
					avatar_type: 'avatar_3'
				}
			};
			vm.loadAva = false;
			CiayoService.Api(AVATAR_API_SERVER+'users/download/avatar', c, function(response){
				if(response.status == 200){
					vm.loadAva = true;
					var data = response.data.c.data;
					
					vm.imgAva = data.content.url;
					var token = $cookieStore.get('token');
					var avaData = '{"data":{"token":"'+token+'"},"timestamp":1468376374025,"app":"Web","screen_type":"Web","image_type":"","latitude":"-6.225652","longitude":"106.74576","language":1}';
					$('#avaData').val(avaData);
					$('#form').attr('action', AVATAR_API_SERVER+'users/avatar');
				} else {
					alert('error bro, cannot get avatar');
				}
			},true);
			// AvatarService.getDownloadAvatar(function(data){
			// 	$(document).append(data);
			// });
		}
		
		vm.getAvatar();
		vm.downloadAvatar = downloadAvatar;
		
		function downloadAvatar(){
			var img = vm.imgAva;
			$http.get(img, {responseType: "arraybuffer"}).success(function(data){

			var arrayBufferView = new Uint8Array( data );
			var blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL( blob );
			
			saveImg(imageUrl,'avatar.png');
	
			}).error(function(err, status){});
		}
				
		function saveImg(fileURL, fileName){
			// for non-IE
			if (!window.ActiveXObject) {
					var save = document.createElement('a');
					save.href = fileURL;
					save.target = '_blank';
					save.download = fileName || 'unknown';

					var event = document.createEvent('Event');
					event.initEvent('click', true, true);
					save.dispatchEvent(event);
					(window.URL || window.webkitURL).revokeObjectURL(save.href);
			}

			// for IE
			else if ( !! window.ActiveXObject && document.execCommand)		 {
					var _window = window.open(fileURL, '_blank');
					_window.document.close();
					_window.document.execCommand('SaveAs', true, fileName || fileURL)
					_window.close();
			}
		}
		
		vm.next = next;
		
		function next() {
			AuthService.finishProfile();
			$state.transitionTo('timeline');
			
		}
	}
})();
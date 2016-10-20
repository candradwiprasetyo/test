+function(){ ""
	angular
		.module("app")
		.service("CiayoBanner", function(CiayoService){
			var service={
				getData:getData,
				getDataPublic:getDataPublic
			}
			return service;
			
			function getData(type,callback,errCallback){
				var c = {
					data: {
						type: type
					}
				}

				CiayoService.Api("users/banner", c, function(response){
					if(response.status == 200){
						callback(response);
					} else{
						errCallback(response);
					}
				})
			}

			function getDataPublic(username, type, callback,errCallback){
				var c = {
					data: {
						username: username,
						type: type
					}
				}

				CiayoService.Api("public/users/banner", c, function(response){
					if(response.status == 200){
						callback(response);
					} else{
						errCallback(response);
					}
				})
			}

		});
}();
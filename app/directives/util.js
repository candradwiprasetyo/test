+function(){ 
	"use strict";
	angular
		.module("CiayoUtil", [])
//		.directive('a', function() {
//		return {
//			restrict: 'E',
//			link: function(scope, elem, attrs) {
//				if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
//					elem.on('click', function(e){
////						e.preventDefault();
//					});
//				}
//			}
//		}
//	 })
	.directive('ngEnter',function() {
		return {
			link:function(scope,element,attrs) {
				element.bind("keypress", function(event) {
					if(event.which === 13) {
						scope.$apply(function() {
							scope.$eval(attrs.ngEnter);
						});
					event.preventDefault();
					}
				});
			}
		};
	})
	.directive('ngSetFocus',function() {
		return {
			link:function(scope,element,attrs) {
				scope.$watch(attrs.ngSetFocus, function(value) {
					if(value === true) { 
							element[0].focus();
							scope[attrs.focusMe] = false;
					}
				});
			}
		};
	})
	.directive('cSlider',function(){
		return{
			restrict: 'A',
			scope:{'list':'=','alias':'='},
			controller:function($scope){
				console.log($scope.list);
			},
			transclude:true,
			template:'<ng-transclude></ng-transclude><div></div>'
		}
	})
	.filter('formatdate', function($filter,$cookieStore) {

		function timeConverter(UNIX_timestamp){
		  	 		var a = new Date(UNIX_timestamp);
				  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				  var year = a.getFullYear();
				  var month = months[a.getMonth()];
				  var date = a.getDate();
				  var time = date + ' ' + month + ' ' + year;
				  return time;
		}

	function format_filter(date) {
		date = date * 1000;
		if (typeof date !== 'object') {
					date = new Date(date);
			}

			var seconds = Math.floor((new Date() - date) / 1000);
			//seconds = seconds + 240;
			var intervalType;
			var type = 'false';

			var interval = Math.floor(seconds / 31536000);
			if (interval >= 1) {
					intervalType = $filter('translate')('$year');
					type = 'true';
			} else {
					interval = Math.floor(seconds / 2592000);
					if (interval >= 1) {
							intervalType = $filter('translate')('$month');
							type = 'true';
					} else {
							interval = Math.floor(seconds / 86400);
							if (interval >= 1) {
									intervalType = $filter('translate')('$day');
									
							} else {
									interval = Math.floor(seconds / 3600);
									if (interval >= 1) {
											intervalType = $filter('translate')('$hour');
									} else {
											interval = Math.floor(seconds / 60);
											if (interval >= 1) {
													intervalType = $filter('translate')('$minute');
													

											} else {
													interval = $filter('translate')('$just.now');
													intervalType = ''; 
													var typelang = 1; 
													//intervalType = $filter('translate')('$second');
											}
									}
							}
					}
			}
			if(type=='false'){
				if(typelang==1){
					return interval;
				}else{
					if($cookieStore.get('language')==1){
						if (interval > 1 || interval === 0) {
							intervalType += 's';
						}
					}
					return interval + ' ' + intervalType + " "+$filter('translate')('$ago');
				}
			}else{
				return timeConverter(date);
			}
	}

	return format_filter;
	})
	.filter('formatdate_timeline', function($filter,$cookieStore) {
	function format_filter(date) {
		date = date * 1000;
		if (typeof date !== 'object') {
					date = new Date(date);
			}

			var seconds = Math.floor((new Date() - date) / 1000);
			seconds = seconds + 240;
			var intervalType;
			var type = 'false';

			var interval = Math.floor(seconds / 31536000);
			if (interval >= 1) {
					intervalType = $filter('translate')('$year');
			} else {
					interval = Math.floor(seconds / 2592000);
					if (interval >= 1) {
							intervalType = $filter('translate')('$month');
					} else {
							interval = Math.floor(seconds / 86400);
							if (interval >= 1) {
									intervalType = $filter('translate')('$day');
							} else {
									interval = Math.floor(seconds / 3600);
									if (interval >= 1) {
											intervalType = $filter('translate')('$hour');
									} else {
											interval = Math.floor(seconds / 60);
											if (interval >= 1) {
													intervalType = $filter('translate')('$minute');
											} else {
													interval = $filter('translate')('$just.now');
													intervalType = ''; 
													type = 'true';
													//intervalType = $filter('translate')('$second');
											}
									}
							}
					}
			}
			if(type=='false'&&$cookieStore.get('language')==1){
				if (interval > 1 || interval === 0) {


						intervalType += 's';
					}
			}
			return interval + ' ' + intervalType + " "+$filter('translate')('$ago');
	}

	return format_filter;
	})
	.directive('whenScrollEnds', function() {
	return {
			restrict: "A",
			link: function(scope, element, attrs) {
                var visibleHeight = element.height();

                var threshold = 100;

                element.scroll(function() {
                    var scrollableHeight = element.prop('scrollHeight');
                    //var hiddenContentHeight = scrollableHeight - element.height();
                    var hiddenContentHeight = scrollableHeight - element.height();
					//console.log(element);
                    if (hiddenContentHeight - element.scrollTop() <= threshold) {
                        // Scroll is almost at the bottom. Loading more rows
                        scope.$apply(attrs.whenScrollEnds);
                    }
                });
            }
		};
	})
	.directive("limitTo", [function() {
		return {
				restrict: "A",
				link: function(scope, elem, attrs) {
						var limit = parseInt(attrs.limitTo);
						angular.element(elem).on("keypress", function(e) {
							if(e.keyCode==8) return;
							if (this.value.length == limit) e.preventDefault();
						});
				}
		}
	}])
	.filter('comment',function(){
		return function(comment){
			if(comment==undefined)return '';
			var out=comment.content;
			if(comment['entities_message']!=undefined){
				if(comment.entities_message.length==1){
					if(comment.entities_message[0].shortcode_format==comment.content){
						comment.entities_message[0].type='sticker';
					}
				}
				var already_parse_sticker = false;
				angular.forEach(comment.entities_message,parse);
			}
			return out;
			function parse(value,key){
				if(value.type=='sticker'){
						if(already_parse_sticker==true){
							return;
						}else{
							already_parse_sticker = true;
						}
					}
					var _out = out.split(value.shortcode_format);
					if(_out.length>1){
						var last = _out.splice(1,_out.length-1).join(value.shortcode_format);
						_out[1] = last;
					}
				out = _out
					.join('<img '+(value.type=='sticker'?'width="100" height="100"':'width="20" height="20"')+' src=\"'+value.media_url+'\">');
			}
		}
	})
	.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
})
	.directive('lazyLoad', function() {
		return {
			restrict: "A",
			link: function(scope, element, attrs) {
				setTimeout(function(){
				angular.element(window).scroll(function(){
					var scroll_height = angular.element('body').prop('scrollHeight');
					var scroll_top = angular.element('body').scrollTop();
					var height = angular.element(window).height();
					if(scroll_height - (height + scroll_top) <=300){
						scope.$apply(attrs.lazyLoad);
					}
				});
					},10);
				scope.$on('$destroy',function(){
					angular.element(window).off('scroll');
				})
			}
		};
	})
	;
	
}();

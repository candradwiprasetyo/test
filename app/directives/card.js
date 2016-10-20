+ function () {
	"use strict";
	angular
		.module("CiayoCard", ['angular-click-outside'])
		.directive("cCard", function ($rootScope, modalFactory) {
			return {
				restrict: "E",
				scope: {
					post: '=',
					index: '=',
					trending: '=',
					detail: '='
				},
				replace: true,
				template: '<div class="c-tml-row" ng-include="getTemplateUrl()"></div>',
				controller: 'PostController'
			}
		})
		.directive('cCardRight', function ($rootScope, modalFactory) {
			return {
				restrict: "E",
				replace: true,
				templateUrl: 'app/directives/views/card-right.html',
				controller: function ($scope, PostService, ConnectionService, listService, ProfileService, facebookFactory) {
					angular.extend(
						$scope, {
							onEditComment: false,
							commentEditOpen: commentEditOpen,
							commentEditClose: commentEditClose,
							commentEditCloseKey:commentEditCloseKey,
							with: {
								text: "",
								isActive: false,
								search_list: Object.create(listService)
							}
						}
					);
					init();

					function init() {
						if($scope.post.isPublic==undefined){
							PostService.postAttributes(
								function () {
									$scope.permission_list = PostService.permission_list;
								},
								function (response) {
									console.log(response);
								}
							)
						}
					}
					//post
					$scope.deletePost = function (post_id, $index) {
						$rootScope.$broadcast('card.delete', $scope.post);
					}
					$scope.unsubscribePost = function (post) {
							PostService.unsubscribePost(post.post_id, function (response) {
								var data = response.data.c.data;
								if (data.error == false && data.content.status == 'success') {
									post.unsubscribe = true;
								}
								modalFactory.message(data.message);
							}, function (response) {});
						}
					$scope.subscribePost = function (post) {
							PostService.subscribePost(post.post_id, function (response) {
								var data = response.data.c.data;
								if (data.error == false && data.content.status == 'success') {
									post.unsubscribe = false;
								}
								modalFactory.message(data.message);
							}, function (response) {});
						}
						//reaction
					$scope.postReaction = function (post_id, reaction) {
						if(post_id==1){modalFactory.message('Reaction disabled');return;}
						PostService.postReaction(post_id, reaction, function (response) {
							var data = response.data.c.data;
							if (data.error == false) {
								$scope.post.reaction = data.content;
								$scope.reactionDetail(post_id);
							}
						}, function (response) {

						});
					}
					

					//comment
					$scope.reportComment = function (post_id, comment_id, content) {
						PostService.reportComment(
							post_id, comment_id, content,
							function (response) {
								var data = response.data.c.data;
								if (data.error == false) {
									modalFactory.message('Berhasil Report');
								}
							},
							function (response) {

							}
						)
					}

					function commentEditOpen( comment) {
						comment.on_edit=true;
//						angular.element(obj.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode).addClass('active');
						comment.old_content = comment.content;
						$scope.onEditComment = true;
					}
					function commentEditCloseKey($event,comment) {
						if ($event.keyCode == 27) {
							commentEditClose(comment);
						}
					}
					function commentEditClose(comment) {
						comment.on_edit=false;
						comment.content = comment.old_content;
//						if (key == 27) {
//							angular.element(obj.target.parentNode.parentNode.parentNode).removeClass('active');
//						}
						$scope.onEditComment = false;
					}
					
					
					//permission
					$scope.updatePermission = function (post_id, permission_id) {
							PostService.updatePermission(
								post_id, permission_id,
								function (response) {
									var data = response.data.c.data;
									if (data.error == false) {
										//modalFactory.message('Berhasil Update Permission');
									}
									modalFactory.message(data.message);
								},
								function (response) {

								}
							)
						}
						//with
					$scope.withDetail = function (post_id) {
						PostService.loadWith(post_id, function (response) {
							var data = response.data.c.data;
							if (data.error == false) {
								$scope.post.with = data.content.data;
								$scope.with.search_list.reset();
							}
						}, function (response) {

						});
					}
					$scope.withRemove = function (_with) {
						$scope.post.with.splice($scope.post.with.indexOf(_with), 1);
					}
					$scope.withUpdate = function (post_id, _with) {
						var withs = [];
						angular.forEach(_with,function(value,key){
							withs.push({id:value.user_id,username:value.username});
						});
						PostService.updateWith(post_id, withs, function (response) {
							var data = response.data.c.data;
							if (data.error == false) {
								$scope.post.with = data.content.data;
								$scope.post.with_count = data.content.data.length;
								$scope.post.with_detail.with_user_count = data.content.data.length;
								if(data.content.data.length==0){
									$scope.post.with_detail.with_status.value=-1;
								}else{
									$scope.post.with_detail.with_status.value=0;
								}
							}
						}, function (response) {

						});
					}
					$scope.withSearch = function () {
						if ($scope.with.text.length > 1) {
							ProfileService.searchFriend($scope.with.text, 20, 0, function (response) {
								$scope.with.search_list.list = response.data.c.data.content.list_user;
							}, function (response) {
								console.log(response);
							});
						}
					}
					$scope.withSelect = function ($index) {
						$scope.with.text = null;
						var selected = $scope.with.search_list.getSelectedItem();
						$scope.post.with.push({
							user_id: selected.user_id,
							username: selected.username,
							'user_display_name': selected.user_display_name,
							user_avatar_thumbnail: selected.user_avatar_thumbnail,
							user_avatar_detail: selected.user_avatar_detail
						})
						$scope.with.search_list.reset();
					}
					$scope.withKeydown = function ($event, $index) {
						if ($event.keyCode === 40) {
							$event.preventDefault();
							$scope.with.search_list.next();
						} else if ($event.keyCode === 38) {
							$event.preventDefault();
							$scope.with.search_list.prev();
						} else if ($event.keyCode === 13) {
							$scope.withSelect($index);
						}
					}

					//caption
					$scope.updateCaption = function (post_id, post_caption, bubble) {
							PostService.updateCaption(post_id, post_caption, bubble, function (response) {
								var data = response.data.c.data;
								if (data.error == false) {
									$scope.post.with = data.content.data;
									$scope.post.activity_detail.old_caption = post_caption;
								}
							}, function (response) {
								
							});
						}
						//C Button
					$scope.requestFollow = function (user_id, follow, post) {
						console.log(post);

						ConnectionService.requestFollow(user_id, follow, function (response) {
							var data = response.data.c.data;
							console.log(data);
							if (data.error == false) {
								//modalFactory.message('Berhasil');
								post.user_status.follow = follow;
							}
						}, function (response) {
						});
					}
					$scope.requestFriend = function (user_id, category_id) {
							ConnectionService.requestCreate(user_id, category_id, function (response) {
								var data = response.data.c.data;
								if (data.error == false) {
									modalFactory.message('Berhasil');
								}
								modalFactory.message(data.message);
							}, function (response) {

							});
						}
						//jquery, etc
					$("._reaction").on({
						mouseover: function () {
							$(this).addClass('-roll');
							$(this).off('animationiteration webkitAnimationIteration', move);
						},
						mouseleave: function () {
							$(this).on('animationiteration webkitAnimationIteration', move);
						}
					});

					function move() {
						$(this).removeClass("-roll");
					}

				}
			}
		})

	.directive("cardActivityToggle", function () {
		return {
			restrict: "E",
			link: function (scope, elem, attrs) {
				elem.on("click", function () {
					if (attrs.clickable) {
						$(this).parent().siblings().removeClass('-active');
						$(this).parent().addClass('-active');
					}
				})
			}
		}
	})

	.directive("toggleActivityClose", function () {
		return {
			restrict: "A",
			scope: {},
			link: function (scope, elem, attrs) {
				elem.on("click", function () {
					$(this).parent().siblings().removeClass('-active');
				});
			}
		}
	})

	.directive("toggleCardOption", function () {
		return {
			restrict: "A",
			scope: {},
			link: function (scope, elem, attrs) {
				elem.on("click", function () {
					if (attrs.toggleCardOption === "close") {
						$(this).closest("card-option-pane").removeClass("-active");
						$(this).closest("card-option-pane").siblings("card-option-button").removeClass("-shift");
					} else {
						$(this).closest("card-option-button").addClass("-shift");
						$(this).closest("card-option").children("." + attrs.toggleCardOption).addClass("-active")
					}
				});
			}
		}
	})

	.directive("cardTabToggle", function () {
		return {
			restrict: "E",
			link: function (scope, elem, attrs) {
				elem.on("click", function () {scope.getDownloadImage();
					var activating = $(this).parent();
					var previously = $(this).parent().siblings('.-active');

					if ($(previously).index() >= 0) {
						$(previously).removeClass('-active');
						$(activating).addClass('-active');
						$(this).parent().siblings('card-tab-active').css({
							"top": $(this).position().top,
							"height": $(this).height()
						});
					}
				});
			}
		}
	})

	.directive("toggleCardComment", function () {
		return {
			restrict: "A",
			link: function (scope, elem, attrs) {
				elem.on("click", function (e) {
					e.preventDefault();
					if (attrs.toggleCardComment === "open") {
						$(this).closest("card-comment-block").css("left", "-100%")
						$(this).closest("card-comment-block").siblings("card-comment-nested").css("left", "0")
					}

					if (attrs.toggleCardComment === "back") {
						$(this).closest("card-comment-nested").css("left", "100%")
						$(this).closest("card-comment-nested").siblings("card-comment-block").css("left", "0")
					}
				})
			}
		}
	})

	.directive('cSticker', function () {
		return {
			restrict: 'E',
			templateUrl: 'app/directives/views/card-sticker.html',
			replace: true,
			link: function () {

			},
			controllerAs: 'me',
			controller: function ($scope, $element, StoreService, PostService) {
				var me = this; //console.log($element.closest('._sticker').addClass('asd'));
				angular.extend(me, {
					emojiCollection: [],
					class: '',
					init: init,
					close:close,
					open:open,
					loadStickerCollection: loadStickerCollection,
					loadEmojiCollection: loadEmojiCollection,
					loadStickerDetail: loadStickerDetail,
					loadEmojiDetail: loadEmojiDetail,
					closeModal: closeModal,
					comment: comment
				});

				function init() {
					console.log(me);
					if (me.class == '') {
						open();
						loadStickerCollection();
						loadEmojiCollection();
					} else {
						close();
					}
				}
				function close(){
					me.class='';
				}
				function open(){
					me.class = '-open';
				}
				function loadStickerCollection() {
					StoreService.getUserStickerCollection(
						0, 20,
						function () {
							me.stickerCollection = StoreService.stickerCollection;
							console.log(StoreService.stickerCollection);
							if (me.stickerCollection.length > 0)
								loadStickerDetail(me.stickerCollection[0]);
						},
						function (response) {
							console.error(response);
						}
					)
				}

				function loadEmojiCollection() {
					StoreService.getUserEmojiCollection(
						0, 20,
						function () {
							me.emojiCollection = StoreService.emojiCollection;
							if (me.emojiCollection.length > 0)
								loadEmojiDetail(me.emojiCollection[0]);
						},
						function (response) {
							console.error(response);
						}
					)
				}

				function loadStickerDetail(collection) {
					var index = me.stickerCollection.indexOf(collection);
					StoreService.getUserStickerDetail(
						collection,
						function (data) {
							me.stickerCollection = StoreService.stickerCollection;
						},
						function (response) {
							console.error(response);
						}
					)
				}

				function loadEmojiDetail(collection) {
					var index = me.emojiCollection.indexOf(collection);
					StoreService.getUserEmojiDetail(
						collection,
						function (data) {
							me.emojiCollection = StoreService.emojiCollection;
						},
						function (response) {
							console.error(response);
						}
					)
				}

				function comment(collection, type) {
					if ($scope.post.comment_text == undefined) {
						$scope.post.comment_text = '';
					}
					if (type == 1) {
						$scope.commentCreate($scope.post, collection.shortcode_format, $scope.commentReply)
						$scope.post.comment_count += 1;
					} else
					if (type == 2) {
						$scope.post.comment_text += collection.shortcode_format;
					}
					me.class = '';

				}

				function closeModal() {
					console.log('close');
					me.class = '';
				}
			}
		}
	});
	
	
}();
(function () {
	'use strict';
	/*globals angular:false */
	angular
		.module('app')
		.service('listService',listService );
	function listService(){
		this.isActive=false;
		this.maxSize=0;
		this.top = 0;
		this.list=[];
		this.selectedIndex=0;
		this.prev = function(el,height,search_view){
			if(this.selectedIndex>0){
				this.selectedIndex--;
				if( this.top >= this.selectedIndex )
				{
					this.top = this.selectedIndex;
					angular.element(el).scrollTop(this.top*height);
				}
			}console.log(this.top);
		}
		this.next = function (el,height,search_view) {
			if(this.selectedIndex+1 < this.list.length){
				this.selectedIndex++;
				if(this.selectedIndex >= this.top+search_view){
					this.top = this.selectedIndex+1 - (search_view);if(this.top<0){this.top=0;}
					angular.element(el).scrollTop(this.top*height);
				}
			}console.log(this.top);
		}
		this.reset = function () {
			this.list = [];
			this.selectedIndex = 0;
			this.top = 0;
		}
		this.getSelectedItem = function () {
			return this.list[this.selectedIndex];
		}
		this.setSelectedIndex=function(selectedIndex,el,height){
			this.selectedIndex = selectedIndex;
			this.top = Math.floor(angular.element(el).scrollTop()/height);
		}
		this.isEmpty=function(){
			return this.list.length==0;
		}
	}
}());
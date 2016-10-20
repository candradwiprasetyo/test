(function() {
	'use strict';

	angular
		.module('app')
		.directive('achievementItem', achievementItem);

	achievementItem.$inject = [];
	function achievementItem() {
		var directive = {
				//bindToController: true,
				//controller: ControllerController,
				//controllerAs: 'vm',
				link: link,
				restrict: 'A',
				scope: {
				}
		};
		return directive;
		
		function link(scope, element, attrs) {
			angular.element(document).ready(function(){
				setTimeout(function(){
					drawRing(attrs.$$element.context);
				},1);
			});
		}

		function drawRing(el,radius,txt,pct,end){
			var ctx=el.getContext('2d');
			radius = radius || parseInt(el.getAttribute('data-radius')) || 50;
			pct = pct || parseInt(el.getAttribute('data-pct-start')) || 0;
			end = end || parseInt(el.getAttribute('data-pct-end')) || 0;
			txt = txt || el.getAttribute('data-show-text') || false;
			var r=radius*0.8,
					left=radius,
					top=radius*55/50,
					line_width=radius*3/50,
					tw=radius*35/50,th=radius*16/50,
					tx=left-r+radius*22/50,ty=top-r-th/2,
					tr=radius*2/50,
					box_line_width=radius*3/50,
					text=pct+'%',
					font_size=radius*12/50;
			ctx.clearRect(0,0,500,500);
			ctx.lineWidth = line_width;
			ctx.strokeStyle = '#CCE1EC';
			ctx.beginPath();
			ctx.arc(left, top, r,	0, 2 * Math.PI);//x,y ada di tengah lingkaran
			ctx.stroke();
			ctx.strokeStyle = '#49A8DC';
			ctx.beginPath();
			ctx.arc(left, top, r,	-0.5*Math.PI, ((pct/100)*2-0.5) * Math.PI);
			ctx.stroke();
			if(txt){
				ctx.save();
				ctx.beginPath();
				ctx.fillStyle = "white";
				ctx.lineWidth=box_line_width;
				ctx.moveTo(tx+tr, ty);//20,10 tx+tr,
				ctx.lineTo(tx+tw-tr, ty);//80,10
				ctx.quadraticCurveTo(tx+tw, ty, tx+tw, ty+tr);//90,10,90,20
				ctx.lineTo(tx+tw, ty+th-tr);//90,80
				ctx.quadraticCurveTo(tx+tw, ty+th, tx+tw-tr, ty+th);//90,90,80,90
				ctx.lineTo(tx+tr, ty+th);//20,90
				ctx.quadraticCurveTo(tx, ty+th, tx, ty+th-tr);//10,90,10,80
				ctx.lineTo(tx, ty+tr);//10,20
				ctx.quadraticCurveTo(tx, ty, tx+tr, ty);//10,10,20,10
				ctx.stroke();
				ctx.fill();
				ctx.restore();
				
				ctx.fillStyle = '#02679E';
				ctx.font = font_size+"px Arial";
				ctx.textAlign = "center";
				ctx.fillText(text,left,top-r+th/2-tr*2);
			}
			pct+=1;
			if(pct<=end){
				setTimeout(function(){drawRing(el,radius,txt,pct,end);},20);
			}
		}
		
	}
})();
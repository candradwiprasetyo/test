angular
	.module("CiayoParallax", [])
	.controller('ParallaxCtrl',function($scope,$element,$attrs,$transclude,$compile){
		var
			me=this,
			ar_img=[
				[10,0.99],//0
				[0,1],//1
				//[-50,1.06],//1
				[-200,1.23],//2
				//[-300,1.33],//3
				[-400,1.44],//3
				//[-500,1.56],//5
				[-600,1.75]//4
			],
			ready=false,
			pause=false,
			mouseOver=false,
			friction=0,
			$el=$element[0];
		me.width=436;me.height=312;
		me.out_width=512;me.out_height=375;
		me.style='';
		me.close_friction=20;	//friction saat mouse over, dan jaraknya kecil
		me.slow_friction=80;		// friction saat keluar dari layar (agar pelan)
		me.allowTilt	= false;
		me.mousePos	= {x : me.width / 2, y : me.height/2};//posisi kursor
		me.lastPos		= {x : me.width / 2, y : me.height/2};//posisi titik pusat
		me.accelPos	= {x : me.width / 2, y : me.height/2};//posisi accelerometer
		me.init=function (){
			if($attrs.plxId==undefined){
				console.error('ID kosong');return;
			}
			me.id=$attrs.plxId;
			//NOTE SEARCH ID from activity detail
			//FUTURE CHANGE WITH $GET
			angular.forEach($scope.activity_detail,function(value,key){
				if(value.activity_id==me.id){
					me.activity_detail=value;
				}
			});
			me.imgs=[];
			//NOTE get activity_layer
			var activity_layer=0;
			angular.forEach(me.activity_detail.image,function(lyr,index){
				if(lyr.type=='activity'){activity_layer=lyr.layer;}
			});
			//NOTE back hair
			var img = {
				x:me.out_width*parseInt(me.activity_detail.avatar_position.split(',')[0])/100,
				y:me.out_height*parseInt(me.activity_detail.avatar_position.split(',')[1])/100,
				width:me.out_width,height:me.out_height,
				rotation:me.activity_detail.avatar_rotation,
				layer:activity_layer,animation:0,z:ar_img[activity_layer][0]-1,
				scale:ar_img[activity_layer][1]*parseInt(me.activity_detail.avatar_size)/100,
				path:me.activity_detail.back_hair,text:'','font_size':10};
			img.style=getStyle(img);
			me.imgs.push(img);
			//NOTE loop layer
			angular.forEach(me.activity_detail.image,function(lyr,index){
				var img = {x:0,y:0,width:me.out_width,height:me.out_height,ax:1,ay:1,tmp:0,text:'',rotation:0,'font_size':10};
				img.layer=lyr.layer;
				img.path=lyr.url;
				img.z=ar_img[img.layer][0];
				img.scale=ar_img[img.layer][1];
				img.style=getStyle(img);
				me.imgs.push(img);
			});
			//NOTE head
			var img = {
				x:me.out_width*parseInt(me.activity_detail.avatar_position.split(',')[0])/100,
				y:me.out_height*parseInt(me.activity_detail.avatar_position.split(',')[1])/100,
				width:me.out_width,height:me.out_height,
				rotation:me.activity_detail.avatar_rotation,
				layer:activity_layer,animation:0,z:ar_img[activity_layer][0]+1,
				scale:ar_img[activity_layer][1]*parseInt(me.activity_detail.avatar_size)/100,
				path:me.activity_detail.avatar_url[1]['happy'],text:'','font_size':10};
			img.style=getStyle(img);
			me.imgs.push(img);
			//NOTE text
			var img = {
				x:me.out_width*parseInt(me.activity_detail.buble_text_position.split(',')[0])/100,
				y:me.out_height*parseInt(me.activity_detail.buble_text_position.split(',')[1])/100,
				width:parseInt(me.activity_detail.buble_text_width)/100*me.out_width,
				height:parseInt(me.activity_detail.buble_text_height)/100*me.out_height,
				z:ar_img[activity_layer][0]+1,
				rotation:0,
				layer:1,animation:0,z:1,
				scale:ar_img[1][1],
				path:'',text:me.activity_detail.buble_text};
			var length=img.text.length;if(length>50)length=50;
			img.font_size=19-length/5;
			img.style=getStyle(img);
			me.imgs.push(img);
			ready=true;
		}
		function run(){
			setTimeout(function(){render();},10);
		}
		function render(){
			if(!isInView()){onMouseLeave();return;}
			if(!ready){ return;}//kalau gambar belum di inisiasi semua -> do nothing
			//input
			var 
				curx=me.allowTilt?me.accelPos.x:me.mousePos.x,//ambil dari posisi accelerometer atau dari mouse
				cury=me.allowTilt?me.accelPos.y:me.mousePos.y,
			//selisih
				diffx=(me.lastPos.x-curx),
				diffy=(me.lastPos.y-cury),
				diffl=Math.sqrt(Math.pow(diffx,2)+Math.pow(diffy,2)),//jarak diagonal
				diffc=Math.sqrt(Math.pow(me.width,2)+Math.pow(me.height,2));//jarak diagonal layar
			//cek kalau masih jauh frictionnya besar, kalau udah deket jadi kecil
			//friction makin kecil kalau jaraknya kecil
			if(diffl<	me.close_friction){
				friction=me.close_friction;
			}else{
				friction=diffl/($scope.allowTilt?16:4);
			}
			me.lastPos.x-=diffx/friction;
			me.lastPos.y-=diffy/friction;
			if(me.allowTilt)me.lastPos=me.accelPos;
			var 
				ax=((me.lastPos.x/me.width)-0.5)*10,
				ay=-((me.lastPos.y/me.height)-0.5)*10;
			me.style=transform(ax,ay,0,0);
			$scope.$apply(function(){});
			if(!mouseOver){
				if(
					Math.round(me.lastPos.x)===Math.round(me.mousePos.x) && 
					Math.round(me.lastPos.y)===Math.round(me.mousePos.y)
				){
					me.lastPos={x:me.width/2,y:me.height/2};
					pause=true;
				}
			}
			if(!pause){run();}
		}

		function getStyle(img){
			var _return=
				'-webkit-transform: translate3d(0px,0px, '+img.z+'px) scale('+img.scale+', '+img.scale+') rotateZ('+img.rotation+'deg);'+
				'transform: translate3d(0px,0px, '+img.z+'px) scale('+img.scale+', '+img.scale+') rotateZ('+img.rotation+'deg);'+
				'left :'+(img.x-(me.out_width-me.width)/2)+'px;top:'+(img.y-(me.out_height-me.height)/2)+'px;'+
				'background-image: url('+img.path+');'+
				'width:'+img.width+'px;'+
				'height:'+img.height+'px;'+
				'font-size:'+img.font_size+'px;';
			return _return;
		}
		function isInView(){
			var
				act_x=($el.getBoundingClientRect().left),
				act_y=($el.getBoundingClientRect().top),
				win_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
				win_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			return (act_x>=0 && act_x+me.width<=win_w && act_y>=0 && act_y+me.height<=win_h);
		}
		function getPos($event){//fungsi untuk mengambil attribute x dan y dari event angular
			return {x:$event.offsetX,y:$event.offsetY};
		}
		function transform(rx,ry,tx,ty){
			var 
				out=
					'rotateY('+rx+'deg) rotateX('+ry+'deg) '+
					'translateY('+ty+'px) translateX('+tx+'px)',
					text =
			'-webkit-transform:'+out+';'+
			//'-moz-transform:'+out+';'+
			'transform:'+out+';';
			return text;
		}
		function onMouseEnter(){
			pause=false;mouseOver=true;
			friction=me.slow_friction;
			run();
		}
		function onMouseLeave(){
			mouseOver=false;
			friction=me.slow_friction;
			me.mousePos={x:me.width/2,y:me.height/2};
		}
		function onMouseMove($event){
			if(mouseOver===false){onMouseEnter();}
			me.mousePos=(getPos($event));
		}
		function onMouseUp(){
			if(isInView()){
				//if($scope.allowTilt)
				{
					if(pause==true){
						//pause=false;
						onMouseEnter();
					}else{
						pause=true;
					}
				}
			}
		}
		function onMouseDown(){}
		function handleOrientation(event) {
			var
				x = event.beta,
				y = event.gamma,
				batas=[20,25,65],
				orientation=window.orientation,//1^,2<,3|,4>
				diffx=0,diffy=0;
				me.allowTilt=(event.beta!=undefined);
			if(orientation===0){//0 normal [20 50][-15 15]
				x=x<batas[1]?batas[1]:x;
				x=x>batas[2]?batas[2]:x;
				y=y<-batas[0]?-batas[0]:y;
				y=y>batas[0]?batas[0]:y;
				diffx=x-(batas[2])+(batas[2]-batas[1])/2;diffy=y;
			}else
			if(orientation===90){//90 miring ke kiri [-15 15] [-50 -20]
				x=x<-batas[0]?-batas[0]:x;
				x=x>batas[0]?batas[0]:x;
				y=y<-batas[2]?-batas[2]:y;
				y=y>-batas[1]?-batas[1]:y;
				diffy=x;diffx=(y+((batas[2]-batas[1])/2+batas[1]))*-1;
			}else
			if(orientation===180){//180 dibalik [-50 -20] [15 -15]
				x=x<-batas[2]?-batas[2]:x;
				x=x>-batas[1]?-batas[1]:x;
				y=y<-batas[0]?-batas[0]:y;
				y=y>batas[0]?batas[0]:y;
				diffx=(x+((batas[2]-batas[1])/2+batas[1]))*-1;diffy=-y;
			}else
			if(orientation===-90){//-90 kanan [15 -15] [20 50]
				x=x<-batas[0]?-batas[0]:x;
				x=x>batas[0]?batas[0]:x;
				y=y<batas[1]?batas[1]:y;
				y=y>batas[2]?batas[2]:y;
				diffy=-x;diffx=y-((batas[2]-batas[1])/2+batas[1]);
			}
			me.accelPos.x=(diffy/40+0.5)*me.width;me.accelPos.y=(diffx/40+0.5)*me.height;
			//$scope.debug=diffy+' '+diffx;
			if(me.allowTilt && mouseOver===false){
				onMouseEnter();
			}
		}

		$element.bind('mouseenter',onMouseEnter);
		$element.bind('mouseleave', onMouseLeave);
		$element.bind('mousemove',onMouseMove);
		$element.bind('mouseup',onMouseUp);
		$element.bind('mousedown',onMouseDown);
		window.addEventListener('deviceorientation', handleOrientation);
		me.init();
	})
	.directive('parallax',function(){
		return {
			restrict: 'E',
			replace: true,
			controller:'ParallaxCtrl as plx',
			scope: true,
			template: 
			'<div class="parallax" style="width:{{plx.width}}px; height:{{plx.height}}px">' + 
				'<div class="parallax-wrapper" style="{{plx.style}};width:100%;height:100%;">' +
					'<div class="parallax-layer" ng-repeat="img in plx.imgs" style="{{img.style}}">{{img.text}}</div>' +
				'</div>' +
			'</div>'
		}
	});

(function() {
'use strict';

	angular
		.module('app')
		.factory('TourService', TourService);

	TourService.$inject = ['$cookieStore', 'CiayoService'];

	function TourService($cookieStore, CiayoService) {

		return {
		 	tourCreateAvatar:tourCreateAvatar,
		 	tourSearchActivity:tourSearchActivity,
		 	tourSelectActivity:tourSelectActivity,
		 	tourCreatePost:tourCreatePost
		}

		
		function initTour(page, step_information){
			

			if($cookieStore.get('end_tour_'+page)==true)
				return false;

			if ($.fn.itour) {

				$('body').itour({
					CSSClass:'anyClassName',				//Assign for tour a unique class name to change the display styles of the tour.
					startStep:1,							//Step from which the tour begins
					tourMapPos:'right',						//Tour Map Position 
					tourTitle:'Tour Title Default',			//Tour title
					tourMapVisible:false,					//Specifies to show or hide the map of the tour at the start of the tour
					spacing:5,								//Indent highlighting around the element
					overlayClickable:false,					//This parameter enables or disables the click event for overlying layer
					stepNumbersVisible:true,				//Shows the total number of steps and the current step number
					lang: {									//Default language settings
						cancelText:	'Cancel Tour',			//The text in the cancel tour button
						hideText: 'Hide Tour Map',			//The text in the hidden tour map button 
						tourMapText:'•••',					//The text in the show tour button
						tourMapTitle: 'Tour Map',			//Title of Tour map button
						nextTextDefault:'Next',				//The text in the Next Button
						prevTextDefault:'Prev',				//The text in the Prev Button
						endText:'End Tour'					//sets the text for the close button in the last step of the tour
					},
					steps:step_information,
					create: function(){},					//Triggered when the itour is created
					end: function(){ 
						$cookieStore.put('end_tour_'+page,true);
						if(page=='search_activity'){
							var c = {
								data: {
									type: 'desktop'
								}
							}
							CiayoService.Api('set/tutorial', c, function (response) {
								if (response.status == 200) {
									//callback(response);
								} else {
									//errCallback(response);
								}
							});
						}
					},						//Triggered when the tour came to the end, or was interrupted.
				});
			}
		}

		// Create Avatar
		function tourCreateAvatar(){


			var EN = {
			    "title1"           	: "Zoom In/Out", 
			    "content1"        	: "Use this for zoom in or zoom out your avatar", 
			    "title2"           	: "What You Have on Your Head", 
			    "content2"        	: "You can customize what you would look like inside Ciayo world", 
			    "title3"           	: "How You Look Like on Mirror?",
			    "content3"        	: "Use this carefully and maybe you can save you precious face forever", 
			    "title4"           	: "Should I Explain?",
			    "content4"        	: "If you donâ€™t know what is it, hurry up and go to meet your doctor !"
			}

			var ID = {
			    "title1"           	: "Perbesar/Perkecil",
			    "content1"        	: "Gunakan kaca pembesar untuk memperbesar atau memperkecil avatarmu",
			    "title2"           	: "Seperti apa bentuk wajahmu",
			    "content2"        	: "Kamu bisa menyesuaikan penampilanmu di dunia Ciayo",
			    "title3"           	: "Bagaimana penampilanmu terlihat di cermin?",
			    "content3"        	: "Gunakan fitur ini hati-hati dan mungkin kamu akan menyimpan wajah berhargamu selamanya",
			    "title4"           	: "Apa perlu penjelasan dariku?",
			    "content4"        	: "Jika kamu tidak tau apa ini, ayo tanyakan kami !"
			}

			var lang = ($cookieStore.get('language')==1) ? EN : ID;

			var step = [{
					image:'',							//Path to image file
					title:lang['title1'],				//Name of step
					content:lang['content1'],		//Description of step
					contentPosition:'rcc',				//Position of message
					name:'avatar-zoom',					//Unique Name (<div data-name="uniqueName"></div>) of highlighted element or .className (<div class="className"></div>) or #idValue (<div id="idValue"></div>)
					disable:false,						//Block access to element
					overlayOpacity:0.5,					//For each step, you can specify the different opacity values of the overlay layer.
					event:'next',						//An event that you need to do to go to the next step
					nextText:'Next',					//The text in the Next Button
					prevText:'Prev',					//The text in the Prev Button
					trigger:false,						//An event which is generated on the selected element, in the transition from step to step
					before:function(){},				//Triggered before the start of step
					during:function(){},				//Triggered after the onset of step
					after:function(){}					//Triggered After completion of the step, but before proceeding to the next
				},
				{
					title:lang['title2'],
					content:lang['content2'],
					contentPosition:'lcc',
					name:'select-element',
					event:'next',
					nextText:'Next',
					trigger:false
				},
				{
					title:lang['title3'],
					content:lang['content3'],
					contentPosition:'tlc',
					name:'select-element-type',
					event:'next',
					nextText:'Next',
					trigger:false
				},
				{
					title:lang['title4'],
					content:lang['content4'],
					contentPosition:'lcc',
					name:'select-variant-color',
					event:'next',
					nextText:'DONE',
					trigger:false,
					prevText:'',
				}];

			initTour('create_avatar',step);

		}


		// Search Activity
		function tourSearchActivity(){

			var EN = {
			    "title1"           	: "Search Activity",
			    "content1"        	: "Search what you are doing right now. Use keyword with ease",
			}

			var ID = {
			    "title1"           	: "Cari Activity",
			    "content1"        	: "Cari Activity yang Kamu lakukan saat ini. Tambahkan Keyword agar lebih mudah ditelusuri.",
			}

			var lang = ($cookieStore.get('language')==1) ? EN : ID;
			var step = [{
					image:'',							
					title:lang['title1'],				
					content:lang['content1'],		
					contentPosition:'rcc',				
					name:'.c-tml-lpct',					
					disable:false,						
					overlayOpacity:0.5,					
					event:'click',						
					nextText:'Next',					
					prevText:'Prev',					
					trigger:false,						
					before:function(){},				
					during:function(){},				
					after:function(){}			
				}];
			initTour('search_activity',step);
		}

		// Select Activity
		function tourSelectActivity(){
			
			return false;

			var EN = {
			    "title1"           	: "Choose Activity",
			    "content1"        	: "Choose this one please, hey câ€™mon just klik here",
			}

			var ID = {
			    "title1"           	: "Pilih Activity",
			    "content1"        	: "Pilih satu activity, ayo pilih disini",
			}

			var lang = ($cookieStore.get('language')==1) ? EN : ID;
			
			var step = [{
					image:'',							
					title:lang['title1'],				
					content:lang['content1'],		
					contentPosition:'rcc',				
					name:'search-activity',					
					disable:false,						
					overlayOpacity:0.5,					
					event:'next',						
					nextText:'Next',					
					prevText:'Prev',					
					trigger:false,						
					before:function(){},				
					during:function(){ 
						//$cookieStore.put('end_tour_select_activity',true)
					},				
					after:function(){}			
				}];

			initTour('select_activity', step);

			
		}

		//  Create Post
		function tourCreatePost(){

			//$('body').itour('destroy');
			//if($cookieStore.get('end_tour_create_post')==true)
			//	return false;

			var EN = {
			    "title1"           	: "Caption",
			    "content1"        	: "This word will appears on your post",
			    "title2"			: "Mood",
			    "content2"			: "How do you feel? Express your feeling now !",
			    "title3"			: "Add Item",
			    "content3"			: "Tell your friends,  Kasih tau teman Kamu Item apa aja yang lagi digunakan saat melakukan Activity ini.",
			    "title4"			: "Tag Friends",
			    "content4"			: "Kamu sedang melakukan Activity bersama teman? Tag mereka ya.",
			    "title5"			: "Place",
			    "content5"			: "Check-in lokasi kamu saat melakukan Activity ini.",
			    "title6"			: "Post",
			    "content6"			: "Kalo udah selesai, klik Post!",
			}

			var ID = {
			    "title1"           	: "Caption",
			    "content1"        	: "Kalimat ini akan muncul di postinganmu",
			    "title2"			: "Mood",
			    "content2"			: "Kasih tau mood kamu saat melakukan activity ini.",
			    "title3"			: "Tambah Item",
			    "content3"			: "Kasih tau teman kamu item apa aja yang lagi digunakan saat melakukan activity ini.",
			    "title4"			: "Tag Teman-Temanmu",
			    "content4"			: "Kamu sedang melakukan activity bersama teman? Tag mereka ya.",
			    "title5"			: "Place",
			    "content5"			: "Masukan lokasi kamu saat melakukan activity ini.",
			    "title6"			: "Post",
			    "content6"			: "Kalo udah selesai, klik post yuk!",
			}

			var lang = ($cookieStore.get('language')==1) ? EN : ID;
			
			var step = [{						
					title:lang['title1'],				
					content:lang['content1'],		
					contentPosition:'rcc',				
					name:'input-caption',					
					disable:true,						
					overlayOpacity:0.3,					
					event:'next',						
					nextText:'Next',					
					prevText:'Prev',					
					trigger:false								
				},
				{
					title:lang['title2'],
					content:lang['content2'],
					contentPosition:'rcc',
					name:'select-mood',
					disable:true,	
					event:'next',
					nextText:'Next',
					trigger:false
				},
				{
					title:lang['title3'],
					content:lang['content3'],
					contentPosition:'tcc',
					disable:true,	
					name:'item-0',
					event:'next',
					nextText:'Next',
					trigger:false
				},
				{
					title:lang['title4'],
					content:lang['content4'],
					contentPosition:'tcc',
					name:'with-user',
					disable:true,	
					event:'next',
					nextText:'Next',
					trigger:false,
					prevText:'',
				},
				{
					title:lang['title5'],
					content:lang['content5'],
					contentPosition:'tcc',
					name:'add-place',
					disable:true,	
					event:'next',
					nextText:'Next',
					trigger:false
				},
				{
					title:lang['title6'],
					content:lang['content6'],
					contentPosition:'tcc',
					name:'.post-btn',
					event:'next',
					nextText:'DONE',
					trigger:false,
					prevText:'',
					disable:true
				}];

			initTour('create_post', step);

			
		}


	}
})();






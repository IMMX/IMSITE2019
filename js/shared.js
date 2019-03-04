
var blockHeight = 650;
var scrollTimer;
var totalProjects = 0;
var currentProject = 0;

window.addEvent( 'domready' , function(event){


	developerFunctions();
	initSizes();
	initAnimations();
	scrollManager();
	swipeManager();


} ).addEvent( 'resize' , function(event){
	initSizes();
} );

function developerFunctions(){

	$$('.block').each( function(item){
		var bgR = '00' + Math.ceil(Math.random()*255).toString(16);
		var bgG = '00' + Math.ceil(Math.random()*255).toString(16);
		var bgB = '00' + Math.ceil(Math.random()*255).toString(16);
		item.setStyle( 'background-color' , '#' + bgR.substring( bgR.length - 2 ) + bgG.substring( bgG.length - 2 ) + bgB.substring( bgB.length - 2 ) );
	});

}


function initSizes(){

	$(document.body).setStyles({
		'width' : window.getSize().x,
		'height' : window.getSize().y
	});


	$('page-content').setStyles({
		'width' : window.getSize().x ,
		'padding-bottom' : ( window.getSize().y - blockHeight > 0 ? window.getSize().y - blockHeight : 0 )
	});



	$$('.project-container').setStyle(
		'width' , window.getSize().x
	);

	$$('.project').each( function(item, indexBlock){

		var clientBlocks = item.getElements('.block');

		item.setStyle( 'width' , window.getSize().x * clientBlocks.length );

		clientBlocks.each( function(itemBlock,indexBlock){

			itemBlock.setStyles({
				'width' : window.getSize().x,
				'left' : indexBlock * window.getSize().x
			});

		} );

	} );
	
	totalProjects = $$('.project').length - 1;


}

function initAnimations(){

	$$('.block').set( 'tween' , { duration: 500, transition: Fx.Transitions.Expo.easeInOut } );
	$$('.block').setStyle( 'opacity' , 0.3 );
	$$('.project')[0].getElements('.block').setStyle( 'opacity' , 1 );
	var scroll = new Fx.Scroll( window ).start( 0 , 0 );


}

function swipeManager(){

	$$('.block').addEvent( 'click' ,function(event){

		if( this.getParent('.project') != $$('.project')[currentProject] ){

				event.stop();

				if( $$('.project')[currentProject].getParent('.project-container').getScroll().x > 0 ){

					var scroll = new Fx.Scroll( $$('.project')[currentProject].getParent('.project-container') , {
						duration: 1500,
						wheelStops: false,
						transition: Fx.Transitions.Expo.easeInOut,
						onComplete: function( item ) {
							deActivateProject( $$('.project')[currentProject] , goToNextProject.bind( $$('.project')[currentProject]) );
						}
					} ).toLeft();

				} else {

						deActivateProject( $$('.project')[currentProject] , goToNextProject.bind( $$('.project')[currentProject]) );
				
				}

				return;

		}

		if( event.page.x >= window.getSize().x / 2){

			if( this.getNext() ){
	
				var newX = this.getNext().getStyle( 'left' ).toInt();
				var scroll = new Fx.Scroll( this.getParent('.project-container') , { duration: 700, wheelStops: false, transition: Fx.Transitions.Expo.easeInOut } ).start( newX , 0 );
	
			} else {
	

				var scroll = new Fx.Scroll( this.getParent('.project-container') , {
					duration: 1500,
					wheelStops: false,
					transition: Fx.Transitions.Expo.easeInOut,
					onComplete: function( item ) {
						deActivateProject( item.getFirst('.project') , goToNextProject.bind(item.getFirst('.project')) );
					}
				} ).toLeft();
	
			}

		} else {

			if( this.getPrevious() ){
	
				var newX = this.getPrevious().getStyle( 'left' ).toInt();
				var scroll = new Fx.Scroll( this.getParent('.project-container') , { duration: 700, wheelStops: false, transition: Fx.Transitions.Expo.easeInOut } ).start( newX , 0 );
	
			} else {
	
				deActivateProject( this.getParent('.project') , goToPreviousProject.bind(this.getParent('.project')) );
	
			}

		}

	} );

}

function deActivateProject( project , callback ){

	project.getElements('.block').tween( 'opacity' , 0.3 );

	callback && ( function(){ callback(); } ).delay( 500 );

}

function activateProject( project , callback ){

	project.getElements('.block').tween( 'opacity' , 1 );

	callback && ( function(){ callback(); } ).delay( 500 );

}


function goToNextProject(){

	var self = this;

	if( this.getParent('.project-container').getNext() ){

		var scroll = new Fx.Scroll( window , {
			duration: 600,
			wheelStops: false,
			transition: Fx.Transitions.Back.easeOut,
			onComplete: function(){
				$$('project-container').scrollTo( 0 , 0 );
				activateProject( self.getParent('.project-container').getNext() );
			}
		} ).start( 0 , window.getScroll().y + blockHeight );
		currentProject = self.getParent('.project-container').getAllPrevious().length;

	} else {

		var scroll = new Fx.Scroll( window , {
			duration: 1400,
			wheelStops: false,
			transition: Fx.Transitions.Back.easeOut,
			onComplete: function(){
				$$('project-container').scrollTo( 0 , 0 );
				activateProject( $$('.project-container')[0] );
			}
		} ).toTop();
		currentProject = 0;

	}

}

function goToPreviousProject(){

	var self = this;

	if( this.getParent('.project-container').getPrevious() ){

		var scroll = new Fx.Scroll( window , {
			duration: 600,
			wheelStops: false,
			transition: Fx.Transitions.Back.easeOut,
			onComplete: function(){
				$$('project-container').scrollTo( 0 , 0 );
				activateProject( self.getParent('.project-container').getPrevious() );
			}
		} ).start( 0 , window.getScroll().y - blockHeight );
		currentProject = self.getParent('.project-container').getAllPrevious().length;

	} else {

		var scroll = new Fx.Scroll( window , {
			duration: 1400,
			wheelStops: false,
			transition: Fx.Transitions.Back.easeOut,
			onComplete: function(){
				$$('project-container').scrollTo( 0 , 0 );
				activateProject( $$('.project-container')[totalProjects] );
			}
		} ).toBottom();
		currentProject = totalProjects;

	}

}

function scrollManager(){

	window.addEvent( 'scroll' , function(event){

		clearInterval( scrollTimer );
		scrollTimer = setTimeout( function(){

			if( currentProject != Math.round( window.getScroll().y / blockHeight ) ){

				var oldProject = currentProject;
				currentProject = Math.round( window.getScroll().y / blockHeight );
				deActivateProject( $$('.project')[oldProject] );

				if( $$('.project')[oldProject].getParent('.project-container').getScroll().x > 0 ){
					var scroll = new Fx.Scroll( $$('.project')[oldProject].getParent('.project-container') , {
						duration: 1500,
						wheelStops: false,
						transition: Fx.Transitions.Expo.easeInOut,
						onComplete: function( item ) {
							activateProject( $$('.project')[currentProject] );
						}
					} ).toLeft();
				} else {
					activateProject( $$('.project')[currentProject] );
				}

			}

			var scroll = new Fx.Scroll( window , { duration: 400, wheelStops: false, transition: Fx.Transitions.Back.easeOut } ).start( 0 , currentProject * blockHeight );
		
		} , 200 );
		
	} );

}










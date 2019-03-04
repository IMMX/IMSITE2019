var blockHeight = 650;
var totalProjects = 0;
var currentProject = 0;
var oldProject = 'firstTime';
var isAnimating = 0;
var timeOfActivate = 500;
var timeOfVerticalScroll = 400;


function scrollAnchor () {
	if (currentProject != Math.round(window.getScroll().y / blockHeight) || oldProject == 'firstTime') {

		oldProject = currentProject;
		currentProject = Math.min( Math.round( window.getScroll().y / blockHeight ) , totalProjects );
		deActivateProject($$('.project-container')[oldProject].getFirst());
		(function () { activateProject($$('.project-container')[currentProject]);}).delay(timeOfActivate);

	}
}
function deActivateProject( project , callback , outTime ){

	if( project.retrieve('indexProject') == totalProjects ){

		$$('#mailto, #mailbutton > h4, #wetweetwhat, #tweet p').tween(
			'color', '#383838'
		);

		isFooterActive = false;

		project.getParent().removeClass('current');
		project.getElements('.block').removeClass('prev');
		project.getElements('.nextblock').addClass('next');

		callback && ( function(){ callback(); } ).delay( outTime ? outTime : timeOfActivate );

		return;
	}

	project.getParent().removeClass('current');
	project.getElements('.block').removeClass('prev');
	project.getElements('.nextblock').addClass('next');

	callback && ( function(){ callback(); } ).delay( outTime ? outTime : timeOfActivate * 2 );

}

function activateProject( project , callback ){

	if( project.getFirst('.project').retrieve( 'indexProject' ) == totalProjects ){

		$$('#mailto, #mailbutton > h4').tween(
			'color', '#8b8b8b'
		);
		$$('#wetweetwhat, #tweet p').tween(
			'color', '#5a5a5a'
		);

		project.addClass('current');

		isFooterActive = true;

		return;

	}

	project.addClass('current');

	callback && ( function(){ callback(); } ).delay( timeOfActivate * 2 );

}

function initSizes () {
}
function initEvents () {
	$$('.project').each( function(item, indexProject){
		item.store('indexProject', indexProject);
	});

	$$('.block').addEvent('swipe', function (e) {

		if (this.getParent().retrieve('indexProject') != currentProject) return

		switch (e.direction) {
			case 'left':
				if (this.getNext())
				{
					this.addClass('prev').getNext().removeClass('next');
				}
				else
				{
					this.getParent().getElements('.block').removeClass('prev');
					this.getParent().getElements('.nextblock').addClass('next');
				}
				break;
			case 'right':
				if (this.getPrevious())
				{
					this.addClass('next').getPrevious().removeClass('prev');
				}
				break;
		}
	});
}

window.addEvents({
	domready: function () {
		totalProjects = $$('.project').length - 1;
		initSizes();
		initEvents();
	},
	scroll: scrollAnchor,
	load: scrollAnchor
});
var blockHeight = 650;
var scrollTimer;
var totalProjects = 0;
var currentProject = 0;
var oldProject = 0;
var totalBlocks = 0;
var currentBlock = 0;
var isAnimating = 0;
var isScrolling = false;
var secureDelay = 30;
var windowWidth = false;
var windowHeight = false;
var listenKey = '';
var isFooterActive = false;
var counterLoading = 0;
var loadingTimer;
var timerAutoSlide = false;
var loaderSpinner = false;
var toLoad = [];
var mouseTimeout;
var actualAnchor = '';

var timeOfActivate = 500;
var timeOfVerticalScroll = 400;

var newStyles = new Hash({
    'webkitTransform': 'rotate(@deg)',
    'MozTransform': 'rotate(@deg)'
});

var opts = { lines: 16, length: 0, width: 4, radius: 9, color: '#fff', speed: 1.0, trail: 100, shadow: false };

$extend(Element.Styles, newStyles);


window.addEvent('domready', function(event) {

    if (Browser.Platform.ios) {
        location.href = newFunction();
        return;
    }
    $('layer').setStyle('height', $('page-content').getSize().y + window.getSize().y);
    $(document.body).setStyles({ 'overflow-y': 'scroll', 'overflow-x': 'hidden' });
    $('page-content').setStyle('height', window.getSize().y);
    loadingTimer = setInterval(function() {
        counterLoading++;
        //$('loading').setStyle( 'background-position', 'center -' + 36 * ( counterLoading%7 ) + 'px' );
    }, 100);


    var firstLoad = new Element('div', { 'class': 'loading-claim', 'html': 'Interactive Agency<span></span>' }).set('tween', { duration: 400 }).set('morph', { duration: 400 }).setStyles({
        'z-index': 200,
        'position': 'fixed',
        'opacity': 0,
        'top': 110,
        'left': window.getSize().x / 2 - 150
    }).inject($(document.body)).morph({ 'opacity': 1, 'left': window.getSize().x / 2 - 180 });
    (function() {
        firstLoad.tween('left', window.getSize().x / 2 - 170);
        (function() {
            firstLoad.getFirst('span').fade('in');
            var secondLoad = new Element('div', { 'class': 'loading-claim', 'html': 'that creates great online brand experiences.' }).set('morph', { duration: 400 }).setStyles({
                'z-index': 200,
                'position': 'fixed',
                'opacity': 0,
                'top': 110,
                'left': window.getSize().x / 2 - 125
            }).inject($(document.body)).morph({ 'opacity': 1, 'left': window.getSize().x / 2 - 55 });
            (function() {}).delay(400);
        }).delay(100);
    }).delay(1000);


    var loadingLength = 0;
    var loadedImage = 0;

    $$('.loaded').each(function(item) {
        if (item.id != 'footer') {

            loadingLength++;

            new Element('img', { src: item.getStyle('background-image').replace('url(', '').replace(')', '').replace('"', '').replace("'", ''), 'style': 'display:none;' }).addEvent('load', function() {

                loadedImage++;
                (function() {
                    $('loadbar').setStyle('width', Math.round(85 * (loadedImage / loadingLength)));
                }).delay(50);
                this.destroy();


            }).inject($(document.body));

        }

    });




}).addEvent('load', function(event) {

    initSizes();
    scrollManager();
    swipeManager();
    initAnimations();


    clearInterval(loadingTimer);
    $('loading').destroy();
    (function() { $('loadbar').destroy(); }).delay(60);

    (function() {
        $('logo').getFirst().morph({
            'webkitTransform': [0, 0],
            'MozTransform': [0, 0]
        });
    }).delay(400);


    (function() {
        $$('.loading-claim').fade('out');
        $('logo').set('tween', {
            duration: 400,
            transition: Fx.Transitions.Expo.easeInOut,
            onComplete: function() {

                $('menu').tween('width', 334);
                $$('#menu a').each(function(item, index) {
                    (function() { item.fade('in'); }).delay(130 + index * 40);
                });
                $$('#menu a').each(function(item, index) {
                    (function() { item.fade('out'); }).delay(1000 + $$('#menu a').length - index * 40);
                });
                (function() {
                    $('menu').tween('width', 0);
                    $('page-content').setStyle('height', 'auto');
                }).delay(1000);
                (function() {
                    window.scrollTo(0, 0);
                    $('layer').set('tween', {
                        duration: 800,
                        transition: Fx.Transitions.Expo.easeInOut,
                        onComplete: function() {
                            var scroll = new Fx.Scroll($$('.project-container')[0], {
                                duration: 800,
                                wheelStops: false,
                                transition: Fx.Transitions.Expo.easeInOut,
                                onStart: function() {
                                    isAnimating += 1;
                                },
                                onComplete: function(item) {
                                    isAnimating -= 1;
                                    $$('#map > a').each(function(item, index) {
                                        (function() { item.setStyle('display', 'block'); }).delay(Math.random() * 1300)
                                    });

                                    var firstBlock = toLoad.shift();
                                    // loaderSpinner = new Spinner(opts).spin( $$('.block')[ firstBlock.retrieve( 'indexBlock' ) ] );
                                    firstBlock.set('src', firstBlock.retrieve('url'));

                                    setInterval(function() { checkHash(); }, 100);

                                }
                            }).toLeft();
                            $('layer').destroy();
                            $$('.loading-claim').destroy();

                        }
                    }).tween('top', window.getSize().y);
                }).delay(1200);

            }
        }).tween('margin-left', -450);
    }).delay(1200);



    $$('.project-container')[0].getElements('.block > .highlight > div > span').setStyle('opacity', 1);
    $$('.project-container')[0].getElements('.block > .highlight').setStyle('opacity', 1);
    $$('.project-container')[0].getElements('.block > .bollonzo').setStyle('top', 850);


    $$('.project-container')[0].scrollTo(window.getSize().x * 2, 0);

    new Element("script", { "type": "text/javascript", "async": true, "src": "http://twitter.com/status/user_timeline/insightmedia_mx.json?count=10&callback=twitterCallBack" }).inject($(document.head), "bottom");


}).addEvent('resize', function(event) {

    initSizes();

}).addEvent('orientationchange', function() {

    window.scrollTo(0, 0);

}).addEvent('touchstart', function() {

    if (Browser.Platform.ios) $('header').fade('out');

}).addEvent('touchend', function() {

    if (Browser.Platform.ios && !isScrolling) $('header').fade('in');

}).addEvent('keydown', function(event) {

    timerAutoSlide && clearInterval(timerAutoSlide);
    timerAutoSlide = false;

    if (event.key == 'right') {

        event.stop();
        if (isAnimating) return;

        if ($$('.block')[(currentBlock + 1) % totalBlocks].retrieve('indexProject') != currentProject)
            deActivateProject($$('.project')[currentProject], goToBlock((currentBlock + 1) % totalBlocks));
        else
            scrollToBlock($$('.block')[(currentBlock + 1) % totalBlocks]);

        return;

    } else if (event.key == 'left') {

        event.stop();
        if (currentBlock == 0 || isAnimating) return;

        if ($$('.block')[(totalBlocks + currentBlock - 1) % totalBlocks].retrieve('indexProject') != currentProject)
            deActivateProject($$('.project')[currentProject], function() { goToProject(currentProject - 1); });
        else
            scrollToBlock($$('.block')[(totalBlocks + currentBlock - 1) % totalBlocks]);

        return;
    } else if (event.key == 'up') {

        event.stop();
        if (currentProject == 0 || isAnimating) return;

        deActivateProject($$('.project')[currentProject], goToProject(currentProject - 1));

        return;

    } else if (event.key == 'down' || event.key == 'space') {

        event.stop();
        if (currentProject == totalProjects || isAnimating) return;

        deActivateProject($$('.project')[currentProject], goToProject(currentProject + 1));

        return;
    }




});

function newFunction() {
    return '/mobile.html'; //antes mobile.html
}

function checkHash() {

    if (location.hash != '' && actualAnchor != location.hash.substring(1)) {
        actualAnchor = location.hash.substring(1);
        anchor = $$('div[name="' + location.hash.substring(1) + '"]');
        if (anchor.length) {
            var scroll = new Fx.Scroll(window, {
                duration: 800,
                wheelStops: false,
                transition: Fx.Transitions.Expo.easeInOut,
                onStart: function() {
                    isAnimating += 1;
                },
                onComplete: function(item) {
                    isAnimating -= 1;
                }
            }).toElement(anchor[0]);
        }
    }

}

function twitterCallBack(data) {
    $$("p.tweet1").set('html', data[0].text.replace("/([\\n]+)/", "<br />").replace(
        /http:\/\/([^\s<>]*)/i, "<a href=\"http://$1\" target=\"_blank\">$1</a>"
    ).replace(
        /www\.([^\s<>]*)/i, "<a href=\"http://www.$1\" target=\"_blank\">$1</a>"
    ) + '<span>posted on ' + Date.parse(data[0].created_at).format("%m.%d.%Y") + '</span>');

    $$("p.tweet2").set('html', data[1].text.replace("/([\\n]+)/", "<br />").replace(
        /http:\/\/([^\s<>]*)/i, "<a href=\"http://$1\" target=\"_blank\">$1</a>"
    ).replace(
        /www\.([^\s<>]*)/i, "<a href=\"http://www.$1\" target=\"_blank\">$1</a>"
    ) + '<span>posted on ' + Date.parse(data[1].created_at).format("%m.%d.%Y") + '</span>');

    $$("p.tweet3").set('html', data[2].text.replace("/([\\n]+)/", "<br />").replace(
        /http:\/\/([^\s<>]*)/i, "<a href=\"http://$1\" target=\"_blank\">$1</a>"
    ).replace(
        /www\.([^\s<>]*)/i, "<a href=\"http://www.$1\" target=\"_blank\">$1</a>"
    ) + '<span>posted on ' + Date.parse(data[2].created_at).format("%m.%d.%Y") + '</span>');

};


function developerFunctions() {

}


function initSizes() {

     if( window.getSize().x <= 1140 )
     	$$('a.css_awards_light, a.css_awards_dark').setStyle('display','none');
     else
     	$$('a.css_awards_light, a.css_awards_dark').setStyle('display','block');

    $(document.body).setStyles({
        'width': window.getSize().x,
        'height': window.getSize().y
    });

    $('page-content').setStyles({
        'width': window.getSize().x
    });


    $$('.project-container').setStyle(
        'width', window.getSize().x
    );

    $('footer-container').setStyle(
        'height', Math.max(window.getSize().y, 1000)
    );

    if (windowWidth && window.getSize().x > 900)
        $$('.project-container')[currentProject].scrollTo(window.getSize().x / windowWidth * $$('.project-container')[currentProject].getScroll().x, 0);
    else if (windowWidth)
        $$('.project-container')[currentProject].scrollTo(0, 0);

    windowWidth = window.getSize().x;

    $$('.project').each(function(item, indexBlock) {

        var clientBlocks = item.getElements('.block');

        item.setStyle('width', window.getSize().x * clientBlocks.length);

        clientBlocks.each(function(itemBlock, indexBlock) {

            itemBlock.setStyles({
                'width': window.getSize().x + 1,
                'left': indexBlock * window.getSize().x
            });

        });

    });

    totalProjects = $$('.project').length - 1;
    totalBlocks = $$('.block').length;

}

function initAnimations() {


    $$('.block').each(function(item, index) {

        item.store('indexBlock', index);

        if (item.get('url')) {

            var IMG = new Element('img').store('indexBlock', index).store('url', item.get('url')).addEvent('load', function() {

                // loaderSpinner.stop();
                $$('.block')[IMG.retrieve('indexBlock')].fade('hide').addClass('loaded').fade('in');
                if (currentBlock == IMG.retrieve('indexBlock') && loaderSpinner) {
                    loaderSpinner.stop();
                    loaderSpinner = false;
                }
                $$('#map > a')[IMG.retrieve('indexBlock')].removeClass('loading');
                IMG.destroy();

                if (toLoad.length) {
                    (function() {
                        var loadingBlock = toLoad.shift();
                        loadingBlock.set('src', loadingBlock.retrieve('url'));
                    }).delay(100);
                }

            });
            toLoad.push(IMG);
        }

    });

    $$('.social').addEvent('click', function(event) {
        event.stop();
    });

    var mapWidth = 0;
    $$('.project').each(function(item, indexProject) {

        item.store('indexProject', indexProject);

        item.getElements('.block').each(function(item, indexBlock) {

            item.store('indexProject', indexProject);

            new Element('a', { href: '', rel: item.retrieve('indexBlock') }).store('link', indexBlock).setStyles({ 'top': indexProject * 10, 'left': indexBlock * 10, 'display': 'none' }).addEvent('click', function(event) {
                event.stop();
                if (isAnimating || this.hasClass('loading')) return;

                if (item.retrieve('indexProject') != currentProject)
                    deActivateProject($$('.project')[currentProject], goToBlock(item.retrieve('indexBlock')));
                else
                    scrollToBlock($$('.block')[item.retrieve('indexBlock')]);

            }).inject($('map'));

            if (indexBlock * 10 + 8 > mapWidth) mapWidth = indexBlock * 10 + 8;

        });

    });

    toLoad.each(function(item) {
        $$('a[rel="' + item.retrieve('indexBlock') + '"]').addClass('loading');
    });

    $$('#map > a')[0].addClass('active');
    $('map').setStyle('width', mapWidth);

    $$('.links > a').setStyle('opacity', .15).set('tween', { duration: 100 });
    $$('#mailbutton > *').set('tween', { duration: 100 });
    $$('.block > .highlight').setStyle('opacity', 0).set('tween', { duration: timeOfActivate });
    $$('.block > .bollonzo').set('tween', { duration: timeOfActivate, transition: Fx.Transitions.Expo.easeInOut });
    $$('.block > .bollonzo > div').set('morph', { duration: timeOfActivate / 2, transition: Fx.Transitions.Expo.easeInOut });
    if (!Browser.Platform.ios) {
        $$('.block > .bollonzo > div').set('morph', { duration: timeOfActivate / 2, transition: Fx.Transitions.Expo.easeInOut });
        $$('.block > .highlight > div > span').set('tween', { duration: timeOfActivate });
        $$('.block > .highlight > div > span').set('morph', { duration: timeOfActivate, transition: Fx.Transitions.Expo.easeInOut });
        $$('.block > .highlight > div > span').setStyle('opacity', 0);
    }


    if (Browser.Platform.ios) $('header').setStyle('position', 'absolute');


    $$('.data > span').set('morph', { duration: 500, transition: Fx.Transitions.Expo.easeInOut });

    $('mailbutton').addEvent('mouseenter', function() {

        if (isFooterActive) $$('#mailbutton > *').tween('color', '#ffffff');

    }).addEvent('mouseleave', function() {

        if (isFooterActive)
            $$('#mailbutton > *').tween('color', '#8b8b8b');
        else
            $$('#mailbutton > *').tween('color', '#383838');

    }).addEvent('click', function(event) {
        event.stop();
        location.href = 'mailto:equipo@insightmedia.com.mx?subject=Solicitud de Información';
    });

    $$('.links > a').addEvent('mouseenter', function() {

        this.tween('opacity', '1');

    }).addEvent('mouseleave', function() {

        this.tween('opacity', '.15');

    })

    $$('#menu > a > div').set('tween', { duration: 100 });
    $$('.who').addEvent('click', function(event) {

        event.stop();
        if (isAnimating) return;

        if (totalProjects - 1 != currentProject) {
            deActivateProject($$('.project')[currentProject], function() { goToProject(totalProjects - 1, 1500); });
            $('menu').tween('width', 0);
            Element.disableCustomEvents();

            (function() {
                Element.enableCustomEvents();
            }).delay(1500);
        }

        return;

    });

    $$('.contact').addEvent('click', function(event) {

        event.stop();

        deActivateProject($$('.project')[currentProject], function() { goToProject(totalProjects, 1500); });
        $('menu').tween('width', 0);
        Element.disableCustomEvents();

        (function() {
            Element.enableCustomEvents();
        }).delay(1500);


    });

    $$('.reels').addEvent('click', function(event) {

        event.stop();

        window.location = "https://insightmedia.com.mx/reels";

    });

    $('menu').set('tween', { duration: 150, transition: Fx.Transitions.Expo.easeInOut }).setStyle('width', 0);
    $$('#menu > *').set('tween', { duration: 150, transition: Fx.Transitions.Expo.easeInOut }).setStyle('opacity', 0);

    $$('#logo > div').set('morph', { duration: 400, transition: Fx.Transitions.Expo.easeInOut }).set('tween', { duration: 400, transition: Fx.Transitions.Expo.easeInOut });
    $('logo').addEvent('click', function(event) {

        if (Browser.Platform.ios) return;

        if (timerAutoSlide) {
            clearInterval(timerAutoSlide);
            timerAutoSlide = false;
        } else {
            autoSlide();
            timerAutoSlide = setInterval(function() { autoSlide(); }, 3000);
        }
        playPauseButton();

    });

    $$('#logo, #menu').addEvent('mouseenter', function() {

        if (isFooterActive) return;

        typeof(menuTimer) != "undefined" && clearInterval(menuTimer);

        $('menu').tween('width', 334);
        $$('#menu > *').each(function(item, index) {
            (function() { item.fade('in'); }).delay(130 + index * 70);

        });

    }).addEvent('mouseleave', function() {

        typeof(menuTimer) != "undefined" && clearInterval(menuTimer);

        menuTimer = setTimeout(function() {
            $$('#menu > *').each(function(item, index) {
                (function() { item.fade('out'); }).delay($$('#menu > *').length - index * 40);
            });
            (function() { $('menu').tween('width', 0); }).delay(200);
        }, 200);



    });

    $('logo').addEvent('mouseenter', playPauseButton.bind(this)).addEvent('mouseleave', function() { $$('#logo > div > div').fade('hide'); });
    new Element('img').set('src', '../images/pause.png');

}

function playPauseButton() {

    if (timerAutoSlide)
        var icon = 'pause';
    else
        var icon = 'play';

    $$('#logo > div > div').setStyle("background-image", "url(../images/" + icon + ".png)").fade('show');

}

function swipeManager() {


    $$('.block').addEvent('click', function(event) {

        timerAutoSlide && clearInterval(timerAutoSlide);
        timerAutoSlide = false;

        if (isScrolling || isFooterActive) return;

        var newProject = this;

        if (this.getParent('.project') != $$('.project')[currentProject]) {

            event.stop();

            if ($$('.project')[currentProject].getParent('.project-container').getScroll().x > 0) {

                var scroll = new Fx.Scroll($$('.project')[currentProject].getParent('.project-container'), {
                    duration: 1500,
                    wheelStops: false,
                    transition: Fx.Transitions.Expo.easeInOut,
                    onStart: function() {
                        isAnimating += 1;
                    },
                    onComplete: function(item) {
                        deActivateProject($$('.project')[currentProject], function() { goToProject(newProject.getParent('.project').retrieve('indexProject')); });
                        isAnimating -= 1;
                    }
                }).toLeft();

            } else {

                deActivateProject($$('.project')[currentProject], function() { goToProject(newProject.getParent('.project').retrieve('indexProject')); });

            }

            return;

        }

        if (Browser.Platform.ios) return;

        if (event.page.x >= window.getSize().x / 2 || currentBlock == 0) {

            if (this.getNext()) {

                scrollToBlock(this.getNext());

            } else {


                if (this.getParent('.project-container').getScroll().x > 0) {

                    var scroll = new Fx.Scroll(this.getParent('.project-container'), {
                        duration: 1500,
                        wheelStops: false,
                        transition: Fx.Transitions.Expo.easeInOut,
                        onStart: function() {
                            isAnimating += 1;
                        },
                        onComplete: function(item) {

                            if (item.getNext('.project-container')) {

                                deActivateProject(item.getFirst('.project'), function() { goToProject(item.getFirst('.project').retrieve('indexProject') + 1); });

                            } else {

                                deActivateProject(item.getFirst('.project'), function() { goToProject(0, 1500); });

                            }
                            isAnimating -= 1;
                        }
                    }).toLeft();

                } else {

                    var item = this.getParent('.project-container');

                    if (item.getNext('.project-container')) {

                        deActivateProject(item.getFirst('.project'), function() { goToProject(item.getFirst('.project').retrieve('indexProject') + 1); });

                    } else {

                        deActivateProject(item.getFirst('.project'), function() { goToProject(0, 1500); });

                    }

                }

            }

        } else {

            if (this.getPrevious()) {

                scrollToBlock(this.getPrevious());

            } else {

                if (this.getParent('.project-container').getPrevious('.project-container')) {

                    newProject = this;

                    deActivateProject(this.getParent('.project'), function() { goToProject(newProject.getParent('.project').retrieve('indexProject') - 1); });

                }

            }

        }

    });

}

function deActivateProject(project, callback, outTime) {

    $('map').fade('out');

    if (project.retrieve('indexProject') == totalProjects) {

        (function() {
            $$('.data > span').morph({
                'padding-left': 70,
                'color': '#383838'
            });
            $('header').setStyle('z-index', 10);
        }).delay(timeOfActivate);

        $$('#mailto, #mailbutton > h4, #wetweetwhat, #tweet p').tween(
            'color', '#383838'
        );

        isFooterActive = false;

        (function() { project.getElements('.block > .bollonzo').setStyle('right', 850); }).delay(timeOfActivate * 2);

        callback && (function() { callback(); }).delay(outTime ? outTime : timeOfActivate);

        return;



    }

    if (Browser.Platform.ios) {

        project.getElements('.block > .highlight').tween('opacity', 0);

    } else {

        var total = project.getElements('.block > .highlight > div > span').length;

        project.getElements('.block > .highlight > div > span').each(function(item, index) {

            (function() { item.morph({ 'opacity': 0, 'margin-top': [0, -10] }); }).delay(timeOfActivate + index * 100);

        });

        project.getElements('.block > .highlight').tween('opacity', 0);

        project.getElements('.block > .bollonzo > div').setStyles({
            'webkitTransform': 0,
            'MozTransform': 0
        });


    }

    (function() { project.getElements('.block > .bollonzo').setStyle('right', 0); }).delay(timeOfActivate * 2);

    callback && (function() { callback(); }).delay(outTime ? outTime : timeOfActivate * 2);

}

function activateProject(project, callback) {

    currentBlock = project.getElements('.block')[0].retrieve('indexBlock');
    var animationIn = project.getElements('.block')[0].get('animation-in');
    if (animationIn) eval(animationIn)();
    else enterBlockDefault();
    actualAnchor = project.get('name');
    location.hash = '#' + actualAnchor;

    $$('#map > a.active').removeClass('active') && $$('a[rel=' + currentBlock + ']').addClass('active');

    $('map').setStyle('top', project.getFirst('.project').retrieve('indexProject') * blockHeight + 20).fade('in');

    if (project.getFirst('.project').retrieve('indexProject') == totalProjects) {

        $('menu').setStyle('width', 0);
        $$('#menu > a').setStyle('opacity', 0);

        $$('.data > span').morph({
            'padding-left': 100,
            'color': '#8a8a8a'
        });

        (function() { $('header').setStyle('z-index', 200); }).delay(300);

        $$('#mailto, #mailbutton > h4').tween(
            'color', '#8b8b8b'
        );
        $$('#wetweetwhat, #tweet p').tween(
            'color', '#5a5a5a'
        );


        isFooterActive = true;

        return;

    }

    if (Browser.Platform.ios) {

        project.getElements('.block > .highlight').tween('opacity', 1);

    } else {

        var total = project.getElements('.block > .highlight > div > span').length;
        project.getElements('.block > .highlight > div > span').each(function(item, index) {

            (function() { item.morph({ 'opacity': 1, 'margin-top': [-10, 0] }); }).delay(timeOfActivate + 300 + index * 100);

        });
        project.getElements('.block > .highlight').tween('opacity', 1);

        (function() {

            project.getElements('.block > .bollonzo > div').morph({
                'webkitTransform': [0, 0],
                'MozTransform': [0, 0]
            });

        }).delay(timeOfActivate);

    }

    (function() {

        project.getElements('.block > .bollonzo').tween('right', -1200);

    }).delay(timeOfActivate);

    if (Browser.Platform.ios) $('header').setStyle('top', window.getScroll().y).fade('in');


    callback && (function() { callback(); }).delay(timeOfActivate * 2);

}

function goToProject(project, timeOfTransition) {

    isScrolling = true;
    var scroll = new Fx.Scroll(window, {
        duration: (timeOfTransition ? timeOfTransition : 700),
        wheelStops: false,
        transition: Fx.Transitions.Expo.easeInOut,
        onStart: function() {
            isAnimating += 1;
        },
        onComplete: function() {
            $$('.project-container').scrollTo(0, 0);
            activateProject($$('.project')[project].getParent('.project-container'));
            (function() {
                isAnimating -= 1;
                isScrolling = false;
            }).delay(secureDelay);
        }
    }).toElement($$('.project')[project].getParent('.project-container'));
    currentProject = project;

}


function goToBlock(block, timeOfTransition) {

    isScrolling = true;
    var scroll = new Fx.Scroll(window, {
        duration: (timeOfTransition ? timeOfTransition : 700),
        wheelStops: false,
        transition: Fx.Transitions.Expo.easeInOut,
        onStart: function() {
            isAnimating += 1;
        },
        onComplete: function() {
            $$('.project-container').scrollTo(0, 0);
            activateProject($$('.block')[block].getParent('.project-container'), scrollToBlock($$('.block')[block]));
            (function() {
                isAnimating -= 1;
                isScrolling = false;
            }).delay(secureDelay);
        }
    }).toElement($$('.block')[block].getParent('.project-container'));
    currentProject = $$('.block')[block].retrieve('indexProject');

}

function scrollToBlock(block) {

    if (!block) block = this;

    var scroll = new Fx.Scroll($$('.project-container')[currentProject], {
        duration: 700,
        wheelStops: false,
        transition: Fx.Transitions.Expo.easeInOut,
        onStart: function() {
            // isAnimating += 1;
        },
        onComplete: function() {

            // isAnimating -= 1;
            currentBlock = block.retrieve('indexBlock');
            var animationIn = block.get('animation-in');
            if (animationIn) eval(animationIn)();
            else enterBlockDefault();
            $$('#map > a.active').removeClass('active') && $$('a[rel=' + currentBlock + ']').addClass('active');
            if (timerAutoSlide) {
                (function() { if (timerAutoSlide) $$('a[rel=' + (currentBlock + 1) + ']').addClass('active'); }).delay(900);
                (function() { $$('a[rel=' + (currentBlock + 1) + ']').removeClass('active'); }).delay(1200);
                (function() { if (timerAutoSlide) $$('a[rel=' + (currentBlock + 1) + ']').addClass('active'); }).delay(1500);
                (function() { $$('a[rel=' + (currentBlock + 1) + ']').removeClass('active'); }).delay(1800);
                (function() { if (timerAutoSlide) $$('a[rel=' + (currentBlock + 1) + ']').addClass('active'); }).delay(2100);
            }

        }
    }).toElement(block);

}

function spinner(object) {

    loaderSpinner && loaderSpinner.stop();
    loaderSpinner = new Spinner(opts).spin(object);

}

var enterBlockDefault = function() {
    if ($$('.block')[currentBlock].hasClass('dark')) {
        $('map').addClass('dark');
        // $$('a.css_awards_light').fade('out');
    } else {
        $('map').removeClass('dark');
        // $$('a.css_awards_light').fade('in');
    }
    if (!$$('.block')[currentBlock].hasClass('loaded')) spinner($$('.block')[currentBlock]);
}

var enterStaff = function() {
    enterBlockDefault();
}



function autoSlide() {

    if (isAnimating) {
        timerAutoSlide && clearInterval(timerAutoSlide);
        timerAutoSlide = false;
        return;
    }

    if ($$('.block')[(currentBlock + 1) % totalBlocks].retrieve('indexProject') != currentProject)
        deActivateProject($$('.project')[currentProject], goToBlock((currentBlock + 1) % totalBlocks));
    else
        scrollToBlock($$('.block')[(currentBlock + 1) % totalBlocks]);

    return;


}

function scrollAnchor() {

    if (currentProject != Math.round(window.getScroll().y / blockHeight)) {

        var oldProjectTemp = currentProject;
        var currentProjectTemp = Math.min(Math.round(window.getScroll().y / blockHeight), totalProjects);

        var scroll = new Fx.Scroll(window, {
            duration: timeOfVerticalScroll,
            transition: Fx.Transitions.Back.easeInOut,
            onStart: function() {
                isAnimating += 10;
            },
            onComplete: function() {

                oldProject = currentProject;
                currentProject = Math.min(Math.round(window.getScroll().y / blockHeight), totalProjects);


                if (oldProject < currentProject || oldProject > currentProject + 1) {

                    isFooterActive = false;
                    $$('.project-container')[oldProject].getElements('.block  > .highlight').setStyle('opacity', 0);
                    $$('.project-container')[oldProject].getElements('.block  > .bollonzo').setStyle('top', 0);
                    $$('.project-container')[oldProject].getElements('.block > .bollonzo > div').setStyles({
                        'webkitTransform': 0,
                        'MozTransform': 0
                    });
                    $$('.project-container').scrollTo(0, 0);
                    $$('.project-container')[oldProject].getElements('.block > .highlight > div > span').setStyles({ 'opacity': 0, 'margin-top': -10 });
                    $$('.data > span').setStyles({ 'padding-left': 70, 'color': '#383838' });
                    $('header').setStyle('z-index', 10);
                    $$('#mailto, #mailbutton > h4, #wetweetwhat, #tweet p').setStyle('color', '#383838');
                    activateProject($$('.project-container')[currentProject]);


                } else {

                    if ($$('.project-container')[oldProject].getScroll().x > 0) {
                        var scroll = new Fx.Scroll($$('.project-container')[oldProject], {
                            duration: 1500,
                            wheelStops: false,
                            transition: Fx.Transitions.Expo.easeInOut,
                            onStart: function() {
                                isAnimating += 1;
                            },
                            onComplete: function(item) {

                                deActivateProject($$('.project-container')[oldProject].getFirst());
                                (function() { activateProject($$('.project-container')[currentProject]); }).delay(timeOfActivate);

                                isAnimating -= 1;

                            }
                        }).toLeft();
                    } else {
                        deActivateProject($$('.project-container')[oldProject].getFirst());
                        (function() { activateProject($$('.project-container')[currentProject]); }).delay(timeOfActivate);

                    }

                }

                (function() {
                    isAnimating -= 10;
                    isScrolling = false;
                }).delay(secureDelay);


            }
        }).addEvent('cancel', function() {

            isAnimating -= 10;
            isScrolling = false;
            window.fireEvent('scroll');

        }).start(0, currentProjectTemp * blockHeight);


    } else if (currentProject != window.getScroll().y / blockHeight) {

        var scroll = new Fx.Scroll(window, {
            duration: timeOfVerticalScroll,
            transition: Fx.Transitions.Back.easeInOut,
            onStart: function() {
                isAnimating += 10;
            },
            onComplete: function() {

                (function() {
                    isAnimating -= 10;
                    isScrolling = false;
                }).delay(secureDelay);
                if (Browser.Platform.ios) $('header').setStyle('top', window.getScroll().y).fade('in');


            }
        }).addEvent('cancel', function() {

            isAnimating -= 10
            isScrolling = false;
            window.fireEvent('scroll');

        }).start(0, currentProject * blockHeight);

    } else {

        (function() {
            isScrolling = false;
        }).delay(secureDelay);

    }


}

function scrollManager() {

    window.addEvent('scroll', function(event) {

        if (isScrolling || window.getScroll().y > blockHeight * (totalProjects) + 70 && isFooterActive) return;

        clearInterval(scrollTimer);
        scrollTimer = setTimeout(function() {

            isScrolling = true;

            scrollAnchor();

        }, 250);

    });

}
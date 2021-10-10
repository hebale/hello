/*
    2021/08/22 hebale common code
    vanila script
*/

/* Global Variable */
// var breakPoint      =       1280;


(function(_window){
    var _view = {
        init : function(){
            if(checkMobile()){
                document.getElementsByTagName('body')[0].classList.add('mobile')
            }else{
                document.getElementsByTagName('body')[0].classList.add('pc')
            }
        }
    };

    var _layout = {
        init        : function(){
            _layout.gnb();
            _layout.lnb();
            _layout.dim();
            _layout.popup();
        },

        update      : function(){},
        gnb         : function(){},
        lnb         : function(){},
        dim         : function(){},
        popup       : function(){},
        overflow    : function(){},
    };

    var _ui = {
        init        : function(){
            _ui.input();
            _ui.select();
            _ui.table();
            _ui.tab();
            _ui.switch();
            _ui.accordion();
            _ui.tree();
            _ui.tooltip();
            _ui.floating();
            _ui.sticky();
        },
        update      : function(param){
            // if( param == undefined ){
            //     _ui.init();
            // }else{
            //     // 개별업데이트기능 추가예정
            // }
        },

        /* component */
        input       : function(){},
        select      : function(){},
        table       : function(){},

        /* interface */
        tab         : function(target, callback){
            var _uiTab = target === undefined ? 'uiTab' : target;

            _uiTab = document.getElementsByClassName(_uiTab);

            for( var ui = 0; ui < _uiTab.length; ui++ ){
                if( _uiTab[ui].className.indexOf('uiInit') > -1 ) continue;
                _uiTab[ui].className = _uiTab[ui].className + ' uiInit';
            }
        },
        switch      : function(){},
        accordion   : function(){},
        tree        : function(){},
        tooltip     : function(){},
        floating    : function(){},
        sticky      : function(){},
    };










    /* UI PLUGIN LIST */
    var _pi = {

        /* ZIPPER */
        zipper : function(target, option){
            if(target === undefined) console.warn('Selector is not defined'); // add selector checklist

            var pluginName = 'zip-wrap';

            /* DEFAULT OPTION */
            var o = {
                target : null, // temp check target
                container : document.getElementsByTagName('body')[0],
                handler : null,
                coverFirst : null,
                coverSecond : null,
                startY : null,
                startX : null,
                pageY : null,
                pageX : null,
                moveValue : 0,
                divide: 0.5,
                progress : 0,
                axis : 'y',
                overflow : true,
                gap : {y : 0, x : 0},
                position: {top : 0, left : 0},
                offset : {top : 0, left : 0},
                limit : {y : 0, x : 0},
                on : {
                    init : null,
                    drag : null,
                },
            };

            /* OPTION MERGE */
            for( var i in Object.keys(o)){
                o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
            }

            /* OPTION INIT */
            o.container.classList.add(pluginName);
            if(o.handler === null) return console.warn( 'Handler is nessesary' );
            if(typeof o.on.init === 'function') o.on.init( o );
            if(getComputedStyle(o.container).position === 'static') o.container.style.position = 'relative';
            if(o.coverFirst === null){
                var coverFirstDom = document.createElement('div');
                o.axis === 'y' ? coverFirstDom.classList.add('zip-cover-left') : coverFirstDom.classList.add('zip-cover-top');
                o.coverFirst = coverFirstDom;
                o.container.append(coverFirstDom);
            }
            if(o.coverSecond === null){
                var coverSecondDom = document.createElement('div');
                o.axis === 'y' ? coverSecondDom.classList.add('zip-cover-right') : coverSecondDom.classList.add('zip-cover-bottom');
                o.coverSecond = coverSecondDom;
                o.container.append(coverSecondDom);
            }

            /* ADD EVENT */
            ['mousedown', 'touchstart'].forEach(function(event){
                o.handler.addEventListener(event, function(e){
                    if(e.type === 'touchstart'){
                        o.startY = e.touches[0].pageY;
                        o.startX = e.touches[0].pageX;
                        o.container.addEventListener('touchmove', zipFunc);
                    }else{
                        o.startY = e.pageY;
                        o.startX = e.pageX;
                        o.container.addEventListener('mousemove', zipFunc);
                    }
                });
            });

            /* REMOVE EVENT */
            ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function(event){
                o.container.addEventListener(event, function(e){
                    o.container.removeEventListener('touchmove', zipFunc);
                    o.container.removeEventListener('mousemove', zipFunc);
                    o.position = {
                        top : o.handler.offsetTop,
                        left : o.handler.offsetLeft
                    };
                });
            });

            /* RESIZE EVENT */
            window.addEventListener('resize', updateFunc);

            /* EVENT FUNCTION */
            function zipFunc(e){
                var _pageY = e.type === 'touchmove' ? e.touches[0].pageY : e.pageY,
                    _pageX = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;

                if(o.pageY === null) o.pageY = _pageY;
                if(o.pageX === null) o.pageX = _pageX;

                o.gap['y'] = o.startY - _pageY;
                o.gap['x'] = o.startX - _pageX;
                o.pageY = _pageY;
                o.pageX = _pageX;
                o.offset = {
                    top : o.handler.getBoundingClientRect().top + o.handler.offsetHeight / 2,
                    left : o.handler.getBoundingClientRect().left + o.handler.offsetWidth / 2
                };
                o.limit = {
                    y : o.container.offsetHeight - o.handler.offsetHeight,
                    x : o.container.offsetWidth - o.handler.offsetWidth
                };

                updateFunc();
                if(typeof o.on.drag === 'function') o.on.drag( o );
            }

            /* UPDATE FUNCTION */
            function updateFunc(option){
                var handleCss = getComputedStyle(o.handler),
                    type = Object.keys(o.position)[Object.keys(o.limit).indexOf(o.axis)],
                    marginType = 'margin' + type.replace(type.substr(0, 1), type.substr(0,1).toUpperCase() );

                if(o.overflow){
                    o.moveValue = Math.min(Math.max((o.position[type] - o.gap[o.axis] + (-1 * parseInt(handleCss[marginType]))), -1 * parseInt(handleCss[marginType])), (o.limit[o.axis] +  -1 * parseInt(handleCss[marginType])));
                }else {
                    o.moveValue = (o.position[type] - o.gap[o.axis]);
                }
                o.progress = o.moveValue / o.limit[o.axis]

                /* OPTION MERGE */
                if(option !== undefined) {
                    for (var i in Object.keys(o)) {
                        o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
                    }
                }

                o.handler.style[type] = o.moveValue + 'px';
                o.coverFirst.style['borderRadius'] = (o.progress * 100).toFixed(2) + '% 10px 10px 0 / ' + (o.progress * 100).toFixed(2) + '% 10px 10px 0';
                o.coverSecond.style['borderRadius'] = (o.progress * 100).toFixed(2) + '% 10px 10px 0 / ' + (o.progress * 100).toFixed(2) + '% 10px 10px 0';
            }

            /* METHOD VAR */
            var method = {
                update : function(option){
                    o.gap = { y : 0, x : 0 };
                    o.limit = { y : o.container.offsetHeight - o.handler.offsetHeight, x : o.container.offsetWidth - o.handler.offsetWidth };
                    if(option !== undefined){
                        if(option.progress !== undefined) o.position.top = o.container.offsetHeight * option.progress;
                        if(option.progress !== undefined) o.position.left = o.container.offsetWidth * option.progress;
                    };
                    updateFunc(option);
                },
                destroy : function(){
                    window.removeEventListener('resize', updateFunc);
                },
            }

            return method;
        },













        /* WHEEL */
        wheel : function(target, option){
            var pluginName = 'wheel-wrap';

            /* DEFAULT OPTION */
            var o = {
                target : null, // temp check target
                container : document.getElementsByTagName('body')[0],
                startY : null,
                startX : null,
                pageY : null,
                pageX : null,
                degree : 0,
                counting : 0,
                quadrant : 0,
                gap : {y : 0, x : 0},
                direction : ["",""],
                on : {
                    init : null,
                    dragStart : null,
                    drag : null,
                    stop : null,
                    update : null,
                },
            };

            /* OPTION MERGE */
            for( var i in Object.keys(o)){
                o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
            }

            /* OPTION INIT */
            if(o.target === null) return console.warn('Selector is not defined'); // add selector checklist
            o.container.classList.add(pluginName);
            if(typeof o.on.init === 'function') o.on.init(o);

            /* ADD EVENT */
            ['mousedown', 'touchstart'].forEach(function(event){
                o.target.addEventListener(event, function(e){
                    if(typeof o.on.dragStart === 'function') o.on.dragStart(o);
                    if(e.type === 'touchstart'){
                        o.startY = e.touches[0].pageY;
                        o.startX = e.touches[0].pageX;
                        o.container.addEventListener('touchmove', wheelFunc);
                    }else{
                        o.startY = e.pageY;
                        o.startX = e.pageX;
                        o.container.addEventListener('mousemove', wheelFunc);
                    }
                });
            });

            /* REMOVE EVENT */
            ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function(event){
                o.container.addEventListener(event, function(){
                    o.container.removeEventListener('touchmove', wheelFunc);
                    o.container.removeEventListener('mousemove', wheelFunc);
               });
            });

            /* EVENT FUNCTION */
            function wheelFunc(e){
                if(o.container.classList.value.indexOf('active') === -1  ) return;
                var _pageY = e.type === 'touchmove' ? e.touches[0].pageY : e.pageY,
                    _pageX = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;

                if(o.pageY === null) o.pageY = _pageY;
                if(o.pageX === null) o.pageX = _pageX;

                if(_pageY !== o.pageY){_pageY < o.pageY ? o.direction[0] = 'top' : o.direction[0] = 'bottom';
                }else{ o.direction[0] = ''; }
                if(_pageX !== o.pageX) { _pageY < o.pageX ? o.direction[1] = 'left' : o.direction[1] = 'right';
                }else{ o.direction[1] = ''; }

                o.gap['y'] = o.startY - _pageY;
                o.gap['x'] = _pageX - o.startX;
                o.pageY = _pageY;
                o.pageX = _pageX;

                var calcY = (o.target.getBoundingClientRect().top + o.target.offsetHeight / 2) - _pageY,
                    calcX = (o.target.getBoundingClientRect().left + o.target.offsetWidth / 2) - _pageX;

                /* QUADRANT & DEGREE CHECK */
                if(calcY > 0 && calcX < 0){
                    if( o.quadrant === 2) o.counting++;
                    o.quadrant = 1;
                    o.degree = Math.abs(Math.atan2(calcX,calcY) * 180 / Math.PI );
                }
                if(calcY < 0 && calcX < 0){
                    o.quadrant = 4;
                    o.degree = Math.abs(Math.atan2(calcX,calcY) * 180 / Math.PI );
                }
                if(calcY < 0 && calcX > 0){
                    o.quadrant = 3;
                    o.degree = 360 - Math.abs(Math.atan2(calcX,calcY) * 180 / Math.PI );
                }
                if(calcY > 0 && calcX > 0){
                    if( o.quadrant === 0 || o.quadrant === 1) o.counting--;
                    o.quadrant = 2;
                    o.degree = 360 - Math.abs(Math.atan2(calcX,calcY) * 180 / Math.PI );
                }

                o.degree = o.degree + (o.counting * 360);
                o.target.style.transform = 'matrix(' + Math.cos(o.degree * (Math.PI / 180)) + ', ' + Math.sin(o.degree * (Math.PI / 180)) + ', ' + -1 * Math.sin(o.degree * (Math.PI / 180)) + ', ' + Math.cos(o.degree * (Math.PI / 180)) + ', 1, 1)';

                /* METHOD */
                if(typeof o.on.drag === 'function') o.on.drag( o );
            }



            o.on.stop = function(){
                o.container.removeEventListener('touchmove', wheelFunc);
                o.container.removeEventListener('mousemove', wheelFunc);
            }

            /* METHOD VAR */
            var method = {
                update : function(option){

                },
                destroy : function(){
                },
            }

            return method;
        },

        /* COUNTING - check */
        counting : function(target, option){
            if(target === undefined) console.warn('Selector is not defined'); // add selector checklist

            var pluginName = 'count-wrap';

            /* DEFAULT OPTION */
            var o = {
                target : null, // temp check target
                container : document.getElementsByTagName('body')[0],
                event : 'click', // default
                repeat : false,
                effect : {
                    type : null, // temp check deep copy
                    // option : ['red', 'blue', 'green', 'yellow', 'purple'],
                    option : ArrColorCode,
                    items : [],
                    duration : 400,
                },
                start : 0,
                end : 0,
                nowCount : 0,
                unit : 1,
                on : {
                    init : null,
                    count : null,
                    end : null
                },
            };

            /* OPTION MERGE */
            for( var i in Object.keys(o)){
                o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
            }

            /* OPTION INIT */
            if(o.target === null) return console.warn('Selector is not defined'); // add selector checklist
            o.container.classList.add(pluginName);
            o.nowCount = o.start;
            if(typeof o.on.init === 'function') o.on.init( o );

            /* EFFECT BACKGROUND */
            if(o.effect.type === 'background'){
                var eventLoop = o.effect.option.length,
                    scaleWidth = o.target.offsetWidth / o.container.offsetWidth,
                    scaleHeight = o.target.offsetHeight / o.container.offsetHeight;

                while(eventLoop < (o.end - o.start) / o.unit){
                    eventLoop++;
                    o.effect.option.push('rgb('+ parseInt(255*Math.random()) +', '+ parseInt(255*Math.random()) +', '+ parseInt(255*Math.random()) +')');
                }

                o.effect.option.forEach(function(elem,index){
                    var effectDom = document.createElement('div');
                    effectDom.classList.add('countBg'+index);
                    effectDom.style.zIndex = index;
                    effectDom.style.backgroundColor = elem;
                    effectDom.style.transform = 'translate(-50%, -50%) scale(' + scaleWidth + ', ' + scaleHeight + ')';
                    o.effect.items.push(effectDom);
                    o.container.append(effectDom);
                });
            }

            /* ADD EVENT */
            [o.event].forEach(function(event){
                o.target.addEventListener(event, countFunc);
            });

            /* EVENT FUNCTION */
            function countFunc(e){
                o.start < o.end ? o.nowCount = o.nowCount + o.unit : o.nowCount = o.nowCount - o.unit;

                /* METHOD */
                if(o.effect.type === "background") bgEvent(o.nowCount);
                if(typeof o.on.count === 'function') o.on.count( o );
                if(o.repeat && o.nowCount === o.end) o.nowCount = o.start;
                if(o.nowCount === o.end){
                    if(typeof o.on.end === 'function') o.on.end( o );
                    [o.event].forEach(function(event){
                        o.target.removeEventListener(event, countFunc);
                    });
                }
            }

            /* EFFECT FUNCTION */
            function bgEvent(count){
                var startTime = Date.now();

                var loopVar = setInterval(function(){
                    var timeGap = Date.now() - startTime;
                    if(timeGap > o.effect.duration ){
                        clearInterval(loopVar);
                        return
                    }
                    var loopWidth = scaleWidth + ((1.45 - scaleWidth) / o.effect.duration * timeGap),
                        loopHeight = scaleHeight + ((1.45 - scaleHeight) / o.effect.duration * timeGap);

                    o.effect.items[count - 1].style.transform = 'translate(-50%, -50%) scale('+ loopWidth +', '+ loopHeight +')';
                });
            }

            /* METHOD VAR */
            var method = {
                update : function(option){
                    o.nowCount = 0;
                    o.repeat = true;
                    [o.event].forEach(function(event){
                        o.target.addEventListener(event, countFunc);
                    });
                },
                destroy : function(){
                },
            }
            return method;
        },

        /* POINTER */
        pointer : function(target, option){
            var pluginName = 'pointer-wrap';

            /* DEFAULT OPTION */
            var o = {
                target : null, // temp check target
                container : document.getElementsByTagName('body')[0],
                mobileDevice : checkMobile(),
                pageY : null,
                pageX : null,
                on : {
                    init : null,
                    move : null,
                    down : null,
                    up : null,
                    update : null,
                    stop : null,
                },
            };

            /* OPTION MERGE */
            for( var i in Object.keys(o)){
                o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
            }

            /* OPTION INIT */
            if(o.target === null) return console.warn('Selector is not defined'); // add selector checklist
            o.container.classList.add(pluginName);
            if(typeof o.on.init === 'function') o.on.init( o );

            /* ADD EVENT */
            ['mousemove'].forEach(function(event){
                o.container.addEventListener(event, moveFunc);
            });
            ['mousedown', 'touchstart'].forEach(function(event){
                o.container.addEventListener(event, down);
            });
            ['mouseup', 'touchend'].forEach(function(event){
                o.container.addEventListener(event, up);
            });

            /* EVENT FUNCTION */
            function moveFunc(e){
                var scrTop = document.getElementsByTagName('html')[0].scrollTop;

                o.pageY = e.type === 'touchmove' ? e.touches[0].pageY : e.pageY;
                o.pageX = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;
                o.target.style.top = o.pageY - scrTop - o.container.getBoundingClientRect().top + 'px';
                o.target.style.left = o.pageX - o.container.getBoundingClientRect().left + 'px';

                /* METHOD */
                if(typeof o.on.move === 'function') o.on.move( o );
            }
            function down(e){
                if(typeof o.on.down === 'function') o.on.down( o );
            }
            function up(e){
                if(typeof o.on.up === 'function') o.on.up( o );
            }

            /* METHOD VAR */
            var method = {
                update : function(option){
                    ['mousemove'].forEach(function(event){
                        o.container.addEventListener(event, moveFunc);
                    });
                },
                destroy : function(){
                    o.container.classList.remove(pluginName);
                    ['mousemove'].forEach(function(event){
                        o.container.removeEventListener(event, moveFunc);
                    });
                },
            }
            return method;
        },

        /* SCROLL */
        scroll : function(target, option){
            var pluginName = 'scroll-wrap';

            /* DEFAULT OPTION */
            var o = {
                target : null, // temp check target
                container : document.getElementsByTagName('body')[0],
                controlArea : null,
                axis : 'y',
                effect : {
                    type : 'parallax',
                    slice : 5,
                },
                nowScroll : 0,
                progress : 0,
                on : {
                    init : null,
                    scroll : null,
                },
            };

            /* OPTION MERGE */
            for( var i in Object.keys(o)){
                o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
            }

            /* OPTION INIT */
            if(o.target === null) return console.warn('Selector is not defined'); // add selector checklist
            o.container.classList.add(pluginName);
            if(typeof o.on.init === 'function') o.on.init( o );

            /* CONTROL-AREA SETTING */
            var controlArea = document.createElement('div'),
                controlScroll = document.createElement('div');
            controlArea.classList.add('control-area');
            controlArea.style.zIndex = 10;
            controlScroll.style.height = (o.container.offsetHeight + 760) + 'px'; // temp value
            o.container.append(controlArea);
            o.controlArea = document.getElementsByClassName('control-area')[0]
            o.controlArea.append(controlScroll);

            if(o.axis === 'xy'){
                o.controlArea.style.overflowX = 'auto';
                o.controlArea.style.overflowY = 'auto';
            }else if(o.axis === 'x'){
                o.controlArea.style.overflowX = 'auto';
                o.controlArea.style.overflowY = 'hidden';
            }else if(o.axis === 'y'){
                o.controlArea.style.overflowX = 'hidden';
                o.controlArea.style.overflowY = 'auto';
            };

            /* TARGET SETTING */
            o.target.style.display = 'inline-block';
            if(typeof o.on.init === 'function') o.on.init( o );

            /* ADD EVENT */
            o.controlArea.addEventListener('scroll', scrollFunc);

            /* EVENT FUNCTION */
            function scrollFunc(e){
                o.nowScroll = o.controlArea.scrollTop;
                o.progress = o.nowScroll / (o.controlArea.children[0].offsetHeight - o.controlArea.offsetHeight);

                /* TYPE */
                if(o.effect.type === 'parallax'){}

                /* METHOD */
                if(typeof o.on.scroll === 'function') o.on.scroll( o );
                if(typeof o.on.end === 'function' && o.progress >= 1) o.on.end( o );
            }

            /* METHOD VAR */
            var method = {
                update : function(option){
                    if(o.axis === 'xy'){
                        o.controlArea.style.overflowX = 'auto';
                        o.controlArea.style.overflowY = 'auto';
                    }else if(o.axis === 'x'){
                        o.controlArea.style.overflowX = 'auto';
                        o.controlArea.style.overflowY = 'hidden';
                    }else if(o.axis === 'y'){
                        o.controlArea.style.overflowX = 'hidden';
                        o.controlArea.style.overflowY = 'auto';
                    };
                },
                destroy : function(){
                },
            }
            return method;
        }
    };

    _window.view     =   _view;
    _window.layout   =   _layout;
    _window.ui        =   _ui;
    _window.pi        =   _pi;

})(this)





/* ==============================
    COMMON UTIL
============================== */
/* device check */
function checkMobile() {
    var mobileWords = new Array('Android', 'iPhone', 'iPod', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
    for (var key in mobileWords) {
        if (navigator.userAgent.match(mobileWords[key]) != null) {
            return true;
        }
    }
    return false;
};

/* closest pollyfill */
if( !Element.prototype.matches ){
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if( !Element.prototype.closest ){
    Element.prototype.closest = function(s){
        var el = this;

        do{
            if( el.matches(s) ) return el;
            el = el.parentElement || el.parentNode;
        }while( el !== null || el.nodeType === 1 ){
            return null;
        }
    };
}










/* deep copy function */
function deepCopyFunc(target){

    /* OPTION MERGE */
    for( var i in Object.keys(o)){
        o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
    }

    function loop(target){

    }


    return copyValue;
}






















/* ==============================
    COMMON UI
============================== */
/* mouse right button */
document.oncontextmenu = function(){
    //
    console.log("don't do that!")
    // return false // block mouse right click
}

/* ==============================
    COMMON FUNCTION
============================== */
/* background animation */
function colorAni(target, option){
    var o = {
        target : null, // temp check target
        property : null,
        beforeBg : null,
        afterBg : null,
        type : 'animate',
        progress : null,
        duration : 400,
        on : {
            init : null,
            end : null
        }
    };

    /* OPTION MERGE */
    for( var i in Object.keys(o)){
        o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
    }

    /* OPTION INIT */
    if(typeof o.on.init === 'function') o.on.init( o );

    /* BACKGROUND GET */
    if( o.beforeBg === undefined ) o.beforeBg = getComputedStyle(o.target).backgroundColor;
    var nowBg = colorCodeFunc(o.beforeBg.trim()),
        newBg = colorCodeFunc(o.afterBg.trim());

    /* COLOR CODE TO ARRAY */
    function colorCodeFunc(colorCode){
        if(colorCode.substr(0,1) === '#'){
            if(colorCode.length > 7) console.warn('background code length error')

            colorCode = [parseInt(colorCode.substr(1,2), 16), parseInt(colorCode.substr(3,2),16), parseInt(colorCode.substr(5,2), 16), 1 ]
            for(var i = 0; i < colorCode.length; i++){
                if(colorCode > 255) console.warn('background code type error');
            }
        }else if(colorCode.substr(0,3) === 'rgb'){
            colorCode = colorCode.slice( colorCode.indexOf('(')+1, colorCode.length-1).split(',');
            for(var i = 0; i < colorCode.length; i ++){
                if(Number(colorCode[i].trim()) > 255) console.warn('background code type error');
                colorCode[i] = Number(colorCode[i].trim());
            }
            if(colorCode.length === 3) colorCode.push(1);
        }else{
            console.warn('background code type error');
        }
        return colorCode;
    }

    /* EVENT FUNCTION */
    if(o.type === 'animate'){
        loopFunc();
        /* EFFECT FUNCTION */
        function loopFunc(){
            var startTime = Date.now(),
                compareBg = [],
                setBg = nowBg;

            for(var i = 0; i < nowBg.length; i++ ){
                compareBg.push( (newBg[i] - nowBg[i]) / (o.duration / 4));
            }

            var loopVar = setInterval(function() {
                var timeGap = Date.now() - startTime;
                if (timeGap > o.duration) {
                    clearInterval(loopVar);
                    o.target.style[o.property] = 'rgba(' + newBg[0] + ', ' + newBg[1] + ', ' + newBg[2] + ', ' + newBg[3] + ')';
                    return
                }

                for (var i = 0; i < setBg.length; i++) setBg[i] += compareBg[i];
                o.target.style[o.property] = 'rgba(' + parseInt(setBg[0]) + ', ' + parseInt(setBg[1]) + ', ' + parseInt(setBg[2]) + ', ' + parseInt(setBg[3]) + ')';
            });
        };
    }
    if(o.type === 'progress'){
        var setBg = nowBg;
        for (var i = 0; i < setBg.length; i++) setBg[i] = nowBg[i] + ((newBg[i] - nowBg[i]) * Number(o.progress));

        o.target.style[o.property] = 'rgba(' + setBg[0] + ', ' + setBg[1] + ', ' + setBg[2] + ', ' + setBg[3] + ')';
    }
};


/* svg emoji animation */
var svgEmojiMap = {
    happy : {
        M0 : [20, 270],
        C1 : [30, 260, 50, 260, 80, 260],
        C2 : [120, 260, 170, 260, 210, 260],
        C3 : [260, 260, 310, 260, 340, 260],
        C4 : [370, 260, 390, 260, 400, 270],
        C5 : [420, 290, 410, 320, 390, 340],
        C6 : [370, 360, 310, 410, 210, 410],
        C7 : [110, 410, 50, 360, 30, 340],
        C8 : [10, 320, 0, 290, 20, 270]
    },
    smile : {
        M0 : [20, 270],
        C1 : [40, 250, 70, 260, 90, 280],
        C2 : [110, 300, 150, 330, 210, 330],
        C3 : [270, 330, 310, 300, 330, 280],
        C4 : [350, 260, 380, 250, 400, 270],
        C5 : [420, 290, 410, 320, 390, 340],
        C6 : [370, 360, 310, 410, 210, 410],
        C7 : [110, 410, 50, 360, 30, 340],
        C8 : [10, 320, 0, 290, 20, 270]
    },
    normal : {
        M0 : [10, 300],
        C1 : [10, 270, 30, 260, 50, 260],
        C2 : [90, 260, 150, 260, 210, 260],
        C3 : [270, 260, 330, 260, 360, 260],
        C4 : [390, 260, 410, 270, 410, 300],
        C5 : [410, 330, 390, 340, 360, 340],
        C6 : [330, 340, 270, 340, 210, 340],
        C7 : [150, 340, 90, 340, 60, 340],
        C8 : [30, 340, 10, 330, 10, 300]
    },
    frown : {
        M0 : [20, 400],
        C1 : [0, 380, 10, 350, 30, 330],
        C2 : [50, 310, 110, 260, 210, 260],
        C3 : [310, 260, 370, 310, 390, 330],
        C4 : [410, 350, 420, 380, 400, 400],
        C5 : [380, 420, 350, 410, 330, 390],
        C6 : [310, 370, 270, 340, 210, 340],
        C7 : [150, 340, 110, 370, 90, 390],
        C8 : [70, 410, 40, 420, 20, 400]
    },
    unhappy : {
        M0 : [20, 400],
        C1 : [0, 380, 10, 350, 30, 330],
        C2 : [50, 310, 110, 260, 210, 260],
        C3 : [310, 260, 370, 310, 390, 330],
        C4 : [410, 350, 420, 380, 400, 400],
        C5 : [390, 410, 370, 410, 350, 410],
        C6 : [320, 410, 270, 410, 210, 410],
        C7 : [220, 410, 130, 410, 80, 410],
        C8 : [50, 410, 30, 410, 20, 400]
    }
};

function svgEmojiAni(target, option){
    var o = {
        target : null,
        container : null,
        type : null,
        duration : 300,
        scale : 1, // temp option
        on : {
            init : null,
            update : null,
            destroy : null,
        }
    };

    /* OPTION MERGE */
    for( var i in Object.keys(o)){
        o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
    }

    /* PAESING GET PATH */
    var nowPath = {},
        pathString = null,
        pathString = o.target.getAttribute('d').split('\n');

    for(var i = 0; i < pathString.length; i ++){
        var nowType = pathString[i].trim().substr(0,  pathString[i].trim().indexOf(' '));

        nowPath[nowType + i] = pathString[i].trim().split(' ');
        nowPath[nowType + i].shift();
    }

    /* LOG ORIGIN */
    if(o.type !== 'origin') svgEmojiMap['origin'] = nowPath;
    if(o.type === 'origin' && svgEmojiMap['origin'] === undefined) return false;

    /* PATH LOOP */
    function loopFunc(asis, tobe){
        var startTime = Date.now(),
            comparePath = {};

        for( var i in Object.keys(asis)){
            var compareArray = [];

            for(var j = 0; j < asis[Object.keys(asis)[i]].length; j++){
                compareArray.push( (Number(tobe[Object.keys(tobe)[i]][j]) - Number(asis[Object.keys(asis)[i]][j])) / (o.duration / 4) );
            }
            comparePath[Object.keys(asis)[i]] = compareArray;
        }

        var loop = setInterval(function(){
            var timeGap = Date.now() - startTime;
            if(timeGap > o.duration ){
                clearInterval(loop);
                setPathFunc( svgEmojiMap[o.type] )
                return
            }
            for( var i in Object.keys(asis)){
                for(var j = 0; j < asis[Object.keys(asis)[i]].length; j++){
                    asis[Object.keys(asis)[i]][j] = Number(asis[Object.keys(asis)[i]][j]) + Number(comparePath[Object.keys(comparePath)[i]][j]);
                }
            }
            setPathFunc( asis )
        });
    };
    loopFunc(nowPath, svgEmojiMap[o.type]);

    /* PARSING SET PATH */
    function setPathFunc(obj){
        var parseAttr = '',
            pathType, pathValue;

        for( var i = 0; i < Object.keys(obj).length; i++ ){

            pathType = Object.keys(obj)[i].substr(0, 1) ;
            pathValue = obj[Object.keys(obj)[i]].toString();

            while(pathValue.indexOf(',') !== -1){
                pathValue = pathValue.replace(',', ' ');
            }

            if(i + 1 === Object.keys(obj).length){
                parseAttr += pathType + ' ' + pathValue;
            }else{
                parseAttr += pathType + ' ' + pathValue  + '\n';
            }
        }
        o.target.setAttribute("d", parseAttr);
    };
}

function randomPosition(target, option){
    var o = {
        target : null,
        container : document.getElementsByTagName('body')[0],
        posY : null,
        posX : null,
        padding : null,
    }

    /* OPTION MERGE */
    for( var i in Object.keys(o)){
        o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
    }

    o.posY = Math.min( Math.max( o.padding, Math.random() * o.container.offsetHeight ), o.container.offsetHeight - (o.padding * 2));
    o.posX = Math.min( Math.max( o.padding, Math.random() * o.container.offsetWidth ), o.container.offsetWidth - (o.padding * 2));
    o.target.style.top = o.posY + 'px';
    o.target.style.left = o.posX + 'px';
}



// ==================== 보류작업 ====================
// random motion
// function randomMotion(target, option){
//     var o = {
//         target : null,
//         container : document.getElementsByTagName('body')[0],
//         startY : null,
//         startX : null,
//         nowY : null,
//         nowX : null,
//         range : null,
//         startTime : null,
//         motionTime : null,
//         on : {
//             init : null,
//             update : null,
//             destroy : null,
//         }
//     };
//
//     /* OPTION MERGE */
//     for( var i in Object.keys(o)){
//         o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
//     }
//
//     /* OPTION INIT */
//     o.range = {
//         axisY : [ -1*(o.target.offsetHeight * 1.5), o.container.offsetHeight + o.target.offsetHeight ],
//         axisX : [ -1*(o.target.offsetWidth * 1.5), o.container.offsetWidth + o.target.offsetWidth ],
//     };
//     // o.motionTime = Math.min(300, Math.random() * 700);
//     o.motionTime = 1500;
//     o.startY = parseInt( getComputedStyle(o.target).top);
//     o.startX = parseInt( getComputedStyle(o.target).left);
//     o.nowY = o.startY;
//     o.nowX = o.startX;
//
//     var num = 0;
//     o.startTime = Date.now();
//
//     var calcPos = [];
//     var moveUnit = [];
//
//     setLoop();
//     function setLoop(){
//         o.startTime = Date.now();
//         o.motionTime = Math.max(parseInt(Math.random() * 1500), 1000);
//         o.nowY = parseInt( getComputedStyle(o.target).top);
//         o.nowX = parseInt( getComputedStyle(o.target).left);
//
//
//         if(Math.round(Math.random()) === 1){
//             calcPos[0] = Math.random() * (o.container.offsetHeight / 5);
//         }else{
//             calcPos[0] = -1 * Math.random() * (o.container.offsetHeight / 5);
//         }
//         if(Math.round(Math.random()) === 1){
//             calcPos[1] = Math.random() * (o.container.offsetWidth / 5);
//         }else{
//             calcPos[1] = -1 * Math.random() * (o.container.offsetWidth / 5);
//         }
//
//         moveUnit[0] = o.nowY;
//         moveUnit[1] = o.nowX;
//
//         console.log( moveUnit, o.nowY, calcPos[0], o.motionTime );
//         loopFunc();
//     }
//
//     function loopFunc(){
//         var timeGap = Date.now() - o.startTime;
//
//         if(timeGap > o.motionTime){
//             num++
//             // if(num > 10) return false;
//             console.log(num ,timeGap)
//             setLoop();
//         }
//         // console.log( parseInt( getComputedStyle(o.target).top) + moveUnit[0]  )
//         moveUnit[0] += (calcPos[0] / (o.motionTime / 4));
//         moveUnit[1] += (calcPos[1] / (o.motionTime / 4));
//
//         o.target.style.top = Math.min(Math.max( moveUnit[0], 0), (o.container.offsetHeight - o.target.offsetHeight)) + 'px';
//         o.target.style.left = Math.min(Math.max( moveUnit[1], 0), (o.container.offsetWidth - o.target.offsetWidth)) + 'px';
//
//         setTimeout(loopFunc,10);
//     }
// }
// temp selector function
// for( var sel = _selector.length; sel--;){
//
//     var _target = _selector[sel].trim(),
//         _targetType = _selector[sel].substr(0,1);
//
//     if(_targetType === '#'){
//         _target = document.getElementById(_target.replace('#', ''));
//     }else if(_targetType === '.'){
//         _target = document.getElementsByClassName(_target.replace('.','') )[0];
//     }else{
//         _target = document.getElementsByTagName(_target)[0];
//     };
//
//     _selector[sel] = _target;
// }

/* ==============================
    SETTING
============================== */
view.init(); // common view javascript
var ArrColorCode = ['#ff0d0d', '#ff4e11', '#ff8e15', '#acb334', '#69b34c'];

/* [SHORTCUT] */
// var shortCut = document.getElementsByClassName('shortCut')[0];
// for(var i = shortCut.children.length; i--;){
//     shortCut.children[i].children[0].addEventListener('click', function(){
//
//         var sections = document.getElementsByTagName('section');
//         for( var i = sections.length; i--; ){
//             if(this === sections[i]) console.log(this);
//         }
//         if(this.classList.value.indexOf('ui-zipper') !== -1){
//             this.style.display = 'block'
//         }
//         if(this.classList.value.indexOf('ui-clock') !== -1){
//             this.style.display = 'block'
//         };
//         if(this.classList.value.indexOf('ui-emoji') !== -1){
//             this.style.display = 'block'
//         };
//         if(this.classList.value.indexOf('ui-bug') !== -1){
//             this.style.display = 'block'
//         };
//         if(this.classList.value.indexOf('ui-scroll') !== -1){
//             this.style.display = 'block'
//         };
//     })
// }


/* ==============================
    PLUGIN LIST
============================== */
/* [INTRO] - zipper effect */
pi.zipper('.zipBox', {
    container : document.getElementsByClassName('zipBox')[0],
    handler : document.getElementsByClassName('zipHandle')[0],
    on : {
        init : function(o){
            o.container.classList.add('active');
            document.getElementsByClassName('zipTag')[0].style.backgroundColor = ArrColorCode[0]
            document.getElementsByClassName('chain')[0].style.borderColor = ArrColorCode[0]
        },
        drag : function(o){
            if(o.progress <= 0.92){
                colorAni('.zipTag',{
                    target: document.getElementsByClassName('zipTag')[0],
                    property: 'backgroundColor',
                    beforeBg : stepColor(ArrColorCode, o.progress / 0.92).startCode,
                    afterBg : stepColor(ArrColorCode, o.progress / 0.92).endCode,
                    type : 'progress',
                    progress : stepColor(ArrColorCode, o.progress / 0.92).nowProgress
                });
                colorAni('.chain',{
                    target: document.getElementsByClassName('chain')[0],
                    property : 'borderColor',
                    beforeBg : stepColor(ArrColorCode, o.progress / 0.92).startCode,
                    afterBg : stepColor(ArrColorCode, o.progress / 0.92).endCode,
                    type : 'progress',
                    progress : stepColor(ArrColorCode, o.progress / 0.92).nowProgress
                });
            }else{
                if( o.progress > 0.9){
                    // now section -> next section
                    if( o.container.classList.value.indexOf('active') !== -1 ){
                        o.container.classList.remove('active');
                        o.container.classList.add('end');

                        setTimeout(function(){
                            document.getElementsByClassName('clockBox')[0].classList.add('active');
                            autoTyping( document.getElementsByClassName('intro')[0], "I'm a publisher")

                            // wheel effect
                            setTimeout(function(){
                                o.container.style.display = 'none';
                                document.getElementsByClassName('clockBox')[0].classList.add('start');
                                setSecound();
                                secoundInter = setInterval(setSecound,1000);
                                setTimeout(function(){
                                    document.getElementsByClassName('clockBox')[0].classList.add('noTransition')

                                    // autoType function
                                    document.getElementsByClassName('keyword')[0].classList.add('active');
                                    autoTyping( document.getElementsByClassName('keyword')[0], 'who keeps time well,')

                                },1600);
                            }, 300)
                        }, 1200);
                    }
                }
            }
        }
    }
});

/* [SECTION01] - wheel effect */
pi.wheel( '.minNeedle', {
    target : document.getElementsByClassName('minNeedle')[0],
    container: document.getElementsByClassName('clockBox')[0],
    on : {
        init : function(o){
            document.getElementsByClassName('minNeedle')[0].style.backgroundColor = ArrColorCode[0];
        },
        dragStart: function(o){
            o.startTime = new Date();
            o.inTime = o.startTime.getHours() > 12 ? (o.startTime.getHours() - 12) * 360 + (o.startTime.getMinutes() * 6) : (o.startTime.getHours() * 360) + (o.startTime.getMinutes() * 6)
        },
        drag : function(o){
            if(o.degree > 0){
                var progressVal = o.degree / o.inTime;
            }else{
                var progressVal = Math.abs(o.degree) / (4320 - o.inTime);
            }

            if( progressVal <= 0.98){
                colorAni('.minNeedle',{
                    target: document.getElementsByClassName('minNeedle')[0],
                    property : 'backgroundColor',
                    beforeBg : stepColor(ArrColorCode, progressVal / 0.98).startCode,
                    afterBg : stepColor(ArrColorCode, progressVal / 0.98).endCode,
                    type : 'progress',
                    progress : stepColor(ArrColorCode, progressVal / 0.98).nowProgress
                });
            }else{
                // now section -> next section
                if( o.container.classList.value.indexOf('active') !== -1 ) {
                    o.container.classList.remove('active');
                    o.container.classList.remove('start');
                    o.container.classList.remove('noTransition');
                    clearInterval(secoundInter);

                    setTimeout(function () {
                        o.container.classList.add('end');

                        setTimeout(function () {
                            o.container.style.display = 'none';
                            document.getElementsByClassName('countBox')[0].classList.add('active');
                            document.getElementsByClassName('countBox')[0].classList.add('start');

                            // autoType function
                            document.getElementsByClassName('keyword')[0].classList.remove('active');
                            document.getElementsByClassName('keyword')[1].classList.add('active');
                            autoTyping( document.getElementsByClassName('keyword')[1], 'makes people smile,')

                        }, 800)
                    }, 800);
                }
            }

            document.getElementsByClassName('hourNeedle')[0].style.transform = 'rotate(' + (o.degree/12) + 'deg)';
        }
    }
});


/* [SECTION02] - SVG animation */
pi.counting('.countBox', {
    target : document.getElementsByClassName('countBtn')[0],
    container : document.getElementsByClassName('countBox')[0],
    start: 0,
    end: 4,
    on : {
        init : function(o){
            document.getElementsByClassName('emojiBg')[0].style.backgroundColor = ArrColorCode[0];
        },
        count : function(o){
            document.getElementsByClassName('emoji')[0].classList.add('clicked');
            setTimeout(function(){
                document.getElementsByClassName('emoji')[0].classList.remove('clicked');
            }, 400);
            var emojiType = 'normal';
            if(o.nowCount === 1){ emojiType = 'frown';
            }else if(o.nowCount === 2){ emojiType = 'normal';
            }else if(o.nowCount === 3){ emojiType = 'smile';
            }else if(o.nowCount === 4){ emojiType = 'happy';
            }
            colorAni('.emojiBg',{
                target: document.getElementsByClassName('emojiBg')[0],
                property: 'backgroundColor',
                beforeBg : getComputedStyle(document.getElementsByClassName('emojiBg')[0]).backgroundColor,
                afterBg : o.effect.option[o.nowCount],
            });
            svgEmojiAni('emoji',{
                target: document.getElementsByClassName('mouth')[0],
                type: emojiType,
            });
        },
        end: function(o){
            // now section -> next section
            if( o.container.classList.value.indexOf('active') !== -1 ) {
                o.container.classList.remove('active');

                setTimeout(function () {
                    o.container.classList.remove('start');
                    setTimeout(function () {
                        o.container.classList.remove('active');
                        o.container.style.display = 'none';

                        document.getElementsByClassName('mouseBox')[0].classList.add('active');
                        document.getElementsByClassName('mouseBox')[0].classList.add('start');

                        // autoType function
                        document.getElementsByClassName('keyword')[1].classList.remove('active');
                        document.getElementsByClassName('keyword')[2].classList.add('active');
                        autoTyping( document.getElementsByClassName('keyword')[2], 'is meticulous at work,')

                    }, 650)
                }, 1000);
            }
        },
    }
});

/* [SECTION04] - click effect */
pi.pointer('.moveBox', {
    target : document.getElementsByClassName('magnifying')[0],
    container : document.getElementsByClassName('mouseBox')[0],
    on : {
        init : function(o){
            randomPosition('.bug',{
                target : document.getElementsByClassName('bug')[0],
                container : document.getElementsByClassName('mouseBox')[0],
                padding : 150,
            })
            o.bug = {
                origin : document.getElementsByClassName('bug')[0],
                copy : document.getElementsByClassName('copyBug')[0],
            }
        },
        move : function(o){
            var bugInfo = {
                y : Math.abs(o.pageY - o.container.getBoundingClientRect().top - document.getElementsByTagName('html')[0].scrollTop),
                x : Math.abs(o.pageX - o.container.getBoundingClientRect().left - document.getElementsByTagName('html')[0].scrollLeft),
                clientH : document.getElementsByClassName('magnifying')[0].offsetHeight,
                clientW : document.getElementsByClassName('magnifying')[0].offsetWidth,
            }

            var bugTop = (parseInt(getComputedStyle(o.bug.origin).top) - bugInfo.y + (bugInfo.clientH / 2)),
                bugLeft = (parseInt(getComputedStyle(o.bug.origin).left) - bugInfo.x + (bugInfo.clientW / 2)),
                defineC = {
                    pointer : triFunc(bugTop - (bugInfo.clientH / 2), bugLeft - (bugInfo.clientW / 2)),
                    magnifying : triFunc(bugInfo.clientH / 2,bugInfo.clientW / 2),
                    bugCopy : triFunc(o.bug.copy.offsetHeight / 2, o.bug.copy.offsetWidth / 2),
                };

            var progress = Math.abs(defineC.pointer - defineC.bugCopy) / defineC.magnifying;

            o.bug.copy.style.top = bugTop + 'px';
            o.bug.copy.style.left = bugLeft + 'px';
            o.bug.copy.style.transform = 'translate(-50%, -50%) scale(' + ((1 - progress) * 2.4 + 1).toFixed(2) +')';

            if(progress < 0.7){
                colorAni('.copyBug',{
                    target: document.getElementsByClassName('copyBug')[0],
                    property: 'color',
                    beforeBg : stepColor(ArrColorCode, (0.7 - progress) / 0.7).startCode,
                    afterBg : stepColor(ArrColorCode, (0.7 - progress) / 0.7).endCode,
                    type : 'progress',
                    progress : stepColor(ArrColorCode, (0.7 - progress) / 0.7).nowProgress
                });
                if(progress < 0.1){
                    // now section -> next section
                    if( o.container.classList.value.indexOf('active') !== -1 ) {
                        o.container.classList.remove('active');

                        setTimeout(function(){
                            o.container.classList.add('end');
                            o.on.stop();

                            setTimeout(function(){
                                o.container.classList.remove('start');

                                setTimeout(function(){
                                    o.container.style.display ='none';
                                    document.getElementsByClassName('scrollBox')[0].classList.add('active');
                                    document.getElementsByClassName('scrollBox')[0].classList.add('start');


                                    // autoType function
                                    document.getElementsByClassName('keyword')[2].classList.remove('active');
                                    document.getElementsByClassName('keyword')[3].classList.add('active');
                                    autoTyping( document.getElementsByClassName('keyword')[3], 'and has potential.')

                                },600)
                            },1200)
                        },500);
                    }
                }
            }
        }
    }
});

/* [SECTION05] - scroll effect */
pi.scroll('.words', {
    target : document.getElementsByClassName('words')[0],
    container : document.getElementsByClassName('scrollBox')[0],
    on : {
        init : function(o){
            for(var i = 0; i < document.getElementsByClassName('alphabet').length; i ++) {
                document.getElementsByClassName('alphabet')[i].style.color = ArrColorCode[0];
            }
        },
        scroll : function(o){
            for(var i = 0; i < document.getElementsByClassName('alphabet').length; i ++) {
                if(o.progress < 1 && o.progress > 0){
                    colorAni('.alphabet',{
                        target: document.getElementsByClassName('alphabet')[i],
                        property: 'color',
                        beforeBg : stepColor(ArrColorCode, o.progress).startCode,
                        afterBg : stepColor(ArrColorCode, o.progress).endCode,
                        type : 'progress',
                        progress : stepColor(ArrColorCode, o.progress).nowProgress
                    });
                }

                /* SCROLL OPTION */
                var scrollSpeed = o.nowScroll,
                    direction = 'down';
                if( i === 0 ) scrollSpeed = o.nowScroll * 1.21;
                if( i === 1 ) scrollSpeed = o.nowScroll * 0.631;
                if( i === 2 ){
                    scrollSpeed = o.nowScroll * 1.265;
                    direction = 'up';
                }
                if( i === 3 ) scrollSpeed = o.nowScroll * 0.841;
                if( i === 4 ) scrollSpeed = o.nowScroll * 0.105;
                if( i === 5 ) scrollSpeed = o.nowScroll * 0.42;
                if( i === 6 ){
                    scrollSpeed = o.nowScroll * 1.37;
                    direction = 'up';
                }
                if( i === 7 ) scrollSpeed = o.nowScroll * 0.682;
                if( i === 8 ){
                    scrollSpeed = o.nowScroll * 1.108;
                    direction = 'up';
                }

                /* SCROLL VALUE */
                var scrollVal,
                    type = document.getElementsByClassName('alphabet')[i],
                    typeH = type.offsetHeight,
                    typeGap = parseInt(getComputedStyle(type).lineHeight),
                    typeCount = parseInt(scrollSpeed / (typeH - typeGap));

                direction === 'up' ? scrollVal = scrollSpeed - ((typeH - typeGap) + ((typeH - (typeGap)) * typeCount)) : scrollVal = -scrollSpeed + ((typeH - typeGap) * typeCount);
                type.style.top = scrollVal + 'px';
            }
        },
        end : function(o){
            // now section -> next section
            if( o.container.classList.value.indexOf('active') !== -1 ){
                o.container.classList.remove('active');
                o.controlArea.style.overflow = "hidden";

                setTimeout(function(){
                    o.container.classList.add('end');
                    // autoType function
                    document.getElementsByClassName('keyword')[3].classList.remove('active');

                    setTimeout(function(){
                        // o.container.style.display ='none';
                        document.getElementsByTagName('main')[0].classList.add('finish');

                        // finishWord
                        var nowC = 0, newC;
                        setInterval(function(){
                            if(nowC > ArrColorCode.length - 1) nowC = 0;
                            if(nowC === ArrColorCode.length - 1){
                                newC = 0;
                            }else{
                                newC = nowC + 1;
                            }
                            colorAni('.finishWord',{
                                target: document.getElementsByClassName('finishWord')[0],
                                property: 'backgroundColor',
                                beforeBg : ArrColorCode[nowC],
                                afterBg : ArrColorCode[newC],
                            });

                            nowC++;
                        }, 600);
                    },1000);
                }, 1200);
            }
        }
    }
});

// autoTyping function
function autoTyping(target, str){
    var strVal = str.trim(),
        typeIdx = 0;

    typeLoop(); // loop start
    function typeLoop(){
        if(typeIdx > strVal.length) return false;
        target.innerHTML = strVal.substr(0, typeIdx);
        typeIdx++
        setTimeout(typeLoop, 110);
    }
}

// color change function
function stepColor(arr, prog){
    var opt = {},
        step = 1 / (arr.length - 1);

    for(var i = 1; i < arr.length; i++){
        if(prog < step * i && prog >= step * (i - 1)){
            opt.startCode = ArrColorCode[i-1];
            opt.endCode = ArrColorCode[i];
            opt.nowProgress = (prog - (step * (i - 1))) / step;
            opt.nowStep = i;
            break;
        }
    }
    return opt;
};

// secound needle function
var secoundInter;
function setSecound(){
    var d = new Date(),
        ds = d.getSeconds();
    document.getElementsByClassName('secNeedle')[0].style.transform = 'rotate(' + ds * 6 + 'deg)';
};

// trigonometric function
function triFunc(t,l){
    var powT = Math.pow(t, 2),
        powL = Math.pow(l, 2);
    return Math.sqrt( Math.abs(powT) + Math.abs(powL) );
};







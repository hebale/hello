/* view init */
View.init();

const appHeightSet = () => {
	const doc = document.documentElement;
	const vh = window.innerHeight * 0.01;

	doc.style.setProperty('--vh', `${vh}px`);
	doc.style.setProperty('--app-height', `${window.innerHeight}px`)
};

/* color code */
const processColorCode = ['#f91111', '#fd7f0f', '#ffc80d', '#b5ca28', '#58c131'];

/* svg emoji animation */
const svgEmojiMap = {
	happy: [
		{M: [20, 270]},
		{C: [30, 260, 50, 260, 80, 260]},
		{C: [120, 260, 170, 260, 210, 260]},
		{C: [260, 260, 310, 260, 340, 260]},
		{C: [370, 260, 390, 260, 400, 270]},
		{C: [420, 290, 410, 320, 390, 340]},
		{C: [370, 360, 310, 410, 210, 410]},
		{C: [110, 410, 50, 360, 30, 340]},
		{C: [10, 320, 0, 290, 20, 270]}
	],
	smile: [
		{M: [20, 270]},
		{C: [40, 250, 70, 260, 90, 280]},
		{C: [110, 300, 150, 330, 210, 330]},
		{C: [270, 330, 310, 300, 330, 280]},
		{C: [350, 260, 380, 250, 400, 270]},
		{C: [420, 290, 410, 320, 390, 340]},
		{C: [370, 360, 310, 410, 210, 410]},
		{C: [110, 410, 50, 360, 30, 340]},
		{C: [10, 320, 0, 290, 20, 270]}
	],
	normal: [
		{M: [10, 300]},
		{C: [10, 270, 30, 260, 50, 260]},
		{C: [90, 260, 150, 260, 210, 260]},
		{C: [270, 260, 330, 260, 360, 260]},
		{C: [390, 260, 410, 270, 410, 300]},
		{C: [410, 330, 390, 340, 360, 340]},
		{C: [330, 340, 270, 340, 210, 340]},
		{C: [150, 340, 90, 340, 60, 340]},
		{C: [30, 340, 10, 330, 10, 300]}
	],
	frown: [
		{M: [20, 400]},
		{C: [0, 380, 10, 350, 30, 330]},
		{C: [50, 310, 110, 260, 210, 260]},
		{C: [310, 260, 370, 310, 390, 330]},
		{C: [410, 350, 420, 380, 400, 400]},
		{C: [380, 420, 350, 410, 330, 390]},
		{C: [310, 370, 270, 340, 210, 340]},
		{C: [150, 340, 110, 370, 90, 390]},
		{C: [70, 410, 40, 420, 20, 400]}
	],
	unhappy: [
		{M: [20, 400]},
		{C: [0, 380, 10, 350, 30, 330]},
		{C: [50, 310, 110, 260, 210, 260]},
		{C: [310, 260, 370, 310, 390, 330]},
		{C: [410, 350, 420, 380, 400, 400]},
		{C: [390, 410, 370, 410, 350, 410]},
		{C: [320, 410, 270, 410, 210, 410]},
		{C: [220, 410, 130, 410, 80, 410]},
		{C: [50, 410, 30, 410, 20, 400]}
	]
};

/* typing */
const UiTyping = new Pi.typing('.main-copy', { duration: 1500 }); 

/* zipper */
const UiZipper = new Pi.zipper('.zipper-box', {
	container: document.querySelector('.zipper-box'),
	handler: document.querySelector('.zipper-box .handle'),
	axis: checkPlatform() === 'pc' ? 'y' : 'x',
	on: {
		init: (o) => {
			o.container.classList.add('active');
			document.querySelector('.zipper-box .tag').style.backgroundColor = processColorCode[0]
			document.querySelector('.zipper-box .tag span').style.borderColor = processColorCode[0]
		},
		drag: (o) => {
			const limit = checkPlatform() === 'pc' ? 0.92 : 0.8; 
			
			if(o.progress <= limit) {
				['.zipper-box .tag', '.zipper-box .tag span'].forEach((className, index) => {
					colorAnimation(className,{
						property: index ? 'borderColor' : 'backgroundColor',
						startColor : checkProgressColor(processColorCode, o.progress / limit).startCode,
						endColor : checkProgressColor(processColorCode, o.progress / limit).endCode,
						type : 'progress',
						progress : checkProgressColor(processColorCode, o.progress / limit).nowProgress
					});
				});
			} else {
				if(o.progress > limit) {
					if(
						o.container.classList.contains('active') &&
						!document.querySelector('main').classList.contains('finish')
					){
						if(!o.container.classList.contains('end')) {
							setTimeout(() => {
								o.container.classList.remove('active');
								document.querySelector('.main-copy').classList.add('start');
								document.querySelector('.clock-box').classList.add('active');
								
								setTimeout(() => {
									document.querySelector('.clock-box').classList.add('start');
	
									// check
									setSecound();
									secoundInter = setInterval(setSecound,1000);
									
									/*  typing */
									UiTyping.append({
										text: '시간약속을 잘지키는',
										element: 'span',
									});
	
									setTimeout(() => {
										document.querySelector('.clock-box').classList.add('noTransition');
									},1450);
								}, 300)
							}, 1200);
						};

						o.container.classList.add('end');
					}
				}
			}
		}
	}
});

/* clock */
const UiWheel = new Pi.wheel('.min-needle', {
	target: document.querySelector('.min-needle'),
	container: document.querySelector('.clock-box'),
	on: {
		init: () => {
			document.querySelector('.min-needle').style.backgroundColor = processColorCode[0];
		},
		dragStart: (o) => {
			o.startTime = new Date();
			o.inTime = o.startTime.getHours() >= 12
				? (o.startTime.getHours() - 12) * 360 + (o.startTime.getMinutes() * 6)
				: (o.startTime.getHours() * 360) + (o.startTime.getMinutes() * 6)
		},
		drag: (o) => {
			let progress;

			if(o.degree > 0) {
				progress = o.degree / o.inTime;
			} else {
				progress = Math.abs(o.degree) / (4320 - o.inTime);
			};

			if(progress <= 0.9999) {
				colorAnimation('.min-needle',{
					property : 'backgroundColor',
					startColor : checkProgressColor(processColorCode, progress / 0.98).startCode,
					endColor : checkProgressColor(processColorCode, progress / 0.98).endCode,
					type : 'progress',
					progress : checkProgressColor(processColorCode, progress / 0.98).nowProgress
				});
			} else {
				if(
					o.container.classList.contains('active') &&
					!document.querySelector('main').classList.contains('finish')
				) {
					o.container.classList.remove('start');
					o.container.classList.remove('noTransition');
					
					/* check */
					clearInterval(secoundInter);
					secoundInter = null;
					
					setTimeout(() => {
						if(!o.container.classList.contains('end')) {
							setTimeout(() => {
								o.container.classList.remove('active');
								document.querySelector('.count-box').classList.add('active', 'start');
								
								/*  typing */
								UiTyping.append({
									text: '주변 사람들을 즐겁게 하는',
									element: 'span',
									br: true,
								});
							}, 800)
						}

						o.container.classList.add('end');
					}, 800);
				}
			}

			document.querySelector('.hour-needle').style.transform = `rotate(${o.degree / 12}deg)`;
		}
	}
});

/* path animation */
const UiCounting = new Pi.counting('.count-box', {
	container: document.querySelector('.count-box'),
	start: 0,
	end: 4,
	on: {
		init: () => {
			document.querySelector('.emoji-bg').style.backgroundColor = processColorCode[0];
		},
		count: (o) => {
			document.querySelector('.count-box .emoji').classList.add('feedback');

			setTimeout(() => {
				document.querySelector('.count-box .emoji').classList.remove('feedback');
			}, 350);
			
			colorAnimation('.emoji-bg',{
				property: 'backgroundColor',
				startColor: getComputedStyle(document.querySelector('.emoji-bg')).backgroundColor,
				endColor: o.effect.option[o.nowCount],
			});

			let emojiType;

			switch(o.nowCount) {
				case 1 : 
					emojiType = ['unhappy', 'frown'];
					break;
	
				case 2 :
					emojiType = ['frown', 'normal'];
					break;

				case 3 :
					emojiType = ['normal', 'smile'];
					break;

				case 4 :
					emojiType = ['smile', 'happy'];
					break;
	
				default:
					emojiType = ['happy', 'unhappy'];
					break;
			};
			
			pathAnimation('.mouth',{
				startPathObject: svgEmojiMap[emojiType[0]],
				endPathObject: svgEmojiMap[emojiType[1]],
				duration: 380,
			});
		},
		end: (o) => {
			if(
				o.container.classList.contains('active') &&
				!document.querySelector('main').classList.contains('finish')
			) {
				setTimeout(() => {
					if(!o.container.classList.contains('end')) {
						o.container.classList.remove('start');

						setTimeout(() => {
							o.container.classList.remove('active');
							document.querySelector('.debug-box').classList.add('active', 'start');
							UiDebug.update();

							/* typing */
							UiTyping.append({
								text: '꼼꼼한 성격을 가지고 있는',
								element: 'span',
								br: true,
							});
						}, 650);
					}
					o.container.classList.add('end');
				}, 1000);
			}
		},
	}
});

/* debugging */
const UiDebug = new Pi.pointer('.magnifying', {
	container: document.querySelector('.debug-box'),
	on: {
		init: (o) => {
			randomPosition('.debug-box .bug',{
				container: document.querySelector('.debug-box'),
				padding: checkPlatform() === 'pc' ? 150 : 60,
				exclude: document.querySelector('.magnifying'),
				margin: 30
			})
			o.bug = {
				origin: document.querySelector('.debug-box .bug'),
				copy: document.querySelector('.clone-bug'),
			}
			o.triLengthFn = (a, b) => Math.sqrt( Math.abs(Math.pow(a, 2)) + Math.abs(Math.pow(b, 2)));
			o.setTime = null;
		},
		move: (o) => {
			const startProgress = 0.7,
						endProgress = 0.09;

			let bugInfo = {
				y: Math.abs(o.pageY - o.container.getBoundingClientRect().top - document.querySelector('html').scrollTop),
				x: Math.abs(o.pageX - o.container.getBoundingClientRect().left - document.querySelector('html').scrollLeft),
				clientHalfH: document.querySelector('.magnifying').offsetHeight / 2,
				clientHalfW: document.querySelector('.magnifying').offsetWidth / 2,
			};

			let bugTop = (parseInt(getComputedStyle(o.bug.origin).top) - bugInfo.y + bugInfo.clientHalfH),
					bugLeft = (parseInt(getComputedStyle(o.bug.origin).left) - bugInfo.x + bugInfo.clientHalfW),
					defineCenter = {
						pointer: checkPlatform() === 'pc'
							? o.triLengthFn(bugTop - bugInfo.clientHalfH, bugLeft - bugInfo.clientHalfW)
							: o.triLengthFn(bugTop - 30, bugLeft - 30),
						magnifying: o.triLengthFn(bugInfo.clientHalfH, bugInfo.clientHalfW),
						bugCopy: o.triLengthFn(o.bug.copy.offsetHeight / 2, o.bug.copy.offsetWidth / 2),
					};

			let progress = Math.abs(defineCenter.pointer - defineCenter.bugCopy) / defineCenter.magnifying;
			
			o.bug.copy.style.top = checkPlatform() === 'pc' ? `${bugTop}px` : `${bugTop + bugInfo.clientHalfH - 30}px`;
			o.bug.copy.style.left = checkPlatform() === 'pc' ? `${bugLeft}px` :  `${bugLeft + bugInfo.clientHalfW - 30}px`;
			o.bug.copy.style.transform = `translate(-50%, -50%) scale(${((1 - progress) * 2.6 + 1).toFixed(2)})`;

			o.nowProgress = progress;

			if(progress < startProgress) {
				colorAnimation('.clone-bug', {
					property: 'color',
					startColor : checkProgressColor(processColorCode, (0.7 - progress) / 0.7).startCode,
					endColor : checkProgressColor(processColorCode, (0.7 - progress) / 0.7).endCode,
					type : 'progress',
					progress : checkProgressColor(processColorCode, (0.7 - progress) / 0.7).nowProgress
				});

				if(progress < endProgress) {
					if(!o.setTime) {
						o.setTime = setTimeout(() => {
							if(
								o.nowProgress < endProgress &&
								o.container.classList.contains('active') &&
								!document.querySelector('main').classList.contains('finish')
							) {
								UiDebug.stop();	
								
								setTimeout(() => {
									if(!o.container.classList.contains('end')) {
										setTimeout(() => {
											o.container.classList.remove('start');
											
											setTimeout(() => {
												o.container.classList.remove('active');
												document.querySelector('.scroll-box').classList.add('active', 'start');

												/* typing */
												UiTyping.append({
													text: '잠재력을 가지고 있는',
													element: 'span',
													br: true,
												});
											}, 600)
										}, 1200)
									}

									o.container.classList.add('end');
								}, 300);
							} else {
								o.setTime = null;
							}
						}, 100)
					}
				}
			}
		}
	}
});


/* scroll effect */
const UiScroll = new Pi.scroll('.scroll-box', {
	scrollRatio: 3.2,
	on: {
		init: (o) => {
			let alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			let endText = ['P', 'O', 'T', 'E', 'N', 'T', 'I', 'A', 'L'];
			let fragDom = document.createDocumentFragment(),
				 	ul = document.createElement('ul');

			let wordDom = o.target.querySelector('.words');
				
			wordDom.style.color = processColorCode[0];
			wordDom.textContent.trim().split('').forEach((el, index) => {
				let li = document.createElement('li'),
						spans = document.createDocumentFragment();
	
				let randomDir = Math.random() > 0.5 ? 'up' : 'down';
				let newAlphabet = randomDir === 'up' 
					?	[...alphabets.slice(alphabets.indexOf(el) + 1), ...alphabets.slice(0, alphabets.indexOf(el) + 1)]
					: [...alphabets.slice(alphabets.indexOf(el)), ...alphabets.slice(0, alphabets.indexOf(el))]
				
				let gapIndex = randomDir === 'up'  
					? (alphabets.length - 1) - newAlphabet.indexOf(endText[index])
					: newAlphabet.indexOf(endText[index])

				newAlphabet.forEach(innerEl => {
					let	span = document.createElement('span');
					
					span.textContent = innerEl;
					spans.appendChild(span);
				});
				
				li.classList.add('alphabet');
				li.setAttribute('data-gap', gapIndex);
				li.setAttribute('data-dir', randomDir);
				li.style.transform = `translateY(${randomDir === 'up' ? 'calc(-100% + 40px)' : '0' })`;
				li.appendChild(spans);
				ul.appendChild(li);
			});

			wordDom.textContent = '';
			wordDom.appendChild(fragDom.appendChild(ul));
		},
		scroll: (o) => {
			if(o.progress < 1 && o.progress > 0){
				colorAnimation('.scroll-box .words',{
					property: 'color',
					startColor: checkProgressColor(processColorCode, o.progress).startCode,
					endColor: checkProgressColor(processColorCode, o.progress).endCode,
					type: 'progress',
					progress: checkProgressColor(processColorCode, o.progress).nowProgress
				});
			};

			/* motion */
			o.target.querySelectorAll('.alphabet').forEach(el => {
				let value = (parseInt(el.dataset.gap) * 40 ) * o.progress;

				if(el.dataset.dir === 'up') {
					el.style.transform = `translateY(calc(-100% + 40px + ${value}px))`;
				} else {
					el.style.transform = `translateY(-${value}px)`;
				};
			});
		},
		end: (o) => {
			if( 
				o.target.classList.contains('active') &&
				!document.querySelector('main').classList.contains('finish')
			) {
				o.controlArea.style.overflow = "hidden";
				
				setTimeout(() => {
					o.target.classList.add('end');

					setTimeout(() => {
						document.querySelector('.main-copy').classList.remove('start');
						document.querySelector('.main-copy').classList.add('end');
						
						// thanks
						var nowC = 0, newC;
						setInterval(function(){
							document.querySelector('main').classList.add('finish');
							o.target.classList.remove('active');
							uiReset();

							if(nowC > processColorCode.length - 1) nowC = 0;
							if(nowC === processColorCode.length - 1){
								newC = 0;
							}else{
								newC = nowC + 1; 
							}
							colorAnimation('.thanks',{
								property: 'backgroundColor',
								startColor : processColorCode[nowC],
								endColor : processColorCode[newC],
							});

							nowC++;
						}, 650);


					},1000);
				}, 400);
			}
		}
	}
});


const uiReset = () => {
	UiZipper.update({ progress: 0 });
	UiCounting.update();
	UiDebug.update();
	UiScroll.update();
}

let classNameList = {
	section : ['.zipper-box', '.clock-box', '.count-box', '.debug-box', '.scroll-box'],
	button : ['.zipper', '.clock', '.emoji', '.bug', '.scroll']
};

/*
 * short cut link event 
 */
// document.querySelector('.refresh').addEventListener('click', () => location.reload());

classNameList.button.forEach(className => {
	document.querySelector(`.short-cut ${className}`).addEventListener('click', () => {
		let uiSection = document.querySelector(classNameList.section[classNameList.button.indexOf(className)]);

		document.querySelector('.thanks').style.display = 'none';

		classNameList.button
			.filter(innerClassName => innerClassName !== className)
			.forEach((innerClassName) => {
				document.querySelector(classNameList.section[classNameList.button.indexOf(innerClassName)]).classList.remove('active', 'start');
			});
		
		uiSection.classList.add('active', 'start');
		uiSection.classList.remove('end');

		if(className === '.zipper') {
			UiZipper.update({ progress: 0 });
			['.zipper-box .tag', '.zipper-box .chain'].forEach(className => {
				colorAnimation(className, {
					property: className === '.zipper-box .tag' ? 'backgroundColor' : 'borderColor',
					startColor: checkProgressColor(processColorCode, 0).startCode,
					endColor: checkProgressColor(processColorCode, 0).endCode,
					type: 'progress',
					progress: 0
				})
			});
		};

		if(className === '.clock') {
			setSecound();
			clearInterval(setSecound)
			secoundInter = setInterval(setSecound,1000);
		};

		if(className === '.bug') {
			document.querySelector('.magnifying').setAttribute('style', '');
			document.querySelector('.clone-bug').setAttribute('style', '');
			randomPosition('.debug-box .bug',{
				container: document.querySelector('.debug-box'),
				padding: checkPlatform() === 'pc' ? 150 : 60,
				exclude: document.querySelector('.magnifying'),
				margin: 30
			});
		};
	
		if(className === '.scroll') {
			uiSection.querySelector('.words').style.color = processColorCode[0];
			uiSection.querySelector('.control-area').scrollTo(0, 0);
		};
	});
});

/* check progress color */
function checkProgressColor(colorArray, progress){
	let opt = {},
			step = 1 / (colorArray.length - 1);

	for(let i = 1; i < colorArray.length; i++) {
		if(
			progress < step * i &&
			progress >= step * (i - 1)
		) {
			opt.startCode = processColorCode[i - 1];
			opt.endCode = processColorCode[i];
			opt.nowProgress = (progress - (step * (i - 1))) / step;
			opt.nowStep = i;
			break;
		}
	}
	return opt;
};

// secound -needle function
var secoundInter;
function setSecound(){
	var d = new Date(),
		ds = d.getSeconds();
	document.getElementsByClassName('sec-needle')[0].style.transform = 'rotate(' + ds * 6 + 'deg)';
};

(function(_window){
	const _view = {
		init : function(){
			/* block mouse right */
			document.oncontextmenu = function(){
				console.log("blocked mouse right")
			};

			document.querySelector('body').classList.add(checkPlatform());

			/* device check */
			const addPlatformClass = () => {
				if(!document.querySelector('body').classList.contains(checkPlatform())) {
					window.location.reload();
				}
			};
			
			window.addEventListener('resize', throttle(addPlatformClass, 100));
		}
	};
	const _layout = {
		init        : () => {},
		update      : () => {},
		gnb         : () => {},
		lnb         : () => {},
		dim         : () => {},
		popup       : () => {},
		overflow    : () => {},
	};
	const _ui = {
		init        : () => {},
		update      : () => {},
		input       : () => {},
		select      : () => {},
		table       : () => {},
		tab         : () => {},
		switch      : () => {},
		accordion   : () => {},
		tree        : () => {},
		tooltip     : () => {},
		floating    : () => {},
		sticky      : () => {},
	};
	const _pi = {
		/* zipper */
		zipper: function(target, option) {
			if(!document.querySelector(target)) return console.error('Selector is not defined');

			const pluginName = 'ui-zipper';

			/* default options */
			let o = {
				target: document.querySelector(target),
				container: document.querySelector('body'),
				handler: null,
				coverFirst: null,
				coverSecond: null,
				startY: null,
				startX: null,
				pageY: null,
				pageX: null,
				moveValue: 0,
				divide: 0.5,
				progress: 0,
				axis: 'y',
				overflow: true,
				gap: { y: 0, x: 0 },
				position: { top: 0, left: 0 },
				offset: { top: 0, left: 0 },
				limit: { y: 0, x: 0 },
				on: {
					init: null,
					drag: null,
				},
			};

			/* options merge */
			for(let i in Object.keys(o)) {
				o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
			};

			/* init */
			o.container.classList.add(pluginName);
			
			if(o.handler === null) return console.warn('Handler is nessesary');
			if(typeof o.on.init === 'function') o.on.init(o);

			if(getComputedStyle(o.container).position === 'static') o.container.style.position = 'relative';
			
			if(o.coverFirst === null) {
				let coverFirstDom = document.createElement('div');

				o.axis === 'y' ? coverFirstDom.classList.add('cover-left') : coverFirstDom.classList.add('cover-top');
				o.coverFirst = coverFirstDom;
				o.container.append(coverFirstDom);
			};

			if(o.coverSecond === null) {
				let coverSecondDom = document.createElement('div');

				o.axis === 'y' ? coverSecondDom.classList.add('cover-right') : coverSecondDom.classList.add('cover-bottom');
				o.coverSecond = coverSecondDom;
				o.container.append(coverSecondDom);
			};

			/* add event */
			['mousedown', 'touchstart'].forEach(eventName => {
				o.handler.addEventListener(eventName, event => {
					if(event.type === 'touchstart') {
						o.startY = event.touches[0].pageY;
						o.startX = event.touches[0].pageX;
						o.container.addEventListener('touchmove', zipperFn);
					} else {
						o.startY = event.pageY;
						o.startX = event.pageX;
						o.container.addEventListener('mousemove', zipperFn);
					};
				});
			});

			/* remove event */
			['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(eventName => {
				o.container.addEventListener(eventName, () => {
					o.container.removeEventListener('touchmove', zipperFn);
					o.container.removeEventListener('mousemove', zipperFn);
					o.position = {
						top: o.handler.offsetTop,
						left: o.handler.offsetLeft
					};
				});
			});

			/* method */
			let method = {
				update: params => {
					o.gap = { y: 0, x: 0 };
					o.limit = { y: o.container.offsetHeight - o.handler.offsetHeight, x: o.container.offsetWidth - o.handler.offsetWidth };
					if(params !== undefined){
						if(params.progress !== undefined) o.position.top = o.container.offsetHeight * params.progress;
						if(params.progress !== undefined) o.position.left = o.container.offsetWidth * params.progress;
					};
					updateFn(params);
				},
				destroy: () => window.removeEventListener('resize', updateFn)
			};

			/* resize event */
			window.addEventListener('resize', updateFn);

			function zipperFn(event) {
				let _pageY = event.type === 'touchmove' ? event.touches[0].pageY : event.pageY,
						_pageX = event.type === 'touchmove' ? event.touches[0].pageX : event.pageX;

				if(o.pageY === null) o.pageY = _pageY;
				if(o.pageX === null) o.pageX = _pageX;

				o.gap['y'] = o.startY - _pageY;
				o.gap['x'] = o.startX - _pageX;
				o.pageY = _pageY;
				o.pageX = _pageX;

				o.offset = {
					top: o.handler.getBoundingClientRect().top + o.handler.offsetHeight / 2,
					left: o.handler.getBoundingClientRect().left + o.handler.offsetWidth / 2
				};

				o.limit = {
					y: o.container.offsetHeight - o.handler.offsetHeight,
					x: o.container.offsetWidth - o.handler.offsetWidth
				};

				updateFn();

				if(typeof o.on.drag === 'function') o.on.drag(o);
			};

			function updateFn(option) {
				let handleCss = getComputedStyle(o.handler),
						type = Object.keys(o.position)[Object.keys(o.limit).indexOf(o.axis)],
						marginType = 'margin' + type.replace(type.substr(0, 1), type.substr(0,1).toUpperCase() );

				if(o.overflow){
					o.moveValue = Math.min(Math.max((o.position[type] - o.gap[o.axis] + (-1 * parseInt(handleCss[marginType]))), -1 * parseInt(handleCss[marginType])), (o.limit[o.axis] +  -1 * parseInt(handleCss[marginType])));
				}else {
					o.moveValue = (o.position[type] - o.gap[o.axis]);
				};

				o.progress = o.moveValue / o.limit[o.axis]

				if(option !== undefined) {
					for (let i in Object.keys(o)) {
						o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
					}
				};

				o.handler.style[type] = `${o.moveValue}px`;
				o.coverFirst.style['borderRadius'] = o.axis === 'y'
					? `0 ${(o.progress * 100).toFixed(2)}% 0 0 / 0 ${(o.progress * 100).toFixed(2)}% 0 0`
					: `0 0 0 ${(o.progress * 100).toFixed(2)}% / 0 0 0 ${(o.progress * 100).toFixed(2)}%`;

				o.coverSecond.style['borderRadius'] = `${(o.progress * 100).toFixed(2)}% 0 0 0 / ${(o.progress * 100).toFixed(2)}% 0 0 0`;
			};

			return method;
		},

		/* wheel */
		wheel: function(target, option) {
			if(!document.querySelector(target)) return console.error('Selector is not defined');

			const pluginName = 'ui-wheel';

			/* defauilt options */
			let o = {
				target: document.querySelector(target),
				container: document.querySelector('body'),
				startY: null,
				startX: null,
				pageY: null,
				pageX: null,
				degree: 0,
				counting: 0,
				quadrant: 0,
				gap: {y: 0, x: 0},
				direction: ["",""],
				on: {
					init: null,
					dragStart: null,
					drag: null,
					stop: null,
					update: null,
				},
			};

			/* options merge */
			for(let i in Object.keys(o)) {
				o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
			};

			/* init */
			o.container.classList.add(pluginName);

			if(typeof o.on.init === 'function') o.on.init(o);

			/* add event */
			['mousedown', 'touchstart'].forEach(eventName => {
				o.target.addEventListener(eventName, event => {
					if(typeof o.on.dragStart === 'function') o.on.dragStart(o);
					if(event.type === 'touchstart') {
						o.startY = event.touches[0].pageY;
						o.startX = event.touches[0].pageX;
						o.container.addEventListener('touchmove', wheelFn);
					}else{
						o.startY = event.pageY;
						o.startX = event.pageX;
						o.container.addEventListener('mousemove', wheelFn);
					}
				});
			});

			/* remove event */
			['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(eventName => {
				o.container.addEventListener(eventName, () => {
					o.container.removeEventListener('touchmove', wheelFn);
					o.container.removeEventListener('mousemove', wheelFn);
			   });
			});

			/* method */
			let method = {
				update: params => {
					for(let i in Object.keys(o)) {
						o[Object.keys(o)[i]] = params[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : params[Object.keys(o)[i]];
					};
					o.on.update(o);
				},
				destroy: () => {}
			};

			function wheelFn(event) {
				if(o.container.classList.value.indexOf('active') === -1  ) return;

				let _pageY = event.type === 'touchmove' ? event.touches[0].pageY : event.pageY,
					  _pageX = event.type === 'touchmove' ? event.touches[0].pageX : event.pageX;

				if(o.pageY === null) o.pageY = _pageY;
				if(o.pageX === null) o.pageX = _pageX;

				if(_pageY !== o.pageY) {
					_pageY < o.pageY ? o.direction[0] = 'top' : o.direction[0] = 'bottom';
				} else {
					o.direction[0] = '';
				};
				
				if(_pageX !== o.pageX) {
					_pageY < o.pageX ? o.direction[1] = 'left' : o.direction[1] = 'right';
				} else {
					o.direction[1] = '';
				};

				o.gap['y'] = o.startY - _pageY;
				o.gap['x'] = _pageX - o.startX;
				o.pageY = _pageY;
				o.pageX = _pageX;

				let calcY = (o.target.getBoundingClientRect().top + o.target.offsetHeight / 2) - _pageY,
					  calcX = (o.target.getBoundingClientRect().left + o.target.offsetWidth / 2) - _pageX;

				/* quadrant degree */
				if(calcY > 0 && calcX < 0) {
					if( o.quadrant === 2) o.counting++;
					o.quadrant = 1;
					o.degree = Math.abs(Math.atan2(calcX,calcY) * 180 / Math.PI );
				};

				if(calcY < 0 && calcX < 0) {
					o.quadrant = 4;
					o.degree = Math.abs(Math.atan2(calcX,calcY) * 180 / Math.PI );
				};

				if(calcY < 0 && calcX > 0) {
					o.quadrant = 3;
					o.degree = 360 - Math.abs(Math.atan2(calcX,calcY) * 180 / Math.PI );
				};

				if(calcY > 0 && calcX > 0) {
					if( o.quadrant === 0 || o.quadrant === 1) o.counting--;
					o.quadrant = 2;
					o.degree = 360 - Math.abs(Math.atan2(calcX,calcY) * 180 / Math.PI );
				};

				o.degree = o.degree + (o.counting * 360);
				o.target.style.transform = `matrix(${Math.cos(o.degree * (Math.PI / 180))}, ${Math.sin(o.degree * (Math.PI / 180))}, ${-1 * Math.sin(o.degree * (Math.PI / 180))}, ${Math.cos(o.degree * (Math.PI / 180))}, 1, 1)`;

				/* method */
				if(typeof o.on.drag === 'function') o.on.drag( o );
			};

			o.on.stop = function(){
				o.container.removeEventListener('touchmove', wheelFn);
				o.container.removeEventListener('mousemove', wheelFn);
			};

			return method;
		},

		/* counting */
		counting: function(target, option){
			if(!document.querySelector(target)) return console.error('Selector is not defined');

			const pluginName = 'ui-counting';

			/* default options */
			let o = {
				target: document.querySelector(target),
				container: document.querySelector('body'),
				event: 'click',
				repeat: false,
				effect: {
					type: null,
					option: processColorCode,
					items: [],
					duration: 400,
				},
				start: 0,
				end: 0,
				nowCount: 0,
				unit: 1,
				on: {
					init: null,
					count: null,
					end: null
				},
			};

			/* merge */
			for(let i in Object.keys(o)) {
				o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
			};

			/* init */
			o.container.classList.add(pluginName);
			o.nowCount = o.start;

			if(typeof o.on.init === 'function') o.on.init( o );

			/* effect */
			if(o.effect.type === 'background'){
				let eventLoop = o.effect.option.length,
					  scaleWidth = o.target.offsetWidth / o.container.offsetWidth,
					  scaleHeight = o.target.offsetHeight / o.container.offsetHeight;

				while(eventLoop < (o.end - o.start) / o.unit){
					eventLoop++;
					o.effect.option.push(`rgb(${parseInt(255 * Math.random())}, ${parseInt(255 * Math.random())}, ${parseInt(255 * Math.random())})`);
				}

				o.effect.option.forEach((el,index) => {
					let effectDom = document.createElement('div');

					effectDom.classList.add(`count-bg${index}`);
					effectDom.style.zIndex = index;
					effectDom.style.backgroundColor = el;
					effectDom.style.transform = `translate(-50%, -50%) scale(${scaleWidth}, ${scaleHeight})`;

					o.effect.items.push(effectDom);
					o.container.append(effectDom);
				});
			}

			/* add event */
			[o.event].forEach(eventName => o.target.addEventListener(eventName, countFn));

			/* method */
			let method = {
				update: () => {
					o.nowCount = 0;
					o.repeat = true;
					[o.event].forEach(eventName => o.target.addEventListener(eventName, countFn));
				},
				destroy: () => {},
			};

			function countFn(){
				o.start < o.end ? o.nowCount = o.nowCount + o.unit : o.nowCount = o.nowCount - o.unit;

				if(o.effect.type === "background") backgroundFn(o.nowCount);
				if(typeof o.on.count === 'function') o.on.count(o);
				if(o.repeat && o.nowCount === o.end) o.nowCount = o.start;
				if(o.nowCount === o.end) {
					if(typeof o.on.end === 'function') o.on.end(o);
					[o.event].forEach(eventName => o.target.removeEventListener(eventName, countFn));
				};
			};

			/* temp */
			function backgroundFn(count) {
				let startTime = Date.now();

				let loopVar = setInterval(() => {
					let timeGap = Date.now() - startTime;

					if(timeGap > o.effect.duration ) {
						clearInterval(loopVar);
						return;
					};

					let loopWidth = scaleWidth + ((1.45 - scaleWidth) / o.effect.duration * timeGap),
						  loopHeight = scaleHeight + ((1.45 - scaleHeight) / o.effect.duration * timeGap);

					o.effect.items[count - 1].style.transform = `translate(-50%, -50%) scale(${loopWidth}, ${loopHeight})`;
				});
			};

			return method;
		},

		/* pointer */
		pointer: function(target, option){
			if(!document.querySelector(target)) return console.error('Selector is not defined');

			const pluginName = 'ui-pointer';

			/* default options */
			let o = {
				target: document.querySelector(target),
				container: document.querySelector('body'),
				touchStartY: null,
				touchStartX: null, 
				pageY: null,
				pageX: null,
				on: {
					init: null,
					move: null,
					down: null,
					up: null,
					update: null,
					stop: null,
				},
			};

			/* merge */
			for(let i in Object.keys(o)) {
				o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
			};

			/* init */
			o.container.classList.add(pluginName);
			if(typeof o.on.init === 'function') o.on.init(o);

			/* add event */
			['mousedown', 'touchstart'].forEach(eventName => o.container.addEventListener(eventName, downFn));
			['mousemove', 'touchmove'].forEach(eventName => o.container.addEventListener(eventName, moveFn));
			['mouseup', 'touchend'].forEach(eventName => o.container.addEventListener(eventName, upFn));

			/* method */
			let method = {
				update: () => {
					['mousemove', 'touchmove'].forEach(eventName => o.container.addEventListener(eventName, moveFn));
				},
				stop: () => {
					['mousemove', 'touchmove'].forEach(eventName => o.container.removeEventListener(eventName, moveFn));
				},
				destroy: () => {
					o.container.classList.remove(pluginName);
					['mousemove', 'touchmove'].forEach(eventName => o.container.removeEventListener(eventName, moveFn));
				},
			};

			function moveFn(event){
				let scrTop = document.querySelector('html').scrollTop;

				o.pageY = event.type === 'touchmove' ? event.touches[0].pageY : event.pageY;
				o.pageX = event.type === 'touchmove' ? event.touches[0].pageX : event.pageX;
				o.target.style.top = `${o.pageY - scrTop - o.container.getBoundingClientRect().top}px`;
				o.target.style.left = `${o.pageX - o.container.getBoundingClientRect().left}px`;

				if(typeof o.on.move === 'function') o.on.move(o);
			};

			function downFn(event) {
				if(event.type === 'touchstart') {
					o.touchStartY = event.touches[0].pageY;
					o.touchStartX = event.touches[0].pageX;
				};

				if(typeof o.on.down === 'function') o.on.down(o);
			};

			function upFn() {
				if(typeof o.on.up === 'function') o.on.up(o);
			};

			return method;
		},

		/* scroll */
		scroll: function(target, option){
			if(!document.querySelector(target)) return console.error('Selector is not defined');

			const pluginName = 'ui-scroll';

			/* default options */
			let o = {
				target: document.querySelector(target),
				controlArea: null,
				scrollRatio: 1,
				axis: 'y',
				effect: {
					type: 'parallax',
					slice: 5,
				},
				nowScroll: 0,
				progress: 0,
				on: {
					init: null,
					scroll: null,
				},
			};

			/* merge */
			for(let i in Object.keys(o)) {
				o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
			};

			/* init */
			o.target.classList.add(pluginName);
			if(typeof o.on.init === 'function') o.on.init(o);

			let controlArea = document.createElement('div'),
				  controlScroll = document.createElement('div');

			controlArea.classList.add('control-area');
			controlArea.style.zIndex = 10;
			controlScroll.style.height = `${o.target.offsetHeight * o.scrollRatio}px`;
			controlArea.appendChild(controlScroll);

			o.target.append(controlArea);
			o.controlArea = document.querySelector('.control-area');

			['x', 'y'].forEach(axis => {
				if(o.axis.indexOf(axis) !== -1) {
					o.controlArea.style[`overflow${axis.toUpperCase()}`] = 'auto';
				} else {
					o.controlArea.style[`overflow${axis.toUpperCase()}`] = 'hidden';
				}
			});

			/* add event */
			o.controlArea.addEventListener('scroll', scrollFn);

			/* merge */
			let method = {
				update: () => {
					['x', 'y'].forEach(axis => {
						if(o.axis.indexOf(axis) !== -1) {
							o.controlArea.style[`overflow${axis.toUpperCase()}`] = 'auto';
						} else {
							o.controlArea.style[`overflow${axis.toUpperCase()}`] = 'hidden';
						}
					});
				},
				destroy: () => {},
			};

			function scrollFn(){
				o.nowScroll = o.controlArea.scrollTop;
				o.progress = o.nowScroll / (o.controlArea.children[0].offsetHeight - o.controlArea.offsetHeight);

				if(o.effect.type === 'parallax'){}
				if(typeof o.on.scroll === 'function') o.on.scroll(o);
				if(typeof o.on.end === 'function' && o.progress > 0.999) o.on.end(o);
			};

			return method;
		},

		/* typing */
		typing: function(target, option) {
			if(!document.querySelector(target)) return console.error('Selector is not defined');

			const pluginName = 'ui-typing';

			/* default options */
			let o = {
				target: document.querySelector(target),
				text: null,
				caret: true,
				element: null,
				br: false,
				duration: 400,
				progress: 0,
				on: {
					init: null,
					append: null,
					destroy: null,
				},
			};

			/* merge */
			for(let i in Object.keys(o)) {
				if(!option) break;
				o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
			};

			/* init */
			o.target.classList.add(pluginName);
			if(o.caret) o.target.classList.add('ui-caret');
			if(typeof o.on.init === 'function') o.on.init(o);

			const typingFn = o => {
				let startTime = null;
				let originContent = o.br ? `${o.target.innerHTML}<br>` : o.target.innerHTML;
				let typingContent = (() => {
					if(o.element) {
						let dom = document.createElement(o.element);
						dom.textContent = o.text;
	
						return dom;
					}
					return o.text;
				})();
	
				let animationLoopFn = timeStamp => {
					if(!startTime) startTime = timeStamp;
					if((timeStamp - startTime) < o.duration) {
						let typeUnit = o.duration / o.text.length;
					
						o.progress = (timeStamp - startTime) / o.duration
						
						o.target.innerHTML = (() => {
							if(o.element) {
								typingContent.textContent = o.text.substring(0, parseInt((timeStamp - startTime) / typeUnit, 10))
								return originContent + typingContent.outerHTML;
							}
							return originContent + typingContent.substring(0, parseInt((timeStamp - startTime) / typeUnit, 10));
						})();
	
						requestAnimationFrame(animationLoopFn);
					} else {
						o.target.innerHTML = (() => {
	
							if(o.element) {
								typingContent.textContent = o.text;
								return originContent + typingContent.outerHTML
							} 
							return originContent + typingContent;
							
						})();
					};
				};
				requestAnimationFrame(animationLoopFn);

				animationLoopFn();
			};


			if(o.text !== null) typingFn(o);

			/* method */
			let method = {
				append: params => {
					for(let i in Object.keys(o)) {
						o[Object.keys(o)[i]] = params[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : params[Object.keys(o)[i]];
					};

					typingFn(o);
				},
				destroy: () => {
					o.target.classList.remove(pluginName);
					o.target.textContent = '';
				},
			};

			return method;
		}
	};

	_window.View    = _view;
	_window.Layot   = _layout;
	_window.Ui      = _ui;
	_window.Pi    	= _pi;

})(this);
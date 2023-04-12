/* device check */
function checkPlatform() {
	const breakPoint = 1024;

	var mobileWords = new Array('Android', 'iPhone', 'iPod', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
	for (var key in mobileWords) {
		if (navigator.userAgent.match(mobileWords[key]) != null && window.innerWidth < breakPoint) {
			return 'mobile';
		}
	}
	return 'pc';
};

/* closest pollyfill */
if( !Element.prototype.matches ){
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if( !Element.prototype.closest ){
	Element.prototype.closest = function(s){
		var el = this;

		do {
			if( el.matches(s) ) return el;
			el = el.parentElement || el.parentNode;
		} while ( el !== null || el.nodeType === 1 ) {
			return null;
		}
	};
}

/* debounce */
function debounce(callback, delay) {
  let setTime;

  return function () {
    clearTimeout(setTime);
    setTime = setTimeout(() => callback.apply(this, arguments), delay);
  };
}

/* throttle */
function throttle(callback, delay) {
  let setTime;
  return function () {
		if (!setTime) {
      setTime = setTimeout(() => {
				callback.apply(this, arguments);
				setTime = null;
			}, delay);
    }
  };
}


/* random position */
function randomPosition(target, option){
	if(!document.querySelector(target)) return console.error('Selector is not defined');

	let o = {
		target: document.querySelector(target),
		container: document.getElementsByTagName('body')[0],
		exclude: null, // temp option
		posY: null,
		posX: null,
		padding: 0,
		margin: 0,
	};

	/* merge */
	for(let i in Object.keys(o)){
		o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
	};


	if(o.exclude) {
		let excPos = {
			x: parseInt(o.exclude.getBoundingClientRect().top + (o.exclude.offsetHeight / 2)),
			y: parseInt(o.exclude.getBoundingClientRect().left + (o.exclude.offsetWidth / 2)) 
		};

		let excBoundLength = Math.max(o.exclude.clientHeight / 2, o.exclude.clientWidth / 2) + o.margin;

		checkExclude();
		
		function checkExclude() {
			let ranPos = {
				y: parseInt(Math.random() * (o.container.offsetHeight - (o.padding * 2))),
				x: parseInt(Math.random() * (o.container.offsetWidth - (o.padding * 2)))
			};
				
			let calcLength = Math.sqrt(Math.pow(ranPos.x - excPos.x, 2) + Math.pow(ranPos.y - excPos.y, 2));

			if (calcLength < excBoundLength) {
				checkExclude();
			} else {
				o.posY = ranPos.x;
				o.posX = ranPos.y;
			}
		}
	} else {
		o.posY = Math.random() * (o.container.offsetHeight - (o.padding * 2));
		o.posX = Math.random() * (o.container.offsetWidth - (o.padding * 2));
	}
	
	o.target.style.top = `${o.padding + o.posY}px`;
	o.target.style.left = `${o.padding + o.posX}px`;
};


/* color animation */
function colorAnimation(target, option) {
	if(!document.querySelector(target)) return console.error('Selector is not defined');

	/* default options */
	let o = {
		target: document.querySelector(target),
		startColor: null,
		endColor: null,
		type: 'animate',
		property: null,
		progress: null,
		duration: 400,
		on: {
			init: null,
			end: null
		}
	};

	/* merge */
	for(let i in Object.keys(o)) {
		o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
	}

	/* init */
	if(typeof o.on.init === 'function') o.on.init(o);

	if(!o.property) o.property = 'backgroundColor';
	if(!o.startColor) o.startColor = getComputedStyle(o.target)[o.property];
	if(!o.endColor) return /* console.error('endColor not defined') */
		
	let startColorValue = convertColorCodeToArray(o.startColor.trim()),
		  endColorValue = convertColorCodeToArray(o.endColor.trim());
			
	let	differColorValue = endColorValue.map((endValue, index) => endValue - startColorValue[index]);

	/* event */
	if(o.type === 'animate'){
		let startTime = null;
		let animationLoopFn = timeStamp => {
			if(!startTime) startTime = timeStamp;
			if((timeStamp - startTime) < o.duration) {
				let progress = (timeStamp - startTime) / o.duration;
				o.target.style[o.property] = `rgba(${startColorValue.map((value, index) => value + parseInt(differColorValue[index] * progress)).join(',')})`;

				requestAnimationFrame(animationLoopFn);
			} else {
				o.target.style[o.property] = `rgba(${endColorValue.join(',')})`;
			};
		};
		requestAnimationFrame(animationLoopFn);
	};

	if(o.type === 'progress') {
		o.target.style[o.property] = `rgba(${startColorValue.map((value, index) => value + parseInt(differColorValue[index] * o.progress)).join(',')})`;
	};

	/* color code to array */
	function convertColorCodeToArray(colorCode){
		if(colorCode.substr(0,1) === '#') {
			if(colorCode.length > 7) console.warn('background code length error')
			colorCode = [parseInt(colorCode.substr(1,2), 16), parseInt(colorCode.substr(3,2),16), parseInt(colorCode.substr(5,2), 16), 1 ];
			for(let i = 0; i < colorCode.length; i++) {
				if(colorCode > 255) console.warn('background code type error');
			};

		} else if(colorCode.substr(0,3) === 'rgb') {
			colorCode = colorCode.slice( colorCode.indexOf('(')+1, colorCode.length-1).split(',');
			for(let i = 0; i < colorCode.length; i ++){
				if(Number(colorCode[i].trim()) > 255) console.warn('background code type error');
				colorCode[i] = Number(colorCode[i].trim());
			};
			if(colorCode.length === 3) colorCode.push(1);

		} else {
			console.warn('background code type error');
		};

		return colorCode;
	};
};

/* path animation */
function pathAnimation(target, option){
	if(!document.querySelector(target)) return console.error('Selector is not defined');
	if(document.querySelector(target).nodeName !== "path") return console.error('Selector is not path');

	/* default options */
	let o = {
		target : document.querySelector(target),
		container : null,
		startPathObject: null,
		endPathObject: null,
		duration : 300,
		scale : 1,
		on : {
			init : null,
			update : null,
			destroy : null,
		}
	};

	/* merge */
	for( let i in Object.keys(o)){
		o[Object.keys(o)[i]] = option[Object.keys(o)[i]] === undefined ? o[Object.keys(o)[i]] : option[Object.keys(o)[i]];
	};

	/* init */
	if(!o.startPathObject) o.startPathObject = convertPathToArray(o.target.getAttribute('d'));

	/* check data format */
	if(
		o.startPathObject.length !== o.endPathObject.length ||
		!o.startPathObject.every((el, index) => {
			return el[Object.keys(el)[0]].length === o.endPathObject[index][Object.keys(o.endPathObject[index])[0]].length
		})
	) return console.error('data format error');

	/* request animation */
	let startTime = null;
	let differPathValue = o.endPathObject.map((el, index) => {
		let obj = {},
				key = Object.keys(el)[0];

		obj[key] = el[key].map((innerEl, innerIndex) => innerEl - o.startPathObject[index][key][innerIndex]);
		return obj;
	});

	let animationLoopFn = timeStamp => {
		if(!startTime) startTime = timeStamp;

		if((timeStamp - startTime) < o.duration) {
			let progress = (timeStamp - startTime) / o.duration;

			o.target.setAttribute("d",
				convertArrayToPath(
					o.startPathObject.map((el, index) => {
						let obj = {},
								key = Object.keys(el)[0];

						obj[key] = el[key].map((innerEl, innerIndex) => innerEl + parseInt(differPathValue[index][key][innerIndex] * progress));
						return obj;
					})
				)
			);

			requestAnimationFrame(animationLoopFn);
		} else {
			o.target.setAttribute("d", convertArrayToPath(o.endPathObject));
		};
	};
	requestAnimationFrame(animationLoopFn);

	/* convert path to object */
	function convertPathToArray(path) {
		let pathArray = [],
				pathIndex = 0;

		path.trim().replace(/\s\s+/g, ' ').split(' ').forEach((value, index) => {
			if(isNaN(value)) {
				let obj = {};
				
				obj[value] = [];
				pathArray.push(obj);

				if(index) pathIndex++;
			} else {
				pathArray[pathIndex][Object.keys(pathArray[pathIndex])[0]].push(parseInt(value));
			}
		});
		return pathArray;
	};

	/* convert object to path */
	function convertArrayToPath(array){
		return array.map(obj => {
			return `${Object.keys(obj)[0]} ${obj[Object.keys(obj)].join(' ')}`
		}).join(' ');
	}
}
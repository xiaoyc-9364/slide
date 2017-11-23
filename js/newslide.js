
function Slide(selector, opts) {		//参数类型：selector-目标元素选择器，opt-包含一个图片信息数组的对象
	this.wrap = document.querySelector(selector);
	this.options = extend(this.defaults, opts)  //复制对象
	this.init();		
}

Slide.prototype.defaults = {	//默认的属性
	imgData: [],
	timeout: 3000,		//轮播器切换的间隔时间
	direction: true,	//轮播器的运动方向 true-正方向，false-反方向
	average: 8			//过渡动画的系数
};

Slide.prototype.init = function() {		//初始方法
	this.createNode();
	this.slideAddEvent();
	this.move(0);	//初始状态跳转至第一张
	this.timer = this.autoPlay();
};

Slide.prototype.createNode = function () {		//创建轮播器的内容
	var thisImgData = this.options.imgData;
	var imgDataLen = thisImgData.length;	//图片个数
	this.width = this.wrap.clientWidth;		//获取目标元素的宽度
	this.oImgUl = document.createElement('ul');	//创建包裹图片的ul
	this.dotUl = document.createElement('ul');	//创建选项卡ul
	var dotStr = '';
	var oLi, oLink, oImg;

	this.wrap.className += 'slide_wrap';	//设置包裹元素的css
	this.oImgUl.className = 'slide_main';		//添加class
	this.dotUl.className = 'slide_tab';

	for (var i = 0; i < imgDataLen; i++) {
		dotStr += "<li></li>";
		oLi = document.createElement('li');		//创建元素
		oLink = document.createElement('a');
		oImg = document.createElement('img');
		oImg.src = thisImgData[i].src;		//<img>属性赋值
		oImg.alt = thisImgData[i].alt;
		oLink.href = thisImgData[i].href;	//<a>属性赋值
		oLink.title = thisImgData[i].title;
		oLink.appendChild(oImg);		//img标签添加到a标签
		oLi.appendChild(oLink);			//a标签添加到li标签
		this.oImgUl.appendChild(oLi);	
	}
	this.dotUl.innerHTML = dotStr;	

	var aImg = this.oImgUl.getElementsByTagName('img');		
	var aFirst = this.oImgUl.children[0].cloneNode(true);  //实现无缝隙，添加一张辅助图片
	this.oImgUl.appendChild(aFirst);
	this.len = this.oImgUl.children.length;
	for (var j = 0; j < this.len; j++) {
		aImg[j].style.width = this.width + 'px';		//设置图片的宽度和包裹元素一致
	}

	this.wrap.appendChild(this.oImgUl);		//将图片和选项卡的ul添加到包裹元素中
	this.wrap.appendChild(this.dotUl);
};

Slide.prototype.slideAddEvent = function () {
	var _this = this;
	var wrapWidth = _this.width;
	var imgChildren = _this.oImgUl.children;
	var dotChildren = _this.dotUl.children;
	var dotLen = dotChildren.length;
	_this.oImgUl.style.width = _this.len * wrapWidth + 'px';		//设置包含图片的ul的宽度

	for (var i = 0; i < _this.len; i++) {
		//设置图片的定位
		imgChildren[i].style.left = (i % _this.len) * wrapWidth + 'px';
		//指示器绑定事件
		(function (i) {		//i作为参数，需使用闭包
			addEvent(dotChildren[i], 'mouseover', function () {
				clearInterval(_this.timer);
				_this.move(i);	//跳转至第i张
			});
			addEvent(dotChildren[i], 'mouseout', function () {
				clearInterval(_this.timer);
				_this.timer = _this.autoPlay();
			});
		})(i % dotLen);	
	}
	//将事件绑定到oImgUl中，避免多次绑定到各图片中影响性能
	addEvent(_this.oImgUl, 'mouseover', function() {
			clearInterval(_this.timer);
	});
	addEvent(_this.oImgUl, 'mouseout', function() {
			clearInterval(_this.timer);
			_this.timer = _this.autoPlay();
	});
};

Slide.prototype.autoPlay = function() {		//自动播放
	var _this = this;
	return  setInterval(function(){
		_this.move(_this.options.direction ? _this.cur + 1 : _this.cur - 1);	
	}, _this.options.timeout);
};

Slide.prototype.move = function(index) {			//跳转图片函数
	var _this = this;
	var wrapWidth = _this.width;
	var images = _this.oImgUl;
	var dotChildren = _this.dotUl.children;
	var dotLen = _this.len - 1;   //因添加了辅助图片，指示器的个数为this.len-1
	if (index === undefined) {	//必须传入参数，否则无法继续运行
		return false;
	}
	_this.cur = index;
	if(_this.cur >= _this.len){  //当图片到最后一张的时候，将oUl的left值设为0重新开始
        images.style.left = 0;
        _this.cur = 1;
    } else if (_this.cur == -1){	//当图片到第一张的时候，将oUl的left值设为最后一张重新开始
        images.style.left = (-dotLen * wrapWidth) + 'px';
        _this.cur = _this.len-2;		//添加了辅助图片需减2
    }
    for (var i = 0; i < dotLen; i++) {	//清除dot的class
		dotChildren[i].className = '';
	}
	dotChildren[_this.cur % dotLen].className = 'active';	//因添加了辅助图片,传入的index有可能大于dotLen
	doMove(images, -(_this.cur) * wrapWidth, 'left', _this.options.average, 30); //调用publicFunction中的运动函数

};

Slide.prototype.paused = function () {		//暂停函数
	clearInterval(this.timer);
};

Slide.prototype.play = function() {			//播放函数
	clearInterval(this.timer);
	this.timer = this.autoPlay();
};

Slide.prototype.go = function(n) {			//间隔n张跳转
	clearInterval(this.timer);
	this.move(this.cur + n);
	this.timer = this.autoPlay();
};

var json = {
	imgData: [
		{title: '百度', alt:'百度', href: 'http://www.baidu.com', src: 'img/1.jpg'},
		{title: '淘宝', alt:'淘宝', href: 'http://www.taobao.com', src: 'img/2.jpg'},
		{title: '京东', alt:'京东', href: 'http://www.jd.com', src: 'img/3.jpg'},
		{title: '慕客', alt:'慕客', href: 'http://www.imooc.com', src: 'img/4.jpg'},
		{title: '搜狗', alt:'搜狗', href: 'http://www.sougou.com', src: 'img/5.jpg'},
		{title: '央视', alt:'央视', href: 'http://www.cctv.com', src: 'img/6.jpg'}
	],
	timeout: 2000,
};
var slider = new Slide('#wrap1', json);	//示例化
var oPausedBtn = document.getElementById('paused');
var oPlayBtn = document.getElementById('play');
var oPrev = document.getElementById('prev');
var oNext = document.getElementById('next');

addEvent(oPausedBtn, 'click', function() {
	slider.paused();
});
addEvent(oPlayBtn, 'click', function() {
	slider.play();
});
addEvent(oPrev, 'click', function() {
	slider.go(-1);
});
addEvent(oNext, 'click', function() {
	slider.go(1);
});



//公用函数
function extend() {	//拷贝对象
	var arg = arguments,
		len = arg.length,
	 	obj = {};
	for (var i = 0; i < len; i++) {
		for (var j in arg[i]) {
			obj[j] = arg[i][j];
		}
	}
	return obj;	
};
function addEvent(elm, type, fn) {	//添加事件
	if (window.addEventListener) {
		return elm.addEventListener(type, fn, false);
	} else if (document.attachEvent) {
		return elm.attachEvent('on' + type, fn);
	} else {
		return elm['on' + type] = fn;
	}
}
function getStyle( obj, stylename ){		//检查样式数值
	return obj.currentStyle ? obj.currentStyle[stylename] : getComputedStyle(obj)[stylename];
}
function doMove(obj,target,stylename,average,cycle,continuefunction){
			// 参数类型:(对象，目标值，改变的样式属性，缓冲系数(速度与大小成反比)，周期时间(速度与大小成反比),回调函数(可有可无)) 
	 clearInterval(obj.timer); 
	 obj.timer=setInterval(function(){ 
		if(stylename=="opacity"){ 
			var offvalue=Math.round(parseFloat(getStyle(obj,stylename))*100); 
			var speed=(target-offvalue)/average; 
			 speed=speed>0?Math.ceil(speed):Math.floor(speed); 
			 if(speed==0){ 
				clearInterval(obj.timer); 
				if(continuefunction) continuefunction(); 
			 }else{ 
				obj.style[stylename]=(offvalue+speed)/100; 
				obj.style.filter="alpha(opacity:"+(offvalue+speed)+")"; 
		 	} 
		}else{ 
			var offvalue=parseInt(getStyle(obj,stylename)); 
			var speed=(target-offvalue)/average; 
			speed=speed>0?Math.ceil(speed):Math.floor(speed); 
			if(speed==0){ 
				clearInterval(obj.timer); 
				if(continuefunction) continuefunction(); 
			}else{ 
				obj.style[stylename]=offvalue+speed+"px"; 
			} 
		} 
	},cycle); 
}
function doMoveCall( obj,attr,dir,target,endFn ){	//元素运动回调传参
	dir = parseInt(getStyle( obj,attr )) < target ? dir : -dir;
	clearInterval( obj.timer );
	obj.timer = setInterval(function(){
		var speed = parseInt(getStyle( obj,attr )) + dir;
		if( speed < target && dir < 0 || speed > target && dir > 0  ) {
			speed = target;
		}
		obj.style[attr] = speed + 'px';
		if( speed == target ) {
			clearInterval( obj.timer );
			endFn && endFn.call( obj );
		}
	},30);
}
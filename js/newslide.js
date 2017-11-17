
function Slide(id, opts) {		//参数类型：id-目标元素，opt-包含一个图片信息数组的对象

	this.wrap = document.getElementById(id);
	var opts = extend(arguments.callee.prototype.defaults, opts)  //复制对象
	for (var i in opts) {	//将复制的对象里属性赋值给this
		this[i] = opts[i];
	}
	this.num = 0;		//计数器
	this.init();		
}
Slide.prototype.concturctor = Slide;
Slide.prototype.defaults = {	//默认的属性
	imgData: [],
	timeout: 3000,		//轮播器切换的间隔时间
	direction: true,	//轮播器的运动方向 true-正方向，false-反方向
	average: 8			//过渡动画的系数
};

Slide.prototype.init = function() {		//初始方法
	this.createNode();
	this.slideMove();
	var _this = this
	this.timer = this.autoPlay();
};

Slide.prototype.createNode = function () {		//创建轮播器的内容
	var len = this.imgData.length;
	var wrapWidth = this.wrap.clientWidth;		//获取目标元素的宽度
	var oImgUl = document.createElement('ul');	//创建包裹图片的ul
	var oTabUl = document.createElement('ul');	//创建选项卡ul
	var str = '';
	var dotstr = '';
	var aImg = oImgUl.getElementsByTagName('img');
	this.wrap.style.cssText += 'overflow: hidden;position: relative;';	//设置包裹元素的css
	oImgUl.className = 'slide_main';		//添加class
	oTabUl.className = 'slide_tab';
	oTabUl.style.zIndex = 2 * len;			//将选项卡的层级设置成2陪的len,保证在最顶层
	for (var i = 0; i < len; i++) {
		str += "<li><a title='" + this.imgData[i].title + "' href='" + this.imgData[i].href + "'><img src='" + this.imgData[i].src +"' alt='" + this.imgData[i].alt + "'/></a></li>";
		dotstr += "<li></li>";
	}
	oImgUl.innerHTML =  str;
	oTabUl.innerHTML = dotstr;
	for (var j = 0; j < len; j++) {
		aImg[j].style.width = wrapWidth + 'px';		//设置图片的宽度和包裹元素一致
	}
	oTabUl.style.marginLeft = -(len * 10 + 10) +'px';
	this.wrap.appendChild(oImgUl);		//将图片和选项卡的ul添加到包裹元素中
	this.wrap.appendChild(oTabUl);
};

Slide.prototype.slideMove = function () {
	var _this = this;
	var oImgUl = this.wrap.getElementsByTagName('ul')[0];
	var oTabUl = this.wrap.getElementsByTagName('ul')[1];
	
	var newFirst = oImgUl.children[0].cloneNode(true);  //实现无缝隙，添加一张辅助图片
	oImgUl.appendChild(newFirst);
	var len = oImgUl.children.length;
	oImgUl.style.width = len * oImgUl.children[0].offsetWidth + 'px';
	for (var i = 0; i < len; i++) {
		//设置图片的定位
		oImgUl.children[i].style.left = (i % len) * oImgUl.children[0].offsetWidth + 'px';
	}
	this.setTab(0);
	for (var j = 0; j < len; j++) {
		oImgUl.children[j].onmouseover = function () {
			clearInterval(_this.timer)
		};
		oImgUl.children[j].onmouseout = function () {
			_this.timer = _this.autoPlay();
		};
	}
	for (var i = 0; i < len-1; i++) {
		oTabUl.children[i].onmouseover = function(event) {
			var target = event.target;
			clearInterval(_this.timer)
			_this.setTab(target.index);
			target.className = 'active';
			_this.num = target.index;
			doMove(oImgUl, -_this.num*_this.wrap.clientWidth, 'left', _this.average, 30);
		};
		oTabUl.children[i].onmouseout = function(event) {
			_this.timer = _this.autoPlay();
		};
	}
	
};
Slide.prototype.setTab = function(index) {	//设置选项卡的显示函数
	var _this = this;
	var oTabUl = this.wrap.getElementsByTagName('ul')[1];
	var len = oTabUl.children.length;
	for (var i = 0; i < len; i++) {
			oTabUl.children[i].index = i;
			oTabUl.children[i].className = '';
	}
	if(oTabUl.children[index])oTabUl.children[index].className = 'active';
		
};
Slide.prototype.autoPlay = function() {		//自动播放
	var _this = this;
	return  setInterval(function(){
		_this.direction ? _this.num++ : _this.num--;
		_this.move()();		//闭包
	}, _this.timeout);
}
Slide.prototype.move = function() {			//滑动函数
	var _this = this;
	var oImgUl = this.wrap.children[0];
	var len = this.wrap.children[0].children.length;
	var step = this.wrap.clientWidth;
	return  function (){
			    if(_this.num == len){  //当图片到最后一张的时候，将oUl的left值设为0重新开始
			        oImgUl.style.left = 0;
			        _this.num = 1;
			    } else if (_this.num == -1){	
			        oImgUl.style.left = (-(len - 1) * step) + 'px';
			        _this.num = len-2;		//添加了辅助图片需减2
			    }
			    _this.setTab(_this.num % (len - 1));
				doMove(oImgUl, -_this.num * step, 'left', _this.average, 30); //调用publicFunction.js中的运动函数
			}
	
};
Slide.prototype.paused = function () {		//暂停函数
	clearInterval(this.timer);
};
Slide.prototype.play = function() {			//播放函数
	clearInterval(this.timer);
	this.timer = this.autoPlay();
};
Slide.prototype.go = function(n) {			//上一张或下一张函数
	clearInterval(this.timer);
	n > 0 ? this.num++ : this.num--;		//当参数大于0为下一张，负数或0为上一张
	this.move()();
}
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
var slider = new Slide('wrap1', json);	//示例化
var oPausedBtn = document.getElementById('paused');
var oPlayBtn = document.getElementById('play');
var oPrev = document.getElementById('prev');
var oNext = document.getElementById('next');
oPausedBtn.onclick = function() {
	slider.paused();
};
oPlayBtn.onclick = function() {
	slider.play();
};
oPrev.onclick = function() {
	slider.go(0);
};
oNext.onclick = function() {
	slider.go(1);
};
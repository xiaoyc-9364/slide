function FlexSlider(id, opts) {		//包裹元素的id，opts包含一个图片路径数组的对象
	var wrap = document.getElementById(id);		//获取包裹元素
	this.oUl = document.createElement('ul');	//创建ul
	var aImg = this.oUl.getElementsByTagName('img');
	var str = '';
	var wrapWidth = wrap.clientWidth;	//获取包裹元素客户区宽度
	this.timer = null;
	this.options = extend(arguments.callee.prototype.defaults, opts);	//拷贝对象
	var len = this.options.arrImg.length;	
	wrap.style.cssText += 'overflow: hidden;position: relative;';	//设置包裹元素的css
	this.oUl.className = 'slide_main';		//ul添加class
	for (var i = 0; i < len; i++) {
		var imgUrl = this.options.arrLink[i] ? 'https://' + this.options.arrLink[i] : 'javascript:void(0);';
		str += "<li><a href='" + imgUrl + "'>"+(''+(i+1))+"<img src='" + this.options.arrImg[i] + "'/></a></li>";
	}
	this.oUl.innerHTML = str;
	//设置图片宽度与包裹元素一致
	for (var j = 0; j < len; j++) {
		aImg[j].style.width = wrapWidth + 'px';
	}
	//将创建的ul添加到包裹元素中
	wrap.appendChild(this.oUl);	
}
FlexSlider.prototype = {
	concturctor: FlexSlider,
	defaults: {
		// type: 'fade',	//轮播模式 淡入淡出-fade，滑动模式-slide
		timeout: 2000,	//轮播速度
		average: 8,		//缓冲系数
		direction: 1, //正方向-1,反方向-0
		paused: false,
		arrLink: []
	},
	slideFade: function() {		//淡入淡出模式
		var num = 0;
		var _this = this;
		_this.timer = autoPlay();
		function autoPlay() {
			return setInterval(fade(_this.oUl), _this.options.timeout); 
		};
		function fade(obj) {
			var len = obj.children.length;
			function setOriginalState(index) {
				for (var k = 0; k < len; k++) {
					//设置定位和层级,透明度,过渡
					setOpacity(obj.children[k], 0);
					obj.children[k].style.cssText += 'transition: all ' + ( _this.options.average / 10 ) + 's;left: 0;top: 0;z-index: 1';
				}
				setOpacity(obj.children[index], 100);
				obj.children[index].style.zIndex = index + len;
			}
			setOriginalState(0);
			return function tabImg(){
					_this.options.direction ? num++ : num-- ; 
					if (num == len) {
						num = 0;
					}
					if (num < 0) {
						num = len - 1;
					}
					setOriginalState(num);
				};
			};
	},
	slideMove: function() {		//滑动模式
		var num = 0;
		var _this = this;
		_this.timer = autoPlay();
		function autoPlay() {
			return setInterval(swipe(_this.oUl), _this.options.timeout); 
		};
		function swipe(obj) {
			var timer = null;
			var newFirst = obj.children[0].cloneNode(true);  //实现无缝隙，添加一张辅助图片
			obj.appendChild(newFirst);
			var aLi = document.getElementsByTagName('li');
			var len = obj.children.length;
			for (var i = 0; i < len; i++) {
				//设置图片的定位
				obj.children[i].style.left = (i % len) * obj.children[0].offsetWidth + 'px';
			}
			function autoPlay(){
				    timer = setInterval(function(){
				    move();
				    },_this.options.timeout);
			}
			return function move(){
				_this.options.direction ? num++ : num-- ; 
			    if(num == len){  //当图片到最后一张的时候，将oUl的left值设为0重新开始
			         obj.style.left = 0;
			        num = 1;
			    } else if (num == -1){
			        obj.style.left = (-(len-1)*obj.children[0].offsetWidth) + 'px';
			        num = len-2;
			    }
				doMove(obj, -num*obj.children[0].offsetWidth, 'left', _this.options.average, 30);
			}
		}
	},
	paused: function() {
		clearInterval(this.timer);
	},
	play: function() {
	},
	tabControl: function() {
		var oTabUl = document.createElement('ul');
		var aLi = oTabUl.getElementsByTagName('li');
		var tabContent = '';
		var len = this.options.arrImg.length;
		for (var i = 0; i < len; i++) {
			tabContent += "<li>" + (i + 1) + "</li>";
		}
		oTabUl.innerHTML = tabContent;
		oTabUl.className = 'clearfix slide_tab';
		oTabUl.style.cssText += "padding:5px 10px;display: flex;justify-content: space-between;positon: absolute;z-index:" + 2 * len;
		for(var j = 0; j < len; j++) {
			aLi[j].style.cssText = 'width: 10px;height: 10px;border-radius: 50%;background:#999; margin:0 5px;';
		}
		this.oUl.parentNode.appendChild(oTabUl);
	}
};
var json = {
	arrImg: ['img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg', 'img/5.jpg', 'img/6.jpg'],
	arrLink: ['www.qq.com', 'www.taobao.com', 'www.jd.com', 'www.ienovo.com', 'www.imooc.com', 'www.sougou.com']
}
var slider1 = new FlexSlider('wrap1', json);
var slider2 = new FlexSlider('wrap2', json);
slider1.slideFade();
slider1.tabControl();
slider2.slideMove();

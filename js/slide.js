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
	this.oUl.className = 'clearfix slide_main';		//ul添加class
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

	//创建选项卡
	this.oTabUl = document.createElement('ul');
	var aTabLi = this.oTabUl.getElementsByTagName('li');
	var tabContent = '';
	for (var i = 0; i < len; i++) {
		tabContent += "<li>" + (i + 1) + "</li>";
	}
	this.oTabUl.innerHTML = tabContent;
	this.oTabUl.className = 'clearfix slide_tab';
	//设置选项卡的层级和左外边距,将选项卡隐藏，需要时调用
	this.oTabUl.style.cssText += "z-index: " + 2 * len + ";display: none;margin-left: " + -(len * 10 + 10) +'px;';
	//将选项卡添加到包裹元素中
	this.oUl.parentNode.appendChild(this.oTabUl);
	(function(index) {
		for (var j = 0; j < len; j++) {
			aTabLi[j].className = '';
		}
		aTabLi[index].className = 'active';
	})(0);
	//将事件委托到选项卡上
	this.oTabUl.addEventListener('mouseover', function(event) {
		var target = event.target;
		if (target.nodeName.toLowerCase() === 'li') {
			for (var j = 0; j < len; j++) {
				aTabLi[j].className = '';
			}
			target.className = 'active';
		}
	}, false)
	console.log(this.oUl.children[3].index);
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
					_this.oUl.children[k].index = k;
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
				obj.children[i].index = i;
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
		this.oTabUl.style.display = 'flex';
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
slider2.tabControl();
slider2.slideMove();

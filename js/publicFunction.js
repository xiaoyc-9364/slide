function getStyle( obj, stylename ){		//检查样式数值
	return obj.currentStyle ? obj.currentStyle[stylename] : getComputedStyle(obj)[stylename];
}
function setOpacity(obj,value){		//设置透明度
	if(document.all){ 
		obj.style.filter = 'alpha(opacity: ' + value + ')';
	}else{            
		obj.style.opacity = value / 100;
	}
}
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

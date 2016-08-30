function myAddEvent(obj,sEv,fn)
{
	if(obj.attachEvent)
	{
		obj.attachEvent("on"+sEv,fn);
		if(false==fn.call(obj))
		{
			event.cancelBubble=true;	//阻止冒泡
			return false;       //阻止默认事件
		}                  		//attachEvent在调用时会默认将this设为window
	}
	else
	{
		obj.addEventListener(sEv,function(ev){
			if(false==fn.call(obj))
			{
				ev.cancelBubble=true;
				ev.preventDefalut();          //火狐下
			}
		},false);
	}
}

function getByClass(oParent,sClass)
{
	var aReslut=[];
	var i=0;
	var aEls=oParent.getElementsByTagName("*");

	for(i=0;i<aEls.length;i++)
	{
		if(aEls[i].className==sClass)
			{
				aReslut.push(aEls[i]);
			}
	}
	return aReslut;
}

function getStyle(obj,attr)
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	else
	{
		return getComputedStyle(obj,false)[attr];
	}
}

function VQuery(vArg){

	this.elements=[];//用来保存被选中元素

	switch(typeof vArg)
	{
		case 'function':
						myAddEvent(window,"load",vArg);
						break;
		
		case 'string':
		switch(vArg.charAt(0)){
			case '#':
					var obj=document.getElementById(vArg.substring(1));
					this.elements.push(obj);
					break;

			case '.':
					this.elements=getByClass(document,vArg.substring(1));
					break;
			
			default: this.elements=document.getElementsByTagName(vArg);
					break;
		}
					break;

			case 'object':
			 		this.elements.push(vArg);
					break;

	}
}

	VQuery.prototype.click=function(fn)
	{
		var i=0;

		for(i=0;i<this.elements.length;i++)
		{
			myAddEvent(this.elements[i],'click',fn);
		}
		return this;
	};

	VQuery.prototype.show=function()
	{
		var i=0;

		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i].style.display='block';
		}
		return this;
	}

	VQuery.prototype.hide=function()
	{
		var i=0;

		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i].style.display='none';
		}
		return this;
	};

	VQuery.prototype.hover=function(fnover,fnout)
	{
		var i=0;

		for(i=0;i<this.elements.length;i++)
		{
			myAddEvent(this.elements[i],'mouseover',fnover);
			myAddEvent(this.elements[i],'mouseout',fnout);
		}
		return this;
	};

	VQuery.prototype.css=function(attr,value)
	{

		if(arguments.length==2)
		{
			for(i=0;i<this.elements.length;i++)
			{
				this.elements[i].style[attr]=value;
			}
		}
		else
		{
			if(typeof attr=='string')
			{

				return getStyle(this.elements[0],attr);
			
			}
			else
			{
				for(i=0;i<this.elements.length;i++)
				{
					

					for(var j in attr)
					{
						this.elements[i].style[j]=attr[j];
					}
				}
			}
		} 
		return this;
	};

VQuery.prototype.toggle=function ()
{
	var i=0;
	var _arguments=arguments;
	
	for(i=0;i<this.elements.length;i++)
	{
		addToggle(this.elements[i]);
	}
	
	function addToggle(obj)
	{
		var count=0;
		myAddEvent(obj, 'click', function (){
			_arguments[count++%_arguments.length].call(obj);
		});
	}
	return this;
};

VQuery.prototype.attr=function (attr, value)
{
	if(arguments.length==2)
	{
		var i=0;
		
		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i][attr]=value;
		}
	}
	else
	{
		return this.elements[0][attr];
	}
	return this;
};

VQuery.prototype.eq=function(n){
	return $(this.elements[n]);
}


function appendArray(arr1,arr2)
	{
		var i=0;
		
		for(i=0;i<arr2.length;i++)
		{
			arr1.push(arr2[i]);
		}
	}

VQuery.prototype.find=function(str)
{
		var i=0;
		var aResult=[];

		for(i=0;i<this.elements.length;i++)
		{
			switch(str.charAt(0)){
				case '.':
						var aEle=getByClass(this.elements[i],str.substring(1));
						aResult=aResult.concat(aEle);
						break;
				default:

						var aEle=this.elements[i].getElementsByTagName(str);
						appendArray(aResult,aEle);
						break;		

			}
		}
		var newVquery=$();

		newVquery.elements=aResult;

		return newVquery;

};

function getIndex(obj)
{
	var i=0;
	var aBrother=obj.parentNode.children;

	for(i=0;i<aBrother.length;i++)
	{
		if(aBrother[i]==obj)
		{
			return i;
		}
	}
	return this;
}

VQuery.prototype.extend=function(name,fn)
{
	VQuery.prototype[name]=fn;
};


VQuery.prototype.index=function(obj)
{
	return getIndex(this.elements[0]);
}

	function $(vArg)
	{

		return new VQuery(vArg);
	}
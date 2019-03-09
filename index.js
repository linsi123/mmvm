// 实现vue的mvvm
function MVVM(options = {}) {

	this.$options = options;

	var data = this._data = this.$options.data;

	observe(data)


	for(const key in data) {
		Object.defineProperty(this,key,{
			enumrable: true,
			get() {
				return this._data[key]
			},
			set(newValue) {
				this._data[key] = newVal
			}
		})
	}


	Compile(this.$options.el,this)

	setTimeout(()=>{
		this.a.b = 'ss'
	},1000)
}



function observe(data) {
	if(typeof data != 'object') return
	return new Observe(data)
}


function Observe(data) {
	let dep = new Dep();   

	for(let key in data) {
		let val = data[key]

		observe(val)

		Object.defineProperty(data,key,{
			enumrable: true,
			get() {
				console.log('get:',Dep.target)
				Dep.target && dep.addSub(Dep.target); 
				return val;
			},
			set(newValue) {
				if(val === newValue) {
					return
				}
				val = newValue
				observe(newValue)
				dep.notify() 
			}
		})
	}
}



function Compile(el,vm) {
	vm.$el = document.querySelector(el)
	let fragment = document.createDocumentFragment()

	let child;	


	while( child = vm.$el.firstChild) {
		fragment.appendChild(child)
	}


	replace(fragment)

    function replace(fragment) {                
		Array.from(fragment.childNodes).forEach(function (node) { 
 		
            let text = node.textContent;    
                     
 			let reg = /\{\{(.*)\}\}/g;   
 			                         
            if (node.nodeType === 3 && reg.test(text)) {
                                             
 				let arr = RegExp.$1.split('.'); 

                let val = vm;              
                              
                arr.forEach(function (k) { 
                    val = val[k]
                })                 
                new Watcher(vm, RegExp.$1, (newValue)=>{
 					node.textContent = text.replace(/\{\{(.*)\}\}/, newValue)
 				})  
 				node.textContent = text.replace(/{{(.*)}}/, val)          


            }                                 
            if (node.childNodes) {
                replace(node)
            }
        })
    }    



	vm.$el.appendChild(fragment)
}



function Dep() {
	this.subs = []
}



Dep.prototype.addSub = function(sub) {
	this.subs.push(sub)
}


Dep.prototype.notify = function(sub) {
	this.subs.forEach( item => item.update())
}


function Watcher(vm, exp, fn) {
	this.fn = fn

	this.vm = vm
	this.exp = exp

	Dep.target = this
    let val = vm;    
    let arr = exp.split('.');    

   arr.forEach(function (k) {
        val = val[k]
    })
 
	Dep.target = null
}

Watcher.prototype.update = function() {
    let val = this.vm;        
 	let arr = this.exp.split('.');

    arr.forEach(function (k) {
        val = val[k]
    })        
 	this.fn(val) 

}

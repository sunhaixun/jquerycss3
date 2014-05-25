/*!
 * jQuery css3 Animation plugin
 * author sunhaixun
 */

 (function($){
 	$.animsit = {
 		version : "0.0.1",
    enabled: true,
 		useAnimationEnd : false
 	};


 	var div = document.createElement('div');
 	var support = {};


  var animQueue = {
    ret : [],
    queue : function(fn) {
      if (fn) {
        this.ret.push(fn);
        console.log(this.ret);
      }
      //第一次自动dequeue
      if (this.ret[0] !== 'runing') {
        this.dequeue();
      }
      
    },
    dequeue : function(){
      var next = this.dequeue;
      var self = this;
      var fn = this.ret.shift();
      if (fn == 'runing') {
        fn = this.ret.shift();
      }
      if (fn) {
        //递归调用
        this.ret.unshift('runing');
        console.log(this.ret);
        fn.call(this, next);
      }


    }
  }
 	//传入animation 得到 chrome webkitAnimation
 	function getVendorPropertyName(prop) {
 		if (prop in div.style) return prop;
 		var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
 		var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);
 		if (prop in div.style) return prop;
 		for  (var i = 0; i < prefixes.length; i++) {
 			var vendorprop = prefixes[i] + prop_;
 			if (vendorprop in div.style) {return vendorprop;}
 		}
 	}

 	// Helper function to check if transform3D is supported.
	// Should return true for Webkits and Firefox 10+.
	function checkTransform3dSupport() {
		div.style[support.transform] = '';
		div.style[support.transform] = 'rotateY(90deg)';
		return div.style[support.transform] !== '';
	}

 	var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

 	  support.animation      = getVendorPropertyName('animation');
  	support.animationDelay = getVendorPropertyName('animationDelay');
  	support.animationName = getVendorPropertyName('animationName');
  	support.animationDirection = getVendorPropertyName('animationDirection');
  	support.animationFillMode = getVendorPropertyName('animationFillMode');
  	support.animationDuration = getVendorPropertyName('animationDuration');
  	support.animationIterationCount = getVendorPropertyName('animationIterationCount');
  	support.animationPlayState = getVendorPropertyName('animationPlayState');
  	support.animationTimingFunction = getVendorPropertyName('animationTimingFunction');
  	support.transform3d     = checkTransform3dSupport();

  	var eventsName = {
  		'animation' : 'animationEnd',
  		'Mozanimation' : 'animationend',
  		'WebkitAnimation' : 'webkitAnimationEnd',
  		'OAnimation' : 'oAnimationEnd',
  		'msAnimation' : 'MSAnimationEnd'
  	}

  	var animationEnd = support.animationEnd = eventsName[support.animation] || null;

  	//添加到jquery静态属性上
  	for (var key in support) {
  		if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
  			$.support[key] = support[key];
  		}
  	}

  	//防止ie内存泄漏
  	div = null;

$.cssEase = {
	'_default':       'ease',
	'in':             'ease-in',
	'out':            'ease-out',
	'in-out':         'ease-in-out',
	'snap':           'cubic-bezier(0,1,.5,1)',
	// Penner equations
	'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
	'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
	'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
	'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
	'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
	'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
	'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
	'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
	'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
	'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
	'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
	'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
	'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
	'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
	'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
	'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
	'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
	'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
	'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
	'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
	'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
	'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
	'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
};

// $.cssHooks.animation = {
// 	get : function(elem) {
// 		return elem.style[support.animation];
// 	},
// 	set : function(elem, value) {
// 		elem.style[support.animation] = value;
// 	}
// }


$.cssHooks['anim:animation'] = {
    get: function(elem) {
      return $(elem).data('animation') || new Animation();
    },
    set: function(elem, v) {
      var value = v;

      if (!(value instanceof Animation)) {
        value = new Animation(value);
      }

      if (support.animation === 'WebkitAnimation') {
        elem.style[support.animation] = value.toString();
      } 

      $(elem).data('animation', value);
    }
  };


registerCssHook('animationName');
registerCssHook('animationDirection');
registerCssHook('animationFillMode');
registerCssHook('animationDuration');
registerCssHook('animationIterationCount');
registerCssHook('animationPlayState');
registerCssHook('animationTimingFunction');
registerCssHook('animationDelay');

function Animation () {
	
}




Animation.prototype = {
    setFromStrings : function(prop, val) {
      var args =
        (typeof val === 'string')  ? val.split(',') :
        (val.constructor === Array) ? val :
        [ val ];

      args.unshift(prop);

      Animation.prototype.set.apply(this, args);
    },

    // ### set()
    // Sets a property.
    //
    //     t.set('scale', 2, 4);
    //
    set: function(prop) {
      var args = Array.prototype.slice.apply(arguments, [1]);
      if (this.setter[prop]) {
        this.setter[prop].apply(this, args);
      } else {
        this[prop] = args.join(',');
      }
    },

    get: function(prop) {
      if (this.getter[prop]) {
        return this.getter[prop].apply(this);
      } else {
        return this[prop] || 0;
      }
    },

    setter: {
      
      animationName: function(theta) {
        this.animationName = theta;
      },

      animationDuration: function(theta) {
        this.animationDuration =  theta;
      },

      animationTimingFunction: function(theta) {
        this.animationTimingFunction = theta;
      },

      animationDelay : function(theta) {
        this.animationDelay = theta;
      },
      
      // ### skewX + skewY
      animationIterationCount: function(theta) {
        this.animationIterationCount = theta;
      },
      animationDirection : function(theta) {
        this.animationDirection = theta;
      },
      animationFillMode: function(theta) {
        this.animationFillMode = theta;
      },

      // ### perspectvie
      animationPlayState: function(theta) {
        this.animationPlayState = theta;
      }

      
    },

    getter: {
      animationName: function() {
        return this.animationName || 'animation';
      },

      animationDirection: function() {
        return this.animationDirection || 'normal';
      },

      animationFillMode: function() {
        return this.animationFillMode || 'normal';
      },

      animationDuration: function() {
        return this.animationDuration;
      },
      animationIterationCount : function() {
      	return this.animationIterationCount || 1;
      },
      animationPlayState : function() {
      	return this.animationPlayState;
      },
      animationTimingFunction : function() {
      	return this.animationTimingFunction;
      }
    },

    toString: function() {
      var re = [];

      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          re.push(this[i]);
        }
      }
      return re.join(" ");
    }
};





$.animation = $.anim = function(elem, properties,startcallback,endcallback) {
    var self  = this;
    var delay = 0;
    var queue = true;
    var animationDuration = properties.animationDuration.replace(/s$/g, '');
    var animationDelay = properties.animationDelay.replace(/s$/g, '');
    var work = $.animsit.enabled && support.animation;
    var i = work ? (parseInt(animationDuration, 10) + parseInt(animationDelay, 10)) : 0;

    

    // Save the old transitions of each element so we can restore it later.
    var oldTransitions = {};

    var run = function(nextCall) {
      console.log('执行');
      var bound = false;

      // Prepare the callback.
      var cb = function() {
        if (bound) { elem[0].removeEventListener(animationEnd, cb); } 
        if (typeof endcallback === 'function' ){endcallback.apply(this)}; 
        if (typeof nextCall === 'function') { nextCall.apply(animQueue);}
      };

      if ((i > 0) && (animationEnd) && ($.animsit.useAnimationEnd)) {
        bound = true;
        elem[0].addEventListener(animationEnd, cb);
      } else {
        
        window.setTimeout(cb, i);
      }

      
      
        if (i > 0) {
          elem.css(properties);
          if (typeof startcallback === 'function' ){startcallback.apply(this)}; 
        //$(this).css(properties);
        }
    };

    
    var deferredRun = function(next) {
        this.offsetWidth; // force a repaint
        run(next);
    };

    
    animQueue.queue(deferredRun);
    return this;
};




function registerCssHook(prop) {
	$.cssHooks[prop] = {
		get : function(elem) {
			var t = $(elem).css('anim:animation');
			return t.get(prop);
		},
		set : function(elem, value) {
			var t = $(elem).css('anim:animation');
			t.setFromStrings(prop, value);
			$(elem).css({'anim:animation' : t});
		}
	}
}

})(jQuery)
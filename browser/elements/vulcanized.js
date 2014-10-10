/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version: 0.4.2
window.PolymerGestures={},function(a){var b=!1,c=document.createElement("meta");if(c.createShadowRoot){var d=c.createShadowRoot(),e=document.createElement("span");d.appendChild(e),c.addEventListener("testpath",function(a){a.path&&(b=a.path[0]===e),a.stopPropagation()});var f=new CustomEvent("testpath",{bubbles:!0});document.head.appendChild(c),e.dispatchEvent(f),c.parentNode.removeChild(c),d=e=null}c=null;var g={shadow:function(a){return a?a.shadowRoot||a.webkitShadowRoot:void 0},canTarget:function(a){return a&&Boolean(a.elementFromPoint)},targetingShadow:function(a){var b=this.shadow(a);return this.canTarget(b)?b:void 0},olderShadow:function(a){var b=a.olderShadowRoot;if(!b){var c=a.querySelector("shadow");c&&(b=c.olderShadowRoot)}return b},allShadows:function(a){for(var b=[],c=this.shadow(a);c;)b.push(c),c=this.olderShadow(c);return b},searchRoot:function(a,b,c){var d,e;return a?(d=a.elementFromPoint(b,c),d?e=this.targetingShadow(d):a!==document&&(e=this.olderShadow(a)),this.searchRoot(e,b,c)||d):void 0},owner:function(a){if(!a)return document;for(var b=a;b.parentNode;)b=b.parentNode;return b.nodeType!=Node.DOCUMENT_NODE&&b.nodeType!=Node.DOCUMENT_FRAGMENT_NODE&&(b=document),b},findTarget:function(a){if(b&&a.path&&a.path.length)return a.path[0];var c=a.clientX,d=a.clientY,e=this.owner(a.target);return e.elementFromPoint(c,d)||(e=document),this.searchRoot(e,c,d)},findTouchAction:function(a){var c;if(b&&a.path&&a.path.length){for(var d=a.path,e=0;e<d.length;e++)if(c=d[e],c.nodeType===Node.ELEMENT_NODE&&c.hasAttribute("touch-action"))return c.getAttribute("touch-action")}else for(c=a.target;c;){if(c.nodeType===Node.ELEMENT_NODE&&c.hasAttribute("touch-action"))return c.getAttribute("touch-action");c=c.parentNode||c.host}return"auto"},LCA:function(a,b){if(a===b)return a;if(a&&!b)return a;if(b&&!a)return b;if(!b&&!a)return document;if(a.contains&&a.contains(b))return a;if(b.contains&&b.contains(a))return b;var c=this.depth(a),d=this.depth(b),e=c-d;for(e>=0?a=this.walk(a,e):b=this.walk(b,-e);a&&b&&a!==b;)a=a.parentNode||a.host,b=b.parentNode||b.host;return a},walk:function(a,b){for(var c=0;a&&b>c;c++)a=a.parentNode||a.host;return a},depth:function(a){for(var b=0;a;)b++,a=a.parentNode||a.host;return b},deepContains:function(a,b){var c=this.LCA(a,b);return c===a},insideNode:function(a,b,c){var d=a.getBoundingClientRect();return d.left<=b&&b<=d.right&&d.top<=c&&c<=d.bottom},path:function(a){var c;if(b&&a.path&&a.path.length)c=a.path;else{c=[];for(var d=this.findTarget(a);d;)c.push(d),d=d.parentNode||d.host}return c}};a.targetFinding=g,a.findTarget=g.findTarget.bind(g),a.deepContains=g.deepContains.bind(g),a.insideNode=g.insideNode}(window.PolymerGestures),function(){function a(a){return"html /deep/ "+b(a)}function b(a){return'[touch-action="'+a+'"]'}function c(a){return"{ -ms-touch-action: "+a+"; touch-action: "+a+";}"}var d=["none","auto","pan-x","pan-y",{rule:"pan-x pan-y",selectors:["pan-x pan-y","pan-y pan-x"]},"manipulation"],e="",f="string"==typeof document.head.style.touchAction,g=!window.ShadowDOMPolyfill&&document.head.createShadowRoot;if(f){d.forEach(function(d){String(d)===d?(e+=b(d)+c(d)+"\n",g&&(e+=a(d)+c(d)+"\n")):(e+=d.selectors.map(b)+c(d.rule)+"\n",g&&(e+=d.selectors.map(a)+c(d.rule)+"\n"))});var h=document.createElement("style");h.textContent=e,document.head.appendChild(h)}}(),function(a){var b=["bubbles","cancelable","view","detail","screenX","screenY","clientX","clientY","ctrlKey","altKey","shiftKey","metaKey","button","relatedTarget","pageX","pageY"],c=[!1,!1,null,null,0,0,0,0,!1,!1,!1,!1,0,null,0,0],d=function(){return function(){}},e={preventTap:d,makeBaseEvent:function(a,b){var c=document.createEvent("Event");return c.initEvent(a,b.bubbles||!1,b.cancelable||!1),c.preventTap=e.preventTap(c),c},makeGestureEvent:function(a,b){b=b||Object.create(null);for(var c,d=this.makeBaseEvent(a,b),e=0,f=Object.keys(b);e<f.length;e++)c=f[e],d[c]=b[c];return d},makePointerEvent:function(a,d){d=d||Object.create(null);for(var e,f=this.makeBaseEvent(a,d),g=0;g<b.length;g++)e=b[g],f[e]=d[e]||c[g];f.buttons=d.buttons||0;var h=0;return h=d.pressure?d.pressure:f.buttons?.5:0,f.x=f.clientX,f.y=f.clientY,f.pointerId=d.pointerId||0,f.width=d.width||0,f.height=d.height||0,f.pressure=h,f.tiltX=d.tiltX||0,f.tiltY=d.tiltY||0,f.pointerType=d.pointerType||"",f.hwTimestamp=d.hwTimestamp||0,f.isPrimary=d.isPrimary||!1,f._source=d._source||"",f}};a.eventFactory=e}(window.PolymerGestures),function(a){function b(){if(c){var a=new Map;return a.pointers=d,a}this.keys=[],this.values=[]}var c=window.Map&&window.Map.prototype.forEach,d=function(){return this.size};b.prototype={set:function(a,b){var c=this.keys.indexOf(a);c>-1?this.values[c]=b:(this.keys.push(a),this.values.push(b))},has:function(a){return this.keys.indexOf(a)>-1},"delete":function(a){var b=this.keys.indexOf(a);b>-1&&(this.keys.splice(b,1),this.values.splice(b,1))},get:function(a){var b=this.keys.indexOf(a);return this.values[b]},clear:function(){this.keys.length=0,this.values.length=0},forEach:function(a,b){this.values.forEach(function(c,d){a.call(b,c,this.keys[d],this)},this)},pointers:function(){return this.keys.length}},a.PointerMap=b}(window.PolymerGestures),function(a){var b,c=["bubbles","cancelable","view","detail","screenX","screenY","clientX","clientY","ctrlKey","altKey","shiftKey","metaKey","button","relatedTarget","buttons","pointerId","width","height","pressure","tiltX","tiltY","pointerType","hwTimestamp","isPrimary","type","target","currentTarget","which","pageX","pageY","timeStamp","preventTap","tapPrevented","_source"],d=[!1,!1,null,null,0,0,0,0,!1,!1,!1,!1,0,null,0,0,0,0,0,0,0,"",0,!1,"",null,null,0,0,0,0,function(){},!1],e="undefined"!=typeof SVGElementInstance,f=a.eventFactory,g={IS_IOS:!1,pointermap:new a.PointerMap,requiredGestures:new a.PointerMap,eventMap:Object.create(null),eventSources:Object.create(null),eventSourceList:[],gestures:[],dependencyMap:{down:{listeners:0,index:-1},up:{listeners:0,index:-1}},gestureQueue:[],registerSource:function(a,b){var c=b,d=c.events;d&&(d.forEach(function(a){c[a]&&(this.eventMap[a]=c[a].bind(c))},this),this.eventSources[a]=c,this.eventSourceList.push(c))},registerGesture:function(a,b){var c=Object.create(null);c.listeners=0,c.index=this.gestures.length;for(var d,e=0;e<b.exposes.length;e++)d=b.exposes[e].toLowerCase(),this.dependencyMap[d]=c;this.gestures.push(b)},register:function(a,b){for(var c,d=this.eventSourceList.length,e=0;d>e&&(c=this.eventSourceList[e]);e++)c.register.call(c,a,b)},unregister:function(a){for(var b,c=this.eventSourceList.length,d=0;c>d&&(b=this.eventSourceList[d]);d++)b.unregister.call(b,a)},down:function(a){this.requiredGestures.set(a.pointerId,b),this.fireEvent("down",a)},move:function(a){a.type="move",this.fillGestureQueue(a)},up:function(a){this.fireEvent("up",a),this.requiredGestures.delete(a.pointerId)},cancel:function(a){a.tapPrevented=!0,this.fireEvent("up",a),this.requiredGestures.delete(a.pointerId)},addGestureDependency:function(a,b){var c=a._pgEvents;if(c)for(var d,e,f,g=Object.keys(c),h=0;h<g.length;h++)f=g[h],c[f]>0&&(d=this.dependencyMap[f],e=d?d.index:-1,b[e]=!0)},eventHandler:function(c){var d=c.type;if("touchstart"===d||"mousedown"===d||"pointerdown"===d||"MSPointerDown"===d)if(c._handledByPG||(b={}),this.IS_IOS)for(var e,f=a.targetFinding.path(c),g=0;g<f.length;g++)e=f[g],this.addGestureDependency(e,b);else this.addGestureDependency(c.currentTarget,b);if(!c._handledByPG){var h=this.eventMap&&this.eventMap[d];h&&h(c),c._handledByPG=!0}},listen:function(a,b){for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.addEvent(a,c)},unlisten:function(a,b){for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.removeEvent(a,c)},addEvent:function(a,b){a.addEventListener(b,this.boundHandler)},removeEvent:function(a,b){a.removeEventListener(b,this.boundHandler)},makeEvent:function(a,b){var c=f.makePointerEvent(a,b);return c.preventDefault=b.preventDefault,c.tapPrevented=b.tapPrevented,c._target=c._target||b.target,c},fireEvent:function(a,b){var c=this.makeEvent(a,b);return this.dispatchEvent(c)},cloneEvent:function(a){for(var b,f=Object.create(null),g=0;g<c.length;g++)b=c[g],f[b]=a[b]||d[g],("target"===b||"relatedTarget"===b)&&e&&f[b]instanceof SVGElementInstance&&(f[b]=f[b].correspondingUseElement);return f.preventDefault=function(){a.preventDefault()},f},dispatchEvent:function(a){var b=a._target;if(b){b.dispatchEvent(a);var c=this.cloneEvent(a);c.target=b,this.fillGestureQueue(c)}},gestureTrigger:function(){for(var a,b,c=0;c<this.gestureQueue.length;c++){a=this.gestureQueue[c],b=a._requiredGestures;for(var d,e,f=0;f<this.gestures.length;f++)b[f]&&(d=this.gestures[f],e=d[a.type],e&&e.call(d,a))}this.gestureQueue.length=0},fillGestureQueue:function(a){this.gestureQueue.length||requestAnimationFrame(this.boundGestureTrigger),a._requiredGestures=this.requiredGestures.get(a.pointerId),this.gestureQueue.push(a)}};g.boundHandler=g.eventHandler.bind(g),g.boundGestureTrigger=g.gestureTrigger.bind(g),a.dispatcher=g,a.activateGesture=function(a,b){var c=b.toLowerCase(),d=g.dependencyMap[c];if(d){var e=g.gestures[d.index];if(a._pgListeners||(g.register(a),a._pgListeners=0),e){var f,h=e.defaultActions&&e.defaultActions[c];switch(a.nodeType){case Node.ELEMENT_NODE:f=a;break;case Node.DOCUMENT_FRAGMENT_NODE:f=a.host;break;default:f=null}h&&f&&!f.hasAttribute("touch-action")&&f.setAttribute("touch-action",h)}a._pgEvents||(a._pgEvents={}),a._pgEvents[c]=(a._pgEvents[c]||0)+1,a._pgListeners++}return Boolean(d)},a.addEventListener=function(b,c,d,e){d&&(a.activateGesture(b,c),b.addEventListener(c,d,e))},a.deactivateGesture=function(a,b){var c=b.toLowerCase(),d=g.dependencyMap[c];return d&&(a._pgListeners>0&&a._pgListeners--,0===a._pgListeners&&g.unregister(a),a._pgEvents&&(a._pgEvents[c]>0?a._pgEvents[c]--:a._pgEvents[c]=0)),Boolean(d)},a.removeEventListener=function(b,c,d,e){d&&(a.deactivateGesture(b,c),b.removeEventListener(c,d,e))}}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d=25,e=[0,1,4,2],f=!1;try{f=1===new MouseEvent("test",{buttons:1}).buttons}catch(g){}var h={POINTER_ID:1,POINTER_TYPE:"mouse",events:["mousedown","mousemove","mouseup"],exposes:["down","up","move"],register:function(a){b.listen(a,this.events)},unregister:function(a){a!==document&&b.unlisten(a,this.events)},lastTouches:[],isEventSimulatedFromTouch:function(a){for(var b,c=this.lastTouches,e=a.clientX,f=a.clientY,g=0,h=c.length;h>g&&(b=c[g]);g++){var i=Math.abs(e-b.x),j=Math.abs(f-b.y);if(d>=i&&d>=j)return!0}},prepareEvent:function(a){var c=b.cloneEvent(a);return c.pointerId=this.POINTER_ID,c.isPrimary=!0,c.pointerType=this.POINTER_TYPE,c._source="mouse",f||(c.buttons=e[c.which]||0),c},mousedown:function(d){if(!this.isEventSimulatedFromTouch(d)){var e=c.has(this.POINTER_ID);e&&this.mouseup(d);var f=this.prepareEvent(d);f.target=a.findTarget(d),c.set(this.POINTER_ID,f.target),b.down(f)}},mousemove:function(a){if(!this.isEventSimulatedFromTouch(a)){var d=c.get(this.POINTER_ID);if(d){var e=this.prepareEvent(a);e.target=d,0===e.buttons?(b.cancel(e),this.cleanupMouse()):b.move(e)}}},mouseup:function(d){if(!this.isEventSimulatedFromTouch(d)){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(this.POINTER_ID),b.up(e),this.cleanupMouse()}},cleanupMouse:function(){c["delete"](this.POINTER_ID)}};a.mouseEvents=h}(window.PolymerGestures),function(a){var b=a.dispatcher,c=(a.targetFinding.allShadows.bind(a.targetFinding),b.pointermap),d=(Array.prototype.map.call.bind(Array.prototype.map),2500),e=200,f=20,g=!1,h={IS_IOS:!1,events:["touchstart","touchmove","touchend","touchcancel"],exposes:["down","up","move"],register:function(a,c){(this.IS_IOS?c:!c)&&b.listen(a,this.events)},unregister:function(a){this.IS_IOS||b.unlisten(a,this.events)},scrollTypes:{EMITTER:"none",XSCROLLER:"pan-x",YSCROLLER:"pan-y"},touchActionToScrollType:function(a){var b=a,c=this.scrollTypes;return b===c.EMITTER?"none":b===c.XSCROLLER?"X":b===c.YSCROLLER?"Y":"XY"},POINTER_TYPE:"touch",firstTouch:null,isPrimaryTouch:function(a){return this.firstTouch===a.identifier},setPrimaryTouch:function(a){(0===c.pointers()||1===c.pointers()&&c.has(1))&&(this.firstTouch=a.identifier,this.firstXY={X:a.clientX,Y:a.clientY},this.scrolling=null,this.cancelResetClickCount())},removePrimaryPointer:function(a){a.isPrimary&&(this.firstTouch=null,this.firstXY=null,this.resetClickCount())},clickCount:0,resetId:null,resetClickCount:function(){var a=function(){this.clickCount=0,this.resetId=null}.bind(this);this.resetId=setTimeout(a,e)},cancelResetClickCount:function(){this.resetId&&clearTimeout(this.resetId)},typeToButtons:function(a){var b=0;return("touchstart"===a||"touchmove"===a)&&(b=1),b},findTarget:function(b,d){if("touchstart"===this.currentTouchEvent.type){if(this.isPrimaryTouch(b)){var e={clientX:b.clientX,clientY:b.clientY,path:this.currentTouchEvent.path,target:this.currentTouchEvent.target};return a.findTarget(e)}return a.findTarget(b)}return c.get(d)},touchToPointer:function(a){var c=this.currentTouchEvent,d=b.cloneEvent(a),e=d.pointerId=a.identifier+2;d.target=this.findTarget(a,e),d.bubbles=!0,d.cancelable=!0,d.detail=this.clickCount,d.buttons=this.typeToButtons(c.type),d.width=a.webkitRadiusX||a.radiusX||0,d.height=a.webkitRadiusY||a.radiusY||0,d.pressure=a.webkitForce||a.force||.5,d.isPrimary=this.isPrimaryTouch(a),d.pointerType=this.POINTER_TYPE,d._source="touch";var f=this;return d.preventDefault=function(){f.scrolling=!1,f.firstXY=null,c.preventDefault()},d},processTouches:function(a,b){var d=a.changedTouches;this.currentTouchEvent=a;for(var e,f,g=0;g<d.length;g++)e=d[g],f=this.touchToPointer(e),"touchstart"===a.type&&c.set(f.pointerId,f.target),c.has(f.pointerId)&&b.call(this,f),("touchend"===a.type||a._cancel)&&this.cleanUpPointer(f)},shouldScroll:function(b){if(this.firstXY){var c,d=a.targetFinding.findTouchAction(b),e=this.touchActionToScrollType(d);if("none"===e)c=!1;else if("XY"===e)c=!0;else{var f=b.changedTouches[0],g=e,h="Y"===e?"X":"Y",i=Math.abs(f["client"+g]-this.firstXY[g]),j=Math.abs(f["client"+h]-this.firstXY[h]);c=i>=j}return c}},findTouch:function(a,b){for(var c,d=0,e=a.length;e>d&&(c=a[d]);d++)if(c.identifier===b)return!0},vacuumTouches:function(a){var b=a.touches;if(c.pointers()>=b.length){var d=[];c.forEach(function(a,c){if(1!==c&&!this.findTouch(b,c-2)){var e=a;d.push(e)}},this),d.forEach(function(a){this.cancel(a),c.delete(a.pointerId)})}},touchstart:function(a){this.vacuumTouches(a),this.setPrimaryTouch(a.changedTouches[0]),this.dedupSynthMouse(a),this.scrolling||(this.clickCount++,this.processTouches(a,this.down))},down:function(a){b.down(a)},touchmove:function(a){if(g)a.cancelable&&this.processTouches(a,this.move);else if(this.scrolling){if(this.firstXY){var b=a.changedTouches[0],c=b.clientX-this.firstXY.X,d=b.clientY-this.firstXY.Y,e=Math.sqrt(c*c+d*d);e>=f&&(this.touchcancel(a),this.scrolling=!0,this.firstXY=null)}}else null===this.scrolling&&this.shouldScroll(a)?this.scrolling=!0:(this.scrolling=!1,a.preventDefault(),this.processTouches(a,this.move))},move:function(a){b.move(a)},touchend:function(a){this.dedupSynthMouse(a),this.processTouches(a,this.up)},up:function(c){c.relatedTarget=a.findTarget(c),b.up(c)},cancel:function(a){b.cancel(a)},touchcancel:function(a){a._cancel=!0,this.processTouches(a,this.cancel)},cleanUpPointer:function(a){c["delete"](a.pointerId),this.removePrimaryPointer(a)},dedupSynthMouse:function(b){var c=a.mouseEvents.lastTouches,e=b.changedTouches[0];if(this.isPrimaryTouch(e)){var f={x:e.clientX,y:e.clientY};c.push(f);var g=function(a,b){var c=a.indexOf(b);c>-1&&a.splice(c,1)}.bind(null,c,f);setTimeout(g,d)}}};a.touchEvents=h}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d=window.MSPointerEvent&&"number"==typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE,e={events:["MSPointerDown","MSPointerMove","MSPointerUp","MSPointerCancel"],register:function(a){b.listen(a,this.events)},unregister:function(a){a!==document&&b.unlisten(a,this.events)},POINTER_TYPES:["","unavailable","touch","pen","mouse"],prepareEvent:function(a){var c=a;return c=b.cloneEvent(a),d&&(c.pointerType=this.POINTER_TYPES[a.pointerType]),c._source="ms",c},cleanup:function(a){c["delete"](a)},MSPointerDown:function(d){var e=this.prepareEvent(d);e.target=a.findTarget(d),c.set(d.pointerId,e.target),b.down(e)},MSPointerMove:function(a){var d=c.get(a.pointerId);if(d){var e=this.prepareEvent(a);e.target=d,b.move(e)}},MSPointerUp:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.up(e),this.cleanup(d.pointerId)},MSPointerCancel:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.cancel(e),this.cleanup(d.pointerId)}};a.msEvents=e}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d={events:["pointerdown","pointermove","pointerup","pointercancel"],prepareEvent:function(a){var c=b.cloneEvent(a);return c._source="pointer",c},register:function(a){b.listen(a,this.events)},unregister:function(a){a!==document&&b.unlisten(a,this.events)},cleanup:function(a){c["delete"](a)},pointerdown:function(d){var e=this.prepareEvent(d);e.target=a.findTarget(d),c.set(e.pointerId,e.target),b.down(e)},pointermove:function(a){var d=c.get(a.pointerId);if(d){var e=this.prepareEvent(a);e.target=d,b.move(e)}},pointerup:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.up(e),this.cleanup(d.pointerId)},pointercancel:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.cancel(e),this.cleanup(d.pointerId)}};a.pointerEvents=d}(window.PolymerGestures),function(a){var b=a.dispatcher,c=window.navigator;window.PointerEvent?b.registerSource("pointer",a.pointerEvents):c.msPointerEnabled?b.registerSource("ms",a.msEvents):(b.registerSource("mouse",a.mouseEvents),void 0!==window.ontouchstart&&b.registerSource("touch",a.touchEvents));var d=navigator.userAgent,e=d.match(/iPad|iPhone|iPod/)&&"ontouchstart"in window;b.IS_IOS=e,a.touchEvents.IS_IOS=e,b.register(document,!0)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d=new a.PointerMap,e={events:["down","move","up"],exposes:["trackstart","track","trackx","tracky","trackend"],defaultActions:{track:"none",trackx:"pan-y",tracky:"pan-x"},WIGGLE_THRESHOLD:4,clampDir:function(a){return a>0?1:-1},calcPositionDelta:function(a,b){var c=0,d=0;return a&&b&&(c=b.pageX-a.pageX,d=b.pageY-a.pageY),{x:c,y:d}},fireTrack:function(a,b,d){var e=d,f=this.calcPositionDelta(e.downEvent,b),g=this.calcPositionDelta(e.lastMoveEvent,b);if(g.x)e.xDirection=this.clampDir(g.x);else if("trackx"===a)return;if(g.y)e.yDirection=this.clampDir(g.y);else if("tracky"===a)return;var h={bubbles:!0,cancelable:!0,trackInfo:e.trackInfo,relatedTarget:b.relatedTarget,pointerType:b.pointerType,pointerId:b.pointerId,_source:"track"};"tracky"!==a&&(h.x=b.x,h.dx=f.x,h.ddx=g.x,h.clientX=b.clientX,h.pageX=b.pageX,h.screenX=b.screenX,h.xDirection=e.xDirection),"trackx"!==a&&(h.dy=f.y,h.ddy=g.y,h.y=b.y,h.clientY=b.clientY,h.pageY=b.pageY,h.screenY=b.screenY,h.yDirection=e.yDirection);var i=c.makeGestureEvent(a,h);e.downTarget.dispatchEvent(i)},down:function(a){if(a.isPrimary&&("mouse"===a.pointerType?1===a.buttons:!0)){var b={downEvent:a,downTarget:a.target,trackInfo:{},lastMoveEvent:null,xDirection:0,yDirection:0,tracking:!1};d.set(a.pointerId,b)}},move:function(a){var b=d.get(a.pointerId);if(b){if(!b.tracking){var c=this.calcPositionDelta(b.downEvent,a),e=c.x*c.x+c.y*c.y;e>this.WIGGLE_THRESHOLD&&(b.tracking=!0,b.lastMoveEvent=b.downEvent,this.fireTrack("trackstart",a,b))}b.tracking&&(this.fireTrack("track",a,b),this.fireTrack("trackx",a,b),this.fireTrack("tracky",a,b)),b.lastMoveEvent=a}},up:function(a){var b=d.get(a.pointerId);b&&(b.tracking&&this.fireTrack("trackend",a,b),d.delete(a.pointerId))}};b.registerGesture("track",e)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d={HOLD_DELAY:200,WIGGLE_THRESHOLD:16,events:["down","move","up"],exposes:["hold","holdpulse","release"],heldPointer:null,holdJob:null,pulse:function(){var a=Date.now()-this.heldPointer.timeStamp,b=this.held?"holdpulse":"hold";this.fireHold(b,a),this.held=!0},cancel:function(){clearInterval(this.holdJob),this.held&&this.fireHold("release"),this.held=!1,this.heldPointer=null,this.target=null,this.holdJob=null},down:function(a){a.isPrimary&&!this.heldPointer&&(this.heldPointer=a,this.target=a.target,this.holdJob=setInterval(this.pulse.bind(this),this.HOLD_DELAY))},up:function(a){this.heldPointer&&this.heldPointer.pointerId===a.pointerId&&this.cancel()},move:function(a){if(this.heldPointer&&this.heldPointer.pointerId===a.pointerId){var b=a.clientX-this.heldPointer.clientX,c=a.clientY-this.heldPointer.clientY;b*b+c*c>this.WIGGLE_THRESHOLD&&this.cancel()}},fireHold:function(a,b){var d={bubbles:!0,cancelable:!0,pointerType:this.heldPointer.pointerType,pointerId:this.heldPointer.pointerId,x:this.heldPointer.clientX,y:this.heldPointer.clientY,_source:"hold"};b&&(d.holdTime=b);var e=c.makeGestureEvent(a,d);this.target.dispatchEvent(e)}};b.registerGesture("hold",d)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d=new a.PointerMap,e={events:["down","up"],exposes:["tap"],down:function(a){a.isPrimary&&!a.tapPrevented&&d.set(a.pointerId,{target:a.target,buttons:a.buttons,x:a.clientX,y:a.clientY})},shouldTap:function(a,b){return"mouse"===a.pointerType?1===b.buttons:!a.tapPrevented},up:function(b){var e=d.get(b.pointerId);if(e&&this.shouldTap(b,e)){var f=a.targetFinding.LCA(e.target,b.relatedTarget);if(f){var g=c.makeGestureEvent("tap",{bubbles:!0,cancelable:!0,x:b.clientX,y:b.clientY,detail:b.detail,pointerType:b.pointerType,pointerId:b.pointerId,altKey:b.altKey,ctrlKey:b.ctrlKey,metaKey:b.metaKey,shiftKey:b.shiftKey,_source:"tap"});f.dispatchEvent(g)}}d.delete(b.pointerId)}};c.preventTap=function(a){return function(){a.tapPrevented=!0,d.delete(a.pointerId)}},b.registerGesture("tap",e)}(window.PolymerGestures),function(a){"use strict";function b(a,b){if(!a)throw new Error("ASSERT: "+b)}function c(a){return a>=48&&57>=a}function d(a){return 32===a||9===a||11===a||12===a||160===a||a>=5760&&"\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\ufeff".indexOf(String.fromCharCode(a))>0}function e(a){return 10===a||13===a||8232===a||8233===a}function f(a){return 36===a||95===a||a>=65&&90>=a||a>=97&&122>=a}function g(a){return 36===a||95===a||a>=65&&90>=a||a>=97&&122>=a||a>=48&&57>=a}function h(a){return"this"===a}function i(){for(;Y>X&&d(W.charCodeAt(X));)++X}function j(){var a,b;for(a=X++;Y>X&&(b=W.charCodeAt(X),g(b));)++X;return W.slice(a,X)}function k(){var a,b,c;return a=X,b=j(),c=1===b.length?S.Identifier:h(b)?S.Keyword:"null"===b?S.NullLiteral:"true"===b||"false"===b?S.BooleanLiteral:S.Identifier,{type:c,value:b,range:[a,X]}}function l(){var a,b,c=X,d=W.charCodeAt(X),e=W[X];switch(d){case 46:case 40:case 41:case 59:case 44:case 123:case 125:case 91:case 93:case 58:case 63:return++X,{type:S.Punctuator,value:String.fromCharCode(d),range:[c,X]};default:if(a=W.charCodeAt(X+1),61===a)switch(d){case 37:case 38:case 42:case 43:case 45:case 47:case 60:case 62:case 124:return X+=2,{type:S.Punctuator,value:String.fromCharCode(d)+String.fromCharCode(a),range:[c,X]};case 33:case 61:return X+=2,61===W.charCodeAt(X)&&++X,{type:S.Punctuator,value:W.slice(c,X),range:[c,X]}}}return b=W[X+1],e===b&&"&|".indexOf(e)>=0?(X+=2,{type:S.Punctuator,value:e+b,range:[c,X]}):"<>=!+-*%&|^/".indexOf(e)>=0?(++X,{type:S.Punctuator,value:e,range:[c,X]}):void s({},V.UnexpectedToken,"ILLEGAL")}function m(){var a,d,e;if(e=W[X],b(c(e.charCodeAt(0))||"."===e,"Numeric literal must start with a decimal digit or a decimal point"),d=X,a="","."!==e){for(a=W[X++],e=W[X],"0"===a&&e&&c(e.charCodeAt(0))&&s({},V.UnexpectedToken,"ILLEGAL");c(W.charCodeAt(X));)a+=W[X++];e=W[X]}if("."===e){for(a+=W[X++];c(W.charCodeAt(X));)a+=W[X++];e=W[X]}if("e"===e||"E"===e)if(a+=W[X++],e=W[X],("+"===e||"-"===e)&&(a+=W[X++]),c(W.charCodeAt(X)))for(;c(W.charCodeAt(X));)a+=W[X++];else s({},V.UnexpectedToken,"ILLEGAL");return f(W.charCodeAt(X))&&s({},V.UnexpectedToken,"ILLEGAL"),{type:S.NumericLiteral,value:parseFloat(a),range:[d,X]}}function n(){var a,c,d,f="",g=!1;for(a=W[X],b("'"===a||'"'===a,"String literal must starts with a quote"),c=X,++X;Y>X;){if(d=W[X++],d===a){a="";break}if("\\"===d)if(d=W[X++],d&&e(d.charCodeAt(0)))"\r"===d&&"\n"===W[X]&&++X;else switch(d){case"n":f+="\n";break;case"r":f+="\r";break;case"t":f+="	";break;case"b":f+="\b";break;case"f":f+="\f";break;case"v":f+="";break;default:f+=d}else{if(e(d.charCodeAt(0)))break;f+=d}}return""!==a&&s({},V.UnexpectedToken,"ILLEGAL"),{type:S.StringLiteral,value:f,octal:g,range:[c,X]}}function o(a){return a.type===S.Identifier||a.type===S.Keyword||a.type===S.BooleanLiteral||a.type===S.NullLiteral}function p(){var a;return i(),X>=Y?{type:S.EOF,range:[X,X]}:(a=W.charCodeAt(X),40===a||41===a||58===a?l():39===a||34===a?n():f(a)?k():46===a?c(W.charCodeAt(X+1))?m():l():c(a)?m():l())}function q(){var a;return a=$,X=a.range[1],$=p(),X=a.range[1],a}function r(){var a;a=X,$=p(),X=a}function s(a,c){var d,e=Array.prototype.slice.call(arguments,2),f=c.replace(/%(\d)/g,function(a,c){return b(c<e.length,"Message reference must be in range"),e[c]});throw d=new Error(f),d.index=X,d.description=f,d}function t(a){s(a,V.UnexpectedToken,a.value)}function u(a){var b=q();(b.type!==S.Punctuator||b.value!==a)&&t(b)}function v(a){return $.type===S.Punctuator&&$.value===a}function w(a){return $.type===S.Keyword&&$.value===a}function x(){var a=[];for(u("[");!v("]");)v(",")?(q(),a.push(null)):(a.push(bb()),v("]")||u(","));return u("]"),Z.createArrayExpression(a)}function y(){var a;return i(),a=q(),a.type===S.StringLiteral||a.type===S.NumericLiteral?Z.createLiteral(a):Z.createIdentifier(a.value)}function z(){var a,b;return a=$,i(),(a.type===S.EOF||a.type===S.Punctuator)&&t(a),b=y(),u(":"),Z.createProperty("init",b,bb())}function A(){var a=[];for(u("{");!v("}");)a.push(z()),v("}")||u(",");return u("}"),Z.createObjectExpression(a)}function B(){var a;return u("("),a=bb(),u(")"),a}function C(){var a,b,c;return v("(")?B():(a=$.type,a===S.Identifier?c=Z.createIdentifier(q().value):a===S.StringLiteral||a===S.NumericLiteral?c=Z.createLiteral(q()):a===S.Keyword?w("this")&&(q(),c=Z.createThisExpression()):a===S.BooleanLiteral?(b=q(),b.value="true"===b.value,c=Z.createLiteral(b)):a===S.NullLiteral?(b=q(),b.value=null,c=Z.createLiteral(b)):v("[")?c=x():v("{")&&(c=A()),c?c:void t(q()))}function D(){var a=[];if(u("("),!v(")"))for(;Y>X&&(a.push(bb()),!v(")"));)u(",");return u(")"),a}function E(){var a;return a=q(),o(a)||t(a),Z.createIdentifier(a.value)}function F(){return u("."),E()}function G(){var a;return u("["),a=bb(),u("]"),a}function H(){var a,b,c;for(a=C();;)if(v("["))c=G(),a=Z.createMemberExpression("[",a,c);else if(v("."))c=F(),a=Z.createMemberExpression(".",a,c);else{if(!v("("))break;b=D(),a=Z.createCallExpression(a,b)}return a}function I(){var a,b;return $.type!==S.Punctuator&&$.type!==S.Keyword?b=ab():v("+")||v("-")||v("!")?(a=q(),b=I(),b=Z.createUnaryExpression(a.value,b)):w("delete")||w("void")||w("typeof")?s({},V.UnexpectedToken):b=ab(),b}function J(a){var b=0;if(a.type!==S.Punctuator&&a.type!==S.Keyword)return 0;switch(a.value){case"||":b=1;break;case"&&":b=2;break;case"==":case"!=":case"===":case"!==":b=6;break;case"<":case">":case"<=":case">=":case"instanceof":b=7;break;case"in":b=7;break;case"+":case"-":b=9;break;case"*":case"/":case"%":b=11}return b}function K(){var a,b,c,d,e,f,g,h;if(g=I(),b=$,c=J(b),0===c)return g;for(b.prec=c,q(),e=I(),d=[g,b,e];(c=J($))>0;){for(;d.length>2&&c<=d[d.length-2].prec;)e=d.pop(),f=d.pop().value,g=d.pop(),a=Z.createBinaryExpression(f,g,e),d.push(a);b=q(),b.prec=c,d.push(b),a=I(),d.push(a)}for(h=d.length-1,a=d[h];h>1;)a=Z.createBinaryExpression(d[h-1].value,d[h-2],a),h-=2;return a}function L(){var a,b,c;return a=K(),v("?")&&(q(),b=L(),u(":"),c=L(),a=Z.createConditionalExpression(a,b,c)),a}function M(){var a,b;return a=q(),a.type!==S.Identifier&&t(a),b=v("(")?D():[],Z.createFilter(a.value,b)}function N(){for(;v("|");)q(),M()}function O(){i(),r();var a=bb();a&&(","===$.value||"in"==$.value&&a.type===U.Identifier?Q(a):(N(),"as"===$.value?P(a):Z.createTopLevel(a))),$.type!==S.EOF&&t($)}function P(a){q();var b=q().value;Z.createAsExpression(a,b)}function Q(a){var b;","===$.value&&(q(),$.type!==S.Identifier&&t($),b=q().value),q();var c=bb();N(),Z.createInExpression(a.name,b,c)}function R(a,b){return Z=b,W=a,X=0,Y=W.length,$=null,_={labelSet:{}},O()}var S,T,U,V,W,X,Y,Z,$,_;S={BooleanLiteral:1,EOF:2,Identifier:3,Keyword:4,NullLiteral:5,NumericLiteral:6,Punctuator:7,StringLiteral:8},T={},T[S.BooleanLiteral]="Boolean",T[S.EOF]="<end>",T[S.Identifier]="Identifier",T[S.Keyword]="Keyword",T[S.NullLiteral]="Null",T[S.NumericLiteral]="Numeric",T[S.Punctuator]="Punctuator",T[S.StringLiteral]="String",U={ArrayExpression:"ArrayExpression",BinaryExpression:"BinaryExpression",CallExpression:"CallExpression",ConditionalExpression:"ConditionalExpression",EmptyStatement:"EmptyStatement",ExpressionStatement:"ExpressionStatement",Identifier:"Identifier",Literal:"Literal",LabeledStatement:"LabeledStatement",LogicalExpression:"LogicalExpression",MemberExpression:"MemberExpression",ObjectExpression:"ObjectExpression",Program:"Program",Property:"Property",ThisExpression:"ThisExpression",UnaryExpression:"UnaryExpression"},V={UnexpectedToken:"Unexpected token %0",UnknownLabel:"Undefined label '%0'",Redeclaration:"%0 '%1' has already been declared"};var ab=H,bb=L;a.esprima={parse:R}}(this),function(a){"use strict";function b(a,b,d,e){var f;try{if(f=c(a),f.scopeIdent&&(d.nodeType!==Node.ELEMENT_NODE||"TEMPLATE"!==d.tagName||"bind"!==b&&"repeat"!==b))throw Error("as and in can only be used within <template bind/repeat>")}catch(g){return void console.error("Invalid expression syntax: "+a,g)}return function(a,b,c){var d=f.getBinding(a,e,c);return f.scopeIdent&&d&&(b.polymerExpressionScopeIdent_=f.scopeIdent,f.indexIdent&&(b.polymerExpressionIndexIdent_=f.indexIdent)),d}}function c(a){var b=q[a];if(!b){var c=new j;esprima.parse(a,c),b=new l(c),q[a]=b}return b}function d(a){this.value=a,this.valueFn_=void 0}function e(a){this.name=a,this.path=Path.get(a)}function f(a,b,c){this.computed="["==c,this.dynamicDeps="function"==typeof a||a.dynamicDeps||this.computed&&!(b instanceof d),this.simplePath=!this.dynamicDeps&&(b instanceof e||b instanceof d)&&(a instanceof f||a instanceof e),this.object=this.simplePath?a:i(a),this.property=!this.computed||this.simplePath?b:i(b)}function g(a,b){this.name=a,this.args=[];for(var c=0;c<b.length;c++)this.args[c]=i(b[c])}function h(){throw Error("Not Implemented")}function i(a){return"function"==typeof a?a:a.valueFn()}function j(){this.expression=null,this.filters=[],this.deps={},this.currentPath=void 0,this.scopeIdent=void 0,this.indexIdent=void 0,this.dynamicDeps=!1}function k(a){this.value_=a}function l(a){if(this.scopeIdent=a.scopeIdent,this.indexIdent=a.indexIdent,!a.expression)throw Error("No expression found.");this.expression=a.expression,i(this.expression),this.filters=a.filters,this.dynamicDeps=a.dynamicDeps}function m(a){return String(a).replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()})}function n(a,b){for(;a[t]&&!Object.prototype.hasOwnProperty.call(a,b);)a=a[t];return a}function o(a){switch(a){case"":return!1;case"false":case"null":case"true":return!0}return isNaN(Number(a))?!1:!0}function p(){}var q=Object.create(null);d.prototype={valueFn:function(){if(!this.valueFn_){var a=this.value;this.valueFn_=function(){return a}}return this.valueFn_}},e.prototype={valueFn:function(){if(!this.valueFn_){var a=(this.name,this.path);this.valueFn_=function(b,c){return c&&c.addPath(b,a),a.getValueFrom(b)}}return this.valueFn_},setValue:function(a,b){return 1==this.path.length,a=n(a,this.path[0]),this.path.setValueFrom(a,b)}},f.prototype={get fullPath(){if(!this.fullPath_){var a=this.object instanceof f?this.object.fullPath.slice():[this.object.name];
a.push(this.property instanceof e?this.property.name:this.property.value),this.fullPath_=Path.get(a)}return this.fullPath_},valueFn:function(){if(!this.valueFn_){var a=this.object;if(this.simplePath){var b=this.fullPath;this.valueFn_=function(a,c){return c&&c.addPath(a,b),b.getValueFrom(a)}}else if(this.computed){var c=this.property;this.valueFn_=function(b,d,e){var f=a(b,d,e),g=c(b,d,e);return d&&d.addPath(f,[g]),f?f[g]:void 0}}else{var b=Path.get(this.property.name);this.valueFn_=function(c,d,e){var f=a(c,d,e);return d&&d.addPath(f,b),b.getValueFrom(f)}}}return this.valueFn_},setValue:function(a,b){if(this.simplePath)return this.fullPath.setValueFrom(a,b),b;var c=this.object(a),d=this.property instanceof e?this.property.name:this.property(a);return c[d]=b}},g.prototype={transform:function(a,b,c,d,e){var f=c[this.name],g=a;if(f)g=void 0;else if(f=g[this.name],!f)return void console.error("Cannot find function or filter: "+this.name);if(d?f=f.toModel:"function"==typeof f.toDOM&&(f=f.toDOM),"function"!=typeof f)return void console.error("Cannot find function or filter: "+this.name);for(var h=e||[],j=0;j<this.args.length;j++)h.push(i(this.args[j])(a,b,c));return f.apply(g,h)}};var r={"+":function(a){return+a},"-":function(a){return-a},"!":function(a){return!a}},s={"+":function(a,b){return a+b},"-":function(a,b){return a-b},"*":function(a,b){return a*b},"/":function(a,b){return a/b},"%":function(a,b){return a%b},"<":function(a,b){return b>a},">":function(a,b){return a>b},"<=":function(a,b){return b>=a},">=":function(a,b){return a>=b},"==":function(a,b){return a==b},"!=":function(a,b){return a!=b},"===":function(a,b){return a===b},"!==":function(a,b){return a!==b},"&&":function(a,b){return a&&b},"||":function(a,b){return a||b}};j.prototype={createUnaryExpression:function(a,b){if(!r[a])throw Error("Disallowed operator: "+a);return b=i(b),function(c,d,e){return r[a](b(c,d,e))}},createBinaryExpression:function(a,b,c){if(!s[a])throw Error("Disallowed operator: "+a);switch(b=i(b),c=i(c),a){case"||":return this.dynamicDeps=!0,function(a,d,e){return b(a,d,e)||c(a,d,e)};case"&&":return this.dynamicDeps=!0,function(a,d,e){return b(a,d,e)&&c(a,d,e)}}return function(d,e,f){return s[a](b(d,e,f),c(d,e,f))}},createConditionalExpression:function(a,b,c){return a=i(a),b=i(b),c=i(c),this.dynamicDeps=!0,function(d,e,f){return a(d,e,f)?b(d,e,f):c(d,e,f)}},createIdentifier:function(a){var b=new e(a);return b.type="Identifier",b},createMemberExpression:function(a,b,c){var d=new f(b,c,a);return d.dynamicDeps&&(this.dynamicDeps=!0),d},createCallExpression:function(a,b){if(!(a instanceof e))throw Error("Only identifier function invocations are allowed");var c=new g(a.name,b);return function(a,b,d){return c.transform(a,b,d,!1)}},createLiteral:function(a){return new d(a.value)},createArrayExpression:function(a){for(var b=0;b<a.length;b++)a[b]=i(a[b]);return function(b,c,d){for(var e=[],f=0;f<a.length;f++)e.push(a[f](b,c,d));return e}},createProperty:function(a,b,c){return{key:b instanceof e?b.name:b.value,value:c}},createObjectExpression:function(a){for(var b=0;b<a.length;b++)a[b].value=i(a[b].value);return function(b,c,d){for(var e={},f=0;f<a.length;f++)e[a[f].key]=a[f].value(b,c,d);return e}},createFilter:function(a,b){this.filters.push(new g(a,b))},createAsExpression:function(a,b){this.expression=a,this.scopeIdent=b},createInExpression:function(a,b,c){this.expression=c,this.scopeIdent=a,this.indexIdent=b},createTopLevel:function(a){this.expression=a},createThisExpression:h},k.prototype={open:function(){return this.value_},discardChanges:function(){return this.value_},deliver:function(){},close:function(){}},l.prototype={getBinding:function(a,b,c){function d(){if(h)return h=!1,g;i.dynamicDeps&&f.startReset();var c=i.getValue(a,i.dynamicDeps?f:void 0,b);return i.dynamicDeps&&f.finishReset(),c}function e(c){return i.setValue(a,c,b),c}if(c)return this.getValue(a,void 0,b);var f=new CompoundObserver,g=this.getValue(a,f,b),h=!0,i=this;return new ObserverTransform(f,d,e,!0)},getValue:function(a,b,c){for(var d=i(this.expression)(a,b,c),e=0;e<this.filters.length;e++)d=this.filters[e].transform(a,b,c,!1,[d]);return d},setValue:function(a,b,c){for(var d=this.filters?this.filters.length:0;d-->0;)b=this.filters[d].transform(a,void 0,c,!0,[b]);return this.expression.setValue?this.expression.setValue(a,b):void 0}};var t="@"+Math.random().toString(36).slice(2);p.prototype={styleObject:function(a){var b=[];for(var c in a)b.push(m(c)+": "+a[c]);return b.join("; ")},tokenList:function(a){var b=[];for(var c in a)a[c]&&b.push(c);return b.join(" ")},prepareInstancePositionChanged:function(a){var b=a.polymerExpressionIndexIdent_;if(b)return function(a,c){a.model[b]=c}},prepareBinding:function(a,c,d){var e=Path.get(a);{if(o(a)||!e.valid)return b(a,c,d,this);if(1==e.length)return function(a,b,c){if(c)return e.getValueFrom(a);var d=n(a,e[0]);return new PathObserver(d,e)}}},prepareInstanceModel:function(a){var b=a.polymerExpressionScopeIdent_;if(b){var c=a.templateInstance?a.templateInstance.model:a.model,d=a.polymerExpressionIndexIdent_;return function(a){return u(c,a,b,d)}}}};var u="__proto__"in{}?function(a,b,c,d){var e={};return e[c]=b,e[d]=void 0,e[t]=a,e.__proto__=a,e}:function(a,b,c,d){var e=Object.create(a);return Object.defineProperty(e,c,{value:b,configurable:!0,writable:!0}),Object.defineProperty(e,d,{value:void 0,configurable:!0,writable:!0}),Object.defineProperty(e,t,{value:a,configurable:!0,writable:!0}),e};a.PolymerExpressions=p,p.getExpression=c}(this),Polymer={version:"0.4.2"},"function"==typeof window.Polymer&&(Polymer={}),window.Platform||(logFlags=window.logFlags||{},Platform={flush:function(){}},CustomElements={useNative:!0,ready:!0,takeRecords:function(){},"instanceof":function(a,b){return a instanceof b}},HTMLImports={useNative:!0},addEventListener("HTMLImportsLoaded",function(){document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0}))}),ShadowDOMPolyfill=null,wrap=unwrap=function(a){return a}),function(a){function b(a,b){b=b||q,d(function(){f(a,b)},b)}function c(a){return"complete"===a.readyState||a.readyState===s}function d(a,b){if(c(b))a&&a();else{var e=function(){("complete"===b.readyState||b.readyState===s)&&(b.removeEventListener(t,e),d(a,b))};b.addEventListener(t,e)}}function e(a){a.target.__loaded=!0}function f(a,b){function c(){h==i&&a&&a()}function d(a){e(a),h++,c()}var f=b.querySelectorAll("link[rel=import]"),h=0,i=f.length;if(i)for(var j,k=0;i>k&&(j=f[k]);k++)g(j)?d.call(j,{target:j}):(j.addEventListener("load",d),j.addEventListener("error",d));else c()}function g(a){return m?a.__loaded||a.import&&"loading"!==a.import.readyState:a.__importParsed}function h(a){for(var b,c=0,d=a.length;d>c&&(b=a[c]);c++)i(b)&&j(b)}function i(a){return"link"===a.localName&&"import"===a.rel}function j(a){var b=a.import;b?e({target:a}):(a.addEventListener("load",e),a.addEventListener("error",e))}var k="import",l=k in document.createElement("link"),m=l,n=/Trident/.test(navigator.userAgent),o=Boolean(window.ShadowDOMPolyfill),p=function(a){return o?ShadowDOMPolyfill.wrapIfNeeded(a):a},q=p(document),r={get:function(){var a=HTMLImports.currentScript||document.currentScript||("complete"!==document.readyState?document.scripts[document.scripts.length-1]:null);return p(a)},configurable:!0};Object.defineProperty(document,"_currentScript",r),Object.defineProperty(q,"_currentScript",r);var s=n?"complete":"interactive",t="readystatechange";m&&(new MutationObserver(function(a){for(var b,c=0,d=a.length;d>c&&(b=a[c]);c++)b.addedNodes&&h(b.addedNodes)}).observe(document.head,{childList:!0}),function(){if("loading"===document.readyState)for(var a,b=document.querySelectorAll("link[rel=import]"),c=0,d=b.length;d>c&&(a=b[c]);c++)j(a)}()),b(function(){HTMLImports.ready=!0,HTMLImports.readyTime=(new Date).getTime(),q.dispatchEvent(new CustomEvent("HTMLImportsLoaded",{bubbles:!0}))}),a.useNative=m,a.isImportLoaded=g,a.whenReady=b,a.rootDocument=q,a.IMPORT_LINK_TYPE=k,a.isIE=n}(window.HTMLImports),function(a){function b(a,b){return b=b||[],b.map||(b=[b]),a.apply(this,b.map(d))}function c(a,c,d){var e;switch(arguments.length){case 0:return;case 1:e=null;break;case 2:e=c.apply(this);break;default:e=b(d,c)}f[a]=e}function d(a){return f[a]}function e(a,c){HTMLImports.whenImportsReady(function(){b(c,a)})}var f={};a.marshal=d,a.modularize=c,a.using=e}(window),function(){var a=document.createElement("style");a.textContent="body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; } \n";var b=document.querySelector("head");b.insertBefore(a,b.firstChild)}(Platform),function(a){"use strict";function b(){function a(a){b=a}if("function"!=typeof Object.observe||"function"!=typeof Array.observe)return!1;var b=[],c={},d=[];return Object.observe(c,a),Array.observe(d,a),c.id=1,c.id=2,delete c.id,d.push(1,2),d.length=0,Object.deliverChangeRecords(a),5!==b.length?!1:"add"!=b[0].type||"update"!=b[1].type||"delete"!=b[2].type||"splice"!=b[3].type||"splice"!=b[4].type?!1:(Object.unobserve(c,a),Array.unobserve(d,a),!0)}function c(){if("undefined"!=typeof chrome&&chrome.app&&chrome.app.runtime)return!1;if("undefined"!=typeof navigator&&navigator.getDeviceStorage)return!1;try{var a=new Function("","return true;");return a()}catch(b){return!1}}function d(a){return+a===a>>>0&&""!==a}function e(a){return+a}function f(a){return a===Object(a)}function g(a,b){return a===b?0!==a||1/a===1/b:R(a)&&R(b)?!0:a!==a&&b!==b}function h(a){if(void 0===a)return"eof";var b=a.charCodeAt(0);switch(b){case 91:case 93:case 46:case 34:case 39:case 48:return a;case 95:case 36:return"ident";case 32:case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"ws"}return b>=97&&122>=b||b>=65&&90>=b?"ident":b>=49&&57>=b?"number":"else"}function i(){}function j(a){function b(){if(!(m>=a.length)){var b=a[m+1];return"inSingleQuote"==n&&"'"==b||"inDoubleQuote"==n&&'"'==b?(m++,d=b,o.append(),!0):void 0}}for(var c,d,e,f,g,j,k,l=[],m=-1,n="beforePath",o={push:function(){void 0!==e&&(l.push(e),e=void 0)},append:function(){void 0===e?e=d:e+=d}};n;)if(m++,c=a[m],"\\"!=c||!b(n)){if(f=h(c),k=W[n],g=k[f]||k["else"]||"error","error"==g)return;if(n=g[0],j=o[g[1]]||i,d=void 0===g[2]?c:g[2],j(),"afterPath"===n)return l}}function k(a){return V.test(a)}function l(a,b){if(b!==X)throw Error("Use Path.get to retrieve path objects");for(var c=0;c<a.length;c++)this.push(String(a[c]));Q&&this.length&&(this.getValueFrom=this.compiledGetValueFromFn())}function m(a){if(a instanceof l)return a;if((null==a||0==a.length)&&(a=""),"string"!=typeof a){if(d(a.length))return new l(a,X);a=String(a)}var b=Y[a];if(b)return b;var c=j(a);if(!c)return Z;var b=new l(c,X);return Y[a]=b,b}function n(a){return d(a)?"["+a+"]":'["'+a.replace(/"/g,'\\"')+'"]'}function o(b){for(var c=0;_>c&&b.check_();)c++;return O&&(a.dirtyCheckCycleCount=c),c>0}function p(a){for(var b in a)return!1;return!0}function q(a){return p(a.added)&&p(a.removed)&&p(a.changed)}function r(a,b){var c={},d={},e={};for(var f in b){var g=a[f];(void 0===g||g!==b[f])&&(f in a?g!==b[f]&&(e[f]=g):d[f]=void 0)}for(var f in a)f in b||(c[f]=a[f]);return Array.isArray(a)&&a.length!==b.length&&(e.length=a.length),{added:c,removed:d,changed:e}}function s(){if(!ab.length)return!1;for(var a=0;a<ab.length;a++)ab[a]();return ab.length=0,!0}function t(){function a(a){b&&b.state_===fb&&!d&&b.check_(a)}var b,c,d=!1,e=!0;return{open:function(c){if(b)throw Error("ObservedObject in use");e||Object.deliverChangeRecords(a),b=c,e=!1},observe:function(b,d){c=b,d?Array.observe(c,a):Object.observe(c,a)},deliver:function(b){d=b,Object.deliverChangeRecords(a),d=!1},close:function(){b=void 0,Object.unobserve(c,a),cb.push(this)}}}function u(a,b,c){var d=cb.pop()||t();return d.open(a),d.observe(b,c),d}function v(){function a(b,f){b&&(b===d&&(e[f]=!0),h.indexOf(b)<0&&(h.push(b),Object.observe(b,c)),a(Object.getPrototypeOf(b),f))}function b(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.object!==d||e[c.name]||"setPrototype"===c.type)return!1}return!0}function c(c){if(!b(c)){for(var d,e=0;e<g.length;e++)d=g[e],d.state_==fb&&d.iterateObjects_(a);for(var e=0;e<g.length;e++)d=g[e],d.state_==fb&&d.check_()}}var d,e,f=0,g=[],h=[],i={object:void 0,objects:h,open:function(b,c){d||(d=c,e={}),g.push(b),f++,b.iterateObjects_(a)},close:function(){if(f--,!(f>0)){for(var a=0;a<h.length;a++)Object.unobserve(h[a],c),x.unobservedCount++;g.length=0,h.length=0,d=void 0,e=void 0,db.push(this)}}};return i}function w(a,b){return $&&$.object===b||($=db.pop()||v(),$.object=b),$.open(a,b),$}function x(){this.state_=eb,this.callback_=void 0,this.target_=void 0,this.directObserver_=void 0,this.value_=void 0,this.id_=ib++}function y(a){x._allObserversCount++,kb&&jb.push(a)}function z(){x._allObserversCount--}function A(a){x.call(this),this.value_=a,this.oldObject_=void 0}function B(a){if(!Array.isArray(a))throw Error("Provided object is not an Array");A.call(this,a)}function C(a,b){x.call(this),this.object_=a,this.path_=m(b),this.directObserver_=void 0}function D(a){x.call(this),this.reportChangesOnOpen_=a,this.value_=[],this.directObserver_=void 0,this.observed_=[]}function E(a){return a}function F(a,b,c,d){this.callback_=void 0,this.target_=void 0,this.value_=void 0,this.observable_=a,this.getValueFn_=b||E,this.setValueFn_=c||E,this.dontPassThroughSet_=d}function G(a,b,c){for(var d={},e={},f=0;f<b.length;f++){var g=b[f];nb[g.type]?(g.name in c||(c[g.name]=g.oldValue),"update"!=g.type&&("add"!=g.type?g.name in d?(delete d[g.name],delete c[g.name]):e[g.name]=!0:g.name in e?delete e[g.name]:d[g.name]=!0)):(console.error("Unknown changeRecord type: "+g.type),console.error(g))}for(var h in d)d[h]=a[h];for(var h in e)e[h]=void 0;var i={};for(var h in c)if(!(h in d||h in e)){var j=a[h];c[h]!==j&&(i[h]=j)}return{added:d,removed:e,changed:i}}function H(a,b,c){return{index:a,removed:b,addedCount:c}}function I(){}function J(a,b,c,d,e,f){return sb.calcSplices(a,b,c,d,e,f)}function K(a,b,c,d){return c>b||a>d?-1:b==c||d==a?0:c>a?d>b?b-c:d-c:b>d?d-a:b-a}function L(a,b,c,d){for(var e=H(b,c,d),f=!1,g=0,h=0;h<a.length;h++){var i=a[h];if(i.index+=g,!f){var j=K(e.index,e.index+e.removed.length,i.index,i.index+i.addedCount);if(j>=0){a.splice(h,1),h--,g-=i.addedCount-i.removed.length,e.addedCount+=i.addedCount-j;var k=e.removed.length+i.removed.length-j;if(e.addedCount||k){var c=i.removed;if(e.index<i.index){var l=e.removed.slice(0,i.index-e.index);Array.prototype.push.apply(l,c),c=l}if(e.index+e.removed.length>i.index+i.addedCount){var m=e.removed.slice(i.index+i.addedCount-e.index);Array.prototype.push.apply(c,m)}e.removed=c,i.index<e.index&&(e.index=i.index)}else f=!0}else if(e.index<i.index){f=!0,a.splice(h,0,e),h++;var n=e.addedCount-e.removed.length;i.index+=n,g+=n}}}f||a.push(e)}function M(a,b){for(var c=[],f=0;f<b.length;f++){var g=b[f];switch(g.type){case"splice":L(c,g.index,g.removed.slice(),g.addedCount);break;case"add":case"update":case"delete":if(!d(g.name))continue;var h=e(g.name);if(0>h)continue;L(c,h,[g.oldValue],1);break;default:console.error("Unexpected record type: "+JSON.stringify(g))}}return c}function N(a,b){var c=[];return M(a,b).forEach(function(b){return 1==b.addedCount&&1==b.removed.length?void(b.removed[0]!==a[b.index]&&c.push(b)):void(c=c.concat(J(a,b.index,b.index+b.addedCount,b.removed,0,b.removed.length)))}),c}var O=a.testingExposeCycleCount,P=b(),Q=c(),R=a.Number.isNaN||function(b){return"number"==typeof b&&a.isNaN(b)},S="__proto__"in{}?function(a){return a}:function(a){var b=a.__proto__;if(!b)return a;var c=Object.create(b);return Object.getOwnPropertyNames(a).forEach(function(b){Object.defineProperty(c,b,Object.getOwnPropertyDescriptor(a,b))}),c},T="[$_a-zA-Z]",U="[$_a-zA-Z0-9]",V=new RegExp("^"+T+"+"+U+"*$"),W={beforePath:{ws:["beforePath"],ident:["inIdent","append"],"[":["beforeElement"],eof:["afterPath"]},inPath:{ws:["inPath"],".":["beforeIdent"],"[":["beforeElement"],eof:["afterPath"]},beforeIdent:{ws:["beforeIdent"],ident:["inIdent","append"]},inIdent:{ident:["inIdent","append"],0:["inIdent","append"],number:["inIdent","append"],ws:["inPath","push"],".":["beforeIdent","push"],"[":["beforeElement","push"],eof:["afterPath","push"]},beforeElement:{ws:["beforeElement"],0:["afterZero","append"],number:["inIndex","append"],"'":["inSingleQuote","append",""],'"':["inDoubleQuote","append",""]},afterZero:{ws:["afterElement","push"],"]":["inPath","push"]},inIndex:{0:["inIndex","append"],number:["inIndex","append"],ws:["afterElement"],"]":["inPath","push"]},inSingleQuote:{"'":["afterElement"],eof:["error"],"else":["inSingleQuote","append"]},inDoubleQuote:{'"':["afterElement"],eof:["error"],"else":["inDoubleQuote","append"]},afterElement:{ws:["afterElement"],"]":["inPath","push"]}},X={},Y={};l.get=m,l.prototype=S({__proto__:[],valid:!0,toString:function(){for(var a="",b=0;b<this.length;b++){var c=this[b];a+=k(c)?b?"."+c:c:n(c)}return a},getValueFrom:function(a){for(var b=0;b<this.length;b++){if(null==a)return;a=a[this[b]]}return a},iterateObjects:function(a,b){for(var c=0;c<this.length;c++){if(c&&(a=a[this[c-1]]),!f(a))return;b(a,this[0])}},compiledGetValueFromFn:function(){var a="",b="obj";a+="if (obj != null";for(var c,d=0;d<this.length-1;d++)c=this[d],b+=k(c)?"."+c:n(c),a+=" &&\n     "+b+" != null";a+=")\n";var c=this[d];return b+=k(c)?"."+c:n(c),a+="  return "+b+";\nelse\n  return undefined;",new Function("obj",a)},setValueFrom:function(a,b){if(!this.length)return!1;for(var c=0;c<this.length-1;c++){if(!f(a))return!1;a=a[this[c]]}return f(a)?(a[this[c]]=b,!0):!1}});var Z=new l("",X);Z.valid=!1,Z.getValueFrom=Z.setValueFrom=function(){};var $,_=1e3,ab=[],bb=P?function(){var a={pingPong:!0},b=!1;return Object.observe(a,function(){s(),b=!1}),function(c){ab.push(c),b||(b=!0,a.pingPong=!a.pingPong)}}():function(){return function(a){ab.push(a)}}(),cb=[],db=[],eb=0,fb=1,gb=2,hb=3,ib=1;x.prototype={open:function(a,b){if(this.state_!=eb)throw Error("Observer has already been opened.");return y(this),this.callback_=a,this.target_=b,this.connect_(),this.state_=fb,this.value_},close:function(){this.state_==fb&&(z(this),this.disconnect_(),this.value_=void 0,this.callback_=void 0,this.target_=void 0,this.state_=gb)},deliver:function(){this.state_==fb&&o(this)},report_:function(a){try{this.callback_.apply(this.target_,a)}catch(b){x._errorThrownDuringCallback=!0,console.error("Exception caught during observer callback: "+(b.stack||b))}},discardChanges:function(){return this.check_(void 0,!0),this.value_}};var jb,kb=!P;x._allObserversCount=0,kb&&(jb=[]);var lb=!1;a.Platform=a.Platform||{},a.Platform.performMicrotaskCheckpoint=function(){if(!lb&&kb){lb=!0;var b,c,d=0;do{d++,c=jb,jb=[],b=!1;for(var e=0;e<c.length;e++){var f=c[e];f.state_==fb&&(f.check_()&&(b=!0),jb.push(f))}s()&&(b=!0)}while(_>d&&b);O&&(a.dirtyCheckCycleCount=d),lb=!1}},kb&&(a.Platform.clearObservers=function(){jb=[]}),A.prototype=S({__proto__:x.prototype,arrayObserve:!1,connect_:function(){P?this.directObserver_=u(this,this.value_,this.arrayObserve):this.oldObject_=this.copyObject(this.value_)},copyObject:function(a){var b=Array.isArray(a)?[]:{};for(var c in a)b[c]=a[c];return Array.isArray(a)&&(b.length=a.length),b},check_:function(a){var b,c;if(P){if(!a)return!1;c={},b=G(this.value_,a,c)}else c=this.oldObject_,b=r(this.value_,this.oldObject_);return q(b)?!1:(P||(this.oldObject_=this.copyObject(this.value_)),this.report_([b.added||{},b.removed||{},b.changed||{},function(a){return c[a]}]),!0)},disconnect_:function(){P?(this.directObserver_.close(),this.directObserver_=void 0):this.oldObject_=void 0},deliver:function(){this.state_==fb&&(P?this.directObserver_.deliver(!1):o(this))},discardChanges:function(){return this.directObserver_?this.directObserver_.deliver(!0):this.oldObject_=this.copyObject(this.value_),this.value_}}),B.prototype=S({__proto__:A.prototype,arrayObserve:!0,copyObject:function(a){return a.slice()},check_:function(a){var b;if(P){if(!a)return!1;b=N(this.value_,a)}else b=J(this.value_,0,this.value_.length,this.oldObject_,0,this.oldObject_.length);return b&&b.length?(P||(this.oldObject_=this.copyObject(this.value_)),this.report_([b]),!0):!1}}),B.applySplices=function(a,b,c){c.forEach(function(c){for(var d=[c.index,c.removed.length],e=c.index;e<c.index+c.addedCount;)d.push(b[e]),e++;Array.prototype.splice.apply(a,d)})},C.prototype=S({__proto__:x.prototype,get path(){return this.path_},connect_:function(){P&&(this.directObserver_=w(this,this.object_)),this.check_(void 0,!0)},disconnect_:function(){this.value_=void 0,this.directObserver_&&(this.directObserver_.close(this),this.directObserver_=void 0)},iterateObjects_:function(a){this.path_.iterateObjects(this.object_,a)},check_:function(a,b){var c=this.value_;return this.value_=this.path_.getValueFrom(this.object_),b||g(this.value_,c)?!1:(this.report_([this.value_,c,this]),!0)},setValue:function(a){this.path_&&this.path_.setValueFrom(this.object_,a)}});var mb={};D.prototype=S({__proto__:x.prototype,connect_:function(){if(P){for(var a,b=!1,c=0;c<this.observed_.length;c+=2)if(a=this.observed_[c],a!==mb){b=!0;break}b&&(this.directObserver_=w(this,a))}this.check_(void 0,!this.reportChangesOnOpen_)},disconnect_:function(){for(var a=0;a<this.observed_.length;a+=2)this.observed_[a]===mb&&this.observed_[a+1].close();this.observed_.length=0,this.value_.length=0,this.directObserver_&&(this.directObserver_.close(this),this.directObserver_=void 0)},addPath:function(a,b){if(this.state_!=eb&&this.state_!=hb)throw Error("Cannot add paths once started.");var b=m(b);if(this.observed_.push(a,b),this.reportChangesOnOpen_){var c=this.observed_.length/2-1;this.value_[c]=b.getValueFrom(a)}},addObserver:function(a){if(this.state_!=eb&&this.state_!=hb)throw Error("Cannot add observers once started.");if(this.observed_.push(mb,a),this.reportChangesOnOpen_){var b=this.observed_.length/2-1;this.value_[b]=a.open(this.deliver,this)}},startReset:function(){if(this.state_!=fb)throw Error("Can only reset while open");this.state_=hb,this.disconnect_()},finishReset:function(){if(this.state_!=hb)throw Error("Can only finishReset after startReset");return this.state_=fb,this.connect_(),this.value_},iterateObjects_:function(a){for(var b,c=0;c<this.observed_.length;c+=2)b=this.observed_[c],b!==mb&&this.observed_[c+1].iterateObjects(b,a)},check_:function(a,b){for(var c,d=0;d<this.observed_.length;d+=2){var e,f=this.observed_[d],h=this.observed_[d+1];if(f===mb){var i=h;e=this.state_===eb?i.open(this.deliver,this):i.discardChanges()}else e=h.getValueFrom(f);b?this.value_[d/2]=e:g(e,this.value_[d/2])||(c=c||[],c[d/2]=this.value_[d/2],this.value_[d/2]=e)}return c?(this.report_([this.value_,c,this.observed_]),!0):!1}}),F.prototype={open:function(a,b){return this.callback_=a,this.target_=b,this.value_=this.getValueFn_(this.observable_.open(this.observedCallback_,this)),this.value_},observedCallback_:function(a){if(a=this.getValueFn_(a),!g(a,this.value_)){var b=this.value_;this.value_=a,this.callback_.call(this.target_,this.value_,b)}},discardChanges:function(){return this.value_=this.getValueFn_(this.observable_.discardChanges()),this.value_},deliver:function(){return this.observable_.deliver()},setValue:function(a){return a=this.setValueFn_(a),!this.dontPassThroughSet_&&this.observable_.setValue?this.observable_.setValue(a):void 0},close:function(){this.observable_&&this.observable_.close(),this.callback_=void 0,this.target_=void 0,this.observable_=void 0,this.value_=void 0,this.getValueFn_=void 0,this.setValueFn_=void 0}};var nb={add:!0,update:!0,"delete":!0},ob=0,pb=1,qb=2,rb=3;I.prototype={calcEditDistances:function(a,b,c,d,e,f){for(var g=f-e+1,h=c-b+1,i=new Array(g),j=0;g>j;j++)i[j]=new Array(h),i[j][0]=j;for(var k=0;h>k;k++)i[0][k]=k;for(var j=1;g>j;j++)for(var k=1;h>k;k++)if(this.equals(a[b+k-1],d[e+j-1]))i[j][k]=i[j-1][k-1];else{var l=i[j-1][k]+1,m=i[j][k-1]+1;i[j][k]=m>l?l:m}return i},spliceOperationsFromEditDistances:function(a){for(var b=a.length-1,c=a[0].length-1,d=a[b][c],e=[];b>0||c>0;)if(0!=b)if(0!=c){var f,g=a[b-1][c-1],h=a[b-1][c],i=a[b][c-1];f=i>h?g>h?h:g:g>i?i:g,f==g?(g==d?e.push(ob):(e.push(pb),d=g),b--,c--):f==h?(e.push(rb),b--,d=h):(e.push(qb),c--,d=i)}else e.push(rb),b--;else e.push(qb),c--;return e.reverse(),e},calcSplices:function(a,b,c,d,e,f){var g=0,h=0,i=Math.min(c-b,f-e);if(0==b&&0==e&&(g=this.sharedPrefix(a,d,i)),c==a.length&&f==d.length&&(h=this.sharedSuffix(a,d,i-g)),b+=g,e+=g,c-=h,f-=h,c-b==0&&f-e==0)return[];if(b==c){for(var j=H(b,[],0);f>e;)j.removed.push(d[e++]);return[j]}if(e==f)return[H(b,[],c-b)];for(var k=this.spliceOperationsFromEditDistances(this.calcEditDistances(a,b,c,d,e,f)),j=void 0,l=[],m=b,n=e,o=0;o<k.length;o++)switch(k[o]){case ob:j&&(l.push(j),j=void 0),m++,n++;break;case pb:j||(j=H(m,[],0)),j.addedCount++,m++,j.removed.push(d[n]),n++;break;case qb:j||(j=H(m,[],0)),j.addedCount++,m++;break;case rb:j||(j=H(m,[],0)),j.removed.push(d[n]),n++}return j&&l.push(j),l},sharedPrefix:function(a,b,c){for(var d=0;c>d;d++)if(!this.equals(a[d],b[d]))return d;return c},sharedSuffix:function(a,b,c){for(var d=a.length,e=b.length,f=0;c>f&&this.equals(a[--d],b[--e]);)f++;return f},calculateSplices:function(a,b){return this.calcSplices(a,0,a.length,b,0,b.length)},equals:function(a,b){return a===b}};var sb=new I;a.Observer=x,a.Observer.runEOM_=bb,a.Observer.observerSentinel_=mb,a.Observer.hasObjectObserve=P,a.ArrayObserver=B,a.ArrayObserver.calculateSplices=function(a,b){return sb.calculateSplices(a,b)},a.ArraySplice=I,a.ObjectObserver=A,a.PathObserver=C,a.CompoundObserver=D,a.Path=l,a.ObserverTransform=F}("undefined"!=typeof global&&global&&"undefined"!=typeof module&&module?global:this||window),function(){"use strict";function a(a){for(;a.parentNode;)a=a.parentNode;return"function"==typeof a.getElementById?a:null}function b(a,b,c){var d=a.bindings_;return d||(d=a.bindings_={}),d[b]&&c[b].close(),d[b]=c}function c(a,b,c){return c}function d(a){return null==a?"":a}function e(a,b){a.data=d(b)}function f(a){return function(b){return e(a,b)}}function g(a,b,c,e){return c?void(e?a.setAttribute(b,""):a.removeAttribute(b)):void a.setAttribute(b,d(e))}function h(a,b,c){return function(d){g(a,b,c,d)}}function i(a){switch(a.type){case"checkbox":return u;case"radio":case"select-multiple":case"select-one":return"change";case"range":if(/Trident|MSIE/.test(navigator.userAgent))return"change";default:return"input"}}function j(a,b,c,e){a[b]=(e||d)(c)}function k(a,b,c){return function(d){return j(a,b,d,c)}}function l(){}function m(a,b,c,d){function e(){c.setValue(a[b]),c.discardChanges(),(d||l)(a),Platform.performMicrotaskCheckpoint()}var f=i(a);return a.addEventListener(f,e),{close:function(){a.removeEventListener(f,e),c.close()},observable_:c}}function n(a){return Boolean(a)}function o(b){if(b.form)return s(b.form.elements,function(a){return a!=b&&"INPUT"==a.tagName&&"radio"==a.type&&a.name==b.name});var c=a(b);if(!c)return[];var d=c.querySelectorAll('input[type="radio"][name="'+b.name+'"]');return s(d,function(a){return a!=b&&!a.form})}function p(a){"INPUT"===a.tagName&&"radio"===a.type&&o(a).forEach(function(a){var b=a.bindings_.checked;b&&b.observable_.setValue(!1)})}function q(a,b){var c,e,f,g=a.parentNode;g instanceof HTMLSelectElement&&g.bindings_&&g.bindings_.value&&(c=g,e=c.bindings_.value,f=c.value),a.value=d(b),c&&c.value!=f&&(e.observable_.setValue(c.value),e.observable_.discardChanges(),Platform.performMicrotaskCheckpoint())}function r(a){return function(b){q(a,b)}}var s=Array.prototype.filter.call.bind(Array.prototype.filter);Node.prototype.bind=function(a,b){console.error("Unhandled binding to Node: ",this,a,b)},Node.prototype.bindFinished=function(){};var t=c;Object.defineProperty(Platform,"enableBindingsReflection",{get:function(){return t===b},set:function(a){return t=a?b:c,a},configurable:!0}),Text.prototype.bind=function(a,b,c){if("textContent"!==a)return Node.prototype.bind.call(this,a,b,c);if(c)return e(this,b);var d=b;return e(this,d.open(f(this))),t(this,a,d)},Element.prototype.bind=function(a,b,c){var d="?"==a[a.length-1];if(d&&(this.removeAttribute(a),a=a.slice(0,-1)),c)return g(this,a,d,b);var e=b;return g(this,a,d,e.open(h(this,a,d))),t(this,a,e)};var u;!function(){var a=document.createElement("div"),b=a.appendChild(document.createElement("input"));b.setAttribute("type","checkbox");var c,d=0;b.addEventListener("click",function(){d++,c=c||"click"}),b.addEventListener("change",function(){d++,c=c||"change"});var e=document.createEvent("MouseEvent");e.initMouseEvent("click",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),b.dispatchEvent(e),u=1==d?"change":c}(),HTMLInputElement.prototype.bind=function(a,c,e){if("value"!==a&&"checked"!==a)return HTMLElement.prototype.bind.call(this,a,c,e);this.removeAttribute(a);var f="checked"==a?n:d,g="checked"==a?p:l;if(e)return j(this,a,c,f);var h=c,i=m(this,a,h,g);return j(this,a,h.open(k(this,a,f)),f),b(this,a,i)},HTMLTextAreaElement.prototype.bind=function(a,b,c){if("value"!==a)return HTMLElement.prototype.bind.call(this,a,b,c);if(this.removeAttribute("value"),c)return j(this,"value",b);var e=b,f=m(this,"value",e);return j(this,"value",e.open(k(this,"value",d))),t(this,a,f)},HTMLOptionElement.prototype.bind=function(a,b,c){if("value"!==a)return HTMLElement.prototype.bind.call(this,a,b,c);if(this.removeAttribute("value"),c)return q(this,b);var d=b,e=m(this,"value",d);return q(this,d.open(r(this))),t(this,a,e)},HTMLSelectElement.prototype.bind=function(a,c,d){if("selectedindex"===a&&(a="selectedIndex"),"selectedIndex"!==a&&"value"!==a)return HTMLElement.prototype.bind.call(this,a,c,d);if(this.removeAttribute(a),d)return j(this,a,c);var e=c,f=m(this,a,e);return j(this,a,e.open(k(this,a))),b(this,a,f)}}(this),function(a){"use strict";function b(a){if(!a)throw new Error("Assertion failed")}function c(a){for(var b;b=a.parentNode;)a=b;return a}function d(a,b){if(b){for(var d,e="#"+b;!d&&(a=c(a),a.protoContent_?d=a.protoContent_.querySelector(e):a.getElementById&&(d=a.getElementById(b)),!d&&a.templateCreator_);)a=a.templateCreator_;return d}}function e(a){return"template"==a.tagName&&"http://www.w3.org/2000/svg"==a.namespaceURI}function f(a){return"TEMPLATE"==a.tagName&&"http://www.w3.org/1999/xhtml"==a.namespaceURI}function g(a){return Boolean(L[a.tagName]&&a.hasAttribute("template"))}function h(a){return void 0===a.isTemplate_&&(a.isTemplate_="TEMPLATE"==a.tagName||g(a)),a.isTemplate_}function i(a,b){var c=a.querySelectorAll(N);h(a)&&b(a),G(c,b)}function j(a){function b(a){HTMLTemplateElement.decorate(a)||j(a.content)}i(a,b)}function k(a,b){Object.getOwnPropertyNames(b).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))})}function l(a){var b=a.ownerDocument;if(!b.defaultView)return b;var c=b.templateContentsOwner_;if(!c){for(c=b.implementation.createHTMLDocument("");c.lastChild;)c.removeChild(c.lastChild);b.templateContentsOwner_=c}return c}function m(a){if(!a.stagingDocument_){var b=a.ownerDocument;if(!b.stagingDocument_){b.stagingDocument_=b.implementation.createHTMLDocument(""),b.stagingDocument_.isStagingDocument=!0;var c=b.stagingDocument_.createElement("base");c.href=document.baseURI,b.stagingDocument_.head.appendChild(c),b.stagingDocument_.stagingDocument_=b.stagingDocument_}a.stagingDocument_=b.stagingDocument_}return a.stagingDocument_}function n(a){var b=a.ownerDocument.createElement("template");a.parentNode.insertBefore(b,a);for(var c=a.attributes,d=c.length;d-->0;){var e=c[d];K[e.name]&&("template"!==e.name&&b.setAttribute(e.name,e.value),a.removeAttribute(e.name))}return b}function o(a){var b=a.ownerDocument.createElement("template");a.parentNode.insertBefore(b,a);for(var c=a.attributes,d=c.length;d-->0;){var e=c[d];b.setAttribute(e.name,e.value),a.removeAttribute(e.name)}return a.parentNode.removeChild(a),b}function p(a,b,c){var d=a.content;if(c)return void d.appendChild(b);for(var e;e=b.firstChild;)d.appendChild(e)}function q(a){P?a.__proto__=HTMLTemplateElement.prototype:k(a,HTMLTemplateElement.prototype)}function r(a){a.setModelFn_||(a.setModelFn_=function(){a.setModelFnScheduled_=!1;
var b=z(a,a.delegate_&&a.delegate_.prepareBinding);w(a,b,a.model_)}),a.setModelFnScheduled_||(a.setModelFnScheduled_=!0,Observer.runEOM_(a.setModelFn_))}function s(a,b,c,d){if(a&&a.length){for(var e,f=a.length,g=0,h=0,i=0,j=!0;f>h;){var g=a.indexOf("{{",h),k=a.indexOf("[[",h),l=!1,m="}}";if(k>=0&&(0>g||g>k)&&(g=k,l=!0,m="]]"),i=0>g?-1:a.indexOf(m,g+2),0>i){if(!e)return;e.push(a.slice(h));break}e=e||[],e.push(a.slice(h,g));var n=a.slice(g+2,i).trim();e.push(l),j=j&&l;var o=d&&d(n,b,c);e.push(null==o?Path.get(n):null),e.push(o),h=i+2}return h===f&&e.push(""),e.hasOnePath=5===e.length,e.isSimplePath=e.hasOnePath&&""==e[0]&&""==e[4],e.onlyOneTime=j,e.combinator=function(a){for(var b=e[0],c=1;c<e.length;c+=4){var d=e.hasOnePath?a:a[(c-1)/4];void 0!==d&&(b+=d),b+=e[c+3]}return b},e}}function t(a,b,c,d){if(b.hasOnePath){var e=b[3],f=e?e(d,c,!0):b[2].getValueFrom(d);return b.isSimplePath?f:b.combinator(f)}for(var g=[],h=1;h<b.length;h+=4){var e=b[h+2];g[(h-1)/4]=e?e(d,c):b[h+1].getValueFrom(d)}return b.combinator(g)}function u(a,b,c,d){var e=b[3],f=e?e(d,c,!1):new PathObserver(d,b[2]);return b.isSimplePath?f:new ObserverTransform(f,b.combinator)}function v(a,b,c,d){if(b.onlyOneTime)return t(a,b,c,d);if(b.hasOnePath)return u(a,b,c,d);for(var e=new CompoundObserver,f=1;f<b.length;f+=4){var g=b[f],h=b[f+2];if(h){var i=h(d,c,g);g?e.addPath(i):e.addObserver(i)}else{var j=b[f+1];g?e.addPath(j.getValueFrom(d)):e.addPath(d,j)}}return new ObserverTransform(e,b.combinator)}function w(a,b,c,d){for(var e=0;e<b.length;e+=2){var f=b[e],g=b[e+1],h=v(f,g,a,c),i=a.bind(f,h,g.onlyOneTime);i&&d&&d.push(i)}if(a.bindFinished(),b.isTemplate){a.model_=c;var j=a.processBindingDirectives_(b);d&&j&&d.push(j)}}function x(a,b,c){var d=a.getAttribute(b);return s(""==d?"{{}}":d,b,a,c)}function y(a,c){b(a);for(var d=[],e=0;e<a.attributes.length;e++){for(var f=a.attributes[e],g=f.name,i=f.value;"_"===g[0];)g=g.substring(1);if(!h(a)||g!==J&&g!==H&&g!==I){var j=s(i,g,a,c);j&&d.push(g,j)}}return h(a)&&(d.isTemplate=!0,d.if=x(a,J,c),d.bind=x(a,H,c),d.repeat=x(a,I,c),!d.if||d.bind||d.repeat||(d.bind=s("{{}}",H,a,c))),d}function z(a,b){if(a.nodeType===Node.ELEMENT_NODE)return y(a,b);if(a.nodeType===Node.TEXT_NODE){var c=s(a.data,"textContent",a,b);if(c)return["textContent",c]}return[]}function A(a,b,c,d,e,f,g){for(var h=b.appendChild(c.importNode(a,!1)),i=0,j=a.firstChild;j;j=j.nextSibling)A(j,h,c,d.children[i++],e,f,g);return d.isTemplate&&(HTMLTemplateElement.decorate(h,a),f&&h.setDelegate_(f)),w(h,d,e,g),h}function B(a,b){var c=z(a,b);c.children={};for(var d=0,e=a.firstChild;e;e=e.nextSibling)c.children[d++]=B(e,b);return c}function C(a){var b=a.id_;return b||(b=a.id_=S++),b}function D(a,b){var c=C(a);if(b){var d=b.bindingMaps[c];return d||(d=b.bindingMaps[c]=B(a,b.prepareBinding)||[]),d}var d=a.bindingMap_;return d||(d=a.bindingMap_=B(a,void 0)||[]),d}function E(a){this.closed=!1,this.templateElement_=a,this.instances=[],this.deps=void 0,this.iteratedValue=[],this.presentValue=void 0,this.arrayObserver=void 0}var F,G=Array.prototype.forEach.call.bind(Array.prototype.forEach);a.Map&&"function"==typeof a.Map.prototype.forEach?F=a.Map:(F=function(){this.keys=[],this.values=[]},F.prototype={set:function(a,b){var c=this.keys.indexOf(a);0>c?(this.keys.push(a),this.values.push(b)):this.values[c]=b},get:function(a){var b=this.keys.indexOf(a);if(!(0>b))return this.values[b]},"delete":function(a){var b=this.keys.indexOf(a);return 0>b?!1:(this.keys.splice(b,1),this.values.splice(b,1),!0)},forEach:function(a,b){for(var c=0;c<this.keys.length;c++)a.call(b||this,this.values[c],this.keys[c],this)}});"function"!=typeof document.contains&&(Document.prototype.contains=function(a){return a===this||a.parentNode===this?!0:this.documentElement.contains(a)});var H="bind",I="repeat",J="if",K={template:!0,repeat:!0,bind:!0,ref:!0},L={THEAD:!0,TBODY:!0,TFOOT:!0,TH:!0,TR:!0,TD:!0,COLGROUP:!0,COL:!0,CAPTION:!0,OPTION:!0,OPTGROUP:!0},M="undefined"!=typeof HTMLTemplateElement;M&&!function(){var a=document.createElement("template"),b=a.content.ownerDocument,c=b.appendChild(b.createElement("html")),d=c.appendChild(b.createElement("head")),e=b.createElement("base");e.href=document.baseURI,d.appendChild(e)}();var N="template, "+Object.keys(L).map(function(a){return a.toLowerCase()+"[template]"}).join(", ");document.addEventListener("DOMContentLoaded",function(){j(document),Platform.performMicrotaskCheckpoint()},!1),M||(a.HTMLTemplateElement=function(){throw TypeError("Illegal constructor")});var O,P="__proto__"in{};"function"==typeof MutationObserver&&(O=new MutationObserver(function(a){for(var b=0;b<a.length;b++)a[b].target.refChanged_()})),HTMLTemplateElement.decorate=function(a,c){if(a.templateIsDecorated_)return!1;var d=a;d.templateIsDecorated_=!0;var h=f(d)&&M,i=h,k=!h,m=!1;if(h||(g(d)?(b(!c),d=n(a),d.templateIsDecorated_=!0,h=M,m=!0):e(d)&&(d=o(a),d.templateIsDecorated_=!0,h=M)),!h){q(d);var r=l(d);d.content_=r.createDocumentFragment()}return c?d.instanceRef_=c:k?p(d,a,m):i&&j(d.content),!0},HTMLTemplateElement.bootstrap=j;var Q=a.HTMLUnknownElement||HTMLElement,R={get:function(){return this.content_},enumerable:!0,configurable:!0};M||(HTMLTemplateElement.prototype=Object.create(Q.prototype),Object.defineProperty(HTMLTemplateElement.prototype,"content",R)),k(HTMLTemplateElement.prototype,{bind:function(a,b,c){if("ref"!=a)return Element.prototype.bind.call(this,a,b,c);var d=this,e=c?b:b.open(function(a){d.setAttribute("ref",a),d.refChanged_()});return this.setAttribute("ref",e),this.refChanged_(),c?void 0:(this.bindings_?this.bindings_.ref=b:this.bindings_={ref:b},b)},processBindingDirectives_:function(a){return this.iterator_&&this.iterator_.closeDeps(),a.if||a.bind||a.repeat?(this.iterator_||(this.iterator_=new E(this)),this.iterator_.updateDependencies(a,this.model_),O&&O.observe(this,{attributes:!0,attributeFilter:["ref"]}),this.iterator_):void(this.iterator_&&(this.iterator_.close(),this.iterator_=void 0))},createInstance:function(a,b,c){b?c=this.newDelegate_(b):c||(c=this.delegate_),this.refContent_||(this.refContent_=this.ref_.content);var d=this.refContent_;if(null===d.firstChild)return T;var e=D(d,c),f=m(this),g=f.createDocumentFragment();g.templateCreator_=this,g.protoContent_=d,g.bindings_=[],g.terminator_=null;for(var h=g.templateInstance_={firstNode:null,lastNode:null,model:a},i=0,j=!1,k=d.firstChild;k;k=k.nextSibling){null===k.nextSibling&&(j=!0);var l=A(k,g,f,e.children[i++],a,c,g.bindings_);l.templateInstance_=h,j&&(g.terminator_=l)}return h.firstNode=g.firstChild,h.lastNode=g.lastChild,g.templateCreator_=void 0,g.protoContent_=void 0,g},get model(){return this.model_},set model(a){this.model_=a,r(this)},get bindingDelegate(){return this.delegate_&&this.delegate_.raw},refChanged_:function(){this.iterator_&&this.refContent_!==this.ref_.content&&(this.refContent_=void 0,this.iterator_.valueChanged(),this.iterator_.updateIteratedValue(this.iterator_.getUpdatedValue()))},clear:function(){this.model_=void 0,this.delegate_=void 0,this.bindings_&&this.bindings_.ref&&this.bindings_.ref.close(),this.refContent_=void 0,this.iterator_&&(this.iterator_.valueChanged(),this.iterator_.close(),this.iterator_=void 0)},setDelegate_:function(a){this.delegate_=a,this.bindingMap_=void 0,this.iterator_&&(this.iterator_.instancePositionChangedFn_=void 0,this.iterator_.instanceModelFn_=void 0)},newDelegate_:function(a){function b(b){var c=a&&a[b];if("function"==typeof c)return function(){return c.apply(a,arguments)}}if(a)return{bindingMaps:{},raw:a,prepareBinding:b("prepareBinding"),prepareInstanceModel:b("prepareInstanceModel"),prepareInstancePositionChanged:b("prepareInstancePositionChanged")}},set bindingDelegate(a){if(this.delegate_)throw Error("Template must be cleared before a new bindingDelegate can be assigned");this.setDelegate_(this.newDelegate_(a))},get ref_(){var a=d(this,this.getAttribute("ref"));if(a||(a=this.instanceRef_),!a)return this;var b=a.ref_;return b?b:a}});var S=1;Object.defineProperty(Node.prototype,"templateInstance",{get:function(){var a=this.templateInstance_;return a?a:this.parentNode?this.parentNode.templateInstance:void 0}});var T=document.createDocumentFragment();T.bindings_=[],T.terminator_=null,E.prototype={closeDeps:function(){var a=this.deps;a&&(a.ifOneTime===!1&&a.ifValue.close(),a.oneTime===!1&&a.value.close())},updateDependencies:function(a,b){this.closeDeps();var c=this.deps={},d=this.templateElement_,e=!0;if(a.if){if(c.hasIf=!0,c.ifOneTime=a.if.onlyOneTime,c.ifValue=v(J,a.if,d,b),e=c.ifValue,c.ifOneTime&&!e)return void this.valueChanged();c.ifOneTime||(e=e.open(this.updateIfValue,this))}a.repeat?(c.repeat=!0,c.oneTime=a.repeat.onlyOneTime,c.value=v(I,a.repeat,d,b)):(c.repeat=!1,c.oneTime=a.bind.onlyOneTime,c.value=v(H,a.bind,d,b));var f=c.value;return c.oneTime||(f=f.open(this.updateIteratedValue,this)),e?void this.updateValue(f):void this.valueChanged()},getUpdatedValue:function(){var a=this.deps.value;return this.deps.oneTime||(a=a.discardChanges()),a},updateIfValue:function(a){return a?void this.updateValue(this.getUpdatedValue()):void this.valueChanged()},updateIteratedValue:function(a){if(this.deps.hasIf){var b=this.deps.ifValue;if(this.deps.ifOneTime||(b=b.discardChanges()),!b)return void this.valueChanged()}this.updateValue(a)},updateValue:function(a){this.deps.repeat||(a=[a]);var b=this.deps.repeat&&!this.deps.oneTime&&Array.isArray(a);this.valueChanged(a,b)},valueChanged:function(a,b){Array.isArray(a)||(a=[]),a!==this.iteratedValue&&(this.unobserve(),this.presentValue=a,b&&(this.arrayObserver=new ArrayObserver(this.presentValue),this.arrayObserver.open(this.handleSplices,this)),this.handleSplices(ArrayObserver.calculateSplices(this.presentValue,this.iteratedValue)))},getLastInstanceNode:function(a){if(-1==a)return this.templateElement_;var b=this.instances[a],c=b.terminator_;if(!c)return this.getLastInstanceNode(a-1);if(c.nodeType!==Node.ELEMENT_NODE||this.templateElement_===c)return c;var d=c.iterator_;return d?d.getLastTemplateNode():c},getLastTemplateNode:function(){return this.getLastInstanceNode(this.instances.length-1)},insertInstanceAt:function(a,b){var c=this.getLastInstanceNode(a-1),d=this.templateElement_.parentNode;this.instances.splice(a,0,b),d.insertBefore(b,c.nextSibling)},extractInstanceAt:function(a){for(var b=this.getLastInstanceNode(a-1),c=this.getLastInstanceNode(a),d=this.templateElement_.parentNode,e=this.instances.splice(a,1)[0];c!==b;){var f=b.nextSibling;f==c&&(c=b),e.appendChild(d.removeChild(f))}return e},getDelegateFn:function(a){return a=a&&a(this.templateElement_),"function"==typeof a?a:null},handleSplices:function(a){if(!this.closed&&a.length){var b=this.templateElement_;if(!b.parentNode)return void this.close();ArrayObserver.applySplices(this.iteratedValue,this.presentValue,a);var c=b.delegate_;void 0===this.instanceModelFn_&&(this.instanceModelFn_=this.getDelegateFn(c&&c.prepareInstanceModel)),void 0===this.instancePositionChangedFn_&&(this.instancePositionChangedFn_=this.getDelegateFn(c&&c.prepareInstancePositionChanged));for(var d=new F,e=0,f=0;f<a.length;f++){for(var g=a[f],h=g.removed,i=0;i<h.length;i++){var j=h[i],k=this.extractInstanceAt(g.index+e);k!==T&&d.set(j,k)}e-=g.addedCount}for(var f=0;f<a.length;f++)for(var g=a[f],l=g.index;l<g.index+g.addedCount;l++){var j=this.iteratedValue[l],k=d.get(j);k?d.delete(j):(this.instanceModelFn_&&(j=this.instanceModelFn_(j)),k=void 0===j?T:b.createInstance(j,void 0,c)),this.insertInstanceAt(l,k)}d.forEach(function(a){this.closeInstanceBindings(a)},this),this.instancePositionChangedFn_&&this.reportInstancesMoved(a)}},reportInstanceMoved:function(a){var b=this.instances[a];b!==T&&this.instancePositionChangedFn_(b.templateInstance_,a)},reportInstancesMoved:function(a){for(var b=0,c=0,d=0;d<a.length;d++){var e=a[d];if(0!=c)for(;b<e.index;)this.reportInstanceMoved(b),b++;else b=e.index;for(;b<e.index+e.addedCount;)this.reportInstanceMoved(b),b++;c+=e.addedCount-e.removed.length}if(0!=c)for(var f=this.instances.length;f>b;)this.reportInstanceMoved(b),b++},closeInstanceBindings:function(a){for(var b=a.bindings_,c=0;c<b.length;c++)b[c].close()},unobserve:function(){this.arrayObserver&&(this.arrayObserver.close(),this.arrayObserver=void 0)},close:function(){if(!this.closed){this.unobserve();for(var a=0;a<this.instances.length;a++)this.closeInstanceBindings(this.instances[a]);this.instances.length=0,this.closeDeps(),this.templateElement_.iterator_=void 0,this.closed=!0}}},HTMLTemplateElement.forAllTemplatesFrom_=i}(this),function(a){function b(a){f.textContent=d++,e.push(a)}function c(){for(;e.length;)e.shift()()}var d=0,e=[],f=document.createTextNode("");new(window.MutationObserver||JsMutationObserver)(c).observe(f,{characterData:!0}),a.endOfMicrotask=b}(Platform),function(a){function b(){e||(e=!0,a.endOfMicrotask(function(){e=!1,logFlags.data&&console.group("Platform.flush()"),a.performMicrotaskCheckpoint(),logFlags.data&&console.groupEnd()}))}var c=document.createElement("style");c.textContent="template {display: none !important;} /* injected by platform.js */";var d=document.querySelector("head");d.insertBefore(c,d.firstChild);var e;if(Observer.hasObjectObserve)b=function(){};else{var f=125;window.addEventListener("WebComponentsReady",function(){b(),a.flushPoll=setInterval(b,f)})}if(window.CustomElements&&!CustomElements.useNative){var g=Document.prototype.importNode;Document.prototype.importNode=function(a,b){var c=g.call(this,a,b);return CustomElements.upgradeAll(c),c}}a.flush=b}(window.Platform),function(a){function b(a,b,d,e){return a.replace(e,function(a,e,f,g){var h=f.replace(/["']/g,"");return h=c(b,h,d),e+"'"+h+"'"+g})}function c(a,b,c){if(b&&"/"===b[0])return b;var e=new URL(b,a);return c?e.href:d(e.href)}function d(a){var b=new URL(document.baseURI),c=new URL(a,b);return c.host===b.host&&c.port===b.port&&c.protocol===b.protocol?e(b,c):a}function e(a,b){for(var c=a.pathname,d=b.pathname,e=c.split("/"),f=d.split("/");e.length&&e[0]===f[0];)e.shift(),f.shift();for(var g=0,h=e.length-1;h>g;g++)f.unshift("..");return f.join("/")+b.search+b.hash}var f={resolveDom:function(a,b){b=b||a.ownerDocument.baseURI,this.resolveAttributes(a,b),this.resolveStyles(a,b);var c=a.querySelectorAll("template");if(c)for(var d,e=0,f=c.length;f>e&&(d=c[e]);e++)d.content&&this.resolveDom(d.content,b)},resolveTemplate:function(a){this.resolveDom(a.content,a.ownerDocument.baseURI)},resolveStyles:function(a,b){var c=a.querySelectorAll("style");if(c)for(var d,e=0,f=c.length;f>e&&(d=c[e]);e++)this.resolveStyle(d,b)},resolveStyle:function(a,b){b=b||a.ownerDocument.baseURI,a.textContent=this.resolveCssText(a.textContent,b)},resolveCssText:function(a,c,d){return a=b(a,c,d,g),b(a,c,d,h)},resolveAttributes:function(a,b){a.hasAttributes&&a.hasAttributes()&&this.resolveElementAttributes(a,b);var c=a&&a.querySelectorAll(j);if(c)for(var d,e=0,f=c.length;f>e&&(d=c[e]);e++)this.resolveElementAttributes(d,b)},resolveElementAttributes:function(a,d){d=d||a.ownerDocument.baseURI,i.forEach(function(e){var f,h=a.attributes[e],i=h&&h.value;i&&i.search(k)<0&&(f="style"===e?b(i,d,!1,g):c(d,i),h.value=f)})}},g=/(url\()([^)]*)(\))/g,h=/(@import[\s]+(?!url\())([^;]*)(;)/g,i=["href","src","action","style","url"],j="["+i.join("],[")+"]",k="{{.*}}";a.urlResolver=f}(Polymer),function(a){function b(a){this.cache=Object.create(null),this.map=Object.create(null),this.requests=0,this.regex=a}var c=Platform.endOfMicrotask;b.prototype={extractUrls:function(a,b){for(var c,d,e=[];c=this.regex.exec(a);)d=new URL(c[1],b),e.push({matched:c[0],url:d.href});return e},process:function(a,b,c){var d=this.extractUrls(a,b),e=c.bind(null,this.map);this.fetch(d,e)},fetch:function(a,b){var c=a.length;if(!c)return b();for(var d,e,f,g=function(){0===--c&&b()},h=0;c>h;h++)d=a[h],f=d.url,e=this.cache[f],e||(e=this.xhr(f),e.match=d,this.cache[f]=e),e.wait(g)},handleXhr:function(a){var b=a.match,c=b.url,d=a.response||a.responseText||"";this.map[c]=d,this.fetch(this.extractUrls(d,c),a.resolve)},xhr:function(a){this.requests++;var b=new XMLHttpRequest;return b.open("GET",a,!0),b.send(),b.onerror=b.onload=this.handleXhr.bind(this,b),b.pending=[],b.resolve=function(){for(var a=b.pending,c=0;c<a.length;c++)a[c]();b.pending=null},b.wait=function(a){b.pending?b.pending.push(a):c(a)},b}},a.Loader=b}(Polymer),function(a){function b(){this.loader=new d(this.regex)}var c=a.urlResolver,d=a.Loader;b.prototype={regex:/@import\s+(?:url)?["'\(]*([^'"\)]*)['"\)]*;/g,resolve:function(a,b,c){var d=function(d){c(this.flatten(a,b,d))}.bind(this);this.loader.process(a,b,d)},resolveNode:function(a,b,c){var d=a.textContent,e=function(b){a.textContent=b,c(a)};this.resolve(d,b,e)},flatten:function(a,b,d){for(var e,f,g,h=this.loader.extractUrls(a,b),i=0;i<h.length;i++)e=h[i],f=e.url,g=c.resolveCssText(d[f],f,!0),g=this.flatten(g,b,d),a=a.replace(e.matched,g);return a},loadStyles:function(a,b,c){function d(){f++,f===g&&c&&c()}for(var e,f=0,g=a.length,h=0;g>h&&(e=a[h]);h++)this.resolveNode(e,b,d)}};var e=new b;a.styleResolver=e}(Polymer),function(a){function b(a,b){return a&&b&&Object.getOwnPropertyNames(b).forEach(function(c){var d=Object.getOwnPropertyDescriptor(b,c);d&&(Object.defineProperty(a,c,d),"function"==typeof d.value&&(d.value.nom=c))}),a}function c(a){for(var b=a||{},c=1;c<arguments.length;c++){var e=arguments[c];try{for(var f in e)d(f,e,b)}catch(g){}}return b}function d(a,b,c){var d=e(b,a);Object.defineProperty(c,a,d)}function e(a,b){if(a){var c=Object.getOwnPropertyDescriptor(a,b);return c||e(Object.getPrototypeOf(a),b)}}a.extend=b,a.mixin=c,Platform.mixin=c}(Polymer),function(a){function b(a,b,d){return a?a.stop():a=new c(this),a.go(b,d),a}var c=function(a){this.context=a,this.boundComplete=this.complete.bind(this)};c.prototype={go:function(a,b){this.callback=a;var c;b?(c=setTimeout(this.boundComplete,b),this.handle=function(){clearTimeout(c)}):(c=requestAnimationFrame(this.boundComplete),this.handle=function(){cancelAnimationFrame(c)})},stop:function(){this.handle&&(this.handle(),this.handle=null)},complete:function(){this.handle&&(this.stop(),this.callback.call(this.context))}},a.job=b}(Polymer),function(a){function b(a,b,c){var d="string"==typeof a?document.createElement(a):a.cloneNode(!0);if(d.innerHTML=b,c)for(var e in c)d.setAttribute(e,c[e]);return d}var c={};HTMLElement.register=function(a,b){c[a]=b},HTMLElement.getPrototypeForTag=function(a){var b=a?c[a]:HTMLElement.prototype;return b||Object.getPrototypeOf(document.createElement(a))};var d=Event.prototype.stopPropagation;Event.prototype.stopPropagation=function(){this.cancelBubble=!0,d.apply(this,arguments)};var e=DOMTokenList.prototype.add,f=DOMTokenList.prototype.remove;DOMTokenList.prototype.add=function(){for(var a=0;a<arguments.length;a++)e.call(this,arguments[a])},DOMTokenList.prototype.remove=function(){for(var a=0;a<arguments.length;a++)f.call(this,arguments[a])},DOMTokenList.prototype.toggle=function(a,b){1==arguments.length&&(b=!this.contains(a)),b?this.add(a):this.remove(a)},DOMTokenList.prototype.switch=function(a,b){a&&this.remove(a),b&&this.add(b)};var g=function(){return Array.prototype.slice.call(this)},h=window.NamedNodeMap||window.MozNamedAttrMap||{};NodeList.prototype.array=g,h.prototype.array=g,HTMLCollection.prototype.array=g,a.createDOM=b}(Polymer),function(a){function b(a){var e=b.caller,g=e.nom,h=e._super;h||(g||(g=e.nom=c.call(this,e)),g||console.warn("called super() on a method not installed declaratively (has no .nom property)"),h=d(e,g,f(this)));var i=h[g];return i?(i._super||d(i,g,h),i.apply(this,a||[])):void 0}function c(a){for(var b=this.__proto__;b&&b!==HTMLElement.prototype;){for(var c,d=Object.getOwnPropertyNames(b),e=0,f=d.length;f>e&&(c=d[e]);e++){var g=Object.getOwnPropertyDescriptor(b,c);if("function"==typeof g.value&&g.value===a)return c}b=b.__proto__}}function d(a,b,c){var d=e(c,b,a);return d[b]&&(d[b].nom=b),a._super=d}function e(a,b,c){for(;a;){if(a[b]!==c&&a[b])return a;a=f(a)}return Object}function f(a){return a.__proto__}a.super=b}(Polymer),function(a){function b(a){return a}function c(a,b){var c=typeof b;return b instanceof Date&&(c="date"),d[c](a,b)}var d={string:b,undefined:b,date:function(a){return new Date(Date.parse(a)||Date.now())},"boolean":function(a){return""===a?!0:"false"===a?!1:!!a},number:function(a){var b=parseFloat(a);return 0===b&&(b=parseInt(a)),isNaN(b)?a:b},object:function(a,b){if(null===b)return a;try{return JSON.parse(a.replace(/'/g,'"'))}catch(c){return a}},"function":function(a,b){return b}};a.deserializeValue=c}(Polymer),function(a){var b=a.extend,c={};c.declaration={},c.instance={},c.publish=function(a,c){for(var d in a)b(c,a[d])},a.api=c}(Polymer),function(a){var b={async:function(a,b,c){Platform.flush(),b=b&&b.length?b:[b];var d=function(){(this[a]||a).apply(this,b)}.bind(this),e=c?setTimeout(d,c):requestAnimationFrame(d);return c?e:~e},cancelAsync:function(a){0>a?cancelAnimationFrame(~a):clearTimeout(a)},fire:function(a,b,c,d,e){var f=c||this,b=null===b||void 0===b?{}:b,g=new CustomEvent(a,{bubbles:void 0!==d?d:!0,cancelable:void 0!==e?e:!0,detail:b});return f.dispatchEvent(g),g},asyncFire:function(){this.async("fire",arguments)},classFollows:function(a,b,c){b&&b.classList.remove(c),a&&a.classList.add(c)},injectBoundHTML:function(a,b){var c=document.createElement("template");c.innerHTML=a;var d=this.instanceTemplate(c);return b&&(b.textContent="",b.appendChild(d)),d}},c=function(){},d={};b.asyncMethod=b.async,a.api.instance.utils=b,a.nop=c,a.nob=d}(Polymer),function(a){var b=window.logFlags||{},c="on-",d={EVENT_PREFIX:c,addHostListeners:function(){var a=this.eventDelegates;b.events&&Object.keys(a).length>0&&console.log("[%s] addHostListeners:",this.localName,a);for(var c in a){var d=a[c];PolymerGestures.addEventListener(this,c,this.element.getEventHandler(this,this,d))}},dispatchMethod:function(a,c,d){if(a){b.events&&console.group("[%s] dispatch [%s]",a.localName,c);var e="function"==typeof c?c:a[c];e&&e[d?"apply":"call"](a,d),b.events&&console.groupEnd(),Platform.flush()}}};a.api.instance.events=d,a.addEventListener=function(a,b,c,d){PolymerGestures.addEventListener(wrap(a),b,c,d)},a.removeEventListener=function(a,b,c,d){PolymerGestures.removeEventListener(wrap(a),b,c,d)}}(Polymer),function(a){var b={copyInstanceAttributes:function(){var a=this._instanceAttributes;for(var b in a)this.hasAttribute(b)||this.setAttribute(b,a[b])},takeAttributes:function(){if(this._publishLC)for(var a,b=0,c=this.attributes,d=c.length;(a=c[b])&&d>b;b++)this.attributeToProperty(a.name,a.value)},attributeToProperty:function(b,c){var b=this.propertyForAttribute(b);if(b){if(c&&c.search(a.bindPattern)>=0)return;var d=this[b],c=this.deserializeValue(c,d);c!==d&&(this[b]=c)}},propertyForAttribute:function(a){var b=this._publishLC&&this._publishLC[a];return b},deserializeValue:function(b,c){return a.deserializeValue(b,c)},serializeValue:function(a,b){return"boolean"===b?a?"":void 0:"object"!==b&&"function"!==b&&void 0!==a?a:void 0},reflectPropertyToAttribute:function(a){var b=typeof this[a],c=this.serializeValue(this[a],b);void 0!==c?this.setAttribute(a,c):"boolean"===b&&this.removeAttribute(a)}};a.api.instance.attributes=b}(Polymer),function(a){function b(a,b){return a===b?0!==a||1/a===1/b:f(a)&&f(b)?!0:a!==a&&b!==b}function c(a,b){return void 0===b&&null===a?b:null===b||void 0===b?a:b}var d=window.logFlags||{},e={object:void 0,type:"update",name:void 0,oldValue:void 0},f=Number.isNaN||function(a){return"number"==typeof a&&isNaN(a)},g={createPropertyObserver:function(){var a=this._observeNames;if(a&&a.length){var b=this._propertyObserver=new CompoundObserver(!0);this.registerObserver(b);for(var c,d=0,e=a.length;e>d&&(c=a[d]);d++)b.addPath(this,c),this.observeArrayValue(c,this[c],null)}},openPropertyObserver:function(){this._propertyObserver&&this._propertyObserver.open(this.notifyPropertyChanges,this)},notifyPropertyChanges:function(a,b,c){var d,e,f={};for(var g in b)if(d=c[2*g+1],e=this.observe[d]){var h=b[g],i=a[g];this.observeArrayValue(d,i,h),f[e]||(void 0!==h&&null!==h||void 0!==i&&null!==i)&&(f[e]=!0,this.invokeMethod(e,[h,i,arguments]))}},deliverChanges:function(){this._propertyObserver&&this._propertyObserver.deliver()},propertyChanged_:function(a){this.reflect[a]&&this.reflectPropertyToAttribute(a)},observeArrayValue:function(a,b,c){var e=this.observe[a];if(e&&(Array.isArray(c)&&(d.observe&&console.log("[%s] observeArrayValue: unregister observer [%s]",this.localName,a),this.closeNamedObserver(a+"__array")),Array.isArray(b))){d.observe&&console.log("[%s] observeArrayValue: register observer [%s]",this.localName,a,b);var f=new ArrayObserver(b);f.open(function(a){this.invokeMethod(e,[a])},this),this.registerNamedObserver(a+"__array",f)}},emitPropertyChangeRecord:function(a,c,d){if(!b(c,d)&&(this.propertyChanged_(a,c,d),Observer.hasObjectObserve)){var f=this.notifier_;f||(f=this.notifier_=Object.getNotifier(this)),e.object=this,e.name=a,e.oldValue=d,f.notify(e)}},bindToAccessor:function(a,c,d){function e(b,c){j[f]=b;var d=j[h];d&&"function"==typeof d.setValue&&d.setValue(b),j.emitPropertyChangeRecord(a,b,c)}var f=a+"_",g=a+"Observable_",h=a+"ComputedBoundObservable_";this[g]=c;var i=this[f],j=this,k=c.open(e);if(d&&!b(i,k)){var l=d(i,k);b(k,l)||(k=l,c.setValue&&c.setValue(k))}e(k,i);var m={close:function(){c.close(),j[g]=void 0,j[h]=void 0}};return this.registerObserver(m),m},createComputedProperties:function(){if(this._computedNames)for(var a=0;a<this._computedNames.length;a++){var b=this._computedNames[a],c=this.computed[b];try{var d=PolymerExpressions.getExpression(c),e=d.getBinding(this,this.element.syntax);this.bindToAccessor(b,e)}catch(f){console.error("Failed to create computed property",f)}}},bindProperty:function(a,b,d){if(d)return void(this[a]=b);var e=this.element.prototype.computed;if(e&&e[a]){var f=a+"ComputedBoundObservable_";return void(this[f]=b)}return this.bindToAccessor(a,b,c)},invokeMethod:function(a,b){var c=this[a]||a;"function"==typeof c&&c.apply(this,b)},registerObserver:function(a){return this._observers?void this._observers.push(a):void(this._observers=[a])},closeObservers:function(){if(this._observers){for(var a=this._observers,b=0;b<a.length;b++){var c=a[b];c&&"function"==typeof c.close&&c.close()}this._observers=[]}},registerNamedObserver:function(a,b){var c=this._namedObservers||(this._namedObservers={});c[a]=b},closeNamedObserver:function(a){var b=this._namedObservers;return b&&b[a]?(b[a].close(),b[a]=null,!0):void 0},closeNamedObservers:function(){if(this._namedObservers){for(var a in this._namedObservers)this.closeNamedObserver(a);this._namedObservers={}}}};a.api.instance.properties=g}(Polymer),function(a){var b=window.logFlags||0,c={instanceTemplate:function(a){HTMLTemplateElement.decorate(a);for(var b=this.syntax||!a.bindingDelegate&&this.element.syntax,c=a.createInstance(this,b),d=c.bindings_,e=0;e<d.length;e++)this.registerObserver(d[e]);return c},bind:function(a,b,c){var d=this.propertyForAttribute(a);if(d){var e=this.bindProperty(d,b,c);return Platform.enableBindingsReflection&&e&&(e.path=b.path_,this._recordBinding(d,e)),this.reflect[d]&&this.reflectPropertyToAttribute(d),e}return this.mixinSuper(arguments)},bindFinished:function(){this.makeElementReady()},_recordBinding:function(a,b){this.bindings_=this.bindings_||{},this.bindings_[a]=b},asyncUnbindAll:function(){this._unbound||(b.unbind&&console.log("[%s] asyncUnbindAll",this.localName),this._unbindAllJob=this.job(this._unbindAllJob,this.unbindAll,0))},unbindAll:function(){this._unbound||(this.closeObservers(),this.closeNamedObservers(),this._unbound=!0)},cancelUnbindAll:function(){return this._unbound?void(b.unbind&&console.warn("[%s] already unbound, cannot cancel unbindAll",this.localName)):(b.unbind&&console.log("[%s] cancelUnbindAll",this.localName),void(this._unbindAllJob&&(this._unbindAllJob=this._unbindAllJob.stop())))}},d=/\{\{([^{}]*)}}/;a.bindPattern=d,a.api.instance.mdv=c}(Polymer),function(a){function b(a){return a.hasOwnProperty("PolymerBase")}function c(){}var d={PolymerBase:!0,job:function(a,b,c){if("string"!=typeof a)return Polymer.job.call(this,a,b,c);var d="___"+a;this[d]=Polymer.job.call(this,this[d],b,c)},"super":Polymer.super,created:function(){},ready:function(){},createdCallback:function(){this.templateInstance&&this.templateInstance.model&&console.warn("Attributes on "+this.localName+" were data bound prior to Polymer upgrading the element. This may result in incorrect binding types."),this.created(),this.prepareElement(),this.ownerDocument.isStagingDocument||this.makeElementReady()},prepareElement:function(){return this._elementPrepared?void console.warn("Element already prepared",this.localName):(this._elementPrepared=!0,this.shadowRoots={},this.createPropertyObserver(),this.openPropertyObserver(),this.copyInstanceAttributes(),this.takeAttributes(),void this.addHostListeners())},makeElementReady:function(){this._readied||(this._readied=!0,this.createComputedProperties(),this.parseDeclarations(this.__proto__),this.removeAttribute("unresolved"),this.ready())},attachedCallback:function(){this.cancelUnbindAll(),this.attached&&this.attached(),this.enteredView&&this.enteredView(),this.hasBeenAttached||(this.hasBeenAttached=!0,this.domReady&&this.async("domReady"))},detachedCallback:function(){this.preventDispose||this.asyncUnbindAll(),this.detached&&this.detached(),this.leftView&&this.leftView()},enteredViewCallback:function(){this.attachedCallback()},leftViewCallback:function(){this.detachedCallback()},enteredDocumentCallback:function(){this.attachedCallback()},leftDocumentCallback:function(){this.detachedCallback()},parseDeclarations:function(a){a&&a.element&&(this.parseDeclarations(a.__proto__),a.parseDeclaration.call(this,a.element))},parseDeclaration:function(a){var b=this.fetchTemplate(a);if(b){var c=this.shadowFromTemplate(b);this.shadowRoots[a.name]=c}},fetchTemplate:function(a){return a.querySelector("template")},shadowFromTemplate:function(a){if(a){var b=this.createShadowRoot(),c=this.instanceTemplate(a);return b.appendChild(c),this.shadowRootReady(b,a),b}},lightFromTemplate:function(a,b){if(a){this.eventController=this;var c=this.instanceTemplate(a);return b?this.insertBefore(c,b):this.appendChild(c),this.shadowRootReady(this),c}},shadowRootReady:function(a){this.marshalNodeReferences(a)},marshalNodeReferences:function(a){var b=this.$=this.$||{};if(a)for(var c,d=a.querySelectorAll("[id]"),e=0,f=d.length;f>e&&(c=d[e]);e++)b[c.id]=c},attributeChangedCallback:function(a){"class"!==a&&"style"!==a&&this.attributeToProperty(a,this.getAttribute(a)),this.attributeChanged&&this.attributeChanged.apply(this,arguments)},onMutation:function(a,b){var c=new MutationObserver(function(a){b.call(this,c,a),c.disconnect()}.bind(this));c.observe(a,{childList:!0,subtree:!0})}};c.prototype=d,d.constructor=c,a.Base=c,a.isBase=b,a.api.instance.base=d}(Polymer),function(a){function b(a){return a.__proto__}function c(a,b){var c="",d=!1;b&&(c=b.localName,d=b.hasAttribute("is"));var e=Platform.ShadowCSS.makeScopeSelector(c,d);return Platform.ShadowCSS.shimCssText(a,e)}var d=(window.logFlags||{},window.ShadowDOMPolyfill),e="element",f="controller",g={STYLE_SCOPE_ATTRIBUTE:e,installControllerStyles:function(){var a=this.findStyleScope();if(a&&!this.scopeHasNamedStyle(a,this.localName)){for(var c=b(this),d="";c&&c.element;)d+=c.element.cssTextForScope(f),c=b(c);d&&this.installScopeCssText(d,a)}},installScopeStyle:function(a,b,c){var c=c||this.findStyleScope(),b=b||"";if(c&&!this.scopeHasNamedStyle(c,this.localName+b)){var d="";if(a instanceof Array)for(var e,f=0,g=a.length;g>f&&(e=a[f]);f++)d+=e.textContent+"\n\n";else d=a.textContent;this.installScopeCssText(d,c,b)}},installScopeCssText:function(a,b,e){if(b=b||this.findStyleScope(),e=e||"",b){d&&(a=c(a,b.host));var g=this.element.cssTextToScopeStyle(a,f);Polymer.applyStyleToScope(g,b),this.styleCacheForScope(b)[this.localName+e]=!0}},findStyleScope:function(a){for(var b=a||this;b.parentNode;)b=b.parentNode;return b},scopeHasNamedStyle:function(a,b){var c=this.styleCacheForScope(a);
return c[b]},styleCacheForScope:function(a){if(d){var b=a.host?a.host.localName:a.localName;return h[b]||(h[b]={})}return a._scopeStyles=a._scopeStyles||{}}},h={};a.api.instance.styles=g}(Polymer),function(a){function b(a,b){if("string"!=typeof a){var c=b||document._currentScript;if(b=a,a=c&&c.parentNode&&c.parentNode.getAttribute?c.parentNode.getAttribute("name"):"",!a)throw"Element name could not be inferred."}if(f(a))throw"Already registered (Polymer) prototype for element "+a;e(a,b),d(a)}function c(a,b){i[a]=b}function d(a){i[a]&&(i[a].registerWhenReady(),delete i[a])}function e(a,b){return j[a]=b||{}}function f(a){return j[a]}function g(a,b){if("string"!=typeof b)return!1;var c=HTMLElement.getPrototypeForTag(b),d=c&&c.constructor;return d?CustomElements.instanceof?CustomElements.instanceof(a,d):a instanceof d:!1}var h=a.extend,i=(a.api,{}),j={};a.getRegisteredPrototype=f,a.waitingForPrototype=c,a.instanceOfType=g,window.Polymer=b,h(Polymer,a),Platform.consumeDeclarations&&Platform.consumeDeclarations(function(a){if(a)for(var c,d=0,e=a.length;e>d&&(c=a[d]);d++)b.apply(null,c)})}(Polymer),function(a){var b={resolveElementPaths:function(a){Polymer.urlResolver.resolveDom(a)},addResolvePathApi:function(){var a=this.getAttribute("assetpath")||"",b=new URL(a,this.ownerDocument.baseURI);this.prototype.resolvePath=function(a,c){var d=new URL(a,c||b);return d.href}}};a.api.declaration.path=b}(Polymer),function(a){function b(a,b){var c=new URL(a.getAttribute("href"),b).href;return"@import '"+c+"';"}function c(a,b){if(a){b===document&&(b=document.head),i&&(b=document.head);var c=d(a.textContent),e=a.getAttribute(h);e&&c.setAttribute(h,e);var f=b.firstElementChild;if(b===document.head){var g="style["+h+"]",j=document.head.querySelectorAll(g);j.length&&(f=j[j.length-1].nextElementSibling)}b.insertBefore(c,f)}}function d(a,b){b=b||document,b=b.createElement?b:b.ownerDocument;var c=b.createElement("style");return c.textContent=a,c}function e(a){return a&&a.__resource||""}function f(a,b){return q?q.call(a,b):void 0}var g=(window.logFlags||{},a.api.instance.styles),h=g.STYLE_SCOPE_ATTRIBUTE,i=window.ShadowDOMPolyfill,j="style",k="@import",l="link[rel=stylesheet]",m="global",n="polymer-scope",o={loadStyles:function(a){var b=this.fetchTemplate(),c=b&&this.templateContent();if(c){this.convertSheetsToStyles(c);var d=this.findLoadableStyles(c);if(d.length){var e=b.ownerDocument.baseURI;return Polymer.styleResolver.loadStyles(d,e,a)}}a&&a()},convertSheetsToStyles:function(a){for(var c,e,f=a.querySelectorAll(l),g=0,h=f.length;h>g&&(c=f[g]);g++)e=d(b(c,this.ownerDocument.baseURI),this.ownerDocument),this.copySheetAttributes(e,c),c.parentNode.replaceChild(e,c)},copySheetAttributes:function(a,b){for(var c,d=0,e=b.attributes,f=e.length;(c=e[d])&&f>d;d++)"rel"!==c.name&&"href"!==c.name&&a.setAttribute(c.name,c.value)},findLoadableStyles:function(a){var b=[];if(a)for(var c,d=a.querySelectorAll(j),e=0,f=d.length;f>e&&(c=d[e]);e++)c.textContent.match(k)&&b.push(c);return b},installSheets:function(){this.cacheSheets(),this.cacheStyles(),this.installLocalSheets(),this.installGlobalStyles()},cacheSheets:function(){this.sheets=this.findNodes(l),this.sheets.forEach(function(a){a.parentNode&&a.parentNode.removeChild(a)})},cacheStyles:function(){this.styles=this.findNodes(j+"["+n+"]"),this.styles.forEach(function(a){a.parentNode&&a.parentNode.removeChild(a)})},installLocalSheets:function(){var a=this.sheets.filter(function(a){return!a.hasAttribute(n)}),b=this.templateContent();if(b){var c="";if(a.forEach(function(a){c+=e(a)+"\n"}),c){var f=d(c,this.ownerDocument);b.insertBefore(f,b.firstChild)}}},findNodes:function(a,b){var c=this.querySelectorAll(a).array(),d=this.templateContent();if(d){var e=d.querySelectorAll(a).array();c=c.concat(e)}return b?c.filter(b):c},installGlobalStyles:function(){var a=this.styleForScope(m);c(a,document.head)},cssTextForScope:function(a){var b="",c="["+n+"="+a+"]",d=function(a){return f(a,c)},g=this.sheets.filter(d);g.forEach(function(a){b+=e(a)+"\n\n"});var h=this.styles.filter(d);return h.forEach(function(a){b+=a.textContent+"\n\n"}),b},styleForScope:function(a){var b=this.cssTextForScope(a);return this.cssTextToScopeStyle(b,a)},cssTextToScopeStyle:function(a,b){if(a){var c=d(a);return c.setAttribute(h,this.getAttribute("name")+"-"+b),c}}},p=HTMLElement.prototype,q=p.matches||p.matchesSelector||p.webkitMatchesSelector||p.mozMatchesSelector;a.api.declaration.styles=o,a.applyStyleToScope=c}(Polymer),function(a){var b=(window.logFlags||{},a.api.instance.events),c=b.EVENT_PREFIX,d={};["webkitAnimationStart","webkitAnimationEnd","webkitTransitionEnd","DOMFocusOut","DOMFocusIn","DOMMouseScroll"].forEach(function(a){d[a.toLowerCase()]=a});var e={parseHostEvents:function(){var a=this.prototype.eventDelegates;this.addAttributeDelegates(a)},addAttributeDelegates:function(a){for(var b,c=0;b=this.attributes[c];c++)this.hasEventPrefix(b.name)&&(a[this.removeEventPrefix(b.name)]=b.value.replace("{{","").replace("}}","").trim())},hasEventPrefix:function(a){return a&&"o"===a[0]&&"n"===a[1]&&"-"===a[2]},removeEventPrefix:function(a){return a.slice(f)},findController:function(a){for(;a.parentNode;){if(a.eventController)return a.eventController;a=a.parentNode}return a.host},getEventHandler:function(a,b,c){var d=this;return function(e){a&&a.PolymerBase||(a=d.findController(b));var f=[e,e.detail,e.currentTarget];a.dispatchMethod(a,c,f)}},prepareEventBinding:function(a,b){if(this.hasEventPrefix(b)){var c=this.removeEventPrefix(b);c=d[c]||c;var e=this;return function(b,d,f){function g(){return"{{ "+a+" }}"}var h=e.getEventHandler(void 0,d,a);return PolymerGestures.addEventListener(d,c,h),f?void 0:{open:g,discardChanges:g,close:function(){PolymerGestures.removeEventListener(d,c,h)}}}}}},f=c.length;a.api.declaration.events=e}(Polymer),function(a){var b={inferObservers:function(a){var b,c=a.observe;for(var d in a)"Changed"===d.slice(-7)&&(c||(c=a.observe={}),b=d.slice(0,-7),c[b]=c[b]||d)},explodeObservers:function(a){var b=a.observe;if(b){var c={};for(var d in b)for(var e,f=d.split(" "),g=0;e=f[g];g++)c[e]=b[d];a.observe=c}},optimizePropertyMaps:function(a){if(a.observe){var b=a._observeNames=[];for(var c in a.observe)for(var d,e=c.split(" "),f=0;d=e[f];f++)b.push(d)}if(a.publish){var b=a._publishNames=[];for(var c in a.publish)b.push(c)}if(a.computed){var b=a._computedNames=[];for(var c in a.computed)b.push(c)}},publishProperties:function(a,b){var c=a.publish;c&&(this.requireProperties(c,a,b),a._publishLC=this.lowerCaseMap(c))},requireProperties:function(a,b){b.reflect=b.reflect||{};for(var c in a){var d=a[c];d&&void 0!==d.reflect&&(b.reflect[c]=Boolean(d.reflect),d=d.value),void 0!==d&&(b[c]=d)}},lowerCaseMap:function(a){var b={};for(var c in a)b[c.toLowerCase()]=c;return b},createPropertyAccessor:function(a,b){var c=this.prototype,d=a+"_",e=a+"Observable_";c[d]=c[a],Object.defineProperty(c,a,{get:function(){var a=this[e];return a&&a.deliver(),this[d]},set:function(c){if(b)return this[d];var f=this[e];if(f)return void f.setValue(c);var g=this[d];return this[d]=c,this.emitPropertyChangeRecord(a,c,g),c},configurable:!0})},createPropertyAccessors:function(a){var b=a._computedNames;if(b&&b.length)for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.createPropertyAccessor(c,!0);var b=a._publishNames;if(b&&b.length)for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)a.computed&&a.computed[c]||this.createPropertyAccessor(c)}};a.api.declaration.properties=b}(Polymer),function(a){var b="attributes",c=/\s|,/,d={inheritAttributesObjects:function(a){this.inheritObject(a,"publishLC"),this.inheritObject(a,"_instanceAttributes")},publishAttributes:function(a){var d=this.getAttribute(b);if(d)for(var e,f=a.publish||(a.publish={}),g=d.split(c),h=0,i=g.length;i>h;h++)e=g[h].trim(),e&&void 0===f[e]&&(f[e]=void 0)},accumulateInstanceAttributes:function(){for(var a,b=this.prototype._instanceAttributes,c=this.attributes,d=0,e=c.length;e>d&&(a=c[d]);d++)this.isInstanceAttribute(a.name)&&(b[a.name]=a.value)},isInstanceAttribute:function(a){return!this.blackList[a]&&"on-"!==a.slice(0,3)},blackList:{name:1,"extends":1,constructor:1,noscript:1,assetpath:1,"cache-csstext":1}};d.blackList[b]=1,a.api.declaration.attributes=d}(Polymer),function(a){var b=a.api.declaration.events,c=new PolymerExpressions,d=c.prepareBinding;c.prepareBinding=function(a,e,f){return b.prepareEventBinding(a,e,f)||d.call(c,a,e,f)};var e={syntax:c,fetchTemplate:function(){return this.querySelector("template")},templateContent:function(){var a=this.fetchTemplate();return a&&a.content},installBindingDelegate:function(a){a&&(a.bindingDelegate=this.syntax)}};a.api.declaration.mdv=e}(Polymer),function(a){function b(a){if(!Object.__proto__){var b=Object.getPrototypeOf(a);a.__proto__=b,d(b)&&(b.__proto__=Object.getPrototypeOf(b))}}var c=a.api,d=a.isBase,e=a.extend,f=window.ShadowDOMPolyfill,g={register:function(a,b){this.buildPrototype(a,b),this.registerPrototype(a,b),this.publishConstructor()},buildPrototype:function(b,c){var d=a.getRegisteredPrototype(b),e=this.generateBasePrototype(c);this.desugarBeforeChaining(d,e),this.prototype=this.chainPrototypes(d,e),this.desugarAfterChaining(b,c)},desugarBeforeChaining:function(a,b){a.element=this,this.publishAttributes(a,b),this.publishProperties(a,b),this.inferObservers(a),this.explodeObservers(a)},chainPrototypes:function(a,c){this.inheritMetaData(a,c);var d=this.chainObject(a,c);return b(d),d},inheritMetaData:function(a,b){this.inheritObject("observe",a,b),this.inheritObject("publish",a,b),this.inheritObject("reflect",a,b),this.inheritObject("_publishLC",a,b),this.inheritObject("_instanceAttributes",a,b),this.inheritObject("eventDelegates",a,b)},desugarAfterChaining:function(a,b){this.optimizePropertyMaps(this.prototype),this.createPropertyAccessors(this.prototype),this.installBindingDelegate(this.fetchTemplate()),this.installSheets(),this.resolveElementPaths(this),this.accumulateInstanceAttributes(),this.parseHostEvents(),this.addResolvePathApi(),f&&Platform.ShadowCSS.shimStyling(this.templateContent(),a,b),this.prototype.registerCallback&&this.prototype.registerCallback(this)},publishConstructor:function(){var a=this.getAttribute("constructor");a&&(window[a]=this.ctor)},generateBasePrototype:function(a){var b=this.findBasePrototype(a);if(!b){var b=HTMLElement.getPrototypeForTag(a);b=this.ensureBaseApi(b),h[a]=b}return b},findBasePrototype:function(a){return h[a]},ensureBaseApi:function(a){if(a.PolymerBase)return a;var b=Object.create(a);return c.publish(c.instance,b),this.mixinMethod(b,a,c.instance.mdv,"bind"),b},mixinMethod:function(a,b,c,d){var e=function(a){return b[d].apply(this,a)};a[d]=function(){return this.mixinSuper=e,c[d].apply(this,arguments)}},inheritObject:function(a,b,c){var d=b[a]||{};b[a]=this.chainObject(d,c[a])},registerPrototype:function(a,b){var c={prototype:this.prototype},d=this.findTypeExtension(b);d&&(c.extends=d),HTMLElement.register(a,this.prototype),this.ctor=document.registerElement(a,c)},findTypeExtension:function(a){if(a&&a.indexOf("-")<0)return a;var b=this.findBasePrototype(a);return b.element?this.findTypeExtension(b.element.extends):void 0}},h={};g.chainObject=Object.__proto__?function(a,b){return a&&b&&a!==b&&(a.__proto__=b),a}:function(a,b){if(a&&b&&a!==b){var c=Object.create(b);a=e(c,a)}return a},c.declaration.prototype=g}(Polymer),function(a){function b(a){return document.contains(a)?j:i}function c(){return i.length?i[0]:j[0]}function d(a){f.waitToReady=!0,Platform.endOfMicrotask(function(){HTMLImports.whenReady(function(){f.addReadyCallback(a),f.waitToReady=!1,f.check()})})}function e(a){if(void 0===a)return void f.ready();var b=setTimeout(function(){f.ready()},a);Polymer.whenReady(function(){clearTimeout(b)})}var f={wait:function(a){a.__queue||(a.__queue={},g.push(a))},enqueue:function(a,c,d){var e=a.__queue&&!a.__queue.check;return e&&(b(a).push(a),a.__queue.check=c,a.__queue.go=d),0!==this.indexOf(a)},indexOf:function(a){var c=b(a).indexOf(a);return c>=0&&document.contains(a)&&(c+=HTMLImports.useNative||HTMLImports.ready?i.length:1e9),c},go:function(a){var b=this.remove(a);b&&(a.__queue.flushable=!0,this.addToFlushQueue(b),this.check())},remove:function(a){var c=this.indexOf(a);if(0===c)return b(a).shift()},check:function(){var a=this.nextElement();return a&&a.__queue.check.call(a),this.canReady()?(this.ready(),!0):void 0},nextElement:function(){return c()},canReady:function(){return!this.waitToReady&&this.isEmpty()},isEmpty:function(){for(var a,b=0,c=g.length;c>b&&(a=g[b]);b++)if(a.__queue&&!a.__queue.flushable)return;return!0},addToFlushQueue:function(a){h.push(a)},flush:function(){if(!this.flushing){this.flushing=!0;for(var a;h.length;)a=h.shift(),a.__queue.go.call(a),a.__queue=null;this.flushing=!1}},ready:function(){var a=CustomElements.ready;CustomElements.ready=!1,this.flush(),CustomElements.useNative||CustomElements.upgradeDocumentTree(document),CustomElements.ready=a,Platform.flush(),requestAnimationFrame(this.flushReadyCallbacks)},addReadyCallback:function(a){a&&k.push(a)},flushReadyCallbacks:function(){if(k)for(var a;k.length;)(a=k.shift())()},waitingFor:function(){for(var a,b=[],c=0,d=g.length;d>c&&(a=g[c]);c++)a.__queue&&!a.__queue.flushable&&b.push(a);return b},waitToReady:!0},g=[],h=[],i=[],j=[],k=[];a.elements=g,a.waitingFor=f.waitingFor.bind(f),a.forceReady=e,a.queue=f,a.whenReady=a.whenPolymerReady=d}(Polymer),function(a){function b(a){return Boolean(HTMLElement.getPrototypeForTag(a))}function c(a){return a&&a.indexOf("-")>=0}var d=a.extend,e=a.api,f=a.queue,g=a.whenReady,h=a.getRegisteredPrototype,i=a.waitingForPrototype,j=d(Object.create(HTMLElement.prototype),{createdCallback:function(){this.getAttribute("name")&&this.init()},init:function(){this.name=this.getAttribute("name"),this.extends=this.getAttribute("extends"),f.wait(this),this.loadResources(),this.registerWhenReady()},registerWhenReady:function(){this.registered||this.waitingForPrototype(this.name)||this.waitingForQueue()||this.waitingForResources()||f.go(this)},_register:function(){c(this.extends)&&!b(this.extends)&&console.warn("%s is attempting to extend %s, an unregistered element or one that was not registered with Polymer.",this.name,this.extends),this.register(this.name,this.extends),this.registered=!0},waitingForPrototype:function(a){return h(a)?void 0:(i(a,this),this.handleNoScript(a),!0)},handleNoScript:function(a){this.hasAttribute("noscript")&&!this.noscript&&(this.noscript=!0,Polymer(a))},waitingForResources:function(){return this._needsResources},waitingForQueue:function(){return f.enqueue(this,this.registerWhenReady,this._register)},loadResources:function(){this._needsResources=!0,this.loadStyles(function(){this._needsResources=!1,this.registerWhenReady()}.bind(this))}});e.publish(e.declaration,j),g(function(){document.body.removeAttribute("unresolved"),document.dispatchEvent(new CustomEvent("polymer-ready",{bubbles:!0}))}),document.registerElement("polymer-element",{prototype:j})}(Polymer),function(a){function b(a,b){a?(document.head.appendChild(a),d(b)):b&&b()}function c(a,c){if(a&&a.length){for(var d,e,f=document.createDocumentFragment(),g=0,h=a.length;h>g&&(d=a[g]);g++)e=document.createElement("link"),e.rel="import",e.href=d,f.appendChild(e);b(f,c)}else c&&c()}var d=a.whenPolymerReady;a.import=c,a.importElements=b}(Polymer),function(){var a=document.createElement("polymer-element");a.setAttribute("name","auto-binding"),a.setAttribute("extends","template"),a.init(),Polymer("auto-binding",{createdCallback:function(){this.syntax=this.bindingDelegate=this.makeSyntax(),Polymer.whenPolymerReady(function(){this.model=this,this.setAttribute("bind",""),this.async(function(){this.marshalNodeReferences(this.parentNode),this.fire("template-bound")})}.bind(this))},makeSyntax:function(){var a=Object.create(Polymer.api.declaration.events),b=this;a.findController=function(){return b.model};var c=new PolymerExpressions,d=c.prepareBinding;return c.prepareBinding=function(b,e,f){return a.prepareEventBinding(b,e,f)||d.call(c,b,e,f)},c}})}();
//# sourceMappingURL=polymer.js.map;


  (function() {
    
    var SKIP_ID = 'meta';
    var metaData = {}, metaArray = {};

    Polymer('core-meta', {
      
      /**
       * The type of meta-data.  All meta-data with the same type with be
       * stored together.
       * 
       * @attribute type
       * @type string
       * @default 'default'
       */
      type: 'default',
      
      alwaysPrepare: true,
      
      ready: function() {
        this.register(this.id);
      },
      
      get metaArray() {
        var t = this.type;
        if (!metaArray[t]) {
          metaArray[t] = [];
        }
        return metaArray[t];
      },
      
      get metaData() {
        var t = this.type;
        if (!metaData[t]) {
          metaData[t] = {};
        }
        return metaData[t];
      },
      
      register: function(id, old) {
        if (id && id !== SKIP_ID) {
          this.unregister(this, old);
          this.metaData[id] = this;
          this.metaArray.push(this);
        }
      },
      
      unregister: function(meta, id) {
        delete this.metaData[id || meta.id];
        var i = this.metaArray.indexOf(meta);
        if (i >= 0) {
          this.metaArray.splice(i, 1);
        }
      },
      
      /**
       * Returns a list of all meta-data elements with the same type.
       * 
       * @property list
       * @type array
       * @default []
       */
      get list() {
        return this.metaArray;
      },
      
      /**
       * Retrieves meta-data by ID.
       *
       * @method byId
       * @param {String} id The ID of the meta-data to be returned.
       * @returns Returns meta-data.
       */
      byId: function(id) {
        return this.metaData[id];
      }
      
    });
    
  })();
  
;

  
    Polymer('core-iconset', {
  
      /**
       * The URL of the iconset image.
       *
       * @attribute src
       * @type string
       * @default ''
       */
      src: '',

      /**
       * The width of the iconset image. This must only be specified if the
       * icons are arranged into separate rows inside the image.
       *
       * @attribute width
       * @type number
       * @default 0
       */
      width: 0,

      /**
       * A space separated list of names corresponding to icons in the iconset
       * image file. This list must be ordered the same as the icon images
       * in the image file.
       *
       * @attribute icons
       * @type string
       * @default ''
       */
      icons: '',

      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * @attribute iconSize
       * @type number
       * @default 24
       */
      iconSize: 24,

      /**
       * The horizontal offset of the icon images in the inconset src image.
       * This is typically used if the image resource contains additional images
       * beside those intended for the iconset.
       *
       * @attribute offsetX
       * @type number
       * @default 0
       */
      offsetX: 0,
      /**
       * The vertical offset of the icon images in the inconset src image.
       * This is typically used if the image resource contains additional images
       * beside those intended for the iconset.
       *
       * @attribute offsetY
       * @type number
       * @default 0
       */
      offsetY: 0,
      type: 'iconset',

      created: function() {
        this.iconMap = {};
        this.iconNames = [];
        this.themes = {};
      },
  
      ready: function() {
        // TODO(sorvell): ensure iconset's src is always relative to the main
        // document
        if (this.src && (this.ownerDocument !== document)) {
          this.src = this.resolvePath(this.src, this.ownerDocument.baseURI);
        }
        this.super();
        this.updateThemes();
      },

      iconsChanged: function() {
        var ox = this.offsetX;
        var oy = this.offsetY;
        this.icons && this.icons.split(/\s+/g).forEach(function(name, i) {
          this.iconNames.push(name);
          this.iconMap[name] = {
            offsetX: ox,
            offsetY: oy
          }
          if (ox + this.iconSize < this.width) {
            ox += this.iconSize;
          } else {
            ox = this.offsetX;
            oy += this.iconSize;
          }
        }, this);
      },

      updateThemes: function() {
        var ts = this.querySelectorAll('property[theme]');
        ts && ts.array().forEach(function(t) {
          this.themes[t.getAttribute('theme')] = {
            offsetX: parseInt(t.getAttribute('offsetX')) || 0,
            offsetY: parseInt(t.getAttribute('offsetY')) || 0
          };
        }, this);
      },

      // TODO(ffu): support retrived by index e.g. getOffset(10);
      /**
       * Returns an object containing `offsetX` and `offsetY` properties which
       * specify the pixel locaion in the iconset's src file for the given
       * `icon` and `theme`. It's uncommon to call this method. It is useful,
       * for example, to manually position a css backgroundImage to the proper
       * offset. It's more common to use the `applyIcon` method.
       *
       * @method getOffset
       * @param {String|Number} icon The name of the icon or the index of the
       * icon within in the icon image.
       * @param {String} theme The name of the theme.
       * @returns {Object} An object specifying the offset of the given icon 
       * within the icon resource file; `offsetX` is the horizontal offset and
       * `offsetY` is the vertical offset. Both values are in pixel units.
       */
      getOffset: function(icon, theme) {
        var i = this.iconMap[icon];
        if (!i) {
          var n = this.iconNames[Number(icon)];
          i = this.iconMap[n];
        }
        var t = this.themes[theme];
        if (i && t) {
          return {
            offsetX: i.offsetX + t.offsetX,
            offsetY: i.offsetY + t.offsetY
          }
        }
        return i;
      },

      /**
       * Applies an icon to the given element as a css background image. This
       * method does not size the element, and it's often necessary to set 
       * the element's height and width so that the background image is visible.
       *
       * @method applyIcon
       * @param {Element} element The element to which the background is
       * applied.
       * @param {String|Number} icon The name or index of the icon to apply.
       * @param {Number} scale (optional, defaults to 1) A scaling factor 
       * with which the icon can be magnified.
       * @return {Element} The icon element.
       */
      applyIcon: function(element, icon, scale) {
        var offset = this.getOffset(icon);
        scale = scale || 1;
        if (element && offset) {
          var icon = element._icon || document.createElement('div');
          var style = icon.style;
          style.backgroundImage = 'url(' + this.src + ')';
          style.backgroundPosition = (-offset.offsetX * scale + 'px') + 
             ' ' + (-offset.offsetY * scale + 'px');
          style.backgroundSize = scale === 1 ? 'auto' :
             this.width * scale + 'px';
          if (icon.parentNode !== element) {
            element.appendChild(icon);
          }
          return icon;
        }
      }

    });

  ;

(function() {
  
  // mono-state
  var meta;
  
  Polymer('core-icon', {

    /**
     * The URL of an image for the icon. If the src property is specified,
     * the icon property should not be.
     *
     * @attribute src
     * @type string
     * @default ''
     */
    src: '',

    /**
     * Specifies the icon name or index in the set of icons available in
     * the icon's icon set. If the icon property is specified,
     * the src property should not be.
     *
     * @attribute icon
     * @type string
     * @default ''
     */
    icon: '',

    /**
     * Alternative text content for accessibility support.
     * If alt is present and not empty, it will set the element's role to img and add an aria-label whose content matches alt.
     * If alt is present and is an empty string, '', it will hide the element from the accessibility layer
     * If alt is not present, it will set the element's role to img and the element will fallback to using the icon attribute for its aria-label.
     * 
     * @attribute alt
     * @type string
     * @default ''
     */
    alt: null,

    observe: {
      'icon': 'updateIcon',
      'alt': 'updateAlt'
    },

    defaultIconset: 'icons',

    ready: function() {
      if (!meta) {
        meta = document.createElement('core-iconset');
      }

      // Allow user-provided `aria-label` in preference to any other text alternative.
      if (this.hasAttribute('aria-label')) {
        // Set `role` if it has not been overridden.
        if (!this.hasAttribute('role')) {
          this.setAttribute('role', 'img');
        }
        return;
      }
      this.updateAlt();
    },

    srcChanged: function() {
      var icon = this._icon || document.createElement('div');
      icon.textContent = '';
      icon.setAttribute('fit', '');
      icon.style.backgroundImage = 'url(' + this.src + ')';
      icon.style.backgroundPosition = 'center';
      icon.style.backgroundSize = '100%';
      if (!icon.parentNode) {
        this.appendChild(icon);
      }
      this._icon = icon;
    },

    getIconset: function(name) {
      return meta.byId(name || this.defaultIconset);
    },

    updateIcon: function(oldVal, newVal) {
      if (!this.icon) {
        this.updateAlt();
        return;
      }
      var parts = String(this.icon).split(':');
      var icon = parts.pop();
      if (icon) {
        var set = this.getIconset(parts.pop());
        if (set) {
          this._icon = set.applyIcon(this, icon);
          if (this._icon) {
            this._icon.setAttribute('fit', '');
          }
        }
      }
      // Check to see if we're using the old icon's name for our a11y fallback
      if (oldVal) {
        if (oldVal.split(':').pop() == this.getAttribute('aria-label')) {
          this.updateAlt();
        }
      }
    },

    updateAlt: function() {
      // Respect the user's decision to remove this element from
      // the a11y tree
      if (this.getAttribute('aria-hidden')) {
        return;
      }

      // Remove element from a11y tree if `alt` is empty, otherwise
      // use `alt` as `aria-label`.
      if (this.alt === '') {
        this.setAttribute('aria-hidden', 'true');
        if (this.hasAttribute('role')) {
          this.removeAttribute('role');
        }
        if (this.hasAttribute('aria-label')) {
          this.removeAttribute('aria-label');
        }
      } else {
        this.setAttribute('aria-label', this.alt ||
                                        this.icon.split(':').pop());
        if (!this.hasAttribute('role')) {
          this.setAttribute('role', 'img');
        }
        if (this.hasAttribute('aria-hidden')) {
          this.removeAttribute('aria-hidden');
        }
      }
    }

  });
  
})();
;


  (function() {

    var waveMaxRadius = 150;
    //
    // INK EQUATIONS
    //
    function waveRadiusFn(touchDownMs, touchUpMs, anim) {
      // Convert from ms to s.
      var touchDown = touchDownMs / 1000;
      var touchUp = touchUpMs / 1000;
      var totalElapsed = touchDown + touchUp;
      var ww = anim.width, hh = anim.height;
      // use diagonal size of container to avoid floating point math sadness
      var waveRadius = Math.min(Math.sqrt(ww * ww + hh * hh), waveMaxRadius) * 1.1 + 5;
      var duration = 1.1 - .2 * (waveRadius / waveMaxRadius);
      var tt = (totalElapsed / duration);

      var size = waveRadius * (1 - Math.pow(80, -tt));
      return Math.abs(size);
    }

    function waveOpacityFn(td, tu, anim) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;
      var totalElapsed = touchDown + touchUp;

      if (tu <= 0) {  // before touch up
        return anim.initialOpacity;
      }
      return Math.max(0, anim.initialOpacity - touchUp * anim.opacityDecayVelocity);
    }

    function waveOuterOpacityFn(td, tu, anim) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;

      // Linear increase in background opacity, capped at the opacity
      // of the wavefront (waveOpacity).
      var outerOpacity = touchDown * 0.3;
      var waveOpacity = waveOpacityFn(td, tu, anim);
      return Math.max(0, Math.min(outerOpacity, waveOpacity));
    }

    // Determines whether the wave should be completely removed.
    function waveDidFinish(wave, radius, anim) {
      var waveOpacity = waveOpacityFn(wave.tDown, wave.tUp, anim);

      // If the wave opacity is 0 and the radius exceeds the bounds
      // of the element, then this is finished.
      return waveOpacity < 0.01 && radius >= Math.min(wave.maxRadius, waveMaxRadius);
    };

    function waveAtMaximum(wave, radius, anim) {
      var waveOpacity = waveOpacityFn(wave.tDown, wave.tUp, anim);

      return waveOpacity >= anim.initialOpacity && radius >= Math.min(wave.maxRadius, waveMaxRadius);
    }

    //
    // DRAWING
    //
    function drawRipple(ctx, x, y, radius, innerAlpha, outerAlpha) {
      // Only animate opacity and transform
      if (outerAlpha !== undefined) {
        ctx.bg.style.opacity = outerAlpha;
      }
      ctx.wave.style.opacity = innerAlpha;

      var s = radius / (ctx.containerSize / 2);
      var dx = x - (ctx.containerWidth / 2);
      var dy = y - (ctx.containerHeight / 2);

      ctx.wc.style.webkitTransform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
      ctx.wc.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';

      // 2d transform for safari because of border-radius and overflow:hidden clipping bug.
      // https://bugs.webkit.org/show_bug.cgi?id=98538
      ctx.wave.style.webkitTransform = 'scale(' + s + ',' + s + ')';
      ctx.wave.style.transform = 'scale3d(' + s + ',' + s + ',1)';
    }

    //
    // SETUP
    //
    function createWave(elem) {
      var elementStyle = window.getComputedStyle(elem);
      var fgColor = elementStyle.color;

      var inner = document.createElement('div');
      inner.style.backgroundColor = fgColor;
      inner.classList.add('wave');

      var outer = document.createElement('div');
      outer.classList.add('wave-container');
      outer.appendChild(inner);

      var container = elem.$.waves;
      container.appendChild(outer);

      elem.$.bg.style.backgroundColor = fgColor;

      var wave = {
        bg: elem.$.bg,
        wc: outer,
        wave: inner,
        waveColor: fgColor,
        maxRadius: 0,
        isMouseDown: false,
        mouseDownStart: 0.0,
        mouseUpStart: 0.0,
        tDown: 0,
        tUp: 0
      };
      return wave;
    }

    function removeWaveFromScope(scope, wave) {
      if (scope.waves) {
        var pos = scope.waves.indexOf(wave);
        scope.waves.splice(pos, 1);
        // FIXME cache nodes
        wave.wc.remove();
      }
    };

    // Shortcuts.
    var pow = Math.pow;
    var now = Date.now;
    if (window.performance && performance.now) {
      now = performance.now.bind(performance);
    }

    function cssColorWithAlpha(cssColor, alpha) {
        var parts = cssColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (typeof alpha == 'undefined') {
            alpha = 1;
        }
        if (!parts) {
          return 'rgba(255, 255, 255, ' + alpha + ')';
        }
        return 'rgba(' + parts[1] + ', ' + parts[2] + ', ' + parts[3] + ', ' + alpha + ')';
    }

    function dist(p1, p2) {
      return Math.sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2));
    }

    function distanceFromPointToFurthestCorner(point, size) {
      var tl_d = dist(point, {x: 0, y: 0});
      var tr_d = dist(point, {x: size.w, y: 0});
      var bl_d = dist(point, {x: 0, y: size.h});
      var br_d = dist(point, {x: size.w, y: size.h});
      return Math.max(tl_d, tr_d, bl_d, br_d);
    }

    Polymer('paper-ripple', {

      /**
       * The initial opacity set on the wave.
       *
       * @attribute initialOpacity
       * @type number
       * @default 0.25
       */
      initialOpacity: 0.25,

      /**
       * How fast (opacity per second) the wave fades out.
       *
       * @attribute opacityDecayVelocity
       * @type number
       * @default 0.8
       */
      opacityDecayVelocity: 0.8,

      backgroundFill: true,
      pixelDensity: 2,

      eventDelegates: {
        down: 'downAction',
        up: 'upAction'
      },

      ready: function() {
        this.waves = [];
      },

      downAction: function(e) {
        var wave = createWave(this);

        this.cancelled = false;
        wave.isMouseDown = true;
        wave.tDown = 0.0;
        wave.tUp = 0.0;
        wave.mouseUpStart = 0.0;
        wave.mouseDownStart = now();

        var rect = this.getBoundingClientRect();
        var width = rect.width;
        var height = rect.height;
        var touchX = e.x - rect.left;
        var touchY = e.y - rect.top;

        wave.startPosition = {x:touchX, y:touchY};

        if (this.classList.contains("recenteringTouch")) {
          wave.endPosition = {x: width / 2,  y: height / 2};
          wave.slideDistance = dist(wave.startPosition, wave.endPosition);
        }
        wave.containerSize = Math.max(width, height);
        wave.containerWidth = width;
        wave.containerHeight = height;
        wave.maxRadius = distanceFromPointToFurthestCorner(wave.startPosition, {w: width, h: height});

        // The wave is circular so constrain its container to 1:1
        wave.wc.style.top = (wave.containerHeight - wave.containerSize) / 2 + 'px';
        wave.wc.style.left = (wave.containerWidth - wave.containerSize) / 2 + 'px';
        wave.wc.style.width = wave.containerSize + 'px';
        wave.wc.style.height = wave.containerSize + 'px';

        this.waves.push(wave);

        if (!this._loop) {
          this._loop = this.animate.bind(this, {
            width: width,
            height: height
          });
          requestAnimationFrame(this._loop);
        }
        // else there is already a rAF
      },

      upAction: function() {
        for (var i = 0; i < this.waves.length; i++) {
          // Declare the next wave that has mouse down to be mouse'ed up.
          var wave = this.waves[i];
          if (wave.isMouseDown) {
            wave.isMouseDown = false
            wave.mouseUpStart = now();
            wave.mouseDownStart = 0;
            wave.tUp = 0.0;
            break;
          }
        }
        this._loop && requestAnimationFrame(this._loop);
      },

      cancel: function() {
        this.cancelled = true;
      },

      animate: function(ctx) {
        var shouldRenderNextFrame = false;

        var deleteTheseWaves = [];
        // The oldest wave's touch down duration
        var longestTouchDownDuration = 0;
        var longestTouchUpDuration = 0;
        // Save the last known wave color
        var lastWaveColor = null;
        // wave animation values
        var anim = {
          initialOpacity: this.initialOpacity,
          opacityDecayVelocity: this.opacityDecayVelocity,
          height: ctx.height,
          width: ctx.width
        }

        for (var i = 0; i < this.waves.length; i++) {
          var wave = this.waves[i];

          if (wave.mouseDownStart > 0) {
            wave.tDown = now() - wave.mouseDownStart;
          }
          if (wave.mouseUpStart > 0) {
            wave.tUp = now() - wave.mouseUpStart;
          }

          // Determine how long the touch has been up or down.
          var tUp = wave.tUp;
          var tDown = wave.tDown;
          longestTouchDownDuration = Math.max(longestTouchDownDuration, tDown);
          longestTouchUpDuration = Math.max(longestTouchUpDuration, tUp);

          // Obtain the instantenous size and alpha of the ripple.
          var radius = waveRadiusFn(tDown, tUp, anim);
          var waveAlpha =  waveOpacityFn(tDown, tUp, anim);
          var waveColor = cssColorWithAlpha(wave.waveColor, waveAlpha);
          lastWaveColor = wave.waveColor;

          // Position of the ripple.
          var x = wave.startPosition.x;
          var y = wave.startPosition.y;

          // Ripple gravitational pull to the center of the canvas.
          if (wave.endPosition) {

            // This translates from the origin to the center of the view  based on the max dimension of
            var translateFraction = Math.min(1, radius / wave.containerSize * 2 / Math.sqrt(2) );

            x += translateFraction * (wave.endPosition.x - wave.startPosition.x);
            y += translateFraction * (wave.endPosition.y - wave.startPosition.y);
          }

          // If we do a background fill fade too, work out the correct color.
          var bgFillColor = null;
          if (this.backgroundFill) {
            var bgFillAlpha = waveOuterOpacityFn(tDown, tUp, anim);
            bgFillColor = cssColorWithAlpha(wave.waveColor, bgFillAlpha);
          }

          // Draw the ripple.
          drawRipple(wave, x, y, radius, waveAlpha, bgFillAlpha);

          // Determine whether there is any more rendering to be done.
          var maximumWave = waveAtMaximum(wave, radius, anim);
          var waveDissipated = waveDidFinish(wave, radius, anim);
          var shouldKeepWave = !waveDissipated || maximumWave;
          // keep rendering dissipating wave when at maximum radius on upAction
          var shouldRenderWaveAgain = wave.mouseUpStart ? !waveDissipated : !maximumWave;
          shouldRenderNextFrame = shouldRenderNextFrame || shouldRenderWaveAgain;
          if (!shouldKeepWave || this.cancelled) {
            deleteTheseWaves.push(wave);
          }
       }

        if (shouldRenderNextFrame) {
          requestAnimationFrame(this._loop);
        }

        for (var i = 0; i < deleteTheseWaves.length; ++i) {
          var wave = deleteTheseWaves[i];
          removeWaveFromScope(this, wave);
        }

        if (!this.waves.length && this._loop) {
          // clear the background color
          this.$.bg.style.backgroundColor = null;
          this._loop = null;
          this.fire('core-transitionend');
        }
      }

    });

  })();

;

    Polymer('paper-shadow', {

      publish: {
        /**
         * If set, the shadow is applied to this node.
         *
         * @attribute target
         * @type Element
         * @default null
         */
        target: {value: null, reflect: true},

        /**
         * The z-depth of this shadow, from 0-5.
         *
         * @attribute z
         * @type number
         * @default 1
         */
        z: {value: 1, reflect: true},

        /**
         * If true, the shadow animates between z-depth changes.
         *
         * @attribute animated
         * @type boolean
         * @default false
         */
        animated: {value: false, reflect: true},

        /**
         * Workaround: getComputedStyle is wrong sometimes so `paper-shadow`
         * may overwrite the `position` CSS property. Set this property to
         * true to prevent this.
         *
         * @attribute hasPosition
         * @type boolean
         * @default false
         */
        hasPosition: false
      },

      // NOTE: include template so that styles are loaded, but remove
      // so that we can decide dynamically what part to include
      registerCallback: function(polymerElement) {
        var template = polymerElement.querySelector('template');
        this._style = template.content.querySelector('style');
        this._style.removeAttribute('no-shim');
      },

      fetchTemplate: function() {
        return null;
      },

      attached: function() {
        // If no target is bound at attach, default the target to the parent
        // element or shadow host.
        if (!this.target) {
          if (!this.parentElement && this.parentNode.host) {
            this.target = this.parentNode.host;
          } else if (this.parentElement && (window.ShadowDOMPolyfill ? this.parentElement !== wrap(document.body) : this.parentElement !== document.body)) {
            this.target = this.parentElement;
          }
        }
      },

      targetChanged: function(old) {
        if (old) {
          this.removeShadow(old);
        }
        if (this.target) {
          this.addShadow(this.target);
        }
      },

      zChanged: function(old) {
        if (this.target && this.target._paperShadow) {
          var shadow = this.target._paperShadow;
          ['top', 'bottom'].forEach(function(s) {
            shadow[s].classList.remove('paper-shadow-' + s + '-z-' + old);
            shadow[s].classList.add('paper-shadow-' + s + '-z-' + this.z);
          }.bind(this));
        }
      },

      animatedChanged: function() {
        if (this.target && this.target._paperShadow) {
          var shadow = this.target._paperShadow;
          ['top', 'bottom'].forEach(function(s) {
            if (this.animated) {
              shadow[s].classList.add('paper-shadow-animated');
            } else {
              shadow[s].classList.remove('paper-shadow-animated');
            }
          }.bind(this));
        }
      },

      addShadow: function(node) {
        if (node._paperShadow) {
          return;
        }

        if (!node._hasShadowStyle) {
          if (!node.shadowRoot) {
            node.createShadowRoot().innerHTML = '<content></content>';
          }
          this.installScopeStyle(this._style, 'shadow', node.shadowRoot);
          node._hasShadowStyle = true;
        }

        var computed = getComputedStyle(node);
        if (!this.hasPosition && computed.position === 'static') {
          node.style.position = 'relative';
        }
        node.style.overflow = 'visible';

        // Both the top and bottom shadows are children of the target, so
        // it does not affect the classes and CSS properties of the target.
        ['top', 'bottom'].forEach(function(s) {
          var inner = (node._paperShadow && node._paperShadow[s]) || document.createElement('div');
          inner.classList.add('paper-shadow');
          inner.classList.add('paper-shadow-' + s + '-z-' + this.z);
          if (this.animated) {
            inner.classList.add('paper-shadow-animated');
          }

          if (node.shadowRoot) {
            node.shadowRoot.insertBefore(inner, node.shadowRoot.firstChild);
          } else {
            node.insertBefore(inner, node.firstChild);
          }

          node._paperShadow = node._paperShadow || {};
          node._paperShadow[s] = inner;
        }.bind(this));

      },

      removeShadow: function(node) {
        if (!node._paperShadow) {
          return;
        }

        ['top', 'bottom'].forEach(function(s) {
          node._paperShadow[s].remove();
        });
        node._paperShadow = null;

        node.style.position = null;
      }

    });
  ;

    Polymer('paper-focusable', {

      publish: {

        /**
         * If true, the button is currently active either because the
         * user is holding down the button, or the button is a toggle
         * and is currently in the active state.
         *
         * @attribute active
         * @type boolean
         * @default false
         */
        active: {value: false, reflect: true},

        /**
         * If true, the element currently has focus due to keyboard
         * navigation.
         *
         * @attribute focused
         * @type boolean
         * @default false
         */
        focused: {value: false, reflect: true},

        /**
         * If true, the user is currently holding down the button.
         *
         * @attribute pressed
         * @type boolean
         * @default false
         */
        pressed: {value: false, reflect: true},

        /**
         * If true, the user cannot interact with this element.
         *
         * @attribute disabled
         * @type boolean
         * @default false
         */
        disabled: {value: false, reflect: true},

        /**
         * If true, the button toggles the active state with each tap.
         * Otherwise, the button becomes active when the user is holding
         * it down.
         *
         * @attribute isToggle
         * @type boolean
         * @default false
         */
        isToggle: {value: false, reflect: false}

      },

      disabledChanged: function() {
        if (this.disabled) {
          this.removeAttribute('tabindex');
        } else {
          this.setAttribute('tabindex', 0);
        }
      },

      downAction: function() {
        this.pressed = true;

        if (this.isToggle) {
          this.active = !this.active;
        } else {
          this.active = true;
        }
      },

      // Pulling up the context menu for an item should focus it; but we need to
      // be careful about how we deal with down/up events surrounding context
      // menus. The up event typically does not fire until the context menu
      // closes: so we focus immediately.
      //
      // This fires _after_ downAction.
      contextMenuAction: function(e) {
        // Note that upAction may fire _again_ on the actual up event.
        this.upAction(e);
        this.focusAction();
      },

      upAction: function() {
        this.pressed = false;

        if (!this.isToggle) {
          this.active = false;
        }
      },

      focusAction: function() {
        if (!this.pressed) {
          // Only render the "focused" state if the element gains focus due to
          // keyboard navigation.
          this.focused = true;
        }
      },

      blurAction: function() {
        this.focused = false;
      }

    });

  ;

    Polymer('paper-button-base',{

      z: 1,

      activeChanged: function() {
        this.super();

        if (this.active) {
          // FIXME: remove when paper-ripple can have a default 'down' state.
          if (!this.lastEvent) {
            var rect = this.getBoundingClientRect();
            this.lastEvent = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            }
          }
          this.$.ripple.downAction(this.lastEvent);
        } else {
          this.$.ripple.upAction();
        }
        this.adjustZ();
      },

      disabledChanged: function() {
        this.super();
        if (this.disabled) {
          this.setAttribute('aria-disabled', '');
        } else {
          this.removeAttribute('aria-disabled');
        }
        this.adjustZ();
      },

      recenteringTouchChanged: function() {
        if (this.$.ripple) {
          this.$.ripple.classList.toggle('recenteringTouch', this.recenteringTouch);
        }
      },

      fillChanged: function() {
        if (this.$.ripple) {
          this.$.ripple.classList.toggle('fill', this.fill);
        }
      },

      adjustZ: function() {
        if (this.active) {
          this.z = 2;
        } else if (this.disabled) {
          this.z = 0;
        } else {
          this.z = 1;
        }
      },

      downAction: function(e) {
        this.super(e);
        this.lastEvent = e;
        if (!this.$.ripple) {
          var ripple = document.createElement('paper-ripple');
          ripple.setAttribute('id', 'ripple');
          ripple.setAttribute('fit', '');
          if (this.recenteringTouch) {
            ripple.classList.add('recenteringTouch');
          }
          if (!this.fill) {
            ripple.classList.add('circle');
          }
          this.$.ripple = ripple;
          this.shadowRoot.insertBefore(ripple, this.shadowRoot.firstChild);
          // No need to forward the event to the ripple because the ripple
          // is triggered in activeChanged
        }
      }

    });
  ;

    Polymer('paper-button',{

      publish: {

        label: '',

        /**
         * If true, the button will be styled with a shadow.
         *
         * @attribute raised
         * @type boolean
         * @default false
         */
        raised: false,
        raisedButton: false,

        /**
         * By default the ripple emanates from where the user touched the button.
         * Set this to true to always center the ripple.
         *
         * @attribute recenteringTouch
         * @type boolean
         * @default false
         */
        recenteringTouch: false,

        /**
         * By default the ripple expands to fill the button. Set this to true to
         * constrain the ripple to a circle within the button.
         *
         * @attribute fill
         * @type boolean
         * @default true
         */
        fill: true

      },

      labelChanged: function() {
        if (this.label) {
          console.warn('The "label" property is deprecated.');
        }
      },

      raisedButtonChanged: function() {
        if (this.raisedButton) {
          console.warn('The "raisedButton" property is deprecated.');
        }
      }

    });
  ;


    Polymer('core-iconset-svg', {


      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * @attribute iconSize
       * @type number
       * @default 24
       */
      iconSize: 24,
      type: 'iconset',

      created: function() {
        this._icons = {};
      },

      ready: function() {
        this.super();
        this.updateIcons();
      },

      iconById: function(id) {
        return this._icons[id] || (this._icons[id] = this.querySelector('#' + id));
      },

      cloneIcon: function(id) {
        var icon = this.iconById(id);
        if (icon) {
          var content = icon.cloneNode(true);
          content.removeAttribute('id');
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 ' + this.iconSize + ' ' +
              this.iconSize);
          // NOTE(dfreedm): work around https://crbug.com/370136
          svg.style.pointerEvents = 'none';
          svg.appendChild(content);
          return svg;
        }
      },

      get iconNames() {
        if (!this._iconNames) {
          this._iconNames = this.findIconNames();
        }
        return this._iconNames;
      },

      findIconNames: function() {
        var icons = this.querySelectorAll('[id]').array();
        if (icons.length) {
          return icons.map(function(n){ return n.id });
        }
      },

      /**
       * Applies an icon to the given element. The svg icon is added to the
       * element's shadowRoot if one exists or directly to itself.
       *
       * @method applyIcon
       * @param {Element} element The element to which the icon is
       * applied.
       * @param {String|Number} icon The name the icon to apply.
       * @return {Element} The icon element
       */
      applyIcon: function(element, icon) {
        var root = element;
        // remove old
        var old = root.querySelector('svg');
        if (old) {
          old.remove();
        }
        // install new
        var svg = this.cloneIcon(icon);
        if (!svg) {
          return;
        }
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.display = 'block';
        root.insertBefore(svg, root.firstElementChild);
        return svg;
      },
      
      /**
       * Tell users of the iconset, that the set has loaded.
       * This finds all elements matching the selector argument and calls 
       * the method argument on them.
       * @method updateIcons
       * @param selector {string} css selector to identify iconset users, 
       * defaults to '[icon]'
       * @param method {string} method to call on found elements, 
       * defaults to 'updateIcon'
       */
      updateIcons: function(selector, method) {
        selector = selector || '[icon]';
        method = method || 'updateIcon';
        var deep = window.ShadowDOMPolyfill ? '' : 'html /deep/ ';
        var i$ = document.querySelectorAll(deep + selector);
        for (var i=0, e; e=i$[i]; i++) {
          if (e[method]) {
            e[method].call(e);
          }
        }
      }
      

    });

  ;


    Polymer('core-input', {
      publish: {
        /**
         * Placeholder text that hints to the user what can be entered in
         * the input.
         *
         * @attribute placeholder
         * @type string
         * @default ''
         */
        placeholder: '',
  
        /**
         * If true, this input cannot be focused and the user cannot change
         * its value.
         *
         * @attribute disabled
         * @type boolean
         * @default false
         */
        disabled: false,
  
        /**
         * If true, the user cannot modify the value of the input.
         *
         * @attribute readonly
         * @type boolean
         * @default false
         */
        readonly: false,

        /**
         * If true, this input will automatically gain focus on page load.
         *
         * @attribute autofocus
         * @type boolean
         * @default false
         */
        autofocus: false,

        /**
         * If true, this input accepts multi-line input like a `<textarea>`
         *
         * @attribute multiline
         * @type boolean
         * @default false
         */
        multiline: false,
  
        /**
         * (multiline only) The height of this text input in rows. The input
         * will scroll internally if more input is entered beyond the size
         * of the component. This property is meaningless if multiline is
         * false. You can also set this property to "fit" and size the
         * component with CSS to make the input fit the CSS size.
         *
         * @attribute rows
         * @type number|'fit'
         * @default 'fit'
         */
        rows: 'fit',
  
        /**
         * The current value of this input. Changing inputValue programmatically
         * will cause value to be out of sync. Instead, change value directly
         * or call commit() after changing inputValue.
         *
         * @attribute inputValue
         * @type string
         * @default ''
         */
        inputValue: '',
  
        /**
         * The value of the input committed by the user, either by changing the
         * inputValue and blurring the input, or by hitting the `enter` key.
         *
         * @attribute value
         * @type string
         * @default ''
         */
        value: '',

        /**
         * Set the input type. Not supported for `multiline`.
         *
         * @attribute type
         * @type string
         * @default text
         */
        type: 'text',

        /**
         * If true, the input is invalid if its value is null.
         *
         * @attribute required
         * @type boolean
         * @default false
         */
        required: false,

        /**
         * A regular expression to validate the input value against. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute pattern
         * @type string
         * @default '.*'
         */
        // FIXME(yvonne): The default is set to .* because we can't bind to pattern such
        // that the attribute is unset if pattern is null.
        pattern: '.*',

        /**
         * If set, the input is invalid if the value is less than this property. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute min
         */
        min: null,

        /**
         * If set, the input is invalid if the value is greater than this property. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute max
         */
        max: null,

        /**
         * If set, the input is invalid if the value is not `min` plus an integral multiple
         * of this property. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute step
         */
        step: null,

        /**
         * The maximum length of the input value.
         *
         * @attribute maxlength
         * @type number
         */
        maxlength: null,
  
        /**
         * If this property is true, the text input's inputValue failed validation.
         *
         * @attribute invalid
         * @type boolean
         * @default false
         */
        invalid: false,

        /**
         * If this property is true, validate the input as they are entered.
         *
         * @attribute validateImmediately
         * @type boolean
         * @default true
         */
        validateImmediately: true
      },

      ready: function() {
        this.handleTabindex(this.getAttribute('tabindex'));
      },

      disabledChanged: function() {
        if (this.disabled) {
          this.setAttribute('aria-disabled', true);
        } else {
          this.removeAttribute('aria-disabled');
        }
      },

      invalidChanged: function() {
        this.classList.toggle('invalid', this.invalid);
        this.fire('input-'+ (this.invalid ? 'invalid' : 'valid'), {value: this.inputValue});
      },

      inputValueChanged: function() {
        if (this.validateImmediately) {
          this.updateValidity_();
        }
      },

      valueChanged: function() {
        this.inputValue = this.value;
      },

      requiredChanged: function() {
        if (this.validateImmediately) {
          this.updateValidity_();
        }
      },

      attributeChanged: function(attr, oldVal, curVal) {
        if (attr === 'tabindex') {
          this.handleTabindex(curVal);
        }
      },

      handleTabindex: function(tabindex) {
        if (tabindex > 0) {
          this.$.input.setAttribute('tabindex', -1);
        } else {
          this.$.input.removeAttribute('tabindex');
        }
      },

      /**
       * Commits the inputValue to value.
       *
       * @method commit
       */
      commit: function() {
         this.value = this.inputValue;
      },

      updateValidity_: function() {
        if (this.$.input.willValidate) {
          this.invalid = !this.$.input.validity.valid;
        }
      },

      keypressAction: function(e) {
        // disallow non-numeric input if type = number
        if (this.type !== 'number') {
          return;
        }
        var c = String.fromCharCode(e.charCode);
        if (e.charCode !== 0 && !c.match(/[\d-\.e]/)) {
          e.preventDefault();
        }
      },

      inputChangeAction: function() {
        this.commit();
        if (!window.ShadowDOMPolyfill) {
          // re-fire event that does not bubble across shadow roots
          this.fire('change', null, this);
        }
      },

      focusAction: function(e) {
        if (this.getAttribute('tabindex') > 0) {
          // Forward focus to the inner input if tabindex is set on the element
          // This will not cause an infinite loop because focus will not fire on the <input>
          // again if it's already focused.
          this.$.input.focus();
        }
      },

      inputFocusAction: function(e) {
        if (window.ShadowDOMPolyfill) {
          // re-fire non-bubbling event if polyfill
          this.fire('focus', null, this, false);
        }
      },

      inputBlurAction: function() {
        if (window.ShadowDOMPolyfill) {
          // re-fire non-bubbling event
          this.fire('blur', null, this, false);
        }
      },

      /**
       * Forwards to the internal input / textarea element.
       *
       * @method blur
       */
      blur: function() {
        this.$.input.blur();
      },

      /**
       * Forwards to the internal input / textarea element.
       *
       * @method click
       */
      click: function() {
        this.$.input.click();
      },

      /**
       * Forwards to the internal input / textarea element.
       *
       * @method focus
       */
      focus: function() {
        this.$.input.focus();
      },

      /**
       * Forwards to the internal input / textarea element.
       *
       * @method select
       */
      select: function() {
        this.$.input.select();
      },

      /**
       * Forwards to the internal input / textarea element.
       *
       * @method setSelectionRange
       * @param {number} selectionStart
       * @param {number} selectionEnd
       * @param {String} selectionDirection (optional)
       */
      setSelectionRange: function(selectionStart, selectionEnd, selectionDirection) {
        this.$.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
      },

      /**
       * Forwards to the internal input element, not implemented for multiline.
       *
       * @method setRangeText
       * @param {String} replacement
       * @param {number} start (optional)
       * @param {number} end (optional)
       * @param {String} selectMode (optional)
       */
      setRangeText: function(replacement, start, end, selectMode) {
        if (!this.multiline) {
          this.$.input.setRangeText(replacement, start, end, selectMode);
        }
      },

      /**
       * Forwards to the internal input, not implemented for multiline.
       *
       * @method stepDown
       * @param {number} n (optional)
       */
      stepDown: function(n) {
        if (!this.multiline) {
          this.$.input.stepDown(n);
        }
      },

      /**
       * Forwards to the internal input, not implemented for multiline.
       *
       * @method stepUp
       * @param {number} n (optional)
       */
      stepUp: function(n) {
        if (!this.multiline) {
          this.$.input.stepUp(n);
        }
      },

      get willValidate() {
        return this.$.input.willValidate;
      },

      get validity() {
        return this.$.input.validity;
      },

      get validationMessage() {
        return this.$.input.validationMessage;
      },

      /**
       * Forwards to the internal input / textarea element and updates state.
       *
       * @method checkValidity
       * @return {boolean}
       */
      checkValidity: function() {
        var r = this.$.input.checkValidity();
        this.updateValidity_();
        return r;
      },

      /**
       * Forwards to the internal input / textarea element and updates state.
       *
       * @method setCustomValidity
       * @param {String} message
       */
      setCustomValidity: function(message) {
        this.$.input.setCustomValidity(message);
        this.updateValidity_();
      }

    });
  ;

(function() {

window.CoreStyle = window.CoreStyle || {
  g: {},
  list: {},
  refMap: {}
};

Polymer('core-style', {
  /**
   * The `id` property should be set if the `core-style` is a producer
   * of styles. In this case, the `core-style` should have text content
   * that is cssText.
   *
   * @attribute id
   * @type string
   * @default ''
   */


  publish: {
    /**
     * The `ref` property should be set if the `core-style` element is a 
     * consumer of styles. Set it to the `id` of the desired `core-style`
     * element.
     *
     * @attribute ref
     * @type string
     * @default ''
     */
    ref: ''
  },

  // static
  g: CoreStyle.g,
  refMap: CoreStyle.refMap,

  /**
   * The `list` is a map of all `core-style` producers stored by `id`. It 
   * should be considered readonly. It's useful for nesting one `core-style`
   * inside another.
   *
   * @attribute list
   * @type object (readonly)
   * @default {map of all `core-style` producers}
   */
  list: CoreStyle.list,

  // if we have an id, we provide style
  // if we have a ref, we consume/require style
  ready: function() {
    if (this.id) {
      this.provide();
    } else {
      this.registerRef(this.ref);
      if (!window.ShadowDOMPolyfill) {
        this.require();
      }  
    }
  },

  // can't shim until attached if using SD polyfill because need to find host
  attached: function() {
    if (!this.id && window.ShadowDOMPolyfill) {
      this.require();
    }
  },

  /****** producer stuff *******/

  provide: function() {
    this.register();
    // we want to do this asap, especially so we can do so before definitions
    // that use this core-style are registered.
    if (this.textContent) {
      this._completeProvide();
    } else {
      this.async(this._completeProvide);
    }
  },

  register: function() {
    var i = this.list[this.id];
    if (i) {
      if (!Array.isArray(i)) {
        this.list[this.id] = [i];
      }
      this.list[this.id].push(this);
    } else {
      this.list[this.id] = this;  
    }
  },

  // stamp into a shadowRoot so we can monitor dom of the bound output
  _completeProvide: function() {
    this.createShadowRoot();
    this.domObserver = new MutationObserver(this.domModified.bind(this))
        .observe(this.shadowRoot, {subtree: true, 
        characterData: true, childList: true});
    this.provideContent();
  },

  provideContent: function() {
    this.ensureTemplate();
    this.shadowRoot.textContent = '';
    this.shadowRoot.appendChild(this.instanceTemplate(this.template));
    this.cssText = this.shadowRoot.textContent;
  },

  ensureTemplate: function() {
    if (!this.template) {
      this.template = this.querySelector('template:not([repeat]):not([bind])');
      // move content into the template
      if (!this.template) {
        this.template = document.createElement('template');
        var n = this.firstChild;
        while (n) {
          this.template.content.appendChild(n.cloneNode(true));
          n = n.nextSibling;
        }
      }
    }
  },

  domModified: function() {
    this.cssText = this.shadowRoot.textContent;
    this.notify();
  },

  // notify instances that reference this element
  notify: function() {
    var s$ = this.refMap[this.id];
    if (s$) {
      for (var i=0, s; (s=s$[i]); i++) {
        s.require();
      }
    }
  },

  /****** consumer stuff *******/

  registerRef: function(ref) {
    //console.log('register', ref);
    this.refMap[this.ref] = this.refMap[this.ref] || [];
    this.refMap[this.ref].push(this);
  },

  applyRef: function(ref) {
    this.ref = ref;
    this.registerRef(this.ref);
    this.require();
  },

  require: function() {
    var cssText = this.cssTextForRef(this.ref);
    //console.log('require', this.ref, cssText);
    if (cssText) {
      this.ensureStyleElement();
      // do nothing if cssText has not changed
      if (this.styleElement._cssText === cssText) {
        return;
      }
      this.styleElement._cssText = cssText;
      if (window.ShadowDOMPolyfill) {
        this.styleElement.textContent = cssText;
        cssText = Platform.ShadowCSS.shimStyle(this.styleElement,
            this.getScopeSelector());
      }
      this.styleElement.textContent = cssText;
    }
  },

  cssTextForRef: function(ref) {
    var s$ = this.byId(ref);
    var cssText = '';
    if (s$) {
      if (Array.isArray(s$)) {
        var p = [];
        for (var i=0, l=s$.length, s; (i<l) && (s=s$[i]); i++) {
          p.push(s.cssText);
        }
        cssText = p.join('\n\n');
      } else {
        cssText = s$.cssText;
      }
    }
    if (s$ && !cssText) {
      console.warn('No styles provided for ref:', ref);
    }
    return cssText;
  },

  byId: function(id) {
    return this.list[id];
  },

  ensureStyleElement: function() {
    if (!this.styleElement) {
      this.styleElement = window.ShadowDOMPolyfill ? 
          this.makeShimStyle() :
          this.makeRootStyle();
    }
    if (!this.styleElement) {
      console.warn(this.localName, 'could not setup style.');
    }
  },

  makeRootStyle: function() {
    var style = document.createElement('style');
    this.appendChild(style);
    return style;
  },

  makeShimStyle: function() {
    var host = this.findHost(this);
    if (host) {
      var name = host.localName;
      var style = document.querySelector('style[' + name + '=' + this.ref +']');
      if (!style) {
        style = document.createElement('style');
        style.setAttribute(name, this.ref);
        document.head.appendChild(style);
      }
      return style;
    }
  },

  getScopeSelector: function() {
    if (!this._scopeSelector) {
      var selector = '', host = this.findHost(this);
      if (host) {
        var typeExtension = host.hasAttribute('is');
        var name = typeExtension ? host.getAttribute('is') : host.localName;
        selector = Platform.ShadowCSS.makeScopeSelector(name, 
            typeExtension);
      }
      this._scopeSelector = selector;
    }
    return this._scopeSelector;
  },

  findHost: function(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }
    return node.host || wrap(document.documentElement);
  },

  /* filters! */
  // TODO(dfreedm): add more filters!

  cycle: function(rgb, amount) {
    if (rgb.match('#')) {
      var o = this.hexToRgb(rgb);
      if (!o) {
        return rgb;
      }
      rgb = 'rgb(' + o.r + ',' + o.b + ',' + o.g + ')';
    }

    function cycleChannel(v) {
      return Math.abs((Number(v) - amount) % 255);
    }

    return rgb.replace(/rgb\(([^,]*),([^,]*),([^,]*)\)/, function(m, a, b, c) {
      return 'rgb(' + cycleChannel(a) + ',' + cycleChannel(b) + ', ' 
          + cycleChannel(c) + ')';
    });
  },

  hexToRgb: function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

});


})();
;


  (function() {

    var paperInput = CoreStyle.g.paperInput = CoreStyle.g.paperInput || {};
    paperInput.focusedColor = '#4059a9';
    paperInput.invalidColor = '#d34336';

    Polymer('paper-input', {

      publish: {
        /**
         * The label for this input. It normally appears as grey text inside
         * the text input and disappears once the user enters text.
         *
         * @attribute label
         * @type string
         * @default ''
         */
        label: '',

        /**
         * If true, the label will "float" above the text input once the
         * user enters text instead of disappearing.
         *
         * @attribute floatingLabel
         * @type boolean
         * @default false
         */
        floatingLabel: false,

        /**
         * (multiline only) If set to a non-zero value, the height of this
         * text input will grow with the value changes until it is maxRows
         * rows tall. If the maximum size does not fit the value, the text
         * input will scroll internally.
         *
         * @attribute maxRows
         * @type number
         * @default 0
         */
        maxRows: 0,

        /**
         * The message to display if the input value fails validation. If this
         * is unset or the empty string, a default message is displayed depending
         * on the type of validation error.
         *
         * @attribute error
         * @type string
         */
        error: '',

        focused: {value: false, reflect: true}

      },

      get inputValueForMirror() {
        var tokens = this.inputValue ? String(this.inputValue).replace(/&/gm, '&amp;').replace(/"/gm, '&quot;').replace(/'/gm, '&#39;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;').split('\n') : [''];

        // Enforce the min and max heights for a multiline input here to
        // avoid measurement
        if (this.multiline) {
          if (this.maxRows && tokens.length > this.maxRows) {
            tokens = tokens.slice(0, this.maxRows);
          }
          while (this.rows && tokens.length < this.rows) {
            tokens.push('');
          }
        }

        return tokens.join('<br>') + '&nbsp;';
      },

      get inputHasValue() {
        // if type = number, the input value is the empty string until a valid number
        // is entered so we must do some hacks here
        return this.inputValue || (this.type === 'number' && !this.validity.valid);
      },

      syncInputValueToMirror: function() {
        this.$.mirror.innerHTML = this.inputValueForMirror;
      },

      ready: function() {
        this.syncInputValueToMirror();
      },

      prepareLabelTransform: function() {
        var toRect = this.$.floatedLabelText.getBoundingClientRect();
        var fromRect = this.$.labelText.getBoundingClientRect();
        if (toRect.width !== 0) {
          var sy = toRect.height / fromRect.height;
          this.$.labelText.cachedTransform =
            'scale3d(' + (toRect.width / fromRect.width) + ',' + sy + ',1) ' +
            'translate3d(0,' + (toRect.top - fromRect.top) / sy + 'px,0)';
        }
      },

      animateFloatingLabel: function() {
        if (!this.floatingLabel || this.labelAnimated) {
          return;
        }

        if (!this.$.labelText.cachedTransform) {
          this.prepareLabelTransform();
        }

        // If there's still no cached transform, the input is invisible so don't
        // do the animation.
        if (!this.$.labelText.cachedTransform) {
          return;
        }

        this.labelAnimated = true;
        // Handle interrupted animation
        this.async(function() {
          this.transitionEndAction();
        }, null, 250);

        if (this.inputHasValue) {
          this.$.labelText.style.webkitTransform = this.$.labelText.cachedTransform;
          this.$.labelText.style.transform = this.$.labelText.cachedTransform;
        } else {
          // Handle if the label started out floating
          if (!this.$.labelText.style.webkitTransform && !this.$.labelText.style.transform) {
            this.$.labelText.style.webkitTransform = this.$.labelText.cachedTransform;
            this.$.labelText.style.transform = this.$.labelText.cachedTransform;
            this.$.labelText.offsetTop;
          }
          this.$.labelText.style.webkitTransform = '';
          this.$.labelText.style.transform = '';
        }
      },

      inputValueChanged: function(old) {
        this.super();

        this.syncInputValueToMirror();
        if (old && !this.inputValue || !old && this.inputValue) {
          this.animateFloatingLabel();
        }
      },

      placeholderChanged: function() {
        this.label = this.placeholder;
      },

      inputFocusAction: function() {
        this.super(arguments);
        this.focused = true;
      },

      inputBlurAction: function(e) {
        this.super(arguments);
        this.focused = false;
      },

      downAction: function(e) {
        if (this.disabled) {
          return;
        }

        if (this.focused) {
          return;
        }

        // The underline spills from the tap location
        var rect = this.$.underline.getBoundingClientRect();
        var right = e.x - rect.left;
        this.$.focusedUnderline.style.mozTransformOrigin = right + 'px';
        this.$.focusedUnderline.style.webkitTransformOrigin = right + 'px ';
        this.$.focusedUnderline.style.transformOriginX = right + 'px';

        // Animations only run when the user interacts with the input
        this.underlineAnimated = true;

        // Cursor animation only runs if the input is empty
        if (!this.inputHasValue) {
          this.cursorAnimated = true;
        }
        // Handle interrupted animation
        this.async(function() {
          this.transitionEndAction();
        }, null, 250);
      },

      keydownAction: function() {
        this.super();

        // more type = number hacks. see core-input for more info
        if (this.type === 'number') {
          var valid = !this.inputValue && this.validity.valid;
          this.async(function() {
            if (valid !== (!this.inputValue && this.validity.valid)) {
              this.animateFloatingLabel();
            }
          });
        }
      },

      transitionEndAction: function() {
        this.underlineAnimated = false;
        this.cursorAnimated = false;
        this.labelAnimated = false;
      }

    });

  }());

  ;

  (function() {
    /*
     * Chrome uses an older version of DOM Level 3 Keyboard Events
     *
     * Most keys are labeled as text, but some are Unicode codepoints.
     * Values taken from: http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/keyset.html#KeySet-Set
     */
    var KEY_IDENTIFIER = {
      'U+0009': 'tab',
      'U+001B': 'esc',
      'U+0020': 'space',
      'U+002A': '*',
      'U+0030': '0',
      'U+0031': '1',
      'U+0032': '2',
      'U+0033': '3',
      'U+0034': '4',
      'U+0035': '5',
      'U+0036': '6',
      'U+0037': '7',
      'U+0038': '8',
      'U+0039': '9',
      'U+0041': 'a',
      'U+0042': 'b',
      'U+0043': 'c',
      'U+0044': 'd',
      'U+0045': 'e',
      'U+0046': 'f',
      'U+0047': 'g',
      'U+0048': 'h',
      'U+0049': 'i',
      'U+004A': 'j',
      'U+004B': 'k',
      'U+004C': 'l',
      'U+004D': 'm',
      'U+004E': 'n',
      'U+004F': 'o',
      'U+0050': 'p',
      'U+0051': 'q',
      'U+0052': 'r',
      'U+0053': 's',
      'U+0054': 't',
      'U+0055': 'u',
      'U+0056': 'v',
      'U+0057': 'w',
      'U+0058': 'x',
      'U+0059': 'y',
      'U+005A': 'z',
      'U+007F': 'del'
    };

    /*
     * Special table for KeyboardEvent.keyCode.
     * KeyboardEvent.keyIdentifier is better, and KeyBoardEvent.key is even better than that
     *
     * Values from: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.keyCode#Value_of_keyCode
     */
    var KEY_CODE = {
      13: 'enter',
      27: 'esc',
      33: 'pageup',
      34: 'pagedown',
      35: 'end',
      36: 'home',
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      46: 'del',
      106: '*'
    };

    /*
     * KeyboardEvent.key is mostly represented by printable character made by the keyboard, with unprintable keys labeled
     * nicely.
     *
     * However, on OS X, Alt+char can make a Unicode character that follows an Apple-specific mapping. In this case, we
     * fall back to .keyCode.
     */
    var KEY_CHAR = /[a-z0-9*]/;

    function transformKey(key) {
      var validKey = '';
      if (key) {
        var lKey = key.toLowerCase();
        if (lKey.length == 1) {
          if (KEY_CHAR.test(lKey)) {
            validKey = lKey;
          }
        } else if (lKey == 'multiply') {
          // numpad '*' can map to Multiply on IE/Windows
          validKey = '*';
        } else {
          validKey = lKey;
        }
      }
      return validKey;
    }

    var IDENT_CHAR = /U\+/;
    function transformKeyIdentifier(keyIdent) {
      var validKey = '';
      if (keyIdent) {
        if (IDENT_CHAR.test(keyIdent)) {
          validKey = KEY_IDENTIFIER[keyIdent];
        } else {
          validKey = keyIdent.toLowerCase();
        }
      }
      return validKey;
    }

    function transformKeyCode(keyCode) {
      var validKey = '';
      if (Number(keyCode)) {
        if (keyCode >= 65 && keyCode <= 90) {
          // ascii a-z
          // lowercase is 32 offset from uppercase
          validKey = String.fromCharCode(32 + keyCode);
        } else if (keyCode >= 112 && keyCode <= 123) {
          // function keys f1-f12
          validKey = 'f' + (keyCode - 112);
        } else if (keyCode >= 48 && keyCode <= 57) {
          // top 0-9 keys
          validKey = String(48 - keyCode);
        } else if (keyCode >= 96 && keyCode <= 105) {
          // num pad 0-9
          validKey = String(96 - keyCode);
        } else {
          validKey = KEY_CODE[keyCode];
        }
      }
      return validKey;
    }

    function keyboardEventToKey(ev) {
      // fall back from .key, to .keyIdentifier, and then to .keyCode
      var normalizedKey = transformKey(ev.key) || transformKeyIdentifier(ev.keyIdentifier) || transformKeyCode(ev.keyCode) || '';
      return {
        shift: ev.shiftKey,
        ctrl: ev.ctrlKey,
        meta: ev.metaKey,
        alt: ev.altKey,
        key: normalizedKey
      };
    }

    /*
     * Input: ctrl+shift+f7 => {ctrl: true, shift: true, key: 'f7'}
     * ctrl/space => {ctrl: true} || {key: space}
     */
    function stringToKey(keyCombo) {
      var keys = keyCombo.split('+');
      var keyObj = Object.create(null);
      keys.forEach(function(key) {
        if (key == 'shift') {
          keyObj.shift = true;
        } else if (key == 'ctrl') {
          keyObj.ctrl = true;
        } else if (key == 'alt') {
          keyObj.alt = true;
        } else {
          keyObj.key = key;
        }
      });
      return keyObj;
    }

    function keyMatches(a, b) {
      return Boolean(a.alt) == Boolean(b.alt) && Boolean(a.ctrl) == Boolean(b.ctrl) && Boolean(a.shift) == Boolean(b.shift) && a.key === b.key;
    }

    /**
     * Fired when a keycombo in `keys` is pressed.
     *
     * @event keys-pressed
     */
    function processKeys(ev) {
      var current = keyboardEventToKey(ev);
      for (var i = 0, dk; i < this._desiredKeys.length; i++) {
        dk = this._desiredKeys[i];
        if (keyMatches(dk, current)) {
          ev.preventDefault();
          ev.stopPropagation();
          this.fire('keys-pressed', current, this, false);
          break;
        }
      }
    }

    function listen(node, handler) {
      if (node && node.addEventListener) {
        node.addEventListener('keydown', handler);
      }
    }

    function unlisten(node, handler) {
      if (node && node.removeEventListener) {
        node.removeEventListener('keydown', handler);
      }
    }

    Polymer('core-a11y-keys', {
      created: function() {
        this._keyHandler = processKeys.bind(this);
      },
      attached: function() {
        listen(this.target, this._keyHandler);
      },
      detached: function() {
        unlisten(this.target, this._keyHandler);
      },
      publish: {
        /**
         * The set of key combinations to listen for.
         *
         * @attribute keys
         * @type string (keys syntax)
         * @default ''
         */
        keys: '',
        /**
         * The node that will fire keyboard events.
         *
         * @attribute target
         * @type Node
         * @default null
         */
        target: null
      },
      keysChanged: function() {
        // * can have multiple mappings: shift+8, * on numpad or Multiply on numpad
        var normalized = this.keys.replace('*', '* shift+*');
        this._desiredKeys = normalized.toLowerCase().split(' ').map(stringToKey);
      },
      targetChanged: function(oldTarget) {
        unlisten(oldTarget, this._keyHandler);
        listen(this.target, this._keyHandler);
      }
    });
  })();
;


  Polymer('paper-radio-button', {
    
    /**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */
     
    /**
     * Fired when the checked state changes.
     *
     * @event core-change
     */
    
    publish: {
      /**
       * Gets or sets the state, `true` is checked and `false` is unchecked.
       *
       * @attribute checked
       * @type boolean
       * @default false
       */
      checked: {value: false, reflect: true},
      
      /**
       * The label for the radio button.
       *
       * @attribute label
       * @type string
       * @default ''
       */
      label: '',
      
      /**
       * Normally the user cannot uncheck the radio button by tapping once
       * checked.  Setting this property to `true` makes the radio button
       * toggleable from checked to unchecked.
       *
       * @attribute toggles
       * @type boolean
       * @default false
       */
      toggles: false,
      
      /**
       * If true, the user cannot interact with this element.
       *
       * @attribute disabled
       * @type boolean
       * @default false
       */
      disabled: {value: false, reflect: true}
    },
    
    eventDelegates: {
      tap: 'tap'
    },
    
    tap: function() {
      var old = this.checked;
      this.toggle();
      if (this.checked !== old) {
        this.fire('change');
      }
    },
    
    toggle: function() {
      this.checked = !this.toggles || !this.checked;
    },
    
    checkedChanged: function() {
      this.$.onRadio.classList.toggle('fill', this.checked);
      this.setAttribute('aria-checked', this.checked ? 'true': 'false');
      this.fire('core-change');
    },
    
    labelChanged: function() {
      this.setAttribute('aria-label', this.label);
    }
    
  });
  
;


  Polymer('paper-checkbox', {
    
    /**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */
     
    /**
     * Fired when the checked state changes.
     *
     * @event core-change
     */
    
    toggles: true,

    checkedChanged: function() {
      var cl = this.$.checkbox.classList;
      cl.toggle('checked', this.checked);
      cl.toggle('unchecked', !this.checked);
      cl.toggle('checkmark', !this.checked);
      cl.toggle('box', this.checked);
      this.setAttribute('aria-checked', this.checked ? 'true': 'false');
      this.fire('core-change');
    },

    checkboxAnimationEnd: function() {
      var cl = this.$.checkbox.classList;
      cl.toggle('checkmark', this.checked && !cl.contains('checkmark'));
      cl.toggle('box', !this.checked && !cl.contains('box'));
    }

  });
  
;
/*! @license Firebase v1.1.0 - License: https://www.firebase.com/terms/terms-of-service.html */ (function() {var k,ba=this;function l(a){return void 0!==a}function ca(){}function da(a){a.ib=function(){return a.Ld?a.Ld:a.Ld=new a}}
function ea(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function fa(a){return"array"==ea(a)}function ga(a){var b=ea(a);return"array"==b||"object"==b&&"number"==typeof a.length}function p(a){return"string"==typeof a}function ha(a){return"number"==typeof a}function ia(a){return"function"==ea(a)}function ja(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ka(a,b,c){return a.call.apply(a.bind,arguments)}
function la(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function q(a,b,c){q=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ka:la;return q.apply(null,arguments)}var ma=Date.now||function(){return+new Date};
function na(a,b){var c=a.split("."),d=ba;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)!c.length&&l(b)?d[e]=b:d=d[e]?d[e]:d[e]={}}function oa(a,b){function c(){}c.prototype=b.prototype;a.df=b.prototype;a.prototype=new c;a.$e=function(a,c,f){return b.prototype[c].apply(a,Array.prototype.slice.call(arguments,2))}};function pa(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function qa(){this.Ec=void 0}
function ra(a,b,c){switch(typeof b){case "string":sa(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if(fa(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],ra(a,a.Ec?a.Ec.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),sa(f,c),
c.push(":"),ra(a,a.Ec?a.Ec.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var ta={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},ua=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function sa(a,b){b.push('"',a.replace(ua,function(a){if(a in ta)return ta[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return ta[a]=e+b.toString(16)}),'"')};function va(a){return"undefined"!==typeof JSON&&l(JSON.parse)?JSON.parse(a):pa(a)}function u(a){if("undefined"!==typeof JSON&&l(JSON.stringify))a=JSON.stringify(a);else{var b=[];ra(new qa,a,b);a=b.join("")}return a};function wa(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,v(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b};var xa={};function x(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);if(e)throw Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+".");}
function y(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:ya.assert(!1,"errorPrefix_ called with argumentNumber > 4.  Need to update it?")}return a=a+" failed: "+(d+" argument ")}function z(a,b,c,d){if((!d||l(c))&&!ia(c))throw Error(y(a,b,d)+"must be a valid function.");}function za(a,b,c){if(l(c)&&(!ja(c)||null===c))throw Error(y(a,b,!0)+"must be a valid context object.");};function A(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function B(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]}function Aa(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])}function Ba(a){var b={};Aa(a,function(a,d){b[a]=d});return b};var ya={},Ca=/[\[\].#$\/\u0000-\u001F\u007F]/,Da=/[\[\].#$\u0000-\u001F\u007F]/;function Ea(a){return p(a)&&0!==a.length&&!Ca.test(a)}function Fa(a,b,c){c&&!l(b)||Ga(y(a,1,c),b)}
function Ga(a,b,c,d){c||(c=0);d=d||[];if(!l(b))throw Error(a+"contains undefined"+Ha(d));if(ia(b))throw Error(a+"contains a function"+Ha(d)+" with contents: "+b.toString());if(Ia(b))throw Error(a+"contains "+b.toString()+Ha(d));if(1E3<c)throw new TypeError(a+"contains a cyclic object value ("+d.slice(0,100).join(".")+"...)");if(p(b)&&b.length>10485760/3&&10485760<wa(b).length)throw Error(a+"contains a string greater than 10485760 utf8 bytes"+Ha(d)+" ('"+b.substring(0,50)+"...')");if(ja(b))for(var e in b)if(A(b,
e)){var f=b[e];if(".priority"!==e&&".value"!==e&&".sv"!==e&&!Ea(e))throw Error(a+" contains an invalid key ("+e+")"+Ha(d)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');d.push(e);Ga(a,f,c+1,d);d.pop()}}function Ha(a){return 0==a.length?"":" in property '"+a.join(".")+"'"}function Ja(a,b){if(!ja(b)||fa(b))throw Error(y(a,1,!1)+" must be an Object containing the children to replace.");Fa(a,b,!1)}
function Ka(a,b,c,d){if(!d||l(c)){if(Ia(c))throw Error(y(a,b,d)+"is "+c.toString()+", but must be a valid Firebase priority (a string, finite number, or null).");if(!(null===c||ha(c)||p(c)||ja(c)&&A(c,".sv")))throw Error(y(a,b,d)+"must be a valid Firebase priority (a string, finite number, or null).");}}
function La(a,b,c){if(!c||l(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:throw Error(y(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}}function Ma(a,b){if(l(b)&&!Ea(b))throw Error(y(a,2,!0)+'was an invalid key: "'+b+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');}
function Na(a,b){if(!p(b)||0===b.length||Da.test(b))throw Error(y(a,1,!1)+'was an invalid path: "'+b+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');}function C(a,b){if(".info"===D(b))throw Error(a+" failed: Can't modify data under /.info/");}function Oa(a,b){if(!p(b))throw Error(y(a,1,!1)+"must be a valid credential (a string).");}function Pa(a,b,c){if(!p(c))throw Error(y(a,b,!1)+"must be a valid string.");}
function E(a,b,c,d){if(!d||l(c))if(!ja(c)||null===c)throw Error(y(a,b,d)+"must be a valid object.");}function Qa(a,b,c){if(!ja(b)||null===b||!A(b,c))throw Error(y(a,1,!1)+'must contain the key "'+c+'"');if(!p(B(b,c)))throw Error(y(a,1,!1)+'must contain the key "'+c+'" with type "string"');};function F(a,b,c,d,e,f,g){this.i=a;this.path=b;this.Ga=c;this.fa=d;this.za=e;this.Ea=f;this.fb=g;if(l(this.fa)&&l(this.Ea)&&l(this.Ga))throw"Query: Can't combine startAt(), endAt(), and limit().";}F.prototype.rd=function(){x("Query.ref",0,0,arguments.length);return new G(this.i,this.path)};F.prototype.ref=F.prototype.rd;
F.prototype.Ta=function(a,b){x("Query.on",2,4,arguments.length);La("Query.on",a,!1);z("Query.on",2,b,!1);var c=Ra("Query.on",arguments[2],arguments[3]);this.i.ec(this,a,b,c.cancel,c.$);return b};F.prototype.on=F.prototype.Ta;F.prototype.nb=function(a,b,c){x("Query.off",0,3,arguments.length);La("Query.off",a,!0);z("Query.off",2,b,!0);za("Query.off",3,c);this.i.Dc(this,a,b,c)};F.prototype.off=F.prototype.nb;
F.prototype.Ke=function(a,b){function c(g){f&&(f=!1,e.nb(a,c),b.call(d.$,g))}x("Query.once",2,4,arguments.length);La("Query.once",a,!1);z("Query.once",2,b,!1);var d=Ra("Query.once",arguments[2],arguments[3]),e=this,f=!0;this.Ta(a,c,function(b){e.nb(a,c);d.cancel&&d.cancel.call(d.$,b)})};F.prototype.once=F.prototype.Ke;
F.prototype.ze=function(a){x("Query.limit",1,1,arguments.length);if(!ha(a)||Math.floor(a)!==a||0>=a)throw"Query.limit: First argument must be a positive integer.";return new F(this.i,this.path,a,this.fa,this.za,this.Ea,this.fb)};F.prototype.limit=F.prototype.ze;F.prototype.ae=function(a,b){x("Query.startAt",0,2,arguments.length);Ka("Query.startAt",1,a,!0);Ma("Query.startAt",b);l(a)||(b=a=null);return new F(this.i,this.path,this.Ga,a,b,this.Ea,this.fb)};F.prototype.startAt=F.prototype.ae;
F.prototype.Hd=function(a,b){x("Query.endAt",0,2,arguments.length);Ka("Query.endAt",1,a,!0);Ma("Query.endAt",b);return new F(this.i,this.path,this.Ga,this.fa,this.za,a,b)};F.prototype.endAt=F.prototype.Hd;F.prototype.se=function(a,b){x("Query.equalTo",1,2,arguments.length);Ka("Query.equalTo",1,a,!1);Ma("Query.equalTo",b);return this.ae(a,b).Hd(a,b)};F.prototype.equalTo=F.prototype.se;
function Sa(a){var b={};l(a.fa)&&(b.sp=a.fa);l(a.za)&&(b.sn=a.za);l(a.Ea)&&(b.ep=a.Ea);l(a.fb)&&(b.en=a.fb);l(a.Ga)&&(b.l=a.Ga);l(a.fa)&&l(a.za)&&null===a.fa&&null===a.za&&(b.vf="l");return b}F.prototype.Wa=function(){var a=Ta(Sa(this));return"{}"===a?"default":a};
function Ra(a,b,c){var d={};if(b&&c)d.cancel=b,z(a,3,d.cancel,!0),d.$=c,za(a,4,d.$);else if(b)if("object"===typeof b&&null!==b)d.$=b;else if("function"===typeof b)d.cancel=b;else throw Error(xa.af(a,3,!0)+"must either be a cancel callback or a context object.");return d};function H(a,b){if(1==arguments.length){this.u=a.split("/");for(var c=0,d=0;d<this.u.length;d++)0<this.u[d].length&&(this.u[c]=this.u[d],c++);this.u.length=c;this.W=0}else this.u=a,this.W=b}function D(a){return a.W>=a.u.length?null:a.u[a.W]}function Ua(a){var b=a.W;b<a.u.length&&b++;return new H(a.u,b)}function Va(a){return a.W<a.u.length?a.u[a.u.length-1]:null}k=H.prototype;k.toString=function(){for(var a="",b=this.W;b<this.u.length;b++)""!==this.u[b]&&(a+="/"+this.u[b]);return a||"/"};
k.parent=function(){if(this.W>=this.u.length)return null;for(var a=[],b=this.W;b<this.u.length-1;b++)a.push(this.u[b]);return new H(a,0)};k.J=function(a){for(var b=[],c=this.W;c<this.u.length;c++)b.push(this.u[c]);if(a instanceof H)for(c=a.W;c<a.u.length;c++)b.push(a.u[c]);else for(a=a.split("/"),c=0;c<a.length;c++)0<a[c].length&&b.push(a[c]);return new H(b,0)};k.f=function(){return this.W>=this.u.length};k.length=function(){return this.u.length-this.W};
function Wa(a,b){var c=D(a);if(null===c)return b;if(c===D(b))return Wa(Ua(a),Ua(b));throw"INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")";}k.contains=function(a){var b=this.W,c=a.W;if(this.length()>a.length())return!1;for(;b<this.u.length;){if(this.u[b]!==a.u[c])return!1;++b;++c}return!0};function Xa(){this.children={};this.gc=0;this.value=null}function Ya(a,b,c){this.Ha=a?a:"";this.Rb=b?b:null;this.A=c?c:new Xa}function I(a,b){for(var c=b instanceof H?b:new H(b),d=a,e;null!==(e=D(c));)d=new Ya(e,d,B(d.A.children,e)||new Xa),c=Ua(c);return d}k=Ya.prototype;k.k=function(){return this.A.value};function Za(a,b){v("undefined"!==typeof b,"Cannot set value to undefined");a.A.value=b;$a(a)}k.clear=function(){this.A.value=null;this.A.children={};this.A.gc=0;$a(this)};
k.Gb=function(){return 0<this.A.gc};k.f=function(){return null===this.k()&&!this.Gb()};k.B=function(a){for(var b in this.A.children)a(new Ya(b,this,this.A.children[b]))};function ab(a,b,c,d){c&&!d&&b(a);a.B(function(a){ab(a,b,!0,d)});c&&d&&b(a)}function bb(a,b,c){for(a=c?a:a.parent();null!==a;){if(b(a))return!0;a=a.parent()}return!1}k.path=function(){return new H(null===this.Rb?this.Ha:this.Rb.path()+"/"+this.Ha)};k.name=function(){return this.Ha};k.parent=function(){return this.Rb};
function $a(a){if(null!==a.Rb){var b=a.Rb,c=a.Ha,d=a.f(),e=A(b.A.children,c);d&&e?(delete b.A.children[c],b.A.gc--,$a(b)):d||e||(b.A.children[c]=a.A,b.A.gc++,$a(b))}};function cb(a,b){this.ab=a?a:db;this.ea=b?b:eb}function db(a,b){return a<b?-1:a>b?1:0}k=cb.prototype;k.ta=function(a,b){return new cb(this.ab,this.ea.ta(a,b,this.ab).M(null,null,!1,null,null))};k.remove=function(a){return new cb(this.ab,this.ea.remove(a,this.ab).M(null,null,!1,null,null))};k.get=function(a){for(var b,c=this.ea;!c.f();){b=this.ab(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return null};
function gb(a,b){for(var c,d=a.ea,e=null;!d.f();){c=a.ab(b,d.key);if(0===c){if(d.left.f())return e?e.key:null;for(d=d.left;!d.right.f();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");}k.f=function(){return this.ea.f()};k.count=function(){return this.ea.count()};k.Mb=function(){return this.ea.Mb()};k.lb=function(){return this.ea.lb()};k.Fa=function(a){return this.ea.Fa(a)};k.Xa=function(a){return this.ea.Xa(a)};
k.jb=function(a){return new hb(this.ea,a)};function hb(a,b){this.Wd=b;for(this.pc=[];!a.f();)this.pc.push(a),a=a.left}function ib(a){if(0===a.pc.length)return null;var b=a.pc.pop(),c;c=a.Wd?a.Wd(b.key,b.value):{key:b.key,value:b.value};for(b=b.right;!b.f();)a.pc.push(b),b=b.left;return c}function jb(a,b,c,d,e){this.key=a;this.value=b;this.color=null!=c?c:!0;this.left=null!=d?d:eb;this.right=null!=e?e:eb}k=jb.prototype;
k.M=function(a,b,c,d,e){return new jb(null!=a?a:this.key,null!=b?b:this.value,null!=c?c:this.color,null!=d?d:this.left,null!=e?e:this.right)};k.count=function(){return this.left.count()+1+this.right.count()};k.f=function(){return!1};k.Fa=function(a){return this.left.Fa(a)||a(this.key,this.value)||this.right.Fa(a)};k.Xa=function(a){return this.right.Xa(a)||a(this.key,this.value)||this.left.Xa(a)};function kb(a){return a.left.f()?a:kb(a.left)}k.Mb=function(){return kb(this).key};
k.lb=function(){return this.right.f()?this.key:this.right.lb()};k.ta=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.M(null,null,null,e.left.ta(a,b,c),null):0===d?e.M(null,b,null,null,null):e.M(null,null,null,null,e.right.ta(a,b,c));return lb(e)};function mb(a){if(a.left.f())return eb;a.left.R()||a.left.left.R()||(a=nb(a));a=a.M(null,null,null,mb(a.left),null);return lb(a)}
k.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))c.left.f()||c.left.R()||c.left.left.R()||(c=nb(c)),c=c.M(null,null,null,c.left.remove(a,b),null);else{c.left.R()&&(c=ob(c));c.right.f()||c.right.R()||c.right.left.R()||(c=pb(c),c.left.left.R()&&(c=ob(c),c=pb(c)));if(0===b(a,c.key)){if(c.right.f())return eb;d=kb(c.right);c=c.M(d.key,d.value,null,null,mb(c.right))}c=c.M(null,null,null,null,c.right.remove(a,b))}return lb(c)};k.R=function(){return this.color};
function lb(a){a.right.R()&&!a.left.R()&&(a=qb(a));a.left.R()&&a.left.left.R()&&(a=ob(a));a.left.R()&&a.right.R()&&(a=pb(a));return a}function nb(a){a=pb(a);a.right.left.R()&&(a=a.M(null,null,null,null,ob(a.right)),a=qb(a),a=pb(a));return a}function qb(a){return a.right.M(null,null,a.color,a.M(null,null,!0,null,a.right.left),null)}function ob(a){return a.left.M(null,null,a.color,null,a.M(null,null,!0,a.left.right,null))}
function pb(a){return a.M(null,null,!a.color,a.left.M(null,null,!a.left.color,null,null),a.right.M(null,null,!a.right.color,null,null))}function rb(){}k=rb.prototype;k.M=function(){return this};k.ta=function(a,b){return new jb(a,b,null)};k.remove=function(){return this};k.count=function(){return 0};k.f=function(){return!0};k.Fa=function(){return!1};k.Xa=function(){return!1};k.Mb=function(){return null};k.lb=function(){return null};k.R=function(){return!1};var eb=new rb;function sb(a){this.Db=a;this.zc="firebase:"}k=sb.prototype;k.set=function(a,b){null==b?this.Db.removeItem(this.zc+a):this.Db.setItem(this.zc+a,u(b))};k.get=function(a){a=this.Db.getItem(this.zc+a);return null==a?null:va(a)};k.remove=function(a){this.Db.removeItem(this.zc+a)};k.Nd=!1;k.toString=function(){return this.Db.toString()};function tb(){this.zb={}}tb.prototype.set=function(a,b){null==b?delete this.zb[a]:this.zb[a]=b};tb.prototype.get=function(a){return A(this.zb,a)?this.zb[a]:null};tb.prototype.remove=function(a){delete this.zb[a]};tb.prototype.Nd=!0;function wb(a){try{if("undefined"!==typeof window&&"undefined"!==typeof window[a]){var b=window[a];b.setItem("firebase:sentinel","cache");b.removeItem("firebase:sentinel");return new sb(b)}}catch(c){}return new tb}var xb=wb("localStorage"),K=wb("sessionStorage");function yb(a,b,c,d,e){this.host=a.toLowerCase();this.domain=this.host.substr(this.host.indexOf(".")+1);this.Ya=b;this.Sa=c;this.Ye=d;this.yc=e||"";this.ia=xb.get("host:"+a)||this.host}function zb(a,b){b!==a.ia&&(a.ia=b,"s-"===a.ia.substr(0,2)&&xb.set("host:"+a.host,a.ia))}yb.prototype.toString=function(){var a=(this.Ya?"https://":"http://")+this.host;this.yc&&(a+="<"+this.yc+">");return a};function Ab(){this.ra=-1};function Bb(){this.ra=-1;this.ra=64;this.F=[];this.Sc=[];this.ge=[];this.vc=[];this.vc[0]=128;for(var a=1;a<this.ra;++a)this.vc[a]=0;this.Kc=this.kb=0;this.reset()}oa(Bb,Ab);Bb.prototype.reset=function(){this.F[0]=1732584193;this.F[1]=4023233417;this.F[2]=2562383102;this.F[3]=271733878;this.F[4]=3285377520;this.Kc=this.kb=0};
function Cb(a,b,c){c||(c=0);var d=a.ge;if(p(b))for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.F[0];c=a.F[1];for(var g=a.F[2],h=a.F[3],m=a.F[4],n,e=0;80>e;e++)40>e?20>e?(f=h^c&(g^h),n=1518500249):(f=c^g^h,n=1859775393):60>e?(f=c&g|h&(c|g),n=2400959708):(f=c^g^h,n=3395469782),f=(b<<
5|b>>>27)+f+m+n+d[e]&4294967295,m=h,h=g,g=(c<<30|c>>>2)&4294967295,c=b,b=f;a.F[0]=a.F[0]+b&4294967295;a.F[1]=a.F[1]+c&4294967295;a.F[2]=a.F[2]+g&4294967295;a.F[3]=a.F[3]+h&4294967295;a.F[4]=a.F[4]+m&4294967295}
Bb.prototype.update=function(a,b){l(b)||(b=a.length);for(var c=b-this.ra,d=0,e=this.Sc,f=this.kb;d<b;){if(0==f)for(;d<=c;)Cb(this,a,d),d+=this.ra;if(p(a))for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.ra){Cb(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.ra){Cb(this,e);f=0;break}}this.kb=f;this.Kc+=b};function Db(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^ma()).toString(36)};var L=Array.prototype,Eb=L.indexOf?function(a,b,c){return L.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(p(a))return p(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Fb=L.forEach?function(a,b,c){L.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Gb=L.filter?function(a,b,c){return L.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=p(a)?
a.split(""):a,h=0;h<d;h++)if(h in g){var m=g[h];b.call(c,m,h,a)&&(e[f++]=m)}return e},Hb=L.map?function(a,b,c){return L.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=p(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},Ib=L.reduce?function(a,b,c,d){d&&(b=q(b,d));return L.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;Fb(a,function(c,g){e=b.call(d,e,c,g,a)});return e},Jb=L.every?function(a,b,c){return L.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=
p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function Kb(a,b){var c;a:{c=a.length;for(var d=p(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){c=e;break a}c=-1}return 0>c?null:p(a)?a.charAt(c):a[c]}function Lb(a,b){a.sort(b||Mb)}function Mb(a,b){return a>b?1:a<b?-1:0};var Nb;a:{var Ob=ba.navigator;if(Ob){var Pb=Ob.userAgent;if(Pb){Nb=Pb;break a}}Nb=""}function Qb(a){return-1!=Nb.indexOf(a)};var Rb=Qb("Opera")||Qb("OPR"),Sb=Qb("Trident")||Qb("MSIE"),Tb=Qb("Gecko")&&-1==Nb.toLowerCase().indexOf("webkit")&&!(Qb("Trident")||Qb("MSIE")),Ub=-1!=Nb.toLowerCase().indexOf("webkit");(function(){var a="",b;if(Rb&&ba.opera)return a=ba.opera.version,ia(a)?a():a;Tb?b=/rv\:([^\);]+)(\)|;)/:Sb?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Ub&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(Nb))?a[1]:"");return Sb&&(b=(b=ba.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var Vb=null,Wb=null;
function Xb(a,b){if(!ga(a))throw Error("encodeByteArray takes an array as a parameter");if(!Vb){Vb={};Wb={};for(var c=0;65>c;c++)Vb[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(c),Wb[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(c)}for(var c=b?Wb:Vb,d=[],e=0;e<a.length;e+=3){var f=a[e],g=e+1<a.length,h=g?a[e+1]:0,m=e+2<a.length,n=m?a[e+2]:0,r=f>>2,f=(f&3)<<4|h>>4,h=(h&15)<<2|n>>6,n=n&63;m||(n=64,g||(h=64));d.push(c[r],c[f],c[h],c[n])}return d.join("")}
;var Yb=function(){var a=1;return function(){return a++}}();function v(a,b){if(!a)throw Error("Firebase INTERNAL ASSERT FAILED:"+b);}function Zb(a){try{if("undefined"!==typeof atob)return atob(a)}catch(b){M("base64DecodeIfNativeSupport failed: ",b)}return null}
function $b(a){var b=wa(a);a=new Bb;a.update(b);var b=[],c=8*a.Kc;56>a.kb?a.update(a.vc,56-a.kb):a.update(a.vc,a.ra-(a.kb-56));for(var d=a.ra-1;56<=d;d--)a.Sc[d]=c&255,c/=256;Cb(a,a.Sc);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c]=a.F[d]>>e&255,++c;return Xb(b)}function ac(a){for(var b="",c=0;c<arguments.length;c++)b=ga(arguments[c])?b+ac.apply(null,arguments[c]):"object"===typeof arguments[c]?b+u(arguments[c]):b+arguments[c],b+=" ";return b}var bc=null,cc=!0;
function M(a){!0===cc&&(cc=!1,null===bc&&!0===K.get("logging_enabled")&&dc(!0));if(bc){var b=ac.apply(null,arguments);bc(b)}}function ec(a){return function(){M(a,arguments)}}function fc(a){if("undefined"!==typeof console){var b="FIREBASE INTERNAL ERROR: "+ac.apply(null,arguments);"undefined"!==typeof console.error?console.error(b):console.log(b)}}function gc(a){var b=ac.apply(null,arguments);throw Error("FIREBASE FATAL ERROR: "+b);}
function O(a){if("undefined"!==typeof console){var b="FIREBASE WARNING: "+ac.apply(null,arguments);"undefined"!==typeof console.warn?console.warn(b):console.log(b)}}
function hc(a){var b="",c="",d="",e=!0,f="https",g="";if(p(a)){var h=a.indexOf("//");0<=h&&(f=a.substring(0,h-1),a=a.substring(h+2));h=a.indexOf("/");-1===h&&(h=a.length);b=a.substring(0,h);a=a.substring(h+1);var m=b.split(".");if(3===m.length){h=m[2].indexOf(":");e=0<=h?"https"===f||"wss"===f:!0;c=m[1];d=m[0];g="";a=("/"+a).split("/");for(h=0;h<a.length;h++)if(0<a[h].length){m=a[h];try{m=decodeURIComponent(m.replace(/\+/g," "))}catch(n){}g+="/"+m}d=d.toLowerCase()}else 2===m.length&&(c=m[0])}return{host:b,
domain:c,Ve:d,Ya:e,scheme:f,pb:g}}function Ia(a){return ha(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}
function ic(a){if("complete"===document.readyState)a();else{var b=!1,c=function(){document.body?b||(b=!0,a()):setTimeout(c,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&c()}),window.attachEvent("onload",c))}}
function jc(a,b){return a!==b?null===a?-1:null===b?1:typeof a!==typeof b?"number"===typeof a?-1:1:a>b?1:-1:0}function kc(a,b){if(a===b)return 0;var c=lc(a),d=lc(b);return null!==c?null!==d?0==c-d?a.length-b.length:c-d:-1:null!==d?1:a<b?-1:1}function mc(a,b){if(b&&a in b)return b[a];throw Error("Missing required key ("+a+") in object: "+u(b));}
function Ta(a){if("object"!==typeof a||null===a)return u(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=u(b[d]),c+=":",c+=Ta(a[b[d]]);return c+"}"}function nc(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}function oc(a,b){if(fa(a))for(var c=0;c<a.length;++c)b(c,a[c]);else pc(a,b)}function qc(a,b){return b?q(a,b):a}
function rc(a){v(!Ia(a),"Invalid JSON number");var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;a-=1)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;a-=1)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&
(d="0"+d),c+=d;return c.toLowerCase()}function sc(a){var b="Unknown Error";"too_big"===a?b="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"==a?b="Client doesn't have permission to access the desired data.":"unavailable"==a&&(b="The service is unavailable");b=Error(a+": "+b);b.code=a.toUpperCase();return b}var tc=/^-?\d{1,10}$/;function lc(a){return tc.test(a)&&(a=Number(a),-2147483648<=a&&2147483647>=a)?a:null}
function uc(a){try{a()}catch(b){setTimeout(function(){throw b;},Math.floor(0))}}function P(a,b){if(ia(a)){var c=Array.prototype.slice.call(arguments,1).slice();uc(function(){a.apply(null,c)})}};function vc(a,b){this.H=a;v(null!==this.H,"LeafNode shouldn't be created with null value.");this.qb="undefined"!==typeof b?b:null}k=vc.prototype;k.Q=function(){return!0};k.m=function(){return this.qb};k.Ka=function(a){return new vc(this.H,a)};k.P=function(){return Q};k.N=function(a){return null===D(a)?this:Q};k.ha=function(){return null};k.K=function(a,b){return(new R).K(a,b).Ka(this.qb)};k.Ba=function(a,b){var c=D(a);return null===c?b:this.K(c,Q.Ba(Ua(a),b))};k.f=function(){return!1};k.qc=function(){return 0};
k.X=function(a){return a&&null!==this.m()?{".value":this.k(),".priority":this.m()}:this.k()};k.hash=function(){var a="";null!==this.m()&&(a+="priority:"+wc(this.m())+":");var b=typeof this.H,a=a+(b+":"),a="number"===b?a+rc(this.H):a+this.H;return $b(a)};k.k=function(){return this.H};k.toString=function(){return"string"===typeof this.H?this.H:'"'+this.H+'"'};function xc(a,b){return jc(a.la,b.la)||kc(a.name,b.name)}function yc(a,b){return kc(a.name,b.name)}function zc(a,b){return kc(a,b)};function R(a,b){this.o=a||new cb(zc);this.qb="undefined"!==typeof b?b:null}k=R.prototype;k.Q=function(){return!1};k.m=function(){return this.qb};k.Ka=function(a){return new R(this.o,a)};k.K=function(a,b){var c=this.o.remove(a);b&&b.f()&&(b=null);null!==b&&(c=c.ta(a,b));return b&&null!==b.m()?new Ac(c,null,this.qb):new R(c,this.qb)};k.Ba=function(a,b){var c=D(a);if(null===c)return b;var d=this.P(c).Ba(Ua(a),b);return this.K(c,d)};k.f=function(){return this.o.f()};k.qc=function(){return this.o.count()};
var Bc=/^(0|[1-9]\d*)$/;k=R.prototype;k.X=function(a){if(this.f())return null;var b={},c=0,d=0,e=!0;this.B(function(f,g){b[f]=g.X(a);c++;e&&Bc.test(f)?d=Math.max(d,Number(f)):e=!1});if(!a&&e&&d<2*c){var f=[],g;for(g in b)f[g]=b[g];return f}a&&null!==this.m()&&(b[".priority"]=this.m());return b};k.hash=function(){var a="";null!==this.m()&&(a+="priority:"+wc(this.m())+":");this.B(function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});return""===a?"":$b(a)};
k.P=function(a){a=this.o.get(a);return null===a?Q:a};k.N=function(a){var b=D(a);return null===b?this:this.P(b).N(Ua(a))};k.ha=function(a){return gb(this.o,a)};k.Jd=function(){return this.o.Mb()};k.Kd=function(){return this.o.lb()};k.B=function(a){return this.o.Fa(a)};k.$c=function(a){return this.o.Xa(a)};k.jb=function(){return this.o.jb()};k.toString=function(){var a="{",b=!0;this.B(function(c,d){b?b=!1:a+=", ";a+='"'+c+'" : '+d.toString()});return a+="}"};var Q=new R;function Ac(a,b,c){R.call(this,a,c);null===b&&(b=new cb(xc),a.Fa(function(a,c){b=b.ta({name:a,la:c.m()},c)}));this.ya=b}oa(Ac,R);k=Ac.prototype;k.K=function(a,b){var c=this.P(a),d=this.o,e=this.ya;null!==c&&(d=d.remove(a),e=e.remove({name:a,la:c.m()}));b&&b.f()&&(b=null);null!==b&&(d=d.ta(a,b),e=e.ta({name:a,la:b.m()},b));return new Ac(d,e,this.m())};k.ha=function(a,b){var c=gb(this.ya,{name:a,la:b.m()});return c?c.name:null};k.B=function(a){return this.ya.Fa(function(b,c){return a(b.name,c)})};
k.$c=function(a){return this.ya.Xa(function(b,c){return a(b.name,c)})};k.jb=function(){return this.ya.jb(function(a,b){return{key:a.name,value:b}})};k.Jd=function(){return this.ya.f()?null:this.ya.Mb().name};k.Kd=function(){return this.ya.f()?null:this.ya.lb().name};function S(a,b){if(null===a)return Q;var c=null;"object"===typeof a&&".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);v(null===c||"string"===typeof c||"number"===typeof c||"object"===typeof c&&".sv"in c,"Invalid priority type found: "+typeof c);"object"===typeof a&&".value"in a&&null!==a[".value"]&&(a=a[".value"]);if("object"!==typeof a||".sv"in a)return new vc(a,c);if(a instanceof Array){var d=Q,e=a;pc(e,function(a,b){if(A(e,b)&&"."!==b.substring(0,1)){var c=S(a);if(c.Q()||!c.f())d=
d.K(b,c)}});return d.Ka(c)}var f=[],g={},h=!1,m=a;oc(m,function(a,b){if("string"!==typeof b||"."!==b.substring(0,1)){var c=S(m[b]);c.f()||(h=h||null!==c.m(),f.push({name:b,la:c.m()}),g[b]=c)}});var n=Cc(f,g,!1);if(h){var r=Cc(f,g,!0);return new Ac(n,r,c)}return new R(n,c)}var Dc=Math.log(2);function Ec(a){this.count=parseInt(Math.log(a+1)/Dc,10);this.Fd=this.count-1;this.pe=a+1&parseInt(Array(this.count+1).join("1"),2)}function Fc(a){var b=!(a.pe&1<<a.Fd);a.Fd--;return b}
function Cc(a,b,c){function d(e,f){var m=f-e;if(0==m)return null;if(1==m){var m=a[e].name,n=c?a[e]:m;return new jb(n,b[m],!1,null,null)}var n=parseInt(m/2,10)+e,r=d(e,n),s=d(n+1,f),m=a[n].name,n=c?a[n]:m;return new jb(n,b[m],!1,r,s)}var e=c?xc:yc;a.sort(e);var f=function(e){function f(e,g){var h=r-e,t=r;r-=e;var s=a[h].name,h=new jb(c?a[h]:s,b[s],g,null,d(h+1,t));m?m.left=h:n=h;m=h}for(var m=null,n=null,r=a.length,s=0;s<e.count;++s){var t=Fc(e),w=Math.pow(2,e.count-(s+1));t?f(w,!1):(f(w,!1),f(w,!0))}return n}(new Ec(a.length)),
e=c?xc:zc;return null!==f?new cb(e,f):new cb(e)}function wc(a){return"number"===typeof a?"number:"+rc(a):"string:"+a};function T(a,b){this.A=a;this.Cc=b}T.prototype.X=function(){x("Firebase.DataSnapshot.val",0,0,arguments.length);return this.A.X()};T.prototype.val=T.prototype.X;T.prototype.te=function(){x("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.A.X(!0)};T.prototype.exportVal=T.prototype.te;T.prototype.J=function(a){x("Firebase.DataSnapshot.child",0,1,arguments.length);ha(a)&&(a=String(a));Na("Firebase.DataSnapshot.child",a);var b=new H(a),c=this.Cc.J(b);return new T(this.A.N(b),c)};
T.prototype.child=T.prototype.J;T.prototype.ed=function(a){x("Firebase.DataSnapshot.hasChild",1,1,arguments.length);Na("Firebase.DataSnapshot.hasChild",a);var b=new H(a);return!this.A.N(b).f()};T.prototype.hasChild=T.prototype.ed;T.prototype.m=function(){x("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.A.m()};T.prototype.getPriority=T.prototype.m;
T.prototype.forEach=function(a){x("Firebase.DataSnapshot.forEach",1,1,arguments.length);z("Firebase.DataSnapshot.forEach",1,a,!1);if(this.A.Q())return!1;var b=this;return this.A.B(function(c,d){return a(new T(d,b.Cc.J(c)))})};T.prototype.forEach=T.prototype.forEach;T.prototype.Gb=function(){x("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.A.Q()?!1:!this.A.f()};T.prototype.hasChildren=T.prototype.Gb;
T.prototype.name=function(){x("Firebase.DataSnapshot.name",0,0,arguments.length);return this.Cc.name()};T.prototype.name=T.prototype.name;T.prototype.qc=function(){x("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.A.qc()};T.prototype.numChildren=T.prototype.qc;T.prototype.rd=function(){x("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.Cc};T.prototype.ref=T.prototype.rd;function Gc(a){v(fa(a)&&0<a.length,"Requires a non-empty array");this.he=a;this.Kb={}}Gc.prototype.Mc=function(a,b){for(var c=this.Kb[a]||[],d=0;d<c.length;d++)c[d].ca.apply(c[d].$,Array.prototype.slice.call(arguments,1))};Gc.prototype.Ta=function(a,b,c){Hc(this,a);this.Kb[a]=this.Kb[a]||[];this.Kb[a].push({ca:b,$:c});(a=this.cd(a))&&b.apply(c,a)};Gc.prototype.nb=function(a,b,c){Hc(this,a);a=this.Kb[a]||[];for(var d=0;d<a.length;d++)if(a[d].ca===b&&(!c||c===a[d].$)){a.splice(d,1);break}};
function Hc(a,b){v(Kb(a.he,function(a){return a===b}),"Unknown event: "+b)};function Ic(){Gc.call(this,["visible"]);var a,b;"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document.hidden?(b="visibilitychange",a="hidden"):"undefined"!==typeof document.mozHidden?(b="mozvisibilitychange",a="mozHidden"):"undefined"!==typeof document.msHidden?(b="msvisibilitychange",a="msHidden"):"undefined"!==typeof document.webkitHidden&&(b="webkitvisibilitychange",a="webkitHidden"));this.yb=!0;if(b){var c=this;document.addEventListener(b,
function(){var b=!document[a];b!==c.yb&&(c.yb=b,c.Mc("visible",b))},!1)}}oa(Ic,Gc);da(Ic);Ic.prototype.cd=function(a){v("visible"===a,"Unknown event type: "+a);return[this.yb]};function Jc(){Gc.call(this,["online"]);this.Pb=!0;if("undefined"!==typeof window&&"undefined"!==typeof window.addEventListener){var a=this;window.addEventListener("online",function(){a.Pb||a.Mc("online",!0);a.Pb=!0},!1);window.addEventListener("offline",function(){a.Pb&&a.Mc("online",!1);a.Pb=!1},!1)}}oa(Jc,Gc);da(Jc);Jc.prototype.cd=function(a){v("online"===a,"Unknown event type: "+a);return[this.Pb]};function pc(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function Kc(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function Lc(a){for(var b in a)return!1;return!0}function Mc(a){var b={},c;for(c in a)b[c]=a[c];return b}var Nc="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Pc(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Nc.length;f++)c=Nc[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};function Qc(){this.Cb={}}function Rc(a,b,c){l(c)||(c=1);A(a.Cb,b)||(a.Cb[b]=0);a.Cb[b]+=c}Qc.prototype.get=function(){return Mc(this.Cb)};function Sc(a){this.qe=a;this.mc=null}Sc.prototype.get=function(){var a=this.qe.get(),b=Mc(a);if(this.mc)for(var c in this.mc)b[c]-=this.mc[c];this.mc=a;return b};function Tc(a,b){this.yd={};this.Hc=new Sc(a);this.n=b;var c=1E4+2E4*Math.random();setTimeout(q(this.Ud,this),Math.floor(c))}Tc.prototype.Ud=function(){var a=this.Hc.get(),b={},c=!1,d;for(d in a)0<a[d]&&A(this.yd,d)&&(b[d]=a[d],c=!0);c&&(a=this.n,a.T&&(b={c:b},a.e("reportStats",b),a.Ia("s",b)));setTimeout(q(this.Ud,this),Math.floor(6E5*Math.random()))};var Uc={},Vc={};function Wc(a){a=a.toString();Uc[a]||(Uc[a]=new Qc);return Uc[a]}function Xc(a,b){var c=a.toString();Vc[c]||(Vc[c]=b());return Vc[c]};var Yc=null;"undefined"!==typeof MozWebSocket?Yc=MozWebSocket:"undefined"!==typeof WebSocket&&(Yc=WebSocket);function Zc(a,b,c){this.Wc=a;this.e=ec(this.Wc);this.frames=this.Ib=null;this.Ma=this.Na=this.Ad=0;this.ga=Wc(b);this.Ca=(b.Ya?"wss://":"ws://")+b.ia+"/.ws?v=5";"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(this.Ca+="&r=f");b.host!==b.ia&&(this.Ca=this.Ca+"&ns="+b.Sa);c&&(this.Ca=this.Ca+"&s="+c)}var $c;
Zc.prototype.open=function(a,b){this.ka=b;this.Ge=a;this.e("Websocket connecting to "+this.Ca);this.Y=new Yc(this.Ca);this.Eb=!1;xb.set("previous_websocket_failure",!0);var c=this;this.Y.onopen=function(){c.e("Websocket connected.");c.Eb=!0};this.Y.onclose=function(){c.e("Websocket connection was disconnected.");c.Y=null;c.Va()};this.Y.onmessage=function(a){if(null!==c.Y)if(a=a.data,c.Ma+=a.length,Rc(c.ga,"bytes_received",a.length),ad(c),null!==c.frames)bd(c,a);else{a:{v(null===c.frames,"We already have a frame buffer");
if(6>=a.length){var b=Number(a);if(!isNaN(b)){c.Ad=b;c.frames=[];a=null;break a}}c.Ad=1;c.frames=[]}null!==a&&bd(c,a)}};this.Y.onerror=function(a){c.e("WebSocket error.  Closing connection.");(a=a.message||a.data)&&c.e(a);c.Va()}};Zc.prototype.start=function(){};Zc.isAvailable=function(){var a=!1;if("undefined"!==typeof navigator&&navigator.userAgent){var b=navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b&&1<b.length&&4.4>parseFloat(b[1])&&(a=!0)}return!a&&null!==Yc&&!$c};
Zc.responsesRequiredToBeHealthy=2;Zc.healthyTimeout=3E4;k=Zc.prototype;k.nc=function(){xb.remove("previous_websocket_failure")};function bd(a,b){a.frames.push(b);if(a.frames.length==a.Ad){var c=a.frames.join("");a.frames=null;c=va(c);a.Ge(c)}}k.send=function(a){ad(this);a=u(a);this.Na+=a.length;Rc(this.ga,"bytes_sent",a.length);a=nc(a,16384);1<a.length&&this.Y.send(String(a.length));for(var b=0;b<a.length;b++)this.Y.send(a[b])};
k.ac=function(){this.Qa=!0;this.Ib&&(clearInterval(this.Ib),this.Ib=null);this.Y&&(this.Y.close(),this.Y=null)};k.Va=function(){this.Qa||(this.e("WebSocket is closing itself"),this.ac(),this.ka&&(this.ka(this.Eb),this.ka=null))};k.close=function(){this.Qa||(this.e("WebSocket is being closed"),this.ac())};function ad(a){clearInterval(a.Ib);a.Ib=setInterval(function(){a.Y&&a.Y.send("0");ad(a)},Math.floor(45E3))};function cd(a){this.ob=a;this.xc=[];this.eb=0;this.Vc=-1;this.Ua=null}function dd(a,b,c){a.Vc=b;a.Ua=c;a.Vc<a.eb&&(a.Ua(),a.Ua=null)}function ed(a,b,c){for(a.xc[b]=c;a.xc[a.eb];){var d=a.xc[a.eb];delete a.xc[a.eb];for(var e=0;e<d.length;++e)if(d[e]){var f=a;uc(function(){f.ob(d[e])})}if(a.eb===a.Vc){a.Ua&&(clearTimeout(a.Ua),a.Ua(),a.Ua=null);break}a.eb++}};function fd(){this.set={}}k=fd.prototype;k.add=function(a,b){this.set[a]=null!==b?b:!0};k.contains=function(a){return A(this.set,a)};k.get=function(a){return this.contains(a)?this.set[a]:void 0};k.remove=function(a){delete this.set[a]};k.clear=function(){this.set={}};k.f=function(){return Lc(this.set)};k.count=function(){var a=this.set,b=0,c;for(c in a)b++;return b};function gd(a,b){pc(a.set,function(a,d){b(d,a)})}k.keys=function(){var a=[];pc(this.set,function(b,c){a.push(c)});return a};function hd(a,b,c){this.Wc=a;this.e=ec(a);this.Ma=this.Na=0;this.ga=Wc(b);this.Gc=c;this.Eb=!1;this.dc=function(a){b.host!==b.ia&&(a.ns=b.Sa);var c=[],f;for(f in a)a.hasOwnProperty(f)&&c.push(f+"="+a[f]);return(b.Ya?"https://":"http://")+b.ia+"/.lp?"+c.join("&")}}var id,jd;
hd.prototype.open=function(a,b){this.Ed=0;this.U=b;this.Od=new cd(a);this.Qa=!1;var c=this;this.Oa=setTimeout(function(){c.e("Timed out trying to connect.");c.Va();c.Oa=null},Math.floor(3E4));ic(function(){if(!c.Qa){c.na=new kd(function(a,b,d,h,m){ld(c,arguments);if(c.na)if(c.Oa&&(clearTimeout(c.Oa),c.Oa=null),c.Eb=!0,"start"==a)c.id=b,c.Td=d;else if("close"===a)b?(c.na.Fc=!1,dd(c.Od,b,function(){c.Va()})):c.Va();else throw Error("Unrecognized command received: "+a);},function(a,b){ld(c,arguments);
ed(c.Od,a,b)},function(){c.Va()},c.dc);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());c.na.Nc&&(a.cb=c.na.Nc);a.v="5";c.Gc&&(a.s=c.Gc);"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");a=c.dc(a);c.e("Connecting via long-poll to "+a);md(c.na,a,function(){})}})};
hd.prototype.start=function(){var a=this.na,b=this.Td;a.Be=this.id;a.Ce=b;for(a.Qc=!0;nd(a););a=this.id;b=this.Td;this.mb=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;this.mb.src=this.dc(c);this.mb.style.display="none";document.body.appendChild(this.mb)};hd.isAvailable=function(){return!jd&&!("object"===typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))&&!("object"===typeof Windows&&"object"===typeof Windows.Ze)&&(id||!0)};k=hd.prototype;
k.nc=function(){};k.ac=function(){this.Qa=!0;this.na&&(this.na.close(),this.na=null);this.mb&&(document.body.removeChild(this.mb),this.mb=null);this.Oa&&(clearTimeout(this.Oa),this.Oa=null)};k.Va=function(){this.Qa||(this.e("Longpoll is closing itself"),this.ac(),this.U&&(this.U(this.Eb),this.U=null))};k.close=function(){this.Qa||(this.e("Longpoll is being closed."),this.ac())};
k.send=function(a){a=u(a);this.Na+=a.length;Rc(this.ga,"bytes_sent",a.length);a=wa(a);a=Xb(a,!0);a=nc(a,1840);for(var b=0;b<a.length;b++){var c=this.na;c.Tb.push({Pe:this.Ed,We:a.length,Gd:a[b]});c.Qc&&nd(c);this.Ed++}};function ld(a,b){var c=u(b).length;a.Ma+=c;Rc(a.ga,"bytes_received",c)}
function kd(a,b,c,d){this.dc=d;this.ka=c;this.od=new fd;this.Tb=[];this.Yc=Math.floor(1E8*Math.random());this.Fc=!0;this.Nc=Yb();window["pLPCommand"+this.Nc]=a;window["pRTLPCB"+this.Nc]=b;a=document.createElement("iframe");a.style.display="none";if(document.body){document.body.appendChild(a);try{a.contentWindow.document||M("No IE domain setting required")}catch(e){a.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
a.contentDocument?a.Da=a.contentDocument:a.contentWindow?a.Da=a.contentWindow.document:a.document&&(a.Da=a.document);this.aa=a;a="";this.aa.src&&"javascript:"===this.aa.src.substr(0,11)&&(a='<script>document.domain="'+document.domain+'";\x3c/script>');a="<html><body>"+a+"</body></html>";try{this.aa.Da.open(),this.aa.Da.write(a),this.aa.Da.close()}catch(f){M("frame writing exception"),f.stack&&M(f.stack),M(f)}}
kd.prototype.close=function(){this.Qc=!1;if(this.aa){this.aa.Da.body.innerHTML="";var a=this;setTimeout(function(){null!==a.aa&&(document.body.removeChild(a.aa),a.aa=null)},Math.floor(0))}var b=this.ka;b&&(this.ka=null,b())};
function nd(a){if(a.Qc&&a.Fc&&a.od.count()<(0<a.Tb.length?2:1)){a.Yc++;var b={};b.id=a.Be;b.pw=a.Ce;b.ser=a.Yc;for(var b=a.dc(b),c="",d=0;0<a.Tb.length;)if(1870>=a.Tb[0].Gd.length+30+c.length){var e=a.Tb.shift(),c=c+"&seg"+d+"="+e.Pe+"&ts"+d+"="+e.We+"&d"+d+"="+e.Gd;d++}else break;od(a,b+c,a.Yc);return!0}return!1}function od(a,b,c){function d(){a.od.remove(c);nd(a)}a.od.add(c);var e=setTimeout(d,Math.floor(25E3));md(a,b,function(){clearTimeout(e);d()})}
function md(a,b,c){setTimeout(function(){try{if(a.Fc){var d=a.aa.Da.createElement("script");d.type="text/javascript";d.async=!0;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;a&&"loaded"!==a&&"complete"!==a||(d.onload=d.onreadystatechange=null,d.parentNode&&d.parentNode.removeChild(d),c())};d.onerror=function(){M("Long-poll script failed to load: "+b);a.Fc=!1;a.close()};a.aa.Da.body.appendChild(d)}}catch(e){}},Math.floor(1))};function pd(a){qd(this,a)}var rd=[hd,Zc];function qd(a,b){var c=Zc&&Zc.isAvailable(),d=c&&!(xb.Nd||!0===xb.get("previous_websocket_failure"));b.Ye&&(c||O("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),d=!0);if(d)a.bc=[Zc];else{var e=a.bc=[];oc(rd,function(a,b){b&&b.isAvailable()&&e.push(b)})}}function sd(a){if(0<a.bc.length)return a.bc[0];throw Error("No transports available");};function td(a,b,c,d,e,f){this.id=a;this.e=ec("c:"+this.id+":");this.ob=c;this.Ob=d;this.U=e;this.md=f;this.D=b;this.wc=[];this.Dd=0;this.ce=new pd(b);this.oa=0;this.e("Connection created");ud(this)}
function ud(a){var b=sd(a.ce);a.C=new b("c:"+a.id+":"+a.Dd++,a.D);a.qd=b.responsesRequiredToBeHealthy||0;var c=vd(a,a.C),d=wd(a,a.C);a.cc=a.C;a.$b=a.C;a.w=null;a.Ra=!1;setTimeout(function(){a.C&&a.C.open(c,d)},Math.floor(0));b=b.healthyTimeout||0;0<b&&(a.kc=setTimeout(function(){a.kc=null;a.Ra||(a.C&&102400<a.C.Ma?(a.e("Connection exceeded healthy timeout but has received "+a.C.Ma+" bytes.  Marking connection healthy."),a.Ra=!0,a.C.nc()):a.C&&10240<a.C.Na?a.e("Connection exceeded healthy timeout but has sent "+
a.C.Na+" bytes.  Leaving connection alive."):(a.e("Closing unhealthy connection after timeout."),a.close()))},Math.floor(b)))}function wd(a,b){return function(c){b===a.C?(a.C=null,c||0!==a.oa?1===a.oa&&a.e("Realtime connection lost."):(a.e("Realtime connection failed."),"s-"===a.D.ia.substr(0,2)&&(xb.remove("host:"+a.D.host),a.D.ia=a.D.host)),a.close()):b===a.w?(a.e("Secondary connection lost."),c=a.w,a.w=null,a.cc!==c&&a.$b!==c||a.close()):a.e("closing an old connection")}}
function vd(a,b){return function(c){if(2!=a.oa)if(b===a.$b){var d=mc("t",c);c=mc("d",c);if("c"==d){if(d=mc("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.Gc=c.s;zb(a.D,f);0==a.oa&&(a.C.start(),xd(a,a.C,d),"5"!==e&&O("Protocol version mismatch detected"),c=a.ce,(c=1<c.bc.length?c.bc[1]:null)&&yd(a,c))}else if("n"===d){a.e("recvd end transmission on primary");a.$b=a.w;for(c=0;c<a.wc.length;++c)a.tc(a.wc[c]);a.wc=[];zd(a)}else"s"===d?(a.e("Connection shutdown command received. Shutting down..."),
a.md&&(a.md(c),a.md=null),a.U=null,a.close()):"r"===d?(a.e("Reset packet received.  New host: "+c),zb(a.D,c),1===a.oa?a.close():(Ad(a),ud(a))):"e"===d?fc("Server Error: "+c):"o"===d?(a.e("got pong on primary."),Dd(a),Ed(a)):fc("Unknown control packet command: "+d)}else"d"==d&&a.tc(c)}else if(b===a.w)if(d=mc("t",c),c=mc("d",c),"c"==d)"t"in c&&(c=c.t,"a"===c?Fd(a):"r"===c?(a.e("Got a reset on secondary, closing it"),a.w.close(),a.cc!==a.w&&a.$b!==a.w||a.close()):"o"===c&&(a.e("got pong on secondary."),
a.Yd--,Fd(a)));else if("d"==d)a.wc.push(c);else throw Error("Unknown protocol layer: "+d);else a.e("message on old connection")}}td.prototype.Zd=function(a){Gd(this,{t:"d",d:a})};function zd(a){a.cc===a.w&&a.$b===a.w&&(a.e("cleaning up and promoting a connection: "+a.w.Wc),a.C=a.w,a.w=null)}
function Fd(a){0>=a.Yd?(a.e("Secondary connection is healthy."),a.Ra=!0,a.w.nc(),a.w.start(),a.e("sending client ack on secondary"),a.w.send({t:"c",d:{t:"a",d:{}}}),a.e("Ending transmission on primary"),a.C.send({t:"c",d:{t:"n",d:{}}}),a.cc=a.w,zd(a)):(a.e("sending ping on secondary."),a.w.send({t:"c",d:{t:"p",d:{}}}))}td.prototype.tc=function(a){Dd(this);this.ob(a)};function Dd(a){a.Ra||(a.qd--,0>=a.qd&&(a.e("Primary connection is healthy."),a.Ra=!0,a.C.nc()))}
function yd(a,b){a.w=new b("c:"+a.id+":"+a.Dd++,a.D,a.Gc);a.Yd=b.responsesRequiredToBeHealthy||0;a.w.open(vd(a,a.w),wd(a,a.w));setTimeout(function(){a.w&&(a.e("Timed out trying to upgrade."),a.w.close())},Math.floor(6E4))}function xd(a,b,c){a.e("Realtime connection established.");a.C=b;a.oa=1;a.Ob&&(a.Ob(c),a.Ob=null);0===a.qd?(a.e("Primary connection is healthy."),a.Ra=!0):setTimeout(function(){Ed(a)},Math.floor(5E3))}
function Ed(a){a.Ra||1!==a.oa||(a.e("sending ping on primary."),Gd(a,{t:"c",d:{t:"p",d:{}}}))}function Gd(a,b){if(1!==a.oa)throw"Connection is not connected";a.cc.send(b)}td.prototype.close=function(){2!==this.oa&&(this.e("Closing realtime connection."),this.oa=2,Ad(this),this.U&&(this.U(),this.U=null))};function Ad(a){a.e("Shutting down all connections");a.C&&(a.C.close(),a.C=null);a.w&&(a.w.close(),a.w=null);a.kc&&(clearTimeout(a.kc),a.kc=null)};function Hd(a){var b={},c={},d={},e="";try{var f=a.split("."),b=va(Zb(f[0])||""),c=va(Zb(f[1])||""),e=f[2],d=c.d||{};delete c.d}catch(g){}return{cf:b,Uc:c,data:d,Ue:e}}function Id(a){a=Hd(a).Uc;return"object"===typeof a&&a.hasOwnProperty("iat")?B(a,"iat"):null}function Jd(a){a=Hd(a);var b=a.Uc;return!!a.Ue&&!!b&&"object"===typeof b&&b.hasOwnProperty("iat")};function Kd(a,b,c,d,e){this.id=Ld++;this.e=ec("p:"+this.id+":");this.Za=!0;this.ja={};this.V=[];this.Qb=0;this.Nb=[];this.T=!1;this.va=1E3;this.oc=3E5;this.uc=b||ca;this.sc=c||ca;this.nd=d||ca;this.dd=e||ca;this.D=a;this.ud=null;this.Xb={};this.Oe=0;this.Jb=this.hd=null;Md(this,0);Ic.ib().Ta("visible",this.Je,this);-1===a.host.indexOf("fblocal")&&Jc.ib().Ta("online",this.He,this)}var Ld=0,Nd=0;k=Kd.prototype;
k.Ia=function(a,b,c){var d=++this.Oe;a={r:d,a:a,b:b};this.e(u(a));v(this.T,"sendRequest_ call when we're not connected not allowed.");this.ma.Zd(a);c&&(this.Xb[d]=c)};function Od(a,b,c){var d=b.toString(),e=b.path().toString();a.ja[e]=a.ja[e]||{};v(!a.ja[e][d],"listen() called twice for same path/queryId.");a.ja[e][d]={rb:b.rb(),G:c};a.T&&Pd(a,e,d,b.rb(),c)}
function Pd(a,b,c,d,e){a.e("Listen on "+b+" for "+c);var f={p:b};d=Hb(d,function(a){return Sa(a)});"{}"!==c&&(f.q=d);f.h=a.dd(b);a.Ia("l",f,function(d){a.e("listen response",d);d=d.s;"ok"!==d&&Qd(a,b,c);e&&e(d)})}k.I=function(a,b,c){this.bb={re:a,Id:!1,ca:b,fc:c};this.e("Authenticating using credential: "+a);Rd(this);(b=40==a.length)||(a=Hd(a).Uc,b="object"===typeof a&&!0===B(a,"admin"));b&&(this.e("Admin auth credential detected.  Reducing max reconnect time."),this.oc=3E4)};
k.Bd=function(a){delete this.bb;this.T&&this.Ia("unauth",{},function(b){a(b.s,b.d)})};function Rd(a){var b=a.bb;a.T&&b&&a.Ia("auth",{cred:b.re},function(c){var d=c.s;c=c.d||"error";"ok"!==d&&a.bb===b&&delete a.bb;b.Id?"ok"!==d&&b.fc&&b.fc(d,c):(b.Id=!0,b.ca&&b.ca(d,c))})}function Sd(a,b,c,d){b=b.toString();Qd(a,b,c)&&a.T&&Td(a,b,c,d)}function Td(a,b,c,d){a.e("Unlisten on "+b+" for "+c);b={p:b};d=Hb(d,function(a){return Sa(a)});"{}"!==c&&(b.q=d);a.Ia("u",b)}
function Ud(a,b,c,d){a.T?Vd(a,"o",b,c,d):a.Nb.push({pb:b,action:"o",data:c,G:d})}function Wd(a,b,c,d){a.T?Vd(a,"om",b,c,d):a.Nb.push({pb:b,action:"om",data:c,G:d})}k.ld=function(a,b){this.T?Vd(this,"oc",a,null,b):this.Nb.push({pb:a,action:"oc",data:null,G:b})};function Vd(a,b,c,d,e){c={p:c,d:d};a.e("onDisconnect "+b,c);a.Ia(b,c,function(a){e&&setTimeout(function(){e(a.s,a.d)},Math.floor(0))})}k.put=function(a,b,c,d){Xd(this,"p",a,b,c,d)};function Yd(a,b,c,d){Xd(a,"m",b,c,d,void 0)}
function Xd(a,b,c,d,e,f){c={p:c,d:d};l(f)&&(c.h=f);a.V.push({action:b,Vd:c,G:e});a.Qb++;b=a.V.length-1;a.T&&Zd(a,b)}function Zd(a,b){var c=a.V[b].action,d=a.V[b].Vd,e=a.V[b].G;a.V[b].Le=a.T;a.Ia(c,d,function(d){a.e(c+" response",d);delete a.V[b];a.Qb--;0===a.Qb&&(a.V=[]);e&&e(d.s,d.d)})}
k.tc=function(a){if("r"in a){this.e("from server: "+u(a));var b=a.r,c=this.Xb[b];c&&(delete this.Xb[b],c(a.b))}else{if("error"in a)throw"A server-side error has occurred: "+a.error;"a"in a&&(b=a.a,c=a.b,this.e("handleServerMessage",b,c),"d"===b?this.uc(c.p,c.d,!1):"m"===b?this.uc(c.p,c.d,!0):"c"===b?$d(this,c.p,c.q):"ac"===b?(a=c.s,b=c.d,c=this.bb,delete this.bb,c&&c.fc&&c.fc(a,b)):"sd"===b?this.ud?this.ud(c):"msg"in c&&"undefined"!==typeof console&&console.log("FIREBASE: "+c.msg.replace("\n","\nFIREBASE: ")):
fc("Unrecognized action received from server: "+u(b)+"\nAre you using the latest client?"))}};k.Ob=function(a){this.e("connection ready");this.T=!0;this.Jb=(new Date).getTime();this.nd({serverTimeOffset:a-(new Date).getTime()});Rd(this);for(var b in this.ja)for(var c in this.ja[b])a=this.ja[b][c],Pd(this,b,c,a.rb,a.G);for(b=0;b<this.V.length;b++)this.V[b]&&Zd(this,b);for(;this.Nb.length;)b=this.Nb.shift(),Vd(this,b.action,b.pb,b.data,b.G);this.sc(!0)};
function Md(a,b){v(!a.ma,"Scheduling a connect when we're already connected/ing?");a.gb&&clearTimeout(a.gb);a.gb=setTimeout(function(){a.gb=null;ae(a)},Math.floor(b))}k.Je=function(a){a&&!this.yb&&this.va===this.oc&&(this.e("Window became visible.  Reducing delay."),this.va=1E3,this.ma||Md(this,0));this.yb=a};
k.He=function(a){a?(this.e("Browser went online.  Reconnecting."),this.va=1E3,this.Za=!0,this.ma||Md(this,0)):(this.e("Browser went offline.  Killing connection; don't reconnect."),this.Za=!1,this.ma&&this.ma.close())};
k.Qd=function(){this.e("data client disconnected");this.T=!1;this.ma=null;for(var a=0;a<this.V.length;a++){var b=this.V[a];b&&"h"in b.Vd&&b.Le&&(b.G&&b.G("disconnect"),delete this.V[a],this.Qb--)}0===this.Qb&&(this.V=[]);if(this.Za)this.yb?this.Jb&&(3E4<(new Date).getTime()-this.Jb&&(this.va=1E3),this.Jb=null):(this.e("Window isn't visible.  Delaying reconnect."),this.va=this.oc,this.hd=(new Date).getTime()),a=Math.max(0,this.va-((new Date).getTime()-this.hd)),a*=Math.random(),this.e("Trying to reconnect in "+
a+"ms"),Md(this,a),this.va=Math.min(this.oc,1.3*this.va);else for(var c in this.Xb)delete this.Xb[c];this.sc(!1)};function ae(a){if(a.Za){a.e("Making a connection attempt");a.hd=(new Date).getTime();a.Jb=null;var b=q(a.tc,a),c=q(a.Ob,a),d=q(a.Qd,a),e=a.id+":"+Nd++;a.ma=new td(e,a.D,b,c,d,function(b){O(b+" ("+a.D.toString()+")");a.Za=!1})}}k.Pa=function(){this.Za=!1;this.ma?this.ma.close():(this.gb&&(clearTimeout(this.gb),this.gb=null),this.T&&this.Qd())};
k.ub=function(){this.Za=!0;this.va=1E3;this.T||Md(this,0)};function $d(a,b,c){c=c?Hb(c,function(a){return Ta(a)}).join("$"):"{}";(a=Qd(a,b,c))&&a.G&&a.G("permission_denied")}function Qd(a,b,c){b=(new H(b)).toString();c||(c="{}");var d=a.ja[b][c];delete a.ja[b][c];return d};function be(){this.o=this.H=null}be.prototype.sb=function(a,b){if(a.f())this.H=b,this.o=null;else if(null!==this.H)this.H=this.H.Ba(a,b);else{null==this.o&&(this.o=new fd);var c=D(a);this.o.contains(c)||this.o.add(c,new be);c=this.o.get(c);a=Ua(a);c.sb(a,b)}};
function ce(a,b){if(b.f())return a.H=null,a.o=null,!0;if(null!==a.H){if(a.H.Q())return!1;var c=a.H;a.H=null;c.B(function(b,c){a.sb(new H(b),c)});return ce(a,b)}return null!==a.o?(c=D(b),b=Ua(b),a.o.contains(c)&&ce(a.o.get(c),b)&&a.o.remove(c),a.o.f()?(a.o=null,!0):!1):!0}function de(a,b,c){null!==a.H?c(b,a.H):a.B(function(a,e){var f=new H(b.toString()+"/"+a);de(e,f,c)})}be.prototype.B=function(a){null!==this.o&&gd(this.o,function(b,c){a(b,c)})};function ee(){this.ba=Q}function U(a,b){return a.ba.N(b)}function V(a,b,c){a.ba=a.ba.Ba(b,c)}ee.prototype.toString=function(){return this.ba.toString()};function fe(){this.wa=new ee;this.O=new ee;this.qa=new ee;this.Sb=new Ya}function ge(a,b,c){V(a.wa,b,c);return he(a,b)}function he(a,b){for(var c=U(a.wa,b),d=U(a.O,b),e=I(a.Sb,b),f=!1,g=e;null!==g;){if(null!==g.k()){f=!0;break}g=g.parent()}if(f)return!1;c=ie(c,d,e);return c!==d?(V(a.O,b,c),!0):!1}function ie(a,b,c){if(c.f())return a;if(null!==c.k())return b;a=a||Q;c.B(function(d){d=d.name();var e=a.P(d),f=b.P(d),g=I(c,d),e=ie(e,f,g);a=a.K(d,e)});return a}
fe.prototype.set=function(a,b){var c=this,d=[];Fb(b,function(a){var b=a.path;a=a.ua;var g=Yb();Za(I(c.Sb,b),g);V(c.O,b,a);d.push({path:b,Re:g})});return d};function je(a,b){Fb(b,function(b){var d=b.Re;b=I(a.Sb,b.path);var e=b.k();v(null!==e,"pendingPut should not be null.");e===d&&Za(b,null)})};function ke(a,b){return a&&"object"===typeof a?(v(".sv"in a,"Unexpected leaf node or priority contents"),b[a[".sv"]]):a}function le(a,b){var c=new be;de(a,new H(""),function(a,e){c.sb(a,me(e,b))});return c}function me(a,b){var c=ke(a.m(),b),d;if(a.Q()){var e=ke(a.k(),b);return e!==a.k()||c!==a.m()?new vc(e,c):a}d=a;c!==a.m()&&(d=d.Ka(c));a.B(function(a,c){var e=me(c,b);e!==c&&(d=d.K(a,e))});return d};var ne="auth.firebase.com";function oe(a,b,c){this.hc=a||{};this.Lc=b||{};this.vb=c||{};this.hc.remember||(this.hc.remember="default")}var pe=["remember","redirectTo"];function qe(a){var b={},c={};Aa(a||{},function(a,e){0<=Eb(pe,a)?b[a]=e:c[a]=e});return new oe(b,{},c)};var re={NETWORK_ERROR:"Unable to contact the Firebase server.",SERVER_ERROR:"An unknown server error occurred.",TRANSPORT_UNAVAILABLE:"There are no login transports available for the requested method.",REQUEST_INTERRUPTED:"The browser redirected the page before the login request could complete.",USER_CANCELLED:"The user cancelled authentication."};function W(a){var b=Error(B(re,a),a);b.code=a;return b};function se(){var a=window.opener.frames,b;for(b=a.length-1;0<=b;b--)try{if(a[b].location.protocol===window.location.protocol&&a[b].location.host===window.location.host&&"__winchan_relay_frame"===a[b].name)return a[b]}catch(c){}return null}function te(a,b,c){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,!1)}function ue(a,b,c){a.detachEvent?a.detachEvent("on"+b,c):a.removeEventListener&&a.removeEventListener(b,c,!1)}
function ve(a){/^https?:\/\//.test(a)||(a=window.location.href);var b=/^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);return b?b[1]:a}function we(a){var b=[],c;for(c in a)if(a.hasOwnProperty(c)){var d=B(a,c);if(fa(d))for(var e=0;e<d.length;e++)b.push(encodeURIComponent(c)+"="+encodeURIComponent(d[e]));else b.push(encodeURIComponent(c)+"="+encodeURIComponent(B(a,c)))}return b.join("&")}function xe(){var a=hc(ne);return a.scheme+"://"+a.host+"/v2"};function ye(){return!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(navigator.userAgent)}function ze(){var a=navigator.userAgent;if("Microsoft Internet Explorer"===navigator.appName){if((a=a.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/))&&1<a.length)return 8<=parseFloat(a[1])}else if(-1<a.indexOf("Trident")&&(a=a.match(/rv:([0-9]{2,2}[\.0-9]{0,})/))&&1<a.length)return 8<=parseFloat(a[1]);return!1};function Ae(a){a=a||{};a.method||(a.method="GET");a.headers||(a.headers={});a.headers.content_type||(a.headers.content_type="application/json");a.headers.content_type=a.headers.content_type.toLowerCase();this.options=a}
Ae.prototype.open=function(a,b,c){function d(){c&&(c(W("REQUEST_INTERRUPTED")),c=null)}var e=new XMLHttpRequest,f=this.options.method.toUpperCase(),g;te(window,"beforeunload",d);e.onreadystatechange=function(){if(c&&4===e.readyState){var a;if(200<=e.status&&300>e.status){try{a=va(e.responseText)}catch(b){}c(null,a)}else 500<=e.status&&600>e.status?c(W("SERVER_ERROR")):c(W("NETWORK_ERROR"));c=null;ue(window,"beforeunload",d)}};if("GET"===f)a+=(/\?/.test(a)?"":"?")+we(b),g=null;else{var h=this.options.headers.content_type;
"application/json"===h&&(g=u(b));"application/x-www-form-urlencoded"===h&&(g=we(b))}e.open(f,a,!0);a={"X-Requested-With":"XMLHttpRequest",Accept:"application/json;text/plain"};Pc(a,this.options.headers);for(var m in a)e.setRequestHeader(m,a[m]);e.send(g)};Ae.isAvailable=function(){return!!window.XMLHttpRequest&&"string"===typeof(new XMLHttpRequest).responseType&&(!(navigator.userAgent.match(/MSIE/)||navigator.userAgent.match(/Trident/))||ze())};Ae.prototype.Bb=function(){return"json"};function Be(a){a=a||{};this.Yb=Db()+Db()+Db();this.Rd=a||{}}
Be.prototype.open=function(a,b,c){function d(){c&&(c(W("USER_CANCELLED")),c=null)}var e=this,f=hc(ne),g;b.requestId=this.Yb;b.redirectTo=f.scheme+"://"+f.host+"/blank/page.html";a+=/\?/.test(a)?"":"?";a+=we(b);(g=window.open(a,"_blank","location=no"))&&ia(g.addEventListener)?(g.addEventListener("loadstart",function(a){a&&a.url&&(a=hc(a.url),a.host===ne&&"/blank/page.html"===a.pb&&(g.removeEventListener("exit",d),g.close(),a=new oe(null,null,{requestId:e.Yb}),e.Rd.requestWithCredential("/auth/session",
a,c),c=null))}),g.addEventListener("exit",d)):c(W("TRANSPORT_UNAVAILABLE"))};na("fb.login.transports.CordovaInAppBrowser.prototype.open",Be.prototype.open);Be.isAvailable=function(){return ye()};Be.prototype.Bb=function(){return"redirect"};function Ce(a){a=a||{};if(!a.window_features||-1!==navigator.userAgent.indexOf("Fennec/")||-1!==navigator.userAgent.indexOf("Firefox/")&&-1!==navigator.userAgent.indexOf("Android"))a.window_features=void 0;a.window_name||(a.window_name="_blank");a.relay_url||(a.relay_url=xe()+"/auth/channel");this.options=a}
Ce.prototype.open=function(a,b,c){function d(a){g&&(document.body.removeChild(g),g=void 0);r&&(r=clearInterval(r));ue(window,"message",e);ue(window,"unload",d);if(n&&!a)try{n.close()}catch(b){h.postMessage("die",m)}n=h=void 0}function e(a){if(a.origin===m)try{var b=va(a.data);"ready"===b.a?h.postMessage(s,m):"error"===b.a?(d(!1),c&&(c(b.d),c=null)):"response"===b.a&&(d(b.bf),c&&(c(null,b.d),c=null))}catch(e){}}var f=ze(),g,h,m=ve(a);if(m!==ve(this.options.relay_url))c&&setTimeout(function(){c(Error("invalid arguments: origin of url and relay_url must match"))},
0);else{f&&(g=document.createElement("iframe"),g.setAttribute("src",this.options.relay_url),g.style.display="none",g.setAttribute("name","__winchan_relay_frame"),document.body.appendChild(g),h=g.contentWindow);a+=(/\?/.test(a)?"":"?")+we(b);var n=window.open(a,this.options.window_name,this.options.window_features);h||(h=n);var r=setInterval(function(){n&&n.closed&&(d(!1),c&&(c(W("USER_CANCELLED")),c=null))},500),s=u({a:"request",d:b});te(window,"unload",d);te(window,"message",e)}};
na("fb.login.transports.Popup.prototype.open",Ce.prototype.open);Ce.isAvailable=function(){return"postMessage"in window&&!/^file:\//.test(location.href)&&!(ye()||navigator.userAgent.match(/Windows Phone/)||window.Windows&&/^ms-appx:/.test(location.href)||navigator.userAgent.match(/CriOS/)||navigator.userAgent.match(/Twitter for iPhone/)||navigator.userAgent.match(/FBAN\/FBIOS/)||window.navigator.standalone)&&!navigator.userAgent.match(/PhantomJS/)};Ce.prototype.Bb=function(){return"popup"};function De(a){a=a||{};a.callback_parameter||(a.callback_parameter="callback");this.options=a;window.__firebase_login_jsonp=window.__firebase_login_jsonp||{}}
De.prototype.open=function(a,b,c){function d(){c&&(c(W("REQUEST_INTERRUPTED")),c=null)}function e(){setTimeout(function(){delete window.__firebase_login_jsonp[f];Lc(window.__firebase_login_jsonp)&&delete window.__firebase_login_jsonp;try{var a=document.getElementById(f);a&&a.parentNode.removeChild(a)}catch(b){}},1);ue(window,"beforeunload",d)}var f="fn"+(new Date).getTime()+Math.floor(99999*Math.random());b[this.options.callback_parameter]="__firebase_login_jsonp."+f;a+=(/\?/.test(a)?"":"?")+we(b);
te(window,"beforeunload",d);window.__firebase_login_jsonp[f]=function(a){c&&(c(null,a),c=null);e()};Ee(f,a,c)};
function Ee(a,b,c){setTimeout(function(){try{var d=document.createElement("script");d.type="text/javascript";d.id=a;d.async=!0;d.src=b;d.onerror=function(){var b=document.getElementById(a);null!==b&&b.parentNode.removeChild(b);c&&c(W("NETWORK_ERROR"))};var e=document.getElementsByTagName("head");(e&&0!=e.length?e[0]:document.documentElement).appendChild(d)}catch(f){c&&c(W("NETWORK_ERROR"))}},0)}De.isAvailable=function(){return!ye()};De.prototype.Bb=function(){return"json"};function Fe(a,b){this.pd=["session",a.yc,a.Sa].join(":");this.Ic=b}Fe.prototype.set=function(a,b){if(!b)if(this.Ic.length)b=this.Ic[0];else throw Error("fb.login.SessionManager : No storage options available!");b.set(this.pd,a)};Fe.prototype.get=function(){var a=Hb(this.Ic,q(this.we,this)),a=Gb(a,function(a){return null!==a});Lb(a,function(a,c){return Id(c.token)-Id(a.token)});return 0<a.length?a.shift():null};Fe.prototype.we=function(a){try{var b=a.get(this.pd);if(b&&b.token)return b}catch(c){}return null};
Fe.prototype.clear=function(){var a=this;Fb(this.Ic,function(b){b.remove(a.pd)})};function Ge(a){a=a||{};this.Yb=Db()+Db()+Db();this.Rd=a||{}}Ge.prototype.open=function(a,b){K.set("redirect_request_id",this.Yb);b.requestId=this.Yb;b.redirectTo=b.redirectTo||window.location.href;a+=(/\?/.test(a)?"":"?")+we(b);window.location=a};na("fb.login.transports.Redirect.prototype.open",Ge.prototype.open);Ge.isAvailable=function(){return!/^file:\//.test(location.href)&&!ye()};Ge.prototype.Bb=function(){return"redirect"};function He(a,b,c,d){Gc.call(this,["auth_status"]);this.D=a;this.Cd=b;this.Xe=c;this.jd=d;this.wb=new Fe(a,[xb,K]);this.La=null;Ie(this)}oa(He,Gc);k=He.prototype;k.bd=function(){return this.La||null};function Ie(a){K.get("redirect_request_id")&&Je(a);var b=a.wb.get();b&&b.token?(Ke(a,b),a.Cd(b.token,function(c,d){Le(a,c,d,!1,b.token,b)},function(b,d){Me(a,"resumeSession()",b,d)})):Ke(a,null)}
function Ne(a,b,c,d,e,f){"firebaseio-demo.com"===a.D.domain&&O("FirebaseRef.auth() not supported on demo Firebases (*.firebaseio-demo.com). Please use on production Firebases only (*.firebaseio.com).");a.Cd(b,function(f,h){Le(a,f,h,!0,b,c,d||{},e)},function(b,c){Me(a,"auth()",b,c,f)})}function Oe(a,b){a.wb.clear();Ke(a,null);a.Xe(function(a,d){if("ok"===a)P(b);else{var e=(a||"error").toUpperCase(),f=e;d&&(f+=": "+d);f=Error(f);f.code=e;P(b,f)}})}
function Le(a,b,c,d,e,f,g,h){"ok"===b?(d&&(b=c.auth,f.auth=b,f.expires=c.expires,f.token=Jd(e)?e:"",c=null,b&&A(b,"uid")?c=B(b,"uid"):A(f,"uid")&&(c=B(f,"uid")),f.uid=c,c="custom",b&&A(b,"provider")?c=B(b,"provider"):A(f,"provider")&&(c=B(f,"provider")),f.provider=c,a.wb.clear(),Jd(e)&&(g=g||{},c=xb,"sessionOnly"===g.remember&&(c=K),"none"!==g.remember&&a.wb.set(f,c)),Ke(a,f)),P(h,null,f)):(a.wb.clear(),Ke(a,null),f=a=(b||"error").toUpperCase(),c&&(f+=": "+c),f=Error(f),f.code=a,P(h,f))}
function Me(a,b,c,d,e){O(b+" was canceled: "+d);a.wb.clear();Ke(a,null);a=Error(d);a.code=c.toUpperCase();P(e,a)}function Pe(a,b,c,d){Qe(a);var e=[Ae,De];c=qe(c);Re(a,e,"/auth/"+b,c,d)}
function Se(a,b,c,d){Qe(a);var e=[Ce,Be];c=qe(c);"anonymous"===b||"password"===b?setTimeout(function(){P(d,W("TRANSPORT_UNAVAILABLE"))},0):(c.Lc.window_features="menubar=yes,modal=yes,alwaysRaised=yeslocation=yes,resizable=yes,scrollbars=yes,status=yes,height=625,width=625,top="+("object"===typeof screen?.5*(screen.height-625):0)+",left="+("object"===typeof screen?.5*(screen.width-625):0),c.Lc.relay_url=xe()+"/"+a.D.Sa+"/auth/channel",c.Lc.requestWithCredential=q(a.Zb,a),Re(a,e,"/auth/"+b,c,d))}
function Je(a){var b=K.get("redirect_request_id");if(b){var c=K.get("redirect_client_options");K.remove("redirect_request_id");K.remove("redirect_client_options");var d=[Ae,De],b=new oe(c,{},{requestId:b});Re(a,d,"/auth/session",b)}}k.Xc=function(a,b){Qe(this);var c=qe(a);c.vb._method="POST";this.Zb("/users",c,function(a){P(b,a)})};
k.sd=function(a,b){var c=this;Qe(this);var d="/users/"+encodeURIComponent(a.email),e=qe(a);e.vb._method="DELETE";this.Zb(d,e,function(a,d){!a&&d&&d.uid&&c.La&&c.La.uid&&c.La.uid===d.uid&&Oe(c);P(b,a)})};k.Tc=function(a,b){Qe(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=qe(a);d.vb._method="PUT";d.vb.password=a.newPassword;this.Zb(c,d,function(a){P(b,a)})};
k.td=function(a,b){Qe(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=qe(a);d.vb._method="POST";this.Zb(c,d,function(a){P(b,a)})};k.Zb=function(a,b,c){Te(this,[Ae,De],a,b,c)};function Re(a,b,c,d,e){Te(a,b,c,d,function(b,c){!b&&c&&c.token&&c.uid?Ne(a,c.token,c,d.hc,function(a,b){a?P(e,a):P(e,null,b)}):P(e,b||W("UNKNOWN_ERROR"))})}
function Te(a,b,c,d,e){b=Gb(b,function(a){return"function"===typeof a.isAvailable&&a.isAvailable()});0===b.length?setTimeout(function(){P(e,W("TRANSPORT_UNAVAILABLE"))},0):(b=new (b.shift())(d.Lc),d=Ba(d.vb),d.v="js-1.1.0",d.transport=b.Bb(),d.suppress_status_codes=!0,a=xe()+"/"+a.D.Sa+c,b.open(a,d,function(a,b){if(a)P(e,a);else if(b&&b.error){var c=Error(b.error.message);c.code=b.error.code;c.details=b.error.details;P(e,c)}else P(e,null,b)}))}
function Ke(a,b){var c=null!==a.La||null!==b;a.La=b;c&&a.Mc("auth_status",b);a.jd(null!==b)}k.cd=function(a){v("auth_status"===a,'initial event must be of type "auth_status"');return[this.La]};function Qe(a){var b=a.D;if("firebaseio.com"!==b.domain&&"firebaseio-demo.com"!==b.domain&&"auth.firebase.com"===ne)throw Error("This custom Firebase server ('"+a.D.domain+"') does not support delegated login.");};function Ue(){this.hb=[]}function Ve(a,b){if(0!==b.length)for(var c=0;c<b.length;c++)a.hb.push(b[c])}Ue.prototype.Vb=function(){for(var a=0;a<this.hb.length;a++)if(this.hb[a]){var b=this.hb[a];this.hb[a]=null;We(b)}this.hb=[]};function We(a){var b=a.ca,c=a.$d,d=a.Ub;uc(function(){b(c,d)})};function X(a,b,c,d){this.type=a;this.xa=b;this.da=c;this.Ub=d};function Xe(a){this.S=a;this.sa=[];this.Zc=new Ue}function Ye(a,b,c,d,e){a.sa.push({type:b,ca:c,cancel:d,$:e});d=[];var f=Ze(a.j);a.Hb&&f.push(new X("value",a.j));for(var g=0;g<f.length;g++)if(f[g].type===b){var h=new G(a.S.i,a.S.path);f[g].da&&(h=h.J(f[g].da));d.push({ca:qc(c,e),$d:new T(f[g].xa,h),Ub:f[g].Ub})}Ve(a.Zc,d)}Xe.prototype.Ac=function(a,b){b=this.Bc(a,b);null!=b&&$e(this,b)};
function $e(a,b){for(var c=[],d=0;d<b.length;d++){var e=b[d],f=e.type,g=new G(a.S.i,a.S.path);b[d].da&&(g=g.J(b[d].da));g=new T(b[d].xa,g);"value"!==e.type||g.Gb()?"value"!==e.type&&(f+=" "+g.name()):f+="("+g.X()+")";M(a.S.i.n.id+": event:"+a.S.path+":"+a.S.Wa()+":"+f);for(f=0;f<a.sa.length;f++){var h=a.sa[f];b[d].type===h.type&&c.push({ca:qc(h.ca,h.$),$d:g,Ub:e.Ub})}}Ve(a.Zc,c)}Xe.prototype.Vb=function(){this.Zc.Vb()};
function Ze(a){var b=[];if(!a.Q()){var c=null;a.B(function(a,e){b.push(new X("child_added",e,a,c));c=a})}return b}function af(a){a.Hb||(a.Hb=!0,$e(a,[new X("value",a.j)]))};function bf(a,b){Xe.call(this,a);this.j=b}oa(bf,Xe);bf.prototype.Bc=function(a,b){this.j=a;this.Hb&&null!=b&&b.push(new X("value",this.j));return b};bf.prototype.Fb=function(){return{}};function cf(a,b){this.jc=a;this.kd=b}function df(a,b,c,d,e){var f=a.N(c),g=b.N(c);d=new cf(d,e);e=ef(d,c,f,g);g=!f.f()&&!g.f()&&f.m()!==g.m();if(e||g)for(f=c,c=e;null!==f.parent();){var h=a.N(f);e=b.N(f);var m=f.parent();if(!d.jc||I(d.jc,m).k()){var n=b.N(m),r=[],f=Va(f);h.f()?(h=n.ha(f,e),r.push(new X("child_added",e,f,h))):e.f()?r.push(new X("child_removed",h,f)):(h=n.ha(f,e),g&&r.push(new X("child_moved",e,f,h)),c&&r.push(new X("child_changed",e,f,h)));d.kd(m,n,r)}g&&(g=!1,c=!0);f=m}}
function ef(a,b,c,d){var e,f=[];c===d?e=!1:c.Q()&&d.Q()?e=c.k()!==d.k():c.Q()?(ff(a,b,Q,d,f),e=!0):d.Q()?(ff(a,b,c,Q,f),e=!0):e=ff(a,b,c,d,f);e?a.kd(b,d,f):c.m()!==d.m()&&a.kd(b,d,null);return e}
function ff(a,b,c,d,e){var f=!1,g=!a.jc||!I(a.jc,b).f(),h=[],m=[],n=[],r=[],s={},t={},w,aa,J,N;w=c.jb();J=ib(w);aa=d.jb();for(N=ib(aa);null!==J||null!==N;){c=N;c=null===J?1:null===c?-1:J.key===c.key?0:xc({name:J.key,la:J.value.m()},{name:c.key,la:c.value.m()});if(0>c)f=B(s,J.key),l(f)?(n.push({ad:J,zd:h[f]}),h[f]=null):(t[J.key]=m.length,m.push(J)),f=!0,J=ib(w);else{if(0<c)f=B(t,N.key),l(f)?(n.push({ad:m[f],zd:N}),m[f]=null):(s[N.key]=h.length,h.push(N)),f=!0;else{c=b.J(N.key);if(c=ef(a,c,J.value,
N.value))r.push(N),f=!0;J.value.m()!==N.value.m()&&(n.push({ad:J,zd:N}),f=!0);J=ib(w)}N=ib(aa)}if(!g&&f)return!0}for(g=0;g<m.length;g++)if(s=m[g])c=b.J(s.key),ef(a,c,s.value,Q),e.push(new X("child_removed",s.value,s.key));for(g=0;g<h.length;g++)if(s=h[g])c=b.J(s.key),m=d.ha(s.key,s.value),ef(a,c,Q,s.value),e.push(new X("child_added",s.value,s.key,m));for(g=0;g<n.length;g++)s=n[g].ad,h=n[g].zd,c=b.J(h.key),m=d.ha(h.key,h.value),e.push(new X("child_moved",h.value,h.key,m)),(c=ef(a,c,s.value,h.value))&&
r.push(h);for(g=0;g<r.length;g++)a=r[g],m=d.ha(a.key,a.value),e.push(new X("child_changed",a.value,a.key,m));return f};function gf(){this.Z=this.Aa=null;this.set={}}oa(gf,fd);k=gf.prototype;k.setActive=function(a){this.Aa=a};function hf(a,b,c){a.add(b,c);a.Z||(a.Z=c.S.path)}function jf(a){var b=a.Aa;a.Aa=null;return b}function kf(a){return a.contains("default")}function lf(a){return null!=a.Aa&&kf(a)}k.defaultView=function(){return kf(this)?this.get("default"):null};k.path=function(){return this.Z};k.toString=function(){return Hb(this.keys(),function(a){return"default"===a?"{}":a}).join("$")};
k.rb=function(){var a=[];gd(this,function(b,c){a.push(c.S)});return a};function mf(a,b){Xe.call(this,a);this.j=Q;this.Bc(b,Ze(b))}oa(mf,Xe);
mf.prototype.Bc=function(a,b){if(null===b)return b;var c=[],d=this.S;l(d.fa)&&(l(d.za)&&null!=d.za?c.push(function(a,b){var c=jc(b,d.fa);return 0<c||0===c&&0<=kc(a,d.za)}):c.push(function(a,b){return 0<=jc(b,d.fa)}));l(d.Ea)&&(l(d.fb)?c.push(function(a,b){var c=jc(b,d.Ea);return 0>c||0===c&&0>=kc(a,d.fb)}):c.push(function(a,b){return 0>=jc(b,d.Ea)}));var e=null,f=null;if(l(this.S.Ga))if(l(this.S.fa)){if(e=nf(a,c,this.S.Ga,!1)){var g=a.P(e).m();c.push(function(a,b){var c=jc(b,g);return 0>c||0===c&&
0>=kc(a,e)})}}else if(f=nf(a,c,this.S.Ga,!0)){var h=a.P(f).m();c.push(function(a,b){var c=jc(b,h);return 0<c||0===c&&0<=kc(a,f)})}for(var m=[],n=[],r=[],s=[],t=0;t<b.length;t++){var w=b[t].da,aa=b[t].xa;switch(b[t].type){case "child_added":of(c,w,aa)&&(this.j=this.j.K(w,aa),n.push(b[t]));break;case "child_removed":this.j.P(w).f()||(this.j=this.j.K(w,null),m.push(b[t]));break;case "child_changed":!this.j.P(w).f()&&of(c,w,aa)&&(this.j=this.j.K(w,aa),s.push(b[t]));break;case "child_moved":var J=!this.j.P(w).f(),
N=of(c,w,aa);J?N?(this.j=this.j.K(w,aa),r.push(b[t])):(m.push(new X("child_removed",this.j.P(w),w)),this.j=this.j.K(w,null)):N&&(this.j=this.j.K(w,aa),n.push(b[t]))}}var Bd=e||f;if(Bd){var Cd=(t=null!==f)?this.j.Jd():this.j.Kd(),Oc=!1,ub=!1,vb=this;(t?a.$c:a.B).call(a,function(a,b){ub||null!==Cd||(ub=!0);if(ub&&Oc)return!0;Oc?(m.push(new X("child_removed",vb.j.P(a),a)),vb.j=vb.j.K(a,null)):ub&&(n.push(new X("child_added",b,a)),vb.j=vb.j.K(a,b));Cd===a&&(ub=!0);a===Bd&&(Oc=!0)})}for(t=0;t<n.length;t++)c=
n[t],w=this.j.ha(c.da,c.xa),m.push(new X("child_added",c.xa,c.da,w));for(t=0;t<r.length;t++)c=r[t],w=this.j.ha(c.da,c.xa),m.push(new X("child_moved",c.xa,c.da,w));for(t=0;t<s.length;t++)c=s[t],w=this.j.ha(c.da,c.xa),m.push(new X("child_changed",c.xa,c.da,w));this.Hb&&0<m.length&&m.push(new X("value",this.j));return m};function nf(a,b,c,d){if(a.Q())return null;var e=null;(d?a.$c:a.B).call(a,function(a,d){if(of(b,a,d)&&(e=a,c--,0===c))return!0});return e}
function of(a,b,c){for(var d=0;d<a.length;d++)if(!a[d](b,c.m()))return!1;return!0}mf.prototype.ed=function(a){return this.j.P(a)!==Q};
mf.prototype.Fb=function(a,b,c){var d={};this.j.Q()||this.j.B(function(a){d[a]=3});var e=this.j;c=U(c,new H(""));var f=new Ya;Za(I(f,this.S.path),!0);b=Q.Ba(a,b);var g=this;df(c,b,a,f,function(a,b,c){null!==c&&a.toString()===g.S.path.toString()&&g.Bc(b,c)});this.j.Q()?pc(d,function(a,b){d[b]=2}):(this.j.B(function(a){A(d,a)||(d[a]=1)}),pc(d,function(a,b){g.j.P(b).f()&&(d[b]=2)}));this.j=e;return d};function pf(a,b){this.n=a;this.g=b;this.rc=b.ba;this.pa=new Ya}pf.prototype.ec=function(a,b,c,d,e){var f=a.path,g=I(this.pa,f),h=g.k();null===h?(h=new gf,Za(g,h)):v(!h.f(),"We shouldn't be storing empty QueryMaps");var m=a.Wa();if(h.contains(m))a=h.get(m),Ye(a,b,c,d,e);else{var n=this.g.ba.N(f);a=qf(a,n);rf(this,g,h,m,a);Ye(a,b,c,d,e);(b=(b=bb(I(this.pa,f),function(a){var b;if(b=a.k()&&a.k().defaultView())b=a.k().defaultView().Hb;if(b)return!0},!0))||null===this.n&&!U(this.g,f).f())&&af(a)}a.Vb()};
function sf(a,b,c,d,e){var f=a.get(b),g;if(g=f){g=!1;for(var h=f.sa.length-1;0<=h;h--){var m=f.sa[h];if(!(c&&m.type!==c||d&&m.ca!==d||e&&m.$!==e)&&(f.sa.splice(h,1),g=!0,c&&d))break}}(c=g&&!(0<f.sa.length))&&a.remove(b);return c}function tf(a,b,c,d,e){b=b?b.Wa():null;var f=[];b&&"default"!==b?sf(a,b,c,d,e)&&f.push(b):Fb(a.keys(),function(b){sf(a,b,c,d,e)&&f.push(b)});return f}pf.prototype.Dc=function(a,b,c,d){var e=I(this.pa,a.path).k();return null===e?null:uf(this,e,a,b,c,d)};
function uf(a,b,c,d,e,f){var g=b.path(),g=I(a.pa,g);c=tf(b,c,d,e,f);b.f()&&Za(g,null);d=vf(g);if(0<c.length&&!d){d=g;e=g.parent();for(c=!1;!c&&e;){if(f=e.k()){v(!lf(f));var h=d.name(),m=!1;gd(f,function(a,b){m=b.ed(h)||m});m&&(c=!0)}d=e;e=e.parent()}d=null;lf(b)||(b=jf(b),d=wf(a,g),b&&b());return c?null:d}return null}function xf(a,b,c){ab(I(a.pa,b),function(a){(a=a.k())&&gd(a,function(a,b){af(b)})},c,!0)}
function yf(a,b,c){function d(a){do{if(g[a.toString()])return!0;a=a.parent()}while(null!==a);return!1}var e=a.rc,f=a.g.ba;a.rc=f;for(var g={},h=0;h<c.length;h++)g[c[h].toString()]=!0;df(e,f,b,a.pa,function(c,e,f){if(b.contains(c)){var g=d(c);g&&xf(a,c,!1);a.Ac(c,e,f);g&&xf(a,c,!0)}else a.Ac(c,e,f)});d(b)&&xf(a,b,!0);zf(a,b)}function zf(a,b){var c=I(a.pa,b);ab(c,function(a){(a=a.k())&&gd(a,function(a,b){b.Vb()})},!0,!0);bb(c,function(a){(a=a.k())&&gd(a,function(a,b){b.Vb()})},!1)}
pf.prototype.Ac=function(a,b,c){a=I(this.pa,a).k();null!==a&&gd(a,function(a,e){e.Ac(b,c)})};function vf(a){return bb(a,function(a){return a.k()&&lf(a.k())})}function rf(a,b,c,d,e){if(lf(c)||vf(b))hf(c,d,e);else{var f,g;c.f()||(f=c.toString(),g=c.rb());hf(c,d,e);c.setActive(Af(a,c));f&&g&&Sd(a.n,c.path(),f,g)}lf(c)&&ab(b,function(a){if(a=a.k())a.Aa&&a.Aa(),a.Aa=null})}
function wf(a,b){function c(b){var f=b.k();if(f&&kf(f))d.push(f.path()),null==f.Aa&&f.setActive(Af(a,f));else{if(f){null!=f.Aa||f.setActive(Af(a,f));var g={};gd(f,function(a,b){b.j.B(function(a){A(g,a)||(g[a]=!0,a=f.path().J(a),d.push(a))})})}b.B(c)}}var d=[];c(b);return d}
function Af(a,b){if(a.n){var c=a.n,d=b.path(),e=b.toString(),f=b.rb(),g,h=b.keys(),m=kf(b);Od(a.n,b,function(c){"ok"!==c?(c=sc(c),O("on() or once() for "+b.path().toString()+" failed: "+c.toString()),Bf(a,b,c)):g||(m?xf(a,b.path(),!0):Fb(h,function(a){(a=b.get(a))&&af(a)}),zf(a,b.path()))});return function(){g=!0;Sd(c,d,e,f)}}return ca}function Bf(a,b,c){b&&(gd(b,function(a,b){for(var f=0;f<b.sa.length;f++){var g=b.sa[f];g.cancel&&qc(g.cancel,g.$)(c)}}),uf(a,b))}
function qf(a,b){return"default"===a.Wa()?new bf(a,b):new mf(a,b)}pf.prototype.Fb=function(a,b,c,d){function e(a){pc(a,function(a,b){f[b]=3===a?3:(B(f,b)||a)===a?a:3})}var f={};gd(b,function(b,f){e(f.Fb(a,c,d))});c.Q()||c.B(function(a){A(f,a)||(f[a]=4)});return f};function Cf(a,b,c,d,e){var f=b.path();b=a.Fb(f,b,d,e);var g=Q,h=[];pc(b,function(b,n){var r=new H(n);3===b||1===b?g=g.K(n,d.N(r)):(2===b&&h.push({path:f.J(n),ua:Q}),h=h.concat(Df(a,d.N(r),I(c,r),e)))});return[{path:f,ua:g}].concat(h)}
function Ef(a,b,c,d){var e;a:{var f=I(a.pa,b);e=f.parent();for(var g=[];null!==e;){var h=e.k();if(null!==h){if(kf(h)){e=[{path:b,ua:c}];break a}h=a.Fb(b,h,c,d);f=B(h,f.name());if(3===f||1===f){e=[{path:b,ua:c}];break a}2===f&&g.push({path:b,ua:Q})}f=e;e=e.parent()}e=g}if(1==e.length&&(!e[0].ua.f()||c.f()))return e;g=I(a.pa,b);f=g.k();null!==f?kf(f)?e.push({path:b,ua:c}):e=e.concat(Cf(a,f,g,c,d)):e=e.concat(Df(a,c,g,d));return e}
function Df(a,b,c,d){var e=c.k();if(null!==e)return kf(e)?[{path:c.path(),ua:b}]:Cf(a,e,c,b,d);var f=[];c.B(function(c){var e=b.Q()?Q:b.P(c.name());c=Df(a,e,c,d);f=f.concat(c)});return f};function Ff(a){this.D=a;this.ga=Wc(a);this.n=new Kd(this.D,q(this.uc,this),q(this.sc,this),q(this.nd,this),q(this.dd,this));this.be=Xc(a,q(function(){return new Tc(this.ga,this.n)},this));this.$a=new Ya;this.Ja=new ee;this.g=new fe;this.L=new pf(this.n,this.g.qa);this.fd=new ee;this.gd=new pf(null,this.fd);Gf(this,"connected",!1);this.U=new be;this.I=new He(a,q(this.n.I,this.n),q(this.n.Bd,this.n),q(this.jd,this));this.ic=0}k=Ff.prototype;
k.toString=function(){return(this.D.Ya?"https://":"http://")+this.D.host};k.name=function(){return this.D.Sa};function Hf(a){a=U(a.fd,new H(".info/serverTimeOffset")).X()||0;return(new Date).getTime()+a}function If(a){a=a={timestamp:Hf(a)};a.timestamp=a.timestamp||(new Date).getTime();return a}
k.uc=function(a,b,c){this.ic++;this.Md&&(b=this.Md(a,b));var d,e,f=[];9<=a.length&&a.lastIndexOf(".priority")===a.length-9?(d=new H(a.substring(0,a.length-9)),e=U(this.g.wa,d).Ka(b),f.push(d)):c?(d=new H(a),e=U(this.g.wa,d),pc(b,function(a,b){var c=new H(b);".priority"===b?e=e.Ka(a):(e=e.Ba(c,S(a)),f.push(d.J(b)))})):(d=new H(a),e=S(b),f.push(d));a=Ef(this.L,d,e,this.g.O);b=!1;for(c=0;c<a.length;++c){var g=a[c];b=ge(this.g,g.path,g.ua)||b}b&&(d=Jf(this,d));yf(this.L,d,f)};
k.sc=function(a){Gf(this,"connected",a);!1===a&&Kf(this)};k.nd=function(a){var b=this;oc(a,function(a,d){Gf(b,d,a)})};k.dd=function(a){a=new H(a);return U(this.g.wa,a).hash()};k.jd=function(a){Gf(this,"authenticated",a)};function Gf(a,b,c){b=new H("/.info/"+b);V(a.fd,b,S(c));yf(a.gd,b,[b])}
k.xb=function(a,b,c,d){this.e("set",{path:a.toString(),value:b,la:c});var e=If(this);b=S(b,c);var e=me(b,e),e=Ef(this.L,a,e,this.g.O),f=this.g.set(a,e),g=this;this.n.put(a.toString(),b.X(!0),function(b,c){"ok"!==b&&O("set at "+a+" failed: "+b);je(g.g,f);he(g.g,a);var e=Jf(g,a);yf(g.L,e,[]);Lf(d,b,c)});e=Mf(this,a);Jf(this,e);yf(this.L,e,[a])};
k.update=function(a,b,c){this.e("update",{path:a.toString(),value:b});var d=U(this.g.qa,a),e=!0,f=[],g=If(this),h=[],m;for(m in b){var e=!1,n=S(b[m]),n=me(n,g),d=d.K(m,n),r=a.J(m);f.push(r);n=Ef(this.L,r,n,this.g.O);h=h.concat(this.g.set(a,n))}if(e)M("update() called with empty data.  Don't do anything."),Lf(c,"ok");else{var s=this;Yd(this.n,a.toString(),b,function(b,d){"ok"!==b&&O("update at "+a+" failed: "+b);je(s.g,h);he(s.g,a);var e=Jf(s,a);yf(s.L,e,[]);Lf(c,b,d)});b=Mf(this,a);Jf(this,b);yf(s.L,
b,f)}};k.vd=function(a,b,c){this.e("setPriority",{path:a.toString(),la:b});var d=If(this),d=ke(b,d),d=U(this.g.O,a).Ka(d),d=Ef(this.L,a,d,this.g.O),e=this.g.set(a,d),f=this;this.n.put(a.toString()+"/.priority",b,function(b,d){"permission_denied"===b&&O("setPriority at "+a+" failed: "+b);je(f.g,e);he(f.g,a);var m=Jf(f,a);yf(f.L,m,[]);Lf(c,b,d)});b=Jf(this,a);yf(f.L,b,[])};
function Kf(a){a.e("onDisconnectEvents");var b=[],c=If(a);de(le(a.U,c),new H(""),function(c,e){var f=Ef(a.L,c,e,a.g.O);b.push.apply(b,a.g.set(c,f));f=Mf(a,c);Jf(a,f);yf(a.L,f,[c])});je(a.g,b);a.U=new be}k.ld=function(a,b){var c=this;this.n.ld(a.toString(),function(d,e){"ok"===d&&ce(c.U,a);Lf(b,d,e)})};function Nf(a,b,c,d){var e=S(c);Ud(a.n,b.toString(),e.X(!0),function(c,g){"ok"===c&&a.U.sb(b,e);Lf(d,c,g)})}
function Of(a,b,c,d,e){var f=S(c,d);Ud(a.n,b.toString(),f.X(!0),function(c,d){"ok"===c&&a.U.sb(b,f);Lf(e,c,d)})}function Pf(a,b,c,d){var e=!0,f;for(f in c)e=!1;e?(M("onDisconnect().update() called with empty data.  Don't do anything."),Lf(d,"ok")):Wd(a.n,b.toString(),c,function(e,f){if("ok"===e)for(var m in c){var n=S(c[m]);a.U.sb(b.J(m),n)}Lf(d,e,f)})}function Qf(a){Rc(a.ga,"deprecated_on_disconnect");a.be.yd.deprecated_on_disconnect=!0}
k.ec=function(a,b,c,d,e){".info"===D(a.path)?this.gd.ec(a,b,c,d,e):this.L.ec(a,b,c,d,e)};k.Dc=function(a,b,c,d){if(".info"===D(a.path))this.gd.Dc(a,b,c,d);else{b=this.L.Dc(a,b,c,d);if(c=null!==b){c=this.g;d=a.path;for(var e=[],f=0;f<b.length;++f)e[f]=U(c.wa,b[f]);V(c.wa,d,Q);for(f=0;f<b.length;++f)V(c.wa,b[f],e[f]);c=he(c,d)}c&&(v(this.g.qa.ba===this.L.rc,"We should have raised any outstanding events by now.  Else, we'll blow them away."),V(this.g.qa,a.path,U(this.g.O,a.path)),this.L.rc=this.g.qa.ba)}};
k.Pa=function(){this.n.Pa()};k.ub=function(){this.n.ub()};k.wd=function(a){if("undefined"!==typeof console){a?(this.Hc||(this.Hc=new Sc(this.ga)),a=this.Hc.get()):a=this.ga.get();var b=Ib(Kc(a),function(a,b){return Math.max(b.length,a)},0),c;for(c in a){for(var d=a[c],e=c.length;e<b+2;e++)c+=" ";console.log(c+d)}}};k.xd=function(a){Rc(this.ga,a);this.be.yd[a]=!0};k.e=function(){M("r:"+this.n.id+":",arguments)};
function Lf(a,b,c){a&&uc(function(){if("ok"==b)a(null,c);else{var d=(b||"error").toUpperCase(),e=d;c&&(e+=": "+c);e=Error(e);e.code=d;a(e)}})};function Rf(a,b,c,d,e){function f(){}a.e("transaction on "+b);var g=new G(a,b);g.Ta("value",f);c={path:b,update:c,G:d,status:null,Sd:Yb(),Rc:e,Xd:0,Oc:function(){g.nb("value",f)},Pc:null};a.Ja.ba=Sf(a,a.Ja.ba,a.g.O.ba,a.$a);d=c.update(U(a.Ja,b).X());if(l(d)){Ga("transaction failed: Data returned ",d);c.status=1;e=I(a.$a,b);var h=e.k()||[];h.push(c);Za(e,h);h="object"===typeof d&&null!==d&&A(d,".priority")?d[".priority"]:U(a.g.O,b).m();e=If(a);d=S(d,h);d=me(d,e);V(a.Ja,b,d);c.Rc&&(V(a.g.qa,b,d),yf(a.L,
b,[b]));Tf(a)}else c.Oc(),c.G&&(a=Uf(a,b),c.G(null,!1,a))}function Tf(a,b){var c=b||a.$a;b||Vf(a,c);if(null!==c.k()){var d=Wf(a,c);v(0<d.length);Jb(d,function(a){return 1===a.status})&&Xf(a,c.path(),d)}else c.Gb()&&c.B(function(b){Tf(a,b)})}
function Xf(a,b,c){for(var d=0;d<c.length;d++)v(1===c[d].status,"tryToSendTransactionQueue_: items in queue should all be run."),c[d].status=2,c[d].Xd++;var e=U(a.g.O,b).hash();V(a.g.O,b,U(a.g.qa,b));for(var f=U(a.Ja,b).X(!0),g=Yb(),h=Yf(c),d=0;d<h.length;d++)Za(I(a.g.Sb,h[d]),g);a.n.put(b.toString(),f,function(e){a.e("transaction put response",{path:b.toString(),status:e});for(d=0;d<h.length;d++){var f=I(a.g.Sb,h[d]),r=f.k();v(null!==r,"sendTransactionQueue_: pendingPut should not be null.");r===
g&&(Za(f,null),V(a.g.O,h[d],U(a.g.wa,h[d])))}if("ok"===e){e=[];for(d=0;d<c.length;d++)c[d].status=3,c[d].G&&(f=Uf(a,c[d].path),e.push(q(c[d].G,null,null,!0,f))),c[d].Oc();Vf(a,I(a.$a,b));Tf(a);for(d=0;d<e.length;d++)uc(e[d])}else{if("datastale"===e)for(d=0;d<c.length;d++)c[d].status=4===c[d].status?5:1;else for(O("transaction at "+b+" failed: "+e),d=0;d<c.length;d++)c[d].status=5,c[d].Pc=e;e=Jf(a,b);yf(a.L,e,[b])}},e)}
function Yf(a){for(var b={},c=0;c<a.length;c++)a[c].Rc&&(b[a[c].path.toString()]=a[c].path);a=[];for(var d in b)a.push(b[d]);return a}
function Jf(a,b){var c=Zf(a,b),d=c.path(),c=Wf(a,c);V(a.g.qa,d,U(a.g.O,d));V(a.Ja,d,U(a.g.O,d));if(0!==c.length){for(var e=U(a.g.qa,d),f=e,g=[],h=0;h<c.length;h++){var m=Wa(d,c[h].path),n=!1,r;v(null!==m,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===c[h].status)n=!0,r=c[h].Pc;else if(1===c[h].status)if(25<=c[h].Xd)n=!0,r="maxretry";else{var s=e.N(m),t=c[h].update(s.X());if(l(t)){Ga("transaction failed: Data returned ",t);var w=S(t);"object"===typeof t&&null!=t&&A(t,".priority")||
(w=w.Ka(s.m()));e=e.Ba(m,w);c[h].Rc&&(f=f.Ba(m,w))}else n=!0,r="nodata"}n&&(c[h].status=3,setTimeout(c[h].Oc,Math.floor(0)),c[h].G&&(n=new G(a,c[h].path),m=new T(e.N(m),n),"nodata"===r?g.push(q(c[h].G,null,null,!1,m)):g.push(q(c[h].G,null,Error(r),!1,m))))}V(a.Ja,d,e);V(a.g.qa,d,f);Vf(a,a.$a);for(h=0;h<g.length;h++)uc(g[h]);Tf(a)}return d}function Zf(a,b){for(var c,d=a.$a;null!==(c=D(b))&&null===d.k();)d=I(d,c),b=Ua(b);return d}
function Wf(a,b){var c=[];$f(a,b,c);c.sort(function(a,b){return a.Sd-b.Sd});return c}function $f(a,b,c){var d=b.k();if(null!==d)for(var e=0;e<d.length;e++)c.push(d[e]);b.B(function(b){$f(a,b,c)})}function Vf(a,b){var c=b.k();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;Za(b,0<c.length?c:null)}b.B(function(b){Vf(a,b)})}function Mf(a,b){var c=Zf(a,b).path(),d=I(a.$a,b);bb(d,function(a){ag(a)});ag(d);ab(d,function(a){ag(a)});return c}
function ag(a){var b=a.k();if(null!==b){for(var c=[],d=-1,e=0;e<b.length;e++)4!==b[e].status&&(2===b[e].status?(v(d===e-1,"All SENT items should be at beginning of queue."),d=e,b[e].status=4,b[e].Pc="set"):(v(1===b[e].status),b[e].Oc(),b[e].G&&c.push(q(b[e].G,null,Error("set"),!1,null))));-1===d?Za(a,null):b.length=d+1;for(e=0;e<c.length;e++)uc(c[e])}}function Uf(a,b){var c=new G(a,b);return new T(U(a.Ja,b),c)}
function Sf(a,b,c,d){if(d.f())return c;if(null!=d.k())return b;var e=c;d.B(function(d){var g=d.name(),h=new H(g);d=Sf(a,b.N(h),c.N(h),d);e=e.K(g,d)});return e};function Y(){this.tb={}}da(Y);Y.prototype.Pa=function(){for(var a in this.tb)this.tb[a].Pa()};Y.prototype.interrupt=Y.prototype.Pa;Y.prototype.ub=function(){for(var a in this.tb)this.tb[a].ub()};Y.prototype.resume=Y.prototype.ub;function bg(a){var b=this;this.Ab=a;this.Jc="*";ze()?this.Lb=this.lc=se():(this.Lb=window.opener,this.lc=window);if(!b.Lb)throw"Unable to find relay frame";te(this.lc,"message",q(this.ob,this));te(this.lc,"message",q(this.Pd,this));try{cg(this,{a:"ready"})}catch(c){te(this.Lb,"load",function(){cg(b,{a:"ready"})})}te(window,"unload",q(this.Ie,this))}function cg(a,b){b=u(b);ze()?a.Lb.doPost(b,a.Jc):a.Lb.postMessage(b,a.Jc)}
bg.prototype.ob=function(a){var b=this,c;try{c=va(a.data)}catch(d){}c&&"request"===c.a&&(ue(window,"message",this.ob),this.Jc=a.origin,this.Ab&&setTimeout(function(){b.Ab(b.Jc,c.d,function(a,c){b.oe=!c;b.Ab=void 0;cg(b,{a:"response",d:a,forceKeepWindowOpen:c})})},0))};bg.prototype.Ie=function(){try{ue(this.lc,"message",this.Pd)}catch(a){}this.Ab&&(cg(this,{a:"error",d:"unknown closed window"}),this.Ab=void 0);try{window.close()}catch(b){}};bg.prototype.Pd=function(a){if(this.oe&&"die"===a.data)try{window.close()}catch(b){}};var Z={xe:function(a){var b=R.prototype.hash;R.prototype.hash=a;var c=vc.prototype.hash;vc.prototype.hash=a;return function(){R.prototype.hash=b;vc.prototype.hash=c}}};Z.hijackHash=Z.xe;Z.Wa=function(a){return a.Wa()};Z.queryIdentifier=Z.Wa;Z.Ae=function(a){return a.i.n.ja};Z.listens=Z.Ae;Z.Me=function(a){return a.i.n.ma};Z.refConnection=Z.Me;Z.ee=Kd;Z.DataConnection=Z.ee;Kd.prototype.sendRequest=Kd.prototype.Ia;Kd.prototype.interrupt=Kd.prototype.Pa;Z.fe=td;Z.RealTimeConnection=Z.fe;
td.prototype.sendRequest=td.prototype.Zd;td.prototype.close=td.prototype.close;Z.de=yb;Z.ConnectionTarget=Z.de;Z.ue=function(){id=$c=!0};Z.forceLongPolling=Z.ue;Z.ve=function(){jd=!0};Z.forceWebSockets=Z.ve;Z.Te=function(a,b){a.i.n.ud=b};Z.setSecurityDebugCallback=Z.Te;Z.wd=function(a,b){a.i.wd(b)};Z.stats=Z.wd;Z.xd=function(a,b){a.i.xd(b)};Z.statsIncrementCounter=Z.xd;Z.ic=function(a){return a.i.ic};Z.dataUpdateCount=Z.ic;Z.ye=function(a,b){a.i.Md=b};Z.interceptServerData=Z.ye;Z.Fe=function(a){new bg(a)};
Z.onPopupOpen=Z.Fe;Z.Qe=function(a){ne=a};Z.setAuthenticationServer=Z.Qe;function $(a,b,c){this.Wb=a;this.Z=b;this.Ha=c}$.prototype.cancel=function(a){x("Firebase.onDisconnect().cancel",0,1,arguments.length);z("Firebase.onDisconnect().cancel",1,a,!0);this.Wb.ld(this.Z,a)};$.prototype.cancel=$.prototype.cancel;$.prototype.remove=function(a){x("Firebase.onDisconnect().remove",0,1,arguments.length);C("Firebase.onDisconnect().remove",this.Z);z("Firebase.onDisconnect().remove",1,a,!0);Nf(this.Wb,this.Z,null,a)};$.prototype.remove=$.prototype.remove;
$.prototype.set=function(a,b){x("Firebase.onDisconnect().set",1,2,arguments.length);C("Firebase.onDisconnect().set",this.Z);Fa("Firebase.onDisconnect().set",a,!1);z("Firebase.onDisconnect().set",2,b,!0);Nf(this.Wb,this.Z,a,b)};$.prototype.set=$.prototype.set;
$.prototype.xb=function(a,b,c){x("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);C("Firebase.onDisconnect().setWithPriority",this.Z);Fa("Firebase.onDisconnect().setWithPriority",a,!1);Ka("Firebase.onDisconnect().setWithPriority",2,b,!1);z("Firebase.onDisconnect().setWithPriority",3,c,!0);if(".length"===this.Ha||".keys"===this.Ha)throw"Firebase.onDisconnect().setWithPriority failed: "+this.Ha+" is a read-only object.";Of(this.Wb,this.Z,a,b,c)};$.prototype.setWithPriority=$.prototype.xb;
$.prototype.update=function(a,b){x("Firebase.onDisconnect().update",1,2,arguments.length);C("Firebase.onDisconnect().update",this.Z);if(fa(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;O("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Ja("Firebase.onDisconnect().update",a);z("Firebase.onDisconnect().update",2,b,!0);Pf(this.Wb,
this.Z,a,b)};$.prototype.update=$.prototype.update;var dg=function(){var a=0,b=[];return function(c){var d=c===a;a=c;for(var e=Array(8),f=7;0<=f;f--)e[f]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c%64),c=Math.floor(c/64);v(0===c,"Cannot push at time == 0");c=e.join("");if(d){for(f=11;0<=f&&63===b[f];f--)b[f]=0;b[f]++}else for(f=0;12>f;f++)b[f]=Math.floor(64*Math.random());for(f=0;12>f;f++)c+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);v(20===c.length,"NextPushId: Length should be 20.");
return c}}();function G(a,b){var c,d,e;if(a instanceof Ff)c=a,d=b;else{x("new Firebase",1,2,arguments.length);d=hc(arguments[0]);c=d.Ve;"firebase"===d.domain&&gc(d.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");c||gc("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");d.Ya||"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&O("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");
c=new yb(d.host,d.Ya,c,"ws"===d.scheme||"wss"===d.scheme);d=new H(d.pb);e=d.toString();var f;!(f=!p(c.host)||0===c.host.length||!Ea(c.Sa))&&(f=0!==e.length)&&(e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),f=!(p(e)&&0!==e.length&&!Da.test(e)));if(f)throw Error(y("new Firebase",1,!1)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');if(b)if(b instanceof Y)e=b;else if(p(b))e=Y.ib(),c.yc=b;else throw Error("Expected a valid Firebase.Context for second argument to new Firebase()");
else e=Y.ib();f=c.toString();var g=B(e.tb,f);g||(g=new Ff(c),e.tb[f]=g);c=g}F.call(this,c,d)}oa(G,F);na("Firebase",G);G.prototype.name=function(){x("Firebase.name",0,0,arguments.length);return this.path.f()?null:Va(this.path)};G.prototype.name=G.prototype.name;
G.prototype.J=function(a){x("Firebase.child",1,1,arguments.length);if(ha(a))a=String(a);else if(!(a instanceof H))if(null===D(this.path)){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));Na("Firebase.child",b)}else Na("Firebase.child",a);return new G(this.i,this.path.J(a))};G.prototype.child=G.prototype.J;G.prototype.parent=function(){x("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return null===a?null:new G(this.i,a)};G.prototype.parent=G.prototype.parent;
G.prototype.root=function(){x("Firebase.ref",0,0,arguments.length);for(var a=this;null!==a.parent();)a=a.parent();return a};G.prototype.root=G.prototype.root;G.prototype.toString=function(){x("Firebase.toString",0,0,arguments.length);var a;if(null===this.parent())a=this.i.toString();else{a=this.parent().toString()+"/";var b=this.name();a+=encodeURIComponent(String(b))}return a};G.prototype.toString=G.prototype.toString;
G.prototype.set=function(a,b){x("Firebase.set",1,2,arguments.length);C("Firebase.set",this.path);Fa("Firebase.set",a,!1);z("Firebase.set",2,b,!0);this.i.xb(this.path,a,null,b)};G.prototype.set=G.prototype.set;
G.prototype.update=function(a,b){x("Firebase.update",1,2,arguments.length);C("Firebase.update",this.path);if(fa(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;O("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Ja("Firebase.update",a);z("Firebase.update",2,b,!0);if(A(a,".priority"))throw Error("update() does not currently support updating .priority.");
this.i.update(this.path,a,b)};G.prototype.update=G.prototype.update;G.prototype.xb=function(a,b,c){x("Firebase.setWithPriority",2,3,arguments.length);C("Firebase.setWithPriority",this.path);Fa("Firebase.setWithPriority",a,!1);Ka("Firebase.setWithPriority",2,b,!1);z("Firebase.setWithPriority",3,c,!0);if(".length"===this.name()||".keys"===this.name())throw"Firebase.setWithPriority failed: "+this.name()+" is a read-only object.";this.i.xb(this.path,a,b,c)};G.prototype.setWithPriority=G.prototype.xb;
G.prototype.remove=function(a){x("Firebase.remove",0,1,arguments.length);C("Firebase.remove",this.path);z("Firebase.remove",1,a,!0);this.set(null,a)};G.prototype.remove=G.prototype.remove;
G.prototype.transaction=function(a,b,c){x("Firebase.transaction",1,3,arguments.length);C("Firebase.transaction",this.path);z("Firebase.transaction",1,a,!1);z("Firebase.transaction",2,b,!0);if(l(c)&&"boolean"!=typeof c)throw Error(y("Firebase.transaction",3,!0)+"must be a boolean.");if(".length"===this.name()||".keys"===this.name())throw"Firebase.transaction failed: "+this.name()+" is a read-only object.";"undefined"===typeof c&&(c=!0);Rf(this.i,this.path,a,b,c)};G.prototype.transaction=G.prototype.transaction;
G.prototype.vd=function(a,b){x("Firebase.setPriority",1,2,arguments.length);C("Firebase.setPriority",this.path);Ka("Firebase.setPriority",1,a,!1);z("Firebase.setPriority",2,b,!0);this.i.vd(this.path,a,b)};G.prototype.setPriority=G.prototype.vd;G.prototype.push=function(a,b){x("Firebase.push",0,2,arguments.length);C("Firebase.push",this.path);Fa("Firebase.push",a,!0);z("Firebase.push",2,b,!0);var c=Hf(this.i),c=dg(c),c=this.J(c);"undefined"!==typeof a&&null!==a&&c.set(a,b);return c};
G.prototype.push=G.prototype.push;G.prototype.ka=function(){return new $(this.i,this.path,this.name())};G.prototype.onDisconnect=G.prototype.ka;G.prototype.Ne=function(){O("FirebaseRef.removeOnDisconnect() being deprecated. Please use FirebaseRef.onDisconnect().remove() instead.");this.ka().remove();Qf(this.i)};G.prototype.removeOnDisconnect=G.prototype.Ne;
G.prototype.Se=function(a){O("FirebaseRef.setOnDisconnect(value) being deprecated. Please use FirebaseRef.onDisconnect().set(value) instead.");this.ka().set(a);Qf(this.i)};G.prototype.setOnDisconnect=G.prototype.Se;G.prototype.I=function(a,b,c){O("FirebaseRef.auth() being deprecated. Please use FirebaseRef.authWithCustomToken() instead.");x("Firebase.auth",1,3,arguments.length);Oa("Firebase.auth",a);z("Firebase.auth",2,b,!0);z("Firebase.auth",3,b,!0);Ne(this.i.I,a,{},{remember:"none"},b,c)};
G.prototype.auth=G.prototype.I;G.prototype.Bd=function(a){x("Firebase.unauth",0,1,arguments.length);z("Firebase.unauth",1,a,!0);Oe(this.i.I,a)};G.prototype.unauth=G.prototype.Bd;G.prototype.bd=function(){x("Firebase.getAuth",0,0,arguments.length);return this.i.I.bd()};G.prototype.getAuth=G.prototype.bd;G.prototype.Ee=function(a,b){x("Firebase.onAuth",1,2,arguments.length);z("Firebase.onAuth",1,a,!1);za("Firebase.onAuth",2,b);this.i.I.Ta("auth_status",a,b)};G.prototype.onAuth=G.prototype.Ee;
G.prototype.De=function(a,b){x("Firebase.offAuth",1,2,arguments.length);z("Firebase.offAuth",1,a,!1);za("Firebase.offAuth",2,b);this.i.I.nb("auth_status",a,b)};G.prototype.offAuth=G.prototype.De;G.prototype.je=function(a,b,c){x("Firebase.authWithCustomToken",2,3,arguments.length);Oa("Firebase.authWithCustomToken",a);z("Firebase.authWithCustomToken",2,b,!1);E("Firebase.authWithCustomToken",3,c,!0);Ne(this.i.I,a,{},c||{},b)};G.prototype.authWithCustomToken=G.prototype.je;
G.prototype.ke=function(a,b,c){x("Firebase.authWithOAuthPopup",2,3,arguments.length);Pa("Firebase.authWithOAuthPopup",1,a);z("Firebase.authWithOAuthPopup",2,b,!1);E("Firebase.authWithOAuthPopup",3,c,!0);Se(this.i.I,a,c,b)};G.prototype.authWithOAuthPopup=G.prototype.ke;
G.prototype.le=function(a,b,c){x("Firebase.authWithOAuthRedirect",2,3,arguments.length);Pa("Firebase.authWithOAuthRedirect",1,a);z("Firebase.authWithOAuthRedirect",2,b,!1);E("Firebase.authWithOAuthRedirect",3,c,!0);var d=this.i.I;Qe(d);var e=[Ge],f=qe(c);"anonymous"===a||"firebase"===a?P(b,W("TRANSPORT_UNAVAILABLE")):(K.set("redirect_client_options",f.hc),Re(d,e,"/auth/"+a,f,b))};G.prototype.authWithOAuthRedirect=G.prototype.le;
G.prototype.me=function(a,b,c,d){x("Firebase.authWithOAuthToken",3,4,arguments.length);Pa("Firebase.authWithOAuthToken",1,a);z("Firebase.authWithOAuthToken",3,c,!1);E("Firebase.authWithOAuthToken",4,d,!0);p(b)?(Pa("Firebase.authWithOAuthToken",2,b),Pe(this.i.I,a+"/token",{access_token:b},c)):(E("Firebase.authWithOAuthToken",2,b,!1),Pe(this.i.I,a+"/token",b,c))};G.prototype.authWithOAuthToken=G.prototype.me;
G.prototype.ie=function(a,b){x("Firebase.authAnonymously",1,2,arguments.length);z("Firebase.authAnonymously",1,a,!1);E("Firebase.authAnonymously",2,b,!0);Pe(this.i.I,"anonymous",{},a)};G.prototype.authAnonymously=G.prototype.ie;
G.prototype.ne=function(a,b,c){x("Firebase.authWithPassword",2,3,arguments.length);E("Firebase.authWithPassword",1,a,!1);Qa("Firebase.authWithPassword",a,"email");Qa("Firebase.authWithPassword",a,"password");z("Firebase.authAnonymously",2,b,!1);E("Firebase.authAnonymously",3,c,!0);Pe(this.i.I,"password",a,b)};G.prototype.authWithPassword=G.prototype.ne;
G.prototype.Xc=function(a,b){x("Firebase.createUser",2,2,arguments.length);E("Firebase.createUser",1,a,!1);Qa("Firebase.createUser",a,"email");Qa("Firebase.createUser",a,"password");z("Firebase.createUser",2,b,!1);this.i.I.Xc(a,b)};G.prototype.createUser=G.prototype.Xc;G.prototype.sd=function(a,b){x("Firebase.removeUser",2,2,arguments.length);E("Firebase.removeUser",1,a,!1);Qa("Firebase.removeUser",a,"email");Qa("Firebase.removeUser",a,"password");z("Firebase.removeUser",2,b,!1);this.i.I.sd(a,b)};
G.prototype.removeUser=G.prototype.sd;G.prototype.Tc=function(a,b){x("Firebase.changePassword",2,2,arguments.length);E("Firebase.changePassword",1,a,!1);Qa("Firebase.changePassword",a,"email");Qa("Firebase.changePassword",a,"oldPassword");Qa("Firebase.changePassword",a,"newPassword");z("Firebase.changePassword",2,b,!1);this.i.I.Tc(a,b)};G.prototype.changePassword=G.prototype.Tc;
G.prototype.td=function(a,b){x("Firebase.resetPassword",2,2,arguments.length);E("Firebase.resetPassword",1,a,!1);Qa("Firebase.resetPassword",a,"email");z("Firebase.resetPassword",2,b,!1);this.i.I.td(a,b)};G.prototype.resetPassword=G.prototype.td;G.goOffline=function(){x("Firebase.goOffline",0,0,arguments.length);Y.ib().Pa()};G.goOnline=function(){x("Firebase.goOnline",0,0,arguments.length);Y.ib().ub()};
function dc(a,b){v(!b||!0===a||!1===a,"Can't turn on custom loggers persistently.");!0===a?("undefined"!==typeof console&&("function"===typeof console.log?bc=q(console.log,console):"object"===typeof console.log&&(bc=function(a){console.log(a)})),b&&K.set("logging_enabled",!0)):a?bc=a:(bc=null,K.remove("logging_enabled"))}G.enableLogging=dc;G.ServerValue={TIMESTAMP:{".sv":"timestamp"}};G.SDK_VERSION="1.1.0";G.INTERNAL=Z;G.Context=Y;})();
;

  /*
    note: switching between Array and Object datatypes will mess up 
    live firebase-element elements
  */
  Polymer('firebase-element', {
    publish: {
      /**
       * Fired when properties on `data` are added, removed, or modified.
       *
       * @event data-change
       */

      /**
       * Firebase location mapped to `data`.
       * @attribute location
       * @type String
       */
      location: null,
      /**
       * Firebase `ref` object corresponding to `location`.
       * @attribute ref
       * @type Object
       */
      ref: null,
      /**
       * Restricts the number of records reflected on the client.
       * @attribute limit
       * @type Number
       */
      limit: 0,
      /**
       * Specify a starting record for the set of records reflected on the client.
       * @attribute start
       * @type Any
       */
      start: null,
      /**
       * Specify an ending record for the set of records reflected on the client.
       * @attribute end
       * @type Any
       */
      end: null,
      /**
       * The `data` object mapped to `location`.
       * @attribute data
       * @type Object
       */
      data: null,
      /**
       * All keys in data (array of names, if you think of data as a set of name/value pairs).
       * @attribute keys
       * @type Array
       */
      keys: null,
      /**
       * If true, will fire `child-added`, `child-removed`, `child-changed` events.
       * @attribute childEvents
       * @type Boolean
       */
      childEvents: false,
      /**
       * When set, data will be stored with the given Firebase priority level.
       * @attribute priority
       * @type Number
       */
      priority: null,
      /**
       * Reflects whether the data at this locaation as been read at least once
       * @attribute initialized
       * @type Boolean
       */
      dataReady: false,
      /**
       * If true, will log various occurances to the console api.
       * @attribute log
       * @type Boolean
       */
      log: false
    },
    observe: {
      'ref limit start end': 'requery'
    },
    locationChanged: function() {
      // shut-down previous observers (if any)
      this.closeQuery();
      this.closeObserver();
      // connect to db
      if (this.location) {
        this.ref = new Firebase(this.location);
      } else {
        this.ref = null;
      }
    },
    requery: function() {
      // shut-down previous observers (if any)
      this.closeQuery();
      this.closeObserver();
      // construct new query
      var query = this.ref;
      if (query) {
        if (this.start) {
          query = query.startAt(this.start);
        }
        if (this.end) {
          query = query.endAt(this.end);
        }
        if (this.limit > 0) {
          query = query.limit(this.limit);
        }
        this.query = query;
      }
    },
    queryChanged: function() {
      // initialize
      this._setData(null);
      // data acquisition
      this.dataReady = false;
      this.valueLoading = true;
      this.query.once('value', this.valueLoaded, this);
      // observe server-side data
      this.observeQuery();
    },
    valueLoaded: function(snapshot) {
      this.valueLoading = false;
      if (this.ref.name() !== snapshot.name()) {
        this.log && console.warn('squelching stale response [%s]', snapshot.name());
        return;
      }
      this.log && console.log('acquired value ' + this.location);
      this.dataReady = true;
      this._setData(snapshot.val());
      if (this.data) {
        this.dataChange();
      }
    },
    _setData: function(data) {
      this.closeObserver();
      this.data = this._data = data;
      this.observeData();
    },
    //
    // server-side data-observation
    //
    observeQuery: function() {
      // server side dynamics
      this.query.on('child_added', this.childAdded, this);
      this.query.on('child_changed', this.childChanged, this);
      this.query.on('child_removed', this.childRemoved, this);
    },
    closeQuery: function() {
      if (this.query) {
        this.query.off();
      }
    },
    //
    // client-side data-observation
    //
    observeData: function() {
      if (this.data instanceof Array) {
        this.observer = new ArrayObserver(this.data);
        this.observer.open(this.observeArray.bind(this));
      } else if (this.data instanceof Object) {
        this.observer = new ObjectObserver(this.data);
        this.observer.open(this.observeObject.bind(this));
      }
    },
    closeObserver: function() {
      if (this.observer) {
        this.observer.close();
        this.observer = null;
      }
    },
    dataChanged: function() {
      if (this._data !== this.data) {
        this._setData(this.data);
        this.commit();
      }
    },
    priorityChanged: function() {
      if (this.ref && (this.priority != null)) {
        this.ref.setPriority(this.priority);
      }
    },
    discardObservations: function() {
      if (this.observer) {
        this.observer.discardChanges();
      }
    },
    deliverObservations: function() {
      if (this.observer) {
        this.observer.deliver();
      }
    },
    //
    // server-side effects
    //
    childAdded: function(snapshot) {
      if (this.data) {
        // ignore initial adds, we'll take the 'value' instead
        this.modulateData('updateData', snapshot);
      } else if (!this.valueLoading) {
        // if children are added to a previously null location, grab the whole value in one go
        this.valueLoading = true;
        this.query.once('value', this.valueLoaded, this);
      }
      this.childEvent('child-added', snapshot);
    },
    childChanged: function(snapshot) {
      if (!this.valueLoading) {
        this.modulateData('updateData', snapshot);
      }
      this.childEvent('child-changed', snapshot);
    },
    childRemoved: function(snapshot) {
      if (!this.valueLoading) {
        this.modulateData('removeData', snapshot);
      }
      this.childEvent('child-removed', snapshot);
    },
    childEvent: function(kind, snapshot) {
      this.log && console.log(kind, snapshot.name());
      if (this.childEvents) {
        this.fire(kind, {name: snapshot.name(), value: snapshot.val()});
      }
    },
    modulateData: function(operation, snapshot) {
      // handle any pending observations
      this.deliverObservations();
      this[operation](snapshot);
      this.dataChange();
      // discard any observations so we don't send this value back to the
      // server, it may already be stale from the server's perspective
      this.discardObservations();      
    },
    updateData: function(snapshot) {
      if (!this.data) {
        this.data = {};
      }
      this.data[snapshot.name()] = snapshot.val();
    },
    removeData: function(snapshot) {
      var key = snapshot.name();
      if (this.data instanceof Array) {
        this.data.splice(key, 1);
        if (data.length == 0) {
          this._setData(null);
        }
      } else if (this.data) {
        delete this.data[key];
        if (Object.keys(this.data).length === 0) {
          this._setData(null);
        }
      }
    },
    dataChange: function() {
      //this.job('change', function() {
        if (this.data) {
          this.keys = this.data ? Object.keys(this.data) : [];
        }
        this.fire('data-change');
      //});
    },
    //
    // client-side effects
    //
    observeArray: function(splices) {
      //console.warn('observeArray');
      // TODO(sjmiles): arrays are nasty because simple insertions/deletions
      // cause changes to ripple through keys
      this.commit();
    },
    observeObject: function(added, removed, changed, getOldValueFn) {
      // client-side dynamics
      var ctrlr = this;
      Object.keys(added).forEach(function(property) {
        ctrlr.commitProperty(property);
      });
      Object.keys(removed).forEach(function(property) {
        ctrlr.remove(property);
      });
      Object.keys(changed).forEach(function(property) {
        ctrlr.commitProperty(property);
      });
    },
    // api for manual commits
    commitProperty: function(key) {
      this.log && console.log('commitProperty ' + key);
      if (this.ref) {
        this.ref.child(key).set(this.data[key]);
      }
    },
    remove: function(key) {
      this.ref.child(key).remove();
    },
    commit: function() {
      this.log && console.log('commit');
      if (this.ref) {
        if (this.priority != null) {
          this.ref.setWithPriority(this.data || {}, this.priority);
        } else {
          this.ref.set(this.data || {});
        }
      }
    },
    push: function(item) {
      var neo;
      if (this.data instanceof Array) {
        this.ref.commitProperty(this.data.push(item)-1);
      } else {
        neo = this.ref.push(item);
      }
      this.dataChange();
      return neo;
    }
  });
;
(function() {var COMPILED=!0,goog=goog||{};goog.global=this;goog.exportPath_=function(a,d,e){a=a.split(".");e=e||goog.global;a[0]in e||!e.execScript||e.execScript("var "+a[0]);for(var f;a.length&&(f=a.shift());)a.length||void 0===d?e=e[f]?e[f]:e[f]={}:e[f]=d};goog.define=function(a,d){var e=d;COMPILED||goog.global.CLOSURE_DEFINES&&Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES,a)&&(e=goog.global.CLOSURE_DEFINES[a]);goog.exportPath_(a,e)};goog.DEBUG=!0;goog.LOCALE="en";goog.TRUSTED_SITE=!0;
goog.provide=function(a){if(!COMPILED){if(goog.isProvided_(a))throw Error('Namespace "'+a+'" already declared.');delete goog.implicitNamespaces_[a];for(var d=a;(d=d.substring(0,d.lastIndexOf(".")))&&!goog.getObjectByName(d);)goog.implicitNamespaces_[d]=!0}goog.exportPath_(a)};goog.setTestOnly=function(a){if(COMPILED&&!goog.DEBUG)throw a=a||"",Error("Importing test-only code into non-debug environment"+a?": "+a:".");};goog.forwardDeclare=function(a){};
COMPILED||(goog.isProvided_=function(a){return!goog.implicitNamespaces_[a]&&goog.isDefAndNotNull(goog.getObjectByName(a))},goog.implicitNamespaces_={});goog.getObjectByName=function(a,d){for(var e=a.split("."),f=d||goog.global,g;g=e.shift();)if(goog.isDefAndNotNull(f[g]))f=f[g];else return null;return f};goog.globalize=function(a,d){var e=d||goog.global,f;for(f in a)e[f]=a[f]};
goog.addDependency=function(a,d,e){if(goog.DEPENDENCIES_ENABLED){var f;a=a.replace(/\\/g,"/");for(var g=goog.dependencies_,h=0;f=d[h];h++)g.nameToPath[f]=a,a in g.pathToNames||(g.pathToNames[a]={}),g.pathToNames[a][f]=!0;for(f=0;d=e[f];f++)a in g.requires||(g.requires[a]={}),g.requires[a][d]=!0}};goog.ENABLE_DEBUG_LOADER=!0;
goog.require=function(a){if(!COMPILED&&!goog.isProvided_(a)){if(goog.ENABLE_DEBUG_LOADER){var d=goog.getPathFromDeps_(a);if(d){goog.included_[d]=!0;goog.writeScripts_();return}}a="goog.require could not find: "+a;goog.global.console&&goog.global.console.error(a);throw Error(a);}};goog.basePath="";goog.nullFunction=function(){};goog.identityFunction=function(a,d){return a};goog.abstractMethod=function(){throw Error("unimplemented abstract method");};
goog.addSingletonGetter=function(a){a.getInstance=function(){if(a.instance_)return a.instance_;goog.DEBUG&&(goog.instantiatedSingletons_[goog.instantiatedSingletons_.length]=a);return a.instance_=new a}};goog.instantiatedSingletons_=[];goog.DEPENDENCIES_ENABLED=!COMPILED&&goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED&&(goog.included_={},goog.dependencies_={pathToNames:{},nameToPath:{},requires:{},visited:{},written:{}},goog.inHtmlDocument_=function(){var a=goog.global.document;return"undefined"!=typeof a&&"write"in a},goog.findBasePath_=function(){if(goog.global.CLOSURE_BASE_PATH)goog.basePath=goog.global.CLOSURE_BASE_PATH;else if(goog.inHtmlDocument_())for(var a=goog.global.document.getElementsByTagName("script"),d=a.length-1;0<=d;--d){var e=a[d].src,f=e.lastIndexOf("?"),f=-1==f?e.length:
f;if("base.js"==e.substr(f-7,7)){goog.basePath=e.substr(0,f-7);break}}},goog.importScript_=function(a){var d=goog.global.CLOSURE_IMPORT_SCRIPT||goog.writeScriptTag_;!goog.dependencies_.written[a]&&d(a)&&(goog.dependencies_.written[a]=!0)},goog.writeScriptTag_=function(a){if(goog.inHtmlDocument_()){var d=goog.global.document;if("complete"==d.readyState){if(/\bdeps.js$/.test(a))return!1;throw Error('Cannot write "'+a+'" after document load');}d.write('<script type="text/javascript" src="'+a+'">\x3c/script>');
return!0}return!1},goog.writeScripts_=function(){function a(g){if(!(g in f.written)){if(!(g in f.visited)&&(f.visited[g]=!0,g in f.requires))for(var k in f.requires[g])if(!goog.isProvided_(k))if(k in f.nameToPath)a(f.nameToPath[k]);else throw Error("Undefined nameToPath for "+k);g in e||(e[g]=!0,d.push(g))}}var d=[],e={},f=goog.dependencies_,g;for(g in goog.included_)f.written[g]||a(g);for(g=0;g<d.length;g++)if(d[g])goog.importScript_(goog.basePath+d[g]);else throw Error("Undefined script input");
},goog.getPathFromDeps_=function(a){return a in goog.dependencies_.nameToPath?goog.dependencies_.nameToPath[a]:null},goog.findBasePath_(),goog.global.CLOSURE_NO_DEPS||goog.importScript_(goog.basePath+"deps.js"));
goog.typeOf=function(a){var d=typeof a;if("object"==d)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return d;var e=Object.prototype.toString.call(a);if("[object Window]"==e)return"object";if("[object Array]"==e||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==e||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==d&&"undefined"==typeof a.call)return"object";return d};goog.isDef=function(a){return void 0!==a};goog.isNull=function(a){return null===a};goog.isDefAndNotNull=function(a){return null!=a};goog.isArray=function(a){return"array"==goog.typeOf(a)};goog.isArrayLike=function(a){var d=goog.typeOf(a);return"array"==d||"object"==d&&"number"==typeof a.length};goog.isDateLike=function(a){return goog.isObject(a)&&"function"==typeof a.getFullYear};goog.isString=function(a){return"string"==typeof a};
goog.isBoolean=function(a){return"boolean"==typeof a};goog.isNumber=function(a){return"number"==typeof a};goog.isFunction=function(a){return"function"==goog.typeOf(a)};goog.isObject=function(a){var d=typeof a;return"object"==d&&null!=a||"function"==d};goog.getUid=function(a){return a[goog.UID_PROPERTY_]||(a[goog.UID_PROPERTY_]=++goog.uidCounter_)};goog.hasUid=function(a){return!!a[goog.UID_PROPERTY_]};goog.removeUid=function(a){"removeAttribute"in a&&a.removeAttribute(goog.UID_PROPERTY_);try{delete a[goog.UID_PROPERTY_]}catch(d){}};
goog.UID_PROPERTY_="closure_uid_"+(1E9*Math.random()>>>0);goog.uidCounter_=0;goog.getHashCode=goog.getUid;goog.removeHashCode=goog.removeUid;goog.cloneObject=function(a){var d=goog.typeOf(a);if("object"==d||"array"==d){if(a.clone)return a.clone();var d="array"==d?[]:{},e;for(e in a)d[e]=goog.cloneObject(a[e]);return d}return a};goog.bindNative_=function(a,d,e){return a.call.apply(a.bind,arguments)};
goog.bindJs_=function(a,d,e){if(!a)throw Error();if(2<arguments.length){var f=Array.prototype.slice.call(arguments,2);return function(){var e=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(e,f);return a.apply(d,e)}}return function(){return a.apply(d,arguments)}};goog.bind=function(a,d,e){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?goog.bind=goog.bindNative_:goog.bind=goog.bindJs_;return goog.bind.apply(null,arguments)};
goog.partial=function(a,d){var e=Array.prototype.slice.call(arguments,1);return function(){var d=e.slice();d.push.apply(d,arguments);return a.apply(this,d)}};goog.mixin=function(a,d){for(var e in d)a[e]=d[e]};goog.now=goog.TRUSTED_SITE&&Date.now||function(){return+new Date};
goog.globalEval=function(a){if(goog.global.execScript)goog.global.execScript(a,"JavaScript");else if(goog.global.eval)if(null==goog.evalWorksForGlobals_&&(goog.global.eval("var _et_ = 1;"),"undefined"!=typeof goog.global._et_?(delete goog.global._et_,goog.evalWorksForGlobals_=!0):goog.evalWorksForGlobals_=!1),goog.evalWorksForGlobals_)goog.global.eval(a);else{var d=goog.global.document,e=d.createElement("script");e.type="text/javascript";e.defer=!1;e.appendChild(d.createTextNode(a));d.body.appendChild(e);
d.body.removeChild(e)}else throw Error("goog.globalEval not available");};goog.evalWorksForGlobals_=null;goog.getCssName=function(a,d){var e=function(a){return goog.cssNameMapping_[a]||a},f=function(a){a=a.split("-");for(var d=[],f=0;f<a.length;f++)d.push(e(a[f]));return d.join("-")},f=goog.cssNameMapping_?"BY_WHOLE"==goog.cssNameMappingStyle_?e:f:function(a){return a};return d?a+"-"+f(d):f(a)};goog.setCssNameMapping=function(a,d){goog.cssNameMapping_=a;goog.cssNameMappingStyle_=d};
!COMPILED&&goog.global.CLOSURE_CSS_NAME_MAPPING&&(goog.cssNameMapping_=goog.global.CLOSURE_CSS_NAME_MAPPING);goog.getMsg=function(a,d){var e=d||{},f;for(f in e){var g=(""+e[f]).replace(/\$/g,"$$$$");a=a.replace(RegExp("\\{\\$"+f+"\\}","gi"),g)}return a};goog.getMsgWithFallback=function(a,d){return a};goog.exportSymbol=function(a,d,e){goog.exportPath_(a,d,e)};goog.exportProperty=function(a,d,e){a[d]=e};
goog.inherits=function(a,d){function e(){}e.prototype=d.prototype;a.superClass_=d.prototype;a.prototype=new e;a.prototype.constructor=a;a.base=function(a,e,h){var k=Array.prototype.slice.call(arguments,2);return d.prototype[e].apply(a,k)}};
goog.base=function(a,d,e){var f=arguments.callee.caller;if(goog.DEBUG&&!f)throw Error("arguments.caller not defined.  goog.base() expects not to be running in strict mode. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");if(f.superClass_)return f.superClass_.constructor.apply(a,Array.prototype.slice.call(arguments,1));for(var g=Array.prototype.slice.call(arguments,2),h=!1,k=a.constructor;k;k=k.superClass_&&k.superClass_.constructor)if(k.prototype[d]===f)h=!0;else if(h)return k.prototype[d].apply(a,
g);if(a[d]===f)return a.constructor.prototype[d].apply(a,g);throw Error("goog.base called from a method of one name to a method of a different name");};goog.scope=function(a){a.call(goog.global)};var fb={simplelogin:{}};fb.simplelogin.Vars_=function(){this.apiHost="https://auth.firebase.com"};fb.simplelogin.Vars_.prototype.setApiHost=function(a){this.apiHost=a};fb.simplelogin.Vars_.prototype.getApiHost=function(){return this.apiHost};fb.simplelogin.Vars=new fb.simplelogin.Vars_;goog.json={};goog.json.USE_NATIVE_JSON=!1;goog.json.isValid_=function(a){return/^\s*$/.test(a)?!1:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,""))};
goog.json.parse=goog.json.USE_NATIVE_JSON?goog.global.JSON.parse:function(a){a=String(a);if(goog.json.isValid_(a))try{return eval("("+a+")")}catch(d){}throw Error("Invalid JSON string: "+a);};goog.json.unsafeParse=goog.json.USE_NATIVE_JSON?goog.global.JSON.parse:function(a){return eval("("+a+")")};goog.json.serialize=goog.json.USE_NATIVE_JSON?goog.global.JSON.stringify:function(a,d){return(new goog.json.Serializer(d)).serialize(a)};goog.json.Serializer=function(a){this.replacer_=a};
goog.json.Serializer.prototype.serialize=function(a){var d=[];this.serialize_(a,d);return d.join("")};
goog.json.Serializer.prototype.serialize_=function(a,d){switch(typeof a){case "string":this.serializeString_(a,d);break;case "number":this.serializeNumber_(a,d);break;case "boolean":d.push(a);break;case "undefined":d.push("null");break;case "object":if(null==a){d.push("null");break}if(goog.isArray(a)){this.serializeArray(a,d);break}this.serializeObject_(a,d);break;case "function":break;default:throw Error("Unknown type: "+typeof a);}};
goog.json.Serializer.charToJsonCharCache_={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"};goog.json.Serializer.charsToReplace_=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_=function(a,d){d.push('"',a.replace(goog.json.Serializer.charsToReplace_,function(a){if(a in goog.json.Serializer.charToJsonCharCache_)return goog.json.Serializer.charToJsonCharCache_[a];var d=a.charCodeAt(0),g="\\u";16>d?g+="000":256>d?g+="00":4096>d&&(g+="0");return goog.json.Serializer.charToJsonCharCache_[a]=g+d.toString(16)}),'"')};goog.json.Serializer.prototype.serializeNumber_=function(a,d){d.push(isFinite(a)&&!isNaN(a)?a:"null")};
goog.json.Serializer.prototype.serializeArray=function(a,d){var e=a.length;d.push("[");for(var f="",g=0;g<e;g++)d.push(f),f=a[g],this.serialize_(this.replacer_?this.replacer_.call(a,String(g),f):f,d),f=",";d.push("]")};
goog.json.Serializer.prototype.serializeObject_=function(a,d){d.push("{");var e="",f;for(f in a)if(Object.prototype.hasOwnProperty.call(a,f)){var g=a[f];"function"!=typeof g&&(d.push(e),this.serializeString_(f,d),d.push(":"),this.serialize_(this.replacer_?this.replacer_.call(a,f,g):g,d),e=",")}d.push("}")};fb.simplelogin.util={};fb.simplelogin.util.json={};fb.simplelogin.util.json.parse=function(a){return"undefined"!==typeof JSON&&goog.isDef(JSON.parse)?JSON.parse(a):goog.json.parse(a)};fb.simplelogin.util.json.stringify=function(a){return"undefined"!==typeof JSON&&goog.isDef(JSON.stringify)?JSON.stringify(a):goog.json.serialize(a)};fb.simplelogin.transports={};fb.simplelogin.transports.Transport={};fb.simplelogin.Transport=function(){};fb.simplelogin.Transport.prototype.open=function(a,d,e){};fb.simplelogin.transports.Popup={};fb.simplelogin.Popup=function(){};fb.simplelogin.Popup.prototype.open=function(a,d,e){};fb.simplelogin.util.misc={};fb.simplelogin.util.misc.parseUrl=function(a){var d=document.createElement("a");d.href=a;return{protocol:d.protocol.replace(":",""),host:d.hostname,port:d.port,query:d.search,params:fb.simplelogin.util.misc.parseQuerystring(d.search),hash:d.hash.replace("#",""),path:d.pathname.replace(/^([^\/])/,"/$1")}};fb.simplelogin.util.misc.parseQuerystring=function(a){var d={};a=a.replace(/^\?/,"").split("&");for(var e=0;e<a.length;e++)if(a[e]){var f=a[e].split("=");d[f[0]]=f[1]}return d};
fb.simplelogin.util.misc.parseSubdomain=function(a){var d="";try{var e=fb.simplelogin.util.misc.parseUrl(a).host.split(".");2<e.length&&(d=e.slice(0,-2).join("."))}catch(f){}return d};fb.simplelogin.util.misc.warn=function(a){"undefined"!==typeof console&&("undefined"!==typeof console.warn?console.warn(a):console.log(a))};var popupTimeout=12E4;fb.simplelogin.transports.CordovaInAppBrowser_=function(){};
fb.simplelogin.transports.CordovaInAppBrowser_.prototype.open=function(a,d,e){callbackInvoked=!1;var f=function(){var a=Array.prototype.slice.apply(arguments);callbackInvoked||(callbackInvoked=!0,e.apply(null,a))},g=window.open(a+"&transport=internal-redirect-hash","blank","location=no");g.addEventListener("loadstop",function(a){var d;if(a&&a.url&&(a=fb.simplelogin.util.misc.parseUrl(a.url),"/blank/page.html"===a.path)){g.close();try{var e=fb.simplelogin.util.misc.parseQuerystring(a.hash);a={};for(var n in e)a[n]=
fb.simplelogin.util.json.parse(decodeURIComponent(e[n]));d=a}catch(q){}d&&d.token&&d.user?f(null,d):d&&d.error?f(d.error):f({code:"RESPONSE_PAYLOAD_ERROR",message:"Unable to parse response payload for PhoneGap."})}});g.addEventListener("exit",function(a){f({code:"USER_DENIED",message:"User cancelled the authentication request."})});setTimeout(function(){g&&g.close&&g.close()},popupTimeout)};fb.simplelogin.transports.CordovaInAppBrowser=new fb.simplelogin.transports.CordovaInAppBrowser_;fb.simplelogin.Errors={};var messagePrefix="FirebaseSimpleLogin: ",errors={UNKNOWN_ERROR:"An unknown error occurred.",INVALID_EMAIL:"Invalid email specified.",INVALID_PASSWORD:"Invalid password specified.",USER_DENIED:"User cancelled the authentication request.",RESPONSE_PAYLOAD_ERROR:"Unable to parse response payload.",TRIGGER_IO_TABS:'The "forge.tabs" module required when using Firebase Simple Login and                               Trigger.io. Without this module included and enabled, login attempts to                               OAuth authentication providers will not be able to complete.'};
fb.simplelogin.Errors.format=function(a,d){var e,f,g={},h=arguments;if(2===h.length)e=h[0],f=h[1];else if(1===h.length)if("object"===typeof h[0]&&h[0].code&&h[0].message){if(0===h[0].message.indexOf(messagePrefix))return h[0];e=h[0].code;f=h[0].message;g=h[0].data}else"string"===typeof h[0]&&(e=h[0],f=errors[e]);else e="UNKNOWN_ERROR",f=errors[e];f=Error(messagePrefix+f);f.code=e;g&&(f.data=g);return f};var RELAY_FRAME_NAME="__winchan_relay_frame",CLOSE_CMD="die";function addListener(a,d,e){a.attachEvent?a.attachEvent("on"+d,e):a.addEventListener&&a.addEventListener(d,e,!1)}function removeListener(a,d,e){a.detachEvent?a.detachEvent("on"+d,e):a.removeEventListener&&a.removeEventListener(d,e,!1)}function extractOrigin(a){/^https?:\/\//.test(a)||(a=window.location.href);var d=/^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);return d?d[1]:a}
function findRelay(){for(var a=window.location,d=window.opener.frames,a=a.protocol+"//"+a.host,e=d.length-1;0<=e;e--)try{if(0===d[e].location.href.indexOf(a)&&d[e].name===RELAY_FRAME_NAME)return d[e]}catch(f){}}
var isInternetExplorer=function(){var a,d=-1,e=navigator.userAgent;"Microsoft Internet Explorer"===navigator.appName?(a=/MSIE ([0-9]{1,}[\.0-9]{0,})/,(a=e.match(a))&&1<a.length&&(d=parseFloat(a[1]))):-1<e.indexOf("Trident")&&(a=/rv:([0-9]{2,2}[\.0-9]{0,})/,(a=e.match(a))&&1<a.length&&(d=parseFloat(a[1])));return 8<=d}();fb.simplelogin.transports.WinChan_=function(){};
fb.simplelogin.transports.WinChan_.prototype.open=function(a,d,e){function f(a){k&&document.body.removeChild(k);k=void 0;s&&(s=clearInterval(s));removeListener(window,"message",g);removeListener(window,"unload",f);if(q&&!a)try{q.close()}catch(d){n.postMessage(CLOSE_CMD,l)}q=n=void 0}function g(a){if(a.origin===l)try{var d=fb.simplelogin.util.json.parse(a.data);"ready"===d.a?n.postMessage(m,l):"error"===d.a?(f(),e&&(e(d.d),e=null)):"response"===d.a&&(f(d.forceKeepWindowOpen),e&&(e(null,d.d),e=null))}catch(g){}}
if(!e)throw"missing required callback argument";d.url=a;var h;d.url||(h="missing required 'url' parameter");d.relay_url||(h="missing required 'relay_url' parameter");h&&setTimeout(function(){e(h)},0);d.window_name||(d.window_name=null);if(!d.window_features||fb.simplelogin.util.env.isFennec())d.window_features=void 0;var k,l=extractOrigin(d.url);if(l!==extractOrigin(d.relay_url))return setTimeout(function(){e("invalid arguments: origin of url and relay_url must match")},0);var n;isInternetExplorer&&
(k=document.createElement("iframe"),k.setAttribute("src",d.relay_url),k.style.display="none",k.setAttribute("name",RELAY_FRAME_NAME),document.body.appendChild(k),n=k.contentWindow);var q=window.open(d.url,d.window_name,d.window_features);n||(n=q);var s=setInterval(function(){q&&q.closed&&(f(),e&&(e("unknown closed window"),e=null))},500),m=fb.simplelogin.util.json.stringify({a:"request",d:d.params});addListener(window,"unload",f);addListener(window,"message",g);return{close:f,focus:function(){if(q)try{q.focus()}catch(a){}}}};
goog.exportSymbol("fb.simplelogin.transports.WinChan_.prototype.open",fb.simplelogin.transports.WinChan_.prototype.open);
fb.simplelogin.transports.WinChan_.prototype.onOpen=function(a){function d(a){a=fb.simplelogin.util.json.stringify(a);isInternetExplorer?h.doPost(a,g):h.postMessage(a,g)}function e(f){var h;try{h=fb.simplelogin.util.json.parse(f.data)}catch(n){}h&&"request"===h.a&&(removeListener(window,"message",e),g=f.origin,a&&setTimeout(function(){a(g,h.d,function(e,f){k=!f;a=void 0;d({a:"response",d:e,forceKeepWindowOpen:f})})},0))}function f(a){if(k&&a.data===CLOSE_CMD)try{window.close()}catch(d){}}var g="*",
h=isInternetExplorer?findRelay():window.opener,k=!0;if(!h)throw"can't find relay frame";addListener(isInternetExplorer?h:window,"message",e);addListener(isInternetExplorer?h:window,"message",f);try{d({a:"ready"})}catch(l){addListener(h,"load",function(a){d({a:"ready"})})}var n=function(){try{removeListener(isInternetExplorer?h:window,"message",f)}catch(e){}a&&d({a:"error",d:"client closed window"});a=void 0;try{window.close()}catch(g){}};addListener(window,"unload",n);return{detach:function(){removeListener(window,
"unload",n)}}};goog.exportSymbol("fb.simplelogin.transports.WinChan_.prototype.onOpen",fb.simplelogin.transports.WinChan_.prototype.onOpen);fb.simplelogin.transports.WinChan_.prototype.isAvailable=function(){return fb.simplelogin.util.json&&fb.simplelogin.util.json.parse&&fb.simplelogin.util.json.stringify&&window.postMessage};fb.simplelogin.transports.WinChan=new fb.simplelogin.transports.WinChan_;fb.simplelogin.transports.TriggerIoTab_=function(){};
fb.simplelogin.transports.TriggerIoTab_.prototype.open=function(a,d,e){callbackInvoked=!1;var f=function(){var a=Array.prototype.slice.apply(arguments);callbackInvoked||(callbackInvoked=!0,e.apply(null,a))};forge.tabs.openWithOptions({url:a+"&transport=internal-redirect-hash",pattern:fb.simplelogin.Vars.getApiHost()+"/blank/page*"},function(a){var d;if(a&&a.url)try{var e=fb.simplelogin.util.misc.parseUrl(a.url),l=fb.simplelogin.util.misc.parseQuerystring(e.hash);a={};for(var n in l)a[n]=fb.simplelogin.util.json.parse(decodeURIComponent(l[n]));
d=a}catch(q){}d&&d.token&&d.user?f(null,d):d&&d.error?f(d.error):f({code:"RESPONSE_PAYLOAD_ERROR",message:"Unable to parse response payload for Trigger.io."})},function(a){f({code:"UNKNOWN_ERROR",message:"An unknown error occurred for Trigger.io."})})};fb.simplelogin.transports.TriggerIoTab=new fb.simplelogin.transports.TriggerIoTab_;var b,c;
!function(){var a={},d={};b=function(d,f,g){a[d]={deps:f,callback:g}};c=function(e){function f(a){if("."!==a.charAt(0))return a;a=a.split("/");for(var d=e.split("/").slice(0,-1),f=0,g=a.length;g>f;f++){var k=a[f];".."===k?d.pop():"."!==k&&d.push(k)}return d.join("/")}if(d[e])return d[e];if(d[e]={},!a[e])throw Error("Could not find module "+e);for(var g,h=a[e],k=h.deps,h=h.callback,l=[],n=0,q=k.length;q>n;n++)l.push("exports"===k[n]?g={}:c(f(k[n])));k=h.apply(this,l);return d[e]=g||k};c.entries=a}();
b("rsvp/all-settled",["./promise","./utils","exports"],function(a,d,e){var f=a["default"],g=d.isArray,h=d.isNonThenable;e["default"]=function(a,d){return new f(function(d){function e(a){return function(d){m(a,{state:"fulfilled",value:d})}}function l(a){return function(d){m(a,{state:"rejected",reason:d})}}function m(a,e){u[a]=e;0===--r&&d(u)}if(!g(a))throw new TypeError("You must pass an array to allSettled.");var p,r=a.length;if(0===r)return void d([]);for(var u=Array(r),v=0;v<a.length;v++)p=a[v],
h(p)?m(v,{state:"fulfilled",value:p}):f.resolve(p).then(e(v),l(v))},d)}});b("rsvp/all",["./promise","exports"],function(a,d){var e=a["default"];d["default"]=function(a,d){return e.all(a,d)}});
b("rsvp/asap",["exports"],function(a){function d(){return function(){process.nextTick(g)}}function e(){var a=0,d=new k(g),e=document.createTextNode("");return d.observe(e,{characterData:!0}),function(){e.data=a=++a%2}}function f(){return function(){setTimeout(g,1)}}function g(){for(var a=0;a<l.length;a++){var d=l[a];(0,d[0])(d[1])}l.length=0}a["default"]=function(a,d){1===l.push([a,d])&&h()};var h;a="undefined"!=typeof window?window:{};var k=a.MutationObserver||a.WebKitMutationObserver,l=[];h="undefined"!=
typeof process&&"[object process]"==={}.toString.call(process)?d():k?e():f()});b("rsvp/config",["./events","exports"],function(a,d){var e={instrument:!1};a["default"].mixin(e);d.config=e;d.configure=function(a,d){return"onerror"===a?void e.on("error",d):2!==arguments.length?e[a]:void(e[a]=d)}});b("rsvp/defer",["./promise","exports"],function(a,d){var e=a["default"];d["default"]=function(a){var d={};return d.promise=new e(function(a,e){d.resolve=a;d.reject=e},a),d}});
b("rsvp/events",["exports"],function(a){function d(a,d){for(var e=0,k=a.length;k>e;e++)if(a[e]===d)return e;return-1}function e(a){var d=a._promiseCallbacks;return d||(d=a._promiseCallbacks={}),d}a["default"]={mixin:function(a){return a.on=this.on,a.off=this.off,a.trigger=this.trigger,a._promiseCallbacks=void 0,a},on:function(a,g){var h,k=e(this);(h=k[a])||(h=k[a]=[]);-1===d(h,g)&&h.push(g)},off:function(a,g){var h,k,l=e(this);return g?(h=l[a],k=d(h,g),void(-1!==k&&h.splice(k,1))):void(l[a]=[])},
trigger:function(a,d){var h;if(h=e(this)[a])for(var k=0;k<h.length;k++)(0,h[k])(d)}}});
b("rsvp/filter",["./promise","./utils","exports"],function(a,d,e){var f=a["default"],g=d.isFunction;e["default"]=function(a,d,e){return f.all(a,e).then(function(a){if(!g(d))throw new TypeError("You must pass a function as filter's second argument.");for(var h=a.length,s=Array(h),m=0;h>m;m++)s[m]=d(a[m]);return f.all(s,e).then(function(d){for(var e=Array(h),f=0,g=0;h>g;g++)!0===d[g]&&(e[f]=a[g],f++);return e.length=f,e})})}});
b("rsvp/hash-settled",["./promise","./utils","exports"],function(a,d,e){var f=a["default"],g=d.isNonThenable,h=d.keysOf;e["default"]=function(a){return new f(function(d){function e(a){return function(d){s(a,{state:"fulfilled",value:d})}}function q(a){return function(d){s(a,{state:"rejected",reason:d})}}function s(a,e){r[a]=e;0===--v&&d(r)}var m,p,r={},u=h(a),v=u.length;if(0===v)return void d(r);for(var t=0;t<u.length;t++)p=u[t],m=a[p],g(m)?s(p,{state:"fulfilled",value:m}):f.resolve(m).then(e(p),q(p))})}});
b("rsvp/hash",["./promise","./utils","exports"],function(a,d,e){var f=a["default"],g=d.isNonThenable,h=d.keysOf;e["default"]=function(a){return new f(function(d,e){function q(a){return function(e){r[a]=e;0===--v&&d(r)}}function s(a){v=0;e(a)}var m,p,r={},u=h(a),v=u.length;if(0===v)return void d(r);for(var t=0;t<u.length;t++)p=u[t],m=a[p],g(m)?(r[p]=m,0===--v&&d(r)):f.resolve(m).then(q(p),s)})}});
b("rsvp/instrument",["./config","./utils","exports"],function(a,d,e){var f=a.config,g=d.now;e["default"]=function(a,d,e){try{f.trigger(a,{guid:d._guidKey+d._id,eventName:a,detail:d._detail,childGuid:e&&d._guidKey+e._id,label:d._label,timeStamp:g(),stack:Error(d._label).stack})}catch(n){setTimeout(function(){throw n;},0)}}});
b("rsvp/map",["./promise","./utils","exports"],function(a,d,e){var f=a["default"],g=(d.isArray,d.isFunction);e["default"]=function(a,d,e){return f.all(a,e).then(function(a){if(!g(d))throw new TypeError("You must pass a function as map's second argument.");for(var h=a.length,s=Array(h),m=0;h>m;m++)s[m]=d(a[m]);return f.all(s,e)})}});
b("rsvp/node",["./promise","./utils","exports"],function(a,d,e){var f=a["default"],g=d.isArray;e["default"]=function(a,d){function e(){for(var g=arguments.length,m=Array(g),l=0;g>l;l++)m[l]=arguments[l];var r;return n||q||!d?r=this:(console.warn('Deprecation: RSVP.denodeify() doesn\'t allow setting the "this" binding anymore. Use yourFunction.bind(yourThis) instead.'),r=d),f.all(m).then(function(e){return new f(function(f,g){e.push(function(){for(var a=arguments.length,e=Array(a),h=0;a>h;h++)e[h]=
arguments[h];a=e[0];h=e[1];if(a)g(a);else if(n)f(e.slice(1));else if(q){for(var a={},l=e.slice(1),h=0;h<d.length;h++)e=d[h],a[e]=l[h];f(a)}else f(h)});a.apply(r,e)})})}var n=!0===d,q=g(d);return e.__proto__=a,e}});
b("rsvp/promise","./config ./events ./instrument ./utils ./promise/cast ./promise/all ./promise/race ./promise/resolve ./promise/reject exports".split(" "),function(a,d,e,f,g,h,k,l,n,q){function s(){}function m(a,d){if(!B(a))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof m))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this._id=
H++;this._label=d;this._subscribers=[];z.instrument&&C("created",this);s!==a&&p(a,this)}function p(a,d){function e(a){y(d,a)}function f(a){x(d,a)}try{a(e,f)}catch(g){f(g)}}function r(a,d,e,f){a=a._subscribers;var g=a.length;a[g]=d;a[g+A]=e;a[g+D]=f}function u(a,d){var e,f,g=a._subscribers,h=a._detail;z.instrument&&C(d===A?"fulfilled":"rejected",a);for(var k=0;k<g.length;k+=3)e=g[k],f=g[k+d],v(d,e,f,h);a._subscribers=null}function v(a,d,e,f){var g,h,k,l,m=B(e);if(m)try{g=e(f),k=!0}catch(n){l=!0,h=
n}else g=f,k=!0;t(d,g)||(m&&k?y(d,g):l?x(d,h):a===A?y(d,g):a===D&&x(d,g))}function t(a,d){var e,f=null;try{if(a===d)throw new TypeError("A promises callback cannot return that same promise.");if(I(d)&&(f=d.then,B(f)))return f.call(d,function(f){return e?!0:(e=!0,void(d!==f?y(a,f):w(a,f)))},function(d){return e?!0:(e=!0,void x(a,d))},"Settle: "+(a._label||" unknown promise")),!0}catch(g){return e?!0:(x(a,g),!0)}return!1}function y(a,d){a===d?w(a,d):t(a,d)||w(a,d)}function w(a,d){a._state===E&&(a._state=
F,a._detail=d,z.async(G,a))}function x(a,d){a._state===E&&(a._state=F,a._detail=d,z.async(J,a))}function G(a){u(a,a._state=A)}function J(a){a._onerror&&a._onerror(a._detail);u(a,a._state=D)}var z=a.config,C=(d["default"],e["default"]),I=f.objectOrFunction,B=f.isFunction;a=f.now;g=g["default"];h=h["default"];k=k["default"];l=l["default"];n=n["default"];a="rsvp_"+a()+"-";var H=0;q["default"]=m;m.cast=g;m.all=h;m.race=k;m.resolve=l;m.reject=n;var E=void 0,F=0,A=1,D=2;m.prototype={constructor:m,_id:void 0,
_guidKey:a,_label:void 0,_state:void 0,_detail:void 0,_subscribers:void 0,_onerror:function(a){z.trigger("error",a)},then:function(a,d,e){var f=this;this._onerror=null;var g=new this.constructor(s,e);if(this._state){var h=arguments;z.async(function(){v(f._state,g,h[f._state-1],f._detail)})}else r(this,g,a,d);return z.instrument&&C("chained",f,g),g},"catch":function(a,d){return this.then(null,a,d)},"finally":function(a,d){var e=this.constructor;return this.then(function(d){return e.resolve(a()).then(function(){return d})},
function(d){return e.resolve(a()).then(function(){throw d;})},d)}}});
b("rsvp/promise/all",["../utils","exports"],function(a,d){var e=a.isArray,f=a.isNonThenable;d["default"]=function(a,d){var k=this;return new k(function(d,h){function q(a){return function(e){r[a]=e;0===--p&&d(r)}}function s(a){p=0;h(a)}if(!e(a))throw new TypeError("You must pass an array to all.");var m,p=a.length,r=Array(p);if(0===p)return void d(r);for(var u=0;u<a.length;u++)m=a[u],f(m)?(r[u]=m,0===--p&&d(r)):k.resolve(m).then(q(u),s)},d)}});
b("rsvp/promise/cast",["exports"],function(a){a["default"]=function(a,e){return a&&"object"==typeof a&&a.constructor===this?a:new this(function(e){e(a)},e)}});
b("rsvp/promise/race",["../utils","exports"],function(a,d){var e=a.isArray,f=(a.isFunction,a.isNonThenable);d["default"]=function(a,d){var k,l=this;return new l(function(d,h){function s(a){p&&(p=!1,d(a))}function m(a){p&&(p=!1,h(a))}if(!e(a))throw new TypeError("You must pass an array to race.");for(var p=!0,r=0;r<a.length;r++){if(k=a[r],f(k))return p=!1,void d(k);l.resolve(k).then(s,m)}},d)}});
b("rsvp/promise/reject",["exports"],function(a){a["default"]=function(a,e){return new this(function(e,g){g(a)},e)}});b("rsvp/promise/resolve",["exports"],function(a){a["default"]=function(a,e){return a&&"object"==typeof a&&a.constructor===this?a:new this(function(e){e(a)},e)}});b("rsvp/race",["./promise","exports"],function(a,d){var e=a["default"];d["default"]=function(a,d){return e.race(a,d)}});
b("rsvp/reject",["./promise","exports"],function(a,d){var e=a["default"];d["default"]=function(a,d){return e.reject(a,d)}});b("rsvp/resolve",["./promise","exports"],function(a,d){var e=a["default"];d["default"]=function(a,d){return e.resolve(a,d)}});b("rsvp/rethrow",["exports"],function(a){a["default"]=function(a){throw setTimeout(function(){throw a;}),a;}});
b("rsvp/utils",["exports"],function(a){function d(a){return"function"==typeof a||"object"==typeof a&&null!==a}a.objectOrFunction=d;a.isFunction=function(a){return"function"==typeof a};a.isNonThenable=function(a){return!d(a)};a.isArray=Array.isArray?Array.isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)};a.now=Date.now||function(){return(new Date).getTime()};a.keysOf=Object.keys||function(a){var d=[],g;for(g in a)d.push(g);return d}});
b("rsvp","./rsvp/promise ./rsvp/events ./rsvp/node ./rsvp/all ./rsvp/all-settled ./rsvp/race ./rsvp/hash ./rsvp/hash-settled ./rsvp/rethrow ./rsvp/defer ./rsvp/config ./rsvp/map ./rsvp/resolve ./rsvp/reject ./rsvp/filter ./rsvp/asap exports".split(" "),function(a,d,e,f,g,h,k,l,n,q,s,m,p,r,u,v,t){function y(){w.on.apply(w,arguments)}a=a["default"];d=d["default"];e=e["default"];f=f["default"];g=g["default"];h=h["default"];k=k["default"];l=l["default"];n=n["default"];q=q["default"];var w=s.config;s=
s.configure;m=m["default"];p=p["default"];r=r["default"];u=u["default"];if(w.async=v["default"],"undefined"!=typeof window&&"object"==typeof window.__PROMISE_INSTRUMENTATION__){v=window.__PROMISE_INSTRUMENTATION__;s("instrument",!0);for(var x in v)v.hasOwnProperty(x)&&y(x,v[x])}t.Promise=a;t.EventTarget=d;t.all=f;t.allSettled=g;t.race=h;t.hash=k;t.hashSettled=l;t.rethrow=n;t.defer=q;t.denodeify=e;t.configure=s;t.on=y;t.off=function(){w.off.apply(w,arguments)};t.resolve=p;t.reject=r;t.async=function(a,
d){w.async(a,d)};t.map=m;t.filter=u});fb.simplelogin.util.RSVP=c("rsvp");fb.simplelogin.util.env={};fb.simplelogin.util.env.hasLocalStorage=function(a){try{if(localStorage){localStorage.setItem("firebase-sentinel","test");var d=localStorage.getItem("firebase-sentinel");localStorage.removeItem("firebase-sentinel");return"test"===d}}catch(e){}return!1};
fb.simplelogin.util.env.hasSessionStorage=function(a){try{if(sessionStorage){sessionStorage.setItem("firebase-sentinel","test");var d=sessionStorage.getItem("firebase-sentinel");sessionStorage.removeItem("firebase-sentinel");return"test"===d}}catch(e){}return!1};fb.simplelogin.util.env.isMobileCordovaInAppBrowser=function(){return(window.cordova||window.CordovaInAppBrowser||window.phonegap)&&/ios|iphone|ipod|ipad|android/i.test(navigator.userAgent)};
fb.simplelogin.util.env.isMobileTriggerIoTab=function(){return window.forge&&/ios|iphone|ipod|ipad|android/i.test(navigator.userAgent)};fb.simplelogin.util.env.isWindowsMetro=function(){return!!window.Windows&&/^ms-appx:/.test(location.href)};fb.simplelogin.util.env.isChromeiOS=function(){return!!navigator.userAgent.match(/CriOS/)};fb.simplelogin.util.env.isTwitteriOS=function(){return!!navigator.userAgent.match(/Twitter for iPhone/)};fb.simplelogin.util.env.isFacebookiOS=function(){return!!navigator.userAgent.match(/FBAN\/FBIOS/)};
fb.simplelogin.util.env.isWindowsPhone=function(){return!!navigator.userAgent.match(/Windows Phone/)};fb.simplelogin.util.env.isStandaloneiOS=function(){return!!window.navigator.standalone};fb.simplelogin.util.env.isPhantomJS=function(){return!!navigator.userAgent.match(/PhantomJS/)};
fb.simplelogin.util.env.isIeLT10=function(){var a,d=-1,e=navigator.userAgent;return"Microsoft Internet Explorer"===navigator.appName&&(a=/MSIE ([0-9]{1,}[\.0-9]{0,})/,(a=e.match(a))&&1<a.length&&(d=parseFloat(a[1])),10>d)?!0:!1};fb.simplelogin.util.env.isFennec=function(){try{var a=navigator.userAgent;return-1!=a.indexOf("Fennec/")||-1!=a.indexOf("Firefox/")&&-1!=a.indexOf("Android")}catch(d){}return!1};fb.simplelogin.transports.XHR_=function(){};
fb.simplelogin.transports.XHR_.prototype.open=function(a,d,e){var f={contentType:"application/json"},g=new XMLHttpRequest,h=(f.method||"GET").toUpperCase(),k=f.contentType||"application/x-www-form-urlencoded",l=!1,n;g.onreadystatechange=function(){if(!l&&4===g.readyState){var a,d;l=!0;if(200<=g.status&&300>g.status||304==g.status||1223==g.status)try{a=fb.simplelogin.util.json.parse(g.responseText),d=a.error||null,delete a.error}catch(f){d="UNKNOWN_ERROR"}else d="RESPONSE_PAYLOAD_ERROR";return e&&
e(d,a)}};d&&("GET"===h?(-1===a.indexOf("?")&&(a+="?"),a+=this.formatQueryString(d),d=null):("application/json"===k&&(d=fb.simplelogin.util.json.stringify(d)),"application/x-www-form-urlencoded"===k&&(d=this.formatQueryString(d))));g.open(h,a,!0);a={"X-Requested-With":"XMLHttpRequest",Accept:"application/json;text/plain","Content-Type":k};f.headers=f.headers||{};for(n in f.headers)a[n]=f.headers[n];for(n in a)g.setRequestHeader(n,a[n]);g.send(d)};
fb.simplelogin.transports.XHR_.prototype.isAvailable=function(){return window.XMLHttpRequest&&"function"===typeof window.XMLHttpRequest&&!fb.simplelogin.util.env.isIeLT10()};fb.simplelogin.transports.XHR_.prototype.formatQueryString=function(a){if(!a)return"";var d=[],e;for(e in a)d.push(encodeURIComponent(e)+"="+encodeURIComponent(a[e]));return d.join("&")};fb.simplelogin.transports.XHR=new fb.simplelogin.transports.XHR_;fb.simplelogin.util.validation={};var VALID_EMAIL_REGEX_=/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/;fb.simplelogin.util.validation.validateArgCount=function(a,d,e,f){var g;f<d?g="at least "+d:f>e&&(g=0===e?"none":"no more than "+e);if(g)throw Error(a+" failed: Was called with "+f+(1===f?" argument.":" arguments.")+" Expects "+g+".");};fb.simplelogin.util.validation.isValidEmail=function(a){return goog.isString(a)&&VALID_EMAIL_REGEX_.test(a)};
fb.simplelogin.util.validation.isValidPassword=function(a){return goog.isString(a)};fb.simplelogin.util.validation.isValidNamespace=function(a){return goog.isString(a)};
fb.simplelogin.util.validation.errorPrefix_=function(a,d,e){var f="";switch(d){case 1:f=e?"first":"First";break;case 2:f=e?"second":"Second";break;case 3:f=e?"third":"Third";break;case 4:f=e?"fourth":"Fourth";break;default:fb.core.util.validation.assert(!1,"errorPrefix_ called with argumentNumber > 4.  Need to update it?")}return a=a+" failed: "+(f+" argument ")};
fb.simplelogin.util.validation.validateNamespace=function(a,d,e,f){if((!f||goog.isDef(e))&&!goog.isString(e))throw Error(fb.simplelogin.util.validation.errorPrefix_(a,d,f)+"must be a valid firebase namespace.");};fb.simplelogin.util.validation.validateCallback=function(a,d,e,f){if((!f||goog.isDef(e))&&!goog.isFunction(e))throw Error(fb.simplelogin.util.validation.errorPrefix_(a,d,f)+"must be a valid function.");};
fb.simplelogin.util.validation.validateString=function(a,d,e,f){if((!f||goog.isDef(e))&&!goog.isString(e))throw Error(fb.simplelogin.util.validation.errorPrefix_(a,d,f)+"must be a valid string.");};fb.simplelogin.util.validation.validateContextObject=function(a,d,e,f){if(!f||goog.isDef(e))if(!goog.isObject(e)||null===e)throw Error(fb.simplelogin.util.validation.errorPrefix_(a,d,f)+"must be a valid context object.");};var CALLBACK_NAMESPACE="_FirebaseSimpleLoginJSONP";fb.simplelogin.transports.JSONP_=function(){window[CALLBACK_NAMESPACE]=window[CALLBACK_NAMESPACE]||{}};fb.simplelogin.transports.JSONP_.prototype.open=function(a,d,e){a+=/\?/.test(a)?"":"?";a+="&transport=jsonp";for(var f in d)a+="&"+encodeURIComponent(f)+"="+encodeURIComponent(d[f]);d=this.generateRequestId_();a+="&callback="+encodeURIComponent(CALLBACK_NAMESPACE+"."+d);this.registerCallback_(d,e);this.writeScriptTag_(d,a,e)};
fb.simplelogin.transports.JSONP_.prototype.generateRequestId_=function(){return"_FirebaseJSONP"+(new Date).getTime()+Math.floor(100*Math.random())};fb.simplelogin.transports.JSONP_.prototype.registerCallback_=function(a,d){var e=this;window[CALLBACK_NAMESPACE][a]=function(f){var g=f.error||null;delete f.error;d(g,f);e.removeCallback_(a)}};
fb.simplelogin.transports.JSONP_.prototype.removeCallback_=function(a){setTimeout(function(){delete window[CALLBACK_NAMESPACE][a];var d=document.getElementById(a);d&&d.parentNode.removeChild(d)},0)};
fb.simplelogin.transports.JSONP_.prototype.writeScriptTag_=function(a,d,e){var f=this;setTimeout(function(){try{var g=document.createElement("script");g.type="text/javascript";g.id=a;g.async=!0;g.src=d;g.onerror=function(){var d=document.getElementById(a);null!==d&&d.parentNode.removeChild(d);e&&e(f.formatError_({code:"SERVER_ERROR",message:"An unknown server error occurred."}))};document.getElementsByTagName("head")[0].appendChild(g)}catch(h){e&&e(f.formatError_({code:"SERVER_ERROR",message:"An unknown server error occurred."}))}},
0)};fb.simplelogin.transports.JSONP_.prototype.formatError_=function(a){var d;a?(d=Error(a.message),d.code=a.code||"UNKNOWN_ERROR"):(d=Error(),d.code="UNKNOWN_ERROR");return d};fb.simplelogin.transports.JSONP=new fb.simplelogin.transports.JSONP_;fb.simplelogin.providers={};fb.simplelogin.providers.Password_=function(){};fb.simplelogin.providers.Password_.prototype.getTransport_=function(){return fb.simplelogin.transports.XHR.isAvailable()?fb.simplelogin.transports.XHR:fb.simplelogin.transports.JSONP};
fb.simplelogin.providers.Password_.prototype.login=function(a,d){var e=fb.simplelogin.Vars.getApiHost()+"/auth/firebase";if(!fb.simplelogin.util.validation.isValidNamespace(a.firebase))return d&&d("INVALID_FIREBASE");this.getTransport_().open(e,a,d)};
fb.simplelogin.providers.Password_.prototype.createUser=function(a,d){var e=fb.simplelogin.Vars.getApiHost()+"/auth/firebase/create";if(!fb.simplelogin.util.validation.isValidNamespace(a.firebase))return d&&d("INVALID_FIREBASE");if(!fb.simplelogin.util.validation.isValidEmail(a.email))return d&&d("INVALID_EMAIL");if(!fb.simplelogin.util.validation.isValidPassword(a.password))return d&&d("INVALID_PASSWORD");this.getTransport_().open(e,a,d)};
fb.simplelogin.providers.Password_.prototype.changePassword=function(a,d){var e=fb.simplelogin.Vars.getApiHost()+"/auth/firebase/update";if(!fb.simplelogin.util.validation.isValidNamespace(a.firebase))return d&&d("INVALID_FIREBASE");if(!fb.simplelogin.util.validation.isValidEmail(a.email))return d&&d("INVALID_EMAIL");if(!fb.simplelogin.util.validation.isValidPassword(a.newPassword))return d&&d("INVALID_PASSWORD");this.getTransport_().open(e,a,d)};
fb.simplelogin.providers.Password_.prototype.removeUser=function(a,d){var e=fb.simplelogin.Vars.getApiHost()+"/auth/firebase/remove";if(!fb.simplelogin.util.validation.isValidNamespace(a.firebase))return d&&d("INVALID_FIREBASE");if(!fb.simplelogin.util.validation.isValidEmail(a.email))return d&&d("INVALID_EMAIL");if(!fb.simplelogin.util.validation.isValidPassword(a.password))return d&&d("INVALID_PASSWORD");this.getTransport_().open(e,a,d)};
fb.simplelogin.providers.Password_.prototype.sendPasswordResetEmail=function(a,d){var e=fb.simplelogin.Vars.getApiHost()+"/auth/firebase/reset_password";if(!fb.simplelogin.util.validation.isValidNamespace(a.firebase))return d&&d("INVALID_FIREBASE");if(!fb.simplelogin.util.validation.isValidEmail(a.email))return d&&d("INVALID_EMAIL");this.getTransport_().open(e,a,d)};fb.simplelogin.providers.Password=new fb.simplelogin.providers.Password_;fb.simplelogin.transports.WindowsMetroAuthBroker_=function(){};
fb.simplelogin.transports.WindowsMetroAuthBroker_.prototype.open=function(a,d,e){var f,g,h,k,l,n;try{f=window.Windows.Foundation.Uri,g=window.Windows.Security.Authentication.Web.WebAuthenticationOptions,h=window.Windows.Security.Authentication.Web.WebAuthenticationBroker,k=h.authenticateAsync}catch(q){return e({code:"WINDOWS_METRO",message:'"Windows.Security.Authentication.Web.WebAuthenticationBroker" required when using Firebase Simple Login in Windows Metro context'})}l=!1;n=function(){var a=Array.prototype.slice.apply(arguments);
l||(l=!0,e.apply(null,a))};a=new f(a+"&transport=internal-redirect-hash");f=new f(fb.simplelogin.Vars.getApiHost()+"/blank/page.html");k(g.none,a,f).done(function(a){var d;if(a&&a.responseData)try{var e=fb.simplelogin.util.misc.parseUrl(a.responseData),f=fb.simplelogin.util.misc.parseQuerystring(e.hash);a={};for(var g in f)a[g]=fb.simplelogin.util.json.parse(decodeURIComponent(f[g]));d=a}catch(h){}d&&d.token&&d.user?n(null,d):d&&d.error?n(d.error):n({code:"RESPONSE_PAYLOAD_ERROR",message:"Unable to parse response payload for Windows."})},
function(a){n({code:"UNKNOWN_ERROR",message:"An unknown error occurred for Windows."})})};fb.simplelogin.transports.WindowsMetroAuthBroker=new fb.simplelogin.transports.WindowsMetroAuthBroker_;goog.string={};goog.string.Unicode={NBSP:"\u00a0"};goog.string.startsWith=function(a,d){return 0==a.lastIndexOf(d,0)};goog.string.endsWith=function(a,d){var e=a.length-d.length;return 0<=e&&a.indexOf(d,e)==e};goog.string.caseInsensitiveStartsWith=function(a,d){return 0==goog.string.caseInsensitiveCompare(d,a.substr(0,d.length))};goog.string.caseInsensitiveEndsWith=function(a,d){return 0==goog.string.caseInsensitiveCompare(d,a.substr(a.length-d.length,d.length))};
goog.string.caseInsensitiveEquals=function(a,d){return a.toLowerCase()==d.toLowerCase()};goog.string.subs=function(a,d){for(var e=a.split("%s"),f="",g=Array.prototype.slice.call(arguments,1);g.length&&1<e.length;)f+=e.shift()+g.shift();return f+e.join("%s")};goog.string.collapseWhitespace=function(a){return a.replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"")};goog.string.isEmpty=function(a){return/^[\s\xa0]*$/.test(a)};goog.string.isEmptySafe=function(a){return goog.string.isEmpty(goog.string.makeSafe(a))};
goog.string.isBreakingWhitespace=function(a){return!/[^\t\n\r ]/.test(a)};goog.string.isAlpha=function(a){return!/[^a-zA-Z]/.test(a)};goog.string.isNumeric=function(a){return!/[^0-9]/.test(a)};goog.string.isAlphaNumeric=function(a){return!/[^a-zA-Z0-9]/.test(a)};goog.string.isSpace=function(a){return" "==a};goog.string.isUnicodeChar=function(a){return 1==a.length&&" "<=a&&"~">=a||"\u0080"<=a&&"\ufffd">=a};goog.string.stripNewlines=function(a){return a.replace(/(\r\n|\r|\n)+/g," ")};
goog.string.canonicalizeNewlines=function(a){return a.replace(/(\r\n|\r|\n)/g,"\n")};goog.string.normalizeWhitespace=function(a){return a.replace(/\xa0|\s/g," ")};goog.string.normalizeSpaces=function(a){return a.replace(/\xa0|[ \t]+/g," ")};goog.string.collapseBreakingSpaces=function(a){return a.replace(/[\t\r\n ]+/g," ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g,"")};goog.string.trim=function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};
goog.string.trimLeft=function(a){return a.replace(/^[\s\xa0]+/,"")};goog.string.trimRight=function(a){return a.replace(/[\s\xa0]+$/,"")};goog.string.caseInsensitiveCompare=function(a,d){var e=String(a).toLowerCase(),f=String(d).toLowerCase();return e<f?-1:e==f?0:1};goog.string.numerateCompareRegExp_=/(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare=function(a,d){if(a==d)return 0;if(!a)return-1;if(!d)return 1;for(var e=a.toLowerCase().match(goog.string.numerateCompareRegExp_),f=d.toLowerCase().match(goog.string.numerateCompareRegExp_),g=Math.min(e.length,f.length),h=0;h<g;h++){var k=e[h],l=f[h];if(k!=l)return e=parseInt(k,10),!isNaN(e)&&(f=parseInt(l,10),!isNaN(f)&&e-f)?e-f:k<l?-1:1}return e.length!=f.length?e.length-f.length:a<d?-1:1};goog.string.urlEncode=function(a){return encodeURIComponent(String(a))};
goog.string.urlDecode=function(a){return decodeURIComponent(a.replace(/\+/g," "))};goog.string.newLineToBr=function(a,d){return a.replace(/(\r\n|\r|\n)/g,d?"<br />":"<br>")};
goog.string.htmlEscape=function(a,d){if(d)return a.replace(goog.string.amperRe_,"&amp;").replace(goog.string.ltRe_,"&lt;").replace(goog.string.gtRe_,"&gt;").replace(goog.string.quotRe_,"&quot;").replace(goog.string.singleQuoteRe_,"&#39;");if(!goog.string.allRe_.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(goog.string.amperRe_,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(goog.string.ltRe_,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(goog.string.gtRe_,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(goog.string.quotRe_,
"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(goog.string.singleQuoteRe_,"&#39;"));return a};goog.string.amperRe_=/&/g;goog.string.ltRe_=/</g;goog.string.gtRe_=/>/g;goog.string.quotRe_=/"/g;goog.string.singleQuoteRe_=/'/g;goog.string.allRe_=/[&<>"']/;goog.string.unescapeEntities=function(a){return goog.string.contains(a,"&")?"document"in goog.global?goog.string.unescapeEntitiesUsingDom_(a):goog.string.unescapePureXmlEntities_(a):a};
goog.string.unescapeEntitiesWithDocument=function(a,d){return goog.string.contains(a,"&")?goog.string.unescapeEntitiesUsingDom_(a,d):a};
goog.string.unescapeEntitiesUsingDom_=function(a,d){var e={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"'},f;f=d?d.createElement("div"):document.createElement("div");return a.replace(goog.string.HTML_ENTITY_PATTERN_,function(a,d){var k=e[a];if(k)return k;if("#"==d.charAt(0)){var l=Number("0"+d.substr(1));isNaN(l)||(k=String.fromCharCode(l))}k||(f.innerHTML=a+" ",k=f.firstChild.nodeValue.slice(0,-1));return e[a]=k})};
goog.string.unescapePureXmlEntities_=function(a){return a.replace(/&([^;]+);/g,function(a,e){switch(e){case "amp":return"&";case "lt":return"<";case "gt":return">";case "quot":return'"';default:if("#"==e.charAt(0)){var f=Number("0"+e.substr(1));if(!isNaN(f))return String.fromCharCode(f)}return a}})};goog.string.HTML_ENTITY_PATTERN_=/&([^;\s<&]+);?/g;goog.string.whitespaceEscape=function(a,d){return goog.string.newLineToBr(a.replace(/  /g," &#160;"),d)};
goog.string.stripQuotes=function(a,d){for(var e=d.length,f=0;f<e;f++){var g=1==e?d:d.charAt(f);if(a.charAt(0)==g&&a.charAt(a.length-1)==g)return a.substring(1,a.length-1)}return a};goog.string.truncate=function(a,d,e){e&&(a=goog.string.unescapeEntities(a));a.length>d&&(a=a.substring(0,d-3)+"...");e&&(a=goog.string.htmlEscape(a));return a};
goog.string.truncateMiddle=function(a,d,e,f){e&&(a=goog.string.unescapeEntities(a));if(f&&a.length>d){f>d&&(f=d);var g=a.length-f;a=a.substring(0,d-f)+"..."+a.substring(g)}else a.length>d&&(f=Math.floor(d/2),g=a.length-f,a=a.substring(0,f+d%2)+"..."+a.substring(g));e&&(a=goog.string.htmlEscape(a));return a};goog.string.specialEscapeChars_={"\x00":"\\0","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\x0B",'"':'\\"',"\\":"\\\\"};goog.string.jsEscapeCache_={"'":"\\'"};
goog.string.quote=function(a){a=String(a);if(a.quote)return a.quote();for(var d=['"'],e=0;e<a.length;e++){var f=a.charAt(e),g=f.charCodeAt(0);d[e+1]=goog.string.specialEscapeChars_[f]||(31<g&&127>g?f:goog.string.escapeChar(f))}d.push('"');return d.join("")};goog.string.escapeString=function(a){for(var d=[],e=0;e<a.length;e++)d[e]=goog.string.escapeChar(a.charAt(e));return d.join("")};
goog.string.escapeChar=function(a){if(a in goog.string.jsEscapeCache_)return goog.string.jsEscapeCache_[a];if(a in goog.string.specialEscapeChars_)return goog.string.jsEscapeCache_[a]=goog.string.specialEscapeChars_[a];var d=a,e=a.charCodeAt(0);if(31<e&&127>e)d=a;else{if(256>e){if(d="\\x",16>e||256<e)d+="0"}else d="\\u",4096>e&&(d+="0");d+=e.toString(16).toUpperCase()}return goog.string.jsEscapeCache_[a]=d};goog.string.toMap=function(a){for(var d={},e=0;e<a.length;e++)d[a.charAt(e)]=!0;return d};
goog.string.contains=function(a,d){return-1!=a.indexOf(d)};goog.string.countOf=function(a,d){return a&&d?a.split(d).length-1:0};goog.string.removeAt=function(a,d,e){var f=a;0<=d&&d<a.length&&0<e&&(f=a.substr(0,d)+a.substr(d+e,a.length-d-e));return f};goog.string.remove=function(a,d){var e=RegExp(goog.string.regExpEscape(d),"");return a.replace(e,"")};goog.string.removeAll=function(a,d){var e=RegExp(goog.string.regExpEscape(d),"g");return a.replace(e,"")};
goog.string.regExpEscape=function(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")};goog.string.repeat=function(a,d){return Array(d+1).join(a)};goog.string.padNumber=function(a,d,e){a=goog.isDef(e)?a.toFixed(e):String(a);e=a.indexOf(".");-1==e&&(e=a.length);return goog.string.repeat("0",Math.max(0,d-e))+a};goog.string.makeSafe=function(a){return null==a?"":String(a)};goog.string.buildString=function(a){return Array.prototype.join.call(arguments,"")};
goog.string.getRandomString=function(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^goog.now()).toString(36)};
goog.string.compareVersions=function(a,d){for(var e=0,f=goog.string.trim(String(a)).split("."),g=goog.string.trim(String(d)).split("."),h=Math.max(f.length,g.length),k=0;0==e&&k<h;k++){var l=f[k]||"",n=g[k]||"",q=RegExp("(\\d*)(\\D*)","g"),s=RegExp("(\\d*)(\\D*)","g");do{var m=q.exec(l)||["","",""],p=s.exec(n)||["","",""];if(0==m[0].length&&0==p[0].length)break;var e=0==m[1].length?0:parseInt(m[1],10),r=0==p[1].length?0:parseInt(p[1],10),e=goog.string.compareElements_(e,r)||goog.string.compareElements_(0==
m[2].length,0==p[2].length)||goog.string.compareElements_(m[2],p[2])}while(0==e)}return e};goog.string.compareElements_=function(a,d){return a<d?-1:a>d?1:0};goog.string.HASHCODE_MAX_=4294967296;goog.string.hashCode=function(a){for(var d=0,e=0;e<a.length;++e)d=31*d+a.charCodeAt(e),d%=goog.string.HASHCODE_MAX_;return d};goog.string.uniqueStringCounter_=2147483648*Math.random()|0;goog.string.createUniqueString=function(){return"goog_"+goog.string.uniqueStringCounter_++};
goog.string.toNumber=function(a){var d=Number(a);return 0==d&&goog.string.isEmpty(a)?NaN:d};goog.string.isLowerCamelCase=function(a){return/^[a-z]+([A-Z][a-z]*)*$/.test(a)};goog.string.isUpperCamelCase=function(a){return/^([A-Z][a-z]*)+$/.test(a)};goog.string.toCamelCase=function(a){return String(a).replace(/\-([a-z])/g,function(a,e){return e.toUpperCase()})};goog.string.toSelectorCase=function(a){return String(a).replace(/([A-Z])/g,"-$1").toLowerCase()};
goog.string.toTitleCase=function(a,d){var e=goog.isString(d)?goog.string.regExpEscape(d):"\\s";return a.replace(RegExp("(^"+(e?"|["+e+"]+":"")+")([a-z])","g"),function(a,d,e){return d+e.toUpperCase()})};goog.string.parseInt=function(a){isFinite(a)&&(a=String(a));return goog.isString(a)?/^\s*-?0x/i.test(a)?parseInt(a,16):parseInt(a,10):NaN};goog.string.splitLimit=function(a,d,e){a=a.split(d);for(var f=[];0<e&&a.length;)f.push(a.shift()),e--;a.length&&f.push(a.join(d));return f};var sessionPersistentStorageKey="firebaseSession",hasLocalStorage=fb.simplelogin.util.env.hasLocalStorage();fb.simplelogin.SessionStore_=function(){};fb.simplelogin.SessionStore_.prototype.set=function(a,d){if(hasLocalStorage)try{localStorage.setItem(sessionPersistentStorageKey,fb.simplelogin.util.json.stringify(a))}catch(e){}};fb.simplelogin.SessionStore_.prototype.get=function(){if(hasLocalStorage){try{var a=localStorage.getItem(sessionPersistentStorageKey);if(a)return fb.simplelogin.util.json.parse(a)}catch(d){}return null}};
fb.simplelogin.SessionStore_.prototype.clear=function(){hasLocalStorage&&localStorage.removeItem(sessionPersistentStorageKey)};fb.simplelogin.SessionStore=new fb.simplelogin.SessionStore_;var CLIENT_VERSION="1.6.4";
fb.simplelogin.client=function(a,d,e,f){function g(a,d,e){setTimeout(function(){a(d,e)},0)}this.mRef=a;this.mNamespace=fb.simplelogin.util.misc.parseSubdomain(a.toString());this.sessionLengthDays=null;window._FirebaseSimpleLogin=window._FirebaseSimpleLogin||{};window._FirebaseSimpleLogin.callbacks=window._FirebaseSimpleLogin.callbacks||[];window._FirebaseSimpleLogin.callbacks.push({cb:d,ctx:e});"file:"!==window.location.protocol||fb.simplelogin.util.env.isPhantomJS()||fb.simplelogin.util.env.isMobileCordovaInAppBrowser()||fb.simplelogin.util.misc.warn("FirebaseSimpleLogin(): Due to browser security restrictions, loading applications via `file://*` URLs will prevent popup-based authentication providers from working properly. When testing locally, you'll need to run a barebones webserver on your machine rather than loading your test files via `file://*`. The easiest way to run a barebones server on your local machine is to `cd` to the root directory of your code and run `python -m SimpleHTTPServer`, which will allow you to access your content via `http://127.0.0.1:8000/*`.");
f&&fb.simplelogin.Vars.setApiHost(f);this.mLoginStateChange=function(a,d){var e=window._FirebaseSimpleLogin.callbacks||[];Array.prototype.slice.apply(arguments);for(var f=0;f<e.length;f++){var q=e[f],s=!!a||"undefined"===typeof q.user;if(!s){var m,p;q.user&&q.user.firebaseAuthToken&&(m=q.user.firebaseAuthToken);d&&d.firebaseAuthToken&&(p=d.firebaseAuthToken);s=(m||p)&&m!==p}window._FirebaseSimpleLogin.callbacks[f].user=d||null;s&&g(goog.bind(q.cb,q.ctx),a,d)}};this.resumeSession()};
fb.simplelogin.client.prototype.setApiHost=function(a){fb.simplelogin.Vars.setApiHost(a)};goog.exportSymbol("fb.simplelogin.client.prototype.setApiHost",fb.simplelogin.client.prototype.setApiHost);
fb.simplelogin.client.prototype.resumeSession=function(){var a=this,d;try{d=sessionStorage.getItem("firebaseRequestId"),sessionStorage.removeItem("firebaseRequestId")}catch(e){}if(d){var f=fb.simplelogin.transports.JSONP;fb.simplelogin.transports.XHR.isAvailable()&&(f=fb.simplelogin.transports.XHR);f.open(fb.simplelogin.Vars.getApiHost()+"/auth/session",{requestId:d,firebase:a.mNamespace},function(d,e){e&&e.token&&e.user?a.attemptAuth(e.token,e.user,!0):d?(fb.simplelogin.SessionStore.clear(),a.mLoginStateChange(d)):
(fb.simplelogin.SessionStore.clear(),a.mLoginStateChange(null,null))})}else(d=fb.simplelogin.SessionStore.get())&&d.token&&d.user?a.attemptAuth(d.token,d.user,!1):a.mLoginStateChange(null,null)};
fb.simplelogin.client.prototype.attemptAuth=function(a,d,e,f,g){var h=this;this.mRef.auth(a,function(k,l){k?(fb.simplelogin.SessionStore.clear(),h.mLoginStateChange(null,null),g&&g()):(e&&fb.simplelogin.SessionStore.set({token:a,user:d,sessionKey:d.sessionKey},h.sessionLengthDays),"function"==typeof l&&l(),delete d.sessionKey,d.firebaseAuthToken=a,h.mLoginStateChange(null,d),f&&f(d))},function(a){fb.simplelogin.SessionStore.clear();h.mLoginStateChange(null,null);g&&g()})};
fb.simplelogin.client.prototype.login=function(){fb.simplelogin.util.validation.validateString("FirebaseSimpleLogin.login()",1,arguments[0],!1);fb.simplelogin.util.validation.validateArgCount("FirebaseSimpleLogin.login()",1,2,arguments.length);var a=arguments[0].toLowerCase(),d=arguments[1]||{};this.sessionLengthDays=d.rememberMe?30:null;switch(a){case "anonymous":return this.loginAnonymously(d);case "facebook-token":return this.loginWithFacebookToken(d);case "github":return this.loginWithGithub(d);
case "google-token":return this.loginWithGoogleToken(d);case "password":return this.loginWithPassword(d);case "twitter-token":return this.loginWithTwitterToken(d);case "facebook":return d.access_token?this.loginWithFacebookToken(d):this.loginWithFacebook(d);case "google":return d.access_token?this.loginWithGoogleToken(d):this.loginWithGoogle(d);case "twitter":return d.oauth_token&&d.oauth_token_secret?this.loginWithTwitterToken(d):this.loginWithTwitter(d);default:throw Error("FirebaseSimpleLogin.login("+
a+") failed: unrecognized authentication provider");}};goog.exportSymbol("fb.simplelogin.client.prototype.login",fb.simplelogin.client.prototype.login);
fb.simplelogin.client.prototype.loginAnonymously=function(a){var d=this;return new fb.simplelogin.util.RSVP.Promise(function(e,f){a.firebase=d.mNamespace;a.v=CLIENT_VERSION;fb.simplelogin.transports.JSONP.open(fb.simplelogin.Vars.getApiHost()+"/auth/anonymous",a,function(a,h){if(a||!h.token){var k=fb.simplelogin.Errors.format(a);d.mLoginStateChange(k,null);f(k)}else d.attemptAuth(h.token,h.user,!0,e,f)})})};
fb.simplelogin.client.prototype.loginWithPassword=function(a){var d=this;return new fb.simplelogin.util.RSVP.Promise(function(e,f){a.firebase=d.mNamespace;a.v=CLIENT_VERSION;fb.simplelogin.providers.Password.login(a,function(a,h){if(a||!h.token){var k=fb.simplelogin.Errors.format(a);d.mLoginStateChange(k,null);f(k)}else d.attemptAuth(h.token,h.user,!0,e,f)})})};fb.simplelogin.client.prototype.loginWithGithub=function(a){a.height=850;a.width=950;return this.loginViaOAuth("github",a)};
fb.simplelogin.client.prototype.loginWithGoogle=function(a){a.height=650;a.width=575;return this.loginViaOAuth("google",a)};fb.simplelogin.client.prototype.loginWithFacebook=function(a){a.height=400;a.width=535;return this.loginViaOAuth("facebook",a)};fb.simplelogin.client.prototype.loginWithTwitter=function(a){return this.loginViaOAuth("twitter",a)};fb.simplelogin.client.prototype.loginWithFacebookToken=function(a){return this.loginViaToken("facebook",a)};
fb.simplelogin.client.prototype.loginWithGoogleToken=function(a){return this.loginViaToken("google",a)};fb.simplelogin.client.prototype.loginWithTwitterToken=function(a){return this.loginViaToken("twitter",a)};fb.simplelogin.client.prototype.logout=function(){fb.simplelogin.SessionStore.clear();this.mRef.unauth();this.mLoginStateChange(null,null)};goog.exportSymbol("fb.simplelogin.client.prototype.logout",fb.simplelogin.client.prototype.logout);
fb.simplelogin.client.prototype.loginViaToken=function(a,d,e){d=d||{};d.v=CLIENT_VERSION;var f=this,g=fb.simplelogin.Vars.getApiHost()+"/auth/"+a+"/token?firebase="+f.mNamespace;return new fb.simplelogin.util.RSVP.Promise(function(a,e){fb.simplelogin.transports.JSONP.open(g,d,function(d,g){if(!d&&g.token&&g.user)f.attemptAuth(g.token,g.user,!0,a,e);else{var q=fb.simplelogin.Errors.format(d);f.mLoginStateChange(q);e(q)}})})};
fb.simplelogin.client.prototype.loginViaOAuth=function(a,d,e){d=d||{};var f=this,g=fb.simplelogin.Vars.getApiHost()+"/auth/"+a+"?firebase="+f.mNamespace;d.scope&&(g+="&scope="+d.scope);g+="&v="+encodeURIComponent(CLIENT_VERSION);a={menubar:0,location:0,resizable:0,scrollbars:1,status:0,dialog:1,width:700,height:375};d.height&&(a.height=d.height,delete d.height);d.width&&(a.width=d.width,delete d.width);e=fb.simplelogin.util.env.isMobileCordovaInAppBrowser()?"mobile-phonegap":fb.simplelogin.util.env.isMobileTriggerIoTab()?
"mobile-triggerio":fb.simplelogin.util.env.isWindowsMetro()?"windows-metro":"desktop";var h;if("desktop"===e){h=fb.simplelogin.transports.WinChan;e=[];for(var k in a)e.push(k+"="+a[k]);d.url+="&transport=winchan";d.relay_url=fb.simplelogin.Vars.getApiHost()+"/auth/channel";d.window_features=e.join(",")}else"mobile-phonegap"===e?h=fb.simplelogin.transports.CordovaInAppBrowser:"mobile-triggerio"===e?h=fb.simplelogin.transports.TriggerIoTab:"windows-metro"===e&&(h=fb.simplelogin.transports.WindowsMetroAuthBroker);
if(d.preferRedirect||fb.simplelogin.util.env.isChromeiOS()||fb.simplelogin.util.env.isWindowsPhone()||fb.simplelogin.util.env.isStandaloneiOS()||fb.simplelogin.util.env.isTwitteriOS()||fb.simplelogin.util.env.isFacebookiOS()){k=goog.string.getRandomString()+goog.string.getRandomString();try{sessionStorage.setItem("firebaseRequestId",k)}catch(l){}g+="&requestId="+k+"&fb_redirect_uri="+encodeURIComponent(window.location.href);window.location=g}else return new fb.simplelogin.util.RSVP.Promise(function(a,
e){h.open(g,d,function(d,g){if(g&&g.token&&g.user)f.attemptAuth(g.token,g.user,!0,a,e);else{var h=d||{code:"UNKNOWN_ERROR",message:"An unknown error occurred."};"unknown closed window"===d?h={code:"USER_DENIED",message:"User cancelled the authentication request."}:g&&g.error&&(h=g.error);h=fb.simplelogin.Errors.format(h);f.mLoginStateChange(h);e(h)}})})};
fb.simplelogin.client.prototype.manageFirebaseUsers=function(a,d,e){d.firebase=this.mNamespace;return new fb.simplelogin.util.RSVP.Promise(function(f,g){fb.simplelogin.providers.Password[a](d,function(a,d){if(a){var l=fb.simplelogin.Errors.format(a);g(l);return e&&e(l,null)}f(d);return e&&e(null,d)})})};fb.simplelogin.client.prototype.createUser=function(a,d,e){return this.manageFirebaseUsers("createUser",{email:a,password:d},e)};goog.exportSymbol("fb.simplelogin.client.prototype.createUser",fb.simplelogin.client.prototype.createUser);
fb.simplelogin.client.prototype.changePassword=function(a,d,e,f){return this.manageFirebaseUsers("changePassword",{email:a,oldPassword:d,newPassword:e},function(a){return f&&f(a)})};goog.exportSymbol("fb.simplelogin.client.prototype.changePassword",fb.simplelogin.client.prototype.changePassword);fb.simplelogin.client.prototype.removeUser=function(a,d,e){return this.manageFirebaseUsers("removeUser",{email:a,password:d},function(a){return e&&e(a)})};
goog.exportSymbol("fb.simplelogin.client.prototype.removeUser",fb.simplelogin.client.prototype.removeUser);fb.simplelogin.client.prototype.sendPasswordResetEmail=function(a,d){return this.manageFirebaseUsers("sendPasswordResetEmail",{email:a},function(a){return d&&d(a)})};goog.exportSymbol("fb.simplelogin.client.prototype.sendPasswordResetEmail",fb.simplelogin.client.prototype.sendPasswordResetEmail);fb.simplelogin.client.onOpen=function(a){fb.simplelogin.transports.WinChan.onOpen(a)};
goog.exportSymbol("fb.simplelogin.client.onOpen",fb.simplelogin.client.onOpen);fb.simplelogin.client.VERSION=function(){return CLIENT_VERSION};goog.exportSymbol("fb.simplelogin.client.VERSION",fb.simplelogin.client.VERSION);var FirebaseSimpleLogin=function(a,d,e,f){fb.simplelogin.util.validation.validateArgCount("new FirebaseSimpleLogin",1,4,arguments.length);fb.simplelogin.util.validation.validateCallback("new FirebaseSimpleLogin",2,d,!1);if(goog.isString(a))throw Error("new FirebaseSimpleLogin(): Oops, it looks like you passed a string instead of a Firebase reference (i.e. new Firebase(<firebaseURL>)).");var g=fb.simplelogin.util.misc.parseSubdomain(a.toString());if(!goog.isString(g))throw Error("new FirebaseSimpleLogin(): First argument must be a valid Firebase reference (i.e. new Firebase(<firebaseURL>)).");
var h=new fb.simplelogin.client(a,d,e,f);return{setApiHost:function(a){fb.simplelogin.util.validation.validateArgCount("FirebaseSimpleLogin.setApiHost",1,1,arguments.length);return h.setApiHost(a)},login:function(){return h.login.apply(h,arguments)},logout:function(){fb.simplelogin.util.validation.validateArgCount("FirebaseSimpleLogin.logout",0,0,arguments.length);return h.logout()},createUser:function(a,d,e){fb.simplelogin.util.validation.validateArgCount("FirebaseSimpleLogin.createUser",2,3,arguments.length);
fb.simplelogin.util.validation.validateCallback("FirebaseSimpleLogin.createUser",3,e,!0);return h.createUser(a,d,e)},changePassword:function(a,d,e,f){fb.simplelogin.util.validation.validateArgCount("FirebaseSimpleLogin.changePassword",3,4,arguments.length);fb.simplelogin.util.validation.validateCallback("FirebaseSimpleLogin.changePassword",4,f,!0);return h.changePassword(a,d,e,f)},removeUser:function(a,d,e){fb.simplelogin.util.validation.validateArgCount("FirebaseSimpleLogin.removeUser",2,3,arguments.length);
fb.simplelogin.util.validation.validateCallback("FirebaseSimpleLogin.removeUser",3,e,!0);return h.removeUser(a,d,e)},sendPasswordResetEmail:function(a,d){fb.simplelogin.util.validation.validateArgCount("FirebaseSimpleLogin.sendPasswordResetEmail",1,2,arguments.length);fb.simplelogin.util.validation.validateCallback("FirebaseSimpleLogin.sendPasswordResetEmail",2,d,!0);return h.sendPasswordResetEmail(a,d)}}};goog.exportSymbol("FirebaseSimpleLogin",FirebaseSimpleLogin);FirebaseSimpleLogin.onOpen=function(a){fb.simplelogin.client.onOpen(a)};
goog.exportProperty(FirebaseSimpleLogin,"onOpen",FirebaseSimpleLogin.onOpen);FirebaseSimpleLogin.VERSION=fb.simplelogin.client.VERSION();})();
;

  
  Polymer('firebase-login', {

    /**
     * Fired when user is logged in
     * 
     * @event login
     */

    /**
     * Fired when user is logged out
     * 
     * @event logout
     */

    /**
     * Fired when an error occurred logging in
     * 
     * @event error
     */

    /**
     * Fired when user is created (password provider type)
     * 
     * @event user-created
     */

    /**
     * Fired when user changes their password (password provider type)
     * 
     * @event password-changed
     */

    /**
     * Fired when password reset email is sent (password provider type)
     * 
     * @event password-reset
     */

    /**
     * Fired when user is removed (password provider type)
     * 
     * @event user-removed
     */
       
    /**
     * Firebase location URL (must have simple login enabled via Forge interface).
     * @attribute location
     * @type String
     */
    location: null,

    /**
     * Default simple login provider type.  May be overridden at `login()`-time.
     * @attribute provider
     * @type String
     */
    provider: 'anonymous',

    /**
     * When logged in, this property reflects the firebase user object.
     * @attribute user
     * @type Object
     */
    user: null,

    /**
     * When true, login will be attempted if login status check determines no user is
     * logged in.  Should generally only be used with provider types that do not present
     * a login UI, such as 'anonymous'.
     * @attribute autoLogin
     * @type Boolean
     */
    autoLogin: false,

    /**
     * When true, login status can be determined by checking `user` property.
     * @attribute statusKnown
     * @type Boolean
     */
    statusKnown: false,

    /**
     * Provider-specific parameters to pass to login.  May be overridden at `login()`-time.
     * @attribute params
     * @type Object
     */
    params: null,

    ready: function() {
      if (!this.location) {
        // FIXME(kschaaf): doesn't seem to be a way to un-register auth callbacks, so
        // for now require a static location (switching locations should be rare)
        console.error("firebase-login requires a static location");
      }
      this.ref = new Firebase(this.location);
      this.auth = new FirebaseSimpleLogin(this.ref, function(error, user) {
        if (error) {
          // an error occurred while attempting login
          this.fire('error', error);
        } else if (user) {
          // user authenticated with Firebase
          this.user = user;
          this.statusKnown = true;
          this.fire('login', {user: user});
        } else {
          this.user = null;
          if (this.statusKnown) {
            this.fire('logout');
          }
          if (this.queuedLogin) {
            this.login(this.queuedLogin.provider, this.queuedLogin.params);
            this.queuedLogin = null;
          } else if (!this.statusKnown && this.autoLogin) {
            this.login();                
          }
          this.statusKnown = true;
        }
      }.bind(this));
      
      window.addEventListener('online', function() {
        this.onlineHandler();
      }.bind(this));
    },

    /**
     * Performs a login attempt, using the `provider` specified via attribute/property,
     * or optionally via `provider` argument to the `login` function.  Optionally, 
     * provider-specific login parameters can be specified via attribute (JSON)/property,
     * or via the `params` argument to the `login` function.
     * 
     * If the login is successful, the `login` event is fired, with `e.detail.user`
     * containing the authenticated user object from Firebase.
     *
     * If login fails, the `error` event is fired, with `e.detail` containing error
     * information supplied from Firebase.
     *
     * If the browswer supports `navigator.onLine` network status reporting and the
     * network is currently offline, the login attempt will be queued until the network
     * is restored.
     *
     * @method login
     * @param {string} provider (optional)
     * @param {string} params (optional)
     */
    login: function(provider, params) {
      if (navigator.onLine === false) {
        this.queuedLogin = {provider: provider, params: params};
      } else {
        var pr = (typeof(provider) === 'string' || provider instanceof String) ? provider : this.provider;
        var pa = ((typeof(provider) === 'string' || provider instanceof String) ? params : provider) || this.params;
        if (typeof pa == 'string') {
          pa = JSON.parse(pa);
        }
        this.auth.login(pr, pa);
      }
    },

    /**
     * Performs a logout attempt.
     * 
     * If the login is successful, the `logout` event is fired.
     *
     * If login fails, the `error` event is fired, with `e.detail` containing error
     * information supplied from Firebase.
     *
     * If the browswer supports `navigator.onLine` network status reporting and the
     * network is currently offline, the logout attempt will be queued until the network
     * is restored.
     *
     * @method logout
     */
    logout: function() {
      if (navigator.onLine === false) {
        this.queuedLogout = true;
      } else {
        this.auth.logout();
      }
    },

    onlineHandler: function() {
      if (this.queuedLogout) {
        this.queuedLogout = false;
        this.logout();
      } else if (this.queuedLogin) {
        this.login(this.queuedLogin.provider, this.queuedLogin.params);
        this.queuedLogin = null;
      }
    },
    
    /**
     * Creates a "password provider"-based user account.
     *
     * If the operation is successful, the `user-created` event is fired.
     *
     * If the operation fails, the `error` event is fired, with `e.detail` 
     * containing error information supplied from Firebase.
     *
     * @method createUser
     * @param {string} email
     * @param {string} password
     */
    createUser: function(email, password) {
        this.auth.createUser(email, password, function(error, user) {
          if (!error) {
            this.fire('user-created', {user: user});
          } else {
            this.fire('error', error);
          }
        }.bind(this));
      },

    /**
     * Changes the password of a "password provider"-based user account.
     *
     * If the operation is successful, the `user-created` event is fired.
     *
     * If the operation fails, the `error` event is fired, with `e.detail` 
     * containing error information supplied from Firebase.
     *
     * @method changePassword
     * @param {string} email
     * @param {string} oldPassword
     * @param {string} newPassword
     */
    changePassword: function(email, oldPassword, newPassword) {
      this.auth.changePassword(email, oldPassword, newPassword, function(error, success) {
        if (!error) {
          this.fire('password-changed');
        } else {
          this.fire('error', error);
        }
      }.bind(this));
    },

    /**
     * Sends a password reset email for a "password provider"-based user account.
     *
     * If the operation is successful, the `user-created` event is fired.
     *
     * If the operation fails, the `error` event is fired, with `e.detail` 
     * containing error information supplied from Firebase.
     *
     * @method sendPasswordResetEmail
     * @param {string} email
     */
    sendPasswordResetEmail: function(email) {
      this.auth.sendPasswordResetEmail(email, function(error, success) {
        if (!error) {
          this.fire('password-reset');
        } else {
          this.fire('error', error);
        }
      }.bind(this));
    },

    /**
     * Removes a "password provider"-based user account.
     *
     * If the operation is successful, the `user-created` event is fired.
     *
     * If the operation fails, the `error` event is fired, with `e.detail` 
     * containing error information supplied from Firebase.
     *
     * @method removeUser
     * @param {string} email
     * @param {string} password
     */
    removeUser: function(email, password) {
      this.auth.removeUser(email, password, function(error, success) {
        if (!error) {
          this.fire('user-removed');
        } else {
          this.fire('error', error);
        }
      }.bind(this));
    }

  });

;

      Polymer('pook-auth-ui', {
        publish: {
          mode: 'login'
        },
        created: function() {
          this.firebase = new Firebase("https://torid-inferno-6070.firebaseio.com/");
        },
        get flash() {
          return document.querySelector('pook-flash');
        },
        get emailField() {
          return this.shadowRoot.querySelector('[value="{{email}}"]');
        },
        get passwordField() {
          return this.shadowRoot.querySelector('[value="{{password}}"]');
        },
        clearErrors: function() {
          this.flash.clear();
          this.emailField.setCustomValidity("");
          this.passwordField.setCustomValidity("");
        },
        loginClick: function() {
          this.flash.clear();
          var THIS = this;
          this.firebase.authWithPassword( {
              email: this.email,
              password: this.password            
            },
            this.loginComplete.bind(this),
            { rememberMe: this.rememberMe }
          );
        },
        loginComplete: function(err, data) {
          if (err)
            return this.onFirebaseError(err);

          this.clearErrors();
          this.flash.message = "You've logged in!";
          window.location.replace( window.location.origin + '/user');
        },
        registerClick: function() {
          var THIS = this;
          this.firebase.createUser( {
              email: this.email,
              password: this.password
            },
            this.registerComplete.bind(this)
          );
        },
        registerComplete: function() {
          this.clearErrors();
          // login user
          this.firebase.authWithPassword({
              email: this.email,
              password: this.password,
              rememberMe: this.rememberMe
            }, 
            this.createUserInDb.bind(this)
          );
          this.flash.message = "Account registered";
        },
        createUserInDb: function(data) {
          var auth = this.firebase.getAuth();
          var userRef = this.firebase.child('users').child(auth.uid).child('account');
          var THIS = this;
          userRef.update( {
              createdAt: Firebase.ServerValue.TIMESTAMP, 
              email: auth.password.email              
            }, 
            function(err) {
              if (err) {
                console.log("Unexpected error saving users data in database", err);
                THIS.onFirebaseError(err);
              }
              else
                window.location.replace( window.location.origin + '/user');
            }
          );          
        },
        forgotPasswordClick: function() {
          this.firebase.resetPassword({
              email: this.email,
              password: this.password
            },
            this.onFirebaseError.bind(this)
          );
        },
        onFirebaseError: function(err) {
          this.clearErrors();
          if (!err)
            return;
          switch(err.code) {
            case 'AUTHENTICATION_DISABLED':
            case 'INVALID_FIREBASE':
            case 'INVALID_ORIGIN':
            case 'UNKNOWN_ERROR':
              this.flash.error = "Login failed because of unexpected server error. Please call us to fix this. " + err.detail.code;
              break;
            case 'INVALID_USER':
            case 'INVALID_EMAIL':
              this.flash.error = "Login failed. Fix your input, and try again.";
              this.emailField.setCustomValidity("Invalid email address.");
              break;
            case 'INVALID_PASSWORD':
              this.flash.error = "Login failed. Fix your input, and try again.";
              this.passwordField.setCustomValidity('Invalid password');
              break;
            case 'EMAIL_TAKEN':
              this.flash.error = "This email has already been registered. Try logging in instead";
              this.mode = 'login';
              break;
            default:
              console.log(err.detail.code);
              debugger;
         }
        },
        onPasswordReset: function() {
          this.clearErrors();
          this.flash.message = "Check your email " + this.email + " for password reset.";
          this.mode = 'login';
        },
        showForgotPassword: function() {
          this.mode = 'forgotPassword';
        },
        showRegister: function() {
          this.mode = 'register';
        },
        showLogin: function() {
          this.mode = 'login';
        }
      });
  ;

	Polymer('pook-body-file-drop',{
		publish: {
			/** 
			 * filter acceptable file types, default to images 
			 * @attribute fileTypeRegex
			 * @type string
			 * @default image files
			 */
			fileTypeRegex: "image/(png|jpeg|gif)"
		},
		ready: function(){
			var listen = function(evName) {
				document.addEventListener(evName, this[evName].bind(this));
			}.bind(this);
			listen('dragenter');
			// listen('dragleave');
			listen('dragover');
			listen('drop');
			listen('dragleave');
		},
		dragenter: function(ev) {
			this.isDragging = this.getFiles(ev);
			ev.preventDefault();
		},
		dragover: function(ev) {
			if (this.isDragging) {
				document.body.setAttribute('drop-active', 1);
				ev.preventDefault();
			}
		},
		dragleave: function(ev) {
			if (this.isDragging)
				document.body.removeAttribute('drop-active');
		},
		drop: function(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			document.body.removeAttribute('drop-active');
			// console.log('drop');

			var files = this.applyFileTypeFilter( this.getFiles(ev) );
			if (!files)
				document.querySelector('pook-flash').warn = 'Files not uploaded. Files must be images (jpg/gif/png';
			else {
	      for (var i=0; i<files.length; i++)
	      	this.fire('file-dropped', files[i]);
			}
		},
		// returns array of files, or null
		getFiles: function(ev) {
			var dataTransfer = ev.dataTransfer;
			if (dataTransfer.files && dataTransfer.files.length > 0) {
				// console.log('got files');
				return dataTransfer.files;
			}
			else if (dataTransfer.types) {
				// console.log('got file type');
				if ('contains' in dataTransfer.types)	// Firefox
					return dataTransfer.types.contains("Files");
				else // Chrome
					return dataTransfer.types.indexOf("Files") != -1;
			}
			return null;
		},
		// filters
		applyFileTypeFilter: function(files) {
			if (!files)
				return null;
			var retVal = [];
			for (var i=0; i<files.length; i++) {
				var f = files.item(i);
				if (f.type.match( this.fileTypeRegex ))
					retVal.push(f);
			}
			return retVal;
		}
	});
	;

    (function() {

      function findUnregisteredCustomElements(el) {
        if (el.constructor == HTMLElement) {
          console.error("Found unregistered custom element:", el);
        }
      }
      
      function isCustomEl(el) {
        return el.localName.indexOf('-') != -1 || el.getAttribute('is');
      }
      
      function checkCustomElements() {
        var allCustomElements = document.querySelectorAll('html /deep/ *');
        allCustomElements = Array.prototype.slice.call(allCustomElements).filter(function(el) {
          return isCustomEl(el);
        });
        for (var i = 0, el; el = allCustomElements[i]; ++i)
          findUnregisteredCustomElements(el);        
      }
      
      document.addEventListener('polymer-ready', function() {
        checkCustomElements();
        var waitFor = Polymer.waitingFor();
        if (waitFor.length > 0)
          console.error("Unresolved elements", waitFor);
      });

      Polymer('pook-debug', {});

    })();
  ;

    Polymer('paper-icon-button',{

      publish: {

        /**
         * The URL of an image for the icon. If the src property is specified,
         * the icon property should not be.
         *
         * @attribute src
         * @type string
         * @default ''
         */
        src: '',

        /**
         * Specifies the icon name or index in the set of icons available in
         * the icon's icon set. If the icon property is specified,
         * the src property should not be.
         *
         * @attribute icon
         * @type string
         * @default ''
         */
        icon: '',

        recenteringTouch: true,
        fill: false

      },

      iconChanged: function(oldIcon) {
        this.setAttribute('aria-label', this.icon);
      }

    });

  ;

		Polymer('pook-flash', {
			error: '',
			warn: '',
			message: '',
			closeError: function() { this.error = ''},
			closeWarn: function() { this.warn = ''},
			closeMessage: function() { this.message = ''},
			clear: function() { this.error = this.warn = this.message = ''}
		});
	;
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
/*jshint onevar: false, indent:4 */
/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(done) );
        });
        function done(err) {
          if (err) {
              callback(err);
              callback = function () {};
          }
          else {
              completed += 1;
              if (completed >= arr.length) {
                  callback();
              }
          }
        }
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        if (!callback) {
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err) {
                    callback(err);
                });
            });
        } else {
            var results = [];
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        var remainingTasks = keys.length
        if (!remainingTasks) {
            return callback();
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            remainingTasks--
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (!remainingTasks) {
                var theCallback = callback;
                // prevent final callback from calling itself if it errors
                callback = function () {};

                theCallback(null, results);
            }
        });

        _each(keys, function (k) {
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        // Use defaults if times not passed
        if (typeof times === 'function') {
            callback = task;
            task = times;
            times = DEFAULT_TIMES;
        }
        // Make sure times is a number
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function(wrappedCallback, wrappedResults) {
            var retryAttempt = function(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            };
            while (times) {
                attempts.push(retryAttempt(task, !(times-=1)));
            }
            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || callback)(data.err, data.result);
            });
        }
        // If a callback is passed, run this as a controll flow
        return callback ? wrappedTask() : wrappedTask
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (test.apply(null, args)) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (!test.apply(null, args)) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            started: false,
            paused: false,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            kill: function () {
              q.drain = null;
              q.tasks = [];
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (!q.paused && workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                if (q.paused === true) { return; }
                q.paused = true;
                q.process();
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                q.process();
            }
        };
        return q;
    };
    
    async.priorityQueue = function (worker, concurrency) {
        
        function _compareTasks(a, b){
          return a.priority - b.priority;
        };
        
        function _binarySearch(sequence, item, compare) {
          var beg = -1,
              end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + ((end - beg + 1) >>> 1);
            if (compare(item, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }
        
        function _insert(q, data, priority, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  priority: priority,
                  callback: typeof callback === 'function' ? callback : null
              };
              
              q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }
        
        // Start with a normal queue
        var q = async.queue(worker, concurrency);
        
        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
          _insert(q, data, priority, callback);
        };
        
        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            drained: true,
            push: function (data, callback) {
                if (!_isArray(data)) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    cargo.drained = false;
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain && !cargo.drained) cargo.drain();
                    cargo.drained = true;
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0, tasks.length);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                async.nextTick(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    async.compose = function (/* functions... */) {
      return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());
;

  (function() {

  "use strict";

  // Firebase server
  var gFireServer = 'https://torid-inferno-6070.firebaseio.com/';

  // Shared user information
  var gUserInfo = {
    /**
     * uid can have three values:
     * '' means uninitialized
     * 'anonymous' means user not logged in
     * everything else is auth.uid
     */
      uid: '',
      email: '' 
  };
 
  /* 
  Shared databases as firebase-element objects
  state can have 3 values:
  false: database has not been requested
  true: database has been requested
  object: this is the database, firebase-element
  databases are created when user logged in && requested with requestDatabase  user is logged in, 
  */  
  var gDatabases = {
    account: false,
    user: false,
    userPhotos: false
  };

  /* 
    Cache of pook-proxy-photo objects
     Use this to access photo data. requestPhotoProxy() requests data in cache
  */
  var gPhotoCache = {
    // photoId: pook-proxy-photo
  }

  /*
   * exif parser worker
   */
  var gExifWorker;
  function initExifWorker() {
    if (gExifWorker !== undefined)
      return console.error("initExifWorker called multiple times");
    gExifWorker = new Worker('/elements/exif-worker.js');
    gExifWorker.addEventListener('message', function(ev) {
      switch(ev.data.action) {
        case 'parsed':
          if (gPhotoCache[ev.data.photoId]) {
            // console.log('got exifParse', ev.data.exif);
            gPhotoCache[ ev.data.photoId ].setLocalExifData(ev.data.exif);
          }
          else
            console.warn('photo parsed, but no photo in cache', photoId);
          break;
        default:
          console.warn('unknown message', ev.data);
      }
    });
  }

  /**
   * task: { photoId: id, file: FileObject }
   */
  var PhotoUploadProcessor = function(task, done) {

    function processSuccess(xhr) {
      if (gPhotoCache[task.photoId]) {
        /* xhr response:
        {"msg":"Photo created","item":{"dateTime":"2011:04:19 20:59:58","dateTimeOriginal":"2010:12:20 17:00:00","width":3648,"height":2736,"contentType":"image/jpeg","dateTaken":"2010-12-21T01:00:00.000Z","md5":"82cb9d01c03c7c80e3d1852ae205671a","s3id":"PoLBWE_fiXbmipGaaa.jpg"}
        */
        var response = JSON.parse(xhr.response);
        var item = response.item;
        var newData = {
          s3: item.s3id,
          width: item.width,
          height: item.height
        };
        ['dateTaken', 'caption', 'latitude', 'longitude','latitudeRef','longitudeRef'].forEach( function(k) {
          if (k in item)
            newData[k] = item[k];
        });
        // console.log(newData);
        gPhotoCache[task.photoId].progress = -1;
        gPhotoCache[task.photoId].ref.update(newData, function(err) {
          if (err)
            console.error("error updating ", gPhotoCache[taskphotoId].location, err);
        });
      }
      else {
        console.warn("missing photo after upload");
      }
      done();
    };

    function processFaiure(xhr, ev) {
      console.error('photo upload failed', task);
      if (gPhotoCache[task.photoId]) {
        gPhotoCache[photoId].progress = -1;
      }
      done(new Error("Task failed"));
      // push the task back on the queue
      task.failCount = ('failCount' in task) ? ( task.failCount + 1 ) : 1;
      if (task.failCount < 5)
        PhotoUploadQueue.unshift(task);
      else if (gPhotoCache[task.photoId])
        gPhotoCache[task.photoId].uploadFailed();
    }

    function start() {
      var fd = new FormData();
      fd.append('myPhoto', task.file);

      var xhr = new XMLHttpRequest();
      // success/failure
      xhr.addEventListener('load', function onload(e) {
        switch(this.status) {
          case 200:
            processSuccess(xhr);
            break;
          default:
            processFaiure(xhr, e);
            break;
        }
      });
      // xhr.addEventListener('readystatechange', function readystate(ev) {
      //   if (xhr.readystate === 4) // DONE
      //     THIS.completedTask();
      // });
      // upload progress
      xhr.upload.addEventListener('progress', function progress(ev) {
        var photo = gPhotoCache[task.photoId];
        if (!photo)
          return;
        if (ev.lengthComputable && ev.total != 0)
          photo.progress = ev.loaded / ev.total;
        else
          photo.progress = -1;
      });
      xhr.open('POST', '/photos');
      xhr.send(unwrap(fd));     
    };

    start();
  }

  var PhotoUploadQueue = async.queue( PhotoUploadProcessor, 2);

  // Pause photo uploads when not online
  window.addEventListener('offline', function(ev) {
    console.log('paused');
    PhotoUploadQueue.pause();
  });
  window.addEventListener('online', function(ev) {
    console.log('resumed');
    PhotoUploadQueue.resume();
  });

  /* 
   * authClient listens to authentication events
   */
  var gAuthClient;  // FirebaseSimpleLogin, used to listen to authentication events
  function initAuth() {
    if (gAuthClient) // only init once
      return;
    // Listen to authentication events
    gAuthClient = new Firebase(gFireServer);
    gAuthClient.onAuth( function(user) {
        gUserInfo.uid = user ? user.uid : 'anonymous';
        gUserInfo.email = user ? user.password.email : '';
      }
    );
  }
  initAuth();

  var PookFireUser = {
    publish: {
      /** if set, will redirect to anonRedirect path if user is 'anonymous' */
      anonRedirect: '',
      userInfo: false,
      databases: false,
      photoCache: { value: {}}
    },
    computed: {
      uid: 'userInfo.uid',
      email: 'userInfo.email',
      account: "databases['account'].data",
      userPhotos: "databases['userPhotos'].data"
    },
    observe: {
      uid: 'userStatusChanged'
    },
    created: function() {
      this.userInfo = gUserInfo;
      this.databases = gDatabases;
      this.photoCache = gPhotoCache;
    },
    userStatusChanged: function() {
      // console.log("userStatusChanged", this.uid);
      this.connectActiveDatabases();
      // redirect anonymous if necessary
      if (this.uid === 'anonymous' && this.anonRedirect != '')
        window.location.replace(window.location.origin + this.anonRedirect);
    },
    userPhotosChanged: function() {
      // console.log('userPhotosChanged');
    },
    requestDatabase: function(type) {
      if (!(type in this.databases))
        return console.error("bad database request", type);
      // console.log('requestDatabase:', type);
      if (this.databases[type] === false)
        this.databases[type] = true;
      this.connectActiveDatabases();
    },
    connectActiveDatabases: function() {
      if (this.uid === 'anonymous' || this.uid === '') {
        // no user, remove active databases
        for (var k in this.databases)
          if ((typeof this.databases[k]) === 'object')
            this.databases[k] = true;
      }
      else {
        for (var k in this.databases)
          if (this.databases[k] === true) {
            this.databases[k] = document.createElement('firebase-element');
            this.databases[k].location = this.getDatabaseUrl(k);
            // this.databases[k].log = true;
          }
      }
    },
    getDatabaseUrl: function(type, options) {
      switch(type) {
        case 'user':
          console.error('user not writable by security rules');
          return gFireServer + "users/" + this.uid;
        case 'account':
          return gFireServer + "users/" + this.uid + "/account";
        case 'userPhotos':
          return gFireServer + "photos/" + this.uid;
        case 'onePhoto': // options is photoId
          return gFireServer + "photos/" + this.uid + "/" + options;
        default:
          console.error("unknown database type", type);
      }
    },
    getFirebase: function(type) {
      if (!(type in this.firebases))
        return console.error('bad firebase type', type);
      if (!this.firebases[type])
        this.firebases[type] = new Firebase(this.getDatabaseUrl(type));
      return this.firebases[type];
    },
    requestPhotoProxy: function(photoId) {
      if (photoId in this.photoCache)
        return;
      this.photoCache[photoId] = document.createElement('pook-proxy-photo');
      this.photoCache[photoId].user = this;
      this.photoCache[photoId].photoId = photoId;
    },
    logout: function() {
      gAuthClient.unauth();
    },
    addPhotoFile: function(file) {
      this.requestDatabase('userPhotos');

      // if databases not ready, reschedule
      if (!this.databases['userPhotos'] || 
          !this.databases['userPhotos'].ref) {
        this.async(function() {
          this.addPhotoFile(file);
        }, null, 1000);
        return;
      }
      var photoRec = {
        createdAt: Firebase.ServerValue.TIMESTAMP,
        displayName: file.name
      }

      // add to user's photos
      var photoRef = this.databases['userPhotos'].ref.push(photoRec);
      // request a proxy
      this.requestPhotoProxy(photoRef.name());
      this.exifWorker.postMessage({action: 'parse', file: file, photoId: photoRef.name() });
      // upload via xhr
      PhotoUploadQueue.push( {photoId: photoRef.name(), file: file});
    },
    randomString: function (len, charSet) {
      charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var randomString = '';
      for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    },
    get exifWorker() {
      if (gExifWorker === undefined)
        initExifWorker();
      return gExifWorker;
    }
  }

  Polymer(PookFireUser);

  })();
  ;

  (function() {
    "use strict";
    Polymer('pook-proxy-photo',{
      publish: {
        photoId: '',
        user: null,
        s3url: "http://pookio-test.s3-website-us-west-2.amazonaws.com/",
        /*
        localExif information:
        dateTime: "2014:09:24 08:02:21"
        dateTimeOriginal: "2014:09:24 08:02:21"
        description: null
        displayName: "IMG_3232.JPG"
        orientation: 6
        thumbnail_url: "data:image/jpeg,%ff%dc%d7%23%36%3f%ff%d9"
        title: null
        userComment: undefined
        */        
        localExif: null,
        localImage: null,
        maxLocalImageHeight: 512,
        progress: -1 // progress 0-100, -1 when inactive
      },
      computed: {
        iconInfo: 'computeIconInfo(data.s3, localImage)'
      },
      userChanged: function() {
        this.openFirebase();
      },
      photoIdChanged: function() {
        this.openFirebase();
      },
      openFirebase: function() {
        if (this.photoId == '' || this.user == null )
          return;
        this.location = this.user.getDatabaseUrl('onePhoto', this.photoId)
      },
      setLocalExifData: function(exif, file) {
        this.localExif = exif;
        this.localFile = file;
        this.generateLocalThumbnail();
      },
      dataThumbnailFromImage: function(img) {
        // skip if we have real thumbnails
        if (this.data && this.data.s3) 
          return;
        var desiredHeight = Math.min( this.maxLocalImageHeight, img.naturalHeight);
        var orientation = this.localExif.orientation;
        var swapAxes = orientation == 6 || orientation == 8
        var imageWidth = img.naturalWidth;
        var imageHeight = img.naturalHeight;
        var scale = Math.min(1, desiredHeight / imageHeight);
        var rot = 0;
        var trans = {x:0, y:0};
        var drawLoc = {x:0, y:0};

        var canvasWidth = imageWidth * scale;
        var canvasHeight = imageHeight * scale;

        function swapWidthHeight() {
          var tmp = canvasWidth;
          canvasWidth = canvasHeight;
          canvasHeight = tmp;
        }

        switch (orientation) {
        case 1: // no rotation
          break;
        case 6:
            rot = Math.PI / 2; // 90deg
            swapWidthHeight();
            trans = { x: canvasWidth / 2, y: canvasHeight/2 };
            drawLoc = { x: -imageWidth * scale /2, y: -imageHeight * scale /2 };
            break;
        case 3:
            rot = Math.PI;
            trans = {x:canvasWidth / 2, y:canvasHeight / 2};
            drawLoc = { x: -imageWidth * scale / 2, y: -imageHeight * scale / 2 };
            break;
        case 8:
            rot = Math.PI * 3 / 2;
            swapWidthHeight();
            trans = {x:canvasWidth / 2, y:canvasHeight / 2};
            drawLoc = {x:-imageWidth * scale /2, y:-imageHeight * scale /2};
            break;
        default:
          console.warn("unknown orientation", orientation);break;
        }

        var c = document.createElement('canvas');
        c.setAttribute('width', canvasWidth);
        c.setAttribute('height', canvasHeight);
        var ctx = c.getContext('2d');
        ctx.translate(trans.x,trans.y)
        ctx.rotate(rot);
        ctx.drawImage(img,drawLoc.x,drawLoc.y, imageWidth * scale, imageHeight * scale);

        this.localImage = {
          src: c.toDataURL('image/jpeg'),
          width: canvasWidth,
          height: canvasHeight
        }
        // this._setDataUrl( c.toDataURL('image/jpeg'), canvasWidth, canvasHeight);
      },
      dataThumbnailFromFile: function() {
        console.log("dataThumbnailFromFile");
        var img = new Image();
        var fileUrl = window.URL.createObjectURL(this.localFile);
        if (!fileUrl)
          return console.error('cant create localFile url');
        var THIS = this;
        img.onload = function() {
          THIS.dataThumbnailFromFile(img);
          window.URL.revokeObjectURL(fileUrl);
        };
        img.onerror = function() {
          THIS.revokeFileUrl(fileUrl);
          console.warn("Error loading image from local file");
        };
        img.src = fileUrl; // TODO throttle
      },
      generateLocalThumbnail: function() {
        if (this.localExif.thumbnail_url) {
          var THIS = this;
          var img = new Image();
          img.onload = function() { THIS.dataThumbnailFromImage(img); };
          img.onerror = function() { THIS._createDataUrlFromLocalFile(); };
          img.src = this.localExif.thumbnail_url;
        }
        else
          this.dataThumbnailFromFile();
      },
      computeIconInfo: function(s3, localImage) {
        if (s3) {
          return {
            src: this.s3url + s3 + "~256",
            height: 256,
            width: Math.round( 256 * this.data.width / this.data.height)
          }
        }
        else if (localImage) {
          return localImage;
        }
        else {
          return  {
            src: this.s3url + 'loading.jpg',
            width: 256,
            height: 256
          }
        }
      },
      uploadFailed: function() {
        console.error("TODO what do we do when upload fails?");
      }
    });
  })();
  ;

    Polymer('core-media-query', {

      /**
       * The Boolean return value of the media query
       *
       * @attribute queryMatches
       * @type Boolean
       * @default false
       */
      queryMatches: false,

      /**
       * The CSS media query to evaulate
       *
       * @attribute query
       * @type string
       * @default ''
       */
      query: '',
      ready: function() {
        this._mqHandler = this.queryHandler.bind(this);
        this._mq = null;
      },
      queryChanged: function() {
        if (this._mq) {
          this._mq.removeListener(this._mqHandler);
        }
        var query = this.query;
        if (query[0] !== '(') {
          query = '(' + this.query + ')';
        }
        this._mq = window.matchMedia(query);
        this._mq.addListener(this._mqHandler);
        this.queryHandler(this._mq);
      },
      queryHandler: function(mq) {
        this.queryMatches = mq.matches;
        this.asyncFire('core-media-change', mq);
      }
    });
  ;

    Polymer('core-selection', {
      /**
       * If true, multiple selections are allowed.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,
      ready: function() {
        this.clear();
      },
      clear: function() {
        this.selection = [];
      },
      /**
       * Retrieves the selected item(s).
       * @method getSelection
       * @returns Returns the selected item(s). If the multi property is true,
       * getSelection will return an array, otherwise it will return 
       * the selected item or undefined if there is no selection.
      */
      getSelection: function() {
        return this.multi ? this.selection : this.selection[0];
      },
      /**
       * Indicates if a given item is selected.
       * @method isSelected
       * @param {any} item The item whose selection state should be checked.
       * @returns Returns true if `item` is selected.
      */
      isSelected: function(item) {
        return this.selection.indexOf(item) >= 0;
      },
      setItemSelected: function(item, isSelected) {
        if (item !== undefined && item !== null) {
          if (isSelected) {
            this.selection.push(item);
          } else {
            var i = this.selection.indexOf(item);
            if (i >= 0) {
              this.selection.splice(i, 1);
            }
          }
          this.fire("core-select", {isSelected: isSelected, item: item});
        }
      },
      /**
       * Set the selection state for a given `item`. If the multi property
       * is true, then the selected state of `item` will be toggled; otherwise
       * the `item` will be selected.
       * @method select
       * @param {any} item: The item to select.
      */
      select: function(item) {
        if (this.multi) {
          this.toggle(item);
        } else if (this.getSelection() !== item) {
          this.setItemSelected(this.getSelection(), false);
          this.setItemSelected(item, true);
        }
      },
      /**
       * Toggles the selection state for `item`.
       * @method toggle
       * @param {any} item: The item to toggle.
      */
      toggle: function(item) {
        this.setItemSelected(item, !this.isSelected(item));
      }
    });
  ;


    Polymer('core-selector', {

      /**
       * Gets or sets the selected element.  Default to use the index
       * of the item element.
       *
       * If you want a specific attribute value of the element to be
       * used instead of index, set "valueattr" to that attribute name.
       *
       * Example:
       *
       *     <core-selector valueattr="label" selected="foo">
       *       <div label="foo"></div>
       *       <div label="bar"></div>
       *       <div label="zot"></div>
       *     </core-selector>
       *
       * In multi-selection this should be an array of values.
       *
       * Example:
       *
       *     <core-selector id="selector" valueattr="label" multi>
       *       <div label="foo"></div>
       *       <div label="bar"></div>
       *       <div label="zot"></div>
       *     </core-selector>
       *
       *     this.$.selector.selected = ['foo', 'zot'];
       *
       * @attribute selected
       * @type Object
       * @default null
       */
      selected: null,

      /**
       * If true, multiple selections are allowed.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,

      /**
       * Specifies the attribute to be used for "selected" attribute.
       *
       * @attribute valueattr
       * @type string
       * @default 'name'
       */
      valueattr: 'name',

      /**
       * Specifies the CSS class to be used to add to the selected element.
       * 
       * @attribute selectedClass
       * @type string
       * @default 'core-selected'
       */
      selectedClass: 'core-selected',

      /**
       * Specifies the property to be used to set on the selected element
       * to indicate its active state.
       *
       * @attribute selectedProperty
       * @type string
       * @default ''
       */
      selectedProperty: '',

      /**
       * Specifies the attribute to set on the selected element to indicate
       * its active state.
       *
       * @attribute selectedAttribute
       * @type string
       * @default 'active'
       */
      selectedAttribute: 'active',

      /**
       * Returns the currently selected element. In multi-selection this returns
       * an array of selected elements.
       * Note that you should not use this to set the selection. Instead use
       * `selected`.
       * 
       * @attribute selectedItem
       * @type Object
       * @default null
       */
      selectedItem: null,

      /**
       * In single selection, this returns the model associated with the
       * selected element.
       * Note that you should not use this to set the selection. Instead use 
       * `selected`.
       * 
       * @attribute selectedModel
       * @type Object
       * @default null
       */
      selectedModel: null,

      /**
       * In single selection, this returns the selected index.
       * Note that you should not use this to set the selection. Instead use
       * `selected`.
       *
       * @attribute selectedIndex
       * @type number
       * @default -1
       */
      selectedIndex: -1,

      /**
       * Nodes with local name that are in the list will not be included 
       * in the selection items.  In the following example, `items` returns four
       * `core-item`'s and doesn't include `h3` and `hr`.
       *
       *     <core-selector excludedLocalNames="h3 hr">
       *       <h3>Header</h3>
       *       <core-item>Item1</core-item>
       *       <core-item>Item2</core-item>
       *       <hr>
       *       <core-item>Item3</core-item>
       *       <core-item>Item4</core-item>
       *     </core-selector>
       *
       * @attribute excludedLocalNames
       * @type string
       * @default ''
       */
      excludedLocalNames: '',

      /**
       * The target element that contains items.  If this is not set 
       * core-selector is the container.
       * 
       * @attribute target
       * @type Object
       * @default null
       */
      target: null,

      /**
       * This can be used to query nodes from the target node to be used for 
       * selection items.  Note this only works if `target` is set
       * and is not `core-selector` itself.
       *
       * Example:
       *
       *     <core-selector target="{{$.myForm}}" itemsSelector="input[type=radio]"></core-selector>
       *     <form id="myForm">
       *       <label><input type="radio" name="color" value="red"> Red</label> <br>
       *       <label><input type="radio" name="color" value="green"> Green</label> <br>
       *       <label><input type="radio" name="color" value="blue"> Blue</label> <br>
       *       <p>color = {{color}}</p>
       *     </form>
       * 
       * @attribute itemsSelector
       * @type string
       * @default ''
       */
      itemsSelector: '',

      /**
       * The event that would be fired from the item element to indicate
       * it is being selected.
       *
       * @attribute activateEvent
       * @type string
       * @default 'tap'
       */
      activateEvent: 'tap',

      /**
       * Set this to true to disallow changing the selection via the
       * `activateEvent`.
       *
       * @attribute notap
       * @type boolean
       * @default false
       */
      notap: false,

      defaultExcludedLocalNames: 'template',

      ready: function() {
        this.activateListener = this.activateHandler.bind(this);
        this.itemFilter = this.filterItem.bind(this);
        this.excludedLocalNamesChanged();
        this.observer = new MutationObserver(this.updateSelected.bind(this));
        if (!this.target) {
          this.target = this;
        }
      },

      /**
       * Returns an array of all items.
       *
       * @property items
       */
      get items() {
        if (!this.target) {
          return [];
        }
        var nodes = this.target !== this ? (this.itemsSelector ? 
            this.target.querySelectorAll(this.itemsSelector) : 
                this.target.children) : this.$.items.getDistributedNodes();
        return Array.prototype.filter.call(nodes, this.itemFilter);
      },

      filterItem: function(node) {
        return !this._excludedNames[node.localName];
      },

      excludedLocalNamesChanged: function() {
        this._excludedNames = {};
        var s = this.defaultExcludedLocalNames;
        if (this.excludedLocalNames) {
          s += ' ' + this.excludedLocalNames;
        }
        s.split(/\s+/g).forEach(function(n) {
          this._excludedNames[n] = 1;
        }, this);
      },

      targetChanged: function(old) {
        if (old) {
          this.removeListener(old);
          this.observer.disconnect();
          this.clearSelection();
        }
        if (this.target) {
          this.addListener(this.target);
          this.observer.observe(this.target, {childList: true});
          this.updateSelected();
        }
      },

      addListener: function(node) {
        Polymer.addEventListener(node, this.activateEvent, this.activateListener);
      },

      removeListener: function(node) {
        Polymer.removeEventListener(node, this.activateEvent, this.activateListener);
      },

      /**
       * Returns the selected item(s). If the `multi` property is true,
       * this will return an array, otherwise it will return 
       * the selected item or undefined if there is no selection.
       */
      get selection() {
        return this.$.selection.getSelection();
      },

      selectedChanged: function() {
        this.updateSelected();
      },

      updateSelected: function() {
        this.validateSelected();
        if (this.multi) {
          this.clearSelection();
          this.selected && this.selected.forEach(function(s) {
            this.valueToSelection(s);
          }, this);
        } else {
          this.valueToSelection(this.selected);
        }
      },

      validateSelected: function() {
        // convert to an array for multi-selection
        if (this.multi && !Array.isArray(this.selected) && 
            this.selected !== null && this.selected !== undefined) {
          this.selected = [this.selected];
        }
      },

      clearSelection: function() {
        if (this.multi) {
          this.selection.slice().forEach(function(s) {
            this.$.selection.setItemSelected(s, false);
          }, this);
        } else {
          this.$.selection.setItemSelected(this.selection, false);
        }
        this.selectedItem = null;
        this.$.selection.clear();
      },

      valueToSelection: function(value) {
        var item = (value === null || value === undefined) ? 
            null : this.items[this.valueToIndex(value)];
        this.$.selection.select(item);
      },

      updateSelectedItem: function() {
        this.selectedItem = this.selection;
      },

      selectedItemChanged: function() {
        if (this.selectedItem) {
          var t = this.selectedItem.templateInstance;
          this.selectedModel = t ? t.model : undefined;
        } else {
          this.selectedModel = null;
        }
        this.selectedIndex = this.selectedItem ? 
            parseInt(this.valueToIndex(this.selected)) : -1;
      },

      valueToIndex: function(value) {
        // find an item with value == value and return it's index
        for (var i=0, items=this.items, c; (c=items[i]); i++) {
          if (this.valueForNode(c) == value) {
            return i;
          }
        }
        // if no item found, the value itself is probably the index
        return value;
      },

      valueForNode: function(node) {
        return node[this.valueattr] || node.getAttribute(this.valueattr);
      },

      // events fired from <core-selection> object
      selectionSelect: function(e, detail) {
        this.updateSelectedItem();
        if (detail.item) {
          this.applySelection(detail.item, detail.isSelected);
        }
      },

      applySelection: function(item, isSelected) {
        if (this.selectedClass) {
          item.classList.toggle(this.selectedClass, isSelected);
        }
        if (this.selectedProperty) {
          item[this.selectedProperty] = isSelected;
        }
        if (this.selectedAttribute && item.setAttribute) {
          if (isSelected) {
            item.setAttribute(this.selectedAttribute, '');
          } else {
            item.removeAttribute(this.selectedAttribute);
          }
        }
      },

      // event fired from host
      activateHandler: function(e) {
        if (!this.notap) {
          var i = this.findDistributedTarget(e.target, this.items);
          if (i >= 0) {
            var item = this.items[i];
            var s = this.valueForNode(item) || i;
            if (this.multi) {
              if (this.selected) {
                this.addRemoveSelected(s);
              } else {
                this.selected = [s];
              }
            } else {
              this.selected = s;
            }
            this.asyncFire('core-activate', {item: item});
          }
        }
      },

      addRemoveSelected: function(value) {
        var i = this.selected.indexOf(value);
        if (i >= 0) {
          this.selected.splice(i, 1);
        } else {
          this.selected.push(value);
        }
        this.valueToSelection(value);
      },

      findDistributedTarget: function(target, nodes) {
        // find first ancestor of target (including itself) that
        // is in nodes, if any
        while (target && target != this) {
          var i = Array.prototype.indexOf.call(nodes, target);
          if (i >= 0) {
            return i;
          }
          target = target.parentNode;
        }
      },
      
      selectIndex: function(index) {
        var item = this.items[index];
        if (item) {
          this.selected = this.valueForNode(item) || index;
          return item;
        }
      },
      
      /**
       * Selects the previous item.  This should be used in single selection only.
       *
       * @method selectPrevious
       * @param {boolean} wrap if true and it is already at the first item, wrap to the end
       * @returns the previous item or undefined if there is none
       */
      selectPrevious: function(wrap) {
        var i = wrap && !this.selectedIndex ? this.items.length - 1 : this.selectedIndex - 1;
        return this.selectIndex(i);
      },
      
      /**
       * Selects the next item.  This should be used in single selection only.
       *
       * @method selectNext
       * @param {boolean} wrap if true and it is already at the last item, wrap to the front
       * @returns the next item or undefined if there is none
       */
      selectNext: function(wrap) {
        var i = wrap && this.selectedIndex >= this.items.length - 1 ? 0 : this.selectedIndex + 1;
        return this.selectIndex(i);
      }
      
    });
  ;


  Polymer('core-drawer-panel', {

    /**
     * Fired when the narrow layout changes.
     *
     * @event core-responsive-change
     * @param {Object} detail
     * @param {boolean} detail.narrow true if the panel is in narrow layout.
     */

    publish: {

      /**
       * Width of the drawer panel.
       *
       * @attribute drawerWidth
       * @type string
       * @default '256px'
       */
      drawerWidth: '256px',

      /**
       * Max-width when the panel changes to narrow layout.
       *
       * @attribute responsiveWidth
       * @type string
       * @default '640px'
       */
      responsiveWidth: '640px',

      /**
       * The panel that is being selected. `drawer` for the drawer panel and
       * `main` for the main panel.
       *
       * @attribute selected
       * @type string
       * @default null
       */
      selected: {value: null, reflect: true},

      /**
       * The panel to be selected when `core-drawer-panel` changes to narrow
       * layout.
       *
       * @attribute defaultSelected
       * @type string
       * @default 'main'
       */
      defaultSelected: 'main',

      /**
       * Returns true if the panel is in narrow layout.  This is useful if you
       * need to show/hide elements based on the layout.
       *
       * @attribute narrow
       * @type boolean
       * @default false
       */
      narrow: {value: false, reflect: true},

      /**
       * If true, position the drawer to the right.
       *
       * @attribute rightDrawer
       * @type boolean
       * @default false
       */
      rightDrawer: false,

      /**
       * If true, swipe to open/close the drawer is disabled.
       *
       * @attribute disableSwipe
       * @type boolean
       * @default false
       */
      disableSwipe: false
    },

    eventDelegates: {
      trackstart: 'trackStart',
      trackx: 'trackx',
      trackend: 'trackEnd',
      down: 'touchStart',
      up: 'touchEnd'
    },

    // Whether the transition is enabled.
    transition: false,

    // How many pixels on the side of the screen are sensitive to edge swipes and peek.
    edgeSwipeSensitivity: 15,

    // Whether the drawer is peeking out from the edge.
    peeking: false,

    // Whether the user is dragging the drawer interactively.
    dragging: false,

    // Whether the browser has support for the transform CSS property.
    hasTransform: true,

    // Whether the browser has support for the will-change CSS property.
    hasWillChange: true,

    created: function() {
      this.hasTransform = 'transform' in this.style;
      this.hasWillChange = 'willChange' in this.style;
    },

    domReady: function() {
      // to avoid transition at the beginning e.g. page loads
      // NOTE: domReady is already raf delayed and delaying another frame
      // ensures a layout has occurred.
      this.async(function() {
        this.transition = true;
      });
    },

    /**
     * Toggles the panel open and closed.
     *
     * @method togglePanel
     */
    togglePanel: function() {
      this.selected = this.selected === 'main' ? 'drawer' : 'main';
    },

    /**
     * Opens the drawer.
     *
     * @method openDrawer
     */
    openDrawer: function() {
      this.selected = 'drawer';
    },

    /**
     * Closes the drawer.
     *
     * @method closeDrawer
     */
    closeDrawer: function() {
      this.selected = 'main';
    },

    queryMatchesChanged: function() {
      if (this.queryMatches) {
        this.selected = this.defaultSelected;
      }
      this.narrow = this.queryMatches;
      this.setAttribute('touch-action', this.swipeAllowed() ? 'pan-y' : '');
      this.fire('core-responsive-change', {narrow: this.narrow});
    },

    swipeAllowed: function() {
      return this.narrow && !this.disableSwipe;
    },

    startEdgePeek: function() {
      this.width = this.$.drawer.offsetWidth;
      this.moveDrawer(this.translateXForDeltaX(this.rightDrawer ?
          -this.edgeSwipeSensitivity : this.edgeSwipeSensitivity));
      this.peeking = true;
    },

    stopEdgePeak: function() {
      if (this.peeking) {
        this.peeking = false;
        this.moveDrawer(null);
      }
    },

    touchStart: function(e) {
      if (!this.dragging && this.selected === 'main' && this.isEdgeTouch(e))
        this.startEdgePeek();
    },

    touchEnd: function(e) {
      this.stopEdgePeak();
    },

    isEdgeTouch: function(e) {
      return this.swipeAllowed() && (this.rightDrawer ?
        e.pageX >= this.offsetWidth - this.edgeSwipeSensitivity :
        e.pageX <= this.edgeSwipeSensitivity);
    },

    // swipe support for the drawer, inspired by
    // https://github.com/Polymer/core-drawer-panel/pull/6
    trackStart : function(e) {
      if (this.swipeAllowed()) {
        this.dragging = true;

        if (this.selected === 'main')
          this.dragging = this.peeking || this.isEdgeTouch(e);

        if (this.dragging) {
          this.width = this.$.drawer.offsetWidth;
          this.transition = false;
          e.preventTap();
        }
      }
    },

    translateXForDeltaX: function(deltaX) {
      if (this.rightDrawer) {
        return Math.max(0, (this.selected === 'main') ? this.width + deltaX : deltaX);
      } else {
        return Math.min(0, (this.selected === 'main') ? deltaX - this.width : deltaX);
      }
    },

    trackx : function(e) {
      if (this.dragging) {
        if (this.peeking) {
          if (Math.abs(e.dx) <= this.edgeSwipeSensitivity)
            return; // Ignore trackx until we move past the edge peek.
          this.peeking = false;
        }
        this.moveDrawer(this.translateXForDeltaX(e.dx));
      }
    },

    trackEnd : function(e) {
      if (this.dragging) {
        this.dragging = false;
        this.transition = true;
        this.moveDrawer(null);

        if (this.rightDrawer) {
          this.selected = e.xDirection > 0 ? 'main' : 'drawer';
        } else {
          this.selected = e.xDirection > 0 ? 'drawer' : 'main';
        }
      }
    },

    transformForTranslateX: function (translateX) {
      if (translateX === null)
        return '';
      return this.hasWillChange ? 'translateX(' + translateX + 'px)' : 'translate3d(' + translateX + 'px, 0, 0)';
    },

    moveDrawer: function(translateX) {
      var s = this.$.drawer.style;

      if (this.hasTransform) {
        s.transform = this.transformForTranslateX(translateX);
      } else {
        s.webkitTransform = this.transformForTranslateX(translateX);
      }
    },

  });

;


  Polymer('core-header-panel', {

    /**
     * Fired when the content has been scrolled.  `event.detail.target` returns
     * the scrollable element which you can use to access scroll info such as
     * `scrollTop`.
     *
     *     <core-header-panel on-scroll="{{scrollHandler}}">
     *       ...
     *     </core-header-panel>
     *
     *
     *     scrollHandler: function(event) {
     *       var scroller = event.detail.target;
     *       console.log(scroller.scrollTop);
     *     }
     *
     * @event scroll
     */

    publish: {
      /**
       * Controls header and scrolling behavior. Options are
       * `standard`, `seamed`, `waterfall`, `waterfall-tall`, `scroll` and 
       * `cover`. Default is `standard`.
       *
       * `standard`: The header is a step above the panel. The header will consume the
       * panel at the point of entry, preventing it from passing through to the
       * opposite side.
       *
       * `seamed`: The header is presented as seamed with the panel.
       *
       * `waterfall`: Similar to standard mode, but header is initially presented as
       * seamed with panel, but then separates to form the step.
       *
       * `waterfall-tall`: The header is initially taller (`tall` class is added to
       * the header).  As the user scrolls, the header separates (forming an edge)
       * while condensing (`tall` class is removed from the header).
       *
       * `scroll`: The header keeps its seam with the panel, and is pushed off screen.
       *
       * `cover`: The panel covers the whole `core-header-panel` including the
       * header. This allows user to style the panel in such a way that the panel is
       * partially covering the header.
       *
       *     <style>
       *       core-header-panel[mode=cover]::shadow #mainContainer {
       *         left: 80px;
       *       }
       *       .content {
       *         margin: 60px 60px 60px 0;
       *       }
       *     </style>
       *
       *     <core-header-panel mode="cover">
       *       <core-appbar class="tall">
       *         <core-icon-button icon="menu"></core-icon-button>
       *       </core-appbar>
       *       <div class="content"></div>
       *     </core-header-panel>
       *
       * @attribute mode
       * @type string
       * @default ''
       */
      mode: {value: '', reflect: true},

      /**
       * The class used in waterfall-tall mode.  Change this if the header
       * accepts a different class for toggling height, e.g. "medium-tall"
       *
       * @attribute tallClass
       * @type string
       * @default 'tall'
       */
      tallClass: 'tall',

      /**
       * If true, the drop-shadow is always shown no matter what mode is set to.
       *
       * @attribute shadow
       * @type boolean
       * @default false
       */
      shadow: false
    },

    animateDuration: 200,

    modeConfigs: {
      shadowMode: {'waterfall': 1, 'waterfall-tall': 1},
      noShadow: {'seamed': 1, 'cover': 1, 'scroll': 1},
      tallMode: {'waterfall-tall': 1},
      outerScroll: {'scroll': 1}
    },
    
    ready: function() {
      this.scrollHandler = this.scroll.bind(this);
      this.addListener();
    },
    
    detached: function() {
      this.removeListener(this.mode);
    },
    
    addListener: function() {
      this.scroller.addEventListener('scroll', this.scrollHandler);
    },
    
    removeListener: function(mode) {
      var s = this.getScrollerForMode(mode);
      s.removeEventListener('scroll', this.scrollHandler);
    },

    domReady: function() {
      this.async('scroll');
    },

    modeChanged: function(old) {
      var header = this.header;
      if (header) {
        var configs = this.modeConfigs;
        // in tallMode it may add tallClass to the header; so do the cleanup
        // when mode is changed from tallMode to not tallMode
        if (configs.tallMode[old] && !configs.tallMode[this.mode]) {
          header.classList.remove(this.tallClass);
          this.async(function() {
            header.classList.remove('animate');
          }, null, this.animateDuration);
        } else {
          header.classList.toggle('animate', configs.tallMode[this.mode]);
        }
      }
      if (configs.outerScroll[this.mode] || configs.outerScroll[old]) {
        this.removeListener(old);
        this.addListener();
      }
      this.scroll();
    },

    get header() {
      return this.$.headerContent.getDistributedNodes()[0];
    },
    
    getScrollerForMode: function(mode) {
      return this.modeConfigs.outerScroll[mode] ?
          this.$.outerContainer : this.$.mainContainer;
    },

    /**
     * Returns the scrollable element.
     *
     * @property scroller
     * @type Object
     */
    get scroller() {
      return this.getScrollerForMode(this.mode);
    },

    scroll: function() {
      var configs = this.modeConfigs;
      var main = this.$.mainContainer;
      var header = this.header;

      var sTop = main.scrollTop;
      var atTop = sTop === 0;

      this.$.dropShadow.classList.toggle('hidden', !this.shadow &&
          (atTop && configs.shadowMode[this.mode] || configs.noShadow[this.mode]));

      if (header && configs.tallMode[this.mode]) {
        header.classList.toggle(this.tallClass, atTop ||
            header.classList.contains(this.tallClass) &&
            main.scrollHeight < this.$.outerContainer.offsetHeight);
      }

      this.fire('scroll', {target: this.scroller}, this, false);
    }

  });

;


  Polymer('core-item', {
    
    /**
     * The URL of an image for the icon.
     *
     * @attribute src
     * @type string
     * @default ''
     */

    /**
     * Specifies the icon from the Polymer icon set.
     *
     * @attribute icon
     * @type string
     * @default ''
     */

    /**
     * Specifies the label for the menu item.
     *
     * @attribute label
     * @type string
     * @default ''
     */

  });

;
Polymer('core-menu');;
Polymer('core-pages');;
Polymer('core-toolbar');;

    Polymer('paper-item', {

      publish: {

        /**
         * The label for the item.
         *
         * @attribute label
         * @type string
         * @default ''
         */
        label: '',

        /**
         * (optional) The URL of an image for an icon to use in the button.
         * Should not use `icon` property if you are using this property.
         *
         * @attribute iconSrc
         * @type string
         * @default ''
         */
        iconSrc: '',

        /**
         * (optional) Specifies the icon name or index in the set of icons
         * available in the icon set. If using this property, load the icon
         * set separately where the icon is used. Should not use `src`
         * if you are using this property.
         *
         * @attribute icon
         * @type string
         * @default ''
         */
        icon: ''

      },

      eventDelegates: {
        'down': 'downAction',
        'up': 'upAction'
      },

      downAction: function(e) {
        this.$.ripple.downAction(e);
      },

      upAction: function(e) {
        this.$.ripple.upAction(e);
      }
    });
  ;

    Polymer('core-transition', {
      
      type: 'transition',

      /**
       * Run the animation.
       *
       * @method go
       * @param {Node} node The node to apply the animation on
       * @param {Object} state State info
       */
      go: function(node, state) {
        this.complete(node);
      },

      /**
       * Set up the animation. This may include injecting a stylesheet,
       * applying styles, creating a web animations object, etc.. This
       *
       * @method setup
       * @param {Node} node The animated node
       */
      setup: function(node) {
      },

      /**
       * Tear down the animation.
       *
       * @method teardown
       * @param {Node} node The animated node
       */
      teardown: function(node) {
      },

      /**
       * Called when the animation completes. This function also fires the
       * `core-transitionend` event.
       *
       * @method complete
       * @param {Node} node The animated node
       */
      complete: function(node) {
        this.fire('core-transitionend', null, node);
      },

      /**
       * Utility function to listen to an event on a node once.
       *
       * @method listenOnce
       * @param {Node} node The animated node
       * @param {string} event Name of an event
       * @param {Function} fn Event handler
       * @param {Array} args Additional arguments to pass to `fn`
       */
      listenOnce: function(node, event, fn, args) {
        var self = this;
        var listener = function() {
          fn.apply(self, args);
          node.removeEventListener(event, listener, false);
        }
        node.addEventListener(event, listener, false);
      }

    });
  ;

    Polymer('core-key-helper', {
      ENTER_KEY: 13,
      ESCAPE_KEY: 27
    });
  ;

(function() {

  Polymer('core-overlay-layer', {
    publish: {
      opened: false
    },
    openedChanged: function() {
      this.classList.toggle('core-opened', this.opened);
    },
    /**
     * Adds an element to the overlay layer
     */
    addElement: function(element) {
      if (!this.parentNode) {
        document.querySelector('body').appendChild(this);
      }
      if (element.parentNode !== this) {
        element.__contents = [];
        var ip$ = element.querySelectorAll('content');
        for (var i=0, l=ip$.length, n; (i<l) && (n = ip$[i]); i++) {
          this.moveInsertedElements(n);
          this.cacheDomLocation(n);
          n.parentNode.removeChild(n);
          element.__contents.push(n);
        }
        this.cacheDomLocation(element);
        this.updateEventController(element);
        var h = this.makeHost();
        h.shadowRoot.appendChild(element);
        element.__host = h;
      }
    },
    makeHost: function() {
      var h = document.createElement('overlay-host');
      h.createShadowRoot();
      this.appendChild(h);
      return h;
    },
    moveInsertedElements: function(insertionPoint) {
      var n$ = insertionPoint.getDistributedNodes();
      var parent = insertionPoint.parentNode;
      insertionPoint.__contents = [];
      for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
        this.cacheDomLocation(n);
        this.updateEventController(n);
        insertionPoint.__contents.push(n);
        parent.appendChild(n);  
      }
    },
    updateEventController: function(element) {
      element.eventController = this.element.findController(element);
    },
    /**
     * Removes an element from the overlay layer
     */
    removeElement: function(element) {
      element.eventController = null;
      this.replaceElement(element);
      var h = element.__host;
      if (h) {
        h.parentNode.removeChild(h);
      }
    },
    replaceElement: function(element) {
      if (element.__contents) {
        for (var i=0, c$=element.__contents, c; (c=c$[i]); i++) {
          this.replaceElement(c);
        }
        element.__contents = null;
      }
      if (element.__parentNode) {
        var n = element.__nextElementSibling && element.__nextElementSibling 
            === element.__parentNode ? element.__nextElementSibling : null;
        element.__parentNode.insertBefore(element, n);
      }
    },
    cacheDomLocation: function(element) {
      element.__nextElementSibling = element.nextElementSibling;
      element.__parentNode = element.parentNode;
    }
  });
  
})();
;

(function() {

  Polymer('core-overlay', {

    publish: {
      /**
       * The target element that will be shown when the overlay is 
       * opened. If unspecified, the core-overlay itself is the target.
       *
       * @attribute target
       * @type Object
       * @default the overlay element
       */
      target: null,


      /**
       * A `core-overlay`'s size is guaranteed to be 
       * constrained to the window size. To achieve this, the sizingElement
       * is sized with a max-height/width. By default this element is the 
       * target element, but it can be specifically set to a specific element
       * inside the target if that is more appropriate. This is useful, for 
       * example, when a region inside the overlay should scroll if needed.
       *
       * @attribute sizingTarget
       * @type Object
       * @default the target element
       */
      sizingTarget: null,
    
      /**
       * Set opened to true to show an overlay and to false to hide it.
       * A `core-overlay` may be made initially opened by setting its
       * `opened` attribute.
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,

      /**
       * If true, the overlay has a backdrop darkening the rest of the screen.
       * The backdrop element is attached to the document body and may be styled
       * with the class `core-overlay-backdrop`. When opened the `core-opened`
       * class is applied.
       *
       * @attribute backdrop
       * @type boolean
       * @default false
       */    
      backdrop: false,

      /**
       * If true, the overlay is guaranteed to display above page content.
       *
       * @attribute layered
       * @type boolean
       * @default false
      */
      layered: false,
    
      /**
       * By default an overlay will close automatically if the user
       * taps outside it or presses the escape key. Disable this
       * behavior by setting the `autoCloseDisabled` property to true.
       * @attribute autoCloseDisabled
       * @type boolean
       * @default false
       */
      autoCloseDisabled: false,

      /**
       * By default an overlay will focus its target or an element inside
       * it with the `autoFocus` attribute. Disable this
       * behavior by setting the `autoFocusDisabled` property to true.
       * @attribute autoFocusDisabled
       * @type boolean
       * @default false
       */
      autoFocusDisabled: false,

      /**
       * This property specifies an attribute on elements that should
       * close the overlay on tap. Should not set `closeSelector` if this
       * is set.
       *
       * @attribute closeAttribute
       * @type string
       * @default "core-overlay-toggle"
       */
      closeAttribute: 'core-overlay-toggle',

      /**
       * This property specifies a selector matching elements that should
       * close the overlay on tap. Should not set `closeAttribute` if this
       * is set.
       *
       * @attribute closeSelector
       * @type string
       * @default ""
       */
      closeSelector: '',

      /**
       * The transition property specifies a string which identifies a 
       * <a href="../core-transition/">`core-transition`</a> element that 
       * will be used to help the overlay open and close. The default
       * `core-transition-fade` will cause the overlay to fade in and out.
       *
       * @attribute transition
       * @type string
       * @default 'core-transition-fade'
       */
      transition: 'core-transition-fade'

    },

    captureEventName: 'tap',
    targetListeners: {
      'tap': 'tapHandler',
      'keydown': 'keydownHandler',
      'core-transitionend': 'transitionend'
    },
    
    registerCallback: function(element) {
      this.layer = document.createElement('core-overlay-layer');
      this.keyHelper = document.createElement('core-key-helper');
      this.meta = document.createElement('core-transition');
      this.scrim = document.createElement('div');
      this.scrim.className = 'core-overlay-backdrop';
    },

    ready: function() {
      this.target = this.target || this;
      // flush to ensure styles are installed before paint
      Platform.flush();
    },

    /** 
     * Toggle the opened state of the overlay.
     * @method toggle
     */
    toggle: function() {
      this.opened = !this.opened;
    },

    /** 
     * Open the overlay. This is equivalent to setting the `opened`
     * property to true.
     * @method open
     */
    open: function() {
      this.opened = true;
    },

    /** 
     * Close the overlay. This is equivalent to setting the `opened` 
     * property to false.
     * @method close
     */
    close: function() {
      this.opened = false;
    },

    domReady: function() {
      this.ensureTargetSetup();
    },

    targetChanged: function(old) {
      if (this.target) {
        // really make sure tabIndex is set
        if (this.target.tabIndex < 0) {
          this.target.tabIndex = -1;
        }
        this.addElementListenerList(this.target, this.targetListeners);
        this.target.style.display = 'none';
        this.target.__overlaySetup = false;
      }
      if (old) {
        this.removeElementListenerList(old, this.targetListeners);
        var transition = this.getTransition();
        if (transition) {
          transition.teardown(old);
        } else {
          old.style.position = '';
          old.style.outline = '';
        }
        old.style.display = '';
      }
    },

    transitionChanged: function(old) {
      if (!this.target) {
        return;
      }
      if (old) {
        this.getTransition(old).teardown(this.target);
      }
      this.target.__overlaySetup = false;
    },

    // NOTE: wait to call this until we're as sure as possible that target
    // is styled.
    ensureTargetSetup: function() {
      if (!this.target || this.target.__overlaySetup) {
        return;
      }
      if (!this.sizingTarget) {
        this.sizingTarget = this.target;
      }
      this.target.__overlaySetup = true;
      this.target.style.display = '';
      var transition = this.getTransition();
      if (transition) {
        transition.setup(this.target);
      }
      var style = this.target.style;
      var computed = getComputedStyle(this.target);
      if (computed.position === 'static') {
        style.position = 'fixed';
      }
      style.outline = 'none';
      style.display = 'none';
    },

    openedChanged: function() {
      this.transitioning = true;
      this.ensureTargetSetup();
      this.prepareRenderOpened();
      // async here to allow overlay layer to become visible.
      this.async(function() {
        this.target.style.display = '';
        // force layout to ensure transitions will go
        this.target.offsetWidth;
        this.renderOpened();
      });
      this.fire('core-overlay-open', this.opened);
    },

    // tasks which must occur before opening; e.g. making the element visible
    prepareRenderOpened: function() {
      if (this.opened) {
        addOverlay(this);
      }
      this.prepareBackdrop();
      // async so we don't auto-close immediately via a click.
      this.async(function() {
        if (!this.autoCloseDisabled) {
          this.enableElementListener(this.opened, document,
              this.captureEventName, 'captureHandler', true);
        }
      });
      this.enableElementListener(this.opened, window, 'resize',
          'resizeHandler');

      if (this.opened) {
        // force layout so SD Polyfill renders
        this.target.offsetHeight;
        this.discoverDimensions();
        // if we are showing, then take care when positioning
        this.preparePositioning();
        this.positionTarget();
        this.updateTargetDimensions();
        this.finishPositioning();
        if (this.layered) {
          this.layer.addElement(this.target);
          this.layer.opened = this.opened;
        }
      }
    },

    // tasks which cause the overlay to actually open; typically play an
    // animation
    renderOpened: function() {
      var transition = this.getTransition();
      if (transition) {
        transition.go(this.target, {opened: this.opened});
      } else {
        this.transitionend();
      }
      this.renderBackdropOpened();
    },

    // finishing tasks; typically called via a transition
    transitionend: function(e) {
      // make sure this is our transition event.
      if (e && e.target !== this.target) {
        return;
      }
      this.transitioning = false;
      if (!this.opened) {
        this.resetTargetDimensions();
        this.target.style.display = 'none';
        this.completeBackdrop();
        removeOverlay(this);
        if (this.layered) {
          if (!currentOverlay()) {
            this.layer.opened = this.opened;
          }
          this.layer.removeElement(this.target);
        }
      }
      this.fire('core-overlay-' + (this.opened ? 'open' : 'close') + 
          '-completed');
      this.applyFocus();
    },

    prepareBackdrop: function() {
      if (this.backdrop && this.opened) {
        if (!this.scrim.parentNode) {
          document.body.appendChild(this.scrim);
          this.scrim.style.zIndex = currentOverlayZ() - 1;
        }
        trackBackdrop(this);
      }
    },

    renderBackdropOpened: function() {
      if (this.backdrop && getBackdrops().length < 2) {
        this.scrim.classList.toggle('core-opened', this.opened);
      }
    },

    completeBackdrop: function() {
      if (this.backdrop) {
        trackBackdrop(this);
        if (getBackdrops().length === 0) {
          this.scrim.parentNode.removeChild(this.scrim);
        }
      }
    },

    preparePositioning: function() {
      this.target.style.transition = this.target.style.webkitTransition = 'none';
      this.target.style.transform = this.target.style.webkitTransform = 'none';
      this.target.style.display = '';
    },

    discoverDimensions: function() {
      if (this.dimensions) {
        return;
      }
      var target = getComputedStyle(this.target);
      var sizer = getComputedStyle(this.sizingTarget);
      this.dimensions = {
        position: {
          v: target.top !== 'auto' ? 'top' : (target.bottom !== 'auto' ?
            'bottom' : null),
          h: target.left !== 'auto' ? 'left' : (target.right !== 'auto' ?
            'right' : null),
          css: target.position
        },
        size: {
          v: sizer.maxHeight !== 'none',
          h: sizer.maxWidth !== 'none'
        },
        margin: {
          top: parseInt(target.marginTop) || 0,
          right: parseInt(target.marginRight) || 0,
          bottom: parseInt(target.marginBottom) || 0,
          left: parseInt(target.marginLeft) || 0
        }
      };
    },

    finishPositioning: function(target) {
      this.target.style.display = 'none';
      this.target.style.transform = this.target.style.webkitTransform = '';
      // force layout to avoid application of transform
      this.target.offsetWidth;
      this.target.style.transition = this.target.style.webkitTransition = '';
    },

    getTransition: function(name) {
      return this.meta.byId(name || this.transition);
    },

    getFocusNode: function() {
      return this.target.querySelector('[autofocus]') || this.target;
    },

    applyFocus: function() {
      var focusNode = this.getFocusNode();
      if (this.opened) {
        if (!this.autoFocusDisabled) {
          focusNode.focus();
        }
      } else {
        focusNode.blur();
        if (currentOverlay() == this) {
          console.warn('Current core-overlay is attempting to focus itself as next! (bug)');
        } else {
          focusOverlay();
        }
      }
    },

    positionTarget: function() {
      // fire positioning event
      this.fire('core-overlay-position', {target: this.target,
          sizingTarget: this.sizingTarget, opened: this.opened});
      if (!this.dimensions.position.v) {
        this.target.style.top = '0px';
      }
      if (!this.dimensions.position.h) {
        this.target.style.left = '0px';
      }
    },

    updateTargetDimensions: function() {
      this.sizeTarget();
      this.repositionTarget();
    },

    sizeTarget: function() {
      this.sizingTarget.style.boxSizing = 'border-box';
      var dims = this.dimensions;
      var rect = this.target.getBoundingClientRect();
      if (!dims.size.v) {
        this.sizeDimension(rect, dims.position.v, 'top', 'bottom', 'Height');
      }
      if (!dims.size.h) {
        this.sizeDimension(rect, dims.position.h, 'left', 'right', 'Width');
      }
    },

    sizeDimension: function(rect, positionedBy, start, end, extent) {
      var dims = this.dimensions;
      var flip = (positionedBy === end);
      var m = flip ? start : end;
      var ws = window['inner' + extent];
      var o = dims.margin[m] + (flip ? ws - rect[end] : 
          rect[start]);
      var offset = 'offset' + extent;
      var o2 = this.target[offset] - this.sizingTarget[offset];
      this.sizingTarget.style['max' + extent] = (ws - o - o2) + 'px';
    },

    // vertically and horizontally center if not positioned
    repositionTarget: function() {
      // only center if position fixed.      
      if (this.dimensions.position.css !== 'fixed') {
        return; 
      }
      if (!this.dimensions.position.v) {
        var t = (window.innerHeight - this.target.offsetHeight) / 2;
        t -= this.dimensions.margin.top;
        this.target.style.top = t + 'px';
      }

      if (!this.dimensions.position.h) {
        var l = (window.innerWidth - this.target.offsetWidth) / 2;
        l -= this.dimensions.margin.left;
        this.target.style.left = l + 'px';
      }
    },

    resetTargetDimensions: function() {
      if (!this.dimensions.size.v) {
        this.sizingTarget.style.maxHeight = '';  
      }
      if (!this.dimensions.size.h) {
        this.sizingTarget.style.maxWidth = '';  
      }
      this.dimensions = null;
    },

    tapHandler: function(e) {
      // closeSelector takes precedence since closeAttribute has a default non-null value.
      if (e.target &&
          (this.closeSelector && e.target.matches(this.closeSelector)) ||
          (this.closeAttribute && e.target.hasAttribute(this.closeAttribute))) {
        this.toggle();
      } else {
        if (this.autoCloseJob) {
          this.autoCloseJob.stop();
          this.autoCloseJob = null;
        }
      }
    },
    
    // We use the traditional approach of capturing events on document
    // to to determine if the overlay needs to close. However, due to 
    // ShadowDOM event retargeting, the event target is not useful. Instead
    // of using it, we attempt to close asynchronously and prevent the close
    // if a tap event is immediately heard on the target.
    // TODO(sorvell): This approach will not work with modal. For
    // this we need a scrim.
    captureHandler: function(e) {
      if (!this.autoCloseDisabled && (currentOverlay() == this)) {
        this.autoCloseJob = this.job(this.autoCloseJob, function() {
          this.close();
        });
      }
    },

    keydownHandler: function(e) {
      if (!this.autoCloseDisabled && (e.keyCode == this.keyHelper.ESCAPE_KEY)) {
        this.close();
        e.stopPropagation();
      }
    },

    /**
     * Extensions of core-overlay should implement the `resizeHandler`
     * method to adjust the size and position of the overlay when the 
     * browser window resizes.
     * @method resizeHandler
     */
    resizeHandler: function() {
      this.updateTargetDimensions();
    },

    // TODO(sorvell): these utility methods should not be here.
    addElementListenerList: function(node, events) {
      for (var i in events) {
        this.addElementListener(node, i, events[i]);
      }
    },

    removeElementListenerList: function(node, events) {
      for (var i in events) {
        this.removeElementListener(node, i, events[i]);
      }
    },

    enableElementListener: function(enable, node, event, methodName, capture) {
      if (enable) {
        this.addElementListener(node, event, methodName, capture);
      } else {
        this.removeElementListener(node, event, methodName, capture);
      }
    },

    addElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.addEventListener(node, event, fn, capture);
      }
    },

    removeElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.removeEventListener(node, event, fn, capture);
      }
    },

    _makeBoundListener: function(methodName) {
      var self = this, method = this[methodName];
      if (!method) {
        return;
      }
      var bound = '_bound' + methodName;
      if (!this[bound]) {
        this[bound] = function(e) {
          method.call(self, e);
        };
      }
      return this[bound];
    },
  });

  // TODO(sorvell): This should be an element with private state so it can
  // be independent of overlay.
  // track overlays for z-index and focus managemant
  var overlays = [];
  function addOverlay(overlay) {
    var z0 = currentOverlayZ();
    overlays.push(overlay);
    var z1 = currentOverlayZ();
    if (z1 <= z0) {
      applyOverlayZ(overlay, z0);
    }
  }

  function removeOverlay(overlay) {
    var i = overlays.indexOf(overlay);
    if (i >= 0) {
      overlays.splice(i, 1);
      setZ(overlay, '');
    }
  }
  
  function applyOverlayZ(overlay, aboveZ) {
    setZ(overlay.target, aboveZ + 2);
  }
  
  function setZ(element, z) {
    element.style.zIndex = z;
  }

  function currentOverlay() {
    return overlays[overlays.length-1];
  }
  
  var DEFAULT_Z = 10;
  
  function currentOverlayZ() {
    var z;
    var current = currentOverlay();
    if (current) {
      var z1 = window.getComputedStyle(current.target).zIndex;
      if (!isNaN(z1)) {
        z = Number(z1);
      }
    }
    return z || DEFAULT_Z;
  }
  
  function focusOverlay() {
    var current = currentOverlay();
    // We have to be careful to focus the next overlay _after_ any current
    // transitions are complete (due to the state being toggled prior to the
    // transition). Otherwise, we risk infinite recursion when a transitioning
    // (closed) overlay becomes the current overlay.
    //
    // NOTE: We make the assumption that any overlay that completes a transition
    // will call into focusOverlay to kick the process back off. Currently:
    // transitionend -> applyFocus -> focusOverlay.
    if (current && !current.transitioning) {
      current.applyFocus();
    }
  }

  var backdrops = [];
  function trackBackdrop(element) {
    if (element.opened) {
      backdrops.push(element);
    } else {
      var i = backdrops.indexOf(element);
      if (i >= 0) {
        backdrops.splice(i, 1);
      }
    }
  }

  function getBackdrops() {
    return backdrops;
  }
})();
;

    Polymer('core-dropdown-overlay',{

      publish: {

        /**
         * The `relatedTarget` is an element used to position the overlay. It should have
         * the same offsetParent as the target.
         *
         * @attribute relatedTarget
         * @type Node
         */
        relatedTarget: null,

        /**
         * The horizontal alignment of the overlay relative to the `relatedTarget`.
         * `left` means the left edges are aligned together and `right` means the right
         * edges are aligned together.
         *
         * @attribute halign
         * @type 'left' | 'right'
         * @default 'auto'
         */
        halign: 'left',

        /**
         * The vertical alignment of the overlay relative to the `relatedTarget`. `top`
         * means the top edges are aligned together and `bottom` means the bottom edges
         * are aligned together.
         *
         * @attribute valign
         * @type 'top' | 'bottom'
         * @default 'top'
         */
        valign: 'top'

      },

      measure: function() {
        var target = this.target;
        // remember position, because core-overlay may have set the property
        var pos = target.style.position;

        // get the size of the target as if it's positioned in the top left
        // corner of the screen
        target.style.position = 'fixed';
        target.style.left = '0px';
        target.style.top = '0px';

        var rect = target.getBoundingClientRect();

        target.style.position = pos;
        target.style.left = null;
        target.style.top = null;

        return rect;
      },

      resetTargetDimensions: function() {
        var dims = this.dimensions;
        var style = this.target.style;
        if (dims.position.h_by === this.localName) {
          style[dims.position.h] = null;
        }
        if (dims.position.v_by === this.localName) {
          style[dims.position.v] = null;
        }
        this.super();
      },

      positionTarget: function() {
        if (!this.relatedTarget) {
          this.super();
          return;
        }

        var target = this.target;
        var related = this.relatedTarget;

        // explicitly set width/height, because we don't want it constrained
        // to the offsetParent
        var rect = this.measure();
        target.style.width = rect.width + 'px';
        target.style.height = rect.height + 'px';

        var t_op = target.offsetParent;
        var r_op = related.offsetParent;
        if (window.ShadowDOMPolyfill) {
          t_op = wrap(t_op);
          r_op = wrap(r_op);
        }

        if (t_op !== r_op && t_op !== related) {
          console.warn('core-dropdown-overlay: dropdown\'s offsetParent must be the relatedTarget or the relatedTarget\'s offsetParent!');
        }

        // Don't use CSS to handle halign/valign so we can use
        // dimensions.position to detect custom positioning

        var dims = this.dimensions;
        var margin = dims.margin;
        var inside = t_op === related;

        if (!dims.position.h) {
          if (this.halign === 'right') {
            target.style.right = ((inside ? 0 : t_op.offsetWidth - related.offsetLeft - related.offsetWidth) - margin.right) + 'px';
            dims.position.h = 'right';
          } else {
            target.style.left = ((inside ? 0 : related.offsetLeft) - margin.left) + 'px';
            dims.position.h = 'left';
          }
          dims.position.h_by = this.localName;
        }

        if (!dims.position.v) {
          if (this.valign === 'bottom') {
            target.style.bottom = ((inside ? 0 : t_op.offsetHeight - related.offsetTop - related.offsetHeight) - margin.bottom) + 'px';
            dims.position.v = 'bottom';
          } else {
            target.style.top = ((inside ? 0 : related.offsetTop) - margin.top) + 'px';
            dims.position.v = 'top';
          }
          dims.position.v_by = this.localName;
        }
      }

    });
  ;


  Polymer('core-dropdown',{

    publish: {

      /**
       * The element associated with this dropdown, usually the element that triggers
       * the menu.
       *
       * @attribute relatedTarget
       * @type Node
       */
      relatedTarget: null,

      /**
       * If true, the menu is currently visible.
       *
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,

      /**
       * The horizontal alignment of the popup relative to `relatedTarget`. `left`
       * means the left edges are aligned together. `right` means the right edges
       * are aligned together.
       *
       * @attribute halign
       * @type 'left' | 'right'
       * @default 'left'
       */
      halign: 'left',

      /**
       * The vertical alignment of the popup relative to `relatedTarget`. `top` means
       * the top edges are aligned together. `bottom` means the bottom edges are
       * aligned together.
       *
       * @attribute valign
       * @type 'top' | 'bottom'
       * @default 'top'
       */
      valign: 'top',

     /**
       * By default an overlay will focus its target or an element inside
       * it with the `autoFocus` attribute. Disable this
       * behavior by setting the `autoFocusDisabled` property to true.
       *
       * @attribute autoFocusDisabled
       * @type boolean
       * @default false
       */
      autoFocusDisabled: false,

      /**
       * The transition property specifies a string which identifies a 
       * <a href="../core-transition/">`core-transition`</a> element that 
       * will be used to help the overlay open and close. The default
       * `core-transition-fade` will cause the overlay to fade in and out.
       *
       * @attribute transition
       * @type string
       * @default null
       */
      transition: null

    }

  });

;


  Polymer('paper-dropdown-menu',{

    publish: {

      /**
       * True if the menu is open.
       *
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,

      /**
       * A label for the control. The label is displayed if no item is selected.
       *
       * @attribute label
       * @type string
       * @default 'Select an item'
       */
      label: 'Select an item',

      /**
       * The currently selected element. By default this is the index of the item element.
       * If you want a specific attribute value of the element to be used instead of the
       * index, set `valueattr` to that attribute name.
       *
       * @attribute selected
       * @type Object
       * @default null
       */
      selected: null,

      /**
       * Specifies the attribute to be used for "selected" attribute.
       *
       * @attribute valueattr
       * @type string
       * @default 'name'
       */
      valueattr: 'name',

      /**
       * Specifies the CSS class to be used to add to the selected element.
       * 
       * @attribute selectedClass
       * @type string
       * @default 'core-selected'
       */
      selectedClass: 'core-selected',

      /**
       * Specifies the property to be used to set on the selected element
       * to indicate its active state.
       *
       * @attribute selectedProperty
       * @type string
       * @default ''
       */
      selectedProperty: '',

      /**
       * Specifies the attribute to set on the selected element to indicate
       * its active state.
       *
       * @attribute selectedAttribute
       * @type string
       * @default 'active'
       */
      selectedAttribute: 'selected',

      /**
       * The currently selected element.
       *
       * @attribute selectedItem
       * @type Object
       * @default null
       */
      selectedItem: null,

      /**
       * Horizontally align the overlay with the control.
       * @attribute halign
       * @type "left"|"right"
       * @default "left"
       */
      halign: 'left',

      /**
       * Vertically align the dropdown menu with the control.
       * @attribute valign
       * @type "top"|"bottom"
       * @default "top"
       */
      valign: 'top'

    },

    toggle: function() {
      this.opened = !this.opened;
    },

    activateAction: function() {
      this.opened = false;
    }

  });

;
Polymer('pook-state-dropdown');;

  Polymer( {
    publish: {
      user: null
    },
    created: function() {
      this.user = document.createElement('pook-fire-user');
      this.user.requestDatabase('account');
    }
  });
  ;


    Polymer('paper-dialog', {

      /**
       * Set opened to true to show the dialog and to false to hide it.
       * A dialog may be made intially opened by setting its opened attribute.

       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,

      /**
       * If true, the dialog has a backdrop darkening the rest of the screen.
       * The backdrop element is attached to the document body and may be styled
       * with the class `core-overlay-backdrop`. When opened the `core-opened`
       * class is applied.
       *
       * @attribute backdrop
       * @type boolean
       * @default false
       */
      backdrop: false,

      /**
       * If true, the dialog is guaranteed to display above page content.
       *
       * @attribute layered
       * @type boolean
       * @default false
      */
      layered: false,

      /**
       * By default a dialog will close automatically if the user
       * taps outside it or presses the escape key. Disable this
       * behavior by setting the `autoCloseDisabled` property to true.
       * @attribute autoCloseDisabled
       * @type boolean
       * @default false
       */
      autoCloseDisabled: false,

      /**
       * This property specifies a selector matching elements that should
       * close the dialog on tap.
       *
       * @attribute closeSelector
       * @type string
       * @default ""
       */
      closeSelector: '[dismissive],[affirmative]',

      /**
       * @attribute heading
       * @type string
       * @default ''
       */
      heading: '',

      /**
       * Set this property to the id of a `core-transition` element to specify
       * the transition to use when opening/closing this dialog.
       *
       * @attribute transition
       * @type string
       * @default ''
       */
      transition: '',

      /**
       * Toggle the dialog's opened state.
       * @method toggle
       */
      toggle: function() {
        this.$.overlay.toggle();
      },

      headingChanged: function() {
        this.setAttribute('aria-label', this.heading);
      }

    });

  ;


  Polymer('core-transition-css', {
    
    /**
     * The class that will be applied to all animated nodes.
     *
     * @attribute baseClass
     * @type string
     * @default "core-transition"
     */
    baseClass: 'core-transition',

    /**
     * The class that will be applied to nodes in the opened state.
     *
     * @attribute openedClass
     * @type string
     * @default "core-opened"
     */
    openedClass: 'core-opened',

    /**
     * The class that will be applied to nodes in the closed state.
     *
     * @attribute closedClass
     * @type string
     * @default "core-closed"
     */
    closedClass: 'core-closed',

    /**
     * Event to listen to for animation completion.
     *
     * @attribute completeEventName
     * @type string
     * @default "transitionEnd"
     */
    completeEventName: 'transitionend',

    publish: {
      /**
       * A secondary configuration attribute for the animation. The class
       * `<baseClass>-<transitionType` is applied to the animated node during
       * `setup`.
       *
       * @attribute transitionType
       * @type string
       */
      transitionType: null
    },

    registerCallback: function(element) {
      this.transitionStyle = element.templateContent().firstElementChild;
    },

    // template is just for loading styles, we don't need a shadowRoot
    fetchTemplate: function() {
      return null;
    },

    go: function(node, state) {
      if (state.opened !== undefined) {
        this.transitionOpened(node, state.opened);
      }
    },

    setup: function(node) {
      if (!node._hasTransitionStyle) {
        if (!node.shadowRoot) {
          node.createShadowRoot().innerHTML = '<content></content>';
        }
        this.installScopeStyle(this.transitionStyle, 'transition',
            node.shadowRoot);
        node._hasTransitionStyle = true;
      }
      node.classList.add(this.baseClass);
      if (this.transitionType) {
        node.classList.add(this.baseClass + '-' + this.transitionType);
      }
    },

    teardown: function(node) {
      node.classList.remove(this.baseClass);
      if (this.transitionType) {
        node.classList.remove(this.baseClass + '-' + this.transitionType);
      }
    },

    transitionOpened: function(node, opened) {
      this.listenOnce(node, this.completeEventName, function() {
        node.classList.toggle(this.revealedClass, opened);
        if (!opened) {
          node.classList.remove(this.closedClass);
        }
        this.complete(node);
      });
      node.classList.toggle(this.openedClass, opened);
      node.classList.toggle(this.closedClass, !opened);
    }

  });
;

  Polymer('paper-dialog-transition',{
    baseClass: 'paper-dialog-transition'
  });
;


  var bookSizes = [
  { width: 7, height: 5},
  { width: 11, height: 8},
  { width: 8, height: 8},
  { width: 12, height: 12}
  ];
  Polymer( {
    publish: {
      user: null,
      bookSizes: null
    },
    created: function() {
      this.user = document.createElement('pook-fire-user');
      this.bookSizes = bookSizes;
    },
    newBookDialog: function() {
      this.$.newBookDialog.toggle();
    },
    newBook: function() {
      console.log('new book');
    }
  });
  ;

  Polymer('pook-page-security',{
    publish: {
      fireAccount: null,
      user: null
    },
    created: function() {
      this.user = document.createElement('pook-fire-user');
      this.user.requestDatabase('account');
    },
    get flash() {
      return document.querySelector('pook-flash');
    },
    changePassword: function() {
      var ref = this.user.databases['account'].ref;
      var auth = ref.getAuth();
      ref.changePassword( {
          email: auth.password.email,
          oldPassword: this.$.oldPassword.value,
          newPassword: this.$.newPassword.value
        },
        this.changePasswordComplete.bind(this)
      );
    },
    changePasswordComplete: function(err) {
      if (err)
        this.flash.error = 'Password could not be changed. Try again.';
      else
        this.flash.message = "Password changed succcesfully";
    }
  });
  ;

  "use strict";
  Polymer('pook-page-photos',{
    publish: {
      user: null,
      forceUserPhotos: 0, // increment to force userPhotos sync
      iconHeight: 196
    },
    computed: {
      // have to force recomputation of userPhotos
      userPhotoKeys: '{ obj: user.userPhotos, force: forceUserPhotos } | keysToArray'
    },
    observe: {
      'user.userPhotos': 'userPhotosChanged'
    },
    created: function() {
      this.user = document.createElement('pook-fire-user');
      this.user.requestDatabase('userPhotos');
      this.userPhotoObserver = null;
    },
    userPhotosChanged: function() {
      if (!this.user.userPhotos) {
        if (this.userPhotoObserver) {
          this.userPhotoObserver.close();
          this.userPhotoObserver = null;
          this.forceUserPhotos += 1;
        }
        return;
      }
      if (this.userPhotoObserver)
        return;
      var THIS = this;
      this.userPhotoObserver = new ObjectObserver(this.user.userPhotos);
      this.userPhotoObserver.open(function(added, removed, changed, getOldValue) {
        // console.log('userPhotos observed');
        THIS.forceUserPhotos += 1;
      });
    },
    createPhotoThing: function() {
      var all = document.querySelectorAll('html /deep/ *');
      for (var i=0; i<all.length; i++)
        if (all[i].scrollTop !=0)
          console.log(all[i]);
      debugger;
    },
    keysToArray: function(o) {
      var retVal = [];
      for (var k in o.obj)
        retVal.push(k);
      return retVal;
    },
    requestPhotoProxy: function(photoId) {
      this.user.requestPhotoProxy(photoId);
    },
    calculateIconDims: function(iconInfo, iconHeight) {
      var enclosure = new Rect({width: iconHeight * 1.33, height: iconHeight });
      var iconRect = new Rect( iconInfo);
      iconRect = iconRect.scaleBy(iconRect.fitInside(enclosure));
      return {
        src: iconInfo.src,
        width: iconRect.width,
        height: iconRect.height
      }
    }
  });
  ;

  Polymer('pook-main-app',{
    ready: function() {
      this.selectPaneByHash();
      this.addEventListener('scroll', function(ev) {
        console.log('scroll');
      });
    },
    selectPaneByHash: function() {
      if (!window.location.hash)
        return;
      var pane = this.$.pages.querySelector('[hash=' + window.location.hash.slice(1) + ']');
      if (pane) {
        for (var i=0; i<pane.parentNode.children.length; i++)
          if (pane.parentNode.children.item(i) == pane)
            this.$.menu.selected = i;
      }
    },
    selectPane: function(ev, detail) {
      window.location.hash = ev.detail.item.label;
      this.$.drawerPanel.closeDrawer();
    },
    logout: function() {
      this.$.fireUser.logout();
    },
    toggleDrawer: function() {
      this.$.drawerPanel.togglePanel();
    },
    fileDropped: function(ev) {
      this.$.fireUser.addPhotoFile(ev.detail);
    }
  });
  ;

/**
 * Rectangle utilities
 */
(function(scope) {
  var Rect = function(r) {
    this.top = this.left = this.width = this.height = 0;
    if (!('bottom' in r || 'height' in r))
      throw new Error("rect must have bottom or height");
    if (!('right' in r || 'width' in r))
      throw new Error("rect must have right or height");
    if ('top' in r)
      this.top = r.top;
    if ('left' in r)
      this.left = r.left;
    if ('width' in r)
      this.width = r.width;
    else
      this.width = r.right - this.left;
    if ('height' in r)
      this.height = r.height;
    else
      this.height = r.bottom - this.top;
    if (this.height < 0) {
      console.warn('this.height < 0');
      this.height = 0;
    }
    if (this.width < 0) {
      console.warn('this.width < 0');
      this.width = 0;
    }
  }

  Rect.create = function(r) {
    return new Rect(r);
  }

  Rect.prototype = {
    toString: function() {
      return "t:" + this.top + ' l:' + this.left + ' w:' + this.width + ' h:' + this.height;
    },
    get right() {
      return this.left + this.width;
    },
    set right(val) {
      this.width = val - this.left;
      if (this.width < 0)
        console.warn("width is < 0");
    },
    get bottom() {
      return this.top + this.height;
    },
    set bottom(val) {
      this.height = val - this.top;
      if (this.height < 0)
        console.warn("height < 0");
    },
    get x() {
      return this.left;
    },
    get y() {
      return this.top;
    },
    round: function() {
      return new Rect({
        top: Math.round(this.top),
        left: Math.round(this.left),
        width: Math.round(this.width),
        height: Math.round(this.height)
      });
    },
    inset: function(inset) { // inset is number, or [t r b l]
      if (typeof inset == 'number') {
        return new Rect({
          top: this.top + inset,
          left: this.left + inset,
          width: this.width - inset * 2,
          height: this.height - inset * 2
        });
      }
      else if ($.isArray(inset) && inset.length == 4) {// TRBL
        return new Rect({
          top: this.top + inset[0],
          left: this.left + inset[3],
          width: this.width - inset[1] - inset[3],
          height: this.height - inset[0] - inset[2]
        });
      }
      else
        console.error("illegal inset value " + inset);
    },
    union: function(rectOrArray) {
      var rArray = $.isArray(rectOrArray) ? rectOrArray :
        rectOrArray ? [rectOrArray] : [];
      rArray = rArray.concat(this);
      var retVal = new Rect();
      for (var i=0; i< rArray.length; i++) {
        retVal.top = Math.min(retVal.top, rArray[i].top);
        retVal.left = Math.min(retVal.left, rArray[i].left);
        retVal.bottom = Math.max(retVal.bottom, rArray[i].bottom);
        retVal.right = Math.max(retVal.right, rArray[i].right);
      }
      return retVal;
    },
    intersect: function(r) {
      return new Rect({
        top: Math.max(this.top, r.top),
        left: Math.max(this.left, r.left),
        bottom: Math.min(this.bottom, r.bottom),
        right:Math.min(this.right, r.right)
      });
    },
    // return: scale
    fitInside: function(enclosure) {
      var vscale = enclosure.height / this.height;
      var hscale = enclosure.width / this.width;
      return Math.min(vscale, hscale) ;
    },
    // return: scale
    fillInside: function(enclosure) {
      var vscale = enclosure.height / this.height;
      var hscale = enclosure.width / this.width;
      return Math.max(vscale, hscale);
    },
    scaleBy: function(scale, scaleOrigin) {
      var retVal = new Rect(this);
      retVal.width = retVal.width * scale;
      retVal.height = retVal.height * scale;
      if (scaleOrigin) {
        if (retVal.top)
          retVal.top *= scale;
        if (retVal.left)
          retVal.left *= scale;
      }
      return retVal;
    },
    // centers this inside enclosing rect.
    // result top/left are in respect to enclosing rect
    centerIn: function(enclosingRect, options) {
      var options = $.extend({}, {
        focalPoint: {x:50, y:50}, // Focal point is the center of new rect in % units
        forceInside: false
      }, options );
      var myFocal = {
        x: options.focalPoint.x / 100 * this.width,
        y: options.focalPoint.y / 100 * this.height
      };
      var myRect = new Rect( {
        left: enclosingRect.width / 2 - myFocal.x,
        top: enclosingRect.height / 2 - myFocal.y,
        width: this.width,
        height: this.height
      });
      if (options.forceInside) {
        myRect.top = Math.min(0, myRect.top);
        myRect.left = Math.min(0, myRect.left);
        myRect.top = Math.max(enclosingRect.height - this.height, myRect.top);
        myRect.left = Math.max(enclosingRect.width - this.width, myRect.left);
      }
      return myRect;
    },
    moveBy: function(x, y) {
      return new Rect({
        top: this.top + y,
        left: this.left + x,
        width: this.width,
        height: this.height
      });
    },
    pointInRect: function(x, y) {
      return y >= this.top && y < this.bottom && x >= this.left && x < this.right;
    },
    forceInside: function(enclosure) {
      var scale = this.fitInside(enclosure);
      var retVal;
      if (scale < 1)
        retVal = this.scaleBy(scale);
      else
        retVal = new Rect(this);
      if (retVal.top < enclosure.top)
        retVal.top = enclosure.top;
      if (retVal.left < enclosure.left)
        retVal.left = enclosure.left;
      if (retVal.bottom > enclosure.bottom)
        retVal.top = enclosure.bottom - this.height;
      if (retVal.right > enclosure.right)
        retVal.left = enclosure.right - this.width;
      return retVal;
    }
  }
  scope.Rect = Rect;
})(window);
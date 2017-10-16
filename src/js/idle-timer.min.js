/*
 * jQuery idleTimer plugin
 * version 0.9.100511
 * by Paul Irish.
 *   http://github.com/paulirish/yui-misc/tree/
 * MIT license

 * adapted from YUI idle timer by nzakas:
 *   http://github.com/nzakas/yui-misc/
*/
(function(a){a.idleTimer=function(j,c){var d=false,g=true,h=30000,k="mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove";c=c||document;var f=function(o){if(typeof o==="number"){o=undefined}var n=a.data(o||c,"idleTimerObj");n.idle=!n.idle;var l=(+new Date())-n.olddate;n.olddate=+new Date();if(n.idle&&(l<h)){n.idle=false;clearTimeout(a.idleTimer.tId);if(g){a.idleTimer.tId=setTimeout(f,h)}return}var m=jQuery.Event(a.data(c,"idleTimer",n.idle?"idle":"active")+".idleTimer");a(c).trigger(m)},i=function(l){var m=a.data(l,"idleTimerObj")||{};m.enabled=false;clearTimeout(m.tId);a(l).unbind(".idleTimer")},b=function(){var l=a.data(this,"idleTimerObj");clearTimeout(l.tId);if(l.enabled){if(l.idle){f(this)}l.tId=setTimeout(f,l.timeout)}};var e=a.data(c,"idleTimerObj")||{};e.olddate=e.olddate||+new Date();if(typeof j==="number"){h=j}else{if(j==="destroy"){i(c);return this}else{if(j==="getElapsedTime"){return(+new Date())-e.olddate}}}a(c).bind(a.trim((k+" ").split(" ").join(".idleTimer ")),b);e.idle=d;e.enabled=g;e.timeout=h;e.tId=setTimeout(f,e.timeout);a.data(c,"idleTimer","active");a.data(c,"idleTimerObj",e)};a.fn.idleTimer=function(b){if(this[0]){a.idleTimer(b,this[0])}return this}})(apex.jQuery);
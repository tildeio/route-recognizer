import RouteRecognizer from './route-recognizer';

/* global define:true module:true window: true */
if (typeof define === 'function' && define['amd']) {
  define(function() { return RouteRecognizer; });
} else if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
  module['exports'] = RouteRecognizer;
} else if (typeof this !== 'undefined') {
  this['RouteRecognizer'] = RouteRecognizer;
}
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Emma: functional tools
 *
 * Emma may be freely distributed under the MIT license.
 * https://github.com/bcarrell/emma
 * Copyright (c) Brandon Carrell
 *
 */

// FIXME
/*jshint unused: false */

/**
 * Internal utilities
 */

var ArrProto = Array.prototype;
var ObjProto = Object.prototype;

var util = {
  isFunction: function(x) {
    return typeof x === 'function';
  },
  isObject: function(x) {
    return typeof x === 'object' && x !== null;
  },
  isString: function(x) {
    return typeof x === 'string';
  },
  isArray: Array.isArray || function(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  },
  isNumber: function(x) {
    return typeof x === 'number';
  }
};

/**
 * External utilities
 */

// terminates chain
function realize() {
  // temporarily just return the collection for now,
  // later more interesting logic
  return this.coll; // FIXME
}

// terminates chain
function eq() {
  var
    result = [],
    args = ArrProto.slice.apply(arguments);

  if (!args.length) {
    args.push(0);
  }

  for (var i = 0; i < args.length; i++) {
    result.push(this.acc[args[i]]);
  }

  if (result.length === 1) {
    return result[0];
  } else {
    return result;
  }
}

function all() {
  return this.acc;
}

/**
 * Sequence functions
 */

function conj() {
  ArrProto.push.apply(this.coll, arguments);
  return this;
}

function cons() {
  ArrProto.unshift.apply(this.coll, arguments);
  return this;
}

function take(x) {
  this.acc.push(ArrProto.slice.call(this.coll, 0, x));
  this.coll = ArrProto.slice.call(this.coll, x);
  return this;
}

function takeWhile(f) {
  var
    coll = this.coll,
    len = coll.length,
    xs = [],
    next;

  for (var i = 0; i < len; i++) {
    next = coll[i];
    if (next && f(next)) {
      xs.push(next);
    } else {
      break;
    }
  }

  this.acc.push(xs);
  this.coll = ArrProto.slice.call(this.coll, xs.length);

  return this;
}

var Emma = {
  create: function(xs, f) {
    var
      newEmma = Object.create(Emma.prototype),
      isArr = util.isArray;

    newEmma.coll = xs;
    newEmma.f = f;
    newEmma.acc = [];

    if (!isArr(xs)) {
      newEmma.coll = [xs];
    }

    return newEmma;
  },
  prototype: { // public API
    conj: conj,
    cons: cons,
    realize: realize,
    r: realize,
    take: take,
    eq: eq,
    all: all,
    takeWhile: takeWhile
  }
};

/**
 * Main constructor/api for Emma to manage collections with, happily accepts
 * two function signatures:
 *
 *    (xs)
 *      - xs should be an array
 *    (xs, f)
 *      - xs can be an array, number, or string.  If xs is an array, f will
 *        use the last element of the array to `infinitely` grow the collection
 *        if it is necessary.  fn should be a function which accepts a single
 *        argument used to grow the collection.
 *
 * Usage example:
 *
 *   Array:
 *       var e = require('emma');
 *       var coll = e([1, 2, 3, 4]);
 *
 *   Function:
 *       var e = require('emma');
 *       var coll = e(0, function(x) {
 *          return x + 1;
 *       });
 *
 *     --
 *
 *       var e = require('emma');
 *       var coll = e([1, 2, 3], function(x) { // will generate starting at 4
 *          return x + 1;
 *       });
 */
module.exports = function(xs, f) {
  var
    isFn = util.isFunction,
    isArr = util.isArray,
    isStr = util.isString,
    isNum = util.isNumber;

  if (isFn(f) && (isArr(xs) || isStr(xs) || isNum(xs))) {
    return Emma.create(xs, f);
  } else if (isArr(xs) && f === undefined) {
    return Emma.create(xs);
  } else {
    throw new Error('Invalid function signature.');
  }
};

},{}]},{},[1]);
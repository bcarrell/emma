/**
 * Emma: functional toolkit
 *
 * Emma may be freely distributed under the MIT license.
 * https://github.com/bcarrell/emma
 * Copyright (c) Brandon Carrell
 *
 */

// FIXME
/*jshint unused: false */

// ============================================================================
// Internal utilities

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
  },
  slice: function(xs) {
    return Array.prototype.slice.call(xs);
  },
  lengths: function(xs) {
    return xs.map(function(arr) {
      return arr.length;
    });
  },
  shortest: function() {
    var arr = this.slice(arguments);

    return Math.min.apply(null, this.lengths(arr));
  },

};

function addOp(context, f) {
  context.ops.push(f);
}

// ============================================================================
// External utilities

function realize() {
  var _this = this,
      len = this.ops.length;

  for (var i = 0; i < len; i++) {
    // realizing all previously accumulated ops
    this.ops[i]();
  }

  this.ops = [];

  return this;
}


// ============================================================================
// Sequence fns

/**
 * Inserts elements at the end of the Array.
 *
 * @return {Object}
 */
function conj() {
  var _this = this,
    args = arguments;

  addOp(this, function() {
    _this.coll.push.apply(_this.coll, args);
  });

  return this;
}

/**
 * Inserts elements at the beginning of the Array.
 *
 * @return {Object}
 */
function cons() {
  var _this = this,
    args = arguments;

  addOp(this, function() {
    _this.coll.unshift.apply(_this.coll, args);
  });

  return this;
}

/**
 * Takes elements from the beginning of a collection as decided by a given
 * predicate function.  The taken elements become the new collection.
 *
 * Internal function.
 *
 * @param {Array} coll the collection to take from
 * @param {Function} f predicate function
 * @return {Array} xs the `taken` results
 */
function _takeWhile(coll, f) {
  var xs = [],
    len = coll.length,
    next,
    i;

  for (i = 0; i < len; i++) {
    next = coll[i];
    if (f(next, i)) {
      xs.push(next);
    }
  }

  return xs;
}

/**
 * Public function, defers to _takeWhile().
 *
 * @param {Function} f predicate function
 * @return {Object} this
 */
function takeWhile(f) {
  var _this = this;

  addOp(this, function() {
    var xs = _takeWhile(_this.coll, f);

    _this.coll = xs;
  });

  return this;
}

/**
 * Takes x number of elements starting from the beginning of the collection.
 *
 * @param {Number} x the number of elements to take
 * @return {Object} this
 */
function take(x) {
  return takeWhile.call(this, function(_, i) {
    return x >= (i + 1);
  });
}

/**
 * Removes elements from the beginning of the Array based on a predicate.
 *
 * @param {Function} f predicate function
 * @return {Object} this
 */
function dropWhile(f) {
  var _this = this;

  addOp(this, function() {
    var xs = _takeWhile(_this.coll, f),
      coll = _this.coll.slice(xs.length);

    _this.coll = coll;
  });

  return this;
}

/**
 * Removes x number of elements from the beginning of the Array.
 *
 * @param {Number} x
 * @return {Object} this
 */
function drop(x) {
  return dropWhile.call(this, function(_, i) {
    return x >= (i + 1);
  });
}

/**
 * Removes all duplicates from the Array as decided by a strict comparison.
 *
 * @return {Object} this
 */
function distinct() {
  var _this = this;

  addOp(this, function() {
    _this.coll = _this.coll.filter(function(el, pos, self) {
      return ArrProto.indexOf.call(self, el) === pos;
    });
  });

  return this;
}

/**
 * Filters elements from the Array as decided by a predicate function.
 *
 * @param {Function} f predicate function
 * @return {Object} this
 */
function filter(f) {
  var _this = this;

  addOp(this, function() {
    _this.coll = ArrProto.filter.call(_this.coll, function(el, pos, self) {
      return f(el);
    });
  });

  return this;
}

/**
 * Returns the tail of the Array (all elements except the first).
 *
 * @return {Object} this
 */
function rest() {
  var _this = this;

  addOp(this, function() {
    _this.coll.shift();
  });

  return this;
}

/**
 * Returns a new Array with an element of the first Array, then an element of
 * the second Array, etc.  Will exhaust when an array is empty.
 *
 * @return {Object} this
 */
function interleave() {
  var _this = this,
    arrs = util.slice(arguments),
    len = arrs.length,
    shortest,
    i;

  // confirm all Arrays
  for (i = 0; i < len; i++) {
    if (!util.isArray(arrs[i])) {
      throw new Error('Invalid function signature.');
    }
  }

  shortest = util.shortest.apply(util, arrs);

  addOp(this, function() {
    var coll = [],
      i;

    for (i = 0; i < shortest; i++) {
      coll.push(_this.coll[i]);
      arrs.forEach(function(arr) {
        coll.push(arr[i]);
      });
    }

    _this.coll = coll;
  });

  return this;
}

/**
 * Inserts `x` between all elements of the collection.
 *
 * @param {(Number|String)} x
 * @return {Object} this
 */
function interpose(x) {
  var _this = this;

  addOp(this, function() {
    var coll = _this.coll,
        len = coll.length,
        xs = [],
        i;

    for (i = 0; i < len; i++) {
      xs.push(coll[i]);
      xs.push(x);
    }

    xs.pop();

    _this.coll = xs;

  });

  return this;
}


var Emma = {
  create: function(xs, g) {
    var newEmma = Object.create(Emma.prototype),
      isArr = util.isArray;

    newEmma.coll = xs;
    newEmma.g = g;
    newEmma.ops = [];

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
    takeWhile: takeWhile,
    distinct: distinct,
    filter: filter,
    rest: rest,
    interleave: interleave,
    interpose: interpose,
    drop: drop,
    dropWhile: dropWhile
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
module.exports = function(xs, g) {
  var isFn = util.isFunction,
    isArr = util.isArray,
    isStr = util.isString,
    isNum = util.isNumber;

  if (isFn(g) && (isArr(xs) || isStr(xs) || isNum(xs))) {
    return Emma.create(xs, g);
  } else if (isArr(xs) && g === undefined) {
    return Emma.create(xs);
  } else {
    throw new Error('Invalid function signature.');
  }
};

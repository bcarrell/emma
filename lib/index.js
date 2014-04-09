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

function addOp(context, f) {
  context.ops.push(f);
}

/**
 * External utilities
 */

// terminates chain
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

/**
 * Sequence functions
 */

function conj() {
  var _this = this,
      args = arguments;

  addOp(this, function() {
    ArrProto.push.apply(_this.coll, args);
  });

  return this;
}

function cons() {
  var _this = this,
      args = arguments;

  addOp(this, function() {
    ArrProto.unshift.apply(_this.coll, args);
  });

  return this;
}

function _takeWhile(context, f) {
  var _g = context.g,
      xs = [],
      coll = ArrProto.slice.call(context.coll),
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

function takeWhile(f) {
  var _this = this;

  addOp(this, function() {
    var xs = _takeWhile(_this, f);

    _this.coll = xs;
  });

  return this;

}

function take(x) {
  return takeWhile.call(this, function(_, i) {
    return x >= (i + 1);
  });
}

function dropWhile(f) {
  var _this = this;

  addOp(this, function() {
    var xs = _takeWhile(_this, f),
        coll = ArrProto.slice.call(_this.coll, xs.length);

    _this.coll = coll;
  });

  return this;

}

function drop(x) {
  return dropWhile.call(this, function(_, i) {
    return x >= (i + 1);
  });
}

function distinct() {
  var _this = this;

  addOp(this, function() {
    _this.coll = ArrProto.filter.call(_this.coll, function(el, pos, self) {
      return ArrProto.indexOf.call(self, el) === pos;
    });
  });

  return this;
}

function filter(f) {
  var _this = this;

  addOp(this, function() {
    _this.coll = ArrProto.filter.call(_this.coll, function(el, pos, self) {
      return f(el);
    });
  });

  return this;
}

function rest() {
  var _this = this;

  addOp(this, function() {
    ArrProto.shift.call(_this.coll);
  });

  return this;
}

function interleave(xs) {
  var _this = this;

  addOp(this, function() {
    var i,
        coll = _this.coll,
        len = xs.length,
        ys = [];

    for (i = 0; i < len; i++) {
      ys.push(coll[i]);
      ys.push(xs[i]);
    }

    _this.coll = ys;
  });

  return this;
}

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

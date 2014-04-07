var e = require('../lib/index');

exports.throwers = function(test) {
  test.throws(function() {
    e();
  }, Error, 'Invalid function signature.');

  test.throws(function() {
    e(1);
  }, Error, 'Invalid function signature.');

  test.throws(function() {
    e('');
  }, Error, 'Invalid function signature.');

  test.throws(function() {
    e({});
  }, Error, 'Invalid function signature.');

  test.throws(function() {
    e([], '');
  }, Error, 'Invalid function signature.');

  test.throws(function() {
    e([], 0);
  }, Error, 'Invalid function signature.');

  test.throws(function() {
    e([], {});
  }, Error, 'Invalid function signature.');

  test.done();
};

exports.cons = function(test) {
  test.same([0, 1, 2, 3], e([1, 2, 3]).cons(0).r());
  test.same([0, 1, 2, 3], e([2, 3]).cons(0, 1).r());
  test.done();
};

exports.conj = function(test) {
  test.same([1, 2, 3, 4], e([1, 2, 3]).conj(4).r());
  test.same([1, 2, 3, 4, 5], e([1, 2, 3]).conj(4, 5).r());
  test.done();
};

exports.take = function(test) {
  var coll = e([1, 2, 3]);

  test.same([1], coll.take(1).eq());
  test.same([2, 3], coll.take(2).eq(1));

  test.done();
};

exports.takeWhile = function(test) {
  var
    coll = e([1, 2, 3]),
    f1 = function(x) {
      return x <= 1;
    },
    f2 = function(x) {
      return x <= 10;
    };

  test.same([1], coll.takeWhile(f1).eq());
  test.same([2, 3], coll.takeWhile(f2).eq(1));
  test.same([], coll.takeWhile(f1).eq(2));

  test.done();
};

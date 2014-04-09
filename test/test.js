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
  test.same([0, 1, 2, 3], e([1, 2, 3]).cons(0).r().coll);
  test.same([0, 1, 2, 3], e([2, 3]).cons(0, 1).r().coll);
  test.done();
};

exports.conj = function(test) {
  test.same([1, 2, 3, 4], e([1, 2, 3]).conj(4).r().coll);
  test.same([1, 2, 3, 4, 5], e([1, 2, 3]).conj(4, 5).r().coll);
  test.done();
};

exports.take = function(test) {
  var coll = e([1, 2, 3]);

  test.same([1, 2], coll.take(2).r().coll);
  test.same([1], coll.take(1).r().coll);

  test.done();
};

exports.takeWhile = function(test) {
  var coll = e([1, 2, 3]),
      f1 = function(x) {
        return x <= 2;
      },
      f2 = function(x) {
        return x <= 1;
      };

  test.same([1, 2], coll.takeWhile(f1).r().coll);
  test.same([1], coll.takeWhile(f2).r().coll);

  test.done();
};

exports.distinct = function(test) {
  test.same([1, 2, 3], e([1, 1, 2, 2, 2, 3]).distinct().r().coll);
  test.same([3], e([3, 3, 3, 3, 3, 3]).distinct().r().coll);
  test.same([], e([]).distinct().r().coll);
  test.done();
};

exports.filter = function(test) {
  test.same([1, 2, 3], e([1, 2, 3, 4, 5, 6]).filter(function(el) {
    return el < 4;
  }).r().coll);
  test.done();
};

exports.rest = function(test) {
  test.same([2, 3, 4], e([1, 2, 3, 4]).rest().r().coll);
  test.same([1, 2, 3, 4], e([1, 2, 3, 4]).cons(0).rest().r().coll);
  test.done();
};

exports.interleave = function(test) {
  var coll = e([1, 2, 3, 4]);

  test.same([1, 'test', 2, 'test2'],
            coll.interleave(['test', 'test2']).r().coll);

  test.done();
};

exports.interpose = function(test) {
  var coll = e([1, 2, 3]);

  test.same([1, ';', 2, ';', 3],
            coll.interpose(';').r().coll);

  test.done();
};

exports.dropWhile = function(test) {
  var coll = e([-2, -1, 0, 1, 2, 3]),
      isNegative = function(x) {
        return x < 0;
      };

  test.same([0, 1, 2, 3], coll.dropWhile(isNegative).r().coll);

  test.done();
};

exports.drop = function(test) {
  var coll = e([1, 2, 3, 4, 5]);

  test.same([3, 4, 5], coll.drop(2).r().coll);
  test.same([0, 4, 5], coll.drop(1).cons(0).r().coll);
  test.done();
};

exports.testReadme = function(test) {
  var coll = e([1, 2, 3, 4, 5]);

  test.same([0, 'x', 1, 'x', 2, 'x', 3, 'x', 4, 'x', 5, 'x', 6],
            coll.cons(0).conj(6).interpose('x').r().coll);

  test.done();
};

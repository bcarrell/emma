emma
====

Emma is a functional programming library for NodeJS and the browser.  It
emphasizes chainable function execution and deferred evaluation.

Emma allows you to construct functional chains of operations and
evaluate your chain when desired through a `realize()` function.

### Example Usage
```
var e = require('emma');
```

```
e([1, 2, 3, 4, 5]).cons(0).conj(6).interpose('x').realize().coll

// [0, 'x', 1, 'x', 2, 'x', 3, 'x', 4, 'x', 5, 'x', 6]
```

### Current API

Chain any of these from an instance of `emma`:

* conj
* cons
* take
* takeWhile
* distinct
* filter
* rest
* interleave
* interpose
* drop
* dropWhile

Then realize your chain with `r()` or `realize()` and access it with `.coll`

# Fresh paint, more to come.

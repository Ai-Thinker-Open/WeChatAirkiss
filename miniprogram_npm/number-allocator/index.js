module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1663860580796, function(require, module, exports) {
// Copyright Takatoshi Kondo 2021
//
// Distributed under the MIT License

const NumberAllocator = require('./lib/number-allocator.js')

module.exports.NumberAllocator = NumberAllocator

}, function(modId) {var map = {"./lib/number-allocator.js":1663860580797}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580797, function(require, module, exports) {
// Copyright Takatoshi Kondo 2021
//
// Distributed under the MIT License



const SortedSet = require('js-sdsl').OrderedSet
const debugTrace = require('debug')('number-allocator:trace')
const debugError = require('debug')('number-allocator:error')
/**
 * Interval constructor
 * @constructor
 * @param {Number} low  - The lowest value of the interval
 * @param {Number} high - The highest value of the interval
 */
function Interval (low, high) {
  this.low = low
  this.high = high
}

Interval.prototype.equals = function (other) {
  return this.low === other.low && this.high === other.high
}

Interval.prototype.compare = function (other) {
  if (this.low < other.low && this.high < other.low) return -1
  if (other.low < this.low && other.high < this.low) return 1
  return 0
}

/**
 * NumberAllocator constructor.
 * The all numbers are set to vacant status.
 * Time Complexity O(1)
 * @constructor
 * @param {Number} min  - The maximum number of allocatable. The number must be integer.
 * @param {Number} maxh - The minimum number of allocatable. The number must be integer.
 */
function NumberAllocator (min, max) {
  if (!(this instanceof NumberAllocator)) {
    return new NumberAllocator(min, max)
  }

  this.min = min
  this.max = max

  this.ss = new SortedSet(
    [],
    (lhs, rhs) => {
      return lhs.compare(rhs)
    }
  )
  debugTrace('Create')
  this.clear()
}

/**
 * Get the first vacant number. The status of the number is not updated.
 * Time Complexity O(1)
 * @return {Number} - The first vacant number. If all numbers are occupied, return null.
 *                    When alloc() is called then the same value will be allocated.
 */
NumberAllocator.prototype.firstVacant = function () {
  if (this.ss.size() === 0) return null
  return this.ss.front().low
}

/**
 * Allocate the first vacant number. The number become occupied status.
 * Time Complexity O(1)
 * @return {Number} - The first vacant number. If all numbers are occupied, return null.
 */
NumberAllocator.prototype.alloc = function () {
  if (this.ss.size() === 0) {
    debugTrace('alloc():empty')
    return null
  }
  const it = this.ss.begin()
  const low = it.pointer.low
  const high = it.pointer.high
  const num = low
  if (num + 1 <= high) {
    // x|----|
    this.ss.updateKeyByIterator(it, new Interval(low + 1, high))
  } else {
    this.ss.eraseElementByPos(0)
  }
  debugTrace('alloc():' + num)
  return num
}

/**
 * Use the number. The number become occupied status.
 * If the number has already been occupied, then return false.
 * Time Complexity O(logN) : N is the number of intervals (not numbers)
 * @param {Number} num - The number to request use.
 * @return {Boolean} - If `num` was not occupied, then return true, otherwise return false.
 */
NumberAllocator.prototype.use = function (num) {
  const key = new Interval(num, num)
  const it = this.ss.lowerBound(key)
  if (!it.equals(this.ss.end())) {
    const low = it.pointer.low
    const high = it.pointer.high
    if (it.pointer.equals(key)) {
      // |x|
      this.ss.eraseElementByIterator(it)
      debugTrace('use():' + num)
      return true
    }

    // x |-----|
    if (low > num) return false

    // |x----|
    if (low === num) {
      // x|----|
      this.ss.updateKeyByIterator(it, new Interval(low + 1, high))
      debugTrace('use():' + num)
      return true
    }

    // |----x|
    if (high === num) {
      // |----|x
      this.ss.updateKeyByIterator(it, new Interval(low, high - 1))
      debugTrace('use():' + num)
      return true
    }

    // |--x--|
    // x|--|
    this.ss.updateKeyByIterator(it, new Interval(num + 1, high))
    // |--|x|--|
    this.ss.insert(new Interval(low, num - 1))
    debugTrace('use():' + num)
    return true
  }

  debugTrace('use():failed')
  return false
}

/**
 * Deallocate the number. The number become vacant status.
 * Time Complexity O(logN) : N is the number of intervals (not numbers)
 * @param {Number} num - The number to deallocate. The number must be occupied status.
 *                       In other words, the number must be allocated by alloc() or occupied be use().
 */
NumberAllocator.prototype.free = function (num) {
  if (num < this.min || num > this.max) {
    debugError('free():' + num + ' is out of range')
    return
  }
  const key = new Interval(num, num)
  const it = this.ss.upperBound(key)
  if (it.equals(this.ss.end())) {
    // ....v
    if (it.equals(this.ss.begin())) {
      // Insert new interval
      this.ss.insert(key)
      return
    }
    it.pre()
    const low = it.pointer.high
    const high = it.pointer.high
    if (high + 1 === num) {
      // Concat to left
      this.ss.updateKeyByIterator(it, new Interval(low, num))
    } else {
      // Insert new interval
      this.ss.insert(key)
    }
  } else {
    if (it.equals(this.ss.begin())) {
      // v....
      if (num + 1 === it.pointer.low) {
        // Concat to right
        const low = it.pointer.high - 1
        const high = it.pointer.high
        this.ss.updateKeyByIterator(it, new Interval(low, high))
      } else {
        // Insert new interval
        this.ss.insert(key)
      }
    } else {
      // ..v..
      const rLow = it.pointer.low
      const rHigh = it.pointer.high
      it.pre()
      const lLow = it.pointer.low
      const lHigh = it.pointer.high
      if (lHigh + 1 === num) {
        if (num + 1 === rLow) {
          // Concat to left and right
          this.ss.eraseElementByIterator(it)
          const high = it.pointer.high
          this.ss.updateKeyByIterator(it, new Interval(lLow, high))
        } else {
          // Concat to left
          this.ss.updateKeyByIterator(it, new Interval(lLow, num))
        }
      } else {
        if (num + 1 === rLow) {
          // Concat to right
          this.ss.eraseElementByIterator(it.next())
          this.ss.insert(new Interval(num, rHigh))
        } else {
          // Insert new interval
          this.ss.insert(key)
        }
      }
    }
  }
  debugTrace('free():' + num)
}

/**
 * Clear all occupied numbers.
 * The all numbers are set to vacant status.
 * Time Complexity O(1)
 */
NumberAllocator.prototype.clear = function () {
  debugTrace('clear()')
  this.ss.clear()
  this.ss.insert(new Interval(this.min, this.max))
}

/**
 * Get the number of intervals. Interval is internal structure of this library.
 * This function is for debugging.
 * Time Complexity O(1)
 * @return {Number} - The number of intervals.
 */
NumberAllocator.prototype.intervalCount = function () {
  return this.ss.size()
}

/**
 * Dump the internal structor of the library.
 * This function is for debugging.
 * Time Complexity O(N) : N is the number of intervals (not numbers)
 */
NumberAllocator.prototype.dump = function () {
  console.log('length:' + this.ss.size())
  for (const element of this.ss) {
    console.log(element)
  }
}

module.exports = NumberAllocator

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1663860580796);
})()
//miniprogram-npm-outsideDeps=["js-sdsl","debug"]
//# sourceMappingURL=index.js.map
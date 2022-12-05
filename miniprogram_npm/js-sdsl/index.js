module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1663860580751, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashContainer = exports.TreeContainer = exports.SequentialContainer = exports.ContainerIterator = exports.Container = exports.HashMap = exports.HashSet = exports.OrderedMapIterator = exports.OrderedMap = exports.OrderedSetIterator = exports.OrderedSet = exports.DequeIterator = exports.Deque = exports.LinkListIterator = exports.LinkList = exports.VectorIterator = exports.Vector = exports.PriorityQueue = exports.Queue = exports.Stack = void 0;
var Stack_1 = require("./container/OtherContainer/Stack");
Object.defineProperty(exports, "Stack", { enumerable: true, get: function () { return __importDefault(Stack_1).default; } });
var Queue_1 = require("./container/OtherContainer/Queue");
Object.defineProperty(exports, "Queue", { enumerable: true, get: function () { return __importDefault(Queue_1).default; } });
var PriorityQueue_1 = require("./container/OtherContainer/PriorityQueue");
Object.defineProperty(exports, "PriorityQueue", { enumerable: true, get: function () { return __importDefault(PriorityQueue_1).default; } });
var Vector_1 = require("./container/SequentialContainer/Vector");
Object.defineProperty(exports, "Vector", { enumerable: true, get: function () { return __importDefault(Vector_1).default; } });
Object.defineProperty(exports, "VectorIterator", { enumerable: true, get: function () { return Vector_1.VectorIterator; } });
var LinkList_1 = require("./container/SequentialContainer/LinkList");
Object.defineProperty(exports, "LinkList", { enumerable: true, get: function () { return __importDefault(LinkList_1).default; } });
Object.defineProperty(exports, "LinkListIterator", { enumerable: true, get: function () { return LinkList_1.LinkListIterator; } });
var Deque_1 = require("./container/SequentialContainer/Deque");
Object.defineProperty(exports, "Deque", { enumerable: true, get: function () { return __importDefault(Deque_1).default; } });
Object.defineProperty(exports, "DequeIterator", { enumerable: true, get: function () { return Deque_1.DequeIterator; } });
var OrderedSet_1 = require("./container/TreeContainer/OrderedSet");
Object.defineProperty(exports, "OrderedSet", { enumerable: true, get: function () { return __importDefault(OrderedSet_1).default; } });
Object.defineProperty(exports, "OrderedSetIterator", { enumerable: true, get: function () { return OrderedSet_1.OrderedSetIterator; } });
var OrderedMap_1 = require("./container/TreeContainer/OrderedMap");
Object.defineProperty(exports, "OrderedMap", { enumerable: true, get: function () { return __importDefault(OrderedMap_1).default; } });
Object.defineProperty(exports, "OrderedMapIterator", { enumerable: true, get: function () { return OrderedMap_1.OrderedMapIterator; } });
var HashSet_1 = require("./container/HashContainer/HashSet");
Object.defineProperty(exports, "HashSet", { enumerable: true, get: function () { return __importDefault(HashSet_1).default; } });
var HashMap_1 = require("./container/HashContainer/HashMap");
Object.defineProperty(exports, "HashMap", { enumerable: true, get: function () { return __importDefault(HashMap_1).default; } });
var index_1 = require("./container/ContainerBase/index");
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return index_1.Container; } });
Object.defineProperty(exports, "ContainerIterator", { enumerable: true, get: function () { return index_1.ContainerIterator; } });
var index_2 = require("./container/SequentialContainer/Base/index");
Object.defineProperty(exports, "SequentialContainer", { enumerable: true, get: function () { return __importDefault(index_2).default; } });
var index_3 = require("./container/TreeContainer/Base/index");
Object.defineProperty(exports, "TreeContainer", { enumerable: true, get: function () { return __importDefault(index_3).default; } });
var index_4 = require("./container/HashContainer/Base/index");
Object.defineProperty(exports, "HashContainer", { enumerable: true, get: function () { return __importDefault(index_4).default; } });

}, function(modId) {var map = {"./container/OtherContainer/Stack":1663860580752,"./container/OtherContainer/Queue":1663860580754,"./container/OtherContainer/PriorityQueue":1663860580759,"./container/SequentialContainer/Vector":1663860580760,"./container/SequentialContainer/LinkList":1663860580761,"./container/SequentialContainer/Deque":1663860580755,"./container/TreeContainer/OrderedSet":1663860580762,"./container/TreeContainer/OrderedMap":1663860580766,"./container/HashContainer/HashSet":1663860580767,"./container/HashContainer/HashMap":1663860580769,"./container/ContainerBase/index":1663860580753,"./container/SequentialContainer/Base/index":1663860580756,"./container/TreeContainer/Base/index":1663860580763,"./container/HashContainer/Base/index":1663860580768}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580752, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../ContainerBase/index");
class Stack extends index_1.Base {
    constructor(container = []) {
        super();
        this.stack = [];
        container.forEach(element => this.push(element));
    }
    clear() {
        this.length = 0;
        this.stack.length = 0;
    }
    /**
     * @description Insert element to stack's end.
     */
    push(element) {
        this.stack.push(element);
        this.length += 1;
    }
    /**
     * @description Removes the end element.
     */
    pop() {
        this.stack.pop();
        if (this.length > 0)
            this.length -= 1;
    }
    /**
     * @description Accesses the end element.
     */
    top() {
        return this.stack[this.length - 1];
    }
}
exports.default = Stack;

}, function(modId) { var map = {"../ContainerBase/index":1663860580753}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580753, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = exports.Base = exports.ContainerIterator = void 0;
class ContainerIterator {
    constructor(iteratorType = ContainerIterator.NORMAL) {
        this.iteratorType = iteratorType;
    }
}
exports.ContainerIterator = ContainerIterator;
ContainerIterator.NORMAL = false;
ContainerIterator.REVERSE = true;
class Base {
    constructor() {
        /**
         * @description Container's size.
         * @protected
         */
        this.length = 0;
    }
    /**
     * @return The size of the container.
     */
    size() {
        return this.length;
    }
    /**
     * @return Boolean about if the container is empty.
     */
    empty() {
        return this.length === 0;
    }
}
exports.Base = Base;
class Container extends Base {
}
exports.Container = Container;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580754, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Deque_1 = __importDefault(require("../SequentialContainer/Deque"));
const index_1 = require("../ContainerBase/index");
class Queue extends index_1.Base {
    constructor(container = []) {
        super();
        this.queue = new Deque_1.default(container);
        this.length = this.queue.size();
    }
    clear() {
        this.queue.clear();
        this.length = 0;
    }
    /**
     * @description Inserts element to queue's end.
     */
    push(element) {
        this.queue.pushBack(element);
        this.length += 1;
    }
    /**
     * @description Removes the first element.
     */
    pop() {
        this.queue.popFront();
        if (this.length)
            this.length -= 1;
    }
    /**
     * @description Access the first element.
     */
    front() {
        return this.queue.front();
    }
}
exports.default = Queue;

}, function(modId) { var map = {"../SequentialContainer/Deque":1663860580755,"../ContainerBase/index":1663860580753}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580755, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DequeIterator = void 0;
const index_1 = __importDefault(require("./Base/index"));
const checkParams_1 = require("../../utils/checkParams");
const index_2 = require("../ContainerBase/index");
const RandomIterator_1 = require("./Base/RandomIterator");
class DequeIterator extends RandomIterator_1.RandomIterator {
    copy() {
        return new DequeIterator(this.node, this.size, this.getElementByPos, this.setElementByPos, this.iteratorType);
    }
}
exports.DequeIterator = DequeIterator;
class Deque extends index_1.default {
    constructor(container = [], bucketSize = (1 << 12)) {
        super();
        this.first = 0;
        this.curFirst = 0;
        this.last = 0;
        this.curLast = 0;
        this.bucketNum = 0;
        this.map = [];
        let _length;
        if ('size' in container) {
            if (typeof container.size === 'number') {
                _length = container.size;
            }
            else {
                _length = container.size();
            }
        }
        else if ('length' in container) {
            _length = container.length;
        }
        else {
            throw new RangeError('Can\'t get container\'s size!');
        }
        this.bucketSize = bucketSize;
        this.bucketNum = Math.max(Math.ceil(_length / this.bucketSize), 1);
        for (let i = 0; i < this.bucketNum; ++i) {
            this.map.push(new Array(this.bucketSize));
        }
        const needBucketNum = Math.ceil(_length / this.bucketSize);
        this.first = this.last = (this.bucketNum >> 1) - (needBucketNum >> 1);
        this.curFirst = this.curLast = (this.bucketSize - _length % this.bucketSize) >> 1;
        container.forEach(element => this.pushBack(element));
        this.size = this.size.bind(this);
        this.getElementByPos = this.getElementByPos.bind(this);
        this.setElementByPos = this.setElementByPos.bind(this);
    }
    /**
     * @description Growth the Deque.
     * @private
     */
    reAllocate() {
        const newMap = [];
        const addBucketNum = Math.max(this.bucketNum >> 1, 1);
        for (let i = 0; i < addBucketNum; ++i) {
            newMap[i] = new Array(this.bucketSize);
        }
        for (let i = this.first; i < this.bucketNum; ++i) {
            newMap[newMap.length] = this.map[i];
        }
        for (let i = 0; i < this.last; ++i) {
            newMap[newMap.length] = this.map[i];
        }
        newMap[newMap.length] = [...this.map[this.last]];
        this.first = addBucketNum;
        this.last = newMap.length - 1;
        for (let i = 0; i < addBucketNum; ++i) {
            newMap[newMap.length] = new Array(this.bucketSize);
        }
        this.map = newMap;
        this.bucketNum = newMap.length;
    }
    /**
     * @description Get the bucket position of the element and the pointer position by index.
     * @param pos The element's index.
     * @private
     */
    getElementIndex(pos) {
        const offset = this.curFirst + pos + 1;
        const offsetRemainder = offset % this.bucketSize;
        let curNodePointerIndex = offsetRemainder - 1;
        let curNodeBucketIndex = this.first + (offset - offsetRemainder) / this.bucketSize;
        if (offsetRemainder === 0)
            curNodeBucketIndex -= 1;
        curNodeBucketIndex %= this.bucketNum;
        if (curNodePointerIndex < 0)
            curNodePointerIndex += this.bucketSize;
        return { curNodeBucketIndex, curNodePointerIndex };
    }
    clear() {
        this.map = [[]];
        this.bucketNum = 1;
        this.first = this.last = this.length = 0;
        this.curFirst = this.curLast = this.bucketSize >> 1;
    }
    front() {
        return this.map[this.first][this.curFirst];
    }
    back() {
        return this.map[this.last][this.curLast];
    }
    begin() {
        return new DequeIterator(0, this.size, this.getElementByPos, this.setElementByPos);
    }
    end() {
        return new DequeIterator(this.length, this.size, this.getElementByPos, this.setElementByPos);
    }
    rBegin() {
        return new DequeIterator(this.length - 1, this.size, this.getElementByPos, this.setElementByPos, index_2.ContainerIterator.REVERSE);
    }
    rEnd() {
        return new DequeIterator(-1, this.size, this.getElementByPos, this.setElementByPos, index_2.ContainerIterator.REVERSE);
    }
    pushBack(element) {
        if (this.length) {
            if (this.curLast < this.bucketSize - 1) {
                this.curLast += 1;
            }
            else if (this.last < this.bucketNum - 1) {
                this.last += 1;
                this.curLast = 0;
            }
            else {
                this.last = 0;
                this.curLast = 0;
            }
            if (this.last === this.first &&
                this.curLast === this.curFirst)
                this.reAllocate();
        }
        this.length += 1;
        this.map[this.last][this.curLast] = element;
    }
    popBack() {
        if (!this.length)
            return;
        this.map[this.last][this.curLast] = undefined;
        if (this.length !== 1) {
            if (this.curLast > 0) {
                this.curLast -= 1;
            }
            else if (this.last > 0) {
                this.last -= 1;
                this.curLast = this.bucketSize - 1;
            }
            else {
                this.last = this.bucketNum - 1;
                this.curLast = this.bucketSize - 1;
            }
        }
        this.length -= 1;
    }
    /**
     * @description Push the element to the front.
     * @param element The element you want to push.
     */
    pushFront(element) {
        if (this.length) {
            if (this.curFirst > 0) {
                this.curFirst -= 1;
            }
            else if (this.first > 0) {
                this.first -= 1;
                this.curFirst = this.bucketSize - 1;
            }
            else {
                this.first = this.bucketNum - 1;
                this.curFirst = this.bucketSize - 1;
            }
            if (this.first === this.last &&
                this.curFirst === this.curLast)
                this.reAllocate();
        }
        this.length += 1;
        this.map[this.first][this.curFirst] = element;
    }
    /**
     * @description Remove the first element.
     */
    popFront() {
        if (!this.length)
            return;
        this.map[this.first][this.curFirst] = undefined;
        if (this.length !== 1) {
            if (this.curFirst < this.bucketSize - 1) {
                this.curFirst += 1;
            }
            else if (this.first < this.bucketNum - 1) {
                this.first += 1;
                this.curFirst = 0;
            }
            else {
                this.first = 0;
                this.curFirst = 0;
            }
        }
        this.length -= 1;
    }
    forEach(callback) {
        for (let i = 0; i < this.length; ++i) {
            callback(this.getElementByPos(i), i);
        }
    }
    getElementByPos(pos) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        const { curNodeBucketIndex, curNodePointerIndex } = this.getElementIndex(pos);
        return this.map[curNodeBucketIndex][curNodePointerIndex];
    }
    setElementByPos(pos, element) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        const { curNodeBucketIndex, curNodePointerIndex } = this.getElementIndex(pos);
        this.map[curNodeBucketIndex][curNodePointerIndex] = element;
    }
    insert(pos, element, num = 1) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length);
        if (pos === 0) {
            while (num--)
                this.pushFront(element);
        }
        else if (pos === this.length) {
            while (num--)
                this.pushBack(element);
        }
        else {
            const arr = [];
            for (let i = pos; i < this.length; ++i) {
                arr.push(this.getElementByPos(i));
            }
            this.cut(pos - 1);
            for (let i = 0; i < num; ++i)
                this.pushBack(element);
            for (let i = 0; i < arr.length; ++i)
                this.pushBack(arr[i]);
        }
    }
    /**
     * @description Remove all elements after the specified position (excluding the specified position).
     * @param pos The previous position of the first removed element.
     * @example deque.cut(1); // Then deque's size will be 2. deque -> [0, 1]
     */
    cut(pos) {
        if (pos < 0) {
            this.clear();
            return;
        }
        const { curNodeBucketIndex, curNodePointerIndex } = this.getElementIndex(pos);
        this.last = curNodeBucketIndex;
        this.curLast = curNodePointerIndex;
        this.length = pos + 1;
    }
    eraseElementByPos(pos) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        if (pos === 0)
            this.popFront();
        else if (pos === this.length - 1)
            this.popBack();
        else {
            const arr = [];
            for (let i = pos + 1; i < this.length; ++i) {
                arr.push(this.getElementByPos(i));
            }
            this.cut(pos);
            this.popBack();
            arr.forEach(element => this.pushBack(element));
        }
    }
    eraseElementByValue(value) {
        if (!this.length)
            return;
        const arr = [];
        for (let i = 0; i < this.length; ++i) {
            const element = this.getElementByPos(i);
            if (element !== value)
                arr.push(element);
        }
        const _length = arr.length;
        for (let i = 0; i < _length; ++i)
            this.setElementByPos(i, arr[i]);
        this.cut(_length - 1);
    }
    eraseElementByIterator(iter) {
        // @ts-ignore
        const node = iter.node;
        this.eraseElementByPos(node);
        iter = iter.next();
        return iter;
    }
    find(element) {
        for (let i = 0; i < this.length; ++i) {
            if (this.getElementByPos(i) === element) {
                return new DequeIterator(i, this.size, this.getElementByPos, this.setElementByPos);
            }
        }
        return this.end();
    }
    reverse() {
        let l = 0;
        let r = this.length - 1;
        while (l < r) {
            const tmp = this.getElementByPos(l);
            this.setElementByPos(l, this.getElementByPos(r));
            this.setElementByPos(r, tmp);
            l += 1;
            r -= 1;
        }
    }
    unique() {
        if (this.length <= 1)
            return;
        let index = 1;
        let pre = this.getElementByPos(0);
        for (let i = 1; i < this.length; ++i) {
            const cur = this.getElementByPos(i);
            if (cur !== pre) {
                pre = cur;
                this.setElementByPos(index++, cur);
            }
        }
        while (this.length > index)
            this.popBack();
    }
    sort(cmp) {
        const arr = [];
        for (let i = 0; i < this.length; ++i) {
            arr.push(this.getElementByPos(i));
        }
        arr.sort(cmp);
        for (let i = 0; i < this.length; ++i)
            this.setElementByPos(i, arr[i]);
    }
    /**
     * @description Remove as much useless space as possible.
     */
    shrinkToFit() {
        if (!this.length)
            return;
        const arr = [];
        this.forEach(element => arr.push(element));
        this.bucketNum = Math.max(Math.ceil(this.length / this.bucketSize), 1);
        this.length = this.first = this.last = this.curFirst = this.curLast = 0;
        this.map = [];
        for (let i = 0; i < this.bucketNum; ++i) {
            this.map.push(new Array(this.bucketSize));
        }
        for (let i = 0; i < arr.length; ++i)
            this.pushBack(arr[i]);
    }
    [Symbol.iterator]() {
        return function* () {
            for (let i = 0; i < this.length; ++i) {
                yield this.getElementByPos(i);
            }
        }.bind(this)();
    }
}
exports.default = Deque;

}, function(modId) { var map = {"./Base/index":1663860580756,"../../utils/checkParams":1663860580757,"../ContainerBase/index":1663860580753,"./Base/RandomIterator":1663860580758}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580756, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../ContainerBase/index");
class SequentialContainer extends index_1.Container {
}
exports.default = SequentialContainer;

}, function(modId) { var map = {"../../ContainerBase/index":1663860580753}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580757, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWithinAccessParams = void 0;
/**
 * @description Check if access is out of bounds.
 * @param pos The position want to access.
 * @param lower The lower bound.
 * @param upper The upper bound.
 * @return Boolean about if access is out of bounds.
 */
function checkWithinAccessParams(pos, lower, upper) {
    if (pos < lower || pos > upper) {
        throw new RangeError();
    }
}
exports.checkWithinAccessParams = checkWithinAccessParams;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580758, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomIterator = void 0;
const checkParams_1 = require("../../../utils/checkParams");
const index_1 = require("../../ContainerBase/index");
class RandomIterator extends index_1.ContainerIterator {
    constructor(index, size, getElementByPos, setElementByPos, iteratorType) {
        super(iteratorType);
        this.node = index;
        this.size = size;
        this.getElementByPos = getElementByPos;
        this.setElementByPos = setElementByPos;
        if (this.iteratorType === index_1.ContainerIterator.NORMAL) {
            this.pre = function () {
                if (this.node === 0) {
                    throw new RangeError('Deque iterator access denied!');
                }
                this.node -= 1;
                return this;
            };
            this.next = function () {
                if (this.node === this.size()) {
                    throw new RangeError('Deque Iterator access denied!');
                }
                this.node += 1;
                return this;
            };
        }
        else {
            this.pre = function () {
                if (this.node === this.size() - 1) {
                    throw new RangeError('Deque iterator access denied!');
                }
                this.node += 1;
                return this;
            };
            this.next = function () {
                if (this.node === -1) {
                    throw new RangeError('Deque iterator access denied!');
                }
                this.node -= 1;
                return this;
            };
        }
    }
    get pointer() {
        (0, checkParams_1.checkWithinAccessParams)(this.node, 0, this.size() - 1);
        return this.getElementByPos(this.node);
    }
    set pointer(newValue) {
        (0, checkParams_1.checkWithinAccessParams)(this.node, 0, this.size() - 1);
        this.setElementByPos(this.node, newValue);
    }
    equals(obj) {
        return this.node === obj.node;
    }
}
exports.RandomIterator = RandomIterator;

}, function(modId) { var map = {"../../../utils/checkParams":1663860580757,"../../ContainerBase/index":1663860580753}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580759, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../ContainerBase/index");
class PriorityQueue extends index_1.Base {
    /**
     * @description PriorityQueue's constructor.
     * @param container Initialize container, must have a forEach function.
     * @param cmp Compare function.
     * @param copy When the container is an array, you can choose to directly operate on the original object of
     *             the array or perform a shallow copy. The default is shallow copy.
     */
    constructor(container = [], cmp = (x, y) => {
        if (x > y)
            return -1;
        if (x < y)
            return 1;
        return 0;
    }, copy = true) {
        super();
        this.cmp = cmp;
        if (Array.isArray(container)) {
            this.priorityQueue = copy ? [...container] : container;
        }
        else {
            this.priorityQueue = [];
            container.forEach(element => this.priorityQueue.push(element));
        }
        this.length = this.priorityQueue.length;
        for (let parent = (this.length - 1) >> 1; parent >= 0; --parent) {
            let curParent = parent;
            let curChild = (curParent << 1) | 1;
            while (curChild < this.length) {
                const left = curChild;
                const right = left + 1;
                let minChild = left;
                if (right < this.length &&
                    this.cmp(this.priorityQueue[left], this.priorityQueue[right]) > 0) {
                    minChild = right;
                }
                if (this.cmp(this.priorityQueue[curParent], this.priorityQueue[minChild]) <= 0)
                    break;
                [this.priorityQueue[curParent], this.priorityQueue[minChild]] =
                    [this.priorityQueue[minChild], this.priorityQueue[curParent]];
                curParent = minChild;
                curChild = (curParent << 1) | 1;
            }
        }
    }
    /**
     * @description Adjusting parent's children to suit the nature of the heap.
     * @param parent Parent's index.
     * @private
     */
    adjust(parent) {
        const left = (parent << 1) | 1;
        const right = (parent << 1) + 2;
        if (left < this.length &&
            this.cmp(this.priorityQueue[parent], this.priorityQueue[left]) > 0) {
            [this.priorityQueue[parent], this.priorityQueue[left]] =
                [this.priorityQueue[left], this.priorityQueue[parent]];
        }
        if (right < this.length &&
            this.cmp(this.priorityQueue[parent], this.priorityQueue[right]) > 0) {
            [this.priorityQueue[parent], this.priorityQueue[right]] =
                [this.priorityQueue[right], this.priorityQueue[parent]];
        }
    }
    clear() {
        this.length = 0;
        this.priorityQueue.length = 0;
    }
    /**
     * @description Push element into a container in order.
     * @param element The element you want to push.
     */
    push(element) {
        this.priorityQueue.push(element);
        this.length += 1;
        if (this.length === 1)
            return;
        let curNode = this.length - 1;
        while (curNode > 0) {
            const parent = (curNode - 1) >> 1;
            if (this.cmp(this.priorityQueue[parent], element) <= 0)
                break;
            this.adjust(parent);
            curNode = parent;
        }
    }
    /**
     * @description Removes the top element.
     */
    pop() {
        if (!this.length)
            return;
        const last = this.priorityQueue[this.length - 1];
        this.length -= 1;
        let parent = 0;
        while (parent < this.length) {
            const left = (parent << 1) | 1;
            const right = (parent << 1) + 2;
            if (left >= this.length)
                break;
            let minChild = left;
            if (right < this.length &&
                this.cmp(this.priorityQueue[left], this.priorityQueue[right]) > 0) {
                minChild = right;
            }
            if (this.cmp(this.priorityQueue[minChild], last) >= 0)
                break;
            this.priorityQueue[parent] = this.priorityQueue[minChild];
            parent = minChild;
        }
        this.priorityQueue[parent] = last;
        this.priorityQueue.pop();
    }
    /**
     * @description Accesses the top element.
     */
    top() {
        return this.priorityQueue[0];
    }
}
exports.default = PriorityQueue;

}, function(modId) { var map = {"../ContainerBase/index":1663860580753}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580760, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorIterator = void 0;
const index_1 = __importDefault(require("./Base/index"));
const checkParams_1 = require("../../utils/checkParams");
const index_2 = require("../ContainerBase/index");
const RandomIterator_1 = require("./Base/RandomIterator");
class VectorIterator extends RandomIterator_1.RandomIterator {
    copy() {
        return new VectorIterator(this.node, this.size, this.getElementByPos, this.setElementByPos, this.iteratorType);
    }
}
exports.VectorIterator = VectorIterator;
class Vector extends index_1.default {
    /**
     * @description Vector's constructor.
     * @param container Initialize container, must have a forEach function.
     * @param copy When the container is an array, you can choose to directly operate on the original object of
     *             the array or perform a shallow copy. The default is shallow copy.
     */
    constructor(container = [], copy = true) {
        super();
        if (Array.isArray(container)) {
            this.vector = copy ? [...container] : container;
            this.length = container.length;
        }
        else {
            this.vector = [];
            container.forEach(element => this.pushBack(element));
        }
        this.size = this.size.bind(this);
        this.getElementByPos = this.getElementByPos.bind(this);
        this.setElementByPos = this.setElementByPos.bind(this);
    }
    clear() {
        this.length = 0;
        this.vector.length = 0;
    }
    begin() {
        return new VectorIterator(0, this.size, this.getElementByPos, this.setElementByPos);
    }
    end() {
        return new VectorIterator(this.length, this.size, this.getElementByPos, this.setElementByPos);
    }
    rBegin() {
        return new VectorIterator(this.length - 1, this.size, this.getElementByPos, this.setElementByPos, index_2.ContainerIterator.REVERSE);
    }
    rEnd() {
        return new VectorIterator(-1, this.size, this.getElementByPos, this.setElementByPos, index_2.ContainerIterator.REVERSE);
    }
    front() {
        return this.vector[0];
    }
    back() {
        return this.vector[this.length - 1];
    }
    forEach(callback) {
        for (let i = 0; i < this.length; ++i) {
            callback(this.vector[i], i);
        }
    }
    getElementByPos(pos) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        return this.vector[pos];
    }
    eraseElementByPos(pos) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        this.vector.splice(pos, 1);
        this.length -= 1;
    }
    eraseElementByValue(value) {
        let index = 0;
        for (let i = 0; i < this.length; ++i) {
            if (this.vector[i] !== value) {
                this.vector[index++] = this.vector[i];
            }
        }
        this.length = this.vector.length = index;
    }
    eraseElementByIterator(iter) {
        // @ts-ignore
        const node = iter.node;
        iter = iter.next();
        this.eraseElementByPos(node);
        return iter;
    }
    pushBack(element) {
        this.vector.push(element);
        this.length += 1;
    }
    popBack() {
        if (!this.length)
            return;
        this.vector.pop();
        this.length -= 1;
    }
    setElementByPos(pos, element) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        this.vector[pos] = element;
    }
    insert(pos, element, num = 1) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length);
        this.vector.splice(pos, 0, ...new Array(num).fill(element));
        this.length += num;
    }
    find(element) {
        for (let i = 0; i < this.length; ++i) {
            if (this.vector[i] === element) {
                return new VectorIterator(i, this.size, this.getElementByPos, this.getElementByPos);
            }
        }
        return this.end();
    }
    reverse() {
        this.vector.reverse();
    }
    unique() {
        let index = 1;
        for (let i = 1; i < this.length; ++i) {
            if (this.vector[i] !== this.vector[i - 1]) {
                this.vector[index++] = this.vector[i];
            }
        }
        this.length = this.vector.length = index;
    }
    sort(cmp) {
        this.vector.sort(cmp);
    }
    [Symbol.iterator]() {
        return function* () {
            return yield* this.vector;
        }.bind(this)();
    }
}
exports.default = Vector;

}, function(modId) { var map = {"./Base/index":1663860580756,"../../utils/checkParams":1663860580757,"../ContainerBase/index":1663860580753,"./Base/RandomIterator":1663860580758}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580761, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkListIterator = exports.LinkNode = void 0;
const index_1 = __importDefault(require("./Base/index"));
const checkParams_1 = require("../../utils/checkParams");
const index_2 = require("../ContainerBase/index");
class LinkNode {
    constructor(element) {
        this.value = undefined;
        this.pre = undefined;
        this.next = undefined;
        this.value = element;
    }
}
exports.LinkNode = LinkNode;
class LinkListIterator extends index_2.ContainerIterator {
    constructor(node, header, iteratorType) {
        super(iteratorType);
        this.node = node;
        this.header = header;
        if (this.iteratorType === index_2.ContainerIterator.NORMAL) {
            this.pre = function () {
                if (this.node.pre === this.header) {
                    throw new RangeError('LinkList iterator access denied!');
                }
                this.node = this.node.pre;
                return this;
            };
            this.next = function () {
                if (this.node === this.header) {
                    throw new RangeError('LinkList iterator access denied!');
                }
                this.node = this.node.next;
                return this;
            };
        }
        else {
            this.pre = function () {
                if (this.node.next === this.header) {
                    throw new RangeError('LinkList iterator access denied!');
                }
                this.node = this.node.next;
                return this;
            };
            this.next = function () {
                if (this.node === this.header) {
                    throw new RangeError('LinkList iterator access denied!');
                }
                this.node = this.node.pre;
                return this;
            };
        }
    }
    get pointer() {
        if (this.node === this.header) {
            throw new RangeError('LinkList iterator access denied!');
        }
        return this.node.value;
    }
    set pointer(newValue) {
        if (this.node === this.header) {
            throw new RangeError('LinkList iterator access denied!');
        }
        this.node.value = newValue;
    }
    equals(obj) {
        return this.node === obj.node;
    }
    copy() {
        return new LinkListIterator(this.node, this.header, this.iteratorType);
    }
}
exports.LinkListIterator = LinkListIterator;
class LinkList extends index_1.default {
    constructor(container = []) {
        super();
        this.header = new LinkNode();
        this.head = undefined;
        this.tail = undefined;
        container.forEach(element => this.pushBack(element));
    }
    clear() {
        this.length = 0;
        this.head = this.tail = undefined;
        this.header.pre = this.header.next = undefined;
    }
    begin() {
        return new LinkListIterator(this.head || this.header, this.header);
    }
    end() {
        return new LinkListIterator(this.header, this.header);
    }
    rBegin() {
        return new LinkListIterator(this.tail || this.header, this.header, index_2.ContainerIterator.REVERSE);
    }
    rEnd() {
        return new LinkListIterator(this.header, this.header, index_2.ContainerIterator.REVERSE);
    }
    front() {
        return this.head ? this.head.value : undefined;
    }
    back() {
        return this.tail ? this.tail.value : undefined;
    }
    forEach(callback) {
        if (!this.length)
            return;
        let curNode = this.head;
        let index = 0;
        while (curNode !== this.header) {
            callback(curNode.value, index++);
            curNode = curNode.next;
        }
    }
    getElementByPos(pos) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        let curNode = this.head;
        while (pos--) {
            curNode = curNode.next;
        }
        return curNode.value;
    }
    eraseElementByPos(pos) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        if (pos === 0)
            this.popFront();
        else if (pos === this.length - 1)
            this.popBack();
        else {
            let curNode = this.head;
            while (pos--) {
                curNode = curNode.next;
            }
            curNode = curNode;
            const pre = curNode.pre;
            const next = curNode.next;
            next.pre = pre;
            pre.next = next;
            this.length -= 1;
        }
    }
    eraseElementByValue(value) {
        while (this.head && this.head.value === value)
            this.popFront();
        while (this.tail && this.tail.value === value)
            this.popBack();
        if (!this.head)
            return;
        let curNode = this.head;
        while (curNode !== this.header) {
            if (curNode.value === value) {
                const pre = curNode.pre;
                const next = curNode.next;
                if (next)
                    next.pre = pre;
                if (pre)
                    pre.next = next;
                this.length -= 1;
            }
            curNode = curNode.next;
        }
    }
    eraseElementByIterator(iter) {
        // @ts-ignore
        const node = iter.node;
        if (node === this.header) {
            throw new RangeError('Invalid iterator');
        }
        iter = iter.next();
        if (this.head === node)
            this.popFront();
        else if (this.tail === node)
            this.popBack();
        else {
            const pre = node.pre;
            const next = node.next;
            if (next)
                next.pre = pre;
            if (pre)
                pre.next = next;
            this.length -= 1;
        }
        return iter;
    }
    pushBack(element) {
        this.length += 1;
        const newTail = new LinkNode(element);
        if (!this.tail) {
            this.head = this.tail = newTail;
            this.header.next = this.head;
            this.head.pre = this.header;
        }
        else {
            this.tail.next = newTail;
            newTail.pre = this.tail;
            this.tail = newTail;
        }
        this.tail.next = this.header;
        this.header.pre = this.tail;
    }
    popBack() {
        if (!this.tail)
            return;
        this.length -= 1;
        if (this.head === this.tail) {
            this.head = this.tail = undefined;
            this.header.next = undefined;
        }
        else {
            this.tail = this.tail.pre;
            if (this.tail)
                this.tail.next = undefined;
        }
        this.header.pre = this.tail;
        if (this.tail)
            this.tail.next = this.header;
    }
    setElementByPos(pos, element) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        let curNode = this.head;
        while (pos--) {
            curNode = curNode.next;
        }
        curNode.value = element;
    }
    insert(pos, element, num = 1) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length);
        if (num <= 0)
            return;
        if (pos === 0) {
            while (num--)
                this.pushFront(element);
        }
        else if (pos === this.length) {
            while (num--)
                this.pushBack(element);
        }
        else {
            let curNode = this.head;
            for (let i = 1; i < pos; ++i) {
                curNode = curNode.next;
            }
            const next = curNode.next;
            this.length += num;
            while (num--) {
                curNode.next = new LinkNode(element);
                curNode.next.pre = curNode;
                curNode = curNode.next;
            }
            curNode.next = next;
            if (next)
                next.pre = curNode;
        }
    }
    find(element) {
        if (!this.head)
            return this.end();
        let curNode = this.head;
        while (curNode !== this.header) {
            if (curNode.value === element) {
                return new LinkListIterator(curNode, this.header);
            }
            curNode = curNode.next;
        }
        return this.end();
    }
    reverse() {
        if (this.length <= 1)
            return;
        let pHead = this.head;
        let pTail = this.tail;
        let cnt = 0;
        while ((cnt << 1) < this.length) {
            const tmp = pHead.value;
            pHead.value = pTail.value;
            pTail.value = tmp;
            pHead = pHead.next;
            pTail = pTail.pre;
            cnt += 1;
        }
    }
    unique() {
        if (this.length <= 1)
            return;
        let curNode = this.head;
        while (curNode !== this.header) {
            let tmpNode = curNode;
            while (tmpNode.next && tmpNode.value === tmpNode.next.value) {
                tmpNode = tmpNode.next;
                this.length -= 1;
            }
            curNode.next = tmpNode.next;
            if (curNode.next)
                curNode.next.pre = curNode;
            curNode = curNode.next;
        }
    }
    sort(cmp) {
        if (this.length <= 1)
            return;
        const arr = [];
        this.forEach(element => arr.push(element));
        arr.sort(cmp);
        let curNode = this.head;
        arr.forEach((element) => {
            curNode.value = element;
            curNode = curNode.next;
        });
    }
    /**
     * @description Push an element to the front.
     * @param element The element you want to push.
     */
    pushFront(element) {
        this.length += 1;
        const newHead = new LinkNode(element);
        if (!this.head) {
            this.head = this.tail = newHead;
            this.tail.next = this.header;
            this.header.pre = this.tail;
        }
        else {
            newHead.next = this.head;
            this.head.pre = newHead;
            this.head = newHead;
        }
        this.header.next = this.head;
        this.head.pre = this.header;
    }
    /**
     * @description Removes the first element.
     */
    popFront() {
        if (!this.head)
            return;
        this.length -= 1;
        if (this.head === this.tail) {
            this.head = this.tail = undefined;
            this.header.pre = this.tail;
        }
        else {
            this.head = this.head.next;
            if (this.head)
                this.head.pre = this.header;
        }
        this.header.next = this.head;
    }
    /**
     * @description Merges two sorted lists.
     * @param list The other list you want to merge (must be sorted).
     */
    merge(list) {
        if (!this.head) {
            list.forEach(element => this.pushBack(element));
            return;
        }
        let curNode = this.head;
        list.forEach(element => {
            while (curNode &&
                curNode !== this.header &&
                curNode.value <= element) {
                curNode = curNode.next;
            }
            if (curNode === this.header) {
                this.pushBack(element);
                curNode = this.tail;
            }
            else if (curNode === this.head) {
                this.pushFront(element);
                curNode = this.head;
            }
            else {
                this.length += 1;
                const pre = curNode.pre;
                pre.next = new LinkNode(element);
                pre.next.pre = pre;
                pre.next.next = curNode;
                curNode.pre = pre.next;
            }
        });
    }
    [Symbol.iterator]() {
        return function* () {
            if (!this.head)
                return;
            let curNode = this.head;
            while (curNode !== this.header) {
                yield curNode.value;
                curNode = curNode.next;
            }
        }.bind(this)();
    }
}
exports.default = LinkList;

}, function(modId) { var map = {"./Base/index":1663860580756,"../../utils/checkParams":1663860580757,"../ContainerBase/index":1663860580753}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580762, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedSetIterator = void 0;
const index_1 = __importDefault(require("./Base/index"));
const index_2 = require("../ContainerBase/index");
const checkParams_1 = require("../../utils/checkParams");
const TreeIterator_1 = __importDefault(require("./Base/TreeIterator"));
class OrderedSetIterator extends TreeIterator_1.default {
    get pointer() {
        if (this.node === this.header) {
            throw new RangeError('OrderedSet iterator access denied!');
        }
        return this.node.key;
    }
    copy() {
        return new OrderedSetIterator(this.node, this.header, this.iteratorType);
    }
}
exports.OrderedSetIterator = OrderedSetIterator;
class OrderedSet extends index_1.default {
    constructor(container = [], cmp) {
        super(cmp);
        this.iterationFunc = function* (curNode) {
            if (curNode === undefined)
                return;
            yield* this.iterationFunc(curNode.left);
            yield curNode.key;
            yield* this.iterationFunc(curNode.right);
        };
        container.forEach((element) => this.insert(element));
        this.iterationFunc = this.iterationFunc.bind(this);
    }
    begin() {
        return new OrderedSetIterator(this.header.left || this.header, this.header);
    }
    end() {
        return new OrderedSetIterator(this.header, this.header);
    }
    rBegin() {
        return new OrderedSetIterator(this.header.right || this.header, this.header, index_2.ContainerIterator.REVERSE);
    }
    rEnd() {
        return new OrderedSetIterator(this.header, this.header, index_2.ContainerIterator.REVERSE);
    }
    front() {
        return this.header.left ? this.header.left.key : undefined;
    }
    back() {
        return this.header.right ? this.header.right.key : undefined;
    }
    forEach(callback) {
        let index = 0;
        for (const element of this)
            callback(element, index++);
    }
    getElementByPos(pos) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        let res;
        let index = 0;
        for (const element of this) {
            if (index === pos) {
                res = element;
            }
            index += 1;
        }
        return res;
    }
    /**
     * @description Insert element to set.
     * @param key The key want to insert.
     * @param hint You can give an iterator hint to improve insertion efficiency.
     */
    insert(key, hint) {
        this.set(key, undefined, hint);
    }
    find(element) {
        const curNode = this.findElementNode(this.root, element);
        if (curNode !== undefined) {
            return new OrderedSetIterator(curNode, this.header);
        }
        return this.end();
    }
    lowerBound(key) {
        const resNode = this._lowerBound(this.root, key);
        return new OrderedSetIterator(resNode, this.header);
    }
    upperBound(key) {
        const resNode = this._upperBound(this.root, key);
        return new OrderedSetIterator(resNode, this.header);
    }
    reverseLowerBound(key) {
        const resNode = this._reverseLowerBound(this.root, key);
        return new OrderedSetIterator(resNode, this.header);
    }
    reverseUpperBound(key) {
        const resNode = this._reverseUpperBound(this.root, key);
        return new OrderedSetIterator(resNode, this.header);
    }
    union(other) {
        other.forEach((element) => this.insert(element));
    }
    [Symbol.iterator]() {
        return this.iterationFunc(this.root);
    }
}
exports.default = OrderedSet;

}, function(modId) { var map = {"./Base/index":1663860580763,"../ContainerBase/index":1663860580753,"../../utils/checkParams":1663860580757,"./Base/TreeIterator":1663860580765}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580763, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TreeNode_1 = __importDefault(require("./TreeNode"));
const index_1 = require("../../ContainerBase/index");
const checkParams_1 = require("../../../utils/checkParams");
class TreeContainer extends index_1.Container {
    constructor(cmp = (x, y) => {
        if (x < y)
            return -1;
        if (x > y)
            return 1;
        return 0;
    }) {
        super();
        this.root = undefined;
        this.header = new TreeNode_1.default();
        /**
         * @description InOrder traversal the tree.
         * @protected
         */
        this.inOrderTraversal = (curNode, callback) => {
            if (curNode === undefined)
                return false;
            const ifReturn = this.inOrderTraversal(curNode.left, callback);
            if (ifReturn)
                return true;
            if (callback(curNode))
                return true;
            return this.inOrderTraversal(curNode.right, callback);
        };
        this.cmp = cmp;
    }
    /**
     * @param curNode The starting node of the search.
     * @param key The key you want to search.
     * @return TreeNode which key is greater than or equals to the given key.
     * @protected
     */
    _lowerBound(curNode, key) {
        let resNode;
        while (curNode) {
            const cmpResult = this.cmp(curNode.key, key);
            if (cmpResult < 0) {
                curNode = curNode.right;
            }
            else if (cmpResult > 0) {
                resNode = curNode;
                curNode = curNode.left;
            }
            else
                return curNode;
        }
        return resNode === undefined ? this.header : resNode;
    }
    /**
     * @param curNode The starting node of the search.
     * @param key The key you want to search.
     * @return TreeNode which key is greater than the given key.
     * @protected
     */
    _upperBound(curNode, key) {
        let resNode;
        while (curNode) {
            const cmpResult = this.cmp(curNode.key, key);
            if (cmpResult <= 0) {
                curNode = curNode.right;
            }
            else if (cmpResult > 0) {
                resNode = curNode;
                curNode = curNode.left;
            }
        }
        return resNode === undefined ? this.header : resNode;
    }
    /**
     * @param curNode The starting node of the search.
     * @param key The key you want to search.
     * @return TreeNode which key is less than or equals to the given key.
     * @protected
     */
    _reverseLowerBound(curNode, key) {
        let resNode;
        while (curNode) {
            const cmpResult = this.cmp(curNode.key, key);
            if (cmpResult < 0) {
                resNode = curNode;
                curNode = curNode.right;
            }
            else if (cmpResult > 0) {
                curNode = curNode.left;
            }
            else
                return curNode;
        }
        return resNode === undefined ? this.header : resNode;
    }
    /**
     * @param curNode The starting node of the search.
     * @param key The key you want to search.
     * @return TreeNode which key is less than the given key.
     * @protected
     */
    _reverseUpperBound(curNode, key) {
        let resNode;
        while (curNode) {
            const cmpResult = this.cmp(curNode.key, key);
            if (cmpResult < 0) {
                resNode = curNode;
                curNode = curNode.right;
            }
            else if (cmpResult >= 0) {
                curNode = curNode.left;
            }
        }
        return resNode === undefined ? this.header : resNode;
    }
    /**
     * @description Make self balance after erase a node.
     * @param curNode The node want to remove.
     * @protected
     */
    eraseNodeSelfBalance(curNode) {
        while (true) {
            const parentNode = curNode.parent;
            if (parentNode === this.header)
                return;
            if (curNode.color === TreeNode_1.default.RED) {
                curNode.color = TreeNode_1.default.BLACK;
                return;
            }
            if (curNode === parentNode.left) {
                const brother = parentNode.right;
                if (brother.color === TreeNode_1.default.RED) {
                    brother.color = TreeNode_1.default.BLACK;
                    parentNode.color = TreeNode_1.default.RED;
                    if (parentNode === this.root) {
                        this.root = parentNode.rotateLeft();
                    }
                    else
                        parentNode.rotateLeft();
                }
                else if (brother.color === TreeNode_1.default.BLACK) {
                    if (brother.right && brother.right.color === TreeNode_1.default.RED) {
                        brother.color = parentNode.color;
                        parentNode.color = TreeNode_1.default.BLACK;
                        brother.right.color = TreeNode_1.default.BLACK;
                        if (parentNode === this.root) {
                            this.root = parentNode.rotateLeft();
                        }
                        else
                            parentNode.rotateLeft();
                        return;
                    }
                    else if (brother.left && brother.left.color === TreeNode_1.default.RED) {
                        brother.color = TreeNode_1.default.RED;
                        brother.left.color = TreeNode_1.default.BLACK;
                        brother.rotateRight();
                    }
                    else {
                        brother.color = TreeNode_1.default.RED;
                        curNode = parentNode;
                    }
                }
            }
            else {
                const brother = parentNode.left;
                if (brother.color === TreeNode_1.default.RED) {
                    brother.color = TreeNode_1.default.BLACK;
                    parentNode.color = TreeNode_1.default.RED;
                    if (parentNode === this.root) {
                        this.root = parentNode.rotateRight();
                    }
                    else
                        parentNode.rotateRight();
                }
                else {
                    if (brother.left && brother.left.color === TreeNode_1.default.RED) {
                        brother.color = parentNode.color;
                        parentNode.color = TreeNode_1.default.BLACK;
                        brother.left.color = TreeNode_1.default.BLACK;
                        if (parentNode === this.root) {
                            this.root = parentNode.rotateRight();
                        }
                        else
                            parentNode.rotateRight();
                        return;
                    }
                    else if (brother.right && brother.right.color === TreeNode_1.default.RED) {
                        brother.color = TreeNode_1.default.RED;
                        brother.right.color = TreeNode_1.default.BLACK;
                        brother.rotateLeft();
                    }
                    else {
                        brother.color = TreeNode_1.default.RED;
                        curNode = parentNode;
                    }
                }
            }
        }
    }
    /**
     * @description Remove a node.
     * @param curNode The node you want to remove.
     * @protected
     */
    eraseNode(curNode) {
        if (this.length === 1) {
            this.clear();
            return;
        }
        let swapNode = curNode;
        while (swapNode.left || swapNode.right) {
            if (swapNode.right) {
                swapNode = swapNode.right;
                while (swapNode.left)
                    swapNode = swapNode.left;
            }
            else if (swapNode.left) {
                swapNode = swapNode.left;
            }
            [curNode.key, swapNode.key] = [swapNode.key, curNode.key];
            [curNode.value, swapNode.value] = [swapNode.value, curNode.value];
            curNode = swapNode;
        }
        if (this.header.left === swapNode) {
            this.header.left = swapNode.parent;
        }
        else if (this.header.right === swapNode) {
            this.header.right = swapNode.parent;
        }
        this.eraseNodeSelfBalance(swapNode);
        swapNode.remove();
        this.length -= 1;
        this.root.color = TreeNode_1.default.BLACK;
    }
    /**
     * @description Make self balance after insert a node.
     * @param curNode The node want to insert.
     * @protected
     */
    insertNodeSelfBalance(curNode) {
        while (true) {
            const parentNode = curNode.parent;
            if (parentNode.color === TreeNode_1.default.BLACK)
                return;
            const grandParent = parentNode.parent;
            if (parentNode === grandParent.left) {
                const uncle = grandParent.right;
                if (uncle && uncle.color === TreeNode_1.default.RED) {
                    uncle.color = parentNode.color = TreeNode_1.default.BLACK;
                    if (grandParent === this.root)
                        return;
                    grandParent.color = TreeNode_1.default.RED;
                    curNode = grandParent;
                    continue;
                }
                else if (curNode === parentNode.right) {
                    curNode.color = TreeNode_1.default.BLACK;
                    if (curNode.left)
                        curNode.left.parent = parentNode;
                    if (curNode.right)
                        curNode.right.parent = grandParent;
                    parentNode.right = curNode.left;
                    grandParent.left = curNode.right;
                    curNode.left = parentNode;
                    curNode.right = grandParent;
                    if (grandParent === this.root) {
                        this.root = curNode;
                        this.header.parent = curNode;
                    }
                    else {
                        const GP = grandParent.parent;
                        if (GP.left === grandParent) {
                            GP.left = curNode;
                        }
                        else
                            GP.right = curNode;
                    }
                    curNode.parent = grandParent.parent;
                    parentNode.parent = curNode;
                    grandParent.parent = curNode;
                }
                else {
                    parentNode.color = TreeNode_1.default.BLACK;
                    if (grandParent === this.root) {
                        this.root = grandParent.rotateRight();
                    }
                    else
                        grandParent.rotateRight();
                }
                grandParent.color = TreeNode_1.default.RED;
            }
            else {
                const uncle = grandParent.left;
                if (uncle && uncle.color === TreeNode_1.default.RED) {
                    uncle.color = parentNode.color = TreeNode_1.default.BLACK;
                    if (grandParent === this.root)
                        return;
                    grandParent.color = TreeNode_1.default.RED;
                    curNode = grandParent;
                    continue;
                }
                else if (curNode === parentNode.left) {
                    curNode.color = TreeNode_1.default.BLACK;
                    if (curNode.left)
                        curNode.left.parent = grandParent;
                    if (curNode.right)
                        curNode.right.parent = parentNode;
                    grandParent.right = curNode.left;
                    parentNode.left = curNode.right;
                    curNode.left = grandParent;
                    curNode.right = parentNode;
                    if (grandParent === this.root) {
                        this.root = curNode;
                        this.header.parent = curNode;
                    }
                    else {
                        const GP = grandParent.parent;
                        if (GP.left === grandParent) {
                            GP.left = curNode;
                        }
                        else
                            GP.right = curNode;
                    }
                    curNode.parent = grandParent.parent;
                    parentNode.parent = curNode;
                    grandParent.parent = curNode;
                }
                else {
                    parentNode.color = TreeNode_1.default.BLACK;
                    if (grandParent === this.root) {
                        this.root = grandParent.rotateLeft();
                    }
                    else
                        grandParent.rotateLeft();
                }
                grandParent.color = TreeNode_1.default.RED;
            }
            return;
        }
    }
    /**
     * @description Find node which key is equals to the given key.
     * @param curNode The starting node of the search.
     * @param key The key you want to search.
     * @protected
     */
    findElementNode(curNode, key) {
        while (curNode) {
            const cmpResult = this.cmp(curNode.key, key);
            if (cmpResult < 0) {
                curNode = curNode.right;
            }
            else if (cmpResult > 0) {
                curNode = curNode.left;
            }
            else
                return curNode;
        }
        return curNode;
    }
    /**
     * @description Insert a key-value pair or set value by the given key.
     * @param key The key want to insert.
     * @param value The value want to set.
     * @param hint You can give an iterator hint to improve insertion efficiency.
     * @protected
     */
    set(key, value, hint) {
        if (this.root === undefined) {
            this.length += 1;
            this.root = new TreeNode_1.default(key, value);
            this.root.color = TreeNode_1.default.BLACK;
            this.root.parent = this.header;
            this.header.parent = this.root;
            this.header.left = this.root;
            this.header.right = this.root;
            return;
        }
        let curNode;
        const minNode = this.header.left;
        const compareToMin = this.cmp(minNode.key, key);
        if (compareToMin === 0) {
            minNode.value = value;
            return;
        }
        else if (compareToMin > 0) {
            minNode.left = new TreeNode_1.default(key, value);
            minNode.left.parent = minNode;
            curNode = minNode.left;
            this.header.left = curNode;
        }
        else {
            const maxNode = this.header.right;
            const compareToMax = this.cmp(maxNode.key, key);
            if (compareToMax === 0) {
                maxNode.value = value;
                return;
            }
            else if (compareToMax < 0) {
                maxNode.right = new TreeNode_1.default(key, value);
                maxNode.right.parent = maxNode;
                curNode = maxNode.right;
                this.header.right = curNode;
            }
            else {
                if (hint !== undefined) {
                    // @ts-ignore
                    const iterNode = hint.node;
                    if (iterNode !== this.header) {
                        const iterCmpRes = this.cmp(iterNode.key, key);
                        if (iterCmpRes === 0) {
                            iterNode.value = value;
                            return;
                        }
                        else if (iterCmpRes > 0) {
                            const preNode = iterNode.pre();
                            const preCmpRes = this.cmp(preNode.key, key);
                            if (preCmpRes === 0) {
                                preNode.value = value;
                                return;
                            }
                            else if (preCmpRes < 0) {
                                curNode = new TreeNode_1.default(key, value);
                                if (preNode.right === undefined) {
                                    preNode.right = curNode;
                                    curNode.parent = preNode;
                                }
                                else {
                                    iterNode.left = curNode;
                                    curNode.parent = iterNode;
                                }
                            }
                        }
                    }
                }
                if (curNode === undefined) {
                    curNode = this.root;
                    while (true) {
                        const cmpResult = this.cmp(curNode.key, key);
                        if (cmpResult > 0) {
                            if (curNode.left === undefined) {
                                curNode.left = new TreeNode_1.default(key, value);
                                curNode.left.parent = curNode;
                                curNode = curNode.left;
                                break;
                            }
                            curNode = curNode.left;
                        }
                        else if (cmpResult < 0) {
                            if (curNode.right === undefined) {
                                curNode.right = new TreeNode_1.default(key, value);
                                curNode.right.parent = curNode;
                                curNode = curNode.right;
                                break;
                            }
                            curNode = curNode.right;
                        }
                        else {
                            curNode.value = value;
                            return;
                        }
                    }
                }
            }
        }
        this.length += 1;
        this.insertNodeSelfBalance(curNode);
    }
    clear() {
        this.length = 0;
        this.root = undefined;
        this.header.parent = undefined;
        this.header.left = this.header.right = undefined;
    }
    /**
     * @description Update node's key by iterator.
     * @param iter The iterator you want to change.
     * @param key The key you want to update.
     * @return Boolean about if the modification is successful.
     */
    updateKeyByIterator(iter, key) {
        // @ts-ignore
        const node = iter.node;
        if (node === this.header) {
            throw new TypeError('Invalid iterator!');
        }
        if (this.length === 1) {
            node.key = key;
            return true;
        }
        if (node === this.header.left) {
            if (this.cmp(node.next().key, key) > 0) {
                node.key = key;
                return true;
            }
            return false;
        }
        if (node === this.header.right) {
            if (this.cmp(node.pre().key, key) < 0) {
                node.key = key;
                return true;
            }
            return false;
        }
        const preKey = node.pre().key;
        if (this.cmp(preKey, key) >= 0)
            return false;
        const nextKey = node.next().key;
        if (this.cmp(nextKey, key) <= 0)
            return false;
        node.key = key;
        return true;
    }
    eraseElementByPos(pos) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        let index = 0;
        this.inOrderTraversal(this.root, curNode => {
            if (pos === index) {
                this.eraseNode(curNode);
                return true;
            }
            index += 1;
            return false;
        });
    }
    /**
     * @description Remove the element of the specified key.
     * @param key The key you want to remove.
     */
    eraseElementByKey(key) {
        if (!this.length)
            return;
        const curNode = this.findElementNode(this.root, key);
        if (curNode === undefined)
            return;
        this.eraseNode(curNode);
    }
    eraseElementByIterator(iter) {
        // @ts-ignore
        const node = iter.node;
        if (node === this.header) {
            throw new RangeError('Invalid iterator');
        }
        if (node.right === undefined) {
            iter = iter.next();
        }
        this.eraseNode(node);
        return iter;
    }
    /**
     * @description Get the height of the tree.
     * @return Number about the height of the RB-tree.
     */
    getHeight() {
        if (!this.length)
            return 0;
        const traversal = (curNode) => {
            if (!curNode)
                return 0;
            return Math.max(traversal(curNode.left), traversal(curNode.right)) + 1;
        };
        return traversal(this.root);
    }
}
exports.default = TreeContainer;

}, function(modId) { var map = {"./TreeNode":1663860580764,"../../ContainerBase/index":1663860580753,"../../../utils/checkParams":1663860580757}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580764, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
class TreeNode {
    constructor(key, value) {
        this.color = true;
        this.key = undefined;
        this.value = undefined;
        this.left = undefined;
        this.right = undefined;
        this.parent = undefined;
        this.key = key;
        this.value = value;
    }
    /**
     * @description Get the pre node.
     * @return TreeNode about the pre node.
     */
    pre() {
        let preNode = this;
        if (preNode.color === TreeNode.RED &&
            preNode.parent.parent === preNode) {
            preNode = preNode.right;
        }
        else if (preNode.left) {
            preNode = preNode.left;
            while (preNode.right) {
                preNode = preNode.right;
            }
        }
        else {
            let pre = preNode.parent;
            while (pre.left === preNode) {
                preNode = pre;
                pre = preNode.parent;
            }
            preNode = pre;
        }
        return preNode;
    }
    /**
     * @description Get the next node.
     * @return TreeNode about the next node.
     */
    next() {
        let nextNode = this;
        if (nextNode.right) {
            nextNode = nextNode.right;
            while (nextNode.left) {
                nextNode = nextNode.left;
            }
        }
        else {
            let pre = nextNode.parent;
            while (pre.right === nextNode) {
                nextNode = pre;
                pre = nextNode.parent;
            }
            if (nextNode.right !== pre) {
                nextNode = pre;
            }
        }
        return nextNode;
    }
    /**
     * @description Rotate left.
     * @return TreeNode about moved to original position after rotation.
     */
    rotateLeft() {
        const PP = this.parent;
        const V = this.right;
        const R = V.left;
        if (PP.parent === this)
            PP.parent = V;
        else if (PP.left === this)
            PP.left = V;
        else
            PP.right = V;
        V.parent = PP;
        V.left = this;
        this.parent = V;
        this.right = R;
        if (R)
            R.parent = this;
        return V;
    }
    /**
     * @description Rotate left.
     * @return TreeNode about moved to original position after rotation.
     */
    rotateRight() {
        const PP = this.parent;
        const F = this.left;
        const K = F.right;
        if (PP.parent === this)
            PP.parent = F;
        else if (PP.left === this)
            PP.left = F;
        else
            PP.right = F;
        F.parent = PP;
        F.right = this;
        this.parent = F;
        this.left = K;
        if (K)
            K.parent = this;
        return F;
    }
    /**
     * @description Remove this.
     */
    remove() {
        const parent = this.parent;
        if (this === parent.left) {
            parent.left = undefined;
        }
        else
            parent.right = undefined;
    }
}
TreeNode.RED = true;
TreeNode.BLACK = false;
exports.default = TreeNode;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580765, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../ContainerBase/index");
class TreeIterator extends index_1.ContainerIterator {
    constructor(node, header, iteratorType) {
        super(iteratorType);
        this.node = node;
        this.header = header;
        if (this.iteratorType === index_1.ContainerIterator.NORMAL) {
            this.pre = function () {
                if (this.node === this.header.left) {
                    throw new RangeError('LinkList iterator access denied!');
                }
                this.node = this.node.pre();
                return this;
            };
            this.next = function () {
                if (this.node === this.header) {
                    throw new RangeError('LinkList iterator access denied!');
                }
                this.node = this.node.next();
                return this;
            };
        }
        else {
            this.pre = function () {
                if (this.node === this.header.right) {
                    throw new RangeError('LinkList iterator access denied!');
                }
                this.node = this.node.next();
                return this;
            };
            this.next = function () {
                if (this.node === this.header) {
                    throw new RangeError('LinkList iterator access denied!');
                }
                this.node = this.node.pre();
                return this;
            };
        }
    }
    equals(obj) {
        return this.node === obj.node;
    }
}
exports.default = TreeIterator;

}, function(modId) { var map = {"../../ContainerBase/index":1663860580753}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580766, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedMapIterator = void 0;
const index_1 = require("../ContainerBase/index");
const checkParams_1 = require("../../utils/checkParams");
const index_2 = __importDefault(require("./Base/index"));
const TreeIterator_1 = __importDefault(require("./Base/TreeIterator"));
class OrderedMapIterator extends TreeIterator_1.default {
    get pointer() {
        if (this.node === this.header) {
            throw new RangeError('OrderedMap iterator access denied');
        }
        return new Proxy([], {
            get: (_, props) => {
                if (props === '0')
                    return this.node.key;
                else if (props === '1')
                    return this.node.value;
            },
            set: (_, props, newValue) => {
                if (props !== '1') {
                    throw new TypeError('props must be 1');
                }
                this.node.value = newValue;
                return true;
            }
        });
    }
    copy() {
        return new OrderedMapIterator(this.node, this.header, this.iteratorType);
    }
}
exports.OrderedMapIterator = OrderedMapIterator;
class OrderedMap extends index_2.default {
    constructor(container = [], cmp) {
        super(cmp);
        this.iterationFunc = function* (curNode) {
            if (curNode === undefined)
                return;
            yield* this.iterationFunc(curNode.left);
            yield [curNode.key, curNode.value];
            yield* this.iterationFunc(curNode.right);
        };
        this.iterationFunc = this.iterationFunc.bind(this);
        container.forEach(([key, value]) => this.setElement(key, value));
    }
    begin() {
        return new OrderedMapIterator(this.header.left || this.header, this.header);
    }
    end() {
        return new OrderedMapIterator(this.header, this.header);
    }
    rBegin() {
        return new OrderedMapIterator(this.header.right || this.header, this.header, index_1.ContainerIterator.REVERSE);
    }
    rEnd() {
        return new OrderedMapIterator(this.header, this.header, index_1.ContainerIterator.REVERSE);
    }
    front() {
        if (!this.length)
            return undefined;
        const minNode = this.header.left;
        return [minNode.key, minNode.value];
    }
    back() {
        if (!this.length)
            return undefined;
        const maxNode = this.header.right;
        return [maxNode.key, maxNode.value];
    }
    forEach(callback) {
        let index = 0;
        for (const pair of this)
            callback(pair, index++);
    }
    lowerBound(key) {
        const resNode = this._lowerBound(this.root, key);
        return new OrderedMapIterator(resNode, this.header);
    }
    upperBound(key) {
        const resNode = this._upperBound(this.root, key);
        return new OrderedMapIterator(resNode, this.header);
    }
    reverseLowerBound(key) {
        const resNode = this._reverseLowerBound(this.root, key);
        return new OrderedMapIterator(resNode, this.header);
    }
    reverseUpperBound(key) {
        const resNode = this._reverseUpperBound(this.root, key);
        return new OrderedMapIterator(resNode, this.header);
    }
    /**
     * @description Insert a key-value pair or set value by the given key.
     * @param key The key want to insert.
     * @param value The value want to set.
     * @param hint You can give an iterator hint to improve insertion efficiency.
     */
    setElement(key, value, hint) {
        this.set(key, value, hint);
    }
    find(key) {
        const curNode = this.findElementNode(this.root, key);
        if (curNode !== undefined) {
            return new OrderedMapIterator(curNode, this.header);
        }
        return this.end();
    }
    /**
     * @description Get the value of the element of the specified key.
     */
    getElementByKey(key) {
        const curNode = this.findElementNode(this.root, key);
        return curNode ? curNode.value : undefined;
    }
    getElementByPos(pos) {
        (0, checkParams_1.checkWithinAccessParams)(pos, 0, this.length - 1);
        let res;
        let index = 0;
        for (const pair of this) {
            if (index === pos) {
                res = pair;
                break;
            }
            index += 1;
        }
        return res;
    }
    union(other) {
        other.forEach(([key, value]) => this.setElement(key, value));
    }
    [Symbol.iterator]() {
        return this.iterationFunc(this.root);
    }
}
exports.default = OrderedMap;

}, function(modId) { var map = {"../ContainerBase/index":1663860580753,"../../utils/checkParams":1663860580757,"./Base/index":1663860580763,"./Base/TreeIterator":1663860580765}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580767, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./Base/index"));
const Vector_1 = __importDefault(require("../SequentialContainer/Vector"));
const OrderedSet_1 = __importDefault(require("../TreeContainer/OrderedSet"));
class HashSet extends index_1.default {
    constructor(container = [], initBucketNum, hashFunc) {
        super(initBucketNum, hashFunc);
        this.hashTable = [];
        container.forEach(element => this.insert(element));
    }
    reAllocate() {
        if (this.bucketNum >= index_1.default.maxBucketNum)
            return;
        const newHashTable = [];
        const originalBucketNum = this.bucketNum;
        this.bucketNum <<= 1;
        const keys = Object.keys(this.hashTable);
        const keyNums = keys.length;
        for (let i = 0; i < keyNums; ++i) {
            const index = parseInt(keys[i]);
            const container = this.hashTable[index];
            const size = container.size();
            if (size === 0)
                continue;
            if (size === 1) {
                const element = container.front();
                newHashTable[this.hashFunc(element) & (this.bucketNum - 1)] = new Vector_1.default([element], false);
                continue;
            }
            const lowList = [];
            const highList = [];
            container.forEach(element => {
                const hashCode = this.hashFunc(element);
                if ((hashCode & originalBucketNum) === 0) {
                    lowList.push(element);
                }
                else
                    highList.push(element);
            });
            if (container instanceof OrderedSet_1.default) {
                if (lowList.length > index_1.default.untreeifyThreshold) {
                    newHashTable[index] = new OrderedSet_1.default(lowList);
                }
                else if (lowList.length) {
                    newHashTable[index] = new Vector_1.default(lowList, false);
                }
                if (highList.length > index_1.default.untreeifyThreshold) {
                    newHashTable[index + originalBucketNum] = new OrderedSet_1.default(highList);
                }
                else if (highList.length) {
                    newHashTable[index + originalBucketNum] = new Vector_1.default(highList, false);
                }
            }
            else {
                if (lowList.length >= index_1.default.treeifyThreshold) {
                    newHashTable[index] = new OrderedSet_1.default(lowList);
                }
                else if (lowList.length) {
                    newHashTable[index] = new Vector_1.default(lowList, false);
                }
                if (highList.length >= index_1.default.treeifyThreshold) {
                    newHashTable[index + originalBucketNum] = new OrderedSet_1.default(highList);
                }
                else if (highList.length) {
                    newHashTable[index + originalBucketNum] = new Vector_1.default(highList, false);
                }
            }
        }
        this.hashTable = newHashTable;
    }
    forEach(callback) {
        const containers = Object.values(this.hashTable);
        const containersNum = containers.length;
        let index = 0;
        for (let i = 0; i < containersNum; ++i) {
            containers[i].forEach(element => callback(element, index++));
        }
    }
    /**
     * @description Insert element to hash set.
     * @param element The element you want to insert.
     */
    insert(element) {
        const index = this.hashFunc(element) & (this.bucketNum - 1);
        const container = this.hashTable[index];
        if (!container) {
            this.hashTable[index] = new Vector_1.default([element], false);
            this.length += 1;
        }
        else {
            const preSize = container.size();
            if (container instanceof Vector_1.default) {
                if (!container.find(element)
                    .equals(container.end()))
                    return;
                container.pushBack(element);
                if (preSize + 1 >= index_1.default.treeifyThreshold) {
                    if (this.bucketNum <= index_1.default.minTreeifySize) {
                        this.length += 1;
                        this.reAllocate();
                        return;
                    }
                    this.hashTable[index] = new OrderedSet_1.default(container);
                }
                this.length += 1;
            }
            else {
                container.insert(element);
                const curSize = container.size();
                this.length += curSize - preSize;
            }
        }
        if (this.length > this.bucketNum * index_1.default.sigma) {
            this.reAllocate();
        }
    }
    eraseElementByKey(key) {
        const index = this.hashFunc(key) & (this.bucketNum - 1);
        const container = this.hashTable[index];
        if (!container)
            return;
        const preSize = container.size();
        if (preSize === 0)
            return;
        if (container instanceof Vector_1.default) {
            container.eraseElementByValue(key);
            const curSize = container.size();
            this.length += curSize - preSize;
        }
        else {
            container.eraseElementByKey(key);
            const curSize = container.size();
            this.length += curSize - preSize;
            if (curSize <= index_1.default.untreeifyThreshold) {
                this.hashTable[index] = new Vector_1.default(container);
            }
        }
    }
    find(element) {
        const index = this.hashFunc(element) & (this.bucketNum - 1);
        const container = this.hashTable[index];
        if (!container)
            return false;
        return !container.find(element)
            .equals(container.end());
    }
    [Symbol.iterator]() {
        return function* () {
            const containers = Object.values(this.hashTable);
            const containersNum = containers.length;
            for (let i = 0; i < containersNum; ++i) {
                const container = containers[i];
                for (const element of container) {
                    yield element;
                }
            }
        }.bind(this)();
    }
}
exports.default = HashSet;

}, function(modId) { var map = {"./Base/index":1663860580768,"../SequentialContainer/Vector":1663860580760,"../TreeContainer/OrderedSet":1663860580762}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580768, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../ContainerBase/index");
class HashContainer extends index_1.Base {
    constructor(initBucketNum = 16, hashFunc = (x) => {
        let str;
        if (typeof x !== 'string') {
            str = JSON.stringify(x);
        }
        else
            str = x;
        let hashCode = 0;
        const strLength = str.length;
        for (let i = 0; i < strLength; i++) {
            const ch = str.charCodeAt(i);
            hashCode = ((hashCode << 5) - hashCode) + ch;
            hashCode |= 0;
        }
        return hashCode >>> 0;
    }) {
        super();
        if (initBucketNum < 16 || (initBucketNum & (initBucketNum - 1)) !== 0) {
            throw new RangeError('InitBucketNum range error');
        }
        this.bucketNum = this.initBucketNum = initBucketNum;
        this.hashFunc = hashFunc;
    }
    clear() {
        this.length = 0;
        this.bucketNum = this.initBucketNum;
        this.hashTable = [];
    }
}
HashContainer.sigma = 0.75;
HashContainer.treeifyThreshold = 8;
HashContainer.untreeifyThreshold = 6;
HashContainer.minTreeifySize = 64;
HashContainer.maxBucketNum = (1 << 30);
exports.default = HashContainer;

}, function(modId) { var map = {"../../ContainerBase/index":1663860580753}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580769, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./Base/index"));
const Vector_1 = __importDefault(require("../SequentialContainer/Vector"));
const OrderedMap_1 = __importDefault(require("../TreeContainer/OrderedMap"));
class HashMap extends index_1.default {
    constructor(container = [], initBucketNum, hashFunc) {
        super(initBucketNum, hashFunc);
        this.hashTable = [];
        container.forEach(element => this.setElement(element[0], element[1]));
    }
    reAllocate() {
        if (this.bucketNum >= index_1.default.maxBucketNum)
            return;
        const newHashTable = [];
        const originalBucketNum = this.bucketNum;
        this.bucketNum <<= 1;
        const keys = Object.keys(this.hashTable);
        const keyNums = keys.length;
        for (let i = 0; i < keyNums; ++i) {
            const index = parseInt(keys[i]);
            const container = this.hashTable[index];
            const size = container.size();
            if (size === 0)
                continue;
            if (size === 1) {
                const element = container.front();
                newHashTable[this.hashFunc(element[0]) & (this.bucketNum - 1)] = new Vector_1.default([element], false);
                continue;
            }
            const lowList = [];
            const highList = [];
            container.forEach(element => {
                const hashCode = this.hashFunc(element[0]);
                if ((hashCode & originalBucketNum) === 0) {
                    lowList.push(element);
                }
                else
                    highList.push(element);
            });
            if (container instanceof OrderedMap_1.default) {
                if (lowList.length > index_1.default.untreeifyThreshold) {
                    newHashTable[index] = new OrderedMap_1.default(lowList);
                }
                else if (lowList.length) {
                    newHashTable[index] = new Vector_1.default(lowList, false);
                }
                if (highList.length > index_1.default.untreeifyThreshold) {
                    newHashTable[index + originalBucketNum] = new OrderedMap_1.default(highList);
                }
                else if (highList.length) {
                    newHashTable[index + originalBucketNum] = new Vector_1.default(highList, false);
                }
            }
            else {
                if (lowList.length >= index_1.default.treeifyThreshold) {
                    newHashTable[index] = new OrderedMap_1.default(lowList);
                }
                else if (lowList.length) {
                    newHashTable[index] = new Vector_1.default(lowList, false);
                }
                if (highList.length >= index_1.default.treeifyThreshold) {
                    newHashTable[index + originalBucketNum] = new OrderedMap_1.default(highList);
                }
                else if (highList.length) {
                    newHashTable[index + originalBucketNum] = new Vector_1.default(highList, false);
                }
            }
        }
        this.hashTable = newHashTable;
    }
    forEach(callback) {
        const containers = Object.values(this.hashTable);
        const containersNum = containers.length;
        let index = 0;
        for (let i = 0; i < containersNum; ++i) {
            containers[i].forEach(element => callback(element, index++));
        }
    }
    /**
     * @description Insert a new key-value pair to hash map or set value by key.
     * @param key The key you want to insert.
     * @param value The value you want to insert.
     * @example HashMap.setElement(1, 2); // insert a key-value pair [1, 2]
     */
    setElement(key, value) {
        const index = this.hashFunc(key) & (this.bucketNum - 1);
        const container = this.hashTable[index];
        if (!container) {
            this.length += 1;
            this.hashTable[index] = new Vector_1.default([[key, value]], false);
        }
        else {
            const preSize = container.size();
            if (container instanceof Vector_1.default) {
                for (const pair of container) {
                    if (pair[0] === key) {
                        pair[1] = value;
                        return;
                    }
                }
                container.pushBack([key, value]);
                if (preSize + 1 >= HashMap.treeifyThreshold) {
                    if (this.bucketNum <= HashMap.minTreeifySize) {
                        this.length += 1;
                        this.reAllocate();
                        return;
                    }
                    this.hashTable[index] = new OrderedMap_1.default(this.hashTable[index]);
                }
                this.length += 1;
            }
            else {
                container.setElement(key, value);
                const curSize = container.size();
                this.length += curSize - preSize;
            }
        }
        if (this.length > this.bucketNum * HashMap.sigma) {
            this.reAllocate();
        }
    }
    /**
     * @description Get the value of the element which has the specified key.
     * @param key The key you want to get.
     */
    getElementByKey(key) {
        const index = this.hashFunc(key) & (this.bucketNum - 1);
        const container = this.hashTable[index];
        if (!container)
            return undefined;
        if (container instanceof OrderedMap_1.default) {
            return container.getElementByKey(key);
        }
        else {
            for (const pair of container) {
                if (pair[0] === key)
                    return pair[1];
            }
            return undefined;
        }
    }
    eraseElementByKey(key) {
        const index = this.hashFunc(key) & (this.bucketNum - 1);
        const container = this.hashTable[index];
        if (!container)
            return;
        if (container instanceof Vector_1.default) {
            let pos = 0;
            for (const pair of container) {
                if (pair[0] === key) {
                    container.eraseElementByPos(pos);
                    this.length -= 1;
                    return;
                }
                pos += 1;
            }
        }
        else {
            const preSize = container.size();
            container.eraseElementByKey(key);
            const curSize = container.size();
            this.length += curSize - preSize;
            if (curSize <= index_1.default.untreeifyThreshold) {
                this.hashTable[index] = new Vector_1.default(container);
            }
        }
    }
    find(key) {
        const index = this.hashFunc(key) & (this.bucketNum - 1);
        const container = this.hashTable[index];
        if (!container)
            return false;
        if (container instanceof OrderedMap_1.default) {
            return !container.find(key)
                .equals(container.end());
        }
        for (const pair of container) {
            if (pair[0] === key)
                return true;
        }
        return false;
    }
    [Symbol.iterator]() {
        return function* () {
            const containers = Object.values(this.hashTable);
            const containersNum = containers.length;
            for (let i = 0; i < containersNum; ++i) {
                const container = containers[i];
                for (const element of container) {
                    yield element;
                }
            }
        }.bind(this)();
    }
}
exports.default = HashMap;

}, function(modId) { var map = {"./Base/index":1663860580768,"../SequentialContainer/Vector":1663860580760,"../TreeContainer/OrderedMap":1663860580766}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1663860580751);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map
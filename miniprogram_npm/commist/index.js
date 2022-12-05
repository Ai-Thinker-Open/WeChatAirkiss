module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1663860580732, function(require, module, exports) {
/*
The MIT License (MIT)

Copyright (c) 2014 Matteo Collina

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/



var leven = require('leven')

function commist () {
  var commands = []

  function lookup (array) {
    if (typeof array === 'string') { array = array.split(' ') }

    return commands.map(function (cmd) {
      return cmd.match(array)
    }).filter(function (match) {
      return match.partsNotMatched === 0
    }).sort(function (a, b) {
      if (a.inputNotMatched > b.inputNotMatched) { return 1 }

      if (a.inputNotMatched === b.inputNotMatched && a.totalDistance > b.totalDistance) { return 1 }

      return -1
    }).map(function (match) {
      return match.cmd
    })
  }

  function parse (args) {
    var matching = lookup(args)

    if (matching.length > 0) {
      matching[0].call(args)

      // return null if there is nothing left to do
      return null
    }

    return args
  }

  function register (inputCommand, func) {
    var commandOptions = {
      command: inputCommand,
      strict: false,
      func: func
    }

    if (typeof inputCommand === 'object') {
      commandOptions = Object.assign(commandOptions, inputCommand)
    }

    var matching = lookup(commandOptions.command)

    matching.forEach(function (match) {
      if (match.string === commandOptions.command) { throw new Error('command already registered: ' + commandOptions.command) }
    })

    commands.push(new Command(commandOptions))

    return this
  }

  return {
    register: register,
    parse: parse,
    lookup: lookup
  }
}

function Command (options) {
  this.string = options.command
  this.strict = options.strict
  this.parts = this.string.split(' ')
  this.length = this.parts.length
  this.func = options.func

  this.parts.forEach(function (part) {
    if (part.length < 3) { throw new Error('command words must be at least 3 chars: ' + options.command) }
  })
}

Command.prototype.call = function call (argv) {
  this.func(argv.slice(this.length))
}

Command.prototype.match = function match (string) {
  return new CommandMatch(this, string)
}

function CommandMatch (cmd, array) {
  this.cmd = cmd
  this.distances = cmd.parts.map(function (elem, i) {
    if (array[i] !== undefined) {
      if (cmd.strict) {
        return elem === array[i] ? 0 : undefined
      } else {
        return leven(elem, array[i])
      }
    } else { return undefined }
  }).filter(function (distance, i) {
    return distance !== undefined && distance < cmd.parts[i].length - 2
  })

  this.partsNotMatched = cmd.length - this.distances.length
  this.inputNotMatched = array.length - this.distances.length
  this.totalDistance = this.distances.reduce(function (acc, i) { return acc + i }, 0)
}

module.exports = commist

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1663860580732);
})()
//miniprogram-npm-outsideDeps=["leven"]
//# sourceMappingURL=index.js.map
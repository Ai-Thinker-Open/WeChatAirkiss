module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1663860580746, function(require, module, exports) {


const fs = require('fs')
const { PassThrough, pipeline } = require('readable-stream')
const glob = require('glob')

const defaults = {
  ext: '.txt',
  help: 'help'
}

function isDirectory (path) {
  try {
    const stat = fs.lstatSync(path)
    return stat.isDirectory()
  } catch (err) {
    return false
  }
}

function helpMe (opts) {
  opts = Object.assign({}, defaults, opts)

  if (!opts.dir) {
    throw new Error('missing dir')
  }

  if (!isDirectory(opts.dir)) {
    throw new Error(`${opts.dir} is not a directory`)
  }

  return {
    createStream: createStream,
    toStdout: toStdout
  }

  function createStream (args) {
    if (typeof args === 'string') {
      args = args.split(' ')
    } else if (!args || args.length === 0) {
      args = [opts.help]
    }

    const out = new PassThrough()
    const re = new RegExp(args.map(function (arg) {
      return arg + '[a-zA-Z0-9]*'
    }).join('[ /]+'))

    glob(opts.dir + '/**/*' + opts.ext, function (err, files) {
      if (err) return out.emit('error', err)

      files = files.map(function (path) {
        const relative = path.replace(opts.dir, '').replace(/^\//, '')
        return { path, relative }
      }).filter(function (file) {
        return file.relative.match(re)
      })

      if (files.length === 0) {
        return out.emit('error', new Error('no such help file'))
      } else if (files.length > 1) {
        const exactMatch = files.find((file) => file.relative === `${args[0]}${opts.ext}`)
        if (!exactMatch) {
          out.write('There are ' + files.length + ' help pages ')
          out.write('that matches the given request, please disambiguate:\n')
          files.forEach(function (file) {
            out.write('  * ')
            out.write(file.relative.replace(opts.ext, ''))
            out.write('\n')
          })
          out.end()
          return
        }
        files = [exactMatch]
      }

      pipeline(fs.createReadStream(files[0].path), out, () => {})
    })

    return out
  }

  function toStdout (args) {
    createStream(args)
      .on('error', function () {
        console.log('no such help file\n')
        toStdout()
      })
      .pipe(process.stdout)
  }
}

module.exports = helpMe

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1663860580746);
})()
//miniprogram-npm-outsideDeps=["fs","readable-stream","glob"]
//# sourceMappingURL=index.js.map
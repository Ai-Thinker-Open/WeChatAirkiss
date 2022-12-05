module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1663860580781, function(require, module, exports) {
/*
 * Copyright (c) 2015-2015 MQTT.js contributors.
 * Copyright (c) 2011-2014 Adam Rudd.
 *
 * See LICENSE for more information
 */

const MqttClient = require('./lib/client')
const connect = require('./lib/connect')
const Store = require('./lib/store')
const DefaultMessageIdProvider = require('./lib/default-message-id-provider')
const UniqueMessageIdProvider = require('./lib/unique-message-id-provider')

module.exports.connect = connect

// Expose MqttClient
module.exports.MqttClient = MqttClient
module.exports.Client = MqttClient
module.exports.Store = Store
module.exports.DefaultMessageIdProvider = DefaultMessageIdProvider
module.exports.UniqueMessageIdProvider = UniqueMessageIdProvider

}, function(modId) {var map = {"./lib/client":1663860580782,"./lib/connect":1663860580788,"./lib/store":1663860580783,"./lib/default-message-id-provider":1663860580786,"./lib/unique-message-id-provider":1663860580794}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580782, function(require, module, exports) {


/**
 * Module dependencies
 */
const EventEmitter = require('events').EventEmitter
const Store = require('./store')
const TopicAliasRecv = require('./topic-alias-recv')
const TopicAliasSend = require('./topic-alias-send')
const mqttPacket = require('mqtt-packet')
const DefaultMessageIdProvider = require('./default-message-id-provider')
const Writable = require('readable-stream').Writable
const inherits = require('inherits')
const reInterval = require('reinterval')
const clone = require('rfdc/default')
const validations = require('./validations')
const xtend = require('xtend')
const debug = require('debug')('mqttjs:client')
const nextTick = process ? process.nextTick : function (callback) { setTimeout(callback, 0) }
const setImmediate = global.setImmediate || function (callback) {
  // works in node v0.8
  nextTick(callback)
}
const defaultConnectOptions = {
  keepalive: 60,
  reschedulePings: true,
  protocolId: 'MQTT',
  protocolVersion: 4,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  clean: true,
  resubscribe: true
}

const socketErrors = [
  'ECONNREFUSED',
  'EADDRINUSE',
  'ECONNRESET',
  'ENOTFOUND'
]

// Other Socket Errors: EADDRINUSE, ECONNRESET, ENOTFOUND.

const errors = {
  0: '',
  1: 'Unacceptable protocol version',
  2: 'Identifier rejected',
  3: 'Server unavailable',
  4: 'Bad username or password',
  5: 'Not authorized',
  16: 'No matching subscribers',
  17: 'No subscription existed',
  128: 'Unspecified error',
  129: 'Malformed Packet',
  130: 'Protocol Error',
  131: 'Implementation specific error',
  132: 'Unsupported Protocol Version',
  133: 'Client Identifier not valid',
  134: 'Bad User Name or Password',
  135: 'Not authorized',
  136: 'Server unavailable',
  137: 'Server busy',
  138: 'Banned',
  139: 'Server shutting down',
  140: 'Bad authentication method',
  141: 'Keep Alive timeout',
  142: 'Session taken over',
  143: 'Topic Filter invalid',
  144: 'Topic Name invalid',
  145: 'Packet identifier in use',
  146: 'Packet Identifier not found',
  147: 'Receive Maximum exceeded',
  148: 'Topic Alias invalid',
  149: 'Packet too large',
  150: 'Message rate too high',
  151: 'Quota exceeded',
  152: 'Administrative action',
  153: 'Payload format invalid',
  154: 'Retain not supported',
  155: 'QoS not supported',
  156: 'Use another server',
  157: 'Server moved',
  158: 'Shared Subscriptions not supported',
  159: 'Connection rate exceeded',
  160: 'Maximum connect time',
  161: 'Subscription Identifiers not supported',
  162: 'Wildcard Subscriptions not supported'
}

function defaultId () {
  return 'mqttjs_' + Math.random().toString(16).substr(2, 8)
}

function applyTopicAlias (client, packet) {
  if (client.options.protocolVersion === 5) {
    if (packet.cmd === 'publish') {
      let alias
      if (packet.properties) {
        alias = packet.properties.topicAlias
      }
      const topic = packet.topic.toString()
      if (client.topicAliasSend) {
        if (alias) {
          if (topic.length !== 0) {
            // register topic alias
            debug('applyTopicAlias :: register topic: %s - alias: %d', topic, alias)
            if (!client.topicAliasSend.put(topic, alias)) {
              debug('applyTopicAlias :: error out of range. topic: %s - alias: %d', topic, alias)
              return new Error('Sending Topic Alias out of range')
            }
          }
        } else {
          if (topic.length !== 0) {
            if (client.options.autoAssignTopicAlias) {
              alias = client.topicAliasSend.getAliasByTopic(topic)
              if (alias) {
                packet.topic = ''
                packet.properties = { ...(packet.properties), topicAlias: alias }
                debug('applyTopicAlias :: auto assign(use) topic: %s - alias: %d', topic, alias)
              } else {
                alias = client.topicAliasSend.getLruAlias()
                client.topicAliasSend.put(topic, alias)
                packet.properties = { ...(packet.properties), topicAlias: alias }
                debug('applyTopicAlias :: auto assign topic: %s - alias: %d', topic, alias)
              }
            } else if (client.options.autoUseTopicAlias) {
              alias = client.topicAliasSend.getAliasByTopic(topic)
              if (alias) {
                packet.topic = ''
                packet.properties = { ...(packet.properties), topicAlias: alias }
                debug('applyTopicAlias :: auto use topic: %s - alias: %d', topic, alias)
              }
            }
          }
        }
      } else if (alias) {
        debug('applyTopicAlias :: error out of range. topic: %s - alias: %d', topic, alias)
        return new Error('Sending Topic Alias out of range')
      }
    }
  }
}

function removeTopicAliasAndRecoverTopicName (client, packet) {
  let alias
  if (packet.properties) {
    alias = packet.properties.topicAlias
  }

  let topic = packet.topic.toString()
  if (topic.length === 0) {
    // restore topic from alias
    if (typeof alias === 'undefined') {
      return new Error('Unregistered Topic Alias')
    } else {
      topic = client.topicAliasSend.getTopicByAlias(alias)
      if (typeof topic === 'undefined') {
        return new Error('Unregistered Topic Alias')
      } else {
        packet.topic = topic
      }
    }
  }
  if (alias) {
    delete packet.properties.topicAlias
  }
}

function sendPacket (client, packet, cb) {
  debug('sendPacket :: packet: %O', packet)
  debug('sendPacket :: emitting `packetsend`')

  client.emit('packetsend', packet)

  debug('sendPacket :: writing to stream')
  const result = mqttPacket.writeToStream(packet, client.stream, client.options)
  debug('sendPacket :: writeToStream result %s', result)
  if (!result && cb && cb !== nop) {
    debug('sendPacket :: handle events on `drain` once through callback.')
    client.stream.once('drain', cb)
  } else if (cb) {
    debug('sendPacket :: invoking cb')
    cb()
  }
}

function flush (queue) {
  if (queue) {
    debug('flush: queue exists? %b', !!(queue))
    Object.keys(queue).forEach(function (messageId) {
      if (typeof queue[messageId].cb === 'function') {
        queue[messageId].cb(new Error('Connection closed'))
        // This is suspicious.  Why do we only delete this if we have a callbck?
        // If this is by-design, then adding no as callback would cause this to get deleted unintentionally.
        delete queue[messageId]
      }
    })
  }
}

function flushVolatile (queue) {
  if (queue) {
    debug('flushVolatile :: deleting volatile messages from the queue and setting their callbacks as error function')
    Object.keys(queue).forEach(function (messageId) {
      if (queue[messageId].volatile && typeof queue[messageId].cb === 'function') {
        queue[messageId].cb(new Error('Connection closed'))
        delete queue[messageId]
      }
    })
  }
}

function storeAndSend (client, packet, cb, cbStorePut) {
  debug('storeAndSend :: store packet with cmd %s to outgoingStore', packet.cmd)
  let storePacket = packet
  let err
  if (storePacket.cmd === 'publish') {
    // The original packet is for sending.
    // The cloned storePacket is for storing to resend on reconnect.
    // Topic Alias must not be used after disconnected.
    storePacket = clone(packet)
    err = removeTopicAliasAndRecoverTopicName(client, storePacket)
    if (err) {
      return cb && cb(err)
    }
  }
  client.outgoingStore.put(storePacket, function storedPacket (err) {
    if (err) {
      return cb && cb(err)
    }
    cbStorePut()
    sendPacket(client, packet, cb)
  })
}

function nop (error) {
  debug('nop ::', error)
}

/**
 * MqttClient constructor
 *
 * @param {Stream} stream - stream
 * @param {Object} [options] - connection options
 * (see Connection#connect)
 */
function MqttClient (streamBuilder, options) {
  let k
  const that = this

  if (!(this instanceof MqttClient)) {
    return new MqttClient(streamBuilder, options)
  }

  this.options = options || {}

  // Defaults
  for (k in defaultConnectOptions) {
    if (typeof this.options[k] === 'undefined') {
      this.options[k] = defaultConnectOptions[k]
    } else {
      this.options[k] = options[k]
    }
  }

  debug('MqttClient :: options.protocol', options.protocol)
  debug('MqttClient :: options.protocolVersion', options.protocolVersion)
  debug('MqttClient :: options.username', options.username)
  debug('MqttClient :: options.keepalive', options.keepalive)
  debug('MqttClient :: options.reconnectPeriod', options.reconnectPeriod)
  debug('MqttClient :: options.rejectUnauthorized', options.rejectUnauthorized)
  debug('MqttClient :: options.topicAliasMaximum', options.topicAliasMaximum)

  this.options.clientId = (typeof options.clientId === 'string') ? options.clientId : defaultId()

  debug('MqttClient :: clientId', this.options.clientId)

  this.options.customHandleAcks = (options.protocolVersion === 5 && options.customHandleAcks) ? options.customHandleAcks : function () { arguments[3](0) }

  this.streamBuilder = streamBuilder

  this.messageIdProvider = (typeof this.options.messageIdProvider === 'undefined') ? new DefaultMessageIdProvider() : this.options.messageIdProvider

  // Inflight message storages
  this.outgoingStore = options.outgoingStore || new Store()
  this.incomingStore = options.incomingStore || new Store()

  // Should QoS zero messages be queued when the connection is broken?
  this.queueQoSZero = options.queueQoSZero === undefined ? true : options.queueQoSZero

  // map of subscribed topics to support reconnection
  this._resubscribeTopics = {}

  // map of a subscribe messageId and a topic
  this.messageIdToTopic = {}

  // Ping timer, setup in _setupPingTimer
  this.pingTimer = null
  // Is the client connected?
  this.connected = false
  // Are we disconnecting?
  this.disconnecting = false
  // Packet queue
  this.queue = []
  // connack timer
  this.connackTimer = null
  // Reconnect timer
  this.reconnectTimer = null
  // Is processing store?
  this._storeProcessing = false
  // Packet Ids are put into the store during store processing
  this._packetIdsDuringStoreProcessing = {}
  // Store processing queue
  this._storeProcessingQueue = []

  // Inflight callbacks
  this.outgoing = {}

  // True if connection is first time.
  this._firstConnection = true

  if (options.topicAliasMaximum > 0) {
    if (options.topicAliasMaximum > 0xffff) {
      debug('MqttClient :: options.topicAliasMaximum is out of range')
    } else {
      this.topicAliasRecv = new TopicAliasRecv(options.topicAliasMaximum)
    }
  }

  // Send queued packets
  this.on('connect', function () {
    const queue = this.queue

    function deliver () {
      const entry = queue.shift()
      debug('deliver :: entry %o', entry)
      let packet = null

      if (!entry) {
        that._resubscribe()
        return
      }

      packet = entry.packet
      debug('deliver :: call _sendPacket for %o', packet)
      let send = true
      if (packet.messageId && packet.messageId !== 0) {
        if (!that.messageIdProvider.register(packet.messageId)) {
          send = false
        }
      }
      if (send) {
        that._sendPacket(
          packet,
          function (err) {
            if (entry.cb) {
              entry.cb(err)
            }
            deliver()
          }
        )
      } else {
        debug('messageId: %d has already used. The message is skipped and removed.', packet.messageId)
        deliver()
      }
    }

    debug('connect :: sending queued packets')
    deliver()
  })

  this.on('close', function () {
    debug('close :: connected set to `false`')
    this.connected = false

    debug('close :: clearing connackTimer')
    clearTimeout(this.connackTimer)

    debug('close :: clearing ping timer')
    if (that.pingTimer !== null) {
      that.pingTimer.clear()
      that.pingTimer = null
    }

    if (this.topicAliasRecv) {
      this.topicAliasRecv.clear()
    }

    debug('close :: calling _setupReconnect')
    this._setupReconnect()
  })
  EventEmitter.call(this)

  debug('MqttClient :: setting up stream')
  this._setupStream()
}
inherits(MqttClient, EventEmitter)

/**
 * setup the event handlers in the inner stream.
 *
 * @api private
 */
MqttClient.prototype._setupStream = function () {
  const that = this
  const writable = new Writable()
  const parser = mqttPacket.parser(this.options)
  let completeParse = null
  const packets = []

  debug('_setupStream :: calling method to clear reconnect')
  this._clearReconnect()

  debug('_setupStream :: using streamBuilder provided to client to create stream')
  this.stream = this.streamBuilder(this)

  parser.on('packet', function (packet) {
    debug('parser :: on packet push to packets array.')
    packets.push(packet)
  })

  function nextTickWork () {
    if (packets.length) {
      nextTick(work)
    } else {
      const done = completeParse
      completeParse = null
      done()
    }
  }

  function work () {
    debug('work :: getting next packet in queue')
    const packet = packets.shift()

    if (packet) {
      debug('work :: packet pulled from queue')
      that._handlePacket(packet, nextTickWork)
    } else {
      debug('work :: no packets in queue')
      const done = completeParse
      completeParse = null
      debug('work :: done flag is %s', !!(done))
      if (done) done()
    }
  }

  writable._write = function (buf, enc, done) {
    completeParse = done
    debug('writable stream :: parsing buffer')
    parser.parse(buf)
    work()
  }

  function streamErrorHandler (error) {
    debug('streamErrorHandler :: error', error.message)
    if (socketErrors.includes(error.code)) {
      // handle error
      debug('streamErrorHandler :: emitting error')
      that.emit('error', error)
    } else {
      nop(error)
    }
  }

  debug('_setupStream :: pipe stream to writable stream')
  this.stream.pipe(writable)

  // Suppress connection errors
  this.stream.on('error', streamErrorHandler)

  // Echo stream close
  this.stream.on('close', function () {
    debug('(%s)stream :: on close', that.options.clientId)
    flushVolatile(that.outgoing)
    debug('stream: emit close to MqttClient')
    that.emit('close')
  })

  // Send a connect packet
  debug('_setupStream: sending packet `connect`')
  const connectPacket = Object.create(this.options)
  connectPacket.cmd = 'connect'
  if (this.topicAliasRecv) {
    if (!connectPacket.properties) {
      connectPacket.properties = {}
    }
    if (this.topicAliasRecv) {
      connectPacket.properties.topicAliasMaximum = this.topicAliasRecv.max
    }
  }
  // avoid message queue
  sendPacket(this, connectPacket)

  // Echo connection errors
  parser.on('error', this.emit.bind(this, 'error'))

  // auth
  if (this.options.properties) {
    if (!this.options.properties.authenticationMethod && this.options.properties.authenticationData) {
      that.end(() =>
        this.emit('error', new Error('Packet has no Authentication Method')
        ))
      return this
    }
    if (this.options.properties.authenticationMethod && this.options.authPacket && typeof this.options.authPacket === 'object') {
      const authPacket = xtend({ cmd: 'auth', reasonCode: 0 }, this.options.authPacket)
      sendPacket(this, authPacket)
    }
  }

  // many drain listeners are needed for qos 1 callbacks if the connection is intermittent
  this.stream.setMaxListeners(1000)

  clearTimeout(this.connackTimer)
  this.connackTimer = setTimeout(function () {
    debug('!!connectTimeout hit!! Calling _cleanUp with force `true`')
    that._cleanUp(true)
  }, this.options.connectTimeout)
}

MqttClient.prototype._handlePacket = function (packet, done) {
  const options = this.options

  if (options.protocolVersion === 5 && options.properties && options.properties.maximumPacketSize && options.properties.maximumPacketSize < packet.length) {
    this.emit('error', new Error('exceeding packets size ' + packet.cmd))
    this.end({ reasonCode: 149, properties: { reasonString: 'Maximum packet size was exceeded' } })
    return this
  }
  debug('_handlePacket :: emitting packetreceive')
  this.emit('packetreceive', packet)

  switch (packet.cmd) {
    case 'publish':
      this._handlePublish(packet, done)
      break
    case 'puback':
    case 'pubrec':
    case 'pubcomp':
    case 'suback':
    case 'unsuback':
      this._handleAck(packet)
      done()
      break
    case 'pubrel':
      this._handlePubrel(packet, done)
      break
    case 'connack':
      this._handleConnack(packet)
      done()
      break
    case 'auth':
      this._handleAuth(packet)
      done()
      break
    case 'pingresp':
      this._handlePingresp(packet)
      done()
      break
    case 'disconnect':
      this._handleDisconnect(packet)
      done()
      break
    default:
      // do nothing
      // maybe we should do an error handling
      // or just log it
      break
  }
}

MqttClient.prototype._checkDisconnecting = function (callback) {
  if (this.disconnecting) {
    if (callback && callback !== nop) {
      callback(new Error('client disconnecting'))
    } else {
      this.emit('error', new Error('client disconnecting'))
    }
  }
  return this.disconnecting
}

/**
 * publish - publish <message> to <topic>
 *
 * @param {String} topic - topic to publish to
 * @param {String, Buffer} message - message to publish
 * @param {Object} [opts] - publish options, includes:
 *    {Number} qos - qos level to publish on
 *    {Boolean} retain - whether or not to retain the message
 *    {Boolean} dup - whether or not mark a message as duplicate
 *    {Function} cbStorePut - function(){} called when message is put into `outgoingStore`
 * @param {Function} [callback] - function(err){}
 *    called when publish succeeds or fails
 * @returns {MqttClient} this - for chaining
 * @api public
 *
 * @example client.publish('topic', 'message');
 * @example
 *     client.publish('topic', 'message', {qos: 1, retain: true, dup: true});
 * @example client.publish('topic', 'message', console.log);
 */
MqttClient.prototype.publish = function (topic, message, opts, callback) {
  debug('publish :: message `%s` to topic `%s`', message, topic)
  const options = this.options

  // .publish(topic, payload, cb);
  if (typeof opts === 'function') {
    callback = opts
    opts = null
  }

  // default opts
  const defaultOpts = { qos: 0, retain: false, dup: false }
  opts = xtend(defaultOpts, opts)

  if (this._checkDisconnecting(callback)) {
    return this
  }

  const that = this
  const publishProc = function () {
    let messageId = 0
    if (opts.qos === 1 || opts.qos === 2) {
      messageId = that._nextId()
      if (messageId === null) {
        debug('No messageId left')
        return false
      }
    }
    const packet = {
      cmd: 'publish',
      topic: topic,
      payload: message,
      qos: opts.qos,
      retain: opts.retain,
      messageId: messageId,
      dup: opts.dup
    }

    if (options.protocolVersion === 5) {
      packet.properties = opts.properties
    }

    debug('publish :: qos', opts.qos)
    switch (opts.qos) {
      case 1:
      case 2:
        // Add to callbacks
        that.outgoing[packet.messageId] = {
          volatile: false,
          cb: callback || nop
        }
        debug('MqttClient:publish: packet cmd: %s', packet.cmd)
        that._sendPacket(packet, undefined, opts.cbStorePut)
        break
      default:
        debug('MqttClient:publish: packet cmd: %s', packet.cmd)
        that._sendPacket(packet, callback, opts.cbStorePut)
        break
    }
    return true
  }

  if (this._storeProcessing || this._storeProcessingQueue.length > 0 || !publishProc()) {
    this._storeProcessingQueue.push(
      {
        invoke: publishProc,
        cbStorePut: opts.cbStorePut,
        callback: callback
      }
    )
  }
  return this
}

/**
 * subscribe - subscribe to <topic>
 *
 * @param {String, Array, Object} topic - topic(s) to subscribe to, supports objects in the form {'topic': qos}
 * @param {Object} [opts] - optional subscription options, includes:
 *    {Number} qos - subscribe qos level
 * @param {Function} [callback] - function(err, granted){} where:
 *    {Error} err - subscription error (none at the moment!)
 *    {Array} granted - array of {topic: 't', qos: 0}
 * @returns {MqttClient} this - for chaining
 * @api public
 * @example client.subscribe('topic');
 * @example client.subscribe('topic', {qos: 1});
 * @example client.subscribe({'topic': {qos: 0}, 'topic2': {qos: 1}}, console.log);
 * @example client.subscribe('topic', console.log);
 */
MqttClient.prototype.subscribe = function () {
  const that = this
  const args = new Array(arguments.length)
  for (let i = 0; i < arguments.length; i++) {
    args[i] = arguments[i]
  }
  const subs = []
  let obj = args.shift()
  const resubscribe = obj.resubscribe
  let callback = args.pop() || nop
  let opts = args.pop()
  const version = this.options.protocolVersion

  delete obj.resubscribe

  if (typeof obj === 'string') {
    obj = [obj]
  }

  if (typeof callback !== 'function') {
    opts = callback
    callback = nop
  }

  const invalidTopic = validations.validateTopics(obj)
  if (invalidTopic !== null) {
    setImmediate(callback, new Error('Invalid topic ' + invalidTopic))
    return this
  }

  if (this._checkDisconnecting(callback)) {
    debug('subscribe: discconecting true')
    return this
  }

  const defaultOpts = {
    qos: 0
  }
  if (version === 5) {
    defaultOpts.nl = false
    defaultOpts.rap = false
    defaultOpts.rh = 0
  }
  opts = xtend(defaultOpts, opts)

  if (Array.isArray(obj)) {
    obj.forEach(function (topic) {
      debug('subscribe: array topic %s', topic)
      if (!Object.prototype.hasOwnProperty.call(that._resubscribeTopics, topic) ||
        that._resubscribeTopics[topic].qos < opts.qos ||
          resubscribe) {
        const currentOpts = {
          topic: topic,
          qos: opts.qos
        }
        if (version === 5) {
          currentOpts.nl = opts.nl
          currentOpts.rap = opts.rap
          currentOpts.rh = opts.rh
          currentOpts.properties = opts.properties
        }
        debug('subscribe: pushing topic `%s` and qos `%s` to subs list', currentOpts.topic, currentOpts.qos)
        subs.push(currentOpts)
      }
    })
  } else {
    Object
      .keys(obj)
      .forEach(function (k) {
        debug('subscribe: object topic %s', k)
        if (!Object.prototype.hasOwnProperty.call(that._resubscribeTopics, k) ||
          that._resubscribeTopics[k].qos < obj[k].qos ||
            resubscribe) {
          const currentOpts = {
            topic: k,
            qos: obj[k].qos
          }
          if (version === 5) {
            currentOpts.nl = obj[k].nl
            currentOpts.rap = obj[k].rap
            currentOpts.rh = obj[k].rh
            currentOpts.properties = opts.properties
          }
          debug('subscribe: pushing `%s` to subs list', currentOpts)
          subs.push(currentOpts)
        }
      })
  }

  if (!subs.length) {
    callback(null, [])
    return this
  }

  const subscribeProc = function () {
    const messageId = that._nextId()
    if (messageId === null) {
      debug('No messageId left')
      return false
    }

    const packet = {
      cmd: 'subscribe',
      subscriptions: subs,
      qos: 1,
      retain: false,
      dup: false,
      messageId: messageId
    }

    if (opts.properties) {
      packet.properties = opts.properties
    }

    // subscriptions to resubscribe to in case of disconnect
    if (that.options.resubscribe) {
      debug('subscribe :: resubscribe true')
      const topics = []
      subs.forEach(function (sub) {
        if (that.options.reconnectPeriod > 0) {
          const topic = { qos: sub.qos }
          if (version === 5) {
            topic.nl = sub.nl || false
            topic.rap = sub.rap || false
            topic.rh = sub.rh || 0
            topic.properties = sub.properties
          }
          that._resubscribeTopics[sub.topic] = topic
          topics.push(sub.topic)
        }
      })
      that.messageIdToTopic[packet.messageId] = topics
    }

    that.outgoing[packet.messageId] = {
      volatile: true,
      cb: function (err, packet) {
        if (!err) {
          const granted = packet.granted
          for (let i = 0; i < granted.length; i += 1) {
            subs[i].qos = granted[i]
          }
        }

        callback(err, subs)
      }
    }
    debug('subscribe :: call _sendPacket')
    that._sendPacket(packet)
    return true
  }

  if (this._storeProcessing || this._storeProcessingQueue.length > 0 || !subscribeProc()) {
    this._storeProcessingQueue.push(
      {
        invoke: subscribeProc,
        callback: callback
      }
    )
  }

  return this
}

/**
 * unsubscribe - unsubscribe from topic(s)
 *
 * @param {String, Array} topic - topics to unsubscribe from
 * @param {Object} [opts] - optional subscription options, includes:
 *    {Object} properties - properties of unsubscribe packet
 * @param {Function} [callback] - callback fired on unsuback
 * @returns {MqttClient} this - for chaining
 * @api public
 * @example client.unsubscribe('topic');
 * @example client.unsubscribe('topic', console.log);
 */
MqttClient.prototype.unsubscribe = function () {
  const that = this
  const args = new Array(arguments.length)
  for (let i = 0; i < arguments.length; i++) {
    args[i] = arguments[i]
  }
  let topic = args.shift()
  let callback = args.pop() || nop
  let opts = args.pop()
  if (typeof topic === 'string') {
    topic = [topic]
  }

  if (typeof callback !== 'function') {
    opts = callback
    callback = nop
  }

  const invalidTopic = validations.validateTopics(topic)
  if (invalidTopic !== null) {
    setImmediate(callback, new Error('Invalid topic ' + invalidTopic))
    return this
  }

  if (that._checkDisconnecting(callback)) {
    return this
  }

  const unsubscribeProc = function () {
    const messageId = that._nextId()
    if (messageId === null) {
      debug('No messageId left')
      return false
    }
    const packet = {
      cmd: 'unsubscribe',
      qos: 1,
      messageId: messageId
    }

    if (typeof topic === 'string') {
      packet.unsubscriptions = [topic]
    } else if (Array.isArray(topic)) {
      packet.unsubscriptions = topic
    }

    if (that.options.resubscribe) {
      packet.unsubscriptions.forEach(function (topic) {
        delete that._resubscribeTopics[topic]
      })
    }

    if (typeof opts === 'object' && opts.properties) {
      packet.properties = opts.properties
    }

    that.outgoing[packet.messageId] = {
      volatile: true,
      cb: callback
    }

    debug('unsubscribe: call _sendPacket')
    that._sendPacket(packet)

    return true
  }

  if (this._storeProcessing || this._storeProcessingQueue.length > 0 || !unsubscribeProc()) {
    this._storeProcessingQueue.push(
      {
        invoke: unsubscribeProc,
        callback: callback
      }
    )
  }

  return this
}

/**
 * end - close connection
 *
 * @returns {MqttClient} this - for chaining
 * @param {Boolean} force - do not wait for all in-flight messages to be acked
 * @param {Object} opts - added to the disconnect packet
 * @param {Function} cb - called when the client has been closed
 *
 * @api public
 */
MqttClient.prototype.end = function (force, opts, cb) {
  const that = this

  debug('end :: (%s)', this.options.clientId)

  if (force == null || typeof force !== 'boolean') {
    cb = opts || nop
    opts = force
    force = false
    if (typeof opts !== 'object') {
      cb = opts
      opts = null
      if (typeof cb !== 'function') {
        cb = nop
      }
    }
  }

  if (typeof opts !== 'object') {
    cb = opts
    opts = null
  }

  debug('end :: cb? %s', !!cb)
  cb = cb || nop

  function closeStores () {
    debug('end :: closeStores: closing incoming and outgoing stores')
    that.disconnected = true
    that.incomingStore.close(function (e1) {
      that.outgoingStore.close(function (e2) {
        debug('end :: closeStores: emitting end')
        that.emit('end')
        if (cb) {
          const err = e1 || e2
          debug('end :: closeStores: invoking callback with args')
          cb(err)
        }
      })
    })
    if (that._deferredReconnect) {
      that._deferredReconnect()
    }
  }

  function finish () {
    // defer closesStores of an I/O cycle,
    // just to make sure things are
    // ok for websockets
    debug('end :: (%s) :: finish :: calling _cleanUp with force %s', that.options.clientId, force)
    that._cleanUp(force, () => {
      debug('end :: finish :: calling process.nextTick on closeStores')
      // const boundProcess = nextTick.bind(null, closeStores)
      nextTick(closeStores.bind(that))
    }, opts)
  }

  if (this.disconnecting) {
    cb()
    return this
  }

  this._clearReconnect()

  this.disconnecting = true

  if (!force && Object.keys(this.outgoing).length > 0) {
    // wait 10ms, just to be sure we received all of it
    debug('end :: (%s) :: calling finish in 10ms once outgoing is empty', that.options.clientId)
    this.once('outgoingEmpty', setTimeout.bind(null, finish, 10))
  } else {
    debug('end :: (%s) :: immediately calling finish', that.options.clientId)
    finish()
  }

  return this
}

/**
 * removeOutgoingMessage - remove a message in outgoing store
 * the outgoing callback will be called withe Error('Message removed') if the message is removed
 *
 * @param {Number} messageId - messageId to remove message
 * @returns {MqttClient} this - for chaining
 * @api public
 *
 * @example client.removeOutgoingMessage(client.getLastAllocated());
 */
MqttClient.prototype.removeOutgoingMessage = function (messageId) {
  const cb = this.outgoing[messageId] ? this.outgoing[messageId].cb : null
  delete this.outgoing[messageId]
  this.outgoingStore.del({ messageId: messageId }, function () {
    cb(new Error('Message removed'))
  })
  return this
}

/**
 * reconnect - connect again using the same options as connect()
 *
 * @param {Object} [opts] - optional reconnect options, includes:
 *    {Store} incomingStore - a store for the incoming packets
 *    {Store} outgoingStore - a store for the outgoing packets
 *    if opts is not given, current stores are used
 * @returns {MqttClient} this - for chaining
 *
 * @api public
 */
MqttClient.prototype.reconnect = function (opts) {
  debug('client reconnect')
  const that = this
  const f = function () {
    if (opts) {
      that.options.incomingStore = opts.incomingStore
      that.options.outgoingStore = opts.outgoingStore
    } else {
      that.options.incomingStore = null
      that.options.outgoingStore = null
    }
    that.incomingStore = that.options.incomingStore || new Store()
    that.outgoingStore = that.options.outgoingStore || new Store()
    that.disconnecting = false
    that.disconnected = false
    that._deferredReconnect = null
    that._reconnect()
  }

  if (this.disconnecting && !this.disconnected) {
    this._deferredReconnect = f
  } else {
    f()
  }
  return this
}

/**
 * _reconnect - implement reconnection
 * @api privateish
 */
MqttClient.prototype._reconnect = function () {
  debug('_reconnect: emitting reconnect to client')
  this.emit('reconnect')
  if (this.connected) {
    this.end(() => { this._setupStream() })
    debug('client already connected. disconnecting first.')
  } else {
    debug('_reconnect: calling _setupStream')
    this._setupStream()
  }
}

/**
 * _setupReconnect - setup reconnect timer
 */
MqttClient.prototype._setupReconnect = function () {
  const that = this

  if (!that.disconnecting && !that.reconnectTimer && (that.options.reconnectPeriod > 0)) {
    if (!this.reconnecting) {
      debug('_setupReconnect :: emit `offline` state')
      this.emit('offline')
      debug('_setupReconnect :: set `reconnecting` to `true`')
      this.reconnecting = true
    }
    debug('_setupReconnect :: setting reconnectTimer for %d ms', that.options.reconnectPeriod)
    that.reconnectTimer = setInterval(function () {
      debug('reconnectTimer :: reconnect triggered!')
      that._reconnect()
    }, that.options.reconnectPeriod)
  } else {
    debug('_setupReconnect :: doing nothing...')
  }
}

/**
 * _clearReconnect - clear the reconnect timer
 */
MqttClient.prototype._clearReconnect = function () {
  debug('_clearReconnect : clearing reconnect timer')
  if (this.reconnectTimer) {
    clearInterval(this.reconnectTimer)
    this.reconnectTimer = null
  }
}

/**
 * _cleanUp - clean up on connection end
 * @api private
 */
MqttClient.prototype._cleanUp = function (forced, done) {
  const opts = arguments[2]
  if (done) {
    debug('_cleanUp :: done callback provided for on stream close')
    this.stream.on('close', done)
  }

  debug('_cleanUp :: forced? %s', forced)
  if (forced) {
    if ((this.options.reconnectPeriod === 0) && this.options.clean) {
      flush(this.outgoing)
    }
    debug('_cleanUp :: (%s) :: destroying stream', this.options.clientId)
    this.stream.destroy()
  } else {
    const packet = xtend({ cmd: 'disconnect' }, opts)
    debug('_cleanUp :: (%s) :: call _sendPacket with disconnect packet', this.options.clientId)
    this._sendPacket(
      packet,
      setImmediate.bind(
        null,
        this.stream.end.bind(this.stream)
      )
    )
  }

  if (!this.disconnecting) {
    debug('_cleanUp :: client not disconnecting. Clearing and resetting reconnect.')
    this._clearReconnect()
    this._setupReconnect()
  }

  if (this.pingTimer !== null) {
    debug('_cleanUp :: clearing pingTimer')
    this.pingTimer.clear()
    this.pingTimer = null
  }

  if (done && !this.connected) {
    debug('_cleanUp :: (%s) :: removing stream `done` callback `close` listener', this.options.clientId)
    this.stream.removeListener('close', done)
    done()
  }
}

/**
 * _sendPacket - send or queue a packet
 * @param {Object} packet - packet options
 * @param {Function} cb - callback when the packet is sent
 * @param {Function} cbStorePut - called when message is put into outgoingStore
 * @api private
 */
MqttClient.prototype._sendPacket = function (packet, cb, cbStorePut) {
  debug('_sendPacket :: (%s) ::  start', this.options.clientId)
  cbStorePut = cbStorePut || nop
  cb = cb || nop

  const err = applyTopicAlias(this, packet)
  if (err) {
    cb(err)
    return
  }

  if (!this.connected) {
    // allow auth packets to be sent while authenticating with the broker (mqtt5 enhanced auth)
    if (packet.cmd === 'auth') {
      this._shiftPingInterval()
      sendPacket(this, packet, cb)
      return
    }

    debug('_sendPacket :: client not connected. Storing packet offline.')
    this._storePacket(packet, cb, cbStorePut)
    return
  }

  // When sending a packet, reschedule the ping timer
  this._shiftPingInterval()

  switch (packet.cmd) {
    case 'publish':
      break
    case 'pubrel':
      storeAndSend(this, packet, cb, cbStorePut)
      return
    default:
      sendPacket(this, packet, cb)
      return
  }

  switch (packet.qos) {
    case 2:
    case 1:
      storeAndSend(this, packet, cb, cbStorePut)
      break
    /**
     * no need of case here since it will be caught by default
     * and jshint comply that before default it must be a break
     * anyway it will result in -1 evaluation
     */
    case 0:
      /* falls through */
    default:
      sendPacket(this, packet, cb)
      break
  }
  debug('_sendPacket :: (%s) ::  end', this.options.clientId)
}

/**
 * _storePacket - queue a packet
 * @param {Object} packet - packet options
 * @param {Function} cb - callback when the packet is sent
 * @param {Function} cbStorePut - called when message is put into outgoingStore
 * @api private
 */
MqttClient.prototype._storePacket = function (packet, cb, cbStorePut) {
  debug('_storePacket :: packet: %o', packet)
  debug('_storePacket :: cb? %s', !!cb)
  cbStorePut = cbStorePut || nop

  let storePacket = packet
  if (storePacket.cmd === 'publish') {
    // The original packet is for sending.
    // The cloned storePacket is for storing to resend on reconnect.
    // Topic Alias must not be used after disconnected.
    storePacket = clone(packet)
    const err = removeTopicAliasAndRecoverTopicName(this, storePacket)
    if (err) {
      return cb && cb(err)
    }
  }
  // check that the packet is not a qos of 0, or that the command is not a publish
  if (((storePacket.qos || 0) === 0 && this.queueQoSZero) || storePacket.cmd !== 'publish') {
    this.queue.push({ packet: storePacket, cb: cb })
  } else if (storePacket.qos > 0) {
    cb = this.outgoing[storePacket.messageId] ? this.outgoing[storePacket.messageId].cb : null
    this.outgoingStore.put(storePacket, function (err) {
      if (err) {
        return cb && cb(err)
      }
      cbStorePut()
    })
  } else if (cb) {
    cb(new Error('No connection to broker'))
  }
}

/**
 * _setupPingTimer - setup the ping timer
 *
 * @api private
 */
MqttClient.prototype._setupPingTimer = function () {
  debug('_setupPingTimer :: keepalive %d (seconds)', this.options.keepalive)
  const that = this

  if (!this.pingTimer && this.options.keepalive) {
    this.pingResp = true
    this.pingTimer = reInterval(function () {
      that._checkPing()
    }, this.options.keepalive * 1000)
  }
}

/**
 * _shiftPingInterval - reschedule the ping interval
 *
 * @api private
 */
MqttClient.prototype._shiftPingInterval = function () {
  if (this.pingTimer && this.options.keepalive && this.options.reschedulePings) {
    this.pingTimer.reschedule(this.options.keepalive * 1000)
  }
}
/**
 * _checkPing - check if a pingresp has come back, and ping the server again
 *
 * @api private
 */
MqttClient.prototype._checkPing = function () {
  debug('_checkPing :: checking ping...')
  if (this.pingResp) {
    debug('_checkPing :: ping response received. Clearing flag and sending `pingreq`')
    this.pingResp = false
    this._sendPacket({ cmd: 'pingreq' })
  } else {
    // do a forced cleanup since socket will be in bad shape
    debug('_checkPing :: calling _cleanUp with force true')
    this._cleanUp(true)
  }
}

/**
 * _handlePingresp - handle a pingresp
 *
 * @api private
 */
MqttClient.prototype._handlePingresp = function () {
  this.pingResp = true
}

/**
 * _handleConnack
 *
 * @param {Object} packet
 * @api private
 */
MqttClient.prototype._handleConnack = function (packet) {
  debug('_handleConnack')
  const options = this.options
  const version = options.protocolVersion
  const rc = version === 5 ? packet.reasonCode : packet.returnCode

  clearTimeout(this.connackTimer)
  delete this.topicAliasSend

  if (packet.properties) {
    if (packet.properties.topicAliasMaximum) {
      if (packet.properties.topicAliasMaximum > 0xffff) {
        this.emit('error', new Error('topicAliasMaximum from broker is out of range'))
        return
      }
      if (packet.properties.topicAliasMaximum > 0) {
        this.topicAliasSend = new TopicAliasSend(packet.properties.topicAliasMaximum)
      }
    }
    if (packet.properties.serverKeepAlive && options.keepalive) {
      options.keepalive = packet.properties.serverKeepAlive
      this._shiftPingInterval()
    }
    if (packet.properties.maximumPacketSize) {
      if (!options.properties) { options.properties = {} }
      options.properties.maximumPacketSize = packet.properties.maximumPacketSize
    }
  }

  if (rc === 0) {
    this.reconnecting = false
    this._onConnect(packet)
  } else if (rc > 0) {
    const err = new Error('Connection refused: ' + errors[rc])
    err.code = rc
    this.emit('error', err)
  }
}

MqttClient.prototype._handleAuth = function (packet) {
  const options = this.options
  const version = options.protocolVersion
  const rc = version === 5 ? packet.reasonCode : packet.returnCode

  if (version !== 5) {
    const err = new Error('Protocol error: Auth packets are only supported in MQTT 5. Your version:' + version)
    err.code = rc
    this.emit('error', err)
    return
  }

  const that = this
  this.handleAuth(packet, function (err, packet) {
    if (err) {
      that.emit('error', err)
      return
    }

    if (rc === 24) {
      that.reconnecting = false
      that._sendPacket(packet)
    } else {
      const error = new Error('Connection refused: ' + errors[rc])
      err.code = rc
      that.emit('error', error)
    }
  })
}

/**
 * @param packet the packet received by the broker
 * @return the auth packet to be returned to the broker
 * @api public
 */
MqttClient.prototype.handleAuth = function (packet, callback) {
  callback()
}

/**
 * _handlePublish
 *
 * @param {Object} packet
 * @api private
 */
/*
those late 2 case should be rewrite to comply with coding style:

case 1:
case 0:
  // do not wait sending a puback
  // no callback passed
  if (1 === qos) {
    this._sendPacket({
      cmd: 'puback',
      messageId: messageId
    });
  }
  // emit the message event for both qos 1 and 0
  this.emit('message', topic, message, packet);
  this.handleMessage(packet, done);
  break;
default:
  // do nothing but every switch mus have a default
  // log or throw an error about unknown qos
  break;

for now i just suppressed the warnings
*/
MqttClient.prototype._handlePublish = function (packet, done) {
  debug('_handlePublish: packet %o', packet)
  done = typeof done !== 'undefined' ? done : nop
  let topic = packet.topic.toString()
  const message = packet.payload
  const qos = packet.qos
  const messageId = packet.messageId
  const that = this
  const options = this.options
  const validReasonCodes = [0, 16, 128, 131, 135, 144, 145, 151, 153]
  if (this.options.protocolVersion === 5) {
    let alias
    if (packet.properties) {
      alias = packet.properties.topicAlias
    }
    if (typeof alias !== 'undefined') {
      if (topic.length === 0) {
        if (alias > 0 && alias <= 0xffff) {
          const gotTopic = this.topicAliasRecv.getTopicByAlias(alias)
          if (gotTopic) {
            topic = gotTopic
            debug('_handlePublish :: topic complemented by alias. topic: %s - alias: %d', topic, alias)
          } else {
            debug('_handlePublish :: unregistered topic alias. alias: %d', alias)
            this.emit('error', new Error('Received unregistered Topic Alias'))
            return
          }
        } else {
          debug('_handlePublish :: topic alias out of range. alias: %d', alias)
          this.emit('error', new Error('Received Topic Alias is out of range'))
          return
        }
      } else {
        if (this.topicAliasRecv.put(topic, alias)) {
          debug('_handlePublish :: registered topic: %s - alias: %d', topic, alias)
        } else {
          debug('_handlePublish :: topic alias out of range. alias: %d', alias)
          this.emit('error', new Error('Received Topic Alias is out of range'))
          return
        }
      }
    }
  }
  debug('_handlePublish: qos %d', qos)
  switch (qos) {
    case 2: {
      options.customHandleAcks(topic, message, packet, function (error, code) {
        if (!(error instanceof Error)) {
          code = error
          error = null
        }
        if (error) { return that.emit('error', error) }
        if (validReasonCodes.indexOf(code) === -1) { return that.emit('error', new Error('Wrong reason code for pubrec')) }
        if (code) {
          that._sendPacket({ cmd: 'pubrec', messageId: messageId, reasonCode: code }, done)
        } else {
          that.incomingStore.put(packet, function () {
            that._sendPacket({ cmd: 'pubrec', messageId: messageId }, done)
          })
        }
      })
      break
    }
    case 1: {
      // emit the message event
      options.customHandleAcks(topic, message, packet, function (error, code) {
        if (!(error instanceof Error)) {
          code = error
          error = null
        }
        if (error) { return that.emit('error', error) }
        if (validReasonCodes.indexOf(code) === -1) { return that.emit('error', new Error('Wrong reason code for puback')) }
        if (!code) { that.emit('message', topic, message, packet) }
        that.handleMessage(packet, function (err) {
          if (err) {
            return done && done(err)
          }
          that._sendPacket({ cmd: 'puback', messageId: messageId, reasonCode: code }, done)
        })
      })
      break
    }
    case 0:
      // emit the message event
      this.emit('message', topic, message, packet)
      this.handleMessage(packet, done)
      break
    default:
      // do nothing
      debug('_handlePublish: unknown QoS. Doing nothing.')
      // log or throw an error about unknown qos
      break
  }
}

/**
 * Handle messages with backpressure support, one at a time.
 * Override at will.
 *
 * @param Packet packet the packet
 * @param Function callback call when finished
 * @api public
 */
MqttClient.prototype.handleMessage = function (packet, callback) {
  callback()
}

/**
 * _handleAck
 *
 * @param {Object} packet
 * @api private
 */

MqttClient.prototype._handleAck = function (packet) {
  /* eslint no-fallthrough: "off" */
  const messageId = packet.messageId
  const type = packet.cmd
  let response = null
  const cb = this.outgoing[messageId] ? this.outgoing[messageId].cb : null
  const that = this
  let err

  // Checking `!cb` happens to work, but it's not technically "correct".
  //
  // Why? This code assumes that "no callback" is the same as that "we're not
  // waiting for responses" (puback, pubrec, pubcomp, suback, or unsuback).
  //
  // It would be better to check `if (!this.outgoing[messageId])` here, but
  // there's no reason to change it and risk (another) regression.
  //
  // The only reason this code works is becaues code in MqttClient.publish,
  // MqttClinet.subscribe, and MqttClient.unsubscribe ensures that we will
  // have a callback even if the user doesn't pass one in.)
  if (!cb) {
    debug('_handleAck :: Server sent an ack in error. Ignoring.')
    // Server sent an ack in error, ignore it.
    return
  }

  // Process
  debug('_handleAck :: packet type', type)
  switch (type) {
    case 'pubcomp':
      // same thing as puback for QoS 2
    case 'puback': {
      const pubackRC = packet.reasonCode
      // Callback - we're done
      if (pubackRC && pubackRC > 0 && pubackRC !== 16) {
        err = new Error('Publish error: ' + errors[pubackRC])
        err.code = pubackRC
        cb(err, packet)
      }
      delete this.outgoing[messageId]
      this.outgoingStore.del(packet, cb)
      this.messageIdProvider.deallocate(messageId)
      this._invokeStoreProcessingQueue()
      break
    }
    case 'pubrec': {
      response = {
        cmd: 'pubrel',
        qos: 2,
        messageId: messageId
      }
      const pubrecRC = packet.reasonCode

      if (pubrecRC && pubrecRC > 0 && pubrecRC !== 16) {
        err = new Error('Publish error: ' + errors[pubrecRC])
        err.code = pubrecRC
        cb(err, packet)
      } else {
        this._sendPacket(response)
      }
      break
    }
    case 'suback': {
      delete this.outgoing[messageId]
      this.messageIdProvider.deallocate(messageId)
      for (let grantedI = 0; grantedI < packet.granted.length; grantedI++) {
        if ((packet.granted[grantedI] & 0x80) !== 0) {
          // suback with Failure status
          const topics = this.messageIdToTopic[messageId]
          if (topics) {
            topics.forEach(function (topic) {
              delete that._resubscribeTopics[topic]
            })
          }
        }
      }
      this._invokeStoreProcessingQueue()
      cb(null, packet)
      break
    }
    case 'unsuback': {
      delete this.outgoing[messageId]
      this.messageIdProvider.deallocate(messageId)
      this._invokeStoreProcessingQueue()
      cb(null)
      break
    }
    default:
      that.emit('error', new Error('unrecognized packet type'))
  }

  if (this.disconnecting &&
      Object.keys(this.outgoing).length === 0) {
    this.emit('outgoingEmpty')
  }
}

/**
 * _handlePubrel
 *
 * @param {Object} packet
 * @api private
 */
MqttClient.prototype._handlePubrel = function (packet, callback) {
  debug('handling pubrel packet')
  callback = typeof callback !== 'undefined' ? callback : nop
  const messageId = packet.messageId
  const that = this

  const comp = { cmd: 'pubcomp', messageId: messageId }

  that.incomingStore.get(packet, function (err, pub) {
    if (!err) {
      that.emit('message', pub.topic, pub.payload, pub)
      that.handleMessage(pub, function (err) {
        if (err) {
          return callback(err)
        }
        that.incomingStore.del(pub, nop)
        that._sendPacket(comp, callback)
      })
    } else {
      that._sendPacket(comp, callback)
    }
  })
}

/**
 * _handleDisconnect
 *
 * @param {Object} packet
 * @api private
 */
MqttClient.prototype._handleDisconnect = function (packet) {
  this.emit('disconnect', packet)
}

/**
 * _nextId
 * @return unsigned int
 */
MqttClient.prototype._nextId = function () {
  return this.messageIdProvider.allocate()
}

/**
 * getLastMessageId
 * @return unsigned int
 */
MqttClient.prototype.getLastMessageId = function () {
  return this.messageIdProvider.getLastAllocated()
}

/**
 * _resubscribe
 * @api private
 */
MqttClient.prototype._resubscribe = function () {
  debug('_resubscribe')
  const _resubscribeTopicsKeys = Object.keys(this._resubscribeTopics)
  if (!this._firstConnection &&
      (this.options.clean || (this.options.protocolVersion === 5 && !this.connackPacket.sessionPresent)) &&
      _resubscribeTopicsKeys.length > 0) {
    if (this.options.resubscribe) {
      if (this.options.protocolVersion === 5) {
        debug('_resubscribe: protocolVersion 5')
        for (let topicI = 0; topicI < _resubscribeTopicsKeys.length; topicI++) {
          const resubscribeTopic = {}
          resubscribeTopic[_resubscribeTopicsKeys[topicI]] = this._resubscribeTopics[_resubscribeTopicsKeys[topicI]]
          resubscribeTopic.resubscribe = true
          this.subscribe(resubscribeTopic, { properties: resubscribeTopic[_resubscribeTopicsKeys[topicI]].properties })
        }
      } else {
        this._resubscribeTopics.resubscribe = true
        this.subscribe(this._resubscribeTopics)
      }
    } else {
      this._resubscribeTopics = {}
    }
  }

  this._firstConnection = false
}

/**
 * _onConnect
 *
 * @api private
 */
MqttClient.prototype._onConnect = function (packet) {
  if (this.disconnected) {
    this.emit('connect', packet)
    return
  }

  const that = this

  this.connackPacket = packet
  this.messageIdProvider.clear()
  this._setupPingTimer()

  this.connected = true

  function startStreamProcess () {
    let outStore = that.outgoingStore.createStream()

    function clearStoreProcessing () {
      that._storeProcessing = false
      that._packetIdsDuringStoreProcessing = {}
    }

    that.once('close', remove)
    outStore.on('error', function (err) {
      clearStoreProcessing()
      that._flushStoreProcessingQueue()
      that.removeListener('close', remove)
      that.emit('error', err)
    })

    function remove () {
      outStore.destroy()
      outStore = null
      that._flushStoreProcessingQueue()
      clearStoreProcessing()
    }

    function storeDeliver () {
      // edge case, we wrapped this twice
      if (!outStore) {
        return
      }
      that._storeProcessing = true

      const packet = outStore.read(1)

      let cb

      if (!packet) {
        // read when data is available in the future
        outStore.once('readable', storeDeliver)
        return
      }

      // Skip already processed store packets
      if (that._packetIdsDuringStoreProcessing[packet.messageId]) {
        storeDeliver()
        return
      }

      // Avoid unnecessary stream read operations when disconnected
      if (!that.disconnecting && !that.reconnectTimer) {
        cb = that.outgoing[packet.messageId] ? that.outgoing[packet.messageId].cb : null
        that.outgoing[packet.messageId] = {
          volatile: false,
          cb: function (err, status) {
            // Ensure that the original callback passed in to publish gets invoked
            if (cb) {
              cb(err, status)
            }

            storeDeliver()
          }
        }
        that._packetIdsDuringStoreProcessing[packet.messageId] = true
        if (that.messageIdProvider.register(packet.messageId)) {
          that._sendPacket(packet)
        } else {
          debug('messageId: %d has already used.', packet.messageId)
        }
      } else if (outStore.destroy) {
        outStore.destroy()
      }
    }

    outStore.on('end', function () {
      let allProcessed = true
      for (const id in that._packetIdsDuringStoreProcessing) {
        if (!that._packetIdsDuringStoreProcessing[id]) {
          allProcessed = false
          break
        }
      }
      if (allProcessed) {
        clearStoreProcessing()
        that.removeListener('close', remove)
        that._invokeAllStoreProcessingQueue()
        that.emit('connect', packet)
      } else {
        startStreamProcess()
      }
    })
    storeDeliver()
  }
  // start flowing
  startStreamProcess()
}

MqttClient.prototype._invokeStoreProcessingQueue = function () {
  if (this._storeProcessingQueue.length > 0) {
    const f = this._storeProcessingQueue[0]
    if (f && f.invoke()) {
      this._storeProcessingQueue.shift()
      return true
    }
  }
  return false
}

MqttClient.prototype._invokeAllStoreProcessingQueue = function () {
  while (this._invokeStoreProcessingQueue()) { /* empty */ }
}

MqttClient.prototype._flushStoreProcessingQueue = function () {
  for (const f of this._storeProcessingQueue) {
    if (f.cbStorePut) f.cbStorePut(new Error('Connection closed'))
    if (f.callback) f.callback(new Error('Connection closed'))
  }
  this._storeProcessingQueue.splice(0)
}

module.exports = MqttClient

}, function(modId) { var map = {"./store":1663860580783,"./topic-alias-recv":1663860580784,"./topic-alias-send":1663860580785,"./default-message-id-provider":1663860580786,"./validations":1663860580787}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580783, function(require, module, exports) {


/**
 * Module dependencies
 */
const xtend = require('xtend')

const Readable = require('readable-stream').Readable
const streamsOpts = { objectMode: true }
const defaultStoreOptions = {
  clean: true
}

/**
 * In-memory implementation of the message store
 * This can actually be saved into files.
 *
 * @param {Object} [options] - store options
 */
function Store (options) {
  if (!(this instanceof Store)) {
    return new Store(options)
  }

  this.options = options || {}

  // Defaults
  this.options = xtend(defaultStoreOptions, options)

  this._inflights = new Map()
}

/**
 * Adds a packet to the store, a packet is
 * anything that has a messageId property.
 *
 */
Store.prototype.put = function (packet, cb) {
  this._inflights.set(packet.messageId, packet)

  if (cb) {
    cb()
  }

  return this
}

/**
 * Creates a stream with all the packets in the store
 *
 */
Store.prototype.createStream = function () {
  const stream = new Readable(streamsOpts)
  const values = []
  let destroyed = false
  let i = 0

  this._inflights.forEach(function (value, key) {
    values.push(value)
  })

  stream._read = function () {
    if (!destroyed && i < values.length) {
      this.push(values[i++])
    } else {
      this.push(null)
    }
  }

  stream.destroy = function () {
    if (destroyed) {
      return
    }

    const self = this

    destroyed = true

    setTimeout(function () {
      self.emit('close')
    }, 0)
  }

  return stream
}

/**
 * deletes a packet from the store.
 */
Store.prototype.del = function (packet, cb) {
  packet = this._inflights.get(packet.messageId)
  if (packet) {
    this._inflights.delete(packet.messageId)
    cb(null, packet)
  } else if (cb) {
    cb(new Error('missing packet'))
  }

  return this
}

/**
 * get a packet from the store.
 */
Store.prototype.get = function (packet, cb) {
  packet = this._inflights.get(packet.messageId)
  if (packet) {
    cb(null, packet)
  } else if (cb) {
    cb(new Error('missing packet'))
  }

  return this
}

/**
 * Close the store
 */
Store.prototype.close = function (cb) {
  if (this.options.clean) {
    this._inflights = null
  }
  if (cb) {
    cb()
  }
}

module.exports = Store

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580784, function(require, module, exports) {


/**
 * Topic Alias receiving manager
 * This holds alias to topic map
 * @param {Number} [max] - topic alias maximum entries
 */
function TopicAliasRecv (max) {
  if (!(this instanceof TopicAliasRecv)) {
    return new TopicAliasRecv(max)
  }
  this.aliasToTopic = {}
  this.max = max
}

/**
 * Insert or update topic - alias entry.
 * @param {String} [topic] - topic
 * @param {Number} [alias] - topic alias
 * @returns {Boolean} - if success return true otherwise false
 */
TopicAliasRecv.prototype.put = function (topic, alias) {
  if (alias === 0 || alias > this.max) {
    return false
  }
  this.aliasToTopic[alias] = topic
  this.length = Object.keys(this.aliasToTopic).length
  return true
}

/**
 * Get topic by alias
 * @param {String} [topic] - topic
 * @returns {Number} - if mapped topic exists return topic alias, otherwise return undefined
 */
TopicAliasRecv.prototype.getTopicByAlias = function (alias) {
  return this.aliasToTopic[alias]
}

/**
 * Clear all entries
 */
TopicAliasRecv.prototype.clear = function () {
  this.aliasToTopic = {}
}

module.exports = TopicAliasRecv

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580785, function(require, module, exports) {


/**
 * Module dependencies
 */
const LruMap = require('lru-cache')
const NumberAllocator = require('number-allocator').NumberAllocator

/**
 * Topic Alias sending manager
 * This holds both topic to alias and alias to topic map
 * @param {Number} [max] - topic alias maximum entries
 */
function TopicAliasSend (max) {
  if (!(this instanceof TopicAliasSend)) {
    return new TopicAliasSend(max)
  }

  if (max > 0) {
    this.aliasToTopic = new LruMap({ max: max })
    this.topicToAlias = {}
    this.numberAllocator = new NumberAllocator(1, max)
    this.max = max
    this.length = 0
  }
}

/**
 * Insert or update topic - alias entry.
 * @param {String} [topic] - topic
 * @param {Number} [alias] - topic alias
 * @returns {Boolean} - if success return true otherwise false
 */
TopicAliasSend.prototype.put = function (topic, alias) {
  if (alias === 0 || alias > this.max) {
    return false
  }
  const entry = this.aliasToTopic.get(alias)
  if (entry) {
    delete this.topicToAlias[entry]
  }
  this.aliasToTopic.set(alias, topic)
  this.topicToAlias[topic] = alias
  this.numberAllocator.use(alias)
  this.length = this.aliasToTopic.length
  return true
}

/**
 * Get topic by alias
 * @param {Number} [alias] - topic alias
 * @returns {String} - if mapped topic exists return topic, otherwise return undefined
 */
TopicAliasSend.prototype.getTopicByAlias = function (alias) {
  return this.aliasToTopic.get(alias)
}

/**
 * Get topic by alias
 * @param {String} [topic] - topic
 * @returns {Number} - if mapped topic exists return topic alias, otherwise return undefined
 */
TopicAliasSend.prototype.getAliasByTopic = function (topic) {
  const alias = this.topicToAlias[topic]
  if (typeof alias !== 'undefined') {
    this.aliasToTopic.get(alias) // LRU update
  }
  return alias
}

/**
 * Clear all entries
 */
TopicAliasSend.prototype.clear = function () {
  this.aliasToTopic.reset()
  this.topicToAlias = {}
  this.numberAllocator.clear()
  this.length = 0
}

/**
 * Get Least Recently Used (LRU) topic alias
 * @returns {Number} - if vacant alias exists then return it, otherwise then return LRU alias
 */
TopicAliasSend.prototype.getLruAlias = function () {
  const alias = this.numberAllocator.firstVacant()
  if (alias) return alias
  return this.aliasToTopic.keys()[this.aliasToTopic.length - 1]
}

module.exports = TopicAliasSend

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580786, function(require, module, exports) {


/**
 * DefaultMessageAllocator constructor
 * @constructor
 */
function DefaultMessageIdProvider () {
  if (!(this instanceof DefaultMessageIdProvider)) {
    return new DefaultMessageIdProvider()
  }

  /**
   * MessageIDs starting with 1
   * ensure that nextId is min. 1, see https://github.com/mqttjs/MQTT.js/issues/810
   */
  this.nextId = Math.max(1, Math.floor(Math.random() * 65535))
}

/**
 * allocate
 *
 * Get the next messageId.
 * @return unsigned int
 */
DefaultMessageIdProvider.prototype.allocate = function () {
  // id becomes current state of this.nextId and increments afterwards
  const id = this.nextId++
  // Ensure 16 bit unsigned int (max 65535, nextId got one higher)
  if (this.nextId === 65536) {
    this.nextId = 1
  }
  return id
}

/**
 * getLastAllocated
 * Get the last allocated messageId.
 * @return unsigned int
 */
DefaultMessageIdProvider.prototype.getLastAllocated = function () {
  return (this.nextId === 1) ? 65535 : (this.nextId - 1)
}

/**
 * register
 * Register messageId. If success return true, otherwise return false.
 * @param { unsigned int } - messageId to register,
 * @return boolean
 */
DefaultMessageIdProvider.prototype.register = function (messageId) {
  return true
}

/**
 * deallocate
 * Deallocate messageId.
 * @param { unsigned int } - messageId to deallocate,
 */
DefaultMessageIdProvider.prototype.deallocate = function (messageId) {
}

/**
 * clear
 * Deallocate all messageIds.
 */
DefaultMessageIdProvider.prototype.clear = function () {
}

module.exports = DefaultMessageIdProvider

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580787, function(require, module, exports) {


/**
 * Validate a topic to see if it's valid or not.
 * A topic is valid if it follow below rules:
 * - Rule #1: If any part of the topic is not `+` or `#`, then it must not contain `+` and '#'
 * - Rule #2: Part `#` must be located at the end of the mailbox
 *
 * @param {String} topic - A topic
 * @returns {Boolean} If the topic is valid, returns true. Otherwise, returns false.
 */
function validateTopic (topic) {
  const parts = topic.split('/')

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '+') {
      continue
    }

    if (parts[i] === '#') {
      // for Rule #2
      return i === parts.length - 1
    }

    if (parts[i].indexOf('+') !== -1 || parts[i].indexOf('#') !== -1) {
      return false
    }
  }

  return true
}

/**
 * Validate an array of topics to see if any of them is valid or not
  * @param {Array} topics - Array of topics
 * @returns {String} If the topics is valid, returns null. Otherwise, returns the invalid one
 */
function validateTopics (topics) {
  if (topics.length === 0) {
    return 'empty_topic_list'
  }
  for (let i = 0; i < topics.length; i++) {
    if (!validateTopic(topics[i])) {
      return topics[i]
    }
  }
  return null
}

module.exports = {
  validateTopics: validateTopics
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580788, function(require, module, exports) {


const MqttClient = require('../client')
const Store = require('../store')
const url = require('url')
const xtend = require('xtend')
const debug = require('debug')('mqttjs')

const protocols = {}

// eslint-disable-next-line camelcase
if ((typeof process !== 'undefined' && process.title !== 'browser') || typeof __webpack_require__ !== 'function') {
  protocols.mqtt = require('./tcp')
  protocols.tcp = require('./tcp')
  protocols.ssl = require('./tls')
  protocols.tls = require('./tls')
  protocols.mqtts = require('./tls')
} else {
  protocols.wx = require('./wx')
  protocols.wxs = require('./wx')

  protocols.ali = require('./ali')
  protocols.alis = require('./ali')
}

protocols.ws = require('./ws')
protocols.wss = require('./ws')

/**
 * Parse the auth attribute and merge username and password in the options object.
 *
 * @param {Object} [opts] option object
 */
function parseAuthOptions (opts) {
  let matches
  if (opts.auth) {
    matches = opts.auth.match(/^(.+):(.+)$/)
    if (matches) {
      opts.username = matches[1]
      opts.password = matches[2]
    } else {
      opts.username = opts.auth
    }
  }
}

/**
 * connect - connect to an MQTT broker.
 *
 * @param {String} [brokerUrl] - url of the broker, optional
 * @param {Object} opts - see MqttClient#constructor
 */
function connect (brokerUrl, opts) {
  debug('connecting to an MQTT broker...')
  if ((typeof brokerUrl === 'object') && !opts) {
    opts = brokerUrl
    brokerUrl = null
  }

  opts = opts || {}

  if (brokerUrl) {
    // eslint-disable-next-line
    const parsed = url.parse(brokerUrl, true)
    if (parsed.port != null) {
      parsed.port = Number(parsed.port)
    }

    opts = xtend(parsed, opts)

    if (opts.protocol === null) {
      throw new Error('Missing protocol')
    }

    opts.protocol = opts.protocol.replace(/:$/, '')
  }

  // merge in the auth options if supplied
  parseAuthOptions(opts)

  // support clientId passed in the query string of the url
  if (opts.query && typeof opts.query.clientId === 'string') {
    opts.clientId = opts.query.clientId
  }

  if (opts.cert && opts.key) {
    if (opts.protocol) {
      if (['mqtts', 'wss', 'wxs', 'alis'].indexOf(opts.protocol) === -1) {
        switch (opts.protocol) {
          case 'mqtt':
            opts.protocol = 'mqtts'
            break
          case 'ws':
            opts.protocol = 'wss'
            break
          case 'wx':
            opts.protocol = 'wxs'
            break
          case 'ali':
            opts.protocol = 'alis'
            break
          default:
            throw new Error('Unknown protocol for secure connection: "' + opts.protocol + '"!')
        }
      }
    } else {
      // A cert and key was provided, however no protocol was specified, so we will throw an error.
      throw new Error('Missing secure protocol key')
    }
  }

  if (!protocols[opts.protocol]) {
    const isSecure = ['mqtts', 'wss'].indexOf(opts.protocol) !== -1
    opts.protocol = [
      'mqtt',
      'mqtts',
      'ws',
      'wss',
      'wx',
      'wxs',
      'ali',
      'alis'
    ].filter(function (key, index) {
      if (isSecure && index % 2 === 0) {
        // Skip insecure protocols when requesting a secure one.
        return false
      }
      return (typeof protocols[key] === 'function')
    })[0]
  }

  if (opts.clean === false && !opts.clientId) {
    throw new Error('Missing clientId for unclean clients')
  }

  if (opts.protocol) {
    opts.defaultProtocol = opts.protocol
  }

  function wrapper (client) {
    if (opts.servers) {
      if (!client._reconnectCount || client._reconnectCount === opts.servers.length) {
        client._reconnectCount = 0
      }

      opts.host = opts.servers[client._reconnectCount].host
      opts.port = opts.servers[client._reconnectCount].port
      opts.protocol = (!opts.servers[client._reconnectCount].protocol ? opts.defaultProtocol : opts.servers[client._reconnectCount].protocol)
      opts.hostname = opts.host

      client._reconnectCount++
    }

    debug('calling streambuilder for', opts.protocol)
    return protocols[opts.protocol](client, opts)
  }
  const client = new MqttClient(wrapper, opts)
  client.on('error', function () { /* Automatically set up client error handling */ })
  return client
}

module.exports = connect
module.exports.connect = connect
module.exports.MqttClient = MqttClient
module.exports.Store = Store

}, function(modId) { var map = {"../client":1663860580782,"../store":1663860580783,"./tcp":1663860580789,"./tls":1663860580790,"./wx":1663860580791,"./ali":1663860580792,"./ws":1663860580793}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580789, function(require, module, exports) {

const net = require('net')
const debug = require('debug')('mqttjs:tcp')

/*
  variables port and host can be removed since
  you have all required information in opts object
*/
function streamBuilder (client, opts) {
  opts.port = opts.port || 1883
  opts.hostname = opts.hostname || opts.host || 'localhost'

  const port = opts.port
  const host = opts.hostname

  debug('port %d and host %s', port, host)
  return net.createConnection(port, host)
}

module.exports = streamBuilder

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580790, function(require, module, exports) {

const tls = require('tls')
const net = require('net')
const debug = require('debug')('mqttjs:tls')

function buildBuilder (mqttClient, opts) {
  opts.port = opts.port || 8883
  opts.host = opts.hostname || opts.host || 'localhost'

  if (net.isIP(opts.host) === 0) {
    opts.servername = opts.host
  }

  opts.rejectUnauthorized = opts.rejectUnauthorized !== false

  delete opts.path

  debug('port %d host %s rejectUnauthorized %b', opts.port, opts.host, opts.rejectUnauthorized)

  const connection = tls.connect(opts)
  /* eslint no-use-before-define: [2, "nofunc"] */
  connection.on('secureConnect', function () {
    if (opts.rejectUnauthorized && !connection.authorized) {
      connection.emit('error', new Error('TLS not authorized'))
    } else {
      connection.removeListener('error', handleTLSerrors)
    }
  })

  function handleTLSerrors (err) {
    // How can I get verify this error is a tls error?
    if (opts.rejectUnauthorized) {
      mqttClient.emit('error', err)
    }

    // close this connection to match the behaviour of net
    // otherwise all we get is an error from the connection
    // and close event doesn't fire. This is a work around
    // to enable the reconnect code to work the same as with
    // net.createConnection
    connection.end()
  }

  connection.on('error', handleTLSerrors)
  return connection
}

module.exports = buildBuilder

}, function(modId) { var map = {"tls":1663860580790}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580791, function(require, module, exports) {


const { Buffer } = require('buffer')
const Transform = require('readable-stream').Transform
const duplexify = require('duplexify')

/* global wx */
let socketTask, proxy, stream

function buildProxy () {
  const proxy = new Transform()
  proxy._write = function (chunk, encoding, next) {
    socketTask.send({
      data: chunk.buffer,
      success: function () {
        next()
      },
      fail: function (errMsg) {
        next(new Error(errMsg))
      }
    })
  }
  proxy._flush = function socketEnd (done) {
    socketTask.close({
      success: function () {
        done()
      }
    })
  }

  return proxy
}

function setDefaultOpts (opts) {
  if (!opts.hostname) {
    opts.hostname = 'localhost'
  }
  if (!opts.path) {
    opts.path = '/'
  }

  if (!opts.wsOptions) {
    opts.wsOptions = {}
  }
}

function buildUrl (opts, client) {
  const protocol = opts.protocol === 'wxs' ? 'wss' : 'ws'
  let url = protocol + '://' + opts.hostname + opts.path
  if (opts.port && opts.port !== 80 && opts.port !== 443) {
    url = protocol + '://' + opts.hostname + ':' + opts.port + opts.path
  }
  if (typeof (opts.transformWsUrl) === 'function') {
    url = opts.transformWsUrl(url, opts, client)
  }
  return url
}

function bindEventHandler () {
  socketTask.onOpen(function () {
    stream.setReadable(proxy)
    stream.setWritable(proxy)
    stream.emit('connect')
  })

  socketTask.onMessage(function (res) {
    let data = res.data

    if (data instanceof ArrayBuffer) data = Buffer.from(data)
    else data = Buffer.from(data, 'utf8')
    proxy.push(data)
  })

  socketTask.onClose(function () {
    stream.end()
    stream.destroy()
  })

  socketTask.onError(function (res) {
    stream.destroy(new Error(res.errMsg))
  })
}

function buildStream (client, opts) {
  opts.hostname = opts.hostname || opts.host

  if (!opts.hostname) {
    throw new Error('Could not determine host. Specify host manually.')
  }

  const websocketSubProtocol =
    (opts.protocolId === 'MQIsdp') && (opts.protocolVersion === 3)
      ? 'mqttv3.1'
      : 'mqtt'

  setDefaultOpts(opts)

  const url = buildUrl(opts, client)
  socketTask = wx.connectSocket({
    url: url,
    protocols: [websocketSubProtocol]
  })

  proxy = buildProxy()
  stream = duplexify.obj()
  stream._destroy = function (err, cb) {
    socketTask.close({
      success: function () {
        cb && cb(err)
      }
    })
  }

  const destroyRef = stream.destroy
  stream.destroy = function () {
    stream.destroy = destroyRef

    const self = this
    setTimeout(function () {
      socketTask.close({
        fail: function () {
          self._destroy(new Error())
        }
      })
    }, 0)
  }.bind(stream)

  bindEventHandler()

  return stream
}

module.exports = buildStream

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580792, function(require, module, exports) {


const { Buffer } = require('buffer')
const Transform = require('readable-stream').Transform
const duplexify = require('duplexify')

/* global FileReader */
let my
let proxy
let stream
let isInitialized = false

function buildProxy () {
  const proxy = new Transform()
  proxy._write = function (chunk, encoding, next) {
    my.sendSocketMessage({
      data: chunk.buffer,
      success: function () {
        next()
      },
      fail: function () {
        next(new Error())
      }
    })
  }
  proxy._flush = function socketEnd (done) {
    my.closeSocket({
      success: function () {
        done()
      }
    })
  }

  return proxy
}

function setDefaultOpts (opts) {
  if (!opts.hostname) {
    opts.hostname = 'localhost'
  }
  if (!opts.path) {
    opts.path = '/'
  }

  if (!opts.wsOptions) {
    opts.wsOptions = {}
  }
}

function buildUrl (opts, client) {
  const protocol = opts.protocol === 'alis' ? 'wss' : 'ws'
  let url = protocol + '://' + opts.hostname + opts.path
  if (opts.port && opts.port !== 80 && opts.port !== 443) {
    url = protocol + '://' + opts.hostname + ':' + opts.port + opts.path
  }
  if (typeof (opts.transformWsUrl) === 'function') {
    url = opts.transformWsUrl(url, opts, client)
  }
  return url
}

function bindEventHandler () {
  if (isInitialized) return

  isInitialized = true

  my.onSocketOpen(function () {
    stream.setReadable(proxy)
    stream.setWritable(proxy)
    stream.emit('connect')
  })

  my.onSocketMessage(function (res) {
    if (typeof res.data === 'string') {
      const buffer = Buffer.from(res.data, 'base64')
      proxy.push(buffer)
    } else {
      const reader = new FileReader()
      reader.addEventListener('load', function () {
        let data = reader.result

        if (data instanceof ArrayBuffer) data = Buffer.from(data)
        else data = Buffer.from(data, 'utf8')
        proxy.push(data)
      })
      reader.readAsArrayBuffer(res.data)
    }
  })

  my.onSocketClose(function () {
    stream.end()
    stream.destroy()
  })

  my.onSocketError(function (res) {
    stream.destroy(res)
  })
}

function buildStream (client, opts) {
  opts.hostname = opts.hostname || opts.host

  if (!opts.hostname) {
    throw new Error('Could not determine host. Specify host manually.')
  }

  const websocketSubProtocol =
    (opts.protocolId === 'MQIsdp') && (opts.protocolVersion === 3)
      ? 'mqttv3.1'
      : 'mqtt'

  setDefaultOpts(opts)

  const url = buildUrl(opts, client)
  my = opts.my
  my.connectSocket({
    url: url,
    protocols: websocketSubProtocol
  })

  proxy = buildProxy()
  stream = duplexify.obj()

  bindEventHandler()

  return stream
}

module.exports = buildStream

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580793, function(require, module, exports) {


const { Buffer } = require('buffer')
const WS = require('ws')
const debug = require('debug')('mqttjs:ws')
const duplexify = require('duplexify')
const Transform = require('readable-stream').Transform

const WSS_OPTIONS = [
  'rejectUnauthorized',
  'ca',
  'cert',
  'key',
  'pfx',
  'passphrase'
]
// eslint-disable-next-line camelcase
const IS_BROWSER = (typeof process !== 'undefined' && process.title === 'browser') || typeof __webpack_require__ === 'function'
function buildUrl (opts, client) {
  let url = opts.protocol + '://' + opts.hostname + ':' + opts.port + opts.path
  if (typeof (opts.transformWsUrl) === 'function') {
    url = opts.transformWsUrl(url, opts, client)
  }
  return url
}

function setDefaultOpts (opts) {
  const options = opts
  if (!opts.hostname) {
    options.hostname = 'localhost'
  }
  if (!opts.port) {
    if (opts.protocol === 'wss') {
      options.port = 443
    } else {
      options.port = 80
    }
  }
  if (!opts.path) {
    options.path = '/'
  }

  if (!opts.wsOptions) {
    options.wsOptions = {}
  }
  if (!IS_BROWSER && opts.protocol === 'wss') {
    // Add cert/key/ca etc options
    WSS_OPTIONS.forEach(function (prop) {
      if (Object.prototype.hasOwnProperty.call(opts, prop) && !Object.prototype.hasOwnProperty.call(opts.wsOptions, prop)) {
        options.wsOptions[prop] = opts[prop]
      }
    })
  }

  return options
}

function setDefaultBrowserOpts (opts) {
  const options = setDefaultOpts(opts)

  if (!options.hostname) {
    options.hostname = options.host
  }

  if (!options.hostname) {
    // Throwing an error in a Web Worker if no `hostname` is given, because we
    // can not determine the `hostname` automatically.  If connecting to
    // localhost, please supply the `hostname` as an argument.
    if (typeof (document) === 'undefined') {
      throw new Error('Could not determine host. Specify host manually.')
    }
    const parsed = new URL(document.URL)
    options.hostname = parsed.hostname

    if (!options.port) {
      options.port = parsed.port
    }
  }

  // objectMode should be defined for logic
  if (options.objectMode === undefined) {
    options.objectMode = !(options.binary === true || options.binary === undefined)
  }

  return options
}

function createWebSocket (client, url, opts) {
  debug('createWebSocket')
  debug('protocol: ' + opts.protocolId + ' ' + opts.protocolVersion)
  const websocketSubProtocol =
    (opts.protocolId === 'MQIsdp') && (opts.protocolVersion === 3)
      ? 'mqttv3.1'
      : 'mqtt'

  debug('creating new Websocket for url: ' + url + ' and protocol: ' + websocketSubProtocol)
  const socket = new WS(url, [websocketSubProtocol], opts.wsOptions)
  return socket
}

function createBrowserWebSocket (client, opts) {
  const websocketSubProtocol =
  (opts.protocolId === 'MQIsdp') && (opts.protocolVersion === 3)
    ? 'mqttv3.1'
    : 'mqtt'

  const url = buildUrl(opts, client)
  /* global WebSocket */
  const socket = new WebSocket(url, [websocketSubProtocol])
  socket.binaryType = 'arraybuffer'
  return socket
}

function streamBuilder (client, opts) {
  debug('streamBuilder')
  const options = setDefaultOpts(opts)
  const url = buildUrl(options, client)
  const socket = createWebSocket(client, url, options)
  const webSocketStream = WS.createWebSocketStream(socket, options.wsOptions)
  webSocketStream.url = url
  socket.on('close', () => { webSocketStream.destroy() })
  return webSocketStream
}

function browserStreamBuilder (client, opts) {
  debug('browserStreamBuilder')
  let stream
  const options = setDefaultBrowserOpts(opts)
  // sets the maximum socket buffer size before throttling
  const bufferSize = options.browserBufferSize || 1024 * 512

  const bufferTimeout = opts.browserBufferTimeout || 1000

  const coerceToBuffer = !opts.objectMode

  const socket = createBrowserWebSocket(client, opts)

  const proxy = buildProxy(opts, socketWriteBrowser, socketEndBrowser)

  if (!opts.objectMode) {
    proxy._writev = writev
  }
  proxy.on('close', () => { socket.close() })

  const eventListenerSupport = (typeof socket.addEventListener !== 'undefined')

  // was already open when passed in
  if (socket.readyState === socket.OPEN) {
    stream = proxy
  } else {
    stream = stream = duplexify(undefined, undefined, opts)
    if (!opts.objectMode) {
      stream._writev = writev
    }

    if (eventListenerSupport) {
      socket.addEventListener('open', onopen)
    } else {
      socket.onopen = onopen
    }
  }

  stream.socket = socket

  if (eventListenerSupport) {
    socket.addEventListener('close', onclose)
    socket.addEventListener('error', onerror)
    socket.addEventListener('message', onmessage)
  } else {
    socket.onclose = onclose
    socket.onerror = onerror
    socket.onmessage = onmessage
  }

  // methods for browserStreamBuilder

  function buildProxy (options, socketWrite, socketEnd) {
    const proxy = new Transform({
      objectModeMode: options.objectMode
    })

    proxy._write = socketWrite
    proxy._flush = socketEnd

    return proxy
  }

  function onopen () {
    stream.setReadable(proxy)
    stream.setWritable(proxy)
    stream.emit('connect')
  }

  function onclose () {
    stream.end()
    stream.destroy()
  }

  function onerror (err) {
    stream.destroy(err)
  }

  function onmessage (event) {
    let data = event.data
    if (data instanceof ArrayBuffer) data = Buffer.from(data)
    else data = Buffer.from(data, 'utf8')
    proxy.push(data)
  }

  // this is to be enabled only if objectMode is false
  function writev (chunks, cb) {
    const buffers = new Array(chunks.length)
    for (let i = 0; i < chunks.length; i++) {
      if (typeof chunks[i].chunk === 'string') {
        buffers[i] = Buffer.from(chunks[i], 'utf8')
      } else {
        buffers[i] = chunks[i].chunk
      }
    }

    this._write(Buffer.concat(buffers), 'binary', cb)
  }

  function socketWriteBrowser (chunk, enc, next) {
    if (socket.bufferedAmount > bufferSize) {
      // throttle data until buffered amount is reduced.
      setTimeout(socketWriteBrowser, bufferTimeout, chunk, enc, next)
    }

    if (coerceToBuffer && typeof chunk === 'string') {
      chunk = Buffer.from(chunk, 'utf8')
    }

    try {
      socket.send(chunk)
    } catch (err) {
      return next(err)
    }

    next()
  }

  function socketEndBrowser (done) {
    socket.close()
    done()
  }

  // end methods for browserStreamBuilder

  return stream
}

if (IS_BROWSER) {
  module.exports = browserStreamBuilder
} else {
  module.exports = streamBuilder
}

}, function(modId) { var map = {"ws":1663860580793}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1663860580794, function(require, module, exports) {


const NumberAllocator = require('number-allocator').NumberAllocator

/**
 * UniqueMessageAllocator constructor
 * @constructor
 */
function UniqueMessageIdProvider () {
  if (!(this instanceof UniqueMessageIdProvider)) {
    return new UniqueMessageIdProvider()
  }

  this.numberAllocator = new NumberAllocator(1, 65535)
}

/**
 * allocate
 *
 * Get the next messageId.
 * @return if messageId is fully allocated then return null,
 *         otherwise return the smallest usable unsigned int messageId.
 */
UniqueMessageIdProvider.prototype.allocate = function () {
  this.lastId = this.numberAllocator.alloc()
  return this.lastId
}

/**
 * getLastAllocated
 * Get the last allocated messageId.
 * @return unsigned int
 */
UniqueMessageIdProvider.prototype.getLastAllocated = function () {
  return this.lastId
}

/**
 * register
 * Register messageId. If success return true, otherwise return false.
 * @param { unsigned int } - messageId to register,
 * @return boolean
 */
UniqueMessageIdProvider.prototype.register = function (messageId) {
  return this.numberAllocator.use(messageId)
}

/**
 * deallocate
 * Deallocate messageId.
 * @param { unsigned int } - messageId to deallocate,
 */
UniqueMessageIdProvider.prototype.deallocate = function (messageId) {
  this.numberAllocator.free(messageId)
}

/**
 * clear
 * Deallocate all messageIds.
 */
UniqueMessageIdProvider.prototype.clear = function () {
  this.numberAllocator.clear()
}

module.exports = UniqueMessageIdProvider

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1663860580781);
})()
//miniprogram-npm-outsideDeps=["events","mqtt-packet","readable-stream","inherits","reinterval","rfdc/default","xtend","debug","lru-cache","number-allocator","url","net","buffer","duplexify"]
//# sourceMappingURL=index.js.map
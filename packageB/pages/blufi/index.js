var xBlufi = require("../../../utils/blufi/xBlufi.js");
var _this = null;
var timeout = null;
var interval_timer = null;
var sequenceCounet = 0;

const SCAN_STEP = 0;
const INPUT_STEP = 1;
const DONE_STEP = 2;

Page({
  data: {
    blufiloadInfo: "扫描设备",
    blufiLoadStatus: false,
    blufiScanStatus: false,
    showPassword: false,
    macFilter: "",
    stepActive: 0,
    ssid: "",
    password: "",
    steps: [{
        text: '1.连接设备'
      },
      {
        text: '2.填写WiFi'
      },
      {
        text: '3.配网成功'
      }
    ],
    deviceId: '',
    deviceName: '',
    devicesListTemp: [],
    devicesList: []
  },
  setValue(key, value) {
    this.setData({
      [key]: value,
    });
  },
  onClickeye() {
    this.setValue("showPassword", !this.data.showPassword)
  },
  blufiBtnHandle() {
    wx.vibrateShort()
    let status = this.data.stepActive
    switch (status) {
      case SCAN_STEP:
        this.setValue("blufiScanStatus", !this.data.blufiScanStatus)
        if (this.data.blufiScanStatus) {
          xBlufi.notifyStartDiscoverBle({
            'isStart': true
          })
          console.log("start scan!")
          this.setValue("blufiloadInfo", "扫描中")
          this.setValue("blufiLoadStatus", true)
          interval_timer = setInterval(() => {
            this.blufiUpdateList()
          }, 1200);
        } else {
          this.blufiIntercalClear()
          console.log("stop scan!")
          xBlufi.notifyStartDiscoverBle({
            'isStart': false
          })
          this.setValue("blufiloadInfo", "开始扫描")
          this.setValue("blufiLoadStatus", false)
        }

        break;
      case INPUT_STEP:
        this.startConfig()
      case DONE_STEP:
        break;
      default:
        break;
    }
  },
  blufiConnect(e) {
    this.setValue("blufiloadInfo", "连接中")
    if (interval_timer) {
      clearInterval(interval_timer)
    }
    //停止搜索
    xBlufi.notifyStartDiscoverBle({
      'isStart': false
    })
    for (var i = 0; i < this.data.devicesList.length; i++) {
      if (e.currentTarget.id === this.data.devicesList[i].deviceId) {
        let name = this.data.devicesList[i].name
        console.log('连接deviceId:' + e.currentTarget.id)
        xBlufi.notifyConnectBle({
          isStart: true,
          deviceId: e.currentTarget.id,
          name
        });
        wx.showLoading({
          title: '连接蓝牙设备中...',
        })
      }
    }
    timeout = setTimeout(() => {
      this.blufiTimeoutHandle()
    }, 10000)
  },
  blufiEventHandler: function (options) {
    switch (options.type) {
      case xBlufi.XBLUFI_TYPE.TYPE_GET_DEVICE_LISTS:
        if (options.result)
          _this.setData({
            devicesListTemp: options.data
          });
        break;

      case xBlufi.XBLUFI_TYPE.TYPE_CONNECTED:
        console.log("连接回调：" + JSON.stringify(options))
        if (options.result) {
          wx.hideLoading()
          wx.showToast({
            title: '连接成功',
            icon: 'none'
          })
          this.blufiTimeoutClear()
          this.setValue("blufiloadInfo", "配置WiFi")
          this.setValue("stepActive", 1);
          this.setValue("blufiLoadStatus", false)
          this.setValue("deviceId", options.data.deviceId)
          xBlufi.notifyInitBleEsp32({
            deviceId: options.data.deviceId,
          })
          this.initWifi();
          sequenceCounet = 0;
        }
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_GET_DEVICE_LISTS_START:
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_GET_DEVICE_LISTS_STOP:
        if (options.result) {
          //蓝牙停止搜索ok
          console.log('蓝牙停止搜索ok')
          this.setValue("blufiLoadStatus", false)
          this.setValue("blufiScanStatus", false)
        } else {
          //蓝牙停止搜索失败
          console.log('蓝牙停止搜索失败')
        }
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_STATUS_CONNECTED:
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_CONNECT_ROUTER_RESULT:
        wx.hideLoading();
        if (!options.result) {
          wx.showModal({
            title: '温馨提示',
            content: '配网失败，请重试',
            showCancel: false, //是否显示取消按钮
          })
          this.blufiReset()
        } else {
          if (options.data.progress == 100) {
            let ssid = options.data.ssid;
            console.log(ssid);
            this.setValue("stepActive", 2);
            this.setValue("blufiloadInfo", "配网成功")
            this.setValue("blufiLoadStatus", false)
            this.blufiTimeoutClear()
            timeout = setTimeout(() => {
              wx.closeBLEConnection({
                deviceId: this.data.deviceId,
                success: function (res) {},
              })
              this.blufiReset()
            }, 1500)
          }
        }
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_RECIEVE_CUSTON_DATA:
        console.log("收到设备发来的自定义数据结果：", (options.data))
        wx.showModal({
          title: '收到自定义设备数据',
          content: `【${options.data}】`,
          showCancel: false, //是否显示取消按钮
        })
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_INIT_ESP32_RESULT:
        wx.hideLoading();
        console.log("初始化结果：", JSON.stringify(options))
        if (options.result) {
          console.log('初始化成功')
        } else {
          console.log('初始化失败')
        }
        break;
    }
  },
  blufiReset: function () {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId,
      success: function (res) {},
    })
    this.setValue("blufiloadInfo", "扫描设备")
    this.setValue("blufiLoadStatus", false)
    this.setValue("stepActive", 0)
    this.setValue("devicesList", [])
    this.setValue("deviceId", '')
    this.setValue("macFilter", '')
  },
  blufiUpdateList: function () {
    let list = this.data.devicesListTemp
    var listLen = list.length;
    for (var i = 0; i < listLen - 1; i++) {
      for (var j = 0; j < listLen - 1 - i; j++) {
        if (list[j].RSSI < list[j + 1].RSSI) { // 相邻元素两两对比
          var temp = list[j + 1]; // 元素交换
          list[j + 1] = list[j];
          list[j] = temp;
        }
      }
    }
    // console.log(list)
    _this.setData({
      devicesList: list
    });
  },
  blufiTimeoutHandle: function () {
    wx.hideLoading()
    wx.showToast({
      title: '配网超时, 复位设备重试',
      icon: 'none'
    })
    this.blufiReset()
    timeout = null;
  },
  blufiTimeoutClear: function () {
    if (timeout) {
      clearTimeout(timeout)
    }
  },
  blufiIntercalClear: function () {
    if (interval_timer) {
      clearInterval(interval_timer)
    }
  },
  onLoad: function () {
    _this = this;
    xBlufi.initXBlufi(1);
    console.log("xBlufi", xBlufi.XMQTT_SYSTEM)
    xBlufi.listenDeviceMsgEvent(true, this.blufiEventHandler);
  },
  onUnload: function () {
    _this = this
    xBlufi.notifyConnectBle({
      isStart: false,
      deviceId: _this.data.deviceId,
      name: _this.data.deviceName,
    });
    xBlufi.listenDeviceMsgEvent(false, this.funListenDeviceMsgEvent);
  },
  onShow: function (options) {},
  filterChange(event) {
    this.setValue("macFilter", event.detail)
  },
  ssidChange(event) {
    this.setValue("ssid", event.detail)
  },
  passwordChange(event) {
    this.setValue("password", event.detail)
  },
  initWifi() {
    wx.startWifi();
    wx.getConnectedWifi({
      success: function (res) {
        if (res.wifi.SSID.indexOf("5G") != -1) {
          wx.showToast({
            title: '不支持配置5G WiFi网络',
            icon: 'none',
            duration: 3000
          })
        }
        let password = wx.getStorageSync(res.wifi.SSID)
        console.log("restore password:", password)
        _this.setData({
          ssid: res.wifi.SSID,
          password: password == undefined ? "" : password
        })
      },
      fail: function (res) {
        console.log(res);
        _this.setData({
          ssid: null,
        })
      }
    });
  },
  writeCharacteristicValue: function (data) {
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: "0000FFFF-0000-1000-8000-00805F9B34FB",
      characteristicId: "0000FF01-0000-1000-8000-00805F9B34FB",
      value: data,
      success: function (res) {},
      fail: function (res) {}
    });
  },
  _startConfig: function () {
    if (!this.data.ssid) {
      wx.showToast({
        title: 'SSID不能为空',
        icon: 'none'
      });
      return;
    }
    if (!this.data.password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '正在配网',
      mask: true
    });
    this.setValue("blufiloadInfo", "配网中")
    this.setValue("blufiLoadStatus", true)
    // xBlufi.notifySendRouterSsidAndPassword({
    //   ssid: this.data.ssid,
    //   password: this.data.password
    // })
    // 09 00 01 08 41 49 4F 54 40 46 41 45
    // 0D 00 02 0B 66 61 65 31 32 33 34 35 36 37 38
    let ssid_payload = [0x09, 0x00, sequenceCounet++];
    let pwd_payload = [0x0D, 0x00, sequenceCounet++];
    let connect_payload = [0x0C, 0x00, 0x02, sequenceCounet++];

    ssid_payload.push(this.data.ssid.length);
    for (var i = 0; i < this.data.ssid.length; i++) {
      ssid_payload.push(this.data.ssid[i].charCodeAt());
    }
    pwd_payload.push(this.data.password.length);
    for (var i = 0; i < this.data.password.length; i++) {
      pwd_payload.push(this.data.password[i].charCodeAt());
    }
    var ssidArray = new Uint8Array(ssid_payload);
    var passwordArray = new Uint8Array(pwd_payload);
    var connectCMD = new Uint8Array(connect_payload);

    this.writeCharacteristicValue(ssidArray.buffer)
    this.writeCharacteristicValue(passwordArray.buffer)
    this.writeCharacteristicValue(connectCMD.buffer)

    timeout = setTimeout(() => {
      this.blufiTimeoutHandle()
    }, 20000)
  },
  get startConfig() {
    return this._startConfig;
  },
  set startConfig(value) {
    this._startConfig = value;
  },
});
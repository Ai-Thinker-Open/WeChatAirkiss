//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util');
Page({
  //事件处理函数
  bindViewBlueTooth: function () {
    wx.vibrateShort()
    wx.closeBluetoothAdapter()
    wx.openBluetoothAdapter({
      success(res) {
        console.log(res)
        wx.startBluetoothDevicesDiscovery({
          success: function (res) {
            wx.navigateTo({
              url: '/pages/blueDevices/bluetooth/blueDevices',
            })
          }
        })
      },
      fail(res) {
        util.showToast("使用前请打开蓝牙和位置信息服务");
      }
    })
  },
  bindViewBlufi: function () {
    wx.vibrateShort()
    wx.closeBluetoothAdapter()
    wx.openBluetoothAdapter({
      success(res) {
        console.log(res)
        wx.startBluetoothDevicesDiscovery({
          success: function (res) {
            wx.navigateTo({
              url: '../../packageB/pages/blufi/index',
            })
          }
        })
      },
      fail(res) {
        util.showToast("使用前请打开蓝牙和位置信息服务");
      }
    })
  },
  bindViewPbOTA: function () {
    wx.vibrateShort()
    wx.navigateTo({
      url: '../../packageC/pages/index/index',
    })
  },
  //事件处理函数
  bindViewMqttDash: function () {
    wx.vibrateShort()
    wx.navigateTo({
      url: '../../packageA/pages/mqttDash/index',
    })
  },
  bindViewAirKiss: function () {
    wx.vibrateShort()
    wx.navigateTo({
      url: '/pages/airkiss/index',
    })
  },
  onLoad: function (option) {
    wx.getSystemInfo({
      success(res) {
        //app.data.system = res.platform
      }
    })
  },
  onShareAppMessage: function () {
    /// ignore
  }
})
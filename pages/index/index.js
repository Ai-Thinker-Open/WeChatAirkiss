//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util');
Page({
  //事件处理函数
  bindViewBlueTooth: function () {
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
        util.showToast("Please turn on the system Bluetooth");
      }
    })
  },
  bindViewAirKiss: function () {
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
  }
})

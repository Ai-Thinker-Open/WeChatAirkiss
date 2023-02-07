const app = getApp()
Page({
  data: {
    searching: false,
    devicesList: []
  },
  onPullDownRefresh: function () {
    var that = this
    if (!that.data.searching) {
      wx.closeBluetoothAdapter({
        complete: function (res) {
          console.log(res)
          wx.openBluetoothAdapter({
            success: function (res) {
              console.log(res)
              wx.getBluetoothAdapterState({
                success: function (res) {
                  console.log(res)
                }
              })
              wx.startBluetoothDevicesDiscovery({
                allowDuplicatesKey: false,
                success: function (res) {
                  console.log(res)
                  that.setData({
                    searching: true,
                    devicesList: []
                  })
                }
              })
            },
            fail: function (res) {
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '请检查手机蓝牙是否打开',
                showCancel: false,
                success: function (res) {
                  that.setData({
                    searching: false
                  })
                }
              })
            }
          })
        }
      })
    } else {
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  Connect: function (e) {
   console.log(JSON.stringify(e))
    var that = this
    var advertisData, name , deviceId
    for (var i = 0; i < that.data.devicesList.length; i++) {
      if (e.currentTarget.id == that.data.devicesList[i].deviceId) {
        name = that.data.devicesList[i].name
        deviceId = that.data.devicesList[i].deviceId
        advertisData = that.data.devicesList[i].advertisData
      }
    }
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        that.setData({
          searching: false
        })
      }
    })
    wx.showLoading({
      title: '连接蓝牙设备中...',
    })
    wx.createBLEConnection({
      deviceId,
      success: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 1000
        })
        wx.navigateTo({
          url: '/pages/blueDevices/bluetoothChat/index?deviceId=' + e.currentTarget.id + '&name=' + name
        })
      },
      fail: function (res) {
        console.log(JSON.stringify(res))
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '连接失败',
          showCancel: false
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this
    var list_height = ((app.globalData.SystemInfo.windowHeight - 50) * (750 / app.globalData.SystemInfo.windowWidth)) - 60
    that.setData({
      list_height: list_height
    })
    wx.onBluetoothAdapterStateChange(function (res) {

      that.setData({
        searching: res.discovering
      })
      if (!res.available) {
        that.setData({
          searching: false
        })
      }
    })
    wx.onBluetoothDeviceFound(function (devices) {
      //剔除重复设备，过滤名字是否为 Ai-Thinker 
      var isnotexist = true
      if (devices.deviceId) {
        if (devices.advertisData) {
          devices.advertisData = app.buf2hex(devices.advertisData)
        } else {
          devices.advertisData = ''
        }
        console.log(devices)
        for (var i = 0; i < that.data.devicesList.length; i++) {
          if (devices.deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist && (devices[0].name === 'aithinker' || devices[0].name === 'Ai-Thinker' || devices[0].name === 'ai-thinker')) {
          that.data.devicesList.push(devices[0])
        }
      } else if (devices.devices) {
        if (devices.devices[0].advertisData) {
          devices.devices[0].advertisData = app.buf2hex(devices.devices[0].advertisData)
        } else {
          devices.devices[0].advertisData = ''
        }

        for (var i = 0; i < that.data.devicesList.length; i++) {
          if (devices.devices[0].deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist && (devices.devices[0].name === 'aithinker' ||
          devices.devices[0].name === 'Ai-Thinker' || devices.devices[0].name === 'ai-thinker')) {
          that.data.devicesList.push(devices.devices[0])
        }
      } else if (devices[0]) {
        if (devices[0].advertisData) {
          devices[0].advertisData = app.buf2hex(devices[0].advertisData)
        } else {
          devices[0].advertisData = ''
        }
       
        for (var i = 0; i < devices_list.length; i++) {
          if (devices[0].deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist && (devices[0].name === 'aithinker' || devices[0].name === 'Ai-Thinker' || devices[0].name === 'ai-thinker')) {
          that.data.devicesList.push(devices[0])
        }
      }

      console.log(JSON.stringify(that.data.devicesList))

      that.setData({
        devicesList: that.data.devicesList
      })
    })
  },
  onHide: function () {
    var that = this
    that.setData({
      devicesList: []
    })
    if (this.data.searching) {
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  onShareAppMessage: function() {
    /// ignore
  }
})

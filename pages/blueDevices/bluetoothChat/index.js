const app = getApp()
Page({
  data: {
    inputText: 'Hello World!',
    receiveText: '',
    receiveArry: [],
    name: '',
    connectedDeviceId: '',
    serviceId: "55535343-FE7D-4AE5-8FA9-9FAFD205E455", //可写的服务ID
    characteristics: '49535343-8841-43F4-A8D4-ECBE34729BB3',//可写的characteristics ID
    read_characteristics: '49535343-1E4D-4BD9-BA61-23C647249616', //49535343-1E4D-4BD9-BA61-23C647249616
    connected: true,
  },
  bindInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
    console.log(e.detail.value)
  },
  SendTap: function () {
    var that = this
    if (that.data.connected) {
      var buffer = new ArrayBuffer(that.data.inputText.length)
      var dataView = new Uint8Array(buffer)
      for (var i = 0; i < that.data.inputText.length; i++) {
        dataView[i] = that.data.inputText.charCodeAt(i)
      }
      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.serviceId,
        characteristicId: that.data.characteristics,
        value: buffer,
        success: function (res) {
          console.log('发送成功')
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this

    that.setData({
      name: options.name,
      connectedDeviceId: options.deviceId
    })

    wx.getBLEDeviceServices({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        var all_UUID = res.services;
        var index_uuid = -1;
        var UUID_lenght = all_UUID.length;
        //console.log("service:" + JSON.stringify(res))
        /* 遍历服务数组 */
        for (var index = 0; index < UUID_lenght; index++) {
          var ergodic_UUID = all_UUID[index].uuid;
          /* 判断是否是我们需要的服务UUID*/
          if (ergodic_UUID === that.data.serviceId) {
            index_uuid = index;
          };
        };

        if (index_uuid == -1) {
          wx.showModal({
            title: '提示',
            content: '非我方出售的设备',
            showCancel: false,
            success: function (res) {
              that.setData({
                searching: false
              })
            }
          })
        } else {
          wx.getBLEDeviceCharacteristics({
            deviceId: that.data.connectedDeviceId,
            serviceId: that.data.serviceId,
            success: function (res) {
              wx.notifyBLECharacteristicValueChange({
                state: true,
                deviceId: that.data.connectedDeviceId,
                serviceId: that.data.serviceId,
                characteristicId: that.data.read_characteristics,
                success: function (res) {
                  console.log('启用notify成功')
                },
                fail(res) {
                  console.log(res)
                }
              })
            },
            fail(res) {
              console.log(res)
            }
          })
        }
      }
    })
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected
      })
    })
    wx.onBLECharacteristicValueChange(function (res) {
      console.log('接收到数据：' + app.buf2string(res.value))
      var time = that.getNowTime()
      that.setData({
        receiveText: that.data.receiveText + time + (app.buf2string(res.value))
      })
    })
  },
  onUnload: function () {
    wx.closeBLEConnection({
      deviceId: this.data.connectedDeviceId,
      success: function (res) { },
    })
  },
  SendCleanTap: function () {
    this.setData({
      inputText: ''
    })
  },

  RecvCleanTap: function () {
    this.setData({
      receiveText: ''
    })
  },
  SendValue: function (e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  getNowTime: function () {
    // 加0
    function add_10(num) {
      if (num < 10) {
        num = '0' + num
      }
      return num;
    }
    var myDate = new Date();
    myDate.getYear(); //获取当前年份(2位)
    myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    myDate.getMonth(); //获取当前月份(0-11,0代表1月)
    myDate.getDate(); //获取当前日(1-31)
    myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
    myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
    myDate.getHours(); //获取当前小时数(0-23)
    myDate.getMinutes(); //获取当前分钟数(0-59)
    myDate.getSeconds(); //获取当前秒数(0-59)
    myDate.getMilliseconds(); //获取当前毫秒数(0-999)
    myDate.toLocaleDateString(); //获取当前日期
    var nowTime = add_10(myDate.getHours()) + '时' + add_10(myDate.getMinutes()) + '分' + add_10(myDate.getSeconds()) + '秒 收到：';
    return nowTime;
  },
  onShareAppMessage: function () {
    /// ignore
  }
})
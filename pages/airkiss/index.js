const airkiss = requirePlugin('airkiss');


/*********** hal_version 版本迭代 ***********/
//  211209 ：纠正输入的SSID判断长度问题
/*************************************/

Page({
    data: {
        ssid: '',
        password: '',
        is5G: true,
        showClearBtn: false,
        isWaring: false,
        hal_version: 211209,
        ui: {
            background: [
                { url: 'https://aithinker-static.oss-cn-shenzhen.aliyuncs.com/officialwebsite/banner/ESP32-C3.png' },
                { url: 'https://aithinker-static.oss-cn-shenzhen.aliyuncs.com/officialwebsite/banner/banner32.jpg' },
                { url: 'https://aithinker-static.oss-cn-shenzhen.aliyuncs.com/officialwebsite/banner/banner32.jpg' },
            ],
            indicatorDots: true,
            vertical: false,
            autoplay: false,
            interval: 2000,
            duration: 500
        }
    },
    onLoad(opt) {
        this.setData({
            version: airkiss.version,
        })
        let that = this
        wx.startWifi({
            success(res) {
                console.log(res.errMsg, 'wifi初始化成功')
                that.getWifiInfo();
            },
            fail: function (res) {
                wx.showToast({
                    title: '请连接路由器!',
                    duration: 2000,
                    icon: 'none'
                })
            }
        })
        this.getWifiInfo()
    },
    getWifiInfo() {
        let that = this
        wx.getConnectedWifi({
            success(res) {
                console.log("getConnectedWifi ok:", JSON.stringify(res))
                if ('getConnectedWifi:ok' === res.errMsg) {
                    that.setData({
                        ssid: res.wifi.SSID,
                        bssid: res.wifi.BSSID,
                        is5G: res.wifi.frequency > 4900
                    })
                } else {
                    wx.showToast({
                        title: '请连接路由器',
                        duration: 2000,
                        icon: 'none'
                    })
                }
            },
            fail(res) {
                wx.showToast({
                    title: '请连接路由器',
                    duration: 2000,
                    icon: 'none'
                })
            }
        })
    },
    onInputSSID(evt) {
        const {
            value
        } = evt.detail;
        this.setData({
            ssid: value,
        });
    },
    onInputPassword(evt) {
        const {
            value
        } = evt.detail;
        this.setData({
            password: value,
            showClearBtn: !!value.length,
            isWaring: false,
        });
    },
    onClear() {
        this.setData({
            password: '',
            showClearBtn: false,
            isWaring: false,
        });
    },
    onConfirm() {
        console.log("ssid:", this.data.ssid, ",password:", this.data.password)

        if (this.data.ssid == '') {
            wx.showToast({
                title: '请连接路由器',
                duration: 2000,
                icon: 'none'
            })
            return;
        }

        if (this.data.password.length < 8) {
            wx.showToast({
                title: '请输出不少于8位的密码',
                duration: 2000,
                icon: 'none'
            })
            return;
        }

        if (this.data.is5G) {
            wx.showToast({
                title: '请链接至2.4G频段的路由器',
                duration: 2000,
                icon: 'none'
            })
            return;
        }
        wx.showLoading({
            title: '配网中',
        })
        //这里最好加微信小程序判断账号密码是否为空，以及其长度和是否为5G频段
        airkiss.startAirkiss(this.data.ssid, this.data.password, function (res) {
            wx.hideLoading();
            switch (res.code) {
                case 0:
                    wx.showModal({
                        title: '初始化失败',
                        content: res.result,
                        showCancel: false,
                        confirmText: '收到',
                    })
                    break;
                case 1:
                    wx.showModal({
                        title: '配网成功',
                        content: '设备IP：' + res.ip + '\r\n 设备Mac：' + res.bssid,
                        showCancel: false,
                        confirmText: '好的',
                    })
                    break;
                case 2:
                    wx.showModal({
                        title: '配网失败',
                        content: '请检查密码是否正确',
                        showCancel: false,
                        confirmText: '收到',
                    })
                    break;

                default:
                    break;
            }

        })
    },
});

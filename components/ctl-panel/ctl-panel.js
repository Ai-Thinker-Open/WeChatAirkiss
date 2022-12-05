// components/switchBtn/switchBtn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    config: {
      type: Object
    },
    status: {
      type: Boolean
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    sliderStatus: 255,
    colorPick: '#000000'
  },
  onLoad() {
    let _this = this
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          rpxRatio: res.screenWidth / 750
        })
      }
    })
  },
  observers: {
    'config': function(config) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      this.setData({
        switchStatus: config.status
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeColorPicker() {
      this.triggerEvent("closePanelEvent", false)
    },
    btnColorChange: function(event) {
      let item = event.currentTarget.dataset.item
      console.log(item);
      this.setData({
        colorPick: item
      })
      this.triggerEvent("rgbEvent", {
        id: this.properties.config.id,
        rgbhex: this.data.colorPick
      })
    },
    colorChange: function(e) {
      console.log(e.detail.value);
      console.log(e.detail.hex);
      this.setData({
        colorPick: e.detail.hex
      })
      this.triggerEvent("rgbEvent", {
        id: this.properties.config.id,
        rgbhex: this.data.colorPick
      })
    },
    switchChange(event) {
      let _status = event.detail.value
      console.log(_status)
      this.triggerEvent("onoffEvent", {
        id: this.properties.config.id,
        onoff: _status
      })
    },
    sliderChange(event) {
      let _status = event.detail.value
      console.log(_status)
      this.setData({
        sliderStatus: _status
      })
      this.triggerEvent("sliderEvent", {
        id: this.properties.config.id,
        slider: this.data.sliderStatus
      })
    },
    catchTapEvent(){
      
    }
  }
})

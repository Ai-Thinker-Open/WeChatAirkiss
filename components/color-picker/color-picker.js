// components/color-picker/color-picker.js

const util = require('./utils/util')
var timerHandle = null
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id: {
      type: String
    },
    rgbhex: {
      type: String
    }
  },
  lifetimes: {
    ready: function () {
      let colorPickerCtx = {};
      let sliderCtx = {};
      wx.createSelectorQuery().in(this).select("#colorPicker" + this.properties.id).context(function (res) {
          colorPickerCtx = res.context;
        })
        .exec();
      wx.createSelectorQuery().in(this).select("#colorPickerSlider" + this.properties.id).context(function (res) {
        sliderCtx = res.context;
      }).exec();
      let isInit = true;
      const query = wx.createSelectorQuery().in(this)
      query.select('#colorPicker').boundingClientRect((rect) => {
        this.setData({
          valueWidthOrHerght: rect.width,
        })
        if (isInit) {
          colorPickerCtx.setFillStyle('white')
          colorPickerCtx.fillRect(0, 0, rect.width, rect.height);
          util.drawRing(colorPickerCtx, rect.width, rect.height);
          // 设置默认位置
          util.drawSlider(sliderCtx, rect.width, rect.height, 1.0);
          isInit = false;
          this.setData({
            colorPickerCtx: colorPickerCtx
          })
          this.setData({
            sliderCtx: sliderCtx
          })
        }
        this.setData({
          pickColor: JSON.stringify({
            red: 255,
            green: 0,
            blue: 0
          })
        })
      }).exec();
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    pickColor: null,
    pickHEX: "#000000",
    raduis: 520, //这里最大为750rpx铺满屏幕
    valueWidthOrHerght: 0,
    colorPickerCtx: {},
    sliderCtx: {}
  },
  observers: {
    'rgbhex': function(rgbhex) {
      let rgb = util.hex2rgb(rgbhex.substring(1));
      this.setColorPick(rgb.r, rgb.g, rgb.b);
    }
  },
  methods: {
    setColorPick: function (r, g, b) {
      let h = util.rgb2hsl(r, g, b);
      if(!this.data.sliderCtx.canvasId){
        return;
      }
      util.drawSlider(this.data.sliderCtx, this.data.valueWidthOrHerght, this.data.valueWidthOrHerght, h[0]);
      this.setData({
        pickColor: JSON.stringify({
          red: r,
          green: g,
          blue: b
        })
      })
    },
    onSlide: function (e) {
      let that = this;
      console.log("active!");
      let x = e.changedTouches[0].x;
      let y = e.changedTouches[0].y;
      if (e.type !== 'touchend') {
        x = e.touches[0].x;
        y = e.touches[0].y;
      }
      //复制画布上指定矩形的像素数据
      wx.canvasGetImageData({
        canvasId: "colorPicker" + this.properties.id,
        x: x,
        y: y,
        width: 1,
        height: 1,
        success(res) {
          // 转换成hsl格式，获取旋转角度
          let h = util.rgb2hsl(res.data[0], res.data[1], res.data[2]);
          // 判断是否在圈内
          if (h[1] !== 1.0) {
            return;
          }
          that.setData({
            pickColor: JSON.stringify({
              red: res.data[0],
              green: res.data[1],
              blue: res.data[2]
            })
          })
          let hexstr = util.rgb2hex(
            res.data[0],
            res.data[1],
            res.data[2]
          )
          that.setData({
            pickHEX: hexstr
          })
          if(timerHandle){
            clearTimeout(timerHandle);
          }
          util.drawSlider(that.data.sliderCtx, that.data.valueWidthOrHerght, that.data.valueWidthOrHerght, h[0]);
          if(e.touches && (e.type === 'touchend')){
            that.triggerEvent("colorPickerEvent", {
              value: that.data.pickColor,
              hex: hexstr
            })
          }
          if (e.type !== 'touchEnd') {
            // 触摸结束才设置设备属性
            return;
          }
        }
      }, this);
    }
  }
})
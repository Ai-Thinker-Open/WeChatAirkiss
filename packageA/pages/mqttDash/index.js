// pages/mqttDash.js
var mqtt = require('../../../utils/mqtt.js');
var tid = 0x00;
var client = null;
var timer = null;
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';

const uplink_opcode = "d38888";
const downlink_opcode = "d18888";
const uplink_topic = "aithinker/uplink";
const downlink_topic = "aithinker/downlink";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabSelected: 0,
    ctlPanelShow: false,
    ctlPanelInfo: {},
    devices: [{
        icon: "icon-taideng",
        id: "C001",
        status: false,
        temp: "....°C",
        hum: "....%",
        body: "....",
        rgbhex: "#00FF00",
        name: "PB02组播",
        group: 0
      },
      {
        icon: "icon-taideng",
        id: "C002",
        status: false,
        temp: "....°C",
        hum: "....%",
        body: "....",
        rgbhex: "#00FF00",
        name: "PB03组播",
        group: 0
      },
      {
        icon: "icon-taideng",
        id: "C003",
        status: false,
        temp: "....°C",
        hum: "....%",
        body: "....",
        rgbhex: "#00FF00",
        name: "TB02组播",
        group: 0
      },
      {
        icon: "icon-taideng",
        id: "C004",
        status: false,
        temp: "....°C",
        hum: "....%",
        body: "....",
        rgbhex: "#00FF00",
        name: "TB03组播",
        group: 0
      },
      {
        icon: "icon-taideng",
        id: "C005",
        status: false,
        temp: "....°C",
        hum: "....%",
        body: "....",
        rgbhex: "#00FF00",
        name: "照明大灯",
        group: 0
      },
      {
        icon: "icon-taideng",
        id: "FFFF",
        status: false,
        temp: "....°C",
        hum: "....%",
        body: "....",
        rgbhex: "#00FF00",
        name: "群体广播",
        group: 0
      }
    ],
    client: null,
    mqttStatus: false,
    host: "aligenie.xuhongv.com",
    // host: "broker.emqx.io:8084",
    subTopic: uplink_topic,
    pubTopic: downlink_topic,
    mqttOptions: {
      protocol: 'wxs',
      protocolVersion: 5,
      username: "aithinker-fae-01"  + Math.ceil(Math.random() * 10),
      password: "shengyenatieyyds"  + Math.ceil(Math.random() * 10),
      reconnectPeriod: 1000, // 1000毫秒，设置为 0 禁用自动重连，两次重新连接之间的间隔时间
      connectTimeout: 10 * 1000, // 10秒，连接超时时间
      keepalive: 30
    },
  },
  setValue(key, value) {
    this.setData({
      [key]: value,
    });
  },
  connect() {
    console.log("connect...")
    this.setValue("mqttStatus", false)
    try {
      let clientId = "axk_" + Math.ceil(Math.random() * 10)
      if(!this.data.client){
        this.data.client = mqtt.connect(`wxs://${this.data.host}/mqtt`, {
          // this.data.client = mqtt.connect(`wxs://${this.data.host}/mqtt`, {
            ...this.data.mqttOptions,
            clientId,
          });
      }
      this.data.client.on("connect", () => {
        console.log("connected!")
        this.setValue("mqttStatus", true)
        Notify({
          type: 'primary',
          message: '连接成功'
        });
        this.subscribe();
        this.data.client.on("message", (topic, payload, packet) => {
          try {
            this.uplinkHandler({
              topic: topic,
              payload: payload,
            });
          } catch (error) {
            
          }
        });
        this.data.client.on("error", (error) => {
          this.setValue("mqttStatus", false)
          console.log("onError", error)
        });
        this.data.client.on("reconnect", () => {
          this.setValue("mqttStatus", false)
          console.log("reconnecting...");
        });
        this.data.client.on("offline", () => {
          this.setValue("mqttStatus", false)
          console.log("onOffline")
        });
      });
    } catch (error) {
      this.setValue("mqttStatus", false)
      console.log("mqtt.connect error", error)
    }
  },
  disconnect() {
    try {
      console.log("disconnect!")
      this.data.client.end()
      this.setValue("client", null)
    } catch (error) {
      
    }
  },
  subscribe() {
    if (this.data.client) {
      this.data.client.subscribe(this.data.subTopic, {qos: 2})
      // Notify({ type: 'primary', message: '成功订阅主题：' });
      return
    }
  },
  publish(msg) {
    try {
      if (this.data.client) {
        console.log(msg)
  //  *     client.publish('topic', 'message', {qos: 1, retain: true, dup: true});
        if(timer){
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          this.data.client.publish(msg.topic, msg.payload, {qos: msg.qos})
          wx.vibrateShort()
        }, 100);
      }
    } catch (error) {
      
    }
  },
  tabChangeHandler(event){
    this.setValue("tabSelected", event.detail.index)
  },
  /**
   * 打开控制面板
   */
  selectHandler(event) {
    let item = event.currentTarget.dataset.item
    this.setValue("ctlPanelShow", true)
    this.setValue("ctlPanelInfo", item)
  },
  /**
   * 关闭控制面板
   */
  closePanelHandler(event) {
    this.setValue("ctlPanelShow", false)
  },
  updateDeviceInfo(id, key, value){
    let devices = this.data.devices
    let ctlPanelInfo = this.data.ctlPanelInfo
    if( ctlPanelInfo.id == id ){
      ctlPanelInfo[key] = value
      if( key == "rgbhex" && value !== "#000000" && id !== "C005"){
        ctlPanelInfo["status"] = true;
      }      
      this.setValue("ctlPanelInfo", ctlPanelInfo)
    }
    let devices_item = null;
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].id == id) {
        devices[i][key] = value;
        devices_item = devices[i];
        if( key == "rgbhex" && value !== "#000000" && id !== "C005"){
          devices[i]["status"] = true;
        }   
      }else if( id === "FFFF" && devices[i]["id"] !== "C005"){
        devices[i][key] = value;
        if( key == "rgbhex" && value !== "#000000"){
          devices[i]["status"] = true;
        }
      }
    }
    this.setValue("devices", devices)
    return devices_item;
  },
  getDeviceInfo(id){
    let devices = this.data.devices
    for (let i = 0; i < devices.length; i++) {
      if (this.data.devices[i].id == id) {
        return this.data.devices[i];
      }
    }
    this.setValue("devices", devices)
  },
  updateTid(){
    if (tid < 0xff) {
      tid++;
    } else {
      tid = 0;
    }
    let tidstr = tid.toString(16);
    if (tidstr.length != 2) {
      tidstr = '0' + tidstr;
    }
    return tidstr;
  },
  onoffHandler(event) {
    let target = event.detail
    let tidstr = this.updateTid();
    console.log(target)
    // 更新灯组状态
    let device = this.updateDeviceInfo(target.id, "status", target.onoff);
    console.log(device)
    let rgbhex = device.status?device.rgbhex:"#000000"
    if( target.id == "C005") {
      let payload = {
        addr: target.id,
        opcode: downlink_opcode,
        data: `${tidstr}0001${device.status?"01":"00"}`
      }
      let msg = {
        topic: this.data.pubTopic,
        qos: 2,
        payload: JSON.stringify(payload)
      }
      this.publish(msg)
    }else{
      let payload = {
        addr: target.id,
        opcode: downlink_opcode,
        data: `${tidstr}0003${rgbhex.substring(1)}`
      }
      let msg = {
        topic: this.data.pubTopic,
        qos: 2,
        payload: JSON.stringify(payload)
      }
      this.publish(msg)
    }
  },
  brightnessHandler(event) {
    let target = event.detail
    console.log(target)
    let tidstr = this.updateTid();
    let sliderstr = target.slider.toString(16);
    if (sliderstr.length != 2) {
      sliderstr = '0' + sliderstr;
    }
    let payload = {
      addr: target.id,
      opcode: downlink_opcode,
      data: `${tidstr}0002${sliderstr}`
    }
    let msg = {
      topic: this.data.pubTopic,
      qos: 2,
      payload: JSON.stringify(payload)
    }
    console.log(msg)
    this.publish(msg)
  },
  rgbHandler(event) {
    let target = event.detail
    console.log(target)
    let tidstr = this.updateTid();
    this.updateDeviceInfo(target.id, "rgbhex", target.rgbhex);
    let payload = {
      addr: target.id,
      opcode: downlink_opcode,
      data: `${tidstr}0003${target.rgbhex.substring(1)}`
    }
    let msg = {
      topic: this.data.pubTopic,
      qos: 2,
      payload: JSON.stringify(payload)
    }
    this.publish(msg)
  },
  uplinkHandler(event) {
    console.log(`收到消息 - Topic: ${event.topic}，Payload: ${event.payload}`)
    try {
      let target = JSON.parse(event.payload)
      let opcode = target.opcode
      let addr = target.addr
      let data = target.data
      let devices = this.data.devices
      let ctlPanelInfo = this.data.ctlPanelInfo
      if (opcode == uplink_opcode) {
        let attr = data.substring(2, 6);
        if (attr == "0001") {
          // 灯开关状态上报
          // for (let i = 0; i < devices.length; i++) {
          //   if (this.data.devices[i].id == addr) {
          //     this.data.devices[i].status = data.substring(6, 8) == "00" ? false : true
          //     if( ctlPanelInfo.id == addr ){
          //       ctlPanelInfo.status = this.data.devices[i].status
          //       this.setValue("ctlPanelInfo", ctlPanelInfo)
          //     }
          //   }
          // }
        } else if (attr == "0004") {
          // 温湿度传感器上报
          let temp_plus = parseInt(data.substring(6, 8), 16)
          let temp_int = parseInt(data.substring(8, 10), 16)
          let temp_decimal = parseInt(data.substring(10, 12), 16)
          let hum = parseInt(data.substring(12, 14), 16)
          this.updateDeviceInfo(addr, "temp", `${temp_int}.${temp_decimal.toString()[0]}°C`);
          this.updateDeviceInfo(addr, "hum", `${hum}%`);
          Notify({
            type: 'success',
            backgroundColor: '#07c1605c',
            message: `节点${addr.toUpperCase()}  温度：${temp_int}.${temp_decimal.toString()[0]}°C  /  湿度：${hum}%`
          });
          if( ctlPanelInfo.id == addr ){
            ctlPanelInfo.temp = this.data.devices[i].temp
            ctlPanelInfo.hum = this.data.devices[i].hum
            this.setValue("ctlPanelInfo", ctlPanelInfo)
          }
        } else if (attr == "0005") {
          // 人体检测传感器上报
          let body = data.substring(6, 8) == "00" ? "没人" : "有人"
          if( body === "有人"){
            Notify({
            //   type: 'success',
              selector: '#van-notify',
              background: '#fda051',
              message: `节点${addr} 人体传感器：${body}`
            });
            wx.vibrateShort()
          }
          this.updateDeviceInfo(addr, "body", body);
        }
        this.setValue("devices", devices)
      }
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let data = this.data.devices;
    for(var i=2; i<0x80; i++){
      let temp = i;
      let deviceId = temp.toString(16);
      if (deviceId.length != 2) {
        deviceId = '000' + deviceId;
      }else{
        deviceId = '00' + deviceId;
      }
      let group = 0;
      let name;
      if(i <= 0x11){
        group = 1;
        name =  `${deviceId}节点`;
      }else if((i>=0x13 && i <= 0x2a) ||  (i>=0x4d && i <= 0x66 )){
        group = 2;
        name = `${deviceId}节点`;
      }else if((i>=0x3a && i <= 0x49)){
        group = 3;
        name =  `${deviceId}节点`;
      }else if((i>=0x67 && i <= 0x7a)){
        group = 4;
        name =  `${deviceId}节点`;
      }else{
        continue;
      }
      let deviceInfo = {
        icon: "icon-taideng",
        id: deviceId,
        status: false,
        temp: "....°C",
        hum: "....%",
        body: "....",
        rgbhex: "#00FF00",
        name: name,
        group: group
      }
      data.push(deviceInfo);
    }
    this.setValue("devices", data)
    this.setValue("ctlPanelInfo", this.data.devices[0])
    // this.connect()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if(!this.data.client){
      this.connect()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    if(this.data.client){
      this.disconnect()
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if(this.data.client){
      this.disconnect()
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    
  }
})
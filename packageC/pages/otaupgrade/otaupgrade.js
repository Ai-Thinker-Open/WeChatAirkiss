const plugin = requirePlugin('hello-plugin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '还未选择文件',
    fileList: [],
    deviceId: "",
    type: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.deviceId == undefined) wx.navigateBack()
    this.data.deviceId = options.deviceId
    if (options.type != undefined) this.data.type = parseInt(options.type)
    this.readFileTap()
  },


  //界面按钮事件，选择一个文件进行升级
  selectFileTap(e) {
    let item = e.currentTarget.dataset.item
    plugin.message("您选择的是：" + item + ",确定开始OTA升级吗？", () => {
      plugin.handleSetMTUSize(244)
      if (this.data.type == plugin.SLBOTAType && item.endsWith(".bin")) {
        plugin.SLBSelectedFile(item, this.data.deviceId)
        plugin.SLBListenProgress((progressStr) => {
          this.setData({
            motto: progressStr
          })
        })
        plugin.SLBListenOTAComplete(() => {
          plugin.message("收到固件端确认，升级成功", () => {
            wx.navigateBack()
          })
        })
      } else if (this.data.type == plugin.SBHOTAType && (item.endsWith("hex") || item.endsWith("hex16"))) {
        console.log("Single Band OTA 模式")
        plugin.SBHSelectedFile(item, this.data.deviceId)
        plugin.SBHListenProgress((progressStr) => {
          this.setData({
            motto: progressStr
          })
        })
        plugin.SBHListenOTAComplete(() => {
          plugin.message("收到固件端确认，升级成功", () => {
            wx.navigateBack()
          })
        })
      } else if (this.data.type == plugin.SBHAPPType && (item.endsWith("hex") || item.endsWith("hex16"))) {
        plugin.SBHAppModeStart(item, this.data.deviceId)
        plugin.SBHListenProgress((progressStr) => {
          this.setData({
            motto: progressStr
          })
        })
        plugin.SBHListenOTAComplete(() => {
          plugin.message("收到固件端确认，升级成功", () => {
            wx.navigateBack()
          })
        })
      } else if (item.endsWith("hexe16") && (this.data.type == plugin.SBHAPPType)) {
        console.log("加密模式 App模式")
      } else if (item.endsWith("hexe16") && (this.data.type == plugin.SBHOTAType)) {
        console.log("加密模式 OTA模式")
      } else {
        this.setData({
          motto: "类型：" + this.data.type + ", 文件：" + item
        })
        plugin.message("升级方式与文件格式未支持！")
      }
      this.setData({
        motto: "正在处理中，请等待!!!"
      })
    }, true, "请确认")
  },


  //界面按钮事件，从会话框选择文件
  choiceFileTap() {
    this.copyFileFromWXMessage((myfile) => {
      var result = "文件名:" + myfile.name + ",\n大小:" + myfile.size
      console.log(result)
      this.setData({
        motto: result
      })
      this.readFileTap()
    })
  },

  /**
   * 从微信会话框中选择升级文件，默认将文件拷贝到升级
   * @param call 
   */
  copyFileFromWXMessage(call) {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['hex16', 'hex', 'bin'],
      success(res) {
        const myfile = res.tempFiles[0]
        plugin.copyFileToUserEnv(myfile.path, myfile.name, () => {
          call(myfile)
        })
      }
    })
  },

  //访问用户空间
  readFileTap() {
    var i = 0,
      file;
    this.data.fileList = []
    plugin.readDirHandler((readfiles) => {
      if (readfiles.length == 0) { //如果没有保存的文件
        console.log("用户空间没有数据!")
      } else {
        for (i = 0; i < readfiles.length; i++) {
          file = readfiles[i]
          if (file == "miniprogramLog") continue
          this.data.fileList.push(file)
        }
        this.setData({
          fileList: this.data.fileList
        })
      }
    })
  },
  onShareAppMessage: function () {
    /// ignore
  }
})
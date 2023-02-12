// pages/document/document.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scorePath: "cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/scores/",
    scoreNames: {
      "你的光芒": "你的光芒.pdf", 
      "忐忑": "忐忑合唱乐谱.pdf", 
      "那天一个冲动我加入合唱团": "那天一個衝動我加入合唱團（FDUC版）.pdf"
    }
  },

  /**
   * 显示pdf
   */
  showPdf(e) {
    const fSM = wx.getFileSystemManager()
    let score = e.currentTarget.dataset.score
    let fileID = this.data.scorePath + score
    console.log(fileID)
    wx.showLoading({
      title: '打开乐谱中',
      mask: true
    })
    // 从云存储空间下载文件（fileID）
    wx.cloud.downloadFile({
      fileID: fileID,
    })
    .then(res=>{
      let fileName = fileID.substring(fileID.lastIndexOf("/") + 1)
      let filePath = wx.env.USER_DATA_PATH + "/" + fileName
      // 将文件存储到用户本地目录中，为了最终能显示原文件名
      fSM.saveFile({
        tempFilePath: res.tempFilePath,
        filePath: filePath,
        success(res){
          let savedPath = res.savedFilePath   
          // 打开pdf
          wx.openDocument({
          filePath: savedPath,
          showMenu: true,
          })
          wx.hideLoading()
        }
      })
    })
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
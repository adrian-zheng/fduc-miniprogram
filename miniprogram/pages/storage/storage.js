// pages/storage/storage.js
let urlArr = [] // cloudPath

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  clickButton() {
    let that = this
    wx.chooseMedia({
      count: 9, // 最多传9个
      mediaType: ['image','video'], // 图片视频都可以
      sourceType: ['album', 'camera'], // 相册拍照都可以
      maxDuration: 60, // 视频最长时长60s
      success(res) {
        let filePath = res.tempFiles.map(obj=>{
          return obj.tempFilePath
        }) // tempFilePath
        // 上传所有图片到云存储
        filePath.forEach((item, idx)=>{
          let fileName = Date.now() + "_" + idx
          wx.showLoading({
            title: 'Uploading...',
          }) // 显示Loading提示
          wx.cloud.uploadFile({
            cloudPath: "multiple/" + fileName + ".jpg",
            filePath: item
          })
          .then(res=>{
            urlArr.push(res.fileID)
            // 当全部上传成功后再存到data中，前端才开始进行渲染，避免重复渲染消耗流量
            if (filePath.length == urlArr.length) {
              that.setData({
                urlArr
              })
            }
            wx.hideLoading()
          })
        })
      }
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
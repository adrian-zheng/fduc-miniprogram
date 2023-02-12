// pages/form/consent.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {

  },

  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setData({
      safeH: wx.getSystemInfoSync().screenHeight - app.globalData.navHeight ,
      navH: app.globalData.navHeight,
      deviceW: app.globalData.windowWidth,
      backHeight: (app.globalData.menuHeight) * 0.75,
      backPaddingTop: app.globalData.menuBot + 2,
      navbarUrl: "https://6664-fduc-4gvelrvtea694888-1311978484.tcb.qcloud.la/navPic/nav.png?sign=b0ae35bb1a75a4e915a853ef807bed3f&t=1654600813",
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})
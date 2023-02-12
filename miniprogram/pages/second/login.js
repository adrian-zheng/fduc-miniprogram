// pages/second/login.js
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

  // 点击登录
  onLogin() {
    let username = this.data.username
    let password = this.data.password
    console.log(username)
    console.log(password)
    wx.cloud.callFunction({
      name: 'upload2cloudDB',
      data: {
        funcName: 'login',
        username: username,
        password: password,
        openid: app.globalData.openid
      }
    }).then(res=>{
      let back = res.result.stats
      console.log(back)
      if (back.updated == 0) {
        wx.showToast({
          title: '账号或密码错误',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.setData({ showDialog: true })
      } 
    })

  },

  // 返回主页并重新加载小程序
  backHome() {
    console.log('return home')
    wx.reLaunch({
      url: '/pages/home/fduc',
    }).then(res=>{
      app.onLaunch()
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

})
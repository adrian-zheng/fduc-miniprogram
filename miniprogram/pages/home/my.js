// pages/home/my.js
import {getRehearsalData} from '../../utils.js'

const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUseGetUserProfile: false,
    signature: '',
  },

  /**
   * 查看个人信息
   */
  viewProfile(e) {
    wx.navigateTo({
      url: `../form/form?firstLog=false`
    })
  },

  /**
   * 团员管理
   */
  managePeople() {
    wx.navigateTo({
      url: `../second/peopleManage`
    })
  },

  onIssue() {
    wx.navigateTo({
      url: `../second/issue`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      role: app.globalData.userData.role,
      navH: app.globalData.navHeight,
      deviceW: app.globalData.windowWidth,
      navbarUrl: app.globalData.navbarUrl,
      safeH: wx.getSystemInfoSync().safeArea.height - 43 - 44,
      uD: app.globalData.userData,
      uDlength: Object.keys(app.globalData.userData).length,
    })
    console.log('this.data.uD.name.substring(0,2):', this.data.uD.name.substring(0,2))
    console.log('Object.keys(this.data.uD).length:', Object.keys(this.data.uD).length)
    if (Object.keys(this.data.uD).length > 1) {
      if (this.data.uD.name.substring(0,2) == "陈瑜") {
        this.setData({ ifCY: true })
      }
    }
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
    this.getTabBar().init('my')
    this.setData({
      check: app.globalData.checkedRehearsal,
      all: app.globalData.allRehearsal
    })

    db.collection("rehearsal").where({
      sem: app.globalData.curSemester
    }).get().then(res=>{
      const rehearsalData = Object.values(res.data)

      // 处理数据 ../../utils.js中的getRehearsalData函数，传入参数：userName和原始数据rehearsalData
      const rehearsal = getRehearsalData(app.globalData.userData.name, rehearsalData)
      console.log('rehearsal @rehearsal:', rehearsal)
      this.setData({
        rehearsal: rehearsal, // 存入data中
        all: rehearsal.length,
        check: rehearsal.filter(item => item.status == "check").length
      })
    })
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


})
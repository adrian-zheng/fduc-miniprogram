// pages/home/people.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onPreviewImage(e) {
    console.log(e)
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的 http 链接
      urls: [ url ] // 需要预览的图片 http 链接列表
    })
  },

  // 给声部列表排序
  sortPeople(a, b) {
    const map1 = new Map()
    map1.set('春', 1)
    map1.set('秋', 2)
    
    let v1_1 = Number(a.register[1])
    let v2_1 = Number(b.register[1])
    let v1_2 = Number(a.inChoirTime[0])
    let v2_2 = Number(b.inChoirTime[0])
    let v1_3 = map1.get(a.inChoirTime[1])
    let v2_3 = map1.get(b.inChoirTime[1])
    if (v1_1 != v2_1) return v1_1 - v2_1;
    if (v1_2 != v2_2) return v1_2 - v2_2;
    if (v1_3 != v2_3) return v1_3 - v2_3;
    return a.name.localeCompare(b.name)
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
      safeH: wx.getSystemInfoSync().safeArea.height - 144,
      uD: app.globalData.userData
    })
    
  },

  onClick(event) {
    if (event.detail.index == 4) {
      let bdays = this.data.sBirth.concat(this.data.aBirth,
        this.data.tBirth, this.data.bBirth)
      let bday = bdays.filter(value => value !== undefined)
      console.log('births: ', bday)
      let birthdays = bday.sort(function(a, b){
        return a.birthday - b.birthday
      })
      this.setData({
        birthdays: birthdays.filter(item => item.role > 0),
        curYear: Number(new Date().getFullYear())
      })
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
    this.getTabBar().init('people')
    // if (typeof this.getTabBar === 'function' &&
    //   this.getTabBar()) {
    //   this.getTabBar().setData({
    //     active: 3
    //   })
    // }
    let curMonth = new Date().getMonth() + 1
    // let curMonth = 1
    let regBirthday = new RegExp('\\d{4}年' + curMonth + '月\\d{1,2}日')
    console.log(regBirthday)
    function filterBirthday(data) {
      return data.filter(item=> {
        if(regBirthday.test(item.birthdayString)) {
          return true
        }
      })
    }
    
    // let obj = {
    //   birthdayString: /\d{4}年${curMonth}月\d{1,2}日/
    // }
    wx.cloud.callFunction({
      name: "getData",
      data: {
        dbName: 'fducers',
        register: "A",
      }
    })
    .then(res=>{
      // 跳转到成功界面
      console.log('get a-data success')
      console.log(res)
      let aD = res.result.data.sort(this.sortPeople)
      this.setData({
        aData: aD.filter(item => item.role > 0),
        aBirth: filterBirthday(aD)
      })
      console.log('aBirth:', filterBirthday(this.data.aData))
    })
    wx.cloud.callFunction({
      name: "getData",
      data: {
        dbName: 'fducers',
        register: "T",
      }
    })
    .then(res=>{
      // 跳转到成功界面
      console.log('get T-data success')
      console.log(res)
      let tD = res.result.data.sort(this.sortPeople)
      this.setData({
        tData: tD.filter(item => item.role > 0),
        tBirth: filterBirthday(tD)
      })
      console.log('tBirth:', filterBirthday(this.data.tData))
    })
    wx.cloud.callFunction({
      name: "getData",
      data: {
        dbName: 'fducers',
        register: "B",
      }
    })
    .then(res=>{
      // 跳转到成功界面
      console.log('get B-data success')
      console.log(res)
      let bD = res.result.data.sort(this.sortPeople)
      this.setData({
        bData: bD.filter(item => item.role > 0),
        bBirth: filterBirthday(bD)
      })
      console.log('bBirth:', filterBirthday(this.data.bData))
    })
    wx.cloud.callFunction({
      name: "getData",
      data: {
        dbName: 'fducers',
        register: "S",
      }
    })
    .then(res=>{
      // 跳转到成功界面
      console.log('get S-data success')
      console.log(res)
      let sD = res.result.data.sort(this.sortPeople)
      this.setData({
        sData: sD.filter(item => item.role > 0),
        sBirth: filterBirthday(sD)
      })
      console.log('sBirth:', filterBirthday(this.data.sData))
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
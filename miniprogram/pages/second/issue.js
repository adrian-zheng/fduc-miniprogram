// pages/second/issue.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    issueContent: '',
    allData: {
      '2021spring': [
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
      ],
      '2021fall': [
        [0, 'zzy', 'T2', 'aaaca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560'],
        [0, 'hyk', 'B1', '我是当用户点击登录账号解绑（登出）时，想重新加载需要登录才能访问的页面，我目前是在onload里读取绑定的缓存，没有读到登录信息的缓存，则去云数据库查询绑定信息，也没有，再弹出绑定提醒。我是初学，onload是在何时会重新onload？是不是我点击登出，不一定会重新onload？看上面的解决方案是不是用wx.reLaunch(Object object)这个来跳转到一个不需要登录即可访问的页面即可，我有这种页面'],
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
      ],
      '2022spring': [
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
      ],
      '2022fall': [
        [0, 'zzy', 'T2', 'aaaca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560ca780ad562f2c2c010992cee2c41b560'],
        [0, 'hyk', 'B1', '我是当用户点击登录账号解绑（登出）时，想重新加载需要登录才能访问的页面，我目前是在onload里读取绑定的缓存，没有读到登录信息的缓存，则去云数据库查询绑定信息，也没有，再弹出绑定提醒。我是初学，onload是在何时会重新onload？是不是我点击登出，不一定会重新onload？看上面的解决方案是不是用wx.reLaunch(Object object)这个来跳转到一个不需要登录即可访问的页面即可，我有这种页面'],
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
        [0, 'zzy', 'T2', 'aaa'],
        [0, 'hyk', 'B1', 'bbb'],
      ],
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setData({
      role: app.globalData.userData.role,
      name: app.globalData.userData.name,
      safeH: app.globalData.windowHeight - app.globalData.navHeight,
      navH: app.globalData.navHeight,
      deviceW: app.globalData.windowWidth,
      backHeight: (app.globalData.menuHeight) * 0.75,
      backPaddingTop: app.globalData.menuBot + 2,
      navbarUrl: "https://6664-fduc-4gvelrvtea694888-1311978484.tcb.qcloud.la/navPic/nav.png?sign=b0ae35bb1a75a4e915a853ef807bed3f&t=1654600813",
    })
  },

  // 返回上一页
  back() {
    // var pages = getCurrentPages();
    // var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    // prevPage.setData({
    //   value1: this.data.value1,
    //   value2: this.data.value2,
    // })
    wx.navigateBack({
      delta: 1,
    })
  },

  // 提交问题
  submitIssue() {
    let curSem = app.globalData.curSemester
    // 切换学期为英文，对应数据库中字段
    if (curSem.substring(4) == "秋") {
      let sem = curSem.substring(0,4) + 'fall'
      console.log(sem)
      this.setData({ sem: sem })
    } else {
      let sem = curSem.substring(0,4) + 'spring'
      console.log(sem)
      this.setData({ sem: sem })
    }

    // 生成问题数据submitData [姓名, 声部, 问题]
    let name = app.globalData.userData.name
    let register = app.globalData.userData.register[0] + app.globalData.userData.register[1]
    let submitContent = this.data.issueContent
    let submitData = [name, register, submitContent]
    console.log(submitData)

    // 调用云函数上传数据
    wx.cloud.callFunction({
      name: 'upload2cloudDB',
      data: {
        funcName: 'submitIssue',
        sem: this.data.sem,
        data: submitData
      }
    }).then(res=>{
      console.log(res)
      console.log('Issue submitted!')
      this.setData({ 
        issueContent: '',
        ifEmpty: false, // 显示反馈
      })
      wx.showToast({
        title: '提交成功',
        icon: 'none',
        duration: 2000
      })
      this.onShow() // 重新加载页面，显示刚提交的数据
    }).catch(fail=>{
      console.log(fail)
      wx.showToast({
        title: '提交失败',
        icon: 'none',
        duration: 2000
      })
    })
  },


  // 时间降序
  sortNew(a, b) {
    const map2 = new Map()
    map2.set('spring', 1)
    map2.set('fall', 2)
    let v1_2 = Number(a.substring(0,4))
    let v2_2 = Number(b.substring(0,4))
    let v1_3 = map2.get(a.substring(4))
    let v2_3 = map2.get(b.substring(4))
    if (v1_2 != v2_2) return v2_2 - v1_2;
    return v2_3 - v1_3;
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
    // if ( this.data.role > 1 ) {
      wx.cloud.callFunction({
        name: 'getData',
        data: {
          dbName: 'assorted',
          mode: 'issue',
        }
      }).then(res=>{
        console.log(res.result.data[0].records)
        let orgData = res.result.data[0].records
        let allDataSort = Object.keys(orgData).sort(this.sortNew)
        let aD = Object()
        for (let index in allDataSort) {
          aD[allDataSort[index]] = orgData[allDataSort[index]].reverse()
        }
        let finalAD = Object()
        let memberAD = Object()
        let aDkeys = Object.keys(aD)
        let yourCount = 0
        let allCount = 0
        for (let index in aDkeys) {
          if (aDkeys[index].substring(4) == "fall") {
            finalAD[aDkeys[index].substring(0,4) + '秋'] = aD[aDkeys[index]]
            let memberArr = aD[aDkeys[index]].filter(x=>x[1] == this.data.name)
            memberAD[aDkeys[index].substring(0,4) + '秋'] = memberArr
            yourCount = yourCount + memberArr.length
            allCount = allCount + aD[aDkeys[index]].length
          } else {
            finalAD[aDkeys[index].substring(0,4) + '春'] = aD[aDkeys[index]]
            let memberArr = aD[aDkeys[index]].filter(x=>x[1] == this.data.name)
            memberAD[aDkeys[index].substring(0,4) + '春'] = memberArr
            yourCount = yourCount + memberArr.length
            allCount = allCount + aD[aDkeys[index]].length
          }
        }
        console.log(yourCount)
        this.setData({ 
          finalAD:  finalAD,
          memberAD: memberAD, 
        })
        if (yourCount == 0) {
          this.setData({ ifEmpty: true })
        }
        if (allCount == 0) {
          this.setData({ ifAllEmpty: true })
        }
      })
    // }
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
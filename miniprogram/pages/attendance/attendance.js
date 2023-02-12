// pages/attendance/attendance.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeWord: '',
    checkedMsg: '未签到',
    checkedIcon: 'warning-o',
    checkedIconColor: '#b15373',
    safeH: wx.getSystemInfoSync().safeArea.height - 43 - 44,
    activeKey: 0,
    ifCreator: false,
    leaveReason: ''
  },
  
  /**
   * 返回上一页
   */
  back() {
    wx.navigateBack({
      delta: 2,
    })
  },


  /**
   * 切换sidebar
   */
  onChange(event) {
    console.log("activeKey:", event.detail)
    this.setData({
      activeKey: event.detail
    })
  },

  /**
   * 验证口令是否正确
   */
  checkCodeword(e) {
    const correct = this.data.rehearsal[0].cw
    let input = this.data.codeWord
    // 签到口令正确
    if (input === correct) {
      this.setData({ checked: true })
      wx.showLoading({
        title: '签到中',
        mask: true
      })
      let reg1 = app.globalData.userData.register[0]
      let reg2 = app.globalData.userData.register[1]
      let name = app.globalData.userData.name
      let curAttendance = [reg1, reg2, name]
      console.log("curAttendance:", curAttendance)
      // 将签到数据上传到云数据库
      wx.cloud.callFunction({
        name: "updateAttendanceData",
        data: {
          dbName: "rehearsal",
          toWhich: "list", 
          where: { codeWord: correct },
          upData: [curAttendance] 
        }
      })
      .then(res=>{
        // 跳转到成功界面
        const curTime = new Date().toTimeString().substring(0,8)
        curAttendance.unshift({})
        curAttendance.push(curTime)
        console.log("processed curAttendance:", curAttendance)
        console.log('签到成功')
        console.log(res)
        this.setData({
          // 签到完成后，显示签到记录
          hideRanking: false,
          showRecord: true,
          checkedMsg: '已签到',
          checkedIcon: 'passed',
          checkedIconColor: '#5ba585'
        })
        this.data.rehearsal[0].list.push(curAttendance)
        this.setData({
          rehearsal: this.data.rehearsal
        })
        if (curAttendance[1] == "S") {
          this.data.rankingS.push(curAttendance)
          this.setData({
            rankingS: this.data.rankingS
          })
        } else if (curAttendance[1] == "A") {
          this.data.rankingA.push(curAttendance)
          this.setData({
            rankingA: this.data.rankingA
          })
        } else if (curAttendance[1] == "T") {
          this.data.rankingT.push(curAttendance)
          this.setData({
            rankingT: this.data.rankingT
          })
        } else if (curAttendance[1] == "B") {
          this.data.rankingB.push(curAttendance)
          this.setData({
            rankingB: this.data.rankingB
          })
        } else { // do nothing
        }
        wx.hideLoading()
        wx.showToast({
          title: "签到成功",
          icon: 'none',
          duration: 2000
        })
      })
      .catch(console.error)
    // 签到口令错误
    } else {
      console.log("false")
      wx.showToast({
        title: "口令错误",
        icon: 'none',
        duration: 2000
      })
      console.log('签到失败')
    }
  },

  // 提交请假申请
  submitReason() {
    let reason = this.data.leaveReason // 获取用户输入的请假理由
    // 判断请假理由是否为空
    // 为空的话提示不能为空
    if (reason == '') {
      wx.showToast({
        title: "请假理由不能为空",
        icon: 'none',
        duration: 2000
      })
    // 不为空的话，上传数据到数据库
    } else {
      wx.showLoading({
        title: '请假中',
        mask: true
      })
      console.log(this.data.rehearsal)
      const correct = this.data.rehearsal[0].cw // 获取当前排练的签到口令
      console.log("correct:", correct)

      // 获取当前用户的声部、姓名
      let reg1 = app.globalData.userData.register[0]
      let reg2 = app.globalData.userData.register[1]
      let name = app.globalData.userData.name
      let reason = this.data.leaveReason
      // 上传数据格式：[大声部, 小声部, 姓名, 请假理由]
      let curLeave = [reg1, reg2, name, reason]
      console.log("curLeave:", curLeave)

      // 调用云函数上传
      wx.cloud.callFunction({
        name: "updateAttendanceData",
        data: {
          dbName: "rehearsal", // 数据库名为“rehearsal”
          toWhich: "leave", // 更新字段为“leave”
          where: { codeWord: correct, list: [], }, // 检索口令为正确口令、签到记录为空的那条签到
          upData: [curLeave], // 上传的数据
        }
      }).then(res=>{ // 成功后执行
        // 获取当前时间，格式为“xx月xx日 xx:xx:xx”
        let timeString = String(new Date().getMonth() + 1) + '月' + 
        String(new Date().getDate()) + '日 ' + 
        new Date().toTimeString().substring(0,8)

        this.setData({
          showLeave: false, // 不显示请假
          checkedMsg: '已请假',
          checkedIcon: 'records',
          checkedIconColor: '#c69464',
          leaveTime: timeString
        })
        wx.hideLoading()
        let page = getCurrentPages().pop()
        page.onShow()
      })
    }
  },

  /**
   * 撤销请假
   */
  revokeLeave(e) {
    console.log('revoking')
    let page = getCurrentPages().pop()
    page.onShow()
    const correct = this.data.rehearsal[0].cw // 获取当前排练的签到口令
    let allLeave = this.data.leave_w_null
    // console.log('leaveInfo: ', leaveInfo)
    for (let index in allLeave) {
      if (allLeave[index] == null) {
      } else if (allLeave[index][3] == this.data.userName) {
        this.setData({ upIndex: index })
        console.log('upIndex:', index)
      }
    }

    // 调用云函数上传
    wx.cloud.callFunction({
      name: "updateAttendanceData",
      data: {
        dbName: "rehearsal", // 数据库名为“rehearsal”
        toWhich: "delLeave", // 更新字段为“leave”
        where: { codeWord: correct, list: [], }, // 检索口令为正确口令、签到记录为空的那条签到
        upData: this.data.upIndex, // 上传的数据
      }
    }).then(res=>{ // 成功后执行
      console.log('sucess:', res)
      this.setData({
        showLeave: true,
        checkedMsg: '未签到',
        checkedIcon: 'warning-o',
        checkedIconColor: '#b15373',
        checked: false,
        leaveReason: ''
      })
      // 后操作，删除null字段
      wx.cloud.callFunction({
        name: "updateAttendanceData",
        data: {
          dbName: 'rehearsal',
          toWhich: 'postDelLeave',
          where: { codeWord: correct, list: [], },
          upData: null,
        }
      }).then(res2=>{
        console.log('res2:', res2)
      })
    }).catch(fail=>{
      console.log('fail:',fail)
    })
  },

  /**
   * 显示请假理由
   */
  showReason(e) {
    console.log(e)
    let reason = e.currentTarget.dataset.reason // 获取当前点击的请假理由
    let name = e.currentTarget.dataset.name
    
    // 如果是骨干，显示action-sheet
    if (this.data.globalRole > 1) {
      this.setData({
        showLeaveReason: true,
        curLeaveName: '请假理由 | ' + name,
        leaveReason: reason
      })
    }
  },

  /**
   * 关闭请假理由action-sheet
   */
  onCloseLeaveReason() {
    this.setData({
      showLeaveReason: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('nav2url @att:', app.globalData.navbar2Url)
    this.setData({
      navH: app.globalData.navHeight,
      deviceW: app.globalData.windowWidth,
      backHeight: (app.globalData.menuHeight) * 0.75,
      backPaddingTop: app.globalData.menuBot + 2,
      navbarUrl: "https://6664-fduc-4gvelrvtea694888-1311978484.tcb.qcloud.la/navPic/nav.png?sign=b0ae35bb1a75a4e915a853ef807bed3f&t=1654600813"
    })
    
    // 获取用户点击的考勤记录的日期
    const date1 = options
    console.log("date1:", date1)

    this.setData({
      year: Number(options.year), 
      month: Number(options.month),
      day: Number(options.day),
      hour: Number(options.hour),
      minute: Number(options.minute),
      second: Number(options.second),
      showLeave: JSON.parse(options.showLeave),
      remain: Number(options.remain),
      role: options.role,
      globalRole: app.globalData.userData.role,
    })

    if (this.data.role == "admins") {
      this.setData({
        hideRanking: false,
        showRecord: true,
        activeKey: 5,
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
    // 获取上一页的考勤数据
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    const rehearsal = prevPage.data.rehearsal
    // 筛选出当前点击的时间对应的考勤记录curRehearsal
    const curRehearsal = rehearsal.filter(item=> item.year === this.data.year && item.month === this.data.month 
      && item.day === this.data.day && item.hour === this.data.hour && item.minute === this.data.minute 
      && item.second === this.data.second)
    console.log('rehearsal_all:', rehearsal)
    console.log("curRehearsal:", curRehearsal)
    
    // 判断是否开始签到，未开始的话不展示签到记录
    const now = new Date()
    if (this.data.role == "admins") {
    } else {
      if (now < curRehearsal[0].end) {
        this.setData({
          showRecord: false
        }) 
      } else {
        this.setData({
          showRecord: true
        }) 
      }
    }
    

    // 获取各声部的排名
    const ranking = curRehearsal[0].list
    console.log("ranking:", ranking)
    const rankingS = ranking.filter(x => x[1] === "S")
    const rankingA = ranking.filter(x => x[1] === "A")
    const rankingT = ranking.filter(x => x[1] === "T")
    const rankingB = ranking.filter(x => x[1] === "B")
    console.log("S:", rankingS)
    console.log("A:", rankingA)
    console.log("T:", rankingT)
    console.log("B:", rankingB)

    // 获取请假名单
    const leave = curRehearsal[0].leave
    console.log("leave:", leave)
    const leave_w_null = curRehearsal[0].leave_w_null
    console.log("leave_w_null:", leave_w_null)

    
    // 获取当前考勤的开始、结束时间
    const startTime = new Date(curRehearsal[0].date).toTimeString().substring(0,5)
    const endTime = new Date(curRehearsal[0].end).toTimeString().substring(0,5)
    console.log(startTime)
    console.log(endTime)

    // 判断是否为创建者和管理员
    if (curRehearsal[0].creator == app.globalData.openid && app.globalData.userData.role == 2) {
      this.setData({
        ifCreator: true
      })
    }
    // 将上述信息存到data中
    this.setData({
      rehearsal: curRehearsal,
      rankingS: rankingS,
      rankingA: rankingA,
      rankingT: rankingT,
      rankingB: rankingB,
      leave: leave,
      leave_w_null: leave_w_null,
      startTime: startTime,
      endTime: endTime,
      strhour: String(this.data.hour).padStart(2, '0'),
      strMinute: String(this.data.minute).padStart(2, '0'),
      strsecond: String(this.data.second).padStart(2, '0')
    })

    // 判断是否隐藏签到记录和输入框
    let status = curRehearsal[0].status
    console.log('status:', status)
    // 签到结束的话，显示签到记录，隐藏输入框
    if (curRehearsal[0].ifNow == 1) {
      this.setData({
        hideRanking: false,
        showRecord: true
      })
    // 在签到的话
    } else if (curRehearsal[0].ifNow == 0) {
      // 已签到的话，显示签到记录，隐藏输入框
      if (status == 'check') {
        this.setData({
          hideRanking: false,
          showRecord: true
        })
      // 未签到的话，隐藏签到记录，显示输入框、计算倒计时时间
      } else {
        // 请过假的话
        if (status == 'leave') {
          this.setData({
            hideRanking: false,
            showRecord: false
          })
        // 没请过假的话
        } else {
          const nowTime = new Date().getTime()
          const ddl = curRehearsal[0].end.getTime()
          console.log((ddl - nowTime)/(1000 * 60 * 60))
          this.setData({
            countDown: ddl - nowTime,
            hideRanking: true,
            showRecord: false
          })
        }
      }
    // 签到未开始的话，隐藏签到记录，隐藏输入框，显示签到结果
    } else {
      if (this.data.role == "admins") {
      } else {
        // 请过假的话
        if (status == 'leave') {
          this.setData({
            hideRanking: false,
            showRecord: false,
            showRevoke: true
          })
        // 未请假的话
        } else {
        }
      }
      
    }
    console.log("hideRanking:", this.data.hideRanking)
    
    // 判断当前用户签到状态
    // const nameList = curRehearsal[0].list.map(item=>item[3])
    const userName = app.globalData.userData.name
    console.log("userName:", userName)
    this.setData({
      userName: userName
    })
    if (userName.substring(0,2) == "陈瑜") {
      this.setData({ ifCY: true })
    }

    // 已签到
    if (curRehearsal[0].status == 'check') {
      this.setData({
        checked: true,
        checkedMsg: '已签到',
        checkedIcon: 'passed',
        checkedIconColor: '#5ba585'
      }) 
    // 未签到
    } else if (curRehearsal[0].status == 'leave') {
      const reason = curRehearsal[0].leave.filter(item=>item[3] == userName)[0][4]
      const leaveTime = curRehearsal[0].leave.filter(item=>item[3] == userName)[0][5]
      console.log('reason1:', reason)
      this.setData({
        checked: true,
        checkedMsg: '已请假',
        checkedIcon: 'records',
        checkedIconColor: '#c69464',
        leaveReason: reason,
        leaveTime: leaveTime
      }) 
    } else {
      this.setData({
        checked: false
      })
    }

    
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
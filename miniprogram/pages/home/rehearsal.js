// pages/home/rehearsal.js
import {getRehearsalData} from '../../utils.js'

const app = getApp()
const db = wx.cloud.database()
const _ = db.command


Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    hideAdmin: true,
    safeH: 0,
    safeHscore: wx.getSystemInfoSync().safeArea.height - 94,
    rehearsal: [],
    showStart: false,
    start: new Date().getTime(),
    startString: '点击选择',
    minDate: new Date().getTime(),
    maxDate: new Date(Date.now()+ 6 * 30 * 24 * 60 * 60 * 1000).getTime(),
    showDuration: false,
    duration: '点击选择',
    durations: {
      '5分钟': 5 * 60 * 1000, 
      '10分钟': 10 * 60 * 1000, 
      '30分钟': 30 * 60 * 1000, 
      '1小时': 60 * 60 * 1000, 
      '1.5小时': 90 * 60 * 1000, 
      '2小时': 120 * 60 * 1000,
      '3小时': 180 * 60 * 1000,
    },
    durationArr: ['5分钟', '10分钟', '30分钟', '1小时', '1.5小时', '2小时', '3小时'],
    code: '',
    loading: false,
    scorePath: "cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/scores/",

    // 导出考勤记录为Excel相关数据
    showMenu: false,
    showSems: false,
    excelName: 'FDUC考勤记录',
    excelPath: 'cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/excel/',
    selectAll: false,
  },

  cancelThis(e) {
    let scorename = e.currentTarget.dataset.scorename
    console.log(scorename)
    console.log('cancelThis')
    wx.cloud.callFunction({
      name: "upload2cloudDB",
      data: {
        funcName: 'weekRelated',
        which: 'cancel',
        scorename: scorename
      }
    }).then(res=>{
      this.onLoad()
    })
  },

  setThis(e) {
    console.log('setThis')
    let scorename = e.currentTarget.dataset.scorename
    console.log(scorename)
    wx.cloud.callFunction({
      name: "upload2cloudDB",
      data: {
        funcName: 'weekRelated',
        which: 'set',
        scorename: scorename
      }
    }).then(res=>{
      console.log(res)
      this.onLoad()
    })
  },


  onChangeTab(event) {
    console.log(event.detail.name)
    this.setData({ active: event.detail.name })
  },

  /**
   * 选择考勤开始时间
   */
  showStart() {
    this.setData({ showStart: true });
  },

  closeStart() {
    this.setData({ showStart: false });
  },

  onStart(event) {
    let start = new Date(event.detail)
    let year = start.getFullYear()
    let month = start.getMonth() + 1
    let day = start.getDate()
    let timeString = start.toTimeString().substring(0,8)
    this.setData({
      start: event.detail,
      startString: `${year}年${month}月${day}日 ${timeString}`,
      showStart: false
    })
  },

  /**
   * 选择考勤持续时间
   */
  showDuration() {
    this.setData({ showDuration: true });
  },

  closeDuration() {
    this.setData({ showDuration: false });
  },

  onDuration(event) {
    this.setData({
      duration: event.detail.value,
      showDuration: false
    })
  },

  /**
   * 上传新建的考勤记录到云数据库
   */
  submitData(e) {
    if (this.data.startString == '点击选择') {
      wx.showToast({
        title: '开始时间不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.duration == '点击选择') {
      wx.showToast({
        title: '持续时间不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.code == '') {
      wx.showToast({
        title: '签到口令不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      console.log("start:", this.data.start)
      console.log(this.data.start + this.data.durations[this.data.duration])
      console.log(this.data.code)
      const openid = app.globalData.openid
      let values = {
        date: this.data.start,
        endTime: this.data.start + this.data.durations[this.data.duration],
        codeWord: this.data.code,
        list: [],
        creator: openid,
        leave: [],
        sem: this.data.curSem,
      }
      console.log(values)
      // 将数据上传到云数据库
      wx.cloud.callFunction({
        name: "upload2cloudDB",
        data: {
          funcName: "submitDataRehearsal",
          values: values,
          dbName: "rehearsal"
        }
      })
      .then(res=>{
        // 跳转到成功界面
        console.log('upload new Att success')
        console.log(res)
        this.setData({
          startString: '点击选择',
          duration: '点击选择',
          code: ''
        })

        let page = getCurrentPages().pop()
        page.onShow()
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '创建成功',
          icon: 'none',
          duration: 2000
        })
        // this.setData({
        //   showDialog: true
        // })
      })
      .catch(console.error)
    }
  },

  /**
   * 导出考勤数据Excel
   */
  // 点击出现选项
  chooseGenExcelOptions() {
    console.log('generating excel')
    this.setData({
      showMenu: true,
      // personsList: this.data.peopleData.map(x => {return x.name}),
      // resultPersonsList: this.data.peopleData.map(x => {return x.name}),
      // personsCount: this.data.peopleData.map(x => {return x.name}).length,
    });
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        dbName: 'rehearsal',
      }
    }).then(res=>{
      console.log('res:', res)
      let allRD = res.result.data
      
      let sems = Array.from(new Set(allRD.map(x=>x.sem))).sort(this.sortNew)
      console.log('sems:', sems)
      this.setData({ 
        allRD: allRD,
        semsList: sems,
        resultSemsList: [ sems[0] ],
        semsCount: 1,
      })

    })
  },

  // 时间降序
  sortNew(a, b) {
    const map2 = new Map()
    map2.set('春', 1)
    map2.set('秋', 2)
    let v1_2 = Number(a.substring(0,4))
    let v2_2 = Number(b.substring(0,4))
    let v1_3 = map2.get(a.substring(4))
    let v2_3 = map2.get(b.substring(4))
    if (v1_2 != v2_2) return v2_2 - v1_2;
    if (v1_3 != v2_3) return v2_3 - v1_3;
    return b.name.localeCompare(a.name)
  },

  // 点击外侧关闭选项页面
  onClickHideMenu() {
    this.setData({ showMenu: false });
    console.log('outer tap')
  },
  noop() {},

  // 点击出现选择学期菜单
  chooseSem() {
    this.setData({ showSems: true })
  },
  // 点击外侧关闭学期选择页面
  onClickHideSems() {
    this.setData({ showSems: false });
    console.log('outer tap')
  },

  // 全选/全不选切换
  onSelectAll(event) {
    this.setData({
      selectAll: event.detail,
    });
  
    if (this.data.selectAll) {
      this.setData({
        resultSemsList: this.data.semsList,
        semsCount: this.data.semsList.length,
      })
    } else {
      this.setData({
        resultSemsList: [],
        semsCount: 0,
      })
    }
  },

  // 学期复选框数据记录
  onChangeSems(event) {
    console.log('onChangeSems:', event.detail)
    this.setData({
      resultSemsList: event.detail,
      semsCount: event.detail.length,
    });
  },
  toggle(event) {
    console.log(event.currentTarget.dataset)
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    console.log(checkbox)
    checkbox.toggle();
  },

  // 时间顺序排序
  sortDate(a,b) {
    let aS = Date.parse(a.date)
    let bS = Date.parse(b.date)
    return aS - bS
  },
  
  // 声部列表默认排序
  sortPeople(a, b) {
    const map1 = new Map()
    map1.set('S', 1)
    map1.set('A', 2)
    map1.set('T', 3)
    map1.set('B', 4)
    const map2 = new Map()
    map2.set('春', 1)
    map2.set('秋', 2)
    let v1_0 = map1.get(a.register[0])
    let v2_0 = map1.get(b.register[0])
    let v1_1 = Number(a.register[1])
    let v2_1 = Number(b.register[1])
    let v1_2 = Number(a.inChoirTime[0])
    let v2_2 = Number(b.inChoirTime[0])
    let v1_3 = map2.get(a.inChoirTime[1])
    let v2_3 = map2.get(b.inChoirTime[1])
    if (v1_0 != v2_0) return v1_0 - v2_0;
    if (v1_1 != v2_1) return v1_1 - v2_1;
    if (v1_2 != v2_2) return v1_2 - v2_2;
    if (v1_3 != v2_3) return v1_3 - v2_3;
    return a.name.localeCompare(b.name)
  },

  // 生成Excel
  genExcel() {
    // 获取人员名单
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        dbName: 'fducers',
      }
    }).then(res=>{
      console.log('error!!!:',res)
      let allPD = res.result.data.filter(x=>x.name.substring(0,2)!='陈瑜').sort(this.sortPeople)
      this.setData({allPD: allPD})
      // console.log(allPD)

      let dataPack = [] // 所有数据
      // 遍历要导出的每一张表，得到相应的数据
      for (let key in this.data.resultSemsList) {
        let alldata = []

        let filRD = this.data.allRD.filter(item=> item.sem == this.data.resultSemsList[key]).sort(this.sortDate)
        console.log('filRD:', filRD)
        // 写入表头字段
        let row = filRD.map(x=>x.date.substring(0,4) + '/' + x.date.substring(5,7) + '/' + x.date.substring(8,10))
        let midRow = ['注：1:参加；0:请假；-1:缺席', '声部', '入团时间', '校区'].concat(row)
        let fullRow = midRow.concat(['SUM'])
        console.log('fullRow:', fullRow)
        alldata.push(fullRow)

        // 遍历每个人
        let allPD = this.data.allPD
        for (let people in allPD) {
          let arr = []
          let curName = allPD[people].name
          // console.log('curName:', curName)
          arr.push(allPD[people].name) // 写入姓名
          arr.push(allPD[people].register[0] + allPD[people].register[1]) // 写入声部
          arr.push(allPD[people].inChoirTime[0] + allPD[people].inChoirTime[1]) // 写入入团时间
          arr.push(allPD[people].campus) // 写入校区


          // 遍历每次排练
          for (let date in filRD) {
            let attList = filRD[date].list.map(x=>x[3])
            let leaveList = filRD[date].leave.map(x=>x[3])
            // console.log('att:', attList)
            // console.log('leave:', leaveList)
            if (attList.includes(curName)) {
              arr.push(1)
            } else if (leaveList.includes(curName)) {
              arr.push(0)
            } else {
              arr.push(-1)
            }
          }
          arr.push(arr.slice(4).reduce((pv, cv) => pv + cv, 0)) // 写入sum
          alldata.push(arr) // 每个人的数据加入alldata
        }
        console.log('alldata:', alldata)
        
        dataPack.push({
          name: this.data.resultSemsList[key],
          data: alldata
        })
      }
      console.log('dataPack:', dataPack)

      let fileName = this.data.excelName + '.xlsx'
      // 调用云函数genExcel生成excel
      wx.cloud.callFunction({
        name: 'genExcel',
        data: {
          excelName: fileName,
          alldata: dataPack
        } 
      }).then(res=>{
        console.log("generating excel success!")
        const fSM = wx.getFileSystemManager()
        let fileID = this.data.excelPath + fileName
        console.log('fileID:', fileID)
        wx.showLoading({
          title: '打开Excel中',
          mask: true
        })
        // 从云存储空间下载文件（fileID）
        wx.cloud.downloadFile({
          fileID: fileID,
        })
        .then(res=>{
          this.setData({ showMenu: false })
          let fileName = fileID.substring(fileID.lastIndexOf("/") + 1)
          let filePath = wx.env.USER_DATA_PATH + "/" + fileName
          // 将文件存储到用户本地目录中，为了最终能显示原文件名
          fSM.saveFile({
            tempFilePath: res.tempFilePath,
            filePath: filePath,
            success(res){
              let savedPath = res.savedFilePath   
              // 打开excel
              wx.openDocument({
                filePath: savedPath,
                showMenu: true,
              })
              wx.hideLoading()
              
            }
          })
        })
      })

    })


    
  },


  /**
   * 尚未开始提示
   */
  showLeaveOrYet2Begin(e) {
    const ds = e.currentTarget.dataset
    const openid = app.globalData.openid
    const creator = ds.creator
    // 1992/02/12 12:23:22+0800
    const start = Date.parse(ds.year + '/' + ds.month + '/' + ds.day + ' ' + ds.time + '+0800')
    const threshold = start - (3 * 60 * 60 * 1000)
    const now = new Date().getTime()
    const remain = threshold - now
    console.log("now", now)
    console.log("threshold", threshold)
    console.log("check", (threshold - now) / (1000 * 60 * 60))
    
    // 已经请假
    if (ds.status == 'leave') {
      wx.navigateTo({
        url: `../attendance/attendance?showLeave=false&remain=${remain}&year=${ds.year}&month=${ds.month}&day=${ds.day}&hour=${ds.hour}&minute=${ds.minute}&second=${ds.second}`
      })
    // 尚未请假
    } else {
      // 可以请假的话
      if (now < threshold) {
        wx.navigateTo({
          url: `../attendance/attendance?showLeave=true&remain=${remain}&year=${ds.year}&month=${ds.month}&day=${ds.day}&hour=${ds.hour}&minute=${ds.minute}&second=${ds.second}`
        })
      // 不可以请假的话
      } else {
        // 非管理员显示提示
        if (!creator == openid) {
          wx.showToast({
            title: '签到尚未开始',
            icon: 'none',
            duration: 3000
          })
        } else {}
      }
    }    
  },

  // 显示删除签到确认窗口
  showDeleteConfirm(e) {
    const ds = e.currentTarget.dataset
    console.log(ds)
    const values = {
      cw: ds.cw
    }
    this.setData({ 
      cwValues: values,
      showDeleteConfirm: true,
     })
  },

  cancelDelete() {
    this.setData({ showDeleteConfirm: false })
  },
  
  /**
   * 删除操作
   */
  deleteAtt(e) {
    const values = this.data.cwValues
    wx.cloud.callFunction({
      name: "deleteAttRecord",
      data: {
        values: values,
        dbName: "rehearsal"
      }
    }).then(res=>{
      console.log('删除成功')
      this.setData({
        showDeleteConfirm: false
      })
      let page = getCurrentPages().pop()
      page.onShow()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '删除成功',
        icon: 'none',
        duration: 2000
      })
    })
  },

  /**
   * 跳转到考勤页
   */
  showAttendance(e) {
    const ds = e.currentTarget.dataset
    wx.navigateTo({
      url: `../attendance/attendance?showLeave=false&year=${ds.year}&month=${ds.month}&day=${ds.day}&hour=${ds.hour}&minute=${ds.minute}&second=${ds.second}`
    })
  },

  /**
   * （考勤开始前）显示请假页
   */
  showLeaveData(e) {
    console.log('showing~~~')
    const ds = e.currentTarget.dataset
    wx.navigateTo({
      url: `../attendance/attendance?showLeave=false&year=${ds.year}&month=${ds.month}&day=${ds.day}
      &hour=${ds.hour}&minute=${ds.minute}&second=${ds.second}&role=admins`
    })
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
    this.setData({
      navH: app.globalData.navHeight,
      deviceW: app.globalData.windowWidth,
      navbarUrl: app.globalData.navbarUrl,
      role: app.globalData.userData.role,
      curSem: app.globalData.curSemester,
      userName: app.globalData.userData.name,
    })

    // 按照身份，筛选是否显示管理员功能
    if (app.globalData.userData.role == 2) {
      // CY的话设置ifCY为true并设置高度为全高度
      if (this.data.userName.substring(0,2) == '陈瑜') {
        this.setData({ 
          ifCY: true,
          safeH: wx.getSystemInfoSync().safeArea.height - 94
        })
      // 其他管理员的话则设置高度为半高
      } else {
        this.setData({
          hideAdmin: false,
          safeH: wx.getSystemInfoSync().safeArea.height - 94 - 217 - 20
        })
      }
    // 普通团员&骨干
    } else {
      this.setData({
        hideAdmin: true,
        safeH: wx.getSystemInfoSync().safeArea.height - 94
      })
    }

    wx.cloud.callFunction({
      name: "getData",
      data: {
        dbName: 'score',
      }
    })
    .then(res=>{
      let allscores = res.result.data
      let scoreRep = {}, scoreOpus = {}, scoreForeign = {}, scoreThis = {}
      for (let i in allscores) {
        let cur = allscores[i]
        if (cur['category'] == 'rep') {
          scoreRep[cur['name']] = cur['filename'] 
        } else if (cur['category'] == 'opus') {
          scoreOpus[cur['name']] = cur['filename'] 
        } else if (cur['category'] == 'foreign') {
          scoreForeign[cur['name']] = cur['filename'] 
        }
        if (cur['thisweek'] == 1) {
          scoreThis[cur['name']] = cur['filename'] 
        }
      }
      console.log('scoreRep:', scoreRep)
      console.log('scoreOpus:', scoreOpus)
      console.log('scoreForeign:', scoreForeign)
      console.log('scoreThis:', scoreThis)
      this.setData({
        scoreRep: scoreRep,
        scoreOpus: scoreOpus,
        scoreForeign: scoreForeign,
        scoreThis: scoreThis
      })
    })

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
    // 渲染tabbar
    this.getTabBar().init('rehearsal')

    
    
    // 从数据库获取当前学期考勤数据
    // 设置查询开始日期
    // const startDate = new Date('2022/3/1')
    const curSem = app.globalData.curSemester
    wx.cloud.callFunction({
      name: "getData",
      data: {
        dbName: 'rehearsal',
        curSem: curSem,
      }
    })
    .then(res=>{
      const rehearsalData = res.result.data

      // 处理数据 ../../utils.js中的getRehearsalData函数，传入参数：userName和原始数据rehearsalData
      const rehearsal = getRehearsalData(app.globalData.userData.name, rehearsalData)
      console.log('rehearsal @rehearsal:', rehearsal)
      this.setData({
        rehearsal: rehearsal // 存入data中
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
    let page = getCurrentPages().pop()
    page.onShow()
    wx.stopPullDownRefresh()
  },

  refreshList() {
    let page = getCurrentPages().pop()
    page.onShow()
    // wx.stopPullDownRefresh()
    this.setData({
      loading: false
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

})


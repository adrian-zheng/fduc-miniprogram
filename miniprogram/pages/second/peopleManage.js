// pages/second/peopleManage.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    option1: [
      { text: '已录入团员', value: 0 },
      { text: '未录入团员', value: 1 },
      { text: '修改信息团员', value: 2 },
      { text: 'S', value: 3 },
      { text: 'A', value: 4 },
      { text: 'T', value: 5 },
      { text: 'B', value: 6 },
      { text: '未确定', value: 7 },
    ],
    option2: [
      { text: '声部排序', value: 'a' },
      { text: '老人优先', value: 'b' },
      { text: '新人优先', value: 'c' },
      { text: '骨干优先', value: 'd' }
    ],
    value1: 0,
    value2: 'a',
    mapping: {
      0: 'formalPeople',
      1: 'newPeople',
      2: 'editPeople',
      3: 'sPeople',
      4: 'aPeople',
      5: 'tPeople',
      6: 'bPeople',
      7: 'unknownPeople',
      'a': 'sortPeople',
      'b': 'sortOld',
      'c': 'sortNew',
      'd': 'sortCore',
    },
    showMenu: false,
    showHeads: false,
    headsList: ['声部', '入团时间', '性别', '出生日期', '身份证号', '学号', '学历阶段', '院系', '专业', '所在校区', '入学年份', '毕业年份', '手机号', '微信号'],
    headsCount: 14,
    resultHeadsList: ['声部', '入团时间', '性别', '出生日期', '身份证号', '学号', '学历阶段', '院系', '专业', '所在校区', '入学年份', '毕业年份', '手机号', '微信号'],
    headsMapping: {
      '声部': 'register', 
      '入团时间': 'inChoirTime', 
      '性别': 'gender', 
      '出生日期': 'birthdayString', 
      '身份证号': 'nationalID', 
      '学号': 'studentID', 
      '学历阶段': 'degree', 
      '院系': 'college', 
      '专业': 'major', 
      '所在校区': 'campus', 
      '入学年份': 'yearIn', 
      '毕业年份': 'yearOut', 
      '手机号': 'phone', 
      '微信号': 'wechatID'
    },
    showPersons: false,
    selectAll: true,
    selectNone: false,
    excelName: 'FDUC团员信息',
    excelPath: 'cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/excel/'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setData({
      safeH: wx.getSystemInfoSync().screenHeight - app.globalData.navHeight - 50,
      navH: app.globalData.navHeight,
      deviceW: app.globalData.windowWidth,
      backHeight: (app.globalData.menuHeight) * 0.75,
      backPaddingTop: app.globalData.menuBot + 2,
      navbarUrl: "https://6664-fduc-4gvelrvtea694888-1311978484.tcb.qcloud.la/navPic/nav.png?sign=b0ae35bb1a75a4e915a853ef807bed3f&t=1654600813",
    })
  },

  back() {
    wx.navigateBack({
      delta: 2,
    })
  },

  /**
   * 下拉菜单1: 筛选
   */
  onChange1(e) {
    let v = e.detail
    this.setData({
      value1: v
    })
    if (v == 0) {
      this.setData({
        peopleData: this.data.formalPeople
      })
    } else if (v == 1) {
      this.setData({
        peopleData: this.data.newPeople
      })
    } else if (v == 2) {
      this.setData({
        peopleData: this.data.editPeople
      })
    }else if (v == 3) {
      this.setData({
        peopleData: this.data.sPeople
      })
    } else if (v == 4) {
      this.setData({
        peopleData: this.data.aPeople
      })
    } else if (v == 5) {
      this.setData({
        peopleData: this.data.tPeople
      })
    } else if (v == 6) {
      this.setData({
        peopleData: this.data.bPeople
      })
    } else {
      this.setData({
        peopleData: this.data.unknownPeople
      })
    }

  },

  /**
   * 下拉菜单2: 排序
   */
  onChange2(e) {
    let v = e.detail
    this.setData({
      value2: v
    })
    if (v == 'a') {
      this.setData({
        peopleData: this.data.peopleData.sort(this.sortPeople)
      })
    } else if (v == 'b') {
      this.setData({
        peopleData: this.data.peopleData.sort(this.sortOld)
      })
    } else if (v == 'c') {
      this.setData({
        peopleData: this.data.peopleData.sort(this.sortNew)
      })
    } else if (v == 'd') {
      this.setData({
        peopleData: this.data.peopleData.sort(this.sortCore)
      })
    }
  },
  
  // 下拉菜单2: 排序
  // 老人优先
  sortOld(a, b) {
    const map2 = new Map()
    map2.set('春', 1)
    map2.set('秋', 2)
    let v1_2 = Number(a.inChoirTime[0])
    let v2_2 = Number(b.inChoirTime[0])
    let v1_3 = map2.get(a.inChoirTime[1])
    let v2_3 = map2.get(b.inChoirTime[1])
    if (v1_2 != v2_2) return v1_2 - v2_2;
    if (v1_3 != v2_3) return v1_3 - v2_3;
    return a.name.localeCompare(b.name)
  },
  // 新人优先
  sortNew(a, b) {
    const map2 = new Map()
    map2.set('春', 1)
    map2.set('秋', 2)
    let v1_2 = Number(a.inChoirTime[0])
    let v2_2 = Number(b.inChoirTime[0])
    let v1_3 = map2.get(a.inChoirTime[1])
    let v2_3 = map2.get(b.inChoirTime[1])
    if (v1_2 != v2_2) return v2_2 - v1_2;
    if (v1_3 != v2_3) return v2_3 - v1_3;
    return b.name.localeCompare(a.name)
  },
  // 骨干优先
  sortCore(a, b) {
    let v1_2 = Number(a.role)
    let v2_2 = Number(b.role)
    if (v1_2 != v2_2) return v2_2 - v1_2;
    return a.name.localeCompare(b.name)
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  viewProfile(e) {
    console.log(e.currentTarget.dataset)
    let clickName = e.currentTarget.dataset.name
    let clickStuid = e.currentTarget.dataset.stuid
    let value1 = e.currentTarget.dataset.value1
    let value2 = e.currentTarget.dataset.value2
    wx.navigateTo({
      url: `../form/form?firstLog=false&viewProfile=true&value1=${value1}&value2=${value2}`
    })
    
    let curPeople = this.data.peopleData
    console.log('test:', curPeople.filter(item => item.name == clickName && item.studentID == clickStuid)[0])

    wx.setStorage({
      key: 'curProfile',
      data: curPeople.filter(item => item.name == clickName && item.studentID == clickStuid)[0]
    })
  },

  /**
   * 选择导出excel选项（字段、人员）
   */
  chooseGenExcelOptions() {
    console.log('generating excel')
    this.setData({ 
      showMenu: true,
      personsList: this.data.peopleData.map(x => {return x.name}),
      resultPersonsList: this.data.peopleData.map(x => {return x.name}),
      personsCount: this.data.peopleData.map(x => {return x.name}).length,
    });

  },

  /**
   * 导出excel
   */
  genExcel() {
    let alldata = []

    // 写入表头字段
    let row = this.data.resultHeadsList
    let fullRow = ['姓名'].concat(row)
    alldata.push(fullRow)

    // 筛选导出人员数据
    let selData = this.data.peopleData.filter(x => this.data.resultPersonsList.indexOf(x.name) != -1)
    console.log('selData:', selData)
    let mapping = this.data.headsMapping
    for (let key in selData) {
      let arr = []
      arr.push(selData[key].name)
      for (let key2 in row) {
        if (mapping[row[Number(key2)]] == 'register' || mapping[row[Number(key2)]] == 'inChoirTime') {
          arr.push(selData[key][mapping[row[Number(key2)]]][0]+selData[key][mapping[row[Number(key2)]]][1])
        } else {
          arr.push(selData[key][mapping[row[Number(key2)]]])
        }
      }
      alldata.push(arr)
    }
    console.log('alldata:', alldata)
    let dataPack = [{
      name: 'sheet1',
      data: alldata
    }]
    let fileName = this.data.excelName + '.xlsx'
    // 调用云函数
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
  },

  onClickHideMenu() {
    this.setData({ showMenu: false });
    console.log('outer tap')
  },

  noop() {},

  chooseHeads() {
    this.setData({ showHeads: true })
  },
  onClickHideHeads() {
    this.setData({ showHeads: false });
    console.log('outer tap')
  },
  onChangeHeads(event) {
    console.log('onChangeHeads:', event)
    this.setData({
      resultHeadsList: event.detail,
      headsCount: event.detail.length,
    });
  },
  toggle(event) {
    console.log(event.currentTarget.dataset)
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    console.log(checkbox)
    checkbox.toggle();
  },


  choosePersons() {
    this.setData({ showPersons: true })
  },
  onClickHidePersons() {
    this.setData({ showPersons: false });
    console.log('outer tap')
  },
  onChangePersons(event) {
    console.log('onChangePersons:', event)
    this.setData({
      resultPersonsList: event.detail,
      personsCount: event.detail.length,
    });
  },

  onSelectAll(event) {
    this.setData({
      selectAll: event.detail,
    });
    if (this.data.showHeads) {
      if (this.data.selectAll) {
        this.setData({
          resultHeadsList: this.data.headsList
        })
      } else {
        this.setData({
          resultHeadsList: []
        })
      }
    } else if (this.data.showPersons) {
      if (this.data.selectAll) {
        this.setData({
          resultPersonsList: this.data.personsList
        })
      } else {
        this.setData({
          resultPersonsList: []
        })
      }
    }
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    wx.cloud.callFunction({
      name: "getData",
      data: {
        dbName: 'fducers',
        register: "",
      }
    })
    .then(res=>{
      // 跳转到成功界面
      console.log('get people success')
      console.log(res)
      let peoples = res.result.data.filter(x=>x.name.substring(0,2) != '陈瑜')
      this.setData({
        formalPeople: peoples.filter(item => item.role > 0).sort(this.sortPeople),
        newPeople: peoples.filter(item => item.role == 0).sort(this.sortPeople),
        editPeople: peoples.filter(item => item.role == 0.5).map(x => x.edit).sort(this.sortPeople),
        sPeople: peoples.filter(item => item.register[0] == "S").sort(this.sortPeople),
        aPeople: peoples.filter(item => item.register[0] == "A").sort(this.sortPeople),
        tPeople: peoples.filter(item => item.register[0] == "T").sort(this.sortPeople),
        bPeople: peoples.filter(item => item.register[0] == "B").sort(this.sortPeople),
        unknownPeople: peoples.filter(item => item.register[0] == "-").sort(this.sortPeople),
      })

      this.setData({
        peopleData: this.data[this.data.mapping[this.data.value1]],
      })

      let value2 = this.data.value2
      switch (value2) {
        case "a": this.setData({ peopleData : this.data.peopleData.sort(this.sortPeople) }); break;
        case "b": this.setData({ peopleData : this.data.peopleData.sort(this.sortOld) }); break;
        case "c": this.setData({ peopleData : this.data.peopleData.sort(this.sortNew) }); break;
        case "d": this.setData({ peopleData : this.data.peopleData.sort(this.sortCore) }); break;
      }

      // let sortFn = this.switch('sortCore')
      // console.log(this.data.peopleData.sort(sortFn))
    })

  },

  // 给声部列表排序
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
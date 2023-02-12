// pages/form/form.js
// import Toast from '/@vant/weapp/toast/toast';
// import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
const app = getApp()
const registerChoices = {
  register: ['-', 'S', 'A', 'T', 'B'],
  subRegister: ['-', '1', '2'],
};
const inChoirTimes = {
  year: ['2010', '2011', '2012', '2013',
  '2014', '2015', '2016', '2017', '2018',
  '2019', '2020', '2021', '2022'],
  season: ['秋', '春']
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstLog: true,
    viewProfile: undefined,
    name: "",
    gender: "",
    degree: "",
    major: "",
    hideMajor: false, 
    showCollege: false,
    colleges: ['自然科学试验班', '技术科学试验班', '社会科学试验班', '中国语言文学系', '外国语言文学学院', '历史学系', '旅游学系', '文物与博物馆学系', '哲学学院', '法学院', '国际关系与公共事务学院', '社会发展与公共政策学院', '新闻学院', 
    '经济学院', '泛海国际金融学院', '马克思主义学院', '国际文化交流学院', '数学科学学院', '物理学系', '现代物理研究所/核科学与技术系', '化学系', '高分子科学系', '环境科学与工程系', 
    '大气与海洋科学系', '信息科学与工程学院', '计算机科学技术学院', '软件学院', '微电子学院', '航空航天系', '材料科学系', '生命科学学院', '大数据学院', '管理学院', '基础医学院', '临床医学院', 
    '公共卫生学院', '药学院', '护理学院', '艺术教育中心', '体育教学部', '继续教育学院', '分析测试中心', '实验动物科学部', '出土文献与古文字研究中心', '高等教育研究所', '古籍整理研究所', 
    '国际问题研究院', '科技考古研究院', '六次产业研究院', '马克思主义研究院', '全球公共政策研究院', '社会科学高等研究院', '文史研究院', '现代语言学研究院', '一带一路及全球治理研究院', 
    '中国历史地理研究所', '中国研究院', '大气科学研究院', '大数据试验场研究院', '大数据研究院', '代谢与整合生物学研究院', '复杂体系多尺度研究院', '工程与应用技术研究院', '类脑芯片与片上智能系统研究院', 
    '类脑智能科学与技术研究院', '人类表型组研究院', '上海数学中心', '手性分子工程中心', '微纳电子器件与量子计算机研究院', '先进材料实验室', '专用材料与装备技术研究院', '智能复杂体系基础理论与关键技术实验室', 
    '智能机器人研究院', '放射医学研究所', '脑科学研究院', '生物医学研究院', '脑科学转化研究院', '芯片与系统前沿技术研究院', '光电研究院', '国家数学中心', '国家教材建设重点研究基地', '国家临床医学研究中心', '其他'],
    selfCollege: true,
    college: "点击选择",
    showCampus: false,
    campuses: ['邯郸','枫林','江湾','张江','校外'],
    campus: "点击选择",
    showYearIn: false,
    showYearOut: false,
    years: ['2010', '2011', '2012', '2013',
    '2014', '2015', '2016', '2017', '2018',
    '2019', '2020', '2021', '2022', '2023', '2024', 
    '2025', '2026', '2027', '2028', '2029', '2030', 
    '2031', '2032', '2033'],
    yearIn: "点击选择",
    yearOut: "点击选择",
    studentID: "",
    studentIDErr: "",
    nationalID: "",
    showBirthday: false,
    birthday: new Date('2002/1/1').getTime(),
    birthdayString: "点击选择",
    minDate: new Date('1990/1/1').getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    phone: "",
    phoneErr: "",
    wechatID: "",
    showRegister: false,
    register: [],
    registerString: "点击选择",
    registerCol: [
      {
        values: registerChoices.register,
        className: 'column1',
        defaultIndex: 0,
      },
      {
        values: registerChoices.subRegister,
        className: 'column2',
        defaultIndex: 0,
      },
    ],
    showInChoir: false,
    inChoirTime: [],
    inChoirTimeString: "点击选择",
    inChoirTimeCol: [
      {
        values: inChoirTimes.year,
        className: 'column1',
        defaultIndex: 10,
      },
      {
        values: inChoirTimes.season,
        className: 'column2',
        defaultIndex: 0,
      },
    ],
    fileList: [],
    photo: "",
    error: "",
    showDialog: false,
  },

  /**
   * 返回主页
   */
  backHome() {
    console.log('return home')
    wx.reLaunch({
      url: '/pages/home/fduc',
    }).then(res=>{
      app.onLaunch()
    })
  },

  /**
   * 提交数据
   */
  submitData(e) {
    let values = {
      _openid: app.globalData.openid,
      name: this.data.name,
      gender: this.data.gender,
      birthday: this.data.birthday,
      birthdayString: this.data.birthdayString,
      nationalID: this.data.nationalID,
      studentID: this.data.studentID,
      degree: this.data.degree,
      college: this.data.college,
      major: this.data.major,
      campus: this.data.campus,
      yearIn: this.data.yearIn,
      yearOut: this.data.yearOut,
      phone: this.data.phone,
      wechatID: this.data.wechatID,
      register: this.data.register,
      inChoirTime: this.data.inChoirTime,
      photo: this.data.fileList[0].url,
      role: 0, // 初次提交数据时默认role = 0
    }
    console.log(values)
    console.log(values.name)

    // 非CY时，正常验证流程
    if ( this.data.name.slice(0,2) != "陈瑜" ) {
      if (!this.validateSubmitData(values)) {
        wx.showToast({
          title: this.data.error,
          icon: 'none',
          duration: 2000
        })
        console.log(this.data.error)
      } else {
        console.log('提交成功')
        // 将数据上传到云数据库
        wx.cloud.callFunction({
          name: "upload2cloudDB",
          data: {
            funcName: "submitData",
            values: values,
            dbName: "fducers"
          }
        })
        .then(res=>{
          // 跳转到成功界面
          console.log('upload success')
          console.log(res)
          this.setData({
            showDialog: true
          })
          
        })
        .catch(console.error)
      }
    // CY时，无需验证
    } else {
      let cyValues = {
        _openid: app.globalData.openid,
        name: this.data.name,
        role: 2
      }
      wx.cloud.callFunction({
        name: "upload2cloudDB",
        data: {
          funcName: "submitData",
          values: cyValues,
          dbName: "fducers"
        }
      })
      .then(res=>{
        // 跳转到成功界面
        console.log('upload cyData success')
        console.log(res)
        this.setData({
          showDialog: true
        })
      })
      .catch(console.error)
    }
    
  },

  /**
   * 数据验证
   */
  validateSubmitData(values) {
    if (values.name.length < 1) {
      this.setData({ error: '姓名不能为空' })
      return false
    }
    if (values.gender.length < 1) {
      this.setData({ error: '性别不能为空' })
      return false
    }
    if (values.birthdayString == "点击选择") {
      this.setData({ error: '出生日期不能为空' })
      return false
    }
    if (values.nationalID.length < 1) {
      this.setData({ error: '身份证号不能为空' })
      return false
    }
    if (values.studentID.length == 0 || !this.validateStudentID()) {
      this.setData({ error: '学号不能为空/有误' })
      return false
    }
    if (values.degree.length < 1) {
      this.setData({ error: '学历阶段不能为空' })
      return false
    }
    if (values.college == "点击选择" || values.college == "其他") {
      this.setData({ error: '院系不能为空/其他' })
      return false
    }
    if (!this.data.hideMajor && values.major.length < 1) {
      this.setData({ error: '专业不能为空' })
      return false
    }
    if (values.campus == "点击选择") {
      this.setData({ error: '所在校区不能为空' })
      return false
    }
    if (values.yearIn  == "点击选择") {
      this.setData({ error: '入学年份不能为空' })
      return false
    }
    if (values.yearOut == "点击选择") {
      this.setData({ error: '毕业年份不能为空' })
      return false
    }
    if (values.phone.length == 0 || !this.validatePhone()) {
      this.setData({ error: '手机号不能为空/有误' })
      return false
    }
    if (values.wechatID.length < 1) {
      this.setData({ error: '微信号不能为空' })
      return false
    }
    if (values.register.length == 0) {
      this.setData({ error: '声部不能为空' })
      return false
    }
    if (values.inChoirTime.length == 0) {
      this.setData({ error: '入团时间不能为空' })
      return false
    }
    if (values.photo == false) {
      this.setData({ error: '生活照不能为空' })
      return false
    } else {
      this.setData({ error: '' })
      return true
    }

  },

  /**
   * 验证学号
   */
  validateStudentID() {
    // console.log(this.data.studentID.length)
    if ((this.data.studentID.length > 1 && this.data.studentID.length < 11) 
    || this.data.studentID.length > 11 ) {
      this.setData({
        studentIDErr: "请输入正确的学号"
      })
      return false
    } else {
      this.setData({
        studentIDErr: ""
      })
      return true
    }
  },

  /**
   * 验证手机号
   */
  validatePhone() {
    if ((this.data.phone.length > 0 && this.data.phone.length < 11 
      && !/^1\d{10}$/.test(this.data.phone)) || this.data.phone.length > 11) {
      this.setData({
        phoneErr: "请输入正确的手机号"
      })
      return false
    } else {
      this.setData({
        phoneErr: ""
      })
      return true
    }
  },

  /**
   * 照片
   */
  afterReadPic(event) {
    this.setData({
      fileList: this.data.fileList.map(item => ({ ...item, status: 'uploading' }))
    })

    const { file } = event.detail
    console.log(file)
    let curFL = file.url
    console.log(curFL)
    let name = this.data.name
    let suffix = '.' + curFL.substring(curFL.lastIndexOf(".") + 1) // 图片后缀
    let cloudUpPath = "picWall/" + name + `.${Date.now()}` + suffix 
    console.log(cloudUpPath)
    
    // let that = this
    wx.cloud.uploadFile({
      cloudPath: cloudUpPath,
      filePath: curFL
    }).then(res => {
      console.log(res.fileID)
      this.setData({ 
        fileList: [{ url: res.fileID, name: name + `.${Date.now()}` + suffix, status: 'done' }],
      });
    })
  },

  deletePic() {
    this.setData({
      fileList: [],
      photoExist: false
    })
    // const deleteList = []
    // deleteList.push(this.data.fileList[0].url)
    // let that = this
    // wx.cloud.deleteFile({
    //   fileList: deleteList
    // }).then(res => {
    //   that.setData({
    //     fileList: [],
    //     photoExist: false
    //   })
    // })
  },

  /**
   * 入团时间
   */
  showInChoir() {
    this.setData({ showInChoir: true });
  },

  closeInChoir() {
    this.setData({ showInChoir: false });
  },

  onInChoir(event) {
    this.setData({
      inChoirTime: event.detail.value,
      inChoirTimeString: `${event.detail.value[0]}${event.detail.value[1]}`,
      showInChoir: false
    })
  },

  /**
   * 声部
   */
  showRegister() {
    this.setData({ showRegister: true });
  },

  closeRegister() {
    this.setData({ showRegister: false });
  },

  onRegister(event) {
    this.setData({
      register: event.detail.value,
      registerString: `${event.detail.value[0]}-${event.detail.value[1]}`,
      showRegister: false
    })
  },

  /**
   * 生日
   */
  showBirthday() {
    this.setData({ showBirthday: true });
  },

  closeBirthday() {
    this.setData({ showBirthday: false });
  },

  onBirthday(event) {
    let dateBirthday = new Date(event.detail)
    let year = dateBirthday.getFullYear()
    let month = dateBirthday.getMonth() + 1
    let day = dateBirthday.getDate()
    this.setData({
      birthday: event.detail,
      birthdayString: `${year}年${month}月${day}日`,
      showBirthday: false
    })
  },

  /**
   * 入学年份
   */
  showYearIn() {
    this.setData({ showYearIn: true });
  },

  closeYearIn() {
    this.setData({ showYearIn: false });
  },

  onYearIn(event) {
    this.setData({
      yearIn: event.detail.value,
      showYearIn: false
    })
  },

  /**
   * 毕业年份
   */
  showYearOut() {
    this.setData({ showYearOut: true });
  },

  closeYearOut() {
    this.setData({ showYearOut: false });
  },

  onYearOut(event) {
    this.setData({
      yearOut: event.detail.value,
      showYearOut: false
    })
  },

  /**
   * 院系
   */
  showCollege() {
    this.setData({ showCollege: true });
  },

  closeCollege() {
    this.setData({ showCollege: false });
  },

  onCollege(event) {
    this.setData({
      college: event.detail.value,
      showCollege: false
    })
    this.checkCollege()
  },

  /**
   * 校区
   */
  showCampus() {
    this.setData({ showCampus: true });
  },

  closeCampus() {
    this.setData({ showCampus: false });
  },

  onCampus(event) {
    this.setData({
      campus: event.detail.value,
      showCampus: false
    })
  },

  /**
   * 性别
   */
  onGender(event) {
    this.setData({
      gender: event.detail,
    });
  },

  /**
   * 学历阶段
   */
  onDegree(event) {
    this.setData({
      degree: event.detail,
    });
  },

  /**
   * 验证院系是否为“其他”
   */
  checkCollege() {
    if (this.data.college == '其他') {
      this.setData({
        selfCollege: false
      })
    } else if (/^[\u4e00-\u9fa5]{2}科学试验班$/.test(this.data.college)) {
      this.setData({
        hideMajor: true,
        selfCollege: true
      })
    } else {
      this.setData({
        selfCollege: true,
        hideMajor: false
      })
    }
  },

  /**
   * 验证院系是否为试验班
   */
  hideMajor() {
    if (this.data.college == '自然科学试验班'|'技术科学试验班'|'社会科学试验班') {
      this.setData({
        selfCollege: false
      })
    } else {
      this.setData({
        selfCollege: true
      })
    }
  },

  /**
   * 审核通过
   */
  approveProfile() {
    wx.cloud.callFunction({
      name: "upload2cloudDB",
      data: {
        funcName: "approveProfile",
        dbName: "fducers",
        values: { role : 1 }, 
        where: { 
          name : this.data.name,
          studentID : this.data.studentID
         },
      }
    })
    .then(res=>{
      console.log('approved')
      this.back()
    })
  },
  
  /**
   * 审核失败
   */
  deleteProfile() {
    wx.cloud.callFunction({
      name: "upload2cloudDB",
      data: {
        funcName: "deleteProfile",
        dbName: "fducers",
        // values: { role : 1 }, 
        where: { 
          name : this.data.name,
          studentID : this.data.studentID
         },
      }
    })
    .then(res=>{
      console.log('deleted')
      this.back()
    })
  },

  /**
   * 改变角色
   */
  // 设置为骨干 1.5
  setStaff() {
    wx.cloud.callFunction({
      name: "upload2cloudDB",
      data: {
        funcName: "setStaff",
        dbName: "fducers",
        values: { role : 1.5 }, 
        where: { 
          name : this.data.name,
          studentID : this.data.studentID
         },
      }
    })
    .then(res=>{
      console.log('set to Staff')
      this.back()
    })
  },
  // 设置为管理员 2
  setAdmin() {
    wx.cloud.callFunction({
      name: "upload2cloudDB",
      data: {
        funcName: "setStaff",
        dbName: "fducers",
        values: { role : 2 }, 
        where: { 
          name : this.data.name,
          studentID : this.data.studentID
         },
      }
    })
    .then(res=>{
      console.log('set to Admin')
      this.back()
    })
  },
  // 设置为团员 1
  setMember() {
    wx.cloud.callFunction({
      name: "upload2cloudDB",
      data: {
        funcName: "setStaff",
        dbName: "fducers",
        values: { role : 1 }, 
        where: { 
          name : this.data.name,
          studentID : this.data.studentID
         },
      }
    })
    .then(res=>{
      console.log('set to Member')
      this.back()
    })
  },

  /**
   * 提交修改
   */
  updateProfile() {
    console.log('role:', this.data.globalRole)
    // 非管理员提交修改，数据库中增加edit字段
    if (this.data.globalRole != 2) {
      let values = {
        // _openid: app.globalData.openid,
        edit: {
          role: 0.5,
          name: this.data.name,
          gender: this.data.gender,
          birthday: this.data.birthday,
          birthdayString: this.data.birthdayString,
          nationalID: this.data.nationalID,
          studentID: this.data.studentID,
          degree: this.data.degree,
          college: this.data.college,
          major: this.data.major,
          campus: this.data.campus,
          yearIn: this.data.yearIn,
          yearOut: this.data.yearOut,
          phone: this.data.phone,
          wechatID: this.data.wechatID,
          register: this.data.register,
          inChoirTime: this.data.inChoirTime,
          photo: this.data.fileList[0].url,
        },
        role: 0.5, // 
      }
      console.log(values)
      if (!this.validateSubmitData(values.edit)) {
        wx.showToast({
          title: this.data.error,
          icon: 'none',
          duration: 2000
        })
        console.log(this.data.error)
      } else { 
        wx.cloud.callFunction({
          name: "upload2cloudDB",
          data: {
            funcName: "setEdit",
            dbName: "fducers",
            values: values, 
            where: { 
              name : this.data.name,
              studentID : this.data.studentID
            },
          }
        }).then(res=>{
          console.log('set to Editting')
          wx.cloud.database().collection("fducers").where({
            _openid: app.globalData.openid
          }).get()
          .then(res2=>{
            console.log("getUserData res:", res2)
            app.globalData.userData = res2.data[0]
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; //上一个页面
            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            prevPage.setData({
              uD: app.globalData.userData,
              uDlength: Object.keys(app.globalData.userData).length
            })
            wx.navigateBack({
              delta: 1,
            })
          })
        })
      }
    // 管理员提交修改，直接覆盖
    } else {
      let values = {
        _openid: app.globalData.openid,
        name: this.data.name,
        gender: this.data.gender,
        birthday: this.data.birthday,
        birthdayString: this.data.birthdayString,
        nationalID: this.data.nationalID,
        studentID: this.data.studentID,
        degree: this.data.degree,
        college: this.data.college,
        major: this.data.major,
        campus: this.data.campus,
        yearIn: this.data.yearIn,
        yearOut: this.data.yearOut,
        phone: this.data.phone,
        wechatID: this.data.wechatID,
        register: this.data.register,
        inChoirTime: this.data.inChoirTime,
        photo: this.data.fileList[0].url,
        role: 2, // 
      }
      console.log(values)
      if (!this.validateSubmitData(values)) {
        wx.showToast({
          title: this.data.error,
          icon: 'none',
          duration: 2000
        })
        console.log(this.data.error)
      } else { 
        wx.cloud.callFunction({
          name: "upload2cloudDB",
          data: {
            funcName: 'updateAdminData',
            values: values,
            dbName: "fducers",
            where: { 
              name : this.data.name,
              studentID : this.data.studentID
             },
          }
        })
        .then(res=>{
          // 跳转到成功界面
          console.log('upload success')
          console.log(res)
          this.back()
        })
      }
    }
    
  },

  approveEdit() {
    let values = {
      name: this.data.name,
      gender: this.data.gender,
      birthday: this.data.birthday,
      birthdayString: this.data.birthdayString,
      nationalID: this.data.nationalID,
      studentID: this.data.studentID,
      degree: this.data.degree,
      college: this.data.college,
      major: this.data.major,
      campus: this.data.campus,
      yearIn: this.data.yearIn,
      yearOut: this.data.yearOut,
      phone: this.data.phone,
      wechatID: this.data.wechatID,
      register: this.data.register,
      inChoirTime: this.data.inChoirTime,
      photo: this.data.photo,
      role: 1, // 修改数据后默认还是团员先，后续再升级
    }
    console.log(values)
    if (!this.validateSubmitData(values)) {
      wx.showToast({
        title: this.data.error,
        icon: 'none',
        duration: 2000
      })
      console.log(this.data.error)
    } else {
      console.log('提交成功')
      // 将数据上传到云数据库
      wx.cloud.callFunction({
        name: "upload2cloudDB",
        data: {
          funcName: "approveEdit",
          values: values,
          dbName: "fducers",
          where: { 
            name : this.data.name,
            studentID : this.data.studentID
           },
        }
      })
      .then(res=>{
        // 跳转到成功界面
        console.log('edit approved')
        console.log(res)
        this.back()
      })
    }
  },

  rejectEdit() {
    let values = {
      role: 1, // 修改数据后默认还是团员先，后续再升级
    }
    console.log(values)
      
    // 将数据上传到云数据库
    wx.cloud.callFunction({
      name: "upload2cloudDB",
      data: {
        funcName: "rejectEdit",
        values: values,
        dbName: "fducers",
        where: { 
          name : this.data.name,
          studentID : this.data.studentID
          },
      }
    })
    .then(res=>{
      // 跳转到成功界面
      console.log('edit rejected')
      console.log(res)
      this.back()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      safeH: wx.getSystemInfoSync().screenHeight - app.globalData.navHeight,
      navH: app.globalData.navHeight,
      deviceW: app.globalData.windowWidth,
      backHeight: (app.globalData.menuHeight) * 0.75,
      backPaddingTop: app.globalData.menuBot + 2,
      navbarUrl: "https://6664-fduc-4gvelrvtea694888-1311978484.tcb.qcloud.la/navPic/nav.png?sign=b0ae35bb1a75a4e915a853ef807bed3f&t=1654600813",
      globalRole: app.globalData.userData.role
    })
    console.log('options:', options)
    if (JSON.stringify(options) != '{}') {
      if (options.firstLog) {
        this.setData({
          firstLog: JSON.parse(options.firstLog),
        })
      }
      if (options.viewProfile) {
        this.setData({
          viewProfile: JSON.parse(options.viewProfile),
        })
      }
      if (options.value1) {
        this.setData({
          value1: JSON.parse(options.value1),
        })
      }
      if (options.value2) {
        this.setData({
          value2: options.value2,
        })
      }
    }
  },

  toConsent() {
    wx.navigateTo({
      url: `./consent`
    })
  },

  back() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      value1: this.data.value1,
      value2: this.data.value2,
    })
    wx.navigateBack({
      delta: 1,
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
    // 自己查看自己的信息时（不是第一次登陆 & 不是管理员查看全员信息 & 不是提交修改后）
    if (this.data.firstLog == false && this.data.viewProfile == undefined && this.data.globalRole != 0.5) {
      console.log('sc.1')
      this.setData({
        name: app.globalData.userData.name,
        gender: app.globalData.userData.gender,
        birthdayString: app.globalData.userData.birthdayString,
        nationalID: app.globalData.userData.nationalID,
        studentID: app.globalData.userData.studentID,
        degree: app.globalData.userData.degree,
        college: app.globalData.userData.college,
        major: app.globalData.userData.major,
        campus: app.globalData.userData.campus,
        yearIn: app.globalData.userData.yearIn,
        yearOut: app.globalData.userData.yearOut,
        phone: app.globalData.userData.phone,
        wechatID: app.globalData.userData.wechatID,
        register: [app.globalData.userData.register[0], app.globalData.userData.register[1]],
        registerString: app.globalData.userData.register[0] + '-' + app.globalData.userData.register[1],
        inChoirTime: [app.globalData.userData.inChoirTime[0], app.globalData.userData.inChoirTime[1]], 
        inChoirTimeString: app.globalData.userData.inChoirTime[0] + app.globalData.userData.inChoirTime[1],
        photo: app.globalData.userData.photo,
        fileList: [{'url': app.globalData.userData.photo}]
      })
      this.checkCollege()
    // 管理员查看全员信息时
    } else if (this.data.viewProfile == true) {
      console.log('sc.2')
      let that = this
      wx.getStorage({
        key: 'curProfile',
        success (res) {
          // console.log(res.data)
          let curData = res.data
          console.log('curData:', curData)
          that.setData({
            ...curData,
            registerString: curData.register[0] + '-' + curData.register[1],
            inChoirTimeString: curData.inChoirTime[0] + curData.inChoirTime[1],
            fileList: [{'url': curData.photo}]
          })
        }
      })
    // 提交修改申请后团员自己查看自己申请时
    } else if (this.data.globalRole == 0.5) {
      console.log('sc.3')
      this.setData({
        ...app.globalData.userData.edit,
        register: [app.globalData.userData.edit.register[0], app.globalData.userData.edit.register[1]],
        registerString: app.globalData.userData.edit.register[0] + '-' + app.globalData.userData.edit.register[1],
        inChoirTime: [app.globalData.userData.edit.inChoirTime[0], app.globalData.userData.edit.inChoirTime[1]], 
        inChoirTimeString: app.globalData.userData.edit.inChoirTime[0] + app.globalData.userData.edit.inChoirTime[1],
        fileList: [{'url': app.globalData.userData.edit.photo}]
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
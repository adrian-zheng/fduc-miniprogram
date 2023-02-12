// app.js
import {getopenid} from './utils.js'


App({
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'fduc-4gvelrvtea694888',
        traceUser: true,
      });
    }

    this.globalData = {
      curSemester: '2023春', // 设置当前学期
    };

    let version = __wxConfig.envVersion;
    console.log(version)

    let menuButtonObject = wx.getMenuButtonBoundingClientRect()
    console.log("menuButtonObject:", menuButtonObject)
    // 获取设备信息
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        // 整个导航栏的高度
        let navHeight = menuButtonObject.top + menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight)*2
        // 导航栏的高度
        let nav = navHeight - res.statusBarHeight
 
        // 挂载到全区变量 globalData 上
        this.globalData.navHeight = navHeight
        this.globalData.nav = nav
 
        // 胶囊与左边的距离
        this.globalData.menuLeft = menuButtonObject.left
        // 胶囊的高度
        this.globalData.menuHeight = menuButtonObject.height
        // 胶囊距离顶部的高度
        this.globalData.menuBot = menuButtonObject.top
        // 整个设备的宽度
        this.globalData.windowWidth = res.windowWidth
        // 整个设备的高度
        this.globalData.windowHeight = res.windowHeight
        // navbar长宽比
        this.globalData.navPortion =  res.windowWidth / navHeight
      },
      fail: err => {
        console.log(err)
      }
    })

    console.log("nvPor @app:", this.globalData.navPortion)

    if (this.globalData.navPortion < 7) {
      this.globalData.navbarUrl= "https://6664-fduc-4gvelrvtea694888-1311978484.tcb.qcloud.la/navPic/navPhoneNew.png?sign=101b5d5b2a84621a189b24ef5c470d96&t=1654600301"
    } else {
      this.globalData.navbarUrl= "https://6664-fduc-4gvelrvtea694888-1311978484.tcb.qcloud.la/navPic/navIpadNew.png?sign=7cabea3e1fe648923a2a446fbbdc0c8d&t=1654600322"
    }
    
    const openid = await getopenid(this, 'app')

    const db = wx.cloud.database()
    

  }

});

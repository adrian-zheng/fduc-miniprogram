// custom-tab-bar/index.js
import {getopenid, getUserData} from '../utils.js'
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 'fduc',
    roleId: 0,
    lists: [{
      listMember: [
        {
          icon: 'star-o',
          text: 'FDUC',
          name: 'fduc',
          url: '/pages/home/fduc'
        },
        // {
        //   icon: 'bullhorn-o',
        //   text: '活动',
        //   name: 'activity',
        //   url: '/pages/home/activity'
        // },
        {
          icon: 'music-o',
          text: '排练',
          name: 'rehearsal',
          url: '/pages/home/rehearsal'
        },
        {
          icon: 'smile-o',
          text: '团员',
          name: 'people',
          url: '/pages/home/people'
        },
        {
          icon: 'user-circle-o',
          text: '我的',
          name: 'my',
          url: '/pages/home/my'
        }
      ],
      listVisitor: [
        {
          icon: 'star-o',
          text: 'FDUC',
          name: 'fduc',
          url: '/pages/home/fduc'
        },
        {
          icon: 'user-circle-o',
          text: '我的',
          name: 'my',
          url: '/pages/home/my'
        }
      ],
    }],
    list: []
  },

  async attached() {
    // 使用utils中的getopenid函数获取openid
    const openid = await getopenid(app, 'tabbar')
    // 使用utils中的getUserData函数获取userData
    const uD = await getUserData(app)
    console.log("attached app.globalData.openid:", app.globalData.openid)
    console.log("attached app.globalData.userData:", uD)
    
    // 判断用户身份，筛选tabbar页面
    if (uD != undefined) {
      this.setData({
        roleId: uD.role
      })
      console.log('attached app.globalData.userData.role @if:', this.data.roleId)
    } else {
      this.setData({
        roleId: 0
      }) 
      console.log('attached app.globalData.userData.role @else:', this.data.roleId)
    }
    let curList = []
    // 游客身份 == 0
    if (this.data.roleId == 0 || this.data.roleId == undefined) {
      curList = this.data.lists[0].listVisitor
      this.setData({
        list: curList
      })
    // 团员身份 == 1; 基层骨干身份 == 1.5; 核心骨干身份 == 2
    }else if(this.data.roleId > 0){
      curList = this.data.lists[0].listMember
      this.setData({
        list: curList
      })
    }
    // })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      console.log("这个：", event.detail)
      this.setData({ active: event.detail }); 
			wx.switchTab({
				url: this.properties.list.find(item=>item.name === event.detail).url
      });
      // console.log(event.detail)
    },
    
    // init函数，用于实时更新active的tab
    init(name) {
      this.setData({
        // active: this.list.find(item => item.url === `/${page.route}`).name
        active: name
      });
    }
  }
})

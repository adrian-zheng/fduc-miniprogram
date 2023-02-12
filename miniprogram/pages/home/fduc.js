// pages/home/fduc.js
const app = getApp()
const cloudRootPath = "cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/opus_cover/"

Page({

  onShareAppMessage() {
    return {
      title: 'scroll-view',
      path: 'page/component/pages/scroll-view/scroll-view'
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    safeH: 0,
    cloudRoot: 'cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/',
    songData: [
      {
        songTitle: '你的光芒',
        songAuthor: '田汨',
        lyricsAuthor: '李姝',
        dscrText: '复旦大学学生合唱团第六届全国大学生艺术展演参赛曲目。歌曲讲述了年轻人从最开始的迷茫，到最后充满希望的追光之路，充满温暖和力量。2020年对于每一个中国人来说都是不平凡的一年，在疫情爆发初期也许会有迷茫、彷徨，但是在我党的带领下，我们众志成城，一起追寻着光芒，找到了方向，歌曲也从平缓到激烈，最后在近乎呐喊中结尾，表达了追寻光芒的坚定，等待花开时必然会相见的信心。',
        avid: 889084867,
        picFilePath: cloudRootPath + '你的光芒_1280x690.JPG'
      },
      {
        songTitle: '朝天曲',
        songAuthor: '田汨',
        lyricsAuthor: '【元】张养浩',
        dscrText: '复旦大学学生合唱团第六届全国大学生艺术展演参赛曲目。《朝天曲》是以元代张养浩的词所作的歌曲，作曲运用了现代作曲技法勾勒出美人、美景、美生活的景色，抒发了一种闲适心态的写照。这也是我们现在国泰民安，百姓安居乐业的画面。',
        avid: 717857665,
        picFilePath: cloudRootPath + '朝天曲_1280x690.png'
      },
      {
        songTitle: '青春无悔',
        songAuthor: '佚名',
        lyricsAuthor: '田汨 鲍峰',
        dscrText: '复旦大学学生合唱团第五届全国大学生艺术展演参赛曲目，是合唱团的保留曲目。歌曲节奏轻快，旋律明朗，歌词中透露着对校园生活的热爱、描写了大学同学间的深厚友谊。这首青春励志主题的歌曲，用年轻人喜爱的音乐呈现形式写作，反映新时代，青年一代理想、信念，励志鼓劲，蓬勃向上的歌曲。这首歌最大的亮点在于每个年龄段的人都可以找到共鸣。作为青年人，正如这首歌所歌唱的那样，正在经历和创造着自己“无悔的青春”，而对于中年、老年人来说，当他们听起这首歌，回首往事的时候，会发现 “我们其实从未说过再见”，那些美好的过往成就了现在的自己。这句“青春无悔，我们从未说过再见”，唱出了各个年龄段对于青春、理想、信念的认识，不懈奋斗的态度。',
        avid: 710953847,
        picFilePath: cloudRootPath + '青春无悔_1280x690.jpg'
      },
      {
        songTitle: '骤雨打新荷',
        songAuthor: '田汨',
        lyricsAuthor: '【金】元好问',
        dscrText: '复旦大学学生合唱团第五届全国大学生艺术展演参赛曲目。此曲上片写景，绘写夏日园亭的自然景色，辞采鲜明，气氛热烈，清新俊雅，佳句迭出，突出了园中盛夏的特征；下片抒怀，直写胸臆，感慨人生苦短和穷通有命，得出了及时行乐的结论，沉郁苍凉又不失旷达。',
        avid: 541621902,
        picFilePath: cloudRootPath + '骤雨打新荷_1280x690.jpg'
      },
      {
        songTitle: '白色 (Poptricks)',
        songAuthor: '牛佳钰',
        lyricsAuthor: '牛佳钰',
        dscrText: 'Poptricks人声乐团的原创抗疫歌曲《白色》，由当时团员牛佳钰创作于2020年。“白色”这个词语在这首歌里，是死亡，是离别，是寂静；也是白衣天使，是微光希望，是安宁平静；同学们用纯净人声，发自内心演绎，用温暖而有力的声音，表达对于抗疫期间各行各业奋斗者的歌颂和对抗疫工作者的敬意，希望给每一位听众播下希望的种子，不忘过去，也更加相信未来。',
        avid: 583948842,
        picFilePath: cloudRootPath + '白色_1280x690.png'
      }
    ],
    urls: [
      'cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/fducCharm/大艺展初赛1.jpeg',
      'cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/fducCharm/大艺展初赛2.jpeg',
      'cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/fducCharm/大艺展初赛3.jpeg',
      'cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/fducCharm/大艺展决赛.jpeg',
      'cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/fducCharm/misa.jpeg',
      'cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/fducCharm/红旗颂.jpeg',
      'cloud://fduc-4gvelrvtea694888.6664-fduc-4gvelrvtea694888-1311978484/fducCharm/长征组歌.png',
    ]
  },

  onImage(e) {
    console.log(e)
    let url = this.data.cloudRoot + 'fducCharm/' + e.currentTarget.dataset.picname
    console.log(url)
    wx.previewImage({
      current: url, // 当前显示图片的 http 链接
      urls: this.data.urls // 需要预览的图片 http 链接列表
    })
  },

  goFollowBilibili(e) {
    console.log(e)
    wx.navigateTo({
      url: '../second/bilibiliPage',
    })
  },
  

  goBilibili(e) {
    const avid=e.currentTarget.dataset.avid
    const timestamp=new Date().getTime()
    const path=`pages/video/video?__preload_=${timestamp*10+3}&__key_=${timestamp*10+4}&avid=${avid}`
    wx.navigateToMiniProgram({
      appId: 'wx7564fd5313d24844',
      path,
      success: res => {
        console.log('跳转成功')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect()
    let navHeight = menuButtonObject.top + menuButtonObject.height + (menuButtonObject.top - wx.getSystemInfoSync().statusBarHeight)*2
    let nvPor = wx.getSystemInfoSync().windowWidth / navHeight
    console.log("nvPor @fduc:", nvPor)
    if (nvPor < 7) {
      this.setData({
        navbarUrl: "https://6664-fduc-4gvelrvtea694888-1311978484.tcb.qcloud.la/navPic/navPhoneNew.png?sign=101b5d5b2a84621a189b24ef5c470d96&t=1654600301"
      })
    } else {
      this.setData({
        navbarUrl: "https://6664-fduc-4gvelrvtea694888-1311978484.tcb.qcloud.la/navPic/navIpadNew.png?sign=7cabea3e1fe648923a2a446fbbdc0c8d&t=1654600322"
      })
    }
    this.setData({
      safeH: wx.getSystemInfoSync().safeArea.height - 94,
      navH: navHeight,
      deviceW: wx.getSystemInfoSync().windowWidth
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
    this.getTabBar().init('fduc')
    // if (typeof this.getTabBar === 'function' &&
    //   this.getTabBar()) {
    //   this.getTabBar().setData({
    //     active: 0
    //   })
    // }
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

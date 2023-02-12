// pages/bottomUpdate/bottomUpdate.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
  },

  clickRow(res) {
    // 0. 点击时显示loading提示，不允许连续操作
    wx.showLoading({
      title: 'loading...',
      mask: true
    })
    // 1. 获取点击的id和索引值
    let {id, idx} = res.currentTarget.dataset

    // 2. 云函数进行更新参数
    wx.cloud.callFunction({
      name: "updateData",
      data:{
        iden: id
      }
    }).then(res=>{
    // 3. 前端连后端，将数据传输给后端，后端返回数据
      // let newData = this.data.dataList
      // newData[idx].hits += 7
      // this.setData({
        // dataList: newData
      // })
      let that = this
      db.collection('demoList')
      .doc(id).watch({
        onChange(snapshot) {
          // 4. 重新渲染数据
          let change = `dataList[${idx}]`
          that.setData({
            [change]: snapshot.docs[0]
          })
        },
        onError(err) {
        }
      })
      // end. 结束时loading提示结束
      wx.hideLoading()
    })
  },

  fetchData(limitNum = 5, skipNum = 0) {
    wx.cloud.callFunction({
        name: "getData1",
        data: {
          limitNum: limitNum,
          skipNum: skipNum
        }
      })
      .then(res => {
        this.setData({
          dataList: this.data.dataList.concat(res.result.data)
        })
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchData()
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
    let pageLen = this.data.dataList.length
    this.fetchData(5, pageLen)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
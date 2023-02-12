// const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()

// 判断app的全局数据中是否有openid，如果没有则调用云函数，获取openid，并存储到全局数据中
export async function getopenid(app, who) {
  const value = app.globalData && app.globalData.openid
  console.log("init openid value:", value, '@' + who)
  if (value) {
    console.log('running if of "getopenid"', '@' + who)
    return value
    // Do something with return value
  } else {
    const res = await wx.cloud.callFunction({
      name: 'getOpenid'
    })
    app.globalData.openid = res.result.openid
    console.log('running else of "getopenid"', '@' + who)
    console.log('openid:', res.result.openid, '@' + who)
  }
}

// 判断app的全局数据中是否有userData，如果没有则调用云函数，通过全局数据中的openid获取userData，并存储到全局数据中
export async function getUserData(app) {
  const value = app.globalData && app.globalData.userData
  console.log("init userData value:", value)
  if (value) {
    console.log('running if of "getUserData"')
    return value
  } else {
    const res = await wx.cloud.database().collection("fducers").where({
      _openid: app.globalData.openid
    }).get()
    console.log("getUserData res:", res)
    // res中有数据的话（之前登陆过）
    if (res.data?.length > 0) { //相当于res.data && res.data.length > 0
      // 存储用户全部信息及role到globalData中
      app.globalData.userData = res.data[0]
      console.log('running else of "getUserData"')
      return res.data[0]
    // res中没有数据的话（游客身份）
    } else {
      const rst = {'role': 0}
      app.globalData.userData = rst
      return rst
    }
  }
}

export function getRehearsalData(user, rehearsalData) { 
  let resultRehearsal = []
  // 处理每条考勤数据
  console.log(rehearsalData)
  rehearsalData.forEach( function(item){
    let itemRehearsal = {} 
    let date = new Date(item.date)
    let numDate = new Date(item.date).getTime()
    itemRehearsal['date'] = date // 开始时间
    itemRehearsal['end'] = new Date(item.endTime) // 结束时间
    itemRehearsal['cw'] = item.codeWord // 签到口令
    itemRehearsal['creator'] = item.creator // 创建者userID
    itemRehearsal['year'] = date.getFullYear() // 开始时间-年
    itemRehearsal['month'] = date.getMonth()+1 // 开始时间-月
    itemRehearsal['day'] = date.getDate() // 开始时间-日
    itemRehearsal['hour'] = date.getHours() // 开始时间-小时
    itemRehearsal['minute'] = date.getMinutes() // 开始时间-分钟
    itemRehearsal['second'] = date.getSeconds() // 开始时间-秒
    itemRehearsal['time'] = date.toTimeString().substring(0,8) // 开始时间-小时分钟秒（字符串）
    itemRehearsal['duration'] = (new Date(item.endTime).getTime() - date.getTime()) / (60 * 1000) // 签到持续时间（分钟）
    
    // 判断每条记录的签到时间状态ifNow (-1尚未开始, 0进行中, 1已结束)，
    // 以及签到状态status (check已签到, leave请假, miss缺勤)
    const curTime = new Date()
    const numCurTime = new Date().getTime()
    const userName = user
    const attNameList = item.list.map(item=>item[3])
    const leaveNameList = item.leave.filter(x=>x!=null).map(item=>item[3])
    // 正在签到 ifNow = 0
    if (numCurTime > numDate && numCurTime < new Date(item.endTime).getTime()) {
      itemRehearsal['ifNow'] = 0
      // 已签到的话，status=check
      if (attNameList.indexOf(userName) != -1) {
        itemRehearsal['status'] = 'check'
      } else if (leaveNameList.indexOf(userName) != -1) {
        itemRehearsal['status'] = 'leave'
      }
    // 尚未开始签到 ifNow = -1，额外判断是否可以请假
    } else if (numCurTime < numDate) {
      itemRehearsal['ifNow'] = -1
      // 当前时间 < 签到开始时间前三小时
      if (curTime.getTime() < date.getTime() - (3 * 60 * 60 * 1000)) {
        itemRehearsal['showLeave'] = true
        if (leaveNameList.indexOf(userName) != -1) {
          itemRehearsal['status'] = 'leave'
        } else {}
      // 当前时间 >= 签到开始时间前三小时
      } else {
        itemRehearsal['showLeave'] = false
        if (leaveNameList.indexOf(userName) != -1) {
          itemRehearsal['status'] = 'leave'
        } else {}
      }
    // 签到已结束 ifNow = 1
    } else {
      itemRehearsal['ifNow'] = 1
      if (attNameList.indexOf(userName) != -1) {
        itemRehearsal['status'] = 'check'
      } else if (leaveNameList.indexOf(userName) != -1) {
        itemRehearsal['status'] = 'leave'
      } else {
        itemRehearsal['status'] = 'miss'
      }
    }
    // 获取时间字符串，作为list的第五个元素存储
    let rList = []
    item.list.forEach( function(i){
      let iList = i
      let timeString = new Date(i[0]).toTimeString().substring(0,8)
      iList.push(timeString)
      rList.push(iList)
    })
    itemRehearsal['list'] = rList
    // 获取时间字符串，作为leave的第六个元素存储
    let rLeave = []
    let rLeave_w_null = []
    if (item.leave != undefined) {
      item.leave.forEach( function(i){
        if (i != null) {
          let iLeave = i
          let timeString = String(new Date(i[0]).getMonth() + 1) + '月' + 
          String(new Date(i[0]).getDate()) + '日 ' + new Date(i[0]).toTimeString().substring(0,8)
          iLeave.push(timeString)
          rLeave.push(iLeave)
          rLeave_w_null.push(iLeave)
        } else {
          rLeave_w_null.push(null)
        }
      })
      itemRehearsal['leave'] = rLeave
      itemRehearsal['leave_w_null'] = rLeave_w_null
    }
    resultRehearsal.push(itemRehearsal)
  })
  console.log("rehearsal:", resultRehearsal)     
  return resultRehearsal

    // app.globalData.allRehearsal = this.data.rehearsal.length
    // app.globalData.checkedRehearsal = this.data.rehearsal.filter(item => item.status == "check").length
    // console.log("allRehearsal:", app.globalData.allRehearsal)
    // console.log("checkedRehearsal:", app.globalData.checkedRehearsal)
    // console.log('rehearsal @global:', app.globalData.rehearsal)
}

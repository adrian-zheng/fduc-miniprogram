// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let limitNum = event.limitNum
  let skipNum = event.skipNum

  return await db.collection("demoList")
  .limit(limitNum)
  .skip(skipNum)
  .orderBy("hits", "asc")
  .get()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}


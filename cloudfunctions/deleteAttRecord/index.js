// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let data = event.values
  let cw = data.cw
  
  return await db.collection('rehearsal').where({
    codeWord: cw,
    list: []
  }).remove()
}
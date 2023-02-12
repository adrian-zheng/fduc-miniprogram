// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  let dbName = event.dbName
  let where = event.where
  let toWhich = event.toWhich
  let updateData = event.upData
  
  // 上传考勤数据
  if (toWhich == 'list') {
    let updateTime = db.serverDate()
    updateData[0].unshift(updateTime)

    return await db.collection(dbName).where(where)  
    .update({
      data: { list: _.push(updateData) }
    })
  // 上传请假数据
  } else if (toWhich == 'leave') {
    // let curTime = Math.trunc(Date.now())
    let updateTime = db.serverDate()
    updateData[0].unshift(updateTime)

    return await db.collection(dbName).where(where)  
    .update({
      data: { leave: _.push(updateData) }
    })
  // 删除请假数据
  } else if (toWhich == 'delLeave') {
    return await db.collection(dbName).where(where)  
    .update({
      data: { [`leave.${updateData}`]: _.remove()
      }
    })
  // 请假数据删除后操作
  } else if (toWhich == 'postDelLeave') {
    return await db.collection(dbName).where(where)  
    .update({
      data: { leave: _.pull(null)}
    })
  }
}
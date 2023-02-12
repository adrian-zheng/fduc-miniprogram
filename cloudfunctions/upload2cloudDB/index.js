// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let func = event.funcName

  // 初次登陆，提交数据
  if (func == "submitData") {
    let data = event.values
    let dbName = event.dbName

    return await db.collection(dbName).add({ data: data })
    .then(res=>{
    console.log(res)
    })
  // 新建的考勤记录上传
  } else if (func == "submitDataRehearsal") {
    let data = event.values
    let dbName = event.dbName

    let curTime = Date.now()
    let offStart = data.date - curTime
    let offEnd = data.endTime - curTime
    data.date = db.serverDate({offset: offStart})
    data.endTime = db.serverDate({offset: offEnd})
    
    return await db.collection(dbName).add({ data: data })
    .then(res=>{
    console.log(res)
    })
  // 管理员审核成功后将role从0改为1
  } else if (func == "approveProfile") {
    let data = event.values
    let dbName = event.dbName
    let toWhich = event.where
    return await db.collection(dbName)
    .where(toWhich)
    .update({ data : data })
  // 管理员审核失败后将该记录删除
  } else if (func == "deleteProfile") {
    let dbName = event.dbName
    let toWhich = event.where
    return await db.collection(dbName)
    .where(toWhich)
    .remove()
  // 管理员设置团员身份/更新管理员自己的信息
  } else if (func.substring(0,3) == 'set' || func == "updateAdminData") {
    let data = event.values
    let dbName = event.dbName
    let toWhich = event.where
    return await db.collection(dbName)
    .where(toWhich)
    .update({ data : data })
  // 管理员审核修改：批准/驳回
  } else if (func == "approveEdit" || func == "rejectEdit") {
    let data = event.values
    data['edit'] = _.remove()
    let dbName = event.dbName
    let toWhich = event.where
    return await db.collection(dbName)
    .where(toWhich)
    .update({ data : data })
  // 提交反馈
  } else if (func == 'submitIssue') {
    let sem = event.sem
    let data = event.data
    let time = db.serverDate()
    data.unshift(time)

    return await db.collection('assorted')
    .where({ name: "issue" })
    .update({ 
      data :  {
        [`records.${sem}`]: _.push([data])
      }
    })
  } else if (func == 'login') {
    let un = event.username
    let pw = event.password
    let pw1 = pw.substring(0,6)
    let pw2 = pw.substring(6)
    let openid = event.openid

    // return [un, pw1, pw2]
    
    return await db.collection('fducers').where({ 
      phone: un,
      studentID: pw2,
      nationalID: db.RegExp({
        regexp: `^[0-9]{12}${pw1}$`,
        options: 'i',
      })
    }).update({
      data: {
        role: 1,
        _openid: openid
      }
    })
  } else if (func == 'weekRelated') {
    let scorename = event.scorename
    let which = event.which
    if (which == "cancel") {
      return await db.collection('score').where({ 
        name: scorename
      }).update({
        data: {
          thisweek: 0
        }
      })
    } else {
      return await db.collection('score').where({ 
        name: scorename
      }).update({
        data: {
          thisweek: 1
        }
      })
    }
  }
}
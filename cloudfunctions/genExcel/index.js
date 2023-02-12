// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async (event, context) => {
  let tableName = event.excelName
  let alldata = event.alldata


  let buffer = await xlsx.build(alldata)

  return await cloud.uploadFile({
    cloudPath: 'excel/' + tableName,
    fileContent: buffer, //excel二进制文件
  })

}
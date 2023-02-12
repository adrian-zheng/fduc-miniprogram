// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let dbName = event.dbName

  if (dbName == "fducers") {
    if (event.register) {
      let reg = event.register
      return await db.collection("fducers").where({
        'register.0': reg
      })
      .get()
    } else {
      const peopleCount = await db.collection("fducers").count()
      console.log("peopleCount:", peopleCount)
      let times = Math.ceil(peopleCount.total / 100)
      let tasks = []
      for (let i = 0; i < times; i++) {
        const promise = db.collection('fducers').skip(i * 100).limit(100).get()
        tasks.push(promise)
      }
      return (await Promise.all(tasks)).reduce((acc, cur) => {
        return {
          data: acc.data.concat(cur.data),
          errMsg: acc.errMsg,
        }
      })
      // return await db.collection("fducers")
      // .get()
    }
  } else if (dbName == "rehearsal") {
    if (event.curSem) {
      let curSem = event.curSem
      return await db.collection("rehearsal").where({
        sem: curSem
      }).orderBy('date', 'desc')
      .get()
    } else {
      return await db.collection("rehearsal")
      .orderBy('date', 'desc')
      .get()
    }
  } else if (dbName == 'assorted') {
    let mode = event.mode
    return await db.collection("assorted").where({
      name: mode
    })
    .get()
  } else if (dbName == 'score') {
    return await db.collection("score").get()
  }
}
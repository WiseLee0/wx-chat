const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action == 'get') return get(event, wxContext)
  if (event.action == 'update') return update(event, wxContext)
}

async function get(event, wxContext) {
  const res = await db.collection('setting').where({
    openId: event.openId || wxContext.OPENID
  }).get()
  if (!res.data.length) {
    db.collection('setting').add({
      data: {
        openId: event.openId || wxContext.OPENID,
        location: false,
        time: false
      }
    })
    return {
      openId: event.openId || wxContext.OPENID,
      location: true,
      time: true
    }
  }
  return res.data[0]
}

async function update(event, wxContext) {
  await db.collection('setting').where({
    openId: wxContext.OPENID
  }).update({
    data: {
      [event.name]: event.data
    }
  })

}
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action == 'init') return initChatUser(event, wxContext)
  if (event.action == 'get') return getChatUser(event, wxContext)
  if (event.action == 'all') return allChatUser(event, wxContext)

}

async function getChatUser(event, wxContext) {
  const res = await db.collection('chatuser').where({
    openId: event.openId
  }).get()
  return res.data[0].time
}

async function allChatUser(event, wxContext) {
  const user = await db.collection('chatuser').where({
    openId: _.not(_.eq(wxContext.OPENID))
  }).get()
  const arr = []
  for (let i = 0; i < user.data.length; i++) {
    arr.push(user.data[i].openId)
  }
  let edit = await db.collection('edit').get()
  const my = edit.data.find(d => d.openId == wxContext.OPENID)
  let calc = []
  edit.data.forEach(e => {
    const diff = Math.abs(e.msg.riqi - my.msg.riqi)
    calc.push({
      diff,
      data: e
    })
  })
  calc = calc.sort((a, b) => {
    return a.diff - b.diff
  })
  const ans = []
  calc.forEach(e => {
    let r = user.data.find(u => u.openId == e.data.openId)
    if (r) ans.push(r)
  });
  return ans
}

async function initChatUser(event, wxContext) {
  const res = await db.collection('chatuser').where({
    openId: wxContext.OPENID
  }).get()

  if (!res.data.length) {
    db.collection('chatuser').add({
      data: {
        openId: wxContext.OPENID,
        time: new Date()
      }
    })
  } else {
    db.collection('chatuser').where({
      openId: wxContext.OPENID
    }).update({
      data: {
        time: new Date()
      }
    })
  }
}
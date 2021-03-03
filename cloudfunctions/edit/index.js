const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action == 'init') return initEdit(event, wxContext)
  if (event.action == 'get') return getEdit(event, wxContext)
  if (event.action == 'update') return updateEdit(event, wxContext)
  if (event.action == 'count') return countEdit(event, wxContext)
  if (event.action == 'state') return getState(event, wxContext)
}

async function getEdit(event, wxContext) {
  const res = await db.collection('edit').where({
    openId: event.openId || wxContext.OPENID
  }).get()
  const openId = res.data[0].openId
  return {
    ...res.data[0].msg,
    openId
  }
}

async function updateEdit(event, wxContext) {
  await db.collection('edit').where({
    openId: wxContext.OPENID
  }).update({
    data: {
      msg: {
        [event.name]: event.data
      }
    }
  })
  return true
}

async function initEdit(event, wxContext) {
  const res = await db.collection('edit').where({
    openId: wxContext.OPENID
  }).get()
  if (!res.data.length) {
    await db.collection('edit').add({
      data: {
        openId: wxContext.OPENID,
        msg: {
          avatar: event.avatar,
          hangye: '',
          nicheng: event.nickName,
          xingbie: '男',
          riqi: 0,
          shengao: '170cm',
          chengshi: event.province,
          biaoqian: '',
          jieshao: '',
          state: false
        }
      }
    })
  }
}

async function countEdit(event, wxContext) {
  const res = await db.collection('edit').where({
    openId: wxContext.OPENID
  }).get()
  const msgData = res.data[0].msg
  let count = 2
  for (const m in msgData) {
    if (typeof msgData[m] == "string" && msgData[m].length) count++
  }
  return {
    avatar: msgData.avatar,
    nicheng: msgData.nicheng,
    openId: wxContext.OPENID,
    count: (count / 10).toFixed(2).slice(2)
  }
}

async function getState(event, wxContext) {
  const res = await db.collection('edit').where({
    openId: wxContext.OPENID
  }).get()
  return res.data[0].msg.state
}
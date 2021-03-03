const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action == 'set') return setLike(event, wxContext)
  if (event.action == 'get') return getLike(event, wxContext)
  if (event.action == 'list') return setList(event, wxContext)
  if (event.action == 'delete') return deleteList(event, wxContext)
}

async function setLike(event, wxContext) {
  const res = await db.collection('like').where({
    openId: wxContext.OPENID,
    user: _.all([event.openId])
  }).get()
  if (res.data.length) return

  const res2 = await db.collection('like').where({
    openId: wxContext.OPENID,
    list: _.all([event.openId])
  }).get()
  if (res2.data.length) return



  const ans = await db.collection('like').where({
    openId: wxContext.OPENID
  }).get()
  if (!ans.data.length) {
    db.collection('like').add({
      data: {
        openId: wxContext.OPENID,
        user: [event.openId],
        padding: [],
        list: []
      }
    })
  } else {
    db.collection('like').where({
      openId: wxContext.OPENID
    }).update({
      data: {
        user: _.push(event.openId)
      }
    })
  }
  const other = await db.collection('like').where({
    openId: event.openId
  }).get()
  if (!other.data.length) {
    db.collection('like').add({
      data: {
        openId: event.openId,
        user: [],
        padding: [wxContext.OPENID],
        list: []
      }
    })
  } else {
    db.collection('like').where({
      openId: event.openId
    }).update({
      data: {
        padding: _.push(wxContext.OPENID)
      }
    })
  }
  return true
}

async function getLike(event, wxContext) {
  const res = await db.collection('like').where({
    openId: wxContext.OPENID
  }).get()

  if (!res.data.length) {
    db.collection('like').add({
      data: {
        openId: wxContext.OPENID,
        user: [],
        padding: []
      }
    })
    return {
      padding: []
    }
  } else {
    const paddingList = await db.collection('edit').where({
      openId: _.in(res.data[0].padding)
    }).get()
    const padding = []
    for (let i = 0; i < paddingList.data.length; i++) {
      const ele = paddingList.data[i];
      padding.push({
        avatar: ele.msg.avatar,
        nicheng: ele.msg.nicheng,
        openId: ele.openId
      })
    }
    const friendList = await db.collection('edit').where({
      openId: _.in(res.data[0].list)
    }).get()
    const list = []
    for (let i = 0; i < friendList.data.length; i++) {
      const ele = friendList.data[i];
      const groupId = [ele.openId, wxContext.OPENID].sort().join('-')
      const rooms = await db.collection('chatroom').where({
        groupId
      }).orderBy('sendTimeTS', 'desc').get()
      let lastContent = '暂无消息，和我聊一会吧..'
      let time = new Date()
      if (rooms.data.length) {
        if (rooms.data[0].msgType == "text") {
          lastContent = rooms.data[0].textContent
        } else {
          lastContent = '[图片]'
        }
        time = rooms.data[0].sendTime
      }
      list.push({
        avatar: ele.msg.avatar,
        nicheng: ele.msg.nicheng,
        openId: ele.openId,
        content: lastContent,
        time
      })
    }
    return {
      padding,
      list
    }
  }
}

async function setList(event, wxContext) {
  db.collection('like').where({
    openId: event.openId
  }).update({
    data: {
      padding: _.pull(wxContext.OPENID),
      user: _.pull(wxContext.OPENID),
      list: _.push(wxContext.OPENID)
    }
  })
  await db.collection('like').where({
    openId: wxContext.OPENID
  }).update({
    data: {
      padding: _.pull(event.openId),
      user: _.pull(event.openId),
      list: _.push(event.openId)
    }
  })
}

async function deleteList(event, wxContext) {
  db.collection('like').where({
    openId: event.openId
  }).update({
    data: {
      list: _.pull(wxContext.OPENID)
    }
  })
  await db.collection('like').where({
    openId: wxContext.OPENID
  }).update({
    data: {
      list: _.pull(event.openId)
    }
  })
}
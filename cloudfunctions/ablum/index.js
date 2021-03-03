  const cloud = require('wx-server-sdk')
  cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
  const db = cloud.database()
  const _ = db.command
  // 云函数入口函数
  exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    if (event.action == 'set') return setAblum(event, wxContext)
    if (event.action == 'get') return getAblum(event, wxContext)
    if (event.action == 'delete') return deleteAblum(event, wxContext)
    if (event.action == 'count') return countAblum(event, wxContext)
    if (event.action == 'getNum') return getNumAblum(event, wxContext)
    if (event.action == 'get8Num') return getNum8Ablum(event, wxContext)
    if (event.action == 'more') return getMoreAblum(event, wxContext)
  }

  async function setAblum(event, wxContext) {
    const search = await db.collection('ablum').where({
      openId: wxContext.OPENID
    }).get()
    let ans = []
    if (!search.data.length) {
      db.collection('ablum').add({
        data: {
          img: [...event.img],
          openId: wxContext.OPENID
        }
      })
      ans.unshift(...event.img)
    } else {
      db.collection('ablum').where({
        openId: wxContext.OPENID
      }).update({
        data: {
          img: _.unshift(...event.img)
        }
      })
      search.data[0].img.unshift(...event.img)
      ans = search.data[0].img
    }
    return ans
  }

  async function getAblum(event, wxContext) {
    const res = await db.collection('ablum').where({
      openId: wxContext.OPENID
    }).get()
    let ans = []
    if (!res.data.length) return ans
    else return res.data[0].img
  }

  async function deleteAblum(event, wxContext) {
    await db.collection('ablum').where({
      openId: wxContext.OPENID
    }).update({
      data: {
        img: _.pull(event.img)
      }
    })
    const res = await db.collection('ablum').where({
      openId: wxContext.OPENID
    }).get()
    return res.data[0].img
  }

  async function countAblum(event, wxContext) {
    const res = await db.collection('ablum').where({
      openId: wxContext.OPENID
    }).get()
    let ans = []
    if (!res.data.length) {
      db.collection('ablum').add({
        data: {
          openId: wxContext.OPENID,
          img: []
        }
      })
      return 0
    }
    return res.data[0].img.length
  }

  async function getNumAblum(event, wxContext) {
    const res = await db.collection('ablum').where({
      openId: wxContext.OPENID
    }).get()
    let ans = []
    if (!res.data.length) return {
      img: ans,
      count: 0
    }
    else return {
      img: res.data[0].img.slice(0, 4),
      count: res.data[0].img.length
    }
  }

  async function getNum8Ablum(event, wxContext) {
    const res = await db.collection('ablum').where({
      openId: event.openId || wxContext.OPENID
    }).get()
    if (!res.data.length) return {
      img: [],
      count: 0
    }
    else return {
      img: res.data[0].img.slice(0, 8),
      count: res.data[0].img.length
    }
  }

  async function getMoreAblum(event, wxContext) {
    const res = await db.collection('ablum').where({
      openId: event.openId || wxContext.OPENID
    }).get()
    if (!res.data.length) return {
      img: [],
      count: 0
    }
    else return {
      img: res.data[0].img.slice(event.start, parseInt(event.start) + 8),
      count: res.data[0].img.length
    }
  }
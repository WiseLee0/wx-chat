// miniprogram/pages/find/index.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 0,
    count: 0,
    msgData: [],
    imgList: [],
    userList: [],
    userIndex: 0,
    locationCheck: false,
    timeCheck: false
  },
  onMoreImage: function () {
    const {
      openId
    } = this.data.userList[this.data.userIndex]
    wx.cloud.callFunction({
      name: "ablum",
      data: {
        action: 'more',
        openId: openId,
        start: this.data.imgList.length
      }
    }).then(res => {
      this.setData({
        imgList: [...this.data.imgList, ...res.result.img]
      })
    })
  },
  previewImage: function (e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: this.data.imgList
    })
  },
  onMatchNext: function () {
    if (!this.data.msgData.openId) return
    wx.cloud.callFunction({
      name: "like",
      data: {
        action: 'set',
        openId: this.data.msgData.openId
      }
    }).then(() => {
      Toast.success('已发送申请');
      if (this.data.userIndex == this.data.userList.length - 1) {
        Toast.fail('没有下一个了');
        return
      }
      const index = this.data.userIndex + 1
      this.requestMsg(index)
      this.setData({
        userIndex: index
      })
    })
  },
  onNext: function () {
    if (!this.data.msgData.openId) return
    if (this.data.userIndex == this.data.userList.length - 1) {
      Toast.fail('没有下一个了');
      return
    }
    const index = this.data.userIndex + 1
    this.requestMsg(index)
    this.setData({
      userIndex: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '搜索匹配中..',
    })
    const {
      result
    } = await wx.cloud.callFunction({
      name: "chatuser",
      data: {
        action: 'all'
      }
    })
    wx.hideLoading()
    this.setData({
      userList: result
    })
    if (result.length) this.requestMsg()
  },

  requestMsg: function (index = undefined) {
    if (index == undefined) index = this.data.userIndex
    wx.showLoading({
      title: '加载中..',
    })
    const openId = this.data.userList[index].openId
    wx.cloud.callFunction({
      name: "setting",
      data: {
        action: 'get',
        openId
      }
    }).then(res => {
      this.setData({
        locationCheck: res.result.location,
        timeCheck: res.result.time,
      })
    })
    wx.cloud.callFunction({
      name: "ablum",
      data: {
        action: 'get8Num',
        openId
      }
    }).then(res => {
      this.setData({
        imgList: res.result.img,
        count: res.result.count
      })
      wx.hideLoading()
    })
    wx.cloud.callFunction({
      name: "edit",
      data: {
        action: 'get',
        openId
      }
    }).then(res => {
      this.setData({
        msgData: res.result
      })
    })
    wx.cloud.callFunction({
      name: "chatuser",
      data: {
        action: 'get',
        openId
      }
    }).then(res => {
      const diff = new Date() - new Date(res.result)
      let s = diff / 1000
      let m = diff / (1000 * 60)
      let h = diff / (1000 * 60 * 60)
      let d = diff / (1000 * 60 * 60 * 24)
      let y = diff / (1000 * 60 * 60 * 24 * 365)
      s = s > 1 ? `${Math.floor(s)}秒` : null
      m = m > 1 ? `${Math.floor(m)}分` : null
      h = h > 1 ? `${Math.floor(h)}小时` : null
      d = d > 1 ? `${Math.floor(d)}天` : null
      y = y > 1 ? `${Math.floor(y)}年` : null
      this.setData({
        time: y || d || h || m || s,
      })
    })
  },
  onHome: function () {
    wx.redirectTo({
      url: '/pages/home/index'
    })
  },
  onMessage: function () {
    wx.redirectTo({
      url: '/pages/message/index'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
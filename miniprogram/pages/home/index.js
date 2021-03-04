// miniprogram/pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ablumCount: 0,
    editCount: 0,
    avatar: ""
  },
  onGotUserInfo: function (e) {
    console.log(e.detail);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    wx.cloud.callFunction({
      name: "chatuser",
      data: {
        action: 'init',
      }
    })
    wx.cloud.callFunction({
      name: "ablum",
      data: {
        action: 'count',
      }
    }).then(res => {
      this.setData({
        ablumCount: res.result
      })
    })
    wx.cloud.callFunction({
      name: "edit",
      data: {
        action: 'count',
      }
    }).then(res => {
      this.setData({
        editCount: res.result.count,
        avatar: res.result.avatar,
      })
      wx.setStorageSync('roomUser', {
        avatar: res.result.avatar,
        nicheng: res.result.nicheng,
        openId: res.result.openId
      })
    })
  },
  onEdit: function () {
    wx.navigateTo({
      url: '/pages/edit/index',
    })
  },
  onAblum: function () {
    wx.navigateTo({
      url: '/pages/ablum/index',
    })
  },
  onFind: function () {
    wx.redirectTo({
      url: '/pages/find/index'
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
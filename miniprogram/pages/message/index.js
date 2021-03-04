import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paddingList: [],
    friendList: [],
    actionShow: false,
    state: false
  },
  onActionClose: function () {
    this.setData({
      actionShow: false
    })
  },
  onActionSelect: function (e) {
    wx.cloud.callFunction({
      name: "edit",
      data: {
        action: 'update',
        name: 'state',
        data: !this.data.state
      }
    }).then(() => {
      this.setData({
        state: !this.data.state
      })
    })
  },
  onMatch: function (e) {
    const openId = e.currentTarget.dataset.openid
    Dialog.confirm({
        title: '匹配提示',
        message: '是否同意对方请求',
      })
      .then(() => {
        wx.showLoading({
          title: '加载中..',
        })
        wx.cloud.callFunction({
          name: "like",
          data: {
            action: 'list',
            openId
          }
        }).then(() => {
          this.requestData()
        })
      })
  },
  onFind: function () {
    wx.redirectTo({
      url: '/pages/find/index'
    })
  },
  onHome: function () {
    wx.redirectTo({
      url: '/pages/home/index'
    })
  },
  onRoom: function (e) {
    const {
      openId: userId,
      nicheng
    } = e.currentTarget.dataset.msg
    const myId = wx.getStorageSync('roomUser').openId;
    const roomId = [userId, myId].sort().join(',')
    wx.navigateTo({
      url: `/pages/room/room?roomId=${roomId}&nicheng=${nicheng}`,
    })
  },
  onState: function () {
    this.setData({
      actionShow: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData()
  },

  onDeleteFriend: function (e) {
    const openId = e.currentTarget.dataset.item.openId
    Dialog.confirm({
        title: '解除匹配',
        message: '是否要解除关系，解除后不能发送消息',
      })
      .then(() => {
        wx.showLoading({
          title: '加载中..',
        })
        wx.cloud.callFunction({
          name: "like",
          data: {
            action: 'delete',
            openId
          }
        }).then(() => {
          this.requestData()
        })
      }).catch(() => {})
  },

  requestData: function () {
    wx.showLoading({
      title: '加载中..',
    })
    wx.cloud.callFunction({
      name: "like",
      data: {
        action: 'get'
      }
    }).then((res) => {
      const {
        padding,
        list
      } = res.result
      this.setData({
        paddingList: padding,
        friendList: list
      })
      wx.hideLoading()
    })

    wx.cloud.callFunction({
      name: "edit",
      data: {
        action: 'state'
      }
    }).then(res => {
      this.setData({
        state: res.result
      })
    })
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },
  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  }
})
// miniprogram/pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: "",
    fileIDs: [],
    state: false,
    avatar: "",
    imgList: [],
    count: 0,
    checked: false,
    showPopup: false,
    hangye: '',
    nicheng: '',
    xingbie: '男',
    riqi: 0,
    shengao: '',
    chengshi: '',
    biaoqian: '',
    jieshao: '',
    currentName: '',
    currentDate: new Date().getTime(),
    minDate: 0,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  previewImage: function (e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: this.data.imgList
    })
  },
  onMoreImage: function () {
    wx.cloud.callFunction({
      name: "ablum",
      data: {
        action: 'more',
        openId: this.data.openId,
        start: this.data.imgList.length
      }
    }).then(res => {
      this.setData({
        imgList: [...this.data.imgList, ...res.result.img]
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: "ablum",
      data: {
        action: 'get8Num',
        openId: options.openId
      }
    }).then(res => {
      console.log("image", res.result)
      this.setData({
        imgList: res.result.img,
        count: res.result.count,
        openId: options.openId
      })
    })
    wx.cloud.callFunction({
      name: "edit",
      data: {
        action: 'get',
        openId: options.openId
      }
    }).then(res => {
      this.setData({
        ...res.result
      })
      console.log(res.result)
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
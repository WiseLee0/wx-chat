// miniprogram/pages/edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  onAblum: function () {
    wx.navigateTo({
      url: '/pages/ablum/index',
    })
  },
  onAvatar: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.uploadImg(res.tempFilePaths)
      }
    })
  },
  uploadImg: function (tempImg) {
    wx.showLoading({
      title: '提交中',
    })
    const promiseArr = []
    for (let i = 0; i < tempImg.length; i++) {
      let filePath = tempImg[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0];
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: 'avatar/' + new Date().getTime() + suffix,
          filePath: filePath,
        }).then(res => {
          this.setData({
            avatar: res.fileID
          })
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }
    Promise.all(promiseArr).then(() => {
      wx.cloud.callFunction({
        name: "edit",
        data: {
          action: 'update',
          name: "avatar",
          data: this.data.avatar,
        }
      }).then(res => {
        wx.hideLoading()
      })
    })
  },
  onTagChange: function (event) {
    let str = event.detail
    str = str.replace(/\,+/g, ',')
    str = str.trim().replace(/\s+/g, ',')
    this.setData({
      biaoqian: str
    })
  },
  onTimeChange: function (event) {
    this.setData({
      riqi: event.detail,
    });
  },
  onPickerChange: function (e) {
    this.setData({
      xingbie: e.detail.value
    })
  },
  onPopupShow: function (e) {
    const name = e.currentTarget.dataset.name
    this.setData({
      showPopup: true,
      currentName: name
    })
  },
  onPopupClose: function () {
    const name = this.data.currentName
    wx.showLoading({
      title: '更新中',
    })
    wx.cloud.callFunction({
      name: "edit",
      data: {
        action: 'update',
        name,
        data: this.data[name]
      }
    }).then(res => {
      wx.hideLoading()
      console.log(res.result)
    })
    this.setData({
      showPopup: false
    })
  },
  onSwitchChange({
    detail
  }) {
    wx.cloud.callFunction({
      name: "edit",
      data: {
        action: 'update',
        name: "state",
        data: !this.data.state
      }
    })
    this.setData({
      state: detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: "ablum",
      data: {
        action: 'getNum',
      }
    }).then(res => {
      this.setData({
        imgList: res.result.img,
        count: res.result.count
      })
      console.log(res.result)
    })
    wx.cloud.callFunction({
      name: "edit",
      data: {
        action: 'get',
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
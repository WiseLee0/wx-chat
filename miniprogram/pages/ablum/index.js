// miniprogram/pages/ablum/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    fileIDs: [],
    imgList: [],
    show: false,
    actions: [{
      name: '删除',
    }, {
      name: '取消',
    }],
    selectImg: ''
  },
  onLongPress: function (e) {
    const selectImg = e.currentTarget.dataset.src;
    this.setData({
      show: true,
      selectImg
    })
  },
  onClose: function () {
    this.setData({
      show: false
    })
  },
  onSelect: function (e) {
    if (e.detail.name == '删除') {
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: "ablum",
        data: {
          action: 'delete',
          img: this.data.selectImg,
        }
      }).then(res => {
        wx.hideLoading()
        this.setData({
          imgList: res.result
        })
        console.log(res.result)
      })
    }
  },
  afterRead(event) {
    const {
      file
    } = event.detail;
    this.uploadImg([file.url])
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
          cloudPath: 'ablum/' + new Date().getTime() + suffix,
          filePath: filePath,
        }).then(res => {
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }
    Promise.all(promiseArr).then(() => {
      wx.cloud.callFunction({
        name: "ablum",
        data: {
          action: 'set',
          img: this.data.fileIDs,
        }
      }).then(res => {
        wx.hideLoading()
        this.setData({
          imgList: res.result,
          fileIDs: [],
          fileList: []
        })
      })
    })
  },
  previewImage: function (e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: "ablum",
      data: {
        action: 'get',
      }
    }).then(res => {
      this.setData({
        imgList: res.result
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
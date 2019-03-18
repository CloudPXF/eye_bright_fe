// pages/feedback/feedback.js
var app = getApp();
var config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 输入
   */
  inputVal: function(e) {
    let that = this;
    that.setData({
      valInput: e.detail.value
    })
  },

  /**
   * 反馈提交
   */
  feedbackSubmit: function(e) {
    let that = this;
    if(that.data.valInput) {
      wx.request({
        url: config.service.feedback,
        method: "post",
        data: {
          uid: app.globalData.uid,
          text: that.data.valInput
        },
        success: res => {
          if (!res.data.errorCode) {
            wx.showToast({
              title: '提交成功',
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            },1500)
          } else {
            wx.showToast({
              title: '提交失败',
              icon: "none"
            })
          }
        }
      })
    }else {
      wx.showToast({
        title: '内容不能为空',
        icon: "none"
      })
    }
    
  }
})
// pages/apointment_detail/apointment_detail.js
var config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifShowModal: false,
    message: {},
    ifShowComment: false,
    aid: "",
    textInput: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.appointmentDetail(options.id);
    that.setData({
      aid: options.id
    })
  },

  /**
   * 显示取消预约弹窗
   */
  showCancelModal: function(e) {
    let that = this;
    that.setData({
      ifShowModal: true
    })
  },

  /**
   * 隐藏取消预约弹窗
   */
  hideCancelModal: function(e) {
    let that = this;
    that.setData({
      ifShowModal: false,
    })
  },

  /**
   * 显示评论页面
   */
  showCommentPage: function(e) {
    let that = this;
    wx.request({
      url: config.service.checkComment,
      method: "post",
      data: {
        aid: that.data.aid,
      },
      success: res => {
        if (!res.data.errorCode) {
          wx.showToast({
            title: '您已经评论过了。',
            icon: "none"
          })
        } else if (res.data.errorCode == 2) {
          that.setData({
            ifShowComment: true
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      }
    })
    
  },

  /**
   * 预约详情
   */
  appointmentDetail: function(aid) {
    let that = this;
    wx.request({
      url: config.service.appointmentDetail,
      method: "post",
      data: {
        aid: aid,
      },
      success: res=> {
        if(!res.data.errorCode) {
          that.setData({
            message: res.data.message,
          })
        }
      }
    })
  },

  /**
   * 取消预约
   */
  cancelAppointment: function(e) {
    let that = this;
    wx.request({
      url: config.service.cancelAppointment,
      method: "post",
      data: {
        aid: that.data.aid,
      },
      success: res => {
        if(!res.data.errorCode) {
          wx.showToast({
            title: '取消成功',
          })
          that.appointmentDetail(that.data.aid);
          that.setData({
            ifShowModal: false,
          })
        }
      }
    })
  },

  /**
   * 输入
   */
  inputText: function(e) {
    let that = this;
    that.setData({
      textInput: e.detail.value,
    })
  },

  /**
   * 评论
   */
  comment: function(e) {
    let that = this;
    if(that.data.textInput) {
      wx.request({
        url: config.service.comment,
        method: "post",
        data: {
          aid: that.data.aid,
          did: that.data.message.did,
          uid: that.data.message.uid,
          content: that.data.textInput,
        },
        success: res => {
          if (!res.data.errorCode) {
            wx.showToast({
              title: '评论成功',
            })
            that.appointmentDetail(that.data.aid)
            that.setData({
              ifShowComment: false
            })
          } else {
            wx.showToast({
              title: '评论失败' + res.data.message,
              icon: "none",
            })
          }
        }
      })
    }
    }
    
})
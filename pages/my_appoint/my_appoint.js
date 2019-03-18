// pages/my_appoint/my_appoint.js
var config = require("../../config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appointmentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getAppointmentList();
  },

  /**
   * 跳转到预约详情
   */
  toAppointmentDetail: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../appointment_detail/appointment_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 获取预约列表
   */
  getAppointmentList: function() {
    let that = this;
    wx.request({
      url: config.service.appointmentList,
      method: "post",
      data: {
        uid: app.globalData.uid,
      },
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            appointmentList: res.data.message
          })
        }
      }
    })
  }
})
// pages/request_detail/request_detail.js
var config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    problemDetail: {},
    config: config,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.id) {
      that.getProblemDetail(options.id);
    }
  },

  /**
   * 获取问答详情
   */
  getProblemDetail: function(id) {
    let that = this;
    wx.request({
      url: config.service.getProblemDetail,
      method: "post",
      data: {
        pid: id,
      },
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            problemDetail: res.data.problem
          })
        }
      }
    })
  },

  /**
   * 跳转到医生详情
   */
  toDoctorDetail: function(e) {
    let that = this;
    let id = that.data.problemDetail.doctor_info.uid;
    let time = new Date();
    wx.navigateTo({
      url: '../doctor_detail/doctor_detail?id=' + id + "&time=" + time,
    })
  }
})
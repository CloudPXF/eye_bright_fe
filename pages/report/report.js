// pages/report/report.js
var app = getApp();
var config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportDetail: {},
    str1: "",
    str2: "",
    str3: "",
    str4: "",
    str5: "",
    config: config,
    strs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.id) {
      that.getReportDetail(options.id);
    }else {
      wx.navigateBack({
        
      })
    }
  },

  /**
   * 获取报告详情
   */
  getReportDetail: function(id) {
    let that = this;
    wx.request({
      url: config.service.getPresentationDetail,
      method: "post",
      data: {
        id: id
      },
      success: res => {
        if(!res.data.errorCode) {
          let list = [];
          if (res.data.str1) {
            list.push(res.data.str1);
          }
          if (res.data.str2) {
            list.push(res.data.str2);
          }
          if (res.data.str3) {
            list.push(res.data.str3);
          }
          if (res.data.str4) {
            list.push(res.data.str4);
          }
          if (res.data.str5) {
            list.push(res.data.str5);
          }
          that.setData({
            reportDetail: res.data.message,
            str1: res.data.str1,
            str2: res.data.str2,
            str3: res.data.str3,
            str4: res.data.str4,
            str5: res.data.str5,
            strs: list
          })
        }
      }
    })
  },

})
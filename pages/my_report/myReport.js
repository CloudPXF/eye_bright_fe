// pages/my_report/myReport.js
var app = getApp();
var config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportList: [
      // {"id": "1", "name": "林晓面", "sex": 1, "report_title": "2018年青少年视光报告", "create_time": "2018-10-25"},
      // { "id": "1", "name": "林晓面", "sex": 1, "report_title": "2018年青少年视光报告", "create_time": "2018-10-25" },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getReportList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 跳转到报告详情
   */
  toReportDetail: function(e) {
    let that = this;
    if(e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '../report/report?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  /**
   * 获取报告列表
   */
  getReportList: function() {
    let that = this;
    wx.request({
      url: config.service.getPresentationList,
      method: "post",
      data: {
        uid: app.globalData.uid
      },
      success: res => {
        if(!res.data.errorCode) {
          console.log(res.data.message);
          that.setData({
            reportList: res.data.message
          })
        }
      }
    })
  }
})
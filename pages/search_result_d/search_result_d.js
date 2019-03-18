// pages/search_result_d/search_result_d.js
var app = getApp();
var config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_val: "",
    doctorList: [
      // {
      //   "id": "0", name: "李莹莹", avatar: "../../images/avatar_demo.png", ex: "主治医生", status: "1", word: ["眼底病", "青光眼"], introduction: "中山眼科中心博士擅长常见眼科疾病，新生儿先天近视，青光眼，儿童眼科疾病...主治医生首诊 / 复诊：200元 / 100元"
      // },
      // {
      //   "id": "0", name: "李莹莹", avatar: "../../images/avatar_demo.png", ex: "主治医生", status: "1", word: ["眼底病", "青光眼"], introduction: "中山眼科中心博士擅长常见眼科疾病，新生儿先天近视，青光眼，儿童眼科疾病...主治医生首诊 / 复诊：200元 / 100元"
      // },
    ],
    config: config,
    time: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.value) {
      that.setData({
        search_val: options.value,
        time: options.time
      })
      that.storeSearch(options.value,options.time);
    }
  },

  /**
   * 预约-》 搜索
   */
  storeSearch: function (val,time) {
    let that = this;
    wx.request({
      url: config.service.storeSearch,
      method: "post",
      data: {
        time: time,
        keyword: val,
      },
      success: res => {
        if (!res.data.errorCode) {
          that.setData({
            doctorList: res.data.message
          })
        }
      }
    })
  },

  /**
   * 输入
   */
  inputSearching: function(e) {
    let that = this;
    that.setData({
      search_val: e.detail.value
    })
  },

  deleteSearching: function(e) {
    let that = this;
    that.setData({
      search_val: "",
    })
  },

  /**
   * 搜索
   */
  searchByVal:function(e) {
    let that = this;
    if(that.data.search_val) {
      that.storeSearch(that.data.search_val, that.data.time);
    }else {
      wx.showToast({
        title: '内容不能为空',
        icon: "none"
      })
    }
  },

  toDoctorDetail: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../appointment_detail/appointment_detail?id=' + e.currentTarget.dataset.id + "&time=" + that.data.time,
    })
  }
  
})
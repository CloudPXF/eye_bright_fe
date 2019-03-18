// pages/appoint_online/appoint_online.js
var config = require("../../config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifShowModal: false,
    sid: "",
    did: "",
    time: "",
    hour: "",
    timeMonth: "",
    timeDate: "",
    nameInput: "",
    telInput: "",
    declaration: "",
    storeMessage: {},
    d_name: "",
    timeYear: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let date = new Date(options.time);
    that.setData({
      sid: options.sid,
      did: options.did,
      d_name: options.d_name,
      time: options.time,
      hour: options.hour,
      timeMonth: date.getMonth() + 1,
      timeDate: date.getDate(),
      timeYear: date.getFullYear()
    })
    that.getstoreBySid(options.sid);
  },

  /**
   * 显示弹窗
   */
  showModal: function(e) {
    let that = this;
    that.setData({
      ifShowModal: true
    })
  },

  /**
   * 提交预约
   */
  submitAppointment: function(e) {
    let that = this;
    that.submitForm();
  },

  hideModal: function(e) {
    let that = this;
    that.setData({
      ifShowModal: false
    })
    setTimeout(function() {
      wx.redirectTo({
        url: '../my_appoint/my_appoint',
      })
    }, 500)
  },

  /**
   * 输入
   */
  inputPatient: function(e) {
    let that = this;
    that.setData({
      nameInput: e.detail.value
    })
  },
  inputTel: function(e) {
    let that = this;
    that.setData({
      telInput: e.detail.value
    })
  },
  inputText: function(e) {
    let that = this;
    that.setData({
      declaration: e.detail.value
    })
  },

  /**
   * 提交预约
   */
  submitForm: function() {
    let that = this;
    let date = new Date(that.data.time);
    let about_date = "";
    let about_month = Math.floor(date.getMonth() + 1);
    let about_day = Math.floor(date.getDate());
    if (about_month < 10 && about_day < 10) {
      about_date = date.getFullYear() + "-0" + about_month + "-0" + about_day;
    }else if(about_month < 10) {
      about_date = date.getFullYear() + "-0" + about_month + "-" + about_day;
    }else if(about_day < 10) {
      about_date = date.getFullYear() + "-" + about_month + "-0" + about_day;
    }else {
      about_date = date.getFullYear() + "-" + about_month + "-" + about_day;
    }
    if (that.data.nameInput && that.data.telInput && that.data.declaration) {
      wx.request({
        url: config.service.appoint,
        method: "post",
        data: {
          sid: that.data.sid,
          did: that.data.did,
          uid: app.globalData.uid,
          about_date: about_date,
          about_time: that.data.hour,
          tel: that.data.telInput,
          name: that.data.nameInput,
          describe: that.data.declaration,
        },
        success: res => {
          if (!res.data.errorCode) {
            that.setData({
              ifShowModal: true
            })
          }else {
            wx.showToast({
              title: res.data.message,
              icon: "none",
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '信息不能为空',
        icon: "none"
      })
    }

  },

  /**
   * 获取诊所信息
   */
  getstoreBySid: function(sid) {
    let that = this;
    wx.request({
      url: config.service.getstoreBySid,
      method: "post",
      data: {
        sid: sid,
      },
      success: res => {
        if (!res.data.errorCode) {
          that.setData({
            storeMessage: res.data.message,
          })
        }
      }
    })
  },

  
})
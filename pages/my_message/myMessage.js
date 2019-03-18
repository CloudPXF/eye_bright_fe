// pages/my_message/myMessage.js
var app = getApp();
var config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexList: [
      {"id": 0, "name": "男"},
      { "id": 1, "name": "女" },      
    ],
    sexChoose: 0,
    dateChoose: "2018-10-26",
    locationChoose: ["广东省", "广州市", "天河区"],
    userInfo_sys: "",
    name_input: "",
    tel_input: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    if(app.globalData.uid) {
      that.getUserInfoByUid();
    }
  },

  /**
   * 性别选择
   */
  sexChoosing: function(e) {
    let that = this;
    // console.log(e.detail.value);
    that.setData({
      sexChoose: e.detail.value
    })
  },

  /**
   * 日期选择
   */
  dateChoosing: function(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      dateChoose: e.detail.value
    })
  },

  /**
   * 地域选择
   */
  locationChoosing: function(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      locationChoose: e.detail.value
    })
  },

  /**
   * 输入电话
   */
  inputTel: function(e) {
    let that = this;
    that.setData({
      tel_input: e.detail.value
    })
  },

  /**
   * 输入姓名
   */
  inputName: function(e) {
    let that = this;
    that.setData({
      name_input: e.detail.value
    })
  },

  /**
   * 完善信息
   */
  finishMessage: function(e) {
    let that = this;
    that.addUserInfo();
  },

  /**
   * 完善用户信息
   */
  addUserInfo: function () {
    let that = this;
    if (that.data.name_input && that.data.tel_input && (Math.abs(that.data.sexChoose) + 1) && that.data.dateChoose && that.data.locationChoose.length) {
      wx.request({
        url: config.service.addUserInfo,
        method: "post",
        data: {
          uid: app.globalData.uid,
          name: that.data.name_input,
          sex: (Math.abs(that.data.sexChoose) + 1),
          birthday: that.data.dateChoose,
          tel: that.data.tel_input,
          province: that.data.locationChoose[0],
          city: that.data.locationChoose[1],
          area: that.data.locationChoose[2]
        },
        success: res => {
          if (!res.data.errorCode) {
            // console.log(res.data.message);
            wx.showToast({
              title: '完善信息成功',
            })
            setTimeout(function() {
              wx.navigateBack({
                
              })
            },1500)
          }else {
            wx.showToast({
              title: '完善信息失败',
              icon: "none"
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请填写完整信息',
        icon: "none"
      })
    }
    
  },

  /**
   * 获取用户信息
   */
  getUserInfoByUid: function () {
    let that = this;
    wx.request({
      url: config.service.getUserInfo,
      method: "post",
      data: {
        uid: app.globalData.uid
      },
      success: res => {
        if (!res.data.errorCode) {
          // console.log(res.data.message);
          let city = ["请选择","",""]
          if(res.data.message.user_info) {
            city = [res.data.message.user_info.province, res.data.message.user_info.city, res.data.message.user_info.area];
            that.setData({
              userInfo: res.data.message,
              userInfo_sys: res.data.message.user_info,
              name_input: res.data.message.user_info.name,
              // sexChoose: res.data.message.sex - 1,
              sexChoose: 0,              
              locationChoose: city,
              dateChoose: res.data.message.user_info.birthday,
              tel_input: res.data.message.user_info.tel
            })
          }else {
            that.setData({
              userInfo: res.data.message,
              userInfo_sys: "",
              name_input: "",
              sexChoose: res.data.message.sex - 1,
              locationChoose: city,
            })
          }
          
        }
      }
    })
  },
})
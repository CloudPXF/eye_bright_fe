// pages/getOpenid/getOpenid.js
const app = getApp()
var config = require("../../config.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      that.loginWithOpenid();
      console.log("情况1");
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log("情况2");
        that.loginWithOpenid();
      }
      console.log("情况3");
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          console.log("情况4");
        }
      })
      console.log("情况5");
    }
  },

  getUserInfo: function (e) {
    let that = this;
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    that.loginWithOpenid();
  },

  loginWithOpenid: function () {
    let that = this;
    wx.login({
      success: res => {
        //console.log(res.code);
        wx.request({
          url: config.service.getOpenid,
          method: "post",
          data: {
            code: res.code
          },
          success: ress => {
            console.log(ress.data.message.u_openid)
            if (!ress.data.errorCode) {
              app.globalData.openId = ress.data.message.u_openid.openid;
              that.setData({
                openId: ress.data.message.u_openid.openid
              })
              that.userLogin(ress.data.message.u_openid.session_key);
            }
          },
          fail: ress => {
            wx.showToast({
              title: '获取openid失败',
              icon: "none"
            })
          }
        })
      }
    })
  },

  /**
   * 用户登陆
   */
  userLogin: function (sessionKey) {
    let that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res);
        wx.request({
          url: config.service.getUnionid,
          method: "post",
          data: {
            sessionKey: sessionKey,
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: ress => {
            if (!ress.data.errorCode) {
              console.log(ress.data)
              wx.request({
                url: config.service.login,
                method: "post",
                data: {
                  openid: app.globalData.openId,
                  unionid: ress.data.message,
                  nickName: that.data.userInfo.nickName,
                  gender: that.data.userInfo.gender,
                  avatarUrl: that.data.userInfo.avatarUrl,
                  country: that.data.userInfo.country,
                  province: that.data.userInfo.province,
                  city: that.data.userInfo.city
                },
                success: resd => {
                  if (!resd.data.errorCode) {
                    console.log("获取uid成功：" + resd.data.message);
                    app.globalData.uid = resd.data.message;
                    // wx.showModal({
                    //   title: '',
                    //   content: '报告查询功能已开通，其他功能将于12月陆续上线，敬请期待！',
                    //   showCancel: false,
                    //   success: res => {
                    //     if(res.confirm) {
                    //       that.getUserInfoByUid();
                    //     }
                    //   }
                    // })
                    wx.navigateBack({
                      
                    })
                  } else {
                    wx.showToast({
                      title: resd.data.message,
                      icon: "none"
                    })
                  }
                },
                fail: resd => {
                  wx.showToast({
                    title: '登录请求失败',
                    icon: "none"
                  })
                  console.log("登录请求失败")
                }
              })
            }
          },
          fail: ress => {
            wx.showToast({
              title: '获取unioid失败',
              icon: "none",
            })
          }
        })
      }
    })

  },
})
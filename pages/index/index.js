//index.js
//获取应用实例
const app = getApp()
var config = require("../../config.js");
var util = require("../../utils/util.js");
var wxParse =require("../../wxParse/wxParse.js");
var htmlpar = require("../../wxParse/html2json.js");
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tab: 0,
    requestList: [],
    textureList: [],
    questionList: [], 
    indexSearchWords: [],
    questionWordList: [],
    openId: "",
    swiperList: [],
    config: config,
    userInfo_sys: "",
    dateList: [],
    dateArray: [],
    currentSelectDate: 0,
    today: {"year": "", "month": "", date: "", day: ""},
    selectDay: { "year": "", "month": "", date: "", day: ""},
    shopList: [
      // { id: "0", "name": "睛亮眼科诊所（广州）", location: "广州市越秀区环市东路403号广州国际电子大厦", "time": "8:30—18:30"},
      // { id: "1", "name": "睛亮眼科诊所（广州）", location: "广州市越秀区环市东路403号广州国际电子大厦", "time": "8:30—18:30" },
    ],
    isQuestionCruxShowMore: false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    let that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      that.loginWithOpenid();
      console.log("情况1");
    } else if (this.data.canIUse){
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
    that.getSwiperImgs();
    that.getIndexList();
    that.getStoreList();//预约-》诊所列表
    that.getProblemList();//问答-》获取所有问答列表
    if(options.tab >= 0) {
      that.setData({
        tab: options.tab
      })
      console.log("shareTab:" + options.tab)
    }
  },

  getUserInfo: function(e) {
    let that = this;
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    that.loginWithOpenid();
  },
  
  onReady: function() {
    let that = this;
    var date = new Date();
    var today = that.data.today;
    today.year = date.getFullYear();
    today.month = date.getMonth() + 1;
    today.date = date.getDate();
    today.day = date.getDay();
    var dateList = util.dateList(date);
    let list = [];
    for(let i in dateList) {
      list.push(dateList[i].getDate());
    }
    that.setData({
      dateList: dateList,
      dateArray: list,
      today: today,
      selectDay: today,
      currentSelectDate: today.day,
    })
  },

  onShow: function() {
    let that = this;
    if(that.data.tab == 1) {
      that.getProblemList();
    }
  },
  
  /**
   * 分享
   */
  onShareAppMessage: function(e) {
    let that = this;

    return {
      title: '睛亮眼科',
      path: '/pages/index/index?tab='  + that.data.tab,
      imageUrl: "",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
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
      success: res=> {
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
            if(!ress.data.errorCode) {
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
                  }else {
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

  /**
   * 获取用户信息
   */
  getUserInfoByUid: function() {
    let that = this;
    wx.request({
      url: config.service.getUserInfo,
      method: "post",
      data: {
        uid: app.globalData.uid
      },
      success: res => {
        if(!res.data.errorCode) {
          console.log(res.data.message)
          if(!res.data.message.user_info) {
            wx.navigateTo({
              url: '../my_message/myMessage',
            })
          }
        }
      }
    })
  },

  /**
   * 获取轮播图
   */
  getSwiperImgs: function() {
    let that = this;
    wx.request({
      url: config.service.getSwiperImgs,
      method: 'post',
      data: {
        
      },
      success: res => {
        if(!res.data.errorCode) {
          let list = [];
          for(let i in res.data.message) {
            // console.log(res.data.message[i]);
            list.push(res.data.message[i].url);
          }
          that.setData({
            swiperList: list
          })
        }
      }
    })
  },
 
  /**
   * tabBar
   */
  changeTab: function(e) {
    let that = this;
    // console.log(e.currentTarget.dataset.id);
      that.setData({
        tab: e.currentTarget.dataset.id
      })
    if(e.currentTarget.dataset.id == 1) {
      that.getProblemList();
    }
    // that.setData({
    //   tab: e.currentTarget.dataset.id
    // })
  },
  /**
   * 问答-》选择关键词
   */
  chooseKeyWord: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.id;
    let wordList = that.data.questionWordList;
    for(let i in wordList) {
      if(i == index) {
        wordList[i].isChosen = true;
      }else {
        wordList[i].isChosen = false;
      }
    }
    that.setData({
      questionWordList: wordList
    })
    wx.showLoading({
      title: '搜索中',
    })
    setTimeout(function() {
      wx.hideLoading();
      wx.navigateTo({
        url: '../search_result/searchResult?type=1&value=' + wordList[index].crux,
      })
    },500)
  },

  /**
   * 我的-》跳转到检查报告
   */
  toMyReport: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../my_report/myReport',
    })
  },

  /**
   * 我的-》个人信息
   */
  toMyMessage: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../my_message/myMessage',
    })
  },

  /**
   * 我的-》跳转到反馈
   */
  toFeedback: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  /**
   * 问答-》跳转到发布问题
   */
  toPublish: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../publish/publish?identify=0' ,
    })
  },

  /**
   * 我的-》跳转到我的问答
   */
  toMyQuestion: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../my_question/myQuestion',
    })
  },

  /**
   * 首页-》跳转到检查报告
   */
  toReport: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../my_report/myReport',
    })
  },

  /**
   * 首页-》跳转到问答
   */
  toQuestion: function(e) {
    let that = this;
    that.setData({
      tab: 1
    })
  },

  /**
   * 首页-》跳转到科普
   */
  toSciene: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../sciene/sciene',
    })
  },

  /**
   * 首页-》跳转到首页
   */
  toAppoint: function(e) {
    let that = this;
    that.setData({
      tab: 2,
    })
  },

  /**
   * 首页-》搜索结果
   */
  intoSearch: function(e) {
    let that = this;
    if(e.detail.value && true) {
      wx.navigateTo({
        url: '../search_result/searchResult?type=3&value=' + e.detail.value,
      })
    }
  },

  /**
   * 预约-》搜索医生
   */
  intoSearchDoctor: function(e) {
    let that = this;
    if(e.detail.value && true) {
      wx.navigateTo({
        url: '../search_result_d/search_result_d?value=' + e.detail.value + "&time=" + that.data.dateList[that.data.currentSelectDate],
      })
    }
  },

  /**
   * 问答-》搜索
   */
  searchQuestion: function(e) {
    let that = this;
    if(e.detail.value) {
      wx.navigateTo({
        url: '../search_result/searchResult?type=1&value=' + e.detail.value,
      })
    }
  },

  /**
   * 首页-》跳转到文章详情
   */
  toTextureDetail: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../sciene_detail/scieneDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 首页/问答-》跳转到问题详情
   */
  toQuestionDetail: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../request_detail/request_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 预约-》选择时间
   */
  selectDate: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    var selectDay = that.data.selectDay;
    if(index >= that.data.today.day && index < that.data.today.day + 15) {
      selectDay.year = that.data.dateList[index].getFullYear();
      selectDay.month = that.data.dateList[index].getMonth() + 1;
      selectDay.date = that.data.dateList[index].getDate();
      selectDay.day = that.data.dateList[index].getDay();
      that.setData({
        currentSelectDate: e.currentTarget.dataset.index,
        selectDay: selectDay
      })
    }
    
  },

  /**
   * 预约-》跳转到预约列表
   */
  toAppointList: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../appoint/appoint?id=' + e.currentTarget.dataset.id + "&date=" + that.data.dateList[that.data.currentSelectDate],
    })
  },

  //首页-》获取列表
  getIndexList: function() {
    let that = this;
    wx.request({
      url: config.service.index,
      method: "post",
      data: {

      },
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            requestList: res.data.problem,
            indexSearchWords: res.data.crux,
            textureList: res.data.article,
          })
        }
      }
    })
  },

  /**
   * 问答-》获取问答列表
   */
  getProblemList: function() {
    let that = this;
    wx.request({
      url: config.service.getProblemList,
      data: {},
      method: "post",
      success: res => {
        if(!res.data.errorCode) {
          if (res.data.crux) {
            that.setData({
              questionWordList: res.data.crux,
            })
          }
          if (res.data.problem) {
            that.setData({
              questionList: res.data.problem
            })
          }
        }
      }
    })
  },

  /**
   * 我的-》跳转到我的预约
   */
  toMyAppointment: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../my_appoint/my_appoint',
    })
  },

  /**
   * 预约-》获取诊所列表
   */
  getStoreList: function() {
    let that = this;
    wx.request({
      url: config.service.storeList,
      method: "post",
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            shopList: res.data.message
          })
        }
      }
    })
  },

  /**
   * 问答-》显示更多关键词
   */
  showQuestionCruxMore: function(e) {
    let that = this;
    that.setData({
      isQuestionCruxShowMore: !that.data.isQuestionCruxShowMore,
    })
  },

  
})

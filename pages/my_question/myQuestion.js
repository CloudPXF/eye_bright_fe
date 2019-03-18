// pages/my_question/myQuestion.js
var app = getApp();
var config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identify: 0,
    currentNav: 0,
    questionList: [
      // {
      //   "id": "", "question_content": "我儿子今年七岁了，却已经近视400度，请问有什么有效的方法进行矫正或者控制一下度数？", "question_img": ["../../images/report_demo_img.png", "../../images/report_demo_img.png", "../../images/report_demo_img.png"], "time": "2018-05-30", status: 0, "sender": "me", "answer_content": " 您好，近视不只是配镜，不同的人，不同的需求，有不同的控制度数增长的近视防控方案。方案也会根据不同年龄不同情况去进行安排，青少年在身体器官还青少年在身体器官还青少年在身体器官还..."},
      // {
      //   "id": "", "question_content": "我儿子今年七岁了，却已经近视400度，请问有什么有效的方法进行矫正或者控制一下度数？", "question_img": ["../../images/report_demo_img.png", "../../images/report_demo_img.png", "../../images/report_demo_img.png"], "time": "2018-05-30", status: 0, "sender": "", "answer_content": ""
      // },
    ],
    questionListA: [

    ],
    config: config,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getUserIdentify();
    that.getProblemListP();
    that.getProblemListA();
  },

  onShow: function() {
    let that = this;
    that.getUserIdentify();
    that.getProblemListP();
    that.getProblemListA();
  },

  /**
   * 转换选项
   */
  changeNav: function(e) {
    let that = this;
    that.setData({
      currentNav: e.currentTarget.dataset.id
    })
    if(e.currentTarget.dataset.id == 1) {
      that.getProblemListA();
    }else {
      that.getProblemListP();
    }
  },
  
  /**
   * 图片预览
   */
  previewImg: function(e) {
    var url = e.currentTarget.dataset.url;
    console.log(url)
    wx.previewImage({
      urls: [url],
    })
  },

  /**
   * 回复
   */
  resposeQuestion: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../publish/publish?identify=1&id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 跳转到详情
   */
  toDetail: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../request_detail/request_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 获取身份信息
   */
  getUserIdentify: function() {
    let that= this;
    wx.request({
      url: config.service.userIdentify,
      method: "post",
      data: {
        uid: app.globalData.uid,
      },
      success: res => {
        if(!res.data.errorCode) {
          if(res.data.message == "20") {
            that.setData({
              identify: 1
            })
          }else {
            that.setData({
              identify: 0
            })
          }
        }
      }
    })
  },

  /**
   * 问题列表/发出
   */
  getProblemListP: function() {
    let that = this;
    wx.request({
      url: config.service.userProblem,
      method: "post",
      data: {
        uid: app.globalData.uid,
      },
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            questionList:res.data.message
          })
        }
      }
    })
  },

  /**
   * 问题列表/收到
   */
  getProblemListA: function() {
    let that = this;
    wx.request({
      url: config.service.doctorProblemList,
      method: "post",
      data: {
        uid: app.globalData.uid,
      },
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            questionListA: res.data.message
          })
        }
      }
    })
  }
})
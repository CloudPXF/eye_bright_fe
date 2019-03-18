// pages/appoint/appoint.js
var config = require("../../config.js");
var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sid: "",
    month: "",
    date: "",
    day: "",
    doctorList: [
      // {
      //   "id": "0", name: "李莹莹", avatar: "../../images/avatar_demo.png", ex: "主治医生", status: "1", word: ["眼底病", "青光眼"], introduction: "中山眼科中心博士擅长常见眼科疾病，新生儿先天近视，青光眼，儿童眼科疾病...主治医生首诊 / 复诊：200元 / 100元"
      // },
      // {
      //   "id": "0", name: "李莹莹", avatar: "../../images/avatar_demo.png", ex: "主治医生", status: "2", word: ["眼底病", "青光眼"], introduction: "中山眼科中心博士擅长常见眼科疾病，新生儿先天近视，青光眼，儿童眼科疾病...主治医生首诊 / 复诊：200元 / 100元"
      // },
    ],
    time: "",
    config: config,
    dateList: [],
    dateArray: [],
    today: "",
    currentSelectDate: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let date = new Date(options.date);
    let today = new Date();
    if(options.date) {
      that.setData({
        currentDate: options.date,
        sid: options.id,
        month: date.getMonth() + 1,
        date: date.getDate(),
        day: date.getDay(),
        time: date,
        today: today,
      })
      that.getDateList();
      setTimeout(function() {
        that.getDoctorList();
        for(let i = 0; i < that.data.dateList.length; i++) {
          let day_before = new Date(that.data.time);
          let day_after = new Date(that.data.dateList[i]);
          if (day_before.getMonth() == day_after.getMonth() && day_before.getDate() == day_after.getDate()) {
            that.setData({
              currentSelectDate: i,
            })
            
          }
        }
      },500)
     
      
    }
  },

  getDateList: function() {
    let that = this;
    var date = new Date();
    var today = that.data.today;
    today.year = date.getFullYear();
    today.month = date.getMonth() + 1;
    today.date = date.getDate();
    today.day = date.getDay();
    var dateList = util.dateList(date);
    let list = [];
    for (let i in dateList) {
      list.push(dateList[i].getDate());
    }
    that.setData({
      dateList: dateList,
      dateArray: list,
      today: today,
    })
  },

  /**
   * 选择上一天
   */
  chooseBeforeDay: function(e) {
    let that = this;
    let date = new Date(that.data.time);
    date = date.setDate(date.getDate() - 1);
    date = new Date(date);
    let today = new Date(that.data.today);
    let ss = Math.round((date - today) / (60 * 60 * 24 * 1000));
    // console.log(ss);
    if(ss >= 0) {
      that.setData({
        time: date,
        month: date.getMonth() + 1,
        date: date.getDate(),
        day: date.getDay(),
        currentSelectDate: that.data.currentSelectDate - 1,
      })
    }else {
      wx.showModal({
        title: '',
        content: '不在有效预约时间内',
      })
    }
    that.getDoctorList();
  }
  ,

  /**
   * 选择下一天
   */
  chooseNextDay: function(e) {
    let that = this;
    let date = new Date(that.data.time);
    date = date.setDate(date.getDate() + 1);
    // console.log(date);
    date = new Date(date);
    let today = new Date(that.data.today);
    let ss = Math.round((date - today) / (60 * 60 * 24 * 1000));
    // console.log(ss);
    if(ss <= 14){
      that.setData({
        time: date,
        month: date.getMonth() + 1,
        date: date.getDate(),
        day: date.getDay(),
        currentSelectDate: that.data.currentSelectDate + 1,
      })
    }else {
      wx.showModal({
        title: '',
        content: '不在有效预约时间内',
      })
    }
    that.getDoctorList();
  },

  /**
   * 跳转到详情
   */
  toDetail: function(e) {
    let that = this;
    // if(e.currentTarget.dataset.status == "10") {
      wx.navigateTo({
        url: '../doctor_detail/doctor_detail?time=' + that.data.time + "&id=" + e.currentTarget.dataset.id,
      })
    // }else {
    //   wx.showModal({
    //     title: '',
    //     content: '当前状态不可预约',
    //   })
    // }
    
  },

  /**
   * 获取医生列表
   */
  getDoctorList: function() {
    let that = this;
    let sid = that.data.sid;
    let time = that.data.time;
    let date = new Date(time);
    wx.request({
      url: config.service.doctorList,
      method: "post",
      data: {
        sid: sid,
        time: date.getFullYear() + "-" + Math.floor(date.getMonth() + 1) + "-" + date.getDate(),
      },
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            doctorList: res.data.message
          })
        }
      }
    })
  },
})
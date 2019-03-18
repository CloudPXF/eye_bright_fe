// pages/doctor_detail/doctor_detail.js
var config = require("../../config.js");
var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doctorInfo: {
      "d_name": "",
      "title": "",
      "introduction": "中山眼科中心眼科博士、广东省视光学学会教育专委会委员擅长青少年近视防控及各类常见眼病的诊断及治疗 ",
      commentList: [],
    },
    likeList: [
      "双眼视功能","青少年近视防控","斜弱视治疗","青光眼","高度近视健康管理"
    ],
    dateList: [],
    dateArray: [],//日期
    today: {},
    currentNav: 0,
    currentChoose: "",
    ifShowChooseTimer: false,
    did: "",
    time: "",
    config: config,
    commentList: [],
    timeList: [],
    appointTimeList: [],
    storeMessage: {},
    ifShowButton: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      did: options.id,
      time: options.time,
    })
    setTimeout(function() {
      that.getDoctorDetail(options.id);
      that.getDateList();
    },200)
    
  },

  onShow: function() {
    console.log("uid:"  + app.globalData.uid)
    if(!app.globalData.uid) {
      wx.showToast({
        title: '未能获取uid',
        icon: "none"
      })
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/getOpenid/getOpenid',
        })
      },800)
      
    }
  },

  onShareAppMessage: function(e) {
    let that = this;
    return {
      title: '睛亮眼科',
      path: '/pages/doctor_detail/doctor_detail?id=' + that.data.did + "&time=" + that.data.time,
      imageUrl: "",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },

  /**
   * 获取日期
   */
  getDateList: function() {
    let that = this;
    let today = that.data.today;
    let currentDate = new Date();
    today.year = currentDate.getFullYear();
    today.month = currentDate.getMonth() + 1;
    today.date = currentDate.getDate();
    today.day = currentDate.getDay();
    let dateList = util.dateList(currentDate);
    let list = [];
    let date = new Date(that.data.time);
    for (let i in dateList) {
      list.push(dateList[i].getDate());
    }
    that.setData({
      dateList: dateList,
      today: today,
      dateArray: list,
      currentChoose: date.getDate(), 
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 选择周
   */
  changeNav: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.id;
    that.setData({
      currentNav: index
    })
  },

  /**
   * 选择日期
   */
  chooseDate: function(e) {
    let that = this;
    let val = e.currentTarget.dataset.val;
    let index = e.currentTarget.dataset.index;
    if (that.data.timeList[index].status && that.data.timeList[index].status == '10' && index >= that.data.today.day && index <= that.data.today.day + 14) {
      that.setData({
        currentChoose: val,
        ifShowChooseTimer: true,
        time: that.data.dateList[index],
      })
      that.getApoointTimeList();
    }else {
      if(index > that.data.today.day + 14) {
        wx.showModal({
          title: '',
          content: '暂不开放预约，每日下午16时开放当日后（不含当日）第14天预约',
        })
      }
    }
    
  },

  /**
   * 隐藏弹窗
   */
  hideChooseTimer: function(e) {
    let that = this;
    that.setData({
      ifShowChooseTimer: false
    })
  },

  /**
   * 在线预约
   */
  toAppointOL: function(e) {
    let that = this;
    wx.showModal({
      title: '问诊规则',
      content: '问诊交流不限次数；付费后医生在24小时内答复；付费后问诊最长开启48小时，逾期自动结束。',
      success: res => {
        if (res.confirm) {
          that.generateOrder();
        }
      }
    })
    
  },

  /**
   * 判断是否需要缴纳
   */
  judgeNeedOfPayment: function() {
    let that = this;
    wx.request({
      url: config.service.needCreatePayment,
      method: "get",
      data: {
        uid: app.globalData.uid,
        did: that.data.doctorInfo.id,//这里用id不是did
      },
      success: res => {
        if (res.data.errorCode == 0) {
          that.setData({
            ifShowButton: true,
          })
        }
      }
    })
  },

  /**
   * 获取医生详情
   */
  getDoctorDetail: function(did) {
    let that = this;
    wx.request({
      url: config.service.doctorDetail,
      method: "post",
      data: {
        did:did,
      },
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            doctorInfo: res.data.doctor,
            commentList: res.data.comment,
          })
          if(res.data.doctor) {
            that.getstoreBySid(res.data.doctor.sid);
          }
          let timelist = res.data.time;
          let list = [];
          let dateList = that.data.dateList;
          for (let j in dateList) {
            let dateC = new Date(dateList[j]);
            list[j] = {};
          }
          // console.log(dateList);
          for(let i in timelist) {
            let item = [];
            let str = timelist[i].date + "";
            item = str.split("-");
            let obj = {};
            
            obj.year = item[0];
            obj.month = item[1];
            obj.date = item[2];
            obj.status = timelist[i].status;
            // console.log(obj);
            for(let j in dateList) {
              let dateC = new Date(dateList[j]);
              if((dateC.getMonth() + 1) == obj.month && dateC.getDate() == obj.date) {
                list[j] = obj;
              }else {

              }
            }
            if(i == timelist.length-1) {
              // console.log(list)
                that.setData({
                  timeList: list
                })
            }
          }
          
          
          let time = new Date(that.data.time);
          for(let i in list) {
            if(list[i]) {
              if(list[i].date == time.getDate() && list[i].month == (time.getMonth() + 1)) {
                if(list[i].status == '10') {
                  that.setData({
                    currentChoose: time.getDate(),
                    ifShowChooseTimer: true
                  })
                  that.getApoointTimeList();
                  
                }
              }
            }
          }
          //that.judgeNeedOfPayment();
        }
      }
    })
  },

  /**'
   * 获取可预约时间段
   */
  getApoointTimeList: function() {
    let that = this;
    let date = new Date(that.data.time);
    let time = date.getFullYear() + "-" + Math.floor(date.getMonth() + 1) + "-" + date.getDate();
    if (Math.floor(date.getMonth() + 1) < 10 && date.getDate() < 10) {
      time = date.getFullYear() + "-0" + Math.floor(date.getMonth() + 1) + "-0" + date.getDate();
    } else if (Math.floor(date.getMonth() + 1) < 10 && date.getDate() >= 10) {
      time = date.getFullYear() + "-0" + Math.floor(date.getMonth() + 1) + "-" + date.getDate();
    } else if (Math.floor(date.getMonth() + 1) > 10 && date.getDate() < 10) {
      time = date.getFullYear() + "-" + Math.floor(date.getMonth() + 1) + "-0" + date.getDate();
    }else {
      time = date.getFullYear() + "-" + Math.floor(date.getMonth() + 1) + "-" + date.getDate();
    }
    wx.request({
      url: config.service.doctorAboutTime,
      method: "post",
      data: {
        did: that.data.did,
        time: time,
      },
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            appointTimeList: res.data.message
          })
        }
      }
    })
  },

  /**
   * 选择好预约时间段
   */
  chooseAppointHour: function(e) {
    let that = this;
    let hour = e.currentTarget.dataset.time;
    let time = that.data.time;
    that.setData({
      currrentSelectHour: hour
    }),
    wx.navigateTo({
      url: '../appoint_online/appoint_online?hour=' + hour + "&time=" + time + "&sid=" + that.data.doctorInfo.sid + "&did=" + that.data.doctorInfo.uid + "&d_name=" + that.data.doctorInfo.d_name,
    })
  },

  /**
   * 电话预约
   */
  telToDoctor: function(e) {
    let that = this;
    wx.request({
      url: config.service.getAppointTel,
      method: "post",
      success: res => {
        if(!res.data.errorCode) {
          let tel = res.data.message.value;
          wx.makePhoneCall({
            phoneNumber: tel
          })
        }
      }
    })
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
        if(!res.data.errorCode) {
          that.setData({
            storeMessage: res.data.message,
          })
        }
      }
    })
  },


  
  /**
   * 生成订单
   */ 
  generateOrder: function (e) {
    let that = this;
    wx.request({
      url: config.service.appointOrder,
      method: "post",
      data: {
        uid: app.globalData.uid,
        did: that.data.doctorInfo.id, //这里用的是id不是did
      },
      success: res => {
        if (res.data.errorCode == 0) {
          console.log("生成订单成功")
          let pid = res.data.payment.id;
          let money = res.data.payment.money;
          wx.request({
            url: config.service.wxpay,
            method: "post",
            data: {
              pid: pid,
            },
            success: ress => {
              if (!ress.data.errorCode) {
                console.log("支付接口成功");
                wx.requestPayment({
                  timeStamp: ress.data.message.timeStamp,
                  nonceStr: ress.data.message.nonceStr,
                  package: ress.data.message.package,
                  signType: ress.data.message.signType,
                  paySign: ress.data.message.paySign,
                  success: resdata => {
                    console.log(resdata);
                    that.setData({
                      ifShowButton: true,
                    })
                  },
                  fail: resdata => {
                    console.log(resdata);
                  }
                })
              }else {
                wx.showToast({
                  title: '微信接口调用失败',
                  icon: "none",
                })
              }
            }
          })
        }else if(res.data.errorCode == 1){
          wx.showToast({
            title: "生成订单失败",
            icon: "none"
          })
        }else if(res.data.errorCode == 2) {
          that.setData({
            ifShowButton: true,
          })
        }else if(res.data.errorCode == 3) {
          console.log("生成订单成功")
          that.setData({
            ifShowButton: true,
          })
        }
      }
    })

  }
})
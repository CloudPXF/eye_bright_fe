// pages/sciene_detail/scieneDetail.js
var config = require("../../config.js");
var wxParse = require("../../wxParse/wxParse.js");
var htmlpar = require("../../wxParse/html2json.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: "",
    config: config,
    content: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.id){
      that.getTextureDetail(options.id);
    }
  },

  /**
   * 获取详细信息
   */
  getTextureDetail: function(id) {
    let that = this;
    wx.request({
      url: config.service.getArticleDetail,
      method: "post",
      data: {
        id: id,
      },
      success: res => {
        if(!res.data.errorCode) {
          let article = res.data.article;
          that.setData({
            article: res.data.article
          })
          let item = htmlpar.html2json(article.content, 'returnDate');
          that.setData({
            content: item
          })
        }
      }
    })
  },

  /**
   * 跳转到医生详情
   */
  toDoctorDetail: function (e) {
    let that = this;
    let id = that.data.article.doctor_info.uid;
    let time = new Date();
    wx.navigateTo({
      url: '../doctor_detail/doctor_detail?id=' + id + "&time=" + time,
    })
  }
})
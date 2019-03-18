// pages/sciene/sciene.js
var config = require("../../config.js");
var wxParse = require("../../wxParse/wxParse.js");
var htmlpar = require("../../wxParse/html2json.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textureList: [
      // { "title": "为了治好孩子的近视，花个几千块近视矫正的方fa", "content": "近视的进展过程非常复杂，因人而异，影响因素有：遗传、环境、近视矫正的方近视矫正的方...", "pic": "../../images/text_demo_pic.png", "word": "近视防控", "doctor": "张莹莹", "doctor_in": "儿内科" },
      // { "title": "为了治好孩子的近视，花个几千块近视矫正的方fa", "content": "近视的进展过程非常复杂，因人而异，影响因素有：遗传、环境、近视矫正的方近视矫正的方...", "pic": "../../images/text_demo_pic.png", "word": "近视防控", "doctor": "张莹莹", "doctor_in": "儿内科" },
    ],
    textureWordList: [
      // { "id": "0", "content": "青光眼", "isChosen": false },
      // { "id": "1", "content": "眼底病", "isChosen": true },
      // { "id": "2", "content": "小儿眼病", "isChosen": false },
      // { "id": "3", "content": "角膜塑型镜", "isChosen": false },
      // { "id": "4", "content": "斜视", "isChosen": false },
      // { "id": "5", "content": "弱视", "isChosen": false },
      // { "id": "6", "content": "干眼症治疗", "isChosen": false },
      // { "id": "7", "content": "综合眼症", "isChosen": false },
    ],
    contentList: [],
    config: config,
    isScieneShowMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getTextureList();
  },

  onShow: function() {
    console.log("uid:" + app.globalData.uid)
    if (!app.globalData.uid) {
      wx.showToast({
        title: '未能获取uid',
        icon: "none"
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/getOpenid/getOpenid',
        })
      }, 800)

    }
  },

  onShareAppMessage: function(e) {

  },

  /**
   * 选择关键词
   */
  chooseKeyWord: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.id;
    let wordList = that.data.textureWordList;
    for (let i in wordList) {
      if (i == index) {
        wordList[i].isChosen = true;
      } else {
        wordList[i].isChosen = false;
      }
    }
    that.setData({
      textureWordList: wordList
    })
    wx.showLoading({
      title: '查找中',
    })
    setTimeout(function() {
      wx.hideLoading();
      wx.navigateTo({
        url: '../search_result/searchResult?type=2&value=' + wordList[index].crux,
      })
    },1000)
    
    // that.getTextureList(e.currentTarget.dataset.cid);
  },

  /**
   * 搜索输入
   */
  scieneSearching: function(e) {
    let that = this;
    if(e.detail.value) {
      wx.navigateTo({
        url: '../search_result/searchResult?type=2&value=' + e.detail.value,
      })
    }
  },

  /**
   * 获取列表
   */
  getTextureList: function(cid) {
    let that = this;
    wx.request({
      url: config.service.getArticleList,
      method: "post",
      data: {
        cid: cid
      },
      success: res => {
        if(!res.data.errorCode) {
          if (!that.data.textureWordList.length) {
            that.setData({
              textureWordList: res.data.crux
            })
          }
          that.setData({
            textureList: res.data.article
          })
          // let list = [];
          // let article = res.data.article;
          // for (let i in article) {
          //   let item = htmlpar.html2json(article[i].content, 'returnDate');
          //   list.push(item);
          // }
          // that.setData({
          //   contentList: list
          // })
        }
      }
    })
  },

  /**
   * 跳转到详情
   */
  toDetail: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../sciene_detail/scieneDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 展开关键词
   */
  showScieneCruxMore: function() {
    let that = this;
    that.setData({
      isScieneShowMore: !that.data.isScieneShowMore,
    })
  }
})
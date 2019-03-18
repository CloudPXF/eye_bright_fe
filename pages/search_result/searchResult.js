// pages/search_result/searchResult.js
var config = require("../../config.js");
var wxParse = require("../../wxParse/wxParse.js");
var htmlpar = require("../../wxParse/html2json.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 3,//  1-》 相关问答 2-》相关文章 3-》都有
    requestList: [
      // { "question": "我儿子今年七岁，已经近视400度了，请问有什么有效的方法进行矫正或者控制一下度数？么有效的方法进行矫正或者控制一下度数？", "answer": "您好，近视不只是配镜，不同的人，不同的需求，有不同的控制度数增长的近视防控方案。方案也会根据不同年方案也会根据不同年...", "word": "近视防控", "doctor": "张莹莹", "doctor_in": "儿内科" },
      // { "question": "我儿子今年七岁，已经近视400度了，请问有什么有效的方法进行矫正或者控制一下度数？么有效的方法进行矫正或者控制一下度数？", "answer": "您好，近视不只是配镜，不同的人，不同的需求，有不同的控制度数增长的近视防控方案。方案也会根据不同年方案也会根据不同年...", "word": "成人视力修复手术", "doctor": "丁煌", "doctor_in": "高级验光师" },
    ],
    textureList: [
      // { "title": "为了治好孩子的近视，花个几千块近视矫正的方fa", "content": "近视的进展过程非常复杂，因人而异，影响因素有：遗传、环境、近视矫正的方近视矫正的方...", "pic": "../../images/text_demo_pic.png", "word": "近视防控", "doctor": "张莹莹", "doctor_in": "儿内科" },
      // { "title": "为了治好孩子的近视，花个几千块近视矫正的方fa", "content": "近视的进展过程非常复杂，因人而异，影响因素有：遗传、环境、近视矫正的方近视矫正的方...", "pic": "../../images/text_demo_pic.png", "word": "近视防控", "doctor": "张莹莹", "doctor_in": "儿内科" },
    ],
    inputVal: "",
    textureContentList: [],
    config: config,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.type) {
      this.setData({
        type: options.type
      })
      if(options.type == 1) {
        wx.setNavigationBarTitle({
          title: '相关问答',
        })
      }else if(options.type == 2) {
        wx.setNavigationBarTitle({
          title: '相关文章',
        })
      }else {
        
      }
      that.getSearchResult(options.value);
    }
    if(options.value) {
      this.setData({
        inputVal: options.value
      })
    }
  },

  /**
   * 输入搜索内容
   */
  inputSearching: function(e) {
    let that = this;
    that.setData({
      inputVal: e.detail.value
    })
  },

  /**
   * 删除输入框中的内容
   */
  deleteSearching: function(e) {
    let that = this;
    that.setData({
      inputVal: ""
    })
  },

  /**
   * 搜索
   */
  searchVAl: function(e) {
    let that = this;
    that.getSearchResult(e.detail.value);
  },

  /**
   * 跳转到文章详情
   */
  toTextureDetail: function (e) {
    let that = this;
    wx.navigateTo({
      url: '../sciene_detail/scieneDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 跳转到问题详情
   */
  toQuestionDetail: function (e) {
    let that = this;
    wx.navigateTo({
      url: '../request_detail/request_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 搜索
   */
  getSearchResult: function(val) {
    let that = this;
    wx.request({
      url: config.service.search,
      method: "post",
      data: {
        keyword: val,
      },
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            requestList: res.data.problem,
            textureList: res.data.article
          })
          // let article = res.data.article;
          // let list = [];
          // for (let i in article) {
          //   // wxParse.wxParse('article', 'html', article[i].content, that, 5);
          //   let item = htmlpar.html2json(article[i].content, 'returnDate');
          //   list.push(item);
          // }
          // that.setData({
          //   textureContentList: list
          // })
        }
      }
    })
  }
})
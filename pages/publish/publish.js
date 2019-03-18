// pages/publish/publish.js
var config = require("../../config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identify: 0,
    uploadImgList: [
      "",
      "",
      ""
    ],
    open_status: false,
    keywordList: [],
    keywordChoose: "",
    textInput: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.identify == 1) {
      this.setData({
        identify: 1
      })
      wx.setNavigationBarTitle({
        title: '回复',
      })
      that.setData({
        questionId: options.id
      })
      that.getCruxList();
    }
  },

  /**
   * 上传图片
   */
  uploadImg: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let imgList = that.data.uploadImgList;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        if (res.tempFilePaths.length) {
          imgList[index] = res.tempFilePaths[0],
          that.setData({
            uploadImgList: imgList
          })
        }
      },
    })
  },

  /**
   * 删除图片
   */
  deleteImg: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let imgList = that.data.uploadImgList;
    imgList[index] = "";
    that.setData({
      uploadImgList: imgList
    })
  },

  /**
   * 选择是否公开
   */
  changeOpenStatus: function(e) {
    let that = this;
    that.setData({
      open_status: !that.data.open_status
    })
  },

  /**
   * 发布问题
   */
  publishQuestion: function(e) {
    let that = this;
    that.publishProblem();
    
  },

  /**
   * 获取关键字
   */
  getCruxList: function() {
    let that = this;
    wx.request({
      url: config.service.userCrux,
      method: "post",
      data: {

      },
      success: res => {
        if(!res.data.errorCode) {
          that.setData({
            keywordList: res.data.message
          })
        }
      }
    })
  },

  /**
   * 回复问题
   */
  responseQuestion: function(e) {
    let that = this;
    let list = that.data.uploadImgList;
    let imgUploadList = [];
    if (that.data.textInput && that.data.keywordChoose) {
      for (let i in list) {
        let item = "";
        if (list[i]) {
          wx.uploadFile({
            url: config.service.uploadImg,
            filePath: list[i],
            name: "img",
            success: ress => {
              if (!JSON.parse(ress.data).errorCode) {
                item = JSON.parse(ress.data).message;
                imgUploadList.push(item);
                // console.log(imgUploadList)
                if (imgUploadList.length == 3) {
                  wx.request({
                    url: config.service.answerProblem,
                    method: "post",
                    data: {
                      uid: app.globalData.uid,
                      answer: that.data.textInput,
                      pid: that.data.questionId,
                      cid: that.data.keywordList[that.data.keywordChoose].id,
                      aimg1: imgUploadList[0],
                      aimg2: imgUploadList[1],
                      aimg3: imgUploadList[2],
                    },
                    success: res => {
                      if (!res.data.errorCode) {
                        wx.showToast({
                          title: '回复成功',
                        })
                        setTimeout(function () {
                          wx.navigateBack({

                          })
                        }, 1500)
                      } else {
                        wx.showToast({
                          title: '回复失败',
                          icon: "none"
                        })
                      }
                    }
                  })
                }
              }
            }
          })
        } else {
          imgUploadList.push(item);
          if (imgUploadList.length == 3) {
            wx.request({
              url: config.service.answerProblem,
              method: "post",
              data: {
                uid: app.globalData.uid,
                answer: that.data.textInput,
                pid: that.data.questionId,
                cid: that.data.keywordList[that.data.keywordChoose].id,
                aimg1: imgUploadList[0],
                aimg2: imgUploadList[1],
                aimg3: imgUploadList[2],
              },
              success: res => {
                if (!res.data.errorCode) {
                  wx.showToast({
                    title: '回复成功',
                  })
                  setTimeout(function () {
                    wx.navigateBack({

                    })
                  }, 1500)
                } else {
                  wx.showToast({
                    title: '回复失败',
                    icon: "none"
                  })
                }
              }
            })
          }
        }

      }

    } else {
      wx.showToast({
        title: '内容和关键字不能为空',
        icon: "none"
      })
    }
  },
  /**
   * 选择关键字
   */
  chooseKeyWord: function(e) {
    let that = this;
    // console.log(e.detail.value)
    that.setData({
      keywordChoose: e.detail.value
    })
  },

  /**
   * 输入
   */
  inputText: function(e) {
    let that = this;
    that.setData({
      textInput: e.detail.value
    })

  },

  publishProblem: function() {
    let that = this;
    let type = "20";
    let list = that.data.uploadImgList;
    let imgUploadList = [];
    if(that.data.open_status) {
      type = "10";
    }
    if(that.data.textInput) {
      for(let i in list) {
        let item = "";
        if(list[i]) {
          wx.uploadFile({
            url: config.service.uploadImg,
            filePath: list[i],
            name: "img",
            success: ress => {
              if(!JSON.parse(ress.data).errorCode) {
                item = JSON.parse(ress.data).message;
                imgUploadList.push(item);
                // console.log(imgUploadList)
                if (imgUploadList.length == 3) {
                  wx.request({
                    url: config.service.publishProblem,
                    method: "post",
                    data: {
                      uid: app.globalData.uid,
                      problem: that.data.textInput,
                      type: type,
                      pimg1: imgUploadList[0],
                      pimg2: imgUploadList[1],
                      pimg3: imgUploadList[2],
                    },
                    success: res => {
                      if (!res.data.errorCode) {
                        wx.showToast({
                          title: '发布成功',
                        })
                        setTimeout(function () {
                          wx.navigateBack({

                          })
                        }, 1500)
                      } else {
                        wx.showToast({
                          title: '发布失败',
                          icon: "none"
                        })
                      }
                    }
                  })
                }
              }
            }
          })
        }else {
          imgUploadList.push(item);
          if(imgUploadList.length == 3) {
            wx.request({
              url: config.service.publishProblem,
              method: "post",
              data: {
                uid: app.globalData.uid,
                problem: that.data.textInput,
                type: type,
                pimg1: imgUploadList[0],
                pimg2: imgUploadList[1],
                pimg3: imgUploadList[2],
              },
              success: res => {
                if (!res.data.errorCode) {
                  wx.showToast({
                    title: '发布成功',
                  })
                  setTimeout(function () {
                    wx.navigateBack({

                    })
                  }, 1500)
                } else {
                  wx.showToast({
                    title: '发布失败',
                    icon: "none"
                  })
                }
              }
            })
          }
        }
        
      }
      
    }else {
      wx.showToast({
        title: '内容不能为空',
        icon: "none"
      })
    }
    
  }
})
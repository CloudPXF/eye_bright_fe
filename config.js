/*
* 小程序配置文件
*/

// 服务器的主机域名
//var host = 'https://www.myeyedoctor.cn';
var host = 'https://myprimaryeyecare.cn/bright_eye/';
// var host = 'https://brain.lololun.top/bright_eye/';

// 小程序ID和SECRET
var appid = 'wxe248eb7a6507c884';
var secret = '1f7c2cbbfae041c9542c4b2fc9c46d19';

var config = {
  // host: "http://39.108.152.177",
  host: host,
  service: {
    appid,
    secret,

    //获取个人openID
    getOpenid: `${host}customer/login/getOpenid`,

    //用户登录
    login: `${host}customer/login/login`,

    //获取用户信息
    getUserInfo: `${host}customer/user/userIofo`,

    //获取轮播图
    getSwiperImgs: `${host}customer/banner/index`,

    //完善用户信息
    addUserInfo: `${host}customer/user/addUserInfo`,

    //获取报告列表
    getPresentationList: `${host}customer/presentation/presentationList`,

    //获取报告详情
    getPresentationDetail: `${host}customer/presentation/presentationDetails`,

    //换取unionid
    getUnionid: `${host}customer/login/getUnionid`,

    //首页
    index: `${host}customer/index/index`,

    //搜索
    search: `${host}customer/index/search`,

    //科普列表
    getArticleList: `${host}customer/article/index`,

    //搜索科普
    searchArticle: `${host}customer/article/search`,

    //文章详情
    getArticleDetail: `${host}customer/article/details`,

    //问答列表
    getProblemList: `${host}customer/problem/problemList`,

    //获取问答详情
    getProblemDetail: `${host}customer/problem/details`,

    //搜索问答
    searchProblem: `${host}customer/problem/search`,

    //意见反馈
    feedback: `${host}customer/user/feedBack`,

    //提问
    publishProblem: `${host}customer/user/carry`,

    //用户身份
    userIdentify: `${host}customer/user/identity`,

    //我的问答
    userProblem: `${host}customer/user/userProblem`,

    //关键词
    userCrux: `${host}customer/user/crux`,

    //医生我的问题列表
    doctorProblemList: `${host}customer/user/received`,

    //上传图片
    uploadImg: `${host}customer/user/uploadImg`,

    //回答问题
    answerProblem: `${host}customer/user/answer`,

    //诊所列表
    storeList: `${host}customer/about/storeList`,

    //诊所搜索
    storeSearch: `${host}customer/about/search`,

    //医师列表
    doctorList: `${host}customer/about/doctorList`,

    //医师详情页
    doctorDetail: `${host}customer/about/doctorDetails`,

    //获取可约时间段
    doctorAboutTime: `${host}customer/about/doctorAboutTime`,

    //在线预约
    appoint: `${host}customer/about/about`,

    //电话预约联系方式
    getAppointTel: `${host}customer/about/tel`,

    //预约列表
    appointmentList: `${host}customer/user/userAbout`,

    //预约详情
    appointmentDetail: `${host}customer/user/userAboutDetails`,

    //取消预约
    cancelAppointment: `${host}customer/user/cancelAbout`,

    //评论
    comment: `${host}customer/user/comment`,

    //检测是否评论过
    checkComment: `${host}customer/user/testingComment`,

    //在线问诊生成订单
    appointOrder: `${host}customer/about/order`,

    //支付
    wxpay: `${host}customer/about/wxpay`,

    //根据sid获取诊所信息
    getstoreBySid: `${host}customer/about/stor`,

    //判断是否需要重新支付
    needCreatePayment: `${host}/customer/about/needCreatePayment`,
  }
};

module.exports = config;
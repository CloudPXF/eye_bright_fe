

var host = "https://brain.lololun.top/bright_eye/";
function setJSAPI(share_img) {
    // 获取签名以调用api
    const getSignature = host + "customer/wxuser/user";
    //alert(encodeURIComponent(location.href.split('#')[0]))
    console.log(share_img);
    console.log(encodeURIComponent(location.href.split('#')[0]));
    $.ajax({
        type: 'GET',
        url: getSignature,
        data: {
            url: encodeURIComponent(location.href.split('#')[0])
        },
        success: function (res) {
            console.log(res);
            wx.config({
                debug: false,
                appId: 'wxfd7b09171bb92f4d',
                timestamp: res.timestamp,
                nonceStr: res.noncestr,
                signature: res.signature,
                jsApiList: [
                    'getLocation',
                    'chooseWXPay',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareQZone',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'uploadVoice',
                ]
            });
            wx.ready(function () {
                console.log("success");
                // alert("success");
                var url = "http://gyh5.bandu.tv/celebration_gy/index.html";
                var share_icon = "http://gyh5.bandu.tv/celebration_gy/images/icon_logo.png"
                // console.log(share_img);
                var title = "我是第" + (count + 5260) + "位为广东药科大学60周年校庆祝福的广药大人";
                var desc = "快来为广药写下祝福，生成你的专属海报吧";
                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
                    imgUrl: share_icon, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        // alert("分享成功")
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareTimeline({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
                    imgUrl: share_icon, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            })
            wx.error(function (res) {
                console.log("error")
                alert(res.errMsg)
                console.log(res)
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("失败")
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}

//存储用户信息（有效期一天）
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie() {
    var user = getCookie("openid");
    if (user != "") {
        return true;
    } else {
        return false;
    }
}

//秒钟转时分秒
function formatSeconds(result) {
    var h = Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60));
    if (h >= 0 && h < 10) {
        h = "0" + h;
    }
    if (m >= 0 && m < 10) {
        m = "0" + m;
    }
    if (s >= 0 && s < 10) {
        s = "0" + s;
    }
    return result = h + ":" + m + ":" + s;
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}


// 转为unicode 编码
function encodeUnicode(str) {
    var res = [];
    for (var i = 0; i < str.length; i++) {
        res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return "\\u" + res.join("\\u");
}

// 解码
function decodeUnicode(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
}

//正则验证邮箱格式
function isEmail(email) {
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(email);
}

//正则验证身份证号码
function isCard(card) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(card);
}

//正则验证是否为手机
function isPhone(phone) {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    return reg.test(phone);
}

//html化
function HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}

//计算时间,若要计算时间差,请移除每个阶段计算的return diff,放到最末端return
function get_time_diff(time) {
    var diff = '';
    //time = time.replace(/\-/g, "/");
    var time_diff = new Date().getTime() - new Date(time);

    //计算年数
    var years = Math.floor(time_diff / (12 * 30 * 24 * 3600 * 1000));
    if (years > 0) {
        diff += years + '年';
        return diff;
    }
    //计算月数
    var months = Math.floor(time_diff / (30 * 24 * 3600 * 1000));
    if (months > 0) {
        diff += s + '月';
        return diff;
    }

    // 计算相差天数
    var days = Math.floor(time_diff / (24 * 3600 * 1000));
    if (days > 0) {
        diff += days + '天';
        return diff;
    }
    else {
        if (diff !== '') {
            diff += days + '小时';

        }
    }
    // 计算相差小时数
    var leave1 = time_diff % (24 * 3600 * 1000);
    var hours = Math.floor(leave1 / (3600 * 1000));
    if (hours > 0) {
        diff += hours + '小时';
        return diff;
    } else {
        if (diff !== '') {
            diff += hours + '小时';

        }
    }
    // 计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);
    var minutes = Math.floor(leave2 / (60 * 1000));
    if (minutes > 0) {
        diff += minutes + '分钟';
        return diff;
    } else {
        if (diff !== '') {
            diff += minutes + '分';

        }
    }
    // 计算相差秒数
    var leave3 = leave2 % (60 * 1000);
    var seconds = Math.round(leave3 / 1000);
    if (seconds > 0) {
        diff += '刚刚';
        return diff;
    } else {
        if (diff !== '') {
            diff += seconds + '秒';

        }
    }
    return "未知时间"

}

//返回年月日
function getYearMonthDay(time) {
    time = time.replace(/\-/g, "/");
    var nowDate = new Date(time);

    //console.log(time)
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
        : nowDate.getMonth() + 1;
    var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
        .getDate();
    var dateStr = year + "-" + month + "-" + day;
    return dateStr;
}
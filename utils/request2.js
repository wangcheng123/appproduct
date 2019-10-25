//pzy 专用请求，勿动，如需其他 自行封装
const app = getApp();

let isShowToast = false; 

/**
 * 新的请求封装
 * url 请求的接口 后半段域名
 * data 请求接口的 参数
 * backfunc 回调域名
 * method 请求方式 默认为 POST
 * carryToken 携带token与否 默认为 1 
 */
function ordinary(url, data, backfunc, method = "POST", carryToken = 1) {
  var that = this;

  if (!url) {
    wx.showToast({
      title: '非法请求',
      icon: 'none',
      mask: true,
      duration: 2000
    })
    return;
  }

  if (method != "POST" && method != "GET")  {
    wx.showToast({
      title: '未知的请求方式',
      icon: 'none',
      mask: true,
      duration: 2000
    })
    return;
  } 

  //读取新版本号的请求地址
  var route = app.globalData.url + 'server/' + app.globalData.version;


  if (!isShowToast) {
    wx.showLoading({
      title: '请求中...',
      mask: true 
    })
    isShowToast = true
  }


  let header = {};
  console.log(app.globalData)
  if (carryToken == 1) {
    header = {
      'Authorization': 'Bearer ' + app.globalData.server.remember_token  ,
    };

  } else {
    header = {
      'content-type': 'application/json',
    };
  }

  wx.request({
    url: route + url, 
    data: data,
    method: method,
    header: header,
    success(res) {
      wx.hideLoading();
      isShowToast = false;
      //回调
      if (backfunc) {
        if (!res.data.data || res.data.data.length == 0) {
          backfunc(res.data.code == 200 ? true : undefined);
        } else {
          backfunc(res.data.data);  //调用数据
        }
      }

      if (res.data.code != 200 && res.data.code < 600) {
        console.log(data);
        //弹出提示信息
        wx.showToast({
          title: res.data.msg ? res.data.msg : '',
          icon: 'none',
          duration: 2000,
          mask: true,
        })
      }

      //其他状态码要做的特殊处理
      setTimeout(function () {
        code_rtn(res.data.code);
      }, 1000);

    },
    fail(res) {
      wx.hideLoading();
      wx.showToast({
        title: '系统繁忙，请稍后',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
    }
  })


}


/**
 * 根据返回code,做相应操作
 * code 接口返回的code码
 * data 接口放回的data内容
 */
function code_rtn(code) {
  //登录失效 需要跳转登录页
  if (code == 250) {
    wx.redirectTo({
      url: '/pages/login/index/index',
    })
  }

  //授权登录没有绑定手机号  需要跳转到绑定手机号页面
  if (code == 400) {
    //新版的绑定手机页面 先授权拿到微信手机
    wx.navigateTo({
      url: '/pages/login/wxAuthorize/wxAuthorize',
    })
  }

  //获取微信手机号失败时，跳转手动绑定手机号
  if (code == 401) {
    //新版的绑定手机页面 先授权拿到微信手机
    wx.navigateTo({
      url: '/pages/login/bindingPhone/bindingPhone',
    })
  }

  return;
}

module.exports = {
  ordinary: ordinary,  //公用请求
}
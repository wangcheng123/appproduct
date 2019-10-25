const app = getApp();

let isShowToast = false;

//公用请求
//url  链接后部分
//data 请求数据 json数据对象
//backfunc  回调函数
//type  数据值 请求类型 默认 0 post请求不需要版本号  1 post请求需要版本号  2 get请求需要版本号  3 get请求不需要版本号 4 直接请求api
function ordinary(url, data, backfunc, type, isnew, isTost) {
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

  //默认post 请求 不需要版本号
  var route = app.globalData.url + 'server/';
  var croute = app.globalData.url;

  var method = 'POST';
  if (isnew) {
    app.globalData.version = 'v2_4/'
  } else {
    app.globalData.version = 'v2_3/'
  }
  if (type == 1) {
    route = route + app.globalData.version + url;
  } else if (type == 2) {
    method = 'GET';
    route = route + app.globalData.version + url;
  } else if (type == 3) {
    method = 'GET';

  } else if (type == 4) {
    route = croute + url;
  } else {
    route = route + url;
  }

  if (!isShowToast) {
    wx.showLoading({
      title: '请求中...',
      mask: true
    })
    isShowToast = true
  }

  wx.request({
    url: route, // 仅为示例，并非真实的接口地址
    data: data,
    method: method,
    header: {
      //'content-type': 'application/json', // 默认值
      'Authorization': 'Bearer ' + app.globalData.server.remember_token
    },
    success(res) {
      wx.hideLoading();

      isShowToast = false;

      //回调
      if (backfunc) {
        if (!res.data.data || res.data.data.length == 0) {

          backfunc(res.data.code == 200 ? true : undefined);

        } else {

          if (isTost) {
            backfunc(res.data.data);  //调用数据
            wx.showToast({
              title: res.data.msg ? res.data.msg : '',
              icon: 'none',
              duration: 2000,
              mask: true,
            })
          } else {
            backfunc(res.data.data);  //调用数据
          }

        }
      }

      if (res.data.code != 200 && res.data.code < 600) {

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


//根据返回code,做相应操作
/**
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
  // if(code==400){
  //    //新版的绑定手机页面 先授权拿到微信手机
  //    wx.navigateTo({
  //      url: '/pages/login/wxAuthorize/wxAuthorize', 
  //    })
  // }

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
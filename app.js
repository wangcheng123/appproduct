//app.js
App({
  onLaunch: function () {

    //强制更新
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        // 有版本更新
      }
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showToast({
        title: "小程序更新失败,请重试", //提示的内容,
        icon: "none", //图标,
        duration: 1500, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => { }
      });
    });
    /////////////////////////////////////////////////////////////////////////////

  },

  onShow:function(){
    //读取缓存操作
    var that = this;
    let serverData = this.globalData.server;

    //获取对象的长度  serverData 不能为undefined
    if (Object.keys(serverData).length == 0) {
      //读取缓存
      let cacheServerData = wx.getStorageSync('server');
      if (serverData) {
        //从缓存中读取保存到 全局数据
        that.globalData.server = cacheServerData
      }
    }

  },


  //全局数据
  globalData: {
    //server: {},
    userPhone:{},
    server: {
      // "server_id": 3333352,
      // "server_realname": "客服-阿丑",
      // "server_nickname": "mmka_1710",
      // "server_username": "17386031710",
      // "server_role_id": 7,
      // "remember_token": "SERVEReyJzZXJ2ZXJfaWQiOjM2MDQ1NSwibG9naW5fdGltZSI6MTU2NDM2NDAwMiwic2VydmVyX3VzZXJuYW1lIjoiMTM5MDcyMjc4NjkiLCJyb2xlX2lkIjoyfQ==u1HXdnSxKX9yA2gf3t48xM7FLPU+pmLZ5qJWRoamYPA="
    },
   
    openid:'',  //用户openid
    unionid: '',  //用户unionid

    url: 'http://test.act.ameimeika.com/api/',  //测试服
    // url: 'https://act.ameimeika.com/api/',    //正式服

    imgurl: "https://img.ameimeika.com/", // 图片链接

    version: 'v2_3/',  // 版本号 

 
 
 
   //request2使用的版本号字段

    //默认省份 id name 定位省份
    province: {
      name: "湖北省",
      province_id: 13,
    },

    //当前下预约单的数据
    order:{},   

  },
  
  //url转码
  UrlEncode: function (clearString) {
    var output = '';
    var x = 0;

    clearString = this.utf16to8(clearString.toString());
    var regex = /(^[a-zA-Z0-9-_.]*)/;

    while (x < clearString.length) {
      var match = regex.exec(clearString.substr(x));
      if (match != null && match.length > 1 && match[1] != '') {
        output += match[1];
        x += match[1].length;
      }
      else {
        if (clearString[x] == ' ')
          output += '+';
        else {
          var charCode = clearString.charCodeAt(x);
          var hexVal = charCode.toString(16);
          output += '%' + (hexVal.length < 2 ? '0' : '') + hexVal.toUpperCase();
        }
        x++;
      }
    }
    return output;
  },
  utf16to8: function (str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      }
      else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
      else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  },
  UrlDecode: function (encodedString) {
    var output = encodedString;
    var binVal, thisString;
    var myregexp = /(%[^%]{2})/;
    var match;
    function utf8to16(str) {
      var out, i, len, c;
      var char2, char3;

      out = "";
      len = str.length;
      i = 0;
      while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            out += str.charAt(i - 1);
            break;
          case 12: case 13:
            char2 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
          case 14:
            char2 = str.charCodeAt(i++);
            char3 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x0F) << 12) |
              ((char2 & 0x3F) << 6) |
              ((char3 & 0x3F) << 0));
            break;
        }
      }
      return out;
    }
    while ((match = myregexp.exec(output)) != null && match.length > 1 && match[1] != '') {
      binVal = parseInt(match[1].substr(1), 16);
      thisString = String.fromCharCode(binVal);
      output = output.replace(match[1], thisString);
    }

    //output = utf8to16(output);
    output = output.replace(/\\+/g, " ");
    output = utf8to16(output);
    return output;
  }

})
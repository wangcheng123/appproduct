var app = getApp(); //获取应用实例

var http = require("../../../../utils/request.js");

var interval = null //倒计时函数
let myThis;

Page({

  data: {

    vsecond: 0, //距离下次发送验证的秒数

    isShowPassword: false, //登录密码是否可查看
    isRead: false, //是否阅读协议
    is_ok: false, //是否填写完毕
    readh5: 'https://h5.ameimeika.com/protocal/protocol.html', //用户协议地址
    draw: 1, //提现类型 1 推荐奖励  2 分销奖励
    drawValue: 0, //可提现金额 可提现金额接口返回
    card_txt: '', //银行卡描述 如 浦发银行（3046）
    card_id: 0, //银行卡id
    drawMoney: 0, //输入的提现金额
    verify: '', //验证码
    password: '', //登录密码
    showModal: false
  },
  onLoad: function (option) {
    myThis = this;
    this.setData({
      draw: option.draw
    })
    this.getDrawMoney();
    console.log(option)
    if (option.jumtype) {

    }
  },

  onShow: function () {

  },
  modalCancel: function () {
    console.log(111)

  },
  modalConfirm: function () {
    console.log(222)
  },
  //获取可提现金额
  getDrawMoney: function () {
    if (this.data.draw == 1) {
      // 分销金额展示
      http.ordinary.call(this, 'mkq/get/reward', {}, this.drawValue, 1);
    } else {
      http.ordinary.call(this, 'mkq/get/fx/reward', {}, this.drawValue, 1);
    }
  },

  //可提现金额渲染
  drawValue: function (data) {
    // console.log(data);
    this.setData({
      drawValue: data.reward
    })
  },

  //提现金额输入
  getsubnum: function (e) {
    var draw = myThis.data.draw;
    // var money = parseFloat(e.detail.value);
    //输入的金额必须小于等于可提现金额 并为整数

    this.setData({
      drawMoney: e.detail.value
    })
    this.tx_ok();
  },

  //确定金额
  setValue: function () {
    //优先判断钱够不够
    var money = parseFloat(myThis.data.drawMoney);
    if (money > this.data.drawValue) {
      wx.showToast({
        title: '超过最大提现额,请重新输入',
        icon: 'none',
        duration: 1500
      })

      this.setData({
        drawMoney: ''
      })

      return;
    }

    var drawMoney = this.data.drawMoney;
    // 判断金额放一起
    let draw = myThis.data.draw;
    if (this.data.drawValue < 100 && draw == 1) {
      wx.showToast({
        title: '提现额不足100',
        icon: 'none',
        duration: 1500
      })

      this.setData({
        drawMoney: ''
      })

      return;
    } else if (this.data.drawValue < 10 && draw == 2 || drawMoney < 10 && draw == 2) { // 分销体现
      wx.showToast({
        title: '提现额不足10',
        icon: 'none',
        duration: 1500
      })

      this.setData({
        drawMoney: ''
      })
      return;
    }

    //====================
    if (draw == 1) {
      if (drawMoney % 100 > 0) {
        wx.showToast({
          title: '提现金额必须是100的整数喔',
          icon: 'none',
          duration: 1500
        })

        drawMoney = Math.floor(drawMoney / 100) * 100

        this.setData({
          drawMoney: drawMoney
        })
      }
    } else {

      var someLength = drawMoney.toString().split(".")[1] ? drawMoney.toString().split(".")[1].length : 0;
      console.log(someLength);
      if (someLength >= 2) {
        drawMoney = parseFloat(drawMoney).toFixed(1);
        this.setData({
          drawMoney
        })
      }
    }
    if (parseFloat(drawMoney) > parseFloat(this.data.drawValue)) {
      wx.showToast({
        title: '提现金额不能超过可提现金额喔',
        icon: 'none',
        duration: 1500
      })



    }

  },

  //发送短信验证码
  sendMsg: function () {
    var data = {
      type: 1003,
      username: app.globalData.server.server_username,
    }
    http.ordinary.call(this, 'send/msg', data, this.verMsg, 4);
  },
  //验证码倒计时
  verMsg: function (data) {

    var that = this

    this.setData({
      vsecond: 60
    });

    //执行倒计时
    var timer = setInterval(function () {
      var vsecond = that.data.vsecond - 1
      that.setData({
        vsecond: vsecond
      })

      if (vsecond <= 0) {
        clearInterval(timer)
      }
    }, 1000)

  },

  //验证码输入
  getverify: function (e) {
    this.setData({
      verify: e.detail.value
    })
    this.tx_ok();
  },

  //密码输入
  setPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
    this.tx_ok();
  },

  //查看密码
  showPassword: function () {
    this.setData({
      isShowPassword: this.data.isShowPassword ? false : true,
    })
  },

  //是否阅读勾选
  readOk: function () {
    this.setData({
      isRead: this.data.isRead ? false : true,
    })
    this.setData({
      isRead: this.data.isRead ? false : true,
    })

    if (this.data.isRead == false) {
      this.setData({
        is_ok: false
      });
      console.log("未同意提现协议")
      return false;
    } else {
      this.tx_ok();
    }

  },

  //判断是否填写完毕
  tx_ok: function () {
    let drawMoney = this.data.drawMoney;
    let draw = this.data.draw;
    console.log(drawMoney, draw)
    if ((drawMoney >= 100 && draw == 1) || (drawMoney >= 10 && draw == 2)) {
      if (this.data.verify && this.data.password && this.data.card_id > 0 && this.data.isRead) {
        this.setData({
          is_ok: true
        });
      }
    } else {
      this.setData({
        is_ok: false
      });
    }

  },

  //跳转h5用户协议
  user_read: function () {
    var h5 = app.UrlEncode(this.data.readh5);

    console.log(h5);

    wx.navigateTo({
      url: '../../../h5/index?url=' + h5,
    })
  },

  //提现申请提交
  drawsub: function () {
    var data = {
      amount: this.data.drawMoney,
      verify: this.data.verify,
      password: this.data.password,
      card_id: this.data.card_id,
    }
    this.setData({
      showModal: true
    })
    if (this.data.draw == 1) {
      http.ordinary.call(this, 'mkq/draw', data, this.drawEnd, 1);
    } else {
      http.ordinary.call(this, 'mkq/fx/draw', data, this.drawEnd, 1);
    }

  },
  //提现结束后的操作
  drawEnd: function (data) {
    if (data == undefined) return; //提现失败

    wx.showToast({
      title: '提现申请成功',
      mask: true,
    })

    setTimeout(function () {
      wx.navigateBack({
        delta: 1,
      })
    }, 1000)
  },
  // 若未填写必要参数点击提交则给与相应的提示
  subToas() {
    /**
     * 
     *  amount: this.data.drawMoney,
      verify:this.data.verify,
      password: this.data.password,
      card_id:this.data.card_id,
     */
    let drawMoney = this.data.drawMoney; // 提现金额
    let verify = this.data.verify; // 短信验证码
    let password = this.data.password; // 密码
    let card_id = this.data.card_id; // 银行卡号
    let isRead = this.data.isRead; // 是否同意协议
    if (!drawMoney || drawMoney <= 0) {
      wx.showToast({
        title: '请填写提现金额',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!verify) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '请填写密码',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!card_id) {
      wx.showToast({
        title: '请选择银行卡号',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!isRead) {
      wx.showToast({
        title: '请勾选用户协议',
        icon: 'none',
        duration: 1500
      })
      return;
    }
  }
})
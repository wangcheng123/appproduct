//首页
const app = getApp();
const http = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    changetab: true, // 推荐业绩 分销业绩 切换tab

    imgUrl: app.globalData.imgurl,
    //1000的卡券的图片地址
    card1000: app.globalData.imgurl + "/server/7ad885e727573b22548a00effba38025.png",
    //300的卡券的图片地址
    card300: app.globalData.imgurl + "/server/33f011763252fedcd3757fc123765347.png",

    pData: {}, //页面数据

    //弹窗数据
    deal: {
      first_tip: 0,
      second_tip: 0,
      referee_url: "",
      money: 0,
    },
    //美洽客服配置文件 
    meiqia_config: {
      agent_token: "",
      group_token: "",
      fallback: 3,
    },

    isShadow: 0, //是否展示弹窗遮罩
    isShadow1: 0, // 异常弹窗
    isFirstShadow: true,
    pop_new_server: 0, //新人专享 
    first_tip_status: 0, //新人专享 弹窗状态  1 代表需要弹一次
    pop_referee_reward: 0, //推荐人金额 （好像没啥卵用？）
    second_tip_status: 0, // 推荐人金额 弹窗状态 1 代表需要弹一次

    abs_tip: 0, // 异常单弹出状态 // 1为弹出异常客户 2为弹出异常奖励
    abs_tip_status: 0, // 弹出状态 如果为1 则需要弹出一次异常窗口

    is_new_rule: 1, //是否是9.20以后的新晋服务商 默认给予300券
    moneyNum: {},
    redirect_type: 0,
    supply_info_pop: 0,
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onHide(){
    this.setData({ showModal:false})
  },
  onLoad: function(options) {


    this.meiqiaRequest();
    let redirect_type = app.globalData.server.redirect_type ? app.globalData.server.redirect_type : 0
    let supply_info_pop = app.globalData.server.supply_info_pop ? app.globalData.server.supply_info_pop : 0
    this.setData({
      redirect_type,
      supply_info_pop
    })
    console.log(redirect_type)
    console.log(supply_info_pop)
    if (redirect_type == 5 || supply_info_pop == 1) {
      console.log(333)
      this.setData({
        showModal: true
      })
    }

  },
  onUnload(e) {
    //wx.removeStorageSync('abs_tip');
  },

  //美洽初始化代码 =》 成功失败都得初始化
  meiqiaRequest: function () {

    var route = app.globalData.url + 'server/v2_3/meiqia_token';
    var that = this;

    wx.request({
      url: route,
      data: {},
      method: 'POST',
      header: {
        //'content-type': 'application/json', // 默认值
        'Authorization': 'Bearer ' + app.globalData.server.remember_token
      },
      success(res) {
        console.log(res)
        if (res.data.code == 200) {
          //配置为后台配置项
          that.setData({
            meiqia_config: res.data.data
          });
        }
        //客服配置初始化
        that.meiqiaInit();
      },
      fail(res) {
        //客服配置初始化
        that.meiqiaInit();
      }
    })

  },

  meiqiaInit: function () {

    var server = app.globalData.server;
    console.log("首页拿取server信息", server)

    var meiqiaPlugin = requirePlugin("meiqia");

    var params = {
      // 成功回调
      success: function () {
        console.log('设置顾客信息成功');
      },
      // 失败回调
      fail: function (res) {
        console.log('设置失败：' + res.toString());
      }
    };
    // 用户信息：可以设置用户的一些基本信息
    let user_info = {
      //服务商真实姓名
      "server_realname": server.server_realname || "未知",
      "server_phone": server.server_username || "未知",
      "server_role_id": server.server_role_id || "未知"
    };
    // 位置信息
    let location_info = {
      country: 'China',
      // province: '上海'
    };
    // 客服指定分配信息
    // let agent_info = {
    //   agent_token: '', // 指定分配客服的 token，可以在 工作台设置 - ID查询 中查看
    //   group_token: '', // 指定分配分组的 token，可以在 工作台设置 - ID查询 中查看
    //   fallback: 3 // 指定分配客服不在线时候的处理情况：1 指定分配客服不在线，则发送留言；2 指定分配客服不在线，分配给组内的人，分配失败，则发送留言；3 指定分配客服不在线，分配给企业随机一个人，分配失败，则发送留言；
    // };
    let agent_info = this.data.meiqia_config;
    console.log("美洽客服配置文件为", agent_info);

    params.user_info = user_info;
    params.agent_info = agent_info;
    params.location_info = location_info;
    // 美洽企业ID 
    params.ent_id = '107336';
    // 小程序 token
    params.token = '108gemechat';
    // 小程序 AppID
    params.app_id = 'wxdf31d8a143db85b3';
    // 用户 openId
    params.open_id = server.openid;
    // 调用接口
    meiqiaPlugin.setClientInfo(params);

  },

  onShow: function () {
    //加载数据
  
    this.getData();
    if (this.data.first_tip_status || this.data.second_tip_status) {
      // 3 4窗
      this.setPop();
    } else {
      //获取新晋服务商数据
      this.getDeal();
    }

    this.setAbnormalData();

    //   --
    // 设置完 1 2 弹窗数据后 拿到 3 4 弹窗的数据
    this.getmoney();
  },

  // 推荐业绩 分销业绩 切换
  changetab: function (e) {
    var that = this

    var ttype = e.currentTarget.dataset.type;
    if (ttype == 0) {
      that.setData({
        changetab: true
      })
    } else if (ttype == 1) {
      that.setData({
        changetab: false
      })
    }

  },
  //数据请求
  getData: function (type) {
    //请求首页数据
    http.ordinary.call(this, 'index', {}, this.dataToPage, 1);
    //请求弹窗数据 (需求暂停 暂时不开发这个)
    //http.ordinary.call(this, 'activity/deal_new_server', {}, this.popupCallback, 1);

  },

  //渲染数据页面
  dataToPage: function (data) {

    if (!data) {
      return;
    }

    this.setData({
      pData: data
    })
  },
  //营业额
  getmoney() {
    http.ordinary.call(this, 'hxIndex', {}, this.dataPage, 1, true);
  },
  dataPage: function (data) {

    if (!data) {
      return;
    }

    this.setData({
      moneyNum: data
    })
  },

  //轮播图跳转
  bannerJump: function (e) {
    var type = e.currentTarget.dataset.type;

    var url = e.currentTarget.dataset.url;

    if (!url || type == 0) {
      return;
    }

    //跳转h5
    if (type == 1) {
      wx.navigateTo({
        url: '../../h5/index?url=' + app.UrlEncode(url),
      })
    } else {
      //跳转原生
      wx.navigateTo({
        url: url,
      })
    }
  },

  //公告跳转
  noticeJump: function (e) {
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../../notice/noticedet/noticedet?id=' + id,
    })
  },

  //弹窗数据
  getDeal: function () {
    http.ordinary.call(this, 'referee/deal_new_server', {}, this.dataToDeal, 1);
  },
  dataToDeal: function (data) {
    if (!data) return;

    // 设置数据
    this.setData({
      deal: data,
      first_tip_status: data.first_tip, //新人专享 弹窗状态 
      second_tip_status: data.second_tip, // 推荐人金额 弹窗状态 
      is_new_rule: data.is_new_rule, //是否是新模式
    });


    this.setPop();
  },

  //设置弹窗
  setPop: function () {
    let that = this

    // 在这里 同意设置弹窗状态 先弹 1 2 介素后弹 3 4 status状态 弹出后置0 否则进来后一直弹
    if (this.data.first_tip_status && this.data.isShadow1 == 0) {
      this.setData({
        isShadow: 1,
        pop_new_server: 1,
        first_tip_status: 0,
      })
      return false;
    } else if (this.data.second_tip_status && this.data.isShadow == 0 && this.data.isShadow1 == 0) {
      this.setData({
        isShadow: 1,
        pop_referee_reward: 1,
        second_tip_status: 0
      });
      return false;
    } else if (this.data.abs_tip && this.data.isShadow == 0) {

      console.log(this.data.abs_tip, this.data.abs_tip_status)


      //当前需要弹的窗 存在 并且没有弹过
      if (this.data.abs_tip && this.data.abs_tip_status != this.data.abs_tip) {
        this.setData({
          isShadow1: 1,
          abs_tip_status: this.data.abs_tip,
        });

        if (this.data.abs_tip == 1) {
          //3窗
          wx.showModal({
            content: '您有客户绑定多个服务商，避免业绩奖励出现异常，请尽快联系客服处理！',
            confirmText: '查看',
            cancelText: '取消',
            cancelColor: '#666666',
            confirmColor: '#FF383E',
            success: function (res) {
              that.setData({
                isShadow1: 0,
                isFirstShadow: false
              });

              if (res.confirm) {
                // 
                wx.navigateTo({
                  url: '/pages/main/mine/myClient/myClient'
                })
              }

            },
          })
        } else {
          //4窗
          wx.showModal({
            content: '您有客户绑定多个服务商，且该客户已完成项目，导致奖励被冻结，请尽快联系客服处理！',
            confirmText: '查看',
            cancelText: '取消',
            cancelColor: '#666666',
            confirmColor: '#FF383E',
            success: function (res) {

              // console.log(res.cancel, );
              that.setData({
                isShadow1: 0,
                isFirstShadow: false
              });
              if (res.confirm) {
                let url = wx.getStorageSync('abnorl_url');
                wx.navigateTo({
                  url: '/pages/h5/index?url=' + app.UrlEncode(url),
                })
              }
              // 这里跳转到H5页面
            }
          })
        }
      }
    }

  },

  //关闭新人专享弹窗
  clsoe_pop_server: function () {
    //先关闭专享弹窗
    this.setData({
      isShadow: 0,
      pop_new_server: 0,
    });
    this.setPop();
  },

  //关闭奖励弹窗
  close_pop_reward: function () {
    this.setData({
      isShadow: 0,
      pop_referee_reward: 0,
    });
    this.setPop();
  },

  //跳转到卡片H5
  toCardH5: function (e) {
    this.setData({
      isShadow: 0, //是否展示弹窗遮罩
      pop_new_server: 0, //新人专享
    })

    let url = this.data.deal.referee_url
    wx.navigateTo({
      url: '/pages/h5/index?url=' + app.UrlEncode(url),
    })
  },

  abnormal() {
    let abs_tip = this.data.abs_tip;
    let that = this;
    // 弹  
    if (abs_tip && abs_tip == 1) {
      // 异常客户
      wx.showModal({
        content: '您有客户绑定多个服务商，避免业绩奖励出现异常，请尽快联系客服处理！',
        confirmText: '查看',
        cancelText: '取消',
        cancelColor: '#666666',
        confirmColor: '#FF383E',
        success: function (res) {

          that.setData({
            isShadow1: 0,
            isFirstShadow: false
          });
          if (res.confirm) {
            // 
            wx.navigateTo({
              url: '/pages/main/mine/myClient/myClient'
            })
          }
        },
      })
    } else if (abs_tip == 2) {
      // 异常奖励
      wx.showModal({
        content: '您有客户绑定多个服务商，且该客户已完成项目，导致奖励被冻结，请尽快联系客服处理！',
        confirmText: '查看',
        cancelText: '取消',
        cancelColor: '#666666',
        confirmColor: '#FF383E',
        success: function (res) {

          // console.log(res.cancel, );
          that.setData({
            isShadow1: 0,
            isFirstShadow: false
          });
          if (res.confirm) {
            let url = wx.getStorageSync('abnorl_url');
            wx.navigateTo({
              url: '/pages/h5/index?url=' + app.UrlEncode(url),
            })
          }
          // 这里跳转到H5页面

        }
      })
    }
    this.setData({
      isShadow1: 1
    });
  },

  // 设置异常数据方法
  setAbnormalData() {
    http.ordinary.call(this, 'abnorl/info', {}, res => {
      if (!res) return;

      this.setData({
        abs_tip: res.abs_tip,
      });

      wx.setStorageSync('abnorl_url', res.abnorl_url);
      // 设置微信客户异常和金额异常
      wx.setStorageSync('ab_water', res.ab_water);
      wx.setStorageSync('ab_apply', res.ab_apply);

      this.setPop();
    }, 1);
  },

  // 只弹一次
  getOne() {
    wx.showModal({
      title: '',
      content: '您可以到商户PC后台补充门店资料，然后上架商品进行售卖',
      cancelText: '确定',
      cancelColor: '#FF383E',
      showCancel: false,
      success(res) {
        if (res.cancel) {

        }
      }
    })
  },
  exitBtn() { },
  //手动核销
  bindCancel() {
    if (this.data.redirect_type == 3) {
      console.log(11)
      this.setData({
        showModal: true
      })
      return
    }
    wx.navigateTo({
      url: '/pages/main/cancel/manuallyCancel',
    })
  },
  //跳转订单管理
  goOrder() {
    console.log(123, this.data.redirect_type)
    if (this.data.redirect_type == 3) {
      console.log(222)
      this.setData({
        showModal: true
      })
      return
    }
    wx.navigateTo({
      url: '/pages/main/order/order',
    })
  },
  //扫码核销
  getScancode() {
    var _this = this;
    if (_this.data.redirect_type == 3) {
      _this.setData({
        showModal: true
      })
      return
    }
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        wx.navigateTo({
          url: '/pages/main/cancel/cancelResults/cancelResults?code=' + result,
        })
      }
    })
  }

})
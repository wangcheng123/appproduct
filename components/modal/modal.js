/**
 * 自定义modal浮层
 * 使用方法：
 * <modal show="{{showModal}}" height='60%' bindcancel="modalCancel" bindconfirm='modalConfirm'>
     <view>你自己需要展示的内容</view>
  </modal>

  属性说明：
  show： 控制modal显示与隐藏
  height：modal的高度
  btntype:1  按钮属性 1为推出小程序 其他为取消按钮
  suretype: 1  按钮属性 1为推出小程序 其他为正常按钮
  bindcancel：点击取消按钮的回调函数
  bindconfirm：点击确定按钮的回调函数
  ptype:5  我的资金页面
  使用模块：
  场馆 -> 发布 -> 选择使用物品
 */

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: false
    },
    ptype: String,//我的资金页面
    btntype: String,
    suretype: String,
    btn1: String,
    btn2: String,
    //modal的高度
    height: {
      type: String,
      value: '80%'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      this.setData({
        show: false
      })
    },

    cancel() {
      this.setData({
        show: false
      })
      console.log(this.data.ptype)
      if (this.data.ptype == 5) {
        //跳转到提现页面
        wx.navigateTo({
          url: '/pages/circle/withdraw/withdraw/withdraw?draw=1',
        })
      }
      // this.triggerEvent('cancel')
    },

    confirm() {
      this.setData({
        show: false
      })
      //   this.triggerEvent('confirm')
      //点击确认 根据签约状态进入对应的页面

    }
  }
})
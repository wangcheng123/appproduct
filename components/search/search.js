/**
 * 自定义modal浮层
 * 使用方法：
 * <modal show="{{showModal}}" height='60%' bindcancel="modalCancel" bindconfirm='modalConfirm'>
     <view>你自己需要展示的内容</view>
  </modal>

  属性说明：
  show： 控制modal显示与隐藏
  height：modal的高度
  bindcancel：点击取消按钮的回调函数
  bindconfirm：点击确定按钮的回调函数

  使用模块：
  场馆 -> 发布 -> 选择使用物品
 */
const date = new Date()
const years = []
const months = []
const days = []
let myThis

//今年之前
for (let i = date.getFullYear() - 10; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    months.push("0" + i)
  } else {
    months.push(i)
  }
}

for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    days.push("0" + i)
  } else {
    days.push(i)
  }
}

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
    starttime: String,
    endtime: String,
    btn1: String,
    btn2: String,
    //modal的高度
    height: {
      type: String,
      value: '80%'
    }
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log(this.data)
    },

  },
  /**
   * 组件的初始数据
   */
  data: {
    cateid: 0,
    catelist: [{
      id: 0,
      name: '全部类型'
    },
    {
      id: 1,
      name: '会员奖励'
    },
    {
      id: 2,
      name: '服务奖励'
    },
    {
      id: 3,
      name: '项目奖励'
    },
    {
      id: 4,
      name: '商品奖励'
    },
    {
      id: 5,
      name: '提现'
    },
    ],
    years,
    months,
    days,
    value: [date.getFullYear(), date.getMonth(), 0], //初始
    year: date.getFullYear(), // 当前年份
    type: 1, //1 在选择开始时间  2 选择结束时间
    tstart: {
      year: date.getFullYear(),
      month: parseInt(date.getMonth()) + 1,
      day: "01",
    },

    tend: {
      year: date.getFullYear(),
      month: parseInt(date.getMonth()) + 1,
      day: parseInt(date.getDate()),
    },
    currentTabsIndex: 0,
    index: 0,
    isShow: false,
    isTime: false
  },

  /**
   * 组件的方法列表
   */
  onLoad: function (options) {
    myThis = this

  },
  methods: {
    changechilde(value, type) {


      if (type == 0) {
        //开始时间
        this.setData({
          tstart: {
            year: years[value[0]],
            month: months[value[1]],
            day: days[value[2]],
          }
        })
      } else {
        //结束时间
        this.setData({
          tend: {
            year: years[value[0]],
            month: months[value[1]],
            day: days[value[2]],
          }
        })
      }

    },
    catefun(e) {
      this.setData({
        cateid: e.currentTarget.dataset.id
      })
    },
    cancel() {
      this.setData({
        show: false
      })
      var obj = {
        reward_type: this.data.cateid,
        start_time: this.data.tstart,
        end_time: this.data.tend,
      }
      this.triggerEvent('cancel', obj)
    },

    confirm() {
      this.setData({
        show: false
      })

    },
    //处理值的修改
    dchange: function (e) {
      console.log(e)
      var value = e.detail.value

      if (this.data.type == 1) {

        this.setData({
          tstart: {
            year: years[value[0]],
            month: months[value[1]],
            day: days[value[2]],
          }
        })
      } else {
        this.setData({
          tend: {
            year: years[value[0]],
            month: months[value[1]],
            day: days[value[2]],
          }
        })
      }

    },

    //切换选择时间
    check_type: function (e) {

      var type = e.target.dataset.type

      this.setData({
        type: type
      })

    },
    //选择时间
    chooseTime() {
      this.setData({
        isTime: true
      })
    },
    //确认时间
    timesub: function () {
      this.setData({
        isTime: false
      })
    },
    // 点击切换Tab
    onTabs: function (e) {
      let status
      let currentTabsIndex = e.currentTarget.dataset.index
      myThis.setData({
        currentTabsIndex,
        index: currentTabsIndex
      })
    },
    //查看明细
    resultsInfor() {
      myThis.setData({
        isShow: true
      })
    },
  }

})
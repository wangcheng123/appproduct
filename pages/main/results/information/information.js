const app = getApp();
var http = require("../../../../utils/request.js");
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


Page({
  data: {
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
    isTime: false,
    page: 1,
    pageSize:10,
    details:{
      achieve:[]
    },
    index:0
  },
  onLoad: function(options) {
    myThis = this
    let currentTabsIndex = options.currentTabsIndex ? options.currentTabsIndex : 0
    this.setData({ currentTabsIndex})
    myThis.getDetails(currentTabsIndex)
  },

  //处理值的修改
  dchange: function(e) {

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
  check_type: function(e) {

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
  timesub: function() {
    let details = myThis.data.details
    details.achieve = []
    this.setData({
      isTime: false,
      page: 1,
      details
    })
    myThis.getDetails(this.data.currentTabsIndex)
  },
  // 点击切换Tab
  onTabs: function(e) {
    let status
    let currentTabsIndex = e.currentTarget.dataset.index
    let details = myThis.data.details
    details.achieve = []
    myThis.setData({
      currentTabsIndex,
      index: currentTabsIndex,
      page:1,
      details
    })
    myThis.getDetails(currentTabsIndex)
  },
  //下拉加载
  lower: function () {
    this.getDetails(this.data.currentTabsIndex);
  },
  //查看明细
  getDetails(type) {
    let obj = {
      page: this.data.page,
      pageSize: this.data.page,
      start_time: this.data.tstart.year + '-' + this.data.tstart.month + '-' + this.data.tstart.day,
      end_time: this.data.tend.year + '-' + this.data.tend.month + '-' + this.data.tend.day,
      achieve_type: type
    }
    http.ordinary.call(this, 'yjDetail', obj, this.details, 1, true)
  },
  //渲染页面
  details: function (data) {
    if (!data) {
      return
    }
    this.setData({
      page: this.data.page + 1,
    })
    data.achieve = this.data.details.achieve.concat(data.achieve)
    this.setData({
      details: data,
    })

  },

})
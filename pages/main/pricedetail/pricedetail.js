const app = getApp()
const http = require('../../../utils/request.js');

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
    tdate: "",
    edate: "",
    isopen: '',
    ntype: "",
    showModal: false,
    params: {
      reward_type: 0,
      start_time: '',
      end_time: '',
      page: 1,
      pageSize: 5
    },
    list: [],
    datas: {}
  },
  onLoad: function (options) {
    this.getData()
  },
  //子传父
  modalCancel: function (e) {
    console.log(e.detail)
    this.data.params.end_time = e.detail.end_time.year + '-' + e.detail.end_time.month + '-' + e.detail.end_time.day
    this.data.params.start_time = e.detail.start_time.year + '-' + e.detail.start_time.month + '-' + e.detail.start_time.day
    this.data.params.reward_type = e.detail.reward_type

    console.log(this.data.params)
    this.setData({
      tstart: e.detail.start_time,
      tend: e.detail.end_time,
    })
    this.getData()
  },
  //确认时间
  timesub: function () {
    this.setData({
      isTime: false
    })

    this.getData()
  },
  //打开time
  opentime() {
    this.setData({
      isTime: true
    })
  },

  //处理值的修改
  dchange: function (e) {

    var value = e.detail.value

    if (this.data.type == 1) {
      this.setData({
        tstart: {
          year: years[value[0]],
          month: months[value[1]],
          day: days[value[2]],
        }
      })
      this.selectComponent('#search').changechilde(value, 0);
    } else {
      this.setData({
        tend: {
          year: years[value[0]],
          month: months[value[1]],
          day: days[value[2]],
        }
      })
      this.selectComponent('#search').changechilde(value, 1);
    }

  },

  //切换选择时间
  check_type: function (e) {

    var type = e.target.dataset.type

    this.setData({
      type: type
    })

  },
  // tbindDateChange(e) {
  //   let {
  //     value
  //   } = e.detail;
  //   console.log("日期改变:", value);
  //   this.setData({
  //     tdate: value,
  //   })
  //   this.selectComponent('#search').changechilde(value, 0);
  //   if (!this.data.edate) {
  //     return false;
  //   }

  //   this.getData()
  // },
  // ebindDateChange(e) {
  //   let {
  //     value
  //   } = e.detail;
  //   console.log("日期改变:", value);
  //   this.setData({
  //     edate: value,
  //   })
  //   this.selectComponent('#search').changechilde(value, 1);
  //   if (!this.data.tdate) {
  //     return false;
  //   }

  //   this.getData()
  // },
  opensea() {
    this.setData({
      showModal: true
    })
  },
  //展开详情
  listdeatil(data) {

    this.setData({
      isopen: data.currentTarget.dataset.id
    })
  },
  //获取数据
  getData: function (type) {
    this.data.params.start_time = this.data.tstart.year + '-' + this.data.tstart.month + '-' + this.data.tstart.day
    this.data.params.end_time = this.data.tend.year + '-' + this.data.tend.month + '-' + this.data.tend.day
    this.setData({
      ntype: type ? type : ''
    })
    http.ordinary.call(this, 'rewardDetail', this.data.params, this.dataToPage, 1, true);
  },
  dataToPage(datas) {
    this.setData({
      datas: datas
    })
    if (datas.reward_detail) {
      console.log(this.data.list)
      var list = this.data.ntype == "more" ? this.data.list.concat(datas.reward_detail) : datas.reward_detail
      console.log(list)
      this.setData({
        list: list
      })
    } 

  },
  //触底加载更多
  onReachBottom: function () {
    this.data.params.page += 1
    this.getData('more')
  },
});
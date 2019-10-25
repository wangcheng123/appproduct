const app = getApp();

const date = new Date()
const years = []
const months = []
const days = []

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
    value: [date.getFullYear(),date.getMonth(),0],  //初始

    year: date.getFullYear(), // 当前年份

    type:1, //1 在选择开始时间  2 选择结束时间

    tstart:{
      year:date.getFullYear(),
      month: parseInt(date.getMonth()) + 1,
      day:"01",
    },

    tend:{
      year: date.getFullYear(),
      month: parseInt(date.getMonth()) + 2,
      day:"01",
    },

  },
  onLoad: function (options) {

  },

  //处理值的修改
  dchange:function(e){
    
    var value = e.detail.value

    if(this.data.type == 1){
      this.setData({
        tstart:{
          year: years[value[0]],
          month: months[value[1]],
          day: days[value[2]],
        }
      })
    }else{
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
  check_type:function(e){

    var type = e.target.dataset.type

    this.setData({
      type:type
    })

  },

  //确认时间
  timesub:function(){
    //先判断时间 开始时间小于结束
    
    var tstart = this.data.tstart.year + '-' + this.data.tstart.month + "-" + this.data.tstart.day;

    var tend = this.data.tend.year + '-' + this.data.tend.month + "-" + this.data.tend.day;


    if (Date.parse(tstart) > Date.parse(tend)){
      wx.showToast({
        title: '开始时间不能超过结束时间',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    var pages = getCurrentPages();

    var currPage = pages[pages.length - 1];//当前页面

    var prevPage = pages[pages.length - 2];//上一个页面

    prevPage.setData({
      start_time: tstart,
      end_time: tend
    })

    wx.navigateBack({delta:1});
    
  },

})
var utilMd5 = require('../../../md5.js');
var index = 0;
var li=[];
var app = getApp();
Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '浪花鲜酿',
      path: '/page/component/category/category'
    }
  },
  data:{ 
    list:li,
    couponList: [],
    selectIndex:0,
    defaultAddress:'',
    sourcePage:''
  },
  onLoad: function(options) {
    var self = this;
    wx.request({
      url: app.baseUrl + '/getdikouquan',
      data: {
        openid: app.openId,
        sign: utilMd5.hexMD5('getdikouquan?openid' + app.openId + app.solt)
      },
      success: function (res) {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        var couponTemp = res.data.data;
        let timestamp = (new Date().getTime());
        for (var i in couponTemp){
          var overDuetime = (couponTemp[i].AbortTime);
          couponTemp[i].dueTime = app.formatDate(overDuetime);
          if (timestamp < overDuetime*1000) {
            couponTemp[i].use = true;
          } else {
            couponTemp[i].use = false;
          }
          couponTemp[i].money = app.fen2Yuan(couponTemp[i].RealScore);
        }
        self.setData({
          couponList: couponTemp
        });
        wx.getStorage({
          key: 'coupon',
          success(res) {
            self.setData({
              selectIndex: res.data.id
            })
          }
        })
      }
    }) 
  },
  toOrderPage: function (e) {
    var self = this;
    for (var i = 0; i < this.data.list.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        li[e.currentTarget.dataset.index].image = "../../image/check.jpg"
      }
      else {
        li[i].image = "../../image/uncheck.png"
      }
    }
    let money = e.currentTarget.dataset.money;
    var value = {
      money: money,
      abortTime: app.formatDate(e.currentTarget.dataset.time),
      id: e.currentTarget.dataset.id,
      nMoney: app.fen2Yuan(money)
    };
    wx.setStorage({
      key: 'coupon',
      data: value,
      success() {
        wx.navigateBack({
          url: '../order/order'
        });
      }
    })
  },
})
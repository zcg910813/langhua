var utilMd5 = require('../../../md5.js');
var index = 0;
var li = [];
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
  data: {
    bagList:[],
  },
  onLoad: function (options) {
    var self = this;
    //加载购物列表数据
    wx.request({
      url: app.baseUrl + '/getallredpack',
      data: {
        openid: app.openId,
        sign: utilMd5.hexMD5('getallredpack?openid' + app.openId + app.solt)
      },
      success: function (res) {
        self.setData({
          bagList: res.data.data
        });
      }
    })
    let redpackid = options.target.dataset.id;
    var that = this;
    wx.request({
      url: app.baseUrl + '/getdikouquan',
      data: {
        openid: app.openId,
        redpackid: redpackid,
        sign: utilMd5.hexMD5('getdikouquan?openid' + app.openId + 'redpackid' + redpackid + app.solt)
      },
      success: res => {
        let money = 0;
        let temp = res.data.data.add_jifen;
        money = temp / 100;
        money = money + temp % 100;
        wx.showModal({
          title: '提示',
          content: '恭喜您，您获得' + money + '元红包',
          showCancel: false
        });
      }
    })
  },
  choujiang: function (e) {
    
  },
})
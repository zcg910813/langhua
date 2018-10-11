var utilMd5 = require('../../../md5.js');
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
    orders:[],
    nickname: '',
    thumb: '',
    hasAddress: false,//是否有地址
    hasOrder:false,//是否有订单
    showMask:false,//是否显示涂层
    showWLModal:false,//是否显示物流详情
    wlInfo:{},//物流信息，
    phone:'',//物流电话
    serviceUrl: "/image/kf.png"
    // skip:[
    //   { index: 0, msg:'待付款'},
    //   { index: 1, msg: '配送中' },
    //   { index: 2, msg: '已完成' },
    // ]
  },
  onShow(){
    var self = this;
    self.setData({
      nickname: app.nickname,
      thumb: app.avatarUrl
    });
    //订单列表
    wx.request({
      url: app.baseUrl + '/allorder',
      data: {
        openid: app.openId,
        startDate: '2018-04-01',
        endDate: '2029-04-01',
        sign: utilMd5.hexMD5('allorder?openid' + app.openId +'startDate2018-04-01endDate2029-04-01'+ app.solt)
      },
      success(res) {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        var ordersTemp = res.data.data;
        if (ordersTemp.length > 0){
          self.setData({
            hasOrder: true
          }); 
        }
        for(var i in ordersTemp){
          for(var m in ordersTemp[i].AllGoods){
           ordersTemp[i].AllGoods[m].nPrice = app.fen2Yuan(ordersTemp[i].AllGoods[m].Price);
          }
          ordersTemp[i].nTotalPrice = app.fen2Yuan(ordersTemp[i].TotalPrice);
        }
        self.setData({
          orders: ordersTemp
        });
      }
    })
  },
  payOrders(e){
    var that = this;
    var orderId = e.target.dataset.id;
    wx.request({
      url: app.baseUrl + '/payorder',
      data: {
        orderid: orderId,
        sign: utilMd5.hexMD5('payorder?orderid' + orderId + app.solt)
      },
      success:res=>{
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        app.orderBuy(res.data.data.wechat_pay.timeStamp + '', res.data.data.wechat_pay.nonceStr, res.data.data.wechat_pay.package, res.data.data.wechat_pay.signType, res.data.data.wechat_pay.sign,0);
      }
    })
  },
  deleteOrders(e){
    wx.showModal({
      title: '提示',
      content: '您确定要删除该订单吗？',
      success: res=>{
        if(res.confirm){
          const orderid = e.target.dataset.id;
          const index = e.target.dataset.index;
          wx.request({
            url: app.baseUrl + '/rmvorder',
            data: {
              openid: app.openId,
              orderid: orderid,
              sign: utilMd5.hexMD5('rmvorder?openid' + app.openId + 'orderid' + orderid + app.solt)
            },
            success: res => {
              if (res.data.error != 0) {
                app.validError(res.data.error);
              }
              let orders = this.data.orders;
              orders.splice(index, 1);
              this.setData({
                orders: orders
              });
              if (!orders.length) {
                this.setData({
                  hasOrder: false
                });
              }
            },
            fail: res => {
              wx.showModal({
                title: '提示',
                content: '删除失败联系管理员',
              })
            }
          })
        }
      }
    })
  },
  queryeleorder:function(e){
    var self = this;
    const orderid = e.target.dataset.id;
    wx.request({
      url: app.baseUrl + '/queryeleorder',
      data: {
        orderid: orderid,
        sign: utilMd5.hexMD5('queryeleorder?orderid' + orderid + app.solt)
      },
      success: res=>{
        self.setData({
          showMask:true,
          showWLModal:true,
          wlInfo: res.data.data
        });
      }
    })
  },
  callPhone:function(e){
    let phone = e.target.dataset.phone;
    if(phone){
      this.setData({
        phone: phone
      });
      wx.makePhoneCall({
        phoneNumber: this.data.phone,
      })
    }
  },
  onclosewl:function(){
    this.setData({
      showWLModal: false,
      showMask:false
    });
  },
  Img_change: function (e) {
    this.setData({
      serviceUrl:"/image/kf.png"
    })
  },
  onHide(){
    this.setData({
      serviceUrl: "/image/kf.png"
    })
  },
  skip_a: function (e) {
    wx.navigateTo({
      url: '/page/component/order_form/order_form?skip_a=1',
    })
  },
  skip_b: function (e) {
    
    wx.navigateTo({
      url: '/page/component/order_form/order_form?skip_b=1',
    })
  },
  skip_c: function (e) {
    wx.navigateTo({
      url: '/page/component/order_form/order_form?skip_c=1',
    })
  },
  skip_d: function (e) {
    wx.navigateTo({
      url: '/page/component/order_form/order_form?skip_d=1',
    })
  },
})
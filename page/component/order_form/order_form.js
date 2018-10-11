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
  data: {
    selectPerson_a:true,
    _background :'',
    orders: [],
    nickname: '',
    thumb: '',
    hasAddress: false,//是否有地址
    hasOrder: false,//是否有订单
    showMask: false,//是否显示涂层
    showWLModal: false,//是否显示物流详情
    wlInfo: {},//物流信息，
    phone: '',//物流电话
    refund_id:{},
    hasNoOrder : false, //是否有未付款的
    noOrders : [], //全部的未付款
    delivery : false,  // 是否有配送
    allDelivery :[],
    wancheng :false,//是否显示完成的
    allDone : [],
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    skip_a: false,
    skip_b: false,
    skip_c: false,
    skip_d: false,
    disabled :true,
    Margin:"",
    _flag: true,
    _ziti:false,
    _peisong:false
  },

  /*黑的背景*/ 
  b: function () {
    this.setData({
      _flag: true,
      totalPrice: 0
    })
  },
  /*遮罩层*/ 
  pickUp:function(){
    var self = this;
    self.setData({
      _flag: false,
      // taocanTitle: e.currentTarget
    });
  },
  /*全部订单展开*/
  order_spread: function (e) {
    let orders = this.data.orders; 
    let index = e.currentTarget.dataset.index;
    if (orders[index].selectPerson_a==true){
      orders[index].selectPerson_a = !orders[index].selectPerson_a;
      this.setData({
        orders: orders,
        _background: "#fff",
        Margin: "22rpx"
      })
    }else{
      orders[index].selectPerson_a =!orders[index].selectPerson_a;
      this.setData({
        orders: orders,
        _background: "#fff",
        Margin: ""
      })
    }  
  },
  /*未支付订单展开*/
  noOrders_spread: function (e) {
    let noOrders = this.data.noOrders;
    let index = e.currentTarget.dataset.index;
    if (noOrders[index].selectPerson_a == true) {
      noOrders[index].selectPerson_a = !noOrders[index].selectPerson_a;
      this.setData({
        noOrders: noOrders,
        _background: "#fff",
        Margin: "22rpx"
      })
    } else {
      noOrders[index].selectPerson_a = !noOrders[index].selectPerson_a;
      this.setData({
        noOrders: noOrders,
        _background: "#fff",
        Margin: ""
      })
    }
  },
  /*已支付订单展开*/
  allDelivery_spread: function (e) {
    let allDelivery = this.data.allDelivery;
    let index = e.currentTarget.dataset.index;
    if (allDelivery[index].selectPerson_a == true) {
      allDelivery[index].selectPerson_a = !allDelivery[index].selectPerson_a;
      this.setData({
        allDelivery: allDelivery,
        _background: "#fff",
        Margin: "22rpx"
      })
    } else {
      allDelivery[index].selectPerson_a = !allDelivery[index].selectPerson_a;
      this.setData({
        allDelivery: allDelivery,
        _background: "#fff",
        Margin: ""
      })
    }
  },
  /*已完成订单展开*/
  allDone_spread: function (e) {
    let allDone = this.data.allDone;
    let index = e.currentTarget.dataset.index;
    if (allDone[index].selectPerson_a == true) {
      allDone[index].selectPerson_a = !allDone[index].selectPerson_a;
      this.setData({
        allDone: allDone,
        _background: "#fff",
        Margin: "22rpx"
      })
    } else {
      allDone[index].selectPerson_a = !allDone[index].selectPerson_a;
      this.setData({
        allDone: allDone,
        _background: "#fff",
        Margin: ""
      })
    }
  },
  mySelect:function(){
    this.setData({
      selectPerson: false,
      selectPerson_a: false
    })
  },
  onShow() {
    var self = this;
    self.deleteOrders();
    self.setData({
      nickname: app.nickname,
      thumb: app.avatarUrl
    });
    wx.request({
      url: app.baseUrl + '/allorder',
      data: {
        openid: app.openId,
        startDate: '2018-04-01',
        endDate: '2029-04-01',
        sign: utilMd5.hexMD5('allorder?openid' + app.openId + 'startDate2018-04-01endDate2029-04-01' + app.solt)
      },
      success(res) {
        // console.log(res)
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        var ordersTemp = res.data.data;
        if (ordersTemp.length > 0) {
          self.setData({
            hasOrder: true
          });
        }
        var order_count = [];
        var amount = 0;
        for (let i in ordersTemp) {    
          for (let m in ordersTemp[i].AllGoods) {
            ordersTemp[i].AllGoods[m].nPrice = app.fen2Yuan(ordersTemp[i].AllGoods[m].Price);
          }
          ordersTemp[i].nTotalPrice = app.fen2Yuan(ordersTemp[i].TotalPrice);
          ordersTemp[i].RedPackMoney = app.fen2Yuan(ordersTemp[i].RedPackMoney);
        }
        for (let i = 0; i < ordersTemp.length;i++){
          ordersTemp[i].selectPerson_a =true;
          if (ordersTemp[i].OrderState==0){
            ordersTemp[i].dzf =true
            ordersTemp[i].Zitishow = false
            ordersTemp[i].Peisongshow = false
            ordersTemp[i].tk = false
          }else
          if (ordersTemp[i].OrderState == 99){
            ordersTemp[i].Zitishow=true
            ordersTemp[i].Peisongshow = false
            ordersTemp[i].tk = true
          }else{
            ordersTemp[i].Peisongshow = true;
            ordersTemp[i].Zitishow = false
            ordersTemp[i].tk = true
          }
        }  
        self.setData({
          orders: ordersTemp
        });
      }
    });
    /*待付款*/
    wx.request({
      url: app.baseUrl + '/nopayorder',
      data: {
        openid: app.openId,
        startDate: '2018-04-01',
        endDate: '2029-04-01',
        sign: utilMd5.hexMD5('nopayorder?openid' + app.openId + 'startDate2018-04-01endDate2029-04-01' + app.solt)
      },
      success: res => {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        var nofk = res.data.data;
        if (nofk.length > 0) {
          self.setData({
            hasNoOrder: true
          });
        }
        for (let i in nofk) {
          for (let m in nofk[i].AllGoods) {
            nofk[i].AllGoods[m].nPrice = app.fen2Yuan(nofk[i].AllGoods[m].Price);
          }
          nofk[i].nTotalPrice = app.fen2Yuan(nofk[i].TotalPrice);
          nofk[i].RedPackMoney = app.fen2Yuan(nofk[i].RedPackMoney);
        }
        for (let i = 0; i < nofk.length;i++){
          nofk[i].selectPerson_a = true
        }
        self.setData({
          noOrders: nofk
        });      
      }
    });
    /*已付款*/
    wx.request({
      url: app.baseUrl + '/getpayorder',
      data: {
        openid: app.openId,
        startDate: '2018-04-01',
        endDate: '2029-04-01',
        sign: utilMd5.hexMD5('getpayorder?openid' + app.openId + 'startDate2018-04-01endDate2029-04-01' + app.solt)
      },
      success: res => {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        var allPeisong = res.data.data;
        if (allPeisong.length > 0) {
          self.setData({
            delivery: true
          });
        }
        for (let i in allPeisong) {
          for (let m in allPeisong[i].AllGoods) {
            allPeisong[i].AllGoods[m].nPrice = app.fen2Yuan(allPeisong[i].AllGoods[m].Price);
          }
          allPeisong[i].nTotalPrice = app.fen2Yuan(allPeisong[i].TotalPrice);
          allPeisong[i].RedPackMoney = app.fen2Yuan(allPeisong[i].RedPackMoney);
        }
        for (let i = 0; i < allPeisong.length;i++){
          allPeisong[i].selectPerson_a =true
          if (allPeisong[i].OrderState == 99) {
            allPeisong[i].Peisongshow = false
            allPeisong[i].Zitishow = true
          }else{
            allPeisong[i].Zitishow = false
            allPeisong[i].Peisongshow = true
          }
        }
        self.setData({
          allDelivery: allPeisong
        });
      }
    });
    /*已完成*/
    wx.request({
      url: app.baseUrl + '/trueorder',
      data: {
        openid: app.openId,
        startDate: '2018-04-01',
        endDate: '2029-04-01',
        sign: utilMd5.hexMD5('trueorder?openid' + app.openId + 'startDate2018-04-01endDate2029-04-01' + app.solt)
      },
      success: res => {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        var allFinish = res.data.data;
        if (allFinish.length > 0) {
          self.setData({
            wancheng: true
          });
        }
        for (let i in allFinish) {
          for (let m in allFinish[i].AllGoods) {
            allFinish[i].AllGoods[m].nPrice = app.fen2Yuan(allFinish[i].AllGoods[m].Price);
          }
          allFinish[i].nTotalPrice = app.fen2Yuan(allFinish[i].TotalPrice);
          allFinish[i].RedPackMoney = app.fen2Yuan(allFinish[i].RedPackMoney);
        }
        self.setData({
          allDone: allFinish
        });
      }
    })
  },
  tabFun:function(e){
    var self = this;
    //订单列表
    //  sessionStorage.setItem('showMask',true); 
    if (e.target.dataset.id && e.target.dataset.id == 0){
      self.setData({
        skip_a: false,
        skip_b: false,
        skip_c: false,
        skip_d: true
      })      
    }
    if (e.target.dataset.id && e.target.dataset.id == 1) {
      self.setData({
        skip_a: true,
        skip_b: false,
        skip_c: false,
        skip_d: false
      })
    }
    if (e.target.dataset.id && e.target.dataset.id == 2) {
      self.setData({
        skip_a: false,
        skip_b: true,
        skip_c: false,
        skip_d: false
      })
    }
    if (e.target.dataset.id && e.target.dataset.id == 3) {
      self.setData({
        skip_a: false,
        skip_b: false,
        skip_c: true,
        skip_d: false
      })
    }

    var _datasetId = e.target.dataset.id;
    var _obj = {};
    // _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  },

  onHide(){
    sessionStorage.setItem('showMask', true);
  },
  payOrders(e) {
    var that = this;
    var orderId = e.target.dataset.id;
    wx.request({
      url: app.baseUrl + '/payorder',
      data: {
        orderid: orderId,
        sign: utilMd5.hexMD5('payorder?orderid' + orderId + app.solt)
      },
      success: res => {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        app.orderBuy(res.data.data.wechat_pay.timeStamp + '', res.data.data.wechat_pay.nonceStr, res.data.data.wechat_pay.package, res.data.data.wechat_pay.signType, res.data.data.wechat_pay.sign, 0);
      }
    })
  },
  /*退款*/
  refund:function(e){
    let self = this;
    let index = e.currentTarget.dataset.index
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '您确定要退款吗',
      success: res => {
        if(res.confirm){
            var self = this;
            // self.setData({
            //   disabled: !self.data.disabled
            // })
            const orderid = e.target.dataset.id;
            wx.request({
              url: app.baseUrl + '/backorder',
              data: {
                openid: app.openId,
                orderid: orderid,
                sign: utilMd5.hexMD5('backorder?openid' + app.openId + 'orderid' + orderid + app.solt)
              },
              success: res => {
                console.log(res)
                if (res.data.error != 0) {
                  app.validError(res.data.error);
                }
              }
            })  
          }else if(res.cancel){

          }                  
        }
    })
  },
  // /*隐藏删除订单*/
  deleteOrders_hide(e) {
    var index = e.target.dataset.index;
    wx.showModal({
      title: '提示',
      content: '您确定要删除该订单吗？',
      success: res => {
        if (res.confirm) {
          const orderid = e.target.dataset.id;
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
                hasNoOrder: false
              })
              this.setData({
                orders: orders
              });
              // wx.redirectTo({
              //   url: '/page/component/order_form/order_form',
              // })
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
  /* 删除订单*/
  deleteOrders(e) {
    var index = e.target.dataset.index;
    wx.showModal({
      title: '提示',
      content: '您确定要删除该订单吗？',
      success: res => {
        if (res.confirm) {
          const orderid = e.target.dataset.id;
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
                hasNoOrder: false
              })
              this.setData({
                orders: orders
              });
              // wx.redirectTo({
              //   url: '/page/component/order_form/order_form',
              // })
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
  queryeleorder: function (e) {
    var self = this;
    const orderid = e.target.dataset.id;
    wx.request({
      url: app.baseUrl + '/queryeleorder',
      data: {
        orderid: orderid,
        sign: utilMd5.hexMD5('queryeleorder?orderid' + orderid + app.solt)
      },
      success: res => {
        self.setData({
          showMask: true,
          showWLModal: true,
          wlInfo: res.data.data
        });
      }
    })
  },
  callPhone: function (e) {
    let phone = e.target.dataset.phone;
    if (phone) {
      this.setData({
        phone: phone
      });
      wx.makePhoneCall({
        phoneNumber: this.data.phone,
      })
    }
  },
  onclosewl: function () {
    this.setData({
      showWLModal: false,
      showMask: false
    });
  },
  onLoad: function (e) {
    if (e.skip_a && e.skip_a == 1) {
      this.setData({
        skip_a: true,
        skip_b: false,
        skip_c: false,
        skip_d: false
      })
    }

    if (e.skip_b && e.skip_b == 1) {
      this.setData({
        skip_a: false,
        skip_b: true,
        skip_c: false,
        skip_d: false
      })
    }

    if (e.skip_c && e.skip_c == 1) {
      this.setData({
        skip_a: false,
        skip_b: false,
        skip_c: true,
        skip_d: false
      })
    }

    if (e.skip_d && e.skip_d == 1) {
      this.setData({
        skip_a: false,
        skip_b: false,
        skip_c: false,
        skip_d: true
      })
    }

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onUnload: function () {
    wx.switchTab({
      url: '/page/component/user/user'
    })
  },
})
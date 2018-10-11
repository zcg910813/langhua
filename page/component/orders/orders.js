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
    user_address: {},//收货地址
    orders: [],//订单list
    psPrice: 6,//配送费
    totalPrice: 0,//单纯的商品总价
    orderPrice: 0,//最后订单总金额
    coupon: {}, //优惠券,
    isFirstOrder: 0,
    totalPrice_a: 0,
    amount: 0,
    all_num: [],
    date: 0,
    peisong: 0,
    yunFei: 0,
    dizhiBg: "",
    jd: '', //经度
    wd: '', //纬度
    key: '',
    item: [],
    _flag:true,
    work_begin_time:'',
    work_end_time:''
  },
  onLoad() {
    // console.log(this.data.peisong)
    // if (this.data.peisong == 1) {
    //   this.setData({
    //     orderPrice: this.data.orderPrice + 6
    //   })
    // }
  },
  onShow: function () {
    const self = this;
    self.setData({
      isFirstOrder: app.isFirstOrder,
      psPrice: app.psMoney
    });
    //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间  
    var n = timestamp * 1000;
    var date = new Date(n);
    //时  
    var h = date.getHours();
    var m = date.getMinutes();
    m = m > 9 ? m : "0" + m;
    this.setData({
      start_time: h + ':' + m,
      end_time: h + 1 + ':' + m
    })
    wx.request({
      url: app.baseUrl + '/cart',
      data: {
        openid: app.openId,
        sign: utilMd5.hexMD5('cart?openid' + app.openId + app.solt)
      },
      success: function (res) {
        //  console.log(res.data.data.length)
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        let tempOrders = res.data.data;
        for (var i in tempOrders) {
          tempOrders[i].nPrice = app.fen2Yuan(tempOrders[i].Price)
        }
        // console.log(res)
        self.setData({
          amount: res.data.data.length,
          orders: tempOrders
        });
        self.getTotalPrice();
        wx.getStorage({
          key: 'user_address',
          success(res) {
            self.setData({
              user_address: res.data,
              hasAddress: true,
              // orderPrice: self.data.totalPrice + self.data.yunFei
            })
          }
        });
      }
    });
    wx.getStorage({
      key: 'coupon',
      success(res) {
        if (res.data) {
          self.setData({
            coupon: res.data,
            hasCoupon: true
          })
        }
      }
    });
    let hour = date.getHours();
    self.date = hour;
    //console.log(self.date);
  },
  /*点图片返回购物车*/
  img_return : function (){
      wx.navigateBack({
        data: 1
      })
  }, 
  getTotalPrice() {
    let carts = this.data.orders;
    let tempTotalPrice1 = 0;
    let tempTotalPrice2 = 0;
    let tempTotalPrice_a = 0;
    let zongshu500 = 0;
    let zongshu1000 = 0;
    let newCarts = [];
    let newCarts500 = [];
    let newCarts1000 = [];
    let yuanjia500 = 1800;
    let yuanjia1000 = 3600;
    let arrping5001 = [];
    let arrping5002 = [];
    let arrping10001 = [];
    let arrping10002 = [];
    let arrping10004 = [];
    let arrping10006 = [];
    let numpingHe500l = 0;
    let numpingHe5002 = 0;
    let numpingHe1000l = 0;
    let numpingHe10002 = 0;
    let numpingHe10004 = 0;
    let numpingHe10006 = 0;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected) {     //判断获取选中获取到的商品
        newCarts.push(carts[i])
      }    // tempTotalPrice_a = tempTotalPrice+6
    }
    for (let i = 0; i < newCarts.length; i++) {
      if (newCarts[i].Volume == "500") {     //获取选中的商品中所有规格为500ml的商品
        newCarts500.push(newCarts[i])
      }
    }
    for (let i = 0; i < newCarts500.length; i++) {   //500ml中所有1瓶装的数量
      if (newCarts500[i].GoodsId == "10001" || newCarts500[i].GoodsId == "10003" || newCarts500[i].GoodsId == "10005") {
        arrping5001.push(parseInt(newCarts500[i].count))
        numpingHe500l = arrping5001.reduce((x, y) => { return x + y; });
      }
    }
    for (let i = 0; i < newCarts500.length; i++) {   //500ml中所有两瓶装的数量
      if (newCarts500[i].GoodsId == "10007" || newCarts500[i].GoodsId == "10009" || newCarts500[i].GoodsId == "10011") {
        arrping5002.push(parseInt(newCarts500[i].count))
        numpingHe5002 = arrping5002.reduce((x, y) => { return x + y; }) * 2;
      }
    }


    // if (zongshu500 = 0){
    //   tempTotalPrice1 =0
    // }else if (zongshu500=1){
    //   tempTotalPrice1 = zongshu500 * yuanjia500   //计算购买1瓶以上500ml规格的总价格
    // }else if (zongshu500>=2){
    //   tempTotalPrice1 = zongshu500 * yuanjia500 * 0.95    //计算只买两瓶以上500ml规格的总价格
    // }

    for (let i = 0; i < newCarts.length; i++) {
      if (newCarts[i].Volume == "1000") {     //获取选中的商品中所有规格为1000ml的商品
        newCarts1000.push(newCarts[i])
      }
    }
    for (let i = 0; i < newCarts1000.length; i++) {   //1000ml中所有1瓶装的数量
      if (newCarts1000[i].GoodsId == "10002" || newCarts1000[i].GoodsId == "10004" || newCarts1000[i].GoodsId == "10006") {
        arrping10001.push(parseInt(newCarts1000[i].count))
        numpingHe1000l = arrping10001.reduce((x, y) => { return x + y; });
      }
    }
    for (let i = 0; i < newCarts1000.length; i++) {   //1000ml中所有两瓶装的数量
      if (newCarts1000[i].GoodsId == "10008" || newCarts1000[i].GoodsId == "10010" || newCarts1000[i].GoodsId == "10012") {
        arrping10002.push(parseInt(newCarts1000[i].count))
        numpingHe10002 = arrping10002.reduce((x, y) => { return x + y; }) * 2;
      }
    }
    for (let i = 0; i < newCarts1000.length; i++) {   //1000ml中所有四瓶装的数量
      if (newCarts1000[i].GoodsId == "10013" || newCarts1000[i].GoodsId == "10015" || newCarts1000[i].GoodsId == "10017") {
        arrping10004.push(parseInt(newCarts1000[i].count))
        numpingHe10004 = arrping10004.reduce((x, y) => { return x + y; }) * 4;
      }
    }
    for (let i = 0; i < newCarts1000.length; i++) {   //1000ml中所有六瓶装的数量
      if (newCarts1000[i].GoodsId == "10014" || newCarts1000[i].GoodsId == "10016" || newCarts1000[i].GoodsId == "10018") {
        arrping10006.push(parseInt(newCarts1000[i].count))
        numpingHe10006 = arrping10006.reduce((x, y) => { return x + y; }) * 6;
      }
    }
    zongshu500 = numpingHe500l + numpingHe5002;                                        //计算所有500ml规格的瓶数总和
    zongshu1000 = numpingHe1000l + numpingHe10002 + numpingHe10004 + numpingHe10006;   //计算所有1000ml规格的瓶数总和


    //console.log(zongshu500);
    // tempTotalPrice1 = zongshu500*yuanjia500;
    //console.log(zongshu1000)
    // tempTotalPrice2 = zongshu1000*yuanjia1000
    // console.log(tempTotalPrice1)
    // console.log(tempTotalPrice2)

    if (zongshu500 == 1) {                                                             //判断500ml总数量阶梯折扣价格
      tempTotalPrice1 = zongshu500 * yuanjia500;
    } else if (zongshu500 >= 2) {
      tempTotalPrice1 = zongshu500 * yuanjia500 * 0.95;
    }
    // console.log(tempTotalPrice1)

    if (zongshu1000 == 1) {                                                             //判断1000ml总数量阶梯折扣价格
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.88;
    } else if (zongshu1000 == 2) {
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.88;
      // console.log(tempTotalPrice2)
    } else if (zongshu1000 == 3) {
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.79;
    } else if (zongshu1000 == 4) {
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.79;
    } else if (zongshu1000 == 5) {
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.74;
    } else if (zongshu1000 == 6) {
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.74;
    } else if (zongshu1000 >= 7) {
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.7;
    }
    // console.log(tempTotalPrice2)


    tempTotalPrice_a = Math.round(tempTotalPrice1 / 100) + Math.round(tempTotalPrice2 / 100)
    // let orders = this.data.orders;
    // let totalPriceTemp = 0;
    // let amount = 0;
    // let all_num = [];
    // let time = this.data.coupon.abortTime;
    // for(let i = 0; i < orders.length; i++) {
    //   totalPriceTemp += orders[i].count * orders[i].Price;
    //   all_num.push(parseInt(orders[i].count))
    //   this.setData({
    //     amount: all_num.reduce((x, y) => { return x + y; })
    //   })//所有商品的总数量
    // }
    // console.log(totalPriceTemp);
    // this.setData({
    //   totalPrice: app.fen2Yuan(totalPriceTemp)
    // }) 
    // if (this.data.coupon.money) {
    //   tempTotalPrice_a = tempTotalPrice_a - this.data.coupon.money / 100;
    // } else {
    //   tempTotalPrice_a = tempTotalPrice_a;
    // }
    // //如果需要支付的金额小于等于0 或者 用户是首单，则默认支付1分钱
    // if (totalPriceTemp <= 0 || this.data.isFirstOrder){
    //   totalPriceTemp = 1;
    // }
    // //加上邮费
    // totalPriceTemp = app.fen2Yuan(totalPriceTemp);
    // // totalPriceTemp = Number(totalPriceTemp)+Number(this.data.psPrice);
    // totalPriceTemp = Number(totalPriceTemp) + 6;

    let self = this;
    // if (app.isFirstOrder == 0) {
    //   self.setData({
    //     totalPrice: tempTotalPrice_a,
    //     orderPrice: (tempTotalPrice_a - 18).toFixed(2)
    //   })
    // } else {
    //   self.setData({
    //     totalPrice: tempTotalPrice_a,
    //     orderPrice: tempTotalPrice_a.toFixed(2)
    //   })
    // }
    if (app.isFirstOrder == 0) {  
      if(self.data.yunFei){
        self.setData({
          totalPrice: tempTotalPrice_a,
          orderPrice: (tempTotalPrice_a + self.data.yunFei).toFixed(2)
        })
      }else{
        self.setData({
          totalPrice: tempTotalPrice_a,
          orderPrice: tempTotalPrice_a - 18
        })
      }
      console.log("newUser" +self.orderPrice)
    } else{
      if (self.data.coupon.money && self.data.yunFei) {
        self.setData({
          totalPrice: tempTotalPrice_a,
          orderPrice: (tempTotalPrice_a - self.data.coupon.money / 100 + self.data.yunFei).toFixed(2)
        })
      } else if (self.data.coupon.money){
        self.setData({
          totalPrice: tempTotalPrice_a,
          orderPrice: (tempTotalPrice_a - self.data.coupon.money/100).toFixed(2)
        })
      } else if (self.data.yunFei){
        self.setData({
          totalPrice: tempTotalPrice_a,
          orderPrice: (tempTotalPrice_a + self.data.yunFei).toFixed(2)
        })
      }else{
        self.setData({
          totalPrice: tempTotalPrice_a,
          orderPrice: tempTotalPrice_a
        })
      }
    }
    console.log(self.data.orderPrice)
    // this.setData({
    //   totalPrice: tempTotalPrice_a,
    //   orderPrice: tempTotalPrice_a
    // })
    // if (isNaN(this.data.orderPrice)){    
    //   totalPriceTemp = Number(totalPriceTemp) + 6;
    // } 
  },
  radioChange: function (e) {
    // var delivery = e.detail.value;
    // console.log(e.detail);
    this.setData({
      peisong: e.detail.value,
    })
  },
  b: function () {
    this.setData({
      _flag: true,
    })
  },
  Ziti() {
    var that = this;             //点击自提地址变灰，运费变0的方法
    let totalPrice = that.data.totalPrice
    that.setData({
      yunFei: 0,
      dizhiBg: "none",
      zitiColor: "#adadad",
      orderPrice: totalPrice.toFixed(2)
    })
    wx.request({
      url: app.baseUrl + '/isworking',
      success: function (res) {
        if (res.data.data === true) {
          /*请求返回的自提信息*/
          that.data.peisong = 2;
          wx.getLocation({
            success: function (res) {
              var user_latitude = res.latitude;
              var user_longitude = res.longitude;
              that.setData({
                wd: user_latitude,
                jd: user_longitude
              })
              wx.request({
                url: app.baseUrl + '/showshopsinfo',
                data: {
                  user_longitude: user_longitude,
                  user_latitude: user_latitude,
                  sign: utilMd5.hexMD5('showshopsinfo?user_longitude' + user_longitude + 'user_latitude' + user_latitude + app.solt)
                },
                success: function (res) {
                  wx.navigateTo({
                    url: '/page/component/pickUp/pickUp',
                  })
                  that.setData({
                    pickUp: res.data
                  })

                  wx.setStorage({
                    key: 'pickUp',
                    data: that.data.pickUp,
                  })
                }
              });

            }
          })
        } else if (res.data.data === false) {
          that.setData({
            work_begin_time: res.data.work_begin_time,
            work_end_time: res.data.work_end_time
          })
          that.setData({
            _flag: false
          });
        }
      }
    });
    
  },
  Peisong() {                               //点击配送所有值返回默认
    //let totalPrice = this.data.totalPrice + 6
    var self = this;
    self.setData({
      yunFei: 6,
      dizhiBg: "",
      zitiColor: "",
      orderPrice: parseFloat(self.data.orderPrice) +6
    })

    wx.request({
      url: app.baseUrl + '/isworking',
      success: function (res) {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        if (res.data.data === true) {
          self.data.peisong = 1
        } else if (res.data.data === false) {
          self.setData({
            work_begin_time: res.data.work_begin_time,
            work_end_time: res.data.work_end_time
          })
          self.setData({
            _flag: false
          });
        }
      }
    });
  },
  toPay(e) {
    var self = this;
    wx.request({
      url: app.baseUrl + '/isworking',
      success: function (res) {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        if (res.data.data === true) {
          if (self.data.peisong == 0) {
            wx.showModal({
              title: '提示',
              content: '你还没有选择配送方式',
              showCancel: false,
            })
            return;
          }
          if (self.data.peisong == 1) {
            if (!self.data.user_address.id || self.data.user_address.id == "undefined") {
              wx.showModal({
                title: '提示',
                content: '您还没有选择收货地址～',
                showCancel: false,
              })
              return;
            }
          }
          let redBagId = 0;
          app.data.cartNum = 0;
          if (self.data.coupon.id) {
            redBagId = self.data.coupon.id;
          }//判断红包是否使用 
          wx.getStorage({
            key: 'key',
            success: function (scope) {
              self.setData({
                chain_store_name: encodeURIComponent(scope.data.chain_store_name),
                address: encodeURIComponent(scope.data.address),
                contact_phone: scope.data.contact_phone,
                opening_hours: scope.data.worke_begin_time,
                closing_time: scope.data.worke_end_time
              })
              wx.request({
                url: app.baseUrl + '/buy',
                data: {
                  openid: app.openId,
                  addrid: self.data.user_address.id,
                  redpackid: redBagId,
                  peisong_info: self.data.peisong,
                  chain_store_name: self.data.chain_store_name,
                  address: self.data.address,
                  contact_phone: self.data.contact_phone,
                  sign: utilMd5.hexMD5('buy?openid' + app.openId + 'addrid' + self.data.user_address.id + 'redpackid' + redBagId + 'peisong_info' + self.data.peisong + 'chain_store_name' + self.data.chain_store_name + 'address' + self.data.address + 'contact_phone' + self.data.contact_phone + app.solt)
                },
                success: function (res) {

                  if (res.data.error != 0) {
                    app.validError(res.data.error);
                  }
                  app.orderBuy(res.data.data.wechat_pay.timeStamp + '', res.data.data.wechat_pay.nonceStr, res.data.data.wechat_pay.package, res.data.data.wechat_pay.signType, res.data.data.wechat_pay.sign, res.data.data.redpackid);
                  wx.removeStorage({
                    key: 'coupon',
                    success: function (res) { },
                  })
                }
              })
            },
          })
        } else if (res.data.data === false) {
          console.log(self.data.peisong)
          if (self.data.peisong == 0) {
            wx.showModal({
              title: '提示',
              content: '你还没有选择配送方式',
              showCancel: false,
            })
          }else if (self.data.peisong == 1){
            self.setData({
              work_begin_time: res.data.work_begin_time,
              work_end_time: res.data.work_end_time
            })
            self.setData({
              _flag: false
            });
            return
          } else if (self.data.peisong == 2){
            self.setData({
              work_begin_time: res.data.work_begin_time,
              work_end_time: res.data.work_end_time
            })
            self.setData({
              _flag: false
            });
            return
          } 
        }
      }
    });
    
    // wx.setTabBarBadge({
    //   index: 2,
    //   text: "2"
    // })
    // wx.removeTabBarBadge({
    //   index: 1
    // })   
    
    // var value = wx.getStorageSync('location');
    // console.log(value)


  }
  // ,
  // onUnload() {
  //   wx.switchTab({
  //     url: "/page/component/cart/cart"
  //   })
  // }
})
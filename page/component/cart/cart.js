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
    carts:[], //购物车
    tempcarts:'', //购物车中间变量
    totalPrice: 0, //总价
    hasList:false,
    selectAllStatus:true,
    login:false,
    totalPrice_a:0,
    numFirst:0
  },
  onLoad(){
    let self = this;
    
  },
  onShow() {
    wx.removeTabBarBadge({
      index: 1
    })
    var _this = this;
    if (!app.hasLogin){
      app.validLogin();
    }
    // if (app.isFirstOrder==!false) {
    //   console.log(this)
    //   _this.setData({
    //     totalPrice: 0.01
    //   })
    // }
    _this.data.tempcarts = new Map();
    wx.request({
      url: app.baseUrl + '/cart',
      data: {
        openid: app.openId,
        sign: utilMd5.hexMD5('cart?openid' + app.openId + app.solt)
      },
      success: function (res) {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        var hasList = false;
        var productsList = res.data.data;
        if (productsList.length > 0) {
          hasList = true;
        }
        for (var i in productsList) {
          productsList[i].selected = true;
          _this.data.tempcarts.set(productsList[i].GoodsId, productsList[i].count);
          productsList[i].nPrice = productsList[i].Price/100;
        }
        _this.setData({
          hasList: hasList,
          carts: productsList
        });
        _this.getTotalPrice();

        if (app.isFirstOrder == 0){
          if (_this.data.numFirst >= 1){
            _this.setData({
               totalPrice: _this.data.totalPrice-18
             })
          } else if (_this.data.numFirst ==0 ){
            _this.setData({
              totalPrice: _this.data.totalPrice 
            })
          }
        } else if (app.isFirstOrder == 1){
          _this.setData({
            totalPrice: _this.data.totalPrice
          })
        }
        // if (app.isFirstOrder == 0 && _this.data.numFirst >= 1) {
        //   
        // } else if (app.isFirstOrder == 0 ){
        //   _this.setData({
        //     totalPrice: _this.data.totalPrice
        //   })
        // }
      }
    }) 
    
  },
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let goodsId = e.currentTarget.dataset.id;
    let carts = this.data.carts;
    //
    carts.splice(index,1);
    //
    // this.setData({
    //   carts: carts
    // });
    if(!carts.length){
      this.setData({
        hasList: false
      });
    }
    this.getTotalPrice();
    if (app.isFirstOrder == 0) {
      if (this.data.numFirst>=1) {
        //console.log(self.data.totalPrice)
        this.setData({
          totalPrice: this.data.totalPrice-18
        })
      } else if (this.data.numFirst == 0){
        this.setData({
          totalPrice: this.data.totalPrice
        })
      }
    } else if (app.isFirstOrder == 1){
      this.setData({
        totalPrice: this.data.totalPrice
      })
    }
    if(this.data.carts.length ==0){
      app.data.cartNum = 0
    }else{
      app.data.cartNum = app.data.cartNum -1
    }

    wx.request({
      url: app.baseUrl + '/rmvcart',
      data: {
        openid: app.openId,
        goodsid: goodsId,
        sign: utilMd5.hexMD5('rmvcart?openid' + app.openId + 'goodsid' + goodsId+ app.solt)
      },
      success: res=>{
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
      }
    }) 
  },
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
    if (app.isFirstOrder == 0) {
      if (this.data.numFirst >= 1) {
        this.setData({
          totalPrice: this.data.totalPrice - 18
        })
      } else if (this.data.numFirst == 0) {
        this.setData({
          totalPrice: this.data.totalPrice
        })
      }
    } else if (app.isFirstOrder == 1) {
      this.setData({
        totalPrice: this.data.totalPrice
      })
    }
  },
  addCount(e) {
    var self = this;
    const index = e.currentTarget.dataset.index;
    let carts = self.data.carts;
    let count = parseInt(carts[index].count);
    count = count + 1;
    carts[index].count = count;
    self.setData({
      carts: carts
    });
    self.getTotalPrice();
    if (app.isFirstOrder == 0) {
      if (self.data.numFirst >= 1) {
        self.setData({
          totalPrice: self.data.totalPrice - 18
        })
      } else if (self.data.numFirst == 0) {
        self.setData({
          totalPrice: self.data.totalPrice
        })
      }
    } else if (app.isFirstOrder == 1) {
      self.setData({
        totalPrice: self.data.totalPrice
      })
    }
  },
  minusCount(e) {
    var self = this;
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = self.data.carts;
    let count = carts[index].count;
    if (count <= 1){
      return false;
    }
    count = count - 1;
    carts[index].count = count;
    self.setData({
      carts: carts
    });
    self.getTotalPrice();
    if (app.isFirstOrder == 0) {
      if (self.data.numFirst >= 1) {
        self.setData({
          totalPrice: self.data.totalPrice - 18
        })
      } else if (self.data.numFirst == 0) {
        self.setData({
          totalPrice: self.data.totalPrice
        })
      }
    } else if (app.isFirstOrder == 1) {
      self.setData({
        totalPrice: self.data.totalPrice
      })
    }
  },
  getTotalPrice() {
    let carts = this.data.carts; 
    let tempTotalPrice1 = 0;
    let tempTotalPrice2 = 0;
    let tempTotalPrice_a = 0;
    let zongshu500 = 0;
    let zongshu1000 = 0;
    let newCarts = [];
    let newCarts500 = [];
    let newCarts1000 = [];
    let yuanjia500 =1800;
    let yuanjia1000 =3600;
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
    for(let i = 0; i<carts.length; i++) {     
      if(carts[i].selected) {     //判断获取选中获取到的商品
        newCarts.push(carts[i])
      }    // tempTotalPrice_a = tempTotalPrice+6
    } 
    for (let i = 0; i < newCarts.length;i++){
      if (newCarts[i].Volume == "500"){     //获取选中的商品中所有规格为500ml的商品
        newCarts500.push(newCarts[i])
      }
    }
    for (let i = 0; i < newCarts500.length; i++){   //500ml中所有1瓶装的数量
      if (newCarts500[i].GoodsId == "10001" || newCarts500[i].GoodsId == "10003" || newCarts500[i].GoodsId == "10005"){
        arrping5001.push(parseInt(newCarts500[i].count))
        numpingHe500l = arrping5001.reduce((x, y) => { return x + y; });
      }
    }
    for (let i = 0; i < newCarts500.length; i++) {   //500ml中所有两瓶装的数量
      if (newCarts500[i].GoodsId == "10007" || newCarts500[i].GoodsId == "10009" || newCarts500[i].GoodsId == "10011") {
        arrping5002.push(parseInt(newCarts500[i].count))
        numpingHe5002 = arrping5002.reduce((x, y) => { return x + y; })*2;
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
        numpingHe10002 = arrping10002.reduce((x, y) => { return x + y; })*2;
      }
    }
    for (let i = 0; i < newCarts1000.length; i++) {   //1000ml中所有四瓶装的数量
      if (newCarts1000[i].GoodsId == "10013" || newCarts1000[i].GoodsId == "10015" || newCarts1000[i].GoodsId == "10017") {
        arrping10004.push(parseInt(newCarts1000[i].count))
        numpingHe10004 = arrping10004.reduce((x, y) => { return x + y; })*4;
      }
    }
    for (let i = 0; i < newCarts1000.length; i++) {   //1000ml中所有六瓶装的数量
      if (newCarts1000[i].GoodsId == "10014" || newCarts1000[i].GoodsId == "10016" || newCarts1000[i].GoodsId == "10018") {
        arrping10006.push(parseInt(newCarts1000[i].count))
        numpingHe10006 = arrping10006.reduce((x, y) => { return x + y; })*6;
      }
    }
    zongshu500 = numpingHe500l + numpingHe5002;                                        //计算所有500ml规格的瓶数总和
    zongshu1000 = numpingHe1000l + numpingHe10002 + numpingHe10004 + numpingHe10006;   //计算所有1000ml规格的瓶数总和

    this.setData({
      numFirst: zongshu500
    })
    
    if (zongshu500==1){                                                             //判断并计算500ml总数量阶梯折扣价格
      tempTotalPrice1 = zongshu500 * yuanjia500;
    }else if(zongshu500>=2){
      tempTotalPrice1 = zongshu500 * yuanjia500*0.95;
    }

    if(zongshu1000==1){                                                             //判断计算1000ml总数量阶梯折扣价格
      tempTotalPrice2 = zongshu1000 * yuanjia1000*0.88;
    } else if (zongshu1000 == 2){
      tempTotalPrice2 = zongshu1000 * yuanjia1000*0.88;
     // console.log(tempTotalPrice2)
    } else if (zongshu1000 == 3){
      tempTotalPrice2 = zongshu1000 * yuanjia1000*0.79;
    } else if (zongshu1000 == 4){
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.79;
    } else if (zongshu1000 == 5){
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.74;
    } else if (zongshu1000 == 6){
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.74;
    } else if (zongshu1000 >= 7){
      tempTotalPrice2 = zongshu1000 * yuanjia1000 * 0.7;
    }
    
    tempTotalPrice_a = Math.round(tempTotalPrice1 / 100) + Math.round(tempTotalPrice2 / 100)        //计算算有购物车商品总价
    this.setData({  
      carts: carts,
      totalPrice:tempTotalPrice_a
    });
  },
  goOrders(){
    let carts = this.data.carts; 
    let total = 0;
    let len = carts.length;
    for (let i = 0; i < len;i++) {
      var oldCount = this.data.tempcarts.get(carts[i].GoodsId);
      var count = carts[i].count - oldCount;
      if (oldCount != carts[i].count){
        wx.request({
          url: app.baseUrl + '/modicartcount',
          data: {
            openid: app.openId,
            goodsid: carts[i].GoodsId,
            count: count,
            sign: utilMd5.hexMD5('modicartcount?openid' + app.openId + 'goodsid' + carts[i].GoodsId + 'count' + count + app.solt)
        },
        success: res=>{
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
        }
        }) 
      }
      if(i == (len-1)){
          wx.navigateTo({
           url: '../orders/orders',
          })
      }
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  Go_go: function () {
    wx.switchTab({
      url: '/page/component/category/category',
    })
  }
})

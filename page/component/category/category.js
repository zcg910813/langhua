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
      products1:[],
      products2: [],
      products3: [],//产品列表
      curIndex: 0,
      curIndex_a: 0,
      isScroll: false,
      imgUrls: [],// banner背景图片
      indicatorDots: false,
      autoplay: false,
      interval: 3000,
      duration: 800,
      showMask:false,//授权层
      showSQModal: false,//授权层
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      display: '',
      _flag:true,
      goods: {},//商品对象
      productId: '',
      goodsMoney: 0,
      totalNum: 0,
      hasCarts: false,
      show: false,
      scaleCart: false,
      id : '',
      start_time:'',
      end_time:'',
      chaipin_title:'',
      goodssmall:[],
      goodssmallgropId:0,
      goodsid:0,
      category_n:[],
      totalPrice:0,
      mianfei:false,
      Code:''
    },
    hideview: function () {
      this.setData({
        display: "none"
      })
    },
    /*详情*/
    _imgid_a: function (e) {
      wx.navigateTo({
        url: '../particulars/particulars?id=1'
      })
    },
    _imgid_b: function (e) {
      wx.navigateTo({
        url: '../particulars/particulars?id=2'
      })
    },
    _imgid_c: function (e) {
      wx.navigateTo({
        url: '../particulars/particulars?id=3'
      })
    },
    /** 首单弹窗*/
    util: function (currentStatu) {
      /* 动画部分 */
      // 第1步：创建动画实例 
      var animation = wx.createAnimation({
        duration: 200, //动画时长 
        timingFunction: "linear", //线性 
        delay: 0 //0则不延迟 
      });

      // 第2步：这个动画实例赋给当前的动画实例 
      this.animation = animation;

      // 第3步：执行第一组动画 
      animation.opacity(0).rotateX(-100).step();

      // 第4步：导出动画对象赋给数据对象储存 
      this.setData({
        animationData: animation.export()
      })
      // 第5步：设置定时器到指定时候后，执行第二组动画 
      setTimeout(function () {
        // 执行第二组动画 
        animation.opacity(1).rotateX(0).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
        this.setData({
          animationData: animation
        })

        //关闭 
        if (currentStatu == "close") {
          this.setData(
            {
              showModalStatus: false
            }
          );
        }
      }.bind(this), 200)
      // 显示 
      if (currentStatu == "open") {
        this.setData(
          {
            showModalStatus: true
          }
        );
      }
    },

    addShop(e) { //加入购物车按钮功能
      var self = this;
      self.setData({
        mianfei: false
      })
      const goodssmall_sd = self.data.goodssmall;
      var currentStatu = e.currentTarget.dataset.statu;
      self.util(currentStatu);
      wx.request({
        url: app.baseUrl + '/addcart',
        data: {
          openid: app.openId,
          goodsid: 10001,
          count: 1,
          sign: utilMd5.hexMD5('addcart?openid' + app.openId + 'goodsid' + 10001 + 'count' + 1 + app.solt)
        },
        success: res => {
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
          wx.showToast({
            title: '',
            icon: 'success',
            duration: 2000
          })
        }
      });
      wx.switchTab({
        url: '/page/component/cart/cart',
      })
      self.setData({
        show: true
      })
      setTimeout(function () {
        self.setData({
          show: false,
          scaleCart: true
        })
        setTimeout(function () {
          self.setData({
            scaleCart: false,
            hasCarts: true,
            totalNum: num + total
          })
        }, 200)
      }, 300),
        wx.request({
          url: app.baseUrl + '/cart',
          data: {
            openid: app.openId,
            sign: utilMd5.hexMD5('cart?openid' + app.openId + app.solt)
          },
          success: function (res) {
          }
        });
    },
    /*首单bg取消*/
    close: function () {
      this.setData({
        mianfei: false
      })
    },

    onReady(){
        
        // this.setCartNum();
    },
    onHide(){
      this.setData({ _flag: true })
    },
    b: function () {
      this.setData({
         _flag: true,
         totalPrice: 0 
         })
    },
    /*详情*/ 
    _imgid:function(e){
      wx.navigateTo({
        url: '../details/details?id=' + this.data.id
      })
    },
    goDetails: function (e) {             //获取商品套餐列表的方法
      var self = this;
      var goodsid = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index;
      self.setData({
        goodsid: goodsid,
      })     
      self.setData({
        _flag:false,
        // taocanTitle: e.currentTarget
      });
      wx.request({            //请求商品套餐列表接口
        url: app.baseUrl + '/goodssmall',
        data: {
          GoodsId: goodsid,
          sign: utilMd5.hexMD5('goodssmall?GoodsId' + goodsid+ app.solt)
        },
        success(res) {
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
          var hasList = false;
          var goodssmall = res.data;
          if (goodssmall.length > 0) {
            hasList = true;
          }
          for (var i in goodssmall) {
            goodssmall[i].Price = goodssmall[i].Price/100;
            goodssmall[i].OldPrice =goodssmall[i].OldPrice/100;
          }
          self.setData({
            hasList: hasList,
            goodssmall: goodssmall
          })
          self.getOnePrice();
        }
      });
      
      var id = e.currentTarget.dataset.id;
      this.setData({id:id})
    }, 
    switchTab(e){
      const self = this;
      setTimeout(function(){
        self.setData({
          toView: e.target.dataset.id,
          curIndex: e.target.dataset.index
        })
      },0)
      setTimeout(function () {
        self.setData({
          isScroll: false
        })
      },1)
    },
    onLoad(options) {
      this.getInfo();
      var self = this;
      wx.request({
        url: app.baseUrl +'/global',
        data:{
          sign: utilMd5.hexMD5('global?' + app.solt)
        },
        success:function(res){
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
          
          self.setData({
            imgUrls: [res.data.data.banner_1, res.data.data.banner_2,res.data.data.banner_3,res.data.data.banner_4]
          });
          app.jifen_end = (res.data.data.jifen_end)*1000;
          app.psMoney = app.fen2Yuan(res.data.data.peisong);
          app.jifen = res.data.data.jifen
        }
      });
      wx.request({//获取黄酒
        url: app.baseUrl + '/goods',
        data: {
          category: 1,
          code: self.data.Code,
          sign: utilMd5.hexMD5('goods?category1' + 'code' + self.data.Code + app.solt)
        },
        success(res) {
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
          let products1 = res.data.data
          self.setData({
            products1: res.data.data,
          })
          self.setMoney();
        }
      });
      wx.request({//获取白酒
        url: app.baseUrl + '/goods',
        data: {
          category: 2,
          sign: utilMd5.hexMD5('goods?category2' + app.solt)
        },
        success(res) {
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
          self.setData({
            products2: res.data.data,
          })
          self.setMoney2();

        }
      });
      wx.request({//获取黑酒
        url: app.baseUrl + '/goods',
        data: {
          category: 3,
          sign: utilMd5.hexMD5('goods?category3' + app.solt)
        },
        success(res) {
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
          self.setData({
            // products1: res.data[1],
            // products2: res.data[2],
            products3: res.data.data,
          })

          // self.setData({
          //   // activeds: activeds,
          //   GoodsImageUrls: self.data.products[0].GoodsImageUrl
          // })
          // self.setData({ id: res.data.data[0].GoodsId })
          self.setMoney3();
        }
      });
    },
    
    setMoney:function(){
      var tempProducts = this.data.products1;
      for (let i = 0; i < tempProducts.length; i++){
        tempProducts[i].Price = tempProducts[i].Price/100;
      }
      this.setData({
        products1: tempProducts
      })
    },
    setMoney2: function () {
      var tempProducts = this.data.products2;
      for (let i = 0; i < tempProducts.length; i++) {
        tempProducts[i].Price = tempProducts[i].Price / 100;
      }
      this.setData({
        products2: tempProducts
      })
    },
    setMoney3: function () {
      var tempProducts = this.data.products3;
      for (let i = 0; i < tempProducts.length; i++) {
        tempProducts[i].Price = tempProducts[i].Price / 100;
      }
      this.setData({
        products3: tempProducts
      })
    },
    getInfo: function () {
      var app = getApp();
      var that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: ures => {
                app.nickname = ures.userInfo.nickName;
                app.avatarUrl = ures.userInfo.avatarUrl;
                //app.login(res.code);
                app.hasLogin = true;
                wx.request({
                  url: app.baseUrl + '/login',
                  data: {
                    code: res.code,
                    nick: encodeURIComponent(ures.userInfo.nickName),
                    avatarUrl: ures.userInfo.avatarUrl,
                    sign: utilMd5.hexMD5('login?code' + res.code + 'nick' + encodeURIComponent(ures.userInfo.nickName) + 'avatarUrl'+ ures.userInfo.avatarUrl+app.solt)
                  },
                  success: res => {
                    app.isworking = res.data.isworking;
                    app.openId = res.data.data.openid;
                    app.jifen = res.data.data.jifen;
                    app.isFirstOrder = res.data.data.isfirstbuy;
                    app.nickname = ures.userInfo.nickName;
                    app.avatarUrl = ures.userInfo.avatarUrl;
                    /*首单弹窗*/
                    if (app.isFirstOrder == 1) {
                      that.setData({
                        mianfei: false
                      });
                      that.util();
                    } else if (app.isFirstOrder == 0) {
                      that.setData({
                        mianfei: true
                      })
                    }
                  }
                });
                that.setData({
                  showMask: false,//授权层
                  showSQModal: false,//授权层
                });
              },
              fail: ures => {
                that.validLogin(res.code);
              }
            });
            //设置openId
          }else{
          that.getInfo();
        }
        }
      })
    },
    validLogin: function (code) {
      var app = getApp();
      this.getInfo();
      this.setData({
        showSQModal:true,
        showMask:true
      });
    },
    addCount(e) {                        //购物车 “+” 按钮对应方法
      const index = e.currentTarget.dataset.index;
      let goodssmall = this.data.goodssmall;
      let num = parseInt(goodssmall[index].num);
      var selected = goodssmall[index].selected;
      
      num = num + 1 ;
      goodssmall[index].num = num;
      if (num> 0) {
        goodssmall[index].selected = !true;
      }
      this.setData({
        goodssmall: goodssmall
      });
      this.getTotalPrice();
    },
    subCount(e) {                       //购物车 “-” 按钮对应方法
      const index = e.currentTarget.dataset.index;
      let goodssmall = this.data.goodssmall;
      const selected = goodssmall[index].selected;
      let num = parseInt(goodssmall[index].num);
      if (num >= 1) {
        num--;
      }
      goodssmall[index].num = num;
      if (goodssmall[index].num<=0){
        goodssmall[index].selected = true;
      }
      this.setData({
        goodssmall: goodssmall
      });
      this.getTotalPrice();
    },
    addToCart() {                                           //加入购物车按钮功能
      const self = this;
      const goodssmall =self.data.goodssmall;
      let newGoodssmall =[];
      let cartTishi = 0;
      let total = this.data.totalNum;
      for (let i = 0; i < goodssmall.length; i++) {         // 循环列表得到每个数据
        if (!goodssmall[i].selected) {
          newGoodssmall.push(goodssmall[i]);
          wx.request({                                      //请求添加购物车接口
            url: app.baseUrl + '/addcart',
            data: {
              openid: app.openId,
              goodsid: goodssmall[i].GoodsId,
              count: goodssmall[i].num,
              sign: utilMd5.hexMD5('addcart?openid' + app.openId + 'goodsid' + goodssmall[i].GoodsId + 'count' + goodssmall[i].num + app.solt)
            },
            success: res => {                      //判断购物车消息提醒
              if (res.data.error != 0) {
                app.validError(res.data.error);
              }
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000
              })
            }
          });              
        }
      }
      cartTishi = newGoodssmall.length;
      app.data.cartNum = cartTishi + app.data.cartNum
      let text = cartTishi
      wx.setTabBarBadge({
        index:1,
        text: app.data.cartNum.toString()
      })
      self.setData({
        _flag: true,
      });
      self.setData({
        show: true
      })
      setTimeout(function () {
        self.setData({
          show: false,
          scaleCart: true
        })
        setTimeout(function () {
          self.setData({
            scaleCart: false,
            hasCarts: true,
            totalNum: total
          })
        }, 200)
      }, 300),
      wx.request({
        url: app.baseUrl + '/cart',
        data: {
          openid: app.openId,
          sign: utilMd5.hexMD5('cart?openid' + app.openId + app.solt)
        },
        success: function (res) {
          // if (res.data.error != 0) {
          //   app.validError(res.data.error);
          // }
          // var hasList = false;
          // var productsList = res.data.data;
          // if (productsList.length > 0) {
          //   hasList = true;
          // }
          // for (var i in productsList) {
          //   productsList[i].selected = true;
          //   self.data.tempcarts.set(productsList[i].GoodsId, productsList[i].count);
          //   productsList[i].nPrice = app.fen2Yuan(productsList[i].Price);
          // }
          // let gouwuHe = [];
          // res.data.data.map((item, index) => {
          //   activeds.push(false)
          // })
          self.setData({
            // hasList: hasList,
            // carts: productsList
          });
        }
      });
      wx.request({
        url: app.baseUrl + '/goodssmall',
        data: {
          GoodsId: self.data.goodsid,
          sign: utilMd5.hexMD5('goodssmall?GoodsId' + self.data.goodsid + app.solt)
        },
        success(res) {
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
          var hasList = false;
          var goodssmall = res.data;
          if (goodssmall.length > 0) {
            hasList = true;
          }
          for (var i in goodssmall) {
            // goodssmall[i].selected = true;
            goodssmall[i].Price = app.fen2Yuan(goodssmall[i].Price);
          }
          self.setData({
            hasList: hasList,
            goodssmall: res.data,
            // productId: res.data[index].GoodsId
            // goodssmallgropId:
          })
          self.getOnePrice();
        }
      }); 
    },
    NowPay(){
      const self = this;
      // const num = this.data.num;
      const goodssmall = self.data.goodssmall;
      // const productId = self.data.goodssmall[0].GoodsId;
      // console.log(self.data.goodssmall[0].GoodsId);
      let total = this.data.totalNum;
      for (let i = 0; i < goodssmall.length; i++) {         // 循环列表得到每个数据
        if (!goodssmall[i].selected) {
          wx.request({
            url: app.baseUrl + '/addcart',
            data: {
              openid: app.openId,
              goodsid: goodssmall[i].GoodsId,
              count: goodssmall[i].num,
              sign: utilMd5.hexMD5('addcart?openid' + app.openId + 'goodsid' + goodssmall[i].GoodsId + 'count' + goodssmall[i].num + app.solt)
            },
            success: res => {
              if (res.data.error != 0) {
                app.validError(res.data.error);
              }
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000
              })
            }
          });
        }
      }
      self.setData({
        show: true
      })
      setTimeout(function () {
        self.setData({
          show: false,
          scaleCart: true
        })
        setTimeout(function () {
          self.setData({
            scaleCart: false,
            hasCarts: true,
            totalNum:  total
          })
        }, 200)
      }, 300)
      wx.request({
        url: app.baseUrl + '/goodssmall',
        data: {
          GoodsId: self.data.goodsid,
          sign: utilMd5.hexMD5('goodssmall?GoodsId' + self.data.goodsid + app.solt)
        },
        success(res) {
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
          var hasList = false;
          var goodssmall = res.data;
          if (goodssmall.length > 0) {
            hasList = true;
          }
          for (var i in goodssmall) {
            // goodssmall[i].selected = true;
            goodssmall[i].Price = app.fen2Yuan(goodssmall[i].Price);
          }
          self.setData({
            hasList: hasList,
            goodssmall: res.data,
            productId: res.data[index].GoodsId
            // goodssmallgropId:
          })
          self.getOnePrice();
        }
      });
      wx.switchTab({
        url: '/page/component/cart/cart'
      })
    },
    // selectList(e) {
    //   const index = e.currentTarget.dataset.index;
    //   let goodssmall = this.data.goodssmall;
    //   const selected = goodssmall[index].selected;
    //   goodssmall[index].selected = !selected;
    //   this.setData({
    //     goodssmall: goodssmall
    //   });
    //   this.getTotalPrice();
    // },
    selectAll(e){
      // const index = e.currentTarget.dataset.index;
      let goodssmall = this.data.goodssmall;
      const selected = goodssmall[index].selected;
      goodssmall[index].selected = !selected;
      this.setData({
        goodssmall: goodssmall
      });
    },
    getOnePrice() {
      let goodssmall = this.data.goodssmall;
      let one_price = 0;
      let one_price_a = 0;
      for (let i = 0; i < goodssmall.length; i++) {
        if (goodssmall[i].selected) {
          one_price += goodssmall[i].count * goodssmall[i].Price;
        }
      }
      this.setData({
        goodssmall: goodssmall,
        one_price: one_price_a.toFixed(2)
      });
    },
    getTotalPrice() {
      let carts = this.data.goodssmall;
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
        if (!carts[i].selected) {     //判断获取选中获取到的商品
          newCarts.push(carts[i])
          // num += carts[i].num
        }    // tempTotalPrice_a = tempTotalPrice+6
      }
      for (let i = 0; i < newCarts.length; i++) {
        if (newCarts[i].Volume == "500") {     //获取选中的商品中所有规格为500ml的商品
          newCarts500.push(newCarts[i])
        }
      }
      for (let i = 0; i < newCarts500.length; i++) {   //500ml中所有1瓶装的数量
        if (newCarts500[i].GoodsId == "10001" || newCarts500[i].GoodsId == "10003" || newCarts500[i].GoodsId == "10005") {
          arrping5001.push(parseInt(newCarts500[i].num))
          numpingHe500l = arrping5001.reduce((x, y) => { return x + y; });
        }
      }
      for (let i = 0; i < newCarts500.length; i++) {   //500ml中所有两瓶装的数量
        if (newCarts500[i].GoodsId == "10007" || newCarts500[i].GoodsId == "10009" || newCarts500[i].GoodsId == "10011") {
          arrping5002.push(parseInt(newCarts500[i].num))
          numpingHe5002 = arrping5002.reduce((x, y) => { return x + y; }) * 2;
        }
      }

      for (let i = 0; i < newCarts.length; i++) {
        if (newCarts[i].Volume == "1000") {     //获取选中的商品中所有规格为1000ml的商品
          newCarts1000.push(newCarts[i])
        }
      }
      for (let i = 0; i < newCarts1000.length; i++) {   //1000ml中所有1瓶装的数量
        if (newCarts1000[i].GoodsId == "10002" || newCarts1000[i].GoodsId == "10004" || newCarts1000[i].GoodsId == "10006") {
          arrping10001.push(parseInt(newCarts1000[i].num))
          numpingHe1000l = arrping10001.reduce((x, y) => { return x + y; });
        }
      }
      for (let i = 0; i < newCarts1000.length; i++) {   //1000ml中所有两瓶装的数量
        if (newCarts1000[i].GoodsId == "10008" || newCarts1000[i].GoodsId == "10010" || newCarts1000[i].GoodsId == "10012") {
          arrping10002.push(parseInt(newCarts1000[i].num))
          numpingHe10002 = arrping10002.reduce((x, y) => { return x + y; }) * 2;
        }
      }
      for (let i = 0; i < newCarts1000.length; i++) {   //1000ml中所有四瓶装的数量
        if (newCarts1000[i].GoodsId == "10013" || newCarts1000[i].GoodsId == "10015" || newCarts1000[i].GoodsId == "10017") {
          arrping10004.push(parseInt(newCarts1000[i].num))
          numpingHe10004 = arrping10004.reduce((x, y) => { return x + y; }) * 4;
        }
      }
      for (let i = 0; i < newCarts1000.length; i++) {   //1000ml中所有六瓶装的数量
        if (newCarts1000[i].GoodsId == "10014" || newCarts1000[i].GoodsId == "10016" || newCarts1000[i].GoodsId == "10018") {
          arrping10006.push(parseInt(newCarts1000[i].num))
          numpingHe10006 = arrping10006.reduce((x, y) => { return x + y; }) * 6;
        }
      }
      zongshu500 = numpingHe500l + numpingHe5002;                                        //计算所有500ml规格的瓶数总和
      zongshu1000 = numpingHe1000l + numpingHe10002 + numpingHe10004 + numpingHe10006;   //计算所有1000ml规格的瓶数总和


      // console.log(zongshu500);
      // tempTotalPrice1 = zongshu500*yuanjia500;
      // console.log(zongshu1000)
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


      tempTotalPrice_a = Math.round(tempTotalPrice1/100) + Math.round(tempTotalPrice2/100)
      //tempTotalPrice_a = Math.round(tempTotalPrice_a)


      // let goodssmall = this.data.goodssmall;                  // 获取购物车列表
      // // console.log(goodssmall);
      // let total = 0;
      // let num = 0;
      // for (let i = 0; i < goodssmall.length; i++) {         // 循环列表得到每个数据
      //   if (!goodssmall[i].selected) {  
      //     // console.log(goodssmall[i].Price);               // 判断选中才会计算价格
      //     total += goodssmall[i].num * goodssmall[i].Price;     // 所有价格加起来
      //     num += goodssmall[i].num
      //     console.log(num);
      //   }
      // }
      this.setData({                                // 最后赋值到data中渲染到页面
        goodssmall: carts,
        totalPrice: tempTotalPrice_a 
      });
    },
    bindTap_a(e) {
      const index = parseInt(e.currentTarget.dataset.index);
      this.setData({
        curIndex_a: index
      })
    },
    
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
    }
})
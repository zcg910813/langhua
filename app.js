var utilMd5 = require('md5.js');
App({
  data:{
    cartNum:0,
    numFirst:1,
  },
  baseUrl: 'https://mp.wavehops.com/unkown',
  openId:'',
  nickname:'',
  avatarUrl:'',
  hasLogin: false,
  solt:'f4c5466042f02bf0da840f5abc06744a',
  jifen:0,
  jifen_end: '',
  psMoney:6,
  isFirstOrder:0,
  orderBuy: function (timeStamp, nonceStr, prepayId, signType, paySign,redpackid){
    var self = this;
    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: prepayId,
      signType: signType,
      paySign: paySign,
      success: function (res) {
        self.isFirstOrder=1;
        // var app = getApp();
        // app.setFirstOrder();
        wx.redirectTo({
          url: '/page/component/payOver/payOver?redpackid=' + redpackid,
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '支付提示',
          content: '您放弃了支付，请前往订单页面付款～～～',
          showCancel: false,
          success: res => {
            wx.switchTab({
              url: '/page/component/user/user'
            })
          }
        })
      }
    })
  },

  login: function (code){
    const _this = this;
    let nickname = this.nickname;
    let avatarUrl = this.avatarUrl
    console.log(nickname)
    wx.request({
      url: this.baseUrl + '/login',
      data: {
        code: code,
        sign: utilMd5.hexMD5('login?code' + code + this.solt)
      },
      success: res => {
        _this.openId = res.data.data.openid;
        _this.jifen = res.data.data.jifen;
        _this.isFirstOrder = res.data.data.isfirstbuy;
        
      // fail:res=>{
      }
      
    }); 
  },
  validLogin:function(code){
    var app = getApp();
      wx.showModal({
        title: '用户未授权',
        content: '未授权用户，部分功能不能使用，请按确定并在授权管理中选中“用户信息”，然后点确定，最后再重新进入小程序即可使用。',
        showCancel: false,
        success: sres => {
          if (sres.confirm) {
            wx.openSetting({
              success: function success(uures) {
                wx.getUserInfo({
                  success: ures => {
                    wx.getUserInfo({
                      withCredentials:true,
                      lang:"zh_CN",
                      success(res){
                      }
                    })
                    app.login(code);
                    app.nickname = ures.userInfo.nickName;
                    app.avatarUrl = ures.userInfo.avatarUrl;
                    app.hasLogin = true;
                  }
                });
              }
            });
          }
        }
      })
  },
  getInfo:function(){
    wx.login({
      success: function (res) {
        if (res.code) {
          var app = getApp();
          wx.getUserInfo({
            success: ures => {
              
              app.login(res.code);
              app.nickname = ures.userInfo.nickName;
              app.avatarUrl = ures.userInfo.avatarUrl;
              app.hasLogin = true;
            },
            fail: ures=>{
              app.validLogin(res.code);
            }
          });
        }
      },fail:res=>{
      }
    })
  },
  validError:function(errorCode){
    if(errorCode == 1) {
      this.alertMessage('校验和不正确');
    } else if (errorCode == 2) {
      this.alertMessage('未知的消息类型');
    } else if (errorCode == 3) {
      this.alertMessage('参数不足');
    } else if (errorCode == 4) {
      wx.showModal({
        title: '温馨提示',
        content: '您有没有支付的订单，请先支付',
        text: 'center',
        showCancel: false,
        complete() {
          wx.switchTab({
            url: '/page/component/user/user?pay=pay'
          })
        }
      })
    } else if (errorCode == 5) {
      this.alertMessage('收货地址解析错误');
    } else if (errorCode == 6) {
      this.alertMessage('收货地址不够精确');
    } else if (errorCode == 7) {
      this.alertMessage('要删除的收货地址id不存在');
    } else if (errorCode == 8) {
      this.alertMessage('获取OpenId失败');
    } else if (errorCode == 9) {
      this.alertMessage('购物车中没有任何数据');
    } else if (errorCode == 10) {
      this.alertMessage('指定的商品还没有添加到购物车中');
    } else if (errorCode == 11) {
      this.alertMessage('减少购物车中的商品数量时，已有数量不足');
    } else if (errorCode == 13) {
      this.alertMessage('指定的商品不存在');
    } else if (errorCode == 14) {
      this.alertMessage('创建订单时 提交的地址ID 无效');
    } else if (errorCode == 15) {
      this.alertMessage('创建订单时 数据库执行出错');
    } else if (errorCode == 16) {
      this.alertMessage('删除订单时 指定的订单不存在');
    } else if (errorCode == 17) {
      this.alertMessage('用户发出抽奖请求时，抽奖活动已经结束');
    } else if (errorCode == 18) {
      this.alertMessage('用户发出抽奖请求时，用户还没有购买过商品，不能抽奖');
    } else if (errorCode == 19) {
      this.alertMessage('用户发出抽奖请求时, 抽奖机会已经过期无效');
    } else if (errorCode == 20) {
      this.alertMessage('微信返回创建订单失败');
    } else if (errorCode == 21) {
      this.alertMessage('您添加的地址 没有运力覆盖');
    } else if (errorCode == 22) {
      this.alertMessage('查询订单信息失败');
    } else if (errorCode == 23) {
      this.alertMessage('订单已经超过5分钟 不能再支付');
    } else if (errorCode == 24) {
      this.alertMessage('删除的订单不能支付');
    } else if (errorCode == 25) {
      this.alertMessage('该订单无需重新支付');
    } else if (errorCode == 26) {
      this.alertMessage('拆红包时，红包不存在');
    } else if (errorCode == 27) {
      this.alertMessage('用户尝试打开 已经 打开过的红包');
    } else if (errorCode == 28) {
      this.alertMessage('拆红包时，修改用户积分失败');
    } else if (errorCode == 29){
      this.alertMessage('打开红包失败');
    } else if (errorCode == 30){
      this.alertMessage('无效的抵扣券');
    } else if (errorCode == 31) {
      this.alertMessage('订单未付款或订单异常');
    } else if (errorCode == 32) {
      this.alertMessage('订单已经运行不允许退款');
    } else if (errorCode == 33) {
      this.alertMessage('配送订单撤销失败');
    } else if (errorCode == 34) {
      this.alertMessage('退款请联系商家');
    } else{
      this.alertMessage(errorCode);
    }
  },
  alertMessage(message){
    wx.showModal({
      title: '提示',
      content: message,
      showCancel:false
    })
  },
  fen2Yuan:function (num) {
    return (num / 100).toFixed(2);
  },
  formatDate: function (timeStamp){
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d + ' 00:00:00';    
  }
  // setFirstOrder:function(){
  //   var app = getApp();
  //   app.data.isFirstOrder = 0;
  // },

})

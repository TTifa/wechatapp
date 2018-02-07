//app.js
const API = require('/utils/apiclient.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 设备信息
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.screenWidth = res.windowWidth;
        that.screenHeight = res.windowHeight;
        that.pixelRatio = res.pixelRatio;
      }
    });

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        //get openid
        API.Post('/api/wxopen/openid', {
          id: that.globalData.waId,
          jsCode: code
        }, (e) => {
          if (e.status == 1) {
            that.globalData.openid = e.data;
            if (that.globalData.userInfo)
              that.signIn(1);
          }
        })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              that.signIn(2);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  signIn: function (i) {
    console.log(i);
    if (!this.globalData.userInfo || !this.globalData.openid)
      return;

    //如果已经注册获取token
    var param = this.globalData.userInfo;
    param.openid = this.globalData.openid;
    param.WAId = this.globalData.waId;
    var that = this;
    API.Post('/api/wxopen/signin', param, (e) => {
      if (e.status == 1) {
        var userinfo = that.globalData.userInfo;
        userinfo.userid = e.data.Uid;
        userinfo.token = e.data.Token;
        //that.globalData.userInfo = param;
        console.log(that.globalData.userInfo);
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: '',
    waId: 2
  }
})
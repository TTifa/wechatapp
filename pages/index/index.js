const API = require('../../utils/apiclient.js')
Page({
  data: {
    banner: [],
    goods: [],
    bannerHeight: Math.ceil(290.0 / 750.0 * getApp().screenWidth)
  },
  onLoad: function (options) {
    this.loadBanner();
    this.loadMainGoods();
    this.getInviteCode(options);
  },
  getInviteCode: function (options) {
    if (options.uid != undefined) {
      wx.showToast({
        title: '来自用户:' + options.uid + '的分享',
        icon: 'success',
        duration: 2000
      })
    }
  },
  loadBanner: function () {
    var that = this;
    API.Get('/api/ads/banner', { match: `index:0` }, (e) => {
      if (e.status != 1) {
        console.log(e.msg);
        return;
      }
      var array = e.data;
      that.setData({
        banner: array
      });
    })
  },
  loadMainGoods: function () {
    var that = this;
    //获取热卖产品
    API.Post('/api/goods', {
      pageIndex: 1,
      pageSize: 4,
      hot: true
    }, (res) => {
      if (res.status == 1) {
        that.setData({
          goods: res.data
        })
      }
    })

  },
  showDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var goodsId = this.data.goods[index].Id;
    wx.navigateTo({
      url: "../goods/detail/detail?id=" + goodsId
    });
  },
  showCategories: function () {
    // wx.navigateTo({
    // 	url: "../category/category"
    // });
    wx.switchTab({
      url: "../category/category"
    });
  },
  showOrders: function () {
    wx.navigateTo({
      url: "../order/list/list?status=0"
    });
  },
  onShareAppMessage: function () {
    return {
      title: 'Farwind开源电商',
      desc: 'develop by farwind',
      path: '/pages/index/index?uid=4719784'
    }
  },
  showGoods: function (e) {
    var url = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: url
    });
  }
})
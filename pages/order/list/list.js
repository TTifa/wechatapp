const API = require('../../../utils/apiclient.js')
Page({
	data: {
		orders: [],
		orderStatus: -1
	},
	onLoad: function (options) {
		// 订单状态，已下单为0，已付为1，已发货为2，已收货为3
		var status = parseInt(options.status);
		console.log(status);
		this.setData({
			orderStatus: status
		});
	},
	onShow: function () {
		this.reloadData();
	},
	reloadData: function () {
		var that = this;
		API.Post('/api/order/list', {
			userId: 1,
			pageIndex: 1,
			pageSize: 5,
			status: that.data.orderStatus
		}, (res) => {
			if (res.status == 1) {
				that.setData({
					orders: res.data
				})
			}
		})
	},
	pay: function (e) {
		var objectId = e.currentTarget.dataset.objectId;
		var totalFee = e.currentTarget.dataset.totalFee;
		var payurl = '../payment/payment?orderId=' + objectId + '&totalFee=' + totalFee;
		wx.navigateTo({
			url: payurl
		});
	},
	receive: function (e) {
		var that = this;
		wx.showModal({
			title: '请确认',
			content: '确认要收货吗',
			success: function (res) {
				if (res.confirm) {
					var objectId = e.currentTarget.dataset.objectId;
					var order = new AV.Object.createWithoutData('Order', objectId);
					order.set('status', 3);
					order.save().then(function () {
						wx.showToast({
							'title': '确认成功'
						});
						that.reloadData();
					});

				}
			}
		})
	},
	showGoods: function (e) {
		var objectId = e.currentTarget.dataset.objectId;
		wx.navigateTo({
			url: '../../goods/detail/detail?objectId=' + objectId
		});
	},
	evaluate: function (e) {
		// 当前订单的下标
		var index = e.currentTarget.dataset.index;
		// 当前订单的第一个商品，真实情况下应该有一个订单可能有多个商品，下所有商品的列表，取其中的某个商品
		var goodsId = this.data.mappingData[index][0].objectId;
		// 将第一个商品id传给评价页，作为评价表关联使用
		wx.navigateTo({
			url: '../../member/evaluate/evaluate?objectId=' + goodsId
		});
	}
});
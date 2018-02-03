const API = require('../../../utils/apiclient.js');
const ShoppingCart = require('../../../utils/shoppingcart.js');
Page({
	data: {
		amount: 0,
		carts: [],
		addressList: [],
		addressIndex: 0
	},
	onLoad: function (options) {
		this.readCarts(options);
	},
	onShow: function () {
		this.loadAddress();
	},
	readCarts: function (options) {
		var that = this;
		// from carts
		// amount
		var amount = parseFloat(options.amount);
		this.setData({
			amount: amount
		});

		// cartIds str
		var cartIds = options.cartIndexs;
		var cartIdArray = cartIds.split(',');
		var carts = [];
		var cartsData = ShoppingCart.get(1);

		// restore carts object
		for (var i = 0; i < cartIdArray.length; i++) {
			var data = cartsData[cartIdArray[i]];
			if (data)
				carts.push(data);
		}
		that.setData({
			carts: carts
		});
	},
	confirmOrder: function () {

		wx.navigateTo({
			url: '/pages/order/payment/payment?orderId=D201802021457320001&totalFee=5898'
		});
		return;
		// submit order
		var carts = this.data.carts;
		var that = this;
		//保存订单并跳转到支付页面

		var goods = new Object;
		for (var i = 0; i < carts.length; i++) {
			goods[carts[i].goodsId] = carts[i].quantity
		}
		var address = this.data.addressList[this.data.addressIndex];
		var param = {
			userId: 1,
			items: JSON.stringify(goods),
			address: `${address.AreaText} ${address.Detail}`
		};
		API.Post('/api/order', param, (res) => {
			//删除购物车中对应商品
			if (res.status != 1) {
				console.log(res);
				return;
			}
			wx.navigateTo({
				url: '../../payment/payment?orderId=' + res.data.OrderId + '&totalFee=' + that.data.Amount
			});
		})
	},
	loadAddress: function () {
		var that = this;
		API.Get('/api/address', { userId: 1 }, (e) => {
			if (e.status != 1) {
				console.log(e);
				return;
			}
			var address = e.data;
			for (var i = 0; i < address.length; i++) {
				address[i].Address = address[i].AreaText + address[i].Detail;
				if (address[i].State == 1) {
					that.setData({
						addressIndex: i
					});
				}
			}
			that.setData({
				addressList: address
			})
		})
	},
	bindPickerChange: function (e) {
		console.log(e);
		this.setData({
			addressIndex: e.detail.value
		})
	},
	bindCreateNew: function () {
		var addressList = this.data.addressList;
		if (addressList.length == 0) {
			wx.navigateTo({
				url: '../../address/add/add'
			});
		}
	}
})
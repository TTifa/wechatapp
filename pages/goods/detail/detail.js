const API = require('../../../utils/apiclient.js')
var that
Page({
	data: {
		goods: {},
		current: 0,
		galleryHeight: getApp().screenWidth
	},
	onLoad: function (options) {
		that = this;
		var goodsId = options.id;
		this.getGoodsById(goodsId);
		this.getEvaluateByGoods(goodsId);
	},
	getGoodsById: function (goodsId) {
		API.Get('/api/goods', { id: goodsId }, (e) => {
			if (e.status == 1) {
				e.data.images = JSON.parse(e.data.images);
				e.data.detail = JSON.parse(e.data.detail);
				that.setData({
					goods: e.data
				});
			} else
				wx.showToast(e.msg);
		})
	},
	getEvaluateByGoods: function (goodsId) {
		API.Get('/api/goods/evaluate', {
			goodsId: goodsId,
			pageIndex: 1,
			pageSize: 2
		}, (e) => {
			if (e.status != 1) {
				console.log(e.msg);
				return;
			}
			var array = e.data;
			for (var i = 0; i < array.length; i++) {
				array[i].Images = array[i].Images && JSON.parse(array[i].Images);
			}
			that.setData({
				evaluateObjects: array
			})
		})
	},
	addCart: function () {
		this.insertCart(this.data.goods);
	},
	insertCart: function (goods) {
		var that = this;
		// add cart
		var user = AV.User.current();
		// search if this goods exsit or not.if did exsit then quantity ++ updated cart object;
		// if not, create cart object
		// query cart
		var query = new AV.Query('Cart');
		query.equalTo('user', user);
		query.equalTo('goods', goods);
		// if count less then zero
		query.count().then(function (count) {
			if (count <= 0) {
				// if didn't exsit, then create new one
				var cart = AV.Object('Cart');
				cart.set('user', user);
				cart.set('quantity', 1);
				cart.set('goods', goods);
				cart.save().then(function (cart) {
					that.showCartToast();
				}, function (error) {
					console.log(error);
				});
			} else {
				// if exsit, get the cart self
				query.first().then(function (cart) {
					// update quantity
					cart.increment('quantity', 1);
					// atom operation
					// cart.fetchWhenSave(true);
					that.showCartToast();
					return cart.save();
				}, function (error) {
					console.log(error);
				});
			}
		}, function (error) {

		});
	},
	showCartToast: function () {
		wx.showToast({
			title: '已加入购物车',
			icon: 'success',
			duration: 1000
		});
	},
	previewImage: function (e) {
		wx.previewImage({
			//从<image>的data-current取到current，得到String类型的url路径
			current: this.data.goods.get('images')[parseInt(e.currentTarget.dataset.current)],
			urls: this.data.goods.get('images') // 需要预览的图片http链接列表
		})
	},
	showCart: function () {
		wx.switchTab({
			url: '../../cart/cart'
		});
	}
});
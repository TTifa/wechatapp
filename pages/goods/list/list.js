const API = require('../../../utils/apiclient.js')
const ShoppingCart = require('../../../utils/shoppingcart.js')
// 使用function初始化array，相比var initSubMenuDisplay = [] 既避免的引用复制的，同时方式更灵活，将来可以是多种方式实现，个数也不定的
function initSubMenuDisplay() {
	return ['hidden', 'hidden', 'hidden'];
}

//定义初始化数据，用于运行时保存
var initSubMenuHighLight = [
	['', '', '', '', ''],
	['', ''],
	['', '', '']
];

var pageIndex = 1;
var that;
Page({
	data: {
		subMenuDisplay: initSubMenuDisplay(),
		subMenuHighLight: initSubMenuHighLight,
		goods: [],
		loadingTip: '上拉加载更多'
	},
	onLoad: function (options) {
		var categoryId = options.categoryId;
		this.getGoods(categoryId, 1);
	},
	getGoods: function (category, pageIndex) {
		var pageSize = 7;
		that = this;
		API.Post('/api/goods', {
			categoryId: category,
			pageIndex: pageIndex,
			pageSize: pageSize
		}, function (res) {
			// 关闭下拉刷新动画
			wx.stopPullDownRefresh();
			if (res.status == 1) {
				var goods = res.data;
				if (goods.length < pageSize) {
					that.setData({
						loadingTip: '没有更多内容'
					});
				}

				// 让goods结果集迭加
				var originGoods = pageIndex == 1 ? [] : that.data.goods;
				// 如果初始有值，就合并；否则就是新数据集本身
				var newGoods = originGoods.length > 0 ? originGoods.concat(goods) : goods;
				that.setData({
					goods: newGoods
				});
			} else {
				wx.showToast(res.msg);
			}
		})
	},
	tapGoods: function (e) {
		var objectId = e.currentTarget.dataset.objectId;
		wx.navigateTo({
			url: "../detail/detail?id=" + objectId
		});
	},
	tapMainMenu: function (e) {
		// 获取当前显示的一级菜单标识
		var index = parseInt(e.currentTarget.dataset.index);
		// 生成数组，全为hidden的，只对当前的进行显示
		var newSubMenuDisplay = initSubMenuDisplay();
		// 如果目前是显示则隐藏，反之亦反之。同时要隐藏其他的菜单
		if (this.data.subMenuDisplay[index] == 'hidden') {
			newSubMenuDisplay[index] = 'show';
		} else {
			newSubMenuDisplay[index] = 'hidden';
		}
		// 设置为新的数组
		this.setData({
			subMenuDisplay: newSubMenuDisplay
		});
	},
	tapSubMenu: function (e) {
		// 隐藏所有一级菜单
		this.setData({
			subMenuDisplay: initSubMenuDisplay()
		});
		// 处理二级菜单，首先获取当前显示的二级菜单标识
		var indexArray = e.currentTarget.dataset.index.split('-');
		// 初始化状态
		// var newSubMenuHighLight = initSubMenuHighLight;
		for (var i = 0; i < initSubMenuHighLight.length; i++) {
			// 如果点中的是一级菜单，则先清空状态，即非高亮模式，然后再高亮点中的二级菜单；如果不是当前菜单，而不理会。经过这样处理就能保留其他菜单的高亮状态
			if (indexArray[0] == i) {
				for (var j = 0; j < initSubMenuHighLight[i].length; j++) {
					// 实现清空
					initSubMenuHighLight[i][j] = '';
				}
				// 将当前菜单的二级菜单设置回去
			}
		}

		// 与一级菜单不同，这里不需要判断当前状态，只需要点击就给class赋予highlight即可
		initSubMenuHighLight[indexArray[0]][indexArray[1]] = 'highlight';
		// 设置为新的数组
		this.setData({
			subMenuHighLight: initSubMenuHighLight
		});
	},
	onReachBottom: function () {
		setTimeout(function () {
			// 为页数迭加1
			that.getGoods(that.category, ++pageIndex);
		}, 300);
	},
	onPullDownRefresh: function () {
		this.getGoods(this.category, 1);
	},
	addCart: function (e) {
		var index = e.currentTarget.dataset.index;
		var goods = this.data.goods[index];
		ShoppingCart.add(1,goods);
	},
	showCartToast: function () {
		wx.showToast({
			title: '已加入购物车',
			icon: 'success',
			duration: 1000
		});
	}
});
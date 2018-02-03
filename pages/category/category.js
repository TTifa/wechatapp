const API = require('../../utils/apiclient.js')
//var Toast = require('../../component/toast/toast.js')
var that
Page({
    data: {
        topCategories: [],
        subCategories: [],
        highlight: ['highlight', '', ''],
        banner: ''
    },
    onLoad: function () {
        that = this;
        this.getCategory(0, () => {
            that.getCategory(1);
            that.getBanner(1);
            that.setSideHeight();
            that.setImageWidth();
        });
    },
    setImageWidth: function () {
        var screenWidth = getApp().screenWidth;
        var imageWidth = (screenWidth - 130) / 3 - 5;
        this.setData({
            imageWidth: imageWidth
        });
    },
    setSideHeight: function () {
        this.setData({
            sidebarHeight: getApp().screenHeight
        });
    },
    tapTopCategory: function (e) {
        // 拿到objectId，作为访问子类的参数
        var pid = e.currentTarget.dataset.objectId;
        // 查询父级分类下的所有子类
        this.getCategory(pid);
        // 设定高亮状态
        var index = parseInt(e.currentTarget.dataset.index);
        this.setHighlight(index);
        // get banner local
        this.getBanner(pid);
    },
    getCategory: function (parent, cb) {
        API.Get('/api/category', { pid: parent }, (e) => {
            if (e.status != 1) {
                return;
            }
            if (parent) {
                that.setData({
                    subCategories: e.data
                })
            }
            else {
                that.setData({
                    topCategories: e.data
                })
            }
            cb && cb();
        })
    },
    setHighlight: function (index) {
        var highlight = [];
        for (var i = 0; i < this.data.topCategories; i++) {
            highlight[i] = '';
        }
        highlight[index] = 'highlight';
        this.setData({
            highlight: highlight
        });
    },
    avatarTap: function (e) {
        // 拿到objectId，作为访问子类的参数
        var objectId = e.currentTarget.dataset.objectId;
        wx.navigateTo({
            url: "../../../../goods/list/list?categoryId=" + objectId
        });
    },
    getBanner: function (parent) {
        API.Get('/api/category/banner', { id: parent }, (e) => {
            if (e.status != 1) {
                console.log(e.msg);
                //Toast.toast(this, e.msg,null,10);
                //wx.showToast(e.msg);
                return;
            }

            that.setData({
                banner: e.data
            });
        })
    },
    showGoods: function (e) {
        var link = e.currentTarget.dataset.link;
        console.log(link);
        // wx.navigateTo({
        //     url: '../goods/detail/detail?objectId=5816e3b22e958a0054a1d711'
        // });
    }
})
var API = require('../../../utils/apiclient.js')
var app = getApp()
Page({
    data: {
        showTopTips: false,
        tipText: '错误提示',
        username: '',
        password: '',
        repassword: ''
    },
    showTopTips: function (tip) {
        var that = this;
        this.setData({
            showTopTips: true,
            tipText: tip
        });
        setTimeout(function () {
            that.setData({
                showTopTips: false,
                tipText: ''
            });
        }, 3000);
    },
    setValue: function (e) {
        var that = this;
        var text = e.detail.value;
        if (text.length == 0) {
            this.showTopTips('请输入英文或数字');
            return;
        }
        var id = e.currentTarget.id;
        switch (id) {
            case 'username': {
                that.setData({
                    username: text
                })
            }
                break;
            case 'password': {
                that.setData({
                    password: text
                })
            }
                break;
            case 'repassword': {
                if (text != that.data.password)
                    that.showTopTips('2次输入密码不同');
                else
                    that.setData({
                        repassword: text
                    })
            }
                break;
        }
    },
    register: function () {
        if (this.data.password != this.data.repassword) {
            that.showTopTips('2次输入密码不同');
            return;
        }
        var userinfo = app.globalData.userInfo;
        var that = this;
        API.Post('/api/wxopen/register', {
            openid: userinfo.openid,
            username: that.data.username,
            password: that.data.password
        }, (res) => {
            if (res.status == 1) {
                wx.showToast({
                    title: '注册成功',
                    icon: 'success',
                    duration: 1000
                });

                //signin
                that.signIn((e) => {
                    userinfo.userid = e.data.UserId;
                    userinfo.token = e.data.Token;
                    wx.navigateBack();
                })
            }
        });
    },
    signIn: function (callback) {
        if (!app.globalData.userInfo || !app.globalData.openid)
            return;

        //如果已经注册获取token
        var param = app.globalData.userInfo;
        param.openid = app.globalData.openid;
        param.WAId = app.globalData.waId;
        API.Post('/api/wxopen/signin', param, (e) => {
            if (e.status == 1) {
                callback && callback(e);
            }
        })
    }
});
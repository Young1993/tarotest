<template>
  <view class="login">
    <view class="container-login">
      <view class="slogan">请允许卡普写作获取以下权限</view>
      <view class="gray font14"
        >以下信息仅用于您登录卡普写作，我们将严格保密绝不外泄，更不会对您发送垃圾信息造成骚扰</view
      >
      <view class="contract">
        <view class="contract-item">
          <view class="contract-item-head font16"
            ><radio
              :color="hasUser ? '#09BB07' : '#cccddd'"
              value="1"
              checked="true"
            />获取您的公开信息（昵称、头像等）</view
          >
          <view class="gray font14"
            >使用您的公开信息，方便您使用产品的全部功能</view
          >
        </view>

        <view class="contract-item">
          <view class="contract-item-head font16"
            ><radio
              :color="hasPhone ? '#09BB07' : '#cccddd'"
              value="2"
              checked="true"
            />授权手机号成功</view
          >
          <view class="gray font14"
            >应国家法律要求，需获取您的手机号码用于实名认证</view
          >
        </view>
      </view>
      <view class="login-btn">
        <button
          v-show="!hasUser"
          type="primary"
          @getUserInfo="handleUserInfo"
          openType="getUserInfo"
        >
          授权公开信息
        </button>
        <button
          v-show="hasUser"
          type="primary"
          @getPhoneNumber="getPhoneNumber"
          openType="getPhoneNumber"
        >
          授权公开信息
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './login.less'
import Index from '../../service/index'
// import UTILS from '../../utils'
export default {
  data () {
    return {
      money: 0,
      userinfo: {},
      userOpenid: {},
      hasPhone: false,
      hasUser: false
    }
  },
  methods: {
    async getPhoneNumber (res) {
      console.log('get phone number:', res.detail)
      if (res.detail.errMsg == 'getPhoneNumber:ok') {
        Taro.showLoading({
          title: '登录中'
        })
        const response = await Index.getPhoneNumber(Object.assign(res.detail, this.userOpenid))
        if (response.phoneNumber) {
          console.log('login success')
          this.hasPhone = true
          this.$parent.setStorage('phone', 1) // already get phone number
          Taro.hideLoading()
          Taro.navigateBack()
        }
      }
    },
    // wechat login
    async wechatLogin () {
      const response = await Taro.login()
      const openid = await Index.login(response.code)
      this.$parent.setStorage('openid', openid)
      if (openid.openid) {
        this.userOpenid = openid
        this.hasUser = true
      }
    },
    // get user info
    async handleUserInfo (res) {
      Taro.showLoading()
      console.log('get user info:', res.detail)
      if (res.detail.errMsg == 'getUserInfo:ok') {
        // console.log(response)
        this.wechatLogin()
        this.$parent.setStorage('userinfo', res.detail.userInfo)
        this.hasUser = true
      }
      Taro.hideLoading()
    }
  },
  async created () {
    // this.hasUser = true
    // 获取用户信息
    this.userinfo = await this.$parent.getLocalUserinfo()
    this.userOpenid = Taro.getStorageSync('openid')
    console.log('userinfo:', this.userinfo, this.userOpenid)
    if (this.userinfo) {
      this.hasUser = true
    }
    // 需要核对 session key 是否过期
    if (this.userOpenid) {
      Taro.checkSession({
        success: () => { console.log('session key is fine') },
        fail: () => { this.wechatLogin() }
      })
    }
  }
}
</script>

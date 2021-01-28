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
              :color="!hasUser ? '#09BB07' : '#cccddd'"
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
              :color="hasUser ? '#09BB07' : '#cccddd'"
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
          v-if="hasUser"
          type="primary"
          onGetUserInfo="handleUserInfo"
          openType="getUserInfo"
        >
          授权公开信息
        </button>
        <button
          v-else
          type="primary"
          onGetPhoneNumber="handlePhone"
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
// import Index from '../../service/index'
// import UTILS from '../../utils'
export default {
  name: 'Login',
  data () {
    return {
      money: 0,
      userinfo: {},
      hasUser: false
    }
  },
  methods: {
    handlePhone (res) {
      console.log('get phone number:', res.detail)
    },
    handleUserInfo (res) {
      console.log('get user info:', res.detail)
    }
  },
  async created () {
    this.userinfo = await this.$parent.getLocalUserinfo()
  }
}
</script>

<template>
  <view class="page-me">
    <view class="me-header">
      <view v-if="login">
        <open-data class="icon-me" type="userAvatarUrl" />
        <open-data
          style="
            line-height: 36px;
            font-size: 16px;
            color: #48352e;
            font-weight: 400;
            letter-spacing: 1px;
          "
          type="userNickName"
        />
        <!-- <image
          :lazyLoad="true"
          class="icon-me"
          :src="userinfo.headimgurl || userinfo.avatarUrl"
        ></image> -->
        <!-- <view
          style="
            font-size: 16px;
            color: #48352e;
            font-weight: 400;
            letter-spacing: 1px;
          "
          >{{ userinfo.nickName }}</view
        > -->
      </view>

      <view class="vip-container">
        <navigator
          url="/pages/vip/vip"
          class="vip-block flex-wrp space-around"
          v-if="login && isVip"
        >
          <text>VIP会员 有效期至{{ vipTime }}</text>
          <text class="renew"> 立即续费 </text>
        </navigator>
        <navigator url="/pages/vip/vip" class="vip-block" v-else>
          立即成为 卡普VIP会员，作文免费批改
        </navigator>
      </view>
    </view>
    <view v-if="login" class="navigate">
      <view class="navigate-block">
        <navigator class="navigate-item" url="/pages/me/essay_record">
          <view class="flex-wrp align-center">
            <image
              class="me-icon"
              lazyLoad="true"
              src="../../assets/practice.png"
            />
            <text class="navigate-title"> 写作批改记录</text>
          </view>
          <view class="arrow-right"></view>
        </navigator>
      </view>
      <view class="navigate-block" style="border-bottom: solid 2rpx #dedede">
        <button class="nav-share navigate-item" :plain="true" openType="share">
          <view class="flex-wrp align-center">
            <image
              class="me-icon"
              lazyLoad="true"
              src="../../assets/share_me.png"
            />
            <text class="navigate-title"> 分享给好友</text>
          </view>
          <view class="arrow-right"></view>
        </button>
      </view>
      <view class="navigate-block">
        <navigator class="navigate-item" url="/pages/me/feedback">
          <view class="flex-wrp align-center">
            <image
              class="me-icon"
              lazyLoad="true"
              src="../../assets/advice.png"
            />
            <text class="navigate-title">反馈建议</text>
          </view>
          <view class="arrow-right"></view>
        </navigator>
      </view>
      <view class="navigate-block">
        <navigator class="navigate-item" url="/pages/me/cooperate">
          <view class="flex-wrp align-center">
            <image
              class="me-icon"
              lazyLoad="true"
              src="../../assets/cooperate.png"
            />
            <text class="navigate-title">商务合作</text>
          </view>
          <view class="arrow-right"></view>
        </navigator>
      </view>
      <!-- <navigator id="download" url="/pages/buy/index" v-if="!payrecord.length">
        下载雅思高分文章
      </navigator> -->
    </view>
  </view>
</template>

<script>
import './me.less'
// import Index from '../../service/index'
import Taro from '@tarojs/taro'
// import UTILS from '../../utils'

export default {
  data () {
    return {
      payrecord: [],
      login: true,
      userOpenid: {},
      userinfo: {},
      vipTime: '',
      isVip: false
    }
  },
  methods: {
    handleBack: function (e) {
      Taro.navigateTo({
        url: '/pages/index/index'
      })
    }
  },
  async onShow () {
    // const userinfo = await this.$parent.getLocalUserinfo()
    // if (userinfo) {
    //   this.userinfo = userinfo
    //   this.login = true
    // } else {
    // Taro.navigateTo({ url: '/pages/login/login' })
    // }
    const { vipTime, isVip } = this.$parent.judgeVipTime()
    // console.log(vipTime, isVip)
    this.vipTime = vipTime
    this.isVip = isVip
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '卡普写作，智能作文批改',
      path: '/pages/index/index'
    }
  },
  onShareTimeline () {
    return {
      title: '卡普写作，智能作文批改',
      path: '/pages/index/index'
    }
  },
  async mounted () {
    // pull vip info
    this.userOpenid = Taro.getStorageSync('openid')
    console.log('openid:', this.userOpenid)
  }
}
</script>

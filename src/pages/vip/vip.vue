<template>
  <view class="vip-container">
    <view class="container-essay">
      <view>
        <!-- 解锁部分文章 -->
        <view class="container-more">
          <view class="buy-box box-list">
            <view class="buy-item" @tap="handleBuy(99, 9)">
              <view
                ><text class="big">99元</text>
                <text class="normal"> 年套餐</text></view
              >
              <text class="tip">无限次批改</text>
              <view class="btn-max-w" plain size="mini">购买</view>
            </view>
            <view class="buy-item" @tap="handleBuy(59.9, 8)">
              <text class="big">59.9元</text>
              <text class="normal"> 半年套餐</text>
              <text class="tip">无限次批改</text>
              <view class="btn-max-w" plain size="mini">购买</view>
            </view>
            <view class="buy-item" @tap="handleBuy(9.9, 7)">
              <text class="big">9.9元</text>
              <text class="normal"> 月套餐</text>
              <text class="tip">无限次批改</text>
              <view class="btn-max-w" plain size="mini">购买</view>
            </view>
            <view class="buy-item" @tap="handleBuy(4.9, 6)">
              <text class="big">4.9元</text>
              <text class="normal"> 7天套餐</text>
              <text class="tip">无限次批改</text>
              <view class="btn-max-w" plain size="mini">购买</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import Index from '../../service/index'
import UTILS from '../../utils'
export default {
  data () {
    return {
      money: 0,
      userOpenid: {},
      vipTime: '',
      canPay: true,
      isVip: false
    }
  },
  methods: {
    handleBuy: async function (e, id) {
      if (this.canPay) {
        this.canPay = false
        let vipTime

        if (id == 9) {
          vipTime = UTILS.vipTime(this.vipTime, 3)
        } else if (id == 8) {
          vipTime = UTILS.vipTime(this.vipTime, 2)
        } else if (id == 7) {
          vipTime = UTILS.vipTime(this.vipTime, 1)
        } else {
          vipTime = UTILS.vipTime(this.vipTime, 0)
        }

        Taro.showLoading()
        console.log('vipTime:', this.vipTime, vipTime)
        let money = 1 // e * 100
        console.log('去支付：', e, id, this.userOpenid.openid, money)
        const res = await Index.wechatBuy({
          'money': money,
          'vip_time': vipTime,
          'openid': this.userOpenid.openid,
          'product_id': id, // 套餐id
          'partner_id': 0
        })

        res.msgSuceess = '支付成功'
        res.msgFail = '取消支付'
        res.vipTime = vipTime

        UTILS.wechatBuy(res)
        setTimeout(() => {
          Taro.hideLoading()
        }, 300)
        await UTILS.sleep(3)
        this.canPay = true
      }
    }
  },
  async created () {
    this.userOpenid = Taro.getStorageSync('openid')
    console.log(this.userOpenid)
  },
  mounted () {
    const { vipTime, isVip } = this.$parent.judgeVipTime()
    // console.log(vipTime, isVip)
    this.vipTime = vipTime
    this.isVip = isVip
    // this.vipTime = this.$parent.judgeVipTime()
    // console.log(this.vipTime)
  }
}
</script>

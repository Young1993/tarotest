<template>
  <view class="index">
    <view class="banner">
      <navigator url="/pages/scoring/index" openType="switchTab">
        <image
          :lazyLoad="true"
          class="banner-image"
          mode="widthFix"
          src="http://pub.zanshang520.com/172921616083462_.pic.jpg"
        >
        </image>
      </navigator>

      <!-- <navigator url="/pages/scoring/index" openType="switchTab">
        <image
          :lazyLoad="true"
          class="banner-image"
          mode="aspectFill"
          src="../../assets/banner.jpg"
        >
        </image>
        <view class="slogan">
          <view>帮你找到写作薄弱点</view>
          <view>快速帮你批改作文</view>
          <view>实现提分的梦想</view>
        </view>
      </navigator> -->
      <!-- <view class="test-action">作文测验/批改</view> -->
    </view>
    <!-- body -->
    <view class="body">
      <view class="block-label font18">
        <view style="letter-spacing: 1px">
          <view id="label-left"></view>
          作文提分技巧
        </view>
        <!-- <view id="share">
          <button class="share-btn" :plain="true" openType="share">
            <image
              :lazyLoad="true"
              class="icon-share"
              src="../../assets/share.png"
            ></image>
            分享
          </button>
        </view> -->
      </view>
      <view :key="index" v-for="(block, index) in essay2">
        <navigator
          :url="`/pages/webview/webview?url=${block.url}`"
          class="article-block"
        >
          {{ block.title }}
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
// import UTILS from '../../utils'
import './index.less'
import Index from '../../service/index'
export default {
  data () {
    return {
      selector: ['小作文', '大作文'],
      selectorChecked: '大作文',
      bandSelector: [{
        name: '全部分数',
        value: 'all'
      }, {
        name: '6分',
        value: 6.0
      }, {
        name: '6.5分',
        value: 6.5
      }, {
        name: '7分',
        value: 7.0
      }, {
        name: '7.5分',
        value: 7.5
      }, {
        name: '8分',
        value: 8
      }, {
        name: '8.5分',
        value: 8.5
      }, {
        name: '9分',
        value: 9.0
      }],
      wechat: {},
      userinfo: {},
      bandSelectorChecked: '全部分数',
      essay1: [],
      essay2: [],
      obj1: {
        index: 1,
        s: 0,
        e: 10
      },
      obj2: {
        index: 1,
        s: 0,
        e: 10
      },
      showone: false,
      band: 'all'
    }
  },
  methods: {
    readmore (t) {
      console.log(t)
      this.obj2.s += this.obj2.e
      this.obj2.index += 1
      this.queryEssay2()
    },
    onChange: function (e) {
      console.log(e.detail.value)
      this.selectorChecked = this.selector[e.detail.value]
      if (e.detail.value) {
        this.queryEssay2()
        this.showone = false
      } else {
        this.queryEssay1()
        this.showone = true
      }
    },
    onBandChange: function (e) {
      console.log(e.detail.value)
      let obj = this.bandSelector[e.detail.value]
      this.bandSelectorChecked = obj.name
      this.band = obj.value
      this.essay2 = []
      this.queryEssay2()
    },
    // 点击跳转详情页
    onnavigator (e) {
      // console.log(e)
      sessionStorage.currentQuestion = this.$parent.currentQuestion = this.essay2[e].question
      sessionStorage.currentText = this.$parent.currentText = this.essay2[e].text
      sessionStorage.currentBand = this.essay2[e].band
      sessionStorage.currentType = 2
      Taro.navigateTo({
        url: `/pages/essay/detail?index=${e}&currentType=2`
      })
    },
    async queryArticle () {
      Taro.showLoading()
      const list = await Index.queryArticle({
        start: this.obj2.s,
        end: this.obj2.e
      })
      this.essay2 = this.essay2.concat(list)
      setTimeout(() => {
        Taro.hideLoading()
      }, 200)
    }
  },
  onShareAppMessage (res) {
    console.log(res)
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
  async created () {
    // this.queryEssay1()
    // this.showone = true
    // console.log(Taro.login())
  },
  async mounted () {
    this.queryArticle()
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success: (res) => {
        console.log('set shareAppMessage', res)
      }
    })
  }
}
</script>

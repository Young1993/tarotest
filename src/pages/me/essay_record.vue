<template>
  <view class="essay-record">
    <view :key="index" v-for="(block, index) in record">
      <view class="record-block">
        <view class="block-title" v-if="block.title"
          >{{ block.title.slice(0, 30) }} ...</view
        >
        <view class="block-title" v-else>您未没有写题目</view>
        <view class="block-band">{{ block.band }}分</view>
        <view class="block-time">{{ block.create_time }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import Index from '../../service/index'
import Taro from '@tarojs/taro'
import UTILS from '../../utils'

export default {
  data () {
    return {
      userOpenid: {},
      record: []
    }
  },
  methods: {
    async getPracticerecord (e) {
      Taro.showLoading()
      const res = await Index.getPracticerecord(this.userOpenid.openid)
      // this.record = res
      for (let index = 0; index < res.length; index++) {
        // console.log(res[index])
        res[index].create_time = UTILS.timestampToDateTime(res[index].create_time, 1)
        this.record = res
      }
      // console.log(res)
      Taro.hideLoading()
    }
  },
  created () {
    this.userOpenid = Taro.getStorageSync('openid')
    console.log(this.userOpenid)
    // get practice record
    this.getPracticerecord()
  }
}
</script>
<style lang="less">
.record-block {
  display: flex;
  padding: 36px;
  border-bottom: #eee solid 2px;
}
.block-title {
  width: 40%;
  text-align: left;
  color: #333;
}
.block-band {
  width: 20%;
  text-align: center;
  color: #e4837c;
  font-weight: bold;
  letter-spacing: 2px;
}
.block-time {
  width: 40%;
  text-align: center;
  color: #333;
  font-size: 32px;
  color: #666;
}
</style>

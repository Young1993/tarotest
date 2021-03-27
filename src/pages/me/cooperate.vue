<template>
  <view class="cooperate">
    <form class="form-container" @submit="formSubmit" report-submit>
      <view class="cooperate-block">
        <view class="cooperate-title">请简单描述您想合作的内容</view>
        <textarea
          name="text"
          required
          class="cooperate-text"
          placeholder-style="font-size:14px;"
          placeholder="最多50个字"
          :auto-height="true"
          maxlength="1000"
          minlength="15"
          autoFocus="true"
        />
      </view>
      <button form-type="submit" type="primary" class="btn">提交</button>
    </form>
  </view>
</template>

<script>
import Index from '../../service/index'
import Taro from '@tarojs/taro'

export default {
  data () {
    return {
      userOpenid: {}
    }
  },
  methods: {
    async formSubmit (e) {
      console.log(e)
      if (e.detail.value.text.length < 10) {
        Taro.showToast({
          title: '填写内容过少'
        })
      } else {
        Taro.showLoading({
          title: '提交中'
        })
        const res = await Index.submitCooperate({
          openid: this.userOpenid.openid,
          text: e.detail.value.text
        })
        await this.$parent.sleep(3)
        Taro.hideLoading()
        if (res) {
          Taro.navigateBack()
        }
      }
    }
  },
  created () {
    this.userOpenid = Taro.getStorageSync('openid')
    console.log(this.userOpenid)
  }
}
</script>
<style lang="less">
.cooperate-text {
  min-height: 300px;
  background-color: #fdfdfd;
  width: 100%;
}
.cooperate-title {
  line-height: 80px;
}
.cooperate-block {
  padding: 40px;
}
.btn {
  width: 80%;
}
</style>

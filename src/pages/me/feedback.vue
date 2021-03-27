<template>
  <view class="cooperate">
    <form class="form-container" @submit="formSubmit" :reportSubmit="true">
      <view class="cooperate-block">
        <textarea
          name="text"
          required
          class="cooperate-text"
          placeholder-style="font-size:14px;"
          placeholder="您的反馈和建议，是我们前行的动力!"
          :auto-height="true"
          maxlength="200"
          minlength="5"
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
      if (e.detail.value.text.length < 5) {
        Taro.showToast({
          title: '填写内容过少'
        })
      } else {
        Taro.showLoading({
          title: '提交中'
        })
        const res = await Index.submitFeedback({
          openid: this.userOpenid.openid,
          text: e.detail.value.text,
          formId: e.detail.formId
        })
        Taro.hideLoading()
        Taro.showToast({
          title: '感谢您的建议',
          duration: 2000
        })
        await this.$parent.sleep(3)
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

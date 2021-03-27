<template>
  <web-view :src="url" @message="handleMessage" />
</template>

<script>
import { getCurrentInstance } from '@tarojs/taro'
export default {
  data () {
    return {
      url: ''
    }
  },
  created () {
    console.log(getCurrentInstance().router.params)
    this.url = decodeURIComponent(getCurrentInstance().router.params.url)
  }
}
</script>
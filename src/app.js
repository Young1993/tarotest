import { createApp } from 'vue'
import store from './store'
import Taro from '@tarojs/taro'

import './app.less'

const App = createApp({
  data () {
    return {
      wechat: {},
      userinfo: {},
      essayArr: [],
      vipTime: ''
    }
  },
  methods: {
    updateLocalUserinfo (user) {
      localStorage.userinfo = JSON.stringify(user)
    },
    // 获取本地用户信息
    getLocalUserinfo () {
      return Taro.getStorageSync('userinfo')
    },
    // 存储信息到本地
    setStorage (k, v, type = 'unsync') {
      if (type == 'sync') {
        Taro.setStorageSync(k, v)
      } else {
        Taro.setStorage({
          key: k,
          data: v
        })
      }
      console.log('set key:', k, 'value:', v)
    },
    // 获取用户信息
    async getUserinfo (openid) {
      const res = await Index.getUserinfo(openid || this.wechat.openid)
      this.userinfo = res
      localStorage.setItem('userinfo', JSON.stringify(res))
      return this.userinfo
    },
    async getOpenid (code) {
      const wechat = localStorage.getItem('wechat')
      if (wechat) {
        return JSON.parse(wechat)
      } else {
        const res = await Index.getOpenid(code)
        this.wechat = res
        localStorage.setItem('wechat', JSON.stringify(res))
        return this.wechat
      }
    },
    sleep (t = 1) {
      return new Promise(resolve => setTimeout(resolve, t * 1000))
    },
    judgeVipTime () {
      let date = new Date()
      let Y = date.getFullYear()
      const mm = date.getMonth()
      let M = (mm + 1 < 10 ? '0' + (mm + 1) : mm + 1)
      const tmp_day = date.getDate()
      let D = tmp_day < 10 ? "0" + tmp_day : tmp_day
      const now = `${Y}-${M}-${D}`

      this.vipTime = Taro.getStorageSync('vipTime')
      // console.log('local viptime:', this.vipTime, now)

      if (this.vipTime.length) {
        if (now > this.vipTime) {
          return { vipTime: now, isVip: false }
        } else {
          return { vipTime: this.vipTime, isVip: true }
        }
      } else {
        return { vipTime: now, isVip: false }
        // date
      }
    }
  }
})

App.use(store)

export default App

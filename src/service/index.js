import request from './util'

export default {
  // 修正语法
  grammarCorrection: (data) => {
    return request({
      baseURL: 'https://grammar.carpjump.com',
      url: '/grammar/correction',
      method: 'POST',
      data: data
    })
  },
  // 提交文章
  submitEssay: (data) => {
    return request({
      baseURL: 'https://yezigd.com',
      url: '/ielts/scoring',
      method: 'POST',
      data: data
    })
  },
  // 获取购买记录
  getPayrecord: (openid) => {
    return request({
      url: `/user/trade?openid=${openid}`
    })
  },
  // 微信购买
  wechatBuy: (data) => {
    return request({
      url: `/miniapp/pay`,
      method: 'POST',
      data: data
    })
  },
  getPracticerecord: (openid) => {
    return request({
      url: `/miniapp/practice_record?openid=${openid}`
    })
  },
  // 提交建议
  submitFeedback: (data) => {
    return request({
      url: `/miniapp/feedback`,
      method: 'POST',
      data: data
    })
  },
  // 商务合作
  submitCooperate: (data) => {
    return request({
      url: `/miniapp/cooperate`,
      method: 'POST',
      data: data
    })
  },
  getPhoneNumber: (data) => {
    return request({
      url: `/miniapp/phone`,
      method: 'POST',
      data: data
    })
  },
  // 获取openid
  login: (code) => {
    return request({
      url: `/miniapp/login?code=${code}`
    })
  },
  updateReadCount: (data) => {
    return request({
      url: `/user/updateReadCount`,
      method: 'POST',
      data: data
    })
  },
  getUserinfo: (openid) => {
    return request({
      url: `/user/info?openid=${openid}`
    })
  },
  // 获取微信配置
  getWechatConfig: (url) => {
    return request({
      url: `/wechat/config`,
      method: 'POST',
      data: {
        url: url
      }
    })
  },
  // 获取小作文列表
  queryArticle: (req) => {
    return request({
      url: `/miniapp/article?start=${req.start}&end=${req.end}`
    })
  },
  // 获取小作文列表
  queryIeltsEssay2: (req) => {
    return request({
      url: `/query_ielts_essay_2?band=${req.band}&start=${req.start}&end=${req.end}`
    })
  }
}
import Taro from '@tarojs/taro'
function getNextWeek (t) {
  let arr = t.split('-')
  let year = arr[0] //获取当前日期的年份
  let month = parseInt(arr[1]) //获取当前日期的月份
  let day = arr[2] //获取当前日期的日
  let days = new Date(year, month, 0)
  days = days.getDate()

  let day2 = parseInt(day) + 7
  if (day2 > days) {
    day2 = day2 - days
    month = month + 1
  }

  if (month >= 13) {
    month = 1
    year = parseInt(year) + 1
  }

  if (month < 10) {
    month = '0' + month
  }

  // console.log(days)
  return year + '-' + month + '-' + day2
}
function getNextMonth (date, num) {
  let arr = date.split('-')
  let year = arr[0] //获取当前日期的年份
  let month = arr[1] //获取当前日期的月份
  let day = arr[2] //获取当前日期的日
  let days = new Date(year, month, 0)
  days = days.getDate() // 获取当前日期中的月的天数
  let year2 = year

  let month2 = parseInt(month) + num
  if (month2 >= 13) {
    year2 = parseInt(year2) + 1
    month2 = month2 - 12
  }
  let day2 = day
  let days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }
  return year2 + '-' + month2 + '-' + day2
}

function dateForm () {
  let date = new Date()
  let Y = date.getFullYear()
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  const tmp_day = date.getDate()
  let D = tmp_day < 10 ? "0" + tmp_day : tmp_day
  return `${Y}-${M}-${D}`
}

export default {
  parseUrl: (url, type = 'single') => {
    let result = {}
    let query
    if (type == 'double') {
      let double = url.split("?")[2]
      if (double) {
        let [k, v] = double.split("=")
        console.log(k, v)
        result[k] = v
      }
    }
    query = url.split("?")[1]
    if (!query) return false
    let queryArr = query.split("&")
    queryArr.forEach(function (item) {
      let value = item.split("=")[1]
      let key = item.split("=")[0]
      result[key] = value
    })
    return result
  },
  sleep: (t = 1) => {
    return new Promise(resolve => setTimeout(resolve, t * 1000))
  },
  wechatBuy: (res) => {
    Taro.requestPayment({
      timeStamp: res.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
      package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: res.paySign, // 支付签名
      success: function (resp) {
        console.log(resp)

        Taro.setStorage({
          key: 'vipTime',
          data: res.vipTime
        })

        // 支付成功后的回调函数
        Taro.showToast({
          title: res.msgSuceess,
          icon: 'success',
          duration: 3000,
          success: () => {
            Taro.navigateBack()
          }
        })
      },
      cancel: function () {
        Taro.showToast({
          title: res.msgFail,
          icon: 'fail',
          duration: 3000
        })
      }
    })
  },
  product_list: (id) => {
    const p = {
      1: {
        product_id: 1,
        title: '799元/年',
        content: '可查看所有高分(≥7分)作文'
      }, 2: {
        product_id: 2,
        title: '2.9元 5篇高分大作文 下载链接 >',
        content: '',
        url: 'https://pan.baidu.com/s/1WQL-OeRiROmRpKGUCZA9uQ'
      }, 3: {
        product_id: 3,
        title: '7.9元 20篇高分大作文 下载链接 >',
        content: '',
        url: 'https://pan.baidu.com/s/1Odv9Tq7iO7pzq31iXMkcHw'
      }, 4: {
        product_id: 4,
        title: '11.9元 30篇高分大作文 下载链接 >',
        content: '',
        url: 'https://pan.baidu.com/s/1G7AKrJgzdrL1nKlq1Jv06A'
      }, 5: {
        product_id: 5,
        title: '21.9元 60篇高分大作文 下载链接 >',
        content: '',
        url: 'https://pan.baidu.com/s/1VfeDywS0_PefZpk_cSXB9g'
      }
    }
    return p[id]
  },
  vipTime: (t, type = 0) => {
    if (type == 0) {
      // 7天套餐
      return getNextWeek(t, 1)
    } else if (type == 1) {
      // 月套餐
      return getNextMonth(t, 1)
    } else if (type == 2) {
      return getNextMonth(t, 6)
    } else {
      let date = t.split('-')
      let y = +date[0] + 1
      return `${y}-${date[1]}-${date[2]}`
    }
  },
  timestampToDateTime: (t, type = 0) => {
    let date = new Date(t)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = date.getDate()
    D = D < 10 ? '0' + D : D

    if (type = 0) {
      let h = date.getHours() < 9 ? '0' + date.getHours() + ':' : date.getHours() + ':'
      let m = date.getMinutes() + ':'
      let s = date.getSeconds() < 9 ? '0' + date.getHours() : date.getHours()
      return Y + M + D + h + m + s
    } else if (type = 1) {
      return `${Y}-${M}-${D}`
    }
  }
}
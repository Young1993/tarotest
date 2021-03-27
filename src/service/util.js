import Taro from '@tarojs/taro'
// const base = process.env.NODE_ENV !== 'development' ? 'https://scoring.yezigd.com' : 'http://127.0.0.1:5000'
const base = 'https://scoring.yezigd.com'

export default async function request (opts) {
  let _opts = Object.assign({
    baseURL: base,
    method: 'GET',
    queryString: '',
    timeout: 20000,
    mode: 'cors',
    // credentials: 'include',
    header: {
      'content-type': 'application/json; charset=UTF-8'
    },
    fail: (err) => {
      console.log('接口出错', err)
    },
    complete: (res) => {
      console.log(res)
    }
  }, opts)
  _opts.url = _opts.baseURL + _opts.url
  // console.log('http请求:', _opts)
  let res = await Taro.request(_opts)
  console.log('http返回数据', res)
  if (res.statusCode === 200) {
    console.log(res.data)
    if (res.data.status) {
      return res.data.data
    } else {
      Taro.showToast({
        title: res.data.msg,
        icon: 'success',
        duration: 3000
      })
      return false // 抢完了
    }
  } else if (res.statusCode === 400) {
    console.log('错误码400', res)
    Taro.hideLoading()
    my.alert({
      title: res.data.msg,
      buttonText: '我知道了'
    })
    return false
  } else {
    // throw new Error('error')
    Taro.hideLoading()
    Taro.showToast({
      title: '网络错误, 稍后重试',
      icon: 'fail',
      duration: 3000
    })
  }
}

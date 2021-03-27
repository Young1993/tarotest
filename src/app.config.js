export default {
  pages: [
    'pages/index/index',
    'pages/me/me',
    'pages/scoring/index',
    'pages/login/login',
    'pages/webview/webview',
    'pages/me/cooperate',
    'pages/vip/vip',
    'pages/me/essay_record',
    'pages/me/feedback'
  ],
  tabBar: {
    list: [
      {
        'iconPath': 'assets/home.png',
        'selectedIconPath': 'assets/home_active.png',
        'pagePath': 'pages/index/index',
        'text': '首页'
      }, {
        'iconPath': 'assets/write.png',
        'selectedIconPath': 'assets/write_active.png',
        'pagePath': 'pages/scoring/index',
        'text': '作文批改'
      }, {
        'iconPath': 'assets/me.png',
        'selectedIconPath': 'assets/me_active.png',
        'pagePath': 'pages/me/me',
        'text': '我'
      }
    ],
    'color': '#9a9a9a',
    'selectedColor': '#1A434B',
    'backgroundColor': '#fff'
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '卡普英语',
    navigationBarTextStyle: 'black',
    backgroundColorBottom: '#fff',
    backgroundColorTop: '#fff'
  }
}

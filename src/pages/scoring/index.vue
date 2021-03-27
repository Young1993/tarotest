<template>
  <view class="scoring">
    <view class="input-container" v-show="!showResult">
      <form class="form-container" @submit="formSubmit" @reset="formReset">
        <view class="taro-example-body">
          <input
            name="question"
            id="input"
            type="text"
            placeholder="输入作文标题（选填）"
            placeholder-style="color:#9e9e9e;letter-spacing:1px;"
            maxlength="300"
          />
        </view>
        <view class="scoring-body">
          <textarea
            name="text"
            required
            class="scoring-essay"
            placeholder-style="font-size:14px;"
            placeholder="编写或粘贴作文（最少50个字）"
            :auto-height="true"
            maxlength="3000"
            minlength="300"
          />
        </view>
        <view class="submit-btn">
          <!-- <image
            @click="handleCamera"
            src="../../assets/camera.png"
            class="camera"
          /> -->
          <button form-type="reset" plain="true" class="reset-btn">清空</button>
          <button form-type="submit" class="btn">提交批改</button>
        </view>
      </form>
    </view>
    <view class="container-result" v-show="showResult">
      <!-- <view
        @click="handleBack"
        style="padding: 5px 10px; background-color: #deccc529"
      >
        <view class="back-icon"></view>
        <text class="font18 grey-black" style="font-weight: bold"
          >返回编辑</text
        ></view
      > -->
      <view class="result-header flex-wrp space-around">
        <view
          @tap="handleSwiper"
          :class="{ 'swiper-active': isActive }"
          class="swiper font16"
          >得分</view
        >
        <view
          @tap="handleSwiper"
          :class="{ 'swiper-active': !isActive }"
          class="swiper font16"
          >作文详情</view
        >
      </view>
      <!-- 文章的评分改错 -->
      <view class="result-body essay-contianer" v-show="!isActive">
        <view v-if="question" class="essay-title font18">
          {{ question }}
        </view>
        <view class="essay-text font16">
          <view
            :key="index"
            v-for="(paragraph, index) in correct_arr"
            class="paragraph"
          >
            <view
              :key="i"
              v-for="(sentences, i) in paragraph"
              class="sentences"
            >
              <view
                :key="k"
                v-for="(block, k) in sentences"
                class="sentence_block"
              >
                <text v-if="block.text" class="text_normal">{{
                  block.text
                }}</text>
                <text
                  v-else-if="
                    block.remove.length >= 0 &&
                    block.remove != block.add.trim().slice(0, -2) &&
                    block.remove.trim().slice(0, -1) !=
                      block.add.trim().slice(0, -2)
                  "
                  class="text_remove"
                  @tap="handleTips(block.add)"
                  >{{ block.remove }}</text
                >
                <text v-else class="text_other">{{ block.add }}</text>
              </view>
            </view>
          </view>
          <view class="text-center" v-show="isLoading">批改中, 请稍后...</view>
        </view>
      </view>
      <view class="result-body result-band" v-show="isActive">
        <view class="overall-card">
          <view class="circlePage">
            <view class="wrap">
              <!-- 圆形中间的文字 -->
              <view class="circleText">
                <view class="overall text-center"
                  ><text class="font36">{{ result.band }}</text> /
                  <text class="font14">9 分</text></view
                >
              </view>
              <!-- 第一个canvas用于绘制白色圆形 第二个canvas用于绘制橙色圆形进度条 -->
              <canvas canvas-id="canvas" class="canvas progress"></canvas>
              <canvas canvas-id="canvas_p" class="canvas" />
            </view>
          </view>
          <view class="flex-wrp" style="flex-direction: column">
            <view class="overall_text grey-black">
              <text class="font14">评价：</text>
              <text class="font14" style="color: #f18f00">
                <text v-if="result.band >= 7">继续保持</text>
                <text v-else>再接再厉</text>
              </text>
            </view>
            <view class="overall_text grey-black">
              <text class="font14">类型：</text>
              <text class="font14" style="color: #f18f00">评分标准</text>
            </view>
          </view>
        </view>
        <view class="result-card">
          <!-- 写作任务回应情况 -->
          <view class="evaluate-block">
            <view class="flex-wrp align-center space-between">
              <view class="flex-wrp align-center label font18">
                <view class="icon-box-img"></view>
                写作任务回应情况</view
              >
              <view class="label-band font16" v-if="result.task_band >= 7"
                >优秀</view
              >
              <view
                class="label-band font16"
                v-else-if="result.task_band >= 5.5 && result.task_band < 7"
                >较好</view
              >
              <view
                class="label-band font16"
                v-else-if="result.task_band > 4 && result.task_band < 5.5"
                >一般</view
              >
              <view
                class="label-band font16"
                v-else-if="result.task_band > 3 && result.task_band <= 4"
                >较差</view
              >
              <view class="label-band font16" v-else-if="result.task_band == -1"
                >未填写</view
              >
              <view class="warn-label font16" v-else>急需提高</view>
            </view>
            <view>
              <text v-if="result.task_band < 2 && result.task_band > 0">{{
                task_band['1']
              }}</text>
              <text v-else-if="result.task_band < 3 && result.task_band >= 2">{{
                task_band['2']
              }}</text>
              <text v-else-if="result.task_band < 4 && result.task_band >= 3">{{
                task_band['3']
              }}</text>
              <text v-else-if="result.task_band == -1"
                >您未填写作文题目，建议填写作文题目，方便更准确评估作文得分</text
              >
              <text v-else>{{ task_band[`${result.task_band}`] }}</text>
            </view>
          </view>
          <!-- 连贯与衔接 -->
          <view class="evaluate-block">
            <view class="flex-wrp align-center space-between">
              <view class="flex-wrp align-center label font18">
                <view class="icon-box-img"></view>
                连贯与衔接</view
              >
              <view class="label-band font16" v-if="result.cohesion >= 7"
                >优秀</view
              >
              <view
                class="label-band font16"
                v-else-if="result.cohesion >= 5.5 && result.cohesion < 7"
                >较好</view
              >
              <view
                class="label-band font16"
                v-else-if="result.cohesion > 4 && result.cohesion < 5.5"
                >一般</view
              >
              <view
                class="label-band font16"
                v-else-if="result.cohesion > 3 && result.cohesion <= 4"
                >较差</view
              >
              <view class="warn-label font16" v-else>急需提高</view>
            </view>
            <view>
              <text v-if="result.cohesion < 2">{{ cohesion['1'] }}</text>
              <text v-else-if="result.cohesion < 3 && result.cohesion >= 2">{{
                cohesion['2']
              }}</text>
              <text v-else-if="result.cohesion < 4 && result.cohesion >= 3">{{
                cohesion['3']
              }}</text>
              <text v-else>{{ cohesion[`${result.cohesion}`] }}</text>
            </view>
          </view>
          <!-- 词汇丰富程度 -->
          <view class="evaluate-block">
            <view class="flex-wrp align-center space-between">
              <view class="flex-wrp align-center label font18">
                <view class="icon-box-img"></view>
                词汇丰富程度</view
              >
              <view class="label-band font16" v-if="result.lexical >= 7"
                >优秀</view
              >
              <view
                class="label-band font16"
                v-else-if="result.lexical >= 5.5 && result.lexical < 7"
                >较好</view
              >
              <view
                class="label-band font16"
                v-else-if="result.lexical > 4 && result.lexical < 5.5"
                >一般</view
              >
              <view
                class="label-band font16"
                v-else-if="result.lexical > 3 && result.lexical <= 4"
                >较差</view
              >
              <view class="warn-label font16" v-else>急需提高</view>
            </view>
            <view>
              <text v-if="result.lexical < 2">{{ lexical['1'] }}</text>
              <text v-else-if="result.lexical < 3 && result.lexical >= 2">{{
                lexical['2']
              }}</text>
              <text v-else-if="result.lexical < 4 && result.lexical >= 3">{{
                lexical['3']
              }}</text>
              <text v-else>{{ lexical[`${result.lexical}`] }}</text>
            </view>
          </view>
          <!-- 语法多样性及准确性 -->
          <view class="evaluate-block">
            <view class="flex-wrp align-center space-between">
              <view class="flex-wrp align-center label font18">
                <view class="icon-box-img"></view>
                语法多样性及准确性</view
              >
              <view class="label-band font16" v-if="result.grammatical >= 7"
                >优秀</view
              >
              <view
                class="label-band font16"
                v-else-if="result.grammatical >= 5.5 && result.grammatical < 7"
                >较好</view
              >
              <view
                class="label-band font16"
                v-else-if="result.grammatical > 4 && result.grammatical < 5.5"
                >一般</view
              >
              <view
                class="label-band font16"
                v-else-if="result.grammatical > 3 && result.grammatical <= 4"
                >较差</view
              >
              <view class="warn-label font16" v-else>急需提高</view>
            </view>
            <view>
              <text v-if="result.grammatical < 2">{{ grammatical['1'] }}</text>
              <text
                v-else-if="result.grammatical < 3 && result.grammatical >= 2"
                >{{ grammatical['2'] }}</text
              >
              <text
                v-else-if="result.grammatical < 4 && result.grammatical >= 3"
                >{{ grammatical['3'] }}</text
              >
              <text v-else>{{ grammatical[`${result.grammatical}`] }}</text>
            </view>
          </view>
        </view>
        <!-- 词汇使用 -->
        <!-- <view class="result-card words-card">
          <view class="label font18">词汇使用</view>
          <view v-if="result.errors.length">
            <view class="estimate font16"
              >拼写错误 {{ result.errors.length }} 个</view
            >
            <view
              :key="index"
              v-for="(item, index) in result.errors"
              class="estimate font16"
            >
              <view>
                <text>{{ item.error }} </text
                ><text>{{ item.correct }}</text>
              </view>
            </view>
          </view>
          <view v-else class="estimate font16">
            太好了，当前文章无拼写类错误
          </view>
        </view> -->
        <!-- 语法多样性 -->
        <view class="result-card grammar-card">
          <view class="label font18">语句统计</view>
          <view style="line-height: 32px"
            >文章共{{ evaluate.words }}字，共{{
              evaluate.paragraph
            }}个段落</view
          >
          <view v-if="result.sent_grammar.length" style="line-height: 32px">
            <text class="font16">文章使用了</text>
            <text
              :key="index"
              v-for="(item, index) in result.sent_grammar"
              class="font16"
            >
              {{ item.value }}个
              <text class="grammar_tag">{{ item.name }} </text>;
            </text>
          </view>
          <view v-else class="estimate font16">
            建议您多运用些简单句式或复杂句式，如宾语从句等来提升文章得分
          </view>
        </view>

        <!-- 重新编写 -->
        <view class="reset-block">
          <button class="btn-reset" @tap="handleReset">重新提交</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const diff = require('../../service/diff')
const grammar = ['定语从句', '主语从句', '主从复合句', '倒装句', '宾语从句', '强调句', '虚拟语气', '并列复合句', '状语从句']
import Taro from '@tarojs/taro'
import './index.less'
import Index from '../../service/index'
import { task_band, cohesion, lexical, grammatical } from './dict.json'
import utils from '../../utils'
const band_dict = [0.5, 1., 1.5, 2., 2.5, 3., 3.5, 4., 4.5, 5., 5.5, 6., 6.5, 7., 7.5, 8., 8.5, 9.]
export default {
  data () {
    return {
      freeCount: 1,
      vipTime: '',
      isVip: false,
      userOpenid: {},
      cohesion: cohesion,
      grammatical: grammatical,
      lexical: lexical,
      task_band: task_band,
      question: '',
      text: '',
      text2arr: ['empty'],
      correct_arr: [],
      config: {
        canvasSize: {
          width: 400,
          height: 400
        },
        percent: 100,
        barStyle: [{ width: 20, fillStyle: '#f0f0f0' }, { width: 20, animate: true, fillStyle: [{ position: 0, color: '#56B37F' }, { position: 1, color: '#c0e674' }] }],
        needDot: true,
        dotStyle: [{ r: 20, fillStyle: '#ffffff', shadow: 'rgba(0,0,0,.15)' }, { r: 10, fillStyle: '#56B37F' }]
      },
      percentage: 10,
      result: {
        band: 4.5,
        errors: [
        ],
        cohesion: 7.5,
        grammatical: 6,
        lexical: 3,
        task_band: -1,
        sent_grammar: [
          {
            "name": " 状语从句",
            "value": 5
          }
        ]
      },
      evaluate: {
        words: 0,
        paragraph: 0
      },
      showResult: false,
      isActive: true,
      isLoading: true
    }
  },
  methods: {
    handleTips (e) {
      console.log(e)
      Taro.showModal({
        title: '建议修改为',
        content: e,
        showCancel: false,
        confirmText: '好的'
      })
    },
    handleReset () {
      this.showResult = false
      this.isActive = true
      this.correct_arr = []
      this.text2arr = []
    },
    handleCamera () {
      Taro.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          console.log(res)
          // let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        }
      })
    },
    handleSwiper () {
      // change the swiper
      console.log(this.isActive)
      this.isActive = !this.isActive
    },
    handleBack () {
      this.showResult = false
    },
    formReset (e) {
      // console.log(e)
      this.question = ''
      this.text = ''
    },
    chineseChar2englishChar (chineseChar) {
      // 将单引号‘’都转换成'，将双引号“”都转换成"
      var str = chineseChar.replace(/\’|\‘/g, "'").replace(/\“|\”/g, "\"")

      // 将中括号【】转换成[]，将大括号｛｝转换成{}
      str = str.replace(/\）/g, ")").replace(/\（/g, "(").replace(/\【/g, "[").replace(/\】/g, "]").replace(/\｛/g, "{").replace(/\｝/g, "}")

      // 将逗号，转换成,，将：转换成:
      str = str.replace(/、/g, " ").replace(/，/g, ",").replace(/；/g, ";").replace(/：/g, ":").replace(/。/g, ".").replace(/？/g, "?")
      return str
    },
    check_sentence (s) {
      console.log(s)
      let pattern = new RegExp('[A-Za-z]|[0-9]|[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]') // [\,\?\!\.\(\)\%
      for (let item of s.trim()) {
        if (!item.trim().length) { continue }
        if (!pattern.test(item)) {
          console.log(item)
          return false
        }
      }
      return true
    },
    // 语法检测
    async grammarCorrect (article_arr) {
      for await (let article of article_arr) {
        let sentences = article.split(/\.|\!|\?/g)
        let correct_tmp = []
        this.isLoading = true
        for await (let s of sentences) {
          if (s.trim().length) {
            let res = await Index.grammarCorrection({
              sentence: s
            })
            await utils.sleep(1.1)
            console.log(`grammar correction: ${res.corrector}`)
            let output = diff.diffString(s.trim(), res.corrector.trim())
            console.log('diff:', output)
            correct_tmp.push(output)
          }
        }
        this.isLoading = false
        this.correct_arr.push(correct_tmp)
      }
    },
    async formSubmit (e) {
      console.log(e.detail)
      // 允许英文符号，不允许中文标点符号
      this.text = e.detail.value.text = this.chineseChar2englishChar(e.detail.value.text)
      this.evaluate.words = e.detail.value.text.split(' ').length

      if (this.isVip || this.freeCount) {
        if (!e.detail.value.text) {
          Taro.showToast({
            title: '请填写作文',
            icon: 'none',
            duration: 2000
          })
        } else if (this.evaluate.words < 50) {
          Taro.showToast({
            title: '您的作文太短了',
            icon: 'none',
            duration: 2000
          })
        } else if (!this.check_sentence(e.detail.value.text)) {
          Taro.showToast({
            title: '请填写英文',
            icon: 'none',
            duration: 2000
          })
        } else {
          Taro.showLoading({
            title: '分析中...',
          })
          this.question = e.detail.value.question
          // 提交文章
          const res = await Index.submitEssay(Object.assign({ openid: this.userOpenid.openid }, e.detail.value))
          // console.log('res:', res)
          // show the result
          let tmp = e.detail.value.text
          const text2arr = tmp.split(/[\n]/)
          let arr = []
          await text2arr.forEach(block => {
            if (block.length) {
              arr.push(block)
            }
          })
          this.grammarCorrect(arr)
          // set evaluate
          this.text2arr = arr
          this.evaluate.paragraph = this.text2arr.length
          let tmp_grammar = {}, array_grammar = []
          res.sent_grammar.forEach(block => {
            block.forEach(item => {
              if (grammar.includes(item)) {
                if (item in tmp_grammar) {
                  tmp_grammar[item] += 1
                } else {
                  tmp_grammar[item] = 1
                }
              }
            })
          })

          for (let block in tmp_grammar) {
            array_grammar.push({
              'name': block,
              'value': tmp_grammar[block]
            })
          }

          res.sent_grammar = array_grammar

          res.cohesion = band_dict[parseInt((res.cohesion * 8 + 1) * 2 - 0.5)]
          res.grammatical = band_dict[parseInt((res.grammatical * 8 + 1) * 2 - 0.5)]
          res.lexical = band_dict[parseInt((res.lexical * 8 + 1) * 2 - 0.5)]
          if (res.task_band != -1) {
            res.task_band = band_dict[parseInt((res.task_band * 8 + 1) * 2 - 0.5)]
          }

          this.result = res
          this.showResult = true
          this.drawCircleBg('canvas')
          this.$parent.setStorage('freeCount', 0)
          this.freeCount = 0
          setTimeout(function () {
            Taro.hideLoading()
          }, 1000)
        }
      } else {
        Taro.showModal({
          title: '温馨提示',
          content: '今日免费批改次数(1次)已用完',
          confirmText: '成为VIP',
          cancelText: '取消',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              Taro.navigateTo({ url: '/pages/vip/vip' })
            } else if (res.cancel) {
              console.log('用户点击取消')
              // Taro.navigateTo('/pages/vip/vip')
            }
          }
        })
      }
    },
    drawCirclePg (prefix) {
      //创建并返回绘图上下文context对象。
      let cxt_arc = Taro.createCanvasContext(prefix + '_p');
      let value = this.result.band / 9 * 2
      console.log(value);
      cxt_arc.setLineWidth(10);
      cxt_arc.setStrokeStyle('#ff9800');
      cxt_arc.setLineCap('round');
      cxt_arc.beginPath();
      cxt_arc.arc(75, 77, 70, -0.5 * Math.PI, Math.PI * (value - 0.5), false)
      cxt_arc.stroke()
      cxt_arc.draw()
    },
    drawCircleBg (prefix) {
      //创建并返回绘图上下文context对象。
      let cxt_arc = Taro.createCanvasContext(prefix)
      cxt_arc.setLineWidth(8) //线条的宽度
      cxt_arc.setStrokeStyle('#FFFFFF') //边框颜色
      cxt_arc.setLineCap('round')
      cxt_arc.beginPath()
      // 参数分别：圆心的x坐标；圆心的y坐标；圆半径；起始弧度，单位弧度（在3点钟方向）；终止弧度；弧度的方向是否是逆时针
      cxt_arc.arc(75, 77, 70, 0, 2 * Math.PI, false) //创建一条弧线
      cxt_arc.stroke() //对当前路径进行描边
      cxt_arc.draw()
      this.drawCirclePg(prefix)
    }
  },
  async created () {
    // console.log(Taro.canIUse('chooseImage'))
    // Taro.authorize({scope: "scope.userInfo"})
    // this.drawCircleBg('canvas')
    // console.log(task_band)

    this.userOpenid = Taro.getStorageSync('openid')
    console.log('openid:', this.userOpenid)

    // test
    // let output = diff.diffString('The progress of transport industry is inevitable and undeniable.', 'The progress of the transport industry is inevitable and undeniable .')
    // console.log('diff:', output)
    // this.correct_arr = [[output]]

    // const res = Taro.getSystemInfoSync()
    // console.log(res.model)
  },
  onShareAppMessage (res) {
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
  onShow () {
    const phone = Taro.getStorageSync('phone')
    if (!phone) {
      Taro.navigateTo({
        url: '/pages/login/login'
      })
    }
    const { vipTime, isVip } = this.$parent.judgeVipTime()
    console.log(vipTime, isVip)
    this.vipTime = vipTime
    this.isVip = isVip

    const freeCount = Taro.getStorageSync('freeCount')
    console.log('freeCount:', freeCount)
    if (freeCount && freeCount >= 0) {
      this.freeCount = +freeCount
    }
  }
}
</script>

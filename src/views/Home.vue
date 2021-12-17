<template>
  <div class="home">
    <div class="header">
      <div class="leftTitle">华东金属城废旧金属价格指数</div>
      <div class="rightTitle">
        <span>公告：</span>
        华东金属城废旧金属价格指数正式上线
      </div>
    </div>
    <div class="contentTable">
      <div class="refresh">
        <div
          class="table_left"
          v-for="(table,key,index) in tableList"
          :key="index"
        >
          <div class="indexTitle">
            <div class="metal_title">
              <img
                src="@/assets/images/icon.png"
                alt=""
              >
              <div>
                <span>{{ key === 'openPrice'?'早盘估价':'实际成交' }}</span>
                <span></span>
                <!-- <span>价格指数</span> -->
              </div>
            </div>
            <div class="time">{{table.publishDate}}</div>
          </div>
          <div class="showData">
            <article ref="tableList">
              <div class="header">
                <p>指数名称</p>
                <p>指数值</p>
                <p>涨跌值</p>
                <p>涨跌幅</p>
              </div>
              <div
                :class="'swiper'+index"
                class="swiper-container swiper-no-swiping"
              >
                <div class="swiper-wrapper">
                  <ul
                    class="swiper-slide"
                    v-for="(child,keyChild,index1) in table.data"
                    :key="'child'+index1"
                  >
                    <div class="typeShow">{{ keyChild }}</div>
                    <div
                      class="odd"
                      v-for="(son,index2) in child"
                      :key="'son'+index2"
                    >
                      <li
                        v-for="(type,index3) in son.dataList"
                        :key="'type'+index3"
                      >
                        <p>{{type.indexName.replace('价格指数','')}}</p>
                        <p>{{type.indicesValue}}</p>
                        <p :class="getRiseOrDown(type.indexRiseOrFall)">{{formatNum(type.indexRiseOrFall)}}</p>
                        <p :class="getRiseOrDown(type.indexRate)">{{formatNum(type.indexRate,'indexRate')}}</p>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
      <!-- <div class="explain">
        <div class="allIndex">
          <div class="metal_title">
            <img
              src="@/assets/images/icon.png"
              alt=""
            >
            <div>
              <span>华东金属城废旧金属</span>
              <span>价格总指数</span>
            </div>
          </div>
          <div class="tips">法定期货交易日每日08:30前发布当日早盘估价；
            11:00发布当日实际成交价格指数。</div>
          <div class="compare">
            <ul>
              <li
                v-for="(item,index) in indexNewsList"
                :key="index"
              >
                <div class="name">{{item.indexTypeName}}</div>
                <div class="price">
                  <div>
                    <p>指数值</p>
                    <p>{{ item.dataValue || '-' }}</p>
                  </div>
                  <div>
                    <p>涨跌值</p>
                    <p :class="getRiseOrDown(item.dataRiseOrFall)">{{ item.dataRiseOrFall || '-' }}</p>
                  </div>
                </div>
                <div class="time">{{item.dataDate}} {{index === 0 ? '08:30' :'11:00'}}</div>
              </li>
            </ul>
          </div>
          <div class="oldMetal">
            <div class="metal_title">
              <img
                src="@/assets/images/icon.png"
                alt=""
              >
              <div>
                <span>华东金属城废旧金属</span>
                <span>价格指数</span>
              </div>
            </div>
            <div class="oldEchartLine">

            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="bottomCharts">
      <div
        class="echart"
        v-for="(trend,index) in trendList"
        :key="index"
      >
        <div class="metal_title">
          <img
            src="@/assets/images/icon.png"
            alt=""
          >
          <div>
            <span>{{ trend }}</span>
            <span>价格指数走势图</span>
          </div>
        </div>
        <trendChart :type="trend"></trendChart>
      </div>
    </div>
    <div class="source">数据来源：华东金属城&上海钢联</div>
  </div>
</template>

<script>
import trendChart from "./trendChart.vue"
import dayjs from "dayjs"
import Swiper from "swiper"
export default {
  name: 'Home',
  components: {
    trendChart
  },
  data () {
    return {
      tableList: [],
      data: {
        openPrice: [],
        endPrice: [],
      },
      indexNewsList: [],
      trendList: [
        '废铜',
        '废铝',
        '废不锈钢',
      ],
      swiper: {
        timer1: null,
        timer2: null
      }
    }
  },
  mounted () {
    // this.getIndexNews()
    this.getMetalIndexActual()

    // 固定时间更新
    var nowTemp = new Date().getTime() //获取当前时间戳
    // 启动项目时11:00
    let startEleven = dayjs(dayjs(new Date()).format('YYYY-MM-DD') + ' 11:00').valueOf()
    // 启动项目时08:30
    let starEight = dayjs(dayjs(new Date()).format('YYYY-MM-DD') + ' 08:30').valueOf()
    let residueTempEleven = ''
    let residueTempEight = ''

    /**
     * 启动时间不到08:30
     */
    if (nowTemp < starEight) {
      residueTempEight = starEight - nowTemp
    } else {
      // 超过8点或者等于8点 
      residueTempEight = Number(starEight) + 86400000 - nowTemp
    }
    setTimeout(() => {
      this.getMetalIndexActual()
      setInterval(() => {
        this.getMetalIndexActual()
      }, 24 * 1000 * 60 * 60)
    }, residueTempEight)

    /**
     * 启动时间不到11点
     */
    if (nowTemp < startEleven) {
      residueTempEleven = startEleven - nowTemp
    } else {
      // 超过11点或者等于11点 
      residueTempEleven = Number(startEleven) + 86400000 - nowTemp
    }
    setTimeout(() => {
      this.getMetalIndexActual()
      //24小时后执行
      setInterval(() => {
        this.getMetalIndexActual()
      }, 24 * 1000 * 60 * 60);
    }, residueTempEleven)

  },
  methods: {
    /**
     * 华东金属城废旧金属价格总指数
     */
    getIndexNews () {
      this.$axios({
        url: '/metalIndex/queryTotalIndexNewestDatas'
      }).then((res) => {
        this.indexNewsList = res?.response
      }).catch((err) => {
        this.$message.warning(err.message)
      })
    },
    /**
     * 早盘估价与实际成交价价格指数
     */
    getMetalIndexActual () {
      this.swiper = {
        timer1: null,
        timer2: null
      }
      this.tableList = []
      this.$axios({
        url: '/metalIndex/query3LevelDatas'
      }).then((res) => {
        if (res?.response) {
          this.tableList = res.response

          // for (const par in res?.response) {
          //   if (res.response[par]?.data) {
          //     for (const key in res.response[par].data) {
          //       this.data[par].push({ indexName: key, row: true })
          //       res.response[par].data[key].forEach(child => {
          //         this.data[par].push(...child.dataList)
          //       })
          //     }
          //   }
          // }
        }
        this.$nextTick(() => {
          const table = this.$refs.tableList
          if (table.length > 0) {
            table.forEach((t, index) => {
              this.swiper['timer' + (index + 1)] = new Swiper('.swiper' + index, {
                loop: true, // 循环模式选项
                autoplay: {
                  delay: 10000,
                  disableOnInteraction: false,
                },
                preventInteractionOnTransition: true,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
                speed: 1000
              })
            })
          }
        })

      }).catch((err) => {
        this.$message.warning(err.message)
      })
    },
    /**
     * 判断数字正负然后返回class
     */
    getRiseOrDown (num) {
      if (!isNaN(num)) {
        const number = parseFloat(num)
        if (number < 0) {
          return 'down'
        } else if (number > 0) {
          return 'rise'
        }
      }
    },
    /**
     * 格式化数字
     */
    formatNum (num, property) {
      const number = parseFloat(num)
      let str = num
      if (number > 0) {
        str = '+' + str
      }
      if (property === 'indexRate' && number !== 0) {
        str += '%'
      }
      return str
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/home.scss';
@import '@/assets/styles/element.scss';
</style>

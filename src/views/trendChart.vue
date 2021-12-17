<template>
  <div
    :id="'trendChart'+type"
    v-loading="chartLoading"
    class="trendChart"
    style="width:100%"
  />
</template>

<script>
import * as echarts from "echarts"
import dayjs from "dayjs"
export default {
  name: 'trendChart',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      chartLoading: false,
      xData: [],
      yData: [],
      myChart: {}
    }
  },
  mounted () {
    this.myChart = echarts.init(document.querySelector('#trendChart' + this.type))
    this.getData()
  },
  methods: {
    getData () {
      // this.chartLoading = true
      let temp = {
        varietiesName: this.type,
        startDate: dayjs().subtract(1, 'month').format('YYYYMMDD'),
        endDate: dayjs(new Date()).format('YYYYMMDD'),
      }
      this.$axios({
        url: '/metalIndex/queryEndPrice3LevelDiagram',
        data: temp
      }).then((res) => {
        this.chartLoading = false
        if (!res.response) {
          this.errorHandler()
          return
        }
        this.myChart.clear()
        this.myChart.hideLoading()
        this.yData = []
        let arr = []
        res.response.forEach((item, index) => {
          if (index === 0) {
            this.xData = item.dataList.map(item => item.dataDate)
          }
          arr = []
          item.dataList.forEach((item) => {
            arr.push(item.dataValue)
          })
          this.yData.push({
            name: item.indexName,
            type: 'line',
            symbol: 'none',
            smooth: true,
            data: arr
          })
        })
        this.setOption()
      }).catch((err) => {
        this.$message.warning(err.message)
      })
    },
    setOption () {
      let option = {
        color: [
          '#1FFFF7',
          '#BA0C2F',
          '#28C445',
          '#E28C1B',
          '#B488E6'],
        legend: {
          type: 'scroll',
          top: 5,
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: 0,
          bottom: 6,
          top: 35,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.xData,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          splitLine: {
            show: false
          },
          axisLine: {
            show: true
          },
          // axisTick: {
          //   show: true
          // },
        },
        series: this.yData,
      }
      this.myChart.setOption(option, true)
    },
  },
}
</script>

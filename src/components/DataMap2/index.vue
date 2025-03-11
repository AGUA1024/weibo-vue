<template>
  <div
    class="main-map-chart"
    ref="dataMap"
    style="width: 100%; height: 100%; height:550px;"
   />
</template>
<script>
import '@/assets/js/china'
let chart = null
import echarts from "echarts/lib/echarts";

export default {
  props: {
    title: String,
    list: Array
  },
  data () {
    return {
      config: {}
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart () {
      if (null != chart && undefined != chart) {
        chart.dispose()
      }
      chart = echarts.init(this.$refs.dataMap)
      this.setOptions()
    },
    setOptions() {
      let option = {
        tooltip: {
          triggerOn: 'click',
          formatter: function (e) {
            return 0.5 == e.value ? e.name + '：有疑似病例' : e.seriesName + '<br />' + e.name + '：' + e.value;
          },
        },
        title: {
          text: this.title,
          top: 50,
          left: 'center',
          textStyle: {
            fontWeight: 'bolder',
            fontSize: 24,
            color: '#BCBCBF'
          }
        },
        visualMap: {
          min: 0,
          max: 1000,
          left: 26,
          bottom: 40,
          showLabel: !0,
          textStyle: {
            color: 'rgba(255,255,255,0.7)'
          },
          // 图例
          pieces: [
            {
              gt: 30,
              label: '> 30 景点',
              color: '#DD2C00',
            },
            {
              gte: 25,
              lte: 30,
              label: '25 - 30 景点',
              color: '#FFC107',
            },
            {
              gte: 20,
              lt: 25,
              label: '20 - 25 景点',
              color: '#FDD835',
            },
            {
              gt: 10,
              lt: 20,
              label: '10 - 20 景点',
              color: '#FFEB3B',
            },
            {
              gt: 0,
              lt: 10,
              label: '< 10 景点',
              color: '#FFFDE7'
            },
          ],
          show: !0,
        },
        geo: {
          map: 'china',
          roam: true, // 开启缩放和平移
          scaleLimit: {
            min: 1, // 最小缩放
            max: 3, // 最大缩放
          },
          zoom: 1.23, // 当前视角的缩放比例
          top: 50,
          label: {
            normal: {
              show: !0,
              fontSize: '14',
              color: 'rgb(36,159,24)',
            },
          },
          itemStyle: {
            normal: {
              // color: '#FFF',
              areaColor: '#323c48',
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',// 外发光
              borderColor: 'rgba(0, 0, 0, 0.2)',
            },
            emphasis: {
              // color: '#FFF',
              areaColor: '#18FFFF', // 悬浮区背景，就是鼠标移到区域上变的颜色
              // areaColor: '#2a333d',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0,
            },
          }
        },
        series: [
          {
            name: '景区数',
            type: 'map',
            geoIndex: 0,
            data: this.list
          }
        ],
      }
      chart.setOption(option)
    }
  },
  watch: {
    list: {
      handler (newValue, oldValue) {
        if (oldValue != newValue) {
          this.setOptions()
        }
      },
      deep: true
    }
  }
}
</script>

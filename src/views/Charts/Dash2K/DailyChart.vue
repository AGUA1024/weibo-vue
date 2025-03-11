<template>
  <v-chart
      style="width:100%; height:300px;"
      :options="chartOption"
      autoresize
      ref="mychart"
  />
</template>

<script>
import echarts from "echarts/lib/echarts";

export default {
  name: 'SunburstChart',
  props:{
    datas1: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      data: [],
      chartOption: {},
    };
  },
  watch: {
    datas1: function () {
      this.chartOption = this.buildChartOption();
    }
  },
  async mounted() {
    // getSunburst().then(res => {
    //   // console.log(res.data.data)
    //   this.data = res.data.data
    //   this.chartOption = this.buildChartOption();
    // })
    // this.chartOption = this.buildChartOption();
  },

  methods: {
    buildChartOption() {
      const option = {
        title: {
          top: 30,
          left: 'center',
          text: '话题的热度',
          textStyle: {
            fontSize: 20,
            color: '#368ce2',
          },
        },
        tooltip: {
          formatter: function (p){
            var format = echarts.format.formatTime('yyyy-MM-dd', p.data[0])
            return format + ' 评论热度：' + p.data[1]
          }
        },
        visualMap: {
          min: 0,
          max: 5000,
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          top: 65,
          textStyle: {
            fontSize: 15,
            color: '#f2a655',
          },
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 13],
          range: '2024',
          itemStyle: {
            borderWidth: 0.5,
          },
          monthLabel:{
            show: true,
            color: '#064559',
            formatter: function (monthObj) {
              const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
              // 使用 MM 属性来获取月份的数字
              const monthIndex = parseInt(monthObj.MM, 10) - 1; // 将 MM 转为索引
              return monthNames[monthIndex];
            }
          },
          dayLabel:{
            show: true,
            color: '#064559',
            firstDay: 1,
            nameMap: ['日', '一', '二', '三', '四', '五', '六']  // 直接使用 nameMap 设置中文星期名称
          },
          yearLabel: {
            show: true,
            color: '#064559'
          }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: this.datas1,
        }
      }
      return option;
    },
  },
};
</script>

<style scoped>

</style>

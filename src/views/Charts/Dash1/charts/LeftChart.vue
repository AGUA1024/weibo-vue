<template>
  <v-chart
      style="width:100%;"
      :options="chartOption"
      autoresize
  />
</template>

<script>
import {getLeftChart} from "@/api/weibo";

export default {
  name: 'BaseLineChart',
  data() {
    return {
      chartOption: {},
      datas: [],
      labels: [],
      data : [],
    };
  },
  async mounted() {
    await getLeftChart().then(res => {
      // console.log(res.data.data);
      this.datas = res.data.data.map(i => i.value)
      this.labels = res.data.data.map(i => i.name.substring(0, 10))
      this.data = res.data.data.map(i => {
        return {name: i.name, value: i.value}
      })
    })
    this.chartOption = this.buildChartOption();
  },
  methods: {
    buildChartOption() {
      const option = {
        // backgroundColor: '#394056',
        title: [

        ],
        grid: [
          {
            show: false,
            left: '2%',
            top: '5%',
            right: '2%',
            bottom: '40%',
            containLabel: true,
          },
          {
            show: false,
            left: '2%',
            top: "50%",
            bottom: '5%',
            right: '2%',
            containLabel: true,
          },
        ],
        legend: {
          type: 'scroll',
          show: false,
          textStyle: {
            fontSize: 10,
            color: '#ECEFF1',
          },
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'line',
          },
          // formatter: (params) =>{
          //   console.log(params)
          //   return params
          // }
        },
        xAxis: [{
          type: 'category',
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: this.labels,
          axisLabel: {
            interval:0,
            rotate:40
          },
          axisLine: {
            lineStyle: {
              color: '#78909C',
            },
          },
        }
        ],
        yAxis: [{
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#78909C',
            },
          },
        }
        ],
        series: [
          {
            name: '所有类型',
            data: this.datas,
            type: 'line',
            smooth: true,
            symbol: 'rect', // 使用 'rect' 表示方形
            symbolSize: [10, 10], // 设置方形的大小
            itemStyle: {
              color: '#2196F3',
            },
          },
          {
            name: '所有类型',
            type: 'pie',
            radius: ['20%', '30%'],
            center: ['50%', '70%'],
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            itemStyle: {
              color: function (params) {
                var colorList = [
                  '#0D47A1', // 浅蓝色
                  '#BBDEFB', // 蓝色
                  '#90CAF9', // 中蓝色
                  '#64B5F6', // 明亮的蓝色
                  '#42A5F5', // 深蓝色
                  '#2196F3', // 标准蓝
                  '#1E88E5', // 深蓝色
                  '#1976D2', // 更深的蓝色
                  '#1565C0', // 深蓝色
                  '#E3F2FD', // 深海军蓝
                  '#B3E5FC', // 浅青色
                  '#81D4FA'  // 浅天蓝色
                ];                return colorList[params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: false
            },
            data: this.data,
            xAxisIndex: 1,
            yAxisIndex: 1,
          }
        ],
      };
      return option;
    },
  }
};
</script>
<style>
/**
 * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
 * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
 */
</style>

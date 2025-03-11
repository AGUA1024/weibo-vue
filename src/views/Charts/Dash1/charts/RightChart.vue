<template>
  <v-chart
      style="width:100%;"
      :options="chartOption"
      autoresize
  />
</template>

<script>
import {getRightChart} from "@/api/weibo";

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
    await getRightChart().then(res => {
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
          data: this.labels,
          // data: this.labels,
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
            name: '数量',
            data: this.datas,
            barWidth: '35%',
            type: 'bar',
            smooth: true,
            itemStyle: {
              color: function (params) {
                var colorList = [
                  '#00796B', // 青色
                  '#80DEEA', // 浅蓝色
                  '#4DD0E1', // 深青色
                  '#26C6DA', // 蓝绿色
                  '#00ACC1', // 蓝色
                  '#0097A7', // 深蓝色
                  '#00838F', // 深青色
                  '#00796B', // 深绿色
                  '#00695C', // 深绿色
                  '#004D40', // 深绿色
                  '#D1C4E9', // 浅紫色
                  '#B39DDB', // 紫色
                  '#9575CD'  // 深紫色
                ];
                return colorList[params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          },
          {
            name: '所有类型',
            type: 'pie',
            radius: '50%',
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
                  '#00796B', // 青色
                  '#80DEEA', // 浅蓝色
                  '#4DD0E1', // 深青色
                  '#26C6DA', // 蓝绿色
                  '#00ACC1', // 蓝色
                  '#0097A7', // 深蓝色
                  '#00838F', // 深青色
                  '#00796B', // 深绿色
                  '#00695C', // 深绿色
                  '#004D40', // 深绿色
                  '#D1C4E9', // 浅紫色
                  '#B39DDB', // 紫色
                  '#9575CD'  // 深紫色
                ];
                return colorList[params.dataIndex];
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

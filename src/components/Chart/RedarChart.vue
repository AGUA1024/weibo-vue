<template>
  <v-chart
      style="width:100%;"
      :options="chartOption"
      autoresize
  />
</template>

<script>
export default {
  name: 'BaseLineChart',
  props:{
    datas1: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      chartOption: {},
      datas: [],
      labels: []
    };
  },
  async mounted() {
    // console.log(this.datas1)
    // console.log(this.datas2)
    // await getChart1().then(res => {
    //   this.datas = res.data.data.all.map(i => i.value)
    //   this.labels = res.data.data.all.map(i => i.name)
    // })
    this.chartOption = this.buildChartOption();
  },
  methods: {
    buildChartOption() {
      const option = {
        color: ['#FFE434', '#67F9D8', '#56A3F1', '#FF917C'],
        // backgroundColor: '#394056',
        radar: {
          // shape: 'circle',
          indicator: [
            { text: '外观' ,max: 5 },
            { text: '动力' ,max: 5},
            { text: '舒适性' ,max: 5},
            { text: '操控' ,max: 5},
            { text: '空间',max: 5 },
            { text: '配置' ,max: 5},
            { text: '内饰',max: 5 }
          ],
          center: ['50%', '50%'],
          radius: 65,
          startAngle: 90,
          splitNumber: 4,
          shape: 'circle',
          splitArea: {
            areaStyle: {
              color: ['#428BD4', '#26C3BE', '#428BD4', '#64AFE9'],
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 10
            }
          },
        },
        legend: {
          show: true,
          textStyle: {
            fontSize: 14,
            color: '#f2a655',
          },
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            emphasis: {
              lineStyle: {
                width: 4
              }
            },
            data: [
              {
                value: this.datas1,
                name: '本款车评分',
                label: {
                  show: true,
                  formatter: function (params) {
                    return params.value;
                  }
                }
              },
              {
                value: this.datas2,
                name: '同价位平均分',
                areaStyle: {
                  color: 'rgba(255, 228, 52, 0.6)'
                }
              }
            ]
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

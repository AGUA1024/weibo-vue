<template>
  <v-chart
      style="width:100%;"
      :options="chartOption"
      autoresize
  />
</template>

<script>
export default {
  name: 'TopChart',
  data() {
    return {
      chartOption: {},
      datas: [],
      labels: [],
      data : [],
    };
  },
  props:{
    datas1: {
      type: Array,
      default: () => [],
    }
  },
  watch: {
    datas1: function () {
      this.chartOption = this.buildChartOption();
    }
  },
  async mounted() {
    // this.chartOption = this.buildChartOption();
  },
  methods: {
    buildChartOption() {
      this.datas = this.datas1.map(i => i.value)
      this.labels = this.datas1.map(i => i.name)
      // this.data = this.datas1

      this.data = this.datas1.map((i,index)=>{
        if(index==0)
          return { name: i.name, value:i.value,  selected: true}
        else
          return { name: i.name, value:i.value}
      })

      const option = {
        // backgroundColor: '#394056',
        title: [
        ],
        grid: [
          {
            show: false,
            left: '5%',
            right: '52%',
            top: '5%',
            bottom: '5%',
            containLabel: true,
          },
          {
            show: false,
            left: '40%',
            right: '10%',
            top: '5%',
            bottom: '55%',
            containLabel: true,
          },
        ],
        legend: {
          type: 'scroll',
          show: false,
          textStyle: {
            fontSize: 10,
            color: '#064559',
          },
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'line',
          },
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
            itemStyle: {
              color: '#368ce2', // 线条颜色
            },
            lineStyle: {
              width: 4 // 设置线条宽度，例如 4px
            },
            symbol: 'diamond', // 将标记形状设置为钻石型
            symbolSize: [20, 20], // 设置钻石的大小，您可以根据需要调整
          },
          {
            name: '所有类型',
            type: 'pie',
            radius: ['20%', '55%'],
            center: ['75%', '40%'],
            roseType: 'area',
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
                  '#966605', '#1bacae', '#096cee', '#249f18', '#FFAB00',
                  '#004D40', '#00695C', '#00796B', '#00897B', '#009688',
                  '#26A69A', '#4DB6AC', '#80CBC4', '#B2DFDB', '#C8E6C9',
                  '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047',
                  '#388E3C', '#2E7D32', '#1B5E20', '#33691E', '#558B2F',
                  '#689F38', '#8BC34A', '#9CCC65', '#AED581', '#C5E1A5',
                  '#E6EE9C'
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

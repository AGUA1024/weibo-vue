<template>
  <v-chart
    style="width:100%;"
    :options="chartOption"
    autoresize
  />
</template>

<script>
export default {
  name: 'WaterfallBarChart',
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
  data() {
    return {
      chartOption: {},
      d1: [],
      l1: []
    };
  },
  async mounted() {
    // 这个数据代码不需要执行
    // this.chartOption = this.buildChartOption();
    // this.startInterval();
  },
  methods: {
    buildChartOption() {
      this.d1 = this.datas1.map((i,index)=>{
        if(index==0)
          return { name: i.name, value:i.value,  selected: true}
        else
          return { name: i.name, value:i.value}
      })
      this.l1 = this.datas1.map(i=>i.name)
      // console.log(this.d1)
      // console.log(this.l1)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.l1,
          textStyle: {
            color: '#064559'
          }
        },
        series: [
          {
            name: '关键词',
            type: 'pie',
            radius: '70%',
            avoidLabelOverlap: false,
            data: this.d1,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              color: function (params) {
                var colorList = [
                  '#004D40', '#00695C', '#00796B', '#00897B', '#009688', '#26A69A', '#4DB6AC', '#80CBC4',
                  '#B2DFDB', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C',
                  '#2E7D32', '#1B5E20', '#0D5302', '#33691E', '#558B2F', '#689F38', '#8BC34A', '#9CCC65',
                  '#AED581', '#C5E1A5', '#E6EE9C', '#FFF59D', '#FFEB3B', '#FFC107', '#FFA000'
                ];
                return colorList[params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          }
        ]
      };

      return option;
    },
  },
};
</script>

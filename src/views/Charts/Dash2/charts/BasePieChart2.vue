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
  data() {
    return {
      chartOption: {},
      d1: [],
      l1: []
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
            name: '',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            data: this.d1,
            avoidLabelOverlap: false,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              color: function (params) {
                var colorList = ['#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#2196F3', '#42A5F5', '#64B5F6'
                  ,'#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6',];
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

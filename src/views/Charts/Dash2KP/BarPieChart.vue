<template>
  <v-chart
    style="width:95%; "
    :options="chartOption"
    autoresize
  />
</template>

<script>
import {barpie} from "@/api/weibo";

export default {
  name: 'AreaLineChart',
  props: {
    param: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      chartOption: {},
      xAxisData: [],
      seriesAData: [],
      l1: [],
      d1: [],
      pie: []
    };
  },
  watch:{
    param:  {
      handler (val) {
           barpie(val).then(res => {
             const modifiedData = res.data.data.map(item => {
               if (item.name === 'negative') {
                 return { ...item, name: '负面' }; // 将name等于negative的替换为"负面"
               } else if (item.name === 'positive') {
                 return { ...item, name: '正面' }; // 将name等于positive的替换为"正面"
               }
               return item; // 不需要修改的项直接返回
             });

            console.log(modifiedData)
            // this.name = res.data.data.name
            this.l1 = modifiedData.map(i => i.name)
            this.d1 =  modifiedData.map(i => i.value)
            this.pie = modifiedData
            this.chartOption = this.buildChartOption();
          })
      },
      immediate: true
    }
  },
  // async mounted() {
  //   await barpie(this.param).then(res => {
  //     // console.log(res.data.data)
  //     this.name = res.data.data.name
  //     this.bar = res.data.data.high
  //     this.pie = res.data.data.low
  //     console.log(res.data.data)
  //     this.chartOption = this.buildChartOption();
  //   })
  // },
  methods: {
    buildChartOption() {
      const option =  {
        // backgroundColor: '#394056',
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
        grid:[
          {
            top: 50,
            width: '50%',
            // bottom: '45%',
            left: 10,
            containLabel: true
          },
        ],
        xAxis: [{
          type: 'category',
          data: this.l1,
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
            name: '总体舆情',
            data: this.d1,
            barWidth: '35%',
            type: 'bar',
            smooth: true,
            itemStyle: {
              color: function (params) {
                if(params['name'] == '积极')
                  return '#0ede24'
                else if(params['name'] == '消极')
                  return '#ff5722'
                else
                  return '#78909C'
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          },
          {
            type: 'pie',
            radius: [0, '60%'],
            center: ['81%', '45%'],
            data: this.pie,
            label: {
              show: true,
              formatter: '{b}: {d}%', // {b}表示数据名称，{d}表示百分比
              position: 'inside' // 标签显示在饼图外部
            },
            itemStyle: {
              color: function (params) {
                if(params['name'] == '积极')
                  return '#0ede24'
                else if(params['name'] == '消极')
                  return '#ff5722'
                else
                  return '#78909C'
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
            },
          },
        ],
      };

      return option;
    },
  }
};
</script>

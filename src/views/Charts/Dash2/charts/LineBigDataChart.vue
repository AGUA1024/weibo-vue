<template>
  <v-chart
    style="width:100%;"
    :options="chartOption"
    autoresize
  />
</template>

<script>
import echarts from 'echarts/lib/echarts';
import {getBigDataChart} from "@/api/music";

export default {
  name: 'BigDataLineChart',
  data() {
    return {
      chartOption: {},
      xAxisData: [],
      seriesAData: [],
    };
  },
  async mounted() {
    await getBigDataChart().then(res => {
      this.xAxisData = res.data.data.map(i => i.name)
      this.seriesAData = res.data.data.map(i => i.value)
    })

    this.chartOption = this.buildChartOption();
  },
  methods: {
    buildChartOption() {
      // let base = +new Date(1949, 8, 1);
      let date = [];
      let data = [600];
      // const oneDay = 24 * 3600 * 1000;

      data = this.seriesAData
      date = this.xAxisData

      // for (let i = 1; i < 26000; i += 1) {
      //   const now = new Date((base += oneDay));
      //   date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
      //   data.push(Math.abs(Math.round((Math.random() - 0.5) * 30 + data[i - 1])));
      // }

      const option = {
        title: {
          // text: 'Line - Big Data',
        },
        grid: {
          right: 10,
          left: 20,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          position(pt) {
            return [pt[0], '10%'];
          },
        },
        toolbox: {
          right: 20,
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date,
          axisLine: {
            lineStyle: {
              color: '#78909C',
            },
          },

        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          axisLine: {
            lineStyle: {
              color: '#78909C',
            },
          },
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 60,
          },
          {
            start: 0,
            end: 10,
            handleIcon:
              'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            textStyle: {
              fontWeight: 'normal',
              fontSize: 20,
              color: '#F1F1F3',
            },
          },
        ],
        series: [
          {
            name: '数据',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              normal: {
                color: 'rgb(255,233,70)',
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(228,107,249)',
                  },
                  {
                    offset: 1,
                    color: 'rgb(85,153,242)',
                  },
                ]),
              },
            },
            data,
          },
        ],
      };

      return option;
    },
  }
};
</script>

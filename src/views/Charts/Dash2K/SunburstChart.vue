<template>
  <v-chart
      style="width:100%; height:800px;"
      :options="chartOption"
      autoresize
      ref="mychart"
  />
</template>

<script>
import echarts from "echarts/lib/echarts";
import {getSunburst} from "@/api/weibo"

export default {
  name: 'SunburstChart',
  data() {
    return {
      data : [
        {
          name: 'Flora',
          itemStyle: {
            color: '#da0d68'
          },
          children: [
            {
              name: 'Black Tea',
              value: 1,
              itemStyle: {
                color: '#975e6d'
              }
            },
            {
              name: 'Floral',
              itemStyle: {
                color: '#e0719c'
              },
              children: [
                {
                  name: 'Chamomile',
                  value: 1,
                  itemStyle: {
                    color: '#f99e1c'
                  }
                },
                {
                  name: 'Rose',
                  value: 1,
                  itemStyle: {
                    color: '#ef5a78'
                  }
                },
                {
                  name: 'Jasmine',
                  value: 1,
                  itemStyle: {
                    color: '#f7f1bd'
                  }
                }
              ]
            }
          ]
        },
      ],
      data2 : [],
      chartOption: {},
    };
  },

  async mounted() {
    getSunburst().then(res=>{
      console.log(res.data.data)
      this.data2 = res.data.data
      this.chartOption = this.buildChartOption();
    })
  },

  methods: {
    buildChartOption() {
      const option = {
        title: {
          text: '微博话题情感分析',
          subtext: '情感分析【正面、负面、中性】',
          textStyle: {
            fontSize: 14,
            align: 'center'
          },
          subtextStyle: {
            align: 'center'
          },
          // sublink: 'https://worldcoffeeresearch.org/work/sensory-lexicon/'
        },
        series: {
          type: 'sunburst',
          data: this.data2,
          radius: [0, '95%'],
          sort: undefined,
          emphasis: {
            focus: 'ancestor'
          },
          levels: [
            {},
            {
              r0: '5%',
              r: '55%',
              itemStyle: {
                borderWidth: 2
              },
              label: {
                // rotate: 'tangential'
              }
            },
            {
              r0: '55%',
              r: '80%',
              label: {
                align: 'right'
              }
            },
            {
              r0: '70%',
              r: '72%',
              label: {
                position: 'outside',
                padding: 3,
                silent: false
              },
              itemStyle: {
                borderWidth: 3
              }
            }
          ]
        }
      }

      return option;
    },

  },
};
</script>

<style scoped>

</style>

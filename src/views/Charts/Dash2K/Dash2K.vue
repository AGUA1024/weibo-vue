<template>
  <v-container grid-list-lg pa-0 fluid="true">
    <v-layout wrap>
      <v-flex xs12>
        <v-basic-card
            title="话题情感分析"
            toolbar-height="56"
        >
          <template slot="card-content">
           <sunburst-chart/>
          </template>
        </v-basic-card>
      </v-flex>

      <div class="primary--text font-weight-bold text-h5 d-flex justify-start my-6">
        热门话题
      </div>
      <v-row>
        <div v-for="item in items" :key="item.id">
          <v-chip :disabled="loading"
                  class="ma-2"
                  color="teal"
                  outlined
                  @click="getTopicInfo(item.topics || item.keywords)"
          >
            {{ item.topics || item.keywords }}
          </v-chip>
        </div>
      </v-row>

      <v-flex xs12>
        <v-basic-card
            title="话题热度"
            toolbar-height="56"
        >
          <template slot="card-content">
            <daily-chart :datas1="daily"/>
          </template>
        </v-basic-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import SunburstChart from "./SunburstChart";
import DailyChart from "./DailyChart";
import {getHot, getDaily} from "@/api/weibo"
import echarts from "echarts/lib/echarts";
import mixin from "../../../mixins/mixins";
export default {
  mixins: [mixin],
  name: 'VBarIndex',
  components: {
    SunburstChart, DailyChart
  },
  data: () => ({
    items: [],
    opinions : [],
    keywords : [],
    daily: [],
    loading : false,
  }),
  methods: {
    getTopicInfo(topics){
      this.loading = true
      getDaily(topics).then(res=>{
        this.daily = res.data.data
        this.loading = false
        // this.daily = res.data.data
      })
    },
    getVirtulData(year) {
      // year = year || '2017';
      year = '2024'
      var date = +echarts.number.parseDate(+year + '-01-01');
      var end = +echarts.number.parseDate(+year + 1 + '-01-01');
      console.log(data, end)
      var dayTime = 3600 * 24 * 1000;
      var data = [];
      for (var time = date; time < end; time += dayTime) {
        data.push([
          echarts.format.formatTime('yyyy-MM-dd', time),
          Math.floor(Math.random() * 10000)
        ]);
      }
      return data;
    }
  },
  mounted() {
    getHot(this.uid).then(res => {
      this.items = res.data.data
      // this.getTopicInfo(6)
      // console.log(res.data.data)
      // this.daily = this.getVirtulData('2022')
      // console.log(this.daily)
    })

    getDaily(1).then(res=>{
      this.daily = res.data.data
      // console.log(this.daily)
      // this.daily = res.data.data
    })
  }
};
</script>

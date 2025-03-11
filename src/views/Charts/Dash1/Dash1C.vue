<template>
  <v-container grid-list-lg pa-0>
    <v-layout wrap>
      <v-flex sm6 xs12 md6 lg3 v-for="item in panels" :key="item.name">
        <v-card
            :color="item.iconColor"
            dark
        >
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title
                  class="text-h5"
                  v-text="item.name"
              ></v-card-title>
              <v-card-subtitle class="text-h5">
                <countTo :startVal='0' :endVal='item.value' :duration='3000'></countTo>
              </v-card-subtitle>
            </div>

            <v-avatar
                class="ma-3"
                size="80"
                tile
            >
              <v-img :src="item.icon"></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-flex>
      <!-- -->
      <v-flex
          xs12
          lg3
      >
        <v-basic-card
            title="关键词微博分析"
            toolbar-height="56"
        >
          <template slot="card-content">
            <left-chart/>
          </template>
        </v-basic-card>
      </v-flex>
      <!-- 中国地图 -->
      <v-flex
          xs12
          lg6
      >
        <v-basic-card
            title="数据总览"
            toolbar-height="56"
        >
          <template slot="card-content">
          <Canvas/>
          </template>
        </v-basic-card>
      </v-flex>
      <!-- -->
      <v-flex
          xs12
          lg3
      >
        <v-basic-card
            title="关键词消极微博分析"
            toolbar-height="56"
        >
          <template slot="card-content">
            <right-chart/>
          </template>
        </v-basic-card>
      </v-flex>
      <!-- 第二行 -->
      <v-flex xs12 lg6>
        <v-basic-card
            title="微博话题热度排名"
            toolbar-height="56"
        >
          <template slot="card-content">
            <bar-base-chart />
          </template>
        </v-basic-card>
      </v-flex>
      <v-flex
          xs12
          lg6
      >
        <v-basic-card
            title="微博消极数量排名"
            toolbar-height="56"
        >
          <template slot="card-content">
            <bar-base-chart2 />
          </template>
        </v-basic-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Canvas from "./charts/Canvas";
import LeftChart from "./charts/LeftChart";
import RightChart from "./charts/RightChart"
import BarBaseChart from "../Dash1/charts/BarBaseChart";
import BarBaseChart2 from "../Dash1/charts/BarBaseChart2";
import {getPanel} from "@/api/weibo";
import countTo from 'vue-count-to';

export default {
  name: "Dash1",
  components: {
     LeftChart, RightChart, BarBaseChart, BarBaseChart2,Canvas,
    countTo
  },
  async mounted() {
    await getPanel().then(res => {
      // console.log(res.data.data)
      this.panels[0].value = res.data.data.data1
      this.panels[1].value = res.data.data.data2
      this.panels[2].value = res.data.data.data3
      this.panels[3].value = res.data.data.data4
    })
  },
  data: () => ({
    panels: [{
      'iconColor': 'indigo',
      'icon': require('@/assets/dash/g1.png'),
      'name': '话题数',
      'value': 0
    }, {
      'iconColor': 'blue lighten-1',
      'icon': require('@/assets/dash/g2.png'),
      'name': '微博数',
      'value': 0
    }, {
      'iconColor': 'red lighten-2',
      'icon': require('@/assets/dash/g3.png'),
      'name': '负面内容数',
      'value': 0
    }, {
      'iconColor': 'teal ',
      'icon': require('@/assets/dash/g4.png'),
      'name': '用户数',
      'value': 0
    }],
  })
}
</script>

<style scoped>

</style>

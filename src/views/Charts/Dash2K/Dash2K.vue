<template>
  <v-container fluid class="dashboard-container py-4">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold deep-purple--text mb-2">数据分析中心</h1>
      <p class="text-subtitle-1 grey--text text--darken-1">微博热门话题情感分析与热度追踪</p>
    </div>
    
    <!-- 情感分析卡片 -->
    <v-card class="mb-6 dashboard-card elevation-2 rounded-lg">
      <v-card-title class="deep-purple--text d-flex align-center">
        <v-icon color="deep-purple" class="mr-2">mdi-chart-pie</v-icon>
        话题情感分析
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon small v-bind="attrs" v-on="on">
              <v-icon small>mdi-information-outline</v-icon>
            </v-btn>
          </template>
          <span>展示不同话题的情感分布情况</span>
        </v-tooltip>
      </v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="pt-4">
        <sunburst-chart/>
      </v-card-text>
    </v-card>

    <!-- 热门话题区域 -->
    <v-card class="mb-6 dashboard-card elevation-2 rounded-lg">
      <v-card-title class="deep-purple--text d-flex align-center">
        <v-icon color="deep-purple" class="mr-2">mdi-trending-up</v-icon>
        热门话题
        <v-chip small color="deep-purple" class="white--text ml-3">{{ items.length }}个话题</v-chip>
        <v-spacer></v-spacer>
        <v-btn 
          small 
          outlined 
          color="deep-purple" 
          :loading="loading"
          :disabled="loading"
          @click="refreshTopics"
        >
          <v-icon left small>mdi-refresh</v-icon>
          刷新
        </v-btn>
      </v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="pt-4">
        <v-skeleton-loader
          v-if="loading && items.length === 0"
          type="chip-group"
          class="my-3"
        ></v-skeleton-loader>
        
        <div v-else-if="items.length === 0" class="text-center py-5">
          <v-icon color="grey" x-large>mdi-tag-remove</v-icon>
          <div class="grey--text mt-2">暂无热门话题数据</div>
        </div>
        
        <div v-else class="topics-container">
          <v-chip
            v-for="item in items" 
            :key="item.id"
            class="ma-1 topic-chip"
            :color="selectedTopic === (item.topics || item.keywords) ? 'deep-purple' : 'grey lighten-4'"
            :text-color="selectedTopic === (item.topics || item.keywords) ? 'white' : 'deep-purple'"
            :outlined="selectedTopic !== (item.topics || item.keywords)"
            @click="getTopicInfo(item.topics || item.keywords)"
          >
            <v-avatar left v-if="selectedTopic === (item.topics || item.keywords)">
              <v-icon small>mdi-check-circle</v-icon>
            </v-avatar>
            {{ item.topics || item.keywords }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- 话题热度图表 -->
    <v-card class="dashboard-card elevation-2 rounded-lg">
      <v-card-title class="deep-purple--text d-flex align-center">
        <v-icon color="deep-purple" class="mr-2">mdi-chart-line</v-icon>
        话题热度趋势
        <v-chip 
          small 
          outlined 
          color="deep-purple" 
          class="ml-3" 
          v-if="selectedTopic"
        >
          {{ selectedTopic }}
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn-toggle
          v-model="timeRange"
          color="deep-purple"
          dense
          mandatory
          class="chart-toggle"
        >
          <v-btn small value="day">
            日
          </v-btn>
          <v-btn small value="week">
            周
          </v-btn>
          <v-btn small value="month">
            月
          </v-btn>
        </v-btn-toggle>
      </v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="pt-4">
        <v-skeleton-loader
          v-if="loading && daily.length === 0"
          type="chart"
          class="my-3"
        ></v-skeleton-loader>
        
        <div v-else-if="daily.length === 0" class="text-center py-5">
          <v-icon color="grey" x-large>mdi-chart-line-variant</v-icon>
          <div class="grey--text mt-2">请选择一个话题查看热度趋势</div>
        </div>
        
        <daily-chart v-else :datas1="daily"/>
      </v-card-text>
    </v-card>
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
    opinions: [],
    keywords: [],
    daily: [],
    loading: false,
    selectedTopic: '',
    timeRange: 'week',
  }),
  methods: {
    getTopicInfo(topics) {
      this.loading = true;
      this.selectedTopic = topics;
      
      getDaily(topics).then(res => {
        this.daily = res.data.data;
        this.loading = false;
      }).catch(err => {
        console.error('获取话题热度数据失败:', err);
        this.loading = false;
        this.$snackbar({
          content: '获取话题热度数据失败！', 
          top: true, 
          center: true, 
          color: 'red',
          multiLine: true
        });
      });
    },
    refreshTopics() {
      this.loading = true;
      getHot(this.uid).then(res => {
        this.items = res.data.data;
        this.loading = false;
        
        if (this.items.length > 0 && !this.selectedTopic) {
          this.getTopicInfo(this.items[0].topics || this.items[0].keywords);
        }
      }).catch(err => {
        console.error('获取热门话题失败:', err);
        this.loading = false;
        this.$snackbar({
          content: '获取热门话题失败！', 
          top: true, 
          center: true, 
          color: 'red',
          multiLine: true
        });
      });
    },
    getVirtulData(year) {
      year = '2024';
      var date = +echarts.number.parseDate(+year + '-01-01');
      var end = +echarts.number.parseDate(+year + 1 + '-01-01');
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
    this.refreshTopics();
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1600px;
  margin: 0 auto;
}

.dashboard-card {
  border: 1px solid rgba(103, 58, 183, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.dashboard-card:hover {
  box-shadow: 0 5px 15px rgba(103, 58, 183, 0.15) !important;
}

.topics-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px 0;
}

.topic-chip {
  transition: all 0.2s ease;
  margin: 4px !important;
}

.topic-chip:hover {
  box-shadow: 0 2px 8px rgba(103, 58, 183, 0.2);
  transform: translateY(-2px);
}

.chart-toggle {
  border: 1px solid rgba(103, 58, 183, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.deep-purple--text {
  color: #673ab7 !important;
}

/* 自定义滚动条 */
.topics-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.topics-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.topics-container::-webkit-scrollbar-thumb {
  background: #673ab7;
  border-radius: 3px;
}

.topics-container::-webkit-scrollbar-thumb:hover {
  background: #5e35b1;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .dashboard-container {
    padding: 12px;
  }
  
  .topics-container {
    max-height: 150px;
  }
}
</style>


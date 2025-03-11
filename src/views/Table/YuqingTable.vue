<template>
  <div class="yuqing-container">
    <!-- 舆情概览卡片 -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-card class="dashboard-card elevation-2 rounded-lg">
          <v-card-text class="d-flex align-center">
            <div class="mr-4">
              <v-avatar color="deep-purple lighten-4" size="50">
                <v-icon color="deep-purple" size="30">mdi-comment-text-multiple</v-icon>
              </v-avatar>
            </div>
            <div>
              <div class="text-h5 font-weight-bold deep-purple--text">{{ totalTopics }}</div>
              <div class="text-subtitle-2 grey--text">微博话题总量</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="dashboard-card elevation-2 rounded-lg">
          <v-card-text class="d-flex align-center">
            <div class="mr-4">
              <v-avatar color="red lighten-4" size="50">
                <v-icon color="red" size="30">mdi-alert-circle</v-icon>
              </v-avatar>
            </div>
            <div>
              <div class="text-h5 font-weight-bold red--text">{{ highRiskCount }}</div>
              <div class="text-subtitle-2 grey--text">高风险舆情数量</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="dashboard-card elevation-2 rounded-lg">
          <v-card-text class="d-flex align-center">
            <div class="mr-4">
              <v-avatar color="green lighten-4" size="50">
                <v-icon color="green" size="30">mdi-shield-check</v-icon>
              </v-avatar>
            </div>
            <div>
              <div class="text-h5 font-weight-bold green--text">{{ lowRiskCount }}</div>
              <div class="text-subtitle-2 grey--text">低风险舆情数量</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- 舆情图表卡片 -->
    <v-card class="mb-6 chart-card elevation-2 rounded-lg">
      <v-card-title class="deep-purple--text">
        <v-icon color="deep-purple" class="mr-2">mdi-chart-line</v-icon>
        舆情趋势分析
      </v-card-title>
      <v-card-text class="px-0">
        <v-sparkline
          :value="sentimentTrend"
          :gradient="['#673ab7', '#9c27b0']"
          :smooth="16"
          auto-draw
          stroke-linecap="round"
          padding="16"
          line-width="2"
          height="100"
        ></v-sparkline>
      </v-card-text>
    </v-card>
    
    <!-- 舆情数据表格 -->
    <v-card class="elevation-2 rounded-lg yuqing-card">
      <v-card-title class="deep-purple--text">
        <v-icon color="deep-purple" class="mr-2">mdi-sina-weibo</v-icon>
        微博文章舆情分析
        
        <v-menu offset-y close-on-content-click>
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              text 
              color="deep-purple" 
              class="ml-2" 
              small
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left small>mdi-filter-variant</v-icon>
              筛选
            </v-btn>
          </template>
          <v-card width="300">
            <v-card-text>
              <v-select
                v-model="riskFilter"
                :items="['全部', '高风险', '中风险', '低风险']"
                label="风险等级"
                outlined
                dense
                hide-details
                class="mb-3"
              ></v-select>
              <v-select
                v-model="timeFilter"
                :items="['全部时间', '今日', '本周', '本月']"
                label="时间范围"
                outlined
                dense
                hide-details
                class="mb-3"
              ></v-select>
              <v-btn color="deep-purple" block small class="mt-3">应用筛选</v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
        
        <v-spacer></v-spacer>
        
        <v-text-field
            v-model="options.keyword"
            append-icon="mdi-magnify"
            label="搜索微博文章"
            hide-details
            class="search-field"
            color="deep-purple"
            dense
        ></v-text-field>
        
        <v-btn text color="deep-purple" class="ml-2" @click="refreshData">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-0">
        <v-data-table
            :headers="headers"
            :items="datas"
            :options.sync="options"
            :server-items-length="total"
            :loading="loading"
            :search="options.keyword"
            class="elevation-0"
            dense
            :footer-props="{
              'items-per-page-options': [10, 15, 20],
              'items-per-page-text': '每页显示',
            }"
        >
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@6" class="my-3"></v-skeleton-loader>
          </template>
          
          <template v-slot:item.topics="{ item }">
            <div class="font-weight-medium">{{ item.topics }}</div>
          </template>
          
          <template v-slot:item.total="{ item }">
            <v-chip small>{{ item.total }}</v-chip>
          </template>
          
          <template v-slot:item.keywords="{ item }">
            <div class="keywords-container">
              <v-chip
                v-for="(keyword, idx) in getKeywordsArray(item.keywords)" 
                :key="idx"
                x-small
                class="mr-1 mb-1"
                color="grey lighten-4"
              >
                {{ keyword }}
              </v-chip>
            </div>
          </template>
          
          <template v-slot:item.rate="{ item }">
            <v-chip
                :color="getColor(item.rate)"
                dark small>
              {{ item.rate }}
            </v-chip>
          </template>
          
          <template v-slot:item.actions="{ item }">
            <v-btn icon small color="deep-purple" class="mr-1" @click="viewDetails(item)">
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="setAlert(item)">
              <v-icon small>mdi-bell</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    
    <!-- 风险分布卡片 -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="elevation-2 rounded-lg">
          <v-card-title class="deep-purple--text">
            <v-icon color="deep-purple" class="mr-2">mdi-chart-pie</v-icon>
            舆情风险分布
          </v-card-title>
          <v-card-text class="text-center">
            <v-progress-circular
              :rotate="-90"
              :size="200"
              :width="15"
              :value="highRiskPercentage"
              color="red"
              class="ma-3"
            >
              <div>
                <div class="text-h6">{{ highRiskPercentage }}%</div>
                <div class="caption">高风险</div>
              </div>
            </v-progress-circular>
            
            <v-progress-circular
              :rotate="-90"
              :size="200"
              :width="15"
              :value="mediumRiskPercentage"
              color="orange"
              class="ma-3"
            >
              <div>
                <div class="text-h6">{{ mediumRiskPercentage }}%</div>
                <div class="caption">中风险</div>
              </div>
            </v-progress-circular>
            
            <v-progress-circular
              :rotate="-90"
              :size="200"
              :width="15"
              :value="lowRiskPercentage"
              color="green"
              class="ma-3"
            >
              <div>
                <div class="text-h6">{{ lowRiskPercentage }}%</div>
                <div class="caption">低风险</div>
              </div>
            </v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card class="elevation-2 rounded-lg">
          <v-card-title class="deep-purple--text">
            <v-icon color="deep-purple" class="mr-2">mdi-trending-up</v-icon>
            热点话题排行
          </v-card-title>
          <v-list dense>
            <v-list-item
              v-for="(item, index) in topTopics.slice(0, 5)"
              :key="index"
            >
              <v-list-item-avatar>
                <v-avatar color="deep-purple lighten-4" size="36">
                  <span class="deep-purple--text font-weight-bold">{{ index + 1 }}</span>
                </v-avatar>
              </v-list-item-avatar>
              
              <v-list-item-content>
                <v-list-item-title>{{ item.topics }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon x-small color="grey" class="mr-1">mdi-comment</v-icon>
                  {{ item.total }} 条讨论
                </v-list-item-subtitle>
              </v-list-item-content>
              
              <v-list-item-action>
                <v-chip
                  :color="getColor(item.rate)"
                  dark x-small>
                  {{ item.rate }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {getArticle} from "@/api/weibo";
import mixin from "../../mixins/mixins";

export default {
  components: {},
  mixins: [mixin],
  name: "Home",
  data() {
    return {
      total: 0,
      datas: [],
      loading: true,
      options: {},
      myrate: 0,
      riskFilter: '全部',
      timeFilter: '全部时间',
      headers: [
        {
          text: '微博话题/主题',
          align: 'start',
          sortable: false,
          value: 'topics',
        },
        {text: '总讨论数', value: 'total'},
        {text: '关键词', value: 'keywords'},
        {text: '舆情指数', value: 'rate', width: 100},
        {text: '操作', value: 'actions', sortable: false, width: 80},
      ],
      hloading: false,
      sentimentTrend: [30, 40, 25, 50, 65, 45, 70, 60, 80, 40, 50, 55],
    }
  },
  computed: {
    totalTopics() {
      return this.total || 0;
    },
    highRiskCount() {
      return this.datas.filter(item => item.rate > 60).length;
    },
    mediumRiskCount() {
      return this.datas.filter(item => item.rate > 45 && item.rate <= 60).length;
    },
    lowRiskCount() {
      return this.datas.filter(item => item.rate <= 45).length;
    },
    highRiskPercentage() {
      return this.datas.length ? Math.round((this.highRiskCount / this.datas.length) * 100) : 0;
    },
    mediumRiskPercentage() {
      return this.datas.length ? Math.round((this.mediumRiskCount / this.datas.length) * 100) : 0;
    },
    lowRiskPercentage() {
      return this.datas.length ? Math.round((this.lowRiskCount / this.datas.length) * 100) : 0;
    },
    topTopics() {
      // 返回按照总讨论数排序的话题
      return [...this.datas].sort((a, b) => b.total - a.total);
    }
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi()
      },
      deep: true,
    },
  },
  methods: {
    getKeywordsArray(keywords) {
      if (!keywords) return [];
      return keywords.split(',').map(k => k.trim());
    },
    getDataFromApi() {
      this.loading = true
      const {sortBy, sortDesc, page, itemsPerPage, keyword} = this.options
      getArticle(this.uid, page, itemsPerPage, keyword).then(res => {
        console.log(res)
        this.datas = res.data.data.data
        this.total = res.data.data.total
        this.loading = false
      }).catch(err => {
        console.error('加载舆情数据失败', err);
        this.loading = false;
      })
    },
    refreshData() {
      this.getDataFromApi();
    },
    getColor(value) {
      if (value > 60) return 'red'
      else if (value > 45) return 'orange'
      else return 'deep-purple'
    },
    viewDetails(item) {
      // 查看微博详情的方法
      console.log('查看详情:', item);
      // 这里可以实现查看详情的逻辑，比如打开一个对话框或者跳转到详情页
    },
    setAlert(item) {
      // 设置提醒的方法
      console.log('设置提醒:', item);
      // 这里可以实现设置提醒的逻辑，比如打开提醒设置对话框
    },
  },
}
</script>

<style scoped>
.yuqing-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(103, 58, 183, 0.1);
  height: 100%;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(103, 58, 183, 0.2) !important;
}

.chart-card {
  border: 1px solid rgba(103, 58, 183, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 5px 15px rgba(103, 58, 183, 0.15) !important;
}

.yuqing-card {
  border: 1px solid rgba(103, 58, 183, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.yuqing-card:hover {
  box-shadow: 0 5px 15px rgba(103, 58, 183, 0.15) !important;
}

.deep-purple--text {
  color: #673ab7 !important;
}

.search-field {
  max-width: 300px;
}

.v-data-table >>> .v-data-table__wrapper {
  min-height: 300px;
}

.v-data-table >>> th {
  background-color: rgba(103, 58, 183, 0.05) !important;
}

.v-data-table >>> .v-data-footer {
  border-top: 1px solid rgba(103, 58, 183, 0.1);
}

.keywords-container {
  max-width: 200px;
  white-space: normal;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .yuqing-container {
    padding: 10px;
  }
  
  .search-field {
    max-width: 100%;
  }
  
  .v-card-title {
    flex-wrap: wrap;
  }
  
  .v-data-table >>> th,
  .v-data-table >>> td {
    padding: 0 8px !important;
  }
}
</style>

<template>
  <div class="library-container">
    <!-- 顶部标题和信息 -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex flex-wrap align-center">
          <h1 class="text-h4 font-weight-bold deep-purple--text mr-3">微博数据中心</h1>
          <v-chip color="deep-purple" small dark class="mr-2">{{items.length}}条数据</v-chip>
          <v-chip color="deep-purple" outlined small v-if="lastSearchTerm" class="mr-2">
            <v-icon left small>mdi-magnify</v-icon>
            {{lastSearchTerm}}
          </v-chip>
        </div>
        <p class="text-subtitle-2 grey--text text--darken-1 mt-1">探索微博数据，发现热门话题和舆情趋势</p>
      </v-col>
    </v-row>
    
    <!-- 搜索部分 -->
    <v-card class="mb-6 search-card elevation-2 rounded-lg">
      <v-card-title class="deep-purple--text pb-1">
        <v-icon color="deep-purple" class="mr-2">mdi-magnify</v-icon>
        微博舆情搜索
      </v-card-title>
      
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="8" lg="9">
            <div class="d-flex">
              <div class="flex-grow-1 mr-2">
                <search-box @search-movie="handleSearchResult" ref="searchBox" />
              </div>
              <v-btn 
                color="deep-purple" 
                @click="resetSearch" 
                :disabled="!isSearchActive"
                elevation="1"
              >
                <v-icon left>mdi-refresh</v-icon>
                重置
              </v-btn>
            </div>
            
            <div v-if="recentSearches && recentSearches.length > 0" class="mt-2">
              <div class="d-flex align-center flex-wrap">
                <span class="text-caption grey--text text--darken-1 mr-2 my-1">
                  <v-icon x-small color="grey darken-1">mdi-history</v-icon> 最近搜索:
                </span>
                <div>
                  <v-chip
                    v-for="(term, i) in recentSearches.slice(0,5)" 
                    :key="i"
                    x-small
                    class="mr-1 mb-1"
                    color="grey lighten-3"
                    @click="applyRecentSearch(term)"
                  >
                    {{ term }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-col>
          
          <v-col cols="12" md="4" lg="3" class="search-tips">
            <v-card flat class="pa-3 deep-purple lighten-5 rounded-lg">
              <v-card-subtitle class="pb-0 deep-purple--text font-weight-medium d-flex align-center">
                <v-icon small color="deep-purple" class="mr-1">mdi-lightbulb-on</v-icon>
                搜索小技巧
              </v-card-subtitle>
              <v-card-text class="py-2 text-body-2">
                <ul class="pl-4 mb-0">
                  <li>使用关键词搜索热门话题</li>
                  <li>可以搜索微博用户名</li>
                  <li>支持多关键词组合搜索</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <!-- 结果部分 -->
    <v-card class="results-card rounded-lg elevation-1">
      <v-card-title class="deep-purple--text d-flex align-center">
        <v-icon color="deep-purple" class="mr-2">mdi-post</v-icon>
        {{ isSearchActive ? '搜索结果' : '全部数据' }}
        <v-chip color="deep-purple" class="white--text ml-4" small>{{items.length}}个结果</v-chip>
        <v-spacer></v-spacer>
        
        <div class="d-flex align-center">
          <v-btn-toggle
            v-model="viewType"
            color="deep-purple"
            dense
            group
            mandatory
            class="mr-2"
          >
            <v-btn small value="grid">
              <v-icon small>mdi-view-grid</v-icon>
            </v-btn>
            <v-btn small value="list">
              <v-icon small>mdi-view-list</v-icon>
            </v-btn>
          </v-btn-toggle>
          
          <v-menu offset-y close-on-content-click>
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                icon
                small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-sort</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="sortBy = 'newest'">
                <v-list-item-icon><v-icon small>mdi-clock-outline</v-icon></v-list-item-icon>
                <v-list-item-title>最新优先</v-list-item-title>
              </v-list-item>
              <v-list-item @click="sortBy = 'hottest'">
                <v-list-item-icon><v-icon small>mdi-fire</v-icon></v-list-item-icon>
                <v-list-item-title>热度优先</v-list-item-title>
              </v-list-item>
              <v-list-item @click="sortBy = 'risk'">
                <v-list-item-icon><v-icon small>mdi-alert</v-icon></v-list-item-icon>
                <v-list-item-title>风险优先</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <div v-if="searchLoading" class="pa-6 text-center">
        <v-progress-circular indeterminate color="deep-purple"></v-progress-circular>
        <div class="mt-2 grey--text">加载中...</div>
      </div>
      
      <v-card-text v-else class="py-4">
        <!-- 空结果状态 -->
        <v-row v-if="items.length === 0">
          <v-col cols="12" class="text-center py-5">
            <v-img 
              src="https://cdn.pixabay.com/photo/2017/03/22/17/39/kitchen-2165756_960_720.jpg" 
              max-width="200" 
              class="mx-auto mb-4 rounded opacity-image"
            ></v-img>
            <v-icon color="grey" x-large>mdi-database-search</v-icon>
            <div class="grey--text mt-2">暂无搜索结果，请尝试其他关键词</div>
            
            <div class="mt-5">
              <v-btn color="deep-purple" text @click="showPopularTopics">
                <v-icon left>mdi-trending-up</v-icon>
                查看热门话题
              </v-btn>
              <v-btn color="deep-purple" text @click="resetSearch">
                <v-icon left>mdi-refresh</v-icon>
                重置搜索
              </v-btn>
            </div>
          </v-col>
        </v-row>
        
        <!-- 网格视图 -->
        <v-row v-else-if="viewType === 'grid'">
          <v-col 
            cols="12" 
            md="3" 
            sm="6" 
            v-for="(item, index) in paginatedItems" 
            :key="index"
            class="grid-item-col"
          >
            <v-hover v-slot="{ hover }">
              <house-card :item="item" class="grid-card" :class="{ 'on-hover': hover }"/>
            </v-hover>
          </v-col>
        </v-row>
        
        <!-- 列表视图 -->
        <v-row v-else>
          <v-col cols="12" v-for="(item, index) in paginatedItems" :key="index">
            <v-hover v-slot="{ hover }">
              <v-card 
                outlined 
                hover 
                class="mb-3 list-item-card"
                :class="{ 'on-hover': hover }"
              >
                <div class="d-flex">
                  <div class="list-card-content flex-grow-1 pa-3">
                    <div class="d-flex align-center mb-1">
                      <span class="text-subtitle-1 font-weight-medium deep-purple--text text-truncate mr-2">
                        {{ item.title || "话题: " + item.topics }}
                      </span>
                      <v-chip :color="getChipColor(item.rate)" x-small class="white--text">{{ item.rate }}</v-chip>
                    </div>
                    <div class="mt-2 grey--text text--darken-1 text-body-2">
                      <v-icon x-small class="mr-1">mdi-comment-multiple</v-icon>
                      讨论数: {{ item.total }}
                    </div>
                    <div class="d-flex align-center mt-2 flex-wrap">
                      <v-chip 
                        v-for="(keyword, kidx) in getKeywordsArray(item.keywords)" 
                        :key="kidx"
                        x-small
                        outlined
                        color="deep-purple"
                        class="mr-1 mb-1"
                      >
                        {{ keyword }}
                      </v-chip>
                    </div>
                  </div>
                  <div class="pa-3 align-self-center d-none d-sm-flex">
                    <v-btn small text color="deep-purple" class="mr-1" @click.stop="viewDetails(item)">
                      <v-icon left x-small>mdi-eye</v-icon>
                      详情
                    </v-btn>
                    <v-btn small text color="deep-purple" @click.stop="shareItem(item)">
                      <v-icon left x-small>mdi-share-variant</v-icon>
                      分享
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
        
        <!-- 分页区域 -->
        <v-row v-if="items.length > itemsPerPage">
          <v-col cols="12" class="text-center">
            <v-pagination
              v-model="page"
              :length="totalPages"
              :total-visible="7"
              color="deep-purple"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import HouseCard from "../components/DataCard";
import {get} from "@/api/weibo";
import SearchBox from "@/components/SearchBox.vue";
import mixin from "../mixins/mixins";

export default {
  components: {HouseCard, SearchBox},
  mixins: [mixin],
  name: "Home",
  data: () => ({
    items: [],
    allItems: [], // 存储所有数据，用于重置搜索
    viewType: "grid",
    page: 1,
    itemsPerPage: 12,
    totalPages: 1,
    recentSearches: ['微博热点', '疫情', '教育', '财经'],
    searchLoading: false,
    lastSearchTerm: '', // 记录最后一次搜索的关键词
    isSearchActive: false, // 是否处于搜索状态
    sortBy: 'newest', // 排序方式：newest, hottest, risk
  }),
  computed: {
    paginatedItems() {
      // 根据当前排序方式对数据进行排序
      let sortedItems = [...this.items];
      
      if (this.sortBy === 'hottest') {
        sortedItems.sort((a, b) => b.total - a.total);
      } else if (this.sortBy === 'risk') {
        sortedItems.sort((a, b) => b.rate - a.rate);
      }
      // newest 保持原有顺序
      
      // 分页处理
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return sortedItems.slice(start, end);
    }
  },
  watch: {
    sortBy() {
      // 排序变化时，重置到第一页
      this.page = 1;
    },
    items() {
      // 当 items 变化时重新计算总页数
      this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
      this.page = 1; // 重置到第一页
    }
  },
  async mounted() {
    this.searchLoading = true;
    await get({"keyword": '',  "uid": this.uid}).then(res => {
      this.items = res.data.data;
      this.allItems = [...res.data.data]; // 保存初始数据
      this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
      this.searchLoading = false;
    }).catch(err => {
      console.error(err);
      this.searchLoading = false;
    });
  },
  methods: {
    handleSearchResult(result) {
      this.searchLoading = true;
      this.lastSearchTerm = result.searchTerm || ''; // 保存搜索词
      this.isSearchActive = true;
      
      // 模拟异步搜索过程
      setTimeout(() => {
        this.items = result;
        this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
        this.page = 1;
        
        // 保存到最近搜索
        if (result.searchTerm && !this.recentSearches.includes(result.searchTerm)) {
          this.recentSearches.unshift(result.searchTerm);
          if (this.recentSearches.length > 10) {
            this.recentSearches.pop();
          }
        }
        
        this.searchLoading = false;
      }, 500);
    },
    
    resetSearch() {
      this.searchLoading = true;
      
      // 模拟异步重置过程
      setTimeout(() => {
        this.items = [...this.allItems]; // 恢复初始数据
        this.lastSearchTerm = '';
        this.isSearchActive = false;
        
        // 重置搜索框
        if (this.$refs.searchBox && typeof this.$refs.searchBox.resetSearch === 'function') {
          this.$refs.searchBox.resetSearch();
        }
        
        this.searchLoading = false;
      }, 300);
    },
    
    applyRecentSearch(term) {
      // 查找搜索框组件中的方法并调用
      if (this.$refs.searchBox && typeof this.$refs.searchBox.applySearch === 'function') {
        this.$refs.searchBox.applySearch(term);
      } else {
        // 如果搜索框组件没有提供方法，则做一个简单的模拟搜索
        this.searchLoading = true;
        this.lastSearchTerm = term;
        this.isSearchActive = true;
        
        get({"keyword": term, "uid": this.uid}).then(res => {
          this.items = res.data.data;
          this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
          this.searchLoading = false;
        }).catch(err => {
          console.error(err);
          this.searchLoading = false;
        });
      }
    },
    
    showPopularTopics() {
      this.searchLoading = true;
      get({"keyword": 'popular', "uid": this.uid}).then(res => {
        this.items = res.data.data;
        this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
        this.lastSearchTerm = '热门话题';
        this.isSearchActive = true;
        this.searchLoading = false;
      }).catch(err => {
        console.error(err);
        this.searchLoading = false;
      });
    },
    
    getKeywordsArray(keywords) {
      if (!keywords) return [];
      return keywords.split(',').map(k => k.trim());
    },
    
    getChipColor(rate) {
      if (rate > 60) return 'red';
      else if (rate > 45) return 'orange';
      else return 'deep-purple';
    },
    
    viewDetails(item) {
      console.log('查看详情:', item);
      // 这里可以实现查看详情的逻辑
    },
    
    shareItem(item) {
      console.log('分享:', item);
      // 这里可以实现分享的逻辑
    }
  }
}
</script>

<style scoped>
.library-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.search-card, .results-card {
  border: 1px solid rgba(103, 58, 183, 0.1);
  transition: all 0.3s ease;
}

.search-card:hover, .results-card:hover {
  box-shadow: 0 5px 15px rgba(103, 58, 183, 0.15) !important;
}

.deep-purple--text {
  color: #673ab7 !important;
}

.v-card__title {
  border-bottom: 1px solid rgba(103, 58, 183, 0.1);
}

.search-tips ul li {
  margin-bottom: 4px;
  color: #666;
}

.list-item-card {
  transition: transform 0.2s ease;
  border-left: 3px solid #673ab7 !important;
}

.list-item-card.on-hover {
  transform: translateX(5px);
  box-shadow: 0 3px 10px rgba(103, 58, 183, 0.15) !important;
}

.opacity-image {
  opacity: 0.7;
}

.grid-item-col {
  transition: transform 0.2s ease;
}

.grid-card {
  height: 100%;
  transition: all 0.3s ease;
}

.grid-card.on-hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(103, 58, 183, 0.2) !important;
}

/* 列表视图下的卡片高度固定 */
.list-card-content {
  min-height: 80px;
}

/* 动态加载动画 */
.v-skeleton-loader {
  border-radius: 8px;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .library-container {
    padding: 10px;
  }
  
  .search-tips {
    margin-top: 10px;
  }
}
</style>

<template>
  <v-card
      :loading="loading"
      class="data-card rounded-lg"
      :class="{'on-hover': hover}"
      max-width="374"
      elevation="2"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
  >
    <template slot="progress">
      <v-progress-linear
          color="deep-purple"
          height="4"
          indeterminate
      ></v-progress-linear>
    </template>

    <v-chip
      class="topic-chip mt-5 "
      color="deep-purple"
      text-color="white"
      small
      label
      absolute
      right
    >
      <v-avatar left>
        <v-icon small>{{ getRiskIcon(item) }}</v-icon>
      </v-avatar>
      {{ getRiskText(item) }}
    </v-chip>

    <v-card-title class="pa-2 pb-5 d-flex justify-center">
      <div class="topic-title deep-purple--text font-weight-medium text-center">
        {{ item.topics || item.keywords }}
      </div>
    </v-card-title>

    <v-card-subtitle class="px-4 pt-0 pb-3 text-center">
      <v-chip x-small label outlined color="grey lighten-1" class="mr-1">
        {{ formatDate(item.created_at || new Date()) }}
      </v-chip>
      <v-chip x-small label outlined color="deep-purple lighten-4">
        {{ item.keywords }}
      </v-chip>
    </v-card-subtitle>

    <v-divider class="mx-4"></v-divider>

    <v-card-text class="pa-4">
      <!-- 热度评分 -->
      <div class="mb-4">
        <div class="d-flex align-center">
          <div class="stat-label mr-2 text-body-2">热度评分:</div>
          <v-rating
              :value="item.positive_count/item.total*5"
              color="deep-purple"
              background-color="deep-purple lighten-3"
              empty-icon="mdi-fire"
              full-icon="mdi-fire"
              half-icon="mdi-fire"
              dense
              half-increments
              readonly
              size="18"
          ></v-rating>
          <div class="ml-2 text-caption font-weight-medium">
            {{ (item.positive_count/item.total*100).toFixed(0) }}%
          </div>
        </div>
        <div class="mt-1 text-caption grey--text text--darken-1">
          基于 {{item.positive_count}} 个积极评价 (总计 {{item.total}})
        </div>
      </div>

      <!-- 统计数据网格 -->
      <v-row dense>
        <v-col cols="6">
          <div class="stat-item">
            <v-icon size="20" color="deep-purple">mdi-account-group</v-icon>
            <span class="stat-value">{{ item.user_count }}</span>
            <span class="stat-label">评论人数</span>
          </div>
        </v-col>
        
        <v-col cols="6">
          <div class="stat-item">
            <v-icon size="20" color="deep-purple">mdi-thumb-up</v-icon>
            <span class="stat-value">{{ formatNumber(item.attitudes_count) }}</span>
            <span class="stat-label">点赞数</span>
          </div>
        </v-col>
        
        <v-col cols="6">
          <div class="stat-item">
            <v-icon size="20" color="deep-purple">mdi-comment-text</v-icon>
            <span class="stat-value">{{ formatNumber(item.comments_count) }}</span>
            <span class="stat-label">评论数</span>
          </div>
        </v-col>
        
        <v-col cols="6">
          <div class="stat-item">
            <v-icon size="20" color="deep-purple">mdi-repeat</v-icon>
            <span class="stat-value">{{ formatNumber(item.reposts_count) }}</span>
            <span class="stat-label">转发数</span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-actions class="pa-4">
      <v-btn
          color="deep-purple"
          text
          class="px-2"
          @click="getComments(item.topics && item.topics.trim() !== '' ? item.topics : item.keywords)"
      >
        <v-icon size="18" left>mdi-emoticon-outline</v-icon>
        <span class="button-text">情感分析</span>
      </v-btn>
      
      <v-spacer></v-spacer>
      
      <v-btn
          :color="fav_btn_outline ? 'grey' : 'amber'"
          :text="fav_btn_outline"
          :icon="!fav_btn_outline"
          class="px-2"
          @click="fav(item.id)"
      >
        <v-icon size="18" v-if="!fav_btn_outline">mdi-star</v-icon>
        <template v-else>
          <v-icon size="18" left>{{ fav_icon }}</v-icon>
          <span class="button-text">{{ fav_btn_text }}</span>
        </template>
      </v-btn>
    </v-card-actions>

    <!-- 情感分析对话框 -->
    <v-dialog
        v-model="dialog"
        scrollable
        max-width="900"
        transition="dialog-bottom-transition"
    >
      <v-card :loading="tableLoading">
        <v-card-title class="deep-purple white--text">
          <v-icon left color="white">mdi-chart-bubble</v-icon>
          微博情感分析
          <v-spacer></v-spacer>
          <v-btn icon color="white" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-subtitle class="pt-4">
          <div>话题: <strong>{{ item.topics || item.keywords }}</strong></div>
          <div class="mt-1">
            <v-chip small color="green" class="white--text mr-1">积极: {{ getPositiveComments() }}</v-chip>
            <v-chip small color="amber" class="white--text mr-1">中性: {{ getNeutralComments() }}</v-chip>
            <v-chip small color="red" class="white--text">消极: {{ getNegativeComments() }}</v-chip>
          </div>
        </v-card-subtitle>
        
        <v-card-text style="height: 400px">
          <div v-if="comments.length === 0 && !tableLoading" class="text-center my-5">
            <v-icon color="grey" x-large>mdi-emoticon-sad-outline</v-icon>
            <div class="grey--text mt-2">暂无微博评论数据</div>
          </div>
          
          <v-data-table
              v-else
              :headers="commentHeaders"
              :items="comments"
              :items-per-page="10"
              class="elevation-0"
              dense
          >
            <template v-slot:item.screen_name="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="24" class="mr-2">
                  <v-icon small>mdi-account</v-icon>
                </v-avatar>
                {{ item.screen_name }}
              </div>
            </template>
            
            <template v-slot:item.text="{ item }">
              <div class="text-caption">{{ item.text }}</div>
            </template>
            
            <template v-slot:item.label="{ item }">
              <v-chip 
                x-small 
                :color="getSentimentColor(item.label)" 
                dark
              >
                {{ item.label }}
              </v-chip>
            </template>
            
            <template v-slot:item.ip="{ item }">
              <div class="d-flex align-center">
                <v-icon x-small class="mr-1">mdi-map-marker</v-icon>
                {{ item.ip || '未知' }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import mixin from "../mixins/mixins";
import {getComments} from '@/api/weibo'
import {add, remove_by} from "@/api/fav";

export default {
  name: "m-card",
  props: {
    item: Object
  },
  mixins: [mixin],
  components: {},
  data: () => ({
    comments:[],
    loading: false,
    dialog: false,
    keyword: '',
    fav_icon: 'mdi-star',
    fav_btn_text: '订阅',
    tableLoading: false,
    fav_btn_outline: true,
    hover: false,
    commentHeaders: [
      { text: '用户', value: 'screen_name', width: '20%' },
      { text: '评论内容', value: 'text', width: '50%' },
      { text: '情感', value: 'label', width: '15%' },
      { text: '地点', value: 'ip', width: '15%' },
    ],
  }),
  mounted() {
    if(this.item.isFav!=1){
      this.fav_icon = 'mdi-star-outline'
      this.fav_btn_text = '订阅'
      this.fav_btn_outline = true
    }
    else{
      this.fav_icon = 'mdi-star'
      this.fav_btn_text = '已订阅'
      this.fav_btn_outline = false
    }
  },
  methods: {
    getComments(topic){
      this.tableLoading = true
      const form = {"topic": topic}
      getComments(form).then(res=>{
        this.comments = res.data.data
        if(this.comments.length == 0)
          this.$snackbar({content: '暂无微博评论数据！', top:true, center:true, color:'deep-purple',multiLine: true})
        this.tableLoading = false
      })
    },
    fav(id){
      if(this.fav_icon == 'mdi-star-outline'){
        const form = {"uid": this.uid, "iid": id}
        add(form).then(res=>{
          this.$snackbar({content: '订阅成功！', top:true, center:true,
            color:'deep-purple',multiLine: true})
          this.fav_icon = 'mdi-star'
          this.fav_btn_text = '已订阅'
          this.fav_btn_outline = false
        })
      }else{
        remove_by(this.uid, id).then(res=>{
          this.$snackbar({content: '取消订阅成功！', top:true, center:true,
            color:'deep-purple',multiLine: true})
          this.fav_icon = 'mdi-star-outline'
          this.fav_btn_text = '订阅'
          this.fav_btn_outline = true
        })
      }
    },
    formatNumber(num) {
      if (!num) return 0;
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
      }
      return num;
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getMonth()+1}月${d.getDate()}日`;
    },
    getSentimentColor(label) {
      if (label === '积极') return 'green';
      if (label === '消极') return 'red';
      return 'amber';
    },
    getPositiveComments() {
      return this.comments.filter(c => c.label === '积极').length;
    },
    getNeutralComments() {
      return this.comments.filter(c => c.label === '中性').length;
    },
    getNegativeComments() {
      return this.comments.filter(c => c.label === '消极').length;
    },
    getRiskIcon(item) {
      const riskScore = item.negative_count / item.total * 100;
      if (riskScore > 60) return 'mdi-alert-circle';
      if (riskScore > 40) return 'mdi-alert';
      return 'mdi-check-circle';
    },
    getRiskText(item) {
      const riskScore = item.negative_count / item.total * 100;
      if (riskScore > 60) return '高风险';
      if (riskScore > 40) return '中风险';
      return '低风险';
    }
  }
}
</script>

<style scoped>
.data-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(103, 58, 183, 0.1);
  height: 100%;
}

.data-card.on-hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(103, 58, 183, 0.2) !important;
}

.topic-title {
  font-size: 1rem;
  line-height: 1.5;
  max-height: 3rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  letter-spacing: 0.01em;
  word-spacing: 0.05em;
  width: 100%;
}

.topic-chip {
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px;
  border-radius: 8px;
  background: rgba(103, 58, 183, 0.05);
  margin-bottom: 8px;
  text-align: center;
}

.stat-value {
  font-weight: bold;
  font-size: 1.1rem;
  color: #673ab7;
  margin: 6px 0;
  letter-spacing: 0;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  letter-spacing: 0.03em;
  line-height: 1.2;
}

.button-text {
  letter-spacing: 0.02em;
  font-size: 0.9rem;
}

.deep-purple {
  background-color: #673ab7 !important;
}

.deep-purple--text {
  color: #673ab7 !important;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .data-card {
    max-width: 100%;
  }
  
  .stat-item {
    padding: 8px 4px;
  }
  
  .stat-value {
    font-size: 1rem;
    margin: 4px 0;
  }
  
  .topic-title {
    font-size: 0.95rem;
  }
}
</style>

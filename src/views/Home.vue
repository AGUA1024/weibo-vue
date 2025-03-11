<template>
  <v-container fluid class="home-container">
    <!-- 轮播图区域 -->
    <v-card class="carousel-card mb-8 rounded-lg elevation-4">
      <v-carousel
          height="350"
          cycle
          hide-delimiter-background
          show-arrows-on-hover
          delimiter-icon="mdi-circle-small"
          class="rounded-lg carousel-improved"
          interval="6000"
      >
        <v-carousel-item
            v-for="(item,i) in pics"
            :key="i"
            reverse-transition="fade-transition"
            transition="fade-transition"
        >
          <div class="carousel-content d-flex flex-column justify-center align-center">
            <div class="carousel-overlay"></div>
            <img :src="item.src" class="carousel-image" alt="轮播图片"/>
            <div class="carousel-text-container">
              <h2 class="carousel-title white--text text-h4 font-weight-bold">{{item.title || '舆情分析平台'}}</h2>
              <p class="carousel-subtitle text-subtitle-1 white--text font-weight-light">{{item.subtitle || '发现舆情趋势，洞察信息价值'}}</p>
              <v-btn color="deep-purple" class="mt-4" outlined dark>
                了解更多
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-card>

    <!-- 最热话题区域 -->
    <v-card class="section-card mb-8 rounded-lg elevation-2">
      <v-card-title class="deep-purple--text font-weight-bold d-flex align-center">
        <v-icon color="deep-purple" class="mr-2">mdi-trending-up</v-icon>
        {{titles[0]}}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3" sm="6" v-show="itemsShow"
                v-for="(i,index) in [1,2,3,4]" :key="index+100">
            <v-skeleton-loader
                class="mx-auto"
                max-width="450"
                type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="3" sm="6"
              v-for="(item, index) in items" :key="index">
            <house-card :item="item"/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 系统通知区域 -->
    <v-card class="section-card rounded-lg elevation-2">
      <v-card-title class="deep-purple--text font-weight-bold d-flex align-center">
        <v-icon color="deep-purple" class="mr-2">mdi-bell-ring</v-icon>
        系统通知
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div v-if="notices.length === 0" class="text-center py-5">
              <v-icon color="grey" x-large>mdi-bell-off</v-icon>
              <div class="grey--text mt-2">暂无系统通知</div>
            </div>
            <v-slide-y-transition group>
              <v-card v-for="(item, index) in notices" :key="index"
                      class="mb-3 notice-card"
                      outlined
                      hover
              >
                <v-card-title class="text-h6 py-2">
                  <v-icon color="amber" class="mr-2">mdi-bullhorn-variant</v-icon>
                  {{item.content}}
                </v-card-title>
                <v-card-subtitle class="text-start py-1 deep-purple--text text--lighten-4">
                  <v-icon small class="mr-1">mdi-account</v-icon>{{item.creator}} 
                  <v-icon small class="ml-2 mr-1">mdi-clock</v-icon>{{item.create_time}}
                </v-card-subtitle>
              </v-card>
            </v-slide-y-transition>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import HouseCard from "../components/DataCard";
import {getHot, } from "@/api/weibo";
import mixin from '../mixins/mixins'
import {query} from "../api/notice";

export default {
  mixins: [mixin],
  components: {  HouseCard },
  name: "Home",
  data: () => ({
    titles: ["最热话题"],
    items: [],
    notices : [],
    recs: [],
    recs2: [],
    itemsShow: true,
    recsShow: true,
    recs2Show: true,
    pics: [
      {
        src: require('../assets/images/b1.jpg'),
        title: '全面舆情分析',
        subtitle: '探索数据内在价值，把握舆论走向'
      },
      {
        src: require('../assets/images/b2.jpg'),
        title: '深度话题洞察',
        subtitle: '精准把握热点话题，提前预测舆论风向'
      },
      {
        src: require('../assets/images/b3.jpg'),
        title: '实时数据监控',
        subtitle: '第一时间获取反馈，应对舆情危机'
      },
      {
        src: require('../assets/images/b4.jpg'),
        title: '智能舆情预警',
        subtitle: '利用AI技术，提前预警可能的舆论风险'
      },
    ],
  }),
  async mounted() {
    console.log('当前登录uid:' + this.uid)
    await getHot(this.uid).then(res => {
      this.items = res.data.data
      // console.log(this.items)
      this.itemsShow = false
    })

    await query('', 1, 10).then(res=>{
      this.notices = res.data.data.records
    })
    // await getItemCF(this.uid).then(res => {
    //   // console.log(res.data)
    //   this.recs2 = res.data.data.datas
    //   this.recs2Show = false
    // })
    // await getUserCF(this.uid).then(res => {
    //   this.recs = res.data.data.datas
    //   this.recsShow = false
    // })
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.carousel-card {
  overflow: hidden;
  border: 1px solid rgba(103, 58, 183, 0.1);
  transition: all 0.3s ease;
  border-radius: 16px !important;
}

.carousel-card:hover {
  box-shadow: 0 8px 30px rgba(103, 58, 183, 0.2) !important;
  transform: translateY(-2px);
}

.carousel-improved {
  border-radius: 12px;
}

.carousel-content {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.carousel-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.carousel-content:hover .carousel-image {
  transform: scale(1.05);
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(103, 58, 183, 0.7),
    rgba(103, 58, 183, 0.3)
  );
  z-index: 1;
}

.carousel-text-container {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 80%;
  max-width: 800px;
  padding: 20px;
}

.carousel-title {
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-subtitle {
  margin-bottom: 20px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.section-card {
  border: 1px solid rgba(103, 58, 183, 0.1);
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 5px 15px rgba(103, 58, 183, 0.15) !important;
}

.section-card .v-card__title {
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(103, 58, 183, 0.1);
}

.notice-card {
  transition: all 0.2s ease;
  border-left: 3px solid #673ab7;
}

.notice-card:hover {
  transform: translateX(5px);
  box-shadow: 0 3px 10px rgba(103, 58, 183, 0.1) !important;
}

.deep-purple--text {
  color: #673ab7 !important;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #673ab7;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #512da8;
}

/* 轮播图标指示器样式 */
.v-carousel >>> .v-carousel__controls {
  background: transparent;
}

.v-carousel >>> .v-carousel__controls .v-btn {
  margin: 0 4px;
}

.v-carousel >>> .v-btn--active .v-btn__content i {
  color: #673ab7 !important;
}

/* 轮播图动画 */
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: opacity 0.5s;
}

.fade-transition-enter,
.fade-transition-leave-to {
  opacity: 0;
}
</style>

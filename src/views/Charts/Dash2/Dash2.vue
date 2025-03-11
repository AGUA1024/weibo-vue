<template>
  <v-container grid-list-lg pa-0 fluid="true">

    <v-layout wrap>
      <div class="primary--text font-weight-bold text-h5 d-flex justify-start my-6">
        热门话题
      </div>
      <v-row class=" ml-2">
        <div  v-for="item in items" :key="item.id">
          <v-chip :disabled="loading"
                  class="ma-2 "
                  color="teal" outlined
                  @click="getTopicInfo(item.id)"
          >
            {{ item.topics || item.keywords }}
          </v-chip>
        </div>
      </v-row>


      <v-flex xs12>
        <v-basic-card
            title="话题观点提取"
            toolbar-height="56"
        >
          <template slot="card-content">
            <top-chart  :datas1="this.opinions"/>
          </template>
        </v-basic-card>
      </v-flex>

      <v-flex
          xs12
          lg6
      >
        <v-basic-card
            title="关键词词频分析"
            toolbar-height="56"
        >
          <template slot="card-content">
            <base-pie-chart :datas1="this.keywords.textrank"/>
          </template>
        </v-basic-card>
      </v-flex>

      <v-flex
          xs12
          lg6
      >
        <v-basic-card
            title="关键词词频分析"
            toolbar-height="56"
        >
          <template slot="card-content">
            <base-pie-chart2 :datas1="this.keywords.tfidf"/>
          </template>
        </v-basic-card>
      </v-flex>


    </v-layout>
  </v-container>
</template>


<script>
import BasePieChart from "./charts/BasePieChart";
import BasePieChart2 from "./charts/BasePieChart2";
import TopChart from "./charts/TopChart";
import {getHot, getOpinions, getKeywords} from "@/api/weibo"
import mixin from "../../../mixins/mixins";

export default {
  name: 'VBarIndex',
  mixins: [mixin],
  components: {
    TopChart,
    BasePieChart, BasePieChart2,
  },
  data: () => ({
    items: [],
    opinions : [],
    keywords : [],
    loading : false,
  }),
  methods: {
    getTopicInfo(topic_name){
      this.loading = true
      getOpinions(topic_name).then(res=>{
        // console.log(res.data.data)
        this.opinions = res.data.data
        getKeywords(topic_name).then(res=>{
          // console.log(res.data.data)
          this.keywords = res.data.data
          this.loading = false
        })
      })
    }
  },
  mounted() {
    getHot(this.uid).then(res => {
      this.items = res.data.data
      console.log(this.items)
      let topics;
      // 如果是this.items不为空，则取第一个中的topics属性，如果topics属性是空，则取keywords属性
      if (this.items && this.items.length > 0) {
        const firstItem = this.items[0];
        if (firstItem.topics && firstItem.topics.length > 0) {
          topics = firstItem.topics;
        } else if (firstItem.keywords && firstItem.keywords.length > 0) {
          topics = firstItem.keywords;
        } else {
          topics = []; // 如果 topics 和 keywords 都为空，则设置为空数组
        }

        console.log('Topics or Keywords:', topics);
      } else {
        console.log('Items are empty');
      }

      this.getTopicInfo(topics)
      // console.log(res.data.data)
    })
  }
};
</script>

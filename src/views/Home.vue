<template>
  <v-container fluid>
    <div>
      <v-carousel
          cycle
          hide-delimiter-background
          show-arrows-on-hover
      >
        <v-carousel-item
            v-for="(item,i) in pics"
            :key="i"
            :src="item.src"
        ></v-carousel-item>
      </v-carousel>
    </div>
    <div  class="primary--text font-weight-bold text-h5 d-flex justify-start my-6">
      {{titles[0]}}
    </div>
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

    <div  class="primary--text font-weight-bold text-h5 d-flex justify-start my-6">
      系统通知
    </div>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-card v-for="(item, index) in notices" :key="index"
                class="mx-auto"
                outlined
        >
          <v-card-title class="text-h5">
            <v-icon color="amber">mdi-bullhorn-variant</v-icon>
            {{item.content}}</v-card-title>
          <v-card-subtitle class="text-start">{{item.creator}} {{item.create_time}}</v-card-subtitle>

        </v-card>
      </v-col>
    </v-row>
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
      },
      {
        src: require('../assets/images/b2.jpg'),
      },
      {
        src: require('../assets/images/b3.jpg'),
      },
      {
        src: require('../assets/images/b4.jpg'),
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

</style>

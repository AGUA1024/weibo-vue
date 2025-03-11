<template>
  <v-card
      :loading="loading"
      class="mx-auto my-12"
      max-width="374"
      min-height="300"
  >
    <template slot="progress">
      <v-progress-linear
          color="primary"
          height="10"
          indeterminate
      ></v-progress-linear>
    </template>

    <v-card-title>
      <span class="ml-3 card-title">
          {{ item.topics || item.keywords }}
      </span>
    </v-card-title>

    <v-card-text>
      <v-row
          align="center"
          class="mx-0"
      >
        <v-rating
            :value="item.positive_count/item.total*5"
            color="green"
            empty-icon="mdi-fire"
            full-icon="mdi-fire"
            half-icon="mdi-fire"
            dense
            half-increments
            readonly
            size="22"
        ></v-rating>

        <div class="grey--text ms-4">
          {{ (item.positive_count/item.total*100).toFixed(2) }} (微博热度:{{item.positive_count }})
        </div>
      </v-row>
      <v-row
          align="center"
          class="mx-0"
      >
        <div class="grey--text ms-4 d-block">
          <v-icon color="#4b4453"> mdi-comment-account </v-icon>
          评论人数： {{ item.user_count }}
        </div>
      </v-row>

      <v-row
          align="center"
          class="mx-0"
      >
        <div class="grey--text ms-4 d-block">
          <v-icon color="green"> mdi-thumb-up </v-icon>
          点赞数： {{ item.attitudes_count }}
        </div>
      </v-row>

      <v-row
          align="center"
          class="mx-0"
      >
        <div class="grey--text ms-4 d-block">
          <v-icon color="#0089ba"> mdi-comment-quote </v-icon>
          评论数： {{ item.comments_count }}
        </div>
      </v-row>
      <v-row
          align="center"
          class="mx-0"
      >
        <div class="grey--text ms-4 d-block">
          <v-icon color="blue">  mdi-repeat </v-icon>
          转发数： {{ item.reposts_count }}
        </div>
      </v-row>

      <v-row
          align="center"
          class="mx-0"
      >
        <div class="grey--text ms-4 d-block">
          <v-icon >   mdi-key-chain </v-icon>
          关键词： {{ item.keywords }}
        </div>
      </v-row>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-actions>

      <v-dialog
          v-model="dialog"
          scrollable
          max-width="1200"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              style="position: absolute; bottom: 5px;"
              @click="getComments(item.topics && item.topics.trim() !== '' ? item.topics : item.keywords)"
          >
            <v-icon>mdi-emoticon-outline</v-icon>
            情感分析
          </v-btn>
        </template>
        <v-card :loading="tableLoading">
          <v-card-title>微博评论</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 500px">
            <v-simple-table >
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">
                    用户(screen_name)
                  </th>
                  <th class="text-left">
                    评论(text)
                  </th>
                  <th class="text-left">
                    情感分类(label)
                  </th>
                  <th class="text-left">
                    地点
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="(item,index) in comments"
                    :key="index"
                >
                  <td>{{ item.screen_name }}</td>
                  <td>{{ item.text }}</td>
                  <td>
                    <div v-if="item.label=='积极'">
                      积极
                      <v-icon
                          large
                          color="green"
                      >
                        mdi-thumb-up
                      </v-icon>
                    </div>

                    <div v-if="item.label=='中性'">
                      中性
                      <v-icon
                          large
                          color="amber"
                      >
                        mdi-scale-balance
                      </v-icon>
                    </div>

                    <div v-if="item.label=='消极'">
                      消极
                      <v-icon
                          large
                          color="red"
                      >
                        mdi-thumb-down
                      </v-icon>
                    </div>
                  </td>
                  <td>{{ item.ip}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
                color="teal darken-1"
                text
                @click="dialog = false"
            >
              关闭
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
          color="secondary"
          :outlined="fav_btn_outline"
          style="position: absolute; bottom: 5px; left:120px;"
          @click="fav(item.id)"
      >
        <v-icon> {{fav_icon}} </v-icon>
        {{fav_btn_text}}
      </v-btn>
      <v-spacer></v-spacer>

    </v-card-actions>


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
  }),
  mounted() {
    // console.log(this.item.isLike)
    if(this.item.isFav!=1){
      this.fav_icon = 'mdi-star'
      this.fav_btn_text = '订阅'
      this.fav_btn_outline = false
    }
    else{
      this.fav_icon = 'mdi-star-outline'
      this.fav_btn_text = '取消订阅'
      this.fav_btn_outline = true
    }
  },
  methods: {
    getComments(topic){
      this.tableLoading = true
      // console.log("douban_id", id)
      const form = {"topic": topic}
      getComments(form).then(res=>{
        // console.log(res.data.data)
        this.comments = res.data.data
        if(this.comments.length == 0)
          this.$snackbar({content: '暂无微博评论数据！', top:true, center:true, color:'red',multiLine: true})
        this.tableLoading = false
      })
    },
    fav(id){
      if(this.fav_icon == 'mdi-star'){
        const form = {"uid": this.uid, "iid": id}
        add(form).then(res=>{
          this.$snackbar({content: '订阅成功！', top:true, center:true,
            color:'primary',multiLine: true})
          this.fav_icon = 'mdi-star-outline'
          this.fav_btn_text = '取消订阅'
          this.fav_btn_outline = true
        })
      }else{
        remove_by(this.uid, id).then(res=>{
          this.$snackbar({content: '取消订阅成功！', top:true, center:true,
            color:'primary',multiLine: true})
          this.fav_icon = 'mdi-star'
          this.fav_btn_text = '订阅'
          this.fav_btn_outline = false
        })
      }
    }
  }
}
</script>

<style scoped>
.bm-view {
  width: 450px;
  height: 100%;
}

.card-title {
  font-size: 16px;
  text-align: left;
}

</style>

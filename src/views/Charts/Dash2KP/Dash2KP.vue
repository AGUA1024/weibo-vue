<template>
  <v-container grid-list-lg pa-0 >
    <v-layout wrap>
      <v-autocomplete
          v-model="select"
          :loading="loading"
          :items="items"
          :search-input.sync="search"
          cache-items
          class="mx-2 col-3"
          flat
          hide-no-data
          hide-details
          label="输入收藏的话题名称"
          outlined
      ></v-autocomplete>

      <v-btn @click="save_as_word" color="amber"
             class="my-1 ml-3"> 生成报告  </v-btn>
      <v-flex xs12>
        <v-basic-card
            title="负面微博舆情趋势跟踪"
            toolbar-height="56"
        >
          <template slot="card-content">
            <big-data-line-chart :param="select"/>
          </template>
        </v-basic-card>
      </v-flex>

      <v-flex xs12>
        <v-basic-card
            title="微博帖子情感分析"
            toolbar-height="56"
        >
          <template slot="card-content">
              <bar-pie-chart :param="select"> </bar-pie-chart>
          </template>
        </v-basic-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import BarPieChart from "../Dash2KP/BarPieChart";
import {getFavTopics, getReport} from "@/api/weibo"
import BigDataLineChart from "../Dash2KP/LineBigDataChart";
import mixin from "@/mixins/mixins";
// 导出word
import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'

export default {
  mixins: [mixin],
  name: 'VBarIndex',
  components: {
    BigDataLineChart,
    BarPieChart},
  data: () => ({
    items: [],
    loading : false,
    search: null,
    select: '',
    states: [],
    sysdate: '',
    info: {},
    solution: '',
  }),
  watch: {
    search (val) {
      val && val !== this.select && this.querySelections(val)
    },
  },
  methods: {
    querySelections (v) {
      this.loading = true
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.states.filter(e => {
          return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
        })
        this.loading = false
      }, 500)
    },
    save_as_word(){
        //并且生成word的总结报告
        // console.log(this.scores)
        getReport(this.select).then(res=>{
          console.log(res.data.data)
          this.info = res.data.data
          if(this.info.trend < 0) this.solution = '建议：目前舆情呈现发展趋势，请及时采取措施'
          else if(this.info.trend > 0) this.solution = '建议：目前舆情呈现退散趋势，请继续关注'
          else this.solution = '建议：舆情发展平稳，请继续关注'
          console.log('info=>', this.info)
          let that = this
          // 读取并获得模板文件的二进制内容
          JSZipUtils.getBinaryContent('/module2.docx', function(error, content) {
            // model.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
            // 抛出异常
            if (error) {
              throw error
            }
            // 创建一个PizZip实例，内容为模板的内容
            let zip = new PizZip(content)
            // 创建并加载docxtemplater实例对象
            let doc = new docxtemplater().loadZip(zip)
            // 设置模板变量的值
            doc.setData({
              // score: that.scores,
              // elements_list2: that.elements_list2,
              // c_speicals: that.c_speicals,
              topic: that.select || '未选择主题',
              realname: that.realname,
              sysdate: that.sysdate,
              z_count: that.info.z_count,  //中性
              c_count: that.info.c_count,
              p_count: that.info.p_count,
              n_count: that.info.n_count,
              rate: parseInt (( that.info.n_count / that.info.c_count) * 100),
              trend: that.info.trend>=0?'下降':'上升',
              solution: that.solution,
            })
            try {
              // 用模板变量的值替换所有模板变量
              doc.render()
            } catch (error) {
              // 抛出异常
              let e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties
              }
              console.log(JSON.stringify({ error: e }))
              throw error
            }
            // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
            let out = doc.getZip().generate({
              type: 'blob',
              mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            })
            // 将目标文件对象保存为目标类型的文件，并命名
            saveAs(out, '舆情分析报告_' + that.select +'_'+that.sysdate +'.docx')
          })


        })

          },
    getDate () {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()

      return year +"年"+ month +"月"+ day + "日"
    },
  },
  mounted() {
    this.sysdate = this.getDate()


    getFavTopics(this.uid).then(res=>{
      // console.log('topics=>', res.data)
      this.items = res.data.data.map(i=>{
        // 注意这个要根据实际返回的字段修改的
        return i.topics || i.keywords
      })
    })
  }
};
</script>

<style scoped>
.custom-background >>> .v-input__control {
  background-color: #f0f0f0 !important; /* 设置为你想要的淡色 */
}
</style>

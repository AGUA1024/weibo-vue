<template>
  <div class="home">
    <v-card>
      <v-card-title>
        微博文章舆情
        <v-spacer></v-spacer>
        <v-text-field
            v-model="options.keyword"
            append-icon="mdi-magnify"
            label="搜索个文章"
            hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="datas"
          :options.sync="options"
          :server-items-length="total"
          :loading="loading"
          :search="options.keyword"
          class="elevation-1"
          dense
      >
        <template v-slot:item.rate="{ item }">
          <v-chip
              :color="getColor(item.rate)"
              dark >
            {{ item.rate }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import {getArticle} from "@/api/weibo";
import mixin from "../../mixins/mixins";
import {like} from "../../api/user";

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
      headers: [
        {
          text: '微博话题/主题',
          align: 'start',
          sortable: false,
          value: 'topics',
        },
        {text: '总讨论数', value: 'total'},
        {text: '关键词', value: 'keywords'},
        {text: '舆情指数', value: 'rate',width: 100},
      ],
      hloading: false,
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
    getDataFromApi() {
      this.loading = true
      const {sortBy, sortDesc, page, itemsPerPage, keyword} = this.options
      getArticle(this.uid, page, itemsPerPage, keyword).then(res => {
        console.log(res)
        this.datas = res.data.data.data
        this.total = res.data.data.total
        this.loading = false
      })
      // this.fakeApiCall().then(data => {
      //   this.desserts = data.items
      //   this.totalDesserts = data.total
      //   this.loading = false
      // })
    },
    /**
     * In a real application this would be a call to fetch() or axios.get()
     */
    fakeApiCall() {
      return new Promise((resolve, reject) => {
        const {sortBy, sortDesc, page, itemsPerPage} = this.options

        let items = this.getDesserts()
        const total = items.length

        if (sortBy.length === 1 && sortDesc.length === 1) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy[0]]
            const sortB = b[sortBy[0]]

            if (sortDesc[0]) {
              if (sortA < sortB) return 1
              if (sortA > sortB) return -1
              return 0
            } else {
              if (sortA < sortB) return -1
              if (sortA > sortB) return 1
              return 0
            }
          })
        }

        if (itemsPerPage > 0) {
          items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
        }

        setTimeout(() => {
          resolve({
            items,
            total,
          })
        }, 1000)
      })
    },

    getColor(value) {
      if (value > 60) return 'red'
      else if (value > 45) return 'orange'
      else return 'green'
    },
  },
}
</script>

<style scoped>

</style>

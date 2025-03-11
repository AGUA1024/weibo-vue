<template>
  <div class="notice-container">
    <v-card class="elevation-2 rounded-lg notice-card">
      <v-card-title class="deep-purple--text">
        <v-icon color="deep-purple" class="mr-2">mdi-bell-ring</v-icon>
        通知管理
        <v-btn
            color="deep-purple"
            class="pa-2 ml-3"
            dark
            elevation="2"
            @click.prevent="addItem"
        >
          <v-icon dark left>
            mdi-plus
          </v-icon>
          新增通知
        </v-btn>

        <v-spacer></v-spacer>

        <v-text-field
            v-model="options.keyword"
            append-icon="mdi-magnify"
            label="按照关键词搜索"
            single-line
            hide-details
            color="deep-purple"
            dense
            class="search-field"
        ></v-text-field>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :server-items-length="total"
          :options.sync="options"
          :items="datas"
          :search="search"
          class="elevation-0"
          :footer-props="{
            'items-per-page-options': [10, 15, 20],
            'items-per-page-text': '每页显示',
          }"
      >
        <template v-slot:item.cover="{ item }">
          <v-avatar
              tile>
            <img
                :src="getImg(item.cover)"
                alt="picture"
            >
          </v-avatar>
        </template>
        
        <template v-slot:item.create_time="{ item }">
          <div class="grey--text text--darken-1">{{ item.create_time }}</div>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <v-icon
              small
              class="mr-2"
              color="deep-purple"
              @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
              color="red"
              small
              @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        
        <template v-slot:top>
          <v-dialog
              v-model="dialog"
              max-width="800px"
          >
            <v-card>
              <v-card-title class="deep-purple white--text">
                <span class="text-h5">{{ dialogTitle }}</span>
              </v-card-title>

              <v-card-text class="pt-5">
                <v-container>
                  <v-row>
                    <!-- 第一行 -->
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.creator"
                          label="创建者"
                          outlined
                          color="deep-purple"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.create_time"
                          label="创建时间"
                          outlined
                          color="deep-purple"
                      ></v-text-field>
                    </v-col>

                    <!-- 第二行 -->
                    <v-col
                        cols="12"
                    >
                      <v-text-field
                          v-model="editedItem.content"
                          label="通知内容"
                          outlined
                          color="deep-purple"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="grey darken-1"
                    text
                    @click="close"
                >
                  取消
                </v-btn>
                <v-btn
                    color="deep-purple"
                    text
                    @click="save"
                >
                  保存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import {query, add, remove, update} from "@/api/notice";
import mixin from "../../mixins/mixins";
import {getCurrentDate} from "../../api/utis";

export default {
  name: "CRUDList",
  mixins: [mixin],
  data() {
    return {
      search: '',
      total: 0,
      loading: true,
      options: {},
      datas: [],
      menu: false,
      headers: [
        {
          text: 'id',value: 'id',
          align: 'start', sortable: true,
        },
        {text: '通知内容', value: 'content'},
        {text: '创建者', value: 'creator'},
        {text: '时间', value: 'create_time'},
        {text: '操作', value: 'actions', sortable: false, width: '100px'}
      ],

      dialogTitle: '',
      dialog: false,
      editedItem: {},
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
  async mounted() {
    await this.getDataFromApi()
  },
  methods: {
      getImg(i){
          console.log(i)
          if(i!=null && i!='')
              return 'https://images.weserv.nl/?url=' + i
          else
              return require("@/assets/nologo.png")
      },
    getDataFromApi() {
      this.loading = true
      const {sortBy, sortDesc, page, itemsPerPage, keyword} = this.options
      query(keyword, page, itemsPerPage).then(res => {
        // console.log(res.data.data)
        this.datas = res.data.data.records
        this.total = res.data.data.total
        this.loading = false
      })
      // this.fakeApiCall().then(data => {
      //   this.desserts = data.items
      //   this.totalDesserts = data.total
      //   this.loading = false
      // })
    },
    addItem(){
      this.dialogTitle = '新增'
      this.editedItem = Object.assign({}, {})
      this.editedItem.creator = this.realname
      this.editedItem.create_time = getCurrentDate()
      this.dialog = true
    },
    editItem (item) {
      this.dialogTitle = '修改'
      this.editedIndex = this.datas.indexOf(item) //这个属性目前未使用
      this.editedItem = Object.assign({}, item)
      // console.log(this.realname)
      this.editedItem.creator = this.realname
      this.editedItem.create_time = getCurrentDate()
      this.dialog = true
    },
    deleteItem (item) {
      const id = item.id
      remove(id).then(res=>{
        this.$snackbar({content: res.data.msg, top: true, center: true, color: 'green', multiLine: true})
        this.getDataFromApi()
      })
    },
    save(){
      // console.log(this.editedItem.id == undefined)
      if(this.editedItem.id == undefined){
        add(this.editedItem).then(res=>{
          this.$snackbar({content: res.data.msg, top: true, center: true, color: 'green', multiLine: true})
          this.getDataFromApi()
          this.close()
        })
      }else{
        update(this.editedItem).then(res=>{
          this.$snackbar({content: res.data.msg, top: true, center: true, color: 'green', multiLine: true})
          this.getDataFromApi()
          this.close()
        })
      }
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, {})
        this.editedIndex = -1
      })
    },
  }
}
</script>

<style scoped>
.notice-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.notice-card {
  border: 1px solid rgba(103, 58, 183, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.notice-card:hover {
  box-shadow: 0 5px 15px rgba(103, 58, 183, 0.15) !important;
}

.deep-purple {
  background-color: #673ab7 !important;
}

.deep-purple--text {
  color: #673ab7 !important;
}

.search-field {
  max-width: 300px;
}

.v-data-table >>> th {
  background-color: rgba(103, 58, 183, 0.05) !important;
}

.v-data-table >>> .v-data-footer {
  border-top: 1px solid rgba(103, 58, 183, 0.1);
}
</style>

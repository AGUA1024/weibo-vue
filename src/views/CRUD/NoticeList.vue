<template>
  <v-card>
    <v-card-title>
      通知管理

            <v-btn
                color="primary"
                class="pa-2 ml-3"
                @click.prevent="addItem"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
              新增
            </v-btn>

      <v-spacer></v-spacer>

      <v-text-field
          v-model="options.keyword"
          append-icon="mdi-magnify"
          label="按照 关键词 搜索"
          single-line
          hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :server-items-length="total"
        :options.sync="options"
        :items="datas"
        :search="search"
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
      <template v-slot:top>
        <v-dialog
            v-model="dialog"
            max-width="800px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ dialogTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>

<!--                  第一行-->

                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.creator"
                        label="创建者"
                        outlined
                        color="secondary"
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
                        color="secondary"
                    ></v-text-field>
                  </v-col>

                  <!--     第二行-->

                  <v-col
                      cols="12"
                      sm="12"
                      md="12"
                  >
                    <v-text-field
                        v-model="editedItem.content"
                        label="通知内容"
                        outlined
                        color="secondary"
                    ></v-text-field>
                  </v-col>



                    <!--                  第三行-->


<!--                  第四行-->

                        <!--                  第五行-->

                    <!--                  第六行-->


                </v-row>

              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
              >
                取消
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
              >
                保存
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            color="blue"
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

    </v-data-table>
  </v-card>
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

</style>

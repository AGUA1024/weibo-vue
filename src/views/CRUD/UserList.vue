<template>
  <v-card>
    <v-card-title>
      用户管理

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
          label="按照 用户名or姓名 搜索"
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
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.username"
                        label="用户名"
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
                        v-model="editedItem.realname"
                        label="姓名"
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
                        v-model="editedItem.phone"
                        label="电话"
                        outlined
                        color="secondary"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="12"
                      md="8"
                  >
                    <v-text-field
                        outlined
                        v-model="editedItem.intro"
                        label="描述"
                        color="secondary"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.email"
                        label="邮箱"
                        outlined
                        color="secondary"
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      sm="8"
                      md="8"
                      class="d-inline"
                  >
                    <v-radio-group
                        v-model="editedItem.roles"
                        label="权限："
                        row
                    >
                      <v-radio
                          label="前台用户"
                          value="normal"
                      ></v-radio>
                      <v-radio
                          label="后台管理员"
                          value="admin"
                      ></v-radio>
                      <v-radio
                          label="超级管理员"
                          disabled
                          value="sadmin"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>


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
            color="warning"
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
import {list, add, del, modify} from "../../api/user";
import {getVRole} from "../../api/vrole";

export default {
  name: "UserList",
  data() {
    return {
      search: '',
      total: 0,
      loading: true,
      options: {},
      datas: [],
      headers: [
        {
          text: 'id',
          align: 'start', sortable: true,
          value: 'id',
        },
        {text: '用户名', value: 'username'},
        {text: '姓名', value: 'realname'},
        {text: '电话', value: 'phone'},
        {text: '邮箱', value: 'email'},
        {text: '介绍', value: 'intro'},
        {text: '权限', value: 'roles'},
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
    getDataFromApi() {
      this.loading = true
      const {sortBy, sortDesc, page, itemsPerPage, keyword} = this.options
      list(keyword, page, itemsPerPage).then(res => {
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
      this.editedItem = Object.assign({}, {})
      this.dialog = true
    },
    editItem (item) {
      this.editedIndex = this.datas.indexOf(item) //这个属性目前未使用
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      del(item).then(res=>{
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
        modify(this.editedItem).then(res=>{
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

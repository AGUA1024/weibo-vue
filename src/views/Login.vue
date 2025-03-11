<template>
  <v-app>
  <v-container id="login-all">
    <v-row align="center" justify="center" class="mt-12">
      <v-col class="loginContainer" cols="12" sm="9">
        <v-card style="opacity:0.8;" class="elevation-6 mt-12">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card-text class="mt-12">
                    <h1 class="text-center">
                      <svg-icon color="indigo"  :icon-class="appIcon" />
                      {{appName}}舆情分析平台登录
                    </h1>
                    <h3
                        class="text-center  grey--text mt-4"
                    >登录开始一天的进步 <br></h3>
                    <v-row align="center" justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                            label="用户名"
                            outlined
                            dense
                            color="primary"
                            autocomplete="false"
                            class="mt-16"
                            v-model="username"
                        />
                        <v-text-field
                            label="密码"
                            outlined
                            dense
                            color="primary"
                            autocomplete="false"
                            type="password"
                            v-model="password"

                        />
                        <v-row>
                          <v-col cols="12" sm="7">
                            <v-checkbox

                                label="记住我"
                                class="mt-n1"
                                color="primary"
                            ></v-checkbox>
                          </v-col>
                          <v-col cols="12" sm="5">
                            <span class="caption blue--text">忘记密码</span>
                          </v-col>
                        </v-row>
                        <v-btn color="primary" dark block tile @click="login()">登录</v-btn>


                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="6" class="primary rounded-bl-xl">
                  <div style="  text-align: center; padding: 180px 0;">
                    <v-card-text class="white--text">
                      <h2 class="text-center ">还没账号啊?</h2>
                      <h4
                          class="text-center"
                      >Let's 先注册一个<br> 点击下方</h4>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn tile outlined dark @click="step++">注册</v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row>
                <v-col cols="12" md="6" class="secondary rounded-br-xl">
                  <div style="  text-align: center; padding: 180px 0;">
                    <v-card-text class="white--text">
                      <h3 class="text-center ">已注册?</h3>
                      <h6
                          class="text-center"
                      >回到登录页面<br> 点击下方</h6>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn tile outlined dark @click="step--;">登录</v-btn>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card-text class="mt-12">
                    <h1
                        class="text-center"
                    >注册一个账号</h1>
                    <h6
                        class="text-center  grey--text mt-2"
                    >快来体验超牛的新款vue框架下的 <br>
                      超拽效果吧</h6>
                    <v-row align="center" justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                                label="昵称"
                                outlined
                                dense
                                color="secondary"
                                autocomplete="false"
                                class="mt-4"
                                v-model="realname"
                        />
                        <v-text-field
                            label="用户名"
                            outlined
                            dense
                            color="secondary"
                            autocomplete="false"
                            v-model="username"
                        />
                        <v-text-field
                            label="密码"
                            outlined
                            dense
                            color="blue"
                            autocomplete="false"
                            type="password"
                            v-model="password"
                        />
                        <v-row>
                          <v-col cols="12" sm="7">
                            <v-checkbox

                                label="同意"
                                class="mt-n1"
                                color="blue"
                            ></v-checkbox>
                          </v-col>
                          <v-col cols="12" sm="5">
                            <span class="caption blue--text ml-n4">用户协议</span>
                          </v-col>
                        </v-row>
                        <v-btn color="secondary" dark block tile @click="register()">注册</v-btn>


                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
      <div class="video-bg">
        <video width="320" height="240" autoplay loop muted>
          <source src="../assets/video/login.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    </v-row>
  </v-container>
<!-- 挂备案号 -->
<!--    <v-footer class="footer"><a :href="icp_link" target="_blank">{{icp}}</a></v-footer>-->
  </v-app>
</template>

<script>

import {login, register} from "../api/user";
import mixin from '../mixins/mixins'

export default {
  mixins: [mixin],
  data: () => ({

    step: 1,
    vedioCanPlay: false,
    showVideo: true,
    username: '',
    password: '',
    realname: '',
  }),
  props: {
    source: String
  },
  mounted: function () {
  },
  methods: {
    canplay() {
      this.vedioCanPlay = true
    },
    login() {
      if(this.username == "" || this.password == ""){
        this.$snackbar({content: '表单数据未填写完整', top:true, center:true, color:'red',multiLine: true})
        return false
      }

      const loginForm = {"username": this.username, "password": this.password}
      login(loginForm).then(res=>{
        const {data} = res
        if(data.code != 0)
          this.$snackbar({content: data.msg, top:true, center:true, color:'red',multiLine: true})
        else {
          // localStorage.setItem('uid', data.data)
          this.$store.dispatch('setUserInfo', data.data)
          this.$snackbar({content: '登录成功', top:true, center:true, color:'green',multiLine: true})
          this.$router.push('/home')
        }
      })
    },
    register(){
      if(this.username == "" || this.password == "" || this.realname == ""){
        this.$snackbar({content: '表单数据未填写完整', top:true, center:true, color:'red',multiLine: true})
        return false
      }

      const registForm = {"username": this.username, "password": this.password, "realname": this.realname}
      register(registForm).then(res=>{
        const {data} = res
        if(data.code != 0)
          this.$snackbar({content: data.msg, top:true, center:true, color:'red',multiLine: true})
        else {
          this.$snackbar({content: '注册成功', top:true, center:true, color:'green',multiLine: true})
        }
      })
    }
  }
}
</script>
<style scoped>
.v-application .rounded-bl-xl {
  border-bottom-left-radius: 250px !important;
}

.v-application .rounded-br-xl {
  border-bottom-right-radius: 250px !important;
}

.video-bg {
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.video-bg video {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
}

.loginForm{
  background-color: darkseagreen;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 0;
  background-image: linear-gradient(
    90deg,
    orchid,
    purple,
    cyan,
    lightblue
  );
  background-size: 400%;
  animation: myanimation 10s infinite;
}

@keyframes myanimation{
  0%{
    background-position: 0% 50%;
  }
  50%{
    background-position: 100% 50%;
  }
  100%{
    background-position: 0% 50%;
  }
}
</style>
<style lang="stylus">
.loginContainer
  z-index :1;
</style>

<template>
  <v-app>
  <v-container id="login-all" fluid>
    <div class="purple-gradient-bg"></div>
    <v-row align="center" justify="center" class="fill-height">
      <v-col class="loginContainer" cols="12" sm="10" md="8" lg="7">
        <v-card style="opacity:0.95;" class="elevation-16 login-card">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card-text class="mt-12">
                    <h1 class="text-center deep-purple--text text-h4 font-weight-bold">
                      <svg-icon color="deep-purple" :icon-class="appIcon" class="icon-pulse"/>
                      <span class="ml-2">{{appName}}舆情分析平台</span>
                    </h1>
                    <div class="text-divider"><span>安全登录</span></div>
                    <h3
                        class="text-center grey--text mt-4"
                    >登录开始一天的进步 <br></h3>
                    <v-row align="center" justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                            label="用户名"
                            outlined
                            dense
                            color="deep-purple"
                            autocomplete="false"
                            class="mt-8 input-hover-effect"
                            v-model="username"
                            prepend-inner-icon="mdi-account"
                        />
                        <v-text-field
                            label="密码"
                            outlined
                            dense
                            color="deep-purple"
                            autocomplete="false"
                            type="password"
                            v-model="password"
                            prepend-inner-icon="mdi-lock"
                            class="input-hover-effect"
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
                            <span class="caption deep-purple--text pointer-cursor">忘记密码</span>
                          </v-col>
                        </v-row>
                        <v-btn color="deep-purple" dark block rounded @click="login()" class="elevation-3 mt-4 login-btn" height="45">
                          <v-icon left>mdi-login</v-icon>登录
                        </v-btn>


                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="6" class="deep-purple rounded-bl-xl login-side-panel">
                  <div class="side-panel-content">
                    <v-card-text class="white--text text-center">
                      <h3 class="text-h5 font-weight-bold mb-3">加入我们</h3>
                      <p class="subtitle-1">立即注册获取完整的舆情分析体验</p>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn rounded outlined dark @click="step++" class="px-6 py-2">
                        <v-icon left>mdi-account-plus</v-icon>注册账号
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row>
                <v-col cols="12" md="6" class="deep-purple darken-1 rounded-br-xl login-side-panel">
                  <div class="side-panel-content">
                    <div class="side-panel-image mb-6">
                      <v-img src="https://cdn.pixabay.com/photo/2017/10/27/15/52/jaguar-2894706_960_720.jpg" max-width="180" class="mx-auto rounded-circle elevation-5"></v-img>
                    </div>
                    <v-card-text class="white--text text-center">
                      <h3 class="text-h5 font-weight-bold mb-3">已有账号?</h3>
                      <p class="subtitle-1">返回登录页面继续您的分析工作</p>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn rounded outlined dark @click="step--;" class="px-6 py-2">
                        <v-icon left>mdi-login</v-icon>返回登录
                      </v-btn>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card-text class="mt-12">
                    <h1 class="text-center deep-purple--text text-h4 font-weight-bold mb-4">创建新账户</h1>
                    <div class="text-divider"><span>填写信息</span></div>
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
                                color="deep-purple"
                                autocomplete="false"
                                class="mt-4 input-hover-effect"
                                v-model="realname"
                                prepend-inner-icon="mdi-badge-account"
                        />
                        <v-text-field
                            label="用户名"
                            outlined
                            dense
                            color="deep-purple"
                            autocomplete="false"
                            v-model="username"
                            prepend-inner-icon="mdi-account"
                            class="input-hover-effect"
                        />
                        <v-text-field
                            label="密码"
                            outlined
                            dense
                            color="deep-purple"
                            autocomplete="false"
                            type="password"
                            v-model="password"
                            prepend-inner-icon="mdi-lock"
                            class="input-hover-effect"
                        />
                        <v-row>
                          <v-col cols="12" sm="7">
                            <v-checkbox

                                label="同意"
                                class="mt-n1"
                                color="deep-purple"
                            ></v-checkbox>
                          </v-col>
                          <v-col cols="12" sm="5">
                            <span class="caption deep-purple--text ml-n4 pointer-cursor">用户协议</span>
                          </v-col>
                        </v-row>
                        <v-btn color="deep-purple darken-1" dark block rounded @click="register()" class="elevation-3 login-btn" height="45">
                          <v-icon left>mdi-account-plus</v-icon>注册
                        </v-btn>


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
  z-index: -1;
}

.video-bg video {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
}

.purple-gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(135deg, #9c27b0, #673ab7, #5e35b1, #512da8);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  z-index: -2;
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
    #9c27b0,
    #673ab7,
    #7e57c2,
    #b39ddb
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

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 添加的新样式 */
.v-card {
  border-radius: 15px !important;
  box-shadow: 0 8px 20px rgba(103, 58, 183, 0.2) !important;
  overflow: hidden;
}

.login-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(103, 58, 183, 0.3) !important;
}

.v-btn {
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(103, 58, 183, 0.3) !important;
}

.login-btn {
  font-weight: bold;
  transition: all 0.3s ease;
}

.deep-purple--text {
  color: #673ab7 !important;
}

.text-divider {
  display: flex;
  align-items: center;
  color: #9e9e9e;
  margin: 15px 0;
}

.text-divider::before, .text-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(103, 58, 183, 0.2);
}

.text-divider span {
  padding: 0 10px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.input-hover-effect:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}

.icon-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pointer-cursor {
  cursor: pointer;
}

.login-side-panel {
  position: relative;
  overflow: hidden;
}

.side-panel-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.side-panel-image {
  transition: all 0.5s ease;
}

.side-panel-image:hover {
  transform: scale(1.05);
}

.login-side-panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(103, 58, 183, 0.7), rgba(124, 77, 255, 0.7));
}

.floating-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: floatAnimation 15s infinite linear;
}

.shape1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape2 {
  width: 100px;
  height: 100px;
  top: 70%;
  left: 20%;
  animation-delay: 2s;
}

.shape3 {
  width: 150px;
  height: 150px;
  top: 40%;
  left: 80%;
  animation-delay: 5s;
}

.shape4 {
  width: 80px;
  height: 80px;
  top: 80%;
  left: 70%;
  animation-delay: 8s;
}

@keyframes floatAnimation {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}

.fill-height {
  height: 100vh;
}
</style>
<style lang="stylus">
.loginContainer
  z-index: 1;
  
#login-all
  background: rgba(103, 58, 183, 0.05);
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
</style>

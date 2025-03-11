<template>
  <v-app id="app" class="deep-purple lighten-5" >
    <v-app-bar color="white" elevation="1" app class="py-4">
      <v-icon class="mb-6 deep-purple--text"  @click.stop="drawerMenuClick" v-if="screenIsSmall"
      >$menu</v-icon
      >
      <v-row justify="space-between" v-if="!screenIsSmall">
        <v-toolbar-title class="text-uppercase deep-purple--text">
          <!-- 可以添加标题 -->
        </v-toolbar-title>

        <v-col md="2" cols="12">
          <v-badge
              bottom
              color="deep-purple"
              overlap
              offset-x="12"
              offset-y="12"
              class="ms-4"
              dot
          >
            <v-avatar
                size="40px"
            >
              <v-img :src="avatar"></v-img>
            </v-avatar>
          </v-badge>

          <v-btn text @click="logout" color="deep-purple">
            <span>退出</span>
            <v-icon right>exit_to_app</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-navigation-drawer
        width="230"
        v-model="drawer"
        color="white"
        app
        :mini-variant="miniDrawer"
        class="navigation-drawer"
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon size="35" v-if="!miniDrawer" color="deep-purple">mdi-sina-weibo</v-icon>
            <v-icon size="20" class="mr-2 deep-purple--text" v-else @click.stop="drawerMenuClick"
            >$menu</v-icon
            >
          </v-list-item-avatar>
          <v-list-item-title class="deep-purple--text font-weight-bold">{{appName}}舆情</v-list-item-title>
          <v-list-item-action>
            <v-icon @click.stop="drawerMenuClick" class="deep-purple--text">$menu</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider class="mx-auto deep-purple lighten-3"></v-divider>
      <v-list nav color="transparent" flat class="mt-3">
        <v-list-item
            v-for="(navItem, index) in navItems"
            :key="index"
            class="pr-6 my-1"
            link
            exact
            :to="navItem.link"
            exact-active-class="active-nav-link"
        >
          <v-tooltip nudge-right="8" right :z-index="miniDrawer ? 900000 : -5">
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="mr-6">{{
                  navItem.icon
                }}</v-icon>
              <span>{{ navItem.title }}</span>
            </template>
            <span>{{ navItem.title }}</span>
          </v-tooltip>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="mb-16 pb-16 mx-md-10 mx-3">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import mixin from "../../mixins/mixins";

export default {
  name: "AppLayout",
  mixins: [mixin],
  data: ()=>({
    drawer: true,
    miniDrawer: false,
    navItems: [
      {
        title: "主页",
        icon: "mdi-home",
        link: "/home",
      },
      {
        title: "搜索",
        icon: "mdi-cube",
        link: "/library",
      },

      {
        title: "数据大屏",
        icon: "mdi-monitor-screenshot",
        link: "/dash1c",
      },
      {
        title: "关键词分析",
        icon: "mdi-file-word-box",
        link: "/dash2",
      },
      {
        title: "数据分析",
        icon: "mdi-chart-areaspline",
        link: "/dash2k",
      },
      {
        title: "话题跟踪",
        icon: "mdi-emoticon-wink",
        link: "/dash2kp",
      },
      {
        title: "词云分析",
        icon: "mdi-file-word-box",
        link: "/dash3",
      },
      {
        title: "文本舆情分析",
        icon: "mdi-wordpress",
        link: "/predict",
      },
      {
        title: "微博舆情",
        icon: "mdi-sina-weibo",
        link: "/yuqing",
      },
      {
        title: "设置",
        icon: "mdi-cog",
        link: "/settings",
      },

    ],
    adminNavItems: [{
      title: "通知管理",
      icon: "mdi-bulletin-board",
      link: "/notices",
    }],
  }),
  mounted() {
    console.log('roles:' + this.roles)
    if(this.roles=='admin'){
      // this.navItems = this.adminNavItems
    }
  },
  methods: {
    drawerMenuClick() {
      if (this.screenIsSmall) {
        this.miniDrawer = false;
        this.drawer = !this.drawer;
      } else {
        this.miniDrawer = !this.miniDrawer;
      }
    },
    logout() {
      console.log('注销')
      localStorage.removeItem('uid')
      localStorage.removeItem('roles')
      this.$router.push('/')
    }
  },
}
</script>

<style>
svg {
  fill: currentColor;
}
path {
  fill: currentColor;
}
#app {
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.active-nav-link {
  color: #673ab7 !important;
  background-color: rgba(103, 58, 183, 0.1);
  border-right: 3px solid #673ab7;
}
.d-hidden {
  opacity: 0;
}

.navigation-drawer {
  border-right: 1px solid rgba(103, 58, 183, 0.1);
}

.deep-purple--text {
  color: #673ab7 !important;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

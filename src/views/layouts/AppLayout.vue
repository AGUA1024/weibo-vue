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
            v-for="(navItem, index) in navItems.filter(item => !item.children)"
            :key="index"
            class="pr-6 my-2 menu-item"
            link
            exact
            :to="navItem.link"
            exact-active-class="active-nav-link"
        >
          <v-list-item-icon class="mr-3 my-0 align-self-center">
            <v-icon>{{ navItem.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content class="py-0">
            <v-list-item-title>{{ navItem.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
            v-for="(navItem, index) in navItems.filter(item => item.children)"
            :key="`group-${index}`"
            no-action
            class="my-1 folder-group"
            color="deep-purple"
        >
          <template v-slot:activator>
            <v-list-item-icon class="mr-3 my-0 align-self-center">
              <v-icon>{{ navItem.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="py-0">
              <v-list-item-title>{{ navItem.title }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
              v-for="(childItem, childIndex) in navItem.children"
              :key="`child-${index}-${childIndex}`"
              :to="childItem.link"
              link
              class="pl-5 my-1 child-item"
              exact-active-class="active-nav-link"
          >
            <v-list-item-icon class="mr-3 my-0 align-self-center">
              <v-icon size="18">{{ childItem.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="py-0">
              <v-list-item-title class="subtitle-2">{{ childItem.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
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
        icon: "mdi-magnify",
        link: "/library",
      },
      {
        title: "数据可视化",
        icon: "mdi-chart-box-outline",
        children: [
          {
            title: "数据大屏",
            icon: "mdi-monitor-dashboard",
            link: "/dash1c",
          },
          {
            title: "关键词分析",
            icon: "mdi-key-variant",
            link: "/dash2",
          },
          {
            title: "趋势分析",
            icon: "mdi-chart-line",
            link: "/dash2k",
          }
        ]
      },
      {
        title: "舆情监测",
        icon: "mdi-eye-outline",
        children: [
          {
            title: "话题跟踪",
            icon: "mdi-tag-outline",
            link: "/dash2kp",
          },
          {
            title: "词云分析",
            icon: "mdi-cloud-outline",
            link: "/dash3",
          },
          {
            title: "情感分析",
            icon: "mdi-emoticon-outline",
            link: "/predict",
          },
          {
            title: "微博热点",
            icon: "mdi-sina-weibo",
            link: "/yuqing",
          }
        ]
      },
      {
        title: "设置",
        icon: "mdi-cog-outline",
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

/* 文件夹样式优化 */
.folder-group {
  margin-bottom: 8px !important;
}

.folder-title {
  font-weight: 400 !important;
  font-size: 0.9rem !important;
  letter-spacing: normal;
}

.v-list-group__header {
  padding-left: 16px !important;
  min-height: 40px !important;
}

.v-list-group__header .v-list-item__icon {
  margin-right: 12px !important;
}

.child-item {
  min-height: 36px !important;
  border-radius: 4px;
  margin-left: 8px;
  margin-right: 8px;
  transition: all 0.2s ease;
}

.child-item:hover {
  background-color: rgba(103, 58, 183, 0.05);
}

.v-list-group__header.v-list-item--active {
  color: #673ab7 !important;
}

.v-list-group__header.v-list-item--active::before {
  opacity: 0.12;
  background-color: #673ab7;
}

/* 图标样式优化 */
.v-list-item__icon {
  margin: 0 !important;
  min-width: 24px;
  display: flex;
  justify-content: center;
}

.child-item .v-list-item__content {
  padding: 8px 0;
}

/* 菜单项统一样式 */
.menu-item {
  min-height: 40px !important;
  padding-left: 16px !important;
}

.v-list-item__title {
  font-size: 0.9rem !important;
  font-weight: 400 !important;
}
</style>

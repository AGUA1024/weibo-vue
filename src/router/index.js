import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Layout from "../views/layouts/AppLayout";
// import Home from "../views/Home";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/index',
    name: 'Index',
    component: Layout,
    redirect: { name: 'Home' },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
      }
    ],
  },
  {
    path: '/library',
    name: 'Library',
    component: Layout,
    redirect: { name: 'LibraryC' },
    children: [
      {
        path: '/library',
        name: 'LibraryC',
        component: () => import('../views/Library.vue'),
      }
    ],
  },


  {
    path: '/dash1c',
    name: 'Dash1c',
    component: Layout,
    redirect: { name: 'Dash1Vc' },
    children: [
      {
        path: '/dash1c',
        name: 'Dash1Vc',
        component: () => import('../views/Charts/Dash1/Dash1C.vue'),
      }
    ],
  },

  {
    path: '/dash2',
    name: 'Dash2',
    component: Layout,
    redirect: { name: 'Dash2V' },
    children: [
      {
        path: '/dash2',
        name: 'Dash2V',
        component: () => import('../views/Charts/Dash2/Dash2.vue'),
      }
    ],
  },
  {
    path: '/dash2k',
    name: 'Dash2K',
    component: Layout,
    redirect: { name: 'Dash2KV' },
    children: [
      {
        path: '/dash2k',
        name: 'Dash2KV',
        component: () => import('../views/Charts/Dash2K/Dash2K.vue'),
      },
      {
        path: '/dash2kp',
        name: 'Dash2KP',
        component: () => import('../views/Charts/Dash2KP/Dash2KP.vue'),
      }
    ],
  },
  {
    path: '/dash3',
    name: 'Dash3',
    component: Layout,
    redirect: { name: 'Dash3V' },
    children: [
      {
        path: '/dash3',
        name: 'Dash3V',
        component: () => import('../views/Charts/Dash3/Dash3.vue'),
      }
    ],
  },
  {
    path: '/yuqing',
    name: 'mylike',
    component: Layout,
    redirect: { name: 'YuqingTable' },
    children: [
      {
        path: '/yuqing',
        name: 'YuqingTable',
        component: () => import('../views/Table/YuqingTable.vue'),
      },{
        path: '/notices',
        name: 'NoticeList',
        component: () => import('../views/CRUD/NoticeList.vue'),
      }
    ],
  },
  {
    path: '/settings',
    name: 'Setting',
    component: Layout,
    redirect: { name: 'AccountSettings' },
    children: [
      {
        path: '/settings',
        name: 'AccountSettings',
        component: () => import('../views/Pages/AccountSettings.vue'),
      }
    ],
  },
  {
    path: '/predict',
    name: 'Predict',
    component: Layout,
    redirect: { name: 'MachineLearning' },
    children: [
      {
        path: '/predict',
        name: 'MLMain',
        component: () => import('../views/MachineLearning/MLMain.vue'),
      }
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

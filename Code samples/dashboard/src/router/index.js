import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: {
      name: "login"
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/userCharts/:chartView',
    name: 'userCharts',
    component: () => import(/* webpackChunkName: "userCharts" */ '../views/UserCharts.vue'),
    props: true
  },
  {
    path: '/categoryCharts/:chartView',
    name: 'categoryCharts',
    component: () => import(/* webpackChunkName: "categoryCharts" */ '../views/CategoryCharts.vue'),
    props: true
  },
  {
    path: '/productCharts/:chartView',
    name: 'productCharts',
    component: () => import(/* webpackChunkName: "productCharts" */ '../views/ProductCharts.vue'),
    props: true
  },
  {
    path: '/employeeCharts/:chartView',
    name: 'employeeCharts',
    component: () => import(/* webpackChunkName: "employeeCharts" */ '../views/EmployeeCharts.vue'),
    props: true
  },
  {
    path: '/reservationCharts',
    name: 'reservationCharts',
    component: () => import(/* webpackChunkName: "rentalCharts" */ '../views/ReservationCharts.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

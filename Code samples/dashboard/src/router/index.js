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
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/users',
    name: 'users',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Users.vue')
  },
  {
    path: '/users/:userEmail',
    name: 'singleUser',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/singleUser.vue'),
    props: true
  },
  {
    path: '/employees',
    name: 'employees',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Employees.vue')
  },
  {
    path: '/employees/create',
    name: 'EmployeeForm',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EmployeeForm.vue')
  },
  {
    path: '/employees/:employeeEmail',
    name: 'singleEmployee',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/singleEmployee.vue'),
    props: true
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import(/* webpackChunkName: "categoryCharts" */ '../views/Categories.vue')
  },
  {
    path: '/products',
    name: 'products',
    component: () => import(/* webpackChunkName: "categoryCharts" */ '../views/Products.vue')
  },
  {
    path: '/products/:productName',
    name: 'singleProduct',
    component: () => import(/* webpackChunkName: "categoryCharts" */ '../views/SingleProduct.vue'),
    props: true
  },
  {
    path: '/productCharts/:chartView',
    name: 'productCharts',
    component: () => import(/* webpackChunkName: "productCharts" */ '../views/ProductCharts.vue'),
    props: true
  },
  {
    path: '/reservationCharts',
    name: 'reservationCharts',
    component: () => import(/* webpackChunkName: "rentalCharts" */ '../views/provaReservations.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

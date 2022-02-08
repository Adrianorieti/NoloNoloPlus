import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function guardMyroute(to, from, next) {
  let token = sessionStorage.getItem('token');
  if (token) {
    let url = `http://localhost:8001/api/auth/manager/${token}`;
    fetch(url)
      .then(response => {
        if (response.status === 200)
          next();
      })
      .catch(err => {
        console.log(err);
        next('/login');
      })
  }
  else {
    next('/login');
  }
}

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
    path: '/users',
    name: 'users',
    beforeEnter: guardMyroute,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Users.vue')
  },
  {
    path: '/users/:userEmail',
    name: 'singleUser',
    beforeEnter: guardMyroute,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/singleUser.vue'),
    props: true
  },
  {
    path: '/employees',
    name: 'employees',
    beforeEnter: guardMyroute,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Employees.vue')
  },
  {
    path: '/employees/create',
    name: 'EmployeeForm',
    beforeEnter: guardMyroute,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EmployeeForm.vue')
  },
  {
    path: '/employees/:employeeEmail',
    name: 'singleEmployee',
    beforeEnter: guardMyroute,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/singleEmployee.vue'),
    props: true
  },
  {
    path: '/categories',
    name: 'categories',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "categoryCharts" */ '../views/Categories.vue')
  },
  {
    path: '/categories/create',
    name: 'createcategory',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "home" */ '../views/CreateCategory.vue')
  },
  {
    path: '/categories/change',
    name: 'changeCategory',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "home" */ '../views/ChangeCategory.vue')
  },
  {
    path: '/products',
    name: 'products',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "categoryCharts" */ '../views/Products.vue')
  },
  {
    path: '/products/:productName',
    name: 'singleProduct',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "categoryCharts" */ '../views/SingleProduct.vue'),
    props: true
  },
  {
    path: '/productCharts/:chartView',
    name: 'productCharts',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "productCharts" */ '../views/ProductCharts.vue'),
    props: true
  },
  {
    path: '/reservationCharts',
    name: 'reservationCharts',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "rentalCharts" */ '../views/provaReservations.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

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
        next('/dashboard/login');
      })
  }
  else {
    next('/dashboard/login');
  }
}

const routes = [
  {
    path: '/dashboard',
    redirect: {
      name: "login"
    }
  },
  {
    path: '/dashboard/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/dashboard/users',
    name: 'users',
    beforeEnter: guardMyroute,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Users.vue')
  },
  {
    path: '/dashboard/users/:userEmail',
    name: 'singleUser',
    beforeEnter: guardMyroute,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/singleUser.vue'),
    props: true
  },
  {
    path: '/dashboard/employees',
    name: 'employees',
    beforeEnter: guardMyroute,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Employees.vue')
  },
  {
    path: '/dashboard/employees/create',
    name: 'EmployeeForm',
    beforeEnter: guardMyroute,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EmployeeForm.vue')
  },
  {
    path: '/dashboard/employees/:employeeEmail',
    name: 'singleEmployee',
    beforeEnter: guardMyroute,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/singleEmployee.vue'),
    props: true
  },
  {
    path: '/dashboard/categories',
    name: 'categories',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "categoryCharts" */ '../views/Categories.vue')
  },
  {
    path: '/dashboard/categories/create',
    name: 'createcategory',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "home" */ '../views/CreateCategory.vue')
  },
  {
    path: '/dashboard/categories/change',
    name: 'changeCategory',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "home" */ '../views/ChangeCategory.vue')
  },
  {
    path: '/dashboard/products',
    name: 'products',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "categoryCharts" */ '../views/Products.vue')
  },
  {
    path: '/dashboard/products/:productName',
    name: 'singleProduct',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "categoryCharts" */ '../views/SingleProduct.vue'),
    props: true
  },
  {
    path: '/dashboard/productCharts/:chartView',
    name: 'productCharts',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "productCharts" */ '../views/ProductCharts.vue'),
    props: true
  },
  {
    path: '/dashboard/reservationCharts',
    name: 'reservationCharts',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "rentalCharts" */ '../views/provaReservations.vue')
  },
  {
    path: '/dashboard/modify',
    name: 'modify',
    beforeEnter: guardMyroute,
    component: () => import(/* webpackChunkName: "rentalCharts" */ '../views/ChangePersonalInfo.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

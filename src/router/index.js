
import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'

import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'

import BooksView from '../views/BooksView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPI from '../views/CountBookAPI.vue'
import GetAllBookAPI from '../views/GetAllBookAPI.vue'

const router = createRouter({

  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    {
      path: '/about',
      name: 'about',
      component: AboutView
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

    {
      path: '/access-denied',
      name: 'accessDenied',
      component: AccessDeniedView
    },

    {
      path: '/FireRegister',
      name: 'FireRegister',
      component: FirebaseRegisterView
    },

    {
      path: '/FireLogin',
      name: 'FireLogin',
      component: FirebaseSigninView
    },

    {
      path: '/books',
      name: 'books',
      component: BooksView
    },

    {
      path: '/getbookcount',
      name: 'GetBookCount',
      component: GetBookCountView
    },

    {
      path: '/weather',
      name: 'Weather',
      component: WeatherView
    },

    {
      path: '/CountBookAPI',
      name: 'CountBookAPI',
      component: CountBookAPI
    },

    {
      path: '/GetAllBookAPI',
      name: 'GetAllBookAPI',
      component: GetAllBookAPI
    }
  ]
})

export default router

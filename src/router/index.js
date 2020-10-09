import Vue from 'vue'
import Vuerouter from 'vue-router'

//安装插件
Vue.use(Vuerouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('views/home/Home'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/category',
    component: () => import('views/category/Category'),
    meta: {
      title: '分类'
    }
  },
  {
    path: '/shopCart',
    component: () => import('views/shoppingCart/ShoppingCart'),
    meta: {
      title: '购物车'
    }
  },
  {
    path: '/profile',
    component: () => import('views/profile/Profile'),
    meta: {
      title: '档案'
    }
  },
  {
    path: '/detail/:iid',
    component: () => import('views/detail/Detail'),
    meta: {
      title: '详情页'
    }
  }
]
const router = new Vuerouter({
  routes,
  mode: 'history'
})
router.beforeEach((to, from, next) => {
  document.title = to.matched[0].meta.title //给目标路由的页面的title赋值
  next() //必须调用，不调用不会跳转
})
export default router

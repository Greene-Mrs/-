import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import Home from '@/view/home/homePage.vue'

//创建路由关系
const routes = [
    {
      path: '/',
      redirect: '/home'
    },
    {
        path: '/home',
        component: Home
    }]

//创建路由实例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:routes
})

//导出路由实例
export default router
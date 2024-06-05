import type { App } from 'vue'

import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: () => import('/@/views/Home.vue')
    },
    {
      name: 'BaseMap',
      path: '/baseMap',
      component: () => import('/@/views/ComponentExample/BaseMap.vue')
    },
    {
      name: 'CircleClusters',
      path: '/circleClusters',
      component: () => import('/@/views/ComponentExample/CircleClusters.vue')
    },
    {
      name: 'ShowHideLayer',
      path: '/showHideLayer',
      component: () => import('/@/views/ComponentExample/ShowHideLayer.vue')
    },
    {
      name: 'AnimateAntPath',
      path: '/animateAntPath',
      component: () => import('/@/views/ComponentExample/AnimateAntPath.vue')
    },
    {
      name: 'Terrain3d',
      path: '/terrain3d',
      component: () => import('/@/views/ComponentExample/Terrain3d.vue')
    },
    {
      name: 'SwitchStyle',
      path: '/switchStyle',
      component: () => import('/@/views/ComponentExample/SwitchStyle.vue')
    },
    {
      name: 'StyleCircles',
      path: '/styleCircles',
      component: () => import('/@/views/ComponentExample/StyleCircles.vue')
    },
    {
      name: 'AnimateCamera',
      path: '/animateCamera',
      component: () => import('/@/views/ComponentExample/AnimateCamera.vue')
    },
    {
      name: 'Test',
      path: '/test',
      component: () => import('/@/views/Test.vue')
    }
  ],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}

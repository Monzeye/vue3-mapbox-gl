import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: /\/@\//,
        replacement: pathResolve('src') + '/'
      },
      {
        find: /@\//,
        replacement: pathResolve('../lib') + '/'
      },
      {
        find: /#\//,
        replacement: pathResolve('types') + '/'
      },
      {
        find: 'vue3-mapbox-gl',
        replacement: resolve(process.cwd(), '../lib')
      }
    ]
  },
  server: {
    host: true,
    port: 6799
  }
})

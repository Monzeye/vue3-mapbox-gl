import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
// import eslintPlugin from 'vite-plugin-eslint'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
    // eslintPlugin({
    //   include: ['packages/**/*.js', 'packages/**/*.vue']
    // })
  ],
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: pathResolve('lib') + '/'
      },
      {
        find: /#\//,
        replacement: pathResolve('types') + '/'
      }
    ]
  },
  build: {
    rollupOptions: {
      external: ['vue', 'mapbox-gl'],
      output: {
        globals: {
          vue: 'Vue',
          'mapbox-gl': 'mapboxgl'
        },
        exports: 'named'
      }
    },
    lib: {
      entry: pathResolve('lib/index.ts'),
      name: 'VueMapbox',
      fileName: 'index',
      formats: ['es', 'umd']
    }
  }
})

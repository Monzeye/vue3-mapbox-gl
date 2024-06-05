import { createApp } from 'vue'
import './styles/style.css'
import App from './App.vue'
import vmapbox from 'vue3-mapbox-gl'
// import '../../dist/style.css'
import { setupRouter } from './router'

// const aa = await import.meta.glob('../packages/hooks/**/*.ts')
// console.log(Object.keys(aa).map(d => d.substring(d.lastIndexOf('/') + 1, d.length)))

const app = createApp(App)
app.use(vmapbox, {
  accessToken:
    'pk.eyJ1IjoiamFycnltZW5nIiwiYSI6ImNqcGpsenhvMjA4YWUzcG4wbDZsazIyZjcifQ.V4CpgVR5ldNaOuobSYfKtw'
})
setupRouter(app)
app.mount('#app')

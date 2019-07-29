import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Col from './components/Col'
import Row from './components/Row'

Vue.config.productionTip = false

Vue.component(Col.name, Col)
Vue.component(Row.name, Row)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

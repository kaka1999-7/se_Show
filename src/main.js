import Vue from 'vue'
import App from './App.vue'
import store from './store/vuex';
// import "./mock/mockServe";
import uuid from "vue-uuid";
import router from './router/router'

Vue.use(uuid)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router,
  beforeMount(){
    Vue.prototype.$bus=this
  },
  mounted(){
    // console.log(this.$uuid.v1())
    // this.$router.push({
    //   name:"login"
    // })
  }
}).$mount('#app')

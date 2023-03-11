<template>
  <div id="app">
   <router-view></router-view>
  </div>
</template>

<script>
import app from './components/home.vue'
import {mapState} from 'vuex'
export default {
  name: 'App',
  mounted(){
    // console.log(this.$store.state.baseData)
    this.$store.dispatch("reqData");
  },
  components: {
   app
  }
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
  }
</style>

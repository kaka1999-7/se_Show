<template>
  <div>
    <!-- 导航，侧边栏，内容区 -->
    <div >
      <div class="head">
        <Header :baseData="baseData"></Header>
      </div>
      <div class="left" :class="{'hidLeft':hidLeft}"  >
        <span @click="ckHidLeft"></span> 
        <Left></Left>
      </div>
      <div class="content" :class="{'fillscreen':hidLeft}">
        <Content></Content>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./header/MyHeader.vue";
import Content from "./Content/Content.vue";
import Left from "./left/Left.vue";
import Login from './login/mylogin.vue'
export default {
  data() {
    return {
      isLogin: false ,
      baseData:[],
      hidLeft:false
    };
  },
 beforeRouteEnter (to, from, next) {
  
  next((el)=>{
    // console.log(to,from)
    let info = JSON.parse(window.localStorage.getItem('login'))
    if(info.isLogin){
      el.isLogin=info.isLogin
      // console.log(to.$store.state.baseData)
    }else{
      el.$router.push({
        path:'\login'
      })
    }
  })
 },
  created(){
    this.$store.dispatch("reqData");

  },
  mounted(){
    
  },
  methods: {
    ckHidLeft(){
      this.hidLeft=!this.hidLeft
    }
  },
  components: {
    Header,
    Content,
    Left,
    Login
  },
   watch: {
    "$store.state.baseData"(nw, ol) {
      this.baseData = nw;
    },
  },
};
</script>

<style scoped>
.head {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 100;
}
.left {
  position: fixed;
  height: 90vh;
  width: 282px;
  transition: .5s linear;

}
.left span{
  position: absolute;
  width: 20px;
  height: 50px;
  border-radius: 0 15px 15px 0;
  left: 100%;
  top: 30%;  
  cursor: pointer;
  background-color: #d2dbe5d1;
}
.left span::before{
  content: "";
  display: inline-block;
  position: relative;
  top: 15px;
  width: 8px;
  height: 8px;
  border: 2px transparent solid;
  border-right: 2px black solid;
  border-bottom: 2px black solid;
  border-radius: 1px;
  transform: rotate(-45deg);
}
.hidLeft{
  transform: translate(-283px,0);
}
.content {
  width: auto;
  margin-left: 282px;
}
.fillscreen{
  margin-left: 0px;
}
</style>

<template>
  <div class="container">
    <div class="logo">
      <img src="./img/logo.jpg" alt="" />
    </div>
    <div class="topnav">
      <ul>
        <li
          v-for="(itemDetail, index) in baseData"
          :data-curindex="index"
          @click="clickItem(itemDetail.id)"
          :key="itemDetail.id"
        >
          <headItem :itemDetail="itemDetail"></headItem>
        </li>
      </ul>
    </div>
    <div class="login">
      <!-- <span><img src="./img/login-icon.jpg" alt="" /></span> -->
      
      <span @click="toLogin"><img src="./img/user.png" alt="用户" title="返回登陆"></span>
      <span  @click="toAlter" v-if="info.type==='admin'">修改添加</span>
    </div>
  </div>
</template>

<script>
import headItem from "./HeadItem.vue";
import { reqHeaderItemList } from "../../axios/api";
// import {mapState} from "vuex";
export default {
  data() {
    return {
      baseData: [],
      info:{}
    };
  },
  created() {
    this.baseData = this.$store.state.baseData;
  },
  mounted() {
      if(this.baseData[0]){
      this.clickItem(this.baseData[0].id)
      }
    this.info=JSON.parse(window.localStorage.getItem("login"))
  },
  watch: {
    "$store.state.baseData": {
      handler(nw, ol) {
        this.baseData = nw;
      },
      deep:true
    },
  },
  methods: {
    toAlter() {
      // console.log(this.$route)
      this.$router.push({
        path: "/alter",
      });
    },
    clickItem(id) {
      this.baseData.forEach((el) => {
        el.curent = false;
        if (el.id === id) {
          el.curent = true;
        }
      });
      this.$bus.$emit("clickHeader", id);
    },
    toLogin() {
      this.$router.push({
        path: "\login",
      });
    },
  },
  components: {
    headItem,
  },
};
</script>

<style scoped>
*{
  user-select: none;
}
.container {
  
  display: flex;
  width: 100%;
  height: 90px;
  box-shadow: 2px 1px 2px gray;
  background-color: #fafafa;;
  margin-bottom: 3px;
  /* background-image: url("./img/back.jpg"); 
  background-repeat: no-repeat;
  background-size: 100%; */
  /* border: red 1px solid; */
}
.container .logo {
  flex: 10%;
  margin-top: 10px;
  padding-left: 20px;
  backdrop-filter: blur(10px);
}
.container .logo img {
  width: 200px;
  border-radius: 3px;
}
.topnav {
  flex: 80%;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  /* border: 1px red solid; */
}
.topnav ul {
  list-style: none;
  display: flex;
  align-items: center;
  height: 80%;
  /* border: 1px red solid; */
}
.topnav ul li {
  padding: 15px;
  user-select: none;
}
.login {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex: 10%;
  height: 100%;
  color: rgb(0, 0, 0);
  font-size: 20px;
  letter-spacing: 5px;
  backdrop-filter: blur(10px);
  /* border: 1px red solid; */
}
.login img{
  display: block;
  width: 40px;
  margin-left: 50%;
  transform: translate(-50%,0);
}
.login :nth-of-type(1){
  text-align:center;
}
.login :nth-of-type(2){
  font-size: 15px;
}
.login :nth-of-type(2):hover{
  text-decoration: underline;
   /* text-decoration-line: line-through;
   text-decoration-style: double ;
   text-decoration-color: red; */
}
</style>

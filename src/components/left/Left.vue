<template>
  <!-- <div class="ct"> -->
    <div class="container">
    <ul>
      <li v-for="(itemDetail,index) in curentList" :key="itemDetail.id">
        <leftItem
          :itemDetail="itemDetail"
          @clickItem="clickItem"
          @clickChild="clickChild"
          :parentId="parentId"
          :index="index"
        ></leftItem>
      </li>
    </ul>
  </div>
  <!-- </div> -->
</template>

<script>
import leftItem from "./leftItem.vue";
export default {
  data() {
    return {
      baseData: [],
      parentId:'header1',
      curentList: [],
    };
  },
  created() {
    // this.$store.dispatch("reqData");
    this.baseData = this.$store.state.baseData;
    this.$store.dispatch("reqData");
    this.$bus.$on("clickHeader", this.clickHeader);
    this.reFresh()
  },
  mounted() {
    if(this.baseData[0]){    //更新curentList
      this.curentList=this.baseData[0].leftList.list
      this.parentId=this.baseData[0].id
    }
   
  },
  methods: {
    // 刷新leftList
    reFresh(){
      setTimeout(() => {
        if(this.baseData[0]){
           this.curentList=this.baseData[0].leftList.list
      }else{
        this.reFresh()
      }
      }, 10);
    },
    //触发兄弟组件改变发生的id
    clickHeader(id) {
      let res = this.baseData.find((el) => el.id === id);
      if(res){
        this.parentId=res.id
        res = res.leftList;
      }
      if (res) {
        this.curentList = res.list;
      }
    },
    clickItem(index) {
      // console.log(index)
      
      this.curentList[index].curent = !this.curentList[index].curent;
    },
    clickChild(parentIndex, index) {
      // console.log(parentIndex,index)
      this.curentList.forEach((el) => {
        el.children.forEach((child) => (child.curent = false));
      });
      this.curentList[parentIndex].children[index].curent = true;
    },
  },
  watch: {
    "$store.state.baseData": {
      deep:true,
      handler(nw, ol) {
        this.baseData = nw;
        // this.curentList=this.baseData[0].leftList.list
      },
      
    },
  },
  components: {
    leftItem,
  },
};
</script>

<style scoped>
.container {
  /* width: 200px; */
  padding-top: 5px;
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  user-select: none;
  overflow-y: auto;
  
}
.container::-webkit-scrollbar{
  display: none;
}
</style>

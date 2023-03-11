<template>
  <div class="container">
    <div class="showvideo" v-if="type === 'video'" id="playvido">
      <video width="98%" height="100%" controls preload style="margin-left: 20px;">
        <source :src="video" />
      </video>
    </div>
    <div class="showppt" v-if="type === 'pdf'">
     <iframe :src="pdf" width="100%" height="800px" :class="{'full_screen':isFullScreen}" style="border:none;" >22222</iframe>
     <span @click="isFullScreen=!isFullScreen" class="togglescreen">全屏</span>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: "video",
      video: "/video?name=thirdCH01",
      baseData: [],
      baseUrl:"",
      pdf:"/pdf?name=thirdCH02",
      isFullScreen:false,
    };
  },
  methods: {
    
    // 修改跳转
    toTop() {},
    hanlderChild(secInd, thirdInd, parentId) {
      this.baseData.forEach((el) => {
        if (el.id == parentId) {
          // if(el.leftList.list[secInd].children[thirdInd].type ){
            let type=el.leftList.list[secInd].children[thirdInd].type 
          // }
          let id = el.leftList.list[secInd].children[thirdInd].id;
          // src = src.slice(0, src.length - 4);
          this.type = "";
          
          // console.log(src);
          if(type==="video"){    //视频类型
            this.video=this.baseUrl+"/video?name="+id
            // this.type = type;
            // try {
            //   this.video = require(src + ".mp4"); //不拼接会出问题
            // } catch (e) {}
            this.$nextTick(() => {
              //更新试图后再设置类型，触发页面的元素重新加载
              this.type = type;
            });
          }
          if(type==='pdf'){     //pdf类型
              this.pdf=this.baseUrl+"/pdf?name="+id

              // this.pdf=src+".pdf"
               this.$nextTick(() => {
              //更新试图后再设置类型，触发页面的元素重新加载
              this.type = type;
            });
          }
        }
      });
    },
  },
  created() {},
  mounted() {
    this.$bus.$on("content_clickChild", this.hanlderChild);
    this.baseData = this.$store.state.baseData;
  },
  watch: {
    "$store.state.baseData"(nw) {
      this.baseData = nw;
    },
  },
  components: {
    // pdf
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  
}
.full_screen{
  position: absolute;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  top: -1px;
  left: -1px;
  
}
.showppt span{
  position: relative;
}
.showppt .togglescreen{
  position: fixed;
  z-index: 10000;
  bottom: 20px;
  right: 50px;
  font-weight: 900;
  padding: 5px;
  background-color: rgb(0, 0, 0,.5);
  color: white;
  border-radius: 5px;
}
.container {
  width: 100%;
  min-height: 75vh;
  /* border: 2px red solid; */
  /* background-color: red; */
}
.container .showvideo {
  width: 100%;
  height: 88vh;
  /* border: 1px green solid; */
}

</style>
>

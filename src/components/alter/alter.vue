<template>
   
  <div class="container">
    <!-- 添加的属性面板 -->
    <div class="addpanel" v-show="isAlter">
      <div class="tittle">{{ curentHeader.tittle }}</div>
      <div class="inpbox" v-for="(item1,index1) in curentHeader.leftList.list" :key="'altersec'+index1">
        <div class="sectit">
          {{ item1.tittle }}
        </div>
        <div class="thirdbox">
          <div class="thirdtit" v-for="(item2,index2) in item1.children" :key="'alterthi'+index2">
            <span
              @click="
                item2.isEdit =
                  !item2.isEdit
              "
              v-if="!item2.isEdit"
              >{{ item2.tittle }}</span
            >
            <input
              type="text"
              @keypress.enter="
                item2.isEdit =
                  !item2.isEdit
              "
              v-else
              v-model="item2.tittle"
            />
            <select name="" v-model="item2.type">
              <option value="pdf">pdf</option>
              <option value="video">video</option>
            </select>
            <input type="file" @change="fileChange($event,item2.id,item2.type)" />
              <img src="./res/upload.png" alt="">
            <span class="tip">选择文件</span>
            <div class="delete" @click="deleteThird(index1,index2)">X</div>
          </div>
          <div class="thirdtit thirdadd" @click="addThird(item1.tittle)">+</div>
        </div>
      </div>
      <button class="sure" @click="sureAlter">确认</button>
      <button class="cancel" @click="cancelAlter">取消</button>
    </div>
    <button class="back" @click="back">
      <img src="./res/back.png" alt="返回" title="返回">
    </button>
    <img class="totop" src="./res/toTop.png" @click="toTop" alt="" title="返回顶部">
    <!-- 全信息展示 -->
    <div class="box" v-for="item in baseData" :key="item.id">
      <span></span>
      <div class="content">
        <h2 v-if="!item.isEdit" @click="item.isEdit = !item.isEdit">
          {{ item.tittle }}
        </h2>
        <div class="headalter" v-else>
          <input
            type="text"
            v-model="item.tittle"
            @keydown.enter="item.isEdit = !item.isEdit"
          />
          <button @click="item.isEdit = !item.isEdit">确定</button>
        </div>

        <div class="deleteHeader" @click.stop="deleteHeader(item.id)">
          <img src="./res/delete.png" alt="删除" title="删除">
        </div>
        <div
          class="innerbox"
          v-for="(value, key) in item.leftList"
          :key="'second' + key"
        >
          <template v-if="key === 'list'">
            <div
              class="item"
              v-for="(item2, index) in value"
              :key="'third' + index"
              @click="alterLeftItem"
            >
              <div v-if="!item2.isEdit" @click="item2.isEdit = !item2.isEdit">
                {{ item2.tittle }}
                <div
                  class="deleteLeft"
                  @click.stop="deleteLeft(item.id, index)"
                >
                  <img src="./res/delete2.png" alt="修改文件" title="修改文件">
                </div>
              </div>
              <div v-else>
                <input
                  type="text"
                  v-model="item2.tittle"
                  @keydown.enter="item2.isEdit = !item2.isEdit"
                />
                <button @click="item2.isEdit = !item2.isEdit">确定</button>
              </div>
            </div>
            <div
              class="item leftadd"
              @click="addLeftItem(item.id)"
            >
              +
            </div>
          </template>
        </div>
      </div>
      <button @click="addFile(item.id)" class="addFile">
        <img src="./res/alter.png" alt="">
      </button>
    </div>
    <div class="box actbox" @click="addHeaderItem">
      <div class="add"></div>
      <div class="content"></div>
    </div>
  </div>
</template>

<script>
import { postFile,merge,upDate,deleteFile} from "../../axios/api";
// import axios from "axios"
export default {
  data() { 
    return {
      baseData: [],
      curentHeader: {},
      tempFile:{},
      deleteList:[],
      // curentLeft: {},
      isAlter: false,
      test: "PPT",
    };
  },
  beforeRouteLeave(to, from, next) {
    // this.$store.state.baseData=this.baseData
    next();
  },
  created() {
    this.baseData = this.$store.state.baseData;
    this.curentHeader = this.baseData[0];
    this.$store.dispatch("reqData");
  },
  methods: {
    // 返回顶部
    toTop(){
       var timer = setInterval(function () {
        var top = window.pageYOffset;
        var step = Math.ceil(top / 10);
        window.scroll(0, top - step);
        if (top <= 1) {
          clearInterval(timer);
        }
      }, 10)
    },
    // 上传文件
    fileChange(e,id,type){
      const size = 1024 * 1024 * 10; // 10MB 切片大小
      const file = e.target.files[0];
      if (!file) return;
      let fileChunks = []; //创建切片
          for(let cur = 0; cur < file.size; cur += size){
              fileChunks.push(file.slice(cur, cur + size));
          }
      this.tempFile[id]={
        file:fileChunks,
        type
      }
      if(type==='video') this.tempFile[id].type='mp4'
      // console.log(this.tempFile)
    },
    typeChange(id,type){
      
      if(this.tempFile[id]) {
        this.tempFile[id].type=type
        if(type==='video') this.tempFile[id].type="mp4"
      }
      
      // console.log(this.tempFile[id])
      // if(type==='video') this.tempFile[id].type="mp4"
      // console.log(this.tempFile)
    },
    async deleteFileList(){
      await deleteFile(this.deleteList)
      this.deleteList=[]
    },
    async uploadFileChunks (fileChunks, filename) {
      const chunksList = fileChunks.map((chunk, index) => {
          let formData = new FormData();
          formData.append('filename', filename);
          formData.append('hash', index);
          formData.append('chunk', chunk);
          return {
              formData
          };
      })
      const uploadList = chunksList.map(({
          formData
      }) => postFile(formData));
      // console.log(chunksList,uploadList)
      await Promise.all(uploadList);
      },
    async mergeFileChunks(filename) {
          // await axios({
          //     method: 'get',
          //     url: 'http://192.168.1.13:3000/merge',
          //     params: {
          //         filename
          //     }
          // });
          // console.log({filename:filename})
          await merge({filename})
          
      },
    async uplodeFile(){
      for (const key in this.tempFile) {
        if (Object.hasOwnProperty.call(this.tempFile, key)) {
          const element = this.tempFile[key];
          console.log(element,key)
          let name=key+"."+element.type
        try {
          await this.uploadFileChunks(element.file,name)
          await this.mergeFileChunks(name)
          // alert("上传成功")
        } catch (error) {
          // alert("上传失败")
        }
        }
      }
      this.tempFile={}
    },

    deleteThird(ind1,ind2){
      let thirdItem 
      if(confirm('确认删除吗！')){
        thirdItem= this.curentHeader.leftList.list[ind1].children[ind2]
        this.curentHeader.leftList.list[ind1].children.splice(ind2,1)
      }
      if(thirdItem){
        // let filename= thirdItem.type==="pdf"?thirdItem.id+".pdf":thirdItem.id+".mp4"
        // this.deleteList.push(filename)
        this.deleteList.push(thirdItem.id)
      }
    },
    addThird(leftTit,id){
      // console.log(leftTit)
      this.curentHeader.leftList.list.forEach(el=>{
        if(el.tittle===leftTit){
          el.children.push({           
              tittle: "精选视频",
              curent: false,
              isEdit: false,
              type:"video",
              id: this.$uuid.v1()
          })
        }
      })
    },
    sureAlter() {
      let index=-1;
      this.baseData.forEach((el,ind)=>{
        if(el.id===this.curentHeader.id){
            index=ind
          }
      })
      this.baseData[index]=this.curentHeader
      // this.curentHeader={}
          this.isAlter = false;
      this.uplodeFile()
      upDate({basedata:this.baseData})
      this.deleteFileList()
    },
    cancelAlter() {
      this.isAlter = false;
      this.tempFile={}
      this.deleteList=[]
    },
    addFile(parentId) {
      // console.log(parentId);
      this.baseData.forEach(el=>{
        if(el.id===parentId){
          this.curentHeader=JSON.parse(JSON.stringify(el))
          // console.log(this.curentHeader)
        }
      })
      this.isAlter = true;
    },
    alterLeftItem() {},
    addLeftItem(headerID) {
      let res = this.baseData.find((el) => el.id === headerID);
      res.leftList.list.push({
        tittle: "print tittle",
        src: "",
        curent: false,
        isEdit: true,
        children: [],
      });
    },
    addHeaderItem() {
      let headerid = this.$uuid.v1();
      let leftid = this.$uuid.v1();
      let header = {
        tittle: "",
        src: "",
        id: headerid,
        curent: false,
        isEdit: true,
        leftList: {
          parentId: headerid,
          id: leftid,
          curent: false,
          isEdit: true,
          list: [
            {
              tittle: "",
              src: "",
              curent: false,
              isEdit: true,
              children: [],
            },
          ],
        },
      };
      this.baseData.push(header);
    },
    deleteHeader(parentId) {
      if (confirm("确认删除吗！")) {
        let ind;
        this.baseData.forEach((el, index) => {
          if (el.id === parentId) {
            ind = index;
            // 添加文件删除队列
            el.leftList.list.forEach(e=>{
              e.children.forEach(e=>{
                // if(e.type==="video"){
                //   this.deleteList.push(e.id+".mp4")
                // }else{
                //   this.deleteList.push(e.id+"."+e.type)
                // }
                this.deleteList.push(e.id)
              })
            })
            
          }
        });
        // console.log(this.deleteList)
        this.deleteFileList()
        this.baseData.splice(ind, 1);
      }
    },
    deleteLeft(parentId, leftIndex) {
      this.baseData.forEach((el) => {
        if (el.id === parentId) {
          if (confirm("确认删除吗！")) {
            // 添加删除列表
            el.leftList.list[leftIndex].children.forEach(el=>{
              // if(el.type==="video"){
              //     this.deleteList.push(el.id+".mp4")
              //   }else{
              //     this.deleteList.push(el.id+"."+el.type)
              //   }
              this.deleteList.push(el.id)
            })
            this.deleteFileList()
            el.leftList.list.splice(leftIndex, 1);
          }
        }
      });
    },
    back() {
      // upDate(this.baseData)
      upDate({basedata:this.baseData})
      setTimeout(() => {
        this.$router.push({
        name: "home",
      });
      }, 10);
    },
  },
  watch: {
    "$store.state.baseData"(nw) {
      this.baseData = nw;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: consolas;
}


.container {
  display: flex;
  padding: 5px 50px;
  padding-top: 60px;
  min-height: 100vh;
  justify-content: left;
  align-items: center;
  flex-wrap: wrap;
  /* border: 1px red solid; */
  /* background: linear-gradient(#190027, #6d00a9, #190027); */
  background: #fafafa;;
}

.container .box {
  position: relative;
  width: 80%;
  /* max-width: 25%; */
  padding: 10px 5px;
  margin: 20px;
  margin-left:10%;
  min-height: 80vh;
  display: flex;
  border: 3px rgba(94, 93, 93, 0.471) solid;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
}
.container .box:hover{
  border: 3px rgba(26, 226, 244, 0.896) solid;
}
.container .back {
  position: fixed;
  width: 100px;
  height: 40px;
  top: 10px;
  left: 10px;
  color: white;
  border: 0px;
  background-color: transparent;
  z-index: 10000;
}
.totop{
  position: fixed;
  width: 90px;
  right: 30px;
  bottom: 100px;
  z-index: 10000;
 
}
.totop:hover{
   animation: anitotop 2s linear  infinite  ;
}
@keyframes anitotop {
  0%{}
  25%{
    transform:translate(1px,10px);
  }
  50%{
    transform:translate(0,0px);
  }
   75%{
    transform:translate(-1px,-10px);
  }
   100%{
    transform:translate(0,0px);
  }
}
.container .back:hover img{
  scale: 1.1;
  transition: .1s;
}
.container .back img{
  width: 50px;
}
.container .back:hover {
  font-size: 15px;
}
.container .box:hover::before,
.container .box:hover::after {
  transform: skew(0);
  left: 20px;
  width: calc(100% - 90px);
}

.container .box span {
  display: block;
  pointer-events: none;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
}
.container .box span::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(49, 253, 4, 0.404);
  border-radius: 10px;
  opacity: 0;
  animation: show 2s ease-in-out infinite;
}
.container .box:hover span::before {
  width: 100px;
  height: 100px;
  top: -50px;
  left: 50px;
  border-radius: 10px;
  transition: 0.5s;
  opacity: 1;
}
@keyframes show {
  0%,
  100% {
    transform: translate(0, -7px);
  }
  50% {
    transform: translate(0, 7px);
  }
}
.container .box span::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(49, 253, 4, 0.404);
  border-radius: 10px;
  opacity: 0;
  animation: show 2s ease-in-out infinite;
  animation-delay: -1s;
}
.container .box:hover span::after {
  width: 100px;
  height: 100px;
  bottom: -50px;
  right: 50px;
  border-radius: 10px;
  transition: 0.5s;
  opacity: 1;
}
.container .box .content {
  z-index: 1;
  padding: 50px 30px;
  width: 90%;
  height: 90%;
  position: relative;
  left: -20px;
  border-radius: 8px;
  background-color: rgb(255, 255, 255, 0.05);
  box-shadow: 0px, 5px, 15px, rgb(0, 0, 0, 1);
  /* filter:滤镜  backdrop-filter：背后内容的滤镜，这里为背景虚化*/
  backdrop-filter: blur(10px);
  transition: 0.5s;
}
.container .box:hover .content {
  left: -25px;
  width: 95%;
  padding: 50px 40px;
  height: 90%;
}
.container .box .content .headalter input,
.container .box .content .headalter button {
  height: 40px;
  font-size: 20px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.745);
  border: 2px rgba(128, 128, 128, 0.311) solid;
  border-radius: 5px;
  background-color: transparent;
}
.container .box .content .headalter input,
.container .box .content .headalter input:focus{
  outline-style: none;
  word-spacing: 2px;
  color: rgb(6, 246, 26);
  border: 2px rgba(6, 246, 26, 0.51) solid;
}

.container .box .content .headalter input {
  width: 200px;
}
.container .box .content .headalter button {
  font-size: 20px;
  /* line-height: 20px;  */
  margin-left: 5px;
  padding: 0 3px;
}
.container .box .content h2 {
  display: inline-block;
  min-width: 100%;
  min-height: 29px;
  font-size: 1.6em;
  color: rgb(49, 232, 3);
  margin:-10px 0 20px 0 ;
  cursor: pointer;
}
.container .box .addFile {
  position: absolute;
  bottom: 50px;
  right: 150px;
  width: 50px;
  height: 50px;
  line-height: 40px;
  font-weight: 600;
  border-radius: 15px;
  z-index: 1000;
  color: rgba(12, 12, 12, 0.793);
  border: none;
  /* border: 2px solid black; */
  background-color: transparent;
  /* background-color: rgba(32, 225, 14, 0.618); */
  /* border: #a8a4b495 1px solid; */
}
.container .box .addFile img{
  width: 51px;
}
.container .box .addFile:hover img{
  animation: aniButton 1s ease-out forwards;
}
@keyframes aniButton {
    0%{
    }
    100%{
      transform:  rotateZ(180deg);
    }
}
.container .box .content .deleteHeader {
  position: absolute;
  right:  0px;
  top: 0px;
  font-size: 35px;
  color: rgb(17, 15, 15);
  transition: 0.2s;
}
.container .box .content .deleteHeader img{
  width: 30px;
}
.container .box .content .deleteHeader:hover img{
  transition: .1s linear;
  transform: scale(1.3);
}
.container .box .content .deleteLeft {
  position: absolute;
  right: 5px;
  top: -5px;
  height: 100%;
  width: 20px;
  /* color: rgba(0, 0, 0, 0.66); */
  /* border: #190027 1px solid; */
  /* pointer-events: none; */
}
.container .box .content .deleteLeft img{
  width: 20px;
  margin-top: 8px;
}
.container .box .content .deleteLeft:hover{
  transition: .2s;
  scale: 1.1;
}
.container .box .content .innerbox {
  width: 90%;
  /* height: 100px; */
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  /* border: 1px red solid; */
  /* background-color: rgba(13, 204, 229, 0.666); */
}
.container .box .content .innerbox .item {
  position: relative;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  /* font-family: "SimSun"; */
  flex: 100%;
  font-weight:bold;
  text-align: center;
  color: rgb(17, 17, 17);
  margin: 5px 0;
  /* background-color: rgba(19, 157, 232, 0.823); */
  border: #1d1c1e60 1px solid;
  border-radius: 3px;
  transition: 0.1s;
  cursor: pointer;
  /* border: 1px red solid; */
}
.container .box .content .innerbox input {
  width: 80%;
  height: 23px;
  color: rgb(10, 10, 10);
  border: rgb(10, 10, 10) 2px solid;
  border-radius: 5px;
  background-color: transparent;
}
.container .box .content .innerbox button {
  margin-left: 3px;
  border: 2px solid gray;
  border-radius: 5px;
  background-color: transparent;
}
.container .box .content .innerbox .item:hover {
  /* color: #efe5e5ed; */
  font-size: 18px;
  box-shadow:1px 3px 3px #76757a90 ;
  text-decoration: underline rgba(27, 25, 25, 0.556) .5px;
}
.container .box .content .innerbox .leftadd {
  font-size: 20px;
}
.container .box .content .innerbox .leftadd:hover {
  font-size: 25px !important;
}
.container .add::before,
.container .add::after {
  content: "";
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  z-index: 10000;
  /* filter: blur(1px);    */
  width: 100px;
  height: 10px;
  border-radius: 2px;
  background-color: #aca5a5;
}
.container .add::after {
  width: 10px;
  height: 100px;
  left: 50%;
  transform: translate(-50%);
  top: 41%;
}
.container .actbox .content:hover {
  background-color: rgba(255, 255, 255, 0.193);
}
.addpanel {
  position: fixed;
  left: 50%;
  top: 50%;
  padding-bottom: 20px;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 90vh;
  z-index: 10000000;
  overflow: hidden;
  overflow-y: auto;
  /* opacity: 0.9; */
  border: 1px solid rgb(0, 0, 0, 0.5);
  border-radius: 5px;
  background-color: white;
}
.addpanel .sure,
.addpanel .cancel {
  /* position: relative; */
  float: right;
  left: 20px;
  margin-bottom: 100px;
  margin-right: 20px;
  width: 100px;
  height: 50px;
  color: white;
  background-color: rgb(48, 89, 171);
  border: black solid 2px;
  border-radius: 25px;
}
.addpanel .sure {
  right: 130px;
}
.addpanel input {
  border-radius: 2px;
}
.addpanel .tittle {
  width: 400px;
  height: 30px;
  position: relative;
  line-height: 50px;
  font-size: 25px;
  color: rgb(19, 195, 235);
  margin: 20px 0 20px 60%;
  transform: translate(-50%);
}
.addpanel .inpbox {
  width: 100%;
 
  /* background-color: #fff; */
}
.addpanel .inpbox .sectit:nth-of-type(1) {
  margin-top: 10px;
}
.addpanel .inpbox .sectit {
  text-indent: 20px;
  color: rgb(0, 0, 0);
  font-size: 0.9em;
  user-select: none;
  /* font-weight:600; */
  background-color: #f4f2f7cc;
}
.addpanel .inpbox .thirdtit span {
  color: rgb(0, 0, 0);
  display: inline-block;
  font-size: 10px;
  width: 200px;
  cursor: pointer;
  text-indent: 35px;
  margin-right: 20px;
}
.addpanel .inpbox .thirdtit input {
  margin-left: 20px;
  font-size: 10px;
  height: 20px;
  border: 1px solid black;
  /* width: 10px; */
}
.addpanel .inpbox .thirdtit input[type='text']{
  width: 120px;
  margin-right: 3px;
}
.addpanel .inpbox .thirdtit input[type='file']{
  opacity: 0;
}
.addpanel .inpbox .thirdtit img {
  position: absolute;
  width: 23px;
  margin-left: 12%;
  z-index: -1;
  /* left: 50px; */
}
.addpanel .inpbox .thirdtit .tip{
  position: absolute;
  margin-left: 25%;
  z-index: -1;
}
.addpanel .inpbox .thirdtit {
  margin-top: 10px;
  height: 25px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 30%;
  
  max-width: 30%;
  border: 2px rgba(0, 0, 0, 0.751) solid;
  border-radius: 10px;
}
.addpanel .inpbox .thirdtit:nth-of-type(3n+1){
  margin-left: 0px;
}
.addpanel .inpbox .thirdtit{
  margin-left: 3px;
}
.addpanel .inpbox .thirdbox{
  width: 95%;
  margin-left: 10%;
  display: flex;
  flex-wrap: wrap;
  /* background-color: #fff; */
}
.addpanel .inpbox .thirdbox .thirdadd{
  height: 25px;
  color: rgb(66, 65, 65);
  text-align: center;
  font-size: 30px;
}
.addpanel .inpbox .thirdbox .thirdadd:hover,
.addpanel .inpbox .thirdtit:hover{
 box-shadow: 1px 3px  2px rgba(0, 0, 0, 0.285) ;
}
.addpanel .inpbox .thirdbox .delete{
  color: rgb(0, 0, 0);
  position: relative;
  top: -4px;
  right: 2px;
  cursor: pointer;
  user-select: none;
  transform: scale(.8);
}
</style>

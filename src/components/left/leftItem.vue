<template>
  <div>
    <div class="item_tittle" @click="clickItem">
      {{ itemDetail.tittle }}
      <span :class="{ actTriangle: itemDetail.curent }"></span>
    </div>
    <div class="child" v-if="itemDetail.curent">
      <ul>
        <li
          v-for="(child, index) in itemDetail.children"
          :class="{ activeItem: child.curent }"
          :key="'child' + index"
          @click="clickChild(index)"
        >
          {{ child.tittle }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    clickItem() {
      this.$emit("clickItem", this.index);
    },
    clickChild(index){
        this.$emit("clickChild",this.index,index);  //第一个为左侧一级菜单下表，第二个为二级菜单
        this.$bus.$emit('content_clickChild',this.index,index,this.parentId)
        
    }
  },
  mounted(){
    
  },
  props: {
    itemDetail: {
      require: true,
      type: Object,
    },
    parentId: {
      require: true,
      // type: String,
    },
    index: {
      require: true,
      type: Number,
    },
  },
};
</script>

<style scoped>
.item_tittle {
  height: 40px;
  line-height: 40px;
  text-indent: 20px;
  /* text-align: center; */
  font-size: .8em;
  font-weight: 400;
cursor: pointer;
  /* border: 1px red solid; */
}
.item_tittle:hover,
.activeItem {
  /* font-size: 20px; */
  /* font-weight: 600; */
  /* color: rgba(47, 255, 0, 0.734); */
  background-color: rgba(230, 238, 238, 0.903);
}
.activeItem {
  font-weight: 600;
}
.item_tittle span {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-left: 20px;
  border: 2px black solid;
  border-top: 2px transparent solid;
  border-left: 2px transparent solid;
  border-radius: 3px;
  transform: rotate(-45deg);
  transition: 0.2s;
}
.actTriangle {
  transform: rotate(45deg) !important;
}
.child {
  list-style: none;
  text-indent: 20%;
  font-size: .5em;
  cursor: pointer;
  /* font-weight: 600; */
  border-bottom: 1px black solid;
}
.child ul li {
  height: 23px;
}
.child ul li:hover {
  /* font-weight: 600; */
  background-color: rgba(230, 238, 238, 0.903);
}
</style>

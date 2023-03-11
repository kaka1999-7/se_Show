<template>
  <div >
    <div class="item_tittle" >
      {{itemDetail.tittle}}
      <span :class="{'active':itemDetail.curent}"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  mounted() {
    // console.log(this.itemDetail)
  },
  props:{
    itemDetail:{
      require:true,
      type:Object
    }
  }
}
</script>

<style scoped >
  .item_tittle{
    position: relative;
    padding: 3px  1px;
    color: rgb(0, 0, 0);
    font-size: .9em;
    font-weight: bold;
    border-radius: 5px;
    transition: .2s;
    cursor: pointer;
    /* border: 1px gray solid; */
  }
  .item_tittle:hover{
    transform: scale(1.1);
  }
  .active{
    position: absolute;
    left: 0px;
    bottom: -20px;
    /* display: block; */
    height: 5px;
    width: 100%;
    border-radius: 5px;
    background-color: rgba(58, 230, 15, 0.492);
  }
</style>>
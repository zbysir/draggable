<template>
  <div class="loop" >
    <!-- d-rect 判定上下的区域 -->
    <div class="item" data-d-rect>
      <!-- d-hand 手 -->
      <span class="hand" data-d-hand> + </span> {{data.i}}
    </div>

    <div class="child" :data-d-container="data.container!==false">
      <!-- d-route -->
      <!-- d-container, 只有父级开启了container才能拖动或者放入 -->
      <Tree v-for="(item, $index) in data.c"
            :data="item" :key="$index"
            :data-d-node="$index"
            :data-d-container="item.container!==false"></Tree>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Tree',
    props: {
      data: Object
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hand {
    display: inline-block;
    padding: 5px;
    cursor: move;
  }

  .loop {
    position: relative;
    /*margin-left: 40px;*/
    background: #fff;
  }

  .child {
    padding-left: 40px;
  }

  .item {
    padding: 20px;
    border: 1px saddlebrown solid;
  }

  [data-d-hand] {
    /*background: #42b983;*/
  }

  .loop:not([data-d-container]) {
    background: #d3938e;
  }


</style>

<style>
  .loop > .ph-tb > div {
    left: 40px;
  }
</style>
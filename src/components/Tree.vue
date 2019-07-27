<template>
    <div class="loop">
        <!-- d-rect 判定上下的区域 -->
        <div class="item" data-d-rect>
            <!-- d-hand 手 -->
            <span class="hand" data-d-hand> + </span> {{data.i}}
        </div>

        <div class="child">
            <!-- d-index -->
            <Tree v-for="(item, $index) in data.c"
                  :data="item" :key="$index"
                  :data-d-index="$index"
                  data-d-container></Tree>
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
        /*margin-left: 40px;*/
    }

    .child {
        padding-left: 40px;
    }

    .item {
        padding: 20px;
        border: 1px saddlebrown solid;
    }
</style>

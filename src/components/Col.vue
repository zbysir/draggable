<template>
    <div class="col">
        <!-- d-rect 判定上下的区域 -->
        <div class="item" data-d-rect>
            <!-- d-hand 手 -->
            <span class="hand" data-d-hand> + </span> {{data.i}}
        </div>

        <div class="child">
            <!-- d-route -->
            <div v-for="(item, $index) in data.c" class="row-item">
                <ECol v-if="item.t==='col'" :data="item" :key="$index" :data-d-node="$index" data-d-container>
                </ECol>
                <ERow v-if="item.t==='row'" :data="item" :key="$index" :data-d-node="$index">
                </ERow>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ECol',
        props: {
            data: Object
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .col {
        position: relative;
        /*min-height: 50px;*/
        background: rgba(255, 119, 101, 0.34);
        padding: 20px 0;
    }

    .hand {
        cursor: pointer;
        padding: 5px;
        display: inline-block;
    }
</style>

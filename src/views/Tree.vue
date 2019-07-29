<template>
  <div class="home">
    <Draggable :tree="data" @change="change">
      <Tree :data="data" data-d-node data-d-container></Tree>

      <template slot="ph-tb">
        <div class="ph-tb">
          <div></div>
        </div>
      </template>
      <template slot="ph-in">
        <div class="ph-in">
          <div></div>
        </div>
      </template>

    </Draggable>
  </div>
</template>

<script>
  import HelloWorld from '@/components/HelloWorld.vue'
  import Draggable from "../components/Draggable";
  import Tree from "../components/Tree";

  export default {
    name: 'home',
    components: {
      Draggable,
      HelloWorld,
      Tree
    },
    data() {
      return {
        data: {
          i: 'root',
          c: [
            {
              i: '0',
              c: [
                {i: '0-0'},
                {i: '0-1'},
              ]
            },
            {
              i: '1',
              container: false,
              c: [
                {
                  i: '1-0',
                  c: [
                    {
                      i: '1-0-0'
                    },
                    {
                      i: '1-0-1'
                    },
                  ]
                },
                {i: '1-1'},
              ]
            },
            {
              i: '2',
            },
            {
              i: '3',
            },
            {
              i: '4',
            },
          ],
        }
      }
    },
    methods: {
      change({from, to}) {
        console.log('form to', from, to)
        let t = Object.assign({}, this.data)
        let del = this.deleteByRoute(t, "c", from)
        if (!del) {
          console.error("bad route", this.data, from)
          return
        }
        this.addByRoute(t, "c", to, del)
        this.data = t
      },
      // 从data中删除route所指的元素, 并返回删除元素
      deleteByRoute(data, childKey, route) {
        let head = data[childKey]
        let n = route.length
        for (let i in route.slice(0, n - 1)) {
          let index = route[i].index
          if (head && head[index]) {
            head = head[index][childKey]
          }
        }

        if (head) {
          let delIndex = route[n - 1].index
          let del = head[delIndex]
          head.splice(delIndex, 1)
          return del
        }

        return null
      },
      addByRoute(data, childKey, route, item) {
        let head = data[childKey]
        let n = route.length
        for (let i in route.slice(0, n - 1)) {
          let index = route[i].index
          if (head && head[index]) {
            if (!head[index][childKey]) {
              this.$set(head[index], childKey, [])
              // head[index][childKey] = []
            }

            head = head[index][childKey]
          }
        }

        if (head) {
          let addIndex = route[n - 1].index
          if (addIndex === -1) {
            addIndex = head.length
          }
          // console.log(data)
          head.splice(addIndex, 0, item)
        }
      },

    }
  }
</script>
<style lang="scss">
  .ph-tb {
    /* 如果没有none 则会干扰mousemove事件 */
    pointer-events: none;
    display: block;
    height: 0px;
    width: 100%;
    position: relative;

    div {
      height: 4px;
      background: #597da0;
      position: absolute;
      right: 0;
      top: -2px;
      left: 0;
    }
  }
</style>
<template>
  <div class="home">
    <div>
      <Draggable :tree="data" @change="change" scope="d1">
        <ECol :data="data" data-d-node data-d-container></ECol>

        <Draggable :tree="data2" @change="change2" scope="d1" style="background-color: slategrey">
          <ECol :data="data2" data-d-node data-d-container></ECol>

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
      </Draggable>
    </div>
  </div>
</template>

<script>
  import Draggable from "../components/Draggable";
  import Tree from "../components/Tree";

  export default {
    name: 'home',
    components: {
      Draggable,
      Tree,
    },
    data() {
      return {
        data: {
          i: 'root',
          // col: 竖着排
          t: 'col',
          c: [
            {
              i: '0',
              // row: 横着排
              t: 'row',
              c: [
                {
                  i: '0-0', t: 'col',
                  c: [
                    {
                      i: '0-0-0',
                      t: 'row',
                    }
                  ]
                },
                {
                  i: '0-1', t: 'col',
                  c: [
                    {
                      i: '0-1-0',
                      t: 'row',
                    },
                    {
                      i: '0-1-1',
                      t: 'row',
                    }
                  ]
                },
              ]
            },
            {
              i: '1',
              t: 'row',
              c: [
                {i: '1-0', t: 'col'},
                {i: '1-1', t: 'col'},
              ]
            },
          ],
        },
        data2: {
          i: 'root',
          // col: 竖着排
          t: 'col',
          c: [
            {
              i: '0',
              // row: 横着排
              t: 'row',
              c: [
                {
                  i: '0-0', t: 'col',
                  c: [
                    {
                      i: '0-0-0',
                      t: 'row',
                    }
                  ]
                },
                {
                  i: '0-1', t: 'col',
                  c: [
                    {
                      i: '0-1-0',
                      t: 'row',
                    },
                    {
                      i: '0-1-1',
                      t: 'row',
                    }
                  ]
                },
              ]
            },
          ],
        }
      }
    },
    methods: {
      change({from, to}) {
        console.log('change1 form to', from, to)
        let t = Object.assign({}, this.data)
        let del = this.deleteByRoute(t, "c", from)
        if (!del) {
          console.error("bad route", this.data, from)
          return
        }
        this.addByRoute(t, "c", to, del)
        this.data = t
      },
      change2({from, to}) {
        console.log('change2 form to', from, to)
        let t = {...this.data2}
        let del = this.deleteByRoute(t, "c", from)
        if (!del) {
          console.error("bad route", this.data2, from)
          return
        }
        this.addByRoute(t, "c", to, del)
        this.data2 = t
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
          if (addIndex ===-1){
            addIndex = head.length
          }
          // console.log(data)
          head.splice(addIndex, 0, item)

          console.log(data)
        }
      },

    }
  }
</script>
<style scoped>

</style>
<template>
  <div class="hello" :class="{'in-move': isMove}">
    <slot></slot>

    <div style="display: none">
      <slot name="ph-tb">
        <div class="ph" ref="defaultPh">
          <div></div>
        </div>
      </slot>
      <slot name="ph-in">
        <div class="ph-in" ref="defaultPhIn">
          <div></div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Draggable',
    props: {
      msg: String
    },
    data() {
      return {
        isMove: false,
        // 开始移动的元素路由
        startRoute: [],
        lastRoute: [],
        startStatus: {
          // { index: , el, container: false }
          route: [],
        },
        lastStatus: {
          route: [],
          position: '', //in: 元素里面, top: 元素上面, bottom: 元素上面
        },
        ph: null,
      }
    },
    methods: {
      addPH(el, position) {
        let ph = null
        switch (position) {
          case 'bottom':
            if (this.$slots['ph-tb']) {
              ph = this.$slots['ph-tb'][0].elm
            } else {
              ph = this.$refs.defaultPh
            }
            this.insertAfter(ph, el)
            break
          case 'top':
            if (this.$slots['ph-tb']) {
              ph = this.$slots['ph-tb'][0].elm
            } else {
              ph = this.$refs.defaultPh
            }

            console.log('top', this.$slots, this.$refs)
            el.parentNode.insertBefore(ph, el)
            break
          case 'in':
            if (this.$slots['ph-in']) {
              ph = this.$slots['ph-in'][0].elm
            } else {
              ph = this.$refs.defaultPhIn
            }
            el.append(ph)
            break
        }

        this.ph = ph
      },
      removePH() {
        if (this.ph) {
          this.ph.remove()
        }
      },

      insertAfter(newElement, targetElement) {
        let parent = targetElement.parentNode;
        if (parent.lastChild === targetElement) {
          parent.appendChild(newElement);
        } else {
          parent.insertBefore(newElement, targetElement.nextSibling);
        }
      },
      equalLastStatus(a, b) {
        return this.equalRoute(a.route, b.route) && a.position === b.position
      },
      startWithRoute(a, b) {
        return a.map(i => i.index).join(",").startsWith(b.map(i => i.index).join(","))
      },
      equalRoute(a, b) {
        return a.map(i => i.index).join(",") === b.map(i => i.index).join(",")
      },
      mouseDown(e) {
        // 找到第一个draggable, 如果是自己才能响应.
        let firstDraggable = null
        for (let i in e.path) {
          let item = e.path[i]
          if (item._isDraggable) {
            firstDraggable = item
            break
          }
        }

        if (firstDraggable !== this.$el) {
          return
        }

        let target = e.target

        let find = false
        let route = []

        // 节点是否是容器
        // 只有d-route下的任何子节点(或者自己)有d-container属性, 则就是容器
        // <div data-d-node>
        //  <div data-d-container />
        // </div>
        let container = false
        while (true) {
          if (!target || target === document) {
            break
          }

          // 只有标记了d-hand属性的元素才能拖动
          if (target.dataset['dHand'] !== undefined) {
            find = true
          }

          if (find) {
            if (target.dataset['dContainer'] !== undefined) {
              container = true
            }

            // 只有标记了d-hand属性的元素才能拖动
            if (target.dataset['dNode'] !== undefined) {
              route.unshift({
                index: parseInt(target.dataset['dNode']),
                container: container,
                el: target,
              })

              container = false;
            }
          }

          target = target.parentNode
        }

        if (!find) {
          return
        }

        // 判断元素的父级是否是容器, 是容器才允许拖动
        if (!route[route.length - 2].container) {
          return;
        }

        this.isMove = true

        this.$el.addEventListener('mousemove', this.mouseMove)
        document.addEventListener('mouseup', this.mouseUp)

        this.startStatus.route = route
      },
      mouseMove(e) {
        // 找到第一个draggable, 如果是自己才能响应.
        let firstDraggable = null
        for (let i in e.path) {
          let item = e.path[i]
          if (item._isDraggable) {
            firstDraggable = item
            break
          }
        }

        if (firstDraggable !== this.$el) {
          return
        }

        let target = e.target
        let route = []
        let container = false
        let endParent = this.$el
        while (true) {
          if (!target || target === endParent) {
            break
          }

          if (target.dataset['dContainer'] !== undefined) {
            container = true
          }

          if (target.dataset['dNode'] !== undefined) {
            route.unshift({
              index: parseInt(target.dataset['dNode']),
              container: container,
              el: target,
            })

            container = false
          }

          target = target.parentNode
        }

        if (route.length === 0) {
          return
        }

        let canPos = {}

        let position = ''
        // 找到目标元素
        // 如果是子级则只能放在自己的下面, 而不能是子
        // console.log(route.join(".") ," ", this.startStatus.route.join('.'), this.startWithRoute(route, this.startStatus.route))
        if (this.startWithRoute(route, this.startStatus.route)) {
          route = route.slice(0, this.startStatus.route.length)
          canPos['bottom'] = 1
          // position = 'bottom'
        }

        // 放入逻辑:
        // 如果自己是容器, 则能放在里面 in
        // 如果自己的父容器是容器, 则能放在上下 top/bottom


        // placeholder附着的元素
        let phEl = null

        // 判断自己是否是容器, 如果是容器, 则可以放置到自己里面
        if (!canPos['bottom'] && route[route.length - 1].container) {
          canPos['in'] = 1

          phEl = route[route.length - 1].el

          // 判断父容器是否是容器

          if (route.length >= 2 && route[route.length - 2].container) {
            canPos['top'] = 1
            canPos['bottom'] = 1
          }
        } else {
          // 找到最近的父级是容器的元素
          // 只有父元素是容器才允许放置
          while (true) {
            if (route.length < 2) {
              return;
            }
            if (!route[route.length - 2].container) {
              route = route.slice(0, route.length - 1)
            } else {
              break
            }
          }

          phEl = route[route.length - 1].el
          canPos['top'] = 1
          canPos['bottom'] = 1
        }

        // console.log('c', Object.keys(canPos))

        if (Object.keys(canPos).length === 1) {
          position = Object.keys(canPos)[0]

          if (position === 'in') {
            route.push({
              index: -1, // -1表示放在最后
            })
          }
        } else {
          // 判断在上下

          // console.log('phEl', phEl)
          let rectEl = null
          if (phEl.dataset['dRect'] !== undefined) {
            rectEl = phEl
          } else {
            rectEl = phEl.querySelector("[data-d-rect]")
          }

          let rect = rectEl.getBoundingClientRect()
          let p = (e.y - rect.y) / rect.height

          if (p < 0.25 && canPos['top']) {
            position = 'top'
          } else if (p < 0.75 && canPos['in']) {
            position = 'in'

            // 需要添加一层路由, 标记是放在内部
            route.push({
              index: -1, // -1表示放在最后
            })
          } else if (canPos['bottom']) {
            position = 'bottom'
          }
        }

        if (position) {
          let lastStatus = {
            route: route,
            position,
          }

          if (!this.equalLastStatus(this.lastStatus, lastStatus)) {
            this.lastStatus = lastStatus

            this.removePH()
            this.addPH(phEl, lastStatus.position)
          } else {
          }
        }
      },
      mouseUp(e) {
        if (!this.isMove) {
          return
        }

        // 同一个元素, 就没必要传递事件
        let startRoute = this.startStatus.route
        let endNode = this.lastStatus.route

        if (endNode.length && !this.equalRoute(startRoute, endNode)) {
          // 如果是在下方 则加1
          if (this.lastStatus.position === "bottom") {
            endNode[endNode.length - 1].index += 1
          }

          // 如果有相同的父级, 当向下移动了from, 就会发生元素上移, 所以需要将to的index-1
          if (endNode.length >= startRoute.length) {
            if (this.equalRoute(startRoute.slice(0, startRoute.length - 1), endNode.slice(0, startRoute.length - 1))) {
              if (startRoute[startRoute.length - 1].index < endNode[startRoute.length - 1].index) {
                endNode[startRoute.length - 1].index -= 1
              }
            }
          }

          if (!this.equalRoute(startRoute, endNode)) {
            this.$emit('change', {
              from: startRoute.slice(1),
              to: endNode.slice(1),
            })
          }
        }

        this.isMove = false
        this.$el.removeEventListener('mousemove', this.mouseMove)
        document.removeEventListener('mouseup', this.mouseUp)
        this.lastStatus = {
          route: []
        }
        this.removePH()
      },
    },
    mounted() {
      this.$el.addEventListener('mousedown', this.mouseDown)
      this.$el._isDraggable = true
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .in-move {
    user-select: none;
  }
</style>
<style lang="scss">
  .ph {
    /* 如果没有none 则会干扰mousemove事件 */
    pointer-events: none;
    display: block;
    height: 0px;
    width: 100%;
    position: relative;

    div {
      height: 4px;
      background: #4a6784;
      position: absolute;
      right: 0;
      top: -2px;
      left: 0;
    }
  }

  .ph-in {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    background-color: rgba(139, 69, 19, 0.51);
  }
</style>

<template>
    <div class="hello" :class="{'in-move': isMove}">
        <slot></slot>
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
                let p = document.createElement("div");
                p.classList.add('ph')
                p.appendChild(document.createElement("div"))

                switch (position) {
                    case 'bottom':
                        this.insertAfter(p, el)
                        break
                    case 'top':
                        el.parentNode.insertBefore(p, el)
                        break
                }

                this.ph = p
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
                let target = e.target

                let find = false
                let route = []

                while (true) {
                    if (!target || target === document) {
                        break
                    }

                    // 只有标记了d-hand属性的元素才能拖动
                    if (target.dataset['dHand'] !== undefined) {
                        find = true
                    }

                    if (find) {
                        // 只有标记了d-hand属性的元素才能拖动
                        if (target.dataset['dRoute'] !== undefined) {
                            route.unshift({
                                index: parseInt(target.dataset['dRoute']),
                                container: target.dataset['dContainer'] !== undefined,
                                el: target,
                            })
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

                window.addEventListener('mousemove', this.mouseMove)

                this.startStatus.route = route
            },
            mouseMove(e) {
                let target = e.target
                let route = []
                while (true) {
                    if (!target || target === document) {
                        break
                    }

                    if (target.dataset['dRoute'] !== undefined) {
                        route.unshift({
                            index: parseInt(target.dataset['dRoute']),
                            container: target.dataset['dContainer'] !== undefined,
                            el: target,
                        })

                    }

                    target = target.parentNode
                }

                if (route.length === 0) {
                    return
                }

                let position = ''
                // 找到目标元素
                // 如果是子级则只能放在自己的下面, 而不能是子
                // console.log(route.join(".") ," ", this.startStatus.route.join('.'), this.startWithRoute(route, this.startStatus.route))
                if (this.startWithRoute(route, this.startStatus.route)) {
                    route = route.slice(0, this.startStatus.route.length)
                    position = 'bottom'
                }

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

                // 元素
                let el = route[route.length - 1].el

                // 判断在上下
                let rectEl = null
                if (el.dataset['dRect'] !== null) {
                    rectEl = el
                } else {
                    rectEl = el.querySelector("[data-d-rect]")
                }

                let rect = rectEl.getBoundingClientRect()
                let m = rect.y + rect.height / 2
                if (e.y > m) {
                    position = 'bottom'
                } else {
                    position = 'top'
                }
                // console.log(el)
                let lastStatus = {
                    route: route,
                    position,
                }

                if (position) {
                    if (!this.equalLastStatus(this.lastStatus, lastStatus)) {
                        this.lastStatus = lastStatus

                        this.removePH()
                        this.addPH(el, lastStatus.position)
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
                let endRoute = this.lastStatus.route

                if (endRoute.length && !this.equalRoute(startRoute, endRoute)) {
                    // 如果是在下方 则加1
                    if (this.lastStatus.position === "bottom") {
                        endRoute[endRoute.length - 1].index += 1
                    }

                    // 如果有相同的父级, 当向下移动了from, 就会发生元素上移, 所以需要将to的index-1
                    if (endRoute.length >= startRoute.length) {
                        if (this.equalRoute(startRoute.slice(0, startRoute.length - 1), endRoute.slice(0, startRoute.length - 1))) {
                            if (startRoute[startRoute.length - 1].index < endRoute[startRoute.length - 1].index) {
                                endRoute[startRoute.length - 1].index -= 1
                            }
                        }
                    }

                    if (!this.equalRoute(startRoute, endRoute)) {
                        this.$emit('change', {
                            from: startRoute.slice(1),
                            to: endRoute.slice(1),
                        })
                    }
                }

                this.isMove = false
                window.removeEventListener('mousemove', this.mouseMove)
                this.lastStatus = {
                    route: []
                }
                this.removePH()
            },
        }
        ,
        mounted() {
            window.addEventListener('mousedown', this.mouseDown)
            window.addEventListener('mouseup', this.mouseUp)
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
            background: #2c3e50;
            position: absolute;
            width: 100%;
            top: -2px;
            left: 0;
        }
    }
</style>
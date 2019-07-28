<template>
    <div class="home">
        <Draggable :tree="data" @change="change">
            <ECol :data="data" data-d-route data-d-container></ECol>
        </Draggable>
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
                        {
                            i: '2',
                            t: 'row',
                        },
                        {
                            i: '3',
                            t: 'row',
                        },
                        {
                            i: '4',
                            t: 'row',
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
                    head = head.splice(delIndex, 1)
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
                        head = head[index][childKey]
                    }
                }

                if (head) {
                    let delIndex = route[n - 1].index
                    head = head.splice(delIndex, 0, item)
                }
            },

        }
    }
</script>

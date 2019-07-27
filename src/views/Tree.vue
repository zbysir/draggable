<template>
    <div class="home">
        <Draggable :tree="data" @change="change">
            <Tree :data="data"></Tree>
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
                            c: [
                                {i: '1-0'},
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
                for (let index in route.slice(0, n - 1)) {
                    let r = route[index]
                    if (head && head[r]) {
                        head = head[r][childKey]
                    }
                }

                if (head) {
                    let delIndex = route[n - 1]
                    let del = head[route[n - 1]]
                    head = head.splice(delIndex, 1)
                    return del
                }

                return null
            },

            addByRoute(data, childKey, route, item) {
                let head = data[childKey]
                let n = route.length
                for (let index in route.slice(0, n - 1)) {
                    let r = route[index]
                    if (head && head[r]) {
                        head = head[r][childKey]
                    }
                }

                if (head) {
                    let delIndex = route[n - 1]
                    head = head.splice(delIndex, 0, item)
                }
            },

        }
    }
</script>

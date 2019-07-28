# draggable

节点: 可以拖动的元素称之为节点.

组件有4个指令

### data-d-container
只有容器下面的节点才能被拖动

这样写就会生效
```
<div data-d-container>
```

### data-d-route
标记是可拖动的节点, 支持嵌套

值为在第几个元素

如
```
<Tree v-for="(item, $index) in child"
      :key="$index"
      :data="item"
      :data-d-route="$index"
      data-d-container></Tree>
```

### data-d-hand
手柄, 只能点击并拖动手柄才能拖动节点.

```
<div data-d-hand>
```

### data-d-rect
拖动到元素的上方还是下方的判定区域

## TODO
- 尚不支持拖拽成为子级.

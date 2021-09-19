# vue源码解析--尚硅谷

教学视频 https://www.bilibili.com/video/BV1v5411H7gZ

snabbdom是著名的虚拟DOM库, 是diff算法的鼻祖, Vue源码借鉴了snabbdom,  官方git 

https://github.com/snabbdom/snabbdom

在git上snabbdom源码是用Typsscript写的,git上并不是编译好的js

版本,如果要直接使用build出来的js版本的snabbdom库,可以从npm上下载  `npm i -S snabbdom` 

snabbdom 库是DOM库,不能再nodejs环境运行,需要webpack和webpack-dev-server开发环境, <strong>必须安装webpack@5</strong>  `npm i -D webpack@5 webpack-cli@3 webpack-dev-server@3`

webpack.config.js 安装官网配置

```js
const path = require("path");

module.exports = {
  // 入口
  entry: "./src/index.js",
  // 出口
  output: {
    // 虚拟打包路径,就是说文件夹不会真正生成,二十在8080端口虚拟生成
    publicPath: "xuni", // path.resolve(__dirname, "dist"),
    // 打包出来的文件名  
    filename: "bundle.js",
  },
  devServer: {
    port: 8080,
    // 静态资源文件夹
    contentBase: "www",
    hot: true,
  },
};

```



![image-20210913192943464](.\img\虚拟DOM-1.png)

diff 是发生在细腻DOM上的

新虚拟DOM和老虚拟DOM进行diff(精细化比较), 算出应该如何最小量更新, 最后反映到真正的DOM上

## 研究方向

1. 虚拟DOM如何被渲染函数(h函数)产生
2. diff算法原理
3. 虚拟DOM如何通过diff变为真正的DOM的(事实上, 虚拟DOM便会真正的DOM, 是涵盖在地方放算法里面的)

## h函数用来产生 虚拟节点(vnode)

```js
// 比如这样调用h函数
h('a',{props:{href:'https://www.baidu.com'}},'百度')

// 将得到的虚拟节点
{'sel':'a','data':{props:{href:'https://www.baidu.coom'}},'text':'百度'}

表示真正的DOM节点
<a href="https://www.baidu.com">百度</baidu>
```

index.js 文件内容

```js
import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from "snabbdom";

// 创建patch函数
const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);

// 创建虚拟节点
var myVnode1 = h(
  "a",
  { props: { href: "https://www.baidu.com", target: "_blank" } },
  "百度"
);
console.log(myVnode1);

const vNode3 = h("ul", [
  h("li", "one"),
  h("li", [
    h("div", "1 第一个子元素"),
    h("p", "2 第二个子元素"),
    h("strong", "都要放在数组里"),
    h("hr"),
  ]),
  h("li", h("span", "只有一个子元素,可不用数组")),
]);
console.log(vNode3);
// 让虚拟节点上树
const container = document.querySelector("#container");
// patch(container, myVnode1);
patch(container, vNode3);
```

## 手写h函数(简写)

vnode.js

```js
// 函数的功能非常简单, 就是把传入的参数组合成对象再返回去
export default function (sel, data, children, text, elm, key) {
  return { sel, data, children, text, elm, key };
}
```

h.js

```js
import vnode from "./vnode.js";

// 编写一个低配版本的h函数, 这个函数必修接收3个参数
// 形态1 h('div',{},'文字')
// 形态2 h('div',{},[])
// 形态3 h('div',{},h())

export default function (sel, data, c) {
  // 查看参数数量是否为3
  if (arguments.length != 3) throw new Error("参数过少");
  // 判断参数c的类型
  if (typeof c === "string" || typeof c === "number") {
    return vnode(sel, data, undefined, c, undefined, undefined);
  } else if (Array.isArray(c)) {
    const children = [];
    c.forEach((item) => {
      if (
        typeof item !== "object" ||
        (typeof item === "object" && !item.hasOwnProperty("sel"))
      ) {
        throw new Error("数组中有不满足是对象的项");
      }
      children.push(item);
    });
    return vnode(sel, data, children, undefined, undefined, undefined);
  } else if (typeof c === "object" && c.hasOwnProperty("sel")) {
    const children = [c];
    return vnode(sel, data, children, undefined, undefined, undefined);
  }
}
```

## diff算法心得

1. key很重要,key是这个节点的唯一标识,告诉diff算法,在更新前后他们是同一个DOM节点
2. 只有是同一个虚拟节点,才进行精细化比较,否则就暴力删除旧的,插入新的
   - 延伸问题: 如何定义是同一个虚拟节点? 答: 选择器相同且key相同
3. 只进行同层比较,不会进行跨层比较



element.insertAdjacentHTML(position, text);

position 是相对于 element 元素的位置，并且只能是以下的字符串之一：

beforebegin：在 element 元素的前面。

afterbegin：在 element 元素的第一个子节点前面。

beforeend：在 element 元素的最后一个子节点后面。

afterend：在 element 元素的后面。

text 是字符串，会被解析成 HTML 或 XML，并插入到 DOM 树中。 




















































































































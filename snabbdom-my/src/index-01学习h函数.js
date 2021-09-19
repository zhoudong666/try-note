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

// const patch = init([
//   // Init patch function with chosen modules
//   classModule, // makes it easy to toggle classes
//   propsModule, // for setting properties on DOM elements
//   styleModule, // handles styling on elements with support for animations
//   eventListenersModule, // attaches event listeners
// ]);

// const container = document.getElementById("container");

// const vnode = h("div#container.two.classes", { on: { click: () => {} } }, [
//   h("span", { style: { fontWeight: "bold" } }, "This is bold"),
//   " and this is just normal text",
//   h("a", { props: { href: "/foo" } }, "I'll take you places!"),
// ]);
// // Patch into empty DOM element – this modifies the DOM as a side effect
// patch(container, vnode);

// const newVnode = h("div#container.two.classes", { on: { click: () => {} } }, [
//   h(
//     "span",
//     { style: { fontWeight: "normal", fontStyle: "italic" } },
//     "This is now italic type"
//   ),
//   " and this is still just normal text",
//   h("a", { props: { href: "/bar" } }, "I'll take you places!"),
// ]);
// // Second `patch` invocation
// patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state

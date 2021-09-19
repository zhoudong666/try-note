import h from "./my-snabbdom/h.js";
import patch from "./my-snabbdom/patch.js";

// console.log(h("div", {}, "text 这是"));
// console.log(h("ul", {}, [h("li", {}, "li-111"), h("li", {}, "li-222")]));
// console.log(h("div", {}, h("span", {}, "span")));

const container = document.querySelector("#container");
// const vnode1 = h("h1", {}, "hi~ i am h1");
const vnode1 = h("ul", {}, [
  h("li", { key: "a" }, "aaa1"),
  h("li", { key: "b" }, "bbb1"),
  h("li", { key: "c" }, "ccc1"),
]);

patch(container, vnode1);
var num = 1;
document.querySelector("#btn").onclick = function () {
  num++;
  // const vnode2 = h("h1", {}, "hi~ i am h" + num);
  // const vnode2 = h("h1", {}, [h("span", {}, "abc")]);
  const vnode2 = h("ul", {}, [
    h("li", { key: "f" }, "fff2"),
    h("li", { key: "b" }, "bbb1"),
    h("li", { key: "a" }, "aaa2"),
    h("li", { key: "c" }, "ccc2"),
    h("li", { key: "d" }, "ddd2"),
    h("li", { key: "g" }, "ggg2"),
  ]);
  patch(vnode1, vnode2);
};
